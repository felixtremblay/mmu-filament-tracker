import { Injectable, signal } from '@angular/core';
import { FilamentType, FilamentColor, PurgeMatrix } from '../models/filament.models';

@Injectable({
  providedIn: 'root'
})
export class FilamentDataService {
  private readonly STORAGE_KEYS = {
    FILAMENT_TYPES: 'filament-types',
    FILAMENT_COLORS: 'filament-colors',
    PURGE_MATRIX: 'purge-matrix'
  };

  // Signals for reactive state management
  filamentTypes = signal<FilamentType[]>([]);
  filamentColors = signal<FilamentColor[]>([]);
  purgeMatrix = signal<PurgeMatrix[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  // Filament Types
  addFilamentType(filamentType: Omit<FilamentType, 'id'>): FilamentType {
    const newType: FilamentType = {
      ...filamentType,
      id: this.generateId(),
      fullName: `${filamentType.brand} ${filamentType.type}`
    };
    
    const updated = [...this.filamentTypes(), newType];
    this.filamentTypes.set(updated);
    this.saveToStorage('filamentTypes', updated);
    return newType;
  }

  updateFilamentType(id: string, updates: Partial<FilamentType>): void {
    const updated = this.filamentTypes().map(type => 
      type.id === id ? { 
        ...type, 
        ...updates, 
        fullName: `${updates.brand || type.brand} ${updates.type || type.type}`
      } : type
    );
    this.filamentTypes.set(updated);
    this.saveToStorage('filamentTypes', updated);
  }

  deleteFilamentType(id: string): void {
    // Remove related colors and purge matrix entries
    const colorsToRemove = this.filamentColors().filter(color => color.filamentTypeId === id);
    colorsToRemove.forEach(color => this.deleteFilamentColor(color.id));
    
    const updated = this.filamentTypes().filter(type => type.id !== id);
    this.filamentTypes.set(updated);
    this.saveToStorage('filamentTypes', updated);
  }

  // Filament Colors
  addFilamentColor(filamentColor: Omit<FilamentColor, 'id' | 'filamentType'>): FilamentColor {
    const filamentType = this.filamentTypes().find(type => type.id === filamentColor.filamentTypeId);
    if (!filamentType) {
      throw new Error('Filament type not found');
    }

    const newColor: FilamentColor = {
      ...filamentColor,
      id: this.generateId(),
      filamentType
    };
    
    const updated = [...this.filamentColors(), newColor];
    this.filamentColors.set(updated);
    this.saveToStorage('filamentColors', updated);
    
    // Initialize purge matrix entries for new color
    this.initializePurgeMatrixForColor(newColor.id);
    
    return newColor;
  }

  updateFilamentColor(id: string, updates: Partial<FilamentColor>): void {
    const updated = this.filamentColors().map(color => {
      if (color.id === id) {
        const filamentType = updates.filamentTypeId 
          ? this.filamentTypes().find(type => type.id === updates.filamentTypeId)
          : color.filamentType;
        
        return { 
          ...color, 
          ...updates,
          filamentType: filamentType || color.filamentType
        };
      }
      return color;
    });
    this.filamentColors.set(updated);
    this.saveToStorage('filamentColors', updated);
  }

  deleteFilamentColor(id: string): void {
    // Remove related purge matrix entries
    const updatedMatrix = this.purgeMatrix().filter(entry => 
      entry.fromColorId !== id && entry.toColorId !== id
    );
    this.purgeMatrix.set(updatedMatrix);
    this.saveToStorage('purgeMatrix', updatedMatrix);
    
    const updated = this.filamentColors().filter(color => color.id !== id);
    this.filamentColors.set(updated);
    this.saveToStorage('filamentColors', updated);
  }

  // Purge Matrix
  updatePurgeVolume(fromColorId: string, toColorId: string, purgeVolume: number): void {
    const updated = this.purgeMatrix().map(entry => 
      entry.fromColorId === fromColorId && entry.toColorId === toColorId
        ? { ...entry, purgeVolume }
        : entry
    );
    
    // If entry doesn't exist, create it
    const entryExists = this.purgeMatrix().some(entry => 
      entry.fromColorId === fromColorId && entry.toColorId === toColorId
    );
    
    if (!entryExists) {
      updated.push({ fromColorId, toColorId, purgeVolume });
    }
    
    this.purgeMatrix.set(updated);
    this.saveToStorage('purgeMatrix', updated);
  }

  getPurgeVolume(fromColorId: string, toColorId: string): number {
    const entry = this.purgeMatrix().find(entry => 
      entry.fromColorId === fromColorId && entry.toColorId === toColorId
    );
    return entry?.purgeVolume || 65; // Default value
  }

  setValuesFromConfiguration(): void {
    // Set all purge volumes to default value (65mm³)
    const colors = this.filamentColors();
    const updated: PurgeMatrix[] = [];
    
    colors.forEach(fromColor => {
      colors.forEach(toColor => {
        if (fromColor.id !== toColor.id) {
          updated.push({
            fromColorId: fromColor.id,
            toColorId: toColor.id,
            purgeVolume: 65
          });
        }
      });
    });
    
    this.purgeMatrix.set(updated);
    this.saveToStorage('purgeMatrix', updated);
  }

  private initializePurgeMatrixForColor(colorId: string): void {
    const colors = this.filamentColors();
    const newEntries: PurgeMatrix[] = [];
    
    // Add entries for this color with all existing colors
    colors.forEach(color => {
      if (color.id !== colorId) {
        // From new color to existing colors
        if (!this.purgeMatrix().some(entry => 
          entry.fromColorId === colorId && entry.toColorId === color.id
        )) {
          newEntries.push({
            fromColorId: colorId,
            toColorId: color.id,
            purgeVolume: 65
          });
        }
        
        // From existing colors to new color
        if (!this.purgeMatrix().some(entry => 
          entry.fromColorId === color.id && entry.toColorId === colorId
        )) {
          newEntries.push({
            fromColorId: color.id,
            toColorId: colorId,
            purgeVolume: 65
          });
        }
      }
    });
    
    if (newEntries.length > 0) {
      const updated = [...this.purgeMatrix(), ...newEntries];
      this.purgeMatrix.set(updated);
      this.saveToStorage('purgeMatrix', updated);
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const types = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.FILAMENT_TYPES) || '[]');
        const colors = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.FILAMENT_COLORS) || '[]');
        const matrix = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PURGE_MATRIX) || '[]');
        
        this.filamentTypes.set(types);
        this.filamentColors.set(colors);
        this.purgeMatrix.set(matrix);
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    }
  }

  private saveToStorage(key: 'filamentTypes' | 'filamentColors' | 'purgeMatrix', data: any): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const storageKey = key === 'filamentTypes' ? this.STORAGE_KEYS.FILAMENT_TYPES :
                          key === 'filamentColors' ? this.STORAGE_KEYS.FILAMENT_COLORS :
                          this.STORAGE_KEYS.PURGE_MATRIX;
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data to storage:', error);
      }
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initializeDefaultData(): void {
    if (this.filamentTypes().length === 0) {
      // Add some default filament types
      const defaultTypes = [
        { brand: 'Polymaker', type: 'Polylite PLA' },
        { brand: 'Polymaker', type: 'Polylite PLA Pro' },
        { brand: 'Polymaker', type: 'Polylite Silk PLA' },
        { brand: 'Prusa', type: 'Prusament PLA' },
        { brand: 'Prusa', type: 'Prusament PETG' },
        { brand: 'Elegoo', type: 'PLA Pro' },
        { brand: 'eSUN', type: 'PLA Plus' },
        { brand: 'Hatchbox', type: 'PLA' }
      ];
      
      defaultTypes.forEach(type => this.addFilamentType(type));
    }

    if (this.filamentColors().length === 0) {
      // Add some default colors
      const types = this.filamentTypes();
      const defaultColors = [
        { filamentTypeId: types[0]?.id, colorName: 'Orange', color: '#FF6B35' },
        { filamentTypeId: types[0]?.id, colorName: 'Purple', color: '#8E44AD' },
        { filamentTypeId: types[0]?.id, colorName: 'Light Blue', color: '#3498DB' },
        { filamentTypeId: types[0]?.id, colorName: 'Red', color: '#E74C3C' },
        { filamentTypeId: types[0]?.id, colorName: 'Yellow', color: '#F1C40F' },
        { filamentTypeId: types[3]?.id, colorName: 'Galaxy Black', color: '#2C3E50' },
        { filamentTypeId: types[3]?.id, colorName: 'Mystic Green', color: '#27AE60' },
        { filamentTypeId: types[4]?.id, colorName: 'Transparent Blue', color: '#5DADE2' }
      ];
      
      defaultColors.forEach(color => {
        if (color.filamentTypeId) {
          this.addFilamentColor(color);
        }
      });
    }
  }
}
