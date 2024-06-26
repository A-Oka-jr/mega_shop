export interface ProductModelServer {
  id:number;
  name:string;
  category:string;
  description:string;
  price:number;
  quantity:number;
  images:string;
  image:string;
  countAll:number;
}

export interface ServerResponse {
  count:number;
  products:ProductModelServer[]
}

