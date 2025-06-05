import { Component, computed, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FilamentDataService } from '../../services/filament-data.service';
import { FilamentColor } from '../../models/filament.models';

@Component({
  selector: 'app-color-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./filament-colors.component.scss']
})
export class ColorDialogComponent {
  colorForm: FormGroup;
  private dataService = inject(FilamentDataService);
  filamentTypes = computed(() => this.dataService.filamentTypes());

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ColorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { color?: FilamentColor }
  ) {
    this.colorForm = this.fb.group({
      filamentTypeId: [data.color?.filamentTypeId || '', Validators.required],
      colorName: [data.color?.colorName || '', Validators.required],
      color: [data.color?.color || '#FF0000', Validators.required]
    });
  }

  onSave(): void {
    if (this.colorForm.valid) {
      this.dialogRef.close(this.colorForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-filament-colors',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './filament-colors.component.html',
  styleUrls: ['./filament-colors.component.scss']
})
export class FilamentColorsComponent {
  private dataService = inject(FilamentDataService);
  private dialog = inject(MatDialog);

  colors = computed(() => this.dataService.filamentColors());
  filamentTypes = computed(() => this.dataService.filamentTypes());
  
  // Sorted colors by filament type alphabetically
  sortedColors = computed(() => {
    return this.colors().sort((a, b) => {
      const typeA = a.filamentType?.fullName || `${a.filamentType?.brand} ${a.filamentType?.type}` || '';
      const typeB = b.filamentType?.fullName || `${b.filamentType?.brand} ${b.filamentType?.type}` || '';
      return typeA.localeCompare(typeB);
    });
  });
  
  displayedColumns: string[] = ['filamentType', 'colorName', 'color', 'actions'];

  addColor(): void {
    const dialogRef = this.dialog.open(ColorDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addFilamentColor(result);
      }
    });
  }

  updateFilamentType(colorId: string, event: MatSelectChange): void {
    const filamentTypeId = event.value;
    this.dataService.updateFilamentColor(colorId, { filamentTypeId });
  }

  updateColorName(colorId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const colorName = input.value.trim();
    if (colorName) {
      this.dataService.updateFilamentColor(colorId, { colorName });
    } else {
      // Reset to original value if empty
      const originalColor = this.colors().find(c => c.id === colorId);
      if (originalColor) {
        input.value = originalColor.colorName;
      }
    }
  }

  updateColor(colorId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    this.dataService.updateFilamentColor(colorId, { color });
  }

  deleteColor(colorId: string): void {
    if (confirm('Are you sure you want to delete this color? This will also remove all related purge matrix entries.')) {
      this.dataService.deleteFilamentColor(colorId);
    }
  }

  openColorPicker(colorId: string): void {
    const colorInput = document.querySelector(`#colorInput_${colorId}`) as HTMLInputElement;
    if (colorInput) {
      colorInput.click();
    }
  }
}
