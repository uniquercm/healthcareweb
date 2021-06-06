import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../commonvaribale/commonvalues';
import Swal from 'sweetalert2'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-drcell',
  templateUrl: './drcell.component.html',
  styleUrls: ['./drcell.component.scss']
})
export class DrcellComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'requestCrmName', 'crmNo', 'patientName', 'callScheduledDate', 'eidNo', 'mobileNo', 'calledDate', 'callStatus', 'remarks', 'emrDone', 'save'];

  dataSource: any = new MatTableDataSource([]);

  title = 'DR Call';
  array = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  fromdate: any = new Date();
  todate: any = new Date();

  requestarray: any[] = [];

  constructor(private router: Router, private commonService: CommonService,
    public datepipe: DatePipe) {
    if (router.url === '/apps/drcell') {
      this.title = 'DR Call';
    } else {
      this.title = 'Nurse Call'; ``
    }
    this.getvalue();
    this.getreq();
  }

  ngOnInit(): void {
  }

  getvalue() {
    let url = 'patient?isDoctorCall=true&isNurseCall=false';
    if (this.router.url === '/apps/drcell') {
      url = 'patient?isDoctorCall=true&isNurseCall=false';
      if (editvalues.drcallid !== 0) {
        url = 'patient?patientId= ' + editvalues.patientid + ' isDoctorCall=true&isNurseCall=false';
      }
    } else {
      url = 'patient?isDoctorCall=false&isNurseCall=true';
      if (editvalues.patientid !== 0) {
        url = 'patient?patientId= ' + editvalues.patientid + ' isDoctorCall=false&isNurseCall=true';
      }
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);
      this.array.forEach((elam: any) => {
        if (elam.emrDone === 'No') {
          elam.emrDone = false
        } else {
          elam.emrDone = true
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

    this.getPatent('');
  }

  getPatent(value: any) {

    let url = 'patient?fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isDoctorCall=true&isNurseCall=false';
    if (this.router.url === '/apps/drcell') {
      url = 'patient?fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isDoctorCall=true&isNurseCall=false';
      if (editvalues.drcallid !== 0) {
        url = 'patient?patientId= ' + editvalues.patientid + '&fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isDoctorCall=true&isNurseCall=false';
      }
    } else {
      url = 'patient?fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isDoctorCall=false&isNurseCall=true';
      if (editvalues.patientid !== 0) {
        url = 'patient?patientId= ' + editvalues.patientid + '&fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isDoctorCall=false&isNurseCall=true';
      }
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);
      this.array.forEach((elam: any) => {
        if (elam.emrDone === 'No') {
          elam.emrDone = false
        } else {
          elam.emrDone = true
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  save(element: any) {
    let map = {
      "callId": element.callId,
      "scheduledId": element.scheduledId,
      "callScheduledDate": this.datepipe.transform(element.callScheduledDate, 'MM-dd-yyyy'),
      "calledDate": this.datepipe.transform(element.calledDate, 'MM-dd-yyyy'),
      "callStatus": element.callStatus,
      "remarks": element.remarks,
      "emrDone": element.emrDone === true ? 'yes' : 'no',
      "createdBy": this.localvalues.userId,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": true
    }

    this.commonService.putmethod('call', map).subscribe((data) => {
      Swal.fire('SUCCESS', 'Saved Sucessfully', 'success')
    }, err => {
      console.log(err);
    })

  }

  ngOnDestroy() {
    editvalues.drcallid = 0;
    editvalues.scheduleid = 0;
    editvalues.patientid = 0;
  }
}

const array = [
  {
    no: 1,
    crmtype: 'HQP',
    crmno: '1234',
    name: 'Mohmamed',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865',
    address: '',
    staus: '',
    done: '',
    date: ''
  },
  {
    no: 2,
    crmtype: 'HIP',
    crmno: '4589',
    name: 'Anitha',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865',
    address: '',
    staus: '',
    done: '',
    date: ''
  },
  {
    no: 3,
    crmtype: 'HIP',
    crmno: '5789',
    name: 'Kesavan',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865',
    address: '',
    staus: '',
    done: '',
    date: ''
  },
  {
    no: 4,
    crmtype: 'HQP',
    crmno: '8699',
    name: 'Alina',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865',
    address: '',
    staus: '',
    done: '',
    date: ''
  },
  {
    no: 5,
    crmtype: 'CRM',
    crmno: '2019',
    name: 'Ramya',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865',
    address: '',
    staus: '',
    done: '',
    date: ''
  }
]