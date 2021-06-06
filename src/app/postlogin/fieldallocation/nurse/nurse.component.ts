import { DatePipe } from '@angular/common';
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
  requestarray: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  fromdate: any = new Date();
  todate: any = new Date();

  constructor(private router: Router, private commonService: CommonService, public datepipe: DatePipe) {
    this.getvalue();
    this.getreq();
  }

  ngOnInit(): void {
  }


  getreq() {
    this.commonService.getmethod('requestCRM').subscribe((data) => {
      this.requestarray = data.details;
    }, err => {
      console.log(err);
    })
  }

  clear(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';

    this.getvalue();
  }

  getvalue() {
    let url = 'doctor-nurse-team-call?isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false';
    if (this.router.url === '/apps/drcell') {
      url = 'doctor-nurse-team-call?isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false';
      if (editvalues.drcallid !== 0) {
        // url = 'patient?patientId= ' + editvalues.patientid + ' isDoctorCall=true&isNurseCall=false';
        url = 'doctor-nurse-team-call?isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false';
      }
    } else {
      url = 'doctor-nurse-team-call?isDoctorCall=false&isNurseCall=true&callStatus=all&isFieldAllow=false';
      if (editvalues.patientid !== 0) {
        // url = 'patient?patientId= ' + editvalues.patientid + ' isDoctorCall=false&isNurseCall=true';
        url = 'doctor-nurse-team-call?isDoctorCall=false&isNurseCall=true&callStatus=all&isFieldAllow=false';
      }
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);
      this.array.forEach((elam: any) => {
        if (elam.emrDone === 'yes') {
          elam.emrDone = true
        } else {
          elam.emrDone = false
        }
        if (elam.calledDate === '0001-01-01T00:00:00') {
          elam.calledDate = ''
        }
      });
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


  getPatent(value: any) {
    let url = 'doctor-nurse-team-call?isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false&fromDate='
      + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')

    if (this.router.url === '/apps/drcell') {
      url = 'doctor-nurse-team-call?isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      if (editvalues.drcallid !== 0) {
        url = 'doctor-nurse-team-call?isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false&fromDate='
          + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      }
    } else {
      url = 'doctor-nurse-team-call?isDoctorCall=false&isNurseCall=true&callStatus=all&isFieldAllow=false&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      if (editvalues.patientid !== 0) {
        url = 'doctor-nurse-team-call?isDoctorCall=false&isNurseCall=true&callStatus=all&isFieldAllow=false&fromDate='
          + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      }
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);
      this.array.forEach((elam: any) => {
        if (elam.emrDone === 'yes') {
          elam.emrDone = true
        } else {
          elam.emrDone = false
        }
      });
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
    editvalues.nurse = element;
  }

  select(event: any) {
    let farray: any = [];
    this.array.forEach((element: any) => {
      if (element.requestId === Number(event.value)) {
        farray.push(element);
      }
    });

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

