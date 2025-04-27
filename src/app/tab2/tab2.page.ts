import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from '../storage.service';
import { IonCard, IonCardHeader, IonIcon, IonCardTitle, IonCardContent, IonContent, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flame, trophy } from 'ionicons/icons';

Chart.register(...registerables);

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonProgressBar, IonCard, IonCardHeader, IonIcon, IonCardTitle, IonCardContent, IonContent,]
})
export class Tab2Page {
  @ViewChild('myChart') myChart: ElementRef | undefined;
  chart: any;

  // Variables for progress data
  currentProgress: number = 0;
  dailyGoal: number = 2000;
  progressPercentage: number = 0;
  todaysDrinks: number = 0;
  lastDrink: string = '';
  currentStreak: number = 0;
  maxStreak: number = 0;

  constructor(private storageService: StorageService) {
    addIcons({ flame, trophy })
  }

  async loadProgress() {
    // Get progress from storage
    this.currentProgress = await this.storageService.get('currentProgress') || 0;
    this.todaysDrinks = await this.storageService.get('todaysDrinks') || 0;
    this.lastDrink = await this.storageService.get('lastDrink');
    this.dailyGoal = await this.storageService.get('dailyGoal') || 2000;
    this.progressPercentage = (this.currentProgress / this.dailyGoal);
    this.currentStreak = await this.storageService.get('currentStreak') || 0;
    this.maxStreak = await this.storageService.get('maxStreak') || 0;
  }

  async getHistory() {
    try {
      const historyData: any = await this.storageService.get('history') || {}; // Get history data froms storage
      const labels: string[] = [];
      const data: number[] = [];

      const today = new Date(); // Get today's date
      for (let i = 6; i >= 0; i--) {  // Loop through the last 7 days
        const date = new Date(today);  // Create a date variable -- set to today
        date.setDate(today.getDate() - i); // Previous days

        const day = date.toLocaleDateString('en-US', { weekday: 'short'});
        labels.push(day);

        const intake = historyData[this.formatDate(date)] || 0;  // Get water intake for the day
        data.push(intake);
      }

      return { labels, data };

    } catch (e) {
      console.error(e);
      return { labels: [], data: [] }
    }
  }

  // Format date to YYYY-MM-DD as that's how the data is stored
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async createChart() {
    if (this.myChart?.nativeElement) {
      const history = await this.getHistory(); // Get history data

      if (this.chart) {
        // Update existing chart
        this.chart.data.labels = history.labels;
        this.chart.data.datasets[0].data = history.data;
        // ALSO update options if they depend on dynamic data like dailyGoal
        this.chart.options.scales.y.max = 5000;
        this.chart.options.scales.y.ticks = { stepSize: 1000 }; // Set step size for y-axis ticks
        this.chart.update();

      } else {
        // Create new chart
        this.chart = new Chart(this.myChart.nativeElement, {
          type: 'line',
          data: {
            labels: history.labels,
            datasets: [{
              label: 'Water Intake',
              data: history.data,
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 5000,
                ticks: {
                  stepSize: 1000
                },
                title: {
                  display: true,
                  text: 'Water Intake (ml)'
                }
              }
            },
            animations: {
              tension: {
                duration: 1000,
                easing: 'linear',
                from: 0,
                to: 0,
                loop: false
              }
            }
          }
        })
      }

    } else {
      console.error('Chart element not found');
    }
  }


  async updateChart() {
    if (this.chart) {
      const history = await this.getHistory();

      this.chart.data.labels = history.labels;
      this.chart.data.datasets[0].data = history.data;
      this.chart.options.scales.y.suggestedMax = 5000;
      this.chart.options.scales.y.ticks = { stepSize: 1000 };
      this.chart.update();
    } else {
      // If chart doesn't exist, create it
      await this.createChart();
    }
  }

  async ngAfterViewInit() {
    await this.loadProgress(); // Load data first
    await this.createChart(); // Create chart once view is ready
  }

  async ionViewWillEnter() {
    await this.loadProgress(); // Load latest data
    await this.updateChart(); // Update the chart before it's shown
  }
}
