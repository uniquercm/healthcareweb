import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  displayColumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'edit', 'receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
    'pcr8date', 'pcr8result',
    'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus', 'extracteddata', 'sentclaim', 'senton'];
  dataSource: any;

  firstcolumn = ['sno', 'cype', 'crmno', 'name', 'eid', 'mobile', 'edit', 'reception', 'drcell', 'pcr4day', 'pcr8day', 'nursecall',
    'discharge', 'extracteddata', 'sentclaim', 'senton']
  secondcolumn = ['receptionstauts', 'recremarks', 'drcellstatus', 'drremarks', 'pcr4date', 'pcr4result',
    'pcr8date', 'pcr8result',
    'nc3day', 'nc5day', 'nc6day', 'nc7day', 'nc9day', 'dischargedate', 'dischargestatus']

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
} 