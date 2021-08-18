import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

import { Router } from "@angular/router";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { StorageService } from '../../../../services/storage.service';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmationModalComponent } from '../../../../@theme/components/modal/confirmation-modal/confirmation-modal.component';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'ngx-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {


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
  groupData: any;
  permissions: any;
  current_permissions: any;
  viewGroup: boolean = false;
  editGroup: boolean = false;

  constructor(
    private storage: StorageService,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private dataCom: DataCommunicationService,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,


  ) {


  }

  ngOnInit() {
    this.setPermission();
    this.getGroupData();


  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    //console.log("permission:",this.permissions);
    var result = this.permissions.filter(element => element.Name === 'RW_GROUP');
    this.current_permissions = result[0];
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.editGroup = true;
      this.viewGroup = true;
    }

    if (this.current_permissions.RolePermission.Permission == 'READ') {
      this.viewGroup = true;
    }
  }
  addGroup() {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.router.navigate(['/dashboard/group/add']);
    }
    else {
      this.showToast("danger", 'You dont have permission to create Group',);
    }
  }

  edit(row) {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.dataCom.setPassedItemData(row);
      this.router.navigate(['/dashboard/group/edit']);
    }
    else {
      this.showToast("danger", 'You dont have permission to edit Group',);
    }
  }

  export() {

    // this.apiService.get('api/file-generator/groups').subscribe(
    //     res => {
    if (this.groupData) {
      var date = new Date();
      var utc = date.toUTCString();
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        title: 'Groups',
        useTextFile: false,
        useBom: true,
        filename: 'Groups_' + utc,
        useKeysAsHeaders: true,
      };

      const csvExporter = new ExportToCsv(options);

      let export_data = JSON.parse(JSON.stringify(this.groupData));
      export_data.forEach(function (item) {
        delete item.Id;
        delete item.Users;
        delete item.Roles;
      });
      csvExporter.generateCsv(export_data);
    }
    else {
      this.showToast("danger", 'No data to export!',);

    }
  }

  deleteGroup(row) {
    if (this.current_permissions.RolePermission.Permission == 'WRITE') {
      this.dialogService.open(ConfirmationModalComponent, {
        context: {
          message: "Are you sure delete group " + row.Name + "?",
        },
      }).onClose.subscribe(value => {
        if (value == 1) {
          this.apiService.delete('api/groups/' + row.Id)
            .subscribe(
              (res) => {
                this.showToast("success", 'Deleting group successful!',);
                this.ngOnInit();
              },
              (err) => {
                this.showToast("danger", 'Error deleting group!',);

              })
        }

      })
    }
    else {
      this.showToast("danger", 'You dont have permission to delete group',);
    }
  }

  getGroupData() {
    this.isLoading = true;
    let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
    this.apiService.get('api/groups' + pagination).subscribe(
      res => {
        this.isLoading = false;

        this.groupData = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.groupData);
      },
      err => {
        this.isLoading = false;
      }
    )

  }


  onPaginateChange(event) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getGroupData();
  }

  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }

}

