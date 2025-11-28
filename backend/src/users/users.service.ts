import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    return user ?? null;
  }

  async create(data: Partial<User>): Promise<User> {
    const created = this.usersRepository.create(data);
    return this.usersRepository.save(created);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    Object.assign(user, data);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
