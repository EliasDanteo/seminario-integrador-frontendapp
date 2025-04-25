import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InformesService } from '../../core/services/informes.service.js';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-informes-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './informes-dialog.component.html',
  styleUrl: './informes-dialog.component.css',
})
export class InformesDialogComponent implements OnInit {
  informeForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { informeType: string },
    private informesService: InformesService
  ) {
    this.informeForm = new FormGroup({
      mes: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}
}
