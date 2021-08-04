import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
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
  hqpFormGroup: FormGroup;

  discharge = true;
  isolation = true;
  dischargedate = false;
  check = true;
  type = '';
  array: any = '';
  edit = false;
  isHQP = true;
  isHIP = false;
  disablevalue = true;
  hqpdisabled = false;

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

    this.hqpFormGroup = this._formBuilder.group({
      hqpstartdate: ['', Validators.required],
      hqpenddate: ['', Validators.nullValidator],
      hqpdrpicker: ['', Validators.nullValidator],
      hqpdrspicker: ['', Validators.nullValidator],
      hqpfourpicker: ['', Validators.nullValidator],
      hqpfourspicker: ['', Validators.nullValidator],
      hqpfourresult: ['', Validators.nullValidator],
      hqpeightpicker: ['', Validators.nullValidator],
      hqpxlpicker: ['', Validators.nullValidator],
      hqpeightspicker: ['', Validators.nullValidator],
      hqpeightresult: ['', Validators.nullValidator],
      hqpdischargepicker: ['', Validators.nullValidator],
      hqpdischargespicker: ['', Validators.nullValidator],
      hqpdischargerpicker: ['', Validators.nullValidator]
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
      trapicker: ['', Validators.nullValidator],
      traapicker: ['', Validators.nullValidator],
      traresult: ['', Validators.nullValidator],
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

    let value: any = JSON.parse(localStorage.getItem('patientedit') || '{}');
    editvalues.patientid = value.patientid;
    editvalues.scheduleid = value.scheduleid;
    editvalues.drcallid = value.drcallid;
    editvalues.headerbuttclick = value.headerbuttclick;
  }

  ngOnInit() {
    if (!editvalues.headerbuttclick)//Thanam
    {
      this.commonService.getmethod('scheduled?companyId=' + this.localvalues.companyId + '&isTeam=false&patientId=' + editvalues.patientid + '&isFieldAllocation=false').subscribe((data) => {
        if (data.details.length === 0) {
        
          this.commonService.getmethodpromise('patient?companyId=' + this.localvalues.companyId
            + '&patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=false').then((res) => {
               
              this.formGroup.controls['name'].setValue(res.details[0].patientName);
              this.formGroup.controls['age'].setValue(res.details[0].age);
              this.edit = false;
              this.array = res.details[0];

              if (this.array.requestCrmName === 'HQP') {
                this.firstFormGroup.controls['result'].setValue('waiting');
                this.isHQP = false;
                this.check = false;

                this.firstFormGroup.controls['conducteddate'].setValue(res.details[0].createdOn);

                this.hqpFormGroup.controls['hqpstartdate'].setValue(res.details[0].createdOn);

                let drpicker: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
                drpicker.setDate(drpicker.getDate() + 1);

                this.hqpFormGroup.controls['hqpdrpicker'].setValue(this.hqpFormGroup.controls['hqpstartdate'].value);

                let fourpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
                fourpickers.setDate(fourpickers.getDate() + 3 - 1);
                this.hqpFormGroup.controls['hqpfourpicker'].setValue(drpicker);

                let eightpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
                eightpickers.setDate(eightpickers.getDate() + 6);

                this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

                let startdates: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
                startdates.setDate(startdates.getDate() + 7);
                this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
                this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);

              } else if (this.array.requestCrmName === 'HIP') {
                this.check = false;
                this.isolation = true;
                this.dischargedate = false;
                this.type = 'isolation';
                this.discharge = true;
                this.isHIP = true;
                this.isHQP = false;
                this.isolation = false;
                //Thanam
                //this.firstFormGroup.controls['result'].setValue('waiting');
                this.firstFormGroup.controls['result'].setValue('positive');
                //************** */
                this.firstFormGroup.controls['vaccinestatus'].setValue('no'); 
              } else {
                this.check = true;
              }
            }, err => {
              console.log(err);
            })
        } else {

          this.array = data.details[0];
          this.edit = true;
          this.formGroup.controls['name'].setValue(this.array.patientName);
          this.formGroup.controls['age'].setValue(this.array.age);

          this.firstFormGroup.controls['conducteddate'].setValue(this.array.pcrTestDate);
          this.firstFormGroup.controls['result'].setValue(this.array.pcrResult);

          this.firstFormGroup.controls['dischargedate'].setValue(this.array.dischargeDate);
          this.check = true;

          if (this.array.requestCrmName === 'HQP') {
            this.isHQP = false;
            this.check = false;

            if (document.getElementById('next-btn') !== null) {
              let myElement: HTMLElement | null = document.getElementById('next-btn');

              if (myElement !== null)
                myElement.style.display = 'inline-flex';
            }

            this.hqpFormGroup.controls['hqpstartdate'].setValue(this.array.pcrTestDate);

            let drpicker: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
            drpicker.setDate(drpicker.getDate());

            this.hqpFormGroup.controls['hqpdrpicker'].setValue(this.array.pcrTestDate);
            //Thanam
            this.hqpFormGroup.controls['hqpdrspicker'].setValue(this.array.day2CallDetails.calledDate);
            //******************** */

            let fourpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
            fourpickers.setDate(fourpickers.getDate() + 1);
            this.hqpFormGroup.controls['hqpfourpicker'].setValue(fourpickers);

            //Thanam
            this.hqpFormGroup.controls['hqpfourspicker'].setValue(this.array.trackerAppliedDate);
            this.hqpFormGroup.controls['hqpfourresult'].setValue(this.array.stickerTrackerResult);
            //************ */

            this.hqpFormGroup.controls['hqpeightpicker'].setValue(this.array.pcR6DayTestDate !== '0001-01-01T00:00:00' ? this.array.pcR6DayTestDate : (this.array.pcR11DayTestDate !== '0001-01-01T00:00:00' ? this.array.pcR11DayTestDate : this.array.pcR6DayTestDate));

            //Thanam
            this.hqpFormGroup.controls['hqpeightspicker'].setValue(this.array.pcR6DayTestDate != '0001-01-01T00:00:00' ? this.array.pcR6DaySampleDate : (this.array.pcR11DayTestDate != '0001-01-01T00:00:00' ? this.array.pcR11DaySampleDate : this.array.pcR6DaySampleDate));
            this.hqpFormGroup.controls['hqpeightresult'].setValue(this.array.pcR6DayTestDate !== '0001-01-01T00:00:00' ? this.array.pcR6DayResult : (this.array.pcR11DayResult !== '0001-01-01T00:00:00' ? this.array.pcR11DayResult : this.array.pcR6DayResult));
            //************ */

            this.hqpFormGroup.controls['hqpenddate'].setValue(this.array.treatmentToDate);
            this.hqpFormGroup.controls['hqpdischargepicker'].setValue(this.array.dischargeDate);
            //Thanam
            this.hqpFormGroup.controls['hqpdischargespicker'].setValue(this.array.dischargeStatus);
            this.hqpFormGroup.controls['hqpdischargerpicker'].setValue(this.array.dischargeRemarks);
            //************** */


            if (this.firstFormGroup.controls['result'].value === 'positive') {
              alert('Please change the Request/CRM No to HIP');
              if (document.getElementById('next-btn') !== null) {
                let myElement: HTMLElement | null = document.getElementById('next-btn');

                if (myElement !== null)
                  myElement.style.display = 'none';
              }
              this.isHQP = true
              this.hqpdisabled = false;
              return;
            }

            this.hqpdisabled = true;
          } else if (this.array.requestCrmName === 'HIP') {
            this.check = false;
            this.isolation = true;
            this.dischargedate = false;
            this.type = 'isolation';
            this.discharge = true;
            this.isHIP = true;
            this.isHQP = false;
            this.isolation = false;

            this.firstFormGroup.controls['result'].setValue(this.array.pcrResult === '' ? 'waiting' : this.array.pcrResult);
            //Thanam
            //this.firstFormGroup.controls['result'].setValue('waiting');
            this.firstFormGroup.controls['result'].setValue(this.array.pcrResult);
            //**************** */
            this.firstFormGroup.controls['vaccinestatus'].setValue('no');
            console.log(this.array);

            this.firstFormGroup.controls['quarantine'].setValue('isolation');
            this.thirdFormGroup.controls['isostartdate'].setValue('0001-01-01T00:00:00' === this.array.treatmentFromDate ? '' : this.array.treatmentFromDate);
            this.thirdFormGroup.controls['isoenddate'].setValue('0001-01-01T00:00:00' === this.array.treatmentToDate ? '' : this.array.treatmentToDate);
            this.thirdFormGroup.controls['drpicker'].setValue(this.array.day2CallDetails.callScheduledDate);
            this.thirdFormGroup.controls['drspicker'].setValue(this.array.day2CallDetails.calledDate);
            this.thirdFormGroup.controls['eightpicker'].setValue(this.array.day3CallDetails.callScheduledDate);
            this.thirdFormGroup.controls['drremark'].setValue(this.array.day3CallDetails.remarks);
            this.thirdFormGroup.controls['fpspicker'].setValue(this.array.day4CallDetails.remarks);
            this.thirdFormGroup.controls['fiveremark'].setValue(this.array.day5CallDetails.remarks);
            this.thirdFormGroup.controls['sixremark'].setValue(this.array.day6CallDetails.remarks);
            this.thirdFormGroup.controls['sevenremark'].setValue(this.array.day7CallDetails.remarks);
            
            this.thirdFormGroup.controls['callstatus'].setValue(this.array.day3CallDetails.callStatus);
            this.thirdFormGroup.controls['drremark'].setValue(this.array.day3CallDetails.remarks);
            this.thirdFormGroup.controls['fppicker'].setValue(this.array.pcR4DayTestDate);
 
            if ('0001-01-01T00:00:00' === this.array.trackerScheduleDate) {
              this.thirdFormGroup.controls['trapicker'].setValue(this.array.stickerScheduleDate);
              this.thirdFormGroup.controls['traapicker'].setValue('0001-01-01T00:00:00' === this.array.stickerAppliedDate ? '' : this.array.stickerAppliedDate);
              this.thirdFormGroup.controls['traresult'].setValue(this.array.stickerTrackerResult);
            } else {
              this.thirdFormGroup.controls['trapicker'].setValue(this.array.trackerScheduleDate);
              this.thirdFormGroup.controls['traapicker'].setValue('0001-01-01T00:00:00' === this.array.trackerAppliedDate ? '' : this.array.trackerAppliedDate);
              this.thirdFormGroup.controls['traresult'].setValue(this.array.stickerTrackerResult);//Thanam
            } 

            // this.thirdFormGroup.controls['fpspicker'].setValue(this.array.pcR4DaySampleDate);
            this.thirdFormGroup.controls['resultpcr'].setValue(this.array.day4CallDetails.callStatus);
            this.thirdFormGroup.controls['fivestatus'].setValue(this.array.day5CallDetails.callStatus);
            this.thirdFormGroup.controls['sixstatus'].setValue(this.array.day6CallDetails.callStatus);
            this.thirdFormGroup.controls['sevenstatus'].setValue(this.array.day7CallDetails.callStatus);
            this.thirdFormGroup.controls['ninestatus'].setValue(this.array.day9CallDetails.callStatus);

            this.thirdFormGroup.controls['fivepicker'].setValue('0001-01-01T00:00:00' === this.array.day5CallDetails.callScheduledDate ? '' : this.array.day5CallDetails.callScheduledDate);
            this.thirdFormGroup.controls['sixpicker'].setValue('0001-01-01T00:00:00' === this.array.day6CallDetails.callScheduledDate ? '' : this.array.day6CallDetails.callScheduledDate);

            this.thirdFormGroup.controls['sdpicker'].setValue('0001-01-01T00:00:00' === this.array.day7CallDetails.callScheduledDate ? '' : this.array.day7CallDetails.callScheduledDate);

            this.thirdFormGroup.controls['edppicker'].setValue('0001-01-01T00:00:00' === this.array.pcR8DayTestDate ? '' : this.array.pcR8DayTestDate);
            this.thirdFormGroup.controls['edcpicker'].setValue('0001-01-01T00:00:00' === this.array.pcR8DaySampleDate ? '' : this.array.pcR8DaySampleDate);
            this.thirdFormGroup.controls['eightresultpcr'].setValue('0001-01-01T00:00:00' === this.array.pcR8DayResult ? '' : this.array.pcR8DayResult);
            this.thirdFormGroup.controls['nnpicker'].setValue('0001-01-01T00:00:00' === this.array.day9CallDetails.callScheduledDate ? '' : this.array.day9CallDetails.callScheduledDate);

            this.thirdFormGroup.controls['isodispicker'].setValue('0001-01-01T00:00:00' === this.array.dischargeDate ? '' : this.array.dischargeDate);

            this.thirdFormGroup.controls['dischargespicker'].setValue('0001-01-01T00:00:00' === this.array.dischargeStatus ? '' : this.array.dischargeStatus);

            this.thirdFormGroup.controls['dischargerpicker'].setValue('0001-01-01T00:00:00' === this.array.dischargeRemarks ? '' : this.array.dischargeRemarks);

          } else {
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

              if ('0001-01-01T00:00:00' === this.array.trackerScheduleDate) {
                this.thirdFormGroup.controls['trapicker'].setValue(this.array.stickerScheduleDate);
              } else {
                this.thirdFormGroup.controls['trapicker'].setValue(this.array.trackerScheduleDate);
                this.thirdFormGroup.controls['traapicker'].setValue(this.array.trackerAppliedDate);
                this.thirdFormGroup.controls['traresult'].setValue(this.array.stickerTrackerResult);//Thanam
              }

              // this.thirdFormGroup.controls['fpspicker'].setValue(this.array.pcR4DaySampleDate);
              //Thanam
              //this.thirdFormGroup.controls['fppicker'].setValue(this.array.pcR4DayTestDate);
              //this.thirdFormGroup.controls['resultpcr'].setValue(this.array.pcR4DayResult);
              this.thirdFormGroup.controls['fppicker'].setValue(this.array.day4CallDetails.callScheduledDate);
              this.thirdFormGroup.controls['resultpcr'].setValue(this.array.day4CallDetails.callStatus);
              this.thirdFormGroup.controls['fpspicker'].setValue(this.array.day4CallDetails.remarks);
              //************* */
              this.thirdFormGroup.controls['fivepicker'].setValue(this.array.day5CallDetails.callScheduledDate);
              //Thanam
              this.thirdFormGroup.controls['fivestatus'].setValue(this.array.day5CallDetails.callStatus);
              this.thirdFormGroup.controls['fiveremark'].setValue(this.array.day5CallDetails.remarks);
              //******************** */
              this.thirdFormGroup.controls['sixpicker'].setValue(this.array.day6CallDetails.callScheduledDate);
              //Thanam
              this.thirdFormGroup.controls['sixstatus'].setValue(this.array.day6CallDetails.callStatus);
              this.thirdFormGroup.controls['sixremark'].setValue(this.array.day6CallDetails.remarks);
              //******************** */

              this.thirdFormGroup.controls['sdpicker'].setValue(this.array.day7CallDetails.callScheduledDate);
              //Thanam
              this.thirdFormGroup.controls['sdstatus'].setValue(this.array.day7CallDetails.callStatus);
              this.thirdFormGroup.controls['sdremark'].setValue(this.array.day7CallDetails.remarks);
              //******************** */

              this.thirdFormGroup.controls['edppicker'].setValue(this.array.pcR8DayTestDate);
              this.thirdFormGroup.controls['edcpicker'].setValue(this.array.pcR8DaySampleDate);
              this.thirdFormGroup.controls['eightresultpcr'].setValue(this.array.pcR8DayResult);
              this.thirdFormGroup.controls['nnpicker'].setValue(this.array.day9CallDetails.callScheduledDate);
              //Thanam
              this.thirdFormGroup.controls['nnstatus'].setValue(this.array.day9CallDetails.callStatus);
              this.thirdFormGroup.controls['nnremark'].setValue(this.array.day9CallDetails.remarks);
              //******************** */

              this.thirdFormGroup.controls['isodispicker'].setValue(this.array.dischargeDate);

              this.thirdFormGroup.controls['dischargespicker'].setValue(this.array.dischargeStatus);

              this.thirdFormGroup.controls['dischargerpicker'].setValue(this.array.dischargeRemarks);
            } else {
              this.secondFormGroup.controls['startdate'].setValue(this.array.treatmentFromDate === '0001-01-01T00:00:00' ? '' : this.array.treatmentFromDate);
              this.secondFormGroup.controls['enddate'].setValue(this.array.treatmentToDate === '0001-01-01T00:00:00' ? '' : this.array.treatmentToDate);

              this.secondFormGroup.controls['fourpicker'].setValue(this.array.pcR4DayTestDate === '0001-01-01T00:00:00' ? '' : this.array.pcR4DayTestDate);
              this.secondFormGroup.controls['fourspicker'].setValue(this.array.pcR4DaySampleDate === '0001-01-01T00:00:00' ? '' : this.array.pcR4DaySampleDate);
              this.secondFormGroup.controls['fourresult'].setValue(this.array.pcR4DayResult === '0001-01-01T00:00:00' ? '' : this.array.pcR4DayResult);

              this.secondFormGroup.controls['eightpicker'].setValue(this.array.pcR8DayTestDate === '0001-01-01T00:00:00' ? '' : this.array.pcR8DayTestDate);
              this.secondFormGroup.controls['eightspicker'].setValue(this.array.pcR8DaySampleDate === '0001-01-01T00:00:00' ? '' : this.array.pcR8DaySampleDate);
              this.secondFormGroup.controls['eightresult'].setValue(this.array.pcR8DayResult === '0001-01-01T00:00:00' ? '' : this.array.pcR8DayResult);

              this.secondFormGroup.controls['dischargepicker'].setValue(this.array.dischargeDate === '0001-01-01T00:00:00' ? '' : this.array.dischargeDate);
              this.secondFormGroup.controls['drpicker'].setValue(this.array.day2CallDetails.callScheduledDate === '0001-01-01T00:00:00' ? '' : this.array.day2CallDetails.callScheduledDate);
              this.secondFormGroup.controls['drspicker'].setValue(this.array.day2CallDetails.calledDate === '0001-01-01T00:00:00' ? '' : this.array.day2CallDetails.calledDate);
              this.thirdFormGroup.controls['dischargespicker'].setValue(this.array.dischargeStatus === '0001-01-01T00:00:00' ? '' : this.array.dischargeStatus);
              this.thirdFormGroup.controls['dischargerpicker'].setValue(this.array.dischargeRemarks === '0001-01-01T00:00:00' ? '' : this.array.dischargeRemarks);
            }
          }

          this.firstFormGroup.controls['vaccinestatus'].setValue(this.array.haveVaccine);
        }
      }, err => {
        console.log(err);
      });
    }

    // if (!editvalues.headerbuttclick) {
    //   editvalues.headerbuttclick = true;
    //   localStorage.setItem('patientedit', JSON.stringify(editvalues));
    // } 

  }

  radioChange(event: any, date: any) {
    if (this.array.requestCrmName === 'HQP') {
      this.check = false;
      if (this.firstFormGroup.controls['result'].value === 'positive') {
        this.hqpdisabled = false;
        alert('Please change the Request/CRM No to HIP');
        if (document.getElementById('next-btn') !== null) {
          let myElement: HTMLElement | null = document.getElementById('next-btn');

          if (myElement !== null)
            myElement.style.display = 'none';
        }

        return;
      }

      if (document.getElementById('next-btn') !== null) {
        let myElement: HTMLElement | null = document.getElementById('next-btn');

        if (myElement !== null)
          myElement.style.display = 'inline-flex';
      }
      this.hqpdisabled = true;
      if (this.edit) {

        if (this.firstFormGroup.controls['vaccinestatus'].value === 'yes') {

          this.hqpFormGroup.controls['hqpstartdate'].setValue(this.array.pcrTestDate);

          let drpicker: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          drpicker.setDate(drpicker.getDate());

          this.hqpFormGroup.controls['hqpdrpicker'].setValue(drpicker);

          let fourpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          fourpickers.setDate(fourpickers.getDate() + 1);
          this.hqpFormGroup.controls['hqpfourpicker'].setValue(fourpickers);

          let eightpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          eightpickers.setDate(eightpickers.getDate() + 6 - 1);

          this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

          let startdates: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          startdates.setDate(startdates.getDate() + 7 - 1);
          this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
          this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);
        } else {
          this.hqpFormGroup.controls['hqpstartdate'].setValue(this.array.pcrTestDate);

          let drpicker: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          drpicker.setDate(drpicker.getDate());

          this.hqpFormGroup.controls['hqpdrpicker'].setValue(drpicker);

          let fourpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          fourpickers.setDate(fourpickers.getDate() + 1);
          this.hqpFormGroup.controls['hqpfourpicker'].setValue(fourpickers);

          let eightpickers: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          eightpickers.setDate(eightpickers.getDate() + 11 - 1);

          this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

          let startdates: Date = new Date(this.hqpFormGroup.controls['hqpstartdate'].value);
          startdates.setDate(startdates.getDate() + 12 - 1);
          this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
          this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);
        }
      } else {
        if (this.firstFormGroup.controls['vaccinestatus'].value === 'yes') {
          this.hqpFormGroup.controls['hqpstartdate'].setValue(this.firstFormGroup.value.conducteddate);

          let drpicker: Date = new Date(this.firstFormGroup.value.conducteddate);
          drpicker.setDate(drpicker.getDate());

          this.hqpFormGroup.controls['hqpdrpicker'].setValue(drpicker);

          let fourpickers: Date = new Date(this.firstFormGroup.value.conducteddate);
          fourpickers.setDate(fourpickers.getDate() + 1);
          this.hqpFormGroup.controls['hqpfourpicker'].setValue(fourpickers);

          let eightpickers: Date = new Date(this.firstFormGroup.value.conducteddate);
          eightpickers.setDate(eightpickers.getDate() + 6 - 1);

          this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

          let startdates: Date = new Date(this.firstFormGroup.value.conducteddate);
          startdates.setDate(startdates.getDate() + 7 - 1);
          this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
          this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);
        } else {
          this.hqpFormGroup.controls['hqpstartdate'].setValue(this.firstFormGroup.value.conducteddate);

          let drpicker: Date = new Date(this.firstFormGroup.value.conducteddate);
          drpicker.setDate(drpicker.getDate());

          this.hqpFormGroup.controls['hqpdrpicker'].setValue(drpicker);

          let fourpickers: Date = new Date(this.firstFormGroup.value.conducteddate);
          fourpickers.setDate(fourpickers.getDate() + 1);
          this.hqpFormGroup.controls['hqpfourpicker'].setValue(fourpickers);

          let eightpickers: Date = new Date(this.firstFormGroup.value.conducteddate);
          eightpickers.setDate(eightpickers.getDate() + 11 - 1);

          this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

          let startdates: Date = new Date(this.firstFormGroup.value.conducteddate);
          startdates.setDate(startdates.getDate() + 12 - 1);
          this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
          this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);
        }
      }
    } else if (this.array.requestCrmName === 'HIP') {
      this.check = false;
      this.isolation = true;
      this.dischargedate = false;
      this.type = 'isolation';
      this.discharge = true;
      this.isolation = false;
    } else {
      if (this.firstFormGroup.controls['result'].value === 'negative' && this.firstFormGroup.controls['vaccinestatus'].value === 'yes') {
        this.discharge = true;
        this.isolation = true;
        this.check = true;
        this.isHQP = true;
        this.dischargedate = false;
      }
      else if (((this.firstFormGroup.controls['result'].value === 'positive')) && (this.firstFormGroup.controls['vaccinestatus'].value === 'no')) {
        this.discharge = true;
        this.isolation = true;
        this.check = true;

        this.isHQP = true;
        this.dischargedate = false;
      }
      else {
        this.discharge = true;
        this.isolation = true;
        this.dischargedate = true;
        this.check = false;
        this.isHQP = true;

        let drpicker: Date = new Date(date);
        drpicker.setDate(drpicker.getDate() + 9);

        this.firstFormGroup.controls['dischargedate'].setValue(drpicker);
      }
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

  updatehqpdate(date: any, picker: MatDatepicker<Date>) {
    picker.close();
    this.changehqp(date);
  }

  changehqp(date: any) {
    let drpicker: Date = date.value;
    drpicker.setDate(drpicker.getDate());

    this.hqpFormGroup.controls['hqpdrpicker'].setValue(drpicker);


    if (this.firstFormGroup.controls['vaccinestatus'].value === 'yes') {

      let fourpickers: Date = new Date(date.value);
      fourpickers.setDate(fourpickers.getDate() + 2);
      this.hqpFormGroup.controls['hqpfourpicker'].setValue(drpicker);

      let eightpickers: Date = new Date(date.value);
      eightpickers.setDate(eightpickers.getDate() + 11 - 1);

      this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

      let startdates: Date = new Date(date.value);
      startdates.setDate(startdates.getDate() + 12 - 1);
      this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
      this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);
    } else {
      let fourpickers: Date = new Date(date.value);
      fourpickers.setDate(fourpickers.getDate() + 3 - 1);
      this.hqpFormGroup.controls['hqpfourpicker'].setValue(drpicker);

      let eightpickers: Date = new Date(date.value);
      eightpickers.setDate(eightpickers.getDate() + 6);

      this.hqpFormGroup.controls['hqpeightpicker'].setValue(eightpickers);

      let startdates: Date = new Date(date.value);
      startdates.setDate(startdates.getDate() + 7 - 1);
      this.hqpFormGroup.controls['hqpenddate'].setValue(startdates);
      this.hqpFormGroup.controls['hqpdischargepicker'].setValue(startdates);
    }

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
    this.thirdFormGroup.controls['trapicker'].setValue(drpicker);

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
        "isUpdate": true,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }
      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Updated Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }
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
        "isUpdate": false,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }
      }, err => {
        console.log(err);
      })

    }
  }

  savehqp(stdate: any, fordate: any, etdate: any, dgdate: any) {
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
        "pcR6DayTestDate": this.firstFormGroup.value.vaccinestatus === 'no' ? '01/01/0001' : etdate.value,
        "pcR6DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR6DayResult": "",
        "pcR11DayTestDate": this.firstFormGroup.value.vaccinestatus === 'yes' ? '01/01/0001' : dgdate.value,
        "pcR11DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR11DayResult": "",
        "firstCallScheduledDate": stdate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": true,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }

      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Updated Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }
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
        "pcR6DayTestDate": this.firstFormGroup.value.vaccinestatus === 'no' ? '01/01/0001' : etdate.value,
        "pcR6DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR6DayResult": "",
        "pcR11DayTestDate": this.firstFormGroup.value.vaccinestatus === 'yes' ? '01/01/0001' : dgdate.value,
        "pcR11DaySampleDate": this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        "pcR11DayResult": "",
        "firstCallScheduledDate": stdate.value,
        "createdBy": this.localvalues.userId,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": false,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');
        //Thanam

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }

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
        "isUpdate": true,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }

      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }

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
        "isUpdate": true,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }

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
        "isUpdate": true,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }
      this.commonService.putmethod('scheduled', map).subscribe((data) => {
        alert('Updated Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }
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
        "isUpdate": false,
        "requestId": this.array.requestId,
        "requestCrmName": this.array.requestCrmName
      }

      this.commonService.postmethod('scheduled', map).subscribe((data) => {
        alert('Saved Sucessfully');

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;
          localStorage.setItem('patientedit', JSON.stringify(editvalues));

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }
      }, err => {
        console.log(err);
      })
    }
  }

  ngOnDestroy() {
    editvalues.drcallid = 0
    editvalues.patientid = 0
    editvalues.scheduleid = 0
    editvalues.headerbuttclick = true;//Thanam
    localStorage.setItem('patientedit', JSON.stringify(editvalues));//Thanam
  }

}

