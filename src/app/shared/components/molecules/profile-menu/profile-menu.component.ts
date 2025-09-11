import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShortinfoComponent } from '../shortinfo/shortinfo.component';
import { RequestService } from '../../../../core/services/request.service';
import { Router } from '@angular/router';

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

  constructor(private api: RequestService, private router: Router) {
    this.actualTab = this.router.url.startsWith('/')
      ? this.router.url
      : '/' + this.router.url;

      console.log(this.actualTab)
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
