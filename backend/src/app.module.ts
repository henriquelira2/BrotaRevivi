import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { VoidsModule } from './voids/voids.module';
import { VoidSuggestion } from './entity/void-suggestion.entity';
import { UrbanVoid } from './entity/void.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:
        process.env.DB_HOST ||
        'b9a5up9zwv1949l5ymvl-mysql.services.clever-cloud.com',
      port: 3306,
      username: process.env.DB_USER || 'ug9zh2mh6h9zq3km',
      password: process.env.DB_PASS || 'UxSLfFfuCm5c0xlNZMN0',
      database: process.env.DB_NAME || 'b9a5up9zwv1949l5ymvl',
      autoLoadEntities: true,
      synchronize: true,
      entities: [UrbanVoid, VoidSuggestion],
    }),
    UsersModule,
    VoidsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
