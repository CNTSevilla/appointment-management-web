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
import { Pagination } from '../../../../core/models/pagination.model';
import { GETPaginationHelper, GETPaginationPIN, Helper, PIN, SelectedUser, UserJWT } from '../../../../core/models/users';
import { jwtDecode } from 'jwt-decode';
import { getInitial } from '../../../../core/utils/string-utils';
import { getBackgroundColor, getAvatarGradient } from '../../../../core/utils/color-utils';
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
  //
  getInitial = getInitial;
  getBackgroundColor = getBackgroundColor;
  getAvatarGradient = getAvatarGradient;

  /** Servicio inyectado para realizar peticiones HTTP */
  private readonly requestService = inject(RequestService);

  /** Lista completa de usuarios internos (CNT) */
  public helperUsers: Helper[] = [];

  /** Configuración de paginación para usuarios internos */
  public helperUsersPagination: Pagination = { page: 0, size: 5 };

  /** Configuración de paginación para personas necesitadas */
  public personsInNeedPagination: Pagination = { page: 0, size: 5 };

  /** Usuario seleccionado para edición o eliminación */
  public selectedUser: SelectedUser = { id: -1, index: -1, type: '' };

  /** Total de usuarios internos */
  public totalHelperUsers: number = 0;

  /** Total de páginas para usuarios internos */
  public totalPagesHelperUsers: number = 0;

  /** Página actual de usuarios internos */
  public currentPageHelperUsers: number = 0;

  /** Lista completa de personas necesitadas */
  public personsInNeed: PIN[] = [];

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
  public readonly helperUsersEndpoint = '/helper/all';

  /** Endpoint para obtener todas las personas necesitadas */
  private readonly personsInNeedEndpoint = '/person_in_need/all';

  /** Estado de carga global */
  public isLoading = false;

  /** Indica si el formulario de persona necesitada está abierto */
  public isPersonInNeedFormOpen = false;

  /** Indica si el formulario de usuario interno está abierto */
  public isHelperUserFormOpen = false;

  /** Estado de los dropdowns para usuarios internos */
  public helperUserDropdownsOpen: boolean[] = [];

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
  public addHelperUserButtonText = 'Añadir usuario';

  /** Título del formulario de usuario interno */
  public helperUserFormTitle = 'Añadir nuevo usuario (CNT)';

  /** Subtítulo del formulario de usuario interno */
  public helperUserFormSubtitle = 'Rellena los datos para añadir un nuevo usuario interno (CNT)';

  /** Endpoint para usuarios internos */
  public readonly helperUserEndpoint = '/helper';
  public readonly createHelperUserEndpoint = '/authentication/sign-up';

  /** Indica si el popup de confirmación está abierto */
  public isPopupOpen = false;

  /** Campos del formulario de usuario interno */
  public helperUserFormFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Jesús Pérez', required: true },
    { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'example@gmail.com', required: true },
    { name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'jesus.perez', required: true },
    { name: 'phone', label: 'Nº de teléfono', type: 'tel', placeholder: '000 000 000', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: '********', required: true, min: 6 }
  ];

  /** Estado de los dropdowns para personas necesitadas */
  public userInfo: UserJWT = {};

  public helperSortField: string = 'createdAt';
  public helperSortDirection: 'asc' | 'desc' = 'desc';

  public personsSortField: string = 'name';
  public personsSortDirection: 'asc' | 'desc' = 'desc';


  constructor(public router : Router) {
    const token = sessionStorage.getItem('token');
    if (token) this.userInfo = jwtDecode(token);
+   this.loadUsers(this.helperUsersPagination, this.personsInNeedPagination);
  }

  /**
   * Cambia de página en la paginación.
   * @param isNext Indica si se avanza (true) o retrocede (false)
   * @param paginationObject Objeto de paginación a modificar
   * @param target Tipo de lista: 'helper' o 'persons'
   */
  public changePage(isNext: boolean, paginationObject: Pagination, target: 'helper' | 'persons'): void {
    paginationObject.page = isNext ? paginationObject.page + 1 : paginationObject.page - 1;
    const isHelper = target === 'helper';
    this.loadUsers(
      isHelper ? paginationObject : this.helperUsersPagination,
      isHelper ? this.personsInNeedPagination : paginationObject
    );
  }

  /**
   * Carga simultáneamente usuarios internos y personas necesitadas con paginación.
   * @param helperPagination Paginación para usuarios internos
   * @param personsPagination Paginación para personas necesitadas
   */
  private loadUsers(helperPagination: Pagination, personsPagination: Pagination): void {
    const helperSort = `&sortField=${this.helperSortField}&sortDirection=${this.helperSortDirection}`;
    const personsSort = `&sortField=${this.personsSortField}&sortDirection=${this.personsSortDirection}`;

    forkJoin({
      helperUsers: this.requestService.get<GETPaginationHelper>(
        `${this.helperUsersEndpoint}?page=${helperPagination.page}&size=${helperPagination.size}${helperSort}`
      ),
      personsInNeed: this.requestService.get<GETPaginationPIN>(
        `${this.personsInNeedEndpoint}?page=${personsPagination.page}&size=${personsPagination.size}${personsSort}`
      )
    }).subscribe({
      next: ({ helperUsers, personsInNeed }) => {
        // Procesar usuarios internos
        this.helperUsers = helperUsers.content;
        console.log(this.helperUsers);
        console.log(this.userInfo)
        this.totalHelperUsers = helperUsers.totalElements;
        this.totalPagesHelperUsers = helperUsers.totalPages;
        this.currentPageHelperUsers = helperUsers.number + 1;
        this.helperUsersPagination.page = helperUsers.number;

        // Procesar personas necesitadas
        this.personsInNeed = personsInNeed.content;
        this.totalPersonsInNeed = personsInNeed.totalElements;
        this.totalPagesPersonsInNeed = personsInNeed.totalPages;
        this.currentPagePersonsInNeed = personsInNeed.number + 1;
        this.personsInNeedPagination.page = personsInNeed.number;

        // Inicializar dropdowns
        this.helperUserDropdownsOpen = this.helperUsers.map(() => false);
        this.personInNeedDropdownsOpen = this.personsInNeed.map(() => false);

        console.log('Usuarios internos:', helperUsers);
        console.log('Personas necesitadas:', personsInNeed);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error.error.localizedMessage);
        this.showErrorToast('Error al cargar los usuarios. Inténtelo de nuevo.');
        // 🧠 Comprueba si contiene "JWT expired" (puedes hacerlo más robusto con includes)
        if (!error.error.localizedMessage.includes('JWT expired')) {
          this.showErrorToast('Error al cargar los usuarios. Inténtelo de nuevo.');

        } else {
          this.showErrorToast('Usuario expirado, necesitas volver a iniciar sesión.');
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        }

      }
    });
  }

  public onSortHelper(column: string): void {
    if (this.helperSortField === column) {
      this.helperSortDirection = this.helperSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.helperSortField = column;
      this.helperSortDirection = 'asc';
    }

    this.helperUsersPagination.page = 0;
    this.loadUsers(this.helperUsersPagination, this.personsInNeedPagination);
  }

  public onSortPerson(column: string): void {
    if (this.personsSortField === column) {
      this.personsSortDirection = this.personsSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.personsSortField = column;
      this.personsSortDirection = 'asc';
    }

    this.personsInNeedPagination.page = 0;
    this.loadUsers(this.helperUsersPagination, this.personsInNeedPagination);
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
  public onHelperUserSubmitSuccess(response: Helper): void {
    const newUser: Helper = {
      id: response.id,
      name: response.name,
      email: response.email,
      phone: response.phone,
      username: response.username,
      role: response.roles,
      createdAt: response.createdAt
    };

    this.helperUsers.push(newUser);
    this.totalHelperUsers += 1;
    this.resetHelperUserForm();
    this.helperUserDropdownsOpen.push(false);
    this.isHelperUserFormOpen = false;
    this.showSuccessToast('Usuario (CNT) añadido correctamente.');
  }

  /**
   * Maneja errores generales en formularios.
   * @param error Error recibido
   */
  public onFormError(error: any): void {
    let msg = error.status === 409 ? 'Ya existe un usuario interno con este email o este nombre de usuario' : 'Error al procesar el formulario. Por favor, inténtelo de nuevo.' ;

    console.error('Error en el formulario:', error);
    this.resetHelperUserForm();
    this.isHelperUserFormOpen = false;

    this.showErrorToast(msg);

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
    const endpoint = type === 'PID' ? `${this.personInNeedEndpoint}/${id}` : `${this.helperUserEndpoint}/${id}`;
    const successMessage = type === 'PID'
      ? 'Usuario externo eliminado correctamente.'
      : 'Usuario (CNT) eliminado correctamente.';
    const errorMessage = type === 'PID'
      ? 'Error al eliminar el usuario externo.'
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
          this.helperUsers.splice(index, 1);
          this.totalHelperUsers -= 1;
          if (this.helperUsers.length === 0 && this.currentPageHelperUsers > 1) {
            this.changePage(false, this.helperUsersPagination, 'helper');
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
  public editPersonInNeed(person: PIN, index: number): void {
    this.selectedUser = { id: person.id || 0, index, type: 'PID' };
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
  private getFieldValue(fieldName: string, data: PIN): string {
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
    this.personInNeedEndpoint = '/person_in_need';
    this.isPersonInNeedFormOpen = !this.isPersonInNeedFormOpen;
  }

  /**
   * Alterna la visibilidad del formulario de usuario interno.
   */
  public toggleHelperUserForm(): void {
    this.isHelperUserFormOpen = !this.isHelperUserFormOpen;
  }

  /**
   * Abre o cierra el dropdown de un usuario interno.
   * @param index Índice del dropdown
   */
  public toggleHelperUserDropdown(index: number): void {
    this.helperUserDropdownsOpen = this.helperUserDropdownsOpen.map((open, i) =>
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

  private resetHelperUserForm(): void {
    this.helperUserFormFields = this.helperUserFormFields.map(field => ({
      ...field,
      value: ''
    }));
  }
}
