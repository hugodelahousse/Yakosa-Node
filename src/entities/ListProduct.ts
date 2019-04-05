import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import ShoppingList from './ShoppingList';
import { Product } from './Product';

@Entity()
@Unique(['list', 'product'])
export class ListProduct {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(type => ShoppingList, { onDelete:'CASCADE' })
  list: ShoppingList;

  @ManyToOne(type => Product, { onDelete:'CASCADE' })
  product: Product;

}
