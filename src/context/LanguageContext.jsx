import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { i18n } from '../i18n';

const LanguageContext = createContext(null);
const HTML_LANG = { zh: 'zh-Hant', en: 'en' };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const htmlLang = HTML_LANG[lang] || 'en';

  useEffect(() => {
    document.documentElement.lang = htmlLang;
  }, [htmlLang]);

  const value = useMemo(
    () => ({
      lang,
      htmlLang,
      t: i18n[lang],
      setLang,
      toggleLang: () => setLang((l) => (l === 'zh' ? 'en' : 'zh')),
    }),
    [htmlLang, lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
