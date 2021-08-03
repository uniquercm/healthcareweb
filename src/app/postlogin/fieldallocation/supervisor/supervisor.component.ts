import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common.service';
import { editvalues, loader } from '../../commonvaribale/commonvalues';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit, OnDestroy {

  // displayColumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'edit', 'receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
  //   'pcr8date', 'pcr8result',
  //   'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus', 'extracteddata', 'sentclaim', 'senton'];

  firstcolumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'edit', 'reception', 'drcell', 'pcr4day', 'pcr8day', 'nursecall',
    'discharge', 'extracteddata', 'sentclaim', 'senton']
  secondcolumn = ['receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
    'pcr8date', 'pcr8result',
    'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus']

  array: any = [];
  displayedColumns: string[] = ['item', 'select', 'crmtype', 'crmno', 'name', 'eid', 'mobile', 'area', 'adultsCount', 'childrensCount', 'schedule', 'drcall', 'print'];
  dataSource: any = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  user: any = [];
  finalarray: any = [];
  fromdate: any = '';
  todate: any = '';

  allocatedteam: any;
  reallocatedteam: any;

  selectall = false;

  requestarray: any[] = [];
  area: any[] = [];

  constructor(private commonService: CommonService, private datepipe: DatePipe) {
    loader.loading = true;
    this.getUser();
    this.getreq();
    this.getarea();
    this.getCity();
    this.getPatent('');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  selectedArea: any;
  select(name: string, event: any) {
    let farray: any = [];
    if (name === 'case') {
      this.array.forEach((element: any) => {
        if (element.patientInformation.requestId === Number(event.value)) {
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
      console.log(this.selectedArea.toString() + ' ' + this.fromdate);
      let url = 'scheduled?isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all' +
      '&isTeam=false&areaNames=' + this.selectedArea.toString();
      if (this.fromdate === '') {
        url = 'scheduled?isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all' +
        '&isTeam=false&areaNames=' + this.selectedArea.toString()
      } else {
        url = 'scheduled?isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all'
          + '&fromDate='
          + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate='
          + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isTeam=false&areaNames=' + this.selectedArea.toString()
      }

      this.commonService.getmethodws(url).subscribe((data) => {
        this.array = [];
        this.array = data.details;
        this.array.forEach((o: any, i: number) => o.id = i + 1);

        for (let index = 0; index < this.array.length; index++) {
          const element = this.array[index];

          element.area = element.patientInformation.area
          element.cityId = element.patientInformation.cityId
          element.cityName = element.patientInformation.cityName
          element.crmNo = element.patientInformation.crmNo
          element.eidNo = element.patientInformation.eidNo
          element.mobileNo = element.patientInformation.mobileNo
          element.requestId = element.patientInformation.requestId
          element.stickerApplication = element.patientInformation.stickerApplication
          element.stickerRemoval = element.patientInformation.stickerRemoval
          element.trackerApplication = element.patientInformation.trackerApplication
          element.trackerRemoval = element.patientInformation.trackerRemoval
        }

        this.farray = this.array;
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        loader.loading = false;
      }, err => {
        console.log(err);
        loader.loading = false;
      })
    } else if (name === 'city') {
      this.array.forEach((element: any) => {
        if (element.patientInformation.cityId === Number(event)) {
          farray.push(element);
        }
      });
    }

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUser() {
    this.commonService.getmethodws('user?companyId=' + this.localvalues.companyId).subscribe((data) => {
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
    this.commonService.getmethodws('requestCRM').subscribe((data) => {
      this.requestarray = data.details;
    }, err => {
      console.log(err);
    })
  }

  clear(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any, fallocation: any, service: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
    fallocation.value = '';
    service.value = '';
    this.selectedArea = '';
    this.fromdate = '';
    this.todate = '';

    this.getPatent('');
  }

  clearf(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any, fallocation: any, service: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
    fallocation.value = '';
    service.value = '';
    this.selectedArea = '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  farray: any = [];
  crmfilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    const result = this.array.filter((s: any) => s.crmNo.includes(Number((event.target as HTMLInputElement).value)));
    this.dataSource = new MatTableDataSource(result);
  }


  Mobilefilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    const result = this.array.filter((s: any) => s.mobileNo.includes(Number((event.target as HTMLInputElement).value)));
    this.dataSource = new MatTableDataSource(result);
  }

  eidfilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    const result = this.array.filter((s: any) => s.eidNo.includes(Number((event.target as HTMLInputElement).value)));
    this.dataSource = new MatTableDataSource(result);
  }

  apply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    let value = this.dataSource.filteredData.filter(
      (book: any) => book.patientInformation.eidNo === filterValue);
  }


  namefilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    const result = this.array.filter((s: any) => s.patientName.toLowerCase().includes(((event.target as HTMLInputElement).value).toLowerCase()));
    this.dataSource = new MatTableDataSource(result);
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
      delete element['id'];
      delete element['day9CallDetails'];
      delete element['day9CallId'];
      delete element['day7CallDetails'];
      delete element['day7CallId'];
      delete element['day6CallDetails'];
      delete element['day6CallId'];
      delete element['day5CallDetails'];
      delete element['day5CallId'];
      delete element['day4CallDetails'];
      delete element['day4CallId'];
      delete element['day3CallDetails'];
      delete element['day3CallId'];
      delete element['day2CallDetails'];
      delete element['day2CallId'];
      delete element['stickerTrackerNumber'];
      delete element['stickerRemovedDate'];
      delete element['stickerScheduleDate'];
      delete element['trackerAppliedDate'];
      delete element['trackerScheduleDate'];
      delete element['pcR8DayResult'];
      delete element['pcR8DaySampleDate'];
      delete element['pcR8DayTestDate'];
      delete element['pcR4DayResult'];
      delete element['pcR4DaySampleDate'];
      delete element['pcR4DayTestDate'];
      delete element['patientStaffId'];
      delete element['patientInformation'];
      delete element['cityId'];
      delete element['stickerApplication'];
      delete element['stickerRemoval'];
      delete element['trackerApplication'];
      delete element['status'];
      delete element['trackerRemoval'];

      if (element.modifiedBy === undefined) { } else {
        delete element['modifiedBy'];
      }
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'patient.xlsx');
  }

  getPatent(value: any) {
    if (value === 'submit') {
      let url = '';
      if (this.fromdate === '') {
        url = 'scheduled?companyId=' + this.localvalues.companyId + '&isFieldAllocation=true&isTeam=false'
      } else {
        url = 'scheduled?companyId=' + this.localvalues.companyId + '&isFieldAllocation=true&isTeam=false&fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' +
          this.datepipe.transform(this.todate, 'MM-dd-yyyy')
      }
      this.commonService.getmethodws(url).subscribe((data) => {
        this.array = [];
        this.array = data.details;
        this.array.forEach((o: any, i: number) => o.id = i + 1);

        for (let index = 0; index < this.array.length; index++) {
          const element = this.array[index];

          element.area = element.patientInformation.area
          element.cityId = element.patientInformation.cityId
          element.cityName = element.patientInformation.cityName
          element.crmNo = element.patientInformation.crmNo
          element.eidNo = element.patientInformation.eidNo
          element.mobileNo = element.patientInformation.mobileNo
          element.requestId = element.patientInformation.requestId
          element.stickerApplication = element.patientInformation.stickerApplication
          element.stickerRemoval = element.patientInformation.stickerRemoval
          element.trackerApplication = element.patientInformation.trackerApplication
          element.trackerRemoval = element.patientInformation.trackerRemoval
        }

        this.farray = this.array;
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        loader.loading = false;
      }, err => {
        console.log(err);
        loader.loading = false;
      })
    } else {
      let url = '';
      if (value === '') {
        url = 'scheduled?companyId=' + this.localvalues.companyId + '&isFieldAllocation=true&isTeam=false';
      } else {
        url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&patientId=' + editvalues.patientid + '&isFieldAllocation=true'
      }

      this.commonService.getmethodws(url).subscribe((data) => {
        this.array = data.details;
        this.array.forEach((o: any, i: number) => o.id = i + 1);

        this.array.forEach((element: any) => {
          element.area = element.patientInformation.area
          element.cityId = element.patientInformation.cityId
          element.cityName = element.patientInformation.cityName
          element.crmNo = element.patientInformation.crmNo
          element.eidNo = element.patientInformation.eidNo
          element.mobileNo = element.patientInformation.mobileNo
          element.requestCrmName = element.patientInformation.requestCrmName
          element.requestId = element.patientInformation.requestId
          element.stickerApplication = element.patientInformation.stickerApplication
          element.stickerRemoval = element.patientInformation.stickerRemoval
          element.trackerApplication = element.patientInformation.trackerApplication
          element.trackerRemoval = element.patientInformation.trackerRemoval
        });

        this.farray = this.array;
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        loader.loading = false;
      }, err => {
        loader.loading = false;
        console.log(err);
      })
    }
  }

  selectf(event: any) {
    let url = '';
    if (this.fromdate === '') {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&fieldAllocationStatus=' + event.value;
    } else {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&fieldAllocationStatus=' + event.value
        + '&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy');
    }

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = [];
      this.array = data.details;
      this.array.forEach((o: any, i: number) => o.id = i + 1);

      this.farray = this.array;
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
    if (this.fromdate === '') {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&serviceName=' + event.value
    } else {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&serviceName=' + event.value
        + '&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy');
    }


    this.commonService.getmethod(url).subscribe((data) => {
      this.array = [];
      this.array = data.details;
      this.array.forEach((o: any, i: number) => o.id = i + 1);

      this.farray = this.array;
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

  keyword = 'areaName';
  getarea() {
    this.commonService.getmethodws('area').subscribe((data) => {
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

        } else if (element.areaId === 0) {

        } else {
          this.area.push(element)
        }

      });

      console.log(this.area);
    }, err => {
      console.log(err);
    })
  }

  city: any[] = [];
  getCity() {
    this.commonService.getmethodws('city').subscribe((data) => {
      this.city = data.details;
    }, err => {
      console.log(err);
    })
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


  ngOnDestroy() {
    editvalues.drcallid = 0
    editvalues.patientid = 0
    editvalues.scheduleid = 0
    editvalues.headerbuttclick = true;
    localStorage.removeItem('patientedit');
  }
}
