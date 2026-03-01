import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flashcard, FlashcardService } from './flashcard.service';
import { StorageService } from './storage.service';

/** The "main face" of the card shown before flipping. */
export type LanguageMode = 'chinese' | 'vietnamese';

export const HSK_LEVELS = ['hsk3', 'hsk4', 'hsk5'] as const;
export type HskLevel = (typeof HSK_LEVELS)[number];

export const LANGUAGE_MODES: LanguageMode[] = ['chinese', 'vietnamese'];

@Injectable({ providedIn: 'root' })
export class StateService {
  readonly currentLevel$ = new BehaviorSubject<HskLevel>('hsk3');
  readonly languageMode$ = new BehaviorSubject<LanguageMode>('chinese');
  readonly cardQueue$ = new BehaviorSubject<Flashcard[]>([]);
  readonly currentCardIndex$ = new BehaviorSubject<number>(0);
  readonly isOffline$ = new BehaviorSubject<boolean>(!navigator.onLine);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly hasError$ = new BehaviorSubject<boolean>(false);

  constructor(
    private flashcardService: FlashcardService,
    private storageService: StorageService
  ) {
    window.addEventListener('online', () => this.isOffline$.next(false));
    window.addEventListener('offline', () => this.isOffline$.next(true));
  }

  loadCards(level: HskLevel): void {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    this.currentCardIndex$.next(0);

    this.flashcardService.getCards(level).subscribe({
      next: (cards) => {
        if (cards.length === 0) {
          this.hasError$.next(true);
        }
        this.cardQueue$.next(this.sortByFrequency(cards, level));
        this.isLoading$.next(false);
      },
      error: () => {
        this.hasError$.next(true);
        this.isLoading$.next(false);
      },
    });
  }

  setLevel(level: HskLevel): void {
    this.currentLevel$.next(level);
    this.loadCards(level);
  }

  setLanguageMode(mode: LanguageMode): void {
    this.languageMode$.next(mode);
  }

  nextCard(): void {
    const queue = this.cardQueue$.value;
    if (queue.length === 0) return;
    const next = (this.currentCardIndex$.value + 1) % queue.length;
    this.currentCardIndex$.next(next);
  }

  resetAll(): void {
    this.storageService.resetAll();
    const level = this.currentLevel$.value;
    const cards = this.cardQueue$.value;
    this.cardQueue$.next(this.sortByFrequency(cards, level));
    this.currentCardIndex$.next(0);
  }

  /**
   * Cards with higher (recalled - remembered) weight appear earlier in queue.
   * Ties broken by original order.
   */
  private sortByFrequency(cards: Flashcard[], level: string): Flashcard[] {
    return [...cards].sort((a, b) => {
      const sa = this.storageService.getState(level, a.id);
      const sb = this.storageService.getState(level, b.id);
      const wa = sa.recalled - sa.remembered;
      const wb = sb.recalled - sb.remembered;
      return wb - wa;
    });
  }
}
