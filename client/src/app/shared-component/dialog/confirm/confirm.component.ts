import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
  dialogRef = inject(MatDialogRef<ConfirmComponent>);
  config = inject<
    | {
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
      }
    | undefined
  >(MAT_DIALOG_DATA);
}
