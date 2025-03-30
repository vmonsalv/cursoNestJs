import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        unique: true
    })
    email: string;

    @Column('varchar', {
        nullable: false,
        select: false,
    })
    password: string;

    @Column('varchar', {
        nullable: false
    })
    fullName: string;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    @Column('simple-array')
    roles: string [];

    @OneToMany(
        () => Product,
        (product) => product.user)
    product?: Product;

    @BeforeInsert()
    checkFieldsBeforInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforUpdate() {
        // this.email = this.email.toLocaleLowerCase().trim();
        this.checkFieldsBeforInsert();
    }
}
