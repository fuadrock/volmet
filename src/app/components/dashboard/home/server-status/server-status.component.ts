import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { timer, Observable, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil, catchError, takeWhile } from 'rxjs/operators';
import { SchedulerService } from '../../../../services/scheduler.service';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'ngx-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.scss']
})
export class ServerStatusComponent implements OnInit {

  displayedColumns = ['time', 'message'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;
  page = 0;
  size = 14;
  pageLength = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageSort;
  searchForm: FormGroup;
  isLoading = false;
  authData = {};

  programList = [];
  courseList = [];
  log: any;
  subscription: Subscription;
  filter: boolean = true;

  //private fetchData$: Observable<any> = this.apiService.get('api/application-logs?types="EVENT"');

  constructor(
    private fb: FormBuilder,

    private apiService: ApiService,
    private router: Router,
    private schedulerService: SchedulerService
  ) {
  }

  ngOnInit() {
    this.subscription = this.schedulerService.getStatusData.pipe(takeWhile(() => this.filter)).subscribe(
      res => {
        if (res) {
          this.log = res.data;
          this.pageLength = res.pageDetail.totalElements;
          this.dataSource = new MatTableDataSource(this.log);
        }
      }
    )
 //   this.getLogData();


    // this.searchForm = this.fb.group({
    //   types: [[], Validators.required],
    //   from: [''],
    //   to: [''],
    // });

    // this.subscription = timer(0, 10000).pipe(
    //   switchMap(() =>  this.apiService.get('api/application-logs?types="EVENT"'))
    // ).subscribe(res =>
    //    {
    //     console.log(res.data);
    //     this.log = res.data
    //     this.dataSource = new MatTableDataSource(this.log);
    //    });

  }
  // clearForm() {
  //   this.filter = true;
  //   this.searchForm.reset();
  //   this.getLogData();
  // }

  getLogData() {

    let pagination = `&from=&to=&pageNumber=${this.page}&pageSize=${this.size}`;
    this.apiService.get('api/application-logs?types=SYSTEM' + pagination).subscribe(
      res => {

        this.log = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.log);
      },
      err => {

      }
    )
  }

  onPaginateChange(event) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getLogData();
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
