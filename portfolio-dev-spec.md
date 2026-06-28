# Doris Kao Portfolio — Claude Code 開發規格書

> 技術棧：React + Vite + Vercel  
> 目的：投遞版塊設計 Block Studio — Digital Web Designer  
> 語言：中英雙語（TC/EN 切換）

---

## 技術棧

```
框架：React 18 + Vite
部署：Vercel
動畫：GSAP + ScrollTrigger
拖曳：dnd-kit
樣式：CSS Modules 或 vanilla CSS（不用 Tailwind）
字體：Google Fonts + 本地字體
i18n：自建簡易 context（不需要 library）
```

---

## Design Tokens

### 色彩

```css
:root {
  /* 背景 */
  --bg-light: #FAFAF7;        /* 暖白，Hero/作品區/About */
  --bg-warm-brown: #2E2318;   /* 暖棕，過渡標題/Footer */
  --bg-texture: #EDECE4;      /* 質感淺灰，Graphic Gallery */

  /* 文字 */
  --text-primary: #1A1A1A;    /* 淺底上的主文字 */
  --text-on-brown: #EDE4D0;   /* 暖棕底上的奶白文字 */
  --text-secondary: #888888;  /* 標籤/次要文字 */

  /* 強調 */
  --accent: #ec5b2b;          /* 橘色，個人風格標誌色 */

  /* 其他 */
  --card-bg: #F0F0EB;         /* 卡片底色 */
  --border: #E0DDD6;          /* 邊框 */
}
```

### 明暗節奏

頁面由上到下的背景色交替：
```
亮 (Hero #FAFAF7)
→ 暗 (01 過渡 #2E2318)
→ 亮 (Digital 作品區 #FAFAF7)
→ 暗 (02 過渡 #2E2318)
→ 亮 (Graphic 區 #FAFAF7 / #EDECE4)
→ 亮 (About #FAFAF7)
→ 暗 (Footer #2E2318)
```

### 字體

```css
/* Google Fonts 載入 */
@import url('https://fonts.googleapis.com/css2?family=Ojuju:wght@700;800&family=Savate:wght@400;500;600&family=Mulish:wght@400;500;600&display=swap');

/* 本地字體 */
@font-face {
  font-family: 'Taipei Sans TC';
  src: url('/fonts/TaipeiSansTC-Bold.woff2') format('woff2');
}

:root {
  --font-heading: 'Ojuju', sans-serif;       /* 英文大標題 */
  --font-subheading: 'Savate', sans-serif;    /* 英文副標題/導覽 */
  --font-body-en: 'Mulish', sans-serif;       /* 英文內文 */
  --font-body-zh: 'Taipei Sans TC', sans-serif; /* 中文全部 */
}
```

### 圓角

```css
--radius-card: 12px;
--radius-pill: 999px;
--radius-button: 8px;
```

---

## 頁面結構（單頁滾動 + Graphic 全螢幕覆蓋）

```
┌─────────────────────────────────────────────┐
│ Marquee（橘色跑馬燈）                         │ ← position: fixed, 滾過 Hero 後消失
├─────────────────────────────────────────────┤
│ Hero                                         │ ← 100vh
│   膠囊動畫 + ASCII Art 粒子互動 + 名字靠底     │
├─────────────────────────────────────────────┤
│ Nav（sticky）                                │ ← Hero 離開後才出現
├─────────────────────────────────────────────┤
│ Section: 01 DIGITAL WORKS（暖棕過渡）         │
├─────────────────────────────────────────────┤
│ Digital 作品卡片 ×4                           │
│   → 點擊展開作品詳情                          │
├─────────────────────────────────────────────┤
│ Section: 02 GRAPHIC WORKS（暖棕過渡 + 拉伸）  │
├─────────────────────────────────────────────┤
│ Graphic 入口（插畫長圖，點擊進入全螢幕拖曳）   │
│ Selected Works Gallery                       │
├─────────────────────────────────────────────┤
│ Section: 03 ABOUT                            │
│   履歷卡片 + 插畫背景                         │
├─────────────────────────────────────────────┤
│ Footer（暖棕底 + 幾何徽章掉落）               │
└─────────────────────────────────────────────┘

【全螢幕覆蓋 — Graphic 拖曳體驗】
  點擊 Graphic 入口 → 全螢幕 overlay
  插畫底圖 + 商品散落 + 自由拖曳 + 點擊看介紹
  右上角 ✕ 關閉回到主頁
```

