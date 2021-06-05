import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../../commonvaribale/commonvalues';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss']
})
export class NurseComponent implements OnInit {

  displayedColumns: string[] = ['no', 'crmno', 'sdate', 'name', 'eid', 'mobile', 'view'];
  dataSource: any = new MatTableDataSource([]);

  title = 'DR Call';
  array = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(private router: Router, private commonService: CommonService) {
    this.getvalue();
  }

  ngOnInit(): void {
  }

  getvalue() {
    let date = new Date();
    let url = 'patient?isDoctorCall=false&isNurseCall=true';;
   
    if (editvalues.patientid !== 0) {
      url = 'patient?patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=true';
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any,i)=>o.id=i+1);

      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.array.length === 0) {
        alert('No data Found');
      }
    }, err => {
      console.log(err);
    })

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  save(element: any) {
    let map = {
      "callId": editvalues.drcallid,
      "scheduledId": editvalues.scheduleid,
      "callScheduledDate": element.callScheduledDate,
      "calledDate": element.calledDate,
      "callStatus": element.status,
      "remarks": element.address,
      "emrDone": element.emrDone,
      "createdBy": this.localvalues.userId,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": true
    }

    this.commonService.postmethod('call', map).subscribe((data) => {
      alert('Saved successfully')
    }, err => {
      console.log(err);
    })

  }

  click(element: any) {
    editvalues.patientid = element.patientId
  }
}

