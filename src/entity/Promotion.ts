import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Product } from './Product';
import { User } from './User';
import { Vote } from './Vote';

@Entity()
export abstract class Promotion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  beginDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToMany(type => Vote, vote => vote.promotion)
  vote: Vote[];

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @ManyToOne(type => User, user => user.id)
  user: User;

}
