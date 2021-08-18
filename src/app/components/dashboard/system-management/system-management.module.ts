import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes } from '@angular/router';
import { MatModule } from '../../../material-module/mat.module';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbTabsetModule,
} from '@nebular/theme';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { SpeechRuleComponent } from './speech-rule/speech-rule.component';
import { SourceRuleListComponent } from './source-rule-list/source-rule-list.component';
import { SpeechRuleListComponent } from './speech-rule-list/speech-rule-list.component';
import { SourceRuleEditComponent } from './source-rule-edit/source-rule-edit.component';
import { SpeechRuleEditComponent } from './speech-rule-edit/speech-rule-edit.component';

const routes: Routes = [

  {
    path: 'source-rule',
    component: SourceRuleListComponent,
  },
  {
    path: 'source-rule/edit',
    component: SourceRuleEditComponent,
  },
  {
    path: 'rule/add',
    component: SpeechRuleComponent,
  },
  {
    path: 'speech-rule',
    component: SpeechRuleListComponent,
  },
  {
    path: 'speech-rule/edit',
    component: SpeechRuleEditComponent,
  },
]

@NgModule({
  declarations: [SpeechRuleEditComponent,SourceRuleEditComponent,SpeechRuleComponent,SourceRuleListComponent, SpeechRuleListComponent],
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
    NbTabsetModule
  ]
})
export class SystemManagementModule { }
