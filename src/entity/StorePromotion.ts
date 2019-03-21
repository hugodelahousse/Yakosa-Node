import { Entity, ManyToMany } from 'typeorm';
import { Promotion } from './Promotion';
import { Store } from './Store';

@Entity()
export class StorePromotion extends Promotion {

  @ManyToMany(type => Store, store => store.id)
  store: Store[];

}
