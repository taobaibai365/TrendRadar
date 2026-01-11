'use strict';

var obsidian = require('obsidian');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// ========================================
// AI Services API
// ========================================
/**
 * 获取所有AI服务
 */
function getAIServices(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return [];
        const result = yield apiRequest(`${apiUrl}/api/ai-services`);
        return result !== null && result !== void 0 ? result : [];
    });
}
/**
 * 获取单个AI服务
 */
function getAIService(apiUrl, serviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return apiRequest(`${apiUrl}/api/ai-services/${serviceId}`);
    });
}
/**
 * 创建AI服务
 */
function createAIService(apiUrl, service) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return apiRequest(`${apiUrl}/api/ai-services`, 'POST', service);
    });
}
/**
 * 更新AI服务
 */
function updateAIService(apiUrl, serviceId, service) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return apiRequest(`${apiUrl}/api/ai-services/${serviceId}`, 'PUT', service);
    });
}
/**
 * 删除AI服务
 */
function deleteAIService(apiUrl, serviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/ai-services/${serviceId}`, 'DELETE');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 获取所有数据源分组
 */
function getSourceGroups(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return [];
        const result = yield apiRequest(`${apiUrl}/api/source-groups`);
        return (_a = result === null || result === void 0 ? void 0 : result.groups) !== null && _a !== void 0 ? _a : [];
    });
}
/**
 * 获取单个数据源分组
 */
function getSourceGroup(apiUrl, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return apiRequest(`${apiUrl}/api/source-groups/${groupId}`);
    });
}
/**
 * 创建数据源分组
 */
function createSourceGroup(apiUrl, group) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/source-groups`, 'POST', group);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 更新数据源分组
 */
function updateSourceGroup(apiUrl, groupId, group) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/source-groups/${groupId}`, 'PUT', group);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 删除数据源分组
 */
function deleteSourceGroup(apiUrl, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/source-groups/${groupId}`, 'DELETE');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
// --- Helper Functions ---
function apiRequest(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, method = 'GET', body) {
        try {
            const options = {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            if (body) {
                options.body = JSON.stringify(body);
            }
            const response = yield fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = yield response.json();
            return result;
        }
        catch (error) {
            console.error(`TrendRadar API Error (${method} ${url}):`, error);
            return null;
        }
    });
}
// ========================================
// Themes API
// ========================================
/**
 * 获取主题列表
 */
function getThemes(apiUrl, date, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl) {
            new obsidian.Notice('TrendRadar API URL is not configured.');
            return null;
        }
        const url = new URL(`${apiUrl}/api/themes`);
        if (date)
            url.searchParams.append('date', date);
        if (status)
            url.searchParams.append('status', status);
        return apiRequest(url.toString());
    });
}
/**
 * 获取主题详情
 */
function getThemeDetails(apiUrl, themeId, date) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl) {
            new obsidian.Notice('TrendRadar API URL is not configured.');
            return null;
        }
        const url = new URL(`${apiUrl}/api/themes/${themeId}`);
        if (date)
            url.searchParams.append('date', date);
        return apiRequest(url.toString());
    });
}
/**
 * 更新主题状态
 */
function updateThemeStatus(apiUrl, themeId, status, date) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const url = new URL(`${apiUrl}/api/themes/${themeId}/status`);
        if (date)
            url.searchParams.append('date', date);
        const result = yield apiRequest(url.toString(), 'PUT', { status });
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 删除主题
 */
function deleteTheme(apiUrl, themeId, date) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const url = new URL(`${apiUrl}/api/themes/${themeId}`);
        if (date)
            url.searchParams.append('date', date);
        const result = yield apiRequest(url.toString(), 'DELETE');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
// ========================================
// Sources API
// ========================================
/**
 * 获取所有数据源
 */
function getSources(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return [];
        const result = yield apiRequest(`${apiUrl}/api/sources`);
        return result !== null && result !== void 0 ? result : [];
    });
}
/**
 * 获取单个数据源
 */
function getSource(apiUrl, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return apiRequest(`${apiUrl}/api/sources/${sourceId}`);
    });
}
/**
 * 创建数据源
 */
function createSource(apiUrl, source) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/sources`, 'POST', source);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 更新数据源
 */
function updateSource(apiUrl, sourceId, source) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/sources/${sourceId}`, 'PUT', source);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 删除数据源
 */
function deleteSource(apiUrl, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/sources/${sourceId}`, 'DELETE');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 切换数据源启用状态
 */
function toggleSource(apiUrl, sourceId, enabled) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/sources/${sourceId}/toggle`, 'PUT', { enabled });
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
// ========================================
// Filter API
// ========================================
/**
 * 获取过滤器配置
 */
function getFilterConfig(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl) {
            return {
                keyword_blacklist: [],
                category_blacklist: [],
                source_blacklist: [],
                min_content_length: 100,
                min_importance: 0,
                enable_ai_prefilter: true
            };
        }
        const result = yield apiRequest(`${apiUrl}/api/filter`);
        return result !== null && result !== void 0 ? result : {
            keyword_blacklist: [],
            category_blacklist: [],
            source_blacklist: [],
            min_content_length: 100,
            min_importance: 0,
            enable_ai_prefilter: true
        };
    });
}
/**
 * 更新过滤器配置
 */
function updateFilterConfig(apiUrl, config) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/filter`, 'PUT', config);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 添加黑名单关键词
 */
function addFilterKeyword(apiUrl, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/filter/keywords`, 'POST', { keyword });
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 移除黑名单关键词
 */
function removeFilterKeyword(apiUrl, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/filter/keywords/${encodeURIComponent(keyword)}`, 'DELETE');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
// ========================================
// AI Config API
// ========================================
/**
 * 获取 AI 配置
 */
function getAIConfig(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl) {
            return {
                provider: 'openai',
                api_key: '',
                base_url: '',
                model_name: 'gpt-3.5-turbo',
                temperature: 0.7
            };
        }
        const result = yield apiRequest(`${apiUrl}/api/ai/config`);
        return result !== null && result !== void 0 ? result : {
            provider: 'openai',
            api_key: '',
            base_url: '',
            model_name: 'gpt-3.5-turbo',
            temperature: 0.7
        };
    });
}
/**
 * 更新 AI 配置
 */
function updateAIConfig(apiUrl, config) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/ai/config`, 'PUT', config);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 获取系统设置
 */
function getSettings(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return apiRequest(`${apiUrl}/api/settings`);
    });
}
/**
 * 更新系统设置
 */
