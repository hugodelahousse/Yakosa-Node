import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  RelationId,
  Unique,
} from 'typeorm';
import { User } from './User';
import { ListProduct } from './ListProduct';

@Entity()
@Unique(['name', 'user'])
export default class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creationDate: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  lastUsed: Date;

  @RelationId((shop: ShoppingList) => shop.user)
  userId: number;

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(type => ListProduct, listProduct => listProduct.list)
  products: ListProduct[];
}
