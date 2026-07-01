import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetPath } from '../utils/assetPath.js';
import '../styles/components/About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useLanguage();
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return undefined;
    const capabilities = cardRef.current.querySelectorAll('.about__capability');
    const tween = gsap.from(cardRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
      },
    });
    const capTween = capabilities.length
      ? gsap.from(capabilities, {
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 70%',
          },
        })
      : null;
    return () => {
      tween.revert();
      capTween?.revert();
    };
  }, []);

  return (
    <section className="section section--light about" id="about">
      <div className="container about__inner">
        <div className="about__info" ref={cardRef}>
          <p className="about__bio">{t.about.bio}</p>

          <div className="about__divider" />
          <h4 className="about__heading">{t.about.experienceTitle}</h4>
          <p className="about__company">{t.about.experienceCompany}</p>
          <p className="about__time">{t.about.experienceTime}</p>
          <p className="about__tags">{t.about.experienceTags}</p>

          <div className="about__divider" />
          <h4 className="about__heading">{t.about.capabilitiesTitle}</h4>
          <ul className="about__capabilities">
            {t.about.capabilities.map((cap, i) => (
              <li key={cap} className="about__capability">
                <span className="about__capability-number">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {cap}
              </li>
            ))}
          </ul>

          <div className="about__divider" />
          <h4 className="about__heading">{t.about.toolsTitle}</h4>
          <p className="about__tools">{t.about.tools}</p>

          <a className="about__download" href={assetPath('/cv.pdf')} download>
            {t.about.download}
          </a>

          <p className="about__fullname">{t.about.fullName}</p>
        </div>
        <div className="about__illustration">
          <img src={assetPath('/images/about/bg.jpg')} alt="About illustration" />
        </div>
      </div>
    </section>
  );
}
