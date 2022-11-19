import {ProductModelServer} from "./product.modle";

export interface CartModelServer {
  total:number;
  data:[{
    product:ProductModelServer;
    numInCart:number
  }];
}

export interface cartModelPublic {
  total:number;
  prodData:[{
    id:number;
    inCart:number
  }];
}
