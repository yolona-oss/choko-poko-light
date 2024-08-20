import { AuthJwtTokens } from "auth/interfaces/auth-jwt-tokens.interface"
import { UserObjectResponseDto } from "./../../users/dto/user-object-response.dto"

export interface AuthResponseDto extends AuthJwtTokens {
    readonly user: UserObjectResponseDto
}

export function TransformUser(user: any) {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        roles: user.roles,
    }
}
