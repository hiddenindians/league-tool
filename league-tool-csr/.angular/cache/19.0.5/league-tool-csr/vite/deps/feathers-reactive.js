import {
  require_lib
} from "./chunk-OSBADUCG.js";
import {
  require_lib as require_lib2
} from "./chunk-EBLTVSVM.js";
import "./chunk-LZU6IAWD.js";
import {
  ReplaySubject,
  Subject,
  concat2 as concat,
  concatMap,
  concatMapTo,
  defer,
  filter,
  finalize,
  fromEvent,
  map,
  mapTo,
  merge,
  multicast,
  of,
  refCount,
  scan,
  share,
  switchMap
} from "./chunk-U6JXEVO5.js";
import {
  __async,
  __commonJS,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(" ", ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var {
      formatters
    } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/jsonify/lib/parse.js
var require_parse = __commonJS({
  "node_modules/jsonify/lib/parse.js"(exports, module) {
    "use strict";
    var at;
    var ch;
    var escapee = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "	"
    };
    var text;
    function error(m) {
      throw {
        name: "SyntaxError",
        message: m,
        at,
        text
      };
    }
    function next(c) {
      if (c && c !== ch) {
        error("Expected '" + c + "' instead of '" + ch + "'");
      }
      ch = text.charAt(at);
      at += 1;
      return ch;
    }
    function number() {
      var num;
      var str = "";
      if (ch === "-") {
        str = "-";
        next("-");
      }
      while (ch >= "0" && ch <= "9") {
        str += ch;
        next();
      }
      if (ch === ".") {
        str += ".";
        while (next() && ch >= "0" && ch <= "9") {
          str += ch;
        }
      }
      if (ch === "e" || ch === "E") {
        str += ch;
        next();
        if (ch === "-" || ch === "+") {
          str += ch;
          next();
        }
        while (ch >= "0" && ch <= "9") {
          str += ch;
          next();
        }
      }
      num = Number(str);
      if (!isFinite(num)) {
        error("Bad number");
      }
      return num;
    }
    function string() {
      var hex;
      var i;
      var str = "";
      var uffff;
      if (ch === '"') {
        while (next()) {
          if (ch === '"') {
            next();
            return str;
          } else if (ch === "\\") {
            next();
            if (ch === "u") {
              uffff = 0;
              for (i = 0; i < 4; i += 1) {
                hex = parseInt(next(), 16);
                if (!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }
              str += String.fromCharCode(uffff);
            } else if (typeof escapee[ch] === "string") {
              str += escapee[ch];
            } else {
              break;
            }
          } else {
            str += ch;
          }
        }
      }
      error("Bad string");
    }
    function white() {
      while (ch && ch <= " ") {
        next();
      }
    }
    function word() {
      switch (ch) {
        case "t":
          next("t");
          next("r");
          next("u");
          next("e");
          return true;
        case "f":
          next("f");
          next("a");
          next("l");
          next("s");
          next("e");
          return false;
        case "n":
          next("n");
          next("u");
          next("l");
          next("l");
          return null;
        default:
          error("Unexpected '" + ch + "'");
      }
    }
    function array() {
      var arr = [];
      if (ch === "[") {
        next("[");
        white();
        if (ch === "]") {
          next("]");
          return arr;
        }
        while (ch) {
          arr.push(value());
          white();
          if (ch === "]") {
            next("]");
            return arr;
          }
          next(",");
          white();
        }
      }
      error("Bad array");
    }
    function object() {
      var key;
      var obj = {};
      if (ch === "{") {
        next("{");
        white();
        if (ch === "}") {
          next("}");
          return obj;
        }
        while (ch) {
          key = string();
          white();
          next(":");
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            error('Duplicate key "' + key + '"');
          }
          obj[key] = value();
          white();
          if (ch === "}") {
            next("}");
            return obj;
          }
          next(",");
          white();
        }
      }
      error("Bad object");
    }
    function value() {
      white();
      switch (ch) {
        case "{":
          return object();
        case "[":
          return array();
        case '"':
          return string();
        case "-":
          return number();
        default:
          return ch >= "0" && ch <= "9" ? number() : word();
      }
    }
    module.exports = function(source, reviver) {
      var result;
      text = source;
      at = 0;
      ch = " ";
      result = value();
      white();
      if (ch) {
        error("Syntax error");
      }
      return typeof reviver === "function" ? function walk(holder, key) {
        var k;
        var v;
        var val = holder[key];
        if (val && typeof val === "object") {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(val, k)) {
              v = walk(val, k);
              if (typeof v === "undefined") {
                delete val[k];
              } else {
                val[k] = v;
              }
            }
          }
        }
        return reviver.call(holder, key, val);
      }({
        "": result
      }, "") : result;
    };
  }
});

// node_modules/jsonify/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/jsonify/lib/stringify.js"(exports, module) {
    "use strict";
    var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var gap;
    var indent;
    var meta = {
      // table of character substitutions
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\"
    };
    var rep;
    function quote(string) {
      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
        var c = meta[a];
        return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
      var i;
      var k;
      var v;
      var length;
      var mind = gap;
      var partial;
      var value = holder[key];
      if (value && typeof value === "object" && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      }
      if (typeof rep === "function") {
        value = rep.call(holder, key, value);
      }
      switch (typeof value) {
        case "string":
          return quote(value);
        case "number":
          return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
          return String(value);
        case "object":
          if (!value) {
            return "null";
          }
          gap += indent;
          partial = [];
          if (Object.prototype.toString.apply(value) === "[object Array]") {
            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || "null";
            }
            v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
            gap = mind;
            return v;
          }
          if (rep && typeof rep === "object") {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
              k = rep[i];
              if (typeof k === "string") {
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
              }
            }
          } else {
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
              }
            }
          }
          v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
          gap = mind;
          return v;
        default:
      }
    }
    module.exports = function(value, replacer, space) {
      var i;
      gap = "";
      indent = "";
      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " ";
        }
      } else if (typeof space === "string") {
        indent = space;
      }
      rep = replacer;
      if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
        throw new Error("JSON.stringify");
      }
      return str("", {
        "": value
      });
    };
  }
});

// node_modules/jsonify/index.js
var require_jsonify = __commonJS({
  "node_modules/jsonify/index.js"(exports) {
    "use strict";
    exports.parse = require_parse();
    exports.stringify = require_stringify();
  }
});

// node_modules/json-stable-stringify/node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/json-stable-stringify/node_modules/isarray/index.js"(exports, module) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// node_modules/object-keys/isArguments.js
var require_isArguments = __commonJS({
  "node_modules/object-keys/isArguments.js"(exports, module) {
    "use strict";
    var toStr = Object.prototype.toString;
    module.exports = function isArguments(value) {
      var str = toStr.call(value);
      var isArgs = str === "[object Arguments]";
      if (!isArgs) {
        isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
      }
      return isArgs;
    };
  }
});

