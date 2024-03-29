import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { editvalues, loader, teamfilter } from '../../commonvaribale/commonvalues';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss']
})
export class NurseComponent implements OnInit {

  displayedColumns: string[] = ['id', 'crmNo', 'requestCrmName', 'callScheduledDate', 'patientName', 'allocatedTeamName', 'eidNo', 'mobileNo', 'servicename', 'view'];
  dataSource: any = new MatTableDataSource([]);

  title = 'DR Call';
  array: any = [];
  requestarray: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  searchtype = 'schedule';

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  fromdate: any = '';
  todate: any = '';

  teamstatuss = 'notvisited';
  servicestatuss = '';
  servicename = '';
  //Thanam 12-08-21
  callstatus = '';
  service = '';
  //*************** */

  constructor(private router: Router, private commonService: CommonService, public datepipe: DatePipe) {
    loader.loading = true;
    this.getvalue();
    this.getreq();
    this.getarea();
    this.getCity();
  }

  ngOnInit(): void {
    this.call = teamfilter.call
    this.callstatus = teamfilter.callstatus
    this.fromdate = teamfilter.fromdate
    this.selectedArea = teamfilter.selectedArea
    this.services = teamfilter.services
    this.teamstatuss = teamfilter.teamstatuss
    this.todate = teamfilter.todate;
    this.statuschange('back', '');
    loader.loading = false;/**/
  }


  getreq() {
    this.commonService.getmethod('requestCRM').subscribe((data) => {
      this.requestarray = data.details;
    }, err => {
      console.log(err);
    })
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

  farray: any[] = [];
  selectedArea: any;
  selectarea(name: string, event: any) {
    loader.loading = true;//Thanam 09-08-21
    let farray: any = [];
    if (name === 'case') {
      if (event.value === 'all') {
        this.getPatent();
      } else {
        this.array.forEach((element: any) => {
          if (element.requestId === Number(event.value)) {
            farray.push(element);
          }
        });
      }
    } else if (name === 'area') {
      if (Array.isArray(event)) {
        //Thanam 09-08-21
        let url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team' +
                  '&teamUserName=' + this.localvalues.userName;
          if (this.fromdate !== '') {
            url += '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy');
          }
          if (this.teamstatuss !== '') {
            url += '&callStatus=' + this.teamstatuss;
          }else{
            url += '&callStatus=notvisited';
          }
          if (this.searchtype !== '') {
            url += '&dateSearchType=' + this.searchtype;
          }else{
            url += '&dateSearchType=schedule';
          }
          if (this.call !== '') {
            url += '&serviceStatus=' + this.call;
          }else{
            url += '&serviceStatus=all';
          } 
          if (this.selectedArea !== '') {
            url += '&areaNames=' + this.selectedArea;
          }else{
            url += '&areaNames=all';
          }
          //************************** */
        if (event[0] === 'All') {
          this.commonService.getmethod(url).subscribe((datas) => {
            if (datas.details.length === 0) {
              this.dataSource = new MatTableDataSource([]);
              alert('No data Found');
              return;
            }
            this.array = [];
            this.array = datas.details;
            this.array.forEach((o: any, i: any) => o.id = i + 1);
            this.array.forEach((elam: any) => {
              if (elam.emrDone === 'yes') {
                elam.emrDone = true
              } else {
                elam.emrDone = false
              }
            });
      
            this.farray = this.array;
            this.dataSource = new MatTableDataSource(this.array);
      
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return;
          }, err => {
            console.log(err);
          })
          /*farray = this.array;

          this.dataSource = new MatTableDataSource(farray);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          return;*/
        } else {//Thanam 09-08-21
          /*let url = '';
          if (this.fromdate == '') {
            url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team'
              + '&teamUserName=' + this.localvalues.userName + '&areaNames=' + this.selectedArea;
          } else if (this.searchtype !== '') {
            url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team'
              + '&teamUserName=' + this.localvalues.userName + '&fromDate='
              + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
              + '&dateSearchType=' + this.searchtype + '&areaNames=' + this.selectedArea;
          } else if (this.call !== '') {
            url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
              '&teamUserName=' + this.localvalues.userName + '&fromDate='
              + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy') + '&areaNames=' + this.selectedArea;
          } else {
            url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team' +
              '&teamUserName=' + this.localvalues.userName + '&fromDate='
              + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
              + '&areaNames=' + this.selectedArea;
          }*/
          //************************ */

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
        }
      }
    }
    else if (name === 'city') {
      if (event === 'all') {
        this.array = this.farray;
        this.dataSource = new MatTableDataSource(this.array);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        loader.loading = false;//Thanam 11-08-21
        return;
      } else {
        //debugger
        this.array.forEach((element: any) => {
          //Thanam 11-08-21
          //if (element.cityId === (event.value)) {
          if (element.cityId === (event)) {//*************** */
            farray.push(element);
          }
        });
      }
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
    loader.loading = false;//Thanam 09-08-21
  }

  area: any = [];

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
    this.commonService.getmethod('city').subscribe((datac) => {
      this.city = datac.details;
    }, err => {
      console.log(err);
    })
  }

