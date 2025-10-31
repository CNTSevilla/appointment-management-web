// users.routes.ts
import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProfileComponent } from './components/profile/profile.component';

export const USERS_ROUTES: Routes = [
  {
    path: 'list',
    component: UserListComponent
  },
  {
    path: 'me',
    component: ProfileComponent
  }
];
