export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'tel'
  | 'file';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  id?: string;
  value?: any;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;

  options?: { label: string; value: any }[]; // para select y radio
}
