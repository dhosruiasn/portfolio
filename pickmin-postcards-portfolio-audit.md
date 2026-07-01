# Pickmin Postcards Portfolio Audit

Audit date: 2026-06-30  
Scope: Doris Kao portfolio site, with emphasis on the Pickmin Postcards project detail page and Design System Case Study readiness.

## 1. Executive Summary

目前 Pickmin Postcards 詳情頁已具備「產品 case study」雛形，完成度約 **45%**；若以完整 **Design System Case Study** 標準來看，完成度約 **30-35%**。

最大優勢是：已有清楚的產品背景、使用者痛點、資訊架構、4 張正式產品截圖、首頁 hero mockup，以及可說明產品複雜度的基礎數據。

最大缺口是：Design System 仍停留在「摘要文字與 chip 列表」，缺少 tokens、元件狀態、產品專屬元件、playground、motion、localization stress test、before/after 與 system-to-product 的可視化證據。

目前**不建議直接拿去投遞 Design System / UI System 導向職缺**。若是一般產品設計或 VibeCoding 作品，可作為初版，但投遞前至少應補齊 P0 項目。

投遞前最需要完成：

1. 補上 Why Design System 與設計原則的清楚敘事。
2. 補上產品專屬元件與狀態展示：Postcard Card、Folder Card、CollectionSheet。
3. 補上 From System to Product：用完整畫面標註元件如何落地。
4. 補上 Motion 實際展示與 reduced motion 說明。
5. 修正 1024px 橫向溢出、外部連結 429 challenge、英文詳情頁 fallback 中文問題。

檢查方式：

- 讀取專案結構、資料檔、共用元件、CSS、素材。
- 本機啟動 `npm run dev`，用瀏覽器檢查 375 / 430 / 768 / 1024 / 1440px。
- 執行 build 到 `/tmp/portfolio-audit-build`。
- 未修改任何既有程式碼、樣式、文字或素材。

## 2. Section Checklist

| Section | Status | Existing Content | Missing / Weak Points | File / Component | Priority |
|---|---|---|---|---|---|
| Project Overview | 🟡 Partial | 有名稱、subtitle、summary、ROLE / SCOPE / STACK、hero mockup、live link | 沒有 ABOUT / PLATFORM / LANGUAGES / RESPONSIBILITIES 分欄；首屏視覺是靜態 mockup，沒有操作影片 | `src/data/projects.js`, `src/components/ProjectDetailPage.jsx` | P0 |
| Product Complexity | 🟡 Partial | 有 10+、4 language、PWA、R2 metrics | 沒有 Multiple User Flows、User/Admin Interfaces 的畫面矩陣；未明確導向「為何需要 DS」 | `src/data/projects.js` | P0 |
| Why a Design System | 🔴 Missing | 只有 Design System chip 區塊 | 缺少系統建立原因、原本問題、擴充邏輯 | `src/components/ProjectDetailPage.jsx` | P0 |
| Design Principles | 🟡 Partial | 有 4 條原則資料 | 頁面只顯示前 2 條；命名偏抽象，沒有對應介面影響 | `src/data/projects.js`, `src/components/ProjectDetailPage.jsx` | P0 |
| Visual Foundations | 🟡 Partial | 有 Color / Typography 文字 | 沒有語意 token、數值、spacing、radius、touch target、surface hierarchy、實際畫面對照 | `src/data/projects.js` | P0 |
| Core Components | 🟡 Partial | 有 component names：Search bar、Filter chips、Toast 等 | 只顯示前 8 個 chip；沒有 variant / state / size / usage | `src/components/ProjectDetailPage.jsx` | P0 |
| Product-specific Components | 🔴 Missing | 資料中有 Postcard card 名稱 | 沒有 Postcard Card / Folder Card / CollectionSheet / Map Marker 狀態展示 | `src/data/projects.js` | P0 |
| Component Playground | 🔴 Missing | 無 | 沒有可操作元件、鍵盤支援、語言切換、loading/failed 狀態 | `src/components` 無相關元件 | P1 |
| Interaction Patterns | 🟡 Partial | 有 user flow 文字與流程節點 | 不是收藏流程；沒有 Loading / Success / Error；沒有畫面序列或影片 | `src/data/projects.js`, `src/components/ProjectDetailPage.jsx` | P1 |
| Motion System | 🔴 Missing | 頁面本身有 GSAP reveal / falling chips | 沒有產品內 motion 展示、duration/easing token、tab/bottom sheet/modal/toast motion | `src/components/ProjectDetailPage.jsx` | P0 |
| Localization | 🟡 Partial | 有多語系截圖、4-language metric | 詳情頁只有 zh caseStudy；英文模式 fallback 中文；沒有四語元件比較與長字測試 | `src/data/projects.js`, `src/components/ProjectDetailPage.jsx` | P1 |
| From System to Product | 🟡 Partial | 有 Home/Search/Admin/Multilingual screenshots | 沒有標註元件名稱與 token 對應；未清楚連回 DS | `src/data/projects.js` | P0 |
| Before / After | 🔴 Missing | 無 | 沒有建立系統前後問題與解法對照 | 無 | P1 |
| Outcome & Reflection | 🟡 Partial | 有 outcome body 與成果 chips | 偏成果摘要，缺少學習、限制、未完成項目 | `src/data/projects.js` | P1 |
| CTA | 🟡 Partial | 有「前往網站」 | 沒有 View Design System；live link `curl` 回 429 Vercel challenge；沒有區分正式 App / DS 展示頁 | `src/components/ProjectDetailPage.jsx` | P0 |

