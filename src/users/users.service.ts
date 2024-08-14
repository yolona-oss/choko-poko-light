import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserDocument } from './user.schema';
import { CRUDService } from './../internal/crud-service';
import { AppError } from './../internal/error/AppError';
import { AppErrorTypeEnum } from './../internal/error/AppErrorTypeEnum';
import { Crypto } from './../internal/utils'
import { CreateUserDTO } from './dto/CreateUserDTO';
import { DEFAULT_USER_PROFILE_IMAGE, MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH } from './../common/constants';

import { Role } from './../common/enums/role.enum';

@Injectable()
export class UsersService extends CRUDService<UserDocument> {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<UserDocument>
    ) {
        super(usersModel)
    }

    async getEntityByPhone(phone: string) {
        return await super.findOne({ phone: phone })
    }

    async getEntityByEmail(email: string) {
        return await super.findOne({ email: email })
    }

    override async createDocument(userData: CreateUserDTO) {
        const isDuplicate = await this.getEntityByEmail(userData.email)
        const isPhoneDuplicate = await this.getEntityByPhone(userData.phone)
        if (isDuplicate || isPhoneDuplicate) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_EXISTS,
                               {errorMessage: "User exists", userMessage: "User exists"})
        }

        if (userData.password.length < MIN_USER_PASSWORD_LENGTH) {
            throw new AppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH, {
                errorMessage: "Insufficient user password length. Must be at least 8 characters.",
                userMessage: "Insufficient user password length. Must be at least 8 characters."
            })
        } else if (userData.password.length >= MAX_USER_PASSWORD_LENGTH) {
            throw new AppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH, {
                errorMessage: "Insufficient user password length. Must be less than 64 characters.",
                userMessage: "Insufficient user password length. Must be less than 64 characters."
            })
        }

        const passwordHash = Crypto.createPasswordHash(userData.password)
        return super.createDocument(
            {
                ...userData,
                password: passwordHash,
                roles: <string[]>([Role.User]),
                images: userData.images || [DEFAULT_USER_PROFILE_IMAGE]
            }
        )
    }

    async removeUserById(id: string) {
        return await super.removeDocumentById(id)
    }

    async updateDocumentByIdSafe(id: string, newUserInfo: Partial<UserEntity>, currentPassword?: string) {
        if (Object.keys(newUserInfo).length == 0) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE)
        }

        if (newUserInfo.roles?.includes(Role.Admin)) {
            throw new UnauthorizedException("Cannot update admin status.")
        }

        const existsUser = await this.getDocumentById(id)

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

        return await super.updateDocumentById(id, newUserInfo)
    }

    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<UserEntity> {
        return await this.updateDocumentByIdSafe(id, { password: newPassword }, currentPassword)
    }

    async addRole(id: string, role: Role) {
        const currentRoles = (await this.getDocumentById(id)).roles

        if (currentRoles.includes(role)) {
            throw new AppError(AppErrorTypeEnum.ROLE_ALREADY_PROVIDED)
        }

        return await this.updateDocumentByIdSafe(
            id,
            { roles: [...currentRoles, role] }
        )
    }

    async removeRole(id: string, role: Role) {
        const currentRoles = (await this.getDocumentById(id)).roles

        if (!currentRoles.includes(role)) {
            throw new AppError(AppErrorTypeEnum.ROLE_NOT_PROVIDED)
        }
    }

    /***
     * @deprecated Use UsersService::updateDocumentByIdSafe instead
     */
    async updateDocumentById(id: string, newData: Partial<UserDocument>) {
        throw new Error("Use UsersService::updateDocumentByIdSafe instead")
        return super.updateDocumentById(id, newData)
    }

    async __createDefaultAdmin(user: CreateUserDTO) {
        const defaultUser = await this.getEntityByEmail(user.email)
        if (!defaultUser) {
            try {
                await this.usersModel.create({
                    ...user,
                    password: Crypto.createPasswordHash(user.password),
                    roles: [Role.Admin]
                })
            } catch (e) {
                console.error(e)
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                    errorMessage: "Cannot create default admin",
                    userMessage: "Cannot create default admin"
                })
            }
        }
    }
}
