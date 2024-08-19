import mongoose, { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity, UserDocument } from './schemas/user.schema';

import { AppError, AppErrorTypeEnum } from './../common/app-error';
import { DeepPartial } from './../common/types/deep-partial.type';
import { Crypto } from './../common/misc/utils'

import {
    MIN_USER_PASSWORD_LENGTH,
    MAX_USER_PASSWORD_LENGTH,
    MIN_USER_PASSWORD_ENTROPY
} from './../common/constants';

import { Role } from './../common/enums/role.enum';
import { WishlistService } from '../market/wishlist/wishlist.service';
import { CartService } from '../market/cart/cart.service';
import { OrdersService } from '../market/orders/orders.service';
import { ImageUploadService } from './../image-upload/image-upload.service';
import { ImagesEntity } from './../image-upload/schemas/image-upload.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Writeable } from './../common/types/writable.type';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<UserDocument>,
        private readonly wishlistService: WishlistService,
        private readonly cartService: CartService,
        private readonly ordersService: OrdersService,
        private readonly imagesService: ImageUploadService
    ) { }

    async findByPhone(phone: string) {
        const userDoc = await this.usersModel.findOne({ phone: phone })
        if (!userDoc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return userDoc
    }

    async findByEmail(email: string) {
        const userDoc = await this.usersModel.findOne({ email: email })
        if (!userDoc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        return userDoc
    }

    async findById(id: string) {
        const userDoc = await this.usersModel.findById(id)
        if (!userDoc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return userDoc
    }

    async findAll() {
        return await this.usersModel.find()
    }

    async count() {
        const count = await this.usersModel.countDocuments()
        return count
    }

    async create(userData: CreateUserDto) {
        const isDuplicate = await this.findByEmail(userData.email)
        const isPhoneDuplicate = await this.findByPhone(userData.phone)
        if (isDuplicate || isPhoneDuplicate) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_EXISTS,
                {errorMessage: "User exists", userMessage: "User exists"})
        }

        this.checkPasswordStrenth(userData.password)

        const passwordHash = Crypto.createPasswordHash(userData.password)
        const initUser = await this.usersModel.create(
            {
                ...userData,
                password: passwordHash,
                roles: <string[]>([Role.User]),
                images: userData.images || [ (await this.imagesService.findBlank("User")).id ],
                orders: []
            }
        )

        const pre = await this.preCreate(initUser.id)

        const res = await this.usersModel.findByIdAndUpdate(initUser.id, {
            $set: {
                wishlist: pre.wishlist,
                cart: pre.cart
            }
        }, {new: true}).populate<{images: ImagesEntity[]}>('images')

        if (!res) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }

        return res
    }

    async remove(id: string) {
        await this.preRemove(id)
        return await this.usersModel.findByIdAndDelete(id)
    }

    async updateSafe(id: string, _newUserInfo: DeepPartial<UpdateUserDto>, currentPassword?: string) {
        let newUserInfo: DeepPartial<Writeable<UpdateUserDto>> = _newUserInfo
        if (Object.keys(newUserInfo).length == 0) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE)
        }

        if (newUserInfo.roles?.includes(Role.Admin)) {
            throw new UnauthorizedException("Cannot update admin status.")
        }

        const existsUser = await this.findById(id)

        if (currentPassword) {
            if (!Crypto.comparePasswords(currentPassword, existsUser.password)) {
                throw new UnauthorizedException("Cannot update without passing user password")
            }
        }

        if (newUserInfo.password) {
            if (currentPassword && (currentPassword !== newUserInfo.password)) {
                newUserInfo.password = Crypto.createPasswordHash(newUserInfo.password)
            }
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, {
                errorMessage: 'Cannot update user password without passing an exiting or current and passed passwords not match',
                userMessage: 'Cannot update user password without passing an exiting or current and passed passwords not match'
            })
        }

        const updated = await this.usersModel.findByIdAndUpdate(id, newUserInfo, {new: true})

        if (!updated) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }

        return updated
    }

    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<UserEntity> {
        return await this.updateSafe(id,
            { password: newPassword },
            currentPassword)
    }

    async addRole(id: string, role: Role) {
        const currentRoles = (await this.findById(id)).roles

        if (currentRoles.includes(role)) {
            throw new AppError(AppErrorTypeEnum.ROLE_ALREADY_PROVIDED)
        }

        return await this.updateSafe(
            id,
            { roles: [...currentRoles, role] }
        )
    }

    async removeRole(id: string, role: Role) {
        const currentRoles = (await this.findById(id)).roles

        if (!currentRoles.includes(role)) {
            throw new AppError(AppErrorTypeEnum.ROLE_NOT_PROVIDED)
        }
    }

    async __createDefaultAdmin(user: CreateUserDto) {
        const defaultUser = await this.findByEmail(user.email)
        if (!defaultUser) {
            try {
                const initUser = await this.usersModel.create({
                    ...user,
                    password: Crypto.createPasswordHash(user.password),
                    roles: [Role.Admin]
                })
                const pre = await this.preCreate(initUser.id)

                await this.usersModel.findByIdAndUpdate(initUser.id, {
                    $set: {
                        wishlist: pre.wishlist,
                        cart: pre.cart
                    }
                }, {new: true})
            } catch (e) {
                console.error(e)
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                    errorMessage: "Cannot create default admin",
                    userMessage: "Cannot create default admin"
                })
            }
        }
    }

    private checkPasswordStrenth(password: string) {
        if (password.length < MIN_USER_PASSWORD_LENGTH) {
            throw new AppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH, {
                errorMessage: "Insufficient user password length. Must be at least " + MIN_USER_PASSWORD_LENGTH + " characters.",
                userMessage: "Insufficient user password length. Must be at least " + MIN_USER_PASSWORD_LENGTH + " characters.",
            })
        } else if (password.length >= MAX_USER_PASSWORD_LENGTH) {
            throw new AppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH, {
                errorMessage: "Insufficient user password length. Must be less than " + MAX_USER_PASSWORD_LENGTH + " characters.",
                userMessage: "Insufficient user password length. Must be less than " + MAX_USER_PASSWORD_LENGTH + " characters.",
            })
        } else if (Crypto.calculateEntropy(password).entropy < MIN_USER_PASSWORD_ENTROPY) {
            throw new AppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_ENTROPY, {
                errorMessage: "Insufficient user password entropy. Must be at least " + MIN_USER_PASSWORD_ENTROPY + " bits.",
                userMessage: "Insufficient user password entropy. Must be at least " + MIN_USER_PASSWORD_ENTROPY + " bits.",
            })
        }
    }

    private async preCreate(id: string) {
        const cartId = String((await this._createCart(id)).id)
        const wishlistId = String((await this._createWishlist(id)).id)
        return {
            cart: new mongoose.Types.ObjectId(cartId),
            wishlist: new mongoose.Types.ObjectId(wishlistId),
        }
    }

    private async preRemove(id: string) {
        await this._removeCart(id)
        await this._removeWishlist(id)
        await this._removeOrders(id)
    }

    private async _createWishlist(id: string) {
        return await this.wishlistService.create(id, [])
    }

    private async _createCart(id: string) {
        return await this.cartService.create(id, [])
    }

    private async _removeWishlist(id: string) {
        return await this.wishlistService.removeUserWishlist(id)
    }

    private async _removeCart(id: string) {
        return await this.cartService.removeUserCart(id)
    }

    private async _removeOrders(id: string) {
        return await this.ordersService.removeUserOrders(id)
    }
}
