import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [IconComponent, CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() text: string = '';
  @Input() type: string = '';
  @Input() className: string = '';
  @Input() duration: number = 5000; // Duración en milisegundos (5 segundos por defecto)

  @Output() closeToast = new EventEmitter<void>();

  closeToastClick(): void {
    this.closeToast.emit();
  }

  ngOnInit() {
    setTimeout(() => {
      this.closeToast.emit();
    }, this.duration);
  }
}
