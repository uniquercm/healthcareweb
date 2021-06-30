import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  fourthFormGroup: FormGroup;
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
      address: ['', Validators.nullValidator],
      landmark: ['', Validators.nullValidator],
      area: ['', Validators.nullValidator],
      region: ['', Validators.nullValidator],
      map: ['', Validators.nullValidator]
    });

    this.secondFormGroup = this._formBuilder.group({
      adults: ['', Validators.nullValidator],
      childern: ['', Validators.nullValidator],
      phones: this._formBuilder.array([
        this._formBuilder.control(null)
      ])
    });

    this.thirdFormGroup = this._formBuilder.group({
      stickerapp: ['no', Validators.nullValidator],
      trackerapp: ['no', Validators.nullValidator],
      pcr: ['', Validators.nullValidator],
      stickerrem: ['', Validators.nullValidator],
      trackerrem: ['', Validators.nullValidator],
      remark: ['', Validators.nullValidator],
      remarkstatus: ['', Validators.nullValidator],
      stickerstatus: ['', Validators.nullValidator],
      stickerano: ['', Validators.nullValidator],
      stickerrno: ['', Validators.nullValidator],
      fpspicker: ['', Validators.nullValidator],
      spicker: ['', Validators.nullValidator],
      dischargestatus: ['', Validators.nullValidator]
    });

    this.fourthFormGroup = this._formBuilder.group({
      vstatus: ['', Validators.nullValidator],
      vremark: ['', Validators.nullValidator],
      vdate: ['', Validators.nullValidator]
    });
  }

  ngOnInit() {
    this.getdata();
  }

  getdata() {
    this.commonService.getmethod('scheduled?companyId=' + this.localvalues.companyId + '&patientId=' + editvalues.patientid + '&?isFieldAllocation=true&fieldAllocationStatus=all&serviceName=all&serviceStatus=all').subscribe((data) => {
      this.data = data.details[0];
   
      this.formGroup.controls['crmType'].setValue(this.data.patientInformation.requestCrmName);
      this.formGroup.controls['crmNo'].setValue(this.data.patientInformation.crmNo);
      this.formGroup.controls['name'].setValue(this.data.patientName);
      this.formGroup.controls['eid'].setValue(this.data.patientInformation.eidNo);
      this.formGroup.controls['mobileno'].setValue(this.data.patientInformation.mobileNo);

      this.firstFormGroup.controls['address'].setValue(this.data.patientInformation.address);
      this.firstFormGroup.controls['landmark'].setValue(this.data.patientInformation.landMark);
      this.firstFormGroup.controls['area'].setValue(this.data.patientInformation.area);
      this.firstFormGroup.controls['region'].setValue(this.data.patientInformation.region);
      this.firstFormGroup.controls['map'].setValue(this.data.patientInformation.googleMapLink);

      this.secondFormGroup.controls['adults'].setValue(this.data.patientInformation.adultsCount);
      this.secondFormGroup.controls['childern'].setValue(this.data.patientInformation.childrensCount);

      this.thirdFormGroup.controls['stickerapp'].setValue(this.data.patientInformation.stickerApplication);
      this.thirdFormGroup.controls['dischargestatus'].setValue(this.data.patientInformation.dischargeStatus);
      this.thirdFormGroup.controls['trackerapp'].setValue(this.data.patientInformation.trackerApplication);
      this.thirdFormGroup.controls['pcr'].setValue(this.data.patientInformation.pcr);
      this.thirdFormGroup.controls['stickerrem'].setValue(this.data.patientInformation.stickerRemoval);
      if (this.thirdFormGroup.value.stickerrem === '') {
        this.srem = false;
      } else {
        this.srem = true;
      }

      if (this.thirdFormGroup.value.stickerapp === '') {
        this.sappl = false;
      } else {
        this.sappl = true;
      }

      this.thirdFormGroup.controls['trackerrem'].setValue(this.data.patientInformation.trackerRemoval);
      // this.thirdFormGroup.controls['remarkstatus'].setValue(this.data.patientInformation.recptionCallStatus);
      // this.thirdFormGroup.controls['remark'].setValue(this.data.recptionCallRemarks);

      if (this.data.stickerRemovedDate !== '0001-01-01T00:00:00') {
        this.thirdFormGroup.controls['stickerstatus'].setValue('removed');
        this.thirdFormGroup.controls['fpspicker'].setValue(this.data.stickerRemovedDate);

        this.thirdFormGroup.controls['fpspicker'].setValue(this.data.stickerano);

      }

      if (this.data.trackerAppliedDate !== '0001-01-01T00:00:00') {
        this.thirdFormGroup.controls['stickerstatus'].setValue('applied');
        this.thirdFormGroup.controls['spicker'].setValue(this.data.trackerAppliedDate);
        this.thirdFormGroup.controls['fpspicker'].setValue(this.data.stickerrno);
      }


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
  sappl: any;
  srem: any;

  addPhone(): void {

    let value: number = Number(this.secondFormGroup.value.adults) + Number(this.secondFormGroup.value.childern);
    if (this.secondFormGroup.value.phones.length === value) {
      alert('Maxmium MMID reached');
      return;
    }
    (this.secondFormGroup.get('phones') as FormArray).push(
      this._formBuilder.control(null)
    );
  }

  removePhone(index: number) {
    (this.secondFormGroup.get('phones') as FormArray).removeAt(index);
  }

  getPhonesFormControls(): AbstractControl[] {
    return (<FormArray>this.secondFormGroup.get('phones')).controls
  }

  saverec() {
    let value: any = editvalues.nurse;

    let map = {
      'patientId': this.data.patientId,
      "companyId": this.data.companyId,
      "scheduledId": value.scheduledId,
      "trackerScheduleDate": this.data.trackerScheduleDate,
      "trackerAppliedDate": this.thirdFormGroup.value.stickerstatus === 'applied' ? this.datepipe.transform(this.thirdFormGroup.value.spicker, 'MM-dd-yyyy') : '0001-01-01T00:00:00',
      "stickerScheduleDate": this.data.stickerScheduleDate,
      "stickerRemovedDate": this.thirdFormGroup.value.stickerstatus === 'removed' ? this.datepipe.transform(this.thirdFormGroup.value.spicker, 'MM-dd-yyyy') : '0001-01-01T00:00:00',
      "stickerTrackerNumber": this.thirdFormGroup.value.stickerano,
      "trackerReplacedDate": this.thirdFormGroup.value.fpspicker === '' ? '0001-01-01T00:00:00' : this.datepipe.transform(this.thirdFormGroup.value.fpspicker, 'MM-dd-yyyy'),
      "trackerReplaceNumber": this.thirdFormGroup.value.stickerrno,
      "stickerTrackerResult": this.thirdFormGroup.value.stickerstatus,
      "enrolledCount": this.secondFormGroup.value.phones.length,
      "enrolledDetails": JSON.stringify(this.secondFormGroup.value.phones),
      "modifiedBy": this.localvalues.userId,
      "stickerApplication": this.thirdFormGroup.value.stickerapp,
      "stickerRemoval": this.thirdFormGroup.value.stickerrem,
      "trackerApplication": this.thirdFormGroup.value.trackerapp,
      "trackerRemoval": this.thirdFormGroup.value.trackerrem
    }

    this.commonService.putmethod('serviceplan', map).subscribe((data) => {
      alert('Updated Successfully');
      this.router.navigateByUrl('/apps/fieldallocation/nurse');
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
      isPCRCall: true,
      "createdBy": this.localvalues.userId,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": true
    }

    this.commonService.putmethod('doctor-nurse-team-call', map).subscribe((data) => {
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
