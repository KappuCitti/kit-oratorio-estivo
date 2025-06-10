import type { Context } from 'hono';
import langs from './langs.json';
import { getCookie, setCookie } from 'hono/cookie';

type LangsObject = typeof langs;
export type Lang = keyof LangsObject;
type MessagesObject = LangsObject[Lang];
export type Message = keyof MessagesObject;

export const isMessage = (message: unknown): message is Message => {
  return typeof message === 'string' && Object.keys(langs.en).includes(message);
};

export const getMessage = (lang: Lang, message: Message) => {
  if (!isMessage(message)) {
    return 'MESSAGE NOT IMPLEMENTED';
  }
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
