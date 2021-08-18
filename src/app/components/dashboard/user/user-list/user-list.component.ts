import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { ApiService } from '../../../../services/api.service';
import { StorageService } from '../../../../services/storage.service';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmationModalComponent } from '../../../../@theme/components/modal/confirmation-modal/confirmation-modal.component';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  permissions;
  displayedColumns = ['name', 'username', 'status', 'group', 'lastAccess', 'action'];
  dataSource = new MatTableDataSource();
  viewUser = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 0;
  size = 10;
  pageLength = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageSort;
  searchForm: FormGroup;
  isLoading = false;
  authData = {};

  programList = [];
  courseList = [];
  userData: any;
  current_permissions: any;

  constructor(

    private router: Router,
    private dataComm: DataCommunicationService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private storage: StorageService,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
  ) {

    this.searchForm = fb.group({
      title: [],
      name: [],
      position: [],
    })
  }

  ngOnInit() {
    let pagination = '';
    this.getUserData();
    this.setPermission();
  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    console.log("permission:", this.permissions);
    var result = this.permissions.filter(element => element.Name === 'RW_USER');
    this.current_permissions = result[0];
    if (this.current_permissions.RolePermission.Permission == 'READ' || this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.viewUser = true;
    }
  }
  export() {
    this.showToast('success', 'Preparing download!');
    this.isLoading = true;
      var date = new Date();
      var utc = date.toUTCString();
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        title: 'Users',
        useTextFile: false,
        useBom: true,
        filename: 'Users_' + utc,
        useKeysAsHeaders: true,
      };

      let pagination = `?pageNumber=0&pageSize=999999`;

      this.apiService.get('api/users' + pagination).subscribe(
        res => {
          this.isLoading = false;
          let usersData = res.data;
          const csvExporter = new ExportToCsv(options);

          usersData.forEach(function (item) {
            delete item.Groups;
            delete item.Id;
            delete item.Editable
          });
          csvExporter.generateCsv(usersData);

        },
        err => {
          this.isLoading = false;
          this.showToast("danger", 'Download failed!',);
        }
      )





  }

  addUser() {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.router.navigate(['/dashboard/user/add']);
    }
    else {
      this.showToast("danger", 'You dont have permission to create User',);
    }
  }

  editUser(row) {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.dataComm.setPassedItemData(row);
      this.router.navigate(['/dashboard/user/edit']);
    }
    else {
      this.showToast("danger", 'You dont have permission to edit User',);
    }



  }
  deleteUser(row) {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.dialogService.open(ConfirmationModalComponent, {
        context: {
          message: "Are you sure delete user " + row.Name + "?",
        },
      }).onClose.subscribe(value => {
        if (value == 1) {
          this.apiService.delete('api/users/' + row.Id)
            .subscribe(
              (res) => {
                this.showToast("success", 'Deleting user successful!',);
                this.ngOnInit();
              },
              (err) => {
                this.showToast("danger", 'Error deleting user!',);

              })
        }

      })
    }
    else {
      this.showToast("danger", 'You dont have permission to delete User',);
    }
  }




  getUserData() {
    let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
    this.isLoading = true;
    this.apiService.get('api/users' + pagination).subscribe(
      res => {
        this.isLoading = false;
        console.log(res.data);
        this.userData = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.userData);
      },
      err => {
        this.isLoading = false;
      }
    )

  }


  onPaginateChange(event) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getUserData();
  }

  getGroups(groups) {
    let value = '';
    groups.forEach((group, index) => {
      value += group.Name;
      if (index !== groups.length - 1) {
        value += ', ';
      }
    });
    return value;
  }

  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }

}


