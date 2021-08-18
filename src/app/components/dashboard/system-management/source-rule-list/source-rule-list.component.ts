import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

import {Router} from "@angular/router";

import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-source-rule-list',
  templateUrl: './source-rule-list.component.html',
  styleUrls: ['./source-rule-list.component.scss']
})
export class SourceRuleListComponent implements OnInit {

  displayedColumns = ['rule', 'format', 'type','status', 'action'];
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
  speechRules=[];

  constructor(
    private dataCom:DataCommunicationService,
    private router: Router,
    private apiService:ApiService,
    private fb: FormBuilder,
    private toastr:NbToastrService
  ) {


  }

  ngOnInit() {

    this.getRuleData();


  }
  editRule(row){
    this.dataCom.setPassedItemData(row);
    this.router.navigate(['/dashboard/system-management/source-rule/edit']);
  }

  addRule(){
    this.router.navigate(['/dashboard/system-management/rule/add']);
  }

  getRuleData() {
    let pagination = '?pageNumber=1&pageSize=10';
    this.apiService.get('api/fetchAllSourceRules'+pagination).subscribe(
      res=>{
        console.log(res.data);
        this.speechRules = res
        this.dataSource = new MatTableDataSource(this.speechRules);
      },
      err=>{

      })
}

  onPaginateChange(event) {
    let filterData = {
      "pageIndex": event.pageIndex,
      "pageSize": event.pageSize,
    };


  }
  sync(){
    this.apiService.get('api/sync/SOURCE').subscribe(
      res=>{
        console.log(res.data);
        this.toastr.show("Success", 'Sync Successful',);
      },
      err=>{

      })
  }

}

