import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from './Store';
import { BrandPromotion } from './BrandPromotion';

@Entity()
export class Brand {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Store, store => store.id)
  store: Store[];

  @OneToMany(type => BrandPromotion, brandPromotion => brandPromotion.id)
  brandPromotion: BrandPromotion[];

}
