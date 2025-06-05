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
  
  // LocalStorage keys for filter persistence
  private readonly FILTER_STORAGE_KEYS = {
    SHOW_ALL_FILAMENTS: 'purge-matrix-show-all-filaments',
    SELECTED_SLOTS: 'purge-matrix-selected-slots'
  };
  
  // Existing computed properties
  colors = computed(() => this.dataService.filamentColors());

  // New filter state
  showAllFilaments = signal(true);
  selectedSlots = signal<(string | null)[]>([null, null, null, null, null]); // 5 MMU slots
  
  // Form controls for slot selection - now using FilamentColor objects directly
  slotControls = [
    new FormControl<FilamentColor | null>(null),
    new FormControl<FilamentColor | null>(null),
    new FormControl<FilamentColor | null>(null),
    new FormControl<FilamentColor | null>(null),
    new FormControl<FilamentColor | null>(null)
  ];

  ngOnInit(): void {
    // Restore filter state from localStorage
    this.restoreFilterState();
    
    // Set up value change listeners to update selectedSlots when form controls change
    this.slotControls.forEach((control, index) => {
      control.valueChanges.subscribe(value => {
        this.updateSlot(index, value?.id || null);
      });
    });

    // Initialize form controls with any existing selected values
    this.slotControls.forEach((control, index) => {
      this.initializeSlotControl(index);
    });
  }

  // Filter state persistence methods
  private saveFilterState(): void {
    localStorage.setItem(this.FILTER_STORAGE_KEYS.SHOW_ALL_FILAMENTS, this.showAllFilaments().toString());
    localStorage.setItem(this.FILTER_STORAGE_KEYS.SELECTED_SLOTS, JSON.stringify(this.selectedSlots()));
  }

  private restoreFilterState(): void {
    // Restore showAllFilaments
    const savedShowAll = localStorage.getItem(this.FILTER_STORAGE_KEYS.SHOW_ALL_FILAMENTS);
    if (savedShowAll !== null) {
      this.showAllFilaments.set(savedShowAll === 'true');
    }

    // Restore selectedSlots
    const savedSlots = localStorage.getItem(this.FILTER_STORAGE_KEYS.SELECTED_SLOTS);
    if (savedSlots !== null) {
      try {
        const slots = JSON.parse(savedSlots);
        if (Array.isArray(slots) && slots.length === 5) {
          this.selectedSlots.set(slots);
        }
      } catch (error) {
        console.warn('Failed to parse saved slot selection:', error);
      }
    }
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

  // Handle manual slot selection (from clear button)
  onSlotSelection(slotIndex: number, color: FilamentColor | null): void {
    this.slotControls[slotIndex].setValue(color);
    // The updateSlot will be called automatically via valueChanges subscription
  }

  // Update slot selection
  updateSlot(slotIndex: number, colorId: string | null): void {
    const slots = [...this.selectedSlots()];
    slots[slotIndex] = colorId;
    this.selectedSlots.set(slots);
    this.saveFilterState();
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
      this.slotControls[slotIndex].setValue(selectedColor);
    }
  }

  // Clear all slots
  clearAllSlots(): void {
    this.selectedSlots.set([null, null, null, null, null]);
    this.slotControls.forEach(control => control.setValue(null));
    this.saveFilterState();
  }

  // Handle show all filaments toggle
  onShowAllFilamentsChange(showAll: boolean): void {
    this.showAllFilaments.set(showAll);
    this.saveFilterState();
  }

  // Refresh filter state from localStorage (useful after configuration import)
  refreshFilterState(): void {
    this.restoreFilterState();
    // Update form controls to reflect the restored state
    this.slotControls.forEach((control, index) => {
      this.initializeSlotControl(index);
    });
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

  // Display function for autocomplete
  displayFilamentFn = (color: FilamentColor | null): string => {
    return color ? this.getFilamentTooltip(color) : '';
  };

  // Get filtered colors for autocomplete with search functionality
  getFilteredColorsForSlot(slotIndex: number): FilamentColor[] {
    const control = this.slotControls[slotIndex];
    const inputValue = control.value;
    
    // If the input value is a FilamentColor object, don't filter (user selected from dropdown)
    if (inputValue && typeof inputValue === 'object' && 'id' in inputValue) {
      return this.getAvailableColorsForSlot(slotIndex);
    }
    
    // If it's a string, filter by that string
    const searchTerm = (typeof inputValue === 'string' ? inputValue : '').toLowerCase();
    const availableColors = this.getAvailableColorsForSlot(slotIndex);
    
    if (!searchTerm) {
      return availableColors;
    }
    
    return availableColors.filter(color => 
      this.getFilamentTooltip(color).toLowerCase().includes(searchTerm) ||
      color.colorName.toLowerCase().includes(searchTerm) ||
      color.filamentType?.brand?.toLowerCase().includes(searchTerm) ||
      color.filamentType?.type?.toLowerCase().includes(searchTerm)
    );
  }

  // Check if user is actively searching (has typed something)
  isSearching(slotIndex: number): boolean {
    const control = this.slotControls[slotIndex];
    const inputValue = control.value;
    
    // Return true if there's a string value (user is typing)
    return typeof inputValue === 'string' && (inputValue as string).trim().length > 0;
  }

  // Check if the search term matches "none"
  shouldShowNoneInSearch(slotIndex: number): boolean {
    const control = this.slotControls[slotIndex];
    const inputValue = control.value;
    
    if (typeof inputValue === 'string') {
      const searchTerm = (inputValue as string).toLowerCase().trim();
      // Only match against "none" - check if "none" starts with the search term
      return 'none'.startsWith(searchTerm) && searchTerm.length > 0;
    }
    
    return false;
  }
}
