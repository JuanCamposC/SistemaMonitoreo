import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  // URL de tu subdominio en cPanel
  private apiUrl = 'https://monitoreo.lacasadedios.cl'; // Sin barra final

  constructor(private http: HttpClient) { }
  getLastTemperatura(): Observable<any> {
    return this.http.get(`${this.apiUrl}/backend/get_last_temperatura.php`);
  }

  getLastPh(): Observable<any> {
    return this.http.get(`${this.apiUrl}/backend/get_last_ph.php`);
  }

  getLastOxigeno(): Observable<any> {
    return this.http.get(`${this.apiUrl}/backend/get_last_oxigeno.php`);
  }
}
