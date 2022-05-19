import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-skills-added-list',
  templateUrl: './skills-added-list.component.html',
  styleUrls: ['./skills-added-list.component.scss']
})
export class SkillsAddedListComponent implements OnInit {
  selectedSkills: any[];

  constructor(
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
    this.fetchSkills();
  }

  fetchSkills() {
    this.sharedService.selectedSkillsFetch.pipe().subscribe((res: any[])=> {
      this.selectedSkills = res;
    });
  }

  removeSkill(i) {
    this.selectedSkills.splice(i, 1);
  }
}
