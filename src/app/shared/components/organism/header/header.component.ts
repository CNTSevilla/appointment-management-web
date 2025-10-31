import { Component } from '@angular/core';
import { LogoComponent } from "../../atoms/logo/logo.component";
import { TitleComponent } from "../../atoms/title/title.component";
import { LinkComponent } from "../../atoms/link/link.component";
import { IconComponent } from "../../atoms/icon/icon.component";
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from '../../molecules/profile-menu/profile-menu.component';
import { RequestService } from '../../../../core/services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, IconComponent, CommonModule, TitleComponent, LinkComponent, ProfileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})


export class HeaderComponent {

  actualTab: string = '';

  constructor(private api: RequestService, private router: Router) {
    this.actualTab = this.router.url.startsWith('/')
      ? this.router.url
      : '/'+this.router.url;
  }

  menu = [
    {
      name: 'Inicio',
      route: '/',
      icon: 'house'
    },
    {
      name: 'Citas',
      route: '/appointments',
      icon: 'book'
    },
    {
      name: 'Usuarios',
      route: '/users/list',
      icon: 'user'
    },
    {
      name: 'Historial de citas',
      route: '/history',
      icon: 'history'
    }
  ];

  redirectLink(e:string): void {console.log(e);
    this.actualTab = e; // Update the actualTab based on the link
    this.router.navigate([e]);
  }

  logout(): void {
    this.api.logout();
  }

}
