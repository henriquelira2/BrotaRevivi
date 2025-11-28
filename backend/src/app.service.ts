import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🚀 API do projeto está rodando! Acesse /docs para ver a documentação Swagger.';
  }
}
