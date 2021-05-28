import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drcell',
  templateUrl: './drcell.component.html',
  styleUrls: ['./drcell.component.scss']
})
export class DrcellComponent implements OnInit {

  displayedColumns: string[] = ['no', 'crmtype', 'crmno','sdate', 'name', 'eid', 'mobile', 'date', 'status', 'remarks', 'emr', 'save'];
  dataSource: any = new MatTableDataSource(array);

  title = 'DR Cell';

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
   
  constructor(private router: Router) { 
    console.log(router.url);
    if (router.url === '/apps/drcell') {
      this.title = 'DR Cell';
    } else  {
      this.title = 'Nurse Cell';
    }
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

}

const array = [
  {
    no: 1,
    crmtype: 'HQP',
    crmno: '1234',
    name: 'Mohmamed',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865'
  },
  {
    no: 2,
    crmtype: 'HIP',
    crmno: '4589',
    name: 'Anitha',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865'
  },
  {
    no: 3,
    crmtype: 'HIP',
    crmno: '5789',
    name: 'Kesavan',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865'
  },
  {
    no: 4,
    crmtype: 'HQP',
    crmno: '8699',
    name: 'Alina',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865'
  },
  {
    no: 5,
    crmtype: 'CRM',
    crmno: '2019',
    name: 'Ramya',
    eid: '111-1111-1111111-6',
    mobile: '+971 55 378 9865'
  }
]