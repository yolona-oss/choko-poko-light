import { Role } from './../../common/enums/role.enum';

export type IJwtPayload = {
    email: string
    id: string
    roles: Role[]
    // ip?
}
