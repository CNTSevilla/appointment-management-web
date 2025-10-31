import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon: string = ''; // nombre del ícono si se quiere mostrar
  @Input() text: string = 'Enviar'; // texto del botón
  @Input() className: string = ''; // clases CSS adicionales
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() form: string = '';
}
