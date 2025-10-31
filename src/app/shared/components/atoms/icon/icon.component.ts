import { Component, Input } from '@angular/core';
import { LucideAngularModule, FileIcon, LogOut, ArrowRight, House, Book, User, History, Check, X, ShieldAlert } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  imports: [LucideAngularModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {

  @Input() icon: string = '';
  @Input() className: string = '';

  readonly FileIcon = FileIcon;
  readonly LogOutIcon = LogOut;
  readonly ArrowRightIcon = ArrowRight;
  readonly HouseIcon = House;
  readonly BookIcon = Book;
  readonly UserIcon = User;
  readonly HistoryIcon = History;
  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly ShieldAlertIcon = ShieldAlert;
}
