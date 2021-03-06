import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
  Unique,
  RelationId,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';
import { Vote } from './Vote';
import { Brand } from './Brand';
import { Store } from './Store';
import { MesuringUnits } from '@entities/utils';

export enum PromotionType {
  SIMPLE = 0,
  TWOSECONDHALF = 1,
  THREEFORTWO = 2,
  UNDEFINE = 3,
}

@Entity()
@Unique(['promotion', 'beginDate', 'endDate', 'type', 'product', 'storeId'])
@Unique(['promotion', 'beginDate', 'endDate', 'type', 'product', 'brandId'])
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @Column('decimal', { precision: 6, scale: 2 })
  promotion: number;

  @Column()
  beginDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column('enum', { enum: PromotionType, default: PromotionType.SIMPLE })
  type: number;

  @Column({ default: 1 })
  quantity: number;

  @Column('enum', { enum: MesuringUnits, default: MesuringUnits.UNIT })
  unit: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  storeId: number;

  @Column({ nullable: true })
  brandId: number;

  @ManyToOne(type => Product, product => product.barcode, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(type => User, { nullable: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(type => Store, { nullable: true, onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(type => Brand, { nullable: true, onDelete: 'CASCADE' })
  brand: Brand;

  @OneToMany(type => Vote, vote => vote.promotion)
  @JoinTable()
  votes: Vote[];
}
