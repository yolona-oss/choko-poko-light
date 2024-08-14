import { Role } from './../../common/enums/role.enum';

export type JwtPayload = {
    email: string
    id: string
    roles: Role[]
    // ip?
}
