import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    // console.log({ data });
    const req = context.switchToHttp().getRequest();

    return !data ? req.rawHeaders : req.rawHeaders[data];
  },
);
