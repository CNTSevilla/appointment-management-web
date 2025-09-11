import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shortinfo',
  imports: [CommonModule],
  templateUrl: './shortinfo.component.html',
  styleUrl: './shortinfo.component.scss'
})
export class ShortinfoComponent {
  @Input() name: string = 'John Doe';
  @Input() email: string = 'jhondoe@gmail.com';
  @Input() className: string = '';

}
