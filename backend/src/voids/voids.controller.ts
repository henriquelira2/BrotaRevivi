import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VoidsService } from './voids.service';
import { CreateVoidDto } from './dto/create-void.dto';
import { UrbanVoid } from 'src/entity/void.entity';
import { UpdateVoidDto } from './dto/update-void.dto';

@UseGuards(JwtAuthGuard)
@Controller('voids')
export class VoidsController {
  constructor(private readonly voidsService: VoidsService) {}

  @Post()
  async create(
    @Body() dto: CreateVoidDto,
    @Req() req: any,
  ): Promise<UrbanVoid> {
    const userId = req.user?.id;

    if (!userId) throw new UnauthorizedException();

    return this.voidsService.create(dto, userId);
  }

  @Get()
  async findAll(): Promise<UrbanVoid[]> {
    return this.voidsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UrbanVoid> {
    return this.voidsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVoidDto) {
    return this.voidsService.update(id, dto);
  }
}
