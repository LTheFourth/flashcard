import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { openDB, IDBPDatabase } from 'idb';

export interface Flashcard {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  example: string;
  example_vi: string;
  level?: string;
}

const API_BASE = 'https://flashcard-be-eight.vercel.app';
const DB_NAME = 'flashcard-db';
const DB_VERSION = 1;
const STORE_NAME = 'flashcards';

const MOCK_DATA: Record<string, Flashcard[]> = {
  hsk3: [
    { chinese: '安静', pinyin: 'ānjìng', vietnamese: 'yên tĩnh', example: '请保持安静。', example_vi: 'Xin hãy giữ im lặng.' },
    { chinese: '办法', pinyin: 'bànfǎ', vietnamese: 'cách, biện pháp', example: '我有一个好办法。', example_vi: 'Tôi có một cách hay.' },
    { chinese: '参加', pinyin: 'cānjiā', vietnamese: 'tham gia', example: '我想参加这个活动。', example_vi: 'Tôi muốn tham gia hoạt động này.' },
    { chinese: '地方', pinyin: 'dìfāng', vietnamese: 'nơi chốn, địa phương', example: '这个地方很美。', example_vi: 'Nơi này rất đẹp.' },
    { chinese: '发现', pinyin: 'fāxiàn', vietnamese: 'phát hiện', example: '我发现了一个秘密。', example_vi: 'Tôi đã phát hiện ra một bí mật.' },
  ],
  hsk4: [
    { chinese: '爱护', pinyin: 'àihù', vietnamese: 'yêu quý, bảo vệ', example: '我们要爱护环境。', example_vi: 'Chúng ta phải bảo vệ môi trường.' },
    { chinese: '摆', pinyin: 'bǎi', vietnamese: 'đặt, bày', example: '把书摆在桌子上。', example_vi: 'Đặt sách lên bàn.' },
    { chinese: '采用', pinyin: 'cǎiyòng', vietnamese: 'áp dụng, sử dụng', example: '我们采用了新技术。', example_vi: 'Chúng tôi đã áp dụng công nghệ mới.' },
    { chinese: '大概', pinyin: 'dàgài', vietnamese: 'đại khái, khoảng', example: '大概需要一个小时。', example_vi: 'Cần khoảng một giờ.' },
    { chinese: '否则', pinyin: 'fǒuzé', vietnamese: 'nếu không, bằng không', example: '快点，否则会迟到。', example_vi: 'Nhanh lên, nếu không sẽ bị muộn.' },
  ],
  hsk5: [
    { chinese: '爱不释手', pinyin: 'ài bù shì shǒu', vietnamese: 'yêu thích không rời tay', example: '这本书让我爱不释手。', example_vi: 'Cuốn sách này khiến tôi không thể rời tay.' },
    { chinese: '辩证', pinyin: 'biànzhèng', vietnamese: 'biện chứng', example: '要用辩证的方法看问题。', example_vi: 'Phải nhìn vấn đề bằng phương pháp biện chứng.' },
    { chinese: '承担', pinyin: 'chéngdān', vietnamese: 'gánh chịu, đảm nhận', example: '你必须承担责任。', example_vi: 'Bạn phải chịu trách nhiệm.' },
    { chinese: '当务之急', pinyin: 'dāng wù zhī jí', vietnamese: 'việc cấp bách hiện tại', example: '当务之急是解决这个问题。', example_vi: 'Việc cấp bách hiện tại là giải quyết vấn đề này.' },
    { chinese: '奋斗', pinyin: 'fèndòu', vietnamese: 'phấn đấu, nỗ lực', example: '为理想而奋斗。', example_vi: 'Phấn đấu vì lý tưởng.' },
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
    return results as Flashcard[];
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

  getCards(level: string): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${API_BASE}/flashcards/${level}`).pipe(
      tap((cards) => {
        this.writeToCache(level, cards).catch(console.error);
      }),
      catchError(() =>
        from(this.readFromCache(level)).pipe(
          switchMap((cached) => {
            if (cached.length > 0) return of(cached);
            if (isDevMode() && MOCK_DATA[level]) {
              console.warn(`[DEV] API and cache failed for ${level} — using mock data`);
              return of(MOCK_DATA[level]);
            }
            return of([]);
          })
        )
      )
    );
  }

  isApiHealthy(): Observable<boolean> {
    return this.http.get<{ status: string }>(`${API_BASE}/health`).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }
}
