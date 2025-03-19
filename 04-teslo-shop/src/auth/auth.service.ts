import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const userToInsert = {
        ...userData,
        password: bcrypt.hashSync(password, 10),
        roles: ['user'],
      };
      // prepara la inserción
      const user = this.userRepository.create(userToInsert);

      await this.userRepository.save(user);
      const { password: hash, ...restUser } = user;

      //TODO retornar JWT

      return restUser;
    } catch (error) {
      this.handlerDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    // try {
      const { password, email } = loginUserDto;

      // se usa findOne xq columna se configuró select: false,
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true },
      });
      // const user = await this.userRepository.findOneBy({ email });

      if(!user)
        throw new UnauthorizedException('Credentials are not valid');

      if(!bcrypt.compareSync(password, user.password))
          throw new UnauthorizedException('Credentials are not valid');

      //TODO retornar JWT
      return user;
    // } catch (error) { 
    //  UnauthorizedException se va para el catch
    //   console.log(error);
    //   this.handlerDBExceptions(error);
    // }
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }

  handlerDBExceptions(error): never {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
