import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, take, filter, toArray, tap, map, mergeAll } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-skills-master-dialog',
  templateUrl: './skills-master-dialog.component.html',
  styleUrls: ['./skills-master-dialog.component.scss']
})
export class SkillsMasterDialogComponent implements OnInit {
  skillData = [  
    {  
      "name":"Analytical ability",
      "category":"Methodological Competences"
    },
    {  
      "name":"Acquisition skills",
      "category":"Social Competences"
    },
    {  
      "name":"Adaptability",
      "category":"Personal Competences"
    },
    {  
      "name":"Execution willingness",
      "category":"Personal Competences"
    },
    {  
      "name":"Resilience",
      "category":"Personal Competences"
    },
    {  
      "name":"Advice ability",
      "category":"Social Competences"
    },
    {  
      "name":"Relationship Management / Networks",
      "category":"Social Competences"
    },
    {  
      "name":"Charisma",
      "category":"Personal Competences"
    },
    {  
      "name":"Discipline",
      "category":"Personal Competences"
    },
    {  
      "name":"Assertiveness",
      "category":"Personal Competences"
    },
    {  
      "name":"Empathy",
      "category":"Social Competences"
    },
    {  
      "name":"Commitment and dedication",
      "category":"Personal Competences"
    },
    {  
      "name":"Decisiveness",
      "category":"Personal Competences"
    },
    {  
      "name":"Give feedback",
      "category":"Advice ability"
    },
    {  
      "name":"Flexibility",
      "category":"Personal Competences"
    },
    {  
      "name":"Self-reflection ability",
      "category":"Personal Competences"
    },
    {  
      "name":"Leadership",
      "category":"Methodological Competences"
    },
    {  
      "name":"Holistic thinking",
      "category":"Personal Competences"
    },
    {  
      "name":"Patience",
      "category":"Personal Competences"
    },
    {  
      "name":"Gender competence / diversity",
      "category":"Social Competences"
    },
    {  
      "name":"Credibility",
      "category":"Personal Competences"
    },
    {  
      "name":"Helpfulness",
      "category":"Personal Competences"
    },
    {  
      "name":"Identification with value system / tasks",
      "category":"Personal Competences"
    },
    {  
      "name":"Initiative and energy",
      "category":"Personal Competences"
    },
    {  
      "name":"Ability to integrate",
      "category":"Social Competences"
    },
    {  
      "name":"Intercultural Competence",
      "category":"Social Competences"
    },
    {  
      "name":"Communication skills",
      "category":"Social Competences"
    },
    {  
      "name":"Conflict resolution ability",
      "category":"Social Competences"
    },
    {  
      "name":"Concept Development",
      "category":"Methodological Competences"
    },
    {  
      "name":"Ability to cooperate",
      "category":"Social Competences"
    },
    {  
      "name":"Creativity Techniques",
      "category":"Methodological Competences"
    },
    {  
      "name":"Critical faculties",
      "category":"Social Competences"
    },
    {  
      "name":"Customer focus",
      "category":"Social Competences"
    },
    {  
      "name":"Lifelong learning",
      "category":"Personal Competences"
    },
    {  
      "name":"Willingness to learn",
      "category":"Personal Competences"
    },
    {  
      "name":"Logical thinking",
      "category":"Personal Competences"
    },
    {  
      "name":"Solution-oriented",
      "category":"Social Competences"
    },
    {  
      "name":"People skills",
      "category":"Personal Competences"
    },
    {  
      "name":"Moderation and conversation techniques",
      "category":"Methodological Competences"
    },
    {  
      "name":"Motivation",
      "category":"Personal Competences"
    },
    {  
      "name":"Oral and written expressiveness",
      "category":"Personal Competences"
    },
    {  
      "name":"Openness",
      "category":"Personal Competences"
    },
    {  
      "name":"Organizational capacity",
      "category":"Methodological Competences"
    },
    {  
      "name":"Project implementation",
      "category":"Methodological Competences"
    },
    {  
      "name":"Independence",
      "category":"Personal Competences"
    },
    {  
      "name":"Personal responsibility",
      "category":"Personal Competences"
    },
    {  
      "name":"Confident appearance",
      "category":"Personal Competences"
    },
    {  
      "name":"Care",
      "category":"Personal Competences"
    },
    {  
      "name":"Stress Management and Time Management",
      "category":"Methodological Competences"
    },
    {  
      "name":"Teamwork",
      "category":"Social Competences"
    },
    {  
      "name":"Tolerance",
      "category":"Social Competences"
    },
    {  
      "name":"Transferability",
      "category":"Personal Competences"
    },
    {  
      "name":"Environmental Awareness",
      "category":"Methodological Competences"
    },
    {  
      "name":"Sense of responsibility",
      "category":"Social Competences"
    },
    {  
      "name":"Successfully negotiate",
      "category":"Methodological Competences"
    },
    {  
      "name":"Management experience",
      "category":"Methodological Competences"
    },
    {  
      "name":"Change capacity",
      "category":"Personal Competences"
    },
    {  
      "name":"Visualization and presentation techniques",
      "category":"Methodological Competences"
    },
    {  
      "name":"Knowledge Management",
      "category":"Methodological Competences"
    },
    {  
      "name":"Sustainability - anticipatory thinking",
      "category":"Methodological Competences"
    },
    {  
      "name":"Reliability",
      "category":"Personal Competences"
    },
    {  
      "name":"Having the overview",
      "category":"Personal Competences"
    },
    {  
      "name":"Persuasiveness",
      "category":"Social Competences"
    }
  ];
  skillTerm = new FormControl(null);
  skillMasterResult: any[];
  constructor(public dialogRef: MatDialogRef<SkillsMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedServiceService) { }

  ngOnInit() {
    this.SkillTermvalueChanges();
    this.skillMasterApi();
  }

  SkillTermvalueChanges() {
    this.skillTerm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((res: any)=> {
      this.skillMasterApi(res);
    });
  }

  skillMasterApi(term?: any) {
    let skill$ = of(...this.skillData);
    let skillLimit$ = skill$.pipe(
      filter((data: any, index) => {
        if (term) {
          return data.name.toLowerCase().includes(term.toLowerCase());
        }
        return index < 20;
      }),
      filter((data, index) => index < 20),
      toArray(),
      tap(results => {
        results.sort((a, b)=> {
          return a.name < b.name ? -1 : 1;
        })
      }),
      map((data)=> {
        console.log('data', data);
        if (data.length < 1) {
          return [{name: term, value: term, newSkill: true}];
        } 
        // else {
        //   data.forEach((item)=> {

        //   });
        // }
        return data;
      }),
    ).subscribe((res) => {
      this.skillMasterResult = res;
      console.log('ad', res);
    })
  }

  selectSkill(skill) {
    skill.checked = skill?.checked == true ? false : true;
  }
  saveSkills() {
    let savedSkill = this.skillMasterResult.filter((res) => res?.checked);
    console.log('saved', savedSkill);
    this.sharedService.selectedSkillsFetch.next(savedSkill);
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
}
