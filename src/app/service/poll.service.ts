import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuditLog, Poll } from '../poll.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private baseUrl = environment.baseUrl;
  // private baseLogUrl = 'http://localhost:8080/api/audit';

  constructor(private http: HttpClient) { }

  createPoll(poll: Poll): Observable<Poll>{
    return this.http.post<Poll>(this.baseUrl, poll);
  }

  getPolls(): Observable<Poll[]> { // it returns a array of type Poll
    return this.http.get<Poll[]>(this.baseUrl);
  }

vote(pollId: number, optionIndex: number): Observable<void>{
  const url = `${this.baseUrl}/vote`;
  return this.http.post<void>(url,  { pollId, optionIndex});
}

deletePoll(pollId: number): Observable<void>{
  const url = `${this.baseUrl}/${pollId}`;
  return this.http.delete<void>(url);
}

// getLogs(): Observable<AuditLog[]> {
//   return this.http.get<AuditLog[]>(this.baseLogUrl);
// }


}
  