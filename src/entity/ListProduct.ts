import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserList } from './UserList';
import { Product } from './Product';

@Entity()
@Unique(['userList', 'product'])
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
