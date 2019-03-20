import {
  Entity,
  PrimaryColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { List } from './List';

@Entity()
export class UsedList {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastUsed: Date;

  @PrimaryColumn()
  @OneToOne(type => List, list => list.id)
  list: List;

}
