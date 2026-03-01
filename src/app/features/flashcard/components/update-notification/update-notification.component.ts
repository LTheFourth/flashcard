import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateService } from '../../../../core/services/update.service';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--surface);
      border: 1px solid var(--divider);
      border-radius: 8px;
      padding: 16px 20px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 400px;
      z-index: 999;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(420px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .message {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .title {
      font-family: 'Crimson Pro', serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: var(--on-dark);
    }

    .description {
      font-family: 'Courier Prime', monospace;
      font-size: 11px;
      letter-spacing: 0.02em;
      color: var(--on-dark-muted);
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn {
      padding: 6px 12px;
      border-radius: 6px;
      border: none;
      font-family: 'Crimson Pro', serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-update {
      background: var(--accent);
      color: white;
      border: 1px solid var(--accent);
    }

    .btn-update:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }

    .btn-update:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-dismiss {
      background: transparent;
      color: var(--on-dark-muted);
      border: 1px solid var(--divider);
    }

    .btn-dismiss:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }

    .icon {
      font-size: 16px;
      flex-shrink: 0;
    }
  `],
  template: `
    @if (updateService.updateAvailable()) {
      <div class="notification">
        <div class="icon">🔄</div>
        <div class="message">
          <div class="title">Update Available</div>
          <div class="description">A new version is ready to install</div>
        </div>
        <div class="actions">
          <button
            class="btn btn-dismiss"
            (click)="updateService.updateAvailable.set(false)"
            title="Dismiss notification"
          >
            Dismiss
          </button>
          <button
            class="btn btn-update"
            (click)="updateService.activateUpdate()"
            [disabled]="updateService.isChecking()"
          >
            {{ updateService.isChecking() ? 'Updating...' : 'Update Now' }}
          </button>
        </div>
      </div>
    }
  `,
})
export class UpdateNotificationComponent {
  readonly updateService = inject(UpdateService);
}
