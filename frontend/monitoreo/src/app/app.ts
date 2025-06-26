import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureCardComponent } from './components/temperature-card/temperature-card.component';
import { PhCardComponent } from './components/ph-card/ph-card.component';
import { OxygenCardComponent } from './components/oxygen-card/oxygen-card.component';
import { interval, Subscription } from 'rxjs';

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
export class App implements OnInit, OnDestroy {
  protected title = 'Sistema de Monitoreo de Sensores';
  currentTime: string = '';
  private timeSubscription: Subscription | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Actualizar la hora cada segundo
    this.updateCurrentTime();    this.timeSubscription = interval(1000).subscribe(() => {
      // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.updateCurrentTime();
        this.cdr.detectChanges();
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  /**
   * Actualiza la hora actual
   */
  private updateCurrentTime(): void {
    this.currentTime = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Obtiene la hora actual formateada
   */
  getCurrentTime(): string {
    return this.currentTime;
  }

  /**
   * Obtiene el año actual
   */
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
