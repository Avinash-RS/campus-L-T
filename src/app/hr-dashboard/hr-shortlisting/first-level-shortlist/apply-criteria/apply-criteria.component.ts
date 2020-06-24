import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-apply-criteria',
  templateUrl: './apply-criteria.component.html',
  styleUrls: ['./apply-criteria.component.scss']
})
export class ApplyCriteriaComponent implements OnInit {

  genderShow = true;
  disciplineShow = false;
  specializationShow = false;
  instituteShow = false;
  tabs = [1, 2, 3];
  radioCheck;
  EduLevel = [
    {
      name: 'SSLC',
      checkbox: false
    },
    {
      name: 'HSC',
      checkbox: false
    },
    {
      name: 'Diploma',
      checkbox: false
    },
    {
      name: 'UG',
      checkbox: false
    },
    {
      name: 'PG',
      checkbox: false
    }
  ];

  genderList = [
    {
      name: 'Male',
      checkbox: false
    },
    {
      name: 'Female',
      checkbox: false
    },
    {
      name: 'Other',
      checkbox: false
    }
  ];
  InstituteNameDropDown: any[];
  InstituteNameSearchControl = new FormControl();
  InstituteNameSelectAllCheck = false;
  InstituteNameFilter: any[];
  InstituteNameShowSelectAll = true;
  InstituteNameDropdownList = [];

  constructor() { }
  ngOnInit() {
    this.InstituteNameNgOnInIt();
    this.InstituteNameCustom();
  }

  selectedEducationCheckBox(eduLevel) {
    console.log(eduLevel);

  }

  InstituteNameCustom() {
    this.InstituteNameSearchControl.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((term) => {
        if (term.length > 0) {
          this.InstituteNameShowSelectAll = false;
        } else {
          this.InstituteNameShowSelectAll = true;
        }

        this.InstituteNameSearch(term);
      });
  }

  InstituteNameSearch(value: string) {
    this.InstituteNameDropDown = this.InstituteNameDropdownList.filter(
      option => option['item_text'].toLowerCase().includes(value.toLowerCase())
    );
  }

  InstituteNameCheckboxChanged(selectedins) {
    this.InstituteNameSearchControl.patchValue('');
    setTimeout(() => {
    if (this.InstituteNameSearchControl.value === '') {
    this.InstituteNameDropDown.forEach((data) => {
      if (data.item_id === selectedins.item_id) {
        data.checkbox = !data.checkbox;
      }
    });
    }
    }, 500);
  }
  InstituteNameSelectAll(event) {
    this.InstituteNameDropDown.forEach((data) => {
      if (event.target.checked === true) {
        data.checkbox = true;
      }
      if (event.target.checked === false) {
        data.checkbox = false;
      }
    });

    // this.InstituteNameDropDown = this.InstituteNameFilter;
  }

  InstituteNameNgOnInIt() {
    this.InstituteNameDropdownList = [
      { item_id: 1, item_text: 'Mumbai', checkbox: false },
      { item_id: 2, item_text: 'Bangaluru', checkbox: false },
      { item_id: 3, item_text: 'Pune', checkbox: false },
      { item_id: 4, item_text: 'Navsari', checkbox: false },
      { item_id: 5, item_text: 'New Delhi', checkbox: false },
      { item_id: 5, item_text: 'New Delhi', checkbox: false },
      { item_id: 6, item_text: 'New Delhi', checkbox: false },
      { item_id: 7, item_text: 'New Delhi', checkbox: false },
      { item_id: 8, item_text: 'New Delhi', checkbox: false },
      { item_id: 9, item_text: 'New Delhi', checkbox: false },
      { item_id: 10, item_text: 'New Delhi', checkbox: false },
      { item_id: 11, item_text: 'New Delhi', checkbox: false },
      { item_id: 12, item_text: 'New Delhi', checkbox: false },
      { item_id: 13, item_text: 'New Delhi', checkbox: false },
      { item_id: 14, item_text: 'Chennai', checkbox: false },
      { item_id: 15, item_text: 'New Delhi', checkbox: false },
      { item_id: 16, item_text: 'New Delhi', checkbox: false },
      { item_id: 17, item_text: 'New Delhi', checkbox: false },
      { item_id: 18, item_text: 'Daladj', checkbox: false },
    ];
    this.InstituteNameDropDown = this.InstituteNameDropdownList;
    this.InstituteNameFilter = this.InstituteNameDropdownList;
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
  }


  gender() {
    this.genderShow = true;
    this.disciplineShow = false;
    this.specializationShow = false;
    this.instituteShow = false;
  }

  discipline() {
    this.disciplineShow = !this.disciplineShow;
    this.genderShow = false;
    this.specializationShow = false;
    this.instituteShow = false;
  }

  specialization() {

  }

  institute() {

  }


}
