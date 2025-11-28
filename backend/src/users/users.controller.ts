import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  ParseUUIDPipe, 
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

type SafeUser = Omit<User, 'passwordHash'>;

function sanitizeUser(user: User): SafeUser {
  const { passwordHash, ...rest } = user as any;
  return rest;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersService.findAll();
    return users.map(sanitizeUser);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SafeUser> {
    const user = await this.usersService.findById(id);
    return sanitizeUser(user);
  }

  @Post()
  async create(@Body() body: Partial<User>): Promise<SafeUser> {
    const user = await this.usersService.create(body);
    return sanitizeUser(user);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: Partial<User>,
  ): Promise<SafeUser> {
    const user = await this.usersService.update(id, body);
    return sanitizeUser(user);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
