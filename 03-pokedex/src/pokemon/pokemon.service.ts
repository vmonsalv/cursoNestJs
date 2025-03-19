import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    // const defaultLimit = configService.get<number>('defaultLimit');
  }

  private DEFAULT_LIMIT: number = this.configService.get('defaultLimit') as number;

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.nombre = createPokemonDto.nombre.toLowerCase();

      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  async crateMany(data: { nombre: string; numero: number }) {
    return await this.pokemonModel.insertMany(data);
  }

  findAll(paginationDto: PaginationDto) {
    console.log(this.DEFAULT_LIMIT);
    const { limit = this.DEFAULT_LIMIT, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ numero: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon = (await this.pokemonModel.findOne({
      nombre: term.toLowerCase().trim(),
    })) as Pokemon;

    if (!pokemon && !isNaN(+term)) {
      pokemon = (await this.pokemonModel.findOne({ numero: term })) as Pokemon;
    } else if (isValidObjectId(term)) {
      // si es un mongo id válido
      pokemon = (await this.pokemonModel.findById(term)) as Pokemon;
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon "${term}" no encontrado`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto && updatePokemonDto.nombre)
      updatePokemonDto.nombre = updatePokemonDto.nombre.toLowerCase();

    try {
      // pokemon.save();
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return {id};
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { acknowledged, deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });

    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon con id "${id}" no encontrado`);

    return;
  }

  async deleteAll() {
    return this.pokemonModel.deleteMany({});
  }

  private handleException(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon ya existe: "${JSON.stringify(error.keyValue)}"`,
      );

    console.log(error);
    throw new InternalServerErrorException('No se puede actualizar pokemon');
  }
}
