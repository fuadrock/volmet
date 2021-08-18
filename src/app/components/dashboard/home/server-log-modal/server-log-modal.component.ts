import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { SchedulerService } from '../../../../services/scheduler.service';

@Component({
  selector: 'ngx-server-log-modal',
  templateUrl: './server-log-modal.component.html',
  styleUrls: ['./server-log-modal.component.scss']
})
export class ServerLogModalComponent  implements OnDestroy {

  @Input() title: string;

  displayedColumns = ['time', 'message'];
  dataSource = new MatTableDataSource();

  log: any;

  filter: boolean = true;
  subscription: Subscription;


  constructor(protected ref: NbDialogRef<ServerLogModalComponent>,private schedulerService:SchedulerService) {
    this.subscription = this.schedulerService.getStatusData.subscribe(
      res => {
        if (res) {
          this.log = res.data;
          this.dataSource = new MatTableDataSource(this.log);
        }
      }
    )
  }

  dismiss() {
    this.ref.close();
  }
  save(value){
    this.ref.close(value);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

}
