import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { ClientList } from './ClientList';
import { Product } from './Product';

@Entity()
export class ListProduct {

  @PrimaryColumn()
  @ManyToOne(type => ClientList, list => list.id)
  clientList: ClientList;

  @PrimaryColumn()
  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @Column()
  quantity: number;

}
