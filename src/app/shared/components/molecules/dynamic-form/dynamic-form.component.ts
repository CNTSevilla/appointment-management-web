import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
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
  @Input() method: 'GET' | 'POST' | 'PUT' = 'POST';
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

  private buildFormFromFields(): void {
    this.form = this.fb.group({});
    const group: { [key: string]: any } = {};

    this.fields.forEach(field => {
      const validators = [];

      if (field.required) validators.push(Validators.required);
      if (field.type === 'tel') validators.push(Validators.pattern('^(\\+?\\d{2})?\\s?\\d{3}\\s?\\d{3}\\s?\\d{3}$'));
      if (field.type === 'email') validators.push(Validators.email);

      if (field.type === 'number') {
        if (field.min !== undefined) validators.push(Validators.min(+field.min));
        if (field.max !== undefined) validators.push(Validators.max(+field.max));
      }

      if (['text', 'textarea', 'email', 'password'].includes(field.type)) {
        if (field.min !== undefined) validators.push(Validators.minLength(+field.min));
        if (field.max !== undefined) validators.push(Validators.maxLength(+field.max));
      }

      if (field.type === 'file' && field.required) validators.push(Validators.required);
      if (field.type === 'checkbox' && field.required) validators.push(Validators.requiredTrue);

      this.form.addControl(field.name, this.fb.control('', validators));

      group[field.name] = this.fb.control(field.value || '', validators);


    });

    this.form = this.fb.group(group); // 🔁 Crea nuevo FormGroup limpio

  }

  ngOnInit(): void {
    this.buildFormFromFields();

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected in DynamicFormComponent:', changes);

    if (changes['fields']) {
      // Reconstruir el formulario cuando los campos cambian
      this.buildFormFromFields();
    }

    if (changes['titleForm']) {
      this.titleForm = changes['titleForm'].currentValue;
    }

    if (changes['subtitleForm']) {
      this.subtitleForm = changes['subtitleForm'].currentValue;
    }

    if (changes['submitButton']) {
      this.submitButton = changes['submitButton'].currentValue;
    }

    if (changes['backButton']) {
      this.backButton = changes['backButton'].currentValue;
    }

    if (changes['endpointUrl']) {
      this.endpointUrl = changes['endpointUrl'].currentValue;
    }

    if (changes['method']) {
      this.method = changes['method'].currentValue;
    }

    if (changes['className']) {
      this.className = changes['className'].currentValue;
    }
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
