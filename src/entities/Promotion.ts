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

  @Column()
  userId: number;

  @Column({ nullable: true })
  storeId: number;

  @Column({ nullable: true })
  brandId: number;

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @ManyToOne(type => User)
  user: User;

  @ManyToOne(type => Store, { nullable: true })
  store: Store;

  @ManyToOne(type => Brand, { nullable: true })
  brand: Brand;

  @OneToMany(type => Vote, vote => vote.promotion)
  votes: Vote[];

}
