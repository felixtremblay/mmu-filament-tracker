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
  styles: [`
    .purge-matrix-container {
      max-width: 100%;
      overflow-x: auto;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
      color: #333;
    }

    .subtitle {
      color: #666;
      margin: 5px 0 0 0;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .matrix-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .purge-matrix-table {
      border-collapse: collapse;
      background: #333;
      border-radius: 8px;
      overflow: hidden;
    }

    .purge-matrix-table th,
    .purge-matrix-table td {
      border: 1px solid #444;
      text-align: center;
      vertical-align: middle;
    }

    .from-label {
      background: #333;
      color: white;
      font-weight: bold;
      padding: 15px;
      width: 80px;
    }

    .color-header,
    .row-header {
      background: #333;
      color: white;
      padding: 10px;
      width: 80px;
    }

    .color-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
      border: 2px solid white;
      vertical-align: middle;
    }

    .color-number {
      font-weight: bold;
      vertical-align: middle;
    }

    .purge-cell {
      background: #555;
      padding: 5px;
      width: 80px;
      height: 60px;
    }

    .diagonal-cell {
      width: 100%;
      height: 40px;
      background: linear-gradient(45deg, transparent 45%, #777 45%, #777 55%, transparent 55%);
    }

    .purge-input {
      width: 60px;
    }

    .purge-input ::ng-deep .mat-mdc-form-field-infix {
      padding: 8px 0;
    }

    .purge-input ::ng-deep .mat-mdc-text-field-wrapper {
      background: white;
      border-radius: 4px;
    }

    .purge-input ::ng-deep input {
      text-align: center;
      font-weight: bold;
      color: #333;
    }

    .footer {
      text-align: center;
    }

    .legend {
      margin-bottom: 20px;
      text-align: left;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .legend h3 {
      margin-bottom: 10px;
      color: #333;
      font-size: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }

    .legend-text {
      font-size: 14px;
      color: #666;
    }

    .example.color-circle {
      width: 16px;
      height: 16px;
      border: 2px solid #333;
    }

    .example.diagonal-cell {
      width: 30px;
      height: 16px;
      background: linear-gradient(45deg, transparent 45%, #777 45%, #777 55%, transparent 55%);
    }

    .units {
      color: #666;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .purge-matrix-table {
        font-size: 12px;
      }
      
      .color-circle {
        width: 16px;
        height: 16px;
      }
      
      .purge-input {
        width: 50px;
      }
      
      .purge-cell {
        width: 60px;
        height: 50px;
      }
    }
  `]
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
