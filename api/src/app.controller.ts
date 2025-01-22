import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api-status')
  getHello(): string {
    return 'This is a fallback response'; // This will not be used since we are serving static files
  }
}
