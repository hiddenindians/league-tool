import {
  require_lib as require_lib3
} from "./chunk-J32EKV2V.js";
import {
  require_lib
} from "./chunk-OSBADUCG.js";
import {
  require_lib as require_lib2
} from "./chunk-EBLTVSVM.js";
import {
  __commonJS
} from "./chunk-4MWRP73S.js";

// node_modules/@feathersjs/transport-commons/lib/client.js
var require_client = __commonJS({
  "node_modules/@feathersjs/transport-commons/lib/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Service = void 0;
    var errors_1 = require_lib();
    var commons_1 = require_lib2();
    var debug = (0, commons_1.createDebug)("@feathersjs/transport-commons/client");
    var namespacedEmitterMethods = ["addListener", "addEventListener", "emit", "listenerCount", "listeners", "on", "once", "prependListener", "prependOnceListener", "removeAllListeners", "removeEventListener", "removeListener"];
    var otherEmitterMethods = ["eventNames", "getMaxListeners", "setMaxListeners"];
    var addEmitterMethods = (service) => {
      otherEmitterMethods.forEach((method) => {
        service[method] = function(...args) {
          if (typeof this.connection[method] !== "function") {
            throw new Error(`Can not call '${method}' on the client service connection`);
          }
          return this.connection[method](...args);
        };
      });
      namespacedEmitterMethods.forEach((method) => {
        service[method] = function(name, ...args) {
          if (typeof this.connection[method] !== "function") {
            throw new Error(`Can not call '${method}' on the client service connection`);
          }
          const eventName = `${this.path} ${name}`;
          debug(`Calling emitter method ${method} with namespaced event '${eventName}'`);
          const result = this.connection[method](eventName, ...args);
          return result === this.connection ? this : result;
        };
      });
    };
    var Service = class {
      constructor(options) {
        this.events = options.events;
        this.path = options.name;
        this.connection = options.connection;
        this.method = options.method;
        addEmitterMethods(this);
      }
      send(method, ...args) {
        return new Promise((resolve, reject) => {
          var _a, _b;
          const route = args.pop();
          let path = this.path;
          if (route) {
            Object.keys(route).forEach((key) => {
              path = path.replace(`:${key}`, route[key]);
            });
          }
          args.unshift(method, path);
          const socketTimeout = ((_a = this.connection.flags) === null || _a === void 0 ? void 0 : _a.timeout) || ((_b = this.connection._opts) === null || _b === void 0 ? void 0 : _b.ackTimeout);
          if (socketTimeout !== void 0) {
            args.push(function(timeoutError, error, data) {
              return timeoutError || error ? reject((0, errors_1.convert)(timeoutError || error)) : resolve(data);
            });
          } else {
            args.push(function(error, data) {
              return error ? reject((0, errors_1.convert)(error)) : resolve(data);
            });
          }
          debug(`Sending socket.${this.method}`, args);
          this.connection[this.method](...args);
        });
      }
      methods(...names) {
        names.forEach((method) => {
          const _method = `_${method}`;
          this[_method] = function(data, params = {}) {
            return this.send(method, data, params.query || {}, params.route || {});
          };
          this[method] = function(data, params = {}) {
            return this[_method](data, params, params.route || {});
          };
        });
        return this;
      }
      _find(params = {}) {
        return this.send("find", params.query || {}, params.route || {});
      }
      find(params = {}) {
        return this._find(params);
      }
      _get(id, params = {}) {
        return this.send("get", id, params.query || {}, params.route || {});
      }
      get(id, params = {}) {
        return this._get(id, params);
      }
      _create(data, params = {}) {
        return this.send("create", data, params.query || {}, params.route || {});
      }
      create(data, params = {}) {
        return this._create(data, params);
      }
      _update(id, data, params = {}) {
        if (typeof id === "undefined") {
          return Promise.reject(new Error("id for 'update' can not be undefined"));
        }
        return this.send("update", id, data, params.query || {}, params.route || {});
      }
      update(id, data, params = {}) {
        return this._update(id, data, params);
      }
      _patch(id, data, params = {}) {
        return this.send("patch", id, data, params.query || {}, params.route || {});
      }
      patch(id, data, params = {}) {
        return this._patch(id, data, params);
      }
      _remove(id, params = {}) {
        return this.send("remove", id, params.query || {}, params.route || {});
      }
      remove(id, params = {}) {
        return this._remove(id, params);
      }
      // `off` is actually not part of the Node event emitter spec
      // but we are adding it since everybody is expecting it because
      // of the emitter-component Socket.io is using
      off(name, ...args) {
        if (typeof this.connection.off === "function") {
          const result = this.connection.off(`${this.path} ${name}`, ...args);
          return result === this.connection ? this : result;
        } else if (args.length === 0) {
          return this.removeAllListeners(name);
        }
        return this.removeListener(name, ...args);
      }
    };
    exports.Service = Service;
  }
});

// node_modules/@feathersjs/transport-commons/client.js
var require_client2 = __commonJS({
  "node_modules/@feathersjs/transport-commons/client.js"(exports, module) {
    module.exports = require_client();
  }
});

// node_modules/@feathersjs/socketio-client/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/@feathersjs/socketio-client/lib/index.js"(exports, module) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = socketioClient;
    var client_1 = require_client2();
    var feathers_1 = require_lib3();
    function socketioClient(connection, options) {
      if (!connection) {
        throw new Error("Socket.io connection needs to be provided");
      }
      const defaultService = function(name) {
        const events = Object.values(feathers_1.defaultEventMap);
        const settings = Object.assign({}, options, {
          events,
          name,
          connection,
          method: "emit"
        });
        return new client_1.Service(settings);
      };
      const initialize = function(app) {
        if (app.io !== void 0) {
          throw new Error("Only one default client provider can be configured");
        }
        app.io = connection;
        app.defaultService = defaultService;
        app.mixins.unshift((service, _location, options2) => {
          if (options2 && options2.methods && service instanceof client_1.Service) {
            const customMethods = options2.methods.filter((name) => !feathers_1.defaultServiceMethods.includes(name));
            service.methods(...customMethods);
          }
        });
      };
      initialize.Service = client_1.Service;
      initialize.service = defaultService;
      return initialize;
    }
    if (typeof module !== "undefined") {
      module.exports = Object.assign(socketioClient, module.exports);
    }
  }
});
export default require_lib4();
//# sourceMappingURL=@feathersjs_socketio-client.js.map
