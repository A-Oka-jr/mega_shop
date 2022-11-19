import { Component, OnInit } from '@angular/core';
import {CartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {ProductModelServer} from "../../models/product.modle";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
cartData: any;
cartTotal:number=0;
subTotal:number=0;

  constructor(public cartService:CartService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total=>this.cartTotal = total);
    this.cartService.cartData$.subscribe((data:CartModelServer)=>this.cartData=data);
  }

  changeQuantity(index:number,increase:boolean){
    this.cartService.UpdateCartData(index,increase);
  }
}
