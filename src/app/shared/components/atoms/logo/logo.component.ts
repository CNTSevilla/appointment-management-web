import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

  @Input() url: string = 'assets/images/logo.png';
  @Input() alt: string = 'Logo';
  @Input() link: string = '';
  @Input() className: string = '';

  constructor() {
  }

}
