import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-nurseoutside',
  templateUrl: './nurseoutside.component.html',
  styleUrls: ['./nurseoutside.component.scss']
})
export class NurseoutsideComponent implements OnInit {

 
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      address: ['07, xxx', Validators.required],
      landmark: ['', Validators.required],
      area: ['yyy', Validators.required],
      region: ['Al Ain', Validators.required],
      map: ['www.google.com', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      adults: ['10', Validators.required],
      childern: ['15', Validators.required]
    });
  }

  ngOnInit() {
  
  }
}
