import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonLabel, IonItem, IonToggle, IonSelect, IonSelectOption, IonCardTitle, IonCardHeader, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonCardHeader, IonCardTitle, IonToggle, IonItem, IonLabel, IonContent, IonCard, IonCardContent, IonSelect, IonSelectOption],
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

  // Reset daily progress
  resetProgress() {
    this.storageService.set('currentProgress', 0);
    this.storageService.set('todaysDrinks', 0);
    this.storageService.set('lastDrink', '');
  }

  // Reset everything 
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

  // Toggle notifications
  async toggleNotifications(event: any) {
    const enabled = event.detail.checked; // Get the value of the toggle switch

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

  // Update reminder interval
  updateReminderInterval(event: any) {
    const interval = event.detail.value; // Get the selected interval from the event
    this.reminderInterval = interval; // Update the reminder interval
    this.storageService.set('reminderInterval', interval); // Save the new interval to storage

    // If notifications are enabled, reschedule the reminder
    if (this.notificationsEnabled) {
      this.scheduleReminder();
    }
  }

  private scheduleReminder() {
    this.notificationService.scheduleNotification(this.reminderInterval);
  }
}
