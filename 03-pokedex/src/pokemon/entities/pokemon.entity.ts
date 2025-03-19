import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    @Prop({
        unique: true,
        index: true,
    })
    numero: number;

    @Prop({
        unique: true,
        index: true,
    })
    nombre: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);