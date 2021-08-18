import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ApiService } from './services/api.service';
import { SchedulerService } from './services/scheduler.service';

export let browserRefresh = false;

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  subscription: Subscription;

  constructor(private toastr: NbToastrService,
    private apiService: ApiService,
    private router: Router,
    private scheduleService: SchedulerService) {

    this.subscription = router.events.subscribe((event) => {

      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        if (browserRefresh && event.url !== '/' && event.url !== '/auth/login') {
          this.apiService.get("api/auth/logout").subscribe(
            (res) => {
              this.showToast("danger", "Session timed out! Please login again.");
              localStorage.clear();
              this.router.navigate(['/notFound']);
            },
            (err) => {
              localStorage.clear();
              this.router.navigate(['/notFound']);
            }
          );
        }
      }

    });

  }

  ngOnInit(): void {
    localStorage.clear();
    this.scheduleService.eventData.next(null);
    this.scheduleService.statusData.next(null);
  }


  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }
}
