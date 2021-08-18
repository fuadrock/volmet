import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddUserComponent } from "./add-user/add-user.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserEditComponent } from "./user-edit/user-edit.component";
import { RouterModule, Routes } from "@angular/router";
import { MatModule } from "../../../material-module/mat.module";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbTooltipModule,
} from "@nebular/theme";
import { FormsModule as ngFormsModule } from "@angular/forms";
import { ThemeModule } from "../../../@theme/theme.module";
import { PipeModule } from "../../../services/utils/pipe/pipe.module";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { CUSTOM_DATE_FORMATS } from "./date-formats";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MomentDateModule } from "@angular/material-moment-adapter";
import { ModalModule } from "../../../@theme/components/modal/modal.module";

const routes: Routes = [
  {
    path: "",
    component: UserListComponent,
  },
  {
    path: "add",
    component: AddUserComponent,
  },
  {
    path: "edit",
    component: UserEditComponent,
  },
];

@NgModule({
  declarations: [AddUserComponent, UserListComponent, UserEditComponent],
  imports: [
    NbTooltipModule,
    CommonModule,
    ThemeModule,
    RouterModule.forChild(routes),
    MatModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    PipeModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MomentDateModule,
    ModalModule
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
})
export class UserModule {}
