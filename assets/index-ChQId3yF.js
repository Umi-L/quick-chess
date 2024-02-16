var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __publicField = (obj, key2, value) => {
  __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function noop$2() {
}
function assign(tar, src) {
  for (const k2 in src)
    tar[k2] = src[k2];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns2) {
  fns2.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a2, b2) {
  return a2 != a2 ? b2 == b2 : a2 !== b2 || a2 && typeof a2 === "object" || typeof a2 === "function";
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (element_src === url)
    return true;
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop$2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i2 = 0; i2 < len; i2 += 1) {
        merged[i2] = $$scope.dirty[i2] | lets[i2];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i2 = 0; i2 < length; i2++) {
      dirty[i2] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k2 in props)
    if (k2[0] !== "$")
      result[k2] = props[k2];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k2 in props)
    if (!keys.has(k2) && k2[0] !== "$")
      rest[k2] = props[k2];
  return rest;
}
function compute_slots(slots) {
  const result = {};
  for (const key2 in slots) {
    result[key2] = true;
  }
  return result;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$2;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i2 = 0; i2 < iterations.length; i2 += 1) {
    if (iterations[i2])
      iterations[i2].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
const always_set_through_set_attribute = ["width", "height"];
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key2 in attributes) {
    if (attributes[key2] == null) {
      node.removeAttribute(key2);
    } else if (key2 === "style") {
      node.style.cssText = attributes[key2];
    } else if (key2 === "__value") {
      node.value = node[key2] = attributes[key2];
    } else if (descriptors[key2] && descriptors[key2].set && always_set_through_set_attribute.indexOf(key2) === -1) {
      node[key2] = attributes[key2];
    } else {
      attr(node, key2, attributes[key2]);
    }
  }
}
function set_custom_element_data_map(node, data_map) {
  Object.keys(data_map).forEach((key2) => {
    set_custom_element_data(node, key2, data_map[key2]);
  });
}
function set_custom_element_data(node, prop, value) {
  const lower = prop.toLowerCase();
  if (lower in node) {
    node[lower] = typeof node[lower] === "boolean" && value === "" ? true : value;
  } else if (prop in node) {
    node[prop] = typeof node[prop] === "boolean" && value === "" ? true : value;
  } else {
    attr(node, prop, value);
  }
}
function set_dynamic_element_data(tag) {
  return /-/.test(tag) ? set_custom_element_data_map : set_attributes;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function set_style(node, key2, value, important) {
  if (value == null) {
    node.style.removeProperty(key2);
  } else {
    node.style.setProperty(key2, value, important ? "important" : "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
class HtmlTag {
  constructor(is_svg = false) {
    /**
     * @private
     * @default false
     */
    __publicField(this, "is_svg", false);
    /** parent for creating node */
    __publicField(this, "e");
    /** html tag nodes */
    __publicField(this, "n");
    /** target */
    __publicField(this, "t");
    /** anchor */
    __publicField(this, "a");
    this.is_svg = is_svg;
    this.e = this.n = null;
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  c(html) {
    this.h(html);
  }
  /**
   * @param {string} html
   * @param {HTMLElement | SVGElement} target
   * @param {HTMLElement | SVGElement} anchor
   * @returns {void}
   */
  m(html, target, anchor = null) {
    if (!this.e) {
      if (this.is_svg)
        this.e = svg_element(
          /** @type {keyof SVGElementTagNameMap} */
          target.nodeName
        );
      else
        this.e = element(
          /** @type {keyof HTMLElementTagNameMap} */
          target.nodeType === 11 ? "TEMPLATE" : target.nodeName
        );
      this.t = target.tagName !== "TEMPLATE" ? target : (
        /** @type {HTMLTemplateElement} */
        target.content
      );
      this.c(html);
    }
    this.i(anchor);
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(
      this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes
    );
  }
  /**
   * @returns {void} */
  i(anchor) {
    for (let i2 = 0; i2 < this.n.length; i2 += 1) {
      insert(this.t, this.n[i2], anchor);
    }
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }
  /**
   * @returns {void} */
  d() {
    this.n.forEach(detach);
  }
}
function construct_svelte_component(component, props) {
  return new component(props);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function beforeUpdate(fn) {
  get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i2 = 0; i2 < render_callbacks.length; i2 += 1) {
      const callback = render_callbacks[i2];
      if (!seen_callbacks.has(callback)) {
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
function flush_render_callbacks(fns2) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c2) => fns2.indexOf(c2) === -1 ? filtered.push(c2) : targets.push(c2));
  targets.forEach((c2) => c2());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i2 = levels.length;
  while (i2--) {
    const o2 = levels[i2];
    const n2 = updates[i2];
    if (n2) {
      for (const key2 in o2) {
        if (!(key2 in n2))
          to_null_out[key2] = 1;
      }
      for (const key2 in n2) {
        if (!accounted_for[key2]) {
          update2[key2] = n2[key2];
          accounted_for[key2] = 1;
        }
      }
      levels[i2] = n2;
    } else {
      for (const key2 in o2) {
        accounted_for[key2] = 1;
      }
    }
  }
  for (const key2 in to_null_out) {
    if (!(key2 in update2))
      update2[key2] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i2) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i2 / 31 | 0] |= 1 << i2 % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop$2,
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
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i2, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i2], $$.ctx[i2] = value)) {
      if (!$$.skip_bound && $$.bound[i2])
        $$.bound[i2](value);
      if (ready)
        make_dirty(component, i2);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop$2;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop$2;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
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
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
const subscriber_queue = [];
function writable(value, start = noop$2) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop$2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
class Point {
  constructor(x2, y2) {
    __publicField(this, "x");
    __publicField(this, "y");
    this.x = x2;
    this.y = y2;
  }
}
let Board$1 = class Board {
  constructor(width, height) {
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "board");
    this.width = width;
    this.height = height;
    this.board = new Array(height).fill(null).map(() => new Array(width).fill(null));
  }
  pointInBounds(point) {
    return point.x < this.width && point.x >= 0 && point.y < this.height && point.y >= 0;
  }
  printBoard() {
    let final = "";
    for (let i2 = 0; i2 < this.width; i2++) {
      let row = "";
      for (let j2 = 0; j2 < this.height; j2++) {
        const piece = this.board[i2][j2];
        if (piece !== null) {
          let turnsSinceMoved = piece.turnsSinceMoved ?? " ";
          row += piece.type + piece.color + turnsSinceMoved + " ";
        } else {
          row += "   ";
        }
      }
      final += row + "\n";
    }
    console.log(final);
  }
};
var Color = /* @__PURE__ */ ((Color2) => {
  Color2["White"] = "w";
  Color2["Black"] = "b";
  return Color2;
})(Color || {});
function getOppositeColor(color) {
  return color === "w" ? "b" : "w";
}
let possibleMoves = writable([]);
let ghostMoves = writable([]);
let selectedPiece = writable(void 0);
let gameBoard = writable(void 0);
let currentGame = writable(void 0);
let turn = writable(Color.White);
let myColor = writable(Color.White);
let isHost = writable(false);
function create_if_block$9(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = "./" + /*piece*/
      ctx[3].color + /*piece*/
      ctx[3].type + ".svg"))
        attr(img, "src", img_src_value);
      attr(img, "class", "piece svelte-ic1an9");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*piece*/
      8 && !src_url_equal(img.src, img_src_value = "./" + /*piece*/
      ctx2[3].color + /*piece*/
      ctx2[3].type + ".svg")) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(img);
      }
    }
  };
}
function create_fragment$p(ctx) {
  let div4;
  let div3;
  let div2;
  let div1;
  let div0;
  let t2;
  let div4_style_value;
  let if_block = (
    /*piece*/
    ctx[3] && create_if_block$9(ctx)
  );
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div2 = element("div");
      div1 = element("div");
      div0 = element("div");
      t2 = space();
      if (if_block)
        if_block.c();
      attr(div0, "class", "svelte-ic1an9");
      toggle_class(
        div0,
        "possible-move-display",
        /*possibleMove*/
        ctx[7] != void 0
      );
      toggle_class(
        div0,
        "ghost-move-display",
        /*possibleMove*/
        ctx[7] == void 0 && /*ghostMove*/
        ctx[8] != void 0
      );
      attr(div1, "class", "move-display-wrapper");
      attr(div2, "class", "wrapper svelte-ic1an9");
      attr(div3, "class", "square svelte-ic1an9");
      toggle_class(
        div3,
        "selected-display",
        /*isSelected*/
        ctx[6]
      );
      attr(div4, "style", div4_style_value = `width: ${/*width*/
      ctx[0]}px; height: ${/*height*/
      ctx[1]}px;`);
      attr(div4, "class", "square svelte-ic1an9");
      toggle_class(
        div4,
        "white",
        /*isWhite*/
        ctx[2]
      );
      toggle_class(div4, "black", !/*isWhite*/
      ctx[2]);
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div2);
      append(div2, div1);
      append(div1, div0);
      append(div2, t2);
      if (if_block)
        if_block.m(div2, null);
      ctx[10](div2);
      ctx[11](div3);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*possibleMove, undefined*/
      128) {
        toggle_class(
          div0,
          "possible-move-display",
          /*possibleMove*/
          ctx2[7] != void 0
        );
      }
      if (dirty & /*possibleMove, undefined, ghostMove*/
      384) {
        toggle_class(
          div0,
          "ghost-move-display",
          /*possibleMove*/
          ctx2[7] == void 0 && /*ghostMove*/
          ctx2[8] != void 0
        );
      }
      if (
        /*piece*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$9(ctx2);
          if_block.c();
          if_block.m(div2, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & /*isSelected*/
      64) {
        toggle_class(
          div3,
          "selected-display",
          /*isSelected*/
          ctx2[6]
        );
      }
      if (dirty & /*width, height*/
      3 && div4_style_value !== (div4_style_value = `width: ${/*width*/
      ctx2[0]}px; height: ${/*height*/
      ctx2[1]}px;`)) {
        attr(div4, "style", div4_style_value);
      }
      if (dirty & /*isWhite*/
      4) {
        toggle_class(
          div4,
          "white",
          /*isWhite*/
          ctx2[2]
        );
      }
      if (dirty & /*isWhite*/
      4) {
        toggle_class(div4, "black", !/*isWhite*/
        ctx2[2]);
      }
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(div4);
      }
      if (if_block)
        if_block.d();
      ctx[10](null);
      ctx[11](null);
    }
  };
}
function instance$p($$self, $$props, $$invalidate) {
  let wrapper;
  let squareElement;
  let dragging = false;
  let { width } = $$props;
  let { height } = $$props;
  let { isWhite } = $$props;
  let { piece } = $$props;
  let { gamePosition } = $$props;
  let isSelected = false;
  let possibleMove;
  let ghostMove;
  selectedPiece.subscribe((value) => {
    if (value == gamePosition) {
      $$invalidate(6, isSelected = true);
    } else {
      $$invalidate(6, isSelected = false);
    }
  });
  ghostMoves.subscribe((value) => {
    $$invalidate(8, ghostMove = value.find((move) => {
      return move.position.x == gamePosition.x && move.position.y == gamePosition.y;
    }));
  });
  possibleMoves.subscribe((value) => {
    $$invalidate(7, possibleMove = value.find((move) => {
      return move.position.x == gamePosition.x && move.position.y == gamePosition.y;
    }));
  });
  let game;
  currentGame.subscribe((value) => {
    game = value;
  });
  let board;
  gameBoard.subscribe((value) => {
    board = value;
  });
  function handleMouseDown(event) {
    if (possibleMove) {
      game.makeMove(possibleMove);
    } else {
      selectedPiece.set(void 0);
      possibleMoves.set([]);
      ghostMoves.set([]);
    }
    if (!piece)
      return;
    selectedPiece.set(gamePosition);
    let moves = piece.getMoves(game, board, gamePosition, false, false);
    let _ghostMoves = piece.getMoves(game, board, gamePosition, true, false);
    console.log(moves);
    possibleMoves.set(moves);
    ghostMoves.set(_ghostMoves);
    dragging = true;
    $$invalidate(4, wrapper.style.width = wrapper.offsetWidth + "px", wrapper);
    $$invalidate(4, wrapper.style.height = wrapper.offsetHeight + "px", wrapper);
    $$invalidate(4, wrapper.style.position = "absolute", wrapper);
    $$invalidate(4, wrapper.style.zIndex = "1000", wrapper);
    $$invalidate(4, wrapper.style.left = event.clientX - squareElement.getBoundingClientRect().left - wrapper.offsetWidth / 2 + "px", wrapper);
    $$invalidate(4, wrapper.style.top = event.clientY - squareElement.getBoundingClientRect().top - wrapper.offsetHeight / 2 + "px", wrapper);
  }
  function handleMouseMove(event) {
    if (dragging) {
      $$invalidate(4, wrapper.style.left = event.clientX - squareElement.getBoundingClientRect().left - wrapper.offsetWidth / 2 + "px", wrapper);
      $$invalidate(4, wrapper.style.top = event.clientY - squareElement.getBoundingClientRect().top - wrapper.offsetHeight / 2 + "px", wrapper);
    }
  }
  function handleMouseUp(event) {
    dragging = false;
    let myRect = squareElement.getBoundingClientRect();
    if (event.clientX > myRect.left && event.clientX < myRect.right && event.clientY > myRect.top && event.clientY < myRect.bottom && possibleMove) {
      game.makeMove(possibleMove);
    }
    $$invalidate(4, wrapper.style.position = "", wrapper);
    $$invalidate(4, wrapper.style.zIndex = "", wrapper);
    $$invalidate(4, wrapper.style.left = "", wrapper);
    $$invalidate(4, wrapper.style.top = "", wrapper);
    $$invalidate(4, wrapper.style.width = "", wrapper);
    $$invalidate(4, wrapper.style.height = "", wrapper);
  }
  onMount(() => {
    wrapper.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  });
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      wrapper = $$value;
      $$invalidate(4, wrapper);
    });
  }
  function div3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      squareElement = $$value;
      $$invalidate(5, squareElement);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("width" in $$props2)
      $$invalidate(0, width = $$props2.width);
    if ("height" in $$props2)
      $$invalidate(1, height = $$props2.height);
    if ("isWhite" in $$props2)
      $$invalidate(2, isWhite = $$props2.isWhite);
    if ("piece" in $$props2)
      $$invalidate(3, piece = $$props2.piece);
    if ("gamePosition" in $$props2)
      $$invalidate(9, gamePosition = $$props2.gamePosition);
  };
  return [
    width,
    height,
    isWhite,
    piece,
    wrapper,
    squareElement,
    isSelected,
    possibleMove,
    ghostMove,
    gamePosition,
    div2_binding,
    div3_binding
  ];
}
class Square extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$p, create_fragment$p, safe_not_equal, {
      width: 0,
      height: 1,
      isWhite: 2,
      piece: 3,
      gamePosition: 9
    });
  }
}
function create_fragment$o(ctx) {
  let div1;
  let div0;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      attr(div0, "class", "board svelte-1314tjy");
      attr(div1, "class", "container svelte-1314tjy");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      ctx[3](div0);
      ctx[4](div1);
    },
    p: noop$2,
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      ctx[3](null);
      ctx[4](null);
    }
  };
}
function instance$o($$self, $$props, $$invalidate) {
  let { game } = $$props;
  let boardState;
  let boardLoaded = false;
  gameBoard.subscribe((value) => {
    if (value == void 0)
      return;
    boardState = value;
    if (boardLoaded)
      updateBoard();
  });
  let isWhite;
  myColor.subscribe((value) => {
    isWhite = value == Color.White;
  });
  let container;
  let boardElement;
  let cellArray = [];
  let containerWidth;
  let containerHeight;
  let cellSize;
  onMount(async () => {
    gameBoard.set(game.board);
    let containerBox = container.getBoundingClientRect();
    containerWidth = containerBox.width;
    containerHeight = containerBox.height;
    cellSize = Math.min(containerWidth / boardState.width, containerHeight / boardState.height);
    generateBoard();
    window.onresize = () => {
      let containerBox2 = container.getBoundingClientRect();
      containerWidth = containerBox2.width;
      containerHeight = containerBox2.height;
      cellSize = Math.min(containerWidth / boardState.width, containerHeight / boardState.height);
      updateBoard();
    };
  });
  function generateBoard() {
    for (let y2 = 0; y2 < boardState.height; y2++) {
      cellArray[y2] = [];
      let row = document.createElement("div");
      row.classList.add("chess-board-row");
      for (let x2 = 0; x2 < boardState.width; x2++) {
        let gameY = isWhite ? boardState.height - y2 - 1 : y2;
        let gameX = isWhite ? boardState.width - x2 - 1 : x2;
        cellArray[y2][x2] = new Square({
          target: row,
          props: {
            gamePosition: new Point(gameX, gameY),
            width: containerWidth / boardState.width,
            height: containerHeight / boardState.height,
            isWhite: (y2 + x2) % 2 === 0,
            piece: boardState.board[gameX][gameY]
          }
        });
      }
      boardElement.appendChild(row);
    }
    let portrait = containerWidth < containerHeight;
    if (portrait) {
      $$invalidate(1, boardElement.style.height = `${boardState.height * cellSize}px`, boardElement);
    } else {
      $$invalidate(1, boardElement.style.width = `${boardState.width * cellSize}px`, boardElement);
    }
    boardLoaded = true;
  }
  function updateBoard() {
    for (let y2 = 0; y2 < boardState.height; y2++) {
      for (let x2 = 0; x2 < boardState.width; x2++) {
        let gameY = isWhite ? boardState.height - y2 - 1 : y2;
        let gameX = isWhite ? boardState.width - x2 - 1 : x2;
        let piece = boardState.board[gameX][gameY];
        if (piece) {
          cellArray[y2][x2].$set({ piece });
        } else {
          cellArray[y2][x2].$set({ piece: null });
        }
        cellArray[y2][x2].$set({
          width: containerWidth / boardState.width,
          height: containerHeight / boardState.height
        });
      }
    }
    let portrait = containerWidth < containerHeight;
    if (portrait) {
      $$invalidate(1, boardElement.style.height = `${boardState.height * cellSize}px`, boardElement);
    } else {
      $$invalidate(1, boardElement.style.width = `${boardState.width * cellSize}px`, boardElement);
    }
  }
  function div0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      boardElement = $$value;
      $$invalidate(1, boardElement);
    });
  }
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      container = $$value;
      $$invalidate(0, container);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("game" in $$props2)
      $$invalidate(2, game = $$props2.game);
  };
  return [container, boardElement, game, div0_binding, div1_binding];
}
class Board2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$o, create_fragment$o, safe_not_equal, { game: 2 });
  }
}
class Move {
  constructor(position, piece, callback = void 0, overrideAllBehavior = false) {
    __publicField(this, "position");
    __publicField(this, "piece");
    __publicField(this, "callback");
    __publicField(this, "overrideAllBehavior", false);
    this.position = position;
    this.piece = piece;
    this.callback = callback;
    this.overrideAllBehavior = overrideAllBehavior;
  }
}
var PieceType = /* @__PURE__ */ ((PieceType2) => {
  PieceType2["Pawn"] = "P";
  PieceType2["Knight"] = "N";
  PieceType2["Bishop"] = "B";
  PieceType2["Rook"] = "R";
  PieceType2["Queen"] = "Q";
  PieceType2["King"] = "K";
  return PieceType2;
})(PieceType || {});
class Piece {
  constructor() {
    __publicField(this, "hasMoved", false);
    __publicField(this, "turnsSinceMoved");
  }
  applySpecialRules(game, piecePosition, moves, ignoreColor, simulated) {
    game.specialRules.forEach((specialRule) => {
      moves = specialRule(piecePosition, this, moves, ignoreColor, simulated);
    });
    return moves;
  }
}
class SlidingPiece extends Piece {
  getMoves(game, board, position, ignoreColor, simulated) {
    let moves = [];
    for (const [dx, dy] of this.offsets) {
      let point = new Point(position.x + dx, position.y + dy);
      while (point.x < board.width && point.x >= 0 && point.y < board.height && point.y >= 0) {
        const piece = board.board[point.x][point.y];
        if (piece === null) {
          moves.push(new Move(point, this));
        } else {
          if (piece.color !== this.color) {
            moves.push(new Move(point, this));
          }
          break;
        }
        point = new Point(point.x + dx, point.y + dy);
      }
    }
    moves = this.applySpecialRules(game, position, moves, ignoreColor, simulated);
    return moves;
  }
}
class Bishop extends SlidingPiece {
  constructor(color) {
    super();
    __publicField(this, "offsets", [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ]);
    __publicField(this, "type", PieceType.Bishop);
    __publicField(this, "color");
    this.color = color;
  }
}
class JumpingPiece extends Piece {
  getMoves(game, board, position, ignoreColor, simulated) {
    let moves = [];
    for (const [dx, dy] of this.offsets) {
      let point = new Point(position.x + dx, position.y + dy);
      if (point.x < board.width && point.x >= 0 && point.y < board.height && point.y >= 0) {
        const piece = board.board[point.x][point.y];
        if (piece === null) {
          moves.push(new Move(point, this));
          continue;
        }
        if (piece.color !== this.color) {
          moves.push(new Move(point, this));
        }
      }
    }
    moves = this.applySpecialRules(game, position, moves, ignoreColor, simulated);
    return moves;
  }
}
class King extends JumpingPiece {
  constructor(color) {
    super();
    __publicField(this, "offsets", [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ]);
    __publicField(this, "type", PieceType.King);
    __publicField(this, "color");
    this.color = color;
  }
}
class Knight extends JumpingPiece {
  constructor(color) {
    super();
    __publicField(this, "offsets", [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2]
    ]);
    __publicField(this, "type", PieceType.Knight);
    __publicField(this, "color");
    this.color = color;
  }
}
class Pawn extends Piece {
  constructor(color) {
    super();
    __publicField(this, "type", PieceType.Pawn);
    __publicField(this, "color");
    this.color = color;
  }
  getMoves(game, board, position, ignoreColor, simulated) {
    let moves = [];
    const forward = this.color === Color.White ? 1 : -1;
    if (board.board[position.x][position.y + forward] === null) {
      moves.push(new Move(new Point(position.x, position.y + forward), this));
      if (!this.hasMoved && board.board[position.x][position.y + 2 * forward] === null) {
        moves.push(new Move(new Point(position.x, position.y + 2 * forward), this));
      }
    }
    let captureLogic = (offset) => {
      if (board.pointInBounds(new Point(position.x + offset, position.y + forward)) && board.board[position.x + offset][position.y + forward] != null && board.board[position.x + offset][position.y + forward].color !== this.color) {
        moves.push(new Move(new Point(position.x + offset, position.y + forward), this));
      }
    };
    captureLogic(-1);
    captureLogic(1);
    let enPassantLogic = (offset) => {
      if (board.pointInBounds(new Point(position.x + offset, position.y))) {
        const other = board.board[position.x + offset][position.y];
        if (other && other.type === PieceType.Pawn && other.color !== this.color) {
          if (other.turnsSinceMoved === 0) {
            let movePos = new Point(position.x + offset, position.y + forward);
            board.pointInBounds(movePos);
            if (board.board[movePos.x][movePos.y] === null) {
              moves.push(new Move(movePos, this, () => {
                board.board[position.x + offset][position.y] = null;
              }));
            }
          }
        }
      }
    };
    enPassantLogic(-1);
    enPassantLogic(1);
    moves = this.applySpecialRules(game, position, moves, ignoreColor, simulated);
    return moves;
  }
}
class Queen extends SlidingPiece {
  constructor(color) {
    super();
    __publicField(this, "offsets", [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ]);
    __publicField(this, "type", PieceType.Queen);
    __publicField(this, "color");
    this.color = color;
  }
}
class Rook extends SlidingPiece {
  constructor(color) {
    super();
    __publicField(this, "offsets", [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ]);
    __publicField(this, "type", PieceType.Rook);
    __publicField(this, "color");
    this.color = color;
  }
}
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/quick-chess/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    promise = Promise.all(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen)
        return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      const isBaseRelative = !!importerUrl;
      if (isBaseRelative) {
        for (let i2 = links.length - 1; i2 >= 0; i2--) {
          const link2 = links[i2];
          if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
            return;
          }
        }
      } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
        return;
      }
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) {
        link.as = "script";
        link.crossOrigin = "";
      }
      link.href = dep;
      document.head.appendChild(link);
      if (isCss) {
        return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
        });
      }
    }));
  }
  return promise.then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};
const resolveFetch$3 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => __vitePreload(() => Promise.resolve().then(() => browser$1), true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
class FunctionsError extends Error {
  constructor(message, name = "FunctionsError", context) {
    super(message);
    this.name = name;
    this.context = context;
  }
}
class FunctionsFetchError extends FunctionsError {
  constructor(context) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
  }
}
class FunctionsRelayError extends FunctionsError {
  constructor(context) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
  }
}
class FunctionsHttpError extends FunctionsError {
  constructor(context) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
  }
}
var FunctionRegion;
(function(FunctionRegion2) {
  FunctionRegion2["Any"] = "any";
  FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
  FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
  FunctionRegion2["ApSouth1"] = "ap-south-1";
  FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
  FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
  FunctionRegion2["CaCentral1"] = "ca-central-1";
  FunctionRegion2["EuCentral1"] = "eu-central-1";
  FunctionRegion2["EuWest1"] = "eu-west-1";
  FunctionRegion2["EuWest2"] = "eu-west-2";
  FunctionRegion2["EuWest3"] = "eu-west-3";
  FunctionRegion2["SaEast1"] = "sa-east-1";
  FunctionRegion2["UsEast1"] = "us-east-1";
  FunctionRegion2["UsWest1"] = "us-west-1";
  FunctionRegion2["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));
var __awaiter$6 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class FunctionsClient {
  constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
    this.url = url;
    this.headers = headers;
    this.region = region;
    this.fetch = resolveFetch$3(customFetch);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(functionName, options = {}) {
    var _a;
    return __awaiter$6(this, void 0, void 0, function* () {
      try {
        const { headers, method, body: functionArgs } = options;
        let _headers = {};
        let { region } = options;
        if (!region) {
          region = this.region;
        }
        if (region && region !== "any") {
          _headers["x-region"] = region;
        }
        let body;
        if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
          if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            _headers["Content-Type"] = "application/octet-stream";
            body = functionArgs;
          } else if (typeof functionArgs === "string") {
            _headers["Content-Type"] = "text/plain";
            body = functionArgs;
          } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
            body = functionArgs;
          } else {
            _headers["Content-Type"] = "application/json";
            body = JSON.stringify(functionArgs);
          }
        }
        const response = yield this.fetch(`${this.url}/${functionName}`, {
          method: method || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body
        }).catch((fetchError) => {
          throw new FunctionsFetchError(fetchError);
        });
        const isRelayError = response.headers.get("x-relay-error");
        if (isRelayError && isRelayError === "true") {
          throw new FunctionsRelayError(response);
        }
        if (!response.ok) {
          throw new FunctionsHttpError(response);
        }
        let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
        let data;
        if (responseType === "application/json") {
          data = yield response.json();
        } else if (responseType === "application/octet-stream") {
          data = yield response.blob();
        } else if (responseType === "multipart/form-data") {
          data = yield response.formData();
        } else {
          data = yield response.text();
        }
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    });
  }
}
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
};
var globalObject = getGlobal();
const fetch$1 = globalObject.fetch;
const nodeFetch = globalObject.fetch.bind(globalObject);
const Headers$1 = globalObject.Headers;
const Request = globalObject.Request;
const Response$1 = globalObject.Response;
const browser$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Headers: Headers$1,
  Request,
  Response: Response$1,
  default: nodeFetch,
  fetch: fetch$1
}, Symbol.toStringTag, { value: "Module" }));
class PostgrestError extends Error {
  constructor(context) {
    super(context.message);
    this.name = "PostgrestError";
    this.details = context.details;
    this.hint = context.hint;
    this.code = context.code;
  }
}
class PostgrestBuilder {
  constructor(builder) {
    this.shouldThrowOnError = false;
    this.method = builder.method;
    this.url = builder.url;
    this.headers = builder.headers;
    this.schema = builder.schema;
    this.body = builder.body;
    this.shouldThrowOnError = builder.shouldThrowOnError;
    this.signal = builder.signal;
    this.isMaybeSingle = builder.isMaybeSingle;
    if (builder.fetch) {
      this.fetch = builder.fetch;
    } else if (typeof fetch === "undefined") {
      this.fetch = nodeFetch;
    } else {
      this.fetch = fetch;
    }
  }
  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError() {
    this.shouldThrowOnError = true;
    return this;
  }
  then(onfulfilled, onrejected) {
    if (this.schema === void 0)
      ;
    else if (["GET", "HEAD"].includes(this.method)) {
      this.headers["Accept-Profile"] = this.schema;
    } else {
      this.headers["Content-Profile"] = this.schema;
    }
    if (this.method !== "GET" && this.method !== "HEAD") {
      this.headers["Content-Type"] = "application/json";
    }
    const _fetch = this.fetch;
    let res = _fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal
    }).then(async (res2) => {
      var _a, _b, _c;
      let error = null;
      let data = null;
      let count = null;
      let status = res2.status;
      let statusText = res2.statusText;
      if (res2.ok) {
        if (this.method !== "HEAD") {
          const body = await res2.text();
          if (body === "")
            ;
          else if (this.headers["Accept"] === "text/csv") {
            data = body;
          } else if (this.headers["Accept"] && this.headers["Accept"].includes("application/vnd.pgrst.plan+text")) {
            data = body;
          } else {
            data = JSON.parse(body);
          }
        }
        const countHeader = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
        const contentRange = (_b = res2.headers.get("content-range")) === null || _b === void 0 ? void 0 : _b.split("/");
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1]);
        }
        if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
          if (data.length > 1) {
            error = {
              // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
              code: "PGRST116",
              details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
              hint: null,
              message: "JSON object requested, multiple (or no) rows returned"
            };
            data = null;
            count = null;
            status = 406;
            statusText = "Not Acceptable";
          } else if (data.length === 1) {
            data = data[0];
          } else {
            data = null;
          }
        }
      } else {
        const body = await res2.text();
        try {
          error = JSON.parse(body);
          if (Array.isArray(error) && res2.status === 404) {
            data = [];
            error = null;
            status = 200;
            statusText = "OK";
          }
        } catch (_d) {
          if (res2.status === 404 && body === "") {
            status = 204;
            statusText = "No Content";
          } else {
            error = {
              message: body
            };
          }
        }
        if (error && this.isMaybeSingle && ((_c = error === null || error === void 0 ? void 0 : error.details) === null || _c === void 0 ? void 0 : _c.includes("0 rows"))) {
          error = null;
          status = 200;
          statusText = "OK";
        }
        if (error && this.shouldThrowOnError) {
          throw new PostgrestError(error);
        }
      }
      const postgrestResponse = {
        error,
        data,
        count,
        status,
        statusText
      };
      return postgrestResponse;
    });
    if (!this.shouldThrowOnError) {
      res = res.catch((fetchError) => {
        var _a, _b, _c;
        return {
          error: {
            message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
            details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
            hint: "",
            code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ""}`
          },
          data: null,
          count: null,
          status: 0,
          statusText: ""
        };
      });
    }
    return res.then(onfulfilled, onrejected);
  }
}
class PostgrestTransformBuilder extends PostgrestBuilder {
  /**
   * Perform a SELECT on the query result.
   *
   * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
   * return modified rows. By calling this method, modified rows are returned in
   * `data`.
   *
   * @param columns - The columns to retrieve, separated by commas
   */
  select(columns) {
    let quoted = false;
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c2) => {
      if (/\s/.test(c2) && !quoted) {
        return "";
      }
      if (c2 === '"') {
        quoted = !quoted;
      }
      return c2;
    }).join("");
    this.url.searchParams.set("select", cleanedColumns);
    if (this.headers["Prefer"]) {
      this.headers["Prefer"] += ",";
    }
    this.headers["Prefer"] += "return=representation";
    return this;
  }
  /**
   * Order the query result by `column`.
   *
   * You can call this method multiple times to order by multiple columns.
   *
   * You can order referenced tables, but it only affects the ordering of the
   * parent table if you use `!inner` in the query.
   *
   * @param column - The column to order by
   * @param options - Named parameters
   * @param options.ascending - If `true`, the result will be in ascending order
   * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
   * `null`s appear last.
   * @param options.referencedTable - Set this to order a referenced table by
   * its columns
   * @param options.foreignTable - Deprecated, use `options.referencedTable`
   * instead
   */
  order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
    const key2 = referencedTable ? `${referencedTable}.order` : "order";
    const existingOrder = this.url.searchParams.get(key2);
    this.url.searchParams.set(key2, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
    return this;
  }
  /**
   * Limit the query result by `count`.
   *
   * @param count - The maximum number of rows to return
   * @param options - Named parameters
   * @param options.referencedTable - Set this to limit rows of referenced
   * tables instead of the parent table
   * @param options.foreignTable - Deprecated, use `options.referencedTable`
   * instead
   */
  limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
    const key2 = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
    this.url.searchParams.set(key2, `${count}`);
    return this;
  }
  /**
   * Limit the query result by starting at an offset (`from`) and ending at the offset (`from + to`).
   * Only records within this range are returned.
   * This respects the query order and if there is no order clause the range could behave unexpectedly.
   * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
   * and fourth rows of the query.
   *
   * @param from - The starting index from which to limit the result
   * @param to - The last index to which to limit the result
   * @param options - Named parameters
   * @param options.referencedTable - Set this to limit rows of referenced
   * tables instead of the parent table
   * @param options.foreignTable - Deprecated, use `options.referencedTable`
   * instead
   */
  range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
    const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
    const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
    this.url.searchParams.set(keyOffset, `${from}`);
    this.url.searchParams.set(keyLimit, `${to - from + 1}`);
    return this;
  }
  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(signal) {
    this.signal = signal;
    return this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be one row (e.g. using `.limit(1)`), otherwise this
   * returns an error.
   */
  single() {
    this.headers["Accept"] = "application/vnd.pgrst.object+json";
    return this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
   * this returns an error.
   */
  maybeSingle() {
    if (this.method === "GET") {
      this.headers["Accept"] = "application/json";
    } else {
      this.headers["Accept"] = "application/vnd.pgrst.object+json";
    }
    this.isMaybeSingle = true;
    return this;
  }
  /**
   * Return `data` as a string in CSV format.
   */
  csv() {
    this.headers["Accept"] = "text/csv";
    return this;
  }
  /**
   * Return `data` as an object in [GeoJSON](https://geojson.org) format.
   */
  geojson() {
    this.headers["Accept"] = "application/geo+json";
    return this;
  }
  /**
   * Return `data` as the EXPLAIN plan for the query.
   *
   * You need to enable the
   * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
   * setting before using this method.
   *
   * @param options - Named parameters
   *
   * @param options.analyze - If `true`, the query will be executed and the
   * actual run time will be returned
   *
   * @param options.verbose - If `true`, the query identifier will be returned
   * and `data` will include the output columns of the query
   *
   * @param options.settings - If `true`, include information on configuration
   * parameters that affect query planning
   *
   * @param options.buffers - If `true`, include information on buffer usage
   *
   * @param options.wal - If `true`, include information on WAL record generation
   *
   * @param options.format - The format of the output, can be `"text"` (default)
   * or `"json"`
   */
  explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
    var _a;
    const options = [
      analyze ? "analyze" : null,
      verbose ? "verbose" : null,
      settings ? "settings" : null,
      buffers ? "buffers" : null,
      wal ? "wal" : null
    ].filter(Boolean).join("|");
    const forMediatype = (_a = this.headers["Accept"]) !== null && _a !== void 0 ? _a : "application/json";
    this.headers["Accept"] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`;
    if (format === "json")
      return this;
    else
      return this;
  }
  /**
   * Rollback the query.
   *
   * `data` will still be returned, but the query is not committed.
   */
  rollback() {
    var _a;
    if (((_a = this.headers["Prefer"]) !== null && _a !== void 0 ? _a : "").trim().length > 0) {
      this.headers["Prefer"] += ",tx=rollback";
    } else {
      this.headers["Prefer"] = "tx=rollback";
    }
    return this;
  }
  /**
   * Override the type of the returned `data`.
   *
   * @typeParam NewResult - The new result type to override with
   */
  returns() {
    return this;
  }
}
class PostgrestFilterBuilder extends PostgrestTransformBuilder {
  /**
   * Match only rows where `column` is equal to `value`.
   *
   * To check if the value of `column` is NULL, you should use `.is()` instead.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  eq(column, value) {
    this.url.searchParams.append(column, `eq.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is not equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  neq(column, value) {
    this.url.searchParams.append(column, `neq.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is greater than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gt(column, value) {
    this.url.searchParams.append(column, `gt.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is greater than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gte(column, value) {
    this.url.searchParams.append(column, `gte.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is less than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lt(column, value) {
    this.url.searchParams.append(column, `lt.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is less than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lte(column, value) {
    this.url.searchParams.append(column, `lte.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-sensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  like(column, pattern) {
    this.url.searchParams.append(column, `like.${pattern}`);
    return this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAllOf(column, patterns) {
    this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
    return this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAnyOf(column, patterns) {
    this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
    return this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-insensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  ilike(column, pattern) {
    this.url.searchParams.append(column, `ilike.${pattern}`);
    return this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAllOf(column, patterns) {
    this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
    return this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAnyOf(column, patterns) {
    this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
    return this;
  }
  /**
   * Match only rows where `column` IS `value`.
   *
   * For non-boolean columns, this is only relevant for checking if the value of
   * `column` is NULL by setting `value` to `null`.
   *
   * For boolean columns, you can also set `value` to `true` or `false` and it
   * will behave the same way as `.eq()`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  is(column, value) {
    this.url.searchParams.append(column, `is.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is included in the `values` array.
   *
   * @param column - The column to filter on
   * @param values - The values array to filter with
   */
  in(column, values) {
    const cleanedValues = Array.from(new Set(values)).map((s2) => {
      if (typeof s2 === "string" && new RegExp("[,()]").test(s2))
        return `"${s2}"`;
      else
        return `${s2}`;
    }).join(",");
    this.url.searchParams.append(column, `in.(${cleanedValues})`);
    return this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * `column` contains every element appearing in `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  contains(column, value) {
    if (typeof value === "string") {
      this.url.searchParams.append(column, `cs.${value}`);
    } else if (Array.isArray(value)) {
      this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
    } else {
      this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
    }
    return this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * every element appearing in `column` is contained by `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  containedBy(column, value) {
    if (typeof value === "string") {
      this.url.searchParams.append(column, `cd.${value}`);
    } else if (Array.isArray(value)) {
      this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
    } else {
      this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
    }
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is greater than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGt(column, range) {
    this.url.searchParams.append(column, `sr.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or greater than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGte(column, range) {
    this.url.searchParams.append(column, `nxl.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is less than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLt(column, range) {
    this.url.searchParams.append(column, `sl.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or less than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLte(column, range) {
    this.url.searchParams.append(column, `nxr.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where `column` is
   * mutually exclusive to `range` and there can be no element between the two
   * ranges.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeAdjacent(column, range) {
    this.url.searchParams.append(column, `adj.${range}`);
    return this;
  }
  /**
   * Only relevant for array and range columns. Match only rows where
   * `column` and `value` have an element in common.
   *
   * @param column - The array or range column to filter on
   * @param value - The array or range value to filter with
   */
  overlaps(column, value) {
    if (typeof value === "string") {
      this.url.searchParams.append(column, `ov.${value}`);
    } else {
      this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
    }
    return this;
  }
  /**
   * Only relevant for text and tsvector columns. Match only rows where
   * `column` matches the query string in `query`.
   *
   * @param column - The text or tsvector column to filter on
   * @param query - The query text to match with
   * @param options - Named parameters
   * @param options.config - The text search configuration to use
   * @param options.type - Change how the `query` text is interpreted
   */
  textSearch(column, query, { config: config2, type } = {}) {
    let typePart = "";
    if (type === "plain") {
      typePart = "pl";
    } else if (type === "phrase") {
      typePart = "ph";
    } else if (type === "websearch") {
      typePart = "w";
    }
    const configPart = config2 === void 0 ? "" : `(${config2})`;
    this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
    return this;
  }
  /**
   * Match only rows where each column in `query` keys is equal to its
   * associated value. Shorthand for multiple `.eq()`s.
   *
   * @param query - The object to filter with, with column names as keys mapped
   * to their filter values
   */
  match(query) {
    Object.entries(query).forEach(([column, value]) => {
      this.url.searchParams.append(column, `eq.${value}`);
    });
    return this;
  }
  /**
   * Match only rows which doesn't satisfy the filter.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to be negated to filter with, following
   * PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  not(column, operator, value) {
    this.url.searchParams.append(column, `not.${operator}.${value}`);
    return this;
  }
  /**
   * Match only rows which satisfy at least one of the filters.
   *
   * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure it's properly sanitized.
   *
   * It's currently not possible to do an `.or()` filter across multiple tables.
   *
   * @param filters - The filters to use, following PostgREST syntax
   * @param options - Named parameters
   * @param options.referencedTable - Set this to filter on referenced tables
   * instead of the parent table
   * @param options.foreignTable - Deprecated, use `referencedTable` instead
   */
  or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
    const key2 = referencedTable ? `${referencedTable}.or` : "or";
    this.url.searchParams.append(key2, `(${filters})`);
    return this;
  }
  /**
   * Match only rows which satisfy the filter. This is an escape hatch - you
   * should use the specific filter methods wherever possible.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to filter with, following PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  filter(column, operator, value) {
    this.url.searchParams.append(column, `${operator}.${value}`);
    return this;
  }
}
class PostgrestQueryBuilder {
  constructor(url, { headers = {}, schema, fetch: fetch2 }) {
    this.url = url;
    this.headers = headers;
    this.schema = schema;
    this.fetch = fetch2;
  }
  /**
   * Perform a SELECT query on the table or view.
   *
   * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
   *
   * @param options - Named parameters
   *
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   *
   * @param options.count - Count algorithm to use to count rows in the table or view.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  select(columns, { head = false, count } = {}) {
    const method = head ? "HEAD" : "GET";
    let quoted = false;
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c2) => {
      if (/\s/.test(c2) && !quoted) {
        return "";
      }
      if (c2 === '"') {
        quoted = !quoted;
      }
      return c2;
    }).join("");
    this.url.searchParams.set("select", cleanedColumns);
    if (count) {
      this.headers["Prefer"] = `count=${count}`;
    }
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform an INSERT into the table or view.
   *
   * By default, inserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to insert. Pass an object to insert a single row
   * or an array to insert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count inserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   *
   * @param options.defaultToNull - Make missing fields default to `null`.
   * Otherwise, use the default value for the column. Only applies for bulk
   * inserts.
   */
  insert(values, { count, defaultToNull = true } = {}) {
    const method = "POST";
    const prefersHeaders = [];
    if (this.headers["Prefer"]) {
      prefersHeaders.push(this.headers["Prefer"]);
    }
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    if (!defaultToNull) {
      prefersHeaders.push("missing=default");
    }
    this.headers["Prefer"] = prefersHeaders.join(",");
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x2) => acc.concat(Object.keys(x2)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
        this.url.searchParams.set("columns", uniqueColumns.join(","));
      }
    }
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform an UPSERT on the table or view. Depending on the column(s) passed
   * to `onConflict`, `.upsert()` allows you to perform the equivalent of
   * `.insert()` if a row with the corresponding `onConflict` columns doesn't
   * exist, or if it does exist, perform an alternative action depending on
   * `ignoreDuplicates`.
   *
   * By default, upserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to upsert with. Pass an object to upsert a
   * single row or an array to upsert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
   * duplicate rows are determined. Two rows are duplicates if all the
   * `onConflict` columns are equal.
   *
   * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
   * `false`, duplicate rows are merged with existing rows.
   *
   * @param options.count - Count algorithm to use to count upserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   *
   * @param options.defaultToNull - Make missing fields default to `null`.
   * Otherwise, use the default value for the column. This only applies when
   * inserting new rows, not when merging with existing rows under
   * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
   */
  upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
    const method = "POST";
    const prefersHeaders = [`resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`];
    if (onConflict !== void 0)
      this.url.searchParams.set("on_conflict", onConflict);
    if (this.headers["Prefer"]) {
      prefersHeaders.push(this.headers["Prefer"]);
    }
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    if (!defaultToNull) {
      prefersHeaders.push("missing=default");
    }
    this.headers["Prefer"] = prefersHeaders.join(",");
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x2) => acc.concat(Object.keys(x2)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
        this.url.searchParams.set("columns", uniqueColumns.join(","));
      }
    }
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform an UPDATE on the table or view.
   *
   * By default, updated rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param values - The values to update with
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count updated rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  update(values, { count } = {}) {
    const method = "PATCH";
    const prefersHeaders = [];
    if (this.headers["Prefer"]) {
      prefersHeaders.push(this.headers["Prefer"]);
    }
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    this.headers["Prefer"] = prefersHeaders.join(",");
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform a DELETE on the table or view.
   *
   * By default, deleted rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count deleted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  delete({ count } = {}) {
    const method = "DELETE";
    const prefersHeaders = [];
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    if (this.headers["Prefer"]) {
      prefersHeaders.unshift(this.headers["Prefer"]);
    }
    this.headers["Prefer"] = prefersHeaders.join(",");
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
}
const version$4 = "1.11.0";
const DEFAULT_HEADERS$4 = { "X-Client-Info": `postgrest-js/${version$4}` };
class PostgrestClient {
  // TODO: Add back shouldThrowOnError once we figure out the typings
  /**
   * Creates a PostgREST client.
   *
   * @param url - URL of the PostgREST endpoint
   * @param options - Named parameters
   * @param options.headers - Custom headers
   * @param options.schema - Postgres schema to switch to
   * @param options.fetch - Custom fetch
   */
  constructor(url, { headers = {}, schema, fetch: fetch2 } = {}) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$4), headers);
    this.schemaName = schema;
    this.fetch = fetch2;
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    const url = new URL(`${this.url}/${relation}`);
    return new PostgrestQueryBuilder(url, {
      headers: Object.assign({}, this.headers),
      schema: this.schemaName,
      fetch: this.fetch
    });
  }
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return new PostgrestClient(this.url, {
      headers: this.headers,
      schema,
      fetch: this.fetch
    });
  }
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, { head = false, count } = {}) {
    let method;
    const url = new URL(`${this.url}/rpc/${fn}`);
    let body;
    if (head) {
      method = "HEAD";
      Object.entries(args).forEach(([name, value]) => {
        url.searchParams.append(name, `${value}`);
      });
    } else {
      method = "POST";
      body = args;
    }
    const headers = Object.assign({}, this.headers);
    if (count) {
      headers["Prefer"] = `count=${count}`;
    }
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schemaName,
      body,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
}
const version$3 = "2.9.3";
const DEFAULT_HEADERS$3 = { "X-Client-Info": `realtime-js/${version$3}` };
const VSN = "1.0.0";
const DEFAULT_TIMEOUT = 1e4;
const WS_CLOSE_NORMAL = 1e3;
var SOCKET_STATES;
(function(SOCKET_STATES2) {
  SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
  SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
  SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
  SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
var CHANNEL_STATES;
(function(CHANNEL_STATES2) {
  CHANNEL_STATES2["closed"] = "closed";
  CHANNEL_STATES2["errored"] = "errored";
  CHANNEL_STATES2["joined"] = "joined";
  CHANNEL_STATES2["joining"] = "joining";
  CHANNEL_STATES2["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function(CHANNEL_EVENTS2) {
  CHANNEL_EVENTS2["close"] = "phx_close";
  CHANNEL_EVENTS2["error"] = "phx_error";
  CHANNEL_EVENTS2["join"] = "phx_join";
  CHANNEL_EVENTS2["reply"] = "phx_reply";
  CHANNEL_EVENTS2["leave"] = "phx_leave";
  CHANNEL_EVENTS2["access_token"] = "access_token";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function(TRANSPORTS2) {
  TRANSPORTS2["websocket"] = "websocket";
})(TRANSPORTS || (TRANSPORTS = {}));
var CONNECTION_STATE;
(function(CONNECTION_STATE2) {
  CONNECTION_STATE2["Connecting"] = "connecting";
  CONNECTION_STATE2["Open"] = "open";
  CONNECTION_STATE2["Closing"] = "closing";
  CONNECTION_STATE2["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));
class Timer {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = void 0;
    this.tries = 0;
    this.callback = callback;
    this.timerCalc = timerCalc;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
class Serializer {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload));
    }
    if (typeof rawPayload === "string") {
      return callback(JSON.parse(rawPayload));
    }
    return callback({});
  }
  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    return this._decodeBroadcast(buffer, view, decoder);
  }
  _decodeBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
    return { ref: null, topic, event, payload: data };
  }
}
class Push {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
    this.channel = channel;
    this.event = event;
    this.payload = payload;
    this.timeout = timeout;
    this.sent = false;
    this.timeoutTimer = void 0;
    this.ref = "";
    this.receivedResp = null;
    this.recHooks = [];
    this.refEvent = null;
  }
  resend(timeout) {
    this.timeout = timeout;
    this._cancelRefEvent();
    this.ref = "";
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }
  send() {
    if (this._hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    });
  }
  updatePayload(payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload);
  }
  receive(status, callback) {
    var _a;
    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }
    this.ref = this.channel.socket._makeRef();
    this.refEvent = this.channel._replyEventName(this.ref);
    const callback = (payload) => {
      this._cancelRefEvent();
      this._cancelTimeout();
      this.receivedResp = payload;
      this._matchReceive(payload);
    };
    this.channel._on(this.refEvent, {}, callback);
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  trigger(status, response) {
    if (this.refEvent)
      this.channel._trigger(this.refEvent, { status, response });
  }
  destroy() {
    this._cancelRefEvent();
    this._cancelTimeout();
  }
  _cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = void 0;
  }
  _matchReceive({ status, response }) {
    this.recHooks.filter((h2) => h2.status === status).forEach((h2) => h2.callback(response));
  }
  _hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
}
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
  REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
  REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
  REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
class RealtimePresence {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.state = {};
    this.pendingDiffs = [];
    this.joinRef = null;
    this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    };
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.channel._on(events.state, {}, (newState) => {
      const { onJoin, onLeave, onSync } = this.caller;
      this.joinRef = this.channel._joinRef();
      this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach((diff) => {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel._on(events.diff, {}, (diff) => {
      const { onJoin, onLeave, onSync } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
    this.onJoin((key2, currentPresences, newPresences) => {
      this.channel._trigger("presence", {
        event: "join",
        key: key2,
        currentPresences,
        newPresences
      });
    });
    this.onLeave((key2, currentPresences, leftPresences) => {
      this.channel._trigger("presence", {
        event: "leave",
        key: key2,
        currentPresences,
        leftPresences
      });
    });
    this.onSync(() => {
      this.channel._trigger("presence", { event: "sync" });
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState(currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState);
    const transformedState = this.transformState(newState);
    const joins = {};
    const leaves = {};
    this.map(state, (key2, presences) => {
      if (!transformedState[key2]) {
        leaves[key2] = presences;
      }
    });
    this.map(transformedState, (key2, newPresences) => {
      const currentPresences = state[key2];
      if (currentPresences) {
        const newPresenceRefs = newPresences.map((m2) => m2.presence_ref);
        const curPresenceRefs = currentPresences.map((m2) => m2.presence_ref);
        const joinedPresences = newPresences.filter((m2) => curPresenceRefs.indexOf(m2.presence_ref) < 0);
        const leftPresences = currentPresences.filter((m2) => newPresenceRefs.indexOf(m2.presence_ref) < 0);
        if (joinedPresences.length > 0) {
          joins[key2] = joinedPresences;
        }
        if (leftPresences.length > 0) {
          leaves[key2] = leftPresences;
        }
      } else {
        joins[key2] = newPresences;
      }
    });
    return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff(state, diff, onJoin, onLeave) {
    const { joins, leaves } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    };
    if (!onJoin) {
      onJoin = () => {
      };
    }
    if (!onLeave) {
      onLeave = () => {
      };
    }
    this.map(joins, (key2, newPresences) => {
      var _a;
      const currentPresences = (_a = state[key2]) !== null && _a !== void 0 ? _a : [];
      state[key2] = this.cloneDeep(newPresences);
      if (currentPresences.length > 0) {
        const joinedPresenceRefs = state[key2].map((m2) => m2.presence_ref);
        const curPresences = currentPresences.filter((m2) => joinedPresenceRefs.indexOf(m2.presence_ref) < 0);
        state[key2].unshift(...curPresences);
      }
      onJoin(key2, currentPresences, newPresences);
    });
    this.map(leaves, (key2, leftPresences) => {
      let currentPresences = state[key2];
      if (!currentPresences)
        return;
      const presenceRefsToRemove = leftPresences.map((m2) => m2.presence_ref);
      currentPresences = currentPresences.filter((m2) => presenceRefsToRemove.indexOf(m2.presence_ref) < 0);
      state[key2] = currentPresences;
      onLeave(key2, currentPresences, leftPresences);
      if (currentPresences.length === 0)
        delete state[key2];
    });
    return state;
  }
  /** @internal */
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map((key2) => func(key2, obj[key2]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState(state) {
    state = this.cloneDeep(state);
    return Object.getOwnPropertyNames(state).reduce((newState, key2) => {
      const presences = state[key2];
      if ("metas" in presences) {
        newState[key2] = presences.metas.map((presence) => {
          presence["presence_ref"] = presence["phx_ref"];
          delete presence["phx_ref"];
          delete presence["phx_ref_prev"];
          return presence;
        });
      } else {
        newState[key2] = presences;
      }
      return newState;
    }, {});
  }
  /** @internal */
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  /** @internal */
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  /** @internal */
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  /** @internal */
  onSync(callback) {
    this.caller.onSync = callback;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
var PostgresTypes;
(function(PostgresTypes2) {
  PostgresTypes2["abstime"] = "abstime";
  PostgresTypes2["bool"] = "bool";
  PostgresTypes2["date"] = "date";
  PostgresTypes2["daterange"] = "daterange";
  PostgresTypes2["float4"] = "float4";
  PostgresTypes2["float8"] = "float8";
  PostgresTypes2["int2"] = "int2";
  PostgresTypes2["int4"] = "int4";
  PostgresTypes2["int4range"] = "int4range";
  PostgresTypes2["int8"] = "int8";
  PostgresTypes2["int8range"] = "int8range";
  PostgresTypes2["json"] = "json";
  PostgresTypes2["jsonb"] = "jsonb";
  PostgresTypes2["money"] = "money";
  PostgresTypes2["numeric"] = "numeric";
  PostgresTypes2["oid"] = "oid";
  PostgresTypes2["reltime"] = "reltime";
  PostgresTypes2["text"] = "text";
  PostgresTypes2["time"] = "time";
  PostgresTypes2["timestamp"] = "timestamp";
  PostgresTypes2["timestamptz"] = "timestamptz";
  PostgresTypes2["timetz"] = "timetz";
  PostgresTypes2["tsrange"] = "tsrange";
  PostgresTypes2["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
const convertChangeData = (columns, record, options = {}) => {
  var _a;
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
const convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find((x2) => x2.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }
  return noop$1(value);
};
const convertCell = (type, value) => {
  if (type.charAt(0) === "_") {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  }
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);
    case PostgresTypes.timestamp:
      return toTimestampString(value);
    case PostgresTypes.abstime:
    case PostgresTypes.date:
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime:
    case PostgresTypes.text:
    case PostgresTypes.time:
    case PostgresTypes.timestamptz:
    case PostgresTypes.timetz:
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop$1(value);
    default:
      return noop$1(value);
  }
};
const noop$1 = (value) => {
  return value;
};
const toBoolean = (value) => {
  switch (value) {
    case "t":
      return true;
    case "f":
      return false;
    default:
      return value;
  }
};
const toNumber = (value) => {
  if (typeof value === "string") {
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};
const toJson = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      return value;
    }
  }
  return value;
};
const toArray = (value, type) => {
  if (typeof value !== "string") {
    return value;
  }
  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0];
  if (openBrace === "{" && closeBrace === "}") {
    let arr;
    const valTrim = value.slice(1, lastIdx);
    try {
      arr = JSON.parse("[" + valTrim + "]");
    } catch (_) {
      arr = valTrim ? valTrim.split(",") : [];
    }
    return arr.map((val) => convertCell(type, val));
  }
  return value;
};
const toTimestampString = (value) => {
  if (typeof value === "string") {
    return value.replace(" ", "T");
  }
  return value;
};
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function(REALTIME_LISTEN_TYPES2) {
  REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
  REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
  REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function(REALTIME_SUBSCRIBE_STATES2) {
  REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
  REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
  REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
  REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
class RealtimeChannel {
  constructor(topic, params = { config: {} }, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = {};
    this.state = CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.subTopic = topic.replace(/^realtime:/i, "");
    this.params.config = Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: "" }
    }, params.config);
    this.timeout = this.socket.timeout;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this._onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket._remove(this);
    });
    this._onError((reason) => {
      if (this._isLeaving() || this._isClosed()) {
        return;
      }
      this.socket.log("channel", `error ${this.topic}`, reason);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", () => {
      if (!this._isJoining()) {
        return;
      }
      this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this._trigger(this._replyEventName(ref), payload);
    });
    this.presence = new RealtimePresence(this);
    this.broadcastEndpointURL = this._broadcastEndpointURL();
  }
  /** Subscribe registers your client with the server */
  subscribe(callback, timeout = this.timeout) {
    var _a, _b;
    if (!this.socket.isConnected()) {
      this.socket.connect();
    }
    if (this.joinedOnce) {
      throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
    } else {
      const { config: { broadcast, presence } } = this.params;
      this._onError((e) => callback && callback("CHANNEL_ERROR", e));
      this._onClose(() => callback && callback("CLOSED"));
      const accessTokenPayload = {};
      const config2 = {
        broadcast,
        presence,
        postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r2) => r2.filter)) !== null && _b !== void 0 ? _b : []
      };
      if (this.socket.accessToken) {
        accessTokenPayload.access_token = this.socket.accessToken;
      }
      this.updateJoinPayload(Object.assign({ config: config2 }, accessTokenPayload));
      this.joinedOnce = true;
      this._rejoin(timeout);
      this.joinPush.receive("ok", ({ postgres_changes: serverPostgresFilters }) => {
        var _a2;
        this.socket.accessToken && this.socket.setAuth(this.socket.accessToken);
        if (serverPostgresFilters === void 0) {
          callback && callback("SUBSCRIBED");
          return;
        } else {
          const clientPostgresBindings = this.bindings.postgres_changes;
          const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
          const newPostgresBindings = [];
          for (let i2 = 0; i2 < bindingsLen; i2++) {
            const clientPostgresBinding = clientPostgresBindings[i2];
            const { filter: { event, schema, table, filter } } = clientPostgresBinding;
            const serverPostgresFilter = serverPostgresFilters && serverPostgresFilters[i2];
            if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
              newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
            } else {
              this.unsubscribe();
              callback && callback("CHANNEL_ERROR", new Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = newPostgresBindings;
          callback && callback("SUBSCRIBED");
          return;
        }
      }).receive("error", (error) => {
        callback && callback("CHANNEL_ERROR", new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
        return;
      }).receive("timeout", () => {
        callback && callback("TIMED_OUT");
        return;
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(payload, opts = {}) {
    return await this.send({
      type: "presence",
      event: "track",
      payload
    }, opts.timeout || this.timeout);
  }
  async untrack(opts = {}) {
    return await this.send({
      type: "presence",
      event: "untrack"
    }, opts);
  }
  on(type, filter, callback) {
    return this._on(type, filter, callback);
  }
  /**
   * Sends a message into the channel.
   *
   * @param args Arguments to send to channel
   * @param args.type The type of event to send
   * @param args.event The name of the event being sent
   * @param args.payload Payload to be sent
   * @param opts Options to be used during the send process
   */
  async send(args, opts = {}) {
    var _a, _b;
    if (!this._canPush() && args.type === "broadcast") {
      const { event, payload: endpoint_payload } = args;
      const options = {
        method: "POST",
        headers: {
          apikey: (_a = this.socket.apiKey) !== null && _a !== void 0 ? _a : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { topic: this.subTopic, event, payload: endpoint_payload }
          ]
        })
      };
      try {
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_b = opts.timeout) !== null && _b !== void 0 ? _b : this.timeout);
        if (response.ok) {
          return "ok";
        } else {
          return "error";
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return "timed out";
        } else {
          return "error";
        }
      }
    } else {
      return new Promise((resolve) => {
        var _a2, _b2, _c;
        const push = this._push(args.type, args, opts.timeout || this.timeout);
        if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
          resolve("ok");
        }
        push.receive("ok", () => resolve("ok"));
        push.receive("timeout", () => resolve("timed out"));
      });
    }
  }
  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe(timeout = this.timeout) {
    this.state = CHANNEL_STATES.leaving;
    const onClose = () => {
      this.socket.log("channel", `leave ${this.topic}`);
      this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
    };
    this.rejoinTimer.reset();
    this.joinPush.destroy();
    return new Promise((resolve) => {
      const leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", () => {
        onClose();
        resolve("ok");
      }).receive("timeout", () => {
        onClose();
        resolve("timed out");
      }).receive("error", () => {
        resolve("error");
      });
      leavePush.send();
      if (!this._canPush()) {
        leavePush.trigger("ok", {});
      }
    });
  }
  /** @internal */
  _broadcastEndpointURL() {
    let url = this.socket.endPoint;
    url = url.replace(/^ws/i, "http");
    url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "");
    return url.replace(/\/+$/, "") + "/api/broadcast";
  }
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
    clearTimeout(id);
    return response;
  }
  /** @internal */
  _push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }
    let pushEvent = new Push(this, event, payload, timeout);
    if (this._canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(_event, payload, _ref) {
    return payload;
  }
  /** @internal */
  _isMember(topic) {
    return this.topic === topic;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(type, payload, ref) {
    var _a, _b;
    const typeLower = type.toLocaleLowerCase();
    const { close, error, leave, join } = CHANNEL_EVENTS;
    const events = [close, error, leave, join];
    if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
      return;
    }
    let handledPayload = this._onMessage(typeLower, payload, ref);
    if (payload && !handledPayload) {
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    }
    if (["insert", "update", "delete"].includes(typeLower)) {
      (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind2) => {
        var _a2, _b2, _c;
        return ((_a2 = bind2.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind2.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
      }).map((bind2) => bind2.callback(handledPayload, ref));
    } else {
      (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind2) => {
        var _a2, _b2, _c, _d, _e, _f;
        if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
          if ("id" in bind2) {
            const bindId = bind2.id;
            const bindEvent = (_a2 = bind2.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
            return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
          } else {
            const bindEvent = (_e = (_d = bind2 === null || bind2 === void 0 ? void 0 : bind2.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
            return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
          }
        } else {
          return bind2.type.toLocaleLowerCase() === typeLower;
        }
      }).map((bind2) => {
        if (typeof handledPayload === "object" && "ids" in handledPayload) {
          const postgresChanges = handledPayload.data;
          const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
          const enrichedPayload = {
            schema,
            table,
            commit_timestamp,
            eventType: type2,
            new: {},
            old: {},
            errors
          };
          handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
        }
        bind2.callback(handledPayload, ref);
      });
    }
  }
  /** @internal */
  _isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
  /** @internal */
  _replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  /** @internal */
  _on(type, filter, callback) {
    const typeLower = type.toLocaleLowerCase();
    const binding = {
      type: typeLower,
      filter,
      callback
    };
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding);
    } else {
      this.bindings[typeLower] = [binding];
    }
    return this;
  }
  /** @internal */
  _off(type, filter) {
    const typeLower = type.toLocaleLowerCase();
    this.bindings[typeLower] = this.bindings[typeLower].filter((bind2) => {
      var _a;
      return !(((_a = bind2.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && RealtimeChannel.isEqual(bind2.filter, filter));
    });
    return this;
  }
  /** @internal */
  static isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const k2 in obj1) {
      if (obj1[k2] !== obj2[k2]) {
        return false;
      }
    }
    return true;
  }
  /** @internal */
  _rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();
    if (this.socket.isConnected()) {
      this._rejoin();
    }
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(callback) {
    this._on(CHANNEL_EVENTS.close, {}, callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(callback) {
    this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  /** @internal */
  _rejoin(timeout = this.timeout) {
    if (this._isLeaving()) {
      return;
    }
    this.socket._leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  /** @internal */
  _getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };
    if (payload.type === "INSERT" || payload.type === "UPDATE") {
      records.new = convertChangeData(payload.columns, payload.record);
    }
    if (payload.type === "UPDATE" || payload.type === "DELETE") {
      records.old = convertChangeData(payload.columns, payload.old_record);
    }
    return records;
  }
}
const noop = () => {
};
const NATIVE_WEBSOCKET_AVAILABLE = typeof WebSocket !== "undefined";
class RealtimeClient {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket.
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers The optional headers to pass when connecting.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   */
  constructor(endPoint, options) {
    var _a;
    this.accessToken = null;
    this.apiKey = null;
    this.channels = [];
    this.endPoint = "";
    this.headers = DEFAULT_HEADERS$3;
    this.params = {};
    this.timeout = DEFAULT_TIMEOUT;
    this.heartbeatIntervalMs = 3e4;
    this.heartbeatTimer = void 0;
    this.pendingHeartbeatRef = null;
    this.ref = 0;
    this.logger = noop;
    this.conn = null;
    this.sendBuffer = [];
    this.serializer = new Serializer();
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    this._resolveFetch = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => __vitePreload(() => Promise.resolve().then(() => browser$1), true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    if (options === null || options === void 0 ? void 0 : options.transport) {
      this.transport = options.transport;
    } else {
      this.transport = null;
    }
    if (options === null || options === void 0 ? void 0 : options.params)
      this.params = options.params;
    if (options === null || options === void 0 ? void 0 : options.headers)
      this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
    if (options === null || options === void 0 ? void 0 : options.timeout)
      this.timeout = options.timeout;
    if (options === null || options === void 0 ? void 0 : options.logger)
      this.logger = options.logger;
    if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
      this.heartbeatIntervalMs = options.heartbeatIntervalMs;
    const accessToken = (_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey;
    if (accessToken) {
      this.accessToken = accessToken;
      this.apiKey = accessToken;
    }
    this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs : (tries) => {
      return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4;
    };
    this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode : (payload, callback) => {
      return callback(JSON.stringify(payload));
    };
    this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer);
    this.reconnectTimer = new Timer(async () => {
      this.disconnect();
      this.connect();
    }, this.reconnectAfterMs);
    this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    if (this.conn) {
      return;
    }
    if (this.transport) {
      this.conn = new this.transport(this._endPointURL(), void 0, {
        headers: this.headers
      });
      return;
    }
    if (NATIVE_WEBSOCKET_AVAILABLE) {
      this.conn = new WebSocket(this._endPointURL());
      this.setupConnection();
      return;
    }
    this.conn = new WSWebSocketDummy(this._endPointURL(), void 0, {
      close: () => {
        this.conn = null;
      }
    });
    __vitePreload(() => import("./browser-D1vrtkrm.js").then((n2) => n2.b), true ? __vite__mapDeps([]) : void 0).then(({ default: WS }) => {
      this.conn = new WS(this._endPointURL(), void 0, {
        headers: this.headers
      });
      this.setupConnection();
    });
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(code, reason) {
    if (this.conn) {
      this.conn.onclose = function() {
      };
      if (code) {
        this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
      } else {
        this.conn.close();
      }
      this.conn = null;
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
      this.reconnectTimer.reset();
    }
  }
  /**
   * Returns all created channels
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  async removeChannel(channel) {
    const status = await channel.unsubscribe();
    if (this.channels.length === 0) {
      this.disconnect();
    }
    return status;
  }
  /**
   * Unsubscribes and removes all channels
   */
  async removeAllChannels() {
    const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
    this.disconnect();
    return values_1;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return CONNECTION_STATE.Connecting;
      case SOCKET_STATES.open:
        return CONNECTION_STATE.Open;
      case SOCKET_STATES.closing:
        return CONNECTION_STATE.Closing;
      default:
        return CONNECTION_STATE.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === CONNECTION_STATE.Open;
  }
  channel(topic, params = { config: {} }) {
    const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
    this.channels.push(chan);
    return chan;
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(data) {
    const { topic, event, payload, ref } = data;
    const callback = () => {
      this.encode(data, (result) => {
        var _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
      });
    };
    this.log("push", `${topic} ${event} (${ref})`, payload);
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * @param token A JWT string.
   */
  setAuth(token) {
    this.accessToken = token;
    this.channels.forEach((channel) => {
      token && channel.updateJoinPayload({ access_token: token });
      if (channel.joinedOnce && channel._isJoined()) {
        channel._push(CHANNEL_EVENTS.access_token, { access_token: token });
      }
    });
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c2) => c2.topic === topic && (c2._isJoined() || c2._isJoining()));
    if (dupChannel) {
      this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.unsubscribe();
    }
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(channel) {
    this.channels = this.channels.filter((c2) => c2._joinRef() !== channel._joinRef());
  }
  /**
   * Sets up connection handlers.
   *
   * @internal
   */
  setupConnection() {
    if (this.conn) {
      this.conn.binaryType = "arraybuffer";
      this.conn.onopen = () => this._onConnOpen();
      this.conn.onerror = (error) => this._onConnError(error);
      this.conn.onmessage = (event) => this._onConnMessage(event);
      this.conn.onclose = (event) => this._onConnClose(event);
    }
  }
  /**
   * Returns the URL of the websocket.
   *
   * @internal
   */
  _endPointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
  }
  /** @internal */
  _onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      let { topic, event, payload, ref } = msg;
      if (ref && ref === this.pendingHeartbeatRef || event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
        this.pendingHeartbeatRef = null;
      }
      this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
      this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
      this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
    });
  }
  /** @internal */
  _onConnOpen() {
    this.log("transport", `connected to ${this._endPointURL()}`);
    this._flushSendBuffer();
    this.reconnectTimer.reset();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
    this.stateChangeCallbacks.open.forEach((callback) => callback());
  }
  /** @internal */
  _onConnClose(event) {
    this.log("transport", "close", event);
    this._triggerChanError();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnectTimer.scheduleTimeout();
    this.stateChangeCallbacks.close.forEach((callback) => callback(event));
  }
  /** @internal */
  _onConnError(error) {
    this.log("transport", error.message);
    this._triggerChanError();
    this.stateChangeCallbacks.error.forEach((callback) => callback(error));
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
  }
  /** @internal */
  _appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    const prefix = url.match(/\?/) ? "&" : "?";
    const query = new URLSearchParams(params);
    return `${url}${prefix}${query}`;
  }
  /** @internal */
  _flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  /** @internal */
  _sendHeartbeat() {
    var _a;
    if (!this.isConnected()) {
      return;
    }
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "hearbeat timeout");
      return;
    }
    this.pendingHeartbeatRef = this._makeRef();
    this.push({
      topic: "phoenix",
      event: "heartbeat",
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.setAuth(this.accessToken);
  }
}
class WSWebSocketDummy {
  constructor(address, _protocols, options) {
    this.binaryType = "arraybuffer";
    this.onclose = () => {
    };
    this.onerror = () => {
    };
    this.onmessage = () => {
    };
    this.onopen = () => {
    };
    this.readyState = SOCKET_STATES.connecting;
    this.send = () => {
    };
    this.url = null;
    this.url = address;
    this.close = options.close;
  }
}
class StorageError extends Error {
  constructor(message) {
    super(message);
    this.__isStorageError = true;
    this.name = "StorageError";
  }
}
function isStorageError(error) {
  return typeof error === "object" && error !== null && "__isStorageError" in error;
}
class StorageApiError extends StorageError {
  constructor(message, status) {
    super(message);
    this.name = "StorageApiError";
    this.status = status;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class StorageUnknownError extends StorageError {
  constructor(message, originalError) {
    super(message);
    this.name = "StorageUnknownError";
    this.originalError = originalError;
  }
}
var __awaiter$5 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const resolveFetch$2 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => __vitePreload(() => Promise.resolve().then(() => browser$1), true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveResponse = () => __awaiter$5(void 0, void 0, void 0, function* () {
  if (typeof Response === "undefined") {
    return (yield __vitePreload(() => Promise.resolve().then(() => browser$1), true ? void 0 : void 0)).Response;
  }
  return Response;
});
var __awaiter$4 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const _getErrorMessage$1 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const handleError$1 = (error, reject) => __awaiter$4(void 0, void 0, void 0, function* () {
  const Res = yield resolveResponse();
  if (error instanceof Res) {
    error.json().then((err) => {
      reject(new StorageApiError(_getErrorMessage$1(err), error.status || 500));
    }).catch((err) => {
      reject(new StorageUnknownError(_getErrorMessage$1(err), err));
    });
  } else {
    reject(new StorageUnknownError(_getErrorMessage$1(error), error));
  }
});
const _getRequestParams$1 = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest$1(fetcher, method, url, options, parameters, body) {
  return __awaiter$4(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams$1(method, options, parameters, body)).then((result) => {
        if (!result.ok)
          throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson)
          return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError$1(error, reject));
    });
  });
}
function get(fetcher, url, options, parameters) {
  return __awaiter$4(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "GET", url, options, parameters);
  });
}
function post(fetcher, url, body, options, parameters) {
  return __awaiter$4(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "POST", url, options, parameters, body);
  });
}
function put(fetcher, url, body, options, parameters) {
  return __awaiter$4(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "PUT", url, options, parameters, body);
  });
}
function remove(fetcher, url, body, options, parameters) {
  return __awaiter$4(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "DELETE", url, options, parameters, body);
  });
}
var __awaiter$3 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
};
const DEFAULT_FILE_OPTIONS = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: false
};
class StorageFileApi {
  constructor(url, headers = {}, bucketId, fetch2) {
    this.url = url;
    this.headers = headers;
    this.bucketId = bucketId;
    this.fetch = resolveFetch$2(fetch2);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(method, path, fileBody, fileOptions) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        let body;
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
        }
        const cleanPath = this._removeEmptyFolders(path);
        const _path = this._getFinalPath(cleanPath);
        const res = yield this.fetch(`${this.url}/object/${_path}`, Object.assign({ method, body, headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
        const data = yield res.json();
        if (res.ok) {
          return {
            data: { path: cleanPath, id: data.Id, fullPath: data.Key },
            error: null
          };
        } else {
          const error = data;
          return { data: null, error };
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(path, fileBody, fileOptions) {
    return __awaiter$3(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(path, token, fileBody, fileOptions) {
    return __awaiter$3(this, void 0, void 0, function* () {
      const cleanPath = this._removeEmptyFolders(path);
      const _path = this._getFinalPath(cleanPath);
      const url = new URL(this.url + `/object/upload/sign/${_path}`);
      url.searchParams.set("token", token);
      try {
        let body;
        const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options.upsert) });
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
        }
        const res = yield this.fetch(url.toString(), {
          method: "PUT",
          body,
          headers
        });
        const data = yield res.json();
        if (res.ok) {
          return {
            data: { path: cleanPath, fullPath: data.Key },
            error: null
          };
        } else {
          const error = data;
          return { data: null, error };
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for 2 hours.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   */
  createSignedUploadUrl(path) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        const data = yield post(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers: this.headers });
        const url = new URL(this.url + data.url);
        const token = url.searchParams.get("token");
        if (!token) {
          throw new StorageError("No token returned by API");
        }
        return { data: { signedUrl: url.toString(), path, token }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(path, fileBody, fileOptions) {
    return __awaiter$3(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   */
  move(fromPath, toPath) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   */
  copy(fromPath, toPath) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
        return { data: { path: data.Key }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl(path, expiresIn, options) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
        data = { signedUrl };
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls(paths, expiresIn, options) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        return {
          data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
          error: null
        };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(path, options) {
    return __awaiter$3(this, void 0, void 0, function* () {
      const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
      const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      const queryString = transformationQuery ? `?${transformationQuery}` : "";
      try {
        const _path = this._getFinalPath(path);
        const res = yield get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        });
        const data = yield res.blob();
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl(path, options) {
    const _path = this._getFinalPath(path);
    const _queryString = [];
    const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
    if (downloadQueryParam !== "") {
      _queryString.push(downloadQueryParam);
    }
    const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
    const renderPath = wantsTransformation ? "render/image" : "object";
    const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
    if (transformationQuery !== "") {
      _queryString.push(transformationQuery);
    }
    let queryString = _queryString.join("&");
    if (queryString !== "") {
      queryString = `?${queryString}`;
    }
    return {
      data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(paths) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   */
  list(path, options, parameters) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || "" });
        const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  _getFinalPath(path) {
    return `${this.bucketId}/${path}`;
  }
  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(transform2) {
    const params = [];
    if (transform2.width) {
      params.push(`width=${transform2.width}`);
    }
    if (transform2.height) {
      params.push(`height=${transform2.height}`);
    }
    if (transform2.resize) {
      params.push(`resize=${transform2.resize}`);
    }
    if (transform2.format) {
      params.push(`format=${transform2.format}`);
    }
    if (transform2.quality) {
      params.push(`quality=${transform2.quality}`);
    }
    return params.join("&");
  }
}
const version$2 = "2.5.5";
const DEFAULT_HEADERS$2 = { "X-Client-Info": `storage-js/${version$2}` };
var __awaiter$2 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class StorageBucketApi {
  constructor(url, headers = {}, fetch2) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$2), headers);
    this.fetch = resolveFetch$2(fetch2);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return __awaiter$2(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(id) {
    return __awaiter$2(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   * @returns newly created bucket id
   */
  createBucket(id, options = {
    public: false
  }) {
    return __awaiter$2(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   */
  updateBucket(id, options) {
    return __awaiter$2(this, void 0, void 0, function* () {
      try {
        const data = yield put(this.fetch, `${this.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(id) {
    return __awaiter$2(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(id) {
    return __awaiter$2(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
}
class StorageClient extends StorageBucketApi {
  constructor(url, headers = {}, fetch2) {
    super(url, headers, fetch2);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(id) {
    return new StorageFileApi(this.url, this.headers, id, this.fetch);
  }
}
const version$1 = "2.39.3";
let JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else if (typeof document !== "undefined") {
  JS_ENV = "web";
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  JS_ENV = "react-native";
} else {
  JS_ENV = "node";
}
const DEFAULT_HEADERS$1 = { "X-Client-Info": `supabase-js-${JS_ENV}/${version$1}` };
var __awaiter$1 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const resolveFetch$1 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = nodeFetch;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers$1;
  }
  return Headers;
};
const fetchWithAuth = (supabaseKey2, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch$1(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init2) => __awaiter$1(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey2;
    let headers = new HeadersConstructor(init2 === null || init2 === void 0 ? void 0 : init2.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey2);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch2(input, Object.assign(Object.assign({}, init2), { headers }));
  });
};
function stripTrailingSlash(url) {
  return url.replace(/\/$/, "");
}
function applySettingDefaults(options, defaults) {
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  return {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    global: Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions)
  };
}
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c2) {
    const r2 = Math.random() * 16 | 0, v2 = c2 == "x" ? r2 : r2 & 3 | 8;
    return v2.toString(16);
  });
}
const isBrowser$1 = () => typeof document !== "undefined";
const localStorageWriteTests = {
  tested: false,
  writable: false
};
const supportsLocalStorage = () => {
  if (!isBrowser$1()) {
    return false;
  }
  try {
    if (typeof globalThis.localStorage !== "object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable;
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(randomKey, randomKey);
    globalThis.localStorage.removeItem(randomKey);
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = true;
  } catch (e) {
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = false;
  }
  return localStorageWriteTests.writable;
};
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key2) => {
        result[key2] = value;
      });
    } catch (e) {
    }
  }
  url.searchParams.forEach((value, key2) => {
    result[key2] = value;
  });
  return result;
}
const resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => __vitePreload(() => Promise.resolve().then(() => browser$1), true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const looksLikeFetchResponse = (maybeResponse) => {
  return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
};
const setItemAsync = async (storage, key2, data) => {
  await storage.setItem(key2, JSON.stringify(data));
};
const getItemAsync = async (storage, key2) => {
  const value = await storage.getItem(key2);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
};
const removeItemAsync = async (storage, key2) => {
  await storage.removeItem(key2);
};
function decodeBase64URL(value) {
  const key2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let base64 = "";
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i2 = 0;
  value = value.replace("-", "+").replace("_", "/");
  while (i2 < value.length) {
    enc1 = key2.indexOf(value.charAt(i2++));
    enc2 = key2.indexOf(value.charAt(i2++));
    enc3 = key2.indexOf(value.charAt(i2++));
    enc4 = key2.indexOf(value.charAt(i2++));
    chr1 = enc1 << 2 | enc2 >> 4;
    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    chr3 = (enc3 & 3) << 6 | enc4;
    base64 = base64 + String.fromCharCode(chr1);
    if (enc3 != 64 && chr2 != 0) {
      base64 = base64 + String.fromCharCode(chr2);
    }
    if (enc4 != 64 && chr3 != 0) {
      base64 = base64 + String.fromCharCode(chr3);
    }
  }
  return base64;
}
class Deferred {
  constructor() {
    this.promise = new Deferred.promiseConstructor((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}
Deferred.promiseConstructor = Promise;
function decodeJWTPayload(token) {
  const base64UrlRegex = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i;
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT is not valid: not a JWT structure");
  }
  if (!base64UrlRegex.test(parts[1])) {
    throw new Error("JWT is not valid: payload is not in base64url format");
  }
  const base64Url = parts[1];
  return JSON.parse(decodeBase64URL(base64Url));
}
async function sleep(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i2 = 0; i2 < verifierLength; i2++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map((c2) => String.fromCharCode(c2)).join("");
}
function base64urlencode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
  if (!hasCryptoSupport) {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}
class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.__isAuthError = true;
    this.name = "AuthError";
    this.status = status;
  }
}
function isAuthError(error) {
  return typeof error === "object" && error !== null && "__isAuthError" in error;
}
class AuthApiError extends AuthError {
  constructor(message, status) {
    super(message, status);
    this.name = "AuthApiError";
    this.status = status;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
function isAuthApiError(error) {
  return isAuthError(error) && error.name === "AuthApiError";
}
class AuthUnknownError extends AuthError {
  constructor(message, originalError) {
    super(message);
    this.name = "AuthUnknownError";
    this.originalError = originalError;
  }
}
class CustomAuthError extends AuthError {
  constructor(message, name, status) {
    super(message);
    this.name = name;
    this.status = status;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class AuthSessionMissingError extends CustomAuthError {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400);
  }
}
class AuthInvalidTokenResponseError extends CustomAuthError {
  constructor() {
    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500);
  }
}
class AuthInvalidCredentialsError extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidCredentialsError", 400);
  }
}
class AuthImplicitGrantRedirectError extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthImplicitGrantRedirectError", 500);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class AuthPKCEGrantCodeExchangeError extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthPKCEGrantCodeExchangeError", 500);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class AuthRetryableFetchError extends CustomAuthError {
  constructor(message, status) {
    super(message, "AuthRetryableFetchError", status);
  }
}
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
class AuthWeakPasswordError extends CustomAuthError {
  constructor(message, status, reasons) {
    super(message, "AuthWeakPasswordError", status);
    this.reasons = reasons;
  }
}
var __rest$1 = function(s2, e) {
  var t2 = {};
  for (var p2 in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
      t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
      if (e.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
        t2[p2[i2]] = s2[p2[i2]];
    }
  return t2;
};
const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const NETWORK_ERROR_CODES = [502, 503, 504];
async function handleError(error) {
  if (!looksLikeFetchResponse(error)) {
    throw new AuthRetryableFetchError(_getErrorMessage(error), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage(error), error.status);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    throw new AuthUnknownError(_getErrorMessage(e), e);
  }
  if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a2, i2) => a2 && typeof i2 === "string", true)) {
    throw new AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
  }
  throw new AuthApiError(_getErrorMessage(data), error.status || 500);
}
const _getRequestParams = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs["redirect_to"] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest(fetcher, method, url + queryString, { headers, noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, requestParams);
  } catch (e) {
    console.error(e);
    throw new AuthRetryableFetchError(_getErrorMessage(e), 0);
  }
  if (!result.ok) {
    await handleError(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { session, user }, error: null };
}
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a2, i2) => a2 && typeof i2 === "string", true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
function _ssoResponse(data) {
  return { data, error: null };
}
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest$1(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}
var __rest = function(s2, e) {
  var t2 = {};
  for (var p2 in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
      t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
      if (e.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
        t2[p2[i2]] = s2[p2[i2]];
    }
  return t2;
};
class GoTrueAdminApi {
  constructor({ url = "", headers = {}, fetch: fetch2 }) {
    this.url = url;
    this.headers = headers;
    this.fetch = resolveFetch(fetch2);
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(jwt, scope = "global") {
    try {
      await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  async generateLink(params) {
    try {
      const { options } = params, rest = __rest(params, ["options"]);
      const body = Object.assign(Object.assign({}, rest), options);
      if ("newEmail" in rest) {
        body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
        delete body["newEmail"];
      }
      return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
        body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(attributes) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 };
      const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
          per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
        },
        xform: _noResolveJsonResponse
      });
      if (response.error)
        throw response.error;
      const users = await response.json();
      const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach((link) => {
          const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
          const rel = JSON.parse(link.split(";")[1].split("=")[1]);
          pagination[`${rel}Page`] = page;
        });
        pagination.total = parseInt(total);
      }
      return { data: Object.assign(Object.assign({}, users), pagination), error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(uid) {
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(uid, attributes) {
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted (setting `deleted_at` to the current timestamp and disabling their account while preserving their data) from the auth schema.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async deleteUser(id, shouldSoftDelete = false) {
    try {
      return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete
        },
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  async _listFactors(params) {
    try {
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
        headers: this.headers,
        xform: (factors) => {
          return { data: { factors }, error: null };
        }
      });
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _deleteFactor(params) {
    try {
      const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
        headers: this.headers
      });
      return { data, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
}
const version = "0.0.0";
const GOTRUE_URL = "http://localhost:9999";
const STORAGE_KEY = "supabase.auth.token";
const DEFAULT_HEADERS = { "X-Client-Info": `gotrue-js/${version}` };
const EXPIRY_MARGIN = 10;
const localStorageAdapter = {
  getItem: (key2) => {
    if (!supportsLocalStorage()) {
      return null;
    }
    return globalThis.localStorage.getItem(key2);
  },
  setItem: (key2, value) => {
    if (!supportsLocalStorage()) {
      return;
    }
    globalThis.localStorage.setItem(key2, value);
  },
  removeItem: (key2) => {
    if (!supportsLocalStorage()) {
      return;
    }
    globalThis.localStorage.removeItem(key2);
  }
};
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: (key2) => {
      return store[key2] || null;
    },
    setItem: (key2, value) => {
      store[key2] = value;
    },
    removeItem: (key2) => {
      delete store[key2];
    }
  };
}
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function() {
        return this;
      },
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}
const internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
class LockAcquireTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
}
class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
}
async function navigatorLock(name, acquireTimeout, fn) {
  if (internals.debug) {
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name, acquireTimeout);
  }
  const abortController = new globalThis.AbortController();
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name);
      }
    }, acquireTimeout);
  }
  return await globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
    mode: "exclusive",
    ifAvailable: true
  } : {
    mode: "exclusive",
    signal: abortController.signal
  }, async (lock) => {
    if (lock) {
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock: acquired", name, lock.name);
      }
      try {
        return await fn();
      } finally {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: released", name, lock.name);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name);
        }
        throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
      } else {
        if (internals.debug) {
          try {
            const result = await globalThis.navigator.locks.query();
            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
          } catch (e) {
            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e);
          }
        }
        console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
        return await fn();
      }
    }
  });
}
polyfillGlobalThis();
const DEFAULT_OPTIONS = {
  url: GOTRUE_URL,
  storageKey: STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS,
  flowType: "implicit",
  debug: false
};
const AUTO_REFRESH_TICK_DURATION = 30 * 1e3;
const AUTO_REFRESH_TICK_THRESHOLD = 3;
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
class GoTrueClient {
  /**
   * Create a new client for use in the browser.
   */
  constructor(options) {
    var _a, _b;
    this.memoryStorage = null;
    this.stateChangeEmitters = /* @__PURE__ */ new Map();
    this.autoRefreshTicker = null;
    this.visibilityChangedCallback = null;
    this.refreshingDeferred = null;
    this.initializePromise = null;
    this.detectSessionInUrl = true;
    this.lockAcquired = false;
    this.pendingInLock = [];
    this.broadcastChannel = null;
    this.logger = console.log;
    this.instanceID = GoTrueClient.nextInstanceID;
    GoTrueClient.nextInstanceID += 1;
    if (this.instanceID > 0 && isBrowser$1()) {
      console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
    }
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.logDebugMessages = !!settings.debug;
    if (typeof settings.debug === "function") {
      this.logger = settings.debug;
    }
    this.persistSession = settings.persistSession;
    this.storageKey = settings.storageKey;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.admin = new GoTrueAdminApi({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch
    });
    this.url = settings.url;
    this.headers = settings.headers;
    this.fetch = resolveFetch(settings.fetch);
    this.lock = settings.lock || lockNoOp;
    this.detectSessionInUrl = settings.detectSessionInUrl;
    this.flowType = settings.flowType;
    if (settings.lock) {
      this.lock = settings.lock;
    } else if (isBrowser$1() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
      this.lock = navigatorLock;
    } else {
      this.lock = lockNoOp;
    }
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    };
    if (this.persistSession) {
      if (settings.storage) {
        this.storage = settings.storage;
      } else {
        if (supportsLocalStorage()) {
          this.storage = localStorageAdapter;
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
      }
    } else {
      this.memoryStorage = {};
      this.storage = memoryLocalStorageAdapter(this.memoryStorage);
    }
    if (isBrowser$1() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (e) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
      }
      (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener("message", async (event) => {
        this._debug("received broadcast notification from other tab or client", event);
        await this._notifyAllSubscribers(event.data.event, event.data.session, false);
      });
    }
    this.initialize();
  }
  _debug(...args) {
    if (this.logDebugMessages) {
      this.logger(`GoTrueClient@${this.instanceID} (${version}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...args);
    }
    return this;
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize() {
    if (this.initializePromise) {
      return await this.initializePromise;
    }
    this.initializePromise = (async () => {
      return await this._acquireLock(-1, async () => {
        return await this._initialize();
      });
    })();
    return await this.initializePromise;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    try {
      const isPKCEFlow = isBrowser$1() ? await this._isPKCEFlow() : false;
      this._debug("#_initialize()", "begin", "is PKCE flow", isPKCEFlow);
      if (isPKCEFlow || this.detectSessionInUrl && this._isImplicitGrantFlow()) {
        const { data, error } = await this._getSessionFromURL(isPKCEFlow);
        if (error) {
          this._debug("#_initialize()", "error detecting session from URL", error);
          if ((error === null || error === void 0 ? void 0 : error.message) === "Identity is already linked" || (error === null || error === void 0 ? void 0 : error.message) === "Identity is already linked to another user") {
            return { error };
          }
          await this._removeSession();
          return { error };
        }
        const { session, redirectType } = data;
        this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
        await this._saveSession(session);
        setTimeout(async () => {
          if (redirectType === "recovery") {
            await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
        }, 0);
        return { error: null };
      }
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { error };
      }
      return {
        error: new AuthUnknownError("Unexpected error during initialization", error)
      };
    } finally {
      await this._handleVisibilityChange();
      this._debug("#_initialize()", "end");
    }
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  async signUp(credentials) {
    var _a, _b, _c;
    try {
      await this._removeSession();
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          const codeVerifier = generatePKCEVerifier();
          await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
          codeChallenge = await generatePKCEChallenge(codeVerifier);
          codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
        }
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: {
            email,
            password,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          xform: _sessionResponse
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone,
            password,
            data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
            channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  async signInWithPassword(credentials) {
    try {
      await this._removeSession();
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return {
        data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
        error
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   */
  async signInWithOAuth(credentials) {
    var _a, _b, _c, _d;
    await this._removeSession();
    return await this._handleProviderSignIn(credentials.provider, {
      redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
      scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
      queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
      skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  async exchangeCodeForSession(authCode) {
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return this._exchangeCodeForSession(authCode);
    });
  }
  async _exchangeCodeForSession(authCode) {
    const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
    const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
      headers: this.headers,
      body: {
        auth_code: authCode,
        code_verifier: codeVerifier
      },
      xform: _sessionResponse
    });
    await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    if (error) {
      return { data: { user: null, session: null, redirectType: null }, error };
    } else if (!data || !data.session || !data.user) {
      return {
        data: { user: null, session: null, redirectType: null },
        error: new AuthInvalidTokenResponseError()
      };
    }
    if (data.session) {
      await this._saveSession(data.session);
      await this._notifyAllSubscribers("SIGNED_IN", data.session);
    }
    return { data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error };
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   */
  async signInWithIdToken(credentials) {
    await this._removeSession();
    try {
      const { options, provider, token, access_token, nonce } = credentials;
      const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider,
          id_token: token,
          access_token,
          nonce,
          gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   * This method supports PKCE when an email is passed.
   */
  async signInWithOtp(credentials) {
    var _a, _b, _c, _d, _e;
    try {
      await this._removeSession();
      if ("email" in credentials) {
        const { email, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          const codeVerifier = generatePKCEVerifier();
          await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
          codeChallenge = await generatePKCEChallenge(codeVerifier);
          codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
        }
        const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      }
      if ("phone" in credentials) {
        const { phone, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone,
            data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
            create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   */
  async verifyOtp(params) {
    var _a, _b;
    try {
      if (params.type !== "email_change" && params.type !== "phone_change") {
        await this._removeSession();
      }
      let redirectTo = void 0;
      let captchaToken = void 0;
      if ("options" in params) {
        redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
        captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
      }
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
        redirectTo,
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("An error occurred on token verification.");
      }
      const session = data.session;
      const user = data.user;
      if (session === null || session === void 0 ? void 0 : session.access_token) {
        await this._saveSession(session);
        await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   */
  async signInWithSSO(params) {
    var _a, _b, _c;
    try {
      await this._removeSession();
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        const codeVerifier = generatePKCEVerifier();
        await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
        codeChallenge = await generatePKCEChallenge(codeVerifier);
        codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
      }
      return await _request(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
        headers: this.headers,
        xform: _ssoResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends a reauthentication OTP to the user's email or phone number.
   * Requires the user to be signed-in.
   */
  async reauthenticate() {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._reauthenticate();
    });
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError)
          throw sessionError;
        if (!session)
          throw new AuthSessionMissingError();
        const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: session.access_token
        });
        return { data: { user: null, session: null }, error };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  async resend(credentials) {
    try {
      if (credentials.type != "email_change" && credentials.type != "phone_change") {
        await this._removeSession();
      }
      const endpoint = `${this.url}/resend`;
      if ("email" in credentials) {
        const { email, type, options } = credentials;
        const { error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            email,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      } else if ("phone" in credentials) {
        const { phone, type, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            phone,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   */
  async getSession() {
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return this._useSession(async (result) => {
        return result;
      });
    });
  }
  /**
   * Acquires a global lock based on the storage key.
   */
  async _acquireLock(acquireTimeout, fn) {
    this._debug("#_acquireLock", "begin", acquireTimeout);
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
        const result = (async () => {
          await last;
          return await fn();
        })();
        this.pendingInLock.push((async () => {
          try {
            await result;
          } catch (e) {
          }
        })());
        return result;
      }
      return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
        try {
          this.lockAcquired = true;
          const result = fn();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e) {
            }
          })());
          await result;
          while (this.pendingInLock.length) {
            const waitOn = [...this.pendingInLock];
            await Promise.all(waitOn);
            this.pendingInLock.splice(0, waitOn.length);
          }
          return await result;
        } finally {
          this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
          this.lockAcquired = false;
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  /**
   * Use instead of {@link #getSession} inside the library. It is
   * semantically usually what you want, as getting a session involves some
   * processing afterwards that requires only one client operating on the
   * session at once across multiple tabs or processes.
   */
  async _useSession(fn) {
    this._debug("#_useSession", "begin");
    try {
      const result = await this.__loadSession();
      return await fn(result);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  /**
   * NEVER USE DIRECTLY!
   *
   * Always use {@link #_useSession}.
   */
  async __loadSession() {
    this._debug("#__loadSession()", "begin");
    if (!this.lockAcquired) {
      this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
    }
    try {
      let currentSession = null;
      const maybeSession = await getItemAsync(this.storage, this.storageKey);
      this._debug("#getSession()", "session from storage", maybeSession);
      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          this._debug("#getSession()", "session from storage is not valid");
          await this._removeSession();
        }
      }
      if (!currentSession) {
        return { data: { session: null }, error: null };
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at <= Date.now() / 1e3 : false;
      this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
      if (!hasExpired) {
        return { data: { session: currentSession }, error: null };
      }
      const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
      if (error) {
        return { data: { session: null }, error };
      }
      return { data: { session }, error: null };
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  /**
   * Gets the current user details if there is an existing session.
   * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
   */
  async getUser(jwt) {
    if (jwt) {
      return await this._getUser(jwt);
    }
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return await this._getUser();
    });
  }
  async _getUser(jwt) {
    try {
      if (jwt) {
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt,
          xform: _userResponse
        });
      }
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0,
          xform: _userResponse
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates user data for a logged in user.
   */
  async updateUser(attributes, options = {}) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._updateUser(attributes, options);
    });
  }
  async _updateUser(attributes, options = {}) {
    try {
      return await this._useSession(async (result) => {
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          throw new AuthSessionMissingError();
        }
        const session = sessionData.session;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce" && attributes.email != null) {
          const codeVerifier = generatePKCEVerifier();
          await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
          codeChallenge = await generatePKCEChallenge(codeVerifier);
          codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
        }
        const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          jwt: session.access_token,
          xform: _userResponse
        });
        if (userError)
          throw userError;
        session.user = data.user;
        await this._saveSession(session);
        await this._notifyAllSubscribers("USER_UPDATED", session);
        return { data: { user: session.user }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Decodes a JWT (without performing any validation).
   */
  _decodeJWT(jwt) {
    return decodeJWTPayload(jwt);
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  async setSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._setSession(currentSession);
    });
  }
  async _setSession(currentSession) {
    try {
      if (!currentSession.access_token || !currentSession.refresh_token) {
        throw new AuthSessionMissingError();
      }
      const timeNow = Date.now() / 1e3;
      let expiresAt2 = timeNow;
      let hasExpired = true;
      let session = null;
      const payload = decodeJWTPayload(currentSession.access_token);
      if (payload.exp) {
        expiresAt2 = payload.exp;
        hasExpired = expiresAt2 <= timeNow;
      }
      if (hasExpired) {
        const { session: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!refreshedSession) {
          return { data: { user: null, session: null }, error: null };
        }
        session = refreshedSession;
      } else {
        const { data, error } = await this._getUser(currentSession.access_token);
        if (error) {
          throw error;
        }
        session = {
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
          user: data.user,
          token_type: "bearer",
          expires_in: expiresAt2 - timeNow,
          expires_at: expiresAt2
        };
        await this._saveSession(session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user: session.user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  async refreshSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._refreshSession(currentSession);
    });
  }
  async _refreshSession(currentSession) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        if (!currentSession) {
          const { data, error: error2 } = result;
          if (error2) {
            throw error2;
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new AuthSessionMissingError();
        }
        const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!session) {
          return { data: { user: null, session: null }, error: null };
        }
        return { data: { user: session.user, session }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(isPKCEFlow) {
    try {
      if (!isBrowser$1())
        throw new AuthImplicitGrantRedirectError("No browser detected.");
      if (this.flowType === "implicit" && !this._isImplicitGrantFlow()) {
        throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
      } else if (this.flowType == "pkce" && !isPKCEFlow) {
        throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
      }
      const params = parseParametersFromURL(window.location.href);
      if (isPKCEFlow) {
        if (!params.code)
          throw new AuthPKCEGrantCodeExchangeError("No code detected.");
        const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
        if (error2)
          throw error2;
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState(window.history.state, "", url.toString());
        return { data: { session: data2.session, redirectType: null }, error: null };
      }
      if (params.error || params.error_description || params.error_code) {
        throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
          error: params.error || "unspecified_error",
          code: params.error_code || "unspecified_code"
        });
      }
      const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
      if (!access_token || !expires_in || !refresh_token || !token_type) {
        throw new AuthImplicitGrantRedirectError("No session defined in URL");
      }
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresIn = parseInt(expires_in);
      let expiresAt2 = timeNow + expiresIn;
      if (expires_at) {
        expiresAt2 = parseInt(expires_at);
      }
      const actuallyExpiresIn = expiresAt2 - timeNow;
      if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION) {
        console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
      }
      const issuedAt = expiresAt2 - expiresIn;
      if (timeNow - issuedAt >= 120) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
      } else if (timeNow - issuedAt < 0) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clok for skew", issuedAt, expiresAt2, timeNow);
      }
      const { data, error } = await this._getUser(access_token);
      if (error)
        throw error;
      const session = {
        provider_token,
        provider_refresh_token,
        access_token,
        expires_in: expiresIn,
        expires_at: expiresAt2,
        refresh_token,
        token_type,
        user: data.user
      };
      window.location.hash = "";
      this._debug("#_getSessionFromURL()", "clearing window.location.hash");
      return { data: { session, redirectType: params.type }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantFlow() {
    const params = parseParametersFromURL(window.location.href);
    return !!(isBrowser$1() && (params.access_token || params.error_description));
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCEFlow() {
    const params = parseParametersFromURL(window.location.href);
    const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    return !!(params.code && currentStorageContent);
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   */
  async signOut(options = { scope: "global" }) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._signOut(options);
    });
  }
  async _signOut({ scope } = { scope: "global" }) {
    return await this._useSession(async (result) => {
      var _a;
      const { data, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
      if (accessToken) {
        const { error } = await this.admin.signOut(accessToken, scope);
        if (error) {
          if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401))) {
            return { error };
          }
        }
      }
      if (scope !== "others") {
        await this._removeSession();
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        await this._notifyAllSubscribers("SIGNED_OUT", null);
      }
      return { error: null };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(callback) {
    const id = uuid();
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this._debug("#unsubscribe()", "state change callback with id removed", id);
        this.stateChangeEmitters.delete(id);
      }
    };
    this._debug("#onAuthStateChange()", "registered callback with id", id);
    this.stateChangeEmitters.set(id, subscription);
    (async () => {
      await this.initializePromise;
      await this._acquireLock(-1, async () => {
        this._emitInitialSession(id);
      });
    })();
    return { data: { subscription } };
  }
  async _emitInitialSession(id) {
    return await this._useSession(async (result) => {
      var _a, _b;
      try {
        const { data: { session }, error } = result;
        if (error)
          throw error;
        await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
        this._debug("INITIAL_SESSION", "callback id", id, "session", session);
      } catch (err) {
        await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
        this._debug("INITIAL_SESSION", "callback id", id, "error", err);
        console.error(err);
      }
    });
  }
  /**
   * Sends a password reset request to an email address. This method supports the PKCE flow.
   *
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  async resetPasswordForEmail(email, options = {}) {
    let codeChallenge = null;
    let codeChallengeMethod = null;
    if (this.flowType === "pkce") {
      const codeVerifier = generatePKCEVerifier();
      await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, `${codeVerifier}/PASSWORD_RECOVERY`);
      codeChallenge = await generatePKCEChallenge(codeVerifier);
      codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
    }
    try {
      return await _request(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          gotrue_meta_security: { captcha_token: options.captchaToken }
        },
        headers: this.headers,
        redirectTo: options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Gets all the identities linked to a user.
   */
  async getUserIdentities() {
    var _a;
    try {
      const { data, error } = await this.getUser();
      if (error)
        throw error;
      return { data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Links an oauth identity to an existing user.
   * This method supports the PKCE flow.
   */
  async linkIdentity(credentials) {
    var _a;
    try {
      const { data, error } = await this._useSession(async (result) => {
        var _a2, _b, _c, _d, _e;
        const { data: data2, error: error2 } = result;
        if (error2)
          throw error2;
        const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
          redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: true
        });
        return await _request(this.fetch, "GET", url, {
          headers: this.headers,
          jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
        });
      });
      if (error)
        throw error;
      if (isBrowser$1() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
        window.location.assign(data === null || data === void 0 ? void 0 : data.url);
      }
      return { data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { provider: credentials.provider, url: null }, error };
      }
      throw error;
    }
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   */
  async unlinkIdentity(identity) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(refreshToken) {
    const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      const startedAt = Date.now();
      return await retryable(async (attempt) => {
        await sleep(attempt * 200);
        this._debug(debugName, "refreshing attempt", attempt);
        return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
          body: { refresh_token: refreshToken },
          headers: this.headers,
          xform: _sessionResponse
        });
      }, (attempt, _, result) => result && result.error && isAuthRetryableFetchError(result.error) && // retryable only if the request can be sent before the backoff overflows the tick duration
      Date.now() + (attempt + 1) * 200 - startedAt < AUTO_REFRESH_TICK_DURATION);
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    } finally {
      this._debug(debugName, "end");
    }
  }
  _isValidSession(maybeSession) {
    const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
    return isValidSession;
  }
  async _handleProviderSignIn(provider, options) {
    const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });
    this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
    if (isBrowser$1() && !options.skipBrowserRedirect) {
      window.location.assign(url);
    }
    return { data: { provider, url }, error: null };
  }
  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var _a;
    const debugName = "#_recoverAndRefresh()";
    this._debug(debugName, "begin");
    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      this._debug(debugName, "session from storage", currentSession);
      if (!this._isValidSession(currentSession)) {
        this._debug(debugName, "session is not valid");
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresWithMargin = ((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) < timeNow + EXPIRY_MARGIN;
      this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN}s`);
      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            console.error(error);
            if (!isAuthRetryableFetchError(error)) {
              this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
              await this._removeSession();
            }
          }
        }
      } else {
        await this._notifyAllSubscribers("SIGNED_IN", currentSession);
      }
    } catch (err) {
      this._debug(debugName, "error", err);
      console.error(err);
      return;
    } finally {
      this._debug(debugName, "end");
    }
  }
  async _callRefreshToken(refreshToken) {
    var _a, _b;
    if (!refreshToken) {
      throw new AuthSessionMissingError();
    }
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }
    const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      this.refreshingDeferred = new Deferred();
      const { data, error } = await this._refreshAccessToken(refreshToken);
      if (error)
        throw error;
      if (!data.session)
        throw new AuthSessionMissingError();
      await this._saveSession(data.session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
      const result = { session: data.session, error: null };
      this.refreshingDeferred.resolve(result);
      return result;
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        const result = { session: null, error };
        if (!isAuthRetryableFetchError(error)) {
          await this._removeSession();
          await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
        return result;
      }
      (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this._debug(debugName, "end");
    }
  }
  async _notifyAllSubscribers(event, session, broadcast = true) {
    const debugName = `#_notifyAllSubscribers(${event})`;
    this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }
      const errors = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(async (x2) => {
        try {
          await x2.callback(event, session);
        } catch (e) {
          errors.push(e);
        }
      });
      await Promise.all(promises);
      if (errors.length > 0) {
        for (let i2 = 0; i2 < errors.length; i2 += 1) {
          console.error(errors[i2]);
        }
        throw errors[0];
      }
    } finally {
      this._debug(debugName, "end");
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(session) {
    this._debug("#_saveSession()", session);
    await setItemAsync(this.storage, this.storageKey, session);
  }
  async _removeSession() {
    this._debug("#_removeSession()");
    await removeItemAsync(this.storage, this.storageKey);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      if (callback && isBrowser$1() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      console.error("removing visibilitychange callback failed", e);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh();
    this._debug("#_startAutoRefresh()");
    const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION);
    this.autoRefreshTicker = ticker;
    if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
      ticker.unref();
    } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
      Deno.unrefTimer(ticker);
    }
    setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;
    if (ticker) {
      clearInterval(ticker);
    }
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desirable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }
  /**
   * Runs the auto refresh token tick.
   */
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    try {
      await this._acquireLock(0, async () => {
        try {
          const now = Date.now();
          try {
            return await this._useSession(async (result) => {
              const { data: { session } } = result;
              if (!session || !session.refresh_token || !session.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION);
              this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
              if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                await this._callRefreshToken(session.refresh_token);
              }
            });
          } catch (e) {
            console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (e) {
      if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
        this._debug("auto refresh token tick lock not available");
      } else {
        throw e;
      }
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    this._debug("#_handleVisibilityChange()");
    if (!isBrowser$1() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      if (this.autoRefreshToken) {
        this.startAutoRefresh();
      }
      return false;
    }
    try {
      this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
      window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
      await this._onVisibilityChanged(true);
    } catch (error) {
      console.error("_handleVisibilityChange", error);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(calledFromInitialize) {
    const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
    this._debug(methodName, "visibilityState", document.visibilityState);
    if (document.visibilityState === "visible") {
      if (this.autoRefreshToken) {
        this._startAutoRefresh();
      }
      if (!calledFromInitialize) {
        await this.initializePromise;
        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== "visible") {
            this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
            return;
          }
          await this._recoverAndRefresh();
        });
      }
    } else if (document.visibilityState === "hidden") {
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(url, provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`];
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }
    if (this.flowType === "pkce") {
      const codeVerifier = generatePKCEVerifier();
      await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
      const codeChallenge = await generatePKCEChallenge(codeVerifier);
      const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
      this._debug("PKCE", "code verifier", `${codeVerifier.substring(0, 5)}...`, "code challenge", codeChallenge, "method", codeChallengeMethod);
      const flowParams = new URLSearchParams({
        code_challenge: `${encodeURIComponent(codeChallenge)}`,
        code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
      });
      urlParams.push(flowParams.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams);
      urlParams.push(query.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
      urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
    }
    return `${url}?${urlParams.join("&")}`;
  }
  async _unenroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#enroll}
   */
  async _enroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
          body: {
            friendly_name: params.friendlyName,
            factor_type: params.factorType,
            issuer: params.issuer
          },
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return { data: null, error };
        }
        if ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
        }
        return { data, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  async _verify(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
            body: { code: params.code, challenge_id: params.challengeId },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return { data: null, error };
          }
          await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
          await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
          return { data, error };
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  async _challenge(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          return await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(params) {
    const { data: challengeData, error: challengeError } = await this._challenge({
      factorId: params.factorId
    });
    if (challengeError) {
      return { data: null, error: challengeError };
    }
    return await this._verify({
      factorId: params.factorId,
      challengeId: challengeData.id,
      code: params.code
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    const { data: { user }, error: userError } = await this.getUser();
    if (userError) {
      return { data: null, error: userError };
    }
    const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
    const totp = factors.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
    return {
      data: {
        all: factors,
        totp
      },
      error: null
    };
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(-1, async () => {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        if (!session) {
          return {
            data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
            error: null
          };
        }
        const payload = this._decodeJWT(session.access_token);
        let currentLevel = null;
        if (payload.aal) {
          currentLevel = payload.aal;
        }
        let nextLevel = currentLevel;
        const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors.length > 0) {
          nextLevel = "aal2";
        }
        const currentAuthenticationMethods = payload.amr || [];
        return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
      });
    });
  }
}
GoTrueClient.nextInstanceID = 0;
class SupabaseAuthClient extends GoTrueClient {
  constructor(options) {
    super(options);
  }
}
var __awaiter = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS$1
};
const DEFAULT_DB_OPTIONS = {
  schema: "public"
};
const DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
const DEFAULT_REALTIME_OPTIONS = {};
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl2, supabaseKey2, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this.supabaseUrl = supabaseUrl2;
    this.supabaseKey = supabaseKey2;
    this.from = (relation) => {
      return this.rest.from(relation);
    };
    this.schema = (schema) => {
      return this.rest.schema(schema);
    };
    this.rpc = (fn, args = {}, options2) => {
      return this.rest.rpc(fn, args, options2);
    };
    if (!supabaseUrl2)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey2)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = stripTrailingSlash(supabaseUrl2);
    this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace(/^http/i, "ws");
    this.authUrl = `${_supabaseUrl}/auth/v1`;
    this.storageUrl = `${_supabaseUrl}/storage/v1`;
    this.functionsUrl = `${_supabaseUrl}/functions/v1`;
    const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_b = (_a = settings.auth) === null || _a === void 0 ? void 0 : _a.storageKey) !== null && _b !== void 0 ? _b : "";
    this.headers = (_d = (_c = settings.global) === null || _c === void 0 ? void 0 : _c.headers) !== null && _d !== void 0 ? _d : {};
    this.auth = this._initSupabaseAuthClient((_e = settings.auth) !== null && _e !== void 0 ? _e : {}, this.headers, (_f = settings.global) === null || _f === void 0 ? void 0 : _f.fetch);
    this.fetch = fetchWithAuth(supabaseKey2, this._getAccessToken.bind(this), (_g = settings.global) === null || _g === void 0 ? void 0 : _g.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, settings.realtime));
    this.rest = new PostgrestClient(`${_supabaseUrl}/rest/v1`, {
      headers: this.headers,
      schema: (_h = settings.db) === null || _h === void 0 ? void 0 : _h.schema,
      fetch: this.fetch
    });
    this._listenForAuthEvents();
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new StorageClient(this.storageUrl, this.headers, this.fetch);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, debug }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      debug,
      fetch: fetch2
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.realtime.setAuth(token !== null && token !== void 0 ? token : null);
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth(this.supabaseKey);
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
}
const createClient = (supabaseUrl2, supabaseKey2, options) => {
  return new SupabaseClient(supabaseUrl2, supabaseKey2, options);
};
const supabaseUrl = "https://asnfdrmtqnjwbwwuhvdw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbmZkcm10cW5qd2J3d3VodmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3MDY1NDgsImV4cCI6MjAyMzI4MjU0OH0.szzdtS_MpB3dcvMZ9B2mApmZtJoeT_ZSmklV5wQHI4c";
const supabase = createClient(supabaseUrl, supabaseKey);
let gameID = void 0;
async function createGame(gameData) {
  const session = await supabase.auth.getSession();
  if (session.data.session === null) {
    console.error("No session found");
    return {};
  }
  let gid = crypto.randomUUID();
  let { error } = await supabase.from("games").insert({
    host_id: session.data.session.user.id,
    game_state: serializeGame(gameData),
    other_id: null,
    id: gid
  });
  if (error) {
    console.error(error);
    gameID = void 0;
  }
  isHost.set(true);
  myColor.set(gameData.hostColor);
  supabase.channel("games").on("postgres_changes", { event: "INSERT", schema: "public", table: "games" }, handlePayload).subscribe();
  supabase.channel("games").on("postgres_changes", { event: "UPDATE", schema: "public", table: "games" }, handlePayload).subscribe();
  gameID = gid;
}
function copyGameIDUrl() {
  navigator.clipboard.writeText(`${window.location}?id=${gameID}`);
}
async function joinGame(id) {
  const session = await supabase.auth.getSession();
  if (session.data.session === null) {
    console.error("No session found");
    return {};
  }
  let { data, error } = await supabase.from("games").select("*").eq("id", id);
  if (error) {
    console.error(error);
    return;
  }
  if (data === null) {
    console.error("No game found with that id");
    return;
  }
  let game = data[0];
  let gameState = game.game_state;
  let newGame = handleGameState(gameState);
  isHost.set(false);
  myColor.set(getOppositeColor(newGame.hostColor));
  gameID = id;
  let { error: updateError } = await supabase.from("games").update({ other_id: session.data.session.user.id }).eq("id", id);
  if (updateError) {
    console.error(updateError);
    return;
  }
  supabase.channel("games").on("postgres_changes", { event: "INSERT", schema: "public", table: "games" }, handlePayload).subscribe();
  supabase.channel("games").on("postgres_changes", { event: "UPDATE", schema: "public", table: "games" }, handlePayload).subscribe();
}
function serializeGame(gameInstance) {
  return JSON.stringify(gameInstance, (key2, value) => {
    if (value && typeof value === "object") {
      value.__type = value.constructor.name;
    }
    return value;
  });
}
function deserializeGame(jsonString) {
  const classes = {
    BaseGame,
    Rook,
    Queen,
    King,
    Pawn,
    Bishop,
    Knight,
    Board: Board$1
  };
  return JSON.parse(jsonString, (key2, value) => {
    if (value && typeof value === "object" && value.__type) {
      const DynamicClass = classes[value.__type];
      if (!DynamicClass) {
        throw new Error(`Unknown class: ${value.__type}`);
      }
      value = Object.assign(new DynamicClass(), value);
    }
    return value;
  });
}
async function updateGame(game) {
  console.log("updating game", game);
  let { error } = await supabase.from("games").update({ game_state: game }).eq("id", gameID);
  if (error) {
    console.error(error);
  }
}
function handlePayload(payload) {
  console.log("payload with id found", payload.new.id);
  if (payload.new.id === gameID) {
    let gameState = payload.new.game_state;
    handleGameState(gameState);
  }
}
function handleGameState(gameState) {
  let newGame = deserializeGame(gameState);
  console.log("gameStateString", gameState);
  if (!newGame.onLoad) {
    console.error("Game does not have onLoad method has:" + newGame.onLoad);
    console.error(newGame);
    return newGame;
  }
  newGame.onLoad();
  newGame.board.printBoard();
  currentGame.set(newGame);
  gameBoard.set(newGame.board);
  possibleMoves.set([]);
  ghostMoves.set([]);
  selectedPiece.set(void 0);
  return newGame;
}
async function handleGoogleAuth() {
  const session = await supabase.auth.getSession();
  if (session.data.session === null) {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://umi-l.github.io/quick-chess/"
      }
    });
  } else {
    console.log(session);
  }
}
class Game {
  constructor() {
    __publicField(this, "turn", Color.White);
    __publicField(this, "selected");
    __publicField(this, "hostColor", Color.White);
    __publicField(this, "removeOpponentMoves", (position, piece, moves, ignoreColor) => {
      if (ignoreColor) {
        return moves;
      }
      let color;
      myColor.update((value) => {
        color = value;
        return value;
      });
      moves = moves.filter((move) => move.piece.color === color);
      return moves;
    });
    __publicField(this, "cantPlayMoveIfNotTurn", (position, piece, moves, ignoreColor) => {
      if (!this.isMyTurn() && !ignoreColor) {
        return [];
      }
      return moves;
    });
    __publicField(this, "castle", (piecePosition, piece, moves, ignoreColor) => {
      if (!this.isMyTurn() && !ignoreColor)
        return moves;
      if (piece.type == PieceType.King && piece.hasMoved == false) {
        for (let i2 = piecePosition.x - 1; i2 >= 0; i2--) {
          const toCheckPiece = this.board.board[i2][piecePosition.y];
          if (toCheckPiece !== null) {
            if (toCheckPiece.type == PieceType.Rook && toCheckPiece.hasMoved == false) {
              moves.push(new Move(new Point(piecePosition.x - 2, piecePosition.y), piece, () => {
                this.castleLogic(piecePosition, piece, toCheckPiece, i2);
              }, true));
            }
            break;
          }
        }
        for (let i2 = piecePosition.x + 1; i2 < this.board.width; i2++) {
          const toCheckPiece = this.board.board[i2][piecePosition.y];
          if (toCheckPiece !== null) {
            if (toCheckPiece.type == PieceType.Rook && toCheckPiece.hasMoved == false) {
              moves.push(new Move(new Point(piecePosition.x + 2, piecePosition.y), toCheckPiece, () => {
                this.castleLogic(piecePosition, piece, toCheckPiece, i2);
              }, true));
            }
            break;
          }
        }
      }
      return moves;
    });
    __publicField(this, "castleLogic", (piecePosition, piece, rook, rookXPos) => {
      console.log("castle move", rookXPos);
      let leftOrRight = rookXPos < piecePosition.x ? -1 : 1;
      piece.hasMoved = true;
      rook.hasMoved = true;
      this.updateTimeSinceMoved();
      piece.turnsSinceMoved = 0;
      rook.turnsSinceMoved = 0;
      this.board.board[piecePosition.x + 2 * leftOrRight][piecePosition.y] = this.board.board[piecePosition.x][piecePosition.y];
      this.board.board[piecePosition.x][piecePosition.y] = null;
      this.board.board[piecePosition.x + 1 * leftOrRight][piecePosition.y] = this.board.board[rookXPos][piecePosition.y];
      this.board.board[rookXPos][piecePosition.y] = null;
      this.updateValues();
    });
    turn.subscribe((value) => {
      this.turn = value;
    });
    gameBoard.subscribe((value) => {
      if (!value)
        return;
      this.board = value;
    });
    selectedPiece.subscribe((value) => {
      this.selected = value;
    });
  }
  flipTurn() {
    turn.set(this.turn = getOppositeColor(this.turn));
  }
  // check = (piecePosition: Point, piece: Piece, moves: Move[], ignoreColor: boolean): Move[] => {
  //     // simulate move and if its color is in check, remove the move
  //     let finalMoves: Move[] = [];
  //     for (const move of moves) {
  //         // create deep clone of the game
  //         let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as Game;
  //         clone.simulateMove(move, piecePosition);
  //         let nextMovePossibleMoves: Move[] = [];
  //         // foreach piece in the board
  //         for (let i = 0; i < clone.board.width; i++) {
  //             for (let j = 0; j < clone.board.height; j++) {
  //                 const piece = clone.board.board[i][j];
  //                 if (piece !== null) {
  //                     // add moves to the array 
  //                     let pieceMoves = piece.getMoves(clone, clone.board, piecePosition, false, true);
  //                     nextMovePossibleMoves = nextMovePossibleMoves.concat(pieceMoves);
  //                 }
  //             }
  //         }
  //         let isInCheck = false;
  //         // foreach move in the array
  //         for (let i = 0; i < nextMovePossibleMoves.length; i++) {
  //             const move = nextMovePossibleMoves[i];
  //             if (move.piece.type === PieceType.King) {
  //                 isInCheck = true;
  //                 break;
  //             }
  //         }
  //         if (!isInCheck) {
  //             finalMoves.push(move);
  //         }
  //     }
  //     return finalMoves;
  // }
  updateValues() {
    selectedPiece.set(void 0);
    possibleMoves.set([]);
    this.flipTurn();
    updateGame(this);
  }
  updateTimeSinceMoved() {
    for (let i2 = 0; i2 < this.board.width; i2++) {
      for (let j2 = 0; j2 < this.board.height; j2++) {
        const piece = this.board.board[i2][j2];
        if (piece !== null) {
          if (piece.turnsSinceMoved !== void 0) {
            piece.turnsSinceMoved++;
          }
        }
      }
    }
  }
  isMyTurn() {
    let color;
    myColor.update((value) => {
      color = value;
      return value;
    });
    return this.turn === color;
  }
}
class BaseGame extends Game {
  constructor() {
    super();
    __publicField(this, "specialRules", []);
    __publicField(this, "board");
    console.log("BaseGame constructor");
    this.specialRules = [
      this.cantPlayMoveIfNotTurn,
      this.removeOpponentMoves,
      this.castle
      // this.check,
    ];
  }
  init() {
    this.board = new Board$1(8, 8);
    this.board.board[0][0] = new Rook(Color.White);
    this.board.board[1][0] = new Knight(Color.White);
    this.board.board[2][0] = new Bishop(Color.White);
    this.board.board[4][0] = new Queen(Color.White);
    this.board.board[3][0] = new King(Color.White);
    this.board.board[5][0] = new Bishop(Color.White);
    this.board.board[6][0] = new Knight(Color.White);
    this.board.board[7][0] = new Rook(Color.White);
    for (let i2 = 0; i2 < 8; i2++) {
      this.board.board[i2][1] = new Pawn(Color.White);
    }
    this.board.board[0][7] = new Rook(Color.Black);
    this.board.board[1][7] = new Knight(Color.Black);
    this.board.board[2][7] = new Bishop(Color.Black);
    this.board.board[4][7] = new Queen(Color.Black);
    this.board.board[3][7] = new King(Color.Black);
    this.board.board[5][7] = new Bishop(Color.Black);
    this.board.board[6][7] = new Knight(Color.Black);
    this.board.board[7][7] = new Rook(Color.Black);
    for (let i2 = 0; i2 < 8; i2++) {
      this.board.board[i2][6] = new Pawn(Color.Black);
    }
    gameBoard.set(this.board);
    return this.board;
  }
  // function to be called when the game is loaded from the database re-initialize things that are lossy in json
  onLoad() {
    this.specialRules = [
      this.cantPlayMoveIfNotTurn,
      this.removeOpponentMoves,
      this.castle
      // this.check,
    ];
  }
  makeMove(move) {
    if (move.callback) {
      move.callback();
      if (move.overrideAllBehavior) {
        return this.board;
      }
    }
    if (this.selected === void 0) {
      if (this.board.board[move.position.x][move.position.y] !== null) {
        selectedPiece.set(move.position);
      }
    } else {
      const piece = this.board.board[this.selected.x][this.selected.y];
      if (piece !== null) {
        console.log(move);
        this.board.board[move.position.x][move.position.y] = piece;
        piece.hasMoved = true;
        this.updateTimeSinceMoved();
        piece.turnsSinceMoved = 0;
        this.board.board[this.selected.x][this.selected.y] = null;
        this.updateValues();
      }
    }
    gameBoard.set(this.board);
    return this.board;
  }
  simulateMove(move, piecePosition) {
    console.log("simulateMove");
    if (move.callback) {
      move.callback();
      if (move.overrideAllBehavior) {
        return this.board;
      }
    }
    if (move.piece !== null) {
      this.board.board[move.position.x][move.position.y] = move.piece;
      move.piece.hasMoved = true;
      this.updateTimeSinceMoved();
      move.piece.turnsSinceMoved = 0;
      this.board.board[piecePosition.x][piecePosition.y] = null;
    }
    return this.board;
  }
}
function create_if_block$8(ctx) {
  let html_tag;
  let raw_value = exception(
    /*component*/
    ctx[1],
    /*code*/
    ctx[2]
  ) + "";
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*component, code*/
      6 && raw_value !== (raw_value = exception(
        /*component*/
        ctx2[1],
        /*code*/
        ctx2[2]
      ) + ""))
        html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching) {
        detach(html_anchor);
        html_tag.d();
      }
    }
  };
}
function create_fragment$n(ctx) {
  let if_block_anchor;
  let if_block = (
    /*observable*/
    ctx[0] && create_if_block$8(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (
        /*observable*/
        ctx2[0]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$8(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$n($$self, $$props, $$invalidate) {
  let { observable = false } = $$props;
  let { component } = $$props;
  let { code } = $$props;
  $$self.$$set = ($$props2) => {
    if ("observable" in $$props2)
      $$invalidate(0, observable = $$props2.observable);
    if ("component" in $$props2)
      $$invalidate(1, component = $$props2.component);
    if ("code" in $$props2)
      $$invalidate(2, code = $$props2.code);
  };
  return [observable, component, code];
}
let Error$1 = class Error2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$n, create_fragment$n, safe_not_equal, { observable: 0, component: 1, code: 2 });
  }
};
const Error$2 = Error$1;
const isBrowser = () => typeof window !== "undefined";
const browser = isBrowser();
const minifiedCss = ".modal-header{padding: 2px 16px;background-color: #339af0;color: white;}.modal-body{padding: 2px 16px;}.modal-footer{padding: 2px 16px;background-color: #339af0;color: white;}.modal-content{position: relative;background-color: #fefefe;margin: auto;padding: 0;border: 1px solid #888;width: 80%;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);animation-name: animateTop;animation-duration: 0.4s;}@keyframes animateTop {from {top: -300px; opacity: 0}to {top: 0; opacity: 1}}";
const style = browser ? document.createElement("style") : void 0;
if (browser) {
  const s2 = style;
  s2.textContent = minifiedCss;
  s2.id = "svelteui-inject";
}
function UserException(component, message, solution) {
  if (browser)
    document.head.appendChild(style);
  const html = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>[${component} Component Error]:</h2>
            <h3>${message}</h3>
        </div>
        <div class="modal-body">
            <pre>
                ${solution ? solution : ""}
            </pre>
        </div>
        <div class="modal-footer">
            <h3>Fix the code to dismiss this error.</h3>
        </div>
    </div>        
    `;
  return html;
}
function exception(component, code) {
  const { message, solution } = code;
  if (solution) {
    return UserException(component, message, solution);
  }
  return UserException(component, message);
}
function useActions(node, actions) {
  const actionReturns = [];
  if (actions) {
    for (let i2 = 0; i2 < actions.length; i2++) {
      const actionEntry = actions[i2];
      const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
      if (Array.isArray(actionEntry) && actionEntry.length > 1) {
        actionReturns.push(action(node, actionEntry[1]));
      } else {
        actionReturns.push(action(node));
      }
    }
  }
  return {
    update(actions2) {
      if ((actions2 && actions2.length || 0) != actionReturns.length) {
        throw new Error("You must not change the length of an actions array.");
      }
      if (actions2) {
        for (let i2 = 0; i2 < actions2.length; i2++) {
          const returnEntry = actionReturns[i2];
          if (returnEntry && returnEntry.update) {
            const actionEntry = actions2[i2];
            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
              returnEntry.update(actionEntry[1]);
            } else {
              returnEntry.update();
            }
          }
        }
      }
    },
    destroy() {
      for (let i2 = 0; i2 < actionReturns.length; i2++) {
        const returnEntry = actionReturns[i2];
        if (returnEntry && returnEntry.destroy) {
          returnEntry.destroy();
        }
      }
    }
  };
}
const MODIFIER_DIVIDER = "!";
const modifierRegex = new RegExp(`^[^${MODIFIER_DIVIDER}]+(?:${MODIFIER_DIVIDER}(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$`);
function createEventForwarder(component, except = []) {
  let $on;
  const events = [];
  component.$on = (fullEventType, callback) => {
    const eventType = fullEventType;
    let destructor = () => {
    };
    for (const exception2 of except) {
      if (typeof exception2 === "string" && exception2 === eventType) {
        const callbacks = component.$$.callbacks[eventType] || (component.$$.callbacks[eventType] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      if (typeof exception2 === "object" && exception2["name"] === eventType) {
        const oldCallback = callback;
        callback = (...props) => {
          if (!(typeof exception2 === "object" && exception2["shouldExclude"]())) {
            oldCallback(...props);
          }
        };
      }
    }
    if ($on) {
      destructor = $on(eventType, callback);
    } else {
      events.push([eventType, callback]);
    }
    return () => {
      destructor();
    };
  };
  function forward(e) {
    bubble(component, e);
  }
  return (node) => {
    const destructors = [];
    const forwardDestructors = {};
    $on = (fullEventType, callback) => {
      let eventType = fullEventType;
      let handler = callback;
      let options = false;
      const modifierMatch = eventType.match(modifierRegex);
      if (modifierMatch) {
        const parts = eventType.split(MODIFIER_DIVIDER);
        eventType = parts[0];
        const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
        if (eventOptions.passive) {
          options = options || {};
          options.passive = true;
        }
        if (eventOptions.nonpassive) {
          options = options || {};
          options.passive = false;
        }
        if (eventOptions.capture) {
          options = options || {};
          options.capture = true;
        }
        if (eventOptions.once) {
          options = options || {};
          options.once = true;
        }
        if (eventOptions.preventDefault) {
          handler = prevent_default(handler);
        }
        if (eventOptions.stopPropagation) {
          handler = stop_propagation(handler);
        }
      }
      const off = listen(node, eventType, handler, options);
      const destructor = () => {
        off();
        const idx = destructors.indexOf(destructor);
        if (idx > -1) {
          destructors.splice(idx, 1);
        }
      };
      destructors.push(destructor);
      if (!(eventType in forwardDestructors)) {
        forwardDestructors[eventType] = listen(node, eventType, forward);
      }
      return destructor;
    };
    for (let i2 = 0; i2 < events.length; i2++) {
      $on(events[i2][0], events[i2][1]);
    }
    return {
      destroy: () => {
        for (let i2 = 0; i2 < destructors.length; i2++) {
          destructors[i2]();
        }
        for (const entry of Object.entries(forwardDestructors)) {
          entry[1]();
        }
      }
    };
  };
}
const key = {};
function useSvelteUIThemeContext() {
  return getContext(key);
}
const colorScheme = writable("light");
var t = "colors", n = "sizes", r = "space", i = { gap: r, gridGap: r, columnGap: r, gridColumnGap: r, rowGap: r, gridRowGap: r, inset: r, insetBlock: r, insetBlockEnd: r, insetBlockStart: r, insetInline: r, insetInlineEnd: r, insetInlineStart: r, margin: r, marginTop: r, marginRight: r, marginBottom: r, marginLeft: r, marginBlock: r, marginBlockEnd: r, marginBlockStart: r, marginInline: r, marginInlineEnd: r, marginInlineStart: r, padding: r, paddingTop: r, paddingRight: r, paddingBottom: r, paddingLeft: r, paddingBlock: r, paddingBlockEnd: r, paddingBlockStart: r, paddingInline: r, paddingInlineEnd: r, paddingInlineStart: r, top: r, right: r, bottom: r, left: r, scrollMargin: r, scrollMarginTop: r, scrollMarginRight: r, scrollMarginBottom: r, scrollMarginLeft: r, scrollMarginX: r, scrollMarginY: r, scrollMarginBlock: r, scrollMarginBlockEnd: r, scrollMarginBlockStart: r, scrollMarginInline: r, scrollMarginInlineEnd: r, scrollMarginInlineStart: r, scrollPadding: r, scrollPaddingTop: r, scrollPaddingRight: r, scrollPaddingBottom: r, scrollPaddingLeft: r, scrollPaddingX: r, scrollPaddingY: r, scrollPaddingBlock: r, scrollPaddingBlockEnd: r, scrollPaddingBlockStart: r, scrollPaddingInline: r, scrollPaddingInlineEnd: r, scrollPaddingInlineStart: r, fontSize: "fontSizes", background: t, backgroundColor: t, backgroundImage: t, borderImage: t, border: t, borderBlock: t, borderBlockEnd: t, borderBlockStart: t, borderBottom: t, borderBottomColor: t, borderColor: t, borderInline: t, borderInlineEnd: t, borderInlineStart: t, borderLeft: t, borderLeftColor: t, borderRight: t, borderRightColor: t, borderTop: t, borderTopColor: t, caretColor: t, color: t, columnRuleColor: t, fill: t, outline: t, outlineColor: t, stroke: t, textDecorationColor: t, fontFamily: "fonts", fontWeight: "fontWeights", lineHeight: "lineHeights", letterSpacing: "letterSpacings", blockSize: n, minBlockSize: n, maxBlockSize: n, inlineSize: n, minInlineSize: n, maxInlineSize: n, width: n, minWidth: n, maxWidth: n, height: n, minHeight: n, maxHeight: n, flexBasis: n, gridTemplateColumns: n, gridTemplateRows: n, borderWidth: "borderWidths", borderTopWidth: "borderWidths", borderRightWidth: "borderWidths", borderBottomWidth: "borderWidths", borderLeftWidth: "borderWidths", borderStyle: "borderStyles", borderTopStyle: "borderStyles", borderRightStyle: "borderStyles", borderBottomStyle: "borderStyles", borderLeftStyle: "borderStyles", borderRadius: "radii", borderTopLeftRadius: "radii", borderTopRightRadius: "radii", borderBottomRightRadius: "radii", borderBottomLeftRadius: "radii", boxShadow: "shadows", textShadow: "shadows", transition: "transitions", zIndex: "zIndices" }, o = (e, t2) => "function" == typeof t2 ? { "()": Function.prototype.toString.call(t2) } : t2, l = () => {
  const e = /* @__PURE__ */ Object.create(null);
  return (t2, n2, ...r2) => {
    const i2 = ((e2) => JSON.stringify(e2, o))(t2);
    return i2 in e ? e[i2] : e[i2] = n2(t2, ...r2);
  };
}, s = Symbol.for("sxs.internal"), a = (e, t2) => Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)), c = (e) => {
  for (const t2 in e)
    return true;
  return false;
}, { hasOwnProperty: d } = Object.prototype, g = (e) => e.includes("-") ? e : e.replace(/[A-Z]/g, (e2) => "-" + e2.toLowerCase()), p = /\s+(?![^()]*\))/, u = (e) => (t2) => e(..."string" == typeof t2 ? String(t2).split(p) : [t2]), h = { appearance: (e) => ({ WebkitAppearance: e, appearance: e }), backfaceVisibility: (e) => ({ WebkitBackfaceVisibility: e, backfaceVisibility: e }), backdropFilter: (e) => ({ WebkitBackdropFilter: e, backdropFilter: e }), backgroundClip: (e) => ({ WebkitBackgroundClip: e, backgroundClip: e }), boxDecorationBreak: (e) => ({ WebkitBoxDecorationBreak: e, boxDecorationBreak: e }), clipPath: (e) => ({ WebkitClipPath: e, clipPath: e }), content: (e) => ({ content: e.includes('"') || e.includes("'") || /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(e) ? e : `"${e}"` }), hyphens: (e) => ({ WebkitHyphens: e, hyphens: e }), maskImage: (e) => ({ WebkitMaskImage: e, maskImage: e }), maskSize: (e) => ({ WebkitMaskSize: e, maskSize: e }), tabSize: (e) => ({ MozTabSize: e, tabSize: e }), textSizeAdjust: (e) => ({ WebkitTextSizeAdjust: e, textSizeAdjust: e }), userSelect: (e) => ({ WebkitUserSelect: e, userSelect: e }), marginBlock: u((e, t2) => ({ marginBlockStart: e, marginBlockEnd: t2 || e })), marginInline: u((e, t2) => ({ marginInlineStart: e, marginInlineEnd: t2 || e })), maxSize: u((e, t2) => ({ maxBlockSize: e, maxInlineSize: t2 || e })), minSize: u((e, t2) => ({ minBlockSize: e, minInlineSize: t2 || e })), paddingBlock: u((e, t2) => ({ paddingBlockStart: e, paddingBlockEnd: t2 || e })), paddingInline: u((e, t2) => ({ paddingInlineStart: e, paddingInlineEnd: t2 || e })) }, f = /([\d.]+)([^]*)/, m = (e, t2) => e.length ? e.reduce((e2, n2) => (e2.push(...t2.map((e3) => e3.includes("&") ? e3.replace(/&/g, /[ +>|~]/.test(n2) && /&.*&/.test(e3) ? `:is(${n2})` : n2) : n2 + " " + e3)), e2), []) : t2, b = (e, t2) => e in S && "string" == typeof t2 ? t2.replace(/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/, (t3, n2, r2, i2) => n2 + ("stretch" === r2 ? `-moz-available${i2};${g(e)}:${n2}-webkit-fill-available` : `-moz-fit-content${i2};${g(e)}:${n2}fit-content`) + i2) : String(t2), S = { blockSize: 1, height: 1, inlineSize: 1, maxBlockSize: 1, maxHeight: 1, maxInlineSize: 1, maxWidth: 1, minBlockSize: 1, minHeight: 1, minInlineSize: 1, minWidth: 1, width: 1 }, k = (e) => e ? e + "-" : "", y = (e, t2, n2) => e.replace(/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g, (e2, r2, i2, o2, l2) => "$" == o2 == !!i2 ? e2 : (r2 || "--" == o2 ? "calc(" : "") + "var(--" + ("$" === o2 ? k(t2) + (l2.includes("$") ? "" : k(n2)) + l2.replace(/\$/g, "-") : l2) + ")" + (r2 || "--" == o2 ? "*" + (r2 || "") + (i2 || "1") + ")" : "")), B = /\s*,\s*(?![^()]*\))/, $ = Object.prototype.toString, x = (e, t2, n2, r2, i2) => {
  let o2, l2, s2;
  const a2 = (e2, t3, n3) => {
    let c2, d2;
    const p2 = (e3) => {
      for (c2 in e3) {
        const x2 = 64 === c2.charCodeAt(0), z2 = x2 && Array.isArray(e3[c2]) ? e3[c2] : [e3[c2]];
        for (d2 of z2) {
          const e4 = /[A-Z]/.test(S2 = c2) ? S2 : S2.replace(/-[^]/g, (e5) => e5[1].toUpperCase()), z3 = "object" == typeof d2 && d2 && d2.toString === $ && (!r2.utils[e4] || !t3.length);
          if (e4 in r2.utils && !z3) {
            const t4 = r2.utils[e4];
            if (t4 !== l2) {
              l2 = t4, p2(t4(d2)), l2 = null;
              continue;
            }
          } else if (e4 in h) {
            const t4 = h[e4];
            if (t4 !== s2) {
              s2 = t4, p2(t4(d2)), s2 = null;
              continue;
            }
          }
          if (x2 && (u2 = c2.slice(1) in r2.media ? "@media " + r2.media[c2.slice(1)] : c2, c2 = u2.replace(/\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g, (e5, t4, n4, r3, i3, o3) => {
            const l3 = f.test(t4), s3 = 0.0625 * (l3 ? -1 : 1), [a3, c3] = l3 ? [r3, t4] : [t4, r3];
            return "(" + ("=" === n4[0] ? "" : ">" === n4[0] === l3 ? "max-" : "min-") + a3 + ":" + ("=" !== n4[0] && 1 === n4.length ? c3.replace(f, (e6, t5, r4) => Number(t5) + s3 * (">" === n4 ? 1 : -1) + r4) : c3) + (i3 ? ") and (" + (">" === i3[0] ? "min-" : "max-") + a3 + ":" + (1 === i3.length ? o3.replace(f, (e6, t5, n5) => Number(t5) + s3 * (">" === i3 ? -1 : 1) + n5) : o3) : "") + ")";
          })), z3) {
            const e5 = x2 ? n3.concat(c2) : [...n3], r3 = x2 ? [...t3] : m(t3, c2.split(B));
            void 0 !== o2 && i2(I(...o2)), o2 = void 0, a2(d2, r3, e5);
          } else
            void 0 === o2 && (o2 = [[], t3, n3]), c2 = x2 || 36 !== c2.charCodeAt(0) ? c2 : `--${k(r2.prefix)}${c2.slice(1).replace(/\$/g, "-")}`, d2 = z3 ? d2 : "number" == typeof d2 ? d2 && e4 in R ? String(d2) + "px" : String(d2) : y(b(e4, null == d2 ? "" : d2), r2.prefix, r2.themeMap[e4]), o2[0].push(`${x2 ? `${c2} ` : `${g(c2)}:`}${d2}`);
        }
      }
      var u2, S2;
    };
    p2(e2), void 0 !== o2 && i2(I(...o2)), o2 = void 0;
  };
  a2(e, t2, n2);
}, I = (e, t2, n2) => `${n2.map((e2) => `${e2}{`).join("")}${t2.length ? `${t2.join(",")}{` : ""}${e.join(";")}${t2.length ? "}" : ""}${Array(n2.length ? n2.length + 1 : 0).join("}")}`, R = { animationDelay: 1, animationDuration: 1, backgroundSize: 1, blockSize: 1, border: 1, borderBlock: 1, borderBlockEnd: 1, borderBlockEndWidth: 1, borderBlockStart: 1, borderBlockStartWidth: 1, borderBlockWidth: 1, borderBottom: 1, borderBottomLeftRadius: 1, borderBottomRightRadius: 1, borderBottomWidth: 1, borderEndEndRadius: 1, borderEndStartRadius: 1, borderInlineEnd: 1, borderInlineEndWidth: 1, borderInlineStart: 1, borderInlineStartWidth: 1, borderInlineWidth: 1, borderLeft: 1, borderLeftWidth: 1, borderRadius: 1, borderRight: 1, borderRightWidth: 1, borderSpacing: 1, borderStartEndRadius: 1, borderStartStartRadius: 1, borderTop: 1, borderTopLeftRadius: 1, borderTopRightRadius: 1, borderTopWidth: 1, borderWidth: 1, bottom: 1, columnGap: 1, columnRule: 1, columnRuleWidth: 1, columnWidth: 1, containIntrinsicSize: 1, flexBasis: 1, fontSize: 1, gap: 1, gridAutoColumns: 1, gridAutoRows: 1, gridTemplateColumns: 1, gridTemplateRows: 1, height: 1, inlineSize: 1, inset: 1, insetBlock: 1, insetBlockEnd: 1, insetBlockStart: 1, insetInline: 1, insetInlineEnd: 1, insetInlineStart: 1, left: 1, letterSpacing: 1, margin: 1, marginBlock: 1, marginBlockEnd: 1, marginBlockStart: 1, marginBottom: 1, marginInline: 1, marginInlineEnd: 1, marginInlineStart: 1, marginLeft: 1, marginRight: 1, marginTop: 1, maxBlockSize: 1, maxHeight: 1, maxInlineSize: 1, maxWidth: 1, minBlockSize: 1, minHeight: 1, minInlineSize: 1, minWidth: 1, offsetDistance: 1, offsetRotate: 1, outline: 1, outlineOffset: 1, outlineWidth: 1, overflowClipMargin: 1, padding: 1, paddingBlock: 1, paddingBlockEnd: 1, paddingBlockStart: 1, paddingBottom: 1, paddingInline: 1, paddingInlineEnd: 1, paddingInlineStart: 1, paddingLeft: 1, paddingRight: 1, paddingTop: 1, perspective: 1, right: 1, rowGap: 1, scrollMargin: 1, scrollMarginBlock: 1, scrollMarginBlockEnd: 1, scrollMarginBlockStart: 1, scrollMarginBottom: 1, scrollMarginInline: 1, scrollMarginInlineEnd: 1, scrollMarginInlineStart: 1, scrollMarginLeft: 1, scrollMarginRight: 1, scrollMarginTop: 1, scrollPadding: 1, scrollPaddingBlock: 1, scrollPaddingBlockEnd: 1, scrollPaddingBlockStart: 1, scrollPaddingBottom: 1, scrollPaddingInline: 1, scrollPaddingInlineEnd: 1, scrollPaddingInlineStart: 1, scrollPaddingLeft: 1, scrollPaddingRight: 1, scrollPaddingTop: 1, shapeMargin: 1, textDecoration: 1, textDecorationThickness: 1, textIndent: 1, textUnderlineOffset: 1, top: 1, transitionDelay: 1, transitionDuration: 1, verticalAlign: 1, width: 1, wordSpacing: 1 }, z = (e) => String.fromCharCode(e + (e > 25 ? 39 : 97)), W = (e) => ((e2) => {
  let t2, n2 = "";
  for (t2 = Math.abs(e2); t2 > 52; t2 = t2 / 52 | 0)
    n2 = z(t2 % 52) + n2;
  return z(t2 % 52) + n2;
})(((e2, t2) => {
  let n2 = t2.length;
  for (; n2; )
    e2 = 33 * e2 ^ t2.charCodeAt(--n2);
  return e2;
})(5381, JSON.stringify(e)) >>> 0), j = ["themed", "global", "styled", "onevar", "resonevar", "allvar", "inline"], E = (e) => {
  if (e.href && !e.href.startsWith(location.origin))
    return false;
  try {
    return !!e.cssRules;
  } catch (e2) {
    return false;
  }
}, T = (e) => {
  let t2;
  const n2 = () => {
    const { cssRules: e2 } = t2.sheet;
    return [].map.call(e2, (n3, r3) => {
      const { cssText: i2 } = n3;
      let o2 = "";
      if (i2.startsWith("--sxs"))
        return "";
      if (e2[r3 - 1] && (o2 = e2[r3 - 1].cssText).startsWith("--sxs")) {
        if (!n3.cssRules.length)
          return "";
        for (const e3 in t2.rules)
          if (t2.rules[e3].group === n3)
            return `--sxs{--sxs:${[...t2.rules[e3].cache].join(" ")}}${i2}`;
        return n3.cssRules.length ? `${o2}${i2}` : "";
      }
      return i2;
    }).join("");
  }, r2 = () => {
    if (t2) {
      const { rules: e2, sheet: n3 } = t2;
      if (!n3.deleteRule) {
        for (; 3 === Object(Object(n3.cssRules)[0]).type; )
          n3.cssRules.splice(0, 1);
        n3.cssRules = [];
      }
      for (const t3 in e2)
        delete e2[t3];
    }
    const i2 = Object(e).styleSheets || [];
    for (const e2 of i2)
      if (E(e2)) {
        for (let i3 = 0, o3 = e2.cssRules; o3[i3]; ++i3) {
          const l3 = Object(o3[i3]);
          if (1 !== l3.type)
            continue;
          const s2 = Object(o3[i3 + 1]);
          if (4 !== s2.type)
            continue;
          ++i3;
          const { cssText: a2 } = l3;
          if (!a2.startsWith("--sxs"))
            continue;
          const c2 = a2.slice(14, -3).trim().split(/\s+/), d2 = j[c2[0]];
          d2 && (t2 || (t2 = { sheet: e2, reset: r2, rules: {}, toString: n2 }), t2.rules[d2] = { group: s2, index: i3, cache: new Set(c2) });
        }
        if (t2)
          break;
      }
    if (!t2) {
      const i3 = (e2, t3) => ({ type: t3, cssRules: [], insertRule(e3, t4) {
        this.cssRules.splice(t4, 0, i3(e3, { import: 3, undefined: 1 }[(e3.toLowerCase().match(/^@([a-z]+)/) || [])[1]] || 4));
      }, get cssText() {
        return "@media{}" === e2 ? `@media{${[].map.call(this.cssRules, (e3) => e3.cssText).join("")}}` : e2;
      } });
      t2 = { sheet: e ? (e.head || e).appendChild(document.createElement("style")).sheet : i3("", "text/css"), rules: {}, reset: r2, toString: n2 };
    }
    const { sheet: o2, rules: l2 } = t2;
    for (let e2 = j.length - 1; e2 >= 0; --e2) {
      const t3 = j[e2];
      if (!l2[t3]) {
        const n3 = j[e2 + 1], r3 = l2[n3] ? l2[n3].index : o2.cssRules.length;
        o2.insertRule("@media{}", r3), o2.insertRule(`--sxs{--sxs:${e2}}`, r3), l2[t3] = { group: o2.cssRules[r3 + 1], index: r3, cache: /* @__PURE__ */ new Set([e2]) };
      }
      v(l2[t3]);
    }
  };
  return r2(), t2;
}, v = (e) => {
  const t2 = e.group;
  let n2 = t2.cssRules.length;
  e.apply = (e2) => {
    try {
      t2.insertRule(e2, n2), ++n2;
    } catch (e3) {
    }
  };
}, M = Symbol(), w = l(), C = (e, t2) => w(e, () => (...n2) => {
  let r2 = { type: null, composers: /* @__PURE__ */ new Set() };
  for (const t3 of n2)
    if (null != t3)
      if (t3[s]) {
        null == r2.type && (r2.type = t3[s].type);
        for (const e2 of t3[s].composers)
          r2.composers.add(e2);
      } else
        t3.constructor !== Object || t3.$$typeof ? null == r2.type && (r2.type = t3) : r2.composers.add(P(t3, e));
  return null == r2.type && (r2.type = "span"), r2.composers.size || r2.composers.add(["PJLV", {}, [], [], {}, []]), L(e, r2, t2);
}), P = ({ variants: e, compoundVariants: t2, defaultVariants: n2, ...r2 }, i2) => {
  const o2 = `${k(i2.prefix)}c-${W(r2)}`, l2 = [], s2 = [], a2 = /* @__PURE__ */ Object.create(null), g2 = [];
  for (const e2 in n2)
    a2[e2] = String(n2[e2]);
  if ("object" == typeof e && e)
    for (const t3 in e) {
      p2 = a2, u2 = t3, d.call(p2, u2) || (a2[t3] = "undefined");
      const n3 = e[t3];
      for (const e2 in n3) {
        const r3 = { [t3]: String(e2) };
        "undefined" === String(e2) && g2.push(t3);
        const i3 = n3[e2], o3 = [r3, i3, !c(i3)];
        l2.push(o3);
      }
    }
  var p2, u2;
  if ("object" == typeof t2 && t2)
    for (const e2 of t2) {
      let { css: t3, ...n3 } = e2;
      t3 = "object" == typeof t3 && t3 || {};
      for (const e3 in n3)
        n3[e3] = String(n3[e3]);
      const r3 = [n3, t3, !c(t3)];
      s2.push(r3);
    }
  return [o2, r2, l2, s2, a2, g2];
}, L = (e, t2, n2) => {
  const [r2, i2, o2, l2] = O(t2.composers), c2 = "function" == typeof t2.type || t2.type.$$typeof ? ((e2) => {
    function t3() {
      for (let n3 = 0; n3 < t3[M].length; n3++) {
        const [r3, i3] = t3[M][n3];
        e2.rules[r3].apply(i3);
      }
      return t3[M] = [], null;
    }
    return t3[M] = [], t3.rules = {}, j.forEach((e3) => t3.rules[e3] = { apply: (n3) => t3[M].push([e3, n3]) }), t3;
  })(n2) : null, d2 = (c2 || n2).rules, g2 = `.${r2}${i2.length > 1 ? `:where(.${i2.slice(1).join(".")})` : ""}`, p2 = (s2) => {
    s2 = "object" == typeof s2 && s2 || D;
    const { css: a2, ...p3 } = s2, u2 = {};
    for (const e2 in o2)
      if (delete p3[e2], e2 in s2) {
        let t3 = s2[e2];
        "object" == typeof t3 && t3 ? u2[e2] = { "@initial": o2[e2], ...t3 } : (t3 = String(t3), u2[e2] = "undefined" !== t3 || l2.has(e2) ? t3 : o2[e2]);
      } else
        u2[e2] = o2[e2];
    const h2 = /* @__PURE__ */ new Set([...i2]);
    for (const [r3, i3, o3, l3] of t2.composers) {
      n2.rules.styled.cache.has(r3) || (n2.rules.styled.cache.add(r3), x(i3, [`.${r3}`], [], e, (e2) => {
        d2.styled.apply(e2);
      }));
      const t3 = A(o3, u2, e.media), s3 = A(l3, u2, e.media, true);
      for (const i4 of t3)
        if (void 0 !== i4)
          for (const [t4, o4, l4] of i4) {
            const i5 = `${r3}-${W(o4)}-${t4}`;
            h2.add(i5);
            const s4 = (l4 ? n2.rules.resonevar : n2.rules.onevar).cache, a3 = l4 ? d2.resonevar : d2.onevar;
            s4.has(i5) || (s4.add(i5), x(o4, [`.${i5}`], [], e, (e2) => {
              a3.apply(e2);
            }));
          }
      for (const t4 of s3)
        if (void 0 !== t4)
          for (const [i4, o4] of t4) {
            const t5 = `${r3}-${W(o4)}-${i4}`;
            h2.add(t5), n2.rules.allvar.cache.has(t5) || (n2.rules.allvar.cache.add(t5), x(o4, [`.${t5}`], [], e, (e2) => {
              d2.allvar.apply(e2);
            }));
          }
    }
    if ("object" == typeof a2 && a2) {
      const t3 = `${r2}-i${W(a2)}-css`;
      h2.add(t3), n2.rules.inline.cache.has(t3) || (n2.rules.inline.cache.add(t3), x(a2, [`.${t3}`], [], e, (e2) => {
        d2.inline.apply(e2);
      }));
    }
    for (const e2 of String(s2.className || "").trim().split(/\s+/))
      e2 && h2.add(e2);
    const f2 = p3.className = [...h2].join(" ");
    return { type: t2.type, className: f2, selector: g2, props: p3, toString: () => f2, deferredInjector: c2 };
  };
  return a(p2, { className: r2, selector: g2, [s]: t2, toString: () => (n2.rules.styled.cache.has(r2) || p2(), r2) });
}, O = (e) => {
  let t2 = "";
  const n2 = [], r2 = {}, i2 = [];
  for (const [o2, , , , l2, s2] of e) {
    "" === t2 && (t2 = o2), n2.push(o2), i2.push(...s2);
    for (const e2 in l2) {
      const t3 = l2[e2];
      (void 0 === r2[e2] || "undefined" !== t3 || s2.includes(t3)) && (r2[e2] = t3);
    }
  }
  return [t2, n2, r2, new Set(i2)];
}, A = (e, t2, n2, r2) => {
  const i2 = [];
  e:
    for (let [o2, l2, s2] of e) {
      if (s2)
        continue;
      let e2, a2 = 0, c2 = false;
      for (e2 in o2) {
        const r3 = o2[e2];
        let i3 = t2[e2];
        if (i3 !== r3) {
          if ("object" != typeof i3 || !i3)
            continue e;
          {
            let e3, t3, o3 = 0;
            for (const l3 in i3) {
              if (r3 === String(i3[l3])) {
                if ("@initial" !== l3) {
                  const e4 = l3.slice(1);
                  (t3 = t3 || []).push(e4 in n2 ? n2[e4] : l3.replace(/^@media ?/, "")), c2 = true;
                }
                a2 += o3, e3 = true;
              }
              ++o3;
            }
            if (t3 && t3.length && (l2 = { ["@media " + t3.join(", ")]: l2 }), !e3)
              continue e;
          }
        }
      }
      (i2[a2] = i2[a2] || []).push([r2 ? "cv" : `${e2}-${o2[e2]}`, l2, c2]);
    }
  return i2;
}, D = {}, H = l(), N = (e, t2) => H(e, () => (...n2) => {
  const r2 = () => {
    for (let r3 of n2) {
      r3 = "object" == typeof r3 && r3 || {};
      let n3 = W(r3);
      if (!t2.rules.global.cache.has(n3)) {
        if (t2.rules.global.cache.add(n3), "@import" in r3) {
          let e2 = [].indexOf.call(t2.sheet.cssRules, t2.rules.themed.group) - 1;
          for (let n4 of [].concat(r3["@import"]))
            n4 = n4.includes('"') || n4.includes("'") ? n4 : `"${n4}"`, t2.sheet.insertRule(`@import ${n4};`, e2++);
          delete r3["@import"];
        }
        x(r3, [], [], e, (e2) => {
          t2.rules.global.apply(e2);
        });
      }
    }
    return "";
  };
  return a(r2, { toString: r2 });
}), V = l(), G = (e, t2) => V(e, () => (n2) => {
  const r2 = `${k(e.prefix)}k-${W(n2)}`, i2 = () => {
    if (!t2.rules.global.cache.has(r2)) {
      t2.rules.global.cache.add(r2);
      const i3 = [];
      x(n2, [], [], e, (e2) => i3.push(e2));
      const o2 = `@keyframes ${r2}{${i3.join("")}}`;
      t2.rules.global.apply(o2);
    }
    return r2;
  };
  return a(i2, { get name() {
    return i2();
  }, toString: i2 });
}), F = class {
  constructor(e, t2, n2, r2) {
    this.token = null == e ? "" : String(e), this.value = null == t2 ? "" : String(t2), this.scale = null == n2 ? "" : String(n2), this.prefix = null == r2 ? "" : String(r2);
  }
  get computedValue() {
    return "var(" + this.variable + ")";
  }
  get variable() {
    return "--" + k(this.prefix) + k(this.scale) + this.token;
  }
  toString() {
    return this.computedValue;
  }
}, J = l(), U = (e, t2) => J(e, () => (n2, r2) => {
  r2 = "object" == typeof n2 && n2 || Object(r2);
  const i2 = `.${n2 = (n2 = "string" == typeof n2 ? n2 : "") || `${k(e.prefix)}t-${W(r2)}`}`, o2 = {}, l2 = [];
  for (const t3 in r2) {
    o2[t3] = {};
    for (const n3 in r2[t3]) {
      const i3 = `--${k(e.prefix)}${t3}-${n3}`, s3 = y(String(r2[t3][n3]), e.prefix, t3);
      o2[t3][n3] = new F(n3, s3, t3, e.prefix), l2.push(`${i3}:${s3}`);
    }
  }
  const s2 = () => {
    if (l2.length && !t2.rules.themed.cache.has(n2)) {
      t2.rules.themed.cache.add(n2);
      const i3 = `${r2 === e.theme ? ":root," : ""}.${n2}{${l2.join(";")}}`;
      t2.rules.themed.apply(i3);
    }
    return n2;
  };
  return { ...o2, get className() {
    return s2();
  }, selector: i2, toString: s2 };
}), Z = l(), X = (e) => {
  let t2 = false;
  const n2 = Z(e, (e2) => {
    t2 = true;
    const n3 = "prefix" in (e2 = "object" == typeof e2 && e2 || {}) ? String(e2.prefix) : "", r2 = "object" == typeof e2.media && e2.media || {}, o2 = "object" == typeof e2.root ? e2.root || null : globalThis.document || null, l2 = "object" == typeof e2.theme && e2.theme || {}, s2 = { prefix: n3, media: r2, theme: l2, themeMap: "object" == typeof e2.themeMap && e2.themeMap || { ...i }, utils: "object" == typeof e2.utils && e2.utils || {} }, a2 = T(o2), c2 = { css: C(s2, a2), globalCss: N(s2, a2), keyframes: G(s2, a2), createTheme: U(s2, a2), reset() {
      a2.reset(), c2.theme.toString();
    }, theme: {}, sheet: a2, config: s2, prefix: n3, getCssText: a2.toString, toString: a2.toString };
    return String(c2.theme = c2.createTheme(l2)), c2;
  });
  return t2 || n2.reset(), n2;
};
const colors = {
  primary: "#228be6",
  white: "#ffffff",
  black: "#000000",
  dark50: "#C1C2C5",
  dark100: "#A6A7AB",
  dark200: "#909296",
  dark300: "#5c5f66",
  dark400: "#373A40",
  dark500: "#2C2E33",
  dark600: "#25262b",
  dark700: "#1A1B1E",
  dark800: "#141517",
  dark900: "#101113",
  gray50: "#f8f9fa",
  gray100: "#f1f3f5",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#868e96",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
  red50: "#fff5f5",
  red100: "#ffe3e3",
  red200: "#ffc9c9",
  red300: "#ffa8a8",
  red400: "#ff8787",
  red500: "#ff6b6b",
  red600: "#fa5252",
  red700: "#f03e3e",
  red800: "#e03131",
  red900: "#c92a2a",
  pink50: "#fff0f6",
  pink100: "#ffdeeb",
  pink200: "#fcc2d7",
  pink300: "#faa2c1",
  pink400: "#f783ac",
  pink500: "#f06595",
  pink600: "#e64980",
  pink700: "#d6336c",
  pink800: "#c2255c",
  pink900: "#a61e4d",
  grape50: "#f8f0fc",
  grape100: "#f3d9fa",
  grape200: "#eebefa",
  grape300: "#e599f7",
  grape400: "#da77f2",
  grape500: "#cc5de8",
  grape600: "#be4bdb",
  grape700: "#ae3ec9",
  grape800: "#9c36b5",
  grape900: "#862e9c",
  violet50: "#f3f0ff",
  violet100: "#e5dbff",
  violet200: "#d0bfff",
  violet300: "#b197fc",
  violet400: "#9775fa",
  violet500: "#845ef7",
  violet600: "#7950f2",
  violet700: "#7048e8",
  violet800: "#6741d9",
  violet900: "#5f3dc4",
  indigo50: "#edf2ff",
  indigo100: "#dbe4ff",
  indigo200: "#bac8ff",
  indigo300: "#91a7ff",
  indigo400: "#748ffc",
  indigo500: "#5c7cfa",
  indigo600: "#4c6ef5",
  indigo700: "#4263eb",
  indigo800: "#3b5bdb",
  indigo900: "#364fc7",
  blue50: "#e7f5ff",
  blue100: "#d0ebff",
  blue200: "#a5d8ff",
  blue300: "#74c0fc",
  blue400: "#4dabf7",
  blue500: "#339af0",
  blue600: "#228be6",
  blue700: "#1c7ed6",
  blue800: "#1971c2",
  blue900: "#1864ab",
  cyan50: "#e3fafc",
  cyan100: "#c5f6fa",
  cyan200: "#99e9f2",
  cyan300: "#66d9e8",
  cyan400: "#3bc9db",
  cyan500: "#22b8cf",
  cyan600: "#15aabf",
  cyan700: "#1098ad",
  cyan800: "#0c8599",
  cyan900: "#0b7285",
  teal50: "#e6fcf5",
  teal100: "#c3fae8",
  teal200: "#96f2d7",
  teal300: "#63e6be",
  teal400: "#38d9a9",
  teal500: "#20c997",
  teal600: "#12b886",
  teal700: "#0ca678",
  teal800: "#099268",
  teal900: "#087f5b",
  green50: "#ebfbee",
  green100: "#d3f9d8",
  green200: "#b2f2bb",
  green300: "#8ce99a",
  green400: "#69db7c",
  green500: "#51cf66",
  green600: "#40c057",
  green700: "#37b24d",
  green800: "#2f9e44",
  green900: "#2b8a3e",
  lime50: "#f4fce3",
  lime100: "#e9fac8",
  lime200: "#d8f5a2",
  lime300: "#c0eb75",
  lime400: "#a9e34b",
  lime500: "#94d82d",
  lime600: "#82c91e",
  lime700: "#74b816",
  lime800: "#66a80f",
  lime900: "#5c940d",
  yellow50: "#fff9db",
  yellow100: "#fff3bf",
  yellow200: "#ffec99",
  yellow300: "#ffe066",
  yellow400: "#ffd43b",
  yellow500: "#fcc419",
  yellow600: "#fab005",
  yellow700: "#f59f00",
  yellow800: "#f08c00",
  yellow900: "#e67700",
  orange50: "#fff4e6",
  orange100: "#ffe8cc",
  orange200: "#ffd8a8",
  orange300: "#ffc078",
  orange400: "#ffa94d",
  orange500: "#ff922b",
  orange600: "#fd7e14",
  orange700: "#f76707",
  orange800: "#e8590c",
  orange900: "#d9480f"
};
const colorNameMap = {
  blue: "blue",
  cyan: "cyan",
  dark: "dark",
  grape: "grape",
  gray: "gray",
  green: "green",
  indigo: "indigo",
  lime: "lime",
  orange: "orange",
  pink: "pink",
  red: "red",
  teal: "teal",
  violet: "violet",
  yellow: "yellow"
};
const { css, globalCss, keyframes, getCssText, theme, createTheme, config, reset } = X({
  prefix: "svelteui",
  theme: {
    colors,
    space: {
      0: "0rem",
      xs: 10,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
      xsPX: "10px",
      smPX: "12px",
      mdPX: "16px",
      lgPX: "20px",
      xlPX: "24px",
      1: "0.125rem",
      2: "0.25rem",
      3: "0.375rem",
      4: "0.5rem",
      5: "0.625rem",
      6: "0.75rem",
      7: "0.875rem",
      8: "1rem",
      9: "1.25rem",
      10: "1.5rem",
      11: "1.75rem",
      12: "2rem",
      13: "2.25rem",
      14: "2.5rem",
      15: "2.75rem",
      16: "3rem",
      17: "3.5rem",
      18: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      52: "13rem",
      56: "14rem",
      60: "15rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem"
    },
    fontSizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px"
    },
    fonts: {
      standard: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
      fallback: "Segoe UI, system-ui, sans-serif"
    },
    fontWeights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeights: {
      xs: 1,
      sm: 1.25,
      md: 1.5,
      lg: 1.625,
      xl: 1.75
    },
    letterSpacings: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    },
    sizes: {},
    radii: {
      xs: "2px",
      sm: "4px",
      md: "8px",
      lg: "16px",
      xl: "32px",
      squared: "33%",
      rounded: "50%",
      pill: "9999px"
    },
    shadows: {
      xs: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
      sm: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px",
      md: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
      lg: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px",
      xl: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px"
    },
    zIndices: {
      1: "100",
      2: "200",
      3: "300",
      4: "400",
      5: "500",
      10: "1000",
      max: "9999"
    },
    borderWidths: {
      light: "1px",
      normal: "2px",
      bold: "3px",
      extrabold: "4px",
      black: "5px",
      xs: "1px",
      sm: "2px",
      md: "3px",
      lg: "4px",
      xl: "5px"
    },
    breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1400
    },
    borderStyles: {},
    transitions: {}
  },
  media: {
    xs: "(min-width: 576px)",
    sm: "(min-width: 768px)",
    md: "(min-width: 992px)",
    lg: "(min-width: 1200px)",
    xl: "(min-width: 1400px)"
  },
  utils: {
    focusRing: (value) => ({
      WebkitTapHighlightColor: "transparent",
      "&:focus": {
        outlineOffset: 2,
        outline: value === "always" || value === "auto" ? "2px solid $primary" : "none"
      },
      "&:focus:not(:focus-visible)": {
        outline: value === "auto" || value === "never" ? "none" : void 0
      }
    }),
    /** padding top */
    p: (value) => ({
      padding: value
    }),
    pt: (value) => ({
      paddingTop: value
    }),
    pr: (value) => ({
      paddingRight: value
    }),
    pb: (value) => ({
      paddingBottom: value
    }),
    pl: (value) => ({
      paddingLeft: value
    }),
    px: (value) => ({
      paddingLeft: value,
      paddingRight: value
    }),
    py: (value) => ({
      paddingTop: value,
      paddingBottom: value
    }),
    /** margin */
    m: (value) => ({
      margin: value
    }),
    /** margin-top */
    mt: (value) => ({
      marginTop: value
    }),
    mr: (value) => ({
      marginRight: value
    }),
    mb: (value) => ({
      marginBottom: value
    }),
    ml: (value) => ({
      marginLeft: value
    }),
    mx: (value) => ({
      marginLeft: value,
      marginRight: value
    }),
    my: (value) => ({
      marginTop: value,
      marginBottom: value
    }),
    ta: (value) => ({
      textAlign: value
    }),
    tt: (value) => ({
      textTransform: value
    }),
    to: (value) => ({
      textOverflow: value
    }),
    d: (value) => ({ display: value }),
    dflex: (value) => ({
      display: "flex",
      alignItems: value,
      justifyContent: value
    }),
    fd: (value) => ({
      flexDirection: value
    }),
    fw: (value) => ({ flexWrap: value }),
    ai: (value) => ({
      alignItems: value
    }),
    ac: (value) => ({
      alignContent: value
    }),
    jc: (value) => ({
      justifyContent: value
    }),
    as: (value) => ({
      alignSelf: value
    }),
    fg: (value) => ({ flexGrow: value }),
    fs: (value) => ({
      fontSize: value
    }),
    fb: (value) => ({
      flexBasis: value
    }),
    bc: (value) => ({
      backgroundColor: value
    }),
    bf: (value) => ({
      backdropFilter: value
    }),
    bg: (value) => ({
      background: value
    }),
    bgBlur: (value) => ({
      bf: "saturate(180%) blur(10px)",
      bg: value
    }),
    bgColor: (value) => ({
      backgroundColor: value
    }),
    backgroundClip: (value) => ({
      WebkitBackgroundClip: value,
      backgroundClip: value
    }),
    bgClip: (value) => ({
      WebkitBackgroundClip: value,
      backgroundClip: value
    }),
    br: (value) => ({
      borderRadius: value
    }),
    bw: (value) => ({
      borderWidth: value
    }),
    btrr: (value) => ({
      borderTopRightRadius: value
    }),
    bbrr: (value) => ({
      borderBottomRightRadius: value
    }),
    bblr: (value) => ({
      borderBottomLeftRadius: value
    }),
    btlr: (value) => ({
      borderTopLeftRadius: value
    }),
    bs: (value) => ({
      boxShadow: value
    }),
    normalShadow: (value) => ({
      boxShadow: `0 4px 14px 0 $${value}`
    }),
    lh: (value) => ({
      lineHeight: value
    }),
    ov: (value) => ({ overflow: value }),
    ox: (value) => ({
      overflowX: value
    }),
    oy: (value) => ({
      overflowY: value
    }),
    pe: (value) => ({
      pointerEvents: value
    }),
    events: (value) => ({
      pointerEvents: value
    }),
    us: (value) => ({
      WebkitUserSelect: value,
      userSelect: value
    }),
    userSelect: (value) => ({
      WebkitUserSelect: value,
      userSelect: value
    }),
    w: (value) => ({ width: value }),
    h: (value) => ({
      height: value
    }),
    minW: (value) => ({
      minWidth: value
    }),
    minH: (value) => ({
      minWidth: value
    }),
    mw: (value) => ({
      maxWidth: value
    }),
    maxW: (value) => ({
      maxWidth: value
    }),
    mh: (value) => ({
      maxHeight: value
    }),
    maxH: (value) => ({
      maxHeight: value
    }),
    size: (value) => ({
      width: value,
      height: value
    }),
    minSize: (value) => ({
      minWidth: value,
      minHeight: value,
      width: value,
      height: value
    }),
    sizeMin: (value) => ({
      minWidth: value,
      minHeight: value,
      width: value,
      height: value
    }),
    maxSize: (value) => ({
      maxWidth: value,
      maxHeight: value
    }),
    sizeMax: (value) => ({
      maxWidth: value,
      maxHeight: value
    }),
    appearance: (value) => ({
      WebkitAppearance: value,
      appearance: value
    }),
    scale: (value) => ({
      transform: `scale(${value})`
    }),
    linearGradient: (value) => ({
      backgroundImage: `linear-gradient(${value})`
    }),
    tdl: (value) => ({
      textDecorationLine: value
    }),
    // Text gradient effect
    textGradient: (value) => ({
      backgroundImage: `linear-gradient(${value})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    })
  },
  themeMap: {
    ...i,
    width: "space",
    height: "space",
    minWidth: "space",
    maxWidth: "space",
    minHeight: "space",
    maxHeight: "space",
    flexBasis: "space",
    gridTemplateColumns: "space",
    gridTemplateRows: "space",
    blockSize: "space",
    minBlockSize: "space",
    maxBlockSize: "space",
    inlineSize: "space",
    minInlineSize: "space",
    maxInlineSize: "space",
    borderWidth: "borderWeights"
  }
});
const dark = createTheme("dark-theme", {
  colors,
  shadows: {
    xs: "-4px 0 15px rgb(0 0 0 / 50%)",
    sm: "0 5px 20px -5px rgba(20, 20, 20, 0.1)",
    md: "0 8px 30px rgba(20, 20, 20, 0.15)",
    lg: "0 30px 60px rgba(20, 20, 20, 0.15)",
    xl: "0 40px 80px rgba(20, 20, 20, 0.25)"
  }
});
const SvelteUIGlobalCSS = globalCss({
  a: {
    focusRing: "auto"
  },
  body: {
    [`${dark.selector} &`]: {
      backgroundColor: "$dark700",
      color: "$dark50"
    },
    backgroundColor: "$white",
    color: "$black"
  }
});
const NormalizeCSS = globalCss({
  html: {
    fontFamily: "sans-serif",
    lineHeight: "1.15",
    textSizeAdjust: "100%",
    margin: 0
  },
  body: {
    margin: 0
  },
  "article, aside, footer, header, nav, section, figcaption, figure, main": {
    display: "block"
  },
  h1: {
    fontSize: "2em",
    margin: 0
  },
  hr: {
    boxSizing: "content-box",
    height: 0,
    overflow: "visible"
  },
  pre: {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  a: {
    background: "transparent",
    textDecorationSkip: "objects"
  },
  "a:active, a:hover": {
    outlineWidth: 0
  },
  "abbr[title]": {
    borderBottom: "none",
    textDecoration: "underline"
  },
  "b, strong": {
    fontWeight: "bolder"
  },
  "code, kbp, samp": {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  dfn: {
    fontStyle: "italic"
  },
  mark: {
    backgroundColor: "#ff0",
    color: "#000"
  },
  small: {
    fontSize: "80%"
  },
  "sub, sup": {
    fontSize: "75%",
    lineHeight: 0,
    position: "relative",
    verticalAlign: "baseline"
  },
  sup: {
    top: "-0.5em"
  },
  sub: {
    bottom: "-0.25em"
  },
  "audio, video": {
    display: "inline-block"
  },
  "audio:not([controls])": {
    display: "none",
    height: 0
  },
  img: {
    borderStyle: "none",
    verticalAlign: "middle"
  },
  "svg:not(:root)": {
    overflow: "hidden"
  },
  "button, input, optgroup, select, textarea": {
    fontFamily: "sans-serif",
    fontSize: "100%",
    lineHeight: "1.15",
    margin: 0
  },
  "button, input": {
    overflow: "visible"
  },
  "button, select": {
    textTransform: "none"
  },
  "button, [type=reset], [type=submit]": {
    WebkitAppearance: "button"
  },
  "button::-moz-focus-inner, [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner": {
    borderStyle: "none",
    padding: 0
  },
  "button:-moz-focusring, [type=button]:-moz-focusring, [type=reset]:-moz-focusring, [type=submit]:-moz-focusring": {
    outline: "1px dotted ButtonText"
  },
  legend: {
    boxSizing: "border-box",
    color: "inherit",
    display: "table",
    maxWidth: "100%",
    padding: 0,
    whiteSpace: "normal"
  },
  progress: {
    display: "inline-block",
    verticalAlign: "baseline"
  },
  textarea: {
    overflow: "auto"
  },
  "[type=checkbox], [type=radio]": {
    boxSizing: "border-box",
    padding: 0
  },
  "[type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button": {
    height: "auto"
  },
  "[type=search]": {
    appearance: "textfield",
    outlineOffset: "-2px"
  },
  "[type=search]::-webkit-search-cancel-button, [type=search]::-webkit-search-decoration": {
    appearance: "none"
  },
  "::-webkit-file-upload-button": {
    appearance: "button",
    font: "inherit"
  },
  "details, menu": {
    display: "block"
  },
  summary: {
    display: "list-item"
  },
  canvas: {
    display: "inline-block"
  },
  template: {
    display: "none"
  },
  "[hidden]": {
    display: "none"
  }
});
function themeColor(color, shade = 0) {
  var _a, _b;
  const theme2 = ((_a = useSvelteUIThemeContext()) == null ? void 0 : _a.theme) || useSvelteUITheme();
  let _shade = "50";
  if (!isSvelteUIColor(color))
    return color;
  if (shade !== Number(0))
    _shade = `${shade.toString()}00`;
  return (_b = theme2.colors[`${color}${_shade}`]) == null ? void 0 : _b.value;
}
function isSvelteUIColor(color) {
  let valid = false;
  switch (color) {
    case "dark":
      valid = true;
      break;
    case "gray":
      valid = true;
      break;
    case "red":
      valid = true;
      break;
    case "pink":
      valid = true;
      break;
    case "grape":
      valid = true;
      break;
    case "violet":
      valid = true;
      break;
    case "indigo":
      valid = true;
      break;
    case "blue":
      valid = true;
      break;
    case "cyan":
      valid = true;
      break;
    case "teal":
      valid = true;
      break;
    case "green":
      valid = true;
      break;
    case "lime":
      valid = true;
      break;
    case "yellow":
      valid = true;
      break;
    case "orange":
      valid = true;
      break;
    default:
      valid = false;
      break;
  }
  return valid;
}
function createConverter(units) {
  return (px) => {
    if (typeof px === "number") {
      return `${px / 16}${units}`;
    }
    if (typeof px === "string") {
      const replaced = px.replace("px", "");
      if (!Number.isNaN(Number(replaced))) {
        return `${Number(replaced) / 16}${units}`;
      }
    }
    return px;
  };
}
const rem = createConverter("rem");
function cover(offset = 0) {
  return {
    position: "absolute",
    top: rem(offset),
    right: rem(offset),
    left: rem(offset),
    bottom: rem(offset)
  };
}
function size(props) {
  var _a, _b;
  if (typeof props.size === "number") {
    return props.size;
  }
  if (typeof props.sizes[props.size] === "number") {
    return props.sizes[props.size];
  }
  return +((_a = props.sizes[props.size]) == null ? void 0 : _a.value) || +((_b = props.sizes.md) == null ? void 0 : _b.value);
}
function radius(radii) {
  var _a;
  const theme2 = ((_a = useSvelteUIThemeContext()) == null ? void 0 : _a.theme) || useSvelteUITheme();
  if (typeof radii === "number") {
    return radii;
  }
  return theme2.radii[radii].value;
}
function isHexColor(hex) {
  const replaced = hex.replace("#", "");
  return typeof replaced === "string" && replaced.length === 6 && !Number.isNaN(Number(`0x${replaced}`));
}
function hexToRgba(color) {
  const replaced = color.replace("#", "");
  const parsed = parseInt(replaced, 16);
  const r2 = parsed >> 16 & 255;
  const g2 = parsed >> 8 & 255;
  const b2 = parsed & 255;
  return {
    r: r2,
    g: g2,
    b: b2,
    a: 1
  };
}
function rgbStringToRgba(color) {
  const [r2, g2, b2, a2] = color.replace(/[^0-9,.]/g, "").split(",").map(Number);
  return { r: r2, g: g2, b: b2, a: a2 || 1 };
}
function toRgba(color) {
  if (isHexColor(color)) {
    return hexToRgba(color);
  }
  if (color.startsWith("rgb")) {
    return rgbStringToRgba(color);
  }
  return {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
}
function rgba(color, alpha = 1) {
  if (typeof color !== "string" || alpha > 1 || alpha < 0) {
    return "rgba(0, 0, 0, 1)";
  }
  const { r: r2, g: g2, b: b2 } = toRgba(color);
  return `rgba(${r2}, ${g2}, ${b2}, ${alpha})`;
}
const DEFAULT_GRADIENT = {
  from: "indigo",
  to: "cyan",
  deg: 45
};
function variant({ variant: variant2, color, gradient }) {
  var _a;
  const theme2 = ((_a = useSvelteUIThemeContext()) == null ? void 0 : _a.theme) || useSvelteUITheme();
  const primaryShade = 6;
  if (variant2 === "light") {
    return {
      border: "transparent",
      background: [rgba(themeColor(color, 8), 0.35), rgba(themeColor(color, 0), 1)],
      color: [
        color === "dark" ? themeColor("dark", 0) : themeColor(color, 2),
        color === "dark" ? themeColor("dark", 9) : themeColor(color, primaryShade)
      ],
      // themeColor(color, theme.colorScheme === 'dark' ? 2 : getPrimaryShade('light')),
      hover: [rgba(themeColor(color, 7), 0.45), rgba(themeColor(color, 1), 0.65)]
    };
  }
  if (variant2 === "default") {
    return {
      border: [themeColor("dark", 5), themeColor("gray", 4)],
      background: [themeColor("dark", 5), theme2.colors.white.value],
      color: [theme2.colors.white.value, theme2.colors.black.value],
      hover: [themeColor("dark", 4), themeColor("gray", 0)]
    };
  }
  if (variant2 === "white") {
    return {
      border: "transparent",
      background: theme2.colors.white.value,
      color: themeColor(color, primaryShade),
      hover: null
    };
  }
  if (variant2 === "outline") {
    return {
      border: [themeColor(color, 4), themeColor(color, primaryShade)],
      background: "transparent",
      color: [themeColor(color, 4), themeColor(color, primaryShade)],
      hover: [rgba(themeColor(color, 4), 0.05), rgba(themeColor(color, 0), 0.35)]
    };
  }
  if (variant2 === "gradient") {
    const merged = {
      from: (gradient == null ? void 0 : gradient.from) || DEFAULT_GRADIENT.from,
      to: (gradient == null ? void 0 : gradient.to) || DEFAULT_GRADIENT.to,
      deg: (gradient == null ? void 0 : gradient.deg) || DEFAULT_GRADIENT.deg
    };
    return {
      background: `linear-gradient(${merged.deg}deg, ${themeColor(merged.from, primaryShade)} 0%, ${themeColor(merged.to, primaryShade)} 100%)`,
      color: theme2.colors.white.value,
      border: "transparent",
      hover: null
    };
  }
  if (variant2 === "subtle") {
    return {
      border: "transparent",
      background: "transparent",
      color: [
        color === "dark" ? themeColor("dark", 0) : themeColor(color, 2),
        color === "dark" ? themeColor("dark", 9) : themeColor(color, primaryShade)
      ],
      hover: [rgba(themeColor(color, 8), 0.35), rgba(themeColor(color, 0), 1)]
    };
  }
  return {
    border: "transparent",
    background: [themeColor(color, 8), themeColor(color, primaryShade)],
    color: theme2.colors.white.value,
    hover: themeColor(color, 7)
  };
}
const fns = {
  cover,
  size,
  radius,
  themeColor,
  variant,
  rgba
};
function useSvelteUITheme() {
  let observer;
  colorScheme == null ? void 0 : colorScheme.subscribe((mode) => {
    observer = mode;
  });
  const DEFAULT_THEME = {
    // @ts-ignore
    ...theme,
    colorNames: colorNameMap,
    colorScheme: observer,
    dark: dark == null ? void 0 : dark.selector,
    fn: {
      cover: fns.cover,
      themeColor: fns.themeColor,
      size: fns.size,
      radius: fns.radius,
      rgba: fns.rgba,
      variant: fns.variant
    }
  };
  return DEFAULT_THEME;
}
function create_fragment$m(ctx) {
  let div;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[19].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[18],
    null
  );
  let div_levels = [
    { id: "SVELTEUI_PROVIDER" },
    {
      class: div_class_value = /*cx*/
      ctx[5](
        /*className*/
        ctx[2],
        /*classes*/
        ctx[4].root,
        /*currentTheme*/
        ctx[3]
      )
    },
    /*$$restProps*/
    ctx[7]
  ];
  let div_data = {};
  for (let i2 = 0; i2 < div_levels.length; i2 += 1) {
    div_data = assign(div_data, div_levels[i2]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[20](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(
            null,
            div,
            /*use*/
            ctx[1]
          )),
          action_destroyer(
            /*forwardEvents*/
            ctx[6].call(null, div)
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        262144)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[18],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[18]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[18],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        { id: "SVELTEUI_PROVIDER" },
        (!current || dirty & /*cx, className, classes, currentTheme*/
        60 && div_class_value !== (div_class_value = /*cx*/
        ctx2[5](
          /*className*/
          ctx2[2],
          /*classes*/
          ctx2[4].root,
          /*currentTheme*/
          ctx2[3]
        ))) && { class: div_class_value },
        dirty & /*$$restProps*/
        128 && /*$$restProps*/
        ctx2[7]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      2)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (default_slot)
        default_slot.d(detaching);
      ctx[20](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$m($$self, $$props, $$invalidate) {
  let overrides;
  let mergedTheme;
  let cx2;
  let classes;
  const omit_props_names = [
    "use",
    "class",
    "element",
    "theme",
    "styles",
    "defaultProps",
    "themeObserver",
    "withNormalizeCSS",
    "withGlobalStyles",
    "override",
    "inherit"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let $colorScheme;
  component_subscribe($$self, colorScheme, ($$value) => $$invalidate(21, $colorScheme = $$value));
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], class: className = "", element: element2 = void 0, theme: theme2 = useSvelteUITheme(), styles = {}, defaultProps = {}, themeObserver = "light", withNormalizeCSS = false, withGlobalStyles = false, override = {}, inherit = false } = $$props;
  beforeUpdate(() => {
    const htmlClassList = document.documentElement.classList;
    if ($colorScheme === "dark")
      htmlClassList.add(dark.className);
    if ($colorScheme === "light")
      htmlClassList.remove(dark.className);
  });
  const ctx = useSvelteUIThemeContext();
  const useStyles2 = createStyles(() => ({ root: {} }));
  const forwardEvents = createEventForwarder(get_current_component());
  const DEFAULT_THEME = useSvelteUITheme();
  let currentTheme = null;
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("theme" in $$new_props)
      $$invalidate(8, theme2 = $$new_props.theme);
    if ("styles" in $$new_props)
      $$invalidate(9, styles = $$new_props.styles);
    if ("defaultProps" in $$new_props)
      $$invalidate(10, defaultProps = $$new_props.defaultProps);
    if ("themeObserver" in $$new_props)
      $$invalidate(11, themeObserver = $$new_props.themeObserver);
    if ("withNormalizeCSS" in $$new_props)
      $$invalidate(12, withNormalizeCSS = $$new_props.withNormalizeCSS);
    if ("withGlobalStyles" in $$new_props)
      $$invalidate(13, withGlobalStyles = $$new_props.withGlobalStyles);
    if ("override" in $$new_props)
      $$invalidate(14, override = $$new_props.override);
    if ("inherit" in $$new_props)
      $$invalidate(15, inherit = $$new_props.inherit);
    if ("$$scope" in $$new_props)
      $$invalidate(18, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*inherit, theme, styles, defaultProps*/
    34560) {
      $$invalidate(16, overrides = {
        themeOverride: inherit ? { ...ctx.theme, ...theme2 } : theme2,
        styles: inherit ? { ...ctx.styles, ...styles } : styles,
        defaultProps: inherit ? { ...ctx.styles, ...defaultProps } : defaultProps
      });
    }
    if ($$self.$$.dirty & /*overrides*/
    65536) {
      $$invalidate(17, mergedTheme = mergeTheme(DEFAULT_THEME, overrides.themeOverride));
    }
    if ($$self.$$.dirty & /*themeObserver, mergedTheme*/
    133120) {
      {
        if (themeObserver !== null) {
          $$invalidate(3, currentTheme = themeObserver === "light" ? mergedTheme : dark);
        }
      }
    }
    if ($$self.$$.dirty & /*withGlobalStyles*/
    8192) {
      if (withGlobalStyles)
        SvelteUIGlobalCSS();
    }
    if ($$self.$$.dirty & /*withNormalizeCSS*/
    4096) {
      if (withNormalizeCSS)
        NormalizeCSS();
    }
    if ($$self.$$.dirty & /*overrides*/
    65536) {
      setContext(key, {
        theme: overrides.themeOverride,
        styles: {},
        defaultProps: {}
      });
    }
    if ($$self.$$.dirty & /*themeObserver*/
    2048) {
      colorScheme.set(themeObserver);
    }
    if ($$self.$$.dirty & /*override*/
    16384) {
      $$invalidate(5, { cx: cx2, classes } = useStyles2(null, { override }), cx2, ($$invalidate(4, classes), $$invalidate(14, override)));
    }
  };
  return [
    element2,
    use,
    className,
    currentTheme,
    classes,
    cx2,
    forwardEvents,
    $$restProps,
    theme2,
    styles,
    defaultProps,
    themeObserver,
    withNormalizeCSS,
    withGlobalStyles,
    override,
    inherit,
    overrides,
    mergedTheme,
    $$scope,
    slots,
    div_binding
  ];
}
class SvelteUIProvider extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$m, create_fragment$m, safe_not_equal, {
      use: 1,
      class: 2,
      element: 0,
      theme: 8,
      styles: 9,
      defaultProps: 10,
      themeObserver: 11,
      withNormalizeCSS: 12,
      withGlobalStyles: 13,
      override: 14,
      inherit: 15
    });
  }
}
const SvelteUIProvider$1 = SvelteUIProvider;
const vFunc = (color, gradient) => {
  const { themeColor: themeColor2, rgba: rgba2 } = fns;
  const variants = {
    /** Filled variant */
    filled: {
      [`${dark.selector} &`]: {
        backgroundColor: themeColor2(color, 8)
      },
      border: "transparent",
      backgroundColor: themeColor2(color, 6),
      color: "White",
      "&:hover": { backgroundColor: themeColor2(color, 7) }
    },
    /** Light variant */
    light: {
      [`${dark.selector} &`]: {
        backgroundColor: rgba2(themeColor2(color, 8), 0.35),
        color: color === "dark" ? themeColor2("dark", 0) : themeColor2(color, 2),
        "&:hover": { backgroundColor: rgba2(themeColor2(color, 7), 0.45) }
      },
      border: "transparent",
      backgroundColor: themeColor2(color, 0),
      color: color === "dark" ? themeColor2("dark", 9) : themeColor2(color, 6),
      "&:hover": { backgroundColor: themeColor2(color, 1) }
    },
    /** Outline variant */
    outline: {
      [`${dark.selector} &`]: {
        border: `1px solid ${themeColor2(color, 4)}`,
        color: `${themeColor2(color, 4)}`,
        "&:hover": { backgroundColor: rgba2(themeColor2(color, 4), 0.05) }
      },
      border: `1px solid ${themeColor2(color, 7)}`,
      backgroundColor: "transparent",
      color: themeColor2(color, 7),
      "&:hover": {
        backgroundColor: rgba2(themeColor2(color, 0), 0.35)
      }
    },
    /** Subtle variant */
    subtle: {
      [`${dark.selector} &`]: {
        color: color === "dark" ? themeColor2("dark", 0) : themeColor2(color, 2),
        "&:hover": { backgroundColor: rgba2(themeColor2(color, 8), 0.35) }
      },
      border: "transparent",
      backgroundColor: "transparent",
      color: color === "dark" ? themeColor2("dark", 9) : themeColor2(color, 6),
      "&:hover": {
        backgroundColor: themeColor2(color, 0)
      }
    },
    /** Default variant */
    default: {
      [`${dark.selector} &`]: {
        border: `1px solid ${themeColor2("dark", 5)}`,
        backgroundColor: themeColor2("dark", 5),
        color: "White",
        "&:hover": { backgroundColor: themeColor2("dark", 4) }
      },
      border: `1px solid ${themeColor2("gray", 4)}`,
      backgroundColor: "White",
      color: "Black",
      "&:hover": { backgroundColor: themeColor2("gray", 0) }
    },
    /** White variant */
    white: {
      border: "transparent",
      backgroundColor: "White",
      color: themeColor2(color, 7),
      "&:hover": { backgroundColor: "White" }
    },
    gradient: {}
  };
  if (gradient) {
    variants.gradient = {
      border: "transparent",
      background: `linear-gradient(${gradient.deg}deg, $${gradient.from}600 0%, $${gradient.to}600 100%)`,
      color: "White"
    };
  }
  return variants;
};
function randomID(prefix = "svelteui") {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}
function mergeTheme(currentTheme, themeOverride) {
  if (!themeOverride) {
    return currentTheme;
  }
  return Object.keys(currentTheme).reduce((acc, key2) => {
    acc[key2] = typeof themeOverride[key2] === "object" ? { ...currentTheme[key2], ...themeOverride[key2] } : typeof themeOverride[key2] === "number" ? themeOverride[key2] : themeOverride[key2] || currentTheme[key2];
    return acc;
  }, {});
}
const hasOwn = {}.hasOwnProperty;
function cx(...args) {
  const classes = [];
  for (let i2 = 0; i2 < args.length; i2++) {
    const arg = args[i2];
    if (!arg)
      continue;
    const argType = typeof arg;
    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = { ...arg };
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (arg.toString === Object.prototype.toString) {
        for (const key2 in arg) {
          if (hasOwn.call(arg, key2) && arg[key2]) {
            classes.push(key2);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }
  return classes.join(" ");
}
function cssFactory() {
  return { cx };
}
function fromEntries(entries) {
  const o2 = {};
  Object.keys(entries).forEach((key2) => {
    const [k2, v2] = entries[key2];
    o2[k2] = v2;
  });
  return o2;
}
const CLASS_KEY = "svelteui";
function createRef(refName) {
  return `__svelteui-ref-${refName || ""}`;
}
function sanitizeCss(object, theme2) {
  const refs = [];
  const classMap = {};
  const _sanitizeVariants = (obj) => {
    const variantsObject = obj.variation ?? obj;
    const variants = Object.keys(variantsObject);
    for (const variant2 of variants) {
      _sanitize(variantsObject[variant2]);
    }
  };
  const _sanitize = (obj) => {
    Object.keys(obj).map((value) => {
      if (value === "variants") {
        _sanitizeVariants(obj[value]);
        return;
      }
      if (value === "ref") {
        refs.push(obj.ref);
      }
      if (value === "darkMode") {
        obj[`${theme2.dark} &`] = obj.darkMode;
      }
      if (obj[value] === null || typeof obj[value] !== "object")
        return;
      _sanitize(obj[value]);
      if (value === "darkMode") {
        delete obj[value];
      } else if (value.startsWith("@media"))
        ;
      else if (!value.startsWith("&") && !value.startsWith(theme2.dark)) {
        const getStyles = css(obj[value]);
        classMap[value] = getStyles().toString();
        obj[`& .${getStyles().toString()}`] = obj[value];
        delete obj[value];
      }
    });
  };
  _sanitize(object);
  delete object["& .root"];
  return { classMap, refs: Array.from(new Set(refs)) };
}
function createStyles(input) {
  const getCssObject = typeof input === "function" ? input : () => input;
  function useStyles2(params = {}, options) {
    var _a;
    const theme2 = ((_a = useSvelteUIThemeContext()) == null ? void 0 : _a.theme) || useSvelteUITheme();
    const { cx: cx2 } = cssFactory();
    const { override, name } = options || {};
    const dirtyCssObject = getCssObject(theme2, params, createRef);
    const sanitizedCss = Object.assign({}, dirtyCssObject);
    const { classMap, refs } = sanitizeCss(sanitizedCss, theme2);
    const root = dirtyCssObject["root"] ?? void 0;
    const cssObjectClean = root !== void 0 ? { ...root, ...sanitizedCss } : dirtyCssObject;
    const getStyles = css(cssObjectClean);
    const classes = fromEntries(Object.keys(dirtyCssObject).map((keys) => {
      const ref = refs.find((r2) => r2.includes(keys)) ?? "";
      const getRefName = (ref == null ? void 0 : ref.split("-")) ?? [];
      const keyIsRef = (ref == null ? void 0 : ref.split("-")[(getRefName == null ? void 0 : getRefName.length) - 1]) === keys;
      const value = keys.toString();
      let transformedClasses = classMap[value] ?? value;
      if (ref && keyIsRef) {
        transformedClasses = `${transformedClasses} ${ref}`;
      }
      if (keys === "root") {
        transformedClasses = getStyles({ css: override }).toString();
      }
      let libClass = `${CLASS_KEY}-${keys.toString()}`;
      if (name) {
        libClass = `${CLASS_KEY}-${name}-${keys.toString()}`;
        transformedClasses = `${transformedClasses} ${libClass}`;
      }
      return [keys, transformedClasses];
    }));
    return {
      cx: cx2,
      theme: theme2,
      classes,
      getStyles: css(cssObjectClean)
    };
  }
  return useStyles2;
}
const SYSTEM_PROPS = {
  mt: "marginTop",
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  pt: "paddingTop",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight"
};
const NEGATIVE_VALUES = ["-xs", "-sm", "-md", "-lg", "-xl"];
function isValidSizeValue(margin) {
  return typeof margin === "string" || typeof margin === "number";
}
function getSizeValue(margin, theme2) {
  if (NEGATIVE_VALUES.includes(margin)) {
    return theme2.fn.size({ size: margin.replace("-", ""), sizes: theme2.space }) * -1;
  }
  return theme2.fn.size({ size: margin, sizes: theme2.space });
}
function getSystemStyles(systemStyles, theme2) {
  const styles = {};
  if (isValidSizeValue(systemStyles.p)) {
    const value = getSizeValue(systemStyles.p, theme2);
    styles.padding = value;
  }
  if (isValidSizeValue(systemStyles.m)) {
    const value = getSizeValue(systemStyles.m, theme2);
    styles.margin = value;
  }
  if (isValidSizeValue(systemStyles.py)) {
    const value = getSizeValue(systemStyles.py, theme2);
    styles.paddingTop = value;
    styles.paddingBottom = value;
  }
  if (isValidSizeValue(systemStyles.px)) {
    const value = getSizeValue(systemStyles.px, theme2);
    styles.paddingLeft = value;
    styles.paddingRight = value;
  }
  if (isValidSizeValue(systemStyles.my)) {
    const value = getSizeValue(systemStyles.my, theme2);
    styles.marginTop = value;
    styles.marginBottom = value;
  }
  if (isValidSizeValue(systemStyles.mx)) {
    const value = getSizeValue(systemStyles.mx, theme2);
    styles.marginLeft = value;
    styles.marginRight = value;
  }
  Object.keys(SYSTEM_PROPS).forEach((property) => {
    if (isValidSizeValue(systemStyles[property])) {
      styles[SYSTEM_PROPS[property]] = theme2.fn.size({
        size: getSizeValue(systemStyles[property], theme2),
        sizes: theme2.space
      });
    }
  });
  return styles;
}
function create_else_block$2(ctx) {
  let div;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[28].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[32],
    null
  );
  let div_levels = [
    {
      class: div_class_value = /*className*/
      ctx[2] + " " + /*BoxStyles*/
      ctx[7]({
        css: {
          .../*getCSSStyles*/
          ctx[8](
            /*theme*/
            ctx[11]
          ),
          .../*systemStyles*/
          ctx[6]
        }
      })
    },
    /*$$restProps*/
    ctx[12]
  ];
  let div_data = {};
  for (let i2 = 0; i2 < div_levels.length; i2 += 1) {
    div_data = assign(div_data, div_levels[i2]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[31](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(
            /*forwardEvents*/
            ctx[9].call(null, div)
          ),
          action_destroyer(useActions_action = useActions.call(
            null,
            div,
            /*use*/
            ctx[1]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        2)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[32],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[32]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[32],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty[0] & /*className, BoxStyles, getCSSStyles, systemStyles*/
        452 && div_class_value !== (div_class_value = /*className*/
        ctx2[2] + " " + /*BoxStyles*/
        ctx2[7]({
          css: {
            .../*getCSSStyles*/
            ctx2[8](
              /*theme*/
              ctx2[11]
            ),
            .../*systemStyles*/
            ctx2[6]
          }
        }))) && { class: div_class_value },
        dirty[0] & /*$$restProps*/
        4096 && /*$$restProps*/
        ctx2[12]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/
      2)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (default_slot)
        default_slot.d(detaching);
      ctx[31](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$5(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      use: [
        /*forwardEvents*/
        ctx[9],
        [
          useActions,
          /*use*/
          ctx[1]
        ]
      ]
    },
    {
      class: (
        /*className*/
        ctx[2] + " " + /*BoxStyles*/
        ctx[7]({
          css: {
            .../*getCSSStyles*/
            ctx[8](
              /*theme*/
              ctx[11]
            ),
            .../*systemStyles*/
            ctx[6]
          }
        })
      )
    },
    /*$$restProps*/
    ctx[12]
  ];
  var switch_value = (
    /*root*/
    ctx[3]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot$d] },
      $$scope: { ctx: ctx2 }
    };
    if (dirty !== void 0 && dirty[0] & /*forwardEvents, use, className, BoxStyles, getCSSStyles, theme, systemStyles, $$restProps*/
    7110) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [
        dirty[0] & /*forwardEvents, use*/
        514 && {
          use: [
            /*forwardEvents*/
            ctx2[9],
            [
              useActions,
              /*use*/
              ctx2[1]
            ]
          ]
        },
        dirty[0] & /*className, BoxStyles, getCSSStyles, theme, systemStyles*/
        2500 && {
          class: (
            /*className*/
            ctx2[2] + " " + /*BoxStyles*/
            ctx2[7]({
              css: {
                .../*getCSSStyles*/
                ctx2[8](
                  /*theme*/
                  ctx2[11]
                ),
                .../*systemStyles*/
                ctx2[6]
              }
            })
          )
        },
        dirty[0] & /*$$restProps*/
        4096 && get_spread_object(
          /*$$restProps*/
          ctx2[12]
        )
      ]);
    } else {
      for (let i2 = 0; i2 < switch_instance_spread_levels.length; i2 += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i2]);
      }
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    ctx[30](switch_instance);
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*root*/
      8 && switch_value !== (switch_value = /*root*/
      ctx2[3])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          ctx2[30](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty[0] & /*forwardEvents, use, className, BoxStyles, getCSSStyles, theme, systemStyles, $$restProps*/
        7110 ? get_spread_update(switch_instance_spread_levels, [
          dirty[0] & /*forwardEvents, use*/
          514 && {
            use: [
              /*forwardEvents*/
              ctx2[9],
              [
                useActions,
                /*use*/
                ctx2[1]
              ]
            ]
          },
          dirty[0] & /*className, BoxStyles, getCSSStyles, theme, systemStyles*/
          2500 && {
            class: (
              /*className*/
              ctx2[2] + " " + /*BoxStyles*/
              ctx2[7]({
                css: {
                  .../*getCSSStyles*/
                  ctx2[8](
                    /*theme*/
                    ctx2[11]
                  ),
                  .../*systemStyles*/
                  ctx2[6]
                }
              })
            )
          },
          dirty[0] & /*$$restProps*/
          4096 && get_spread_object(
            /*$$restProps*/
            ctx2[12]
          )
        ]) : {};
        if (dirty[1] & /*$$scope*/
        2) {
          switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      ctx[30](null);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block$7(ctx) {
  let current;
  let svelte_element = (
    /*castRoot*/
    ctx[10]() && create_dynamic_element$1(ctx)
  );
  return {
    c() {
      if (svelte_element)
        svelte_element.c();
    },
    m(target, anchor) {
      if (svelte_element)
        svelte_element.m(target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*castRoot*/
        ctx2[10]()
      ) {
        svelte_element.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(svelte_element, local);
      current = true;
    },
    o(local) {
      transition_out(svelte_element, local);
      current = false;
    },
    d(detaching) {
      if (svelte_element)
        svelte_element.d(detaching);
    }
  };
}
function create_default_slot$d(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[28].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[32],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        2)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[32],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[32]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[32],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_dynamic_element$1(ctx) {
  let svelte_element;
  let svelte_element_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[28].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[32],
    null
  );
  let svelte_element_levels = [
    {
      class: svelte_element_class_value = /*className*/
      ctx[2] + " " + /*BoxStyles*/
      ctx[7]({
        css: {
          .../*getCSSStyles*/
          ctx[8](
            /*theme*/
            ctx[11]
          ),
          .../*systemStyles*/
          ctx[6]
        }
      })
    },
    /*$$restProps*/
    ctx[12]
  ];
  let svelte_element_data = {};
  for (let i2 = 0; i2 < svelte_element_levels.length; i2 += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i2]);
  }
  return {
    c() {
      svelte_element = element(
        /*castRoot*/
        ctx[10]()
      );
      if (default_slot)
        default_slot.c();
      set_dynamic_element_data(
        /*castRoot*/
        ctx[10]()
      )(svelte_element, svelte_element_data);
    },
    m(target, anchor) {
      insert(target, svelte_element, anchor);
      if (default_slot) {
        default_slot.m(svelte_element, null);
      }
      ctx[29](svelte_element);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(
            /*forwardEvents*/
            ctx[9].call(null, svelte_element)
          ),
          action_destroyer(useActions_action = useActions.call(
            null,
            svelte_element,
            /*use*/
            ctx[1]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        2)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[32],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[32]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[32],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_dynamic_element_data(
        /*castRoot*/
        ctx2[10]()
      )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
        (!current || dirty[0] & /*className, BoxStyles, getCSSStyles, systemStyles*/
        452 && svelte_element_class_value !== (svelte_element_class_value = /*className*/
        ctx2[2] + " " + /*BoxStyles*/
        ctx2[7]({
          css: {
            .../*getCSSStyles*/
            ctx2[8](
              /*theme*/
              ctx2[11]
            ),
            .../*systemStyles*/
            ctx2[6]
          }
        }))) && { class: svelte_element_class_value },
        dirty[0] & /*$$restProps*/
        4096 && /*$$restProps*/
        ctx2[12]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/
      2)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element);
      }
      if (default_slot)
        default_slot.d(detaching);
      ctx[29](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$l(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$7, create_if_block_1$5, create_else_block$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*isHTMLElement*/
      ctx2[4]
    )
      return 0;
    if (
      /*isComponent*/
      ctx2[5] && typeof /*root*/
      ctx2[3] !== "string"
    )
      return 1;
    return 2;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function instance$l($$self, $$props, $$invalidate) {
  var _a;
  let getCSSStyles;
  let BoxStyles;
  let systemStyles;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "css",
    "root",
    "m",
    "my",
    "mx",
    "mt",
    "mb",
    "ml",
    "mr",
    "p",
    "py",
    "px",
    "pt",
    "pb",
    "pl",
    "pr"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", css: css$1 = {}, root = void 0, m: m2 = void 0, my = void 0, mx = void 0, mt = void 0, mb = void 0, ml = void 0, mr = void 0, p: p2 = void 0, py = void 0, px = void 0, pt = void 0, pb = void 0, pl = void 0, pr = void 0 } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  const castRoot = () => root;
  const theme2 = ((_a = useSvelteUIThemeContext()) == null ? void 0 : _a.theme) || useSvelteUITheme();
  let isHTMLElement;
  let isComponent;
  function svelte_element_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("css" in $$new_props)
      $$invalidate(13, css$1 = $$new_props.css);
    if ("root" in $$new_props)
      $$invalidate(3, root = $$new_props.root);
    if ("m" in $$new_props)
      $$invalidate(14, m2 = $$new_props.m);
    if ("my" in $$new_props)
      $$invalidate(15, my = $$new_props.my);
    if ("mx" in $$new_props)
      $$invalidate(16, mx = $$new_props.mx);
    if ("mt" in $$new_props)
      $$invalidate(17, mt = $$new_props.mt);
    if ("mb" in $$new_props)
      $$invalidate(18, mb = $$new_props.mb);
    if ("ml" in $$new_props)
      $$invalidate(19, ml = $$new_props.ml);
    if ("mr" in $$new_props)
      $$invalidate(20, mr = $$new_props.mr);
    if ("p" in $$new_props)
      $$invalidate(21, p2 = $$new_props.p);
    if ("py" in $$new_props)
      $$invalidate(22, py = $$new_props.py);
    if ("px" in $$new_props)
      $$invalidate(23, px = $$new_props.px);
    if ("pt" in $$new_props)
      $$invalidate(24, pt = $$new_props.pt);
    if ("pb" in $$new_props)
      $$invalidate(25, pb = $$new_props.pb);
    if ("pl" in $$new_props)
      $$invalidate(26, pl = $$new_props.pl);
    if ("pr" in $$new_props)
      $$invalidate(27, pr = $$new_props.pr);
    if ("$$scope" in $$new_props)
      $$invalidate(32, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*css*/
    8192) {
      $$invalidate(8, getCSSStyles = typeof css$1 === "function" ? css$1 : () => css$1);
    }
    if ($$self.$$.dirty[0] & /*root*/
    8) {
      {
        $$invalidate(4, isHTMLElement = root && typeof root === "string");
        $$invalidate(5, isComponent = root && typeof root === "function");
      }
    }
    if ($$self.$$.dirty[0] & /*m, my, mx, mt, mb, ml, mr, p, py, px, pt, pb, pl, pr*/
    268419072) {
      $$invalidate(6, systemStyles = getSystemStyles(
        {
          m: m2,
          my,
          mx,
          mt,
          mb,
          ml,
          mr,
          p: p2,
          py,
          px,
          pt,
          pb,
          pl,
          pr
        },
        theme2
      ));
    }
  };
  $$invalidate(7, BoxStyles = css({}));
  return [
    element2,
    use,
    className,
    root,
    isHTMLElement,
    isComponent,
    systemStyles,
    BoxStyles,
    getCSSStyles,
    forwardEvents,
    castRoot,
    theme2,
    $$restProps,
    css$1,
    m2,
    my,
    mx,
    mt,
    mb,
    ml,
    mr,
    p2,
    py,
    px,
    pt,
    pb,
    pl,
    pr,
    slots,
    svelte_element_binding,
    switch_instance_binding,
    div_binding,
    $$scope
  ];
}
class Box extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$l,
      create_fragment$l,
      safe_not_equal,
      {
        use: 1,
        element: 0,
        class: 2,
        css: 13,
        root: 3,
        m: 14,
        my: 15,
        mx: 16,
        mt: 17,
        mb: 18,
        ml: 19,
        mr: 20,
        p: 21,
        py: 22,
        px: 23,
        pt: 24,
        pb: 25,
        pl: 26,
        pr: 27
      },
      null,
      [-1, -1]
    );
  }
}
const sizes$1 = {
  xs: {
    height: 30,
    padding: "0px 14px"
  },
  sm: {
    height: 36,
    padding: "0px 18px"
  },
  md: {
    height: 42,
    padding: "0px 22px"
  },
  lg: {
    height: 50,
    padding: "0px 26px"
  },
  xl: {
    height: 60,
    padding: "0px 32px"
  },
  "compact-xs": {
    height: 22,
    padding: "0 7px"
  },
  "compact-sm": {
    height: 26,
    padding: "0 8px"
  },
  "compact-md": {
    height: 30,
    padding: "0 10px"
  },
  "compact-lg": {
    height: 34,
    padding: "0 12px"
  },
  "compact-xl": {
    height: 40,
    padding: "0 14px"
  }
};
const useStyles$9 = createStyles((theme2, { color, compact, fullSize, gradient, radius: radius2, size: size2, variant: variant2 }) => {
  return {
    root: {
      focusRing: "auto",
      cursor: "pointer",
      position: "relative",
      boxSizing: "border-box",
      textDecoration: "none",
      outline: "none",
      userSelect: "none",
      appearance: "none",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: null,
      borderRadius: typeof radius2 === "number" ? radius2 : `$${radius2}`,
      height: typeof size2 === "number" ? `${size2}px` : sizes$1[compact ? `compact-${size2}` : size2].height,
      padding: typeof size2 === "number" ? `0px ${size2}px` : sizes$1[compact ? `compact-${size2}` : size2].padding,
      fontFamily: theme2.fonts.standard.value ?? "sans-serif",
      fontWeight: "$semibold",
      fontSize: `$${size2}`,
      lineHeight: 1,
      flexGrow: 0,
      width: fullSize ? "100%" : "fit-content",
      "&:hover": {
        backgroundColor: variant2 === "gradient" ? null : theme2.fn.themeColor(color, 7),
        backgroundSize: variant2 === "gradient" ? "200%" : null
      },
      "&:active": {
        transform: "translateY(1px)"
      },
      "&:disabled": {
        pointerEvents: "none",
        borderColor: "transparent",
        background: theme2.fn.themeColor("gray", 2),
        backgroundColor: theme2.fn.themeColor("gray", 2),
        color: theme2.fn.themeColor("gray", 5),
        cursor: "not-allowed",
        darkMode: {
          borderColor: "transparent",
          backgroundColor: theme2.fn.themeColor("dark", 4),
          color: theme2.fn.themeColor("dark", 6)
        }
      }
    },
    disabled: {
      pointerEvents: "none",
      borderColor: "transparent",
      background: theme2.fn.themeColor("gray", 2),
      backgroundColor: theme2.fn.themeColor("gray", 2),
      color: theme2.fn.themeColor("gray", 5),
      cursor: "not-allowed",
      darkMode: {
        backgroundColor: theme2.fn.themeColor("dark", 4),
        color: theme2.fn.themeColor("dark", 6)
      }
    },
    loading: {
      pointerEvents: "none",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: -1,
        backgroundColor: "rgba(255, 255, 255, .5)",
        borderRadius: `$${radius2}`,
        cursor: "not-allowed"
      },
      darkMode: {
        "&::before": {
          backgroundColor: theme2.fn.rgba(theme2.fn.themeColor("dark", 7), 0.5)
        }
      }
    },
    variants: {
      variation: vFunc(color, gradient),
      // Used to override the disable style when using anchor HTML element
      disabled: {
        true: {
          pointerEvents: "none",
          borderColor: "transparent",
          background: theme2.fn.themeColor("gray", 2),
          backgroundColor: theme2.fn.themeColor("gray", 2),
          color: theme2.fn.themeColor("gray", 5),
          cursor: "not-allowed",
          [`${dark.selector} &`]: {
            borderColor: "transparent",
            backgroundColor: theme2.fn.themeColor("dark", 4),
            color: theme2.fn.themeColor("dark", 6)
          }
        }
      }
    }
  };
});
const ButtonErrors = Object.freeze([
  {
    error: true,
    message: "If using the disabled prop, a loading cannot be set at the same time",
    solution: `
                If your component looks like this:
                
                &lt;Button disabled loading ...&gt; Button Text &lt;/Button&gt;
                         ^^^^^^^^ ^^^^^^^ - Try removing one of these
                `
  },
  {
    error: true,
    message: "If using the external prop, a href prop must be associated with it. If you have an href prop there must be content inside.",
    solution: `
                If your component looks like this:
                
                &lt;Button external ...&gt; Button Text &lt;/Button&gt;
                         ^^^^^^^^ - Try adding the href prop too
                `
  }
]);
function create_fragment$k(ctx) {
  let svg;
  let g1;
  let g0;
  let circle;
  let path;
  let animateTransform;
  let svg_width_value;
  let svg_height_value;
  let useActions_action;
  let mounted;
  let dispose;
  return {
    c() {
      svg = svg_element("svg");
      g1 = svg_element("g");
      g0 = svg_element("g");
      circle = svg_element("circle");
      path = svg_element("path");
      animateTransform = svg_element("animateTransform");
      attr(circle, "stroke-opacity", ".5");
      attr(circle, "cx", "16");
      attr(circle, "cy", "16");
      attr(circle, "r", "16");
      attr(animateTransform, "attributeName", "transform");
      attr(animateTransform, "type", "rotate");
      attr(animateTransform, "from", "0 16 16");
      attr(animateTransform, "to", "360 16 16");
      attr(animateTransform, "dur", "1s");
      attr(animateTransform, "repeatCount", "indefinite");
      attr(path, "d", "M32 16c0-9.94-8.06-16-16-16");
      attr(g0, "transform", "translate(2.5 2.5)");
      attr(g0, "stroke-width", "5");
      attr(g1, "fill", "none");
      attr(g1, "fill-rule", "evenodd");
      attr(svg, "width", svg_width_value = `${/*size*/
      ctx[1]}px`);
      attr(svg, "height", svg_height_value = `${/*size*/
      ctx[1]}px`);
      attr(svg, "viewBox", "0 0 38 38");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(
        svg,
        "stroke",
        /*color*/
        ctx[2]
      );
      attr(
        svg,
        "class",
        /*className*/
        ctx[3]
      );
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, g1);
      append(g1, g0);
      append(g0, circle);
      append(g0, path);
      append(path, animateTransform);
      if (!mounted) {
        dispose = action_destroyer(useActions_action = useActions.call(
          null,
          svg,
          /*use*/
          ctx[0]
        ));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*size*/
      2 && svg_width_value !== (svg_width_value = `${/*size*/
      ctx2[1]}px`)) {
        attr(svg, "width", svg_width_value);
      }
      if (dirty & /*size*/
      2 && svg_height_value !== (svg_height_value = `${/*size*/
      ctx2[1]}px`)) {
        attr(svg, "height", svg_height_value);
      }
      if (dirty & /*color*/
      4) {
        attr(
          svg,
          "stroke",
          /*color*/
          ctx2[2]
        );
      }
      if (dirty & /*className*/
      8) {
        attr(
          svg,
          "class",
          /*className*/
          ctx2[3]
        );
      }
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      1)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[0]
        );
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      mounted = false;
      dispose();
    }
  };
}
function instance$k($$self, $$props, $$invalidate) {
  let { use = [] } = $$props;
  let { size: size2 = 25 } = $$props;
  let { color = "blue" } = $$props;
  let { class: className = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("use" in $$props2)
      $$invalidate(0, use = $$props2.use);
    if ("size" in $$props2)
      $$invalidate(1, size2 = $$props2.size);
    if ("color" in $$props2)
      $$invalidate(2, color = $$props2.color);
    if ("class" in $$props2)
      $$invalidate(3, className = $$props2.class);
  };
  return [use, size2, color, className];
}
class Circle extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$k, create_fragment$k, safe_not_equal, { use: 0, size: 1, color: 2, class: 3 });
  }
}
const Circle$1 = Circle;
function create_fragment$j(ctx) {
  let svg;
  let rect0;
  let animate0;
  let animate1;
  let rect1;
  let animate2;
  let animate3;
  let rect2;
  let animate4;
  let animate5;
  let rect3;
  let animate6;
  let animate7;
  let rect4;
  let animate8;
  let animate9;
  let svg_width_value;
  let useActions_action;
  let mounted;
  let dispose;
  return {
    c() {
      svg = svg_element("svg");
      rect0 = svg_element("rect");
      animate0 = svg_element("animate");
      animate1 = svg_element("animate");
      rect1 = svg_element("rect");
      animate2 = svg_element("animate");
      animate3 = svg_element("animate");
      rect2 = svg_element("rect");
      animate4 = svg_element("animate");
      animate5 = svg_element("animate");
      rect3 = svg_element("rect");
      animate6 = svg_element("animate");
      animate7 = svg_element("animate");
      rect4 = svg_element("rect");
      animate8 = svg_element("animate");
      animate9 = svg_element("animate");
      attr(animate0, "attributeName", "height");
      attr(animate0, "begin", "0.5s");
      attr(animate0, "dur", "1s");
      attr(animate0, "values", "120;110;100;90;80;70;60;50;40;140;120");
      attr(animate0, "calcMode", "linear");
      attr(animate0, "repeatCount", "indefinite");
      attr(animate1, "attributeName", "y");
      attr(animate1, "begin", "0.5s");
      attr(animate1, "dur", "1s");
      attr(animate1, "values", "10;15;20;25;30;35;40;45;50;0;10");
      attr(animate1, "calcMode", "linear");
      attr(animate1, "repeatCount", "indefinite");
      attr(rect0, "y", "10");
      attr(rect0, "width", "15");
      attr(rect0, "height", "120");
      attr(rect0, "rx", "6");
      attr(animate2, "attributeName", "height");
      attr(animate2, "begin", "0.25s");
      attr(animate2, "dur", "1s");
      attr(animate2, "values", "120;110;100;90;80;70;60;50;40;140;120");
      attr(animate2, "calcMode", "linear");
      attr(animate2, "repeatCount", "indefinite");
      attr(animate3, "attributeName", "y");
      attr(animate3, "begin", "0.25s");
      attr(animate3, "dur", "1s");
      attr(animate3, "values", "10;15;20;25;30;35;40;45;50;0;10");
      attr(animate3, "calcMode", "linear");
      attr(animate3, "repeatCount", "indefinite");
      attr(rect1, "x", "30");
      attr(rect1, "y", "10");
      attr(rect1, "width", "15");
      attr(rect1, "height", "120");
      attr(rect1, "rx", "6");
      attr(animate4, "attributeName", "height");
      attr(animate4, "begin", "0s");
      attr(animate4, "dur", "1s");
      attr(animate4, "values", "120;110;100;90;80;70;60;50;40;140;120");
      attr(animate4, "calcMode", "linear");
      attr(animate4, "repeatCount", "indefinite");
      attr(animate5, "attributeName", "y");
      attr(animate5, "begin", "0s");
      attr(animate5, "dur", "1s");
      attr(animate5, "values", "10;15;20;25;30;35;40;45;50;0;10");
      attr(animate5, "calcMode", "linear");
      attr(animate5, "repeatCount", "indefinite");
      attr(rect2, "x", "60");
      attr(rect2, "width", "15");
      attr(rect2, "height", "140");
      attr(rect2, "rx", "6");
      attr(animate6, "attributeName", "height");
      attr(animate6, "begin", "0.25s");
      attr(animate6, "dur", "1s");
      attr(animate6, "values", "120;110;100;90;80;70;60;50;40;140;120");
      attr(animate6, "calcMode", "linear");
      attr(animate6, "repeatCount", "indefinite");
      attr(animate7, "attributeName", "y");
      attr(animate7, "begin", "0.25s");
      attr(animate7, "dur", "1s");
      attr(animate7, "values", "10;15;20;25;30;35;40;45;50;0;10");
      attr(animate7, "calcMode", "linear");
      attr(animate7, "repeatCount", "indefinite");
      attr(rect3, "x", "90");
      attr(rect3, "y", "10");
      attr(rect3, "width", "15");
      attr(rect3, "height", "120");
      attr(rect3, "rx", "6");
      attr(animate8, "attributeName", "height");
      attr(animate8, "begin", "0.5s");
      attr(animate8, "dur", "1s");
      attr(animate8, "values", "120;110;100;90;80;70;60;50;40;140;120");
      attr(animate8, "calcMode", "linear");
      attr(animate8, "repeatCount", "indefinite");
      attr(animate9, "attributeName", "y");
      attr(animate9, "begin", "0.5s");
      attr(animate9, "dur", "1s");
      attr(animate9, "values", "10;15;20;25;30;35;40;45;50;0;10");
      attr(animate9, "calcMode", "linear");
      attr(animate9, "repeatCount", "indefinite");
      attr(rect4, "x", "120");
      attr(rect4, "y", "10");
      attr(rect4, "width", "15");
      attr(rect4, "height", "120");
      attr(rect4, "rx", "6");
      attr(svg, "viewBox", "0 0 135 140");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(
        svg,
        "fill",
        /*color*/
        ctx[2]
      );
      attr(svg, "width", svg_width_value = `${/*size*/
      ctx[1]}px`);
      attr(
        svg,
        "class",
        /*className*/
        ctx[3]
      );
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, rect0);
      append(rect0, animate0);
      append(rect0, animate1);
      append(svg, rect1);
      append(rect1, animate2);
      append(rect1, animate3);
      append(svg, rect2);
      append(rect2, animate4);
      append(rect2, animate5);
      append(svg, rect3);
      append(rect3, animate6);
      append(rect3, animate7);
      append(svg, rect4);
      append(rect4, animate8);
      append(rect4, animate9);
      if (!mounted) {
        dispose = action_destroyer(useActions_action = useActions.call(
          null,
          svg,
          /*use*/
          ctx[0]
        ));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*color*/
      4) {
        attr(
          svg,
          "fill",
          /*color*/
          ctx2[2]
        );
      }
      if (dirty & /*size*/
      2 && svg_width_value !== (svg_width_value = `${/*size*/
      ctx2[1]}px`)) {
        attr(svg, "width", svg_width_value);
      }
      if (dirty & /*className*/
      8) {
        attr(
          svg,
          "class",
          /*className*/
          ctx2[3]
        );
      }
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      1)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[0]
        );
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      mounted = false;
      dispose();
    }
  };
}
function instance$j($$self, $$props, $$invalidate) {
  let { use = [] } = $$props;
  let { size: size2 = 25 } = $$props;
  let { color = "blue" } = $$props;
  let { class: className = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("use" in $$props2)
      $$invalidate(0, use = $$props2.use);
    if ("size" in $$props2)
      $$invalidate(1, size2 = $$props2.size);
    if ("color" in $$props2)
      $$invalidate(2, color = $$props2.color);
    if ("class" in $$props2)
      $$invalidate(3, className = $$props2.class);
  };
  return [use, size2, color, className];
}
class Bars extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$j, safe_not_equal, { use: 0, size: 1, color: 2, class: 3 });
  }
}
const Bars$1 = Bars;
function create_fragment$i(ctx) {
  let svg;
  let circle0;
  let animate0;
  let animate1;
  let circle1;
  let animate2;
  let animate3;
  let circle2;
  let animate4;
  let animate5;
  let svg_width_value;
  let svg_height_value;
  let useActions_action;
  let mounted;
  let dispose;
  return {
    c() {
      svg = svg_element("svg");
      circle0 = svg_element("circle");
      animate0 = svg_element("animate");
      animate1 = svg_element("animate");
      circle1 = svg_element("circle");
      animate2 = svg_element("animate");
      animate3 = svg_element("animate");
      circle2 = svg_element("circle");
      animate4 = svg_element("animate");
      animate5 = svg_element("animate");
      attr(animate0, "attributeName", "r");
      attr(animate0, "from", "15");
      attr(animate0, "to", "15");
      attr(animate0, "begin", "0s");
      attr(animate0, "dur", "0.8s");
      attr(animate0, "values", "15;9;15");
      attr(animate0, "calcMode", "linear");
      attr(animate0, "repeatCount", "indefinite");
      attr(animate1, "attributeName", "fill-opacity");
      attr(animate1, "from", "1");
      attr(animate1, "to", "1");
      attr(animate1, "begin", "0s");
      attr(animate1, "dur", "0.8s");
      attr(animate1, "values", "1;.5;1");
      attr(animate1, "calcMode", "linear");
      attr(animate1, "repeatCount", "indefinite");
      attr(circle0, "cx", "15");
      attr(circle0, "cy", "15");
      attr(circle0, "r", "15");
      attr(animate2, "attributeName", "r");
      attr(animate2, "from", "9");
      attr(animate2, "to", "9");
      attr(animate2, "begin", "0s");
      attr(animate2, "dur", "0.8s");
      attr(animate2, "values", "9;15;9");
      attr(animate2, "calcMode", "linear");
      attr(animate2, "repeatCount", "indefinite");
      attr(animate3, "attributeName", "fill-opacity");
      attr(animate3, "from", "0.5");
      attr(animate3, "to", "0.5");
      attr(animate3, "begin", "0s");
      attr(animate3, "dur", "0.8s");
      attr(animate3, "values", ".5;1;.5");
      attr(animate3, "calcMode", "linear");
      attr(animate3, "repeatCount", "indefinite");
      attr(circle1, "cx", "60");
      attr(circle1, "cy", "15");
      attr(circle1, "r", "9");
      attr(circle1, "fill-opacity", "0.3");
      attr(animate4, "attributeName", "r");
      attr(animate4, "from", "15");
      attr(animate4, "to", "15");
      attr(animate4, "begin", "0s");
      attr(animate4, "dur", "0.8s");
      attr(animate4, "values", "15;9;15");
      attr(animate4, "calcMode", "linear");
      attr(animate4, "repeatCount", "indefinite");
      attr(animate5, "attributeName", "fill-opacity");
      attr(animate5, "from", "1");
      attr(animate5, "to", "1");
      attr(animate5, "begin", "0s");
      attr(animate5, "dur", "0.8s");
      attr(animate5, "values", "1;.5;1");
      attr(animate5, "calcMode", "linear");
      attr(animate5, "repeatCount", "indefinite");
      attr(circle2, "cx", "105");
      attr(circle2, "cy", "15");
      attr(circle2, "r", "15");
      attr(svg, "width", svg_width_value = `${/*size*/
      ctx[1]}px`);
      attr(svg, "height", svg_height_value = `${Number(
        /*size*/
        ctx[1]
      ) / 4}px`);
      attr(svg, "viewBox", "0 0 120 30");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(
        svg,
        "fill",
        /*color*/
        ctx[2]
      );
      attr(
        svg,
        "class",
        /*className*/
        ctx[3]
      );
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, circle0);
      append(circle0, animate0);
      append(circle0, animate1);
      append(svg, circle1);
      append(circle1, animate2);
      append(circle1, animate3);
      append(svg, circle2);
      append(circle2, animate4);
      append(circle2, animate5);
      if (!mounted) {
        dispose = action_destroyer(useActions_action = useActions.call(
          null,
          svg,
          /*use*/
          ctx[0]
        ));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*size*/
      2 && svg_width_value !== (svg_width_value = `${/*size*/
      ctx2[1]}px`)) {
        attr(svg, "width", svg_width_value);
      }
      if (dirty & /*size*/
      2 && svg_height_value !== (svg_height_value = `${Number(
        /*size*/
        ctx2[1]
      ) / 4}px`)) {
        attr(svg, "height", svg_height_value);
      }
      if (dirty & /*color*/
      4) {
        attr(
          svg,
          "fill",
          /*color*/
          ctx2[2]
        );
      }
      if (dirty & /*className*/
      8) {
        attr(
          svg,
          "class",
          /*className*/
          ctx2[3]
        );
      }
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      1)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[0]
        );
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      mounted = false;
      dispose();
    }
  };
}
function instance$i($$self, $$props, $$invalidate) {
  let { use = [] } = $$props;
  let { size: size2 = 25 } = $$props;
  let { color = "blue" } = $$props;
  let { class: className = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("use" in $$props2)
      $$invalidate(0, use = $$props2.use);
    if ("size" in $$props2)
      $$invalidate(1, size2 = $$props2.size);
    if ("color" in $$props2)
      $$invalidate(2, color = $$props2.color);
    if ("class" in $$props2)
      $$invalidate(3, className = $$props2.class);
  };
  return [use, size2, color, className];
}
class Dots extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$i, safe_not_equal, { use: 0, size: 1, color: 2, class: 3 });
  }
}
const Dots$1 = Dots;
const LOADER_SIZES = {
  xs: 18,
  sm: 22,
  md: 36,
  lg: 44,
  xl: 58
};
const getCorrectShade = (color, dark2 = false) => {
  return theme.colors[dark2 ? `${color}400` : `${color}600`].value;
};
function create_fragment$h(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      use: [
        /*forwardEvents*/
        ctx[5],
        [
          useActions,
          /*use*/
          ctx[1]
        ]
      ]
    },
    {
      color: (
        /*color*/
        ctx[4] === "white" ? "white" : getCorrectShade(
          /*color*/
          ctx[4]
        )
      )
    },
    {
      size: LOADER_SIZES[
        /*size*/
        ctx[3]
      ] || /*size*/
      ctx[3]
    },
    { class: (
      /*className*/
      ctx[2]
    ) },
    /*$$restProps*/
    ctx[8]
  ];
  var switch_value = (
    /*LOADERS*/
    ctx[6][
      /*defaultLoader*/
      ctx[7]
    ]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    if (dirty !== void 0 && dirty & /*forwardEvents, use, color, size, className, $$restProps*/
    318) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [
        dirty & /*forwardEvents, use*/
        34 && {
          use: [
            /*forwardEvents*/
            ctx2[5],
            [
              useActions,
              /*use*/
              ctx2[1]
            ]
          ]
        },
        dirty & /*color*/
        16 && {
          color: (
            /*color*/
            ctx2[4] === "white" ? "white" : getCorrectShade(
              /*color*/
              ctx2[4]
            )
          )
        },
        dirty & /*size*/
        8 && {
          size: LOADER_SIZES[
            /*size*/
            ctx2[3]
          ] || /*size*/
          ctx2[3]
        },
        dirty & /*className*/
        4 && { class: (
          /*className*/
          ctx2[2]
        ) },
        dirty & /*$$restProps*/
        256 && get_spread_object(
          /*$$restProps*/
          ctx2[8]
        )
      ]);
    } else {
      for (let i2 = 0; i2 < switch_instance_spread_levels.length; i2 += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i2]);
      }
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    ctx[10](switch_instance);
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (switch_value !== (switch_value = /*LOADERS*/
      ctx2[6][
        /*defaultLoader*/
        ctx2[7]
      ])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          ctx2[10](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*forwardEvents, use, color, size, className, $$restProps*/
        318 ? get_spread_update(switch_instance_spread_levels, [
          dirty & /*forwardEvents, use*/
          34 && {
            use: [
              /*forwardEvents*/
              ctx2[5],
              [
                useActions,
                /*use*/
                ctx2[1]
              ]
            ]
          },
          dirty & /*color*/
          16 && {
            color: (
              /*color*/
              ctx2[4] === "white" ? "white" : getCorrectShade(
                /*color*/
                ctx2[4]
              )
            )
          },
          dirty & /*size*/
          8 && {
            size: LOADER_SIZES[
              /*size*/
              ctx2[3]
            ] || /*size*/
            ctx2[3]
          },
          dirty & /*className*/
          4 && { class: (
            /*className*/
            ctx2[2]
          ) },
          dirty & /*$$restProps*/
          256 && get_spread_object(
            /*$$restProps*/
            ctx2[8]
          )
        ]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      ctx[10](null);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "element", "class", "size", "color", "variant"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { use = [], element: element2 = void 0, class: className = "", size: size2 = "md", color = "blue", variant: variant2 = "circle" } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  const LOADERS = { bars: Bars$1, circle: Circle$1, dots: Dots$1 };
  const defaultLoader = variant2 in LOADERS ? variant2 : "circle";
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("size" in $$new_props)
      $$invalidate(3, size2 = $$new_props.size);
    if ("color" in $$new_props)
      $$invalidate(4, color = $$new_props.color);
    if ("variant" in $$new_props)
      $$invalidate(9, variant2 = $$new_props.variant);
  };
  return [
    element2,
    use,
    className,
    size2,
    color,
    forwardEvents,
    LOADERS,
    defaultLoader,
    $$restProps,
    variant2,
    switch_instance_binding
  ];
}
class Loader extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$h, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      size: 3,
      color: 4,
      variant: 9
    });
  }
}
const Loader$1 = Loader;
function create_fragment$g(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "ripple svelte-3pkhve");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[4](div);
    },
    p: noop$2,
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[4](null);
    }
  };
}
function isTouchEvent(e) {
  return e.constructor.name === "TouchEvent";
}
function transform(el, value) {
  el.style["transform"] = value;
  el.style["webkitTransform"] = value;
}
function opacity(el, value) {
  el.style["opacity"] = value.toString();
}
const calculate = (e, el) => {
  const offset = el.getBoundingClientRect();
  const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
  const localX = target.clientX - offset.left;
  const localY = target.clientY - offset.top;
  let radius2 = 0;
  let scale = 0.3;
  const center = el.dataset.center;
  const circle = el.dataset.circle;
  if (circle) {
    scale = 0.15;
    radius2 = el.clientWidth / 2;
    radius2 = center ? radius2 : radius2 + Math.sqrt((localX - radius2) ** 2 + (localY - radius2) ** 2) / 4;
  } else {
    radius2 = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
  }
  const centerX = `${(el.clientWidth - radius2 * 2) / 2}px`;
  const centerY = `${(el.clientHeight - radius2 * 2) / 2}px`;
  const x2 = center ? centerX : `${localX - radius2}px`;
  const y2 = center ? centerY : `${localY - radius2}px`;
  return { radius: radius2, scale, x: x2, y: y2, centerX, centerY };
};
const startRipple = function(eventType, event) {
  const hideEvents = ["touchcancel", "mouseleave", "dragstart"];
  let container = event.currentTarget || event.target;
  if (container && !container.classList.contains("ripple")) {
    container = container.querySelector(".ripple");
  }
  if (!container) {
    return;
  }
  const prev = container.dataset.event;
  if (prev && prev !== eventType) {
    return;
  }
  container.dataset.event = eventType;
  const wave = document.createElement("span");
  const { radius: radius2, scale, x: x2, y: y2, centerX, centerY } = calculate(event, container);
  const color = container.dataset.color;
  const size2 = `${radius2 * 2}px`;
  wave.className = "animation";
  wave.style.width = size2;
  wave.style.height = size2;
  wave.style.background = color;
  wave.classList.add("animation-enter");
  wave.classList.add("animation--visible");
  transform(wave, `translate(${x2}, ${y2}) scale3d(${scale},${scale},${scale})`);
  opacity(wave, 0);
  wave.dataset.activated = String(performance.now());
  container.appendChild(wave);
  setTimeout(
    () => {
      wave.classList.remove("animation-enter");
      wave.classList.add("animation-in");
      transform(wave, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
      opacity(wave, 0.25);
    },
    0
  );
  const releaseEvent = eventType === "mousedown" ? "mouseup" : "touchend";
  const onRelease = function() {
    document.removeEventListener(releaseEvent, onRelease);
    hideEvents.forEach((name) => {
      document.removeEventListener(name, onRelease);
    });
    const diff = performance.now() - Number(wave.dataset.activated);
    const delay = Math.max(250 - diff, 0);
    setTimeout(
      () => {
        wave.classList.remove("animation-in");
        wave.classList.add("animation-out");
        opacity(wave, 0);
        setTimeout(
          () => {
            wave && container.removeChild(wave);
            if (container.children.length === 0) {
              delete container.dataset.event;
            }
          },
          300
        );
      },
      delay
    );
  };
  document.addEventListener(releaseEvent, onRelease);
  hideEvents.forEach((name) => {
    document.addEventListener(name, onRelease, { passive: true });
  });
};
const onMouseDown = function(e) {
  if (e.button === 0) {
    startRipple(e.type, e);
  }
};
const onTouchStart = function(e) {
  if (e.changedTouches) {
    for (let i2 = 0; i2 < e.changedTouches.length; ++i2) {
      startRipple(e.type, e.changedTouches[i2]);
    }
  }
};
function instance$g($$self, $$props, $$invalidate) {
  let { center = false } = $$props;
  let { circle = false } = $$props;
  let { color = "currentColor" } = $$props;
  let el;
  let trigEl;
  onMount(async () => {
    await tick();
    try {
      if (center) {
        $$invalidate(0, el.dataset.center = "true", el);
      }
      if (circle) {
        $$invalidate(0, el.dataset.circle = "true", el);
      }
      $$invalidate(0, el.dataset.color = color, el);
      trigEl = el.parentElement;
    } catch (err) {
    }
    if (!trigEl) {
      console.error("Ripple: Trigger element not found.");
      return;
    }
    let style2 = window.getComputedStyle(trigEl);
    if (style2.position.length === 0 || style2.position === "static") {
      trigEl.style.position = "relative";
    }
    trigEl.addEventListener("touchstart", onTouchStart, { passive: true });
    trigEl.addEventListener("mousedown", onMouseDown, { passive: true });
  });
  onDestroy(() => {
    if (!trigEl) {
      return;
    }
    trigEl.removeEventListener("mousedown", onMouseDown);
    trigEl.removeEventListener("touchstart", onTouchStart);
  });
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      el = $$value;
      $$invalidate(0, el);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("center" in $$props2)
      $$invalidate(1, center = $$props2.center);
    if ("circle" in $$props2)
      $$invalidate(2, circle = $$props2.circle);
    if ("color" in $$props2)
      $$invalidate(3, color = $$props2.color);
  };
  return [el, center, circle, color, div_binding];
}
class Ripple extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$g, safe_not_equal, { center: 1, circle: 2, color: 3 });
  }
}
const get_rightIcon_slot_changes_1 = (dirty) => ({});
const get_rightIcon_slot_context_1 = (ctx) => ({});
const get_leftIcon_slot_changes_1 = (dirty) => ({});
const get_leftIcon_slot_context_1 = (ctx) => ({});
const get_rightIcon_slot_changes = (dirty) => ({});
const get_rightIcon_slot_context = (ctx) => ({});
const get_leftIcon_slot_changes = (dirty) => ({});
const get_leftIcon_slot_context = (ctx) => ({});
function create_else_block$1(ctx) {
  let button;
  let current_block_type_index;
  let if_block0;
  let t0;
  let t1;
  let t2;
  let current_block_type_index_1;
  let if_block2;
  let button_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_9, create_if_block_10];
  const if_blocks = [];
  function select_block_type_3(ctx2, dirty) {
    if (
      /*loading*/
      ctx2[11] && /*loaderPosition*/
      ctx2[5] === "left"
    )
      return 0;
    if (
      /*$$slots*/
      ctx2[21].leftIcon
    )
      return 1;
    return -1;
  }
  if (~(current_block_type_index = select_block_type_3(ctx))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  const default_slot_template = (
    /*#slots*/
    ctx[28].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    null
  );
  const default_slot_or_fallback = default_slot || fallback_block_4();
  let if_block1 = (
    /*ripple*/
    ctx[13] && create_if_block_8()
  );
  const if_block_creators_1 = [create_if_block_6, create_if_block_7];
  const if_blocks_1 = [];
  function select_block_type_4(ctx2, dirty) {
    if (
      /*loading*/
      ctx2[11] && /*loaderPosition*/
      ctx2[5] === "right"
    )
      return 0;
    if (
      /*$$slots*/
      ctx2[21].rightIcon
    )
      return 1;
    return -1;
  }
  if (~(current_block_type_index_1 = select_block_type_4(ctx))) {
    if_block2 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
  }
  let button_levels = [
    {
      class: button_class_value = /*cx*/
      ctx[18](
        /*className*/
        ctx[3],
        /*classes*/
        ctx[17].root,
        /*getStyles*/
        ctx[16]({
          css: (
            /*override*/
            ctx[1]
          ),
          variation: (
            /*variant*/
            ctx[4]
          )
        }),
        {
          [
            /*classes*/
            ctx[17].disabled
          ]: (
            /*disabled*/
            ctx[9]
          ),
          [
            /*classes*/
            ctx[17].loading
          ]: (
            /*loading*/
            ctx[11]
          )
        }
      )
    },
    { disabled: (
      /*disabled*/
      ctx[9]
    ) },
    /*$$restProps*/
    ctx[20],
    { tabindex: "0" }
  ];
  let button_data = {};
  for (let i2 = 0; i2 < button_levels.length; i2 += 1) {
    button_data = assign(button_data, button_levels[i2]);
  }
  return {
    c() {
      button = element("button");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (default_slot_or_fallback)
        default_slot_or_fallback.c();
      t1 = space();
      if (if_block1)
        if_block1.c();
      t2 = space();
      if (if_block2)
        if_block2.c();
      set_attributes(button, button_data);
      toggle_class(
        button,
        "compact",
        /*compact*/
        ctx[10]
      );
      toggle_class(
        button,
        "uppercase",
        /*uppercase*/
        ctx[12]
      );
      toggle_class(button, "svelte-5xpm5q", true);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(button, null);
      }
      append(button, t0);
      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(button, null);
      }
      append(button, t1);
      if (if_block1)
        if_block1.m(button, null);
      append(button, t2);
      if (~current_block_type_index_1) {
        if_blocks_1[current_block_type_index_1].m(button, null);
      }
      if (button.autofocus)
        button.focus();
      ctx[30](button);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(
            null,
            button,
            /*use*/
            ctx[2]
          )),
          action_destroyer(
            /*forwardEvents*/
            ctx[19].call(null, button)
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_3(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(button, t0);
        } else {
          if_block0 = null;
        }
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (
        /*ripple*/
        ctx2[13]
      ) {
        if (if_block1) {
          if (dirty & /*ripple*/
          8192) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_8();
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(button, t2);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      let previous_block_index_1 = current_block_type_index_1;
      current_block_type_index_1 = select_block_type_4(ctx2);
      if (current_block_type_index_1 === previous_block_index_1) {
        if (~current_block_type_index_1) {
          if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
        }
      } else {
        if (if_block2) {
          group_outros();
          transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
            if_blocks_1[previous_block_index_1] = null;
          });
          check_outros();
        }
        if (~current_block_type_index_1) {
          if_block2 = if_blocks_1[current_block_type_index_1];
          if (!if_block2) {
            if_block2 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
            if_block2.c();
          } else {
            if_block2.p(ctx2, dirty);
          }
          transition_in(if_block2, 1);
          if_block2.m(button, null);
        } else {
          if_block2 = null;
        }
      }
      set_attributes(button, button_data = get_spread_update(button_levels, [
        (!current || dirty & /*cx, className, classes, getStyles, override, variant, disabled, loading*/
        461338 && button_class_value !== (button_class_value = /*cx*/
        ctx2[18](
          /*className*/
          ctx2[3],
          /*classes*/
          ctx2[17].root,
          /*getStyles*/
          ctx2[16]({
            css: (
              /*override*/
              ctx2[1]
            ),
            variation: (
              /*variant*/
              ctx2[4]
            )
          }),
          {
            [
              /*classes*/
              ctx2[17].disabled
            ]: (
              /*disabled*/
              ctx2[9]
            ),
            [
              /*classes*/
              ctx2[17].loading
            ]: (
              /*loading*/
              ctx2[11]
            )
          }
        ))) && { class: button_class_value },
        (!current || dirty & /*disabled*/
        512) && { disabled: (
          /*disabled*/
          ctx2[9]
        ) },
        dirty & /*$$restProps*/
        1048576 && /*$$restProps*/
        ctx2[20],
        { tabindex: "0" }
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      4)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[2]
        );
      toggle_class(
        button,
        "compact",
        /*compact*/
        ctx2[10]
      );
      toggle_class(
        button,
        "uppercase",
        /*uppercase*/
        ctx2[12]
      );
      toggle_class(button, "svelte-5xpm5q", true);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(default_slot_or_fallback, local);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(default_slot_or_fallback, local);
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      if (default_slot_or_fallback)
        default_slot_or_fallback.d(detaching);
      if (if_block1)
        if_block1.d();
      if (~current_block_type_index_1) {
        if_blocks_1[current_block_type_index_1].d();
      }
      ctx[30](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$6(ctx) {
  let a2;
  let current_block_type_index;
  let if_block0;
  let t0;
  let t1;
  let t2;
  let current_block_type_index_1;
  let if_block2;
  let a_class_value;
  let a_target_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_4$1, create_if_block_5$1];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (
      /*loading*/
      ctx2[11] && /*loaderPosition*/
      ctx2[5] === "left"
    )
      return 0;
    if (
      /*$$slots*/
      ctx2[21].leftIcon
    )
      return 1;
    return -1;
  }
  if (~(current_block_type_index = select_block_type_1(ctx))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  const default_slot_template = (
    /*#slots*/
    ctx[28].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    null
  );
  const default_slot_or_fallback = default_slot || fallback_block_1();
  let if_block1 = (
    /*ripple*/
    ctx[13] && create_if_block_3$1()
  );
  const if_block_creators_1 = [create_if_block_1$4, create_if_block_2$3];
  const if_blocks_1 = [];
  function select_block_type_2(ctx2, dirty) {
    if (
      /*loading*/
      ctx2[11] && /*loaderPosition*/
      ctx2[5] === "right"
    )
      return 0;
    if (
      /*$$slots*/
      ctx2[21].rightIcon
    )
      return 1;
    return -1;
  }
  if (~(current_block_type_index_1 = select_block_type_2(ctx))) {
    if_block2 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
  }
  let a_levels = [
    { href: (
      /*href*/
      ctx[7]
    ) },
    {
      class: a_class_value = /*cx*/
      ctx[18](
        /*className*/
        ctx[3],
        /*classes*/
        ctx[17].root,
        /*getStyles*/
        ctx[16]({
          css: (
            /*override*/
            ctx[1]
          ),
          variation: (
            /*variant*/
            ctx[4]
          ),
          disabled: (
            /*disabled*/
            ctx[9]
          )
        }),
        {
          [
            /*classes*/
            ctx[17].disabled
          ]: (
            /*disabled*/
            ctx[9]
          ),
          [
            /*classes*/
            ctx[17].loading
          ]: (
            /*loading*/
            ctx[11]
          )
        }
      )
    },
    { role: "button" },
    { rel: "noreferrer noopener" },
    {
      target: a_target_value = /*external*/
      ctx[8] ? "_blank" : "_self"
    },
    /*$$restProps*/
    ctx[20],
    { tabindex: "0" }
  ];
  let a_data = {};
  for (let i2 = 0; i2 < a_levels.length; i2 += 1) {
    a_data = assign(a_data, a_levels[i2]);
  }
  return {
    c() {
      a2 = element("a");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (default_slot_or_fallback)
        default_slot_or_fallback.c();
      t1 = space();
      if (if_block1)
        if_block1.c();
      t2 = space();
      if (if_block2)
        if_block2.c();
      set_attributes(a2, a_data);
      toggle_class(
        a2,
        "compact",
        /*compact*/
        ctx[10]
      );
      toggle_class(
        a2,
        "uppercase",
        /*uppercase*/
        ctx[12]
      );
      toggle_class(a2, "svelte-5xpm5q", true);
    },
    m(target, anchor) {
      insert(target, a2, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(a2, null);
      }
      append(a2, t0);
      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(a2, null);
      }
      append(a2, t1);
      if (if_block1)
        if_block1.m(a2, null);
      append(a2, t2);
      if (~current_block_type_index_1) {
        if_blocks_1[current_block_type_index_1].m(a2, null);
      }
      ctx[29](a2);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(
            null,
            a2,
            /*use*/
            ctx[2]
          )),
          action_destroyer(
            /*forwardEvents*/
            ctx[19].call(null, a2)
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(a2, t0);
        } else {
          if_block0 = null;
        }
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (
        /*ripple*/
        ctx2[13]
      ) {
        if (if_block1) {
          if (dirty & /*ripple*/
          8192) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_3$1();
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(a2, t2);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      let previous_block_index_1 = current_block_type_index_1;
      current_block_type_index_1 = select_block_type_2(ctx2);
      if (current_block_type_index_1 === previous_block_index_1) {
        if (~current_block_type_index_1) {
          if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
        }
      } else {
        if (if_block2) {
          group_outros();
          transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
            if_blocks_1[previous_block_index_1] = null;
          });
          check_outros();
        }
        if (~current_block_type_index_1) {
          if_block2 = if_blocks_1[current_block_type_index_1];
          if (!if_block2) {
            if_block2 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
            if_block2.c();
          } else {
            if_block2.p(ctx2, dirty);
          }
          transition_in(if_block2, 1);
          if_block2.m(a2, null);
        } else {
          if_block2 = null;
        }
      }
      set_attributes(a2, a_data = get_spread_update(a_levels, [
        (!current || dirty & /*href*/
        128) && { href: (
          /*href*/
          ctx2[7]
        ) },
        (!current || dirty & /*cx, className, classes, getStyles, override, variant, disabled, loading*/
        461338 && a_class_value !== (a_class_value = /*cx*/
        ctx2[18](
          /*className*/
          ctx2[3],
          /*classes*/
          ctx2[17].root,
          /*getStyles*/
          ctx2[16]({
            css: (
              /*override*/
              ctx2[1]
            ),
            variation: (
              /*variant*/
              ctx2[4]
            ),
            disabled: (
              /*disabled*/
              ctx2[9]
            )
          }),
          {
            [
              /*classes*/
              ctx2[17].disabled
            ]: (
              /*disabled*/
              ctx2[9]
            ),
            [
              /*classes*/
              ctx2[17].loading
            ]: (
              /*loading*/
              ctx2[11]
            )
          }
        ))) && { class: a_class_value },
        { role: "button" },
        { rel: "noreferrer noopener" },
        (!current || dirty & /*external*/
        256 && a_target_value !== (a_target_value = /*external*/
        ctx2[8] ? "_blank" : "_self")) && { target: a_target_value },
        dirty & /*$$restProps*/
        1048576 && /*$$restProps*/
        ctx2[20],
        { tabindex: "0" }
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      4)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[2]
        );
      toggle_class(
        a2,
        "compact",
        /*compact*/
        ctx2[10]
      );
      toggle_class(
        a2,
        "uppercase",
        /*uppercase*/
        ctx2[12]
      );
      toggle_class(a2, "svelte-5xpm5q", true);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(default_slot_or_fallback, local);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(default_slot_or_fallback, local);
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(a2);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      if (default_slot_or_fallback)
        default_slot_or_fallback.d(detaching);
      if (if_block1)
        if_block1.d();
      if (~current_block_type_index_1) {
        if_blocks_1[current_block_type_index_1].d();
      }
      ctx[29](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_10(ctx) {
  let span;
  let current;
  const leftIcon_slot_template = (
    /*#slots*/
    ctx[28].leftIcon
  );
  const leftIcon_slot = create_slot(
    leftIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    get_leftIcon_slot_context_1
  );
  const leftIcon_slot_or_fallback = leftIcon_slot || fallback_block_5();
  return {
    c() {
      span = element("span");
      if (leftIcon_slot_or_fallback)
        leftIcon_slot_or_fallback.c();
      attr(span, "class", "left-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (leftIcon_slot_or_fallback) {
        leftIcon_slot_or_fallback.m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (leftIcon_slot) {
        if (leftIcon_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            leftIcon_slot,
            leftIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              leftIcon_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              get_leftIcon_slot_changes_1
            ),
            get_leftIcon_slot_context_1
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(leftIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(leftIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (leftIcon_slot_or_fallback)
        leftIcon_slot_or_fallback.d(detaching);
    }
  };
}
function create_if_block_9(ctx) {
  let span;
  let loader;
  let current;
  loader = new Loader$1({
    props: {
      variant: (
        /*loaderProps*/
        ctx[6].variant
      ),
      size: (
        /*loaderProps*/
        ctx[6].size
      ),
      color: (
        /*loaderProps*/
        ctx[6].color
      )
    }
  });
  return {
    c() {
      span = element("span");
      create_component(loader.$$.fragment);
      attr(span, "class", "left-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      mount_component(loader, span, null);
      current = true;
    },
    p(ctx2, dirty) {
      const loader_changes = {};
      if (dirty & /*loaderProps*/
      64)
        loader_changes.variant = /*loaderProps*/
        ctx2[6].variant;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.size = /*loaderProps*/
        ctx2[6].size;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.color = /*loaderProps*/
        ctx2[6].color;
      loader.$set(loader_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(loader.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loader.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      destroy_component(loader);
    }
  };
}
function fallback_block_5(ctx) {
  let t2;
  return {
    c() {
      t2 = text("X");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function fallback_block_4(ctx) {
  let t2;
  return {
    c() {
      t2 = text("Button");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_if_block_8(ctx) {
  let ripple_1;
  let current;
  ripple_1 = new Ripple({ props: { center: false, circle: false } });
  return {
    c() {
      create_component(ripple_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(ripple_1, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(ripple_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(ripple_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(ripple_1, detaching);
    }
  };
}
function create_if_block_7(ctx) {
  let span;
  let current;
  const rightIcon_slot_template = (
    /*#slots*/
    ctx[28].rightIcon
  );
  const rightIcon_slot = create_slot(
    rightIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    get_rightIcon_slot_context_1
  );
  const rightIcon_slot_or_fallback = rightIcon_slot || fallback_block_3();
  return {
    c() {
      span = element("span");
      if (rightIcon_slot_or_fallback)
        rightIcon_slot_or_fallback.c();
      attr(span, "class", "right-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (rightIcon_slot_or_fallback) {
        rightIcon_slot_or_fallback.m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (rightIcon_slot) {
        if (rightIcon_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            rightIcon_slot,
            rightIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              rightIcon_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              get_rightIcon_slot_changes_1
            ),
            get_rightIcon_slot_context_1
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(rightIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(rightIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (rightIcon_slot_or_fallback)
        rightIcon_slot_or_fallback.d(detaching);
    }
  };
}
function create_if_block_6(ctx) {
  let span;
  let loader;
  let current;
  loader = new Loader$1({
    props: {
      variant: (
        /*loaderProps*/
        ctx[6].variant
      ),
      size: (
        /*loaderProps*/
        ctx[6].size
      ),
      color: (
        /*loaderProps*/
        ctx[6].color
      )
    }
  });
  return {
    c() {
      span = element("span");
      create_component(loader.$$.fragment);
      attr(span, "class", "right-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      mount_component(loader, span, null);
      current = true;
    },
    p(ctx2, dirty) {
      const loader_changes = {};
      if (dirty & /*loaderProps*/
      64)
        loader_changes.variant = /*loaderProps*/
        ctx2[6].variant;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.size = /*loaderProps*/
        ctx2[6].size;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.color = /*loaderProps*/
        ctx2[6].color;
      loader.$set(loader_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(loader.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loader.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      destroy_component(loader);
    }
  };
}
function fallback_block_3(ctx) {
  let t2;
  return {
    c() {
      t2 = text("X");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_if_block_5$1(ctx) {
  let span;
  let current;
  const leftIcon_slot_template = (
    /*#slots*/
    ctx[28].leftIcon
  );
  const leftIcon_slot = create_slot(
    leftIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    get_leftIcon_slot_context
  );
  const leftIcon_slot_or_fallback = leftIcon_slot || fallback_block_2();
  return {
    c() {
      span = element("span");
      if (leftIcon_slot_or_fallback)
        leftIcon_slot_or_fallback.c();
      attr(span, "class", "left-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (leftIcon_slot_or_fallback) {
        leftIcon_slot_or_fallback.m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (leftIcon_slot) {
        if (leftIcon_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            leftIcon_slot,
            leftIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              leftIcon_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              get_leftIcon_slot_changes
            ),
            get_leftIcon_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(leftIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(leftIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (leftIcon_slot_or_fallback)
        leftIcon_slot_or_fallback.d(detaching);
    }
  };
}
function create_if_block_4$1(ctx) {
  let span;
  let loader;
  let current;
  loader = new Loader$1({
    props: {
      variant: (
        /*loaderProps*/
        ctx[6].variant
      ),
      size: (
        /*loaderProps*/
        ctx[6].size
      ),
      color: (
        /*loaderProps*/
        ctx[6].color
      )
    }
  });
  return {
    c() {
      span = element("span");
      create_component(loader.$$.fragment);
      attr(span, "class", "left-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      mount_component(loader, span, null);
      current = true;
    },
    p(ctx2, dirty) {
      const loader_changes = {};
      if (dirty & /*loaderProps*/
      64)
        loader_changes.variant = /*loaderProps*/
        ctx2[6].variant;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.size = /*loaderProps*/
        ctx2[6].size;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.color = /*loaderProps*/
        ctx2[6].color;
      loader.$set(loader_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(loader.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loader.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      destroy_component(loader);
    }
  };
}
function fallback_block_2(ctx) {
  let t2;
  return {
    c() {
      t2 = text("X");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function fallback_block_1(ctx) {
  let t2;
  return {
    c() {
      t2 = text("Button");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_if_block_3$1(ctx) {
  let ripple_1;
  let current;
  ripple_1 = new Ripple({ props: { center: false, circle: false } });
  return {
    c() {
      create_component(ripple_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(ripple_1, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(ripple_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(ripple_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(ripple_1, detaching);
    }
  };
}
function create_if_block_2$3(ctx) {
  let span;
  let current;
  const rightIcon_slot_template = (
    /*#slots*/
    ctx[28].rightIcon
  );
  const rightIcon_slot = create_slot(
    rightIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    get_rightIcon_slot_context
  );
  const rightIcon_slot_or_fallback = rightIcon_slot || fallback_block$2();
  return {
    c() {
      span = element("span");
      if (rightIcon_slot_or_fallback)
        rightIcon_slot_or_fallback.c();
      attr(span, "class", "right-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (rightIcon_slot_or_fallback) {
        rightIcon_slot_or_fallback.m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (rightIcon_slot) {
        if (rightIcon_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            rightIcon_slot,
            rightIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              rightIcon_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              get_rightIcon_slot_changes
            ),
            get_rightIcon_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(rightIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(rightIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (rightIcon_slot_or_fallback)
        rightIcon_slot_or_fallback.d(detaching);
    }
  };
}
function create_if_block_1$4(ctx) {
  let span;
  let loader;
  let current;
  loader = new Loader$1({
    props: {
      variant: (
        /*loaderProps*/
        ctx[6].variant
      ),
      size: (
        /*loaderProps*/
        ctx[6].size
      ),
      color: (
        /*loaderProps*/
        ctx[6].color
      )
    }
  });
  return {
    c() {
      span = element("span");
      create_component(loader.$$.fragment);
      attr(span, "class", "right-section svelte-5xpm5q");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      mount_component(loader, span, null);
      current = true;
    },
    p(ctx2, dirty) {
      const loader_changes = {};
      if (dirty & /*loaderProps*/
      64)
        loader_changes.variant = /*loaderProps*/
        ctx2[6].variant;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.size = /*loaderProps*/
        ctx2[6].size;
      if (dirty & /*loaderProps*/
      64)
        loader_changes.color = /*loaderProps*/
        ctx2[6].color;
      loader.$set(loader_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(loader.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loader.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      destroy_component(loader);
    }
  };
}
function fallback_block$2(ctx) {
  let t2;
  return {
    c() {
      t2 = text("X");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_fragment$f(ctx) {
  let error;
  let t2;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  error = new Error$2({
    props: {
      observable: (
        /*observable*/
        ctx[14]
      ),
      component: "Button",
      code: (
        /*err*/
        ctx[15]
      )
    }
  });
  const if_block_creators = [create_if_block$6, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*href*/
      ctx2[7]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      create_component(error.$$.fragment);
      t2 = space();
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      mount_component(error, target, anchor);
      insert(target, t2, anchor);
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const error_changes = {};
      if (dirty & /*observable*/
      16384)
        error_changes.observable = /*observable*/
        ctx2[14];
      if (dirty & /*err*/
      32768)
        error_changes.code = /*err*/
        ctx2[15];
      error.$set(error_changes);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(error.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(error.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
        detach(if_block_anchor);
      }
      destroy_component(error, detaching);
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "override",
    "variant",
    "color",
    "size",
    "radius",
    "gradient",
    "loaderPosition",
    "loaderProps",
    "href",
    "external",
    "disabled",
    "compact",
    "loading",
    "uppercase",
    "fullSize",
    "ripple"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { use = [], element: element2 = void 0, class: className = "", override = {}, variant: variant2 = "filled", color = "blue", size: size2 = "sm", radius: radius2 = "sm", gradient = { from: "indigo", to: "cyan", deg: 45 }, loaderPosition = "left", loaderProps = {
    size: "xs",
    color: "white",
    variant: "circle"
  }, href = null, external = false, disabled = false, compact = false, loading = false, uppercase = false, fullSize = false, ripple = false } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  let observable = false;
  let err;
  if (disabled && loading) {
    observable = true;
    err = ButtonErrors[0];
  }
  if (external && typeof href !== "string" || (href == null ? void 0 : href.length) < 1) {
    observable = true;
    err = ButtonErrors[1];
  }
  function a_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  function button_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(20, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(2, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(1, override = $$new_props.override);
    if ("variant" in $$new_props)
      $$invalidate(4, variant2 = $$new_props.variant);
    if ("color" in $$new_props)
      $$invalidate(22, color = $$new_props.color);
    if ("size" in $$new_props)
      $$invalidate(23, size2 = $$new_props.size);
    if ("radius" in $$new_props)
      $$invalidate(24, radius2 = $$new_props.radius);
    if ("gradient" in $$new_props)
      $$invalidate(25, gradient = $$new_props.gradient);
    if ("loaderPosition" in $$new_props)
      $$invalidate(5, loaderPosition = $$new_props.loaderPosition);
    if ("loaderProps" in $$new_props)
      $$invalidate(6, loaderProps = $$new_props.loaderProps);
    if ("href" in $$new_props)
      $$invalidate(7, href = $$new_props.href);
    if ("external" in $$new_props)
      $$invalidate(8, external = $$new_props.external);
    if ("disabled" in $$new_props)
      $$invalidate(9, disabled = $$new_props.disabled);
    if ("compact" in $$new_props)
      $$invalidate(10, compact = $$new_props.compact);
    if ("loading" in $$new_props)
      $$invalidate(11, loading = $$new_props.loading);
    if ("uppercase" in $$new_props)
      $$invalidate(12, uppercase = $$new_props.uppercase);
    if ("fullSize" in $$new_props)
      $$invalidate(26, fullSize = $$new_props.fullSize);
    if ("ripple" in $$new_props)
      $$invalidate(13, ripple = $$new_props.ripple);
    if ("$$scope" in $$new_props)
      $$invalidate(27, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*observable*/
    16384) {
      if (observable)
        $$invalidate(1, override = { display: "none" });
    }
    if ($$self.$$.dirty & /*color, compact, fullSize, gradient, radius, size, variant*/
    130024464) {
      $$invalidate(
        18,
        { cx: cx2, classes, getStyles } = useStyles$9(
          {
            color,
            compact,
            fullSize,
            gradient,
            radius: radius2,
            size: size2,
            variant: variant2
          },
          { name: "Button" }
        ),
        cx2,
        ($$invalidate(17, classes), $$invalidate(22, color), $$invalidate(10, compact), $$invalidate(26, fullSize), $$invalidate(25, gradient), $$invalidate(24, radius2), $$invalidate(23, size2), $$invalidate(4, variant2)),
        ($$invalidate(16, getStyles), $$invalidate(22, color), $$invalidate(10, compact), $$invalidate(26, fullSize), $$invalidate(25, gradient), $$invalidate(24, radius2), $$invalidate(23, size2), $$invalidate(4, variant2))
      );
    }
  };
  return [
    element2,
    override,
    use,
    className,
    variant2,
    loaderPosition,
    loaderProps,
    href,
    external,
    disabled,
    compact,
    loading,
    uppercase,
    ripple,
    observable,
    err,
    getStyles,
    classes,
    cx2,
    forwardEvents,
    $$restProps,
    $$slots,
    color,
    size2,
    radius2,
    gradient,
    fullSize,
    $$scope,
    slots,
    a_binding,
    button_binding
  ];
}
class Button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {
      use: 2,
      element: 0,
      class: 3,
      override: 1,
      variant: 4,
      color: 22,
      size: 23,
      radius: 24,
      gradient: 25,
      loaderPosition: 5,
      loaderProps: 6,
      href: 7,
      external: 8,
      disabled: 9,
      compact: 10,
      loading: 11,
      uppercase: 12,
      fullSize: 26,
      ripple: 13
    });
  }
}
const useStyles$8 = createStyles((theme2, { iconSize }) => {
  return {
    root: {
      focusRing: "auto",
      position: "relative",
      appearance: "none",
      WebkitAppearance: "none",
      WebkitTapHighlightColor: "transparent",
      boxSizing: "border-box",
      height: `${theme2.fn.size({ size: iconSize, sizes: theme2.space })}px`,
      minHeight: `${theme2.fn.size({ size: iconSize, sizes: theme2.space })}px`,
      width: `${theme2.fn.size({ size: iconSize, sizes: theme2.space })}px`,
      minWidth: `${theme2.fn.size({ size: iconSize, sizes: theme2.space })}px`,
      padding: 0,
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      textDecoration: "none"
    },
    icon: {
      height: `${theme2.fn.size({ size: iconSize, sizes: theme2.space })}px`,
      minHeight: `${theme2.fn.size({ size: iconSize, sizes: theme2.space })}px`,
      position: "static",
      margin: 0,
      ml: 0,
      mr: 0,
      mt: 0,
      mb: 0
    }
  };
});
function create_if_block_1$3(ctx) {
  let if_block_anchor;
  let if_block = (
    /*icon*/
    (ctx[2] instanceof HTMLElement || /*icon*/
    ctx[2] instanceof SVGElement) && create_if_block_2$2(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (
        /*icon*/
        ctx2[2] instanceof HTMLElement || /*icon*/
        ctx2[2] instanceof SVGElement
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_2$2(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block$5(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      class: (
        /*cx*/
        ctx[6](
          /*className*/
          ctx[0],
          /*classes*/
          ctx[4].root,
          /*getStyles*/
          ctx[5]({ css: (
            /*override*/
            ctx[1]
          ) })
        )
      )
    },
    /*iconProps*/
    ctx[3]
  ];
  var switch_value = (
    /*icon*/
    ctx[2]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    if (dirty !== void 0 && dirty & /*cx, className, classes, getStyles, override, iconProps*/
    123) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [
        dirty & /*cx, className, classes, getStyles, override*/
        115 && {
          class: (
            /*cx*/
            ctx2[6](
              /*className*/
              ctx2[0],
              /*classes*/
              ctx2[4].root,
              /*getStyles*/
              ctx2[5]({ css: (
                /*override*/
                ctx2[1]
              ) })
            )
          )
        },
        dirty & /*iconProps*/
        8 && get_spread_object(
          /*iconProps*/
          ctx2[3]
        )
      ]);
    } else {
      for (let i2 = 0; i2 < switch_instance_spread_levels.length; i2 += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i2]);
      }
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*icon*/
      4 && switch_value !== (switch_value = /*icon*/
      ctx2[2])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*cx, className, classes, getStyles, override, iconProps*/
        123 ? get_spread_update(switch_instance_spread_levels, [
          dirty & /*cx, className, classes, getStyles, override*/
          115 && {
            class: (
              /*cx*/
              ctx2[6](
                /*className*/
                ctx2[0],
                /*classes*/
                ctx2[4].root,
                /*getStyles*/
                ctx2[5]({ css: (
                  /*override*/
                  ctx2[1]
                ) })
              )
            )
          },
          dirty & /*iconProps*/
          8 && get_spread_object(
            /*iconProps*/
            ctx2[3]
          )
        ]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_2$2(ctx) {
  let span;
  let raw_value = (
    /*icon*/
    ctx[2].outerHTML + ""
  );
  let span_class_value;
  return {
    c() {
      span = element("span");
      attr(span, "class", span_class_value = /*cx*/
      ctx[6](
        /*className*/
        ctx[0],
        /*classes*/
        ctx[4].root,
        /*getStyles*/
        ctx[5]({ css: (
          /*override*/
          ctx[1]
        ) })
      ));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      span.innerHTML = raw_value;
    },
    p(ctx2, dirty) {
      if (dirty & /*icon*/
      4 && raw_value !== (raw_value = /*icon*/
      ctx2[2].outerHTML + ""))
        span.innerHTML = raw_value;
      if (dirty & /*cx, className, classes, getStyles, override*/
      115 && span_class_value !== (span_class_value = /*cx*/
      ctx2[6](
        /*className*/
        ctx2[0],
        /*classes*/
        ctx2[4].root,
        /*getStyles*/
        ctx2[5]({ css: (
          /*override*/
          ctx2[1]
        ) })
      ))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_fragment$e(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$5, create_if_block_1$3];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (typeof /*icon*/
    ctx2[2] === "function")
      return 0;
    if (!/*requiresShim*/
    ctx2[7])
      return 1;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  let cx2;
  let getStyles;
  let classes;
  let { className = "", override = {}, icon = void 0, iconSize = 16, iconProps = {} } = $$props;
  const requiresShim = typeof HTMLElement === "undefined" && typeof SVGElement === "undefined";
  $$self.$$set = ($$props2) => {
    if ("className" in $$props2)
      $$invalidate(0, className = $$props2.className);
    if ("override" in $$props2)
      $$invalidate(1, override = $$props2.override);
    if ("icon" in $$props2)
      $$invalidate(2, icon = $$props2.icon);
    if ("iconSize" in $$props2)
      $$invalidate(8, iconSize = $$props2.iconSize);
    if ("iconProps" in $$props2)
      $$invalidate(3, iconProps = $$props2.iconProps);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*iconSize*/
    256) {
      $$invalidate(6, { cx: cx2, getStyles, classes } = useStyles$8({ iconSize }, { name: "IconRenderer" }), cx2, ($$invalidate(5, getStyles), $$invalidate(8, iconSize)), ($$invalidate(4, classes), $$invalidate(8, iconSize)));
    }
    if ($$self.$$.dirty & /*icon, classes*/
    20) {
      if (!requiresShim && (icon instanceof HTMLElement || icon instanceof SVGElement)) {
        icon.classList.add(...classes.icon.split(" "));
      }
    }
  };
  return [
    className,
    override,
    icon,
    iconProps,
    classes,
    getStyles,
    cx2,
    requiresShim,
    iconSize
  ];
}
class IconRenderer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {
      className: 0,
      override: 1,
      icon: 2,
      iconSize: 8,
      iconProps: 3
    });
  }
}
const IconRenderer$1 = IconRenderer;
function getTextColor(theme2, color, variant2, gradient, dark2 = false) {
  if (color === "dimmed")
    return dark2 ? theme2.fn.themeColor("dark", 2) : theme2.fn.themeColor("gray", 6);
  if (variant2 === "gradient" || gradient)
    return theme2.fn.themeColor(color, 6);
  if (variant2 === "link")
    return dark2 ? theme2.fn.themeColor("blue", 4) : theme2.fn.themeColor("blue", 7);
  if (variant2 === "text")
    return dark2 ? theme2.fn.themeColor(color, 5) : theme2.fn.themeColor(color, 7);
}
const useStyles$7 = createStyles((theme2, { align, color, inherit, inline, lineClamp, size: size2, tracking, transform: transform2, underline, weight, gradient, variant: variant2 }) => {
  var _a;
  return {
    root: {
      focusRing: "auto",
      [`${theme2.dark} &`]: {
        color: color === "dark" ? "$dark50" : getTextColor(theme2, color, variant2, gradient, true)
      },
      fontFamily: inherit ? "inherit" : "$standard",
      fontSize: inherit ? "inherit" : typeof size2 === "string" ? `$${size2}` : `${size2}px`,
      fontWeight: inherit ? "inherit" : `$${weight}`,
      letterSpacing: (_a = theme2.letterSpacings[tracking]) == null ? void 0 : _a.value,
      lineHeight: inherit ? "inherit" : inline ? 1 : typeof size2 === "string" ? `$${size2}` : `${size2}px`,
      textTransform: transform2,
      textDecoration: underline ? "underline" : "none",
      textAlign: align,
      cursor: variant2 === "link" ? "pointer" : "inherit",
      color: color === "green" ? "Black" : getTextColor(theme2, color, variant2, gradient),
      backgroundImage: variant2 === "gradient" ? `linear-gradient(${gradient == null ? void 0 : gradient.deg}deg, $${gradient == null ? void 0 : gradient.from}600 0%, $${gradient == null ? void 0 : gradient.to}600 100%)` : null,
      WebkitBackgroundClip: variant2 === "gradient" ? "text" : null,
      WebkitTextFillColor: variant2 === "gradient" ? "transparent" : null,
      ...lineClamp !== void 0 ? {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: lineClamp,
        WebkitBoxOrient: "vertical"
      } : {},
      "&:hover": variant2 === "link" && underline === true ? {
        textDecoration: "underline"
      } : void 0
    }
  };
});
const TextErrors = Object.freeze([
  {
    error: true,
    message: "If using the 'gradient' prop, set 'variant' prop to 'gradient' to apply the gradient",
    solution: `
                If your component looks like this:

                &lt;Text gradient={{from: 'blue', to: 'red', deg: 45}}&gt;Text string &lt;/Text&gt;
                                                                    ^^^ - Try adding prop variant='gradient'
                `
  },
  {
    error: true,
    message: "If using the 'link' variant, an href needs to be set and the root must be an anchor",
    solution: `
                If your component looks like this:

                &lt;Text variant='link'&gt;Text string &lt;/Text&gt;
                                    ^^^ - Try adding props href && root={'a'}'
                `
  }
]);
function create_default_slot$c(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[25].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[27],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        134217728)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[27],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[27]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[27],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$d(ctx) {
  let error;
  let t2;
  let box;
  let updating_element;
  let current;
  error = new Error$2({
    props: {
      observable: (
        /*observable*/
        ctx[6]
      ),
      component: "Text",
      code: (
        /*err*/
        ctx[7]
      )
    }
  });
  const box_spread_levels = [
    { root: (
      /*root*/
      ctx[4]
    ) },
    {
      use: [
        /*forwardEvents*/
        ctx[11],
        [
          useActions,
          /*use*/
          ctx[1]
        ]
      ]
    },
    {
      class: (
        /*cx*/
        ctx[10](
          /*className*/
          ctx[2],
          /*classes*/
          ctx[9].root,
          /*getStyles*/
          ctx[8]({ css: (
            /*override*/
            ctx[3]
          ) })
        )
      )
    },
    { href: (
      /*href*/
      ctx[5] ?? void 0
    ) },
    /*$$restProps*/
    ctx[12]
  ];
  function box_element_binding(value) {
    ctx[26](value);
  }
  let box_props = {
    $$slots: { default: [create_default_slot$c] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < box_spread_levels.length; i2 += 1) {
    box_props = assign(box_props, box_spread_levels[i2]);
  }
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    box_props.element = /*element*/
    ctx[0];
  }
  box = new Box({ props: box_props });
  binding_callbacks.push(() => bind(box, "element", box_element_binding));
  return {
    c() {
      create_component(error.$$.fragment);
      t2 = space();
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(error, target, anchor);
      insert(target, t2, anchor);
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const error_changes = {};
      if (dirty & /*observable*/
      64)
        error_changes.observable = /*observable*/
        ctx2[6];
      if (dirty & /*err*/
      128)
        error_changes.code = /*err*/
        ctx2[7];
      error.$set(error_changes);
      const box_changes = dirty & /*root, forwardEvents, use, cx, className, classes, getStyles, override, href, undefined, $$restProps*/
      7998 ? get_spread_update(box_spread_levels, [
        dirty & /*root*/
        16 && { root: (
          /*root*/
          ctx2[4]
        ) },
        dirty & /*forwardEvents, use*/
        2050 && {
          use: [
            /*forwardEvents*/
            ctx2[11],
            [
              useActions,
              /*use*/
              ctx2[1]
            ]
          ]
        },
        dirty & /*cx, className, classes, getStyles, override*/
        1804 && {
          class: (
            /*cx*/
            ctx2[10](
              /*className*/
              ctx2[2],
              /*classes*/
              ctx2[9].root,
              /*getStyles*/
              ctx2[8]({ css: (
                /*override*/
                ctx2[3]
              ) })
            )
          )
        },
        dirty & /*href, undefined*/
        32 && { href: (
          /*href*/
          ctx2[5] ?? void 0
        ) },
        dirty & /*$$restProps*/
        4096 && get_spread_object(
          /*$$restProps*/
          ctx2[12]
        )
      ]) : {};
      if (dirty & /*$$scope*/
      134217728) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        box_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(error.$$.fragment, local);
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(error.$$.fragment, local);
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
      destroy_component(error, detaching);
      destroy_component(box, detaching);
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "override",
    "align",
    "color",
    "root",
    "transform",
    "variant",
    "size",
    "weight",
    "gradient",
    "inline",
    "lineClamp",
    "underline",
    "inherit",
    "href",
    "tracking"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", override = {}, align = "left", color = "dark", root = void 0, transform: transform2 = "none", variant: variant2 = "text", size: size2 = "md", weight = "normal", gradient = { from: "indigo", to: "cyan", deg: 45 }, inline = true, lineClamp = void 0, underline = false, inherit = false, href = "", tracking = "normal" } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  let observable = false;
  let err;
  if (gradient.from === "indigo" && gradient.to === "cyan0" && gradient.deg === 45 && variant2 !== "gradient") {
    observable = true;
    err = TextErrors[0];
  }
  function box_element_binding(value) {
    element2 = value;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(3, override = $$new_props.override);
    if ("align" in $$new_props)
      $$invalidate(13, align = $$new_props.align);
    if ("color" in $$new_props)
      $$invalidate(14, color = $$new_props.color);
    if ("root" in $$new_props)
      $$invalidate(4, root = $$new_props.root);
    if ("transform" in $$new_props)
      $$invalidate(15, transform2 = $$new_props.transform);
    if ("variant" in $$new_props)
      $$invalidate(16, variant2 = $$new_props.variant);
    if ("size" in $$new_props)
      $$invalidate(17, size2 = $$new_props.size);
    if ("weight" in $$new_props)
      $$invalidate(18, weight = $$new_props.weight);
    if ("gradient" in $$new_props)
      $$invalidate(19, gradient = $$new_props.gradient);
    if ("inline" in $$new_props)
      $$invalidate(20, inline = $$new_props.inline);
    if ("lineClamp" in $$new_props)
      $$invalidate(21, lineClamp = $$new_props.lineClamp);
    if ("underline" in $$new_props)
      $$invalidate(22, underline = $$new_props.underline);
    if ("inherit" in $$new_props)
      $$invalidate(23, inherit = $$new_props.inherit);
    if ("href" in $$new_props)
      $$invalidate(5, href = $$new_props.href);
    if ("tracking" in $$new_props)
      $$invalidate(24, tracking = $$new_props.tracking);
    if ("$$scope" in $$new_props)
      $$invalidate(27, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*lineClamp, underline, inline, inherit, gradient, variant, align, color, transform, size, weight, tracking*/
    33546240) {
      $$invalidate(
        10,
        { cx: cx2, classes, getStyles } = useStyles$7(
          {
            lineClamp,
            underline,
            inline,
            inherit,
            gradient,
            variant: variant2,
            align,
            color,
            transform: transform2,
            size: size2,
            weight,
            tracking
          },
          { name: "Text" }
        ),
        cx2,
        ($$invalidate(9, classes), $$invalidate(21, lineClamp), $$invalidate(22, underline), $$invalidate(20, inline), $$invalidate(23, inherit), $$invalidate(19, gradient), $$invalidate(16, variant2), $$invalidate(13, align), $$invalidate(14, color), $$invalidate(15, transform2), $$invalidate(17, size2), $$invalidate(18, weight), $$invalidate(24, tracking)),
        ($$invalidate(8, getStyles), $$invalidate(21, lineClamp), $$invalidate(22, underline), $$invalidate(20, inline), $$invalidate(23, inherit), $$invalidate(19, gradient), $$invalidate(16, variant2), $$invalidate(13, align), $$invalidate(14, color), $$invalidate(15, transform2), $$invalidate(17, size2), $$invalidate(18, weight), $$invalidate(24, tracking))
      );
    }
  };
  return [
    element2,
    use,
    className,
    override,
    root,
    href,
    observable,
    err,
    getStyles,
    classes,
    cx2,
    forwardEvents,
    $$restProps,
    align,
    color,
    transform2,
    variant2,
    size2,
    weight,
    gradient,
    inline,
    lineClamp,
    underline,
    inherit,
    tracking,
    slots,
    box_element_binding,
    $$scope
  ];
}
class Text extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      override: 3,
      align: 13,
      color: 14,
      root: 4,
      transform: 15,
      variant: 16,
      size: 17,
      weight: 18,
      gradient: 19,
      inline: 20,
      lineClamp: 21,
      underline: 22,
      inherit: 23,
      href: 5,
      tracking: 24
    });
  }
}
const useStyles$6 = createStyles((theme2) => {
  return {
    root: {
      position: "relative",
      overflow: "hidden",
      backgroundColor: theme2.colors.white.value
    }
  };
});
const useStyles$5 = createStyles((theme2, { radius: radius2, shadow, withBorder, padding }) => {
  return {
    root: {
      darkMode: {
        backgroundColor: theme2.fn.themeColor("dark", 7),
        color: theme2.fn.themeColor("dark")
      },
      padding: theme2.fn.size({ size: padding, sizes: theme2.space }),
      outline: 0,
      display: "block",
      textDecoration: "none",
      color: theme2.colors.black.value,
      backgroundColor: theme2.colors.white.value,
      boxSizing: "border-box",
      borderRadius: `$${radius2}`,
      WebkitTapHighlightColor: "transparent",
      boxShadow: theme2.shadows[shadow].value || shadow || "none",
      border: void 0
    },
    withBorder: {
      darkMode: {
        border: `1px solid ${theme2.fn.themeColor("dark", 4)}`
      },
      border: `1px solid ${theme2.fn.themeColor("gray", 3)}`
    }
  };
});
function create_default_slot$b(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[12].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        16384)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[14]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[14],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$c(ctx) {
  let box;
  let updating_element;
  let current;
  const box_spread_levels = [
    {
      class: (
        /*cx*/
        ctx[7](
          /*classes*/
          ctx[6].root,
          /*className*/
          ctx[2],
          /*withBorder*/
          ctx[4] && /*classes*/
          ctx[6].withBorder,
          /*getStyles*/
          ctx[5]({ css: (
            /*override*/
            ctx[3]
          ) })
        )
      )
    },
    { use: (
      /*use*/
      ctx[1]
    ) },
    /*$$restProps*/
    ctx[8]
  ];
  function box_element_binding(value) {
    ctx[13](value);
  }
  let box_props = {
    $$slots: { default: [create_default_slot$b] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < box_spread_levels.length; i2 += 1) {
    box_props = assign(box_props, box_spread_levels[i2]);
  }
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    box_props.element = /*element*/
    ctx[0];
  }
  box = new Box({ props: box_props });
  binding_callbacks.push(() => bind(box, "element", box_element_binding));
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const box_changes = dirty & /*cx, classes, className, withBorder, getStyles, override, use, $$restProps*/
      510 ? get_spread_update(box_spread_levels, [
        dirty & /*cx, classes, className, withBorder, getStyles, override*/
        252 && {
          class: (
            /*cx*/
            ctx2[7](
              /*classes*/
              ctx2[6].root,
              /*className*/
              ctx2[2],
              /*withBorder*/
              ctx2[4] && /*classes*/
              ctx2[6].withBorder,
              /*getStyles*/
              ctx2[5]({ css: (
                /*override*/
                ctx2[3]
              ) })
            )
          )
        },
        dirty & /*use*/
        2 && { use: (
          /*use*/
          ctx2[1]
        ) },
        dirty & /*$$restProps*/
        256 && get_spread_object(
          /*$$restProps*/
          ctx2[8]
        )
      ]) : {};
      if (dirty & /*$$scope*/
      16384) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        box_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = ["use", "element", "class", "override", "shadow", "radius", "withBorder", "padding"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", override = {}, shadow = "xs", radius: radius2 = "sm", withBorder = false, padding = "md" } = $$props;
  function box_element_binding(value) {
    element2 = value;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(3, override = $$new_props.override);
    if ("shadow" in $$new_props)
      $$invalidate(9, shadow = $$new_props.shadow);
    if ("radius" in $$new_props)
      $$invalidate(10, radius2 = $$new_props.radius);
    if ("withBorder" in $$new_props)
      $$invalidate(4, withBorder = $$new_props.withBorder);
    if ("padding" in $$new_props)
      $$invalidate(11, padding = $$new_props.padding);
    if ("$$scope" in $$new_props)
      $$invalidate(14, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*radius, shadow, withBorder, padding*/
    3600) {
      $$invalidate(7, { cx: cx2, classes, getStyles } = useStyles$5({ radius: radius2, shadow, withBorder, padding }, { name: "Paper" }), cx2, ($$invalidate(6, classes), $$invalidate(10, radius2), $$invalidate(9, shadow), $$invalidate(4, withBorder), $$invalidate(11, padding)), ($$invalidate(5, getStyles), $$invalidate(10, radius2), $$invalidate(9, shadow), $$invalidate(4, withBorder), $$invalidate(11, padding)));
    }
  };
  return [
    element2,
    use,
    className,
    override,
    withBorder,
    getStyles,
    classes,
    cx2,
    $$restProps,
    shadow,
    radius2,
    padding,
    slots,
    box_element_binding,
    $$scope
  ];
}
class Paper extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      override: 3,
      shadow: 9,
      radius: 10,
      withBorder: 4,
      padding: 11
    });
  }
}
function create_default_slot$a(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[9].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[11],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        2048)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[11],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[11]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[11],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let paper;
  let updating_element;
  let current;
  const paper_spread_levels = [
    {
      class: (
        /*cx*/
        ctx[7](
          /*className*/
          ctx[2],
          /*classes*/
          ctx[6].root
        )
      )
    },
    {
      override: {
        [`${/*theme*/
        ctx[5].dark} &`]: {
          backgroundColor: (
            /*theme*/
            ctx[5].fn.themeColor("dark", 6)
          )
        },
        .../*override*/
        ctx[3]
      }
    },
    { padding: (
      /*padding*/
      ctx[4]
    ) },
    { use: (
      /*use*/
      ctx[1]
    ) },
    /*$$restProps*/
    ctx[8]
  ];
  function paper_element_binding(value) {
    ctx[10](value);
  }
  let paper_props = {
    $$slots: { default: [create_default_slot$a] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < paper_spread_levels.length; i2 += 1) {
    paper_props = assign(paper_props, paper_spread_levels[i2]);
  }
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    paper_props.element = /*element*/
    ctx[0];
  }
  paper = new Paper({ props: paper_props });
  binding_callbacks.push(() => bind(paper, "element", paper_element_binding));
  return {
    c() {
      create_component(paper.$$.fragment);
    },
    m(target, anchor) {
      mount_component(paper, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const paper_changes = dirty & /*cx, className, classes, theme, override, padding, use, $$restProps*/
      510 ? get_spread_update(paper_spread_levels, [
        dirty & /*cx, className, classes*/
        196 && {
          class: (
            /*cx*/
            ctx2[7](
              /*className*/
              ctx2[2],
              /*classes*/
              ctx2[6].root
            )
          )
        },
        dirty & /*theme, override*/
        40 && {
          override: {
            [`${/*theme*/
            ctx2[5].dark} &`]: {
              backgroundColor: (
                /*theme*/
                ctx2[5].fn.themeColor("dark", 6)
              )
            },
            .../*override*/
            ctx2[3]
          }
        },
        dirty & /*padding*/
        16 && { padding: (
          /*padding*/
          ctx2[4]
        ) },
        dirty & /*use*/
        2 && { use: (
          /*use*/
          ctx2[1]
        ) },
        dirty & /*$$restProps*/
        256 && get_spread_object(
          /*$$restProps*/
          ctx2[8]
        )
      ]) : {};
      if (dirty & /*$$scope*/
      2048) {
        paper_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        paper_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      paper.$set(paper_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(paper.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(paper.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(paper, detaching);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let theme2;
  const omit_props_names = ["use", "element", "class", "override", "padding"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", override = {}, padding = "md" } = $$props;
  onMount(() => {
    const nodeLength = element2.children.length;
    const firstChild = element2.children[0];
    const lastChild = element2.children[nodeLength - 1];
    if ((firstChild == null ? void 0 : firstChild.id) === "svelteui_card_section") {
      firstChild.style.marginTop = `${-1 * theme2.fn.size({ size: padding, sizes: theme2.space })}px`;
    }
    if ((lastChild == null ? void 0 : lastChild.id) === "svelteui_card_section") {
      lastChild.style.marginBottom = `${-1 * theme2.fn.size({ size: padding, sizes: theme2.space })}px`;
    }
  });
  function paper_element_binding(value) {
    element2 = value;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(3, override = $$new_props.override);
    if ("padding" in $$new_props)
      $$invalidate(4, padding = $$new_props.padding);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  $$invalidate(7, { cx: cx2, classes, theme: theme2 } = useStyles$6(null, { name: "Card" }), cx2, $$invalidate(6, classes), $$invalidate(5, theme2));
  return [
    element2,
    use,
    className,
    override,
    padding,
    theme2,
    classes,
    cx2,
    $$restProps,
    slots,
    paper_element_binding,
    $$scope
  ];
}
let Card$1 = class Card extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      override: 3,
      padding: 4
    });
  }
};
const useStyles$4 = createStyles((theme2, { padding }) => {
  return {
    root: {
      display: "block",
      marginLeft: -1 * theme2.fn.size({ size: padding, sizes: theme2.space }),
      marginRight: -1 * theme2.fn.size({ size: padding, sizes: theme2.space })
    }
  };
});
function create_default_slot$9(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[9].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[11],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        2048)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[11],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[11]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[11],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$a(ctx) {
  let box;
  let updating_element;
  let current;
  const box_spread_levels = [
    { id: "svelteui_card_section" },
    {
      class: (
        /*cx*/
        ctx[6](
          /*className*/
          ctx[2],
          /*classes*/
          ctx[5].root,
          /*getStyles*/
          ctx[4]({ css: (
            /*override*/
            ctx[3]
          ) })
        )
      )
    },
    { use: (
      /*use*/
      ctx[1]
    ) },
    /*$$restProps*/
    ctx[7]
  ];
  function box_element_binding(value) {
    ctx[10](value);
  }
  let box_props = {
    $$slots: { default: [create_default_slot$9] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < box_spread_levels.length; i2 += 1) {
    box_props = assign(box_props, box_spread_levels[i2]);
  }
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    box_props.element = /*element*/
    ctx[0];
  }
  box = new Box({ props: box_props });
  binding_callbacks.push(() => bind(box, "element", box_element_binding));
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const box_changes = dirty & /*cx, className, classes, getStyles, override, use, $$restProps*/
      254 ? get_spread_update(box_spread_levels, [
        box_spread_levels[0],
        dirty & /*cx, className, classes, getStyles, override*/
        124 && {
          class: (
            /*cx*/
            ctx2[6](
              /*className*/
              ctx2[2],
              /*classes*/
              ctx2[5].root,
              /*getStyles*/
              ctx2[4]({ css: (
                /*override*/
                ctx2[3]
              ) })
            )
          )
        },
        dirty & /*use*/
        2 && { use: (
          /*use*/
          ctx2[1]
        ) },
        dirty & /*$$restProps*/
        128 && get_spread_object(
          /*$$restProps*/
          ctx2[7]
        )
      ]) : {};
      if (dirty & /*$$scope*/
      2048) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        box_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = ["use", "element", "class", "override", "padding"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", override = {}, padding = "md" } = $$props;
  function box_element_binding(value) {
    element2 = value;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(3, override = $$new_props.override);
    if ("padding" in $$new_props)
      $$invalidate(8, padding = $$new_props.padding);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*padding*/
    256) {
      $$invalidate(6, { cx: cx2, classes, getStyles } = useStyles$4({ padding }), cx2, ($$invalidate(5, classes), $$invalidate(8, padding)), ($$invalidate(4, getStyles), $$invalidate(8, padding)));
    }
  };
  return [
    element2,
    use,
    className,
    override,
    getStyles,
    classes,
    cx2,
    $$restProps,
    padding,
    slots,
    box_element_binding,
    $$scope
  ];
}
class CardSection extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      override: 3,
      padding: 8
    });
  }
}
const Section = CardSection;
Card$1.Section = Section;
const Card2 = Card$1;
const useStyles$3 = createStyles((theme2, { size: size2 }) => {
  return {
    root: {
      lineHeight: theme2.lineHeights.md.value
    },
    label: {
      [`${theme2.dark} &`]: {
        color: theme2.fn.themeColor("dark", 0)
      },
      display: "inline-block",
      marginBottom: 4,
      fontFamily: theme2.fonts.standard.value ?? "sans-serif",
      fontSize: theme2.fontSizes[size2].value,
      fontWeight: 500,
      color: theme2.fn.themeColor("gray", 9),
      wordBreak: "break-word",
      cursor: "default",
      WebkitTapHighlightColor: "transparent"
    },
    error: {
      [`${theme2.dark} &`]: {
        color: theme2.fn.themeColor("red", 6)
      },
      marginTop: 5,
      wordBreak: "break-word",
      color: theme2.fn.themeColor("red", 7)
    },
    description: {
      [`${theme2.dark} &`]: {
        color: `${theme2.fn.themeColor("dark", 2)} !important`
      },
      marginTop: -3,
      marginBottom: 7,
      wordBreak: "break-word",
      color: `${theme2.fn.themeColor("gray", 6)} !important`,
      fontSize: theme2.fontSizes[size2].value,
      lineHeight: 1.2
    },
    required: {
      [`${theme2.dark} &`]: {
        color: theme2.fn.themeColor("red", 5)
      },
      color: theme2.fn.themeColor("red", 7)
    }
  };
});
function create_if_block$4(ctx) {
  let span;
  let t_value = " *";
  let t2;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t2 = text(t_value);
      attr(span, "class", span_class_value = /*classes*/
      ctx[5].required);
      attr(span, "aria-hidden", "");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*classes*/
      32 && span_class_value !== (span_class_value = /*classes*/
      ctx2[5].required)) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_default_slot$8(ctx) {
  let t0;
  let t1;
  let if_block_anchor;
  let if_block = (
    /*required*/
    ctx[3] && create_if_block$4(ctx)
  );
  return {
    c() {
      t0 = text(
        /*label*/
        ctx[1]
      );
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*label*/
      2)
        set_data(
          t0,
          /*label*/
          ctx2[1]
        );
      if (
        /*required*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$4(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_fragment$9(ctx) {
  let box;
  let current;
  box = new Box({
    props: {
      for: (
        /*id*/
        ctx[4]
      ),
      root: (
        /*labelElement*/
        ctx[2]
      ),
      class: (
        /*className*/
        ctx[0]
      ),
      $$slots: { default: [create_default_slot$8] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const box_changes = {};
      if (dirty & /*id*/
      16)
        box_changes.for = /*id*/
        ctx2[4];
      if (dirty & /*labelElement*/
      4)
        box_changes.root = /*labelElement*/
        ctx2[2];
      if (dirty & /*className*/
      1)
        box_changes.class = /*className*/
        ctx2[0];
      if (dirty & /*$$scope, classes, required, label*/
      106) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let classes;
  let { class: className = "label" } = $$props;
  let { label = "label" } = $$props;
  let { labelElement = "label" } = $$props;
  let { required = false } = $$props;
  let { id = void 0 } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, className = $$props2.class);
    if ("label" in $$props2)
      $$invalidate(1, label = $$props2.label);
    if ("labelElement" in $$props2)
      $$invalidate(2, labelElement = $$props2.labelElement);
    if ("required" in $$props2)
      $$invalidate(3, required = $$props2.required);
    if ("id" in $$props2)
      $$invalidate(4, id = $$props2.id);
  };
  $$invalidate(5, { classes } = useStyles$3({ size: "md" }, { name: "InputWrapper" }), classes);
  return [className, label, labelElement, required, id, classes];
}
class LabelElement extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {
      class: 0,
      label: 1,
      labelElement: 2,
      required: 3,
      id: 4
    });
  }
}
function create_if_block_2$1(ctx) {
  let labelelement;
  let current;
  const labelelement_spread_levels = [
    { class: (
      /*classes*/
      ctx[15].label
    ) },
    /*labelProps*/
    ctx[8],
    { label: (
      /*label*/
      ctx[4]
    ) },
    { id: (
      /*id*/
      ctx[11]
    ) },
    { labelElement: (
      /*labelElement*/
      ctx[12]
    ) },
    { required: (
      /*required*/
      ctx[7]
    ) }
  ];
  let labelelement_props = {};
  for (let i2 = 0; i2 < labelelement_spread_levels.length; i2 += 1) {
    labelelement_props = assign(labelelement_props, labelelement_spread_levels[i2]);
  }
  labelelement = new LabelElement({ props: labelelement_props });
  return {
    c() {
      create_component(labelelement.$$.fragment);
    },
    m(target, anchor) {
      mount_component(labelelement, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const labelelement_changes = dirty & /*classes, labelProps, label, id, labelElement, required*/
      39312 ? get_spread_update(labelelement_spread_levels, [
        dirty & /*classes*/
        32768 && { class: (
          /*classes*/
          ctx2[15].label
        ) },
        dirty & /*labelProps*/
        256 && get_spread_object(
          /*labelProps*/
          ctx2[8]
        ),
        dirty & /*label*/
        16 && { label: (
          /*label*/
          ctx2[4]
        ) },
        dirty & /*id*/
        2048 && { id: (
          /*id*/
          ctx2[11]
        ) },
        dirty & /*labelElement*/
        4096 && { labelElement: (
          /*labelElement*/
          ctx2[12]
        ) },
        dirty & /*required*/
        128 && { required: (
          /*required*/
          ctx2[7]
        ) }
      ]) : {};
      labelelement.$set(labelelement_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(labelelement.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(labelelement.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(labelelement, detaching);
    }
  };
}
function create_if_block_1$2(ctx) {
  let text_1;
  let current;
  const text_1_spread_levels = [
    /*descriptionProps*/
    ctx[9],
    { color: "gray" },
    { class: (
      /*classes*/
      ctx[15].description
    ) }
  ];
  let text_1_props = {
    $$slots: { default: [create_default_slot_2$2] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < text_1_spread_levels.length; i2 += 1) {
    text_1_props = assign(text_1_props, text_1_spread_levels[i2]);
  }
  text_1 = new Text({ props: text_1_props });
  return {
    c() {
      create_component(text_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(text_1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const text_1_changes = dirty & /*descriptionProps, classes*/
      33280 ? get_spread_update(text_1_spread_levels, [
        dirty & /*descriptionProps*/
        512 && get_spread_object(
          /*descriptionProps*/
          ctx2[9]
        ),
        text_1_spread_levels[1],
        dirty & /*classes*/
        32768 && { class: (
          /*classes*/
          ctx2[15].description
        ) }
      ]) : {};
      if (dirty & /*$$scope, description*/
      1048608) {
        text_1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      text_1.$set(text_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(text_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(text_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(text_1, detaching);
    }
  };
}
function create_default_slot_2$2(ctx) {
  let t2;
  return {
    c() {
      t2 = text(
        /*description*/
        ctx[5]
      );
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*description*/
      32)
        set_data(
          t2,
          /*description*/
          ctx2[5]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_if_block$3(ctx) {
  let text_1;
  let current;
  const text_1_spread_levels = [
    /*errorProps*/
    ctx[10],
    { size: (
      /*size*/
      ctx[13]
    ) },
    { class: (
      /*classes*/
      ctx[15].error
    ) }
  ];
  let text_1_props = {
    $$slots: { default: [create_default_slot_1$3] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < text_1_spread_levels.length; i2 += 1) {
    text_1_props = assign(text_1_props, text_1_spread_levels[i2]);
  }
  text_1 = new Text({ props: text_1_props });
  return {
    c() {
      create_component(text_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(text_1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const text_1_changes = dirty & /*errorProps, size, classes*/
      41984 ? get_spread_update(text_1_spread_levels, [
        dirty & /*errorProps*/
        1024 && get_spread_object(
          /*errorProps*/
          ctx2[10]
        ),
        dirty & /*size*/
        8192 && { size: (
          /*size*/
          ctx2[13]
        ) },
        dirty & /*classes*/
        32768 && { class: (
          /*classes*/
          ctx2[15].error
        ) }
      ]) : {};
      if (dirty & /*$$scope, error*/
      1048640) {
        text_1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      text_1.$set(text_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(text_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(text_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(text_1, detaching);
    }
  };
}
function create_default_slot_1$3(ctx) {
  let t2;
  return {
    c() {
      t2 = text(
        /*error*/
        ctx[6]
      );
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*error*/
      64)
        set_data(
          t2,
          /*error*/
          ctx2[6]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_default_slot$7(ctx) {
  let t0;
  let t1;
  let t2;
  let if_block2_anchor;
  let current;
  let if_block0 = (
    /*label*/
    ctx[4] && create_if_block_2$1(ctx)
  );
  let if_block1 = (
    /*description*/
    ctx[5] && create_if_block_1$2(ctx)
  );
  const default_slot_template = (
    /*#slots*/
    ctx[18].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[20],
    null
  );
  let if_block2 = typeof /*error*/
  ctx[6] !== "boolean" && /*error*/
  ctx[6] && create_if_block$3(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (default_slot)
        default_slot.c();
      t2 = space();
      if (if_block2)
        if_block2.c();
      if_block2_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, t1, anchor);
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      insert(target, t2, anchor);
      if (if_block2)
        if_block2.m(target, anchor);
      insert(target, if_block2_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*label*/
        ctx2[4]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*label*/
          16) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*description*/
        ctx2[5]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*description*/
          32) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1$2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t1.parentNode, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1048576)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[20],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[20]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[20],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (typeof /*error*/
      ctx2[6] !== "boolean" && /*error*/
      ctx2[6]) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & /*error*/
          64) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$3(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(default_slot, local);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(default_slot, local);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
        detach(t2);
        detach(if_block2_anchor);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d(detaching);
      if (default_slot)
        default_slot.d(detaching);
      if (if_block2)
        if_block2.d(detaching);
    }
  };
}
function create_fragment$8(ctx) {
  let box;
  let updating_element;
  let current;
  const box_spread_levels = [
    { use: (
      /*use*/
      ctx[1]
    ) },
    {
      class: (
        /*cx*/
        ctx[16](
          /*className*/
          ctx[2],
          /*classes*/
          ctx[15].root,
          /*getStyles*/
          ctx[14]({ css: (
            /*override*/
            ctx[3]
          ) })
        )
      )
    },
    /*$$restProps*/
    ctx[17]
  ];
  function box_element_binding(value) {
    ctx[19](value);
  }
  let box_props = {
    $$slots: { default: [create_default_slot$7] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < box_spread_levels.length; i2 += 1) {
    box_props = assign(box_props, box_spread_levels[i2]);
  }
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    box_props.element = /*element*/
    ctx[0];
  }
  box = new Box({ props: box_props });
  binding_callbacks.push(() => bind(box, "element", box_element_binding));
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const box_changes = dirty & /*use, cx, className, classes, getStyles, override, $$restProps*/
      245774 ? get_spread_update(box_spread_levels, [
        dirty & /*use*/
        2 && { use: (
          /*use*/
          ctx2[1]
        ) },
        dirty & /*cx, className, classes, getStyles, override*/
        114700 && {
          class: (
            /*cx*/
            ctx2[16](
              /*className*/
              ctx2[2],
              /*classes*/
              ctx2[15].root,
              /*getStyles*/
              ctx2[14]({ css: (
                /*override*/
                ctx2[3]
              ) })
            )
          )
        },
        dirty & /*$$restProps*/
        131072 && get_spread_object(
          /*$$restProps*/
          ctx2[17]
        )
      ]) : {};
      if (dirty & /*$$scope, errorProps, size, classes, error, descriptionProps, description, labelProps, label, id, labelElement, required*/
      1097712) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        box_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "override",
    "label",
    "description",
    "error",
    "required",
    "labelProps",
    "descriptionProps",
    "errorProps",
    "id",
    "labelElement",
    "size"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", override = {}, label = "label", description = null, error = null, required = false, labelProps = {}, descriptionProps = {}, errorProps = {}, id = "input-id", labelElement = "label", size: size2 = "sm" } = $$props;
  function box_element_binding(value) {
    element2 = value;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(3, override = $$new_props.override);
    if ("label" in $$new_props)
      $$invalidate(4, label = $$new_props.label);
    if ("description" in $$new_props)
      $$invalidate(5, description = $$new_props.description);
    if ("error" in $$new_props)
      $$invalidate(6, error = $$new_props.error);
    if ("required" in $$new_props)
      $$invalidate(7, required = $$new_props.required);
    if ("labelProps" in $$new_props)
      $$invalidate(8, labelProps = $$new_props.labelProps);
    if ("descriptionProps" in $$new_props)
      $$invalidate(9, descriptionProps = $$new_props.descriptionProps);
    if ("errorProps" in $$new_props)
      $$invalidate(10, errorProps = $$new_props.errorProps);
    if ("id" in $$new_props)
      $$invalidate(11, id = $$new_props.id);
    if ("labelElement" in $$new_props)
      $$invalidate(12, labelElement = $$new_props.labelElement);
    if ("size" in $$new_props)
      $$invalidate(13, size2 = $$new_props.size);
    if ("$$scope" in $$new_props)
      $$invalidate(20, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*size*/
    8192) {
      $$invalidate(16, { cx: cx2, classes, getStyles } = useStyles$3({ size: size2 }, { name: "InputWrapper" }), cx2, ($$invalidate(15, classes), $$invalidate(13, size2)), ($$invalidate(14, getStyles), $$invalidate(13, size2)));
    }
  };
  return [
    element2,
    use,
    className,
    override,
    label,
    description,
    error,
    required,
    labelProps,
    descriptionProps,
    errorProps,
    id,
    labelElement,
    size2,
    getStyles,
    classes,
    cx2,
    $$restProps,
    slots,
    box_element_binding,
    $$scope
  ];
}
class InputWrapper extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      override: 3,
      label: 4,
      description: 5,
      error: 6,
      required: 7,
      labelProps: 8,
      descriptionProps: 9,
      errorProps: 10,
      id: 11,
      labelElement: 12,
      size: 13
    });
  }
}
const fade = keyframes({
  "from, to": { opacity: 0.4 },
  "50%": { opacity: 1 }
});
const useStyles$2 = createStyles((theme2, { animate, circle, height, radius: radius2, width }) => {
  return {
    root: {
      [`${theme2.dark} &`]: {
        "&.visible": {
          "&::before": {
            background: theme2.fn.themeColor("dark", 7)
          },
          "&::after": {
            background: theme2.fn.themeColor("dark", 4)
          }
        }
      },
      height,
      width: circle ? height : `${width}%`,
      borderRadius: circle ? height : `$${radius2}`,
      position: "relative",
      overflow: "hidden",
      "&.visible": {
        "&::before": {
          content: '""',
          position: "absolute",
          background: "white",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10
        },
        "&::after": {
          content: '""',
          position: "absolute",
          background: theme2.fn.themeColor("gray", 3),
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          animation: animate ? `${fade} 1500ms linear infinite` : "none",
          zIndex: 11
        }
      }
    }
  };
});
function create_default_slot$6(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[14].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[16],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        65536)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[16],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[16]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[16],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$7(ctx) {
  let box;
  let updating_element;
  let current;
  const box_spread_levels = [
    {
      class: (
        /*cx*/
        ctx[7](
          /*className*/
          ctx[2],
          /*classes*/
          ctx[6].root,
          { visible: (
            /*visible*/
            ctx[4]
          ) },
          /*getStyles*/
          ctx[5]({ css: (
            /*override*/
            ctx[3]
          ) })
        )
      )
    },
    { use: (
      /*use*/
      ctx[1]
    ) },
    /*$$restProps*/
    ctx[8]
  ];
  function box_element_binding(value) {
    ctx[15](value);
  }
  let box_props = {
    $$slots: { default: [create_default_slot$6] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < box_spread_levels.length; i2 += 1) {
    box_props = assign(box_props, box_spread_levels[i2]);
  }
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    box_props.element = /*element*/
    ctx[0];
  }
  box = new Box({ props: box_props });
  binding_callbacks.push(() => bind(box, "element", box_element_binding));
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const box_changes = dirty & /*cx, className, classes, visible, getStyles, override, use, $$restProps*/
      510 ? get_spread_update(box_spread_levels, [
        dirty & /*cx, className, classes, visible, getStyles, override*/
        252 && {
          class: (
            /*cx*/
            ctx2[7](
              /*className*/
              ctx2[2],
              /*classes*/
              ctx2[6].root,
              { visible: (
                /*visible*/
                ctx2[4]
              ) },
              /*getStyles*/
              ctx2[5]({ css: (
                /*override*/
                ctx2[3]
              ) })
            )
          )
        },
        dirty & /*use*/
        2 && { use: (
          /*use*/
          ctx2[1]
        ) },
        dirty & /*$$restProps*/
        256 && get_spread_object(
          /*$$restProps*/
          ctx2[8]
        )
      ]) : {};
      if (dirty & /*$$scope*/
      65536) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        box_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "override",
    "visible",
    "height",
    "width",
    "circle",
    "radius",
    "animate"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, class: className = "", override = {}, visible = true, height = "auto", width = 100, circle = null, radius: radius2 = null, animate = true } = $$props;
  function box_element_binding(value) {
    element2 = value;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(3, override = $$new_props.override);
    if ("visible" in $$new_props)
      $$invalidate(4, visible = $$new_props.visible);
    if ("height" in $$new_props)
      $$invalidate(9, height = $$new_props.height);
    if ("width" in $$new_props)
      $$invalidate(10, width = $$new_props.width);
    if ("circle" in $$new_props)
      $$invalidate(11, circle = $$new_props.circle);
    if ("radius" in $$new_props)
      $$invalidate(12, radius2 = $$new_props.radius);
    if ("animate" in $$new_props)
      $$invalidate(13, animate = $$new_props.animate);
    if ("$$scope" in $$new_props)
      $$invalidate(16, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*animate, circle, height, radius, width*/
    15872) {
      $$invalidate(7, { cx: cx2, classes, getStyles } = useStyles$2({ animate, circle, height, radius: radius2, width }, { name: "Skeleton" }), cx2, ($$invalidate(6, classes), $$invalidate(13, animate), $$invalidate(11, circle), $$invalidate(9, height), $$invalidate(12, radius2), $$invalidate(10, width)), ($$invalidate(5, getStyles), $$invalidate(13, animate), $$invalidate(11, circle), $$invalidate(9, height), $$invalidate(12, radius2), $$invalidate(10, width)));
    }
  };
  return [
    element2,
    use,
    className,
    override,
    visible,
    getStyles,
    classes,
    cx2,
    $$restProps,
    height,
    width,
    circle,
    radius2,
    animate,
    slots,
    box_element_binding,
    $$scope
  ];
}
class Skeleton extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
      use: 1,
      element: 0,
      class: 2,
      override: 3,
      visible: 4,
      height: 9,
      width: 10,
      circle: 11,
      radius: 12,
      animate: 13
    });
  }
}
const Skeleton$1 = Skeleton;
const useStyles$1 = createStyles((theme2, { radius: radius2, height, width, fit }) => {
  return {
    root: {
      fontFamily: theme2.fonts.standard.value ?? "sans-serif"
    },
    imageWrapper: {
      position: "relative"
    },
    figure: {
      margin: 0
    },
    image: {
      width,
      height,
      display: "block",
      border: 0,
      borderRadius: theme2.fn.radius(radius2),
      objectFit: fit
    },
    caption: {
      [`${theme2.dark} &`]: {
        color: theme2.fn.themeColor("dark", 2)
      },
      color: theme2.fn.themeColor("gray", 7),
      marginTop: theme2.space.xsPX.value
    },
    placeholder: {
      [`${theme2.dark} &`]: {
        color: theme2.fn.themeColor("dark", 2),
        backgroundColor: theme2.fn.themeColor("dark", 8)
      },
      width,
      height,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme2.fn.themeColor("gray", 6),
      backgroundColor: theme2.fn.themeColor("gray", 0),
      borderRadius: theme2.fn.radius(radius2)
    }
  };
});
function create_fragment$6(ctx) {
  let svg;
  let path;
  return {
    c() {
      svg = svg_element("svg");
      path = svg_element("path");
      attr(path, "d", "M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z");
      attr(path, "fill", "currentColor");
      attr(path, "fill-rule", "evenodd");
      attr(path, "clip-rule", "evenodd");
      attr(svg, "width", "15");
      attr(svg, "height", "15");
      attr(svg, "viewBox", "0 0 15 15");
      attr(svg, "fill", "none");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      set_style(
        svg,
        "width",
        /*style*/
        ctx[0].width
      );
      set_style(
        svg,
        "height",
        /*style*/
        ctx[0].height
      );
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, path);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*style*/
      1) {
        set_style(
          svg,
          "width",
          /*style*/
          ctx2[0].width
        );
      }
      if (dirty & /*style*/
      1) {
        set_style(
          svg,
          "height",
          /*style*/
          ctx2[0].height
        );
      }
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let { style: style2 = {} } = $$props;
  $$self.$$set = ($$props2) => {
    if ("style" in $$props2)
      $$invalidate(0, style2 = $$props2.style);
  };
  return [style2];
}
class ImageIcon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, { style: 0 });
  }
}
const get_placeholder_slot_changes = (dirty) => ({});
const get_placeholder_slot_context = (ctx) => ({});
function create_default_slot_2$1(ctx) {
  let img;
  let img_class_value;
  let img_src_value;
  let useActions_action;
  let mounted;
  let dispose;
  let img_levels = [
    {
      class: img_class_value = /*classes*/
      ctx[11].image
    },
    { src: img_src_value = /*src*/
    ctx[4] },
    { alt: (
      /*alt*/
      ctx[5]
    ) },
    /*$$restProps*/
    ctx[16]
  ];
  let img_data = {};
  for (let i2 = 0; i2 < img_levels.length; i2 += 1) {
    img_data = assign(img_data, img_levels[i2]);
  }
  return {
    c() {
      img = element("img");
      set_attributes(img, img_data);
    },
    m(target, anchor) {
      insert(target, img, anchor);
      ctx[24](img);
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(
            null,
            img,
            /*use*/
            ctx[1]
          )),
          action_destroyer(
            /*forwardEvents*/
            ctx[13].call(null, img)
          ),
          listen(
            img,
            "load",
            /*onLoad*/
            ctx[14]
          ),
          listen(
            img,
            "error",
            /*onError*/
            ctx[15]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(img, img_data = get_spread_update(img_levels, [
        dirty & /*classes*/
        2048 && img_class_value !== (img_class_value = /*classes*/
        ctx2[11].image) && { class: img_class_value },
        dirty & /*src*/
        16 && !src_url_equal(img.src, img_src_value = /*src*/
        ctx2[4]) && { src: img_src_value },
        dirty & /*alt*/
        32 && { alt: (
          /*alt*/
          ctx2[5]
        ) },
        dirty & /*$$restProps*/
        65536 && /*$$restProps*/
        ctx2[16]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/
      2)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[1]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(img);
      }
      ctx[24](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$1(ctx) {
  let div;
  let div_class_value;
  let current;
  const placeholder_slot_template = (
    /*#slots*/
    ctx[23].placeholder
  );
  const placeholder_slot = create_slot(
    placeholder_slot_template,
    ctx,
    /*$$scope*/
    ctx[25],
    get_placeholder_slot_context
  );
  const placeholder_slot_or_fallback = placeholder_slot || fallback_block$1();
  return {
    c() {
      div = element("div");
      if (placeholder_slot_or_fallback)
        placeholder_slot_or_fallback.c();
      attr(div, "class", div_class_value = /*classes*/
      ctx[11].placeholder);
      attr(
        div,
        "title",
        /*alt*/
        ctx[5]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (placeholder_slot_or_fallback) {
        placeholder_slot_or_fallback.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (placeholder_slot) {
        if (placeholder_slot.p && (!current || dirty & /*$$scope*/
        33554432)) {
          update_slot_base(
            placeholder_slot,
            placeholder_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[25],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[25]
            ) : get_slot_changes(
              placeholder_slot_template,
              /*$$scope*/
              ctx2[25],
              dirty,
              get_placeholder_slot_changes
            ),
            get_placeholder_slot_context
          );
        }
      }
      if (!current || dirty & /*classes*/
      2048 && div_class_value !== (div_class_value = /*classes*/
      ctx2[11].placeholder)) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & /*alt*/
      32) {
        attr(
          div,
          "title",
          /*alt*/
          ctx2[5]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(placeholder_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(placeholder_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (placeholder_slot_or_fallback)
        placeholder_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block$1(ctx) {
  let imageicon;
  let current;
  imageicon = new ImageIcon({
    props: { style: { width: 40, height: 40 } }
  });
  return {
    c() {
      create_component(imageicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(imageicon, target, anchor);
      current = true;
    },
    p: noop$2,
    i(local) {
      if (current)
        return;
      transition_in(imageicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(imageicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(imageicon, detaching);
    }
  };
}
function create_if_block$2(ctx) {
  let text_1;
  let current;
  text_1 = new Text({
    props: {
      class: (
        /*classes*/
        ctx[11].caption
      ),
      root: "figcaption",
      size: "sm",
      align: "center",
      $$slots: { default: [create_default_slot_1$2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(text_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(text_1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const text_1_changes = {};
      if (dirty & /*classes*/
      2048)
        text_1_changes.class = /*classes*/
        ctx2[11].caption;
      if (dirty & /*$$scope, caption*/
      33554496) {
        text_1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      text_1.$set(text_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(text_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(text_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(text_1, detaching);
    }
  };
}
function create_default_slot_1$2(ctx) {
  let t2;
  return {
    c() {
      t2 = text(
        /*caption*/
        ctx[6]
      );
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*caption*/
      64)
        set_data(
          t2,
          /*caption*/
          ctx2[6]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_default_slot$5(ctx) {
  let figure;
  let div;
  let skeleton;
  let t0;
  let div_class_value;
  let t1;
  let figure_class_value;
  let current;
  skeleton = new Skeleton$1({
    props: {
      visible: (
        /*loader*/
        ctx[7] ? (
          /*loaded*/
          ctx[8]
        ) : false
      ),
      $$slots: { default: [create_default_slot_2$1] },
      $$scope: { ctx }
    }
  });
  let if_block0 = (
    /*showPlaceholder*/
    ctx[9] && create_if_block_1$1(ctx)
  );
  let if_block1 = (
    /*caption*/
    ctx[6] && create_if_block$2(ctx)
  );
  return {
    c() {
      figure = element("figure");
      div = element("div");
      create_component(skeleton.$$.fragment);
      t0 = space();
      if (if_block0)
        if_block0.c();
      t1 = space();
      if (if_block1)
        if_block1.c();
      attr(div, "class", div_class_value = /*classes*/
      ctx[11].imageWrapper);
      attr(figure, "class", figure_class_value = /*classes*/
      ctx[11].figure);
    },
    m(target, anchor) {
      insert(target, figure, anchor);
      append(figure, div);
      mount_component(skeleton, div, null);
      append(div, t0);
      if (if_block0)
        if_block0.m(div, null);
      append(figure, t1);
      if (if_block1)
        if_block1.m(figure, null);
      current = true;
    },
    p(ctx2, dirty) {
      const skeleton_changes = {};
      if (dirty & /*loader, loaded*/
      384)
        skeleton_changes.visible = /*loader*/
        ctx2[7] ? (
          /*loaded*/
          ctx2[8]
        ) : false;
      if (dirty & /*$$scope, classes, src, alt, $$restProps, element, use*/
      33622067) {
        skeleton_changes.$$scope = { dirty, ctx: ctx2 };
      }
      skeleton.$set(skeleton_changes);
      if (
        /*showPlaceholder*/
        ctx2[9]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*showPlaceholder*/
          512) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, null);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (!current || dirty & /*classes*/
      2048 && div_class_value !== (div_class_value = /*classes*/
      ctx2[11].imageWrapper)) {
        attr(div, "class", div_class_value);
      }
      if (
        /*caption*/
        ctx2[6]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*caption*/
          64) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(figure, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!current || dirty & /*classes*/
      2048 && figure_class_value !== (figure_class_value = /*classes*/
      ctx2[11].figure)) {
        attr(figure, "class", figure_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(skeleton.$$.fragment, local);
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(skeleton.$$.fragment, local);
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(figure);
      }
      destroy_component(skeleton);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function create_fragment$5(ctx) {
  let box;
  let current;
  box = new Box({
    props: {
      class: (
        /*cx*/
        ctx[12](
          /*className*/
          ctx[3],
          /*classes*/
          ctx[11].root,
          /*getStyles*/
          ctx[10]({ css: (
            /*override*/
            ctx[2]
          ) })
        )
      ),
      $$slots: { default: [create_default_slot$5] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const box_changes = {};
      if (dirty & /*cx, className, classes, getStyles, override*/
      7180)
        box_changes.class = /*cx*/
        ctx2[12](
          /*className*/
          ctx2[3],
          /*classes*/
          ctx2[11].root,
          /*getStyles*/
          ctx2[10]({ css: (
            /*override*/
            ctx2[2]
          ) })
        );
      if (dirty & /*$$scope, classes, caption, alt, showPlaceholder, loader, loaded, src, $$restProps, element, use*/
      33623027) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = [
    "use",
    "element",
    "override",
    "radius",
    "class",
    "src",
    "alt",
    "fit",
    "width",
    "height",
    "caption",
    "usePlaceholder",
    "loader"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [], element: element2 = void 0, override = {}, radius: radius2 = 0, class: className = "", src = void 0, alt = "", fit = "cover", width = "100%", height = "auto", caption = void 0, usePlaceholder = false, loader = false } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  let loaded = false;
  let error = false;
  let showPlaceholder = false;
  const onLoad = () => $$invalidate(8, loaded = true);
  const onError = () => $$invalidate(22, error = true);
  function img_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("override" in $$new_props)
      $$invalidate(2, override = $$new_props.override);
    if ("radius" in $$new_props)
      $$invalidate(17, radius2 = $$new_props.radius);
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("src" in $$new_props)
      $$invalidate(4, src = $$new_props.src);
    if ("alt" in $$new_props)
      $$invalidate(5, alt = $$new_props.alt);
    if ("fit" in $$new_props)
      $$invalidate(18, fit = $$new_props.fit);
    if ("width" in $$new_props)
      $$invalidate(19, width = $$new_props.width);
    if ("height" in $$new_props)
      $$invalidate(20, height = $$new_props.height);
    if ("caption" in $$new_props)
      $$invalidate(6, caption = $$new_props.caption);
    if ("usePlaceholder" in $$new_props)
      $$invalidate(21, usePlaceholder = $$new_props.usePlaceholder);
    if ("loader" in $$new_props)
      $$invalidate(7, loader = $$new_props.loader);
    if ("$$scope" in $$new_props)
      $$invalidate(25, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*usePlaceholder, loaded, error*/
    6291712) {
      $$invalidate(9, showPlaceholder = usePlaceholder && (!loaded || error));
    }
    if ($$self.$$.dirty & /*radius, fit, height, width*/
    1966080) {
      $$invalidate(12, { cx: cx2, classes, getStyles } = useStyles$1({ radius: radius2, fit, height, width }, { name: "Image" }), cx2, ($$invalidate(11, classes), $$invalidate(17, radius2), $$invalidate(18, fit), $$invalidate(20, height), $$invalidate(19, width)), ($$invalidate(10, getStyles), $$invalidate(17, radius2), $$invalidate(18, fit), $$invalidate(20, height), $$invalidate(19, width)));
    }
  };
  return [
    element2,
    use,
    override,
    className,
    src,
    alt,
    caption,
    loader,
    loaded,
    showPlaceholder,
    getStyles,
    classes,
    cx2,
    forwardEvents,
    onLoad,
    onError,
    $$restProps,
    radius2,
    fit,
    width,
    height,
    usePlaceholder,
    error,
    slots,
    img_binding,
    $$scope
  ];
}
class Image extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      use: 1,
      element: 0,
      override: 2,
      radius: 17,
      class: 3,
      src: 4,
      alt: 5,
      fit: 18,
      width: 19,
      height: 20,
      caption: 6,
      usePlaceholder: 21,
      loader: 7
    });
  }
}
const Image$1 = Image;
const sizes = {
  xs: 30,
  sm: 36,
  md: 42,
  lg: 50,
  xl: 60
};
const useStyles = createStyles((theme2, { icon, iconWidth, invalid, multiline, radius: radius2, rightSectionWidth, size: size2, resize, variant: variant2, showRightSection }) => {
  return {
    root: {
      darkMode: {
        "&:disabled": {
          backgroundColor: theme2.fn.themeColor("dark", 6)
        },
        "&::placeholder": {
          color: theme2.fn.themeColor("dark", 3)
        }
      },
      position: "relative"
    },
    input: variant2 !== "headless" ? {
      height: multiline ? "auto" : typeof size2 === "number" ? `${size2}px` : sizes[size2] ?? sizes.md,
      WebkitTapHighlightColor: "transparent",
      lineHeight: multiline ? "$md" : `${sizes[size2] - 2}px`,
      appearance: "none",
      resize,
      boxSizing: "border-box",
      fontFamily: theme2.fonts.standard.value ?? "sans-serif",
      fontSize: typeof size2 === "number" ? `${size2}px` : `${size2}`,
      width: "100%",
      color: "Black",
      display: "block",
      textAlign: "left",
      minHeight: variant2 === "default" || variant2 === "filled" ? sizes[size2] ?? sizes.md : null,
      paddingLeft: variant2 === "default" && icon || variant2 === "filled" && icon ? sizes[size2] ?? sizes.md / 3 : 12,
      paddingRight: variant2 === "default" || variant2 === "filled" ? showRightSection ? rightSectionWidth : null : null,
      borderRadius: variant2 === "default" || variant2 === "filled" ? `$${radius2}` : null,
      "&:disabled": {
        backgroundColor: theme2.fn.themeColor("gray", 1),
        color: theme2.fn.themeColor("dark", 2),
        opacity: 0.6,
        cursor: "not-allowed",
        "&::placeholder": {
          color: theme2.fn.themeColor("dark", 2)
        }
      },
      "&::placeholder": {
        opacity: 1,
        userSelect: "none",
        color: theme2.fn.themeColor("gray", 5)
      },
      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button, &::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration": {
        appearance: "none"
      },
      "&[type=number]": {
        MozAppearance: "textfield"
      },
      darkMode: {
        color: theme2.fn.themeColor("dark", 0)
      }
    } : {},
    defaultVariant: {
      border: `1px solid ${theme2.fn.themeColor("gray", 4)}`,
      backgroundColor: "White",
      transition: "border-color 100ms ease",
      minHeight: sizes[size2] ?? sizes.md,
      "&:focus, &:focus-within": {
        outline: "none",
        borderColor: theme2.fn.themeColor("blue", 5)
      },
      darkMode: {
        border: `1px solid ${theme2.fn.themeColor("dark", 5)}`,
        backgroundColor: theme2.fn.themeColor("dark", 8),
        "&:focus, &:focus-within": {
          borderColor: theme2.fn.themeColor("blue", 8)
        }
      }
    },
    filledVariant: {
      border: "1px solid transparent",
      backgroundColor: theme2.fn.themeColor("gray", 1),
      minHeight: sizes[size2] ?? sizes.md,
      "&:focus, &:focus-within": {
        outline: "none",
        borderColor: `${theme2.fn.themeColor("blue", 5)} !important`
      },
      darkMode: {
        backgroundColor: theme2.fn.themeColor("dark", 5),
        "&:focus, &:focus-within": {
          borderColor: `${theme2.fn.themeColor("blue", 8)} !important`
        }
      }
    },
    unstyledVariant: {
      height: multiline ? void 0 : "auto",
      borderWidth: 0,
      color: "Black",
      backgroundColor: "transparent",
      minHeight: 28,
      outline: 0,
      "&:focus, &:focus-within": {
        outline: "none",
        borderColor: "transparent"
      },
      "&:disabled": {
        backgroundColor: "transparent",
        "&:focus, &:focus-within": {
          outline: "none",
          borderColor: "transparent"
        }
      }
    },
    withIcon: {
      paddingLeft: typeof iconWidth === "number" ? `${iconWidth}px` : sizes[size2] ?? sizes.md
    },
    iconWrapper: {
      pointerEvents: "none",
      position: "absolute",
      zIndex: 1,
      left: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: iconWidth ? `${iconWidth}px` : sizes[size2] ?? sizes.md
    },
    disabled: {
      backgroundColor: theme2.fn.themeColor("gray", 1),
      color: theme2.fn.themeColor("dark", 2),
      opacity: 0.6,
      cursor: "not-allowed",
      "&::placeholder": {
        color: theme2.fn.themeColor("dark", 2)
      },
      darkMode: {
        backgroundColor: theme2.fn.themeColor("dark", 6),
        borderColor: theme2.fn.themeColor("dark", 4)
      }
    },
    invalid: {
      color: theme2.fn.themeColor("red", 7),
      borderColor: theme2.fn.themeColor("red", 7),
      "&::placeholder": {
        opacity: 1,
        color: theme2.fn.themeColor("red", 7)
      },
      darkMode: {
        color: theme2.fn.themeColor("red", 6),
        borderColor: theme2.fn.themeColor("red", 6),
        "&::placeholder": {
          color: theme2.fn.themeColor("red", 6)
        }
      }
    },
    icon: {
      color: invalid ? theme2.fn.themeColor("red", 7) : theme2.fn.themeColor("gray", 5),
      pointerEvents: "none",
      darkMode: {
        color: invalid ? theme2.fn.themeColor("red", 6) : theme2.fn.themeColor("dark", 2)
      }
    },
    rightSection: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: rightSectionWidth
    },
    noPointerEvents: {
      pointerEvents: "none"
    }
  };
});
const get_rightSection_slot_changes$1 = (dirty) => ({});
const get_rightSection_slot_context$1 = (ctx) => ({});
const get_icon_slot_changes$1 = (dirty) => ({});
const get_icon_slot_context$1 = (ctx) => ({});
function create_if_block_5(ctx) {
  let switch_instance;
  let updating_element;
  let updating_value;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      use: [
        /*forwardEvents*/
        ctx[28],
        [
          useActions,
          /*use*/
          ctx[2]
        ]
      ]
    },
    { "aria-invalid": (
      /*invalid*/
      ctx[15]
    ) },
    {
      class: (
        /*cx*/
        ctx[26](
          /*className*/
          ctx[3],
          {
            [
              /*classes*/
              ctx[25].disabled
            ]: (
              /*disabled*/
              ctx[14]
            ),
            [
              /*classes*/
              ctx[25].invalid
            ]: (
              /*invalid*/
              ctx[15]
            ),
            [
              /*classes*/
              ctx[25].withIcon
            ]: (
              /*icon*/
              ctx[6] || /*isIconSlotUsed*/
              ctx[27]
            )
          },
          /*classes*/
          ctx[25][`${/*variant*/
          ctx[13]}Variant`] ?? {}
        )
      )
    },
    { disabled: (
      /*disabled*/
      ctx[14]
    ) },
    { required: (
      /*required*/
      ctx[12]
    ) },
    { id: (
      /*id*/
      ctx[11]
    ) },
    { type: (
      /*type*/
      ctx[17]
    ) },
    { autofocus: (
      /*autofocus*/
      ctx[19]
    ) },
    /*$$restProps*/
    ctx[33]
  ];
  function switch_instance_element_binding(value) {
    ctx[43](value);
  }
  function switch_instance_value_binding(value) {
    ctx[44](value);
  }
  var switch_value = (
    /*root*/
    ctx[5]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot_1$1] },
      $$scope: { ctx: ctx2 }
    };
    if (dirty !== void 0 && dirty[0] & /*forwardEvents, use, invalid, cx, className, classes, disabled, icon, isIconSlotUsed, variant, required, id, type, autofocus*/
    504035404 | dirty[1] & /*$$restProps*/
    4) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [
        dirty[0] & /*forwardEvents, use*/
        268435460 && {
          use: [
            /*forwardEvents*/
            ctx2[28],
            [
              useActions,
              /*use*/
              ctx2[2]
            ]
          ]
        },
        dirty[0] & /*invalid*/
        32768 && { "aria-invalid": (
          /*invalid*/
          ctx2[15]
        ) },
        dirty[0] & /*cx, className, classes, disabled, invalid, icon, isIconSlotUsed, variant*/
        234938440 && {
          class: (
            /*cx*/
            ctx2[26](
              /*className*/
              ctx2[3],
              {
                [
                  /*classes*/
                  ctx2[25].disabled
                ]: (
                  /*disabled*/
                  ctx2[14]
                ),
                [
                  /*classes*/
                  ctx2[25].invalid
                ]: (
                  /*invalid*/
                  ctx2[15]
                ),
                [
                  /*classes*/
                  ctx2[25].withIcon
                ]: (
                  /*icon*/
                  ctx2[6] || /*isIconSlotUsed*/
                  ctx2[27]
                )
              },
              /*classes*/
              ctx2[25][`${/*variant*/
              ctx2[13]}Variant`] ?? {}
            )
          )
        },
        dirty[0] & /*disabled*/
        16384 && { disabled: (
          /*disabled*/
          ctx2[14]
        ) },
        dirty[0] & /*required*/
        4096 && { required: (
          /*required*/
          ctx2[12]
        ) },
        dirty[0] & /*id*/
        2048 && { id: (
          /*id*/
          ctx2[11]
        ) },
        dirty[0] & /*type*/
        131072 && { type: (
          /*type*/
          ctx2[17]
        ) },
        dirty[0] & /*autofocus*/
        524288 && { autofocus: (
          /*autofocus*/
          ctx2[19]
        ) },
        dirty[1] & /*$$restProps*/
        4 && get_spread_object(
          /*$$restProps*/
          ctx2[33]
        )
      ]);
    } else {
      for (let i2 = 0; i2 < switch_instance_spread_levels.length; i2 += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i2]);
      }
    }
    if (
      /*element*/
      ctx2[0] !== void 0
    ) {
      switch_instance_props.element = /*element*/
      ctx2[0];
    }
    if (
      /*value*/
      ctx2[1] !== void 0
    ) {
      switch_instance_props.value = /*value*/
      ctx2[1];
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    binding_callbacks.push(() => bind(switch_instance, "element", switch_instance_element_binding));
    binding_callbacks.push(() => bind(switch_instance, "value", switch_instance_value_binding));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*root*/
      32 && switch_value !== (switch_value = /*root*/
      ctx2[5])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          binding_callbacks.push(() => bind(switch_instance, "element", switch_instance_element_binding));
          binding_callbacks.push(() => bind(switch_instance, "value", switch_instance_value_binding));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty[0] & /*forwardEvents, use, invalid, cx, className, classes, disabled, icon, isIconSlotUsed, variant, required, id, type, autofocus*/
        504035404 | dirty[1] & /*$$restProps*/
        4 ? get_spread_update(switch_instance_spread_levels, [
          dirty[0] & /*forwardEvents, use*/
          268435460 && {
            use: [
              /*forwardEvents*/
              ctx2[28],
              [
                useActions,
                /*use*/
                ctx2[2]
              ]
            ]
          },
          dirty[0] & /*invalid*/
          32768 && { "aria-invalid": (
            /*invalid*/
            ctx2[15]
          ) },
          dirty[0] & /*cx, className, classes, disabled, invalid, icon, isIconSlotUsed, variant*/
          234938440 && {
            class: (
              /*cx*/
              ctx2[26](
                /*className*/
                ctx2[3],
                {
                  [
                    /*classes*/
                    ctx2[25].disabled
                  ]: (
                    /*disabled*/
                    ctx2[14]
                  ),
                  [
                    /*classes*/
                    ctx2[25].invalid
                  ]: (
                    /*invalid*/
                    ctx2[15]
                  ),
                  [
                    /*classes*/
                    ctx2[25].withIcon
                  ]: (
                    /*icon*/
                    ctx2[6] || /*isIconSlotUsed*/
                    ctx2[27]
                  )
                },
                /*classes*/
                ctx2[25][`${/*variant*/
                ctx2[13]}Variant`] ?? {}
              )
            )
          },
          dirty[0] & /*disabled*/
          16384 && { disabled: (
            /*disabled*/
            ctx2[14]
          ) },
          dirty[0] & /*required*/
          4096 && { required: (
            /*required*/
            ctx2[12]
          ) },
          dirty[0] & /*id*/
          2048 && { id: (
            /*id*/
            ctx2[11]
          ) },
          dirty[0] & /*type*/
          131072 && { type: (
            /*type*/
            ctx2[17]
          ) },
          dirty[0] & /*autofocus*/
          524288 && { autofocus: (
            /*autofocus*/
            ctx2[19]
          ) },
          dirty[1] & /*$$restProps*/
          4 && get_spread_object(
            /*$$restProps*/
            ctx2[33]
          )
        ]) : {};
        if (dirty[1] & /*$$scope*/
        32768) {
          switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_element && dirty[0] & /*element*/
        1) {
          updating_element = true;
          switch_instance_changes.element = /*element*/
          ctx2[0];
          add_flush_callback(() => updating_element = false);
        }
        if (!updating_value && dirty[0] & /*value*/
        2) {
          updating_value = true;
          switch_instance_changes.value = /*value*/
          ctx2[1];
          add_flush_callback(() => updating_value = false);
        }
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let current;
  let svelte_element = (
    /*castRoot*/
    ctx[29]() && create_dynamic_element(ctx)
  );
  return {
    c() {
      if (svelte_element)
        svelte_element.c();
    },
    m(target, anchor) {
      if (svelte_element)
        svelte_element.m(target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*castRoot*/
        ctx2[29]()
      ) {
        svelte_element.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(svelte_element, local);
      current = true;
    },
    o(local) {
      transition_out(svelte_element, local);
      current = false;
    },
    d(detaching) {
      if (svelte_element)
        svelte_element.d(detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let input;
  let input_class_value;
  let useActions_action;
  let mounted;
  let dispose;
  let input_levels = [
    { value: (
      /*value*/
      ctx[1]
    ) },
    { type: (
      /*type*/
      ctx[17]
    ) },
    { required: (
      /*required*/
      ctx[12]
    ) },
    { disabled: (
      /*disabled*/
      ctx[14]
    ) },
    { id: (
      /*id*/
      ctx[11]
    ) },
    { placeholder: (
      /*placeholder*/
      ctx[18]
    ) },
    { autocomplete: (
      /*autocomplete*/
      ctx[16]
    ) },
    { autofocus: (
      /*autofocus*/
      ctx[19]
    ) },
    { "aria-invalid": (
      /*invalid*/
      ctx[15]
    ) },
    {
      class: input_class_value = /*cx*/
      ctx[26](
        /*className*/
        ctx[3],
        /*classes*/
        ctx[25].input,
        {
          [
            /*classes*/
            ctx[25].disabled
          ]: (
            /*disabled*/
            ctx[14]
          ),
          [
            /*classes*/
            ctx[25].invalid
          ]: (
            /*invalid*/
            ctx[15]
          ),
          [
            /*classes*/
            ctx[25].withIcon
          ]: (
            /*icon*/
            ctx[6] || /*isIconSlotUsed*/
            ctx[27]
          )
        },
        /*classes*/
        ctx[25][`${/*variant*/
        ctx[13]}Variant`] ?? {}
      )
    },
    /*$$restProps*/
    ctx[33]
  ];
  let input_data = {};
  for (let i2 = 0; i2 < input_levels.length; i2 += 1) {
    input_data = assign(input_data, input_levels[i2]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if ("value" in input_data) {
        input.value = input_data.value;
      }
      if (input.autofocus)
        input.focus();
      ctx[41](input);
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(
            null,
            input,
            /*use*/
            ctx[2]
          )),
          action_destroyer(
            /*forwardEvents*/
            ctx[28].call(null, input)
          ),
          listen(
            input,
            "input",
            /*onInput*/
            ctx[31]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & /*value*/
        2 && input.value !== /*value*/
        ctx2[1] && { value: (
          /*value*/
          ctx2[1]
        ) },
        dirty[0] & /*type*/
        131072 && { type: (
          /*type*/
          ctx2[17]
        ) },
        dirty[0] & /*required*/
        4096 && { required: (
          /*required*/
          ctx2[12]
        ) },
        dirty[0] & /*disabled*/
        16384 && { disabled: (
          /*disabled*/
          ctx2[14]
        ) },
        dirty[0] & /*id*/
        2048 && { id: (
          /*id*/
          ctx2[11]
        ) },
        dirty[0] & /*placeholder*/
        262144 && { placeholder: (
          /*placeholder*/
          ctx2[18]
        ) },
        dirty[0] & /*autocomplete*/
        65536 && { autocomplete: (
          /*autocomplete*/
          ctx2[16]
        ) },
        dirty[0] & /*autofocus*/
        524288 && { autofocus: (
          /*autofocus*/
          ctx2[19]
        ) },
        dirty[0] & /*invalid*/
        32768 && { "aria-invalid": (
          /*invalid*/
          ctx2[15]
        ) },
        dirty[0] & /*cx, className, classes, disabled, invalid, icon, isIconSlotUsed, variant*/
        234938440 && input_class_value !== (input_class_value = /*cx*/
        ctx2[26](
          /*className*/
          ctx2[3],
          /*classes*/
          ctx2[25].input,
          {
            [
              /*classes*/
              ctx2[25].disabled
            ]: (
              /*disabled*/
              ctx2[14]
            ),
            [
              /*classes*/
              ctx2[25].invalid
            ]: (
              /*invalid*/
              ctx2[15]
            ),
            [
              /*classes*/
              ctx2[25].withIcon
            ]: (
              /*icon*/
              ctx2[6] || /*isIconSlotUsed*/
              ctx2[27]
            )
          },
          /*classes*/
          ctx2[25][`${/*variant*/
          ctx2[13]}Variant`] ?? {}
        )) && { class: input_class_value },
        dirty[1] & /*$$restProps*/
        4 && /*$$restProps*/
        ctx2[33]
      ]));
      if ("value" in input_data) {
        input.value = input_data.value;
      }
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/
      4)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[2]
        );
    },
    i: noop$2,
    o: noop$2,
    d(detaching) {
      if (detaching) {
        detach(input);
      }
      ctx[41](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_default_slot_1$1(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[40].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[46],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        32768)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[46],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[46]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[46],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_dynamic_element(ctx) {
  let svelte_element;
  let svelte_element_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[40].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[46],
    null
  );
  let svelte_element_levels = [
    { value: (
      /*value*/
      ctx[1]
    ) },
    { required: (
      /*required*/
      ctx[12]
    ) },
    { disabled: (
      /*disabled*/
      ctx[14]
    ) },
    { id: (
      /*id*/
      ctx[11]
    ) },
    { placeholder: (
      /*placeholder*/
      ctx[18]
    ) },
    { autocomplete: (
      /*autocomplete*/
      ctx[16]
    ) },
    { type: (
      /*type*/
      ctx[17]
    ) },
    { autofocus: (
      /*autofocus*/
      ctx[19]
    ) },
    { "aria-invalid": (
      /*invalid*/
      ctx[15]
    ) },
    {
      class: svelte_element_class_value = /*cx*/
      ctx[26](
        /*className*/
        ctx[3],
        /*classes*/
        ctx[25].input,
        {
          [
            /*classes*/
            ctx[25].disabled
          ]: (
            /*disabled*/
            ctx[14]
          ),
          [
            /*classes*/
            ctx[25].invalid
          ]: (
            /*invalid*/
            ctx[15]
          ),
          [
            /*classes*/
            ctx[25].withIcon
          ]: (
            /*icon*/
            ctx[6] || /*isIconSlotUsed*/
            ctx[27]
          )
        },
        /*classes*/
        ctx[25][`${/*variant*/
        ctx[13]}Variant`] ?? {}
      )
    },
    /*$$restProps*/
    ctx[33]
  ];
  let svelte_element_data = {};
  for (let i2 = 0; i2 < svelte_element_levels.length; i2 += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i2]);
  }
  return {
    c() {
      svelte_element = element(
        /*castRoot*/
        ctx[29]()
      );
      if (default_slot)
        default_slot.c();
      set_dynamic_element_data(
        /*castRoot*/
        ctx[29]()
      )(svelte_element, svelte_element_data);
      toggle_class(
        svelte_element,
        "disabled",
        /*disabled*/
        ctx[14]
      );
      toggle_class(
        svelte_element,
        "invalid",
        /*invalid*/
        ctx[15]
      );
    },
    m(target, anchor) {
      insert(target, svelte_element, anchor);
      if (default_slot) {
        default_slot.m(svelte_element, null);
      }
      ctx[42](svelte_element);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            svelte_element,
            "change",
            /*onChange*/
            ctx[30]
          ),
          listen(
            svelte_element,
            "input",
            /*onInput*/
            ctx[31]
          ),
          action_destroyer(useActions_action = useActions.call(
            null,
            svelte_element,
            /*use*/
            ctx[2]
          )),
          action_destroyer(
            /*forwardEvents*/
            ctx[28].call(null, svelte_element)
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        32768)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[46],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[46]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[46],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_dynamic_element_data(
        /*castRoot*/
        ctx2[29]()
      )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
        (!current || dirty[0] & /*value*/
        2) && { value: (
          /*value*/
          ctx2[1]
        ) },
        (!current || dirty[0] & /*required*/
        4096) && { required: (
          /*required*/
          ctx2[12]
        ) },
        (!current || dirty[0] & /*disabled*/
        16384) && { disabled: (
          /*disabled*/
          ctx2[14]
        ) },
        (!current || dirty[0] & /*id*/
        2048) && { id: (
          /*id*/
          ctx2[11]
        ) },
        (!current || dirty[0] & /*placeholder*/
        262144) && { placeholder: (
          /*placeholder*/
          ctx2[18]
        ) },
        (!current || dirty[0] & /*autocomplete*/
        65536) && { autocomplete: (
          /*autocomplete*/
          ctx2[16]
        ) },
        (!current || dirty[0] & /*type*/
        131072) && { type: (
          /*type*/
          ctx2[17]
        ) },
        (!current || dirty[0] & /*autofocus*/
        524288) && { autofocus: (
          /*autofocus*/
          ctx2[19]
        ) },
        (!current || dirty[0] & /*invalid*/
        32768) && { "aria-invalid": (
          /*invalid*/
          ctx2[15]
        ) },
        (!current || dirty[0] & /*cx, className, classes, disabled, invalid, icon, isIconSlotUsed, variant*/
        234938440 && svelte_element_class_value !== (svelte_element_class_value = /*cx*/
        ctx2[26](
          /*className*/
          ctx2[3],
          /*classes*/
          ctx2[25].input,
          {
            [
              /*classes*/
              ctx2[25].disabled
            ]: (
              /*disabled*/
              ctx2[14]
            ),
            [
              /*classes*/
              ctx2[25].invalid
            ]: (
              /*invalid*/
              ctx2[15]
            ),
            [
              /*classes*/
              ctx2[25].withIcon
            ]: (
              /*icon*/
              ctx2[6] || /*isIconSlotUsed*/
              ctx2[27]
            )
          },
          /*classes*/
          ctx2[25][`${/*variant*/
          ctx2[13]}Variant`] ?? {}
        ))) && { class: svelte_element_class_value },
        dirty[1] & /*$$restProps*/
        4 && /*$$restProps*/
        ctx2[33]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/
      4)
        useActions_action.update.call(
          null,
          /*use*/
          ctx2[2]
        );
      toggle_class(
        svelte_element,
        "disabled",
        /*disabled*/
        ctx2[14]
      );
      toggle_class(
        svelte_element,
        "invalid",
        /*invalid*/
        ctx2[15]
      );
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element);
      }
      if (default_slot)
        default_slot.d(detaching);
      ctx[42](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_2(ctx) {
  let div;
  let iconrenderer;
  let div_class_value;
  let current;
  iconrenderer = new IconRenderer$1({
    props: {
      icon: (
        /*icon*/
        ctx[6]
      ),
      iconProps: (
        /*iconProps*/
        ctx[7]
      ),
      iconSize: 16
    }
  });
  return {
    c() {
      div = element("div");
      create_component(iconrenderer.$$.fragment);
      attr(div, "class", div_class_value = /*classes*/
      ctx[25].icon);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(iconrenderer, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const iconrenderer_changes = {};
      if (dirty[0] & /*icon*/
      64)
        iconrenderer_changes.icon = /*icon*/
        ctx2[6];
      if (dirty[0] & /*iconProps*/
      128)
        iconrenderer_changes.iconProps = /*iconProps*/
        ctx2[7];
      iconrenderer.$set(iconrenderer_changes);
      if (!current || dirty[0] & /*classes*/
      33554432 && div_class_value !== (div_class_value = /*classes*/
      ctx2[25].icon)) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(iconrenderer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(iconrenderer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(iconrenderer);
    }
  };
}
function fallback_block(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*icon*/
    ctx[6] && create_if_block_2(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*icon*/
        ctx2[6]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*icon*/
          64) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  let iconrenderer;
  let div_class_value;
  let current;
  iconrenderer = new IconRenderer$1({
    props: {
      icon: (
        /*icon*/
        ctx[6]
      ),
      iconProps: (
        /*iconProps*/
        ctx[7]
      ),
      iconSize: 16
    }
  });
  return {
    c() {
      div = element("div");
      create_component(iconrenderer.$$.fragment);
      attr(div, "class", div_class_value = /*cx*/
      ctx[26](
        /*classes*/
        ctx[25].icon,
        /*classes*/
        ctx[25].iconWrapper
      ));
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(iconrenderer, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const iconrenderer_changes = {};
      if (dirty[0] & /*icon*/
      64)
        iconrenderer_changes.icon = /*icon*/
        ctx2[6];
      if (dirty[0] & /*iconProps*/
      128)
        iconrenderer_changes.iconProps = /*iconProps*/
        ctx2[7];
      iconrenderer.$set(iconrenderer_changes);
      if (!current || dirty[0] & /*cx, classes*/
      100663296 && div_class_value !== (div_class_value = /*cx*/
      ctx2[26](
        /*classes*/
        ctx2[25].icon,
        /*classes*/
        ctx2[25].iconWrapper
      ))) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(iconrenderer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(iconrenderer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(iconrenderer);
    }
  };
}
function create_if_block$1(ctx) {
  let div;
  let div_class_value;
  let current;
  const rightSection_slot_template = (
    /*#slots*/
    ctx[40].rightSection
  );
  const rightSection_slot = create_slot(
    rightSection_slot_template,
    ctx,
    /*$$scope*/
    ctx[46],
    get_rightSection_slot_context$1
  );
  let div_levels = [
    /*rightSectionProps*/
    ctx[9],
    {
      class: div_class_value = /*cx*/
      ctx[26](
        /*classes*/
        ctx[25].rightSection,
        {
          [
            /*classes*/
            ctx[25].noPointerEvents
          ]: (
            /*noPointerEventsRightSection*/
            ctx[20]
          )
        }
      )
    }
  ];
  let div_data = {};
  for (let i2 = 0; i2 < div_levels.length; i2 += 1) {
    div_data = assign(div_data, div_levels[i2]);
  }
  return {
    c() {
      div = element("div");
      if (rightSection_slot)
        rightSection_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (rightSection_slot) {
        rightSection_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (rightSection_slot) {
        if (rightSection_slot.p && (!current || dirty[1] & /*$$scope*/
        32768)) {
          update_slot_base(
            rightSection_slot,
            rightSection_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[46],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[46]
            ) : get_slot_changes(
              rightSection_slot_template,
              /*$$scope*/
              ctx2[46],
              dirty,
              get_rightSection_slot_changes$1
            ),
            get_rightSection_slot_context$1
          );
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty[0] & /*rightSectionProps*/
        512 && /*rightSectionProps*/
        ctx2[9],
        (!current || dirty[0] & /*cx, classes, noPointerEventsRightSection*/
        101711872 && div_class_value !== (div_class_value = /*cx*/
        ctx2[26](
          /*classes*/
          ctx2[25].rightSection,
          {
            [
              /*classes*/
              ctx2[25].noPointerEvents
            ]: (
              /*noPointerEventsRightSection*/
              ctx2[20]
            )
          }
        ))) && { class: div_class_value }
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(rightSection_slot, local);
      current = true;
    },
    o(local) {
      transition_out(rightSection_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (rightSection_slot)
        rightSection_slot.d(detaching);
    }
  };
}
function create_default_slot$4(ctx) {
  let show_if;
  let current_block_type_index;
  let if_block0;
  let t0;
  let span;
  let span_class_value;
  let t1;
  let t2;
  let if_block2_anchor;
  let current;
  const if_block_creators = [create_if_block_3, create_if_block_4, create_if_block_5];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (dirty[0] & /*isHTMLElement, root*/
    4194336)
      show_if = null;
    if (
      /*isHTMLElement*/
      ctx2[22] && /*root*/
      ctx2[5] === "input"
    )
      return 0;
    if (show_if == null)
      show_if = !!/*isHTMLElement*/
      (ctx2[22] && isInput(String(
        /*root*/
        ctx2[5]
      )));
    if (show_if)
      return 1;
    if (
      /*isComponent*/
      ctx2[23] && typeof /*root*/
      ctx2[5] !== "string"
    )
      return 2;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, [-1, -1]))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  const icon_slot_template = (
    /*#slots*/
    ctx[40].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[46],
    get_icon_slot_context$1
  );
  const icon_slot_or_fallback = icon_slot || fallback_block(ctx);
  let if_block1 = (
    /*icon*/
    ctx[6] && /*$$slots*/
    ctx[32].icon && !/*isIconSlotUsed*/
    ctx[27] && create_if_block_1(ctx)
  );
  let if_block2 = (
    /*showRightSection*/
    ctx[8] && create_if_block$1(ctx)
  );
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t0 = space();
      span = element("span");
      if (icon_slot_or_fallback)
        icon_slot_or_fallback.c();
      t1 = space();
      if (if_block1)
        if_block1.c();
      t2 = space();
      if (if_block2)
        if_block2.c();
      if_block2_anchor = empty();
      attr(span, "class", span_class_value = /*cx*/
      ctx[26]({
        [
          /*classes*/
          ctx[25].iconWrapper
        ]: !!/*icon*/
        ctx[6] || /*isIconSlotUsed*/
        ctx[27]
      }));
    },
    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, t0, anchor);
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      ctx[45](span);
      insert(target, t1, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, t2, anchor);
      if (if_block2)
        if_block2.m(target, anchor);
      insert(target, if_block2_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(t0.parentNode, t0);
        } else {
          if_block0 = null;
        }
      }
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[1] & /*$$scope*/
        32768)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[46],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[46]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[46],
              dirty,
              get_icon_slot_changes$1
            ),
            get_icon_slot_context$1
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*classes, icon, iconProps*/
        33554624)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1] : dirty);
        }
      }
      if (!current || dirty[0] & /*cx, classes, icon, isIconSlotUsed*/
      234881088 && span_class_value !== (span_class_value = /*cx*/
      ctx2[26]({
        [
          /*classes*/
          ctx2[25].iconWrapper
        ]: !!/*icon*/
        ctx2[6] || /*isIconSlotUsed*/
        ctx2[27]
      }))) {
        attr(span, "class", span_class_value);
      }
      if (
        /*icon*/
        ctx2[6] && /*$$slots*/
        ctx2[32].icon && !/*isIconSlotUsed*/
        ctx2[27]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & /*icon, isIconSlotUsed*/
          134217792 | dirty[1] & /*$$slots*/
          2) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t2.parentNode, t2);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*showRightSection*/
        ctx2[8]
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty[0] & /*showRightSection*/
          256) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$1(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(icon_slot_or_fallback, local);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(icon_slot_or_fallback, local);
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(span);
        detach(t1);
        detach(t2);
        detach(if_block2_anchor);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
      if (icon_slot_or_fallback)
        icon_slot_or_fallback.d(detaching);
      ctx[45](null);
      if (if_block1)
        if_block1.d(detaching);
      if (if_block2)
        if_block2.d(detaching);
    }
  };
}
function create_fragment$4(ctx) {
  let box;
  let current;
  const box_spread_levels = [
    /*wrapperProps*/
    ctx[10],
    {
      class: (
        /*cx*/
        ctx[26](
          /*classes*/
          ctx[25].root,
          /*getStyles*/
          ctx[24]({ css: (
            /*override*/
            ctx[4]
          ) })
        )
      )
    },
    /*$$restProps*/
    ctx[33]
  ];
  let box_props = {
    $$slots: { default: [create_default_slot$4] },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < box_spread_levels.length; i2 += 1) {
    box_props = assign(box_props, box_spread_levels[i2]);
  }
  box = new Box({ props: box_props });
  return {
    c() {
      create_component(box.$$.fragment);
    },
    m(target, anchor) {
      mount_component(box, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const box_changes = dirty[0] & /*wrapperProps, cx, classes, getStyles, override*/
      117441552 | dirty[1] & /*$$restProps*/
      4 ? get_spread_update(box_spread_levels, [
        dirty[0] & /*wrapperProps*/
        1024 && get_spread_object(
          /*wrapperProps*/
          ctx2[10]
        ),
        dirty[0] & /*cx, classes, getStyles, override*/
        117440528 && {
          class: (
            /*cx*/
            ctx2[26](
              /*classes*/
              ctx2[25].root,
              /*getStyles*/
              ctx2[24]({ css: (
                /*override*/
                ctx2[4]
              ) })
            )
          )
        },
        dirty[1] & /*$$restProps*/
        4 && get_spread_object(
          /*$$restProps*/
          ctx2[33]
        )
      ]) : {};
      if (dirty[0] & /*rightSectionProps, cx, classes, noPointerEventsRightSection, showRightSection, icon, iconProps, isIconSlotUsed, iconElement, value, type, required, disabled, id, placeholder, autocomplete, autofocus, invalid, className, variant, element, use, isHTMLElement, root, isComponent*/
      251657199 | dirty[1] & /*$$scope, $$slots, $$restProps*/
      32774) {
        box_changes.$$scope = { dirty, ctx: ctx2 };
      }
      box.$set(box_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(box.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(box.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(box, detaching);
    }
  };
}
function isInput(root) {
  return ["input", "select", "textarea", "datalist"].includes(root);
}
function instance$4($$self, $$props, $$invalidate) {
  let isIconSlotUsed;
  let cx2;
  let classes;
  let getStyles;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "override",
    "root",
    "icon",
    "iconWidth",
    "iconProps",
    "showRightSection",
    "rightSectionWidth",
    "rightSectionProps",
    "wrapperProps",
    "id",
    "required",
    "radius",
    "variant",
    "disabled",
    "size",
    "value",
    "invalid",
    "multiline",
    "autocomplete",
    "type",
    "placeholder",
    "autofocus",
    "resize",
    "noPointerEventsRightSection"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { use = [], element: element2 = void 0, class: className = "", override = {}, root = "input", icon = null, iconWidth = 36, iconProps = { size: 20, color: "currentColor" }, showRightSection = $$slots.rightSection, rightSectionWidth = 36, rightSectionProps = {}, wrapperProps = {}, id = "input-id", required = false, radius: radius2 = "sm", variant: variant2 = "default", disabled = false, size: size2 = "sm", value = "", invalid = false, multiline = false, autocomplete = "on", type = "text", placeholder = void 0, autofocus = void 0, resize = "none", noPointerEventsRightSection = false } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  function castRoot() {
    return root;
  }
  let isHTMLElement = true;
  let isComponent = false;
  let iconElement;
  function onChange() {
    $$invalidate(1, value = this.value);
  }
  function onInput(event) {
    if (event.target.type === "checkbox") {
      $$invalidate(1, value = event.target.checked);
    } else if (event.target.type === "number" || event.target.type === "range") {
      $$invalidate(1, value = +event.target.value);
    } else {
      $$invalidate(1, value = event.target.value);
    }
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  function svelte_element_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  function switch_instance_element_binding(value2) {
    element2 = value2;
    $$invalidate(0, element2);
  }
  function switch_instance_value_binding(value$1) {
    value = value$1;
    $$invalidate(1, value);
  }
  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      iconElement = $$value;
      $$invalidate(21, iconElement);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(33, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(2, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(4, override = $$new_props.override);
    if ("root" in $$new_props)
      $$invalidate(5, root = $$new_props.root);
    if ("icon" in $$new_props)
      $$invalidate(6, icon = $$new_props.icon);
    if ("iconWidth" in $$new_props)
      $$invalidate(34, iconWidth = $$new_props.iconWidth);
    if ("iconProps" in $$new_props)
      $$invalidate(7, iconProps = $$new_props.iconProps);
    if ("showRightSection" in $$new_props)
      $$invalidate(8, showRightSection = $$new_props.showRightSection);
    if ("rightSectionWidth" in $$new_props)
      $$invalidate(35, rightSectionWidth = $$new_props.rightSectionWidth);
    if ("rightSectionProps" in $$new_props)
      $$invalidate(9, rightSectionProps = $$new_props.rightSectionProps);
    if ("wrapperProps" in $$new_props)
      $$invalidate(10, wrapperProps = $$new_props.wrapperProps);
    if ("id" in $$new_props)
      $$invalidate(11, id = $$new_props.id);
    if ("required" in $$new_props)
      $$invalidate(12, required = $$new_props.required);
    if ("radius" in $$new_props)
      $$invalidate(36, radius2 = $$new_props.radius);
    if ("variant" in $$new_props)
      $$invalidate(13, variant2 = $$new_props.variant);
    if ("disabled" in $$new_props)
      $$invalidate(14, disabled = $$new_props.disabled);
    if ("size" in $$new_props)
      $$invalidate(37, size2 = $$new_props.size);
    if ("value" in $$new_props)
      $$invalidate(1, value = $$new_props.value);
    if ("invalid" in $$new_props)
      $$invalidate(15, invalid = $$new_props.invalid);
    if ("multiline" in $$new_props)
      $$invalidate(38, multiline = $$new_props.multiline);
    if ("autocomplete" in $$new_props)
      $$invalidate(16, autocomplete = $$new_props.autocomplete);
    if ("type" in $$new_props)
      $$invalidate(17, type = $$new_props.type);
    if ("placeholder" in $$new_props)
      $$invalidate(18, placeholder = $$new_props.placeholder);
    if ("autofocus" in $$new_props)
      $$invalidate(19, autofocus = $$new_props.autofocus);
    if ("resize" in $$new_props)
      $$invalidate(39, resize = $$new_props.resize);
    if ("noPointerEventsRightSection" in $$new_props)
      $$invalidate(20, noPointerEventsRightSection = $$new_props.noPointerEventsRightSection);
    if ("$$scope" in $$new_props)
      $$invalidate(46, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*iconElement*/
    2097152) {
      $$invalidate(27, isIconSlotUsed = Boolean(iconElement == null ? void 0 : iconElement.innerHTML));
    }
    if ($$self.$$.dirty[0] & /*root*/
    32) {
      {
        $$invalidate(22, isHTMLElement = root && typeof root === "string");
        $$invalidate(23, isComponent = root && typeof root === "function");
      }
    }
    if ($$self.$$.dirty[0] & /*icon, invalid, showRightSection, variant*/
    41280 | $$self.$$.dirty[1] & /*iconWidth, multiline, radius, rightSectionWidth, size, resize*/
    504) {
      $$invalidate(
        26,
        { cx: cx2, classes, getStyles } = useStyles(
          {
            icon,
            iconWidth,
            invalid,
            multiline,
            radius: radius2,
            rightSectionWidth,
            showRightSection,
            size: size2,
            resize,
            variant: variant2
          },
          { name: "Input" }
        ),
        cx2,
        ($$invalidate(25, classes), $$invalidate(6, icon), $$invalidate(34, iconWidth), $$invalidate(15, invalid), $$invalidate(38, multiline), $$invalidate(36, radius2), $$invalidate(35, rightSectionWidth), $$invalidate(8, showRightSection), $$invalidate(37, size2), $$invalidate(39, resize), $$invalidate(13, variant2)),
        ($$invalidate(24, getStyles), $$invalidate(6, icon), $$invalidate(34, iconWidth), $$invalidate(15, invalid), $$invalidate(38, multiline), $$invalidate(36, radius2), $$invalidate(35, rightSectionWidth), $$invalidate(8, showRightSection), $$invalidate(37, size2), $$invalidate(39, resize), $$invalidate(13, variant2))
      );
    }
  };
  return [
    element2,
    value,
    use,
    className,
    override,
    root,
    icon,
    iconProps,
    showRightSection,
    rightSectionProps,
    wrapperProps,
    id,
    required,
    variant2,
    disabled,
    invalid,
    autocomplete,
    type,
    placeholder,
    autofocus,
    noPointerEventsRightSection,
    iconElement,
    isHTMLElement,
    isComponent,
    getStyles,
    classes,
    cx2,
    isIconSlotUsed,
    forwardEvents,
    castRoot,
    onChange,
    onInput,
    $$slots,
    $$restProps,
    iconWidth,
    rightSectionWidth,
    radius2,
    size2,
    multiline,
    resize,
    slots,
    input_binding,
    svelte_element_binding,
    switch_instance_element_binding,
    switch_instance_value_binding,
    span_binding,
    $$scope
  ];
}
class Input extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$4,
      create_fragment$4,
      safe_not_equal,
      {
        use: 2,
        element: 0,
        class: 3,
        override: 4,
        root: 5,
        icon: 6,
        iconWidth: 34,
        iconProps: 7,
        showRightSection: 8,
        rightSectionWidth: 35,
        rightSectionProps: 9,
        wrapperProps: 10,
        id: 11,
        required: 12,
        radius: 36,
        variant: 13,
        disabled: 14,
        size: 37,
        value: 1,
        invalid: 15,
        multiline: 38,
        autocomplete: 16,
        type: 17,
        placeholder: 18,
        autofocus: 19,
        resize: 39,
        noPointerEventsRightSection: 20
      },
      null,
      [-1, -1]
    );
  }
}
const get_rightSection_slot_changes = (dirty) => ({});
const get_rightSection_slot_context = (ctx) => ({ slot: "rightSection" });
const get_icon_slot_changes = (dirty) => ({});
const get_icon_slot_context = (ctx) => ({ slot: "icon" });
function create_rightSection_slot(ctx) {
  let current;
  const rightSection_slot_template = (
    /*#slots*/
    ctx[22].rightSection
  );
  const rightSection_slot = create_slot(
    rightSection_slot_template,
    ctx,
    /*$$scope*/
    ctx[25],
    get_rightSection_slot_context
  );
  return {
    c() {
      if (rightSection_slot)
        rightSection_slot.c();
    },
    m(target, anchor) {
      if (rightSection_slot) {
        rightSection_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (rightSection_slot) {
        if (rightSection_slot.p && (!current || dirty & /*$$scope*/
        33554432)) {
          update_slot_base(
            rightSection_slot,
            rightSection_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[25],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[25]
            ) : get_slot_changes(
              rightSection_slot_template,
              /*$$scope*/
              ctx2[25],
              dirty,
              get_rightSection_slot_changes
            ),
            get_rightSection_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(rightSection_slot, local);
      current = true;
    },
    o(local) {
      transition_out(rightSection_slot, local);
      current = false;
    },
    d(detaching) {
      if (rightSection_slot)
        rightSection_slot.d(detaching);
    }
  };
}
function create_icon_slot(ctx) {
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[22].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[25],
    get_icon_slot_context
  );
  return {
    c() {
      if (icon_slot)
        icon_slot.c();
    },
    m(target, anchor) {
      if (icon_slot) {
        icon_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty & /*$$scope*/
        33554432)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[25],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[25]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[25],
              dirty,
              get_icon_slot_changes
            ),
            get_icon_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(icon_slot, local);
      current = true;
    },
    o(local) {
      transition_out(icon_slot, local);
      current = false;
    },
    d(detaching) {
      if (icon_slot)
        icon_slot.d(detaching);
    }
  };
}
function create_default_slot$3(ctx) {
  let input;
  let updating_value;
  let current;
  const input_spread_levels = [
    { required: (
      /*required*/
      ctx[8]
    ) },
    { size: (
      /*size*/
      ctx[14]
    ) },
    { id: (
      /*id*/
      ctx[12]
    ) },
    { placeholder: (
      /*placeholder*/
      ctx[15]
    ) },
    /*$$restProps*/
    ctx[19],
    {
      use: [
        /*forwardEvents*/
        ctx[17],
        [
          useActions,
          /*use*/
          ctx[2]
        ]
      ]
    },
    { invalid: (
      /*_invalid*/
      ctx[16]
    ) },
    {
      showRightSection: (
        /*_showRightSection*/
        ctx[18]
      )
    }
  ];
  function input_value_binding(value) {
    ctx[23](value);
  }
  let input_props = {
    $$slots: {
      icon: [create_icon_slot],
      rightSection: [create_rightSection_slot]
    },
    $$scope: { ctx }
  };
  for (let i2 = 0; i2 < input_spread_levels.length; i2 += 1) {
    input_props = assign(input_props, input_spread_levels[i2]);
  }
  if (
    /*value*/
    ctx[1] !== void 0
  ) {
    input_props.value = /*value*/
    ctx[1];
  }
  input = new Input({ props: input_props });
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const input_changes = dirty & /*required, size, id, placeholder, $$restProps, forwardEvents, use, _invalid, _showRightSection*/
      1036548 ? get_spread_update(input_spread_levels, [
        dirty & /*required*/
        256 && { required: (
          /*required*/
          ctx2[8]
        ) },
        dirty & /*size*/
        16384 && { size: (
          /*size*/
          ctx2[14]
        ) },
        dirty & /*id*/
        4096 && { id: (
          /*id*/
          ctx2[12]
        ) },
        dirty & /*placeholder*/
        32768 && { placeholder: (
          /*placeholder*/
          ctx2[15]
        ) },
        dirty & /*$$restProps*/
        524288 && get_spread_object(
          /*$$restProps*/
          ctx2[19]
        ),
        dirty & /*forwardEvents, use*/
        131076 && {
          use: [
            /*forwardEvents*/
            ctx2[17],
            [
              useActions,
              /*use*/
              ctx2[2]
            ]
          ]
        },
        dirty & /*_invalid*/
        65536 && { invalid: (
          /*_invalid*/
          ctx2[16]
        ) },
        dirty & /*_showRightSection*/
        262144 && {
          showRightSection: (
            /*_showRightSection*/
            ctx2[18]
          )
        }
      ]) : {};
      if (dirty & /*$$scope*/
      33554432) {
        input_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_value && dirty & /*value*/
      2) {
        updating_value = true;
        input_changes.value = /*value*/
        ctx2[1];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(input, detaching);
    }
  };
}
function create_fragment$3(ctx) {
  let inputwrapper;
  let updating_element;
  let current;
  function inputwrapper_element_binding(value) {
    ctx[24](value);
  }
  let inputwrapper_props = {
    class: (
      /*className*/
      ctx[3]
    ),
    override: (
      /*override*/
      ctx[4]
    ),
    label: (
      /*label*/
      ctx[5]
    ),
    description: (
      /*description*/
      ctx[6]
    ),
    error: (
      /*error*/
      ctx[7]
    ),
    required: (
      /*required*/
      ctx[8]
    ),
    labelProps: (
      /*labelProps*/
      ctx[9]
    ),
    descriptionProps: (
      /*descriptionProps*/
      ctx[10]
    ),
    errorProps: (
      /*errorProps*/
      ctx[11]
    ),
    id: (
      /*id*/
      ctx[12]
    ),
    labelElement: (
      /*labelElement*/
      ctx[13]
    ),
    size: (
      /*size*/
      ctx[14]
    ),
    $$slots: { default: [create_default_slot$3] },
    $$scope: { ctx }
  };
  if (
    /*element*/
    ctx[0] !== void 0
  ) {
    inputwrapper_props.element = /*element*/
    ctx[0];
  }
  inputwrapper = new InputWrapper({ props: inputwrapper_props });
  binding_callbacks.push(() => bind(inputwrapper, "element", inputwrapper_element_binding));
  return {
    c() {
      create_component(inputwrapper.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputwrapper, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const inputwrapper_changes = {};
      if (dirty & /*className*/
      8)
        inputwrapper_changes.class = /*className*/
        ctx2[3];
      if (dirty & /*override*/
      16)
        inputwrapper_changes.override = /*override*/
        ctx2[4];
      if (dirty & /*label*/
      32)
        inputwrapper_changes.label = /*label*/
        ctx2[5];
      if (dirty & /*description*/
      64)
        inputwrapper_changes.description = /*description*/
        ctx2[6];
      if (dirty & /*error*/
      128)
        inputwrapper_changes.error = /*error*/
        ctx2[7];
      if (dirty & /*required*/
      256)
        inputwrapper_changes.required = /*required*/
        ctx2[8];
      if (dirty & /*labelProps*/
      512)
        inputwrapper_changes.labelProps = /*labelProps*/
        ctx2[9];
      if (dirty & /*descriptionProps*/
      1024)
        inputwrapper_changes.descriptionProps = /*descriptionProps*/
        ctx2[10];
      if (dirty & /*errorProps*/
      2048)
        inputwrapper_changes.errorProps = /*errorProps*/
        ctx2[11];
      if (dirty & /*id*/
      4096)
        inputwrapper_changes.id = /*id*/
        ctx2[12];
      if (dirty & /*labelElement*/
      8192)
        inputwrapper_changes.labelElement = /*labelElement*/
        ctx2[13];
      if (dirty & /*size*/
      16384)
        inputwrapper_changes.size = /*size*/
        ctx2[14];
      if (dirty & /*$$scope, required, size, id, placeholder, $$restProps, use, _invalid, value*/
      34197766) {
        inputwrapper_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_element && dirty & /*element*/
      1) {
        updating_element = true;
        inputwrapper_changes.element = /*element*/
        ctx2[0];
        add_flush_callback(() => updating_element = false);
      }
      inputwrapper.$set(inputwrapper_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputwrapper.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputwrapper.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputwrapper, detaching);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let _invalid;
  const omit_props_names = [
    "use",
    "element",
    "class",
    "override",
    "label",
    "description",
    "error",
    "required",
    "labelProps",
    "descriptionProps",
    "errorProps",
    "invalid",
    "id",
    "labelElement",
    "size",
    "showRightSection",
    "value",
    "placeholder"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { use = [], element: element2 = void 0, class: className = "", override = {}, label = "", description = null, error = null, required = false, labelProps = {}, descriptionProps = {}, errorProps = {}, invalid = false, id = randomID("text-input"), labelElement = "label", size: size2 = "sm", showRightSection = void 0, value = "", placeholder = "" } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  const _showRightSection = showRightSection === void 0 ? !!$$slots.rightSection : showRightSection;
  function input_value_binding(value$1) {
    value = value$1;
    $$invalidate(1, value);
  }
  function inputwrapper_element_binding(value2) {
    element2 = value2;
    $$invalidate(0, element2);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(19, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(2, use = $$new_props.use);
    if ("element" in $$new_props)
      $$invalidate(0, element2 = $$new_props.element);
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("override" in $$new_props)
      $$invalidate(4, override = $$new_props.override);
    if ("label" in $$new_props)
      $$invalidate(5, label = $$new_props.label);
    if ("description" in $$new_props)
      $$invalidate(6, description = $$new_props.description);
    if ("error" in $$new_props)
      $$invalidate(7, error = $$new_props.error);
    if ("required" in $$new_props)
      $$invalidate(8, required = $$new_props.required);
    if ("labelProps" in $$new_props)
      $$invalidate(9, labelProps = $$new_props.labelProps);
    if ("descriptionProps" in $$new_props)
      $$invalidate(10, descriptionProps = $$new_props.descriptionProps);
    if ("errorProps" in $$new_props)
      $$invalidate(11, errorProps = $$new_props.errorProps);
    if ("invalid" in $$new_props)
      $$invalidate(20, invalid = $$new_props.invalid);
    if ("id" in $$new_props)
      $$invalidate(12, id = $$new_props.id);
    if ("labelElement" in $$new_props)
      $$invalidate(13, labelElement = $$new_props.labelElement);
    if ("size" in $$new_props)
      $$invalidate(14, size2 = $$new_props.size);
    if ("showRightSection" in $$new_props)
      $$invalidate(21, showRightSection = $$new_props.showRightSection);
    if ("value" in $$new_props)
      $$invalidate(1, value = $$new_props.value);
    if ("placeholder" in $$new_props)
      $$invalidate(15, placeholder = $$new_props.placeholder);
    if ("$$scope" in $$new_props)
      $$invalidate(25, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*invalid, error*/
    1048704) {
      $$invalidate(16, _invalid = invalid || !!error);
    }
  };
  return [
    element2,
    value,
    use,
    className,
    override,
    label,
    description,
    error,
    required,
    labelProps,
    descriptionProps,
    errorProps,
    id,
    labelElement,
    size2,
    placeholder,
    _invalid,
    forwardEvents,
    _showRightSection,
    $$restProps,
    invalid,
    showRightSection,
    slots,
    input_value_binding,
    inputwrapper_element_binding,
    $$scope
  ];
}
class TextInput extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      use: 2,
      element: 0,
      class: 3,
      override: 4,
      label: 5,
      description: 6,
      error: 7,
      required: 8,
      labelProps: 9,
      descriptionProps: 10,
      errorProps: 11,
      invalid: 20,
      id: 12,
      labelElement: 13,
      size: 14,
      showRightSection: 21,
      value: 1,
      placeholder: 15
    });
  }
}
function get_each_context(ctx, list, i2) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i2];
  return child_ctx;
}
function create_default_slot_6(ctx) {
  let image;
  let current;
  image = new Image$1({
    props: {
      src: (
        /*gameType*/
        ctx[2].img
      ),
      alt: (
        /*gameType*/
        ctx[2].name
      ),
      height: 160
    }
  });
  return {
    c() {
      create_component(image.$$.fragment);
    },
    m(target, anchor) {
      mount_component(image, target, anchor);
      current = true;
    },
    p: noop$2,
    i(local) {
      if (current)
        return;
      transition_in(image.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(image.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(image, detaching);
    }
  };
}
function create_default_slot_5(ctx) {
  let t_value = (
    /*gameType*/
    ctx[2].name + ""
  );
  let t2;
  return {
    c() {
      t2 = text(t_value);
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    p: noop$2,
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_default_slot_4(ctx) {
  let t_value = (
    /*gameType*/
    ctx[2].description + ""
  );
  let t2;
  return {
    c() {
      t2 = text(t_value);
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    p: noop$2,
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_default_slot_3(ctx) {
  let t2;
  return {
    c() {
      t2 = text("Create Game");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_default_slot_2(ctx) {
  let button;
  let current;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[1](
        /*gameType*/
        ctx[2]
      )
    );
  }
  button = new Button({
    props: {
      color: "teal",
      fullSize: true,
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  button.$on("click", click_handler);
  return {
    c() {
      create_component(button.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const button_changes = {};
      if (dirty & /*$$scope*/
      32) {
        button_changes.$$scope = { dirty, ctx };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button, detaching);
    }
  };
}
function create_default_slot_1(ctx) {
  let card_section0;
  let t0;
  let text0;
  let t1;
  let div0;
  let t2;
  let text1;
  let t3;
  let div1;
  let t4;
  let card_section1;
  let t5;
  let current;
  card_section0 = new Card2.Section({
    props: {
      padding: "lg",
      $$slots: { default: [create_default_slot_6] },
      $$scope: { ctx }
    }
  });
  text0 = new Text({
    props: {
      weight: 1e3,
      size: "xl",
      $$slots: { default: [create_default_slot_5] },
      $$scope: { ctx }
    }
  });
  text1 = new Text({
    props: {
      $$slots: { default: [create_default_slot_4] },
      $$scope: { ctx }
    }
  });
  card_section1 = new Card2.Section({
    props: {
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(card_section0.$$.fragment);
      t0 = space();
      create_component(text0.$$.fragment);
      t1 = space();
      div0 = element("div");
      t2 = space();
      create_component(text1.$$.fragment);
      t3 = space();
      div1 = element("div");
      t4 = space();
      create_component(card_section1.$$.fragment);
      t5 = space();
      attr(div0, "class", "half-spacing svelte-oa1ngk");
      attr(div1, "class", "spacing svelte-oa1ngk");
    },
    m(target, anchor) {
      mount_component(card_section0, target, anchor);
      insert(target, t0, anchor);
      mount_component(text0, target, anchor);
      insert(target, t1, anchor);
      insert(target, div0, anchor);
      insert(target, t2, anchor);
      mount_component(text1, target, anchor);
      insert(target, t3, anchor);
      insert(target, div1, anchor);
      insert(target, t4, anchor);
      mount_component(card_section1, target, anchor);
      insert(target, t5, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const card_section0_changes = {};
      if (dirty & /*$$scope*/
      32) {
        card_section0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      card_section0.$set(card_section0_changes);
      const text0_changes = {};
      if (dirty & /*$$scope*/
      32) {
        text0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      text0.$set(text0_changes);
      const text1_changes = {};
      if (dirty & /*$$scope*/
      32) {
        text1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      text1.$set(text1_changes);
      const card_section1_changes = {};
      if (dirty & /*$$scope*/
      32) {
        card_section1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      card_section1.$set(card_section1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card_section0.$$.fragment, local);
      transition_in(text0.$$.fragment, local);
      transition_in(text1.$$.fragment, local);
      transition_in(card_section1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card_section0.$$.fragment, local);
      transition_out(text0.$$.fragment, local);
      transition_out(text1.$$.fragment, local);
      transition_out(card_section1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
        detach(div0);
        detach(t2);
        detach(t3);
        detach(div1);
        detach(t4);
        detach(t5);
      }
      destroy_component(card_section0, detaching);
      destroy_component(text0, detaching);
      destroy_component(text1, detaching);
      destroy_component(card_section1, detaching);
    }
  };
}
function create_each_block(ctx) {
  let card;
  let current;
  card = new Card2({
    props: {
      shadow: "sm",
      padding: "lg",
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & /*$$scope*/
      32) {
        card_changes.$$scope = { dirty, ctx: ctx2 };
      }
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_default_slot$2(ctx) {
  let t2;
  return {
    c() {
      t2 = text("Join Game");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_fragment$2(ctx) {
  let div3;
  let h1;
  let t1;
  let div2;
  let div0;
  let t2;
  let div1;
  let button;
  let t3;
  let textinput;
  let current;
  let each_value = ensure_array_like(
    /*gameTypes*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i2 = 0; i2 < each_value.length; i2 += 1) {
    each_blocks[i2] = create_each_block(get_each_context(ctx, each_value, i2));
  }
  const out = (i2) => transition_out(each_blocks[i2], 1, 1, () => {
    each_blocks[i2] = null;
  });
  button = new Button({
    props: {
      color: "teal",
      $$slots: { default: [create_default_slot$2] },
      $$scope: { ctx }
    }
  });
  textinput = new TextInput({ props: { placeholder: "Game ID" } });
  return {
    c() {
      div3 = element("div");
      h1 = element("h1");
      h1.textContent = "Quick- Chess";
      t1 = space();
      div2 = element("div");
      div0 = element("div");
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].c();
      }
      t2 = space();
      div1 = element("div");
      create_component(button.$$.fragment);
      t3 = space();
      create_component(textinput.$$.fragment);
      attr(h1, "class", "svelte-oa1ngk");
      attr(div0, "class", "carousel svelte-oa1ngk");
      attr(div1, "class", "action-wrapper svelte-oa1ngk");
      attr(div2, "class", "actions svelte-oa1ngk");
      attr(div3, "class", "main-page svelte-oa1ngk");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, h1);
      append(div3, t1);
      append(div3, div2);
      append(div2, div0);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        if (each_blocks[i2]) {
          each_blocks[i2].m(div0, null);
        }
      }
      append(div2, t2);
      append(div2, div1);
      mount_component(button, div1, null);
      append(div1, t3);
      mount_component(textinput, div1, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*gameTypes*/
      1) {
        each_value = ensure_array_like(
          /*gameTypes*/
          ctx2[0]
        );
        let i2;
        for (i2 = 0; i2 < each_value.length; i2 += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i2);
          if (each_blocks[i2]) {
            each_blocks[i2].p(child_ctx, dirty);
            transition_in(each_blocks[i2], 1);
          } else {
            each_blocks[i2] = create_each_block(child_ctx);
            each_blocks[i2].c();
            transition_in(each_blocks[i2], 1);
            each_blocks[i2].m(div0, null);
          }
        }
        group_outros();
        for (i2 = each_value.length; i2 < each_blocks.length; i2 += 1) {
          out(i2);
        }
        check_outros();
      }
      const button_changes = {};
      if (dirty & /*$$scope*/
      32) {
        button_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      for (let i2 = 0; i2 < each_value.length; i2 += 1) {
        transition_in(each_blocks[i2]);
      }
      transition_in(button.$$.fragment, local);
      transition_in(textinput.$$.fragment, local);
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        transition_out(each_blocks[i2]);
      }
      transition_out(button.$$.fragment, local);
      transition_out(textinput.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      destroy_each(each_blocks, detaching);
      destroy_component(button);
      destroy_component(textinput);
    }
  };
}
function instance$2($$self) {
  const gameTypes = [
    {
      name: "Base Chess",
      description: "The classic game of chess on an 8x8 board",
      img: "./chess.jpg",
      builder: () => {
        let game = new BaseGame();
        game.init();
        return game;
      }
    },
    {
      name: "Standard Chess",
      description: "The classic game of chess on an 8x8 board",
      img: "./chess.jpg",
      builder: () => {
        let game = new BaseGame();
        game.init();
        return game;
      }
    }
  ];
  onMount(async () => {
    await handleGoogleAuth();
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    if (id) {
      console.log("Joining game with id: " + id);
      await joinGame(id);
    }
  });
  const click_handler = (gameType) => {
    let game = gameType.builder(8, 8);
    currentGame.set(game);
    createGame(game);
  };
  return [gameTypes, click_handler];
}
class MainPage extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
  }
}
function create_default_slot$1(ctx) {
  let t2;
  return {
    c() {
      t2 = text("Copy Link");
    },
    m(target, anchor) {
      insert(target, t2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t2);
      }
    }
  };
}
function create_fragment$1(ctx) {
  let div1;
  let board;
  let t2;
  let div0;
  let button;
  let current;
  board = new Board2({ props: { game: (
    /*game*/
    ctx[0]
  ) } });
  button = new Button({
    props: {
      $$slots: { default: [create_default_slot$1] },
      $$scope: { ctx }
    }
  });
  button.$on("click", copyGameIDUrl);
  return {
    c() {
      div1 = element("div");
      create_component(board.$$.fragment);
      t2 = space();
      div0 = element("div");
      create_component(button.$$.fragment);
      attr(div0, "class", "side svelte-631jm9");
      attr(div1, "class", "game-page svelte-631jm9");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      mount_component(board, div1, null);
      append(div1, t2);
      append(div1, div0);
      mount_component(button, div0, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const board_changes = {};
      if (dirty & /*game*/
      1)
        board_changes.game = /*game*/
        ctx2[0];
      board.$set(board_changes);
      const button_changes = {};
      if (dirty & /*$$scope*/
      2) {
        button_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(board.$$.fragment, local);
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(board.$$.fragment, local);
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(board);
      destroy_component(button);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let game;
  currentGame.subscribe((value) => {
    $$invalidate(0, game = value);
  });
  return [game];
}
class GamePage extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
  }
}
function create_else_block(ctx) {
  let mainpage;
  let current;
  mainpage = new MainPage({});
  return {
    c() {
      create_component(mainpage.$$.fragment);
    },
    m(target, anchor) {
      mount_component(mainpage, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(mainpage.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(mainpage.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(mainpage, detaching);
    }
  };
}
function create_if_block(ctx) {
  let gamepage;
  let current;
  gamepage = new GamePage({});
  return {
    c() {
      create_component(gamepage.$$.fragment);
    },
    m(target, anchor) {
      mount_component(gamepage, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(gamepage.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(gamepage.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(gamepage, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*game*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_fragment(ctx) {
  let main;
  let svelteuiprovider;
  let current;
  svelteuiprovider = new SvelteUIProvider$1({
    props: {
      withGlobalStyles: true,
      themeObserver: (
        /*$colorScheme*/
        ctx[1]
      ),
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      main = element("main");
      create_component(svelteuiprovider.$$.fragment);
      attr(main, "class", "main svelte-bztv2v");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      mount_component(svelteuiprovider, main, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const svelteuiprovider_changes = {};
      if (dirty & /*$colorScheme*/
      2)
        svelteuiprovider_changes.themeObserver = /*$colorScheme*/
        ctx2[1];
      if (dirty & /*$$scope, game*/
      5) {
        svelteuiprovider_changes.$$scope = { dirty, ctx: ctx2 };
      }
      svelteuiprovider.$set(svelteuiprovider_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(svelteuiprovider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(svelteuiprovider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      destroy_component(svelteuiprovider);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $colorScheme;
  component_subscribe($$self, colorScheme, ($$value) => $$invalidate(1, $colorScheme = $$value));
  colorScheme.set("dark");
  let game;
  currentGame.subscribe((value) => {
    $$invalidate(0, game = value);
  });
  return [game, $colorScheme];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
new App({
  target: document.getElementById("app")
});
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
