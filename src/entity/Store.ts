import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Brand } from './Brand';
import { User } from './User';

@Entity()
export class Store {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /*Missing position*/

  @ManyToMany(type => Brand, brand => brand.id)
  band: Brand[];

  @ManyToMany(type => User, user => user.id)
  manager: User[];

}
