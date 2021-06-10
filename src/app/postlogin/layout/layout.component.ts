import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  localvalues = JSON.parse(localStorage.getItem('currentUser') || '{}');
  array: any = [];

  title = '';

  constructor(private router: Router) {

    this.title = this.localvalues.companyName;

    if (this.localvalues.userType === 1) {
      this.array = [
        {
          name: 'Dashboard',
          url: '/apps/dashboard'
        },
        {
          name: 'Registration',
          url: '/apps/home'
        },
        {
          name: 'List',
          url: '/apps/list'
        },
        {
          name: 'Reception',
          url: '/apps/reception'
        },
        {
          name: 'Schedule',
          url: '/apps/schedule'
        },
        {
          name: 'Dr Call',
          url: '/apps/drcell'
        },
        {
          name: 'Nurse Call',
          url: '/apps/nursecell'
        },
        {
          name: 'Field Allocation',
          url: '/apps/fieldallocation/supervisor'
        },
        {
          name: 'Report',
          url: '/apps/report'
        },
        {
          name: 'User',
          url: '/apps/user'
        },
        {
          name: 'Area',
          url: '/apps/area'
        }
      ]
    } else if (this.localvalues.userType === 2) {
      this.array = [
        {
          name: 'Dashboard',
          url: '/apps/dashboard'
        },
        {
          name: 'Registration',
          url: '/apps/home'
        },
        {
          name: 'List',
          url: '/apps/list'
        },
        {
          name: 'Reception',
          url: '/apps/reception'
        },
        {
          name: 'Schedule',
          url: '/apps/schedule'
        },
        {
          name: 'Dr Call',
          url: '/apps/drcell'
        },
        {
          name: 'Nurse Call',
          url: '/apps/nursecell'
        },
        {
          name: 'Field Allocation',
          url: '/apps/fieldallocation/supervisor'
        },
        {
          name: 'User',
          url: '/apps/user'
        },
        {
          name: 'Report',
          url: '/apps/report'
        },
      ]
    } else if (this.localvalues.userType === 3) {
      this.array = [
        {
          name: 'Dr Call',
          url: '/apps/drcell'
        }
      ]
    } else if (this.localvalues.userType === 4) {
      this.array = [
        {
          name: 'Schedule',
          url: '/apps/schedule'
        },
        {
          name: 'Field Allocation',
          url: '/apps/fieldallocation/supervisor'
        },
      ]
    } else if (this.localvalues.userType === 5) {
      this.array = [
        {
          name: 'Nurse Call',
          url: '/apps/nursecell'
        }
      ]
    } else if (this.localvalues.userType === 6) {
      this.array = [
        {
          name: 'Registration',
          url: '/apps/home'
        },
        {
          name: 'List',
          url: '/apps/list'
        },
        {
          name: 'Reception',
          url: '/apps/reception'
        }
      ]
    } else if (this.localvalues.userType === 7) {
      this.array = [
        {
          name: 'Field Allocation',
          url: '/apps/fieldallocation/nurse'
        }
      ]
    }
  }

  ngOnInit(): void {
  }

  logout() {
    this.router.navigateByUrl('/login');
  }

}