// node_modules/object-keys/implementation.js
var require_implementation = __commonJS({
  "node_modules/object-keys/implementation.js"(exports, module) {
    "use strict";
    var keysShim;
    if (!Object.keys) {
      has = Object.prototype.hasOwnProperty;
      toStr = Object.prototype.toString;
      isArgs = require_isArguments();
      isEnumerable = Object.prototype.propertyIsEnumerable;
      hasDontEnumBug = !isEnumerable.call({
        toString: null
      }, "toString");
      hasProtoEnumBug = isEnumerable.call(function() {
      }, "prototype");
      dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];
      equalsConstructorPrototype = function(o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
      };
      excludedKeys = {
        $applicationCache: true,
        $console: true,
        $external: true,
        $frame: true,
        $frameElement: true,
        $frames: true,
        $innerHeight: true,
        $innerWidth: true,
        $onmozfullscreenchange: true,
        $onmozfullscreenerror: true,
        $outerHeight: true,
        $outerWidth: true,
        $pageXOffset: true,
        $pageYOffset: true,
        $parent: true,
        $scrollLeft: true,
        $scrollTop: true,
        $scrollX: true,
        $scrollY: true,
        $self: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $window: true
      };
      hasAutomationEqualityBug = function() {
        if (typeof window === "undefined") {
          return false;
        }
        for (var k in window) {
          try {
            if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
              try {
                equalsConstructorPrototype(window[k]);
              } catch (e) {
                return true;
              }
            }
          } catch (e) {
            return true;
          }
        }
        return false;
      }();
      equalsConstructorPrototypeIfNotBuggy = function(o) {
        if (typeof window === "undefined" || !hasAutomationEqualityBug) {
          return equalsConstructorPrototype(o);
        }
        try {
          return equalsConstructorPrototype(o);
        } catch (e) {
          return false;
        }
      };
      keysShim = function keys(object) {
        var isObject2 = object !== null && typeof object === "object";
        var isFunction2 = toStr.call(object) === "[object Function]";
        var isArguments = isArgs(object);
        var isString = isObject2 && toStr.call(object) === "[object String]";
        var theKeys = [];
        if (!isObject2 && !isFunction2 && !isArguments) {
          throw new TypeError("Object.keys called on a non-object");
        }
        var skipProto = hasProtoEnumBug && isFunction2;
        if (isString && object.length > 0 && !has.call(object, 0)) {
          for (var i = 0; i < object.length; ++i) {
            theKeys.push(String(i));
          }
        }
        if (isArguments && object.length > 0) {
          for (var j = 0; j < object.length; ++j) {
            theKeys.push(String(j));
          }
        } else {
          for (var name in object) {
            if (!(skipProto && name === "prototype") && has.call(object, name)) {
              theKeys.push(String(name));
            }
          }
        }
        if (hasDontEnumBug) {
          var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
          for (var k = 0; k < dontEnums.length; ++k) {
            if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
              theKeys.push(dontEnums[k]);
            }
          }
        }
        return theKeys;
      };
    }
    var has;
    var toStr;
    var isArgs;
    var isEnumerable;
    var hasDontEnumBug;
    var hasProtoEnumBug;
    var dontEnums;
    var equalsConstructorPrototype;
    var excludedKeys;
    var hasAutomationEqualityBug;
    var equalsConstructorPrototypeIfNotBuggy;
    module.exports = keysShim;
  }
});

// node_modules/object-keys/index.js
var require_object_keys = __commonJS({
  "node_modules/object-keys/index.js"(exports, module) {
    "use strict";
    var slice = Array.prototype.slice;
    var isArgs = require_isArguments();
    var origKeys = Object.keys;
    var keysShim = origKeys ? function keys(o) {
      return origKeys(o);
    } : require_implementation();
    var originalKeys = Object.keys;
    keysShim.shim = function shimObjectKeys() {
      if (Object.keys) {
        var keysWorksWithArguments = function() {
          var args = Object.keys(arguments);
          return args && args.length === arguments.length;
        }(1, 2);
        if (!keysWorksWithArguments) {
          Object.keys = function keys(object) {
            if (isArgs(object)) {
              return originalKeys(slice.call(object));
            }
            return originalKeys(object);
          };
        }
      } else {
        Object.keys = keysShim;
      }
      return Object.keys || keysShim;
    };
    module.exports = keysShim;
  }
});

// node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "node_modules/es-object-atoms/index.js"(exports, module) {
    "use strict";
    module.exports = Object;
  }
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "node_modules/es-errors/index.js"(exports, module) {
    "use strict";
    module.exports = Error;
  }
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "node_modules/es-errors/eval.js"(exports, module) {
    "use strict";
    module.exports = EvalError;
  }
});

// node_modules/es-errors/range.js
var require_range = __commonJS({
  "node_modules/es-errors/range.js"(exports, module) {
    "use strict";
    module.exports = RangeError;
  }
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "node_modules/es-errors/ref.js"(exports, module) {
    "use strict";
    module.exports = ReferenceError;
  }
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "node_modules/es-errors/syntax.js"(exports, module) {
    "use strict";
    module.exports = SyntaxError;
  }
});

// node_modules/es-errors/type.js
var require_type = __commonJS({
  "node_modules/es-errors/type.js"(exports, module) {
    "use strict";
    module.exports = TypeError;
  }
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "node_modules/es-errors/uri.js"(exports, module) {
    "use strict";
    module.exports = URIError;
  }
});

// node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "node_modules/math-intrinsics/abs.js"(exports, module) {
    "use strict";
    module.exports = Math.abs;
  }
});

// node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "node_modules/math-intrinsics/floor.js"(exports, module) {
    "use strict";
    module.exports = Math.floor;
  }
});

// node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "node_modules/math-intrinsics/max.js"(exports, module) {
    "use strict";
    module.exports = Math.max;
  }
});

// node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "node_modules/math-intrinsics/min.js"(exports, module) {
    "use strict";
    module.exports = Math.min;
  }
});

// node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "node_modules/math-intrinsics/pow.js"(exports, module) {
    "use strict";
    module.exports = Math.pow;
  }
});

// node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "node_modules/gopd/gOPD.js"(exports, module) {
    "use strict";
    module.exports = Object.getOwnPropertyDescriptor;
  }
});

// node_modules/gopd/index.js
var require_gopd = __commonJS({
  "node_modules/gopd/index.js"(exports, module) {
    "use strict";
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  }
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "node_modules/es-define-property/index.js"(exports, module) {
    "use strict";
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", {
          value: 1
        });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module.exports = $defineProperty;
  }
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "node_modules/has-symbols/shams.js"(exports, module) {
    "use strict";
    module.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _2 in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "node_modules/has-symbols/index.js"(exports, module) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// node_modules/function-bind/implementation.js
var require_implementation2 = __commonJS({
  "node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(this, concatty(args, arguments));
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(that, concatty(args, arguments));
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    var implementation = require_implementation2();
    module.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
    "use strict";
    module.exports = Function.prototype.call;
  }
});

// node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
    "use strict";
    module.exports = Function.prototype.apply;
  }
});

// node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
    "use strict";
    module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module.exports = $reflectApply || bind.call($call, $apply);
  }
});

// node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    };
  }
});

// node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "node_modules/dunder-proto/get.js"(exports, module) {
    "use strict";
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor = (
      /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype
    );
    var desc = hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
  }
});

// node_modules/hasown/index.js
var require_hasown = __commonJS({
  "node_modules/hasown/index.js"(exports, module) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module.exports = bind.call(call, $hasOwn);
  }
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "node_modules/get-intrinsic/index.js"(exports, module) {
    "use strict";
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getDunderProto = require_get();
    var getProto = typeof Reflect === "function" && Reflect.getPrototypeOf || $Object.getPrototypeOf || getDunderProto;
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || last === '"' || last === "'" || last === "`") && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void 0;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// node_modules/define-data-property/index.js
var require_define_data_property = __commonJS({
  "node_modules/define-data-property/index.js"(exports, module) {
    "use strict";
    var $defineProperty = require_es_define_property();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var gopd = require_gopd();
    module.exports = function defineDataProperty(obj, property, value) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new $TypeError("`obj` must be an object or a function`");
      }
      if (typeof property !== "string" && typeof property !== "symbol") {
        throw new $TypeError("`property` must be a string or a symbol`");
      }
      if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
        throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
        throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
        throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
        throw new $TypeError("`loose`, if provided, must be a boolean");
      }
      var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
      var nonWritable = arguments.length > 4 ? arguments[4] : null;
      var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
      var loose = arguments.length > 6 ? arguments[6] : false;
      var desc = !!gopd && gopd(obj, property);
      if ($defineProperty) {
        $defineProperty(obj, property, {
          configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
          enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
          value,
          writable: nonWritable === null && desc ? desc.writable : !nonWritable
        });
      } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
        obj[property] = value;
      } else {
        throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
      }
    };
  }
});

