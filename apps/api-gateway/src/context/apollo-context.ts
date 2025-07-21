export interface GraphQLContext {
    user?: {
        id: string;
        email: string;
        role: string;
    };
    req: any;
    reply: any;
}
