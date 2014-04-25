(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "sifter\n======\n\nSift through images and junx.\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Sift through Images and Junx\n============================\n\n    require \"./duct_tape\"\n\n    {applyStylesheet} = require \"util\"\n    applyStylesheet require \"./style\"\n\n    # async = require \"./lib/async\"\n\n    S3Trinket = require \"s3-trinket\"\n    Storage = require \"storage\"\n    storage = Storage.new(\"sifter\")\n\n    trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)\n\n    # trinket.loadWorkspace(\"master\").then (data) ->\n    #   console.log data\n\n    template = require \"./templates/main\"\n    view = template\n      url: (key) ->\n        n = parseInt key.slice(-1), 0x10\n        if isNaN(n)\n          n = 0\n        else\n          n = n % 4\n\n        \"http://t#{n}.pixiecdn.com/#{key}\"\n\n      keys: storage.get(\"recentImages\") or []\n\n    document.body.appendChild(view)\n\n    appendRecentImage = (key) ->\n      recentImages = storage.get(\"recentImages\") or []\n      if recentImages.indexOf(key) is -1\n        recentImages.push key \n\n      storage.set \"recentImages\", recentImages\n\n    addEventListener \"message\", (event) ->\n      {data, origin, source} = event\n\n      if data.key\n        appendRecentImage data.key\n\n      # Send back info for debugging\n      source.postMessage\n        data: data\n        origin: origin\n      , \"*\"\n",
      "mode": "100644"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html\n  height: 100%\n\nbody\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif\n  height: 100%\n  margin: 0\n  position: relative\n\n.help\n  color: white\n  height: 100%\n  background-color: rgba(0, 0, 0, 0.875)\n  padding: 1em\n  position: absolute\n  top: 100%\n  width: 100%\n  z-index: 9000\n\n  transition-duration: 0.3s\n\n  &.up\n    top: 0\n\n  .key\n    display: inline-block\n    font-weight: bold\n    padding-right: 20px\n    text-align: right\n    vertical-align: top\n    width: 160px\n\n  .command\n    display: inline-block\n",
      "mode": "100644"
    },
    "templates/main.haml": {
      "path": "templates/main.haml",
      "content": "\n- self = this\n.images\n  - each @keys, (key) ->\n    - url = self.url(key)\n    %img(src=url)\n",
      "mode": "100644"
    },
    "duct_tape.coffee.md": {
      "path": "duct_tape.coffee.md",
      "content": "Duct Tape\n=========\n\n    global.Observable = require \"observable\"\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\ndependencies:\n  composition: \"distri/compositions:v0.1.1\"\n  \"jquery-hotkeys\": \"distri/jquery-hotkeys:v0.9.2\"\n  observable: \"distri/observable:v0.1.1\"\n  \"s3-trinket\": \"distri/s3-trinket:v0.1.1\"\n  storage: \"distri/storage:v0.1.0\"\n  util: \"distri/util:v0.1.0\"\n",
      "mode": "100644"
    },
    "lib/async.js": {
      "path": "lib/async.js",
      "content": "/*jshint onevar: false, indent:4 */\n/*global setImmediate: false, setTimeout: false, console: false */\n(function () {\n\n    var async = {};\n\n    // global on the server, window in the browser\n    var root, previous_async;\n\n    root = this;\n    if (root != null) {\n      previous_async = root.async;\n    }\n\n    async.noConflict = function () {\n        root.async = previous_async;\n        return async;\n    };\n\n    function only_once(fn) {\n        var called = false;\n        return function() {\n            if (called) throw new Error(\"Callback was already called.\");\n            called = true;\n            fn.apply(root, arguments);\n        }\n    }\n\n    //// cross-browser compatiblity functions ////\n\n    var _toString = Object.prototype.toString;\n\n    var _isArray = Array.isArray || function (obj) {\n        return _toString.call(obj) === '[object Array]';\n    };\n\n    var _each = function (arr, iterator) {\n        if (arr.forEach) {\n            return arr.forEach(iterator);\n        }\n        for (var i = 0; i < arr.length; i += 1) {\n            iterator(arr[i], i, arr);\n        }\n    };\n\n    var _map = function (arr, iterator) {\n        if (arr.map) {\n            return arr.map(iterator);\n        }\n        var results = [];\n        _each(arr, function (x, i, a) {\n            results.push(iterator(x, i, a));\n        });\n        return results;\n    };\n\n    var _reduce = function (arr, iterator, memo) {\n        if (arr.reduce) {\n            return arr.reduce(iterator, memo);\n        }\n        _each(arr, function (x, i, a) {\n            memo = iterator(memo, x, i, a);\n        });\n        return memo;\n    };\n\n    var _keys = function (obj) {\n        if (Object.keys) {\n            return Object.keys(obj);\n        }\n        var keys = [];\n        for (var k in obj) {\n            if (obj.hasOwnProperty(k)) {\n                keys.push(k);\n            }\n        }\n        return keys;\n    };\n\n    //// exported async module functions ////\n\n    //// nextTick implementation with browser-compatible fallback ////\n    if (typeof process === 'undefined' || !(process.nextTick)) {\n        if (typeof setImmediate === 'function') {\n            async.nextTick = function (fn) {\n                // not a direct alias for IE10 compatibility\n                setImmediate(fn);\n            };\n            async.setImmediate = async.nextTick;\n        }\n        else {\n            async.nextTick = function (fn) {\n                setTimeout(fn, 0);\n            };\n            async.setImmediate = async.nextTick;\n        }\n    }\n    else {\n        async.nextTick = process.nextTick;\n        if (typeof setImmediate !== 'undefined') {\n            async.setImmediate = function (fn) {\n              // not a direct alias for IE10 compatibility\n              setImmediate(fn);\n            };\n        }\n        else {\n            async.setImmediate = async.nextTick;\n        }\n    }\n\n    async.each = function (arr, iterator, callback) {\n        callback = callback || function () {};\n        if (!arr.length) {\n            return callback();\n        }\n        var completed = 0;\n        _each(arr, function (x) {\n            iterator(x, only_once(done) );\n        });\n        function done(err) {\n          if (err) {\n              callback(err);\n              callback = function () {};\n          }\n          else {\n              completed += 1;\n              if (completed >= arr.length) {\n                  callback();\n              }\n          }\n        }\n    };\n    async.forEach = async.each;\n\n    async.eachSeries = function (arr, iterator, callback) {\n        callback = callback || function () {};\n        if (!arr.length) {\n            return callback();\n        }\n        var completed = 0;\n        var iterate = function () {\n            iterator(arr[completed], function (err) {\n                if (err) {\n                    callback(err);\n                    callback = function () {};\n                }\n                else {\n                    completed += 1;\n                    if (completed >= arr.length) {\n                        callback();\n                    }\n                    else {\n                        iterate();\n                    }\n                }\n            });\n        };\n        iterate();\n    };\n    async.forEachSeries = async.eachSeries;\n\n    async.eachLimit = function (arr, limit, iterator, callback) {\n        var fn = _eachLimit(limit);\n        fn.apply(null, [arr, iterator, callback]);\n    };\n    async.forEachLimit = async.eachLimit;\n\n    var _eachLimit = function (limit) {\n\n        return function (arr, iterator, callback) {\n            callback = callback || function () {};\n            if (!arr.length || limit <= 0) {\n                return callback();\n            }\n            var completed = 0;\n            var started = 0;\n            var running = 0;\n\n            (function replenish () {\n                if (completed >= arr.length) {\n                    return callback();\n                }\n\n                while (running < limit && started < arr.length) {\n                    started += 1;\n                    running += 1;\n                    iterator(arr[started - 1], function (err) {\n                        if (err) {\n                            callback(err);\n                            callback = function () {};\n                        }\n                        else {\n                            completed += 1;\n                            running -= 1;\n                            if (completed >= arr.length) {\n                                callback();\n                            }\n                            else {\n                                replenish();\n                            }\n                        }\n                    });\n                }\n            })();\n        };\n    };\n\n\n    var doParallel = function (fn) {\n        return function () {\n            var args = Array.prototype.slice.call(arguments);\n            return fn.apply(null, [async.each].concat(args));\n        };\n    };\n    var doParallelLimit = function(limit, fn) {\n        return function () {\n            var args = Array.prototype.slice.call(arguments);\n            return fn.apply(null, [_eachLimit(limit)].concat(args));\n        };\n    };\n    var doSeries = function (fn) {\n        return function () {\n            var args = Array.prototype.slice.call(arguments);\n            return fn.apply(null, [async.eachSeries].concat(args));\n        };\n    };\n\n\n    var _asyncMap = function (eachfn, arr, iterator, callback) {\n        var results = [];\n        arr = _map(arr, function (x, i) {\n            return {index: i, value: x};\n        });\n        eachfn(arr, function (x, callback) {\n            iterator(x.value, function (err, v) {\n                results[x.index] = v;\n                callback(err);\n            });\n        }, function (err) {\n            callback(err, results);\n        });\n    };\n    async.map = doParallel(_asyncMap);\n    async.mapSeries = doSeries(_asyncMap);\n    async.mapLimit = function (arr, limit, iterator, callback) {\n        return _mapLimit(limit)(arr, iterator, callback);\n    };\n\n    var _mapLimit = function(limit) {\n        return doParallelLimit(limit, _asyncMap);\n    };\n\n    // reduce only has a series version, as doing reduce in parallel won't\n    // work in many situations.\n    async.reduce = function (arr, memo, iterator, callback) {\n        async.eachSeries(arr, function (x, callback) {\n            iterator(memo, x, function (err, v) {\n                memo = v;\n                callback(err);\n            });\n        }, function (err) {\n            callback(err, memo);\n        });\n    };\n    // inject alias\n    async.inject = async.reduce;\n    // foldl alias\n    async.foldl = async.reduce;\n\n    async.reduceRight = function (arr, memo, iterator, callback) {\n        var reversed = _map(arr, function (x) {\n            return x;\n        }).reverse();\n        async.reduce(reversed, memo, iterator, callback);\n    };\n    // foldr alias\n    async.foldr = async.reduceRight;\n\n    var _filter = function (eachfn, arr, iterator, callback) {\n        var results = [];\n        arr = _map(arr, function (x, i) {\n            return {index: i, value: x};\n        });\n        eachfn(arr, function (x, callback) {\n            iterator(x.value, function (v) {\n                if (v) {\n                    results.push(x);\n                }\n                callback();\n            });\n        }, function (err) {\n            callback(_map(results.sort(function (a, b) {\n                return a.index - b.index;\n            }), function (x) {\n                return x.value;\n            }));\n        });\n    };\n    async.filter = doParallel(_filter);\n    async.filterSeries = doSeries(_filter);\n    // select alias\n    async.select = async.filter;\n    async.selectSeries = async.filterSeries;\n\n    var _reject = function (eachfn, arr, iterator, callback) {\n        var results = [];\n        arr = _map(arr, function (x, i) {\n            return {index: i, value: x};\n        });\n        eachfn(arr, function (x, callback) {\n            iterator(x.value, function (v) {\n                if (!v) {\n                    results.push(x);\n                }\n                callback();\n            });\n        }, function (err) {\n            callback(_map(results.sort(function (a, b) {\n                return a.index - b.index;\n            }), function (x) {\n                return x.value;\n            }));\n        });\n    };\n    async.reject = doParallel(_reject);\n    async.rejectSeries = doSeries(_reject);\n\n    var _detect = function (eachfn, arr, iterator, main_callback) {\n        eachfn(arr, function (x, callback) {\n            iterator(x, function (result) {\n                if (result) {\n                    main_callback(x);\n                    main_callback = function () {};\n                }\n                else {\n                    callback();\n                }\n            });\n        }, function (err) {\n            main_callback();\n        });\n    };\n    async.detect = doParallel(_detect);\n    async.detectSeries = doSeries(_detect);\n\n    async.some = function (arr, iterator, main_callback) {\n        async.each(arr, function (x, callback) {\n            iterator(x, function (v) {\n                if (v) {\n                    main_callback(true);\n                    main_callback = function () {};\n                }\n                callback();\n            });\n        }, function (err) {\n            main_callback(false);\n        });\n    };\n    // any alias\n    async.any = async.some;\n\n    async.every = function (arr, iterator, main_callback) {\n        async.each(arr, function (x, callback) {\n            iterator(x, function (v) {\n                if (!v) {\n                    main_callback(false);\n                    main_callback = function () {};\n                }\n                callback();\n            });\n        }, function (err) {\n            main_callback(true);\n        });\n    };\n    // all alias\n    async.all = async.every;\n\n    async.sortBy = function (arr, iterator, callback) {\n        async.map(arr, function (x, callback) {\n            iterator(x, function (err, criteria) {\n                if (err) {\n                    callback(err);\n                }\n                else {\n                    callback(null, {value: x, criteria: criteria});\n                }\n            });\n        }, function (err, results) {\n            if (err) {\n                return callback(err);\n            }\n            else {\n                var fn = function (left, right) {\n                    var a = left.criteria, b = right.criteria;\n                    return a < b ? -1 : a > b ? 1 : 0;\n                };\n                callback(null, _map(results.sort(fn), function (x) {\n                    return x.value;\n                }));\n            }\n        });\n    };\n\n    async.auto = function (tasks, callback) {\n        callback = callback || function () {};\n        var keys = _keys(tasks);\n        var remainingTasks = keys.length\n        if (!remainingTasks) {\n            return callback();\n        }\n\n        var results = {};\n\n        var listeners = [];\n        var addListener = function (fn) {\n            listeners.unshift(fn);\n        };\n        var removeListener = function (fn) {\n            for (var i = 0; i < listeners.length; i += 1) {\n                if (listeners[i] === fn) {\n                    listeners.splice(i, 1);\n                    return;\n                }\n            }\n        };\n        var taskComplete = function () {\n            remainingTasks--\n            _each(listeners.slice(0), function (fn) {\n                fn();\n            });\n        };\n\n        addListener(function () {\n            if (!remainingTasks) {\n                var theCallback = callback;\n                // prevent final callback from calling itself if it errors\n                callback = function () {};\n\n                theCallback(null, results);\n            }\n        });\n\n        _each(keys, function (k) {\n            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];\n            var taskCallback = function (err) {\n                var args = Array.prototype.slice.call(arguments, 1);\n                if (args.length <= 1) {\n                    args = args[0];\n                }\n                if (err) {\n                    var safeResults = {};\n                    _each(_keys(results), function(rkey) {\n                        safeResults[rkey] = results[rkey];\n                    });\n                    safeResults[k] = args;\n                    callback(err, safeResults);\n                    // stop subsequent errors hitting callback multiple times\n                    callback = function () {};\n                }\n                else {\n                    results[k] = args;\n                    async.setImmediate(taskComplete);\n                }\n            };\n            var requires = task.slice(0, Math.abs(task.length - 1)) || [];\n            var ready = function () {\n                return _reduce(requires, function (a, x) {\n                    return (a && results.hasOwnProperty(x));\n                }, true) && !results.hasOwnProperty(k);\n            };\n            if (ready()) {\n                task[task.length - 1](taskCallback, results);\n            }\n            else {\n                var listener = function () {\n                    if (ready()) {\n                        removeListener(listener);\n                        task[task.length - 1](taskCallback, results);\n                    }\n                };\n                addListener(listener);\n            }\n        });\n    };\n\n    async.retry = function(times, task, callback) {\n        var DEFAULT_TIMES = 5;\n        var attempts = [];\n        // Use defaults if times not passed\n        if (typeof times === 'function') {\n            callback = task;\n            task = times;\n            times = DEFAULT_TIMES;\n        }\n        // Make sure times is a number\n        times = parseInt(times, 10) || DEFAULT_TIMES;\n        var wrappedTask = function(wrappedCallback, wrappedResults) {\n            var retryAttempt = function(task, finalAttempt) {\n                return function(seriesCallback) {\n                    task(function(err, result){\n                        seriesCallback(!err || finalAttempt, {err: err, result: result});\n                    }, wrappedResults);\n                };\n            };\n            while (times) {\n                attempts.push(retryAttempt(task, !(times-=1)));\n            }\n            async.series(attempts, function(done, data){\n                data = data[data.length - 1];\n                (wrappedCallback || callback)(data.err, data.result);\n            });\n        }\n        // If a callback is passed, run this as a controll flow\n        return callback ? wrappedTask() : wrappedTask\n    };\n\n    async.waterfall = function (tasks, callback) {\n        callback = callback || function () {};\n        if (!_isArray(tasks)) {\n          var err = new Error('First argument to waterfall must be an array of functions');\n          return callback(err);\n        }\n        if (!tasks.length) {\n            return callback();\n        }\n        var wrapIterator = function (iterator) {\n            return function (err) {\n                if (err) {\n                    callback.apply(null, arguments);\n                    callback = function () {};\n                }\n                else {\n                    var args = Array.prototype.slice.call(arguments, 1);\n                    var next = iterator.next();\n                    if (next) {\n                        args.push(wrapIterator(next));\n                    }\n                    else {\n                        args.push(callback);\n                    }\n                    async.setImmediate(function () {\n                        iterator.apply(null, args);\n                    });\n                }\n            };\n        };\n        wrapIterator(async.iterator(tasks))();\n    };\n\n    var _parallel = function(eachfn, tasks, callback) {\n        callback = callback || function () {};\n        if (_isArray(tasks)) {\n            eachfn.map(tasks, function (fn, callback) {\n                if (fn) {\n                    fn(function (err) {\n                        var args = Array.prototype.slice.call(arguments, 1);\n                        if (args.length <= 1) {\n                            args = args[0];\n                        }\n                        callback.call(null, err, args);\n                    });\n                }\n            }, callback);\n        }\n        else {\n            var results = {};\n            eachfn.each(_keys(tasks), function (k, callback) {\n                tasks[k](function (err) {\n                    var args = Array.prototype.slice.call(arguments, 1);\n                    if (args.length <= 1) {\n                        args = args[0];\n                    }\n                    results[k] = args;\n                    callback(err);\n                });\n            }, function (err) {\n                callback(err, results);\n            });\n        }\n    };\n\n    async.parallel = function (tasks, callback) {\n        _parallel({ map: async.map, each: async.each }, tasks, callback);\n    };\n\n    async.parallelLimit = function(tasks, limit, callback) {\n        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);\n    };\n\n    async.series = function (tasks, callback) {\n        callback = callback || function () {};\n        if (_isArray(tasks)) {\n            async.mapSeries(tasks, function (fn, callback) {\n                if (fn) {\n                    fn(function (err) {\n                        var args = Array.prototype.slice.call(arguments, 1);\n                        if (args.length <= 1) {\n                            args = args[0];\n                        }\n                        callback.call(null, err, args);\n                    });\n                }\n            }, callback);\n        }\n        else {\n            var results = {};\n            async.eachSeries(_keys(tasks), function (k, callback) {\n                tasks[k](function (err) {\n                    var args = Array.prototype.slice.call(arguments, 1);\n                    if (args.length <= 1) {\n                        args = args[0];\n                    }\n                    results[k] = args;\n                    callback(err);\n                });\n            }, function (err) {\n                callback(err, results);\n            });\n        }\n    };\n\n    async.iterator = function (tasks) {\n        var makeCallback = function (index) {\n            var fn = function () {\n                if (tasks.length) {\n                    tasks[index].apply(null, arguments);\n                }\n                return fn.next();\n            };\n            fn.next = function () {\n                return (index < tasks.length - 1) ? makeCallback(index + 1): null;\n            };\n            return fn;\n        };\n        return makeCallback(0);\n    };\n\n    async.apply = function (fn) {\n        var args = Array.prototype.slice.call(arguments, 1);\n        return function () {\n            return fn.apply(\n                null, args.concat(Array.prototype.slice.call(arguments))\n            );\n        };\n    };\n\n    var _concat = function (eachfn, arr, fn, callback) {\n        var r = [];\n        eachfn(arr, function (x, cb) {\n            fn(x, function (err, y) {\n                r = r.concat(y || []);\n                cb(err);\n            });\n        }, function (err) {\n            callback(err, r);\n        });\n    };\n    async.concat = doParallel(_concat);\n    async.concatSeries = doSeries(_concat);\n\n    async.whilst = function (test, iterator, callback) {\n        if (test()) {\n            iterator(function (err) {\n                if (err) {\n                    return callback(err);\n                }\n                async.whilst(test, iterator, callback);\n            });\n        }\n        else {\n            callback();\n        }\n    };\n\n    async.doWhilst = function (iterator, test, callback) {\n        iterator(function (err) {\n            if (err) {\n                return callback(err);\n            }\n            var args = Array.prototype.slice.call(arguments, 1);\n            if (test.apply(null, args)) {\n                async.doWhilst(iterator, test, callback);\n            }\n            else {\n                callback();\n            }\n        });\n    };\n\n    async.until = function (test, iterator, callback) {\n        if (!test()) {\n            iterator(function (err) {\n                if (err) {\n                    return callback(err);\n                }\n                async.until(test, iterator, callback);\n            });\n        }\n        else {\n            callback();\n        }\n    };\n\n    async.doUntil = function (iterator, test, callback) {\n        iterator(function (err) {\n            if (err) {\n                return callback(err);\n            }\n            var args = Array.prototype.slice.call(arguments, 1);\n            if (!test.apply(null, args)) {\n                async.doUntil(iterator, test, callback);\n            }\n            else {\n                callback();\n            }\n        });\n    };\n\n    async.queue = function (worker, concurrency) {\n        if (concurrency === undefined) {\n            concurrency = 1;\n        }\n        function _insert(q, data, pos, callback) {\n          if (!q.started){\n            q.started = true;\n          }\n          if (!_isArray(data)) {\n              data = [data];\n          }\n          if(data.length == 0) {\n             // call drain immediately if there are no tasks\n             return async.setImmediate(function() {\n                 if (q.drain) {\n                     q.drain();\n                 }\n             });\n          }\n          _each(data, function(task) {\n              var item = {\n                  data: task,\n                  callback: typeof callback === 'function' ? callback : null\n              };\n\n              if (pos) {\n                q.tasks.unshift(item);\n              } else {\n                q.tasks.push(item);\n              }\n\n              if (q.saturated && q.tasks.length === q.concurrency) {\n                  q.saturated();\n              }\n              async.setImmediate(q.process);\n          });\n        }\n\n        var workers = 0;\n        var q = {\n            tasks: [],\n            concurrency: concurrency,\n            saturated: null,\n            empty: null,\n            drain: null,\n            started: false,\n            paused: false,\n            push: function (data, callback) {\n              _insert(q, data, false, callback);\n            },\n            kill: function () {\n              q.drain = null;\n              q.tasks = [];\n            },\n            unshift: function (data, callback) {\n              _insert(q, data, true, callback);\n            },\n            process: function () {\n                if (!q.paused && workers < q.concurrency && q.tasks.length) {\n                    var task = q.tasks.shift();\n                    if (q.empty && q.tasks.length === 0) {\n                        q.empty();\n                    }\n                    workers += 1;\n                    var next = function () {\n                        workers -= 1;\n                        if (task.callback) {\n                            task.callback.apply(task, arguments);\n                        }\n                        if (q.drain && q.tasks.length + workers === 0) {\n                            q.drain();\n                        }\n                        q.process();\n                    };\n                    var cb = only_once(next);\n                    worker(task.data, cb);\n                }\n            },\n            length: function () {\n                return q.tasks.length;\n            },\n            running: function () {\n                return workers;\n            },\n            idle: function() {\n                return q.tasks.length + workers === 0;\n            },\n            pause: function () {\n                if (q.paused === true) { return; }\n                q.paused = true;\n                q.process();\n            },\n            resume: function () {\n                if (q.paused === false) { return; }\n                q.paused = false;\n                q.process();\n            }\n        };\n        return q;\n    };\n\n    async.cargo = function (worker, payload) {\n        var working     = false,\n            tasks       = [];\n\n        var cargo = {\n            tasks: tasks,\n            payload: payload,\n            saturated: null,\n            empty: null,\n            drain: null,\n            drained: true,\n            push: function (data, callback) {\n                if (!_isArray(data)) {\n                    data = [data];\n                }\n                _each(data, function(task) {\n                    tasks.push({\n                        data: task,\n                        callback: typeof callback === 'function' ? callback : null\n                    });\n                    cargo.drained = false;\n                    if (cargo.saturated && tasks.length === payload) {\n                        cargo.saturated();\n                    }\n                });\n                async.setImmediate(cargo.process);\n            },\n            process: function process() {\n                if (working) return;\n                if (tasks.length === 0) {\n                    if(cargo.drain && !cargo.drained) cargo.drain();\n                    cargo.drained = true;\n                    return;\n                }\n\n                var ts = typeof payload === 'number'\n                            ? tasks.splice(0, payload)\n                            : tasks.splice(0, tasks.length);\n\n                var ds = _map(ts, function (task) {\n                    return task.data;\n                });\n\n                if(cargo.empty) cargo.empty();\n                working = true;\n                worker(ds, function () {\n                    working = false;\n\n                    var args = arguments;\n                    _each(ts, function (data) {\n                        if (data.callback) {\n                            data.callback.apply(null, args);\n                        }\n                    });\n\n                    process();\n                });\n            },\n            length: function () {\n                return tasks.length;\n            },\n            running: function () {\n                return working;\n            }\n        };\n        return cargo;\n    };\n\n    var _console_fn = function (name) {\n        return function (fn) {\n            var args = Array.prototype.slice.call(arguments, 1);\n            fn.apply(null, args.concat([function (err) {\n                var args = Array.prototype.slice.call(arguments, 1);\n                if (typeof console !== 'undefined') {\n                    if (err) {\n                        if (console.error) {\n                            console.error(err);\n                        }\n                    }\n                    else if (console[name]) {\n                        _each(args, function (x) {\n                            console[name](x);\n                        });\n                    }\n                }\n            }]));\n        };\n    };\n    async.log = _console_fn('log');\n    async.dir = _console_fn('dir');\n    /*async.info = _console_fn('info');\n    async.warn = _console_fn('warn');\n    async.error = _console_fn('error');*/\n\n    async.memoize = function (fn, hasher) {\n        var memo = {};\n        var queues = {};\n        hasher = hasher || function (x) {\n            return x;\n        };\n        var memoized = function () {\n            var args = Array.prototype.slice.call(arguments);\n            var callback = args.pop();\n            var key = hasher.apply(null, args);\n            if (key in memo) {\n                async.nextTick(function () {\n                    callback.apply(null, memo[key]);\n                });\n            }\n            else if (key in queues) {\n                queues[key].push(callback);\n            }\n            else {\n                queues[key] = [callback];\n                fn.apply(null, args.concat([function () {\n                    memo[key] = arguments;\n                    var q = queues[key];\n                    delete queues[key];\n                    for (var i = 0, l = q.length; i < l; i++) {\n                      q[i].apply(null, arguments);\n                    }\n                }]));\n            }\n        };\n        memoized.memo = memo;\n        memoized.unmemoized = fn;\n        return memoized;\n    };\n\n    async.unmemoize = function (fn) {\n      return function () {\n        return (fn.unmemoized || fn).apply(null, arguments);\n      };\n    };\n\n    async.times = function (count, iterator, callback) {\n        var counter = [];\n        for (var i = 0; i < count; i++) {\n            counter.push(i);\n        }\n        return async.map(counter, iterator, callback);\n    };\n\n    async.timesSeries = function (count, iterator, callback) {\n        var counter = [];\n        for (var i = 0; i < count; i++) {\n            counter.push(i);\n        }\n        return async.mapSeries(counter, iterator, callback);\n    };\n\n    async.seq = function (/* functions... */) {\n        var fns = arguments;\n        return function () {\n            var that = this;\n            var args = Array.prototype.slice.call(arguments);\n            var callback = args.pop();\n            async.reduce(fns, args, function (newargs, fn, cb) {\n                fn.apply(that, newargs.concat([function () {\n                    var err = arguments[0];\n                    var nextargs = Array.prototype.slice.call(arguments, 1);\n                    cb(err, nextargs);\n                }]))\n            },\n            function (err, results) {\n                callback.apply(that, [err].concat(results));\n            });\n        };\n    };\n\n    async.compose = function (/* functions... */) {\n      return async.seq.apply(null, Array.prototype.reverse.call(arguments));\n    };\n\n    var _applyEach = function (eachfn, fns /*args...*/) {\n        var go = function () {\n            var that = this;\n            var args = Array.prototype.slice.call(arguments);\n            var callback = args.pop();\n            return eachfn(fns, function (fn, cb) {\n                fn.apply(that, args.concat([cb]));\n            },\n            callback);\n        };\n        if (arguments.length > 2) {\n            var args = Array.prototype.slice.call(arguments, 2);\n            return go.apply(this, args);\n        }\n        else {\n            return go;\n        }\n    };\n    async.applyEach = doParallel(_applyEach);\n    async.applyEachSeries = doSeries(_applyEach);\n\n    async.forever = function (fn, callback) {\n        function next(err) {\n            if (err) {\n                if (callback) {\n                    return callback(err);\n                }\n                throw err;\n            }\n            fn(next);\n        }\n        next();\n    };\n\n    // Node.js\n    if (typeof module !== 'undefined' && module.exports) {\n        module.exports = async;\n    }\n    // AMD / RequireJS\n    else if (typeof define !== 'undefined' && define.amd) {\n        define([], function () {\n            return async;\n        });\n    }\n    // included directly via <script> tag\n    else {\n        root.async = async;\n    }\n\n}());\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var S3Trinket, Storage, appendRecentImage, applyStylesheet, storage, template, trinket, view;\n\n  require(\"./duct_tape\");\n\n  applyStylesheet = require(\"util\").applyStylesheet;\n\n  applyStylesheet(require(\"./style\"));\n\n  S3Trinket = require(\"s3-trinket\");\n\n  Storage = require(\"storage\");\n\n  storage = Storage[\"new\"](\"sifter\");\n\n  trinket = S3Trinket(JSON.parse(localStorage.TRINKET_POLICY));\n\n  template = require(\"./templates/main\");\n\n  view = template({\n    url: function(key) {\n      var n;\n      n = parseInt(key.slice(-1), 0x10);\n      if (isNaN(n)) {\n        n = 0;\n      } else {\n        n = n % 4;\n      }\n      return \"http://t\" + n + \".pixiecdn.com/\" + key;\n    },\n    keys: storage.get(\"recentImages\") || []\n  });\n\n  document.body.appendChild(view);\n\n  appendRecentImage = function(key) {\n    var recentImages;\n    recentImages = storage.get(\"recentImages\") || [];\n    if (recentImages.indexOf(key) === -1) {\n      recentImages.push(key);\n    }\n    return storage.set(\"recentImages\", recentImages);\n  };\n\n  addEventListener(\"message\", function(event) {\n    var data, origin, source;\n    data = event.data, origin = event.origin, source = event.source;\n    if (data.key) {\n      appendRecentImage(data.key);\n    }\n    return source.postMessage({\n      data: data,\n      origin: origin\n    }, \"*\");\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html {\\n  height: 100%;\\n}\\n\\nbody {\\n  font-family: \\\"HelveticaNeue-Light\\\", \\\"Helvetica Neue Light\\\", \\\"Helvetica Neue\\\", Helvetica, Arial, \\\"Lucida Grande\\\", sans-serif;\\n  height: 100%;\\n  margin: 0;\\n  position: relative;\\n}\\n\\n.help {\\n  color: white;\\n  height: 100%;\\n  background-color: rgba(0, 0, 0, 0.875);\\n  padding: 1em;\\n  position: absolute;\\n  top: 100%;\\n  width: 100%;\\n  z-index: 9000;\\n  -ms-transition-duration: 0.3s;\\n  -moz-transition-duration: 0.3s;\\n  -webkit-transition-duration: 0.3s;\\n  transition-duration: 0.3s;\\n}\\n\\n.help.up {\\n  top: 0;\\n}\\n\\n.help .key {\\n  display: inline-block;\\n  font-weight: bold;\\n  padding-right: 20px;\\n  text-align: right;\\n  vertical-align: top;\\n  width: 160px;\\n}\\n\\n.help .command {\\n  display: inline-block;\\n}\";",
      "type": "blob"
    },
    "templates/main": {
      "path": "templates/main",
      "content": "Runtime = require(\"/_lib/hamljr_runtime\");\n\nmodule.exports = (function(data) {\n  return (function() {\n    var self, __runtime;\n    __runtime = Runtime(this);\n    __runtime.push(document.createDocumentFragment());\n    self = this;\n    __runtime.push(document.createElement(\"div\"));\n    __runtime.classes(\"images\");\n    __runtime.each(this.keys, function(key) {\n      var url;\n      url = self.url(key);\n      __runtime.push(document.createElement(\"img\"));\n      __runtime.attribute(\"src\", url);\n      return __runtime.pop();\n    });\n    __runtime.pop();\n    return __runtime.pop();\n  }).call(data);\n});\n",
      "type": "blob"
    },
    "duct_tape": {
      "path": "duct_tape",
      "content": "(function() {\n  global.Observable = require(\"observable\");\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"],\"dependencies\":{\"composition\":\"distri/compositions:v0.1.1\",\"jquery-hotkeys\":\"distri/jquery-hotkeys:v0.9.2\",\"observable\":\"distri/observable:v0.1.1\",\"s3-trinket\":\"distri/s3-trinket:v0.1.1\",\"storage\":\"distri/storage:v0.1.0\",\"util\":\"distri/util:v0.1.0\"}};",
      "type": "blob"
    },
    "lib/async": {
      "path": "lib/async",
      "content": "/*jshint onevar: false, indent:4 */\n/*global setImmediate: false, setTimeout: false, console: false */\n(function () {\n\n    var async = {};\n\n    // global on the server, window in the browser\n    var root, previous_async;\n\n    root = this;\n    if (root != null) {\n      previous_async = root.async;\n    }\n\n    async.noConflict = function () {\n        root.async = previous_async;\n        return async;\n    };\n\n    function only_once(fn) {\n        var called = false;\n        return function() {\n            if (called) throw new Error(\"Callback was already called.\");\n            called = true;\n            fn.apply(root, arguments);\n        }\n    }\n\n    //// cross-browser compatiblity functions ////\n\n    var _toString = Object.prototype.toString;\n\n    var _isArray = Array.isArray || function (obj) {\n        return _toString.call(obj) === '[object Array]';\n    };\n\n    var _each = function (arr, iterator) {\n        if (arr.forEach) {\n            return arr.forEach(iterator);\n        }\n        for (var i = 0; i < arr.length; i += 1) {\n            iterator(arr[i], i, arr);\n        }\n    };\n\n    var _map = function (arr, iterator) {\n        if (arr.map) {\n            return arr.map(iterator);\n        }\n        var results = [];\n        _each(arr, function (x, i, a) {\n            results.push(iterator(x, i, a));\n        });\n        return results;\n    };\n\n    var _reduce = function (arr, iterator, memo) {\n        if (arr.reduce) {\n            return arr.reduce(iterator, memo);\n        }\n        _each(arr, function (x, i, a) {\n            memo = iterator(memo, x, i, a);\n        });\n        return memo;\n    };\n\n    var _keys = function (obj) {\n        if (Object.keys) {\n            return Object.keys(obj);\n        }\n        var keys = [];\n        for (var k in obj) {\n            if (obj.hasOwnProperty(k)) {\n                keys.push(k);\n            }\n        }\n        return keys;\n    };\n\n    //// exported async module functions ////\n\n    //// nextTick implementation with browser-compatible fallback ////\n    if (typeof process === 'undefined' || !(process.nextTick)) {\n        if (typeof setImmediate === 'function') {\n            async.nextTick = function (fn) {\n                // not a direct alias for IE10 compatibility\n                setImmediate(fn);\n            };\n            async.setImmediate = async.nextTick;\n        }\n        else {\n            async.nextTick = function (fn) {\n                setTimeout(fn, 0);\n            };\n            async.setImmediate = async.nextTick;\n        }\n    }\n    else {\n        async.nextTick = process.nextTick;\n        if (typeof setImmediate !== 'undefined') {\n            async.setImmediate = function (fn) {\n              // not a direct alias for IE10 compatibility\n              setImmediate(fn);\n            };\n        }\n        else {\n            async.setImmediate = async.nextTick;\n        }\n    }\n\n    async.each = function (arr, iterator, callback) {\n        callback = callback || function () {};\n        if (!arr.length) {\n            return callback();\n        }\n        var completed = 0;\n        _each(arr, function (x) {\n            iterator(x, only_once(done) );\n        });\n        function done(err) {\n          if (err) {\n              callback(err);\n              callback = function () {};\n          }\n          else {\n              completed += 1;\n              if (completed >= arr.length) {\n                  callback();\n              }\n          }\n        }\n    };\n    async.forEach = async.each;\n\n    async.eachSeries = function (arr, iterator, callback) {\n        callback = callback || function () {};\n        if (!arr.length) {\n            return callback();\n        }\n        var completed = 0;\n        var iterate = function () {\n            iterator(arr[completed], function (err) {\n                if (err) {\n                    callback(err);\n                    callback = function () {};\n                }\n                else {\n                    completed += 1;\n                    if (completed >= arr.length) {\n                        callback();\n                    }\n                    else {\n                        iterate();\n                    }\n                }\n            });\n        };\n        iterate();\n    };\n    async.forEachSeries = async.eachSeries;\n\n    async.eachLimit = function (arr, limit, iterator, callback) {\n        var fn = _eachLimit(limit);\n        fn.apply(null, [arr, iterator, callback]);\n    };\n    async.forEachLimit = async.eachLimit;\n\n    var _eachLimit = function (limit) {\n\n        return function (arr, iterator, callback) {\n            callback = callback || function () {};\n            if (!arr.length || limit <= 0) {\n                return callback();\n            }\n            var completed = 0;\n            var started = 0;\n            var running = 0;\n\n            (function replenish () {\n                if (completed >= arr.length) {\n                    return callback();\n                }\n\n                while (running < limit && started < arr.length) {\n                    started += 1;\n                    running += 1;\n                    iterator(arr[started - 1], function (err) {\n                        if (err) {\n                            callback(err);\n                            callback = function () {};\n                        }\n                        else {\n                            completed += 1;\n                            running -= 1;\n                            if (completed >= arr.length) {\n                                callback();\n                            }\n                            else {\n                                replenish();\n                            }\n                        }\n                    });\n                }\n            })();\n        };\n    };\n\n\n    var doParallel = function (fn) {\n        return function () {\n            var args = Array.prototype.slice.call(arguments);\n            return fn.apply(null, [async.each].concat(args));\n        };\n    };\n    var doParallelLimit = function(limit, fn) {\n        return function () {\n            var args = Array.prototype.slice.call(arguments);\n            return fn.apply(null, [_eachLimit(limit)].concat(args));\n        };\n    };\n    var doSeries = function (fn) {\n        return function () {\n            var args = Array.prototype.slice.call(arguments);\n            return fn.apply(null, [async.eachSeries].concat(args));\n        };\n    };\n\n\n    var _asyncMap = function (eachfn, arr, iterator, callback) {\n        var results = [];\n        arr = _map(arr, function (x, i) {\n            return {index: i, value: x};\n        });\n        eachfn(arr, function (x, callback) {\n            iterator(x.value, function (err, v) {\n                results[x.index] = v;\n                callback(err);\n            });\n        }, function (err) {\n            callback(err, results);\n        });\n    };\n    async.map = doParallel(_asyncMap);\n    async.mapSeries = doSeries(_asyncMap);\n    async.mapLimit = function (arr, limit, iterator, callback) {\n        return _mapLimit(limit)(arr, iterator, callback);\n    };\n\n    var _mapLimit = function(limit) {\n        return doParallelLimit(limit, _asyncMap);\n    };\n\n    // reduce only has a series version, as doing reduce in parallel won't\n    // work in many situations.\n    async.reduce = function (arr, memo, iterator, callback) {\n        async.eachSeries(arr, function (x, callback) {\n            iterator(memo, x, function (err, v) {\n                memo = v;\n                callback(err);\n            });\n        }, function (err) {\n            callback(err, memo);\n        });\n    };\n    // inject alias\n    async.inject = async.reduce;\n    // foldl alias\n    async.foldl = async.reduce;\n\n    async.reduceRight = function (arr, memo, iterator, callback) {\n        var reversed = _map(arr, function (x) {\n            return x;\n        }).reverse();\n        async.reduce(reversed, memo, iterator, callback);\n    };\n    // foldr alias\n    async.foldr = async.reduceRight;\n\n    var _filter = function (eachfn, arr, iterator, callback) {\n        var results = [];\n        arr = _map(arr, function (x, i) {\n            return {index: i, value: x};\n        });\n        eachfn(arr, function (x, callback) {\n            iterator(x.value, function (v) {\n                if (v) {\n                    results.push(x);\n                }\n                callback();\n            });\n        }, function (err) {\n            callback(_map(results.sort(function (a, b) {\n                return a.index - b.index;\n            }), function (x) {\n                return x.value;\n            }));\n        });\n    };\n    async.filter = doParallel(_filter);\n    async.filterSeries = doSeries(_filter);\n    // select alias\n    async.select = async.filter;\n    async.selectSeries = async.filterSeries;\n\n    var _reject = function (eachfn, arr, iterator, callback) {\n        var results = [];\n        arr = _map(arr, function (x, i) {\n            return {index: i, value: x};\n        });\n        eachfn(arr, function (x, callback) {\n            iterator(x.value, function (v) {\n                if (!v) {\n                    results.push(x);\n                }\n                callback();\n            });\n        }, function (err) {\n            callback(_map(results.sort(function (a, b) {\n                return a.index - b.index;\n            }), function (x) {\n                return x.value;\n            }));\n        });\n    };\n    async.reject = doParallel(_reject);\n    async.rejectSeries = doSeries(_reject);\n\n    var _detect = function (eachfn, arr, iterator, main_callback) {\n        eachfn(arr, function (x, callback) {\n            iterator(x, function (result) {\n                if (result) {\n                    main_callback(x);\n                    main_callback = function () {};\n                }\n                else {\n                    callback();\n                }\n            });\n        }, function (err) {\n            main_callback();\n        });\n    };\n    async.detect = doParallel(_detect);\n    async.detectSeries = doSeries(_detect);\n\n    async.some = function (arr, iterator, main_callback) {\n        async.each(arr, function (x, callback) {\n            iterator(x, function (v) {\n                if (v) {\n                    main_callback(true);\n                    main_callback = function () {};\n                }\n                callback();\n            });\n        }, function (err) {\n            main_callback(false);\n        });\n    };\n    // any alias\n    async.any = async.some;\n\n    async.every = function (arr, iterator, main_callback) {\n        async.each(arr, function (x, callback) {\n            iterator(x, function (v) {\n                if (!v) {\n                    main_callback(false);\n                    main_callback = function () {};\n                }\n                callback();\n            });\n        }, function (err) {\n            main_callback(true);\n        });\n    };\n    // all alias\n    async.all = async.every;\n\n    async.sortBy = function (arr, iterator, callback) {\n        async.map(arr, function (x, callback) {\n            iterator(x, function (err, criteria) {\n                if (err) {\n                    callback(err);\n                }\n                else {\n                    callback(null, {value: x, criteria: criteria});\n                }\n            });\n        }, function (err, results) {\n            if (err) {\n                return callback(err);\n            }\n            else {\n                var fn = function (left, right) {\n                    var a = left.criteria, b = right.criteria;\n                    return a < b ? -1 : a > b ? 1 : 0;\n                };\n                callback(null, _map(results.sort(fn), function (x) {\n                    return x.value;\n                }));\n            }\n        });\n    };\n\n    async.auto = function (tasks, callback) {\n        callback = callback || function () {};\n        var keys = _keys(tasks);\n        var remainingTasks = keys.length\n        if (!remainingTasks) {\n            return callback();\n        }\n\n        var results = {};\n\n        var listeners = [];\n        var addListener = function (fn) {\n            listeners.unshift(fn);\n        };\n        var removeListener = function (fn) {\n            for (var i = 0; i < listeners.length; i += 1) {\n                if (listeners[i] === fn) {\n                    listeners.splice(i, 1);\n                    return;\n                }\n            }\n        };\n        var taskComplete = function () {\n            remainingTasks--\n            _each(listeners.slice(0), function (fn) {\n                fn();\n            });\n        };\n\n        addListener(function () {\n            if (!remainingTasks) {\n                var theCallback = callback;\n                // prevent final callback from calling itself if it errors\n                callback = function () {};\n\n                theCallback(null, results);\n            }\n        });\n\n        _each(keys, function (k) {\n            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];\n            var taskCallback = function (err) {\n                var args = Array.prototype.slice.call(arguments, 1);\n                if (args.length <= 1) {\n                    args = args[0];\n                }\n                if (err) {\n                    var safeResults = {};\n                    _each(_keys(results), function(rkey) {\n                        safeResults[rkey] = results[rkey];\n                    });\n                    safeResults[k] = args;\n                    callback(err, safeResults);\n                    // stop subsequent errors hitting callback multiple times\n                    callback = function () {};\n                }\n                else {\n                    results[k] = args;\n                    async.setImmediate(taskComplete);\n                }\n            };\n            var requires = task.slice(0, Math.abs(task.length - 1)) || [];\n            var ready = function () {\n                return _reduce(requires, function (a, x) {\n                    return (a && results.hasOwnProperty(x));\n                }, true) && !results.hasOwnProperty(k);\n            };\n            if (ready()) {\n                task[task.length - 1](taskCallback, results);\n            }\n            else {\n                var listener = function () {\n                    if (ready()) {\n                        removeListener(listener);\n                        task[task.length - 1](taskCallback, results);\n                    }\n                };\n                addListener(listener);\n            }\n        });\n    };\n\n    async.retry = function(times, task, callback) {\n        var DEFAULT_TIMES = 5;\n        var attempts = [];\n        // Use defaults if times not passed\n        if (typeof times === 'function') {\n            callback = task;\n            task = times;\n            times = DEFAULT_TIMES;\n        }\n        // Make sure times is a number\n        times = parseInt(times, 10) || DEFAULT_TIMES;\n        var wrappedTask = function(wrappedCallback, wrappedResults) {\n            var retryAttempt = function(task, finalAttempt) {\n                return function(seriesCallback) {\n                    task(function(err, result){\n                        seriesCallback(!err || finalAttempt, {err: err, result: result});\n                    }, wrappedResults);\n                };\n            };\n            while (times) {\n                attempts.push(retryAttempt(task, !(times-=1)));\n            }\n            async.series(attempts, function(done, data){\n                data = data[data.length - 1];\n                (wrappedCallback || callback)(data.err, data.result);\n            });\n        }\n        // If a callback is passed, run this as a controll flow\n        return callback ? wrappedTask() : wrappedTask\n    };\n\n    async.waterfall = function (tasks, callback) {\n        callback = callback || function () {};\n        if (!_isArray(tasks)) {\n          var err = new Error('First argument to waterfall must be an array of functions');\n          return callback(err);\n        }\n        if (!tasks.length) {\n            return callback();\n        }\n        var wrapIterator = function (iterator) {\n            return function (err) {\n                if (err) {\n                    callback.apply(null, arguments);\n                    callback = function () {};\n                }\n                else {\n                    var args = Array.prototype.slice.call(arguments, 1);\n                    var next = iterator.next();\n                    if (next) {\n                        args.push(wrapIterator(next));\n                    }\n                    else {\n                        args.push(callback);\n                    }\n                    async.setImmediate(function () {\n                        iterator.apply(null, args);\n                    });\n                }\n            };\n        };\n        wrapIterator(async.iterator(tasks))();\n    };\n\n    var _parallel = function(eachfn, tasks, callback) {\n        callback = callback || function () {};\n        if (_isArray(tasks)) {\n            eachfn.map(tasks, function (fn, callback) {\n                if (fn) {\n                    fn(function (err) {\n                        var args = Array.prototype.slice.call(arguments, 1);\n                        if (args.length <= 1) {\n                            args = args[0];\n                        }\n                        callback.call(null, err, args);\n                    });\n                }\n            }, callback);\n        }\n        else {\n            var results = {};\n            eachfn.each(_keys(tasks), function (k, callback) {\n                tasks[k](function (err) {\n                    var args = Array.prototype.slice.call(arguments, 1);\n                    if (args.length <= 1) {\n                        args = args[0];\n                    }\n                    results[k] = args;\n                    callback(err);\n                });\n            }, function (err) {\n                callback(err, results);\n            });\n        }\n    };\n\n    async.parallel = function (tasks, callback) {\n        _parallel({ map: async.map, each: async.each }, tasks, callback);\n    };\n\n    async.parallelLimit = function(tasks, limit, callback) {\n        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);\n    };\n\n    async.series = function (tasks, callback) {\n        callback = callback || function () {};\n        if (_isArray(tasks)) {\n            async.mapSeries(tasks, function (fn, callback) {\n                if (fn) {\n                    fn(function (err) {\n                        var args = Array.prototype.slice.call(arguments, 1);\n                        if (args.length <= 1) {\n                            args = args[0];\n                        }\n                        callback.call(null, err, args);\n                    });\n                }\n            }, callback);\n        }\n        else {\n            var results = {};\n            async.eachSeries(_keys(tasks), function (k, callback) {\n                tasks[k](function (err) {\n                    var args = Array.prototype.slice.call(arguments, 1);\n                    if (args.length <= 1) {\n                        args = args[0];\n                    }\n                    results[k] = args;\n                    callback(err);\n                });\n            }, function (err) {\n                callback(err, results);\n            });\n        }\n    };\n\n    async.iterator = function (tasks) {\n        var makeCallback = function (index) {\n            var fn = function () {\n                if (tasks.length) {\n                    tasks[index].apply(null, arguments);\n                }\n                return fn.next();\n            };\n            fn.next = function () {\n                return (index < tasks.length - 1) ? makeCallback(index + 1): null;\n            };\n            return fn;\n        };\n        return makeCallback(0);\n    };\n\n    async.apply = function (fn) {\n        var args = Array.prototype.slice.call(arguments, 1);\n        return function () {\n            return fn.apply(\n                null, args.concat(Array.prototype.slice.call(arguments))\n            );\n        };\n    };\n\n    var _concat = function (eachfn, arr, fn, callback) {\n        var r = [];\n        eachfn(arr, function (x, cb) {\n            fn(x, function (err, y) {\n                r = r.concat(y || []);\n                cb(err);\n            });\n        }, function (err) {\n            callback(err, r);\n        });\n    };\n    async.concat = doParallel(_concat);\n    async.concatSeries = doSeries(_concat);\n\n    async.whilst = function (test, iterator, callback) {\n        if (test()) {\n            iterator(function (err) {\n                if (err) {\n                    return callback(err);\n                }\n                async.whilst(test, iterator, callback);\n            });\n        }\n        else {\n            callback();\n        }\n    };\n\n    async.doWhilst = function (iterator, test, callback) {\n        iterator(function (err) {\n            if (err) {\n                return callback(err);\n            }\n            var args = Array.prototype.slice.call(arguments, 1);\n            if (test.apply(null, args)) {\n                async.doWhilst(iterator, test, callback);\n            }\n            else {\n                callback();\n            }\n        });\n    };\n\n    async.until = function (test, iterator, callback) {\n        if (!test()) {\n            iterator(function (err) {\n                if (err) {\n                    return callback(err);\n                }\n                async.until(test, iterator, callback);\n            });\n        }\n        else {\n            callback();\n        }\n    };\n\n    async.doUntil = function (iterator, test, callback) {\n        iterator(function (err) {\n            if (err) {\n                return callback(err);\n            }\n            var args = Array.prototype.slice.call(arguments, 1);\n            if (!test.apply(null, args)) {\n                async.doUntil(iterator, test, callback);\n            }\n            else {\n                callback();\n            }\n        });\n    };\n\n    async.queue = function (worker, concurrency) {\n        if (concurrency === undefined) {\n            concurrency = 1;\n        }\n        function _insert(q, data, pos, callback) {\n          if (!q.started){\n            q.started = true;\n          }\n          if (!_isArray(data)) {\n              data = [data];\n          }\n          if(data.length == 0) {\n             // call drain immediately if there are no tasks\n             return async.setImmediate(function() {\n                 if (q.drain) {\n                     q.drain();\n                 }\n             });\n          }\n          _each(data, function(task) {\n              var item = {\n                  data: task,\n                  callback: typeof callback === 'function' ? callback : null\n              };\n\n              if (pos) {\n                q.tasks.unshift(item);\n              } else {\n                q.tasks.push(item);\n              }\n\n              if (q.saturated && q.tasks.length === q.concurrency) {\n                  q.saturated();\n              }\n              async.setImmediate(q.process);\n          });\n        }\n\n        var workers = 0;\n        var q = {\n            tasks: [],\n            concurrency: concurrency,\n            saturated: null,\n            empty: null,\n            drain: null,\n            started: false,\n            paused: false,\n            push: function (data, callback) {\n              _insert(q, data, false, callback);\n            },\n            kill: function () {\n              q.drain = null;\n              q.tasks = [];\n            },\n            unshift: function (data, callback) {\n              _insert(q, data, true, callback);\n            },\n            process: function () {\n                if (!q.paused && workers < q.concurrency && q.tasks.length) {\n                    var task = q.tasks.shift();\n                    if (q.empty && q.tasks.length === 0) {\n                        q.empty();\n                    }\n                    workers += 1;\n                    var next = function () {\n                        workers -= 1;\n                        if (task.callback) {\n                            task.callback.apply(task, arguments);\n                        }\n                        if (q.drain && q.tasks.length + workers === 0) {\n                            q.drain();\n                        }\n                        q.process();\n                    };\n                    var cb = only_once(next);\n                    worker(task.data, cb);\n                }\n            },\n            length: function () {\n                return q.tasks.length;\n            },\n            running: function () {\n                return workers;\n            },\n            idle: function() {\n                return q.tasks.length + workers === 0;\n            },\n            pause: function () {\n                if (q.paused === true) { return; }\n                q.paused = true;\n                q.process();\n            },\n            resume: function () {\n                if (q.paused === false) { return; }\n                q.paused = false;\n                q.process();\n            }\n        };\n        return q;\n    };\n\n    async.cargo = function (worker, payload) {\n        var working     = false,\n            tasks       = [];\n\n        var cargo = {\n            tasks: tasks,\n            payload: payload,\n            saturated: null,\n            empty: null,\n            drain: null,\n            drained: true,\n            push: function (data, callback) {\n                if (!_isArray(data)) {\n                    data = [data];\n                }\n                _each(data, function(task) {\n                    tasks.push({\n                        data: task,\n                        callback: typeof callback === 'function' ? callback : null\n                    });\n                    cargo.drained = false;\n                    if (cargo.saturated && tasks.length === payload) {\n                        cargo.saturated();\n                    }\n                });\n                async.setImmediate(cargo.process);\n            },\n            process: function process() {\n                if (working) return;\n                if (tasks.length === 0) {\n                    if(cargo.drain && !cargo.drained) cargo.drain();\n                    cargo.drained = true;\n                    return;\n                }\n\n                var ts = typeof payload === 'number'\n                            ? tasks.splice(0, payload)\n                            : tasks.splice(0, tasks.length);\n\n                var ds = _map(ts, function (task) {\n                    return task.data;\n                });\n\n                if(cargo.empty) cargo.empty();\n                working = true;\n                worker(ds, function () {\n                    working = false;\n\n                    var args = arguments;\n                    _each(ts, function (data) {\n                        if (data.callback) {\n                            data.callback.apply(null, args);\n                        }\n                    });\n\n                    process();\n                });\n            },\n            length: function () {\n                return tasks.length;\n            },\n            running: function () {\n                return working;\n            }\n        };\n        return cargo;\n    };\n\n    var _console_fn = function (name) {\n        return function (fn) {\n            var args = Array.prototype.slice.call(arguments, 1);\n            fn.apply(null, args.concat([function (err) {\n                var args = Array.prototype.slice.call(arguments, 1);\n                if (typeof console !== 'undefined') {\n                    if (err) {\n                        if (console.error) {\n                            console.error(err);\n                        }\n                    }\n                    else if (console[name]) {\n                        _each(args, function (x) {\n                            console[name](x);\n                        });\n                    }\n                }\n            }]));\n        };\n    };\n    async.log = _console_fn('log');\n    async.dir = _console_fn('dir');\n    /*async.info = _console_fn('info');\n    async.warn = _console_fn('warn');\n    async.error = _console_fn('error');*/\n\n    async.memoize = function (fn, hasher) {\n        var memo = {};\n        var queues = {};\n        hasher = hasher || function (x) {\n            return x;\n        };\n        var memoized = function () {\n            var args = Array.prototype.slice.call(arguments);\n            var callback = args.pop();\n            var key = hasher.apply(null, args);\n            if (key in memo) {\n                async.nextTick(function () {\n                    callback.apply(null, memo[key]);\n                });\n            }\n            else if (key in queues) {\n                queues[key].push(callback);\n            }\n            else {\n                queues[key] = [callback];\n                fn.apply(null, args.concat([function () {\n                    memo[key] = arguments;\n                    var q = queues[key];\n                    delete queues[key];\n                    for (var i = 0, l = q.length; i < l; i++) {\n                      q[i].apply(null, arguments);\n                    }\n                }]));\n            }\n        };\n        memoized.memo = memo;\n        memoized.unmemoized = fn;\n        return memoized;\n    };\n\n    async.unmemoize = function (fn) {\n      return function () {\n        return (fn.unmemoized || fn).apply(null, arguments);\n      };\n    };\n\n    async.times = function (count, iterator, callback) {\n        var counter = [];\n        for (var i = 0; i < count; i++) {\n            counter.push(i);\n        }\n        return async.map(counter, iterator, callback);\n    };\n\n    async.timesSeries = function (count, iterator, callback) {\n        var counter = [];\n        for (var i = 0; i < count; i++) {\n            counter.push(i);\n        }\n        return async.mapSeries(counter, iterator, callback);\n    };\n\n    async.seq = function (/* functions... */) {\n        var fns = arguments;\n        return function () {\n            var that = this;\n            var args = Array.prototype.slice.call(arguments);\n            var callback = args.pop();\n            async.reduce(fns, args, function (newargs, fn, cb) {\n                fn.apply(that, newargs.concat([function () {\n                    var err = arguments[0];\n                    var nextargs = Array.prototype.slice.call(arguments, 1);\n                    cb(err, nextargs);\n                }]))\n            },\n            function (err, results) {\n                callback.apply(that, [err].concat(results));\n            });\n        };\n    };\n\n    async.compose = function (/* functions... */) {\n      return async.seq.apply(null, Array.prototype.reverse.call(arguments));\n    };\n\n    var _applyEach = function (eachfn, fns /*args...*/) {\n        var go = function () {\n            var that = this;\n            var args = Array.prototype.slice.call(arguments);\n            var callback = args.pop();\n            return eachfn(fns, function (fn, cb) {\n                fn.apply(that, args.concat([cb]));\n            },\n            callback);\n        };\n        if (arguments.length > 2) {\n            var args = Array.prototype.slice.call(arguments, 2);\n            return go.apply(this, args);\n        }\n        else {\n            return go;\n        }\n    };\n    async.applyEach = doParallel(_applyEach);\n    async.applyEachSeries = doSeries(_applyEach);\n\n    async.forever = function (fn, callback) {\n        function next(err) {\n            if (err) {\n                if (callback) {\n                    return callback(err);\n                }\n                throw err;\n            }\n            fn(next);\n        }\n        next();\n    };\n\n    // Node.js\n    if (typeof module !== 'undefined' && module.exports) {\n        module.exports = async;\n    }\n    // AMD / RequireJS\n    else if (typeof define !== 'undefined' && define.amd) {\n        define([], function () {\n            return async;\n        });\n    }\n    // included directly via <script> tag\n    else {\n        root.async = async;\n    }\n\n}());\n",
      "type": "blob"
    },
    "_lib/hamljr_runtime": {
      "path": "_lib/hamljr_runtime",
      "content": "(function() {\n  var Runtime, dataName, document,\n    __slice = [].slice;\n\n  dataName = \"__hamlJR_data\";\n\n  if (typeof window !== \"undefined\" && window !== null) {\n    document = window.document;\n  } else {\n    document = global.document;\n  }\n\n  Runtime = function(context) {\n    var append, bindObservable, classes, id, lastParent, observeAttribute, observeText, pop, push, render, self, stack, top;\n    stack = [];\n    lastParent = function() {\n      var element, i;\n      i = stack.length - 1;\n      while ((element = stack[i]) && element.nodeType === 11) {\n        i -= 1;\n      }\n      return element;\n    };\n    top = function() {\n      return stack[stack.length - 1];\n    };\n    append = function(child) {\n      var _ref;\n      if ((_ref = top()) != null) {\n        _ref.appendChild(child);\n      }\n      return child;\n    };\n    push = function(child) {\n      return stack.push(child);\n    };\n    pop = function() {\n      return append(stack.pop());\n    };\n    render = function(child) {\n      push(child);\n      return pop();\n    };\n    bindObservable = function(element, value, update) {\n      var observable, observe, unobserve;\n      if (typeof Observable === \"undefined\" || Observable === null) {\n        update(value);\n        return;\n      }\n      observable = Observable(value);\n      observe = function() {\n        observable.observe(update);\n        return update(observable());\n      };\n      unobserve = function() {\n        return observable.stopObserving(update);\n      };\n      element.addEventListener(\"DOMNodeInserted\", observe, true);\n      element.addEventListener(\"DOMNodeRemoved\", unobserve, true);\n      return element;\n    };\n    id = function() {\n      var element, sources, update, value;\n      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      element = top();\n      update = function(newValue) {\n        if (typeof newValue === \"function\") {\n          newValue = newValue();\n        }\n        return element.id = newValue;\n      };\n      value = function() {\n        var possibleValues;\n        possibleValues = sources.map(function(source) {\n          if (typeof source === \"function\") {\n            return source();\n          } else {\n            return source;\n          }\n        }).filter(function(idValue) {\n          return idValue != null;\n        });\n        return possibleValues[possibleValues.length - 1];\n      };\n      return bindObservable(element, value, update);\n    };\n    classes = function() {\n      var element, sources, update, value;\n      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      element = top();\n      update = function(newValue) {\n        if (typeof newValue === \"function\") {\n          newValue = newValue();\n        }\n        return element.className = newValue;\n      };\n      value = function() {\n        var possibleValues;\n        possibleValues = sources.map(function(source) {\n          if (typeof source === \"function\") {\n            return source();\n          } else {\n            return source;\n          }\n        }).filter(function(sourceValue) {\n          return sourceValue != null;\n        });\n        return possibleValues.join(\" \");\n      };\n      return bindObservable(element, value, update);\n    };\n    observeAttribute = function(name, value) {\n      var element, update;\n      element = top();\n      if ((name === \"value\") && (typeof value === \"function\")) {\n        element.value = value();\n        element.onchange = function() {\n          return value(element.value);\n        };\n        if (value.observe) {\n          value.observe(function(newValue) {\n            return element.value = newValue;\n          });\n        }\n      } else {\n        update = function(newValue) {\n          return element.setAttribute(name, newValue);\n        };\n        bindObservable(element, value, update);\n      }\n      return element;\n    };\n    observeText = function(value) {\n      var element, update;\n      switch (value != null ? value.nodeType : void 0) {\n        case 1:\n        case 3:\n        case 11:\n          render(value);\n          return;\n      }\n      element = document.createTextNode('');\n      update = function(newValue) {\n        return element.nodeValue = newValue;\n      };\n      bindObservable(element, value, update);\n      return render(element);\n    };\n    self = {\n      push: push,\n      pop: pop,\n      id: id,\n      classes: classes,\n      attribute: observeAttribute,\n      text: observeText,\n      filter: function(name, content) {},\n      each: function(items, fn) {\n        var elements, parent, replace;\n        items = Observable(items);\n        elements = [];\n        parent = lastParent();\n        items.observe(function(newItems) {\n          return replace(elements, newItems);\n        });\n        replace = function(oldElements, items) {\n          var firstElement;\n          if (oldElements) {\n            firstElement = oldElements[0];\n            parent = (firstElement != null ? firstElement.parentElement : void 0) || parent;\n            elements = items.map(function(item, index, array) {\n              var element;\n              element = fn.call(item, item, index, array);\n              element[dataName] = item;\n              parent.insertBefore(element, firstElement);\n              return element;\n            });\n            return oldElements.forEach(function(element) {\n              return element.remove();\n            });\n          } else {\n            return elements = items.map(function(item, index, array) {\n              var element;\n              element = fn.call(item, item, index, array);\n              element[dataName] = item;\n              return element;\n            });\n          }\n        };\n        return replace(null, items);\n      },\n      \"with\": function(item, fn) {\n        var element, replace, value;\n        element = null;\n        item = Observable(item);\n        item.observe(function(newValue) {\n          return replace(element, newValue);\n        });\n        value = item();\n        replace = function(oldElement, value) {\n          var parent;\n          element = fn.call(value);\n          element[dataName] = item;\n          if (oldElement) {\n            parent = oldElement.parentElement;\n            parent.insertBefore(element, oldElement);\n            return oldElement.remove();\n          } else {\n\n          }\n        };\n        return replace(element, value);\n      },\n      on: function(eventName, fn) {\n        var element;\n        element = lastParent();\n        if (eventName === \"change\") {\n          switch (element.nodeName) {\n            case \"SELECT\":\n              element[\"on\" + eventName] = function() {\n                var selectedOption;\n                selectedOption = this.options[this.selectedIndex];\n                return fn(selectedOption[dataName]);\n              };\n              if (fn.observe) {\n                return fn.observe(function(newValue) {\n                  return Array.prototype.forEach.call(element.options, function(option, index) {\n                    if (option[dataName] === newValue) {\n                      return element.selectedIndex = index;\n                    }\n                  });\n                });\n              }\n              break;\n            default:\n              element[\"on\" + eventName] = function() {\n                return fn(element.value);\n              };\n              if (fn.observe) {\n                return fn.observe(function(newValue) {\n                  return element.value = newValue;\n                });\n              }\n          }\n        } else {\n          return element[\"on\" + eventName] = function(event) {\n            return fn.call(context, event);\n          };\n        }\n      }\n    };\n    return self;\n  };\n\n  module.exports = Runtime;\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "remoteDependencies": [
    "https://code.jquery.com/jquery-1.11.0.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/sifter",
    "homepage": null,
    "description": "Sift through images and junx.",
    "html_url": "https://github.com/distri/sifter",
    "url": "https://api.github.com/repos/distri/sifter",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "composition": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.coffee.md": {
          "path": "README.coffee.md",
          "mode": "100644",
          "content": "Compositions\n============\n\nThe `compositions` module provides helper methods to compose nested data models.\n\nCompositions uses [Observable](/observable/docs) to keep the internal data in sync.\n\n    Core = require \"core\"\n    Observable = require \"observable\"\n\n    module.exports = (I={}, self=Core(I)) ->\n\n      self.extend\n\nObserve any number of attributes as simple observables. For each attribute name passed in we expose a public getter/setter method and listen to changes when the value is set.\n\n        attrObservable: (names...) ->\n          names.forEach (name) ->\n            self[name] = Observable(I[name])\n\n            self[name].observe (newValue) ->\n              I[name] = newValue\n\n          return self\n\nObserve an attribute as a model. Treats the attribute given as an Observable\nmodel instance exposting a getter/setter method of the same name. The Model\nconstructor must be passed in explicitly.\n\n        attrModel: (name, Model) ->\n          model = Model(I[name])\n\n          self[name] = Observable(model)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.I\n\n          return self\n\nObserve an attribute as a list of sub-models. This is the same as `attrModel`\nexcept the attribute is expected to be an array of models rather than a single one.\n\n        attrModels: (name, Model) ->\n          models = (I[name] or []).map (x) ->\n            Model(x)\n\n          self[name] = Observable(models)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.map (instance) ->\n              instance.I\n\n          return self\n\nThe JSON representation is kept up to date via the observable properites and resides in `I`.\n\n        toJSON: ->\n          I\n\nReturn our public object.\n\n      return self\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "entryPoint: \"README\"\nversion: \"0.1.1\"\ndependencies:\n  core: \"distri/core:v0.6.0\"\n  observable: \"distri/observable:v0.1.1\"\n",
          "type": "blob"
        },
        "test/compositions.coffee": {
          "path": "test/compositions.coffee",
          "mode": "100644",
          "content": "\nModel = require \"../README\"\n\ndescribe 'Model', ->\n  # Association Testing model\n  Person = (I) ->\n    person = Model(I)\n\n    person.attrAccessor(\n      'firstName'\n      'lastName'\n      'suffix'\n    )\n\n    person.fullName = ->\n      \"#{@firstName()} #{@lastName()} #{@suffix()}\"\n\n    return person\n\n  describe \"#attrObservable\", ->\n    it 'should allow for observing of attributes', ->\n      model = Model\n        name: \"Duder\"\n\n      model.attrObservable \"name\"\n\n      model.name(\"Dudeman\")\n\n      assert.equal model.name(), \"Dudeman\"\n\n    it 'should bind properties to observable attributes', ->\n      model = Model\n        name: \"Duder\"\n\n      model.attrObservable \"name\"\n\n      model.name(\"Dudeman\")\n\n      assert.equal model.name(), \"Dudeman\"\n      assert.equal model.name(), model.I.name\n\n  describe \"#attrModel\", ->\n    it \"should be a model instance\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      assert.equal model.person().fullName(), \"Duder Mannington Jr.\"\n\n    it \"should allow setting the associated model\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      otherPerson = Person\n        firstName: \"Mr.\"\n        lastName: \"Man\"\n\n      model.person(otherPerson)\n\n      assert.equal model.person().firstName(), \"Mr.\"\n\n    it \"shouldn't update the instance properties after it's been replaced\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      duder = model.person()\n\n      otherPerson = Person\n        firstName: \"Mr.\"\n        lastName: \"Man\"\n\n      model.person(otherPerson)\n\n      duder.firstName(\"Joe\")\n\n      assert.equal duder.I.firstName, \"Joe\"\n      assert.equal model.I.person.firstName, \"Mr.\"\n\n  describe \"#attrModels\", ->\n    it \"should have an array of model instances\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      assert.equal model.people()[0].fullName(), \"Duder Mannington Jr.\"\n\n    it \"should track pushes\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      model.people.push Person\n        firstName: \"JoJo\"\n        lastName: \"Loco\"\n\n      assert.equal model.people().length, 3\n      assert.equal model.I.people.length, 3\n\n    it \"should track pops\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      model.people.pop()\n\n      assert.equal model.people().length, 1\n      assert.equal model.I.people.length, 1\n\n  describe \"#toJSON\", ->\n    it \"should return an object appropriate for JSON serialization\", ->\n      model = Model\n        test: true\n\n      assert model.toJSON().test\n\n  describe \"#observeAll\", ->\n    it \"should observe all attributes of a simple model\"\n    ->  # TODO\n      model = Model\n        test: true\n        yolo: \"4life\"\n\n      model.observeAll()\n\n      assert model.test()\n      assert.equal model.yolo(), \"4life\"\n\n    it \"should camel case underscored names\"",
          "type": "blob"
        }
      },
      "distribution": {
        "README": {
          "path": "README",
          "content": "(function() {\n  var Core, Observable,\n    __slice = [].slice;\n\n  Core = require(\"core\");\n\n  Observable = require(\"observable\");\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    self.extend({\n      attrObservable: function() {\n        var names;\n        names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        names.forEach(function(name) {\n          self[name] = Observable(I[name]);\n          return self[name].observe(function(newValue) {\n            return I[name] = newValue;\n          });\n        });\n        return self;\n      },\n      attrModel: function(name, Model) {\n        var model;\n        model = Model(I[name]);\n        self[name] = Observable(model);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.I;\n        });\n        return self;\n      },\n      attrModels: function(name, Model) {\n        var models;\n        models = (I[name] || []).map(function(x) {\n          return Model(x);\n        });\n        self[name] = Observable(models);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.map(function(instance) {\n            return instance.I;\n          });\n        });\n        return self;\n      },\n      toJSON: function() {\n        return I;\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"entryPoint\":\"README\",\"version\":\"0.1.1\",\"dependencies\":{\"core\":\"distri/core:v0.6.0\",\"observable\":\"distri/observable:v0.1.1\"}};",
          "type": "blob"
        },
        "test/compositions": {
          "path": "test/compositions",
          "content": "(function() {\n  var Model;\n\n  Model = require(\"../README\");\n\n  describe('Model', function() {\n    var Person;\n    Person = function(I) {\n      var person;\n      person = Model(I);\n      person.attrAccessor('firstName', 'lastName', 'suffix');\n      person.fullName = function() {\n        return \"\" + (this.firstName()) + \" \" + (this.lastName()) + \" \" + (this.suffix());\n      };\n      return person;\n    };\n    describe(\"#attrObservable\", function() {\n      it('should allow for observing of attributes', function() {\n        var model;\n        model = Model({\n          name: \"Duder\"\n        });\n        model.attrObservable(\"name\");\n        model.name(\"Dudeman\");\n        return assert.equal(model.name(), \"Dudeman\");\n      });\n      return it('should bind properties to observable attributes', function() {\n        var model;\n        model = Model({\n          name: \"Duder\"\n        });\n        model.attrObservable(\"name\");\n        model.name(\"Dudeman\");\n        assert.equal(model.name(), \"Dudeman\");\n        return assert.equal(model.name(), model.I.name);\n      });\n    });\n    describe(\"#attrModel\", function() {\n      it(\"should be a model instance\", function() {\n        var model;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        return assert.equal(model.person().fullName(), \"Duder Mannington Jr.\");\n      });\n      it(\"should allow setting the associated model\", function() {\n        var model, otherPerson;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        otherPerson = Person({\n          firstName: \"Mr.\",\n          lastName: \"Man\"\n        });\n        model.person(otherPerson);\n        return assert.equal(model.person().firstName(), \"Mr.\");\n      });\n      return it(\"shouldn't update the instance properties after it's been replaced\", function() {\n        var duder, model, otherPerson;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        duder = model.person();\n        otherPerson = Person({\n          firstName: \"Mr.\",\n          lastName: \"Man\"\n        });\n        model.person(otherPerson);\n        duder.firstName(\"Joe\");\n        assert.equal(duder.I.firstName, \"Joe\");\n        return assert.equal(model.I.person.firstName, \"Mr.\");\n      });\n    });\n    describe(\"#attrModels\", function() {\n      it(\"should have an array of model instances\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        return assert.equal(model.people()[0].fullName(), \"Duder Mannington Jr.\");\n      });\n      it(\"should track pushes\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        model.people.push(Person({\n          firstName: \"JoJo\",\n          lastName: \"Loco\"\n        }));\n        assert.equal(model.people().length, 3);\n        return assert.equal(model.I.people.length, 3);\n      });\n      return it(\"should track pops\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        model.people.pop();\n        assert.equal(model.people().length, 1);\n        return assert.equal(model.I.people.length, 1);\n      });\n    });\n    describe(\"#toJSON\", function() {\n      return it(\"should return an object appropriate for JSON serialization\", function() {\n        var model;\n        model = Model({\n          test: true\n        });\n        return assert(model.toJSON().test);\n      });\n    });\n    return describe(\"#observeAll\", function() {\n      it(\"should observe all attributes of a simple model\");\n      (function() {\n        var model;\n        model = Model({\n          test: true,\n          yolo: \"4life\"\n        });\n        model.observeAll();\n        assert(model.test());\n        return assert.equal(model.yolo(), \"4life\");\n      });\n      return it(\"should camel case underscored names\");\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.1",
      "entryPoint": "README",
      "repository": {
        "id": 17256636,
        "name": "compositions",
        "full_name": "distri/compositions",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/compositions",
        "description": "",
        "fork": false,
        "url": "https://api.github.com/repos/distri/compositions",
        "forks_url": "https://api.github.com/repos/distri/compositions/forks",
        "keys_url": "https://api.github.com/repos/distri/compositions/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/compositions/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/compositions/teams",
        "hooks_url": "https://api.github.com/repos/distri/compositions/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/compositions/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/compositions/events",
        "assignees_url": "https://api.github.com/repos/distri/compositions/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/compositions/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/compositions/tags",
        "blobs_url": "https://api.github.com/repos/distri/compositions/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/compositions/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/compositions/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/compositions/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/compositions/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/compositions/languages",
        "stargazers_url": "https://api.github.com/repos/distri/compositions/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/compositions/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/compositions/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/compositions/subscription",
        "commits_url": "https://api.github.com/repos/distri/compositions/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/compositions/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/compositions/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/compositions/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/compositions/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/compositions/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/compositions/merges",
        "archive_url": "https://api.github.com/repos/distri/compositions/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/compositions/downloads",
        "issues_url": "https://api.github.com/repos/distri/compositions/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/compositions/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/compositions/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/compositions/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/compositions/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/compositions/releases{/id}",
        "created_at": "2014-02-27T17:00:47Z",
        "updated_at": "2014-02-27T17:16:50Z",
        "pushed_at": "2014-02-27T17:16:49Z",
        "git_url": "git://github.com/distri/compositions.git",
        "ssh_url": "git@github.com:distri/compositions.git",
        "clone_url": "https://github.com/distri/compositions.git",
        "svn_url": "https://github.com/distri/compositions",
        "homepage": null,
        "size": 140,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.1.1",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "core": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "core\n====\n\nAn object extension system.\n",
              "type": "blob"
            },
            "core.coffee.md": {
              "path": "core.coffee.md",
              "mode": "100644",
              "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
              "type": "blob"
            },
            "test/core.coffee": {
              "path": "test/core.coffee",
              "mode": "100644",
              "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "core": {
              "path": "core",
              "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
              "type": "blob"
            },
            "test/core": {
              "path": "test/core",
              "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.6.0",
          "entryPoint": "core",
          "repository": {
            "id": 13567517,
            "name": "core",
            "full_name": "distri/core",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/core",
            "description": "An object extension system.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/core",
            "forks_url": "https://api.github.com/repos/distri/core/forks",
            "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/core/teams",
            "hooks_url": "https://api.github.com/repos/distri/core/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/core/events",
            "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/core/tags",
            "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/core/languages",
            "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/core/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/core/subscription",
            "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/core/merges",
            "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/core/downloads",
            "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
            "created_at": "2013-10-14T17:04:33Z",
            "updated_at": "2013-12-24T00:49:21Z",
            "pushed_at": "2013-10-14T23:49:11Z",
            "git_url": "git://github.com/distri/core.git",
            "ssh_url": "git@github.com:distri/core.git",
            "clone_url": "https://github.com/distri/core.git",
            "svn_url": "https://github.com/distri/core",
            "homepage": null,
            "size": 592,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.6.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "observable": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "observable\n==========\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        listeners.forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n        self = ->\n          # Automagic dependency observation\n          magicDependency(self)\n\n          return value\n\n        self.observe = (listener) ->\n          listeners.push listener\n\n        changed = ->\n          value = fn()\n          notify(value)\n\n        value = computeDependencies(fn, changed)\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            magicDependency(self)\n\n          return value\n\nAdd a listener for when this object changes.\n\n        self.observe = (listener) ->\n          listeners.push listener\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (args...) ->\n        if value?\n          [value].forEach(args...)\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (args...) ->\n            self.forEach(args...)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            value[index]\n\n          first: ->\n            value[0]\n\n          last: ->\n            value[value.length-1]\n\n      self.stopObserving = (fn) ->\n        remove listeners, fn\n\n      return self\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nSuper hax for computing dependencies. This needs to be a shared global so that\ndifferent bundled versions of observable libraries can interoperate.\n\n    global.OBSERVABLE_ROOT_HACK = undefined\n\n    magicDependency = (self) ->\n      if base = global.OBSERVABLE_ROOT_HACK\n        self.observe base\n\n    withBase = (root, fn) ->\n      global.OBSERVABLE_ROOT_HACK = root\n      value = fn()\n      global.OBSERVABLE_ROOT_HACK = undefined\n\n      return value\n\n    base = ->\n      global.OBSERVABLE_ROOT_HACK\n\nAutomagically compute dependencies.\n\n    computeDependencies = (fn, root) ->\n      withBase root, ->\n        fn()\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.1.1\"\n",
              "type": "blob"
            },
            "test/observable.coffee": {
              "path": "test/observable.coffee",
              "mode": "100644",
              "content": "Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  # TODO: This looks like it might be impossible\n  it \"should proxy the length property\"\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n\n  it \"should work on an array dependency\", ->\n    oA = Observable [1, 2, 3]\n\n    o = Observable ->\n      oA()[0]\n\n    last = Observable ->\n      oA()[oA().length-1]\n\n    assert.equal o(), 1\n\n    oA.unshift 0\n\n    assert.equal o(), 0\n\n    oA.push 4\n\n    assert.equal last(), 4, \"Last should be 4\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var Observable, base, computeDependencies, extend, magicDependency, remove, withBase,\n    __slice = [].slice;\n\n  Observable = function(value) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return listeners.forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      self.observe = function(listener) {\n        return listeners.push(listener);\n      };\n      changed = function() {\n        value = fn();\n        return notify(value);\n      };\n      value = computeDependencies(fn, changed);\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n      self.observe = function(listener) {\n        return listeners.push(listener);\n      };\n    }\n    self.each = function() {\n      var args, _ref;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      if (value != null) {\n        return (_ref = [value]).forEach.apply(_ref, args);\n      }\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          self.forEach.apply(self, args);\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          return value[index];\n        },\n        first: function() {\n          return value[0];\n        },\n        last: function() {\n          return value[value.length - 1];\n        }\n      });\n    }\n    self.stopObserving = function(fn) {\n      return remove(listeners, fn);\n    };\n    return self;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = void 0;\n\n  magicDependency = function(self) {\n    var base;\n    if (base = global.OBSERVABLE_ROOT_HACK) {\n      return self.observe(base);\n    }\n  };\n\n  withBase = function(root, fn) {\n    var value;\n    global.OBSERVABLE_ROOT_HACK = root;\n    value = fn();\n    global.OBSERVABLE_ROOT_HACK = void 0;\n    return value;\n  };\n\n  base = function() {\n    return global.OBSERVABLE_ROOT_HACK;\n  };\n\n  computeDependencies = function(fn, root) {\n    return withBase(root, function() {\n      return fn();\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.1.1\"};",
              "type": "blob"
            },
            "test/observable": {
              "path": "test/observable",
              "content": "(function() {\n  var Observable;\n\n  Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      return it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n    });\n    return it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    return it(\"should proxy the length property\");\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each);\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n    return it(\"should work on an array dependency\", function() {\n      var last, o, oA;\n      oA = Observable([1, 2, 3]);\n      o = Observable(function() {\n        return oA()[0];\n      });\n      last = Observable(function() {\n        return oA()[oA().length - 1];\n      });\n      assert.equal(o(), 1);\n      oA.unshift(0);\n      assert.equal(o(), 0);\n      oA.push(4);\n      return assert.equal(last(), 4, \"Last should be 4\");\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.1.1",
          "entryPoint": "main",
          "repository": {
            "id": 17119562,
            "name": "observable",
            "full_name": "distri/observable",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
              "gravatar_id": "192f3f168409e79c42107f081139d9f3",
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/observable",
            "description": "",
            "fork": false,
            "url": "https://api.github.com/repos/distri/observable",
            "forks_url": "https://api.github.com/repos/distri/observable/forks",
            "keys_url": "https://api.github.com/repos/distri/observable/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/observable/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/observable/teams",
            "hooks_url": "https://api.github.com/repos/distri/observable/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/observable/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/observable/events",
            "assignees_url": "https://api.github.com/repos/distri/observable/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/observable/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/observable/tags",
            "blobs_url": "https://api.github.com/repos/distri/observable/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/observable/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/observable/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/observable/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/observable/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/observable/languages",
            "stargazers_url": "https://api.github.com/repos/distri/observable/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/observable/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/observable/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/observable/subscription",
            "commits_url": "https://api.github.com/repos/distri/observable/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/observable/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/observable/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/observable/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/observable/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/observable/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/observable/merges",
            "archive_url": "https://api.github.com/repos/distri/observable/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/observable/downloads",
            "issues_url": "https://api.github.com/repos/distri/observable/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/observable/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/observable/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/observable/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/observable/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/observable/releases{/id}",
            "created_at": "2014-02-23T23:17:52Z",
            "updated_at": "2014-04-02T00:41:29Z",
            "pushed_at": "2014-04-02T00:41:31Z",
            "git_url": "git://github.com/distri/observable.git",
            "ssh_url": "git@github.com:distri/observable.git",
            "clone_url": "https://github.com/distri/observable.git",
            "svn_url": "https://github.com/distri/observable",
            "homepage": null,
            "size": 164,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
              "gravatar_id": "192f3f168409e79c42107f081139d9f3",
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.1.1",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    },
    "jquery-hotkeys": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "jquery.hotkeys\n==============\n\njQuery hotkeys plugin\n",
          "type": "blob"
        },
        "hotkeys.coffee.md": {
          "path": "hotkeys.coffee.md",
          "mode": "100644",
          "content": "jQuery Hotkeys Plugin\n=====================\n\nCopyright 2010, John Resig\nDual licensed under the MIT or GPL Version 2 licenses.\n\nBased upon the plugin by Tzury Bar Yochay:\nhttp://github.com/tzuryby/hotkeys\n\nOriginal idea by:\nBinny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/\n\n    if jQuery?\n      ((jQuery) ->\n        isTextAcceptingInput = (element) ->\n          /textarea|select/i.test(element.nodeName) or element.type is \"text\" or element.type is \"password\"\n\n        isFunctionKey = (event) ->\n          (event.type != \"keypress\") && (112 <= event.which <= 123)\n\n        jQuery.hotkeys =\n          version: \"0.9.0\"\n\n          specialKeys:\n            8: \"backspace\"\n            9: \"tab\"\n            13: \"return\"\n            16: \"shift\"\n            17: \"ctrl\"\n            18: \"alt\"\n            19: \"pause\"\n            20: \"capslock\"\n            27: \"esc\"\n            32: \"space\"\n            33: \"pageup\"\n            34: \"pagedown\"\n            35: \"end\"\n            36: \"home\"\n            37: \"left\"\n            38: \"up\"\n            39: \"right\"\n            40: \"down\"\n            45: \"insert\"\n            46: \"del\"\n            96: \"0\"\n            97: \"1\"\n            98: \"2\"\n            99: \"3\"\n            100: \"4\"\n            101: \"5\"\n            102: \"6\"\n            103: \"7\"\n            104: \"8\"\n            105: \"9\"\n            106: \"*\"\n            107: \"+\"\n            109: \"-\"\n            110: \".\"\n            111 : \"/\"\n            112: \"f1\"\n            113: \"f2\"\n            114: \"f3\"\n            115: \"f4\"\n            116: \"f5\"\n            117: \"f6\"\n            118: \"f7\"\n            119: \"f8\"\n            120: \"f9\"\n            121: \"f10\"\n            122: \"f11\"\n            123: \"f12\"\n            144: \"numlock\"\n            145: \"scroll\"\n            186: \";\"\n            187: \"=\"\n            188: \",\"\n            189: \"-\"\n            190: \".\"\n            191: \"/\"\n            219: \"[\"\n            220: \"\\\\\"\n            221: \"]\"\n            222: \"'\"\n            224: \"meta\"\n\n          shiftNums:\n            \"`\": \"~\"\n            \"1\": \"!\"\n            \"2\": \"@\"\n            \"3\": \"#\"\n            \"4\": \"$\"\n            \"5\": \"%\"\n            \"6\": \"^\"\n            \"7\": \"&\"\n            \"8\": \"*\"\n            \"9\": \"(\"\n            \"0\": \")\"\n            \"-\": \"_\"\n            \"=\": \"+\"\n            \";\": \":\"\n            \"'\": \"\\\"\"\n            \",\": \"<\"\n            \".\": \">\"\n            \"/\": \"?\"\n            \"\\\\\": \"|\"\n\n        keyHandler = (handleObj) ->\n          # Only care when a possible input has been specified\n          if typeof handleObj.data != \"string\"\n            return\n\n          origHandler = handleObj.handler\n          keys = handleObj.data.toLowerCase().split(\" \")\n\n          handleObj.handler = (event) ->\n            # Keypress represents characters, not special keys\n            special = event.type != \"keypress\" && jQuery.hotkeys.specialKeys[ event.which ]\n            character = String.fromCharCode( event.which ).toLowerCase()\n            modif = \"\"\n            possible = {}\n            target = event.target\n\n            # check combinations (alt|ctrl|shift+anything)\n            if event.altKey && special != \"alt\"\n              modif += \"alt+\"\n\n            if event.ctrlKey && special != \"ctrl\"\n              modif += \"ctrl+\"\n\n            # TODO: Need to make sure this works consistently across platforms\n            if event.metaKey && !event.ctrlKey && special != \"meta\"\n              modif += \"meta+\"\n\n            # Don't fire in text-accepting inputs that we didn't directly bind to\n            # unless a non-shift modifier key or function key is pressed\n            unless this == target\n              if isTextAcceptingInput(target) && !modif && !isFunctionKey(event)\n                return\n\n            if event.shiftKey && special != \"shift\"\n              modif += \"shift+\"\n\n            if special\n              possible[ modif + special ] = true\n            else\n              possible[ modif + character ] = true\n              possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true\n\n              # \"$\" can be triggered as \"Shift+4\" or \"Shift+$\" or just \"$\"\n              if modif == \"shift+\"\n                possible[ jQuery.hotkeys.shiftNums[ character ] ] = true\n\n            for key in keys\n              if possible[key]\n                return origHandler.apply( this, arguments )\n\n        jQuery.each [ \"keydown\", \"keyup\", \"keypress\" ], ->\n          jQuery.event.special[ this ] = { add: keyHandler }\n\n      )(jQuery)\n    else\n      console.warn \"jQuery not found, no hotkeys added :(\"\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.9.2\"\nentryPoint: \"hotkeys\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\n",
          "type": "blob"
        },
        "test/hotkeys.coffee": {
          "path": "test/hotkeys.coffee",
          "mode": "100644",
          "content": "require \"../hotkeys\"\n\ndescribe \"hotkeys binding\", ->\n  it \"should bind a hotkey\", (done) ->\n    $(document).bind \"keydown\", \"a\", ->\n      done()\n\n    $(document).trigger $.Event \"keydown\",\n      which: 65 # a\n      keyCode: 65\n",
          "type": "blob"
        }
      },
      "distribution": {
        "hotkeys": {
          "path": "hotkeys",
          "content": "(function() {\n  if (typeof jQuery !== \"undefined\" && jQuery !== null) {\n    (function(jQuery) {\n      var isFunctionKey, isTextAcceptingInput, keyHandler;\n      isTextAcceptingInput = function(element) {\n        return /textarea|select/i.test(element.nodeName) || element.type === \"text\" || element.type === \"password\";\n      };\n      isFunctionKey = function(event) {\n        var _ref;\n        return (event.type !== \"keypress\") && ((112 <= (_ref = event.which) && _ref <= 123));\n      };\n      jQuery.hotkeys = {\n        version: \"0.9.0\",\n        specialKeys: {\n          8: \"backspace\",\n          9: \"tab\",\n          13: \"return\",\n          16: \"shift\",\n          17: \"ctrl\",\n          18: \"alt\",\n          19: \"pause\",\n          20: \"capslock\",\n          27: \"esc\",\n          32: \"space\",\n          33: \"pageup\",\n          34: \"pagedown\",\n          35: \"end\",\n          36: \"home\",\n          37: \"left\",\n          38: \"up\",\n          39: \"right\",\n          40: \"down\",\n          45: \"insert\",\n          46: \"del\",\n          96: \"0\",\n          97: \"1\",\n          98: \"2\",\n          99: \"3\",\n          100: \"4\",\n          101: \"5\",\n          102: \"6\",\n          103: \"7\",\n          104: \"8\",\n          105: \"9\",\n          106: \"*\",\n          107: \"+\",\n          109: \"-\",\n          110: \".\",\n          111: \"/\",\n          112: \"f1\",\n          113: \"f2\",\n          114: \"f3\",\n          115: \"f4\",\n          116: \"f5\",\n          117: \"f6\",\n          118: \"f7\",\n          119: \"f8\",\n          120: \"f9\",\n          121: \"f10\",\n          122: \"f11\",\n          123: \"f12\",\n          144: \"numlock\",\n          145: \"scroll\",\n          186: \";\",\n          187: \"=\",\n          188: \",\",\n          189: \"-\",\n          190: \".\",\n          191: \"/\",\n          219: \"[\",\n          220: \"\\\\\",\n          221: \"]\",\n          222: \"'\",\n          224: \"meta\"\n        },\n        shiftNums: {\n          \"`\": \"~\",\n          \"1\": \"!\",\n          \"2\": \"@\",\n          \"3\": \"#\",\n          \"4\": \"$\",\n          \"5\": \"%\",\n          \"6\": \"^\",\n          \"7\": \"&\",\n          \"8\": \"*\",\n          \"9\": \"(\",\n          \"0\": \")\",\n          \"-\": \"_\",\n          \"=\": \"+\",\n          \";\": \":\",\n          \"'\": \"\\\"\",\n          \",\": \"<\",\n          \".\": \">\",\n          \"/\": \"?\",\n          \"\\\\\": \"|\"\n        }\n      };\n      keyHandler = function(handleObj) {\n        var keys, origHandler;\n        if (typeof handleObj.data !== \"string\") {\n          return;\n        }\n        origHandler = handleObj.handler;\n        keys = handleObj.data.toLowerCase().split(\" \");\n        return handleObj.handler = function(event) {\n          var character, key, modif, possible, special, target, _i, _len;\n          special = event.type !== \"keypress\" && jQuery.hotkeys.specialKeys[event.which];\n          character = String.fromCharCode(event.which).toLowerCase();\n          modif = \"\";\n          possible = {};\n          target = event.target;\n          if (event.altKey && special !== \"alt\") {\n            modif += \"alt+\";\n          }\n          if (event.ctrlKey && special !== \"ctrl\") {\n            modif += \"ctrl+\";\n          }\n          if (event.metaKey && !event.ctrlKey && special !== \"meta\") {\n            modif += \"meta+\";\n          }\n          if (this !== target) {\n            if (isTextAcceptingInput(target) && !modif && !isFunctionKey(event)) {\n              return;\n            }\n          }\n          if (event.shiftKey && special !== \"shift\") {\n            modif += \"shift+\";\n          }\n          if (special) {\n            possible[modif + special] = true;\n          } else {\n            possible[modif + character] = true;\n            possible[modif + jQuery.hotkeys.shiftNums[character]] = true;\n            if (modif === \"shift+\") {\n              possible[jQuery.hotkeys.shiftNums[character]] = true;\n            }\n          }\n          for (_i = 0, _len = keys.length; _i < _len; _i++) {\n            key = keys[_i];\n            if (possible[key]) {\n              return origHandler.apply(this, arguments);\n            }\n          }\n        };\n      };\n      return jQuery.each([\"keydown\", \"keyup\", \"keypress\"], function() {\n        return jQuery.event.special[this] = {\n          add: keyHandler\n        };\n      });\n    })(jQuery);\n  } else {\n    console.warn(\"jQuery not found, no hotkeys added :(\");\n  }\n\n}).call(this);\n\n//# sourceURL=hotkeys.coffee",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.9.2\",\"entryPoint\":\"hotkeys\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\"]};",
          "type": "blob"
        },
        "test/hotkeys": {
          "path": "test/hotkeys",
          "content": "(function() {\n  require(\"../hotkeys\");\n\n  describe(\"hotkeys binding\", function() {\n    return it(\"should bind a hotkey\", function(done) {\n      $(document).bind(\"keydown\", \"a\", function() {\n        return done();\n      });\n      return $(document).trigger($.Event(\"keydown\", {\n        which: 65,\n        keyCode: 65\n      }));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/hotkeys.coffee",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.9.2",
      "entryPoint": "hotkeys",
      "remoteDependencies": [
        "//code.jquery.com/jquery-1.10.1.min.js"
      ],
      "repository": {
        "id": 13182272,
        "name": "jquery-hotkeys",
        "full_name": "distri/jquery-hotkeys",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/jquery-hotkeys",
        "description": "jQuery hotkeys plugin",
        "fork": false,
        "url": "https://api.github.com/repos/distri/jquery-hotkeys",
        "forks_url": "https://api.github.com/repos/distri/jquery-hotkeys/forks",
        "keys_url": "https://api.github.com/repos/distri/jquery-hotkeys/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/jquery-hotkeys/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/jquery-hotkeys/teams",
        "hooks_url": "https://api.github.com/repos/distri/jquery-hotkeys/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/jquery-hotkeys/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/jquery-hotkeys/events",
        "assignees_url": "https://api.github.com/repos/distri/jquery-hotkeys/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/jquery-hotkeys/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/jquery-hotkeys/tags",
        "blobs_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/jquery-hotkeys/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/jquery-hotkeys/languages",
        "stargazers_url": "https://api.github.com/repos/distri/jquery-hotkeys/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/jquery-hotkeys/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/jquery-hotkeys/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/jquery-hotkeys/subscription",
        "commits_url": "https://api.github.com/repos/distri/jquery-hotkeys/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/jquery-hotkeys/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/jquery-hotkeys/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/jquery-hotkeys/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/jquery-hotkeys/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/jquery-hotkeys/merges",
        "archive_url": "https://api.github.com/repos/distri/jquery-hotkeys/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/jquery-hotkeys/downloads",
        "issues_url": "https://api.github.com/repos/distri/jquery-hotkeys/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/jquery-hotkeys/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/jquery-hotkeys/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/jquery-hotkeys/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/jquery-hotkeys/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/jquery-hotkeys/releases{/id}",
        "created_at": "2013-09-28T22:58:08Z",
        "updated_at": "2013-11-29T20:59:45Z",
        "pushed_at": "2013-09-29T23:55:14Z",
        "git_url": "git://github.com/distri/jquery-hotkeys.git",
        "ssh_url": "git@github.com:distri/jquery-hotkeys.git",
        "clone_url": "https://github.com/distri/jquery-hotkeys.git",
        "svn_url": "https://github.com/distri/jquery-hotkeys",
        "homepage": null,
        "size": 608,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.9.2",
        "defaultBranch": "master"
      },
      "dependencies": {}
    },
    "observable": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "observable\n==========\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        listeners.forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n        self = ->\n          # Automagic dependency observation\n          magicDependency(self)\n\n          return value\n\n        self.observe = (listener) ->\n          listeners.push listener\n\n        changed = ->\n          value = fn()\n          notify(value)\n\n        value = computeDependencies(fn, changed)\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            magicDependency(self)\n\n          return value\n\nAdd a listener for when this object changes.\n\n        self.observe = (listener) ->\n          listeners.push listener\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (args...) ->\n        if value?\n          [value].forEach(args...)\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (args...) ->\n            self.forEach(args...)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            value[index]\n\n          first: ->\n            value[0]\n\n          last: ->\n            value[value.length-1]\n\n      self.stopObserving = (fn) ->\n        remove listeners, fn\n\n      return self\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nSuper hax for computing dependencies. This needs to be a shared global so that\ndifferent bundled versions of observable libraries can interoperate.\n\n    global.OBSERVABLE_ROOT_HACK = undefined\n\n    magicDependency = (self) ->\n      if base = global.OBSERVABLE_ROOT_HACK\n        self.observe base\n\n    withBase = (root, fn) ->\n      global.OBSERVABLE_ROOT_HACK = root\n      value = fn()\n      global.OBSERVABLE_ROOT_HACK = undefined\n\n      return value\n\n    base = ->\n      global.OBSERVABLE_ROOT_HACK\n\nAutomagically compute dependencies.\n\n    computeDependencies = (fn, root) ->\n      withBase root, ->\n        fn()\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.1\"\n",
          "type": "blob"
        },
        "test/observable.coffee": {
          "path": "test/observable.coffee",
          "mode": "100644",
          "content": "Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  # TODO: This looks like it might be impossible\n  it \"should proxy the length property\"\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n\n  it \"should work on an array dependency\", ->\n    oA = Observable [1, 2, 3]\n\n    o = Observable ->\n      oA()[0]\n\n    last = Observable ->\n      oA()[oA().length-1]\n\n    assert.equal o(), 1\n\n    oA.unshift 0\n\n    assert.equal o(), 0\n\n    oA.push 4\n\n    assert.equal last(), 4, \"Last should be 4\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var Observable, base, computeDependencies, extend, magicDependency, remove, withBase,\n    __slice = [].slice;\n\n  Observable = function(value) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return listeners.forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      self.observe = function(listener) {\n        return listeners.push(listener);\n      };\n      changed = function() {\n        value = fn();\n        return notify(value);\n      };\n      value = computeDependencies(fn, changed);\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n      self.observe = function(listener) {\n        return listeners.push(listener);\n      };\n    }\n    self.each = function() {\n      var args, _ref;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      if (value != null) {\n        return (_ref = [value]).forEach.apply(_ref, args);\n      }\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          self.forEach.apply(self, args);\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          return value[index];\n        },\n        first: function() {\n          return value[0];\n        },\n        last: function() {\n          return value[value.length - 1];\n        }\n      });\n    }\n    self.stopObserving = function(fn) {\n      return remove(listeners, fn);\n    };\n    return self;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = void 0;\n\n  magicDependency = function(self) {\n    var base;\n    if (base = global.OBSERVABLE_ROOT_HACK) {\n      return self.observe(base);\n    }\n  };\n\n  withBase = function(root, fn) {\n    var value;\n    global.OBSERVABLE_ROOT_HACK = root;\n    value = fn();\n    global.OBSERVABLE_ROOT_HACK = void 0;\n    return value;\n  };\n\n  base = function() {\n    return global.OBSERVABLE_ROOT_HACK;\n  };\n\n  computeDependencies = function(fn, root) {\n    return withBase(root, function() {\n      return fn();\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.1\"};",
          "type": "blob"
        },
        "test/observable": {
          "path": "test/observable",
          "content": "(function() {\n  var Observable;\n\n  Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      return it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n    });\n    return it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    return it(\"should proxy the length property\");\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each);\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n    return it(\"should work on an array dependency\", function() {\n      var last, o, oA;\n      oA = Observable([1, 2, 3]);\n      o = Observable(function() {\n        return oA()[0];\n      });\n      last = Observable(function() {\n        return oA()[oA().length - 1];\n      });\n      assert.equal(o(), 1);\n      oA.unshift(0);\n      assert.equal(o(), 0);\n      oA.push(4);\n      return assert.equal(last(), 4, \"Last should be 4\");\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.1",
      "entryPoint": "main",
      "repository": {
        "id": 17119562,
        "name": "observable",
        "full_name": "distri/observable",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/observable",
        "description": "",
        "fork": false,
        "url": "https://api.github.com/repos/distri/observable",
        "forks_url": "https://api.github.com/repos/distri/observable/forks",
        "keys_url": "https://api.github.com/repos/distri/observable/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/observable/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/observable/teams",
        "hooks_url": "https://api.github.com/repos/distri/observable/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/observable/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/observable/events",
        "assignees_url": "https://api.github.com/repos/distri/observable/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/observable/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/observable/tags",
        "blobs_url": "https://api.github.com/repos/distri/observable/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/observable/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/observable/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/observable/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/observable/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/observable/languages",
        "stargazers_url": "https://api.github.com/repos/distri/observable/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/observable/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/observable/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/observable/subscription",
        "commits_url": "https://api.github.com/repos/distri/observable/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/observable/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/observable/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/observable/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/observable/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/observable/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/observable/merges",
        "archive_url": "https://api.github.com/repos/distri/observable/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/observable/downloads",
        "issues_url": "https://api.github.com/repos/distri/observable/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/observable/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/observable/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/observable/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/observable/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/observable/releases{/id}",
        "created_at": "2014-02-23T23:17:52Z",
        "updated_at": "2014-04-02T00:41:29Z",
        "pushed_at": "2014-04-02T00:41:31Z",
        "git_url": "git://github.com/distri/observable.git",
        "ssh_url": "git@github.com:distri/observable.git",
        "clone_url": "https://github.com/distri/observable.git",
        "svn_url": "https://github.com/distri/observable",
        "homepage": null,
        "size": 164,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.1.1",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    },
    "s3-trinket": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "s3-trinket\n==========\n\nClip data to S3 and organize workspaces, whatever that means!\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "S3 Trinket\n==========\n\nUsage\n-----\n\nInitializing\n\n>     S3Trinket = require \"s3-trinket\"\n>     trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)\n\nLoading a workspace\n\n>     trinket.loadWorkspace(\"master\")\n>     .then (data) ->\n>       console.log \"loaded workspace\", data\n\nSaving a workspace\n\n>     trinket.saveWorkspace \"master\", data\n\nPost edited images.\n\n>     trinket.post \"images\", imgBlob, (namespacedSha) ->\n\nAfter sifting post image sets.\n\n>     trinket.post \"image_sets\", json, (namespacedSha) ->\n\n    Uploader = require \"./uploader\"\n    SHA1 = require \"sha1\"\n\n    module.exports = S3Trinket = (policy) ->\n      uploader = Uploader(policy)\n\n      user = getUserFromPolicy(policy)\n      base = \"http://#{policy.bucket}.s3.amazonaws.com/#{user}\"\n\nPost a blob to S3 using the given namespace as a content addressable store.\n\n      post: (blob) ->\n        blobToS3 uploader, \"#{user}data\", blob\n\n      loadWorkspace: (name) ->\n        $.getJSON \"#{base}workspaces/#{name}.json\"\n\n      saveWorkspace: (name, data) ->\n        key = \"#{user}workspaces/#{name}.json\"\n        uploader.upload\n          key: key\n          blob: new Blob [JSON.stringify(data)], type: \"application/json\"\n          cacheControl: 60\n        .then ->\n          key\n\n      list: (namespace=\"\") ->\n        namespace = \"#{namespace}\"\n\n        url = \"#{base}#{namespace}\"\n\n        $.get(url).then (data) ->\n          $(data).find(\"Key\").map ->\n            this.innerHTML\n          .get()\n\nExpose SHA1 for others to use.\n\n    S3Trinket.SHA1 = SHA1\n\nHelpers\n-------\n\n    blobToS3 = (uploader, namespace, blob) ->\n      deferred = $.Deferred()\n\n      SHA1 blob, (sha) ->\n        key = \"#{namespace}/#{sha}\"\n\n        uploader.upload\n          key: key\n          blob: blob\n        .then ->\n          deferred.resolve key\n        , (error) ->\n          deferred.reject(error)\n\n      deferred.promise()\n\n    getUserFromPolicy = (policy) ->\n      conditions = JSON.parse(atob(policy.policy)).conditions.filter ([a, b, c]) ->\n        a is \"starts-with\" and b is \"$key\"\n\n      conditions[0][2]\n",
          "mode": "100644"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.1\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\ndependencies:\n  sha1: \"distri/sha1:v0.2.0\"\n",
          "mode": "100644"
        },
        "test/test.coffee": {
          "path": "test/test.coffee",
          "content": "S3Trinket = require \"../main\"\n\ntrinket = S3Trinket(JSON.parse(localStorage.TRINKET_POLICY))\n\ntrinket.saveWorkspace(\"yolo\", radical: true).then (key) ->\n  console.log key\n\ntrinket.post(new Blob([\"duder\"], type: \"text/plain\")).then (key) ->\n  console.log key\n",
          "mode": "100644"
        },
        "uploader.coffee.md": {
          "path": "uploader.coffee.md",
          "content": "S3\n====\n\nUpload data directly to S3 from the client.\n\nUsage\n-----\n\n>     uploader = S3.uploader(JSON.parse(localStorage.S3Policy))\n>     uploader.upload\n>       key: \"myfile.text\"\n>       blob: new Blob [\"radical\"]\n>       cacheControl: 60 # default 31536000\n\nThe policy is a JSON object with the following keys:\n\n- `accessKey`\n- `policy`\n- `signature`\n\nSince these are all needed to create and sign the policy we keep them all\ntogether.\n\nGiving this object to the uploader method creates an uploader capable of\nasynchronously uploading files to the bucket specified in the policy.\n\nNotes\n-----\n\nThe policy must specify a `Cache-Control` header because we always try to set it.\n\nImplementation\n--------------\n\n    module.exports = (credentials) ->\n      {policy, signature, accessKey} = credentials\n      {acl, bucket} = extractPolicyData(policy)\n\n      upload: ({key, blob, cacheControl}) ->\n        sendForm \"https://#{bucket}.s3.amazonaws.com\", objectToForm\n          key: key\n          \"Content-Type\": blob.type\n          \"Cache-Control\": \"max-age=#{cacheControl or 31536000}\"\n          AWSAccessKeyId: accessKey\n          acl: acl\n          policy: policy\n          signature: signature\n          file: blob\n\nHelpers\n-------\n\n    sendForm = (url, formData) ->\n      $.ajax\n        url: url\n        data: formData\n        processData: false\n        contentType: false\n        type: 'POST'\n\n    objectToForm = (data) ->\n      formData = Object.keys(data).reduce (formData, key) ->\n        formData.append(key, data[key])\n\n        return formData\n      , new FormData\n\n    extractPolicyData = (policy) ->\n      policyObject = JSON.parse(atob(policy))\n\n      conditions = policyObject.conditions\n\n      acl: getKey(conditions, \"acl\")\n      bucket: getKey(conditions, \"bucket\")\n\n    getKey = (conditions, key) ->\n      results = conditions.filter (condition) ->\n        typeof condition is \"object\"\n      .map (object) ->\n        object[key]\n      .filter (value) ->\n        value\n\n      results[0]\n",
          "mode": "100644"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var S3Trinket, SHA1, Uploader, blobToS3, getUserFromPolicy;\n\n  Uploader = require(\"./uploader\");\n\n  SHA1 = require(\"sha1\");\n\n  module.exports = S3Trinket = function(policy) {\n    var base, uploader, user;\n    uploader = Uploader(policy);\n    user = getUserFromPolicy(policy);\n    base = \"http://\" + policy.bucket + \".s3.amazonaws.com/\" + user;\n    return {\n      post: function(blob) {\n        return blobToS3(uploader, \"\" + user + \"data\", blob);\n      },\n      loadWorkspace: function(name) {\n        return $.getJSON(\"\" + base + \"workspaces/\" + name + \".json\");\n      },\n      saveWorkspace: function(name, data) {\n        var key;\n        key = \"\" + user + \"workspaces/\" + name + \".json\";\n        return uploader.upload({\n          key: key,\n          blob: new Blob([JSON.stringify(data)], {\n            type: \"application/json\"\n          }),\n          cacheControl: 60\n        }).then(function() {\n          return key;\n        });\n      },\n      list: function(namespace) {\n        var url;\n        if (namespace == null) {\n          namespace = \"\";\n        }\n        namespace = \"\" + namespace;\n        url = \"\" + base + namespace;\n        return $.get(url).then(function(data) {\n          return $(data).find(\"Key\").map(function() {\n            return this.innerHTML;\n          }).get();\n        });\n      }\n    };\n  };\n\n  S3Trinket.SHA1 = SHA1;\n\n  blobToS3 = function(uploader, namespace, blob) {\n    var deferred;\n    deferred = $.Deferred();\n    SHA1(blob, function(sha) {\n      var key;\n      key = \"\" + namespace + \"/\" + sha;\n      return uploader.upload({\n        key: key,\n        blob: blob\n      }).then(function() {\n        return deferred.resolve(key);\n      }, function(error) {\n        return deferred.reject(error);\n      });\n    });\n    return deferred.promise();\n  };\n\n  getUserFromPolicy = function(policy) {\n    var conditions;\n    conditions = JSON.parse(atob(policy.policy)).conditions.filter(function(_arg) {\n      var a, b, c;\n      a = _arg[0], b = _arg[1], c = _arg[2];\n      return a === \"starts-with\" && b === \"$key\";\n    });\n    return conditions[0][2];\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.1\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"],\"dependencies\":{\"sha1\":\"distri/sha1:v0.2.0\"}};",
          "type": "blob"
        },
        "test/test": {
          "path": "test/test",
          "content": "(function() {\n  var S3Trinket, trinket;\n\n  S3Trinket = require(\"../main\");\n\n  trinket = S3Trinket(JSON.parse(localStorage.TRINKET_POLICY));\n\n  trinket.saveWorkspace(\"yolo\", {\n    radical: true\n  }).then(function(key) {\n    return console.log(key);\n  });\n\n  trinket.post(new Blob([\"duder\"], {\n    type: \"text/plain\"\n  })).then(function(key) {\n    return console.log(key);\n  });\n\n}).call(this);\n",
          "type": "blob"
        },
        "uploader": {
          "path": "uploader",
          "content": "(function() {\n  var extractPolicyData, getKey, objectToForm, sendForm;\n\n  module.exports = function(credentials) {\n    var accessKey, acl, bucket, policy, signature, _ref;\n    policy = credentials.policy, signature = credentials.signature, accessKey = credentials.accessKey;\n    _ref = extractPolicyData(policy), acl = _ref.acl, bucket = _ref.bucket;\n    return {\n      upload: function(_arg) {\n        var blob, cacheControl, key;\n        key = _arg.key, blob = _arg.blob, cacheControl = _arg.cacheControl;\n        return sendForm(\"https://\" + bucket + \".s3.amazonaws.com\", objectToForm({\n          key: key,\n          \"Content-Type\": blob.type,\n          \"Cache-Control\": \"max-age=\" + (cacheControl || 31536000),\n          AWSAccessKeyId: accessKey,\n          acl: acl,\n          policy: policy,\n          signature: signature,\n          file: blob\n        }));\n      }\n    };\n  };\n\n  sendForm = function(url, formData) {\n    return $.ajax({\n      url: url,\n      data: formData,\n      processData: false,\n      contentType: false,\n      type: 'POST'\n    });\n  };\n\n  objectToForm = function(data) {\n    var formData;\n    return formData = Object.keys(data).reduce(function(formData, key) {\n      formData.append(key, data[key]);\n      return formData;\n    }, new FormData);\n  };\n\n  extractPolicyData = function(policy) {\n    var conditions, policyObject;\n    policyObject = JSON.parse(atob(policy));\n    conditions = policyObject.conditions;\n    return {\n      acl: getKey(conditions, \"acl\"),\n      bucket: getKey(conditions, \"bucket\")\n    };\n  };\n\n  getKey = function(conditions, key) {\n    var results;\n    results = conditions.filter(function(condition) {\n      return typeof condition === \"object\";\n    }).map(function(object) {\n      return object[key];\n    }).filter(function(value) {\n      return value;\n    });\n    return results[0];\n  };\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.1.1",
      "entryPoint": "main",
      "remoteDependencies": [
        "https://code.jquery.com/jquery-1.11.0.min.js"
      ],
      "repository": {
        "branch": "v0.1.1",
        "default_branch": "master",
        "full_name": "distri/s3-trinket",
        "homepage": null,
        "description": "Clip data to S3 and organize workspaces, whatever that means!",
        "html_url": "https://github.com/distri/s3-trinket",
        "url": "https://api.github.com/repos/distri/s3-trinket",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "sha1": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "sha1\n====\n\nSHA1 JS implementation. Currently wrapping CryptoJS with a more uniform API.\n\nUsage\n-----\n\nStrings\n\n    string = \"\"\n\n    SHA1 string, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n\nBlobs\n\n    blob = new Blob\n\n    SHA1 blob, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n\nArray buffers\n\n    arrayBuffer = new ArrayBuffer\n\n    SHA1 arrayBuffer, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "lib/crypto.js": {
              "path": "lib/crypto.js",
              "content": "/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "content": "SHA1\n====\n\nWrapping up CryptoJS SHA1 implementation to be a little nicer.\n\n    {SHA1} = CryptoJS = require(\"./lib/crypto\")\n\n    module.exports = (data, fn) ->\n      if data instanceof Blob\n        blobTypedArray data, (arrayBuffer) ->\n          fn(shaArrayBuffer(arrayBuffer))\n      else if data instanceof ArrayBuffer\n        defer ->\n          fn(shaArrayBuffer(data))\n      else\n        defer ->\n          fn(SHA1(data).toString())\n\nHelpers\n-------\n\n    defer = (fn) ->\n      setTimeout fn, 0\n\n    shaArrayBuffer = (arrayBuffer) ->\n      SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString()\n\n    blobTypedArray = (blob, fn) ->\n      reader = new FileReader()\n    \n      reader.onloadend = ->\n        fn(reader.result)\n    \n      reader.readAsArrayBuffer(blob)\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.2.0\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/sha1.coffee": {
              "path": "test/sha1.coffee",
              "content": "SHA1 = require \"../main\"\n\ndescribe \"SHA1\", ->\n  it \"should hash stuff\", (done) ->\n    SHA1 \"\", (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n\n  it \"should hash blobs\", (done) ->\n    blob = new Blob\n\n    SHA1 blob, (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n\n  it \"should hash array buffers\", (done) ->\n    arrayBuffer = new ArrayBuffer\n\n    SHA1 arrayBuffer, (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "lib/crypto": {
              "path": "lib/crypto",
              "content": "/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n",
              "type": "blob"
            },
            "main": {
              "path": "main",
              "content": "(function() {\n  var CryptoJS, SHA1, blobTypedArray, defer, shaArrayBuffer;\n\n  SHA1 = (CryptoJS = require(\"./lib/crypto\")).SHA1;\n\n  module.exports = function(data, fn) {\n    if (data instanceof Blob) {\n      return blobTypedArray(data, function(arrayBuffer) {\n        return fn(shaArrayBuffer(arrayBuffer));\n      });\n    } else if (data instanceof ArrayBuffer) {\n      return defer(function() {\n        return fn(shaArrayBuffer(data));\n      });\n    } else {\n      return defer(function() {\n        return fn(SHA1(data).toString());\n      });\n    }\n  };\n\n  defer = function(fn) {\n    return setTimeout(fn, 0);\n  };\n\n  shaArrayBuffer = function(arrayBuffer) {\n    return SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString();\n  };\n\n  blobTypedArray = function(blob, fn) {\n    var reader;\n    reader = new FileReader();\n    reader.onloadend = function() {\n      return fn(reader.result);\n    };\n    return reader.readAsArrayBuffer(blob);\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\"};",
              "type": "blob"
            },
            "test/sha1": {
              "path": "test/sha1",
              "content": "(function() {\n  var SHA1;\n\n  SHA1 = require(\"../main\");\n\n  describe(\"SHA1\", function() {\n    it(\"should hash stuff\", function(done) {\n      return SHA1(\"\", function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n    it(\"should hash blobs\", function(done) {\n      var blob;\n      blob = new Blob;\n      return SHA1(blob, function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n    return it(\"should hash array buffers\", function(done) {\n      var arrayBuffer;\n      arrayBuffer = new ArrayBuffer;\n      return SHA1(arrayBuffer, function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://www.danielx.net/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.2.0",
            "default_branch": "master",
            "full_name": "distri/sha1",
            "homepage": null,
            "description": "SHA1 JS implementation",
            "html_url": "https://github.com/distri/sha1",
            "url": "https://api.github.com/repos/distri/sha1",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    },
    "storage": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "storage\n=======\n\nStore data in local storage\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Storage\n=======\n\nA wrapper on the Local Storage API \n\nStore an object in local storage.\n\nMethods\n-------\n\n`set`\n\nYou can store strings\n\n>     Storage.set('name', 'Matt')\n\nNumbers\n\n>     Storage.set('age', 26)\n\nEven objects\n\n>     Storage.set('person', {name: 'Matt', age: 26})\n\n    store = (key, value) ->\n      localStorage[key] = JSON.stringify(value)\n\n      return value\n\n`get` retrieves an object from local storage.\n\n>     Storage.get('name')\n>     # => 'Matt'\n\n>     Storage.get('age')\n>     # => 26\n  \n>     Storage.get('person')\n>     # => { age: 26, name: 'Matt' }\n  \n    retrieve = (key) ->\n      value = localStorage[key]\n  \n      if value?\n        JSON.parse(value)\n\n    module.exports =\n      get: retrieve\n      set: store\n      put: store\n\nAccess an instance of Storage with a specified prefix.\n\nReturns an interface to local storage with the given prefix applied.\n\n      new: (prefix) ->\n        prefix ||= \"\"\n  \n        get: (key) ->\n          retrieve(\"#{prefix}_#{key}\")\n        set: (key, value) ->\n          store(\"#{prefix}_#{key}\", value)\n        put: (key, value) ->\n          store(\"#{prefix}_#{key}\", value)\n",
          "type": "blob"
        },
        "test/storage.coffee": {
          "path": "test/storage.coffee",
          "mode": "100644",
          "content": "Storage = require \"../main\"\n\nequal = assert.equal\n\ndescribe \"Storage\", ->\n  \n  it \"should set and get\", ->\n    object =\n      key: \"test\"\n      cool: true\n      num: 17\n      sub:\n        a: true\n        b: 14\n        c: \"str\"\n  \n    Storage.set(\"__TEST\", object)\n    ret = Storage.get(\"__TEST\")\n    equal ret.key, object.key\n    equal ret.cool, object.cool\n    equal ret.num, object.num\n    equal ret.sub.a, object.sub.a\n    equal ret.sub.b, object.sub.b\n    equal ret.sub.c, object.sub.c\n\n    Storage.set(\"__TEST\", 0)\n    ret = Storage.get(\"__TEST\")\n    equal ret, 0\n\n    Storage.set(\"__TEST\", false)\n    ret = Storage.get(\"__TEST\")\n    equal ret, false\n\n    Storage.set(\"__TEST\", \"\")\n    ret = Storage.get(\"__TEST\")\n    equal ret, \"\"\n\n  it \"should have Storage.new\", ->\n    local = Storage.new(\"TEST\")\n    key = \"a test value\"\n\n    local.set(key, true)\n    equal local.get(key), true\n\n    equal Storage.get(key), null\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.0\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var retrieve, store;\n\n  store = function(key, value) {\n    localStorage[key] = JSON.stringify(value);\n    return value;\n  };\n\n  retrieve = function(key) {\n    var value;\n    value = localStorage[key];\n    if (value != null) {\n      return JSON.parse(value);\n    }\n  };\n\n  module.exports = {\n    get: retrieve,\n    set: store,\n    put: store,\n    \"new\": function(prefix) {\n      prefix || (prefix = \"\");\n      return {\n        get: function(key) {\n          return retrieve(\"\" + prefix + \"_\" + key);\n        },\n        set: function(key, value) {\n          return store(\"\" + prefix + \"_\" + key, value);\n        },\n        put: function(key, value) {\n          return store(\"\" + prefix + \"_\" + key, value);\n        }\n      };\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
          "type": "blob"
        },
        "test/storage": {
          "path": "test/storage",
          "content": "(function() {\n  var Storage, equal;\n\n  Storage = require(\"../main\");\n\n  equal = assert.equal;\n\n  describe(\"Storage\", function() {\n    it(\"should set and get\", function() {\n      var object, ret;\n      object = {\n        key: \"test\",\n        cool: true,\n        num: 17,\n        sub: {\n          a: true,\n          b: 14,\n          c: \"str\"\n        }\n      };\n      Storage.set(\"__TEST\", object);\n      ret = Storage.get(\"__TEST\");\n      equal(ret.key, object.key);\n      equal(ret.cool, object.cool);\n      equal(ret.num, object.num);\n      equal(ret.sub.a, object.sub.a);\n      equal(ret.sub.b, object.sub.b);\n      equal(ret.sub.c, object.sub.c);\n      Storage.set(\"__TEST\", 0);\n      ret = Storage.get(\"__TEST\");\n      equal(ret, 0);\n      Storage.set(\"__TEST\", false);\n      ret = Storage.get(\"__TEST\");\n      equal(ret, false);\n      Storage.set(\"__TEST\", \"\");\n      ret = Storage.get(\"__TEST\");\n      return equal(ret, \"\");\n    });\n    return it(\"should have Storage.new\", function() {\n      var key, local;\n      local = Storage[\"new\"](\"TEST\");\n      key = \"a test value\";\n      local.set(key, true);\n      equal(local.get(key), true);\n      return equal(Storage.get(key), null);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/storage.coffee",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.0\"};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.0",
      "entryPoint": "main",
      "repository": {
        "id": 15595932,
        "name": "storage",
        "full_name": "distri/storage",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/storage",
        "description": "Store data in local storage",
        "fork": false,
        "url": "https://api.github.com/repos/distri/storage",
        "forks_url": "https://api.github.com/repos/distri/storage/forks",
        "keys_url": "https://api.github.com/repos/distri/storage/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/storage/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/storage/teams",
        "hooks_url": "https://api.github.com/repos/distri/storage/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/storage/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/storage/events",
        "assignees_url": "https://api.github.com/repos/distri/storage/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/storage/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/storage/tags",
        "blobs_url": "https://api.github.com/repos/distri/storage/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/storage/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/storage/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/storage/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/storage/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/storage/languages",
        "stargazers_url": "https://api.github.com/repos/distri/storage/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/storage/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/storage/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/storage/subscription",
        "commits_url": "https://api.github.com/repos/distri/storage/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/storage/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/storage/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/storage/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/storage/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/storage/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/storage/merges",
        "archive_url": "https://api.github.com/repos/distri/storage/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/storage/downloads",
        "issues_url": "https://api.github.com/repos/distri/storage/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/storage/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/storage/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/storage/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/storage/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/storage/releases{/id}",
        "created_at": "2014-01-02T22:58:53Z",
        "updated_at": "2014-01-02T22:58:53Z",
        "pushed_at": "2014-01-02T22:58:53Z",
        "git_url": "git://github.com/distri/storage.git",
        "ssh_url": "git@github.com:distri/storage.git",
        "clone_url": "https://github.com/distri/storage.git",
        "svn_url": "https://github.com/distri/storage",
        "homepage": null,
        "size": 0,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": null,
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.1.0",
        "defaultBranch": "master"
      },
      "dependencies": {}
    },
    "util": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "util\n====\n\nSmall utility methods for JS\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\nApply a stylesheet idempotently.\n\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.0\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(prevousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.0\"};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.0",
      "entryPoint": "main",
      "repository": {
        "id": 18501018,
        "name": "util",
        "full_name": "distri/util",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/util",
        "description": "Small utility methods for JS",
        "fork": false,
        "url": "https://api.github.com/repos/distri/util",
        "forks_url": "https://api.github.com/repos/distri/util/forks",
        "keys_url": "https://api.github.com/repos/distri/util/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/util/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/util/teams",
        "hooks_url": "https://api.github.com/repos/distri/util/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/util/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/util/events",
        "assignees_url": "https://api.github.com/repos/distri/util/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/util/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/util/tags",
        "blobs_url": "https://api.github.com/repos/distri/util/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/util/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/util/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/util/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/util/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/util/languages",
        "stargazers_url": "https://api.github.com/repos/distri/util/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/util/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/util/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/util/subscription",
        "commits_url": "https://api.github.com/repos/distri/util/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/util/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/util/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/util/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/util/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/util/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/util/merges",
        "archive_url": "https://api.github.com/repos/distri/util/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/util/downloads",
        "issues_url": "https://api.github.com/repos/distri/util/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/util/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/util/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/util/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/util/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/util/releases{/id}",
        "created_at": "2014-04-06T22:42:56Z",
        "updated_at": "2014-04-06T22:42:56Z",
        "pushed_at": "2014-04-06T22:42:56Z",
        "git_url": "git://github.com/distri/util.git",
        "ssh_url": "git@github.com:distri/util.git",
        "clone_url": "https://github.com/distri/util.git",
        "svn_url": "https://github.com/distri/util",
        "homepage": null,
        "size": 0,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": null,
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.1.0",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});