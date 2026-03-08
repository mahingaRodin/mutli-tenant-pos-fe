import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import rw from './locales/rw.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            rw: { translation: rw },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
        },
    });

i18n.on('languageChanged', (lng) => {
    const googleTranslateCombo = document.querySelector('.goog-te-combo');
    if (googleTranslateCombo) {
        googleTranslateCombo.value = lng;
        googleTranslateCombo.dispatchEvent(new Event('change'));
    }
});

export default i18n;
