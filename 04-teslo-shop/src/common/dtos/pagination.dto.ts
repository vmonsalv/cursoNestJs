import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'Cuántos registros necesitas'
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number) // alternativa usar un validation pipe en el main.ts, es equivalente a enableImplicitConversions: true
    limit?: number

    @ApiProperty({
        default: 0,
        description: 'Cuántos registros quieres saltar'
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset: number
}