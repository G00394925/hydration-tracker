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

      // Save to storage
      await this.storageService.set('pushSubscription', subscription);

      return true;

    } catch (e) {
      console.error('Error subscribing to notifications', e);
      return false;

    }
  }
}
