// Flashcard HSK Service Worker - Enhanced Offline Support
const CACHE_NAME = 'flashcard-hsk-v1.0.0';
const DATA_CACHE_NAME = 'flashcard-data-v1.0.0';

// Core application files that need to be cached for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/src/utils/flashcardApp.js',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/styles/index.css',
  '/manifest.json',
  // Icons
  '/android/android-launchericon-72-72.png',
  '/android/android-launchericon-96-96.png',
  '/android/android-launchericon-128-128.png',
  '/android/android-launchericon-144-144.png',
  '/android/android-launchericon-152-152.png',
  '/android/android-launchericon-192-192.png',
  '/android/android-launchericon-384-384.png',
  '/android/android-launchericon-512-512.png',
  // External resources (CDN) - cached for offline
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Flashcard data to be cached for offline use
const FLASHCARD_DATA = {
  hsk3: [
    { "chinese": "安静", "pinyin": "ānjìng", "vietnamese": "yên tĩnh, trầm lặng", "example": "请安静，图书馆里不准大声说话。", "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng." },
    { "chinese": "把", "pinyin": "bǎ", "vietnamese": "dùng để đưa tân ngữ lên trước động từ", "example": "请把这本书给我。", "example_vi": "Làm ơn đưa cuốn sách này cho tôi." },
    { "chinese": "班", "pinyin": "bān", "vietnamese": "lớp học, ca làm", "example": "我们班有二十个学生。", "example_vi": "Lớp chúng tôi có hai mươi học sinh." },
    { "chinese": "搬", "pinyin": "bān", "vietnamese": "dọn, chuyển (đồ, nhà)", "example": "我下个星期要搬家。", "example_vi": "Tuần tới tôi phải chuyển nhà." },
    { "chinese": "办法", "pinyin": "bànfǎ", "vietnamese": "cách, biện pháp", "example": "你有什么好办法吗？", "example_vi": "Bạn có cách nào hay không?" },
    { "chinese": "办公室", "pinyin": "bàngōngshì", "vietnamese": "văn phòng", "example": "经理在办公室里等你。", "example_vi": "Giám đốc đang đợi bạn trong văn phòng." },
    { "chinese": "半", "pinyin": "bàn", "vietnamese": "nửa", "example": "现在是三点半。", "example_vi": "Bây giờ là ba giờ rưỡi." },
    { "chinese": "帮忙", "pinyin": "bāngmáng", "vietnamese": "giúp, giúp đỡ", "example": "你能帮我一个忙吗？", "example_vi": "Bạn có thể giúp tôi một việc được không?" },
    { "chinese": "包", "pinyin": "bāo", "vietnamese": "túi, bao", "example": "我的包是黑色的。", "example_vi": "Túi của tôi màu đen." },
    { "chinese": "饱", "pinyin": "bǎo", "vietnamese": "no, đầy bụng", "example": "我吃饱了，谢谢。", "example_vi": "Tôi no rồi, cảm ơn." },
    { "chinese": "北方", "pinyin": "běifāng", "vietnamese": "miền Bắc", "example": "北方的冬天很冷。", "example_vi": "Mùa đông ở miền Bắc rất lạnh." },
    { "chinese": "被", "pinyin": "bèi", "vietnamese": "bị (dùng trong câu bị động)", "example": "我的钱包被偷了。", "example_vi": "Ví tiền của tôi đã bị trộm mất." },
    { "chinese": "鼻子", "pinyin": "bízi", "vietnamese": "mũi", "example": "他的鼻子很高。", "example_vi": "Mũi của anh ấy rất cao." },
    { "chinese": "比较", "pinyin": "bǐjiào", "vietnamese": "khá, tương đối", "example": "今天的天气比较好。", "example_vi": "Thời tiết hôm nay khá tốt." },
    { "chinese": "比赛", "pinyin": "bǐsài", "vietnamese": "thi đấu, cuộc thi", "example": "你看了昨天的足球比赛吗？", "example_vi": "Bạn đã xem trận đấu bóng đá ngày hôm qua chưa?" },
    { "chinese": "笔记本", "pinyin": "bǐjìběn", "vietnamese": "sổ ghi chép, laptop", "example": "我忘带笔记本了。", "example_vi": "Tôi quên mang sổ tay rồi." },
    { "chinese": "必须", "pinyin": "bìxū", "vietnamese": "phải, bắt buộc", "example": "你必须按时完成作业。", "example_vi": "Bạn phải hoàn thành bài tập đúng giờ." },
    { "chinese": "变化", "pinyin": "biànhuà", "vietnamese": "thay đổi", "example": "这个城市的变化很大。", "example_vi": "Sự thay đổi của thành phố này rất lớn." },
    { "chinese": "别人", "pinyin": "biéren", "vietnamese": "người khác", "example": "不要在背后说别人的坏话。", "example_vi": "Đừng nói xấu người khác sau lưng." },
    { "chinese": "冰箱", "pinyin": "bīngxiāng", "vietnamese": "tủ lạnh", "example": "冰箱里还有牛奶吗？", "example_vi": "Trong tủ lạnh còn sữa không?" },
    { "chinese": "不但...而且...", "pinyin": "bùdàn... érqiě...", "vietnamese": "không những... mà còn...", "example": "他不但会说英语，而且还会说法语。", "example_vi": "Anh ấy không những biết nói tiếng Anh mà còn biết nói tiếng Pháp." },
    { "chinese": "菜单", "pinyin": "càidān", "vietnamese": "thực đơn", "example": "服务员，请给我菜单。", "example_vi": "Phục vụ, cho tôi xin thực đơn." },
    { "chinese": "参加", "pinyin": "cānjiā", "vietnamese": "tham gia", "example": "我想参加这个活动。", "example_vi": "Tôi muốn tham gia hoạt động này." },
    { "chinese": "草", "pinyin": "cǎo", "vietnamese": "cỏ", "example": "公园里有很多绿色的草。", "example_vi": "Trong công viên có rất nhiều cỏ xanh." },
    { "chinese": "层", "pinyin": "céng", "vietnamese": "tầng (nhà)", "example": "我住在三层。", "example_vi": "Tôi sống ở tầng ba." },
    { "chinese": "差", "pinyin": "chà", "vietnamese": "thiếu, kém", "example": "我的数学成绩很差。", "example_vi": "Thành tích môn toán của tôi rất kém." },
    { "chinese": "超市", "pinyin": "chāoshì", "vietnamese": "siêu thị", "example": "我们去超市买点东西吧。", "example_vi": "Chúng ta đi siêu thị mua chút đồ đi." },
    { "chinese": "衬衫", "pinyin": "chènshān", "vietnamese": "áo sơ mi", "example": "他今天穿了一件白衬衫。", "example_vi": "Hôm nay anh ấy mặc một chiếc áo sơ mi trắng." },
    { "chinese": "成绩", "pinyin": "chéngjì", "vietnamese": "thành tích, kết quả", "example": "这次考试我的成绩很好。", "example_vi": "Kết quả bài kiểm tra lần này của tôi rất tốt." },
    { "chinese": "城市", "pinyin": "chéngshì", "vietnamese": "thành phố", "example": "北京是一个大城市。", "example_vi": "Bắc Kinh là một thành phố lớn." },
    { "chinese": "迟到", "pinyin": "chídào", "vietnamese": "đến muộn", "example": "对不起，我今天迟到了。", "example_vi": "Xin lỗi, hôm nay tôi đến muộn." },
    { "chinese": "出现", "pinyin": "chūxiàn", "vietnamese": "xuất hiện", "example": "问题终于出现了。", "example_vi": "Vấn đề cuối cùng cũng đã xuất hiện." },
    { "chinese": "厨房", "pinyin": "chúfáng", "vietnamese": "nhà bếp", "example": "妈妈正在厨房做饭。", "example_vi": "Mẹ đang nấu ăn trong bếp." },
    { "chinese": "除了", "pinyin": "chúle", "vietnamese": "ngoài ra, trừ", "example": "除了苹果，别的我都不喜欢吃。", "example_vi": "Ngoài táo ra, tôi không thích ăn thứ gì khác." },
    { "chinese": "春", "pinyin": "chūn", "vietnamese": "mùa xuân", "example": "春天来了，花都开了。", "example_vi": "Mùa xuân đến rồi, hoa đã nở." },
    { "chinese": "词语", "pinyin": "cíyǔ", "vietnamese": "từ vựng", "example": "这个词语是什么意思？", "example_vi": "Từ này có nghĩa là gì?" },
    { "chinese": "聪明", "pinyin": "cōngming", "vietnamese": "thông minh", "example": "他是一个非常聪明的孩子。", "example_vi": "Cậu bé ấy là một đứa trẻ rất thông minh." },
    { "chinese": "打扫", "pinyin": "dǎsǎo", "vietnamese": "quét dọn", "example": "我每个周末都打扫房间。", "example_vi": "Tôi dọn dẹp phòng mỗi cuối tuần." },
    { "chinese": "打算", "pinyin": "dǎsuàn", "vietnamese": "dự định", "example": "你明天有什么打算？", "example_vi": "Ngày mai bạn có dự định gì không?" },
    { "chinese": "带", "pinyin": "dài", "vietnamese": "mang theo", "example": "出门别忘了带伞。", "example_vi": "Ra ngoài đừng quên mang ô." },
    { "chinese": "担心", "pinyin": "dānxīn", "vietnamese": "lo lắng", "example": "别担心，一切都会好的。", "example_vi": "Đừng lo lắng, mọi chuyện rồi sẽ ổn thôi." },
    { "chinese": "蛋糕", "pinyin": "dàngāo", "vietnamese": "bánh ngọt", "example": "生日快乐！这是你的蛋糕。", "example_vi": "Chúc mừng sinh nhật! Đây là bánh của bạn." },
    { "chinese": "当然", "pinyin": "dāngrán", "vietnamese": "dĩ nhiên", "example": "你当然可以来参加我的派对。", "example_vi": "Tất nhiên bạn có thể đến tham dự bữa tiệc của tôi." },
    { "chinese": "灯", "pinyin": "dēng", "vietnamese": "đèn", "example": "请把灯打开。", "example_vi": "Làm ơn bật đèn lên." },
    { "chinese": "低", "pinyin": "dī", "vietnamese": "thấp", "example": "这个桌子太低了。", "example_vi": "Cái bàn này thấp quá." },
    { "chinese": "地铁", "pinyin": "dìtiě", "vietnamese": "tàu điện ngầm", "example": "我每天坐地铁上班。", "example_vi": "Tôi đi làm bằng tàu điện ngầm mỗi ngày." },
    { "chinese": "地图", "pinyin": "dìtú", "vietnamese": "bản đồ", "example": "你看一下地图，我们现在在哪里？", "example_vi": "Bạn xem bản đồ một chút, chúng ta đang ở đâu?" },
    { "chinese": "电梯", "pinyin": "diàntī", "vietnamese": "thang máy", "example": "我们坐电梯上去吧。", "example_vi": "Chúng ta đi thang máy lên đi." }
  ],
  hsk4: [
    { "chinese": "经济", "pinyin": "jīngjì", "vietnamese": "kinh tế", "example": "中国的经济发展很快。", "example_vi": "Kinh tế Trung Quốc phát triển rất nhanh." },
    { "chinese": "文化", "pinyin": "wénhuà", "vietnamese": "văn hóa", "example": "我喜欢了解不同的文化。", "example_vi": "Tôi thích tìm hiểu các nền văn hóa khác nhau." },
    { "chinese": "环境", "pinyin": "huánjìng", "vietnamese": "môi trường", "example": "保护环境很重要。", "example_vi": "Bảo vệ môi trường rất quan trọng." },
    { "chinese": "技术", "pinyin": "jìshù", "vietnamese": "công nghệ", "example": "现代技术改变了我们的生活。", "example_vi": "Công nghệ hiện đại đã thay đổi cuộc sống của chúng ta." },
    { "chinese": "社会", "pinyin": "shèhuì", "vietnamese": "xã hội", "example": "社会在不断发展。", "example_vi": "Xã hội không ngừng phát triển." }
  ]
};

