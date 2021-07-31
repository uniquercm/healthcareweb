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

  fromdate: any = '';
  todate: any = '';

  requestarray: any[] = [];

  constructor(private router: Router, private commonService: CommonService,
    public datepipe: DatePipe) {
    if (router.url === '/apps/drcell') {
      this.title = 'DR Call';
    } else {
      this.title = 'Nurse Call';
    }
    this.getvalue();
    this.getarea();
    this.getCity();
    this.getreq();
  }

  ngOnInit(): void {
  }


  keyword = 'areaName';
  getarea() {
    this.commonService.getmethod('area').subscribe((data) => {
      let array;
      array = data.details;
      let map = {
        areaName: 'All',
        areaId: 'all'
      }
      this.area.push(map)
      array.forEach((element: any) => {
        if (element.areaName === null) {

        } else if (element.areaName === undefined) {

        }
        else if (element.areaName === '') {

        } else {
          this.area.push(element)
        }

      });

    }, err => {
      console.log(err);
    })
  }

  city: any[] = [];
  getCity() {
    this.commonService.getmethod('city').subscribe((data) => {
      this.city = data.details;
    }, err => {
      console.log(err);
    })
  }

  selectarea(name: string, event: any) {
    let farray: any = [];
    if (name === 'case') {
      this.array.forEach((element: any) => {
        if (element.requestId === Number(event.value)) {
          farray.push(element);
        }
      });
    } else if (name === 'area') {
      if (event === 'All') {
        farray = this.array;

        this.dataSource = new MatTableDataSource(farray);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        return;
      }
      this.array.forEach((element: any) => {
        if (element.area === (event.value)) {
          farray.push(element);
        }
      });
    } else if (name === 'city') {
      this.array.forEach((element: any) => {
        if (element.cityId === Number(event)) {
          farray.push(element);
        }
      });
    } else if (name === 'status') {
      this.array.forEach((element: any) => {
        if (element.recptionCallStatus === Number(event.value)) {
          farray.push(element);
        }
      });
    } else {
      this.array.forEach((element: any) => {
        if (event.value === 'yes') {
          if (element.googleMapLink !== '')
            farray.push(element);
        } else if (event.value === 'no') {
          if (element.googleMapLink === '')
            farray.push(element);
        } else {
          farray.push(element);
        }
      });
    }

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getvalue() {
    let url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false';
    if (this.router.url === '/apps/drcell') {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=all&isFieldAllow=false';
    } else {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=nurse&callStatus=all&isFieldAllow=false';
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);
      this.array.forEach((elam: any) => {
        if (elam.emrDone === 'yes') {
          elam.emrDone = true;
        } else {
          elam.emrDone = false;
        }
        if (elam.calledDate === '0001-01-01T00:00:00') {
          elam.calledDate = '';
        }
        if (elam.callStatus === '' || elam.callStatus === null) {
          elam.callStatus = 'pending';
        }
      });
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.array.length === 0) {

        this.dataSource = new MatTableDataSource([]);
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

  clear(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any, calls: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
    calls.value = '';
    this.fromdate = '';
    this.todate = '';

    this.getPatent('');
  }

  clearf(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
  }


  clearcase(input: any, mobile: any, eid: any, crmno: any, area: any, region: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
  }

  area: any[] = [];

  getPatent(value: any) {
    let url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false&fromDate='
      + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')

    if (this.router.url === '/apps/drcell') {
      if (this.fromdate === '') {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=all&isFieldAllow=false';
      } else {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=all&isFieldAllow=false&fromDate='
          + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      }

      if (editvalues.drcallid !== 0) {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=nurse&callStatus=all&isFieldAllow=false';
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=nurse&callStatus=all&isFieldAllow=false&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
        }
      }
    } else {
      if (this.fromdate === '') {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=false&isNurseCall=tru&callStatus=all&isFieldAllow=false';
      } else {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=false&isNurseCall=true&callStatus=all&isFieldAllow=false&fromDate='
          + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      }
      if (editvalues.patientid !== 0) {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=false&isNurseCall=tru&callStatus=all&isFieldAllow=false';
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=false&isNurseCall=true&callStatus=all&isFieldAllow=false&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
        }
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
        this.dataSource = new MatTableDataSource([]);

        alert('No data Found');
        return;
      }
    }, err => {
      console.log(err);
    })

  }

  statuschange(name: any, event: any) {
    let url: any = '';
    if (name === 'call') {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&isDoctorCall=true&isNurseCall=false&callStatus=all&isFieldAllow=false'

      if (this.router.url === '/apps/drcell') {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=' + event.value + '&isFieldAllow=false';
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=' + event.value + '&isFieldAllow=false&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
        }
      } else {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=nurse&callStatus=' + event.value + '&isFieldAllow=false'
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=' + event.value + '&isFieldAllow=false';
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=' + event.value + '&isFieldAllow=false&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
        }
      }
    } else {

      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=all&serviceStatus=' + event.value

      if (this.router.url === '/apps/drcell') {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=doctor&callStatus=all&serviceStatus=' + event.value
      } else {
        url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=nurse&callStatus=all&serviceStatus=' + event.value
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
        this.dataSource = new MatTableDataSource([]);
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
    if (event.value === 'all') {
      this.getPatent('');
    }
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

    this.commonService.putmethod('doctor-nurse-team-call', map).subscribe((data) => {
      alert('Saved Sucessfully');
    }, err => {
      console.log(err);
    })
  }


  ngOnDestroy() {
    editvalues.drcallid = 0
    editvalues.patientid = 0
    editvalues.scheduleid = 0
    localStorage.removeItem('patientedit');
  }

}