---

## 載入動畫：百葉窗

```
元件：LoadingBlinds.jsx
位置：position: fixed, inset: 0, z-index: 99999
結構：
  ┌────────────────────────────────┐
  │ 葉片 1  (width:100%, height: 100/12vh) │
  │ 葉片 2                                  │
  │ 葉片 3                                  │
  │ ...                                     │
  │ 葉片 12                                 │
  │                     ┃ ← 拉桿（右側）     │
  │                     ● ← 拉桿底部圓頭     │
  └────────────────────────────────┘

葉片：
  數量：12 片
  背景色：var(--bg-light) #FAFAF7
  每片 height: calc(100vh / 12)
  3D 翻轉：父容器 perspective: 1000px
  翻開：rotateX(0deg) → rotateX(90deg)
  transform-origin: top center

拉桿：
  位置：right: 48px, 垂直置中
  寬度：2px, 高度：60% of viewport
  底部：圓形 handle（12px 圓，border: 2px solid #ccc）
  顏色：#ccc

時間軸：
  0.0s  — 百葉窗全關（12 片覆蓋全螢幕）
  0.3s  — 拉桿微晃動（translateX: 0→3→-3→0, duration: 0.3s）
  0.5s  — 拉桿往下移動（translateY: 0→80px, duration: 0.8s, ease: "power2.inOut"）
  0.5s  — 葉片從上到下依序翻開：
          rotateX(0deg) → rotateX(90deg)
          stagger: 0.04s
          duration: 0.3s each
          ease: "power2.in"
  1.3s  — 全部翻開
  1.5s  — 整個 overlay opacity→0, 然後 display:none / unmount
  1.6s  — Hero 動畫開始（Text Scramble + 膠囊掉落 + ASCII Art 出現）

實作：
  用 GSAP timeline
  動畫結束後 setState 移除元件（不要留在 DOM 裡）
```

---



### 1. Marquee（跑馬燈）

```
位置：fixed top, z-index 最高
背景：var(--accent) #ec5b2b
文字：白色, 8px, letter-spacing: 3px, 全大寫
內容：BRAND × VISUAL × INTERACTION × VIBECODING（無限循環）
動畫：CSS animation, translateX, 20s linear infinite
行為：Intersection Observer 監聽 Hero，Hero 離開視窗後 marquee slideUp 消失
高度：~28px
```

### 2. Hero

```
高度：100vh
背景：var(--bg-light)

元素（由上到下）：
  ┌─────────────────────────────────────────────┐
  │ [●][●][●][●]  ← 膠囊動畫         [ASCII Art]│
  │ [Brand][UI/Interaction]           [插畫粒子  ]│
  │ [VibeCoding][Motion]              [位移互動  ]│
  │                                              │
  │                                              │
  │                                              │
  │ DORISKAO®     ← 超大，靠底靠左，撐滿螢幕寬度  │
  └─────────────────────────────────────────────┘

名字：
  字體：Ojuju ExtraBold
  大小：clamp(80px, 15vw, 200px)，一行 DORISKAO®
  位置：左對齊，靠近螢幕底部
  ® 符號：用 var(--accent) 橘色
  動畫：Text Scramble 解碼（進入頁面時觸發）
  滾動行為：parallax 上移 + 縮小（GSAP ScrollTrigger, scrub）

膠囊動畫（左上角）：
  1. 四顆圓球（14px）從上方掉落（GSAP, y: -200, ease: "bounce.out", stagger: 0.1）
  2. 落定後圓球 expand 成膠囊（width: auto, transition 0.3s）
  3. 文字淡入（opacity 0→1）
  4. 內容：Brand / UI·Interaction / VibeCoding(橘色邊框) / Motion

ASCII Art 互動（右上角）：
  技術：Canvas + requestAnimationFrame
  來源圖：/public/images/hero-character.png（小笨狗插畫）
  處理：讀取圖片像素 → 暗像素轉為文字符號粒子
  符號集：$ % # @ ? * + ; : , .
  每顆粒子有：原始位置 (homeX, homeY) + 當前位置 (x, y) + 速度 (vx, vy)
  游標互動：半徑 80px 內的粒子被推開（斥力，距離衰減）
  回彈：離開後彈簧回彈 0.3s（spring physics: dx * 0.05 lerp）
  大小：約 300×400px
```

