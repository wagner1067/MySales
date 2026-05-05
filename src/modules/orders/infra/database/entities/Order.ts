import { Customers } from "@modules/customers/infra/database/entities/Customers";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderProducts } from "./OrderProducts";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customers)
  @JoinColumn({ name: "customer_id" })
  customer: Customers;

  @OneToMany(() => OrderProducts, (order_products) => order_products.order, {
    cascade: true,
  })
  order_products: OrderProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
