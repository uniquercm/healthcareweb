import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import * as XLSX from 'xlsx';
import { editvalues, loader } from '../commonvaribale/commonvalues';

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
      name: ['', Validators.nullValidator],
      eid: ['', Validators.required],
      mobileno: ['', [Validators.nullValidator, Validators.maxLength(10), Validators.minLength(10)]],
      age: ['', Validators.nullValidator],
      sex: ['', Validators.nullValidator],
      dob: ['', Validators.nullValidator],
      nationality: ['', Validators.required],
      assignedDate: ['', Validators.nullValidator]
    });

    if (editvalues.headerbuttclick) {
      if (localStorage.getItem('patientedit') !== null) {
        let value: any = JSON.parse(localStorage.getItem('patientedit') || '{}');
        editvalues.patientid = value.patientid;
        editvalues.scheduleid = value.scheduleid;
        editvalues.drcallid = value.drcallid;
      }
    } else {
      editvalues.patientid = 0;
    }

  }

  ngOnInit(): void {
    this.getnationality();
    this.getreq();
    if (editvalues.patientid !== 0) {
      this.getdata();
    }
  }

  finalarray: any[] = [];
  onFileSelect(e: any): void {
    try {
      loader.loading = true;
      const target: DataTransfer = <DataTransfer>(e.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      console.log(target.files);
      this.filename = target.files[0].name;
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        // console.log(e)
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        this.worksheet = wb;

        const wsname: string = wb.SheetNames[0];
        this.sheet = wb.SheetNames;

        // if (this.sheet.length === 1) {
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        // }
      };
      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.data.splice(0, 1);
        this.data.forEach(element => {
          let map = {
            "patientName": element[2],
            "companyId": this.localvalues.companyId,
            "requestCrmName": element[0],
            "crmNo": element[1],
            "eidNo": element[3],
            "age": Number(element[7] === undefined ? '' : element[7]),
            "sex": element[6] === undefined ? '' : element[6],
            "address": "",
            "landMark": "",
            "area": "",
            "cityId": 0,
            "nationalityName": Number(element[8]),
            "mobileNo": element[4],
            "googleMapLink": "",
            "adultsCount": 0,
            "childrensCount": 0,
            "stickerApplication": "",
            "trackerApplication": 0,
            "stickerRemoval": "",
            "trackerRemoval": 0,
            "createdBy": this.localvalues.userId,
            "isUpdate": false,
            "isReception": false,
            "assignedDate": element[9] === undefined ? '' : element[9]
          };
          this.finalarray.push(map);
        });
        loader.loading = false;
      }
    } catch (error) {
      this.filename = '';
      this.base64File = '';
      console.log('no file was selected...');
    }
  }

  upload() {
    if (this.finalarray.length=== 0) {
      alert('Please upload file...!');
      return;
    }
    let maps = {
      patientRequestList: this.finalarray
    }
    this.commonService.postmethod('patient-file', maps).subscribe((data) => {
      loader.loading = false;
      editvalues.headerbuttclick = true;
      alert('Saved Successfully');
      this.router.navigateByUrl('/apps/list');
    }, err => {
      loader.loading = false;
      alert('Error Occured');
      console.log(err);
    })
  }

  calculateAge(): void {
    var timeDiff = Math.abs(Date.now() - this.form.value.dob);

    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    this.form.controls['age'].setValue(age);
  }

  getdata() {
    this.commonService.getmethod('patient?companyId=' + this.localvalues.companyId + '&patientId=' + editvalues.patientid + '&isDoctorCall=false&isNurseCall=false').subscribe((data) => {
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
      this.form.controls['assignedDate'].setValue(this.datas.assignedDate === '0001-01-01T00:00:00' ? '' : this.datas.assignedDate);
 
    }, err => {
      console.log(err);
    })
  }

  getcrm() {
    if (editvalues.patientid !== 0) {
      this.commonService.getmethodws('patient-crmno-available?crmNumber=' + this.form.value.crm + '&companyId=' + this.localvalues.companyId + '&patientId=' + editvalues.patientid).subscribe((data) => {
        if (data.isAvailable) {
          alert('Alert Exists');
          this.form.controls['crm'].setErrors({ 'incorrect': true });
          return;
        }
      }, err => {
        console.log(err);
      })
    } else {
      this.commonService.getmethodws('patient-crmno-available?crmNumber=' + this.form.value.crm + '&companyId=' + this.localvalues.companyId).subscribe((data) => {
        if (data.isAvailable) {
          alert('Alert Exists');
          this.form.controls['crm'].setErrors({ 'incorrect': true });
          return;
        }
      }, err => {
        console.log(err);
      })
    }
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    if (editvalues.patientid !== 0) {

      let map = {
        patientid: editvalues.patientid,
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
        "isUpdate": true,
        assignedDate: this.form.value.assignedDate
      }

      this.commonService.putmethod('patient', map).subscribe((data) => {
        alert('Updated Successfully');
        this.form.reset();

        if (!editvalues.registertab) {
          editvalues.patientid = 0;
          editvalues.scheduleid = 0;
          editvalues.drcallid = 0;
          editvalues.headerbuttclick = true;

          window.close();
        } else {
          this.router.navigateByUrl('/apps/list');
        }

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
        "isReception": false,
        assignedDate: this.form.value.assignedDate
      }


      this.commonService.postmethod('patient', map).subscribe((data) => {
        alert('Saved Successfully');
        this.form.reset();
        
        editvalues.patientid = data.id; 
        editvalues.headerbuttclick = false;
        editvalues.registertab = true;

        localStorage.setItem('patientedit', JSON.stringify(editvalues));

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
