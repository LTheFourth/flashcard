import { Injectable, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private swUpdate = inject(SwUpdate);

  readonly updateAvailable = signal(false);
  readonly isChecking = signal(false);

  constructor() {
    // Only set up updates if service worker is available
    if (this.swUpdate.isEnabled) {
      this.setupUpdateChecks();
    }
  }

  private setupUpdateChecks(): void {
    // Check for updates when app comes back into focus
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });

    // Check for updates periodically (every 30 minutes)
    interval(30 * 60 * 1000).subscribe(() => {
      this.checkForUpdates();
    });

    // Listen for update available events
    this.swUpdate.versionUpdates
      .pipe(filter((event) => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.updateAvailable.set(true);
      });

    // Check on initial load
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    if (!this.swUpdate.isEnabled) return;

    this.isChecking.set(true);
    this.swUpdate
      .checkForUpdate()
      .then(() => {
        this.isChecking.set(false);
      })
      .catch(() => {
        this.isChecking.set(false);
      });
  }

  activateUpdate(): void {
    this.swUpdate
      .activateUpdate()
      .then(() => {
        // Reload the page to load the new version
        window.location.reload();
      })
      .catch((err) => {
        console.error('Failed to activate update:', err);
      });
  }
}
