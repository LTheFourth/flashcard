import { Component, inject, output } from '@angular/core';
import { StateService } from '../../../../core/services/state.service';

@Component({
  selector: 'app-control-area',
  standalone: true,
  imports: [],
  styles: [`
    .control-area {
      display: flex;
      align-items: center;
      padding: 12px 16px 28px;
      gap: 10px;
      background: var(--surface);
      border-top: 1px solid var(--divider);
      flex-shrink: 0;
    }
    .action-btn {
      flex: 1;
      padding: 14px 12px;
      border-radius: 12px;
      border: 1px solid transparent;
      font-family: 'Crimson Pro', serif;
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: transform 0.12s, opacity 0.12s, background 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .action-btn:active {
      transform: scale(0.96);
      opacity: 0.82;
    }
    .btn-arrow {
      font-family: 'Courier Prime', monospace;
      font-size: 0.85rem;
      opacity: 0.7;
    }
    .recall-btn {
      background: var(--accent-pale);
      color: var(--accent);
      border-color: rgba(201, 79, 45, 0.2);
    }
    .recall-btn:hover {
      background: rgba(201, 79, 45, 0.2);
    }
    .remember-btn {
      background: var(--green-pale);
      color: var(--green);
      border-color: rgba(58, 124, 86, 0.2);
    }
    .remember-btn:hover {
      background: rgba(58, 124, 86, 0.2);
    }
  `],
  template: `
    <div class="control-area">
      <button (click)="recall()" class="action-btn recall-btn">
        <span class="btn-arrow">←</span> Recall
      </button>
      <button (click)="remember()" class="action-btn remember-btn">
        Remember <span class="btn-arrow">→</span>
      </button>
    </div>
  `,
})
export class ControlAreaComponent {
  readonly onFlipReset = output<void>();

  private state = inject(StateService);

  recall(): void {
    const card = this.currentCard;
    if (card) this.state.recordRecall(card.id);
    this.onFlipReset.emit();
    this.state.nextCard();
  }

  remember(): void {
    const card = this.currentCard;
    if (card) this.state.recordRemember(card.id);
    this.onFlipReset.emit();
    this.state.nextCard();
  }

  private get currentCard() {
    const queue = this.state.cardQueue$.value;
    const idx = this.state.currentCardIndex$.value;
    return queue[idx] ?? null;
  }

}
