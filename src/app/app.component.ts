import { Component } from '@angular/core';
import { loader } from './postlogin/commonvaribale/commonvalues';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'healthcare';
  isLoading = loader;

  constructor() {
  }

  ngOnInit() {
  }

}
