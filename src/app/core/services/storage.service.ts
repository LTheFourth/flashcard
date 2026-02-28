import { Injectable } from '@angular/core';

export interface CardState {
  recalled: number;
  remembered: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key(level: string, chinese: string): string {
    return `card:${level}:${chinese}`;
  }

  getState(level: string, chinese: string): CardState {
    const raw = localStorage.getItem(this.key(level, chinese));
    if (!raw) return { recalled: 0, remembered: 0 };
    try {
      return JSON.parse(raw) as CardState;
    } catch {
      return { recalled: 0, remembered: 0 };
    }
  }

  incrementRecalled(level: string, chinese: string): void {
    const state = this.getState(level, chinese);
    state.recalled += 1;
    localStorage.setItem(this.key(level, chinese), JSON.stringify(state));
  }

  incrementRemembered(level: string, chinese: string): void {
    const state = this.getState(level, chinese);
    state.remembered += 1;
    localStorage.setItem(this.key(level, chinese), JSON.stringify(state));
  }

  resetAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('card:')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}
