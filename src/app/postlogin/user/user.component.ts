import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { edituser } from '../commonvaribale/commonvalues';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  form: FormGroup;

  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  data: any[] = [];
  keyword = 'value';
  area: any;

  constructor(private router: Router, public _formBuilder: FormBuilder, private commonService: CommonService) {
    this.getarea();

    this.form = this._formBuilder.group({
      userType: ['', Validators.required],
      name: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      areaList: ['', Validators.required]
    });

    // if (router.url === '/apps/edit-user') {
    //   this.form.controls[''].setValue(edituser.edit);
    //   this.form.controls[''].setValue(edituser.edit);
    //   this.form.controls[''].setValue(edituser.edit);
    //   this.form.controls[''].setValue(edituser.edit);
    //   this.form.controls[''].setValue(edituser.edit);
    // }
  }

  ngOnInit(): void {
  }

  selectEvent(item: any) {
    this.area = item.id
  }

  onChangeSearch(val: string) {
    this.area = val;
  }

  onFocused(e: any) {

  }

  submit() {
    let map = {
      userName: this.form.value.userName,
      fullName: this.form.value.name,
      password: this.form.value.password,
      userType: this.form.value.userType,
      areaList: JSON.stringify(this.form.value.areaList),
      companyId: this.localvalues.companyId,
      createdBy: this.localvalues.userId,
      modifiedBy: this.localvalues.userId,
      isUpdate: false
    }

    this.commonService.postmethod('user', map).subscribe((data) => {
      alert('Saved Successfully');
      this.form.reset();
      this.form.setErrors(null);
      this.form.updateValueAndValidity();
      this.form.markAsUntouched();
      this.router.navigateByUrl('/apps/userlist');
    }, err => {
      console.log(err);
    })

  }

  add() {
    let map = {
      areaId: this.data.length + 1,
      areaName: this.area
    }
    this.commonService.postmethod('area', map).subscribe((data) => {
      this.getarea();
    }, err => {
      console.log(err);
    })
  }

  getarea() {
    this.commonService.getmethod('area').subscribe((data) => {
      this.data = data.details;
      if (this.data[0].value === null)
        this.data.splice(0, 1);
    }, err => {
      console.log(err);
    })
  }

}
