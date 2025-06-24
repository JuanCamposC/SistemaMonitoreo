import { Component, OnInit, OnDestroy } from '@angular/core';
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
  updateTime: Date = new Date();
  private subscription: Subscription | undefined;

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadTemperatureData();    // Actualizar datos cada 5 segundos
    this.subscription = interval(5000).pipe(
      switchMap(() => this.sensorService.getLastTemperatura())
    ).subscribe({      next: (data) => {
        //console.log('Actualización automática - datos de temperatura:', data);
        this.temperatura = data;
        this.updateTime = new Date();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar datos de temperatura';
        this.loading = false;
        console.error('Error en el componente de temperatura:', error);
      }
    });
  }
  loadTemperatureData(): void {
    this.loading = true;
    this.sensorService.getLastTemperatura().subscribe({
      next: (data) => {
        console.log('Datos de temperatura actualizados:', data);
        this.temperatura = data;
        this.updateTime = new Date();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar datos de temperatura';
        this.loading = false;
        console.error('Error en el componente de temperatura:', error);
      }
    });
  }
  // Método para determinar el color de la tarjeta según el valor de temperatura
  getCardClass(): string {
    if (!this.temperatura || this.temperatura.mensaje) return 'card-default';
    
    const value = parseFloat(this.temperatura.temperatura);
    
    if (value >= 18 && value <= 22) {
      return 'card-success'; // Verde - óptimo
    } else if ((value >= 16 && value < 18) || (value > 22 && value <= 24)) {
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
