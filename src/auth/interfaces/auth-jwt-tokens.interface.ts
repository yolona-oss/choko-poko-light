import { IAccessToken } from "./access-token.interface";
import { IRefreshToken } from "./refresh-token.interface";

interface _AuthJwtTokens extends IAccessToken, IRefreshToken { }

export type AuthJwtTokens = Readonly<_AuthJwtTokens>
