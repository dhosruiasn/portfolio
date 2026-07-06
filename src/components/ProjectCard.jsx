import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/ProjectCard.css';

export default function ProjectCard({ project, onOpen, onPrepareOpen, isOpening = false }) {
  const { lang, t } = useLanguage();
  const isVideo = project.mediaType === 'video';
  const videoRef = useRef(null);
  const isInViewRef = useRef(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // 進入視窗才播放、離開暫停；poster 先顯示，避免手機一進頁就抓多支影片。
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const play = () => {
      if (isInViewRef.current && document.visibilityState === 'visible') v.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          if (v.currentSrc) v.load();
          play();
        } else {
          v.pause();
        }
      },
      { rootMargin: '120px 0px', threshold: 0.05 }
    );
    io.observe(v);
    v.addEventListener('loadeddata', play);
    v.addEventListener('canplay', play);
    document.addEventListener('visibilitychange', play);
    return () => {
      io.disconnect();
      v.removeEventListener('loadeddata', play);
      v.removeEventListener('canplay', play);
      document.removeEventListener('visibilitychange', play);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoadVideo) return;
    v.load();
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
                    preload="metadata"
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
