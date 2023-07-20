import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://backend-iotic.vercel.app/line';

  constructor(private http: HttpClient) { }

  public getMessages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/last-message`);
  }
}
