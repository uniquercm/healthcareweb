import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { CommonService } from 'src/app/service/common.service';
import { loader } from '../commonvaribale/commonvalues';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboarddetails: any;
  companyarray: any[] = [];
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Admin', 'Manager', 'Doctor', 'Nurse', 'Receptionist', 'Team'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Count' }
  ];
  teamStatusDetailsList: any[] = [];

  constructor(private commonService: CommonService) {
    loader.loading = true;
    this.getCompany();
    this.getreq(this.localvalues.companyId);
  }

  ngOnInit(): void {

  }

  getreq(url: any) {  
    this.commonService.getmethodws('dash-board?companyId=' + url).subscribe((data) => {
      this.dashboarddetails = data.details;
      this.teamStatusDetailsList = data.details.teamStatusDetailsList;
      let array = [];
      array.push(this.dashboarddetails.allUserTypeDetails.totalAdminUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalManagerUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalDoctorUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalNurseUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalReceptionistUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalTeamUserNumber);
      this.barChartData[0].data = array; 
      loader.loading = false;
    }, err => {
      loader.loading = false;
      console.log(err);
    })
  }

  getCompany() {
    this.commonService.getmethodws('company').subscribe((data) => {
      this.companyarray = data.details;
      
    }, err => {
      loader.loading = false;
      console.log(err);
    })
  }

}

