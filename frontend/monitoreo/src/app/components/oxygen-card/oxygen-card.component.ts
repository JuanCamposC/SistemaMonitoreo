import { Component, OnInit, OnDestroy } from '@angular/core';
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
  updateTime: Date = new Date();
  private subscription: Subscription | undefined;

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadOxygenData();    // Actualizar datos cada 5 segundos
    this.subscription = interval(5000).pipe(
      switchMap(() => this.sensorService.getLastOxigeno())
    ).subscribe({      next: (data) => {
        //console.log('Actualización automática - datos de oxígeno:', data);
        this.oxigeno = data;
        this.updateTime = new Date();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar datos de oxígeno';
        this.loading = false;
        console.error('Error en el componente de oxígeno:', error);
      }
    });
  }
  loadOxygenData(): void {
    this.loading = true;
    this.sensorService.getLastOxigeno().subscribe({
      next: (data) => {
        console.log('Datos de oxígeno actualizados:', data);
        this.oxigeno = data;
        this.updateTime = new Date();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar datos de oxígeno';
        this.loading = false;
        console.error('Error en el componente de oxígeno:', error);
      }
    });
  }  // Método para determinar el color de la tarjeta según el valor de oxígeno
  getCardClass(): string {
    if (!this.oxigeno || this.oxigeno.mensaje) return 'card-default';
    
    const value = parseFloat(this.oxigeno.oxigeno);
    
    if (value >= 6.5 && value <= 8) {
      return 'card-success'; // Verde - óptimo
    } else if ((value >= 5 && value < 6.5) || (value > 8 && value <= 9)) {
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