## 3. Existing Strengths

### 產品敘事基礎清楚

- 具體內容：Overview、Problem、Goal & Users、Flow、Architecture 已存在。
- 所在位置：Pickmin 詳情頁前半段。
- 為什麼有效：能先理解產品背景，不會直接跳 UI kit。
- 建議：保留，但在 Architecture 後接 Why Design System，讓 Design System 的出現有原因。

### 已有正式產品截圖

- 具體內容：`home-public-browse.png`、`search-owned-status.png`、`upload-admin-review.png`、`multilingual-comparison.png`。
- 所在位置：`public/images/projects/pickmin/`，由 Key Design Decisions 區塊使用。
- 為什麼有效：有真實畫面證據，不只是文字描述。
- 建議：改為「畫面 + 元件標註」，讓截圖從產品佐證升級成 Design System 落地證明。

### 產品複雜度已有初步數據

- 具體內容：10+ screens、4 languages、PWA、R2。
- 所在位置：hero 後的 metrics。
- 為什麼有效：能快速說明產品不是單頁 landing page。
- 建議：補成產品規模矩陣，加入 multiple user flows、user/admin interface、mobile-first、收藏流程。

### 全站視覺風格一致度尚可

- 具體內容：Pickmin 詳情頁沿用作品集的粗標題、橘色 accent、圓角卡片與 GSAP reveal。
- 所在位置：`ProjectDetailPage.css`。
- 為什麼有效：沒有完全脫離作品集語氣。
- 建議：保留外層作品集語氣，但 Design System 內容區需要更清楚的資訊設計。

## 4. Missing Content

