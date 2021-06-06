import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { CommonService } from 'src/app/service/common.service'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboarddetails: any;

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
  public barChartLabels: Label[] = ['Admin','Manager', 'Doctor','Nurse', 'Receptionist', 'Team'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true; 

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Count' }
  ];
  teamStatusDetailsList: any[] = [];
  
  constructor(private commonService: CommonService) { 
    this.getreq();
  }

  ngOnInit(): void {
   
  }

  getreq() {
    this.commonService.getmethod('dash-board?companyId=' + this.localvalues.companyId).subscribe((data) => {
      this.dashboarddetails = data.details; 
      this.teamStatusDetailsList = data.details.teamStatusDetailsList;
      let array = [];
      array.push(this.dashboarddetails.totalAdminUserNumber);
      array.push(this.dashboarddetails.totalManagerUserNumber);
      array.push(this.dashboarddetails.totalDoctorUserNumber);
      array.push(this.dashboarddetails.totalNurseUserNumber);
      array.push(this.dashboarddetails.totalReceptionistUserNumber);
      array.push(this.dashboarddetails.totalTeamUserNumber);
      this.barChartData[0].data = array;
    }, err => {
      console.log(err);
    })
  } 

}
 
 