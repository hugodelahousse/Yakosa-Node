import { Entity, OneToMany, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from './User';
import { ListProduct } from './ListProduct';
import { UsedList } from './UsedList';

@Entity()
export class List {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creationDate: Date;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @OneToMany(type => ListProduct, listProduct => listProduct.list)
  list: List;

  @OneToOne(type => UsedList, usedList => usedList.id)
  usedList: UsedList;

}
