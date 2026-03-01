import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from './core/services/state.service';
import { UpdateService } from './core/services/update.service';
import { ControllerBarComponent } from './features/flashcard/components/controller-bar/controller-bar.component';
import { CardDisplayComponent } from './features/flashcard/components/card-display/card-display.component';
import { ControlAreaComponent } from './features/flashcard/components/control-area/control-area.component';
import { AddCardsDialogComponent } from './features/flashcard/components/add-cards-dialog/add-cards-dialog.component';
import { UpdateNotificationComponent } from './features/flashcard/components/update-notification/update-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ControllerBarComponent, CardDisplayComponent, ControlAreaComponent, AddCardsDialogComponent, UpdateNotificationComponent],
  styles: [`
    .shell {
      height: 100dvh;
      overflow: hidden;
      background: var(--bg);
      display: flex;
      flex-direction: column;
    }
    .offline-banner {
      background: var(--accent);
      color: rgba(255, 255, 255, 0.92);
      font-family: 'Courier Prime', monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      text-align: center;
      padding: 7px 16px;
      text-transform: uppercase;
      flex-shrink: 0;
    }
  `],
  template: `
    <div class="shell">

      @if (isOffline) {
        <div class="offline-banner">Offline — cached cards</div>
      }

      <app-controller-bar (onAddCards)="showAddDialog.set(true)" />
      <app-card-display #cardDisplay class="flex-1 flex flex-col" />
      <app-control-area (onFlipReset)="cardDisplay.resetFlip()" />

      @if (showAddDialog()) {
        <app-add-cards-dialog (onClose)="showAddDialog.set(false)" />
      }

      <app-update-notification />

    </div>
  `,
})
export class AppComponent implements OnInit {
  @ViewChild('cardDisplay') cardDisplay!: CardDisplayComponent;

  private state = inject(StateService);
  private updateService = inject(UpdateService); // Initialize update service
  readonly showAddDialog = signal(false);

  get isOffline(): boolean {
    return this.state.isOffline$.value;
  }

  ngOnInit(): void {
    this.state.loadCards(this.state.currentLevel$.value);
  }
}
