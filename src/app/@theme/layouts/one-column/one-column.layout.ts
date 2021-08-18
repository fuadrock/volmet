import { Component ,OnInit} from "@angular/core";
import * as $ from "jquery";
import { DataCommunicationService } from '../../../services/data-com/data-communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "ngx-one-column-layout",
  styleUrls: ["./one-column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar
        class="menu-sidebar side-bar"
        tag="menu-sidebar"
        state="expanded"
        responsive
      >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <!-- <nb-sidebar
        class="menu-sidebar right compacted sidebar-right"
        tag="menu-sidebar-right"
        responsive
      >
        <div>
          <input
            nbButton
            ghost
            fullWidth
            status="info"
            class="margin-top-small"
            size="large"
            style="text-transform: none;"
            type="file"
          />
          <button
            nbButton
            ghost
            fullWidth
            status="success"
            class="margin-top-small"
            size="large"
            style="text-transform: none;"
          ><nb-icon icon="play-circle-outline"></nb-icon>
            Start
          </button>
          <button
            nbButton
            ghost
            fullWidth
            status="danger"
            class="margin-top-small"
            size="large"
            style="text-transform: none;"
          ><nb-icon icon="stop-circle-outline"></nb-icon>
            Stop
          </button>
        </div>
      </nb-sidebar> -->

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit {

  subscription:Subscription;
  expanded: any = false;
  constructor(private dataCom:DataCommunicationService){

  }
  ngOnInit(){
    this.subscription = this.dataCom.isSideMenuCollapsed.subscribe(
      res=>{
        this.expanded = res;
      }
    )
  }
expandSidebar() {
    if(!this.expanded) {
      $(".side-bar").addClass("expanded");
      $(".side-bar").removeClass("compacted");
    }
  }
  collapseSidebar() {
    if(!this.expanded) {
      $(".side-bar").addClass("compacted");
      $(".side-bar").removeClass("expanded");
    }
  }
}
