import { Component, inject, output, signal } from '@angular/core';
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
      gap: 12px;
      padding: 10px 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--divider);
      flex-shrink: 0;
    }

    /* ── HSK Level Dropdown ── */
    .level-dropdown {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .level-btn {
      padding: 7px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider);
      background: transparent;
      color: var(--on-dark-muted);
      font-family: 'Crimson Pro', serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .level-btn:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }

    .level-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }

    .dropdown-arrow {
      font-size: 10px;
      opacity: 0.6;
      transition: transform 0.2s;
    }

    .level-btn.open .dropdown-arrow {
      transform: rotate(180deg);
    }

    /* ── Dropdown Menu ── */
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      border-radius: 8px;
      border: 1px solid var(--divider);
      background: var(--surface);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      z-index: 100;
      min-width: 120px;
      overflow: hidden;
    }

    .menu-item {
      padding: 10px 16px;
      font-family: 'Crimson Pro', serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: var(--on-dark-muted);
      cursor: pointer;
      transition: all 0.12s;
      text-align: left;
    }

    .menu-item:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }

    .menu-item.selected {
      background: var(--accent-pale);
      color: var(--accent);
      border-left: 3px solid var(--accent);
      padding-left: 13px;
    }

    /* ── Language Toggle ── */
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
      transition: all 0.15s;
      white-space: nowrap;
    }

    .lang-btn:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }

    /* ── Reset Button ── */
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
      transition: all 0.15s;
    }

    .reset-btn:hover {
      background: var(--accent-pale);
    }

    /* ── Add Button ── */
    .add-btn {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid rgba(58, 124, 86, 0.25);
      background: transparent;
      color: var(--green);
      font-family: 'Crimson Pro', serif;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 0.15s;
    }

    .add-btn:hover {
      background: var(--green-pale);
    }
  `],
  template: `
    <div class="bar">

      <!-- HSK Level Dropdown -->
      <div class="level-dropdown">
        <button
          class="level-btn"
          [class.active]="true"
          [class.open]="isDropdownOpen()"
          (click)="toggleDropdown()"
        >
          {{ levelLabel(currentLevel) }}
          <span class="dropdown-arrow">▼</span>
        </button>

        @if (isDropdownOpen()) {
          <div class="dropdown-menu">
            @for (level of hskLevels; track level) {
              <div
                class="menu-item"
                [class.selected]="level === currentLevel"
                (click)="selectLevel(level); closeDropdown()"
              >
                {{ levelLabel(level) }}
              </div>
            }
          </div>
        }
      </div>

      <!-- Language Toggle -->
      <button
        (click)="toggleLanguage()"
        class="lang-btn"
        [title]="languageHint"
      >
        {{ currentLanguageLabel }}
      </button>

      <!-- Reset Button -->
      <button
        (click)="reset()"
        class="reset-btn"
        title="Reset all progress"
      >
        Reset
      </button>

      <!-- Add Cards Button -->
      <button
        (click)="onAddCards.emit()"
        class="add-btn"
        title="Add flashcards to a level"
      >
        + Add
      </button>

    </div>
  `,
})
export class ControllerBarComponent {
  private state = inject(StateService);

  readonly hskLevels = HSK_LEVELS;
  readonly isDropdownOpen = signal(false);
  readonly onAddCards = output<void>();

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

  toggleDropdown(): void {
    this.isDropdownOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
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
