import { Component, OnDestroy, OnInit } from "@angular/core";
import { MENU_ITEMS } from "./dashboard-menu";
import { ApiService } from "../../services/api.service";
import { StorageService } from "../../services/storage.service";
import { SchedulerService } from "../../services/scheduler.service";
import { NbComponentStatus, NbDialogService, NbSidebarService, NbToastrService } from "@nebular/theme";
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';
import { SessionTimeoutModalComponent } from '../../@theme/components/modal/session-timeout-modal/session-timeout-modal.component';
@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  menu = [];
  timeoutStart: number = 0;
  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private ScheduleService: SchedulerService,
    private sidebarService: NbSidebarService,
    private userIdle: UserIdleService,
    private toastr: NbToastrService,
    private router: Router,
    private dialogService: NbDialogService,) {
    var date: any = new Date();

    this.userIdle.startWatching();

    this.userIdle.onTimerStart().subscribe(count => {

      if (count == 1) {
        this.dialogService.open(SessionTimeoutModalComponent, {
          closeOnBackdropClick: false,
          context: {
            message: "Session timeout! Do you want to continue current session?",
          }

        }).onClose.subscribe(value => {
          if (value == 1) {
            this.ScheduleService.weatherLockRelease().subscribe(
              res => {
                this.apiService.get("api/auth/logout").subscribe(
                  (res) => {
                    this.showToast("danger", "Session timed out! Please login again.");
                    localStorage.clear();
                    this.userIdle.stopWatching();
                    this.router.navigate(['/']);
                  },
                  (err) => {
                    this.showToast("danger", "Session timed out! Please login again.");
                    localStorage.clear();
                    this.userIdle.stopWatching();
                    this.router.navigate(['/']);
                  }
                );
              },
              err => {
                this.userIdle.resetTimer();
                this.showToast("danger", "Error releasing lock!");
              }
            )
          }
          else {
            this.userIdle.resetTimer();
          }

        })
      }

    });


    this.userIdle.onTimeout().subscribe(() => {
      this.ScheduleService.weatherLockRelease().subscribe(
        res => {
          this.apiService.get("api/auth/logout").subscribe(
            (res) => {
              this.showToast("danger", "Session timed out! Please login again.");
              localStorage.clear();
              this.userIdle.stopWatching();
              this.router.navigate(['/']);
            },
            (err) => {
              localStorage.clear();
              this.userIdle.stopWatching();
              this.router.navigate(['/']);
            }
          );
        },
        err => {
          localStorage.clear();
          this.userIdle.stopWatching();
          this.router.navigate(['/']);
        }
      )




    });
  }

  userManagement = [];
  configurationAndSettings = [];
  logsAndReports = [];
  ngOnInit() {
    this.apiService.get("api/access-controls/permission").subscribe(
      (res) => {
        this.storage.setRoleData(res.data);
        this.ScheduleService.getServerLog();
        this.ScheduleService.getEventLog();
        this.ScheduleService.fetchBroadcastStatus();
        this.menuItems(res.data);
        this.router.navigate(["dashboard/home"]);
      },
      (err) => {
        this.showToast("danger", "Error connectiong to server!.");
        this.router.navigate(["/"]);
      }
    );
  }


  menuItems(permissions) {
    permissions.forEach((permission) => {
      if (
        permission.Name == "RW_USER" && (permission.RolePermission.Permission == "WRITE" || permission.RolePermission.Permission == "READ")

      ) {
        this.userManagement.push({
          title: "Users",
          link: "/dashboard/user",
        });
      } else if (
        permission.Name == "RW_GROUP" && (permission.RolePermission.Permission == "WRITE" || permission.RolePermission.Permission == "READ")
      ) {
        this.userManagement.push({
          title: "Groups",
          link: "/dashboard/group",
        });
      } else if (
        permission.Name == "RW_ROLE" &&
        (permission.RolePermission.Permission == "WRITE" || permission.RolePermission.Permission == "READ")
      ) {
        this.userManagement.push({
          title: "Roles",
          link: "/dashboard/role",
        });
      }
      else if (
        permission.Name == "RW_SYSTEM_CONFIGURATION" &&
        (permission.RolePermission.Permission == "WRITE" || permission.RolePermission.Permission == "READ")
      ) {
        // this.configurationAndSettings.push({
        //   title: "Log Settings",
        //   link: "/dashboard/event-logging",
        // });
        this.configurationAndSettings.push({
          title: "Holiday Calendar",
          link: "/dashboard/report/chart",
        });
      } else if (
        permission.Name == "R_LOG" &&
        permission.RolePermission.Permission == "READ"
      ) {
        this.logsAndReports.push({
          title: "Logs",
          link: "/dashboard/event-logging/event-list",
        });

      }
      else if (
        permission.Name == "R_REPORT" &&
        permission.RolePermission.Permission == "READ"
      ) {
        this.logsAndReports.push({
          title: "Report",
          link: "/dashboard/report/all",
        });
        this.logsAndReports.push({
          title: "System reports",
          link: "/dashboard/report/system-report",
        });
      }

    });

    this.menu.push({
      title: "Dashboard",
      icon: "grid-outline",
      link: "/dashboard/home",
    });
    if (this.userManagement.length > 0) {
      this.menu.push({
        title: "Users Management",
        icon: "people-outline",
        children: this.userManagement,
      });
    }

    if (this.logsAndReports.length > 0) {
      this.menu.push({
        title: "Logs & Reports",
        icon: "layers-outline",
        children: this.logsAndReports,
      });
    }

    if (this.configurationAndSettings.length > 0) {
      this.menu.push({
        title: "Configuration & Settings",
        icon: "settings-outline",
        children: this.configurationAndSettings,
      });
    }
  }


  backup(data) {
    let MENU_ITEMS = [];
    MENU_ITEMS.push({
      title: "Dashboard",
      icon: "grid-outline",
      link: "/dashboard/home",
    });

    let usemanagement = [];
    var readUser = data.filter((element) => element.Name === "VIEW_USER");
    var viewData = readUser[0];
    if (viewData.RolePermission.Permission != "NONE") {
      usemanagement.push({
        title: "Users",
        link: "/dashboard/user",
      });
    }

    var readGroup = data.filter((element) => element.Name === "VIEW_GROUP");
    var viewGroup = readGroup[0];
    if (viewGroup.RolePermission.Permission != "NONE") {
      usemanagement.push({
        title: "Groups",
        link: "/dashboard/group",
      });
    }

    var readRole = data.filter((element) => element.Name === "VIEW_ROLE");
    var viewRole = readRole[0];
    if (viewRole.RolePermission.Permission != "NONE") {
      usemanagement.push({
        title: "Roles",
        link: "/dashboard/role",
      });
    }

    var readControl = data.filter(
      (element) => element.Name === "VIEW_ACCESS_CONTROL"
    );
    var viewControl = readControl[0];
    if (viewControl.RolePermission.Permission != "NONE") {
      usemanagement.push({
        title: "Access Controls",
        link: "/dashboard/access-control",
      });
    }

    if (usemanagement.length > 0) {
      let userMenu = {
        title: "Users Management",
        icon: "people-outline",
        children: usemanagement,
      };
      MENU_ITEMS.push(userMenu);
    }
    this.menu = MENU_ITEMS;

  }
  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }

  ngOnDestroy() {
    this.userIdle.stopWatching();
    this.ScheduleService.stopServerStatus();
    this.ScheduleService.stopEventLog();
    this.ScheduleService.stopBroadcastStatus()
  }
}
