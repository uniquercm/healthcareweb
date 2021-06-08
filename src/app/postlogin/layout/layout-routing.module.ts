import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from '../area/area.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DrcellComponent } from '../drcell/drcell.component';
import { NurseComponent } from '../fieldallocation/nurse/nurse.component';
import { NurseoutsideComponent } from '../fieldallocation/nurseoutside/nurseoutside.component';
import { SupervisorComponent } from '../fieldallocation/supervisor/supervisor.component';
import { ListComponent } from '../list/list.component'; 
import { ReceptionComponent } from '../reception/reception.component';
import { RegisterComponent } from '../register/register.component';
import { ReportComponent } from '../report/report.component';
import { SheduleComponent } from '../shedule/shedule.component';
import { UserComponent } from '../user/user.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: '',
				redirectTo: '/apps/welcome',
				pathMatch: 'full'
			},
			{
				path: 'home',
				component: RegisterComponent
			},
			{
				path: 'dashboard',
				component: DashboardComponent
			},
			{
				path: 'welcome',
				component: WelcomeComponent
			},
			{
				path: 'list',
				component: ListComponent
			},
			{
				path: 'reception',
				component: ReceptionComponent
			},
			{
				path: 'drcell',
				component: DrcellComponent
			},
			{
				path: 'nursecell',
				component: DrcellComponent
			},
			{
				path: 'report',
				component: ReportComponent
			},
			{
				path: 'schedule',
				component: SheduleComponent
			},
			{
				path: 'fieldallocation/supervisor',
				component: SupervisorComponent
			},
			{
				path: 'fieldallocation/nurse',
				component: NurseComponent
			},
			{
				path: 'fieldallocation/nurse-outside',
				component: NurseoutsideComponent
			},
			{
				path: 'user',
				component: UserComponent
			},
			{
				path: 'area',
				component: AreaComponent
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LayoutRoutingModule { }
