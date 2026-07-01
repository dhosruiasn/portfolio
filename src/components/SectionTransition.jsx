import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransition({ number, title, subtitle, variant = 'scale' }) {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !innerRef.current || !headingRef.current) return undefined;
    const ctx = gsap.context(() => {
      if (variant === 'scale') {
        gsap.fromTo(
          innerRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      } else {
        // Studio Namma：往下滑時，字以底部為支點「打開並往上拉高」（scaleY 隨捲動單向增長）
        gsap.fromTo(
          headingRef.current,
          { scaleY: 1 },
          {
            scaleY: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [variant]);

  return (
    <section
      className={`section section--brown section-transition section-transition--${variant}`}
      ref={sectionRef}
    >
      <div className="section-transition__inner" ref={innerRef}>
        <span className="section-transition__number">{number}</span>
        <h2 className="section-transition__title" ref={headingRef}>
          {title}
        </h2>
        <p className="section-transition__subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
