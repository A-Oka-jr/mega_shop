import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {cartModelPublic, CartModelServer} from '../models/cart.model';
import {BehaviorSubject} from "rxjs";
import {NavigationExtras, Router} from "@angular/router";
import {ProductModelServer} from "../models/product.modle";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  SERVER_URL = environment.SERVER_URL;
  // store data in localstorage
  private cartDataClint: cartModelPublic = {
    total: 0,
    prodData: [{
      inCart: 0,
      id: 0
    }]
  };

  private cartDataServer: any = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    let info: cartModelPublic = JSON.parse(<string>localStorage.getItem('cart'));

    if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {
      // assign the value to our data variable which corresponds to the LocalStorage data format
      this.cartDataClint = info;
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClint.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.inCart;
            this.cartDataServer.data[0].product = actualProdInfo;
            this.CalculateTotal();
            this.cartDataClint.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.inCart,
              product: actualProdInfo
            });
            this.CalculateTotal();
            this.cartDataClint.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
          }
          this.cartData$.next({...this.cartDataServer});
        });
      });
    }
  }

  AddProductToCart(id: number, quantity?: number) {

    this.productService.getSingleProduct(id).subscribe((prod: { id: any; name: any; quantity: number; }) => {
      // If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClint.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
        this.cartDataClint.prodData[0].id = prod.id;
        this.cartDataClint.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
        this.cartData$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }  // END of IF
      // Cart is not empty
      else {
        let index = this.cartDataServer.data.findIndex((p: { product: { id: any; }; }) => p.product.id === prod.id);

        // 1. If chosen product is already in cart array
        if (index !== -1) {

          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClint.prodData[index].inCart = this.cartDataServer.data[index].numInCart;
          this.CalculateTotal();
          this.cartDataClint.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataServer));
          this.toast.info(`${prod.name} quantity updated in the cart.`, "Product Updated", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

        }
        // 2. If chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClint.prodData.push({
            inCart: 1,
            id: prod.id
          });
          this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        this.CalculateTotal();
        this.cartDataClint.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
        this.cartData$.next({...this.cartDataServer});
      }  // END of ELSE
    });
  }


  UpdateCartData(index:number, increase: Boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      // @ts-ignore
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClint.prodData[index].inCart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClint.total = this.cartDataServer.total;
      this.cartData$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
    } else {
      // @ts-ignore
      data.numInCart--;

      // @ts-ignore
      if (data.numInCart < 1) {
        this.DeleteProductFormCart(index);
        this.cartData$.next({...this.cartDataServer});
      } else {
        // @ts-ignore
        this.cartDataClint.prodData[index].inCart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClint.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
      }

    }

  }




  DeleteProductFormCart(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClint.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClint.total = this.cartDataServer.total;

      if (this.cartDataClint.total === 0) {
        this.cartDataClint = {prodData: [{inCart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
      }
      if (this.cartDataServer.total === 0) {
        this.cartDataServer =  {
          data: [{
            product: undefined,
            numInCart: 0
          }],
          total: 0
        };
        this.cartData$.next({...this.cartDataServer})
      } else {
        this.cartData$.next({...this.cartDataServer})
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }
  }



  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach((p: { product?: any; numInCart?: any; }) => {
      const {numInCart} = p;
      const {price} = p.product;
      // @ts-ignore
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  checkoutFromCart(userId: number) {
    // @ts-ignore
    this.http.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: { success: boolean }) => {
      if (res.success) {
        this.resetServerData();
        this.http.post(`${this.SERVER_URL}/orders/new`, {
          userId: userId,
          products: this.cartDataClint.prodData
        }).subscribe((data: any) => {
          console.log(data)
          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClint.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClint = {total: 0, prodData: [{inCart: 0, id: 0}]};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClint));
              });
            }
          });
        });
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry to book the order`, 'Order Status', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    })
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [{
        product: undefined,
        numInCart: 0
      }],
      total: 0
    };
    this.cartData$.next({...this.cartDataServer});
  }

  CalculateSubTotal(index: number) {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  };

}

interface orderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string;
    numInCart: string
  }]
}


function ProductModelServer(actualProductInfo: any, ProductModelServer: any) {
  throw new Error('Function not implemented.');
}

