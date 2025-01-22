import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword });
    return newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    // Busca el usuario por nombre de usuario
    const user = await this.findByUsername(username);

    if (!user) {
      return null; // Usuario no encontrado
    }

    // Valida la contraseña
    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

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
