import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { DemoMaterialModule } from 'src/app/sharedmodule/material.module';
import { DrcellComponent } from '../drcell/drcell.component';
import { NurseComponent } from '../fieldallocation/nurse/nurse.component';
import { NurseoutsideComponent } from '../fieldallocation/nurseoutside/nurseoutside.component';
import { SupervisorComponent } from '../fieldallocation/supervisor/supervisor.component';
import { ListComponent } from '../list/list.component';
import { ReceptionComponent } from '../reception/reception.component';
import { RegisterComponent } from '../register/register.component';
import { ReportComponent } from '../report/report.component';
import { SheduleComponent } from '../shedule/shedule.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ListuserComponent } from '../user/listuser/listuser.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    LayoutComponent,
    RegisterComponent,
    ListComponent,
    ListuserComponent,
    ReceptionComponent,
    DrcellComponent,
    ReportComponent,
    NurseComponent,
    SupervisorComponent,
    SheduleComponent,
    NurseoutsideComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LayoutRoutingModule,
    ReactiveFormsModule,
    MatBadgeModule,
    DemoMaterialModule,
    ChartsModule,
    AutocompleteLibModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LayoutModule { }
