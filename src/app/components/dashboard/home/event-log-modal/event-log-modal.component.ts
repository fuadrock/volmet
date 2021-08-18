import { Component,  Input,  OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { SchedulerService } from '../../../../services/scheduler.service';

@Component({
  selector: 'ngx-event-log-modal',
  templateUrl: './event-log-modal.component.html',
  styleUrls: ['./event-log-modal.component.scss']
})
export class EventLogModalComponent implements OnDestroy {

  @Input() title: string;

  displayedColumns = ['time', 'message'];
  dataSource = new MatTableDataSource();

  log: any;

  filter: boolean = true;
  subscription: Subscription;


  constructor(protected ref: NbDialogRef<EventLogModalComponent>,private schedulerService:SchedulerService) {
    this.subscription = this.schedulerService.getEventData.subscribe(
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
