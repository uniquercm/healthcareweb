import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  data: any[] = [];
  keyword = 'value';
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
    let map = {
      areaId: this.finalList.length + 1,
      regionId: crm.value,
      areaName: this.area
    }
    this.commonService.postmethod('area', map).subscribe((data) => {
      alert('Added successfully');
      this.getarea();
    }, err => {
      console.log(err);
    })
  }

  selectEvent(item: any) {
    this.area = item.id
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
      console.log(array);
      array.forEach((element: any) => {
        if (element.value === null) {

        } else if (element.value === undefined) {

        }
        else if (element.value === '') {

        } else {
          this.data.push(element)
        }

      });
      // array.splice(0, 1);
      // this.data = array;
      console.log(this.data);
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
