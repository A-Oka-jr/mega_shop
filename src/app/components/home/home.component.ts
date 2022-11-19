import {Component, OnInit} from '@angular/core';
// import {ProductModelServer, serverResponse} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {Router} from "@angular/router";
import {ServerResponse, ProductModelServer} from "../../models/product.modle";
import {CartService} from "../../services/cart.service";
import {log} from "ng-zorro-antd/core/logger";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchKey: string = "";
  products: ProductModelServer[] = [];
  public categories: any;
  public categoryFilter: any;
  topSailing: any;
  count!: number;
  thumbimages: any[] = [];
  activePage: number = 10;


  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router) {
  }

  ngOnInit() {
    // @ts-ignore
    this.productService.getAllProducts(10,1).subscribe((prods: any) => {
      this.products = prods.products;
      this.categoryFilter = prods.products;
      // this.count = prods.products.countAll;
      console.log(prods)
    });
    this.productService.getAllCategories().subscribe((cat: any) => {
      this.categories = cat.categories;
    });
    this.productService.getTopSailingProducts().subscribe((topSailing: any) => {
      this.topSailing = topSailing.data;
    });
    this.productService.search.subscribe((val: any) => {
      this.searchKey = val;
    });

    this.productService.getProductsCount().subscribe((data: any) => {
      this.count = data.data[0].countAll;
      // this.count = prods.products.countAll;
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }


  // getProductByCategories(c: any) {
  //   console.log(c.title);
  //   this.productService.getProductFormCategory(c.title);
  // }

  filter(category: string) {
    this.categoryFilter = this.products
      .filter((a: any) => {
        if (a.category == category || category == '') {
          return a;
        }
      })
  }

  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber;
    this.productService.getAllProducts(15, activePageNumber).subscribe((prods: any) => {
      this.products = prods.products;
      this.categoryFilter = prods.products;
    });
  }
}
