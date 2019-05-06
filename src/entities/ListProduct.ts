import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  RelationId,
} from 'typeorm';
import ShoppingList from './ShoppingList';
import { Product } from './Product';

@Entity()
@Unique(['list', 'product'])
export class ListProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(type => ShoppingList, { onDelete: 'CASCADE' })
  list: ShoppingList;

  @ManyToOne(type => Product, { onDelete: 'CASCADE' })
  product: Product;

  @RelationId((listProduct: ListProduct) => listProduct.list)
  listId: number;

  @RelationId((listProduct: ListProduct) => listProduct.product)
  productBarcode: string;
}
