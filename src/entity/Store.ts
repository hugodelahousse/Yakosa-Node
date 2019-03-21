import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from './Brand';
import { User } from './User';
import { StorePromotion } from './StorePromotion';

@Entity()
export class Store {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('geography', { nullable: true })
  position: object;

  @ManyToOne(type => Brand, brand => brand.id)
  brand: Brand;

  @OneToMany(type => StorePromotion, storePromotion => storePromotion.id)
  storePromotion: StorePromotion[];

  @ManyToMany(type => User, user => user.id)
  manager: User[];

}