  clear(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any, calls: any, callstatus: any, service: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
    this.selectedArea = '';
    this.fromdate = '';
    this.todate = '';
    //Thanam 12-08-21
    this.callstatus = '';
    this.services = '';
    this.call = '';
    this.teamstatuss = 'notvisited';
    //*************** */
    calls.value = 'notvisited';
    callstatus.value = '';
    service.value = '';

    this.getvalue();
  }

  clearf(input: any, mobile: any, eid: any, crm: any, crmno: any, area: any, region: any, callstatus: any, service: any, calls: any) {
    input.value = '';
    mobile.value = '';
    eid.value = '';
    crm.value = '';
    crmno.value = '';
    area.value = '';
    region.value = '';
    callstatus.value = '';
    service.value = '';
    //Thanam 12-08-21
    this.callstatus = '';
    this.services = '';
    this.call = '';
    this.teamstatuss = 'notvisited';
    //*************** */
    calls.value = 'notvisited';
    this.selectedArea = '';
  }

  getvalue() {
    //Thanam  09-08-21
    //let url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=notvisited&callStatus=all&teamUserName=' + this.localvalues.userName;
    let url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=all&callStatus=notvisited&teamUserName=' + this.localvalues.userName;
    //*********************** */

    this.commonService.getmethod(url).subscribe((data) => {
      if (data.details.length === 0) {
        this.array = [];
        this.dataSource = new MatTableDataSource([]);
        alert('No data Found');
        return;
      }
      this.array = [];
      this.array = data.details;
      this.array.forEach((o: any, i: any) => o.id = i + 1);
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

      this.farray = this.array;
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    })
  }

  call: any = '';
  services: any = '';

  statuschange(name: string, value: any) {
    loader.loading = true;//Thanam 09-08-21
    let url = '';

    //Thanam 09-08-21
    /*if (name === 'call') {
      this.call = value.value;
      if (this.services === '') {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }

      } else {
        if (this.fromdate == '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }

      }
    } else if (name === 'calls') {
      this.call = value.value;
      if (this.services === '') {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value +
            '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value +
            '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }

      } else {
        if (this.fromdate == '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value + '&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value + '&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }
      }
    }*/
    if (name === 'calls') {
      this.teamstatuss = value.value;
      //Thanam 12-08-21
      /*if (this.services === '') {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value +
            '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value +
            '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }

      } else {
        if (this.fromdate == '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value + '&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=' + value.value + '&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }
      }*/
      //****************** */
    }else if (name === 'call') {
      this.call = value.value;
      //Thanam 12-08-21
      /*if (this.services === '') {
        if (this.fromdate === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }

      } else {
        if (this.fromdate == '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName
        } else {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call +
            '&serviceName=' + this.services + '&teamUserName=' + this.localvalues.userName + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
        }
      }*/
    }//********************************* */
    else if (name === 'back') {
    }
     else {
      this.services = value.value;
      //Thanam 12-08-21
      /*if (this.call === '') {
          url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&teamUserName=' + this.localvalues.userName
            + '&serviceName=' + this.services + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
      } else {
            url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&serviceStatus=' + this.call + '&teamUserName=' + this.localvalues.userName
            + '&serviceName=' + this.services + '&fromDate='
            + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
            + '&dateSearchType=' + this.searchtype;
      }*/
      //*********************** */
    }

    //Thanam 12-08-21
    url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId 
    + '&callName=team&teamUserName=' + this.localvalues.userName;

    if (this.fromdate !== '')
      url += '&fromDate=' + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') 
      + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy');

    //debugger
    if (this.teamstatuss !== '' && this.teamstatuss !== 'all')
      url += '&callStatus=' + this.teamstatuss;
    else if(this.teamstatuss !== 'all')
      url += '&callStatus=notvisited';
    else
      url += '&callStatus=all';

    if (this.call !== '' && this.call !== 'all')
      url += '&serviceStatus=' + this.call;
    else
      url += '&serviceStatus=all';
    this.servicestatuss = this.call;

    if (this.services !== '' && this.services !== 'all')
    url += '&serviceName=' + this.services;
    else
      url += '&serviceName=all';
    this.servicename = this.services;

    if (this.searchtype !== '')
      url += '&dateSearchType=' + this.searchtype;
    else
      url += '&dateSearchType=schedule';
    //******************************* */

    this.commonService.getmethod(url).subscribe((data) => {
      if (data.details.length === 0) {
        this.dataSource = new MatTableDataSource([]);
        alert('No data Found');
        return;
      }

      this.array = [];
      this.array = data.details;
      this.array.forEach((o: any, i: any) => o.id = i + 1);
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

      this.farray = this.array;
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }, err => {
      console.log(err);
    })
    loader.loading = false;//Thanam 09-08-21

  }

