import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../../../core/models/form-field.model';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from '../../atoms/custom-select/custom-select.component';

@Component({
  selector: 'app-dynamic-input',
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './dynamic-input.component.html'
})
export class DynamicInputComponent {
  @Input() field!: FormField;
  @Input() form!: FormGroup;
  @Input() isFilterForm: boolean = false;

  get control() {
    return this.form.get(this.field.name);
  }

  currentDate = new Date();
  selectedStartDate: string | null = null; // en dd/MM/yyyy
  selectedEndDate: string | null = null;   // en dd/MM/yyyy
  isCalendarOpen = false;

  @ViewChild('datepickerContainer') datepickerContainer!: ElementRef;

  weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  calendarDays: { day: number; full: string }[] = [];

  ngOnInit() {
    this.renderCalendar();
  }

  ngOnChanges() {
    this.renderCalendar();
  }

  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  // -----------------------------
  // Funciones para formateo
  // -----------------------------
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private parseDate(str: string): Date {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // -----------------------------
  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray: { day: number; full: string }[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push({ day: 0, full: '' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      daysArray.push({
        day: i,
        full: this.formatDate(date) // <-- formato dd/MM/yyyy
      });
    }

    this.calendarDays = daysArray;
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
    this.renderCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    this.renderCalendar();
  }

  selectDate(day: { day: number; full: string }) {
    if (!day.full) return;

    if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
      this.selectedStartDate = day.full;
      this.selectedEndDate = null;
    } else if (this.parseDate(day.full) < this.parseDate(this.selectedStartDate)) {
      this.selectedEndDate = this.selectedStartDate;
      this.selectedStartDate = day.full;
    } else {
      this.selectedEndDate = day.full;
    }
  }

  isInRange(full: string): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) return false;
    const current = this.parseDate(full);
    return (
      current >= this.parseDate(this.selectedStartDate) &&
      current <= this.parseDate(this.selectedEndDate)
    );
  }

  apply() {
    if (this.selectedStartDate) {
      const result = this.selectedEndDate
        ? `${this.selectedStartDate} - ${this.selectedEndDate}`
        : this.selectedStartDate;
      this.control?.setValue(result);
    }
    this.isCalendarOpen = false;
  }

  cancel() {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.control?.setValue(null);
    this.isCalendarOpen = false;
  }
}