| Missing | Why Important | Suggested Presentation | Assets Needed | Suggested File / Component | Priority |
|---|---|---|---|---|---|
| Why Design System | 讓 DS 展示有動機，不像突然展示色票 | 問題 → 系統化解法 → 支援擴充 | before 狀態截圖或示意 | `DesignSystemIntroSection` | P0 |
| Product-specific Components | 最能證明 UI system 能力 | Postcard Card、Folder Card、CollectionSheet 狀態矩陣 | 各狀態截圖或 React mock data | `ProductComponentShowcase` | P0 |
| Motion System | 目標職缺會看互動與動態邏輯 | WebM/MP4 短 loop + duration/easing table | bottom sheet、toast、search overlay 影片 | `MotionShowcase` | P0 |
| From System to Product | 證明元件不是 UI kit，而是落地到產品 | 完整畫面 + callout labels | Home / Collection / Map / Search Overlay 截圖 | `SystemToProductSection` | P0 |
| Before / After | 讓系統化成果具體可信 | 3-5 個問題與解法對照 | 舊版或重建示意 | `BeforeAfterSection` | P1 |
| Interactive Playground | 展示 React 落地與狀態思維 | Postcard Card controls | postcard image/loading/failed mock | `PostcardPlayground` | P1 |
| 英文 caseStudy | 目前英文切換後仍顯示中文詳情 | 補 `caseStudy.en` 或明確只支援中文 | 翻譯內容 | `src/data/projects.js` | P1 |

## 5. Partial Content

### Design System 區塊

- 目前狀態：已有 `principles / colors / typography / components / states`。
- 問題：render 只顯示每組前 2 筆與前 8 個 components，很多資料存在但沒有顯示。
- 補強方式：保留資料結構，新增分區展示，不要全部塞成 chip wall。

### Localization

- 目前狀態：已有四語截圖與 i18n 指標。
- 問題：沒有同一元件四語比較；英文模式會 fallback 到中文 caseStudy。
- 補強方式：以 Postcard Card 或 Button 做 4-language stress test，補長文字、換行、truncate、font fallback。

### Interaction Flow

- 目前狀態：已有一般 user flow。
- 問題：不是指定的收藏流程，缺少 Loading / Success / Error。
- 補強方式：新增 Select Postcard → CollectionSheet → Folder → Save → Feedback 的 5 步驟畫面。

### Outcome

- 目前狀態：已有成果摘要。
- 問題：缺少 reflection、限制與未完成項目。
- 補強方式：加入「學到什麼 / 限制 / 下一步」短段落，不要新增無證據數字。

### Responsive

- 目前狀態：375 / 430 / 768px 沒有 body-level 橫向捲動。
- 問題：flow note 與放大截圖有負位移裁切；1024px 出現 `bodyScrollWidth 1036 > 1024`。
- 補強方式：檢查 flow note transform、放大截圖 transform、case section full-width 計算方式。

## 6. Recommended Page Structure

1. **保留**：Hero + Overview + Metrics。
2. **保留並移動**：Problem 放在 Overview 後，接 Why Design System。
3. **新增**：Why a Design System。
4. **保留並改寫**：Design Principles，改為 3 個命名原則 + 對應畫面。
5. **新增 / 擴充**：Visual Foundations，從目前 Color / Typography 文字升級成 token display。
6. **新增**：Core Components + Product-specific Components。
7. **新增**：Postcard Playground。
8. **保留並改造**：User Flow 改為 Interaction Patterns。
9. **新增**：Motion System。
10. **保留並擴充**：Localization，從單張截圖變成四語比較。
11. **新增**：From System to Product。
12. **新增**：Before / After。
13. **保留並補強**：Outcome & Reflection。
14. **新增 / 修正**：CTA：Explore Live Prototype + View Design System。

## 7. Required Assets

| Asset | Use | Suggested Size | Format | Path | Priority |
|---|---|---:|---|---|---|
| App Home annotated screenshot | System to Product | 3024 x 1724 or 1440w | PNG/WebP | `public/images/projects/pickmin/` | P0 |
| CollectionSheet flow | Interaction pattern | 1440w or mobile 430w | WebM/MP4 + PNG fallback | `public/videos/projects/` | P0 |
| Postcard Card states | Product component states | 1200w | PNG/WebP or React mock | `public/images/projects/pickmin/` | P0 |
| Motion clips | Motion System | 720-1080w | WebM/MP4 | `public/videos/projects/` | P0 |
| Four-language comparison | Localization stress | 1440w | PNG/WebP | existing can be reused, but needs component-level version | P1 |
| Before / After | System impact | 1440w | PNG/WebP | `public/images/projects/pickmin/` | P1 |
| Token board | Visual Foundations | 1440w | React-rendered preferred | no static asset required | P0 |

