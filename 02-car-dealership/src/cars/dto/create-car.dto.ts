import { IsString } from "class-validator";

export class CreateCarDto {

    // @IsString({ message: 'custom string validation message'})
    @IsString()
    readonly brand: string;

    @IsString()
    readonly model: string;
}