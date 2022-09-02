import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn = false;
  constructor(private authService:SocialAuthService, private fileService: FileService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.fileService.loggedIn$.subscribe(res =>{
          this.isLoggedIn = res;
      })
      return true;
      if(this.isLoggedIn){
        return this.isLoggedIn;
      }
      // this.router.navigate(['/login']) //enable if working fine all
      return this.isLoggedIn;
  }
  
}
