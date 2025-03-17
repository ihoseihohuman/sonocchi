import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '@/locales/en/translation.json';
import jaTranslation from '@/locales/ja/translation.json';

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: enTranslation,
            },
            ja: {
                translation: jaTranslation,
            },
        },
        lng: 'ja', // default language
        fallbackLng: 'en', // fallback language
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
