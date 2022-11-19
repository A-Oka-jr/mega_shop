import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {ProductModelServer} from "../models/product.modle";
// @ts-ignore
import {BehaviorSubject, Observable} from "rxjs";
import {log} from "ng-zorro-antd/core/logger";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public search = new BehaviorSubject<string>("")
  SERVER_URL= environment.SERVER_URL;
  constructor(private http:HttpClient, private router:Router) { }

//  get all product from DB
  getAllProducts(numberOfResults=15,activePageNumber:number){
    // @ts-ignore
    let page = activePageNumber.toString();
    return this.http.get(this.SERVER_URL + '/products',{
      headers: undefined,
      params:{
        limit:numberOfResults.toString(),
        page:page
      }
    })
  }
//  get single product
  getSingleProduct(id:number): Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL+'/products/'+id);
  }
  // get product by category name
  getProductFormCategory(catName:string):Observable<ProductModelServer[]>{
    console.log(catName);
    return this.http.get<ProductModelServer[]>(this.SERVER_URL+'/products/category/'+catName);
  }

  getAllCategories(){
    return this.http.get(this.SERVER_URL + '/categories')
  }

  getTopSailingProducts(){
    return this.http.get(this.SERVER_URL + '/products/orders/topSailing')
  }
  getProductsCount(){
    return this.http.get(this.SERVER_URL + '/products/products/count')
  }
}

