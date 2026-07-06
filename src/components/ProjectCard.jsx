import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/ProjectCard.css';

const PRIORITY_CARD_VIDEO_IDS = new Set(['pickmin', 'ui-tweaker']);
const AUTOPLAY_AHEAD_VIDEO_IDS = new Set(['pickmin']);

export default function ProjectCard({ project, onOpen, onPrepareOpen, isOpening = false }) {
  const { lang, t } = useLanguage();
  const isVideo = project.mediaType === 'video';
  const shouldPrimeVideo = isVideo && PRIORITY_CARD_VIDEO_IDS.has(project.id);
  const shouldPlayAhead = isVideo && AUTOPLAY_AHEAD_VIDEO_IDS.has(project.id);
  const videoRef = useRef(null);
  const isInViewRef = useRef(shouldPlayAhead);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(shouldPrimeVideo);
  const [videoReady, setVideoReady] = useState(false);

  // 重要作品先掛 src；Pickmin 允許還沒滑到前先 muted play，避免進場時像沒載入。
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const play = () => {
      if ((isInViewRef.current || shouldPlayAhead) && document.visibilityState === 'visible') v.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          if (v.currentSrc && v.readyState === 0) v.load();
          play();
        } else if (!shouldPlayAhead) {
          v.pause();
        }
      },
      { rootMargin: shouldPrimeVideo ? '900px 0px' : '120px 0px', threshold: 0.05 }
    );
    io.observe(v);
    v.addEventListener('loadeddata', play);
    v.addEventListener('canplay', play);
    if (shouldPrimeVideo) {
      if (v.readyState === 0) v.load();
      play();
    }
    document.addEventListener('visibilitychange', play);
    return () => {
      io.disconnect();
      v.removeEventListener('loadeddata', play);
      v.removeEventListener('canplay', play);
      document.removeEventListener('visibilitychange', play);
    };
  }, [shouldPlayAhead, shouldPrimeVideo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoadVideo) return;
    if (v.readyState === 0) v.load();
    if (isInViewRef.current && document.visibilityState === 'visible') v.play().catch(() => {});
  }, [shouldLoadVideo]);
  const cardHeight = typeof project.height === 'number' ? `${project.height}px` : project.height;
  const cardOffset = typeof project.marginTop === 'number' ? `${project.marginTop}px` : project.marginTop || '0px';

  return (
    <div
      className={`project-card project-card--${project.id}${isOpening ? ' project-card--opening' : ''}`}
      style={{
        '--project-card-default-height': cardHeight,
        '--project-card-offset': cardOffset,
      }}
    >
      <button
        className="project-card__media"
        onPointerDown={() => onPrepareOpen?.(project)}
        onClick={() => onOpen(project)}
      >
        <div className="project-card__flip">
          {/* 預設背面：橘色 */}
          <div className="project-card__face project-card__back">
            <span className="project-card__back-mark">DK®</span>
          </div>
          {/* 翻開後正面：作品 */}
          <div className="project-card__face project-card__front">
            {project.media &&
              (isVideo ? (
                <>
                  {project.poster && (
                    <img
                      className="project-card__poster"
                      src={assetPath(project.poster)}
                      alt=""
                      aria-hidden="true"
                      decoding="async"
                    />
                  )}
                  <video
                    ref={videoRef}
                    className={videoReady ? 'project-card__video project-card__video--ready' : 'project-card__video'}
                    src={shouldLoadVideo ? assetPath(project.media) : undefined}
                    poster={project.poster ? assetPath(project.poster) : undefined}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload={shouldPrimeVideo ? 'auto' : 'metadata'}
                    aria-label={project.name}
                    onLoadedData={() => setVideoReady(true)}
                    onCanPlay={() => setVideoReady(true)}
                  />
                </>
              ) : (
                <img
                  src={assetPath(project.media)}
                  alt={project.name}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              ))}
            <span className="project-card__pill">{t.viewProject}</span>
          </div>
        </div>
      </button>
      <div className="project-card__meta">
        <span className="project-card__name">{project.name}</span>
        <span className="project-card__category">— {project.category[lang]}</span>
      </div>
    </div>
  );
}
