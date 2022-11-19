import {Component, OnInit} from '@angular/core';
import {AuthService, SocialUser} from "angularx-social-login";
import {UserService, ResponseModel} from "../../services/user.service";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myUser: any;
  loginData :any

  constructor(authService: AuthService,
              private userService: UserService,
              router: Router,
              private _token:TokenStorageService) {
  }

  ngOnInit(): void {
    this.loginData= this._token.getUser();
    this.userService.userData$
      .pipe(
        map(user => {
          if (user instanceof SocialUser) {
            return {
              ...user,
              email: 'test@test.com',
            };
          } else {
            return user;
          }
        })
      )
      .subscribe(data => {
        if (!data) {
          data = this.loginData
        }
        this.myUser = data;
      })
  }

  logout() {
    this._token.clearStorage();
    this.userService.logout()
  }
}
