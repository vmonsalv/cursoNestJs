import { IsString, MinLength } from "class-validator";

export class NewMEssageDto {

    @IsString()
    @MinLength(1)
    message: string;
}