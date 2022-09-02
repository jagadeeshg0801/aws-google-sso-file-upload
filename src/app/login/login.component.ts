import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit , OnDestroy{
  loggedIn: any;

  constructor(private authService: SocialAuthService, private router: Router, private message: MessageService) { }
  user: SocialUser | undefined;
  GoogleLoginProvider = GoogleLoginProvider;
  ngOnInit(): void {
    this.checkLoginStatus();
  }
  locale: string = '';
  width: string = '';
  type: string = 'standard';
  text: string = 'Google Ma';
  size:any = 'large';
  shape:any = 'square' 
  theme:any = 'outline'
  logo_alignment:any = 'left'
  
 

  checkLoginStatus(){
    this.authService.authState.subscribe((user) => {
      this.user = user;
      //console.log('user', user)
      if(this.user){
        this.message.add({ severity: 'success', summary: 'Success', detail: 'Login Successfully done!' });
      
        this.router.navigate(['/file-upload'])
      }else{
        // this.message.add({ severity: 'error', summary: 'Failed', detail: 'Sorry!, Unable to login! Please try again sometime' });
      }
      // alert('hello')
      this.loggedIn = (user != null);
    });
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  signOut(): void {
    this.authService.signOut();
  }

 ngOnDestroy(): void {
   this.message.clear();
 }


}
