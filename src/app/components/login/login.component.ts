import {Component, OnInit} from '@angular/core';
import {EmailValidator, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from "angularx-social-login";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {CartService} from "../../services/cart.service";
import {CartModelServer} from "../../models/cart.model";
import {CheckEmailService} from "../../validators/check-email.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  cartData: any;
  registrationForm!: FormGroup;
  // tslint:disable-next-line:max-line-length
  private emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
  comparePassword!: boolean;
  registrationMessage: any;


  constructor(private authService: AuthService,
              private  router: Router,
              private  userService: UserService,
              private  route: ActivatedRoute,
              private  cartService: CartService,
              private fb: FormBuilder,
              private checkEmailService: CheckEmailService) {
    this.registrationForm = fb.group({
      fname: ['', [Validators.required, Validators.minLength(4)]],
      lname: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)],
        [this.checkEmailService.emailValidate()]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    console.log(this.cartData.data[0].numInCart);
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        if (this.cartData.data[0].numInCart!==0) {
          this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/checkout');
        } else {
          this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
        }
      } else {
        this.router.navigateByUrl('/login');
      }
    });
    this.registrationForm.valueChanges
      .pipe(map((controls) => {
        // @ts-ignore
        return this.formControls.confirmPassword.value === this.formControls.password.value;
      }))
      .subscribe(passwordState => {
        console.log(passwordState);
        this.comparePassword = passwordState;
      });
  }

  SignInWithGoogle() {
    this.userService.googleLogin();
  }

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;

    if (form.invalid) {
      return
    }
    form.reset();
    this.userService.loginUser(email, password);
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  registerUser() {

    if (this.registrationForm.invalid) {
      return;
    }
    // @ts-ignore
    this.userService.registerUser({...this.registrationForm.value}).subscribe((response: { message: string }) => {
      this.registrationMessage = response.message;
    });

    this.registrationForm.reset();
  }
}
