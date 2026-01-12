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
 * 触发立即抓取任务（返回完整结果）
 */
function triggerFetchWithResult(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiUrl)
            return { success: false, message: 'API URL not configured' };
        const result = yield apiRequest(`${apiUrl}/api/tasks/fetch`, 'POST');
        return result || { success: false, message: 'Request failed' };
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
    triggerFetchWithResult: triggerFetchWithResult,
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
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
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
function create_else_block_1(ctx) {
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
		return create_else_block_1;
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
	append_styles(target, "svelte-1hhql91", ".trendradar-theme-detail-container.svelte-1hhql91.svelte-1hhql91{padding:0 var(--size-4-2);max-height:70vh;overflow-y:auto}.header.svelte-1hhql91.svelte-1hhql91{margin-bottom:var(--size-4-4);padding-bottom:var(--size-4-4);border-bottom:2px solid var(--background-modifier-border)}.link-summary-header.svelte-1hhql91.svelte-1hhql91{border-bottom:none;padding-bottom:0}.header-top.svelte-1hhql91.svelte-1hhql91{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--size-4-3);flex-wrap:wrap;gap:var(--size-4-2)}.meta-left.svelte-1hhql91.svelte-1hhql91{display:flex;align-items:center;gap:var(--size-4-2)}.category.svelte-1hhql91.svelte-1hhql91{background-color:var(--interactive-accent);color:var(--text-on-accent);padding:4px 12px;border-radius:var(--radius-m);font-weight:600;font-size:var(--font-ui-small)}.status-badge.svelte-1hhql91.svelte-1hhql91{padding:2px 8px;border-radius:var(--radius-s);font-size:var(--font-ui-smaller)}.status-badge.archived.svelte-1hhql91.svelte-1hhql91{background-color:var(--text-faint);color:var(--background-primary)}.status-badge.read.svelte-1hhql91.svelte-1hhql91{background-color:var(--background-modifier-border);color:var(--text-muted)}.action-buttons.svelte-1hhql91.svelte-1hhql91{display:flex;gap:var(--size-4-2)}.action-btn.svelte-1hhql91.svelte-1hhql91{padding:6px 12px;border-radius:var(--radius-s);border:1px solid var(--background-modifier-border);background-color:var(--background-secondary);cursor:pointer;font-size:var(--font-ui-small);transition:all 0.15s}.action-btn.svelte-1hhql91.svelte-1hhql91:hover{background-color:var(--background-secondary-alt)}.action-btn.export.svelte-1hhql91.svelte-1hhql91{border-color:var(--interactive-accent);color:var(--interactive-accent)}.action-btn.delete.svelte-1hhql91.svelte-1hhql91:hover{background-color:rgba(255, 100, 100, 0.2);border-color:var(--color-red)}.metrics.svelte-1hhql91.svelte-1hhql91{display:flex;gap:var(--size-4-4);margin-bottom:var(--size-4-3);flex-wrap:wrap}.metric.svelte-1hhql91.svelte-1hhql91{display:flex;flex-direction:column;gap:2px}.metric-label.svelte-1hhql91.svelte-1hhql91{font-size:var(--font-ui-smaller);color:var(--text-faint)}.metric-value.svelte-1hhql91.svelte-1hhql91{font-weight:600;font-size:var(--font-ui-small)}.metric-value.importance.svelte-1hhql91.svelte-1hhql91{color:var(--color-red)}.metric-value.impact.svelte-1hhql91.svelte-1hhql91{color:var(--color-orange)}.tags.svelte-1hhql91.svelte-1hhql91{display:flex;flex-wrap:wrap;gap:var(--size-4-2)}.tag.svelte-1hhql91.svelte-1hhql91{background-color:var(--background-modifier-border);color:var(--text-muted);padding:3px 10px;border-radius:var(--radius-m);font-size:var(--font-ui-smaller)}.section.svelte-1hhql91.svelte-1hhql91{margin-bottom:var(--size-4-4)}.section.svelte-1hhql91 h2.svelte-1hhql91{font-size:var(--font-ui-medium);font-weight:600;margin-bottom:var(--size-4-3);padding-bottom:var(--size-4-2);border-bottom:1px solid var(--background-modifier-border);color:var(--text-normal)}.summary-text.svelte-1hhql91.svelte-1hhql91{line-height:1.7;color:var(--text-normal);background-color:var(--background-secondary);padding:var(--size-4-3);border-radius:var(--radius-m);border-left:3px solid var(--interactive-accent)}.key-points.svelte-1hhql91.svelte-1hhql91{list-style:none;padding:0;margin:0}.key-points.svelte-1hhql91 li.svelte-1hhql91{position:relative;padding-left:var(--size-4-4);margin-bottom:var(--size-4-2);line-height:1.6}.key-points.svelte-1hhql91 li.svelte-1hhql91::before{content:\"•\";position:absolute;left:0;color:var(--interactive-accent);font-weight:bold}.articles-list.svelte-1hhql91.svelte-1hhql91{display:flex;flex-direction:column;gap:var(--size-4-3);max-height:300px;overflow-y:auto;padding-right:var(--size-4-2)}.link-summary-list.svelte-1hhql91.svelte-1hhql91{gap:var(--size-4-2);max-height:400px}.article-item.svelte-1hhql91.svelte-1hhql91{padding:var(--size-4-3);border-radius:var(--radius-m);background-color:var(--background-secondary);border:1px solid var(--background-modifier-border);transition:all 0.15s}.article-item.svelte-1hhql91.svelte-1hhql91:hover{border-color:var(--background-modifier-border-hover);background-color:var(--background-secondary-alt)}.article-header.svelte-1hhql91.svelte-1hhql91{display:flex;align-items:flex-start;gap:var(--size-4-2)}.article-title.svelte-1hhql91.svelte-1hhql91{font-weight:500;text-decoration:none;color:var(--text-normal);flex:1;line-height:1.4}.article-title.svelte-1hhql91.svelte-1hhql91:hover{color:var(--interactive-accent);text-decoration:underline}.external-link.svelte-1hhql91.svelte-1hhql91{color:var(--text-faint);font-size:12px}.article-meta.svelte-1hhql91.svelte-1hhql91{font-size:var(--font-ui-smaller);color:var(--text-muted);margin-top:var(--size-4-2);display:flex;flex-wrap:wrap;gap:var(--size-4-3)}.article-summary.svelte-1hhql91.svelte-1hhql91{font-size:var(--font-ui-small);color:var(--text-muted);margin-top:var(--size-4-2);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}");
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

// (45:8) {#if !isLinkSummary}
function create_if_block_12(ctx) {
	let span;
	let t_value = /*theme*/ ctx[0].category + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "category svelte-1hhql91");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t_value !== (t_value = /*theme*/ ctx[0].category + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (50:42) 
function create_if_block_11(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "已读";
			attr(span, "class", "status-badge read svelte-1hhql91");
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

// (48:8) {#if theme.status === 'archived'}
function create_if_block_10(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "已归档";
			attr(span, "class", "status-badge archived svelte-1hhql91");
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

// (55:8) {#if !isLinkSummary}
function create_if_block_9(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "📝 导出笔记";
			attr(button, "class", "action-btn export svelte-1hhql91");
			attr(button, "title", "导出为笔记");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*handleExport*/ ctx[4]);
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

// (60:8) {#if theme.status !== 'archived'}
function create_if_block_8(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "📥 归档";
			attr(button, "class", "action-btn archive svelte-1hhql91");
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

// (72:4) {#if !isLinkSummary}
function create_if_block_7(ctx) {
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
			attr(span0, "class", "metric-label svelte-1hhql91");
			attr(span1, "class", "metric-value importance svelte-1hhql91");
			attr(div0, "class", "metric svelte-1hhql91");
			attr(span2, "class", "metric-label svelte-1hhql91");
			attr(span3, "class", "metric-value impact svelte-1hhql91");
			attr(div1, "class", "metric svelte-1hhql91");
			attr(span4, "class", "metric-label svelte-1hhql91");
			attr(span5, "class", "metric-value svelte-1hhql91");
			attr(div2, "class", "metric svelte-1hhql91");
			attr(div3, "class", "metrics svelte-1hhql91");
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

// (90:4) {#if !isLinkSummary && tags.length > 0}
function create_if_block_6(ctx) {
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

			attr(div, "class", "tags svelte-1hhql91");
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

// (92:8) {#each tags as tag}
function create_each_block_2(ctx) {
	let span;
	let t_value = /*tag*/ ctx[15] + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "tag svelte-1hhql91");
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

// (100:2) {#if !isLinkSummary}
function create_if_block_5(ctx) {
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
			attr(h2, "class", "svelte-1hhql91");
			attr(p, "class", "summary-text svelte-1hhql91");
			attr(div, "class", "section summary-section svelte-1hhql91");
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

// (108:2) {#if !isLinkSummary && keyPoints.length > 0}
function create_if_block_4(ctx) {
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

			attr(h2, "class", "svelte-1hhql91");
			attr(ul, "class", "key-points svelte-1hhql91");
			attr(div, "class", "section svelte-1hhql91");
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

// (112:8) {#each keyPoints as point}
function create_each_block_1(ctx) {
	let li;
	let t_value = /*point*/ ctx[12] + "";
	let t;

	return {
		c() {
			li = element("li");
			t = text(t_value);
			attr(li, "class", "svelte-1hhql91");
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

// (121:4) {#if !isLinkSummary}
function create_if_block_3(ctx) {
	let h2;
	let t0;
	let t1_value = /*theme*/ ctx[0].articles.length + "";
	let t1;
	let t2;

	return {
		c() {
			h2 = element("h2");
			t0 = text("📰 信息来源 (");
			t1 = text(t1_value);
			t2 = text(")");
			attr(h2, "class", "svelte-1hhql91");
		},
		m(target, anchor) {
			insert(target, h2, anchor);
			append(h2, t0);
			append(h2, t1);
			append(h2, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*theme*/ 1 && t1_value !== (t1_value = /*theme*/ ctx[0].articles.length + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(h2);
			}
		}
	};
}

// (137:14) {:else}
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

// (135:14) {#if article.source_name}
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

// (142:14) {#if article.author}
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

// (156:10) {#if !isLinkSummary && article.summary}
function create_if_block(ctx) {
	let p;
	let t_value = /*article*/ ctx[9].summary + "";
	let t;

	return {
		c() {
			p = element("p");
			t = text(t_value);
			attr(p, "class", "article-summary svelte-1hhql91");
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

// (125:6) {#each theme.articles as article}
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

	function select_block_type_1(ctx, dirty) {
		if (/*article*/ ctx[9].source_name) return create_if_block_2;
		return create_else_block;
	}

	let current_block_type = select_block_type_1(ctx);
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
			attr(a, "class", "article-title svelte-1hhql91");
			attr(span0, "class", "external-link svelte-1hhql91");
			attr(div0, "class", "article-header svelte-1hhql91");
			attr(span1, "class", "source");
			attr(span2, "class", "author");
			attr(span3, "class", "time");
			attr(div1, "class", "article-meta svelte-1hhql91");
			attr(div2, "class", "article-item svelte-1hhql91");
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

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
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
	let t0;
	let t1;
	let div1;
	let t2;
	let t3;
	let button;
	let t5;
	let t6;
	let t7;
	let t8;
	let t9;
	let div5;
	let t10;
	let div4;
	let mounted;
	let dispose;
	let if_block0 = !/*isLinkSummary*/ ctx[1] && create_if_block_12(ctx);

	function select_block_type(ctx, dirty) {
		if (/*theme*/ ctx[0].status === 'archived') return create_if_block_10;
		if (/*theme*/ ctx[0].status === 'read') return create_if_block_11;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type && current_block_type(ctx);
	let if_block2 = !/*isLinkSummary*/ ctx[1] && create_if_block_9(ctx);
	let if_block3 = /*theme*/ ctx[0].status !== 'archived' && create_if_block_8(ctx);
	let if_block4 = !/*isLinkSummary*/ ctx[1] && create_if_block_7(ctx);
	let if_block5 = !/*isLinkSummary*/ ctx[1] && /*tags*/ ctx[3].length > 0 && create_if_block_6(ctx);
	let if_block6 = !/*isLinkSummary*/ ctx[1] && create_if_block_5(ctx);
	let if_block7 = !/*isLinkSummary*/ ctx[1] && /*keyPoints*/ ctx[2].length > 0 && create_if_block_4(ctx);
	let if_block8 = !/*isLinkSummary*/ ctx[1] && create_if_block_3(ctx);
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
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			div1 = element("div");
			if (if_block2) if_block2.c();
			t2 = space();
			if (if_block3) if_block3.c();
			t3 = space();
			button = element("button");
			button.textContent = "🗑 删除";
			t5 = space();
			if (if_block4) if_block4.c();
			t6 = space();
			if (if_block5) if_block5.c();
			t7 = space();
			if (if_block6) if_block6.c();
			t8 = space();
			if (if_block7) if_block7.c();
			t9 = space();
			div5 = element("div");
			if (if_block8) if_block8.c();
			t10 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "meta-left svelte-1hhql91");
			attr(button, "class", "action-btn delete svelte-1hhql91");
			attr(button, "title", "删除");
			attr(div1, "class", "action-buttons svelte-1hhql91");
			attr(div2, "class", "header-top svelte-1hhql91");
			attr(div3, "class", "header svelte-1hhql91");
			toggle_class(div3, "link-summary-header", /*isLinkSummary*/ ctx[1]);
			attr(div4, "class", "articles-list svelte-1hhql91");
			toggle_class(div4, "link-summary-list", /*isLinkSummary*/ ctx[1]);
			attr(div5, "class", "section svelte-1hhql91");
			attr(div6, "class", "trendradar-theme-detail-container svelte-1hhql91");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div3);
			append(div3, div2);
			append(div2, div0);
			if (if_block0) if_block0.m(div0, null);
			append(div0, t0);
			if (if_block1) if_block1.m(div0, null);
			append(div2, t1);
			append(div2, div1);
			if (if_block2) if_block2.m(div1, null);
			append(div1, t2);
			if (if_block3) if_block3.m(div1, null);
			append(div1, t3);
			append(div1, button);
			append(div3, t5);
			if (if_block4) if_block4.m(div3, null);
			append(div3, t6);
			if (if_block5) if_block5.m(div3, null);
			append(div6, t7);
			if (if_block6) if_block6.m(div6, null);
			append(div6, t8);
			if (if_block7) if_block7.m(div6, null);
			append(div6, t9);
			append(div6, div5);
			if (if_block8) if_block8.m(div5, null);
			append(div5, t10);
			append(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			if (!mounted) {
				dispose = listen(button, "click", /*handleDelete*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (!/*isLinkSummary*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_12(ctx);
					if_block0.c();
					if_block0.m(div0, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if (if_block1) if_block1.d(1);
				if_block1 = current_block_type && current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div0, null);
				}
			}

			if (!/*isLinkSummary*/ ctx[1]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_9(ctx);
					if_block2.c();
					if_block2.m(div1, t2);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*theme*/ ctx[0].status !== 'archived') {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_8(ctx);
					if_block3.c();
					if_block3.m(div1, t3);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (!/*isLinkSummary*/ ctx[1]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block_7(ctx);
					if_block4.c();
					if_block4.m(div3, t6);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (!/*isLinkSummary*/ ctx[1] && /*tags*/ ctx[3].length > 0) {
				if (if_block5) {
					if_block5.p(ctx, dirty);
				} else {
					if_block5 = create_if_block_6(ctx);
					if_block5.c();
					if_block5.m(div3, null);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (dirty & /*isLinkSummary*/ 2) {
				toggle_class(div3, "link-summary-header", /*isLinkSummary*/ ctx[1]);
			}

			if (!/*isLinkSummary*/ ctx[1]) {
				if (if_block6) {
					if_block6.p(ctx, dirty);
				} else {
					if_block6 = create_if_block_5(ctx);
					if_block6.c();
					if_block6.m(div6, t8);
				}
			} else if (if_block6) {
				if_block6.d(1);
				if_block6 = null;
			}

			if (!/*isLinkSummary*/ ctx[1] && /*keyPoints*/ ctx[2].length > 0) {
				if (if_block7) {
					if_block7.p(ctx, dirty);
				} else {
					if_block7 = create_if_block_4(ctx);
					if_block7.c();
					if_block7.m(div6, t9);
				}
			} else if (if_block7) {
				if_block7.d(1);
				if_block7 = null;
			}

			if (!/*isLinkSummary*/ ctx[1]) {
				if (if_block8) {
					if_block8.p(ctx, dirty);
				} else {
					if_block8 = create_if_block_3(ctx);
					if_block8.c();
					if_block8.m(div5, t10);
				}
			} else if (if_block8) {
				if_block8.d(1);
				if_block8 = null;
			}

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

			if (dirty & /*isLinkSummary*/ 2) {
				toggle_class(div4, "link-summary-list", /*isLinkSummary*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div6);
			}

			if (if_block0) if_block0.d();

			if (if_block1) {
				if_block1.d();
			}

			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			if (if_block5) if_block5.d();
			if (if_block6) if_block6.d();
			if (if_block7) if_block7.d();
			if (if_block8) if_block8.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
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
        this.fetchStatusIntervalIds = [];
        this.plugin = plugin;
    }
    hide() {
        // 清理所有定时器
        this.fetchStatusIntervalIds.forEach(id => clearInterval(id));
        this.fetchStatusIntervalIds = [];
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
        // 存储定时器ID以便清理
        if (!this.fetchStatusIntervalIds) {
            this.fetchStatusIntervalIds = [];
        }
        new obsidian.Setting(container)
            .setName('立即抓取')
            .setDesc('手动触发一次完整的数据抓取和分析任务（后台运行）')
            .addButton(button => {
            const updateButtonState = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const status = yield getFetchStatus(this.plugin.settings.apiUrl);
                    if (status && status.status === 'running') {
                        button.setButtonText('⏳ 抓取中...').setDisabled(true);
                    }
                    else {
                        button.setButtonText('🚀 开始抓取').setDisabled(false);
                    }
                }
                catch (error) {
                    // 忽略错误，保持默认状态
                }
            });
            button.setButtonText('🚀 开始抓取')
                .setCta()
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                // 首先检查当前状态
                try {
                    const status = yield getFetchStatus(this.plugin.settings.apiUrl);
                    // 如果正在运行，提示用户
                    if (status && status.status === 'running') {
                        new obsidian.Notice('⏳ 抓取任务正在运行中，请稍后再试');
                        return;
                    }
                }
                catch (error) {
                    console.error('检查状态失败:', error);
                }
                // 触发抓取任务
                try {
                    const result = yield triggerFetchWithResult(this.plugin.settings.apiUrl);
                    if (result.success) {
                        new obsidian.Notice('✅ 抓取任务已在后台启动，请稍后刷新查看结果');
                        // 立即更新按钮状态
                        updateButtonState();
                    }
                    else if (result.message === 'Fetch task already running') {
                        new obsidian.Notice('⏳ 抓取任务正在运行中，请勿重复触发');
                        updateButtonState();
                    }
                    else {
                        new obsidian.Notice('❌ 触发失败: ' + result.message);
                    }
                }
                catch (error) {
                    new obsidian.Notice('❌ 触发失败: ' + error);
                }
            }));
            // 初始检查
            updateButtonState();
            // 每5秒检查一次状态
            const intervalId = setInterval(updateButtonState, 5000);
            this.fetchStatusIntervalIds.push(intervalId);
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImFwaS50cyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvbGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zY2hlZHVsZXIuanMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL3RyYW5zaXRpb25zLmpzIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9lYWNoLmpzIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9Db21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9zaGFyZWQvdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvZGlzY2xvc2UtdmVyc2lvbi9pbmRleC5qcyIsIlRoZW1lTGlzdC5zdmVsdGUiLCJUaGVtZURldGFpbC5zdmVsdGUiLCJmb3JtYXR0ZXIudHMiLCJUaGVtZURldGFpbE1vZGFsLnRzIiwiRXJyb3JMaXN0TW9kYWwudHMiLCJ2aWV3LnRzIiwibWFpbi50cyJdLCJuYW1lcyI6WyJOb3RpY2UiLCJjcmVhdGVfaWZfYmxvY2tfNyIsImNyZWF0ZV9pZl9ibG9ja18zIiwiY3JlYXRlX2lmX2Jsb2NrXzUiLCJjcmVhdGVfaWZfYmxvY2tfNCIsImNyZWF0ZV9pZl9ibG9ja18yIiwiY3JlYXRlX2lmX2Jsb2NrXzEiLCJjcmVhdGVfaWZfYmxvY2siLCJNb2RhbCIsIlRoZW1lRGV0YWlsQ29tcG9uZW50IiwiSXRlbVZpZXciLCJQbHVnaW4iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIkJ1dHRvbkNvbXBvbmVudCIsIlRvZ2dsZUNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBa0dBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTZNRDtBQUN1QixPQUFPLGVBQWUsS0FBSyxVQUFVLEdBQUcsZUFBZSxHQUFHLFVBQVUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDdkgsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDckY7O0FDM09BO0FBQ0E7QUFDQTtBQUVBOztBQUVHO0FBQ0csU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBQTs7QUFDOUMsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxFQUFFO1FBRXRCLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFjLENBQUEsRUFBRyxNQUFNLENBQUEsZ0JBQUEsQ0FBa0IsQ0FBQztBQUN6RSxRQUFBLE9BQU8sTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLGNBQU4sTUFBTSxHQUFJLEVBQUU7SUFDdkIsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztBQUNHLFNBQWdCLFlBQVksQ0FBQyxNQUFjLEVBQUUsU0FBaUIsRUFBQTs7QUFDaEUsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxJQUFJO1FBRXhCLE9BQU8sVUFBVSxDQUFZLENBQUEsRUFBRyxNQUFNLG9CQUFvQixTQUFTLENBQUEsQ0FBRSxDQUFDO0lBQzFFLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixlQUFlLENBQUMsTUFBYyxFQUFFLE9BQWtCLEVBQUE7O0FBQ3BFLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sSUFBSTtRQUV4QixPQUFPLFVBQVUsQ0FBWSxDQUFBLEVBQUcsTUFBTSxDQUFBLGdCQUFBLENBQWtCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztJQUM5RSxDQUFDLENBQUE7QUFBQTtBQUVEOztBQUVHO1NBQ21CLGVBQWUsQ0FBQyxNQUFjLEVBQUUsU0FBaUIsRUFBRSxPQUFrQixFQUFBOztBQUN2RixRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLElBQUk7QUFFeEIsUUFBQSxPQUFPLFVBQVUsQ0FBWSxDQUFBLEVBQUcsTUFBTSxDQUFBLGlCQUFBLEVBQW9CLFNBQVMsQ0FBQSxDQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQztJQUMxRixDQUFDLENBQUE7QUFBQTtBQUVEOztBQUVHO0FBQ0csU0FBZ0IsZUFBZSxDQUFDLE1BQWMsRUFBRSxTQUFpQixFQUFBOzs7QUFDbkUsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxLQUFLO0FBRXpCLFFBQUEsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQXVCLENBQUEsRUFBRyxNQUFNLENBQUEsaUJBQUEsRUFBb0IsU0FBUyxDQUFBLENBQUUsRUFBRSxRQUFRLENBQUM7UUFDekcsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFpREQ7O0FBRUc7QUFDRyxTQUFnQixlQUFlLENBQUMsTUFBYyxFQUFBOzs7QUFDaEQsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxFQUFFO1FBRXRCLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixDQUFBLEVBQUcsTUFBTSxDQUFBLGtCQUFBLENBQW9CLENBQUM7UUFDcEYsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxNQUFNLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEVBQUU7SUFDL0IsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztBQUNHLFNBQWdCLGNBQWMsQ0FBQyxNQUFjLEVBQUUsT0FBZSxFQUFBOztBQUNoRSxRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLElBQUk7UUFFeEIsT0FBTyxVQUFVLENBQW1CLENBQUEsRUFBRyxNQUFNLHNCQUFzQixPQUFPLENBQUEsQ0FBRSxDQUFDO0lBQ2pGLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsS0FBdUIsRUFBQTs7O0FBQzNFLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sS0FBSztBQUV6QixRQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixDQUFBLEVBQUcsTUFBTSxDQUFBLGtCQUFBLENBQW9CLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQztRQUNuRyxPQUFPLENBQUEsRUFBQSxHQUFBLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLE1BQUEsR0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFFLE9BQU8sTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsR0FBQSxFQUFBLEdBQUksS0FBSztJQUNuQyxDQUFDLENBQUE7QUFBQTtBQUVEOztBQUVHO1NBQ21CLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUUsS0FBdUIsRUFBQTs7O0FBQzVGLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sS0FBSztBQUV6QixRQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixDQUFBLEVBQUcsTUFBTSxDQUFBLG1CQUFBLEVBQXNCLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDN0csT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztBQUNHLFNBQWdCLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUE7OztBQUNuRSxRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEtBQUs7QUFFekIsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxtQkFBQSxFQUFzQixPQUFPLENBQUEsQ0FBRSxFQUFFLFFBQVEsQ0FBQztRQUN6RyxPQUFPLENBQUEsRUFBQSxHQUFBLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLE1BQUEsR0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFFLE9BQU8sTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsR0FBQSxFQUFBLEdBQUksS0FBSztJQUNuQyxDQUFDLENBQUE7QUFBQTtBQUdEO0FBRUEsU0FBZSxVQUFVLENBQUEsS0FBQSxFQUFBO0FBQUksSUFBQSxPQUFBLFNBQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsRUFBQSxXQUFBLEdBQVcsRUFBRSxNQUFBLEdBQWlCLEtBQUssRUFBRSxJQUFVLEVBQUE7QUFDeEUsUUFBQSxJQUFJO0FBQ0EsWUFBQSxNQUFNLE9BQU8sR0FBZ0I7Z0JBQ3pCLE1BQU07QUFDTixnQkFBQSxPQUFPLEVBQUU7QUFDTCxvQkFBQSxRQUFRLEVBQUUsa0JBQWtCO0FBQzVCLG9CQUFBLGNBQWMsRUFBRTtBQUNuQjthQUNKO1lBRUQsSUFBSSxJQUFJLEVBQUU7Z0JBQ04sT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUN2QztZQUVBLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7QUFFMUMsWUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNkLGdCQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQSxLQUFBLEVBQVEsUUFBUSxDQUFDLE1BQU0sQ0FBQSxFQUFBLEVBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQSxDQUFFLENBQUM7WUFDdEU7QUFFQSxZQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRTtBQUNwQyxZQUFBLE9BQU8sTUFBVztRQUN0QjtRQUFFLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBLHNCQUFBLEVBQXlCLE1BQU0sQ0FBQSxDQUFBLEVBQUksR0FBRyxDQUFBLEVBQUEsQ0FBSSxFQUFFLEtBQUssQ0FBQztBQUNoRSxZQUFBLE9BQU8sSUFBSTtRQUNmO0lBQ0osQ0FBQyxDQUFBO0FBQUE7QUFHRDtBQUNBO0FBQ0E7QUFFQTs7QUFFRztTQUNtQixTQUFTLENBQUMsTUFBYyxFQUFFLElBQWEsRUFBRSxNQUFlLEVBQUE7O1FBQzFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDVCxZQUFBLElBQUlBLGVBQU0sQ0FBQyx1Q0FBdUMsQ0FBQztBQUNuRCxZQUFBLE9BQU8sSUFBSTtRQUNmO1FBRUEsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxXQUFBLENBQWEsQ0FBQztBQUMzQyxRQUFBLElBQUksSUFBSTtZQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7QUFDL0MsUUFBQSxJQUFJLE1BQU07WUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO0FBRXJELFFBQUEsT0FBTyxVQUFVLENBQWlCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyRCxDQUFDLENBQUE7QUFBQTtBQUVEOztBQUVHO1NBQ21CLGVBQWUsQ0FBQyxNQUFjLEVBQUUsT0FBZSxFQUFFLElBQWEsRUFBQTs7UUFDaEYsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNULFlBQUEsSUFBSUEsZUFBTSxDQUFDLHVDQUF1QyxDQUFDO0FBQ25ELFlBQUEsT0FBTyxJQUFJO1FBQ2Y7UUFFQSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBLEVBQUcsTUFBTSxDQUFBLFlBQUEsRUFBZSxPQUFPLENBQUEsQ0FBRSxDQUFDO0FBQ3RELFFBQUEsSUFBSSxJQUFJO1lBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztBQUUvQyxRQUFBLE9BQU8sVUFBVSxDQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsRCxDQUFDLENBQUE7QUFBQTtBQUVEOztBQUVHO0FBQ0csU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLE9BQWUsRUFBRSxNQUFjLEVBQUUsSUFBYSxFQUFBOzs7QUFDbEcsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxLQUFLO1FBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUEsRUFBRyxNQUFNLENBQUEsWUFBQSxFQUFlLE9BQU8sQ0FBQSxPQUFBLENBQVMsQ0FBQztBQUM3RCxRQUFBLElBQUksSUFBSTtZQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7QUFFL0MsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ3hGLE9BQU8sQ0FBQSxFQUFBLEdBQUEsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBTixNQUFNLENBQUUsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxLQUFLO0lBQ25DLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7U0FDbUIsV0FBVyxDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUUsSUFBYSxFQUFBOzs7QUFDNUUsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxLQUFLO1FBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUEsRUFBRyxNQUFNLENBQUEsWUFBQSxFQUFlLE9BQU8sQ0FBQSxDQUFFLENBQUM7QUFDdEQsUUFBQSxJQUFJLElBQUk7WUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0FBRS9DLFFBQUEsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQXVCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLENBQUM7UUFDL0UsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFHRDtBQUNBO0FBQ0E7QUFFQTs7QUFFRztBQUNHLFNBQWdCLFVBQVUsQ0FBQyxNQUFjLEVBQUE7O0FBQzNDLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sRUFBRTtRQUV0QixNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBaUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxZQUFBLENBQWMsQ0FBQztBQUN4RSxRQUFBLE9BQU8sTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLGNBQU4sTUFBTSxHQUFJLEVBQUU7SUFDdkIsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztBQUNHLFNBQWdCLFNBQVMsQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBQTs7QUFDNUQsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxJQUFJO1FBRXhCLE9BQU8sVUFBVSxDQUFlLENBQUEsRUFBRyxNQUFNLGdCQUFnQixRQUFRLENBQUEsQ0FBRSxDQUFDO0lBQ3hFLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixZQUFZLENBQUMsTUFBYyxFQUFFLE1BQW9CLEVBQUE7OztBQUNuRSxRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEtBQUs7QUFFekIsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxZQUFBLENBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBQzlGLE9BQU8sQ0FBQSxFQUFBLEdBQUEsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBTixNQUFNLENBQUUsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxLQUFLO0lBQ25DLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7U0FDbUIsWUFBWSxDQUFDLE1BQWMsRUFBRSxRQUFnQixFQUFFLE1BQW9CLEVBQUE7OztBQUNyRixRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEtBQUs7QUFFekIsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxhQUFBLEVBQWdCLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7UUFDekcsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztBQUNHLFNBQWdCLFlBQVksQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBQTs7O0FBQy9ELFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sS0FBSztBQUV6QixRQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixDQUFBLEVBQUcsTUFBTSxDQUFBLGFBQUEsRUFBZ0IsUUFBUSxDQUFBLENBQUUsRUFBRSxRQUFRLENBQUM7UUFDcEcsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztTQUNtQixZQUFZLENBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUUsT0FBZ0IsRUFBQTs7O0FBQ2pGLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sS0FBSztBQUV6QixRQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixHQUFHLE1BQU0sQ0FBQSxhQUFBLEVBQWdCLFFBQVEsQ0FBQSxPQUFBLENBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQztRQUNySCxPQUFPLENBQUEsRUFBQSxHQUFBLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLE1BQUEsR0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFFLE9BQU8sTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsR0FBQSxFQUFBLEdBQUksS0FBSztJQUNuQyxDQUFDLENBQUE7QUFBQTtBQUdEO0FBQ0E7QUFDQTtBQUVBOztBQUVHO0FBQ0csU0FBZ0IsZUFBZSxDQUFDLE1BQWMsRUFBQTs7UUFDaEQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNULE9BQU87QUFDSCxnQkFBQSxpQkFBaUIsRUFBRSxFQUFFO0FBQ3JCLGdCQUFBLGtCQUFrQixFQUFFLEVBQUU7QUFDdEIsZ0JBQUEsZ0JBQWdCLEVBQUUsRUFBRTtBQUNwQixnQkFBQSxrQkFBa0IsRUFBRSxHQUFHO0FBQ3ZCLGdCQUFBLGNBQWMsRUFBRSxDQUFDO0FBQ2pCLGdCQUFBLG1CQUFtQixFQUFFO2FBQ3hCO1FBQ0w7UUFFQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBZSxDQUFBLEVBQUcsTUFBTSxDQUFBLFdBQUEsQ0FBYSxDQUFDO0FBQ3JFLFFBQUEsT0FBTyxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQU4sTUFBTSxHQUFJO0FBQ2IsWUFBQSxpQkFBaUIsRUFBRSxFQUFFO0FBQ3JCLFlBQUEsa0JBQWtCLEVBQUUsRUFBRTtBQUN0QixZQUFBLGdCQUFnQixFQUFFLEVBQUU7QUFDcEIsWUFBQSxrQkFBa0IsRUFBRSxHQUFHO0FBQ3ZCLFlBQUEsY0FBYyxFQUFFLENBQUM7QUFDakIsWUFBQSxtQkFBbUIsRUFBRTtTQUN4QjtJQUNMLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsTUFBb0IsRUFBQTs7O0FBQ3pFLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sS0FBSztBQUV6QixRQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixDQUFBLEVBQUcsTUFBTSxDQUFBLFdBQUEsQ0FBYSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7UUFDNUYsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFFRDs7QUFFRztBQUNHLFNBQWdCLGdCQUFnQixDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUE7OztBQUNsRSxRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEtBQUs7QUFFekIsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxvQkFBQSxDQUFzQixFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQzNHLE9BQU8sQ0FBQSxFQUFBLEdBQUEsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBTixNQUFNLENBQUUsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxLQUFLO0lBQ25DLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsT0FBZSxFQUFBOzs7QUFDckUsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxLQUFLO0FBRXpCLFFBQUEsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQXVCLEdBQUcsTUFBTSxDQUFBLHFCQUFBLEVBQXdCLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUUsRUFBRSxRQUFRLENBQUM7UUFDL0gsT0FBTyxDQUFBLEVBQUEsR0FBQSxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLEtBQUs7SUFDbkMsQ0FBQyxDQUFBO0FBQUE7QUFHRDtBQUNBO0FBQ0E7QUFFQTs7QUFFRztBQUNHLFNBQWdCLFdBQVcsQ0FBQyxNQUFjLEVBQUE7O1FBQzVDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxPQUFPO0FBQ0gsZ0JBQUEsUUFBUSxFQUFFLFFBQVE7QUFDbEIsZ0JBQUEsT0FBTyxFQUFFLEVBQUU7QUFDWCxnQkFBQSxRQUFRLEVBQUUsRUFBRTtBQUNaLGdCQUFBLFVBQVUsRUFBRSxlQUFlO0FBQzNCLGdCQUFBLFdBQVcsRUFBRTthQUNoQjtRQUNMO1FBRUEsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQVcsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxjQUFBLENBQWdCLENBQUM7QUFDcEUsUUFBQSxPQUFPLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLE1BQUEsR0FBTixNQUFNLEdBQUk7QUFDYixZQUFBLFFBQVEsRUFBRSxRQUFRO0FBQ2xCLFlBQUEsT0FBTyxFQUFFLEVBQUU7QUFDWCxZQUFBLFFBQVEsRUFBRSxFQUFFO0FBQ1osWUFBQSxVQUFVLEVBQUUsZUFBZTtBQUMzQixZQUFBLFdBQVcsRUFBRTtTQUNoQjtJQUNMLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixjQUFjLENBQUMsTUFBYyxFQUFFLE1BQWdCLEVBQUE7OztBQUNqRSxRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEtBQUs7QUFFekIsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxjQUFBLENBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUMvRixPQUFPLENBQUEsRUFBQSxHQUFBLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLE1BQUEsR0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFFLE9BQU8sTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsR0FBQSxFQUFBLEdBQUksS0FBSztJQUNuQyxDQUFDLENBQUE7QUFBQTtBQTJERDs7QUFFRztBQUNHLFNBQWdCLFdBQVcsQ0FBQyxNQUFjLEVBQUE7O0FBQzVDLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sSUFBSTtBQUV4QixRQUFBLE9BQU8sVUFBVSxDQUFpQixDQUFBLEVBQUcsTUFBTSxDQUFBLGFBQUEsQ0FBZSxDQUFDO0lBQy9ELENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixjQUFjLENBQUMsTUFBYyxFQUFFLFFBQWlDLEVBQUE7OztBQUNsRixRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEtBQUs7QUFFekIsUUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBdUIsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxhQUFBLENBQWUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO1FBQ2hHLE9BQU8sQ0FBQSxFQUFBLEdBQUEsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBTixNQUFNLENBQUUsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxLQUFLO0lBQ25DLENBQUMsQ0FBQTtBQUFBO0FBYUQ7O0FBRUc7QUFDRyxTQUFnQixZQUFZLENBQUMsTUFBYyxFQUFBOzs7QUFDN0MsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxLQUFLO1FBRXpCLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixDQUFBLEVBQUcsTUFBTSxDQUFBLGdCQUFBLENBQWtCLEVBQUUsTUFBTSxDQUFDO1FBQzFGLE9BQU8sQ0FBQSxFQUFBLEdBQUEsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBTixNQUFNLENBQUUsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxLQUFLO0lBQ25DLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7QUFDRyxTQUFnQixzQkFBc0IsQ0FBQyxNQUFjLEVBQUE7O0FBQ3ZELFFBQUEsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUU7UUFFekUsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQXdFLENBQUEsRUFBRyxNQUFNLENBQUEsZ0JBQUEsQ0FBa0IsRUFBRSxNQUFNLENBQUM7UUFDM0ksT0FBTyxNQUFNLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRTtJQUNsRSxDQUFDLENBQUE7QUFBQTtBQUVEOztBQUVHO0FBQ0csU0FBZ0IsY0FBYyxDQUFDLE1BQWMsRUFBQTs7QUFDL0MsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxJQUFJO0FBRXhCLFFBQUEsT0FBTyxNQUFNLFVBQVUsQ0FBYyxHQUFHLE1BQU0sQ0FBQSxpQkFBQSxDQUFtQixDQUFDO0lBQ3RFLENBQUMsQ0FBQTtBQUFBO0FBMkJEOztBQUVHO0FBQ0csU0FBZ0IsZUFBZSxDQUFDLE1BQWMsRUFBQTs7QUFDaEQsUUFBQSxJQUFJLENBQUMsTUFBTTtBQUFFLFlBQUEsT0FBTyxJQUFJO0FBRXhCLFFBQUEsT0FBTyxNQUFNLFVBQVUsQ0FBZSxHQUFHLE1BQU0sQ0FBQSxtQkFBQSxDQUFxQixDQUFDO0lBQ3pFLENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7U0FDbUIsU0FBUyxDQUFBLFFBQUEsRUFBQTtBQUFDLElBQUEsT0FBQSxTQUFBLENBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLEVBQUEsV0FBQSxNQUFjLEVBQUUsY0FBQSxHQUEwQixJQUFJLEVBQUUsS0FBYyxFQUFBOztBQUMxRixRQUFBLElBQUksQ0FBQyxNQUFNO0FBQUUsWUFBQSxPQUFPLEVBQUU7UUFFdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQSxFQUFHLE1BQU0sQ0FBQSxXQUFBLENBQWEsQ0FBQztBQUMzQyxRQUFBLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNsRSxRQUFBLElBQUksS0FBSztBQUFFLFlBQUEsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxRCxPQUFPLENBQUEsRUFBQSxHQUFBLE1BQU0sVUFBVSxDQUFhLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxFQUFFO0lBQzdELENBQUMsQ0FBQTtBQUFBO0FBRUQ7O0FBRUc7U0FDbUIsYUFBYSxDQUFDLE1BQWMsRUFBRSxTQUFrQixFQUFFLE1BQWUsRUFBQTs7O0FBQ25GLFFBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxZQUFBLE9BQU8sS0FBSztRQUV6QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBLEVBQUcsTUFBTSxDQUFBLG1CQUFBLENBQXFCLENBQUM7QUFDbkQsUUFBQSxJQUFJLFNBQVM7WUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDO0FBQy9ELFFBQUEsSUFBSSxNQUFNO1lBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztBQUVyRCxRQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUF1QixHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDO1FBQzVFLE9BQU8sQ0FBQSxFQUFBLEdBQUEsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBTixNQUFNLENBQUUsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLEVBQUEsR0FBSSxLQUFLO0lBQ25DLENBQUMsQ0FBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbnFCRDtBQUNPLFNBQVMsSUFBSSxHQUFHLENBQUM7O0FBc0NqQixTQUFTLEdBQUcsQ0FBQyxFQUFFLEVBQUU7QUFDeEIsQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUNaOztBQUVPLFNBQVMsWUFBWSxHQUFHO0FBQy9CLENBQUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUM3QixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ25DLENBQUMsT0FBTyxPQUFPLEtBQUssS0FBSyxVQUFVO0FBQ25DOztBQUVBO0FBQ08sU0FBUyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNyQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVU7QUFDNUY7O0FBcURBO0FBQ08sU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQzlCLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQ3JDOztBQ2VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3JDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUU7QUFDOUQsQ0FBQyxNQUFNLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztBQUNwRCxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDdkQsRUFBRSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ2hDLEVBQUUsS0FBSyxDQUFDLEVBQUUsR0FBRyxjQUFjO0FBQzNCLEVBQUUsS0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNO0FBQzVCLEVBQUUsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO0FBQzVDLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO0FBQ3pDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLFFBQVE7QUFDM0IsQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYTtBQUN4RSxDQUFDLElBQUksSUFBSSw4QkFBOEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3BELEVBQUUsa0NBQWtDLElBQUk7QUFDeEMsQ0FBQztBQUNELENBQUMsT0FBTyxJQUFJLENBQUMsYUFBYTtBQUMxQjs7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN4QyxDQUFDLE1BQU0seUJBQXlCLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsS0FBSyxDQUFDO0FBQzNELENBQUMsT0FBTyxLQUFLLENBQUMsS0FBSztBQUNuQjs7QUFpQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDN0MsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLElBQUksSUFBSSxDQUFDO0FBQzFDOztBQWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUM3QixDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN0QixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNPLFNBQVMsWUFBWSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUU7QUFDcEQsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2hELEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDL0MsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDOUIsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO0FBQ3BDOztBQTJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUMzQixDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7QUFDckM7O0FBRUE7QUFDQTtBQUNPLFNBQVMsS0FBSyxHQUFHO0FBQ3hCLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2pCOztBQUVBO0FBQ0E7QUFDTyxTQUFTLEtBQUssR0FBRztBQUN4QixDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNoQjs7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN0RCxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztBQUMvQyxDQUFDLE9BQU8sTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7QUFDL0Q7O0FBWUE7QUFDQTtBQUNPLFNBQVMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFO0FBQ3JDLENBQUMsT0FBTyxVQUFVLEtBQUssRUFBRTtBQUN6QixFQUFFLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDekI7QUFDQSxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0FBQzdCLENBQUMsQ0FBQztBQUNGOztBQThCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRTtBQUM3QyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztBQUNuRCxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQ3JGOztBQTRMQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUNsQyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3RDOztBQTRNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNyQyxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSTtBQUNqQixDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDekIsQ0FBQyxJQUFJLENBQUMsSUFBSSwwQkFBMEIsSUFBSSxDQUFDO0FBQ3pDOztBQTJCQTtBQUNBO0FBQ08sU0FBUyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM5QyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsS0FBSztBQUN6Qzs7QUFzQkE7QUFDQTtBQUNPLFNBQVMsYUFBYSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ3ZELENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDcEQsRUFBRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNsQyxFQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7QUFDaEMsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUk7QUFDekIsR0FBRztBQUNILEVBQUU7QUFDRixDQUFDO0FBQ0QsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDdkMsRUFBRSxNQUFNLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBQ0Q7O0FBV08sU0FBUyxZQUFZLENBQUMsTUFBTSxFQUFFO0FBQ3JDLENBQUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7QUFDekQsQ0FBQyxPQUFPLGVBQWUsSUFBSSxlQUFlLENBQUMsT0FBTztBQUNsRDs7QUEyRkE7QUFDQTtBQUNPLFNBQVMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ3BEO0FBQ0EsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDekYsQ0FBQyxPQUFPLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUM7QUFDOUQ7O0FBdU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNodUNPLElBQUksaUJBQWlCOztBQUU1QjtBQUNPLFNBQVMscUJBQXFCLENBQUMsU0FBUyxFQUFFO0FBQ2pELENBQUMsaUJBQWlCLEdBQUcsU0FBUztBQUM5Qjs7QUFFTyxTQUFTLHFCQUFxQixHQUFHO0FBQ3hDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUM7QUFDNUYsQ0FBQyxPQUFPLGlCQUFpQjtBQUN6Qjs7QUE0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMscUJBQXFCLEdBQUc7QUFDeEMsQ0FBQyxNQUFNLFNBQVMsR0FBRyxxQkFBcUIsRUFBRTtBQUMxQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsVUFBVSxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSztBQUN2RCxFQUFFLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUNoRCxFQUFFLElBQUksU0FBUyxFQUFFO0FBQ2pCO0FBQ0E7QUFDQSxHQUFHLE1BQU0sS0FBSyxHQUFHLFlBQVksd0JBQXdCLElBQUksR0FBRyxNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztBQUNuRixHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUs7QUFDckMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDN0IsR0FBRyxDQUFDLENBQUM7QUFDTCxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCO0FBQ2pDLEVBQUU7QUFDRixFQUFFLE9BQU8sSUFBSTtBQUNiLENBQUMsQ0FBQztBQUNGOztBQTBEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRTtBQUN6QyxDQUFDLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDckQsQ0FBQyxJQUFJLFNBQVMsRUFBRTtBQUNoQjtBQUNBLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBQ0Q7O0FDbkxPLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRTtBQUUzQixNQUFNLGlCQUFpQixHQUFHLEVBQUU7O0FBRW5DLElBQUksZ0JBQWdCLEdBQUcsRUFBRTs7QUFFekIsTUFBTSxlQUFlLEdBQUcsRUFBRTs7QUFFMUIsTUFBTSxnQkFBZ0IsbUJBQW1CLE9BQU8sQ0FBQyxPQUFPLEVBQUU7O0FBRTFELElBQUksZ0JBQWdCLEdBQUcsS0FBSzs7QUFFNUI7QUFDTyxTQUFTLGVBQWUsR0FBRztBQUNsQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN4QixFQUFFLGdCQUFnQixHQUFHLElBQUk7QUFDekIsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzlCLENBQUM7QUFDRDs7QUFRQTtBQUNPLFNBQVMsbUJBQW1CLENBQUMsRUFBRSxFQUFFO0FBQ3hDLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUMxQjs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRTs7QUFFaEMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUVqQjtBQUNPLFNBQVMsS0FBSyxHQUFHO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLENBQUMsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO0FBQ3JCLEVBQUU7QUFDRixDQUFDO0FBQ0QsQ0FBQyxNQUFNLGVBQWUsR0FBRyxpQkFBaUI7QUFDMUMsQ0FBQyxHQUFHO0FBQ0o7QUFDQTtBQUNBLEVBQUUsSUFBSTtBQUNOLEdBQUcsT0FBTyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0FBQzlDLElBQUksTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO0FBQ2hELElBQUksUUFBUSxFQUFFO0FBQ2QsSUFBSSxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7QUFDcEMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztBQUN4QixHQUFHO0FBQ0gsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDZDtBQUNBLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUM7QUFDOUIsR0FBRyxRQUFRLEdBQUcsQ0FBQztBQUNmLEdBQUcsTUFBTSxDQUFDO0FBQ1YsRUFBRTtBQUNGLEVBQUUscUJBQXFCLENBQUMsSUFBSSxDQUFDO0FBQzdCLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUM7QUFDN0IsRUFBRSxRQUFRLEdBQUcsQ0FBQztBQUNkLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDNUQ7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkQsR0FBRyxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDdkMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN0QztBQUNBLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDaEMsSUFBSSxRQUFRLEVBQUU7QUFDZCxHQUFHO0FBQ0gsRUFBRTtBQUNGLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUM7QUFDN0IsQ0FBQyxDQUFDLFFBQVEsZ0JBQWdCLENBQUMsTUFBTTtBQUNqQyxDQUFDLE9BQU8sZUFBZSxDQUFDLE1BQU0sRUFBRTtBQUNoQyxFQUFFLGVBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUN6QixDQUFDO0FBQ0QsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLO0FBQ3pCLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtBQUN2QixDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztBQUN2Qzs7QUFFQTtBQUNBLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNwQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDM0IsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFO0FBQ2IsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUMzQixFQUFFLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLO0FBQ3hCLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNqQixFQUFFLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7QUFDN0MsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztBQUM5QyxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsc0JBQXNCLENBQUMsR0FBRyxFQUFFO0FBQzVDLENBQUMsTUFBTSxRQUFRLEdBQUcsRUFBRTtBQUNwQixDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUU7QUFDbkIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQzVCLENBQUMsZ0JBQWdCLEdBQUcsUUFBUTtBQUM1Qjs7QUNuR0EsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUU7O0FBMEIxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM1QyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDdkIsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUN4QixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ2hCLENBQUM7QUFDRDs7QUF5V0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Y0E7O0FBRU8sU0FBUyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRTtBQUMxRCxDQUFDLE9BQU8sc0JBQXNCLEVBQUUsTUFBTSxLQUFLO0FBQzNDLElBQUk7QUFDSixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUM7QUFDdEM7O0FBRUE7O0FBRUE7QUFDTyxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQzdDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUN6Qjs7QUFxQkE7QUFDTyxTQUFTLGlCQUFpQjtBQUNqQyxDQUFDLFVBQVU7QUFDWCxDQUFDLEtBQUs7QUFDTixDQUFDLE9BQU87QUFDUixDQUFDLE9BQU87QUFDUixDQUFDLEdBQUc7QUFDSixDQUFDLElBQUk7QUFDTCxDQUFDLE1BQU07QUFDUCxDQUFDLElBQUk7QUFDTCxDQUFDLE9BQU87QUFDUixDQUFDLGlCQUFpQjtBQUNsQixDQUFDLElBQUk7QUFDTCxDQUFDO0FBQ0QsRUFBRTtBQUNGLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU07QUFDMUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTTtBQUNwQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVixDQUFDLE1BQU0sV0FBVyxHQUFHLEVBQUU7QUFDdkIsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUMvQyxDQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUU7QUFDdEIsQ0FBQyxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUM3QixDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFO0FBQ3pCLENBQUMsTUFBTSxPQUFPLEdBQUcsRUFBRTtBQUNuQixDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ04sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ2IsRUFBRSxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDN0MsRUFBRSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ2hDLEVBQUUsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDN0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsR0FBRyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQztBQUM1QyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDWixFQUFFLENBQUMsTUFBbUI7QUFDdEI7QUFDQSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRCxFQUFFO0FBQ0YsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFO0FBQzlDLEVBQUUsSUFBSSxHQUFHLElBQUksV0FBVyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFDRCxDQUFDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFO0FBQzVCLENBQUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUU7QUFDM0I7QUFDQSxDQUFDLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUN4QixFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQ3JCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztBQUM5QixFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSztBQUNwQixFQUFFLENBQUMsRUFBRTtBQUNMLENBQUM7QUFDRCxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNoQixFQUFFLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLEVBQUUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsRUFBRSxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRztBQUMvQixFQUFFLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHO0FBQy9CLEVBQUUsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO0FBQy9CO0FBQ0EsR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLEtBQUs7QUFDekIsR0FBRyxDQUFDLEVBQUU7QUFDTixHQUFHLENBQUMsRUFBRTtBQUNOLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3ZDO0FBQ0EsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztBQUM3QixHQUFHLENBQUMsRUFBRTtBQUNOLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDN0QsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BCLEVBQUUsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQyxHQUFHLENBQUMsRUFBRTtBQUNOLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3hELEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDeEIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BCLEVBQUUsQ0FBQyxNQUFNO0FBQ1QsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUN6QixHQUFHLENBQUMsRUFBRTtBQUNOLEVBQUU7QUFDRixDQUFDO0FBQ0QsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ2IsRUFBRSxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO0FBQ2hFLENBQUM7QUFDRCxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNqQixDQUFDLE9BQU8sVUFBVTtBQUNsQjs7QUNoRkE7QUFDTyxTQUFTLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUMzRCxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUU7QUFDaEQsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQ3ZDO0FBQ0EsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNO0FBQzNCLEVBQUUsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDM0U7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO0FBQy9CLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDO0FBQ2xELEVBQUUsQ0FBQyxNQUFNO0FBQ1Q7QUFDQTtBQUNBLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUMxQixFQUFFO0FBQ0YsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxFQUFFO0FBQzVCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0FBQzFDOztBQUVBO0FBQ08sU0FBUyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO0FBQ3hELENBQUMsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUU7QUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO0FBQzNCLEVBQUUsc0JBQXNCLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztBQUN6QyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ3hCLEVBQUUsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDekM7QUFDQTtBQUNBLEVBQUUsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUk7QUFDcEMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFDYixDQUFDO0FBQ0Q7O0FBRUE7QUFDQSxTQUFTLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDbkMsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2xDLEVBQUUsZUFBZSxFQUFFO0FBQ25CLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLElBQUk7QUFDcEIsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxPQUFPO0FBQ1IsQ0FBQyxRQUFRO0FBQ1QsQ0FBQyxlQUFlO0FBQ2hCLENBQUMsU0FBUztBQUNWLENBQUMsS0FBSztBQUNOLENBQUMsYUFBYSxHQUFHLElBQUk7QUFDckIsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ1osRUFBRTtBQUNGLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUI7QUFDM0MsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7QUFDakM7QUFDQSxDQUFDLE1BQU0sRUFBRSxJQUFJLFNBQVMsQ0FBQyxFQUFFLEdBQUc7QUFDNUIsRUFBRSxRQUFRLEVBQUUsSUFBSTtBQUNoQixFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ1Q7QUFDQSxFQUFFLEtBQUs7QUFDUCxFQUFFLE1BQU0sRUFBRSxJQUFJO0FBQ2QsRUFBRSxTQUFTO0FBQ1gsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0FBQ3ZCO0FBQ0EsRUFBRSxRQUFRLEVBQUUsRUFBRTtBQUNkLEVBQUUsVUFBVSxFQUFFLEVBQUU7QUFDaEIsRUFBRSxhQUFhLEVBQUUsRUFBRTtBQUNuQixFQUFFLGFBQWEsRUFBRSxFQUFFO0FBQ25CLEVBQUUsWUFBWSxFQUFFLEVBQUU7QUFDbEIsRUFBRSxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVGO0FBQ0EsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO0FBQzNCLEVBQUUsS0FBSztBQUNQLEVBQUUsVUFBVSxFQUFFLEtBQUs7QUFDbkIsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7QUFDOUMsRUFBRSxDQUFDO0FBQ0gsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDeEMsQ0FBQyxJQUFJLEtBQUssR0FBRyxLQUFLO0FBQ2xCLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRztBQUNWLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEtBQUs7QUFDbEUsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHO0FBQzdDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUU7QUFDN0QsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzFELEtBQUssSUFBSSxLQUFLLEVBQUUsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDeEMsSUFBSTtBQUNKLElBQUksT0FBTyxHQUFHO0FBQ2QsSUFBSSxDQUFDO0FBQ0wsSUFBSSxFQUFFO0FBQ04sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO0FBQ1osQ0FBQyxLQUFLLEdBQUcsSUFBSTtBQUNiLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7QUFDMUI7QUFDQSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsZUFBZSxHQUFHLGVBQWUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSztBQUNoRSxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNyQixFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUV2QjtBQUNBO0FBQ0EsR0FBRyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN6QyxHQUFHLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDeEIsRUFBRSxDQUFDLE1BQU07QUFDVDtBQUNBLEdBQUcsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNqQyxFQUFFO0FBQ0YsRUFBRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQ3pELEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFFNUQsRUFBRSxLQUFLLEVBQUU7QUFDVCxDQUFDO0FBQ0QsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN4Qzs7QUFtU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTSxlQUFlLENBQUM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUUsR0FBRyxTQUFTO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEtBQUssR0FBRyxTQUFTOztBQUVsQjtBQUNBLENBQUMsUUFBUSxHQUFHO0FBQ1osRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO0FBQ3RCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUNyQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsR0FBRyxPQUFPLElBQUk7QUFDZCxFQUFFO0FBQ0YsRUFBRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDN0UsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMxQixFQUFFLE9BQU8sTUFBTTtBQUNmLEdBQUcsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDNUMsR0FBRyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLEVBQUUsQ0FBQztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDYixFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN0QyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLElBQUk7QUFDNUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUNwQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLEtBQUs7QUFDN0IsRUFBRTtBQUNGLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTs7QUFTTyxNQUFNLGNBQWMsR0FBRyxHQUFHOztBQ1BqQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVc7QUFDakM7QUFDQSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQzJSckUsR0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUFDLG1CQUFBLENBQUEsR0FBQSxDQUFBO2dEQW9EekIsR0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBOzs7Z0NBQVosTUFBSSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7OzthQS9FRixJQUVBLENBQUE7OzthQUlBLElBRUEsQ0FBQTs7O2FBSUEsSUFFQSxDQUFBOzs7YUFJQSxLQUVBLENBQUE7Ozs7Ozs7O2NBMkJFLElBRUEsQ0FBQTs7O2NBTUEsSUFFQSxDQUFBOzs7Y0FNQSxJQUVBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW5FZ0IsR0FBQSxJQUFBLENBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxtQkFBQSxHQUFBLFVBQUEsa0JBQUEsR0FBUyxDQUFBLENBQUEsQ0FBQSxLQUFLLFFBQVEsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFBLEdBQUEsaUJBQUEsQ0FBQTtBQU10QyxHQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLG1CQUFBLEdBQUEsVUFBQSxrQkFBQSxHQUFTLENBQUEsQ0FBQSxDQUFBLEtBQUssTUFBTSxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUEsR0FBQSxpQkFBQSxDQUFBO0FBTXBDLEdBQUEsSUFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsbUJBQUEsR0FBQSxVQUFBLGtCQUFBLEdBQVMsQ0FBQSxDQUFBLENBQUEsS0FBSyxVQUFVLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQSxHQUFBLGlCQUFBLENBQUE7QUFNeEMsR0FBQSxJQUFBLENBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxtQkFBQSxHQUFBLFVBQUEsa0JBQUEsR0FBUyxDQUFBLENBQUEsQ0FBQSxLQUFLLEtBQUssR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFBLEdBQUEsaUJBQUEsQ0FBQTs7Ozs7a0VBOEJ2QyxHQUFjLENBQUEsQ0FBQSxDQUFBLENBQUMsSUFBSSxLQUFLLENBQUM7OztrRUFRekIsR0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFDLElBQUksS0FBSyxDQUFDOzs7a0VBUXpCLEdBQWMsQ0FBQSxDQUFBLENBQUEsQ0FBQyxJQUFJLEtBQUssQ0FBQzs7Ozs7Ozs7OztrQkFTUyxHQUFNLENBQUEsQ0FBQSxDQUFBLEtBQUEsTUFBQSxFQUFBLG1CQUFBLENBQUEsZ0NBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTs7Ozs7R0EzRjFELE1BMENLLENBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLENBQUE7R0F4Q0gsTUFLUSxDQUFBLElBQUEsRUFBQSxPQUFBLENBQUE7O0dBR1IsTUFJUSxDQUFBLElBQUEsRUFBQSxPQUFBLENBQUE7O0dBRVIsTUF5QkssQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFBO0dBeEJILE1BS1EsQ0FBQSxJQUFBLEVBQUEsT0FBQSxDQUFBOzs7R0FDUixNQUtRLENBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQTs7O0dBQ1IsTUFLUSxDQUFBLElBQUEsRUFBQSxPQUFBLENBQUE7OztHQUNSLE1BS1EsQ0FBQSxJQUFBLEVBQUEsT0FBQSxDQUFBOzs7R0FLWixNQW9ESyxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBOzs7R0FyQ0gsTUEyQkssQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFBO0dBMUJILE1BeUJLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTtHQXhCSCxNQU9RLENBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQTs7O0dBQ1IsTUFPUSxDQUFBLElBQUEsRUFBQSxPQUFBLENBQUE7OztHQUNSLE1BT1EsQ0FBQSxJQUFBLEVBQUEsT0FBQSxDQUFBOzs7R0FLWixNQU1LLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTtHQUxILE1BSVEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxDQUFBO0dBSE4sTUFBc0MsQ0FBQSxNQUFBLEVBQUEsT0FBQSxDQUFBO0dBQ3RDLE1BQStCLENBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQTtHQUMvQixNQUFrQyxDQUFBLE1BQUEsRUFBQSxPQUFBLENBQUE7b0NBSFksR0FBTSxDQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQTs7Ozs7Ozs7Ozs7OztnREF6RlQsR0FBYSxDQUFBLEVBQUEsQ0FBQSxDQUFBOytDQVFiLEdBQVksQ0FBQSxFQUFBLENBQUEsQ0FBQTs7Ozs7Z0RBc0QzQyxHQUFhLENBQUEsRUFBQSxDQUFBLENBQUE7K0NBUWIsR0FBWSxDQUFBLEVBQUEsQ0FBQSxDQUFBOzhDQVFaLEdBQVcsQ0FBQSxFQUFBLENBQUEsQ0FBQTs7Ozs7Ozs7O0FBOURQLEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLGlCQUFBLENBQUEsSUFBQSxtQkFBQSxNQUFBLG1CQUFBLEdBQUEsVUFBQSxrQkFBQSxHQUFTLENBQUEsQ0FBQSxDQUFBLEtBQUssUUFBUSxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUEsR0FBQSxpQkFBQSxDQUFBLEVBQUE7Ozs7QUFNdEMsR0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLG1CQUFBLE1BQUEsbUJBQUEsR0FBQSxVQUFBLGtCQUFBLEdBQVMsQ0FBQSxDQUFBLENBQUEsS0FBSyxNQUFNLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQSxHQUFBLGlCQUFBLENBQUEsRUFBQTs7OztBQU1wQyxHQUFBLElBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsbUJBQUEsTUFBQSxtQkFBQSxHQUFBLFVBQUEsa0JBQUEsR0FBUyxDQUFBLENBQUEsQ0FBQSxLQUFLLFVBQVUsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFBLEdBQUEsaUJBQUEsQ0FBQSxFQUFBOzs7O0FBTXhDLEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLGlCQUFBLENBQUEsSUFBQSxtQkFBQSxNQUFBLG1CQUFBLEdBQUEsVUFBQSxrQkFBQSxHQUFTLENBQUEsQ0FBQSxDQUFBLEtBQUssS0FBSyxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUEsR0FBQSxpQkFBQSxDQUFBLEVBQUE7Ozs7MEJBV2xELEdBQWMsQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFBOzs7Ozs7Ozs7Ozs7O2tIQW1CZCxHQUFjLENBQUEsQ0FBQSxDQUFBLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQSxFQUFBOzs7O2tIQVF6QixHQUFjLENBQUEsQ0FBQSxDQUFBLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQSxFQUFBOzs7O2tIQVF6QixHQUFjLENBQUEsQ0FBQSxDQUFBLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQSxFQUFBOzs7OztxQ0FTUyxHQUFNLENBQUEsQ0FBQSxDQUFBLENBQUE7Ozs7K0NBUW5ELEdBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQTs7OytCQUFaLE1BQUksRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7O29DQUFKLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ExR04sTUFJSyxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQXNEVSxHQUFXLENBQUEsQ0FBQSxDQUFBOzBDQUNMLEdBQVksQ0FBQSxDQUFBLENBQUE7Ozs7O0dBSi9CLE1BUU8sQ0FBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsQ0FBQTtHQVBMLE1BS0MsQ0FBQSxLQUFBLEVBQUEsS0FBQSxDQUFBOztHQUNELE1BQWMsQ0FBQSxLQUFBLEVBQUEsSUFBQSxDQUFBOzs7MERBRkQsR0FBZSxDQUFBLEVBQUEsQ0FBQSxDQUFBOzs7Ozs7b0NBRmpCLEdBQVcsQ0FBQSxDQUFBLENBQUE7Ozs7MkNBQ0wsR0FBWSxDQUFBLENBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlEbEIsQ0FBQSxJQUFBLFlBQUEsR0FBQSxpQkFBQSxXQUFBLEdBQUssS0FBQyxNQUFNLENBQUE7QUFBVyxDQUFBLE1BQUEsT0FBQSxHQUFBLEdBQUEsY0FBQSxHQUFLLEtBQUMsRUFBRTs7a0NBQXBDLE1BQUksRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQURSLE1BbUVLLENBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLENBQUE7Ozs7Ozs7Ozs7QUFsRUksSUFBQSxZQUFBLEdBQUEsaUJBQUEsV0FBQSxHQUFLLEtBQUMsTUFBTSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQlQsTUFBd0MsQ0FBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUdzRCxJQUFFLENBQUE7O0FBQTlDLEdBQUEsSUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsZ0JBQUEsR0FBQSxhQUFBLEdBQUEsV0FBQSxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBQSxLQUFBLENBQUE7OztHQUF4RixNQUFzRyxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBOzs7O0FBQXBELEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLGVBQUEsR0FBQSxJQUFBLGdCQUFBLE1BQUEsZ0JBQUEsR0FBQSxhQUFBLEdBQUEsV0FBQSxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBQSxLQUFBLENBQUEsRUFBQTs7Ozs7Ozs7Ozs7Ozs7O3NDQWdCakYsYUFBYSxXQUFDLEdBQUssQ0FBQSxFQUFBLENBQUEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQTs7O2tDQUE3QyxNQUFJLEVBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBRFIsTUFJSyxDQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxDQUFBOzs7Ozs7Ozs7O3FDQUhJLGFBQWEsV0FBQyxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUE7OztpQ0FBN0MsTUFBSSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBQUosTUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQ29CLEdBQUUsQ0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBOzs7Ozs7YUFBSixHQUFDLENBQUE7Ozs7O0dBQXZCLE1BQWlDLENBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLENBQUE7Ozs7O3FFQUFULEdBQUUsQ0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7OzswQkFldkIsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUFDLG1CQUFBLENBQUEsR0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FHNUIsTUFBcUcsQ0FBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsQ0FBQTs7Ozs7Ozs7OztpQkFIaEcsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBRjVCLE1BQTBHLENBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUd4RyxNQUFvRyxDQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFyQ25HLENBQUEsSUFBQSxPQUFBLGFBQUEsR0FBSyxlQUFDLEdBQUssQ0FBQSxFQUFBLENBQUEsQ0FBQSxjQUFLLEdBQUssQ0FBQSxFQUFBLENBQUEsQ0FBQyxNQUFNLEtBQUssTUFBTTs7OztBQU16QixDQUFBLElBQUEsUUFBQSxhQUFBLEdBQUssS0FBQyxLQUFLLEdBQUEsRUFBQTs7OztBQUc3QixDQUFBLElBQUEsUUFBQSxhQUFBLEdBQUssS0FBQyxVQUFVLEdBQUEsRUFBQTs7Ozs7QUFLRCxDQUFBLElBQUEsUUFBQSxhQUFBLEdBQUssS0FBQyxPQUFPLEdBQUEsRUFBQTs7Ozs7O0FBV0gsQ0FBQSxJQUFBLFNBQUEsYUFBQSxHQUFLLEtBQUMsUUFBUSxHQUFBLEVBQUE7Ozs7O0FBS2xCLENBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFJLFdBQUMsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUEsRUFBSSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUEsQ0FBQSxHQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTNCeEcsQ0FBQSxJQUFBLFNBQUEsYUFBQSxHQUFLLEtBQUMsWUFBWSxjQUFJLEdBQUssQ0FBQSxFQUFBLENBQUEsQ0FBQyxZQUFZLEtBQUssQ0FBQyxJQUFBQyxtQkFBQSxDQUFBLEdBQUEsQ0FBQTtBQWVoRCxDQUFBLElBQUEsU0FBQSxhQUFBLEdBQUssS0FBQyxRQUFRLElBQUFDLG1CQUFBLENBQUEsR0FBQSxDQUFBOzs7Z0JBZVosR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUEsT0FBQUMsbUJBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBekN2QixHQUFBLEtBQUEsQ0FBQSxPQUFBLEdBQUEsbUJBQUEsc0JBQUEsR0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFDLEdBQUcsV0FBQyxHQUFLLEtBQUMsRUFBRSxDQUFBOzs7OztnRUFnQlIsa0JBQWtCLFdBQUMsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLFVBQVUsQ0FBQSxHQUFBLGlCQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7QUF6QmhELEdBQUEsSUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsZ0JBQUEsR0FBQSxhQUFBLGNBQUEsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLE1BQU0sS0FBSyxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQSxHQUFBLEdBQUEsY0FBRyxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsTUFBTSxLQUFLO0tBQWE7QUFBYSxLQUFBLEVBQUUsOEJBQUcsR0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFDLEdBQUcsV0FBQyxHQUFLLEtBQUMsRUFBRTtLQUFJO0tBQWEsRUFBRSxDQUFBLEdBQUEsaUJBQUEsQ0FBQTs7Ozs7OztHQUQzSixNQStESyxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBO0dBeERILE1BTUssQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFBO0dBTEgsTUFJQyxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUE7O0dBSUgsTUFhSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7R0FaSCxNQVFLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTs7Ozs7R0FESCxNQUFtQyxDQUFBLElBQUEsRUFBQSxFQUFBLENBQUE7OztHQUVyQyxNQUVLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTs7O0dBSVAsTUFBcUMsQ0FBQSxJQUFBLEVBQUEsQ0FBQSxDQUFBOzs7R0FHckMsTUFTSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7OztHQURILE1BQWlELENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7O0dBSW5ELE1BZUssQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFBO0dBZEgsTUFBeUgsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBOzs7R0FFekgsTUFXSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7OztHQUZILE1BQXNHLENBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQTs7R0FDdEcsTUFBb0csQ0FBQSxJQUFBLEVBQUEsT0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFsRDNGLEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLCtCQUFBLEdBQUEsSUFBQSxtQkFBQSxNQUFBLG1CQUFBLHNCQUFBLEdBQWMsQ0FBQSxDQUFBLENBQUEsQ0FBQyxHQUFHLFdBQUMsR0FBSyxLQUFDLEVBQUUsQ0FBQSxDQUFBLEVBQUE7Ozs7QUFRL0IsR0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsZUFBQSxHQUFBLEVBQUEsT0FBQSxhQUFBLEdBQUssZUFBQyxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUEsY0FBSyxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsTUFBTSxLQUFLLE1BQU07Ozs7Ozs7Ozs7Ozs7QUFHdkMsR0FBQSxjQUFBLEdBQUssS0FBQyxZQUFZLGNBQUksR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7QUFHaEMsR0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsZUFBQSxHQUFBLElBQUEsUUFBQSxNQUFBLFFBQUEsYUFBQSxHQUFLLEtBQUMsS0FBSyxHQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxDQUFBO0FBRzdCLEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLGVBQUEsR0FBQSxJQUFBLFFBQUEsTUFBQSxRQUFBLGFBQUEsR0FBSyxLQUFDLFVBQVUsR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTs7b0dBRFcsa0JBQWtCLFdBQUMsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLFVBQVUsQ0FBQSxHQUFBLGlCQUFBLENBQUEsRUFBQTs7OztBQU0vQyxHQUFBLElBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxlQUFBLEdBQUEsSUFBQSxRQUFBLE1BQUEsUUFBQSxhQUFBLEdBQUssS0FBQyxPQUFPLEdBQUEsRUFBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLENBQUE7O0FBSTFCLEdBQUEsY0FBQSxHQUFLLEtBQUMsUUFBUSxFQUFBOzs7Ozs7Ozs7Ozs7O0FBT1MsR0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsZUFBQSxHQUFBLElBQUEsU0FBQSxNQUFBLFNBQUEsYUFBQSxHQUFLLEtBQUMsUUFBUSxHQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxHQUFBLEVBQUEsU0FBQSxDQUFBO0FBS2xCLEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLGVBQUEsR0FBQSxJQUFBLFNBQUEsTUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFJLFdBQUMsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUEsRUFBSSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxHQUFBLEVBQUEsU0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7OztBQS9DOUYsR0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsK0JBQUEsR0FBQSxJQUFBLGdCQUFBLE1BQUEsZ0JBQUEsR0FBQSxhQUFBLGNBQUEsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLE1BQU0sS0FBSyxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQSxHQUFBLEdBQUEsY0FBRyxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsTUFBTSxLQUFLO0tBQWE7QUFBYSxLQUFBLEVBQUUsOEJBQUcsR0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFDLEdBQUcsV0FBQyxHQUFLLEtBQUMsRUFBRTtLQUFJO0tBQWEsRUFBRSxDQUFBLEdBQUEsaUJBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFUbkksQ0FBQSxJQUFBLFFBQUEsR0FBQSxXQUFBLEdBQUssQ0FBQSxFQUFBLENBQUEsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBQSxFQUFBOzs7O0FBQzVCLENBQUEsSUFBQSxRQUFBLGFBQUEsR0FBSyxLQUFDLEtBQUssR0FBQSxFQUFBOzs7OzBCQUNYLEdBQUssQ0FBQSxFQUFBLENBQUEsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFBLEVBQUE7Ozs7Ozs7Ozs7O0FBRzFDLENBQUEsSUFBQSxRQUFBLEdBQUEsV0FBQSxHQUFLLEtBQUMsU0FBUyxJQUFBQyxtQkFBQSxDQUFBLEdBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FQdkIsTUE2RUssQ0FBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQTtHQTVFSCxNQUlLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTtHQUhILE1BQThELENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7O0dBQzlELE1BQTZDLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7O0dBQzdDLE1BQXFELENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7Ozs7Ozs7Ozs7OztBQUZ6QixHQUFBLElBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxlQUFBLEdBQUEsSUFBQSxRQUFBLE1BQUEsUUFBQSxHQUFBLFdBQUEsR0FBSyxDQUFBLEVBQUEsQ0FBQSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxDQUFBO0FBQzVCLEdBQUEsSUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLGVBQUEsR0FBQSxJQUFBLFFBQUEsTUFBQSxRQUFBLGFBQUEsR0FBSyxLQUFDLEtBQUssR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTt3RUFDWCxHQUFLLENBQUEsRUFBQSxDQUFBLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTs7QUFHMUMsR0FBQSxJQUFBLFdBQUEsR0FBSyxLQUFDLFNBQVMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUJBbkh0QixHQUFNLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQSxPQUFBQyxpQkFBQTs7Ozs7Ozs7Ozs7Ozs7R0FEMUIsTUE2TEssQ0FBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFqS3FCLENBQUEsTUFBQSxlQUFBLEdBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxFQUFBLFNBQVMsR0FBRyxRQUFRLENBQUE7QUFNcEIsQ0FBQSxNQUFBLGVBQUEsR0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEVBQUEsU0FBUyxHQUFHLE1BQU0sQ0FBQTtBQU1sQixDQUFBLE1BQUEsZUFBQSxHQUFBLE1BQUEsWUFBQSxDQUFBLENBQUEsRUFBQSxTQUFTLEdBQUcsVUFBVSxDQUFBO0FBTXRCLENBQUEsTUFBQSxlQUFBLEdBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxFQUFBLFNBQVMsR0FBRyxLQUFLLENBQUE7OztFQXNEYSxNQUFNLEdBQUEsWUFBQSxDQUFBLElBQUEsQ0FBQTs7OztBQVVaLENBQUEsTUFBQSxlQUFBLEdBQUEsVUFBQSxJQUFBLFdBQVcsQ0FBQyxVQUFVLENBQUE7bUNBb0JuQixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFBO0FBeUNaLENBQUEsTUFBQSxlQUFBLEdBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQyxLQUFLLGVBQWUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQTtBQUdwQyxDQUFBLE1BQUEsZUFBQSxHQUFBLENBQUEsS0FBQSxFQUFBLENBQUMsS0FBSyxjQUFjLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUE7QUFFL0IsQ0FBQSxNQUFBLGVBQUEsR0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFDLEtBQUssYUFBYSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFBO0FBRWxDLENBQUEsTUFBQSxlQUFBLEdBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQTtBQUM5QixDQUFBLE1BQUEsZ0JBQUEsR0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFBO21DQTFEL0QsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL1N2QixDQUFBLElBQUEsT0FBQSxhQUFBLEdBQUssSUFBQyxRQUFRLEdBQUEsRUFBQTs7Ozs7Ozs7OztHQUF0QyxNQUE2QyxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBOzs7O0FBQXJCLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLE9BQUEsTUFBQSxPQUFBLGFBQUEsR0FBSyxJQUFDLFFBQVEsR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBS3RDLE1BQXdDLENBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUZ4QyxNQUE2QyxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FPN0MsTUFFUSxDQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDQUFBOzs7dURBRm9DLEdBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBS3hELE1BRVEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsQ0FBQTs7O3dEQUZxQyxHQUFhLENBQUEsQ0FBQSxDQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZW5CLENBQUEsSUFBQSxRQUFBLGFBQUEsR0FBSyxJQUFDLFVBQVUsR0FBQSxFQUFBOzs7Ozs7OztBQUlwQixDQUFBLElBQUEsUUFBQSxhQUFBLEdBQUssSUFBQyxNQUFNLEdBQUEsRUFBQTs7Ozs7Ozs7QUFJZixDQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBSSxXQUFDLEdBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQyxVQUFVLENBQUEsQ0FBRSxjQUFjLENBQUMsT0FBTyxDQUFBLEdBQUEsRUFBQTs7Ozs7Ozs7Ozs7O2FBUnJCLEtBQUcsQ0FBQTs7Ozs7Ozs7YUFJWCxLQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBUHZELE1BYUssQ0FBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQTtHQVpILE1BR0ssQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFBO0dBRkgsTUFBb0MsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBOztHQUNwQyxNQUFpRSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUE7Ozs7R0FFbkUsTUFHSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7R0FGSCxNQUFvQyxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUE7O0dBQ3BDLE1BQXlELENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7OztHQUUzRCxNQUdLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTtHQUZILE1BQXFDLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7R0FDckMsTUFBcUYsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBOzs7O0FBUjlDLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLFFBQUEsTUFBQSxRQUFBLGFBQUEsR0FBSyxJQUFDLFVBQVUsR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTtBQUlwQixHQUFBLElBQUEsS0FBQSxhQUFBLENBQUEsSUFBQSxRQUFBLE1BQUEsUUFBQSxhQUFBLEdBQUssSUFBQyxNQUFNLEdBQUEsRUFBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLENBQUE7QUFJZixHQUFBLElBQUEsS0FBQSxhQUFBLENBQUEsSUFBQSxTQUFBLE1BQUEsU0FBQSxHQUFBLElBQUEsSUFBSSxXQUFDLEdBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQyxVQUFVLENBQUEsQ0FBRSxjQUFjLENBQUMsT0FBTyxDQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLEdBQUEsRUFBQSxTQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7K0NBUXhFLEdBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQTs7O2tDQUFULE1BQUksRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FEUixNQUlLLENBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLENBQUE7Ozs7Ozs7Ozs7OENBSEksR0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBOzs7aUNBQVQsTUFBSSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBQUosTUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFDZSxHQUFHLENBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQTs7Ozs7Ozs7OztHQUF0QixNQUE2QixDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBOzs7OzREQUFWLEdBQUcsQ0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7OztBQVVELENBQUEsSUFBQSxRQUFBLGFBQUEsR0FBSyxJQUFDLE9BQU8sR0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBRnhDLE1BR0ssQ0FBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsQ0FBQTtHQUZILE1BQWtCLENBQUEsR0FBQSxFQUFBLEVBQUEsQ0FBQTs7R0FDbEIsTUFBMEMsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBOzs7O0FBQWpCLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLFFBQUEsTUFBQSxRQUFBLGFBQUEsR0FBSyxJQUFDLE9BQU8sR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7OztvREFTN0IsR0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBOzs7a0NBQWQsTUFBSSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUhWLE1BT0ssQ0FBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsQ0FBQTtHQU5ILE1BQWUsQ0FBQSxHQUFBLEVBQUEsRUFBQSxDQUFBOztHQUNmLE1BSUksQ0FBQSxHQUFBLEVBQUEsRUFBQSxDQUFBOzs7Ozs7Ozs7O21EQUhLLEdBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQTs7O2lDQUFkLE1BQUksRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7O3NDQUFKLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQ0MsR0FBSyxDQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUE7Ozs7Ozs7Ozs7R0FBVixNQUFlLENBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLENBQUE7Ozs7bUVBQVYsR0FBSyxDQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQUEsT0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7OzswQkFTQSxHQUFLLENBQUEsQ0FBQSxDQUFBLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQSxFQUFBOzs7Ozs7O2FBQS9CLFdBQVMsQ0FBQTs7YUFBdUIsR0FBQyxDQUFBOzs7O0dBQXJDLE1BQXlDLENBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLENBQUE7Ozs7OztpRUFBM0IsR0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUEsRUFBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7NkJBZ0JyQixHQUFPLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxJQUFJLE1BQU0sSUFBQSxFQUFBOzs7OzthQUR6QixLQUNELENBQUE7Ozs7Ozs7O29FQUFDLEdBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLElBQUksTUFBTSxJQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUZ6QixDQUFBLElBQUEsUUFBQSxlQUFBLEdBQU8sSUFBQyxXQUFXLEdBQUEsRUFBQTs7Ozs7YUFERCxLQUNuQixDQUFBOzs7Ozs7OztBQUFDLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLFFBQUEsTUFBQSxRQUFBLGVBQUEsR0FBTyxJQUFDLFdBQVcsR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7QUFPbkIsQ0FBQSxJQUFBLFFBQUEsZUFBQSxHQUFPLElBQUMsTUFBTSxHQUFBLEVBQUE7Ozs7O2FBREQsS0FDZCxDQUFBOzs7Ozs7OztBQUFDLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLFFBQUEsTUFBQSxRQUFBLGVBQUEsR0FBTyxJQUFDLE1BQU0sR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7QUFjTSxDQUFBLElBQUEsT0FBQSxlQUFBLEdBQU8sSUFBQyxPQUFPLEdBQUEsRUFBQTs7Ozs7Ozs7OztHQUEzQyxNQUErQyxDQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBOzs7O0FBQW5CLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLE9BQUEsTUFBQSxPQUFBLGVBQUEsR0FBTyxJQUFDLE9BQU8sR0FBQSxFQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FBNUJ4QyxDQUFBLElBQUEsUUFBQSxlQUFBLEdBQU8sSUFBQyxLQUFLLEdBQUEsRUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFrQk4sQ0FBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLElBQUksYUFBQyxHQUFPLENBQUEsQ0FBQSxDQUFBLENBQUMsWUFBWSxDQUFBLENBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQTtBQUN2RCxFQUFBLEtBQUssRUFBRSxTQUFTO0FBQ2hCLEVBQUEsR0FBRyxFQUFFLFNBQVM7QUFDZCxFQUFBLElBQUksRUFBRSxTQUFTO0FBQ2YsRUFBQSxNQUFNLEVBQUU7Ozs7Ozs7O0FBaEJMLEVBQUEsZ0JBQUEsR0FBTyxJQUFDLFdBQVcsRUFBQSxPQUFBLGlCQUFBOzs7Ozs7QUFPbkIsQ0FBQSxJQUFBLFNBQUEsZUFBQSxHQUFPLElBQUMsTUFBTSxJQUFBLGlCQUFBLENBQUEsR0FBQSxDQUFBO29DQWNqQixHQUFhLENBQUEsQ0FBQSxDQUFBLGdCQUFJLEdBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLElBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7YUFWbEIsS0FDYixDQUFBOzs7OztBQW5CSSxHQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLFlBQUEsZUFBQSxHQUFPLElBQUMsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7O0dBRnhCLE1BaUNLLENBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLENBQUE7R0FoQ0gsTUFLSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7R0FKSCxNQUVHLENBQUEsSUFBQSxFQUFBLENBQUEsQ0FBQTs7O0dBQ0gsTUFBbUMsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBOztHQUVyQyxNQXFCSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7R0FwQkgsTUFNTSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUE7OztHQUNOLE1BSU0sQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBOzs7R0FDTixNQU9NLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQTs7Ozs7Ozs7QUF4QkgsR0FBQSxJQUFBLEtBQUEsYUFBQSxDQUFBLElBQUEsUUFBQSxNQUFBLFFBQUEsZUFBQSxHQUFPLElBQUMsS0FBSyxHQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxDQUFBOztBQURQLEdBQUEsSUFBQSxLQUFBLGFBQUEsQ0FBQSxJQUFBLFlBQUEsTUFBQSxZQUFBLGVBQUEsR0FBTyxJQUFDLEdBQUcsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBY2IsR0FBQSxnQkFBQSxHQUFPLElBQUMsTUFBTSxFQUFBOzs7Ozs7Ozs7Ozs7O0FBS1gsR0FBQSxJQUFBLEtBQUEsYUFBQSxDQUFBLElBQUEsUUFBQSxNQUFBLFFBQUEsR0FBQSxJQUFBLElBQUksYUFBQyxHQUFPLENBQUEsQ0FBQSxDQUFBLENBQUMsWUFBWSxDQUFBLENBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQTtBQUN2RCxJQUFBLEtBQUssRUFBRSxTQUFTO0FBQ2hCLElBQUEsR0FBRyxFQUFFLFNBQVM7QUFDZCxJQUFBLElBQUksRUFBRSxTQUFTO0FBQ2YsSUFBQSxNQUFNLEVBQUU7OzswQkFLUixHQUFhLENBQUEsQ0FBQSxDQUFBLGdCQUFJLEdBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0NBL0dsQyxHQUFhLENBQUEsQ0FBQSxDQUFBLElBQUEsa0JBQUEsQ0FBQSxHQUFBLENBQUE7OztnQkFHZCxHQUFLLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBQSxPQUFBLGtCQUFBO2dCQUV0QixHQUFLLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBQSxPQUFBLGtCQUFBOzs7OztvQ0FLM0IsR0FBYSxDQUFBLENBQUEsQ0FBQSxJQUFBLGlCQUFBLENBQUEsR0FBQSxDQUFBOzJCQUtkLEdBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLEtBQUssVUFBVSxJQUFBLGlCQUFBLENBQUEsR0FBQSxDQUFBO29DQVk5QixHQUFhLENBQUEsQ0FBQSxDQUFBLElBQUEsaUJBQUEsQ0FBQSxHQUFBLENBQUE7QUFrQmIsQ0FBQSxJQUFBLFNBQUEsR0FBQSxtQkFBQSxHQUFhLENBQUEsQ0FBQSxDQUFBLGFBQUksR0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUEsaUJBQUEsQ0FBQSxHQUFBLENBQUE7b0NBVWxDLEdBQWEsQ0FBQSxDQUFBLENBQUEsSUFBQSxpQkFBQSxDQUFBLEdBQUEsQ0FBQTtBQVFiLENBQUEsSUFBQSxTQUFBLEdBQUEsbUJBQUEsR0FBYSxDQUFBLENBQUEsQ0FBQSxrQkFBSSxHQUFTLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBQSxpQkFBQSxDQUFBLEdBQUEsQ0FBQTtvQ0FhbkMsR0FBYSxDQUFBLENBQUEsQ0FBQSxJQUFBLGlCQUFBLENBQUEsR0FBQSxDQUFBO0FBSVYsQ0FBQSxJQUFBLFVBQUEsR0FBQSxpQkFBQSxXQUFBLEdBQUssSUFBQyxRQUFRLENBQUE7OztnQ0FBbkIsTUFBSSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrREFuRnFDLEdBQWEsQ0FBQSxDQUFBLENBQUEsQ0FBQTs7NkRBa0ZOLEdBQWEsQ0FBQSxDQUFBLENBQUEsQ0FBQTs7Ozs7R0FwRnJFLE1BMkhLLENBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLENBQUE7R0F6SEgsTUF1REssQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFBO0dBdERILE1BMEJLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTtHQXpCSCxNQVNLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTs7Ozs7R0FDTCxNQWNLLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQTs7Ozs7R0FISCxNQUVRLENBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQTs7Ozs7Ozs7OztHQXFEZCxNQTBDSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7OztHQXRDSCxNQXFDSyxDQUFBLElBQUEsRUFBQSxJQUFBLENBQUE7Ozs7Ozs7Ozt1REFoRzJDLEdBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQTs7Ozs7MEJBcEJsRCxHQUFhLENBQUEsQ0FBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQVViLEdBQWEsQ0FBQSxDQUFBLENBQUEsRUFBQTs7Ozs7Ozs7Ozs7OztpQkFLZCxHQUFLLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBQTs7Ozs7Ozs7Ozs7OzswQkFZOUIsR0FBYSxDQUFBLENBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7O0FBa0JiLEdBQUEsSUFBQSxtQkFBQSxHQUFhLENBQUEsQ0FBQSxDQUFBLGFBQUksR0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7O2dFQWhETyxHQUFhLENBQUEsQ0FBQSxDQUFBLENBQUE7OzswQkEwRHRELEdBQWEsQ0FBQSxDQUFBLENBQUEsRUFBQTs7Ozs7Ozs7Ozs7OztBQVFiLEdBQUEsSUFBQSxtQkFBQSxHQUFhLENBQUEsQ0FBQSxDQUFBLGtCQUFJLEdBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFBOzs7Ozs7Ozs7Ozs7OzBCQWFuQyxHQUFhLENBQUEsQ0FBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7O0FBSVYsSUFBQSxVQUFBLEdBQUEsaUJBQUEsV0FBQSxHQUFLLElBQUMsUUFBUSxDQUFBOzs7K0JBQW5CLE1BQUksRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7O29DQUFKLE1BQUk7Ozs7OERBRDRDLEdBQWEsQ0FBQSxDQUFBLENBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdIckU7Ozs7O0FBS0c7QUFDSCxTQUFTLGdCQUFnQixDQUFDLEtBQWEsRUFBQTs7O0FBR25DLElBQUEsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUN4RTtBQUVBOztBQUVHO0FBQ0gsU0FBUyxTQUFTLENBQUMsSUFBbUMsRUFBQTtBQUNsRCxJQUFBLElBQUksQ0FBQyxJQUFJO0FBQUUsUUFBQSxPQUFPLEVBQUU7QUFDcEIsSUFBQSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQUUsUUFBQSxPQUFPLElBQUk7QUFDcEMsSUFBQSxJQUFJO0FBQ0EsUUFBQSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzNCO0FBQUUsSUFBQSxPQUFBLEVBQUEsRUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVEO0FBQ0o7QUFFQTs7QUFFRztBQUNILFNBQVMsY0FBYyxDQUFDLFNBQXdDLEVBQUE7QUFDNUQsSUFBQSxJQUFJLENBQUMsU0FBUztBQUFFLFFBQUEsT0FBTyxFQUFFO0FBQ3pCLElBQUEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUFFLFFBQUEsT0FBTyxTQUFTO0FBQzlDLElBQUEsSUFBSTtBQUNBLFFBQUEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUNoQztBQUFFLElBQUEsT0FBQSxFQUFBLEVBQU07QUFDSixRQUFBLE9BQU8sRUFBRTtJQUNiO0FBQ0o7QUFHQTs7OztBQUlHO0FBQ0csU0FBVSxxQkFBcUIsQ0FBQyxLQUFrQixFQUFBO0lBQ3BELE1BQU0sUUFBUSxHQUFHLENBQUEsRUFBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUEsR0FBQSxDQUFLO0lBQ3RELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ2xDLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO0lBRWxELElBQUksV0FBVyxHQUFHLEVBQUU7QUFDcEIsSUFBQSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2pCLFFBQUEsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUEsSUFBQSxFQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO0lBQ2pHO0FBRUEsSUFBQSxNQUFNLFdBQVcsR0FBRyxDQUFBOzs7TUFHbEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztFQUNsRCxXQUFXLENBQUEsVUFBQSxFQUFhLEtBQUssQ0FBQyxRQUFRO0FBQzFCLFlBQUEsRUFBQSxLQUFLLENBQUMsVUFBVTtBQUNwQixRQUFBLEVBQUEsS0FBSyxDQUFDLE1BQU07QUFDWCxTQUFBLEVBQUEsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7O0NBRWxDO0lBRUcsSUFBSSxPQUFPLEdBQUcsV0FBVztBQUN6QixJQUFBLE9BQU8sSUFBSSxDQUFBLElBQUEsRUFBTyxLQUFLLENBQUMsS0FBSyxNQUFNO0lBRW5DLE9BQU8sSUFBSSxjQUFjO0FBQ3pCLElBQUEsT0FBTyxJQUFJLENBQUEsRUFBRyxLQUFLLENBQUMsT0FBTyxNQUFNO0FBRWpDLElBQUEsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN0QixPQUFPLElBQUksV0FBVztBQUN0QixRQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFHO0FBQ3RCLFlBQUEsT0FBTyxJQUFJLENBQUEsRUFBQSxFQUFLLEtBQUssQ0FBQSxFQUFBLENBQUk7QUFDN0IsUUFBQSxDQUFDLENBQUM7UUFDRixPQUFPLElBQUksSUFBSTtJQUNuQjtJQUVBLE9BQU8sSUFBSSxZQUFZLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLO0FBQ2pELElBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFHO1FBQzdCLE9BQU8sSUFBSSxDQUFBLEdBQUEsRUFBTSxPQUFPLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUEsR0FBQSxDQUFLO0FBQ3ZELElBQUEsQ0FBQyxDQUFDO0FBRUYsSUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUNoQzs7Ozs7OztBQ2pGTSxNQUFPLGdCQUFpQixTQUFRQyxjQUFLLENBQUE7QUFNdkMsSUFBQSxXQUFBLENBQ0ksR0FBUSxFQUNSLEtBQWtCLEVBQ2xCLE1BQXdCLEVBQ3hCLFFBQW1DLEVBQUE7UUFFbkMsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUNWLFFBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLO0FBQ2xCLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxLQUFLLE1BQUssRUFBRSxDQUFDLENBQUM7QUFDdEMsUUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQztJQUNwRDtJQUVBLE1BQU0sR0FBQTs7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzs7QUFHdEMsUUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUlDLFdBQW9CLENBQUM7WUFDdEMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3RCLFlBQUEsS0FBSyxFQUFFO2dCQUNILEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNwQixhQUFBO0FBQ0osU0FBQSxDQUFDOztBQUdGLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVELFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlEO0lBRUEsT0FBTyxHQUFBO0FBQ0gsUUFBQSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDaEIsWUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtRQUM3QjtBQUNBLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7SUFDMUI7SUFFTSxZQUFZLEdBQUE7O1lBQ2QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVTtZQUNsRCxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2IsZ0JBQUEsSUFBSVQsZUFBTSxDQUFDLGNBQWMsQ0FBQztnQkFDMUI7WUFDSjtBQUVBLFlBQUEsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQy9ELFlBQUEsTUFBTSxRQUFRLEdBQUcsQ0FBQSxFQUFHLFVBQVUsQ0FBQSxDQUFBLEVBQUksUUFBUSxFQUFFO0FBRTVDLFlBQUEsSUFBSTs7QUFFQSxnQkFBQSxJQUFJLEVBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBLEVBQUU7b0JBQ2xELE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDakQ7O0FBR0EsZ0JBQUEsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztnQkFDOUQsSUFBSUEsZUFBTSxDQUFDLENBQUEsT0FBQSxFQUFVLE9BQU8sQ0FBQyxRQUFRLENBQUEsQ0FBRSxDQUFDOztBQUd4QyxnQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQzs7Z0JBR3ZCLElBQUksQ0FBQyxLQUFLLEVBQUU7O0FBR1osZ0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQztZQUU1RDtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ1osZ0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUM7QUFDNUMsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLGlCQUFpQixDQUFDO1lBQ2pDO1FBQ0osQ0FBQyxDQUFBO0FBQUEsSUFBQTtJQUVELGFBQWEsR0FBQTtBQUNULFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssRUFBRTtJQUNoQjtJQUVBLFlBQVksR0FBQTs7QUFFUixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEVBQUU7SUFDaEI7QUFDSDs7QUMzRkssTUFBTyxjQUFlLFNBQVFRLGNBQUssQ0FBQTtBQUlyQyxJQUFBLFdBQUEsQ0FDSSxHQUFRLEVBQ1IsWUFBMEIsRUFDMUIsTUFBd0IsRUFBQTtRQUV4QixLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ1YsUUFBQSxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVk7QUFDaEMsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07QUFDcEIsUUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQztJQUNuRDtJQUVBLE1BQU0sR0FBQTtBQUNGLFFBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBRWxDLFFBQUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDaEMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNqQixRQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUM7O0FBRzlDLFFBQUEsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hFLFlBQVksQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7K0NBT2MsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQTs7U0FFeEU7O0FBR0QsUUFBQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25ELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO0FBQzdDLFlBQUEsTUFBTSxVQUFVLEdBQTJCO0FBQ3ZDLGdCQUFBLFFBQVEsRUFBRSxJQUFJO0FBQ2QsZ0JBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixnQkFBQSxTQUFTLEVBQUUsSUFBSTtBQUNmLGdCQUFBLFNBQVMsRUFBRTthQUNkO0FBRUQsWUFBQSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNuRSxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSTtBQUN0QyxnQkFBQSxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDO2dCQUNuRCxHQUFHLENBQUMsU0FBUyxHQUFHO21EQUNtQixLQUFLLENBQUE7bURBQ0wsS0FBSyxDQUFBO2lCQUN2QztZQUNMO0FBQ0EsWUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNuQzs7UUFHQSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO0FBQ2hELFlBQUEsS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUN2RSxnQkFBQSxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDO2dCQUNyRCxHQUFHLENBQUMsU0FBUyxHQUFHO21EQUNtQixNQUFNLENBQUE7bURBQ04sS0FBSyxDQUFBO2lCQUN2QztZQUNMO0FBQ0EsWUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztRQUNyQzs7UUFHQSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2hGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO0FBQzdDLFlBQUEsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNuRSxnQkFBQSxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDO2dCQUNuRCxHQUFHLENBQUMsU0FBUyxHQUFHO21EQUNtQixJQUFJLENBQUE7bURBQ0osS0FBSyxDQUFBO2lCQUN2QztZQUNMO0FBQ0EsWUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNuQzs7UUFHQSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO0FBQzFDLFlBQUEsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxDQUFDO0FBQ2xFLFlBQUEsU0FBUyxDQUFDLFNBQVMsR0FBRyx1Q0FBdUM7UUFDakU7SUFDSjtBQUVBLElBQUEsY0FBYyxDQUFDLEtBQWEsRUFBQTtRQUN4QixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztBQUMxQyxRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUM7QUFDaEMsUUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUEsNkJBQUEsRUFBZ0MsS0FBSyxRQUFRO0FBQzlELFFBQUEsT0FBTyxJQUFJO0lBQ2Y7SUFFQSxPQUFPLEdBQUE7O0lBRVA7QUFDSDs7QUNoR00sTUFBTSxvQkFBb0IsR0FBRyxpQkFBaUI7QUFFL0MsTUFBTyxjQUFlLFNBQVFFLGlCQUFRLENBQUE7SUFNeEMsV0FBQSxDQUFZLElBQW1CLEVBQUUsTUFBd0IsRUFBQTtRQUNyRCxLQUFLLENBQUMsSUFBSSxDQUFDO1FBSlAsSUFBQSxDQUFBLGFBQWEsR0FBbUIsRUFBRTtRQUNsQyxJQUFBLENBQUEsZUFBZSxHQUFXLENBQUM7QUFJL0IsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07SUFDeEI7SUFFQSxXQUFXLEdBQUE7QUFDUCxRQUFBLE9BQU8sb0JBQW9CO0lBQy9CO0lBRUEsY0FBYyxHQUFBO0FBQ1YsUUFBQSxPQUFPLFlBQVk7SUFDdkI7SUFFQSxPQUFPLEdBQUE7QUFDSCxRQUFBLE9BQU8sT0FBTztJQUNsQjtJQUVNLE1BQU0sR0FBQTs7O0FBRVIsWUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQzs7QUFHL0MsWUFBQSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxDQUFDO0FBRXBGLFlBQUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQztBQUMzQixnQkFBQSxNQUFNLEVBQUUsYUFBYTtBQUNyQixnQkFBQSxLQUFLLEVBQUU7QUFDSCxvQkFBQSxNQUFNLEVBQUUsRUFBRTtBQUNWLG9CQUFBLGVBQWUsRUFBRSxDQUFDO0FBQ2xCLG9CQUFBLFVBQVUsRUFBRSxDQUFDO0FBQ2hCLGlCQUFBO0FBQ0osYUFBQSxDQUFDOztBQUdGLFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25FLFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RSxZQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRSxZQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RFLFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hELFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQTtBQUFBLElBQUE7QUFFRCxJQUFBLFlBQVksQ0FBQyxNQUFxQixFQUFBO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUFFO0FBRXpCLFFBQUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWE7UUFDakMsSUFBSSxNQUFNLEVBQUU7QUFDUixZQUFBLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRTtnQkFDckIsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQztZQUM3RjtpQkFBTztBQUNILGdCQUFBLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7WUFDbEU7UUFDSjtBQUVBLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDcEY7SUFFTSxPQUFPLEdBQUE7O0FBQ1QsWUFBQSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDaEIsZ0JBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7WUFDN0I7UUFDSixDQUFDLENBQUE7QUFBQSxJQUFBO0FBRUssSUFBQSxZQUFZLENBQUMsS0FBVSxFQUFBOztBQUN6QixZQUFBLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTztBQUVwQyxZQUFBLE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7WUFFaEYsSUFBSSxZQUFZLEVBQUU7O0FBRWQsZ0JBQUEsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUN0RSxvQkFBQSxNQUFNLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDOztBQUVyRSxvQkFBQSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUM7b0JBQzVELElBQUksS0FBSyxFQUFFO0FBQ1Asd0JBQUEsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNO0FBQ3JCLHdCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDdkQ7Z0JBQ0o7QUFFQSxnQkFBQSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBTyxNQUFjLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLGFBQUE7QUFDL0Usb0JBQUEsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQ3RCLHdCQUFBLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7b0JBQ3BDO0FBQU8seUJBQUEsSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFO0FBQzVCLHdCQUFBLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7b0JBQ3ZDO0FBQ0osZ0JBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDYjtpQkFBTztBQUNILGdCQUFBLElBQUlWLGVBQU0sQ0FBQyxRQUFRLENBQUM7WUFDeEI7UUFDSixDQUFDLENBQUE7QUFBQSxJQUFBO0FBRUssSUFBQSxlQUFlLENBQUMsS0FBVSxFQUFBOztBQUM1QixZQUFBLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTztBQUNwQyxZQUFBLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFFckYsSUFBSSxPQUFPLEVBQUU7QUFDVCxnQkFBQSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUM7Z0JBQzVELElBQUksS0FBSyxFQUFFO0FBQ1Asb0JBQUEsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNO0FBQ3JCLG9CQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDdkQ7WUFDSjtRQUNKLENBQUMsQ0FBQTtBQUFBLElBQUE7QUFFSyxJQUFBLGNBQWMsQ0FBQyxLQUFVLEVBQUE7O0FBQzNCLFlBQUEsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPO0FBQ3BDLFlBQUEsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxDQUFDLENBQUE7QUFBQSxJQUFBO0FBRUssSUFBQSxnQkFBZ0IsQ0FBQyxLQUFVLEVBQUE7O0FBQzdCLFlBQUEsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPO0FBQ3BDLFlBQUEsTUFBTSxPQUFPLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztZQUV2RixJQUFJLE9BQU8sRUFBRTtBQUNULGdCQUFBLElBQUlBLGVBQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkIsZ0JBQUEsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDO2dCQUM1RCxJQUFJLEtBQUssRUFBRTtBQUNQLG9CQUFBLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUTtBQUN2QixvQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3ZEO1lBQ0o7aUJBQU87QUFDSCxnQkFBQSxJQUFJQSxlQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3hCO1FBQ0osQ0FBQyxDQUFBO0FBQUEsSUFBQTtBQUVLLElBQUEsWUFBWSxDQUFDLE9BQWUsRUFBQTs7QUFDOUIsWUFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDO1lBRXpGLElBQUksT0FBTyxFQUFFO0FBQ1QsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLEtBQUssQ0FBQztBQUNqQixnQkFBQSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUM7Z0JBQzVELElBQUksS0FBSyxFQUFFO0FBQ1Asb0JBQUEsS0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFVO0FBQ3pCLG9CQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDdkQ7WUFDSjtpQkFBTztBQUNILGdCQUFBLElBQUlBLGVBQU0sQ0FBQyxNQUFNLENBQUM7WUFDdEI7UUFDSixDQUFDLENBQUE7QUFBQSxJQUFBO0FBRUssSUFBQSxhQUFhLENBQUMsS0FBVSxFQUFBOztBQUMxQixZQUFBLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTztBQUNwQyxZQUFBLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDdkMsQ0FBQyxDQUFBO0FBQUEsSUFBQTtBQUVLLElBQUEsZUFBZSxDQUFDLE9BQWUsRUFBQTs7QUFDakMsWUFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1lBRXZFLElBQUksT0FBTyxFQUFFO0FBQ1QsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLEtBQUssQ0FBQztBQUNqQixnQkFBQSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQztBQUNyRSxnQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkQ7aUJBQU87QUFDSCxnQkFBQSxJQUFJQSxlQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3RCO1FBQ0osQ0FBQyxDQUFBO0FBQUEsSUFBQTtBQUVLLElBQUEsYUFBYSxDQUFDLEtBQVUsRUFBQTs7QUFDMUIsWUFBQSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU87O0FBR3BDLFlBQUEsTUFBTSxZQUFZLEdBQUcsTUFBTSxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztZQUNoRixJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2YsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDcEI7WUFDSjs7WUFHQSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxNQUFNLHlEQUFxQjtZQUM3RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVO1lBRWxELElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDYixnQkFBQSxJQUFJQSxlQUFNLENBQUMsY0FBYyxDQUFDO2dCQUMxQjtZQUNKO1lBRUEsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQyxZQUFZLENBQUM7QUFDakUsWUFBQSxNQUFNLFFBQVEsR0FBRyxDQUFBLEVBQUcsVUFBVSxDQUFBLENBQUEsRUFBSSxRQUFRLEVBQUU7QUFFNUMsWUFBQSxJQUFJOztBQUVBLGdCQUFBLElBQUksRUFBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUEsRUFBRTtvQkFDbEQsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUNqRDs7QUFHQSxnQkFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDO2dCQUM5RCxJQUFJQSxlQUFNLENBQUMsQ0FBQSxPQUFBLEVBQVUsT0FBTyxDQUFDLFFBQVEsQ0FBQSxDQUFFLENBQUM7O0FBR3hDLGdCQUFBLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7O0FBR25DLGdCQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUM7WUFFNUQ7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNaLGdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDO0FBQzVDLGdCQUFBLElBQUlBLGVBQU0sQ0FBQyxpQkFBaUIsQ0FBQztZQUNqQztRQUNKLENBQUMsQ0FBQTtBQUFBLElBQUE7SUFFSyxTQUFTLEdBQUE7O0FBQ1gsWUFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDL0QsSUFBSSxPQUFPLEVBQUU7QUFDVCxnQkFBQSxJQUFJQSxlQUFNLENBQUMsbUJBQW1CLENBQUM7O2dCQUUvQixVQUFVLENBQUMsTUFBSztBQUNaLG9CQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUM5QixDQUFDLEVBQUUsSUFBSSxDQUFDO1lBQ1o7aUJBQU87QUFDSCxnQkFBQSxJQUFJQSxlQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3hCO1FBQ0osQ0FBQyxDQUFBO0FBQUEsSUFBQTtJQUVLLFlBQVksR0FBQTs7QUFDZCxZQUFBLE1BQU0sT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNsRSxJQUFJLE9BQU8sRUFBRTtBQUNULGdCQUFBLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDN0Q7UUFDSixDQUFDLENBQUE7QUFBQSxJQUFBOztJQUdLLE1BQU0sQ0FBQSxRQUFBLEVBQUE7NkRBQUMsTUFBc0IsRUFBRSxrQkFBMEIsQ0FBQyxFQUFBO0FBQzVELFlBQUEsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNO0FBQzNCLFlBQUEsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlOztZQUd0QyxJQUFJLFVBQVUsR0FBRyxDQUFDO0FBQ2xCLFlBQUEsSUFBSTtBQUNBLGdCQUFBLE1BQU0sT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDbEUsSUFBSSxPQUFPLEVBQUU7QUFDVCxvQkFBQSxVQUFVLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixJQUFJLENBQUM7Z0JBQzlDO1lBQ0o7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNaLGdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDO1lBQ2xEO0FBRUEsWUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLENBQUM7UUFDaEUsQ0FBQyxDQUFBO0FBQUEsSUFBQTtBQUNKOztBQzFORCxNQUFNLGFBQWEsR0FBa0M7QUFDcEQsSUFBQSxNQUFNLEVBQUU7QUFDUCxRQUFBLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRTtBQUMxRixRQUFBLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFO0FBQ2xHLFFBQUEsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQ3ZGLFFBQUEsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTTtBQUN4RixLQUFBO0FBQ0QsSUFBQSxRQUFRLEVBQUU7QUFDVCxRQUFBLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRTtBQUN2SSxRQUFBLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUUsV0FBVyxFQUFFLE1BQU07QUFDL0gsS0FBQTtBQUNELElBQUEsTUFBTSxFQUFFO0FBQ1AsUUFBQSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFO0FBQ3BHLFFBQUEsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRTtBQUM3RixRQUFBLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNO0FBQzlGLEtBQUE7QUFDRCxJQUFBLG1CQUFtQixFQUFFO0FBQ3BCLFFBQUEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUU7QUFDcEYsUUFBQSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRTtBQUN2RyxRQUFBLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsUUFBUTtBQUNqRztDQUNEO0FBRUQ7QUFDQSxTQUFTLGVBQWUsQ0FBQyxRQUFnQixFQUFBO0FBQ3hDLElBQUEsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUNyQztBQXFDQSxNQUFNLGdCQUFnQixHQUF1QjtBQUM1QyxJQUFBLE1BQU0sRUFBRSx1QkFBdUI7QUFDL0IsSUFBQSxVQUFVLEVBQUUsWUFBWTtBQUN4QixJQUFBLFdBQVcsRUFBRSxLQUFLO0FBQ2xCLElBQUEsZUFBZSxFQUFFO0NBQ2pCO0FBRUQ7QUFFYyxNQUFPLGdCQUFpQixTQUFRVyxlQUFNLENBQUE7QUFBcEQsSUFBQSxXQUFBLEdBQUE7O1FBRVMsSUFBQSxDQUFBLGlCQUFpQixHQUFrQixJQUFJO1FBQ3ZDLElBQUEsQ0FBQSxlQUFlLEdBQXVCLElBQUk7SUE4SG5EO0lBNUhPLE1BQU0sR0FBQTs7QUFDWCxZQUFBLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRTtBQUN6QixZQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUM7QUFFckQsWUFBQSxJQUFJLENBQUMsWUFBWSxDQUNoQixvQkFBb0IsRUFDcEIsQ0FBQyxJQUFJLEtBQUssSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUN4Qzs7WUFHRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBTyxHQUFlLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLGFBQUE7Z0JBQ3RFLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDcEIsQ0FBQyxDQUFBLENBQUM7O0FBR0YsWUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzs7WUFHNUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ3hCLENBQUMsQ0FBQTtBQUFBLElBQUE7SUFFRCxRQUFRLEdBQUE7QUFDUCxRQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixFQUFFO0lBQ3hCO0lBRUEsZ0JBQWdCLEdBQUE7UUFDZixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsUUFBQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRTtZQUNuRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxFQUFFLEdBQUcsSUFBSTtZQUM1RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFLO2dCQUNoRCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLENBQUMsRUFBRSxVQUFVLENBQUM7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsNEJBQUEsRUFBK0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUEsUUFBQSxDQUFVLENBQUM7UUFDcEY7SUFDRDtJQUVBLGdCQUFnQixHQUFBO0FBQ2YsUUFBQSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxJQUFJLEVBQUU7QUFDcEMsWUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztBQUM1QyxZQUFBLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJO1FBQzlCO0lBQ0Q7SUFFTSxXQUFXLEdBQUE7OztBQUVoQixZQUFBLElBQUk7Z0JBQ0gsTUFBTSxPQUFPLEdBQUcsTUFBTSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3hELElBQUksT0FBTyxFQUFFO0FBQ1osb0JBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQzs7Z0JBRXZDO1lBQ0Q7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLGdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDO1lBQ2pEOztZQUdBLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3pELElBQUksTUFBTSxFQUFFOztBQUVYLGdCQUFBLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxXQUFXO0FBQ2hDLG9CQUFBLElBQUksQ0FBQyxlQUFlO0FBQ3BCLHFCQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsRUFBRTtBQUN2RixvQkFBQSxJQUFJLE1BQU0sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxFQUFFO3dCQUMvQixJQUFJWCxlQUFNLENBQUMsQ0FBQSxXQUFBLEVBQWMsTUFBTSxDQUFDLGVBQWUsQ0FBQSxJQUFBLENBQU0sQ0FBQztvQkFDdkQ7O2dCQUVEO0FBQ0EsZ0JBQUEsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNO1lBQzlCOztBQUdBLFlBQUEsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO0FBQ3ZFLFlBQUEsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN0QixnQkFBQSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLGdCQUFBLElBQUksSUFBSSxDQUFDLElBQUksWUFBWSxjQUFjLEVBQUU7b0JBQ3hDLE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ3RELG9CQUFBLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDaEMsd0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsa0JBQWtCLENBQUM7b0JBQy9EO2dCQUNEO1lBQ0Q7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBO0lBRUssWUFBWSxHQUFBOztBQUNqQixZQUFBLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRztZQUU5QixJQUFJLElBQUksR0FBeUIsSUFBSTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO0FBRTlELFlBQUEsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN0QixnQkFBQSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqQjtpQkFBTztnQkFDTixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFDN0MsSUFBSSxPQUFPLEVBQUU7QUFDWixvQkFBQSxNQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN4RSxJQUFJLEdBQUcsT0FBTztnQkFDZjtZQUNEO0FBRUEsWUFBQSxJQUFJLENBQUMsSUFBSTtnQkFBRTtBQUNYLFlBQUEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFFMUIsWUFBQSxJQUFJQSxlQUFNLENBQUMsd0JBQXdCLENBQUM7WUFDcEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFFdEQsWUFBQSxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDOUQsSUFBSUEsZUFBTSxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFBLElBQUEsQ0FBTSxDQUFDO0FBQ2hELGdCQUFBLElBQUksSUFBSSxDQUFDLElBQUksWUFBWSxjQUFjLEVBQUU7QUFDeEMsb0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsa0JBQWtCLENBQUM7Z0JBQy9EO1lBQ0Q7aUJBQU87QUFDTixnQkFBQSxJQUFJQSxlQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3JCO1FBQ0QsQ0FBQyxDQUFBO0FBQUEsSUFBQTtJQUVLLFlBQVksR0FBQTs7QUFDakIsWUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNFLENBQUMsQ0FBQTtBQUFBLElBQUE7SUFFSyxZQUFZLEdBQUE7O1lBQ2pCLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4QixDQUFDLENBQUE7QUFBQSxJQUFBO0FBQ0Q7QUFHRDtBQUVBLE1BQU0sb0JBQXFCLFNBQVFZLHlCQUFnQixDQUFBO0lBTWxELFdBQUEsQ0FBWSxHQUFRLEVBQUUsTUFBd0IsRUFBQTtBQUM3QyxRQUFBLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO1FBTFgsSUFBQSxDQUFBLFNBQVMsR0FBVyxTQUFTO1FBRXJDLElBQUEsQ0FBQSxzQkFBc0IsR0FBYSxFQUFFO0FBSXBDLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO0lBQ3JCO0lBRUEsSUFBSSxHQUFBOztBQUVILFFBQUEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVELFFBQUEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUU7SUFDakM7SUFFQSxPQUFPLEdBQUE7QUFDTixRQUFBLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJO1FBQzVCLFdBQVcsQ0FBQyxLQUFLLEVBQUU7UUFFbkIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUM7O0FBR3JELFFBQUEsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRSxDQUFDO0FBRWhGLFFBQUEsTUFBTSxJQUFJLEdBQUc7WUFDWixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDeEMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsRCxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3RELEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN4RCxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTTtTQUMxQztBQUVELFFBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUc7QUFDbEIsWUFBQSxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDO0FBQ3JDLGdCQUFBLEdBQUcsRUFBRSxDQUFBLHdCQUFBLEVBQTJCLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxDQUFDLEVBQUUsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFBLENBQUU7Z0JBQzNFLElBQUksRUFBRSxHQUFHLENBQUM7QUFDVixhQUFBLENBQUM7QUFDRixZQUFBLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBSztBQUNwQixnQkFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLGdCQUFBLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQixZQUFBLENBQUM7QUFDRixRQUFBLENBQUMsQ0FBQztBQUVGLFFBQUEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQzs7QUFHckYsUUFBQSxRQUFRLElBQUksQ0FBQyxTQUFTO0FBQ3JCLFlBQUEsS0FBSyxTQUFTO2dCQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtnQkFDNUI7QUFDRCxZQUFBLEtBQUssZUFBZTtnQkFDbkIsSUFBSSxDQUFDLDBCQUEwQixFQUFFO2dCQUNqQztBQUNELFlBQUEsS0FBSyxTQUFTO2dCQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtnQkFDNUI7QUFDRCxZQUFBLEtBQUssSUFBSTtnQkFDUixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3ZCO0FBQ0QsWUFBQSxLQUFLLFFBQVE7Z0JBQ1osSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUMzQjtBQUNELFlBQUEsS0FBSyxlQUFlO2dCQUNuQixJQUFJLENBQUMsMkJBQTJCLEVBQUU7Z0JBQ2xDO0FBQ0QsWUFBQSxLQUFLLFFBQVE7Z0JBQ1osSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUMzQjs7SUFFSDtJQUVBLHFCQUFxQixHQUFBO0FBQ3BCLFFBQUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtRQUV2QyxJQUFJQyxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLFdBQVc7YUFDbkIsT0FBTyxDQUFDLDRCQUE0QjtBQUNwQyxhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7YUFDZixjQUFjLENBQUMsdUJBQXVCO2FBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNO0FBQ3BDLGFBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxhQUFBO1lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLO0FBQ25DLFlBQUEsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUwsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxPQUFPO2FBQ2YsT0FBTyxDQUFDLGFBQWE7QUFDckIsYUFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO2FBQ2YsY0FBYyxDQUFDLGtCQUFrQjthQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVTtBQUN4QyxhQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztBQUN2QyxZQUFBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVMLElBQUlBLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsTUFBTTthQUNkLE9BQU8sQ0FBQyxjQUFjO0FBQ3RCLGFBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTthQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVztBQUN6QyxhQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsS0FBSztBQUN4QyxZQUFBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVMLElBQUlBLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsVUFBVTthQUNsQixPQUFPLENBQUMsV0FBVztBQUNuQixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7YUFDZixjQUFjLENBQUMsSUFBSTthQUNuQixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQztBQUNyRCxhQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtBQUN6QixZQUFBLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsR0FBRztBQUMxQyxnQkFBQSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ2pDO1FBQ0QsQ0FBQyxDQUFBLENBQUMsQ0FBQzs7UUFHTCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7QUFHMUMsUUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO0FBQ2pDLFlBQUEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUU7UUFDakM7UUFFQSxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLE1BQU07YUFDZCxPQUFPLENBQUMsMEJBQTBCO2FBQ2xDLFNBQVMsQ0FBQyxNQUFNLElBQUc7WUFDbkIsTUFBTSxpQkFBaUIsR0FBRyxNQUFXLFNBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxhQUFBO0FBQ3BDLGdCQUFBLElBQUk7QUFDSCxvQkFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7b0JBQ2hFLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO3dCQUMxQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQ25EO3lCQUFPO3dCQUNOLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztvQkFDbkQ7Z0JBQ0Q7Z0JBQUUsT0FBTyxLQUFLLEVBQUU7O2dCQUVoQjtBQUNELFlBQUEsQ0FBQyxDQUFBO0FBRUQsWUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVM7QUFDNUIsaUJBQUEsTUFBTTtpQkFDTixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTs7QUFFbkIsZ0JBQUEsSUFBSTtBQUNILG9CQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7b0JBR2hFLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzFDLHdCQUFBLElBQUliLGVBQU0sQ0FBQyxtQkFBbUIsQ0FBQzt3QkFDL0I7b0JBQ0Q7Z0JBQ0Q7Z0JBQUUsT0FBTyxLQUFLLEVBQUU7QUFDZixvQkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2hDOztBQUdBLGdCQUFBLElBQUk7QUFDSCxvQkFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLHNCQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUV4RSxvQkFBQSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsd0JBQUEsSUFBSUEsZUFBTSxDQUFDLHdCQUF3QixDQUFDOztBQUVwQyx3QkFBQSxpQkFBaUIsRUFBRTtvQkFDcEI7QUFBTyx5QkFBQSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssNEJBQTRCLEVBQUU7QUFDM0Qsd0JBQUEsSUFBSUEsZUFBTSxDQUFDLG9CQUFvQixDQUFDO0FBQ2hDLHdCQUFBLGlCQUFpQixFQUFFO29CQUNwQjt5QkFBTzt3QkFDTixJQUFJQSxlQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBQ3hDO2dCQUNEO2dCQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2Ysb0JBQUEsSUFBSUEsZUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQy9CO1lBQ0QsQ0FBQyxDQUFBLENBQUM7O0FBR0gsWUFBQSxpQkFBaUIsRUFBRTs7WUFHbkIsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQztBQUN2RCxZQUFBLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQzdDLFFBQUEsQ0FBQyxDQUFDO0lBQ0o7SUFFQSwwQkFBMEIsR0FBQTtBQUN6QixRQUFBLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0I7QUFFdkMsUUFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUN2QixZQUFBLElBQUksRUFBRSwwQ0FBMEM7QUFDaEQsWUFBQSxHQUFHLEVBQUU7QUFDTCxTQUFBLENBQUM7UUFFRixJQUFJYSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLE9BQU87QUFDZixhQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7YUFDbkIsYUFBYSxDQUFDLFFBQVE7QUFDdEIsYUFBQSxNQUFNO2FBQ04sT0FBTyxDQUFDLE1BQUs7QUFDYixZQUFBLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFLO2dCQUMxRCxJQUFJLENBQUMsMEJBQTBCLEVBQUU7QUFDbEMsWUFBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7UUFDVixDQUFDLENBQUMsQ0FBQztBQUVMLFFBQUEsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO0FBQzVFLFFBQUEsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQztJQUM1QztBQUVNLElBQUEsdUJBQXVCLENBQUMsU0FBc0IsRUFBQTs7WUFDbkQsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNqQixZQUFBLElBQUk7QUFDSCxnQkFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFFakUsZ0JBQUEsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN4QixvQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQztvQkFDckY7Z0JBQ0Q7QUFFQSxnQkFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBRztBQUN0QixvQkFBQSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLENBQUM7O0FBR2xFLG9CQUFBLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7QUFDckQsb0JBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7O0FBR3JCLG9CQUFBLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7QUFDckQsb0JBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUUxRCxvQkFBQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDO29CQUMzRCxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ2xCLHdCQUFBLElBQUksRUFBRSxDQUFBLEtBQUEsRUFBUSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQSxFQUFBLENBQUk7QUFDdEMsd0JBQUEsR0FBRyxFQUFFO0FBQ0wscUJBQUEsQ0FBQztBQUVGLG9CQUFBLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTt3QkFDcEIsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUNsQiw0QkFBQSxJQUFJLEVBQUUsQ0FBQSxPQUFBLEVBQVUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUEsQ0FBQSxFQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFBLENBQUU7QUFDeEUsNEJBQUEsR0FBRyxFQUFFO0FBQ0wseUJBQUEsQ0FBQztvQkFDSDs7QUFHQSxvQkFBQSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDbEIsd0JBQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDeEIsNEJBQUEsSUFBSSxFQUFFLEtBQUs7QUFDWCw0QkFBQSxHQUFHLEVBQUU7QUFDTCx5QkFBQSxDQUFDO29CQUNIO3lCQUFPO0FBQ04sd0JBQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDeEIsNEJBQUEsSUFBSSxFQUFFLEtBQUs7QUFDWCw0QkFBQSxHQUFHLEVBQUU7QUFDTCx5QkFBQSxDQUFDO29CQUNIOztBQUdBLG9CQUFBLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUM7O29CQUczRCxJQUFJQyx3QkFBZSxDQUFDLFVBQVU7eUJBQzVCLE9BQU8sQ0FBQyxRQUFRO3lCQUNoQixVQUFVLENBQUMsTUFBTTt5QkFDakIsT0FBTyxDQUFDLE1BQUs7QUFDYix3QkFBQSxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBSztBQUMzRCw0QkFBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDO0FBQ3hDLHdCQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNWLG9CQUFBLENBQUMsQ0FBQzs7b0JBR0gsSUFBSUEsd0JBQWUsQ0FBQyxVQUFVO3lCQUM1QixPQUFPLENBQUMsT0FBTzt5QkFDZixVQUFVLENBQUMsTUFBTTt5QkFDakIsT0FBTyxDQUFDLE1BQVcsU0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxhQUFBO3dCQUNuQixNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxDQUFBLFNBQUEsRUFBWSxLQUFLLENBQUMsSUFBSSxDQUFBLElBQUEsQ0FBTSxDQUFDO3dCQUM3RCxJQUFJLFNBQVMsRUFBRTtBQUNkLDRCQUFBLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7NEJBQzlFLElBQUksT0FBTyxFQUFFO0FBQ1osZ0NBQUEsSUFBSWQsZUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNuQixnQ0FBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDOzRCQUN4QztpQ0FBTztBQUNOLGdDQUFBLElBQUlBLGVBQU0sQ0FBQyxNQUFNLENBQUM7NEJBQ25CO3dCQUNEO29CQUNELENBQUMsQ0FBQSxDQUFDO0FBQ0osZ0JBQUEsQ0FBQyxDQUFDO1lBQ0g7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLGdCQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO29CQUN6QixJQUFJLEVBQUUsQ0FBQSxVQUFBLEVBQWEsS0FBSyxDQUFBLENBQUU7QUFDMUIsb0JBQUEsR0FBRyxFQUFFO0FBQ0wsaUJBQUEsQ0FBQztZQUNIO1FBQ0QsQ0FBQyxDQUFBO0FBQUEsSUFBQTtJQUVELHFCQUFxQixHQUFBO0FBQ3BCLFFBQUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtBQUV2QyxRQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ3ZCLFlBQUEsSUFBSSxFQUFFLCtDQUErQztBQUNyRCxZQUFBLEdBQUcsRUFBRTtBQUNMLFNBQUEsQ0FBQztRQUVGLElBQUlhLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsUUFBUTtBQUNoQixhQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7YUFDbkIsYUFBYSxDQUFDLFNBQVM7QUFDdkIsYUFBQSxNQUFNO2FBQ04sT0FBTyxDQUFDLE1BQUs7QUFDYixZQUFBLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBSztBQUNyRCxnQkFBQSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM5QixZQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtRQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUwsUUFBQSxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLHlCQUF5QixFQUFFLENBQUM7QUFDN0UsUUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDO0lBQ3ZDO0FBRU0sSUFBQSxrQkFBa0IsQ0FBQyxTQUFzQixFQUFBOztZQUM5QyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ2pCLFlBQUEsSUFBSTtBQUNILGdCQUFBLE1BQU0sT0FBTyxHQUFHLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUU3RCxnQkFBQSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLG9CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO29CQUN0RjtnQkFDRDtBQUVBLGdCQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFHO0FBQ3hCLG9CQUFBLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQzs7QUFHbkUsb0JBQUEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztvQkFDdEQsSUFBSSxRQUFRLEdBQUcsS0FBSztBQUNwQixvQkFBQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUzt3QkFBRSxRQUFRLEdBQUcsU0FBUzs7b0JBRW5ELE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFHMUMsb0JBQUEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztBQUN0RCxvQkFBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM1RCxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFBRSxDQUFDOztBQUd6RixvQkFBQSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLENBQUM7O0FBRzVELG9CQUFBLE1BQU0sTUFBTSxHQUFHLElBQUlFLHdCQUFlLENBQUMsVUFBVTtBQUMzQyx5QkFBQSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU87QUFDdkIseUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtBQUN6Qix3QkFBQSxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDdEIsd0JBQUEsTUFBTSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDO29CQUNuRSxDQUFDLENBQUEsQ0FBQztBQUNILG9CQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDOztvQkFHakQsSUFBSUQsd0JBQWUsQ0FBQyxVQUFVO3lCQUM1QixPQUFPLENBQUMsUUFBUTt5QkFDaEIsVUFBVSxDQUFDLElBQUk7eUJBQ2YsT0FBTyxDQUFDLE1BQUs7QUFDYix3QkFBQSxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQUs7QUFDdkQsNEJBQUEsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztBQUNuQyx3QkFBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDVixvQkFBQSxDQUFDLENBQUM7O29CQUdILElBQUlBLHdCQUFlLENBQUMsVUFBVTt5QkFDNUIsT0FBTyxDQUFDLE9BQU87eUJBQ2YsVUFBVSxDQUFDLElBQUk7eUJBQ2YsUUFBUSxDQUFDLGFBQWE7eUJBQ3RCLE9BQU8sQ0FBQyxNQUFXLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTt3QkFDbkIsSUFBSSxPQUFPLENBQUMsQ0FBQSxVQUFBLEVBQWEsTUFBTSxDQUFDLElBQUksQ0FBQSxJQUFBLENBQU0sQ0FBQyxFQUFFO0FBQzVDLDRCQUFBLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQzFELDRCQUFBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7d0JBQ25DO29CQUNELENBQUMsQ0FBQSxDQUFDO0FBQ0osZ0JBQUEsQ0FBQyxDQUFDO1lBRUg7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLGdCQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO1lBQ3pGO1FBQ0QsQ0FBQyxDQUFBO0FBQUEsSUFBQTtJQUVLLGdCQUFnQixHQUFBOztBQUNyQixZQUFBLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUVqQixZQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ3ZCLGdCQUFBLElBQUksRUFBRSw2QkFBNkI7QUFDbkMsZ0JBQUEsR0FBRyxFQUFFO0FBQ0wsYUFBQSxDQUFDOztZQUdGLElBQUlELGdCQUFPLENBQUMsU0FBUztpQkFDbkIsT0FBTyxDQUFDLFFBQVE7QUFDaEIsaUJBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTtpQkFDbkIsYUFBYSxDQUFDLFFBQVE7QUFDdEIsaUJBQUEsTUFBTTtpQkFDTixPQUFPLENBQUMsTUFBSztBQUNiLGdCQUFBLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFLO0FBQ3hELG9CQUFBLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3pCLGdCQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNWLENBQUMsQ0FBQyxDQUFDOztBQUdMLFlBQUEsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO0FBQzVFLFlBQUEsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQztRQUMxQyxDQUFDLENBQUE7QUFBQSxJQUFBO0FBRUssSUFBQSxxQkFBcUIsQ0FBQyxTQUFzQixFQUFBOztZQUNqRCxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ2pCLFlBQUEsSUFBSTtBQUNILGdCQUFBLE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUVqRSxnQkFBQSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzFCLG9CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ3pCLHdCQUFBLElBQUksRUFBRSxtQkFBbUI7QUFDekIsd0JBQUEsR0FBRyxFQUFFO0FBQ0wscUJBQUEsQ0FBQztvQkFDRjtnQkFDRDtBQUVBLGdCQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFHO0FBQzFCLG9CQUFBLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQzs7QUFHbEUsb0JBQUEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQztBQUNyRCxvQkFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzs7QUFHckIsb0JBQUEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQztBQUNyRCxvQkFBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRTVELG9CQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUM7b0JBQzNELE9BQU8sQ0FBQyxVQUFVLENBQUM7d0JBQ2xCLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUEsR0FBQSxFQUFNLE9BQU8sQ0FBQyxVQUFVLENBQUEsQ0FBRTtBQUNuRCx3QkFBQSxHQUFHLEVBQUU7QUFDTCxxQkFBQSxDQUFDO0FBQ0Ysb0JBQUEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO3dCQUN4QixPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ2xCLDRCQUFBLElBQUksRUFBRSxDQUFBLEdBQUEsRUFBTSxPQUFPLENBQUMsV0FBVyxDQUFBLENBQUU7QUFDakMsNEJBQUEsR0FBRyxFQUFFO0FBQ0wseUJBQUEsQ0FBQztvQkFDSDs7QUFHQSxvQkFBQSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLENBQUM7O29CQUc1RCxJQUFJQyx3QkFBZSxDQUFDLFVBQVU7eUJBQzVCLE9BQU8sQ0FBQyxRQUFRO3lCQUNoQixVQUFVLENBQUMsSUFBSTt5QkFDZixPQUFPLENBQUMsTUFBSztBQUNiLHdCQUFBLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFLO0FBQzNELDRCQUFBLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7QUFDdEMsd0JBQUEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQ1Ysb0JBQUEsQ0FBQyxDQUFDOztvQkFHSCxJQUFJQSx3QkFBZSxDQUFDLFVBQVU7eUJBQzVCLE9BQU8sQ0FBQyxPQUFPO3lCQUNmLFVBQVUsQ0FBQyxJQUFJO3lCQUNmLFFBQVEsQ0FBQyxhQUFhO3lCQUN0QixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7d0JBQ25CLElBQUksT0FBTyxDQUFDLENBQUEsV0FBQSxFQUFjLE9BQU8sQ0FBQyxJQUFJLENBQUEsSUFBQSxDQUFNLENBQUMsRUFBRTtBQUM5Qyw0QkFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQzs0QkFDOUUsSUFBSSxPQUFPLEVBQUU7QUFDWixnQ0FBQSxJQUFJZCxlQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3JCLGdDQUFBLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7NEJBQ3RDO2lDQUFPO0FBQ04sZ0NBQUEsSUFBSUEsZUFBTSxDQUFDLE1BQU0sQ0FBQzs0QkFDbkI7d0JBQ0Q7b0JBQ0QsQ0FBQyxDQUFBLENBQUM7QUFDSixnQkFBQSxDQUFDLENBQUM7WUFFSDtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2YsZ0JBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDekIsb0JBQUEsSUFBSSxFQUFFLHFCQUFxQjtBQUMzQixvQkFBQSxHQUFHLEVBQUU7QUFDTCxpQkFBQSxDQUFDO1lBQ0g7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBO0lBRUssb0JBQW9CLEdBQUE7O0FBQ3pCLFlBQUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBRWpCLFlBQUEsSUFBSTtBQUNILGdCQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFFakUsSUFBSWEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsUUFBUTtxQkFDaEIsT0FBTyxDQUFDLHVCQUF1QjtBQUMvQixxQkFBQSxXQUFXLENBQUMsSUFBSSxJQUFJO3FCQUNuQixjQUFjLENBQUMsYUFBYTtxQkFDNUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzVDLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRixvQkFBQSxNQUFNLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7Z0JBQzlELENBQUMsQ0FBQSxDQUFDLENBQUM7Z0JBRUwsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsT0FBTztxQkFDZixPQUFPLENBQUMsc0JBQXNCO0FBQzlCLHFCQUFBLFdBQVcsQ0FBQyxJQUFJLElBQUk7cUJBQ25CLGNBQWMsQ0FBQyxhQUFhO3FCQUM1QixRQUFRLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDN0MscUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtBQUN6QixvQkFBQSxNQUFNLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pGLG9CQUFBLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztnQkFDOUQsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxRQUFRO3FCQUNoQixPQUFPLENBQUMsaUNBQWlDO0FBQ3pDLHFCQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7QUFDbkIscUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUI7QUFDbkMscUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtBQUN6QixvQkFBQSxNQUFNLENBQUMsbUJBQW1CLEdBQUcsS0FBSztBQUNsQyxvQkFBQSxNQUFNLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7Z0JBQzlELENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFTjtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2YsZ0JBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLENBQUM7WUFDekY7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBO0lBRUssMkJBQTJCLEdBQUE7O0FBQ2hDLFlBQUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBRWpCLFlBQUEsSUFBSTs7Z0JBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTTs7Z0JBRzFDLE1BQU0sY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUEsRUFBRyxNQUFNLENBQUEseUJBQUEsQ0FBMkIsQ0FBQztBQUN4RSxnQkFBQSxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRTtvQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFBLEtBQUEsRUFBUSxjQUFjLENBQUMsTUFBTSxDQUFBLENBQUUsQ0FBQztnQkFDakQ7QUFDQSxnQkFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUU7QUFFMUMsZ0JBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDdkIsb0JBQUEsSUFBSSxFQUFFLGtDQUFrQztBQUN4QyxvQkFBQSxHQUFHLEVBQUU7QUFDTCxpQkFBQSxDQUFDOztnQkFHRixJQUFJQSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxNQUFNO3FCQUNkLE9BQU8sQ0FBQyxjQUFjO0FBQ3RCLHFCQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7QUFDbkIscUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPO0FBQ3ZCLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQ3RCLG9CQUFBLElBQUk7d0JBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUFHLE1BQU0sMkJBQTJCLEVBQUU7QUFDbEUsNEJBQUEsTUFBTSxFQUFFLEtBQUs7QUFDYiw0QkFBQSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDL0MsNEJBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUMzQix5QkFBQSxDQUFDO3dCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUEsQ0FBRSxDQUFDO29CQUM3RDtvQkFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLHdCQUFBLElBQUliLGVBQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsd0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ3JCO2dCQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7O2dCQUdMLElBQUlhLGdCQUFPLENBQUMsU0FBUztxQkFDbkIsT0FBTyxDQUFDLE9BQU87cUJBQ2YsT0FBTyxDQUFDLG1DQUFtQztBQUMzQyxxQkFBQSxTQUFTLENBQUMsTUFBTSxJQUFJO0FBQ25CLHFCQUFBLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7QUFDcEIscUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0I7QUFDcEMscUJBQUEsaUJBQWlCO0FBQ2pCLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxDQUFDLG9CQUFvQixHQUFHLEtBQUs7QUFDbkMsb0JBQUEsSUFBSTt3QkFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFBLEVBQUcsTUFBTSwyQkFBMkIsRUFBRTtBQUNsRSw0QkFBQSxNQUFNLEVBQUUsS0FBSztBQUNiLDRCQUFBLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRTtBQUMvQyw0QkFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQzNCLHlCQUFBLENBQUM7d0JBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFOzRCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQSxLQUFBLEVBQVEsUUFBUSxDQUFDLE1BQU0sQ0FBQSxDQUFFLENBQUM7b0JBQzdEO29CQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2Ysd0JBQUEsSUFBSWIsZUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNwQix3QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDckI7Z0JBQ0QsQ0FBQyxDQUFBLENBQUMsQ0FBQzs7Z0JBR0wsSUFBSWEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsU0FBUztxQkFDakIsT0FBTyxDQUFDLGNBQWM7QUFDdEIscUJBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtBQUNmLHFCQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBQ3pDLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLHdCQUFBLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxHQUFHO0FBQzlCLHdCQUFBLElBQUk7NEJBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUFHLE1BQU0sMkJBQTJCLEVBQUU7QUFDbEUsZ0NBQUEsTUFBTSxFQUFFLEtBQUs7QUFDYixnQ0FBQSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDL0MsZ0NBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUMzQiw2QkFBQSxDQUFDOzRCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQ0FBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUEsQ0FBRSxDQUFDO3dCQUM3RDt3QkFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLDRCQUFBLElBQUliLGVBQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsNEJBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ3JCO29CQUNEO2dCQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7O2dCQUdMLElBQUlhLGdCQUFPLENBQUMsU0FBUztxQkFDbkIsT0FBTyxDQUFDLFNBQVM7cUJBQ2pCLE9BQU8sQ0FBQyx1QkFBdUI7QUFDL0IscUJBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtBQUNmLHFCQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDO0FBQzNDLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLHdCQUFBLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxHQUFHO0FBQ2hDLHdCQUFBLElBQUk7NEJBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUFHLE1BQU0sMkJBQTJCLEVBQUU7QUFDbEUsZ0NBQUEsTUFBTSxFQUFFLEtBQUs7QUFDYixnQ0FBQSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDL0MsZ0NBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUMzQiw2QkFBQSxDQUFDOzRCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQ0FBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUEsQ0FBRSxDQUFDO3dCQUM3RDt3QkFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLDRCQUFBLElBQUliLGVBQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsNEJBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ3JCO29CQUNEO2dCQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7O2dCQUdMLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO2dCQUUxQyxJQUFJYSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxTQUFTO3FCQUNqQixPQUFPLENBQUMsZUFBZTtBQUN2QixxQkFBQSxTQUFTLENBQUMsTUFBTSxJQUFJO0FBQ25CLHFCQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYztBQUM5QixxQkFBQSxRQUFRLENBQUMsQ0FBTyxLQUFLLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxhQUFBO0FBQ3pCLG9CQUFBLE1BQU0sQ0FBQyxjQUFjLEdBQUcsS0FBSztBQUM3QixvQkFBQSxJQUFJO3dCQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUEsRUFBRyxNQUFNLDJCQUEyQixFQUFFO0FBQ2xFLDRCQUFBLE1BQU0sRUFBRSxLQUFLO0FBQ2IsNEJBQUEsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0FBQy9DLDRCQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDM0IseUJBQUEsQ0FBQzt3QkFDRixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7NEJBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFBLEtBQUEsRUFBUSxRQUFRLENBQUMsTUFBTSxDQUFBLENBQUUsQ0FBQztvQkFDN0Q7b0JBQUUsT0FBTyxLQUFLLEVBQUU7QUFDZix3QkFBQSxJQUFJYixlQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3BCLHdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUNyQjtnQkFDRCxDQUFDLENBQUEsQ0FBQyxDQUFDO2dCQUVMLElBQUlhLGdCQUFPLENBQUMsU0FBUztxQkFDbkIsT0FBTyxDQUFDLFNBQVM7cUJBQ2pCLE9BQU8sQ0FBQyxlQUFlO0FBQ3ZCLHFCQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7QUFDbkIscUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlO0FBQy9CLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxDQUFDLGVBQWUsR0FBRyxLQUFLO0FBQzlCLG9CQUFBLElBQUk7d0JBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUFHLE1BQU0sMkJBQTJCLEVBQUU7QUFDbEUsNEJBQUEsTUFBTSxFQUFFLEtBQUs7QUFDYiw0QkFBQSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDL0MsNEJBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUMzQix5QkFBQSxDQUFDO3dCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUEsQ0FBRSxDQUFDO29CQUM3RDtvQkFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLHdCQUFBLElBQUliLGVBQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsd0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ3JCO2dCQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7Z0JBRUwsSUFBSWEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsU0FBUztxQkFDakIsT0FBTyxDQUFDLGVBQWU7QUFDdkIscUJBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTtBQUNuQixxQkFBQSxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWU7QUFDL0IscUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtBQUN6QixvQkFBQSxNQUFNLENBQUMsZUFBZSxHQUFHLEtBQUs7QUFDOUIsb0JBQUEsSUFBSTt3QkFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFBLEVBQUcsTUFBTSwyQkFBMkIsRUFBRTtBQUNsRSw0QkFBQSxNQUFNLEVBQUUsS0FBSztBQUNiLDRCQUFBLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRTtBQUMvQyw0QkFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQzNCLHlCQUFBLENBQUM7d0JBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFOzRCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQSxLQUFBLEVBQVEsUUFBUSxDQUFDLE1BQU0sQ0FBQSxDQUFFLENBQUM7b0JBQzdEO29CQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2Ysd0JBQUEsSUFBSWIsZUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNwQix3QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDckI7Z0JBQ0QsQ0FBQyxDQUFBLENBQUMsQ0FBQzs7Z0JBR0wsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7Z0JBRTVDLElBQUlhLGdCQUFPLENBQUMsU0FBUztxQkFDbkIsT0FBTyxDQUFDLE1BQU07cUJBQ2QsT0FBTyxDQUFDLDRCQUE0QjtBQUNwQyxxQkFBQSxXQUFXLENBQUMsUUFBUSxJQUFJO0FBQ3ZCLHFCQUFBLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUN6QixxQkFBQSxTQUFTLENBQUMsU0FBUyxFQUFFLE1BQU07QUFDM0IscUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0I7QUFDaEMscUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtBQUN6QixvQkFBQSxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsS0FBSztBQUMvQixvQkFBQSxJQUFJO3dCQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUEsRUFBRyxNQUFNLDJCQUEyQixFQUFFO0FBQ2xFLDRCQUFBLE1BQU0sRUFBRSxLQUFLO0FBQ2IsNEJBQUEsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0FBQy9DLDRCQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDM0IseUJBQUEsQ0FBQzt3QkFDRixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7NEJBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFBLEtBQUEsRUFBUSxRQUFRLENBQUMsTUFBTSxDQUFBLENBQUUsQ0FBQztvQkFDN0Q7b0JBQUUsT0FBTyxLQUFLLEVBQUU7QUFDZix3QkFBQSxJQUFJYixlQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3BCLHdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUNyQjtnQkFDRCxDQUFDLENBQUEsQ0FBQyxDQUFDOztnQkFHTCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFFMUMsSUFBSWEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsU0FBUztxQkFDakIsT0FBTyxDQUFDLHFDQUFxQztBQUM3QyxxQkFBQSxXQUFXLENBQUMsUUFBUSxJQUFJO0FBQ3ZCLHFCQUFBLFNBQVMsQ0FBQyxZQUFZLEVBQUUsS0FBSztBQUM3QixxQkFBQSxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU87QUFDM0IscUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNO0FBQ3RCLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLO0FBQ3JCLG9CQUFBLElBQUk7d0JBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUFHLE1BQU0sMkJBQTJCLEVBQUU7QUFDbEUsNEJBQUEsTUFBTSxFQUFFLEtBQUs7QUFDYiw0QkFBQSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDL0MsNEJBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUMzQix5QkFBQSxDQUFDO3dCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUEsQ0FBRSxDQUFDO29CQUM3RDtvQkFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLHdCQUFBLElBQUliLGVBQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsd0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ3JCO2dCQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7O2dCQUdMLElBQUlhLGdCQUFPLENBQUMsU0FBUztxQkFDbkIsT0FBTyxDQUFDLFFBQVE7cUJBQ2hCLE9BQU8sQ0FBQywwQkFBMEI7QUFDbEMscUJBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtBQUNmLHFCQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDO0FBQzlDLHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7QUFDekIsb0JBQUEsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLHdCQUFBLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxHQUFHO0FBQ25DLHdCQUFBLElBQUk7NEJBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUFHLE1BQU0sMkJBQTJCLEVBQUU7QUFDbEUsZ0NBQUEsTUFBTSxFQUFFLEtBQUs7QUFDYixnQ0FBQSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDL0MsZ0NBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUMzQiw2QkFBQSxDQUFDOzRCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQ0FBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUEsS0FBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUEsQ0FBRSxDQUFDO3dCQUM3RDt3QkFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLDRCQUFBLElBQUliLGVBQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsNEJBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ3JCO29CQUNEO2dCQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFTjtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2YsZ0JBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLENBQUM7QUFDeEYsZ0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDckI7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBO0lBRUssb0JBQW9CLEdBQUE7O0FBQ3pCLFlBQUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBRWpCLFlBQUEsSUFBSTtnQkFDSCxNQUFNLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sbURBQWU7QUFDN0QsZ0JBQUEsTUFBTSxRQUFRLEdBQUcsTUFBTSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUUvRCxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2Qsb0JBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLENBQUM7b0JBQ3hGO2dCQUNEOztnQkFHQSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFFMUMsSUFBSWEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsTUFBTTtxQkFDZCxPQUFPLENBQUMsb0RBQW9EO0FBQzVELHFCQUFBLFdBQVcsQ0FBQyxRQUFRLElBQUk7QUFDdkIscUJBQUEsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNO0FBQ3pCLHFCQUFBLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTTtBQUMzQixxQkFBQSxTQUFTLENBQUMsYUFBYSxFQUFFLE1BQU07QUFDL0IscUJBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSTtBQUM3QixxQkFBQSxRQUFRLENBQUMsQ0FBTyxLQUFLLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxhQUFBO0FBQ3pCLG9CQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUs7QUFDNUIsb0JBQUEsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDL0UsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxNQUFNO3FCQUNkLE9BQU8sQ0FBQyxXQUFXO0FBQ25CLHFCQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7cUJBQ2YsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUMvQyxxQkFBQSxRQUFRLENBQUMsQ0FBTyxLQUFLLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxhQUFBO29CQUN6QixRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNyRCxvQkFBQSxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMvRSxDQUFDLENBQUEsQ0FBQyxDQUFDOztnQkFHTCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFFMUMsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsTUFBTTtxQkFDZCxPQUFPLENBQUMsVUFBVTtBQUNsQixxQkFBQSxTQUFTLENBQUMsTUFBTSxJQUFJO0FBQ25CLHFCQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU87QUFDdEMscUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtBQUN6QixvQkFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQ3JDLG9CQUFBLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQzNGLENBQUMsQ0FBQSxDQUFDLENBQUM7Z0JBRUwsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO3FCQUNuQixPQUFPLENBQUMsWUFBWTtxQkFDcEIsT0FBTyxDQUFDLG1CQUFtQjtBQUMzQixxQkFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO3FCQUNmLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVztBQUMxRCxxQkFBQSxRQUFRLENBQUMsQ0FBTyxLQUFLLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxhQUFBO29CQUN6QixRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUs7QUFDekQsb0JBQUEsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDM0YsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxZQUFZO3FCQUNwQixPQUFPLENBQUMsbUJBQW1CO0FBQzNCLHFCQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7cUJBQ2YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXO0FBQzVELHFCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7b0JBQ3pCLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsS0FBSztBQUMzRCxvQkFBQSxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUMzRixDQUFDLENBQUEsQ0FBQyxDQUFDO2dCQUVMLElBQUlBLGdCQUFPLENBQUMsU0FBUztxQkFDbkIsT0FBTyxDQUFDLG9CQUFvQjtxQkFDNUIsT0FBTyxDQUFDLG9CQUFvQjtBQUM1QixxQkFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO3FCQUNmLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUztBQUMxRCxxQkFBQSxRQUFRLENBQUMsQ0FBTyxLQUFLLEtBQUksU0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxhQUFBO29CQUN6QixRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLEtBQUs7QUFDekQsb0JBQUEsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDM0YsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxrQkFBa0I7cUJBQzFCLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDeEIscUJBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtxQkFDZixRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU87QUFDeEQscUJBQUEsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsYUFBQTtvQkFDekIsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQ3ZELG9CQUFBLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQzNGLENBQUMsQ0FBQSxDQUFDLENBQUM7O2dCQUdMLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO2dCQUUxQyxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7cUJBQ25CLE9BQU8sQ0FBQyxRQUFRO3FCQUNoQixPQUFPLENBQUMsb0JBQW9CO3FCQUM1QixPQUFPLENBQUMsSUFBSSxJQUFHOztBQUFDLG9CQUFBLE9BQUE7QUFDZix5QkFBQSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQSxFQUFBLEdBQUEsTUFBQSxRQUFRLENBQUMsT0FBTyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLEtBQUssTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxjQUFjLEtBQUksQ0FBQyxDQUFDO0FBQzdELHlCQUFBLFFBQVEsQ0FBQyxDQUFPLEtBQUssS0FBSSxTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUE7d0JBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztBQUFFLDRCQUFBLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUM1Qyx3QkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLO0FBQUUsNEJBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUN4RCx3QkFBQSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDNUQsd0JBQUEsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDakYsQ0FBQyxDQUFBLENBQUM7QUFBQSxnQkFBQSxDQUFBLENBQUM7WUFFTjtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2YsZ0JBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLENBQUM7WUFDekY7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBO0FBQ0Q7QUFFRDtBQUVBLE1BQU0sZUFBZ0IsU0FBUUwsY0FBSyxDQUFBO0FBS2xDLElBQUEsV0FBQSxDQUFZLEdBQVEsRUFBRSxNQUF3QixFQUFFLE1BQTJCLEVBQUUsTUFBa0IsRUFBQTtRQUM5RixLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ1YsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07QUFDcEIsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07QUFDcEIsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07SUFDckI7SUFFQSxNQUFNLEdBQUE7QUFDTCxRQUFBLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJO1FBQzFCLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFFakIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFFbkUsUUFBQSxNQUFNLE1BQU0sR0FBaUIsSUFBSSxDQUFDLE1BQU0sR0FBRSxNQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsRUFBTSxJQUFJLENBQUMsTUFBTSxDQUFBLEdBQUs7QUFDL0QsWUFBQSxFQUFFLEVBQUUsRUFBRTtBQUNOLFlBQUEsSUFBSSxFQUFFLEVBQUU7QUFDUixZQUFBLElBQUksRUFBRSxLQUFLO0FBQ1gsWUFBQSxPQUFPLEVBQUUsSUFBSTtBQUNiLFlBQUEsR0FBRyxFQUFFLEVBQUU7QUFDUCxZQUFBLFFBQVEsRUFBRSxFQUFFO0FBQ1osWUFBQSxRQUFRLEVBQUUsRUFBRTtBQUNaLFlBQUEsUUFBUSxFQUFFLFdBQVc7QUFDckIsWUFBQSxjQUFjLEVBQUUsQ0FBQztBQUNqQixZQUFBLFNBQVMsRUFBRSxFQUFFO0FBQ2IsWUFBQSxTQUFTLEVBQUUsS0FBSztBQUNoQixZQUFBLEtBQUssRUFBRTtTQUNQOztRQUdELElBQUlLLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsSUFBSTtBQUNaLGFBQUEsV0FBVyxDQUFDLFFBQVEsSUFBSTtBQUN2QixhQUFBLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUTtBQUN6QixhQUFBLFNBQVMsQ0FBQyxTQUFTLEVBQUUsY0FBYztBQUNuQyxhQUFBLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtBQUN6QixhQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSTthQUNwQixRQUFRLENBQUMsS0FBSyxJQUFHO0FBQ2pCLFlBQUEsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFZO0FBQzFCLFlBQUEsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLElBQUk7QUFDWixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSTtBQUNwQixhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQztBQUUxQyxRQUFBLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7WUFDMUIsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2lCQUNuQixPQUFPLENBQUMsS0FBSztpQkFDYixPQUFPLENBQUMsYUFBYTtBQUNyQixpQkFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO0FBQ2YsaUJBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHO0FBQ25CLGlCQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUMxQztBQUVBLFFBQUEsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUM5QixJQUFJQSxnQkFBTyxDQUFDLFNBQVM7aUJBQ25CLE9BQU8sQ0FBQyxLQUFLO2lCQUNiLE9BQU8sQ0FBQyxvQkFBb0I7QUFDNUIsaUJBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtBQUNmLGlCQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUU7QUFDOUIsaUJBQUEsUUFBUSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQy9DO0FBRUEsUUFBQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQzVCLElBQUlBLGdCQUFPLENBQUMsU0FBUztpQkFDbkIsT0FBTyxDQUFDLE1BQU07aUJBQ2QsT0FBTyxDQUFDLFdBQVc7aUJBQ25CLE9BQU8sQ0FBQyxJQUFJLElBQUc7O0FBQUMsZ0JBQUEsT0FBQTtxQkFDZixRQUFRLENBQUMsQ0FBQSxDQUFBLEVBQUEsR0FBQSxNQUFNLENBQUMsS0FBSyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxLQUFJLEVBQUU7cUJBQ2pDLGNBQWMsQ0FBQyw0QkFBNEI7cUJBQzNDLFFBQVEsQ0FBQyxLQUFLLElBQUc7b0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztBQUFFLHdCQUFBLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNwQyxvQkFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLO0FBQzFCLGdCQUFBLENBQUMsQ0FBQztBQUFBLFlBQUEsQ0FBQSxDQUFDO1lBRUwsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2lCQUNuQixPQUFPLENBQUMsTUFBTTtpQkFDZCxPQUFPLENBQUMsZ0JBQWdCO2lCQUN4QixPQUFPLENBQUMsSUFBSSxJQUFHOztBQUFDLGdCQUFBLE9BQUE7QUFDZixxQkFBQSxRQUFRLENBQUMsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxNQUFNLENBQUMsS0FBSyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBQSxFQUFBLENBQUUsYUFBYSxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFJLGFBQWE7cUJBQ2pFLGNBQWMsQ0FBQyxhQUFhO3FCQUM1QixRQUFRLENBQUMsS0FBSyxJQUFHO29CQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7QUFBRSx3QkFBQSxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUU7b0JBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakUsZ0JBQUEsQ0FBQyxDQUFDO0FBQUEsWUFBQSxDQUFBLENBQUM7WUFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7aUJBQ25CLE9BQU8sQ0FBQyxPQUFPO2lCQUNmLFNBQVMsQ0FBQyxNQUFNLElBQUc7O0FBQUMsZ0JBQUEsT0FBQTtxQkFDbkIsUUFBUSxDQUFDLENBQUEsRUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLE1BQU0sQ0FBQyxLQUFLLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBRSxTQUFTLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLElBQUk7cUJBQ3hDLFFBQVEsQ0FBQyxLQUFLLElBQUc7b0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztBQUFFLHdCQUFBLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNwQyxvQkFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLO0FBQy9CLGdCQUFBLENBQUMsQ0FBQztBQUFBLFlBQUEsQ0FBQSxDQUFDO1FBQ047UUFFQSxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLE1BQU07QUFDZCxhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUN0QyxhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbkUsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxPQUFPO2FBQ2YsT0FBTyxDQUFDLFdBQVc7QUFDbkIsYUFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO0FBQ2YsYUFBQSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDakMsYUFBQSxRQUFRLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELElBQUlBLGdCQUFPLENBQUMsU0FBUztBQUNuQixhQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7YUFDbkIsYUFBYSxDQUFDLElBQUk7QUFDbEIsYUFBQSxNQUFNO2FBQ04sT0FBTyxDQUFDLE1BQVcsU0FBQSxDQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLGFBQUE7QUFDbkIsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNqQixnQkFBQSxJQUFJYixlQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNuQjtZQUNEOztBQUdBLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUU7QUFDZixnQkFBQSxNQUFNLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDM0M7QUFFQSxZQUFBLElBQUk7QUFDSCxnQkFBQSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsb0JBQUEsTUFBTSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDO2dCQUNuRTtxQkFBTztBQUNOLG9CQUFBLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7Z0JBQ3hEO2dCQUNBLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNaLGdCQUFBLElBQUlBLGVBQU0sQ0FBQyxNQUFNLENBQUM7WUFDbkI7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLGdCQUFBLElBQUlBLGVBQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQzdCO1FBQ0QsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNOO0lBRUEsT0FBTyxHQUFBO0FBQ04sUUFBQSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSTtRQUMxQixTQUFTLENBQUMsS0FBSyxFQUFFO0lBQ2xCO0FBQ0E7QUFFRDtBQUNBLE1BQU0sa0JBQW1CLFNBQVFRLGNBQUssQ0FBQTtBQUtyQyxJQUFBLFdBQUEsQ0FBWSxHQUFRLEVBQUUsTUFBd0IsRUFBRSxPQUF5QixFQUFFLE1BQWtCLEVBQUE7UUFDNUYsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUNWLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO0FBQ3BCLFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO0FBQ3RCLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO0lBQ3JCO0lBRUEsTUFBTSxHQUFBO0FBQ0wsUUFBQSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUk7UUFDbkMsU0FBUyxDQUFDLEtBQUssRUFBRTs7QUFHakIsUUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLDZCQUE2QixDQUFDO1FBRS9DLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBRXRFLFFBQUEsTUFBTSxPQUFPLEdBQWMsSUFBSSxDQUFDLE9BQU8sR0FBRSxNQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsRUFBTSxJQUFJLENBQUMsT0FBTyxDQUFBLEdBQUs7QUFDL0QsWUFBQSxFQUFFLEVBQUUsRUFBRTtBQUNOLFlBQUEsSUFBSSxFQUFFLEVBQUU7QUFDUixZQUFBLFFBQVEsRUFBRSxRQUFRO0FBQ2xCLFlBQUEsT0FBTyxFQUFFLEVBQUU7QUFDWCxZQUFBLFFBQVEsRUFBRSxFQUFFO0FBQ1osWUFBQSxVQUFVLEVBQUUsUUFBUTtBQUNwQixZQUFBLFdBQVcsRUFBRSxHQUFHO0FBQ2hCLFlBQUEsV0FBVyxFQUFFO1NBQ2I7O1FBR0QsSUFBSUssZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxNQUFNO2FBQ2QsT0FBTyxDQUFDLHNCQUFzQjtBQUM5QixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTthQUNuQixjQUFjLENBQUMsbUJBQW1CO0FBQ2xDLGFBQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztBQUMxQixhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQzs7UUFHekMsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxNQUFNO2FBQ2QsT0FBTyxDQUFDLE1BQU07QUFDZCxhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSTthQUNyQixjQUFjLENBQUMsWUFBWTtBQUMzQixhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQzs7UUFHM0MsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxPQUFPO0FBQ2YsYUFBQSxXQUFXLENBQUMsUUFBUSxJQUFJO0FBQ3ZCLGFBQUEsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRO0FBQzVCLGFBQUEsU0FBUyxDQUFDLFVBQVUsRUFBRSxVQUFVO0FBQ2hDLGFBQUEsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlO0FBQ25DLGFBQUEsU0FBUyxDQUFDLG1CQUFtQixFQUFFLFVBQVU7QUFDekMsYUFBQSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDekIsUUFBUSxDQUFDLEtBQUssSUFBRztBQUNqQixZQUFBLE9BQU8sQ0FBQyxRQUFRLEdBQUcsS0FBSzs7WUFFeEIsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU0sRUFBRTtBQUNYLGdCQUFBLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUs7QUFDakMsZ0JBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2xDLGdCQUFBLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUNwQixvQkFBQSxPQUFPLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRO0FBQ2xDLG9CQUFBLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDdkM7WUFDRDtRQUNELENBQUMsQ0FBQyxDQUFDOztRQUdMLElBQUlBLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsU0FBUztBQUNqQixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTzthQUN4QixjQUFjLENBQUMsUUFBUTtBQUN2QixhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQzs7QUFHOUMsUUFBQSxJQUFJLFlBQTJCO1FBQy9CLElBQUlBLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsT0FBTzthQUNmLE9BQU8sQ0FBQyxvQkFBb0I7YUFDNUIsT0FBTyxDQUFDLElBQUksSUFBRztZQUNmLFlBQVksR0FBRyxJQUFJO0FBQ25CLFlBQUEsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUTtpQkFDcEMsY0FBYyxDQUFDLDJCQUEyQjtpQkFDMUMsUUFBUSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUM5QyxRQUFBLENBQUMsQ0FBQzs7UUFHSCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLE1BQU07YUFDZCxPQUFPLENBQUMsaURBQWlEO0FBQ3pELGFBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtBQUNmLGFBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2FBQzNCLGNBQWMsQ0FBQyxRQUFRO0FBQ3ZCLGFBQUEsUUFBUSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDOztRQUdqRCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLElBQUk7YUFDWixPQUFPLENBQUMsWUFBWTtBQUNwQixhQUFBLFNBQVMsQ0FBQyxNQUFNLElBQUk7QUFDbkIsYUFBQSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHO0FBQ25CLGFBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0FBQzVCLGFBQUEsaUJBQWlCO0FBQ2pCLGFBQUEsUUFBUSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDOztRQUdsRCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLElBQUk7YUFDWixPQUFPLENBQUMsUUFBUTtBQUNoQixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVzthQUM1QixjQUFjLENBQUMsT0FBTztBQUN0QixhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQzs7UUFHbEQsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO0FBQ25CLGFBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTthQUNuQixhQUFhLENBQUMsSUFBSTtBQUNsQixhQUFBLE1BQU07YUFDTixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtZQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDakMsZ0JBQUEsSUFBSWIsZUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDeEI7WUFDRDs7WUFHQSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDckMsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLHFCQUFxQixDQUFDO2dCQUNqQztZQUNEO0FBRUEsWUFBQSxJQUFJO0FBQ0gsZ0JBQUEsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLG9CQUFBLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQztnQkFDeEU7cUJBQU87QUFDTixvQkFBQSxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO2dCQUM1RDtnQkFDQSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNiLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDWixnQkFBQSxJQUFJQSxlQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZCO1lBQUUsT0FBTyxLQUFLLEVBQUU7QUFDZixnQkFBQSxJQUFJQSxlQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUM3QjtRQUNELENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTjtJQUVBLE9BQU8sR0FBQTtBQUNOLFFBQUEsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUk7UUFDMUIsU0FBUyxDQUFDLEtBQUssRUFBRTtJQUNsQjtBQUNBO0FBRUQsTUFBTSxvQkFBcUIsU0FBUVEsY0FBSyxDQUFBO0FBT3ZDLElBQUEsV0FBQSxDQUFZLEdBQVEsRUFBRSxNQUF3QixFQUFFLEtBQThCLEVBQUUsTUFBa0IsRUFBQTtRQUNqRyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ1YsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07QUFDcEIsUUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUs7QUFDbEIsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07O1FBRXBCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFFLE1BQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxFQUFNLEtBQUssQ0FBQSxHQUFLO0FBQ3BDLFlBQUEsRUFBRSxFQUFFLEVBQUU7QUFDTixZQUFBLElBQUksRUFBRSxFQUFFO0FBQ1IsWUFBQSxPQUFPLEVBQUUsSUFBSTtBQUNiLFlBQUEsV0FBVyxFQUFFLEVBQUU7QUFDZixZQUFBLFNBQVMsRUFBRTtBQUNWLGdCQUFBLElBQUksRUFBRSxXQUFXO0FBQ2pCLGdCQUFBLG1CQUFtQixFQUFFLEVBQUU7QUFDdkIsZ0JBQUEsc0JBQXNCLEVBQUU7QUFDeEIsYUFBQTtBQUNELFlBQUEsT0FBTyxFQUFFO1NBQ1Q7O0FBRUQsUUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDM0IsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRztBQUN2QixnQkFBQSxJQUFJLEVBQUUsV0FBVztBQUNqQixnQkFBQSxtQkFBbUIsRUFBRSxFQUFFO0FBQ3ZCLGdCQUFBLHNCQUFzQixFQUFFO2FBQ3hCO1FBQ0Y7SUFDRDtJQUVNLE1BQU0sR0FBQTs7O0FBQ1gsWUFBQSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUk7WUFDbkMsU0FBUyxDQUFDLEtBQUssRUFBRTs7QUFHakIsWUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLDZCQUE2QixDQUFDO1lBRS9DLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDOztZQUdoRSxJQUFJSyxnQkFBTyxDQUFDLFNBQVM7aUJBQ25CLE9BQU8sQ0FBQyxNQUFNO2lCQUNkLE9BQU8sQ0FBQyxzQkFBc0I7QUFDOUIsaUJBQUEsT0FBTyxDQUFDLElBQUksSUFBSTtBQUNmLGlCQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7aUJBQ3ZCLGNBQWMsQ0FBQyxVQUFVO0FBQ3pCLGlCQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7O1lBRzdDLElBQUlBLGdCQUFPLENBQUMsU0FBUztpQkFDbkIsT0FBTyxDQUFDLE1BQU07QUFDZCxpQkFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO0FBQ2YsaUJBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtpQkFDekIsY0FBYyxDQUFDLE1BQU07QUFDckIsaUJBQUEsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQzs7WUFHL0MsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2lCQUNuQixPQUFPLENBQUMsSUFBSTtpQkFDWixPQUFPLENBQUMsU0FBUztBQUNqQixpQkFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO2lCQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxFQUFFO2lCQUN0QyxjQUFjLENBQUMsT0FBTztBQUN0QixpQkFBQSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDOztZQUd0RCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7aUJBQ25CLE9BQU8sQ0FBQyxPQUFPO0FBQ2YsaUJBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTtBQUNuQixpQkFBQSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO0FBQzVCLGlCQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7OztBQUlsRCxZQUFBLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQztZQUN2RSxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs7QUFHaEQsWUFBQSxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO0FBQy9FLFlBQUEsVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQzdFLFlBQUEsVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ2xFLFlBQUEsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBRSxJQUFJLEtBQUksV0FBVztBQUM3RCxZQUFBLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtBQUNoRCxnQkFBQSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO29CQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQStCO2dCQUN4RTs7Z0JBRUEsTUFBTSxJQUFJLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNuRSxDQUFDLENBQUEsQ0FBQzs7QUFHRixZQUFBLE1BQU0sZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRSxDQUFDOztZQUc3RSxNQUFNLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUFJbEUsWUFBQSxNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQztZQUMzRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDOztBQUdoRCxZQUFBLE1BQU0sWUFBWSxHQUFHLElBQUlDLHdCQUFlLENBQUMsZ0JBQWdCLENBQUM7WUFDMUQ7aUJBQ0UsYUFBYSxDQUFDLFNBQVM7QUFDdkIsaUJBQUEsTUFBTTtpQkFDTixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtBQUNuQixnQkFBQSxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxLQUFJOztvQkFFM0UsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLFlBQVksQ0FBQyxFQUFFLENBQUM7b0JBQ3RFLElBQUksTUFBTSxFQUFFO0FBQ1gsd0JBQUEsSUFBSWQsZUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDdkI7b0JBQ0Q7b0JBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQzs7b0JBRXRDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixnQkFBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDVixDQUFDLENBQUEsQ0FBQzs7QUFHSCxZQUFBLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixFQUFFLENBQUM7WUFDOUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFOztZQUd4QixJQUFJYSxnQkFBTyxDQUFDLFNBQVM7QUFDbkIsaUJBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTtpQkFDbkIsYUFBYSxDQUFDLElBQUk7QUFDbEIsaUJBQUEsTUFBTTtpQkFDTixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtBQUNuQixnQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUN6QyxvQkFBQSxJQUFJYixlQUFNLENBQUMsWUFBWSxDQUFDO29CQUN4QjtnQkFDRDs7QUFHQSxnQkFBQSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLG9CQUFBLElBQUlBLGVBQU0sQ0FBQyxxQkFBcUIsQ0FBQztvQkFDakM7Z0JBQ0Q7QUFFQSxnQkFBQSxJQUFJO0FBQ0gsb0JBQUEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUNmLE1BQU0saUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQ2xGO3lCQUFPO0FBQ04sd0JBQUEsTUFBTSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDbEU7b0JBQ0EsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDYixJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1osb0JBQUEsSUFBSUEsZUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDckI7Z0JBQUUsT0FBTyxLQUFLLEVBQUU7QUFDZixvQkFBQSxJQUFJQSxlQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDN0I7WUFDRCxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFBO0FBQUEsSUFBQTtJQUVLLHdCQUF3QixDQUFDLFNBQXNCLEVBQUUsTUFBd0IsRUFBQTs7OztZQUU5RSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBRWpCLFlBQUEsSUFBSTtBQUNILGdCQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUM7QUFDbkQsZ0JBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFFM0UsZ0JBQUEsTUFBTSxRQUFRLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUVqRSxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO0FBRW5FLGdCQUFBLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDMUIsb0JBQUEsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDMUMsd0JBQUEsSUFBSSxFQUFFLGtDQUFrQztBQUN4Qyx3QkFBQSxHQUFHLEVBQUU7QUFDTCxxQkFBQSxDQUFDO29CQUNGO2dCQUNEO2dCQUVBLE1BQU0sSUFBSSxHQUFHLENBQUEsQ0FBQSxFQUFBLEdBQUEsTUFBTSxDQUFDLFNBQVMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxJQUFJLEtBQUksV0FBVztBQUNsRCxnQkFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQztBQUVqRCxnQkFBQSxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7O29CQUV6QixJQUFJYSxnQkFBTyxDQUFDLFNBQVM7eUJBQ25CLE9BQU8sQ0FBQyxNQUFNO3lCQUNkLFdBQVcsQ0FBQyxRQUFRLElBQUc7O0FBQ3ZCLHdCQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQztBQUM3Qix3QkFBQSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBRzs0QkFDMUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDN0Msd0JBQUEsQ0FBQyxDQUFDO0FBQ0Ysd0JBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBLENBQUEsRUFBQSxHQUFBLE1BQU0sQ0FBQyxTQUFTLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsbUJBQW1CLEtBQUksRUFBRSxDQUFDO0FBQzlELHdCQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFHO0FBQ3pCLDRCQUFBLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUNyQixnQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLEtBQUs7NEJBQzdDO0FBQ0Qsd0JBQUEsQ0FBQyxDQUFDO0FBQ0gsb0JBQUEsQ0FBQyxDQUFDO29CQUVILElBQUlBLGdCQUFPLENBQUMsU0FBUzt5QkFDbkIsT0FBTyxDQUFDLE1BQU07eUJBQ2QsV0FBVyxDQUFDLFFBQVEsSUFBRzs7QUFDdkIsd0JBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDO0FBQzdCLHdCQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFHOzRCQUMxQixRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUM3Qyx3QkFBQSxDQUFDLENBQUM7QUFDRix3QkFBQSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQSxFQUFBLEdBQUEsTUFBTSxDQUFDLFNBQVMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxzQkFBc0IsS0FBSSxFQUFFLENBQUM7QUFDakUsd0JBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUc7QUFDekIsNEJBQUEsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3JCLGdDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEdBQUcsS0FBSzs0QkFDaEQ7QUFDRCx3QkFBQSxDQUFDLENBQUM7QUFDSCxvQkFBQSxDQUFDLENBQUM7Z0JBQ0o7cUJBQU87O29CQUVOLElBQUlBLGdCQUFPLENBQUMsU0FBUzt5QkFDbkIsT0FBTyxDQUFDLE1BQU07eUJBQ2QsV0FBVyxDQUFDLFFBQVEsSUFBRzs7QUFDdkIsd0JBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDO0FBQzdCLHdCQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFHOzRCQUMxQixRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUM3Qyx3QkFBQSxDQUFDLENBQUM7QUFDRix3QkFBQSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQSxFQUFBLEdBQUEsTUFBTSxDQUFDLFNBQVMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxtQkFBbUIsS0FBSSxFQUFFLENBQUM7QUFDOUQsd0JBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUc7QUFDekIsNEJBQUEsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3JCLGdDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsS0FBSzs7QUFFNUMsZ0NBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFOzRCQUM3QztBQUNELHdCQUFBLENBQUMsQ0FBQztBQUNILG9CQUFBLENBQUMsQ0FBQztnQkFDSjtZQUVEO1lBQUUsT0FBTyxLQUFLLEVBQUU7QUFDZixnQkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLEtBQUssQ0FBQztBQUN4RCxnQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtvQkFDdkIsSUFBSSxFQUFFLENBQUEsZUFBQSxFQUFrQixLQUFLLENBQUEsQ0FBRTtBQUMvQixvQkFBQSxHQUFHLEVBQUU7QUFDTCxpQkFBQSxDQUFDO1lBQ0g7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBOztJQUdELGlCQUFpQixHQUFBO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CO1lBQUU7QUFFaEMsUUFBQSxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFO1FBRWpDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7QUFFckMsWUFBQSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN6QyxnQkFBQSxHQUFHLEVBQUUsbUJBQW1CO0FBQ3hCLGdCQUFBLElBQUksRUFBRTtBQUNOLGFBQUEsQ0FBQztRQUNIO2FBQU87QUFDTixZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEtBQUk7QUFDN0MsZ0JBQUEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQztBQUN0RCxvQkFBQSxHQUFHLEVBQUU7QUFDTCxpQkFBQSxDQUFDO0FBRUYsZ0JBQUEsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztnQkFDL0QsVUFBVSxDQUFDLFVBQVUsQ0FBQztvQkFDckIsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQSxFQUFBLEVBQUssTUFBTSxDQUFDLElBQUksQ0FBQSxDQUFBLENBQUc7QUFDdkMsb0JBQUEsR0FBRyxFQUFFO0FBQ0wsaUJBQUEsQ0FBQzs7Z0JBR0YsSUFBSUMsd0JBQWUsQ0FBQyxVQUFVO3FCQUM1QixPQUFPLENBQUMsR0FBRztxQkFDWCxVQUFVLENBQUMsSUFBSTtxQkFDZixPQUFPLENBQUMsTUFBSztvQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs7b0JBRXBDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixnQkFBQSxDQUFDLENBQUM7QUFDSixZQUFBLENBQUMsQ0FBQztRQUNIO0lBQ0Q7SUFFQSxPQUFPLEdBQUE7QUFDTixRQUFBLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJO1FBQzFCLFNBQVMsQ0FBQyxLQUFLLEVBQUU7SUFDbEI7QUFDQTtBQXVLRDtBQUNBLE1BQU0sa0JBQW1CLFNBQVFOLGNBQUssQ0FBQTtBQVdyQyxJQUFBLFdBQUEsQ0FBWSxHQUFRLEVBQUUsTUFBd0IsRUFBRSxXQUE2QixFQUFFLFNBQTRDLEVBQUE7UUFDMUgsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7UUFOWCxJQUFBLENBQUEsZ0JBQWdCLEdBQXNCLEVBQUU7UUFDeEMsSUFBQSxDQUFBLGdCQUFnQixHQUFrQixJQUFJO1FBQ3RDLElBQUEsQ0FBQSxhQUFhLEdBQVksSUFBSTtRQUM3QixJQUFBLENBQUEsU0FBUyxHQUE2QixFQUFFO0FBSXZDLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO0FBQ3BCLFFBQUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXO0FBQzlCLFFBQUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTO0FBQzFCLFFBQUEsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJO1FBQ3pCLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtJQUMzQjtJQUVBLG1CQUFtQixHQUFBO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUc7QUFDaEIsWUFBQSxFQUFFLEVBQUUsRUFBRTtBQUNOLFlBQUEsSUFBSSxFQUFFLEVBQUU7QUFDUixZQUFBLElBQUksRUFBRSxLQUFLO0FBQ1gsWUFBQSxPQUFPLEVBQUUsSUFBSTtBQUNiLFlBQUEsR0FBRyxFQUFFLEVBQUU7QUFDUCxZQUFBLFFBQVEsRUFBRSxFQUFFO0FBQ1osWUFBQSxRQUFRLEVBQUUsRUFBRTtBQUNaLFlBQUEsUUFBUSxFQUFFLFdBQVc7QUFDckIsWUFBQSxjQUFjLEVBQUUsQ0FBQztBQUNqQixZQUFBLFNBQVMsRUFBRSxFQUFFO0FBQ2IsWUFBQSxTQUFTLEVBQUUsS0FBSztBQUNoQixZQUFBLEtBQUssRUFBRTtTQUNQO0lBQ0Y7SUFFTSxNQUFNLEdBQUE7O0FBQ1gsWUFBQSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUk7WUFDbkMsU0FBUyxDQUFDLEtBQUssRUFBRTs7QUFHakIsWUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDOztBQUc1QyxZQUFBLElBQUk7QUFDSCxnQkFBQSxNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRWhFLGdCQUFBLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0U7WUFBRSxPQUFPLEtBQUssRUFBRTtBQUNmLGdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDO0FBQ2hELGdCQUFBLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFO1lBQzNCO1lBRUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7O1lBRzNDLElBQUlLLGdCQUFPLENBQUMsU0FBUztpQkFDbkIsT0FBTyxDQUFDLE9BQU87aUJBQ2YsT0FBTyxDQUFDLDBCQUEwQjtpQkFDbEMsV0FBVyxDQUFDLFFBQVEsSUFBRztBQUN2QixnQkFBQSxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7QUFFekMsZ0JBQUEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUc7QUFDdEMsb0JBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUEsRUFBRyxNQUFNLENBQUMsSUFBSSxDQUFBLEVBQUEsRUFBSyxNQUFNLENBQUMsSUFBSSxDQUFBLENBQUEsQ0FBRyxDQUFDO0FBQ2pFLGdCQUFBLENBQUMsQ0FBQztnQkFFRixRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxTQUFTLENBQUMsQ0FBQztBQUV4RixnQkFBQSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQU8sS0FBSyxLQUFJLFNBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxhQUFBO0FBQ2pDLG9CQUFBLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUN4Qix3QkFBQSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUk7QUFDekIsd0JBQUEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUk7b0JBQzdCO3lCQUFPO0FBQ04sd0JBQUEsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLO0FBQzFCLHdCQUFBLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLO29CQUM5QjtBQUNBLG9CQUFBLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZixDQUFDLENBQUEsQ0FBQztBQUNILFlBQUEsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFOztnQkFFakQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RGLElBQUksY0FBYyxFQUFFO0FBQ25CLG9CQUFBLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDO2dCQUN6RDtZQUNEO2lCQUFPOztBQUVOLGdCQUFBLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUM7WUFDdkM7UUFDRCxDQUFDLENBQUE7QUFBQSxJQUFBO0lBRUQsd0JBQXdCLENBQUMsU0FBc0IsRUFBRSxNQUF1QixFQUFBOztBQUN2RSxRQUFBLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQztRQUUzRSxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUUvQyxRQUFBLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFLENBQUM7QUFFL0UsUUFBQSxNQUFNLE1BQU0sR0FBRztZQUNkLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtZQUNuQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDbkMsWUFBQSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLElBQUk7U0FDbEQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDeEMsWUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pEO1FBQ0EsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQ2pELFlBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0RDtBQUNBLFFBQUEsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE9BQU8sS0FBSSxDQUFBLEVBQUEsR0FBQSxNQUFNLENBQUMsS0FBSyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxDQUFBLEVBQUU7QUFDbEQsWUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6RDtBQUVBLFFBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUc7WUFDdEIsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDcEMsWUFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekMsWUFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUMsUUFBQSxDQUFDLENBQUM7O1FBR0YsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO0FBQ25CLGFBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTthQUNuQixhQUFhLENBQUMsTUFBTTtBQUNwQixhQUFBLE1BQU07YUFDTixPQUFPLENBQUMsTUFBSztBQUNiLFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ047QUFFQSxJQUFBLHNCQUFzQixDQUFDLFNBQXNCLEVBQUE7UUFDNUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFFNUMsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxJQUFJO0FBQ1osYUFBQSxXQUFXLENBQUMsUUFBUSxJQUFJO0FBQ3ZCLGFBQUEsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRO0FBQ3pCLGFBQUEsU0FBUyxDQUFDLFNBQVMsRUFBRSxjQUFjO0FBQ25DLGFBQUEsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNO0FBQ3pCLGFBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSTthQUM1QixRQUFRLENBQUMsS0FBSyxJQUFHO0FBQ2pCLFlBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsS0FBWTtZQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ2QsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLElBQUk7QUFDWixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7QUFDZixhQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7YUFDNUIsY0FBYyxDQUFDLFNBQVM7QUFDeEIsYUFBQSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRWxELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2xDLElBQUlBLGdCQUFPLENBQUMsU0FBUztpQkFDbkIsT0FBTyxDQUFDLEtBQUs7QUFDYixpQkFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO0FBQ2YsaUJBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRztpQkFDM0IsY0FBYyxDQUFDLHlCQUF5QjtBQUN4QyxpQkFBQSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ2xEO1FBRUEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDdEMsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2lCQUNuQixPQUFPLENBQUMsS0FBSztBQUNiLGlCQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7aUJBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLEVBQUU7aUJBQ3RDLGNBQWMsQ0FBQyxXQUFXO0FBQzFCLGlCQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDdkQ7UUFFQSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUNwQyxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7aUJBQ25CLE9BQU8sQ0FBQyxNQUFNO2lCQUNkLE9BQU8sQ0FBQyxJQUFJLElBQUc7O0FBQUMsZ0JBQUEsT0FBQTtBQUNmLHFCQUFBLFFBQVEsQ0FBQyxDQUFBLENBQUEsRUFBQSxHQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxLQUFJLEVBQUU7cUJBQ3pDLGNBQWMsQ0FBQyxvQkFBb0I7cUJBQ25DLFFBQVEsQ0FBQyxLQUFLLElBQUc7QUFDakIsb0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSztBQUFFLHdCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUU7b0JBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLO0FBQ2xDLGdCQUFBLENBQUMsQ0FBQztBQUFBLFlBQUEsQ0FBQSxDQUFDO1lBRUwsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2lCQUNuQixPQUFPLENBQUMsTUFBTTtpQkFDZCxPQUFPLENBQUMsMkJBQTJCO2lCQUNuQyxPQUFPLENBQUMsSUFBSSxJQUFHOztBQUFDLGdCQUFBLE9BQUE7QUFDZixxQkFBQSxRQUFRLENBQUMsQ0FBQSxDQUFBLEVBQUEsR0FBQSxNQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsR0FBQSxFQUFBLENBQUUsYUFBYSwwQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUksYUFBYTtxQkFDekUsUUFBUSxDQUFDLEtBQUssSUFBRztBQUNqQixvQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLO0FBQUUsd0JBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtvQkFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDekUsZ0JBQUEsQ0FBQyxDQUFDO0FBQUEsWUFBQSxDQUFBLENBQUM7WUFFTCxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7aUJBQ25CLE9BQU8sQ0FBQyxPQUFPO2lCQUNmLFNBQVMsQ0FBQyxNQUFNLElBQUc7O0FBQUMsZ0JBQUEsT0FBQTtBQUNuQixxQkFBQSxRQUFRLENBQUMsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBRSxTQUFTLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsRUFBQSxHQUFJLElBQUk7cUJBQ2hELFFBQVEsQ0FBQyxLQUFLLElBQUc7QUFDakIsb0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSztBQUFFLHdCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUU7b0JBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLO0FBQ3ZDLGdCQUFBLENBQUMsQ0FBQztBQUFBLFlBQUEsQ0FBQSxDQUFDO1FBQ047O1FBR0EsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxNQUFNO2FBQ2QsT0FBTyxDQUFDLFNBQVM7QUFDakIsYUFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO2FBQ2YsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUM7YUFDbkQsY0FBYyxDQUFDLEdBQUc7QUFDbEIsYUFBQSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUUzRSxJQUFJQSxnQkFBTyxDQUFDLFNBQVM7YUFDbkIsT0FBTyxDQUFDLE9BQU87YUFDZixPQUFPLENBQUMsV0FBVztBQUNuQixhQUFBLE9BQU8sQ0FBQyxJQUFJLElBQUk7YUFDZixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQzthQUMvQyxjQUFjLENBQUMsSUFBSTtBQUNuQixhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXZFLElBQUlBLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsTUFBTTthQUNkLE9BQU8sQ0FBQyxtQkFBbUI7QUFDM0IsYUFBQSxPQUFPLENBQUMsSUFBSSxJQUFJO2FBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLFdBQVc7YUFDL0MsY0FBYyxDQUFDLFdBQVc7QUFDMUIsYUFBQSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRXRELElBQUlBLGdCQUFPLENBQUMsU0FBUzthQUNuQixPQUFPLENBQUMsTUFBTTtBQUNkLGFBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTthQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksS0FBSztBQUMxQyxhQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFdkQsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO2FBQ25CLE9BQU8sQ0FBQyxJQUFJO0FBQ1osYUFBQSxTQUFTLENBQUMsTUFBTSxJQUFJO2FBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sS0FBSyxLQUFLO0FBQ3pDLGFBQUEsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQzs7UUFHckQsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTO0FBQ25CLGFBQUEsU0FBUyxDQUFDLE1BQU0sSUFBSTthQUNuQixhQUFhLENBQUMsT0FBTztBQUNyQixhQUFBLE1BQU07YUFDTixPQUFPLENBQUMsTUFBVyxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQTtBQUNuQixZQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUN6QixnQkFBQSxJQUFJYixlQUFNLENBQUMsVUFBVSxDQUFDO2dCQUN0QjtZQUNEOztZQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO0FBRXJFLFlBQUEsSUFBSTs7QUFFSCxnQkFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQTRCLENBQUM7Z0JBQ2xHLElBQUksT0FBTyxFQUFFO0FBQ1osb0JBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBNEIsQ0FBQztvQkFDakQsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDWixJQUFJQSxlQUFNLENBQUMsQ0FBQSxPQUFBLEVBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUEsSUFBQSxDQUFNLENBQUM7Z0JBQ2hEO3FCQUFPO0FBQ04sb0JBQUEsSUFBSUEsZUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDdkI7WUFDRDtZQUFFLE9BQU8sS0FBSyxFQUFFO0FBQ2YsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDN0I7UUFDRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ047SUFFQSxPQUFPLEdBQUE7QUFDTixRQUFBLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJO1FBQzFCLFNBQVMsQ0FBQyxLQUFLLEVBQUU7SUFDbEI7QUFDQTs7OzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwyLDMsNCw1LDYsNyw4LDksMTBdfQ==