  getPatent() {
    let url = '';
    //Thanam 09-08-21
    if (this.fromdate !== '') {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus='
        + this.teamstatuss + '&teamUserName=' + this.localvalues.userName + '&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
        + '&serviceStatus=all' + '&dateSearchType=' + this.searchtype;
    } else {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus='
        + this.teamstatuss + '&teamUserName='
        + this.localvalues.userName + '&serviceStatus=all'
    }
    /*if (this.fromdate !== '') {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=all&teamUserName=' + this.localvalues.userName + '&fromDate='
        + this.datepipe.transform(this.fromdate, 'MM-dd-yyyy') + '&toDate=' + this.datepipe.transform(this.todate, 'MM-dd-yyyy')
        + '&serviceStatus=all' + '&dateSearchType=' + this.searchtype;
    } else {
      url = 'doctor-nurse-team-call?companyId=' + this.localvalues.companyId + '&callName=team&callStatus=all&teamUserName='
        + this.localvalues.userName + '&serviceStatus=all'
    }*/
    //******************************** */

    this.commonService.getmethod(url).subscribe((data) => {
      //Thanam 09-08-21
      //debugger
      //****************** */
      if (data.details.length === 0) {
        this.dataSource = new MatTableDataSource([]);
        alert('No data Found');
        return;
      }
      this.array = [];
      this.array = data.details;
      this.array.forEach((o: any, i: any) => o.id = i + 1);
      this.array.forEach((elam: any) => {
        if (elam.emrDone === 'yes') {
          elam.emrDone = true
        } else {
          elam.emrDone = false
        }
      });

      this.farray = this.array;
      this.dataSource = new MatTableDataSource(this.array);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

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
    loader.loading = true;//Thanam 09-08-21
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
    loader.loading = false;//Thanam 09-08-21
  }

  click(element: any) {
    editvalues.patientid = element.patientId
    editvalues.nurse = element;
    teamfilter.call = this.call
    teamfilter.callstatus = this.callstatus
    teamfilter.fromdate = this.fromdate
    teamfilter.selectedArea = this.selectedArea
    teamfilter.services = this.services
    teamfilter.teamstatuss = this.teamstatuss
    teamfilter.todate = this.todate;
  }

  select(event: any) {
    let farray: any = [];
    this.array.forEach((element: any) => {
      if (element.patientInformation.requestId === Number(event.value)) {
        farray.push(element);
      }
    });

    this.dataSource = new MatTableDataSource(farray);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sortDir = 1;

  onSortClick(event: any, name: any) {
    loader.loading = true;//Thanam 09-08-21
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr(name);
    loader.loading = false;//Thanam 09-08-21
  }

  sortArr(colName: any) {
    this.farray.sort((a, b) => {
      if (a[colName] === null) {
        a[colName] = '';
      }
      if (b[colName] === null) {
        b[colName] = '';
      }
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();

      return a.localeCompare(b) * this.sortDir;
    });
  }


}