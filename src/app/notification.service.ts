import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey; // VAPID public key from environment

  constructor(
    private swPush: SwPush,
    private storageService: StorageService,
    private http: HttpClient
  ) { }

  // Request permission for notifications
  async requestPermission(): Promise<NotificationPermission> {
    if(!('Notification' in window)) {
      console.log("Unsupported browser for notifications.");
      return Promise.resolve('denied');
    }

    return await Notification.requestPermission();
  }

  // Subscribe to notifications
  async subscribeToNotifications(): Promise<boolean> {
    try {
      const permission = await this.requestPermission();

      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });

      const subscriptionJson = subscription.toJSON();

      // Save to storage
      await this.storageService.set('pushSubscription', subscriptionJson);

      return true;

    } catch (e) {
      console.error('Error subscribing to notifications', e);

      return false;
    }
  }

  // Unsubscribe from notifications
  async unsubscribe(): Promise<boolean> {
    try {
      await this.swPush.unsubscribe();
      await this.storageService.remove('pushSubscription');
      return true;
    } catch (e) {
      console.error('Error unsubscribing from notifications', e);
      return false;
    }
  }

  // Check notifcations are enabled
  async isSubscribed(): Promise<boolean> {
    const subscription = await this.storageService.get('pushSubscription');
    return !!subscription;
  }

  // Schedule a notification
  async scheduleNotification(minutes: number): Promise<void> {
    const isSubscribed = await this.isSubscribed();
    if (!isSubscribed) {
      console.log('User is not subscribed to notifications');
      return;
    }

    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Reminder!', {
          body: 'Time to drink some water!',
          icon: 'assets/icon/logo.png'
        });
      }
    }, minutes * 60 * 1000)
  }
}
