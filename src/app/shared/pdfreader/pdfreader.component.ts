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
    console.log(this.url);
  //  this.pdfSrc =  this.url.path;
   }

  ngOnInit() {
    console.log(this.url.path);
    if (this.url.doc_type === 'application/pdf') {
      this.isEnable = true;
      this.pdfSrc =  this.url.path;
    } else {
      this.isEnable = false;
      this.pdfSrc =  this.url.path;
    }
  }

}
