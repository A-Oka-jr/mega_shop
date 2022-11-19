import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {OrderService} from "../../services/order.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CartModelServer} from "../../models/cart.model";
import {UserService} from '../../services/user.service';
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TokenStorageService} from "../../services/token-storage.service";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartTotal: number = 0;
  cartData!: CartModelServer;
  userId!: number;
  loginData :any ;

  constructor(private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private userService: UserService,
              private _token: TokenStorageService) {
  }


  ngOnInit(): void {
    this.loginData = this._token.getUser();
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.userService.userData$.subscribe(data => {
      if (!data) {
        // @ts-ignore
        data = this.loginData;
        console.log(this.loginData)
      }
      // @ts-ignore
      this.userId = this.loginData.userId;
    });
  }

  onCheckout() {
    if (this.loginData.userId !== null) {
      if (this.cartTotal > 0) {
        this.spinner.show().then(p => {
          console.log(this.userId);
          this.cartService.checkoutFromCart(this.userId);
        });
      } else {
        return;
      }
    } else {
      this.router.navigate(['/login'])
    }
  }


}




