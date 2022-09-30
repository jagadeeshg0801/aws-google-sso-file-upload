import { Injectable } from '@angular/core';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { BehaviorSubject, Observable, of, timestamp } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { saveAs } from 'file-saver'
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  FOLDER: any = 'JG_1/';
  bucketName = 'jaga-bucket';
  private filesList$: any = new BehaviorSubject(null);
  public loggedIn$ = new BehaviorSubject(true);
  public userInfo$ = new BehaviorSubject(null);

  userInfo: any = null;
  that = this;

  public _isShowSpinner = new BehaviorSubject<boolean>(false);
  //deployement  command
  // ng deploy --base-href=/aws-google-sso-file-upload/
  public adminList = ["thapliyal7662", "ameyagthakur" ];
  constructor(private authService: SocialAuthService, private toast: MessageService) {
    this.authService.authState.subscribe((res: any) => {
      this.userInfo = res;
    })
  }
  bucket = new S3(
    {
      accessKeyId: 'AKIAVPEOKZ2KCZOSZSVM',
      secretAccessKey: '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',
      region: 'us-east-1'
    }
  );
  params = {
    Bucket: 'jaga-bucket',
    Prefix: this.FOLDER,
  }

  isUserLoggedIn() {
    console.log('userINfo', this.userInfo)
    const loggedIn = this.userInfo ? true : false;
    this.loggedIn$.next(loggedIn);
    return loggedIn;
  }
  uploadFile(file: File) {
    
    let that = this;
    let folderName: any = '';
    if (!this.isUserLoggedIn()) {
      alert('Please Login!')
      return;
    } else {
      folderName = this.userInfo.email.split('@')[0]
    }
    let folder_path = this.adminList.includes(folderName) ? 'admin': 'admin/'+folderName;
    //console.log(',...', this.userInfo.email.split('@'))
    const contentType = file.type;
    const params = {
      Bucket: this.bucketName,
      Key: folder_path + '/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    const x: any = this.bucket.upload(params, { partSize: 100 * 1024 * 1024, queueSize: 1, }, function (err: any, data: any) {
      if (err) {
        //console.log('There was an error uploading your file: ', err);
        // return false;
            
        that.toast.add({ severity: 'error', summary: 'Failed', detail: 'File Upload Failed' });   
        that.hideLoader();
      }
      if(data){
        that.toast.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded Successfully' }); 
        that.hideLoader();
        that.getFiles();
      }
      
      // return true;
    });
  }



  //Get Files List
  getFiles(): Observable<any> {
    let folderName = '';
    if (!this.isUserLoggedIn()) {
      // alert('Please Login!')
      return of([]);
    } else {
      folderName = this.userInfo.email.split('@')[0]
    }
   
    let folder_path = this.adminList.includes(folderName) ? 'admin': 'admin/'+folderName;
    const params = {
      Bucket: 'jaga-bucket',
      Prefix: folder_path
    }
    const fileUploads = new Array();
    let that = this;
    this.bucket.listObjects(params, function (err, data: any) {
      if (err) {
        //console.log('err', err)
      } else {
        const fileData = data.Contents;
        fileData.forEach((element: any) => {          
          element['Path'] = element['Key']
          element['Key'] = element['Key'].split(folder_path+'/')[1],
          fileUploads.push(element)
        });
        that.setFilesList(fileUploads);
      }
      
      that.hideLoader();
    });

   
    return of(fileUploads)
  }


  //get Files data 
  setFilesList(list:any){
    this.filesList$.next(list)
  }

  getFilesList():Observable<any>{
    return this.filesList$;
  }
  //Download File
  downLoadFile(fileName: string) {
    let params = {
      Bucket: this.bucketName,
      Key: fileName
    }
    let that = this;
    this.bucket.getObject(params, function (err, data: any) {
      if (data) {
        const blob = new Blob([data.Body], { type: data.ContentType });
        let currentDate = new Date();
        const timeStamp = currentDate.getMonth() + '/' + currentDate.getDate() + '/'
          + currentDate.getFullYear();
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, timeStamp + fileName);
       that.hideLoader();
       that.toast.add({ severity: 'success', summary: 'Success', detail: 'File Downloaded Successfully' });
      }else{
        that.toast.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong!' });   
        that.hideLoader();
      }
    })
   
  }


  deleteFile(fileName: string) {
    this.showLoader();
    let that = this;
    let params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    //console.log('fielname', fileName)
    const y: any = this.bucket.deleteObject(params, function (err, data: any) {
      if (err) {
        that.toast.add({ severity: 'error', summary: 'Failed', detail: 'File Deletion Failed' });   
        that.hideLoader();
      } else {
        that.toast.add({ severity: 'success', summary: 'Success', detail: 'File Deleted Successfully' }); 
        that.hideLoader();        
        that.getFiles();
      }
    });
  }


  showLoader() {
    if (this.isUserLoggedIn()) {
      this._isShowSpinner.next(true)
    }
  }

  hideLoader() {
    this._isShowSpinner.next(false);
  }

  getSpinnerStatus(): Observable<boolean> {
    return this._isShowSpinner;
  }

}
