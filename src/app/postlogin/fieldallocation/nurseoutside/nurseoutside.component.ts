import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { editvalues } from '../../commonvaribale/commonvalues';


@Component({
  selector: 'app-nurseoutside',
  templateUrl: './nurseoutside.component.html',
  styleUrls: ['./nurseoutside.component.scss']
})
export class NurseoutsideComponent implements OnInit, OnDestroy {


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  formGroup: FormGroup;
  data: any;
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(private _formBuilder: FormBuilder, private commonService: CommonService,
    private router: Router,
    public datepipe: DatePipe) {

    console.log(editvalues)

    this.formGroup = this._formBuilder.group({
      crmType: ['', Validators.required],
      crmNo: ['', Validators.required],
      name: ['', Validators.required],
      eid: ['', Validators.required],
      mobileno: ['', Validators.required]
    });

    this.firstFormGroup = this._formBuilder.group({
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      area: ['', Validators.required],
      region: ['', Validators.required],
      map: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      adults: ['', Validators.required],
      childern: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      stickerapp: ['', Validators.required],
      trackerapp: ['', Validators.required],
      pcr: ['', Validators.required],
      stickerrem: ['', Validators.required],
      trackerrem: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getdata();
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
      this.firstFormGroup.controls['region'].setValue(this.data.region);
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

  save(visit: any, remark: any, vdate: any) {
    let value: any = editvalues.nurse;
    let map = {
      "callId": value.callId,
      "scheduledId": value.scheduledId,
      "callScheduledDate": value.callScheduledDate,
      "calledDate": vdate.value,
      "callStatus": visit.value,
      "remarks": remark.value,
      "emrDone": value.emrDone,
      "createdBy": this.localvalues.userId,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": true
    }

    this.commonService.putmethod('call', map).subscribe((data) => {
      alert('Saved successfully');
      this.router.navigateByUrl('/apps/fieldallocation/nurse');
    }, err => {
      console.log(err);
    })

  }

  ngOnDestroy() {
    editvalues.drcallid = 0;
    editvalues.scheduleid = 0;
    editvalues.patientid = 0;
  }
}
