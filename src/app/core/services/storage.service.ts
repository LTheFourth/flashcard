import { Injectable } from '@angular/core';

export interface CardState {
  recalled: number;
  remembered: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key(level: string, id: string): string {
    return `card:${level}:${id}`;
  }

  getState(level: string, id: string): CardState {
    const raw = localStorage.getItem(this.key(level, id));
    if (!raw) return { recalled: 0, remembered: 0 };
    try {
      return JSON.parse(raw) as CardState;
    } catch {
      return { recalled: 0, remembered: 0 };
    }
  }

  incrementRecalled(level: string, id: string): void {
    const state = this.getState(level, id);
    state.recalled += 1;
    localStorage.setItem(this.key(level, id), JSON.stringify(state));
  }

  incrementRemembered(level: string, id: string): void {
    const state = this.getState(level, id);
    state.remembered += 1;
    localStorage.setItem(this.key(level, id), JSON.stringify(state));
  }

  resetLevel(level: string): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`card:${level}:`)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}
