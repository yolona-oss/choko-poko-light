import { UserObjectResponseDto } from "./../../users/dto/user-object-response.dto"

export interface AuthResponseDto {
    readonly access_token: string
    readonly refresh_token: string
    readonly user: UserObjectResponseDto
}

export function AuthResponseUserTransform(user: any) {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        roles: user.roles,
    }
}
