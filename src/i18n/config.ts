/**
 * @fileoverview i18next configuration for multilingual support.
 * Initializes react-i18next with browser language detection
 * and lazy-loaded locale JSON files.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import pt from './locales/pt.json';

/**
 * Initialize i18next with all supported locales and browser detection.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      ar: { translation: ar },
      hi: { translation: hi },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
