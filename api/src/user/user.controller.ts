import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // Servicio para manejar JWT
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );

    if (existingUser) {
      throw new HttpException(
        'Username or email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.create(createUserDto);
    return { message: 'User successfully created' };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Genera un token JWT
    return this.authService.generateJwt(user);
  }
}
