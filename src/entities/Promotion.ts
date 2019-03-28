import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './Product';
import { User } from './User';
import { Vote } from './Vote';
import { Brand } from './Brand';
import { Store } from './Store';

@Entity()
export class Promotion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  beginDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @ManyToOne(type => Store, store => store.id, { nullable: true })
  store: Store;

  @ManyToOne(type => Brand, brand => brand.id, { nullable: true })
  brand: Brand;

  @OneToMany(type => Vote, vote => vote.promotion)
  votes: Vote[];

}

/*
{
    "beginDate": "2019-03-22T00:00:00.000Z",
    "description": "test",
    "endDate": "2012-03-22T00:00:00.000Z",
    "product": "3228886030011",
    "store": 1,
    "user": 1
}
*/
