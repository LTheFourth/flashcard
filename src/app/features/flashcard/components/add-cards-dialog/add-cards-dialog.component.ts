import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlashcardService, FlashcardInput } from '../../../../core/services/flashcard.service';
import { HSK_LEVELS } from '../../../../core/services/state.service';

@Component({
  selector: 'app-add-cards-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .dialog {
      background: var(--surface);
      border: 1px solid var(--divider);
      border-radius: 12px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--divider);
      flex-shrink: 0;
    }

    .title {
      font-family: 'Crimson Pro', serif;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: var(--on-dark);
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--on-dark-muted);
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.15s;
    }

    .close-btn:hover {
      color: var(--on-dark);
    }

    .content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-family: 'Courier Prime', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--on-dark-muted);
      font-weight: 600;
    }

    .level-dropdown {
      position: relative;
      display: inline-block;
      width: fit-content;
    }

    .level-btn {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider);
      background: var(--surface-2);
      color: var(--on-dark);
      font-family: 'Crimson Pro', serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 140px;
    }

    .level-btn:hover {
      background: var(--surface-3);
      border-color: var(--accent);
    }

    .level-dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      border-radius: 6px;
      border: 1px solid var(--divider);
      background: var(--surface);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      z-index: 101;
      min-width: 140px;
      overflow: hidden;
    }

    .level-menu-item {
      padding: 10px 14px;
      font-family: 'Crimson Pro', serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: var(--on-dark-muted);
      cursor: pointer;
      transition: all 0.12s;
      text-align: left;
    }

    .level-menu-item:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }

    .level-menu-item.selected {
      background: var(--accent-pale);
      color: var(--accent);
      border-left: 3px solid var(--accent);
      padding-left: 11px;
    }

    .textarea {
      font-family: 'Courier Prime', monospace;
      font-size: 12px;
      background: var(--surface-2);
      border: 1px solid var(--divider);
      border-radius: 6px;
      color: var(--on-dark);
      padding: 12px;
      line-height: 1.5;
      resize: vertical;
      min-height: 200px;
      transition: border-color 0.15s;
    }

    .textarea::placeholder {
      color: var(--on-dark-muted);
    }

    .textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(201, 79, 45, 0.1);
    }

    .status-message {
      font-family: 'Courier Prime', monospace;
      font-size: 12px;
      letter-spacing: 0.02em;
      padding: 12px;
      border-radius: 6px;
      line-height: 1.5;
      min-height: 44px;
      display: flex;
      align-items: center;
    }

    .status-error {
      background: rgba(201, 79, 45, 0.15);
      color: var(--accent);
      border: 1px solid rgba(201, 79, 45, 0.25);
    }

    .status-success {
      background: rgba(58, 124, 86, 0.15);
      color: var(--green);
      border: 1px solid rgba(58, 124, 86, 0.25);
    }

    .status-info {
      background: rgba(255, 255, 255, 0.05);
      color: var(--on-dark-muted);
      border: 1px solid var(--divider);
    }

    .footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid var(--divider);
      flex-shrink: 0;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid var(--divider);
      font-family: 'Crimson Pro', serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-cancel {
      background: transparent;
      color: var(--on-dark-muted);
    }

    .btn-cancel:hover {
      background: var(--surface-2);
      color: var(--on-dark);
    }

    .btn-submit {
      background: transparent;
      border: 1px solid rgba(58, 124, 86, 0.5);
      color: var(--green);
    }

    .btn-submit:hover:not(:disabled) {
      background: var(--green-pale);
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dropdown-arrow {
      font-size: 10px;
      opacity: 0.6;
      transition: transform 0.2s;
    }

    .level-btn.open .dropdown-arrow {
      transform: rotate(180deg);
    }
  `],
  template: `
    <div class="backdrop" (click)="handleBackdropClick()">
      <div class="dialog" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="header">
          <h2 class="title">Add Flashcards</h2>
          <button class="close-btn" (click)="handleClose()" title="Close dialog">✕</button>
        </div>

        <!-- Content -->
        <div class="content">

          <!-- Level Selection -->
          <div class="form-group">
            <label class="form-label">Target HSK Level</label>
            <div class="level-dropdown">
              <button
                class="level-btn"
                [class.open]="isLevelDropdownOpen()"
                (click)="toggleLevelDropdown()"
              >
                {{ levelLabel(selectedLevel()) }}
                <span class="dropdown-arrow">▼</span>
              </button>

              @if (isLevelDropdownOpen()) {
                <div class="level-dropdown-menu">
                  @for (level of hskLevels; track level) {
                    <div
                      class="level-menu-item"
                      [class.selected]="level === selectedLevel()"
                      (click)="selectLevel(level); closeLevelDropdown()"
                    >
                      {{ levelLabel(level) }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- JSON Input -->
          <div class="form-group">
            <label class="form-label">Paste JSON Array</label>
            <textarea
              class="textarea"
              [value]="jsonText()"
              (input)="handleTextareaInput($event)"
              placeholder="[&#10;  {&quot;chinese&quot;: &quot;好&quot;, &quot;pinyin&quot;: &quot;hǎo&quot;, &quot;vietnamese&quot;: &quot;tốt&quot;, &quot;example&quot;: &quot;很好&quot;, &quot;example_vi&quot;: &quot;rất tốt&quot;},&#10;  ...&#10;]"
              [disabled]="isSubmitting()"
            ></textarea>
          </div>

          <!-- Status Messages -->
          @if (parseError()) {
            <div class="status-message status-error">
              ⚠ {{ parseError() }}
            </div>
          }
          @if (!parseError() && parsedCount() !== null && parsedCount()! > 0) {
            <div class="status-message status-success">
              ✓ {{ parsedCount() }} {{ parsedCount() === 1 ? 'card' : 'cards' }} ready to submit
            </div>
          }
          @if (submitResult() === 'success') {
            <div class="status-message status-success">
              ✓ {{ resultMessage() }}
            </div>
          }
          @if (submitResult() === 'error') {
            <div class="status-message status-error">
              ⚠ {{ resultMessage() }}
            </div>
          }

        </div>

        <!-- Footer -->
        <div class="footer">
          <button
            class="btn btn-cancel"
            (click)="handleClose()"
            [disabled]="isSubmitting()"
          >
            Cancel
          </button>
          <button
            class="btn btn-submit"
            (click)="submit()"
            [disabled]="isSubmitting() || parseError() !== null || parsedCount() === null || parsedCount()! === 0"
          >
            {{ isSubmitting() ? 'Submitting...' : 'Submit →' }}
          </button>
        </div>

      </div>
    </div>
  `,
})
export class AddCardsDialogComponent {
  private flashcardService = inject(FlashcardService);

  readonly onClose = output<void>();

  readonly selectedLevel = signal<string>('hsk3');
  readonly jsonText = signal<string>('');
  readonly parseError = signal<string | null>(null);
  readonly parsedCount = signal<number | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly submitResult = signal<'success' | 'error' | null>(null);
  readonly resultMessage = signal<string>('');
  readonly isLevelDropdownOpen = signal(false);

  readonly hskLevels = HSK_LEVELS;

  levelLabel(level: string): string {
    return level.replace('hsk', 'HSK ');
  }

  toggleLevelDropdown(): void {
    this.isLevelDropdownOpen.update((v) => !v);
  }

  closeLevelDropdown(): void {
    this.isLevelDropdownOpen.set(false);
  }

  selectLevel(level: string): void {
    this.selectedLevel.set(level);
  }

  handleTextareaInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.jsonText.set(target.value);
    this.handleJsonInput();
  }

  handleJsonInput(): void {
    const text = this.jsonText();
    if (!text.trim()) {
      this.parseError.set(null);
      this.parsedCount.set(null);
      return;
    }

    try {
      const data = JSON.parse(text);
      const cards = this.validateCards(data);
      this.parseError.set(null);
      this.parsedCount.set(cards.length);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      this.parseError.set(msg);
      this.parsedCount.set(null);
    }
  }

  private validateCards(data: unknown): FlashcardInput[] {
    if (!Array.isArray(data)) throw new Error('JSON must be an array');
    const required = ['chinese', 'pinyin', 'vietnamese', 'example', 'example_vi'];
    return data.map((item, i) => {
      for (const field of required) {
        if (typeof item[field] !== 'string') {
          throw new Error(`Item ${i + 1}: missing or invalid "${field}"`);
        }
      }
      return item as FlashcardInput;
    });
  }

  submit(): void {
    const text = this.jsonText();
    if (!text.trim() || this.parseError() || this.parsedCount() === null) {
      return;
    }

    try {
      const data = JSON.parse(text);
      const cards = this.validateCards(data);

      this.isSubmitting.set(true);
      this.flashcardService.postCards(this.selectedLevel(), cards).subscribe({
        next: (res) => {
          this.submitResult.set('success');
          this.resultMessage.set(`✓ Added ${cards.length} ${cards.length === 1 ? 'card' : 'cards'} to ${this.levelLabel(this.selectedLevel())}`);
          this.isSubmitting.set(false);
          setTimeout(() => this.handleClose(), 1500);
        },
        error: (err) => {
          this.submitResult.set('error');
          this.resultMessage.set('Failed to submit. Check your connection.');
          this.isSubmitting.set(false);
          console.error('Post cards error:', err);
        },
      });
    } catch (err) {
      this.submitResult.set('error');
      this.resultMessage.set('Invalid data. Please check your JSON.');
      this.isSubmitting.set(false);
    }
  }

  handleClose(): void {
    this.onClose.emit();
  }

  handleBackdropClick(): void {
    this.onClose.emit();
  }
}
