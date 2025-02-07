import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PollService } from '../service/poll.service';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent implements OnInit, AfterViewInit{

  newPoll:  Poll = {
    id: 0,
    question: '',
    options: [
      { optionText: '', voteCount: 0 },
      { optionText: '', voteCount: 0 }
    ]
  };

  polls: Poll[] = [];

  private charts: { [key: number]: Chart } = {}; // Store charts by poll ID

  constructor(private pollService: PollService,
     private router:Router, private cdr: ChangeDetectorRef){
      Chart.register(...registerables); // Register Chart.js components
  }
  ngOnInit(): void {
        this.loadPlls();
        // this.loadLogs();
    }

  ngAfterViewInit() {
    this.cdr.detectChanges(); // Force DOM update
    this.polls.forEach((poll) => this.renderChart(poll)); // Pie chart
  }
  addOption(){
    this.newPoll.options.push({ optionText: '', voteCount: 0});

  }

  loadPlls(){
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
        setTimeout(() => {
          this.polls.forEach(poll => this.renderChart(poll));
        }, 0); // Render charts after DOM update
      },
      error: (error) => {
        console.error('Error fetching polls:', error);
      }
    });
  }


  navigateToLogs() {
    this.router.navigate(['logs']); // Navigate to the logs page
  }

  // loadLogs(){
  //   this.pollService.getLogs().subscribe({
  //     next: (data) =>{
  //       console.log("Audit logs: ", data);
  //     },
  //     error: (error) =>{
  //       console.error("Error fetching logs: ", error);
  //     }
  //   });
  // }
  createPoll() {
    const payload: Poll = {
      question: this.newPoll.question,
      options: this.newPoll.options.map(option => ({
        optionText: option.optionText,
        voteCount: option.voteCount,
      })),
      id: 0
    };


    
    this.pollService.createPoll(payload).subscribe({
        next: (createdPoll) => {
            this.polls.push(createdPoll);
            this.resetPoll();
        },
        error: (error) => {
            console.error("Error voting a poll:", error);
        },
    });
}


// we can use piechart to represent the shares of votes to the options. 

  resetPoll() {
    this.newPoll = {
      id: 0,
      question: '',
      options: [
        { optionText: '', voteCount: 0 },
        { optionText: '', voteCount: 0 }
      ]
    };
  }

  deletePoll(pollId: number) {
    this.pollService.deletePoll(pollId).subscribe({
      next: () => {
        // Remove the deleted poll from the UI
        this.polls = this.polls.filter(p => p.id !== pollId);
        this.destroyChart(pollId); // Remove chart
      },
      error: (error) => {
        console.error("Error deleting poll:", error);
      }
    });
  }


  vote(pollId: number, optionIndex: number) {
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () =>{
        const poll = this.polls.find(p => p.id === pollId);
        if(poll){
          poll.options[optionIndex].voteCount++;
          this.updateChart(poll); // Refresh chart

        }
      },
    error: (error) =>{
      console.error("Error creating poll:", error);
      
    }
    });
  }
  trackByIndex(index: number): number { 
    return index;
  }

  // Render a pie chart for a poll
  renderChart(poll: Poll) {
    if (!poll.options || poll.options.length === 0) {
      console.error('No options found for poll:', poll.id);
      return;
    }
  
    const ctx = document.getElementById(`pieChart-${poll.id}`) as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found for poll:', poll.id);
      return;
    }
  
    this.charts[poll.id] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: poll.options.map((option) => option.optionText),
        datasets: [
          {
            data: poll.options.map((option) => option.voteCount),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  // Update the chart for a poll
  updateChart(poll: Poll) {
    const chart = this.charts[poll.id];
    if (chart) {
      chart.data.labels = poll.options.map((option) => option.optionText);
      chart.data.datasets[0].data = poll.options.map((option) => option.voteCount);
      chart.update();
    }
  }

  // Destroy the chart for a poll
  destroyChart(pollId: number) {
    const chart = this.charts[pollId];
    if (chart) {
      chart.destroy();
      delete this.charts[pollId];
    }
  }
}