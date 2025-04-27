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
    await this.checkForDayChange(); // Check if the day has changed
    this.loadProgress(); // Load progress from storage
  }

  async ionViewWillEnter() {
    await this.checkForDayChange();
    await this.loadProgress();
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
    this.storageService.remove('currentProgress'); // Remove current progress from storage
    this.storageService.remove('todaysDrinks'); // Remove todays drinks from storage

    this.currentProgress = 0;
    this.todaysDrinks = 0;
    this.progressPercentage = 0;
  }

  async loadProgress() {
    // Get progress from storage
    this.currentProgress = await this.storageService.get('currentProgress') || 0;
    this.todaysDrinks = await this.storageService.get('todaysDrinks') || 0;
    this.lastDrink = await this.storageService.get('lastDrink');
    this.currentStreak = await this.storageService.get('currentStreak') || 0;
    this.maxStreak = await this.storageService.get('maxStreak') || 0;

    const savedGoal = await this.storageService.get('dailyGoal');
    if (savedGoal) {
      this.dailyGoal = savedGoal; // Load daily goal from storage
    }

    // Make sure percetnage does not exceed 100% on load
    if (Math.floor((this.currentProgress / this.dailyGoal) * 100) > 100) {
      this.progressPercentage = 100;
    } else {
      this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100) || 0;
    }
  }

  async addProgress(amount: number) {
    const previousProgress = this.currentProgress;
    this.currentProgress += amount  // Add amount onto current progress
    this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100);  // Convert progress to percentage

    // Make sure percentage does not exceed 100%
    if (this.progressPercentage > 100) {
      this.progressPercentage = 100;
    }

    this.lastDrink = (this.getLastDrink());  // Get last drink time
    this.todaysDrinks += 1;  // Increment number of drinks today

    if(previousProgress < this.dailyGoal && this.currentProgress >= this.dailyGoal) {
      await this.storageService.set('metGoal', true);  // Set goal met flag in storage
      this.updateStreak();  // Update streak if goal is met
    }

    // Save all progress to storage
    await this.storageService.set('lastDrink', this.lastDrink);
    await this.storageService.set('todaysDrinks', this.todaysDrinks);
    await this.storageService.set('currentProgress', this.currentProgress);

    await this.updateHistory(amount);  // Update history with new progress
  }

  async updateHistory(amount: number) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const history = await this.storageService.get('history') || {}; // Get history from storage

    // Update or create today's history
    if(history[today]) {
      history[today] += amount;
      } else {
      history[today] = amount;
    }

    await this.storageService.set('history', history); // Save updated history to storage
  }

  getLastDrink(): string {
    // Get time of last drink in HH:MM format
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return (hours + ":" + minutes);
  }

  updateStreak() {
    this.currentStreak += 1;  // Increment current streak

    // Update max streak if record is broken
    if(this.currentStreak > this.maxStreak) {
      this.maxStreak = this.currentStreak;
    }

    // Update streaks in storage
    this.storageService.set('currentStreak', this.currentStreak);
    this.storageService.set('maxStreak', this.maxStreak);
  }


  // Check if it's a new day -- reset progress and update streaks
  async checkForDayChange() {
    const lastDate = await this.storageService.get('lastDate');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Day has changed, reset progress
    if(lastDate !== today) {
      console.log("It's a new day!")

      // Check that yesterday's goal was met
      const metGoalYesterday = await this.storageService.get('metGoal');

      // Goal wasn't met -- reset streak
      if(!metGoalYesterday) {
        this.currentStreak = 0;
        await this.storageService.set('currentStreak', 0);
      }

      this.clearProgress(); // Clear progress for the new day

      // Reset goal met flag
      await this.storageService.set('metGoal', false)

      // Update last date in storage
      await this.storageService.set('lastDate', today);
    }
  }
}
