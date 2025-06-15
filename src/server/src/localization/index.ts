import type { Context } from 'hono';
import langs from './langs.json';
import { getCookie, setCookie } from 'hono/cookie';
import { localizationLogger } from './logger';

type LangsObject = typeof langs;
export type Lang = keyof LangsObject;
type MessagesObject = LangsObject[Lang];
export type Message = keyof MessagesObject;

// Check if all languages have the same message keys
const allLangs = Object.keys(langs).filter((lang) => lang !== 'en');
const enMessages = new Set(Object.keys(langs.en));
for (const lang of allLangs) {
  const messages = new Set(Object.keys(langs[lang]));
  if (
    messages.size !== enMessages.size ||
    ![...messages].every((x) => enMessages.has(x))
  ) {
    localizationLogger.error(
      `Language '${lang}' has different message keys than 'en', keys: ${[
        ...enMessages.difference(messages),
      ].join(', ')}`
    );
    process.exit(1);
  }
}

export const isMessage = (message: unknown): message is Message => {
  return typeof message === 'string' && Object.keys(langs.en).includes(message);
};

export const getMessage = (lang: Lang, message: Message) => {
  return langs[lang][message];
};

export const isLang = (lang: string): lang is Lang => {
  return Object.keys(langs).includes(lang);
};

export const getUserMessage = (c: Context, message: Message) => {
  const lang = getCookie(c, 'lang');
  if (!lang || !isLang(lang)) {
    setCookie(c, 'lang', 'it');
    return getMessage('it', message);
  }
  return getMessage(lang, message);
};
