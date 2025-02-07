import { Injectable } from '@angular/core';
import { AuditLog } from '../poll.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  constructor(private http: HttpClient) { }

  private baseLogUrl = environment.baseLogUrl;


  
getLogs(): Observable<AuditLog[]> {
  return this.http.get<AuditLog[]>(this.baseLogUrl);
}
}