### 3. Nav（導覽列）

```
觸發：Intersection Observer，Hero 離開視窗後 sticky 出現（slideDown）
位置：sticky top
背景：rgba(250,250,247, 0.85) + backdrop-blur
z-index：高於內容，低於 marquee

結構：
  左：Works（anchor link 到 Digital 區）
  中：DORIS KAO（小字）
  右：About（anchor link）+ [TC/EN] 切換按鈕（膠囊）

TC/EN 切換：
  React Context 管理語言狀態
  所有文字內容放在 i18n object 裡
  切換時不重新整理頁面
```

### 4. Section 過渡：01 DIGITAL WORKS

```
背景：var(--bg-warm-brown)
高度：100vh, display: flex, align-items: center, justify-content: center

內容：
  「01」：8px, letter-spacing: 4px, var(--accent)
  「DIGITAL ✦ WORKS」：一行，Ojuju Bold, ~60px, var(--text-on-brown)
  副標：「brand → visual → interaction → code」, 10px, #887766

動畫：
  ScrollTrigger 觸發，scale(0.8) + opacity(0) → scale(1) + opacity(1)
  duration: 0.8s, ease: "power2.out"
```

### 5. Digital 作品卡片 ×4

```
背景：var(--bg-light)
佈局：4 欄 flex，各卡片高度不同（Beatrice Mucci 風格交錯）

卡片高度（px，大約值）：
  Pickmin: 360px
  UI Tweaker: 420px（margin-top: 40px）
  GOOGOOlii: 320px
  Auto-archive: 380px（margin-top: 20px）

卡片結構：
  ┌──────────────────┐
  │                  │ ← 圓角 12px，overflow hidden
  │   video loop     │ ← <video autoplay muted loop> 或 GIF
  │   or screenshot  │
  │                  │
  │  [view project]  │ ← hover 時浮現，膠囊按鈕，位置 bottom-right
  └──────────────────┘
  作品名                ← font-weight: 500, 14px
  — 分類標籤            ← color: #888, 12px

初始狀態：卡片 face-down（blur(10px) + scale(0.95) + opacity(0)）
滾動動畫：ScrollTrigger 逐一翻開，stagger 0.15s
  → blur(0) + scale(1) + opacity(1), duration: 0.6s

Hover 效果（CSS transition）：
  transform: translateY(-4px)
  box-shadow: 0 8px 24px rgba(0,0,0,0.1)
  [view project] pill: opacity 0→1

點擊行為：展開作品詳情（inline expand below card，或 overlay）
```

### 6. 作品詳情（展開後）

```
結構（參考 Julie Freund-Poulsen）：
  ┌──────────────┬──────────────────────────┐
  │ 作品名（大）   │                          │
  │              │                          │
  │ ABOUT        │   screenshots            │
  │ 一段說明      │   video                  │
  │              │   mockup                 │
  │ ROLE         │                          │
  │ 角色         │                          │
  │              │                          │
  │ TECH STACK   │                          │
  │ React, etc   │                          │
  │              │                          │
  │ LINK         │                          │
  │ Live site →  │                          │
  └──────────────┴──────────────────────────┘

動畫：height 0→auto + opacity 0→1, duration: 0.4s
關閉：再次點擊卡片或關閉按鈕
```

