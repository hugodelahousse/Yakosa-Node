import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
@Unique(['user', 'promotion'])
export class Vote {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upvote: boolean;

  @ManyToOne(type => User, { onDelete:'CASCADE' })
  user: User;

  @ManyToOne(type => Promotion, { onDelete:'CASCADE' })
  promotion: Promotion;

}
