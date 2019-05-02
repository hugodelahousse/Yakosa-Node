import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  RelationId
} from "typeorm";
import { Store } from "./Store";
import { Promotion } from "@entities/Promotion";
import { Vote } from "./Vote";
import ShoppingList from "@entities/ShoppingList";
import { Brand } from "./Brand";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  age: number;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @OneToMany(type => Vote, vote => vote => vote.user)
  votes: Vote[];

  @OneToMany(type => Promotion, promotion => promotion.user)
  postedPromotions: Promotion[];

  @RelationId((user: User) => user.shoppingLists)
  ShoppingListId: number[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.user)
  shoppingLists: ShoppingList[];

  @RelationId((user: User) => user.managedStore)
  managedStoreId: number[];

  @ManyToMany(type => Store, store => store.managers)
  managedStore: Store[];

  @RelationId((user: User) => user.managedBrand)
  managedBrandId: number[];

  @ManyToMany(type => Brand, brand => brand.managers)
  managedBrand: Brand[];
}
