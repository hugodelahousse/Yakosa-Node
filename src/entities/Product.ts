import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Promotion } from './Promotion';
import { ListProduct } from './ListProduct';

@Entity()
export class Product {

  @PrimaryColumn()
  barcode: string;

  @OneToMany(type => Promotion, promotion => promotion.product)
  promotions: Promotion[];

  @OneToMany(type => ListProduct, listProduct => listProduct.product)
  listProducts: ListProduct[];
}
