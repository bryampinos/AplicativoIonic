import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  idRol?: string;
  user?: {
    nombre?: string;
    apellido?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private apiUrl = 'http://localhost:3000'; // URL base de tu API
  private userSubject = new BehaviorSubject<string | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    try {
      return token ? jwtDecode<JwtPayload>(token) : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUsername(): string {
    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.user) {
      const { nombre, apellido } = decodedToken.user;
      return `${nombre} ${apellido}`;
    }
    throw new Error('No token available or token is invalid');
  }

  getRepresentados(): Observable<any> {
    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.idRol) {
      return this.http.get<any>(`${this.apiUrl}/estudiante/representante/${decodedToken.idRol}`).pipe(
        catchError(error => throwError(() => new Error('Error al cargar los representados: ' + error.message)))
      );
    } else {
      return throwError(() => new Error('No token available or token is invalid'));
    }
  }
  getAsignaturasDocente(): Observable<any[]> {
    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.idRol) {
      return this.http.get<any>(`${this.apiUrl}/docenteMateria/docente/${decodedToken.idRol}`).pipe(
        catchError(error => throwError(() => new Error('Error al cargar los representados: ' + error.message)))
      );
    } else {
      return throwError(() => new Error('No token available or token is invalid'));
    }
  }
  getAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignatura/all`);
  }
  getCursos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/curso/all`);
  }
  
  clearUserData(): void {
    // Resetear los BehaviorSubjects o cualquier otra variable de estado
    this.userSubject.next(null);
    localStorage.removeItem('token'); // Remueve el token del localStorage

    // Aquí también podrías limpiar cualquier otro estado o almacenamiento local
    console.log('Todos los datos de usuario han sido borrados.');
  }
}
