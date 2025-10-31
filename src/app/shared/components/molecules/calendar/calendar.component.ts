import { Component } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { ToastData } from '../../../../core/models/toast.model';
import { FormField } from '../../../../core/models/form-field.model';
import { LoginResponse } from '../../../../core/models/login-response.model';
import { LoaderComponent } from '../loader/loader.component';
import { ToastComponent } from '../toast/toast.component';
import { Router } from '@angular/router';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-calendar',
  imports: [ButtonComponent, DynamicFormComponent, LoaderComponent, IconComponent, ToastComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  constructor(private router: Router) {}

  toastData: ToastData | null = null;
  addButton = 'Añadir cita';
  backButton = '';
  appointmentEndpoint = '/appointment';
  isLoading = false;
  isFormOpen = false;
  appointmentsFields: FormField[] = [
    {
      name: 'date_time',
      label: 'Fecha',
      type: 'datetime-local',
      required: true,
    },
    {
      name: 'priority',
      label: 'Prioridad',
      type: 'select',
      required: true,
      options: [
        { value: 'HIGH', label: 'Alta' },
        { value: 'LOW', label: 'Baja' },
        { value: 'MEDIUM', label: 'Media' },
      ],
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'ACTIVE', label: 'Activo' },
        { value: 'ARCHIVED', label: 'Archivado' },
        { value: 'COMPLETED', label: 'Completado' },
        { value: 'DEFERRED', label: 'Aplazado' },
      ],
    },
    {
      name: 'helper_id',
      label: 'Ayudante asignado',
      type: 'select',
      required: true,
      options: [
        { value: 'ACTIVE', label: 'Alexis' },
        { value: 'ARCHIVED', label: 'Jesús' },
        { value: 'COMPLETED', label: 'Rubén' },
        { value: 'DEFERRED', label: 'Angel' },
      ],
    },
    {
      name: 'person_in_need_id',
      label: 'Persona necesitada',
      type: 'select',
      required: true,
      options: [
        { value: 'ACTIVE', label: 'Persona1' },
        { value: 'ARCHIVED', label: 'Persona2' },
        { value: 'COMPLETED', label: 'Persona3' },
        { value: 'DEFERRED', label: 'Persona4' },
      ],
    },
    {
      name: 'comment',
      label: 'Comentario inicial',
      type: 'textarea',
      required: false,
      placeholder: 'Escribe un comentario...'
    },
  ];


  onSubmitSuccess(response: LoginResponse): void {
    console.log('Submit exitoso:', response);
  }

  onSubmitError(error: any): void {
    console.error('Error en el login:', error);
    // 1. Mostrar un mensaje de error al usuario
    this.toastData = { type: 'error', text: 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.', duration: 5000 };

  }

  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  closeToast(): void {
    this.toastData = null;
  }
}
