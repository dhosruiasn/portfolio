import { assetPath } from './assetPath.js';

const warmedVideos = new Map();
const warmedImages = new Set();
const MEDIA_PATH_RE = /\.(avif|webp|png|jpe?g|gif|svg|mp4|webm|mov)(\?.*)?$/i;
const VIDEO_PATH_RE = /\.(mp4|webm|mov)(\?.*)?$/i;
const LOCAL_PATH_RE = /^\/(images|videos|cv)\//;

function collectMediaPaths(value, output = new Set()) {
  if (!value) return output;
  if (typeof value === 'string') {
    if (LOCAL_PATH_RE.test(value) && MEDIA_PATH_RE.test(value)) output.add(value);
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectMediaPaths(item, output));
    return output;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => collectMediaPaths(item, output));
  }
  return output;
}

function warmImage(src) {
  const href = assetPath(src);
  if (!href || warmedImages.has(href)) return;
  warmedImages.add(href);

  const image = new Image();
  image.decoding = 'async';
  image.src = href;
  image.decode?.().catch(() => {});
}

function warmVideo(src) {
  const href = assetPath(src);
  if (!href || warmedVideos.has(href)) return;

  // 只暖 metadata，不整支下載：先前用 preload='auto'+load() 會把該專案「所有」影片
  // （hero + motion + flow）同時全量抓下來搶頻寬，把最該先播的 hero 拖慢。
  // 真正的播放下載交給畫面上、進入視窗的 <video> 元件各自處理。
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.src = href;
  warmedVideos.set(href, video);
}

export function warmProjectMedia(project) {
  if (typeof document === 'undefined' || !project) return;
  collectMediaPaths(project).forEach((src) => {
    if (VIDEO_PATH_RE.test(src)) warmVideo(src);
    else warmImage(src);
  });
}
