import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../services/sensor.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-oxygen-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oxygen-card.component.html',
  styleUrl: './oxygen-card.component.css'
})
export class OxygenCardComponent implements OnInit, OnDestroy {
  oxigeno: any = null;
  error: string | null = null;
  loading: boolean = true;
  updating: boolean = false;
  updateTime: Date = new Date();
  private subscription: Subscription | undefined;

  constructor(private sensorService: SensorService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOxygenData();
      // Actualizar datos cada 5 segundos
    this.subscription = interval(5000).pipe(
      switchMap(() => {
        this.updating = true;
        return this.sensorService.getLastOxigeno();
      })    ).subscribe({      
      next: (data) => {
        this.oxigeno = data;
        this.loading = false;
        this.error = null;
        this.updating = false;
        this.updateTime = new Date();
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      },
      error: (error) => {
        this.error = 'Error al cargar datos de oxígeno';
        this.loading = false;
        this.updating = false;
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      }
    });
  }
  loadOxygenData(): void {
    this.loading = true;    this.sensorService.getLastOxigeno().subscribe({      
      next: (data) => {
        this.oxigeno = data;
        this.loading = false;
        this.error = null;
        this.updateTime = new Date();
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      },
      error: (error) => {
        this.error = 'Error al cargar datos de oxígeno';
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
    if (this.loading) return 'card-loading';
    if (this.error) return 'card-offline';
    if (!this.oxigeno || this.oxigeno.mensaje) return 'card-offline';
    
    const value = this.getOxygenValue();
    if (value === null) return 'card-offline';
    
    if (value >= 6) return 'card-normal';
    if (value >= 4) return 'card-warning';
    return 'card-danger';
  }
  /**
   * Obtiene la clase CSS para el estado del sensor
   */
  getStatusClass(): string {
    if (this.loading) return 'status-offline';
    if (this.error) return 'status-offline'; 
    if (!this.oxigeno || this.oxigeno.mensaje) return 'status-offline';
    
    const value = this.getOxygenValue();
    if (value === null) return 'status-offline';
    
    if (value >= 6) return 'status-online';
    if (value >= 4) return 'status-warning';
    return 'status-offline';
  }

  /**
   * Obtiene el estado del oxígeno en texto
   */
  getOxygenStatus(): string {
    const value = this.getOxygenValue();
    if (value === null) return 'Sin datos';
    
    if (value < 2) return 'Crítico';
    if (value < 4) return 'Bajo';
    if (value < 6) return 'Moderado';
    if (value < 10) return 'Bueno';
    return 'Excelente';
  }

  /**
   * Obtiene la clase CSS para el estado del oxígeno
   */
  getOxygenStatusClass(): string {
    const value = this.getOxygenValue();
    if (value === null) return '';
    
    if (value < 4) return 'oxygen-low';
    if (value < 6) return 'oxygen-moderate';
    if (value < 10) return 'oxygen-good';
    return 'oxygen-excellent';
  }

  /**
   * Calcula el porcentaje para la barra de oxígeno
   */
  getOxygenPercentage(): number {
    const value = this.getOxygenValue();
    if (value === null) return 0;
    
    // Rango de 0 a 20 mg/L
    const percentage = Math.max(0, Math.min(100, (value / 20) * 100));
    return percentage;
  }

  /**
   * Obtiene el valor numérico del oxígeno
   */  /**
   * Obtiene el valor numérico del oxígeno
   */
  private getOxygenValue(): number | null {
    if (!this.oxigeno || this.oxigeno.mensaje) return null;
    const value = parseFloat(this.oxigeno.oxigeno);
    return isNaN(value) ? null : value;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
