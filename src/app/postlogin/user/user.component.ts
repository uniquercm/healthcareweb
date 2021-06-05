import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  form: FormGroup;
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(private router: Router, public _formBuilder: FormBuilder, private commonService: CommonService) {
    this.form = this._formBuilder.group({
      userType: ['', Validators.required],
      name: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
  }

  submit() {
    let map = { 
      "userName": this.form.value.userName,
      "fullName": this.form.value.name,
      "password": this.form.value.password,
      "userType": this.form.value.userType,
      "companyId": this.localvalues.companyId,
      "createdBy": this.localvalues.userId,
      "modifiedBy": this.localvalues.userId,
      "isUpdate": false
    }

    this.commonService.postmethod('user', map).subscribe((data) => {
      alert('Saved Successfully');  
      this.form.reset(); 
      this.form.setErrors(null); 
      this.form.updateValueAndValidity();
      this.form.markAsUntouched();
    }, err => {
      console.log(err);
    })

  }
}
