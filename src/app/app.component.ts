import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private swPush: SwPush,
    private router: Router
  ) {}

  ngOnInit() {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js').then(() => {
        console.log('Service Worker registered successfully');
        this.setupNotifcationListeners();
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }

  private setupNotifcationListeners() {
    // Handle notification clicks
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log("Notification clicked:", notification);

      // Navigate to app when notification is clicked
      this.router.navigate(['/tabs/tab1']);
    })

    // Handle push messages
    this.swPush.messages.subscribe((message => {
      console.log("Push message received:", message);
    }))
  }
}
