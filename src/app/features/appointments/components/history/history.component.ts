import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/organism/header/header.component';
import { LoginResponse } from '../../../../core/models/login-response.model';
import { ToastData } from '../../../../core/models/toast.model';
import { FormField } from '../../../../core/models/form-field.model';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../../../shared/components/molecules/dynamic-form/dynamic-form.component';
import { TitleComponent } from '../../../../shared/components/atoms/title/title.component';

@Component({
  selector: 'app-history',
  imports: [HeaderComponent, DynamicFormComponent, TitleComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  constructor(private router: Router ) {}

  loginFields: FormField[] = [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      placeholder: 'Cita de Juan'
    },
    {
      name: 'priority',
      label: 'Prioridad',
      type: 'select',
      options: [
        { value: 'es', label: 'Alta' },
        { value: 'mx', label: 'Media' },
        { value: 'ar', label: 'Baja' }
      ]
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'es', label: 'Completado' },
        { value: 'mx', label: 'En proceso' },
        { value: 'ar', label: 'Por hacer' }
      ]
    },
    {
      name: 'helper',
      label: 'Usuario asignado',
      type: 'select',
      options: [
        { value: 'es', label: 'Alexis' },
        { value: 'mx', label: 'Ruben' },
        { value: 'ar', label: 'Jesús' }
      ]
    },
    {
      name: 'person_in_need',
      label: 'Persona que necesita ayuda',
      type: 'select',
      options: [
        { value: 'es', label: 'Persona1' },
        { value: 'mx', label: 'Persona2' },
        { value: 'ar', label: 'Persona3' }
      ]
    },
  ];
  toastData: ToastData | null = null;
  loginButton = 'Filtrar';
  backButton = '';
  loginEndpoint = '/authentication/sign-in';
  isLoading = false;

  onLoginSuccess(response: LoginResponse): void {
    console.log('Login exitoso:', response);
    // 1. Guardar el token en el sessionStorage
    sessionStorage.setItem('token', response.token);
    // 2. Redirigir a la home
    this.router.navigate(['/']);
  }

  onLoginError(error: any): void {
    console.error('Error en el login:', error);
    // 1. Mostrar un mensaje de error al usuario
    this.toastData = { type: 'error', text: 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.', duration: 5000 };

  }
}