#### 作品內容（中/英雙語）

**Pickmin Postcards**
```
EN:
  About: A postcard tracking and collection web app for Pikmin Bloom players. Led the full product design — visual system, UI, interaction logic, and cloud deployment — entirely through VibeCoding.
  Role: Independent design + development
  Tech: React, Vite, Supabase, Cloudflare R2, PWA
  Deliverables: 10 pages, 4-language i18n, admin dashboard, 26k+ lines
  Link: [live site URL]

ZH:
  About: 為 Pikmin Bloom 玩家打造的明信片追蹤與收藏 Web App。從零主導完整產品設計——視覺系統、UI 介面、互動邏輯到雲端部署，全程以 VibeCoding 方式實作。
  Role: 獨立設計 + 開發
  Tech: React, Vite, Supabase, Cloudflare R2, PWA
  Deliverables: 10 個頁面、4 語言 i18n、管理後台、26,000+ 行原始碼
  Link: [線上版網址]
```

**UI Tweaker**
```
EN:
  About: A visual fine-tuning tool for VibeCoding designers. The control panel references Figma's property panel logic, covering 9 design categories with real-time preview and structured output for AI coding tools.
  Role: Design + development + publishing
  Tech: Claude Code Plugin, JavaScript, HTML/CSS
  Deliverables: Plugin, bilingual landing page, GitHub repo
  Link: https://dhosruiasn.github.io/ui-tweaker-skill/

ZH:
  About: 為 VibeCoding 設計師打造的視覺微調工具。控制面板參考 Figma 屬性面板邏輯，涵蓋 9 大設計類別的即時預覽與結構化輸出。
  Role: 設計 + 開發 + 發布
  Tech: Claude Code Plugin, JavaScript, HTML/CSS
  Deliverables: Plugin、雙語說明頁、GitHub repo
  Link: https://dhosruiasn.github.io/ui-tweaker-skill/
```

**GOOGOOlii 咕咕力**
```
EN:
  About: Brand e-commerce website for my illustration IP brand GOOGOOlii. Core concept: "entering a store that doesn't feel like e-commerce." Features drag-to-basket shopping, 3D checkout conveyor (React Three Fiber), A24-style title cards, and Web Audio synthesis.
  Role: Brand owner + visual system + architecture + development
  Tech: Next.js, React Three Fiber, GSAP, dnd-kit, Firebase, ECPay
  Status: In Progress
  
ZH:
  About: 為自有插畫 IP 品牌 GOOGOOlii 咕咕力打造品牌電商網站。核心精神：「進來逛，不像在逛電商」。涵蓋拖曳入籃購物、3D 結帳輸送帶（React Three Fiber）、A24 風格標題卡過場與 Web Audio 即時合成音效。
  Role: 品牌擁有者 + 視覺系統 + 架構規劃 + 開發
  Tech: Next.js, React Three Fiber, GSAP, dnd-kit, Firebase, ECPay
  Status: 進行中
```

**蝦皮自動化歸檔工具**
```
EN:
  About: An AI-powered automation tool built during my tenure at Shopee to solve archiving workflow bottlenecks. Demonstrates the mindset of "a designer who builds their own tools."
  Role: Problem discovery + tool design + development
  Tech: VibeCoding, AI-assisted development
  Note: Internal tool, no public interface

ZH:
  About: 於蝦皮任職期間，以 AI 工具開發的自動化歸檔工具，解決團隊工作流程效率問題。展現「設計師不只做設計，還能自己造工具」的思維。
  Role: 需求發現 + 工具設計 + 開發
  Tech: VibeCoding, AI 輔助開發
  Note: 內部工具，無公開介面
```

### 7. Section 過渡：02 GRAPHIC WORKS

