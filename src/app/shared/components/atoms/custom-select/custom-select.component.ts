import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getInitial } from '../../../../core/utils/string-utils';
import { getAvatarGradient, getBackgroundColor } from '../../../../core/utils/color-utils';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  getInitial = getInitial;
  getBackgroundColor = getBackgroundColor;
  getAvatarGradient = getAvatarGradient;

  @Input() options: Array<{ label: string; value: any }> = [];
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() userType: string | null = null;

  dropdownOpen = false;
  value: any = null;
  touched: boolean = false;

  onChange = (value: any) => { };
  onTouched = () => {};

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: any) {
    this.value = option.value;
    this.onChange(this.value);
    this.onTouched();
    this.touched = true;
    this.dropdownOpen = false;
  }

  get selectedLabel(): string {
    const found = this.options.find(o => o.value === this.value);
    return found ? found.label : this.placeholder;
  }

  // Métodos obligatorios de ControlValueAccessor
  writeValue(value: any): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
