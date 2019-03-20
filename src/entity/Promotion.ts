import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Check, ManyToOne } from 'typeorm';
import { Store } from './Store';
import { Product } from './Product';
import { Brand } from './Brand';
import { User } from './User';
import { Vote } from './Vote';

@Entity()
@Check('("storeId" IS NOT NULL AND "brandId" IS NULL) ' +
         'OR ("storeId" IS NULL AND "brandId" IS NOT NULL)')
export class Promotion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  beginDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToMany(type => Store, store => store.id, { nullable: true })
  store: Store[];

  @ManyToMany(type => Vote, vote => vote.promotion)
  vote: Vote[];

  @ManyToOne(type => Brand, brand => brand.id, { nullable: true })
  brand: Brand;

  @ManyToOne(type => Product, product => product.barcode)
  product: Product;

  @ManyToOne(type => User, user => user.id)
  user: User;

}
