import { Entity, OneToMany, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from './User';
import { ListProduct } from './ListProduct';
import { UsedList } from './UsedList';

@Entity()
export class ClientList {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creationDate: Date;

  @OneToOne(type => UsedList, usedList => usedList.id)
  usedList: UsedList;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @OneToMany(type => ListProduct, listProduct => listProduct.product)
  products: ListProduct[];

}
