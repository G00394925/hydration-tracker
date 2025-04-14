import { Component, HostListener, OnInit } from '@angular/core';
import { IonBadge, IonLabel, IonList, IonItem, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [RoundProgressModule, IonBadge, IonLabel, IonList, IonItem, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton],
})

export class Tab1Page implements OnInit {
  dailyGoal: number = 2000; // Recommended daily intake is 2L by default
  currentProgress: number = 0;
  progressPercentage: number = 0;
  maxPercentage: number = 100;
  lastDrink: string = "";
  todaysDrinks: number = 0;
  currentStreak: number = 0;
  maxStreak: number = 0;

  windowWidth: number = window.innerWidth;
  windowHeight: number = window.innerHeight;

  constructor(private storageService : StorageService) {}

  async ngOnInit() {
    await this.storageService.init(); // Initialize storage
    this.loadProgress(); // Load progress from storage
  }

  // Update window dimensions on resize to change size of progress circle
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;  // Update window width
    this.windowHeight = window.innerHeight;  // Update window height
  }

  // Change radius of progress circle based on screen size
  calculateRadius(): number {
    // Smaller screens
    if(this.windowWidth < 360 || this.windowHeight < 800) {
      return 70;
    // Medium screens
    } else if (this.windowWidth < 480) {
      return 100;
    } else {
      return 150;
    }
  }

  calculateStroke(): number {
    // Calculate stroke width based on radius
    const radius = this.calculateRadius();
    return Math.max(Math.floor(radius * 0.2), 15) // 15 = Minimum stroke width
  }

  getColor(): string {
    if(this.progressPercentage >= 100) {
      return 'rgb(39, 212, 39)'; // Green color for 100%
    } else {
      return '#3688F2'; // Default color
    }
  }

  clearProgress() {
    this.storageService.clear(); // Clear all progress from storage
    this.currentProgress = 0;
    this.todaysDrinks = 0;
    this.progressPercentage = 0;
  }

  async loadProgress() {
    // Get progress from storage
    this.currentProgress = await this.storageService.get('currentProgress') || 0;
    this.todaysDrinks = await this.storageService.get('todaysDrinks') || 0;
    this.lastDrink = await this.storageService.get('lastDrink');

    // Make sure percetnage does not exceed 100% on load
    if (Math.floor((this.currentProgress / this.dailyGoal) * 100) > 100) {
      this.progressPercentage = 100;
    } else {
      this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100) || 0;
    }
  }

  async addProgress(amount: number) {
    this.currentProgress += amount  // Add amount onto current progress
    this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100);  // Convert progress to percentage

    // Make sure percentage does not exceed 100%
    if (this.progressPercentage > 100) {
      this.progressPercentage = 100;
    }

    this.lastDrink = (this.getLastDrink());  // Get last drink time
    this.todaysDrinks += 1;  // Increment number of drinks today

    if(this.currentProgress >= this.dailyGoal) {
      this.updateStreak();  // Update streak if goal is met
    }

    // Save all progress to storage
    await this.storageService.set('lastDrink', this.lastDrink);
    await this.storageService.set('todaysDrinks', this.todaysDrinks);
    await this.storageService.set('currentProgress', this.currentProgress);
  }

  getLastDrink(): string {
    // Get time of last drink in HH:MM format
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return (hours + ":" + minutes);
  }

  updateStreak() {
    this.currentStreak += 1;

    if(this.currentStreak > this.maxStreak) {
      this.maxStreak = this.currentStreak;
    }
    this.storageService.set('currentStreak', this.currentStreak);
    this.storageService.set('maxStreak', this.maxStreak);
  }
}
