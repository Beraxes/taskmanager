import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const mongour = process.env.MONGO_URI;
    return `mongour, ${mongour}`;
  }
}
