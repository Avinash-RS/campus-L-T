import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsMasterDialogComponent } from '../skills-master-dialog/skills-master-dialog.component';
import { SkillsAddedListComponent } from '../skills-added-list/skills-added-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [SkillsMasterDialogComponent, SkillsAddedListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    SkillsMasterDialogComponent,
    SkillsAddedListComponent
  ],
  entryComponents: [SkillsMasterDialogComponent]
})
export class HelperModule { }
