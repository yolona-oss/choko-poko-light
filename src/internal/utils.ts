import * as crypto from 'crypto';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// TODO maybe URL
export function extractFileName(filePath: string) {
    const urlArr = filePath.split('/')
    const fullName = urlArr[urlArr.length - 1]
    return fullName.split('.')[0]
}

export namespace Crypto {
    export function createPasswordHash(password: string) {
        return crypto.createHmac('sha256', password).digest('hex')
    }

    // compare plain-text password and hash
    export function  comparePasswords(password: string, hash: string) {
        return createPasswordHash(password) == hash
    }
}

export const generateRandom = () => Math.random().toString(36).substring(2, 15)
