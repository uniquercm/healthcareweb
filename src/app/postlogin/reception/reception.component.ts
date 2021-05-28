import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss']
})
export class ReceptionComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      area: ['', Validators.required],
      region: ['', Validators.required],
      map: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      adults: ['', Validators.required],
      childern: ['', Validators.required]
    });
  }

  ngOnInit() {
  
  }

}
