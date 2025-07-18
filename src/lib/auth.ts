import { AuthChecker } from "type-graphql";
import { Context } from "./context";

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    const { user } = context;

    // Check if user is authenticated
    if (!user) {
        return false;
    }

    // If no specific roles are required, just check authentication
    if (roles.length === 0) {
        return true;
    }

    // Check specific roles
    if (roles.includes("HOST") && !user.isHost) {
        return false;
    }

    if (roles.includes("VERIFIED") && !user.isVerified) {
        return false;
    }

    return true;
};
