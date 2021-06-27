import { Component, OnInit } from '@angular/core';
import { loader } from 'src/app/postlogin/commonvaribale/commonvalues';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  isLoading = loader;

  constructor() {
    this.isLoading.loading = true;
  }

  ngOnInit(): void {
  }

}
