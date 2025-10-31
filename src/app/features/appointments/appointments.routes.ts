// users.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HistoryComponent } from './components/history/history.component';
import { AppointmentComponent } from './components/appointment/appointment.component';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'appointments',
    component: AppointmentComponent
  },
];
