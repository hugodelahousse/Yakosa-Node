import {
  Entity,
  PrimaryColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { ClientList } from './ClientList';

@Entity()
export class UsedList {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastUsed: Date;

  @PrimaryColumn()
  @OneToOne(type => ClientList, list => list.id)
  clientList: ClientList;

}
