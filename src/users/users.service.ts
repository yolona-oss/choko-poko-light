import { Model } from 'mongoose';
import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserDocument } from './user.schema';
import { CRUDService } from './../internal/crud-service';
import { AppError } from './../internal/error/AppError';
import { AppErrorTypeEnum } from './../internal/error/AppErrorTypeEnum';
import { Document } from 'mongoose'
import { Crypto } from './../internal/utils'

@Injectable()
export class UsersService extends CRUDService<UserDocument> {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<UserDocument>
    ) {
        super(usersModel)
    }

    async getNotAdminEntities() {
        // TODO create CRUDService method
        return await this.usersModel.find({ isAdmin: false })
    }

    async getEntityByPhone(phone: string) {
        return await super.findOne({ phone: phone })
    }

    async getEntityByEmail(email: string) {
        return await super.findOne({ email: email })
    }

    override async createDocument(userInfo: Omit<UserDocument, keyof Document>) {
        const isDuplicate = await this.getEntityByEmail(userInfo.email)
        const isPhoneDuplicate = await this.getEntityByPhone(userInfo.phone)
        if (isDuplicate || isPhoneDuplicate) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_EXISTS, {errorMessage: "User exists", userMessage: "User exists"})
        }

        userInfo.isAdmin = false
        return super.createDocument(userInfo)
    }

    async removeUserById(id: string) {
        return await super.removeDocumentById(id)
    }

    async updateDocumentByIdSafe(id: string, newUserInfo: Partial<UserEntity>, currentPassword?: string) {
        if (Object.keys(newUserInfo).length == 0) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE)
        }

        if (newUserInfo.isAdmin && newUserInfo.isAdmin == true) {
            throw new UnauthorizedException("Cannot promote to admin")
        }

        const existsUser = await this.getDocumentById(id)
        if (!existsUser) {
            throw "User dont exists"
        }


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

        const updated = await super.updateDocumentById(id, newUserInfo)
        if (!updated) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }

        return updated
    }

    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<UserEntity> {
        return await this.updateDocumentByIdSafe(id, { password: newPassword }, currentPassword)
    }

    /***
     * @deprecated Use UsersService::updateDocumentByIdSafe instead
     */
    async updateDocumentById(id: string, newData: Partial<UserDocument>) {
        throw new Error("Use UsersService::updateDocumentByIdSafe instead")
        return super.updateDocumentById(id, newData)
    }
}
