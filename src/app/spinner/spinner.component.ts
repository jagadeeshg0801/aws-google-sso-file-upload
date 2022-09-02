
import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  isShow: boolean;

  constructor(private sharedService: FileService) { }

  ngOnInit(): void {
   
  }

}
