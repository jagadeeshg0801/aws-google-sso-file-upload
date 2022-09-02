import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from '../file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  FOLDER: any;
  selectedFiles: any;
  fileData:any;
  awsURL = 'https://jaga-bucket.s3.amazonaws.com/';
  cols: any =[
    {name: 'Key', displayName: 'File Name'},
    {name: 'Size', displayName: 'File Size'},
    {name: 'LastModifiedDate', displayName: 'Uploaded Time'},
  ]
  products:any =[
    
  ]
  filesList:Observable<any>;
  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.getFilesList();
    this.getFiles();
  }

  getFiles(){    
    this.fileService.showLoader();
    this.filesList = this.fileService.getFilesList(); 
  }

  downloadFile(file:any){    
    this.fileService.showLoader();
    this.fileService.downLoadFile(file['Key']);
  }

  deleteFile(fileName:any){
   const x= this.fileService.deleteFile(fileName);
  }

  getFileSizeInMb(fileSize:number){
    const size = fileSize /1024/1000;
    return Math.round(size)>0 ? size: fileSize/1024;

  }


  viewFile(file:any){
    window.open(this.awsURL + file['Key'], "Video Window", 'width=640, height=480')
  }


  upload() {
    this.fileService.showLoader();
    const file = this.selectedFiles.item(0);
   const x= this.fileService.uploadFile(file);
   console.log('x',x)

    this.fileData = null;

   //console.log("com x", x);
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  getFilesList(){
    this.fileService.getFiles();
  }
}
