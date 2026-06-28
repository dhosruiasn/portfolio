import { createContext, useContext, useMemo, useState } from 'react';
import { i18n } from '../i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const value = useMemo(
    () => ({
      lang,
      t: i18n[lang],
      toggleLang: () => setLang((l) => (l === 'zh' ? 'en' : 'zh')),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
