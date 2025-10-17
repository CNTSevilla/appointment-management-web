import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShortinfoComponent } from '../shortinfo/shortinfo.component';
import { RequestService } from '../../../../core/services/request.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile-menu',
  imports: [CommonModule, ShortinfoComponent],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss'
})
export class ProfileMenuComponent {

  @Input() actualTab: string = '';
  @Input() className: string = '';
  @Output() redirectLink = new EventEmitter<string>();

  public userInfo: any = {};

  constructor(private api: RequestService, private router: Router) {
    this.actualTab = this.router.url.startsWith('/')
      ? this.router.url
      : '/' + this.router.url;

    const token = sessionStorage.getItem('token');
    if (token) {
      this.userInfo = jwtDecode(token);
      console.log(this.userInfo); // contiene los datos del usuario
    }
  }

  toggleTabProfile: boolean = false;
  menu = [
    {
      name: 'Perfil',
      route: '/users/me'
    },
    {
      name: 'Tus citas',
      route: '/myappointments'
    }
  ]

  logout(): void {
    this.api.logout();
  }
}
