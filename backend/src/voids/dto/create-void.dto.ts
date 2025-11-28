import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsLatitude,
  IsLongitude,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { VoidSuggestion } from './void-suggestion.dto';

export class CreateVoidDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Grau de risco é obrigatório' })
  risk: string;

  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @IsLatitude({ message: 'Latitude inválida' })
  lat: number;

  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @IsLongitude({ message: 'Longitude inválida' })
  lng: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photoUrls?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VoidSuggestion)
  @IsOptional() 
  suggestions?: VoidSuggestion[];
}
