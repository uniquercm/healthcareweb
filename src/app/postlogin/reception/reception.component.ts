import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../commonvaribale/commonvalues';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss']
})
export class ReceptionComponent implements OnInit, OnDestroy {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  formGroup: FormGroup;
  data: any;
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  cityarray: any[] = [];

  constructor(private _formBuilder: FormBuilder, private commonService: CommonService,
    public datepipe: DatePipe, private router: Router) {
    if (localStorage.getItem('patientedit') !== null) {
      let value: any = JSON.parse(localStorage.getItem('patientedit') || '{}');
      editvalues.patientid = value.patientid;
      editvalues.scheduleid = value.scheduleid;
      editvalues.drcallid = value.drcallid;
    }
    this.formGroup = this._formBuilder.group({
      crmType: ['', Validators.nullValidator],
      crmNo: ['', Validators.nullValidator],
      name: ['', Validators.nullValidator],
      eid: ['', Validators.nullValidator],
      mobileno: ['', Validators.nullValidator]
    });

    this.getarea();
    this.getcity();

    this.firstFormGroup = this._formBuilder.group({
      address: ['', Validators.nullValidator],
      landmark: ['', Validators.nullValidator],
      area: ['', Validators.nullValidator],
      region: ['', Validators.nullValidator],
      map: ['', Validators.nullValidator],
      addstatus: ['', Validators.nullValidator]
    });

    this.secondFormGroup = this._formBuilder.group({
      adults: ['', Validators.nullValidator],
      childern: ['', Validators.nullValidator]
    });

    this.thirdFormGroup = this._formBuilder.group({
      stickerapp: ['', Validators.nullValidator],
      trackerapp: ['', Validators.nullValidator],
      pcr: ['', Validators.nullValidator],
      stickerrem: ['', Validators.nullValidator],
      trackerrem: ['', Validators.nullValidator],
      remark: ['', Validators.nullValidator],
      remarkstatus: ['', Validators.nullValidator],
      stickerstatus: ['', Validators.nullValidator],
      stickerano: ['', Validators.nullValidator],
      stickerrno: ['', Validators.nullValidator],
      fpspicker: ['', Validators.nullValidator],
      spicker: ['', Validators.nullValidator]
    });

  }

  ngOnInit() {
    if (editvalues.headerbuttclick)
      this.getdata();
  }

  getcity() {
    this.commonService.getmethod('city').subscribe((datas) => {
      this.cityarray = datas.details;
    }, err => {
      console.log(err);
    })

  }

  keyword = 'areaName';
  areas = '';
  select(event: any) {
    this.areas = event.areaName;
  }

  sappl: any;
  srem: any;

  getdata() {
    this.commonService.getmethod('patient?companyId=' + this.localvalues.companyId + '&patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=false').subscribe((data) => {
      this.data = data.details[0];
      this.formGroup.controls['crmType'].setValue(this.data.requestCrmName);
      this.formGroup.controls['crmNo'].setValue(this.data.crmNo);
      this.formGroup.controls['name'].setValue(this.data.patientName);
      this.formGroup.controls['eid'].setValue(this.data.eidNo);
      this.formGroup.controls['mobileno'].setValue(this.data.mobileNo);
      if (this.data.recptionCallStatus === undefined) {
        this.firstFormGroup.controls['addstatus'].setValue('pending');
      } else {
        this.firstFormGroup.controls['addstatus'].setValue(this.data.recptionCallStatus);
      }

      this.firstFormGroup.controls['address'].setValue(this.data.address);
      this.firstFormGroup.controls['landmark'].setValue(this.data.landMark);
      this.firstFormGroup.controls['area'].setValue(this.data.area);
      this.firstFormGroup.controls['region'].setValue(this.data.cityId);
      this.firstFormGroup.controls['map'].setValue(this.data.googleMapLink);

      this.secondFormGroup.controls['adults'].setValue(this.data.adultsCount);
      this.secondFormGroup.controls['childern'].setValue(this.data.childrensCount);

      this.thirdFormGroup.controls['stickerapp'].setValue(this.data.stickerApplication);
      if (this.thirdFormGroup.value.stickerapp === '') {
        this.sappl = false;
      } else {
        this.sappl = true;
      }
      this.thirdFormGroup.controls['trackerapp'].setValue(this.data.trackerApplication);
      this.thirdFormGroup.controls['pcr'].setValue(this.data.pcr);
      this.thirdFormGroup.controls['stickerrem'].setValue(this.data.stickerRemoval);
      if (this.thirdFormGroup.value.stickerrem === '') {
        this.srem = false;
      } else {
        this.srem = true;
      }
      this.thirdFormGroup.controls['trackerrem'].setValue(this.data.trackerRemoval);
      this.thirdFormGroup.controls['pcr'].setValue(this.data.pcr);
      this.thirdFormGroup.controls['remark'].setValue(this.data.recptionCallRemarks);
    }, err => {
      console.log(err);
    })
  }

