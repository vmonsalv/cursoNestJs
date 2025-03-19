import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) {}
  
  
  async runSeed() {
    await this.insertNewProducts();
    return `Seed executed`;
  }

  private async insertNewProducts() {
    await this.productService.removeAll();

    const products = initialData.products;

    let promises = products.map(product => {
      return this.productService.create(product);
    });

    await Promise.all(promises);

    return true;
  }
}
