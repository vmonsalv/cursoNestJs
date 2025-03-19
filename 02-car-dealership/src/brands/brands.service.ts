import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
    // {
    //   id: uuid(),
    //   name: 'Toyota',
    //   createdAt: new Date().getTime(),
    // },
  ];

  create(createBrandDto: CreateBrandDto) {
    const brand: Brand = {
      id: uuid(),
      ...createBrandDto,
      createdAt: new Date().getTime(),
    };

    this.brands.push(brand);

    return brand;
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find((brand) => brand.id == id);

    if (!brand)
      throw new NotFoundException(`Marca con id '${id}' no encontrada`);

    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    let brandDB = this.findOne(id);

    this.brands = this.brands.map((brand) => {
      if (brand.id == id) {
        brandDB = {
          ...brandDB,
          ...updateBrandDto,
          id,
          updateAt: new Date().getTime(),
        };
        return brandDB;
      }

      return brand;
    });

    return brandDB;
  }

  remove(id: string) {
    const brandDB = this.findOne(id);

    this.brands = this.brands.filter((brand) => brand.id != brandDB.id);

    return;
  }

  fillBrandsWithSeedData(brands: Brand[]) {
      this.brands = brands;
    }
}
