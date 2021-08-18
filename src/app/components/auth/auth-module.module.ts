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
import { LoginComponentComponent } from "./login-component/login-component.component";
import { MatModule } from '../../material-module/mat.module';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponentComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponentComponent,

  ],
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
  ],
})
export class AuthModuleModule {}
