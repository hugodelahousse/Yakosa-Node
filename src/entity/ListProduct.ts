import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserList } from './UserList';
import { Product } from './Product';

@Entity()
export class ListProduct {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(type => UserList, list => list.id)
  userList: UserList;

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

}
