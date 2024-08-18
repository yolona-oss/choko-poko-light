export interface UpdateUserDto {
    readonly name: string
    readonly phone: string
    readonly email: string
    readonly password: string
    readonly images: string[]
    readonly roles: string[]
}
