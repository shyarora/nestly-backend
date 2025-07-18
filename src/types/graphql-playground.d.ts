// Type declarations for graphql-playground-middleware-express
declare module "graphql-playground-middleware-express" {
    import { Request, Response } from "express";

    interface PlaygroundOptions {
        endpoint?: string;
        settings?: Record<string, any>;
    }

    function expressPlayground(options: PlaygroundOptions): (req: Request, res: Response) => void;

    export = expressPlayground;
    export default expressPlayground;
}
