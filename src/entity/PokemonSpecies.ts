import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import Type from './Type';

@Entity()
export default class PokemonSpecies {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 6, scale: 2 })
  weight: number;

  @Column('decimal', { precision: 6, scale: 2 })
  height: number;

  @Column()
  sprite: string;

  @ManyToOne(type => Type, type => type.primaryUsers)
  primaryType: Type;

  @ManyToOne(type => Type, type => type.secondaryUsers, { nullable: true })
  secondaryType: Type;
}
