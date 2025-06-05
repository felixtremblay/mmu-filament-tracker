import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FilamentDataService } from '../../services/filament-data.service';
import { FilamentColor } from '../../models/filament.models';

@Component({
  selector: 'app-purge-matrix',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './purge-matrix.component.html',
  styleUrls: ['./purge-matrix.component.scss']
})
export class PurgeMatrixComponent {
  private dataService = inject(FilamentDataService);
  
  colors = computed(() => this.dataService.filamentColors());

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
