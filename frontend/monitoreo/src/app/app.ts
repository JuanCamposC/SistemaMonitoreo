import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureCardComponent } from './components/temperature-card/temperature-card.component';
import { PhCardComponent } from './components/ph-card/ph-card.component';
import { OxygenCardComponent } from './components/oxygen-card/oxygen-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TemperatureCardComponent,
    PhCardComponent,
    OxygenCardComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Sistema de Monitoreo de Sensores';
}
