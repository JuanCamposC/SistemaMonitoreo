import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  // URL de tu subdominio en cPanel
  private apiUrl = 'https://monitoreo.lacasadedios.cl'; // Sin barra final
  
  // Activa para usar datos de prueba mientras configuras el backend
  private useMockData = false; // Temporalmente usa datos de prueba hasta que subas los archivos PHP

  constructor(private http: HttpClient) { }

  getLastTemperatura(): Observable<any> {
    if (this.useMockData) {
      return of(this.getMockTemperatureData());
    }
    
    return this.http.get(`${this.apiUrl}/backend/get_last_temperatura.php`)
      .pipe(
        catchError(() => of(this.getMockTemperatureData()))
      );
  }

  getLastPh(): Observable<any> {
    if (this.useMockData) {
      return of(this.getMockPhData());
    }
    
    return this.http.get(`${this.apiUrl}/backend/get_last_ph.php`)
      .pipe(
        catchError(() => of(this.getMockPhData()))
      );
  }

  getLastOxigeno(): Observable<any> {
    if (this.useMockData) {
      return of(this.getMockOxygenData());
    }
    
    return this.http.get(`${this.apiUrl}/backend/get_last_oxigeno.php`)
      .pipe(
        catchError(() => of(this.getMockOxygenData()))
      );
  }
  
  // Datos de prueba para desarrollo
  private getMockTemperatureData(): any {
    return {
      id: 1,
      temperatura: (Math.random() * (24 - 16) + 16).toFixed(1), // Entre 16°C y 24°C
      fecha: new Date().toISOString()
    };
  }
  
  private getMockPhData(): any {
    return {
      id: 1,
      ph: (Math.random() * (9 - 6) + 6).toFixed(2), // Entre 6 y 9
      fecha: new Date().toISOString()
    };
  }
  
  private getMockOxygenData(): any {
    return {
      id: 1,
      oxigeno: (Math.random() * (9 - 5) + 5).toFixed(2), // Entre 5 mg/L y 9 mg/L
      fecha: new Date().toISOString()
    };
  }
}
