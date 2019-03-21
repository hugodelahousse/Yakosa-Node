import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
export class Vote {

  @PrimaryColumn()
  @ManyToOne(type => User, user => user.id)
  user: User;

  @PrimaryColumn()
  @ManyToOne(type => Promotion, promotion => promotion.id)
  promotion: Promotion;

  @Column()
  upVote: boolean;

}
