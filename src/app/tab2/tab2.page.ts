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
export class Tab2Page implements AfterViewInit {
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

  async ngOnInit() {
    await this.loadProgress(); // Load progress from storage
  }

  async ionViewWillEnter() {
    await this.loadProgress();
  }

  async loadProgress() {
    // Get progress from storage
    this.currentProgress = await this.storageService.get('currentProgress') || 0;
    this.todaysDrinks = await this.storageService.get('todaysDrinks') || 0;
    this.lastDrink = await this.storageService.get('lastDrink');
    this.progressPercentage = (this.currentProgress / this.dailyGoal);
    this.currentStreak = await this.storageService.get('currentStreak') || 0;
    this.maxStreak = await this.storageService.get('maxStreak') || 0;
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    if(this.myChart?.nativeElement) {
      this.chart = new Chart(this.myChart?.nativeElement, {
        type: 'line',
        data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
            label: 'Water Intake',
            data: [2000, 1500, 1000, 3000, 2500, 2200, 1600],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
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
    } else {
      console.error('Chart element not found');
    }
  }
}
