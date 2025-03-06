import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ username }, { email }],
    });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    // Busca el usuario por email o username
    const user = await this.userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return null; // Usuario no encontrado
    }

    // Valida la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null; // Contraseña inválida
    }

    return user; // Retorna el usuario si todo está bien
  }

  // Método adicional para obtener todos los usuarios
  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
