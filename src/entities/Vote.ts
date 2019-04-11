import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
@Unique(['userId', 'promotionId'])
export class Vote {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upvote: boolean;

  @Column()
  userId: number;

  @Column()
  promotionId: number;

  @ManyToOne(type => User, { onDelete:'CASCADE' })
  user: User;

  @ManyToOne(type => Promotion, { onDelete:'CASCADE' })
  promotion: Promotion;

}
