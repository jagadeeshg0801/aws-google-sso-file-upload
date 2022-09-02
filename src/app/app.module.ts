import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {  GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleSigninButtonDirective } from './google-signin-button.directive';
import {DialogModule} from 'primeng/dialog';
import { SpinnerComponent } from './spinner/spinner.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileUploadComponent,
    HeaderNavComponent,
    GoogleSigninButtonDirective,
    SpinnerComponent, 
    

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,    
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    DialogModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('462697480755-6phh5v6f9srfau3f5bjs1dlb3l9f5te8.apps.googleusercontent.com')
          }
        ],
        onError: (err) => {
          // console.error(err);
        }
      } as SocialAuthServiceConfig,
    }, MessageService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
