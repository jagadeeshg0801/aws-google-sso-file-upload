import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  user: any;

  constructor(private authService: SocialAuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token: any = localStorage.getItem('token');
    const headers = new HttpHeaders({
      // 'API_KEY': 'test_key',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer',
      'access_token': this.getUserInfo()
    })
    return next.handle(request.clone({ headers }))
  }

  getUserInfo() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      //console.log('tkkk', user)
    });
    return '';
  }
}
