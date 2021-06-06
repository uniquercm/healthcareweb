import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../commonvaribale/commonvalues';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss']
})
export class ReceptionComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  formGroup: FormGroup;
  data: any;
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  cityarray: any[] = [];

  constructor(private _formBuilder: FormBuilder, private commonService: CommonService,
    public datepipe: DatePipe) {
    this.formGroup = this._formBuilder.group({
      crmType: ['', Validators.required],
      crmNo: ['', Validators.required],
      name: ['', Validators.required],
      eid: ['', Validators.required],
      mobileno: ['', Validators.required]
    });
    this.getcity();

    this.firstFormGroup = this._formBuilder.group({
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      area: ['', Validators.required],
      region: ['', Validators.required],
      map: ['', Validators.required],
      addstatus: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      adults: ['', Validators.required],
      childern: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      stickerapp: ['no', Validators.required],
      trackerapp: ['no', Validators.required],
      pcr: ['', Validators.required],
      stickerrem: ['', Validators.required],
      trackerrem: ['', Validators.required],
      remark: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getdata();
  }


  getcity() {
    this.commonService.getmethod('city').subscribe((data) => {
      this.cityarray = data.details;
    }, err => {
      console.log(err);
    })

  }

  getdata() {
    this.commonService.getmethod('patient?patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=false').subscribe((data) => {
      this.data = data.details[0];
      this.formGroup.controls['crmType'].setValue(this.data.requestCrmName);
      this.formGroup.controls['crmNo'].setValue(this.data.crmNo);
      this.formGroup.controls['name'].setValue(this.data.patientName);
      this.formGroup.controls['eid'].setValue(this.data.eidNo);
      this.formGroup.controls['mobileno'].setValue(this.data.mobileNo);

      this.firstFormGroup.controls['address'].setValue(this.data.address);
      this.firstFormGroup.controls['landmark'].setValue(this.data.landMark);
      this.firstFormGroup.controls['area'].setValue(this.data.area);
      this.firstFormGroup.controls['region'].setValue(this.data.cityId);
      this.firstFormGroup.controls['map'].setValue(this.data.googleMapLink);

      this.secondFormGroup.controls['adults'].setValue(this.data.adultsCount);
      this.secondFormGroup.controls['childern'].setValue(this.data.childrensCount);

      this.thirdFormGroup.controls['stickerapp'].setValue(this.data.stickerApplication);
      this.thirdFormGroup.controls['trackerapp'].setValue(this.data.trackerApplication);
      this.thirdFormGroup.controls['pcr'].setValue(this.data.pcr);
      this.thirdFormGroup.controls['stickerrem'].setValue(this.data.stickerRemoval);
      this.thirdFormGroup.controls['trackerrem'].setValue(this.data.trackerRemoval);

    }, err => {
      console.log(err);
    })
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
      "area": this.firstFormGroup.value.area,
      "cityId": this.data.cityId,
      "nationalityId": Number(this.data.nationalityId),
      "mobileNo": Number(this.data.mobileNo),
      "googleMapLink": this.firstFormGroup.value.google,
      "stickerApplication": this.thirdFormGroup.value.stickerapp,
      "stickerRemoval": this.thirdFormGroup.value.stickerrem,
      "trackerApplication": this.thirdFormGroup.value.trackerapp,
      "trackerRemoval": this.thirdFormGroup.value.trackerrem,
      "createdBy": this.data.createdBy,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": true,
      "isReception": true,
      "adultsCount": this.secondFormGroup.value.adults,
      "childrensCount": this.secondFormGroup.value.childern
    }

    this.commonService.putmethod('patient', map).subscribe((data) => {
      alert('Updated Successfully');
    }, err => {
      console.log(err);
    })
  }

}
