import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from './file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aws-google-sso-file-upload';
  
  display: boolean = true;
  isShow: boolean;
  constructor(private fileService:FileService, private router: Router){}

  ngOnInit(): void {
    this.fileService.loggedIn$.subscribe((res:boolean)=>{
      this.display = res;
      //console.log('dis', this.display)
    })
    this.fileService._isShowSpinner.subscribe((status:boolean)=>{
      console.log('sho', status)
      this.isShow = status;
    })
  }

  onHide(){
    this.display = true;
    this.fileService.loggedIn$.next(true);
    this.router.navigate(['/login'])
  }
}
