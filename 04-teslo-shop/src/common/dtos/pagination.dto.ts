import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number) // alternativa usar un validation pipe en el main.ts, es equivalente a enableImplicitConversions: true
    limit?: number

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset: number
}