function updateSettings(apiUrl, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/settings`, 'PUT', settings);
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 触发立即抓取任务
 */
function triggerFetch(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const result = yield apiRequest(`${apiUrl}/api/tasks/fetch`, 'POST');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}
/**
 * 获取抓取状态
 */
function getFetchStatus(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return yield apiRequest(`${apiUrl}/api/tasks/status`);
    });
}
/**
 * 获取错误统计摘要
 */
function getErrorSummary(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return null;
        return yield apiRequest(`${apiUrl}/api/errors/summary`);
    });
}
/**
 * 获取错误列表
 */
function getErrors(apiUrl_1) {
    return __awaiter(this, arguments, void 0, function* (apiUrl, unresolvedOnly = true, limit) {
        var _a;
        if (!apiUrl)
            return [];
        const url = new URL(`${apiUrl}/api/errors`);
        url.searchParams.append('unresolved_only', String(unresolvedOnly));
        if (limit)
            url.searchParams.append('limit', String(limit));
        return (_a = yield apiRequest(url.toString())) !== null && _a !== void 0 ? _a : [];
    });
}
/**
 * 标记错误已解决
 */
function resolveErrors(apiUrl, errorType, source) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!apiUrl)
            return false;
        const url = new URL(`${apiUrl}/api/errors/resolve`);
        if (errorType)
            url.searchParams.append('error_type', errorType);
        if (source)
            url.searchParams.append('source', source);
        const result = yield apiRequest(url.toString(), 'PUT');
        return (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : false;
    });
}

var api = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addFilterKeyword: addFilterKeyword,
    createAIService: createAIService,
    createSource: createSource,
    createSourceGroup: createSourceGroup,
    deleteAIService: deleteAIService,
    deleteSource: deleteSource,
    deleteSourceGroup: deleteSourceGroup,
    deleteTheme: deleteTheme,
    getAIConfig: getAIConfig,
    getAIService: getAIService,
    getAIServices: getAIServices,
    getErrorSummary: getErrorSummary,
    getErrors: getErrors,
    getFetchStatus: getFetchStatus,
    getFilterConfig: getFilterConfig,
    getSettings: getSettings,
    getSource: getSource,
    getSourceGroup: getSourceGroup,
    getSourceGroups: getSourceGroups,
    getSources: getSources,
    getThemeDetails: getThemeDetails,
    getThemes: getThemes,
    removeFilterKeyword: removeFilterKeyword,
    resolveErrors: resolveErrors,
    toggleSource: toggleSource,
    triggerFetch: triggerFetch,
    updateAIConfig: updateAIConfig,
    updateAIService: updateAIService,
    updateFilterConfig: updateFilterConfig,
    updateSettings: updateSettings,
    updateSource: updateSource,
    updateSourceGroup: updateSourceGroup,
    updateThemeStatus: updateThemeStatus
});

/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @returns {(event: any) => any} */
function stop_propagation(fn) {
	return function (event) {
		event.stopPropagation();
		// @ts-ignore
		return fn.call(this, event);
	};
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
}

/**
 * @returns {void} */
function select_option(select, value, mounting) {
	for (let i = 0; i < select.options.length; i += 1) {
		const option = select.options[i];
		if (option.__value === value) {
			option.selected = true;
			return;
		}
	}
	if (!mounting || value !== undefined) {
		select.selectedIndex = -1; // no option should be selected
	}
}

function select_value(select) {
	const selected_option = select.querySelector(':checked');
	return selected_option && selected_option.__value;
}

/**
 * @template T
 * @param {string} type
 * @param {T} [detail]
 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
 * @returns {CustomEvent<T>}
 */
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
	return new CustomEvent(type, { detail, bubbles, cancelable });
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
 *
 * Component events created with `createEventDispatcher` create a
 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
 * property and can contain any type of data.
 *
 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
 * ```ts
 * const dispatch = createEventDispatcher<{
 *  loaded: never; // does not take a detail argument
 *  change: string; // takes a detail argument of type string, which is required
 *  optional: number | null; // takes an optional detail argument of type number
 * }>();
 * ```
 *
 * https://svelte.dev/docs/svelte#createeventdispatcher
 * @template {Record<string, any>} [EventMap=any]
 * @returns {import('./public.js').EventDispatcher<EventMap>}
 */
function createEventDispatcher() {
	const component = get_current_component();
	return (type, detail, { cancelable = false } = {}) => {
		const callbacks = component.$$.callbacks[type];
		if (callbacks) {
			// TODO are there situations where events could be dispatched
			// in a server (non-DOM) environment?
			const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
			callbacks.slice().forEach((fn) => {
				fn.call(component, event);
			});
			return !event.defaultPrevented;
		}
		return true;
	};
}

// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
/**
 * @param component
 * @param event
 * @returns {void}
 */
function bubble(component, event) {
	const callbacks = component.$$.callbacks[event.type];
	if (callbacks) {
		// @ts-ignore
		callbacks.slice().forEach((fn) => fn.call(this, event));
	}
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

// keyed each functions:

/** @returns {void} */
function destroy_block(block, lookup) {
	block.d(1);
	lookup.delete(block.key);
}

/** @returns {any[]} */
function update_keyed_each(
	old_blocks,
	dirty,
	get_key,
	dynamic,
	ctx,
	list,
	lookup,
	node,
	destroy,
	create_each_block,
	next,
	get_context
) {
	let o = old_blocks.length;
	let n = list.length;
	let i = o;
	const old_indexes = {};
	while (i--) old_indexes[old_blocks[i].key] = i;
	const new_blocks = [];
	const new_lookup = new Map();
	const deltas = new Map();
	const updates = [];
	i = n;
	while (i--) {
		const child_ctx = get_context(ctx, list, i);
		const key = get_key(child_ctx);
		let block = lookup.get(key);
		if (!block) {
			block = create_each_block(key, child_ctx);
			block.c();
		} else {
			// defer updates until all the DOM shuffling is done
			updates.push(() => block.p(child_ctx, dirty));
		}
		new_lookup.set(key, (new_blocks[i] = block));
		if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
	}
	const will_move = new Set();
	const did_move = new Set();
	/** @returns {void} */
	function insert(block) {
		transition_in(block, 1);
		block.m(node, next);
		lookup.set(block.key, block);
		next = block.first;
		n--;
	}
	while (o && n) {
		const new_block = new_blocks[n - 1];
		const old_block = old_blocks[o - 1];
		const new_key = new_block.key;
		const old_key = old_block.key;
		if (new_block === old_block) {
			// do nothing
			next = new_block.first;
			o--;
			n--;
		} else if (!new_lookup.has(old_key)) {
			// remove old block
			destroy(old_block, lookup);
			o--;
		} else if (!lookup.has(new_key) || will_move.has(new_key)) {
			insert(new_block);
		} else if (did_move.has(old_key)) {
			o--;
		} else if (deltas.get(new_key) > deltas.get(old_key)) {
			did_move.add(new_key);
			insert(new_block);
		} else {
			will_move.add(old_key);
			o--;
		}
	}
	while (o--) {
		const old_block = old_blocks[o];
		if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
	}
	while (n) insert(new_blocks[n - 1]);
	run_all(updates);
	return new_blocks;
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

/* ThemeList.svelte generated by Svelte v4.2.20 */

function add_css$1(target) {
	append_styles(target, "svelte-1lcxgcb", ".trendradar-theme-list-container.svelte-1lcxgcb.svelte-1lcxgcb{padding:8px;height:100%;overflow-y:auto}.empty-state.svelte-1lcxgcb.svelte-1lcxgcb{text-align:center;margin-top:60px;color:var(--text-muted)}.empty-icon.svelte-1lcxgcb.svelte-1lcxgcb{font-size:32px;margin-bottom:10px}.tab-filter-bar.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px;margin-bottom:8px;background:var(--background-secondary);border-radius:8px;position:sticky;top:0;z-index:20}.tab-filter.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;gap:4px;flex:1}.tab-btn.svelte-1lcxgcb.svelte-1lcxgcb{padding:6px 12px;font-size:13px;font-weight:500;background:transparent;border:none;border-radius:6px;color:var(--text-muted);cursor:pointer;transition:all 0.15s ease}.tab-btn.svelte-1lcxgcb.svelte-1lcxgcb:hover{background:var(--background-modifier-hover);color:var(--text-normal)}.tab-btn.active.svelte-1lcxgcb.svelte-1lcxgcb{background:var(--interactive-accent);color:var(--text-on-accent);font-weight:600}.icon-btn.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;align-items:center;justify-content:center;padding:6px 8px;font-size:16px;background:transparent;border:none;border-radius:6px;cursor:pointer;transition:all 0.15s ease;min-width:32px}.icon-btn.svelte-1lcxgcb.svelte-1lcxgcb:hover{background:var(--background-modifier-hover)}.refresh-btn.svelte-1lcxgcb.svelte-1lcxgcb{color:var(--interactive-accent)}.error-badge.svelte-1lcxgcb.svelte-1lcxgcb{color:var(--color-orange);font-weight:600;font-size:14px;padding:6px 10px}.error-badge.svelte-1lcxgcb.svelte-1lcxgcb:hover{background:rgba(255, 165, 0, 0.1)}.batch-actions-bar.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;margin-bottom:8px;background:var(--background-modifier-form-field);border:2px solid var(--interactive-accent);border-radius:6px}.selected-count.svelte-1lcxgcb.svelte-1lcxgcb{font-size:13px;font-weight:600;color:var(--interactive-accent)}.batch-actions.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;gap:6px}.control-bar.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;align-items:center;gap:12px;padding:8px;margin-bottom:8px;background:var(--background-secondary);border-radius:8px;flex-wrap:wrap}.batch-actions-compact.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;align-items:center;gap:6px}.batch-actions-buttons.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;gap:2px}.batch-btn.compact.svelte-1lcxgcb.svelte-1lcxgcb{padding:4px 10px;font-size:13px;font-weight:500;background:transparent;border:none;border-radius:4px;color:var(--text-normal);cursor:pointer;transition:all 0.15s ease}.batch-btn.compact.svelte-1lcxgcb.svelte-1lcxgcb:disabled{opacity:0.4;cursor:not-allowed}.batch-btn.compact.svelte-1lcxgcb.svelte-1lcxgcb:hover:not(:disabled){background:var(--background-modifier-hover)}.sort-controls-compact.svelte-1lcxgcb.svelte-1lcxgcb{flex:0}.sort-select-compact.svelte-1lcxgcb.svelte-1lcxgcb{padding:4px 8px;font-size:13px;font-weight:500;background:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:6px;color:var(--text-normal);cursor:pointer;transition:all 0.15s ease}.select-all-compact.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--text-normal);cursor:pointer;user-select:none}.select-all-compact.svelte-1lcxgcb input[type=\"checkbox\"].svelte-1lcxgcb{width:16px;height:16px;cursor:pointer;accent-color:var(--interactive-accent)}.batch-btn.svelte-1lcxgcb.svelte-1lcxgcb{padding:6px 12px;font-size:13px;font-weight:600;background:var(--interactive-normal);border:1px solid var(--background-modifier-border);border-radius:4px;color:var(--text-normal);cursor:pointer;transition:all 0.2s}.batch-btn.svelte-1lcxgcb.svelte-1lcxgcb:disabled{opacity:0.5;cursor:not-allowed;transform:none !important}.batch-btn.svelte-1lcxgcb.svelte-1lcxgcb:hover:not(:disabled){background:var(--interactive-hover);transform:translateY(-1px)}.batch-btn.read.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--color-green)}.batch-btn.archive.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--color-orange)}.batch-btn.delete.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--color-red);background:var(--color-error);color:var(--text-on-accent)}.batch-btn.compact.svelte-1lcxgcb.svelte-1lcxgcb:hover:not(:disabled){background:var(--interactive-hover)}.batch-btn.compact.read.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--color-green)}.batch-btn.compact.archive.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--color-orange)}.batch-btn.compact.delete.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--color-red)}.sort-select-compact.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--interactive-accent)}.sort-select-compact.svelte-1lcxgcb.svelte-1lcxgcb:focus{outline:none;border-color:var(--interactive-accent);box-shadow:0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2)}.batch-group.svelte-1lcxgcb.svelte-1lcxgcb{margin-bottom:12px}.batch-group.archived-group.svelte-1lcxgcb.svelte-1lcxgcb{opacity:0.9;margin-top:20px;padding-top:12px;border-top:2px solid var(--background-modifier-border)}.batch-header.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;align-items:center;padding:6px 8px;font-size:13px;color:var(--text-normal);cursor:pointer;user-select:none;margin-bottom:6px;border-radius:4px;background:var(--background-modifier-form-field);font-weight:600}.batch-header.svelte-1lcxgcb.svelte-1lcxgcb:hover{background-color:var(--background-modifier-hover)}.batch-toggle.svelte-1lcxgcb.svelte-1lcxgcb{margin-right:6px;font-size:10px}.batch-label.svelte-1lcxgcb.svelte-1lcxgcb{font-weight:600;flex:1}.batch-count.svelte-1lcxgcb.svelte-1lcxgcb{background-color:var(--interactive-accent);color:var(--text-on-accent);padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}.theme-list.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;flex-direction:column;gap:8px}.theme-card.svelte-1lcxgcb.svelte-1lcxgcb{background-color:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:6px;padding:10px 10px 10px 36px;cursor:pointer;transition:all 0.15s ease;position:relative}.theme-card.svelte-1lcxgcb.svelte-1lcxgcb:hover{border-color:var(--interactive-accent);box-shadow:0 2px 8px rgba(0, 0, 0, 0.05)}.theme-card.read.svelte-1lcxgcb.svelte-1lcxgcb{opacity:0.6;background-color:var(--background-secondary)}.card-header.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}.title-row.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;align-items:baseline;gap:6px;flex:1;min-width:0}.new-dot.svelte-1lcxgcb.svelte-1lcxgcb{width:6px;height:6px;background-color:var(--color-red);border-radius:50%;flex-shrink:0;transform:translateY(-2px)}.duplicate-badge.svelte-1lcxgcb.svelte-1lcxgcb{font-size:12px;flex-shrink:0;margin-right:4px;opacity:0.8;filter:grayscale(0.3)}.duplicate-badge.svelte-1lcxgcb.svelte-1lcxgcb:hover{opacity:1;filter:grayscale(0)}.title.svelte-1lcxgcb.svelte-1lcxgcb{font-size:14px;font-weight:600;margin:0;line-height:1.3;color:var(--text-normal)}.importance-badge.svelte-1lcxgcb.svelte-1lcxgcb{font-size:10px;font-weight:bold;padding:1px 5px;border-radius:4px;margin-left:8px;flex-shrink:0;background-color:var(--background-modifier-border);color:var(--text-muted)}.importance-badge.high.svelte-1lcxgcb.svelte-1lcxgcb{color:var(--color-red);background-color:rgba(var(--color-red-rgb), 0.1)}.summary.svelte-1lcxgcb.svelte-1lcxgcb{font-size:12px;color:var(--text-muted);margin:0 0 8px 0;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.meta-row.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px}.keywords.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;gap:6px;overflow:hidden}.keyword.svelte-1lcxgcb.svelte-1lcxgcb{color:var(--interactive-accent)}.category-tag.svelte-1lcxgcb.svelte-1lcxgcb{background-color:var(--background-modifier-border);color:var(--text-muted);padding:1px 5px;border-radius:3px;white-space:nowrap}.card-footer.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px dashed var(--background-modifier-border)}.time.svelte-1lcxgcb.svelte-1lcxgcb{font-size:10px;color:var(--text-faint)}.card-actions.svelte-1lcxgcb.svelte-1lcxgcb{display:flex;gap:4px}.checkbox-wrapper.svelte-1lcxgcb.svelte-1lcxgcb{position:absolute;top:10px;left:10px;width:18px;height:18px;z-index:10;cursor:pointer}.checkbox-wrapper.svelte-1lcxgcb input[type=\"checkbox\"].svelte-1lcxgcb{width:16px;height:16px;cursor:pointer;accent-color:var(--interactive-accent)}.theme-card.selected.svelte-1lcxgcb.svelte-1lcxgcb{border-color:var(--interactive-accent) !important;background-color:var(--background-modifier-form-field) !important;box-shadow:0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2)}.theme-card.read.svelte-1lcxgcb.svelte-1lcxgcb{opacity:0.6;background-color:var(--background-secondary)}.action-btn.svelte-1lcxgcb.svelte-1lcxgcb{background:var(--background-secondary);border:1px solid var(--background-modifier-border);padding:3px 8px;font-size:12px;color:var(--text-normal);cursor:pointer;border-radius:4px;font-weight:500;transition:all 0.2s}.action-btn.svelte-1lcxgcb.svelte-1lcxgcb:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(0, 0, 0, 0.1)}.action-btn.read.svelte-1lcxgcb.svelte-1lcxgcb:hover{color:var(--color-green);border-color:var(--color-green);background-color:rgba(var(--color-green-rgb), 0.1)}.action-btn.archive.svelte-1lcxgcb.svelte-1lcxgcb:hover{color:var(--color-orange);border-color:var(--color-orange);background-color:rgba(var(--color-orange-rgb), 0.1)}.action-btn.unarchive.svelte-1lcxgcb.svelte-1lcxgcb:hover{color:var(--interactive-accent);border-color:var(--interactive-accent);background-color:rgba(var(--interactive-accent-rgb), 0.1)}.action-btn.delete.svelte-1lcxgcb.svelte-1lcxgcb:hover{color:var(--color-red);border-color:var(--color-red);background-color:rgba(var(--color-red-rgb), 0.15)}.action-btn.export.svelte-1lcxgcb.svelte-1lcxgcb:hover{color:var(--interactive-accent);border-color:var(--interactive-accent);background-color:rgba(var(--interactive-accent-rgb), 0.1)}");
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[43] = list[i];
	child_ctx[45] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[46] = list[i];
	return child_ctx;
}

function get_each_context_2$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[49] = list[i];
	return child_ctx;
}

// (213:2) {:else}
function create_else_block$1(ctx) {
	let div1;
	let button0;
	let t0;
	let button1;
	let t1;
	let div0;
	let button2;
	let t2;
	let button2_class_value;
	let t3;
	let button3;
	let t4;
	let button3_class_value;
	let t5;
	let button4;
	let t6;
	let button4_class_value;
	let t7;
	let button5;
	let t8;
	let button5_class_value;
	let t9;
	let div5;
	let t10;
	let div3;
	let div2;
	let button6;
	let t11;
	let button6_disabled_value;
	let t12;
	let button7;
	let t13;
	let button7_disabled_value;
	let t14;
	let button8;
	let t15;
	let button8_disabled_value;
	let t16;
	let div4;
	let select;
	let option0;
	let option1;
	let option2;
	let t20;
	let each_1_anchor;
	let mounted;
	let dispose;
	let if_block = /*filteredThemes*/ ctx[4].length > 0 && create_if_block_7$1(ctx);
	let each_value = ensure_array_like(/*batches*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			button0 = element("button");
			button0.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
			t0 = space();
			button1 = element("button");
			button1.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.16L12 17.58l8.47-4.29a2 2 0 0 0 1.71-3.16l-8.47-14.12a2 2 0 0 0-3.42 0z"></path></svg>`;
			t1 = space();
			div0 = element("div");
			button2 = element("button");
			t2 = text("待阅");
			t3 = space();
			button3 = element("button");
			t4 = text("已读");
			t5 = space();
			button4 = element("button");
			t6 = text("归档");
			t7 = space();
			button5 = element("button");
			t8 = text("All");
			t9 = space();
			div5 = element("div");
			if (if_block) if_block.c();
			t10 = space();
			div3 = element("div");
			div2 = element("div");
			button6 = element("button");
			t11 = text("已读");
			t12 = space();
			button7 = element("button");
			t13 = text("归档");
			t14 = space();
			button8 = element("button");
			t15 = text("删除");
			t16 = space();
			div4 = element("div");
			select = element("select");
			option0 = element("option");
			option0.textContent = "重要性";
			option1 = element("option");
			option1.textContent = "时间";
			option2 = element("option");
			option2.textContent = "影响力";
			t20 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
			attr(button0, "class", "icon-btn refresh-btn svelte-1lcxgcb");
			attr(button0, "title", "刷新");
			attr(button1, "class", "icon-btn error-badge svelte-1lcxgcb");
			attr(button1, "title", "查看错误");
			attr(button2, "class", button2_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'unread' ? 'active' : '') + " svelte-1lcxgcb");
			attr(button3, "class", button3_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'read' ? 'active' : '') + " svelte-1lcxgcb");
			attr(button4, "class", button4_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'archived' ? 'active' : '') + " svelte-1lcxgcb");
			attr(button5, "class", button5_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'all' ? 'active' : '') + " svelte-1lcxgcb");
			attr(div0, "class", "tab-filter svelte-1lcxgcb");
			attr(div1, "class", "tab-filter-bar svelte-1lcxgcb");
			attr(button6, "class", "batch-btn compact svelte-1lcxgcb");
			attr(button6, "title", "标记已读");
			button6.disabled = button6_disabled_value = /*selectedThemes*/ ctx[1].size === 0;
			attr(button7, "class", "batch-btn compact svelte-1lcxgcb");
			attr(button7, "title", "归档");
			button7.disabled = button7_disabled_value = /*selectedThemes*/ ctx[1].size === 0;
			attr(button8, "class", "batch-btn compact svelte-1lcxgcb");
			attr(button8, "title", "删除");
			button8.disabled = button8_disabled_value = /*selectedThemes*/ ctx[1].size === 0;
			attr(div2, "class", "batch-actions-buttons svelte-1lcxgcb");
			attr(div3, "class", "batch-actions-compact svelte-1lcxgcb");
			option0.__value = "importance";
			set_input_value(option0, option0.__value);
			option1.__value = "time";
			set_input_value(option1, option1.__value);
			option2.__value = "impact";
			set_input_value(option2, option2.__value);
			attr(select, "class", "sort-select-compact svelte-1lcxgcb");
			if (/*sortBy*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[33].call(select));
			attr(div4, "class", "sort-controls-compact svelte-1lcxgcb");
			attr(div5, "class", "control-bar svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, button0);
			append(div1, t0);
			append(div1, button1);
			append(div1, t1);
			append(div1, div0);
			append(div0, button2);
			append(button2, t2);
			append(div0, t3);
			append(div0, button3);
			append(button3, t4);
			append(div0, t5);
			append(div0, button4);
			append(button4, t6);
			append(div0, t7);
			append(div0, button5);
			append(button5, t8);
			insert(target, t9, anchor);
			insert(target, div5, anchor);
			if (if_block) if_block.m(div5, null);
			append(div5, t10);
			append(div5, div3);
			append(div3, div2);
			append(div2, button6);
			append(button6, t11);
			append(div2, t12);
			append(div2, button7);
			append(button7, t13);
			append(div2, t14);
			append(div2, button8);
			append(button8, t15);
			append(div5, t16);
			append(div5, div4);
			append(div4, select);
			append(select, option0);
			append(select, option1);
			append(select, option2);
			select_option(select, /*sortBy*/ ctx[2], true);
			insert(target, t20, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*handleRefresh*/ ctx[20]),
					listen(button1, "click", /*showErrorLog*/ ctx[21]),
					listen(button2, "click", /*click_handler_1*/ ctx[29]),
					listen(button3, "click", /*click_handler_2*/ ctx[30]),
					listen(button4, "click", /*click_handler_3*/ ctx[31]),
					listen(button5, "click", /*click_handler_4*/ ctx[32]),
					listen(button6, "click", /*batchMarkRead*/ ctx[11]),
					listen(button7, "click", /*batchArchive*/ ctx[12]),
					listen(button8, "click", /*batchDelete*/ ctx[13]),
					listen(select, "change", /*select_change_handler*/ ctx[33]),
					listen(select, "change", /*change_handler*/ ctx[28])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*filterTab*/ 1 && button2_class_value !== (button2_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'unread' ? 'active' : '') + " svelte-1lcxgcb")) {
				attr(button2, "class", button2_class_value);
			}

			if (dirty[0] & /*filterTab*/ 1 && button3_class_value !== (button3_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'read' ? 'active' : '') + " svelte-1lcxgcb")) {
				attr(button3, "class", button3_class_value);
			}

			if (dirty[0] & /*filterTab*/ 1 && button4_class_value !== (button4_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'archived' ? 'active' : '') + " svelte-1lcxgcb")) {
				attr(button4, "class", button4_class_value);
			}

			if (dirty[0] & /*filterTab*/ 1 && button5_class_value !== (button5_class_value = "tab-btn " + (/*filterTab*/ ctx[0] === 'all' ? 'active' : '') + " svelte-1lcxgcb")) {
				attr(button5, "class", button5_class_value);
			}

			if (/*filteredThemes*/ ctx[4].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_7$1(ctx);
					if_block.c();
					if_block.m(div5, t10);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*selectedThemes*/ 2 && button6_disabled_value !== (button6_disabled_value = /*selectedThemes*/ ctx[1].size === 0)) {
				button6.disabled = button6_disabled_value;
			}

			if (dirty[0] & /*selectedThemes*/ 2 && button7_disabled_value !== (button7_disabled_value = /*selectedThemes*/ ctx[1].size === 0)) {
				button7.disabled = button7_disabled_value;
			}

			if (dirty[0] & /*selectedThemes*/ 2 && button8_disabled_value !== (button8_disabled_value = /*selectedThemes*/ ctx[1].size === 0)) {
				button8.disabled = button8_disabled_value;
			}

			if (dirty[0] & /*sortBy*/ 4) {
				select_option(select, /*sortBy*/ ctx[2]);
			}

			if (dirty[0] & /*batches, selectedThemes, handleThemeClick, handleDelete, handleExport, handleUnarchive, handleArchive, handleMarkRead, isNew, toggleThemeSelection, toggleBatch*/ 5227394) {
				each_value = ensure_array_like(/*batches*/ ctx[7]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
				detach(t9);
				detach(div5);
				detach(t20);
				detach(each_1_anchor);
			}

			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (207:2) {#if themes.length === 0}
function create_if_block$1(ctx) {
	let div1;

	return {
		c() {
			div1 = element("div");
			div1.innerHTML = `<div class="empty-icon svelte-1lcxgcb">📭</div> <p>暂无主题数据</p> <p class="hint">点击刷新按钮获取最新信息</p>`;
			attr(div1, "class", "empty-state svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div1);
			}
		}
	};
}

// (262:6) {#if filteredThemes.length > 0}
function create_if_block_7$1(ctx) {
	let label;
	let input;
	let t0;
	let span;
	let mounted;
	let dispose;

	return {
		c() {
			label = element("label");
			input = element("input");
			t0 = space();
			span = element("span");
			span.textContent = "全选";
			attr(input, "type", "checkbox");
			input.checked = /*allSelected*/ ctx[6];
			input.indeterminate = /*someSelected*/ ctx[5];
			attr(input, "class", "svelte-1lcxgcb");
			attr(label, "class", "select-all-compact svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			append(label, t0);
			append(label, span);

			if (!mounted) {
				dispose = listen(input, "change", /*toggleSelectAll*/ ctx[10]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*allSelected*/ 64) {
				input.checked = /*allSelected*/ ctx[6];
			}

			if (dirty[0] & /*someSelected*/ 32) {
				input.indeterminate = /*someSelected*/ ctx[5];
			}
		},
		d(detaching) {
			if (detaching) {
				detach(label);
			}

			mounted = false;
			dispose();
		}
	};
}

// (322:8) {#if !batch.collapsed}
function create_if_block_1$1(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value_1 = ensure_array_like(/*batch*/ ctx[43].themes);
	const get_key = ctx => /*theme*/ ctx[46].id;

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "theme-list svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*batches, selectedThemes, handleThemeClick, handleDelete, handleExport, handleUnarchive, handleArchive, handleMarkRead, isNew, toggleThemeSelection*/ 5227138) {
				each_value_1 = ensure_array_like(/*batch*/ ctx[43].themes);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, destroy_block, create_each_block_1$1, null, get_each_context_1$1);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (343:20) {#if isNew(theme) && theme.status !== 'read'}
function create_if_block_6$1(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			attr(span, "class", "new-dot svelte-1lcxgcb");
			attr(span, "title", "新内容");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (346:20) {#if theme.is_duplicate && theme.is_duplicate === 1}
function create_if_block_5$1(ctx) {
	let span;
	let t;
	let span_title_value;

	return {
		c() {
			span = element("span");
			t = text("🔄");
			attr(span, "class", "duplicate-badge svelte-1lcxgcb");
			attr(span, "title", span_title_value = "重复内容 (相似度: " + (/*theme*/ ctx[46].duplicate_similarity || 0) * 100 + "%})");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*batches*/ 128 && span_title_value !== (span_title_value = "重复内容 (相似度: " + (/*theme*/ ctx[46].duplicate_similarity || 0) * 100 + "%})")) {
				attr(span, "title", span_title_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (361:18) {#if theme.keywords}
function create_if_block_4$1(ctx) {
	let div;
	let each_value_2 = ensure_array_like(parseKeywords(/*theme*/ ctx[46].keywords).slice(0, 3));
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "keywords svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*batches*/ 128) {
				each_value_2 = ensure_array_like(parseKeywords(/*theme*/ ctx[46].keywords).slice(0, 3));
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (363:22) {#each parseKeywords(theme.keywords).slice(0, 3) as kw}
function create_each_block_2$1(ctx) {
	let span;
	let t0;
	let t1_value = /*kw*/ ctx[49] + "";
	let t1;

	return {
		c() {
			span = element("span");
			t0 = text("#");
			t1 = text(t1_value);
			attr(span, "class", "keyword svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t0);
			append(span, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*batches*/ 128 && t1_value !== (t1_value = /*kw*/ ctx[49] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (378:20) {:else}
function create_else_block_1$1(ctx) {
	let t0;
	let button;
	let mounted;
	let dispose;
	let if_block = /*theme*/ ctx[46].status !== 'read' && create_if_block_3$1(ctx);

	function click_handler_8(...args) {
		return /*click_handler_8*/ ctx[38](/*theme*/ ctx[46], ...args);
	}

	return {
		c() {
			if (if_block) if_block.c();
			t0 = space();
			button = element("button");
			button.textContent = "📦";
			attr(button, "class", "action-btn archive svelte-1lcxgcb");
			attr(button, "title", "归档");
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, t0, anchor);
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_8);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*theme*/ ctx[46].status !== 'read') {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_3$1(ctx);
					if_block.c();
					if_block.m(t0.parentNode, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(button);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

// (376:20) {#if theme.status === 'archived'}
function create_if_block_2$1(ctx) {
	let button;
	let mounted;
	let dispose;

	function click_handler_6(...args) {
		return /*click_handler_6*/ ctx[36](/*theme*/ ctx[46], ...args);
	}

	return {
		c() {
			button = element("button");
			button.textContent = "↑";
			attr(button, "class", "action-btn unarchive svelte-1lcxgcb");
			attr(button, "title", "取消归档");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_6);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (379:22) {#if theme.status !== 'read'}
function create_if_block_3$1(ctx) {
	let button;
	let mounted;
	let dispose;

	function click_handler_7(...args) {
		return /*click_handler_7*/ ctx[37](/*theme*/ ctx[46], ...args);
	}

	return {
		c() {
			button = element("button");
			button.textContent = "✓";
			attr(button, "class", "action-btn read svelte-1lcxgcb");
			attr(button, "title", "标记已读");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_7);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (324:12) {#each batch.themes as theme (theme.id)}
function create_each_block_1$1(key_1, ctx) {
	let div7;
	let div0;
	let input;
	let input_checked_value;
	let t0;
	let div3;
	let div1;
	let show_if = /*isNew*/ ctx[22](/*theme*/ ctx[46]) && /*theme*/ ctx[46].status !== 'read';
	let t1;
	let t2;
	let h2;
	let t3_value = /*theme*/ ctx[46].title + "";
	let t3;
	let t4;
	let div2;
	let t5_value = /*theme*/ ctx[46].importance + "";
	let t5;
	let div2_class_value;
	let t6;
	let p;
	let t7_value = /*theme*/ ctx[46].summary + "";
	let t7;
	let t8;
	let div4;
	let t9;
	let span0;
	let t10_value = /*theme*/ ctx[46].category + "";
	let t10;
	let t11;
	let div6;
	let span1;
	let t12_value = new Date(/*theme*/ ctx[46].created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) + "";
	let t12;
	let t13;
	let div5;
	let t14;
	let button0;
	let t16;
	let button1;
	let t18;
	let div7_class_value;
	let mounted;
	let dispose;

	function change_handler_1() {
		return /*change_handler_1*/ ctx[35](/*theme*/ ctx[46]);
	}

	let if_block0 = show_if && create_if_block_6$1();
	let if_block1 = /*theme*/ ctx[46].is_duplicate && /*theme*/ ctx[46].is_duplicate === 1 && create_if_block_5$1(ctx);
	let if_block2 = /*theme*/ ctx[46].keywords && create_if_block_4$1(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*theme*/ ctx[46].status === 'archived') return create_if_block_2$1;
		return create_else_block_1$1;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block3 = current_block_type(ctx);

	function click_handler_9(...args) {
		return /*click_handler_9*/ ctx[39](/*theme*/ ctx[46], ...args);
	}

	function click_handler_10(...args) {
		return /*click_handler_10*/ ctx[40](/*theme*/ ctx[46], ...args);
	}

	function click_handler_11() {
		return /*click_handler_11*/ ctx[41](/*theme*/ ctx[46]);
	}

	return {
		key: key_1,
		first: null,
		c() {
			div7 = element("div");
			div0 = element("div");
			input = element("input");
			t0 = space();
			div3 = element("div");
			div1 = element("div");
			if (if_block0) if_block0.c();
			t1 = space();
			if (if_block1) if_block1.c();
			t2 = space();
			h2 = element("h2");
			t3 = text(t3_value);
			t4 = space();
			div2 = element("div");
			t5 = text(t5_value);
			t6 = space();
			p = element("p");
			t7 = text(t7_value);
			t8 = space();
			div4 = element("div");
			if (if_block2) if_block2.c();
			t9 = space();
			span0 = element("span");
			t10 = text(t10_value);
			t11 = space();
			div6 = element("div");
			span1 = element("span");
			t12 = text(t12_value);
			t13 = space();
			div5 = element("div");
			if_block3.c();
			t14 = space();
			button0 = element("button");
			button0.textContent = "📤";
			t16 = space();
			button1 = element("button");
			button1.textContent = "🗑️";
			t18 = space();
			attr(input, "type", "checkbox");
			input.checked = input_checked_value = /*selectedThemes*/ ctx[1].has(/*theme*/ ctx[46].id);
			attr(input, "class", "svelte-1lcxgcb");
			attr(div0, "class", "checkbox-wrapper svelte-1lcxgcb");
			attr(h2, "class", "title svelte-1lcxgcb");
			attr(div1, "class", "title-row svelte-1lcxgcb");
			attr(div2, "class", div2_class_value = "importance-badge " + getImportanceClass(/*theme*/ ctx[46].importance) + " svelte-1lcxgcb");
			attr(div3, "class", "card-header svelte-1lcxgcb");
			attr(p, "class", "summary svelte-1lcxgcb");
			attr(span0, "class", "category-tag svelte-1lcxgcb");
			attr(div4, "class", "meta-row svelte-1lcxgcb");
			attr(span1, "class", "time svelte-1lcxgcb");
			attr(button0, "class", "action-btn export svelte-1lcxgcb");
			attr(button0, "title", "导出并删除");
			attr(button1, "class", "action-btn delete svelte-1lcxgcb");
			attr(button1, "title", "删除");
			attr(div5, "class", "card-actions svelte-1lcxgcb");
			attr(div6, "class", "card-footer svelte-1lcxgcb");

			attr(div7, "class", div7_class_value = "theme-card " + (/*theme*/ ctx[46].status === 'read' ? 'read' : '') + " " + (/*theme*/ ctx[46].status === 'archived'
			? 'archived'
			: '') + " " + (/*selectedThemes*/ ctx[1].has(/*theme*/ ctx[46].id)
			? 'selected'
			: '') + " svelte-1lcxgcb");

			attr(div7, "role", "button");
			attr(div7, "tabindex", "0");
			this.first = div7;
		},
		m(target, anchor) {
			insert(target, div7, anchor);
			append(div7, div0);
			append(div0, input);
			append(div7, t0);
			append(div7, div3);
			append(div3, div1);
			if (if_block0) if_block0.m(div1, null);
			append(div1, t1);
			if (if_block1) if_block1.m(div1, null);
			append(div1, t2);
			append(div1, h2);
			append(h2, t3);
			append(div3, t4);
			append(div3, div2);
			append(div2, t5);
			append(div7, t6);
			append(div7, p);
			append(p, t7);
			append(div7, t8);
			append(div7, div4);
			if (if_block2) if_block2.m(div4, null);
			append(div4, t9);
			append(div4, span0);
			append(span0, t10);
			append(div7, t11);
			append(div7, div6);
			append(div6, span1);
			append(span1, t12);
			append(div6, t13);
			append(div6, div5);
			if_block3.m(div5, null);
			append(div5, t14);
			append(div5, button0);
			append(div5, t16);
			append(div5, button1);
			append(div7, t18);

			if (!mounted) {
				dispose = [
					listen(input, "change", stop_propagation(change_handler_1)),
					listen(div0, "click", stop_propagation(/*click_handler*/ ctx[27])),
					listen(button0, "click", click_handler_9),
					listen(button1, "click", click_handler_10),
					listen(div7, "click", click_handler_11)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*selectedThemes, batches*/ 130 && input_checked_value !== (input_checked_value = /*selectedThemes*/ ctx[1].has(/*theme*/ ctx[46].id))) {
				input.checked = input_checked_value;
			}

			if (dirty[0] & /*batches*/ 128) show_if = /*isNew*/ ctx[22](/*theme*/ ctx[46]) && /*theme*/ ctx[46].status !== 'read';

			if (show_if) {
				if (if_block0) ; else {
					if_block0 = create_if_block_6$1();
					if_block0.c();
					if_block0.m(div1, t1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*theme*/ ctx[46].is_duplicate && /*theme*/ ctx[46].is_duplicate === 1) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_5$1(ctx);
					if_block1.c();
					if_block1.m(div1, t2);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[0] & /*batches*/ 128 && t3_value !== (t3_value = /*theme*/ ctx[46].title + "")) set_data(t3, t3_value);
			if (dirty[0] & /*batches*/ 128 && t5_value !== (t5_value = /*theme*/ ctx[46].importance + "")) set_data(t5, t5_value);

			if (dirty[0] & /*batches*/ 128 && div2_class_value !== (div2_class_value = "importance-badge " + getImportanceClass(/*theme*/ ctx[46].importance) + " svelte-1lcxgcb")) {
				attr(div2, "class", div2_class_value);
			}

			if (dirty[0] & /*batches*/ 128 && t7_value !== (t7_value = /*theme*/ ctx[46].summary + "")) set_data(t7, t7_value);

			if (/*theme*/ ctx[46].keywords) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_4$1(ctx);
					if_block2.c();
					if_block2.m(div4, t9);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*batches*/ 128 && t10_value !== (t10_value = /*theme*/ ctx[46].category + "")) set_data(t10, t10_value);
			if (dirty[0] & /*batches*/ 128 && t12_value !== (t12_value = new Date(/*theme*/ ctx[46].created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) + "")) set_data(t12, t12_value);

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if_block3.d(1);
				if_block3 = current_block_type(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(div5, t14);
				}
			}

			if (dirty[0] & /*batches, selectedThemes*/ 130 && div7_class_value !== (div7_class_value = "theme-card " + (/*theme*/ ctx[46].status === 'read' ? 'read' : '') + " " + (/*theme*/ ctx[46].status === 'archived'
			? 'archived'
			: '') + " " + (/*selectedThemes*/ ctx[1].has(/*theme*/ ctx[46].id)
			? 'selected'
			: '') + " svelte-1lcxgcb")) {
				attr(div7, "class", div7_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div7);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if_block3.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (314:4) {#each batches as batch, batchIndex}
function create_each_block$1(ctx) {
	let div1;
	let div0;
	let span0;
	let t0_value = (/*batch*/ ctx[43].collapsed ? '▶' : '▼') + "";
	let t0;
	let t1;
	let span1;
	let t2_value = /*batch*/ ctx[43].label + "";
	let t2;
	let t3;
	let span2;
	let t4_value = /*batch*/ ctx[43].themes.length + "";
	let t4;
	let t5;
	let t6;
	let mounted;
	let dispose;

	function click_handler_5() {
		return /*click_handler_5*/ ctx[34](/*batchIndex*/ ctx[45]);
	}

	let if_block = !/*batch*/ ctx[43].collapsed && create_if_block_1$1(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			span2 = element("span");
			t4 = text(t4_value);
			t5 = space();
			if (if_block) if_block.c();
			t6 = space();
			attr(span0, "class", "batch-toggle svelte-1lcxgcb");
			attr(span1, "class", "batch-label svelte-1lcxgcb");
			attr(span2, "class", "batch-count svelte-1lcxgcb");
			attr(div0, "class", "batch-header svelte-1lcxgcb");
			attr(div0, "role", "button");
			attr(div0, "tabindex", "0");
			attr(div1, "class", "batch-group svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(div0, t3);
			append(div0, span2);
			append(span2, t4);
			append(div1, t5);
			if (if_block) if_block.m(div1, null);
			append(div1, t6);

			if (!mounted) {
				dispose = listen(div0, "click", click_handler_5);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*batches*/ 128 && t0_value !== (t0_value = (/*batch*/ ctx[43].collapsed ? '▶' : '▼') + "")) set_data(t0, t0_value);
			if (dirty[0] & /*batches*/ 128 && t2_value !== (t2_value = /*batch*/ ctx[43].label + "")) set_data(t2, t2_value);
			if (dirty[0] & /*batches*/ 128 && t4_value !== (t4_value = /*batch*/ ctx[43].themes.length + "")) set_data(t4, t4_value);

			if (!/*batch*/ ctx[43].collapsed) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					if_block.m(div1, t6);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$1(ctx) {
	let div;

	function select_block_type(ctx, dirty) {
		if (/*themes*/ ctx[3].length === 0) return create_if_block$1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			if_block.c();
			attr(div, "class", "trendradar-theme-list-container svelte-1lcxgcb");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if_block.m(div, null);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if_block.d();
		}
	};
}

function filterThemes(themes, tab) {
	switch (tab) {
		case 'unread':
			return themes.filter(t => t.status !== 'read' && t.status !== 'archived');
		case 'read':
			return themes.filter(t => t.status === 'read');
		case 'archived':
			return themes.filter(t => t.status === 'archived');
		default:
			return themes;
	}
}

function groupThemesByBatch(themes, sortBy) {
	if (!themes || themes.length === 0) return [];
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
	const groups = { '刚刚': [], '今天': [], '昨天': [], '更早': [] };

	for (const theme of themes) {
		const createdAt = new Date(theme.created_at);
		const themeDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
		const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

		if (hoursDiff < 1) {
			groups['刚刚'].push(theme);
		} else if (themeDate.getTime() >= today.getTime()) {
			groups['今天'].push(theme);
		} else if (themeDate.getTime() >= yesterday.getTime()) {
			groups['昨天'].push(theme);
		} else {
			groups['更早'].push(theme);
		}
	}

	// 排序
	const sortFn = getSortFn(sortBy);

	return Object.entries(groups).filter(([_, items]) => items.length > 0).map(([label, items]) => ({
		label,
		themes: items.sort(sortFn),
		collapsed: false
	}));
}

function getSortFn(sortBy) {
	switch (sortBy) {
		case 'time':
			return (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		case 'importance':
			return (a, b) => b.importance - a.importance;
		case 'impact':
			return (a, b) => (b.impact || 0) - (a.impact || 0);
		default:
			return (a, b) => b.importance - a.importance;
	}
}

function getImportanceClass(importance) {
	if (importance >= 8) return 'high';
	if (importance >= 5) return 'medium';
	return 'low';
}

function parseKeywords(keywordsStr) {
	if (!keywordsStr) return [];

	try {
		return JSON.parse(keywordsStr);
	} catch(_a) {
		return keywordsStr.split(',').map(t => t.trim()).filter(t => t);
	}
}

function instance$1($$self, $$props, $$invalidate) {
	let filteredThemes;
	let batchGroups;
	let batches;
	let allSelected;
	let someSelected;
	let { themes = [] } = $$props;
	let { newThemeAgeDays = 1 } = $$props;
	let { errorCount = 0 } = $$props;
	const dispatch = createEventDispatcher();
	let { filterTab = 'unread' } = $$props;
	let { selectedThemes = new Set() } = $$props;
	let { sortBy = 'time' } = $$props;

	// 独立存储折叠状态，避免每次重新创建时重置
	let batchCollapsedStates = {};

	function toggleBatch(index) {
		const label = batches[index].label;
		$$invalidate(25, batchCollapsedStates[label] = !batchCollapsedStates[label], batchCollapsedStates);
		$$invalidate(25, batchCollapsedStates = Object.assign({}, batchCollapsedStates)); // 触发更新
	}

	function toggleThemeSelection(themeId) {
		if (selectedThemes.has(themeId)) {
			selectedThemes.delete(themeId);
		} else {
			selectedThemes.add(themeId);
		}

		$$invalidate(1, selectedThemes = new Set(selectedThemes)); // 触发更新
	}

	function toggleSelectAll() {
		if (allSelected || someSelected) {
			selectedThemes.clear();
		} else {
			filteredThemes.forEach(t => selectedThemes.add(t.id));
		}

		$$invalidate(1, selectedThemes = new Set(selectedThemes));
	}

	function batchMarkRead() {
		return __awaiter(this, void 0, void 0, function* () {
			for (const themeId of selectedThemes) {
				dispatch('theme-mark-read', { themeId });
			}

			selectedThemes.clear();
			$$invalidate(1, selectedThemes = new Set());
		});
	}

	function batchArchive() {
		return __awaiter(this, void 0, void 0, function* () {
			for (const themeId of selectedThemes) {
				dispatch('theme-archive', { themeId });
			}

			selectedThemes.clear();
			$$invalidate(1, selectedThemes = new Set());
		});
	}

	function batchDelete() {
		return __awaiter(this, void 0, void 0, function* () {
			const count = selectedThemes.size;

			if (count > 1) {
				if (!confirm(`确定要删除选中的 ${count} 条信息吗？`)) {
					return;
				}
			}

			for (const themeId of selectedThemes) {
				dispatch('theme-delete', { themeId });
			}

			selectedThemes.clear();
			$$invalidate(1, selectedThemes = new Set());
		});
	}

	function handleThemeClick(themeId) {
		dispatch('theme-click', { themeId });
	}

	function handleMarkRead(e, themeId) {
		e.stopPropagation();
		dispatch('theme-mark-read', { themeId });
	}

	function handleArchive(e, themeId) {
		e.stopPropagation();
		dispatch('theme-archive', { themeId });
	}

	function handleUnarchive(e, themeId) {
		e.stopPropagation();
		dispatch('theme-unarchive', { themeId });
	}

	function handleDelete(e, themeId) {
		e.stopPropagation();

		// 单个删除直接执行，不提示
		dispatch('theme-delete', { themeId });
	}

	function handleExport(e, themeId) {
		return __awaiter(this, void 0, void 0, function* () {
			e.stopPropagation();
			dispatch('theme-export', { themeId });
		});
	}

	function handleRefresh() {
		return __awaiter(this, void 0, void 0, function* () {
			dispatch('refresh');
		});
	}

	function showErrorLog() {
		dispatch('show-errors');
	}

	function isNew(theme) {
		const createdAt = new Date(theme.created_at);
		const ageMs = Date.now() - createdAt.getTime();
		const ageDays = ageMs / (1000 * 60 * 60 * 24);
		return ageDays <= newThemeAgeDays;
	}

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	function change_handler(event) {
		bubble.call(this, $$self, event);
	}

	const click_handler_1 = () => $$invalidate(0, filterTab = 'unread');
	const click_handler_2 = () => $$invalidate(0, filterTab = 'read');
	const click_handler_3 = () => $$invalidate(0, filterTab = 'archived');
	const click_handler_4 = () => $$invalidate(0, filterTab = 'all');

	function select_change_handler() {
		sortBy = select_value(this);
		$$invalidate(2, sortBy);
	}

	const click_handler_5 = batchIndex => toggleBatch(batchIndex);
	const change_handler_1 = theme => toggleThemeSelection(theme.id);
	const click_handler_6 = (theme, e) => handleUnarchive(e, theme.id);
	const click_handler_7 = (theme, e) => handleMarkRead(e, theme.id);
	const click_handler_8 = (theme, e) => handleArchive(e, theme.id);
	const click_handler_9 = (theme, e) => handleExport(e, theme.id);
	const click_handler_10 = (theme, e) => handleDelete(e, theme.id);
	const click_handler_11 = theme => handleThemeClick(theme.id);

	$$self.$$set = $$props => {
		if ('themes' in $$props) $$invalidate(3, themes = $$props.themes);
		if ('newThemeAgeDays' in $$props) $$invalidate(23, newThemeAgeDays = $$props.newThemeAgeDays);
		if ('errorCount' in $$props) $$invalidate(24, errorCount = $$props.errorCount);
		if ('filterTab' in $$props) $$invalidate(0, filterTab = $$props.filterTab);
		if ('selectedThemes' in $$props) $$invalidate(1, selectedThemes = $$props.selectedThemes);
		if ('sortBy' in $$props) $$invalidate(2, sortBy = $$props.sortBy);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*themes, filterTab*/ 9) {
			$$invalidate(4, filteredThemes = filterThemes(themes, filterTab));
		}

		if ($$self.$$.dirty[0] & /*filteredThemes, sortBy*/ 20) {
			$$invalidate(26, batchGroups = groupThemesByBatch(filteredThemes, sortBy));
		}

		if ($$self.$$.dirty[0] & /*batchGroups, batchCollapsedStates*/ 100663296) {
			$$invalidate(7, batches = batchGroups.map(group => Object.assign(Object.assign({}, group), {
				collapsed: batchCollapsedStates[group.label] || false
			})));
		}

		if ($$self.$$.dirty[0] & /*filteredThemes, selectedThemes*/ 18) {
			$$invalidate(6, allSelected = filteredThemes.length > 0 && selectedThemes.size === filteredThemes.length);
		}

		if ($$self.$$.dirty[0] & /*selectedThemes, filteredThemes*/ 18) {
			$$invalidate(5, someSelected = selectedThemes.size > 0 && selectedThemes.size < filteredThemes.length);
		}
	};

	return [
		filterTab,
		selectedThemes,
		sortBy,
		themes,
		filteredThemes,
		someSelected,
		allSelected,
		batches,
		toggleBatch,
		toggleThemeSelection,
		toggleSelectAll,
		batchMarkRead,
		batchArchive,
		batchDelete,
		handleThemeClick,
		handleMarkRead,
		handleArchive,
		handleUnarchive,
		handleDelete,
		handleExport,
		handleRefresh,
		showErrorLog,
		isNew,
		newThemeAgeDays,
		errorCount,
		batchCollapsedStates,
		batchGroups,
		click_handler,
		change_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		select_change_handler,
		click_handler_5,
		change_handler_1,
		click_handler_6,
		click_handler_7,
		click_handler_8,
		click_handler_9,
		click_handler_10,
		click_handler_11
	];
}

class ThemeList extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				themes: 3,
				newThemeAgeDays: 23,
				errorCount: 24,
				filterTab: 0,
				selectedThemes: 1,
				sortBy: 2
			},
			add_css$1,
			[-1, -1]
		);
	}
}

/* ThemeDetail.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-33drfa", ".trendradar-theme-detail-container.svelte-33drfa.svelte-33drfa{padding:0 var(--size-4-2);max-height:70vh;overflow-y:auto}.header.svelte-33drfa.svelte-33drfa{margin-bottom:var(--size-4-4);padding-bottom:var(--size-4-4);border-bottom:2px solid var(--background-modifier-border)}.header-top.svelte-33drfa.svelte-33drfa{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--size-4-3);flex-wrap:wrap;gap:var(--size-4-2)}.meta-left.svelte-33drfa.svelte-33drfa{display:flex;align-items:center;gap:var(--size-4-2)}.category.svelte-33drfa.svelte-33drfa{background-color:var(--interactive-accent);color:var(--text-on-accent);padding:4px 12px;border-radius:var(--radius-m);font-weight:600;font-size:var(--font-ui-small)}.status-badge.svelte-33drfa.svelte-33drfa{padding:2px 8px;border-radius:var(--radius-s);font-size:var(--font-ui-smaller)}.status-badge.archived.svelte-33drfa.svelte-33drfa{background-color:var(--text-faint);color:var(--background-primary)}.status-badge.read.svelte-33drfa.svelte-33drfa{background-color:var(--background-modifier-border);color:var(--text-muted)}.action-buttons.svelte-33drfa.svelte-33drfa{display:flex;gap:var(--size-4-2)}.action-btn.svelte-33drfa.svelte-33drfa{padding:6px 12px;border-radius:var(--radius-s);border:1px solid var(--background-modifier-border);background-color:var(--background-secondary);cursor:pointer;font-size:var(--font-ui-small);transition:all 0.15s}.action-btn.svelte-33drfa.svelte-33drfa:hover{background-color:var(--background-secondary-alt)}.action-btn.export.svelte-33drfa.svelte-33drfa{border-color:var(--interactive-accent);color:var(--interactive-accent)}.action-btn.delete.svelte-33drfa.svelte-33drfa:hover{background-color:rgba(255, 100, 100, 0.2);border-color:var(--color-red)}.title.svelte-33drfa.svelte-33drfa{font-size:var(--font-ui-large);font-weight:700;margin:var(--size-4-2) 0;line-height:1.3}.metrics.svelte-33drfa.svelte-33drfa{display:flex;gap:var(--size-4-4);margin-bottom:var(--size-4-3);flex-wrap:wrap}.metric.svelte-33drfa.svelte-33drfa{display:flex;flex-direction:column;gap:2px}.metric-label.svelte-33drfa.svelte-33drfa{font-size:var(--font-ui-smaller);color:var(--text-faint)}.metric-value.svelte-33drfa.svelte-33drfa{font-weight:600;font-size:var(--font-ui-small)}.metric-value.importance.svelte-33drfa.svelte-33drfa{color:var(--color-red)}.metric-value.impact.svelte-33drfa.svelte-33drfa{color:var(--color-orange)}.tags.svelte-33drfa.svelte-33drfa{display:flex;flex-wrap:wrap;gap:var(--size-4-2)}.tag.svelte-33drfa.svelte-33drfa{background-color:var(--background-modifier-border);color:var(--text-muted);padding:3px 10px;border-radius:var(--radius-m);font-size:var(--font-ui-smaller)}.section.svelte-33drfa.svelte-33drfa{margin-bottom:var(--size-4-4)}.section.svelte-33drfa h2.svelte-33drfa{font-size:var(--font-ui-medium);font-weight:600;margin-bottom:var(--size-4-3);padding-bottom:var(--size-4-2);border-bottom:1px solid var(--background-modifier-border);color:var(--text-normal)}.summary-text.svelte-33drfa.svelte-33drfa{line-height:1.7;color:var(--text-normal);background-color:var(--background-secondary);padding:var(--size-4-3);border-radius:var(--radius-m);border-left:3px solid var(--interactive-accent)}.key-points.svelte-33drfa.svelte-33drfa{list-style:none;padding:0;margin:0}.key-points.svelte-33drfa li.svelte-33drfa{position:relative;padding-left:var(--size-4-4);margin-bottom:var(--size-4-2);line-height:1.6}.key-points.svelte-33drfa li.svelte-33drfa::before{content:\"•\";position:absolute;left:0;color:var(--interactive-accent);font-weight:bold}.articles-list.svelte-33drfa.svelte-33drfa{display:flex;flex-direction:column;gap:var(--size-4-3);max-height:300px;overflow-y:auto;padding-right:var(--size-4-2)}.article-item.svelte-33drfa.svelte-33drfa{padding:var(--size-4-3);border-radius:var(--radius-m);background-color:var(--background-secondary);border:1px solid var(--background-modifier-border);transition:all 0.15s}.article-item.svelte-33drfa.svelte-33drfa:hover{border-color:var(--background-modifier-border-hover);background-color:var(--background-secondary-alt)}.article-header.svelte-33drfa.svelte-33drfa{display:flex;align-items:flex-start;gap:var(--size-4-2)}.article-title.svelte-33drfa.svelte-33drfa{font-weight:500;text-decoration:none;color:var(--text-normal);flex:1;line-height:1.4}.article-title.svelte-33drfa.svelte-33drfa:hover{color:var(--interactive-accent);text-decoration:underline}.external-link.svelte-33drfa.svelte-33drfa{color:var(--text-faint);font-size:12px}.article-meta.svelte-33drfa.svelte-33drfa{font-size:var(--font-ui-smaller);color:var(--text-muted);margin-top:var(--size-4-2);display:flex;flex-wrap:wrap;gap:var(--size-4-3)}.article-summary.svelte-33drfa.svelte-33drfa{font-size:var(--font-ui-small);color:var(--text-muted);margin-top:var(--size-4-2);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	return child_ctx;
}

// (48:42) 
function create_if_block_9(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "已读";
			attr(span, "class", "status-badge read svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (46:8) {#if theme.status === 'archived'}
function create_if_block_8(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "已归档";
			attr(span, "class", "status-badge archived svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (56:8) {#if theme.status !== 'archived'}
function create_if_block_7(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "📥 归档";
			attr(button, "class", "action-btn archive svelte-33drfa");
			attr(button, "title", "归档");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*handleArchive*/ ctx[5]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (70:4) {#if !isLinkSummary}
function create_if_block_6(ctx) {
	let div3;
	let div0;
	let span0;
	let t1;
	let span1;
	let t2_value = /*theme*/ ctx[0].importance + "";
	let t2;
	let t3;
	let t4;
	let div1;
	let span2;
	let t6;
	let span3;
	let t7_value = /*theme*/ ctx[0].impact + "";
	let t7;
	let t8;
	let t9;
	let div2;
	let span4;
	let t11;
	let span5;
	let t12_value = new Date(/*theme*/ ctx[0].created_at).toLocaleString('zh-CN') + "";
	let t12;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			span0.textContent = "重要性";
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = text("/10");
			t4 = space();
			div1 = element("div");
			span2 = element("span");
			span2.textContent = "影响力";
			t6 = space();
			span3 = element("span");
			t7 = text(t7_value);
			t8 = text("/10");
			t9 = space();
			div2 = element("div");
			span4 = element("span");
			span4.textContent = "创建时间";
			t11 = space();
			span5 = element("span");
			t12 = text(t12_value);
			attr(span0, "class", "metric-label svelte-33drfa");
			attr(span1, "class", "metric-value importance svelte-33drfa");
			attr(div0, "class", "metric svelte-33drfa");
			attr(span2, "class", "metric-label svelte-33drfa");
			attr(span3, "class", "metric-value impact svelte-33drfa");
			attr(div1, "class", "metric svelte-33drfa");
			attr(span4, "class", "metric-label svelte-33drfa");
			attr(span5, "class", "metric-value svelte-33drfa");
			attr(div2, "class", "metric svelte-33drfa");
			attr(div3, "class", "metrics svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, span0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(span1, t3);
			append(div3, t4);
			append(div3, div1);
			append(div1, span2);
			append(div1, t6);
			append(div1, span3);
			append(span3, t7);
			append(span3, t8);
			append(div3, t9);
			append(div3, div2);
			append(div2, span4);
			append(div2, t11);
			append(div2, span5);
			append(span5, t12);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t2_value !== (t2_value = /*theme*/ ctx[0].importance + "")) set_data(t2, t2_value);
			if (dirty & /*theme*/ 1 && t7_value !== (t7_value = /*theme*/ ctx[0].impact + "")) set_data(t7, t7_value);
			if (dirty & /*theme*/ 1 && t12_value !== (t12_value = new Date(/*theme*/ ctx[0].created_at).toLocaleString('zh-CN') + "")) set_data(t12, t12_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (88:4) {#if tags.length > 0}
function create_if_block_5(ctx) {
	let div;
	let each_value_2 = ensure_array_like(/*tags*/ ctx[3]);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "tags svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty & /*tags*/ 8) {
				each_value_2 = ensure_array_like(/*tags*/ ctx[3]);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (90:8) {#each tags as tag}
function create_each_block_2(ctx) {
	let span;
	let t_value = /*tag*/ ctx[15] + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "tag svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty & /*tags*/ 8 && t_value !== (t_value = /*tag*/ ctx[15] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (104:2) {:else}
function create_else_block_1(ctx) {
	let div;
	let p;
	let t_value = /*theme*/ ctx[0].summary + "";
	let t;

	return {
		c() {
			div = element("div");
			p = element("p");
			t = text(t_value);
			attr(p, "class", "summary-text svelte-33drfa");
			attr(div, "class", "section summary-section svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, p);
			append(p, t);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t_value !== (t_value = /*theme*/ ctx[0].summary + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (98:2) {#if !isLinkSummary}
function create_if_block_4(ctx) {
	let div;
	let h2;
	let t1;
	let p;
	let t2_value = /*theme*/ ctx[0].summary + "";
	let t2;

	return {
		c() {
			div = element("div");
			h2 = element("h2");
			h2.textContent = "📊 AI 分析摘要";
			t1 = space();
			p = element("p");
			t2 = text(t2_value);
			attr(h2, "class", "svelte-33drfa");
			attr(p, "class", "summary-text svelte-33drfa");
			attr(div, "class", "section summary-section svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h2);
			append(div, t1);
			append(div, p);
			append(p, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t2_value !== (t2_value = /*theme*/ ctx[0].summary + "")) set_data(t2, t2_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (112:2) {#if !isLinkSummary && keyPoints.length > 0}
function create_if_block_3(ctx) {
	let div;
	let h2;
	let t1;
	let ul;
	let each_value_1 = ensure_array_like(/*keyPoints*/ ctx[2]);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div = element("div");
			h2 = element("h2");
			h2.textContent = "💡 核心要点";
			t1 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(h2, "class", "svelte-33drfa");
			attr(ul, "class", "key-points svelte-33drfa");
			attr(div, "class", "section svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h2);
			append(div, t1);
			append(div, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(ul, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty & /*keyPoints*/ 4) {
				each_value_1 = ensure_array_like(/*keyPoints*/ ctx[2]);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (116:8) {#each keyPoints as point}
function create_each_block_1(ctx) {
	let li;
	let t_value = /*point*/ ctx[12] + "";
	let t;

	return {
		c() {
			li = element("li");
			t = text(t_value);
			attr(li, "class", "svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);
		},
		p(ctx, dirty) {
			if (dirty & /*keyPoints*/ 4 && t_value !== (t_value = /*point*/ ctx[12] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(li);
			}
		}
	};
}

// (139:14) {:else}
function create_else_block(ctx) {
	let t0;
	let t1_value = (/*article*/ ctx[9].feed_id || '未知来源') + "";
	let t1;

	return {
		c() {
			t0 = text("📄 ");
			t1 = text(t1_value);
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t1_value !== (t1_value = (/*article*/ ctx[9].feed_id || '未知来源') + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
			}
		}
	};
}

// (137:14) {#if article.source_name}
function create_if_block_2(ctx) {
	let t0;
	let t1_value = /*article*/ ctx[9].source_name + "";
	let t1;

	return {
		c() {
			t0 = text("📡 ");
			t1 = text(t1_value);
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t1_value !== (t1_value = /*article*/ ctx[9].source_name + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
			}
		}
	};
}

// (144:14) {#if article.author}
function create_if_block_1(ctx) {
	let t0;
	let t1_value = /*article*/ ctx[9].author + "";
	let t1;

	return {
		c() {
			t0 = text("👤 ");
			t1 = text(t1_value);
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t1_value !== (t1_value = /*article*/ ctx[9].author + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
			}
		}
	};
}

// (158:10) {#if !isLinkSummary && article.summary}
function create_if_block(ctx) {
	let p;
	let t_value = /*article*/ ctx[9].summary + "";
	let t;

	return {
		c() {
			p = element("p");
			t = text(t_value);
			attr(p, "class", "article-summary svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, t);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t_value !== (t_value = /*article*/ ctx[9].summary + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(p);
			}
		}
	};
}

// (127:6) {#each theme.articles as article}
function create_each_block(ctx) {
	let div2;
	let div0;
	let a;
	let t0_value = /*article*/ ctx[9].title + "";
	let t0;
	let a_href_value;
	let t1;
	let span0;
	let t3;
	let div1;
	let span1;
	let t4;
	let span2;
	let t5;
	let span3;
	let t6;

	let t7_value = new Date(/*article*/ ctx[9].published_at).toLocaleString('zh-CN', {
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}) + "";

	let t7;
	let t8;
	let t9;

	function select_block_type_2(ctx, dirty) {
		if (/*article*/ ctx[9].source_name) return create_if_block_2;
		return create_else_block;
	}

	let current_block_type = select_block_type_2(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*article*/ ctx[9].author && create_if_block_1(ctx);
	let if_block2 = !/*isLinkSummary*/ ctx[1] && /*article*/ ctx[9].summary && create_if_block(ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			span0 = element("span");
			span0.textContent = "↗";
			t3 = space();
			div1 = element("div");
			span1 = element("span");
			if_block0.c();
			t4 = space();
			span2 = element("span");
			if (if_block1) if_block1.c();
			t5 = space();
			span3 = element("span");
			t6 = text("🕐 ");
			t7 = text(t7_value);
			t8 = space();
			if (if_block2) if_block2.c();
			t9 = space();
			attr(a, "href", a_href_value = /*article*/ ctx[9].url);
			attr(a, "target", "_blank");
			attr(a, "rel", "noopener noreferrer");
			attr(a, "class", "article-title svelte-33drfa");
			attr(span0, "class", "external-link svelte-33drfa");
			attr(div0, "class", "article-header svelte-33drfa");
			attr(span1, "class", "source");
			attr(span2, "class", "author");
			attr(span3, "class", "time");
			attr(div1, "class", "article-meta svelte-33drfa");
			attr(div2, "class", "article-item svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, a);
			append(a, t0);
			append(div0, t1);
			append(div0, span0);
			append(div2, t3);
			append(div2, div1);
			append(div1, span1);
			if_block0.m(span1, null);
			append(div1, t4);
			append(div1, span2);
			if (if_block1) if_block1.m(span2, null);
			append(div1, t5);
			append(div1, span3);
			append(span3, t6);
			append(span3, t7);
			append(div2, t8);
			if (if_block2) if_block2.m(div2, null);
			append(div2, t9);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t0_value !== (t0_value = /*article*/ ctx[9].title + "")) set_data(t0, t0_value);

			if (dirty & /*theme*/ 1 && a_href_value !== (a_href_value = /*article*/ ctx[9].url)) {
				attr(a, "href", a_href_value);
			}

			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(span1, null);
				}
			}

			if (/*article*/ ctx[9].author) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					if_block1.m(span2, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*theme*/ 1 && t7_value !== (t7_value = new Date(/*article*/ ctx[9].published_at).toLocaleString('zh-CN', {
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}) + "")) set_data(t7, t7_value);

			if (!/*isLinkSummary*/ ctx[1] && /*article*/ ctx[9].summary) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block(ctx);
					if_block2.c();
					if_block2.m(div2, t9);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
		}
	};
}

function create_fragment(ctx) {
	let div6;
	let div3;
	let div2;
	let div0;
	let span;
	let t0_value = /*theme*/ ctx[0].category + "";
	let t0;
	let t1;
	let t2;
	let div1;
	let button0;
	let t4;
	let t5;
	let button1;
	let t7;
	let h1;
	let t8_value = /*theme*/ ctx[0].title + "";
	let t8;
	let t9;
	let t10;
	let t11;
	let t12;
	let t13;
	let div5;
	let h2;
	let t14;
	let t15_value = /*theme*/ ctx[0].articles.length + "";
	let t15;
	let t16;
	let t17;
	let div4;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*theme*/ ctx[0].status === 'archived') return create_if_block_8;
		if (/*theme*/ ctx[0].status === 'read') return create_if_block_9;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type && current_block_type(ctx);
	let if_block1 = /*theme*/ ctx[0].status !== 'archived' && create_if_block_7(ctx);
	let if_block2 = !/*isLinkSummary*/ ctx[1] && create_if_block_6(ctx);
	let if_block3 = /*tags*/ ctx[3].length > 0 && create_if_block_5(ctx);

	function select_block_type_1(ctx, dirty) {
		if (!/*isLinkSummary*/ ctx[1]) return create_if_block_4;
		return create_else_block_1;
	}

	let current_block_type_1 = select_block_type_1(ctx);
	let if_block4 = current_block_type_1(ctx);
	let if_block5 = !/*isLinkSummary*/ ctx[1] && /*keyPoints*/ ctx[2].length > 0 && create_if_block_3(ctx);
	let each_value = ensure_array_like(/*theme*/ ctx[0].articles);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div6 = element("div");
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			div1 = element("div");
			button0 = element("button");
			button0.textContent = "📝 导出笔记";
			t4 = space();
			if (if_block1) if_block1.c();
			t5 = space();
			button1 = element("button");
			button1.textContent = "🗑 删除";
			t7 = space();
			h1 = element("h1");
			t8 = text(t8_value);
			t9 = space();
			if (if_block2) if_block2.c();
			t10 = space();
			if (if_block3) if_block3.c();
			t11 = space();
			if_block4.c();
			t12 = space();
			if (if_block5) if_block5.c();
			t13 = space();
			div5 = element("div");
			h2 = element("h2");
			t14 = text("📰 信息来源 (");
			t15 = text(t15_value);
			t16 = text(")");
			t17 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(span, "class", "category svelte-33drfa");
			attr(div0, "class", "meta-left svelte-33drfa");
			attr(button0, "class", "action-btn export svelte-33drfa");
			attr(button0, "title", "导出为笔记");
			attr(button1, "class", "action-btn delete svelte-33drfa");
			attr(button1, "title", "删除");
			attr(div1, "class", "action-buttons svelte-33drfa");
			attr(div2, "class", "header-top svelte-33drfa");
			attr(h1, "class", "title svelte-33drfa");
			attr(div3, "class", "header svelte-33drfa");
			attr(h2, "class", "svelte-33drfa");
			attr(div4, "class", "articles-list svelte-33drfa");
			attr(div5, "class", "section svelte-33drfa");
			attr(div6, "class", "trendradar-theme-detail-container svelte-33drfa");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div3);
			append(div3, div2);
			append(div2, div0);
			append(div0, span);
			append(span, t0);
			append(div0, t1);
			if (if_block0) if_block0.m(div0, null);
			append(div2, t2);
			append(div2, div1);
			append(div1, button0);
			append(div1, t4);
			if (if_block1) if_block1.m(div1, null);
			append(div1, t5);
			append(div1, button1);
			append(div3, t7);
			append(div3, h1);
			append(h1, t8);
			append(div3, t9);
			if (if_block2) if_block2.m(div3, null);
			append(div3, t10);
			if (if_block3) if_block3.m(div3, null);
			append(div6, t11);
			if_block4.m(div6, null);
			append(div6, t12);
			if (if_block5) if_block5.m(div6, null);
			append(div6, t13);
			append(div6, div5);
			append(div5, h2);
			append(h2, t14);
			append(h2, t15);
			append(h2, t16);
			append(div5, t17);
			append(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*handleExport*/ ctx[4]),
					listen(button1, "click", /*handleDelete*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*theme*/ 1 && t0_value !== (t0_value = /*theme*/ ctx[0].category + "")) set_data(t0, t0_value);

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if (if_block0) if_block0.d(1);
				if_block0 = current_block_type && current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div0, null);
				}
			}

			if (/*theme*/ ctx[0].status !== 'archived') {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_7(ctx);
					if_block1.c();
					if_block1.m(div1, t5);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*theme*/ 1 && t8_value !== (t8_value = /*theme*/ ctx[0].title + "")) set_data(t8, t8_value);

			if (!/*isLinkSummary*/ ctx[1]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_6(ctx);
					if_block2.c();
					if_block2.m(div3, t10);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*tags*/ ctx[3].length > 0) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_5(ctx);
					if_block3.c();
					if_block3.m(div3, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block4) {
				if_block4.p(ctx, dirty);
			} else {
				if_block4.d(1);
				if_block4 = current_block_type_1(ctx);

				if (if_block4) {
					if_block4.c();
					if_block4.m(div6, t12);
				}
			}

			if (!/*isLinkSummary*/ ctx[1] && /*keyPoints*/ ctx[2].length > 0) {
				if (if_block5) {
					if_block5.p(ctx, dirty);
				} else {
					if_block5 = create_if_block_3(ctx);
					if_block5.c();
					if_block5.m(div6, t13);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (dirty & /*theme*/ 1 && t15_value !== (t15_value = /*theme*/ ctx[0].articles.length + "")) set_data(t15, t15_value);

			if (dirty & /*theme, isLinkSummary, Date*/ 3) {
				each_value = ensure_array_like(/*theme*/ ctx[0].articles);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div6);
			}

			if (if_block0) {
				if_block0.d();
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if_block4.d();
			if (if_block5) if_block5.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function parseTags$1(tagsStr) {
	if (!tagsStr) return [];

	try {
		return JSON.parse(tagsStr);
	} catch(_a) {
		return tagsStr.split(',').map(t => t.trim()).filter(t => t);
	}
}

function instance($$self, $$props, $$invalidate) {
	let tags;
	let keyPoints;
	let isLinkSummary;
	let { theme } = $$props;
	const dispatch = createEventDispatcher();

	function handleExport() {
		dispatch('export-note');
	}

	function handleArchive() {
		dispatch('archive');
	}

	function handleDelete() {
		dispatch('delete');
	}

	function parseKeyPoints(keyPoints) {
		if (!keyPoints) return [];
		if (Array.isArray(keyPoints)) return keyPoints;

		try {
			return JSON.parse(keyPoints);
		} catch(_a) {
			return [];
		}
	}

	$$self.$$set = $$props => {
		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*theme*/ 1) {
			$$invalidate(3, tags = parseTags$1(theme.tags));
		}

		if ($$self.$$.dirty & /*theme*/ 1) {
			$$invalidate(2, keyPoints = parseKeyPoints(theme.key_points));
		}

		if ($$self.$$.dirty & /*theme*/ 1) {
			$$invalidate(1, isLinkSummary = theme.category === "链接汇总");
		}
	};

	return [
		theme,
		isLinkSummary,
		keyPoints,
		tags,
		handleExport,
		handleArchive,
		handleDelete
	];
}

class ThemeDetail extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { theme: 0 }, add_css);
	}
}

/**
 * Sanitizes a string to be used as a valid filename.
 * Removes characters that are not allowed in filenames on most operating systems.
 * @param title The string to sanitize.
 * @returns A sanitized string.
 */
function sanitizeFilename(title) {
    // Replace slashes, backslashes, colons, etc., with a space
    // and remove any leading/trailing whitespace or dots.
    return title.replace(/[\\/:*?"<>|]/g, ' ').trim().replace(/\.$/, '');
}
/**
 * 解析 tags 字段，支持字符串和数组格式
 */
function parseTags(tags) {
    if (!tags)
        return [];
    if (Array.isArray(tags))
        return tags;
    try {
        return JSON.parse(tags);
    }
    catch (_a) {
        return tags.split(',').map(t => t.trim()).filter(t => t);
    }
}
/**
 * 解析 key_points 字段，支持字符串和数组格式
 */
function parseKeyPoints(keyPoints) {
    if (!keyPoints)
        return [];
    if (Array.isArray(keyPoints))
        return keyPoints;
    try {
        return JSON.parse(keyPoints);
    }
    catch (_a) {
        return [];
    }
}
/**
 * Formats a ThemeDetail object into a Markdown string for a new note.
 * @param theme The theme object to format.
 * @returns A string containing the full content of the note in Markdown format.
 */
function formatThemeToMarkdown(theme) {
    const filename = `${sanitizeFilename(theme.title)}.md`;
    const tags = parseTags(theme.tags);
    const keyPoints = parseKeyPoints(theme.key_points);
    let tagsSection = '';
    if (tags.length > 0) {
        tagsSection = tags.map(tag => `  - ${tag.toLowerCase().replace(' ', '-')}`).join('\n') + '\n';
    }
    const frontmatter = `---
tags:
  - trendradar
  - ${theme.category.toLowerCase().replace(' ', '-')}
${tagsSection}category: ${theme.category}
importance: ${theme.importance}
impact: ${theme.impact}
created: ${new Date().toISOString()}
---
`;
    let content = frontmatter;
    content += `\n# ${theme.title}\n\n`;
    content += `## AI 分析摘要\n`;
    content += `${theme.summary}\n\n`;
    if (keyPoints.length > 0) {
        content += `## 核心要点\n`;
        keyPoints.forEach(point => {
            content += `- ${point}\n`;
        });
        content += `\n`;
    }
    content += `## 信息来源 (${theme.articles.length})\n`;
    theme.articles.forEach(article => {
        content += `- [${article.title}](${article.url})\n`;
    });
    return { filename, content };
}

var formatter = /*#__PURE__*/Object.freeze({
    __proto__: null,
    formatThemeToMarkdown: formatThemeToMarkdown
});

class ThemeDetailModal extends obsidian.Modal {
    constructor(app, theme, plugin, onAction) {
        super(app);
        this.theme = theme;
        this.plugin = plugin;
        this.onAction = onAction || (() => { });
        this.modalEl.addClass('trendradar-detail-modal');
    }
    onOpen() {
        // 设置模态框标题
        this.titleEl.setText(this.theme.title);
        // 创建 Svelte 组件
        this.component = new ThemeDetail({
            target: this.contentEl,
            props: {
                theme: this.theme,
            },
        });
        // 绑定事件
        this.component.$on('export-note', this.handleExport.bind(this));
        this.component.$on('archive', this.handleArchive.bind(this));
        this.component.$on('delete', this.handleDelete.bind(this));
    }
    onClose() {
        if (this.component) {
            this.component.$destroy();
        }
        this.contentEl.empty();
    }
    handleExport() {
        return __awaiter(this, void 0, void 0, function* () {
            const exportPath = this.plugin.settings.exportPath;
            if (!exportPath) {
                new obsidian.Notice("请先在设置中配置导出路径");
                return;
            }
            const { filename, content } = formatThemeToMarkdown(this.theme);
            const fullPath = `${exportPath}/${filename}`;
            try {
                // 检查文件夹是否存在，不存在则创建
                if (!(yield this.app.vault.adapter.exists(exportPath))) {
                    yield this.app.vault.createFolder(exportPath);
                }
                // 创建笔记
                const newFile = yield this.app.vault.create(fullPath, content);
                new obsidian.Notice(`已导出笔记: ${newFile.basename}`);
                // 导出后删除卡片
                this.onAction('delete');
                // 关闭模态框
                this.close();
                // 打开新笔记
                this.app.workspace.openLinkText(newFile.path, '', false);
            }
            catch (error) {
                console.error("TrendRadar - 导出笔记失败:", error);
                new obsidian.Notice("导出失败，请查看控制台获取详情");
            }
        });
    }
    handleArchive() {
        this.onAction('archive');
        this.close();
    }
    handleDelete() {
        // 直接删除，无需确认
        this.onAction('delete');
        this.close();
    }
}

class ErrorListModal extends obsidian.Modal {
    constructor(app, errorSummary, plugin) {
        super(app);
        this.errorSummary = errorSummary;
        this.plugin = plugin;
        this.modalEl.addClass('trendradar-error-modal');
    }
    onOpen() {
        this.titleEl.setText('不可用数据源报错统计');
        const contentEl = this.contentEl;
        contentEl.empty();
        contentEl.addClass('trendradar-error-content');
        // 总览卡片
        const overviewCard = contentEl.createDiv({ cls: 'error-overview-card' });
        overviewCard.innerHTML = `
            <div class="overview-item">
                <span class="overview-label">📊 统计周期</span>
                <span class="overview-value">最近3天</span>
            </div>
            <div class="overview-item">
                <span class="overview-label">⚠️ 报错总数</span>
                <span class="overview-value">${this.errorSummary.total_unresolved}</span>
            </div>
        `;
        // 按环节分类
        if (Object.keys(this.errorSummary.by_type).length > 0) {
            const typeCard = this.createStatCard('按环节分类');
            const typeLabels = {
                'source': '抓取',
                'ai': '处理',
                'storage': '存储',
                'display': '面板'
            };
            for (const [type, count] of Object.entries(this.errorSummary.by_type)) {
                const label = typeLabels[type] || type;
                const row = typeCard.createDiv({ cls: 'stat-row' });
                row.innerHTML = `
                    <span class="stat-row-label">${label}</span>
                    <span class="stat-row-value">${count}</span>
                `;
            }
            contentEl.appendChild(typeCard);
        }
        // 按数据源分类
        if (this.errorSummary.by_source && Object.keys(this.errorSummary.by_source).length > 0) {
            const sourceCard = this.createStatCard('按数据源分类');
            for (const [source, count] of Object.entries(this.errorSummary.by_source)) {
                const row = sourceCard.createDiv({ cls: 'stat-row' });
                row.innerHTML = `
                    <span class="stat-row-label">${source}</span>
                    <span class="stat-row-value">${count}次</span>
                `;
            }
            contentEl.appendChild(sourceCard);
        }
        // 按日期分类
        if (this.errorSummary.by_date && Object.keys(this.errorSummary.by_date).length > 0) {
            const dateCard = this.createStatCard('按日期分类');
            for (const [date, count] of Object.entries(this.errorSummary.by_date)) {
                const row = dateCard.createDiv({ cls: 'stat-row' });
                row.innerHTML = `
                    <span class="stat-row-label">${date}</span>
                    <span class="stat-row-value">${count}次</span>
                `;
            }
            contentEl.appendChild(dateCard);
        }
        // 暂无错误提示
        if (this.errorSummary.total_unresolved === 0) {
            const emptyCard = contentEl.createDiv({ cls: 'error-empty-card' });
            emptyCard.innerHTML = '<div class="empty-text">🎉 暂无报错</div>';
        }
    }
    createStatCard(title) {
        const card = document.createElement('div');
        card.addClass('error-stat-card');
        card.innerHTML = `<div class="stat-card-title">${title}</div>`;
        return card;
    }
    onClose() {
        // Modal 会自动处理关闭，点击空白区域即可关闭
    }
}

const TRENDRADAR_VIEW_TYPE = "trendradar-view";
class TrendRadarView extends obsidian.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.currentThemes = [];
        this.newThemeAgeDays = 1;
        this.plugin = plugin;
    }
    getViewType() {
        return TRENDRADAR_VIEW_TYPE;
    }
    getDisplayText() {
        return "TrendRadar";
    }
    getIcon() {
        return "radar";
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // 添加容器样式类
            this.contentEl.addClass('trendradar-container');
            // 创建主题列表容器
            const listContainer = this.contentEl.createDiv({ cls: 'trendradar-list-container' });
            this.component = new ThemeList({
                target: listContainer,
                props: {
                    themes: [],
                    newThemeAgeDays: 1,
                    errorCount: 0,
                },
            });
            // 绑定事件
            this.component.$on("theme-click", this.onThemeClick.bind(this));
            this.component.$on("theme-archive", this.onThemeArchive.bind(this));
            this.component.$on("theme-unarchive", this.onThemeUnarchive.bind(this));
            this.component.$on("theme-delete", this.onThemeDelete.bind(this));
            this.component.$on("theme-mark-read", this.onThemeMarkRead.bind(this));
            this.component.$on("theme-export", this.onThemeExport.bind(this));
            this.component.$on("refresh", this.onRefresh.bind(this));
            this.component.$on("show-errors", this.onShowErrors.bind(this));
        });
    }
    filterThemes(status) {
        if (!this.currentThemes)
            return;
        let filtered = this.currentThemes;
        if (status) {
            if (status === 'unread') {
                filtered = this.currentThemes.filter(t => t.status !== 'read' && t.status !== 'archived');
            }
            else {
                filtered = this.currentThemes.filter(t => t.status === status);
            }
        }
        this.component.$set({ themes: filtered, newThemeAgeDays: this.newThemeAgeDays });
    }
    onClose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.component) {
                this.component.$destroy();
            }
        });
    }
    onThemeClick(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeId = event.detail.themeId;
            const themeDetails = yield getThemeDetails(this.plugin.settings.apiUrl, themeId);
            if (themeDetails) {
                // 自动标记为已读
                if (themeDetails.status !== 'read' && themeDetails.status !== 'archived') {
                    yield updateThemeStatus(this.plugin.settings.apiUrl, themeId, 'read');
                    // 更新本地状态
                    const theme = this.currentThemes.find(t => t.id === themeId);
                    if (theme) {
                        theme.status = 'read';
                        this.component.$set({ themes: this.currentThemes });
                    }
                }
                new ThemeDetailModal(this.app, themeDetails, this.plugin, (action) => __awaiter(this, void 0, void 0, function* () {
                    if (action === 'archive') {
                        yield this.archiveTheme(themeId);
                    }
                    else if (action === 'delete') {
                        yield this.deleteThemeById(themeId);
                    }
                })).open();
            }
            else {
                new obsidian.Notice("获取详情失败");
            }
        });
    }
    onThemeMarkRead(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeId = event.detail.themeId;
            const success = yield updateThemeStatus(this.plugin.settings.apiUrl, themeId, 'read');
            if (success) {
                const theme = this.currentThemes.find(t => t.id === themeId);
                if (theme) {
                    theme.status = 'read';
                    this.component.$set({ themes: this.currentThemes });
                }
            }
        });
    }
    onThemeArchive(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeId = event.detail.themeId;
            yield this.archiveTheme(themeId);
        });
    }
    onThemeUnarchive(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeId = event.detail.themeId;
            const success = yield updateThemeStatus(this.plugin.settings.apiUrl, themeId, 'unread');
            if (success) {
                new obsidian.Notice('已取消归档');
                const theme = this.currentThemes.find(t => t.id === themeId);
                if (theme) {
                    theme.status = 'unread';
                    this.component.$set({ themes: this.currentThemes });
                }
            }
            else {
                new obsidian.Notice('取消归档失败');
            }
        });
    }
    archiveTheme(themeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield updateThemeStatus(this.plugin.settings.apiUrl, themeId, 'archived');
            if (success) {
                new obsidian.Notice('已归档');
                const theme = this.currentThemes.find(t => t.id === themeId);
                if (theme) {
                    theme.status = 'archived';
                    this.component.$set({ themes: this.currentThemes });
                }
            }
            else {
                new obsidian.Notice('归档失败');
            }
        });
    }
    onThemeDelete(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeId = event.detail.themeId;
            yield this.deleteThemeById(themeId);
        });
    }
    deleteThemeById(themeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield deleteTheme(this.plugin.settings.apiUrl, themeId);
            if (success) {
                new obsidian.Notice('已删除');
                this.currentThemes = this.currentThemes.filter(t => t.id !== themeId);
                this.component.$set({ themes: this.currentThemes });
            }
            else {
                new obsidian.Notice('删除失败');
            }
        });
    }
    onThemeExport(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeId = event.detail.themeId;
            // 获取主题详情
            const themeDetails = yield getThemeDetails(this.plugin.settings.apiUrl, themeId);
            if (!themeDetails) {
                new obsidian.Notice("获取详情失败");
                return;
            }
            // 导入 formatThemeToMarkdown
            const { formatThemeToMarkdown } = yield Promise.resolve().then(function () { return formatter; });
            const exportPath = this.plugin.settings.exportPath;
            if (!exportPath) {
                new obsidian.Notice("请先在设置中配置导出路径");
                return;
            }
            const { filename, content } = formatThemeToMarkdown(themeDetails);
            const fullPath = `${exportPath}/${filename}`;
            try {
                // 检查文件夹是否存在，不存在则创建
                if (!(yield this.app.vault.adapter.exists(exportPath))) {
                    yield this.app.vault.createFolder(exportPath);
                }
                // 创建笔记
                const newFile = yield this.app.vault.create(fullPath, content);
                new obsidian.Notice(`已导出笔记: ${newFile.basename}`);
                // 导出后删除卡片
                yield this.deleteThemeById(themeId);
                // 打开新笔记
                this.app.workspace.openLinkText(newFile.path, '', false);
            }
            catch (error) {
                console.error("TrendRadar - 导出笔记失败:", error);
                new obsidian.Notice("导出失败，请查看控制台获取详情");
            }
        });
    }
    onRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield triggerFetch(this.plugin.settings.apiUrl);
            if (success) {
                new obsidian.Notice('已触发抓取任务，正在后台处理...');
                // 延迟3秒后刷新数据，给抓取任务一些时间
                setTimeout(() => {
                    this.plugin.activateView();
                }, 3000);
            }
            else {
                new obsidian.Notice('触发抓取失败');
            }
        });
    }
    onShowErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            const summary = yield getErrorSummary(this.plugin.settings.apiUrl);
            if (summary) {
                new ErrorListModal(this.app, summary, this.plugin).open();
            }
        });
    }
    // 更新视图数据
    update(themes_1) {
        return __awaiter(this, arguments, void 0, function* (themes, newThemeAgeDays = 1) {
            this.currentThemes = themes;
            this.newThemeAgeDays = newThemeAgeDays;
            // 获取错误统计
            let errorCount = 0;
            try {
                const summary = yield getErrorSummary(this.plugin.settings.apiUrl);
                if (summary) {
                    errorCount = summary.total_unresolved || 0;
                }
            }
            catch (error) {
                console.error('[TrendRadar] 获取错误统计失败:', error);
            }
            this.component.$set({ themes, newThemeAgeDays, errorCount });
        });
    }
}

const MODEL_PRESETS = {
    openai: [
        { name: 'GPT-4o (推荐)', value: 'gpt-4o', provider: 'openai', description: '最新最强模型，适合复杂任务' },
        { name: 'GPT-4o-mini (快速)', value: 'gpt-4o-mini', provider: 'openai', description: '快速轻量，适合简单分析' },
        { name: 'GPT-4 Turbo', value: 'gpt-4-turbo', provider: 'openai', description: '高性能模型' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', provider: 'openai', description: '经济实惠' }
    ],
    deepseek: [
        { name: 'DeepSeek-V3 (推荐)', value: 'deepseek-chat', provider: 'deepseek', base_url: 'https://api.deepseek.com', description: '最新旗舰模型' },
        { name: 'DeepSeek-V2', value: 'deepseek-coder', provider: 'deepseek', base_url: 'https://api.deepseek.com', description: '代码优化' }
    ],
    gemini: [
        { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash-exp', provider: 'gemini', description: '超快响应' },
        { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro', provider: 'gemini', description: '高性能模型' },
        { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash', provider: 'gemini', description: '快速轻量' }
    ],
    'openai-compatible': [
        { name: '自定义模型', value: '', provider: 'openai-compatible', description: '手动输入模型名称' },
        { name: 'Llama 3.1 70B', value: 'llama-3.1-70b', provider: 'openai-compatible', description: '本地部署示例' },
        { name: 'Qwen2.5 72B', value: 'qwen2.5-72b', provider: 'openai-compatible', description: '通义千问示例' }
    ]
};
// 获取指定提供商的模型预设
function getModelPresets(provider) {
    return MODEL_PRESETS[provider] || [];
}
const DEFAULT_SETTINGS = {
    apiUrl: 'http://127.0.0.1:3334',
    exportPath: 'TrendRadar',
    autoRefresh: false,
    refreshInterval: 15
};
// --- Main Plugin Class ---
class TrendRadarPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.refreshIntervalId = null;
        this.lastFetchStatus = null;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            console.log('TrendRadar AI Assistant Plugin loaded.');
            this.registerView(TRENDRADAR_VIEW_TYPE, (leaf) => new TrendRadarView(leaf, this));
            // 添加工具栏图标
            this.addRibbonIcon('radar', 'TrendRadar AI', (evt) => __awaiter(this, void 0, void 0, function* () {
                this.activateView();
            }));
            // 添加设置选项卡
            this.addSettingTab(new TrendRadarSettingTab(this.app, this));
            // 启动自动刷新（如果启用）
            this.setupAutoRefresh();
        });
    }
    onunload() {
        console.log('TrendRadar AI Assistant Plugin unloaded.');
        this.clearAutoRefresh();
    }
    setupAutoRefresh() {
        this.clearAutoRefresh();
        if (this.settings.autoRefresh && this.settings.refreshInterval > 0) {
            const intervalMs = this.settings.refreshInterval * 60 * 1000;
            this.refreshIntervalId = window.setInterval(() => {
                this.refreshView();
            }, intervalMs);
            console.log(`Auto-refresh enabled: every ${this.settings.refreshInterval} minutes`);
        }
    }
    clearAutoRefresh() {
        if (this.refreshIntervalId !== null) {
            window.clearInterval(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }
    }
    refreshView() {
        return __awaiter(this, void 0, void 0, function* () {
            // 首先触发后端抓取任务
            try {
                const success = yield triggerFetch(this.settings.apiUrl);
                if (success) {
                    console.log('[TrendRadar] 自动触发抓取任务成功');
                    // 不显示通知，避免打扰用户
                }
            }
            catch (error) {
                console.error('[TrendRadar] 自动触发抓取任务失败:', error);
            }
            // 检查抓取状态
            const status = yield getFetchStatus(this.settings.apiUrl);
            if (status) {
                // 如果有新的完成状态，显示通知
                if (status.status === 'completed' &&
                    this.lastFetchStatus &&
                    (this.lastFetchStatus.status === 'running' || this.lastFetchStatus.status === 'idle')) {
                    if (status.new_items_count > 0) {
                        new obsidian.Notice(`✨ 自动刷新: 新增 ${status.new_items_count} 条信息`);
                    }
                    // 如果没有新增内容，不显示通知，避免打扰
                }
                this.lastFetchStatus = status;
            }
            // 刷新视图
            const leaves = this.app.workspace.getLeavesOfType(TRENDRADAR_VIEW_TYPE);
            if (leaves.length > 0) {
                const leaf = leaves[0];
                if (leaf.view instanceof TrendRadarView) {
                    const response = yield getThemes(this.settings.apiUrl);
                    if (response && response.themes) {
                        leaf.view.update(response.themes, response.new_theme_age_days);
                    }
                }
            }
        });
    }
    activateView() {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspace } = this.app;
            let leaf = null;
            const leaves = workspace.getLeavesOfType(TRENDRADAR_VIEW_TYPE);
            if (leaves.length > 0) {
                leaf = leaves[0];
            }
            else {
                const newLeaf = workspace.getRightLeaf(false);
                if (newLeaf) {
                    yield newLeaf.setViewState({ type: TRENDRADAR_VIEW_TYPE, active: true });
                    leaf = newLeaf;
                }
            }
            if (!leaf)
                return;
            workspace.revealLeaf(leaf);
            new obsidian.Notice('正在从 TrendRadar 获取数据...');
            const response = yield getThemes(this.settings.apiUrl);
            if (response && response.themes && response.themes.length > 0) {
                new obsidian.Notice(`成功获取 ${response.themes.length} 个主题`);
                if (leaf.view instanceof TrendRadarView) {
                    leaf.view.update(response.themes, response.new_theme_age_days);
                }
            }
            else {
                new obsidian.Notice('暂无主题数据');
            }
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            this.setupAutoRefresh();
        });
    }
}
// --- Settings Tab ---
class TrendRadarSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.activeTab = 'general';
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h1', { text: 'TrendRadar 设置' });
        // Tab 导航
        const tabsContainer = containerEl.createDiv({ cls: 'trendradar-settings-tabs' });
        const tabs = [
            { id: 'general', name: '常规设置', icon: 'settings' },
            { id: 'ai', name: 'AI 服务', icon: 'bot' },
            { id: 'sources', name: '数据源管理', icon: 'database' },
            { id: 'source-groups', name: '数据源分组', icon: 'layers' },
            { id: 'filter', name: '内容过滤', icon: 'filter' },
            { id: 'deduplication', name: '去重设置', icon: 'duplicate' },
            { id: 'system', name: '系统设置', icon: 'gear' }
        ];
        tabs.forEach(tab => {
            const tabEl = tabsContainer.createDiv({
                cls: `trendradar-settings-tab ${this.activeTab === tab.id ? 'active' : ''}`,
                text: tab.name
            });
            tabEl.onclick = () => {
                this.activeTab = tab.id;
                this.display(); // 重新渲染
            };
        });
        this.contentContainer = containerEl.createDiv({ cls: 'trendradar-settings-content' });
        // 根据当前 Tab 渲染内容
        switch (this.activeTab) {
            case 'general':
                this.renderGeneralSettings();
                break;
            case 'source-groups':
                this.renderSourceGroupsSettings();
                break;
            case 'sources':
                this.renderSourcesSettings();
                break;
            case 'ai':
                this.renderAISettings();
                break;
            case 'filter':
                this.renderFilterSettings();
                break;
            case 'deduplication':
                this.renderDeduplicationSettings();
                break;
            case 'system':
                this.renderSystemSettings();
                break;
        }
    }
    renderGeneralSettings() {
        const container = this.contentContainer;
        new obsidian.Setting(container)
            .setName('后端 API 地址')
            .setDesc('TrendRadar Python 后端服务器的地址')
            .addText(text => text
            .setPlaceholder('http://127.0.0.1:3334')
            .setValue(this.plugin.settings.apiUrl)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.apiUrl = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(container)
            .setName('导出文件夹')
            .setDesc('新笔记将保存到此文件夹')
            .addText(text => text
            .setPlaceholder('TrendRadar/Notes')
            .setValue(this.plugin.settings.exportPath)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.exportPath = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(container)
            .setName('自动刷新')
            .setDesc('启用后将自动定时刷新数据')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.autoRefresh)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.autoRefresh = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(container)
            .setName('刷新间隔（分钟）')
            .setDesc('自动刷新的时间间隔')
            .addText(text => text
            .setPlaceholder('15')
            .setValue(String(this.plugin.settings.refreshInterval))
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
                this.plugin.settings.refreshInterval = num;
                yield this.plugin.saveSettings();
            }
        })));
        // 任务控制
        container.createEl('h3', { text: '任务控制' });
        new obsidian.Setting(container)
            .setName('立即抓取')
            .setDesc('手动触发一次完整的数据抓取和分析任务（后台运行）')
            .addButton(button => button
            .setButtonText('🚀 开始抓取')
            .setCta()
            .onClick(() => __awaiter(this, void 0, void 0, function* () {
            new obsidian.Notice('正在触发抓取任务...');
            try {
                const success = yield triggerFetch(this.plugin.settings.apiUrl);
                if (success) {
                    new obsidian.Notice('抓取任务已在后台启动，请稍后刷新查看结果');
                }
                else {
                    new obsidian.Notice('触发失败，请检查后端连接');
                }
            }
            catch (error) {
                new obsidian.Notice('触发失败: ' + error);
            }
        })));
    }
    renderSourceGroupsSettings() {
        const container = this.contentContainer;
        container.createEl('p', {
            text: '管理数据源分组，每个分组可以使用不同的AI配置。支持将网络源和本地目录混合分析。',
            cls: 'setting-item-description'
        });
        new obsidian.Setting(container)
            .setName('添加新分组')
            .addButton(button => button
            .setButtonText('+ 添加分组')
            .setCta()
            .onClick(() => {
            new SourceGroupEditModal(this.app, this.plugin, null, () => {
                this.renderSourceGroupsSettings();
            }).open();
        }));
        const listContainer = container.createDiv({ cls: 'trendradar-groups-list' });
        this.refreshSourceGroupsList(listContainer);
    }
    refreshSourceGroupsList(container) {
        return __awaiter(this, void 0, void 0, function* () {
            container.empty();
            try {
                const groups = yield getSourceGroups(this.plugin.settings.apiUrl);
                if (groups.length === 0) {
                    container.createEl('div', { text: '暂无分组，请点击上方按钮添加。', cls: 'trendradar-empty-state' });
                    return;
                }
                groups.forEach(group => {
                    const item = container.createDiv({ cls: 'trendradar-group-item' });
                    // 图标
                    const iconDiv = item.createDiv({ cls: 'group-icon' });
                    iconDiv.setText('📁');
                    // 信息
                    const infoDiv = item.createDiv({ cls: 'group-info' });
                    infoDiv.createDiv({ cls: 'group-name', text: group.name });
                    const details = infoDiv.createDiv({ cls: 'group-details' });
                    details.createSpan({
                        text: `数据源: ${group.sources.length} 个`,
                        cls: 'group-meta'
                    });
                    if (group.ai_config) {
                        details.createSpan({
                            text: ` | AI: ${group.ai_config.provider}/${group.ai_config.model_name}`,
                            cls: 'group-meta'
                        });
                    }
                    // 状态标签
                    if (group.enabled) {
                        infoDiv.createEl('span', {
                            text: '已启用',
                            cls: 'group-status enabled'
                        });
                    }
                    else {
                        infoDiv.createEl('span', {
                            text: '已禁用',
                            cls: 'group-status disabled'
                        });
                    }
                    // 操作
                    const actionsDiv = item.createDiv({ cls: 'group-actions' });
                    // 编辑按钮
                    new obsidian.ButtonComponent(actionsDiv)
                        .setIcon('pencil')
                        .setTooltip('编辑分组')
                        .onClick(() => {
                        new SourceGroupEditModal(this.app, this.plugin, group, () => {
                            this.refreshSourceGroupsList(container);
                        }).open();
                    });
                    // 删除按钮
                    new obsidian.ButtonComponent(actionsDiv)
                        .setIcon('trash')
                        .setTooltip('删除分组')
                        .onClick(() => __awaiter(this, void 0, void 0, function* () {
                        const confirmed = yield confirm(`确定要删除分组 "${group.name}" 吗？`);
                        if (confirmed) {
                            const success = yield deleteSourceGroup(this.plugin.settings.apiUrl, group.id);
                            if (success) {
                                new obsidian.Notice('分组已删除');
                                this.refreshSourceGroupsList(container);
                            }
                            else {
                                new obsidian.Notice('删除失败');
                            }
                        }
                    }));
                });
            }
            catch (error) {
                container.createEl('div', {
                    text: `加载分组列表失败: ${error}`,
                    cls: 'trendradar-error'
                });
            }
        });
    }
    renderSourcesSettings() {
        const container = this.contentContainer;
        container.createEl('p', {
            text: '在这里添加、编辑或删除您的信息订阅源。支持 RSS、网站爬取和 Twitter/X 账号。',
            cls: 'setting-item-description'
        });
        new obsidian.Setting(container)
            .setName('添加新数据源')
            .addButton(button => button
            .setButtonText('+ 添加数据源')
            .setCta()
            .onClick(() => {
            new SourceEditModal(this.app, this.plugin, null, () => {
                this.renderSourcesSettings(); // 刷新列表
            }).open();
        }));
        const listContainer = container.createDiv({ cls: 'trendradar-sources-list' });
        this.refreshSourcesList(listContainer);
    }
    refreshSourcesList(container) {
        return __awaiter(this, void 0, void 0, function* () {
            container.empty();
            try {
                const sources = yield getSources(this.plugin.settings.apiUrl);
                if (sources.length === 0) {
                    container.createEl('div', { text: '暂无数据源，请点击上方按钮添加。', cls: 'trendradar-empty-state' });
                    return;
                }
                sources.forEach(source => {
                    const item = container.createDiv({ cls: 'trendradar-source-item' });
                    // 图标
                    const iconDiv = item.createDiv({ cls: 'source-icon' });
                    let iconName = 'rss';
                    if (source.type === 'twitter')
                        iconName = 'twitter';
                    // 简单模拟图标
                    iconDiv.setText(source.type.toUpperCase());
                    // 信息
                    const infoDiv = item.createDiv({ cls: 'source-info' });
                    infoDiv.createDiv({ cls: 'source-name', text: source.name });
                    infoDiv.createDiv({ cls: 'source-url', text: source.url || source.username || 'No URL' });
                    // 操作
                    const actionsDiv = item.createDiv({ cls: 'source-actions' });
                    // 启用/禁用开关
                    const toggle = new obsidian.ToggleComponent(actionsDiv)
                        .setValue(source.enabled)
                        .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                        source.enabled = value;
                        yield updateSource(this.plugin.settings.apiUrl, source.id, source);
                    }));
                    toggle.setTooltip(source.enabled ? '已启用' : '已禁用');
                    // 编辑按钮
                    new obsidian.ButtonComponent(actionsDiv)
                        .setIcon('pencil')
                        .setTooltip('编辑')
                        .onClick(() => {
                        new SourceEditModal(this.app, this.plugin, source, () => {
                            this.refreshSourcesList(container);
                        }).open();
                    });
                    // 删除按钮
                    new obsidian.ButtonComponent(actionsDiv)
                        .setIcon('trash')
                        .setTooltip('删除')
                        .setClass('mod-warning')
                        .onClick(() => __awaiter(this, void 0, void 0, function* () {
                        if (confirm(`确定要删除数据源 "${source.name}" 吗？`)) {
                            yield deleteSource(this.plugin.settings.apiUrl, source.id);
                            this.refreshSourcesList(container);
                        }
                    }));
                });
            }
            catch (error) {
                container.createEl('div', { text: '无法加载数据源列表，请检查后端连接。', cls: 'trendradar-error-state' });
            }
        });
    }
    renderAISettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.contentContainer;
            container.empty();
            container.createEl('p', {
                text: '管理可用的AI服务。配置的服务可以在数据源分组中使用。',
                cls: 'setting-item-description'
            });
            // 添加服务按钮
            new obsidian.Setting(container)
                .setName('添加AI服务')
                .addButton(button => button
                .setButtonText('+ 添加服务')
                .setCta()
                .onClick(() => {
                new AIServiceEditModal(this.app, this.plugin, null, () => {
                    this.renderAISettings(); // 刷新列表
                }).open();
            }));
            // 服务列表容器
            const listContainer = container.createDiv({ cls: 'trendradar-groups-list' });
            this.refreshAIServicesList(listContainer);
        });
    }
    refreshAIServicesList(container) {
        return __awaiter(this, void 0, void 0, function* () {
            container.empty();
            try {
                const services = yield getAIServices(this.plugin.settings.apiUrl);
                if (services.length === 0) {
                    container.createEl('div', {
                        text: '暂无AI服务，请点击上方按钮添加。',
                        cls: 'trendradar-empty-state'
                    });
                    return;
                }
                services.forEach(service => {
                    const item = container.createDiv({ cls: 'trendradar-group-item' });
                    // 图标
                    const iconDiv = item.createDiv({ cls: 'group-icon' });
                    iconDiv.setText('🤖');
                    // 信息
                    const infoDiv = item.createDiv({ cls: 'group-info' });
                    infoDiv.createDiv({ cls: 'group-name', text: service.name });
                    const details = infoDiv.createDiv({ cls: 'group-details' });
                    details.createSpan({
                        text: `${service.provider} / ${service.model_name}`,
                        cls: 'group-meta'
                    });
                    if (service.description) {
                        details.createSpan({
                            text: ` | ${service.description}`,
                            cls: 'group-meta'
                        });
                    }
                    // 操作
                    const actionsDiv = item.createDiv({ cls: 'source-actions' });
                    // 编辑按钮
                    new obsidian.ButtonComponent(actionsDiv)
                        .setIcon('pencil')
                        .setTooltip('编辑')
                        .onClick(() => {
                        new AIServiceEditModal(this.app, this.plugin, service, () => {
                            this.refreshAIServicesList(container);
                        }).open();
                    });
                    // 删除按钮
                    new obsidian.ButtonComponent(actionsDiv)
                        .setIcon('trash')
                        .setTooltip('删除')
                        .setClass('mod-warning')
                        .onClick(() => __awaiter(this, void 0, void 0, function* () {
                        if (confirm(`确定要删除AI服务 "${service.name}" 吗？`)) {
                            const success = yield deleteAIService(this.plugin.settings.apiUrl, service.id);
                            if (success) {
                                new obsidian.Notice('AI服务已删除');
                                this.refreshAIServicesList(container);
                            }
                            else {
                                new obsidian.Notice('删除失败');
                            }
                        }
                    }));
                });
            }
            catch (error) {
                container.createEl('div', {
                    text: '无法加载AI服务列表，请检查后端连接。',
                    cls: 'trendradar-error-state'
                });
            }
        });
    }
    renderFilterSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.contentContainer;
            container.empty();
            try {
                const config = yield getFilterConfig(this.plugin.settings.apiUrl);
                new obsidian.Setting(container)
                    .setName('关键词黑名单')
                    .setDesc('包含这些关键词的内容将被过滤（用逗号分隔）')
                    .addTextArea(text => text
                    .setPlaceholder('广告, 推广, ...')
                    .setValue(config.keyword_blacklist.join(', '))
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.keyword_blacklist = value.split(/[,，]/).map(s => s.trim()).filter(s => s);
                    yield updateFilterConfig(this.plugin.settings.apiUrl, config);
                })));
                new obsidian.Setting(container)
                    .setName('分类黑名单')
                    .setDesc('属于这些分类的内容将被过滤（用逗号分隔）')
                    .addTextArea(text => text
                    .setPlaceholder('娱乐, 八卦, ...')
                    .setValue(config.category_blacklist.join(', '))
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.category_blacklist = value.split(/[,，]/).map(s => s.trim()).filter(s => s);
                    yield updateFilterConfig(this.plugin.settings.apiUrl, config);
                })));
                new obsidian.Setting(container)
                    .setName('AI 预过滤')
                    .setDesc('启用后，将使用 AI 初步判断内容相关性（会消耗 Token）')
                    .addToggle(toggle => toggle
                    .setValue(config.enable_ai_prefilter)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.enable_ai_prefilter = value;
                    yield updateFilterConfig(this.plugin.settings.apiUrl, config);
                })));
            }
            catch (error) {
                container.createEl('p', { text: '无法加载过滤配置，请检查后端服务是否运行。', cls: 'trendradar-error-text' });
            }
        });
    }
    renderDeduplicationSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.contentContainer;
            container.empty();
            try {
                // 保存 API URL
                const apiUrl = this.plugin.settings.apiUrl;
                // 获取去重配置
                const configResponse = yield fetch(`${apiUrl}/api/deduplication/config`);
                if (!configResponse.ok) {
                    throw new Error(`HTTP ${configResponse.status}`);
                }
                const config = yield configResponse.json();
                container.createEl('p', {
                    text: '内容去重功能可以自动过滤与已处理内容相似的新主题，避免重复信息。',
                    cls: 'setting-item-description'
                });
                // 启用/禁用去重
                new obsidian.Setting(container)
                    .setName('启用去重')
                    .setDesc('是否启用智能内容去重功能')
                    .addToggle(toggle => toggle
                    .setValue(config.enabled)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.enabled = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                // 相似度阈值
                new obsidian.Setting(container)
                    .setName('相似度阈值')
                    .setDesc('判定为重复的相似度阈值（0.0-1.0），默认0.8表示80%相似')
                    .addSlider(slider => slider
                    .setLimits(0, 1, 0.05)
                    .setValue(config.similarity_threshold)
                    .setDynamicTooltip()
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.similarity_threshold = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                // 检查窗口（天数）
                new obsidian.Setting(container)
                    .setName('检查窗口（天）')
                    .setDesc('只检查最近N天的历史记录')
                    .addText(text => text
                    .setValue(String(config.check_window_days))
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    const num = parseInt(value);
                    if (!isNaN(num) && num > 0) {
                        config.check_window_days = num;
                        try {
                            const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(config)
                            });
                            if (!response.ok)
                                throw new Error(`HTTP ${response.status}`);
                        }
                        catch (error) {
                            new obsidian.Notice('更新配置失败');
                            console.error(error);
                        }
                    }
                })));
                // 最大历史记录数
                new obsidian.Setting(container)
                    .setName('最大历史记录数')
                    .setDesc('最多检查N条历史记录（与时间窗口取较小值）')
                    .addText(text => text
                    .setValue(String(config.max_history_records))
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    const num = parseInt(value);
                    if (!isNaN(num) && num > 0) {
                        config.max_history_records = num;
                        try {
                            const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(config)
                            });
                            if (!response.ok)
                                throw new Error(`HTTP ${response.status}`);
                        }
                        catch (error) {
                            new obsidian.Notice('更新配置失败');
                            console.error(error);
                        }
                    }
                })));
                // 过滤对象
                container.createEl('h3', { text: '过滤对象' });
                new obsidian.Setting(container)
                    .setName('过滤已删除内容')
                    .setDesc('是否过滤已被删除的相似内容')
                    .addToggle(toggle => toggle
                    .setValue(config.filter_deleted)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.filter_deleted = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                new obsidian.Setting(container)
                    .setName('过滤已归档内容')
                    .setDesc('是否过滤已被归档的相似内容')
                    .addToggle(toggle => toggle
                    .setValue(config.filter_archived)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.filter_archived = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                new obsidian.Setting(container)
                    .setName('过滤已导出内容')
                    .setDesc('是否过滤已被导出的相似内容')
                    .addToggle(toggle => toggle
                    .setValue(config.filter_exported)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.filter_exported = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                // 重复内容处理方式
                container.createEl('h3', { text: '重复内容处理' });
                new obsidian.Setting(container)
                    .setName('处理方式')
                    .setDesc('keep=保留并标记为重复，discard=直接丢弃')
                    .addDropdown(dropdown => dropdown
                    .addOption('keep', '保留并标记')
                    .addOption('discard', '直接丢弃')
                    .setValue(config.duplicate_action)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.duplicate_action = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                // 相似度计算方法
                container.createEl('h3', { text: '高级设置' });
                new obsidian.Setting(container)
                    .setName('相似度计算方法')
                    .setDesc('title_only=仅标题（快速），hybrid=标题+摘要（准确）')
                    .addDropdown(dropdown => dropdown
                    .addOption('title_only', '仅标题')
                    .addOption('hybrid', '标题+摘要')
                    .setValue(config.method)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    config.method = value;
                    try {
                        const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(config)
                        });
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                    }
                    catch (error) {
                        new obsidian.Notice('更新配置失败');
                        console.error(error);
                    }
                })));
                // 历史记录保留天数
                new obsidian.Setting(container)
                    .setName('历史保留天数')
                    .setDesc('已处理历史记录的保留天数，超过此天数将被自动清理')
                    .addText(text => text
                    .setValue(String(config.history_retention_days))
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    const num = parseInt(value);
                    if (!isNaN(num) && num > 0) {
                        config.history_retention_days = num;
                        try {
                            const response = yield fetch(`${apiUrl}/api/deduplication/config`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(config)
                            });
                            if (!response.ok)
                                throw new Error(`HTTP ${response.status}`);
                        }
                        catch (error) {
                            new obsidian.Notice('更新配置失败');
                            console.error(error);
                        }
                    }
                })));
            }
            catch (error) {
                container.createEl('p', { text: '无法加载去重配置，请检查后端服务是否运行。', cls: 'trendradar-error-text' });
                console.error(error);
            }
        });
    }
    renderSystemSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.contentContainer;
            container.empty();
            try {
                const { getSettings, updateSettings } = yield Promise.resolve().then(function () { return api; });
                const settings = yield getSettings(this.plugin.settings.apiUrl);
                if (!settings) {
                    container.createEl('p', { text: '无法加载系统配置，请检查后端服务是否运行。', cls: 'trendradar-error-text' });
                    return;
                }
                // 报告配置
                container.createEl('h3', { text: '报告配置' });
                new obsidian.Setting(container)
                    .setName('报告模式')
                    .setDesc('选择报告模式：daily(当日汇总)、current(当前榜单)、incremental(增量模式)')
                    .addDropdown(dropdown => dropdown
                    .addOption('daily', '当日汇总')
                    .addOption('current', '当前榜单')
                    .addOption('incremental', '增量模式')
                    .setValue(settings.report.mode)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.report.mode = value;
                    yield updateSettings(this.plugin.settings.apiUrl, { report: settings.report });
                })));
                new obsidian.Setting(container)
                    .setName('排名阈值')
                    .setDesc('高亮显示的排名阈值')
                    .addText(text => text
                    .setValue(String(settings.report.rank_threshold))
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.report.rank_threshold = parseInt(value) || 5;
                    yield updateSettings(this.plugin.settings.apiUrl, { report: settings.report });
                })));
                // 通知配置
                container.createEl('h3', { text: '通知配置' });
                new obsidian.Setting(container)
                    .setName('启用通知')
                    .setDesc('是否启用通知推送')
                    .addToggle(toggle => toggle
                    .setValue(settings.notification.enabled)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.notification.enabled = value;
                    yield updateSettings(this.plugin.settings.apiUrl, { notification: settings.notification });
                })));
                new obsidian.Setting(container)
                    .setName('飞书 Webhook')
                    .setDesc('飞书机器人 Webhook URL')
                    .addText(text => text
                    .setValue(settings.notification.channels.feishu.webhook_url)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.notification.channels.feishu.webhook_url = value;
                    yield updateSettings(this.plugin.settings.apiUrl, { notification: settings.notification });
                })));
                new obsidian.Setting(container)
                    .setName('钉钉 Webhook')
                    .setDesc('钉钉机器人 Webhook URL')
                    .addText(text => text
                    .setValue(settings.notification.channels.dingtalk.webhook_url)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.notification.channels.dingtalk.webhook_url = value;
                    yield updateSettings(this.plugin.settings.apiUrl, { notification: settings.notification });
                })));
                new obsidian.Setting(container)
                    .setName('Telegram Bot Token')
                    .setDesc('Telegram 机器人 Token')
                    .addText(text => text
                    .setValue(settings.notification.channels.telegram.bot_token)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.notification.channels.telegram.bot_token = value;
                    yield updateSettings(this.plugin.settings.apiUrl, { notification: settings.notification });
                })));
                new obsidian.Setting(container)
                    .setName('Telegram Chat ID')
                    .setDesc('Telegram 聊天 ID')
                    .addText(text => text
                    .setValue(settings.notification.channels.telegram.chat_id)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    settings.notification.channels.telegram.chat_id = value;
                    yield updateSettings(this.plugin.settings.apiUrl, { notification: settings.notification });
                })));
                // 存储配置
                container.createEl('h3', { text: '存储配置' });
                new obsidian.Setting(container)
                    .setName('数据保留天数')
                    .setDesc('本地数据保留天数（0 = 永久保留）')
                    .addText(text => {
                    var _a, _b;
                    return text
                        .setValue(String(((_b = (_a = settings.storage) === null || _a === void 0 ? void 0 : _a.local) === null || _b === void 0 ? void 0 : _b.retention_days) || 0))
                        .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                        if (!settings.storage)
                            settings.storage = {};
                        if (!settings.storage.local)
                            settings.storage.local = {};
                        settings.storage.local.retention_days = parseInt(value) || 0;
                        yield updateSettings(this.plugin.settings.apiUrl, { storage: settings.storage });
                    }));
                });
            }
            catch (error) {
                container.createEl('p', { text: '无法加载系统配置，请检查后端服务是否运行。', cls: 'trendradar-error-text' });
            }
        });
    }
}
// --- Source Edit Modal ---
class SourceEditModal extends obsidian.Modal {
    constructor(app, plugin, source, onSave) {
        super(app);
        this.plugin = plugin;
        this.source = source;
        this.onSave = onSave;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: this.source ? '编辑数据源' : '添加数据源' });
        const config = this.source ? Object.assign({}, this.source) : {
            id: '',
            name: '',
            type: 'rss',
            enabled: true,
            url: '',
            username: '',
            selector: '',
            schedule: '0 * * * *',
            retention_days: 7,
            max_items: 20,
            use_proxy: false,
            extra: {}
        };
        // 类型选择
        new obsidian.Setting(contentEl)
            .setName('类型')
            .addDropdown(dropdown => dropdown
            .addOption('rss', 'RSS 订阅')
            .addOption('twitter', 'Twitter/X 用户')
            .addOption('local', '本地目录')
            .setValue(config.type)
            .onChange(value => {
            config.type = value;
            this.onOpen(); // 刷新界面以显示不同类型的字段
        }));
        new obsidian.Setting(contentEl)
            .setName('名称')
            .addText(text => text
            .setValue(config.name)
            .onChange(value => config.name = value));
        if (config.type === 'rss') {
            new obsidian.Setting(contentEl)
                .setName('URL')
                .setDesc('RSS Feed 地址')
                .addText(text => text
                .setValue(config.url)
                .onChange(value => config.url = value));
        }
        if (config.type === 'twitter') {
            new obsidian.Setting(contentEl)
                .setName('用户名')
                .setDesc('Twitter 用户名 (不带 @)')
                .addText(text => text
                .setValue(config.username || '')
                .onChange(value => config.username = value));
        }
        if (config.type === 'local') {
            new obsidian.Setting(contentEl)
                .setName('目录路径')
                .setDesc('本地目录的绝对路径')
                .addText(text => {
                var _a;
                return text
                    .setValue(((_a = config.extra) === null || _a === void 0 ? void 0 : _a.path) || '')
                    .setPlaceholder('/Users/xxx/Documents/Inbox')
                    .onChange(value => {
                    if (!config.extra)
                        config.extra = {};
                    config.extra.path = value;
                });
            });
            new obsidian.Setting(contentEl)
                .setName('文件模式')
                .setDesc('要包含的文件类型（逗号分隔）')
                .addText(text => {
                var _a, _b;
                return text
                    .setValue(((_b = (_a = config.extra) === null || _a === void 0 ? void 0 : _a.file_patterns) === null || _b === void 0 ? void 0 : _b.join(', ')) || '*.md, *.txt')
                    .setPlaceholder('*.md, *.txt')
                    .onChange(value => {
                    if (!config.extra)
                        config.extra = {};
                    config.extra.file_patterns = value.split(',').map(s => s.trim());
                });
            });
            new obsidian.Setting(contentEl)
                .setName('递归子目录')
                .addToggle(toggle => {
                var _a, _b;
                return toggle
                    .setValue((_b = (_a = config.extra) === null || _a === void 0 ? void 0 : _a.recursive) !== null && _b !== void 0 ? _b : true)
                    .onChange(value => {
                    if (!config.extra)
                        config.extra = {};
                    config.extra.recursive = value;
                });
            });
        }
        new obsidian.Setting(contentEl)
            .setName('保留天数')
            .addText(text => text
            .setValue(String(config.retention_days))
            .onChange(value => config.retention_days = parseInt(value) || 7));
        new obsidian.Setting(contentEl)
            .setName('最大条目数')
            .setDesc('每次抓取的最大数量')
            .addText(text => text
            .setValue(String(config.max_items))
            .onChange(value => config.max_items = parseInt(value) || 20));
        new obsidian.Setting(contentEl)
            .addButton(button => button
            .setButtonText('保存')
            .setCta()
            .onClick(() => __awaiter(this, void 0, void 0, function* () {
            if (!config.name) {
                new obsidian.Notice('请输入名称');
                return;
            }
            // 自动生成 ID
            if (!config.id) {
                config.id = config.type + '_' + Date.now();
            }
            try {
                if (this.source) {
                    yield updateSource(this.plugin.settings.apiUrl, config.id, config);
                }
                else {
                    yield createSource(this.plugin.settings.apiUrl, config);
                }
                this.onSave();
                this.close();
                new obsidian.Notice('保存成功');
            }
            catch (error) {
                new obsidian.Notice('保存失败: ' + error);
            }
        })));
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
// --- AI Service Edit Modal ---
class AIServiceEditModal extends obsidian.Modal {
    constructor(app, plugin, service, onSave) {
        super(app);
        this.plugin = plugin;
        this.service = service;
        this.onSave = onSave;
    }
    onOpen() {
        const { contentEl, modalEl } = this;
        contentEl.empty();
        // 添加CSS类名
        modalEl.addClass('mod-fresh-source-group-edit');
        contentEl.createEl('h2', { text: this.service ? '编辑AI服务' : '添加AI服务' });
        const service = this.service ? Object.assign({}, this.service) : {
            id: '',
            name: '',
            provider: 'openai',
            api_key: '',
            base_url: '',
            model_name: 'gpt-4o',
            temperature: 0.7,
            description: ''
        };
        // ID（仅新建时可编辑）
        new obsidian.Setting(contentEl)
            .setName('服务ID')
            .setDesc('唯一标识符（只能包含字母、数字、连字符）')
            .addText(text => text
            .setValue(service.id)
            .setPlaceholder('my-openai-service')
            .setDisabled(!!this.service)
            .onChange(value => service.id = value));
        // 服务名称
        new obsidian.Setting(contentEl)
            .setName('服务名称')
            .setDesc('显示名称')
            .addText(text => text
            .setValue(service.name)
            .setPlaceholder('我的OpenAI服务')
            .onChange(value => service.name = value));
        // AI提供商
        new obsidian.Setting(contentEl)
            .setName('AI提供商')
            .addDropdown(dropdown => dropdown
            .addOption('openai', 'OpenAI')
            .addOption('deepseek', 'DeepSeek')
            .addOption('gemini', 'Google Gemini')
            .addOption('openai-compatible', '兼容OpenAI')
            .setValue(service.provider)
            .onChange(value => {
            service.provider = value;
            // 更新默认模型
            const preset = getModelPresets(value)[0];
            if (preset) {
                service.model_name = preset.value;
                modelSelect.setValue(preset.value);
                if (preset.base_url) {
                    service.base_url = preset.base_url;
                    baseUrlInput.setValue(preset.base_url);
                }
            }
        }));
        // API Key
        new obsidian.Setting(contentEl)
            .setName('API Key')
            .addText(text => text
            .setValue(service.api_key)
            .setPlaceholder('sk-...')
            .onChange(value => service.api_key = value));
        // API地址
        let baseUrlInput;
        new obsidian.Setting(contentEl)
            .setName('API地址')
            .setDesc('自定义API端点（留空使用默认地址）')
            .addText(text => {
            baseUrlInput = text;
            baseUrlInput.setValue(service.base_url)
                .setPlaceholder('https://api.openai.com/v1')
                .onChange(value => service.base_url = value);
        });
        // 模型名称
        new obsidian.Setting(contentEl)
            .setName('模型名称')
            .setDesc('例如: gpt-4o, deepseek-chat, gemini-2.0-flash-exp')
            .addText(text => text
            .setValue(service.model_name)
            .setPlaceholder('gpt-4o')
            .onChange(value => service.model_name = value));
        // 温度
        new obsidian.Setting(contentEl)
            .setName('温度')
            .setDesc('控制随机性（0-1）')
            .addSlider(slider => slider
            .setLimits(0, 1, 0.1)
            .setValue(service.temperature)
            .setDynamicTooltip()
            .onChange(value => service.temperature = value));
        // 描述
        new obsidian.Setting(contentEl)
            .setName('描述')
            .setDesc('服务用途说明')
            .addText(text => text
            .setValue(service.description)
            .setPlaceholder('用于...')
            .onChange(value => service.description = value));
        // 保存按钮
        new obsidian.Setting(contentEl)
            .addButton(button => button
            .setButtonText('保存')
            .setCta()
            .onClick(() => __awaiter(this, void 0, void 0, function* () {
            if (!service.id || !service.name) {
                new obsidian.Notice('请填写服务ID和名称');
                return;
            }
            // 验证ID格式
            if (!/^[a-z0-9-]+$/.test(service.id)) {
                new obsidian.Notice('服务ID只能包含小写字母、数字和连字符');
                return;
            }
            try {
                if (this.service) {
                    yield updateAIService(this.plugin.settings.apiUrl, service.id, service);
                }
                else {
                    yield createAIService(this.plugin.settings.apiUrl, service);
                }
                this.onSave();
                this.close();
                new obsidian.Notice('AI服务保存成功');
            }
            catch (error) {
                new obsidian.Notice('保存失败: ' + error);
            }
        })));
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
class SourceGroupEditModal extends obsidian.Modal {
    constructor(app, plugin, group, onSave) {
        super(app);
        this.plugin = plugin;
        this.group = group;
        this.onSave = onSave;
        // 初始化配置对象
        this.config = group ? Object.assign({}, group) : {
            id: '',
            name: '',
            enabled: true,
            description: '',
            ai_config: {
                mode: 'two-stage',
                analysis_service_id: '',
                aggregation_service_id: ''
            },
            sources: []
        };
        // 确保ai_config存在
        if (!this.config.ai_config) {
            this.config.ai_config = {
                mode: 'two-stage',
                analysis_service_id: '',
                aggregation_service_id: ''
            };
        }
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { contentEl, modalEl } = this;
            contentEl.empty();
            // 添加CSS类名以应用Apple风格样式
            modalEl.addClass('mod-fresh-source-group-edit');
            contentEl.createEl('h2', { text: this.group ? '编辑分组' : '添加分组' });
            // 分组ID
            new obsidian.Setting(contentEl)
                .setName('分组ID')
                .setDesc('唯一标识符（只能包含字母、数字、连字符）')
                .addText(text => text
                .setValue(this.config.id)
                .setPlaceholder('my-group')
                .onChange(value => this.config.id = value));
            // 分组名称
            new obsidian.Setting(contentEl)
                .setName('分组名称')
                .addText(text => text
                .setValue(this.config.name)
                .setPlaceholder('我的分组')
                .onChange(value => this.config.name = value));
            // 描述
            new obsidian.Setting(contentEl)
                .setName('描述')
                .setDesc('分组的用途说明')
                .addText(text => text
                .setValue(this.config.description || '')
                .setPlaceholder('用于...')
                .onChange(value => this.config.description = value));
            // 启用开关
            new obsidian.Setting(contentEl)
                .setName('启用此分组')
                .addToggle(toggle => toggle
                .setValue(this.config.enabled)
                .onChange(value => this.config.enabled = value));
            // AI配置部分 - 简化为服务选择
            // 创建 AI 配置头部容器（标题和模式选择在同一行）
            const aiConfigHeader = contentEl.createDiv({ cls: 'ai-config-header' });
            aiConfigHeader.createEl('h3', { text: 'AI 服务' });
            // AI处理模式选择（内联）
            const modeSelect = aiConfigHeader.createEl('select', { cls: 'ai-mode-select' });
            modeSelect.createEl('option', { value: 'two-stage' }).setText('分阶段（分析 + 聚合）');
            modeSelect.createEl('option', { value: 'single' }).setText('整体处理');
            modeSelect.value = ((_a = this.config.ai_config) === null || _a === void 0 ? void 0 : _a.mode) || 'two-stage';
            modeSelect.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                if (this.config.ai_config) {
                    this.config.ai_config.mode = modeSelect.value;
                }
                // 局部重绘服务选择器
                yield this.renderAIServiceSelection(serviceContainer, this.config);
            }));
            // 服务选择器容器
            const serviceContainer = contentEl.createDiv({ cls: 'ai-service-selection' });
            // 加载AI服务列表并渲染选择器（等待异步完成）
            yield this.renderAIServiceSelection(serviceContainer, this.config);
            // 数据源部分
            // 创建数据源头部容器（标题和添加按钮在同一行）
            const dataSourceHeader = contentEl.createDiv({ cls: 'data-source-header' });
            dataSourceHeader.createEl('h3', { text: '数据源' });
            // 添加数据源按钮
            const addSourceBtn = new obsidian.ButtonComponent(dataSourceHeader);
            addSourceBtn
                .setButtonText('+ 添加数据源')
                .setCta()
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                new UnifiedSourceModal(this.app, this.plugin, this.config, (resultSource) => {
                    // 检查是否已经在分组中
                    const exists = this.config.sources.find(s => s.id === resultSource.id);
                    if (exists) {
                        new obsidian.Notice('此数据源已在分组中');
                        return;
                    }
                    this.config.sources.push(resultSource);
                    // 只更新数据源列表部分，不重新创建整个界面
                    this.renderSourcesList();
                }).open();
            }));
            // 显示当前分组的数据源列表
            this.sourcesListContainer = contentEl.createDiv({ cls: 'group-sources-list' });
            this.renderSourcesList();
            // 保存按钮
            new obsidian.Setting(contentEl)
                .addButton(button => button
                .setButtonText('保存')
                .setCta()
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.config.id || !this.config.name) {
                    new obsidian.Notice('请填写分组ID和名称');
                    return;
                }
                // 验证ID格式
                if (!/^[a-z0-9-]+$/.test(this.config.id)) {
                    new obsidian.Notice('分组ID只能包含小写字母、数字和连字符');
                    return;
                }
                try {
                    if (this.group) {
                        yield updateSourceGroup(this.plugin.settings.apiUrl, this.config.id, this.config);
                    }
                    else {
                        yield createSourceGroup(this.plugin.settings.apiUrl, this.config);
                    }
                    this.onSave();
                    this.close();
                    new obsidian.Notice('分组保存成功');
                }
                catch (error) {
                    new obsidian.Notice('保存失败: ' + error);
                }
            })));
        });
    }
    renderAIServiceSelection(container, config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // 清空容器
            container.empty();
            try {
                console.log('[SourceGroupEditModal] 开始加载AI服务列表...');
                console.log('[SourceGroupEditModal] API URL:', this.plugin.settings.apiUrl);
                const services = yield getAIServices(this.plugin.settings.apiUrl);
                console.log('[SourceGroupEditModal] 加载到', services.length, '个AI服务');
                if (services.length === 0) {
                    const warningDiv = container.createEl('p', {
                        text: '⚠️ 还没有配置AI服务，请先在"AI 服务"Tab中添加服务。',
                        cls: 'setting-item-description'
                    });
                    return;
                }
                const mode = ((_a = config.ai_config) === null || _a === void 0 ? void 0 : _a.mode) || 'two-stage';
                console.log('[SourceGroupEditModal] 当前模式:', mode);
                if (mode === 'two-stage') {
                    // 分阶段模式 - 选择两个服务
                    new obsidian.Setting(container)
                        .setName('分析服务')
                        .addDropdown(dropdown => {
                        var _a;
                        dropdown.addOption('', '未选择');
                        services.forEach(service => {
                            dropdown.addOption(service.id, service.name);
                        });
                        dropdown.setValue(((_a = config.ai_config) === null || _a === void 0 ? void 0 : _a.analysis_service_id) || '');
                        dropdown.onChange(value => {
                            if (config.ai_config) {
                                config.ai_config.analysis_service_id = value;
                            }
                        });
                    });
                    new obsidian.Setting(container)
                        .setName('聚合服务')
                        .addDropdown(dropdown => {
                        var _a;
                        dropdown.addOption('', '未选择');
                        services.forEach(service => {
                            dropdown.addOption(service.id, service.name);
                        });
                        dropdown.setValue(((_a = config.ai_config) === null || _a === void 0 ? void 0 : _a.aggregation_service_id) || '');
                        dropdown.onChange(value => {
                            if (config.ai_config) {
                                config.ai_config.aggregation_service_id = value;
                            }
                        });
                    });
                }
                else {
                    // 单一模式 - 选择一个服务
                    new obsidian.Setting(container)
                        .setName('AI服务')
                        .addDropdown(dropdown => {
                        var _a;
                        dropdown.addOption('', '未选择');
                        services.forEach(service => {
                            dropdown.addOption(service.id, service.name);
                        });
                        dropdown.setValue(((_a = config.ai_config) === null || _a === void 0 ? void 0 : _a.analysis_service_id) || '');
                        dropdown.onChange(value => {
                            if (config.ai_config) {
                                config.ai_config.analysis_service_id = value;
                                // 清空聚合服务ID，避免混淆
                                config.ai_config.aggregation_service_id = '';
                            }
                        });
                    });
                }
            }
            catch (error) {
                console.error('[SourceGroupEditModal] 加载AI服务失败:', error);
                container.createEl('p', {
                    text: `⚠️ 无法加载AI服务列表: ${error}`,
                    cls: 'setting-item-description'
                });
            }
        });
    }
    // 局部更新数据源列表，不重新创建整个界面
    renderSourcesList() {
        if (!this.sourcesListContainer)
            return;
        this.sourcesListContainer.empty();
        if (this.config.sources.length === 0) {
            // 简单文本，无样式
            this.sourcesListContainer.createEl('div', {
                cls: 'empty-source-list',
                text: '暂无数据源'
            });
        }
        else {
            this.config.sources.forEach((source, index) => {
                const sourceItem = this.sourcesListContainer.createDiv({
                    cls: 'group-source-item'
                });
                const sourceInfo = sourceItem.createDiv({ cls: 'source-info' });
                sourceInfo.createSpan({
                    text: `${source.name} (${source.type})`,
                    cls: 'source-name'
                });
                // 移除按钮
                new obsidian.ButtonComponent(sourceItem)
                    .setIcon('x')
                    .setTooltip('移除')
                    .onClick(() => {
                    this.config.sources.splice(index, 1);
                    // 只更新数据源列表部分
                    this.renderSourcesList();
                });
            });
        }
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
// 统一数据源Modal（选择现有或创建新数据源）
class UnifiedSourceModal extends obsidian.Modal {
    constructor(app, plugin, groupConfig, onConfirm) {
        super(app);
        // State
        this.availableSources = [];
        this.selectedSourceId = null;
        this.isCreatingNew = true;
        this.newSource = {};
        this.plugin = plugin;
        this.groupConfig = groupConfig;
        this.onConfirm = onConfirm;
        this.isCreatingNew = true;
        this.initializeNewSource();
    }
    initializeNewSource() {
        this.newSource = {
            id: '',
            name: '',
            type: 'rss',
            enabled: true,
            url: '',
            username: '',
            selector: '',
            schedule: '0 * * * *',
            retention_days: 7,
            max_items: 20,
            use_proxy: false,
            extra: {}
        };
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentEl, modalEl } = this;
            contentEl.empty();
            // 添加CSS类名以应用Apple风格样式
            modalEl.addClass('mod-fresh-unified-source');
            // Fetch available sources
            try {
                const allSources = yield getSources(this.plugin.settings.apiUrl);
                // Filter out sources already in this group
                const groupSourceIds = this.groupConfig.sources.map(s => s.id);
                this.availableSources = allSources.filter(s => !groupSourceIds.includes(s.id));
            }
            catch (error) {
                console.error('Failed to fetch sources:', error);
                this.availableSources = [];
            }
            contentEl.createEl('h2', { text: '添加数据源' });
            // 模式选择：选择现有 或 创建新数据源
            new obsidian.Setting(contentEl)
                .setName('选择数据源')
                .setDesc('选择已有数据源，或选择"创建新数据源"来创建新的')
                .addDropdown(dropdown => {
                dropdown.addOption('__new__', '✨ 创建新数据源');
                this.availableSources.forEach(source => {
                    dropdown.addOption(source.id, `${source.name} (${source.type})`);
                });
                dropdown.setValue(this.isCreatingNew ? '__new__' : (this.selectedSourceId || '__new__'));
                dropdown.onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    if (value === '__new__') {
                        this.isCreatingNew = true;
                        this.selectedSourceId = null;
                    }
                    else {
                        this.isCreatingNew = false;
                        this.selectedSourceId = value;
                    }
                    this.onOpen(); // Refresh modal
                }));
            });
            if (!this.isCreatingNew && this.selectedSourceId) {
                // 显示已选数据源的信息
                const selectedSource = this.availableSources.find(s => s.id === this.selectedSourceId);
                if (selectedSource) {
                    this.renderSelectedSourceInfo(contentEl, selectedSource);
                }
            }
            else {
                // 显示创建新数据源的表单
                this.renderCreateSourceForm(contentEl);
            }
        });
    }
    renderSelectedSourceInfo(container, source) {
        var _a;
        const infoContainer = container.createDiv({ cls: 'source-info-container' });
        infoContainer.createEl('h3', { text: '数据源信息' });
        const infoTable = infoContainer.createEl('table', { cls: 'source-info-table' });
        const fields = [
            { label: '名称', value: source.name },
            { label: '类型', value: source.type },
            { label: '状态', value: source.enabled ? '启用' : '禁用' }
        ];
        if (source.type === 'rss' && source.url) {
            fields.push({ label: 'URL', value: source.url });
        }
        if (source.type === 'twitter' && source.username) {
            fields.push({ label: '用户名', value: source.username });
        }
        if (source.type === 'local' && ((_a = source.extra) === null || _a === void 0 ? void 0 : _a.path)) {
            fields.push({ label: '目录路径', value: source.extra.path });
        }
        fields.forEach(field => {
            const row = infoTable.createEl('tr');
            row.createEl('th', { text: field.label });
            row.createEl('td', { text: field.value });
        });
        // 确认按钮
        new obsidian.Setting(container)
            .addButton(button => button
            .setButtonText('确认添加')
            .setCta()
            .onClick(() => {
            this.onConfirm(source);
            this.close();
        }));
    }
    renderCreateSourceForm(container) {
        container.createEl('h3', { text: '创建新数据源' });
        new obsidian.Setting(container)
            .setName('类型')
            .addDropdown(dropdown => dropdown
            .addOption('rss', 'RSS 订阅')
            .addOption('twitter', 'Twitter/X 用户')
            .addOption('local', '本地目录')
            .setValue(this.newSource.type)
            .onChange(value => {
            this.newSource.type = value;
            this.onOpen();
        }));
        new obsidian.Setting(container)
            .setName('名称')
            .addText(text => text
            .setValue(this.newSource.name)
            .setPlaceholder('输入数据源名称')
            .onChange(value => this.newSource.name = value));
        if (this.newSource.type === 'rss') {
            new obsidian.Setting(container)
                .setName('URL')
                .addText(text => text
                .setValue(this.newSource.url)
                .setPlaceholder('https://example.com/rss')
                .onChange(value => this.newSource.url = value));
        }
        if (this.newSource.type === 'twitter') {
            new obsidian.Setting(container)
                .setName('用户名')
                .addText(text => text
                .setValue(this.newSource.username || '')
                .setPlaceholder('@username')
                .onChange(value => this.newSource.username = value));
        }
        if (this.newSource.type === 'local') {
            new obsidian.Setting(container)
                .setName('目录路径')
                .addText(text => {
                var _a;
                return text
                    .setValue(((_a = this.newSource.extra) === null || _a === void 0 ? void 0 : _a.path) || '')
                    .setPlaceholder('/path/to/directory')
                    .onChange(value => {
                    if (!this.newSource.extra)
                        this.newSource.extra = {};
                    this.newSource.extra.path = value;
                });
            });
            new obsidian.Setting(container)
                .setName('文件模式')
                .setDesc('逗号分隔的文件模式，例如: *.md, *.txt')
                .addText(text => {
                var _a, _b;
                return text
                    .setValue(((_b = (_a = this.newSource.extra) === null || _a === void 0 ? void 0 : _a.file_patterns) === null || _b === void 0 ? void 0 : _b.join(', ')) || '*.md, *.txt')
                    .onChange(value => {
                    if (!this.newSource.extra)
                        this.newSource.extra = {};
                    this.newSource.extra.file_patterns = value.split(',').map(s => s.trim());
                });
            });
            new obsidian.Setting(container)
                .setName('递归子目录')
                .addToggle(toggle => {
                var _a, _b;
                return toggle
                    .setValue((_b = (_a = this.newSource.extra) === null || _a === void 0 ? void 0 : _a.recursive) !== null && _b !== void 0 ? _b : true)
                    .onChange(value => {
                    if (!this.newSource.extra)
                        this.newSource.extra = {};
                    this.newSource.extra.recursive = value;
                });
            });
        }
        // 通用配置（所有类型共享）
        new obsidian.Setting(container)
            .setName('保留天数')
            .setDesc('保留内容的天数')
            .addText(text => text
            .setValue(String(this.newSource.retention_days || 7))
            .setPlaceholder('7')
            .onChange(value => this.newSource.retention_days = parseInt(value) || 7));
        new obsidian.Setting(container)
            .setName('最大条目数')
            .setDesc('每次抓取的最大数量')
            .addText(text => text
            .setValue(String(this.newSource.max_items || 20))
            .setPlaceholder('20')
            .onChange(value => this.newSource.max_items = parseInt(value) || 20));
        new obsidian.Setting(container)
            .setName('抓取计划')
            .setDesc('Cron 表达式（默认每小时一次）')
            .addText(text => text
            .setValue(this.newSource.schedule || '0 * * * *')
            .setPlaceholder('0 * * * *')
            .onChange(value => this.newSource.schedule = value));
        new obsidian.Setting(container)
            .setName('使用代理')
            .addToggle(toggle => toggle
            .setValue(this.newSource.use_proxy || false)
            .onChange(value => this.newSource.use_proxy = value));
        new obsidian.Setting(container)
            .setName('启用')
            .addToggle(toggle => toggle
            .setValue(this.newSource.enabled !== false)
            .onChange(value => this.newSource.enabled = value));
        // 创建按钮
        new obsidian.Setting(container)
            .addButton(button => button
            .setButtonText('创建并添加')
            .setCta()
            .onClick(() => __awaiter(this, void 0, void 0, function* () {
            if (!this.newSource.name) {
                new obsidian.Notice('请输入数据源名称');
                return;
            }
            // Generate ID
            this.newSource.id = this.newSource.type + '_' + Date.now().toString();
            try {
                // Create the source via API
                const success = yield createSource(this.plugin.settings.apiUrl, this.newSource);
                if (success) {
                    this.onConfirm(this.newSource);
                    this.close();
                    new obsidian.Notice(`已创建并添加 ${this.newSource.name} 到分组`);
                }
                else {
                    new obsidian.Notice('创建失败，请重试');
                }
            }
            catch (error) {
                new obsidian.Notice('创建失败: ' + error);
            }
        })));
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = TrendRadarPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImFwaS50cyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvbGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zY2hlZHVsZXIuanMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL3RyYW5zaXRpb25zLmpzIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9lYWNoLmpzIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9Db21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9zaGFyZWQvdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvZGlzY2xvc2UtdmVyc2lvbi9pbmRleC5qcyIsIlRoZW1lTGlzdC5zdmVsdGUiLCJUaGVtZURldGFpbC5zdmVsdGUiLCJmb3JtYXR0ZXIudHMiLCJUaGVtZURldGFpbE1vZGFsLnRzIiwiRXJyb3JMaXN0TW9kYWwudHMiLCJ2aWV3LnRzIiwibWFpbi50cyJdLCJuYW1lcyI6WyJOb3RpY2UiLCJjcmVhdGVfaWZfYmxvY2tfNyIsImNyZWF0ZV9pZl9ibG9ja18zIiwiY3JlYXRlX2lmX2Jsb2NrXzUiLCJjcmVhdGVfaWZfYmxvY2tfNCIsImNyZWF0ZV9pZl9ibG9ja18yIiwiY3JlYXRlX2lmX2Jsb2NrXzEiLCJjcmVhdGVfaWZfYmxvY2siLCJNb2RhbCIsIlRoZW1lRGV0YWlsQ29tcG9uZW50IiwiSXRlbVZpZXciLCJQbHVnaW4iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIkJ1dHRvbkNvbXBvbmVudCIsIlRvZ2dsZUNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBa0dBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxH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Q25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sS0FBSyxLQUFLO0FBQ3pDLGFBQUEsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQzs7UUFHckQsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO0FBQ25CLGFBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTthQUNuQixhQUFhLENBQUMsT0FBTztBQUNyQixhQUFBLE1BQU07YUFDTixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtBQUNuQixZQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUN6QixnQkFBQSxJQUFJYixlQUFNLENBQUMsVUFBVSxDQUFDO2dCQUN0QjtZQUNEOztZQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO0FBRXJFLFlBQUEsSUFBSTs7QUFFSCxnQkFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQTRCLENBQUM7Z0JBQ2xHLElBQUksT0FBTyxFQUFFO0FBQ1osb0JBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBNEIsQ0FBQztvQkFDakQsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDWixJQUFJQSxlQUFNLENBQUMsQ0FBQSxPQUFBLEVBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUEsSUFBQSxDQUFNLENBQUM7Z0JBQ2hEO3FCQUFPO0FBQ04sb0JBQUEsSUFBSUEsZUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDdkI7WUFDRDtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2YsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDN0I7UUFDRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ047SUFFQSxPQUFPLEdBQUE7QUFDTixRQUFBLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJO1FBQzFCLFNBQVMsQ0FBQyxLQUFLLEVBQUU7SUFDbEI7QUFDQTs7OzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwyLDMsNCw1LDYsNyw4LDksMTBdfQ==
