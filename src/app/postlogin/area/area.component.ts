import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  data: any[] = [];
  keyword = 'areaName';
  area: any;
  finalList: any[] = [];
  receptionarray: any[] = [];

  constructor(private commonService: CommonService) {
    this.getarea();
    this.getReception();
  }

  ngOnInit(): void {
  }

  add(crm: any) {
    if(crm.value === '' || crm.value === undefined)
    {
      alert('Invalid Region Name');
      return;
    }
    if(this.area === '' || this.area === undefined)
    {
      alert('Invalid Area Name');
      return;
    }
    let map = {
      areaId: this.finalList.length + 1,
      regionName: crm.value.cityName,
      regionId: crm.value.cityId,
      areaName: this.area
    }
    this.commonService.postmethod('area', map).subscribe((data) => {
      alert('Added successfully');
      //debugger
      crm = '';
      this.area = '';
      this.getarea();
    }, err => {
      console.log(err);
    })
  }

  selectEvent(item: any) {
    this.area = item.areaId
  }

  onChangeSearch(val: string) {
    this.area = val;
  }

  onFocused(e: any) {

  }

  getarea() {
    this.commonService.getmethod('area').subscribe((data) => {
      let array;
      array = data.details;
      this.finalList = data.details;
      array.forEach((element: any) => {
        if (element.areaName === null) {

        } else if (element.areaName === undefined) {

        }
        else if (element.areaName === '') {

        } else {
          this.data.push(element)
        }

      });
    }, err => {
      console.log(err);
    })
  }

  getReception() {
    this.commonService.getmethod('city').subscribe((data) => {
      this.receptionarray = data.details;
    }, err => {
      console.log(err);
    })
  }
}
