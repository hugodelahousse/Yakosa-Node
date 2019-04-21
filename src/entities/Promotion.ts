import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
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

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @Column('decimal', { precision: 6, scale: 2 })
  promotion: number;

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

  @ManyToOne(type => Product, product => product.barcode, { onDelete:'CASCADE' })
  product: Product;

  @ManyToOne(type => User, { onDelete:'CASCADE' })
  user: User;

  @ManyToOne(type => Store, { nullable: true, onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(type => Brand, { nullable: true, onDelete: 'CASCADE' })
  brand: Brand;

  @OneToMany(type => Vote, vote => vote.promotion)
  @JoinTable()
  votes: Vote[];

}
