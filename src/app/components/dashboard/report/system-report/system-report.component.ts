import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../../../services/storage.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { ExportToCsv } from 'export-to-csv';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
require('highcharts/modules/annotations')(Highcharts);
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

export const DateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const start = control.parent.get('from').value;
  const end = control.parent.get('to').value;
  if (start == '') {
    return null;
  }
  else{
    if(end!=='' && end>start){
      control.parent.get('to').setErrors(null);
    }
  }
  if (end == '') {
    return null;
  }

  return start !== null && end !== null && start <= end ? null : { range: true };
};



@Component({
  selector: 'ngx-system-report',
  templateUrl: './system-report.component.html',
  styleUrls: ['./system-report.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class SystemReportComponent implements OnInit {
  chart: Chart;
  successChart: Chart;
  isLoading = false;

  results = [
    { name: '2020-09-18', value: 3 },
    { name: '2020-09-19', value: 6 },
    { name: '2020-09-20', value: 9 },
    { name: '2020-09-21', value: 6 },
    { name: '2020-09-22', value: 3 },
    { name: '2020-09-23', value: 3 },
    { name: '2020-09-24', value: 6 },
    { name: '2020-09-25', value: 9 },
    { name: '2020-09-26', value: 6 },
    { name: '2020-09-27', value: 3 },
    { name: '2020-09-28', value: 3 },
    { name: '2020-09-29', value: 6 },
    { name: '2020-09-30', value: 9 },
    { name: '2020-10-01', value: 6 },
    { name: '2020-10-02', value: 3 },
    { name: '2020-09-01', value: 9 },
    { name: '2020-09-02', value: 6 },
    { name: '2020-09-03', value: 3 },
    { name: '2020-09-04', value: 3 },
    { name: '2020-09-05', value: 6 },
    { name: '2020-09-06', value: 9 },
    { name: '2020-10-07', value: 6 },
    { name: '2020-10-08', value: 3 },
  ];

  showLegend = false;
  showXAxis = true;
  showYAxis = true;
  xAxisLabel = 'Date';
  yAxisLabel = 'Count';

  colorScheme = {
    domain: ['#335DFF',],

  };
  displayedColumnsNewAc = ['User'];
  displayedColumns = ['User', 'LastAccessTime', 'Status'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 0;
  newAccountPage = 0
  size = 30;
  newAccountSize = 30;
  pageLength = 0;
  totalNewAccountLength = 0;
  pageSizeOptions = [5, 10, 15, 20, 30];
  pageSort;
  reportData: any[] = [
    {
      id: 1,
      User: 'fuad@asiatel.sg',
      LastAccessTime: '2020-09-18 11:50am'
    },
    {
      id: 2,
      User: 'shain@asiatel.sg',
      LastAccessTime: '2020-09-20 11:50am'
    },
    {
      id: 3,
      User: 'fuad@asiatel.sg',
      LastAccessTime: '2020-09-18 11:50am'
    }
  ];
  oddForm: any;
  successForm: any;
  successData: any;
  newAccountData: any;
  newAccountForm: any;
  inactiveAccountData: any;
  inactiveAccountForm: any;
  userData: any;
  permissions: any;
  viewReport: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toaster: NbToastrService,
    private datePipe: DatePipe,
    private storage: StorageService
  ) {
    this.oddForm = this.fb.group({
      userName: ['', Validators.required],
      timeSlot: ['', Validators.required],
      from: ['', [Validators.required, DateRangeValidator]],
      to: ['', [Validators.required, DateRangeValidator]],
      fromTime: ['00:00'],
      toTime: ['23:59']
    });

    this.successForm = this.fb.group({
      userName: ['', Validators.required],
      status: ['', Validators.required],
      from: ['', [Validators.required, DateRangeValidator]],
      to: ['', [Validators.required, DateRangeValidator]],
      fromTime: ['00:00'],
      toTime: ['23:59']
    });

    this.newAccountForm = this.fb.group({
      from: ['', Validators.required],
      to: [''],
      fromTime: ['00:00'],
      toTime: ['23:59']
    });

    this.inactiveAccountForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      fromTime: ['00:00'],
      toTime: ['23:59']
    });
  }

  ngOnInit(): void {
    let pagination = '?pageNumber=0&pageSize=1000';
    this.apiService.get('api/users' + pagination).subscribe(
      res => {
        console.log(res.data);
        this.userData = res.data
      },
      err => {
        this.oddForm.controls['userName'].setErrors(null);
        this.oddForm.controls['userName'].setErrors({ noPermission: true });
        this.successForm.controls['userName'].setErrors(null);
        this.successForm.controls['userName'].setErrors({ noPermission: true });

      }),
      this.dataSource = new MatTableDataSource(this.reportData);
    this.getDefaultData();
    this.setPermission();
  }

  onPaginateChangeNewAccount(event) {
    this.newAccountSize = event.pageSize;
    this.newAccountPage = event.pageIndex;
    this.getNewAccountData();
  }
  onPaginateChange(event) {

    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getInactiveAccountData();
  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    var readReport = this.permissions.filter(element => element.Name === 'R_REPORT')[0];
    if (readReport.RolePermission.Permission == 'READ') {
      this.viewReport = true;
    }
  }



  getDefaultData() {
    let filterData = `?userName=&timeSlot=&from=&to=&pageNumber=0&pageSize=30`;
    this.apiService.get('api/reports/odd-time' + filterData).subscribe(
      res => {
        //  this.showToast('success', 'Data avialable.')
        this.results = res.data;
        let oddPeriodValue = [];
        this.results.forEach(e => {
          let value = [e.name, e.value];
          oddPeriodValue.push(value);
        });
        this.initOddPeriod(oddPeriodValue);

      },
      err => {
        //  this.showToast('danger', err.error.errors[0].message)
      }
    );

    let successFilter = `?userName=&status=&from=&to=&pageNumber=0&pageSize=30`;
    this.apiService.get('api/reports/status' + successFilter).subscribe(
      res => {
        //  this.showToast('success', 'Data avialable.')
        this.successData = res.data;
        let successValue = [];
        this.successData.forEach(e => {
          let value = [e.name, e.value];
          successValue.push(value);
        });
        this.initsuccessLogin(successValue);
      },
      err => {
        //  this.showToast('danger', err.error.errors[0].message)
      }
    );

    this.getNewAccountData();

    this.getInactiveAccountData();
  }

  getNewAccountData() {
    let newAccountFilter = `?type=8&from=&to=&pageNumber=${this.newAccountPage}&pageSize=${this.newAccountSize}`;
    this.apiService.get('api/reports' + newAccountFilter).subscribe(
      res => {
        // this.showToast('success', 'Data avialable.');
        this.newAccountData = res.data;
        this.totalNewAccountLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.newAccountData);
      },
      err => {
        //  this.showToast('danger', err.error.errors[0].message)
      }
    );
  }
  getInactiveAccountData() {
    let inactiveAccountFilter = `?type=7&pageNumber=${this.page}&pageSize=${this.size}`;
    this.apiService.get('api/reports' + inactiveAccountFilter).subscribe(
      res => {
        // this.showToast('success', 'Data avialable.');
        this.inactiveAccountData = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.inactiveAccountData);
      },
      err => {
        //  this.showToast('danger', err.error.errors[0].message)
      }
    )
  }

  oddLogin() {
    if (this.oddForm.valid && this.oddForm.errors == null) {

      let data = this.oddForm.value;
      let from_date = this.datePipe.transform(data.from, 'yyyy-MM-dd') + ` ${this.oddForm.value.fromTime}`;
      let to_date = this.datePipe.transform(data.to, 'yyyy-MM-dd') + ` ${this.oddForm.value.toTime}`;
      let filterData = `?userName=${data.userName}&timeSlot=${data.timeSlot}&from=${from_date}&to=${to_date}&pageNumber=0&pageSize=10`;
      this.apiService.get('api/reports/odd-time' + filterData).subscribe(
        res => {
          if (res.data.length > 0) {
            // if (res.data.length < 5) {
            //   this.results = this.addDummydata(res.data);
            // }
            // else {
            this.showToast('success', 'Data avialable.')
            this.results = res.data;
            let oddPeriodValue = [];
            this.results.forEach(e => {
              let value = [e.name, e.value];
              oddPeriodValue.push(value);
            });
            this.initOddPeriod(oddPeriodValue);

            // }
          }
          else {
            this.showToast('danger', 'No data avialable.');
            this.results = res.data;
            this.chart.removeSeries(0);
          }
        },
        err => {
          this.showToast('danger', err.error?.errors[0]?.message ?? 'Error connecting to server.')
        }
      )
    }
  }
  successLogin() {
    if (this.successForm.valid && this.successForm.errors == null) {
      let data = this.successForm.value;
      let from_date = this.datePipe.transform(data.from, 'yyyy-MM-dd') + ` ${this.successForm.value.fromTime}`;
      let to_date = this.datePipe.transform(data.to, 'yyyy-MM-dd') + ` ${this.successForm.value.toTime}`;
      let filterData = `?userName=${data.userName}&status=${data.status}&from=${from_date}&to=${to_date}&pageNumber=0&pageSize=30`;
      this.apiService.get('api/reports/status' + filterData).subscribe(
        res => {
          if (res.data.length > 0) {
            this.showToast('success', 'Data avialable.');
            this.successData = res.data;
            let successValue = [];
            this.successData.forEach(e => {
              let value = [e.name, e.value];
              successValue.push(value);
            });
            this.initsuccessLogin(successValue);
          }
          else {
            this.showToast('danger', 'No data avialable.');
            this.successChart.removeSeries(0);
            this.successData = res.data;
          }
        },
        err => {
          this.showToast('danger', err.error?.errors[0]?.message ?? 'Error connecting to server!')
        }
      )
    }
  }

  newAccountSubmit() {
    if (this.newAccountForm.valid && this.newAccountForm.errors == null) {
      let data = this.newAccountForm.value;
      let from_date = this.datePipe.transform(data.from, 'yyyy-MM-dd') + ` ${this.newAccountForm.value.fromTime}`;
      let to_date = this.datePipe.transform(data.to, 'yyyy-MM-dd') + ` ${this.newAccountForm.value.toTime}`;
      let filterData = `?type=8&from=${from_date}&to=${to_date}&pageNumber=0&pageSize=30`;
      this.apiService.get('api/reports' + filterData).subscribe(
        res => {
          if (res.data.length > 0) {
            this.showToast('success', 'Data avialable.')
            this.newAccountData = res.data;
            this.dataSource = new MatTableDataSource(this.newAccountData);
          }
          else {
            this.showToast('danger', 'No data avialable.');
            this.newAccountData = res.data;
            this.dataSource = new MatTableDataSource(this.newAccountData);
          }
        },
        err => {
          this.showToast('danger', err.error?.errors[0]?.message ?? 'Error connecting to server!');
          this.newAccountData = [];
          this.dataSource = new MatTableDataSource(this.newAccountData);
        }
      )
    }
  }
  addDummydata(data) {
    if (data.length == 4) {
      data.splice(2, 0, { name: '2020-10-08', value: 0 });
      return data;
    }
    else {
      return data
    }
  }

  inActiveAccountSubmit() {
    if (this.inactiveAccountForm.valid && this.inactiveAccountForm.errors == null) {
      let data = this.inactiveAccountForm.value;
      let from_date = this.datePipe.transform(data.from, 'yyyy-MM-dd') + ` ${this.inactiveAccountForm.value.fromTime}`;
      let to_date = this.datePipe.transform(data.to, 'yyyy-MM-dd') + ` ${this.inactiveAccountForm.value.toTime}`;
      let filterData = `?type=7&from=${from_date}&to=${to_date}&pageNumber=0&pageSize=30`;
      this.apiService.get('api/reports' + filterData).subscribe(
        res => {
          if (res.data.length > 0) {
            this.showToast('success', 'Data avialable.')
            this.inactiveAccountData = res.data;
            this.dataSource = new MatTableDataSource(this.inactiveAccountData);
          }
          else {
            this.showToast('danger', 'No data avialable.')
            this.inactiveAccountData = res.data;
            this.dataSource = new MatTableDataSource(this.inactiveAccountData);
          }
        },
        err => {
          this.showToast('danger', err.error?.errors[0]?.message ?? 'Error connecting to server!')
        }
      )
    }
  }
  exportInactive() {
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
      title: 'Inactive Accounts',
      useTextFile: false,
      useBom: true,
      filename: 'InactiveAccounts' + utc,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    let inactiveAccountFilter = `?type=7&pageNumber=0&pageSize=99999`;
    this.apiService.get('api/reports' + inactiveAccountFilter).subscribe(
      res => {
        this.isLoading = false;
        if (res.data) {
          let inactiveData = res.data;
          inactiveData.forEach(function (item) {
            delete item.Count;
          });
          csvExporter.generateCsv(inactiveData);
        }
      },
      err => {
        this.isLoading = false;
        this.showToast('danger', err.error.errors[0].message)
      }
    )
  }

  exportNewAccount() {
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
      title: 'New Accounts',
      useTextFile: false,
      useBom: true,
      filename: 'NewAccounts' + utc,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    let newAccountFilter = `?type=8&pageNumber=0&pageSize=99999`;
    this.apiService.get('api/reports' + newAccountFilter).subscribe(
      res => {
        this.isLoading = false;
        if (res.data) {
          let newData = res.data;
          newData.forEach(function (item) {
            delete item.Count;
          });
          csvExporter.generateCsv(newData);
        }
      },
      err => {
        this.isLoading = false;
        this.showToast('danger', err.error.errors[0].message)
      }
    )
  }

  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }

  get f() { return this.oddForm.controls; }
  get sF() { return this.successForm.controls; }

  get nF() { return this.newAccountForm.controls; }
  get iF() { return this.inactiveAccountForm.controls; }


  initOddPeriod(data) {
    let chart = new Chart({
      chart: {
        type: 'column'
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: true
          },
          exportButton: {
            text: 'Download',
            menuItems: [
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG'
            ]
          },
          printButton: {
            text: 'Print',
            onclick: function () {
              this.print();
            }
          }
        }
      },
      title: {
        text: 'Access during odd period'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Date'
        },
        labels: {
          rotation: -45,
          style: {

          }
        }
      },
      colors: ['#335DFF'],

      yAxis: {
        min: 0,
        title: {
          text: 'Count'
        }
      },
      tooltip: {
        pointFormat: 'Total count : <b>{point.y}</b>'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          pointWidth: 35
        },

      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Count',
        type: 'column',
        data: data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',

          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',

          }
        }
      }],

    });
    this.chart = chart;

  }
  initsuccessLogin(data) {
    let chart = new Chart({
      chart: {
        type: 'column'
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: true
          },
          exportButton: {
            text: 'Download',
            menuItems: [
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG'
            ]
          },
          printButton: {
            text: 'Print',
            onclick: function () {
              this.print();
            }
          }
        }
      },
      title: {
        text: 'Su/Unsuccessful Login attempts'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Date'
        },
        labels: {
          rotation: -45,
          style: {

          }
        }
      },
      colors: ['#335DFF'],

      yAxis: {
        min: 0,
        title: {
          text: 'Count'
        }
      },
      tooltip: {
        pointFormat: 'Total count : <b>{point.y}</b>'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          pointWidth: 35
        },

      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Count',
        type: 'column',
        data: data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',

          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',

          }
        }
      }],

    });
    this.successChart = chart;

  }

}
