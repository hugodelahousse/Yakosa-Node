import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from './Store';
import { Promotion } from './Promotion';

@Entity()
export class Brand {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Store, store => store.brand)
  stores: Store[];

  @OneToMany(type => Promotion, promotion => promotion.brand)
  promotions: Promotion[];

}
