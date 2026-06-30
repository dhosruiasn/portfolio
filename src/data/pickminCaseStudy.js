const pickminImages = {
  hero: '/images/projects/pickmin/Hero%20mockup.png',
  home: '/images/projects/pickmin/home-public-browse.png',
  search: '/images/projects/pickmin/search-owned-status.png',
  admin: '/images/projects/pickmin/upload-admin-review.png',
  multilingual: '/images/projects/pickmin/multilingual-comparison.png',
};

const motionVideoBase = '/videos/projects/pickmin/';

const sharedFoundations = {
  colorTokens: [
    { id: 'primary-action', value: '#111111' },
    { id: 'accent-blue', value: '#0088FF' },
    { id: 'cat-flower', value: '#f8906d' },
    { id: 'cat-mushroom', value: '#c07f35' },
    { id: 'cat-seedling', value: '#73b955' },
    { id: 'cat-hidden', value: '#979191' },
    { id: 'surface-base', value: '#ffffff' },
    { id: 'surface-muted', value: '#fcfcfc' },
    { id: 'text-primary', value: '#111111' },
    { id: 'text-secondary', value: '#8E8E93' },
    { id: 'border-soft', value: '#e2e8e4' },
    { id: 'status-error', value: '#FF3B30' },
    { id: 'overlay-scrim', value: 'rgba(0, 0, 0, 0.45)' },
  ],
  spacing: [
    { id: 'page-padding', value: '20-40px' },
    { id: 'card-padding', value: '18-28px' },
    { id: 'section-gap', value: '56-70px' },
    { id: 'element-gap', value: '10-24px' },
  ],
  radius: [
    { id: 'card-radius', value: '12-16px' },
    { id: 'case-radius', value: '18-58px' },
    { id: 'pill-radius', value: '999px' },
  ],
};

const productComponents = {
  postcardCard: {
    states: [
      { id: 'owned', tone: 'owned' },
      { id: 'unowned', tone: 'unowned' },
      { id: 'favorite', tone: 'favorite' },
      { id: 'hidden', tone: 'hidden' },
      { id: 'loading', tone: 'loading' },
      { id: 'failed', tone: 'failed' },
    ],
  },
  folderCard: {
    states: [
      { id: 'default', tone: 'default' },
      { id: 'selected', tone: 'selected' },
      { id: 'empty', tone: 'empty' },
      { id: 'new-items', tone: 'new-items' },
    ],
  },
  collectionSheet: {
    states: [
      { id: 'default', tone: 'default' },
      { id: 'selecting', tone: 'selecting' },
      { id: 'saving', tone: 'saving' },
      { id: 'success', tone: 'success' },
      { id: 'error', tone: 'error' },
    ],
  },
};

const commonMediaPlaceholders = {
  collectionFlow: {
    filename: 'public/images/projects/pickmin/flow-collection-01.webp',
    size: '860 x 1720',
    format: 'WebP or PNG',
  },
  tabMotion: {
    filename: `${motionVideoBase}motion-tab.webm`,
    size: '720 x 1440',
    format: 'WebM or MP4, 3-6 seconds',
  },
  pushPopMotion: {
    filename: `${motionVideoBase}motion-push-pop.webm`,
    size: '720 x 1440',
    format: 'WebM or MP4, 3-6 seconds',
  },
  collectionSheetMotion: {
    filename: `${motionVideoBase}motion-collection-sheet.webm`,
    size: '720 x 1440',
    format: 'WebM or MP4, 3-6 seconds',
  },
  mapScreen: {
    filename: 'public/images/projects/pickmin/map-system-screen.webp',
    size: '1440 x 1080',
    format: 'WebP or PNG',
  },
};

