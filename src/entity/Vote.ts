import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
export class Vote {

  @PrimaryColumn()
  @ManyToMany(type => User, user => user.id)
  user: User[];

  @PrimaryColumn()
  @ManyToMany(type => Promotion, promotion => promotion.id)
  promotion: Promotion[];

  @Column()
  upVote: boolean;

}
