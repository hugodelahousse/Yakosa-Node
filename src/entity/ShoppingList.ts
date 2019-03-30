import { Entity, OneToMany, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { ListProduct } from './ListProduct';

@Entity()
export default class ShoppingList {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creationDate: Date;

  @Column({ nullable: true })
  lastUsed: Date;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @OneToMany(type => ListProduct, listProduct => listProduct.product)
  products: ListProduct[];

}
