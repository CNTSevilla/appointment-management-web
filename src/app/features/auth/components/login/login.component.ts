import { Component } from '@angular/core';
import { LogoComponent } from '../../../../shared/components/atoms/logo/logo.component';
import { TitleComponent } from '../../../../shared/components/atoms/title/title.component';
import { FormField } from '../../../../core/models/form-field.model';
import { DynamicFormComponent } from '../../../../shared/components/molecules/dynamic-form/dynamic-form.component';
import { LoginResponse } from '../../../../core/models/login-response.model';
import { LoaderComponent } from '../../../../shared/components/molecules/loader/loader.component';
import { ToastComponent } from '../../../../shared/components/molecules/toast/toast.component';
import { ToastData } from '../../../../core/models/toast.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LogoComponent, TitleComponent, DynamicFormComponent, LoaderComponent, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router ) {}

  loginFields: FormField[] = [
    {
      name: 'username',
      label: 'Usuario',
      type: 'text',
      required: true,
      min: 6,
      max: 50,
      placeholder: 'Ingrese su usuario'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      placeholder: '********'
    },
    /*{
      name: 'age',
      label: 'Edad',
      type: 'number',
      required: false,
      placeholder: '18',
      min: 0,
      max: 120
    },
    {
      name: 'birthdate',
      label: 'Fecha de nacimiento',
      type: 'date',
      required: false
    },
    {
      name: 'appointment',
      label: 'Cita médica',
      type: 'datetime-local'
    },
    {
      name: 'alarm',
      label: 'Hora de alarma',
      type: 'time'
    },
    {
      name: 'bio',
      label: 'Biografía',
      type: 'textarea',
      placeholder: 'Escribe algo sobre ti...'
    },
    {
      name: 'country',
      label: 'País',
      type: 'select',
      options: [
        { value: 'es', label: 'España' },
        { value: 'mx', label: 'México' },
        { value: 'ar', label: 'Argentina' }
      ]
    },
    {
      name: 'hobbies',
      label: 'Pasatiempos',
      type: 'select',
      multiple: true,
      options: [
        { value: 'leer', label: 'Leer' },
        { value: 'deporte', label: 'Deporte' },
        { value: 'musica', label: 'Música' }
      ]
    },
    {
      name: 'terms',
      label: 'Acepto los términos',
      type: 'checkbox'
    },
    {
      name: 'gender',
      label: 'Género',
      type: 'radio',
      options: [
        { value: 'm', label: 'Masculino' },
        { value: 'f', label: 'Femenino' },
        { value: 'o', label: 'Otro' }
      ]
    },
    {
      name: 'documents',
      label: 'Documentos',
      type: 'file',
      required: true,
      multiple: true
    }*/
  ];
  toastData: ToastData | null = null;
  loginButton = 'Iniciar sesión';
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
    let text = "";
    text = error.status === 409 ? 'Su nombre de usuario o email ya está en uso por otro usuario.' : 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.';

    // 1. Mostrar un mensaje de error al usuario
    this.toastData = { type: 'error', text: 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.', duration: 5000 };

  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  closeToast(): void {
    this.toastData = null;
  }
}

