import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import * as XLSX from 'xlsx';

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

  constructor(private router: Router, public _formBuilder: FormBuilder, private commonService: CommonService) {
    this.form = this._formBuilder.group({
      requestType: ['', Validators.required],
      crm: ['', Validators.required],
      name: ['', Validators.required],
      eid: ['', Validators.required],
      mobileno: ['', Validators.required],
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

  submit() {
    let map = { 
      "patientName": this.form.value.name,
      "companyId": this.localvalues.companyId,
      "requestId": this.form.value.requestType,
      "crmNo": this.form.value.crm,
      "eidNo": this.form.value.eid,
      "dateOfBirth": this.form.value.dob.toLocaleString(),
      "age": Number(this.form.value.age),
      "sex": this.form.value.sex,
      "address": "",
      "landMark": "",
      "area": "",
      "cityId": 0,
      "nationalityId": Number(this.form.value.nationality),
      "mobileNo": this.form.value.mobileno,
      "googleMapLink": "",
      "stickerApplication": "",
      "stickerRemoval": "",
      "createdBy": this.localvalues.userName,
      "isUpdate": false
    }

    this.commonService.postmethod('patient', map).subscribe((data) => {
      alert('Saved Successfully');  
         this.form.reset();
    }, err => {
      console.log(err);
    })

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
