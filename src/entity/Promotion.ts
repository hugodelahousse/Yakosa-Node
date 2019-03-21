import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
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

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @OneToMany(type => Vote, vote => vote.promotion)
  vote: Vote[];

}
