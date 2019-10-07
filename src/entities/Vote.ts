import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  RelationId,
} from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
@Unique(['user', 'promotion'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upvote: boolean;

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  user: User;

  @RelationId((vote: Vote) => vote.user)
  userId: number;

  @ManyToOne(type => Promotion, { onDelete: 'CASCADE' })
  promotion: Promotion;

  @RelationId((vote: Vote) => vote.promotion)
  promotionId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
