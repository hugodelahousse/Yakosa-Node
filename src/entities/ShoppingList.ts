import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  RelationId
} from "typeorm";
import { User } from "./User";
import { ListProduct } from "./ListProduct";

@Entity()
export default class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creationDate: Date;

  @Column({ nullable: true })
  lastUsed: Date;

  @RelationId((shopl: ShoppingList) => shopl.user)
  userId: number;

  @ManyToOne(type => User)
  user: User;

  @OneToMany(type => ListProduct, listProduct => listProduct.list)
  products: ListProduct[];
}
