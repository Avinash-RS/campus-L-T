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
  showResumeImgSizeError = false;
  showEducationImgSizeErr = false;
  showCertificateImgSizeErr = false;
  showOtherImgSizeErr = false;
  urlResume = null;
  urlEducation = [];
  urlCertificate = [];
  urlOther = [];
  educationDropDownLevel: any = [];
  educationDetailsArr = [];
  certificatDetailsArr = [];
  otherDetailsArr = [];
  resumeFile:any;
  showResumeImgError = false;
  showEducationImgErr = false;
  showCertificateImgErr = false;
  showOtherImgErr = false;
  saveAndSubmitBtnDisable = true;
  selectedDropdownValue = [];


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
    this.getUploadedDocument();

    var userid = {
      'id': this.appConfig.getLocalData('userId')
    }
    this.candidateService.getEducationDropDown(userid).subscribe((data: any) => {
      this.educationDropDownLevel = data[0][0].education_level;
      this.appConfig.hideLoader();

    }, (err) => {

    });
  }

  getUploadedDocument(){
    var userid = {
      'id': this.appConfig.getLocalData('userId')
    }
    this.candidateService.getUploadedDocument(userid).subscribe((data: any) => {
      this.certificateValuearray = data[0][0].certificate_array;
      this.otherDocValuearray = data[0][0].other_array;
      this.educationValuearray = data[0][0].education_documents;
      this.selectedDropdownValue = [];
      if(data[0][0].resume_details){
        this.urlResume = data[0][0].resume_details[0].certificate_url;
      }
      this.appConfig.hideLoader();
      this.FormInitialization();

    }, (err) => {

    });
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
    this.eduArr.push(this.createItem(data));
  }

  createItem(edu): any {
    if(edu){
      this.urlEducation.push(edu.certificate_url);
      this.selectedDropdownValue.push(edu.education_level);
      return this.fb.group({

        level: [null ,Validators.required],
        repotcard: [null ,Validators.required]
      });
    }else{
      return this.fb.group({

        level: [null ,Validators.required],
        repotcard: [null ,Validators.required]
      });
    }
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
    if(edu){
      this.urlCertificate.push(edu.certificate_url);
      return this.fb.group({

        certificateName: [edu.certificate_name ,Validators.required],
        certificateFile: [null ,Validators.required]
      });
    }else{
      return this.fb.group({

        certificateName: [null ,Validators.required],
        certificateFile: [null ,Validators.required]
      });
    }
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
    if(edu){
      this.urlOther.push(edu.certificate_url);
      return this.fb.group({

        otherDocName: [edu.description ,Validators.required],
        otherDocFile: [null ,Validators.required]
      });
    }else{
      return this.fb.group({

        otherDocName: [null ,Validators.required],
        otherDocFile: [null ,Validators.required]
      });
    }
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
    this.selectedImage = event.target.files[0];

    const fd = new FormData();
    if(uploadType == 'resume'){
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword'))) {
        this.showResumeImgError = false;
        if(event.target.files[0].size < 5000000){
          this.showResumeImgSizeError = false;
          
          this.urlResume = event.target.files[0].name
          var sendData = fd.append('product_image', this.selectedImage);
          
          this.uploadImage(sendData, uploadType, i);
        }else{
          this.showResumeImgSizeError = true;
        }
      }else{
        this.showResumeImgError = true;
      }
    }else if(uploadType == 'education'){
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword'))) {
        this.showEducationImgErr = false;
        if(event.target.files[0].size < 5000000){
          this.showEducationImgSizeErr = false;
          if(event.target.id == 'file-input-'+ i){
            this.urlEducation[i] = event.target.files[0].name
          }

          var sendData = fd.append('product_image', this.selectedImage);
          
          this.uploadImage(sendData, uploadType, i);
        }else{
          this.showEducationImgSizeErr = true;
        }
      }else{
        this.showEducationImgErr = true;
      }
    }else if(uploadType == 'certificate'){
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword'))) {
        this.showCertificateImgErr = false;
        if(event.target.files[0].size < 5000000){
          this.showCertificateImgSizeErr = false;

          if(event.target.id == 'file-input-2-'+ i){
            this.urlCertificate[i] = event.target.files[0].name
          }

          var sendData = fd.append('product_image', this.selectedImage);
          this.uploadImage(sendData, uploadType, i);
        }else{
          this.showCertificateImgSizeErr = true;
        }
      }else{
        this.showCertificateImgErr = true;
      }
    }else if(uploadType == 'other'){
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword'))) {
        this.showOtherImgErr = false;
        if(event.target.files[0].size < 5000000){
          this.showOtherImgSizeErr = false;

          if(event.target.id == 'file-input-3-'+ i){
            this.urlOther[i] = event.target.files[0].name
          }

          var sendData = fd.append('product_image', this.selectedImage);
          this.uploadImage(sendData, uploadType, i);
        }else{
          this.showOtherImgSizeErr = true;
        }
      }else{
        this.showOtherImgErr = true;
      }
    }
  }

  uploadImage(file, selectType, i){
    this.candidateService.uploadCandidateDocument(file).subscribe((data: any) => {
      
      this.appConfig.hideLoader();

      if(selectType == 'education'){
        var eduObj = {
          'level': this.educationUploadForm.value.educationUploadArr[i].level,
          'uploaded_id': data[0].fileid
        }
        this.educationDetailsArr.push(eduObj);
      }else if(selectType == 'certificate'){
        var cerObj = {
          'document_name': this.certificateUploadForm.value.certificateUploadArr[i].certificateName,
          'uploaded_id': data[0].fileid
        }
        this.certificatDetailsArr.push(cerObj);
      }else if(selectType == 'other'){
        var otherObj = {
          'document_name': this.otherUploadForm.value.otherUploadArr[i].otherDocName,
          'uploaded_id': data[0].fileid
        }
        this.otherDetailsArr.push(otherObj);
      }else{
        this.resumeFile = data[0].fileid
      }

      this.appConfig.success(`Document uploaded submitted`, '');

    }, (err) => {

    });
  }

  uploadFile(clickType) {
    if (this.educationUploadForm.valid && this.resumeUploadForm.valid) {
      var documentObj = {
        'user_id': this.appConfig.getLocalData('userId'),
        'save_type': clickType,
        'education_details': this.educationDetailsArr,
        'certificate_description': this.certificatDetailsArr,
        'other_certificate': this.otherDetailsArr,
        'resume_id': this.resumeFile
      }

      this.candidateService.saveUploadDocument(documentObj).subscribe((data: any) => {
      
        this.appConfig.hideLoader();
  
        this.appConfig.success(`Document uploaded successfully`, '');
  
      }, (err) => {
  
      });

    } else {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      this.validateAllFields(this.resumeUploadForm);
      this.validateAllFormArrays(this.educationUploadForm.get('educationUploadArr') as FormArray);
      this.validateAllFormArrays(this.certificateUploadForm.get('certificateUploadArr') as FormArray);
      this.validateAllFormArrays(this.otherUploadForm.get('otherUploadArr') as FormArray);
    }
  }

  disableBtn(){
    if (this.educationUploadForm.valid && this.resumeUploadForm.valid) {
      this.saveAndSubmitBtnDisable = false;
    }
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
