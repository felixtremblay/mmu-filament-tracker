import { Component, computed, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FilamentDataService } from '../../services/filament-data.service';
import { FilamentType } from '../../models/filament.models';

@Component({
  selector: 'app-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './type-dialog.component.html',
  styles: [`
    .type-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 300px;
      margin-top: 16px;
    }
    
    .type-form .mat-mdc-form-field {
      min-height: 64px;
    }
    
    .type-form .mat-mdc-form-field .mat-mdc-form-field-flex {
      min-height: 56px;
    }
    
    .type-form .mat-mdc-form-field .mat-mdc-form-field-infix {
      padding-top: 14px;
      padding-bottom: 14px;
    }
    
    .type-form .mat-mdc-form-field.mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline .mat-mdc-form-field-outline-start,
    .type-form .mat-mdc-form-field.mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline .mat-mdc-form-field-outline-notch,
    .type-form .mat-mdc-form-field.mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline .mat-mdc-form-field-outline-end {
      min-height: 56px;
    }
    
    mat-dialog-content {
      padding: 20px 24px;
      padding-top: 48px;
    }
  `]
})
export class TypeDialogComponent {
  typeForm: FormGroup;
  
  fullName = computed(() => {
    const brand = this.typeForm.get('brand')?.value || '';
    const type = this.typeForm.get('type')?.value || '';
    return brand && type ? `${brand} ${type}` : '';
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type?: FilamentType }
  ) {
    this.typeForm = this.fb.group({
      brand: [data.type?.brand || '', Validators.required],
      type: [data.type?.type || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.typeForm.valid) {
      this.dialogRef.close(this.typeForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-filament-types',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './filament-types.component.html',
  styleUrls: ['./filament-types.component.scss']
})
export class FilamentTypesComponent {
  private dataService = inject(FilamentDataService);
  private dialog = inject(MatDialog);

  types = computed(() => this.dataService.filamentTypes());
  
  displayedColumns: string[] = ['brand', 'type', 'fullName', 'actions'];

  addType(): void {
    const dialogRef = this.dialog.open(TypeDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addFilamentType(result);
      }
    });
  }

  updateBrand(typeId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const brand = input.value.trim();
    if (brand) {
      this.dataService.updateFilamentType(typeId, { brand });
    } else {
      // Reset to original value if empty
      const originalType = this.types().find(t => t.id === typeId);
      if (originalType) {
        input.value = originalType.brand;
      }
    }
  }

  updateType(typeId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const type = input.value.trim();
    if (type) {
      this.dataService.updateFilamentType(typeId, { type });
    } else {
      // Reset to original value if empty
      const originalType = this.types().find(t => t.id === typeId);
      if (originalType) {
        input.value = originalType.type;
      }
    }
  }

  deleteType(typeId: string): void {
    if (confirm('Are you sure you want to delete this filament type? This will also remove all related colors and purge matrix entries.')) {
      this.dataService.deleteFilamentType(typeId);
    }
  }
}
