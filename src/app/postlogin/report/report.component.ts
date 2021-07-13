import { DatePipe } from '@angular/common';
import { noUndefined } from '@angular/compiler/src/util';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../commonvaribale/commonvalues';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  displayColumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'enroll', 'details', 'receptiondate', 'receptionstauts', 'recremarks', 'drcellstatus', 'drremarks',
    'pcr6date', 'pcr6result', 'pcr8date', 'pcr8result', 'pcr11date', 'pcr11result',
    'nc3day', 'nc4day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus', 'extracteddata', 'sentclaim', 'senton', 'save'];
  dataSource: any;

  firstcolumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'enroll', 'details', 'reception', 'drcell', 'pcr6day', 'pcr8day', 'pcr11day', 'nursecall',
    'discharge', 'extracteddata', 'sentclaim', 'senton', 'save']
  secondcolumn = ['receptiondate', 'receptionstauts', 'recremarks', 'drcellstatus', 'drremarks',
    'pcr6date', 'pcr6result', 'pcr8date', 'pcr8result', 'pcr11date', 'pcr11result',
    'nc3day', 'nc4day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus']

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  reportarray: any = [];
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  requestarray: any[] = [];

  constructor(private commonService: CommonService, public datepipe: DatePipe) {
    this.getarea();
    this.getCity();
    this.getCompany();
  }

  ngOnInit(): void {
    this.getreq('', '', '');
    this.getreqst();
  }

  ngAfterViewInit() {

  }

  getreqst() {
    this.commonService.getmethod('requestCRM').subscribe((data) => {
      this.requestarray = data.details;
    }, err => {
      console.log(err);
    })
  }

  // select(event: any) {
  //   let farray: any = [];
  //   this.reportarray.forEach((element: any) => {
  //     if (element.requestId === Number(event.value)) {
  //       farray.push(element);
  //     }
  //   });

  //   this.dataSource = new MatTableDataSource(farray);

  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }


  companyid: any = this.localvalues.companyId;
  companyarray: any[] = [];
  getCompany() {
    this.commonService.getmethod('company').subscribe((data) => {
      this.companyarray = data.details;
    }, err => {
      console.log(err);
    })
  }

  getchange(event: any) {
    this.companyid = event;
    this.getreq('', '', '');
  }

  select(name: string, event: any) {
    let farray: any = [];
    if (name === 'case') {
      this.reportarray.forEach((element: any) => {
        if (element.requestId === Number(event.value)) {
          farray.push(element);
        }
      });
    } else if (name === 'area') {
      if (event === 'All') {
        farray = this.reportarray;

        this.dataSource = new MatTableDataSource(farray);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        return;
      }
      this.reportarray.forEach((element: any) => {
        if (element.area === (event.value)) {
          farray.push(element);
        }
      });
    } else if (name === 'city') {
      this.reportarray.forEach((element: any) => {
        if (element.cityId === Number(event)) {
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

    this.getreq('', '', '');
  }


  getreq(value: any, date: any, status: any) {
    let url = '';
    if (value === '') {
      url = 'report?companyId=' + this.companyid;
    } else if (value === 'extract') {
      let claim = status === undefined ? 'all' : status;
      url = 'report?companyId=' + this.companyid + '&extractData=' + date.value + '&sendClaim=' + claim;
    } else if (value === 'sent') {
      let claim = date === undefined ? 'all' : date;
      url = 'report?companyId=' + this.companyid + '&extractData=' + claim + '&sendClaim=' + status.value;
    }
    else {
      url = 'report?companyId=' + this.companyid + '&sendOnFromDate=' +
        this.datepipe.transform(value.toLocaleString(), 'MM-dd-yyyy') + '&sendOnToDate=' +
        this.datepipe.transform(date.toLocaleString(), 'MM-dd-yyyy');
    }
    this.commonService.getmethod(url).subscribe((data) => {
      this.reportarray = data.details;
      this.reportarray.forEach((o: any, i: number) => o.id = i + 1);

      this.reportarray.forEach((element: any) => {
        if (element.sendingClaimDate === '0001-01-01T00:00:00') {
          element.sendingClaimDate = ''
        }
        if (element.pcR4DayTestDate === '0001-01-01T00:00:00') {
          element.pcR4DayTestDate = ''
        }
        if (element.pcR6DayTestDate === '0001-01-01T00:00:00') {
          element.pcR6DayTestDate = ''
        }
        if (element.pcR11DayTestDate === '0001-01-01T00:00:00') {
          element.pcR11DayTestDate = ''
        }
        if (element.pcR8DayTestDate === '0001-01-01T00:00:00') {
          element.pcR8DayTestDate = ''
        }
        if (element.dischargeDate === '0001-01-01T00:00:00') {
          element.dischargeDate = ''
        }
        if (element.recptionCallDate === '0001-01-01T00:00:00') {
          element.recptionCallDate = ''
        }
        if (undefined == (element.isSendClaim)) {
          element.isSendClaim = ''
        }
        if (undefined == (element.enrolledDetails)) {
          element.enrolledDetails = '';
        } else {
          // element.enrolledDetails = element.enrolledDetails;
        }
      });

      console.log(this.reportarray)

      this.dataSource = new MatTableDataSource(this.reportarray);


      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    });
  }



  export() {
    for (let index = 0; index < this.dataSource.filteredData.length; index++) {
      let element: any = this.dataSource.filteredData[index];

      delete element['patientId'];
      delete element['companyId'];
      delete element['requestId'];
      delete element['cityName'];
      delete element['nationalityId'];
      delete element['drCallId'];
      delete element['scheduledId'];
      delete element['createdBy'];
      delete element['cityId'];
      delete element['id'];
      delete element['pcR4DayTestDate'];
      delete element['pcR4DaySampleDate'];
      delete element['pcR4DayResult'];
      delete element['day2CallId'];
      delete element['day3CallId'];
      delete element['day4CallId'];
      delete element['day5CallId'];
      delete element['day6CallId'];
      delete element['day7CallId'];
      delete element['day9CallId'];

      if (element.modifiedBy === undefined) { } else {
        delete element['modifiedBy'];
      }
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'patient.xlsx');

  }


  save(element: any) {
    let map = {
      scheduledId: element.scheduledId,
      patientId: element.patientId,
      patientName: element.patientName,
      companyId: element.companyId,
      companyName: element.companyName,
      requestId: element.requestId,
      requestCrmName: element.requestCrmName,
      crmNo: element.crmNo,
      eidNo: element.eidNo,
      mobileNo: element.mobileNo,
      recptionCallDate: element.recptionCallDate,
      recptionCallStatus: element.recptionCallStatus,
      recptionCallRemarks: element.recptionCallRemarks,
      day2CallId: element.day2CallId,
      drCallStatus: element.drCallStatus,
      drCallRemarks: element.drCallRemarks,
      pcR4DaySampleDate: this.datepipe.transform(element.pcR4DaySampleDate, 'MM-dd-yyyy'),
      pcR4DayResult: element.pcR4DayResult,
      pcR8DaySampleDate: this.datepipe.transform(element.pcR8DaySampleDate, 'MM-dd-yyyy'),
      pcR8DayResult: element.pcR8DayResult,
      day3CallId: element.day3CallId,
      day3CallStatus: element.day3CallStatus,
      day3CallRemarks: element.day3CallRemarks,
      day5CallId: element.day5CallId,
      day5CallStatus: element.day5CallStatus,
      day5CallRemarks: element.day5CallRemarks,
      day6CallId: element.day6CallId,
      day6CallStatus: element.day6CallStatus,
      day6CallRemarks: element.day6CallRemarks,
      day7CallId: element.day7CallId,
      day7CallStatus: element.day7CallStatus,
      day7CallRemarks: element.day7CallRemarks,
      day9CallId: element.day9CallId,
      day9CallStatus: element.day9CallStatus,
      day9CallRemarks: element.day9CallRemarks,
      dischargeDate: this.datepipe.transform(element.dischargeDate, 'MM-dd-yyyy'),
      dischargeRemarks: element.dischargeRemarks,
      isExtractTreatementDate: element.isExtractTreatementDate,
      isSendClaim: element.isSendClaim === undefined ? '' : element.isSendClaim,
      sendingClaimDate: this.datepipe.transform(element.sendingClaimDate, 'MM-dd-yyyy'),
      modifiedBy: this.localvalues.userId
    }

    this.commonService.putmethod('report', map).subscribe((data) => {
      alert('Updated Successfully');
    }, err => {
      console.log(err);
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  area: any[] = [];
  city: any[] = [];
  getCity() {
    this.commonService.getmethod('city').subscribe((data) => {
      this.city = data.details;
    }, err => {
      console.log(err);
    })
  }
}