import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from './sharedmodule/material.module';
import { LoginComponent } from './prelogin/login/login.component'; 
import { CommonService } from './service/common.service';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './postlogin/user/user.component';
import { DashboardComponent } from './postlogin/dashboard/dashboard.component';
import { WelcomeComponent } from './postlogin/welcome/welcome.component';
import { ChartsModule } from 'ng2-charts';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AreaComponent } from './postlogin/area/area.component';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    DashboardComponent,
    WelcomeComponent,
    AreaComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    AutocompleteLibModule
  ],
  providers: [
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
