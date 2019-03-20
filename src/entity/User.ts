import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Store } from './Store';
import { Promotion } from './Promotion';
import { Vote } from './Vote';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @ManyToMany(type => Store, store => store.id)
  store: Store[];

  @ManyToMany(type => Vote, vote => vote => vote.user)
  vote: Vote[];

  @OneToMany(type => Promotion, promotion => promotion.id)
  promotion: Promotion[];

}
