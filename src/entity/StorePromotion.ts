import { Entity, ManyToOne } from 'typeorm';
import { Promotion } from './Promotion';
import { Store } from './Store';

@Entity()
export class StorePromotion extends Promotion {

  @ManyToOne(type => Store, store => store.id)
  store: Store;

}
