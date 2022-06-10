import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, take, filter, toArray, tap, map, delay } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as _ from 'lodash';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-skills-master-dialog',
  templateUrl: './skills-master-dialog.component.html',
  styleUrls: ['./skills-master-dialog.component.scss']
})
export class SkillsMasterDialogComponent implements OnInit {
  unSavedSkills = [];
  skillTerm = new FormControl(null, [Validators.maxLength(100)]);
  skillMasterResult: any[];
  maxLength = 50;
  loading: boolean;
  constructor(public dialogRef: MatDialogRef<SkillsMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private sharedService: SharedServiceService, private adminService: AdminServiceService, private appConfig: AppConfigService) { }

  ngOnInit() {
    this.SkillTermvalueChanges();
    this.skillMasterApi();
  }

  SkillTermvalueChanges() {
    this.skillTerm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((res: any)=> {
      if (this.skillTerm.valid) {
      this.skillMasterApi(res);
      }
    });
  }

  skillMasterApi(term?: any) {
    this.loading = true;
    let skill$ = this.adminService.getSkills({searchText: term ? term : null});
    let skillLimit$ = skill$.pipe(
      map((data: any)=> {
        if (data.success) {
          let skills = data.data;
          return skills;
        } else {
          this.appConfig.error(data.message);
          return [];
        }
      }),
      filter((data: any, index) => {
        if (term) {
          return data.filter((data => data.skillName.toLowerCase().includes(term.toLowerCase())));
        }
        return index < this.maxLength;
      }),
      filter((data, index) => index < this.maxLength),
      tap(results => {
        results.sort((a, b)=> {
          return a.skillName < b.skillName ? -1 : 1;
        })
      }),
      map((data)=> {
        if (data.length < 1) {
          let isAlreadyExist = this.dialogData.skills.find(item => item.skillName.toLowerCase() === term.toLowerCase());
          if (isAlreadyExist) {
            data.unshift(isAlreadyExist);
            data.length > this.maxLength ? data.pop() : '';
            return data;
          }
          return [{skillName: term, value: term, newSkill: true}];
        } 
        else {
          if (term && term.length >= 2) {
            let isAlreadyExist = data.filter(item => item.skillName.toLowerCase() === term.toLowerCase());
            if (isAlreadyExist.length < 1) {
              data.unshift({skillName: term, value: term, newSkill: true});
              data.length > this.maxLength ? data.pop() : '';
            }
          }
          data = _.map(data, (item) => {
            let index = this.dialogData.skills.findIndex(q => q.skillName.toLowerCase() == item.skillName.toLowerCase());
             if (index != -1) {
               item.checked = true;
               return item?.newSkill ? this.dialogData.skills[index] : item;
             }
               return item;
           });
        }
        return data;
      }),
    ).subscribe((res) => {
      this.loading = false;
      this.skillMasterResult = res;
      this.unSavedSkills = this.dialogData.skills;
      console.log('ad', res);
    }, (err) => {
        this.loading = false;
    }, () => skillLimit$ ? skillLimit$.unsubscribe() : '');
  }

  selectSkill(skill) {
    skill.checked = skill?.checked == true ? false : true;
    let unSavedSkillsItemindex = this.unSavedSkills.findIndex(q => q.skillName.toLowerCase() == skill.skillName.toLowerCase());
    if (skill.checked) {
      unSavedSkillsItemindex == -1 ? this.unSavedSkills.push(skill) : '';
    }
    unSavedSkillsItemindex >= 0 ? this.unSavedSkills.splice(unSavedSkillsItemindex, 1) : '';
  }

  saveSkills() {
    let mappedsavedSkill = this.unSavedSkills.map((data) => {
      let index = this.skillMasterResult.findIndex(q => q.skillName.toLowerCase() == data.skillName.toLowerCase());
      if (index != -1) {
        data = this.skillMasterResult[index];
      }
      data.saved = true;
      return data;
    });
    console.log('saved', mappedsavedSkill);
    this.sharedService.selectedSkillsFetch.next(mappedsavedSkill);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
