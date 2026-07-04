// iOS 正解捲動鎖定：body { overflow:hidden } 在 iOS Safari 不會鎖住背景捲動，
// 且覆蓋層捲到底時會把慣性捲動鏈到背景 → 關閉後背景位置錯亂、繼續滑會「快速亂捲」。
// 改用 position:fixed + top:-scrollY 真正凍結 body，關閉時精準還原捲動位置。
// lockCount 讓巢狀／StrictMode 雙掛載安全（成對 lock/unlock 才真正還原）。

let lockCount = 0;
let savedScrollY = 0;

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    const { body } = document;
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const { body } = document;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflow = '';
    // 立即還原到鎖定前的位置（用 'auto' 不觸發平滑動畫，避免「快速捲動」感）
    window.scrollTo(0, savedScrollY);
  }
}
