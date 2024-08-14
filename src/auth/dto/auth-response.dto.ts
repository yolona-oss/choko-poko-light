import { UserObjectResponseDto } from "src/users/dto/user-object-response.dto"
import { UserDocument } from "src/users/user.schema"

export interface AuthResponseDto {
    readonly access_token: string
    readonly refresh_token: string
    readonly user: UserObjectResponseDto
}

export function AuthResponseUserTransform(user: UserDocument) {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        roles: user.roles,
    }
}
