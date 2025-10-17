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


@Component({
  selector: 'app-user-list',
  imports: [IconComponent, HeaderComponent, TitleComponent, ButtonComponent, DynamicFormComponent, LoaderComponent, ToastComponent,  DatePipe, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  protected request = inject(RequestService)
  public helpers: any = [];
  public pagedHelpers: any = {
    page: 0,
    size: 5
  }
  public totalItemsHelpers: number = 0;
  public totalPagesHelpers: number = 0;
  public currentPageHelpers: number = 0;

  public pagedPersonsInNeeds: any = {
    page: 0,
    size: 5
  }
  public totalItemsPersonsInNeeds: number = 0;
  public totalPagesPersonsInNeeds: number = 0;
  public currentPagePersonsInNeeds: number = 0;
  public personsInNeed: any = []; // Nueva propiedad para almacenar las personas necesitadas

  public toastData: ToastData | null = null;
  public userListButton = 'Filtrar';
  public backButton = '';
  public userListEndpoint = '/helper/all';
  public personInNeedEndpoint = '/person_in_need/all'; // Nuevo endpoint para personas necesitadas
  public isLoading = false;
  public isFormOpenPIN = false;
  public isFormOpenHelpers = false;
  public dropdownOpenHelpers: boolean[] = [];
  public dropdownOpenPIN: boolean[] = [];
  public userListFields: FormField[] = [
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

  addButton = 'Añadir usuario';
  PINEndpoint = '/person_in_need';
  public PINFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Jesús Pérez',
      required: true,
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'example@gmail.com',
      required: true,
    },
    {
      name: 'phone',
      label: 'Nº de teléfono',
      type: 'tel',
      placeholder: '000 000 000',
      required: true,
    },
  ];

  HelperEndpoint = '/helper';
  public HelperFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Jesús Pérez',
      required: true,
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'example@gmail.com',
      required: true,
    },
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text',
      placeholder: 'jesus.perez',
      required: true,
    },
    {
      name: 'phone',
      label: 'Nº de teléfono',
      type: 'tel',
      placeholder: '000 000 000',
      required: true,
    },
    {
      name: 'roles',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 'HELPER', label: 'Helper' },
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'USER', label: 'Usuario normal' },
      ],
    }
  ];

  constructor(private http: HttpClient, private router: Router) {
    this.getUsers(this.pagedHelpers, this.pagedPersonsInNeeds)

  }

  pageMove(isUp:boolean, pagedObject:any, target:string):void {

    isUp ? pagedObject.page += 1 : pagedObject.page -= 1

    const isHelpers = target === 'helpers';
    this.getUsers(
      isHelpers ? pagedObject : this.pagedHelpers,
      isHelpers ? this.pagedPersonsInNeeds : pagedObject
    );
  }

  getUsers(pagedHelpers: any, pagedPersonsInNeeds: any): void {
    forkJoin({
      helpers: this.request.get<any>(this.userListEndpoint + '?page='+pagedHelpers.page+'&size='+pagedHelpers.size),
      personsInNeed: this.request.get<any>(this.personInNeedEndpoint + '?page=' + pagedPersonsInNeeds.page + '&size=' + pagedPersonsInNeeds.size)
    }).subscribe({
      next: ({ helpers, personsInNeed }) => {

        // Procesar respuesta de helpers
        this.helpers = helpers.content;
        this.totalItemsHelpers = helpers.totalElements;
        this.totalPagesHelpers = helpers.totalPages;
        this.currentPageHelpers = helpers.number + 1;
        this.pagedHelpers.page = helpers.number;

        // Procesar respuesta de personas necesitadas
        this.personsInNeed = personsInNeed.content; // Asegúrate de tener esta propiedad en tu clase
        this.totalItemsPersonsInNeeds = personsInNeed.totalElements;
        this.totalPagesPersonsInNeeds = personsInNeed.totalPages;
        this.currentPagePersonsInNeeds = personsInNeed.number + 1;
        this.pagedPersonsInNeeds.page = personsInNeed.number;

        this.dropdownOpenHelpers = this.helpers.map(() => false);
        this.dropdownOpenPIN = this.personsInNeed.map(() => false);


        console.log('Helpers:', helpers);
        console.log('Persons in Need:', personsInNeed);
      },
      error: (error) => {
        console.error('Error en las solicitudes paralelas:', error);
      }
    });
  }


  onSubmitSuccess(response: any): void {
    console.log('User List exitoso:', response);
  }

  onSubmitError(error: any): void {
    console.error('Error en el login:', error);
    // 1. Mostrar un mensaje de error al usuario
    this.toastData = { type: 'error', text: 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.', duration: 5000 };

  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  toggleFormPIN(): void {
    this.isFormOpenPIN = !this.isFormOpenPIN;
  }

  toggleFormHelpers(): void {
    this.isFormOpenHelpers = !this.isFormOpenHelpers;
  }

  openDropdownHelpers(index: number): void {
    this.dropdownOpenHelpers = this.dropdownOpenHelpers.map((_, i) => i === index ? !this.dropdownOpenHelpers[i] : false);
  }

  openDropdownPIN(index: number): void {
    this.dropdownOpenPIN = this.dropdownOpenPIN.map((_, i) => i === index ? !this.dropdownOpenPIN[i] : false);
  }

  closeToast(): void {
    this.toastData = null;
  }
}
