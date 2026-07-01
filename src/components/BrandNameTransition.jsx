import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/BrandNameTransition.css';

gsap.registerPlugin(ScrollTrigger);

const BRAND_TEXT = 'DORIS KAO';
const DESKTOP_QUERY = '(min-width: 768px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function readBox(element) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    color: style.color,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    height: rect.height,
    left: rect.left,
    letterSpacing: style.letterSpacing,
    lineHeight: style.lineHeight,
    top: rect.top,
    width: rect.width,
  };
}

function placeProxy(proxy, box) {
  gsap.set(proxy, {
    autoAlpha: 1,
    color: box.color,
    fontFamily: box.fontFamily,
    fontSize: box.fontSize,
    fontWeight: box.fontWeight,
    height: box.height,
    left: box.left,
    letterSpacing: box.letterSpacing,
    lineHeight: box.lineHeight,
    top: box.top,
    width: box.width,
  });
}

function numericPx(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

export default function BrandNameTransition() {
  useEffect(() => {
    const navBrand = document.querySelector('.nav__brand');
    const resumeTitle = document.querySelector('.resume-wireframe__title');
    const resumeSection = document.querySelector('#resume-wireframe');
    if (!navBrand || !resumeTitle || !resumeSection) return undefined;

    const proxy = document.createElement('div');
    proxy.className = 'brand-name-transition';
    proxy.textContent = BRAND_TEXT;
    document.body.appendChild(proxy);

    let tween = null;
    let activeTarget = 'nav';
    const reduceMotion = window.matchMedia(REDUCED_QUERY);
    const desktop = window.matchMedia(DESKTOP_QUERY);

    const setNavState = () => {
      activeTarget = 'nav';
      gsap.set(proxy, { autoAlpha: 0 });
      gsap.set(navBrand, { autoAlpha: 1 });
      gsap.set(resumeTitle, { autoAlpha: 0 });
    };

    const setResumeState = () => {
      activeTarget = 'resume';
      gsap.set(proxy, { autoAlpha: 0 });
      gsap.set(navBrand, { autoAlpha: 0 });
      gsap.set(resumeTitle, { autoAlpha: 1 });
    };

    const fadeTo = (target) => {
      if (activeTarget === target && !tween?.isActive()) return;
      if (tween) tween.kill();
      activeTarget = target;
      gsap.set(proxy, { autoAlpha: 0 });
      const duration = reduceMotion.matches ? 0.06 : 0.075;
      const current = target === 'resume' ? navBrand : resumeTitle;
      const next = target === 'resume' ? resumeTitle : navBrand;
      tween = gsap
        .timeline({ defaults: { duration, ease: 'power1.out' } })
        .to(current, { autoAlpha: 0 })
        .to(next, { autoAlpha: 1 });
    };

    const moveTo = (target) => {
      if (activeTarget === target && !tween?.isActive()) return;
      if (!desktop.matches || reduceMotion.matches) {
        fadeTo(target);
        return;
      }

      if (tween) tween.kill();

      const source = target === 'resume' ? navBrand : resumeTitle;
      const destination = target === 'resume' ? resumeTitle : navBrand;
      const fromBox = proxy.style.visibility === 'visible' && gsap.getProperty(proxy, 'opacity') > 0
        ? readBox(proxy)
        : readBox(source);

      placeProxy(proxy, fromBox);
      gsap.set([navBrand, resumeTitle], { autoAlpha: 0 });

      activeTarget = target;
      const progress = { value: 0 };
      const startFontSize = numericPx(fromBox.fontSize);
      const startLineHeight = numericPx(fromBox.lineHeight) || fromBox.height;
      const colorTo = gsap.utils.interpolate(fromBox.color, readBox(destination).color);

      tween = gsap.to(progress, {
        value: 1,
        duration: 0.72,
        ease: 'power3.inOut',
        onUpdate: () => {
          const p = progress.value;
          const liveTo = readBox(destination);
          const endFontSize = numericPx(liveTo.fontSize);
          const endLineHeight = numericPx(liveTo.lineHeight) || liveTo.height;

          gsap.set(proxy, {
            color: colorTo(p),
            fontSize: `${gsap.utils.interpolate(startFontSize, endFontSize, p)}px`,
            height: gsap.utils.interpolate(fromBox.height, liveTo.height, p),
            left: gsap.utils.interpolate(fromBox.left, liveTo.left, p),
            lineHeight: `${gsap.utils.interpolate(startLineHeight, endLineHeight, p)}px`,
            top: gsap.utils.interpolate(fromBox.top, liveTo.top, p),
            width: gsap.utils.interpolate(fromBox.width, liveTo.width, p),
          });
        },
        onComplete: target === 'resume' ? setResumeState : setNavState,
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: resumeSection,
      start: 'top 58%',
      end: 'bottom top',
      onEnter: () => moveTo('resume'),
      onEnterBack: () => moveTo('resume'),
      onLeaveBack: () => moveTo('nav'),
      onRefresh: (self) => {
        if (tween?.isActive()) return;
        if (self.isActive || self.progress === 1) setResumeState();
        else setNavState();
      },
    });

    setNavState();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const handlePreferenceChange = () => {
      if (tween) tween.kill();
      if (activeTarget === 'resume') setResumeState();
      else setNavState();
    };

    reduceMotion.addEventListener('change', handlePreferenceChange);
    desktop.addEventListener('change', handlePreferenceChange);

    return () => {
      if (tween) tween.kill();
      trigger.kill();
      reduceMotion.removeEventListener('change', handlePreferenceChange);
      desktop.removeEventListener('change', handlePreferenceChange);
      proxy.remove();
      gsap.set([navBrand, resumeTitle], { clearProps: 'opacity,visibility' });
    };
  }, []);

  return null;
}
