import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/organism/header/header.component';
import { TitleComponent } from '../../../../shared/components/atoms/title/title.component';
import { DynamicFormComponent } from '../../../../shared/components/molecules/dynamic-form/dynamic-form.component';
import { LoginResponse } from '../../../../core/models/login-response.model';
import { FormField } from '../../../../core/models/form-field.model';
import { ToastData } from '../../../../core/models/toast.model';
import { Router } from '@angular/router';
import { TruckElectric } from 'lucide-angular';
import { LinkComponent } from '../../../../shared/components/atoms/link/link.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-user-list',
  imports: [HeaderComponent, TitleComponent, ButtonComponent, DynamicFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  constructor(private router: Router) {}

  toastData: ToastData | null = null;
  loginButton = 'Filtrar';
  backButton = '';
  loginEndpoint = '/appointment';
  isLoading = false;
  isFormOpen = false;
  dropdownOpen: boolean[] = [true, false, false];

  loginFields: FormField[] = [
    {
      name: 'filter-text',
      label: 'Nombre, correo, telf...',
      type: 'text',
      placeholder: 'Buscar...',
      required: true,
    },
    {
      name: 'filter-role',
      label: 'Tabla',
      type: 'select',
      required: false,
      options: [
        { value: 'CNT', label: 'Usuarios (CNT)' },
        { value: 'External', label: 'Usuarios externos' },
      ],
    },
  ];


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

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
  }

  openDropdown(index: number): void {
    this.dropdownOpen = this.dropdownOpen.map((_, i) => i === index ? !this.dropdownOpen[i] : false);
  }
}
