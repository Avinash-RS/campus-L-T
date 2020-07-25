import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTableModule } from '@angular/material/table';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatSortModule } from '@angular/material/sort';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import {MatIconModule} from '@angular/material/icon';
// import {MatButtonModule} from '@angular/material/button';
// import {MatSnackBarModule} from '@angular/material/snack-bar';
// import {MatTooltipModule} from '@angular/material/tooltip';
// import { ScrollingModule } from '@angular/cdk/scrolling';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import {MatSidenavModule} from '@angular/material/sidenav';
// import {MatRadioModule} from '@angular/material/radio';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import {MatCheckboxModule} from '@angular/material/checkbox';
// import { MatTabsModule } from '@angular/material/tabs';
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
  MatRadioModule,
  MatDialogModule,
  MatTooltipModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatDatepickerModule
} from '@angular/material';
import {MatNativeDateModule} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    ScrollingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMomentDateModule,
    MatNativeDateModule
  ],
  exports: [
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    ScrollingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMomentDateModule,
    MatNativeDateModule
  ]
})
export class MaterialModule { }
