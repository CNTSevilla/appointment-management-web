import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/organism/header/header.component';
import { TitleComponent } from '../../../../shared/components/atoms/title/title.component';
import { DynamicFormComponent } from '../../../../shared/components/molecules/dynamic-form/dynamic-form.component';
import { LoginResponse } from '../../../../core/models/login-response.model';
import { FormField } from '../../../../core/models/form-field.model';
import { ToastData } from '../../../../core/models/toast.model';
import { Router } from '@angular/router';
import { Loader, TruckElectric } from 'lucide-angular';
import { LinkComponent } from '../../../../shared/components/atoms/link/link.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { LoaderComponent } from '../../../../shared/components/molecules/loader/loader.component';
import { ToastComponent } from '../../../../shared/components/molecules/toast/toast.component';
import { RequestService } from '../../../../core/services/request.service';
import { CommonModule, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../../../shared/components/atoms/icon/icon.component';

/**
 * Componente para gestionar la lista de usuarios internos (CNT) y externos (personas necesitadas).
 * Permite filtrar, paginar, crear, editar y eliminar usuarios de ambos tipos.
 */
@Component({
  selector: 'app-user-list',
  imports: [
    IconComponent,
    HeaderComponent,
    TitleComponent,
    ButtonComponent,
    DynamicFormComponent,
    LoaderComponent,
    ToastComponent,
    DatePipe,
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  /** Servicio inyectado para realizar peticiones HTTP */
  private readonly requestService = inject(RequestService);

  /** Lista completa de usuarios internos (CNT) */
  public internalUsers: any[] = [];

  /** Configuración de paginación para usuarios internos */
  public internalUsersPagination = { page: 0, size: 5 };

  /** Configuración de paginación para personas necesitadas */
  public personsInNeedPagination = { page: 0, size: 5 };

  /** Usuario seleccionado para edición o eliminación */
  public selectedUser = { id: -1, index: -1, type: '' };

  /** Total de usuarios internos */
  public totalInternalUsers: number = 0;

  /** Total de páginas para usuarios internos */
  public totalPagesInternalUsers: number = 0;

  /** Página actual de usuarios internos */
  public currentPageInternalUsers: number = 0;

  /** Lista completa de personas necesitadas */
  public personsInNeed: any[] = [];

  /** Total de personas necesitadas */
  public totalPersonsInNeed: number = 0;

  /** Total de páginas para personas necesitadas */
  public totalPagesPersonsInNeed: number = 0;

  /** Página actual de personas necesitadas */
  public currentPagePersonsInNeed: number = 0;

  /** Datos del toast para mostrar notificaciones */
  public toastData: ToastData | null = null;

  /** Texto del botón principal de filtrado */
  public filterButtonText = 'Filtrar';

  /** Texto del botón de retroceso (si aplica) */
  public backButtonText = '';

  /** Endpoint para obtener todos los usuarios internos */
  public readonly internalUsersEndpoint = '/helper/all';

  /** Endpoint para obtener todas las personas necesitadas */
  private readonly personsInNeedEndpoint = '/person_in_need/all';

  /** Estado de carga global */
  public isLoading = false;

  /** Indica si el formulario de persona necesitada está abierto */
  public isPersonInNeedFormOpen = false;

  /** Indica si el formulario de usuario interno está abierto */
  public isInternalUserFormOpen = false;

  /** Estado de los dropdowns para usuarios internos */
  public internalUserDropdownsOpen: boolean[] = [];

  /** Estado de los dropdowns para personas necesitadas */
  public personInNeedDropdownsOpen: boolean[] = [];

  /** Campos del formulario de filtrado */
  public filterFormFields: FormField[] = [
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

  /** Botón para añadir persona necesitada */
  public addPersonInNeedButtonText = 'Añadir usuario';

  /** Título del formulario de persona necesitada */
  public personInNeedFormTitle = 'Nuevo usuario externo';

  /** Subtítulo del formulario de persona necesitada */
  public personInNeedFormSubtitle = 'Rellena los datos para añadir un nuevo usuario externo';

  /** Método HTTP actual para persona necesitada (POST o PUT) */
  public personInNeedHttpMethod: 'POST' | 'PUT' = 'POST';

  /** Endpoint dinámico para persona necesitada */
  public personInNeedEndpoint = '/person_in_need';

  /** Campos del formulario de persona necesitada */
  public personInNeedFormFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Jesús Pérez', required: true, value: '' },
    { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'example@gmail.com', required: true, value: '' },
    { name: 'phone', label: 'Nº de teléfono', type: 'tel', placeholder: '000 000 000', required: true, value: '' },
  ];

  /** Botón para añadir usuario interno */
  public addInternalUserButtonText = 'Añadir usuario';

  /** Título del formulario de usuario interno */
  public internalUserFormTitle = 'Añadir nuevo usuario (CNT)';

  /** Subtítulo del formulario de usuario interno */
  public internalUserFormSubtitle = 'Rellena los datos para añadir un nuevo usuario interno (CNT)';

  /** Endpoint para usuarios internos */
  public readonly internalUserEndpoint = '/helper';

  /** Indica si el popup de confirmación está abierto */
  public isPopupOpen = false;

  /** Campos del formulario de usuario interno */
  public internalUserFormFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Jesús Pérez', required: true },
    { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'example@gmail.com', required: true },
    { name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'jesus.perez', required: true },
    { name: 'phone', label: 'Nº de teléfono', type: 'tel', placeholder: '000 000 000', required: true },
    {
      name: 'roles',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 'SYSTEM', label: 'Helper' },
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'USER', label: 'Usuario normal' },
      ],
    },
    { name: 'clearPassword', label: 'Contraseña', type: 'password', placeholder: '********', required: true, min: 6 }
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.loadUsers(this.internalUsersPagination, this.personsInNeedPagination);
  }

  /**
   * Cambia de página en la paginación.
   * @param isNext Indica si se avanza (true) o retrocede (false)
   * @param paginationObject Objeto de paginación a modificar
   * @param target Tipo de lista: 'internal' o 'persons'
   */
  public changePage(isNext: boolean, paginationObject: any, target: 'internal' | 'persons'): void {
    paginationObject.page = isNext ? paginationObject.page + 1 : paginationObject.page - 1;
    const isInternal = target === 'internal';
    this.loadUsers(
      isInternal ? paginationObject : this.internalUsersPagination,
      isInternal ? this.personsInNeedPagination : paginationObject
    );
  }

  /**
   * Carga simultáneamente usuarios internos y personas necesitadas con paginación.
   * @param internalPagination Paginación para usuarios internos
   * @param personsPagination Paginación para personas necesitadas
   */
  private loadUsers(internalPagination: any, personsPagination: any): void {
    forkJoin({
      internalUsers: this.requestService.get<any>(
        `${this.internalUsersEndpoint}?page=${internalPagination.page}&size=${internalPagination.size}`
      ),
      personsInNeed: this.requestService.get<any>(
        `${this.personsInNeedEndpoint}?page=${personsPagination.page}&size=${personsPagination.size}`
      )
    }).subscribe({
      next: ({ internalUsers, personsInNeed }) => {
        // Procesar usuarios internos
        this.internalUsers = internalUsers.content;
        this.totalInternalUsers = internalUsers.totalElements;
        this.totalPagesInternalUsers = internalUsers.totalPages;
        this.currentPageInternalUsers = internalUsers.number + 1;
        this.internalUsersPagination.page = internalUsers.number;

        // Procesar personas necesitadas
        this.personsInNeed = personsInNeed.content;
        this.totalPersonsInNeed = personsInNeed.totalElements;
        this.totalPagesPersonsInNeed = personsInNeed.totalPages;
        this.currentPagePersonsInNeed = personsInNeed.number + 1;
        this.personsInNeedPagination.page = personsInNeed.number;

        // Inicializar dropdowns
        this.internalUserDropdownsOpen = this.internalUsers.map(() => false);
        this.personInNeedDropdownsOpen = this.personsInNeed.map(() => false);

        console.log('Usuarios internos:', internalUsers);
        console.log('Personas necesitadas:', personsInNeed);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.showErrorToast('Error al cargar los usuarios. Inténtelo de nuevo.');
      }
    });
  }

  /**
   * Maneja el éxito al enviar el formulario de filtrado.
   * @param response Respuesta del servidor
   */
  public onFilterSubmitSuccess(response: any): void {
    console.log('Filtrado exitoso:', response);
  }

  /**
   * Maneja el éxito al crear o editar una persona necesitada.
   * @param response Datos del usuario creado/editado
   * @param method Método HTTP usado (POST o PUT)
   */
  public onPersonInNeedSubmitSuccess(response: any, method: 'POST' | 'PUT'): void {
    if (method === 'POST') {
      this.personsInNeed.push(response);
      this.totalPersonsInNeed += 1;
      this.resetPersonInNeedForm();
      this.personInNeedDropdownsOpen.push(false);
      this.isPersonInNeedFormOpen = false;
      this.showSuccessToast('Usuario externo añadido correctamente.');
    } else if (method === 'PUT') {
      const index = this.selectedUser.index;
      this.personsInNeed[index] = response;
      this.personInNeedEndpoint = '/person_in_need';
      this.resetPersonInNeedForm();
      this.personInNeedDropdownsOpen[index] = false;
      this.isPersonInNeedFormOpen = false;
      this.showSuccessToast('Usuario externo editado correctamente.');
    }
  }

  /**
   * Maneja el éxito al crear un usuario interno (CNT).
   * @param response Datos del usuario creado
   */
  public onInternalUserSubmitSuccess(response: any): void {
    const newUser = {
      id: response.id,
      name: response.name,
      email: response.email,
      phone: response.phone,
      username: response.username,
      role: response.roles,
      createdAt: response.createdAt
    };

    this.internalUsers.push(newUser);
    this.totalInternalUsers += 1;
    this.resetInternalUserForm();
    this.internalUserDropdownsOpen.push(false);
    this.isInternalUserFormOpen = false;
    this.showSuccessToast('Usuario (CNT) añadido correctamente.');
  }

  /**
   * Maneja errores generales en formularios.
   * @param error Error recibido
   */
  public onFormError(error: any): void {
    console.error('Error en el formulario:', error);
    this.showErrorToast('Error al procesar el formulario. Por favor, inténtelo de nuevo.');
  }

  /**
   * Abre o cierra el popup de confirmación.
   * @param userId ID del usuario (opcional)
   * @param index Índice en la lista (opcional)
   * @param type Tipo: 'PID' o 'Helper'
   */
  public toggleConfirmationPopup(userId: number = -1, index: number = -1, type: string = ''): void {
    this.isPopupOpen = !this.isPopupOpen;
    if (userId !== -1 && index !== -1) {
      this.selectedUser = { id: userId, index, type };
    } else {
      this.selectedUser = { id: -1, index: -1, type: '' };
    }
  }

  /**
   * Elimina un usuario (interno o externo).
   * @param id ID del usuario a eliminar
   * @param index Índice en la lista local
   * @param type 'PID' para persona necesitada, 'Helper' para usuario interno
   */
  public deleteUser(id: number, index: number, type: string): void {
    const endpoint = type === 'PID' ? `${this.personInNeedEndpoint}/${id}` : `${this.internalUserEndpoint}/${id}`;
    const successMessage = type === 'PID'
      ? 'Persona necesitada eliminada correctamente.'
      : 'Usuario (CNT) eliminado correctamente.';
    const errorMessage = type === 'PID'
      ? 'Error al eliminar la persona necesitada.'
      : 'Error al eliminar el usuario (CNT).';

    this.requestService.delete(endpoint).subscribe({
      next: () => {
        this.toggleConfirmationPopup();
        if (type === 'PID') {
          this.personsInNeed.splice(index, 1);
          this.totalPersonsInNeed -= 1;
          if (this.personsInNeed.length === 0 && this.currentPagePersonsInNeed > 1) {
            this.changePage(false, this.personsInNeedPagination, 'persons');
          }
        } else {
          this.internalUsers.splice(index, 1);
          this.totalInternalUsers -= 1;
          if (this.internalUsers.length === 0 && this.currentPageInternalUsers > 1) {
            this.changePage(false, this.internalUsersPagination, 'internal');
          }
        }
        this.showSuccessToast(successMessage);
      },
      error: (error) => {
        console.error(errorMessage, error);
        this.showErrorToast(`${errorMessage} Por favor, inténtelo de nuevo.`);
      }
    });
  }

  /**
   * Prepara el formulario para editar una persona necesitada.
   * @param person Datos de la persona
   * @param index Índice en la lista
   */
  public editPersonInNeed(person: any, index: number): void {
    this.selectedUser = { id: person.id, index, type: 'PID' };
    this.isPersonInNeedFormOpen = true;
    this.personInNeedEndpoint = `/person_in_need/${person.id}`;
    this.addPersonInNeedButtonText = 'Editar usuario';
    this.personInNeedFormTitle = 'Editar usuario externo';
    this.personInNeedFormSubtitle = 'Rellena los datos para editar la persona necesitada';
    this.personInNeedHttpMethod = 'PUT';
    this.personInNeedDropdownsOpen = this.personInNeedDropdownsOpen.map(() => false);

    this.personInNeedFormFields = this.personInNeedFormFields.map(field => ({
      ...field,
      value: this.getFieldValue(field.name, person)
    }));
  }

  /**
   * Obtiene el valor de un campo según el nombre y el objeto.
   * @param fieldName Nombre del campo
   * @param data Objeto con los datos
   * @returns Valor del campo
   */
  private getFieldValue(fieldName: string, data: any): string {
    switch (fieldName) {
      case 'name': return data.name || '';
      case 'email': return data.email || '';
      case 'phone': return data.phone || '';
      default: return '';
    }
  }

  /**
   * Controla el estado de carga global.
   * @param loading true para mostrar loader
   */
  public setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Alterna la visibilidad del formulario de persona necesitada.
   */
  public togglePersonInNeedForm(): void {
    this.addPersonInNeedButtonText = 'Añadir usuario';
    this.personInNeedFormTitle = 'Añadir usuario externo';
    this.personInNeedFormSubtitle = 'Rellena los datos para añadir la persona necesitada';
    this.personInNeedHttpMethod = 'POST';
    this.resetPersonInNeedForm();
    this.isPersonInNeedFormOpen = !this.isPersonInNeedFormOpen;
  }

  /**
   * Alterna la visibilidad del formulario de usuario interno.
   */
  public toggleInternalUserForm(): void {
    this.isInternalUserFormOpen = !this.isInternalUserFormOpen;
  }

  /**
   * Abre o cierra el dropdown de un usuario interno.
   * @param index Índice del dropdown
   */
  public toggleInternalUserDropdown(index: number): void {
    this.internalUserDropdownsOpen = this.internalUserDropdownsOpen.map((open, i) =>
      i === index ? !open : false
    );
  }

  /**
   * Abre o cierra el dropdown de una persona necesitada.
   * @param index Índice del dropdown
   */
  public togglePersonInNeedDropdown(index: number): void {
    this.personInNeedDropdownsOpen = this.personInNeedDropdownsOpen.map((open, i) =>
      i === index ? !open : false
    );
  }

  /**
   * Cierra el toast de notificación.
   */
  public closeToast(): void {
    this.toastData = null;
  }

  // === Métodos auxiliares para toast ===

  private showSuccessToast(message: string): void {
    this.toastData = { type: 'success', text: message, duration: 5000 };
  }

  private showErrorToast(message: string): void {
    this.toastData = { type: 'error', text: message, duration: 5000 };
  }

  // === Métodos de reinicio de formularios ===

  private resetPersonInNeedForm(): void {
    this.personInNeedFormFields = this.personInNeedFormFields.map(field => ({
      ...field,
      value: ''
    }));
  }

  private resetInternalUserForm(): void {
    this.internalUserFormFields = this.internalUserFormFields.map(field => ({
      ...field,
      value: ''
    }));
  }
}
