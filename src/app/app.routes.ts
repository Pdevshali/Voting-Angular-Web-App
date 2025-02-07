import { Routes } from '@angular/router';
import { PollComponent } from './poll/poll.component';
import { LogsComponent } from './logs/logs.component';

export const routes: Routes = [
    { path: 'logs', component: LogsComponent }, // Route for logs
    { path: '', component: PollComponent }, // Default route (e.g., home page)
    { path: '**', redirectTo: '' }, // Redirect to default route for unknown paths
];
