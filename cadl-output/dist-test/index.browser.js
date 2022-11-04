(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getDefaultExportFromNamespaceIfPresent (n) {
		return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
	}

	function getDefaultExportFromNamespaceIfNotNamed (n) {
		return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
	}

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	function commonjsRequire (path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var chai$7 = {};

	/*!
	 * assertion-error
	 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
	 * MIT Licensed
	 */

	/*!
	 * Return a function that will copy properties from
	 * one object to another excluding any originally
	 * listed. Returned function will create a new `{}`.
	 *
	 * @param {String} excluded properties ...
	 * @return {Function}
	 */

	function exclude () {
	  var excludes = [].slice.call(arguments);

	  function excludeProps (res, obj) {
	    Object.keys(obj).forEach(function (key) {
	      if (!~excludes.indexOf(key)) res[key] = obj[key];
	    });
	  }

	  return function extendExclude () {
	    var args = [].slice.call(arguments)
	      , i = 0
	      , res = {};

	    for (; i < args.length; i++) {
	      excludeProps(res, args[i]);
	    }

	    return res;
	  };
	};

	/*!
	 * Primary Exports
	 */

	var assertionError = AssertionError$2;

	/**
	 * ### AssertionError
	 *
	 * An extension of the JavaScript `Error` constructor for
	 * assertion and validation scenarios.
	 *
	 * @param {String} message
	 * @param {Object} properties to include (optional)
	 * @param {callee} start stack function (optional)
	 */

	function AssertionError$2 (message, _props, ssf) {
	  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
	    , props = extend(_props || {});

	  // default values
	  this.message = message || 'Unspecified AssertionError';
	  this.showDiff = false;

	  // copy from properties
	  for (var key in props) {
	    this[key] = props[key];
	  }

	  // capture stack trace
	  ssf = ssf || AssertionError$2;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, ssf);
	  } else {
	    try {
	      throw new Error();
	    } catch(e) {
	      this.stack = e.stack;
	    }
	  }
	}

	/*!
	 * Inherit from Error.prototype
	 */

	AssertionError$2.prototype = Object.create(Error.prototype);

	/*!
	 * Statically set name
	 */

	AssertionError$2.prototype.name = 'AssertionError';

	/*!
	 * Ensure correct constructor
	 */

	AssertionError$2.prototype.constructor = AssertionError$2;

	/**
	 * Allow errors to be converted to JSON for static transfer.
	 *
	 * @param {Boolean} include stack (default: `true`)
	 * @return {Object} object that can be `JSON.stringify`
	 */

	AssertionError$2.prototype.toJSON = function (stack) {
	  var extend = exclude('constructor', 'toJSON', 'stack')
	    , props = extend({ name: this.name }, this);

	  // include stack if exists and not turned off
	  if (false !== stack && this.stack) {
	    props.stack = this.stack;
	  }

	  return props;
	};

	var utils = {};

	'use strict';

	/* !
	 * Chai - pathval utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * @see https://github.com/logicalparadox/filtr
	 * MIT Licensed
	 */

	/**
	 * ### .hasProperty(object, name)
	 *
	 * This allows checking whether an object has own
	 * or inherited from prototype chain named property.
	 *
	 * Basically does the same thing as the `in`
	 * operator but works properly with null/undefined values
	 * and other primitives.
	 *
	 *     var obj = {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     hasProperty(obj, 'str');  // true
	 *     hasProperty(obj, 'constructor');  // true
	 *     hasProperty(obj, 'bar');  // false
	 *
	 *     hasProperty(obj.str, 'length'); // true
	 *     hasProperty(obj.str, 1);  // true
	 *     hasProperty(obj.str, 5);  // false
	 *
	 *     hasProperty(obj.arr, 'length');  // true
	 *     hasProperty(obj.arr, 2);  // true
	 *     hasProperty(obj.arr, 3);  // false
	 *
	 * @param {Object} object
	 * @param {String|Symbol} name
	 * @returns {Boolean} whether it exists
	 * @namespace Utils
	 * @name hasProperty
	 * @api public
	 */

	function hasProperty$1(obj, name) {
	  if (typeof obj === 'undefined' || obj === null) {
	    return false;
	  }

	  // The `in` operator does not work with primitives.
	  return name in Object(obj);
	}

	/* !
	 * ## parsePath(path)
	 *
	 * Helper function used to parse string object
	 * paths. Use in conjunction with `internalGetPathValue`.
	 *
	 *      var parsed = parsePath('myobject.property.subprop');
	 *
	 * ### Paths:
	 *
	 * * Can be infinitely deep and nested.
	 * * Arrays are also valid using the formal `myobject.document[3].property`.
	 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
	 *
	 * @param {String} path
	 * @returns {Object} parsed
	 * @api private
	 */

	function parsePath(path) {
	  var str = path.replace(/([^\\])\[/g, '$1.[');
	  var parts = str.match(/(\\\.|[^.]+?)+/g);
	  return parts.map(function mapMatches(value) {
	    if (
	      value === 'constructor' ||
	      value === '__proto__' ||
	      value === 'prototype'
	    ) {
	      return {};
	    }
	    var regexp = /^\[(\d+)\]$/;
	    var mArr = regexp.exec(value);
	    var parsed = null;
	    if (mArr) {
	      parsed = { i: parseFloat(mArr[1]) };
	    } else {
	      parsed = { p: value.replace(/\\([.[\]])/g, '$1') };
	    }

	    return parsed;
	  });
	}

	/* !
	 * ## internalGetPathValue(obj, parsed[, pathDepth])
	 *
	 * Helper companion function for `.parsePath` that returns
	 * the value located at the parsed address.
	 *
	 *      var value = getPathValue(obj, parsed);
	 *
	 * @param {Object} object to search against
	 * @param {Object} parsed definition from `parsePath`.
	 * @param {Number} depth (nesting level) of the property we want to retrieve
	 * @returns {Object|Undefined} value
	 * @api private
	 */

	function internalGetPathValue(obj, parsed, pathDepth) {
	  var temporaryValue = obj;
	  var res = null;
	  pathDepth = typeof pathDepth === 'undefined' ? parsed.length : pathDepth;

	  for (var i = 0; i < pathDepth; i++) {
	    var part = parsed[i];
	    if (temporaryValue) {
	      if (typeof part.p === 'undefined') {
	        temporaryValue = temporaryValue[part.i];
	      } else {
	        temporaryValue = temporaryValue[part.p];
	      }

	      if (i === pathDepth - 1) {
	        res = temporaryValue;
	      }
	    }
	  }

	  return res;
	}

	/* !
	 * ## internalSetPathValue(obj, value, parsed)
	 *
	 * Companion function for `parsePath` that sets
	 * the value located at a parsed address.
	 *
	 *  internalSetPathValue(obj, 'value', parsed);
	 *
	 * @param {Object} object to search and define on
	 * @param {*} value to use upon set
	 * @param {Object} parsed definition from `parsePath`
	 * @api private
	 */

	function internalSetPathValue(obj, val, parsed) {
	  var tempObj = obj;
	  var pathDepth = parsed.length;
	  var part = null;
	  // Here we iterate through every part of the path
	  for (var i = 0; i < pathDepth; i++) {
	    var propName = null;
	    var propVal = null;
	    part = parsed[i];

	    // If it's the last part of the path, we set the 'propName' value with the property name
	    if (i === pathDepth - 1) {
	      propName = typeof part.p === 'undefined' ? part.i : part.p;
	      // Now we set the property with the name held by 'propName' on object with the desired val
	      tempObj[propName] = val;
	    } else if (typeof part.p !== 'undefined' && tempObj[part.p]) {
	      tempObj = tempObj[part.p];
	    } else if (typeof part.i !== 'undefined' && tempObj[part.i]) {
	      tempObj = tempObj[part.i];
	    } else {
	      // If the obj doesn't have the property we create one with that name to define it
	      var next = parsed[i + 1];
	      // Here we set the name of the property which will be defined
	      propName = typeof part.p === 'undefined' ? part.i : part.p;
	      // Here we decide if this property will be an array or a new object
	      propVal = typeof next.p === 'undefined' ? [] : {};
	      tempObj[propName] = propVal;
	      tempObj = tempObj[propName];
	    }
	  }
	}

	/**
	 * ### .getPathInfo(object, path)
	 *
	 * This allows the retrieval of property info in an
	 * object given a string path.
	 *
	 * The path info consists of an object with the
	 * following properties:
	 *
	 * * parent - The parent object of the property referenced by `path`
	 * * name - The name of the final property, a number if it was an array indexer
	 * * value - The value of the property, if it exists, otherwise `undefined`
	 * * exists - Whether the property exists or not
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @returns {Object} info
	 * @namespace Utils
	 * @name getPathInfo
	 * @api public
	 */

	function getPathInfo$1(obj, path) {
	  var parsed = parsePath(path);
	  var last = parsed[parsed.length - 1];
	  var info = {
	    parent:
	      parsed.length > 1 ?
	        internalGetPathValue(obj, parsed, parsed.length - 1) :
	        obj,
	    name: last.p || last.i,
	    value: internalGetPathValue(obj, parsed),
	  };
	  info.exists = hasProperty$1(info.parent, info.name);

	  return info;
	}

	/**
	 * ### .getPathValue(object, path)
	 *
	 * This allows the retrieval of values in an
	 * object given a string path.
	 *
	 *     var obj = {
	 *         prop1: {
	 *             arr: ['a', 'b', 'c']
	 *           , str: 'Hello'
	 *         }
	 *       , prop2: {
	 *             arr: [ { nested: 'Universe' } ]
	 *           , str: 'Hello again!'
	 *         }
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     getPathValue(obj, 'prop1.str'); // Hello
	 *     getPathValue(obj, 'prop1.att[2]'); // b
	 *     getPathValue(obj, 'prop2.arr[0].nested'); // Universe
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @returns {Object} value or `undefined`
	 * @namespace Utils
	 * @name getPathValue
	 * @api public
	 */

	function getPathValue(obj, path) {
	  var info = getPathInfo$1(obj, path);
	  return info.value;
	}

	/**
	 * ### .setPathValue(object, path, value)
	 *
	 * Define the value in an object at a given string path.
	 *
	 * ```js
	 * var obj = {
	 *     prop1: {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *   , prop2: {
	 *         arr: [ { nested: 'Universe' } ]
	 *       , str: 'Hello again!'
	 *     }
	 * };
	 * ```
	 *
	 * The following would be acceptable.
	 *
	 * ```js
	 * var properties = require('tea-properties');
	 * properties.set(obj, 'prop1.str', 'Hello Universe!');
	 * properties.set(obj, 'prop1.arr[2]', 'B');
	 * properties.set(obj, 'prop2.arr[0].nested.value', { hello: 'universe' });
	 * ```
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @param {Mixed} value
	 * @api private
	 */

	function setPathValue(obj, path, val) {
	  var parsed = parsePath(path);
	  internalSetPathValue(obj, val, parsed);
	  return obj;
	}

	var pathval$1 = {
	  hasProperty: hasProperty$1,
	  getPathInfo: getPathInfo$1,
	  getPathValue: getPathValue,
	  setPathValue: setPathValue,
	};

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .flag(object, key, [value])
	 *
	 * Get or set a flag value on an object. If a
	 * value is provided it will be set, else it will
	 * return the currently set value or `undefined` if
	 * the value is not set.
	 *
	 *     utils.flag(this, 'foo', 'bar'); // setter
	 *     utils.flag(this, 'foo'); // getter, returns `bar`
	 *
	 * @param {Object} object constructed Assertion
	 * @param {String} key
	 * @param {Mixed} value (optional)
	 * @namespace Utils
	 * @name flag
	 * @api private
	 */

	var flag$b = function flag(obj, key, value) {
	  var flags = obj.__flags || (obj.__flags = Object.create(null));
	  if (arguments.length === 3) {
	    flags[key] = value;
	  } else {
	    return flags[key];
	  }
	};

	/*!
	 * Chai - test utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var flag$a = flag$b;

	/**
	 * ### .test(object, expression)
	 *
	 * Test and object for expression.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name test
	 */

	var test$1 = function test(obj, args) {
	  var negate = flag$a(obj, 'negate')
	    , expr = args[0];
	  return negate ? !expr : expr;
	};

	var typeDetect$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
		'object' === 'object' && 'object' !== 'undefined' ? module.exports = factory() :
		typeof undefined === 'function' && undefined.amd ? undefined(factory) :
		(global.typeDetect = factory());
	}(commonjsGlobal, (function () { 'use strict';

	/* !
	 * type-detect
	 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */
	var promiseExists = typeof Promise === 'function';

	/* eslint-disable no-undef */
	var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

	var symbolExists = typeof Symbol !== 'undefined';
	var mapExists = typeof Map !== 'undefined';
	var setExists = typeof Set !== 'undefined';
	var weakMapExists = typeof WeakMap !== 'undefined';
	var weakSetExists = typeof WeakSet !== 'undefined';
	var dataViewExists = typeof DataView !== 'undefined';
	var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
	var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
	var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
	var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
	var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
	var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
	var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
	var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
	var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
	var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
	var toStringLeftSliceLength = 8;
	var toStringRightSliceLength = -1;
	/**
	 * ### typeOf (obj)
	 *
	 * Uses `Object.prototype.toString` to determine the type of an object,
	 * normalising behaviour across engine versions & well optimised.
	 *
	 * @param {Mixed} object
	 * @return {String} object type
	 * @api public
	 */
	function typeDetect(obj) {
	  /* ! Speed optimisation
	   * Pre:
	   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
	   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
	   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
	   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
	   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
	   * Post:
	   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
	   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
	   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
	   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
	   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
	   */
	  var typeofObj = typeof obj;
	  if (typeofObj !== 'object') {
	    return typeofObj;
	  }

	  /* ! Speed optimisation
	   * Pre:
	   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
	   * Post:
	   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
	   */
	  if (obj === null) {
	    return 'null';
	  }

	  /* ! Spec Conformance
	   * Test: `Object.prototype.toString.call(window)``
	   *  - Node === "[object global]"
	   *  - Chrome === "[object global]"
	   *  - Firefox === "[object Window]"
	   *  - PhantomJS === "[object Window]"
	   *  - Safari === "[object Window]"
	   *  - IE 11 === "[object Window]"
	   *  - IE Edge === "[object Window]"
	   * Test: `Object.prototype.toString.call(this)``
	   *  - Chrome Worker === "[object global]"
	   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
	   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
	   *  - IE 11 Worker === "[object WorkerGlobalScope]"
	   *  - IE Edge Worker === "[object WorkerGlobalScope]"
	   */
	  if (obj === globalObject) {
	    return 'global';
	  }

	  /* ! Speed optimisation
	   * Pre:
	   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
	   * Post:
	   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
	   */
	  if (
	    Array.isArray(obj) &&
	    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
	  ) {
	    return 'Array';
	  }

	  // Not caching existence of `window` and related properties due to potential
	  // for `window` to be unset before tests in quasi-browser environments.
	  if (typeof window === 'object' && window !== null) {
	    /* ! Spec Conformance
	     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
	     * WhatWG HTML$7.7.3 - The `Location` interface
	     * Test: `Object.prototype.toString.call(window.location)``
	     *  - IE <=11 === "[object Object]"
	     *  - IE Edge <=13 === "[object Object]"
	     */
	    if (typeof window.location === 'object' && obj === window.location) {
	      return 'Location';
	    }

	    /* ! Spec Conformance
	     * (https://html.spec.whatwg.org/#document)
	     * WhatWG HTML$3.1.1 - The `Document` object
	     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
	     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
	     *       which suggests that browsers should use HTMLTableCellElement for
	     *       both TD and TH elements. WhatWG separates these.
	     *       WhatWG HTML states:
	     *         > For historical reasons, Window objects must also have a
	     *         > writable, configurable, non-enumerable property named
	     *         > HTMLDocument whose value is the Document interface object.
	     * Test: `Object.prototype.toString.call(document)``
	     *  - Chrome === "[object HTMLDocument]"
	     *  - Firefox === "[object HTMLDocument]"
	     *  - Safari === "[object HTMLDocument]"
	     *  - IE <=10 === "[object Document]"
	     *  - IE 11 === "[object HTMLDocument]"
	     *  - IE Edge <=13 === "[object HTMLDocument]"
	     */
	    if (typeof window.document === 'object' && obj === window.document) {
	      return 'Document';
	    }

	    if (typeof window.navigator === 'object') {
	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
	       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
	       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
	       *  - IE <=10 === "[object MSMimeTypesCollection]"
	       */
	      if (typeof window.navigator.mimeTypes === 'object' &&
	          obj === window.navigator.mimeTypes) {
	        return 'MimeTypeArray';
	      }

	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
	       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
	       * Test: `Object.prototype.toString.call(navigator.plugins)``
	       *  - IE <=10 === "[object MSPluginsCollection]"
	       */
	      if (typeof window.navigator.plugins === 'object' &&
	          obj === window.navigator.plugins) {
	        return 'PluginArray';
	      }
	    }

	    if ((typeof window.HTMLElement === 'function' ||
	        typeof window.HTMLElement === 'object') &&
	        obj instanceof window.HTMLElement) {
	      /* ! Spec Conformance
	      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
	      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
	      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
	      *  - IE <=10 === "[object HTMLBlockElement]"
	      */
	      if (obj.tagName === 'BLOCKQUOTE') {
	        return 'HTMLQuoteElement';
	      }

	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
	       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
	       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
	       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
	       *       which suggests that browsers should use HTMLTableCellElement for
	       *       both TD and TH elements. WhatWG separates these.
	       * Test: Object.prototype.toString.call(document.createElement('td'))
	       *  - Chrome === "[object HTMLTableCellElement]"
	       *  - Firefox === "[object HTMLTableCellElement]"
	       *  - Safari === "[object HTMLTableCellElement]"
	       */
	      if (obj.tagName === 'TD') {
	        return 'HTMLTableDataCellElement';
	      }

	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
	       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
	       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
	       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
	       *       which suggests that browsers should use HTMLTableCellElement for
	       *       both TD and TH elements. WhatWG separates these.
	       * Test: Object.prototype.toString.call(document.createElement('th'))
	       *  - Chrome === "[object HTMLTableCellElement]"
	       *  - Firefox === "[object HTMLTableCellElement]"
	       *  - Safari === "[object HTMLTableCellElement]"
	       */
	      if (obj.tagName === 'TH') {
	        return 'HTMLTableHeaderCellElement';
	      }
	    }
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
	  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
	  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
	  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
	  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
	  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
	  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
	  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
	  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
	  * Post:
	  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
	  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
	  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
	  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
	  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
	  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
	  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
	  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
	  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
	  */
	  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
	  if (typeof stringTag === 'string') {
	    return stringTag;
	  }

	  var objPrototype = Object.getPrototypeOf(obj);
	  /* ! Speed optimisation
	  * Pre:
	  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
	  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
	  * Post:
	  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
	  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
	  */
	  if (objPrototype === RegExp.prototype) {
	    return 'RegExp';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
	  * Post:
	  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
	  */
	  if (objPrototype === Date.prototype) {
	    return 'Date';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
	   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
	   * Test: `Object.prototype.toString.call(Promise.resolve())``
	   *  - Chrome <=47 === "[object Object]"
	   *  - Edge <=20 === "[object Object]"
	   *  - Firefox 29-Latest === "[object Promise]"
	   *  - Safari 7.1-Latest === "[object Promise]"
	   */
	  if (promiseExists && objPrototype === Promise.prototype) {
	    return 'Promise';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
	  * Post:
	  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
	  */
	  if (setExists && objPrototype === Set.prototype) {
	    return 'Set';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
	  * Post:
	  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
	  */
	  if (mapExists && objPrototype === Map.prototype) {
	    return 'Map';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
	  * Post:
	  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
	  */
	  if (weakSetExists && objPrototype === WeakSet.prototype) {
	    return 'WeakSet';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
	  * Post:
	  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
	  */
	  if (weakMapExists && objPrototype === WeakMap.prototype) {
	    return 'WeakMap';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
	   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
	   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (dataViewExists && objPrototype === DataView.prototype) {
	    return 'DataView';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
	   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
	   * Test: `Object.prototype.toString.call(new Map().entries())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (mapExists && objPrototype === mapIteratorPrototype) {
	    return 'Map Iterator';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
	   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
	   * Test: `Object.prototype.toString.call(new Set().entries())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (setExists && objPrototype === setIteratorPrototype) {
	    return 'Set Iterator';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
	   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
	   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
	    return 'Array Iterator';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
	   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
	   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
	    return 'String Iterator';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
	  * Post:
	  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
	  */
	  if (objPrototype === null) {
	    return 'Object';
	  }

	  return Object
	    .prototype
	    .toString
	    .call(obj)
	    .slice(toStringLeftSliceLength, toStringRightSliceLength);
	}

	return typeDetect;

	})));
	}(typeDetect$1, typeDetect$1.exports));

	var typeDetect = typeDetect$1.exports;

	/*!
	 * Chai - expectTypes utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .expectTypes(obj, types)
	 *
	 * Ensures that the object being tested against is of a valid type.
	 *
	 *     utils.expectTypes(this, ['array', 'object', 'string']);
	 *
	 * @param {Mixed} obj constructed Assertion
	 * @param {Array} type A list of allowed types for this assertion
	 * @namespace Utils
	 * @name expectTypes
	 * @api public
	 */

	var AssertionError$1 = assertionError;
	var flag$9 = flag$b;
	var type$3 = typeDetect$1.exports;

	var expectTypes$1 = function expectTypes(obj, types) {
	  var flagMsg = flag$9(obj, 'message');
	  var ssfi = flag$9(obj, 'ssfi');

	  flagMsg = flagMsg ? flagMsg + ': ' : '';

	  obj = flag$9(obj, 'object');
	  types = types.map(function (t) { return t.toLowerCase(); });
	  types.sort();

	  // Transforms ['lorem', 'ipsum'] into 'a lorem, or an ipsum'
	  var str = types.map(function (t, index) {
	    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
	    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
	    return or + art + ' ' + t;
	  }).join(', ');

	  var objType = type$3(obj).toLowerCase();

	  if (!types.some(function (expected) { return objType === expected; })) {
	    throw new AssertionError$1(
	      flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given',
	      undefined,
	      ssfi
	    );
	  }
	};

	/*!
	 * Chai - getActual utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getActual(object, [actual])
	 *
	 * Returns the `actual` value for an Assertion.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getActual
	 */

	var getActual$2 = function getActual(obj, args) {
	  return args.length > 4 ? args[4] : obj._obj;
	};

	'use strict';

	/* !
	 * Chai - getFuncName utility
	 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getFuncName(constructorFn)
	 *
	 * Returns the name of a function.
	 * When a non-function instance is passed, returns `null`.
	 * This also includes a polyfill function if `aFunc.name` is not defined.
	 *
	 * @name getFuncName
	 * @param {Function} funct
	 * @namespace Utils
	 * @api public
	 */

	var toString = Function.prototype.toString;
	var functionNameMatch$1 = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
	function getFuncName(aFunc) {
	  if (typeof aFunc !== 'function') {
	    return null;
	  }

	  var name = '';
	  if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
	    // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
	    var match = toString.call(aFunc).match(functionNameMatch$1);
	    if (match) {
	      name = match[1];
	    }
	  } else {
	    // If we've got a `name` property we just use it
	    name = aFunc.name;
	  }

	  return name;
	}

	var getFuncName_1 = getFuncName;

	var loupe$2 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	  'object' === 'object' && 'object' !== 'undefined' ? factory(exports) :
	  typeof undefined === 'function' && undefined.amd ? undefined(['exports'], factory) :
	  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.loupe = {}));
	}(commonjsGlobal, (function (exports) { 'use strict';

	  function _typeof(obj) {
	    "@babel/helpers - typeof";

	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function (obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function (obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _slicedToArray(arr, i) {
	    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	  }

	  function _arrayWithHoles(arr) {
	    if (Array.isArray(arr)) return arr;
	  }

	  function _iterableToArrayLimit(arr, i) {
	    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"] != null) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  function _unsupportedIterableToArray(o, minLen) {
	    if (!o) return;
	    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	    var n = Object.prototype.toString.call(o).slice(8, -1);
	    if (n === "Object" && o.constructor) n = o.constructor.name;
	    if (n === "Map" || n === "Set") return Array.from(o);
	    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	  }

	  function _arrayLikeToArray(arr, len) {
	    if (len == null || len > arr.length) len = arr.length;

	    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	    return arr2;
	  }

	  function _nonIterableRest() {
	    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var ansiColors = {
	    bold: ['1', '22'],
	    dim: ['2', '22'],
	    italic: ['3', '23'],
	    underline: ['4', '24'],
	    // 5 & 6 are blinking
	    inverse: ['7', '27'],
	    hidden: ['8', '28'],
	    strike: ['9', '29'],
	    // 10-20 are fonts
	    // 21-29 are resets for 1-9
	    black: ['30', '39'],
	    red: ['31', '39'],
	    green: ['32', '39'],
	    yellow: ['33', '39'],
	    blue: ['34', '39'],
	    magenta: ['35', '39'],
	    cyan: ['36', '39'],
	    white: ['37', '39'],
	    brightblack: ['30;1', '39'],
	    brightred: ['31;1', '39'],
	    brightgreen: ['32;1', '39'],
	    brightyellow: ['33;1', '39'],
	    brightblue: ['34;1', '39'],
	    brightmagenta: ['35;1', '39'],
	    brightcyan: ['36;1', '39'],
	    brightwhite: ['37;1', '39'],
	    grey: ['90', '39']
	  };
	  var styles = {
	    special: 'cyan',
	    number: 'yellow',
	    bigint: 'yellow',
	    boolean: 'yellow',
	    undefined: 'grey',
	    null: 'bold',
	    string: 'green',
	    symbol: 'green',
	    date: 'magenta',
	    regexp: 'red'
	  };
	  var truncator = '…';

	  function colorise(value, styleType) {
	    var color = ansiColors[styles[styleType]] || ansiColors[styleType];

	    if (!color) {
	      return String(value);
	    }

	    return "\x1B[".concat(color[0], "m").concat(String(value), "\x1B[").concat(color[1], "m");
	  }

	  function normaliseOptions() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$showHidden = _ref.showHidden,
	        showHidden = _ref$showHidden === void 0 ? false : _ref$showHidden,
	        _ref$depth = _ref.depth,
	        depth = _ref$depth === void 0 ? 2 : _ref$depth,
	        _ref$colors = _ref.colors,
	        colors = _ref$colors === void 0 ? false : _ref$colors,
	        _ref$customInspect = _ref.customInspect,
	        customInspect = _ref$customInspect === void 0 ? true : _ref$customInspect,
	        _ref$showProxy = _ref.showProxy,
	        showProxy = _ref$showProxy === void 0 ? false : _ref$showProxy,
	        _ref$maxArrayLength = _ref.maxArrayLength,
	        maxArrayLength = _ref$maxArrayLength === void 0 ? Infinity : _ref$maxArrayLength,
	        _ref$breakLength = _ref.breakLength,
	        breakLength = _ref$breakLength === void 0 ? Infinity : _ref$breakLength,
	        _ref$seen = _ref.seen,
	        seen = _ref$seen === void 0 ? [] : _ref$seen,
	        _ref$truncate = _ref.truncate,
	        truncate = _ref$truncate === void 0 ? Infinity : _ref$truncate,
	        _ref$stylize = _ref.stylize,
	        stylize = _ref$stylize === void 0 ? String : _ref$stylize;

	    var options = {
	      showHidden: Boolean(showHidden),
	      depth: Number(depth),
	      colors: Boolean(colors),
	      customInspect: Boolean(customInspect),
	      showProxy: Boolean(showProxy),
	      maxArrayLength: Number(maxArrayLength),
	      breakLength: Number(breakLength),
	      truncate: Number(truncate),
	      seen: seen,
	      stylize: stylize
	    };

	    if (options.colors) {
	      options.stylize = colorise;
	    }

	    return options;
	  }
	  function truncate(string, length) {
	    var tail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : truncator;
	    string = String(string);
	    var tailLength = tail.length;
	    var stringLength = string.length;

	    if (tailLength > length && stringLength > tailLength) {
	      return tail;
	    }

	    if (stringLength > length && stringLength > tailLength) {
	      return "".concat(string.slice(0, length - tailLength)).concat(tail);
	    }

	    return string;
	  } // eslint-disable-next-line complexity

	  function inspectList(list, options, inspectItem) {
	    var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ', ';
	    inspectItem = inspectItem || options.inspect;
	    var size = list.length;
	    if (size === 0) return '';
	    var originalLength = options.truncate;
	    var output = '';
	    var peek = '';
	    var truncated = '';

	    for (var i = 0; i < size; i += 1) {
	      var last = i + 1 === list.length;
	      var secondToLast = i + 2 === list.length;
	      truncated = "".concat(truncator, "(").concat(list.length - i, ")");
	      var value = list[i]; // If there is more than one remaining we need to account for a separator of `, `

	      options.truncate = originalLength - output.length - (last ? 0 : separator.length);
	      var string = peek || inspectItem(value, options) + (last ? '' : separator);
	      var nextLength = output.length + string.length;
	      var truncatedLength = nextLength + truncated.length; // If this is the last element, and adding it would
	      // take us over length, but adding the truncator wouldn't - then break now

	      if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
	        break;
	      } // If this isn't the last or second to last element to scan,
	      // but the string is already over length then break here


	      if (!last && !secondToLast && truncatedLength > originalLength) {
	        break;
	      } // Peek at the next string to determine if we should
	      // break early before adding this item to the output


	      peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator); // If we have one element left, but this element and
	      // the next takes over length, the break early

	      if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
	        break;
	      }

	      output += string; // If the next element takes us to length -
	      // but there are more after that, then we should truncate now

	      if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
	        truncated = "".concat(truncator, "(").concat(list.length - i - 1, ")");
	        break;
	      }

	      truncated = '';
	    }

	    return "".concat(output).concat(truncated);
	  }

	  function quoteComplexKey(key) {
	    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
	      return key;
	    }

	    return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	  }

	  function inspectProperty(_ref2, options) {
	    var _ref3 = _slicedToArray(_ref2, 2),
	        key = _ref3[0],
	        value = _ref3[1];

	    options.truncate -= 2;

	    if (typeof key === 'string') {
	      key = quoteComplexKey(key);
	    } else if (typeof key !== 'number') {
	      key = "[".concat(options.inspect(key, options), "]");
	    }

	    options.truncate -= key.length;
	    value = options.inspect(value, options);
	    return "".concat(key, ": ").concat(value);
	  }

	  function inspectArray(array, options) {
	    // Object.keys will always output the Array indices first, so we can slice by
	    // `array.length` to get non-index properties
	    var nonIndexProperties = Object.keys(array).slice(array.length);
	    if (!array.length && !nonIndexProperties.length) return '[]';
	    options.truncate -= 4;
	    var listContents = inspectList(array, options);
	    options.truncate -= listContents.length;
	    var propertyContents = '';

	    if (nonIndexProperties.length) {
	      propertyContents = inspectList(nonIndexProperties.map(function (key) {
	        return [key, array[key]];
	      }), options, inspectProperty);
	    }

	    return "[ ".concat(listContents).concat(propertyContents ? ", ".concat(propertyContents) : '', " ]");
	  }

	  /* !
	   * Chai - getFuncName utility
	   * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	   * MIT Licensed
	   */

	  /**
	   * ### .getFuncName(constructorFn)
	   *
	   * Returns the name of a function.
	   * When a non-function instance is passed, returns `null`.
	   * This also includes a polyfill function if `aFunc.name` is not defined.
	   *
	   * @name getFuncName
	   * @param {Function} funct
	   * @namespace Utils
	   * @api public
	   */

	  var toString = Function.prototype.toString;
	  var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
	  function getFuncName(aFunc) {
	    if (typeof aFunc !== 'function') {
	      return null;
	    }

	    var name = '';
	    if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
	      // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
	      var match = toString.call(aFunc).match(functionNameMatch);
	      if (match) {
	        name = match[1];
	      }
	    } else {
	      // If we've got a `name` property we just use it
	      name = aFunc.name;
	    }

	    return name;
	  }

	  var getFuncName_1 = getFuncName;

	  var getArrayName = function getArrayName(array) {
	    // We need to special case Node.js' Buffers, which report to be Uint8Array
	    if (typeof Buffer === 'function' && array instanceof Buffer) {
	      return 'Buffer';
	    }

	    if (array[Symbol.toStringTag]) {
	      return array[Symbol.toStringTag];
	    }

	    return getFuncName_1(array.constructor);
	  };

	  function inspectTypedArray(array, options) {
	    var name = getArrayName(array);
	    options.truncate -= name.length + 4; // Object.keys will always output the Array indices first, so we can slice by
	    // `array.length` to get non-index properties

	    var nonIndexProperties = Object.keys(array).slice(array.length);
	    if (!array.length && !nonIndexProperties.length) return "".concat(name, "[]"); // As we know TypedArrays only contain Unsigned Integers, we can skip inspecting each one and simply
	    // stylise the toString() value of them

	    var output = '';

	    for (var i = 0; i < array.length; i++) {
	      var string = "".concat(options.stylize(truncate(array[i], options.truncate), 'number')).concat(i === array.length - 1 ? '' : ', ');
	      options.truncate -= string.length;

	      if (array[i] !== array.length && options.truncate <= 3) {
	        output += "".concat(truncator, "(").concat(array.length - array[i] + 1, ")");
	        break;
	      }

	      output += string;
	    }

	    var propertyContents = '';

	    if (nonIndexProperties.length) {
	      propertyContents = inspectList(nonIndexProperties.map(function (key) {
	        return [key, array[key]];
	      }), options, inspectProperty);
	    }

	    return "".concat(name, "[ ").concat(output).concat(propertyContents ? ", ".concat(propertyContents) : '', " ]");
	  }

	  function inspectDate(dateObject, options) {
	    // If we need to - truncate the time portion, but never the date
	    var split = dateObject.toJSON().split('T');
	    var date = split[0];
	    return options.stylize("".concat(date, "T").concat(truncate(split[1], options.truncate - date.length - 1)), 'date');
	  }

	  function inspectFunction(func, options) {
	    var name = getFuncName_1(func);

	    if (!name) {
	      return options.stylize('[Function]', 'special');
	    }

	    return options.stylize("[Function ".concat(truncate(name, options.truncate - 11), "]"), 'special');
	  }

	  function inspectMapEntry(_ref, options) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        key = _ref2[0],
	        value = _ref2[1];

	    options.truncate -= 4;
	    key = options.inspect(key, options);
	    options.truncate -= key.length;
	    value = options.inspect(value, options);
	    return "".concat(key, " => ").concat(value);
	  } // IE11 doesn't support `map.entries()`


	  function mapToEntries(map) {
	    var entries = [];
	    map.forEach(function (value, key) {
	      entries.push([key, value]);
	    });
	    return entries;
	  }

	  function inspectMap(map, options) {
	    var size = map.size - 1;

	    if (size <= 0) {
	      return 'Map{}';
	    }

	    options.truncate -= 7;
	    return "Map{ ".concat(inspectList(mapToEntries(map), options, inspectMapEntry), " }");
	  }

	  var isNaN = Number.isNaN || function (i) {
	    return i !== i;
	  }; // eslint-disable-line no-self-compare


	  function inspectNumber(number, options) {
	    if (isNaN(number)) {
	      return options.stylize('NaN', 'number');
	    }

	    if (number === Infinity) {
	      return options.stylize('Infinity', 'number');
	    }

	    if (number === -Infinity) {
	      return options.stylize('-Infinity', 'number');
	    }

	    if (number === 0) {
	      return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number');
	    }

	    return options.stylize(truncate(number, options.truncate), 'number');
	  }

	  function inspectBigInt(number, options) {
	    var nums = truncate(number.toString(), options.truncate - 1);
	    if (nums !== truncator) nums += 'n';
	    return options.stylize(nums, 'bigint');
	  }

	  function inspectRegExp(value, options) {
	    var flags = value.toString().split('/')[2];
	    var sourceLength = options.truncate - (2 + flags.length);
	    var source = value.source;
	    return options.stylize("/".concat(truncate(source, sourceLength), "/").concat(flags), 'regexp');
	  }

	  function arrayFromSet(set) {
	    var values = [];
	    set.forEach(function (value) {
	      values.push(value);
	    });
	    return values;
	  }

	  function inspectSet(set, options) {
	    if (set.size === 0) return 'Set{}';
	    options.truncate -= 7;
	    return "Set{ ".concat(inspectList(arrayFromSet(set), options), " }");
	  }

	  var stringEscapeChars = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5" + "\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", 'g');
	  var escapeCharacters = {
	    '\b': '\\b',
	    '\t': '\\t',
	    '\n': '\\n',
	    '\f': '\\f',
	    '\r': '\\r',
	    "'": "\\'",
	    '\\': '\\\\'
	  };
	  var hex = 16;
	  var unicodeLength = 4;

	  function escape(char) {
	    return escapeCharacters[char] || "\\u".concat("0000".concat(char.charCodeAt(0).toString(hex)).slice(-unicodeLength));
	  }

	  function inspectString(string, options) {
	    if (stringEscapeChars.test(string)) {
	      string = string.replace(stringEscapeChars, escape);
	    }

	    return options.stylize("'".concat(truncate(string, options.truncate - 2), "'"), 'string');
	  }

	  function inspectSymbol(value) {
	    if ('description' in Symbol.prototype) {
	      return value.description ? "Symbol(".concat(value.description, ")") : 'Symbol()';
	    }

	    return value.toString();
	  }

	  var getPromiseValue = function getPromiseValue() {
	    return 'Promise{…}';
	  };

	  try {
	    var _process$binding = process.binding('util'),
	        getPromiseDetails = _process$binding.getPromiseDetails,
	        kPending = _process$binding.kPending,
	        kRejected = _process$binding.kRejected;

	    if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
	      getPromiseValue = function getPromiseValue(value, options) {
	        var _getPromiseDetails = getPromiseDetails(value),
	            _getPromiseDetails2 = _slicedToArray(_getPromiseDetails, 2),
	            state = _getPromiseDetails2[0],
	            innerValue = _getPromiseDetails2[1];

	        if (state === kPending) {
	          return 'Promise{<pending>}';
	        }

	        return "Promise".concat(state === kRejected ? '!' : '', "{").concat(options.inspect(innerValue, options), "}");
	      };
	    }
	  } catch (notNode) {
	    /* ignore */
	  }

	  var inspectPromise = getPromiseValue;

	  function inspectObject(object, options) {
	    var properties = Object.getOwnPropertyNames(object);
	    var symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];

	    if (properties.length === 0 && symbols.length === 0) {
	      return '{}';
	    }

	    options.truncate -= 4;
	    options.seen = options.seen || [];

	    if (options.seen.indexOf(object) >= 0) {
	      return '[Circular]';
	    }

	    options.seen.push(object);
	    var propertyContents = inspectList(properties.map(function (key) {
	      return [key, object[key]];
	    }), options, inspectProperty);
	    var symbolContents = inspectList(symbols.map(function (key) {
	      return [key, object[key]];
	    }), options, inspectProperty);
	    options.seen.pop();
	    var sep = '';

	    if (propertyContents && symbolContents) {
	      sep = ', ';
	    }

	    return "{ ".concat(propertyContents).concat(sep).concat(symbolContents, " }");
	  }

	  var toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;
	  function inspectClass(value, options) {
	    var name = '';

	    if (toStringTag && toStringTag in value) {
	      name = value[toStringTag];
	    }

	    name = name || getFuncName_1(value.constructor); // Babel transforms anonymous classes to the name `_class`

	    if (!name || name === '_class') {
	      name = '<Anonymous Class>';
	    }

	    options.truncate -= name.length;
	    return "".concat(name).concat(inspectObject(value, options));
	  }

	  function inspectArguments(args, options) {
	    if (args.length === 0) return 'Arguments[]';
	    options.truncate -= 13;
	    return "Arguments[ ".concat(inspectList(args, options), " ]");
	  }

	  var errorKeys = ['stack', 'line', 'column', 'name', 'message', 'fileName', 'lineNumber', 'columnNumber', 'number', 'description'];
	  function inspectObject$1(error, options) {
	    var properties = Object.getOwnPropertyNames(error).filter(function (key) {
	      return errorKeys.indexOf(key) === -1;
	    });
	    var name = error.name;
	    options.truncate -= name.length;
	    var message = '';

	    if (typeof error.message === 'string') {
	      message = truncate(error.message, options.truncate);
	    } else {
	      properties.unshift('message');
	    }

	    message = message ? ": ".concat(message) : '';
	    options.truncate -= message.length + 5;
	    var propertyContents = inspectList(properties.map(function (key) {
	      return [key, error[key]];
	    }), options, inspectProperty);
	    return "".concat(name).concat(message).concat(propertyContents ? " { ".concat(propertyContents, " }") : '');
	  }

	  function inspectAttribute(_ref, options) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        key = _ref2[0],
	        value = _ref2[1];

	    options.truncate -= 3;

	    if (!value) {
	      return "".concat(options.stylize(key, 'yellow'));
	    }

	    return "".concat(options.stylize(key, 'yellow'), "=").concat(options.stylize("\"".concat(value, "\""), 'string'));
	  }
	  function inspectHTMLCollection(collection, options) {
	    // eslint-disable-next-line no-use-before-define
	    return inspectList(collection, options, inspectHTML, '\n');
	  }
	  function inspectHTML(element, options) {
	    var properties = element.getAttributeNames();
	    var name = element.tagName.toLowerCase();
	    var head = options.stylize("<".concat(name), 'special');
	    var headClose = options.stylize(">", 'special');
	    var tail = options.stylize("</".concat(name, ">"), 'special');
	    options.truncate -= name.length * 2 + 5;
	    var propertyContents = '';

	    if (properties.length > 0) {
	      propertyContents += ' ';
	      propertyContents += inspectList(properties.map(function (key) {
	        return [key, element.getAttribute(key)];
	      }), options, inspectAttribute, ' ');
	    }

	    options.truncate -= propertyContents.length;
	    var truncate = options.truncate;
	    var children = inspectHTMLCollection(element.children, options);

	    if (children && children.length > truncate) {
	      children = "".concat(truncator, "(").concat(element.children.length, ")");
	    }

	    return "".concat(head).concat(propertyContents).concat(headClose).concat(children).concat(tail);
	  }

	  var symbolsSupported = typeof Symbol === 'function' && typeof Symbol.for === 'function';
	  var chaiInspect = symbolsSupported ? Symbol.for('chai/inspect') : '@@chai/inspect';
	  var nodeInspect = false;

	  try {
	    // eslint-disable-next-line global-require
	    var nodeUtil = require('util');

	    nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
	  } catch (noNodeInspect) {
	    nodeInspect = false;
	  }

	  var constructorMap = new WeakMap();
	  var stringTagMap = {};
	  var baseTypesMap = {
	    undefined: function undefined$1(value, options) {
	      return options.stylize('undefined', 'undefined');
	    },
	    null: function _null(value, options) {
	      return options.stylize(null, 'null');
	    },
	    boolean: function boolean(value, options) {
	      return options.stylize(value, 'boolean');
	    },
	    Boolean: function Boolean(value, options) {
	      return options.stylize(value, 'boolean');
	    },
	    number: inspectNumber,
	    Number: inspectNumber,
	    bigint: inspectBigInt,
	    BigInt: inspectBigInt,
	    string: inspectString,
	    String: inspectString,
	    function: inspectFunction,
	    Function: inspectFunction,
	    symbol: inspectSymbol,
	    // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
	    Symbol: inspectSymbol,
	    Array: inspectArray,
	    Date: inspectDate,
	    Map: inspectMap,
	    Set: inspectSet,
	    RegExp: inspectRegExp,
	    Promise: inspectPromise,
	    // WeakSet, WeakMap are totally opaque to us
	    WeakSet: function WeakSet(value, options) {
	      return options.stylize('WeakSet{…}', 'special');
	    },
	    WeakMap: function WeakMap(value, options) {
	      return options.stylize('WeakMap{…}', 'special');
	    },
	    Arguments: inspectArguments,
	    Int8Array: inspectTypedArray,
	    Uint8Array: inspectTypedArray,
	    Uint8ClampedArray: inspectTypedArray,
	    Int16Array: inspectTypedArray,
	    Uint16Array: inspectTypedArray,
	    Int32Array: inspectTypedArray,
	    Uint32Array: inspectTypedArray,
	    Float32Array: inspectTypedArray,
	    Float64Array: inspectTypedArray,
	    Generator: function Generator() {
	      return '';
	    },
	    DataView: function DataView() {
	      return '';
	    },
	    ArrayBuffer: function ArrayBuffer() {
	      return '';
	    },
	    Error: inspectObject$1,
	    HTMLCollection: inspectHTMLCollection,
	    NodeList: inspectHTMLCollection
	  }; // eslint-disable-next-line complexity

	  var inspectCustom = function inspectCustom(value, options, type) {
	    if (chaiInspect in value && typeof value[chaiInspect] === 'function') {
	      return value[chaiInspect](options);
	    }

	    if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === 'function') {
	      return value[nodeInspect](options.depth, options);
	    }

	    if ('inspect' in value && typeof value.inspect === 'function') {
	      return value.inspect(options.depth, options);
	    }

	    if ('constructor' in value && constructorMap.has(value.constructor)) {
	      return constructorMap.get(value.constructor)(value, options);
	    }

	    if (stringTagMap[type]) {
	      return stringTagMap[type](value, options);
	    }

	    return '';
	  };

	  var toString$1 = Object.prototype.toString; // eslint-disable-next-line complexity

	  function inspect(value, options) {
	    options = normaliseOptions(options);
	    options.inspect = inspect;
	    var _options = options,
	        customInspect = _options.customInspect;
	    var type = value === null ? 'null' : _typeof(value);

	    if (type === 'object') {
	      type = toString$1.call(value).slice(8, -1);
	    } // If it is a base value that we already support, then use Loupe's inspector


	    if (baseTypesMap[type]) {
	      return baseTypesMap[type](value, options);
	    } // If `options.customInspect` is set to true then try to use the custom inspector


	    if (customInspect && value) {
	      var output = inspectCustom(value, options, type);

	      if (output) {
	        if (typeof output === 'string') return output;
	        return inspect(output, options);
	      }
	    }

	    var proto = value ? Object.getPrototypeOf(value) : false; // If it's a plain Object then use Loupe's inspector

	    if (proto === Object.prototype || proto === null) {
	      return inspectObject(value, options);
	    } // Specifically account for HTMLElements
	    // eslint-disable-next-line no-undef


	    if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement) {
	      return inspectHTML(value, options);
	    }

	    if ('constructor' in value) {
	      // If it is a class, inspect it like an object but add the constructor name
	      if (value.constructor !== Object) {
	        return inspectClass(value, options);
	      } // If it is an object with an anonymous prototype, display it as an object.


	      return inspectObject(value, options);
	    } // last chance to check if it's an object


	    if (value === Object(value)) {
	      return inspectObject(value, options);
	    } // We have run out of options! Just stringify the value


	    return options.stylize(String(value), type);
	  }
	  function registerConstructor(constructor, inspector) {
	    if (constructorMap.has(constructor)) {
	      return false;
	    }

	    constructorMap.add(constructor, inspector);
	    return true;
	  }
	  function registerStringTag(stringTag, inspector) {
	    if (stringTag in stringTagMap) {
	      return false;
	    }

	    stringTagMap[stringTag] = inspector;
	    return true;
	  }
	  var custom = chaiInspect;

	  exports.custom = custom;
	  exports.default = inspect;
	  exports.inspect = inspect;
	  exports.registerConstructor = registerConstructor;
	  exports.registerStringTag = registerStringTag;

	  Object.defineProperty(exports, '__esModule', { value: true });

	})));
	}(loupe$2, loupe$2.exports));

	var loupe$1 = /*@__PURE__*/getDefaultExportFromCjs(loupe$2.exports);

	var config$6 = {

	  /**
	   * ### config.includeStack
	   *
	   * User configurable property, influences whether stack trace
	   * is included in Assertion error message. Default of false
	   * suppresses stack trace in the error message.
	   *
	   *     chai.config.includeStack = true;  // enable stack on error
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  includeStack: false,

	  /**
	   * ### config.showDiff
	   *
	   * User configurable property, influences whether or not
	   * the `showDiff` flag should be included in the thrown
	   * AssertionErrors. `false` will always be `false`; `true`
	   * will be true when the assertion has requested a diff
	   * be shown.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  showDiff: true,

	  /**
	   * ### config.truncateThreshold
	   *
	   * User configurable property, sets length threshold for actual and
	   * expected values in assertion errors. If this threshold is exceeded, for
	   * example for large data structures, the value is replaced with something
	   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
	   *
	   * Set it to zero if you want to disable truncating altogether.
	   *
	   * This is especially userful when doing assertions on arrays: having this
	   * set to a reasonable large value makes the failure messages readily
	   * inspectable.
	   *
	   *     chai.config.truncateThreshold = 0;  // disable truncating
	   *
	   * @param {Number}
	   * @api public
	   */

	  truncateThreshold: 40,

	  /**
	   * ### config.useProxy
	   *
	   * User configurable property, defines if chai will use a Proxy to throw
	   * an error when a non-existent property is read, which protects users
	   * from typos when using property-based assertions.
	   *
	   * Set it to false if you want to disable this feature.
	   *
	   *     chai.config.useProxy = false;  // disable use of Proxy
	   *
	   * This feature is automatically disabled regardless of this config value
	   * in environments that don't support proxies.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  useProxy: true,

	  /**
	   * ### config.proxyExcludedKeys
	   *
	   * User configurable property, defines which properties should be ignored
	   * instead of throwing an error if they do not exist on the assertion.
	   * This is only applied if the environment Chai is running in supports proxies and
	   * if the `useProxy` configuration setting is enabled.
	   * By default, `then` and `inspect` will not throw an error if they do not exist on the
	   * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
	   * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
	   *
	   *     // By default these keys will not throw an error if they do not exist on the assertion object
	   *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
	   *
	   * @param {Array}
	   * @api public
	   */

	  proxyExcludedKeys: ['then', 'catch', 'inspect', 'toJSON']
	};

	// This is (almost) directly from Node.js utils
	// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

	var getName$1 = getFuncName_1;
	var loupe = loupe$2.exports;
	var config$5 = config$6;

	var inspect_1 = inspect$3;

	/**
	 * ### .inspect(obj, [showHidden], [depth], [colors])
	 *
	 * Echoes the value of a value. Tries to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
	 *    properties of objects. Default is false.
	 * @param {Number} depth Depth in which to descend in object. Default is 2.
	 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
	 *    output. Default is false (no coloring).
	 * @namespace Utils
	 * @name inspect
	 */
	function inspect$3(obj, showHidden, depth, colors) {
	  var options = {
	    colors: colors,
	    depth: (typeof depth === 'undefined' ? 2 : depth),
	    showHidden: showHidden,
	    truncate: config$5.truncateThreshold ? config$5.truncateThreshold : Infinity,
	  };
	  return loupe.inspect(obj, options);
	}

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var inspect$2 = inspect_1;
	var config$4 = config$6;

	/**
	 * ### .objDisplay(object)
	 *
	 * Determines if an object or an array matches
	 * criteria to be inspected in-line for error
	 * messages or should be truncated.
	 *
	 * @param {Mixed} javascript object to inspect
	 * @name objDisplay
	 * @namespace Utils
	 * @api public
	 */

	var objDisplay$2 = function objDisplay(obj) {
	  var str = inspect$2(obj)
	    , type = Object.prototype.toString.call(obj);

	  if (config$4.truncateThreshold && str.length >= config$4.truncateThreshold) {
	    if (type === '[object Function]') {
	      return !obj.name || obj.name === ''
	        ? '[Function]'
	        : '[Function: ' + obj.name + ']';
	    } else if (type === '[object Array]') {
	      return '[ Array(' + obj.length + ') ]';
	    } else if (type === '[object Object]') {
	      var keys = Object.keys(obj)
	        , kstr = keys.length > 2
	          ? keys.splice(0, 2).join(', ') + ', ...'
	          : keys.join(', ');
	      return '{ Object (' + kstr + ') }';
	    } else {
	      return str;
	    }
	  } else {
	    return str;
	  }
	};

	/*!
	 * Chai - message composition utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var flag$8 = flag$b
	  , getActual$1 = getActual$2
	  , objDisplay$1 = objDisplay$2;

	/**
	 * ### .getMessage(object, message, negateMessage)
	 *
	 * Construct the error message based on flags
	 * and template tags. Template tags will return
	 * a stringified inspection of the object referenced.
	 *
	 * Message template tags:
	 * - `#{this}` current asserted object
	 * - `#{act}` actual value
	 * - `#{exp}` expected value
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getMessage
	 * @api public
	 */

	var getMessage$2 = function getMessage(obj, args) {
	  var negate = flag$8(obj, 'negate')
	    , val = flag$8(obj, 'object')
	    , expected = args[3]
	    , actual = getActual$1(obj, args)
	    , msg = negate ? args[2] : args[1]
	    , flagMsg = flag$8(obj, 'message');

	  if(typeof msg === "function") msg = msg();
	  msg = msg || '';
	  msg = msg
	    .replace(/#\{this\}/g, function () { return objDisplay$1(val); })
	    .replace(/#\{act\}/g, function () { return objDisplay$1(actual); })
	    .replace(/#\{exp\}/g, function () { return objDisplay$1(expected); });

	  return flagMsg ? flagMsg + ': ' + msg : msg;
	};

	/*!
	 * Chai - transferFlags utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .transferFlags(assertion, object, includeAll = true)
	 *
	 * Transfer all the flags for `assertion` to `object`. If
	 * `includeAll` is set to `false`, then the base Chai
	 * assertion flags (namely `object`, `ssfi`, `lockSsfi`,
	 * and `message`) will not be transferred.
	 *
	 *
	 *     var newAssertion = new Assertion();
	 *     utils.transferFlags(assertion, newAssertion);
	 *
	 *     var anotherAssertion = new Assertion(myObj);
	 *     utils.transferFlags(assertion, anotherAssertion, false);
	 *
	 * @param {Assertion} assertion the assertion to transfer the flags from
	 * @param {Object} object the object to transfer the flags to; usually a new assertion
	 * @param {Boolean} includeAll
	 * @namespace Utils
	 * @name transferFlags
	 * @api private
	 */

	var transferFlags$7 = function transferFlags(assertion, object, includeAll) {
	  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

	  if (!object.__flags) {
	    object.__flags = Object.create(null);
	  }

	  includeAll = arguments.length === 3 ? includeAll : true;

	  for (var flag in flags) {
	    if (includeAll ||
	        (flag !== 'object' && flag !== 'ssfi' && flag !== 'lockSsfi' && flag != 'message')) {
	      object.__flags[flag] = flags[flag];
	    }
	  }
	};

	var deepEql$1 = {exports: {}};

	'use strict';
	/* globals Symbol: false, Uint8Array: false, WeakMap: false */
	/*!
	 * deep-eql
	 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var type$2 = typeDetect$1.exports;
	function FakeMap() {
	  this._key = 'chai/deep-eql__' + Math.random() + Date.now();
	}

	FakeMap.prototype = {
	  get: function getMap(key) {
	    return key[this._key];
	  },
	  set: function setMap(key, value) {
	    if (Object.isExtensible(key)) {
	      Object.defineProperty(key, this._key, {
	        value: value,
	        configurable: true,
	      });
	    }
	  },
	};

	var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
	/*!
	 * Check to see if the MemoizeMap has recorded a result of the two operands
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {MemoizeMap} memoizeMap
	 * @returns {Boolean|null} result
	*/
	function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
	  // Technically, WeakMap keys can *only* be objects, not primitives.
	  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    return null;
	  }
	  var leftHandMap = memoizeMap.get(leftHandOperand);
	  if (leftHandMap) {
	    var result = leftHandMap.get(rightHandOperand);
	    if (typeof result === 'boolean') {
	      return result;
	    }
	  }
	  return null;
	}

	/*!
	 * Set the result of the equality into the MemoizeMap
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {MemoizeMap} memoizeMap
	 * @param {Boolean} result
	*/
	function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
	  // Technically, WeakMap keys can *only* be objects, not primitives.
	  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    return;
	  }
	  var leftHandMap = memoizeMap.get(leftHandOperand);
	  if (leftHandMap) {
	    leftHandMap.set(rightHandOperand, result);
	  } else {
	    leftHandMap = new MemoizeMap();
	    leftHandMap.set(rightHandOperand, result);
	    memoizeMap.set(leftHandOperand, leftHandMap);
	  }
	}

	/*!
	 * Primary Export
	 */

	deepEql$1.exports = deepEqual;
	var MemoizeMap_1 = deepEql$1.exports.MemoizeMap = MemoizeMap;

	/**
	 * Assert deeply nested sameValue equality between two objects of any type.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (optional) Additional options
	 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
	 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
	    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
	    references to blow the stack.
	 * @return {Boolean} equal match
	 */
	function deepEqual(leftHandOperand, rightHandOperand, options) {
	  // If we have a comparator, we can't assume anything; so bail to its check first.
	  if (options && options.comparator) {
	    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	  }

	  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	  if (simpleResult !== null) {
	    return simpleResult;
	  }

	  // Deeper comparisons are pushed through to a larger function
	  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	}

	/**
	 * Many comparisons can be canceled out early via simple equality or primitive checks.
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @return {Boolean|null} equal match
	 */
	function simpleEqual(leftHandOperand, rightHandOperand) {
	  // Equal references (except for Numbers) can be returned early
	  if (leftHandOperand === rightHandOperand) {
	    // Handle +-0 cases
	    return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
	  }

	  // handle NaN cases
	  if (
	    leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
	    rightHandOperand !== rightHandOperand // eslint-disable-line no-self-compare
	  ) {
	    return true;
	  }

	  // Anything that is not an 'object', i.e. symbols, functions, booleans, numbers,
	  // strings, and undefined, can be compared by reference.
	  if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    // Easy out b/c it would have passed the first equality check
	    return false;
	  }
	  return null;
	}

	/*!
	 * The main logic of the `deepEqual` function.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (optional) Additional options
	 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
	 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
	    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
	    references to blow the stack.
	 * @return {Boolean} equal match
	*/
	function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
	  options = options || {};
	  options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
	  var comparator = options && options.comparator;

	  // Check if a memoized result exists.
	  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
	  if (memoizeResultLeft !== null) {
	    return memoizeResultLeft;
	  }
	  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
	  if (memoizeResultRight !== null) {
	    return memoizeResultRight;
	  }

	  // If a comparator is present, use it.
	  if (comparator) {
	    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
	    // Comparators may return null, in which case we want to go back to default behavior.
	    if (comparatorResult === false || comparatorResult === true) {
	      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
	      return comparatorResult;
	    }
	    // To allow comparators to override *any* behavior, we ran them first. Since it didn't decide
	    // what to do, we need to make sure to return the basic tests first before we move on.
	    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	    if (simpleResult !== null) {
	      // Don't memoize this, it takes longer to set/retrieve than to just compare.
	      return simpleResult;
	    }
	  }

	  var leftHandType = type$2(leftHandOperand);
	  if (leftHandType !== type$2(rightHandOperand)) {
	    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
	    return false;
	  }

	  // Temporarily set the operands in the memoize object to prevent blowing the stack
	  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);

	  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
	  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
	  return result;
	}

	function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
	  switch (leftHandType) {
	    case 'String':
	    case 'Number':
	    case 'Boolean':
	    case 'Date':
	      // If these types are their instance types (e.g. `new Number`) then re-deepEqual against their values
	      return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
	    case 'Promise':
	    case 'Symbol':
	    case 'function':
	    case 'WeakMap':
	    case 'WeakSet':
	    case 'Error':
	      return leftHandOperand === rightHandOperand;
	    case 'Arguments':
	    case 'Int8Array':
	    case 'Uint8Array':
	    case 'Uint8ClampedArray':
	    case 'Int16Array':
	    case 'Uint16Array':
	    case 'Int32Array':
	    case 'Uint32Array':
	    case 'Float32Array':
	    case 'Float64Array':
	    case 'Array':
	      return iterableEqual(leftHandOperand, rightHandOperand, options);
	    case 'RegExp':
	      return regexpEqual(leftHandOperand, rightHandOperand);
	    case 'Generator':
	      return generatorEqual(leftHandOperand, rightHandOperand, options);
	    case 'DataView':
	      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
	    case 'ArrayBuffer':
	      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
	    case 'Set':
	      return entriesEqual(leftHandOperand, rightHandOperand, options);
	    case 'Map':
	      return entriesEqual(leftHandOperand, rightHandOperand, options);
	    default:
	      return objectEqual(leftHandOperand, rightHandOperand, options);
	  }
	}

	/*!
	 * Compare two Regular Expressions for equality.
	 *
	 * @param {RegExp} leftHandOperand
	 * @param {RegExp} rightHandOperand
	 * @return {Boolean} result
	 */

	function regexpEqual(leftHandOperand, rightHandOperand) {
	  return leftHandOperand.toString() === rightHandOperand.toString();
	}

	/*!
	 * Compare two Sets/Maps for equality. Faster than other equality functions.
	 *
	 * @param {Set} leftHandOperand
	 * @param {Set} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function entriesEqual(leftHandOperand, rightHandOperand, options) {
	  // IE11 doesn't support Set#entries or Set#@@iterator, so we need manually populate using Set#forEach
	  if (leftHandOperand.size !== rightHandOperand.size) {
	    return false;
	  }
	  if (leftHandOperand.size === 0) {
	    return true;
	  }
	  var leftHandItems = [];
	  var rightHandItems = [];
	  leftHandOperand.forEach(function gatherEntries(key, value) {
	    leftHandItems.push([ key, value ]);
	  });
	  rightHandOperand.forEach(function gatherEntries(key, value) {
	    rightHandItems.push([ key, value ]);
	  });
	  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
	}

	/*!
	 * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
	 *
	 * @param {Iterable} leftHandOperand
	 * @param {Iterable} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function iterableEqual(leftHandOperand, rightHandOperand, options) {
	  var length = leftHandOperand.length;
	  if (length !== rightHandOperand.length) {
	    return false;
	  }
	  if (length === 0) {
	    return true;
	  }
	  var index = -1;
	  while (++index < length) {
	    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
	      return false;
	    }
	  }
	  return true;
	}

	/*!
	 * Simple equality for generator objects such as those returned by generator functions.
	 *
	 * @param {Iterable} leftHandOperand
	 * @param {Iterable} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function generatorEqual(leftHandOperand, rightHandOperand, options) {
	  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
	}

	/*!
	 * Determine if the given object has an @@iterator function.
	 *
	 * @param {Object} target
	 * @return {Boolean} `true` if the object has an @@iterator function.
	 */
	function hasIteratorFunction(target) {
	  return typeof Symbol !== 'undefined' &&
	    typeof target === 'object' &&
	    typeof Symbol.iterator !== 'undefined' &&
	    typeof target[Symbol.iterator] === 'function';
	}

	/*!
	 * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
	 * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
	 *
	 * @param {Object} target
	 * @returns {Array} an array of entries from the @@iterator function
	 */
	function getIteratorEntries(target) {
	  if (hasIteratorFunction(target)) {
	    try {
	      return getGeneratorEntries(target[Symbol.iterator]());
	    } catch (iteratorError) {
	      return [];
	    }
	  }
	  return [];
	}

	/*!
	 * Gets all entries from a Generator. This will consume the generator - which could have side effects.
	 *
	 * @param {Generator} target
	 * @returns {Array} an array of entries from the Generator.
	 */
	function getGeneratorEntries(generator) {
	  var generatorResult = generator.next();
	  var accumulator = [ generatorResult.value ];
	  while (generatorResult.done === false) {
	    generatorResult = generator.next();
	    accumulator.push(generatorResult.value);
	  }
	  return accumulator;
	}

	/*!
	 * Gets all own and inherited enumerable keys from a target.
	 *
	 * @param {Object} target
	 * @returns {Array} an array of own and inherited enumerable keys from the target.
	 */
	function getEnumerableKeys(target) {
	  var keys = [];
	  for (var key in target) {
	    keys.push(key);
	  }
	  return keys;
	}

	/*!
	 * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
	 * each key. If any value of the given key is not equal, the function will return false (early).
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */
	function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
	  var length = keys.length;
	  if (length === 0) {
	    return true;
	  }
	  for (var i = 0; i < length; i += 1) {
	    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
	      return false;
	    }
	  }
	  return true;
	}

	/*!
	 * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
	 * for each enumerable key in the object.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function objectEqual(leftHandOperand, rightHandOperand, options) {
	  var leftHandKeys = getEnumerableKeys(leftHandOperand);
	  var rightHandKeys = getEnumerableKeys(rightHandOperand);
	  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
	    leftHandKeys.sort();
	    rightHandKeys.sort();
	    if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
	      return false;
	    }
	    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
	  }

	  var leftHandEntries = getIteratorEntries(leftHandOperand);
	  var rightHandEntries = getIteratorEntries(rightHandOperand);
	  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
	    leftHandEntries.sort();
	    rightHandEntries.sort();
	    return iterableEqual(leftHandEntries, rightHandEntries, options);
	  }

	  if (leftHandKeys.length === 0 &&
	      leftHandEntries.length === 0 &&
	      rightHandKeys.length === 0 &&
	      rightHandEntries.length === 0) {
	    return true;
	  }

	  return false;
	}

	/*!
	 * Returns true if the argument is a primitive.
	 *
	 * This intentionally returns true for all objects that can be compared by reference,
	 * including functions and symbols.
	 *
	 * @param {Mixed} value
	 * @return {Boolean} result
	 */
	function isPrimitive(value) {
	  return value === null || typeof value !== 'object';
	}

	var deepEql = deepEql$1.exports;

	var config$3 = config$6;

	/*!
	 * Chai - isProxyEnabled helper
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .isProxyEnabled()
	 *
	 * Helper function to check if Chai's proxy protection feature is enabled. If
	 * proxies are unsupported or disabled via the user's Chai config, then return
	 * false. Otherwise, return true.
	 *
	 * @namespace Utils
	 * @name isProxyEnabled
	 */

	var isProxyEnabled$4 = function isProxyEnabled() {
	  return config$3.useProxy &&
	    typeof Proxy !== 'undefined' &&
	    typeof Reflect !== 'undefined';
	};

	/*!
	 * Chai - addProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var chai$6 = chai$7;
	var flag$7 = flag$b;
	var isProxyEnabled$3 = isProxyEnabled$4;
	var transferFlags$6 = transferFlags$7;

	/**
	 * ### .addProperty(ctx, name, getter)
	 *
	 * Adds a property to the prototype of an object.
	 *
	 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
	 *       var obj = utils.flag(this, 'object');
	 *       new chai.Assertion(obj).to.be.instanceof(Foo);
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.addProperty('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.be.foo;
	 *
	 * @param {Object} ctx object to which the property is added
	 * @param {String} name of property to add
	 * @param {Function} getter function to be used for name
	 * @namespace Utils
	 * @name addProperty
	 * @api public
	 */

	var addProperty$1 = function addProperty(ctx, name, getter) {
	  getter = getter === undefined ? function () {} : getter;

	  Object.defineProperty(ctx, name,
	    { get: function propertyGetter() {
	        // Setting the `ssfi` flag to `propertyGetter` causes this function to
	        // be the starting point for removing implementation frames from the
	        // stack trace of a failed assertion.
	        //
	        // However, we only want to use this function as the starting point if
	        // the `lockSsfi` flag isn't set and proxy protection is disabled.
	        //
	        // If the `lockSsfi` flag is set, then either this assertion has been
	        // overwritten by another assertion, or this assertion is being invoked
	        // from inside of another assertion. In the first case, the `ssfi` flag
	        // has already been set by the overwriting assertion. In the second
	        // case, the `ssfi` flag has already been set by the outer assertion.
	        //
	        // If proxy protection is enabled, then the `ssfi` flag has already been
	        // set by the proxy getter.
	        if (!isProxyEnabled$3() && !flag$7(this, 'lockSsfi')) {
	          flag$7(this, 'ssfi', propertyGetter);
	        }

	        var result = getter.call(this);
	        if (result !== undefined)
	          return result;

	        var newAssertion = new chai$6.Assertion();
	        transferFlags$6(this, newAssertion);
	        return newAssertion;
	      }
	    , configurable: true
	  });
	};

	var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');

	/*!
	 * Chai - addLengthGuard utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .addLengthGuard(fn, assertionName, isChainable)
	 *
	 * Define `length` as a getter on the given uninvoked method assertion. The
	 * getter acts as a guard against chaining `length` directly off of an uninvoked
	 * method assertion, which is a problem because it references `function`'s
	 * built-in `length` property instead of Chai's `length` assertion. When the
	 * getter catches the user making this mistake, it throws an error with a
	 * helpful message.
	 *
	 * There are two ways in which this mistake can be made. The first way is by
	 * chaining the `length` assertion directly off of an uninvoked chainable
	 * method. In this case, Chai suggests that the user use `lengthOf` instead. The
	 * second way is by chaining the `length` assertion directly off of an uninvoked
	 * non-chainable method. Non-chainable methods must be invoked prior to
	 * chaining. In this case, Chai suggests that the user consult the docs for the
	 * given assertion.
	 *
	 * If the `length` property of functions is unconfigurable, then return `fn`
	 * without modification.
	 *
	 * Note that in ES6, the function's `length` property is configurable, so once
	 * support for legacy environments is dropped, Chai's `length` property can
	 * replace the built-in function's `length` property, and this length guard will
	 * no longer be necessary. In the mean time, maintaining consistency across all
	 * environments is the priority.
	 *
	 * @param {Function} fn
	 * @param {String} assertionName
	 * @param {Boolean} isChainable
	 * @namespace Utils
	 * @name addLengthGuard
	 */

	var addLengthGuard$4 = function addLengthGuard (fn, assertionName, isChainable) {
	  if (!fnLengthDesc.configurable) return fn;

	  Object.defineProperty(fn, 'length', {
	    get: function () {
	      if (isChainable) {
	        throw Error('Invalid Chai property: ' + assertionName + '.length. Due' +
	          ' to a compatibility issue, "length" cannot directly follow "' +
	          assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
	      }

	      throw Error('Invalid Chai property: ' + assertionName + '.length. See' +
	        ' docs for proper usage of "' + assertionName + '".');
	    }
	  });

	  return fn;
	};

	/*!
	 * Chai - getProperties utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getProperties(object)
	 *
	 * This allows the retrieval of property names of an object, enumerable or not,
	 * inherited or not.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getProperties
	 * @api public
	 */

	var getProperties$1 = function getProperties(object) {
	  var result = Object.getOwnPropertyNames(object);

	  function addProperty(property) {
	    if (result.indexOf(property) === -1) {
	      result.push(property);
	    }
	  }

	  var proto = Object.getPrototypeOf(object);
	  while (proto !== null) {
	    Object.getOwnPropertyNames(proto).forEach(addProperty);
	    proto = Object.getPrototypeOf(proto);
	  }

	  return result;
	};

	var config$2 = config$6;
	var flag$6 = flag$b;
	var getProperties = getProperties$1;
	var isProxyEnabled$2 = isProxyEnabled$4;

	/*!
	 * Chai - proxify utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .proxify(object)
	 *
	 * Return a proxy of given object that throws an error when a non-existent
	 * property is read. By default, the root cause is assumed to be a misspelled
	 * property, and thus an attempt is made to offer a reasonable suggestion from
	 * the list of existing properties. However, if a nonChainableMethodName is
	 * provided, then the root cause is instead a failure to invoke a non-chainable
	 * method prior to reading the non-existent property.
	 *
	 * If proxies are unsupported or disabled via the user's Chai config, then
	 * return object without modification.
	 *
	 * @param {Object} obj
	 * @param {String} nonChainableMethodName
	 * @namespace Utils
	 * @name proxify
	 */

	var builtins = ['__flags', '__methods', '_obj', 'assert'];

	var proxify$4 = function proxify(obj, nonChainableMethodName) {
	  if (!isProxyEnabled$2()) return obj;

	  return new Proxy(obj, {
	    get: function proxyGetter(target, property) {
	      // This check is here because we should not throw errors on Symbol properties
	      // such as `Symbol.toStringTag`.
	      // The values for which an error should be thrown can be configured using
	      // the `config.proxyExcludedKeys` setting.
	      if (typeof property === 'string' &&
	          config$2.proxyExcludedKeys.indexOf(property) === -1 &&
	          !Reflect.has(target, property)) {
	        // Special message for invalid property access of non-chainable methods.
	        if (nonChainableMethodName) {
	          throw Error('Invalid Chai property: ' + nonChainableMethodName + '.' +
	            property + '. See docs for proper usage of "' +
	            nonChainableMethodName + '".');
	        }

	        // If the property is reasonably close to an existing Chai property,
	        // suggest that property to the user. Only suggest properties with a
	        // distance less than 4.
	        var suggestion = null;
	        var suggestionDistance = 4;
	        getProperties(target).forEach(function(prop) {
	          if (
	            !Object.prototype.hasOwnProperty(prop) &&
	            builtins.indexOf(prop) === -1
	          ) {
	            var dist = stringDistanceCapped(
	              property,
	              prop,
	              suggestionDistance
	            );
	            if (dist < suggestionDistance) {
	              suggestion = prop;
	              suggestionDistance = dist;
	            }
	          }
	        });

	        if (suggestion !== null) {
	          throw Error('Invalid Chai property: ' + property +
	            '. Did you mean "' + suggestion + '"?');
	        } else {
	          throw Error('Invalid Chai property: ' + property);
	        }
	      }

	      // Use this proxy getter as the starting point for removing implementation
	      // frames from the stack trace of a failed assertion. For property
	      // assertions, this prevents the proxy getter from showing up in the stack
	      // trace since it's invoked before the property getter. For method and
	      // chainable method assertions, this flag will end up getting changed to
	      // the method wrapper, which is good since this frame will no longer be in
	      // the stack once the method is invoked. Note that Chai builtin assertion
	      // properties such as `__flags` are skipped since this is only meant to
	      // capture the starting point of an assertion. This step is also skipped
	      // if the `lockSsfi` flag is set, thus indicating that this assertion is
	      // being called from within another assertion. In that case, the `ssfi`
	      // flag is already set to the outer assertion's starting point.
	      if (builtins.indexOf(property) === -1 && !flag$6(target, 'lockSsfi')) {
	        flag$6(target, 'ssfi', proxyGetter);
	      }

	      return Reflect.get(target, property);
	    }
	  });
	};

	/**
	 * # stringDistanceCapped(strA, strB, cap)
	 * Return the Levenshtein distance between two strings, but no more than cap.
	 * @param {string} strA
	 * @param {string} strB
	 * @param {number} number
	 * @return {number} min(string distance between strA and strB, cap)
	 * @api private
	 */

	function stringDistanceCapped(strA, strB, cap) {
	  if (Math.abs(strA.length - strB.length) >= cap) {
	    return cap;
	  }

	  var memo = [];
	  // `memo` is a two-dimensional array containing distances.
	  // memo[i][j] is the distance between strA.slice(0, i) and
	  // strB.slice(0, j).
	  for (var i = 0; i <= strA.length; i++) {
	    memo[i] = Array(strB.length + 1).fill(0);
	    memo[i][0] = i;
	  }
	  for (var j = 0; j < strB.length; j++) {
	    memo[0][j] = j;
	  }

	  for (var i = 1; i <= strA.length; i++) {
	    var ch = strA.charCodeAt(i - 1);
	    for (var j = 1; j <= strB.length; j++) {
	      if (Math.abs(i - j) >= cap) {
	        memo[i][j] = cap;
	        continue;
	      }
	      memo[i][j] = Math.min(
	        memo[i - 1][j] + 1,
	        memo[i][j - 1] + 1,
	        memo[i - 1][j - 1] +
	          (ch === strB.charCodeAt(j - 1) ? 0 : 1)
	      );
	    }
	  }

	  return memo[strA.length][strB.length];
	}

	/*!
	 * Chai - addMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addLengthGuard$3 = addLengthGuard$4;
	var chai$5 = chai$7;
	var flag$5 = flag$b;
	var proxify$3 = proxify$4;
	var transferFlags$5 = transferFlags$7;

	/**
	 * ### .addMethod(ctx, name, method)
	 *
	 * Adds a method to the prototype of an object.
	 *
	 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
	 *       var obj = utils.flag(this, 'object');
	 *       new chai.Assertion(obj).to.be.equal(str);
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.addMethod('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(fooStr).to.be.foo('bar');
	 *
	 * @param {Object} ctx object to which the method is added
	 * @param {String} name of method to add
	 * @param {Function} method function to be used for name
	 * @namespace Utils
	 * @name addMethod
	 * @api public
	 */

	var addMethod$1 = function addMethod(ctx, name, method) {
	  var methodWrapper = function () {
	    // Setting the `ssfi` flag to `methodWrapper` causes this function to be the
	    // starting point for removing implementation frames from the stack trace of
	    // a failed assertion.
	    //
	    // However, we only want to use this function as the starting point if the
	    // `lockSsfi` flag isn't set.
	    //
	    // If the `lockSsfi` flag is set, then either this assertion has been
	    // overwritten by another assertion, or this assertion is being invoked from
	    // inside of another assertion. In the first case, the `ssfi` flag has
	    // already been set by the overwriting assertion. In the second case, the
	    // `ssfi` flag has already been set by the outer assertion.
	    if (!flag$5(this, 'lockSsfi')) {
	      flag$5(this, 'ssfi', methodWrapper);
	    }

	    var result = method.apply(this, arguments);
	    if (result !== undefined)
	      return result;

	    var newAssertion = new chai$5.Assertion();
	    transferFlags$5(this, newAssertion);
	    return newAssertion;
	  };

	  addLengthGuard$3(methodWrapper, name, false);
	  ctx[name] = proxify$3(methodWrapper, name);
	};

	/*!
	 * Chai - overwriteProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var chai$4 = chai$7;
	var flag$4 = flag$b;
	var isProxyEnabled$1 = isProxyEnabled$4;
	var transferFlags$4 = transferFlags$7;

	/**
	 * ### .overwriteProperty(ctx, name, fn)
	 *
	 * Overwrites an already existing property getter and provides
	 * access to previous value. Must return function to use as getter.
	 *
	 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
	 *       return function () {
	 *         var obj = utils.flag(this, 'object');
	 *         if (obj instanceof Foo) {
	 *           new chai.Assertion(obj.name).to.equal('bar');
	 *         } else {
	 *           _super.call(this);
	 *         }
	 *       }
	 *     });
	 *
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.overwriteProperty('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.be.ok;
	 *
	 * @param {Object} ctx object whose property is to be overwritten
	 * @param {String} name of property to overwrite
	 * @param {Function} getter function that returns a getter function to be used for name
	 * @namespace Utils
	 * @name overwriteProperty
	 * @api public
	 */

	var overwriteProperty$1 = function overwriteProperty(ctx, name, getter) {
	  var _get = Object.getOwnPropertyDescriptor(ctx, name)
	    , _super = function () {};

	  if (_get && 'function' === typeof _get.get)
	    _super = _get.get;

	  Object.defineProperty(ctx, name,
	    { get: function overwritingPropertyGetter() {
	        // Setting the `ssfi` flag to `overwritingPropertyGetter` causes this
	        // function to be the starting point for removing implementation frames
	        // from the stack trace of a failed assertion.
	        //
	        // However, we only want to use this function as the starting point if
	        // the `lockSsfi` flag isn't set and proxy protection is disabled.
	        //
	        // If the `lockSsfi` flag is set, then either this assertion has been
	        // overwritten by another assertion, or this assertion is being invoked
	        // from inside of another assertion. In the first case, the `ssfi` flag
	        // has already been set by the overwriting assertion. In the second
	        // case, the `ssfi` flag has already been set by the outer assertion.
	        //
	        // If proxy protection is enabled, then the `ssfi` flag has already been
	        // set by the proxy getter.
	        if (!isProxyEnabled$1() && !flag$4(this, 'lockSsfi')) {
	          flag$4(this, 'ssfi', overwritingPropertyGetter);
	        }

	        // Setting the `lockSsfi` flag to `true` prevents the overwritten
	        // assertion from changing the `ssfi` flag. By this point, the `ssfi`
	        // flag is already set to the correct starting point for this assertion.
	        var origLockSsfi = flag$4(this, 'lockSsfi');
	        flag$4(this, 'lockSsfi', true);
	        var result = getter(_super).call(this);
	        flag$4(this, 'lockSsfi', origLockSsfi);

	        if (result !== undefined) {
	          return result;
	        }

	        var newAssertion = new chai$4.Assertion();
	        transferFlags$4(this, newAssertion);
	        return newAssertion;
	      }
	    , configurable: true
	  });
	};

	/*!
	 * Chai - overwriteMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addLengthGuard$2 = addLengthGuard$4;
	var chai$3 = chai$7;
	var flag$3 = flag$b;
	var proxify$2 = proxify$4;
	var transferFlags$3 = transferFlags$7;

	/**
	 * ### .overwriteMethod(ctx, name, fn)
	 *
	 * Overwrites an already existing method and provides
	 * access to previous function. Must return function
	 * to be used for name.
	 *
	 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
	 *       return function (str) {
	 *         var obj = utils.flag(this, 'object');
	 *         if (obj instanceof Foo) {
	 *           new chai.Assertion(obj.value).to.equal(str);
	 *         } else {
	 *           _super.apply(this, arguments);
	 *         }
	 *       }
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.overwriteMethod('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.equal('bar');
	 *
	 * @param {Object} ctx object whose method is to be overwritten
	 * @param {String} name of method to overwrite
	 * @param {Function} method function that returns a function to be used for name
	 * @namespace Utils
	 * @name overwriteMethod
	 * @api public
	 */

	var overwriteMethod$1 = function overwriteMethod(ctx, name, method) {
	  var _method = ctx[name]
	    , _super = function () {
	      throw new Error(name + ' is not a function');
	    };

	  if (_method && 'function' === typeof _method)
	    _super = _method;

	  var overwritingMethodWrapper = function () {
	    // Setting the `ssfi` flag to `overwritingMethodWrapper` causes this
	    // function to be the starting point for removing implementation frames from
	    // the stack trace of a failed assertion.
	    //
	    // However, we only want to use this function as the starting point if the
	    // `lockSsfi` flag isn't set.
	    //
	    // If the `lockSsfi` flag is set, then either this assertion has been
	    // overwritten by another assertion, or this assertion is being invoked from
	    // inside of another assertion. In the first case, the `ssfi` flag has
	    // already been set by the overwriting assertion. In the second case, the
	    // `ssfi` flag has already been set by the outer assertion.
	    if (!flag$3(this, 'lockSsfi')) {
	      flag$3(this, 'ssfi', overwritingMethodWrapper);
	    }

	    // Setting the `lockSsfi` flag to `true` prevents the overwritten assertion
	    // from changing the `ssfi` flag. By this point, the `ssfi` flag is already
	    // set to the correct starting point for this assertion.
	    var origLockSsfi = flag$3(this, 'lockSsfi');
	    flag$3(this, 'lockSsfi', true);
	    var result = method(_super).apply(this, arguments);
	    flag$3(this, 'lockSsfi', origLockSsfi);

	    if (result !== undefined) {
	      return result;
	    }

	    var newAssertion = new chai$3.Assertion();
	    transferFlags$3(this, newAssertion);
	    return newAssertion;
	  };

	  addLengthGuard$2(overwritingMethodWrapper, name, false);
	  ctx[name] = proxify$2(overwritingMethodWrapper, name);
	};

	/*!
	 * Chai - addChainingMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var addLengthGuard$1 = addLengthGuard$4;
	var chai$2 = chai$7;
	var flag$2 = flag$b;
	var proxify$1 = proxify$4;
	var transferFlags$2 = transferFlags$7;

	/*!
	 * Module variables
	 */

	// Check whether `Object.setPrototypeOf` is supported
	var canSetPrototype = typeof Object.setPrototypeOf === 'function';

	// Without `Object.setPrototypeOf` support, this module will need to add properties to a function.
	// However, some of functions' own props are not configurable and should be skipped.
	var testFn = function() {};
	var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
	  var propDesc = Object.getOwnPropertyDescriptor(testFn, name);

	  // Note: PhantomJS 1.x includes `callee` as one of `testFn`'s own properties,
	  // but then returns `undefined` as the property descriptor for `callee`. As a
	  // workaround, we perform an otherwise unnecessary type-check for `propDesc`,
	  // and then filter it out if it's not an object as it should be.
	  if (typeof propDesc !== 'object')
	    return true;

	  return !propDesc.configurable;
	});

	// Cache `Function` properties
	var call  = Function.prototype.call,
	    apply = Function.prototype.apply;

	/**
	 * ### .addChainableMethod(ctx, name, method, chainingBehavior)
	 *
	 * Adds a method to an object, such that the method can also be chained.
	 *
	 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
	 *       var obj = utils.flag(this, 'object');
	 *       new chai.Assertion(obj).to.be.equal(str);
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
	 *
	 * The result can then be used as both a method assertion, executing both `method` and
	 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
	 *
	 *     expect(fooStr).to.be.foo('bar');
	 *     expect(fooStr).to.be.foo.equal('foo');
	 *
	 * @param {Object} ctx object to which the method is added
	 * @param {String} name of method to add
	 * @param {Function} method function to be used for `name`, when called
	 * @param {Function} chainingBehavior function to be called every time the property is accessed
	 * @namespace Utils
	 * @name addChainableMethod
	 * @api public
	 */

	var addChainableMethod$1 = function addChainableMethod(ctx, name, method, chainingBehavior) {
	  if (typeof chainingBehavior !== 'function') {
	    chainingBehavior = function () { };
	  }

	  var chainableBehavior = {
	      method: method
	    , chainingBehavior: chainingBehavior
	  };

	  // save the methods so we can overwrite them later, if we need to.
	  if (!ctx.__methods) {
	    ctx.__methods = {};
	  }
	  ctx.__methods[name] = chainableBehavior;

	  Object.defineProperty(ctx, name,
	    { get: function chainableMethodGetter() {
	        chainableBehavior.chainingBehavior.call(this);

	        var chainableMethodWrapper = function () {
	          // Setting the `ssfi` flag to `chainableMethodWrapper` causes this
	          // function to be the starting point for removing implementation
	          // frames from the stack trace of a failed assertion.
	          //
	          // However, we only want to use this function as the starting point if
	          // the `lockSsfi` flag isn't set.
	          //
	          // If the `lockSsfi` flag is set, then this assertion is being
	          // invoked from inside of another assertion. In this case, the `ssfi`
	          // flag has already been set by the outer assertion.
	          //
	          // Note that overwriting a chainable method merely replaces the saved
	          // methods in `ctx.__methods` instead of completely replacing the
	          // overwritten assertion. Therefore, an overwriting assertion won't
	          // set the `ssfi` or `lockSsfi` flags.
	          if (!flag$2(this, 'lockSsfi')) {
	            flag$2(this, 'ssfi', chainableMethodWrapper);
	          }

	          var result = chainableBehavior.method.apply(this, arguments);
	          if (result !== undefined) {
	            return result;
	          }

	          var newAssertion = new chai$2.Assertion();
	          transferFlags$2(this, newAssertion);
	          return newAssertion;
	        };

	        addLengthGuard$1(chainableMethodWrapper, name, true);

	        // Use `Object.setPrototypeOf` if available
	        if (canSetPrototype) {
	          // Inherit all properties from the object by replacing the `Function` prototype
	          var prototype = Object.create(this);
	          // Restore the `call` and `apply` methods from `Function`
	          prototype.call = call;
	          prototype.apply = apply;
	          Object.setPrototypeOf(chainableMethodWrapper, prototype);
	        }
	        // Otherwise, redefine all properties (slow!)
	        else {
	          var asserterNames = Object.getOwnPropertyNames(ctx);
	          asserterNames.forEach(function (asserterName) {
	            if (excludeNames.indexOf(asserterName) !== -1) {
	              return;
	            }

	            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
	            Object.defineProperty(chainableMethodWrapper, asserterName, pd);
	          });
	        }

	        transferFlags$2(this, chainableMethodWrapper);
	        return proxify$1(chainableMethodWrapper);
	      }
	    , configurable: true
	  });
	};

	/*!
	 * Chai - overwriteChainableMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var chai$1 = chai$7;
	var transferFlags$1 = transferFlags$7;

	/**
	 * ### .overwriteChainableMethod(ctx, name, method, chainingBehavior)
	 *
	 * Overwrites an already existing chainable method
	 * and provides access to the previous function or
	 * property.  Must return functions to be used for
	 * name.
	 *
	 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'lengthOf',
	 *       function (_super) {
	 *       }
	 *     , function (_super) {
	 *       }
	 *     );
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.have.lengthOf(3);
	 *     expect(myFoo).to.have.lengthOf.above(3);
	 *
	 * @param {Object} ctx object whose method / property is to be overwritten
	 * @param {String} name of method / property to overwrite
	 * @param {Function} method function that returns a function to be used for name
	 * @param {Function} chainingBehavior function that returns a function to be used for property
	 * @namespace Utils
	 * @name overwriteChainableMethod
	 * @api public
	 */

	var overwriteChainableMethod$1 = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
	  var chainableBehavior = ctx.__methods[name];

	  var _chainingBehavior = chainableBehavior.chainingBehavior;
	  chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
	    var result = chainingBehavior(_chainingBehavior).call(this);
	    if (result !== undefined) {
	      return result;
	    }

	    var newAssertion = new chai$1.Assertion();
	    transferFlags$1(this, newAssertion);
	    return newAssertion;
	  };

	  var _method = chainableBehavior.method;
	  chainableBehavior.method = function overwritingChainableMethodWrapper() {
	    var result = method(_method).apply(this, arguments);
	    if (result !== undefined) {
	      return result;
	    }

	    var newAssertion = new chai$1.Assertion();
	    transferFlags$1(this, newAssertion);
	    return newAssertion;
	  };
	};

	/*!
	 * Chai - compareByInspect utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var inspect$1 = inspect_1;

	/**
	 * ### .compareByInspect(mixed, mixed)
	 *
	 * To be used as a compareFunction with Array.prototype.sort. Compares elements
	 * using inspect instead of default behavior of using toString so that Symbols
	 * and objects with irregular/missing toString can still be sorted without a
	 * TypeError.
	 *
	 * @param {Mixed} first element to compare
	 * @param {Mixed} second element to compare
	 * @returns {Number} -1 if 'a' should come before 'b'; otherwise 1
	 * @name compareByInspect
	 * @namespace Utils
	 * @api public
	 */

	var compareByInspect$1 = function compareByInspect(a, b) {
	  return inspect$1(a) < inspect$1(b) ? -1 : 1;
	};

	/*!
	 * Chai - getOwnEnumerablePropertySymbols utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getOwnEnumerablePropertySymbols(object)
	 *
	 * This allows the retrieval of directly-owned enumerable property symbols of an
	 * object. This function is necessary because Object.getOwnPropertySymbols
	 * returns both enumerable and non-enumerable property symbols.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getOwnEnumerablePropertySymbols
	 * @api public
	 */

	var getOwnEnumerablePropertySymbols$2 = function getOwnEnumerablePropertySymbols(obj) {
	  if (typeof Object.getOwnPropertySymbols !== 'function') return [];

	  return Object.getOwnPropertySymbols(obj).filter(function (sym) {
	    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
	  });
	};

	/*!
	 * Chai - getOwnEnumerableProperties utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var getOwnEnumerablePropertySymbols$1 = getOwnEnumerablePropertySymbols$2;

	/**
	 * ### .getOwnEnumerableProperties(object)
	 *
	 * This allows the retrieval of directly-owned enumerable property names and
	 * symbols of an object. This function is necessary because Object.keys only
	 * returns enumerable property names, not enumerable property symbols.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getOwnEnumerableProperties
	 * @api public
	 */

	var getOwnEnumerableProperties$1 = function getOwnEnumerableProperties(obj) {
	  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols$1(obj));
	};

	'use strict';

	/* !
	 * Chai - checkError utility
	 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .checkError
	 *
	 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
	 *
	 * @api public
	 */

	/**
	 * ### .compatibleInstance(thrown, errorLike)
	 *
	 * Checks if two instances are compatible (strict equal).
	 * Returns false if errorLike is not an instance of Error, because instances
	 * can only be compatible if they're both error instances.
	 *
	 * @name compatibleInstance
	 * @param {Error} thrown error
	 * @param {Error|ErrorConstructor} errorLike object to compare against
	 * @namespace Utils
	 * @api public
	 */

	function compatibleInstance(thrown, errorLike) {
	  return errorLike instanceof Error && thrown === errorLike;
	}

	/**
	 * ### .compatibleConstructor(thrown, errorLike)
	 *
	 * Checks if two constructors are compatible.
	 * This function can receive either an error constructor or
	 * an error instance as the `errorLike` argument.
	 * Constructors are compatible if they're the same or if one is
	 * an instance of another.
	 *
	 * @name compatibleConstructor
	 * @param {Error} thrown error
	 * @param {Error|ErrorConstructor} errorLike object to compare against
	 * @namespace Utils
	 * @api public
	 */

	function compatibleConstructor(thrown, errorLike) {
	  if (errorLike instanceof Error) {
	    // If `errorLike` is an instance of any error we compare their constructors
	    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
	  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
	    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
	    return thrown.constructor === errorLike || thrown instanceof errorLike;
	  }

	  return false;
	}

	/**
	 * ### .compatibleMessage(thrown, errMatcher)
	 *
	 * Checks if an error's message is compatible with a matcher (String or RegExp).
	 * If the message contains the String or passes the RegExp test,
	 * it is considered compatible.
	 *
	 * @name compatibleMessage
	 * @param {Error} thrown error
	 * @param {String|RegExp} errMatcher to look for into the message
	 * @namespace Utils
	 * @api public
	 */

	function compatibleMessage(thrown, errMatcher) {
	  var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
	  if (errMatcher instanceof RegExp) {
	    return errMatcher.test(comparisonString);
	  } else if (typeof errMatcher === 'string') {
	    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
	  }

	  return false;
	}

	/**
	 * ### .getFunctionName(constructorFn)
	 *
	 * Returns the name of a function.
	 * This also includes a polyfill function if `constructorFn.name` is not defined.
	 *
	 * @name getFunctionName
	 * @param {Function} constructorFn
	 * @namespace Utils
	 * @api private
	 */

	var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
	function getFunctionName(constructorFn) {
	  var name = '';
	  if (typeof constructorFn.name === 'undefined') {
	    // Here we run a polyfill if constructorFn.name is not defined
	    var match = String(constructorFn).match(functionNameMatch);
	    if (match) {
	      name = match[1];
	    }
	  } else {
	    name = constructorFn.name;
	  }

	  return name;
	}

	/**
	 * ### .getConstructorName(errorLike)
	 *
	 * Gets the constructor name for an Error instance or constructor itself.
	 *
	 * @name getConstructorName
	 * @param {Error|ErrorConstructor} errorLike
	 * @namespace Utils
	 * @api public
	 */

	function getConstructorName(errorLike) {
	  var constructorName = errorLike;
	  if (errorLike instanceof Error) {
	    constructorName = getFunctionName(errorLike.constructor);
	  } else if (typeof errorLike === 'function') {
	    // If `err` is not an instance of Error it is an error constructor itself or another function.
	    // If we've got a common function we get its name, otherwise we may need to create a new instance
	    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
	    constructorName = getFunctionName(errorLike).trim() ||
	        getFunctionName(new errorLike()); // eslint-disable-line new-cap
	  }

	  return constructorName;
	}

	/**
	 * ### .getMessage(errorLike)
	 *
	 * Gets the error message from an error.
	 * If `err` is a String itself, we return it.
	 * If the error has no message, we return an empty string.
	 *
	 * @name getMessage
	 * @param {Error|String} errorLike
	 * @namespace Utils
	 * @api public
	 */

	function getMessage$1(errorLike) {
	  var msg = '';
	  if (errorLike && errorLike.message) {
	    msg = errorLike.message;
	  } else if (typeof errorLike === 'string') {
	    msg = errorLike;
	  }

	  return msg;
	}

	var checkError$1 = {
	  compatibleInstance: compatibleInstance,
	  compatibleConstructor: compatibleConstructor,
	  compatibleMessage: compatibleMessage,
	  getMessage: getMessage$1,
	  getConstructorName: getConstructorName,
	};

	/*!
	 * Chai - isNaN utility
	 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * ### .isNaN(value)
	 *
	 * Checks if the given value is NaN or not.
	 *
	 *     utils.isNaN(NaN); // true
	 *
	 * @param {Value} The value which has to be checked if it is NaN
	 * @name isNaN
	 * @api private
	 */

	function isNaN$1(value) {
	  // Refer http://www.ecma-international.org/ecma-262/6.0/#sec-isnan-number
	  // section's NOTE.
	  return value !== value;
	}

	// If ECMAScript 6's Number.isNaN is present, prefer that.
	var _isNaN$1 = Number.isNaN || isNaN$1;

	var type$1 = typeDetect$1.exports;

	var flag$1 = flag$b;

	function isObjectType(obj) {
	  var objectType = type$1(obj);
	  var objectTypes = ['Array', 'Object', 'function'];

	  return objectTypes.indexOf(objectType) !== -1;
	}

	/**
	 * ### .getOperator(message)
	 *
	 * Extract the operator from error message.
	 * Operator defined is based on below link
	 * https://nodejs.org/api/assert.html#assert_assert.
	 *
	 * Returns the `operator` or `undefined` value for an Assertion.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getOperator
	 * @api public
	 */

	var getOperator$1 = function getOperator(obj, args) {
	  var operator = flag$1(obj, 'operator');
	  var negate = flag$1(obj, 'negate');
	  var expected = args[3];
	  var msg = negate ? args[2] : args[1];

	  if (operator) {
	    return operator;
	  }

	  if (typeof msg === 'function') msg = msg();

	  msg = msg || '';
	  if (!msg) {
	    return undefined;
	  }

	  if (/\shave\s/.test(msg)) {
	    return undefined;
	  }

	  var isObject = isObjectType(expected);
	  if (/\snot\s/.test(msg)) {
	    return isObject ? 'notDeepStrictEqual' : 'notStrictEqual';
	  }

	  return isObject ? 'deepStrictEqual' : 'strictEqual';
	};

	/*!
	 * chai
	 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Dependencies that are used for multiple exports are required here only once
	 */

	var pathval = pathval$1;

	/*!
	 * test utility
	 */

	var test = utils.test = test$1;

	/*!
	 * type utility
	 */

	var type = utils.type = typeDetect$1.exports;

	/*!
	 * expectTypes utility
	 */
	var expectTypes = utils.expectTypes = expectTypes$1;

	/*!
	 * message utility
	 */

	var getMessage = utils.getMessage = getMessage$2;

	/*!
	 * actual utility
	 */

	var getActual = utils.getActual = getActual$2;

	/*!
	 * Inspect util
	 */

	var inspect = utils.inspect = inspect_1;

	/*!
	 * Object Display util
	 */

	var objDisplay = utils.objDisplay = objDisplay$2;

	/*!
	 * Flag utility
	 */

	var flag = utils.flag = flag$b;

	/*!
	 * Flag transferring utility
	 */

	var transferFlags = utils.transferFlags = transferFlags$7;

	/*!
	 * Deep equal utility
	 */

	var eql = utils.eql = deepEql$1.exports;

	/*!
	 * Deep path info
	 */

	var getPathInfo = utils.getPathInfo = pathval.getPathInfo;

	/*!
	 * Check if a property exists
	 */

	var hasProperty = utils.hasProperty = pathval.hasProperty;

	/*!
	 * Function name
	 */

	var getName = utils.getName = getFuncName_1;

	/*!
	 * add Property
	 */

	var addProperty = utils.addProperty = addProperty$1;

	/*!
	 * add Method
	 */

	var addMethod = utils.addMethod = addMethod$1;

	/*!
	 * overwrite Property
	 */

	var overwriteProperty = utils.overwriteProperty = overwriteProperty$1;

	/*!
	 * overwrite Method
	 */

	var overwriteMethod = utils.overwriteMethod = overwriteMethod$1;

	/*!
	 * Add a chainable method
	 */

	var addChainableMethod = utils.addChainableMethod = addChainableMethod$1;

	/*!
	 * Overwrite chainable method
	 */

	var overwriteChainableMethod = utils.overwriteChainableMethod = overwriteChainableMethod$1;

	/*!
	 * Compare by inspect method
	 */

	var compareByInspect = utils.compareByInspect = compareByInspect$1;

	/*!
	 * Get own enumerable property symbols method
	 */

	var getOwnEnumerablePropertySymbols = utils.getOwnEnumerablePropertySymbols = getOwnEnumerablePropertySymbols$2;

	/*!
	 * Get own enumerable properties method
	 */

	var getOwnEnumerableProperties = utils.getOwnEnumerableProperties = getOwnEnumerableProperties$1;

	/*!
	 * Checks error against a given set of criteria
	 */

	var checkError = utils.checkError = checkError$1;

	/*!
	 * Proxify util
	 */

	var proxify = utils.proxify = proxify$4;

	/*!
	 * addLengthGuard util
	 */

	var addLengthGuard = utils.addLengthGuard = addLengthGuard$4;

	/*!
	 * isProxyEnabled helper
	 */

	var isProxyEnabled = utils.isProxyEnabled = isProxyEnabled$4;

	/*!
	 * isNaN method
	 */

	var _isNaN = utils.isNaN = _isNaN$1;

	/*!
	 * getOperator method
	 */

	var getOperator = utils.getOperator = getOperator$1;

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var config$1 = config$6;

	var assertion = function (_chai, util) {
	  /*!
	   * Module dependencies.
	   */

	  var AssertionError = _chai.AssertionError
	    , flag = util.flag;

	  /*!
	   * Module export.
	   */

	  _chai.Assertion = Assertion;

	  /*!
	   * Assertion Constructor
	   *
	   * Creates object for chaining.
	   *
	   * `Assertion` objects contain metadata in the form of flags. Three flags can
	   * be assigned during instantiation by passing arguments to this constructor:
	   *
	   * - `object`: This flag contains the target of the assertion. For example, in
	   *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
	   *   contain `numKittens` so that the `equal` assertion can reference it when
	   *   needed.
	   *
	   * - `message`: This flag contains an optional custom error message to be
	   *   prepended to the error message that's generated by the assertion when it
	   *   fails.
	   *
	   * - `ssfi`: This flag stands for "start stack function indicator". It
	   *   contains a function reference that serves as the starting point for
	   *   removing frames from the stack trace of the error that's created by the
	   *   assertion when it fails. The goal is to provide a cleaner stack trace to
	   *   end users by removing Chai's internal functions. Note that it only works
	   *   in environments that support `Error.captureStackTrace`, and only when
	   *   `Chai.config.includeStack` hasn't been set to `false`.
	   *
	   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
	   *   should retain its current value, even as assertions are chained off of
	   *   this object. This is usually set to `true` when creating a new assertion
	   *   from within another assertion. It's also temporarily set to `true` before
	   *   an overwritten assertion gets called by the overwriting assertion.
	   *
	   * @param {Mixed} obj target of the assertion
	   * @param {String} msg (optional) custom error message
	   * @param {Function} ssfi (optional) starting point for removing stack frames
	   * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
	   * @api private
	   */

	  function Assertion (obj, msg, ssfi, lockSsfi) {
	    flag(this, 'ssfi', ssfi || Assertion);
	    flag(this, 'lockSsfi', lockSsfi);
	    flag(this, 'object', obj);
	    flag(this, 'message', msg);

	    return util.proxify(this);
	  }

	  Object.defineProperty(Assertion, 'includeStack', {
	    get: function() {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      return config$1.includeStack;
	    },
	    set: function(value) {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      config$1.includeStack = value;
	    }
	  });

	  Object.defineProperty(Assertion, 'showDiff', {
	    get: function() {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      return config$1.showDiff;
	    },
	    set: function(value) {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      config$1.showDiff = value;
	    }
	  });

	  Assertion.addProperty = function (name, fn) {
	    util.addProperty(this.prototype, name, fn);
	  };

	  Assertion.addMethod = function (name, fn) {
	    util.addMethod(this.prototype, name, fn);
	  };

	  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
	    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  Assertion.overwriteProperty = function (name, fn) {
	    util.overwriteProperty(this.prototype, name, fn);
	  };

	  Assertion.overwriteMethod = function (name, fn) {
	    util.overwriteMethod(this.prototype, name, fn);
	  };

	  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
	    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  /**
	   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
	   *
	   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
	   *
	   * @name assert
	   * @param {Philosophical} expression to be tested
	   * @param {String|Function} message or function that returns message to display if expression fails
	   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
	   * @param {Mixed} expected value (remember to check for negation)
	   * @param {Mixed} actual (optional) will default to `this.obj`
	   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
	   * @api private
	   */

	  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
	    var ok = util.test(this, arguments);
	    if (false !== showDiff) showDiff = true;
	    if (undefined === expected && undefined === _actual) showDiff = false;
	    if (true !== config$1.showDiff) showDiff = false;

	    if (!ok) {
	      msg = util.getMessage(this, arguments);
	      var actual = util.getActual(this, arguments);
	      var assertionErrorObjectProperties = {
	          actual: actual
	        , expected: expected
	        , showDiff: showDiff
	      };

	      var operator = util.getOperator(this, arguments);
	      if (operator) {
	        assertionErrorObjectProperties.operator = operator;
	      }

	      throw new AssertionError(
	        msg,
	        assertionErrorObjectProperties,
	        (config$1.includeStack) ? this.assert : flag(this, 'ssfi'));
	    }
	  };

	  /*!
	   * ### ._obj
	   *
	   * Quick reference to stored `actual` value for plugin developers.
	   *
	   * @api private
	   */

	  Object.defineProperty(Assertion.prototype, '_obj',
	    { get: function () {
	        return flag(this, 'object');
	      }
	    , set: function (val) {
	        flag(this, 'object', val);
	      }
	  });
	};

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var assertions = function (chai, _) {
	  var Assertion = chai.Assertion
	    , AssertionError = chai.AssertionError
	    , flag = _.flag;

	  /**
	   * ### Language Chains
	   *
	   * The following are provided as chainable getters to improve the readability
	   * of your assertions.
	   *
	   * **Chains**
	   *
	   * - to
	   * - be
	   * - been
	   * - is
	   * - that
	   * - which
	   * - and
	   * - has
	   * - have
	   * - with
	   * - at
	   * - of
	   * - same
	   * - but
	   * - does
	   * - still
	   * - also
	   *
	   * @name language chains
	   * @namespace BDD
	   * @api public
	   */

	  [ 'to', 'be', 'been', 'is'
	  , 'and', 'has', 'have', 'with'
	  , 'that', 'which', 'at', 'of'
	  , 'same', 'but', 'does', 'still', "also" ].forEach(function (chain) {
	    Assertion.addProperty(chain);
	  });

	  /**
	   * ### .not
	   *
	   * Negates all assertions that follow in the chain.
	   *
	   *     expect(function () {}).to.not.throw();
	   *     expect({a: 1}).to.not.have.property('b');
	   *     expect([1, 2]).to.be.an('array').that.does.not.include(3);
	   *
	   * Just because you can negate any assertion with `.not` doesn't mean you
	   * should. With great power comes great responsibility. It's often best to
	   * assert that the one expected output was produced, rather than asserting
	   * that one of countless unexpected outputs wasn't produced. See individual
	   * assertions for specific guidance.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.equal(1); // Not recommended
	   *
	   * @name not
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('not', function () {
	    flag(this, 'negate', true);
	  });

	  /**
	   * ### .deep
	   *
	   * Causes all `.equal`, `.include`, `.members`, `.keys`, and `.property`
	   * assertions that follow in the chain to use deep equality instead of strict
	   * (`===`) equality. See the `deep-eql` project page for info on the deep
	   * equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) equals `{a: 1}`
	   *     expect({a: 1}).to.deep.equal({a: 1});
	   *     expect({a: 1}).to.not.equal({a: 1});
	   *
	   *     // Target array deeply (but not strictly) includes `{a: 1}`
	   *     expect([{a: 1}]).to.deep.include({a: 1});
	   *     expect([{a: 1}]).to.not.include({a: 1});
	   *
	   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
	   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
	   *
	   *     // Target array deeply (but not strictly) has member `{a: 1}`
	   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
	   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
	   *
	   *     // Target set deeply (but not strictly) has key `{a: 1}`
	   *     expect(new Set([{a: 1}])).to.have.deep.keys([{a: 1}]);
	   *     expect(new Set([{a: 1}])).to.not.have.keys([{a: 1}]);
	   *
	   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
	   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
	   *
	   * @name deep
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('deep', function () {
	    flag(this, 'deep', true);
	  });

	  /**
	   * ### .nested
	   *
	   * Enables dot- and bracket-notation in all `.property` and `.include`
	   * assertions that follow in the chain.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
	   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
	   *     expect({'.a': {'[b]': 'x'}}).to.nested.include({'\\.a.\\[b\\]': 'x'});
	   *
	   * `.nested` cannot be combined with `.own`.
	   *
	   * @name nested
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('nested', function () {
	    flag(this, 'nested', true);
	  });

	  /**
	   * ### .own
	   *
	   * Causes all `.property` and `.include` assertions that follow in the chain
	   * to ignore inherited properties.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.have.own.property('a');
	   *     expect({a: 1}).to.have.property('b');
	   *     expect({a: 1}).to.not.have.own.property('b');
	   *
	   *     expect({a: 1}).to.own.include({a: 1});
	   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
	   *
	   * `.own` cannot be combined with `.nested`.
	   *
	   * @name own
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('own', function () {
	    flag(this, 'own', true);
	  });

	  /**
	   * ### .ordered
	   *
	   * Causes all `.members` assertions that follow in the chain to require that
	   * members be in the same order.
	   *
	   *     expect([1, 2]).to.have.ordered.members([1, 2])
	   *       .but.not.have.ordered.members([2, 1]);
	   *
	   * When `.include` and `.ordered` are combined, the ordering begins at the
	   * start of both arrays.
	   *
	   *     expect([1, 2, 3]).to.include.ordered.members([1, 2])
	   *       .but.not.include.ordered.members([2, 3]);
	   *
	   * @name ordered
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('ordered', function () {
	    flag(this, 'ordered', true);
	  });

	  /**
	   * ### .any
	   *
	   * Causes all `.keys` assertions that follow in the chain to only require that
	   * the target have at least one of the given keys. This is the opposite of
	   * `.all`, which requires that the target have all of the given keys.
	   *
	   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
	   *
	   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
	   *
	   * @name any
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('any', function () {
	    flag(this, 'any', true);
	    flag(this, 'all', false);
	  });

	  /**
	   * ### .all
	   *
	   * Causes all `.keys` assertions that follow in the chain to require that the
	   * target have all of the given keys. This is the opposite of `.any`, which
	   * only requires that the target have at least one of the given keys.
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *
	   * Note that `.all` is used by default when neither `.all` nor `.any` are
	   * added earlier in the chain. However, it's often best to add `.all` anyway
	   * because it improves readability.
	   *
	   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
	   *
	   * @name all
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('all', function () {
	    flag(this, 'all', true);
	    flag(this, 'any', false);
	  });

	  /**
	   * ### .a(type[, msg])
	   *
	   * Asserts that the target's type is equal to the given string `type`. Types
	   * are case insensitive. See the `type-detect` project page for info on the
	   * type detection algorithm: https://github.com/chaijs/type-detect.
	   *
	   *     expect('foo').to.be.a('string');
	   *     expect({a: 1}).to.be.an('object');
	   *     expect(null).to.be.a('null');
	   *     expect(undefined).to.be.an('undefined');
	   *     expect(new Error).to.be.an('error');
	   *     expect(Promise.resolve()).to.be.a('promise');
	   *     expect(new Float32Array).to.be.a('float32array');
	   *     expect(Symbol()).to.be.a('symbol');
	   *
	   * `.a` supports objects that have a custom type set via `Symbol.toStringTag`.
	   *
	   *     var myObj = {
	   *       [Symbol.toStringTag]: 'myCustomType'
	   *     };
	   *
	   *     expect(myObj).to.be.a('myCustomType').but.not.an('object');
	   *
	   * It's often best to use `.a` to check a target's type before making more
	   * assertions on the same target. That way, you avoid unexpected behavior from
	   * any assertion that does different things based on the target's type.
	   *
	   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
	   *     expect([]).to.be.an('array').that.is.empty;
	   *
	   * Add `.not` earlier in the chain to negate `.a`. However, it's often best to
	   * assert that the target is the expected type, rather than asserting that it
	   * isn't one of many unexpected types.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.an('array'); // Not recommended
	   *
	   * `.a` accepts an optional `msg` argument which is a custom error message to
	   * show when the assertion fails. The message can also be given as the second
	   * argument to `expect`.
	   *
	   *     expect(1).to.be.a('string', 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.a('string');
	   *
	   * `.a` can also be used as a language chain to improve the readability of
	   * your assertions.
	   *
	   *     expect({b: 2}).to.have.a.property('b');
	   *
	   * The alias `.an` can be used interchangeably with `.a`.
	   *
	   * @name a
	   * @alias an
	   * @param {String} type
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function an (type, msg) {
	    if (msg) flag(this, 'message', msg);
	    type = type.toLowerCase();
	    var obj = flag(this, 'object')
	      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

	    this.assert(
	        type === _.type(obj).toLowerCase()
	      , 'expected #{this} to be ' + article + type
	      , 'expected #{this} not to be ' + article + type
	    );
	  }

	  Assertion.addChainableMethod('an', an);
	  Assertion.addChainableMethod('a', an);

	  /**
	   * ### .include(val[, msg])
	   *
	   * When the target is a string, `.include` asserts that the given string `val`
	   * is a substring of the target.
	   *
	   *     expect('foobar').to.include('foo');
	   *
	   * When the target is an array, `.include` asserts that the given `val` is a
	   * member of the target.
	   *
	   *     expect([1, 2, 3]).to.include(2);
	   *
	   * When the target is an object, `.include` asserts that the given object
	   * `val`'s properties are a subset of the target's properties.
	   *
	   *     expect({a: 1, b: 2, c: 3}).to.include({a: 1, b: 2});
	   *
	   * When the target is a Set or WeakSet, `.include` asserts that the given `val` is a
	   * member of the target. SameValueZero equality algorithm is used.
	   *
	   *     expect(new Set([1, 2])).to.include(2);
	   *
	   * When the target is a Map, `.include` asserts that the given `val` is one of
	   * the values of the target. SameValueZero equality algorithm is used.
	   *
	   *     expect(new Map([['a', 1], ['b', 2]])).to.include(2);
	   *
	   * Because `.include` does different things based on the target's type, it's
	   * important to check the target's type before using `.include`. See the `.a`
	   * doc for info on testing a target's type.
	   *
	   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
	   *
	   * By default, strict (`===`) equality is used to compare array members and
	   * object properties. Add `.deep` earlier in the chain to use deep equality
	   * instead (WeakSet targets are not supported). See the `deep-eql` project
	   * page for info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target array deeply (but not strictly) includes `{a: 1}`
	   *     expect([{a: 1}]).to.deep.include({a: 1});
	   *     expect([{a: 1}]).to.not.include({a: 1});
	   *
	   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
	   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
	   *
	   * By default, all of the target's properties are searched when working with
	   * objects. This includes properties that are inherited and/or non-enumerable.
	   * Add `.own` earlier in the chain to exclude the target's inherited
	   * properties from the search.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.own.include({a: 1});
	   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
	   *
	   * Note that a target object is always only searched for `val`'s own
	   * enumerable properties.
	   *
	   * `.deep` and `.own` can be combined.
	   *
	   *     expect({a: {b: 2}}).to.deep.own.include({a: {b: 2}});
	   *
	   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
	   * referencing nested properties.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 2}}).to.nested.include({'\\.a.\\[b\\]': 2});
	   *
	   * `.deep` and `.nested` can be combined.
	   *
	   *     expect({a: {b: [{c: 3}]}}).to.deep.nested.include({'a.b[0]': {c: 3}});
	   *
	   * `.own` and `.nested` cannot be combined.
	   *
	   * Add `.not` earlier in the chain to negate `.include`.
	   *
	   *     expect('foobar').to.not.include('taco');
	   *     expect([1, 2, 3]).to.not.include(4);
	   *
	   * However, it's dangerous to negate `.include` when the target is an object.
	   * The problem is that it creates uncertain expectations by asserting that the
	   * target object doesn't have all of `val`'s key/value pairs but may or may
	   * not have some of them. It's often best to identify the exact output that's
	   * expected, and then write an assertion that only accepts that exact output.
	   *
	   * When the target object isn't even expected to have `val`'s keys, it's
	   * often best to assert exactly that.
	   *
	   *     expect({c: 3}).to.not.have.any.keys('a', 'b'); // Recommended
	   *     expect({c: 3}).to.not.include({a: 1, b: 2}); // Not recommended
	   *
	   * When the target object is expected to have `val`'s keys, it's often best to
	   * assert that each of the properties has its expected value, rather than
	   * asserting that each property doesn't have one of many unexpected values.
	   *
	   *     expect({a: 3, b: 4}).to.include({a: 3, b: 4}); // Recommended
	   *     expect({a: 3, b: 4}).to.not.include({a: 1, b: 2}); // Not recommended
	   *
	   * `.include` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2, 3]).to.include(4, 'nooo why fail??');
	   *     expect([1, 2, 3], 'nooo why fail??').to.include(4);
	   *
	   * `.include` can also be used as a language chain, causing all `.members` and
	   * `.keys` assertions that follow in the chain to require the target to be a
	   * superset of the expected set, rather than an identical set. Note that
	   * `.members` ignores duplicates in the subset when `.include` is added.
	   *
	   *     // Target object's keys are a superset of ['a', 'b'] but not identical
	   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
	   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
	   *
	   *     // Target array is a superset of [1, 2] but not identical
	   *     expect([1, 2, 3]).to.include.members([1, 2]);
	   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
	   *
	   *     // Duplicates in the subset are ignored
	   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
	   *
	   * Note that adding `.any` earlier in the chain causes the `.keys` assertion
	   * to ignore `.include`.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1}).to.include.any.keys('a', 'b');
	   *     expect({a: 1}).to.have.any.keys('a', 'b');
	   *
	   * The aliases `.includes`, `.contain`, and `.contains` can be used
	   * interchangeably with `.include`.
	   *
	   * @name include
	   * @alias contain
	   * @alias includes
	   * @alias contains
	   * @param {Mixed} val
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function SameValueZero(a, b) {
	    return (_.isNaN(a) && _.isNaN(b)) || a === b;
	  }

	  function includeChainingBehavior () {
	    flag(this, 'contains', true);
	  }

	  function include (val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var obj = flag(this, 'object')
	      , objType = _.type(obj).toLowerCase()
	      , flagMsg = flag(this, 'message')
	      , negate = flag(this, 'negate')
	      , ssfi = flag(this, 'ssfi')
	      , isDeep = flag(this, 'deep')
	      , descriptor = isDeep ? 'deep ' : '';

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    var included = false;

	    switch (objType) {
	      case 'string':
	        included = obj.indexOf(val) !== -1;
	        break;

	      case 'weakset':
	        if (isDeep) {
	          throw new AssertionError(
	            flagMsg + 'unable to use .deep.include with WeakSet',
	            undefined,
	            ssfi
	          );
	        }

	        included = obj.has(val);
	        break;

	      case 'map':
	        var isEql = isDeep ? _.eql : SameValueZero;
	        obj.forEach(function (item) {
	          included = included || isEql(item, val);
	        });
	        break;

	      case 'set':
	        if (isDeep) {
	          obj.forEach(function (item) {
	            included = included || _.eql(item, val);
	          });
	        } else {
	          included = obj.has(val);
	        }
	        break;

	      case 'array':
	        if (isDeep) {
	          included = obj.some(function (item) {
	            return _.eql(item, val);
	          });
	        } else {
	          included = obj.indexOf(val) !== -1;
	        }
	        break;

	      default:
	        // This block is for asserting a subset of properties in an object.
	        // `_.expectTypes` isn't used here because `.include` should work with
	        // objects with a custom `@@toStringTag`.
	        if (val !== Object(val)) {
	          throw new AssertionError(
	            flagMsg + 'the given combination of arguments ('
	            + objType + ' and '
	            + _.type(val).toLowerCase() + ')'
	            + ' is invalid for this assertion. '
	            + 'You can use an array, a map, an object, a set, a string, '
	            + 'or a weakset instead of a '
	            + _.type(val).toLowerCase(),
	            undefined,
	            ssfi
	          );
	        }

	        var props = Object.keys(val)
	          , firstErr = null
	          , numErrs = 0;

	        props.forEach(function (prop) {
	          var propAssertion = new Assertion(obj);
	          _.transferFlags(this, propAssertion, true);
	          flag(propAssertion, 'lockSsfi', true);

	          if (!negate || props.length === 1) {
	            propAssertion.property(prop, val[prop]);
	            return;
	          }

	          try {
	            propAssertion.property(prop, val[prop]);
	          } catch (err) {
	            if (!_.checkError.compatibleConstructor(err, AssertionError)) {
	              throw err;
	            }
	            if (firstErr === null) firstErr = err;
	            numErrs++;
	          }
	        }, this);

	        // When validating .not.include with multiple properties, we only want
	        // to throw an assertion error if all of the properties are included,
	        // in which case we throw the first property assertion error that we
	        // encountered.
	        if (negate && props.length > 1 && numErrs === props.length) {
	          throw firstErr;
	        }
	        return;
	    }

	    // Assert inclusion in collection or substring in a string.
	    this.assert(
	      included
	      , 'expected #{this} to ' + descriptor + 'include ' + _.inspect(val)
	      , 'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val));
	  }

	  Assertion.addChainableMethod('include', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
	  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

	  /**
	   * ### .ok
	   *
	   * Asserts that the target is a truthy value (considered `true` in boolean context).
	   * However, it's often best to assert that the target is strictly (`===`) or
	   * deeply equal to its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.ok; // Not recommended
	   *
	   *     expect(true).to.be.true; // Recommended
	   *     expect(true).to.be.ok; // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.ok`.
	   *
	   *     expect(0).to.equal(0); // Recommended
	   *     expect(0).to.not.be.ok; // Not recommended
	   *
	   *     expect(false).to.be.false; // Recommended
	   *     expect(false).to.not.be.ok; // Not recommended
	   *
	   *     expect(null).to.be.null; // Recommended
	   *     expect(null).to.not.be.ok; // Not recommended
	   *
	   *     expect(undefined).to.be.undefined; // Recommended
	   *     expect(undefined).to.not.be.ok; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(false, 'nooo why fail??').to.be.ok;
	   *
	   * @name ok
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('ok', function () {
	    this.assert(
	        flag(this, 'object')
	      , 'expected #{this} to be truthy'
	      , 'expected #{this} to be falsy');
	  });

	  /**
	   * ### .true
	   *
	   * Asserts that the target is strictly (`===`) equal to `true`.
	   *
	   *     expect(true).to.be.true;
	   *
	   * Add `.not` earlier in the chain to negate `.true`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `true`.
	   *
	   *     expect(false).to.be.false; // Recommended
	   *     expect(false).to.not.be.true; // Not recommended
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.true; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(false, 'nooo why fail??').to.be.true;
	   *
	   * @name true
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('true', function () {
	    this.assert(
	        true === flag(this, 'object')
	      , 'expected #{this} to be true'
	      , 'expected #{this} to be false'
	      , flag(this, 'negate') ? false : true
	    );
	  });

	  /**
	   * ### .false
	   *
	   * Asserts that the target is strictly (`===`) equal to `false`.
	   *
	   *     expect(false).to.be.false;
	   *
	   * Add `.not` earlier in the chain to negate `.false`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to `false`.
	   *
	   *     expect(true).to.be.true; // Recommended
	   *     expect(true).to.not.be.false; // Not recommended
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.false; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(true, 'nooo why fail??').to.be.false;
	   *
	   * @name false
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('false', function () {
	    this.assert(
	        false === flag(this, 'object')
	      , 'expected #{this} to be false'
	      , 'expected #{this} to be true'
	      , flag(this, 'negate') ? true : false
	    );
	  });

	  /**
	   * ### .null
	   *
	   * Asserts that the target is strictly (`===`) equal to `null`.
	   *
	   *     expect(null).to.be.null;
	   *
	   * Add `.not` earlier in the chain to negate `.null`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `null`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.null; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.null;
	   *
	   * @name null
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('null', function () {
	    this.assert(
	        null === flag(this, 'object')
	      , 'expected #{this} to be null'
	      , 'expected #{this} not to be null'
	    );
	  });

	  /**
	   * ### .undefined
	   *
	   * Asserts that the target is strictly (`===`) equal to `undefined`.
	   *
	   *     expect(undefined).to.be.undefined;
	   *
	   * Add `.not` earlier in the chain to negate `.undefined`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to `undefined`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.undefined; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.undefined;
	   *
	   * @name undefined
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('undefined', function () {
	    this.assert(
	        undefined === flag(this, 'object')
	      , 'expected #{this} to be undefined'
	      , 'expected #{this} not to be undefined'
	    );
	  });

	  /**
	   * ### .NaN
	   *
	   * Asserts that the target is exactly `NaN`.
	   *
	   *     expect(NaN).to.be.NaN;
	   *
	   * Add `.not` earlier in the chain to negate `.NaN`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `NaN`.
	   *
	   *     expect('foo').to.equal('foo'); // Recommended
	   *     expect('foo').to.not.be.NaN; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.NaN;
	   *
	   * @name NaN
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('NaN', function () {
	    this.assert(
	        _.isNaN(flag(this, 'object'))
	        , 'expected #{this} to be NaN'
	        , 'expected #{this} not to be NaN'
	    );
	  });

	  /**
	   * ### .exist
	   *
	   * Asserts that the target is not strictly (`===`) equal to either `null` or
	   * `undefined`. However, it's often best to assert that the target is equal to
	   * its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.exist; // Not recommended
	   *
	   *     expect(0).to.equal(0); // Recommended
	   *     expect(0).to.exist; // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.exist`.
	   *
	   *     expect(null).to.be.null; // Recommended
	   *     expect(null).to.not.exist; // Not recommended
	   *
	   *     expect(undefined).to.be.undefined; // Recommended
	   *     expect(undefined).to.not.exist; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(null, 'nooo why fail??').to.exist;
	   *
	   * The alias `.exists` can be used interchangeably with `.exist`.
	   *
	   * @name exist
	   * @alias exists
	   * @namespace BDD
	   * @api public
	   */

	  function assertExist () {
	    var val = flag(this, 'object');
	    this.assert(
	        val !== null && val !== undefined
	      , 'expected #{this} to exist'
	      , 'expected #{this} to not exist'
	    );
	  }

	  Assertion.addProperty('exist', assertExist);
	  Assertion.addProperty('exists', assertExist);

	  /**
	   * ### .empty
	   *
	   * When the target is a string or array, `.empty` asserts that the target's
	   * `length` property is strictly (`===`) equal to `0`.
	   *
	   *     expect([]).to.be.empty;
	   *     expect('').to.be.empty;
	   *
	   * When the target is a map or set, `.empty` asserts that the target's `size`
	   * property is strictly equal to `0`.
	   *
	   *     expect(new Set()).to.be.empty;
	   *     expect(new Map()).to.be.empty;
	   *
	   * When the target is a non-function object, `.empty` asserts that the target
	   * doesn't have any own enumerable properties. Properties with Symbol-based
	   * keys are excluded from the count.
	   *
	   *     expect({}).to.be.empty;
	   *
	   * Because `.empty` does different things based on the target's type, it's
	   * important to check the target's type before using `.empty`. See the `.a`
	   * doc for info on testing a target's type.
	   *
	   *     expect([]).to.be.an('array').that.is.empty;
	   *
	   * Add `.not` earlier in the chain to negate `.empty`. However, it's often
	   * best to assert that the target contains its expected number of values,
	   * rather than asserting that it's not empty.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.not.be.empty; // Not recommended
	   *
	   *     expect(new Set([1, 2, 3])).to.have.property('size', 3); // Recommended
	   *     expect(new Set([1, 2, 3])).to.not.be.empty; // Not recommended
	   *
	   *     expect(Object.keys({a: 1})).to.have.lengthOf(1); // Recommended
	   *     expect({a: 1}).to.not.be.empty; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect([1, 2, 3], 'nooo why fail??').to.be.empty;
	   *
	   * @name empty
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('empty', function () {
	    var val = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , flagMsg = flag(this, 'message')
	      , itemsCount;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    switch (_.type(val).toLowerCase()) {
	      case 'array':
	      case 'string':
	        itemsCount = val.length;
	        break;
	      case 'map':
	      case 'set':
	        itemsCount = val.size;
	        break;
	      case 'weakmap':
	      case 'weakset':
	        throw new AssertionError(
	          flagMsg + '.empty was passed a weak collection',
	          undefined,
	          ssfi
	        );
	      case 'function':
	        var msg = flagMsg + '.empty was passed a function ' + _.getName(val);
	        throw new AssertionError(msg.trim(), undefined, ssfi);
	      default:
	        if (val !== Object(val)) {
	          throw new AssertionError(
	            flagMsg + '.empty was passed non-string primitive ' + _.inspect(val),
	            undefined,
	            ssfi
	          );
	        }
	        itemsCount = Object.keys(val).length;
	    }

	    this.assert(
	        0 === itemsCount
	      , 'expected #{this} to be empty'
	      , 'expected #{this} not to be empty'
	    );
	  });

	  /**
	   * ### .arguments
	   *
	   * Asserts that the target is an `arguments` object.
	   *
	   *     function test () {
	   *       expect(arguments).to.be.arguments;
	   *     }
	   *
	   *     test();
	   *
	   * Add `.not` earlier in the chain to negate `.arguments`. However, it's often
	   * best to assert which type the target is expected to be, rather than
	   * asserting that it’s not an `arguments` object.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.arguments; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({}, 'nooo why fail??').to.be.arguments;
	   *
	   * The alias `.Arguments` can be used interchangeably with `.arguments`.
	   *
	   * @name arguments
	   * @alias Arguments
	   * @namespace BDD
	   * @api public
	   */

	  function checkArguments () {
	    var obj = flag(this, 'object')
	      , type = _.type(obj);
	    this.assert(
	        'Arguments' === type
	      , 'expected #{this} to be arguments but got ' + type
	      , 'expected #{this} to not be arguments'
	    );
	  }

	  Assertion.addProperty('arguments', checkArguments);
	  Assertion.addProperty('Arguments', checkArguments);

	  /**
	   * ### .equal(val[, msg])
	   *
	   * Asserts that the target is strictly (`===`) equal to the given `val`.
	   *
	   *     expect(1).to.equal(1);
	   *     expect('foo').to.equal('foo');
	   *
	   * Add `.deep` earlier in the chain to use deep equality instead. See the
	   * `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) equals `{a: 1}`
	   *     expect({a: 1}).to.deep.equal({a: 1});
	   *     expect({a: 1}).to.not.equal({a: 1});
	   *
	   *     // Target array deeply (but not strictly) equals `[1, 2]`
	   *     expect([1, 2]).to.deep.equal([1, 2]);
	   *     expect([1, 2]).to.not.equal([1, 2]);
	   *
	   * Add `.not` earlier in the chain to negate `.equal`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to one of countless unexpected values.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.equal(2); // Not recommended
	   *
	   * `.equal` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.equal(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.equal(2);
	   *
	   * The aliases `.equals` and `eq` can be used interchangeably with `.equal`.
	   *
	   * @name equal
	   * @alias equals
	   * @alias eq
	   * @param {Mixed} val
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertEqual (val, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'deep')) {
	      var prevLockSsfi = flag(this, 'lockSsfi');
	      flag(this, 'lockSsfi', true);
	      this.eql(val);
	      flag(this, 'lockSsfi', prevLockSsfi);
	    } else {
	      this.assert(
	          val === obj
	        , 'expected #{this} to equal #{exp}'
	        , 'expected #{this} to not equal #{exp}'
	        , val
	        , this._obj
	        , true
	      );
	    }
	  }

	  Assertion.addMethod('equal', assertEqual);
	  Assertion.addMethod('equals', assertEqual);
	  Assertion.addMethod('eq', assertEqual);

	  /**
	   * ### .eql(obj[, msg])
	   *
	   * Asserts that the target is deeply equal to the given `obj`. See the
	   * `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object is deeply (but not strictly) equal to {a: 1}
	   *     expect({a: 1}).to.eql({a: 1}).but.not.equal({a: 1});
	   *
	   *     // Target array is deeply (but not strictly) equal to [1, 2]
	   *     expect([1, 2]).to.eql([1, 2]).but.not.equal([1, 2]);
	   *
	   * Add `.not` earlier in the chain to negate `.eql`. However, it's often best
	   * to assert that the target is deeply equal to its expected value, rather
	   * than not deeply equal to one of countless unexpected values.
	   *
	   *     expect({a: 1}).to.eql({a: 1}); // Recommended
	   *     expect({a: 1}).to.not.eql({b: 2}); // Not recommended
	   *
	   * `.eql` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect({a: 1}).to.eql({b: 2}, 'nooo why fail??');
	   *     expect({a: 1}, 'nooo why fail??').to.eql({b: 2});
	   *
	   * The alias `.eqls` can be used interchangeably with `.eql`.
	   *
	   * The `.deep.equal` assertion is almost identical to `.eql` but with one
	   * difference: `.deep.equal` causes deep equality comparisons to also be used
	   * for any other assertions that follow in the chain.
	   *
	   * @name eql
	   * @alias eqls
	   * @param {Mixed} obj
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertEql(obj, msg) {
	    if (msg) flag(this, 'message', msg);
	    this.assert(
	        _.eql(obj, flag(this, 'object'))
	      , 'expected #{this} to deeply equal #{exp}'
	      , 'expected #{this} to not deeply equal #{exp}'
	      , obj
	      , this._obj
	      , true
	    );
	  }

	  Assertion.addMethod('eql', assertEql);
	  Assertion.addMethod('eqls', assertEql);

	  /**
	   * ### .above(n[, msg])
	   *
	   * Asserts that the target is a number or a date greater than the given number or date `n` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.above(1); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.above(2); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.above(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.above`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(1).to.not.be.above(2); // Not recommended
	   *
	   * `.above` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.above(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.above(2);
	   *
	   * The aliases `.gt` and `.greaterThan` can be used interchangeably with
	   * `.above`.
	   *
	   * @name above
	   * @alias gt
	   * @alias greaterThan
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertAbove (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to above must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to above must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount > n
	        , 'expected #{this} to have a ' + descriptor + ' above #{exp} but got #{act}'
	        , 'expected #{this} to not have a ' + descriptor + ' above #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj > n
	        , 'expected #{this} to be above #{exp}'
	        , 'expected #{this} to be at most #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('above', assertAbove);
	  Assertion.addMethod('gt', assertAbove);
	  Assertion.addMethod('greaterThan', assertAbove);

	  /**
	   * ### .least(n[, msg])
	   *
	   * Asserts that the target is a number or a date greater than or equal to the given
	   * number or date `n` respectively. However, it's often best to assert that the target is equal to
	   * its expected value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.at.least(1); // Not recommended
	   *     expect(2).to.be.at.least(2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than or equal to the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.at.least(2); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.at.least(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.least`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.at.least(2); // Not recommended
	   *
	   * `.least` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.at.least(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.at.least(2);
	   *
	   * The aliases `.gte` and `.greaterThanOrEqual` can be used interchangeably with
	   * `.least`.
	   *
	   * @name least
	   * @alias gte
	   * @alias greaterThanOrEqual
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertLeast (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to least must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to least must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount >= n
	        , 'expected #{this} to have a ' + descriptor + ' at least #{exp} but got #{act}'
	        , 'expected #{this} to have a ' + descriptor + ' below #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj >= n
	        , 'expected #{this} to be at least #{exp}'
	        , 'expected #{this} to be below #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('least', assertLeast);
	  Assertion.addMethod('gte', assertLeast);
	  Assertion.addMethod('greaterThanOrEqual', assertLeast);

	  /**
	   * ### .below(n[, msg])
	   *
	   * Asserts that the target is a number or a date less than the given number or date `n` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.below(2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is less than the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.below(4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.length(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.below(4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.below`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.be.below(1); // Not recommended
	   *
	   * `.below` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(2).to.be.below(1, 'nooo why fail??');
	   *     expect(2, 'nooo why fail??').to.be.below(1);
	   *
	   * The aliases `.lt` and `.lessThan` can be used interchangeably with
	   * `.below`.
	   *
	   * @name below
	   * @alias lt
	   * @alias lessThan
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertBelow (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to below must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to below must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount < n
	        , 'expected #{this} to have a ' + descriptor + ' below #{exp} but got #{act}'
	        , 'expected #{this} to not have a ' + descriptor + ' below #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj < n
	        , 'expected #{this} to be below #{exp}'
	        , 'expected #{this} to be at least #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('below', assertBelow);
	  Assertion.addMethod('lt', assertBelow);
	  Assertion.addMethod('lessThan', assertBelow);

	  /**
	   * ### .most(n[, msg])
	   *
	   * Asserts that the target is a number or a date less than or equal to the given number
	   * or date `n` respectively. However, it's often best to assert that the target is equal to its
	   * expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.at.most(2); // Not recommended
	   *     expect(1).to.be.at.most(1); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is less than or equal to the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.at.most(4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.at.most(4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.most`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.be.at.most(1); // Not recommended
	   *
	   * `.most` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(2).to.be.at.most(1, 'nooo why fail??');
	   *     expect(2, 'nooo why fail??').to.be.at.most(1);
	   *
	   * The aliases `.lte` and `.lessThanOrEqual` can be used interchangeably with
	   * `.most`.
	   *
	   * @name most
	   * @alias lte
	   * @alias lessThanOrEqual
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertMost (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to most must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to most must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount <= n
	        , 'expected #{this} to have a ' + descriptor + ' at most #{exp} but got #{act}'
	        , 'expected #{this} to have a ' + descriptor + ' above #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj <= n
	        , 'expected #{this} to be at most #{exp}'
	        , 'expected #{this} to be above #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('most', assertMost);
	  Assertion.addMethod('lte', assertMost);
	  Assertion.addMethod('lessThanOrEqual', assertMost);

	  /**
	   * ### .within(start, finish[, msg])
	   *
	   * Asserts that the target is a number or a date greater than or equal to the given
	   * number or date `start`, and less than or equal to the given number or date `finish` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.within(1, 3); // Not recommended
	   *     expect(2).to.be.within(2, 3); // Not recommended
	   *     expect(2).to.be.within(1, 2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than or equal to the given number `start`, and less
	   * than or equal to the given number `finish`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.within(2, 4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.within(2, 4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.within`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.within(2, 4); // Not recommended
	   *
	   * `.within` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(4).to.be.within(1, 3, 'nooo why fail??');
	   *     expect(4, 'nooo why fail??').to.be.within(1, 3);
	   *
	   * @name within
	   * @param {Number} start lower bound inclusive
	   * @param {Number} finish upper bound inclusive
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('within', function (start, finish, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , startType = _.type(start).toLowerCase()
	      , finishType = _.type(finish).toLowerCase()
	      , errorMessage
	      , shouldThrow = true
	      , range = (startType === 'date' && finishType === 'date')
	          ? start.toISOString() + '..' + finish.toISOString()
	          : start + '..' + finish;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && (startType !== 'date' || finishType !== 'date'))) {
	      errorMessage = msgPrefix + 'the arguments to within must be dates';
	    } else if ((startType !== 'number' || finishType !== 'number') && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the arguments to within must be numbers';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount >= start && itemsCount <= finish
	        , 'expected #{this} to have a ' + descriptor + ' within ' + range
	        , 'expected #{this} to not have a ' + descriptor + ' within ' + range
	      );
	    } else {
	      this.assert(
	          obj >= start && obj <= finish
	        , 'expected #{this} to be within ' + range
	        , 'expected #{this} to not be within ' + range
	      );
	    }
	  });

	  /**
	   * ### .instanceof(constructor[, msg])
	   *
	   * Asserts that the target is an instance of the given `constructor`.
	   *
	   *     function Cat () { }
	   *
	   *     expect(new Cat()).to.be.an.instanceof(Cat);
	   *     expect([1, 2]).to.be.an.instanceof(Array);
	   *
	   * Add `.not` earlier in the chain to negate `.instanceof`.
	   *
	   *     expect({a: 1}).to.not.be.an.instanceof(Array);
	   *
	   * `.instanceof` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1).to.be.an.instanceof(Array, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.an.instanceof(Array);
	   *
	   * Due to limitations in ES5, `.instanceof` may not always work as expected
	   * when using a transpiler such as Babel or TypeScript. In particular, it may
	   * produce unexpected results when subclassing built-in object such as
	   * `Array`, `Error`, and `Map`. See your transpiler's docs for details:
	   *
	   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
	   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
	   *
	   * The alias `.instanceOf` can be used interchangeably with `.instanceof`.
	   *
	   * @name instanceof
	   * @param {Constructor} constructor
	   * @param {String} msg _optional_
	   * @alias instanceOf
	   * @namespace BDD
	   * @api public
	   */

	  function assertInstanceOf (constructor, msg) {
	    if (msg) flag(this, 'message', msg);

	    var target = flag(this, 'object');
	    var ssfi = flag(this, 'ssfi');
	    var flagMsg = flag(this, 'message');

	    try {
	      var isInstanceOf = target instanceof constructor;
	    } catch (err) {
	      if (err instanceof TypeError) {
	        flagMsg = flagMsg ? flagMsg + ': ' : '';
	        throw new AssertionError(
	          flagMsg + 'The instanceof assertion needs a constructor but '
	            + _.type(constructor) + ' was given.',
	          undefined,
	          ssfi
	        );
	      }
	      throw err;
	    }

	    var name = _.getName(constructor);
	    if (name === null) {
	      name = 'an unnamed constructor';
	    }

	    this.assert(
	        isInstanceOf
	      , 'expected #{this} to be an instance of ' + name
	      , 'expected #{this} to not be an instance of ' + name
	    );
	  };

	  Assertion.addMethod('instanceof', assertInstanceOf);
	  Assertion.addMethod('instanceOf', assertInstanceOf);

	  /**
	   * ### .property(name[, val[, msg]])
	   *
	   * Asserts that the target has a property with the given key `name`.
	   *
	   *     expect({a: 1}).to.have.property('a');
	   *
	   * When `val` is provided, `.property` also asserts that the property's value
	   * is equal to the given `val`.
	   *
	   *     expect({a: 1}).to.have.property('a', 1);
	   *
	   * By default, strict (`===`) equality is used. Add `.deep` earlier in the
	   * chain to use deep equality instead. See the `deep-eql` project page for
	   * info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
	   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
	   *
	   * The target's enumerable and non-enumerable properties are always included
	   * in the search. By default, both own and inherited properties are included.
	   * Add `.own` earlier in the chain to exclude inherited properties from the
	   * search.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.have.own.property('a');
	   *     expect({a: 1}).to.have.own.property('a', 1);
	   *     expect({a: 1}).to.have.property('b');
	   *     expect({a: 1}).to.not.have.own.property('b');
	   *
	   * `.deep` and `.own` can be combined.
	   *
	   *     expect({x: {a: 1}}).to.have.deep.own.property('x', {a: 1});
	   *
	   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
	   * referencing nested properties.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]', 'y');
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
	   *
	   * `.deep` and `.nested` can be combined.
	   *
	   *     expect({a: {b: [{c: 3}]}})
	   *       .to.have.deep.nested.property('a.b[0]', {c: 3});
	   *
	   * `.own` and `.nested` cannot be combined.
	   *
	   * Add `.not` earlier in the chain to negate `.property`.
	   *
	   *     expect({a: 1}).to.not.have.property('b');
	   *
	   * However, it's dangerous to negate `.property` when providing `val`. The
	   * problem is that it creates uncertain expectations by asserting that the
	   * target either doesn't have a property with the given key `name`, or that it
	   * does have a property with the given key `name` but its value isn't equal to
	   * the given `val`. It's often best to identify the exact output that's
	   * expected, and then write an assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to have a property with the given key
	   * `name`, it's often best to assert exactly that.
	   *
	   *     expect({b: 2}).to.not.have.property('a'); // Recommended
	   *     expect({b: 2}).to.not.have.property('a', 1); // Not recommended
	   *
	   * When the target is expected to have a property with the given key `name`,
	   * it's often best to assert that the property has its expected value, rather
	   * than asserting that it doesn't have one of many unexpected values.
	   *
	   *     expect({a: 3}).to.have.property('a', 3); // Recommended
	   *     expect({a: 3}).to.not.have.property('a', 1); // Not recommended
	   *
	   * `.property` changes the target of any assertions that follow in the chain
	   * to be the value of the property from the original target object.
	   *
	   *     expect({a: 1}).to.have.property('a').that.is.a('number');
	   *
	   * `.property` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing `val`, only use the
	   * second form.
	   *
	   *     // Recommended
	   *     expect({a: 1}).to.have.property('a', 2, 'nooo why fail??');
	   *     expect({a: 1}, 'nooo why fail??').to.have.property('a', 2);
	   *     expect({a: 1}, 'nooo why fail??').to.have.property('b');
	   *
	   *     // Not recommended
	   *     expect({a: 1}).to.have.property('b', undefined, 'nooo why fail??');
	   *
	   * The above assertion isn't the same thing as not providing `val`. Instead,
	   * it's asserting that the target object has a `b` property that's equal to
	   * `undefined`.
	   *
	   * The assertions `.ownProperty` and `.haveOwnProperty` can be used
	   * interchangeably with `.own.property`.
	   *
	   * @name property
	   * @param {String} name
	   * @param {Mixed} val (optional)
	   * @param {String} msg _optional_
	   * @returns value of property for chaining
	   * @namespace BDD
	   * @api public
	   */

	  function assertProperty (name, val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var isNested = flag(this, 'nested')
	      , isOwn = flag(this, 'own')
	      , flagMsg = flag(this, 'message')
	      , obj = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , nameType = typeof name;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    if (isNested) {
	      if (nameType !== 'string') {
	        throw new AssertionError(
	          flagMsg + 'the argument to property must be a string when using nested syntax',
	          undefined,
	          ssfi
	        );
	      }
	    } else {
	      if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol') {
	        throw new AssertionError(
	          flagMsg + 'the argument to property must be a string, number, or symbol',
	          undefined,
	          ssfi
	        );
	      }
	    }

	    if (isNested && isOwn) {
	      throw new AssertionError(
	        flagMsg + 'The "nested" and "own" flags cannot be combined.',
	        undefined,
	        ssfi
	      );
	    }

	    if (obj === null || obj === undefined) {
	      throw new AssertionError(
	        flagMsg + 'Target cannot be null or undefined.',
	        undefined,
	        ssfi
	      );
	    }

	    var isDeep = flag(this, 'deep')
	      , negate = flag(this, 'negate')
	      , pathInfo = isNested ? _.getPathInfo(obj, name) : null
	      , value = isNested ? pathInfo.value : obj[name];

	    var descriptor = '';
	    if (isDeep) descriptor += 'deep ';
	    if (isOwn) descriptor += 'own ';
	    if (isNested) descriptor += 'nested ';
	    descriptor += 'property ';

	    var hasProperty;
	    if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
	    else if (isNested) hasProperty = pathInfo.exists;
	    else hasProperty = _.hasProperty(obj, name);

	    // When performing a negated assertion for both name and val, merely having
	    // a property with the given name isn't enough to cause the assertion to
	    // fail. It must both have a property with the given name, and the value of
	    // that property must equal the given val. Therefore, skip this assertion in
	    // favor of the next.
	    if (!negate || arguments.length === 1) {
	      this.assert(
	          hasProperty
	        , 'expected #{this} to have ' + descriptor + _.inspect(name)
	        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
	    }

	    if (arguments.length > 1) {
	      this.assert(
	          hasProperty && (isDeep ? _.eql(val, value) : val === value)
	        , 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
	        , 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}'
	        , val
	        , value
	      );
	    }

	    flag(this, 'object', value);
	  }

	  Assertion.addMethod('property', assertProperty);

	  function assertOwnProperty (name, value, msg) {
	    flag(this, 'own', true);
	    assertProperty.apply(this, arguments);
	  }

	  Assertion.addMethod('ownProperty', assertOwnProperty);
	  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

	  /**
	   * ### .ownPropertyDescriptor(name[, descriptor[, msg]])
	   *
	   * Asserts that the target has its own property descriptor with the given key
	   * `name`. Enumerable and non-enumerable properties are included in the
	   * search.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a');
	   *
	   * When `descriptor` is provided, `.ownPropertyDescriptor` also asserts that
	   * the property's descriptor is deeply equal to the given `descriptor`. See
	   * the `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * Add `.not` earlier in the chain to negate `.ownPropertyDescriptor`.
	   *
	   *     expect({a: 1}).to.not.have.ownPropertyDescriptor('b');
	   *
	   * However, it's dangerous to negate `.ownPropertyDescriptor` when providing
	   * a `descriptor`. The problem is that it creates uncertain expectations by
	   * asserting that the target either doesn't have a property descriptor with
	   * the given key `name`, or that it does have a property descriptor with the
	   * given key `name` but it’s not deeply equal to the given `descriptor`. It's
	   * often best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to have a property descriptor with the given
	   * key `name`, it's often best to assert exactly that.
	   *
	   *     // Recommended
	   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a');
	   *
	   *     // Not recommended
	   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * When the target is expected to have a property descriptor with the given
	   * key `name`, it's often best to assert that the property has its expected
	   * descriptor, rather than asserting that it doesn't have one of many
	   * unexpected descriptors.
	   *
	   *     // Recommended
	   *     expect({a: 3}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 3,
	   *     });
	   *
	   *     // Not recommended
	   *     expect({a: 3}).to.not.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * `.ownPropertyDescriptor` changes the target of any assertions that follow
	   * in the chain to be the value of the property descriptor from the original
	   * target object.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a')
	   *       .that.has.property('enumerable', true);
	   *
	   * `.ownPropertyDescriptor` accepts an optional `msg` argument which is a
	   * custom error message to show when the assertion fails. The message can also
	   * be given as the second argument to `expect`. When not providing
	   * `descriptor`, only use the second form.
	   *
	   *     // Recommended
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 2,
	   *     }, 'nooo why fail??');
	   *
	   *     // Recommended
	   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 2,
	   *     });
	   *
	   *     // Recommended
	   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('b');
	   *
	   *     // Not recommended
	   *     expect({a: 1})
	   *       .to.have.ownPropertyDescriptor('b', undefined, 'nooo why fail??');
	   *
	   * The above assertion isn't the same thing as not providing `descriptor`.
	   * Instead, it's asserting that the target object has a `b` property
	   * descriptor that's deeply equal to `undefined`.
	   *
	   * The alias `.haveOwnPropertyDescriptor` can be used interchangeably with
	   * `.ownPropertyDescriptor`.
	   *
	   * @name ownPropertyDescriptor
	   * @alias haveOwnPropertyDescriptor
	   * @param {String} name
	   * @param {Object} descriptor _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertOwnPropertyDescriptor (name, descriptor, msg) {
	    if (typeof descriptor === 'string') {
	      msg = descriptor;
	      descriptor = null;
	    }
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
	    if (actualDescriptor && descriptor) {
	      this.assert(
	          _.eql(descriptor, actualDescriptor)
	        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
	        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
	        , descriptor
	        , actualDescriptor
	        , true
	      );
	    } else {
	      this.assert(
	          actualDescriptor
	        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
	        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
	      );
	    }
	    flag(this, 'object', actualDescriptor);
	  }

	  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
	  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

	  /**
	   * ### .lengthOf(n[, msg])
	   *
	   * Asserts that the target's `length` or `size` is equal to the given number
	   * `n`.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3);
	   *     expect('foo').to.have.lengthOf(3);
	   *     expect(new Set([1, 2, 3])).to.have.lengthOf(3);
	   *     expect(new Map([['a', 1], ['b', 2], ['c', 3]])).to.have.lengthOf(3);
	   *
	   * Add `.not` earlier in the chain to negate `.lengthOf`. However, it's often
	   * best to assert that the target's `length` property is equal to its expected
	   * value, rather than not equal to one of many unexpected values.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.not.have.lengthOf(4); // Not recommended
	   *
	   * `.lengthOf` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(2, 'nooo why fail??');
	   *     expect([1, 2, 3], 'nooo why fail??').to.have.lengthOf(2);
	   *
	   * `.lengthOf` can also be used as a language chain, causing all `.above`,
	   * `.below`, `.least`, `.most`, and `.within` assertions that follow in the
	   * chain to use the target's `length` property as the target. However, it's
	   * often best to assert that the target's `length` property is equal to its
	   * expected length, rather than asserting that its `length` property falls
	   * within some range of values.
	   *
	   *     // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf(3);
	   *
	   *     // Not recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.above(2);
	   *     expect([1, 2, 3]).to.have.lengthOf.below(4);
	   *     expect([1, 2, 3]).to.have.lengthOf.at.least(3);
	   *     expect([1, 2, 3]).to.have.lengthOf.at.most(3);
	   *     expect([1, 2, 3]).to.have.lengthOf.within(2,4);
	   *
	   * Due to a compatibility issue, the alias `.length` can't be chained directly
	   * off of an uninvoked method such as `.a`. Therefore, `.length` can't be used
	   * interchangeably with `.lengthOf` in every situation. It's recommended to
	   * always use `.lengthOf` instead of `.length`.
	   *
	   *     expect([1, 2, 3]).to.have.a.length(3); // incompatible; throws error
	   *     expect([1, 2, 3]).to.have.a.lengthOf(3);  // passes as expected
	   *
	   * @name lengthOf
	   * @alias length
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertLengthChain () {
	    flag(this, 'doLength', true);
	  }

	  function assertLength (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , objType = _.type(obj).toLowerCase()
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi')
	      , descriptor = 'length'
	      , itemsCount;

	    switch (objType) {
	      case 'map':
	      case 'set':
	        descriptor = 'size';
	        itemsCount = obj.size;
	        break;
	      default:
	        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	        itemsCount = obj.length;
	    }

	    this.assert(
	        itemsCount == n
	      , 'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}'
	      , 'expected #{this} to not have a ' + descriptor + ' of #{act}'
	      , n
	      , itemsCount
	    );
	  }

	  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
	  Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);

	  /**
	   * ### .match(re[, msg])
	   *
	   * Asserts that the target matches the given regular expression `re`.
	   *
	   *     expect('foobar').to.match(/^foo/);
	   *
	   * Add `.not` earlier in the chain to negate `.match`.
	   *
	   *     expect('foobar').to.not.match(/taco/);
	   *
	   * `.match` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect('foobar').to.match(/taco/, 'nooo why fail??');
	   *     expect('foobar', 'nooo why fail??').to.match(/taco/);
	   *
	   * The alias `.matches` can be used interchangeably with `.match`.
	   *
	   * @name match
	   * @alias matches
	   * @param {RegExp} re
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */
	  function assertMatch(re, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    this.assert(
	        re.exec(obj)
	      , 'expected #{this} to match ' + re
	      , 'expected #{this} not to match ' + re
	    );
	  }

	  Assertion.addMethod('match', assertMatch);
	  Assertion.addMethod('matches', assertMatch);

	  /**
	   * ### .string(str[, msg])
	   *
	   * Asserts that the target string contains the given substring `str`.
	   *
	   *     expect('foobar').to.have.string('bar');
	   *
	   * Add `.not` earlier in the chain to negate `.string`.
	   *
	   *     expect('foobar').to.not.have.string('taco');
	   *
	   * `.string` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect('foobar').to.have.string('taco', 'nooo why fail??');
	   *     expect('foobar', 'nooo why fail??').to.have.string('taco');
	   *
	   * @name string
	   * @param {String} str
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('string', function (str, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(obj, flagMsg, ssfi, true).is.a('string');

	    this.assert(
	        ~obj.indexOf(str)
	      , 'expected #{this} to contain ' + _.inspect(str)
	      , 'expected #{this} to not contain ' + _.inspect(str)
	    );
	  });

	  /**
	   * ### .keys(key1[, key2[, ...]])
	   *
	   * Asserts that the target object, array, map, or set has the given keys. Only
	   * the target's own inherited properties are included in the search.
	   *
	   * When the target is an object or array, keys can be provided as one or more
	   * string arguments, a single array argument, or a single object argument. In
	   * the latter case, only the keys in the given object matter; the values are
	   * ignored.
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *     expect(['x', 'y']).to.have.all.keys(0, 1);
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys(['a', 'b']);
	   *     expect(['x', 'y']).to.have.all.keys([0, 1]);
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys({a: 4, b: 5}); // ignore 4 and 5
	   *     expect(['x', 'y']).to.have.all.keys({0: 4, 1: 5}); // ignore 4 and 5
	   *
	   * When the target is a map or set, each key must be provided as a separate
	   * argument.
	   *
	   *     expect(new Map([['a', 1], ['b', 2]])).to.have.all.keys('a', 'b');
	   *     expect(new Set(['a', 'b'])).to.have.all.keys('a', 'b');
	   *
	   * Because `.keys` does different things based on the target's type, it's
	   * important to check the target's type before using `.keys`. See the `.a` doc
	   * for info on testing a target's type.
	   *
	   *     expect({a: 1, b: 2}).to.be.an('object').that.has.all.keys('a', 'b');
	   *
	   * By default, strict (`===`) equality is used to compare keys of maps and
	   * sets. Add `.deep` earlier in the chain to use deep equality instead. See
	   * the `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target set deeply (but not strictly) has key `{a: 1}`
	   *     expect(new Set([{a: 1}])).to.have.all.deep.keys([{a: 1}]);
	   *     expect(new Set([{a: 1}])).to.not.have.all.keys([{a: 1}]);
	   *
	   * By default, the target must have all of the given keys and no more. Add
	   * `.any` earlier in the chain to only require that the target have at least
	   * one of the given keys. Also, add `.not` earlier in the chain to negate
	   * `.keys`. It's often best to add `.any` when negating `.keys`, and to use
	   * `.all` when asserting `.keys` without negation.
	   *
	   * When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
	   * exactly what's expected of the output, whereas `.not.all.keys` creates
	   * uncertain expectations.
	   *
	   *     // Recommended; asserts that target doesn't have any of the given keys
	   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
	   *
	   *     // Not recommended; asserts that target doesn't have all of the given
	   *     // keys but may or may not have some of them
	   *     expect({a: 1, b: 2}).to.not.have.all.keys('c', 'd');
	   *
	   * When asserting `.keys` without negation, `.all` is preferred because
	   * `.all.keys` asserts exactly what's expected of the output, whereas
	   * `.any.keys` creates uncertain expectations.
	   *
	   *     // Recommended; asserts that target has all the given keys
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *
	   *     // Not recommended; asserts that target has at least one of the given
	   *     // keys but may or may not have more of them
	   *     expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
	   *
	   * Note that `.all` is used by default when neither `.all` nor `.any` appear
	   * earlier in the chain. However, it's often best to add `.all` anyway because
	   * it improves readability.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b'); // Recommended
	   *     expect({a: 1, b: 2}).to.have.keys('a', 'b'); // Not recommended
	   *
	   * Add `.include` earlier in the chain to require that the target's keys be a
	   * superset of the expected keys, rather than identical sets.
	   *
	   *     // Target object's keys are a superset of ['a', 'b'] but not identical
	   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
	   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
	   *
	   * However, if `.any` and `.include` are combined, only the `.any` takes
	   * effect. The `.include` is ignored in this case.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1}).to.have.any.keys('a', 'b');
	   *     expect({a: 1}).to.include.any.keys('a', 'b');
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.have.key('b');
	   *
	   * The alias `.key` can be used interchangeably with `.keys`.
	   *
	   * @name keys
	   * @alias key
	   * @param {...String|Array|Object} keys
	   * @namespace BDD
	   * @api public
	   */

	  function assertKeys (keys) {
	    var obj = flag(this, 'object')
	      , objType = _.type(obj)
	      , keysType = _.type(keys)
	      , ssfi = flag(this, 'ssfi')
	      , isDeep = flag(this, 'deep')
	      , str
	      , deepStr = ''
	      , actual
	      , ok = true
	      , flagMsg = flag(this, 'message');

	    flagMsg = flagMsg ? flagMsg + ': ' : '';
	    var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

	    if (objType === 'Map' || objType === 'Set') {
	      deepStr = isDeep ? 'deeply ' : '';
	      actual = [];

	      // Map and Set '.keys' aren't supported in IE 11. Therefore, use .forEach.
	      obj.forEach(function (val, key) { actual.push(key); });

	      if (keysType !== 'Array') {
	        keys = Array.prototype.slice.call(arguments);
	      }
	    } else {
	      actual = _.getOwnEnumerableProperties(obj);

	      switch (keysType) {
	        case 'Array':
	          if (arguments.length > 1) {
	            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
	          }
	          break;
	        case 'Object':
	          if (arguments.length > 1) {
	            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
	          }
	          keys = Object.keys(keys);
	          break;
	        default:
	          keys = Array.prototype.slice.call(arguments);
	      }

	      // Only stringify non-Symbols because Symbols would become "Symbol()"
	      keys = keys.map(function (val) {
	        return typeof val === 'symbol' ? val : String(val);
	      });
	    }

	    if (!keys.length) {
	      throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
	    }

	    var len = keys.length
	      , any = flag(this, 'any')
	      , all = flag(this, 'all')
	      , expected = keys;

	    if (!any && !all) {
	      all = true;
	    }

	    // Has any
	    if (any) {
	      ok = expected.some(function(expectedKey) {
	        return actual.some(function(actualKey) {
	          if (isDeep) {
	            return _.eql(expectedKey, actualKey);
	          } else {
	            return expectedKey === actualKey;
	          }
	        });
	      });
	    }

	    // Has all
	    if (all) {
	      ok = expected.every(function(expectedKey) {
	        return actual.some(function(actualKey) {
	          if (isDeep) {
	            return _.eql(expectedKey, actualKey);
	          } else {
	            return expectedKey === actualKey;
	          }
	        });
	      });

	      if (!flag(this, 'contains')) {
	        ok = ok && keys.length == actual.length;
	      }
	    }

	    // Key string
	    if (len > 1) {
	      keys = keys.map(function(key) {
	        return _.inspect(key);
	      });
	      var last = keys.pop();
	      if (all) {
	        str = keys.join(', ') + ', and ' + last;
	      }
	      if (any) {
	        str = keys.join(', ') + ', or ' + last;
	      }
	    } else {
	      str = _.inspect(keys[0]);
	    }

	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;

	    // Have / include
	    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

	    // Assertion
	    this.assert(
	        ok
	      , 'expected #{this} to ' + deepStr + str
	      , 'expected #{this} to not ' + deepStr + str
	      , expected.slice(0).sort(_.compareByInspect)
	      , actual.sort(_.compareByInspect)
	      , true
	    );
	  }

	  Assertion.addMethod('keys', assertKeys);
	  Assertion.addMethod('key', assertKeys);

	  /**
	   * ### .throw([errorLike], [errMsgMatcher], [msg])
	   *
	   * When no arguments are provided, `.throw` invokes the target function and
	   * asserts that an error is thrown.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw();
	   *
	   * When one argument is provided, and it's an error constructor, `.throw`
	   * invokes the target function and asserts that an error is thrown that's an
	   * instance of that error constructor.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(TypeError);
	   *
	   * When one argument is provided, and it's an error instance, `.throw` invokes
	   * the target function and asserts that an error is thrown that's strictly
	   * (`===`) equal to that error instance.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(err);
	   *
	   * When one argument is provided, and it's a string, `.throw` invokes the
	   * target function and asserts that an error is thrown with a message that
	   * contains that string.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw('salmon');
	   *
	   * When one argument is provided, and it's a regular expression, `.throw`
	   * invokes the target function and asserts that an error is thrown with a
	   * message that matches that regular expression.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(/salmon/);
	   *
	   * When two arguments are provided, and the first is an error instance or
	   * constructor, and the second is a string or regular expression, `.throw`
	   * invokes the function and asserts that an error is thrown that fulfills both
	   * conditions as described above.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(TypeError, 'salmon');
	   *     expect(badFn).to.throw(TypeError, /salmon/);
	   *     expect(badFn).to.throw(err, 'salmon');
	   *     expect(badFn).to.throw(err, /salmon/);
	   *
	   * Add `.not` earlier in the chain to negate `.throw`.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.not.throw();
	   *
	   * However, it's dangerous to negate `.throw` when providing any arguments.
	   * The problem is that it creates uncertain expectations by asserting that the
	   * target either doesn't throw an error, or that it throws an error but of a
	   * different type than the given type, or that it throws an error of the given
	   * type but with a message that doesn't include the given string. It's often
	   * best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to throw an error, it's often best to assert
	   * exactly that.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.not.throw(); // Recommended
	   *     expect(goodFn).to.not.throw(ReferenceError, 'x'); // Not recommended
	   *
	   * When the target is expected to throw an error, it's often best to assert
	   * that the error is of its expected type, and has a message that includes an
	   * expected string, rather than asserting that it doesn't have one of many
	   * unexpected types, and doesn't have a message that includes some string.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(TypeError, 'salmon'); // Recommended
	   *     expect(badFn).to.not.throw(ReferenceError, 'x'); // Not recommended
	   *
	   * `.throw` changes the target of any assertions that follow in the chain to
	   * be the error object that's thrown.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     err.code = 42;
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(TypeError).with.property('code', 42);
	   *
	   * `.throw` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`. When not providing two arguments, always use
	   * the second form.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.throw(TypeError, 'x', 'nooo why fail??');
	   *     expect(goodFn, 'nooo why fail??').to.throw();
	   *
	   * Due to limitations in ES5, `.throw` may not always work as expected when
	   * using a transpiler such as Babel or TypeScript. In particular, it may
	   * produce unexpected results when subclassing the built-in `Error` object and
	   * then passing the subclassed constructor to `.throw`. See your transpiler's
	   * docs for details:
	   *
	   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
	   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
	   *
	   * Beware of some common mistakes when using the `throw` assertion. One common
	   * mistake is to accidentally invoke the function yourself instead of letting
	   * the `throw` assertion invoke the function for you. For example, when
	   * testing if a function named `fn` throws, provide `fn` instead of `fn()` as
	   * the target for the assertion.
	   *
	   *     expect(fn).to.throw();     // Good! Tests `fn` as desired
	   *     expect(fn()).to.throw();   // Bad! Tests result of `fn()`, not `fn`
	   *
	   * If you need to assert that your function `fn` throws when passed certain
	   * arguments, then wrap a call to `fn` inside of another function.
	   *
	   *     expect(function () { fn(42); }).to.throw();  // Function expression
	   *     expect(() => fn(42)).to.throw();             // ES6 arrow function
	   *
	   * Another common mistake is to provide an object method (or any stand-alone
	   * function that relies on `this`) as the target of the assertion. Doing so is
	   * problematic because the `this` context will be lost when the function is
	   * invoked by `.throw`; there's no way for it to know what `this` is supposed
	   * to be. There are two ways around this problem. One solution is to wrap the
	   * method or function call inside of another function. Another solution is to
	   * use `bind`.
	   *
	   *     expect(function () { cat.meow(); }).to.throw();  // Function expression
	   *     expect(() => cat.meow()).to.throw();             // ES6 arrow function
	   *     expect(cat.meow.bind(cat)).to.throw();           // Bind
	   *
	   * Finally, it's worth mentioning that it's a best practice in JavaScript to
	   * only throw `Error` and derivatives of `Error` such as `ReferenceError`,
	   * `TypeError`, and user-defined objects that extend `Error`. No other type of
	   * value will generate a stack trace when initialized. With that said, the
	   * `throw` assertion does technically support any type of value being thrown,
	   * not just `Error` and its derivatives.
	   *
	   * The aliases `.throws` and `.Throw` can be used interchangeably with
	   * `.throw`.
	   *
	   * @name throw
	   * @alias throws
	   * @alias Throw
	   * @param {Error|ErrorConstructor} errorLike
	   * @param {String|RegExp} errMsgMatcher error message
	   * @param {String} msg _optional_
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @returns error for chaining (null if no error)
	   * @namespace BDD
	   * @api public
	   */

	  function assertThrows (errorLike, errMsgMatcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , flagMsg = flag(this, 'message')
	      , negate = flag(this, 'negate') || false;
	    new Assertion(obj, flagMsg, ssfi, true).is.a('function');

	    if (errorLike instanceof RegExp || typeof errorLike === 'string') {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    var caughtErr;
	    try {
	      obj();
	    } catch (err) {
	      caughtErr = err;
	    }

	    // If we have the negate flag enabled and at least one valid argument it means we do expect an error
	    // but we want it to match a given set of criteria
	    var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;

	    // If we've got the negate flag enabled and both args, we should only fail if both aren't compatible
	    // See Issue #551 and PR #683@GitHub
	    var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
	    var errorLikeFail = false;
	    var errMsgMatcherFail = false;

	    // Checking if error was thrown
	    if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
	      // We need this to display results correctly according to their types
	      var errorLikeString = 'an error';
	      if (errorLike instanceof Error) {
	        errorLikeString = '#{exp}';
	      } else if (errorLike) {
	        errorLikeString = _.checkError.getConstructorName(errorLike);
	      }

	      this.assert(
	          caughtErr
	        , 'expected #{this} to throw ' + errorLikeString
	        , 'expected #{this} to not throw an error but #{act} was thrown'
	        , errorLike && errorLike.toString()
	        , (caughtErr instanceof Error ?
	            caughtErr.toString() : (typeof caughtErr === 'string' ? caughtErr : caughtErr &&
	                                    _.checkError.getConstructorName(caughtErr)))
	      );
	    }

	    if (errorLike && caughtErr) {
	      // We should compare instances only if `errorLike` is an instance of `Error`
	      if (errorLike instanceof Error) {
	        var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);

	        if (isCompatibleInstance === negate) {
	          // These checks were created to ensure we won't fail too soon when we've got both args and a negate
	          // See Issue #551 and PR #683@GitHub
	          if (everyArgIsDefined && negate) {
	            errorLikeFail = true;
	          } else {
	            this.assert(
	                negate
	              , 'expected #{this} to throw #{exp} but #{act} was thrown'
	              , 'expected #{this} to not throw #{exp}' + (caughtErr && !negate ? ' but #{act} was thrown' : '')
	              , errorLike.toString()
	              , caughtErr.toString()
	            );
	          }
	        }
	      }

	      var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
	      if (isCompatibleConstructor === negate) {
	        if (everyArgIsDefined && negate) {
	            errorLikeFail = true;
	        } else {
	          this.assert(
	              negate
	            , 'expected #{this} to throw #{exp} but #{act} was thrown'
	            , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
	            , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
	            , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
	          );
	        }
	      }
	    }

	    if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
	      // Here we check compatible messages
	      var placeholder = 'including';
	      if (errMsgMatcher instanceof RegExp) {
	        placeholder = 'matching';
	      }

	      var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
	      if (isCompatibleMessage === negate) {
	        if (everyArgIsDefined && negate) {
	            errMsgMatcherFail = true;
	        } else {
	          this.assert(
	            negate
	            , 'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}'
	            , 'expected #{this} to throw error not ' + placeholder + ' #{exp}'
	            ,  errMsgMatcher
	            ,  _.checkError.getMessage(caughtErr)
	          );
	        }
	      }
	    }

	    // If both assertions failed and both should've matched we throw an error
	    if (errorLikeFail && errMsgMatcherFail) {
	      this.assert(
	        negate
	        , 'expected #{this} to throw #{exp} but #{act} was thrown'
	        , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
	        , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
	        , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
	      );
	    }

	    flag(this, 'object', caughtErr);
	  };

	  Assertion.addMethod('throw', assertThrows);
	  Assertion.addMethod('throws', assertThrows);
	  Assertion.addMethod('Throw', assertThrows);

	  /**
	   * ### .respondTo(method[, msg])
	   *
	   * When the target is a non-function object, `.respondTo` asserts that the
	   * target has a method with the given name `method`. The method can be own or
	   * inherited, and it can be enumerable or non-enumerable.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(new Cat()).to.respondTo('meow');
	   *
	   * When the target is a function, `.respondTo` asserts that the target's
	   * `prototype` property has a method with the given name `method`. Again, the
	   * method can be own or inherited, and it can be enumerable or non-enumerable.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(Cat).to.respondTo('meow');
	   *
	   * Add `.itself` earlier in the chain to force `.respondTo` to treat the
	   * target as a non-function object, even if it's a function. Thus, it asserts
	   * that the target has a method with the given name `method`, rather than
	   * asserting that the target's `prototype` property has a method with the
	   * given name `method`.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *     Cat.hiss = function () {};
	   *
	   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
	   *
	   * When not adding `.itself`, it's important to check the target's type before
	   * using `.respondTo`. See the `.a` doc for info on checking a target's type.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(new Cat()).to.be.an('object').that.respondsTo('meow');
	   *
	   * Add `.not` earlier in the chain to negate `.respondTo`.
	   *
	   *     function Dog () {}
	   *     Dog.prototype.bark = function () {};
	   *
	   *     expect(new Dog()).to.not.respondTo('meow');
	   *
	   * `.respondTo` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect({}).to.respondTo('meow', 'nooo why fail??');
	   *     expect({}, 'nooo why fail??').to.respondTo('meow');
	   *
	   * The alias `.respondsTo` can be used interchangeably with `.respondTo`.
	   *
	   * @name respondTo
	   * @alias respondsTo
	   * @param {String} method
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function respondTo (method, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , itself = flag(this, 'itself')
	      , context = ('function' === typeof obj && !itself)
	        ? obj.prototype[method]
	        : obj[method];

	    this.assert(
	        'function' === typeof context
	      , 'expected #{this} to respond to ' + _.inspect(method)
	      , 'expected #{this} to not respond to ' + _.inspect(method)
	    );
	  }

	  Assertion.addMethod('respondTo', respondTo);
	  Assertion.addMethod('respondsTo', respondTo);

	  /**
	   * ### .itself
	   *
	   * Forces all `.respondTo` assertions that follow in the chain to behave as if
	   * the target is a non-function object, even if it's a function. Thus, it
	   * causes `.respondTo` to assert that the target has a method with the given
	   * name, rather than asserting that the target's `prototype` property has a
	   * method with the given name.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *     Cat.hiss = function () {};
	   *
	   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
	   *
	   * @name itself
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('itself', function () {
	    flag(this, 'itself', true);
	  });

	  /**
	   * ### .satisfy(matcher[, msg])
	   *
	   * Invokes the given `matcher` function with the target being passed as the
	   * first argument, and asserts that the value returned is truthy.
	   *
	   *     expect(1).to.satisfy(function(num) {
	   *       return num > 0;
	   *     });
	   *
	   * Add `.not` earlier in the chain to negate `.satisfy`.
	   *
	   *     expect(1).to.not.satisfy(function(num) {
	   *       return num > 2;
	   *     });
	   *
	   * `.satisfy` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1).to.satisfy(function(num) {
	   *       return num > 2;
	   *     }, 'nooo why fail??');
	   *
	   *     expect(1, 'nooo why fail??').to.satisfy(function(num) {
	   *       return num > 2;
	   *     });
	   *
	   * The alias `.satisfies` can be used interchangeably with `.satisfy`.
	   *
	   * @name satisfy
	   * @alias satisfies
	   * @param {Function} matcher
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function satisfy (matcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var result = matcher(obj);
	    this.assert(
	        result
	      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
	      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
	      , flag(this, 'negate') ? false : true
	      , result
	    );
	  }

	  Assertion.addMethod('satisfy', satisfy);
	  Assertion.addMethod('satisfies', satisfy);

	  /**
	   * ### .closeTo(expected, delta[, msg])
	   *
	   * Asserts that the target is a number that's within a given +/- `delta` range
	   * of the given number `expected`. However, it's often best to assert that the
	   * target is equal to its expected value.
	   *
	   *     // Recommended
	   *     expect(1.5).to.equal(1.5);
	   *
	   *     // Not recommended
	   *     expect(1.5).to.be.closeTo(1, 0.5);
	   *     expect(1.5).to.be.closeTo(2, 0.5);
	   *     expect(1.5).to.be.closeTo(1, 1);
	   *
	   * Add `.not` earlier in the chain to negate `.closeTo`.
	   *
	   *     expect(1.5).to.equal(1.5); // Recommended
	   *     expect(1.5).to.not.be.closeTo(3, 1); // Not recommended
	   *
	   * `.closeTo` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1.5).to.be.closeTo(3, 1, 'nooo why fail??');
	   *     expect(1.5, 'nooo why fail??').to.be.closeTo(3, 1);
	   *
	   * The alias `.approximately` can be used interchangeably with `.closeTo`.
	   *
	   * @name closeTo
	   * @alias approximately
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function closeTo(expected, delta, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');

	    new Assertion(obj, flagMsg, ssfi, true).is.a('number');
	    if (typeof expected !== 'number' || typeof delta !== 'number') {
	      flagMsg = flagMsg ? flagMsg + ': ' : '';
	      var deltaMessage = delta === undefined ? ", and a delta is required" : "";
	      throw new AssertionError(
	          flagMsg + 'the arguments to closeTo or approximately must be numbers' + deltaMessage,
	          undefined,
	          ssfi
	      );
	    }

	    this.assert(
	        Math.abs(obj - expected) <= delta
	      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
	      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
	    );
	  }

	  Assertion.addMethod('closeTo', closeTo);
	  Assertion.addMethod('approximately', closeTo);

	  // Note: Duplicates are ignored if testing for inclusion instead of sameness.
	  function isSubsetOf(subset, superset, cmp, contains, ordered) {
	    if (!contains) {
	      if (subset.length !== superset.length) return false;
	      superset = superset.slice();
	    }

	    return subset.every(function(elem, idx) {
	      if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];

	      if (!cmp) {
	        var matchIdx = superset.indexOf(elem);
	        if (matchIdx === -1) return false;

	        // Remove match from superset so not counted twice if duplicate in subset.
	        if (!contains) superset.splice(matchIdx, 1);
	        return true;
	      }

	      return superset.some(function(elem2, matchIdx) {
	        if (!cmp(elem, elem2)) return false;

	        // Remove match from superset so not counted twice if duplicate in subset.
	        if (!contains) superset.splice(matchIdx, 1);
	        return true;
	      });
	    });
	  }

	  /**
	   * ### .members(set[, msg])
	   *
	   * Asserts that the target array has the same members as the given array
	   * `set`.
	   *
	   *     expect([1, 2, 3]).to.have.members([2, 1, 3]);
	   *     expect([1, 2, 2]).to.have.members([2, 1, 2]);
	   *
	   * By default, members are compared using strict (`===`) equality. Add `.deep`
	   * earlier in the chain to use deep equality instead. See the `deep-eql`
	   * project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target array deeply (but not strictly) has member `{a: 1}`
	   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
	   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
	   *
	   * By default, order doesn't matter. Add `.ordered` earlier in the chain to
	   * require that members appear in the same order.
	   *
	   *     expect([1, 2, 3]).to.have.ordered.members([1, 2, 3]);
	   *     expect([1, 2, 3]).to.have.members([2, 1, 3])
	   *       .but.not.ordered.members([2, 1, 3]);
	   *
	   * By default, both arrays must be the same size. Add `.include` earlier in
	   * the chain to require that the target's members be a superset of the
	   * expected members. Note that duplicates are ignored in the subset when
	   * `.include` is added.
	   *
	   *     // Target array is a superset of [1, 2] but not identical
	   *     expect([1, 2, 3]).to.include.members([1, 2]);
	   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
	   *
	   *     // Duplicates in the subset are ignored
	   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
	   *
	   * `.deep`, `.ordered`, and `.include` can all be combined. However, if
	   * `.include` and `.ordered` are combined, the ordering begins at the start of
	   * both arrays.
	   *
	   *     expect([{a: 1}, {b: 2}, {c: 3}])
	   *       .to.include.deep.ordered.members([{a: 1}, {b: 2}])
	   *       .but.not.include.deep.ordered.members([{b: 2}, {c: 3}]);
	   *
	   * Add `.not` earlier in the chain to negate `.members`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the target array doesn't have all of the same members as
	   * the given array `set` but may or may not have some of them. It's often best
	   * to identify the exact output that's expected, and then write an assertion
	   * that only accepts that exact output.
	   *
	   *     expect([1, 2]).to.not.include(3).and.not.include(4); // Recommended
	   *     expect([1, 2]).to.not.have.members([3, 4]); // Not recommended
	   *
	   * `.members` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2]).to.have.members([1, 2, 3], 'nooo why fail??');
	   *     expect([1, 2], 'nooo why fail??').to.have.members([1, 2, 3]);
	   *
	   * @name members
	   * @param {Array} set
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('members', function (subset, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');

	    new Assertion(obj, flagMsg, ssfi, true).to.be.an('array');
	    new Assertion(subset, flagMsg, ssfi, true).to.be.an('array');

	    var contains = flag(this, 'contains');
	    var ordered = flag(this, 'ordered');

	    var subject, failMsg, failNegateMsg;

	    if (contains) {
	      subject = ordered ? 'an ordered superset' : 'a superset';
	      failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
	      failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
	    } else {
	      subject = ordered ? 'ordered members' : 'members';
	      failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
	      failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
	    }

	    var cmp = flag(this, 'deep') ? _.eql : undefined;

	    this.assert(
	        isSubsetOf(subset, obj, cmp, contains, ordered)
	      , failMsg
	      , failNegateMsg
	      , subset
	      , obj
	      , true
	    );
	  });

	  /**
	   * ### .oneOf(list[, msg])
	   *
	   * Asserts that the target is a member of the given array `list`. However,
	   * it's often best to assert that the target is equal to its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.oneOf([1, 2, 3]); // Not recommended
	   *
	   * Comparisons are performed using strict (`===`) equality.
	   *
	   * Add `.not` earlier in the chain to negate `.oneOf`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.oneOf([2, 3, 4]); // Not recommended
	   *
	   * It can also be chained with `.contain` or `.include`, which will work with
	   * both arrays and strings:
	   *
	   *     expect('Today is sunny').to.contain.oneOf(['sunny', 'cloudy'])
	   *     expect('Today is rainy').to.not.contain.oneOf(['sunny', 'cloudy'])
	   *     expect([1,2,3]).to.contain.oneOf([3,4,5])
	   *     expect([1,2,3]).to.not.contain.oneOf([4,5,6])
	   *
	   * `.oneOf` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.oneOf([2, 3, 4], 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.oneOf([2, 3, 4]);
	   *
	   * @name oneOf
	   * @param {Array<*>} list
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function oneOf (list, msg) {
	    if (msg) flag(this, 'message', msg);
	    var expected = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi')
	      , contains = flag(this, 'contains')
	      , isDeep = flag(this, 'deep');
	    new Assertion(list, flagMsg, ssfi, true).to.be.an('array');

	    if (contains) {
	      this.assert(
	        list.some(function(possibility) { return expected.indexOf(possibility) > -1 })
	        , 'expected #{this} to contain one of #{exp}'
	        , 'expected #{this} to not contain one of #{exp}'
	        , list
	        , expected
	      );
	    } else {
	      if (isDeep) {
	        this.assert(
	          list.some(function(possibility) { return _.eql(expected, possibility) })
	          , 'expected #{this} to deeply equal one of #{exp}'
	          , 'expected #{this} to deeply equal one of #{exp}'
	          , list
	          , expected
	        );
	      } else {
	        this.assert(
	          list.indexOf(expected) > -1
	          , 'expected #{this} to be one of #{exp}'
	          , 'expected #{this} to not be one of #{exp}'
	          , list
	          , expected
	        );
	      }
	    }
	  }

	  Assertion.addMethod('oneOf', oneOf);

	  /**
	   * ### .change(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.change` asserts that the given function
	   * `subject` returns a different value when it's invoked before the target
	   * function compared to when it's invoked afterward. However, it's often best
	   * to assert that `subject` is equal to its expected value.
	   *
	   *     var dots = ''
	   *       , addDot = function () { dots += '.'; }
	   *       , getDots = function () { return dots; };
	   *
	   *     // Recommended
	   *     expect(getDots()).to.equal('');
	   *     addDot();
	   *     expect(getDots()).to.equal('.');
	   *
	   *     // Not recommended
	   *     expect(addDot).to.change(getDots);
	   *
	   * When two arguments are provided, `.change` asserts that the value of the
	   * given object `subject`'s `prop` property is different before invoking the
	   * target function compared to afterward.
	   *
	   *     var myObj = {dots: ''}
	   *       , addDot = function () { myObj.dots += '.'; };
	   *
	   *     // Recommended
	   *     expect(myObj).to.have.property('dots', '');
	   *     addDot();
	   *     expect(myObj).to.have.property('dots', '.');
	   *
	   *     // Not recommended
	   *     expect(addDot).to.change(myObj, 'dots');
	   *
	   * Strict (`===`) equality is used to compare before and after values.
	   *
	   * Add `.not` earlier in the chain to negate `.change`.
	   *
	   *     var dots = ''
	   *       , noop = function () {}
	   *       , getDots = function () { return dots; };
	   *
	   *     expect(noop).to.not.change(getDots);
	   *
	   *     var myObj = {dots: ''}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'dots');
	   *
	   * `.change` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {dots: ''}
	   *       , addDot = function () { myObj.dots += '.'; };
	   *
	   *     expect(addDot).to.not.change(myObj, 'dots', 'nooo why fail??');
	   *
	   *     var dots = ''
	   *       , addDot = function () { dots += '.'; }
	   *       , getDots = function () { return dots; };
	   *
	   *     expect(addDot, 'nooo why fail??').to.not.change(getDots);
	   *
	   * `.change` also causes all `.by` assertions that follow in the chain to
	   * assert how much a numeric subject was increased or decreased by. However,
	   * it's dangerous to use `.change.by`. The problem is that it creates
	   * uncertain expectations by asserting that the subject either increases by
	   * the given delta, or that it decreases by the given delta. It's often best
	   * to identify the exact output that's expected, and then write an assertion
	   * that only accepts that exact output.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; }
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   * The alias `.changes` can be used interchangeably with `.change`.
	   *
	   * @name change
	   * @alias changes
	   * @param {String} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertChanges (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    // This gets flagged because of the .by(delta) assertion
	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'change');
	    flag(this, 'realDelta', final !== initial);

	    this.assert(
	      initial !== final
	      , 'expected ' + msgObj + ' to change'
	      , 'expected ' + msgObj + ' to not change'
	    );
	  }

	  Assertion.addMethod('change', assertChanges);
	  Assertion.addMethod('changes', assertChanges);

	  /**
	   * ### .increase(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.increase` asserts that the given function
	   * `subject` returns a greater number when it's invoked after invoking the
	   * target function compared to when it's invoked beforehand. `.increase` also
	   * causes all `.by` assertions that follow in the chain to assert how much
	   * greater of a number is returned. It's often best to assert that the return
	   * value increased by the expected amount, rather than asserting it increased
	   * by any amount.
	   *
	   *     var val = 1
	   *       , addTwo = function () { val += 2; }
	   *       , getVal = function () { return val; };
	   *
	   *     expect(addTwo).to.increase(getVal).by(2); // Recommended
	   *     expect(addTwo).to.increase(getVal); // Not recommended
	   *
	   * When two arguments are provided, `.increase` asserts that the value of the
	   * given object `subject`'s `prop` property is greater after invoking the
	   * target function compared to beforehand.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.increase(myObj, 'val'); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.increase`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either decreases, or that it stays the same.
	   * It's often best to identify the exact output that's expected, and then
	   * write an assertion that only accepts that exact output.
	   *
	   * When the subject is expected to decrease, it's often best to assert that it
	   * decreased by the expected amount.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.not.increase(myObj, 'val'); // Not recommended
	   *
	   * When the subject is expected to stay the same, it's often best to assert
	   * exactly that.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
	   *     expect(noop).to.not.increase(myObj, 'val'); // Not recommended
	   *
	   * `.increase` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.increase(myObj, 'val', 'nooo why fail??');
	   *
	   *     var val = 1
	   *       , noop = function () {}
	   *       , getVal = function () { return val; };
	   *
	   *     expect(noop, 'nooo why fail??').to.increase(getVal);
	   *
	   * The alias `.increases` can be used interchangeably with `.increase`.
	   *
	   * @name increase
	   * @alias increases
	   * @param {String|Function} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertIncreases (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    // Make sure that the target is a number
	    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'increase');
	    flag(this, 'realDelta', final - initial);

	    this.assert(
	      final - initial > 0
	      , 'expected ' + msgObj + ' to increase'
	      , 'expected ' + msgObj + ' to not increase'
	    );
	  }

	  Assertion.addMethod('increase', assertIncreases);
	  Assertion.addMethod('increases', assertIncreases);

	  /**
	   * ### .decrease(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.decrease` asserts that the given function
	   * `subject` returns a lesser number when it's invoked after invoking the
	   * target function compared to when it's invoked beforehand. `.decrease` also
	   * causes all `.by` assertions that follow in the chain to assert how much
	   * lesser of a number is returned. It's often best to assert that the return
	   * value decreased by the expected amount, rather than asserting it decreased
	   * by any amount.
	   *
	   *     var val = 1
	   *       , subtractTwo = function () { val -= 2; }
	   *       , getVal = function () { return val; };
	   *
	   *     expect(subtractTwo).to.decrease(getVal).by(2); // Recommended
	   *     expect(subtractTwo).to.decrease(getVal); // Not recommended
	   *
	   * When two arguments are provided, `.decrease` asserts that the value of the
	   * given object `subject`'s `prop` property is lesser after invoking the
	   * target function compared to beforehand.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.decrease(myObj, 'val'); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.decrease`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either increases, or that it stays the same.
	   * It's often best to identify the exact output that's expected, and then
	   * write an assertion that only accepts that exact output.
	   *
	   * When the subject is expected to increase, it's often best to assert that it
	   * increased by the expected amount.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.not.decrease(myObj, 'val'); // Not recommended
	   *
	   * When the subject is expected to stay the same, it's often best to assert
	   * exactly that.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
	   *     expect(noop).to.not.decrease(myObj, 'val'); // Not recommended
	   *
	   * `.decrease` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.decrease(myObj, 'val', 'nooo why fail??');
	   *
	   *     var val = 1
	   *       , noop = function () {}
	   *       , getVal = function () { return val; };
	   *
	   *     expect(noop, 'nooo why fail??').to.decrease(getVal);
	   *
	   * The alias `.decreases` can be used interchangeably with `.decrease`.
	   *
	   * @name decrease
	   * @alias decreases
	   * @param {String|Function} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertDecreases (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    // Make sure that the target is a number
	    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'decrease');
	    flag(this, 'realDelta', initial - final);

	    this.assert(
	      final - initial < 0
	      , 'expected ' + msgObj + ' to decrease'
	      , 'expected ' + msgObj + ' to not decrease'
	    );
	  }

	  Assertion.addMethod('decrease', assertDecreases);
	  Assertion.addMethod('decreases', assertDecreases);

	  /**
	   * ### .by(delta[, msg])
	   *
	   * When following an `.increase` assertion in the chain, `.by` asserts that
	   * the subject of the `.increase` assertion increased by the given `delta`.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2);
	   *
	   * When following a `.decrease` assertion in the chain, `.by` asserts that the
	   * subject of the `.decrease` assertion decreased by the given `delta`.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2);
	   *
	   * When following a `.change` assertion in the chain, `.by` asserts that the
	   * subject of the `.change` assertion either increased or decreased by the
	   * given `delta`. However, it's dangerous to use `.change.by`. The problem is
	   * that it creates uncertain expectations. It's often best to identify the
	   * exact output that's expected, and then write an assertion that only accepts
	   * that exact output.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; }
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.by`. However, it's often best
	   * to assert that the subject changed by its expected delta, rather than
	   * asserting that it didn't change by one of countless unexpected deltas.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     // Recommended
	   *     expect(addTwo).to.increase(myObj, 'val').by(2);
	   *
	   *     // Not recommended
	   *     expect(addTwo).to.increase(myObj, 'val').but.not.by(3);
	   *
	   * `.by` accepts an optional `msg` argument which is a custom error message to
	   * show when the assertion fails. The message can also be given as the second
	   * argument to `expect`.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(3, 'nooo why fail??');
	   *     expect(addTwo, 'nooo why fail??').to.increase(myObj, 'val').by(3);
	   *
	   * @name by
	   * @param {Number} delta
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertDelta(delta, msg) {
	    if (msg) flag(this, 'message', msg);

	    var msgObj = flag(this, 'deltaMsgObj');
	    var initial = flag(this, 'initialDeltaValue');
	    var final = flag(this, 'finalDeltaValue');
	    var behavior = flag(this, 'deltaBehavior');
	    var realDelta = flag(this, 'realDelta');

	    var expression;
	    if (behavior === 'change') {
	      expression = Math.abs(final - initial) === Math.abs(delta);
	    } else {
	      expression = realDelta === Math.abs(delta);
	    }

	    this.assert(
	      expression
	      , 'expected ' + msgObj + ' to ' + behavior + ' by ' + delta
	      , 'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta
	    );
	  }

	  Assertion.addMethod('by', assertDelta);

	  /**
	   * ### .extensible
	   *
	   * Asserts that the target is extensible, which means that new properties can
	   * be added to it. Primitives are never extensible.
	   *
	   *     expect({a: 1}).to.be.extensible;
	   *
	   * Add `.not` earlier in the chain to negate `.extensible`.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({})
	   *       , sealedObject = Object.seal({})
	   *       , frozenObject = Object.freeze({});
	   *
	   *     expect(nonExtensibleObject).to.not.be.extensible;
	   *     expect(sealedObject).to.not.be.extensible;
	   *     expect(frozenObject).to.not.be.extensible;
	   *     expect(1).to.not.be.extensible;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(1, 'nooo why fail??').to.be.extensible;
	   *
	   * @name extensible
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('extensible', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
	    // The following provides ES6 behavior for ES5 environments.

	    var isExtensible = obj === Object(obj) && Object.isExtensible(obj);

	    this.assert(
	      isExtensible
	      , 'expected #{this} to be extensible'
	      , 'expected #{this} to not be extensible'
	    );
	  });

	  /**
	   * ### .sealed
	   *
	   * Asserts that the target is sealed, which means that new properties can't be
	   * added to it, and its existing properties can't be reconfigured or deleted.
	   * However, it's possible that its existing properties can still be reassigned
	   * to different values. Primitives are always sealed.
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(sealedObject).to.be.sealed;
	   *     expect(frozenObject).to.be.sealed;
	   *     expect(1).to.be.sealed;
	   *
	   * Add `.not` earlier in the chain to negate `.sealed`.
	   *
	   *     expect({a: 1}).to.not.be.sealed;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.be.sealed;
	   *
	   * @name sealed
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('sealed', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
	    // The following provides ES6 behavior for ES5 environments.

	    var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;

	    this.assert(
	      isSealed
	      , 'expected #{this} to be sealed'
	      , 'expected #{this} to not be sealed'
	    );
	  });

	  /**
	   * ### .frozen
	   *
	   * Asserts that the target is frozen, which means that new properties can't be
	   * added to it, and its existing properties can't be reassigned to different
	   * values, reconfigured, or deleted. Primitives are always frozen.
	   *
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(frozenObject).to.be.frozen;
	   *     expect(1).to.be.frozen;
	   *
	   * Add `.not` earlier in the chain to negate `.frozen`.
	   *
	   *     expect({a: 1}).to.not.be.frozen;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.be.frozen;
	   *
	   * @name frozen
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('frozen', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
	    // The following provides ES6 behavior for ES5 environments.

	    var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;

	    this.assert(
	      isFrozen
	      , 'expected #{this} to be frozen'
	      , 'expected #{this} to not be frozen'
	    );
	  });

	  /**
	   * ### .finite
	   *
	   * Asserts that the target is a number, and isn't `NaN` or positive/negative
	   * `Infinity`.
	   *
	   *     expect(1).to.be.finite;
	   *
	   * Add `.not` earlier in the chain to negate `.finite`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either isn't a number, or that it's `NaN`, or
	   * that it's positive `Infinity`, or that it's negative `Infinity`. It's often
	   * best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to be a number, it's often best to assert
	   * that it's the expected type, rather than asserting that it isn't one of
	   * many unexpected types.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be `NaN`, it's often best to assert exactly
	   * that.
	   *
	   *     expect(NaN).to.be.NaN; // Recommended
	   *     expect(NaN).to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be positive infinity, it's often best to
	   * assert exactly that.
	   *
	   *     expect(Infinity).to.equal(Infinity); // Recommended
	   *     expect(Infinity).to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be negative infinity, it's often best to
	   * assert exactly that.
	   *
	   *     expect(-Infinity).to.equal(-Infinity); // Recommended
	   *     expect(-Infinity).to.not.be.finite; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect('foo', 'nooo why fail??').to.be.finite;
	   *
	   * @name finite
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('finite', function(msg) {
	    var obj = flag(this, 'object');

	    this.assert(
	        typeof obj === 'number' && isFinite(obj)
	      , 'expected #{this} to be a finite number'
	      , 'expected #{this} to not be a finite number'
	    );
	  });
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var expect$1 = function (chai, util) {
	  chai.expect = function (val, message) {
	    return new chai.Assertion(val, message);
	  };

	  /**
	   * ### .fail([message])
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure.
	   *
	   *     expect.fail();
	   *     expect.fail("custom error message");
	   *     expect.fail(1, 2);
	   *     expect.fail(1, 2, "custom error message");
	   *     expect.fail(1, 2, "custom error message", ">");
	   *     expect.fail(1, 2, undefined, ">");
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @namespace BDD
	   * @api public
	   */

	  chai.expect.fail = function (actual, expected, message, operator) {
	    if (arguments.length < 2) {
	        message = actual;
	        actual = undefined;
	    }

	    message = message || 'expect.fail()';
	    throw new chai.AssertionError(message, {
	        actual: actual
	      , expected: expected
	      , operator: operator
	    }, chai.expect.fail);
	  };
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var should$1 = function (chai, util) {
	  var Assertion = chai.Assertion;

	  function loadShould () {
	    // explicitly define this method as function as to have it's name to include as `ssfi`
	    function shouldGetter() {
	      if (this instanceof String
	          || this instanceof Number
	          || this instanceof Boolean
	          || typeof Symbol === 'function' && this instanceof Symbol
	          || typeof BigInt === 'function' && this instanceof BigInt) {
	        return new Assertion(this.valueOf(), null, shouldGetter);
	      }
	      return new Assertion(this, null, shouldGetter);
	    }
	    function shouldSetter(value) {
	      // See https://github.com/chaijs/chai/issues/86: this makes
	      // `whatever.should = someValue` actually set `someValue`, which is
	      // especially useful for `global.should = require('chai').should()`.
	      //
	      // Note that we have to use [[DefineProperty]] instead of [[Put]]
	      // since otherwise we would trigger this very setter!
	      Object.defineProperty(this, 'should', {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    }
	    // modify Object.prototype to have `should`
	    Object.defineProperty(Object.prototype, 'should', {
	      set: shouldSetter
	      , get: shouldGetter
	      , configurable: true
	    });

	    var should = {};

	    /**
	     * ### .fail([message])
	     * ### .fail(actual, expected, [message], [operator])
	     *
	     * Throw a failure.
	     *
	     *     should.fail();
	     *     should.fail("custom error message");
	     *     should.fail(1, 2);
	     *     should.fail(1, 2, "custom error message");
	     *     should.fail(1, 2, "custom error message", ">");
	     *     should.fail(1, 2, undefined, ">");
	     *
	     *
	     * @name fail
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @param {String} operator
	     * @namespace BDD
	     * @api public
	     */

	    should.fail = function (actual, expected, message, operator) {
	      if (arguments.length < 2) {
	          message = actual;
	          actual = undefined;
	      }

	      message = message || 'should.fail()';
	      throw new chai.AssertionError(message, {
	          actual: actual
	        , expected: expected
	        , operator: operator
	      }, should.fail);
	    };

	    /**
	     * ### .equal(actual, expected, [message])
	     *
	     * Asserts non-strict equality (`==`) of `actual` and `expected`.
	     *
	     *     should.equal(3, '3', '== coerces values to strings');
	     *
	     * @name equal
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @namespace Should
	     * @api public
	     */

	    should.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.equal(val2);
	    };

	    /**
	     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
	     *
	     * Asserts that `function` will throw an error that is an instance of
	     * `constructor`, or alternately that it will throw an error with message
	     * matching `regexp`.
	     *
	     *     should.throw(fn, 'function throws a reference error');
	     *     should.throw(fn, /function throws a reference error/);
	     *     should.throw(fn, ReferenceError);
	     *     should.throw(fn, ReferenceError, 'function throws a reference error');
	     *     should.throw(fn, ReferenceError, /function throws a reference error/);
	     *
	     * @name throw
	     * @alias Throw
	     * @param {Function} function
	     * @param {ErrorConstructor} constructor
	     * @param {RegExp} regexp
	     * @param {String} message
	     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	     * @namespace Should
	     * @api public
	     */

	    should.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.Throw(errt, errs);
	    };

	    /**
	     * ### .exist
	     *
	     * Asserts that the target is neither `null` nor `undefined`.
	     *
	     *     var foo = 'hi';
	     *
	     *     should.exist(foo, 'foo exists');
	     *
	     * @name exist
	     * @namespace Should
	     * @api public
	     */

	    should.exist = function (val, msg) {
	      new Assertion(val, msg).to.exist;
	    };

	    // negation
	    should.not = {};

	    /**
	     * ### .not.equal(actual, expected, [message])
	     *
	     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	     *
	     *     should.not.equal(3, 4, 'these numbers are not equal');
	     *
	     * @name not.equal
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @namespace Should
	     * @api public
	     */

	    should.not.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.not.equal(val2);
	    };

	    /**
	     * ### .throw(function, [constructor/regexp], [message])
	     *
	     * Asserts that `function` will _not_ throw an error that is an instance of
	     * `constructor`, or alternately that it will not throw an error with message
	     * matching `regexp`.
	     *
	     *     should.not.throw(fn, Error, 'function does not throw');
	     *
	     * @name not.throw
	     * @alias not.Throw
	     * @param {Function} function
	     * @param {ErrorConstructor} constructor
	     * @param {RegExp} regexp
	     * @param {String} message
	     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	     * @namespace Should
	     * @api public
	     */

	    should.not.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.not.Throw(errt, errs);
	    };

	    /**
	     * ### .not.exist
	     *
	     * Asserts that the target is neither `null` nor `undefined`.
	     *
	     *     var bar = null;
	     *
	     *     should.not.exist(bar, 'bar does not exist');
	     *
	     * @name not.exist
	     * @namespace Should
	     * @api public
	     */

	    should.not.exist = function (val, msg) {
	      new Assertion(val, msg).to.not.exist;
	    };

	    should['throw'] = should['Throw'];
	    should.not['throw'] = should.not['Throw'];

	    return should;
	  };

	  chai.should = loadShould;
	  chai.Should = loadShould;
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var assert$1 = function (chai, util) {
	  /*!
	   * Chai dependencies.
	   */

	  var Assertion = chai.Assertion
	    , flag = util.flag;

	  /*!
	   * Module export.
	   */

	  /**
	   * ### assert(expression, message)
	   *
	   * Write your own test expressions.
	   *
	   *     assert('foo' !== 'bar', 'foo is not bar');
	   *     assert(Array.isArray([]), 'empty arrays are arrays');
	   *
	   * @param {Mixed} expression to test for truthiness
	   * @param {String} message to display on error
	   * @name assert
	   * @namespace Assert
	   * @api public
	   */

	  var assert = chai.assert = function (express, errmsg) {
	    var test = new Assertion(null, null, chai.assert, true);
	    test.assert(
	        express
	      , errmsg
	      , '[ negation message unavailable ]'
	    );
	  };

	  /**
	   * ### .fail([message])
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure. Node.js `assert` module-compatible.
	   *
	   *     assert.fail();
	   *     assert.fail("custom error message");
	   *     assert.fail(1, 2);
	   *     assert.fail(1, 2, "custom error message");
	   *     assert.fail(1, 2, "custom error message", ">");
	   *     assert.fail(1, 2, undefined, ">");
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @namespace Assert
	   * @api public
	   */

	  assert.fail = function (actual, expected, message, operator) {
	    if (arguments.length < 2) {
	        // Comply with Node's fail([message]) interface

	        message = actual;
	        actual = undefined;
	    }

	    message = message || 'assert.fail()';
	    throw new chai.AssertionError(message, {
	        actual: actual
	      , expected: expected
	      , operator: operator
	    }, assert.fail);
	  };

	  /**
	   * ### .isOk(object, [message])
	   *
	   * Asserts that `object` is truthy.
	   *
	   *     assert.isOk('everything', 'everything is ok');
	   *     assert.isOk(false, 'this will fail');
	   *
	   * @name isOk
	   * @alias ok
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isOk = function (val, msg) {
	    new Assertion(val, msg, assert.isOk, true).is.ok;
	  };

	  /**
	   * ### .isNotOk(object, [message])
	   *
	   * Asserts that `object` is falsy.
	   *
	   *     assert.isNotOk('everything', 'this will fail');
	   *     assert.isNotOk(false, 'this will pass');
	   *
	   * @name isNotOk
	   * @alias notOk
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotOk = function (val, msg) {
	    new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
	  };

	  /**
	   * ### .equal(actual, expected, [message])
	   *
	   * Asserts non-strict equality (`==`) of `actual` and `expected`.
	   *
	   *     assert.equal(3, '3', '== coerces values to strings');
	   *
	   * @name equal
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.equal = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.equal, true);

	    test.assert(
	        exp == flag(test, 'object')
	      , 'expected #{this} to equal #{exp}'
	      , 'expected #{this} to not equal #{act}'
	      , exp
	      , act
	      , true
	    );
	  };

	  /**
	   * ### .notEqual(actual, expected, [message])
	   *
	   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	   *
	   *     assert.notEqual(3, 4, 'these numbers are not equal');
	   *
	   * @name notEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notEqual = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.notEqual, true);

	    test.assert(
	        exp != flag(test, 'object')
	      , 'expected #{this} to not equal #{exp}'
	      , 'expected #{this} to equal #{act}'
	      , exp
	      , act
	      , true
	    );
	  };

	  /**
	   * ### .strictEqual(actual, expected, [message])
	   *
	   * Asserts strict equality (`===`) of `actual` and `expected`.
	   *
	   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
	   *
	   * @name strictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.strictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
	  };

	  /**
	   * ### .notStrictEqual(actual, expected, [message])
	   *
	   * Asserts strict inequality (`!==`) of `actual` and `expected`.
	   *
	   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
	   *
	   * @name notStrictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
	  };

	  /**
	   * ### .deepEqual(actual, expected, [message])
	   *
	   * Asserts that `actual` is deeply equal to `expected`.
	   *
	   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
	   *
	   * @name deepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @alias deepStrictEqual
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
	  };

	  /**
	   * ### .notDeepEqual(actual, expected, [message])
	   *
	   * Assert that `actual` is not deeply equal to `expected`.
	   *
	   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
	   *
	   * @name notDeepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
	  };

	   /**
	   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
	   *
	   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`.
	   *
	   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
	   *
	   * @name isAbove
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAbove
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAbove = function (val, abv, msg) {
	    new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
	  };

	   /**
	   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
	   *
	   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`.
	   *
	   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
	   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
	   *
	   * @name isAtLeast
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAtLeast
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAtLeast = function (val, atlst, msg) {
	    new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
	  };

	   /**
	   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
	   *
	   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`.
	   *
	   *     assert.isBelow(3, 6, '3 is strictly less than 6');
	   *
	   * @name isBelow
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeBelow
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isBelow = function (val, blw, msg) {
	    new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
	  };

	   /**
	   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
	   *
	   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`.
	   *
	   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
	   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
	   *
	   * @name isAtMost
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAtMost
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAtMost = function (val, atmst, msg) {
	    new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
	  };

	  /**
	   * ### .isTrue(value, [message])
	   *
	   * Asserts that `value` is true.
	   *
	   *     var teaServed = true;
	   *     assert.isTrue(teaServed, 'the tea has been served');
	   *
	   * @name isTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isTrue = function (val, msg) {
	    new Assertion(val, msg, assert.isTrue, true).is['true'];
	  };

	  /**
	   * ### .isNotTrue(value, [message])
	   *
	   * Asserts that `value` is not true.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotTrue(tea, 'great, time for tea!');
	   *
	   * @name isNotTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotTrue = function (val, msg) {
	    new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
	  };

	  /**
	   * ### .isFalse(value, [message])
	   *
	   * Asserts that `value` is false.
	   *
	   *     var teaServed = false;
	   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
	   *
	   * @name isFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFalse = function (val, msg) {
	    new Assertion(val, msg, assert.isFalse, true).is['false'];
	  };

	  /**
	   * ### .isNotFalse(value, [message])
	   *
	   * Asserts that `value` is not false.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotFalse(tea, 'great, time for tea!');
	   *
	   * @name isNotFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFalse = function (val, msg) {
	    new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
	  };

	  /**
	   * ### .isNull(value, [message])
	   *
	   * Asserts that `value` is null.
	   *
	   *     assert.isNull(err, 'there was no error');
	   *
	   * @name isNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNull = function (val, msg) {
	    new Assertion(val, msg, assert.isNull, true).to.equal(null);
	  };

	  /**
	   * ### .isNotNull(value, [message])
	   *
	   * Asserts that `value` is not null.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotNull(tea, 'great, time for tea!');
	   *
	   * @name isNotNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotNull = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
	  };

	  /**
	   * ### .isNaN
	   *
	   * Asserts that value is NaN.
	   *
	   *     assert.isNaN(NaN, 'NaN is NaN');
	   *
	   * @name isNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNaN = function (val, msg) {
	    new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
	  };

	  /**
	   * ### .isNotNaN
	   *
	   * Asserts that value is not NaN.
	   *
	   *     assert.isNotNaN(4, '4 is not NaN');
	   *
	   * @name isNotNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */
	  assert.isNotNaN = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
	  };

	  /**
	   * ### .exists
	   *
	   * Asserts that the target is neither `null` nor `undefined`.
	   *
	   *     var foo = 'hi';
	   *
	   *     assert.exists(foo, 'foo is neither `null` nor `undefined`');
	   *
	   * @name exists
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.exists = function (val, msg) {
	    new Assertion(val, msg, assert.exists, true).to.exist;
	  };

	  /**
	   * ### .notExists
	   *
	   * Asserts that the target is either `null` or `undefined`.
	   *
	   *     var bar = null
	   *       , baz;
	   *
	   *     assert.notExists(bar);
	   *     assert.notExists(baz, 'baz is either null or undefined');
	   *
	   * @name notExists
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notExists = function (val, msg) {
	    new Assertion(val, msg, assert.notExists, true).to.not.exist;
	  };

	  /**
	   * ### .isUndefined(value, [message])
	   *
	   * Asserts that `value` is `undefined`.
	   *
	   *     var tea;
	   *     assert.isUndefined(tea, 'no tea defined');
	   *
	   * @name isUndefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isUndefined = function (val, msg) {
	    new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
	  };

	  /**
	   * ### .isDefined(value, [message])
	   *
	   * Asserts that `value` is not `undefined`.
	   *
	   *     var tea = 'cup of chai';
	   *     assert.isDefined(tea, 'tea has been defined');
	   *
	   * @name isDefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isDefined = function (val, msg) {
	    new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
	  };

	  /**
	   * ### .isFunction(value, [message])
	   *
	   * Asserts that `value` is a function.
	   *
	   *     function serveTea() { return 'cup of tea'; };
	   *     assert.isFunction(serveTea, 'great, we can have tea now');
	   *
	   * @name isFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFunction = function (val, msg) {
	    new Assertion(val, msg, assert.isFunction, true).to.be.a('function');
	  };

	  /**
	   * ### .isNotFunction(value, [message])
	   *
	   * Asserts that `value` is _not_ a function.
	   *
	   *     var serveTea = [ 'heat', 'pour', 'sip' ];
	   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
	   *
	   * @name isNotFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFunction = function (val, msg) {
	    new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a('function');
	  };

	  /**
	   * ### .isObject(value, [message])
	   *
	   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
	   * _The assertion does not match subclassed objects._
	   *
	   *     var selection = { name: 'Chai', serve: 'with spices' };
	   *     assert.isObject(selection, 'tea selection is an object');
	   *
	   * @name isObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isObject = function (val, msg) {
	    new Assertion(val, msg, assert.isObject, true).to.be.a('object');
	  };

	  /**
	   * ### .isNotObject(value, [message])
	   *
	   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
	   *
	   *     var selection = 'chai'
	   *     assert.isNotObject(selection, 'tea selection is not an object');
	   *     assert.isNotObject(null, 'null is not an object');
	   *
	   * @name isNotObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotObject = function (val, msg) {
	    new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
	  };

	  /**
	   * ### .isArray(value, [message])
	   *
	   * Asserts that `value` is an array.
	   *
	   *     var menu = [ 'green', 'chai', 'oolong' ];
	   *     assert.isArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isArray = function (val, msg) {
	    new Assertion(val, msg, assert.isArray, true).to.be.an('array');
	  };

	  /**
	   * ### .isNotArray(value, [message])
	   *
	   * Asserts that `value` is _not_ an array.
	   *
	   *     var menu = 'green|chai|oolong';
	   *     assert.isNotArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isNotArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotArray = function (val, msg) {
	    new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
	  };

	  /**
	   * ### .isString(value, [message])
	   *
	   * Asserts that `value` is a string.
	   *
	   *     var teaOrder = 'chai';
	   *     assert.isString(teaOrder, 'order placed');
	   *
	   * @name isString
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isString = function (val, msg) {
	    new Assertion(val, msg, assert.isString, true).to.be.a('string');
	  };

	  /**
	   * ### .isNotString(value, [message])
	   *
	   * Asserts that `value` is _not_ a string.
	   *
	   *     var teaOrder = 4;
	   *     assert.isNotString(teaOrder, 'order placed');
	   *
	   * @name isNotString
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotString = function (val, msg) {
	    new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
	  };

	  /**
	   * ### .isNumber(value, [message])
	   *
	   * Asserts that `value` is a number.
	   *
	   *     var cups = 2;
	   *     assert.isNumber(cups, 'how many cups');
	   *
	   * @name isNumber
	   * @param {Number} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNumber = function (val, msg) {
	    new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
	  };

	  /**
	   * ### .isNotNumber(value, [message])
	   *
	   * Asserts that `value` is _not_ a number.
	   *
	   *     var cups = '2 cups please';
	   *     assert.isNotNumber(cups, 'how many cups');
	   *
	   * @name isNotNumber
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotNumber = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
	  };

	   /**
	   * ### .isFinite(value, [message])
	   *
	   * Asserts that `value` is a finite number. Unlike `.isNumber`, this will fail for `NaN` and `Infinity`.
	   *
	   *     var cups = 2;
	   *     assert.isFinite(cups, 'how many cups');
	   *
	   *     assert.isFinite(NaN); // throws
	   *
	   * @name isFinite
	   * @param {Number} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFinite = function (val, msg) {
	    new Assertion(val, msg, assert.isFinite, true).to.be.finite;
	  };

	  /**
	   * ### .isBoolean(value, [message])
	   *
	   * Asserts that `value` is a boolean.
	   *
	   *     var teaReady = true
	   *       , teaServed = false;
	   *
	   *     assert.isBoolean(teaReady, 'is the tea ready');
	   *     assert.isBoolean(teaServed, 'has tea been served');
	   *
	   * @name isBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isBoolean = function (val, msg) {
	    new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
	  };

	  /**
	   * ### .isNotBoolean(value, [message])
	   *
	   * Asserts that `value` is _not_ a boolean.
	   *
	   *     var teaReady = 'yep'
	   *       , teaServed = 'nope';
	   *
	   *     assert.isNotBoolean(teaReady, 'is the tea ready');
	   *     assert.isNotBoolean(teaServed, 'has tea been served');
	   *
	   * @name isNotBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotBoolean = function (val, msg) {
	    new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
	  };

	  /**
	   * ### .typeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
	   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
	   *     assert.typeOf('tea', 'string', 'we have a string');
	   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
	   *     assert.typeOf(null, 'null', 'we have a null');
	   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
	   *
	   * @name typeOf
	   * @param {Mixed} value
	   * @param {String} name
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.typeOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
	  };

	  /**
	   * ### .notTypeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is _not_ `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
	   *
	   * @name notTypeOf
	   * @param {Mixed} value
	   * @param {String} typeof name
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notTypeOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
	  };

	  /**
	   * ### .instanceOf(object, constructor, [message])
	   *
	   * Asserts that `value` is an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new Tea('chai');
	   *
	   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
	   *
	   * @name instanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.instanceOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
	  };

	  /**
	   * ### .notInstanceOf(object, constructor, [message])
	   *
	   * Asserts `value` is not an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new String('chai');
	   *
	   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
	   *
	   * @name notInstanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notInstanceOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.notInstanceOf, true)
	      .to.not.be.instanceOf(type);
	  };

	  /**
	   * ### .include(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Can be used to assert the
	   * inclusion of a value in an array, a substring in a string, or a subset of
	   * properties in an object.
	   *
	   *     assert.include([1,2,3], 2, 'array contains value');
	   *     assert.include('foobar', 'foo', 'string contains substring');
	   *     assert.include({ foo: 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property');
	   *
	   * Strict equality (===) is used. When asserting the inclusion of a value in
	   * an array, the array is searched for an element that's strictly equal to the
	   * given value. When asserting a subset of properties in an object, the object
	   * is searched for the given property keys, checking that each one is present
	   * and strictly equal to the given property value. For instance:
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.include([obj1, obj2], obj1);
	   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1});
	   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1, bar: obj2});
	   *
	   * @name include
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.include = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.include, true).include(inc);
	  };

	  /**
	   * ### .notInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Can be used to assert
	   * the absence of a value in an array, a substring in a string, or a subset of
	   * properties in an object.
	   *
	   *     assert.notInclude([1,2,3], 4, "array doesn't contain value");
	   *     assert.notInclude('foobar', 'baz', "string doesn't contain substring");
	   *     assert.notInclude({ foo: 'bar', hello: 'universe' }, { foo: 'baz' }, 'object doesn't contain property');
	   *
	   * Strict equality (===) is used. When asserting the absence of a value in an
	   * array, the array is searched to confirm the absence of an element that's
	   * strictly equal to the given value. When asserting a subset of properties in
	   * an object, the object is searched to confirm that at least one of the given
	   * property keys is either not present or not strictly equal to the given
	   * property value. For instance:
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.notInclude([obj1, obj2], {a: 1});
	   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
	   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: obj1, bar: {b: 2}});
	   *
	   * @name notInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
	  };

	  /**
	   * ### .deepInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Can be used to assert the
	   * inclusion of a value in an array or a subset of properties in an object.
	   * Deep equality is used.
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.deepInclude([obj1, obj2], {a: 1});
	   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
	   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 2}});
	   *
	   * @name deepInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
	  };

	  /**
	   * ### .notDeepInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Can be used to assert
	   * the absence of a value in an array or a subset of properties in an object.
	   * Deep equality is used.
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.notDeepInclude([obj1, obj2], {a: 9});
	   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 9}});
	   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 9}});
	   *
	   * @name notDeepInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
	  };

	  /**
	   * ### .nestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.nestedInclude({'.a': {'b': 'x'}}, {'\\.a.[b]': 'x'});
	   *     assert.nestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'x'});
	   *
	   * @name nestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
	  };

	  /**
	   * ### .notNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' does not include 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.notNestedInclude({'.a': {'b': 'x'}}, {'\\.a.b': 'y'});
	   *     assert.notNestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'y'});
	   *
	   * @name notNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notNestedInclude, true)
	      .not.nested.include(inc);
	  };

	  /**
	   * ### .deepNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while checking for deep equality.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.deepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {x: 1}});
	   *     assert.deepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {x: 1}});
	   *
	   * @name deepNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepNestedInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepNestedInclude, true)
	      .deep.nested.include(inc);
	  };

	  /**
	   * ### .notDeepNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' does not include 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while checking for deep equality.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.notDeepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {y: 1}})
	   *     assert.notDeepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {y: 2}});
	   *
	   * @name notDeepNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepNestedInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepNestedInclude, true)
	      .not.deep.nested.include(inc);
	  };

	  /**
	   * ### .ownInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while ignoring inherited properties.
	   *
	   *     assert.ownInclude({ a: 1 }, { a: 1 });
	   *
	   * @name ownInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.ownInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
	  };

	  /**
	   * ### .notOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while ignoring inherited properties.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     assert.notOwnInclude({ a: 1 }, { b: 2 });
	   *
	   * @name notOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
	  };

	  /**
	   * ### .deepOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while ignoring inherited properties and checking for deep equality.
	   *
	   *      assert.deepOwnInclude({a: {b: 2}}, {a: {b: 2}});
	   *
	   * @name deepOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepOwnInclude, true)
	      .deep.own.include(inc);
	  };

	   /**
	   * ### .notDeepOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while ignoring inherited properties and checking for deep equality.
	   *
	   *      assert.notDeepOwnInclude({a: {b: 2}}, {a: {c: 3}});
	   *
	   * @name notDeepOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepOwnInclude, true)
	      .not.deep.own.include(inc);
	  };

	  /**
	   * ### .match(value, regexp, [message])
	   *
	   * Asserts that `value` matches the regular expression `regexp`.
	   *
	   *     assert.match('foobar', /^foo/, 'regexp matches');
	   *
	   * @name match
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.match = function (exp, re, msg) {
	    new Assertion(exp, msg, assert.match, true).to.match(re);
	  };

	  /**
	   * ### .notMatch(value, regexp, [message])
	   *
	   * Asserts that `value` does not match the regular expression `regexp`.
	   *
	   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
	   *
	   * @name notMatch
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notMatch = function (exp, re, msg) {
	    new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
	  };

	  /**
	   * ### .property(object, property, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property`.
	   *
	   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
	   *     assert.property({ tea: { green: 'matcha' }}, 'toString');
	   *
	   * @name property
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.property = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.property, true).to.have.property(prop);
	  };

	  /**
	   * ### .notProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property`.
	   *
	   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *
	   * @name notProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notProperty, true)
	      .to.not.have.property(prop);
	  };

	  /**
	   * ### .propertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property` with a value given by `value`. Uses a strict equality check
	   * (===).
	   *
	   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
	   *
	   * @name propertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.propertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.propertyVal, true)
	      .to.have.property(prop, val);
	  };

	  /**
	   * ### .notPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property` with value given by `value`. Uses a strict equality check
	   * (===).
	   *
	   *     assert.notPropertyVal({ tea: 'is good' }, 'tea', 'is bad');
	   *     assert.notPropertyVal({ tea: 'is good' }, 'coffee', 'is good');
	   *
	   * @name notPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notPropertyVal, true)
	      .to.not.have.property(prop, val);
	  };

	  /**
	   * ### .deepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property` with a value given by `value`. Uses a deep equality check.
	   *
	   *     assert.deepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
	   *
	   * @name deepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.deepPropertyVal, true)
	      .to.have.deep.property(prop, val);
	  };

	  /**
	   * ### .notDeepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property` with value given by `value`. Uses a deep equality check.
	   *
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
	   *
	   * @name notDeepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notDeepPropertyVal, true)
	      .to.not.have.deep.property(prop, val);
	  };

	  /**
	   * ### .ownProperty(object, property, [message])
	   *
	   * Asserts that `object` has a direct property named by `property`. Inherited
	   * properties aren't checked.
	   *
	   *     assert.ownProperty({ tea: { green: 'matcha' }}, 'tea');
	   *
	   * @name ownProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.ownProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.ownProperty, true)
	      .to.have.own.property(prop);
	  };

	  /**
	   * ### .notOwnProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by
	   * `property`. Inherited properties aren't checked.
	   *
	   *     assert.notOwnProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *     assert.notOwnProperty({}, 'toString');
	   *
	   * @name notOwnProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.notOwnProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notOwnProperty, true)
	      .to.not.have.own.property(prop);
	  };

	  /**
	   * ### .ownPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct property named by `property` and a value
	   * equal to the provided `value`. Uses a strict equality check (===).
	   * Inherited properties aren't checked.
	   *
	   *     assert.ownPropertyVal({ coffee: 'is good'}, 'coffee', 'is good');
	   *
	   * @name ownPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.ownPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.ownPropertyVal, true)
	      .to.have.own.property(prop, value);
	  };

	  /**
	   * ### .notOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by `property`
	   * with a value equal to the provided `value`. Uses a strict equality check
	   * (===). Inherited properties aren't checked.
	   *
	   *     assert.notOwnPropertyVal({ tea: 'is better'}, 'tea', 'is worse');
	   *     assert.notOwnPropertyVal({}, 'toString', Object.prototype.toString);
	   *
	   * @name notOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.notOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.notOwnPropertyVal, true)
	      .to.not.have.own.property(prop, value);
	  };

	  /**
	   * ### .deepOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct property named by `property` and a value
	   * equal to the provided `value`. Uses a deep equality check. Inherited
	   * properties aren't checked.
	   *
	   *     assert.deepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
	   *
	   * @name deepOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.deepOwnPropertyVal, true)
	      .to.have.deep.own.property(prop, value);
	  };

	  /**
	   * ### .notDeepOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by `property`
	   * with a value equal to the provided `value`. Uses a deep equality check.
	   * Inherited properties aren't checked.
	   *
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
	   *     assert.notDeepOwnPropertyVal({}, 'toString', Object.prototype.toString);
	   *
	   * @name notDeepOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true)
	      .to.not.have.deep.own.property(prop, value);
	  };

	  /**
	   * ### .nestedProperty(object, property, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property`, which can be a string using dot- and bracket-notation for
	   * nested reference.
	   *
	   *     assert.nestedProperty({ tea: { green: 'matcha' }}, 'tea.green');
	   *
	   * @name nestedProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.nestedProperty, true)
	      .to.have.nested.property(prop);
	  };

	  /**
	   * ### .notNestedProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property`, which
	   * can be a string using dot- and bracket-notation for nested reference. The
	   * property cannot exist on the object nor anywhere in its prototype chain.
	   *
	   *     assert.notNestedProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
	   *
	   * @name notNestedProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notNestedProperty, true)
	      .to.not.have.nested.property(prop);
	  };

	  /**
	   * ### .nestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with value given
	   * by `value`. `property` can use dot- and bracket-notation for nested
	   * reference. Uses a strict equality check (===).
	   *
	   *     assert.nestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
	   *
	   * @name nestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.nestedPropertyVal, true)
	      .to.have.nested.property(prop, val);
	  };

	  /**
	   * ### .notNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property` with
	   * value given by `value`. `property` can use dot- and bracket-notation for
	   * nested reference. Uses a strict equality check (===).
	   *
	   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
	   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'coffee.green', 'matcha');
	   *
	   * @name notNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notNestedPropertyVal, true)
	      .to.not.have.nested.property(prop, val);
	  };

	  /**
	   * ### .deepNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with a value given
	   * by `value`. `property` can use dot- and bracket-notation for nested
	   * reference. Uses a deep equality check.
	   *
	   *     assert.deepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yum' });
	   *
	   * @name deepNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.deepNestedPropertyVal, true)
	      .to.have.deep.nested.property(prop, val);
	  };

	  /**
	   * ### .notDeepNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property` with
	   * value given by `value`. `property` can use dot- and bracket-notation for
	   * nested reference. Uses a deep equality check.
	   *
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { oolong: 'yum' });
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yuck' });
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.black', { matcha: 'yum' });
	   *
	   * @name notDeepNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true)
	      .to.not.have.deep.nested.property(prop, val);
	  };

	  /**
	   * ### .lengthOf(object, length, [message])
	   *
	   * Asserts that `object` has a `length` or `size` with the expected value.
	   *
	   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
	   *     assert.lengthOf('foobar', 6, 'string has length of 6');
	   *     assert.lengthOf(new Set([1,2,3]), 3, 'set has size of 3');
	   *     assert.lengthOf(new Map([['a',1],['b',2],['c',3]]), 3, 'map has size of 3');
	   *
	   * @name lengthOf
	   * @param {Mixed} object
	   * @param {Number} length
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.lengthOf = function (exp, len, msg) {
	    new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
	  };

	  /**
	   * ### .hasAnyKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has at least one of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'iDontExist', 'baz']);
	   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, iDontExist: 99, baz: 1337});
	   *     assert.hasAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.hasAnyKeys(new Set([{foo: 'bar'}, 'anotherKey']), [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name hasAnyKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAnyKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
	  };

	  /**
	   * ### .hasAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all and only all of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
	   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337]);
	   *     assert.hasAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.hasAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name hasAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
	  };

	  /**
	   * ### .containsAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all of the `keys` provided but may have more keys not listed.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'baz']);
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, baz: 1337});
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337});
	   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}]);
	   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}]);
	   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name containsAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.containsAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.containsAllKeys, true)
	      .to.contain.all.keys(keys);
	  };

	  /**
	   * ### .doesNotHaveAnyKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has none of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
	   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
	   *     assert.doesNotHaveAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
	   *     assert.doesNotHaveAnyKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
	   *
	   * @name doesNotHaveAnyKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true)
	      .to.not.have.any.keys(keys);
	  };

	  /**
	   * ### .doesNotHaveAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` does not have at least one of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
	   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
	   *     assert.doesNotHaveAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
	   *     assert.doesNotHaveAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
	   *
	   * @name doesNotHaveAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAllKeys, true)
	      .to.not.have.all.keys(keys);
	  };

	  /**
	   * ### .hasAnyDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has at least one of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {three: 'three'}]);
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name hasAnyDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAnyDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAnyDeepKeys, true)
	      .to.have.any.deep.keys(keys);
	  };

	 /**
	   * ### .hasAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all and only all of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne']]), {one: 'one'});
	   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAllDeepKeys(new Set([{one: 'one'}]), {one: 'one'});
	   *     assert.hasAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name hasAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAllDeepKeys, true)
	      .to.have.all.deep.keys(keys);
	  };

	 /**
	   * ### .containsAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` contains all of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
	   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
	   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name containsAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.containsAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.containsAllDeepKeys, true)
	      .to.contain.all.deep.keys(keys);
	  };

	 /**
	   * ### .doesNotHaveAnyDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has none of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
	   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
	   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
	   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
	   *
	   * @name doesNotHaveAnyDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true)
	      .to.not.have.any.deep.keys(keys);
	  };

	 /**
	   * ### .doesNotHaveAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` does not have at least one of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
	   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {one: 'one'}]);
	   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
	   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {fifty: 'fifty'}]);
	   *
	   * @name doesNotHaveAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true)
	      .to.not.have.all.deep.keys(keys);
	  };

	 /**
	   * ### .throws(fn, [errorLike/string/regexp], [string/regexp], [message])
	   *
	   * If `errorLike` is an `Error` constructor, asserts that `fn` will throw an error that is an
	   * instance of `errorLike`.
	   * If `errorLike` is an `Error` instance, asserts that the error thrown is the same
	   * instance as `errorLike`.
	   * If `errMsgMatcher` is provided, it also asserts that the error thrown will have a
	   * message matching `errMsgMatcher`.
	   *
	   *     assert.throws(fn, 'Error thrown must have this msg');
	   *     assert.throws(fn, /Error thrown must have a msg that matches this/);
	   *     assert.throws(fn, ReferenceError);
	   *     assert.throws(fn, errorInstance);
	   *     assert.throws(fn, ReferenceError, 'Error thrown must be a ReferenceError and have this msg');
	   *     assert.throws(fn, errorInstance, 'Error thrown must be the same errorInstance and have this msg');
	   *     assert.throws(fn, ReferenceError, /Error thrown must be a ReferenceError and match this/);
	   *     assert.throws(fn, errorInstance, /Error thrown must be the same errorInstance and match this/);
	   *
	   * @name throws
	   * @alias throw
	   * @alias Throw
	   * @param {Function} fn
	   * @param {ErrorConstructor|Error} errorLike
	   * @param {RegExp|String} errMsgMatcher
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @namespace Assert
	   * @api public
	   */

	  assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
	    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    var assertErr = new Assertion(fn, msg, assert.throws, true)
	      .to.throw(errorLike, errMsgMatcher);
	    return flag(assertErr, 'object');
	  };

	  /**
	   * ### .doesNotThrow(fn, [errorLike/string/regexp], [string/regexp], [message])
	   *
	   * If `errorLike` is an `Error` constructor, asserts that `fn` will _not_ throw an error that is an
	   * instance of `errorLike`.
	   * If `errorLike` is an `Error` instance, asserts that the error thrown is _not_ the same
	   * instance as `errorLike`.
	   * If `errMsgMatcher` is provided, it also asserts that the error thrown will _not_ have a
	   * message matching `errMsgMatcher`.
	   *
	   *     assert.doesNotThrow(fn, 'Any Error thrown must not have this message');
	   *     assert.doesNotThrow(fn, /Any Error thrown must not match this/);
	   *     assert.doesNotThrow(fn, Error);
	   *     assert.doesNotThrow(fn, errorInstance);
	   *     assert.doesNotThrow(fn, Error, 'Error must not have this message');
	   *     assert.doesNotThrow(fn, errorInstance, 'Error must not have this message');
	   *     assert.doesNotThrow(fn, Error, /Error must not match this/);
	   *     assert.doesNotThrow(fn, errorInstance, /Error must not match this/);
	   *
	   * @name doesNotThrow
	   * @param {Function} fn
	   * @param {ErrorConstructor} errorLike
	   * @param {RegExp|String} errMsgMatcher
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, msg) {
	    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    new Assertion(fn, msg, assert.doesNotThrow, true)
	      .to.not.throw(errorLike, errMsgMatcher);
	  };

	  /**
	   * ### .operator(val1, operator, val2, [message])
	   *
	   * Compares two values using `operator`.
	   *
	   *     assert.operator(1, '<', 2, 'everything is ok');
	   *     assert.operator(1, '>', 2, 'this will fail');
	   *
	   * @name operator
	   * @param {Mixed} val1
	   * @param {String} operator
	   * @param {Mixed} val2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.operator = function (val, operator, val2, msg) {
	    var ok;
	    switch(operator) {
	      case '==':
	        ok = val == val2;
	        break;
	      case '===':
	        ok = val === val2;
	        break;
	      case '>':
	        ok = val > val2;
	        break;
	      case '>=':
	        ok = val >= val2;
	        break;
	      case '<':
	        ok = val < val2;
	        break;
	      case '<=':
	        ok = val <= val2;
	        break;
	      case '!=':
	        ok = val != val2;
	        break;
	      case '!==':
	        ok = val !== val2;
	        break;
	      default:
	        msg = msg ? msg + ': ' : msg;
	        throw new chai.AssertionError(
	          msg + 'Invalid operator "' + operator + '"',
	          undefined,
	          assert.operator
	        );
	    }
	    var test = new Assertion(ok, msg, assert.operator, true);
	    test.assert(
	        true === flag(test, 'object')
	      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
	      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
	  };

	  /**
	   * ### .closeTo(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name closeTo
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.closeTo = function (act, exp, delta, msg) {
	    new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
	  };

	  /**
	   * ### .approximately(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name approximately
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.approximately = function (act, exp, delta, msg) {
	    new Assertion(act, msg, assert.approximately, true)
	      .to.be.approximately(exp, delta);
	  };

	  /**
	   * ### .sameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in any order. Uses a
	   * strict equality check (===).
	   *
	   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
	   *
	   * @name sameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameMembers, true)
	      .to.have.same.members(set2);
	  };

	  /**
	   * ### .notSameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in any order.
	   * Uses a strict equality check (===).
	   *
	   *     assert.notSameMembers([ 1, 2, 3 ], [ 5, 1, 3 ], 'not same members');
	   *
	   * @name notSameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameMembers, true)
	      .to.not.have.same.members(set2);
	  };

	  /**
	   * ### .sameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in any order. Uses a
	   * deep equality check.
	   *
	   *     assert.sameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members');
	   *
	   * @name sameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameDeepMembers, true)
	      .to.have.same.deep.members(set2);
	  };

	  /**
	   * ### .notSameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in any order.
	   * Uses a deep equality check.
	   *
	   *     assert.notSameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { f: 5 }], 'not same deep members');
	   *
	   * @name notSameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameDeepMembers, true)
	      .to.not.have.same.deep.members(set2);
	  };

	  /**
	   * ### .sameOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in the same order.
	   * Uses a strict equality check (===).
	   *
	   *     assert.sameOrderedMembers([ 1, 2, 3 ], [ 1, 2, 3 ], 'same ordered members');
	   *
	   * @name sameOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameOrderedMembers, true)
	      .to.have.same.ordered.members(set2);
	  };

	  /**
	   * ### .notSameOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in the same
	   * order. Uses a strict equality check (===).
	   *
	   *     assert.notSameOrderedMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'not same ordered members');
	   *
	   * @name notSameOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameOrderedMembers, true)
	      .to.not.have.same.ordered.members(set2);
	  };

	  /**
	   * ### .sameDeepOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in the same order.
	   * Uses a deep equality check.
	   *
	   *     assert.sameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { c: 3 } ], 'same deep ordered members');
	   *
	   * @name sameDeepOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameDeepOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameDeepOrderedMembers, true)
	      .to.have.same.deep.ordered.members(set2);
	  };

	  /**
	   * ### .notSameDeepOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in the same
	   * order. Uses a deep equality check.
	   *
	   *     assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { z: 5 } ], 'not same deep ordered members');
	   *     assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { c: 3 } ], 'not same deep ordered members');
	   *
	   * @name notSameDeepOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true)
	      .to.not.have.same.deep.ordered.members(set2);
	  };

	  /**
	   * ### .includeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in any order. Uses a
	   * strict equality check (===). Duplicates are ignored.
	   *
	   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1, 2 ], 'include members');
	   *
	   * @name includeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeMembers, true)
	      .to.include.members(subset);
	  };

	  /**
	   * ### .notIncludeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in any order. Uses a
	   * strict equality check (===). Duplicates are ignored.
	   *
	   *     assert.notIncludeMembers([ 1, 2, 3 ], [ 5, 1 ], 'not include members');
	   *
	   * @name notIncludeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeMembers, true)
	      .to.not.include.members(subset);
	  };

	  /**
	   * ### .includeDeepMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in any order. Uses a deep
	   * equality check. Duplicates are ignored.
	   *
	   *     assert.includeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { b: 2 } ], 'include deep members');
	   *
	   * @name includeDeepMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeDeepMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeDeepMembers, true)
	      .to.include.deep.members(subset);
	  };

	  /**
	   * ### .notIncludeDeepMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in any order. Uses a
	   * deep equality check. Duplicates are ignored.
	   *
	   *     assert.notIncludeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { f: 5 } ], 'not include deep members');
	   *
	   * @name notIncludeDeepMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeDeepMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeDeepMembers, true)
	      .to.not.include.deep.members(subset);
	  };

	  /**
	   * ### .includeOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a strict equality
	   * check (===).
	   *
	   *     assert.includeOrderedMembers([ 1, 2, 3 ], [ 1, 2 ], 'include ordered members');
	   *
	   * @name includeOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeOrderedMembers, true)
	      .to.include.ordered.members(subset);
	  };

	  /**
	   * ### .notIncludeOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a strict equality
	   * check (===).
	   *
	   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 1 ], 'not include ordered members');
	   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 3 ], 'not include ordered members');
	   *
	   * @name notIncludeOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeOrderedMembers, true)
	      .to.not.include.ordered.members(subset);
	  };

	  /**
	   * ### .includeDeepOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a deep equality
	   * check.
	   *
	   *     assert.includeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 } ], 'include deep ordered members');
	   *
	   * @name includeDeepOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeDeepOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeDeepOrderedMembers, true)
	      .to.include.deep.ordered.members(subset);
	  };

	  /**
	   * ### .notIncludeDeepOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a deep equality
	   * check.
	   *
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { f: 5 } ], 'not include deep ordered members');
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 } ], 'not include deep ordered members');
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { c: 3 } ], 'not include deep ordered members');
	   *
	   * @name notIncludeDeepOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true)
	      .to.not.include.deep.ordered.members(subset);
	  };

	  /**
	   * ### .oneOf(inList, list, [message])
	   *
	   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
	   *
	   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
	   *
	   * @name oneOf
	   * @param {*} inList
	   * @param {Array<*>} list
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.oneOf = function (inList, list, msg) {
	    new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
	  };

	  /**
	   * ### .changes(function, object, property, [message])
	   *
	   * Asserts that a function changes the value of a property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 22 };
	   *     assert.changes(fn, obj, 'val');
	   *
	   * @name changes
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changes = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
	  };

	   /**
	   * ### .changesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function changes the value of a property by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 2 };
	   *     assert.changesBy(fn, obj, 'val', 2);
	   *
	   * @name changesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changesBy, true)
	      .to.change(obj, prop).by(delta);
	  };

	   /**
	   * ### .doesNotChange(function, object, property, [message])
	   *
	   * Asserts that a function does not change the value of a property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { console.log('foo'); };
	   *     assert.doesNotChange(fn, obj, 'val');
	   *
	   * @name doesNotChange
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotChange = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotChange, true)
	      .to.not.change(obj, prop);
	  };

	  /**
	   * ### .changesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not change the value of a property or of a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 10 };
	   *     assert.changesButNotBy(fn, obj, 'val', 5);
	   *
	   * @name changesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changesButNotBy, true)
	      .to.change(obj, prop).but.not.by(delta);
	  };

	  /**
	   * ### .increases(function, object, property, [message])
	   *
	   * Asserts that a function increases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 13 };
	   *     assert.increases(fn, obj, 'val');
	   *
	   * @name increases
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increases = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.increases, true)
	      .to.increase(obj, prop);
	  };

	  /**
	   * ### .increasesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function increases a numeric object property or a function's return value by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 10 };
	   *     assert.increasesBy(fn, obj, 'val', 10);
	   *
	   * @name increasesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increasesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.increasesBy, true)
	      .to.increase(obj, prop).by(delta);
	  };

	  /**
	   * ### .doesNotIncrease(function, object, property, [message])
	   *
	   * Asserts that a function does not increase a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 8 };
	   *     assert.doesNotIncrease(fn, obj, 'val');
	   *
	   * @name doesNotIncrease
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotIncrease = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotIncrease, true)
	      .to.not.increase(obj, prop);
	  };

	  /**
	   * ### .increasesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not increase a numeric object property or function's return value by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     assert.increasesButNotBy(fn, obj, 'val', 10);
	   *
	   * @name increasesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.increasesButNotBy, true)
	      .to.increase(obj, prop).but.not.by(delta);
	  };

	  /**
	   * ### .decreases(function, object, property, [message])
	   *
	   * Asserts that a function decreases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.decreases(fn, obj, 'val');
	   *
	   * @name decreases
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreases = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.decreases, true)
	      .to.decrease(obj, prop);
	  };

	  /**
	   * ### .decreasesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val -= 5 };
	   *     assert.decreasesBy(fn, obj, 'val', 5);
	   *
	   * @name decreasesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreasesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.decreasesBy, true)
	      .to.decrease(obj, prop).by(delta);
	  };

	  /**
	   * ### .doesNotDecrease(function, object, property, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     assert.doesNotDecrease(fn, obj, 'val');
	   *
	   * @name doesNotDecrease
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotDecrease = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotDecrease, true)
	      .to.not.decrease(obj, prop);
	  };

	  /**
	   * ### .doesNotDecreaseBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.doesNotDecreaseBy(fn, obj, 'val', 1);
	   *
	   * @name doesNotDecreaseBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotDecreaseBy, true)
	      .to.not.decrease(obj, prop).by(delta);
	  };

	  /**
	   * ### .decreasesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.decreasesButNotBy(fn, obj, 'val', 1);
	   *
	   * @name decreasesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.decreasesButNotBy, true)
	      .to.decrease(obj, prop).but.not.by(delta);
	  };

	  /*!
	   * ### .ifError(object)
	   *
	   * Asserts if value is not a false value, and throws if it is a true value.
	   * This is added to allow for chai to be a drop-in replacement for Node's
	   * assert class.
	   *
	   *     var err = new Error('I am a custom error');
	   *     assert.ifError(err); // Rethrows err!
	   *
	   * @name ifError
	   * @param {Object} object
	   * @namespace Assert
	   * @api public
	   */

	  assert.ifError = function (val) {
	    if (val) {
	      throw(val);
	    }
	  };

	  /**
	   * ### .isExtensible(object)
	   *
	   * Asserts that `object` is extensible (can have new properties added to it).
	   *
	   *     assert.isExtensible({});
	   *
	   * @name isExtensible
	   * @alias extensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isExtensible = function (obj, msg) {
	    new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
	  };

	  /**
	   * ### .isNotExtensible(object)
	   *
	   * Asserts that `object` is _not_ extensible.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({});
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     assert.isNotExtensible(nonExtensibleObject);
	   *     assert.isNotExtensible(sealedObject);
	   *     assert.isNotExtensible(frozenObject);
	   *
	   * @name isNotExtensible
	   * @alias notExtensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotExtensible = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
	  };

	  /**
	   * ### .isSealed(object)
	   *
	   * Asserts that `object` is sealed (cannot have new properties added to it
	   * and its existing properties cannot be removed).
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.seal({});
	   *
	   *     assert.isSealed(sealedObject);
	   *     assert.isSealed(frozenObject);
	   *
	   * @name isSealed
	   * @alias sealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isSealed = function (obj, msg) {
	    new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
	  };

	  /**
	   * ### .isNotSealed(object)
	   *
	   * Asserts that `object` is _not_ sealed.
	   *
	   *     assert.isNotSealed({});
	   *
	   * @name isNotSealed
	   * @alias notSealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotSealed = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
	  };

	  /**
	   * ### .isFrozen(object)
	   *
	   * Asserts that `object` is frozen (cannot have new properties added to it
	   * and its existing properties cannot be modified).
	   *
	   *     var frozenObject = Object.freeze({});
	   *     assert.frozen(frozenObject);
	   *
	   * @name isFrozen
	   * @alias frozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFrozen = function (obj, msg) {
	    new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
	  };

	  /**
	   * ### .isNotFrozen(object)
	   *
	   * Asserts that `object` is _not_ frozen.
	   *
	   *     assert.isNotFrozen({});
	   *
	   * @name isNotFrozen
	   * @alias notFrozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFrozen = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
	  };

	  /**
	   * ### .isEmpty(target)
	   *
	   * Asserts that the target does not contain any values.
	   * For arrays and strings, it checks the `length` property.
	   * For `Map` and `Set` instances, it checks the `size` property.
	   * For non-function objects, it gets the count of own
	   * enumerable string keys.
	   *
	   *     assert.isEmpty([]);
	   *     assert.isEmpty('');
	   *     assert.isEmpty(new Map);
	   *     assert.isEmpty({});
	   *
	   * @name isEmpty
	   * @alias empty
	   * @param {Object|Array|String|Map|Set} target
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isEmpty = function(val, msg) {
	    new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
	  };

	  /**
	   * ### .isNotEmpty(target)
	   *
	   * Asserts that the target contains values.
	   * For arrays and strings, it checks the `length` property.
	   * For `Map` and `Set` instances, it checks the `size` property.
	   * For non-function objects, it gets the count of own
	   * enumerable string keys.
	   *
	   *     assert.isNotEmpty([1, 2]);
	   *     assert.isNotEmpty('34');
	   *     assert.isNotEmpty(new Set([5, 6]));
	   *     assert.isNotEmpty({ key: 7 });
	   *
	   * @name isNotEmpty
	   * @alias notEmpty
	   * @param {Object|Array|String|Map|Set} target
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotEmpty = function(val, msg) {
	    new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
	  };

	  /*!
	   * Aliases.
	   */

	  (function alias(name, as){
	    assert[as] = assert[name];
	    return alias;
	  })
	  ('isOk', 'ok')
	  ('isNotOk', 'notOk')
	  ('throws', 'throw')
	  ('throws', 'Throw')
	  ('isExtensible', 'extensible')
	  ('isNotExtensible', 'notExtensible')
	  ('isSealed', 'sealed')
	  ('isNotSealed', 'notSealed')
	  ('isFrozen', 'frozen')
	  ('isNotFrozen', 'notFrozen')
	  ('isEmpty', 'empty')
	  ('isNotEmpty', 'notEmpty');
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	(function (exports) {
	var used = [];

	/*!
	 * Chai version
	 */

	exports.version = '4.3.3';

	/*!
	 * Assertion Error
	 */

	exports.AssertionError = assertionError;

	/*!
	 * Utils for plugins (not exported)
	 */

	var util = utils;

	/**
	 * # .use(function)
	 *
	 * Provides a way to extend the internals of Chai.
	 *
	 * @param {Function}
	 * @returns {this} for chaining
	 * @api public
	 */

	exports.use = function (fn) {
	  if (!~used.indexOf(fn)) {
	    fn(exports, util);
	    used.push(fn);
	  }

	  return exports;
	};

	/*!
	 * Utility Functions
	 */

	exports.util = util;

	/*!
	 * Configuration
	 */

	var config = config$6;
	exports.config = config;

	/*!
	 * Primary `Assertion` prototype
	 */

	var assertion$1 = assertion;
	exports.use(assertion$1);

	/*!
	 * Core Assertions
	 */

	var core = assertions;
	exports.use(core);

	/*!
	 * Expect interface
	 */

	var expect = expect$1;
	exports.use(expect);

	/*!
	 * Should interface
	 */

	var should = should$1;
	exports.use(should);

	/*!
	 * Assert interface
	 */

	var assert = assert$1;
	exports.use(assert);
	}(chai$7));

	var chai = chai$7;

	const expect = chai.expect;
	const version$1 = chai.version;
	const Assertion = chai.Assertion;
	const AssertionError = chai.AssertionError;
	const util = chai.util;
	const config = chai.config;
	const use = chai.use;
	const should = chai.should;
	const assert = chai.assert;
	const core = chai.core;

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const ValidPhaseNames = new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
	/**
	 * A private implementation of Pipeline.
	 * Do not export this class from the package.
	 * @internal
	 */
	class HttpPipeline {
	    constructor(policies) {
	        var _a;
	        this._policies = [];
	        this._policies = (_a = policies === null || policies === void 0 ? void 0 : policies.slice(0)) !== null && _a !== void 0 ? _a : [];
	        this._orderedPolicies = undefined;
	    }
	    addPolicy(policy, options = {}) {
	        if (options.phase && options.afterPhase) {
	            throw new Error("Policies inside a phase cannot specify afterPhase.");
	        }
	        if (options.phase && !ValidPhaseNames.has(options.phase)) {
	            throw new Error(`Invalid phase name: ${options.phase}`);
	        }
	        if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
	            throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
	        }
	        this._policies.push({
	            policy,
	            options,
	        });
	        this._orderedPolicies = undefined;
	    }
	    removePolicy(options) {
	        const removedPolicies = [];
	        this._policies = this._policies.filter((policyDescriptor) => {
	            if ((options.name && policyDescriptor.policy.name === options.name) ||
	                (options.phase && policyDescriptor.options.phase === options.phase)) {
	                removedPolicies.push(policyDescriptor.policy);
	                return false;
	            }
	            else {
	                return true;
	            }
	        });
	        this._orderedPolicies = undefined;
	        return removedPolicies;
	    }
	    sendRequest(httpClient, request) {
	        const policies = this.getOrderedPolicies();
	        const pipeline = policies.reduceRight((next, policy) => {
	            return (req) => {
	                return policy.sendRequest(req, next);
	            };
	        }, (req) => httpClient.sendRequest(req));
	        return pipeline(request);
	    }
	    getOrderedPolicies() {
	        if (!this._orderedPolicies) {
	            this._orderedPolicies = this.orderPolicies();
	        }
	        return this._orderedPolicies;
	    }
	    clone() {
	        return new HttpPipeline(this._policies);
	    }
	    static create() {
	        return new HttpPipeline();
	    }
	    orderPolicies() {
	        /**
	         * The goal of this method is to reliably order pipeline policies
	         * based on their declared requirements when they were added.
	         *
	         * Order is first determined by phase:
	         *
	         * 1. Serialize Phase
	         * 2. Policies not in a phase
	         * 3. Deserialize Phase
	         * 4. Retry Phase
	         * 5. Sign Phase
	         *
	         * Within each phase, policies are executed in the order
	         * they were added unless they were specified to execute
	         * before/after other policies or after a particular phase.
	         *
	         * To determine the final order, we will walk the policy list
	         * in phase order multiple times until all dependencies are
	         * satisfied.
	         *
	         * `afterPolicies` are the set of policies that must be
	         * executed before a given policy. This requirement is
	         * considered satisfied when each of the listed policies
	         * have been scheduled.
	         *
	         * `beforePolicies` are the set of policies that must be
	         * executed after a given policy. Since this dependency
	         * can be expressed by converting it into a equivalent
	         * `afterPolicies` declarations, they are normalized
	         * into that form for simplicity.
	         *
	         * An `afterPhase` dependency is considered satisfied when all
	         * policies in that phase have scheduled.
	         *
	         */
	        const result = [];
	        // Track all policies we know about.
	        const policyMap = new Map();
	        function createPhase(name) {
	            return {
	                name,
	                policies: new Set(),
	                hasRun: false,
	                hasAfterPolicies: false,
	            };
	        }
	        // Track policies for each phase.
	        const serializePhase = createPhase("Serialize");
	        const noPhase = createPhase("None");
	        const deserializePhase = createPhase("Deserialize");
	        const retryPhase = createPhase("Retry");
	        const signPhase = createPhase("Sign");
	        // a list of phases in order
	        const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
	        // Small helper function to map phase name to each Phase
	        function getPhase(phase) {
	            if (phase === "Retry") {
	                return retryPhase;
	            }
	            else if (phase === "Serialize") {
	                return serializePhase;
	            }
	            else if (phase === "Deserialize") {
	                return deserializePhase;
	            }
	            else if (phase === "Sign") {
	                return signPhase;
	            }
	            else {
	                return noPhase;
	            }
	        }
	        // First walk each policy and create a node to track metadata.
	        for (const descriptor of this._policies) {
	            const policy = descriptor.policy;
	            const options = descriptor.options;
	            const policyName = policy.name;
	            if (policyMap.has(policyName)) {
	                throw new Error("Duplicate policy names not allowed in pipeline");
	            }
	            const node = {
	                policy,
	                dependsOn: new Set(),
	                dependants: new Set(),
	            };
	            if (options.afterPhase) {
	                node.afterPhase = getPhase(options.afterPhase);
	                node.afterPhase.hasAfterPolicies = true;
	            }
	            policyMap.set(policyName, node);
	            const phase = getPhase(options.phase);
	            phase.policies.add(node);
	        }
	        // Now that each policy has a node, connect dependency references.
	        for (const descriptor of this._policies) {
	            const { policy, options } = descriptor;
	            const policyName = policy.name;
	            const node = policyMap.get(policyName);
	            if (!node) {
	                throw new Error(`Missing node for policy ${policyName}`);
	            }
	            if (options.afterPolicies) {
	                for (const afterPolicyName of options.afterPolicies) {
	                    const afterNode = policyMap.get(afterPolicyName);
	                    if (afterNode) {
	                        // Linking in both directions helps later
	                        // when we want to notify dependants.
	                        node.dependsOn.add(afterNode);
	                        afterNode.dependants.add(node);
	                    }
	                }
	            }
	            if (options.beforePolicies) {
	                for (const beforePolicyName of options.beforePolicies) {
	                    const beforeNode = policyMap.get(beforePolicyName);
	                    if (beforeNode) {
	                        // To execute before another node, make it
	                        // depend on the current node.
	                        beforeNode.dependsOn.add(node);
	                        node.dependants.add(beforeNode);
	                    }
	                }
	            }
	        }
	        function walkPhase(phase) {
	            phase.hasRun = true;
	            // Sets iterate in insertion order
	            for (const node of phase.policies) {
	                if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size)) {
	                    // If this node is waiting on a phase to complete,
	                    // we need to skip it for now.
	                    // Even if the phase is empty, we should wait for it
	                    // to be walked to avoid re-ordering policies.
	                    continue;
	                }
	                if (node.dependsOn.size === 0) {
	                    // If there's nothing else we're waiting for, we can
	                    // add this policy to the result list.
	                    result.push(node.policy);
	                    // Notify anything that depends on this policy that
	                    // the policy has been scheduled.
	                    for (const dependant of node.dependants) {
	                        dependant.dependsOn.delete(node);
	                    }
	                    policyMap.delete(node.policy.name);
	                    phase.policies.delete(node);
	                }
	            }
	        }
	        function walkPhases() {
	            for (const phase of orderedPhases) {
	                walkPhase(phase);
	                // if the phase isn't complete
	                if (phase.policies.size > 0 && phase !== noPhase) {
	                    if (!noPhase.hasRun) {
	                        // Try running noPhase to see if that unblocks this phase next tick.
	                        // This can happen if a phase that happens before noPhase
	                        // is waiting on a noPhase policy to complete.
	                        walkPhase(noPhase);
	                    }
	                    // Don't proceed to the next phase until this phase finishes.
	                    return;
	                }
	                if (phase.hasAfterPolicies) {
	                    // Run any policies unblocked by this phase
	                    walkPhase(noPhase);
	                }
	            }
	        }
	        // Iterate until we've put every node in the result list.
	        let iteration = 0;
	        while (policyMap.size > 0) {
	            iteration++;
	            const initialResultLength = result.length;
	            // Keep walking each phase in order until we can order every node.
	            walkPhases();
	            // The result list *should* get at least one larger each time
	            // after the first full pass.
	            // Otherwise, we're going to loop forever.
	            if (result.length <= initialResultLength && iteration > 1) {
	                throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
	            }
	        }
	        return result;
	    }
	}
	/**
	 * Creates a totally empty pipeline.
	 * Useful for testing or creating a custom one.
	 */
	function createEmptyPipeline() {
	    return HttpPipeline.create();
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	function log(...args) {
	    if (args.length > 0) {
	        const firstArg = String(args[0]);
	        if (firstArg.includes(":error")) {
	            console.error(...args);
	        }
	        else if (firstArg.includes(":warning")) {
	            console.warn(...args);
	        }
	        else if (firstArg.includes(":info")) {
	            console.info(...args);
	        }
	        else if (firstArg.includes(":verbose")) {
	            console.debug(...args);
	        }
	        else {
	            console.debug(...args);
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	const debugEnvVariable = (typeof process !== "undefined" && process.env && process.env.DEBUG) || undefined;
	let enabledString;
	let enabledNamespaces = [];
	let skippedNamespaces = [];
	const debuggers = [];
	if (debugEnvVariable) {
	    enable(debugEnvVariable);
	}
	const debugObj = Object.assign((namespace) => {
	    return createDebugger(namespace);
	}, {
	    enable,
	    enabled,
	    disable,
	    log
	});
	function enable(namespaces) {
	    enabledString = namespaces;
	    enabledNamespaces = [];
	    skippedNamespaces = [];
	    const wildcard = /\*/g;
	    const namespaceList = namespaces.split(",").map((ns) => ns.trim().replace(wildcard, ".*?"));
	    for (const ns of namespaceList) {
	        if (ns.startsWith("-")) {
	            skippedNamespaces.push(new RegExp(`^${ns.substr(1)}$`));
	        }
	        else {
	            enabledNamespaces.push(new RegExp(`^${ns}$`));
	        }
	    }
	    for (const instance of debuggers) {
	        instance.enabled = enabled(instance.namespace);
	    }
	}
	function enabled(namespace) {
	    if (namespace.endsWith("*")) {
	        return true;
	    }
	    for (const skipped of skippedNamespaces) {
	        if (skipped.test(namespace)) {
	            return false;
	        }
	    }
	    for (const enabledNamespace of enabledNamespaces) {
	        if (enabledNamespace.test(namespace)) {
	            return true;
	        }
	    }
	    return false;
	}
	function disable() {
	    const result = enabledString || "";
	    enable("");
	    return result;
	}
	function createDebugger(namespace) {
	    const newDebugger = Object.assign(debug, {
	        enabled: enabled(namespace),
	        destroy,
	        log: debugObj.log,
	        namespace,
	        extend
	    });
	    function debug(...args) {
	        if (!newDebugger.enabled) {
	            return;
	        }
	        if (args.length > 0) {
	            args[0] = `${namespace} ${args[0]}`;
	        }
	        newDebugger.log(...args);
	    }
	    debuggers.push(newDebugger);
	    return newDebugger;
	}
	function destroy() {
	    const index = debuggers.indexOf(this);
	    if (index >= 0) {
	        debuggers.splice(index, 1);
	        return true;
	    }
	    return false;
	}
	function extend(namespace) {
	    const newDebugger = createDebugger(`${this.namespace}:${namespace}`);
	    newDebugger.log = this.log;
	    return newDebugger;
	}

	// Copyright (c) Microsoft Corporation.
	const registeredLoggers = new Set();
	const logLevelFromEnv = (typeof process !== "undefined" && process.env && process.env.AZURE_LOG_LEVEL) || undefined;
	let azureLogLevel;
	/**
	 * The AzureLogger provides a mechanism for overriding where logs are output to.
	 * By default, logs are sent to stderr.
	 * Override the `log` method to redirect logs to another location.
	 */
	const AzureLogger = debugObj("azure");
	AzureLogger.log = (...args) => {
	    debugObj.log(...args);
	};
	const AZURE_LOG_LEVELS = ["verbose", "info", "warning", "error"];
	if (logLevelFromEnv) {
	    // avoid calling setLogLevel because we don't want a mis-set environment variable to crash
	    if (isAzureLogLevel(logLevelFromEnv)) {
	        setLogLevel(logLevelFromEnv);
	    }
	    else {
	        console.error(`AZURE_LOG_LEVEL set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${AZURE_LOG_LEVELS.join(", ")}.`);
	    }
	}
	/**
	 * Immediately enables logging at the specified log level.
	 * @param level - The log level to enable for logging.
	 * Options from most verbose to least verbose are:
	 * - verbose
	 * - info
	 * - warning
	 * - error
	 */
	function setLogLevel(level) {
	    if (level && !isAzureLogLevel(level)) {
	        throw new Error(`Unknown log level '${level}'. Acceptable values: ${AZURE_LOG_LEVELS.join(",")}`);
	    }
	    azureLogLevel = level;
	    const enabledNamespaces = [];
	    for (const logger of registeredLoggers) {
	        if (shouldEnable(logger)) {
	            enabledNamespaces.push(logger.namespace);
	        }
	    }
	    debugObj.enable(enabledNamespaces.join(","));
	}
	/**
	 * Retrieves the currently specified log level.
	 */
	function getLogLevel() {
	    return azureLogLevel;
	}
	const levelMap = {
	    verbose: 400,
	    info: 300,
	    warning: 200,
	    error: 100
	};
	/**
	 * Creates a logger for use by the Azure SDKs that inherits from `AzureLogger`.
	 * @param namespace - The name of the SDK package.
	 * @hidden
	 */
	function createClientLogger(namespace) {
	    const clientRootLogger = AzureLogger.extend(namespace);
	    patchLogMethod(AzureLogger, clientRootLogger);
	    return {
	        error: createLogger(clientRootLogger, "error"),
	        warning: createLogger(clientRootLogger, "warning"),
	        info: createLogger(clientRootLogger, "info"),
	        verbose: createLogger(clientRootLogger, "verbose")
	    };
	}
	function patchLogMethod(parent, child) {
	    child.log = (...args) => {
	        parent.log(...args);
	    };
	}
	function createLogger(parent, level) {
	    const logger = Object.assign(parent.extend(level), {
	        level
	    });
	    patchLogMethod(parent, logger);
	    if (shouldEnable(logger)) {
	        const enabledNamespaces = debugObj.disable();
	        debugObj.enable(enabledNamespaces + "," + logger.namespace);
	    }
	    registeredLoggers.add(logger);
	    return logger;
	}
	function shouldEnable(logger) {
	    if (azureLogLevel && levelMap[logger.level] <= levelMap[azureLogLevel]) {
	        return true;
	    }
	    else {
	        return false;
	    }
	}
	function isAzureLogLevel(logLevel) {
	    return AZURE_LOG_LEVELS.includes(logLevel);
	}

	// Copyright (c) Microsoft Corporation.
	const logger$1 = createClientLogger("core-rest-pipeline");

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * A constant that indicates whether the environment the code is running is Node.JS.
	 */
	const isNode$1 = false;

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/// <reference path="../shims-public.d.ts" />
	const listenersMap = new WeakMap();
	const abortedMap = new WeakMap();
	/**
	 * An aborter instance implements AbortSignal interface, can abort HTTP requests.
	 *
	 * - Call AbortSignal.none to create a new AbortSignal instance that cannot be cancelled.
	 * Use `AbortSignal.none` when you are required to pass a cancellation token but the operation
	 * cannot or will not ever be cancelled.
	 *
	 * @example
	 * Abort without timeout
	 * ```ts
	 * await doAsyncWork(AbortSignal.none);
	 * ```
	 */
	class AbortSignal {
	    constructor() {
	        /**
	         * onabort event listener.
	         */
	        this.onabort = null;
	        listenersMap.set(this, []);
	        abortedMap.set(this, false);
	    }
	    /**
	     * Status of whether aborted or not.
	     *
	     * @readonly
	     */
	    get aborted() {
	        if (!abortedMap.has(this)) {
	            throw new TypeError("Expected `this` to be an instance of AbortSignal.");
	        }
	        return abortedMap.get(this);
	    }
	    /**
	     * Creates a new AbortSignal instance that will never be aborted.
	     *
	     * @readonly
	     */
	    static get none() {
	        return new AbortSignal();
	    }
	    /**
	     * Added new "abort" event listener, only support "abort" event.
	     *
	     * @param _type - Only support "abort" event
	     * @param listener - The listener to be added
	     */
	    addEventListener(
	    // tslint:disable-next-line:variable-name
	    _type, listener) {
	        if (!listenersMap.has(this)) {
	            throw new TypeError("Expected `this` to be an instance of AbortSignal.");
	        }
	        const listeners = listenersMap.get(this);
	        listeners.push(listener);
	    }
	    /**
	     * Remove "abort" event listener, only support "abort" event.
	     *
	     * @param _type - Only support "abort" event
	     * @param listener - The listener to be removed
	     */
	    removeEventListener(
	    // tslint:disable-next-line:variable-name
	    _type, listener) {
	        if (!listenersMap.has(this)) {
	            throw new TypeError("Expected `this` to be an instance of AbortSignal.");
	        }
	        const listeners = listenersMap.get(this);
	        const index = listeners.indexOf(listener);
	        if (index > -1) {
	            listeners.splice(index, 1);
	        }
	    }
	    /**
	     * Dispatches a synthetic event to the AbortSignal.
	     */
	    dispatchEvent(_event) {
	        throw new Error("This is a stub dispatchEvent implementation that should not be used.  It only exists for type-checking purposes.");
	    }
	}
	/**
	 * Helper to trigger an abort event immediately, the onabort and all abort event listeners will be triggered.
	 * Will try to trigger abort event for all linked AbortSignal nodes.
	 *
	 * - If there is a timeout, the timer will be cancelled.
	 * - If aborted is true, nothing will happen.
	 *
	 * @internal
	 */
	// eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
	function abortSignal(signal) {
	    if (signal.aborted) {
	        return;
	    }
	    if (signal.onabort) {
	        signal.onabort.call(signal);
	    }
	    const listeners = listenersMap.get(signal);
	    if (listeners) {
	        // Create a copy of listeners so mutations to the array
	        // (e.g. via removeListener calls) don't affect the listeners
	        // we invoke.
	        listeners.slice().forEach((listener) => {
	            listener.call(signal, { type: "abort" });
	        });
	    }
	    abortedMap.set(signal, true);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * This error is thrown when an asynchronous operation has been aborted.
	 * Check for this error by testing the `name` that the name property of the
	 * error matches `"AbortError"`.
	 *
	 * @example
	 * ```ts
	 * const controller = new AbortController();
	 * controller.abort();
	 * try {
	 *   doAsyncWork(controller.signal)
	 * } catch (e) {
	 *   if (e.name === 'AbortError') {
	 *     // handle abort error here.
	 *   }
	 * }
	 * ```
	 */
	class AbortError extends Error {
	    constructor(message) {
	        super(message);
	        this.name = "AbortError";
	    }
	}
	/**
	 * An AbortController provides an AbortSignal and the associated controls to signal
	 * that an asynchronous operation should be aborted.
	 *
	 * @example
	 * Abort an operation when another event fires
	 * ```ts
	 * const controller = new AbortController();
	 * const signal = controller.signal;
	 * doAsyncWork(signal);
	 * button.addEventListener('click', () => controller.abort());
	 * ```
	 *
	 * @example
	 * Share aborter cross multiple operations in 30s
	 * ```ts
	 * // Upload the same data to 2 different data centers at the same time,
	 * // abort another when any of them is finished
	 * const controller = AbortController.withTimeout(30 * 1000);
	 * doAsyncWork(controller.signal).then(controller.abort);
	 * doAsyncWork(controller.signal).then(controller.abort);
	 *```
	 *
	 * @example
	 * Cascaded aborting
	 * ```ts
	 * // All operations can't take more than 30 seconds
	 * const aborter = Aborter.timeout(30 * 1000);
	 *
	 * // Following 2 operations can't take more than 25 seconds
	 * await doAsyncWork(aborter.withTimeout(25 * 1000));
	 * await doAsyncWork(aborter.withTimeout(25 * 1000));
	 * ```
	 */
	class AbortController$1 {
	    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	    constructor(parentSignals) {
	        this._signal = new AbortSignal();
	        if (!parentSignals) {
	            return;
	        }
	        // coerce parentSignals into an array
	        if (!Array.isArray(parentSignals)) {
	            // eslint-disable-next-line prefer-rest-params
	            parentSignals = arguments;
	        }
	        for (const parentSignal of parentSignals) {
	            // if the parent signal has already had abort() called,
	            // then call abort on this signal as well.
	            if (parentSignal.aborted) {
	                this.abort();
	            }
	            else {
	                // when the parent signal aborts, this signal should as well.
	                parentSignal.addEventListener("abort", () => {
	                    this.abort();
	                });
	            }
	        }
	    }
	    /**
	     * The AbortSignal associated with this controller that will signal aborted
	     * when the abort method is called on this controller.
	     *
	     * @readonly
	     */
	    get signal() {
	        return this._signal;
	    }
	    /**
	     * Signal that any operations passed this controller's associated abort signal
	     * to cancel any remaining work and throw an `AbortError`.
	     */
	    abort() {
	        abortSignal(this._signal);
	    }
	    /**
	     * Creates a new AbortSignal instance that will abort after the provided ms.
	     * @param ms - Elapsed time in milliseconds to trigger an abort.
	     */
	    static timeout(ms) {
	        const signal = new AbortSignal();
	        const timer = setTimeout(abortSignal, ms, signal);
	        // Prevent the active Timer from keeping the Node.js event loop active.
	        if (typeof timer.unref === "function") {
	            timer.unref();
	        }
	        return signal;
	    }
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Helper TypeGuard that checks if something is defined or not.
	 * @param thing - Anything
	 */
	function isDefined$1(thing) {
	    return typeof thing !== "undefined" && thing !== null;
	}
	/**
	 * Helper TypeGuard that checks if the input is an object with the specified properties.
	 * @param thing - Anything.
	 * @param properties - The name of the properties that should appear in the object.
	 */
	function isObjectWithProperties$1(thing, properties) {
	    if (!isDefined$1(thing) || typeof thing !== "object") {
	        return false;
	    }
	    for (const property of properties) {
	        if (!objectHasProperty$1(thing, property)) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Helper TypeGuard that checks if the input is an object with the specified property.
	 * @param thing - Any object.
	 * @param property - The name of the property that should appear in the object.
	 */
	function objectHasProperty$1(thing, property) {
	    return (isDefined$1(thing) && typeof thing === "object" && property in thing);
	}

	// Copyright (c) Microsoft Corporation.
	const StandardAbortMessage$3 = "The operation was aborted.";
	/**
	 * A wrapper for setTimeout that resolves a promise after timeInMs milliseconds.
	 * @param timeInMs - The number of milliseconds to be delayed.
	 * @param options - The options for delay - currently abort options
	 * @returns Promise that is resolved after timeInMs
	 */
	function delay$3(timeInMs, options) {
	    return new Promise((resolve, reject) => {
	        let timer = undefined;
	        let onAborted = undefined;
	        const rejectOnAbort = () => {
	            var _a;
	            return reject(new AbortError((_a = options === null || options === void 0 ? void 0 : options.abortErrorMsg) !== null && _a !== void 0 ? _a : StandardAbortMessage$3));
	        };
	        const removeListeners = () => {
	            if ((options === null || options === void 0 ? void 0 : options.abortSignal) && onAborted) {
	                options.abortSignal.removeEventListener("abort", onAborted);
	            }
	        };
	        onAborted = () => {
	            if (isDefined$1(timer)) {
	                clearTimeout(timer);
	            }
	            removeListeners();
	            return rejectOnAbort();
	        };
	        if ((options === null || options === void 0 ? void 0 : options.abortSignal) && options.abortSignal.aborted) {
	            return rejectOnAbort();
	        }
	        timer = setTimeout(() => {
	            removeListeners();
	            resolve();
	        }, timeInMs);
	        if (options === null || options === void 0 ? void 0 : options.abortSignal) {
	            options.abortSignal.addEventListener("abort", onAborted);
	        }
	    });
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Returns a random integer value between a lower and upper bound,
	 * inclusive of both bounds.
	 * Note that this uses Math.random and isn't secure. If you need to use
	 * this for any kind of security purpose, find a better source of random.
	 * @param min - The smallest integer value allowed.
	 * @param max - The largest integer value allowed.
	 */
	function getRandomIntegerInclusive(min, max) {
	    // Make sure inputs are integers.
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    // Pick a random offset from zero to the size of the range.
	    // Since Math.random() can never return 1, we have to make the range one larger
	    // in order to be inclusive of the maximum value after we take the floor.
	    const offset = Math.floor(Math.random() * (max - min + 1));
	    return offset + min;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Helper to determine when an input is a generic JS object.
	 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
	 */
	function isObject$1(input) {
	    return (typeof input === "object" &&
	        input !== null &&
	        !Array.isArray(input) &&
	        !(input instanceof RegExp) &&
	        !(input instanceof Date));
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Typeguard for an error object shape (has name and message)
	 * @param e - Something caught by a catch clause.
	 */
	function isError(e) {
	    if (isObject$1(e)) {
	        const hasName = typeof e.name === "string";
	        const hasMessage = typeof e.message === "string";
	        return hasName && hasMessage;
	    }
	    return false;
	}
	/**
	 * Given what is thought to be an error object, return the message if possible.
	 * If the message is missing, returns a stringified version of the input.
	 * @param e - Something thrown from a try block
	 * @returns The error message or a string of the input
	 */
	function getErrorMessage(e) {
	    if (isError(e)) {
	        return e.message;
	    }
	    else {
	        let stringified;
	        try {
	            if (typeof e === "object" && e) {
	                stringified = JSON.stringify(e);
	            }
	            else {
	                stringified = String(e);
	            }
	        }
	        catch (err) {
	            stringified = "[unable to stringify input]";
	        }
	        return `Unknown error ${stringified}`;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Converts a base64 string into a byte array.
	 * @param content - The base64 string to convert.
	 * @internal
	 */
	function base64ToBytes(content) {
	    if (typeof atob !== "function") {
	        throw new Error(`Your browser environment is missing the global "atob" function.`);
	    }
	    const binary = atob(content);
	    const bytes = new Uint8Array(binary.length);
	    for (let i = 0; i < binary.length; i++) {
	        bytes[i] = binary.charCodeAt(i);
	    }
	    return bytes;
	}
	/**
	 * Converts an ArrayBuffer to base64 string.
	 * @param buffer - Raw binary data.
	 * @internal
	 */
	function bufferToBase64(buffer) {
	    if (typeof btoa !== "function") {
	        throw new Error(`Your browser environment is missing the global "btoa" function.`);
	    }
	    const bytes = new Uint8Array(buffer);
	    let binary = "";
	    for (const byte of bytes) {
	        binary += String.fromCharCode(byte);
	    }
	    return btoa(binary);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Converts an ArrayBuffer to a hexadecimal string.
	 * @param buffer - Raw binary data.
	 * @internal
	 */
	function bufferToHex(buffer) {
	    const bytes = new Uint8Array(buffer);
	    return Array.prototype.map.call(bytes, byteToHex$1).join("");
	}
	/**
	 * Converts a byte to a hexadecimal string.
	 * @param byte - An integer representation of a byte.
	 * @internal
	 */
	function byteToHex$1(byte) {
	    const hex = byte.toString(16);
	    return hex.length === 2 ? hex : `0${hex}`;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	let encoder;
	/**
	 * Returns a cached TextEncoder.
	 * @internal
	 */
	function getTextEncoder() {
	    if (encoder) {
	        return encoder;
	    }
	    if (typeof TextEncoder === "undefined") {
	        throw new Error(`Your browser environment is missing "TextEncoder".`);
	    }
	    encoder = new TextEncoder();
	    return encoder;
	}
	/**
	 * Converts a utf8 string into a byte array.
	 * @param content - The utf8 string to convert.
	 * @internal
	 */
	function utf8ToBytes(content) {
	    return getTextEncoder().encode(content);
	}

	// Copyright (c) Microsoft Corporation.
	let subtleCrypto;
	/**
	 * Returns a cached reference to the Web API crypto.subtle object.
	 * @internal
	 */
	function getCrypto() {
	    if (subtleCrypto) {
	        return subtleCrypto;
	    }
	    if (!self.crypto || !self.crypto.subtle) {
	        throw new Error("Your browser environment does not support cryptography functions.");
	    }
	    subtleCrypto = self.crypto.subtle;
	    return subtleCrypto;
	}
	/**
	 * Generates a SHA-256 HMAC signature.
	 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
	 * @param stringToSign - The data to be signed.
	 * @param encoding - The textual encoding to use for the returned HMAC digest.
	 */
	async function computeSha256Hmac(key, stringToSign, encoding) {
	    const crypto = getCrypto();
	    const keyBytes = base64ToBytes(key);
	    const stringToSignBytes = utf8ToBytes(stringToSign);
	    const cryptoKey = await crypto.importKey("raw", keyBytes, {
	        name: "HMAC",
	        hash: { name: "SHA-256" },
	    }, false, ["sign"]);
	    const signature = await crypto.sign({
	        name: "HMAC",
	        hash: { name: "SHA-256" },
	    }, cryptoKey, stringToSignBytes);
	    switch (encoding) {
	        case "base64":
	            return bufferToBase64(signature);
	        case "hex":
	            return bufferToHex(signature);
	    }
	}
	/**
	 * Generates a SHA-256 hash.
	 * @param content - The data to be included in the hash.
	 * @param encoding - The textual encoding to use for the returned hash.
	 */
	async function computeSha256Hash(content, encoding) {
	    const contentBytes = utf8ToBytes(content);
	    const digest = await getCrypto().digest({ name: "SHA-256" }, contentBytes);
	    switch (encoding) {
	        case "base64":
	            return bufferToBase64(digest);
	        case "hex":
	            return bufferToHex(digest);
	    }
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	const RedactedString$1 = "REDACTED";
	// Make sure this list is up-to-date with the one under core/logger/Readme#Keyconcepts
	const defaultAllowedHeaderNames$1 = [
	    "x-ms-client-request-id",
	    "x-ms-return-client-request-id",
	    "x-ms-useragent",
	    "x-ms-correlation-request-id",
	    "x-ms-request-id",
	    "client-request-id",
	    "ms-cv",
	    "return-client-request-id",
	    "traceparent",
	    "Access-Control-Allow-Credentials",
	    "Access-Control-Allow-Headers",
	    "Access-Control-Allow-Methods",
	    "Access-Control-Allow-Origin",
	    "Access-Control-Expose-Headers",
	    "Access-Control-Max-Age",
	    "Access-Control-Request-Headers",
	    "Access-Control-Request-Method",
	    "Origin",
	    "Accept",
	    "Accept-Encoding",
	    "Cache-Control",
	    "Connection",
	    "Content-Length",
	    "Content-Type",
	    "Date",
	    "ETag",
	    "Expires",
	    "If-Match",
	    "If-Modified-Since",
	    "If-None-Match",
	    "If-Unmodified-Since",
	    "Last-Modified",
	    "Pragma",
	    "Request-Id",
	    "Retry-After",
	    "Server",
	    "Transfer-Encoding",
	    "User-Agent",
	    "WWW-Authenticate",
	];
	const defaultAllowedQueryParameters$1 = ["api-version"];
	/**
	 * @internal
	 */
	class Sanitizer$1 {
	    constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [], } = {}) {
	        allowedHeaderNames = defaultAllowedHeaderNames$1.concat(allowedHeaderNames);
	        allowedQueryParameters = defaultAllowedQueryParameters$1.concat(allowedQueryParameters);
	        this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
	        this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
	    }
	    sanitize(obj) {
	        const seen = new Set();
	        return JSON.stringify(obj, (key, value) => {
	            // Ensure Errors include their interesting non-enumerable members
	            if (value instanceof Error) {
	                return Object.assign(Object.assign({}, value), { name: value.name, message: value.message });
	            }
	            if (key === "headers") {
	                return this.sanitizeHeaders(value);
	            }
	            else if (key === "url") {
	                return this.sanitizeUrl(value);
	            }
	            else if (key === "query") {
	                return this.sanitizeQuery(value);
	            }
	            else if (key === "body") {
	                // Don't log the request body
	                return undefined;
	            }
	            else if (key === "response") {
	                // Don't log response again
	                return undefined;
	            }
	            else if (key === "operationSpec") {
	                // When using sendOperationRequest, the request carries a massive
	                // field with the autorest spec. No need to log it.
	                return undefined;
	            }
	            else if (Array.isArray(value) || isObject$1(value)) {
	                if (seen.has(value)) {
	                    return "[Circular]";
	                }
	                seen.add(value);
	            }
	            return value;
	        }, 2);
	    }
	    sanitizeHeaders(obj) {
	        const sanitized = {};
	        for (const key of Object.keys(obj)) {
	            if (this.allowedHeaderNames.has(key.toLowerCase())) {
	                sanitized[key] = obj[key];
	            }
	            else {
	                sanitized[key] = RedactedString$1;
	            }
	        }
	        return sanitized;
	    }
	    sanitizeQuery(value) {
	        if (typeof value !== "object" || value === null) {
	            return value;
	        }
	        const sanitized = {};
	        for (const k of Object.keys(value)) {
	            if (this.allowedQueryParameters.has(k.toLowerCase())) {
	                sanitized[k] = value[k];
	            }
	            else {
	                sanitized[k] = RedactedString$1;
	            }
	        }
	        return sanitized;
	    }
	    sanitizeUrl(value) {
	        if (typeof value !== "string" || value === null) {
	            return value;
	        }
	        const url = new URL(value);
	        if (!url.search) {
	            return value;
	        }
	        for (const [key] of url.searchParams) {
	            if (!this.allowedQueryParameters.has(key.toLowerCase())) {
	                url.searchParams.set(key, RedactedString$1);
	            }
	        }
	        return url.toString();
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the logPolicy.
	 */
	const logPolicyName = "logPolicy";
	/**
	 * A policy that logs all requests and responses.
	 * @param options - Options to configure logPolicy.
	 */
	function logPolicy$1(options = {}) {
	    var _a;
	    const logger = (_a = options.logger) !== null && _a !== void 0 ? _a : logger$1.info;
	    const sanitizer = new Sanitizer$1({
	        additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
	        additionalAllowedQueryParameters: options.additionalAllowedQueryParameters,
	    });
	    return {
	        name: logPolicyName,
	        async sendRequest(request, next) {
	            if (!logger.enabled) {
	                return next(request);
	            }
	            logger(`Request: ${sanitizer.sanitize(request)}`);
	            const response = await next(request);
	            logger(`Response status code: ${response.status}`);
	            logger(`Headers: ${sanitizer.sanitize(response.headers)}`);
	            return response;
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the redirectPolicy.
	 */
	const redirectPolicyName = "redirectPolicy";
	/**
	 * Methods that are allowed to follow redirects 301 and 302
	 */
	const allowedRedirect$1 = ["GET", "HEAD"];
	/**
	 * A policy to follow Location headers from the server in order
	 * to support server-side redirection.
	 * In the browser, this policy is not used.
	 * @param options - Options to control policy behavior.
	 */
	function redirectPolicy$1(options = {}) {
	    const { maxRetries = 20 } = options;
	    return {
	        name: redirectPolicyName,
	        async sendRequest(request, next) {
	            const response = await next(request);
	            return handleRedirect$1(next, response, maxRetries);
	        },
	    };
	}
	async function handleRedirect$1(next, response, maxRetries, currentRetries = 0) {
	    const { request, status, headers } = response;
	    const locationHeader = headers.get("location");
	    if (locationHeader &&
	        (status === 300 ||
	            (status === 301 && allowedRedirect$1.includes(request.method)) ||
	            (status === 302 && allowedRedirect$1.includes(request.method)) ||
	            (status === 303 && request.method === "POST") ||
	            status === 307) &&
	        currentRetries < maxRetries) {
	        const url = new URL(locationHeader, request.url);
	        request.url = url.toString();
	        // POST request with Status code 303 should be converted into a
	        // redirected GET request if the redirect url is present in the location header
	        if (status === 303) {
	            request.method = "GET";
	            request.headers.delete("Content-Length");
	            delete request.body;
	        }
	        request.headers.delete("Authorization");
	        const res = await next(request);
	        return handleRedirect$1(next, res, maxRetries, currentRetries + 1);
	    }
	    return response;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "browser" section in package.json.
	 */
	/**
	 * @internal
	 */
	function getHeaderName() {
	    return "x-ms-useragent";
	}
	/**
	 * @internal
	 */
	function setPlatformSpecificData(map) {
	    const navigator = self.navigator;
	    map.set("OS", (navigator.oscpu || navigator.platform).replace(" ", ""));
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const SDK_VERSION = "1.10.0";
	const DEFAULT_RETRY_POLICY_COUNT = 3;

	// Copyright (c) Microsoft Corporation.
	function getUserAgentString$1(telemetryInfo) {
	    const parts = [];
	    for (const [key, value] of telemetryInfo) {
	        const token = value ? `${key}/${value}` : key;
	        parts.push(token);
	    }
	    return parts.join(" ");
	}
	/**
	 * @internal
	 */
	function getUserAgentHeaderName() {
	    return getHeaderName();
	}
	/**
	 * @internal
	 */
	function getUserAgentValue(prefix) {
	    const runtimeInfo = new Map();
	    runtimeInfo.set("core-rest-pipeline", SDK_VERSION);
	    setPlatformSpecificData(runtimeInfo);
	    const defaultAgent = getUserAgentString$1(runtimeInfo);
	    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
	    return userAgentValue;
	}

	// Copyright (c) Microsoft Corporation.
	const UserAgentHeaderName = getUserAgentHeaderName();
	/**
	 * The programmatic identifier of the userAgentPolicy.
	 */
	const userAgentPolicyName = "userAgentPolicy";
	/**
	 * A policy that sets the User-Agent header (or equivalent) to reflect
	 * the library version.
	 * @param options - Options to customize the user agent value.
	 */
	function userAgentPolicy$1(options = {}) {
	    const userAgentValue = getUserAgentValue(options.userAgentPrefix);
	    return {
	        name: userAgentPolicyName,
	        async sendRequest(request, next) {
	            if (!request.headers.has(UserAgentHeaderName)) {
	                request.headers.set(UserAgentHeaderName, userAgentValue);
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "browser" section in package.json
	 */
	const NotSupported$1 = new Error("decompressResponsePolicy is not supported in browser environment");
	const decompressResponsePolicyName = "decompressResponsePolicy";
	/**
	 * decompressResponsePolicy is not supported in the browser and attempting
	 * to use it will raise an error.
	 */
	function decompressResponsePolicy() {
	    throw NotSupported$1;
	}

	// Copyright (c) Microsoft Corporation.
	const StandardAbortMessage$2 = "The operation was aborted.";
	/**
	 * A wrapper for setTimeout that resolves a promise after delayInMs milliseconds.
	 * @param delayInMs - The number of milliseconds to be delayed.
	 * @param value - The value to be resolved with after a timeout of t milliseconds.
	 * @param options - The options for delay - currently abort options
	 *                  - abortSignal - The abortSignal associated with containing operation.
	 *                  - abortErrorMsg - The abort error message associated with containing operation.
	 * @returns Resolved promise
	 */
	function delay$2(delayInMs, value, options) {
	    return new Promise((resolve, reject) => {
	        let timer = undefined;
	        let onAborted = undefined;
	        const rejectOnAbort = () => {
	            return reject(new AbortError((options === null || options === void 0 ? void 0 : options.abortErrorMsg) ? options === null || options === void 0 ? void 0 : options.abortErrorMsg : StandardAbortMessage$2));
	        };
	        const removeListeners = () => {
	            if ((options === null || options === void 0 ? void 0 : options.abortSignal) && onAborted) {
	                options.abortSignal.removeEventListener("abort", onAborted);
	            }
	        };
	        onAborted = () => {
	            if (timer) {
	                clearTimeout(timer);
	            }
	            removeListeners();
	            return rejectOnAbort();
	        };
	        if ((options === null || options === void 0 ? void 0 : options.abortSignal) && options.abortSignal.aborted) {
	            return rejectOnAbort();
	        }
	        timer = setTimeout(() => {
	            removeListeners();
	            resolve(value);
	        }, delayInMs);
	        if (options === null || options === void 0 ? void 0 : options.abortSignal) {
	            options.abortSignal.addEventListener("abort", onAborted);
	        }
	    });
	}
	/**
	 * @internal
	 * @returns the parsed value or undefined if the parsed value is invalid.
	 */
	function parseHeaderValueAsNumber(response, headerName) {
	    const value = response.headers.get(headerName);
	    if (!value)
	        return;
	    const valueAsNum = Number(value);
	    if (Number.isNaN(valueAsNum))
	        return;
	    return valueAsNum;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The header that comes back from Azure services representing
	 * the amount of time (minimum) to wait to retry (in seconds or timestamp after which we can retry).
	 */
	const RetryAfterHeader = "Retry-After";
	/**
	 * The headers that come back from Azure services representing
	 * the amount of time (minimum) to wait to retry.
	 *
	 * "retry-after-ms", "x-ms-retry-after-ms" : milliseconds
	 * "Retry-After" : seconds or timestamp
	 */
	const AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
	/**
	 * A response is a throttling retry response if it has a throttling status code (429 or 503),
	 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
	 *
	 * Returns the `retryAfterInMs` value if the response is a throttling retry response.
	 * If not throttling retry response, returns `undefined`.
	 *
	 * @internal
	 */
	function getRetryAfterInMs(response) {
	    if (!(response && [429, 503].includes(response.status)))
	        return undefined;
	    try {
	        // Headers: "retry-after-ms", "x-ms-retry-after-ms", "Retry-After"
	        for (const header of AllRetryAfterHeaders) {
	            const retryAfterValue = parseHeaderValueAsNumber(response, header);
	            if (retryAfterValue === 0 || retryAfterValue) {
	                // "Retry-After" header ==> seconds
	                // "retry-after-ms", "x-ms-retry-after-ms" headers ==> milli-seconds
	                const multiplyingFactor = header === RetryAfterHeader ? 1000 : 1;
	                return retryAfterValue * multiplyingFactor; // in milli-seconds
	            }
	        }
	        // RetryAfterHeader ("Retry-After") has a special case where it might be formatted as a date instead of a number of seconds
	        const retryAfterHeader = response.headers.get(RetryAfterHeader);
	        if (!retryAfterHeader)
	            return;
	        const date = Date.parse(retryAfterHeader);
	        const diff = date - Date.now();
	        // negative diff would mean a date in the past, so retry asap with 0 milliseconds
	        return Number.isFinite(diff) ? Math.max(0, diff) : undefined;
	    }
	    catch (e) {
	        return undefined;
	    }
	}
	/**
	 * A response is a retry response if it has a throttling status code (429 or 503),
	 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
	 */
	function isThrottlingRetryResponse(response) {
	    return Number.isFinite(getRetryAfterInMs(response));
	}
	function throttlingRetryStrategy() {
	    return {
	        name: "throttlingRetryStrategy",
	        retry({ response }) {
	            const retryAfterInMs = getRetryAfterInMs(response);
	            if (!Number.isFinite(retryAfterInMs)) {
	                return { skipStrategy: true };
	            }
	            return {
	                retryAfterInMs,
	            };
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// intervals are in milliseconds
	const DEFAULT_CLIENT_RETRY_INTERVAL$1 = 1000;
	const DEFAULT_CLIENT_MAX_RETRY_INTERVAL$1 = 1000 * 64;
	/**
	 * A retry strategy that retries with an exponentially increasing delay in these two cases:
	 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
	 * - Or otherwise if the outgoing request fails (408, greater or equal than 500, except for 501 and 505).
	 */
	function exponentialRetryStrategy(options = {}) {
	    var _a, _b;
	    const retryInterval = (_a = options.retryDelayInMs) !== null && _a !== void 0 ? _a : DEFAULT_CLIENT_RETRY_INTERVAL$1;
	    const maxRetryInterval = (_b = options.maxRetryDelayInMs) !== null && _b !== void 0 ? _b : DEFAULT_CLIENT_MAX_RETRY_INTERVAL$1;
	    let retryAfterInMs = retryInterval;
	    return {
	        name: "exponentialRetryStrategy",
	        retry({ retryCount, response, responseError }) {
	            const matchedSystemError = isSystemError(responseError);
	            const ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors;
	            const isExponential = isExponentialRetryResponse(response);
	            const ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
	            const unknownResponse = response && (isThrottlingRetryResponse(response) || !isExponential);
	            if (unknownResponse || ignoreExponentialResponse || ignoreSystemErrors) {
	                return { skipStrategy: true };
	            }
	            if (responseError && !matchedSystemError && !isExponential) {
	                return { errorToThrow: responseError };
	            }
	            // Exponentially increase the delay each time
	            const exponentialDelay = retryAfterInMs * Math.pow(2, retryCount);
	            // Don't let the delay exceed the maximum
	            const clampedExponentialDelay = Math.min(maxRetryInterval, exponentialDelay);
	            // Allow the final value to have some "jitter" (within 50% of the delay size) so
	            // that retries across multiple clients don't occur simultaneously.
	            retryAfterInMs =
	                clampedExponentialDelay / 2 + getRandomIntegerInclusive(0, clampedExponentialDelay / 2);
	            return { retryAfterInMs };
	        },
	    };
	}
	/**
	 * A response is a retry response if it has status codes:
	 * - 408, or
	 * - Greater or equal than 500, except for 501 and 505.
	 */
	function isExponentialRetryResponse(response) {
	    return Boolean(response &&
	        response.status !== undefined &&
	        (response.status >= 500 || response.status === 408) &&
	        response.status !== 501 &&
	        response.status !== 505);
	}
	/**
	 * Determines whether an error from a pipeline response was triggered in the network layer.
	 */
	function isSystemError(err) {
	    if (!err) {
	        return false;
	    }
	    return (err.code === "ETIMEDOUT" ||
	        err.code === "ESOCKETTIMEDOUT" ||
	        err.code === "ECONNREFUSED" ||
	        err.code === "ECONNRESET" ||
	        err.code === "ENOENT");
	}

	// Copyright (c) Microsoft Corporation.
	const retryPolicyLogger = createClientLogger("core-rest-pipeline retryPolicy");
	/**
	 * The programmatic identifier of the retryPolicy.
	 */
	const retryPolicyName = "retryPolicy";
	/**
	 * retryPolicy is a generic policy to enable retrying requests when certain conditions are met
	 */
	function retryPolicy(strategies, options = { maxRetries: DEFAULT_RETRY_POLICY_COUNT }) {
	    const logger = options.logger || retryPolicyLogger;
	    return {
	        name: retryPolicyName,
	        async sendRequest(request, next) {
	            var _a, _b;
	            let response;
	            let responseError;
	            let retryCount = -1;
	            // eslint-disable-next-line no-constant-condition
	            retryRequest: while (true) {
	                retryCount += 1;
	                response = undefined;
	                responseError = undefined;
	                try {
	                    logger.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
	                    response = await next(request);
	                    logger.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
	                }
	                catch (e) {
	                    logger.error(`Retry ${retryCount}: Received an error from request`, request.requestId);
	                    // RestErrors are valid targets for the retry strategies.
	                    // If none of the retry strategies can work with them, they will be thrown later in this policy.
	                    // If the received error is not a RestError, it is immediately thrown.
	                    responseError = e;
	                    if (!e || responseError.name !== "RestError") {
	                        throw e;
	                    }
	                    response = responseError.response;
	                }
	                if ((_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) {
	                    logger.error(`Retry ${retryCount}: Request aborted.`);
	                    const abortError = new AbortError();
	                    throw abortError;
	                }
	                if (retryCount >= ((_b = options.maxRetries) !== null && _b !== void 0 ? _b : DEFAULT_RETRY_POLICY_COUNT)) {
	                    logger.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
	                    if (responseError) {
	                        throw responseError;
	                    }
	                    else if (response) {
	                        return response;
	                    }
	                    else {
	                        throw new Error("Maximum retries reached with no response or error to throw");
	                    }
	                }
	                logger.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
	                strategiesLoop: for (const strategy of strategies) {
	                    const strategyLogger = strategy.logger || retryPolicyLogger;
	                    strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
	                    const modifiers = strategy.retry({
	                        retryCount,
	                        response,
	                        responseError,
	                    });
	                    if (modifiers.skipStrategy) {
	                        strategyLogger.info(`Retry ${retryCount}: Skipped.`);
	                        continue strategiesLoop;
	                    }
	                    const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
	                    if (errorToThrow) {
	                        strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow);
	                        throw errorToThrow;
	                    }
	                    if (retryAfterInMs || retryAfterInMs === 0) {
	                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`);
	                        await delay$2(retryAfterInMs, undefined, { abortSignal: request.abortSignal });
	                        continue retryRequest;
	                    }
	                    if (redirectTo) {
	                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`);
	                        request.url = redirectTo;
	                        continue retryRequest;
	                    }
	                }
	                if (responseError) {
	                    logger.info(`None of the retry strategies could work with the received error. Throwing it.`);
	                    throw responseError;
	                }
	                if (response) {
	                    logger.info(`None of the retry strategies could work with the received response. Returning it.`);
	                    return response;
	                }
	                // If all the retries skip and there's no response,
	                // we're still in the retry loop, so a new request will be sent
	                // until `maxRetries` is reached.
	            }
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Name of the {@link defaultRetryPolicy}
	 */
	const defaultRetryPolicyName = "defaultRetryPolicy";
	/**
	 * A policy that retries according to three strategies:
	 * - When the server sends a 429 response with a Retry-After header.
	 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
	 * - Or otherwise if the outgoing request fails, it will retry with an exponentially increasing delay.
	 */
	function defaultRetryPolicy(options = {}) {
	    var _a;
	    return {
	        name: defaultRetryPolicyName,
	        sendRequest: retryPolicy([throttlingRetryStrategy(), exponentialRetryStrategy(options)], {
	            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	        }).sendRequest,
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the formDataPolicy.
	 */
	const formDataPolicyName = "formDataPolicy";
	/**
	 * A policy that encodes FormData on the request into the body.
	 */
	function formDataPolicy() {
	    return {
	        name: formDataPolicyName,
	        async sendRequest(request, next) {
	            if (request.formData) {
	                const formData = request.formData;
	                const requestForm = new FormData();
	                for (const formKey of Object.keys(formData)) {
	                    const formValue = formData[formKey];
	                    if (Array.isArray(formValue)) {
	                        for (const subValue of formValue) {
	                            requestForm.append(formKey, subValue);
	                        }
	                    }
	                    else {
	                        requestForm.append(formKey, formValue);
	                    }
	                }
	                request.body = requestForm;
	                request.formData = undefined;
	                const contentType = request.headers.get("Content-Type");
	                if (contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
	                    request.body = new URLSearchParams(requestForm).toString();
	                }
	                else if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
	                    // browser will automatically apply a suitable content-type header
	                    request.headers.delete("Content-Type");
	                }
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "browser" section in package.json
	 */
	const NotSupported = new Error("proxyPolicy is not supported in browser environment");
	const proxyPolicyName = "proxyPolicy";
	function getDefaultProxySettings$1() {
	    throw NotSupported;
	}
	/**
	 * proxyPolicy is not supported in the browser and attempting
	 * to use it will raise an error.
	 */
	function proxyPolicy$1() {
	    throw NotSupported;
	}
	/**
	 * A function to reset the cached agents.
	 * proxyPolicy is not supported in the browser and attempting
	 * to use it will raise an error.
	 * @internal
	 */
	function resetCachedProxyAgents() {
	    throw NotSupported;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the setClientRequestIdPolicy.
	 */
	const setClientRequestIdPolicyName = "setClientRequestIdPolicy";
	/**
	 * Each PipelineRequest gets a unique id upon creation.
	 * This policy passes that unique id along via an HTTP header to enable better
	 * telemetry and tracing.
	 * @param requestIdHeaderName - The name of the header to pass the request ID to.
	 */
	function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
	    return {
	        name: setClientRequestIdPolicyName,
	        async sendRequest(request, next) {
	            if (!request.headers.has(requestIdHeaderName)) {
	                request.headers.set(requestIdHeaderName, request.requestId);
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Name of the TLS Policy
	 */
	const tlsPolicyName = "tlsPolicy";
	/**
	 * Gets a pipeline policy that adds the client certificate to the HttpClient agent for authentication.
	 */
	function tlsPolicy(tlsSettings) {
	    return {
	        name: tlsPolicyName,
	        sendRequest: async (req, next) => {
	            // Users may define a request tlsSettings, honor those over the client level one
	            if (!req.tlsSettings) {
	                req.tlsSettings = tlsSettings;
	            }
	            return next(req);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/** @internal */
	const knownContextKeys = {
	    span: Symbol.for("@azure/core-tracing span"),
	    namespace: Symbol.for("@azure/core-tracing namespace"),
	};
	/**
	 * Creates a new {@link TracingContext} with the given options.
	 * @param options - A set of known keys that may be set on the context.
	 * @returns A new {@link TracingContext} with the given options.
	 *
	 * @internal
	 */
	function createTracingContext(options = {}) {
	    let context = new TracingContextImpl(options.parentContext);
	    if (options.span) {
	        context = context.setValue(knownContextKeys.span, options.span);
	    }
	    if (options.namespace) {
	        context = context.setValue(knownContextKeys.namespace, options.namespace);
	    }
	    return context;
	}
	/** @internal */
	class TracingContextImpl {
	    constructor(initialContext) {
	        this._contextMap =
	            initialContext instanceof TracingContextImpl
	                ? new Map(initialContext._contextMap)
	                : new Map();
	    }
	    setValue(key, value) {
	        const newContext = new TracingContextImpl(this);
	        newContext._contextMap.set(key, value);
	        return newContext;
	    }
	    getValue(key) {
	        return this._contextMap.get(key);
	    }
	    deleteValue(key) {
	        const newContext = new TracingContextImpl(this);
	        newContext._contextMap.delete(key);
	        return newContext;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	function createDefaultTracingSpan() {
	    return {
	        end: () => {
	            // noop
	        },
	        isRecording: () => false,
	        recordException: () => {
	            // noop
	        },
	        setAttribute: () => {
	            // noop
	        },
	        setStatus: () => {
	            // noop
	        },
	    };
	}
	function createDefaultInstrumenter() {
	    return {
	        createRequestHeaders: () => {
	            return {};
	        },
	        parseTraceparentHeader: () => {
	            return undefined;
	        },
	        startSpan: (_name, spanOptions) => {
	            return {
	                span: createDefaultTracingSpan(),
	                tracingContext: createTracingContext({ parentContext: spanOptions.tracingContext }),
	            };
	        },
	        withContext(_context, callback, ...callbackArgs) {
	            return callback(...callbackArgs);
	        },
	    };
	}
	/** @internal */
	let instrumenterImplementation;
	/**
	 * Extends the Azure SDK with support for a given instrumenter implementation.
	 *
	 * @param instrumenter - The instrumenter implementation to use.
	 */
	function useInstrumenter(instrumenter) {
	    instrumenterImplementation = instrumenter;
	}
	/**
	 * Gets the currently set instrumenter, a No-Op instrumenter by default.
	 *
	 * @returns The currently set instrumenter
	 */
	function getInstrumenter() {
	    if (!instrumenterImplementation) {
	        instrumenterImplementation = createDefaultInstrumenter();
	    }
	    return instrumenterImplementation;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Creates a new tracing client.
	 *
	 * @param options - Options used to configure the tracing client.
	 * @returns - An instance of {@link TracingClient}.
	 */
	function createTracingClient(options) {
	    const { namespace, packageName, packageVersion } = options;
	    function startSpan(name, operationOptions, spanOptions) {
	        var _a;
	        const startSpanResult = getInstrumenter().startSpan(name, Object.assign(Object.assign({}, spanOptions), { packageName: packageName, packageVersion: packageVersion, tracingContext: (_a = operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext }));
	        let tracingContext = startSpanResult.tracingContext;
	        const span = startSpanResult.span;
	        if (!tracingContext.getValue(knownContextKeys.namespace)) {
	            tracingContext = tracingContext.setValue(knownContextKeys.namespace, namespace);
	        }
	        span.setAttribute("az.namespace", tracingContext.getValue(knownContextKeys.namespace));
	        const updatedOptions = Object.assign({}, operationOptions, {
	            tracingOptions: Object.assign(Object.assign({}, operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions), { tracingContext }),
	        });
	        return {
	            span,
	            updatedOptions,
	        };
	    }
	    async function withSpan(name, operationOptions, callback, spanOptions) {
	        const { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
	        try {
	            const result = await withContext(updatedOptions.tracingOptions.tracingContext, () => Promise.resolve(callback(updatedOptions, span)));
	            span.setStatus({ status: "success" });
	            return result;
	        }
	        catch (err) {
	            span.setStatus({ status: "error", error: err });
	            throw err;
	        }
	        finally {
	            span.end();
	        }
	    }
	    function withContext(context, callback, ...callbackArgs) {
	        return getInstrumenter().withContext(context, callback, ...callbackArgs);
	    }
	    /**
	     * Parses a traceparent header value into a span identifier.
	     *
	     * @param traceparentHeader - The traceparent header to parse.
	     * @returns An implementation-specific identifier for the span.
	     */
	    function parseTraceparentHeader(traceparentHeader) {
	        return getInstrumenter().parseTraceparentHeader(traceparentHeader);
	    }
	    /**
	     * Creates a set of request headers to propagate tracing information to a backend.
	     *
	     * @param tracingContext - The context containing the span to serialize.
	     * @returns The set of headers to add to a request.
	     */
	    function createRequestHeaders(tracingContext) {
	        return getInstrumenter().createRequestHeaders(tracingContext);
	    }
	    return {
	        startSpan,
	        withSpan,
	        withContext,
	        parseTraceparentHeader,
	        createRequestHeaders,
	    };
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const custom$1 = {};

	// Copyright (c) Microsoft Corporation.
	const errorSanitizer$1 = new Sanitizer$1();
	/**
	 * A custom error type for failed pipeline requests.
	 */
	class RestError$1 extends Error {
	    constructor(message, options = {}) {
	        super(message);
	        this.name = "RestError";
	        this.code = options.code;
	        this.statusCode = options.statusCode;
	        this.request = options.request;
	        this.response = options.response;
	        Object.setPrototypeOf(this, RestError$1.prototype);
	    }
	    /**
	     * Logging method for util.inspect in Node
	     */
	    [custom$1]() {
	        return `RestError: ${this.message} \n ${errorSanitizer$1.sanitize(this)}`;
	    }
	}
	/**
	 * Something went wrong when making the request.
	 * This means the actual request failed for some reason,
	 * such as a DNS issue or the connection being lost.
	 */
	RestError$1.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
	/**
	 * This means that parsing the response from the server failed.
	 * It may have been malformed.
	 */
	RestError$1.PARSE_ERROR = "PARSE_ERROR";
	/**
	 * Typeguard for RestError
	 * @param e - Something caught by a catch clause.
	 */
	function isRestError(e) {
	    if (e instanceof RestError$1) {
	        return true;
	    }
	    return isError(e) && e.name === "RestError";
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the tracingPolicy.
	 */
	const tracingPolicyName = "tracingPolicy";
	/**
	 * A simple policy to create OpenTelemetry Spans for each request made by the pipeline
	 * that has SpanOptions with a parent.
	 * Requests made without a parent Span will not be recorded.
	 * @param options - Options to configure the telemetry logged by the tracing policy.
	 */
	function tracingPolicy$1(options = {}) {
	    const userAgent = getUserAgentValue(options.userAgentPrefix);
	    const tracingClient = tryCreateTracingClient();
	    return {
	        name: tracingPolicyName,
	        async sendRequest(request, next) {
	            var _a, _b;
	            if (!tracingClient || !((_a = request.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext)) {
	                return next(request);
	            }
	            const { span, tracingContext } = (_b = tryCreateSpan(tracingClient, request, userAgent)) !== null && _b !== void 0 ? _b : {};
	            if (!span || !tracingContext) {
	                return next(request);
	            }
	            try {
	                const response = await tracingClient.withContext(tracingContext, next, request);
	                tryProcessResponse(span, response);
	                return response;
	            }
	            catch (err) {
	                tryProcessError(span, err);
	                throw err;
	            }
	        },
	    };
	}
	function tryCreateTracingClient() {
	    try {
	        return createTracingClient({
	            namespace: "",
	            packageName: "@azure/core-rest-pipeline",
	            packageVersion: SDK_VERSION,
	        });
	    }
	    catch (e) {
	        logger$1.warning(`Error when creating the TracingClient: ${getErrorMessage(e)}`);
	        return undefined;
	    }
	}
	function tryCreateSpan(tracingClient, request, userAgent) {
	    try {
	        // As per spec, we do not need to differentiate between HTTP and HTTPS in span name.
	        const { span, updatedOptions } = tracingClient.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
	            spanKind: "client",
	            spanAttributes: {
	                "http.method": request.method,
	                "http.url": request.url,
	                requestId: request.requestId,
	            },
	        });
	        // If the span is not recording, don't do any more work.
	        if (!span.isRecording()) {
	            span.end();
	            return undefined;
	        }
	        if (userAgent) {
	            span.setAttribute("http.user_agent", userAgent);
	        }
	        // set headers
	        const headers = tracingClient.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
	        for (const [key, value] of Object.entries(headers)) {
	            request.headers.set(key, value);
	        }
	        return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
	    }
	    catch (e) {
	        logger$1.warning(`Skipping creating a tracing span due to an error: ${getErrorMessage(e)}`);
	        return undefined;
	    }
	}
	function tryProcessError(span, error) {
	    try {
	        span.setStatus({
	            status: "error",
	            error: isError(error) ? error : undefined,
	        });
	        if (isRestError(error) && error.statusCode) {
	            span.setAttribute("http.status_code", error.statusCode);
	        }
	        span.end();
	    }
	    catch (e) {
	        logger$1.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
	    }
	}
	function tryProcessResponse(span, response) {
	    try {
	        span.setAttribute("http.status_code", response.status);
	        const serviceRequestId = response.headers.get("x-ms-request-id");
	        if (serviceRequestId) {
	            span.setAttribute("serviceRequestId", serviceRequestId);
	        }
	        span.setStatus({
	            status: "success",
	        });
	        span.end();
	    }
	    catch (e) {
	        logger$1.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Create a new pipeline with a default set of customizable policies.
	 * @param options - Options to configure a custom pipeline.
	 */
	function createPipelineFromOptions$1(options) {
	    const pipeline = createEmptyPipeline();
	    if (isNode$1) {
	        if (options.tlsOptions) {
	            pipeline.addPolicy(tlsPolicy(options.tlsOptions));
	        }
	        pipeline.addPolicy(proxyPolicy$1(options.proxyOptions));
	        pipeline.addPolicy(decompressResponsePolicy());
	    }
	    pipeline.addPolicy(formDataPolicy());
	    pipeline.addPolicy(userAgentPolicy$1(options.userAgentOptions));
	    pipeline.addPolicy(setClientRequestIdPolicy());
	    pipeline.addPolicy(defaultRetryPolicy(options.retryOptions), { phase: "Retry" });
	    pipeline.addPolicy(tracingPolicy$1(options.userAgentOptions), { afterPhase: "Retry" });
	    if (isNode$1) {
	        // Both XHR and Fetch expect to handle redirects automatically,
	        // so only include this policy when we're in Node.
	        pipeline.addPolicy(redirectPolicy$1(options.redirectOptions), { afterPhase: "Retry" });
	    }
	    pipeline.addPolicy(logPolicy$1(options.loggingOptions), { afterPhase: "Sign" });
	    return pipeline;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	function normalizeName(name) {
	    return name.toLowerCase();
	}
	function* headerIterator(map) {
	    for (const entry of map.values()) {
	        yield [entry.name, entry.value];
	    }
	}
	class HttpHeadersImpl {
	    constructor(rawHeaders) {
	        this._headersMap = new Map();
	        if (rawHeaders) {
	            for (const headerName of Object.keys(rawHeaders)) {
	                this.set(headerName, rawHeaders[headerName]);
	            }
	        }
	    }
	    /**
	     * Set a header in this collection with the provided name and value. The name is
	     * case-insensitive.
	     * @param name - The name of the header to set. This value is case-insensitive.
	     * @param value - The value of the header to set.
	     */
	    set(name, value) {
	        this._headersMap.set(normalizeName(name), { name, value: String(value) });
	    }
	    /**
	     * Get the header value for the provided header name, or undefined if no header exists in this
	     * collection with the provided name.
	     * @param name - The name of the header. This value is case-insensitive.
	     */
	    get(name) {
	        var _a;
	        return (_a = this._headersMap.get(normalizeName(name))) === null || _a === void 0 ? void 0 : _a.value;
	    }
	    /**
	     * Get whether or not this header collection contains a header entry for the provided header name.
	     * @param name - The name of the header to set. This value is case-insensitive.
	     */
	    has(name) {
	        return this._headersMap.has(normalizeName(name));
	    }
	    /**
	     * Remove the header with the provided headerName.
	     * @param name - The name of the header to remove.
	     */
	    delete(name) {
	        this._headersMap.delete(normalizeName(name));
	    }
	    /**
	     * Get the JSON object representation of this HTTP header collection.
	     */
	    toJSON(options = {}) {
	        const result = {};
	        if (options.preserveCase) {
	            for (const entry of this._headersMap.values()) {
	                result[entry.name] = entry.value;
	            }
	        }
	        else {
	            for (const [normalizedName, entry] of this._headersMap) {
	                result[normalizedName] = entry.value;
	            }
	        }
	        return result;
	    }
	    /**
	     * Get the string representation of this HTTP header collection.
	     */
	    toString() {
	        return JSON.stringify(this.toJSON({ preserveCase: true }));
	    }
	    /**
	     * Iterate over tuples of header [name, value] pairs.
	     */
	    [Symbol.iterator]() {
	        return headerIterator(this._headersMap);
	    }
	}
	/**
	 * Creates an object that satisfies the `HttpHeaders` interface.
	 * @param rawHeaders - A simple object representing initial headers
	 */
	function createHttpHeaders(rawHeaders) {
	    return new HttpHeadersImpl(rawHeaders);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Checks if the body is a NodeReadable stream which is not supported in Browsers
	 */
	function isNodeReadableStream(body) {
	    return body && typeof body.pipe === "function";
	}
	/**
	 * Checks if the body is a ReadableStream supported by browsers
	 */
	function isReadableStream(body) {
	    return Boolean(body &&
	        typeof body.getReader === "function" &&
	        typeof body.tee === "function");
	}
	/**
	 * A HttpClient implementation that uses window.fetch to send HTTP requests.
	 * @internal
	 */
	class FetchHttpClient {
	    /**
	     * Makes a request over an underlying transport layer and returns the response.
	     * @param request - The request to be made.
	     */
	    async sendRequest(request) {
	        const url = new URL(request.url);
	        const isInsecure = url.protocol !== "https:";
	        if (isInsecure && !request.allowInsecureConnection) {
	            throw new Error(`Cannot connect to ${request.url} while allowInsecureConnection is false.`);
	        }
	        if (request.proxySettings) {
	            throw new Error("HTTP proxy is not supported in browser environment");
	        }
	        try {
	            return await makeRequest(request);
	        }
	        catch (e) {
	            throw getError(e, request);
	        }
	    }
	}
	/**
	 * Sends a request
	 */
	async function makeRequest(request) {
	    const { abortController, abortControllerCleanup } = setupAbortSignal(request);
	    try {
	        const headers = buildFetchHeaders(request.headers);
	        const requestBody = buildRequestBody(request);
	        /**
	         * Developers of the future:
	         * Do not set redirect: "manual" as part
	         * of request options.
	         * It will not work as you expect.
	         */
	        const response = await fetch(request.url, {
	            body: requestBody,
	            method: request.method,
	            headers: headers,
	            signal: abortController.signal,
	            credentials: request.withCredentials ? "include" : "same-origin",
	            cache: "no-store",
	        });
	        return buildPipelineResponse(response, request);
	    }
	    finally {
	        if (abortControllerCleanup) {
	            abortControllerCleanup();
	        }
	    }
	}
	/**
	 * Creates a pipeline response from a Fetch response;
	 */
	async function buildPipelineResponse(httpResponse, request) {
	    var _a, _b;
	    const headers = buildPipelineHeaders(httpResponse);
	    const response = {
	        request,
	        headers,
	        status: httpResponse.status,
	    };
	    const bodyStream = isReadableStream(httpResponse.body)
	        ? buildBodyStream(httpResponse.body, request.onDownloadProgress)
	        : httpResponse.body;
	    if (
	    // Value of POSITIVE_INFINITY in streamResponseStatusCodes is considered as any status code
	    ((_a = request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.has(Number.POSITIVE_INFINITY)) ||
	        ((_b = request.streamResponseStatusCodes) === null || _b === void 0 ? void 0 : _b.has(response.status))) {
	        if (request.enableBrowserStreams) {
	            response.browserStreamBody = bodyStream !== null && bodyStream !== void 0 ? bodyStream : undefined;
	        }
	        else {
	            const responseStream = new Response(bodyStream);
	            response.blobBody = responseStream.blob();
	        }
	    }
	    else {
	        const responseStream = new Response(bodyStream);
	        response.bodyAsText = await responseStream.text();
	    }
	    return response;
	}
	function setupAbortSignal(request) {
	    const abortController = new AbortController();
	    // Cleanup function
	    let abortControllerCleanup;
	    /**
	     * Attach an abort listener to the request
	     */
	    let abortListener;
	    if (request.abortSignal) {
	        if (request.abortSignal.aborted) {
	            throw new AbortError("The operation was aborted.");
	        }
	        abortListener = (event) => {
	            if (event.type === "abort") {
	                abortController.abort();
	            }
	        };
	        request.abortSignal.addEventListener("abort", abortListener);
	        abortControllerCleanup = () => {
	            var _a;
	            if (abortListener) {
	                (_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.removeEventListener("abort", abortListener);
	            }
	        };
	    }
	    // If a timeout was passed, call the abort signal once the time elapses
	    if (request.timeout > 0) {
	        setTimeout(() => {
	            abortController.abort();
	        }, request.timeout);
	    }
	    return { abortController, abortControllerCleanup };
	}
	/**
	 * Gets the specific error
	 */
	function getError(e, request) {
	    var _a;
	    if (e && (e === null || e === void 0 ? void 0 : e.name) === "AbortError") {
	        return e;
	    }
	    else {
	        return new RestError$1(`Error sending request: ${e.message}`, {
	            code: (_a = e === null || e === void 0 ? void 0 : e.code) !== null && _a !== void 0 ? _a : RestError$1.REQUEST_SEND_ERROR,
	            request,
	        });
	    }
	}
	/**
	 * Converts PipelineRequest headers to Fetch headers
	 */
	function buildFetchHeaders(pipelineHeaders) {
	    const headers = new Headers();
	    for (const [name, value] of pipelineHeaders) {
	        headers.append(name, value);
	    }
	    return headers;
	}
	function buildPipelineHeaders(httpResponse) {
	    const responseHeaders = createHttpHeaders();
	    for (const [name, value] of httpResponse.headers) {
	        responseHeaders.set(name, value);
	    }
	    return responseHeaders;
	}
	function buildRequestBody(request) {
	    const body = typeof request.body === "function" ? request.body() : request.body;
	    if (isNodeReadableStream(body)) {
	        throw new Error("Node streams are not supported in browser environment.");
	    }
	    return isReadableStream(body) ? buildBodyStream(body, request.onUploadProgress) : body;
	}
	/**
	 * Reads the request/response original stream and stream it through a new
	 * ReadableStream, this is done to be able to report progress in a way that
	 * all modern browsers support. TransformStreams would be an alternative,
	 * however they are not yet supported by all browsers i.e Firefox
	 */
	function buildBodyStream(readableStream, onProgress) {
	    let loadedBytes = 0;
	    // If the current browser supports pipeThrough we use a TransformStream
	    // to report progress
	    if (isTransformStreamSupported(readableStream)) {
	        return readableStream.pipeThrough(new TransformStream({
	            transform(chunk, controller) {
	                if (chunk === null) {
	                    controller.terminate();
	                    return;
	                }
	                controller.enqueue(chunk);
	                loadedBytes += chunk.length;
	                if (onProgress) {
	                    onProgress({ loadedBytes });
	                }
	            },
	        }));
	    }
	    else {
	        // If we can't use transform streams, wrap the original stream in a new readable stream
	        // and use pull to enqueue each chunk and report progress.
	        const reader = readableStream.getReader();
	        return new ReadableStream({
	            async pull(controller) {
	                var _a;
	                const { done, value } = await reader.read();
	                // When no more data needs to be consumed, break the reading
	                if (done || !value) {
	                    // Close the stream
	                    controller.close();
	                    reader.releaseLock();
	                    return;
	                }
	                loadedBytes += (_a = value === null || value === void 0 ? void 0 : value.length) !== null && _a !== void 0 ? _a : 0;
	                // Enqueue the next data chunk into our target stream
	                controller.enqueue(value);
	                if (onProgress) {
	                    onProgress({ loadedBytes });
	                }
	            },
	        });
	    }
	}
	/**
	 * Create a new HttpClient instance for the browser environment.
	 * @internal
	 */
	function createFetchHttpClient() {
	    return new FetchHttpClient();
	}
	function isTransformStreamSupported(readableStream) {
	    return readableStream.pipeThrough !== undefined && self.TransformStream !== undefined;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Create the correct HttpClient for the current environment.
	 */
	function createDefaultHttpClient() {
	    return createFetchHttpClient();
	}

	// Unique ID creation requires a high quality random # generator. In the browser we therefore
	// require the crypto API and do not support built-in fallback to lower quality random number
	// generators (like Math.random()).
	var getRandomValues;
	var rnds8 = new Uint8Array(16);
	function rng() {
	  // lazy load so that environments that need to polyfill have a chance to do so
	  if (!getRandomValues) {
	    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
	    // find the complete implementation of crypto (msCrypto) on IE11.
	    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

	    if (!getRandomValues) {
	      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
	    }
	  }

	  return getRandomValues(rnds8);
	}

	var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

	function validate(uuid) {
	  return typeof uuid === 'string' && REGEX.test(uuid);
	}

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */

	var byteToHex = [];

	for (var i = 0; i < 256; ++i) {
	  byteToHex.push((i + 0x100).toString(16).substr(1));
	}

	function stringify(arr) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  // Note: Be careful editing this code!  It's been tuned for performance
	  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
	  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
	  // of the following:
	  // - One or more input array values don't map to a hex octet (leading to
	  // "undefined" in the uuid)
	  // - Invalid input values for the RFC `version` or `variant` fields

	  if (!validate(uuid)) {
	    throw TypeError('Stringified UUID is invalid');
	  }

	  return uuid;
	}

	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	var _nodeId;

	var _clockseq; // Previous uuid creation time


	var _lastMSecs = 0;
	var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || new Array(16);
	  options = options || {};
	  var node = options.node || _nodeId;
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
	  // specified.  We do this lazily to minimize issues related to insufficient
	  // system entropy.  See #189

	  if (node == null || clockseq == null) {
	    var seedBytes = options.random || (options.rng || rng)();

	    if (node == null) {
	      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
	    }

	    if (clockseq == null) {
	      // Per 4.2.2, randomize (14 bit) clockseq
	      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
	    }
	  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


	  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock

	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

	  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval


	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  } // Per 4.2.1.2 Throw error if too many uuids are requested


	  if (nsecs >= 10000) {
	    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

	  msecs += 12219292800000; // `time_low`

	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff; // `time_mid`

	  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff; // `time_high_and_version`

	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

	  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

	  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

	  b[i++] = clockseq & 0xff; // `node`

	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }

	  return buf || stringify(b);
	}

	function parse$1(uuid) {
	  if (!validate(uuid)) {
	    throw TypeError('Invalid UUID');
	  }

	  var v;
	  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

	  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
	  arr[1] = v >>> 16 & 0xff;
	  arr[2] = v >>> 8 & 0xff;
	  arr[3] = v & 0xff; // Parse ........-####-....-....-............

	  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
	  arr[5] = v & 0xff; // Parse ........-....-####-....-............

	  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
	  arr[7] = v & 0xff; // Parse ........-....-....-####-............

	  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
	  arr[9] = v & 0xff; // Parse ........-....-....-....-############
	  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

	  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
	  arr[11] = v / 0x100000000 & 0xff;
	  arr[12] = v >>> 24 & 0xff;
	  arr[13] = v >>> 16 & 0xff;
	  arr[14] = v >>> 8 & 0xff;
	  arr[15] = v & 0xff;
	  return arr;
	}

	function stringToBytes(str) {
	  str = unescape(encodeURIComponent(str)); // UTF8 escape

	  var bytes = [];

	  for (var i = 0; i < str.length; ++i) {
	    bytes.push(str.charCodeAt(i));
	  }

	  return bytes;
	}

	var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
	var URL$1 = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
	function v35 (name, version, hashfunc) {
	  function generateUUID(value, namespace, buf, offset) {
	    if (typeof value === 'string') {
	      value = stringToBytes(value);
	    }

	    if (typeof namespace === 'string') {
	      namespace = parse$1(namespace);
	    }

	    if (namespace.length !== 16) {
	      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
	    } // Compute hash of namespace and value, Per 4.3
	    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
	    // hashfunc([...namespace, ... value])`


	    var bytes = new Uint8Array(16 + value.length);
	    bytes.set(namespace);
	    bytes.set(value, namespace.length);
	    bytes = hashfunc(bytes);
	    bytes[6] = bytes[6] & 0x0f | version;
	    bytes[8] = bytes[8] & 0x3f | 0x80;

	    if (buf) {
	      offset = offset || 0;

	      for (var i = 0; i < 16; ++i) {
	        buf[offset + i] = bytes[i];
	      }

	      return buf;
	    }

	    return stringify(bytes);
	  } // Function#name is not settable on some platforms (#270)


	  try {
	    generateUUID.name = name; // eslint-disable-next-line no-empty
	  } catch (err) {} // For CommonJS default export support


	  generateUUID.DNS = DNS;
	  generateUUID.URL = URL$1;
	  return generateUUID;
	}

	/*
	 * Browser-compatible JavaScript MD5
	 *
	 * Modification of JavaScript MD5
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * https://opensource.org/licenses/MIT
	 *
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	function md5(bytes) {
	  if (typeof bytes === 'string') {
	    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

	    bytes = new Uint8Array(msg.length);

	    for (var i = 0; i < msg.length; ++i) {
	      bytes[i] = msg.charCodeAt(i);
	    }
	  }

	  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
	}
	/*
	 * Convert an array of little-endian words to an array of bytes
	 */


	function md5ToHexEncodedArray(input) {
	  var output = [];
	  var length32 = input.length * 32;
	  var hexTab = '0123456789abcdef';

	  for (var i = 0; i < length32; i += 8) {
	    var x = input[i >> 5] >>> i % 32 & 0xff;
	    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
	    output.push(hex);
	  }

	  return output;
	}
	/**
	 * Calculate output length with padding and bit length
	 */


	function getOutputLength(inputLength8) {
	  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
	}
	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */


	function wordsToMd5(x, len) {
	  /* append padding */
	  x[len >> 5] |= 0x80 << len % 32;
	  x[getOutputLength(len) - 1] = len;
	  var a = 1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d = 271733878;

	  for (var i = 0; i < x.length; i += 16) {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	    a = md5ff(a, b, c, d, x[i], 7, -680876936);
	    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
	    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
	    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
	    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
	    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
	    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
	    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
	    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
	    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
	    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
	    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
	    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
	    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
	    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
	    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
	    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
	    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
	    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
	    b = md5gg(b, c, d, a, x[i], 20, -373897302);
	    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
	    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
	    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
	    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
	    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
	    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
	    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
	    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
	    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
	    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
	    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
	    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
	    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
	    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
	    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
	    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
	    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
	    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
	    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
	    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
	    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
	    d = md5hh(d, a, b, c, x[i], 11, -358537222);
	    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
	    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
	    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
	    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
	    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
	    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
	    a = md5ii(a, b, c, d, x[i], 6, -198630844);
	    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
	    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
	    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
	    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
	    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
	    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
	    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
	    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
	    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
	    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
	    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
	    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
	    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
	    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
	    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
	    a = safeAdd(a, olda);
	    b = safeAdd(b, oldb);
	    c = safeAdd(c, oldc);
	    d = safeAdd(d, oldd);
	  }

	  return [a, b, c, d];
	}
	/*
	 * Convert an array bytes to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */


	function bytesToWords(input) {
	  if (input.length === 0) {
	    return [];
	  }

	  var length8 = input.length * 8;
	  var output = new Uint32Array(getOutputLength(length8));

	  for (var i = 0; i < length8; i += 8) {
	    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
	  }

	  return output;
	}
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */


	function safeAdd(x, y) {
	  var lsw = (x & 0xffff) + (y & 0xffff);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return msw << 16 | lsw & 0xffff;
	}
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */


	function bitRotateLeft(num, cnt) {
	  return num << cnt | num >>> 32 - cnt;
	}
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */


	function md5cmn(q, a, b, x, s, t) {
	  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
	}

	function md5ff(a, b, c, d, x, s, t) {
	  return md5cmn(b & c | ~b & d, a, b, x, s, t);
	}

	function md5gg(a, b, c, d, x, s, t) {
	  return md5cmn(b & d | c & ~d, a, b, x, s, t);
	}

	function md5hh(a, b, c, d, x, s, t) {
	  return md5cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function md5ii(a, b, c, d, x, s, t) {
	  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	var v3 = v35('v3', 0x30, md5);

	function v4(options, buf, offset) {
	  options = options || {};
	  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

	  rnds[6] = rnds[6] & 0x0f | 0x40;
	  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

	  if (buf) {
	    offset = offset || 0;

	    for (var i = 0; i < 16; ++i) {
	      buf[offset + i] = rnds[i];
	    }

	    return buf;
	  }

	  return stringify(rnds);
	}

	// Adapted from Chris Veness' SHA1 code at
	// http://www.movable-type.co.uk/scripts/sha1.html
	function f(s, x, y, z) {
	  switch (s) {
	    case 0:
	      return x & y ^ ~x & z;

	    case 1:
	      return x ^ y ^ z;

	    case 2:
	      return x & y ^ x & z ^ y & z;

	    case 3:
	      return x ^ y ^ z;
	  }
	}

	function ROTL(x, n) {
	  return x << n | x >>> 32 - n;
	}

	function sha1(bytes) {
	  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
	  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

	  if (typeof bytes === 'string') {
	    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

	    bytes = [];

	    for (var i = 0; i < msg.length; ++i) {
	      bytes.push(msg.charCodeAt(i));
	    }
	  } else if (!Array.isArray(bytes)) {
	    // Convert Array-like to Array
	    bytes = Array.prototype.slice.call(bytes);
	  }

	  bytes.push(0x80);
	  var l = bytes.length / 4 + 2;
	  var N = Math.ceil(l / 16);
	  var M = new Array(N);

	  for (var _i = 0; _i < N; ++_i) {
	    var arr = new Uint32Array(16);

	    for (var j = 0; j < 16; ++j) {
	      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
	    }

	    M[_i] = arr;
	  }

	  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
	  M[N - 1][14] = Math.floor(M[N - 1][14]);
	  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

	  for (var _i2 = 0; _i2 < N; ++_i2) {
	    var W = new Uint32Array(80);

	    for (var t = 0; t < 16; ++t) {
	      W[t] = M[_i2][t];
	    }

	    for (var _t = 16; _t < 80; ++_t) {
	      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
	    }

	    var a = H[0];
	    var b = H[1];
	    var c = H[2];
	    var d = H[3];
	    var e = H[4];

	    for (var _t2 = 0; _t2 < 80; ++_t2) {
	      var s = Math.floor(_t2 / 20);
	      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
	      e = d;
	      d = c;
	      c = ROTL(b, 30) >>> 0;
	      b = a;
	      a = T;
	    }

	    H[0] = H[0] + a >>> 0;
	    H[1] = H[1] + b >>> 0;
	    H[2] = H[2] + c >>> 0;
	    H[3] = H[3] + d >>> 0;
	    H[4] = H[4] + e >>> 0;
	  }

	  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
	}

	var v5 = v35('v5', 0x50, sha1);

	var nil = '00000000-0000-0000-0000-000000000000';

	function version(uuid) {
	  if (!validate(uuid)) {
	    throw TypeError('Invalid UUID');
	  }

	  return parseInt(uuid.substr(14, 1), 16);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Generated Universally Unique Identifier
	 *
	 * @returns RFC4122 v4 UUID.
	 * @internal
	 */
	function generateUuid$1() {
	    return v4();
	}

	// Copyright (c) Microsoft Corporation.
	class PipelineRequestImpl {
	    constructor(options) {
	        var _a, _b, _c, _d, _e, _f, _g;
	        this.url = options.url;
	        this.body = options.body;
	        this.headers = (_a = options.headers) !== null && _a !== void 0 ? _a : createHttpHeaders();
	        this.method = (_b = options.method) !== null && _b !== void 0 ? _b : "GET";
	        this.timeout = (_c = options.timeout) !== null && _c !== void 0 ? _c : 0;
	        this.formData = options.formData;
	        this.disableKeepAlive = (_d = options.disableKeepAlive) !== null && _d !== void 0 ? _d : false;
	        this.proxySettings = options.proxySettings;
	        this.streamResponseStatusCodes = options.streamResponseStatusCodes;
	        this.withCredentials = (_e = options.withCredentials) !== null && _e !== void 0 ? _e : false;
	        this.abortSignal = options.abortSignal;
	        this.tracingOptions = options.tracingOptions;
	        this.onUploadProgress = options.onUploadProgress;
	        this.onDownloadProgress = options.onDownloadProgress;
	        this.requestId = options.requestId || generateUuid$1();
	        this.allowInsecureConnection = (_f = options.allowInsecureConnection) !== null && _f !== void 0 ? _f : false;
	        this.enableBrowserStreams = (_g = options.enableBrowserStreams) !== null && _g !== void 0 ? _g : false;
	    }
	}
	/**
	 * Creates a new pipeline request with the given options.
	 * This method is to allow for the easy setting of default values and not required.
	 * @param options - The options to create the request with.
	 */
	function createPipelineRequest(options) {
	    return new PipelineRequestImpl(options);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the exponentialRetryPolicy.
	 */
	const exponentialRetryPolicyName = "exponentialRetryPolicy";
	/**
	 * A policy that attempts to retry requests while introducing an exponentially increasing delay.
	 * @param options - Options that configure retry logic.
	 */
	function exponentialRetryPolicy$1(options = {}) {
	    var _a;
	    return retryPolicy([
	        exponentialRetryStrategy(Object.assign(Object.assign({}, options), { ignoreSystemErrors: true })),
	    ], {
	        maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	    });
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Name of the {@link systemErrorRetryPolicy}
	 */
	const systemErrorRetryPolicyName = "systemErrorRetryPolicy";
	/**
	 * A retry policy that specifically seeks to handle errors in the
	 * underlying transport layer (e.g. DNS lookup failures) rather than
	 * retryable error codes from the server itself.
	 * @param options - Options that customize the policy.
	 */
	function systemErrorRetryPolicy$1(options = {}) {
	    var _a;
	    return {
	        name: systemErrorRetryPolicyName,
	        sendRequest: retryPolicy([
	            exponentialRetryStrategy(Object.assign(Object.assign({}, options), { ignoreHttpStatusCodes: true })),
	        ], {
	            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	        }).sendRequest,
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Name of the {@link throttlingRetryPolicy}
	 */
	const throttlingRetryPolicyName = "throttlingRetryPolicy";
	/**
	 * A policy that retries when the server sends a 429 response with a Retry-After header.
	 *
	 * To learn more, please refer to
	 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
	 * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
	 * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
	 *
	 * @param options - Options that configure retry logic.
	 */
	function throttlingRetryPolicy$1(options = {}) {
	    var _a;
	    return {
	        name: throttlingRetryPolicyName,
	        sendRequest: retryPolicy([throttlingRetryStrategy()], {
	            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	        }).sendRequest,
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Default options for the cycler if none are provided
	const DEFAULT_CYCLER_OPTIONS$1 = {
	    forcedRefreshWindowInMs: 1000,
	    retryIntervalInMs: 3000,
	    refreshWindowInMs: 1000 * 60 * 2, // Start refreshing 2m before expiry
	};
	/**
	 * Converts an an unreliable access token getter (which may resolve with null)
	 * into an AccessTokenGetter by retrying the unreliable getter in a regular
	 * interval.
	 *
	 * @param getAccessToken - A function that produces a promise of an access token that may fail by returning null.
	 * @param retryIntervalInMs - The time (in milliseconds) to wait between retry attempts.
	 * @param refreshTimeout - The timestamp after which the refresh attempt will fail, throwing an exception.
	 * @returns - A promise that, if it resolves, will resolve with an access token.
	 */
	async function beginRefresh$1(getAccessToken, retryIntervalInMs, refreshTimeout) {
	    // This wrapper handles exceptions gracefully as long as we haven't exceeded
	    // the timeout.
	    async function tryGetAccessToken() {
	        if (Date.now() < refreshTimeout) {
	            try {
	                return await getAccessToken();
	            }
	            catch (_a) {
	                return null;
	            }
	        }
	        else {
	            const finalToken = await getAccessToken();
	            // Timeout is up, so throw if it's still null
	            if (finalToken === null) {
	                throw new Error("Failed to refresh access token.");
	            }
	            return finalToken;
	        }
	    }
	    let token = await tryGetAccessToken();
	    while (token === null) {
	        await delay$2(retryIntervalInMs);
	        token = await tryGetAccessToken();
	    }
	    return token;
	}
	/**
	 * Creates a token cycler from a credential, scopes, and optional settings.
	 *
	 * A token cycler represents a way to reliably retrieve a valid access token
	 * from a TokenCredential. It will handle initializing the token, refreshing it
	 * when it nears expiration, and synchronizes refresh attempts to avoid
	 * concurrency hazards.
	 *
	 * @param credential - the underlying TokenCredential that provides the access
	 * token
	 * @param tokenCyclerOptions - optionally override default settings for the cycler
	 *
	 * @returns - a function that reliably produces a valid access token
	 */
	function createTokenCycler$1(credential, tokenCyclerOptions) {
	    let refreshWorker = null;
	    let token = null;
	    let tenantId;
	    const options = Object.assign(Object.assign({}, DEFAULT_CYCLER_OPTIONS$1), tokenCyclerOptions);
	    /**
	     * This little holder defines several predicates that we use to construct
	     * the rules of refreshing the token.
	     */
	    const cycler = {
	        /**
	         * Produces true if a refresh job is currently in progress.
	         */
	        get isRefreshing() {
	            return refreshWorker !== null;
	        },
	        /**
	         * Produces true if the cycler SHOULD refresh (we are within the refresh
	         * window and not already refreshing)
	         */
	        get shouldRefresh() {
	            var _a;
	            return (!cycler.isRefreshing &&
	                ((_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : 0) - options.refreshWindowInMs < Date.now());
	        },
	        /**
	         * Produces true if the cycler MUST refresh (null or nearly-expired
	         * token).
	         */
	        get mustRefresh() {
	            return (token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now());
	        },
	    };
	    /**
	     * Starts a refresh job or returns the existing job if one is already
	     * running.
	     */
	    function refresh(scopes, getTokenOptions) {
	        var _a;
	        if (!cycler.isRefreshing) {
	            // We bind `scopes` here to avoid passing it around a lot
	            const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
	            // Take advantage of promise chaining to insert an assignment to `token`
	            // before the refresh can be considered done.
	            refreshWorker = beginRefresh$1(tryGetAccessToken, options.retryIntervalInMs, 
	            // If we don't have a token, then we should timeout immediately
	            (_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : Date.now())
	                .then((_token) => {
	                refreshWorker = null;
	                token = _token;
	                tenantId = getTokenOptions.tenantId;
	                return token;
	            })
	                .catch((reason) => {
	                // We also should reset the refresher if we enter a failed state.  All
	                // existing awaiters will throw, but subsequent requests will start a
	                // new retry chain.
	                refreshWorker = null;
	                token = null;
	                tenantId = undefined;
	                throw reason;
	            });
	        }
	        return refreshWorker;
	    }
	    return async (scopes, tokenOptions) => {
	        //
	        // Simple rules:
	        // - If we MUST refresh, then return the refresh task, blocking
	        //   the pipeline until a token is available.
	        // - If we SHOULD refresh, then run refresh but don't return it
	        //   (we can still use the cached token).
	        // - Return the token, since it's fine if we didn't return in
	        //   step 1.
	        //
	        // If the tenantId passed in token options is different to the one we have
	        // Or if we are in claim challenge and the token was rejected and a new access token need to be issued, we need to
	        // refresh the token with the new tenantId or token.
	        const mustRefresh = tenantId !== tokenOptions.tenantId || Boolean(tokenOptions.claims) || cycler.mustRefresh;
	        if (mustRefresh)
	            return refresh(scopes, tokenOptions);
	        if (cycler.shouldRefresh) {
	            refresh(scopes, tokenOptions);
	        }
	        return token;
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the bearerTokenAuthenticationPolicy.
	 */
	const bearerTokenAuthenticationPolicyName = "bearerTokenAuthenticationPolicy";
	/**
	 * Default authorize request handler
	 */
	async function defaultAuthorizeRequest(options) {
	    const { scopes, getAccessToken, request } = options;
	    const getTokenOptions = {
	        abortSignal: request.abortSignal,
	        tracingOptions: request.tracingOptions,
	    };
	    const accessToken = await getAccessToken(scopes, getTokenOptions);
	    if (accessToken) {
	        options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
	    }
	}
	/**
	 * We will retrieve the challenge only if the response status code was 401,
	 * and if the response contained the header "WWW-Authenticate" with a non-empty value.
	 */
	function getChallenge(response) {
	    const challenge = response.headers.get("WWW-Authenticate");
	    if (response.status === 401 && challenge) {
	        return challenge;
	    }
	    return;
	}
	/**
	 * A policy that can request a token from a TokenCredential implementation and
	 * then apply it to the Authorization header of a request as a Bearer token.
	 */
	function bearerTokenAuthenticationPolicy$1(options) {
	    var _a;
	    const { credential, scopes, challengeCallbacks } = options;
	    const logger = options.logger || logger$1;
	    const callbacks = Object.assign({ authorizeRequest: (_a = challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequest) !== null && _a !== void 0 ? _a : defaultAuthorizeRequest, authorizeRequestOnChallenge: challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequestOnChallenge }, challengeCallbacks);
	    // This function encapsulates the entire process of reliably retrieving the token
	    // The options are left out of the public API until there's demand to configure this.
	    // Remember to extend `BearerTokenAuthenticationPolicyOptions` with `TokenCyclerOptions`
	    // in order to pass through the `options` object.
	    const getAccessToken = credential
	        ? createTokenCycler$1(credential /* , options */)
	        : () => Promise.resolve(null);
	    return {
	        name: bearerTokenAuthenticationPolicyName,
	        /**
	         * If there's no challenge parameter:
	         * - It will try to retrieve the token using the cache, or the credential's getToken.
	         * - Then it will try the next policy with or without the retrieved token.
	         *
	         * It uses the challenge parameters to:
	         * - Skip a first attempt to get the token from the credential if there's no cached token,
	         *   since it expects the token to be retrievable only after the challenge.
	         * - Prepare the outgoing request if the `prepareRequest` method has been provided.
	         * - Send an initial request to receive the challenge if it fails.
	         * - Process a challenge if the response contains it.
	         * - Retrieve a token with the challenge information, then re-send the request.
	         */
	        async sendRequest(request, next) {
	            if (!request.url.toLowerCase().startsWith("https://")) {
	                throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
	            }
	            await callbacks.authorizeRequest({
	                scopes: Array.isArray(scopes) ? scopes : [scopes],
	                request,
	                getAccessToken,
	                logger,
	            });
	            let response;
	            let error;
	            try {
	                response = await next(request);
	            }
	            catch (err) {
	                error = err;
	                response = err.response;
	            }
	            if (callbacks.authorizeRequestOnChallenge &&
	                (response === null || response === void 0 ? void 0 : response.status) === 401 &&
	                getChallenge(response)) {
	                // processes challenge
	                const shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
	                    scopes: Array.isArray(scopes) ? scopes : [scopes],
	                    request,
	                    response,
	                    getAccessToken,
	                    logger,
	                });
	                if (shouldSendRequest) {
	                    return next(request);
	                }
	            }
	            if (error) {
	                throw error;
	            }
	            else {
	                return response;
	            }
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the ndJsonPolicy.
	 */
	const ndJsonPolicyName = "ndJsonPolicy";
	/**
	 * ndJsonPolicy is a policy used to control keep alive settings for every request.
	 */
	function ndJsonPolicy$1() {
	    return {
	        name: ndJsonPolicyName,
	        async sendRequest(request, next) {
	            // There currently isn't a good way to bypass the serializer
	            if (typeof request.body === "string" && request.body.startsWith("[")) {
	                const body = JSON.parse(request.body);
	                if (Array.isArray(body)) {
	                    request.body = body.map((item) => JSON.stringify(item) + "\n").join("");
	                }
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	// In the browser, we load the env variables with the help of karma.conf.js
	const env = window.__env__;

	// Copyright (c) Microsoft Corporation.
	/**
	 * A custom error type for failed pipeline requests.
	 */
	class RecorderError extends Error {
	    constructor(message, statusCode) {
	        super(message);
	        this.statusCode = statusCode;
	        this.name = "RecorderError";
	        this.statusCode = statusCode;
	    }
	}
	/**
	 * Helper class to manage the recording state to make sure the proxy-tool is not flooded with unintended requests.
	 */
	class RecordingStateManager {
	    constructor() {
	        this.currentState = "stopped";
	    }
	    /**
	     * validateState
	     */
	    validateState(nextState) {
	        if (nextState === "started") {
	            if (this.state === "started") {
	                throw new RecorderError("Already started, should not have called start again.");
	            }
	        }
	        if (nextState === "stopped") {
	            if (this.state === "stopped") {
	                throw new RecorderError("Already stopped, should not have called stop again.");
	            }
	        }
	    }
	    get state() {
	        return this.currentState;
	    }
	    set state(nextState) {
	        // Validate state transition
	        this.validateState(nextState);
	        this.currentState = nextState;
	    }
	}
	function isStringSanitizer(sanitizer) {
	    return !sanitizer.regex;
	}
	/**
	 * Throws error message when the `label` is not defined when it should have been defined in the given mode.
	 *
	 * Returns true if the param exists.
	 */
	function ensureExistence(thing, label) {
	    if (!thing) {
	        throw new RecorderError(`Something went wrong, ${label} should not have been undefined in "${getTestMode()}" mode.`);
	    }
	    return true; // Since we would throw error if undefined
	}
	/**
	 * Returns the test mode.
	 *
	 * If TEST_MODE is not defined, defaults to playback.
	 */
	function getTestMode() {
	    if (isPlaybackMode()) {
	        return "playback";
	    }
	    return env.TEST_MODE;
	}
	/** Make a lazy value that can be deferred and only computed once. */
	const once = (make) => {
	    let value;
	    return () => (value = value !== null && value !== void 0 ? value : make());
	};
	function isRecordMode() {
	    return env.TEST_MODE === "record";
	}
	function isLiveMode() {
	    return env.TEST_MODE === "live";
	}
	function isPlaybackMode() {
	    return !isRecordMode() && !isLiveMode();
	}
	/**
	 * Loads the environment variables in both node and browser modes corresponding to the key-value pairs provided.
	 *
	 * Example-
	 *
	 * Suppose `variables` is { ACCOUNT_NAME: "my_account_name", ACCOUNT_KEY: "fake_secret" },
	 * `setEnvironmentVariables` loads the ACCOUNT_NAME and ACCOUNT_KEY in the environment accordingly.
	 */
	function setEnvironmentVariables(variables) {
	    for (const [key, value] of Object.entries(variables)) {
	        env[key] = value;
	    }
	}
	/**
	 * Returns the environment variable. Throws error if not defined.
	 */
	function assertEnvironmentVariable(variable) {
	    const value = env[variable];
	    if (!value)
	        throw new Error(`${variable} is not defined`);
	    return value;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * This method is used while generating the file/folder path using the describe/it block titles.
	 *
	 * Since those titles may contain symbols such as `<`, "=" or even ' ', we'll replace them
	 * with strings representing those symbols or with something that reads better as a file name.
	 *
	 * If a test has some special character that is not being considered here,
	 * feel free to add the symbol and its replacement.
	 */
	function formatPath(path) {
	    return path
	        .toLowerCase()
	        .replace(/ /g, "_")
	        .replace(/<=/g, "lte")
	        .replace(/>=/g, "gte")
	        .replace(/</g, "lt")
	        .replace(/>/g, "gt")
	        .replace(/=/g, "eq")
	        .replace(/\W/g, "");
	}
	/**
	 * Generates a file path with the following structure:
	 *
	 *     `{node|browsers}/<describe-block-title>/recording_<test-title>.json`
	 *
	 * @param platform A string, either "node" or "browsers".
	 * @param testSuiteTitle The title of the test suite.
	 * @param testTitle The title of the specific test we're running.
	 */
	function generateTestRecordingFilePath(platform, testSuiteTitle, testTitle) {
	    // File Extension
	    return `${platform}/${formatPath(testSuiteTitle)}/recording_${formatPath(testTitle)}.json`;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	function relativeRecordingsPath() {
	    throw new Error("Attempted to use the function meant for node in a browser.");
	}

	// Copyright (c) Microsoft Corporation.
	function sessionFilePath(testContext) {
	    const recordingsFolder = !isNode$1 ? env.RECORDINGS_RELATIVE_PATH : relativeRecordingsPath(); // sdk/service/project/recordings
	    return `${recordingsFolder}/${recordingFilePath(testContext)}`;
	    // sdk/service/project/recordings/{node|browsers}/<describe-block-title>/recording_<test-title>.json
	}
	/**
	 * Generates a file path with the following structure:
	 *
	 *  `{node|browsers}/<describe-block-title>/recording_<test-title>.json`
	 */
	function recordingFilePath(testContext) {
	    if (!testContext.parent) {
	        throw new RecorderError(`Test ${testContext.title} is not inside a describe block, so a file path for its recording could not be generated. Please place the test inside a describe block.`);
	    }
	    return generateTestRecordingFilePath(isNode$1 ? "node" : "browsers", testContext.parent.fullTitle(), testContext.title);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * All the routes available with the proxy-tool endpoint that can be hit
	 */
	const paths = {
	    playback: "/playback",
	    record: "/record",
	    start: "/start",
	    stop: "/stop",
	    admin: "/admin",
	    addSanitizer: "/addSanitizer",
	    info: "/info",
	    available: "/available",
	    active: "/active",
	    reset: "/reset",
	    setMatcher: "/setMatcher",
	    addTransform: "/addTransform",
	};

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Returns the connection string parsed as JSON object.
	 */
	function getConnStringAsJSON(connectionString) {
	    const keyValuePairs = {};
	    const elements = connectionString.split(";").filter((e) => Boolean(e));
	    for (const element of elements) {
	        const trimmedElement = element.trim();
	        const [elementKey, value] = getKeyValuePair(trimmedElement);
	        keyValuePairs[elementKey] = value;
	    }
	    return keyValuePairs;
	}
	/**
	 * Returns the key and value from `<key>=<value>` string.
	 *
	 * `a=b=c` => ["a", "b=c"]
	 */
	function getKeyValuePair(kvp) {
	    // If the string is not in kvp format <key>=<value> return an empty array
	    if (!kvp || kvp.indexOf("=") === -1) {
	        return [];
	    }
	    return kvp.split(/=(.*)/).slice(0, 2);
	}
	/**
	 * Get real and fake values mapped from the provided connection strings.
	 *
	 * Example:
	 *  connectionString = "endpoint=secretive.azure.io;token=a1b2c3d4;secret=totally_secret"
	 *  fakeConnString   = "endpoint=randomval.azure.io;token=mask_tok;secret=totally_faked"
	 *
	 *  // Ordering/spaces are not important
	 *
	 * Returns
	 * ```
	 * {
	 *   "secretive.azure.io": "randomval.azure.io",
	 *   "a1b2c3d4"          : "mask_tok",
	 *   "totally_secret"    : "totally_faked"
	 * }
	 * ```
	 */
	function getRealAndFakePairs(connectionString, fakeConnString) {
	    const realAndFakePairs = {};
	    const fakeValues = getConnStringAsJSON(fakeConnString);
	    const realValues = getConnStringAsJSON(connectionString);
	    for (const key in fakeValues) {
	        realAndFakePairs[realValues[key]] = fakeValues[key]; // "real value" : "fake value"
	    }
	    return realAndFakePairs;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Adds the recording id headers to the requests that are sent to the proxy tool.
	 * These are required to appropriately save the recordings in the record mode and picking them up in playback.
	 */
	function createRecordingRequest(url, sessionFile, recordingId, method = "POST") {
	    const req = createPipelineRequest({ url: url, method });
	    if (sessionFile !== undefined) {
	        req.body = JSON.stringify({ "x-recording-file": sessionFile });
	    }
	    if (recordingId !== undefined) {
	        req.headers.set("x-recording-id", recordingId);
	    }
	    return req;
	}

	/**
	 * Given an AddSanitizer<T> function, create an AddSanitizer function that operates on an array of T, adding
	 * each sanitizer in the array individually.
	 */
	const pluralize = (singular) => async (httpClient, url, recordingId, sanitizers) => {
	    await Promise.all(sanitizers.map((sanitizer) => singular(httpClient, url, recordingId, sanitizer)));
	};
	/**
	 * Makes an AddSanitizer<unknown> function that passes the sanitizer content directly to the test proxy request body.
	 */
	const makeAddSanitizer = (sanitizerName) => async (httpClient, url, recordingId, sanitizer) => {
	    await addSanitizer(httpClient, url, recordingId, {
	        sanitizer: sanitizerName,
	        body: sanitizer,
	    });
	};
	/**
	 * Makes an AddSanitizer<boolean> function that adds the sanitizer if the value is set to true,
	 * and otherwise makes no request to the server. Used for ResetSanitizer and OAuthResponseSanitizer.
	 */
	const makeAddBodilessSanitizer = (sanitizerName) => async (httpClient, url, recordingId, enable) => {
	    if (enable) {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: sanitizerName,
	            body: undefined,
	        });
	    }
	};
	/**
	 * Makes an AddSanitizer function for a FindReplaceSanitizer, for example a bodySanitizer.
	 * Depending on the input FindReplaceSanitizer options, either adds a sanitizer named `regexSanitizerName`
	 * or `stringSanitizerName`.
	 */
	const makeAddFindReplaceSanitizer = (regexSanitizerName, stringSanitizerName) => async (httpClient, url, recordingId, sanitizer) => {
	    if (isStringSanitizer(sanitizer)) {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: stringSanitizerName,
	            body: {
	                target: sanitizer.target,
	                value: sanitizer.value,
	            },
	        });
	    }
	    else {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: regexSanitizerName,
	            body: {
	                regex: sanitizer.target,
	                value: sanitizer.value,
	                groupForReplace: sanitizer.groupForReplace,
	            },
	        });
	    }
	};
	/**
	 *  Internally,
	 * - connection strings are parsed and
	 * - each part of the connection string is mapped with its corresponding fake value
	 * - GeneralStringSanitizer is applied for each of the parts with the real and fake values that are parsed
	 */
	async function addConnectionStringSanitizer(httpClient, url, recordingId, { actualConnString, fakeConnString }) {
	    if (!actualConnString) {
	        if (!isRecordMode())
	            return;
	        throw new RecorderError(`Attempted to add an invalid sanitizer - ${JSON.stringify({
            actualConnString: actualConnString,
            fakeConnString: fakeConnString,
        })}`);
	    }
	    // extract connection string parts and match call
	    const pairsMatched = getRealAndFakePairs(actualConnString, fakeConnString);
	    await addSanitizers(httpClient, url, recordingId, {
	        generalSanitizers: Object.entries(pairsMatched).map(([key, value]) => {
	            return { value, target: key };
	        }),
	    });
	}
	/**
	 * Adds a ContinuationSanitizer with the given options.
	 */
	async function addContinuationSanitizer(httpClient, url, recordingId, sanitizer) {
	    await addSanitizer(httpClient, url, recordingId, {
	        sanitizer: "ContinuationSanitizer",
	        body: Object.assign(Object.assign({}, sanitizer), { resetAfterFirst: sanitizer.resetAfterFirst.toString() }),
	    });
	}
	/**
	 * Adds a RemoveHeaderSanitizer with the given options.
	 */
	async function addRemoveHeaderSanitizer(httpClient, url, recordingId, sanitizer) {
	    await addSanitizer(httpClient, url, recordingId, {
	        sanitizer: "RemoveHeaderSanitizer",
	        body: {
	            headersForRemoval: sanitizer.headersForRemoval.toString(),
	        },
	    });
	}
	/**
	 * Adds a HeaderRegexSanitizer or HeaderStringSanitizer.
	 *
	 * HeaderSanitizer is a special case of FindReplaceSanitizer where a header name ('key') must be provided.
	 * Additionally, the 'target' option is not required. If target is unspecified, the header's value will always
	 * be replaced.
	 */
	async function addHeaderSanitizer(httpClient, url, recordingId, sanitizer) {
	    if (sanitizer.regex || !sanitizer.target) {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: "HeaderRegexSanitizer",
	            body: {
	                key: sanitizer.key,
	                value: sanitizer.value,
	                regex: sanitizer.target,
	                groupForReplace: sanitizer.groupForReplace,
	            },
	        });
	    }
	    else {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: "HeaderStringSanitizer",
	            body: {
	                key: sanitizer.key,
	                target: sanitizer.target,
	                value: sanitizer.value,
	            },
	        });
	    }
	}
	const addSanitizersActions = {
	    generalSanitizers: pluralize(makeAddFindReplaceSanitizer("GeneralRegexSanitizer", "GeneralStringSanitizer")),
	    bodySanitizers: pluralize(makeAddFindReplaceSanitizer("BodyRegexSanitizer", "BodyStringSanitizer")),
	    headerSanitizers: pluralize(addHeaderSanitizer),
	    uriSanitizers: pluralize(makeAddFindReplaceSanitizer("UriRegexSanitizer", "UriStringSanitizer")),
	    connectionStringSanitizers: pluralize(addConnectionStringSanitizer),
	    bodyKeySanitizers: pluralize(makeAddSanitizer("BodyKeySanitizer")),
	    continuationSanitizers: pluralize(addContinuationSanitizer),
	    removeHeaderSanitizer: addRemoveHeaderSanitizer,
	    oAuthResponseSanitizer: makeAddBodilessSanitizer("OAuthResponseSanitizer"),
	    uriSubscriptionIdSanitizer: makeAddSanitizer("UriSubscriptionIdSanitizer"),
	    resetSanitizer: makeAddBodilessSanitizer("Reset"),
	};
	async function addSanitizers(httpClient, url, recordingId, options) {
	    await Promise.all(Object.entries(options).map(([key, sanitizer]) => {
	        const action = addSanitizersActions[key];
	        if (!action) {
	            throw new RecorderError(`Sanitizer ${key} not implemented`);
	        }
	        return action(httpClient, url, recordingId, sanitizer);
	    }));
	}
	/**
	 * Atomic method to add a simple sanitizer.
	 */
	async function addSanitizer(httpClient, url, recordingId, options) {
	    const uri = `${url}${paths.admin}${options.sanitizer !== "Reset" ? paths.addSanitizer : paths.reset}`;
	    const req = createRecordingRequest(uri, undefined, recordingId);
	    if (options.sanitizer !== "Reset") {
	        req.headers.set("x-abstraction-identifier", options.sanitizer);
	    }
	    req.headers.set("Content-Type", "application/json");
	    req.body = options.body !== undefined ? JSON.stringify(options.body) : undefined;
	    const rsp = await httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	    if (rsp.status !== 200) {
	        throw new RecorderError("addSanitizer request failed.");
	    }
	}
	/**
	 * Returns the html document of all the available transforms in the proxy-tool
	 */
	async function transformsInfo(httpClient, url, recordingId) {
	    if (recordingId) {
	        const infoUri = `${url}${paths.info}${paths.available}`;
	        const req = createRecordingRequest(infoUri, undefined, recordingId, "GET");
	        if (!httpClient) {
	            throw new RecorderError(`Something went wrong, Sanitizer.httpClient should not have been undefined in ${getTestMode()} mode.`);
	        }
	        const rsp = await httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	        if (rsp.status !== 200) {
	            throw new RecorderError("Info request failed.");
	        }
	        return rsp.bodyAsText;
	    }
	    else {
	        throw new RecorderError("Bad state, recordingId is not defined when called transformsInfo().");
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Supposed to be used in record and playback modes.
	 * Has no effect in live mode.
	 *
	 *  1. The key-value pairs will be used as the environment variables in playback mode.
	 *  2. If the env variables are present in the recordings as plain strings, they will be replaced with the provided values in record mode
	 */
	async function handleEnvSetup(httpClient, url, recordingId, envSetupForPlayback) {
	    if (envSetupForPlayback) {
	        if (isPlaybackMode()) {
	            // Loads the "fake" environment variables in `process.env` or `window.__env__` based on the runtime
	            setEnvironmentVariables(envSetupForPlayback);
	        }
	        else if (isRecordMode()) {
	            // If the env variables are present in the recordings as plain strings, they will be replaced with the provided values in record mode
	            const generalSanitizers = [];
	            for (const [key, value] of Object.entries(envSetupForPlayback)) {
	                const envKey = env[key];
	                if (envKey) {
	                    generalSanitizers.push({ target: envKey, value });
	                }
	            }
	            await addSanitizers(httpClient, url, recordingId, {
	                generalSanitizers,
	            });
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	async function setMatcher(recorderUrl, httpClient, matcher, recordingId, matcherBody = { compareBodies: true, ignoreQueryOrdering: false }) {
	    var _a, _b;
	    const url = `${recorderUrl}${paths.admin}${paths.setMatcher}`;
	    const request = createPipelineRequest({ url, method: "POST", allowInsecureConnection: true });
	    request.headers.set("x-abstraction-identifier", matcher);
	    if (recordingId) {
	        request.headers.set("x-recording-id", recordingId);
	    }
	    if (matcherBody) {
	        request.body = JSON.stringify({
	            compareBodies: matcherBody.compareBodies,
	            excludedHeaders: (_a = matcherBody.excludedHeaders) === null || _a === void 0 ? void 0 : _a.toString(),
	            ignoredHeaders: (_b = matcherBody.ignoredHeaders) === null || _b === void 0 ? void 0 : _b.toString(),
	            ignoreQueryOrdering: matcherBody.ignoreQueryOrdering,
	        });
	    }
	    const { status, bodyAsText } = await httpClient.sendRequest(request);
	    if (status < 200 || status > 299) {
	        throw new RecorderError(`setMatcher failed: ${bodyAsText}`, status);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * A collection of HttpHeaders that can be sent with a HTTP request.
	 */
	function getHeaderKey(headerName) {
	    return headerName.toLowerCase();
	}
	function isHttpHeadersLike(object) {
	    if (object && typeof object === "object") {
	        const castObject = object;
	        if (typeof castObject.rawHeaders === "function" &&
	            typeof castObject.clone === "function" &&
	            typeof castObject.get === "function" &&
	            typeof castObject.set === "function" &&
	            typeof castObject.contains === "function" &&
	            typeof castObject.remove === "function" &&
	            typeof castObject.headersArray === "function" &&
	            typeof castObject.headerValues === "function" &&
	            typeof castObject.headerNames === "function" &&
	            typeof castObject.toJson === "function") {
	            return true;
	        }
	    }
	    return false;
	}
	/**
	 * A collection of HTTP header key/value pairs.
	 */
	class HttpHeaders {
	    constructor(rawHeaders) {
	        this._headersMap = {};
	        if (rawHeaders) {
	            for (const headerName in rawHeaders) {
	                this.set(headerName, rawHeaders[headerName]);
	            }
	        }
	    }
	    /**
	     * Set a header in this collection with the provided name and value. The name is
	     * case-insensitive.
	     * @param headerName - The name of the header to set. This value is case-insensitive.
	     * @param headerValue - The value of the header to set.
	     */
	    set(headerName, headerValue) {
	        this._headersMap[getHeaderKey(headerName)] = {
	            name: headerName,
	            value: headerValue.toString(),
	        };
	    }
	    /**
	     * Get the header value for the provided header name, or undefined if no header exists in this
	     * collection with the provided name.
	     * @param headerName - The name of the header.
	     */
	    get(headerName) {
	        const header = this._headersMap[getHeaderKey(headerName)];
	        return !header ? undefined : header.value;
	    }
	    /**
	     * Get whether or not this header collection contains a header entry for the provided header name.
	     */
	    contains(headerName) {
	        return !!this._headersMap[getHeaderKey(headerName)];
	    }
	    /**
	     * Remove the header with the provided headerName. Return whether or not the header existed and
	     * was removed.
	     * @param headerName - The name of the header to remove.
	     */
	    remove(headerName) {
	        const result = this.contains(headerName);
	        delete this._headersMap[getHeaderKey(headerName)];
	        return result;
	    }
	    /**
	     * Get the headers that are contained this collection as an object.
	     */
	    rawHeaders() {
	        return this.toJson({ preserveCase: true });
	    }
	    /**
	     * Get the headers that are contained in this collection as an array.
	     */
	    headersArray() {
	        const headers = [];
	        for (const headerKey in this._headersMap) {
	            headers.push(this._headersMap[headerKey]);
	        }
	        return headers;
	    }
	    /**
	     * Get the header names that are contained in this collection.
	     */
	    headerNames() {
	        const headerNames = [];
	        const headers = this.headersArray();
	        for (let i = 0; i < headers.length; ++i) {
	            headerNames.push(headers[i].name);
	        }
	        return headerNames;
	    }
	    /**
	     * Get the header values that are contained in this collection.
	     */
	    headerValues() {
	        const headerValues = [];
	        const headers = this.headersArray();
	        for (let i = 0; i < headers.length; ++i) {
	            headerValues.push(headers[i].value);
	        }
	        return headerValues;
	    }
	    /**
	     * Get the JSON object representation of this HTTP header collection.
	     */
	    toJson(options = {}) {
	        const result = {};
	        if (options.preserveCase) {
	            for (const headerKey in this._headersMap) {
	                const header = this._headersMap[headerKey];
	                result[header.name] = header.value;
	            }
	        }
	        else {
	            for (const headerKey in this._headersMap) {
	                const header = this._headersMap[headerKey];
	                result[getHeaderKey(header.name)] = header.value;
	            }
	        }
	        return result;
	    }
	    /**
	     * Get the string representation of this HTTP header collection.
	     */
	    toString() {
	        return JSON.stringify(this.toJson({ preserveCase: true }));
	    }
	    /**
	     * Create a deep clone/copy of this HttpHeaders collection.
	     */
	    clone() {
	        const resultPreservingCasing = {};
	        for (const headerKey in this._headersMap) {
	            const header = this._headersMap[headerKey];
	            resultPreservingCasing[header.name] = header.value;
	        }
	        return new HttpHeaders(resultPreservingCasing);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Encodes a string in base64 format.
	 * @param value - The string to encode
	 */
	function encodeString(value) {
	    return btoa(value);
	}
	/**
	 * Encodes a byte array in base64 format.
	 * @param value - The Uint8Aray to encode
	 */
	function encodeByteArray(value) {
	    let str = "";
	    for (let i = 0; i < value.length; i++) {
	        str += String.fromCharCode(value[i]);
	    }
	    return btoa(str);
	}
	/**
	 * Decodes a base64 string into a byte array.
	 * @param value - The base64 string to decode
	 */
	function decodeString(value) {
	    const byteString = atob(value);
	    const arr = new Uint8Array(byteString.length);
	    for (let i = 0; i < byteString.length; i++) {
	        arr[i] = byteString.charCodeAt(i);
	    }
	    return arr;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * A set of constants used internally when processing requests.
	 */
	const Constants = {
	    /**
	     * The core-http version
	     */
	    coreHttpVersion: "2.2.7",
	    /**
	     * Specifies HTTP.
	     */
	    HTTP: "http:",
	    /**
	     * Specifies HTTPS.
	     */
	    HTTPS: "https:",
	    /**
	     * Specifies HTTP Proxy.
	     */
	    HTTP_PROXY: "HTTP_PROXY",
	    /**
	     * Specifies HTTPS Proxy.
	     */
	    HTTPS_PROXY: "HTTPS_PROXY",
	    /**
	     * Specifies NO Proxy.
	     */
	    NO_PROXY: "NO_PROXY",
	    /**
	     * Specifies ALL Proxy.
	     */
	    ALL_PROXY: "ALL_PROXY",
	    HttpConstants: {
	        /**
	         * Http Verbs
	         */
	        HttpVerbs: {
	            PUT: "PUT",
	            GET: "GET",
	            DELETE: "DELETE",
	            POST: "POST",
	            MERGE: "MERGE",
	            HEAD: "HEAD",
	            PATCH: "PATCH",
	        },
	        StatusCodes: {
	            TooManyRequests: 429,
	            ServiceUnavailable: 503,
	        },
	    },
	    /**
	     * Defines constants for use with HTTP headers.
	     */
	    HeaderConstants: {
	        /**
	         * The Authorization header.
	         */
	        AUTHORIZATION: "authorization",
	        AUTHORIZATION_SCHEME: "Bearer",
	        /**
	         * The Retry-After response-header field can be used with a 503 (Service
	         * Unavailable) or 349 (Too Many Requests) responses to indicate how long
	         * the service is expected to be unavailable to the requesting client.
	         */
	        RETRY_AFTER: "Retry-After",
	        /**
	         * The UserAgent header.
	         */
	        USER_AGENT: "User-Agent",
	    },
	};

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Default key used to access the XML attributes.
	 */
	const XML_ATTRKEY = "$";
	/**
	 * Default key used to access the XML value content.
	 */
	const XML_CHARKEY = "_";

	// Copyright (c) Microsoft Corporation.
	const validUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
	/**
	 * A constant that indicates whether the environment is node.js or browser based.
	 */
	const isNode = typeof process !== "undefined" &&
	    !!process.version &&
	    !!process.versions &&
	    !!process.versions.node;
	/**
	 * Checks if a parsed URL is HTTPS
	 *
	 * @param urlToCheck - The url to check
	 * @returns True if the URL is HTTPS; false otherwise.
	 */
	function urlIsHTTPS(urlToCheck) {
	    return urlToCheck.protocol.toLowerCase() === Constants.HTTPS;
	}
	/**
	 * Encodes an URI.
	 *
	 * @param uri - The URI to be encoded.
	 * @returns The encoded URI.
	 */
	function encodeUri(uri) {
	    return encodeURIComponent(uri)
	        .replace(/!/g, "%21")
	        .replace(/"/g, "%27")
	        .replace(/\(/g, "%28")
	        .replace(/\)/g, "%29")
	        .replace(/\*/g, "%2A");
	}
	/**
	 * Returns a stripped version of the Http Response which only contains body,
	 * headers and the status.
	 *
	 * @param response - The Http Response
	 * @returns The stripped version of Http Response.
	 */
	function stripResponse(response) {
	    const strippedResponse = {};
	    strippedResponse.body = response.bodyAsText;
	    strippedResponse.headers = response.headers;
	    strippedResponse.status = response.status;
	    return strippedResponse;
	}
	/**
	 * Returns a stripped version of the Http Request that does not contain the
	 * Authorization header.
	 *
	 * @param request - The Http Request object
	 * @returns The stripped version of Http Request.
	 */
	function stripRequest(request) {
	    const strippedRequest = request.clone();
	    if (strippedRequest.headers) {
	        strippedRequest.headers.remove("authorization");
	    }
	    return strippedRequest;
	}
	/**
	 * Validates the given uuid as a string
	 *
	 * @param uuid - The uuid as a string that needs to be validated
	 * @returns True if the uuid is valid; false otherwise.
	 */
	function isValidUuid(uuid) {
	    return validUuidRegex.test(uuid);
	}
	/**
	 * Generated UUID
	 *
	 * @returns RFC4122 v4 UUID.
	 */
	function generateUuid() {
	    return v4();
	}
	/**
	 * Executes an array of promises sequentially. Inspiration of this method is here:
	 * https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html. An awesome blog on promises!
	 *
	 * @param promiseFactories - An array of promise factories(A function that return a promise)
	 * @param kickstart - Input to the first promise that is used to kickstart the promise chain.
	 * If not provided then the promise chain starts with undefined.
	 * @returns A chain of resolved or rejected promises
	 */
	function executePromisesSequentially(promiseFactories, kickstart) {
	    let result = Promise.resolve(kickstart);
	    promiseFactories.forEach((promiseFactory) => {
	        result = result.then(promiseFactory);
	    });
	    return result;
	}
	/**
	 * Converts a Promise to a callback.
	 * @param promise - The Promise to be converted to a callback
	 * @returns A function that takes the callback `(cb: Function) => void`
	 * @deprecated generated code should instead depend on responseToBody
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	function promiseToCallback(promise) {
	    if (typeof promise.then !== "function") {
	        throw new Error("The provided input is not a Promise.");
	    }
	    // eslint-disable-next-line @typescript-eslint/ban-types
	    return (cb) => {
	        promise
	            .then((data) => {
	            // eslint-disable-next-line promise/no-callback-in-promise
	            return cb(undefined, data);
	        })
	            .catch((err) => {
	            // eslint-disable-next-line promise/no-callback-in-promise
	            cb(err);
	        });
	    };
	}
	/**
	 * Converts a Promise to a service callback.
	 * @param promise - The Promise of HttpOperationResponse to be converted to a service callback
	 * @returns A function that takes the service callback (cb: ServiceCallback<T>): void
	 */
	function promiseToServiceCallback(promise) {
	    if (typeof promise.then !== "function") {
	        throw new Error("The provided input is not a Promise.");
	    }
	    return (cb) => {
	        promise
	            .then((data) => {
	            return process.nextTick(cb, undefined, data.parsedBody, data.request, data);
	        })
	            .catch((err) => {
	            process.nextTick(cb, err);
	        });
	    };
	}
	function prepareXMLRootList(obj, elementName, xmlNamespaceKey, xmlNamespace) {
	    if (!Array.isArray(obj)) {
	        obj = [obj];
	    }
	    if (!xmlNamespaceKey || !xmlNamespace) {
	        return { [elementName]: obj };
	    }
	    const result = { [elementName]: obj };
	    result[XML_ATTRKEY] = { [xmlNamespaceKey]: xmlNamespace };
	    return result;
	}
	/**
	 * Applies the properties on the prototype of sourceCtors to the prototype of targetCtor
	 * @param targetCtor - The target object on which the properties need to be applied.
	 * @param sourceCtors - An array of source objects from which the properties need to be taken.
	 */
	function applyMixins(targetCtorParam, sourceCtors) {
	    const castTargetCtorParam = targetCtorParam;
	    sourceCtors.forEach((sourceCtor) => {
	        Object.getOwnPropertyNames(sourceCtor.prototype).forEach((name) => {
	            castTargetCtorParam.prototype[name] = sourceCtor.prototype[name];
	        });
	    });
	}
	const validateISODuration = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
	/**
	 * Indicates whether the given string is in ISO 8601 format.
	 * @param value - The value to be validated for ISO 8601 duration format.
	 * @returns `true` if valid, `false` otherwise.
	 */
	function isDuration(value) {
	    return validateISODuration.test(value);
	}
	/**
	 * Replace all of the instances of searchValue in value with the provided replaceValue.
	 * @param value - The value to search and replace in.
	 * @param searchValue - The value to search for in the value argument.
	 * @param replaceValue - The value to replace searchValue with in the value argument.
	 * @returns The value where each instance of searchValue was replaced with replacedValue.
	 */
	function replaceAll(value, searchValue, replaceValue) {
	    return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
	}
	/**
	 * Determines whether the given entity is a basic/primitive type
	 * (string, number, boolean, null, undefined).
	 * @param value - Any entity
	 * @returns true is it is primitive type, false otherwise.
	 */
	function isPrimitiveType(value) {
	    return (typeof value !== "object" && typeof value !== "function") || value === null;
	}
	function getEnvironmentValue(name) {
	    if (process.env[name]) {
	        return process.env[name];
	    }
	    else if (process.env[name.toLowerCase()]) {
	        return process.env[name.toLowerCase()];
	    }
	    return undefined;
	}
	/**
	 * @internal
	 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
	 */
	function isObject(input) {
	    return (typeof input === "object" &&
	        input !== null &&
	        !Array.isArray(input) &&
	        !(input instanceof RegExp) &&
	        !(input instanceof Date));
	}

	// Copyright (c) Microsoft Corporation.
	// This file contains utility code to serialize and deserialize network operations according to `OperationSpec` objects generated by AutoRest.TypeScript from OpenAPI specifications.
	/**
	 * Used to map raw response objects to final shapes.
	 * Helps packing and unpacking Dates and other encoded types that are not intrinsic to JSON.
	 * Also allows pulling values from headers, as well as inserting default values and constants.
	 */
	class Serializer {
	    constructor(
	    /**
	     * The provided model mapper.
	     */
	    modelMappers = {}, 
	    /**
	     * Whether the contents are XML or not.
	     */
	    isXML) {
	        this.modelMappers = modelMappers;
	        this.isXML = isXML;
	    }
	    /**
	     * Validates constraints, if any. This function will throw if the provided value does not respect those constraints.
	     * @param mapper - The definition of data models.
	     * @param value - The value.
	     * @param objectName - Name of the object. Used in the error messages.
	     * @deprecated Removing the constraints validation on client side.
	     */
	    validateConstraints(mapper, value, objectName) {
	        const failValidation = (constraintName, constraintValue) => {
	            throw new Error(`"${objectName}" with value "${value}" should satisfy the constraint "${constraintName}": ${constraintValue}.`);
	        };
	        if (mapper.constraints && value != undefined) {
	            const valueAsNumber = value;
	            const { ExclusiveMaximum, ExclusiveMinimum, InclusiveMaximum, InclusiveMinimum, MaxItems, MaxLength, MinItems, MinLength, MultipleOf, Pattern, UniqueItems, } = mapper.constraints;
	            if (ExclusiveMaximum != undefined && valueAsNumber >= ExclusiveMaximum) {
	                failValidation("ExclusiveMaximum", ExclusiveMaximum);
	            }
	            if (ExclusiveMinimum != undefined && valueAsNumber <= ExclusiveMinimum) {
	                failValidation("ExclusiveMinimum", ExclusiveMinimum);
	            }
	            if (InclusiveMaximum != undefined && valueAsNumber > InclusiveMaximum) {
	                failValidation("InclusiveMaximum", InclusiveMaximum);
	            }
	            if (InclusiveMinimum != undefined && valueAsNumber < InclusiveMinimum) {
	                failValidation("InclusiveMinimum", InclusiveMinimum);
	            }
	            const valueAsArray = value;
	            if (MaxItems != undefined && valueAsArray.length > MaxItems) {
	                failValidation("MaxItems", MaxItems);
	            }
	            if (MaxLength != undefined && valueAsArray.length > MaxLength) {
	                failValidation("MaxLength", MaxLength);
	            }
	            if (MinItems != undefined && valueAsArray.length < MinItems) {
	                failValidation("MinItems", MinItems);
	            }
	            if (MinLength != undefined && valueAsArray.length < MinLength) {
	                failValidation("MinLength", MinLength);
	            }
	            if (MultipleOf != undefined && valueAsNumber % MultipleOf !== 0) {
	                failValidation("MultipleOf", MultipleOf);
	            }
	            if (Pattern) {
	                const pattern = typeof Pattern === "string" ? new RegExp(Pattern) : Pattern;
	                if (typeof value !== "string" || value.match(pattern) === null) {
	                    failValidation("Pattern", Pattern);
	                }
	            }
	            if (UniqueItems &&
	                valueAsArray.some((item, i, ar) => ar.indexOf(item) !== i)) {
	                failValidation("UniqueItems", UniqueItems);
	            }
	        }
	    }
	    /**
	     * Serialize the given object based on its metadata defined in the mapper.
	     *
	     * @param mapper - The mapper which defines the metadata of the serializable object.
	     * @param object - A valid Javascript object to be serialized.
	     * @param objectName - Name of the serialized object.
	     * @param options - additional options to deserialization.
	     * @returns A valid serialized Javascript object.
	     */
	    serialize(mapper, object, objectName, options = {}) {
	        var _a, _b, _c;
	        const updatedOptions = {
	            rootName: (_a = options.rootName) !== null && _a !== void 0 ? _a : "",
	            includeRoot: (_b = options.includeRoot) !== null && _b !== void 0 ? _b : false,
	            xmlCharKey: (_c = options.xmlCharKey) !== null && _c !== void 0 ? _c : XML_CHARKEY,
	        };
	        let payload = {};
	        const mapperType = mapper.type.name;
	        if (!objectName) {
	            objectName = mapper.serializedName;
	        }
	        if (mapperType.match(/^Sequence$/i) !== null) {
	            payload = [];
	        }
	        if (mapper.isConstant) {
	            object = mapper.defaultValue;
	        }
	        // This table of allowed values should help explain
	        // the mapper.required and mapper.nullable properties.
	        // X means "neither undefined or null are allowed".
	        //           || required
	        //           || true      | false
	        //  nullable || ==========================
	        //      true || null      | undefined/null
	        //     false || X         | undefined
	        // undefined || X         | undefined/null
	        const { required, nullable } = mapper;
	        if (required && nullable && object === undefined) {
	            throw new Error(`${objectName} cannot be undefined.`);
	        }
	        if (required && !nullable && object == undefined) {
	            throw new Error(`${objectName} cannot be null or undefined.`);
	        }
	        if (!required && nullable === false && object === null) {
	            throw new Error(`${objectName} cannot be null.`);
	        }
	        if (object == undefined) {
	            payload = object;
	        }
	        else {
	            if (mapperType.match(/^any$/i) !== null) {
	                payload = object;
	            }
	            else if (mapperType.match(/^(Number|String|Boolean|Object|Stream|Uuid)$/i) !== null) {
	                payload = serializeBasicTypes(mapperType, objectName, object);
	            }
	            else if (mapperType.match(/^Enum$/i) !== null) {
	                const enumMapper = mapper;
	                payload = serializeEnumType(objectName, enumMapper.type.allowedValues, object);
	            }
	            else if (mapperType.match(/^(Date|DateTime|TimeSpan|DateTimeRfc1123|UnixTime)$/i) !== null) {
	                payload = serializeDateTypes(mapperType, object, objectName);
	            }
	            else if (mapperType.match(/^ByteArray$/i) !== null) {
	                payload = serializeByteArrayType(objectName, object);
	            }
	            else if (mapperType.match(/^Base64Url$/i) !== null) {
	                payload = serializeBase64UrlType(objectName, object);
	            }
	            else if (mapperType.match(/^Sequence$/i) !== null) {
	                payload = serializeSequenceType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
	            }
	            else if (mapperType.match(/^Dictionary$/i) !== null) {
	                payload = serializeDictionaryType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
	            }
	            else if (mapperType.match(/^Composite$/i) !== null) {
	                payload = serializeCompositeType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
	            }
	        }
	        return payload;
	    }
	    /**
	     * Deserialize the given object based on its metadata defined in the mapper.
	     *
	     * @param mapper - The mapper which defines the metadata of the serializable object.
	     * @param responseBody - A valid Javascript entity to be deserialized.
	     * @param objectName - Name of the deserialized object.
	     * @param options - Controls behavior of XML parser and builder.
	     * @returns A valid deserialized Javascript object.
	     */
	    deserialize(mapper, responseBody, objectName, options = {}) {
	        var _a, _b, _c;
	        const updatedOptions = {
	            rootName: (_a = options.rootName) !== null && _a !== void 0 ? _a : "",
	            includeRoot: (_b = options.includeRoot) !== null && _b !== void 0 ? _b : false,
	            xmlCharKey: (_c = options.xmlCharKey) !== null && _c !== void 0 ? _c : XML_CHARKEY,
	        };
	        if (responseBody == undefined) {
	            if (this.isXML && mapper.type.name === "Sequence" && !mapper.xmlIsWrapped) {
	                // Edge case for empty XML non-wrapped lists. xml2js can't distinguish
	                // between the list being empty versus being missing,
	                // so let's do the more user-friendly thing and return an empty list.
	                responseBody = [];
	            }
	            // specifically check for undefined as default value can be a falsey value `0, "", false, null`
	            if (mapper.defaultValue !== undefined) {
	                responseBody = mapper.defaultValue;
	            }
	            return responseBody;
	        }
	        let payload;
	        const mapperType = mapper.type.name;
	        if (!objectName) {
	            objectName = mapper.serializedName;
	        }
	        if (mapperType.match(/^Composite$/i) !== null) {
	            payload = deserializeCompositeType(this, mapper, responseBody, objectName, updatedOptions);
	        }
	        else {
	            if (this.isXML) {
	                const xmlCharKey = updatedOptions.xmlCharKey;
	                const castResponseBody = responseBody;
	                /**
	                 * If the mapper specifies this as a non-composite type value but the responseBody contains
	                 * both header ("$" i.e., XML_ATTRKEY) and body ("#" i.e., XML_CHARKEY) properties,
	                 * then just reduce the responseBody value to the body ("#" i.e., XML_CHARKEY) property.
	                 */
	                if (castResponseBody[XML_ATTRKEY] != undefined &&
	                    castResponseBody[xmlCharKey] != undefined) {
	                    responseBody = castResponseBody[xmlCharKey];
	                }
	            }
	            if (mapperType.match(/^Number$/i) !== null) {
	                payload = parseFloat(responseBody);
	                if (isNaN(payload)) {
	                    payload = responseBody;
	                }
	            }
	            else if (mapperType.match(/^Boolean$/i) !== null) {
	                if (responseBody === "true") {
	                    payload = true;
	                }
	                else if (responseBody === "false") {
	                    payload = false;
	                }
	                else {
	                    payload = responseBody;
	                }
	            }
	            else if (mapperType.match(/^(String|Enum|Object|Stream|Uuid|TimeSpan|any)$/i) !== null) {
	                payload = responseBody;
	            }
	            else if (mapperType.match(/^(Date|DateTime|DateTimeRfc1123)$/i) !== null) {
	                payload = new Date(responseBody);
	            }
	            else if (mapperType.match(/^UnixTime$/i) !== null) {
	                payload = unixTimeToDate(responseBody);
	            }
	            else if (mapperType.match(/^ByteArray$/i) !== null) {
	                payload = decodeString(responseBody);
	            }
	            else if (mapperType.match(/^Base64Url$/i) !== null) {
	                payload = base64UrlToByteArray(responseBody);
	            }
	            else if (mapperType.match(/^Sequence$/i) !== null) {
	                payload = deserializeSequenceType(this, mapper, responseBody, objectName, updatedOptions);
	            }
	            else if (mapperType.match(/^Dictionary$/i) !== null) {
	                payload = deserializeDictionaryType(this, mapper, responseBody, objectName, updatedOptions);
	            }
	        }
	        if (mapper.isConstant) {
	            payload = mapper.defaultValue;
	        }
	        return payload;
	    }
	}
	function trimEnd(str, ch) {
	    let len = str.length;
	    while (len - 1 >= 0 && str[len - 1] === ch) {
	        --len;
	    }
	    return str.substr(0, len);
	}
	function bufferToBase64Url(buffer) {
	    if (!buffer) {
	        return undefined;
	    }
	    if (!(buffer instanceof Uint8Array)) {
	        throw new Error(`Please provide an input of type Uint8Array for converting to Base64Url.`);
	    }
	    // Uint8Array to Base64.
	    const str = encodeByteArray(buffer);
	    // Base64 to Base64Url.
	    return trimEnd(str, "=").replace(/\+/g, "-").replace(/\//g, "_");
	}
	function base64UrlToByteArray(str) {
	    if (!str) {
	        return undefined;
	    }
	    if (str && typeof str.valueOf() !== "string") {
	        throw new Error("Please provide an input of type string for converting to Uint8Array");
	    }
	    // Base64Url to Base64.
	    str = str.replace(/-/g, "+").replace(/_/g, "/");
	    // Base64 to Uint8Array.
	    return decodeString(str);
	}
	function splitSerializeName(prop) {
	    const classes = [];
	    let partialclass = "";
	    if (prop) {
	        const subwords = prop.split(".");
	        for (const item of subwords) {
	            if (item.charAt(item.length - 1) === "\\") {
	                partialclass += item.substr(0, item.length - 1) + ".";
	            }
	            else {
	                partialclass += item;
	                classes.push(partialclass);
	                partialclass = "";
	            }
	        }
	    }
	    return classes;
	}
	function dateToUnixTime(d) {
	    if (!d) {
	        return undefined;
	    }
	    if (typeof d.valueOf() === "string") {
	        d = new Date(d);
	    }
	    return Math.floor(d.getTime() / 1000);
	}
	function unixTimeToDate(n) {
	    if (!n) {
	        return undefined;
	    }
	    return new Date(n * 1000);
	}
	function serializeBasicTypes(typeName, objectName, value) {
	    if (value !== null && value !== undefined) {
	        if (typeName.match(/^Number$/i) !== null) {
	            if (typeof value !== "number") {
	                throw new Error(`${objectName} with value ${value} must be of type number.`);
	            }
	        }
	        else if (typeName.match(/^String$/i) !== null) {
	            if (typeof value.valueOf() !== "string") {
	                throw new Error(`${objectName} with value "${value}" must be of type string.`);
	            }
	        }
	        else if (typeName.match(/^Uuid$/i) !== null) {
	            if (!(typeof value.valueOf() === "string" && isValidUuid(value))) {
	                throw new Error(`${objectName} with value "${value}" must be of type string and a valid uuid.`);
	            }
	        }
	        else if (typeName.match(/^Boolean$/i) !== null) {
	            if (typeof value !== "boolean") {
	                throw new Error(`${objectName} with value ${value} must be of type boolean.`);
	            }
	        }
	        else if (typeName.match(/^Stream$/i) !== null) {
	            const objectType = typeof value;
	            if (objectType !== "string" &&
	                objectType !== "function" &&
	                !(value instanceof ArrayBuffer) &&
	                !ArrayBuffer.isView(value) &&
	                !((typeof Blob === "function" || typeof Blob === "object") && value instanceof Blob)) {
	                throw new Error(`${objectName} must be a string, Blob, ArrayBuffer, ArrayBufferView, or a function returning NodeJS.ReadableStream.`);
	            }
	        }
	    }
	    return value;
	}
	function serializeEnumType(objectName, allowedValues, value) {
	    if (!allowedValues) {
	        throw new Error(`Please provide a set of allowedValues to validate ${objectName} as an Enum Type.`);
	    }
	    const isPresent = allowedValues.some((item) => {
	        if (typeof item.valueOf() === "string") {
	            return item.toLowerCase() === value.toLowerCase();
	        }
	        return item === value;
	    });
	    if (!isPresent) {
	        throw new Error(`${value} is not a valid value for ${objectName}. The valid values are: ${JSON.stringify(allowedValues)}.`);
	    }
	    return value;
	}
	function serializeByteArrayType(objectName, value) {
	    let returnValue = "";
	    if (value != undefined) {
	        if (!(value instanceof Uint8Array)) {
	            throw new Error(`${objectName} must be of type Uint8Array.`);
	        }
	        returnValue = encodeByteArray(value);
	    }
	    return returnValue;
	}
	function serializeBase64UrlType(objectName, value) {
	    let returnValue = "";
	    if (value != undefined) {
	        if (!(value instanceof Uint8Array)) {
	            throw new Error(`${objectName} must be of type Uint8Array.`);
	        }
	        returnValue = bufferToBase64Url(value) || "";
	    }
	    return returnValue;
	}
	function serializeDateTypes(typeName, value, objectName) {
	    if (value != undefined) {
	        if (typeName.match(/^Date$/i) !== null) {
	            if (!(value instanceof Date ||
	                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
	                throw new Error(`${objectName} must be an instanceof Date or a string in ISO8601 format.`);
	            }
	            value =
	                value instanceof Date
	                    ? value.toISOString().substring(0, 10)
	                    : new Date(value).toISOString().substring(0, 10);
	        }
	        else if (typeName.match(/^DateTime$/i) !== null) {
	            if (!(value instanceof Date ||
	                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
	                throw new Error(`${objectName} must be an instanceof Date or a string in ISO8601 format.`);
	            }
	            value = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
	        }
	        else if (typeName.match(/^DateTimeRfc1123$/i) !== null) {
	            if (!(value instanceof Date ||
	                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
	                throw new Error(`${objectName} must be an instanceof Date or a string in RFC-1123 format.`);
	            }
	            value = value instanceof Date ? value.toUTCString() : new Date(value).toUTCString();
	        }
	        else if (typeName.match(/^UnixTime$/i) !== null) {
	            if (!(value instanceof Date ||
	                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
	                throw new Error(`${objectName} must be an instanceof Date or a string in RFC-1123/ISO8601 format ` +
	                    `for it to be serialized in UnixTime/Epoch format.`);
	            }
	            value = dateToUnixTime(value);
	        }
	        else if (typeName.match(/^TimeSpan$/i) !== null) {
	            if (!isDuration(value)) {
	                throw new Error(`${objectName} must be a string in ISO 8601 format. Instead was "${value}".`);
	            }
	        }
	    }
	    return value;
	}
	function serializeSequenceType(serializer, mapper, object, objectName, isXml, options) {
	    if (!Array.isArray(object)) {
	        throw new Error(`${objectName} must be of type Array.`);
	    }
	    const elementType = mapper.type.element;
	    if (!elementType || typeof elementType !== "object") {
	        throw new Error(`element" metadata for an Array must be defined in the ` +
	            `mapper and it must of type "object" in ${objectName}.`);
	    }
	    const tempArray = [];
	    for (let i = 0; i < object.length; i++) {
	        const serializedValue = serializer.serialize(elementType, object[i], objectName, options);
	        if (isXml && elementType.xmlNamespace) {
	            const xmlnsKey = elementType.xmlNamespacePrefix
	                ? `xmlns:${elementType.xmlNamespacePrefix}`
	                : "xmlns";
	            if (elementType.type.name === "Composite") {
	                tempArray[i] = Object.assign({}, serializedValue);
	                tempArray[i][XML_ATTRKEY] = { [xmlnsKey]: elementType.xmlNamespace };
	            }
	            else {
	                tempArray[i] = {};
	                tempArray[i][options.xmlCharKey] = serializedValue;
	                tempArray[i][XML_ATTRKEY] = { [xmlnsKey]: elementType.xmlNamespace };
	            }
	        }
	        else {
	            tempArray[i] = serializedValue;
	        }
	    }
	    return tempArray;
	}
	function serializeDictionaryType(serializer, mapper, object, objectName, isXml, options) {
	    if (typeof object !== "object") {
	        throw new Error(`${objectName} must be of type object.`);
	    }
	    const valueType = mapper.type.value;
	    if (!valueType || typeof valueType !== "object") {
	        throw new Error(`"value" metadata for a Dictionary must be defined in the ` +
	            `mapper and it must of type "object" in ${objectName}.`);
	    }
	    const tempDictionary = {};
	    for (const key of Object.keys(object)) {
	        const serializedValue = serializer.serialize(valueType, object[key], objectName, options);
	        // If the element needs an XML namespace we need to add it within the $ property
	        tempDictionary[key] = getXmlObjectValue(valueType, serializedValue, isXml, options);
	    }
	    // Add the namespace to the root element if needed
	    if (isXml && mapper.xmlNamespace) {
	        const xmlnsKey = mapper.xmlNamespacePrefix ? `xmlns:${mapper.xmlNamespacePrefix}` : "xmlns";
	        const result = tempDictionary;
	        result[XML_ATTRKEY] = { [xmlnsKey]: mapper.xmlNamespace };
	        return result;
	    }
	    return tempDictionary;
	}
	/**
	 * Resolves the additionalProperties property from a referenced mapper.
	 * @param serializer - The serializer containing the entire set of mappers.
	 * @param mapper - The composite mapper to resolve.
	 * @param objectName - Name of the object being serialized.
	 */
	function resolveAdditionalProperties(serializer, mapper, objectName) {
	    const additionalProperties = mapper.type.additionalProperties;
	    if (!additionalProperties && mapper.type.className) {
	        const modelMapper = resolveReferencedMapper(serializer, mapper, objectName);
	        return modelMapper === null || modelMapper === void 0 ? void 0 : modelMapper.type.additionalProperties;
	    }
	    return additionalProperties;
	}
	/**
	 * Finds the mapper referenced by `className`.
	 * @param serializer - The serializer containing the entire set of mappers
	 * @param mapper - The composite mapper to resolve
	 * @param objectName - Name of the object being serialized
	 */
	function resolveReferencedMapper(serializer, mapper, objectName) {
	    const className = mapper.type.className;
	    if (!className) {
	        throw new Error(`Class name for model "${objectName}" is not provided in the mapper "${JSON.stringify(mapper, undefined, 2)}".`);
	    }
	    return serializer.modelMappers[className];
	}
	/**
	 * Resolves a composite mapper's modelProperties.
	 * @param serializer - The serializer containing the entire set of mappers
	 * @param mapper - The composite mapper to resolve
	 */
	function resolveModelProperties(serializer, mapper, objectName) {
	    let modelProps = mapper.type.modelProperties;
	    if (!modelProps) {
	        const modelMapper = resolveReferencedMapper(serializer, mapper, objectName);
	        if (!modelMapper) {
	            throw new Error(`mapper() cannot be null or undefined for model "${mapper.type.className}".`);
	        }
	        modelProps = modelMapper === null || modelMapper === void 0 ? void 0 : modelMapper.type.modelProperties;
	        if (!modelProps) {
	            throw new Error(`modelProperties cannot be null or undefined in the ` +
	                `mapper "${JSON.stringify(modelMapper)}" of type "${mapper.type.className}" for object "${objectName}".`);
	        }
	    }
	    return modelProps;
	}
	function serializeCompositeType(serializer, mapper, object, objectName, isXml, options) {
	    if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
	        mapper = getPolymorphicMapper(serializer, mapper, object, "clientName");
	    }
	    if (object != undefined) {
	        const payload = {};
	        const modelProps = resolveModelProperties(serializer, mapper, objectName);
	        for (const key of Object.keys(modelProps)) {
	            const propertyMapper = modelProps[key];
	            if (propertyMapper.readOnly) {
	                continue;
	            }
	            let propName;
	            let parentObject = payload;
	            if (serializer.isXML) {
	                if (propertyMapper.xmlIsWrapped) {
	                    propName = propertyMapper.xmlName;
	                }
	                else {
	                    propName = propertyMapper.xmlElementName || propertyMapper.xmlName;
	                }
	            }
	            else {
	                const paths = splitSerializeName(propertyMapper.serializedName);
	                propName = paths.pop();
	                for (const pathName of paths) {
	                    const childObject = parentObject[pathName];
	                    if (childObject == undefined &&
	                        (object[key] != undefined || propertyMapper.defaultValue !== undefined)) {
	                        parentObject[pathName] = {};
	                    }
	                    parentObject = parentObject[pathName];
	                }
	            }
	            if (parentObject != undefined) {
	                if (isXml && mapper.xmlNamespace) {
	                    const xmlnsKey = mapper.xmlNamespacePrefix
	                        ? `xmlns:${mapper.xmlNamespacePrefix}`
	                        : "xmlns";
	                    parentObject[XML_ATTRKEY] = Object.assign(Object.assign({}, parentObject[XML_ATTRKEY]), { [xmlnsKey]: mapper.xmlNamespace });
	                }
	                const propertyObjectName = propertyMapper.serializedName !== ""
	                    ? objectName + "." + propertyMapper.serializedName
	                    : objectName;
	                let toSerialize = object[key];
	                const polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
	                if (polymorphicDiscriminator &&
	                    polymorphicDiscriminator.clientName === key &&
	                    toSerialize == undefined) {
	                    toSerialize = mapper.serializedName;
	                }
	                const serializedValue = serializer.serialize(propertyMapper, toSerialize, propertyObjectName, options);
	                if (serializedValue !== undefined && propName != undefined) {
	                    const value = getXmlObjectValue(propertyMapper, serializedValue, isXml, options);
	                    if (isXml && propertyMapper.xmlIsAttribute) {
	                        // XML_ATTRKEY, i.e., $ is the key attributes are kept under in xml2js.
	                        // This keeps things simple while preventing name collision
	                        // with names in user documents.
	                        parentObject[XML_ATTRKEY] = parentObject[XML_ATTRKEY] || {};
	                        parentObject[XML_ATTRKEY][propName] = serializedValue;
	                    }
	                    else if (isXml && propertyMapper.xmlIsWrapped) {
	                        parentObject[propName] = { [propertyMapper.xmlElementName]: value };
	                    }
	                    else {
	                        parentObject[propName] = value;
	                    }
	                }
	            }
	        }
	        const additionalPropertiesMapper = resolveAdditionalProperties(serializer, mapper, objectName);
	        if (additionalPropertiesMapper) {
	            const propNames = Object.keys(modelProps);
	            for (const clientPropName in object) {
	                const isAdditionalProperty = propNames.every((pn) => pn !== clientPropName);
	                if (isAdditionalProperty) {
	                    payload[clientPropName] = serializer.serialize(additionalPropertiesMapper, object[clientPropName], objectName + '["' + clientPropName + '"]', options);
	                }
	            }
	        }
	        return payload;
	    }
	    return object;
	}
	function getXmlObjectValue(propertyMapper, serializedValue, isXml, options) {
	    if (!isXml || !propertyMapper.xmlNamespace) {
	        return serializedValue;
	    }
	    const xmlnsKey = propertyMapper.xmlNamespacePrefix
	        ? `xmlns:${propertyMapper.xmlNamespacePrefix}`
	        : "xmlns";
	    const xmlNamespace = { [xmlnsKey]: propertyMapper.xmlNamespace };
	    if (["Composite"].includes(propertyMapper.type.name)) {
	        if (serializedValue[XML_ATTRKEY]) {
	            return serializedValue;
	        }
	        else {
	            const result = Object.assign({}, serializedValue);
	            result[XML_ATTRKEY] = xmlNamespace;
	            return result;
	        }
	    }
	    const result = {};
	    result[options.xmlCharKey] = serializedValue;
	    result[XML_ATTRKEY] = xmlNamespace;
	    return result;
	}
	function isSpecialXmlProperty(propertyName, options) {
	    return [XML_ATTRKEY, options.xmlCharKey].includes(propertyName);
	}
	function deserializeCompositeType(serializer, mapper, responseBody, objectName, options) {
	    var _a;
	    if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
	        mapper = getPolymorphicMapper(serializer, mapper, responseBody, "serializedName");
	    }
	    const modelProps = resolveModelProperties(serializer, mapper, objectName);
	    let instance = {};
	    const handledPropertyNames = [];
	    for (const key of Object.keys(modelProps)) {
	        const propertyMapper = modelProps[key];
	        const paths = splitSerializeName(modelProps[key].serializedName);
	        handledPropertyNames.push(paths[0]);
	        const { serializedName, xmlName, xmlElementName } = propertyMapper;
	        let propertyObjectName = objectName;
	        if (serializedName !== "" && serializedName !== undefined) {
	            propertyObjectName = objectName + "." + serializedName;
	        }
	        const headerCollectionPrefix = propertyMapper.headerCollectionPrefix;
	        if (headerCollectionPrefix) {
	            const dictionary = {};
	            for (const headerKey of Object.keys(responseBody)) {
	                if (headerKey.startsWith(headerCollectionPrefix)) {
	                    dictionary[headerKey.substring(headerCollectionPrefix.length)] = serializer.deserialize(propertyMapper.type.value, responseBody[headerKey], propertyObjectName, options);
	                }
	                handledPropertyNames.push(headerKey);
	            }
	            instance[key] = dictionary;
	        }
	        else if (serializer.isXML) {
	            if (propertyMapper.xmlIsAttribute && responseBody[XML_ATTRKEY]) {
	                instance[key] = serializer.deserialize(propertyMapper, responseBody[XML_ATTRKEY][xmlName], propertyObjectName, options);
	            }
	            else {
	                const propertyName = xmlElementName || xmlName || serializedName;
	                if (propertyMapper.xmlIsWrapped) {
	                    /* a list of <xmlElementName> wrapped by <xmlName>
	                      For the xml example below
	                        <Cors>
	                          <CorsRule>...</CorsRule>
	                          <CorsRule>...</CorsRule>
	                        </Cors>
	                      the responseBody has
	                        {
	                          Cors: {
	                            CorsRule: [{...}, {...}]
	                          }
	                        }
	                      xmlName is "Cors" and xmlElementName is"CorsRule".
	                    */
	                    const wrapped = responseBody[xmlName];
	                    const elementList = (_a = wrapped === null || wrapped === void 0 ? void 0 : wrapped[xmlElementName]) !== null && _a !== void 0 ? _a : [];
	                    instance[key] = serializer.deserialize(propertyMapper, elementList, propertyObjectName, options);
	                }
	                else {
	                    const property = responseBody[propertyName];
	                    instance[key] = serializer.deserialize(propertyMapper, property, propertyObjectName, options);
	                }
	            }
	        }
	        else {
	            // deserialize the property if it is present in the provided responseBody instance
	            let propertyInstance;
	            let res = responseBody;
	            // traversing the object step by step.
	            for (const item of paths) {
	                if (!res)
	                    break;
	                res = res[item];
	            }
	            propertyInstance = res;
	            const polymorphicDiscriminator = mapper.type.polymorphicDiscriminator;
	            // checking that the model property name (key)(ex: "fishtype") and the
	            // clientName of the polymorphicDiscriminator {metadata} (ex: "fishtype")
	            // instead of the serializedName of the polymorphicDiscriminator (ex: "fish.type")
	            // is a better approach. The generator is not consistent with escaping '\.' in the
	            // serializedName of the property (ex: "fish\.type") that is marked as polymorphic discriminator
	            // and the serializedName of the metadata polymorphicDiscriminator (ex: "fish.type"). However,
	            // the clientName transformation of the polymorphicDiscriminator (ex: "fishtype") and
	            // the transformation of model property name (ex: "fishtype") is done consistently.
	            // Hence, it is a safer bet to rely on the clientName of the polymorphicDiscriminator.
	            if (polymorphicDiscriminator &&
	                key === polymorphicDiscriminator.clientName &&
	                propertyInstance == undefined) {
	                propertyInstance = mapper.serializedName;
	            }
	            let serializedValue;
	            // paging
	            if (Array.isArray(responseBody[key]) && modelProps[key].serializedName === "") {
	                propertyInstance = responseBody[key];
	                const arrayInstance = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName, options);
	                // Copy over any properties that have already been added into the instance, where they do
	                // not exist on the newly de-serialized array
	                for (const [k, v] of Object.entries(instance)) {
	                    if (!Object.prototype.hasOwnProperty.call(arrayInstance, k)) {
	                        arrayInstance[k] = v;
	                    }
	                }
	                instance = arrayInstance;
	            }
	            else if (propertyInstance !== undefined || propertyMapper.defaultValue !== undefined) {
	                serializedValue = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName, options);
	                instance[key] = serializedValue;
	            }
	        }
	    }
	    const additionalPropertiesMapper = mapper.type.additionalProperties;
	    if (additionalPropertiesMapper) {
	        const isAdditionalProperty = (responsePropName) => {
	            for (const clientPropName in modelProps) {
	                const paths = splitSerializeName(modelProps[clientPropName].serializedName);
	                if (paths[0] === responsePropName) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        for (const responsePropName in responseBody) {
	            if (isAdditionalProperty(responsePropName)) {
	                instance[responsePropName] = serializer.deserialize(additionalPropertiesMapper, responseBody[responsePropName], objectName + '["' + responsePropName + '"]', options);
	            }
	        }
	    }
	    else if (responseBody) {
	        for (const key of Object.keys(responseBody)) {
	            if (instance[key] === undefined &&
	                !handledPropertyNames.includes(key) &&
	                !isSpecialXmlProperty(key, options)) {
	                instance[key] = responseBody[key];
	            }
	        }
	    }
	    return instance;
	}
	function deserializeDictionaryType(serializer, mapper, responseBody, objectName, options) {
	    const value = mapper.type.value;
	    if (!value || typeof value !== "object") {
	        throw new Error(`"value" metadata for a Dictionary must be defined in the ` +
	            `mapper and it must of type "object" in ${objectName}`);
	    }
	    if (responseBody) {
	        const tempDictionary = {};
	        for (const key of Object.keys(responseBody)) {
	            tempDictionary[key] = serializer.deserialize(value, responseBody[key], objectName, options);
	        }
	        return tempDictionary;
	    }
	    return responseBody;
	}
	function deserializeSequenceType(serializer, mapper, responseBody, objectName, options) {
	    const element = mapper.type.element;
	    if (!element || typeof element !== "object") {
	        throw new Error(`element" metadata for an Array must be defined in the ` +
	            `mapper and it must of type "object" in ${objectName}`);
	    }
	    if (responseBody) {
	        if (!Array.isArray(responseBody)) {
	            // xml2js will interpret a single element array as just the element, so force it to be an array
	            responseBody = [responseBody];
	        }
	        const tempArray = [];
	        for (let i = 0; i < responseBody.length; i++) {
	            tempArray[i] = serializer.deserialize(element, responseBody[i], `${objectName}[${i}]`, options);
	        }
	        return tempArray;
	    }
	    return responseBody;
	}
	function getPolymorphicMapper(serializer, mapper, object, polymorphicPropertyName) {
	    const polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
	    if (polymorphicDiscriminator) {
	        const discriminatorName = polymorphicDiscriminator[polymorphicPropertyName];
	        if (discriminatorName != undefined) {
	            const discriminatorValue = object[discriminatorName];
	            if (discriminatorValue != undefined) {
	                const typeName = mapper.type.uberParent || mapper.type.className;
	                const indexDiscriminator = discriminatorValue === typeName
	                    ? discriminatorValue
	                    : typeName + "." + discriminatorValue;
	                const polymorphicMapper = serializer.modelMappers.discriminators[indexDiscriminator];
	                if (polymorphicMapper) {
	                    mapper = polymorphicMapper;
	                }
	            }
	        }
	    }
	    return mapper;
	}
	function getPolymorphicDiscriminatorRecursively(serializer, mapper) {
	    return (mapper.type.polymorphicDiscriminator ||
	        getPolymorphicDiscriminatorSafely(serializer, mapper.type.uberParent) ||
	        getPolymorphicDiscriminatorSafely(serializer, mapper.type.className));
	}
	function getPolymorphicDiscriminatorSafely(serializer, typeName) {
	    return (typeName &&
	        serializer.modelMappers[typeName] &&
	        serializer.modelMappers[typeName].type.polymorphicDiscriminator);
	}
	/**
	 * Utility function that serializes an object that might contain binary information into a plain object, array or a string.
	 */
	function serializeObject(toSerialize) {
	    const castToSerialize = toSerialize;
	    if (toSerialize == undefined)
	        return undefined;
	    if (toSerialize instanceof Uint8Array) {
	        toSerialize = encodeByteArray(toSerialize);
	        return toSerialize;
	    }
	    else if (toSerialize instanceof Date) {
	        return toSerialize.toISOString();
	    }
	    else if (Array.isArray(toSerialize)) {
	        const array = [];
	        for (let i = 0; i < toSerialize.length; i++) {
	            array.push(serializeObject(toSerialize[i]));
	        }
	        return array;
	    }
	    else if (typeof toSerialize === "object") {
	        const dictionary = {};
	        for (const property in toSerialize) {
	            dictionary[property] = serializeObject(castToSerialize[property]);
	        }
	        return dictionary;
	    }
	    return toSerialize;
	}
	/**
	 * Utility function to create a K:V from a list of strings
	 */
	function strEnum(o) {
	    const result = {};
	    for (const key of o) {
	        result[key] = key;
	    }
	    return result;
	}
	/**
	 * String enum containing the string types of property mappers.
	 */
	// eslint-disable-next-line @typescript-eslint/no-redeclare
	const MapperType = strEnum([
	    "Base64Url",
	    "Boolean",
	    "ByteArray",
	    "Composite",
	    "Date",
	    "DateTime",
	    "DateTimeRfc1123",
	    "Dictionary",
	    "Enum",
	    "Number",
	    "Object",
	    "Sequence",
	    "String",
	    "Stream",
	    "TimeSpan",
	    "UnixTime",
	]);

	// Copyright (c) Microsoft Corporation.
	function isWebResourceLike(object) {
	    if (object && typeof object === "object") {
	        const castObject = object;
	        if (typeof castObject.url === "string" &&
	            typeof castObject.method === "string" &&
	            typeof castObject.headers === "object" &&
	            isHttpHeadersLike(castObject.headers) &&
	            typeof castObject.validateRequestProperties === "function" &&
	            typeof castObject.prepare === "function" &&
	            typeof castObject.clone === "function") {
	            return true;
	        }
	    }
	    return false;
	}
	/**
	 * Creates a new WebResource object.
	 *
	 * This class provides an abstraction over a REST call by being library / implementation agnostic and wrapping the necessary
	 * properties to initiate a request.
	 */
	class WebResource {
	    constructor(url, method, body, query, headers, streamResponseBody, withCredentials, abortSignal, timeout, onUploadProgress, onDownloadProgress, proxySettings, keepAlive, decompressResponse, streamResponseStatusCodes) {
	        this.streamResponseBody = streamResponseBody;
	        this.streamResponseStatusCodes = streamResponseStatusCodes;
	        this.url = url || "";
	        this.method = method || "GET";
	        this.headers = isHttpHeadersLike(headers) ? headers : new HttpHeaders(headers);
	        this.body = body;
	        this.query = query;
	        this.formData = undefined;
	        this.withCredentials = withCredentials || false;
	        this.abortSignal = abortSignal;
	        this.timeout = timeout || 0;
	        this.onUploadProgress = onUploadProgress;
	        this.onDownloadProgress = onDownloadProgress;
	        this.proxySettings = proxySettings;
	        this.keepAlive = keepAlive;
	        this.decompressResponse = decompressResponse;
	        this.requestId = this.headers.get("x-ms-client-request-id") || generateUuid();
	    }
	    /**
	     * Validates that the required properties such as method, url, headers["Content-Type"],
	     * headers["accept-language"] are defined. It will throw an error if one of the above
	     * mentioned properties are not defined.
	     */
	    validateRequestProperties() {
	        if (!this.method) {
	            throw new Error("WebResource.method is required.");
	        }
	        if (!this.url) {
	            throw new Error("WebResource.url is required.");
	        }
	    }
	    /**
	     * Prepares the request.
	     * @param options - Options to provide for preparing the request.
	     * @returns Returns the prepared WebResource (HTTP Request) object that needs to be given to the request pipeline.
	     */
	    prepare(options) {
	        if (!options) {
	            throw new Error("options object is required");
	        }
	        if (options.method === undefined ||
	            options.method === null ||
	            typeof options.method.valueOf() !== "string") {
	            throw new Error("options.method must be a string.");
	        }
	        if (options.url && options.pathTemplate) {
	            throw new Error("options.url and options.pathTemplate are mutually exclusive. Please provide exactly one of them.");
	        }
	        if ((options.pathTemplate === undefined ||
	            options.pathTemplate === null ||
	            typeof options.pathTemplate.valueOf() !== "string") &&
	            (options.url === undefined ||
	                options.url === null ||
	                typeof options.url.valueOf() !== "string")) {
	            throw new Error("Please provide exactly one of options.pathTemplate or options.url.");
	        }
	        // set the url if it is provided.
	        if (options.url) {
	            if (typeof options.url !== "string") {
	                throw new Error('options.url must be of type "string".');
	            }
	            this.url = options.url;
	        }
	        // set the method
	        if (options.method) {
	            const validMethods = ["GET", "PUT", "HEAD", "DELETE", "OPTIONS", "POST", "PATCH", "TRACE"];
	            if (validMethods.indexOf(options.method.toUpperCase()) === -1) {
	                throw new Error('The provided method "' +
	                    options.method +
	                    '" is invalid. Supported HTTP methods are: ' +
	                    JSON.stringify(validMethods));
	            }
	        }
	        this.method = options.method.toUpperCase();
	        // construct the url if path template is provided
	        if (options.pathTemplate) {
	            const { pathTemplate, pathParameters } = options;
	            if (typeof pathTemplate !== "string") {
	                throw new Error('options.pathTemplate must be of type "string".');
	            }
	            if (!options.baseUrl) {
	                options.baseUrl = "https://management.azure.com";
	            }
	            const baseUrl = options.baseUrl;
	            let url = baseUrl +
	                (baseUrl.endsWith("/") ? "" : "/") +
	                (pathTemplate.startsWith("/") ? pathTemplate.slice(1) : pathTemplate);
	            const segments = url.match(/({[\w-]*\s*[\w-]*})/gi);
	            if (segments && segments.length) {
	                if (!pathParameters) {
	                    throw new Error(`pathTemplate: ${pathTemplate} has been provided. Hence, options.pathParameters must also be provided.`);
	                }
	                segments.forEach(function (item) {
	                    const pathParamName = item.slice(1, -1);
	                    const pathParam = pathParameters[pathParamName];
	                    if (pathParam === null ||
	                        pathParam === undefined ||
	                        !(typeof pathParam === "string" || typeof pathParam === "object")) {
	                        const stringifiedPathParameters = JSON.stringify(pathParameters, undefined, 2);
	                        throw new Error(`pathTemplate: ${pathTemplate} contains the path parameter ${pathParamName}` +
	                            ` however, it is not present in parameters: ${stringifiedPathParameters}.` +
	                            `The value of the path parameter can either be a "string" of the form { ${pathParamName}: "some sample value" } or ` +
	                            `it can be an "object" of the form { "${pathParamName}": { value: "some sample value", skipUrlEncoding: true } }.`);
	                    }
	                    if (typeof pathParam.valueOf() === "string") {
	                        url = url.replace(item, encodeURIComponent(pathParam));
	                    }
	                    if (typeof pathParam.valueOf() === "object") {
	                        if (!pathParam.value) {
	                            throw new Error(`options.pathParameters[${pathParamName}] is of type "object" but it does not contain a "value" property.`);
	                        }
	                        if (pathParam.skipUrlEncoding) {
	                            url = url.replace(item, pathParam.value);
	                        }
	                        else {
	                            url = url.replace(item, encodeURIComponent(pathParam.value));
	                        }
	                    }
	                });
	            }
	            this.url = url;
	        }
	        // append query parameters to the url if they are provided. They can be provided with pathTemplate or url option.
	        if (options.queryParameters) {
	            const queryParameters = options.queryParameters;
	            if (typeof queryParameters !== "object") {
	                throw new Error(`options.queryParameters must be of type object. It should be a JSON object ` +
	                    `of "query-parameter-name" as the key and the "query-parameter-value" as the value. ` +
	                    `The "query-parameter-value" may be fo type "string" or an "object" of the form { value: "query-parameter-value", skipUrlEncoding: true }.`);
	            }
	            // append question mark if it is not present in the url
	            if (this.url && this.url.indexOf("?") === -1) {
	                this.url += "?";
	            }
	            // construct queryString
	            const queryParams = [];
	            // We need to populate this.query as a dictionary if the request is being used for Sway's validateRequest().
	            this.query = {};
	            for (const queryParamName in queryParameters) {
	                const queryParam = queryParameters[queryParamName];
	                if (queryParam) {
	                    if (typeof queryParam === "string") {
	                        queryParams.push(queryParamName + "=" + encodeURIComponent(queryParam));
	                        this.query[queryParamName] = encodeURIComponent(queryParam);
	                    }
	                    else if (typeof queryParam === "object") {
	                        if (!queryParam.value) {
	                            throw new Error(`options.queryParameters[${queryParamName}] is of type "object" but it does not contain a "value" property.`);
	                        }
	                        if (queryParam.skipUrlEncoding) {
	                            queryParams.push(queryParamName + "=" + queryParam.value);
	                            this.query[queryParamName] = queryParam.value;
	                        }
	                        else {
	                            queryParams.push(queryParamName + "=" + encodeURIComponent(queryParam.value));
	                            this.query[queryParamName] = encodeURIComponent(queryParam.value);
	                        }
	                    }
	                }
	            } // end-of-for
	            // append the queryString
	            this.url += queryParams.join("&");
	        }
	        // add headers to the request if they are provided
	        if (options.headers) {
	            const headers = options.headers;
	            for (const headerName of Object.keys(options.headers)) {
	                this.headers.set(headerName, headers[headerName]);
	            }
	        }
	        // ensure accept-language is set correctly
	        if (!this.headers.get("accept-language")) {
	            this.headers.set("accept-language", "en-US");
	        }
	        // ensure the request-id is set correctly
	        if (!this.headers.get("x-ms-client-request-id") && !options.disableClientRequestId) {
	            this.headers.set("x-ms-client-request-id", this.requestId);
	        }
	        // default
	        if (!this.headers.get("Content-Type")) {
	            this.headers.set("Content-Type", "application/json; charset=utf-8");
	        }
	        // set the request body. request.js automatically sets the Content-Length request header, so we need not set it explicitly
	        this.body = options.body;
	        if (options.body !== undefined && options.body !== null) {
	            // body as a stream special case. set the body as-is and check for some special request headers specific to sending a stream.
	            if (options.bodyIsStream) {
	                if (!this.headers.get("Transfer-Encoding")) {
	                    this.headers.set("Transfer-Encoding", "chunked");
	                }
	                if (this.headers.get("Content-Type") !== "application/octet-stream") {
	                    this.headers.set("Content-Type", "application/octet-stream");
	                }
	            }
	            else {
	                if (options.serializationMapper) {
	                    this.body = new Serializer(options.mappers).serialize(options.serializationMapper, options.body, "requestBody");
	                }
	                if (!options.disableJsonStringifyOnBody) {
	                    this.body = JSON.stringify(options.body);
	                }
	            }
	        }
	        if (options.spanOptions) {
	            this.spanOptions = options.spanOptions;
	        }
	        if (options.tracingContext) {
	            this.tracingContext = options.tracingContext;
	        }
	        this.abortSignal = options.abortSignal;
	        this.onDownloadProgress = options.onDownloadProgress;
	        this.onUploadProgress = options.onUploadProgress;
	        return this;
	    }
	    /**
	     * Clone this WebResource HTTP request object.
	     * @returns The clone of this WebResource HTTP request object.
	     */
	    clone() {
	        const result = new WebResource(this.url, this.method, this.body, this.query, this.headers && this.headers.clone(), this.streamResponseBody, this.withCredentials, this.abortSignal, this.timeout, this.onUploadProgress, this.onDownloadProgress, this.proxySettings, this.keepAlive, this.decompressResponse, this.streamResponseStatusCodes);
	        if (this.formData) {
	            result.formData = this.formData;
	        }
	        if (this.operationSpec) {
	            result.operationSpec = this.operationSpec;
	        }
	        if (this.shouldDeserialize) {
	            result.shouldDeserialize = this.shouldDeserialize;
	        }
	        if (this.operationResponseGetter) {
	            result.operationResponseGetter = this.operationResponseGetter;
	        }
	        return result;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * A class that handles the query portion of a URLBuilder.
	 */
	class URLQuery {
	    constructor() {
	        this._rawQuery = {};
	    }
	    /**
	     * Get whether or not there any query parameters in this URLQuery.
	     */
	    any() {
	        return Object.keys(this._rawQuery).length > 0;
	    }
	    /**
	     * Get the keys of the query string.
	     */
	    keys() {
	        return Object.keys(this._rawQuery);
	    }
	    /**
	     * Set a query parameter with the provided name and value. If the parameterValue is undefined or
	     * empty, then this will attempt to remove an existing query parameter with the provided
	     * parameterName.
	     */
	    set(parameterName, parameterValue) {
	        const caseParameterValue = parameterValue;
	        if (parameterName) {
	            if (caseParameterValue !== undefined && caseParameterValue !== null) {
	                const newValue = Array.isArray(caseParameterValue)
	                    ? caseParameterValue
	                    : caseParameterValue.toString();
	                this._rawQuery[parameterName] = newValue;
	            }
	            else {
	                delete this._rawQuery[parameterName];
	            }
	        }
	    }
	    /**
	     * Get the value of the query parameter with the provided name. If no parameter exists with the
	     * provided parameter name, then undefined will be returned.
	     */
	    get(parameterName) {
	        return parameterName ? this._rawQuery[parameterName] : undefined;
	    }
	    /**
	     * Get the string representation of this query. The return value will not start with a "?".
	     */
	    toString() {
	        let result = "";
	        for (const parameterName in this._rawQuery) {
	            if (result) {
	                result += "&";
	            }
	            const parameterValue = this._rawQuery[parameterName];
	            if (Array.isArray(parameterValue)) {
	                const parameterStrings = [];
	                for (const parameterValueElement of parameterValue) {
	                    parameterStrings.push(`${parameterName}=${parameterValueElement}`);
	                }
	                result += parameterStrings.join("&");
	            }
	            else {
	                result += `${parameterName}=${parameterValue}`;
	            }
	        }
	        return result;
	    }
	    /**
	     * Parse a URLQuery from the provided text.
	     */
	    static parse(text) {
	        const result = new URLQuery();
	        if (text) {
	            if (text.startsWith("?")) {
	                text = text.substring(1);
	            }
	            let currentState = "ParameterName";
	            let parameterName = "";
	            let parameterValue = "";
	            for (let i = 0; i < text.length; ++i) {
	                const currentCharacter = text[i];
	                switch (currentState) {
	                    case "ParameterName":
	                        switch (currentCharacter) {
	                            case "=":
	                                currentState = "ParameterValue";
	                                break;
	                            case "&":
	                                parameterName = "";
	                                parameterValue = "";
	                                break;
	                            default:
	                                parameterName += currentCharacter;
	                                break;
	                        }
	                        break;
	                    case "ParameterValue":
	                        switch (currentCharacter) {
	                            case "&":
	                                result.set(parameterName, parameterValue);
	                                parameterName = "";
	                                parameterValue = "";
	                                currentState = "ParameterName";
	                                break;
	                            default:
	                                parameterValue += currentCharacter;
	                                break;
	                        }
	                        break;
	                    default:
	                        throw new Error("Unrecognized URLQuery parse state: " + currentState);
	                }
	            }
	            if (currentState === "ParameterValue") {
	                result.set(parameterName, parameterValue);
	            }
	        }
	        return result;
	    }
	}
	/**
	 * A class that handles creating, modifying, and parsing URLs.
	 */
	class URLBuilder {
	    /**
	     * Set the scheme/protocol for this URL. If the provided scheme contains other parts of a URL
	     * (such as a host, port, path, or query), those parts will be added to this URL as well.
	     */
	    setScheme(scheme) {
	        if (!scheme) {
	            this._scheme = undefined;
	        }
	        else {
	            this.set(scheme, "SCHEME");
	        }
	    }
	    /**
	     * Get the scheme that has been set in this URL.
	     */
	    getScheme() {
	        return this._scheme;
	    }
	    /**
	     * Set the host for this URL. If the provided host contains other parts of a URL (such as a
	     * port, path, or query), those parts will be added to this URL as well.
	     */
	    setHost(host) {
	        if (!host) {
	            this._host = undefined;
	        }
	        else {
	            this.set(host, "SCHEME_OR_HOST");
	        }
	    }
	    /**
	     * Get the host that has been set in this URL.
	     */
	    getHost() {
	        return this._host;
	    }
	    /**
	     * Set the port for this URL. If the provided port contains other parts of a URL (such as a
	     * path or query), those parts will be added to this URL as well.
	     */
	    setPort(port) {
	        if (port === undefined || port === null || port === "") {
	            this._port = undefined;
	        }
	        else {
	            this.set(port.toString(), "PORT");
	        }
	    }
	    /**
	     * Get the port that has been set in this URL.
	     */
	    getPort() {
	        return this._port;
	    }
	    /**
	     * Set the path for this URL. If the provided path contains a query, then it will be added to
	     * this URL as well.
	     */
	    setPath(path) {
	        if (!path) {
	            this._path = undefined;
	        }
	        else {
	            const schemeIndex = path.indexOf("://");
	            if (schemeIndex !== -1) {
	                const schemeStart = path.lastIndexOf("/", schemeIndex);
	                // Make sure to only grab the URL part of the path before setting the state back to SCHEME
	                // this will handle cases such as "/a/b/c/https://microsoft.com" => "https://microsoft.com"
	                this.set(schemeStart === -1 ? path : path.substr(schemeStart + 1), "SCHEME");
	            }
	            else {
	                this.set(path, "PATH");
	            }
	        }
	    }
	    /**
	     * Append the provided path to this URL's existing path. If the provided path contains a query,
	     * then it will be added to this URL as well.
	     */
	    appendPath(path) {
	        if (path) {
	            let currentPath = this.getPath();
	            if (currentPath) {
	                if (!currentPath.endsWith("/")) {
	                    currentPath += "/";
	                }
	                if (path.startsWith("/")) {
	                    path = path.substring(1);
	                }
	                path = currentPath + path;
	            }
	            this.set(path, "PATH");
	        }
	    }
	    /**
	     * Get the path that has been set in this URL.
	     */
	    getPath() {
	        return this._path;
	    }
	    /**
	     * Set the query in this URL.
	     */
	    setQuery(query) {
	        if (!query) {
	            this._query = undefined;
	        }
	        else {
	            this._query = URLQuery.parse(query);
	        }
	    }
	    /**
	     * Set a query parameter with the provided name and value in this URL's query. If the provided
	     * query parameter value is undefined or empty, then the query parameter will be removed if it
	     * existed.
	     */
	    setQueryParameter(queryParameterName, queryParameterValue) {
	        if (queryParameterName) {
	            if (!this._query) {
	                this._query = new URLQuery();
	            }
	            this._query.set(queryParameterName, queryParameterValue);
	        }
	    }
	    /**
	     * Get the value of the query parameter with the provided query parameter name. If no query
	     * parameter exists with the provided name, then undefined will be returned.
	     */
	    getQueryParameterValue(queryParameterName) {
	        return this._query ? this._query.get(queryParameterName) : undefined;
	    }
	    /**
	     * Get the query in this URL.
	     */
	    getQuery() {
	        return this._query ? this._query.toString() : undefined;
	    }
	    /**
	     * Set the parts of this URL by parsing the provided text using the provided startState.
	     */
	    set(text, startState) {
	        const tokenizer = new URLTokenizer(text, startState);
	        while (tokenizer.next()) {
	            const token = tokenizer.current();
	            let tokenPath;
	            if (token) {
	                switch (token.type) {
	                    case "SCHEME":
	                        this._scheme = token.text || undefined;
	                        break;
	                    case "HOST":
	                        this._host = token.text || undefined;
	                        break;
	                    case "PORT":
	                        this._port = token.text || undefined;
	                        break;
	                    case "PATH":
	                        tokenPath = token.text || undefined;
	                        if (!this._path || this._path === "/" || tokenPath !== "/") {
	                            this._path = tokenPath;
	                        }
	                        break;
	                    case "QUERY":
	                        this._query = URLQuery.parse(token.text);
	                        break;
	                    default:
	                        throw new Error(`Unrecognized URLTokenType: ${token.type}`);
	                }
	            }
	        }
	    }
	    /**
	     * Serializes the URL as a string.
	     * @returns the URL as a string.
	     */
	    toString() {
	        let result = "";
	        if (this._scheme) {
	            result += `${this._scheme}://`;
	        }
	        if (this._host) {
	            result += this._host;
	        }
	        if (this._port) {
	            result += `:${this._port}`;
	        }
	        if (this._path) {
	            if (!this._path.startsWith("/")) {
	                result += "/";
	            }
	            result += this._path;
	        }
	        if (this._query && this._query.any()) {
	            result += `?${this._query.toString()}`;
	        }
	        return result;
	    }
	    /**
	     * If the provided searchValue is found in this URLBuilder, then replace it with the provided
	     * replaceValue.
	     */
	    replaceAll(searchValue, replaceValue) {
	        if (searchValue) {
	            this.setScheme(replaceAll(this.getScheme(), searchValue, replaceValue));
	            this.setHost(replaceAll(this.getHost(), searchValue, replaceValue));
	            this.setPort(replaceAll(this.getPort(), searchValue, replaceValue));
	            this.setPath(replaceAll(this.getPath(), searchValue, replaceValue));
	            this.setQuery(replaceAll(this.getQuery(), searchValue, replaceValue));
	        }
	    }
	    /**
	     * Parses a given string URL into a new {@link URLBuilder}.
	     */
	    static parse(text) {
	        const result = new URLBuilder();
	        result.set(text, "SCHEME_OR_HOST");
	        return result;
	    }
	}
	class URLToken {
	    constructor(text, type) {
	        this.text = text;
	        this.type = type;
	    }
	    static scheme(text) {
	        return new URLToken(text, "SCHEME");
	    }
	    static host(text) {
	        return new URLToken(text, "HOST");
	    }
	    static port(text) {
	        return new URLToken(text, "PORT");
	    }
	    static path(text) {
	        return new URLToken(text, "PATH");
	    }
	    static query(text) {
	        return new URLToken(text, "QUERY");
	    }
	}
	/**
	 * Get whether or not the provided character (single character string) is an alphanumeric (letter or
	 * digit) character.
	 */
	function isAlphaNumericCharacter(character) {
	    const characterCode = character.charCodeAt(0);
	    return ((48 /* '0' */ <= characterCode && characterCode <= 57) /* '9' */ ||
	        (65 /* 'A' */ <= characterCode && characterCode <= 90) /* 'Z' */ ||
	        (97 /* 'a' */ <= characterCode && characterCode <= 122) /* 'z' */);
	}
	/**
	 * A class that tokenizes URL strings.
	 */
	class URLTokenizer {
	    constructor(_text, state) {
	        this._text = _text;
	        this._textLength = _text ? _text.length : 0;
	        this._currentState = state !== undefined && state !== null ? state : "SCHEME_OR_HOST";
	        this._currentIndex = 0;
	    }
	    /**
	     * Get the current URLToken this URLTokenizer is pointing at, or undefined if the URLTokenizer
	     * hasn't started or has finished tokenizing.
	     */
	    current() {
	        return this._currentToken;
	    }
	    /**
	     * Advance to the next URLToken and return whether or not a URLToken was found.
	     */
	    next() {
	        if (!hasCurrentCharacter(this)) {
	            this._currentToken = undefined;
	        }
	        else {
	            switch (this._currentState) {
	                case "SCHEME":
	                    nextScheme(this);
	                    break;
	                case "SCHEME_OR_HOST":
	                    nextSchemeOrHost(this);
	                    break;
	                case "HOST":
	                    nextHost(this);
	                    break;
	                case "PORT":
	                    nextPort(this);
	                    break;
	                case "PATH":
	                    nextPath(this);
	                    break;
	                case "QUERY":
	                    nextQuery(this);
	                    break;
	                default:
	                    throw new Error(`Unrecognized URLTokenizerState: ${this._currentState}`);
	            }
	        }
	        return !!this._currentToken;
	    }
	}
	/**
	 * Read the remaining characters from this Tokenizer's character stream.
	 */
	function readRemaining(tokenizer) {
	    let result = "";
	    if (tokenizer._currentIndex < tokenizer._textLength) {
	        result = tokenizer._text.substring(tokenizer._currentIndex);
	        tokenizer._currentIndex = tokenizer._textLength;
	    }
	    return result;
	}
	/**
	 * Whether or not this URLTokenizer has a current character.
	 */
	function hasCurrentCharacter(tokenizer) {
	    return tokenizer._currentIndex < tokenizer._textLength;
	}
	/**
	 * Get the character in the text string at the current index.
	 */
	function getCurrentCharacter(tokenizer) {
	    return tokenizer._text[tokenizer._currentIndex];
	}
	/**
	 * Advance to the character in text that is "step" characters ahead. If no step value is provided,
	 * then step will default to 1.
	 */
	function nextCharacter(tokenizer, step) {
	    if (hasCurrentCharacter(tokenizer)) {
	        if (!step) {
	            step = 1;
	        }
	        tokenizer._currentIndex += step;
	    }
	}
	/**
	 * Starting with the current character, peek "charactersToPeek" number of characters ahead in this
	 * Tokenizer's stream of characters.
	 */
	function peekCharacters(tokenizer, charactersToPeek) {
	    let endIndex = tokenizer._currentIndex + charactersToPeek;
	    if (tokenizer._textLength < endIndex) {
	        endIndex = tokenizer._textLength;
	    }
	    return tokenizer._text.substring(tokenizer._currentIndex, endIndex);
	}
	/**
	 * Read characters from this Tokenizer until the end of the stream or until the provided condition
	 * is false when provided the current character.
	 */
	function readWhile(tokenizer, condition) {
	    let result = "";
	    while (hasCurrentCharacter(tokenizer)) {
	        const currentCharacter = getCurrentCharacter(tokenizer);
	        if (!condition(currentCharacter)) {
	            break;
	        }
	        else {
	            result += currentCharacter;
	            nextCharacter(tokenizer);
	        }
	    }
	    return result;
	}
	/**
	 * Read characters from this Tokenizer until a non-alphanumeric character or the end of the
	 * character stream is reached.
	 */
	function readWhileLetterOrDigit(tokenizer) {
	    return readWhile(tokenizer, (character) => isAlphaNumericCharacter(character));
	}
	/**
	 * Read characters from this Tokenizer until one of the provided terminating characters is read or
	 * the end of the character stream is reached.
	 */
	function readUntilCharacter(tokenizer, ...terminatingCharacters) {
	    return readWhile(tokenizer, (character) => terminatingCharacters.indexOf(character) === -1);
	}
	function nextScheme(tokenizer) {
	    const scheme = readWhileLetterOrDigit(tokenizer);
	    tokenizer._currentToken = URLToken.scheme(scheme);
	    if (!hasCurrentCharacter(tokenizer)) {
	        tokenizer._currentState = "DONE";
	    }
	    else {
	        tokenizer._currentState = "HOST";
	    }
	}
	function nextSchemeOrHost(tokenizer) {
	    const schemeOrHost = readUntilCharacter(tokenizer, ":", "/", "?");
	    if (!hasCurrentCharacter(tokenizer)) {
	        tokenizer._currentToken = URLToken.host(schemeOrHost);
	        tokenizer._currentState = "DONE";
	    }
	    else if (getCurrentCharacter(tokenizer) === ":") {
	        if (peekCharacters(tokenizer, 3) === "://") {
	            tokenizer._currentToken = URLToken.scheme(schemeOrHost);
	            tokenizer._currentState = "HOST";
	        }
	        else {
	            tokenizer._currentToken = URLToken.host(schemeOrHost);
	            tokenizer._currentState = "PORT";
	        }
	    }
	    else {
	        tokenizer._currentToken = URLToken.host(schemeOrHost);
	        if (getCurrentCharacter(tokenizer) === "/") {
	            tokenizer._currentState = "PATH";
	        }
	        else {
	            tokenizer._currentState = "QUERY";
	        }
	    }
	}
	function nextHost(tokenizer) {
	    if (peekCharacters(tokenizer, 3) === "://") {
	        nextCharacter(tokenizer, 3);
	    }
	    const host = readUntilCharacter(tokenizer, ":", "/", "?");
	    tokenizer._currentToken = URLToken.host(host);
	    if (!hasCurrentCharacter(tokenizer)) {
	        tokenizer._currentState = "DONE";
	    }
	    else if (getCurrentCharacter(tokenizer) === ":") {
	        tokenizer._currentState = "PORT";
	    }
	    else if (getCurrentCharacter(tokenizer) === "/") {
	        tokenizer._currentState = "PATH";
	    }
	    else {
	        tokenizer._currentState = "QUERY";
	    }
	}
	function nextPort(tokenizer) {
	    if (getCurrentCharacter(tokenizer) === ":") {
	        nextCharacter(tokenizer);
	    }
	    const port = readUntilCharacter(tokenizer, "/", "?");
	    tokenizer._currentToken = URLToken.port(port);
	    if (!hasCurrentCharacter(tokenizer)) {
	        tokenizer._currentState = "DONE";
	    }
	    else if (getCurrentCharacter(tokenizer) === "/") {
	        tokenizer._currentState = "PATH";
	    }
	    else {
	        tokenizer._currentState = "QUERY";
	    }
	}
	function nextPath(tokenizer) {
	    const path = readUntilCharacter(tokenizer, "?");
	    tokenizer._currentToken = URLToken.path(path);
	    if (!hasCurrentCharacter(tokenizer)) {
	        tokenizer._currentState = "DONE";
	    }
	    else {
	        tokenizer._currentState = "QUERY";
	    }
	}
	function nextQuery(tokenizer) {
	    if (getCurrentCharacter(tokenizer) === "?") {
	        nextCharacter(tokenizer);
	    }
	    const query = readRemaining(tokenizer);
	    tokenizer._currentToken = URLToken.query(query);
	    tokenizer._currentState = "DONE";
	}

	// Copyright (c) Microsoft Corporation.
	const RedactedString = "REDACTED";
	const defaultAllowedHeaderNames = [
	    "x-ms-client-request-id",
	    "x-ms-return-client-request-id",
	    "x-ms-useragent",
	    "x-ms-correlation-request-id",
	    "x-ms-request-id",
	    "client-request-id",
	    "ms-cv",
	    "return-client-request-id",
	    "traceparent",
	    "Access-Control-Allow-Credentials",
	    "Access-Control-Allow-Headers",
	    "Access-Control-Allow-Methods",
	    "Access-Control-Allow-Origin",
	    "Access-Control-Expose-Headers",
	    "Access-Control-Max-Age",
	    "Access-Control-Request-Headers",
	    "Access-Control-Request-Method",
	    "Origin",
	    "Accept",
	    "Accept-Encoding",
	    "Cache-Control",
	    "Connection",
	    "Content-Length",
	    "Content-Type",
	    "Date",
	    "ETag",
	    "Expires",
	    "If-Match",
	    "If-Modified-Since",
	    "If-None-Match",
	    "If-Unmodified-Since",
	    "Last-Modified",
	    "Pragma",
	    "Request-Id",
	    "Retry-After",
	    "Server",
	    "Transfer-Encoding",
	    "User-Agent",
	    "WWW-Authenticate",
	];
	const defaultAllowedQueryParameters = ["api-version"];
	class Sanitizer {
	    constructor({ allowedHeaderNames = [], allowedQueryParameters = [] } = {}) {
	        allowedHeaderNames = Array.isArray(allowedHeaderNames)
	            ? defaultAllowedHeaderNames.concat(allowedHeaderNames)
	            : defaultAllowedHeaderNames;
	        allowedQueryParameters = Array.isArray(allowedQueryParameters)
	            ? defaultAllowedQueryParameters.concat(allowedQueryParameters)
	            : defaultAllowedQueryParameters;
	        this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
	        this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
	    }
	    sanitize(obj) {
	        const seen = new Set();
	        return JSON.stringify(obj, (key, value) => {
	            // Ensure Errors include their interesting non-enumerable members
	            if (value instanceof Error) {
	                return Object.assign(Object.assign({}, value), { name: value.name, message: value.message });
	            }
	            if (key === "_headersMap") {
	                return this.sanitizeHeaders(value);
	            }
	            else if (key === "url") {
	                return this.sanitizeUrl(value);
	            }
	            else if (key === "query") {
	                return this.sanitizeQuery(value);
	            }
	            else if (key === "body") {
	                // Don't log the request body
	                return undefined;
	            }
	            else if (key === "response") {
	                // Don't log response again
	                return undefined;
	            }
	            else if (key === "operationSpec") {
	                // When using sendOperationRequest, the request carries a massive
	                // field with the autorest spec. No need to log it.
	                return undefined;
	            }
	            else if (Array.isArray(value) || isObject(value)) {
	                if (seen.has(value)) {
	                    return "[Circular]";
	                }
	                seen.add(value);
	            }
	            return value;
	        }, 2);
	    }
	    sanitizeHeaders(value) {
	        return this.sanitizeObject(value, this.allowedHeaderNames, (v, k) => v[k].value);
	    }
	    sanitizeQuery(value) {
	        return this.sanitizeObject(value, this.allowedQueryParameters, (v, k) => v[k]);
	    }
	    sanitizeObject(value, allowedKeys, accessor) {
	        if (typeof value !== "object" || value === null) {
	            return value;
	        }
	        const sanitized = {};
	        for (const k of Object.keys(value)) {
	            if (allowedKeys.has(k.toLowerCase())) {
	                sanitized[k] = accessor(value, k);
	            }
	            else {
	                sanitized[k] = RedactedString;
	            }
	        }
	        return sanitized;
	    }
	    sanitizeUrl(value) {
	        if (typeof value !== "string" || value === null) {
	            return value;
	        }
	        const urlBuilder = URLBuilder.parse(value);
	        const queryString = urlBuilder.getQuery();
	        if (!queryString) {
	            return value;
	        }
	        const query = URLQuery.parse(queryString);
	        for (const k of query.keys()) {
	            if (!this.allowedQueryParameters.has(k.toLowerCase())) {
	                query.set(k, RedactedString);
	            }
	        }
	        urlBuilder.setQuery(query.toString());
	        return urlBuilder.toString();
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const custom = {};

	// Copyright (c) Microsoft Corporation.
	const errorSanitizer = new Sanitizer();
	/**
	 * An error resulting from an HTTP request to a service endpoint.
	 */
	class RestError extends Error {
	    constructor(message, code, statusCode, request, response) {
	        super(message);
	        this.name = "RestError";
	        this.code = code;
	        this.statusCode = statusCode;
	        this.request = request;
	        this.response = response;
	        Object.setPrototypeOf(this, RestError.prototype);
	    }
	    /**
	     * Logging method for util.inspect in Node
	     */
	    [custom]() {
	        return `RestError: ${this.message} \n ${errorSanitizer.sanitize(this)}`;
	    }
	}
	/**
	 * A constant string to identify errors that may arise when making an HTTP request that indicates an issue with the transport layer (e.g. the hostname of the URL cannot be resolved via DNS.)
	 */
	RestError.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
	/**
	 * A constant string to identify errors that may arise from parsing an incoming HTTP response. Usually indicates a malformed HTTP body, such as an encoded JSON payload that is incomplete.
	 */
	RestError.PARSE_ERROR = "PARSE_ERROR";

	// Copyright (c) Microsoft Corporation.
	/**
	 * A HttpClient implementation that uses XMLHttpRequest to send HTTP requests.
	 */
	class XhrHttpClient {
	    sendRequest(request) {
	        var _a;
	        const xhr = new XMLHttpRequest();
	        if (request.proxySettings) {
	            throw new Error("HTTP proxy is not supported in browser environment");
	        }
	        const abortSignal = request.abortSignal;
	        if (abortSignal) {
	            if (abortSignal.aborted) {
	                return Promise.reject(new AbortError("The operation was aborted."));
	            }
	            const listener = () => {
	                xhr.abort();
	            };
	            abortSignal.addEventListener("abort", listener);
	            xhr.addEventListener("readystatechange", () => {
	                if (xhr.readyState === XMLHttpRequest.DONE) {
	                    abortSignal.removeEventListener("abort", listener);
	                }
	            });
	        }
	        addProgressListener(xhr.upload, request.onUploadProgress);
	        addProgressListener(xhr, request.onDownloadProgress);
	        if (request.formData) {
	            const formData = request.formData;
	            const requestForm = new FormData();
	            const appendFormValue = (key, value) => {
	                if (value &&
	                    Object.prototype.hasOwnProperty.call(value, "value") &&
	                    Object.prototype.hasOwnProperty.call(value, "options")) {
	                    requestForm.append(key, value.value, value.options);
	                }
	                else {
	                    requestForm.append(key, value);
	                }
	            };
	            for (const formKey of Object.keys(formData)) {
	                const formValue = formData[formKey];
	                if (Array.isArray(formValue)) {
	                    for (let j = 0; j < formValue.length; j++) {
	                        appendFormValue(formKey, formValue[j]);
	                    }
	                }
	                else {
	                    appendFormValue(formKey, formValue);
	                }
	            }
	            request.body = requestForm;
	            request.formData = undefined;
	            const contentType = request.headers.get("Content-Type");
	            if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
	                // browser will automatically apply a suitable content-type header
	                request.headers.remove("Content-Type");
	            }
	        }
	        xhr.open(request.method, request.url);
	        xhr.timeout = request.timeout;
	        xhr.withCredentials = request.withCredentials;
	        for (const header of request.headers.headersArray()) {
	            xhr.setRequestHeader(header.name, header.value);
	        }
	        xhr.responseType =
	            ((_a = request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.size) || request.streamResponseBody ? "blob" : "text";
	        // tslint:disable-next-line:no-null-keyword
	        xhr.send(request.body === undefined ? null : request.body);
	        if (xhr.responseType === "blob") {
	            return new Promise((resolve, reject) => {
	                handleBlobResponse(xhr, request, resolve, reject);
	                rejectOnTerminalEvent(request, xhr, reject);
	            });
	        }
	        else {
	            return new Promise(function (resolve, reject) {
	                xhr.addEventListener("load", () => resolve({
	                    request,
	                    status: xhr.status,
	                    headers: parseHeaders(xhr),
	                    bodyAsText: xhr.responseText,
	                }));
	                rejectOnTerminalEvent(request, xhr, reject);
	            });
	        }
	    }
	}
	function handleBlobResponse(xhr, request, res, rej) {
	    xhr.addEventListener("readystatechange", () => {
	        var _a;
	        // Resolve as soon as headers are loaded
	        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
	            if (request.streamResponseBody || ((_a = request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.has(xhr.status))) {
	                const blobBody = new Promise((resolve, reject) => {
	                    xhr.addEventListener("load", () => {
	                        resolve(xhr.response);
	                    });
	                    rejectOnTerminalEvent(request, xhr, reject);
	                });
	                res({
	                    request,
	                    status: xhr.status,
	                    headers: parseHeaders(xhr),
	                    blobBody,
	                });
	            }
	            else {
	                xhr.addEventListener("load", () => {
	                    // xhr.response is of Blob type if the request is sent with xhr.responseType === "blob"
	                    // but the status code is not one of the stream response status codes,
	                    // so treat it as text and convert from Blob to text
	                    if (xhr.response) {
	                        // Blob.text() is not supported in IE so using FileReader instead
	                        const reader = new FileReader();
	                        reader.onload = function (e) {
	                            var _a;
	                            const text = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
	                            res({
	                                request,
	                                status: xhr.status,
	                                headers: parseHeaders(xhr),
	                                bodyAsText: text,
	                            });
	                        };
	                        reader.onerror = function (_e) {
	                            rej(reader.error);
	                        };
	                        reader.readAsText(xhr.response, "UTF-8");
	                    }
	                    else {
	                        res({
	                            request,
	                            status: xhr.status,
	                            headers: parseHeaders(xhr),
	                        });
	                    }
	                });
	            }
	        }
	    });
	}
	function addProgressListener(xhr, listener) {
	    if (listener) {
	        xhr.addEventListener("progress", (rawEvent) => listener({
	            loadedBytes: rawEvent.loaded,
	        }));
	    }
	}
	// exported locally for testing
	function parseHeaders(xhr) {
	    const responseHeaders = new HttpHeaders();
	    const headerLines = xhr
	        .getAllResponseHeaders()
	        .trim()
	        .split(/[\r\n]+/);
	    for (const line of headerLines) {
	        const index = line.indexOf(":");
	        const headerName = line.slice(0, index);
	        const headerValue = line.slice(index + 2);
	        responseHeaders.set(headerName, headerValue);
	    }
	    return responseHeaders;
	}
	function rejectOnTerminalEvent(request, xhr, reject) {
	    xhr.addEventListener("error", () => reject(new RestError(`Failed to send request to ${request.url}`, RestError.REQUEST_SEND_ERROR, undefined, request)));
	    const abortError = new AbortError("The operation was aborted.");
	    xhr.addEventListener("abort", () => reject(abortError));
	    xhr.addEventListener("timeout", () => reject(abortError));
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The different levels of logs that can be used with the HttpPipelineLogger.
	 */
	var HttpPipelineLogLevel;
	(function (HttpPipelineLogLevel) {
	    /**
	     * A log level that indicates that no logs will be logged.
	     */
	    HttpPipelineLogLevel[HttpPipelineLogLevel["OFF"] = 0] = "OFF";
	    /**
	     * An error log.
	     */
	    HttpPipelineLogLevel[HttpPipelineLogLevel["ERROR"] = 1] = "ERROR";
	    /**
	     * A warning log.
	     */
	    HttpPipelineLogLevel[HttpPipelineLogLevel["WARNING"] = 2] = "WARNING";
	    /**
	     * An information log.
	     */
	    HttpPipelineLogLevel[HttpPipelineLogLevel["INFO"] = 3] = "INFO";
	})(HttpPipelineLogLevel || (HttpPipelineLogLevel = {}));

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
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    if (typeof b !== "function" && b !== null)
	        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	var __createBinding = Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	        desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	});

	function __exportStar(m, o) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
	}

	function __values(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	/** @deprecated */
	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	/** @deprecated */
	function __spreadArrays() {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	}

	function __spreadArray$2(to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	}

	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator], i;
	    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
	    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
	    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	};

	var __setModuleDefault = Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	};

	function __importStar(mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	}

	function __importDefault(mod) {
	    return (mod && mod.__esModule) ? mod : { default: mod };
	}

	function __classPrivateFieldGet(receiver, state, kind, f) {
	    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	}

	function __classPrivateFieldSet(receiver, state, value, kind, f) {
	    if (kind === "m") throw new TypeError("Private method is not writable");
	    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
	}

	function __classPrivateFieldIn(state, receiver) {
	    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
	    return typeof state === "function" ? receiver === state : state.has(receiver);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Converts an OperationOptions to a RequestOptionsBase
	 *
	 * @param opts - OperationOptions object to convert to RequestOptionsBase
	 */
	function operationOptionsToRequestOptionsBase(opts) {
	    const { requestOptions, tracingOptions } = opts, additionalOptions = __rest(opts, ["requestOptions", "tracingOptions"]);
	    let result = additionalOptions;
	    if (requestOptions) {
	        result = Object.assign(Object.assign({}, result), requestOptions);
	    }
	    if (tracingOptions) {
	        result.tracingContext = tracingOptions.tracingContext;
	        // By passing spanOptions if they exist at runtime, we're backwards compatible with @azure/core-tracing@preview.13 and earlier.
	        result.spanOptions = tracingOptions === null || tracingOptions === void 0 ? void 0 : tracingOptions.spanOptions;
	    }
	    return result;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The base class from which all request policies derive.
	 */
	class BaseRequestPolicy {
	    /**
	     * The main method to implement that manipulates a request/response.
	     */
	    constructor(
	    /**
	     * The next policy in the pipeline. Each policy is responsible for executing the next one if the request is to continue through the pipeline.
	     */
	    _nextPolicy, 
	    /**
	     * The options that can be passed to a given request policy.
	     */
	    _options) {
	        this._nextPolicy = _nextPolicy;
	        this._options = _options;
	    }
	    /**
	     * Get whether or not a log with the provided log level should be logged.
	     * @param logLevel - The log level of the log that will be logged.
	     * @returns Whether or not a log with the provided log level should be logged.
	     */
	    shouldLog(logLevel) {
	        return this._options.shouldLog(logLevel);
	    }
	    /**
	     * Attempt to log the provided message to the provided logger. If no logger was provided or if
	     * the log level does not meat the logger's threshold, then nothing will be logged.
	     * @param logLevel - The log level of this log.
	     * @param message - The message of this log.
	     */
	    log(logLevel, message) {
	        this._options.log(logLevel, message);
	    }
	}
	/**
	 * Optional properties that can be used when creating a RequestPolicy.
	 */
	class RequestPolicyOptions {
	    constructor(_logger) {
	        this._logger = _logger;
	    }
	    /**
	     * Get whether or not a log with the provided log level should be logged.
	     * @param logLevel - The log level of the log that will be logged.
	     * @returns Whether or not a log with the provided log level should be logged.
	     */
	    shouldLog(logLevel) {
	        return (!!this._logger &&
	            logLevel !== HttpPipelineLogLevel.OFF &&
	            logLevel <= this._logger.minimumLogLevel);
	    }
	    /**
	     * Attempt to log the provided message to the provided logger. If no logger was provided or if
	     * the log level does not meet the logger's threshold, then nothing will be logged.
	     * @param logLevel - The log level of this log.
	     * @param message - The message of this log.
	     */
	    log(logLevel, message) {
	        if (this._logger && this.shouldLog(logLevel)) {
	            this._logger.log(logLevel, message);
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	if (!self.document || !self.DOMParser || !self.Node || !self.XMLSerializer) {
	    throw new Error(`This library depends on the following DOM objects: ["document", "DOMParser", "Node", "XMLSerializer"] to parse XML, but some of these are undefined. You may provide a polyfill to make these globally available in order to support your environment. For more information, please refer to https://aka.ms/azsdk/js/web-workers. `);
	}
	let cachedDoc;
	function getDoc() {
	    if (!cachedDoc) {
	        cachedDoc = document.implementation.createDocument(null, null, null);
	    }
	    return cachedDoc;
	}
	let cachedParser;
	function getParser() {
	    if (!cachedParser) {
	        cachedParser = new DOMParser();
	    }
	    return cachedParser;
	}
	let cachedSerializer;
	function getSerializer() {
	    if (!cachedSerializer) {
	        cachedSerializer = new XMLSerializer();
	    }
	    return cachedSerializer;
	}
	// Policy to make our code Trusted Types compliant.
	//   https://github.com/w3c/webappsec-trusted-types
	// We are calling DOMParser.parseFromString() to parse XML payload from Azure services.
	// The parsed DOM object is not exposed to outside. Scripts are disabled when parsing
	// according to the spec.  There are no HTML/XSS security concerns on the usage of
	// parseFromString() here.
	let ttPolicy;
	if (typeof self.trustedTypes !== "undefined") {
	    ttPolicy = self.trustedTypes.createPolicy("@azure/core-http#xml.browser", {
	        createHTML: (s) => s,
	    });
	}
	function parseXML(str, opts = {}) {
	    var _a, _b, _c, _d;
	    try {
	        const updatedOptions = {
	            rootName: (_a = opts.rootName) !== null && _a !== void 0 ? _a : "",
	            includeRoot: (_b = opts.includeRoot) !== null && _b !== void 0 ? _b : false,
	            xmlCharKey: (_c = opts.xmlCharKey) !== null && _c !== void 0 ? _c : XML_CHARKEY,
	        };
	        const dom = getParser().parseFromString(((_d = ttPolicy === null || ttPolicy === void 0 ? void 0 : ttPolicy.createHTML(str)) !== null && _d !== void 0 ? _d : str), "application/xml");
	        throwIfError(dom);
	        let obj;
	        if (updatedOptions.includeRoot) {
	            obj = domToObject(dom, updatedOptions);
	        }
	        else {
	            obj = domToObject(dom.childNodes[0], updatedOptions);
	        }
	        return Promise.resolve(obj);
	    }
	    catch (err) {
	        return Promise.reject(err);
	    }
	}
	let errorNS;
	function getErrorNamespace() {
	    var _a, _b;
	    if (errorNS === undefined) {
	        try {
	            const invalidXML = ((_a = ttPolicy === null || ttPolicy === void 0 ? void 0 : ttPolicy.createHTML("INVALID")) !== null && _a !== void 0 ? _a : "INVALID");
	            errorNS =
	                (_b = getParser().parseFromString(invalidXML, "text/xml").getElementsByTagName("parsererror")[0]
	                    .namespaceURI) !== null && _b !== void 0 ? _b : "";
	        }
	        catch (ignored) {
	            // Most browsers will return a document containing <parsererror>, but IE will throw.
	            errorNS = "";
	        }
	    }
	    return errorNS;
	}
	function throwIfError(dom) {
	    const parserErrors = dom.getElementsByTagName("parsererror");
	    if (parserErrors.length > 0 && getErrorNamespace()) {
	        for (let i = 0; i < parserErrors.length; i++) {
	            if (parserErrors[i].namespaceURI === errorNS) {
	                throw new Error(parserErrors[i].innerHTML);
	            }
	        }
	    }
	}
	function isElement(node) {
	    return !!node.attributes;
	}
	/**
	 * Get the Element-typed version of the provided Node if the provided node is an element with
	 * attributes. If it isn't, then undefined is returned.
	 */
	function asElementWithAttributes(node) {
	    return isElement(node) && node.hasAttributes() ? node : undefined;
	}
	function domToObject(node, options) {
	    let result = {};
	    const childNodeCount = node.childNodes.length;
	    const firstChildNode = node.childNodes[0];
	    const onlyChildTextValue = (firstChildNode &&
	        childNodeCount === 1 &&
	        firstChildNode.nodeType === Node.TEXT_NODE &&
	        firstChildNode.nodeValue) ||
	        undefined;
	    const elementWithAttributes = asElementWithAttributes(node);
	    if (elementWithAttributes) {
	        result[XML_ATTRKEY] = {};
	        for (let i = 0; i < elementWithAttributes.attributes.length; i++) {
	            const attr = elementWithAttributes.attributes[i];
	            result[XML_ATTRKEY][attr.nodeName] = attr.nodeValue;
	        }
	        if (onlyChildTextValue) {
	            result[options.xmlCharKey] = onlyChildTextValue;
	        }
	    }
	    else if (childNodeCount === 0) {
	        result = "";
	    }
	    else if (onlyChildTextValue) {
	        result = onlyChildTextValue;
	    }
	    if (!onlyChildTextValue) {
	        for (let i = 0; i < childNodeCount; i++) {
	            const child = node.childNodes[i];
	            // Ignore leading/trailing whitespace nodes
	            if (child.nodeType !== Node.TEXT_NODE) {
	                const childObject = domToObject(child, options);
	                if (!result[child.nodeName]) {
	                    result[child.nodeName] = childObject;
	                }
	                else if (Array.isArray(result[child.nodeName])) {
	                    result[child.nodeName].push(childObject);
	                }
	                else {
	                    result[child.nodeName] = [result[child.nodeName], childObject];
	                }
	            }
	        }
	    }
	    return result;
	}
	function stringifyXML(content, opts = {}) {
	    var _a, _b, _c;
	    const updatedOptions = {
	        rootName: (_a = opts.rootName) !== null && _a !== void 0 ? _a : "root",
	        includeRoot: (_b = opts.includeRoot) !== null && _b !== void 0 ? _b : false,
	        xmlCharKey: (_c = opts.xmlCharKey) !== null && _c !== void 0 ? _c : XML_CHARKEY,
	    };
	    const dom = buildNode(content, updatedOptions.rootName, updatedOptions)[0];
	    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
	        getSerializer().serializeToString(dom));
	}
	function buildAttributes(attrs) {
	    const result = [];
	    for (const key of Object.keys(attrs)) {
	        const attr = getDoc().createAttribute(key);
	        attr.value = attrs[key].toString();
	        result.push(attr);
	    }
	    return result;
	}
	function buildNode(obj, elementName, options) {
	    if (obj === undefined ||
	        obj === null ||
	        typeof obj === "string" ||
	        typeof obj === "number" ||
	        typeof obj === "boolean") {
	        const elem = getDoc().createElement(elementName);
	        elem.textContent = obj === undefined || obj === null ? "" : obj.toString();
	        return [elem];
	    }
	    else if (Array.isArray(obj)) {
	        const result = [];
	        for (const arrayElem of obj) {
	            for (const child of buildNode(arrayElem, elementName, options)) {
	                result.push(child);
	            }
	        }
	        return result;
	    }
	    else if (typeof obj === "object") {
	        const elem = getDoc().createElement(elementName);
	        for (const key of Object.keys(obj)) {
	            if (key === XML_ATTRKEY) {
	                for (const attr of buildAttributes(obj[key])) {
	                    elem.attributes.setNamedItem(attr);
	                }
	            }
	            else if (key === options.xmlCharKey) {
	                elem.textContent = obj[key].toString();
	            }
	            else {
	                for (const child of buildNode(obj[key], key, options)) {
	                    elem.appendChild(child);
	                }
	            }
	        }
	        return [elem];
	    }
	    else {
	        throw new Error(`Illegal value passed to buildObject: ${obj}`);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Create a new serialization RequestPolicyCreator that will serialized HTTP request bodies as they
	 * pass through the HTTP pipeline.
	 */
	function deserializationPolicy(deserializationContentTypes, parsingOptions) {
	    return {
	        create: (nextPolicy, options) => {
	            return new DeserializationPolicy(nextPolicy, options, deserializationContentTypes, parsingOptions);
	        },
	    };
	}
	const defaultJsonContentTypes = ["application/json", "text/json"];
	const defaultXmlContentTypes = ["application/xml", "application/atom+xml"];
	const DefaultDeserializationOptions = {
	    expectedContentTypes: {
	        json: defaultJsonContentTypes,
	        xml: defaultXmlContentTypes,
	    },
	};
	/**
	 * A RequestPolicy that will deserialize HTTP response bodies and headers as they pass through the
	 * HTTP pipeline.
	 */
	class DeserializationPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, requestPolicyOptions, deserializationContentTypes, parsingOptions = {}) {
	        var _a;
	        super(nextPolicy, requestPolicyOptions);
	        this.jsonContentTypes =
	            (deserializationContentTypes && deserializationContentTypes.json) || defaultJsonContentTypes;
	        this.xmlContentTypes =
	            (deserializationContentTypes && deserializationContentTypes.xml) || defaultXmlContentTypes;
	        this.xmlCharKey = (_a = parsingOptions.xmlCharKey) !== null && _a !== void 0 ? _a : XML_CHARKEY;
	    }
	    async sendRequest(request) {
	        return this._nextPolicy.sendRequest(request).then((response) => deserializeResponseBody(this.jsonContentTypes, this.xmlContentTypes, response, {
	            xmlCharKey: this.xmlCharKey,
	        }));
	    }
	}
	function getOperationResponse(parsedResponse) {
	    let result;
	    const request = parsedResponse.request;
	    const operationSpec = request.operationSpec;
	    if (operationSpec) {
	        const operationResponseGetter = request.operationResponseGetter;
	        if (!operationResponseGetter) {
	            result = operationSpec.responses[parsedResponse.status];
	        }
	        else {
	            result = operationResponseGetter(operationSpec, parsedResponse);
	        }
	    }
	    return result;
	}
	function shouldDeserializeResponse(parsedResponse) {
	    const shouldDeserialize = parsedResponse.request.shouldDeserialize;
	    let result;
	    if (shouldDeserialize === undefined) {
	        result = true;
	    }
	    else if (typeof shouldDeserialize === "boolean") {
	        result = shouldDeserialize;
	    }
	    else {
	        result = shouldDeserialize(parsedResponse);
	    }
	    return result;
	}
	/**
	 * Given a particular set of content types to parse as either JSON or XML, consumes the HTTP response to produce the result object defined by the request's {@link OperationSpec}.
	 * @param jsonContentTypes - Response content types to parse the body as JSON.
	 * @param xmlContentTypes  - Response content types to parse the body as XML.
	 * @param response - HTTP Response from the pipeline.
	 * @param options  - Options to the serializer, mostly for configuring the XML parser if needed.
	 * @returns A parsed {@link HttpOperationResponse} object that can be returned by the {@link ServiceClient}.
	 */
	function deserializeResponseBody(jsonContentTypes, xmlContentTypes, response, options = {}) {
	    var _a, _b, _c;
	    const updatedOptions = {
	        rootName: (_a = options.rootName) !== null && _a !== void 0 ? _a : "",
	        includeRoot: (_b = options.includeRoot) !== null && _b !== void 0 ? _b : false,
	        xmlCharKey: (_c = options.xmlCharKey) !== null && _c !== void 0 ? _c : XML_CHARKEY,
	    };
	    return parse(jsonContentTypes, xmlContentTypes, response, updatedOptions).then((parsedResponse) => {
	        if (!shouldDeserializeResponse(parsedResponse)) {
	            return parsedResponse;
	        }
	        const operationSpec = parsedResponse.request.operationSpec;
	        if (!operationSpec || !operationSpec.responses) {
	            return parsedResponse;
	        }
	        const responseSpec = getOperationResponse(parsedResponse);
	        const { error, shouldReturnResponse } = handleErrorResponse(parsedResponse, operationSpec, responseSpec);
	        if (error) {
	            throw error;
	        }
	        else if (shouldReturnResponse) {
	            return parsedResponse;
	        }
	        // An operation response spec does exist for current status code, so
	        // use it to deserialize the response.
	        if (responseSpec) {
	            if (responseSpec.bodyMapper) {
	                let valueToDeserialize = parsedResponse.parsedBody;
	                if (operationSpec.isXML && responseSpec.bodyMapper.type.name === MapperType.Sequence) {
	                    valueToDeserialize =
	                        typeof valueToDeserialize === "object"
	                            ? valueToDeserialize[responseSpec.bodyMapper.xmlElementName]
	                            : [];
	                }
	                try {
	                    parsedResponse.parsedBody = operationSpec.serializer.deserialize(responseSpec.bodyMapper, valueToDeserialize, "operationRes.parsedBody", options);
	                }
	                catch (innerError) {
	                    const restError = new RestError(`Error ${innerError} occurred in deserializing the responseBody - ${parsedResponse.bodyAsText}`, undefined, parsedResponse.status, parsedResponse.request, parsedResponse);
	                    throw restError;
	                }
	            }
	            else if (operationSpec.httpMethod === "HEAD") {
	                // head methods never have a body, but we return a boolean to indicate presence/absence of the resource
	                parsedResponse.parsedBody = response.status >= 200 && response.status < 300;
	            }
	            if (responseSpec.headersMapper) {
	                parsedResponse.parsedHeaders = operationSpec.serializer.deserialize(responseSpec.headersMapper, parsedResponse.headers.toJson(), "operationRes.parsedHeaders", options);
	            }
	        }
	        return parsedResponse;
	    });
	}
	function isOperationSpecEmpty(operationSpec) {
	    const expectedStatusCodes = Object.keys(operationSpec.responses);
	    return (expectedStatusCodes.length === 0 ||
	        (expectedStatusCodes.length === 1 && expectedStatusCodes[0] === "default"));
	}
	function handleErrorResponse(parsedResponse, operationSpec, responseSpec) {
	    var _a;
	    const isSuccessByStatus = 200 <= parsedResponse.status && parsedResponse.status < 300;
	    const isExpectedStatusCode = isOperationSpecEmpty(operationSpec)
	        ? isSuccessByStatus
	        : !!responseSpec;
	    if (isExpectedStatusCode) {
	        if (responseSpec) {
	            if (!responseSpec.isError) {
	                return { error: null, shouldReturnResponse: false };
	            }
	        }
	        else {
	            return { error: null, shouldReturnResponse: false };
	        }
	    }
	    const errorResponseSpec = responseSpec !== null && responseSpec !== void 0 ? responseSpec : operationSpec.responses.default;
	    const streaming = ((_a = parsedResponse.request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.has(parsedResponse.status)) ||
	        parsedResponse.request.streamResponseBody;
	    const initialErrorMessage = streaming
	        ? `Unexpected status code: ${parsedResponse.status}`
	        : parsedResponse.bodyAsText;
	    const error = new RestError(initialErrorMessage, undefined, parsedResponse.status, parsedResponse.request, parsedResponse);
	    // If the item failed but there's no error spec or default spec to deserialize the error,
	    // we should fail so we just throw the parsed response
	    if (!errorResponseSpec) {
	        throw error;
	    }
	    const defaultBodyMapper = errorResponseSpec.bodyMapper;
	    const defaultHeadersMapper = errorResponseSpec.headersMapper;
	    try {
	        // If error response has a body, try to deserialize it using default body mapper.
	        // Then try to extract error code & message from it
	        if (parsedResponse.parsedBody) {
	            const parsedBody = parsedResponse.parsedBody;
	            let parsedError;
	            if (defaultBodyMapper) {
	                let valueToDeserialize = parsedBody;
	                if (operationSpec.isXML && defaultBodyMapper.type.name === MapperType.Sequence) {
	                    valueToDeserialize =
	                        typeof parsedBody === "object" ? parsedBody[defaultBodyMapper.xmlElementName] : [];
	                }
	                parsedError = operationSpec.serializer.deserialize(defaultBodyMapper, valueToDeserialize, "error.response.parsedBody");
	            }
	            const internalError = parsedBody.error || parsedError || parsedBody;
	            error.code = internalError.code;
	            if (internalError.message) {
	                error.message = internalError.message;
	            }
	            if (defaultBodyMapper) {
	                error.response.parsedBody = parsedError;
	            }
	        }
	        // If error response has headers, try to deserialize it using default header mapper
	        if (parsedResponse.headers && defaultHeadersMapper) {
	            error.response.parsedHeaders = operationSpec.serializer.deserialize(defaultHeadersMapper, parsedResponse.headers.toJson(), "operationRes.parsedHeaders");
	        }
	    }
	    catch (defaultError) {
	        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody - "${parsedResponse.bodyAsText}" for the default response.`;
	    }
	    return { error, shouldReturnResponse: false };
	}
	function parse(jsonContentTypes, xmlContentTypes, operationResponse, opts) {
	    var _a;
	    const errorHandler = (err) => {
	        const msg = `Error "${err}" occurred while parsing the response body - ${operationResponse.bodyAsText}.`;
	        const errCode = err.code || RestError.PARSE_ERROR;
	        const e = new RestError(msg, errCode, operationResponse.status, operationResponse.request, operationResponse);
	        return Promise.reject(e);
	    };
	    const streaming = ((_a = operationResponse.request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.has(operationResponse.status)) ||
	        operationResponse.request.streamResponseBody;
	    if (!streaming && operationResponse.bodyAsText) {
	        const text = operationResponse.bodyAsText;
	        const contentType = operationResponse.headers.get("Content-Type") || "";
	        const contentComponents = !contentType
	            ? []
	            : contentType.split(";").map((component) => component.toLowerCase());
	        if (contentComponents.length === 0 ||
	            contentComponents.some((component) => jsonContentTypes.indexOf(component) !== -1)) {
	            return new Promise((resolve) => {
	                operationResponse.parsedBody = JSON.parse(text);
	                resolve(operationResponse);
	            }).catch(errorHandler);
	        }
	        else if (contentComponents.some((component) => xmlContentTypes.indexOf(component) !== -1)) {
	            return parseXML(text, opts)
	                .then((body) => {
	                operationResponse.parsedBody = body;
	                return operationResponse;
	            })
	                .catch(errorHandler);
	        }
	    }
	    return Promise.resolve(operationResponse);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * By default, HTTP connections are maintained for future requests.
	 */
	const DefaultKeepAliveOptions = {
	    enable: true,
	};
	/**
	 * Creates a policy that controls whether HTTP connections are maintained on future requests.
	 * @param keepAliveOptions - Keep alive options. By default, HTTP connections are maintained for future requests.
	 * @returns An instance of the {@link KeepAlivePolicy}
	 */
	function keepAlivePolicy(keepAliveOptions) {
	    return {
	        create: (nextPolicy, options) => {
	            return new KeepAlivePolicy(nextPolicy, options, keepAliveOptions || DefaultKeepAliveOptions);
	        },
	    };
	}
	/**
	 * KeepAlivePolicy is a policy used to control keep alive settings for every request.
	 */
	class KeepAlivePolicy extends BaseRequestPolicy {
	    /**
	     * Creates an instance of KeepAlivePolicy.
	     *
	     * @param nextPolicy -
	     * @param options -
	     * @param keepAliveOptions -
	     */
	    constructor(nextPolicy, options, keepAliveOptions) {
	        super(nextPolicy, options);
	        this.keepAliveOptions = keepAliveOptions;
	    }
	    /**
	     * Sends out request.
	     *
	     * @param request -
	     * @returns
	     */
	    async sendRequest(request) {
	        request.keepAlive = this.keepAliveOptions.enable;
	        return this._nextPolicy.sendRequest(request);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Methods that are allowed to follow redirects 301 and 302
	 */
	const allowedRedirect = ["GET", "HEAD"];
	const DefaultRedirectOptions = {
	    handleRedirects: true,
	    maxRetries: 20,
	};
	/**
	 * Creates a redirect policy, which sends a repeats the request to a new destination if a response arrives with a "location" header, and a status code between 300 and 307.
	 * @param maximumRetries - Maximum number of redirects to follow.
	 * @returns An instance of the {@link RedirectPolicy}
	 */
	function redirectPolicy(maximumRetries = 20) {
	    return {
	        create: (nextPolicy, options) => {
	            return new RedirectPolicy(nextPolicy, options, maximumRetries);
	        },
	    };
	}
	/**
	 * Resends the request to a new destination if a response arrives with a "location" header, and a status code between 300 and 307.
	 */
	class RedirectPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, maxRetries = 20) {
	        super(nextPolicy, options);
	        this.maxRetries = maxRetries;
	    }
	    sendRequest(request) {
	        return this._nextPolicy
	            .sendRequest(request)
	            .then((response) => handleRedirect(this, response, 0));
	    }
	}
	function handleRedirect(policy, response, currentRetries) {
	    const { request, status } = response;
	    const locationHeader = response.headers.get("location");
	    if (locationHeader &&
	        (status === 300 ||
	            (status === 301 && allowedRedirect.includes(request.method)) ||
	            (status === 302 && allowedRedirect.includes(request.method)) ||
	            (status === 303 && request.method === "POST") ||
	            status === 307) &&
	        (!policy.maxRetries || currentRetries < policy.maxRetries)) {
	        const builder = URLBuilder.parse(request.url);
	        builder.setPath(locationHeader);
	        request.url = builder.toString();
	        // POST request with Status code 303 should be converted into a
	        // redirected GET request if the redirect url is present in the location header
	        if (status === 303) {
	            request.method = "GET";
	            delete request.body;
	        }
	        return policy._nextPolicy
	            .sendRequest(request)
	            .then((res) => handleRedirect(policy, res, currentRetries + 1));
	    }
	    return Promise.resolve(response);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const DEFAULT_CLIENT_RETRY_COUNT = 3;
	// intervals are in ms
	const DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
	const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
	const DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
	function isNumber(n) {
	    return typeof n === "number";
	}
	/**
	 * @internal
	 * Determines if the operation should be retried.
	 *
	 * @param retryLimit - Specifies the max number of retries.
	 * @param predicate - Initial chekck on whether to retry based on given responses or errors
	 * @param retryData -  The retry data.
	 * @returns True if the operation qualifies for a retry; false otherwise.
	 */
	function shouldRetry(retryLimit, predicate, retryData, response, error) {
	    if (!predicate(response, error)) {
	        return false;
	    }
	    return retryData.retryCount < retryLimit;
	}
	/**
	 * @internal
	 * Updates the retry data for the next attempt.
	 *
	 * @param retryOptions - specifies retry interval, and its lower bound and upper bound.
	 * @param retryData -  The retry data.
	 * @param err - The operation"s error, if any.
	 */
	function updateRetryData(retryOptions, retryData = { retryCount: 0, retryInterval: 0 }, err) {
	    if (err) {
	        if (retryData.error) {
	            err.innerError = retryData.error;
	        }
	        retryData.error = err;
	    }
	    // Adjust retry count
	    retryData.retryCount++;
	    // Adjust retry interval
	    let incrementDelta = Math.pow(2, retryData.retryCount - 1) - 1;
	    const boundedRandDelta = retryOptions.retryInterval * 0.8 +
	        Math.floor(Math.random() * (retryOptions.retryInterval * 0.4));
	    incrementDelta *= boundedRandDelta;
	    retryData.retryInterval = Math.min(retryOptions.minRetryInterval + incrementDelta, retryOptions.maxRetryInterval);
	    return retryData;
	}

	// Copyright (c) Microsoft Corporation.
	const StandardAbortMessage$1 = "The operation was aborted.";
	/**
	 * A wrapper for setTimeout that resolves a promise after delayInMs milliseconds.
	 * @param delayInMs - The number of milliseconds to be delayed.
	 * @param value - The value to be resolved with after a timeout of t milliseconds.
	 * @param options - The options for delay - currently abort options
	 *   @param abortSignal - The abortSignal associated with containing operation.
	 *   @param abortErrorMsg - The abort error message associated with containing operation.
	 * @returns - Resolved promise
	 */
	function delay$1(delayInMs, value, options) {
	    return new Promise((resolve, reject) => {
	        let timer = undefined;
	        let onAborted = undefined;
	        const rejectOnAbort = () => {
	            return reject(new AbortError((options === null || options === void 0 ? void 0 : options.abortErrorMsg) ? options === null || options === void 0 ? void 0 : options.abortErrorMsg : StandardAbortMessage$1));
	        };
	        const removeListeners = () => {
	            if ((options === null || options === void 0 ? void 0 : options.abortSignal) && onAborted) {
	                options.abortSignal.removeEventListener("abort", onAborted);
	            }
	        };
	        onAborted = () => {
	            if (isDefined$1(timer)) {
	                clearTimeout(timer);
	            }
	            removeListeners();
	            return rejectOnAbort();
	        };
	        if ((options === null || options === void 0 ? void 0 : options.abortSignal) && options.abortSignal.aborted) {
	            return rejectOnAbort();
	        }
	        timer = setTimeout(() => {
	            removeListeners();
	            resolve(value);
	        }, delayInMs);
	        if (options === null || options === void 0 ? void 0 : options.abortSignal) {
	            options.abortSignal.addEventListener("abort", onAborted);
	        }
	    });
	}

	// Copyright (c) Microsoft Corporation.
	const logger = createClientLogger("core-http");

	// Copyright (c) Microsoft Corporation.
	/**
	 * Policy that retries the request as many times as configured for as long as the max retry time interval specified, each retry waiting longer to begin than the last time.
	 * @param retryCount - Maximum number of retries.
	 * @param retryInterval - Base time between retries.
	 * @param maxRetryInterval - Maximum time to wait between retries.
	 */
	function exponentialRetryPolicy(retryCount, retryInterval, maxRetryInterval) {
	    return {
	        create: (nextPolicy, options) => {
	            return new ExponentialRetryPolicy(nextPolicy, options, retryCount, retryInterval, maxRetryInterval);
	        },
	    };
	}
	/**
	 * Describes the Retry Mode type. Currently supporting only Exponential.
	 */
	var RetryMode;
	(function (RetryMode) {
	    /**
	     * Currently supported retry mode.
	     * Each time a retry happens, it will take exponentially more time than the last time.
	     */
	    RetryMode[RetryMode["Exponential"] = 0] = "Exponential";
	})(RetryMode || (RetryMode = {}));
	const DefaultRetryOptions = {
	    maxRetries: DEFAULT_CLIENT_RETRY_COUNT,
	    retryDelayInMs: DEFAULT_CLIENT_RETRY_INTERVAL,
	    maxRetryDelayInMs: DEFAULT_CLIENT_MAX_RETRY_INTERVAL,
	};
	/**
	 * Instantiates a new "ExponentialRetryPolicyFilter" instance.
	 */
	class ExponentialRetryPolicy extends BaseRequestPolicy {
	    /**
	     * @param nextPolicy - The next RequestPolicy in the pipeline chain.
	     * @param options - The options for this RequestPolicy.
	     * @param retryCount - The client retry count.
	     * @param retryInterval - The client retry interval, in milliseconds.
	     * @param minRetryInterval - The minimum retry interval, in milliseconds.
	     * @param maxRetryInterval - The maximum retry interval, in milliseconds.
	     */
	    constructor(nextPolicy, options, retryCount, retryInterval, maxRetryInterval) {
	        super(nextPolicy, options);
	        this.retryCount = isNumber(retryCount) ? retryCount : DEFAULT_CLIENT_RETRY_COUNT;
	        this.retryInterval = isNumber(retryInterval) ? retryInterval : DEFAULT_CLIENT_RETRY_INTERVAL;
	        this.maxRetryInterval = isNumber(maxRetryInterval)
	            ? maxRetryInterval
	            : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
	    }
	    sendRequest(request) {
	        return this._nextPolicy
	            .sendRequest(request.clone())
	            .then((response) => retry$1(this, request, response))
	            .catch((error) => retry$1(this, request, error.response, undefined, error));
	    }
	}
	async function retry$1(policy, request, response, retryData, requestError) {
	    function shouldPolicyRetry(responseParam) {
	        const statusCode = responseParam === null || responseParam === void 0 ? void 0 : responseParam.status;
	        if (statusCode === 503 && (response === null || response === void 0 ? void 0 : response.headers.get(Constants.HeaderConstants.RETRY_AFTER))) {
	            return false;
	        }
	        if (statusCode === undefined ||
	            (statusCode < 500 && statusCode !== 408) ||
	            statusCode === 501 ||
	            statusCode === 505) {
	            return false;
	        }
	        return true;
	    }
	    retryData = updateRetryData({
	        retryInterval: policy.retryInterval,
	        minRetryInterval: 0,
	        maxRetryInterval: policy.maxRetryInterval,
	    }, retryData, requestError);
	    const isAborted = request.abortSignal && request.abortSignal.aborted;
	    if (!isAborted && shouldRetry(policy.retryCount, shouldPolicyRetry, retryData, response)) {
	        logger.info(`Retrying request in ${retryData.retryInterval}`);
	        try {
	            await delay$1(retryData.retryInterval);
	            const res = await policy._nextPolicy.sendRequest(request.clone());
	            return retry$1(policy, request, res, retryData);
	        }
	        catch (err) {
	            return retry$1(policy, request, response, retryData, err);
	        }
	    }
	    else if (isAborted || requestError || !response) {
	        // If the operation failed in the end, return all errors instead of just the last one
	        const err = retryData.error ||
	            new RestError("Failed to send the request.", RestError.REQUEST_SEND_ERROR, response && response.status, response && response.request, response);
	        throw err;
	    }
	    else {
	        return response;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Creates a policy that logs information about the outgoing request and the incoming responses.
	 * @param loggingOptions - Logging options.
	 * @returns An instance of the {@link LogPolicy}
	 */
	function logPolicy(loggingOptions = {}) {
	    return {
	        create: (nextPolicy, options) => {
	            return new LogPolicy(nextPolicy, options, loggingOptions);
	        },
	    };
	}
	/**
	 * A policy that logs information about the outgoing request and the incoming responses.
	 */
	class LogPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, { logger: logger$1 = logger.info, allowedHeaderNames = [], allowedQueryParameters = [], } = {}) {
	        super(nextPolicy, options);
	        this.logger = logger$1;
	        this.sanitizer = new Sanitizer({ allowedHeaderNames, allowedQueryParameters });
	    }
	    /**
	     * Header names whose values will be logged when logging is enabled. Defaults to
	     * Date, traceparent, x-ms-client-request-id, and x-ms-request id.  Any headers
	     * specified in this field will be added to that list.  Any other values will
	     * be written to logs as "REDACTED".
	     * @deprecated Pass these into the constructor instead.
	     */
	    get allowedHeaderNames() {
	        return this.sanitizer.allowedHeaderNames;
	    }
	    /**
	     * Header names whose values will be logged when logging is enabled. Defaults to
	     * Date, traceparent, x-ms-client-request-id, and x-ms-request id.  Any headers
	     * specified in this field will be added to that list.  Any other values will
	     * be written to logs as "REDACTED".
	     * @deprecated Pass these into the constructor instead.
	     */
	    set allowedHeaderNames(allowedHeaderNames) {
	        this.sanitizer.allowedHeaderNames = allowedHeaderNames;
	    }
	    /**
	     * Query string names whose values will be logged when logging is enabled. By default no
	     * query string values are logged.
	     * @deprecated Pass these into the constructor instead.
	     */
	    get allowedQueryParameters() {
	        return this.sanitizer.allowedQueryParameters;
	    }
	    /**
	     * Query string names whose values will be logged when logging is enabled. By default no
	     * query string values are logged.
	     * @deprecated Pass these into the constructor instead.
	     */
	    set allowedQueryParameters(allowedQueryParameters) {
	        this.sanitizer.allowedQueryParameters = allowedQueryParameters;
	    }
	    sendRequest(request) {
	        if (!this.logger.enabled)
	            return this._nextPolicy.sendRequest(request);
	        this.logRequest(request);
	        return this._nextPolicy.sendRequest(request).then((response) => this.logResponse(response));
	    }
	    logRequest(request) {
	        this.logger(`Request: ${this.sanitizer.sanitize(request)}`);
	    }
	    logResponse(response) {
	        this.logger(`Response status code: ${response.status}`);
	        this.logger(`Headers: ${this.sanitizer.sanitize(response.headers)}`);
	        return response;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Get the path to this parameter's value as a dotted string (a.b.c).
	 * @param parameter - The parameter to get the path string for.
	 * @returns The path to this parameter's value as a dotted string.
	 */
	function getPathStringFromParameter(parameter) {
	    return getPathStringFromParameterPath(parameter.parameterPath, parameter.mapper);
	}
	function getPathStringFromParameterPath(parameterPath, mapper) {
	    let result;
	    if (typeof parameterPath === "string") {
	        result = parameterPath;
	    }
	    else if (Array.isArray(parameterPath)) {
	        result = parameterPath.join(".");
	    }
	    else {
	        result = mapper.serializedName;
	    }
	    return result;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Gets the list of status codes for streaming responses.
	 * @internal
	 */
	function getStreamResponseStatusCodes(operationSpec) {
	    const result = new Set();
	    for (const statusCode in operationSpec.responses) {
	        const operationResponse = operationSpec.responses[statusCode];
	        if (operationResponse.bodyMapper &&
	            operationResponse.bodyMapper.type.name === MapperType.Stream) {
	            result.add(Number(statusCode));
	        }
	    }
	    return result;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * A static-key-based credential that supports updating
	 * the underlying key value.
	 */
	class AzureKeyCredential {
	    /**
	     * Create an instance of an AzureKeyCredential for use
	     * with a service client.
	     *
	     * @param key - The initial value of the key to use in authentication
	     */
	    constructor(key) {
	        if (!key) {
	            throw new Error("key must be a non-empty string");
	        }
	        this._key = key;
	    }
	    /**
	     * The value of the key to be used in authentication
	     */
	    get key() {
	        return this._key;
	    }
	    /**
	     * Change the value of the key.
	     *
	     * Updates will take effect upon the next request after
	     * updating the key value.
	     *
	     * @param newKey - The new key value to be used
	     */
	    update(newKey) {
	        this._key = newKey;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Helper TypeGuard that checks if something is defined or not.
	 * @param thing - Anything
	 * @internal
	 */
	function isDefined(thing) {
	    return typeof thing !== "undefined" && thing !== null;
	}
	/**
	 * Helper TypeGuard that checks if the input is an object with the specified properties.
	 * Note: The properties may be inherited.
	 * @param thing - Anything.
	 * @param properties - The name of the properties that should appear in the object.
	 * @internal
	 */
	function isObjectWithProperties(thing, properties) {
	    if (!isDefined(thing) || typeof thing !== "object") {
	        return false;
	    }
	    for (const property of properties) {
	        if (!objectHasProperty(thing, property)) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Helper TypeGuard that checks if the input is an object with the specified property.
	 * Note: The property may be inherited.
	 * @param thing - Any object.
	 * @param property - The name of the property that should appear in the object.
	 * @internal
	 */
	function objectHasProperty(thing, property) {
	    return typeof thing === "object" && property in thing;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * A static name/key-based credential that supports updating
	 * the underlying name and key values.
	 */
	class AzureNamedKeyCredential {
	    /**
	     * Create an instance of an AzureNamedKeyCredential for use
	     * with a service client.
	     *
	     * @param name - The initial value of the name to use in authentication.
	     * @param key - The initial value of the key to use in authentication.
	     */
	    constructor(name, key) {
	        if (!name || !key) {
	            throw new TypeError("name and key must be non-empty strings");
	        }
	        this._name = name;
	        this._key = key;
	    }
	    /**
	     * The value of the key to be used in authentication.
	     */
	    get key() {
	        return this._key;
	    }
	    /**
	     * The value of the name to be used in authentication.
	     */
	    get name() {
	        return this._name;
	    }
	    /**
	     * Change the value of the key.
	     *
	     * Updates will take effect upon the next request after
	     * updating the key value.
	     *
	     * @param newName - The new name value to be used.
	     * @param newKey - The new key value to be used.
	     */
	    update(newName, newKey) {
	        if (!newName || !newKey) {
	            throw new TypeError("newName and newKey must be non-empty strings");
	        }
	        this._name = newName;
	        this._key = newKey;
	    }
	}
	/**
	 * Tests an object to determine whether it implements NamedKeyCredential.
	 *
	 * @param credential - The assumed NamedKeyCredential to be tested.
	 */
	function isNamedKeyCredential(credential) {
	    return (isObjectWithProperties(credential, ["name", "key"]) &&
	        typeof credential.key === "string" &&
	        typeof credential.name === "string");
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * A static-signature-based credential that supports updating
	 * the underlying signature value.
	 */
	class AzureSASCredential {
	    /**
	     * Create an instance of an AzureSASCredential for use
	     * with a service client.
	     *
	     * @param signature - The initial value of the shared access signature to use in authentication
	     */
	    constructor(signature) {
	        if (!signature) {
	            throw new Error("shared access signature must be a non-empty string");
	        }
	        this._signature = signature;
	    }
	    /**
	     * The value of the shared access signature to be used in authentication
	     */
	    get signature() {
	        return this._signature;
	    }
	    /**
	     * Change the value of the signature.
	     *
	     * Updates will take effect upon the next request after
	     * updating the signature value.
	     *
	     * @param newSignature - The new shared access signature value to be used
	     */
	    update(newSignature) {
	        if (!newSignature) {
	            throw new Error("shared access signature must be a non-empty string");
	        }
	        this._signature = newSignature;
	    }
	}
	/**
	 * Tests an object to determine whether it implements SASCredential.
	 *
	 * @param credential - The assumed SASCredential to be tested.
	 */
	function isSASCredential(credential) {
	    return (isObjectWithProperties(credential, ["signature"]) && typeof credential.signature === "string");
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Tests an object to determine whether it implements TokenCredential.
	 *
	 * @param credential - The assumed TokenCredential to be tested.
	 */
	function isTokenCredential(credential) {
	    // Check for an object with a 'getToken' function and possibly with
	    // a 'signRequest' function.  We do this check to make sure that
	    // a ServiceClientCredentials implementor (like TokenClientCredentials
	    // in ms-rest-nodeauth) doesn't get mistaken for a TokenCredential if
	    // it doesn't actually implement TokenCredential also.
	    const castCredential = credential;
	    return (castCredential &&
	        typeof castCredential.getToken === "function" &&
	        (castCredential.signRequest === undefined || castCredential.getToken.length > 0));
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	function getDefaultUserAgentKey() {
	    return "x-ms-useragent";
	}
	function getPlatformSpecificData() {
	    const navigator = self.navigator;
	    const osInfo = {
	        key: "OS",
	        value: (navigator.oscpu || navigator.platform).replace(" ", ""),
	    };
	    return [osInfo];
	}

	// Copyright (c) Microsoft Corporation.
	function getRuntimeInfo() {
	    const msRestRuntime = {
	        key: "core-http",
	        value: Constants.coreHttpVersion,
	    };
	    return [msRestRuntime];
	}
	function getUserAgentString(telemetryInfo, keySeparator = " ", valueSeparator = "/") {
	    return telemetryInfo
	        .map((info) => {
	        const value = info.value ? `${valueSeparator}${info.value}` : "";
	        return `${info.key}${value}`;
	    })
	        .join(keySeparator);
	}
	const getDefaultUserAgentHeaderName = getDefaultUserAgentKey;
	/**
	 * The default approach to generate user agents.
	 * Uses static information from this package, plus system information available from the runtime.
	 */
	function getDefaultUserAgentValue() {
	    const runtimeInfo = getRuntimeInfo();
	    const platformSpecificData = getPlatformSpecificData();
	    const userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
	    return userAgent;
	}
	/**
	 * Returns a policy that adds the user agent header to outgoing requests based on the given {@link TelemetryInfo}.
	 * @param userAgentData - Telemetry information.
	 * @returns A new {@link UserAgentPolicy}.
	 */
	function userAgentPolicy(userAgentData) {
	    const key = !userAgentData || userAgentData.key === undefined || userAgentData.key === null
	        ? getDefaultUserAgentKey()
	        : userAgentData.key;
	    const value = !userAgentData || userAgentData.value === undefined || userAgentData.value === null
	        ? getDefaultUserAgentValue()
	        : userAgentData.value;
	    return {
	        create: (nextPolicy, options) => {
	            return new UserAgentPolicy(nextPolicy, options, key, value);
	        },
	    };
	}
	/**
	 * A policy that adds the user agent header to outgoing requests based on the given {@link TelemetryInfo}.
	 */
	class UserAgentPolicy extends BaseRequestPolicy {
	    constructor(_nextPolicy, _options, headerKey, headerValue) {
	        super(_nextPolicy, _options);
	        this._nextPolicy = _nextPolicy;
	        this._options = _options;
	        this.headerKey = headerKey;
	        this.headerValue = headerValue;
	    }
	    sendRequest(request) {
	        this.addUserAgentHeader(request);
	        return this._nextPolicy.sendRequest(request);
	    }
	    /**
	     * Adds the user agent header to the outgoing request.
	     */
	    addUserAgentHeader(request) {
	        if (!request.headers) {
	            request.headers = new HttpHeaders();
	        }
	        if (!request.headers.get(this.headerKey) && this.headerValue) {
	            request.headers.set(this.headerKey, this.headerValue);
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The format that will be used to join an array of values together for a query parameter value.
	 */
	var QueryCollectionFormat;
	(function (QueryCollectionFormat) {
	    /**
	     * CSV: Each pair of segments joined by a single comma.
	     */
	    QueryCollectionFormat["Csv"] = ",";
	    /**
	     * SSV: Each pair of segments joined by a single space character.
	     */
	    QueryCollectionFormat["Ssv"] = " ";
	    /**
	     * TSV: Each pair of segments joined by a single tab character.
	     */
	    QueryCollectionFormat["Tsv"] = "\t";
	    /**
	     * Pipes: Each pair of segments joined by a single pipe character.
	     */
	    QueryCollectionFormat["Pipes"] = "|";
	    /**
	     * Denotes this is an array of values that should be passed to the server in multiple key/value pairs, e.g. `?queryParam=value1&queryParam=value2`
	     */
	    QueryCollectionFormat["Multi"] = "Multi";
	})(QueryCollectionFormat || (QueryCollectionFormat = {}));

	// Copyright (c) Microsoft Corporation.
	// Default options for the cycler if none are provided
	const DEFAULT_CYCLER_OPTIONS = {
	    forcedRefreshWindowInMs: 1000,
	    retryIntervalInMs: 3000,
	    refreshWindowInMs: 1000 * 60 * 2, // Start refreshing 2m before expiry
	};
	/**
	 * Converts an an unreliable access token getter (which may resolve with null)
	 * into an AccessTokenGetter by retrying the unreliable getter in a regular
	 * interval.
	 *
	 * @param getAccessToken - a function that produces a promise of an access
	 * token that may fail by returning null
	 * @param retryIntervalInMs - the time (in milliseconds) to wait between retry
	 * attempts
	 * @param timeoutInMs - the timestamp after which the refresh attempt will fail,
	 * throwing an exception
	 * @returns - a promise that, if it resolves, will resolve with an access token
	 */
	async function beginRefresh(getAccessToken, retryIntervalInMs, timeoutInMs) {
	    // This wrapper handles exceptions gracefully as long as we haven't exceeded
	    // the timeout.
	    async function tryGetAccessToken() {
	        if (Date.now() < timeoutInMs) {
	            try {
	                return await getAccessToken();
	            }
	            catch (_a) {
	                return null;
	            }
	        }
	        else {
	            const finalToken = await getAccessToken();
	            // Timeout is up, so throw if it's still null
	            if (finalToken === null) {
	                throw new Error("Failed to refresh access token.");
	            }
	            return finalToken;
	        }
	    }
	    let token = await tryGetAccessToken();
	    while (token === null) {
	        await delay$1(retryIntervalInMs);
	        token = await tryGetAccessToken();
	    }
	    return token;
	}
	/**
	 * Creates a token cycler from a credential, scopes, and optional settings.
	 *
	 * A token cycler represents a way to reliably retrieve a valid access token
	 * from a TokenCredential. It will handle initializing the token, refreshing it
	 * when it nears expiration, and synchronizes refresh attempts to avoid
	 * concurrency hazards.
	 *
	 * @param credential - the underlying TokenCredential that provides the access
	 * token
	 * @param scopes - the scopes to request authorization for
	 * @param tokenCyclerOptions - optionally override default settings for the cycler
	 *
	 * @returns - a function that reliably produces a valid access token
	 */
	function createTokenCycler(credential, scopes, tokenCyclerOptions) {
	    let refreshWorker = null;
	    let token = null;
	    const options = Object.assign(Object.assign({}, DEFAULT_CYCLER_OPTIONS), tokenCyclerOptions);
	    /**
	     * This little holder defines several predicates that we use to construct
	     * the rules of refreshing the token.
	     */
	    const cycler = {
	        /**
	         * Produces true if a refresh job is currently in progress.
	         */
	        get isRefreshing() {
	            return refreshWorker !== null;
	        },
	        /**
	         * Produces true if the cycler SHOULD refresh (we are within the refresh
	         * window and not already refreshing)
	         */
	        get shouldRefresh() {
	            var _a;
	            return (!cycler.isRefreshing &&
	                ((_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : 0) - options.refreshWindowInMs < Date.now());
	        },
	        /**
	         * Produces true if the cycler MUST refresh (null or nearly-expired
	         * token).
	         */
	        get mustRefresh() {
	            return (token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now());
	        },
	    };
	    /**
	     * Starts a refresh job or returns the existing job if one is already
	     * running.
	     */
	    function refresh(getTokenOptions) {
	        var _a;
	        if (!cycler.isRefreshing) {
	            // We bind `scopes` here to avoid passing it around a lot
	            const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
	            // Take advantage of promise chaining to insert an assignment to `token`
	            // before the refresh can be considered done.
	            refreshWorker = beginRefresh(tryGetAccessToken, options.retryIntervalInMs, 
	            // If we don't have a token, then we should timeout immediately
	            (_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : Date.now())
	                .then((_token) => {
	                refreshWorker = null;
	                token = _token;
	                return token;
	            })
	                .catch((reason) => {
	                // We also should reset the refresher if we enter a failed state.  All
	                // existing awaiters will throw, but subsequent requests will start a
	                // new retry chain.
	                refreshWorker = null;
	                token = null;
	                throw reason;
	            });
	        }
	        return refreshWorker;
	    }
	    return async (tokenOptions) => {
	        //
	        // Simple rules:
	        // - If we MUST refresh, then return the refresh task, blocking
	        //   the pipeline until a token is available.
	        // - If we SHOULD refresh, then run refresh but don't return it
	        //   (we can still use the cached token).
	        // - Return the token, since it's fine if we didn't return in
	        //   step 1.
	        //
	        if (cycler.mustRefresh)
	            return refresh(tokenOptions);
	        if (cycler.shouldRefresh) {
	            refresh(tokenOptions);
	        }
	        return token;
	    };
	}
	// #endregion
	/**
	 * Creates a new factory for a RequestPolicy that applies a bearer token to
	 * the requests' `Authorization` headers.
	 *
	 * @param credential - The TokenCredential implementation that can supply the bearer token.
	 * @param scopes - The scopes for which the bearer token applies.
	 */
	function bearerTokenAuthenticationPolicy(credential, scopes) {
	    // This simple function encapsulates the entire process of reliably retrieving the token
	    const getToken = createTokenCycler(credential, scopes /* , options */);
	    class BearerTokenAuthenticationPolicy extends BaseRequestPolicy {
	        constructor(nextPolicy, options) {
	            super(nextPolicy, options);
	        }
	        async sendRequest(webResource) {
	            if (!webResource.url.toLowerCase().startsWith("https://")) {
	                throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
	            }
	            const { token } = await getToken({
	                abortSignal: webResource.abortSignal,
	                tracingOptions: {
	                    tracingContext: webResource.tracingContext,
	                },
	            });
	            webResource.headers.set(Constants.HeaderConstants.AUTHORIZATION, `Bearer ${token}`);
	            return this._nextPolicy.sendRequest(webResource);
	        }
	    }
	    return {
	        create: (nextPolicy, options) => {
	            return new BearerTokenAuthenticationPolicy(nextPolicy, options);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	const DisbleResponseDecompressionNotSupportedInBrowser = new Error("DisableResponseDecompressionPolicy is not supported in browser environment");
	/**
	 * {@link DisableResponseDecompressionPolicy} is not supported in browser and attempting
	 * to use it will results in error being thrown.
	 */
	function disableResponseDecompressionPolicy() {
	    return {
	        create: (_nextPolicy, _options) => {
	            throw DisbleResponseDecompressionNotSupportedInBrowser;
	        },
	    };
	}
	class DisableResponseDecompressionPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options) {
	        super(nextPolicy, options);
	        throw DisbleResponseDecompressionNotSupportedInBrowser;
	    }
	    async sendRequest(_request) {
	        throw DisbleResponseDecompressionNotSupportedInBrowser;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Creates a policy that assigns a unique request id to outgoing requests.
	 * @param requestIdHeaderName - The name of the header to use when assigning the unique id to the request.
	 */
	function generateClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
	    return {
	        create: (nextPolicy, options) => {
	            return new GenerateClientRequestIdPolicy(nextPolicy, options, requestIdHeaderName);
	        },
	    };
	}
	class GenerateClientRequestIdPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, _requestIdHeaderName) {
	        super(nextPolicy, options);
	        this._requestIdHeaderName = _requestIdHeaderName;
	    }
	    sendRequest(request) {
	        if (!request.headers.contains(this._requestIdHeaderName)) {
	            request.headers.set(this._requestIdHeaderName, request.requestId);
	        }
	        return this._nextPolicy.sendRequest(request);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	let cachedHttpClient;
	function getCachedDefaultHttpClient() {
	    if (!cachedHttpClient) {
	        cachedHttpClient = new XhrHttpClient();
	    }
	    return cachedHttpClient;
	}

	// Copyright (c) Microsoft Corporation.
	function ndJsonPolicy() {
	    return {
	        create: (nextPolicy, options) => {
	            return new NdJsonPolicy(nextPolicy, options);
	        },
	    };
	}
	/**
	 * NdJsonPolicy that formats a JSON array as newline-delimited JSON
	 */
	class NdJsonPolicy extends BaseRequestPolicy {
	    /**
	     * Creates an instance of KeepAlivePolicy.
	     */
	    constructor(nextPolicy, options) {
	        super(nextPolicy, options);
	    }
	    /**
	     * Sends a request.
	     */
	    async sendRequest(request) {
	        // There currently isn't a good way to bypass the serializer
	        if (typeof request.body === "string" && request.body.startsWith("[")) {
	            const body = JSON.parse(request.body);
	            if (Array.isArray(body)) {
	                request.body = body.map((item) => JSON.stringify(item) + "\n").join("");
	            }
	        }
	        return this._nextPolicy.sendRequest(request);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	const proxyNotSupportedInBrowser = new Error("ProxyPolicy is not supported in browser environment");
	function getDefaultProxySettings(_proxyUrl) {
	    return undefined;
	}
	function proxyPolicy(_proxySettings) {
	    return {
	        create: (_nextPolicy, _options) => {
	            throw proxyNotSupportedInBrowser;
	        },
	    };
	}
	class ProxyPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options) {
	        super(nextPolicy, options);
	        throw proxyNotSupportedInBrowser;
	    }
	    sendRequest(_request) {
	        throw proxyNotSupportedInBrowser;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	function rpRegistrationPolicy(retryTimeout = 30) {
	    return {
	        create: (nextPolicy, options) => {
	            return new RPRegistrationPolicy(nextPolicy, options, retryTimeout);
	        },
	    };
	}
	class RPRegistrationPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, _retryTimeout = 30) {
	        super(nextPolicy, options);
	        this._retryTimeout = _retryTimeout;
	    }
	    sendRequest(request) {
	        return this._nextPolicy
	            .sendRequest(request.clone())
	            .then((response) => registerIfNeeded(this, request, response));
	    }
	}
	function registerIfNeeded(policy, request, response) {
	    if (response.status === 409) {
	        const rpName = checkRPNotRegisteredError(response.bodyAsText);
	        if (rpName) {
	            const urlPrefix = extractSubscriptionUrl(request.url);
	            return (registerRP(policy, urlPrefix, rpName, request)
	                // Autoregistration of ${provider} failed for some reason. We will not return this error
	                // instead will return the initial response with 409 status code back to the user.
	                // do nothing here as we are returning the original response at the end of this method.
	                .catch(() => false)
	                .then((registrationStatus) => {
	                if (registrationStatus) {
	                    // Retry the original request. We have to change the x-ms-client-request-id
	                    // otherwise Azure endpoint will return the initial 409 (cached) response.
	                    request.headers.set("x-ms-client-request-id", generateUuid());
	                    return policy._nextPolicy.sendRequest(request.clone());
	                }
	                return response;
	            }));
	        }
	    }
	    return Promise.resolve(response);
	}
	/**
	 * Reuses the headers of the original request and url (if specified).
	 * @param originalRequest - The original request
	 * @param reuseUrlToo - Should the url from the original request be reused as well. Default false.
	 * @returns A new request object with desired headers.
	 */
	function getRequestEssentials(originalRequest, reuseUrlToo = false) {
	    const reqOptions = originalRequest.clone();
	    if (reuseUrlToo) {
	        reqOptions.url = originalRequest.url;
	    }
	    // We have to change the x-ms-client-request-id otherwise Azure endpoint
	    // will return the initial 409 (cached) response.
	    reqOptions.headers.set("x-ms-client-request-id", generateUuid());
	    // Set content-type to application/json
	    reqOptions.headers.set("Content-Type", "application/json; charset=utf-8");
	    return reqOptions;
	}
	/**
	 * Validates the error code and message associated with 409 response status code. If it matches to that of
	 * RP not registered then it returns the name of the RP else returns undefined.
	 * @param body - The response body received after making the original request.
	 * @returns The name of the RP if condition is satisfied else undefined.
	 */
	function checkRPNotRegisteredError(body) {
	    let result, responseBody;
	    if (body) {
	        try {
	            responseBody = JSON.parse(body);
	        }
	        catch (err) {
	            // do nothing;
	        }
	        if (responseBody &&
	            responseBody.error &&
	            responseBody.error.message &&
	            responseBody.error.code &&
	            responseBody.error.code === "MissingSubscriptionRegistration") {
	            const matchRes = responseBody.error.message.match(/.*'(.*)'/i);
	            if (matchRes) {
	                result = matchRes.pop();
	            }
	        }
	    }
	    return result;
	}
	/**
	 * Extracts the first part of the URL, just after subscription:
	 * https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
	 * @param url - The original request url
	 * @returns The url prefix as explained above.
	 */
	function extractSubscriptionUrl(url) {
	    let result;
	    const matchRes = url.match(/.*\/subscriptions\/[a-f0-9-]+\//gi);
	    if (matchRes && matchRes[0]) {
	        result = matchRes[0];
	    }
	    else {
	        throw new Error(`Unable to extract subscriptionId from the given url - ${url}.`);
	    }
	    return result;
	}
	/**
	 * Registers the given provider.
	 * @param policy - The RPRegistrationPolicy this function is being called against.
	 * @param urlPrefix - https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
	 * @param provider - The provider name to be registered.
	 * @param originalRequest - The original request sent by the user that returned a 409 response
	 * with a message that the provider is not registered.
	 */
	async function registerRP(policy, urlPrefix, provider, originalRequest) {
	    const postUrl = `${urlPrefix}providers/${provider}/register?api-version=2016-02-01`;
	    const getUrl = `${urlPrefix}providers/${provider}?api-version=2016-02-01`;
	    const reqOptions = getRequestEssentials(originalRequest);
	    reqOptions.method = "POST";
	    reqOptions.url = postUrl;
	    const response = await policy._nextPolicy.sendRequest(reqOptions);
	    if (response.status !== 200) {
	        throw new Error(`Autoregistration of ${provider} failed. Please try registering manually.`);
	    }
	    return getRegistrationStatus(policy, getUrl, originalRequest);
	}
	/**
	 * Polls the registration status of the provider that was registered. Polling happens at an interval of 30 seconds.
	 * Polling will happen till the registrationState property of the response body is "Registered".
	 * @param policy - The RPRegistrationPolicy this function is being called against.
	 * @param url - The request url for polling
	 * @param originalRequest - The original request sent by the user that returned a 409 response
	 * with a message that the provider is not registered.
	 * @returns True if RP Registration is successful.
	 */
	async function getRegistrationStatus(policy, url, originalRequest) {
	    const reqOptions = getRequestEssentials(originalRequest);
	    reqOptions.url = url;
	    reqOptions.method = "GET";
	    const res = await policy._nextPolicy.sendRequest(reqOptions);
	    const obj = res.parsedBody;
	    if (res.parsedBody && obj.registrationState && obj.registrationState === "Registered") {
	        return true;
	    }
	    else {
	        await delay$1(policy._retryTimeout * 1000);
	        return getRegistrationStatus(policy, url, originalRequest);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Creates a policy that signs outgoing requests by calling to the provided `authenticationProvider`'s `signRequest` method.
	 * @param authenticationProvider - The authentication provider.
	 * @returns An instance of the {@link SigningPolicy}.
	 */
	function signingPolicy(authenticationProvider) {
	    return {
	        create: (nextPolicy, options) => {
	            return new SigningPolicy(nextPolicy, options, authenticationProvider);
	        },
	    };
	}
	/**
	 * A policy that signs outgoing requests by calling to the provided `authenticationProvider`'s `signRequest` method.
	 */
	class SigningPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, authenticationProvider) {
	        super(nextPolicy, options);
	        this.authenticationProvider = authenticationProvider;
	    }
	    signRequest(request) {
	        return this.authenticationProvider.signRequest(request);
	    }
	    sendRequest(request) {
	        return this.signRequest(request).then((nextRequest) => this._nextPolicy.sendRequest(nextRequest));
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * A policy that retries when there's a system error, identified by the codes "ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET" or "ENOENT".
	 * @param retryCount - Maximum number of retries.
	 * @param retryInterval - The client retry interval, in milliseconds.
	 * @param minRetryInterval - The minimum retry interval, in milliseconds.
	 * @param maxRetryInterval - The maximum retry interval, in milliseconds.
	 * @returns An instance of the {@link SystemErrorRetryPolicy}
	 */
	function systemErrorRetryPolicy(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
	    return {
	        create: (nextPolicy, options) => {
	            return new SystemErrorRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval);
	        },
	    };
	}
	/**
	 * A policy that retries when there's a system error, identified by the codes "ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET" or "ENOENT".
	 * @param retryCount - The client retry count.
	 * @param retryInterval - The client retry interval, in milliseconds.
	 * @param minRetryInterval - The minimum retry interval, in milliseconds.
	 * @param maxRetryInterval - The maximum retry interval, in milliseconds.
	 */
	class SystemErrorRetryPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
	        super(nextPolicy, options);
	        this.retryCount = isNumber(retryCount) ? retryCount : DEFAULT_CLIENT_RETRY_COUNT;
	        this.retryInterval = isNumber(retryInterval) ? retryInterval : DEFAULT_CLIENT_RETRY_INTERVAL;
	        this.minRetryInterval = isNumber(minRetryInterval)
	            ? minRetryInterval
	            : DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
	        this.maxRetryInterval = isNumber(maxRetryInterval)
	            ? maxRetryInterval
	            : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
	    }
	    sendRequest(request) {
	        return this._nextPolicy
	            .sendRequest(request.clone())
	            .catch((error) => retry(this, request, error.response, error));
	    }
	}
	async function retry(policy, request, operationResponse, err, retryData) {
	    retryData = updateRetryData(policy, retryData, err);
	    function shouldPolicyRetry(_response, error) {
	        if (error &&
	            error.code &&
	            (error.code === "ETIMEDOUT" ||
	                error.code === "ESOCKETTIMEDOUT" ||
	                error.code === "ECONNREFUSED" ||
	                error.code === "ECONNRESET" ||
	                error.code === "ENOENT")) {
	            return true;
	        }
	        return false;
	    }
	    if (shouldRetry(policy.retryCount, shouldPolicyRetry, retryData, operationResponse, err)) {
	        // If previous operation ended with an error and the policy allows a retry, do that
	        try {
	            await delay$1(retryData.retryInterval);
	            return policy._nextPolicy.sendRequest(request.clone());
	        }
	        catch (nestedErr) {
	            return retry(policy, request, operationResponse, nestedErr, retryData);
	        }
	    }
	    else {
	        if (err) {
	            // If the operation failed in the end, return all errors instead of just the last one
	            return Promise.reject(retryData.error);
	        }
	        return operationResponse;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Maximum number of retries for the throttling retry policy
	 */
	const DEFAULT_CLIENT_MAX_RETRY_COUNT = 3;

	// Copyright (c) Microsoft Corporation.
	const StatusCodes = Constants.HttpConstants.StatusCodes;
	/**
	 * Creates a policy that re-sends the request if the response indicates the request failed because of throttling reasons.
	 * For example, if the response contains a `Retry-After` header, it will retry sending the request based on the value of that header.
	 *
	 * To learn more, please refer to
	 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
	 * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
	 * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
	 * @returns
	 */
	function throttlingRetryPolicy() {
	    return {
	        create: (nextPolicy, options) => {
	            return new ThrottlingRetryPolicy(nextPolicy, options);
	        },
	    };
	}
	const StandardAbortMessage = "The operation was aborted.";
	/**
	 * Creates a policy that re-sends the request if the response indicates the request failed because of throttling reasons.
	 * For example, if the response contains a `Retry-After` header, it will retry sending the request based on the value of that header.
	 *
	 * To learn more, please refer to
	 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
	 * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
	 * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
	 */
	class ThrottlingRetryPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, _handleResponse) {
	        super(nextPolicy, options);
	        this.numberOfRetries = 0;
	        this._handleResponse = _handleResponse || this._defaultResponseHandler;
	    }
	    async sendRequest(httpRequest) {
	        const response = await this._nextPolicy.sendRequest(httpRequest.clone());
	        if (response.status !== StatusCodes.TooManyRequests &&
	            response.status !== StatusCodes.ServiceUnavailable) {
	            return response;
	        }
	        else {
	            return this._handleResponse(httpRequest, response);
	        }
	    }
	    async _defaultResponseHandler(httpRequest, httpResponse) {
	        var _a;
	        const retryAfterHeader = httpResponse.headers.get(Constants.HeaderConstants.RETRY_AFTER);
	        if (retryAfterHeader) {
	            const delayInMs = ThrottlingRetryPolicy.parseRetryAfterHeader(retryAfterHeader);
	            if (delayInMs) {
	                this.numberOfRetries += 1;
	                await delay$1(delayInMs, undefined, {
	                    abortSignal: httpRequest.abortSignal,
	                    abortErrorMsg: StandardAbortMessage,
	                });
	                if ((_a = httpRequest.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) {
	                    throw new AbortError(StandardAbortMessage);
	                }
	                if (this.numberOfRetries < DEFAULT_CLIENT_MAX_RETRY_COUNT) {
	                    return this.sendRequest(httpRequest);
	                }
	                else {
	                    return this._nextPolicy.sendRequest(httpRequest);
	                }
	            }
	        }
	        return httpResponse;
	    }
	    static parseRetryAfterHeader(headerValue) {
	        const retryAfterInSeconds = Number(headerValue);
	        if (Number.isNaN(retryAfterInSeconds)) {
	            return ThrottlingRetryPolicy.parseDateRetryAfterHeader(headerValue);
	        }
	        else {
	            return retryAfterInSeconds * 1000;
	        }
	    }
	    static parseDateRetryAfterHeader(headerValue) {
	        try {
	            const now = Date.now();
	            const date = Date.parse(headerValue);
	            const diff = date - now;
	            return Number.isNaN(diff) ? undefined : diff;
	        }
	        catch (error) {
	            return undefined;
	        }
	    }
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	// Updates to this file should also be replicated to @opentelemetry/api-metrics and
	// @opentelemetry/core too.
	/**
	 * - globalThis (New standard)
	 * - self (Will return the current window instance for supported browsers)
	 * - window (fallback for older browser implementations)
	 * - global (NodeJS implementation)
	 * - <object> (When all else fails)
	 */
	/** only globals that common to node and browsers are allowed */
	// eslint-disable-next-line node/no-unsupported-features/es-builtins, no-undef
	var _globalThis = typeof globalThis === 'object' ? globalThis :
	    typeof self === 'object' ? self :
	        typeof window === 'object' ? window :
	            typeof global === 'object' ? global :
	                {};

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	// this is autogenerated file, see scripts/version-update.js
	var VERSION$1 = '1.2.0';

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
	/**
	 * Create a function to test an API version to see if it is compatible with the provided ownVersion.
	 *
	 * The returned function has the following semantics:
	 * - Exact match is always compatible
	 * - Major versions must match exactly
	 *    - 1.x package cannot use global 2.x package
	 *    - 2.x package cannot use global 1.x package
	 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
	 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
	 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
	 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
	 * - Patch and build tag differences are not considered at this time
	 *
	 * @param ownVersion version which should be checked against
	 */
	function _makeCompatibilityCheck(ownVersion) {
	    var acceptedVersions = new Set([ownVersion]);
	    var rejectedVersions = new Set();
	    var myVersionMatch = ownVersion.match(re);
	    if (!myVersionMatch) {
	        // we cannot guarantee compatibility so we always return noop
	        return function () { return false; };
	    }
	    var ownVersionParsed = {
	        major: +myVersionMatch[1],
	        minor: +myVersionMatch[2],
	        patch: +myVersionMatch[3],
	        prerelease: myVersionMatch[4],
	    };
	    // if ownVersion has a prerelease tag, versions must match exactly
	    if (ownVersionParsed.prerelease != null) {
	        return function isExactmatch(globalVersion) {
	            return globalVersion === ownVersion;
	        };
	    }
	    function _reject(v) {
	        rejectedVersions.add(v);
	        return false;
	    }
	    function _accept(v) {
	        acceptedVersions.add(v);
	        return true;
	    }
	    return function isCompatible(globalVersion) {
	        if (acceptedVersions.has(globalVersion)) {
	            return true;
	        }
	        if (rejectedVersions.has(globalVersion)) {
	            return false;
	        }
	        var globalVersionMatch = globalVersion.match(re);
	        if (!globalVersionMatch) {
	            // cannot parse other version
	            // we cannot guarantee compatibility so we always noop
	            return _reject(globalVersion);
	        }
	        var globalVersionParsed = {
	            major: +globalVersionMatch[1],
	            minor: +globalVersionMatch[2],
	            patch: +globalVersionMatch[3],
	            prerelease: globalVersionMatch[4],
	        };
	        // if globalVersion has a prerelease tag, versions must match exactly
	        if (globalVersionParsed.prerelease != null) {
	            return _reject(globalVersion);
	        }
	        // major versions must match
	        if (ownVersionParsed.major !== globalVersionParsed.major) {
	            return _reject(globalVersion);
	        }
	        if (ownVersionParsed.major === 0) {
	            if (ownVersionParsed.minor === globalVersionParsed.minor &&
	                ownVersionParsed.patch <= globalVersionParsed.patch) {
	                return _accept(globalVersion);
	            }
	            return _reject(globalVersion);
	        }
	        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
	            return _accept(globalVersion);
	        }
	        return _reject(globalVersion);
	    };
	}
	/**
	 * Test an API version to see if it is compatible with this API.
	 *
	 * - Exact match is always compatible
	 * - Major versions must match exactly
	 *    - 1.x package cannot use global 2.x package
	 *    - 2.x package cannot use global 1.x package
	 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
	 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
	 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
	 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
	 * - Patch and build tag differences are not considered at this time
	 *
	 * @param version version of the API requesting an instance of the global API
	 */
	var isCompatible = _makeCompatibilityCheck(VERSION$1);

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var major = VERSION$1.split('.')[0];
	var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
	var _global = _globalThis;
	function registerGlobal(type, instance, diag, allowOverride) {
	    var _a;
	    if (allowOverride === void 0) { allowOverride = false; }
	    var api = (_global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
	        version: VERSION$1,
	    });
	    if (!allowOverride && api[type]) {
	        // already registered an API of this type
	        var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
	        diag.error(err.stack || err.message);
	        return false;
	    }
	    if (api.version !== VERSION$1) {
	        // All registered APIs must be of the same version exactly
	        var err = new Error('@opentelemetry/api: All API registration versions must match');
	        diag.error(err.stack || err.message);
	        return false;
	    }
	    api[type] = instance;
	    diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION$1 + ".");
	    return true;
	}
	function getGlobal(type) {
	    var _a, _b;
	    var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
	    if (!globalVersion || !isCompatible(globalVersion)) {
	        return;
	    }
	    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
	}
	function unregisterGlobal(type, diag) {
	    diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION$1 + ".");
	    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	    if (api) {
	        delete api[type];
	    }
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Component Logger which is meant to be used as part of any component which
	 * will add automatically additional namespace in front of the log message.
	 * It will then forward all message to global diag logger
	 * @example
	 * const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
	 * cLogger.debug('test');
	 * // @opentelemetry/instrumentation-http test
	 */
	var DiagComponentLogger = /** @class */ (function () {
	    function DiagComponentLogger(props) {
	        this._namespace = props.namespace || 'DiagComponentLogger';
	    }
	    DiagComponentLogger.prototype.debug = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return logProxy('debug', this._namespace, args);
	    };
	    DiagComponentLogger.prototype.error = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return logProxy('error', this._namespace, args);
	    };
	    DiagComponentLogger.prototype.info = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return logProxy('info', this._namespace, args);
	    };
	    DiagComponentLogger.prototype.warn = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return logProxy('warn', this._namespace, args);
	    };
	    DiagComponentLogger.prototype.verbose = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return logProxy('verbose', this._namespace, args);
	    };
	    return DiagComponentLogger;
	}());
	function logProxy(funcName, namespace, args) {
	    var logger = getGlobal('diag');
	    // shortcut if logger not set
	    if (!logger) {
	        return;
	    }
	    args.unshift(namespace);
	    return logger[funcName].apply(logger, args);
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Defines the available internal logging levels for the diagnostic logger, the numeric values
	 * of the levels are defined to match the original values from the initial LogLevel to avoid
	 * compatibility/migration issues for any implementation that assume the numeric ordering.
	 */
	var DiagLogLevel;
	(function (DiagLogLevel) {
	    /** Diagnostic Logging level setting to disable all logging (except and forced logs) */
	    DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
	    /** Identifies an error scenario */
	    DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
	    /** Identifies a warning scenario */
	    DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
	    /** General informational log message */
	    DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
	    /** General debug log message */
	    DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
	    /**
	     * Detailed trace level logging should only be used for development, should only be set
	     * in a development environment.
	     */
	    DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
	    /** Used to set the logging level to include all logging */
	    DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
	})(DiagLogLevel || (DiagLogLevel = {}));

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	function createLogLevelDiagLogger(maxLevel, logger) {
	    if (maxLevel < DiagLogLevel.NONE) {
	        maxLevel = DiagLogLevel.NONE;
	    }
	    else if (maxLevel > DiagLogLevel.ALL) {
	        maxLevel = DiagLogLevel.ALL;
	    }
	    // In case the logger is null or undefined
	    logger = logger || {};
	    function _filterFunc(funcName, theLevel) {
	        var theFunc = logger[funcName];
	        if (typeof theFunc === 'function' && maxLevel >= theLevel) {
	            return theFunc.bind(logger);
	        }
	        return function () { };
	    }
	    return {
	        error: _filterFunc('error', DiagLogLevel.ERROR),
	        warn: _filterFunc('warn', DiagLogLevel.WARN),
	        info: _filterFunc('info', DiagLogLevel.INFO),
	        debug: _filterFunc('debug', DiagLogLevel.DEBUG),
	        verbose: _filterFunc('verbose', DiagLogLevel.VERBOSE),
	    };
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var API_NAME$3 = 'diag';
	/**
	 * Singleton object which represents the entry point to the OpenTelemetry internal
	 * diagnostic API
	 */
	var DiagAPI = /** @class */ (function () {
	    /**
	     * Private internal constructor
	     * @private
	     */
	    function DiagAPI() {
	        function _logProxy(funcName) {
	            return function () {
	                var args = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    args[_i] = arguments[_i];
	                }
	                var logger = getGlobal('diag');
	                // shortcut if logger not set
	                if (!logger)
	                    return;
	                return logger[funcName].apply(logger, args);
	            };
	        }
	        // Using self local variable for minification purposes as 'this' cannot be minified
	        var self = this;
	        // DiagAPI specific functions
	        self.setLogger = function (logger, logLevel) {
	            var _a, _b;
	            if (logLevel === void 0) { logLevel = DiagLogLevel.INFO; }
	            if (logger === self) {
	                // There isn't much we can do here.
	                // Logging to the console might break the user application.
	                // Try to log to self. If a logger was previously registered it will receive the log.
	                var err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
	                self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
	                return false;
	            }
	            var oldLogger = getGlobal('diag');
	            var newLogger = createLogLevelDiagLogger(logLevel, logger);
	            // There already is an logger registered. We'll let it know before overwriting it.
	            if (oldLogger) {
	                var stack = (_b = new Error().stack) !== null && _b !== void 0 ? _b : '<failed to generate stacktrace>';
	                oldLogger.warn("Current logger will be overwritten from " + stack);
	                newLogger.warn("Current logger will overwrite one already registered from " + stack);
	            }
	            return registerGlobal('diag', newLogger, self, true);
	        };
	        self.disable = function () {
	            unregisterGlobal(API_NAME$3, self);
	        };
	        self.createComponentLogger = function (options) {
	            return new DiagComponentLogger(options);
	        };
	        self.verbose = _logProxy('verbose');
	        self.debug = _logProxy('debug');
	        self.info = _logProxy('info');
	        self.warn = _logProxy('warn');
	        self.error = _logProxy('error');
	    }
	    /** Get the singleton instance of the DiagAPI API */
	    DiagAPI.instance = function () {
	        if (!this._instance) {
	            this._instance = new DiagAPI();
	        }
	        return this._instance;
	    };
	    return DiagAPI;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var BaggageImpl = /** @class */ (function () {
	    function BaggageImpl(entries) {
	        this._entries = entries ? new Map(entries) : new Map();
	    }
	    BaggageImpl.prototype.getEntry = function (key) {
	        var entry = this._entries.get(key);
	        if (!entry) {
	            return undefined;
	        }
	        return Object.assign({}, entry);
	    };
	    BaggageImpl.prototype.getAllEntries = function () {
	        return Array.from(this._entries.entries()).map(function (_a) {
	            var k = _a[0], v = _a[1];
	            return [k, v];
	        });
	    };
	    BaggageImpl.prototype.setEntry = function (key, entry) {
	        var newBaggage = new BaggageImpl(this._entries);
	        newBaggage._entries.set(key, entry);
	        return newBaggage;
	    };
	    BaggageImpl.prototype.removeEntry = function (key) {
	        var newBaggage = new BaggageImpl(this._entries);
	        newBaggage._entries.delete(key);
	        return newBaggage;
	    };
	    BaggageImpl.prototype.removeEntries = function () {
	        var keys = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            keys[_i] = arguments[_i];
	        }
	        var newBaggage = new BaggageImpl(this._entries);
	        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
	            var key = keys_1[_a];
	            newBaggage._entries.delete(key);
	        }
	        return newBaggage;
	    };
	    BaggageImpl.prototype.clear = function () {
	        return new BaggageImpl();
	    };
	    return BaggageImpl;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Symbol used to make BaggageEntryMetadata an opaque type
	 */
	var baggageEntryMetadataSymbol = Symbol('BaggageEntryMetadata');

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var diag$1 = DiagAPI.instance();
	/**
	 * Create a new Baggage with optional entries
	 *
	 * @param entries An array of baggage entries the new baggage should contain
	 */
	function createBaggage(entries) {
	    if (entries === void 0) { entries = {}; }
	    return new BaggageImpl(new Map(Object.entries(entries)));
	}
	/**
	 * Create a serializable BaggageEntryMetadata object from a string.
	 *
	 * @param str string metadata. Format is currently not defined by the spec and has no special meaning.
	 *
	 */
	function baggageEntryMetadataFromString(str) {
	    if (typeof str !== 'string') {
	        diag$1.error("Cannot create baggage metadata from unknown type: " + typeof str);
	        str = '';
	    }
	    return {
	        __TYPE__: baggageEntryMetadataSymbol,
	        toString: function () {
	            return str;
	        },
	    };
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var consoleMap = [
	    { n: 'error', c: 'error' },
	    { n: 'warn', c: 'warn' },
	    { n: 'info', c: 'info' },
	    { n: 'debug', c: 'debug' },
	    { n: 'verbose', c: 'trace' },
	];
	/**
	 * A simple Immutable Console based diagnostic logger which will output any messages to the Console.
	 * If you want to limit the amount of logging to a specific level or lower use the
	 * {@link createLogLevelDiagLogger}
	 */
	var DiagConsoleLogger = /** @class */ (function () {
	    function DiagConsoleLogger() {
	        function _consoleFunc(funcName) {
	            return function () {
	                var args = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    args[_i] = arguments[_i];
	                }
	                if (console) {
	                    // Some environments only expose the console when the F12 developer console is open
	                    // eslint-disable-next-line no-console
	                    var theFunc = console[funcName];
	                    if (typeof theFunc !== 'function') {
	                        // Not all environments support all functions
	                        // eslint-disable-next-line no-console
	                        theFunc = console.log;
	                    }
	                    // One last final check
	                    if (typeof theFunc === 'function') {
	                        return theFunc.apply(console, args);
	                    }
	                }
	            };
	        }
	        for (var i = 0; i < consoleMap.length; i++) {
	            this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
	        }
	    }
	    return DiagConsoleLogger;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var defaultTextMapGetter = {
	    get: function (carrier, key) {
	        if (carrier == null) {
	            return undefined;
	        }
	        return carrier[key];
	    },
	    keys: function (carrier) {
	        if (carrier == null) {
	            return [];
	        }
	        return Object.keys(carrier);
	    },
	};
	var defaultTextMapSetter = {
	    set: function (carrier, key, value) {
	        if (carrier == null) {
	            return;
	        }
	        carrier[key] = value;
	    },
	};

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/** Get a key to uniquely identify a context value */
	function createContextKey(description) {
	    // The specification states that for the same input, multiple calls should
	    // return different keys. Due to the nature of the JS dependency management
	    // system, this creates problems where multiple versions of some package
	    // could hold different keys for the same property.
	    //
	    // Therefore, we use Symbol.for which returns the same key for the same input.
	    return Symbol.for(description);
	}
	var BaseContext = /** @class */ (function () {
	    /**
	     * Construct a new context which inherits values from an optional parent context.
	     *
	     * @param parentContext a context from which to inherit values
	     */
	    function BaseContext(parentContext) {
	        // for minification
	        var self = this;
	        self._currentContext = parentContext ? new Map(parentContext) : new Map();
	        self.getValue = function (key) { return self._currentContext.get(key); };
	        self.setValue = function (key, value) {
	            var context = new BaseContext(self._currentContext);
	            context._currentContext.set(key, value);
	            return context;
	        };
	        self.deleteValue = function (key) {
	            var context = new BaseContext(self._currentContext);
	            context._currentContext.delete(key);
	            return context;
	        };
	    }
	    return BaseContext;
	}());
	/** The root context is used as the default parent context when there is no active context */
	var ROOT_CONTEXT = new BaseContext();

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from) {
	    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
	        to[j] = from[i];
	    return to;
	};
	var NoopContextManager = /** @class */ (function () {
	    function NoopContextManager() {
	    }
	    NoopContextManager.prototype.active = function () {
	        return ROOT_CONTEXT;
	    };
	    NoopContextManager.prototype.with = function (_context, fn, thisArg) {
	        var args = [];
	        for (var _i = 3; _i < arguments.length; _i++) {
	            args[_i - 3] = arguments[_i];
	        }
	        return fn.call.apply(fn, __spreadArray$1([thisArg], args));
	    };
	    NoopContextManager.prototype.bind = function (_context, target) {
	        return target;
	    };
	    NoopContextManager.prototype.enable = function () {
	        return this;
	    };
	    NoopContextManager.prototype.disable = function () {
	        return this;
	    };
	    return NoopContextManager;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
	    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
	        to[j] = from[i];
	    return to;
	};
	var API_NAME$2 = 'context';
	var NOOP_CONTEXT_MANAGER = new NoopContextManager();
	/**
	 * Singleton object which represents the entry point to the OpenTelemetry Context API
	 */
	var ContextAPI = /** @class */ (function () {
	    /** Empty private constructor prevents end users from constructing a new instance of the API */
	    function ContextAPI() {
	    }
	    /** Get the singleton instance of the Context API */
	    ContextAPI.getInstance = function () {
	        if (!this._instance) {
	            this._instance = new ContextAPI();
	        }
	        return this._instance;
	    };
	    /**
	     * Set the current context manager.
	     *
	     * @returns true if the context manager was successfully registered, else false
	     */
	    ContextAPI.prototype.setGlobalContextManager = function (contextManager) {
	        return registerGlobal(API_NAME$2, contextManager, DiagAPI.instance());
	    };
	    /**
	     * Get the currently active context
	     */
	    ContextAPI.prototype.active = function () {
	        return this._getContextManager().active();
	    };
	    /**
	     * Execute a function with an active context
	     *
	     * @param context context to be active during function execution
	     * @param fn function to execute in a context
	     * @param thisArg optional receiver to be used for calling fn
	     * @param args optional arguments forwarded to fn
	     */
	    ContextAPI.prototype.with = function (context, fn, thisArg) {
	        var _a;
	        var args = [];
	        for (var _i = 3; _i < arguments.length; _i++) {
	            args[_i - 3] = arguments[_i];
	        }
	        return (_a = this._getContextManager()).with.apply(_a, __spreadArray([context, fn, thisArg], args));
	    };
	    /**
	     * Bind a context to a target function or event emitter
	     *
	     * @param context context to bind to the event emitter or function. Defaults to the currently active context
	     * @param target function or event emitter to bind
	     */
	    ContextAPI.prototype.bind = function (context, target) {
	        return this._getContextManager().bind(context, target);
	    };
	    ContextAPI.prototype._getContextManager = function () {
	        return getGlobal(API_NAME$2) || NOOP_CONTEXT_MANAGER;
	    };
	    /** Disable and remove the global context manager */
	    ContextAPI.prototype.disable = function () {
	        this._getContextManager().disable();
	        unregisterGlobal(API_NAME$2, DiagAPI.instance());
	    };
	    return ContextAPI;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var TraceFlags;
	(function (TraceFlags) {
	    /** Represents no flag set. */
	    TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
	    /** Bit to represent whether trace is sampled in trace flags. */
	    TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
	})(TraceFlags || (TraceFlags = {}));

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var INVALID_SPANID = '0000000000000000';
	var INVALID_TRACEID = '00000000000000000000000000000000';
	var INVALID_SPAN_CONTEXT = {
	    traceId: INVALID_TRACEID,
	    spanId: INVALID_SPANID,
	    traceFlags: TraceFlags.NONE,
	};

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * The NonRecordingSpan is the default {@link Span} that is used when no Span
	 * implementation is available. All operations are no-op including context
	 * propagation.
	 */
	var NonRecordingSpan = /** @class */ (function () {
	    function NonRecordingSpan(_spanContext) {
	        if (_spanContext === void 0) { _spanContext = INVALID_SPAN_CONTEXT; }
	        this._spanContext = _spanContext;
	    }
	    // Returns a SpanContext.
	    NonRecordingSpan.prototype.spanContext = function () {
	        return this._spanContext;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.setAttribute = function (_key, _value) {
	        return this;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.setAttributes = function (_attributes) {
	        return this;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.addEvent = function (_name, _attributes) {
	        return this;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.setStatus = function (_status) {
	        return this;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.updateName = function (_name) {
	        return this;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.end = function (_endTime) { };
	    // isRecording always returns false for NonRecordingSpan.
	    NonRecordingSpan.prototype.isRecording = function () {
	        return false;
	    };
	    // By default does nothing
	    NonRecordingSpan.prototype.recordException = function (_exception, _time) { };
	    return NonRecordingSpan;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * span key
	 */
	var SPAN_KEY = createContextKey('OpenTelemetry Context Key SPAN');
	/**
	 * Return the span if one exists
	 *
	 * @param context context to get span from
	 */
	function getSpan$1(context) {
	    return context.getValue(SPAN_KEY) || undefined;
	}
	/**
	 * Gets the span from the current context, if one exists.
	 */
	function getActiveSpan() {
	    return getSpan$1(ContextAPI.getInstance().active());
	}
	/**
	 * Set the span on a context
	 *
	 * @param context context to use as parent
	 * @param span span to set active
	 */
	function setSpan$1(context, span) {
	    return context.setValue(SPAN_KEY, span);
	}
	/**
	 * Remove current span stored in the context
	 *
	 * @param context context to delete span from
	 */
	function deleteSpan(context) {
	    return context.deleteValue(SPAN_KEY);
	}
	/**
	 * Wrap span context in a NoopSpan and set as span in a new
	 * context
	 *
	 * @param context context to set active span on
	 * @param spanContext span context to be wrapped
	 */
	function setSpanContext$1(context, spanContext) {
	    return setSpan$1(context, new NonRecordingSpan(spanContext));
	}
	/**
	 * Get the span context of the span if it exists.
	 *
	 * @param context context to get values from
	 */
	function getSpanContext$1(context) {
	    var _a;
	    return (_a = getSpan$1(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
	var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
	function isValidTraceId(traceId) {
	    return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
	}
	function isValidSpanId(spanId) {
	    return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
	}
	/**
	 * Returns true if this {@link SpanContext} is valid.
	 * @return true if this {@link SpanContext} is valid.
	 */
	function isSpanContextValid$1(spanContext) {
	    return (isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId));
	}
	/**
	 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
	 *
	 * @param spanContext span context to be wrapped
	 * @returns a new non-recording {@link Span} with the provided context
	 */
	function wrapSpanContext(spanContext) {
	    return new NonRecordingSpan(spanContext);
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var context$2 = ContextAPI.getInstance();
	/**
	 * No-op implementations of {@link Tracer}.
	 */
	var NoopTracer = /** @class */ (function () {
	    function NoopTracer() {
	    }
	    // startSpan starts a noop span.
	    NoopTracer.prototype.startSpan = function (name, options, context) {
	        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
	        if (root) {
	            return new NonRecordingSpan();
	        }
	        var parentFromContext = context && getSpanContext$1(context);
	        if (isSpanContext(parentFromContext) &&
	            isSpanContextValid$1(parentFromContext)) {
	            return new NonRecordingSpan(parentFromContext);
	        }
	        else {
	            return new NonRecordingSpan();
	        }
	    };
	    NoopTracer.prototype.startActiveSpan = function (name, arg2, arg3, arg4) {
	        var opts;
	        var ctx;
	        var fn;
	        if (arguments.length < 2) {
	            return;
	        }
	        else if (arguments.length === 2) {
	            fn = arg2;
	        }
	        else if (arguments.length === 3) {
	            opts = arg2;
	            fn = arg3;
	        }
	        else {
	            opts = arg2;
	            ctx = arg3;
	            fn = arg4;
	        }
	        var parentContext = ctx !== null && ctx !== void 0 ? ctx : context$2.active();
	        var span = this.startSpan(name, opts, parentContext);
	        var contextWithSpanSet = setSpan$1(parentContext, span);
	        return context$2.with(contextWithSpanSet, fn, undefined, span);
	    };
	    return NoopTracer;
	}());
	function isSpanContext(spanContext) {
	    return (typeof spanContext === 'object' &&
	        typeof spanContext['spanId'] === 'string' &&
	        typeof spanContext['traceId'] === 'string' &&
	        typeof spanContext['traceFlags'] === 'number');
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var NOOP_TRACER = new NoopTracer();
	/**
	 * Proxy tracer provided by the proxy tracer provider
	 */
	var ProxyTracer = /** @class */ (function () {
	    function ProxyTracer(_provider, name, version, options) {
	        this._provider = _provider;
	        this.name = name;
	        this.version = version;
	        this.options = options;
	    }
	    ProxyTracer.prototype.startSpan = function (name, options, context) {
	        return this._getTracer().startSpan(name, options, context);
	    };
	    ProxyTracer.prototype.startActiveSpan = function (_name, _options, _context, _fn) {
	        var tracer = this._getTracer();
	        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
	    };
	    /**
	     * Try to get a tracer from the proxy tracer provider.
	     * If the proxy tracer provider has no delegate, return a noop tracer.
	     */
	    ProxyTracer.prototype._getTracer = function () {
	        if (this._delegate) {
	            return this._delegate;
	        }
	        var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
	        if (!tracer) {
	            return NOOP_TRACER;
	        }
	        this._delegate = tracer;
	        return this._delegate;
	    };
	    return ProxyTracer;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * An implementation of the {@link TracerProvider} which returns an impotent
	 * Tracer for all calls to `getTracer`.
	 *
	 * All operations are no-op.
	 */
	var NoopTracerProvider = /** @class */ (function () {
	    function NoopTracerProvider() {
	    }
	    NoopTracerProvider.prototype.getTracer = function (_name, _version, _options) {
	        return new NoopTracer();
	    };
	    return NoopTracerProvider;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
	/**
	 * Tracer provider which provides {@link ProxyTracer}s.
	 *
	 * Before a delegate is set, tracers provided are NoOp.
	 *   When a delegate is set, traces are provided from the delegate.
	 *   When a delegate is set after tracers have already been provided,
	 *   all tracers already provided will use the provided delegate implementation.
	 */
	var ProxyTracerProvider = /** @class */ (function () {
	    function ProxyTracerProvider() {
	    }
	    /**
	     * Get a {@link ProxyTracer}
	     */
	    ProxyTracerProvider.prototype.getTracer = function (name, version, options) {
	        var _a;
	        return ((_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options));
	    };
	    ProxyTracerProvider.prototype.getDelegate = function () {
	        var _a;
	        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
	    };
	    /**
	     * Set the delegate tracer provider
	     */
	    ProxyTracerProvider.prototype.setDelegate = function (delegate) {
	        this._delegate = delegate;
	    };
	    ProxyTracerProvider.prototype.getDelegateTracer = function (name, version, options) {
	        var _a;
	        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
	    };
	    return ProxyTracerProvider;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * @deprecated use the one declared in @opentelemetry/sdk-trace-base instead.
	 * A sampling decision that determines how a {@link Span} will be recorded
	 * and collected.
	 */
	var SamplingDecision;
	(function (SamplingDecision) {
	    /**
	     * `Span.isRecording() === false`, span will not be recorded and all events
	     * and attributes will be dropped.
	     */
	    SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
	    /**
	     * `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
	     * MUST NOT be set.
	     */
	    SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
	    /**
	     * `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
	     * MUST be set.
	     */
	    SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
	})(SamplingDecision || (SamplingDecision = {}));

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var SpanKind$1;
	(function (SpanKind) {
	    /** Default value. Indicates that the span is used internally. */
	    SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
	    /**
	     * Indicates that the span covers server-side handling of an RPC or other
	     * remote request.
	     */
	    SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
	    /**
	     * Indicates that the span covers the client-side wrapper around an RPC or
	     * other remote request.
	     */
	    SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
	    /**
	     * Indicates that the span describes producer sending a message to a
	     * broker. Unlike client and server, there is no direct critical path latency
	     * relationship between producer and consumer spans.
	     */
	    SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
	    /**
	     * Indicates that the span describes consumer receiving a message from a
	     * broker. Unlike client and server, there is no direct critical path latency
	     * relationship between producer and consumer spans.
	     */
	    SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
	})(SpanKind$1 || (SpanKind$1 = {}));

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * An enumeration of status codes.
	 */
	var SpanStatusCode$1;
	(function (SpanStatusCode) {
	    /**
	     * The default status.
	     */
	    SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
	    /**
	     * The operation has been validated by an Application developer or
	     * Operator to have completed successfully.
	     */
	    SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
	    /**
	     * The operation contains an error.
	     */
	    SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
	})(SpanStatusCode$1 || (SpanStatusCode$1 = {}));

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var VALID_KEY_CHAR_RANGE = '[_0-9a-z-*/]';
	var VALID_KEY = "[a-z]" + VALID_KEY_CHAR_RANGE + "{0,255}";
	var VALID_VENDOR_KEY = "[a-z0-9]" + VALID_KEY_CHAR_RANGE + "{0,240}@[a-z]" + VALID_KEY_CHAR_RANGE + "{0,13}";
	var VALID_KEY_REGEX = new RegExp("^(?:" + VALID_KEY + "|" + VALID_VENDOR_KEY + ")$");
	var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
	var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
	/**
	 * Key is opaque string up to 256 characters printable. It MUST begin with a
	 * lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
	 * underscores _, dashes -, asterisks *, and forward slashes /.
	 * For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
	 * vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
	 * see https://www.w3.org/TR/trace-context/#key
	 */
	function validateKey(key) {
	    return VALID_KEY_REGEX.test(key);
	}
	/**
	 * Value is opaque string up to 256 characters printable ASCII RFC0020
	 * characters (i.e., the range 0x20 to 0x7E) except comma , and =.
	 */
	function validateValue(value) {
	    return (VALID_VALUE_BASE_REGEX.test(value) &&
	        !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value));
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var MAX_TRACE_STATE_ITEMS = 32;
	var MAX_TRACE_STATE_LEN = 512;
	var LIST_MEMBERS_SEPARATOR = ',';
	var LIST_MEMBER_KEY_VALUE_SPLITTER = '=';
	/**
	 * TraceState must be a class and not a simple object type because of the spec
	 * requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
	 *
	 * Here is the list of allowed mutations:
	 * - New key-value pair should be added into the beginning of the list
	 * - The value of any key can be updated. Modified keys MUST be moved to the
	 * beginning of the list.
	 */
	var TraceStateImpl = /** @class */ (function () {
	    function TraceStateImpl(rawTraceState) {
	        this._internalState = new Map();
	        if (rawTraceState)
	            this._parse(rawTraceState);
	    }
	    TraceStateImpl.prototype.set = function (key, value) {
	        // TODO: Benchmark the different approaches(map vs list) and
	        // use the faster one.
	        var traceState = this._clone();
	        if (traceState._internalState.has(key)) {
	            traceState._internalState.delete(key);
	        }
	        traceState._internalState.set(key, value);
	        return traceState;
	    };
	    TraceStateImpl.prototype.unset = function (key) {
	        var traceState = this._clone();
	        traceState._internalState.delete(key);
	        return traceState;
	    };
	    TraceStateImpl.prototype.get = function (key) {
	        return this._internalState.get(key);
	    };
	    TraceStateImpl.prototype.serialize = function () {
	        var _this = this;
	        return this._keys()
	            .reduce(function (agg, key) {
	            agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + _this.get(key));
	            return agg;
	        }, [])
	            .join(LIST_MEMBERS_SEPARATOR);
	    };
	    TraceStateImpl.prototype._parse = function (rawTraceState) {
	        if (rawTraceState.length > MAX_TRACE_STATE_LEN)
	            return;
	        this._internalState = rawTraceState
	            .split(LIST_MEMBERS_SEPARATOR)
	            .reverse() // Store in reverse so new keys (.set(...)) will be placed at the beginning
	            .reduce(function (agg, part) {
	            var listMember = part.trim(); // Optional Whitespace (OWS) handling
	            var i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
	            if (i !== -1) {
	                var key = listMember.slice(0, i);
	                var value = listMember.slice(i + 1, part.length);
	                if (validateKey(key) && validateValue(value)) {
	                    agg.set(key, value);
	                }
	                else {
	                    // TODO: Consider to add warning log
	                }
	            }
	            return agg;
	        }, new Map());
	        // Because of the reverse() requirement, trunc must be done after map is created
	        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
	            this._internalState = new Map(Array.from(this._internalState.entries())
	                .reverse() // Use reverse same as original tracestate parse chain
	                .slice(0, MAX_TRACE_STATE_ITEMS));
	        }
	    };
	    TraceStateImpl.prototype._keys = function () {
	        return Array.from(this._internalState.keys()).reverse();
	    };
	    TraceStateImpl.prototype._clone = function () {
	        var traceState = new TraceStateImpl();
	        traceState._internalState = new Map(this._internalState);
	        return traceState;
	    };
	    return TraceStateImpl;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	function createTraceState(rawTraceState) {
	    return new TraceStateImpl(rawTraceState);
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var API_NAME$1 = 'trace';
	/**
	 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
	 */
	var TraceAPI = /** @class */ (function () {
	    /** Empty private constructor prevents end users from constructing a new instance of the API */
	    function TraceAPI() {
	        this._proxyTracerProvider = new ProxyTracerProvider();
	        this.wrapSpanContext = wrapSpanContext;
	        this.isSpanContextValid = isSpanContextValid$1;
	        this.deleteSpan = deleteSpan;
	        this.getSpan = getSpan$1;
	        this.getActiveSpan = getActiveSpan;
	        this.getSpanContext = getSpanContext$1;
	        this.setSpan = setSpan$1;
	        this.setSpanContext = setSpanContext$1;
	    }
	    /** Get the singleton instance of the Trace API */
	    TraceAPI.getInstance = function () {
	        if (!this._instance) {
	            this._instance = new TraceAPI();
	        }
	        return this._instance;
	    };
	    /**
	     * Set the current global tracer.
	     *
	     * @returns true if the tracer provider was successfully registered, else false
	     */
	    TraceAPI.prototype.setGlobalTracerProvider = function (provider) {
	        var success = registerGlobal(API_NAME$1, this._proxyTracerProvider, DiagAPI.instance());
	        if (success) {
	            this._proxyTracerProvider.setDelegate(provider);
	        }
	        return success;
	    };
	    /**
	     * Returns the global tracer provider.
	     */
	    TraceAPI.prototype.getTracerProvider = function () {
	        return getGlobal(API_NAME$1) || this._proxyTracerProvider;
	    };
	    /**
	     * Returns a tracer from the global tracer provider.
	     */
	    TraceAPI.prototype.getTracer = function (name, version) {
	        return this.getTracerProvider().getTracer(name, version);
	    };
	    /** Remove the global tracer provider */
	    TraceAPI.prototype.disable = function () {
	        unregisterGlobal(API_NAME$1, DiagAPI.instance());
	        this._proxyTracerProvider = new ProxyTracerProvider();
	    };
	    return TraceAPI;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * No-op implementations of {@link TextMapPropagator}.
	 */
	var NoopTextMapPropagator = /** @class */ (function () {
	    function NoopTextMapPropagator() {
	    }
	    /** Noop inject function does nothing */
	    NoopTextMapPropagator.prototype.inject = function (_context, _carrier) { };
	    /** Noop extract function does nothing and returns the input context */
	    NoopTextMapPropagator.prototype.extract = function (context, _carrier) {
	        return context;
	    };
	    NoopTextMapPropagator.prototype.fields = function () {
	        return [];
	    };
	    return NoopTextMapPropagator;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Baggage key
	 */
	var BAGGAGE_KEY = createContextKey('OpenTelemetry Baggage Key');
	/**
	 * Retrieve the current baggage from the given context
	 *
	 * @param {Context} Context that manage all context values
	 * @returns {Baggage} Extracted baggage from the context
	 */
	function getBaggage(context) {
	    return context.getValue(BAGGAGE_KEY) || undefined;
	}
	/**
	 * Store a baggage in the given context
	 *
	 * @param {Context} Context that manage all context values
	 * @param {Baggage} baggage that will be set in the actual context
	 */
	function setBaggage(context, baggage) {
	    return context.setValue(BAGGAGE_KEY, baggage);
	}
	/**
	 * Delete the baggage stored in the given context
	 *
	 * @param {Context} Context that manage all context values
	 */
	function deleteBaggage(context) {
	    return context.deleteValue(BAGGAGE_KEY);
	}

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var API_NAME = 'propagation';
	var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
	/**
	 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
	 */
	var PropagationAPI = /** @class */ (function () {
	    /** Empty private constructor prevents end users from constructing a new instance of the API */
	    function PropagationAPI() {
	        this.createBaggage = createBaggage;
	        this.getBaggage = getBaggage;
	        this.setBaggage = setBaggage;
	        this.deleteBaggage = deleteBaggage;
	    }
	    /** Get the singleton instance of the Propagator API */
	    PropagationAPI.getInstance = function () {
	        if (!this._instance) {
	            this._instance = new PropagationAPI();
	        }
	        return this._instance;
	    };
	    /**
	     * Set the current propagator.
	     *
	     * @returns true if the propagator was successfully registered, else false
	     */
	    PropagationAPI.prototype.setGlobalPropagator = function (propagator) {
	        return registerGlobal(API_NAME, propagator, DiagAPI.instance());
	    };
	    /**
	     * Inject context into a carrier to be propagated inter-process
	     *
	     * @param context Context carrying tracing data to inject
	     * @param carrier carrier to inject context into
	     * @param setter Function used to set values on the carrier
	     */
	    PropagationAPI.prototype.inject = function (context, carrier, setter) {
	        if (setter === void 0) { setter = defaultTextMapSetter; }
	        return this._getGlobalPropagator().inject(context, carrier, setter);
	    };
	    /**
	     * Extract context from a carrier
	     *
	     * @param context Context which the newly created context will inherit from
	     * @param carrier Carrier to extract context from
	     * @param getter Function used to extract keys from a carrier
	     */
	    PropagationAPI.prototype.extract = function (context, carrier, getter) {
	        if (getter === void 0) { getter = defaultTextMapGetter; }
	        return this._getGlobalPropagator().extract(context, carrier, getter);
	    };
	    /**
	     * Return a list of all fields which may be used by the propagator.
	     */
	    PropagationAPI.prototype.fields = function () {
	        return this._getGlobalPropagator().fields();
	    };
	    /** Remove the global propagator */
	    PropagationAPI.prototype.disable = function () {
	        unregisterGlobal(API_NAME, DiagAPI.instance());
	    };
	    PropagationAPI.prototype._getGlobalPropagator = function () {
	        return getGlobal(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
	    };
	    return PropagationAPI;
	}());

	/*
	 * Copyright The OpenTelemetry Authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      https://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/** Entrypoint for context API */
	var context$1 = ContextAPI.getInstance();
	/** Entrypoint for trace API */
	var trace = TraceAPI.getInstance();
	/** Entrypoint for propagation API */
	var propagation = PropagationAPI.getInstance();
	/**
	 * Entrypoint for Diag API.
	 * Defines Diagnostic handler used for internal diagnostic logging operations.
	 * The default provides a Noop DiagLogger implementation which may be changed via the
	 * diag.setLogger(logger: DiagLogger) function.
	 */
	var diag = DiagAPI.instance();
	var index = {
	    trace: trace,
	    context: context$1,
	    propagation: propagation,
	    diag: diag,
	};

	// Copyright (c) Microsoft Corporation.
	/**
	 * The kind of span.
	 */
	var SpanKind;
	(function (SpanKind) {
	    /** Default value. Indicates that the span is used internally. */
	    SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
	    /**
	     * Indicates that the span covers server-side handling of an RPC or other
	     * remote request.
	     */
	    SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
	    /**
	     * Indicates that the span covers the client-side wrapper around an RPC or
	     * other remote request.
	     */
	    SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
	    /**
	     * Indicates that the span describes producer sending a message to a
	     * broker. Unlike client and server, there is no direct critical path latency
	     * relationship between producer and consumer spans.
	     */
	    SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
	    /**
	     * Indicates that the span describes consumer receiving a message from a
	     * broker. Unlike client and server, there is no direct critical path latency
	     * relationship between producer and consumer spans.
	     */
	    SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
	})(SpanKind || (SpanKind = {}));
	/**
	 * Return the span if one exists
	 *
	 * @param context - context to get span from
	 */
	function getSpan(context) {
	    return trace.getSpan(context);
	}
	/**
	 * Set the span on a context
	 *
	 * @param context - context to use as parent
	 * @param span - span to set active
	 */
	function setSpan(context, span) {
	    return trace.setSpan(context, span);
	}
	/**
	 * Wrap span context in a NoopSpan and set as span in a new
	 * context
	 *
	 * @param context - context to set active span on
	 * @param spanContext - span context to be wrapped
	 */
	function setSpanContext(context, spanContext) {
	    return trace.setSpanContext(context, spanContext);
	}
	/**
	 * Get the span context of the span if it exists.
	 *
	 * @param context - context to get values from
	 */
	function getSpanContext(context) {
	    return trace.getSpanContext(context);
	}
	/**
	 * Returns true of the given {@link SpanContext} is valid.
	 * A valid {@link SpanContext} is one which has a valid trace ID and span ID as per the spec.
	 *
	 * @param context - the {@link SpanContext} to validate.
	 *
	 * @returns true if the {@link SpanContext} is valid, false otherwise.
	 */
	function isSpanContextValid(context) {
	    return trace.isSpanContextValid(context);
	}
	function getTracer(name, version) {
	    return trace.getTracer(name || "azure/core-tracing", version);
	}
	/** Entrypoint for context API */
	const context = context$1;
	/** SpanStatusCode */
	var SpanStatusCode;
	(function (SpanStatusCode) {
	    /**
	     * The default status.
	     */
	    SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
	    /**
	     * The operation has been validated by an Application developer or
	     * Operator to have completed successfully.
	     */
	    SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
	    /**
	     * The operation contains an error.
	     */
	    SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
	})(SpanStatusCode || (SpanStatusCode = {}));

	// Copyright (c) Microsoft Corporation.
	function isTracingDisabled() {
	    var _a;
	    if (typeof process === "undefined") {
	        // not supported in browser for now without polyfills
	        return false;
	    }
	    const azureTracingDisabledValue = (_a = process.env.AZURE_TRACING_DISABLED) === null || _a === void 0 ? void 0 : _a.toLowerCase();
	    if (azureTracingDisabledValue === "false" || azureTracingDisabledValue === "0") {
	        return false;
	    }
	    return Boolean(azureTracingDisabledValue);
	}
	/**
	 * Creates a function that can be used to create spans using the global tracer.
	 *
	 * Usage:
	 *
	 * ```typescript
	 * // once
	 * const createSpan = createSpanFunction({ packagePrefix: "Azure.Data.AppConfiguration", namespace: "Microsoft.AppConfiguration" });
	 *
	 * // in each operation
	 * const span = createSpan("deleteConfigurationSetting", operationOptions);
	 *    // code...
	 * span.end();
	 * ```
	 *
	 * @hidden
	 * @param args - allows configuration of the prefix for each span as well as the az.namespace field.
	 */
	function createSpanFunction$1(args) {
	    return function (operationName, operationOptions) {
	        const tracer = getTracer();
	        const tracingOptions = (operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions) || {};
	        const spanOptions = Object.assign({ kind: SpanKind.INTERNAL }, tracingOptions.spanOptions);
	        const spanName = args.packagePrefix ? `${args.packagePrefix}.${operationName}` : operationName;
	        let span;
	        if (isTracingDisabled()) {
	            span = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
	        }
	        else {
	            span = tracer.startSpan(spanName, spanOptions, tracingOptions.tracingContext);
	        }
	        if (args.namespace) {
	            span.setAttribute("az.namespace", args.namespace);
	        }
	        let newSpanOptions = tracingOptions.spanOptions || {};
	        if (span.isRecording() && args.namespace) {
	            newSpanOptions = Object.assign(Object.assign({}, tracingOptions.spanOptions), { attributes: Object.assign(Object.assign({}, spanOptions.attributes), { "az.namespace": args.namespace }) });
	        }
	        const newTracingOptions = Object.assign(Object.assign({}, tracingOptions), { spanOptions: newSpanOptions, tracingContext: setSpan(tracingOptions.tracingContext || context.active(), span) });
	        const newOperationOptions = Object.assign(Object.assign({}, operationOptions), { tracingOptions: newTracingOptions });
	        return {
	            span,
	            updatedOptions: newOperationOptions
	        };
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const VERSION = "00";
	/**
	 * Generates a `SpanContext` given a `traceparent` header value.
	 * @param traceParent - Serialized span context data as a `traceparent` header value.
	 * @returns The `SpanContext` generated from the `traceparent` value.
	 */
	function extractSpanContextFromTraceParentHeader(traceParentHeader) {
	    const parts = traceParentHeader.split("-");
	    if (parts.length !== 4) {
	        return;
	    }
	    const [version, traceId, spanId, traceOptions] = parts;
	    if (version !== VERSION) {
	        return;
	    }
	    const traceFlags = parseInt(traceOptions, 16);
	    const spanContext = {
	        spanId,
	        traceId,
	        traceFlags
	    };
	    return spanContext;
	}
	/**
	 * Generates a `traceparent` value given a span context.
	 * @param spanContext - Contains context for a specific span.
	 * @returns The `spanContext` represented as a `traceparent` value.
	 */
	function getTraceParentHeader(spanContext) {
	    const missingFields = [];
	    if (!spanContext.traceId) {
	        missingFields.push("traceId");
	    }
	    if (!spanContext.spanId) {
	        missingFields.push("spanId");
	    }
	    if (missingFields.length) {
	        return;
	    }
	    const flags = spanContext.traceFlags || 0 /* NONE */;
	    const hexFlags = flags.toString(16);
	    const traceFlags = hexFlags.length === 1 ? `0${hexFlags}` : hexFlags;
	    // https://www.w3.org/TR/trace-context/#traceparent-header-field-values
	    return `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-${traceFlags}`;
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	const createSpan = createSpanFunction$1({
	    packagePrefix: "",
	    namespace: "",
	});
	/**
	 * Creates a policy that wraps outgoing requests with a tracing span.
	 * @param tracingOptions - Tracing options.
	 * @returns An instance of the {@link TracingPolicy} class.
	 */
	function tracingPolicy(tracingOptions = {}) {
	    return {
	        create(nextPolicy, options) {
	            return new TracingPolicy(nextPolicy, options, tracingOptions);
	        },
	    };
	}
	/**
	 * A policy that wraps outgoing requests with a tracing span.
	 */
	class TracingPolicy extends BaseRequestPolicy {
	    constructor(nextPolicy, options, tracingOptions) {
	        super(nextPolicy, options);
	        this.userAgent = tracingOptions.userAgent;
	    }
	    async sendRequest(request) {
	        if (!request.tracingContext) {
	            return this._nextPolicy.sendRequest(request);
	        }
	        const span = this.tryCreateSpan(request);
	        if (!span) {
	            return this._nextPolicy.sendRequest(request);
	        }
	        try {
	            const response = await this._nextPolicy.sendRequest(request);
	            this.tryProcessResponse(span, response);
	            return response;
	        }
	        catch (err) {
	            this.tryProcessError(span, err);
	            throw err;
	        }
	    }
	    tryCreateSpan(request) {
	        var _a;
	        try {
	            // Passing spanOptions as part of tracingOptions to maintain compatibility @azure/core-tracing@preview.13 and earlier.
	            // We can pass this as a separate parameter once we upgrade to the latest core-tracing.
	            const { span } = createSpan(`HTTP ${request.method}`, {
	                tracingOptions: {
	                    spanOptions: Object.assign(Object.assign({}, request.spanOptions), { kind: SpanKind.CLIENT }),
	                    tracingContext: request.tracingContext,
	                },
	            });
	            // If the span is not recording, don't do any more work.
	            if (!span.isRecording()) {
	                span.end();
	                return undefined;
	            }
	            const namespaceFromContext = (_a = request.tracingContext) === null || _a === void 0 ? void 0 : _a.getValue(Symbol.for("az.namespace"));
	            if (typeof namespaceFromContext === "string") {
	                span.setAttribute("az.namespace", namespaceFromContext);
	            }
	            span.setAttributes({
	                "http.method": request.method,
	                "http.url": request.url,
	                requestId: request.requestId,
	            });
	            if (this.userAgent) {
	                span.setAttribute("http.user_agent", this.userAgent);
	            }
	            // set headers
	            const spanContext = span.spanContext();
	            const traceParentHeader = getTraceParentHeader(spanContext);
	            if (traceParentHeader && isSpanContextValid(spanContext)) {
	                request.headers.set("traceparent", traceParentHeader);
	                const traceState = spanContext.traceState && spanContext.traceState.serialize();
	                // if tracestate is set, traceparent MUST be set, so only set tracestate after traceparent
	                if (traceState) {
	                    request.headers.set("tracestate", traceState);
	                }
	            }
	            return span;
	        }
	        catch (error) {
	            logger.warning(`Skipping creating a tracing span due to an error: ${error.message}`);
	            return undefined;
	        }
	    }
	    tryProcessError(span, err) {
	        try {
	            span.setStatus({
	                code: SpanStatusCode.ERROR,
	                message: err.message,
	            });
	            if (err.statusCode) {
	                span.setAttribute("http.status_code", err.statusCode);
	            }
	            span.end();
	        }
	        catch (error) {
	            logger.warning(`Skipping tracing span processing due to an error: ${error.message}`);
	        }
	    }
	    tryProcessResponse(span, response) {
	        try {
	            span.setAttribute("http.status_code", response.status);
	            const serviceRequestId = response.headers.get("x-ms-request-id");
	            if (serviceRequestId) {
	                span.setAttribute("serviceRequestId", serviceRequestId);
	            }
	            span.setStatus({
	                code: SpanStatusCode.OK,
	            });
	            span.end();
	        }
	        catch (error) {
	            logger.warning(`Skipping tracing span processing due to an error: ${error.message}`);
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * ServiceClient sends service requests and receives responses.
	 */
	class ServiceClient {
	    /**
	     * The ServiceClient constructor
	     * @param credentials - The credentials used for authentication with the service.
	     * @param options - The service client options that govern the behavior of the client.
	     */
	    constructor(credentials, 
	    /* eslint-disable-next-line @azure/azure-sdk/ts-naming-options */
	    options) {
	        if (!options) {
	            options = {};
	        }
	        this._withCredentials = options.withCredentials || false;
	        this._httpClient = options.httpClient || getCachedDefaultHttpClient();
	        this._requestPolicyOptions = new RequestPolicyOptions(options.httpPipelineLogger);
	        let requestPolicyFactories;
	        if (Array.isArray(options.requestPolicyFactories)) {
	            logger.info("ServiceClient: using custom request policies");
	            requestPolicyFactories = options.requestPolicyFactories;
	        }
	        else {
	            let authPolicyFactory = undefined;
	            if (isTokenCredential(credentials)) {
	                logger.info("ServiceClient: creating bearer token authentication policy from provided credentials");
	                // Create a wrapped RequestPolicyFactory here so that we can provide the
	                // correct scope to the BearerTokenAuthenticationPolicy at the first time
	                // one is requested.  This is needed because generated ServiceClient
	                // implementations do not set baseUri until after ServiceClient's constructor
	                // is finished, leaving baseUri empty at the time when it is needed to
	                // build the correct scope name.
	                const wrappedPolicyFactory = () => {
	                    let bearerTokenPolicyFactory = undefined;
	                    // eslint-disable-next-line @typescript-eslint/no-this-alias
	                    const serviceClient = this;
	                    const serviceClientOptions = options;
	                    return {
	                        create(nextPolicy, createOptions) {
	                            const credentialScopes = getCredentialScopes(serviceClientOptions, serviceClient.baseUri);
	                            if (!credentialScopes) {
	                                throw new Error(`When using credential, the ServiceClient must contain a baseUri or a credentialScopes in ServiceClientOptions. Unable to create a bearerTokenAuthenticationPolicy`);
	                            }
	                            if (bearerTokenPolicyFactory === undefined || bearerTokenPolicyFactory === null) {
	                                bearerTokenPolicyFactory = bearerTokenAuthenticationPolicy(credentials, credentialScopes);
	                            }
	                            return bearerTokenPolicyFactory.create(nextPolicy, createOptions);
	                        },
	                    };
	                };
	                authPolicyFactory = wrappedPolicyFactory();
	            }
	            else if (credentials && typeof credentials.signRequest === "function") {
	                logger.info("ServiceClient: creating signing policy from provided credentials");
	                authPolicyFactory = signingPolicy(credentials);
	            }
	            else if (credentials !== undefined && credentials !== null) {
	                throw new Error("The credentials argument must implement the TokenCredential interface");
	            }
	            logger.info("ServiceClient: using default request policies");
	            requestPolicyFactories = createDefaultRequestPolicyFactories(authPolicyFactory, options);
	            if (options.requestPolicyFactories) {
	                // options.requestPolicyFactories can also be a function that manipulates
	                // the default requestPolicyFactories array
	                const newRequestPolicyFactories = options.requestPolicyFactories(requestPolicyFactories);
	                if (newRequestPolicyFactories) {
	                    requestPolicyFactories = newRequestPolicyFactories;
	                }
	            }
	        }
	        this._requestPolicyFactories = requestPolicyFactories;
	    }
	    /**
	     * Send the provided httpRequest.
	     */
	    sendRequest(options) {
	        if (options === null || options === undefined || typeof options !== "object") {
	            throw new Error("options cannot be null or undefined and it must be of type object.");
	        }
	        let httpRequest;
	        try {
	            if (isWebResourceLike(options)) {
	                options.validateRequestProperties();
	                httpRequest = options;
	            }
	            else {
	                httpRequest = new WebResource();
	                httpRequest = httpRequest.prepare(options);
	            }
	        }
	        catch (error) {
	            return Promise.reject(error);
	        }
	        let httpPipeline = this._httpClient;
	        if (this._requestPolicyFactories && this._requestPolicyFactories.length > 0) {
	            for (let i = this._requestPolicyFactories.length - 1; i >= 0; --i) {
	                httpPipeline = this._requestPolicyFactories[i].create(httpPipeline, this._requestPolicyOptions);
	            }
	        }
	        return httpPipeline.sendRequest(httpRequest);
	    }
	    /**
	     * Send an HTTP request that is populated using the provided OperationSpec.
	     * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
	     * @param operationSpec - The OperationSpec to use to populate the httpRequest.
	     * @param callback - The callback to call when the response is received.
	     */
	    async sendOperationRequest(operationArguments, operationSpec, callback) {
	        var _a;
	        if (typeof operationArguments.options === "function") {
	            callback = operationArguments.options;
	            operationArguments.options = undefined;
	        }
	        const serializerOptions = (_a = operationArguments.options) === null || _a === void 0 ? void 0 : _a.serializerOptions;
	        const httpRequest = new WebResource();
	        let result;
	        try {
	            const baseUri = operationSpec.baseUrl || this.baseUri;
	            if (!baseUri) {
	                throw new Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a baseUri string property that contains the base URL to use.");
	            }
	            httpRequest.method = operationSpec.httpMethod;
	            httpRequest.operationSpec = operationSpec;
	            const requestUrl = URLBuilder.parse(baseUri);
	            if (operationSpec.path) {
	                requestUrl.appendPath(operationSpec.path);
	            }
	            if (operationSpec.urlParameters && operationSpec.urlParameters.length > 0) {
	                for (const urlParameter of operationSpec.urlParameters) {
	                    let urlParameterValue = getOperationArgumentValueFromParameter(this, operationArguments, urlParameter, operationSpec.serializer);
	                    urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, getPathStringFromParameter(urlParameter), serializerOptions);
	                    if (!urlParameter.skipEncoding) {
	                        urlParameterValue = encodeURIComponent(urlParameterValue);
	                    }
	                    requestUrl.replaceAll(`{${urlParameter.mapper.serializedName || getPathStringFromParameter(urlParameter)}}`, urlParameterValue);
	                }
	            }
	            if (operationSpec.queryParameters && operationSpec.queryParameters.length > 0) {
	                for (const queryParameter of operationSpec.queryParameters) {
	                    let queryParameterValue = getOperationArgumentValueFromParameter(this, operationArguments, queryParameter, operationSpec.serializer);
	                    if (queryParameterValue !== undefined && queryParameterValue !== null) {
	                        queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, getPathStringFromParameter(queryParameter), serializerOptions);
	                        if (queryParameter.collectionFormat !== undefined &&
	                            queryParameter.collectionFormat !== null) {
	                            if (queryParameter.collectionFormat === QueryCollectionFormat.Multi) {
	                                if (queryParameterValue.length === 0) {
	                                    // The collection is empty, no need to try serializing the current queryParam
	                                    continue;
	                                }
	                                else {
	                                    for (const index in queryParameterValue) {
	                                        const item = queryParameterValue[index];
	                                        queryParameterValue[index] =
	                                            item === undefined || item === null ? "" : item.toString();
	                                    }
	                                }
	                            }
	                            else if (queryParameter.collectionFormat === QueryCollectionFormat.Ssv ||
	                                queryParameter.collectionFormat === QueryCollectionFormat.Tsv) {
	                                queryParameterValue = queryParameterValue.join(queryParameter.collectionFormat);
	                            }
	                        }
	                        if (!queryParameter.skipEncoding) {
	                            if (Array.isArray(queryParameterValue)) {
	                                for (const index in queryParameterValue) {
	                                    if (queryParameterValue[index] !== undefined &&
	                                        queryParameterValue[index] !== null) {
	                                        queryParameterValue[index] = encodeURIComponent(queryParameterValue[index]);
	                                    }
	                                }
	                            }
	                            else {
	                                queryParameterValue = encodeURIComponent(queryParameterValue);
	                            }
	                        }
	                        if (queryParameter.collectionFormat !== undefined &&
	                            queryParameter.collectionFormat !== null &&
	                            queryParameter.collectionFormat !== QueryCollectionFormat.Multi &&
	                            queryParameter.collectionFormat !== QueryCollectionFormat.Ssv &&
	                            queryParameter.collectionFormat !== QueryCollectionFormat.Tsv) {
	                            queryParameterValue = queryParameterValue.join(queryParameter.collectionFormat);
	                        }
	                        requestUrl.setQueryParameter(queryParameter.mapper.serializedName || getPathStringFromParameter(queryParameter), queryParameterValue);
	                    }
	                }
	            }
	            httpRequest.url = requestUrl.toString();
	            const contentType = operationSpec.contentType || this.requestContentType;
	            if (contentType && operationSpec.requestBody) {
	                httpRequest.headers.set("Content-Type", contentType);
	            }
	            if (operationSpec.headerParameters) {
	                for (const headerParameter of operationSpec.headerParameters) {
	                    let headerValue = getOperationArgumentValueFromParameter(this, operationArguments, headerParameter, operationSpec.serializer);
	                    if (headerValue !== undefined && headerValue !== null) {
	                        headerValue = operationSpec.serializer.serialize(headerParameter.mapper, headerValue, getPathStringFromParameter(headerParameter), serializerOptions);
	                        const headerCollectionPrefix = headerParameter.mapper
	                            .headerCollectionPrefix;
	                        if (headerCollectionPrefix) {
	                            for (const key of Object.keys(headerValue)) {
	                                httpRequest.headers.set(headerCollectionPrefix + key, headerValue[key]);
	                            }
	                        }
	                        else {
	                            httpRequest.headers.set(headerParameter.mapper.serializedName ||
	                                getPathStringFromParameter(headerParameter), headerValue);
	                        }
	                    }
	                }
	            }
	            const options = operationArguments.options;
	            if (options) {
	                if (options.customHeaders) {
	                    for (const customHeaderName in options.customHeaders) {
	                        httpRequest.headers.set(customHeaderName, options.customHeaders[customHeaderName]);
	                    }
	                }
	                if (options.abortSignal) {
	                    httpRequest.abortSignal = options.abortSignal;
	                }
	                if (options.timeout) {
	                    httpRequest.timeout = options.timeout;
	                }
	                if (options.onUploadProgress) {
	                    httpRequest.onUploadProgress = options.onUploadProgress;
	                }
	                if (options.onDownloadProgress) {
	                    httpRequest.onDownloadProgress = options.onDownloadProgress;
	                }
	                if (options.spanOptions) {
	                    // By passing spanOptions if they exist at runtime, we're backwards compatible with @azure/core-tracing@preview.13 and earlier.
	                    httpRequest.spanOptions = options.spanOptions;
	                }
	                if (options.tracingContext) {
	                    httpRequest.tracingContext = options.tracingContext;
	                }
	                if (options.shouldDeserialize !== undefined && options.shouldDeserialize !== null) {
	                    httpRequest.shouldDeserialize = options.shouldDeserialize;
	                }
	            }
	            httpRequest.withCredentials = this._withCredentials;
	            serializeRequestBody(this, httpRequest, operationArguments, operationSpec);
	            if (httpRequest.streamResponseStatusCodes === undefined) {
	                httpRequest.streamResponseStatusCodes = getStreamResponseStatusCodes(operationSpec);
	            }
	            let rawResponse;
	            let sendRequestError;
	            try {
	                rawResponse = await this.sendRequest(httpRequest);
	            }
	            catch (error) {
	                sendRequestError = error;
	            }
	            if (sendRequestError) {
	                if (sendRequestError.response) {
	                    sendRequestError.details = flattenResponse(sendRequestError.response, operationSpec.responses[sendRequestError.statusCode] ||
	                        operationSpec.responses["default"]);
	                }
	                result = Promise.reject(sendRequestError);
	            }
	            else {
	                result = Promise.resolve(flattenResponse(rawResponse, operationSpec.responses[rawResponse.status]));
	            }
	        }
	        catch (error) {
	            result = Promise.reject(error);
	        }
	        const cb = callback;
	        if (cb) {
	            result
	                .then((res) => cb(null, res._response.parsedBody, res._response.request, res._response))
	                .catch((err) => cb(err));
	        }
	        return result;
	    }
	}
	function serializeRequestBody(serviceClient, httpRequest, operationArguments, operationSpec) {
	    var _a, _b, _c, _d, _e, _f;
	    const serializerOptions = (_b = (_a = operationArguments.options) === null || _a === void 0 ? void 0 : _a.serializerOptions) !== null && _b !== void 0 ? _b : {};
	    const updatedOptions = {
	        rootName: (_c = serializerOptions.rootName) !== null && _c !== void 0 ? _c : "",
	        includeRoot: (_d = serializerOptions.includeRoot) !== null && _d !== void 0 ? _d : false,
	        xmlCharKey: (_e = serializerOptions.xmlCharKey) !== null && _e !== void 0 ? _e : XML_CHARKEY,
	    };
	    const xmlCharKey = serializerOptions.xmlCharKey;
	    if (operationSpec.requestBody && operationSpec.requestBody.mapper) {
	        httpRequest.body = getOperationArgumentValueFromParameter(serviceClient, operationArguments, operationSpec.requestBody, operationSpec.serializer);
	        const bodyMapper = operationSpec.requestBody.mapper;
	        const { required, xmlName, xmlElementName, serializedName, xmlNamespace, xmlNamespacePrefix } = bodyMapper;
	        const typeName = bodyMapper.type.name;
	        try {
	            if ((httpRequest.body !== undefined && httpRequest.body !== null) || required) {
	                const requestBodyParameterPathString = getPathStringFromParameter(operationSpec.requestBody);
	                httpRequest.body = operationSpec.serializer.serialize(bodyMapper, httpRequest.body, requestBodyParameterPathString, updatedOptions);
	                const isStream = typeName === MapperType.Stream;
	                if (operationSpec.isXML) {
	                    const xmlnsKey = xmlNamespacePrefix ? `xmlns:${xmlNamespacePrefix}` : "xmlns";
	                    const value = getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, httpRequest.body, updatedOptions);
	                    if (typeName === MapperType.Sequence) {
	                        httpRequest.body = stringifyXML(prepareXMLRootList(value, xmlElementName || xmlName || serializedName, xmlnsKey, xmlNamespace), {
	                            rootName: xmlName || serializedName,
	                            xmlCharKey,
	                        });
	                    }
	                    else if (!isStream) {
	                        httpRequest.body = stringifyXML(value, {
	                            rootName: xmlName || serializedName,
	                            xmlCharKey,
	                        });
	                    }
	                }
	                else if (typeName === MapperType.String &&
	                    (((_f = operationSpec.contentType) === null || _f === void 0 ? void 0 : _f.match("text/plain")) || operationSpec.mediaType === "text")) {
	                    // the String serializer has validated that request body is a string
	                    // so just send the string.
	                    return;
	                }
	                else if (!isStream) {
	                    httpRequest.body = JSON.stringify(httpRequest.body);
	                }
	            }
	        }
	        catch (error) {
	            throw new Error(`Error "${error.message}" occurred in serializing the payload - ${JSON.stringify(serializedName, undefined, "  ")}.`);
	        }
	    }
	    else if (operationSpec.formDataParameters && operationSpec.formDataParameters.length > 0) {
	        httpRequest.formData = {};
	        for (const formDataParameter of operationSpec.formDataParameters) {
	            const formDataParameterValue = getOperationArgumentValueFromParameter(serviceClient, operationArguments, formDataParameter, operationSpec.serializer);
	            if (formDataParameterValue !== undefined && formDataParameterValue !== null) {
	                const formDataParameterPropertyName = formDataParameter.mapper.serializedName || getPathStringFromParameter(formDataParameter);
	                httpRequest.formData[formDataParameterPropertyName] = operationSpec.serializer.serialize(formDataParameter.mapper, formDataParameterValue, getPathStringFromParameter(formDataParameter), updatedOptions);
	            }
	        }
	    }
	}
	/**
	 * Adds an xml namespace to the xml serialized object if needed, otherwise it just returns the value itself
	 */
	function getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, serializedValue, options) {
	    // Composite and Sequence schemas already got their root namespace set during serialization
	    // We just need to add xmlns to the other schema types
	    if (xmlNamespace && !["Composite", "Sequence", "Dictionary"].includes(typeName)) {
	        const result = {};
	        result[options.xmlCharKey] = serializedValue;
	        result[XML_ATTRKEY] = { [xmlnsKey]: xmlNamespace };
	        return result;
	    }
	    return serializedValue;
	}
	function getValueOrFunctionResult(value, defaultValueCreator) {
	    let result;
	    if (typeof value === "string") {
	        result = value;
	    }
	    else {
	        result = defaultValueCreator();
	        if (typeof value === "function") {
	            result = value(result);
	        }
	    }
	    return result;
	}
	function createDefaultRequestPolicyFactories(authPolicyFactory, options) {
	    const factories = [];
	    if (options.generateClientRequestIdHeader) {
	        factories.push(generateClientRequestIdPolicy(options.clientRequestIdHeaderName));
	    }
	    if (authPolicyFactory) {
	        factories.push(authPolicyFactory);
	    }
	    const userAgentHeaderName = getValueOrFunctionResult(options.userAgentHeaderName, getDefaultUserAgentHeaderName);
	    const userAgentHeaderValue = getValueOrFunctionResult(options.userAgent, getDefaultUserAgentValue);
	    if (userAgentHeaderName && userAgentHeaderValue) {
	        factories.push(userAgentPolicy({ key: userAgentHeaderName, value: userAgentHeaderValue }));
	    }
	    factories.push(redirectPolicy());
	    factories.push(rpRegistrationPolicy(options.rpRegistrationRetryTimeout));
	    if (!options.noRetryPolicy) {
	        factories.push(exponentialRetryPolicy());
	        factories.push(systemErrorRetryPolicy());
	        factories.push(throttlingRetryPolicy());
	    }
	    factories.push(deserializationPolicy(options.deserializationContentTypes));
	    if (isNode) {
	        factories.push(proxyPolicy(options.proxySettings));
	    }
	    factories.push(logPolicy({ logger: logger.info }));
	    return factories;
	}
	/**
	 * Creates an HTTP pipeline based on the given options.
	 * @param pipelineOptions - Defines options that are used to configure policies in the HTTP pipeline for an SDK client.
	 * @param authPolicyFactory - An optional authentication policy factory to use for signing requests.
	 * @returns A set of options that can be passed to create a new {@link ServiceClient}.
	 */
	function createPipelineFromOptions(pipelineOptions, authPolicyFactory) {
	    const requestPolicyFactories = [];
	    if (pipelineOptions.sendStreamingJson) {
	        requestPolicyFactories.push(ndJsonPolicy());
	    }
	    let userAgentValue = undefined;
	    if (pipelineOptions.userAgentOptions && pipelineOptions.userAgentOptions.userAgentPrefix) {
	        const userAgentInfo = [];
	        userAgentInfo.push(pipelineOptions.userAgentOptions.userAgentPrefix);
	        // Add the default user agent value if it isn't already specified
	        // by the userAgentPrefix option.
	        const defaultUserAgentInfo = getDefaultUserAgentValue();
	        if (userAgentInfo.indexOf(defaultUserAgentInfo) === -1) {
	            userAgentInfo.push(defaultUserAgentInfo);
	        }
	        userAgentValue = userAgentInfo.join(" ");
	    }
	    const keepAliveOptions = Object.assign(Object.assign({}, DefaultKeepAliveOptions), pipelineOptions.keepAliveOptions);
	    const retryOptions = Object.assign(Object.assign({}, DefaultRetryOptions), pipelineOptions.retryOptions);
	    const redirectOptions = Object.assign(Object.assign({}, DefaultRedirectOptions), pipelineOptions.redirectOptions);
	    if (isNode) {
	        requestPolicyFactories.push(proxyPolicy(pipelineOptions.proxyOptions));
	    }
	    const deserializationOptions = Object.assign(Object.assign({}, DefaultDeserializationOptions), pipelineOptions.deserializationOptions);
	    const loggingOptions = Object.assign({}, pipelineOptions.loggingOptions);
	    requestPolicyFactories.push(tracingPolicy({ userAgent: userAgentValue }), keepAlivePolicy(keepAliveOptions), userAgentPolicy({ value: userAgentValue }), generateClientRequestIdPolicy(), deserializationPolicy(deserializationOptions.expectedContentTypes), throttlingRetryPolicy(), systemErrorRetryPolicy(), exponentialRetryPolicy(retryOptions.maxRetries, retryOptions.retryDelayInMs, retryOptions.maxRetryDelayInMs));
	    if (redirectOptions.handleRedirects) {
	        requestPolicyFactories.push(redirectPolicy(redirectOptions.maxRetries));
	    }
	    if (authPolicyFactory) {
	        requestPolicyFactories.push(authPolicyFactory);
	    }
	    requestPolicyFactories.push(logPolicy(loggingOptions));
	    if (isNode && pipelineOptions.decompressResponse === false) {
	        requestPolicyFactories.push(disableResponseDecompressionPolicy());
	    }
	    return {
	        httpClient: pipelineOptions.httpClient,
	        requestPolicyFactories,
	    };
	}
	/**
	 * Get the property parent for the property at the provided path when starting with the provided
	 * parent object.
	 */
	function getPropertyParent(parent, propertyPath) {
	    if (parent && propertyPath) {
	        const propertyPathLength = propertyPath.length;
	        for (let i = 0; i < propertyPathLength - 1; ++i) {
	            const propertyName = propertyPath[i];
	            if (!parent[propertyName]) {
	                parent[propertyName] = {};
	            }
	            parent = parent[propertyName];
	        }
	    }
	    return parent;
	}
	function getOperationArgumentValueFromParameter(serviceClient, operationArguments, parameter, serializer) {
	    return getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, parameter.parameterPath, parameter.mapper, serializer);
	}
	function getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, parameterPath, parameterMapper, serializer) {
	    var _a;
	    let value;
	    if (typeof parameterPath === "string") {
	        parameterPath = [parameterPath];
	    }
	    const serializerOptions = (_a = operationArguments.options) === null || _a === void 0 ? void 0 : _a.serializerOptions;
	    if (Array.isArray(parameterPath)) {
	        if (parameterPath.length > 0) {
	            if (parameterMapper.isConstant) {
	                value = parameterMapper.defaultValue;
	            }
	            else {
	                let propertySearchResult = getPropertyFromParameterPath(operationArguments, parameterPath);
	                if (!propertySearchResult.propertyFound) {
	                    propertySearchResult = getPropertyFromParameterPath(serviceClient, parameterPath);
	                }
	                let useDefaultValue = false;
	                if (!propertySearchResult.propertyFound) {
	                    useDefaultValue =
	                        parameterMapper.required ||
	                            (parameterPath[0] === "options" && parameterPath.length === 2);
	                }
	                value = useDefaultValue ? parameterMapper.defaultValue : propertySearchResult.propertyValue;
	            }
	            // Serialize just for validation purposes.
	            const parameterPathString = getPathStringFromParameterPath(parameterPath, parameterMapper);
	            serializer.serialize(parameterMapper, value, parameterPathString, serializerOptions);
	        }
	    }
	    else {
	        if (parameterMapper.required) {
	            value = {};
	        }
	        for (const propertyName in parameterPath) {
	            const propertyMapper = parameterMapper.type.modelProperties[propertyName];
	            const propertyPath = parameterPath[propertyName];
	            const propertyValue = getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, propertyPath, propertyMapper, serializer);
	            // Serialize just for validation purposes.
	            const propertyPathString = getPathStringFromParameterPath(propertyPath, propertyMapper);
	            serializer.serialize(propertyMapper, propertyValue, propertyPathString, serializerOptions);
	            if (propertyValue !== undefined && propertyValue !== null) {
	                if (!value) {
	                    value = {};
	                }
	                value[propertyName] = propertyValue;
	            }
	        }
	    }
	    return value;
	}
	function getPropertyFromParameterPath(parent, parameterPath) {
	    const result = { propertyFound: false };
	    let i = 0;
	    for (; i < parameterPath.length; ++i) {
	        const parameterPathPart = parameterPath[i];
	        // Make sure to check inherited properties too, so don't use hasOwnProperty().
	        if (parent !== undefined && parent !== null && parameterPathPart in parent) {
	            parent = parent[parameterPathPart];
	        }
	        else {
	            break;
	        }
	    }
	    if (i === parameterPath.length) {
	        result.propertyValue = parent;
	        result.propertyFound = true;
	    }
	    return result;
	}
	/**
	 * Parses an {@link HttpOperationResponse} into a normalized HTTP response object ({@link RestResponse}).
	 * @param _response - Wrapper object for http response.
	 * @param responseSpec - Mappers for how to parse the response properties.
	 * @returns - A normalized response object.
	 */
	function flattenResponse(_response, responseSpec) {
	    const parsedHeaders = _response.parsedHeaders;
	    const bodyMapper = responseSpec && responseSpec.bodyMapper;
	    const addOperationResponse = (obj) => {
	        return Object.defineProperty(obj, "_response", {
	            value: _response,
	        });
	    };
	    if (bodyMapper) {
	        const typeName = bodyMapper.type.name;
	        if (typeName === "Stream") {
	            return addOperationResponse(Object.assign(Object.assign({}, parsedHeaders), { blobBody: _response.blobBody, readableStreamBody: _response.readableStreamBody }));
	        }
	        const modelProperties = (typeName === "Composite" && bodyMapper.type.modelProperties) || {};
	        const isPageableResponse = Object.keys(modelProperties).some((k) => modelProperties[k].serializedName === "");
	        if (typeName === "Sequence" || isPageableResponse) {
	            const arrayResponse = [...(_response.parsedBody || [])];
	            for (const key of Object.keys(modelProperties)) {
	                if (modelProperties[key].serializedName) {
	                    arrayResponse[key] = _response.parsedBody[key];
	                }
	            }
	            if (parsedHeaders) {
	                for (const key of Object.keys(parsedHeaders)) {
	                    arrayResponse[key] = parsedHeaders[key];
	                }
	            }
	            addOperationResponse(arrayResponse);
	            return arrayResponse;
	        }
	        if (typeName === "Composite" || typeName === "Dictionary") {
	            return addOperationResponse(Object.assign(Object.assign({}, parsedHeaders), _response.parsedBody));
	        }
	    }
	    if (bodyMapper ||
	        _response.request.method === "HEAD" ||
	        isPrimitiveType(_response.parsedBody)) {
	        // primitive body types and HEAD booleans
	        return addOperationResponse(Object.assign(Object.assign({}, parsedHeaders), { body: _response.parsedBody }));
	    }
	    return addOperationResponse(Object.assign(Object.assign({}, parsedHeaders), _response.parsedBody));
	}
	function getCredentialScopes(options, baseUri) {
	    if (options === null || options === void 0 ? void 0 : options.credentialScopes) {
	        const scopes = options.credentialScopes;
	        return Array.isArray(scopes)
	            ? scopes.map((scope) => new URL(scope).toString())
	            : new URL(scopes).toString();
	    }
	    if (baseUri) {
	        return `${baseUri}/.default`;
	    }
	    return undefined;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * This function is only here for compatibility. Use createSpanFunction in core-tracing.
	 *
	 * @deprecated This function is only here for compatibility. Use createSpanFunction in core-tracing.
	 * @hidden

	 * @param spanConfig - The name of the operation being performed.
	 * @param tracingOptions - The options for the underlying http request.
	 */
	function createSpanFunction(args) {
	    return createSpanFunction$1(args);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Defines the default token refresh buffer duration.
	 */
	const TokenRefreshBufferMs = 2 * 60 * 1000; // 2 Minutes
	/**
	 * Provides an {@link AccessTokenCache} implementation which clears
	 * the cached {@link AccessToken}'s after the expiresOnTimestamp has
	 * passed.
	 *
	 * @deprecated No longer used in the bearer authorization policy.
	 */
	class ExpiringAccessTokenCache {
	    /**
	     * Constructs an instance of {@link ExpiringAccessTokenCache} with
	     * an optional expiration buffer time.
	     */
	    constructor(tokenRefreshBufferMs = TokenRefreshBufferMs) {
	        this.cachedToken = undefined;
	        this.tokenRefreshBufferMs = tokenRefreshBufferMs;
	    }
	    /**
	     * Saves an access token into the internal in-memory cache.
	     * @param accessToken - Access token or undefined to clear the cache.
	     */
	    setCachedToken(accessToken) {
	        this.cachedToken = accessToken;
	    }
	    /**
	     * Returns the cached access token, or `undefined` if one is not cached or the cached one is expiring soon.
	     */
	    getCachedToken() {
	        if (this.cachedToken &&
	            Date.now() + this.tokenRefreshBufferMs >= this.cachedToken.expiresOnTimestamp) {
	            this.cachedToken = undefined;
	        }
	        return this.cachedToken;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Helps the core-http token authentication policies with requesting a new token if we're not currently waiting for a new token.
	 *
	 * @deprecated No longer used in the bearer authorization policy.
	 */
	class AccessTokenRefresher {
	    constructor(credential, scopes, requiredMillisecondsBeforeNewRefresh = 30000) {
	        this.credential = credential;
	        this.scopes = scopes;
	        this.requiredMillisecondsBeforeNewRefresh = requiredMillisecondsBeforeNewRefresh;
	        this.lastCalled = 0;
	    }
	    /**
	     * Returns true if the required milliseconds(defaulted to 30000) have been passed signifying
	     * that we are ready for a new refresh.
	     */
	    isReady() {
	        // We're only ready for a new refresh if the required milliseconds have passed.
	        return (!this.lastCalled || Date.now() - this.lastCalled > this.requiredMillisecondsBeforeNewRefresh);
	    }
	    /**
	     * Stores the time in which it is called,
	     * then requests a new token,
	     * then sets this.promise to undefined,
	     * then returns the token.
	     */
	    async getToken(options) {
	        this.lastCalled = Date.now();
	        const token = await this.credential.getToken(this.scopes, options);
	        this.promise = undefined;
	        return token || undefined;
	    }
	    /**
	     * Requests a new token if we're not currently waiting for a new token.
	     * Returns null if the required time between each call hasn't been reached.
	     */
	    refresh(options) {
	        if (!this.promise) {
	            this.promise = this.getToken(options);
	        }
	        return this.promise;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	const HeaderConstants = Constants.HeaderConstants;
	const DEFAULT_AUTHORIZATION_SCHEME = "Basic";
	/**
	 * A simple {@link ServiceClientCredential} that authenticates with a username and a password.
	 */
	class BasicAuthenticationCredentials {
	    /**
	     * Creates a new BasicAuthenticationCredentials object.
	     *
	     * @param userName - User name.
	     * @param password - Password.
	     * @param authorizationScheme - The authorization scheme.
	     */
	    constructor(userName, password, authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME) {
	        /**
	         * Authorization scheme. Defaults to "Basic".
	         * More information about authorization schemes is available here: https://developer.mozilla.org/docs/Web/HTTP/Authentication#authentication_schemes
	         */
	        this.authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME;
	        if (userName === null || userName === undefined || typeof userName.valueOf() !== "string") {
	            throw new Error("userName cannot be null or undefined and must be of type string.");
	        }
	        if (password === null || password === undefined || typeof password.valueOf() !== "string") {
	            throw new Error("password cannot be null or undefined and must be of type string.");
	        }
	        this.userName = userName;
	        this.password = password;
	        this.authorizationScheme = authorizationScheme;
	    }
	    /**
	     * Signs a request with the Authentication header.
	     *
	     * @param webResource - The WebResourceLike to be signed.
	     * @returns The signed request object.
	     */
	    signRequest(webResource) {
	        const credentials = `${this.userName}:${this.password}`;
	        const encodedCredentials = `${this.authorizationScheme} ${encodeString(credentials)}`;
	        if (!webResource.headers)
	            webResource.headers = new HttpHeaders();
	        webResource.headers.set(HeaderConstants.AUTHORIZATION, encodedCredentials);
	        return Promise.resolve(webResource);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Authenticates to a service using an API key.
	 */
	class ApiKeyCredentials {
	    /**
	     * @param options - Specifies the options to be provided for auth. Either header or query needs to be provided.
	     */
	    constructor(options) {
	        if (!options || (options && !options.inHeader && !options.inQuery)) {
	            throw new Error(`options cannot be null or undefined. Either "inHeader" or "inQuery" property of the options object needs to be provided.`);
	        }
	        this.inHeader = options.inHeader;
	        this.inQuery = options.inQuery;
	    }
	    /**
	     * Signs a request with the values provided in the inHeader and inQuery parameter.
	     *
	     * @param webResource - The WebResourceLike to be signed.
	     * @returns The signed request object.
	     */
	    signRequest(webResource) {
	        if (!webResource) {
	            return Promise.reject(new Error(`webResource cannot be null or undefined and must be of type "object".`));
	        }
	        if (this.inHeader) {
	            if (!webResource.headers) {
	                webResource.headers = new HttpHeaders();
	            }
	            for (const headerName in this.inHeader) {
	                webResource.headers.set(headerName, this.inHeader[headerName]);
	            }
	        }
	        if (this.inQuery) {
	            if (!webResource.url) {
	                return Promise.reject(new Error(`url cannot be null in the request object.`));
	            }
	            if (webResource.url.indexOf("?") < 0) {
	                webResource.url += "?";
	            }
	            for (const key in this.inQuery) {
	                if (!webResource.url.endsWith("?")) {
	                    webResource.url += "&";
	                }
	                webResource.url += `${key}=${this.inQuery[key]}`;
	            }
	        }
	        return Promise.resolve(webResource);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * A {@link TopicCredentials} object used for Azure Event Grid.
	 */
	class TopicCredentials extends ApiKeyCredentials {
	    /**
	     * Creates a new EventGrid TopicCredentials object.
	     *
	     * @param topicKey - The EventGrid topic key
	     */
	    constructor(topicKey) {
	        if (!topicKey || (topicKey && typeof topicKey !== "string")) {
	            throw new Error("topicKey cannot be null or undefined and must be of type string.");
	        }
	        const options = {
	            inHeader: {
	                "aeg-sas-key": topicKey,
	            },
	        };
	        super(options);
	    }
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	async function addTransform(recorderUrl, httpClient, transform, recordingId) {
	    var _a;
	    const url = `${recorderUrl}${paths.admin}${paths.addTransform}`;
	    const request = createPipelineRequest({ url, method: "POST", allowInsecureConnection: true });
	    request.headers.set("x-abstraction-identifier", transform.type);
	    if (recordingId) {
	        request.headers.set("x-recording-id", recordingId);
	    }
	    request.body = JSON.stringify(Object.assign(Object.assign({}, (transform.applyCondition ? { applyCondition: transform.applyCondition } : {})), ((_a = transform.params) !== null && _a !== void 0 ? _a : {})));
	    const { status, bodyAsText } = await httpClient.sendRequest(request);
	    if (status < 200 || status > 299) {
	        throw new RecorderError(`addTransform failed: ${bodyAsText}`, status);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * This client manages the recorder life cycle and interacts with the proxy-tool to do the recording,
	 * eventually save them in record mode and playing them back in playback mode.
	 *
	 * For Core V2 SDKs,
	 * - Use the `configureClient` method to add recorder policy on your client.
	 * For core-v1 SDKs,
	 * - Use the `configureClientOptionsCoreV1` method to modify the httpClient on your client options
	 *
	 * Other than configuring your clients, use `start`, `stop`, `addSanitizers` methods to use the recorder.
	 */
	class Recorder {
	    constructor(testContext) {
	        this.testContext = testContext;
	        this.url = "http://localhost:5000";
	        this.stateManager = new RecordingStateManager();
	        if (isRecordMode() || isPlaybackMode()) {
	            if (this.testContext) {
	                this.sessionFile = sessionFilePath(this.testContext);
	                this.httpClient = createDefaultHttpClient();
	            }
	            else {
	                throw new Error("Unable to determine the recording file path, testContext provided is not defined.");
	            }
	        }
	        this.variables = {};
	    }
	    /**
	     * redirectRequest updates the request in record and playback modes to hit the proxy-tool with appropriate headers.
	     * Works for both core-v1 and core-v2
	     *
	     * - WebResource -> core-v1
	     * - PipelineRequest -> core-v2 (recorderHttpPolicy calls this method on the request to modify and hit the proxy-tool with appropriate headers.)
	     */
	    redirectRequest(request) {
	        if (!isLiveMode() && !request.headers.get("x-recording-id")) {
	            if (this.recordingId === undefined) {
	                throw new RecorderError("Recording ID must be defined to redirect a request");
	            }
	            request.headers.set("x-recording-id", this.recordingId);
	            request.headers.set("x-recording-mode", getTestMode());
	            const upstreamUrl = new URL(request.url);
	            const redirectedUrl = new URL(request.url);
	            const providedUrl = new URL(this.url);
	            redirectedUrl.host = providedUrl.host;
	            redirectedUrl.port = providedUrl.port;
	            redirectedUrl.protocol = providedUrl.protocol;
	            request.headers.set("x-recording-upstream-base-uri", upstreamUrl.toString());
	            request.url = redirectedUrl.toString();
	            if (!(request instanceof WebResource)) {
	                // for core-v2
	                request.allowInsecureConnection = true;
	            }
	        }
	    }
	    /**
	     * addSanitizers adds the sanitizers for the current recording which will be applied on it before being saved.
	     *
	     * Takes SanitizerOptions as the input, passes on to the proxy-tool.
	     *
	     * By default, it applies only to record mode.
	     *
	     * If you want this to be applied in a specific mode or in a combination of modes, use the "mode" argument.
	     */
	    async addSanitizers(options, mode = ["record"]) {
	        if (isLiveMode())
	            return;
	        const actualTestMode = getTestMode();
	        if (mode.includes(actualTestMode) &&
	            ensureExistence(this.httpClient, "this.httpClient") &&
	            ensureExistence(this.recordingId, "this.recordingId")) {
	            return addSanitizers(this.httpClient, this.url, this.recordingId, options);
	        }
	    }
	    async addTransform(transform) {
	        if (isPlaybackMode() &&
	            ensureExistence(this.httpClient, "this.httpClient") &&
	            ensureExistence(this.recordingId, "this.recordingId")) {
	            await addTransform(this.url, this.httpClient, transform, this.recordingId);
	        }
	    }
	    /**
	     * Call this method to ping the proxy-tool with a start request
	     * signalling to start recording in the record mode
	     * or to start playing back in the playback mode.
	     *
	     * Takes RecorderStartOptions as the input, which will get used in record and playback modes.
	     * Includes
	     * - envSetupForPlayback - The key-value pairs will be used as the environment variables in playback mode. If the env variables are present in the recordings as plain strings, they will be replaced with the provided values.
	     * - sanitizerOptions - Generated recordings are updated by the "proxy-tool" based on the sanitizer options provided, these santizers are applied only in "record" mode.
	     */
	    async start(options) {
	        if (isLiveMode())
	            return;
	        this.stateManager.state = "started";
	        if (this.recordingId === undefined) {
	            const startUri = `${this.url}${isPlaybackMode() ? paths.playback : paths.record}${paths.start}`;
	            const req = createRecordingRequest(startUri, this.sessionFile, this.recordingId);
	            if (ensureExistence(this.httpClient, "TestProxyHttpClient.httpClient")) {
	                const rsp = await this.httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	                if (rsp.status !== 200) {
	                    throw new RecorderError("Start request failed.");
	                }
	                const id = rsp.headers.get("x-recording-id");
	                if (!id) {
	                    throw new RecorderError("No recording ID returned for a successful start request.");
	                }
	                this.recordingId = id;
	                if (isPlaybackMode()) {
	                    this.variables = rsp.bodyAsText ? JSON.parse(rsp.bodyAsText) : {};
	                }
	                await handleEnvSetup(this.httpClient, this.url, this.recordingId, options.envSetupForPlayback);
	                // Sanitizers to be added only in record mode
	                if (isRecordMode() && options.sanitizerOptions) {
	                    // Makes a call to the proxy-tool to add the sanitizers for the current recording id
	                    // Recordings of the current test will be influenced by the sanitizers that are being added here
	                    await this.addSanitizers(options.sanitizerOptions);
	                }
	            }
	        }
	    }
	    /**
	     * Call this method to ping the proxy-tool with a stop request, this helps saving the recording in record mode.
	     */
	    async stop() {
	        if (isLiveMode())
	            return;
	        this.stateManager.state = "stopped";
	        if (this.recordingId !== undefined) {
	            const stopUri = `${this.url}${isPlaybackMode() ? paths.playback : paths.record}${paths.stop}`;
	            const req = createRecordingRequest(stopUri, undefined, this.recordingId);
	            req.headers.set("x-recording-save", "true");
	            if (isRecordMode()) {
	                req.headers.set("Content-Type", "application/json");
	                req.body = JSON.stringify(this.variables);
	            }
	            if (ensureExistence(this.httpClient, "TestProxyHttpClient.httpClient")) {
	                const rsp = await this.httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	                if (rsp.status !== 200) {
	                    throw new RecorderError("Stop request failed.");
	                }
	            }
	        }
	        else {
	            throw new RecorderError("Bad state, recordingId is not defined when called stop.");
	        }
	    }
	    /**
	     * Sets the matcher for the current recording to the matcher specified.
	     */
	    async setMatcher(matcher, options) {
	        if (isPlaybackMode()) {
	            if (!this.httpClient) {
	                throw new RecorderError("httpClient should be defined in playback mode");
	            }
	            await setMatcher(this.url, this.httpClient, matcher, this.recordingId, options);
	        }
	    }
	    async transformsInfo() {
	        if (isLiveMode()) {
	            throw new RecorderError("Cannot call transformsInfo in live mode");
	        }
	        if (ensureExistence(this.httpClient, "this.httpClient")) {
	            return await transformsInfo(this.httpClient, this.url, this.recordingId);
	        }
	        throw new RecorderError("Expected httpClient to be defined");
	    }
	    /**
	     * For core-v2 - libraries depending on core-rest-pipeline.
	     * This method adds the recording policy to the additionalPolicies in the client options.
	     *
	     * Helps in redirecting the requests to the proxy tool instead of directly going to the service.
	     *
	     * Note: Client Options must have "additionalPolicies" as part of the options.
	     */
	    configureClientOptions(options) {
	        if (isLiveMode())
	            return options;
	        if (!options.additionalPolicies)
	            options.additionalPolicies = [];
	        options.additionalPolicies.push({
	            policy: this.recorderHttpPolicy(),
	            position: "perRetry",
	        });
	        return options;
	    }
	    /**
	     * For core-v1 - libraries depending on core-http.
	     * This method adds the custom httpClient to the client options.
	     *
	     * Helps in redirecting the requests to the proxy tool instead of directly going to the service.
	     */
	    configureClientOptionsCoreV1(options) {
	        if (isLiveMode())
	            return options;
	        return Object.assign(Object.assign({}, options), { httpClient: once(() => this.createHttpClientCoreV1())() });
	    }
	    /**
	     * recorderHttpPolicy that can be added as a pipeline policy for any of the core-v2 SDKs(SDKs depending on core-rest-pipeline)
	     */
	    recorderHttpPolicy() {
	        return {
	            name: "recording policy",
	            sendRequest: async (request, next) => {
	                this.redirectRequest(request);
	                return next(request);
	            },
	        };
	    }
	    /**
	     * Creates a client that supports redirecting the requests to the proxy-tool.
	     * Needed for the core-v1 SDKs(SDKs depending on core-http)
	     */
	    createHttpClientCoreV1() {
	        const client = new XhrHttpClient();
	        return {
	            sendRequest: async (request) => {
	                this.redirectRequest(request);
	                return client.sendRequest(request);
	            },
	        };
	    }
	    variable(name, value = undefined) {
	        if (isPlaybackMode()) {
	            const recordedValue = this.variables[name];
	            if (recordedValue === undefined) {
	                throw new RecorderError(`Tried to access a variable in playback that was not set in recording: ${name}`);
	            }
	            return recordedValue;
	        }
	        if (!this.variables[name]) {
	            if (value === undefined) {
	                throw new RecorderError(`Tried to access uninitialized variable: ${name}. You must initialize it with a value before using it.`);
	            }
	            this.variables[name] = value;
	        }
	        return this.variables[name];
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Usage - `await delay(<milliseconds>)`
	 * This `delay` has no effect if the `TEST_MODE` is `"playback"`.
	 * If the `TEST_MODE` is not `"playback"`, `delay` is a wrapper for setTimeout that resolves a promise after t milliseconds.
	 *
	 * @param {number} milliseconds The number of milliseconds to be delayed.
	 */
	function delay(milliseconds) {
	    if (isPlaybackMode()) {
	        return;
	    }
	    return new Promise((resolve) => setTimeout(resolve, milliseconds));
	}

	// Copyright (c) Microsoft Corporation.

	"use strict";

	const envSetupForPlayback = {
	    ENDPOINT: "https://endpoint",
	    AZURE_CLIENT_ID: "azure_client_id",
	    AZURE_CLIENT_SECRET: "azure_client_secret",
	    AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
	    SUBSCRIPTION_ID: "azure_subscription_id",
	};
	const recorderEnvSetup = {
	    envSetupForPlayback,
	};
	/**
	 * creates the recorder and reads the environment variables from the `.env` file.
	 * Should be called first in the test suite to make sure environment variables are
	 * read before they are being used.
	 */
	async function createRecorder(context) {
	    const recorder = new Recorder(context.currentTest);
	    await recorder.start(recorderEnvSetup);
	    return recorder;
	}

	describe("My test", () => {
	    let recorder;
	    beforeEach(async function () {
	        recorder = await createRecorder(this);
	    });
	    afterEach(async function () {
	        await recorder.stop();
	    });
	    it("sample test", async function () {
	        assert.equal(1, 1);
	    });
	});

}));
//# sourceMappingURL=index.browser.js.map
