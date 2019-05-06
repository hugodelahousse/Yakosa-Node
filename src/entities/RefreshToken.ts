import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  token: string;

  @Column()
  userId: number;
}
