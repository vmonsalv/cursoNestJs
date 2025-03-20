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
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    return { ...user, token: this.getJwtToken({ email: user.email }) };
    // } catch (error) {
    //  UnauthorizedException se va para el catch
    //   console.log(error);
    //   this.handlerDBExceptions(error);
    // }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  handlerDBExceptions(error): never {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
