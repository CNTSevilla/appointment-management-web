import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/organism/header/header.component';
import { CalendarComponent } from "../../../../shared/components/molecules/calendar/calendar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CalendarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  token: string | null = sessionStorage.getItem('token');

  constructor(private router: Router) {
    if (!this.token) {
      this.router.navigate(['auth/login']);
    }
  }
}
