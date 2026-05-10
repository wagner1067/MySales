export interface ICreateOrder {
  customer: any; // Recomendo usar o tipo do seu Customer aqui
  products: {
    product_id: string;
    price: number;
    quantity: number;
  }[];
}