```
背景：var(--bg-warm-brown)
高度：100vh

內容：
  「02」：8px, letter-spacing: 4px, var(--accent)
  「GRAPHIC WORKS」：一行，Ojuju Bold, ~60px, var(--text-on-brown)
  副標：「illustration × brand × merchandise」

動畫（Studio Namma 文字拉伸）：
  ScrollTrigger scrub:
  進入時：scaleY(1) → scaleY(2.5)（文字垂直拉伸到佔滿螢幕）
  離開時：scaleY(2.5) → scaleY(1)（收回正常）
  transform-origin: center center
```

### 8. Graphic 入口

```
背景：var(--bg-light)

入口元素：
  可點擊的插畫長圖（圓角 12px, overflow hidden）
  底部或中間放 ENTER 按鈕（膠囊, 半透明白色底）
  hover：微微 scale(1.02) + 陰影

點擊行為：
  開啟全螢幕 overlay（position: fixed, inset: 0, z-index: 9999）
  背景：插畫底圖
  商品/衣服/貼紙以 dnd-kit draggable 散落
  入場動畫：物品從四面八方飛入（GSAP stagger, random positions）
  點擊物品 → 彈出介紹卡片（scale 0→1 + fade in）
  右上角 ✕ 關閉按鈕 → overlay fade out 回到主頁

素材需求：
  - 插畫底圖（Doris 提供）
  - 各商品去背圖（T-shirt, sticker, poster, keyring, market photo 等）
```

### 9. Selected Works Gallery

```
位置：Graphic 入口下方
背景：var(--bg-texture)

佈局：CSS Grid, 大小圖交錯（Petr Menhart gallery-wall 風格）
  grid-template-columns: 2fr 1fr 1fr
  第一張（插畫）grid-row: span 2

動畫：ScrollTrigger，圖片 stagger fade in + translateY(20px→0)

素材需求：Doris 從 Wix 精選 5-8 張平面/品牌代表作
```

### 10. Section: 03 ABOUT

```
背景：var(--bg-light)

佈局：兩欄
  左欄（60%）：資訊卡片
  右欄（40%）：插畫背景（position: sticky, top: nav height）

資訊卡片內容：
  ┌───────────────────────────────────────┐
  │ 個人簡介（一段文字）                    │
  │                                       │
  │ ─────────────────────                 │
  │ EXPERIENCE                            │
  │ Shopee Taiwan — Graphic Designer      │
  │ 2021–2026 (~5 yrs)                    │
  │ online · offline · IP · nationwide    │
  │                                       │
  │ ─────────────────────                 │
  │ CAPABILITIES                          │
  │ 01 Brand identity                     │
  │ 02 UI / Interaction design            │
  │ 03 VibeCoding                         │
  │ 04 Motion design                      │
  │ 05 IP / Character design              │
  │                                       │
  │ ─────────────────────                 │
  │ TOOLS                                 │
  │ Figma · Illustrator · Photoshop ·     │
  │ After Effects · Claude · Cursor ·     │
  │ React · Next.js · Git                 │
  │                                       │
  │ [Download CV ↓]                       │
  └───────────────────────────────────────┘

名字顯示：Doris Kao（高萱彤）← 正式全名只在這裡出現

能力編號：01-05 用 var(--accent) 橘色
動畫：ScrollTrigger，卡片從下方 slide up + 能力編號 stagger fade in
```

### 11. Footer

```
背景：var(--bg-warm-brown)
padding: 60px 底部

元素（全部包在幾何形狀裡，掉落散落）：
  ⬤ 圓形 #1A1A1A → LinkedIn icon
  ◖◗ 膠囊 #ec5b2b → hello@doriskao.com（白字）
  ⬤ 圓形 #1A1A1A → Instagram icon
  ◻ 圓角矩形 #EDE4D0 → DORIS KAO（深棕字）
  ◻ 圓角矩形 #1A1A1A → Wix Portfolio →（奶白字）
  ⬤ 小圓形 #1A1A1A → ©

每個元素各有不同旋轉角度（-5° / 2° / 4° / -3° / 6° / -2°）

動畫（ScrollTrigger 觸發）：
  GSAP .from({
    y: -300,
    rotation: () => Math.random() * 40 - 20,
    opacity: 0,
    ease: "bounce.out",
    duration: 1.2,
    stagger: 0.08
  })

底部小字：© 2026 Doris Kao（高萱彤）, color: #887766
```

