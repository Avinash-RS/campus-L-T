import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service'

@Component({
  selector: 'app-candidate-upload-document',
  templateUrl: './candidate-upload-document.component.html',
  styleUrls: ['./candidate-upload-document.component.scss']
})
export class CandidateUploadDocumentComponent implements OnInit {

  educationValuearray: any =[];
  certificateValuearray: any =[];
  otherDocValuearray: any = [];
  selectedImage: any;
  showImgSizeError = false;
  urlResume = null;
  urlEducation = [];
  urlCertificate = [];
  urlOther = [];


  resumeUploadForm = new FormGroup({
    resume: new FormControl()
  })
  educationUploadForm: FormGroup;
  certificateUploadForm: FormGroup;
  otherUploadForm: FormGroup;


  constructor(private fb: FormBuilder,
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService) { }

  ngOnInit() {
    this.FormInitialization();
  }

  uploadFile(resumeUploadForm, educationUploadForm, certificateUploadForm, otherUploadForm) {

  }

  educationPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(edu => {
        this.addEducationForm(edu);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addEducationForm(null);
      }
    }
  }

  FormInitialization() {
    this.educationUploadForm = this.fb.group({
      educationUploadArr: this.fb.array([])
    }), this.educationPatch(this.educationValuearray);

    this.certificateUploadForm = this.fb.group({
      certificateUploadArr: this.fb.array([])
    }), this.certificatePatch(this.certificateValuearray);

    this.otherUploadForm = this.fb.group({
      otherUploadArr: this.fb.array([])
    }), this.otherDocPatch(this.otherDocValuearray);
  }

  get eduArr() { return this.educationUploadForm.get('educationUploadArr') as FormArray; }

  addEducationForm(data?: any) {
    console.log("ptint index education..", data);
    this.eduArr.push(this.createItem(data));
  }

  createItem(edu): any {
    return this.fb.group({

      level: [null ,Validators.required],
      repotcard: [null ,Validators.required]
    });
  }

  removeEducationDoc(i: number){
    this.urlEducation.splice(i, 1);
    this.eduArr.removeAt(i);
  }

  certificatePatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(certi => {
        this.addCertificateForm(certi);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addCertificateForm(null);
      }
    }
  }

  get certiArr() { return this.certificateUploadForm.get('certificateUploadArr') as FormArray; }

  addCertificateForm(data?: any) {
    this.certiArr.push(this.createCertificateItem(data));
  }

  createCertificateItem(edu): any {
    return this.fb.group({

      certificateName: [null ,Validators.required],
      certificateFile: [null ,Validators.required]
    });
  }


  removeCertificate(i: number){
    this.urlCertificate.splice(i, 1);
    this.certiArr.removeAt(i);
  }

  otherDocPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(otherDoc => {
        this.addOtherDocForm(otherDoc);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addOtherDocForm(null);
      }
    }
  }

  get otherDocArr() { return this.otherUploadForm.get('otherUploadArr') as FormArray; }

  addOtherDocForm(data?: any) {
    this.otherDocArr.push(this.createOtherDocItem(data));
  }

  createOtherDocItem(edu): any {
    return this.fb.group({

      otherDocName: [null ,Validators.required],
      otherDocFile: [null ,Validators.required]
    });
  }

  removeOtherDoc(i: number){
    this.urlOther.splice(i, 1);
    this.otherDocArr.removeAt(i);
  }
  stoppropgation(e:Event){
    e.preventDefault();
    e.stopPropagation();
  }

  onSelectFile(event, uploadType, i){
    // if (this.educationUploadForm.valid && this.resumeUploadForm.valid && this.certificateUploadForm.valid && this.otherUploadForm) {
      if (event.target.files[0].size < 5000000) {
        this.showImgSizeError = false;
        this.selectedImage = event.target.files[0];

        const fd = new FormData();
        if(uploadType == 'resume'){
          this.urlResume = event.target.files[0].name
          fd.append('product_image', this.selectedImage);
          fd.append('upload_type', "resumes");
          fd.append('user_id', this.appConfig.getLocalData('userId'));
        }else if(uploadType == 'education'){
          if(event.target.id == 'file-input-'+ i){
            this.urlEducation[i] = event.target.files[0].name
          }

          fd.append('product_image', this.selectedImage);
          fd.append('upload_type', "education_documents");
          fd.append('user_id', this.appConfig.getLocalData('userId'));
          fd.append('education_level', this.educationUploadForm.value.educationUploadArr[0].level);
        }else if(uploadType == 'certificate'){
          if(event.target.id == 'file-input-2-'+ i){
            this.urlCertificate[i] = event.target.files[0].name
          }

          fd.append('product_image', this.selectedImage);
          fd.append('upload_type', "certificate_details");
          fd.append('user_id', this.appConfig.getLocalData('userId'));
          fd.append('certificate_name', this.certificateUploadForm.value.certificateUploadArr[0].certificateName);
        }else if(uploadType == 'other'){
          if(event.target.id == 'file-input-3-'+ i){
            this.urlOther[i] = event.target.files[0].name
          }

          fd.append('product_image', this.selectedImage);
          fd.append('upload_type', "other_certificate");
          fd.append('user_id', this.appConfig.getLocalData('userId'));
          fd.append('certificate_name', this.otherUploadForm.value.otherUploadArr[0].otherDocName);
        }

        const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;

        this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {
          // this.url = null;
          this.appConfig.hideLoader();
          this.appConfig.success(`Document uploaded submitted`, '');

        }, (err) => {

        });

      } else {
        this.showImgSizeError = true;
        // this.url = null;
      }

    // } else {
    //   this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
    //   this.validateAllFields(this.resumeUploadForm);
    //   this.validateAllFormArrays(this.educationUploadForm.get('educationUploadArr') as FormArray);
    //   this.validateAllFormArrays(this.certificateUploadForm.get('certificateUploadArr') as FormArray);
    //   this.validateAllFormArrays(this.otherUploadForm.get('otherUploadArr') as FormArray);
    // }
  }


  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          // if (control['status'] === 'INVALID') {
          //   console.log(control);
          //   this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          // }
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });

    });
  }


  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
