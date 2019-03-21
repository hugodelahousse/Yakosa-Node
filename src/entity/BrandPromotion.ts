import { Entity, ManyToOne } from 'typeorm';
import { Promotion } from './Promotion';
import { Brand } from './Brand';

@Entity()
export class BrandPromotion extends Promotion {

  @ManyToOne(type => Brand, brand => brand.id, { nullable: true })
  brand: Brand;

}
