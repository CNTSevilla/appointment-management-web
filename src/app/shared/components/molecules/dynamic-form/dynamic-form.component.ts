import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../../../core/models/form-field.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { LinkComponent } from "../../atoms/link/link.component";
import { ButtonComponent } from '../../atoms/button/button.component';
import { RequestService } from '../../../../core/services/request.service';


@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule, DynamicInputComponent, LinkComponent, ButtonComponent],
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FormField[] = [];
  @Input() endpointUrl: string = '';
  @Input() method: 'POST' | 'PUT' = 'POST';
  @Input() submitButton: string = '';
  @Input() backButton: string = '';
  @Input() className: string = '';
  @Input() titleForm: string = '';
  @Input() subtitleForm: string = '';
  @Input() isFilterForm: boolean = false;

  @Output() submitSuccess = new EventEmitter<any>();
  @Output() submitError = new EventEmitter<any>();
  @Output() loading = new EventEmitter<any>();

  form!: FormGroup;
  response: any;
  error: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private api: RequestService) { }

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.fields.forEach(field => {
        const validators = [];

        // Requerido
        if (field.required) {
          validators.push(Validators.required);
        }

        // Email
        if (field.type === 'email') {
          validators.push(Validators.email);
        }

        // Número: min, max
        if (field.type === 'number') {
          if (field.min !== undefined) {
            validators.push(Validators.min(+field.min));
          }
          if (field.max !== undefined) {
            validators.push(Validators.max(+field.max));
          }
        }

        // Longitud mínima/máxima (si usas step como longitud o deseas agregar luego)
      if (field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'password') {
          if (field.min !== undefined) {
            validators.push(Validators.minLength(+field.min));
          }
          if (field.max !== undefined) {
            validators.push(Validators.maxLength(+field.max));
          }
        }

        // Archivo obligatorio
        if (field.type === 'file' && field.required) {
          validators.push(Validators.required);
        }

        // Checkbox requerido (solo sentido si es "acepto condiciones", etc.)
        if (field.type === 'checkbox' && field.required) {
          validators.push(Validators.requiredTrue);
        }

        // Añadir control al formulario
        this.form.addControl(field.name, this.fb.control('', validators));

    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.endpointUrl) return;
    this.loading.emit(true); // 🔄 Inicia loader

    console.log(this.form)
    const formData = this.form.value;
    const request = this.method === 'POST'
      ? this.api.post(this.endpointUrl, formData)
      : this.api.put(this.endpointUrl, formData);

    request.subscribe({
      next: (response) => {
        this.submitSuccess.emit(response);
        this.loading.emit(false); // ✅ Finaliza loader
      },
      error: (error) => {
        this.submitError.emit(error);
        this.loading.emit(false); // ✅ Finaliza loader
      },

    });

  }
}
