import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private router: Router, public _formBuilder: FormBuilder, private commonService: CommonService) {
    this.form = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    let map = this.form.value;

    this.commonService.login('login', map).subscribe((data) => {
      localStorage.setItem('currentUser', JSON.stringify(data.loginUserDetails));
      this.router.navigateByUrl('/apps');
    }, err => {
      console.log(err);
    })

    
  }

}
