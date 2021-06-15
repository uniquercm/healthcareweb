import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import * as XLSX from 'xlsx';
import { editvalues } from '../commonvaribale/commonvalues';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  base64File: string = '';
  filename: string = '';
  data: any[] = [];
  header: any[] = [];
  file: any;
  arrayBuffer: any;
  worksheet: any;
  sheet: any = [];
  nationalityarray: any = [];
  requestarray: any = [];

  form: FormGroup;
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  datas: any;

  constructor(private router: Router, public _formBuilder: FormBuilder, private commonService: CommonService,
    public datepipe: DatePipe) {
    this.form = this._formBuilder.group({
      requestType: ['', Validators.required],
      crm: ['', Validators.required],
      name: ['', Validators.required],
      eid: ['', Validators.required],
      mobileno: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      age: ['', Validators.required],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      assignedDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getnationality();
    this.getreq();
    if (editvalues.patientid !== 0) {
      this.getdata();
    }
  }

  onFileSelect(e: any): void {
    try {
      const target: DataTransfer = <DataTransfer>(e.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        this.worksheet = wb;

        const wsname: string = wb.SheetNames[0];
        this.sheet = wb.SheetNames;

        if (this.sheet.length === 1) {
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        }
      };
      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.data = this.data.filter((item): any => item.length !== 0);
        this.header.push(this.data[0]);
        this.header.push(this.data[1]);
        this.data.splice(0, 2);
        this.data.splice(- 1, 1);
      }

    } catch (error) {
      this.filename = '';
      this.base64File = '';
      console.log('no file was selected...');
    }
  }

  calculateAge(): void {
    var timeDiff = Math.abs(Date.now() - this.form.value.dob);

    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    this.form.controls['age'].setValue(age);
  }

  getdata() {
    this.commonService.getmethod('patient?companyId' + this.localvalues.companyId + '&patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=false').subscribe((data) => {
      this.datas = data.details[0];
      this.form.controls['requestType'].setValue(this.datas.requestId);
      this.form.controls['crm'].setValue(this.datas.crmNo);
      this.form.controls['name'].setValue(this.datas.patientName);
      this.form.controls['eid'].setValue(this.datas.eidNo);
      this.form.controls['mobileno'].setValue(this.datas.mobileNo);

      this.form.controls['age'].setValue(this.datas.age);
      this.form.controls['sex'].setValue(this.datas.sex);
      this.form.controls['dob'].setValue(this.datas.dateOfBirth);
      this.form.controls['nationality'].setValue(this.datas.nationalityId);
      this.form.controls['assignedDate'].setValue(this.datas.googleMapLink);


    }, err => {
      console.log(err);
    })
  }


  submit() {
    if (editvalues.patientid !== 0) {

      let map = {
        "patientName": this.form.value.name,
        "companyId": this.localvalues.companyId,
        "requestId": this.form.value.requestType,
        "crmNo": this.form.value.crm,
        "eidNo": this.form.value.eid,
        "dateOfBirth": this.datepipe.transform(this.form.value.dob.toLocaleString(), 'MM-dd-yyyy'),
        "age": Number(this.form.value.age),
        "sex": this.form.value.sex,
        "nationalityId": Number(this.form.value.nationality),
        "mobileNo": this.form.value.mobileno,
        "modifiedBy": this.localvalues.userId,
        "isUpdate": true
      }

      this.commonService.putmethod('patient', map).subscribe((data) => {
        alert('Saved Successfully');
        this.form.reset();
        this.router.navigateByUrl('/apps/list');
      }, err => {
        console.log(err);
      })

    } else {

      let map = {
        "patientName": this.form.value.name,
        "companyId": this.localvalues.companyId,
        "requestId": this.form.value.requestType,
        "crmNo": this.form.value.crm,
        "eidNo": this.form.value.eid,
        "dateOfBirth": this.datepipe.transform(this.form.value.dob.toLocaleString(), 'MM-dd-yyyy'),
        "age": Number(this.form.value.age),
        "sex": this.form.value.sex,
        "address": "",
        "landMark": "",
        "area": "",
        "cityId": 0,
        "nationalityId": Number(this.form.value.nationality),
        "mobileNo": this.form.value.mobileno,
        "googleMapLink": "",
        "adultsCount": 0,
        "childrensCount": 0,
        "stickerApplication": "",
        "trackerApplication": 0,
        "stickerRemoval": "",
        "trackerRemoval": 0,
        "createdBy": this.localvalues.userId,
        "isUpdate": false,
        "isReception": false
      }


      this.commonService.postmethod('patient', map).subscribe((data) => {
        alert('Saved Successfully');
        this.form.reset();
        editvalues.patientid = data.id;
        if (this.localvalues.userType === 6) {
          this.router.navigateByUrl('/apps/reception');
        } else {
          this.router.navigateByUrl('/apps/schedule');
        }
      }, err => {
        console.log(err);
      })
    }
  }

  downloadform() { 
    window.open('assets/RegistrationForm.xls', '_blank');
  }

  getnationality() {
    this.commonService.getmethod('nationality').subscribe((data) => {
      this.nationalityarray = data.details;
    }, err => {
      console.log(err);
    })

  }

  getreq() {
    this.commonService.getmethod('requestCRM').subscribe((data) => {
      this.requestarray = data.details;
    }, err => {
      console.log(err);
    })
  }

}
