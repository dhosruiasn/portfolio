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

  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.src = href;
  warmedVideos.set(href, video);
  video.load();
}

export function warmProjectMedia(project) {
  if (typeof document === 'undefined' || !project) return;
  collectMediaPaths(project).forEach((src) => {
    if (VIDEO_PATH_RE.test(src)) warmVideo(src);
    else warmImage(src);
  });
}
