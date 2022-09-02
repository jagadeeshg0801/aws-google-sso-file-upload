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
  userInfo: any = null;
  that = this;

  public _isShowSpinner = new BehaviorSubject<boolean>(false);
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
    const loggedIn = this.userInfo ? true : false;
    this.loggedIn$.next(loggedIn);
    return loggedIn;
  }
  uploadFile(file: File) {
    let folderName: any = '';
    if (!this.isUserLoggedIn()) {
      alert('Please Login!')
      return;
    } else {
      folderName = this.userInfo.email.split('@')[0]
    }
    //console.log(',...', this.userInfo.email.split('@'))
    const contentType = file.type;
    const params = {
      Bucket: this.bucketName,
      Key: folderName + '/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    const x: any = this.bucket.upload(params, { partSize: 10 * 1024 * 1024, queueSize: 1, }, function (err: any, data: any) {
      if (err) {
        //console.log('There was an error uploading your file: ', err);
        // return false;
      }

      // return true;
    });
    console.log('x..', x)
    if (x && x['failed'] == false) {
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded Successfully' });
      this.hideLoader();

      return true;
    } else {
      this.hideLoader();
      this.toast.add({ severity: 'error', summary: 'Failed', detail: 'File Upload Failed' });
      return false;
    }
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
    const params = {
      Bucket: 'jaga-bucket',
      Prefix: folderName
    }
    const fileUploads = new Array();
    this.bucket.listObjects(params, function (err, data: any) {
      if (err) {
        //console.log('err', err)
      } else {
        const fileData = data.Contents;
        fileData.forEach((element: any) => {
          fileUploads.push(element)
        });
      }
    });

    this.hideLoader();
    return of(fileUploads)
  }


  //Download File
  downLoadFile(fileName: string) {
    let params = {
      Bucket: this.bucketName,
      Key: fileName
    }

    this.bucket.getObject(params, function (err, data: any) {
      if (data) {
        const blob = new Blob([data.Body], { type: data.ContentType });
        let currentDate = new Date();
        const timeStamp = currentDate.getMonth() + '/' + currentDate.getDate() + '/'
          + currentDate.getFullYear();
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, timeStamp + fileName);
      }
    })
    this.hideLoader();
  }


  deleteFile(fileName: string) {
    this.showLoader();
    let params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    //console.log('fielname', fileName)
    const y: any = this.bucket.deleteObject(params, function (err, data: any) {
      if (err) {
      } else {

      }
    });
    console.log('y', y)
    if (y && y['response']['error'] == null) {
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'File Deleted Successfully' });
      this.getFiles();
      this.hideLoader();
      return true;
    } else {
      this.toast.add({ severity: 'error', summary: 'Failed', detail: 'File Deletion Failed' });
      this.hideLoader();
      return false;
    }



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
