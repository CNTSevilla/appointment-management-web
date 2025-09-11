import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../../../core/models/form-field.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-input.component.html'
})
export class DynamicInputComponent {
  @Input() field!: FormField;
  @Input() form!: FormGroup;

  get control() {
    return this.form.get(this.field.name);
  }
}