// node_modules/has-property-descriptors/index.js
var require_has_property_descriptors = __commonJS({
  "node_modules/has-property-descriptors/index.js"(exports, module) {
    "use strict";
    var $defineProperty = require_es_define_property();
    var hasPropertyDescriptors = function hasPropertyDescriptors2() {
      return !!$defineProperty;
    };
    hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
      if (!$defineProperty) {
        return null;
      }
      try {
        return $defineProperty([], "length", {
          value: 1
        }).length !== 1;
      } catch (e) {
        return true;
      }
    };
    module.exports = hasPropertyDescriptors;
  }
});

// node_modules/set-function-length/index.js
var require_set_function_length = __commonJS({
  "node_modules/set-function-length/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var define = require_define_data_property();
    var hasDescriptors = require_has_property_descriptors()();
    var gOPD = require_gopd();
    var $TypeError = require_type();
    var $floor = GetIntrinsic("%Math.floor%");
    module.exports = function setFunctionLength(fn, length) {
      if (typeof fn !== "function") {
        throw new $TypeError("`fn` is not a function");
      }
      if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
        throw new $TypeError("`length` must be a positive 32-bit integer");
      }
      var loose = arguments.length > 2 && !!arguments[2];
      var functionLengthIsConfigurable = true;
      var functionLengthIsWritable = true;
      if ("length" in fn && gOPD) {
        var desc = gOPD(fn, "length");
        if (desc && !desc.configurable) {
          functionLengthIsConfigurable = false;
        }
        if (desc && !desc.writable) {
          functionLengthIsWritable = false;
        }
      }
      if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
        if (hasDescriptors) {
          define(
            /** @type {Parameters<define>[0]} */
            fn,
            "length",
            length,
            true,
            true
          );
        } else {
          define(
            /** @type {Parameters<define>[0]} */
            fn,
            "length",
            length
          );
        }
      }
      return fn;
    };
  }
});

// node_modules/call-bind-apply-helpers/applyBind.js
var require_applyBind = __commonJS({
  "node_modules/call-bind-apply-helpers/applyBind.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var actualApply = require_actualApply();
    module.exports = function applyBind() {
      return actualApply(bind, $apply, arguments);
    };
  }
});

// node_modules/call-bind/index.js
var require_call_bind = __commonJS({
  "node_modules/call-bind/index.js"(exports, module) {
    "use strict";
    var setFunctionLength = require_set_function_length();
    var $defineProperty = require_es_define_property();
    var callBindBasic = require_call_bind_apply_helpers();
    var applyBind = require_applyBind();
    module.exports = function callBind(originalFunction) {
      var func = callBindBasic(arguments);
      var adjustedLength = originalFunction.length - (arguments.length - 1);
      return setFunctionLength(func, 1 + (adjustedLength > 0 ? adjustedLength : 0), true);
    };
    if ($defineProperty) {
      $defineProperty(module.exports, "apply", {
        value: applyBind
      });
    } else {
      module.exports.apply = applyBind;
    }
  }
});

// node_modules/call-bind/callBound.js
var require_callBound = __commonJS({
  "node_modules/call-bind/callBound.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBind = require_call_bind();
    var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
    module.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = GetIntrinsic(name, !!allowMissing);
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBind(intrinsic);
      }
      return intrinsic;
    };
  }
});

// node_modules/json-stable-stringify/index.js
var require_json_stable_stringify = __commonJS({
  "node_modules/json-stable-stringify/index.js"(exports, module) {
    "use strict";
    var jsonStringify = (typeof JSON !== "undefined" ? JSON : require_jsonify()).stringify;
    var isArray2 = require_isarray();
    var objectKeys = require_object_keys();
    var callBind = require_call_bind();
    var callBound = require_callBound();
    var $join = callBound("Array.prototype.join");
    var $push = callBound("Array.prototype.push");
    var strRepeat = function repeat(n, char) {
      var str = "";
      for (var i = 0; i < n; i += 1) {
        str += char;
      }
      return str;
    };
    var defaultReplacer = function(parent, key, value) {
      return value;
    };
    module.exports = function stableStringify(obj) {
      var opts = arguments.length > 1 ? arguments[1] : void 0;
      var space = opts && opts.space || "";
      if (typeof space === "number") {
        space = strRepeat(space, " ");
      }
      var cycles = !!opts && typeof opts.cycles === "boolean" && opts.cycles;
      var replacer = opts && opts.replacer ? callBind(opts.replacer) : defaultReplacer;
      var cmpOpt = typeof opts === "function" ? opts : opts && opts.cmp;
      var cmp = cmpOpt && function(node) {
        var get = cmpOpt.length > 2 && function get2(k) {
          return node[k];
        };
        return function(a, b) {
          return cmpOpt({
            key: a,
            value: node[a]
          }, {
            key: b,
            value: node[b]
          }, get ? {
            __proto__: null,
            get
          } : void 0);
        };
      };
      var seen = [];
      return function stringify2(parent, key, node, level) {
        var indent = space ? "\n" + strRepeat(level, space) : "";
        var colonSeparator = space ? ": " : ":";
        if (node && node.toJSON && typeof node.toJSON === "function") {
          node = node.toJSON();
        }
        node = replacer(parent, key, node);
        if (node === void 0) {
          return;
        }
        if (typeof node !== "object" || node === null) {
          return jsonStringify(node);
        }
        if (isArray2(node)) {
          var out = [];
          for (var i = 0; i < node.length; i++) {
            var item = stringify2(node, i, node[i], level + 1) || jsonStringify(null);
            $push(out, indent + space + item);
          }
          return "[" + $join(out, ",") + indent + "]";
        }
        if (seen.indexOf(node) !== -1) {
          if (cycles) {
            return jsonStringify("__cycle__");
          }
          throw new TypeError("Converting circular structure to JSON");
        } else {
          $push(seen, node);
        }
        var keys = objectKeys(node).sort(cmp && cmp(node));
        var out = [];
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = stringify2(node, key, node[key], level + 1);
          if (!value) {
            continue;
          }
          var keyValue = jsonStringify(key) + colonSeparator + value;
          $push(out, indent + space + keyValue);
        }
        seen.splice(seen.indexOf(node), 1);
        return "{" + $join(out, ",") + indent + "}";
      }({
        "": obj
      }, "", obj, 0);
    };
  }
});

// node_modules/@feathersjs/adapter-commons/lib/declarations.js
var require_declarations = __commonJS({
  "node_modules/@feathersjs/adapter-commons/lib/declarations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  }
});

