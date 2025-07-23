export interface JwtPayload {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    phone?: string | null;
    isPhoneVerified: boolean;
    roles: string[];
    iat?: number;
    exp?: number;
}

export interface GoogleUserInfo {
    sub: string; // Google ID
    email: string;
    given_name: string;
    family_name: string;
    picture?: string;
    email_verified: boolean;
}

export interface UserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    phone?: string | null;
    isPhoneVerified: boolean;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}

// GraphQL representation with string dates
export interface UserGraphQLModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    phone?: string | null;
    isPhoneVerified: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

export interface AuthPayloadModel {
    user: UserGraphQLModel;
    accessToken: string;
    refreshToken: string;
}

export interface AuthContext {
    userId?: string;
    user?: UserModel;
}
