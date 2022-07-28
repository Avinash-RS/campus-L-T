import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, forwardRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.scss'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => ChooseTemplateComponent),  // replace name as appropriate
  //     multi: true
  //   }
  // ]
})
export class ChooseTemplateComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stageWiseDetails: any;
  @Input() stepperIndex: any;

  editorConfig: AngularEditorConfig = {
      editable: false,
      spellcheck: true,
      height: 'auto',
      minHeight: '250px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: false,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
    //   customClasses: [
    //   {
    //     name: 'quote',
    //     class: 'quote',
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: 'titleText',
    //     class: 'titleText',
    //     tag: 'h1',
    //   },
    // ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'],
      ['strikeThrough',
      'subscript',
      'superscript', 'toggleEditorMode']
      // ['bold', 'italic'],
      // ['fontSize']
    ]
};

toolbarHiddenButtons: [
  [
    'undo',
    'redo',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'subscript',
    'superscript',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'justifyFull',
    'indent',
    'outdent',
    'insertUnorderedList',
    'insertOrderedList',
    'heading',
    'fontName'
  ],
  [
    'fontSize',
    'textColor',
    'backgroundColor',
    'customClasses',
    'link',
    'unlink',
    'insertImage',
    'insertVideo',
    'insertHorizontalRule',
    'removeFormat',
    'toggleEditorMode'
  ]
];
  htmlContent: any = '';
  // `
  // <div style="margin-top: 0em">Thank you for your interest in a career with L&T. We have reviewed your application. Unfortunately you are not the right fit for the position at this time. We will considered your profile for any future opportunities at L&T.</div>
  // <div style="margin-top: 1em">Wishing you all the Best !</div> 
  // <div style="margin-top: 1em">Thanks,</div> 
  // <div style="margin-top: 0">Campus Recruitment Team</div>
  // <div style="margin-top: 2em; position: relative; display: inline-block;" contentEditable="false" readonly>Note: This is an auto generated email. Kindly do not reply / respond to this email. For any further queries, please contact assess.support@lntedutech.com.</div>`;
  selectedValue = '';
  selectedSubject = new FormControl({value: 'Custom Subject', disabled: true});
  templateList: any = [];
  activeTemplate: any;
  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.stepperIndex == 1 && this.stageWiseDetails && this.stageWiseDetails.selectedValue) {
      let stageDetail = {
        selectedCandidates: this.stageWiseDetails.gridApi.getSelectedNodes() ? this.stageWiseDetails.gridApi.getSelectedNodes() : [],
        selectedStageValue: this.stageWiseDetails.selectedValue,
        stagesList: this.stageWiseDetails.stagesList
      };
      this.getSelectedStageName(stageDetail.selectedStageValue, stageDetail.stagesList);
    }
  }

  getSelectedStageName(id, data) {
    let selectedLabel = data
    .filter((element) => 
      element.stages.some((subElement) => subElement.stage_id.toString() == id.toString()))
    .map(element => {
      let newElt = Object.assign({}, element); // copies element
      return newElt.stages.filter(subElement => subElement.stage_id.toString() == id.toString());
    });
    this.selectedValue = selectedLabel[0][0].stage_name;
    this.getTemplateBasedonStageId(id);
  }

  getTemplateBasedonStageId(id) {
    this.adminService.getTemplatesBasedonStageId({stage_id: id}).subscribe((res: any)=> {
      this.templateList = res && res.length > 0 ? res : [];
      this.selectedTemplate(this.templateList[0]);
    }, (err)=> {

    });
  }

  selectedTemplate(template) {
    this.activeTemplate = template;
    this.selectedSubject.setValue(template?.email_content?.subject_line);
    this.htmlContent = template?.email_content?.body_content;
  }

  
  ngOnDestroy(): void {
  }

}
