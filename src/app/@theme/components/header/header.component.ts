import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { DataCommunicationService } from '../../../services/data-com/data-communication.service';
import { ApiService } from '../../../services/api.service';
import { SchedulerService } from '../../../services/scheduler.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  bcStarted = false;
  today = new Date();
  jstoday = '';

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Log out' }];
  fileData: File = null;
  scheduleStatus: any = 0;
  time = new Date();
  permissions: any;
  weatherEditPermission: any;
  canWeatherEdit: boolean = false;
  broadcastPermission: any;
  canBroadcast: boolean = false;
  completed: any = 0;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private dialogService: NbDialogService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private storage: StorageService,
    private dataCom: DataCommunicationService,
    private apiService: ApiService,
    private schedulerService: SchedulerService,
    private toastr: NbToastrService) {
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');

  }

  ngOnInit() {
    //this.setPermission();
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {

        if (title == 'Log out') {

          this.apiService.get("api/auth/logout").subscribe(
            (res) => {
              this.showToast("success", 'Logout successful!',);

              localStorage.clear();

              this.router.navigate(['/']);
            },
            (err) => {

              localStorage.clear();

              this.router.navigate(['/']);
            }
          );

          // this.schedulerService.weatherLockRelease().subscribe(
          //   res=>{
          //     this.apiService.get("api/auth/logout").subscribe(
          //       (res) => {
          //         this.showToast("success", 'Logout successful!',);

          //         localStorage.clear();

          //         this.router.navigate(['/']);
          //       },
          //       (err) => {

          //         localStorage.clear();

          //         this.router.navigate(['/']);
          //       }
          //     );
          //   },
          //   err=>{
          //     this.showToast("danger", 'Error releasing lock!',);

          //   }
          // )


        }
      });



    this.currentTheme = this.themeService.currentTheme;

    this.user = this.storage.getUserData();

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.schedulerService.getBroadcastStatus.subscribe(
      res => {
        if (res.status == 1) {
          this.bcStarted = true;
        }
        else {
          this.bcStarted = false;
        }
        this.scheduleStatus = res.status;
        this.completed = res.progress ?? 0
      }, err => {

      }
    );

    this.apiService.get("api/access-controls/permission").subscribe(
      (res) => {

        this.permissions = res.data;
        this.setPermission();
      },
      (err) => {

      }
    );
  }


  setPermission() {
    // this.permissions = this.storage.getRoleData();
    var w_permission = this.permissions.filter(element => element.Name === 'RW_WEATHER_DATA');
    this.weatherEditPermission = w_permission[0];
    if (this.weatherEditPermission.RolePermission.Permission == 'WRITE') {
      this.canWeatherEdit = true;
    }

    var b_permission = this.permissions.filter(element => element.Name === 'W_BROADCAST');
    this.broadcastPermission = b_permission[0];
    if (this.broadcastPermission.RolePermission.Permission == 'WRITE') {
      this.canBroadcast = true;
    }

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    this.dataCom.setSideMenuData();
    return false;
  }
  toggleSidebarRight() {
    this.sidebarService.toggle(true, 'menu-sidebar-right');
    this.layoutService.changeLayoutSize();
    return false;
  }

  clock() {
    return false;
  }
  navigateHome() {
    this.router.navigate(['dashboard/home']);
    return false;
  }

  confirm(data) {
    let message = '';
    if (data == 'start') {
      message = 'Are you sure starting broadcast?';
    }
    else {
      message = 'Are you sure stop broadcasting?';
    }
    this.dialogService.open(ConfirmationModalComponent, {
      context: {
        message: message,
      },
    }).onClose.subscribe(value => {
      if (value == 1) {
        if (data == 'start') {
          this.apiService.get('api/audio/broadcast')
            .subscribe(res => {
              this.showToast("success", 'Starting broadcast successful!',);
              this.bcStarted = true;
            },
              err => {
                this.showToast("danger", 'Error starting broadcast!',);

              })
        }
        else if (data == 'stop') {
          this.apiService.get('api/audio/stopBroadcast')
            .subscribe(res => {
              this.showToast("success", 'Stop broadcasting successful!',);

            },
              err => {
                this.showToast("danger", 'Error stoping broadcast!',);

              })
        }

      }

    })
  }

  uploadTextFile(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
    this.fileData = fileInputEvent.target.files[0];
    this.dialogService.open(ConfirmationModalComponent, {
      context: {
        message: "Are you sure uploading file?",
      },
    }).onClose.subscribe(value => {
      if (value == 1) {
        const formData = new FormData();
        formData.append('file', this.fileData);
        this.apiService.fileUpload('api/text/file-upload', formData)
          .subscribe(
            (res) => {
              this.showToast("success", 'File upload successful!',);

            },
            (err) => {
              this.showToast("danger", 'Error uploading file!',);
              this.fileData = null;
            })
      }

    })
  }
  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }


}
