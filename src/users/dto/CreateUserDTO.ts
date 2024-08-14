import { Role } from "./../../common/enums/role.enum"

export interface CreateUserDTO {
    readonly name: string
    readonly phone: string
    readonly email: string
    readonly password: string
    readonly images?: string[]
}
