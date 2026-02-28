import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService, HSK_LEVELS, HskLevel, LanguageMode } from '../../../../core/services/state.service';

const LANGUAGE_LABELS: Record<LanguageMode, string> = {
  chinese: '中文 → Việt',
  vietnamese: 'Việt → 中文',
};

@Component({
  selector: 'app-controller-bar',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--divider);
      flex-shrink: 0;
    }
    .level-group {
      display: flex;
      gap: 4px;
    }
    .level-btn {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider);
      background: transparent;
      color: var(--on-dark-muted);
      font-family: 'Crimson Pro', serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .level-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .level-btn:not(.active):hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }
    .lang-btn {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider);
      background: transparent;
      color: var(--on-dark-muted);
      font-family: 'Courier Prime', monospace;
      font-size: 11px;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .lang-btn:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }
    .reset-btn {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid rgba(201, 79, 45, 0.25);
      background: transparent;
      color: var(--accent);
      font-family: 'Crimson Pro', serif;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background 0.15s;
    }
    .reset-btn:hover {
      background: var(--accent-pale);
    }
  `],
  template: `
    <div class="bar">

      <div class="level-group">
        @for (level of hskLevels; track level) {
          <button
            (click)="selectLevel(level)"
            class="level-btn"
            [class.active]="currentLevel === level"
          >
            {{ levelLabel(level) }}
          </button>
        }
      </div>

      <button
        (click)="toggleLanguage()"
        class="lang-btn"
        [title]="languageHint"
      >
        {{ currentLanguageLabel }}
      </button>

      <button
        (click)="reset()"
        class="reset-btn"
        title="Reset all progress"
      >
        Reset
      </button>

    </div>
  `,
})
export class ControllerBarComponent {
  private state = inject(StateService);

  readonly hskLevels = HSK_LEVELS;

  get currentLevel(): HskLevel {
    return this.state.currentLevel$.value;
  }

  get currentLanguageLabel(): string {
    return LANGUAGE_LABELS[this.state.languageMode$.value];
  }

  get languageHint(): string {
    return this.state.languageMode$.value === 'chinese'
      ? 'Front: Chinese hanzi — Flip to see Vietnamese + Pinyin'
      : 'Front: Vietnamese + Pinyin — Flip to see Chinese hanzi';
  }

  levelLabel(level: HskLevel): string {
    return level.replace('hsk', 'HSK ');
  }

  selectLevel(level: HskLevel): void {
    if (level !== this.currentLevel) {
      this.state.setLevel(level);
    }
  }

  toggleLanguage(): void {
    const next: LanguageMode =
      this.state.languageMode$.value === 'chinese' ? 'vietnamese' : 'chinese';
    this.state.setLanguageMode(next);
  }

  reset(): void {
    this.state.resetAll();
  }
}
