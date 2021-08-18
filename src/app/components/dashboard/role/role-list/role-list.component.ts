import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { StorageService } from '../../../../services/storage.service';
import { ConfirmationModalComponent } from '../../../../@theme/components/modal/confirmation-modal/confirmation-modal.component';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'ngx-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  displayedColumns = ['name', 'desc', 'status', 'action'];
  dataSource = new MatTableDataSource();

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
  roles: any;
  permissions: any;
  viewRole: boolean = false;
  current_permissions: any;
  editRole: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dataCom: DataCommunicationService,
    private storage: StorageService,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,

  ) {


  }

  ngOnInit() {

    this.getRoleData();
    this.setPermission();

  }
  setPermission() {
    this.permissions = this.storage.getRoleData();

    var result = this.permissions.filter(element => element.Name === 'RW_ROLE');
    this.current_permissions = result[0];
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.editRole = true;
      this.viewRole = true;
    }

    if (this.current_permissions.RolePermission.Permission == 'READ') {
      this.viewRole = true;
    }
  }



  addRole() {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.router.navigate(['/dashboard/role/add']);
    }
    else {
      this.showToast("danger", 'You dont have permission to create Role',);
    }

  }

  getRoleData() {
    let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
    this.apiService.get('api/roles' + pagination).subscribe(
      res => {

        this.roles = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.roles);
      },
      err => {

      }
    )
  }

  export() {
    if (this.roles) {
      var date = new Date();
      var utc = date.toUTCString();
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        title: 'Roles',
        useTextFile: false,
        useBom: true,
        filename: 'Roles_' + utc,
        useKeysAsHeaders: true,
      };

      const csvExporter = new ExportToCsv(options);

      let export_data = JSON.parse(JSON.stringify(this.roles));
      export_data.forEach(function (item) {
        delete item.Id;
        delete item.Groups;
        delete item.AccessControls;
      });
      csvExporter.generateCsv(export_data);
    }
    else {
      this.showToast("danger", 'No data to export!',);

    }


  }

  edit(row) {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.dataCom.setPassedItemData(row);
      this.router.navigate(['/dashboard/role/edit']);
    }
    else {
      this.showToast("danger", 'You dont have permission to edit Role',);
    }
  }

  deleteRole(row) {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.dialogService.open(ConfirmationModalComponent, {
        context: {
          message: "Are you sure delete role " + row.Name + "?",
        },
      }).onClose.subscribe(value => {
        if (value == 1) {
          this.apiService.delete('api/roles/' + row.Id)
            .subscribe(
              (res) => {
                this.showToast("success", 'Deleting role successful!',);
                this.ngOnInit();
              },
              (err) => {
                this.showToast("danger", 'Error deleting role!',);

              })
        }

      })
    }
    else {
      this.showToast("danger", 'You dont have permission to delete role',);
    }
  }


  onPaginateChange(event) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getRoleData();
  }

  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }

}
