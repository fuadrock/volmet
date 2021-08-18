import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { StorageService } from '../../../../services/storage.service';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ExportToCsv } from 'export-to-csv';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

const DateRangeValidator: ValidatorFn = (fg: FormGroup) => {
  const start = fg.get('from').value;
  const end = fg.get('to').value;
  if (start == '') {
    return null;
  }
  else{
    if(end!=='' && end>start){
      fg.get('to').setErrors(null);
    }
  }
  if (end == '') {
    return null;
  }
  if(start !== null && end !== null && start <= end ){
    fg.get('to').clearValidators();

  }
  else{
    fg.get('to').setErrors({
      range:true
    })
  }
  return start !== null && end !== null && start <= end ? null : { range: true };
};

@Component({
  selector: 'ngx-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class EventListComponent implements OnInit {

  displayedColumns = ['time', 'level', 'type', 'message'];
  dataSource = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 0;
  size = 10;
  pageLength = 0;
  pageSizeOptions = [10, 20, 40, 60];
  pageSort;
  searchForm: FormGroup;
  isLoading = false;
  authData = {};

  programList = [];
  courseList = [];
  log: any;
  permissions: any;
  viewEvent: boolean = false;
  types: any = ['EVENT'];
  to: any = '';
  from: any = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private storage: StorageService,
    private toastr: NbToastrService,

  ) {


  }

  ngOnInit() {

    this.searchForm = this.fb.group({
      types: [['EVENT'], Validators.required],
      from: [''],
      to: [''],
      fromTime: ['00:00'],
      toTime: ['23:59']
    }, { validator: DateRangeValidator });

    this.getLogData();
    this.setPermission();


    this.searchForm.get("from").valueChanges.subscribe(x => {
      this.from = x;
    });
    this.searchForm.get("to").valueChanges.subscribe(x => {
      this.to = x;
    });
  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    var readReport = this.permissions.filter(element => element.Name === 'R_LOG')[0];
    if (readReport.RolePermission.Permission == 'READ') {
      this.viewEvent = true;
    }
  }




  statusSubmit(clear?) {
    if (clear) {
      this.paginator.firstPage();
      this.page = 0;
      this.size = 10;
    }

    if (this.searchForm.valid && this.searchForm.errors == null) {
      if (this.types.length == 0) {
        this.types = ['EVENT'];
      }
      let params = new HttpParams();
      params = params.append('types', this.types.join(','));
      params = params.append('from', this.datePipe.transform(this.from, 'yyyy-MM-dd') ? this.datePipe.transform(this.from, 'yyyy-MM-dd') + ` ${this.searchForm.value.fromTime}` : '');
      params = params.append('to', this.datePipe.transform(this.to, 'yyyy-MM-dd') ? this.datePipe.transform(this.to, 'yyyy-MM-dd') + ` ${this.searchForm.value.toTime}` : '');
      let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
      this.isLoading = true;
      this.apiService.get('api/application-logs' + pagination, params).subscribe(
        res => {
          this.isLoading = false;
          this.log = res.data;
          this.pageLength = res.pageDetail.totalElements;
          this.dataSource = new MatTableDataSource(this.log);
        },
        err => {
          this.isLoading = false;
        }
      )
    }
    else {
      this.showToast('danger', "Invalid filter input!");
      console.log(this.searchForm);
    }
  }

  updateType() {
    let data = this.searchForm.value;
    this.types = data.types;

  }
  export() {
    if (this.searchForm.valid && this.searchForm.errors == null) {
      this.showToast('success', "Preparing download!");
      this.isLoading = true;
      if (this.types.length == 0) {
        this.types = ['EVENT'];
      }
      let params = new HttpParams();
      params = params.append('types', this.types.join(','));
      params = params.append('from', this.datePipe.transform(this.from, 'yyyy-MM-dd') ? this.datePipe.transform(this.from, 'yyyy-MM-dd') + ` ${this.searchForm.value.fromTime}` : '');
      params = params.append('to', this.datePipe.transform(this.to, 'yyyy-MM-dd') ? this.datePipe.transform(this.to, 'yyyy-MM-dd') + ` ${this.searchForm.value.toTime}` : '');
      let pagination = `?pageNumber=0&pageSize=999999999`;
      this.apiService.get('api/file-generator/application-logs' + pagination, params).subscribe(
        res => {
          this.isLoading = false;
          let appLogs = res.data;
          var date = new Date();
          var utc = date.toUTCString();
          const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            title: 'Logs',
            useTextFile: false,
            useBom: true,
            filename: this.types.join('-') + '-Logs' + utc,
            useKeysAsHeaders: true,
          };
          const csvExporter = new ExportToCsv(options);
          appLogs.forEach(function (item) { delete item.Id });
          csvExporter.generateCsv(appLogs);

        },
        err => {
          this.isLoading = false;
          this.showToast('danger', "Download failed!");
        }
      )

    }
    else {
      this.showToast('danger', "Invalid filter input!");
    }

    // if(this.log){
    // var date = new Date();
    // var utc = date.toUTCString();

    //     const options = {
    //       fieldSeparator: ',',
    //       quoteStrings: '"',
    //       decimalSeparator: '.',
    //       showLabels: true,
    //       showTitle: false,
    //       title: 'Logs',
    //       useTextFile: false,
    //       useBom: true,
    //       filename: 'Logs_'+utc,
    //       useKeysAsHeaders: true,
    //     };

    //     const csvExporter = new ExportToCsv(options);

    //     let export_data = JSON.parse(JSON.stringify(this.log));
    //     export_data.forEach(function(item){ delete item.Id });
    //     csvExporter.generateCsv(export_data);
    //   }
    //   else{
    //     this.showToast('danger', "No data to export!!!")
    //   }

  }

  clearForm() {
    this.paginator.firstPage();
    this.searchForm.patchValue({
      types: ['EVENT'],
      from: '',
      to: '',
    });
    this.types = ['EVENT'];
    this.page = 0;
    this.size = 10;
    this.getLogData();
  }

  getLogData() {
    let pagination = `&pageNumber=${this.page}&pageSize=${this.size}`;
    this.isLoading = true;
    this.apiService.get('api/application-logs?types=EVENT&from=&to=' + pagination).subscribe(
      res => {
        this.isLoading = false;
        this.log = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.log);
      },
      err => {
        this.isLoading = false;
        this.showToast('danger', err.error?.errors[0]?.message);
      }
    )
  }

  onPaginateChange(event) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.statusSubmit(false);
  }
  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }
}

