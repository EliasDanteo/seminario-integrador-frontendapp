import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-casos-information-dialog',
  standalone: true,
  imports: [],
  templateUrl: './casos-information-dialog.component.html',
  styleUrl: './casos-information-dialog.component.css',
})
export class CasosInformationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
