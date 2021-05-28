import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router'; 
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

@NgModule({
  declarations: [
    LayoutComponent,
    RegisterComponent,
    ListComponent,
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
    DemoMaterialModule
  ],
  providers: [
    
  ],
  entryComponents: [
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LayoutModule { }
