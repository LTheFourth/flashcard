import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { StateService } from '../../../../core/services/state.service';
import { Flashcard } from '../../../../core/services/flashcard.service';

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
      /* disable default browser touch handling so pointermove fires cleanly */
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    /*
     * card-inner handles BOTH the drag transform (translateX + rotate)
     * AND the flip transform (rotateY).
     *
     * While dragging: transition is off so it follows the finger in real time.
     * On release (snap-back or fly-off): transition turns back on.
     * On flip click: transition is on, drag offset is 0.
     */
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      /* default: smooth transitions for flip & snap-back */
      transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }
    /* While user is actively dragging — disable transition for real-time follow */
    .card-inner.dragging {
      transition: none;
    }
    /* Flip state — applied on top of whatever drag offset is set inline */
    .card-inner.flipped {
      /* flipped class adds rotateY(180deg) via inline style in the template
         so we don't override drag offset here */
    }

    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 18px;
      overflow: hidden;
    }

    /* ---------- swipe direction badge ---------- */
    .swipe-badge {
      position: absolute;
      top: 20px;
      z-index: 10;
      padding: 4px 14px;
      border-radius: 8px;
      border: 2px solid;
      font-family: 'Crimson Pro', serif;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      pointer-events: none;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      /* opacity driven by swipe progress — set via inline style */
    }
    .badge-recall {
      left: 16px;
      color: var(--accent);
      border-color: var(--accent);
      background: rgba(201, 79, 45, 0.1);
    }
    .badge-remember {
      right: 16px;
      color: var(--green);
      border-color: var(--green);
      background: rgba(58, 124, 86, 0.1);
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
          <span class="stat-pill recall-pill">↩ {{ recallCount }}</span>
          <span class="stat-pill remember-pill">✓ {{ rememberCount }}</span>
        </div>

        <!-- Card scene -->
        <div
          class="card-scene"
          #cardScene
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp($event)"
          (pointercancel)="snapBack()"
        >
          <!--
            card-inner transform combines:
            - drag: translateX + rotate (set via inline style while dragging)
            - flip: rotateY(180deg) appended when card is flipped
            Both live in one transform string to avoid conflicts.
          -->
          <div
            #cardInner
            class="card-inner"
            [class.dragging]="isDragging()"
            [style.transform]="cardTransform()"
          >

            <!-- Recall badge (left side, fades in while dragging left) -->
            <div
              class="swipe-badge badge-recall"
              [style.opacity]="recallBadgeOpacity()"
            >Recall</div>

            <!-- Remember badge (right side, fades in while dragging right) -->
            <div
              class="swipe-badge badge-remember"
              [style.opacity]="rememberBadgeOpacity()"
            >Remember</div>

            <!-- Front face -->
            <div class="card-face card-front">
              @if (isChinese) {
                <span class="hanzi">{{ currentCard.chinese }}</span>
                <span class="tap-hint">tap to reveal · swipe to score</span>
              } @else {
                <span class="viet-front">{{ currentCard.vietnamese }}</span>
                <span class="pinyin-front">{{ currentCard.pinyin }}</span>
                <span class="tap-hint">tap to reveal · swipe to score</span>
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
  @ViewChild('cardScene') cardSceneRef!: ElementRef<HTMLElement>;

  private state = inject(StateService);

  // ── reactive observables as signals ────────────────────────────────────
  private currentIndexSignal = toSignal(this.state.currentCardIndex$, { initialValue: 0 });
  private cardQueueSignal = toSignal(this.state.cardQueue$, { initialValue: [] });
  private isLoadingSignal = toSignal(this.state.isLoading$, { initialValue: false });
  private hasErrorSignal = toSignal(this.state.hasError$, { initialValue: false });
  private recallCountSignal = toSignal(this.state.recallCount$, { initialValue: 0 });
  private rememberCountSignal = toSignal(this.state.rememberCount$, { initialValue: 0 });

  // ── flip state ──────────────────────────────────────────────────────────
  isFlipped = signal(false);

  // ── drag state ──────────────────────────────────────────────────────────
  isDragging = signal(false);

  /** Current horizontal drag offset in px */
  private dragX = 0;

  private startX = 0;
  private startY = 0;

  /**
   * How far the card must be dragged (px) to count as a swipe decision.
   * At this point the card flies off; below it snaps back.
   */
  private readonly THRESHOLD = 80;

  /**
   * Max tilt angle (degrees) at the swipe threshold.
   * The card rotates proportionally up to this value.
   */
  private readonly MAX_ROTATE = 18;

  // ── computed display values ──────────────────────────────────────────────

  /** Combined CSS transform: drag offset + flip state. */
  cardTransform(): string {
    const tx = this.dragX;
    // Tilt: proportional to drag, clamped to ±MAX_ROTATE
    const rot = Math.min(Math.max((tx / this.THRESHOLD) * this.MAX_ROTATE, -this.MAX_ROTATE), this.MAX_ROTATE);
    const flip = this.isFlipped() ? ' rotateY(180deg)' : '';
    if (tx === 0) return `rotateY(${this.isFlipped() ? '180deg' : '0deg'})`;
    return `translateX(${tx}px) rotate(${rot}deg)${flip}`;
  }

  /** Opacity 0→1 as card drags left (recall direction). */
  recallBadgeOpacity(): number {
    if (this.dragX >= 0) return 0;
    return Math.min(Math.abs(this.dragX) / this.THRESHOLD, 1);
  }

  /** Opacity 0→1 as card drags right (remember direction). */
  rememberBadgeOpacity(): number {
    if (this.dragX <= 0) return 0;
    return Math.min(this.dragX / this.THRESHOLD, 1);
  }

  // ── pointer handlers ─────────────────────────────────────────────────────

  onPointerDown(event: PointerEvent): void {
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.dragX = 0;
    // Capture so pointermove/up fire even if pointer leaves the element
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!event.buttons) return; // pointer not pressed

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    // Only start dragging once we confirm horizontal intent
    if (!this.isDragging() && Math.abs(dx) < 6 && Math.abs(dy) < 6) return;

    // Lock into drag mode only if horizontal movement dominates
    if (!this.isDragging()) {
      if (Math.abs(dx) < Math.abs(dy)) return; // vertical scroll — don't hijack
      this.isDragging.set(true);
    }

    this.dragX = dx;
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.isDragging()) {
      // It was a tap — flip the card
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        this.flip();
      }
      return;
    }

    const dx = this.dragX;
    this.isDragging.set(false);

    if (dx < -this.THRESHOLD) {
      this.flyOff('left');
    } else if (dx > this.THRESHOLD) {
      this.flyOff('right');
    } else {
      this.snapBack();
    }
  }

  // ── animations ──────────────────────────────────────────────────────────

  snapBack(): void {
    this.isDragging.set(false);
    this.dragX = 0;
    // transition is back on (dragging class removed), so the snap is animated
  }

  private flyOff(direction: 'left' | 'right'): void {
    // Push the card well off screen — transition handles the animation
    const target = direction === 'left' ? -600 : 600;
    this.dragX = target;

    // After the fly-off animation completes, process the action and reset
    setTimeout(() => {
      if (direction === 'left') {
        this.doRecall();
      } else {
        this.doRemember();
      }
      // Instantly reposition (no transition) then restore transition
      this.isDragging.set(true);  // kill transition briefly
      this.dragX = 0;
      requestAnimationFrame(() => {
        this.isDragging.set(false); // restore transition
      });
    }, 320);
  }

  // ── card actions ─────────────────────────────────────────────────────────

  flip(): void {
    this.isFlipped.update((v) => !v);
  }

  resetFlip(): void {
    this.isFlipped.set(false);
  }

  private doRecall(): void {
    const card = this.currentCard;
    if (card) this.state.recordRecall(card.id);
    this.resetFlip();
    this.state.nextCard();
  }

  private doRemember(): void {
    const card = this.currentCard;
    if (card) this.state.recordRemember(card.id);
    this.resetFlip();
    this.state.nextCard();
  }

  // ── getters ──────────────────────────────────────────────────────────────

  get isChinese(): boolean {
    return this.state.languageMode$.value === 'chinese';
  }

  get isLoading(): boolean {
    return this.isLoadingSignal();
  }

  get hasError(): boolean {
    return this.hasErrorSignal();
  }

  get currentCard(): Flashcard | null {
    const queue = this.cardQueueSignal();
    const idx = this.currentIndexSignal();
    return queue[idx] ?? null;
  }

  get currentIndex(): number {
    return this.currentIndexSignal();
  }

  get totalCards(): number {
    return this.cardQueueSignal().length;
  }

  get recallCount(): number {
    return this.recallCountSignal();
  }

  get rememberCount(): number {
    return this.rememberCountSignal();
  }

}
