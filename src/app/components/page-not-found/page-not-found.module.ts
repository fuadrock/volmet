import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbInputModule,
  NbCheckboxModule,
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbOptionModule,
  NbIconModule,
  NbActionsModule,
  NbAlertModule
} from "@nebular/theme";
import { MatModule } from '../../material-module/mat.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: "",
    component: PageNotFoundComponent
  }
]

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    RouterModule.forChild(routes),
    NbAlertModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbLayoutModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    NbOptionModule,
    NbIconModule,
    NbActionsModule,
    MatModule
  ]
})
export class PageNotFoundModule { }
