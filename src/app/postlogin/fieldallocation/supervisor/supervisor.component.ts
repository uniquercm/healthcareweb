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
  displayedColumns: string[] = ['id', 'select', 'requestCrmName', 'crmNo', 'patientName', 'eidNo', 'mobileNo', 'area',
   'adultsCount', 'childrensCount', 'allocatedTeamName', 'reAllocatedTeamName', 'print'];
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
    loader.loading = true;//Thanam 09-08-21
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
      //Thanam 06-08-21
      let url = 'scheduled?companyId=' + this.localvalues.companyId + '&isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all' +
      '&isTeam=false&areaNames=' + this.selectedArea.toString();
      if (this.fromdate === '') {
        url = 'scheduled?companyId=' + this.localvalues.companyId + '&isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all' +
        '&isTeam=false&areaNames=' + this.selectedArea.toString()
      } else {
        url = 'scheduled?companyId=' + this.localvalues.companyId + '&isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all'
          + '&fromDate='
          + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate='
          + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&isTeam=false&areaNames=' + this.selectedArea.toString()
      }
      /*
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
      }*/
      //*************************** */

      this.commonService.getmethodws(url).subscribe((data) => {
        this.array = [];
        this.array = data.details;
        this.array.forEach((o: any, i: number) => o.id = i + 1);

        for (let index = 0; index < this.array.length; index++) {
          const element = this.array[index];

          element.id = index + 1;
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
      //Thanam 11-08-21
      if (event === 'all') {
        this.array = this.farray;
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        loader.loading = false;//Thanam 11-08-21
        return;
      } else {//********************* */
        this.array.forEach((element: any) => {
          if (element.patientInformation.cityId === Number(event)) {
            farray.push(element);
          }
        });
      }
    }

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    loader.loading = false;//Thanam 09-08-21
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
    loader.loading = true;//Thanam 09-08-21
    for (let index = 0; index < this.dataSource.filteredData.length; index++) {
      let element: any = this.dataSource.filteredData[index];

      //Thanam 18-08-21
      //0001-01-01T00:00:00
      if(element['pcrTestDate'].toString() !== "")
      {
        element['pcrTestDate'] = this.datepipe.transform(element['pcrTestDate'], 'dd-MM-yyyy');//element['pcrTestDate'].toString().replace("T00:00:00","");
        element['pcrTestDate'] = element['pcrTestDate'].toString().replace("01-01-0001","");
      }
      
      if(element['treatmentFromDate'].toString() !== "")
      {
        element['treatmentFromDate'] = this.datepipe.transform(element['treatmentFromDate'], 'dd-MM-yyyy');//element['treatmentFromDate'].toString().replace("T00:00:00","");
        element['treatmentFromDate'] = element['treatmentFromDate'].toString().replace("01-01-0001","");
      }
      
      if(element['treatmentToDate'].toString() !== "")
      {
        element['treatmentToDate'] = this.datepipe.transform(element['treatmentToDate'], 'dd-MM-yyyy');//element['treatmentToDate'].toString().replace("T00:00:00","");
        element['treatmentToDate'] = element['treatmentToDate'].toString().replace("01-01-0001","");
      }
      
      if(element['allocatedDate'].toString() !== "")
      {
        element['allocatedDate'] = this.datepipe.transform(element['allocatedDate'], 'dd-MM-yyyy');//element['allocatedDate'].toString().replace("T00:00:00","");
        element['allocatedDate'] = element['allocatedDate'].toString().replace("01-01-0001","");
      }
      
      if(element['reAllocatedDate'].toString() !== "")
      {
        element['reAllocatedDate'] = this.datepipe.transform(element['reAllocatedDate'], 'dd-MM-yyyy');//element['reAllocatedDate'].toString().replace("T00:00:00","");
        element['reAllocatedDate'] = element['reAllocatedDate'].toString().replace("01-01-0001","");
      }
      
      if(element['dischargeDate'].toString() !== "")
      {
        element['dischargeDate'] = this.datepipe.transform(element['dischargeDate'], 'dd-MM-yyyy');//element['dischargeDate'].toString().replace("T00:00:00","");
        element['dischargeDate'] = element['dischargeDate'].toString().replace("01-01-0001","");
      }
      
      if(element['dischargeTeamStatusDate'].toString() !== "")
      {
        element['dischargeTeamStatusDate'] = this.datepipe.transform(element['dischargeTeamStatusDate'], 'dd-MM-yyyy');//element['dischargeTeamStatusDate'].toString().replace("T00:00:00","");
        element['dischargeTeamStatusDate'] = element['dischargeTeamStatusDate'].toString().replace("01-01-0001","");
      }

      if(element['trackerScheduleDate'].toString() !== "")
      {
        element['trackerScheduleDate'] = this.datepipe.transform(element['trackerScheduleDate'], 'dd-MM-yyyy');//element['trackerScheduleDate'].toString().replace("T00:00:00","");
        element['trackerScheduleDate'] = element['trackerScheduleDate'].toString().replace("01-01-0001","");
      }
      
      if(element['trackerAppliedDate'].toString() !== "")
      {
        element['trackerAppliedDate'] = this.datepipe.transform(element['trackerAppliedDate'], 'dd-MM-yyyy');//element['trackerAppliedDate'].toString().replace("T00:00:00","");
        element['trackerAppliedDate'] = element['trackerAppliedDate'].toString().replace("01-01-0001","");
      }
      
      if(element['trackerTeamStatusDate'].toString() !== "")
      {
        element['trackerTeamStatusDate'] = this.datepipe.transform(element['trackerTeamStatusDate'], 'dd-MM-yyyy');//element['trackerTeamStatusDate'].toString().replace("T00:00:00","");
        element['trackerTeamStatusDate'] = element['trackerTeamStatusDate'].toString().replace("01-01-0001","");
      }
      
      if(element['stickerScheduleDate'].toString() !== "")
      {
        element['stickerScheduleDate'] = this.datepipe.transform(element['stickerScheduleDate'], 'dd-MM-yyyy');//element['stickerScheduleDate'].toString().replace("T00:00:00","");
        element['stickerScheduleDate'] = element['stickerScheduleDate'].toString().replace("01-01-0001","");
      }
      
      if(element['stickerRemovedDate'].toString() !== "")
      {
        element['stickerRemovedDate'] = this.datepipe.transform(element['stickerRemovedDate'], 'dd-MM-yyyy');//element['stickerRemovedDate'].toString().replace("T00:00:00","");
        element['stickerRemovedDate'] = element['stickerRemovedDate'].toString().replace("01-01-0001","");
      }
      
      if(element['stickerTeamStatusDate'].toString() !== "")
      {
        element['stickerTeamStatusDate'] = this.datepipe.transform(element['stickerTeamStatusDate'], 'dd-MM-yyyy');//element['stickerTeamStatusDate'].toString().replace("T00:00:00","");
        element['stickerTeamStatusDate'] = element['stickerTeamStatusDate'].toString().replace("01-01-0001","");
      }
      
      if(element['trackerReplacedDate'].toString() !== "")
      {
        element['trackerReplacedDate'] = this.datepipe.transform(element['trackerReplacedDate'], 'dd-MM-yyyy');//element['trackerReplacedDate'].toString().replace("T00:00:00","");
        element['trackerReplacedDate'] = element['trackerReplacedDate'].toString().replace("01-01-0001","");
      }
      
      if(element['trackerReplaceTeamStatusDate'].toString() !== "")
      {
        element['trackerReplaceTeamStatusDate'] = this.datepipe.transform(element['trackerReplaceTeamStatusDate'], 'dd-MM-yyyy');//element['trackerReplaceTeamStatusDate'].toString().replace("T00:00:00","");
        element['trackerReplaceTeamStatusDate'] = element['trackerReplaceTeamStatusDate'].toString().replace("01-01-0001","");
      }
      
      if(element['requestCrmName'].toString() === 'HQP')
      {
        if(element['pcR6DayTestDate'].toString() !== "")
        {
          element['pcR6DayTestDate'] = this.datepipe.transform(element['pcR6DayTestDate'], 'dd-MM-yyyy');//element['pcR6DayTestDate'].toString().replace("T00:00:00","");
          element['pcR6DayTestDate'] = element['pcR6DayTestDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR6DaySampleDate'].toString() !== "")
        {
          element['pcR6DaySampleDate'] = this.datepipe.transform(element['pcR6DaySampleDate'], 'dd-MM-yyyy');//element['pcR6DaySampleDate'].toString().replace("T00:00:00","");
          element['pcR6DaySampleDate'] = element['pcR6DaySampleDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR6DayTeamStatusDate'].toString() !== "")
        {
          element['pcR6DayTeamStatusDate'] = this.datepipe.transform(element['pcR6DayTeamStatusDate'], 'dd-MM-yyyy');//element['pcR6DayTeamStatusDate'].toString().replace("T00:00:00","");
          element['pcR6DayTeamStatusDate'] = element['pcR6DayTeamStatusDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR9DayTestDate'].toString() !== "")
        {
          element['pcR9DayTestDate'] = this.datepipe.transform(element['pcR9DayTestDate'], 'dd-MM-yyyy');//element['pcR9DayTestDate'].toString().replace("T00:00:00","");
          element['pcR9DayTestDate'] = element['pcR9DayTestDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR9DaySampleDate'].toString() !== "")
        {
          element['pcR9DaySampleDate'] = this.datepipe.transform(element['pcR9DaySampleDate'], 'dd-MM-yyyy');//element['pcR9DaySampleDate'].toString().replace("T00:00:00","");
          element['pcR9DaySampleDate'] = element['pcR9DaySampleDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR9DayTeamStatusDate'].toString() !== "")
        {
          element['pcR9DayTeamStatusDate'] = this.datepipe.transform(element['pcR9DayTeamStatusDate'], 'dd-MM-yyyy');//element['pcR9DayTeamStatusDate'].toString().replace("T00:00:00","");
          element['pcR9DayTeamStatusDate'] = element['pcR9DayTeamStatusDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR11DayTestDate'].toString() !== "")
        {
          element['pcR11DayTestDate'] = this.datepipe.transform(element['pcR11DayTestDate'], 'dd-MM-yyyy');//element['pcR11DayTestDate'].toString().replace("T00:00:00","");
          element['pcR11DayTestDate'] = element['pcR11DayTestDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR11DaySampleDate'].toString() !== "")
        {
          element['pcR11DaySampleDate'] = this.datepipe.transform(element['pcR11DaySampleDate'], 'dd-MM-yyyy');//element['pcR11DaySampleDate'].toString().replace("T00:00:00","");
          element['pcR11DaySampleDate'] = element['pcR11DaySampleDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR11DayTeamStatusDate'].toString() !== "")
        {
          element['pcR11DayTeamStatusDate'] = this.datepipe.transform(element['pcR11DayTeamStatusDate'], 'dd-MM-yyyy');//element['pcR11DayTeamStatusDate'].toString().replace("T00:00:00","");
          element['pcR11DayTeamStatusDate'] = element['pcR11DayTeamStatusDate'].toString().replace("01-01-0001","");
        }
        
        element['pcR4DayTestDate'] = "";
        element['pcR4DaySampleDate'] = "";
        element['pcR4DayTeamStatusDate'] = "";

        element['pcR8DayTestDate'] = "";
        element['pcR8DaySampleDate'] = "";
        element['pcR8DayTeamStatusDate'] = "";
      }
      else
      {
        if(element['pcR4DayTestDate'].toString() !== "")
        {
          element['pcR4DayTestDate'] = this.datepipe.transform(element['pcR4DayTestDate'], 'dd-MM-yyyy');//element['pcR4DayTestDate'].toString().replace("T00:00:00","");
          element['pcR4DayTestDate'] = element['pcR4DayTestDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR4DaySampleDate'].toString() !== "")
        {
          element['pcR4DaySampleDate'] = this.datepipe.transform(element['pcR4DaySampleDate'], 'dd-MM-yyyy');//element['pcR4DaySampleDate'].toString().replace("T00:00:00","");
          element['pcR4DaySampleDate'] = element['pcR4DaySampleDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR4DayTeamStatusDate'].toString() !== "")
        {
          element['pcR4DayTeamStatusDate'] = this.datepipe.transform(element['pcR4DayTeamStatusDate'], 'dd-MM-yyyy');//element['pcR4DayTeamStatusDate'].toString().replace("T00:00:00","");
          element['pcR4DayTeamStatusDate'] = element['pcR4DayTeamStatusDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR8DayTestDate'].toString() !== "")
        {
          element['pcR8DayTestDate'] = this.datepipe.transform(element['pcR8DayTestDate'], 'dd-MM-yyyy');//element['pcR8DayTestDate'].toString().replace("T00:00:00","");
          element['pcR8DayTestDate'] = element['pcR8DayTestDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR8DaySampleDate'].toString() !== "")
        {
          element['pcR8DaySampleDate'] = this.datepipe.transform(element['pcR8DaySampleDate'], 'dd-MM-yyyy');//element['pcR8DaySampleDate'].toString().replace("T00:00:00","");
          element['pcR8DaySampleDate'] = element['pcR8DaySampleDate'].toString().replace("01-01-0001","");
        }
        
        if(element['pcR8DayTeamStatusDate'].toString() !== "")
        {
          element['pcR8DayTeamStatusDate'] = this.datepipe.transform(element['pcR8DayTeamStatusDate'], 'dd-MM-yyyy');//element['pcR8DayTeamStatusDate'].toString().replace("T00:00:00","");
          element['pcR8DayTeamStatusDate'] = element['pcR8DayTeamStatusDate'].toString().replace("01-01-0001","");
        }

        element['pcR6DayTestDate'] = "";
        element['pcR6DaySampleDate'] = "";
        element['pcR6DayTeamStatusDate'] = "";
        
        element['pcR9DayTestDate'] = "";
        element['pcR9DaySampleDate'] = "";
        element['pcR9DayTeamStatusDate'] = "";
        
        element['pcR11DayTestDate'] = "";
        element['pcR11DaySampleDate'] = "";
        element['pcR11DayTeamStatusDate'] = "";
      }
      
      //***************** */

      delete element['patientId'];
      delete element['companyId'];
      delete element['requestId'];
      delete element['patientStaffId'];
      delete element['patientInformation'];
      delete element['cityId'];
      delete element['status'];
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
      delete element['stickerApplication'];
      delete element['stickerRemoval'];
      delete element['trackerApplication'];
      delete element['trackerRemoval'];
      //Thanam 18-08-21
      //delete element['stickerRemovedDate'];
      //delete element['stickerScheduleDate'];
      //delete element['trackerAppliedDate'];
      //delete element['trackerScheduleDate'];
      //***************** */
      delete element['pcR8DayResult'];
      delete element['pcR4DayResult'];
      //Thanam 18-08-21
      //delete element['pcR8DaySampleDate'];
      //delete element['pcR8DayTestDate'];
      //delete element['pcR4DaySampleDate'];
      //delete element['pcR4DayTestDate'];
      //***************** */

      if (element.modifiedBy === undefined) { } else {
        delete element['modifiedBy'];
      }
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'patient.xlsx');
    loader.loading = false;//Thanam 09-08-21
  }


  getPatent(value: any) { 
    loader.loading = true;
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

          element.id = index + 1;
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
          element.requestCrmName = element.patientInformation.requestCrmName;
          element.eidNo = element.patientInformation.eidNo;
          element.mobileNo = element.patientInformation.mobileNo;
          element.adultsCount = element.patientInformation.adultsCount;
          element.childrensCount = element.patientInformation.childrensCount;
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
       
        for (let index = 0; index < this.array.length; index++) {
          const element = this.array[index];

          element.id = index + 1;
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
          element.requestCrmName = element.patientInformation.requestCrmName;
          element.eidNo = element.patientInformation.eidNo;
          element.mobileNo = element.patientInformation.mobileNo;
          element.adultsCount = element.patientInformation.adultsCount;
          element.childrensCount = element.patientInformation.childrensCount;
        }

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
    loader.loading = true;//Thanam 09-08-21
    let url = '';
    if (this.fromdate === '') {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&fieldAllocationStatus=' + event.value;
    } else {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&fieldAllocationStatus=' + event.value
        + '&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy');
    }

    this.commonService.getmethod(url).subscribe((datas) => {
      this.array = [];
      this.array = datas.details;
      this.array.forEach((o: any, i: number) => o.id = i + 1);

      for (let index = 0; index < this.array.length; index++) {
        const element = this.array[index];

        element.id = index + 1;
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
        element.requestCrmName = element.patientInformation.requestCrmName;
        element.eidNo = element.patientInformation.eidNo;
        element.mobileNo = element.patientInformation.mobileNo;
        element.adultsCount = element.patientInformation.adultsCount;
        element.childrensCount = element.patientInformation.childrensCount;
      }

      this.farray = this.array;
      this.dataSource = new MatTableDataSource(datas.details);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      loader.loading = false;//Thanam 09-08-21
    }, err => {
      console.log(err);
      loader.loading = false;//Thanam 09-08-21
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
    loader.loading = true;//Thanam 09-08-21
    let url = '';
    if (this.fromdate === '') {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&serviceName=' + event.value
    } else {
      url = 'scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&isFieldAllocation=true&serviceName=' + event.value
        + '&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy');
    }


    this.commonService.getmethodws(url).subscribe((data) => {
      this.array = [];
      this.array = data.details;
      this.array.forEach((o: any, i: number) => o.id = i + 1);

      for (let index = 0; index < this.array.length; index++) {
        const element = this.array[index];

        element.id = index + 1;
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
        element.requestCrmName = element.patientInformation.requestCrmName;
        element.eidNo = element.patientInformation.eidNo;
        element.mobileNo = element.patientInformation.mobileNo;
        element.adultsCount = element.patientInformation.adultsCount;
        element.childrensCount = element.patientInformation.childrensCount;
      }

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
    this.commonService.getmethodws('city').subscribe((datas) => {
      this.city = datas.details;
    }, err => {
      console.log(err);
    })
  }

  save() {
    loader.loading = true;//Thanam 09-08-21
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
    loader.loading = false;//Thanam 09-08-21
  }

  saveind() {
    if (this.finalarray.length === 0) {
      alert('Please select the team');
      return;
    }
    loader.loading = true;//Thanam 09-08-21

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
    loader.loading = false;//Thanam 09-08-21
  }

  ngOnDestroy() {
    editvalues.drcallid = 0
    editvalues.patientid = 0
    editvalues.scheduleid = 0
    editvalues.headerbuttclick = true;
    localStorage.removeItem('patientedit');
  }
}
