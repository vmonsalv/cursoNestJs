import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
