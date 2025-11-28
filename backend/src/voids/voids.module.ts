import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VoidsService } from './voids.service';
import { UrbanVoid } from 'src/entity/void.entity';
import { VoidsController } from './voids.controller';
import { VoidSuggestion } from 'src/entity/void-suggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UrbanVoid, VoidSuggestion])],
  providers: [VoidsService],
  controllers: [VoidsController],
  exports: [VoidsService],
})
export class VoidsModule {}
