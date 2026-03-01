import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flashcard, FlashcardService } from './flashcard.service';
import { StorageService } from './storage.service';

/** The "main face" of the card shown before flipping. */
export type LanguageMode = 'chinese' | 'vietnamese';

export const HSK_LEVELS = ['hsk3', 'hsk4', 'hsk5', 'hsk6', 'hsk7', 'hsk8', 'hsk9'] as const;
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
  readonly recallCount$ = new BehaviorSubject<number>(0);
  readonly rememberCount$ = new BehaviorSubject<number>(0);

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
    this.recallCount$.next(0);
    this.rememberCount$.next(0);

    this.flashcardService.getCards(level).subscribe({
      next: (cards) => {
        if (cards.length === 0) {
          this.hasError$.next(true);
        }
        this.cardQueue$.next(this.shuffle(cards));
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
    const nextIndex = this.currentCardIndex$.value + 1;
    if (nextIndex >= queue.length) {
      // Reshuffle and start a new cycle
      this.cardQueue$.next(this.shuffle([...queue]));
      this.currentCardIndex$.next(0);
    } else {
      this.currentCardIndex$.next(nextIndex);
    }
  }

  resetAll(): void {
    this.storageService.resetLevel(this.currentLevel$.value);
    this.recallCount$.next(0);
    this.rememberCount$.next(0);
    this.currentCardIndex$.next(0);
  }

  recordRecall(cardId: string): void {
    this.storageService.incrementRecalled(this.currentLevel$.value, cardId);
    this.recallCount$.next(this.recallCount$.value + 1);
  }

  recordRemember(cardId: string): void {
    this.storageService.incrementRemembered(this.currentLevel$.value, cardId);
    this.rememberCount$.next(this.rememberCount$.value + 1);
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
