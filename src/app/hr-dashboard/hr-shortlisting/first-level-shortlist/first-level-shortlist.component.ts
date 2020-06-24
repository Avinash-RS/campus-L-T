import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-first-level-shortlist',
  templateUrl: './first-level-shortlist.component.html',
  styleUrls: ['./first-level-shortlist.component.scss']
})
export class FirstLevelShortlistComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  ngDropDown: any[];
  searchControl = new FormControl();
  selectAllCheck = false;
  ngDropDownFilter: any[];
  showSelectAll = true;
  showCriteria = false;
  constructor() { }

  ngOnInit() {

    this.dropDownNgOnInIt();
    this.custom();
  }

  candidateChildEmittedData(emittedData) {
    console.log(emittedData);
    this.showCriteria = true;
  }

  custom() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((term) => {
        if (term.length > 0) {
          this.showSelectAll = false;
        } else {
          this.showSelectAll = true;
        }

        this.search(term);
      });
  }

  search(value: string) {
    this.ngDropDown = this.dropdownList.filter(
      option => option['item_text'].toLowerCase().includes(value.toLowerCase())
    );
  }

  checkboxChanged(selectedins) {
    this.searchControl.patchValue('');
    setTimeout(() => {
    if (this.searchControl.value === '') {
    this.ngDropDown.forEach((data) => {
      if (data.item_id === selectedins.item_id) {
        data.checkbox = !data.checkbox;
      }
    });
    }
    }, 500);
  }
  selectAll(event) {
    this.ngDropDown.forEach((data) => {
      if (event.target.checked === true) {
        data.checkbox = true;
      }
      if (event.target.checked === false) {
        data.checkbox = false;
      }
    });

    // this.ngDropDown = this.ngDropDownFilter;
  }

  dropDownNgOnInIt() {
    this.dropdownList = [
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
    this.ngDropDown = this.dropdownList;
    this.ngDropDownFilter = this.dropdownList;
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

}
