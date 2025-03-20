import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const GetUser = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        // console.log({ data });
        const  req = context.switchToHttp().getRequest();
        const user = req.user;

        if(!user)
            throw new InternalServerErrorException('Usuario no encontrado (request)');

        return !data? user: user[data];
    }
);