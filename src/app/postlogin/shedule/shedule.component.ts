import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import Swal from 'sweetalert2'
import { editvalues } from '../commonvaribale/commonvalues';


@Component({
  selector: 'app-shedule',
  templateUrl: './shedule.component.html',
  styleUrls: ['./shedule.component.scss']
})
export class SheduleComponent implements OnInit, OnDestroy {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  formGroup: FormGroup;

  discharge = true;
  isolation = true;
  dischargedate = false;
  check = false;
  type = '';
  array: any = '';
  edit = false;

  disablevalue = true;

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(private _formBuilder: FormBuilder, private commonService: CommonService, private router: Router,
    public datepipe: DatePipe) {
    this.formGroup = this._formBuilder.group({
      age: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.firstFormGroup = this._formBuilder.group({
      conducteddate: ['', Validators.required],
      result: ['', Validators.required],
      vaccinestatus: ['', Validators.required],
      dischargedate: ['', Validators.nullValidator],
      quarantine: ['', Validators.nullValidator],
      isolation: ['', Validators.nullValidator]
    });
    this.secondFormGroup = this._formBuilder.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.nullValidator],
      drpicker: ['', Validators.nullValidator],
      drspicker: ['', Validators.nullValidator],
      fourpicker: ['', Validators.nullValidator],
      fourspicker: ['', Validators.nullValidator],
      fourresult: ['', Validators.nullValidator],
      eightpicker: ['', Validators.nullValidator],
      eightspicker: ['', Validators.nullValidator],
      eightresult: ['', Validators.nullValidator],
      dischargepicker: ['', Validators.nullValidator],
      dischargespicker: ['', Validators.nullValidator],
      dischargerpicker: ['', Validators.nullValidator]
    });
    this.thirdFormGroup = this._formBuilder.group({
      isostartdate: ['', Validators.required],
      isoenddate: ['', Validators.nullValidator],
      drpicker: ['', Validators.nullValidator],
      drspicker: ['', Validators.nullValidator],
      eightpicker: ['', Validators.nullValidator],
      callstatus: ['', Validators.nullValidator],
      drremark: ['', Validators.nullValidator],
      fppicker: ['', Validators.nullValidator],
      fpspicker: ['', Validators.nullValidator],
      resultpcr: ['', Validators.nullValidator],
      fivepicker: ['', Validators.nullValidator],
      fivestatus: ['', Validators.nullValidator],
      fiveremark: ['', Validators.nullValidator],
      sixpicker: ['', Validators.nullValidator],
      sixstatus: ['', Validators.nullValidator],
      sixremark: ['', Validators.nullValidator],
      sdpicker: ['', Validators.nullValidator],
      sevenstatus: ['', Validators.nullValidator],
      sevenremark: ['', Validators.nullValidator],
      edppicker: ['', Validators.nullValidator],
      edcpicker: ['', Validators.nullValidator],
      eightresultpcr: ['', Validators.nullValidator],
      nnpicker: ['', Validators.nullValidator],
      ninestatus: ['', Validators.nullValidator],
      nineremark: ['', Validators.nullValidator],
      isodispicker: ['', Validators.nullValidator],
      dischargespicker: ['', Validators.nullValidator],
      dischargerpicker: ['', Validators.nullValidator]

    });
  }

  ngOnInit() {
    this.commonService.getmethod('scheduled?patientId=' + editvalues.patientid + '&isFieldAllocation=false').subscribe((data) => {
      if (data.details.length === 0) {
        this.commonService.getmethod('patient?patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=false').subscribe((res) => {
          this.formGroup.controls['name'].setValue(res.details[0].patientName);
          this.formGroup.controls['age'].setValue(res.details[0].age);
          this.edit = false;
          return;
        }, err => {
          console.log(err);
        })

      }

      this.array = data.details[0];
      this.edit = true;
      this.formGroup.controls['name'].setValue(this.array.patientName);
      this.formGroup.controls['age'].setValue(this.array.age);

      this.firstFormGroup.controls['conducteddate'].setValue(this.array.pcrTestDate);
      this.firstFormGroup.controls['result'].setValue(this.array.pcrResult);

      this.firstFormGroup.controls['dischargedate'].setValue(this.array.dischargeDate);
      this.check = true;
      if (this.array.treatmentType === 'isolation') {
        this.isolation = false;
        this.type = 'isolation';
        this.firstFormGroup.controls['quarantine'].setValue('isolation');
      } else if (this.array.treatmentType === 'quarantine') {
        this.discharge = false;
        this.type = 'quarantine';
        this.firstFormGroup.controls['quarantine'].setValue('quarantine');
      } else {
        this.check = false;
        this.dischargedate = true;
      }

      if (this.array.treatmentType === 'isolation') {
        this.thirdFormGroup.controls['isostartdate'].setValue(this.array.treatmentFromDate);
        this.thirdFormGroup.controls['isoenddate'].setValue(this.array.treatmentToDate);
        this.thirdFormGroup.controls['drpicker'].setValue(this.array.day2CallDetails.callScheduledDate);
        this.thirdFormGroup.controls['drspicker'].setValue(this.array.day2CallDetails.calledDate);
        this.thirdFormGroup.controls['eightpicker'].setValue(this.array.day3CallDetails.callScheduledDate);
        this.thirdFormGroup.controls['callstatus'].setValue(this.array.day3CallDetails.callStatus);
        this.thirdFormGroup.controls['drremark'].setValue(this.array.day3CallDetails.remarks);
        this.thirdFormGroup.controls['fppicker'].setValue(this.array.pcR4DayTestDate);
        this.thirdFormGroup.controls['fpspicker'].setValue(this.array.pcR4DaySampleDate);
        this.thirdFormGroup.controls['resultpcr'].setValue(this.array.pcR4DayResult);
        this.thirdFormGroup.controls['fivepicker'].setValue(this.array.day5CallDetails.callScheduledDate);
        this.thirdFormGroup.controls['sixpicker'].setValue(this.array.day6CallDetails.callScheduledDate);

        this.thirdFormGroup.controls['sdpicker'].setValue(this.array.day7CallDetails.callScheduledDate);

        this.thirdFormGroup.controls['edppicker'].setValue(this.array.pcR8DayTestDate);
        this.thirdFormGroup.controls['edcpicker'].setValue(this.array.pcR8DaySampleDate);
        this.thirdFormGroup.controls['eightresultpcr'].setValue(this.array.pcR8DayResult);
        this.thirdFormGroup.controls['nnpicker'].setValue(this.array.day9CallDetails.callScheduledDate);

        this.thirdFormGroup.controls['isodispicker'].setValue(this.array.dischargeDate);

        this.thirdFormGroup.controls['dischargespicker'].setValue(this.array.dischargeStatus);

        this.thirdFormGroup.controls['dischargerpicker'].setValue(this.array.dischargeRemarks);
      } else {
        this.secondFormGroup.controls['startdate'].setValue(this.array.treatmentFromDate);
        this.secondFormGroup.controls['enddate'].setValue(this.array.treatmentToDate);
        this.secondFormGroup.controls['fourpicker'].setValue(this.array.pcR4DayTestDate);
        this.secondFormGroup.controls['fourspicker'].setValue(this.array.pcR4DaySampleDate);
        this.secondFormGroup.controls['fourresult'].setValue(this.array.pcR4DayResult);
        this.secondFormGroup.controls['eightpicker'].setValue(this.array.pcR8DayTestDate);
        this.secondFormGroup.controls['eightspicker'].setValue(this.array.pcR8DaySampleDate);
        this.secondFormGroup.controls['eightresult'].setValue(this.array.pcR8DayResult);
        this.secondFormGroup.controls['dischargepicker'].setValue(this.array.dischargeDate);
        this.secondFormGroup.controls['drpicker'].setValue(this.array.day2CallDetails.callScheduledDate);
        this.secondFormGroup.controls['drspicker'].setValue(this.array.day2CallDetails.calledDate);
        this.thirdFormGroup.controls['dischargespicker'].setValue(this.array.dischargeStatus);
        this.thirdFormGroup.controls['dischargerpicker'].setValue(this.array.dischargeRemarks);
      }

      this.firstFormGroup.controls['vaccinestatus'].setValue(this.array.haveVaccine);

    }, err => {
      console.log(err);
    })

  }


  radioChange(event: any) {
    if (this.firstFormGroup.controls['result'].value === 'negative' && this.firstFormGroup.controls['vaccinestatus'].value === 'yes') {
      this.discharge = true;
      this.isolation = true;
      this.dischargedate = true;
      this.check = false;


      let drpicker: Date = this.firstFormGroup.value.conducteddate;
      drpicker.setDate(drpicker.getDate() + 3);

      this.firstFormGroup.controls['dischargedate'].setValue(drpicker);

    } else {
      this.discharge = true;
      this.isolation = true;
      this.check = true;
      this.dischargedate = false;
    }
  }

  showOptions(event: any) {
    if (event.value === 'quarantine') {
      this.type = 'quarantine';
      this.discharge = false;
      this.isolation = true;

    } else {
      this.type = 'isolation';
      this.discharge = true;
      this.isolation = false;
    }
  }

  showisolation(event: any) {
    if (event.checked) {
      this.isolation = false;
    } else
      this.isolation = true;
  }

  updatedate(date: any, picker: MatDatepicker<Date>) {
    picker.close();
    this.change(date);
  }

  change(date: any) {
    let drpicker: Date = date.value;
    drpicker.setDate(drpicker.getDate() + 1);

    this.secondFormGroup.controls['drpicker'].setValue(drpicker);

    let fourpickers: Date = (date.value);
    fourpickers.setDate(fourpickers.getDate() + 3 - 1);
    this.secondFormGroup.controls['fourpicker'].setValue(drpicker);

    let eightpickers: Date = date.value;
    eightpickers.setDate(eightpickers.getDate() + 8 - 4);

    this.secondFormGroup.controls['eightpicker'].setValue(eightpickers);


    let startdates: Date = date.value;
    startdates.setDate(startdates.getDate() + 10 - 8);
    this.secondFormGroup.controls['enddate'].setValue(startdates);
    this.secondFormGroup.controls['dischargepicker'].setValue(startdates);

  }

  isolationdate(date: any, picker: MatDatepicker<Date>) {
    picker.close();

    let drpicker: Date = date.value;
    drpicker.setDate(drpicker.getDate() + 1);

    this.thirdFormGroup.controls['drpicker'].setValue(drpicker);

    let thpicker: Date = date.value;
    thpicker.setDate(thpicker.getDate() + 3 - 2);

    this.thirdFormGroup.controls['eightpicker'].setValue(thpicker);

    let fppicker: Date = date.value;
    fppicker.setDate(fppicker.getDate() + 4 - 3);

    this.thirdFormGroup.controls['fppicker'].setValue(fppicker);

    let fivepicker: Date = date.value;
    fivepicker.setDate(fivepicker.getDate() + 5 - 4);

    this.thirdFormGroup.controls['fivepicker'].setValue(fivepicker);

    let sixpicker: Date = date.value;
    sixpicker.setDate(sixpicker.getDate() + 6 - 5);

    this.thirdFormGroup.controls['sixpicker'].setValue(sixpicker);

    let sdpicker: Date = date.value;
    sdpicker.setDate(sdpicker.getDate() + 7 - 6);

    this.thirdFormGroup.controls['sdpicker'].setValue(sdpicker);

    let edppicker: Date = date.value;
    edppicker.setDate(edppicker.getDate() + 8 - 7);

    this.thirdFormGroup.controls['edppicker'].setValue(edppicker);

    let nnpicker: Date = date.value;
    nnpicker.setDate(nnpicker.getDate() + 9 - 8);

    this.thirdFormGroup.controls['nnpicker'].setValue(nnpicker);

    let isodispicker: Date = date.value;
    isodispicker.setDate(isodispicker.getDate() + 10 - 9);

    this.thirdFormGroup.controls['isodispicker'].setValue(isodispicker);
    this.thirdFormGroup.controls['isoenddate'].setValue(isodispicker);
  }

  save(stdate: any, fordate: any, etdate: any, dgdate: any) {
    // if (this.firstFormGroup.invalid) {
    //   return;
    // }
    if (this.edit) {
      let map = {
        "scheduledId": editvalues.scheduleid,
        "patientStaffId": 1,
        "patientId": editvalues.patientid,
        "pcrTestDate": this.datepipe.transform(this.firstFormGroup.value.conducteddate.toLocaleString(), 'MM/dd/yyyy'),
        "pcrResult": this.firstFormGroup.value.result,
        "haveVaccine": this.firstFormGroup.value.vaccinestatus,
        "dischargeDate": dgdate.value,
        "dischargeStatus": "",
        "dischargeRemarks": "",
        "allocatedTeamName": "",
        "reAllocatedTeamName": "",
        "treatmentType": this.type,
        "treatmentFromDate": stdate.value,
        "treatmentToDate": dgdate.value,
        "pcR4DayTestDate": fordate.value,
        "pcR4DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR4DayResult": this.secondFormGroup.value.fourresult,
        "pcR8DayTestDate": etdate.value,
        "pcR8DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR8DayResult": this.secondFormGroup.value.eightresult,
        "firstCallScheduledDate": dgdate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": true
      }
      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Updated Sucessfully');
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })

    } else {
      let map = {
        "scheduledId": editvalues.scheduleid,
        "patientStaffId": 1,
        "patientId": editvalues.patientid,
        "pcrTestDate": this.datepipe.transform(this.firstFormGroup.value.conducteddate.toLocaleString(), 'MM/dd/yyyy'),
        "pcrResult": this.firstFormGroup.value.result,
        "haveVaccine": this.firstFormGroup.value.vaccinestatus,
        "dischargeDate": dgdate.value,
        "dischargeStatus": "",
        "dischargeRemarks": "",
        "allocatedTeamName": "",
        "reAllocatedTeamName": "",
        "treatmentType": this.type,
        "treatmentFromDate": stdate.value,
        "treatmentToDate": dgdate.value,
        "pcR4DayTestDate": fordate.value,
        "pcR4DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR4DayResult": this.secondFormGroup.value.fourresult,
        "pcR8DayTestDate": etdate.value,
        "pcR8DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR8DayResult": this.secondFormGroup.value.eightresult,
        "firstCallScheduledDate": dgdate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": false
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })

    }
  }

  fsave(conducteddate: any) {
    if (this.edit) {
      let map = {
        "scheduledId": editvalues.scheduleid,
        "patientStaffId": 1,
        "patientId": editvalues.patientid,
        "pcrTestDate": conducteddate.value,
        "pcrResult": this.firstFormGroup.value.result,
        "haveVaccine": this.firstFormGroup.value.vaccinestatus,
        "dischargeDate": this.datepipe.transform(this.firstFormGroup.value.dischargedate.toLocaleString(), 'MM-dd-yyyy'),
        "allocatedTeamName": "",
        "reAllocatedTeamName": "",
        "treatmentType": '',
        "firstCallScheduledDate": conducteddate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": true
      }

      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })

    } else {
      let map = {
        "scheduledId": editvalues.scheduleid,
        "patientStaffId": 1,
        "patientId": editvalues.patientid,
        "pcrTestDate": conducteddate.value,
        "pcrResult": this.firstFormGroup.value.result,
        "haveVaccine": this.firstFormGroup.value.vaccinestatus,
        "dischargeDate": this.datepipe.transform(this.firstFormGroup.value.dischargedate.toLocaleString(), 'MM-dd-yyyy'),
        "allocatedTeamName": "",
        "reAllocatedTeamName": "",
        "treatmentType": '',
        "firstCallScheduledDate": conducteddate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": true
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })

    }
  }


  issave(sdate: any, fourndate: any, ninendate: any, dischargedate: any) {
    // if (this.firstFormGroup.invalid) {
    //   return;
    // }


    if (this.edit) {
      let map = {
        "scheduledId": editvalues.scheduleid,
        "patientStaffId": 1,
        "patientId": editvalues.patientid,
        "pcrTestDate": sdate.value,
        "pcrResult": this.firstFormGroup.value.result,
        "haveVaccine": this.firstFormGroup.value.vaccinestatus,
        "dischargeDate": dischargedate.value,
        "dischargeStatus": "",
        "dischargeRemarks": "",
        "allocatedTeamName": "",
        "reAllocatedTeamName": "",
        "treatmentType": this.type,
        "treatmentFromDate": sdate.value,
        "treatmentToDate": dischargedate.value,
        "pcR4DayTestDate": fourndate.value,
        "pcR4DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR4DayResult": '',
        "pcR8DayTestDate": ninendate.value,
        "pcR8DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR8DayResult": '',
        "firstCallScheduledDate": sdate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": true
      }
      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Updates Sucessfully');
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })
    } else {
      let map = {
        "scheduledId": editvalues.scheduleid,
        "patientStaffId": 1,
        "patientId": editvalues.patientid,
        "pcrTestDate": sdate.value,
        "pcrResult": this.firstFormGroup.value.result,
        "haveVaccine": this.firstFormGroup.value.vaccinestatus,
        "dischargeDate": dischargedate.value,
        "dischargeStatus": "",
        "dischargeRemarks": "",
        "allocatedTeamName": "",
        "reAllocatedTeamName": "",
        "treatmentType": this.type,
        "treatmentFromDate": sdate.value,
        "treatmentToDate": dischargedate.value,
        "pcR4DayTestDate": fourndate.value,
        "pcR4DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR4DayResult": '',
        "pcR8DayTestDate": ninendate.value,
        "pcR8DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR8DayResult": '',
        "firstCallScheduledDate": sdate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": false
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })

    }

  }

  ngOnDestroy() {
    editvalues.drcallid = 0
    editvalues.patientid = 0
    editvalues.scheduleid = 0
  }

}