  stausvalue: any = '';
  statuschange(event: any) {
    if (event.value === 'applied' || event.value === 'removed') {
      this.stausvalue = 'applied';
    } else if (event.value === 'replace') {
      this.stausvalue = 'replace';
    }
  }

  save() {

    let map = {
      'patientId': this.data.patientId,
      "patientName": this.data.patientName,
      "companyId": this.data.companyId,
      "companyName": this.data.companyName,
      "requestId": this.data.requestId,
      "crmNo": this.data.crmNo,
      "eidNo": this.data.eidNo,
      "dateOfBirth": this.datepipe.transform(this.data.dateOfBirth, 'MM-dd-yyyy'),
      "age": this.data.age,
      "sex": this.data.sex,
      "address": this.firstFormGroup.value.address,
      "landMark": this.firstFormGroup.value.landmark,
      "area": this.firstFormGroup.value.area.areaName === undefined ? this.firstFormGroup.value.area : this.firstFormGroup.value.area.areaName,
      "cityId": this.firstFormGroup.value.region,
      "nationalityId": Number(this.data.nationalityId),
      "mobileNo": Number(this.data.mobileNo),
      "googleMapLink": this.firstFormGroup.value.map,
      "stickerApplication": this.thirdFormGroup.value.stickerapp,
      "stickerRemoval": this.thirdFormGroup.value.stickerrem,
      "trackerApplication": this.thirdFormGroup.value.trackerapp,
      "trackerRemoval": this.thirdFormGroup.value.trackerrem,
      "createdBy": this.data.createdBy,
      "stickerTrackerAppliedNumber": this.thirdFormGroup.value.stickerano,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": true,
      "recptionCallDate": this.datepipe.transform(new Date(), 'MM-dd-yyyy'),
      "recptionCallStatus": this.firstFormGroup.value.addstatus,
      "recptionCallRemarks": this.thirdFormGroup.value.remark,
      "isReception": true,
      "adultsCount": this.secondFormGroup.value.adults,
      "childrensCount": this.secondFormGroup.value.childern
    }

    this.commonService.putmethod('patient', map).subscribe((data) => {
      alert('Updated Successfully');

      if (editvalues.headerbuttclick)
        window.close();
      else
        this.router.navigateByUrl('/apps/list');
    }, err => {
      console.log(err);
    })
  }

  areaname = '';
  onChangeSearch(event: any) {
    this.areaname = event;
  }

  next(stepper: any) {
    if (this.firstFormGroup.value.area === undefined) {

    } else {
      if (this.firstFormGroup.value.area.areaName === undefined && this.areaname !== '') {
        alert('Invalid Area');
        return;
      }
    }
    stepper.next();
  }

  area: any[] = [];
  getarea() {
    this.commonService.getmethod('area').subscribe((data) => {
      let array;
      array = data.details;
      array.forEach((element: any) => {
        if (element.areaName === null) {

        } else if (element.areaName === undefined) {

        }
        else if (element.areaName === '') {

        } else {
          this.area.push(element);
        }
      });

    }, err => {
      console.log(err);
    })
  }

  ngOnDestroy() {
    editvalues.drcallid = 0;
    editvalues.patientid = 0;
    editvalues.scheduleid = 0;
    editvalues.headerbuttclick = true;
    localStorage.removeItem('patientedit');
  }

}
