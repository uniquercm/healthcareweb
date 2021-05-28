import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-shedule',
  templateUrl: './shedule.component.html',
  styleUrls: ['./shedule.component.scss']
})
export class SheduleComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  discharge = true;
  isolation = true;
  dischargedate = false;
  check = false;

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      conducteddate: ['', Validators.required],
      result: ['p', Validators.required],
      vaccinestatus: ['no', Validators.required],
      dischargedate: ['', Validators.nullValidator],
      quarantine: ['', Validators.nullValidator],
      isolation: ['', Validators.nullValidator]
    });
    this.secondFormGroup = this._formBuilder.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      isostartdate: ['', Validators.required],
      isoenddate: ['', Validators.required]
    });
  }

  ngOnInit() {

  }



  radioChange(event: any) {
    if (this.firstFormGroup.controls['result'].value === 'n' && this.firstFormGroup.controls['vaccinestatus'].value === 'yes') {
      this.discharge = true;
      this.isolation = true;
      this.dischargedate = true;
      this.check = false;
    } else {
      this.discharge = true;
      this.isolation = true;
      this.check = true;
      this.dischargedate = false;
    }
  }

  showOptions(event: any) { 
    if (event.value === 'q') {
      this.discharge = false;
      this.isolation = true;
    } else {
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
    let startdate: Date = this.secondFormGroup.controls['startdate'].value;
    startdate.setDate(startdate.getDate() + 10);

    this.secondFormGroup.controls['enddate'].setValue(startdate);
  }

  isolationdate(date: any, picker: MatDatepicker<Date>) {
    picker.close();
    let startdate: Date = this.thirdFormGroup.controls['isostartdate'].value;
    startdate.setDate(startdate.getDate() + 10);

    this.thirdFormGroup.controls['isoenddate'].setValue(startdate);
  }

  save() {
    // if (this.firstFormGroup.invalid) {
    //   return;
    // }
    Swal.fire('SUCCESS', 'Saved Sucessfully', 'success')

  }

}
