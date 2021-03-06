import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
  JoinTable,
} from 'typeorm';
import { Brand } from './Brand';
import { User } from './User';
import { Promotion } from './Promotion';
import { Position } from 'types/PositionType';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
  position: Position;

  @Column({ nullable: true })
  brandId: number;

  @ManyToOne(type => Brand, { onDelete: 'CASCADE' })
  brand: Brand;

  @OneToMany(type => Promotion, promotion => promotion.store)
  @JoinTable()
  promotions: Promotion[];

  @RelationId((store: Store) => store.managers)
  managersId: number[];

  @ManyToMany(type => User, user => user.managedStore)
  @JoinTable()
  managers: User[];
}
