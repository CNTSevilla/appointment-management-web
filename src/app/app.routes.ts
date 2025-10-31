import { Routes } from '@angular/router';
import { HomeComponent } from './features/appointments/components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/appointments/appointments.routes').then(m => m.APPOINTMENTS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
