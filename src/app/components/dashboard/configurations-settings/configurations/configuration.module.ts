import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MatModule } from "../../../../material-module/mat.module";
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
} from "@nebular/theme";
import { FormsModule as ngFormsModule } from "@angular/forms";
import { ThemeModule } from "../../../../@theme/theme.module";
import { ConfigurationListComponent } from "./configuration-list/configuration-list.component";
import { ConfigurationEditComponent } from "./configuration-edit/configuration-edit.component";

const routes: Routes = [
  {
    path: "",
    component: ConfigurationListComponent,
  },
  {
    path: "edit",
    component: ConfigurationEditComponent,
  },
];

@NgModule({
  declarations: [ConfigurationListComponent, ConfigurationEditComponent],
  imports: [
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
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
  ],
})
export class ConfigurationModule {}
