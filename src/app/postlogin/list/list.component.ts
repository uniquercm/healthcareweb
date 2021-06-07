import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../commonvaribale/commonvalues';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  array = [];
  displayedColumns: string[] = ['id', 'requestCrmName', 'crmNo', 'patientName', 'eidNo', 'mobileNo', 'edit', 'reception', 'schedule', 'drcall', 'nursecall'];
  dataSource: any = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  fromdate: any;
  todate: any;

  requestarray: any[] = [];
  area: any[] = [];

  constructor(private commonService: CommonService, public datepipe: DatePipe) {
    if (this.localvalues.userType === 6) {
      this.displayedColumns = ['id', 'requestCrmName', 'crmNo', 'patientName', 'eidNo', 'mobileNo', 'edit', 'reception', 'print'];
    } else if (this.localvalues.userType === 1) {
    }
    this.getarea();
    this.getreq();
    this.getPatent('');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getreq() {
    this.commonService.getmethod('requestCRM').subscribe((data) => {
      this.requestarray = data.details;
    }, err => {
      console.log(err);
    })
  }

  select(name: string, event: any) {
    let farray: any = [];
    if (name === 'case') {
      this.array.forEach((element: any) => {
        if (element.patientInformation.requestId === Number(event.value)) {
          farray.push(element);
        }
      });
    } else if (name === 'area') {
      this.array.forEach((element: any) => {
        if (element.patientInformation.areaId === Number(event.value)) {
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

  change(element: any) {
    editvalues.scheduleid = element.scheduledId;
    editvalues.drcallid = element.drCallId
    editvalues.patientid = element.patientId
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
    let url = '';
    if (value === '') {
      url = 'patient'
    } else {
      url = 'patient?fromDate=' +
        this.datepipe.transform(this.fromdate.toLocaleString(), 'MM-dd-yyyy') + '&toDate=' +
        this.datepipe.transform(this.todate.toLocaleString(), 'MM-dd-yyyy')
        + '&isDoctorCall=false&isNurseCall=false'
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

  getarea() {
    this.commonService.getmethod('area').subscribe((data) => {
      this.area = data.details;
    }, err => {
      console.log(err);
    })
  }


}