// node_modules/@feathersjs/adapter-commons/lib/query.js
var require_query = __commonJS({
  "node_modules/@feathersjs/adapter-commons/lib/query.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.FILTERS = exports.OPERATORS = exports.getLimit = void 0;
    exports.filterQuery = filterQuery;
    var commons_1 = require_lib2();
    var errors_1 = require_lib();
    var parse = (value) => typeof value !== "undefined" ? parseInt(value, 10) : value;
    var isPlainObject = (value) => commons_1._.isObject(value) && value.constructor === {}.constructor;
    var validateQueryProperty = (query, operators = []) => {
      if (!isPlainObject(query)) {
        return query;
      }
      for (const key of Object.keys(query)) {
        if (key.startsWith("$") && !operators.includes(key)) {
          throw new errors_1.BadRequest(`Invalid query parameter ${key}`, query);
        }
        const value = query[key];
        if (isPlainObject(value)) {
          query[key] = validateQueryProperty(value, operators);
        }
      }
      return __spreadValues({}, query);
    };
    var getFilters = (query, settings) => {
      const filterNames = Object.keys(settings.filters);
      return filterNames.reduce((current, key) => {
        const queryValue = query[key];
        const filter2 = settings.filters[key];
        if (filter2) {
          const value = typeof filter2 === "function" ? filter2(queryValue, settings) : queryValue;
          if (value !== void 0) {
            current[key] = value;
          }
        }
        return current;
      }, {});
    };
    var getQuery = (query, settings) => {
      const keys = Object.keys(query).concat(Object.getOwnPropertySymbols(query));
      return keys.reduce((result, key) => {
        if (typeof key === "string" && key.startsWith("$")) {
          if (settings.filters[key] === void 0) {
            throw new errors_1.BadRequest(`Invalid filter value ${key}`);
          }
        } else {
          result[key] = validateQueryProperty(query[key], settings.operators);
        }
        return result;
      }, {});
    };
    var getLimit = (_limit, paginate) => {
      const limit = parse(_limit);
      if (paginate && (paginate.default || paginate.max)) {
        const base = paginate.default || 0;
        const lower = typeof limit === "number" && !isNaN(limit) && limit >= 0 ? limit : base;
        const upper = typeof paginate.max === "number" ? paginate.max : Number.MAX_VALUE;
        return Math.min(lower, upper);
      }
      return limit;
    };
    exports.getLimit = getLimit;
    exports.OPERATORS = ["$in", "$nin", "$lt", "$lte", "$gt", "$gte", "$ne", "$or"];
    exports.FILTERS = {
      $skip: (value) => parse(value),
      $sort: (sort) => {
        if (typeof sort !== "object" || Array.isArray(sort)) {
          return sort;
        }
        return Object.keys(sort).reduce((result, key) => {
          result[key] = typeof sort[key] === "object" ? sort[key] : parse(sort[key]);
          return result;
        }, {});
      },
      $limit: (_limit, {
        paginate
      }) => (0, exports.getLimit)(_limit, paginate),
      $select: (select) => {
        if (Array.isArray(select)) {
          return select.map((current) => `${current}`);
        }
        return select;
      },
      $or: (or, {
        operators
      }) => {
        if (Array.isArray(or)) {
          return or.map((current) => validateQueryProperty(current, operators));
        }
        return or;
      },
      $and: (and, {
        operators
      }) => {
        if (Array.isArray(and)) {
          return and.map((current) => validateQueryProperty(current, operators));
        }
        return and;
      }
    };
    function filterQuery(_query, options = {}) {
      const query = _query || {};
      const settings = __spreadProps(__spreadValues({}, options), {
        filters: __spreadValues(__spreadValues({}, exports.FILTERS), options.filters),
        operators: exports.OPERATORS.concat(options.operators || [])
      });
      return {
        filters: getFilters(query, settings),
        query: getQuery(query, settings)
      };
    }
  }
});

// node_modules/@feathersjs/adapter-commons/lib/service.js
var require_service = __commonJS({
  "node_modules/@feathersjs/adapter-commons/lib/service.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AdapterBase = exports.VALIDATED = void 0;
    var query_1 = require_query();
    exports.VALIDATED = Symbol.for("@feathersjs/adapter/sanitized");
    var alwaysMulti = {
      find: true,
      get: false,
      update: false
    };
    var AdapterBase = class {
      constructor(options) {
        this.options = __spreadValues({
          id: "id",
          events: [],
          paginate: false,
          multi: false,
          filters: {},
          operators: []
        }, options);
      }
      get id() {
        return this.options.id;
      }
      get events() {
        return this.options.events;
      }
      /**
       * Check if this adapter allows multiple updates for a method.
       * @param method The method name to check.
       * @param params The service call params.
       * @returns Wether or not multiple updates are allowed.
       */
      allowsMulti(method, params = {}) {
        const always = alwaysMulti[method];
        if (typeof always !== "undefined") {
          return always;
        }
        const {
          multi
        } = this.getOptions(params);
        if (multi === true || !multi) {
          return multi;
        }
        return multi.includes(method);
      }
      /**
       * Returns the combined options for a service call. Options will be merged
       * with `this.options` and `params.adapter` for dynamic overrides.
       *
       * @param params The parameters for the service method call
       * @returns The actual options for this call
       */
      getOptions(params) {
        const paginate = params.paginate !== void 0 ? params.paginate : this.options.paginate;
        return __spreadValues(__spreadProps(__spreadValues({}, this.options), {
          paginate
        }), params.adapter);
      }
      /**
       * Returns a sanitized version of `params.query`, converting filter values
       * (like $limit and $skip) into the expected type. Will throw an error if
       * a `$` prefixed filter or operator value that is not allowed in `filters`
       * or `operators` is encountered.
       *
       * @param params The service call parameter.
       * @returns A new object containing the sanitized query.
       */
      sanitizeQuery() {
        return __async(this, arguments, function* (params = {}) {
          if (params.query && params.query[exports.VALIDATED]) {
            return params.query || {};
          }
          const options = this.getOptions(params);
          const {
            query,
            filters
          } = (0, query_1.filterQuery)(params.query, options);
          return __spreadValues(__spreadValues({}, filters), query);
        });
      }
    };
    exports.AdapterBase = AdapterBase;
  }
});

// node_modules/@feathersjs/adapter-commons/lib/sort.js
var require_sort = __commonJS({
  "node_modules/@feathersjs/adapter-commons/lib/sort.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.compareNSB = compareNSB;
    exports.compareArrays = compareArrays;
    exports.compare = compare;
    exports.sorter = sorter2;
    function compareNSB(a, b) {
      if (a === b) {
        return 0;
      }
      return a < b ? -1 : 1;
    }
    function compareArrays(a, b) {
      for (let i = 0, l = Math.min(a.length, b.length); i < l; i++) {
        const comparison = compare(a[i], b[i]);
        if (comparison !== 0) {
          return comparison;
        }
      }
      return compareNSB(a.length, b.length);
    }
    function compare(a, b, compareStrings = compareNSB) {
      if (a === b) {
        return 0;
      }
      if (a == null) {
        return -1;
      }
      if (b == null) {
        return 1;
      }
      const typeofA = typeof a;
      const typeofB = typeof b;
      if (typeofA === "number") {
        return typeofB === "number" ? compareNSB(a, b) : -1;
      }
      if (typeofB === "number") {
        return 1;
      }
      if (typeofA === "string") {
        return typeofB === "string" ? compareStrings(a, b) : -1;
      }
      if (typeofB === "string") {
        return 1;
      }
      if (typeofA === "boolean") {
        return typeofB === "boolean" ? compareNSB(a, b) : -1;
      }
      if (typeofB === "boolean") {
        return 1;
      }
      if (a instanceof Date) {
        return b instanceof Date ? compareNSB(a.getTime(), b.getTime()) : -1;
      }
      if (b instanceof Date) {
        return 1;
      }
      if (Array.isArray(a)) {
        return Array.isArray(b) ? compareArrays(a, b) : -1;
      }
      if (Array.isArray(b)) {
        return 1;
      }
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      for (let i = 0, l = Math.min(aKeys.length, bKeys.length); i < l; i++) {
        const comparison = compare(a[aKeys[i]], b[bKeys[i]]);
        if (comparison !== 0) {
          return comparison;
        }
      }
      return compareNSB(aKeys.length, bKeys.length);
    }
    var get = (value, path) => path.reduce((value2, key) => value2[key], value);
    function sorter2($sort) {
      const compares = Object.keys($sort).map((key) => {
        const direction = $sort[key];
        if (!key.includes(".")) {
          return (a, b) => direction * compare(a[key], b[key]);
        } else {
          const path = key.split(".");
          return (a, b) => direction * compare(get(a, path), get(b, path));
        }
      });
      return function(a, b) {
        for (const compare2 of compares) {
          const comparison = compare2(a, b);
          if (comparison !== 0) {
            return comparison;
          }
        }
        return 0;
      };
    }
  }
});

// node_modules/@feathersjs/adapter-commons/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/@feathersjs/adapter-commons/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.select = select;
    var commons_1 = require_lib2();
    __exportStar(require_declarations(), exports);
    __exportStar(require_service(), exports);
    __exportStar(require_query(), exports);
    __exportStar(require_sort(), exports);
    function select(params, ...otherFields) {
      var _a;
      const queryFields = (_a = params === null || params === void 0 ? void 0 : params.query) === null || _a === void 0 ? void 0 : _a.$select;
      if (!queryFields) {
        return (result) => result;
      }
      const resultFields = queryFields.concat(otherFields);
      const convert = (result) => commons_1._.pick(result, ...resultFields);
      return (result) => {
        if (Array.isArray(result)) {
          return result.map(convert);
        }
        return convert(result);
      };
    }
  }
});

