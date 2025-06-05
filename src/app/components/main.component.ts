import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PurgeMatrixComponent } from './purge-matrix/purge-matrix.component';
import { FilamentColorsComponent } from './filament-colors/filament-colors.component';
import { FilamentTypesComponent } from './filament-types/filament-types.component';
import { FilamentDataService } from '../services/filament-data.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    PurgeMatrixComponent,
    FilamentColorsComponent,
    FilamentTypesComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private dataService = inject(FilamentDataService);
  private snackBar = inject(MatSnackBar);
  
  private readonly SELECTED_TAB_KEY = 'filament-tracker-selected-tab';
  selectedTabIndex = signal(0);

  ngOnInit(): void {
    this.restoreSelectedTab();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex.set(index);
    this.saveSelectedTab(index);
  }

  private saveSelectedTab(index: number): void {
    localStorage.setItem(this.SELECTED_TAB_KEY, index.toString());
  }

  private restoreSelectedTab(): void {
    const savedTab = localStorage.getItem(this.SELECTED_TAB_KEY);
    if (savedTab !== null) {
      const tabIndex = parseInt(savedTab, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 2) {
        this.selectedTabIndex.set(tabIndex);
      }
    }
  }

  exportConfiguration(): void {
    try {
      this.dataService.downloadConfigurationFile();
      this.snackBar.open('Configuration exported successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } catch (error) {
      this.snackBar.open('Error exporting configuration', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  importConfiguration(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const result = this.dataService.importConfiguration(content);
            
            this.snackBar.open(result.message, 'Close', {
              duration: result.success ? 3000 : 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          } catch (error) {
            this.snackBar.open('Error reading file', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        };
        reader.readAsText(file);
      }
    });
    input.click();
  }
}
