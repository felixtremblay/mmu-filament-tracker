import { Component } from '@angular/core';
import { MainComponent } from './components/main.component';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  template: '<app-main></app-main>',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'filament-tracker';
}
