import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PurgeMatrixComponent } from './purge-matrix/purge-matrix.component';
import { FilamentColorsComponent } from './filament-colors/filament-colors.component';
import { FilamentTypesComponent } from './filament-types/filament-types.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatTabsModule,
    MatToolbarModule,
    PurgeMatrixComponent,
    FilamentColorsComponent,
    FilamentTypesComponent
  ],
  templateUrl: './main.component.html',
  styles: [`
    .tab-content {
      padding: 20px;
    }
    
    mat-toolbar {
      margin-bottom: 20px;
    }
  `]
})
export class MainComponent {}
