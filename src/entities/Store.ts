import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from './Brand';
import { User } from './User';
import { Promotion } from './Promotion';

@Entity()
export class Store {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('geography', { spatialFeatureType: 'Point', srid: 4326, nullable: true })
  position: string;

  @Column()
  brandId: number

  @ManyToOne(type => Brand)
  brand: Brand;

  @OneToMany(type => Promotion, promotion => promotion.store)
  promotions: Promotion[];

  @ManyToMany(type => User, user => user.id)
  managers: User[];

}
