import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-input',
  imports: [
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
}
