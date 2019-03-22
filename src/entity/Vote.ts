import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
export class Vote {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upvote: boolean;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @ManyToOne(type => Promotion, promotion => promotion.id)
  promotion: Promotion;

}
