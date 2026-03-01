import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, EMPTY, merge } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { openDB, IDBPDatabase } from 'idb';

export interface Flashcard {
  id: string;          // stable identifier: base-36 hash of chinese characters
  chinese: string;
  pinyin: string;
  vietnamese: string;
  example: string;
  example_vi: string;
  level?: string;
}

/** Raw shape returned by the API (no id, no level) */
type FlashcardPayload = Omit<Flashcard, 'id' | 'level'>;

/** Input shape for posting new flashcards (no id, no level) */
export type FlashcardInput = Omit<Flashcard, 'id' | 'level'>;

/** Deterministic base-36 hash of Chinese characters — stable across app restarts */
function generateId(chinese: string): string {
  let h = 5381;
  for (let i = 0; i < chinese.length; i++) {
    h = (Math.imul(h, 33) ^ chinese.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

const API_BASE = 'https://flashcard-be-eight.vercel.app';
const DB_NAME = 'flashcard-db';
const DB_VERSION = 1;
const STORE_NAME = 'flashcards';

const MOCK_DATA: Record<string, Flashcard[]> = {
  hsk3: [
    { id: generateId('安静'), chinese: '安静', pinyin: 'ānjìng', vietnamese: 'yên tĩnh', example: '请保持安静。', example_vi: 'Xin hãy giữ im lặng.' },
    { id: generateId('办法'), chinese: '办法', pinyin: 'bànfǎ', vietnamese: 'cách, biện pháp', example: '我有一个好办法。', example_vi: 'Tôi có một cách hay.' },
    { id: generateId('参加'), chinese: '参加', pinyin: 'cānjiā', vietnamese: 'tham gia', example: '我想参加这个活动。', example_vi: 'Tôi muốn tham gia hoạt động này.' },
    { id: generateId('地方'), chinese: '地方', pinyin: 'dìfāng', vietnamese: 'nơi chốn, địa phương', example: '这个地方很美。', example_vi: 'Nơi này rất đẹp.' },
    { id: generateId('发现'), chinese: '发现', pinyin: 'fāxiàn', vietnamese: 'phát hiện', example: '我发现了一个秘密。', example_vi: 'Tôi đã phát hiện ra một bí mật.' },
  ],
  hsk4: [
    { id: generateId('爱护'), chinese: '爱护', pinyin: 'àihù', vietnamese: 'yêu quý, bảo vệ', example: '我们要爱护环境。', example_vi: 'Chúng ta phải bảo vệ môi trường.' },
    { id: generateId('摆'), chinese: '摆', pinyin: 'bǎi', vietnamese: 'đặt, bày', example: '把书摆在桌子上。', example_vi: 'Đặt sách lên bàn.' },
    { id: generateId('采用'), chinese: '采用', pinyin: 'cǎiyòng', vietnamese: 'áp dụng, sử dụng', example: '我们采用了新技术。', example_vi: 'Chúng tôi đã áp dụng công nghệ mới.' },
    { id: generateId('大概'), chinese: '大概', pinyin: 'dàgài', vietnamese: 'đại khái, khoảng', example: '大概需要一个小时。', example_vi: 'Cần khoảng một giờ.' },
    { id: generateId('否则'), chinese: '否则', pinyin: 'fǒuzé', vietnamese: 'nếu không, bằng không', example: '快点，否则会迟到。', example_vi: 'Nhanh lên, nếu không sẽ bị muộn.' },
  ],
  hsk5: [
    { id: generateId('爱不释手'), chinese: '爱不释手', pinyin: 'ài bù shì shǒu', vietnamese: 'yêu thích không rời tay', example: '这本书让我爱不释手。', example_vi: 'Cuốn sách này khiến tôi không thể rời tay.' },
    { id: generateId('辩证'), chinese: '辩证', pinyin: 'biànzhèng', vietnamese: 'biện chứng', example: '要用辩证的方法看问题。', example_vi: 'Phải nhìn vấn đề bằng phương pháp biện chứng.' },
    { id: generateId('承担'), chinese: '承担', pinyin: 'chéngdān', vietnamese: 'gánh chịu, đảm nhận', example: '你必须承担责任。', example_vi: 'Bạn phải chịu trách nhiệm.' },
    { id: generateId('当务之急'), chinese: '当务之急', pinyin: 'dāng wù zhī jí', vietnamese: 'việc cấp bách hiện tại', example: '当务之急是解决这个问题。', example_vi: 'Việc cấp bách hiện tại là giải quyết vấn đề này.' },
    { id: generateId('奋斗'), chinese: '奋斗', pinyin: 'fèndòu', vietnamese: 'phấn đấu, nỗ lực', example: '为理想而奋斗。', example_vi: 'Phấn đấu vì lý tưởng.' },
  ],
};

@Injectable({ providedIn: 'root' })
export class FlashcardService {
  private db: IDBPDatabase | null = null;

  constructor(private http: HttpClient) {}

  private async getDb(): Promise<IDBPDatabase> {
    if (this.db) return this.db;
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: ['level', 'chinese'],
          });
          store.createIndex('by-level', 'level');
        }
      },
    });
    return this.db;
  }

  private async readFromCache(level: string): Promise<Flashcard[]> {
    const db = await this.getDb();
    const results = await db.getAllFromIndex(STORE_NAME, 'by-level', level);
    // Backfill id for records written before this field was introduced
    return (results as Flashcard[]).map(card => ({
      ...card,
      id: card.id ?? generateId(card.chinese),
    }));
  }

  private async writeToCache(level: string, cards: Flashcard[]): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // Clear existing cards for this level
    const existing = await tx.store.index('by-level').getAllKeys(level);
    for (const key of existing) {
      await tx.store.delete(key);
    }
    // Write new cards
    for (const card of cards) {
      await tx.store.put({ ...card, level });
    }
    await tx.done;
  }

  private isDataEqual(a: Flashcard[], b: Flashcard[]): boolean {
    if (a.length !== b.length) return false;
    const sortFn = (x: Flashcard, y: Flashcard) => x.chinese.localeCompare(y.chinese);
    const normalize = (arr: Flashcard[]) =>
      [...arr].sort(sortFn).map(({ chinese, pinyin, vietnamese, example, example_vi }) =>
        ({ chinese, pinyin, vietnamese, example, example_vi }));
    return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
  }

  getCards(level: string): Observable<Flashcard[]> {
    return from(this.readFromCache(level)).pipe(
      switchMap((cached) => {
        // Emit cached data immediately if available
        const emitCached$ = cached.length > 0 ? of(cached) : EMPTY;

        // Fetch fresh data in background
        const apiUpdate$ = this.http
          .get<FlashcardPayload[]>(`${API_BASE}/flashcards/${level}`)
          .pipe(
            switchMap((raw) => {
              // Assign stable IDs from chinese characters (API does not provide id)
              const fetched: Flashcard[] = raw.map(card => ({
                ...card,
                id: generateId(card.chinese),
              }));
              // Only emit if data changed
              if (!this.isDataEqual(cached, fetched)) {
                this.writeToCache(level, fetched).catch(console.error);
                return of(fetched);
              }
              // Data unchanged — no UI update needed
              return EMPTY;
            }),
            catchError(() => {
              // API failed
              if (cached.length > 0) {
                // Cache was already emitted, stay silent
                return EMPTY;
              }
              // No cache — use mock (dev) or empty array (prod)
              if (isDevMode() && MOCK_DATA[level]) {
                console.warn(`[DEV] API and cache failed for ${level} — using mock data`);
                return of(MOCK_DATA[level]);
              }
              return of([]);
            })
          );

        // Emit cached data first, then API update if different
        return merge(emitCached$, apiUpdate$);
      })
    );
  }

  isApiHealthy(): Observable<boolean> {
    return this.http.get<{ status: string }>(`${API_BASE}/health`).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  postCards(level: string, cards: FlashcardInput[]): Observable<{ message: string; total: number }> {
    return this.http.post<{ message: string; total: number }>(`${API_BASE}/flashcards/${level}`, cards);
  }
}
