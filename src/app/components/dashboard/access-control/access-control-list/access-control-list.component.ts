import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'ngx-access-control-list',
  templateUrl: './access-control-list.component.html',
  styleUrls: ['./access-control-list.component.scss']
})
export class AccessControlListComponent implements OnInit {

  displayedColumns = ['name', 'status'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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
  viewPerssion: boolean=false;

  constructor(
    private router: Router,
    private dataCom:DataCommunicationService,
    private apiService:ApiService,
    private storage:StorageService
  ){

   }

  ngOnInit() {
    this.getAccessControlData();
    this.setPermission();
  }
  setPermission(){
    this.permissions = this.storage.getRoleData();

    // var result =  this.permissions.filter(element => element.Name === 'CREATE_USER');
    // this.current_permissions = result[0];
    var readUser = this.permissions.filter(element => element.Name === 'VIEW_ACCESS_CONTROL');
    var viewData = readUser[0];
    if(viewData.RolePermission.Permission=='READ'){
      this.viewPerssion = true;
    }
  }

  addAccessControl(){
    this.router.navigate(['/dashboard/access-control/add']);
  }

  getAccessControlData() {
    this.apiService.get('api/access-controls').subscribe(
      res=>{
        console.log(res.data);
        this.controls = res.data
        this.dataSource = new MatTableDataSource(this.controls);
      },
      err=>{

      }
    )
  }

  editControl(row){
    this.dataCom.setPassedItemData(row);
    this.router.navigate(['/dashboard/access-control/edit']);
  }

  onPaginateChange(event) {
    let filterData = {
      "pageIndex": event.pageIndex,
      "pageSize": event.pageSize,
    };

    this.getAccessControlData();
  }

}

