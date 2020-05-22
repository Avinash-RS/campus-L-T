import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  dummyData = [
    {
      sno: 1,
      name: 'avi',
      checked: false,
      email: 'avi@gmail.com',
      role: 'hr'
    },
    {
      sno: 2,
      name: 'prem',
      checked: false,
      email: 'prem@gmail.com',
      role: 'hr'
    },
    {
      sno: 3,
      name: 'catherine',
      checked: false,
      email: 'catherine@gmail.com',
      role: 'hr'
    },
    {
      sno: 4,
      name: 'hari',
      checked: false,
      email: 'hari@gmail.com',
      role: 'hr'
    },
    {
      sno: 5,
      name: 'pradeep',
      checked: false,
      email: 'pradeep@gmail.com',
      role: 'hr'
    },
    {
      sno: 6,
      name: 'srividhya',
      checked: false,
      email: 'srividhya@gmail.com',
      role: 'hr'
    },
    {
      sno: 7,
      name: 'bala',
      checked: false,
      email: 'bala@gmail.com',
      role: 'hr'
    },
    {
      sno: 8,
      name: 'mohan',
      checked: false,
      email: 'mohan@gmail.com',
      role: 'hr'
    },
    {
      sno: 9,
      name: 'akash',
      checked: false,
      email: 'akash@gmail.com',
      role: 'hr'
    },
    {
      sno: 10,
      name: 'aaron',
      checked: false,
      email: 'aaron@gmail.com',
      role: 'hr'
    }
  ];
  displayedColumns: any[] = ['sno', 'name', 'email', 'role', 'checked'];
  dataSource = new MatTableDataSource(this.dummyData);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectedUser(userId) {
    console.log(userId);
  }

}
