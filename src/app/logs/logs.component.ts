import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../service/audit-log.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [DatePipe,
    CommonModule
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {

  logs : any[] = [];

constructor(private auditLogService: AuditLogService){
  }

  ngOnInit(): void {
    this.loadLogs();
}


  loadLogs(){
    this.auditLogService.getLogs().subscribe({
      next: (data) =>{
        console.log("Audit logs: ", data);
        this.logs = data;
      },
      error: (error) =>{
        console.error("Error fetching logs: ", error);
      }
    });
  }

}
