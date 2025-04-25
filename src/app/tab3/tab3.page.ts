import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonButton, IonLabel, IonItem, IonToggle, IonSelect, IonSelectOption, IonCardTitle, IonCardHeader, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { NotificationService } from '../notification.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonFooter, NgIf, IonButton, IonCardHeader, IonCardTitle, IonToggle, IonItem, IonLabel, IonContent, IonCard, IonCardContent, IonSelect, IonSelectOption],
})

export class Tab3Page implements OnInit {
  dailyGoal: number = 2000; // Default daily goal
  notificationsEnabled: boolean = false;
  reminderInterval: number = 60; // Default reminder interval in minutes

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    const savedGoal = await this.storageService.get('dailyGoal');

    if (savedGoal) {
      this.dailyGoal = savedGoal;
    }

    // Load notification settings
    this.notificationsEnabled = await this.notificationService.isSubscribed();
    const savedInterval = await this.storageService.get('reminderInterval');
    if (savedInterval) {
      this.reminderInterval = savedInterval;
    }
  }

  resetProgress() {
    this.storageService.set('currentProgress', 0);
    this.storageService.set('todaysDrinks', 0);
    this.storageService.set('lastDrink', '');
  }

  clearAllData() {
    this.storageService.clear();
  }

  updateGoal(event: any) {
    // Extract value from the event
    const newGoal = event.detail.value;

    // Update the daily goal
    this.dailyGoal = newGoal;

    // Save the new goal to storage
    this.storageService.set('dailyGoal', newGoal);
  }

  async toggleNotifications(event: any) {
    const enabled = event.detail.checked;

    if(enabled) {
      const success = await this.notificationService.subscribeToNotifications();
      this.notificationsEnabled = success;

      if (success) {
        this.scheduleReminder(); // Schedule the first notification
      } else {
        await this.notificationService.unsubscribe();
        this.notificationsEnabled = false;
      }
    }

  }

  updateReminderInterval(event: any) {
    const interval = event.detail.value;
    this.reminderInterval = interval;
    this.storageService.set('reminderInterval', interval);

    if (this.notificationsEnabled) {
      this.scheduleReminder();
    }
  }

  private scheduleReminder() {
    this.notificationService.scheduleNotification(this.reminderInterval);
  }

  testNotification() {
    this.notificationService.testNotification(5);
  }
}
