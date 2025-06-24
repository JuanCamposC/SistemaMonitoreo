import { Component, OnInit, OnDestroy } from '@angular/core';
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
  updateTime: Date = new Date();
  private subscription: Subscription | undefined;

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadPhData();    // Actualizar datos cada 5 segundos
    this.subscription = interval(5000).pipe(
      switchMap(() => this.sensorService.getLastPh())
    ).subscribe({      next: (data) => {
        //console.log('Actualización automática - datos de pH:', data);
        this.ph = data;
        this.updateTime = new Date();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar datos de pH';
        this.loading = false;
        console.error('Error en el componente de pH:', error);
      }
    });
  }
  loadPhData(): void {
    this.loading = true;
    this.sensorService.getLastPh().subscribe({
      next: (data) => {
        console.log('Datos de pH actualizados:', data);
        this.ph = data;
        this.updateTime = new Date();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar datos de pH';
        this.loading = false;
        console.error('Error en el componente de pH:', error);
      }
    });
  }
  // Método para determinar el color de la tarjeta según el valor de pH
  getCardClass(): string {
    if (!this.ph || this.ph.mensaje) return 'card-default';
    
    const value = parseFloat(this.ph.ph);
    
    if (value >= 6.5 && value <= 8.5) {
      return 'card-success'; // Verde - óptimo
    } else if ((value >= 6.0 && value < 6.5) || (value > 8.5 && value <= 9.0)) {
      return 'card-warning'; // Amarillo - alerta
    } else {
      return 'card-danger'; // Rojo - crítico
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
