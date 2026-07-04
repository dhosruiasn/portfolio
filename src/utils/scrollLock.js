// iOS 正解捲動鎖定：body { overflow:hidden } 在 iOS Safari 不會鎖住背景捲動，
// 且覆蓋層捲到底時會把慣性捲動鏈到背景 → 關閉後背景位置錯亂。
// 改用 position:fixed + top:-scrollY 真正凍結 body，關閉時精準還原捲動位置。
// lockCount 讓巢狀／StrictMode 雙掛載安全（成對 lock/unlock 才真正還原）。
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    const { body, documentElement } = document;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflow = '';
    // 還原必須是「瞬時」捲動：html 有 scroll-behavior:smooth，普通 scrollTo 會變
    // 平滑捲動、被本頁的 ScrollTrigger pin 夾住 → 停在別的切版（實機回報的亂跑）。
    // 臨時關掉 smooth、instant 定位、再還原。
    const prevBehavior = documentElement.style.scrollBehavior;
    documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedScrollY);
    documentElement.style.scrollBehavior = prevBehavior;
    // body fixed 期間 layout 塌陷可能讓 ScrollTrigger 記錯 pin 位置，下一幀重算
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