const zh = {
  heroImage: pickminImages.hero,
  subtitle: '為 Pikmin Bloom 玩家打造的多語明信片收藏、追蹤與管理 Web App。',
  summary:
    'Pickmin Postcards 是一個從零設計與開發的收藏型產品，協助玩家搜尋、記錄、收藏與管理 Pikmin Bloom 的明信片、花點與菇點，並用收藏資料夾、地圖與路線規劃探索地點。專案涵蓋產品策略、資訊架構、UI 設計、多語系介面、使用者資料流程、圖片上傳、地圖路線、管理後台與正式部署。',
  meta: [
    { label: 'ABOUT', value: '多語明信片收藏、搜尋與管理 Web App' },
    { label: 'ROLE', value: '產品設計 / UI 設計 / 前端開發' },
    { label: 'PLATFORM', value: 'Responsive Web App / PWA' },
    { label: 'LANGUAGES', value: '繁體中文、English、日本語、한국어' },
    { label: 'RESPONSIBILITIES', value: '產品策略、Design System、互動流程、i18n、React 實作、部署' },
    { label: 'TECH STACK', value: 'React、Vite、Supabase (Auth / DB / Storage)、Cloudflare R2、Leaflet、Vercel' },
  ],
  metrics: [
    { value: '10+', label: '核心頁面與管理介面' },
    { value: '4', label: '語言 i18n 架構' },
    { value: 'PWA', label: '行動裝置收藏體驗' },
    { value: 'R2', label: '圖片上傳與雲端儲存' },
  ],
  overview: {
    title: '從玩家收藏痛點出發的產品設計',
    body: [
      'Pikmin Bloom 的明信片收藏具有高度的地點性與稀有性，但玩家實際管理收藏時，常需要依靠截圖、記憶、社群貼文或手動整理。這讓搜尋、比對、記錄擁有狀態與補充資料變得繁瑣。',
      '我將這個需求轉化為一個可正式使用的 Web App，讓玩家能以更結構化的方式瀏覽公開明信片資料、記錄個人收藏，並透過上傳與管理流程持續補完整體資料庫。',
    ],
  },
  complexity: {
    title: 'PRODUCT COMPLEXITY',
    body: 'Pickmin 不是單一瀏覽頁，而是一個同時支援公開資料、個人收藏、圖片上傳、管理審核與四語介面的產品。這些流程讓視覺、元件與狀態需要以系統方式維護。',
    items: [
      { id: 'screens', value: '10+', label: 'Screens' },
      { id: 'languages', value: '4', label: 'Languages' },
      { id: 'flows', value: 'Multi', label: 'User flows' },
      { id: 'mobile', value: 'Mobile-first', label: 'Responsive PWA' },
      { id: 'interfaces', value: 'User + Admin', label: 'Interfaces' },
    ],
  },
  problems: [
    { title: '資料分散', body: '玩家常把明信片保存在截圖、相簿或聊天紀錄中，缺少集中管理方式。' },
    { title: '搜尋困難', body: '明信片與地點、名稱、類別相關，但原本缺少適合收藏情境的搜尋與篩選方式。' },
    { title: '擁有狀態不清楚', body: '玩家需要知道自己是否已擁有某張明信片，而不是只瀏覽公開資料。' },
    { title: '資料維護成本高', body: '若開放使用者上傳，就需要審核、回報、資料修正與權限管理。' },
  ],
  goals: [
    '讓玩家快速找到特定明信片。',
    '讓公開資料與個人收藏狀態可以共存。',
    '讓使用者能補充圖片與資料，但保留審核機制。',
    '讓整個產品支援多語系、行動裝置與正式部署。',
  ],
  users: [
    { title: '收藏玩家', body: '想搜尋明信片、確認自己是否擁有，並建立個人收藏紀錄。' },
    { title: '資料貢獻者', body: '想上傳缺少的圖片或補充資料，讓公開圖鑑更完整。' },
    { title: '管理者', body: '需要審核圖片、處理回報、維護資料品質與管理系統狀態。' },
  ],
  flow: {
    note:
      '我將產品流程拆成「公開瀏覽」與「個人收藏」兩層。未登入使用者可以先探索資料；登入後才進入個人收藏、上傳與資料同步流程。這樣可以降低初次使用門檻，同時保留個人化與資料安全。',
    steps: ['進入網站', '搜尋 / 瀏覽', '查看詳情', '登入', '標記擁有', '上傳圖片', '管理者審核', '公開資料更新'],
  },
  architecture: {
    note:
      'Pickmin 的資訊架構核心是把「公開資料」與「個人資料」分開處理。公開資料提供搜尋與瀏覽，個人資料則保存使用者的收藏狀態。這讓同一張明信片可以同時承載社群資料與個人紀錄，不會互相覆蓋。',
    items: ['公開明信片資料庫', '花點 / 菇點 / 隱藏 / 金盆 分類', '明信片詳情', '搜尋與篩選', '個人收藏資料夾', '地圖與路線', '圖片上傳', '回報與審核', '管理後台', '多語系內容'],
  },
  whyDesignSystem: {
    title: 'WHY A DESIGN SYSTEM',
    body:
      '隨著收藏、搜尋、地圖、回報及多語系功能逐步增加，單靠個別頁面調整已不足以維持產品一致性。因此，我重新整理色彩、文字、間距、元件狀態與動態規則，建立一套可持續擴充的產品設計系統。',
    beforeTitle: 'BEFORE / CHALLENGES',
    responseTitle: 'SYSTEM RESPONSE',
    before: ['More screens and user flows', 'Four-language text expansion', 'Repeated component styles', 'Inconsistent states and motion', 'Product and admin interfaces'],
    response: ['Semantic Design Tokens', 'Shared Components', 'Defined Component States', 'Motion Rules', 'Localization Rules'],
  },
  designPrinciples: [
    {
      id: 'collection-first',
      number: '01',
      title: 'COLLECTION FIRST',
      body: '讓明信片內容成為畫面主角，介面只提供必要的分類、搜尋與收藏引導。',
      image: pickminImages.home,
    },
    {
      id: 'app-like-navigation',
      number: '02',
      title: 'APP-LIKE NAVIGATION',
      body: '透過方向性轉場、Bottom Sheet 與全螢幕 Overlay，建立接近原生 App 的頁面層級與操作感。',
      image: pickminImages.search,
    },
    {
      id: 'four-languages',
      number: '03',
      title: 'FLEXIBLE FOR FOUR LANGUAGES',
      body: '元件需支援繁中、英文、日文與韓文，並避免以固定文字寬度限制內容。',
      image: pickminImages.multilingual,
    },
  ],
  foundations: {
    title: 'VISUAL FOUNDATIONS',
    intro: '這些基礎規則來自目前 Pickmin 作品集展示與正式產品畫面的共同語言，並用於解釋顏色、文字、間距、圓角與觸控範圍如何落到元件上。',
    colors: [
      { id: 'primary-action', group: 'Action', name: 'Primary / Black', usage: 'primary buttons and confirm actions' },
      { id: 'accent-blue', group: 'Accent', name: 'Interactive Blue', usage: 'selected state, active filter, focus ring' },
      { id: 'cat-flower', group: 'Category', name: 'Flower 花點', usage: 'flower category icon and accent' },
      { id: 'cat-mushroom', group: 'Category', name: 'Mushroom 菇點', usage: 'mushroom category icon and accent' },
      { id: 'cat-seedling', group: 'Category', name: 'Seedling 金盆', usage: 'seedling category icon and accent' },
      { id: 'cat-hidden', group: 'Category', name: 'Hidden 隱藏', usage: 'hidden category icon and accent' },
      { id: 'surface-base', group: 'Surface', name: 'Surface Base', usage: 'cards, sheets, modal content' },
      { id: 'surface-muted', group: 'Surface', name: 'App Background', usage: 'page background behind cards' },
      { id: 'text-primary', group: 'Text', name: 'Text Primary', usage: 'titles, body copy and data labels' },
      { id: 'text-secondary', group: 'Text', name: 'Text Secondary', usage: 'meta, counts and coordinates' },
      { id: 'border-soft', group: 'Border', name: 'Soft Border', usage: 'quiet separation without heavy outlines' },
      { id: 'status-error', group: 'Status', name: 'Status Error', usage: 'destructive action, sign out, form error' },
      { id: 'overlay-scrim', group: 'Overlay', name: 'Overlay Scrim', usage: 'modal and overlay background' },
    ],
    typography: [
      { id: 'display', name: 'Display', value: 'Chocolate Classical Sans / clamp(40px, 6vw, 96px)' },
      { id: 'page-title', name: 'Page Title', value: 'Chocolate Classical Sans / 28-44px' },
      { id: 'section-title', name: 'Section Title', value: 'TASA Explorer / Chiron Hei HK / 18-28px' },
      { id: 'body', name: 'Body', value: 'TASA Explorer + Chiron Hei HK / 15-17px' },
      { id: 'label', name: 'Label', value: 'TASA Explorer / 12-14px / bold' },
      { id: 'caption', name: 'Caption', value: 'TASA Explorer + Chiron Hei HK / 11-13px' },
    ],
    typographyNote: '英數使用 TASA Explorer；中日韓使用 Chiron Hei HK；標題顯示字使用 Chocolate Classical Sans，皆以 Google Fonts 載入並以 system-ui 為 fallback。四語展示容器分別設定 zh-Hant、en、ja、ko。',
    ...sharedFoundations,
    touchTarget: 'Minimum 44px for tappable chips, controls, CTA, sheet actions, and navigation.',
  },
  coreComponents: {
    title: 'CORE COMPONENT SYSTEM',
    intro: '此區保留最常支撐產品流程的共用元件，聚焦狀態與行動端 pressed/selected feedback，而不是完整 UI kit 牆。',
    items: [
      { id: 'button', name: 'Button', states: ['Default', 'Pressed', 'Disabled', 'Loading'] },
      { id: 'search-field', name: 'Search Field', states: ['Default', 'Focus-visible', 'Error'] },
      { id: 'filter-chip', name: 'Filter Chip', states: ['Default', 'Selected', 'Disabled'] },
      { id: 'bottom-nav', name: 'Bottom Navigation', states: ['Default', 'Selected', 'Pressed'] },
      { id: 'bottom-sheet', name: 'Modal / Bottom Sheet', states: ['Default', 'Saving', 'Error'] },
      { id: 'toast', name: 'Toast', states: ['Success', 'Error'] },
    ],
  },
  productComponents: {
    title: 'COMPONENTS SHAPED BY THE PRODUCT',
    intro: 'Pickmin 的元件不是通用 UI kit，而是直接回應收藏、分類、儲存與錯誤回饋情境。',
    postcardCard: {
      ...productComponents.postcardCard,
      title: 'Postcard Card',
      purpose: '在搜尋、瀏覽與收藏流程中同時承載圖片、地點、擁有狀態與收藏提示。',
      reason: '收藏狀態不只透過色彩區分，也搭配圖示與文字，避免重要資訊只依賴顏色傳達。',
      stateCopy: {
        owned: 'Owned',
        unowned: 'Unowned',
        favorite: 'Favorite',
        hidden: 'Hidden',
        loading: 'Image Loading',
        failed: 'Image Failed',
      },
    },
    folderCard: {
      ...productComponents.folderCard,
      title: 'Folder Card',
      purpose: '讓使用者在 CollectionSheet 中快速辨識資料夾、選取目的地與新增狀態。',
      reason: '資料夾狀態以文字、計數與邊框共同呈現，避免 selected state 只靠顏色。',
      stateCopy: {
        default: 'Default',
        selected: 'Selected',
        empty: 'Empty',
        'new-items': 'New Items',
      },
    },
    collectionSheet: {
      ...productComponents.collectionSheet,
      title: 'CollectionSheet',
      purpose: '承接暫時性的收藏任務，讓使用者不離開目前明信片脈絡也能完成儲存。',
      reason: '底部彈窗保留原本畫面脈絡，並用明確狀態回饋 saving、success 與 error。',
      stateCopy: {
        default: 'Default',
        selecting: 'Selecting',
        saving: 'Saving',
        success: 'Success',
        error: 'Error',
      },
    },
  },
  collectionFlow: {
    title: 'INTERACTION PATTERNS',
    intro: '主要收藏流程把 Postcard Card、CollectionSheet、Folder Card 與 Toast 串成一個可回復、可回饋的任務。',
    steps: [
      { id: 'select', label: '01 Select Postcard', action: '點選明信片卡片', state: 'Card selected, detail context remains visible', feedback: '可返回原本列表' },
      { id: 'open-sheet', label: '02 Open CollectionSheet', action: '開啟收藏面板', state: 'Bottom sheet slides up', feedback: '背景維持目前明信片脈絡' },
      { id: 'choose-folder', label: '03 Choose Folder', action: '選擇目標資料夾', state: 'Folder selected', feedback: 'Selected state 以文字與外框呈現' },
      { id: 'save', label: '04 Save Collection', action: '儲存收藏', state: 'Saving / Error handling', feedback: '按鈕顯示 loading 並避免重複提交' },
      { id: 'feedback', label: '05 Show Feedback', action: '完成或返回', state: 'Success toast or error message', feedback: '成功後返回原列表，失敗保留可重試狀態' },
    ],
    placeholder: commonMediaPlaceholders.collectionFlow,
  },
  motionSystem: {
    title: 'MOTION SYSTEM',
    intro:
      '動態不只是裝飾，而是用來說明頁面層級、操作方向與系統回饋。平行頁面使用淡入淡出，進入子頁時使用橫向位移，暫時性任務則由底部彈窗承接。',
    items: [
      { id: 'tab', name: 'Tab Switch', context: '同層級頁面切換', behavior: 'Cross-fade', duration: '0.26s', easing: 'cubic-bezier(0.32, 0.72, 0, 1)', reducedMotion: '直接切換內容，不播放淡入淡出', video: `${motionVideoBase}motion-tab.webm`, placeholder: commonMediaPlaceholders.tabMotion },
      { id: 'push-pop', name: 'Push / Pop', context: '進入子頁與返回', behavior: 'Directional transition', duration: '0.3s', easing: 'cubic-bezier(0.32, 0.72, 0, 1)', reducedMotion: '移除位移，只保留狀態更新', video: `${motionVideoBase}motion-push-pop.webm`, placeholder: commonMediaPlaceholders.pushPopMotion },
      { id: 'collection-sheet', name: 'CollectionSheet', context: '暫時性的收藏任務', behavior: 'Slide up / slide down', duration: '0.3s', easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)', reducedMotion: '直接顯示 sheet 靜態狀態', video: `${motionVideoBase}motion-collection-sheet.webm`, placeholder: commonMediaPlaceholders.collectionSheetMotion },
    ],
  },
  localization: {
    title: 'DESIGNED FOR FOUR LANGUAGES',
    intro: '同一個元件需要容納四語文字長度差異。卡片標題最多兩行，操作按鈕依內容伸縮，不以固定文字寬度限制內容。',
    samples: [
      { id: 'zh-Hant', lang: 'zh-Hant', label: '繁體中文', title: '東京鐵塔紀念明信片', action: '加入收藏', meta: '已擁有' },
      { id: 'en', lang: 'en', label: 'English', title: 'Tokyo Tower limited postcard', action: 'Add to collection', meta: 'Owned' },
      { id: 'ja', lang: 'ja', label: '日本語', title: '東京タワー限定ポストカード', action: 'コレクションに追加', meta: '所持済み' },
      { id: 'ko', lang: 'ko', label: '한국어', title: '도쿄 타워 한정 엽서', action: '컬렉션에 추가', meta: '보유함' },
    ],
    rules: ['標題最多兩行，超出時截斷', 'Button 依內容伸縮', 'CJK font fallback 依語言容器設定', '重要操作同時使用文字與狀態，不只依賴 icon'],
  },
  systemToProduct: {
    title: 'FROM SYSTEM TO PRODUCT',
    intro: '系統不是停留在元件牆，而是從 foundations 到最終畫面一路落地。',
    layers: ['Foundations', 'Core Components', 'Product Components', 'Interaction Patterns', 'Final Screens'],
    screens: [
      { id: 'home', title: 'Home / Browse', image: pickminImages.home, labels: ['Postcard Card', 'Category Badge', 'Bottom Navigation'] },
      { id: 'search', title: 'Search / Ownership', image: pickminImages.search, labels: ['Search Field', 'Filter Chip', 'Ownership Status'] },
      { id: 'admin', title: 'Upload / Review', image: pickminImages.admin, labels: ['Status Feedback', 'Review Controls', 'Image Preview'] },
    ],
    missing: [commonMediaPlaceholders.mapScreen],
  },
  implementation: {
    body:
      '這個專案不只停留在設計稿，而是完整實作成可部署的 Web App。我使用 React 與 Vite 建立前端架構，透過 Supabase 處理登入、資料庫與使用者資料，並使用 Cloudflare R2 管理圖片儲存。',
    items: ['React + Vite app shell', 'Supabase Auth (Google sign-in) + Database', 'Supabase Storage + Cloudflare R2 image pipeline', 'Leaflet map and route planning', 'PWA / multilingual UI', 'Vercel deployment and runtime config'],
  },
  security: {
    body:
      '因為 Pickmin 涉及登入、使用者收藏、圖片上傳與公開資料維護，我在產品設計中加入權限與審核思考。公開資料、個人資料與管理者操作被拆成不同流程，避免使用者上傳直接影響正式資料，也降低資料被誤改或濫用的風險。',
    items: ['使用者登入與個人收藏資料分離', '圖片上傳需經過審核', '管理後台限制權限', 'public / private data flow 分離', '部署 headers 與允許來源控管'],
  },
  outcome: {
    body:
      'Pickmin 最終從一個收藏痛點，發展成一個具備前台、個人化資料、管理後台與部署安全考量的完整產品。這個專案讓我不只處理 UI 畫面，也完整經歷了產品定義、資料架構、互動流程、工程限制與正式上線後的維護問題。',
    items: ['完成可上線 Web App', '支援 4 語言', '建立公開資料 + 個人收藏流程', '建立圖片上傳與審核機制', '建立管理後台', '完成 PWA 與 Vercel 部署'],
    reflection:
      '建立這套系統後，我不再以單一頁面為單位處理視覺，而是從規則、元件與操作模式思考產品如何持續擴充。這個過程也讓我更清楚理解視覺決策、互動方式、多語系需求與 React 元件結構之間的關係。',
    next: ['Design System 仍會隨產品功能演進', '後續需補更多 accessibility testing', 'Admin components 尚未完整文件化'],
  },
  cta: {
    live: 'EXPLORE LIVE PROTOTYPE',
    designSystem: 'VIEW DESIGN SYSTEM',
    comingSoon: 'Coming Soon',
    manualReview: 'Live product — best viewed on a mobile device for the full collection experience.',
  },
};

