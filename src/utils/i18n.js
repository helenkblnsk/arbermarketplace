import { NativeModules, Platform } from 'react-native';
import gettext from 'gettext.js';

export const deviceLanguage = Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale
  : NativeModules.I18nManager.localeIdentifier.split('-')[0];

const langs = ['ar', 'ru', 'en', 'fr'];
let jsonData;

if (langs.includes(deviceLanguage)) {
  switch (deviceLanguage) {
    case 'ru':
      jsonData = require('../config/locales/ru.json');
      break;
    case 'ar':
      jsonData = require('../config/locales/ar.json');
      break;
    case 'fr':
      jsonData = require('../config/locales/fr.json');
      break;
    default:
      jsonData = require('../config/locales/en.json');
  }

  gettext.setLocale(deviceLanguage);
  gettext.loadJSON(jsonData);
}

export default gettext;
