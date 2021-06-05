import { DatePipe } from '@angular/common';
import { noUndefined } from '@angular/compiler/src/util';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  displayColumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
    'pcr8date', 'pcr8result',
    'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus', 'extracteddata', 'sentclaim', 'senton', 'save'];
  dataSource: any;

  firstcolumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'reception', 'drcell', 'pcr4day', 'pcr8day', 'nursecall',
    'discharge', 'extracteddata', 'sentclaim', 'senton', 'save']
  secondcolumn = ['receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
    'pcr8date', 'pcr8result',
    'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus']

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  reportarray: any = [];
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(private commonService: CommonService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.getreq();
  }

  ngAfterViewInit() {

  }

  getreq() {
    this.commonService.getmethod('report?companyId=' + this.localvalues.companyId).subscribe((data) => {
      this.reportarray = data.details;
      this.reportarray.forEach((o: any, i: number) => o.id = i + 1);

      this.reportarray.forEach((element: any) => {
        if (element.sendingClaimDate === '0001-01-01T00:00:00') {
          element.sendingClaimDate = ''
        }
        if (element.pcR4DaySampleDate === '0001-01-01T00:00:00') {
          element.pcR4DaySampleDate = ''
        }
        if (element.pcR8DaySampleDate === '0001-01-01T00:00:00') {
          element.pcR8DaySampleDate = ''
        }
        if (element.dischargeDate === '0001-01-01T00:00:00') {
          element.dischargeDate = ''
        }
        if (undefined == (element.isSendClaim)) {
          element.isSendClaim = 'yes'
        }
      });

      this.dataSource = new MatTableDataSource(this.reportarray);


      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    });
  }

  save(element: any) {
    let map = {
      "scheduledId": element.scheduledId,
      "patientId": element.patientId,
      "patientName": element.patientName,
      "companyId": element.companyId,
      "companyName": element.companyName,
      "requestId": element.requestId,
      "requestCrmName": element.requestCrmName,
      "crmNo": element.crmNo,
      "eidNo": element.eidNo,
      "mobileNo": element.mobileNo,
      "recptionCallStatus": element.recptionCallStatus,
      "recptionCallRemarks": element.recptionCallRemarks,
      "day2CallId": element.day2CallId,
      "drCallStatus": element.drCallStatus,
      "drCallRemarks": element.drCallRemarks,
      "pcR4DaySampleDate": this.datepipe.transform(element.pcR4DaySampleDate, 'MM-dd-yyyy'),
      "pcR4DayResult": element.pcR4DayResult,
      "pcR8DaySampleDate": this.datepipe.transform(element.pcR8DaySampleDate, 'MM-dd-yyyy'),
      "pcR8DayResult": element.pcR8DayResult,
      "day3CallId": element.day3CallId,
      "day3CallStatus": element.day3CallStatus,
      "day3CallRemarks": element.day3CallRemarks,
      "day5CallId": element.day5CallId,
      "day5CallStatus": element.day5CallStatus,
      "day5CallRemarks": element.day5CallRemarks,
      "day6CallId": element.day6CallId,
      "day6CallStatus": element.day6CallStatus,
      "day6CallRemarks": element.day6CallRemarks,
      "day7CallId": element.day7CallId,
      "day7CallStatus": element.day7CallStatus,
      "day7CallRemarks": element.day7CallRemarks,
      "day9CallId": element.day9CallId,
      "day9CallStatus": element.day9CallStatus,
      "day9CallRemarks": element.day9CallRemarks,
      "dischargeDate": this.datepipe.transform(element.dischargeDate, 'MM-dd-yyyy'),
      "dischargeRemarks": element.dischargeRemarks,
      "isExtractTreatementDate": element.isExtractTreatementDate,
      "isSendClaim": element.isSendClaim === undefined ? '' : element.isSendClaim,
      "sendingClaimDate": this.datepipe.transform(element.sendingClaimDate, 'MM-dd-yyyy'),
      "modifiedBy": this.localvalues.userId
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
}