import { Component, OnInit } from '@angular/core';
import {CartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {UserService} from "../../services/user.service";
import {ProductService} from "../../services/product.service";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   cartData:any;
   cartTotal:number=0;
   authState!:boolean;
  categories:any;
  public searchTerm :string='';
  authData : any

  constructor(public cartService:CartService,
              private userService:UserService,
              private  productService:ProductService,
              private _token:TokenStorageService) { }

  ngOnInit(): void {
    this.authData = this._token.getUser();
    this.cartService.cartTotal$.subscribe(total=>this.cartTotal = total);
    this.cartService.cartData$.subscribe(data=>this.cartData=data);
    this.userService.authState$.subscribe(authState=>{
      if (!authState && this.authData){
       // @ts-ignore
        authState = this.authData;
      }
        this.authState = authState
    });
    this.productService.getAllCategories().subscribe((cat:any)=>{
      this.categories = cat.categories;
    })
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.productService.search.next(this.searchTerm)
  }
}
