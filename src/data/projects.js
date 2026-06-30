export const projects = [
  {
    id: 'pickmin',
    name: 'Pickmin Postcards',
    category: { zh: '產品設計 × 開發', en: 'Product Design × Dev' },
    height: 360,
    marginTop: 0,
    media: '/videos/projects/pickmin%E5%B0%81%E9%9D%A2%E5%BD%B1%E7%89%87.mp4',
    mediaType: 'video',
    link: 'https://pickmin-postcards.vercel.app/',
    zh: {
      about: '為 Pikmin Bloom 玩家打造的明信片追蹤與收藏 Web App。從零主導完整產品設計——視覺系統、UI 介面、互動邏輯到雲端部署，全程以 VibeCoding 方式實作。',
      role: '獨立設計 + 開發',
      tech: 'React, Vite, Supabase, Cloudflare R2, PWA',
      deliverables: '10 個頁面、4 語言 i18n、管理後台、26,000+ 行原始碼',
      link: '線上版網址',
    },
    en: {
      about: 'A postcard tracking and collection web app for Pikmin Bloom players. Led the full product design — visual system, UI, interaction logic, and cloud deployment — entirely through VibeCoding.',
      role: 'Independent design + development',
      tech: 'React, Vite, Supabase, Cloudflare R2, PWA',
      deliverables: '10 pages, 4-language i18n, admin dashboard, 26k+ lines',
      link: 'live site URL',
    },
    caseStudy: {
      zh: {
        heroImage: '/images/projects/pickmin/Hero%20mockup.png',
        subtitle: '為 Pikmin Bloom 玩家打造的多語明信片收藏、追蹤與管理 Web App。',
        summary:
          'Pickmin Postcards 是一個從零設計與開發的收藏型產品，協助玩家搜尋、記錄、上傳與管理 Pikmin Bloom 明信片。專案涵蓋產品策略、資訊架構、UI 設計、多語系介面、使用者資料流程、圖片上傳、管理後台與正式部署。',
        meta: [
          { label: 'ROLE', value: '產品設計 / UI 設計 / 前端開發' },
          { label: 'SCOPE', value: 'UX、UI、Design System、i18n、Admin、PWA、Deployment' },
          { label: 'STACK', value: 'React、Vite、Supabase、Cloudflare R2、Vercel' },
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
        problems: [
          {
            title: '資料分散',
            body: '玩家常把明信片保存在截圖、相簿或聊天紀錄中，缺少集中管理方式。',
          },
          {
            title: '搜尋困難',
            body: '明信片與地點、名稱、類別相關，但原本缺少適合收藏情境的搜尋與篩選方式。',
          },
          {
            title: '擁有狀態不清楚',
            body: '玩家需要知道自己是否已擁有某張明信片，而不是只瀏覽公開資料。',
          },
          {
            title: '資料維護成本高',
            body: '若開放使用者上傳，就需要審核、回報、資料修正與權限管理。',
          },
        ],
        goals: [
          '讓玩家快速找到特定明信片。',
          '讓公開資料與個人收藏狀態可以共存。',
          '讓使用者能補充圖片與資料，但保留審核機制。',
          '讓整個產品支援多語系、行動裝置與正式部署。',
        ],
        users: [
          {
            title: '收藏玩家',
            body: '想搜尋明信片、確認自己是否擁有，並建立個人收藏紀錄。',
          },
          {
            title: '資料貢獻者',
            body: '想上傳缺少的圖片或補充資料，讓公開圖鑑更完整。',
          },
          {
            title: '管理者',
            body: '需要審核圖片、處理回報、維護資料品質與管理系統狀態。',
          },
        ],
        flow: {
          note:
            '我將產品流程拆成「公開瀏覽」與「個人收藏」兩層。未登入使用者可以先探索資料；登入後才進入個人收藏、上傳與資料同步流程。這樣可以降低初次使用門檻，同時保留個人化與資料安全。',
          steps: ['進入網站', '搜尋 / 瀏覽', '查看詳情', '登入', '標記擁有', '上傳圖片', '管理者審核', '公開資料更新'],
        },
        architecture: {
          note:
            'Pickmin 的資訊架構核心是把「公開資料」與「個人資料」分開處理。公開資料提供搜尋與瀏覽，個人資料則保存使用者的收藏狀態。這讓同一張明信片可以同時承載社群資料與個人紀錄，不會互相覆蓋。',
          items: ['公開明信片資料庫', '明信片詳情', '搜尋與篩選', '個人收藏狀態', '圖片上傳', '回報與審核', '管理後台', '多語系內容'],
        },
        decisions: [
          {
            title: '公開瀏覽先於登入',
            body: '我沒有把登入放在使用流程的第一步，而是讓使用者先瀏覽明信片資料。這能降低進入門檻，讓玩家先確認產品是否有用，再決定是否登入保存個人收藏。',
            slot: '首頁 / 公開瀏覽截圖',
            image: '/images/projects/pickmin/home-public-browse.png',
          },
          {
            title: '收藏狀態要直接出現在明信片脈絡中',
            body: '收藏狀態不是獨立頁面的資料，而應該出現在搜尋結果、明信片詳情與個人紀錄中。這樣玩家在瀏覽時能立即判斷「我是否已擁有」，減少反覆切換頁面的成本。',
            slot: '搜尋結果 + 擁有狀態截圖',
            image: '/images/projects/pickmin/search-owned-status.png',
            imageFocus: 'case-photo-slot--focus-search',
          },
          {
            title: '上傳流程需要管理審核，而不是直接公開',
            body: '因為圖片與地點資料會影響公開資料品質，我設計了審核流程與管理後台，讓使用者可以貢獻資料，但系統仍能維持可信度。',
            slot: '上傳 / 審核後台截圖',
            image: '/images/projects/pickmin/upload-admin-review.png',
            imageFocus: 'case-photo-slot--focus-dashboard',
          },
          {
            title: '多語系不是翻譯文字而已',
            body: 'Pickmin 支援多語系，因此 UI 需要處理不同語言長度、按鈕寬度、標籤狀態與資料顯示。設計時必須避免只在單一語言下看起來正常。',
            slot: '多語系畫面對照',
            image: '/images/projects/pickmin/multilingual-comparison.png',
          },
        ],
        designSystem: {
          principles: ['親切但不幼稚', '資訊清楚優先於裝飾', '適合長時間查找與管理', '保留遊戲社群感，但避免直接複製遊戲視覺'],
          colors: ['Primary / 主行動色', 'Surface / 卡片與彈窗背景', 'Text / 主要與次要文字', 'Status / 已擁有、未擁有、待審核、已通過、已拒絕', 'Admin / 後台操作與警示狀態'],
          typography: ['頁面標題與區塊標題', '明信片資料與說明文字', '狀態、篩選、欄位名稱', '中英日等語言長度差異處理'],
          components: [
            'Postcard card',
            'Search bar',
            'Filter chips',
            'Ownership status badge',
            'Upload panel',
            'Image preview',
            'Detail modal / detail page',
            'Empty state',
            'Loading state',
            'Admin table',
            'Review status controls',
            'Language switcher',
            'Toast / feedback message',
          ],
          states: ['Default', 'Hover', 'Active', 'Selected', 'Disabled', 'Loading', 'Empty', 'Error', 'Success', 'Pending review'],
        },
        implementation: {
          body:
            '這個專案不只停留在設計稿，而是完整實作成可部署的 Web App。我使用 React 與 Vite 建立前端架構，透過 Supabase 處理登入、資料庫與使用者資料，並使用 Cloudflare R2 管理圖片儲存。',
          items: ['React + Vite app shell', 'Supabase Auth / Database', 'Cloudflare R2 image storage', 'PWA / multilingual UI', 'Vercel deployment and runtime config'],
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
        },
      },
    },
  },
  {
    id: 'ui-tweaker',
    name: 'UI Tweaker',
    category: { zh: '工具開發', en: 'Tool Development' },
    height: 420,
    marginTop: 40,
    media: '/videos/projects/ui-tweaker-skill%20-demo-vedio.mp4',
    mediaType: 'video',
    link: 'https://dhosruiasn.github.io/ui-tweaker-skill/',
    zh: {
      about: '為 VibeCoding 設計師打造的視覺微調工具。控制面板參考 Figma 屬性面板邏輯，將常見的文字、間距、尺寸、圓角、陰影、位置與狀態調整轉化成可即時預覽的介面。',
      role: '設計 + 開發 + 發布',
      tech: 'Claude Code Plugin, JavaScript, HTML/CSS',
      deliverables: '涵蓋 9 大設計類別的即時微調、結構化輸出、Plugin、雙語說明頁、GitHub repo',
      link: 'https://dhosruiasn.github.io/ui-tweaker-skill/',
    },
    en: {
      about: "A visual fine-tuning tool for VibeCoding designers. The control panel references Figma's property panel logic and turns common typography, spacing, size, radius, shadow, position, and state adjustments into a live preview interface.",
      role: 'Design + development + publishing',
      tech: 'Claude Code Plugin, JavaScript, HTML/CSS',
      deliverables: '9 design-tuning categories, structured output, plugin, bilingual landing page, GitHub repo',
      link: 'https://dhosruiasn.github.io/ui-tweaker-skill/',
    },
  },
  {
    id: 'googoolii',
    name: 'GOOGOOlii Brand Website',
    detailTitle: 'BRAND WEBSITE',
    category: { zh: '品牌電商', en: 'Brand E-commerce' },
    height: 320,
    marginTop: 0,
    media: '/images/projects/googoolii-cover.jpg',
    link: '',
    status: { zh: '進行中', en: 'In Progress' },
    zh: {
      about: '為自有插畫 IP 品牌 GOOGOOlii 咕咕力打造的品牌網站。整體以「進來逛，不像在逛電商」為核心，將角色世界觀、商品瀏覽與購物流程整合成一段可互動的逛街體驗，而不是傳統商品列表。',
      role: '品牌擁有者 + 視覺系統 + 架構規劃 + 開發',
      tech: 'Next.js, React Three Fiber, GSAP, dnd-kit, Firebase, ECPay',
      deliverables: '包含品牌視覺系統、首頁互動場景、拖曳入籃購物、3D 結帳輸送帶、A24 風格標題卡過場、Web Audio 即時合成音效、會員與金流串接規劃。',
      status: '進行中',
    },
    en: {
      about: 'A brand website for my illustration IP, GOOGOOlii. The core idea is to make shopping feel like entering a playful character world instead of browsing a standard e-commerce catalog.',
      role: 'Brand owner + visual system + architecture + development',
      tech: 'Next.js, React Three Fiber, GSAP, dnd-kit, Firebase, ECPay',
      deliverables: 'Brand visual system, interactive landing scene, drag-to-basket shopping, 3D checkout conveyor, A24-style title card transitions, Web Audio synthesis, membership and payment flow planning.',
      status: 'In Progress',
    },
    caseStudy: {
      zh: {
        heroImage: '/images/graphic/brand-section/house完整參考.png',
        heroAlt: 'GOOGOOlii brand house entrance mockup',
        sectionTitles: {
          problem: 'DESIGN CHALLENGE',
          goals: 'GOAL & AUDIENCE',
          flow: 'EXPERIENCE FLOW',
          architecture: 'EXPERIENCE SYSTEM',
          decisions: 'KEY INTERACTION MOMENTS',
          designSystem: 'GOOGOOLII VISUAL SYSTEM',
          trust: 'BUILD STRATEGY',
          outcome: 'EXPANDABLE WORLD',
        },
        panelTitles: {
          goals: '設計目標',
          implementation: '互動原型作為體驗核心',
          security: '商務流程與信任設計',
          outcome: '可擴充的品牌世界',
        },
        subtitle: '以結帳小劇場為核心，打造不像電商的插畫 IP 品牌網站。',
        summary:
          'GOOGOOlii 是我的自有插畫 IP 品牌網站概念。我把商品瀏覽、購物籃與結帳流程設計成一段角色世界裡的逛街體驗，並以兩種隨機出現的 checkout scene 作為核心互動，讓付款不只是功能步驟，而是品牌世界觀的一部分。',
        meta: [
          { label: 'ROLE', value: '品牌擁有者 / 視覺系統 / 互動設計 / 前端原型' },
          { label: 'EXPERIENCE CORE', value: '結帳過場、收銀台畫面、隨機小劇場系統' },
          { label: 'PROJECT TYPE', value: 'Brand commerce concept + interactive prototype' },
        ],
        metrics: [
          { value: '2', label: '隨機結帳過場場景' },
          { value: '1', label: '核心 checkout ritual' },
          { value: '5', label: 'Meow Map 品牌地點' },
          { value: 'A24', label: '荒謬幽默互動語氣' },
        ],
        overview: {
          title: '把電商流程改寫成品牌世界觀',
          body: [
            '一般電商通常把購物流程拆成商品列表、購物車、結帳表單。但對插畫 IP 品牌來說，最有價值的不是效率本身，而是使用者是否記得這個世界、角色與購買時的情緒。',
            '因此我把 GOOGOOlii 的網站方向定義為「進來逛，不像在逛電商」。作品集頁聚焦在品牌體驗如何被拆成入口、地圖、商品、購物籃與結帳小劇場，形成一套可延伸的互動電商語言。',
          ],
        },
        problems: [
          {
            title: '電商過於制式',
            body: '傳統商品 grid 與 checkout 表單很有效率，但很難承載插畫 IP 的角色個性與荒謬感。',
          },
          {
            title: '品牌記憶點不足',
            body: '如果使用者只是在看商品與付款，GOOGOOlii 的世界觀會被壓縮成一般周邊商店。',
          },
          {
            title: '流程需要有劇場感',
            body: '從入口、地圖、商品到結帳，每一步都需要像進入同一間怪玩具店，而不是切換到另一個制式頁面。',
          },
          {
            title: '功能必須可落地',
            body: '即使互動很戲劇化，購物籃、最低出貨門檻、付款與物流仍需要清楚、安全、可完成。',
          },
        ],
        goals: [
          '把最有記憶點的 checkout ritual 做成整體體驗核心。',
          '用 experience system 說明品牌網站如何從入口、地圖、商品到結帳一路展開。',
          '保留購物任務的清楚度，同時增加品牌角色與荒謬幽默。',
          '建立可擴充的互動系統，未來能加入地圖、遊戲、投票與一番賞。',
        ],
        users: [
          {
            title: '品牌粉絲',
            body: '想認識角色、逛周邊，也期待網站本身有像玩具店一樣的探索感。',
          },
          {
            title: '購買者',
            body: '需要順利把商品加入購物籃、確認金額、填寫資料並完成付款。',
          },
          {
            title: '作品集觀眾',
            body: '需要快速看懂品牌概念、互動語氣、流程設計，以及這個網站如何支撐一個可持續擴充的 IP 世界。',
          },
        ],
        flow: {
          note:
            '使用者從品牌入口進入 Meow Map，探索不同區域與商品，最後在進入結帳時觸發隨機過場場景，並收斂到同一個 checkout screen。這讓結帳既是功能終點，也是一個品牌事件。',
          steps: ['進入品牌世界', '探索 Meow Map', '瀏覽商品', '商品入籃', '觸發結帳', '隨機場景 A / B', '收銀台畫面', '填寫付款資料'],
        },
        architecture: {
          note:
            'GOOGOOlii 的品牌網站被拆成一組可重複擴充的互動模組：入口建立世界觀，Meow Map 承接導覽，商品區負責探索與購買，checkout ritual 則把付款轉成品牌記憶點。',
          items: [
            'Brand entrance',
            'Character selection',
            'Meow Map navigation',
            'Floating product shop',
            'Drag-to-basket cart',
            'Randomized checkout scenes',
            'Checkout form',
            'Payment and shipping planning',
            'Game / vote / raffle expansion',
          ],
        },
        decisions: [
          {
            title: '把結帳包裝成隨機小劇場',
            body: '我設計了兩種會隨機出現的結帳過場，讓每次進入付款流程都像觸發一個短事件。這能增加重複體驗的期待感，也讓付款從功能流程變成品牌記憶點。',
            slot: 'Scene 01 / Scene 02 video slot',
          },
          {
            title: '用地圖取代傳統導覽',
            body: 'Meow Map 將商店、衣服區、遊戲、投票與一番賞變成可探索地點。導覽不再只是 menu，而是讓使用者先進入 GOOGOOlii 的世界，再決定要去哪裡逛。',
            slot: 'Meow Map concept slot',
          },
          {
            title: '商品不是排隊陳列，而是散落在場景裡',
            body: '商品瀏覽會以漂浮、傾斜、可拖曳的方式呈現，讓使用者像在玩具店翻找物件，而不是掃過一排商品卡片。',
            slot: 'Floating product prototype slot',
          },
          {
            title: '讓商務流程保持品牌語氣',
            body: '購物籃、最低出貨門檻、付款與物流仍然需要清楚可信，但外層互動可以保留 GOOGOOlii 的荒謬幽默，讓功能流程也像品牌內容的一部分。',
            slot: 'Commerce flow system slot',
          },
        ],
        designSystem: {
          principles: ['進來逛，不像在逛電商', '角色世界觀優先於制式貨架', '功能要清楚，但互動可以怪一點', '每個流程都要留下品牌記憶點'],
          colors: ['#2B7FFF 品牌藍', '#FF6B1A 橘色購物籃與行動色', '#FFE234 黃色高光與玩具感', '#FF9EC8 粉色角色語氣'],
          typography: ['粗黑英文標題', '圓體中文說明', '黑底白字標題卡', '粗黑邊標籤與 UI 元件'],
          components: [
            'A24 title card',
            'Meow Map spot',
            'Character picker',
            'Floating product object',
            'Orange plastic basket',
            'Checkout conveyor',
            'Barcode scanner',
            'Retro cashier screen',
            'Weird character line',
            'Coming soon repair sign',
          ],
          states: ['Default', 'Hover wobble', 'Dragging', 'Dropped in basket', 'Scanning', 'Scan failed', 'Scene randomized', 'Payment ready'],
        },
        implementation: {
          body:
            '互動原型以 checkout ritual 作為體驗核心，適合用短影片展示從購物籃進入結帳、場景切換、收銀台視覺與付款畫面的連續體驗。這段原型定義了整站的節奏、幽默感與互動密度。',
          items: ['兩種隨機 checkout transition', '結帳畫面 prototype', 'A24 風格過場語氣', '購物籃到收銀台的流程概念', 'Web Audio 與互動音效規劃'],
        },
        security: {
          body:
            '正式上線前，登入、付款、物流與圖片資產都不能只停留在前端效果。金流、最低出貨門檻、使用者資料與商品資料需要前後端共同驗證，第三方服務也要避免在作品集中公開敏感設定。',
          items: ['Firebase Auth / Firestore 權限規則', 'ECPay 付款流程與 webhook 驗證', '最低出貨門檻前後端檢查', 'Cloudinary 圖片與資產管理', '環境變數與 secret 不公開'],
        },
        outcome: {
          body:
            'GOOGOOlii 的網站架構可以從 checkout ritual 往外擴展成完整品牌世界：角色選擇負責身份感，Meow Map 負責探索，商品區負責購買，一番賞、投票與遊戲則讓粉絲有持續回來的理由。',
          items: ['結帳小劇場影片展示', 'Meow Map 主導覽', '商品拖曳入籃互動', '角色選擇入口', '真實商品與付款流程'],
        },
      },
    },
  },
  {
    id: 'shopee-archive',
    name: 'Workflow Assistant Tool',
    category: { zh: '內部工具', en: 'Internal Tool' },
    height: 380,
    marginTop: 20,
    media: '/images/projects/shopee-archive-cover.jpg',
    link: '',
    zh: {
      about: '於蝦皮任職期間，以 AI 工具開發的自動化歸檔工具，解決團隊工作流程效率問題。展現「設計師不只做設計，還能自己造工具」的思維。',
      role: '需求發現 + 工具設計 + 開發',
      tech: 'VibeCoding, AI 輔助開發',
      note: '內部工具，無公開介面',
    },
    en: {
      about: 'An AI-powered automation tool built during my tenure at Shopee to solve archiving workflow bottlenecks. Demonstrates the mindset of "a designer who builds their own tools."',
      role: 'Problem discovery + tool design + development',
      tech: 'VibeCoding, AI-assisted development',
      note: 'Internal tool, no public interface',
    },
  },
];
