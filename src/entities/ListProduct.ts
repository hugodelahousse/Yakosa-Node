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

enum MesuringUnits {
  UNIT = 0,
  GRAMME = 1,
  KILOGRAM = 2,
  LITRE = 3,
  CENTILITRE = 4,
}

@Entity()
@Unique(['list', 'product'])
export class ListProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column('enum', { enum: MesuringUnits, default: MesuringUnits.UNIT })
  unit: number;

  @RelationId((listProduct: ListProduct) => listProduct.list)
  listId: number;

  @ManyToOne(type => ShoppingList, { onDelete: 'CASCADE' })
  list: ShoppingList;

  @RelationId((listProduct: ListProduct) => listProduct.product)
  productId: number;

  @ManyToOne(type => Product, { onDelete: 'CASCADE' })
  product: Product;

  @RelationId((listProduct: ListProduct) => listProduct.product)
  productBarcode: string;
}
