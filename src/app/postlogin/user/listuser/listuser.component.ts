import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { edituser } from '../../commonvaribale/commonvalues';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss']
})
export class ListuserComponent implements OnInit {
  array = [];
  displayedColumns: string[] = ['uname', 'password', 'usertype', 'cname', 'edit'];
  dataSource: any = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  fromdate: any;
  todate: any;

  requestarray: any[] = [];
  area: any[] = [];


  constructor(private router: Router, private commonService: CommonService) { 
    this.getuser();
  }

  ngOnInit(): void {
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getuser() {
    this.commonService.getmethod('user').subscribe((data) => {
      this.array = data.details;
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    })
  }

  change(element: any) {
    edituser.edit = element;
    this.router.navigateByUrl('/apps/edit-user');
  }

  delete(element: any) {
    let map = {
      "id": element.userId,
      "deletedBy": this.localvalues.userName
    }

    this.commonService.deletemethod('user', map).subscribe((data) => {
      alert('Deleted Successfully');
    }, err => {
      console.log(err);
    })
  }
}