// node_modules/feathers-reactive/dist/index.mjs
var import_debug = __toESM(require_browser(), 1);

// node_modules/sift/es5m/index.js
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var typeChecker = function(type) {
  var typeString = "[object " + type + "]";
  return function(value) {
    return getClassName(value) === typeString;
  };
};
var getClassName = function(value) {
  return Object.prototype.toString.call(value);
};
var comparable = function(value) {
  if (value instanceof Date) {
    return value.getTime();
  } else if (isArray(value)) {
    return value.map(comparable);
  } else if (value && typeof value.toJSON === "function") {
    return value.toJSON();
  }
  return value;
};
var coercePotentiallyNull = function(value) {
  return value == null ? null : value;
};
var isArray = typeChecker("Array");
var isObject = typeChecker("Object");
var isFunction = typeChecker("Function");
var isProperty = function(item, key) {
  return item.hasOwnProperty(key) && !isFunction(item[key]);
};
var isVanillaObject = function(value) {
  return value && (value.constructor === Object || value.constructor === Array || value.constructor.toString() === "function Object() { [native code] }" || value.constructor.toString() === "function Array() { [native code] }") && !value.toJSON;
};
var equals = function(a, b) {
  if (a == null && a == b) {
    return true;
  }
  if (a === b) {
    return true;
  }
  if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
    return false;
  }
  if (isArray(a)) {
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0, length_1 = a.length; i < length_1; i++) {
      if (!equals(a[i], b[i])) return false;
    }
    return true;
  } else if (isObject(a)) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    for (var key in a) {
      if (!equals(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
};
var walkKeyPathValues = function(item, keyPath, next, depth, key, owner) {
  var currentKey = keyPath[depth];
  if (isArray(item) && isNaN(Number(currentKey)) && !isProperty(item, currentKey)) {
    for (var i = 0, length_1 = item.length; i < length_1; i++) {
      if (!walkKeyPathValues(item[i], keyPath, next, depth, i, item)) {
        return false;
      }
    }
  }
  if (depth === keyPath.length || item == null) {
    return next(item, key, owner, depth === 0, depth === keyPath.length);
  }
  return walkKeyPathValues(item[currentKey], keyPath, next, depth + 1, currentKey, item);
};
var BaseOperation = (
  /** @class */
  function() {
    function BaseOperation2(params, owneryQuery, options, name) {
      this.params = params;
      this.owneryQuery = owneryQuery;
      this.options = options;
      this.name = name;
      this.init();
    }
    BaseOperation2.prototype.init = function() {
    };
    BaseOperation2.prototype.reset = function() {
      this.done = false;
      this.keep = false;
    };
    return BaseOperation2;
  }()
);
var GroupOperation = (
  /** @class */
  function(_super) {
    __extends(GroupOperation2, _super);
    function GroupOperation2(params, owneryQuery, options, children) {
      var _this = _super.call(this, params, owneryQuery, options) || this;
      _this.children = children;
      return _this;
    }
    GroupOperation2.prototype.reset = function() {
      this.keep = false;
      this.done = false;
      for (var i = 0, length_2 = this.children.length; i < length_2; i++) {
        this.children[i].reset();
      }
    };
    GroupOperation2.prototype.childrenNext = function(item, key, owner, root, leaf) {
      var done = true;
      var keep = true;
      for (var i = 0, length_3 = this.children.length; i < length_3; i++) {
        var childOperation = this.children[i];
        if (!childOperation.done) {
          childOperation.next(item, key, owner, root, leaf);
        }
        if (!childOperation.keep) {
          keep = false;
        }
        if (childOperation.done) {
          if (!childOperation.keep) {
            break;
          }
        } else {
          done = false;
        }
      }
      this.done = done;
      this.keep = keep;
    };
    return GroupOperation2;
  }(BaseOperation)
);
var NamedGroupOperation = (
  /** @class */
  function(_super) {
    __extends(NamedGroupOperation2, _super);
    function NamedGroupOperation2(params, owneryQuery, options, children, name) {
      var _this = _super.call(this, params, owneryQuery, options, children) || this;
      _this.name = name;
      return _this;
    }
    return NamedGroupOperation2;
  }(GroupOperation)
);
var QueryOperation = (
  /** @class */
  function(_super) {
    __extends(QueryOperation2, _super);
    function QueryOperation2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    QueryOperation2.prototype.next = function(item, key, parent, root) {
      this.childrenNext(item, key, parent, root);
    };
    return QueryOperation2;
  }(GroupOperation)
);
var NestedOperation = (
  /** @class */
  function(_super) {
    __extends(NestedOperation2, _super);
    function NestedOperation2(keyPath, params, owneryQuery, options, children) {
      var _this = _super.call(this, params, owneryQuery, options, children) || this;
      _this.keyPath = keyPath;
      _this.propop = true;
      _this._nextNestedValue = function(value, key, owner, root, leaf) {
        _this.childrenNext(value, key, owner, root, leaf);
        return !_this.done;
      };
      return _this;
    }
    NestedOperation2.prototype.next = function(item, key, parent) {
      walkKeyPathValues(item, this.keyPath, this._nextNestedValue, 0, key, parent);
    };
    return NestedOperation2;
  }(GroupOperation)
);
var createTester = function(a, compare) {
  if (a instanceof Function) {
    return a;
  }
  if (a instanceof RegExp) {
    return function(b) {
      var result = typeof b === "string" && a.test(b);
      a.lastIndex = 0;
      return result;
    };
  }
  var comparableA = comparable(a);
  return function(b) {
    return compare(comparableA, comparable(b));
  };
};
var EqualsOperation = (
  /** @class */
  function(_super) {
    __extends(EqualsOperation2, _super);
    function EqualsOperation2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    EqualsOperation2.prototype.init = function() {
      this._test = createTester(this.params, this.options.compare);
    };
    EqualsOperation2.prototype.next = function(item, key, parent) {
      if (!Array.isArray(parent) || parent.hasOwnProperty(key)) {
        if (this._test(item, key, parent)) {
          this.done = true;
          this.keep = true;
        }
      }
    };
    return EqualsOperation2;
  }(BaseOperation)
);
var numericalOperationCreator = function(createNumericalOperation) {
  return function(params, owneryQuery, options, name) {
    return createNumericalOperation(params, owneryQuery, options, name);
  };
};
var numericalOperation = function(createTester2) {
  return numericalOperationCreator(function(params, owneryQuery, options, name) {
    var typeofParams = typeof comparable(params);
    var test = createTester2(params);
    return new EqualsOperation(function(b) {
      var actualValue = coercePotentiallyNull(b);
      return typeof comparable(actualValue) === typeofParams && test(actualValue);
    }, owneryQuery, options, name);
  });
};
var createNamedOperation = function(name, params, parentQuery, options) {
  var operationCreator = options.operations[name];
  if (!operationCreator) {
    throwUnsupportedOperation(name);
  }
  return operationCreator(params, parentQuery, options, name);
};
var throwUnsupportedOperation = function(name) {
  throw new Error("Unsupported operation: ".concat(name));
};
var containsOperation = function(query, options) {
  for (var key in query) {
    if (options.operations.hasOwnProperty(key) || key.charAt(0) === "$") return true;
  }
  return false;
};
var createNestedOperation = function(keyPath, nestedQuery, parentKey, owneryQuery, options) {
  if (containsOperation(nestedQuery, options)) {
    var _a = createQueryOperations(nestedQuery, parentKey, options), selfOperations = _a[0], nestedOperations = _a[1];
    if (nestedOperations.length) {
      throw new Error("Property queries must contain only operations, or exact objects.");
    }
    return new NestedOperation(keyPath, nestedQuery, owneryQuery, options, selfOperations);
  }
  return new NestedOperation(keyPath, nestedQuery, owneryQuery, options, [new EqualsOperation(nestedQuery, owneryQuery, options)]);
};
var createQueryOperation = function(query, owneryQuery, _a) {
  if (owneryQuery === void 0) {
    owneryQuery = null;
  }
  var _b = _a === void 0 ? {} : _a, compare = _b.compare, operations = _b.operations;
  var options = {
    compare: compare || equals,
    operations: Object.assign({}, operations || {})
  };
  var _c = createQueryOperations(query, null, options), selfOperations = _c[0], nestedOperations = _c[1];
  var ops = [];
  if (selfOperations.length) {
    ops.push(new NestedOperation([], query, owneryQuery, options, selfOperations));
  }
  ops.push.apply(ops, nestedOperations);
  if (ops.length === 1) {
    return ops[0];
  }
  return new QueryOperation(query, owneryQuery, options, ops);
};
var createQueryOperations = function(query, parentKey, options) {
  var selfOperations = [];
  var nestedOperations = [];
  if (!isVanillaObject(query)) {
    selfOperations.push(new EqualsOperation(query, query, options));
    return [selfOperations, nestedOperations];
  }
  for (var key in query) {
    if (options.operations.hasOwnProperty(key)) {
      var op = createNamedOperation(key, query[key], query, options);
      if (op) {
        if (!op.propop && parentKey && !options.operations[parentKey]) {
          throw new Error("Malformed query. ".concat(key, " cannot be matched against property."));
        }
      }
      if (op != null) {
        selfOperations.push(op);
      }
    } else if (key.charAt(0) === "$") {
      throwUnsupportedOperation(key);
    } else {
      nestedOperations.push(createNestedOperation(key.split("."), query[key], key, query, options));
    }
  }
  return [selfOperations, nestedOperations];
};
var createOperationTester = function(operation) {
  return function(item, key, owner) {
    operation.reset();
    operation.next(item, key, owner);
    return operation.keep;
  };
};
var $Ne = (
  /** @class */
  function(_super) {
    __extends($Ne2, _super);
    function $Ne2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    $Ne2.prototype.init = function() {
      this._test = createTester(this.params, this.options.compare);
    };
    $Ne2.prototype.reset = function() {
      _super.prototype.reset.call(this);
      this.keep = true;
    };
    $Ne2.prototype.next = function(item) {
      if (this._test(item)) {
        this.done = true;
        this.keep = false;
      }
    };
    return $Ne2;
  }(BaseOperation)
);
var $ElemMatch = (
  /** @class */
  function(_super) {
    __extends($ElemMatch2, _super);
    function $ElemMatch2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    $ElemMatch2.prototype.init = function() {
      if (!this.params || typeof this.params !== "object") {
        throw new Error("Malformed query. $elemMatch must by an object.");
      }
      this._queryOperation = createQueryOperation(this.params, this.owneryQuery, this.options);
    };
    $ElemMatch2.prototype.reset = function() {
      _super.prototype.reset.call(this);
      this._queryOperation.reset();
    };
    $ElemMatch2.prototype.next = function(item) {
      if (isArray(item)) {
        for (var i = 0, length_1 = item.length; i < length_1; i++) {
          this._queryOperation.reset();
          var child = item[i];
          this._queryOperation.next(child, i, item, false);
          this.keep = this.keep || this._queryOperation.keep;
        }
        this.done = true;
      } else {
        this.done = false;
        this.keep = false;
      }
    };
    return $ElemMatch2;
  }(BaseOperation)
);
var $Not = (
  /** @class */
  function(_super) {
    __extends($Not2, _super);
    function $Not2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    $Not2.prototype.init = function() {
      this._queryOperation = createQueryOperation(this.params, this.owneryQuery, this.options);
    };
    $Not2.prototype.reset = function() {
      _super.prototype.reset.call(this);
      this._queryOperation.reset();
    };
    $Not2.prototype.next = function(item, key, owner, root) {
      this._queryOperation.next(item, key, owner, root);
      this.done = this._queryOperation.done;
      this.keep = !this._queryOperation.keep;
    };
    return $Not2;
  }(BaseOperation)
);
var $Size = (
  /** @class */
  function(_super) {
    __extends($Size2, _super);
    function $Size2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    $Size2.prototype.init = function() {
    };
    $Size2.prototype.next = function(item) {
      if (isArray(item) && item.length === this.params) {
        this.done = true;
        this.keep = true;
      }
    };
    return $Size2;
  }(BaseOperation)
);
var assertGroupNotEmpty = function(values) {
  if (values.length === 0) {
    throw new Error("$and/$or/$nor must be a nonempty array");
  }
};
var $Or = (
  /** @class */
  function(_super) {
    __extends($Or2, _super);
    function $Or2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = false;
      return _this;
    }
    $Or2.prototype.init = function() {
      var _this = this;
      assertGroupNotEmpty(this.params);
      this._ops = this.params.map(function(op) {
        return createQueryOperation(op, null, _this.options);
      });
    };
    $Or2.prototype.reset = function() {
      this.done = false;
      this.keep = false;
      for (var i = 0, length_2 = this._ops.length; i < length_2; i++) {
        this._ops[i].reset();
      }
    };
    $Or2.prototype.next = function(item, key, owner) {
      var done = false;
      var success = false;
      for (var i = 0, length_3 = this._ops.length; i < length_3; i++) {
        var op = this._ops[i];
        op.next(item, key, owner);
        if (op.keep) {
          done = true;
          success = op.keep;
          break;
        }
      }
      this.keep = success;
      this.done = done;
    };
    return $Or2;
  }(BaseOperation)
);
var $Nor = (
  /** @class */
  function(_super) {
    __extends($Nor2, _super);
    function $Nor2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = false;
      return _this;
    }
    $Nor2.prototype.next = function(item, key, owner) {
      _super.prototype.next.call(this, item, key, owner);
      this.keep = !this.keep;
    };
    return $Nor2;
  }($Or)
);
var $In = (
  /** @class */
  function(_super) {
    __extends($In2, _super);
    function $In2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    $In2.prototype.init = function() {
      var _this = this;
      var params = Array.isArray(this.params) ? this.params : [this.params];
      this._testers = params.map(function(value) {
        if (containsOperation(value, _this.options)) {
          throw new Error("cannot nest $ under ".concat(_this.name.toLowerCase()));
        }
        return createTester(value, _this.options.compare);
      });
    };
    $In2.prototype.next = function(item, key, owner) {
      var done = false;
      var success = false;
      for (var i = 0, length_4 = this._testers.length; i < length_4; i++) {
        var test = this._testers[i];
        if (test(item)) {
          done = true;
          success = true;
          break;
        }
      }
      this.keep = success;
      this.done = done;
    };
    return $In2;
  }(BaseOperation)
);
var $Nin = (
  /** @class */
  function(_super) {
    __extends($Nin2, _super);
    function $Nin2(params, ownerQuery, options, name) {
      var _this = _super.call(this, params, ownerQuery, options, name) || this;
      _this.propop = true;
      _this._in = new $In(params, ownerQuery, options, name);
      return _this;
    }
    $Nin2.prototype.next = function(item, key, owner, root) {
      this._in.next(item, key, owner);
      if (isArray(owner) && !root) {
        if (this._in.keep) {
          this.keep = false;
          this.done = true;
        } else if (key == owner.length - 1) {
          this.keep = true;
          this.done = true;
        }
      } else {
        this.keep = !this._in.keep;
        this.done = true;
      }
    };
    $Nin2.prototype.reset = function() {
      _super.prototype.reset.call(this);
      this._in.reset();
    };
    return $Nin2;
  }(BaseOperation)
);
var $Exists = (
  /** @class */
  function(_super) {
    __extends($Exists2, _super);
    function $Exists2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.propop = true;
      return _this;
    }
    $Exists2.prototype.next = function(item, key, owner, root, leaf) {
      if (!leaf) {
        this.done = true;
        this.keep = !this.params;
      } else if (owner.hasOwnProperty(key) === this.params) {
        this.done = true;
        this.keep = true;
      }
    };
    return $Exists2;
  }(BaseOperation)
);
var $And = (
  /** @class */
  function(_super) {
    __extends($And2, _super);
    function $And2(params, owneryQuery, options, name) {
      var _this = _super.call(this, params, owneryQuery, options, params.map(function(query) {
        return createQueryOperation(query, owneryQuery, options);
      }), name) || this;
      _this.propop = false;
      assertGroupNotEmpty(params);
      return _this;
    }
    $And2.prototype.next = function(item, key, owner, root) {
      this.childrenNext(item, key, owner, root);
    };
    return $And2;
  }(NamedGroupOperation)
);
var $All = (
  /** @class */
  function(_super) {
    __extends($All2, _super);
    function $All2(params, owneryQuery, options, name) {
      var _this = _super.call(this, params, owneryQuery, options, params.map(function(query) {
        return createQueryOperation(query, owneryQuery, options);
      }), name) || this;
      _this.propop = true;
      return _this;
    }
    $All2.prototype.next = function(item, key, owner, root) {
      this.childrenNext(item, key, owner, root);
    };
    return $All2;
  }(NamedGroupOperation)
);
var $eq = function(params, owneryQuery, options) {
  return new EqualsOperation(params, owneryQuery, options);
};
var $ne = function(params, owneryQuery, options, name) {
  return new $Ne(params, owneryQuery, options, name);
};
var $or = function(params, owneryQuery, options, name) {
  return new $Or(params, owneryQuery, options, name);
};
var $nor = function(params, owneryQuery, options, name) {
  return new $Nor(params, owneryQuery, options, name);
};
var $elemMatch = function(params, owneryQuery, options, name) {
  return new $ElemMatch(params, owneryQuery, options, name);
};
var $nin = function(params, owneryQuery, options, name) {
  return new $Nin(params, owneryQuery, options, name);
};
var $in = function(params, owneryQuery, options, name) {
  return new $In(params, owneryQuery, options, name);
};
var $lt = numericalOperation(function(params) {
  return function(b) {
    return b != null && b < params;
  };
});
var $lte = numericalOperation(function(params) {
  return function(b) {
    return b === params || b <= params;
  };
});
var $gt = numericalOperation(function(params) {
  return function(b) {
    return b != null && b > params;
  };
});
var $gte = numericalOperation(function(params) {
  return function(b) {
    return b === params || b >= params;
  };
});
var $mod = function(_a, owneryQuery, options) {
  var mod = _a[0], equalsValue = _a[1];
  return new EqualsOperation(function(b) {
    return comparable(b) % mod === equalsValue;
  }, owneryQuery, options);
};
var $exists = function(params, owneryQuery, options, name) {
  return new $Exists(params, owneryQuery, options, name);
};
var $regex = function(pattern, owneryQuery, options) {
  return new EqualsOperation(new RegExp(pattern, owneryQuery.$options), owneryQuery, options);
};
var $not = function(params, owneryQuery, options, name) {
  return new $Not(params, owneryQuery, options, name);
};
var typeAliases = {
  number: function(v) {
    return typeof v === "number";
  },
  string: function(v) {
    return typeof v === "string";
  },
  bool: function(v) {
    return typeof v === "boolean";
  },
  array: function(v) {
    return Array.isArray(v);
  },
  null: function(v) {
    return v === null;
  },
  timestamp: function(v) {
    return v instanceof Date;
  }
};
var $type = function(clazz, owneryQuery, options) {
  return new EqualsOperation(function(b) {
    if (typeof clazz === "string") {
      if (!typeAliases[clazz]) {
        throw new Error("Type alias does not exist");
      }
      return typeAliases[clazz](b);
    }
    return b != null ? b instanceof clazz || b.constructor === clazz : false;
  }, owneryQuery, options);
};
var $and = function(params, ownerQuery, options, name) {
  return new $And(params, ownerQuery, options, name);
};
var $all = function(params, ownerQuery, options, name) {
  return new $All(params, ownerQuery, options, name);
};
var $size = function(params, ownerQuery, options) {
  return new $Size(params, ownerQuery, options, "$size");
};
var $options = function() {
  return null;
};
var $where = function(params, ownerQuery, options) {
  var test;
  if (isFunction(params)) {
    test = params;
  } else if (!process.env.CSP_ENABLED) {
    test = new Function("obj", "return " + params);
  } else {
    throw new Error('In CSP mode, sift does not support strings in "$where" condition');
  }
  return new EqualsOperation(function(b) {
    return test.bind(b)(b);
  }, ownerQuery, options);
};
var defaultOperations = Object.freeze({
  __proto__: null,
  $Size,
  $all,
  $and,
  $elemMatch,
  $eq,
  $exists,
  $gt,
  $gte,
  $in,
  $lt,
  $lte,
  $mod,
  $ne,
  $nin,
  $nor,
  $not,
  $options,
  $or,
  $regex,
  $size,
  $type,
  $where
});
var createDefaultQueryOperation = function(query, ownerQuery, _a) {
  var _b = _a === void 0 ? {} : _a, compare = _b.compare, operations = _b.operations;
  return createQueryOperation(query, ownerQuery, {
    compare,
    operations: Object.assign({}, defaultOperations, operations || {})
  });
};
var createDefaultQueryTester = function(query, options) {
  if (options === void 0) {
    options = {};
  }
  var op = createDefaultQueryOperation(query, null, options);
  return createOperationTester(op);
};

