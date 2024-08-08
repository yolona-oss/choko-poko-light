export type JwtPayload = {
    email: string
    id: string
    isAdmin: boolean // secure check
    // ip?
}
