import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../../core/services/state.service';
import { Flashcard } from '../../../../core/services/flashcard.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-card-display',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    /* ---------- layout ---------- */
    .card-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 16px 8px;
      flex: 1;
      min-height: 0;
    }

    /* ---------- loading / empty ---------- */
    .state-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      gap: 10px;
    }
    .empty-label {
      font-family: 'Crimson Pro', serif;
      font-size: 1.2rem;
      color: var(--on-dark-muted);
      margin: 0;
    }
    .empty-sub {
      font-family: 'Crimson Pro', serif;
      font-size: 0.9rem;
      color: #4a4540;
      margin: 0;
      text-align: center;
      line-height: 1.5;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loader {
      width: 28px;
      height: 28px;
      border: 1.5px solid rgba(201, 79, 45, 0.2);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* ---------- position row ---------- */
    .position-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 360px;
      margin-bottom: 10px;
      flex-shrink: 0;
    }
    .position-text {
      font-family: 'Courier Prime', monospace;
      font-size: 11px;
      color: var(--on-dark-muted);
      letter-spacing: 0.06em;
      flex: 1;
    }
    .stat-pill {
      font-family: 'Courier Prime', monospace;
      font-size: 10px;
      letter-spacing: 0.04em;
      padding: 2px 8px;
      border-radius: 99px;
    }
    .recall-pill {
      background: var(--accent-pale);
      color: var(--accent);
    }
    .remember-pill {
      background: var(--green-pale);
      color: var(--green);
    }

    /* ---------- 3D card scene ---------- */
    .card-scene {
      perspective: 1200px;
      width: 100%;
      max-width: 360px;
      flex: 1;
      min-height: 0;
      cursor: pointer;
      /* grab all pointer events; prevent browser from intercepting swipes */
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }
    .card-inner.flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 18px;
      overflow: hidden;
    }

    /* ---------- swipe feedback overlay ---------- */
    .swipe-overlay {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      pointer-events: none;
      font-family: 'Crimson Pro', serif;
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      animation: fadeIn 0.1s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    .overlay-recall {
      background: rgba(201, 79, 45, 0.18);
      color: var(--accent);
    }
    .overlay-remember {
      background: rgba(58, 124, 86, 0.18);
      color: var(--green);
    }

    /* ---------- front face ---------- */
    .card-front {
      background-color: #faf7f2;
      background-image:
        radial-gradient(ellipse at 15% 25%, rgba(139, 100, 50, 0.06) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 75%, rgba(120, 80, 40, 0.04) 0%, transparent 55%);
      box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.55),
        0 4px 14px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 24px;
      gap: 14px;
    }

    /* ---------- back face ---------- */
    .card-back-face {
      background-color: #f0e8d8;
      background-image:
        radial-gradient(ellipse at 80% 20%, rgba(139, 100, 50, 0.08) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 80%, rgba(120, 80, 40, 0.05) 0%, transparent 55%);
      box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.55),
        0 4px 14px rgba(0, 0, 0, 0.3);
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 28px 24px;
      gap: 10px;
    }

    /* ---------- card typography ---------- */
    .hanzi {
      font-family: 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;
      font-size: clamp(68px, 20vw, 108px);
      font-weight: 700;
      color: #1c1510;
      line-height: 1;
      letter-spacing: -0.01em;
      text-align: center;
    }
    .hanzi-back {
      font-family: 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;
      font-size: clamp(52px, 15vw, 84px);
      font-weight: 700;
      color: #1c1510;
      line-height: 1;
      text-align: center;
    }
    .tap-hint {
      font-family: 'Courier Prime', monospace;
      font-size: 10px;
      color: #9b8e85;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .viet-front {
      font-family: 'Crimson Pro', serif;
      font-size: clamp(1.35rem, 5vw, 1.9rem);
      font-weight: 600;
      color: #1c1510;
      text-align: center;
      line-height: 1.3;
    }
    .pinyin-front {
      font-family: 'Courier Prime', monospace;
      font-size: 1rem;
      color: #c94f2d;
      letter-spacing: 0.06em;
    }
    .pinyin-back {
      font-family: 'Courier Prime', monospace;
      font-size: 0.9rem;
      color: #c94f2d;
      letter-spacing: 0.07em;
    }
    .viet-back {
      font-family: 'Crimson Pro', serif;
      font-size: clamp(1.25rem, 4.5vw, 1.75rem);
      font-weight: 600;
      color: #1c1510;
      text-align: center;
      line-height: 1.35;
    }
    .example-block {
      width: 100%;
      border-top: 1px solid rgba(100, 70, 40, 0.18);
      padding-top: 12px;
      margin-top: 2px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .example-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 0.82rem;
      color: #3d2e25;
      text-align: center;
      line-height: 1.6;
      margin: 0;
      font-style: italic;
    }
    .example-vi {
      font-family: 'Crimson Pro', serif;
      font-size: 0.78rem;
      color: #6b5d52;
      text-align: center;
      line-height: 1.5;
      margin: 0;
    }
  `],
  template: `
    <div class="card-area">

      @if (isLoading) {
        <div class="state-center">
          <div class="loader"></div>
        </div>
      }

      @else if (hasError || !currentCard) {
        <div class="state-center">
          <p class="empty-label">No cards available</p>
          <p class="empty-sub">Check your connection<br/>and try again.</p>
        </div>
      }

      @else {
        <!-- Position + stats row -->
        <div class="position-row">
          <span class="position-text">{{ currentIndex + 1 }} · {{ totalCards }}</span>
          <span class="stat-pill recall-pill">↩ {{ cardState.recalled }}</span>
          <span class="stat-pill remember-pill">✓ {{ cardState.remembered }}</span>
        </div>

        <!-- Card scene — tap to flip, swipe to recall/remember -->
        <div
          class="card-scene"
          (pointerdown)="onPointerDown($event)"
          (pointerup)="onPointerUp($event)"
        >
          <!-- Swipe feedback overlay -->
          @if (swipeState() !== 'idle') {
            <div
              class="swipe-overlay"
              [class.overlay-recall]="swipeState() === 'left'"
              [class.overlay-remember]="swipeState() === 'right'"
            >
              {{ swipeState() === 'left' ? '← Recall' : 'Remember →' }}
            </div>
          }

          <div class="card-inner" [class.flipped]="isFlipped()">

            <!-- Front face -->
            <div class="card-face card-front">
              @if (isChinese) {
                <span class="hanzi">{{ currentCard.chinese }}</span>
                <span class="tap-hint">tap to reveal</span>
              } @else {
                <span class="viet-front">{{ currentCard.vietnamese }}</span>
                <span class="pinyin-front">{{ currentCard.pinyin }}</span>
                <span class="tap-hint">tap to reveal</span>
              }
            </div>

            <!-- Back face -->
            <div class="card-face card-back-face">
              @if (isChinese) {
                <span class="pinyin-back">{{ currentCard.pinyin }}</span>
                <span class="viet-back">{{ currentCard.vietnamese }}</span>
                <div class="example-block">
                  <p class="example-zh">{{ currentCard.example }}</p>
                  <p class="example-vi">{{ currentCard.example_vi }}</p>
                </div>
              } @else {
                <span class="hanzi-back">{{ currentCard.chinese }}</span>
                <div class="example-block">
                  <p class="example-zh">{{ currentCard.example }}</p>
                  <p class="example-vi">{{ currentCard.example_vi }}</p>
                </div>
              }
            </div>

          </div>
        </div>
      }

    </div>
  `,
})
export class CardDisplayComponent {
  private state = inject(StateService);
  private storage = inject(StorageService);

  isFlipped = signal(false);
  swipeState = signal<'idle' | 'left' | 'right'>('idle');

  private startX = 0;
  private startY = 0;
  private readonly SWIPE_THRESHOLD = 60;

  get isChinese(): boolean {
    return this.state.languageMode$.value === 'chinese';
  }

  get isLoading(): boolean {
    return this.state.isLoading$.value;
  }

  get hasError(): boolean {
    return this.state.hasError$.value;
  }

  get currentCard(): Flashcard | null {
    const queue = this.state.cardQueue$.value;
    const idx = this.state.currentCardIndex$.value;
    return queue[idx] ?? null;
  }

  get currentIndex(): number {
    return this.state.currentCardIndex$.value;
  }

  get totalCards(): number {
    return this.state.cardQueue$.value.length;
  }

  get cardState() {
    const card = this.currentCard;
    if (!card) return { recalled: 0, remembered: 0 };
    return this.storage.getState(this.state.currentLevel$.value, card.chinese);
  }

  onPointerDown(event: PointerEvent): void {
    this.startX = event.clientX;
    this.startY = event.clientY;
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  }

  onPointerUp(event: PointerEvent): void {
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    if (isHorizontal && Math.abs(dx) > this.SWIPE_THRESHOLD) {
      // Swipe gesture
      if (dx < 0) {
        this.swipeState.set('left');
        setTimeout(() => { this.doRecall(); this.swipeState.set('idle'); }, 250);
      } else {
        this.swipeState.set('right');
        setTimeout(() => { this.doRemember(); this.swipeState.set('idle'); }, 250);
      }
    } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      // Tap — flip the card
      this.flip();
    }
  }

  flip(): void {
    this.isFlipped.update((v) => !v);
  }

  resetFlip(): void {
    this.isFlipped.set(false);
  }

  private doRecall(): void {
    const card = this.currentCard;
    if (!card) return;
    this.storage.incrementRecalled(this.state.currentLevel$.value, card.chinese);
    this.resetFlip();
    this.state.nextCard();
  }

  private doRemember(): void {
    const card = this.currentCard;
    if (!card) return;
    this.storage.incrementRemembered(this.state.currentLevel$.value, card.chinese);
    this.resetFlip();
    this.state.nextCard();
  }
}