// node_modules/feathers-reactive/dist/index.mjs
var import_json_stable_stringify = __toESM(require_json_stable_stringify(), 1);
var import_commons = __toESM(require_lib2(), 1);
var import_adapter_commons = __toESM(require_lib3(), 1);
var debug$1 = (0, import_debug.default)("feathers-reactive");
function cacheObservable(cache = {}, method, key, observable) {
  const hash = _hash(key);
  const cachedObservable = observable.pipe(finalize(() => {
    debug$1("removing cache item: ", hash);
    delete cache[method][hash];
  }), _oldStyleShareReplay(1));
  cache[method][hash] = cachedObservable;
  return cache[method][hash];
}
function getCachedObservable(cache = {}, method, key) {
  const hash = _hash(key);
  return cache[method][hash];
}
function _hash(key) {
  return (0, import_json_stable_stringify.default)(key);
}
function _oldStyleShareReplay(bufferSize, windowTime, scheduler) {
  let subject;
  const connectable = multicast(function shareReplaySubjectFactory() {
    if (this._isComplete) {
      return subject;
    } else {
      return subject = new ReplaySubject(bufferSize, windowTime, scheduler);
    }
  });
  return (source) => refCount()(connectable(source));
}
function getSource(originalMethod, args) {
  return defer(() => originalMethod(...args));
}
function makeSorter(query, options) {
  const sorter$1 = query.$sort ? (0, import_adapter_commons.sorter)(query.$sort) : (0, import_adapter_commons.sorter)({
    [options.idField]: 1
  });
  return function(result) {
    const isPaginated = !!result[options.dataField];
    let data = isPaginated ? result[options.dataField] : result;
    if (sorter$1) {
      data = data.sort(sorter$1);
    }
    const limit = typeof result.limit === "number" ? result.limit : parseInt(query.$limit, 10);
    if (limit && !isNaN(limit) && limit !== -1) {
      data = data.slice(0, limit);
    }
    if (isPaginated) {
      result[options.dataField] = data;
    } else {
      result = data;
    }
    return result;
  };
}
function getOptions(base, ...others) {
  const options = Object.assign({}, base, ...others);
  if (typeof options.listStrategy === "string") {
    options.listStrategy = options.listStrategies[options.listStrategy];
  }
  return options;
}
function getPipeStream(stream, options) {
  if (!options.pipe) {
    return stream;
  } else if (Array.isArray(options.pipe)) {
    return stream.pipe(...options.pipe);
  } else {
    return stream.pipe(options.pipe);
  }
}
function getParamsPosition(method) {
  const paramsPositions = {
    find: 0,
    update: 2,
    patch: 2
  };
  return method in paramsPositions ? paramsPositions[method] : 1;
}
function siftMatcher(originalQuery) {
  const keysToOmit = Object.keys(originalQuery).filter((key) => key.charCodeAt(0) === 36);
  const query = import_commons._.omit(originalQuery, ...keysToOmit);
  return createDefaultQueryTester(query);
}
function reactiveList(settings) {
  return function(params) {
    const cachedObservable = getCachedObservable(this._cache, "find", params);
    if (cachedObservable) {
      return cachedObservable;
    }
    const options = getOptions(settings, this._rx, params.rx);
    const source = getSource(this.find.bind(this), arguments);
    const stream = options.listStrategy.call(this, source, options, arguments);
    const pipeStream = getPipeStream(stream, options);
    return cacheObservable(this._cache, "find", params, pipeStream);
  };
}
function reactiveResource(settings, method) {
  return function() {
    const position = getParamsPosition(method);
    const params = arguments[position] || {};
    const cachedObservable = method === "get" ? getCachedObservable(
      this._cache,
      "get",
      /* id */
      arguments[0]
    ) : void 0;
    if (cachedObservable) {
      return cachedObservable;
    }
    const options = getOptions(settings, this._rx, params.rx);
    const source = getSource(this[method].bind(this), arguments);
    const stream = source.pipe(concatMap((data) => {
      const filterFn = (current) => current[options.idField] === data[options.idField];
      const filteredRemoves = this.removed$.pipe(filter(filterFn));
      const filteredEvents = merge(this.created$, this.updated$, this.patched$).pipe(filter(filterFn));
      const combinedEvents = merge(
        // Map to a callback that merges old and new data
        filteredEvents,
        // filtered `removed` events always mapped to `null`
        filteredRemoves.pipe(mapTo(null))
      );
      return of(data).pipe(concat(combinedEvents));
    }));
    const pipeStream = getPipeStream(stream, options);
    return method === "get" ? cacheObservable(
      this._cache,
      "get",
      /* id */
      arguments[0],
      pipeStream
    ) : pipeStream;
  };
}
function strategies() {
  return {
    // created$: new Observable<T>(),
    // updated$: new Observable<T>(),
    // patched$: new Observable<T>(),
    // removed$: new Observable<T>(),
    // reset$: new Observable<void>(),
    never(source$) {
      return source$;
    },
    always(source$, options, args) {
      const params = args[0] || {};
      const query = Object.assign({}, params.query);
      const matches = options.matcher(query);
      const events$ = merge(this.created$.pipe(filter(matches)), this.removed$, this.updated$, this.patched$);
      return source$.pipe(concat(events$.pipe(concatMapTo(source$))));
    },
    smart(source$, options, args) {
      const params = args[0] || {};
      const query = Object.assign({}, params.query);
      const matches = options.matcher(query);
      const sortAndTrim = options.sorter(query, options);
      const onCreated = (eventData) => {
        return (page) => {
          const isPaginated = !!page[options.dataField];
          const process2 = (data) => {
            const exists = data.find((current) => eventData[options.idField] === current[options.idField]);
            return exists ? data : data.concat(eventData);
          };
          if (isPaginated) {
            return Object.assign({}, page, {
              total: page.total + 1,
              [options.dataField]: process2(page[options.dataField])
            });
          }
          return process2(page);
        };
      };
      const onRemoved = (eventData) => {
        return (page) => {
          const isPaginated = !!page[options.dataField];
          const process2 = (data) => data.filter((current) => eventData[options.idField] !== current[options.idField]);
          if (isPaginated) {
            return Object.assign({}, page, {
              total: matches(eventData) ? page.total - 1 : page.total,
              [options.dataField]: process2(page[options.dataField])
            });
          }
          return process2(page);
        };
      };
      const onUpdated = (eventData) => {
        return (page) => {
          const isPaginated = !!page[options.dataField];
          const length = isPaginated ? page[options.dataField].length : page.length;
          const process2 = (data) => {
            let newData = data.filter((current) => eventData[options.idField] !== current[options.idField]);
            if (newData.length < data.length || matches([eventData])) {
              newData = newData.concat(eventData);
            }
            return newData.filter(matches);
          };
          if (isPaginated) {
            const processed = process2(page[options.dataField]);
            return Object.assign({}, page, {
              // Total can be either decreased or increased based
              // on if the update removed or added the item to the list
              total: page.total - (length - processed.length),
              [options.dataField]: processed
            });
          }
          return process2(page);
        };
      };
      const events$ = merge(this.created$.pipe(filter(matches), map(onCreated)), this.removed$.pipe(map(onRemoved)), merge(this.updated$, this.patched$).pipe(map(onUpdated)));
      const reset$ = this.reset$;
      return merge(source$, reset$.pipe(concatMapTo(source$))).pipe(switchMap((data) => of(data).pipe(concat(events$.pipe(scan(
        (current, callback) => sortAndTrim(callback(current)),
        // TODO: Hacky type cast to make typescript happy
        data
      ))))));
    }
  };
}
var debug = (0, import_debug.default)("feathers-reactive");
function rx(options = {
  idField: "_id"
}) {
  const listStrategies = strategies();
  const resetSubject = new Subject();
  if (!options.idField) {
    throw new Error("feathers-reactive: setting options.idField is mandatory");
  }
  options = Object.assign({
    dataField: "data",
    sorter: makeSorter,
    matcher: siftMatcher,
    // Whether to requery service when a change is detected
    listStrategy: "smart",
    listStrategies
  }, options);
  const mixin = function(service) {
    const events = {
      // fromEvent's result selector (3rd arg) is deprecated
      // we need it here because service events have an inconsistent number of arguments (i.e. sometimes 1, sometimes >1)
      // related: https://github.com/ReactiveX/rxjs/issues/3751
      created: fromEvent(service, "created", (...args) => args[0]).pipe(share()),
      updated: fromEvent(service, "updated", (...args) => args[0]).pipe(share()),
      patched: fromEvent(service, "patched", (...args) => args[0]).pipe(share()),
      removed: fromEvent(service, "removed", (...args) => args[0]).pipe(share()),
      reset: resetSubject.asObservable()
    };
    const reactiveMethods = {};
    const cache = {
      find: {},
      get: {}
    };
    const methods = ["find", "get", "create", "update", "patch", "remove"];
    methods.forEach((method) => {
      if (typeof service[method] === "function") {
        reactiveMethods[method] = method === "find" ? reactiveList(options) : reactiveResource(options, method);
      }
    });
    const mixin2 = {
      _cache: cache,
      created$: events.created,
      updated$: events.updated,
      patched$: events.patched,
      removed$: events.removed,
      reset$: events.reset,
      _rx: {},
      // TODO: Added during typescript migration. Is this needed?
      rx(options2 = {}) {
        this._rx = options2;
        return this;
      },
      reset() {
        resetSubject.next();
      },
      watch(options2 = {}) {
        const boundMethods = {};
        Object.keys(reactiveMethods).forEach((method) => {
          const position = getParamsPosition(method);
          boundMethods[method] = (...args) => {
            args[position] = Object.assign(args[position] || {}, {
              rx: options2
            });
            return reactiveMethods[method](...args);
          };
        });
        return boundMethods;
      }
    };
    const newService = Object.assign(service, mixin2);
    if (Object.prototype.watch && Object.prototype.watch === newService.watch) {
      newService.watch = mixin2.watch;
    }
    for (const method in reactiveMethods) {
      reactiveMethods[method] = reactiveMethods[method].bind(newService);
    }
  };
  return function(app) {
    debug("Initializing feathers-reactive plugin");
    app.mixins.push(mixin);
    if (app.io && typeof app.io.addEventListener === "function") {
      app.io.addListener = app.io.addEventListener;
    }
  };
}
rx.strategy = strategies;
rx.sift = createDefaultQueryTester;
export {
  rx
};
//# sourceMappingURL=feathers-reactive.js.map
