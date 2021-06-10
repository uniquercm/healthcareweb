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
      array.push(this.dashboarddetails.allUserTypeDetails.totalAdminUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalManagerUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalDoctorUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalNurseUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalReceptionistUserNumber);
      array.push(this.dashboarddetails.allUserTypeDetails.totalTeamUserNumber);
      this.barChartData[0].data = array;
    }, err => {
      console.log(err);
    })
  } 

}
 
 