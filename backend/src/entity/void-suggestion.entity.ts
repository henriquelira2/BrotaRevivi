import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UrbanVoid } from './void.entity';

@Entity('void_suggestions')
export class VoidSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UrbanVoid, (v) => v.suggestions, { onDelete: 'CASCADE' })
  void: UrbanVoid;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  type: string;

  @Column()
  degree: string;

  @Column('simple-array', { nullable: true })
  images?: string[]; 
}
