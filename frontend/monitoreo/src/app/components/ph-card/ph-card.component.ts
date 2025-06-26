import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../services/sensor.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ph-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ph-card.component.html',
  styleUrl: './ph-card.component.css'
})
export class PhCardComponent implements OnInit, OnDestroy {
  ph: any = null;
  error: string | null = null;
  loading: boolean = true;
  updating: boolean = false;
  updateTime: Date = new Date();
  private subscription: Subscription | undefined;

  constructor(private sensorService: SensorService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPhData();
      // Actualizar datos cada 5 segundos
    this.subscription = interval(5000).pipe(
      switchMap(() => {
        this.updating = true;
        return this.sensorService.getLastPh();
      })    ).subscribe({      
      next: (data) => {
        this.ph = data;
        this.loading = false;
        this.error = null;
        this.updating = false;
        this.updateTime = new Date();
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      },
      error: (error) => {
        this.error = 'Error al cargar datos de pH';
        this.loading = false;
        this.updating = false;
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      }
    });
  }
  loadPhData(): void {
    this.loading = true;    this.sensorService.getLastPh().subscribe({      
      next: (data) => {
        this.ph = data;
        this.loading = false;
        this.error = null;
        this.updateTime = new Date();
        // Usar setTimeout para evitar problemas de contexto
        setTimeout(() => this.cdr?.detectChanges(), 0);
      },
      error: (error) => {
        this.error = 'Error al cargar datos de pH';
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
    if (!this.ph || this.ph.mensaje) return 'card-offline';
    
    const value = this.getPhValue();
    if (value === null) return 'card-offline';
    
    if (value >= 6.5 && value <= 7.5) return 'card-normal';
    if ((value >= 6.0 && value < 6.5) || (value > 7.5 && value <= 8.0)) return 'card-warning';
    return 'card-danger';
  }
  /**
   * Obtiene la clase CSS para el estado del sensor
   */
  getStatusClass(): string {
    if (this.loading) return 'status-offline';
    if (this.error) return 'status-offline';
    if (!this.ph || this.ph.mensaje) return 'status-offline'; 
    
    const value = this.getPhValue();    if (value === null) return 'status-offline';
    
    if (value >= 6.5 && value <= 7.5) return 'status-online';
    if ((value >= 6.0 && value < 6.5) || (value > 7.5 && value <= 8.0)) return 'status-warning';
    return 'status-offline';
  }

  /**
   * Obtiene el estado del pH en texto
   */
  getPhStatus(): string {
    const value = this.getPhValue();
    if (value === null) return 'Sin datos';
    
    if (value < 3) return 'Muy ácido';
    if (value < 6) return 'Ácido';
    if (value < 6.5) return 'Ligeramente ácido';
    if (value >= 6.5 && value <= 7.5) return 'Neutro (Óptimo)';
    if (value <= 8) return 'Ligeramente alcalino';
    if (value <= 11) return 'Alcalino';
    return 'Muy alcalino';
  }

  /**
   * Obtiene la clase CSS para el estado del pH
   */
  getPhStatusClass(): string {
    const value = this.getPhValue();
    if (value === null) return '';
    
    if (value < 3) return 'ph-very-acidic';
    if (value < 6) return 'ph-acidic';
    if (value < 6.5) return 'ph-slightly-acidic';
    if (value >= 6.5 && value <= 7.5) return 'ph-neutral';
    if (value <= 8) return 'ph-slightly-alkaline';
    if (value <= 11) return 'ph-alkaline';
    return 'ph-very-alkaline';
  }

  /**
   * Calcula el porcentaje para la barra de pH
   */
  getPhPercentage(): number {
    const value = this.getPhValue();
    if (value === null) return 0;
    
    // Rango de 0 a 14
    const percentage = Math.max(0, Math.min(100, (value / 14) * 100));
    return percentage;
  }

  /**
   * Obtiene el valor numérico del pH
   */  /**
   * Obtiene el valor numérico del pH
   */
  private getPhValue(): number | null {
    if (!this.ph || this.ph.mensaje) return null;
    const value = parseFloat(this.ph.ph);
    return isNaN(value) ? null : value;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
