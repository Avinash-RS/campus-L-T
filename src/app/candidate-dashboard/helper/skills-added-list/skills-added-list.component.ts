import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-skills-added-list',
  templateUrl: './skills-added-list.component.html',
  styleUrls: ['./skills-added-list.component.scss']
})
export class SkillsAddedListComponent implements OnInit, OnChanges, OnDestroy {
  selectedSkills: any[] = [];
  selectedSkillsFetchSubscription: any;

  constructor(
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
    this.fetchSkills();
  }

  ngOnChanges() {
  }

  fetchSkills() {
   this.selectedSkillsFetchSubscription = this.sharedService.selectedSkillsFetch.subscribe((res: any[])=> {
      this.selectedSkills = res.filter(item => item.checked && item.saved);
    }, (err)=> {

    }, () => {
      console.log('completed');
      this.selectedSkillsFetchSubscription.unsubscribe();
    });
  }

  removeSkill(i) {
    this.selectedSkills[i].checked = false;
    this.selectedSkills[i].saved = false;
    this.selectedSkills.splice(i, 1);
  }

  ngOnDestroy() {
    this.selectedSkillsFetchSubscription ? this.selectedSkillsFetchSubscription.unsubscribe() : '';
  }
}