---

## 全站動畫一覽

| 區塊 | 動畫 | 技術 | 觸發 |
|---|---|---|---|
| 百葉窗載入 | 拉桿晃動→下拉→葉片翻開→消失 | GSAP timeline | 頁面載入 |
| Marquee | 水平無限滾動 | CSS animation translateX | 百葉窗結束後開始 |
| Hero 名字 | Text Scramble 解碼 | 原生 JS ~30 行 | 頁面載入 |
| Hero 名字 | Parallax 上移 + 縮小 | GSAP ScrollTrigger scrub | 滾動 |
| Hero 膠囊 | 圓球掉落 → 展開膠囊 → 文字淡入 | GSAP timeline + bounce | 頁面載入 delay 0.5s |
| Hero ASCII Art | 粒子位移（游標散開 + 彈簧回彈） | Canvas + requestAnimationFrame | 游標移動 |
| Nav | Slide down 出現 | CSS transition + Intersection Observer | Hero 離開視窗 |
| 01 過渡 | Scale up + fade in | GSAP ScrollTrigger | 滾動進入視窗 |
| Digital 卡片 | Face-down → flip reveal（blur + scale + opacity） | GSAP ScrollTrigger stagger | 滾動進入視窗 |
| 卡片 hover | Lift 4px + shadow + CTA pill | CSS transition | hover |
| 作品詳情 | Height expand + fade in | GSAP / CSS | 點擊卡片 |
| 02 過渡 | 文字 scaleY 垂直拉伸 | GSAP ScrollTrigger scrub | 滾動 |
| Graphic 入口 hover | Scale 1.02 + shadow | CSS transition | hover |
| 拖曳體驗入場 | 物品從四面飛入 | GSAP stagger | overlay 開啟 |
| 拖曳 | 自由拖曳 | dnd-kit | 使用者操作 |
| 物品點擊彈出 | Scale 0→1 + fade in | CSS/GSAP | 點擊 |
| Gallery | 圖片 stagger fade in | GSAP ScrollTrigger | 滾動進入視窗 |
| About 卡片 | Slide up from bottom | GSAP ScrollTrigger | 滾動進入視窗 |
| About 能力編號 | Stagger fade in | GSAP stagger | 滾動進入視窗 |
| Footer 徽章 | 從上方掉落 + rotation + bounce | GSAP stagger + bounce ease | 滾動進入視窗 |

---

## Text Scramble 實作參考

```javascript
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '', complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) { complete++; output += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += char;
      } else { output += from; }
    }
    this.el.innerText = output;
    if (complete === this.queue.length) this.resolve();
    else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
  }
}
```

---

## ASCII Art 粒子系統實作要點

```javascript
// 1. 載入圖片到 canvas，讀取像素
// 2. 每個暗像素 → 一個粒子 { homeX, homeY, x, y, vx, vy, char }
// 3. 符號集：'$%#@?*+;:,.'（暗→亮）
// 4. 每幀：
//    - 計算游標距離
//    - 半徑 80px 內施加斥力：force = (radius - dist) / radius
//    - 斥力方向：粒子到游標的反方向
//    - 彈簧回彈：x += (homeX - x) * 0.05
//    - 繪製：ctx.fillText(char, x, y)
// 5. 字體大小：~8px monospace
// 6. Canvas 大小：約 300x400px
// 7. 來源圖：/public/images/hero-character.png
```

---

## i18n 結構

