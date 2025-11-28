import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrbanVoid } from 'src/entity/void.entity';
import { CreateVoidDto } from './dto/create-void.dto';
import { UpdateVoidDto } from './dto/update-void.dto';

@Injectable()
export class VoidsService {
  constructor(
    @InjectRepository(UrbanVoid)
    private readonly voidsRepository: Repository<UrbanVoid>,
  ) {}

  async create(dto: CreateVoidDto, userId: string): Promise<UrbanVoid> {
    const { suggestions, ...data } = dto;

    const entity = this.voidsRepository.create({
      ...data,
      createdBy: userId,
      suggestions: suggestions?.map((s) => ({
        ...s,
      })),
    });

    return this.voidsRepository.save(entity);
  }

  async findAll(): Promise<UrbanVoid[]> {
    return this.voidsRepository.find();
  }

  async findOne(id: string): Promise<UrbanVoid> {
    const item = await this.voidsRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Void urbano não encontrado');
    }

    return item;
  }

  async update(id: string, dto: UpdateVoidDto): Promise<UrbanVoid> {
    const found = await this.voidsRepository.findOne({
      where: { id },
      relations: ['suggestions'],
    });

    if (!found) {
      throw new NotFoundException('Void não encontrado');
    }

    const { suggestions, ...data } = dto;

    Object.assign(found, data);

    if (suggestions) {
      found.suggestions = suggestions.map((s) => ({
        ...s,
        void: found,
      })) as any;
    }

    return this.voidsRepository.save(found);
  }
}
