import { Role } from './../../common/enums/role.enum';

export interface UserObjectResponseDto {
    id: string
    name: string
    phone: string
    email: string
    roles: string[]
}
