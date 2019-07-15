import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  RelationId,
  JoinTable,
  Unique,
} from 'typeorm';
import { Store } from './Store';
import { Promotion } from './Promotion';
import { User } from './User';

@Entity()
@Unique(['name'])
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Store, store => store.brand)
  stores: Store[];

  @OneToMany(type => Promotion, promotion => promotion.brand)
  promotions: Promotion[];

  @RelationId((brand: Brand) => brand.managers)
  managersId: number[];

  @JoinTable()
  @ManyToMany(type => User, user => user.managedBrand)
  managers: User[];
}
