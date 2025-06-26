import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../services/sensor.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-temperature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-card.component.html',
  styleUrl: './temperature-card.component.css'
})
export class TemperatureCardComponent implements OnInit, OnDestroy {
  temperatura: any = null;
  error: string | null = null;
  loading: boolean = true;
  updating: boolean = false;
  updateTime: Date = new Date();
  private subscription: Subscription | undefined;

  constructor(private sensorService: SensorService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTemperatureData();
      // Actualizar datos cada 5 segundos
    this.subscription = interval(5000).pipe(
      switchMap(() => {
        this.updating = true;
        return this.sensorService.getLastTemperatura();
      })    ).subscribe({      
      next: (data) => {
        this.temperatura = data;
        this.loading = false;
        this.error = null;
        this.updating = false;
        this.updateTime = new Date();
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      },
      error: (error) => {
        this.error = 'Error al cargar datos de temperatura';
        this.loading = false;
        this.updating = false;
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      }
    });
  }  loadTemperatureData(): void {
    this.loading = true;
    this.error = null;    this.sensorService.getLastTemperatura().subscribe({      
      next: (data) => {
        this.temperatura = data;
        this.loading = false;
        this.error = null;
        this.updateTime = new Date();
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      },
      error: (error) => {
        this.error = 'Error al cargar datos de temperatura';
        this.loading = false;
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      }
    });
  }
  /**
   * Obtiene la clase CSS para el estado de la tarjeta
   */
  getCardStatusClass(): string {
    // Estado de carga siempre tiene prioridad
    if (this.loading) return 'card-loading';
    
    // Estado de error
    if (this.error) return 'card-offline';
    
    // Sin datos
    if (!this.temperatura || this.temperatura.mensaje) return 'card-offline';
    
    // Con datos válidos
    const value = this.getTemperatureValue();
    if (value === null) return 'card-offline';
    
    if (value >= 18 && value <= 22) return 'card-normal'; 
    if ((value >= 16 && value < 18) || (value > 22 && value <= 24)) return 'card-warning';
    return 'card-danger';
  }
  /**
   * Obtiene la clase CSS para el estado del sensor
   */
  getStatusClass(): string {
    if (this.loading) return 'status-offline';
    if (this.error) return 'status-offline';
    if (!this.temperatura || this.temperatura.mensaje) return 'status-offline';
    
    const value = this.getTemperatureValue();
    if (value === null) return 'status-offline';
    
    if (value >= 18 && value <= 22) return 'status-online';
    if ((value >= 16 && value < 18) || (value > 22 && value <= 24)) return 'status-warning';
    return 'status-offline';  
  }

  /**
   * Obtiene el estado de la temperatura en texto
   */
  getTemperatureStatus(): string {
    const value = this.getTemperatureValue();
    if (value === null) return 'Sin datos';
    
    if (value < 10) return 'Muy frío';
    if (value < 16) return 'Frío';
    if (value >= 16 && value <= 22) return 'Óptimo';
    if (value <= 24) return 'Cálido';
    if (value <= 30) return 'Caliente';
    return 'Muy caliente';
  }

  /**
   * Obtiene la clase CSS para el estado de la temperatura
   */
  getTemperatureStatusClass(): string {
    const value = this.getTemperatureValue();
    if (value === null) return '';
    
    if (value < 16) return 'temp-cold';
    if (value >= 16 && value <= 22) return 'temp-normal';
    if (value <= 24) return 'temp-warm';
    return 'temp-hot';
  }

  /**
   * Calcula el porcentaje para la barra de temperatura
   */
  getTemperaturePercentage(): number {
    const value = this.getTemperatureValue();
    if (value === null) return 0;
    
    // Rango de -10°C a 30°C
    const min = -10;
    const max = 30;
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    return percentage;
  }

  /**
   * Obtiene el valor numérico de la temperatura
   */
  private getTemperatureValue(): number | null {
    if (!this.temperatura || this.temperatura.mensaje) return null;
    const value = parseFloat(this.temperatura.temperatura);
    return isNaN(value) ? null : value;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
