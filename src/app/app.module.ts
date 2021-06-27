import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AreaComponent } from './postlogin/area/area.component';
import { DashboardComponent } from './postlogin/dashboard/dashboard.component';
import { UserComponent } from './postlogin/user/user.component';
import { WelcomeComponent } from './postlogin/welcome/welcome.component';
import { LoginComponent } from './prelogin/login/login.component';
import { CommonService } from './service/common.service';
import { LoadingComponent } from './sharedmodule/loading/loading.component';
import { DemoMaterialModule } from './sharedmodule/material.module';

 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    DashboardComponent,
    WelcomeComponent,
    AreaComponent,
    LoadingComponent
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