Current asset risk:

- `Hero mockup.png`: 5.3MB
- `home-public-browse.png`: 4.7MB
- `search-owned-status.png`: 3.0MB
- Pickmin cover MP4: 24MB

建議在新增更多 media 前先規劃 WebP/WebM 壓縮，避免詳情頁過重。

## 8. Recommended Components

| Component | Why Needed | Reuse | Difficulty | Priority |
|---|---|---|---|---|
| `DesignSystemIntroSection` | 補 Why DS 敘事 | `CaseSection`, `TextPanel` | Low | P0 |
| `VisualFoundationsSection` | 展示 tokens 與使用情境 | existing case panels | Medium | P0 |
| `ProductComponentShowcase` | 展示 Pickmin 專屬元件狀態 | new data + case panels | Medium | P0 |
| `PostcardPlayground` | 可操作展示 React 狀態能力 | likely needs new mock component | Medium-High | P1 |
| `InteractionFlow` | 展示收藏流程與 feedback | existing screenshots + flow styles | Medium | P1 |
| `MotionShowcase` | 補實際動態與邏輯 | video component | Medium | P0 |
| `LocalizationComparison` | 四語 stress test | existing multilingual asset | Medium | P1 |
| `BeforeAfterSection` | 呈現系統化前後差異 | case split layout | Low-Medium | P1 |

## 9. Technical Risks

### i18n fallback

`caseStudy.en` 不存在，英文模式會回退中文內容。

- File: `src/components/ProjectDetailPage.jsx`
- Risk: 英文作品集觀眾會看到中英文混雜。
- Priority: P1

### `html lang` 不同步

`index.html` 固定 `zh-Hant`，React 只在內層 div 設 `lang`。

- File: `index.html`, `src/App.jsx`
- Risk: screen reader / browser language detection 不準確。
- Priority: P1

### 內容被 slice 隱藏

Design System panels 只顯示前 2 筆，components 只顯示前 8 筆。

- File: `src/components/ProjectDetailPage.jsx`
- Risk: 資料存在但頁面沒有展示完整內容。
- Priority: P0

### 外部連結不穩定

`https://pickmin-postcards.vercel.app/` 自動檢查回 `HTTP/2 429` Vercel challenge。

- Status: Needs Manual Review
- Risk: 投遞時 reviewer 可能無法開啟 live prototype。
- Priority: P0

### Console warning

本機頁面有多筆 `GSAP target null not found` warning。

- Risk: 雖非 fatal error，但會降低前端品質可信度。
- Priority: P1

### Responsive overflow

1024px 測到 `bodyScrollWidth 1036 > 1024`；手機版 flow note 與放大截圖有裁切。

- File: `src/styles/components/ProjectDetailPage.css`
- Priority: P0

### Accessibility

沒有 `:focus-visible` CSS；Design System 沒有可操作控制項、selected state attribute 或 playground label。

- Priority: P1

### Build

`npm run build -- --outDir /tmp/portfolio-audit-build --emptyOutDir` 成功，但有 `/portfolio/fonts/Dotrice-Regular.otf` build-time resolve warning。

- Priority: P2

### Missing scripts

`lint`、`typecheck`、`test` scripts 不存在，無法檢查。

- File: `package.json`
- Priority: P2

## 10. Suggested Implementation Order

### Phase 1 | 投遞前必要內容

