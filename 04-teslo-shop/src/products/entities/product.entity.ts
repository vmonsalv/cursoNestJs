import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

// @Entity({ name: 'product', schema: 'public'})
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    // length: xx,
    unique: true,
  })
  title: string;

  @Column('int', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('simple-array')
  sizes: string[];

  @Column({
    type: 'varchar',
  })
  gender: string;

  @Column('simple-array')
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // hace que cualquier funcion find haga las relaciones a otras tablas (eager relatinoships)
  })
  images?: ProductImage[];

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
