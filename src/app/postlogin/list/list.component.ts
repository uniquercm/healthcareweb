import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common.service';
import { editvalues, loader } from '../commonvaribale/commonvalues';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  array: any = [];
  displayedColumns: string[] = ['id', 'requestCrmName', 'crmNo', 'patientName', 'eidNo', 'mobileNo', 'adultsCount', 'childrensCount', 'edit', 'reception', 'schedule', 'drcall', 'nursecall'];
  dataSource: any = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  fromdate: any = '';
  todate: any = '';

  requestarray: any[] = [];
  area: any[] = [];
  liststatus = 'pending';

  constructor(private commonService: CommonService, public datepipe: DatePipe,
    private router: Router) {
    loader.loading = true;
    if (this.localvalues.userType === 6) {
      this.displayedColumns = ['id', 'requestCrmName', 'crmNo', 'patientName', 'eidNo', 'mobileNo', 'adultsCount', 'childrensCount', 'edit', 'reception', 'schedule'];
    } else if (this.localvalues.userType === 1) {
    }
    this.getarea();
    this.getreq();
    this.getCity();
    this.getCompany();
    this.getPatent('inital');
    //loader.loading = false;//19-08-21
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

  crmfilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    const result = this.array.filter((s: any) => s.crmNo.includes(((event.target as HTMLInputElement).value)));
    this.dataSource = new MatTableDataSource(result);
  }

  Mobilefilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    //console.log(Number((event.target as HTMLInputElement).value));
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

  namefilter(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.dataSource = new MatTableDataSource(this.farray);
      return;
    }
    const result = this.array.filter((s: any) => s.patientName.toLowerCase().includes(((event.target as HTMLInputElement).value).toLowerCase()));
    this.dataSource = new MatTableDataSource(result);
  }

  getreq() {
    this.commonService.getmethodws('requestCRM').subscribe((req) => {
      this.requestarray = req.details;
    }, err => {
      console.log(err);
    })
  }

  delete(element: any) {
    if (confirm("Are you sure to Delete")) {
      let map = {
        "id": element.patientId,
        "deletedBy": this.localvalues.userName
      }

      this.commonService.deletemethod('patient', map).subscribe((data) => {
        alert('Deleted Successfully');
        this.getPatent('');
      }, err => {
        console.log(err);
      })
    }
  }

  selectedArea = [];
  select(name: string, event: any) {
    loader.loading = true; //Thanam 18-08-21
    let farray: any = [];
    if (name === 'case') {
      if (event.value === 'all') {
        farray = this.array;

        this.dataSource = new MatTableDataSource(farray);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        loader.loading = false;//19-08-21

        return;
      } else {
        this.array.forEach((element: any) => {
          if (element.requestId === Number(event.value)) {
            farray.push(element);
          }
        });
      }
    } else if (name === 'area') {
      if (event === 'All') {
        farray = this.array;

        this.dataSource = new MatTableDataSource(farray);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        loader.loading = false;//19-08-21

        return;
      }
      // this.array.forEach((element: any) => {
      //   if (element.area === (event)) {
      //     farray.push(element);
      //   }
      // });
      // console.log(this.selectedArea.toString())

      loader.loading = true;
      let url = '';
      if (this.fromdate === '') {
        url = 'patient?companyId=' + this.companyid
          + '&isDoctorCall=false&isNurseCall=false&areaNames=' + decodeURI(this.selectedArea.toString());
        console.log(url);
      } else {
        url = 'patient?companyId=' + this.companyid + '&fromDate=' +
          this.datepipe.transform(this.fromdate.toLocaleString(), 'MM-dd-yyyy') + '&toDate=' +
          this.datepipe.transform(this.todate.toLocaleString(), 'MM-dd-yyyy')
          + '&isDoctorCall=false&isNurseCall=false&areaNames=' + this.selectedArea.toString()
      }
      this.commonService.getmethodws(url).subscribe((data) => {
        this.array = data.details;
        this.array.forEach((o: any, i: any) => o.id = i + 1);

        for (let index = 0; index < this.array.length; index++) {
          const element: any = this.array[index];

          element.id = index + 1; 
          if (element.recptionCallStatus === undefined) {
            element.recptionCallStatus = ''
          }

          if (element.recptionCallRemarks === undefined) {
            element.recptionCallRemarks = ''
          }

        }

        this.farray = this.array
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        loader.loading = false;
      }, err => {
        console.log(err);
        loader.loading = false;
      })
    } else if (name === 'city') {
      loader.loading = true;//Thanam 18-08-21
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
          if (element.cityId === Number(event)) {
            farray.push(element);
          }
        });
      }
      loader.loading = false;//Thanam 18-08-21
    } else if (name === 'status') {
      loader.loading = true;
      let url = '';
      if (this.fromdate === '') {
        url = 'patient?companyId=' + this.companyid
          + '&isDoctorCall=false&isNurseCall=false&searchStatus=' + event
      } else {
        url = 'patient?companyId=' + this.companyid + '&fromDate=' +
          this.datepipe.transform(this.fromdate.toLocaleString(), 'MM-dd-yyyy') + '&toDate=' +
          this.datepipe.transform(this.todate.toLocaleString(), 'MM-dd-yyyy')
          + '&isDoctorCall=false&isNurseCall=false&searchStatus=' + event
      }
      this.commonService.getmethodws(url).subscribe((data) => {
        this.array = data.details;
        this.array.forEach((o: any, i: any) => o.id = i + 1);

        for (let index = 0; index < this.array.length; index++) {
          const element: any = this.array[index];

          element.id = index + 1; 
          if (element.recptionCallStatus === undefined) {
            element.recptionCallStatus = ''
          }

          if (element.recptionCallRemarks === undefined) {
            element.recptionCallRemarks = ''
          }

        }

        this.farray = this.array
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        loader.loading = false;
      }, err => {
        console.log(err);
        loader.loading = false;
      })
    } else {
      loader.loading = true;
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
      loader.loading = false;//19-08-21
    }

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  change(element: any) {
    editvalues.scheduleid = element.scheduledId;
    editvalues.drcallid = element.drCallId
    editvalues.patientid = element.patientId
    editvalues.headerbuttclick = false;
    localStorage.setItem('patientedit', JSON.stringify(editvalues));
  }

  clear(input: any, mobile: any, eid: any, crm: any, crmno: any, region: any, statuss: any, gmap: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    this.selectedArea = [];
    region.value = '';
    //Thanam
    //statuss.value = ''; 
    statuss.value = 'pending';
    //************ */
    gmap.value = '';
    this.fromdate = '';
    this.todate = '';

    this.liststatus = 'pending';

    this.getPatent('');
  }

  clearf(input: any, mobile: any, eid: any, crm: any, crmno: any, region: any, statuss: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    this.selectedArea = [];
    region.value = '';
    //Thanam
    //statuss.value = ''; 
    statuss.value = 'pending';
    //************ */
  }

  clearcase(input: any, mobile: any, eid: any, crmno: any, region: any, statuss: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crmno.value = '';
    region.value = '';
    statuss.value = '';

    this.selectedArea = [];
    loader.loading = false;//19-08-21
  }

  getstatus(statuss: any) {
    loader.loading = true;

    let url = 'patient?companyId' + this.companyid + '&gMapLinkSatus=' + statuss.value

    this.commonService.getmethod(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i: any) => o.id = i + 1);

      for (let index = 0; index < this.array.length; index++) {
        const element: any = this.array[index];

        element.id = index + 1; 
        if (element.recptionCallStatus === undefined) {
          element.recptionCallStatus = ''
        }

        if (element.recptionCallRemarks === undefined) {
          element.recptionCallRemarks = ''
        }

      }

      this.farray = this.array
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      loader.loading = false;
    }, err => {
      loader.loading = false;
      console.log(err);
    })
  }

  companyid: any = this.localvalues.companyId;
  companyarray: any[] = [];
  getCompany() {
    this.commonService.getmethodws('company').subscribe((data) => {
      this.companyarray = data.details;
    }, err => {
      console.log(err);
    })
  }

  getchange(event: any) {
    this.companyid = event;
    this.getPatent('');
  }

  getPatent(value: any) {
    loader.loading = true;
    let url = '';//submit
    if (value = 'inital') {
      //Thanam
      //url = 'patient?companyId=' + this.companyid + '&searchStatus=pending';
      if (this.fromdate === '') {
        url = 'patient?companyId=' + this.companyid + '&searchStatus=pending';
      } else {
        url = 'patient?companyId=' + this.companyid + '&fromDate=' +
          this.datepipe.transform(this.fromdate.toLocaleString(), 'MM-dd-yyyy') + '&toDate=' +
          this.datepipe.transform(this.todate.toLocaleString(), 'MM-dd-yyyy')
          + '&isDoctorCall=false&isNurseCall=false&searchStatus=pending'
      }
      //**************** */
    } else if (value === '') {
      url = 'patient?companyId=' + this.companyid
    } else {
      if (this.fromdate === '') {
        url = 'patient?companyId=' + this.companyid
          + '&isDoctorCall=false&isNurseCall=false'
      } else {
        url = 'patient?companyId=' + this.companyid + '&fromDate=' +
          this.datepipe.transform(this.fromdate.toLocaleString(), 'MM-dd-yyyy') + '&toDate=' +
          this.datepipe.transform(this.todate.toLocaleString(), 'MM-dd-yyyy')
          + '&isDoctorCall=false&isNurseCall=false'
      }
    }
    this.commonService.getmethodws(url).subscribe((data) => {
      this.array = data.details;
      this.array.forEach((o: any, i: any) => o.id = i + 1);

      for (let index = 0; index < this.array.length; index++) {
        const element: any = this.array[index];

        element.id = index + 1; 
        if (element.recptionCallStatus === undefined) {
          element.recptionCallStatus = ''
        }

        if (element.recptionCallRemarks === undefined) {
          element.recptionCallRemarks = ''
        }

      }

      this.farray = this.array
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      loader.loading = false;
    }, err => {
      console.log(err);
      loader.loading = false;
    })
  }

  farray: any = [];

  export() {
    loader.loading = true;
    setTimeout(() => {
      for (let index = 0; index < this.dataSource.filteredData.length; index++) 
      {
        let element: any = this.dataSource.filteredData[index];//.toString().replace("T00:00:00","");

        //Thanam 18-08-21
        //0001-01-01T00:00:00
        if(element['assignedDate'].toString() !== "")
        {
          element['assignedDate'] = this.datepipe.transform(element['assignedDate'], 'dd-MM-yyyy');//toString('dd-MM-yyyy');//.replace("T00:00:00","");
          element['assignedDate'] = element['assignedDate'].toString().replace("01-01-0001","");
        }
        
        if(element['createdOn'].toString() !== "")
        {
          element['createdOn'] = this.datepipe.transform(element['createdOn'], 'dd-MM-yyyy');//element['createdOn'].toString().replace("T00:00:00","");
          element['createdOn'] = element['createdOn'].toString().replace("01-01-0001","");
        }
        
        if(element['dateOfBirth'].toString() !== "")
        {
          element['dateOfBirth'] = this.datepipe.transform(element['dateOfBirth'], 'dd-MM-yyyy');//element['dateOfBirth'].toString().replace("T00:00:00","");
          element['dateOfBirth'] = element['dateOfBirth'].toString().replace("01-01-0001","");
        }
        
        if(element['recptionCallDate'].toString() !== "")
        {
          element['recptionCallDate'] = this.datepipe.transform(element['recptionCallDate'], 'dd-MM-yyyy');//element['recptionCallDate'].toString().replace("T00:00:00","");
          element['recptionCallDate'] = element['recptionCallDate'].toString().replace("01-01-0001","");
        }
        //************************ */

        delete element['patientId'];
        //Thanam 18-08-21
        delete element['primaryPatientId'];
        //***************************** */
        delete element['companyId'];
        delete element['requestId'];
        delete element['cityName'];
        delete element['nationalityId'];
        delete element['drCallId'];
        delete element['scheduledId'];
        delete element['createdBy'];
        delete element['cityId'];
        delete element['id'];
        if (element.modifiedBy === undefined) { } else {
          delete element['modifiedBy'];
        }

      }

      //debugger

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'patient.xlsx');

      loader.loading = false;
    }, 1000);


  }

  keyword = 'areaName';
  getarea() {
    this.commonService.getmethodws('area').subscribe((area) => {
      let array;
      array = area.details;

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
    this.commonService.getmethodws('city').subscribe((region) => {
      this.city = region.details;
    }, err => {
      console.log(err);
    })
  }

  reception() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['apps/reception'])
    );

    window.open(url, '_blank');
  }

  scheduleroute() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['apps/schedule'])
    );

    window.open(url, '_blank');
  }

  drcellroute() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['apps/drcell'])
    );

    window.open(url, '_blank');
  }

  nursecellroute() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['apps/nursecell'])
    );

    window.open(url, '_blank');
  }

  register() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['apps/home'])
    );

    window.open(url, '_blank');
  }

}