- 要完成的項目：Why DS、產品專屬元件、From System to Product、CTA、1024 overflow、live link review。
- 需要的素材：Home / Collection / Search / CollectionSheet。
- 涉及檔案：`src/data/projects.js`, `src/components/ProjectDetailPage.jsx`, `src/styles/components/ProjectDetailPage.css`。
- 預估難度：Medium。
- 驗收方式：頁面能回答「為何建立系統、系統如何落地」。

### Phase 2 | Design System 核心展示

- 要完成的項目：Visual Foundations、Core Components、Product-specific Components。
- 需要的素材：tokens、component states。
- 涉及檔案：`src/data/projects.js`, 新增或拆分 Pickmin DS sections。
- 預估難度：Medium。
- 驗收方式：每個元件有 variant/state/usage，不只是 chip。

### Phase 3 | 互動與 Motion

- 要完成的項目：收藏流程、MotionShowcase、Loading/Success/Error。
- 需要的素材：WebM/MP4 短影片。
- 涉及檔案：新增 motion / flow components，`public/videos/projects/`。
- 預估難度：Medium-High。
- 驗收方式：能看到 bottom sheet、toast、search overlay 等實際動態。

### Phase 4 | 多語系與細節

- 要完成的項目：四語比較、英文 caseStudy、lang 同步、focus-visible。
- 需要的素材：四語元件 stress test。
- 涉及檔案：`src/data/projects.js`, `src/context/LanguageContext.jsx`, `src/App.jsx`, `index.html`, CSS。
- 預估難度：Medium。
- 驗收方式：EN/TC 切換內容一致，四語不破版。

### Phase 5 | 獨立 Design System 頁面或加分項

- 要完成的項目：新增 View Design System 頁或專區、進階 playground。
- 需要的素材：完整 component/state data。
- 涉及檔案：視路由或 overlay 設計決定。
- 預估難度：High。
- 驗收方式：CTA 明確區分 live prototype 與 DS showcase。

## 11. Top 5 Priorities

1. **補 Why a Design System**
   - 原因：目前 DS 區塊像突然出現的列表。
   - 目前缺口：沒有問題背景與系統化目的。
   - 完成標準：能清楚說明功能增加、多語、元件狀態、擴充需求如何導致 DS。

2. **補 Product-specific Components**
   - 原因：這是 Pickmin 最有差異化的 UI system 證據。
   - 目前缺口：只有 Postcard card 名稱，沒有狀態展示。
   - 完成標準：Postcard Card、Folder Card、CollectionSheet 至少各 3-5 個狀態。

3. **補 From System to Product**
   - 原因：目前有產品截圖，但沒有元件落地關係。
   - 目前缺口：缺少 callout 與 token/component 對應。
   - 完成標準：Home / Collection / Search 或 Map 畫面能標註使用哪些元件。

4. **補 Motion System**
   - 原因：目前只有作品集頁動畫，不是 Pickmin 產品動態。
   - 目前缺口：沒有 bottom sheet、toast、tab、modal 的 motion 邏輯。
   - 完成標準：至少 3 個短影片 + duration/easing/reduced motion 說明。

5. **修正投遞風險**
   - 原因：連結、i18n、responsive、console 會直接影響可信度。
   - 目前缺口：live link 429、英文詳情中文 fallback、1024 overflow、GSAP warnings。
   - 完成標準：live link 可開、EN/TC 正確、指定 viewport 無橫向溢出、console 無明顯 warning。

## Verification Notes

- `git status --short`: no output before creating this report.
- `npm run build -- --outDir /tmp/portfolio-audit-build --emptyOutDir`: passed.
- Build warning: `/portfolio/fonts/Dotrice-Regular.otf` did not resolve at build time and remains runtime-resolved.
- `npm run lint`: missing script.
- `npm run typecheck`: missing script.
- `npm test`: missing script.
- Browser responsive check: 375 / 430 / 768 / 1024 / 1440px.
- External link check: `https://pickmin-postcards.vercel.app/` returned `HTTP/2 429` Vercel challenge via `curl -I -L`; needs manual review.
