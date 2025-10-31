import { Component, Input } from '@angular/core';
import { IconComponent } from "../icon/icon.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [IconComponent, CommonModule, RouterModule],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent {
  @Input() icon: string = '';
  @Input() target: string = '_self';
  @Input() rel: string = 'noopener noreferrer';
  @Input() url: string = '#';
  @Input() text: string = 'Logo';
  @Input() className: string = '';
}
