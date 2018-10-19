// @flow

type ProcessHtmlResultScriptItem = {
	bRunFirst: boolean,
	isInternal: boolean,
	JS: string
};

type ProcessHtmlResult = {
	HTML: string,
	SCRIPT: Array<ProcessHtmlResultScriptItem>,
	STYLE: Array<string>
};

declare module 'BX' {
	declare export function message(mess: string | {[name: string]: string}): ?string | boolean;
	declare export function namespace(namespace: string): Function | {[key: any]: any};
	declare export function getClass(name: string): ?Function;
	declare export function addClass(element: Element, className: string): void;
	declare export function removeClass(element: Element, className: string): void;
	declare export function hasClass(element: Element, className: string): boolean;
	declare export function debug(...args: any): void;
	declare export function bind(target: Element, event: string, handler: Function): void;
	declare export function unbind(target: Element, event: string, handler: Function): void;
	declare export function proxy(target: Element, event: string, handler: Function): void;
	declare export function addCustomEvent(target: Element, event: string, handler: Function): void;
	declare export function onCustomEvent(target: Element, event: string, handler: Function): void;
	declare export function removeCustomEvent(target: Element, event: string, handler: Function): void;
	declare export function debounce(callback: Function, time: Number, context?: any): Function;
	declare export function throttle(callback: Function, time: Number, context?: any): Function;
	declare export function processHTML(data: string, runFirst?: boolean): ProcessHtmlResult;
	declare export function load(items: Array<string>, callback: Function, document: any): void;
	declare export function getCookie(name: string): any;
	declare export function setCookie(name: string, value: string, options: any): any;
	declare export function create(tag: string, options: any): HTMLElement | HTMLIFrameElement;
	declare export function evalGlobal(code: string): void;
	declare export function remove(element: HTMLElement): void;
	declare export class util {
		static htmlspecialchars(html: string): string;
		static htmlspecialcharsback(html: string): string;
	}
	declare export class type {
		static isString(value: any): boolean;
		static isBoolean(value: any): boolean;
		static isNumber(value: any): boolean;
		static isFunction(value: any): boolean;
		static isArray(value: any): boolean;
		static isDate(value: any): boolean;
		static isPlainObject(value: any): boolean;
		static isDomNode(value: any): boolean;
	}
	declare export class ajax {
		static runAction(action: string, config: {[key: string]: any}): PromiseLike<any>;
	}
}
