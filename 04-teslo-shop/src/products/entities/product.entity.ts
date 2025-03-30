import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

// @Entity({ name: 'product', schema: 'public'})
@Entity()
export class Product {
  @ApiProperty({
    example: '00da6389-6598-4cfe-9664-b9212471b825',
    description: 'Product Id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty(
    {
      example: 'T-shirt Teslo',
      description: 'Product title',
      uniqueItems: true,
    }
  )
  @Column('varchar', {
    // length: xx,
    unique: true,
  })
  title: string;

  @ApiProperty(
    {
      example: 0,
      description: 'Product price',
    }
  )
  @Column('int', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Lorem sit labore veniam sit ullamco do et in sunt commodo.',
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product slug - for SEO',
    uniqueItems: true,
  })
  @ApiProperty()
  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @Column('simple-array')
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column({
    type: 'varchar',
  })
  gender: string;

  @ApiProperty()
  @Column('simple-array')
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // hace que cualquier funcion find haga las relaciones a otras tablas (eager relatinoships)
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user?: User;

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
