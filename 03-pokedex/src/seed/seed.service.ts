import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  LIMITE = 650;

  async executeSeed() {
    const pokemons = await this.obtenerPokemons();
    await this.isertarPokemons(pokemons);

    return 'Seed executed';
  }

  async obtenerPokemons() {
    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${this.LIMITE}`,
    );

    return data.results;
  }

  async isertarPokemons(pokemons: any) {
    await this.pokemonService.deleteAll();
    // OPCION 1
    // const promises = pokemons.map(async (pokemon) => {
    //   const segmentos = pokemon.url.split('/');
    //   const numero = +segmentos[segmentos.length - 2];

    //   return this.pokemonService.create({
    //     nombre: pokemon.name,
    //     numero,
    //   });
    // });

    // return await Promise.all(promises).catch(error => console.log(error));

    // OPCION 2
    // pros: + rápido, inserta en orden
    const pokemonsToInsert = pokemons.map((pokemon) => {
      const segmentos = pokemon.url.split('/'); // ej: url:"https://pokeapi.co/api/v2/pokemon/1/"
      const numero = +segmentos[segmentos.length - 2];

      return {
        nombre: pokemon.name,
        numero,
      };
    });

    return await this.pokemonService.crateMany(pokemonsToInsert);
  }
}