// Install event - cache all essential files and data
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Service Worker: Caching static files');
          return cache.addAll(STATIC_CACHE_URLS);
        }),
      
      // Cache flashcard data
      caches.open(DATA_CACHE_NAME)
        .then(cache => {
          console.log('Service Worker: Caching flashcard data');
          // Store flashcard data as a response
          const dataResponse = new Response(JSON.stringify(FLASHCARD_DATA), {
            headers: { 'Content-Type': 'application/json' }
          });
          return cache.put('/api/flashcards', dataResponse);
        })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    }).catch(error => {
      console.error('Service Worker: Installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline, with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (url.pathname === '/api/flashcards') {
    // Handle flashcard data requests
    event.respondWith(handleDataRequest(request));
  } else if (isStaticAsset(request.url)) {
    // Handle static asset requests
    event.respondWith(handleStaticRequest(request));
  } else {
    // Handle navigation requests
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle flashcard data requests
async function handleDataRequest(request) {
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);
    
    // Cache the fresh data
    const cache = await caches.open(DATA_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Network failed, serve from cache
    console.log('Service Worker: Network failed for data, serving from cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cached data, serve the hardcoded data
    const dataResponse = new Response(JSON.stringify(FLASHCARD_DATA), {
      headers: { 'Content-Type': 'application/json' }
    });
    return dataResponse;
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Serve from cache, but try to update in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, try network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for static asset:', request.url);
    
    // For external resources that failed, return a basic fallback
    if (request.url.includes('fonts.googleapis.com')) {
      return new Response('', { status: 200, statusText: 'Font fallback' });
    }
    
    if (request.url.includes('font-awesome')) {
      return new Response('', { status: 200, statusText: 'Icon fallback' });
    }
    
    throw error;
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Network failed, serve index.html from cache (SPA fallback)
    console.log('Service Worker: Navigation failed, serving offline page');
    const cachedResponse = await caches.match('/index.html');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Last resort - basic offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Flashcard HSK - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 2rem; background: #30D5C8; color: white; }
          .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
          h1 { margin-bottom: 1rem; }
          p { margin-bottom: 2rem; opacity: 0.9; }
          .retry-btn { background: white; color: #30D5C8; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="offline-icon">📚</div>
        <h1>You're offline</h1>
        <p>Flashcard HSK is working offline. Your progress and data are saved locally.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Check if request is for a static asset
function isStaticAsset(url) {
  return url.includes('/style.css') || 
         url.includes('/src/') || 
         url.includes('/android/') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('font-awesome') ||
         url.includes('.js') ||
         url.includes('.css') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg');
}

// Update cache in background for fresh content
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('Service Worker: Background update failed for:', request.url);
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncProgressData());
  }
});

// Sync progress data when online
async function syncProgressData() {
  try {
    // Get all clients and notify them to sync their progress
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_PROGRESS'
      });
    });
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Handle push notifications (future feature)
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: 'Time to practice your Chinese vocabulary!',
    icon: '/android/android-launchericon-192-192.png',
    badge: '/android/android-launchericon-72-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Flashcard HSK',
        icon: '/android/android-launchericon-96-96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/android/android-launchericon-96-96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Flashcard HSK', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/flashcard/')
    );
  }
});

console.log('Service Worker: Loaded and ready');