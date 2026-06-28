# Brand Section — GOOGOOlii 商店互動區塊

> 這是 Graphic Works 區的入口，點擊門進入全螢幕拖曳體驗。
> 素材在 `/public/images/brand-section/` 目錄下，全部同畫布尺寸 PNG @2x。

---

## 佈局

所有圖層用 `position: absolute` 疊合在一個固定比例的容器裡（16:9 或依原圖比例）。圖層順序由下到上：

```
z-index 堆疊順序（低→高）：
  1. bg                    （背景）
  2. house-body            （房子主體）
  3. chimney               （煙囪）
  4. door-inside           （門後內容，初始隱藏）
  5. door-closed           （門，覆蓋在 door-inside 上）
  6. awning                （遮雨棚）
  7. signage-googoolii     （招牌）
  8. sign-character             （左邊招牌）
  9. star-1 ~ star-8       （星星，散落各處）
  10. bubble-knock          （對話泡泡）
  11. MY BRAND 文字          （HTML，不是圖片）
  12. 說明文字               （HTML）
```

---

## 動畫時間軸

### 滾動進入視窗時（ScrollTrigger 觸發）：

```
0.0s  — bg + house-body + chimney 淡入（opacity 0→1, duration: 0.4s）
0.2s  — awning 從上方滑入（y: -20→0, opacity 0→1）
0.3s  — sign-character 從左滑入（x: -30→0, opacity 0→1）
0.35s — sign-character 亮燈效果（跟招牌同邏輯，延遲觸發）：
          初始：filter: brightness(0.5)
          動畫：filter: brightness(1.3) drop-shadow(0 0 12px rgba(236,91,43,0.5))
          duration: 0.5s, ease: "power2.out"
0.4s  — signage-googoolii 亮燈效果：
          初始：opacity: 0.3, filter: brightness(0.5)
          動畫：opacity: 1, filter: brightness(1.2) drop-shadow(0 0 10px rgba(255,165,0,0.6))
          duration: 0.6s, ease: "power2.out"
0.5s  — star-1 出現（scale: 0→1, rotation: 0→15deg, opacity 0→1）
0.7s  — star-2 出現（同上，不同 rotation）
0.8s  — star-3
0.9s  — star-4
1.0s  — star-5, star-6
1.1s  — star-7, star-8
1.2s  — "MY BRAND" 文字 Text Scramble 解碼或逐字出現
1.5s  — 說明文字淡入
1.8s  — bubble-knock 彈跳出現（scale: 0→1.1→1, ease: "back.out"）
```

### 門的互動：

```
觸發：點擊 door-closed 或 bubble-knock
動畫：
  1. bubble-knock 淡出消失（opacity→0, scale→0.8, duration: 0.2s）
  2. door-closed 往內推開：
     transform-origin: center center
     scaleX: 1 → 0（水平縮小，模擬往內推開的透視感）
     duration: 0.6s
     ease: "power2.inOut"
  3. door-inside 內容淡入（opacity 0→1, delay: 0.3s）
  4. 可選：門後內容是另一個 CTA「ENTER」，
     點擊進入全螢幕拖曳體驗（GraphicOverlay 元件）

再次點擊或點擊關閉：
  door-closed scaleX: 0 → 1（門關回來）
  bubble-knock 重新出現
```

### 星星持續動畫（進場後循環）：

```css
@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

/* 每顆星星不同 duration 和 delay，避免同步 */
.star-1 { animation: twinkle 3s ease-in-out infinite; }
.star-2 { animation: twinkle 2.5s ease-in-out 0.5s infinite; }
.star-3 { animation: twinkle 4s ease-in-out 1s infinite; }
/* ... 以此類推 */
```

---

## 素材檔案

```
/public/images/graphic/brand-section/
  ├── bg.png
  ├── house-body.png
  ├── chimney.png
  ├── awning.png
  ├── signage-googoolii.png
  ├── door-closed.png
  ├── door-inside.png
  ├── sign-character.png
  ├── bubble-knock.png
  ├── star-1.png
  ├── star-2.png
  ├── star-3.png
  ├── star-4.png
  ├── star-5.png
  ├── star-6.png
  ├── star-7.png
  └── star-8.png
```

所有 PNG 同畫布尺寸（例如 2880×1620 @2x），`position: absolute; top: 0; left: 0; width: 100%; height: 100%;` 疊合即對齊。

---

## React 元件結構

```jsx
// BrandSection.jsx
function BrandSection() {
  const [doorOpen, setDoorOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP ScrollTrigger 入場動畫 timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true
      }
    });

    tl.to('.bg', { opacity: 1, duration: 0.4 })
      .to('.house-body', { opacity: 1, duration: 0.4 }, '<')
      .to('.awning', { opacity: 1, y: 0, duration: 0.3 }, '+=0.1')
      .to('.sign-character', { opacity: 1, x: 0, duration: 0.3 }, '<')
      .to('.signage', { opacity: 1, filter: 'brightness(1.2)', duration: 0.6 }, '+=0.1')
      .to('.star', { opacity: 1, scale: 1, stagger: 0.1, duration: 0.3 }, '+=0.1')
      // ... MY BRAND text scramble
      .to('.bubble', { opacity: 1, scale: 1, ease: 'back.out', duration: 0.4 }, '+=0.3');

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className="brand-section">
      <img className="bg" src="/images/graphic/brand-section/bg.png" />
      <img className="house-body" src="/images/graphic/brand-section/house-body.png" />
      {/* ... 其他圖層 */}
      <img
        className={`door ${doorOpen ? 'open' : ''}`}
        src="/images/graphic/brand-section/door-closed.png"
        onClick={() => setDoorOpen(!doorOpen)}
      />
      {doorOpen && (
        <button className="enter-btn" onClick={() => setOverlayOpen(true)}>
          ENTER
        </button>
      )}
      {overlayOpen && <GraphicOverlay onClose={() => setOverlayOpen(false)} />}
    </div>
  );
}
```
