import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../shared/bottom-sheet/bottom-sheet.component.js';
import { BottomSheetConfig } from '../interfaces/IBottom-sheet.interface.js';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  constructor(private bottomSheet: MatBottomSheet) {}

  open<T>(config: BottomSheetConfig<T>): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: config,
      panelClass: 'custom-bottom-sheet',
    });
  }
}
