import { Component, computed, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilamentDataService } from '../../services/filament-data.service';
import { FilamentColor, FilamentType } from '../../models/filament.models';

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
    MatDialogModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./filament-colors.component.scss']
})
export class ColorDialogComponent {
  colorForm: FormGroup;
  filamentTypeControl = new FormControl<FilamentType | null>(null, Validators.required);
  private dataService = inject(FilamentDataService);
  filamentTypes = computed(() => this.dataService.filamentTypes());

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ColorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { color?: FilamentColor }
  ) {
    // Initialize the autocomplete control with existing value if editing
    if (data.color?.filamentTypeId) {
      const existingType = this.filamentTypes().find(type => type.id === data.color!.filamentTypeId);
      this.filamentTypeControl.setValue(existingType || null);
    }

    this.colorForm = this.fb.group({
      filamentTypeId: [data.color?.filamentTypeId || '', Validators.required],
      colorName: [data.color?.colorName || '', Validators.required],
      color: [data.color?.color || '#FF0000', Validators.required]
    });

    // Update the form when autocomplete selection changes
    this.filamentTypeControl.valueChanges.subscribe(type => {
      this.colorForm.patchValue({
        filamentTypeId: type?.id || ''
      });
    });
  }

  // Display function for autocomplete
  displayFilamentTypeFn = (type: FilamentType | null): string => {
    return type ? (type.fullName || `${type.brand} ${type.type}`) : '';
  };

  // Get filtered filament types for autocomplete with search functionality
  getFilteredFilamentTypes(): FilamentType[] {
    const inputValue = this.filamentTypeControl.value;
    
    // If the input value is a FilamentType object, don't filter (user selected from dropdown)
    if (inputValue && typeof inputValue === 'object' && 'id' in inputValue) {
      return this.filamentTypes();
    }
    
    // If it's a string, filter by that string
    const searchTerm = (typeof inputValue === 'string' ? inputValue : '').toLowerCase();
    const availableTypes = this.filamentTypes();
    
    if (!searchTerm) {
      return availableTypes;
    }
    
    return availableTypes.filter(type => {
      const displayName = this.displayFilamentTypeFn(type).toLowerCase();
      return displayName.includes(searchTerm) ||
             type.brand.toLowerCase().includes(searchTerm) ||
             type.type.toLowerCase().includes(searchTerm);
    });
  }

  // Clear the filament type selection
  clearFilamentType(): void {
    this.filamentTypeControl.setValue(null);
  }

  onSave(): void {
    if (this.colorForm.valid && this.filamentTypeControl.valid) {
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
      data: {},
      autoFocus: false
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
