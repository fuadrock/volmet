import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from "../../../../../services/api.service";
import { DataCommunicationService } from "../../../../../services/data-com/data-communication.service";
import { StorageService } from "../../../../../services/storage.service";

@Component({
  selector: "ngx-configuration-list",
  templateUrl: "./configuration-list.component.html",
  styleUrls: ["./configuration-list.component.scss"],
})
export class ConfigurationListComponent implements OnInit {
  displayedColumns = [ "key", "value"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 0;
  size = 0;
  pageLength = 0;
  pageSizeOptions = [];
  pageSort;
  searchForm: FormGroup;
  isLoading = false;
  authData = {};

  programList = [];
  courseList = [];
  controls: any;
  permissions: any;
  current_permissions: any;
  viewPerssion: boolean = false;

  constructor(
    private router: Router,
    private dataCom: DataCommunicationService,
    private apiService: ApiService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.getAccessControlData();
    this.setPermission();
  }
  setPermission() {
    this.permissions = this.storage.getRoleData();
    var readUser = this.permissions.filter(
      (element) => element.Name === "VIEW_ACCESS_CONTROL"
    );
    var viewData = readUser[0];
    if (viewData.RolePermission.Permission == "READ") {
      this.viewPerssion = true;
    }
  }

  getAccessControlData() {
    let pagination = "?pageNumber=0&pageSize=100";
    this.apiService.get("api/configurations" + pagination).subscribe(
      (res) => {
        this.controls = res.data;
        this.dataSource = new MatTableDataSource(this.controls);
      },
      (err) => {}
    );
  }

  editControl(row) {
    this.dataCom.setPassedItemData(row);
    this.router.navigate(["/dashboard/configurations/edit"]);
  }

  onPaginateChange(event) {
    let filterData = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    };

    this.getAccessControlData();
  }
}
