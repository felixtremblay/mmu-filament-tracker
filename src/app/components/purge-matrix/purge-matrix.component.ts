import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilamentDataService } from '../../services/filament-data.service';
import { FilamentColor } from '../../models/filament.models';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-purge-matrix',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './purge-matrix.component.html',
  styleUrls: ['./purge-matrix.component.scss']
})
export class PurgeMatrixComponent implements OnInit {
  private dataService = inject(FilamentDataService);
  
  // Existing computed properties
  colors = computed(() => this.dataService.filamentColors());

  // New filter state
  showAllFilaments = signal(true);
  selectedSlots = signal<(string | null)[]>([null, null, null, null, null]); // 5 MMU slots
  
  // Form controls for autocomplete inputs
  slotControls = [
    new FormControl(''),
    new FormControl(''),
    new FormControl(''),
    new FormControl(''),
    new FormControl('')
  ];

  // Filtered options for each slot based on input value
  filteredOptions: Observable<FilamentColor[]>[] = [];

  ngOnInit(): void {
    // Initialize filtered options for each slot
    this.filteredOptions = this.slotControls.map((control, slotIndex) =>
      control.valueChanges.pipe(
        startWith(''),
        map(value => {
          const inputValue = typeof value === 'string' ? value : '';
          return this.getFilteredColorsForSlot(slotIndex, inputValue);
        })
      )
    );
  }
  
  // Computed property for filtered colors based on slot selection with slot numbers
  displayColors = computed(() => {
    if (this.showAllFilaments()) {
      return this.colors().map((color, index) => ({
        ...color,
        slotNumber: index + 1
      }));
    }
    
    const slots = this.selectedSlots();
    const allColors = this.colors();
    const filteredColors: (FilamentColor & { slotNumber: number })[] = [];
    
    // Add colors in slot order, skipping null slots
    slots.forEach((slotColorId, slotIndex) => {
      if (slotColorId) {
        const color = allColors.find(c => c.id === slotColorId);
        if (color) {
          filteredColors.push({
            ...color,
            slotNumber: slotIndex + 1
          });
        }
      }
    });
    
    return filteredColors;
  });

  // Available colors for slot dropdowns (excluding already selected)
  getAvailableColorsForSlot(slotIndex: number) {
    const slots = this.selectedSlots();
    const selectedIds = slots.filter((id, index) => id && index !== slotIndex);
    return this.colors().filter(color => !selectedIds.includes(color.id));
  }

  // Filter colors based on autocomplete input
  getFilteredColorsForSlot(slotIndex: number, inputValue?: string) {
    const searchValue = inputValue !== undefined ? inputValue.toLowerCase() : this.slotControls[slotIndex].value?.toLowerCase() || '';
    const availableColors = this.getAvailableColorsForSlot(slotIndex);
    
    if (!searchValue) {
      return availableColors;
    }
    
    return availableColors.filter(color => {
      const tooltip = this.getFilamentTooltip(color).toLowerCase();
      return tooltip.includes(searchValue);
    });
  }

  // Handle autocomplete selection
  onSlotSelection(slotIndex: number, color: FilamentColor | null): void {
    this.updateSlot(slotIndex, color?.id || null);
    if (color) {
      this.slotControls[slotIndex].setValue(this.getFilamentTooltip(color));
    } else {
      this.slotControls[slotIndex].setValue('');
    }
  }

  // Display function for autocomplete
  displayFilament(color: FilamentColor): string {
    return color ? this.getFilamentTooltip(color) : '';
  }

  // Update slot selection
  updateSlot(slotIndex: number, colorId: string | null): void {
    const slots = [...this.selectedSlots()];
    slots[slotIndex] = colorId;
    this.selectedSlots.set(slots);
  }

  // Get the current selected color for a slot
  getSelectedColorForSlot(slotIndex: number): FilamentColor | null {
    const slots = this.selectedSlots();
    const colorId = slots[slotIndex];
    if (!colorId) return null;
    return this.colors().find(c => c.id === colorId) || null;
  }

  // Initialize form control value when component loads
  initializeSlotControl(slotIndex: number): void {
    const selectedColor = this.getSelectedColorForSlot(slotIndex);
    if (selectedColor) {
      this.slotControls[slotIndex].setValue(this.getFilamentTooltip(selectedColor));
    }
  }

  // Clear all slots
  clearAllSlots(): void {
    this.selectedSlots.set([null, null, null, null, null]);
    this.slotControls.forEach(control => control.setValue(''));
  }

  getFilamentTooltip(color: FilamentColor): string {
    const filamentType = color.filamentType?.fullName || `${color.filamentType?.brand} ${color.filamentType?.type}`;
    return `${filamentType} - ${color.colorName}`;
  }

  getPurgeVolume(fromColorId: string, toColorId: string): number {
    return this.dataService.getPurgeVolume(fromColorId, toColorId);
  }

  updatePurgeVolume(fromColorId: string, toColorId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    let volume = parseInt(input.value);
    
    // Validate input
    if (isNaN(volume) || volume < 0) {
      volume = 0;
      input.value = '0';
    } else if (volume > 999) {
      volume = 999;
      input.value = '999';
    }
    
    this.dataService.updatePurgeVolume(fromColorId, toColorId, volume);
  }

  setValuesFromConfiguration(): void {
    if (confirm('This will set all purge volumes to the default value (65mm³). Do you want to continue?')) {
      this.dataService.setValuesFromConfiguration();
    }
  }
}
