import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../file.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {
  user:SocialUser | any;
  loggedIn: boolean;
  userRole: any;

  constructor(private authService: SocialAuthService, private router: Router, private fileService:FileService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if(this.user){
       const userId = this.user.email.split('@')[0];
        this.userRole = this.fileService.adminList.includes(userId)? 'Admin': 'User';
      }
      this.fileService.userInfo$.next(this.user);
      //console.log('user', user)
      // alert('hello')
      this.loggedIn = (user != null);
    });
  }

  logoff(){
    this.authService.signOut();
    this.router.navigate(['/'])
  }

}
