import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/organism/header/header.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { DynamicFormComponent } from '../../../../shared/components/molecules/dynamic-form/dynamic-form.component';
import { LoginResponse } from '../../../../core/models/login-response.model';
import { ToastData } from '../../../../core/models/toast.model';
import { FormField } from '../../../../core/models/form-field.model';
import { Router } from '@angular/router';
import { TitleComponent } from '../../../../shared/components/atoms/title/title.component';
import { IconComponent } from '../../../../shared/components/atoms/icon/icon.component';

@Component({
  selector: 'app-appointment',
  imports: [HeaderComponent, IconComponent, ButtonComponent, DynamicFormComponent, TitleComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent {
  constructor(private router: Router ) {}

  toastData: ToastData | null = null;
  addButton = 'Filtrar citas';
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
  filterFields: FormField[] = [
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
      withUserImage: true,
      userType: 'helper',
      options: [
        { value: '1', label: 'Alexis' },
        { value: '2', label: 'Jesús' },
        { value: '3', label: 'Rubén' },
        { value: '4', label: 'Angel' },
      ],
    },
    {
      name: 'person_in_need_id',
      label: 'Persona necesitada',
      type: 'select',
      required: true,
      withUserImage: true,
      userType: 'person_in_need',
      options: [
        { value: '1', label: 'Persona1' },
        { value: '2', label: 'Persona2' },
        { value: '3', label: 'Persona3' },
        { value: '4', label: 'Persona4' },
      ],
    }
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
