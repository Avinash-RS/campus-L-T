import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pdfreader',
  templateUrl: './pdfreader.component.html',
  styleUrls: ['./pdfreader.component.scss']
})
export class PdfreaderComponent implements OnInit {
  pdfSrc: string;
  // tslint:disable-next-line:no-input-rename
  @Input('url') url: any;
  isEnable = false;
  constructor() {
  //  this.pdfSrc =  this.url.path;
   }

  ngOnInit() {
    if (this.url.doc_type === 'application/pdf') {
      this.isEnable = true;
      this.pdfSrc =  this.url.path;
    } else {
      this.isEnable = false;
      this.pdfSrc =  this.url.path;
    }
  }

}
