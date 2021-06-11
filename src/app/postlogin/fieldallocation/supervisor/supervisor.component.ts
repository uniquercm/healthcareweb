import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../../commonvaribale/commonvalues';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit {


  // displayColumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'edit', 'receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
  //   'pcr8date', 'pcr8result',
  //   'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus', 'extracteddata', 'sentclaim', 'senton'];

  firstcolumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'edit', 'reception', 'drcell', 'pcr4day', 'pcr8day', 'nursecall',
    'discharge', 'extracteddata', 'sentclaim', 'senton']
  secondcolumn = ['receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
    'pcr8date', 'pcr8result',
    'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus']

  array = [];
  displayedColumns: string[] = ['item', 'select', 'crmtype', 'crmno', 'name', 'eid', 'mobile', 'schedule', 'drcall', 'print'];
  dataSource: any = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  user: any = [];
  finalarray: any = [];
  fromdate: any;
  todate: any;

  allocatedteam: any;
  reallocatedteam: any;

  selectall = false;

  requestarray: any[] = [];
  area: any[] = [];

  constructor(private commonService: CommonService, private datepipe: DatePipe) {
    this.getPatent('');
    this.getUser();
    this.getreq();
    this.getarea();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  select(name: string, event: any) {
    let farray: any = [];
    if (name === 'case') {
      this.array.forEach((element: any) => {
        if (element.patientInformation.requestId === Number(event.value)) {
          farray.push(element);
        }
      });
    } else {
      this.array.forEach((element: any) => {
        if (element.patientInformation.areaId === Number(event.value)) {
          farray.push(element);
        }
      });
    }

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUser() {
    this.commonService.getmethod('user').subscribe((data) => {
      let array = data.details;
      array.forEach((element: any) => {
        if (element.userType === 7) {
          this.user.push(element)
        }
      });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getarea() {
    this.commonService.getmethod('area').subscribe((data) => {
      this.area = data.details;
    }, err => {
      console.log(err);
    })
  }

  getPatent(value: any) {
    if (value === 'submit') {
      let url = '';
      url = 'scheduled?isFieldAllocation=true&fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' +
        this.datepipe.transform(this.todate, 'MM-dd-yyyy')

      this.commonService.getmethod(url).subscribe((data) => {
        this.array = data.details;
        this.array.forEach((o: any, i) => o.id = i + 1);

        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        console.log(err);
      })
    } else {
      let url = '';
      if (value === '') {
        url = 'scheduled?isFieldAllocation=true'
      } else {
        url = 'scheduled?patientId=' + editvalues.patientid + '&isFieldAllocation=true'
      }

      this.commonService.getmethod(url).subscribe((data) => {
        this.array = data.details;
        this.array.forEach((o: any, i) => o.id = i + 1);

        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        console.log(err);
      })
    }
  }

  selectf(event: any) {
    let url = '';
    url = 'scheduled?isFieldAllocation=true&searchFieldAllowName=' + event.value;

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);

      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    })

  }

  clickevent(event: any) {
    let value = event.checked;

    if (value) {
      this.selectall = true;
      this.array.forEach((element: any) => {
        element.click = true;
      });
    } else {
      this.selectall = false;
      this.array.forEach((element: any) => {
        element.click = false;
      });
    }
  }

  selectstaus(event: any) {
    let url = '';
    url = 'scheduled?isFieldAllocation=true&serviceName=' + event.value;

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i) => o.id = i + 1);

      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    })

  }

  change(checked: any, element: any) {


  }

  allchange(event: any) {
    this.allocatedteam = event.value;
  }

  allchangein(event: any, element: any) {
    let map = {
      "scheduledId": element.scheduledId,
      "patientId": element.patientId,
      "patientStaffId": "",
      "allocatedTeamName": element.allocatedTeamName,
      "reAllocatedTeamName": element.reAllocatedTeamName === undefined ? '' : element.reAllocatedTeamName,
      "modifiedBy": this.localvalues.userId
    }

    this.finalarray.push(map);
  }

  rechangein(event: any, element: any) {
    // if (!element.click) {
    //   alert('Please click the select box');
    //   element.reAllocatedTeamName = '';
    //   return;
    // }
    let map = {
      "scheduledId": element.scheduledId,
      "patientId": element.patientId,
      "patientStaffId": "",
      "allocatedTeamName": element.allocatedTeamName,
      "reAllocatedTeamName": element.reAllocatedTeamName,
      "modifiedBy": this.localvalues.userId
    }

    this.finalarray.push(map);
  }

  rechange(event: any) {
    this.reallocatedteam = event.value;
  }

  save() {
    if (this.selectall) {
      this.array.forEach((element: any) => {
        let map = {
          "scheduledId": element.scheduledId,
          "patientId": element.patientId,
          "patientStaffId": "",
          "allocatedTeamName": this.allocatedteam,
          "reAllocatedTeamName": this.reallocatedteam,
          "modifiedBy": this.localvalues.userId
        }

        this.finalarray.push(map);
      });
    } else {
      this.array.forEach((element: any) => {
        if (element.click) {
          let map = {
            "scheduledId": element.scheduledId,
            "patientId": element.patientId,
            "patientStaffId": "",
            "allocatedTeamName": this.allocatedteam,
            "reAllocatedTeamName": this.reallocatedteam,
            "modifiedBy": this.localvalues.userId
          }

          this.finalarray.push(map);
        }
      });
    }

    if (this.finalarray.length === 0) {
      alert('Please select the team');
      return;
    }

    let map = {
      fieldAllocationDetailsList: this.finalarray
    }

    this.commonService.putmethod('field-allocation', map).subscribe((data) => {
      alert('Saved Successfully');
      this.getPatent('');
      this.allocatedteam = '';
      this.reallocatedteam = '';
    }, err => {
      console.log(err);
    })

  }

  saveind() {
    if (this.finalarray.length === 0) {
      alert('Please select the team');
      return;
    }

    let map = {
      fieldAllocationDetailsList: this.finalarray
    }

    this.commonService.putmethod('field-allocation', map).subscribe((data) => {
      alert('Saved Successfully');
      this.getPatent('');
      this.allocatedteam = '';
      this.reallocatedteam = '';
      this.finalarray = [];
    }, err => {
      console.log(err);
    })

  }
}
