import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  url = null;
  showSizeError = {
    image: false,
    size: false
  };
  signatureData: any;
  selectedImage: any;
  fileName: any;
  fileSize: any;
  enableList: boolean;

  constructor(
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  submit() {
    const data = {
      bulk_upload: 'candidate-bulk'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  upload() {
    const apiData = {
      source_file: this.url ? this.url.replace('data:text/csv;base64,', '').toString() : ''
    };
    this.adminService.uploadCSV(apiData).subscribe((datas: any) => {
      console.log(datas);
      this.appConfig.hideLoader();

    }, (err) => {

    });
    this.enableList = true;
  }

  backToUpload() {
    this.enableList = false;
  }



  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    // dialogDetails = {
    //   iconName: data.iconName,
    //   showCancel: data.showCancel,
    //   showConfirm: data.showConfirm,
    //   showOk: data.showOk,
    //   dataToBeShared: data.sharedData,
    // };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const datas = {
          bulk_upload_ok: 'candidate-bulk'
        };
        this.openDialog(ShortlistBoxComponent, datas);
      }
    });
  }

  async onSelectFile(event) {
    console.log(event.target.files[0]);

    if (event.target.files && event.target.files[0].type.includes('csv')) {
      this.showSizeError.size = false;
      if (event.target.files[0].size < 200000) {
        this.showSizeError.image = false;
        this.fileName = event.target.files[0]['name'];
        this.fileSize = (Number(event.target.files[0]['size']) / 1024).toFixed(2);
        this.selectedImage = event.target.files[0];

        const fd = new FormData();
        fd.append('file', this.selectedImage);
        const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;
        const reader = new FileReader();
        let urls;
        // console.log(reader.readAsBinaryString(event.target.files[0]));

        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event: any) => { // called once readAsDataURL is completed
          urls = event.target.result;
          this.url = event.target.result;
          console.log(this.url);

          // this.candidateService.signatureUpload(this.selectedImage, file).subscribe((data: any) => {
          //   console.log(data);

          // this.signatureData = {
          //   target_id: data.fid[0].value,
          //   alt: 'signature',
          //   title: '',
          //   width: 480,
          //   height: 100,
          //   localShowUrl: `${this.appConfig.imageBaseUrl()}` + data.uri[0].url,
          //   url: data.uri[0].url,
          //   status: 'true'
          // };
          // this.appConfig.setLocalData('signature', JSON.stringify(this.signatureData));
          // console.log(this.signatureData);

          // this.appConfig.hideLoader();

          // }, (err) => {

          // });

        };
      } else {
        this.showSizeError.image = false;
        this.showSizeError.size = true;
        // this.url = null;
      }
    } else {
      this.showSizeError.size = false;
      this.showSizeError.image = true;
      // this.url = null;
    }
  }

  public delete() {
    this.showSizeError.image = false;
    this.showSizeError.size = false;
    this.url = null;
  }

  // Open dailog
  openDialog1(component, data) {
    let dialogDetails: any;

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.enableList = false;
      if (result) {
      }
    });
  }

}