```javascript
const i18n = {
  zh: {
    nav: { works: '作品', about: '關於' },
    hero: { subtitle: '數位網站設計師' },
    section01: { title: 'DIGITAL WORKS', subtitle: '品牌 → 視覺 → 互動 → 實作' },
    section02: { title: 'GRAPHIC WORKS', subtitle: '插畫 × 品牌 × 商品' },
    section03: { title: '關於' },
    // ... 所有文字
  },
  en: {
    nav: { works: 'Works', about: 'About' },
    hero: { subtitle: 'Digital Web Designer' },
    section01: { title: 'DIGITAL WORKS', subtitle: 'brand → visual → interaction → code' },
    section02: { title: 'GRAPHIC WORKS', subtitle: 'illustration × brand × merchandise' },
    section03: { title: 'ABOUT' },
    // ... 所有文字
  }
};
```

---

## 檔案結構建議

```
src/
├── App.jsx
├── main.jsx
├── i18n.js                    # 雙語文字
├── styles/
│   ├── global.css             # reset + variables + fonts
│   └── components/            # 各元件 CSS
├── components/
│   ├── LoadingBlinds.jsx       # 百葉窗載入動畫
│   ├── Marquee.jsx
│   ├── Hero.jsx
│   ├── AsciiArt.jsx           # Canvas 粒子系統
│   ├── TextScramble.jsx
│   ├── Nav.jsx
│   ├── SectionTransition.jsx  # 01/02/03 過渡標題
│   ├── DigitalWorks.jsx
│   ├── ProjectCard.jsx
│   ├── ProjectDetail.jsx
│   ├── GraphicEntry.jsx       # 插畫入口
│   ├── GraphicOverlay.jsx     # 全螢幕拖曳體驗
│   ├── Gallery.jsx
│   ├── About.jsx
│   ├── Footer.jsx
│   └── LanguageToggle.jsx
├── data/
│   └── projects.js            # 作品資料（中英雙語）
public/
├── fonts/
│   └── TaipeiSansTC-Bold.woff2
├── images/
│   ├── hero-character.png     # ASCII Art 來源
│   ├── projects/              # 作品截圖/影片
│   ├── graphic/               # 平面作品圖
│   └── about/                 # About 插畫背景
└── videos/
    └── projects/              # 作品卡片 loop 影片
```

---

## 素材清單（Doris 需提供）

### 必要
- [ ] Hero 插畫（小笨狗，高對比黑白 PNG，用於 ASCII Art）— **已有**
- [ ] 4 個 Digital 作品的截圖或影片 loop（每個 2-4 張）
- [ ] Graphic 入口用的插畫長圖
- [ ] 平面作品精選 5-8 張（Gallery 用）
- [ ] About 頁插畫背景
- [ ] 台北黑體字體檔（.woff2）
- [ ] 履歷 PDF（提供下載）

### 選配
- [ ] GOOGOOlii 商品去背圖（拖曳桌面用：T-shirt, sticker, keyring 等）
- [ ] 個人照片（About 區小張）
- [ ] favicon / og:image

---

## 參考網站

| 參考 | 網址 | 取用元素 |
|---|---|---|
| Petr Menhart | petrmenhart.xyz | Gallery-wall 散落排列, custom cursor |
| Eli Marigo | elimarigodesign.com | 可拖曳桌面, 質感底圖 |
| Beatrice Mucci | bicemucci.com | 作品卡片 grid + hover CTA, 詳情頁兩欄 |
| Studio Dialect | studiodialect.com | Text Scramble, 技術感, 巨型字體 |
| Gayka | （截圖參考） | 跑馬燈 + 巨型名字 Hero |
| Julie Freund-Poulsen | （截圖參考） | 作品詳情 metadata 結構 |
| Studio Namma | studionamma.com | 文字垂直拉伸過渡效果 |
| Will Vint | （截圖參考） | Hero 名字 parallax 縮小 |
| Atelier C'est par là | （截圖參考） | Footer 元素掉落散落 |
| 版塊設計 | blockstudio.tw | 目標公司風格參考 |
