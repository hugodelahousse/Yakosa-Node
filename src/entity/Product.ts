import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Promotion } from './Promotion';

@Entity()
export class Product {

  @PrimaryColumn()
  barcode: string;

  @OneToMany(type => Promotion, promotion => promotion.id)
  promotion: Promotion[];

}
