import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ShoppingList } from './ShoppingList';
import { Product } from './Product';

@Entity()
@Unique(['userList', 'product'])
export class ListProduct {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(type => ShoppingList, list => list.id)
  userList: ShoppingList;

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

}
