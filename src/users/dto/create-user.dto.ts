import { Role } from "./../../common/enums/role.enum"

export interface CreateUserDto {
    readonly name: string
    readonly phone: string
    readonly email: string
    readonly password: string
    readonly images?: string[]
}
