import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { StorageService } from '../../../../services/storage.service';
import { ExportToCsv } from 'export-to-csv';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

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
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReportComponent implements OnInit {

  displayedColumns = ['User', 'AccessTime', 'Status',];
  dataSource = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
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
  type = "1";

  groupData: any;
  permissions: any;
  current_permissions: any;
  viewReport: boolean = false;
  to: any = '';
  from: any = '';
  reportData: any;

  constructor(
    private storage: StorageService,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private dataCom: DataCommunicationService,
    private toastr: NbToastrService,
    private datePipe: DatePipe,
    private toaster: NbToastrService,
  ) {


  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      type: ['1', Validators.required],
      from: [''],
      to: [''],
      fromTime: ['00:00'],
      toTime: ['23:59']
    }, { validator: DateRangeValidator });

    this.setPermission();
    this.getReportData();

    this.searchForm.get("from").valueChanges.subscribe(x => {
      this.from = x;
    });
    this.searchForm.get("to").valueChanges.subscribe(x => {
      this.to = x;
    });
  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    var readReport = this.permissions.filter(element => element.Name === 'R_REPORT')[0];
    if (readReport.RolePermission.Permission == 'READ') {
      this.viewReport = true;
    }
  }


  edit(row) {
    this.dataCom.setPassedItemData(row);
    this.router.navigate(['/dashboard/report/edit']);
  }

  getReportData() {
    this.isLoading = true;
    let pagination = `?type=${this.type}&pageNumber=${this.page}&pageSize=${this.size}`;
    this.apiService.get('api/reports' + pagination).subscribe(
      res => {
        this.isLoading = false;

        this.reportData = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.reportData);
      },
      err => {
        this.isLoading = false;
        this.showToast('danger', err.error?.errors[0]?.message)
      }
    )

  }
  statusSubmit(clear?) {
    if (this.viewReport) {
      if (clear) {
        this.paginator.firstPage();
        this.page = 0;
        this.size = 10;
      }

      if (this.searchForm.valid && this.searchForm.errors == null) {
        if (this.searchForm.value.type == '9') {
          this.displayedColumns = ['User', 'Count'];
        }
        else if (this.searchForm.value.type == '8') {
          this.displayedColumns = ['User', 'Status'];
        }
        else {
          this.displayedColumns = ['User', 'AccessTime', 'Status'];
        }

        let params = new HttpParams();
        params = params.append('type', this.searchForm.value.type);
        params = params.append('from', this.datePipe.transform(this.from, 'yyyy-MM-dd') ? this.datePipe.transform(this.from, 'yyyy-MM-dd') + ` ${this.searchForm.value.fromTime}` : '');
        params = params.append('to', this.datePipe.transform(this.to, 'yyyy-MM-dd') ? this.datePipe.transform(this.to, 'yyyy-MM-dd') + ` ${this.searchForm.value.toTime}` : '');
        let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
        this.isLoading = true;
        this.apiService.get('api/reports' + pagination, params).subscribe(
          res => {
            this.isLoading = false;
            this.reportData = res.data;
            this.pageLength = res.pageDetail.totalElements;
            this.dataSource = new MatTableDataSource(this.reportData);
          },
          err => {
            this.isLoading = false;
            this.showToast('danger', err.error?.errors[0]?.message)

          }
        )
      }
    }
  }

  updateType($event) {
    if (this.viewReport) {
      if ($event.value == '9') {
        this.displayedColumns = ['User', 'Count'];
      }
      else if ($event.value == '8') {
        this.displayedColumns = ['User', 'Status'];
      }
      else {
        this.displayedColumns = ['User', 'AccessTime', 'Status'];
      }

      this.paginator.firstPage();
      this.page = 0;
      this.size = 10;
      this.getReportData();
    }
  }

  clearForm() {
    this.paginator.firstPage();
    this.searchForm.patchValue({
      type: "1",
      from: '',
      to: '',
    });
    this.type = '1';
    this.page = 0;
    this.size = 10;
    this.getReportData();
  }

  export() {
    //   if (this.searchForm.valid && this.searchForm.errors == null) {
    //     let params = new HttpParams();
    //     params = params.append('type', this.searchForm.value.type);
    //     params = params.append('from', this.datePipe.transform(this.from, 'yyyy-MM-dd') ? this.datePipe.transform(this.from, 'yyyy-MM-dd') + ` ${this.searchForm.value.fromTime}` : '');
    //     params = params.append('to', this.datePipe.transform(this.to, 'yyyy-MM-dd') ? this.datePipe.transform(this.to, 'yyyy-MM-dd') + ` ${this.searchForm.value.toTime}` : '');
    //     let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
    //   this.apiService.get(`api/file-generator/reports`+pagination,params).subscribe(
    //     res => {
    //       const options = {
    //         fieldSeparator: ',',
    //         quoteStrings: '"',
    //         decimalSeparator: '.',
    //         showLabels: true,
    //         showTitle: false,
    //         title: 'Reports',
    //         useTextFile: false,
    //         useBom: true,
    //         filename: 'report_' + Date.now(),
    //         useKeysAsHeaders: true,
    //       };

    //       const csvExporter = new ExportToCsv(options);

    //       let export_data = res.data;
    //       export_data.forEach(function (item) { delete item.Count });
    //       csvExporter.generateCsv(export_data);
    //     },
    //     err => {

    //     }
    //   )
    // }
    // else{
    //   this.showToast('danger', "Please fill those fileds properly!")
    // }
    if (this.searchForm.valid && this.searchForm.errors == null) {
      this.showToast('success', "Preparing download!");
      this.isLoading = true;

      let params = new HttpParams();
      params = params.append('type', this.searchForm.value.type);
      params = params.append('from', this.datePipe.transform(this.from, 'yyyy-MM-dd') ? this.datePipe.transform(this.from, 'yyyy-MM-dd') + ` ${this.searchForm.value.fromTime}` : '');
      params = params.append('to', this.datePipe.transform(this.to, 'yyyy-MM-dd') ? this.datePipe.transform(this.to, 'yyyy-MM-dd') + ` ${this.searchForm.value.toTime}` : '');
      let pagination = `?pageNumber=0&pageSize=999999999`;
      this.apiService.get('api/file-generator/reports' + pagination, params).subscribe(
        res => {
          this.isLoading = false;
          let reportData = res.data;
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
            filename: this.reportType() + utc,
            useKeysAsHeaders: true,
          };
          const csvExporter = new ExportToCsv(options);
          reportData.forEach(function (item) { delete item.Count });
          csvExporter.generateCsv(reportData);

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




    // if (this.reportData) {
    //   var date = new Date();
    //   var utc = date.toUTCString();
    //   const options = {
    //     fieldSeparator: ',',
    //     quoteStrings: '"',
    //     decimalSeparator: '.',
    //     showLabels: true,
    //     showTitle: false,
    //     title: 'Reports',
    //     useTextFile: false,
    //     useBom: true,
    //     filename: this.reportType() + utc,
    //     useKeysAsHeaders: true,
    //   };

    //   const csvExporter = new ExportToCsv(options);

    //   let export_data = JSON.parse(JSON.stringify(this.reportData));;
    //   export_data.forEach(function (item) { delete item.Count });
    //   csvExporter.generateCsv(export_data);
    // }
    // else {
    //   this.showToast('danger', "No data to export!")
    // }

  }

  onPaginateChange(event) {

    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.statusSubmit(false);
  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }

  reportType() {
    let report = '';
    switch (this.type) {
      case '1':
        report = "AllReport";
        break;
      case '2':
        report = "MidNightLogin";
        break;
      case '3':
        report = "WeekendLogin";
        break;
      case '4':
        report = "HolidayLogin";
        break;
      case '5':
        report = "SuccessfulLogin";
        break;
      case '6':
        report = "UnSuccessfulLogin";
        break;
      case '7':
        report = "InactiveUser";
        break;
      case '8':
        report = "NewUser";
        break;
      case '9':
        report = "IndividualLoginAttempt";
        break;
      default:
        report = "Reports";
    }
    return report;
  }
}

