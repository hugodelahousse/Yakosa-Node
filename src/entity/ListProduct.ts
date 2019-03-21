import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { List } from './List';
import { Product } from './Product';

@Entity()
export class ListProduct {

  @PrimaryColumn()
  @ManyToOne(type => List, list => list.id)
  list: List;

  @PrimaryColumn()
  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @Column()
  quantity: number;

}