const en = {
  ...zh,
  subtitle: 'A multilingual postcard collection, tracking, and management web app for Pikmin Bloom players.',
  summary:
    'Pickmin Postcards is a collection product designed and built from scratch to help players search, record, collect, and manage Pikmin Bloom postcards, flower spots, and mushroom spots, with collection folders, a map, and route planning to explore locations. The project covers product strategy, information architecture, UI design, multilingual interfaces, user data flows, image upload, map and routes, admin review, and production deployment.',
  meta: [
    { label: 'ABOUT', value: 'Multilingual postcard collection, search, and management web app' },
    { label: 'ROLE', value: 'Product design / UI design / frontend development' },
    { label: 'PLATFORM', value: 'Responsive Web App / PWA' },
    { label: 'LANGUAGES', value: 'Traditional Chinese, English, Japanese, Korean' },
    { label: 'RESPONSIBILITIES', value: 'Product strategy, design system, interaction flows, i18n, React implementation, deployment' },
    { label: 'TECH STACK', value: 'React, Vite, Supabase (Auth / DB / Storage), Cloudflare R2, Leaflet, Vercel' },
  ],
  metrics: [
    { value: '10+', label: 'Core screens and admin views' },
    { value: '4', label: 'Language i18n structure' },
    { value: 'PWA', label: 'Mobile collection experience' },
    { value: 'R2', label: 'Image upload and cloud storage' },
  ],
  overview: {
    title: 'Product design shaped by a collection pain point',
    body: [
      'Pikmin Bloom postcards are highly location-based and collectible, but players often rely on screenshots, memory, social posts, or manual notes to manage what they have. Searching, comparing, and recording ownership status becomes tedious quickly.',
      'I turned that need into a usable web app where players can browse public postcard data, keep personal collection records, upload missing images, and help maintain the database through a reviewed workflow.',
    ],
  },
  complexity: {
    ...zh.complexity,
    body: 'Pickmin is not a single browse page. It supports public data, personal collections, image upload, admin review, and four-language interfaces. That product scope requires visual rules, component states, and interaction patterns to be maintained as a system.',
  },
  problems: [
    { title: 'Scattered data', body: 'Players often keep postcards in screenshots, photo albums, or chat history without a focused management system.' },
    { title: 'Hard to search', body: 'Postcards relate to location, name, and category, but the original workflow lacked search and filtering patterns designed for collecting.' },
    { title: 'Unclear ownership', body: 'Players need to know whether they already own a postcard while browsing public data.' },
    { title: 'High maintenance cost', body: 'User uploads require review, reporting, data correction, and permission boundaries before becoming public data.' },
  ],
  goals: [
    'Help players find specific postcards quickly.',
    'Let public postcard data and personal ownership status coexist.',
    'Allow users to contribute images and data while preserving review controls.',
    'Support multilingual, mobile, and production deployment needs.',
  ],
  users: [
    { title: 'Collectors', body: 'Search postcards, check ownership, and maintain personal collection records.' },
    { title: 'Contributors', body: 'Upload missing images or add information to improve the public catalog.' },
    { title: 'Admins', body: 'Review images, handle reports, maintain data quality, and manage system state.' },
  ],
  flow: {
    note:
      'I separated the experience into public browsing and personal collection layers. Visitors can explore public data first; after signing in, they can save personal ownership, upload images, and sync collection data. This lowers the entry barrier while keeping personalization and data safety intact.',
    steps: ['Enter site', 'Search / browse', 'View detail', 'Sign in', 'Mark owned', 'Upload image', 'Admin review', 'Public data update'],
  },
  architecture: {
    note:
      'The core information architecture separates public data from personal data. Public data powers search and browsing, while personal data stores ownership status. This lets a single postcard carry both community information and private collection records without overwriting each other.',
    items: ['Public postcard database', 'Flower / mushroom / hidden / seedling categories', 'Postcard detail', 'Search and filters', 'Personal collection folders', 'Map and routes', 'Image upload', 'Reports and review', 'Admin dashboard', 'Multilingual content'],
  },
  whyDesignSystem: {
    ...zh.whyDesignSystem,
    body:
      'As collection, search, map, reporting, and multilingual features expanded, styling each screen independently was no longer enough to maintain consistency. I reorganized color, typography, spacing, component states, and motion into a scalable product design system.',
  },
  designPrinciples: [
    {
      id: 'collection-first',
      number: '01',
      title: 'COLLECTION FIRST',
      body: 'Keep postcards as the visual focus while the interface provides only the necessary structure for browsing, searching, and collecting.',
      image: pickminImages.home,
    },
    {
      id: 'app-like-navigation',
      number: '02',
      title: 'APP-LIKE NAVIGATION',
      body: 'Use directional transitions, bottom sheets, and full-screen overlays to create clear page hierarchy and an app-like experience.',
      image: pickminImages.search,
    },
    {
      id: 'four-languages',
      number: '03',
      title: 'FLEXIBLE FOR FOUR LANGUAGES',
      body: 'Components are designed to support Traditional Chinese, English, Japanese, and Korean without relying on fixed text widths.',
      image: pickminImages.multilingual,
    },
  ],
  foundations: {
    ...zh.foundations,
    intro: 'These foundation rules are drawn from the shared visual language of the current Pickmin portfolio presentation and product screens, showing how color, type, spacing, radius, and touch targets land in components.',
    typographyNote: 'Latin uses TASA Explorer; CJK uses Chiron Hei HK; display headings use Chocolate Classical Sans, all loaded via Google Fonts with a system-ui fallback. Four-language samples set zh-Hant, en, ja, and ko on each container.',
  },
  coreComponents: {
    ...zh.coreComponents,
    intro: 'This section keeps the shared components that support the main product flows, focusing on states and mobile pressed/selected feedback rather than a full UI kit wall.',
  },
  productComponents: {
    ...zh.productComponents,
    intro: 'Pickmin components are shaped by collection, folder selection, saving, and error feedback rather than generic UI kit needs.',
    postcardCard: {
      ...zh.productComponents.postcardCard,
      purpose: 'Carries image, location, ownership, and collection cues across search, browse, and save flows.',
      reason: 'Ownership is communicated with text and symbols as well as color, so key information is not color-only.',
    },
    folderCard: {
      ...zh.productComponents.folderCard,
      purpose: 'Helps users recognize folders, choose a save destination, and understand empty or new-item states inside CollectionSheet.',
      reason: 'Folder state uses labels, counts, and borders together so selected state does not rely on color alone.',
    },
    collectionSheet: {
      ...zh.productComponents.collectionSheet,
      purpose: 'Handles a temporary collection task without taking users away from the current postcard context.',
      reason: 'The bottom sheet preserves context and makes saving, success, and error feedback explicit.',
    },
  },
  collectionFlow: {
    ...zh.collectionFlow,
    intro: 'The main collection flow connects Postcard Card, CollectionSheet, Folder Card, and Toast into a recoverable task with clear feedback.',
    steps: [
      { id: 'select', label: '01 Select Postcard', action: 'Tap the postcard card', state: 'Card selected, detail context remains visible', feedback: 'User can return to the original list' },
      { id: 'open-sheet', label: '02 Open CollectionSheet', action: 'Open the save panel', state: 'Bottom sheet slides up', feedback: 'Background keeps the postcard context' },
      { id: 'choose-folder', label: '03 Choose Folder', action: 'Choose a target folder', state: 'Folder selected', feedback: 'Selected state uses text and outline' },
      { id: 'save', label: '04 Save Collection', action: 'Save the postcard', state: 'Saving / error handling', feedback: 'Button shows loading and prevents duplicate submission' },
      { id: 'feedback', label: '05 Show Feedback', action: 'Complete or return', state: 'Success toast or error message', feedback: 'Success returns to the list; failure keeps retry state' },
    ],
  },
  motionSystem: {
    ...zh.motionSystem,
    intro:
      'Motion is used to communicate hierarchy, direction, and system feedback rather than decoration. Parallel views use cross-fades, child pages use directional transitions, and temporary tasks are handled through bottom sheets.',
    items: zh.motionSystem.items.map((item) => ({
      ...item,
      context: {
        tab: 'Switching between same-level views',
        'push-pop': 'Entering a child page and returning',
        'collection-sheet': 'A temporary collection task',
      }[item.id],
      reducedMotion: {
        tab: 'Switch content instantly without the cross-fade',
        'push-pop': 'Remove the offset and keep only the state update',
        'collection-sheet': 'Show the sheet in its static state directly',
      }[item.id],
    })),
  },
  localization: {
    ...zh.localization,
    intro: 'The same component needs to handle four different text lengths. Card titles are capped at two lines, action buttons resize to content, and text is not constrained by fixed widths.',
  },
  systemToProduct: {
    ...zh.systemToProduct,
    intro: 'The system is not a component wall. It moves from foundations to reusable components, product-specific components, interaction patterns, and final screens.',
  },
  implementation: {
    body:
      'This project moved beyond static design and was built as a deployable web app. I used React and Vite for the frontend, Supabase for auth, database, and user data, and Cloudflare R2 for image storage.',
    items: ['React + Vite app shell', 'Supabase Auth (Google sign-in) + Database', 'Supabase Storage + Cloudflare R2 image pipeline', 'Leaflet map and route planning', 'PWA / multilingual UI', 'Vercel deployment and runtime config'],
  },
  security: {
    body:
      'Because Pickmin includes login, personal collection records, image upload, and public data maintenance, permission and review flows were part of the product design. Public data, private data, and admin actions are separated to avoid direct uncontrolled changes to production data.',
    items: ['Separated user login and personal collection data', 'Image uploads require review', 'Admin dashboard permission boundaries', 'Public / private data flow separation', 'Deployment headers and allowed origins'],
  },
  outcome: {
    body:
      'Pickmin grew from a collection pain point into a complete product with public browsing, personal data, admin review, and deployment safety considerations. It required product definition, data architecture, interaction design, engineering constraints, and maintenance thinking.',
    items: ['Launched web app', '4-language support', 'Public data + personal collection flow', 'Image upload and review workflow', 'Admin dashboard', 'PWA and Vercel deployment'],
    reflection:
      'Building this system shifted my process from styling individual screens to designing reusable rules, components, and interaction patterns. It also helped me connect visual decisions, motion, localization, and React structure as one product system.',
    next: ['Design System is still evolving with the product', 'Additional accessibility testing is planned', 'Admin components are not yet fully documented'],
  },
  cta: {
    live: 'EXPLORE LIVE PROTOTYPE',
    designSystem: 'VIEW DESIGN SYSTEM',
    comingSoon: 'Coming Soon',
    manualReview: 'Live product — best viewed on a mobile device for the full collection experience.',
  },
};

export const pickminCaseStudy = { zh, en };
