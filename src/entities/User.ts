import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Store } from './Store';
import { Promotion } from '@entities/Promotion';
import { Vote } from './Vote';
import ShoppingList from '@entities/ShoppingList';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  age: number;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @OneToMany(type => Vote, vote => vote => vote.user)
  votes: Vote[];

  @OneToMany(type => Promotion, promotion => promotion.id)
  postedPromotions: Promotion[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.user)
  shoppingLists: ShoppingList[];

  @ManyToMany(type => Store, store => store.id)
  managedStore: Store[];

}