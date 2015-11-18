/**
 * Generated by Apache Flex Cross-Compiler from weavejs\path\WeavePath.as
 * weavejs.path.WeavePath
 *
 * @fileoverview
 *
 * @suppress {checkTypes}
 */

goog.provide('weavejs.path.WeavePath');

goog.require('weavejs.Weave');
goog.require('weavejs.WeaveAPI');
goog.require('weavejs.core.SessionManager');
goog.require('weavejs.api.core.ILinkableDynamicObject');
goog.require('weavejs.api.core.ILinkableHashMap');
goog.require('weavejs.api.core.ILinkableObject');



/**
 * WeavePath constructor.  WeavePath objects are immutable after they are created.
 * @class WeavePath
 * @asparam basePath An optional Array specifying the path to an object in the session state.
 *                 A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn A WeavePath object.
 * @constructor
 * @param {weavejs.Weave} weave
 * @param {Array} basePath
 */
weavejs.path.WeavePath = function(weave, basePath) {
  this.weave = weave;
  this._path = weavejs.path.WeavePath._A(basePath, 1);
  this._parent = null;
};


/**
 * @export
 * @type {weavejs.Weave}
 */
weavejs.path.WeavePath.prototype.weave;


/**
 * @protected
 * @type {Array}
 */
weavejs.path.WeavePath.prototype._path;


/**
 * @protected
 * @type {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype._parent;


/**
 * Private function for internal use.
 * 
 * Converts an arguments object to an Array.
 * @asparam args An arguments object.
 * @asparam option An integer flag for special behavior.
 *   - If set to 1, it handles arguments like (...LIST) where LIST can be either an Array or multiple arguments.
 *   - If set to 2, it handles arguments like (...LIST, REQUIRED_PARAM) where LIST can be either an Array or multiple arguments.
 * @asprivate
 * @protected
 * @param {Array} args
 * @param {number=} option
 * @return {Array}
 */
weavejs.path.WeavePath._A = function(args, option) {
  option = typeof option !== 'undefined' ? option : 0;
  if (args.length == option && org.apache.flex.utils.Language.is(args[0], Array))
    return [].concat(args[0], Array.prototype.slice.call(args, 1));
  return Array.prototype.slice.call(args);
};


/**
 * Creates a new WeavePath relative to the current one.
 * @asparam relativePath An Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn A new WeavePath object which remembers the current WeavePath as its parent.
 * @export
 * @param {...} relativePath
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.push = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  var /** @type {weavejs.path.WeavePath} */ newWeavePath = new this.constructor(this.weave, this.getPath(relativePath));
  newWeavePath._parent = this;
  return newWeavePath;
};


/**
 * Returns to the previous WeavePath that spawned the current one with push().
 * @asreturn The parent WeavePath object.
 * @export
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.pop = function() {
  if (this._parent)
    return this._parent;
  else
    weavejs.path.WeavePath._failMessage('pop', 'stack is empty');
  return null;
};


/**
 * Requests that an object be created if it doesn't already exist at the current path (or relative path, if specified).
 * This function can also be used to assert that the object at the current path is of the type you expect it to be.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam objectType The name of an ActionScript class in Weave.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} relativePath_objectType
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.request = function(relativePath_objectType) {
  relativePath_objectType = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_objectType, 2);
  if (weavejs.path.WeavePath._assertParams('request', args)) {
    var /** @type {string} */ type = args.pop();
    var /** @type {Array} */ relativePath = args;
    this.weave.directAPI.requestObject(this.push(relativePath), type) || weavejs.path.WeavePath._failPath('request', this.getPath(relativePath));
  }
  return this;
};


/**
 * Removes a dynamically created object.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} relativePath
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.remove = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  this.weave.directAPI.removeObject(this.push(relativePath)) || weavejs.path.WeavePath._failPath('remove', this.getPath(relativePath));
  return this;
};


/**
 * Reorders the children of an ILinkableHashMap at the current path.
 * @asparam orderedNames An Array (or multiple parameters) specifying ordered child names.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} orderedNames
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.reorder = function(orderedNames) {
  orderedNames = Array.prototype.slice.call(arguments, 0);
  orderedNames = weavejs.path.WeavePath._A(orderedNames, 1);
  if (weavejs.path.WeavePath._assertParams('reorder', orderedNames)) {
    var /** @type {weavejs.api.core.ILinkableHashMap} */ hashMap = org.apache.flex.utils.Language.as(this.getObject(), weavejs.api.core.ILinkableHashMap);
    if (hashMap) {
      if (orderedNames)
        hashMap.setNameOrder(orderedNames);
    }
    weavejs.path.WeavePath._failMessage('reorder', 'path does not refer to an ILinkableHashMap: ' + this);
  }
  return this;
};


/**
 * Sets the session state of the object at the current path or relative to the current path.
 * Any existing dynamically created objects that do not appear in the new state will be removed.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam state The session state to apply.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} relativePath_state
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.state = function(relativePath_state) {
  relativePath_state = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_state, 2);
  if (weavejs.path.WeavePath._assertParams('state', args)) {
    var /** @type {Object} */ state = args.pop();
    var /** @type {weavejs.api.core.ILinkableObject} */ obj = this.getObject(args);
    if (obj)
      weavejs.WeaveAPI.SessionManager.setSessionState(obj, state, true);
    else
      weavejs.path.WeavePath._failObject('state', this.getPath(args));
  }
  return this;
};


/**
 * Applies a session state diff to the object at the current path or relative to the current path.
 * Existing dynamically created objects that do not appear in the new state will remain unchanged.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam diff The session state diff to apply.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} relativePath_diff
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.diff = function(relativePath_diff) {
  relativePath_diff = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_diff, 2);
  if (weavejs.path.WeavePath._assertParams('diff', args)) {
    var /** @type {Object} */ diff = args.pop();
    var /** @type {weavejs.api.core.ILinkableObject} */ obj = this.getObject(args);
    if (obj)
      weavejs.WeaveAPI.SessionManager.setSessionState(obj, diff, false);
    else
      weavejs.path.WeavePath._failObject('diff', this.getPath(args));
  }
  return this;
};


/**
 * Adds a callback to the object at the current path.
 * When the callback is called, a WeavePath object initialized at the current path will be used as the 'this' context.
 * If the same callback is added to multiple paths, only the last path will be used as the 'this' context.
 * @asparam callback The callback function.
 * @asparam triggerCallbackNow Optional parameter, when set to true will trigger the callback now.
 * @asparam immediateMode Optional parameter, when set to true will use an immediate callback instead of a grouped callback.
 * @asparam delayWhileBusy Optional parameter, specifies whether to delay the callback while the object is busy. Default is true.
 * @asreturn The current WeavePath object.
 * @export
 * @param {Function} callback
 * @param {boolean=} triggerCallbackNow
 * @param {boolean=} immediateMode
 * @param {boolean=} delayWhileBusy
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.addCallback = function(callback, triggerCallbackNow, immediateMode, delayWhileBusy) {
  triggerCallbackNow = typeof triggerCallbackNow !== 'undefined' ? triggerCallbackNow : false;
  immediateMode = typeof immediateMode !== 'undefined' ? immediateMode : false;
  delayWhileBusy = typeof delayWhileBusy !== 'undefined' ? delayWhileBusy : true;
  if (weavejs.path.WeavePath._assertParams('addCallback', arguments)) {
    var /** @type {Array} */ args = Array.prototype.slice.call(arguments);
    args.unshift(this);
    this.weave.directAPI.addCallback.apply(this.weave.directAPI, args) || weavejs.path.WeavePath._failObject('addCallback', this._path);
  }
  return this;
};


/**
 * Removes a callback from the object at the current path or from everywhere.
 * @asparam callback The callback function.
 * @asparam everywhere Optional parameter, if set to true will remove the callback from every object to which it was added.
 * @asreturn The current WeavePath object.
 * @export
 * @param {*} callback
 * @param {*} everywhere
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.removeCallback = function(callback, everywhere) {
  if (weavejs.path.WeavePath._assertParams('removeCallback', arguments)) {
    this.weave.directAPI.removeCallback(this, callback, everywhere) || weavejs.path.WeavePath._failObject('removeCallback', this._path);
  }
  return this;
};


/**
 * Calls a function using the current WeavePath object as the 'this' value.
 * @asparam func The function to call.
 * @asparam args An optional list of arguments to pass to the function.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} func_args
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.call = function(func_args) {
  func_args = Array.prototype.slice.call(arguments, 0);
  if (weavejs.path.WeavePath._assertParams('call', func_args)) {
    var /** @type {Array} */ a = weavejs.path.WeavePath._A(func_args);
    a.shift().apply(this, a);
  }
  return this;
};


/**
 * Applies a function to each item in an Array or an Object.
 * @asparam items Either an Array or an Object to iterate over.
 * @asparam visitorFunction A function to be called for each item in items. The function will be called using the current
 *                        WeavePath object as the 'this' value and will receive three parameters:  item, key, items.
 *                        If items is an Array, the key will be an integer. If items is an Object, the key will be a String.
 * @asreturn The current WeavePath object.
 * @export
 * @param {*} items
 * @param {*} visitorFunction
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.forEach = function(items, visitorFunction) {
  if (weavejs.path.WeavePath._assertParams('forEach', arguments, 2)) {
    if (org.apache.flex.utils.Language.is(items, Array) && Array.prototype.forEach)
      items.forEach(visitorFunction, this);
    else
      for (var /** @type {string} */ key in items)
        visitorFunction.call(this, items[key], key, items);
  }
  return this;
};


/**
 * Calls a function for each child of the current WeavePath or the one specified by a relativePath. The function receives child names.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam visitorFunction A function to be called for each child object. The function will be called using the current
 *                        WeavePath object as the 'this' value and will receive three parameters:  name, index, names.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} relativePath_visitorFunction
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.forEachName = function(relativePath_visitorFunction) {
  relativePath_visitorFunction = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_visitorFunction, 2);
  if (weavejs.path.WeavePath._assertParams('forEachName', args)) {
    var /** @type {Function} */ visitorFunction = org.apache.flex.utils.Language.as(args.pop(), Function);
    this.getNames(args).forEach(visitorFunction, this);
  }
  return this;
};


/**
 * Calls a function for each child of the current WeavePath or the one specified by a relativePath. The function receives child WeavePath objects.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam visitorFunction A function to be called for each child object. The function will be called using the current
 *                        WeavePath object as the 'this' value and will receive three parameters:  child, index, children.
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} relativePath_visitorFunction
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.forEachChild = function(relativePath_visitorFunction) {
  relativePath_visitorFunction = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_visitorFunction, 2);
  if (weavejs.path.WeavePath._assertParams('forEachChild', args)) {
    var /** @type {Function} */ visitorFunction = args.pop();
    this.getChildren(args).forEach(visitorFunction, this);
  }
  return this;
};


/**
 * Calls weaveTrace() in Weave to print to the log window.
 * @asparam args A list of parameters to pass to weaveTrace().
 * @asreturn The current WeavePath object.
 * @export
 * @param {...} args
 * @return {weavejs.path.WeavePath}
 */
weavejs.path.WeavePath.prototype.trace = function(args) {
  args = Array.prototype.slice.call(arguments, 0);
  weavejs.Weave.log.apply(weavejs.Weave, weavejs.path.WeavePath._A(args));
  return this;
};


/**
 * Returns a copy of the current path Array or the path Array of a descendant object.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names to be appended to the result.
 * @asreturn An Array of successive child names used to identify an object in a Weave session state.
 * @export
 * @param {...} relativePath
 * @return {Array}
 */
weavejs.path.WeavePath.prototype.getPath = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  return this._path.concat(weavejs.path.WeavePath._A(relativePath, 1));
};


/**
 * @private
 * @param {...} relativePath
 * @return {Array}
 */
weavejs.path.WeavePath.prototype._getChildNames = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  var /** @type {weavejs.api.core.ILinkableObject} */ object = this.getObject(relativePath);
  if (object) {
    if (org.apache.flex.utils.Language.is(object, weavejs.api.core.ILinkableHashMap))
      return org.apache.flex.utils.Language.as(object, weavejs.api.core.ILinkableHashMap).getNames();
    if (org.apache.flex.utils.Language.is(object, weavejs.api.core.ILinkableDynamicObject))
      return [null];
    return org.apache.flex.utils.Language.as(weavejs.WeaveAPI.SessionManager, weavejs.core.SessionManager).getLinkablePropertyNames(object, true);
  }
  throw new Error("No ILinkableObject for which to get child names at " + this);
};


/**
 * Gets an Array of child names under the object at the current path or relative to the current path.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn An Array of child names.
 * @export
 * @param {...} relativePath
 * @return {Array}
 */
weavejs.path.WeavePath.prototype.getNames = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  return this._getChildNames(relativePath);
};


/**
 * Gets an Array of child WeavePath objects under the object at the current path or relative to the current path.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn An Array of child WeavePath objects.
 * @export
 * @param {...} relativePath
 * @return {Array}
 */
weavejs.path.WeavePath.prototype.getChildren = function(relativePath) {
  var self = this;
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  return this._getChildNames(relativePath).map(function(name) {
    return this.push(relativePath.concat(name));
  }, this);
};


/**
 * Gets the type (qualified class name) of the object at the current path or relative to the current path.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn The qualified class name of the object at the current or descendant path, or null if there is no object.
 * @export
 * @param {...} relativePath
 * @return {string}
 */
weavejs.path.WeavePath.prototype.getType = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  return weavejs.Weave.className(this.getObject(relativePath));
};


/**
 * Gets the session state of an object at the current path or relative to the current path.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asreturn The session state of the object at the current or descendant path.
 * @export
 * @param {...} relativePath
 * @return {Object}
 */
weavejs.path.WeavePath.prototype.getState = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  var /** @type {weavejs.api.core.ILinkableObject} */ obj = this.getObject(relativePath);
  if (obj)
    return weavejs.WeaveAPI.SessionManager.getSessionState(obj);
  else
    weavejs.Weave.error("No ILinkableObject from which to get session state at " + this.push(relativePath));
  return null;
};


/**
 * Gets the changes that have occurred since previousState for the object at the current path or relative to the current path.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam previousState The previous state for comparison.
 * @asreturn A session state diff.
 * @export
 * @param {...} relativePath_previousState
 * @return {Object}
 */
weavejs.path.WeavePath.prototype.getDiff = function(relativePath_previousState) {
  relativePath_previousState = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_previousState, 2);
  if (weavejs.path.WeavePath._assertParams('getDiff', args)) {
    var /** @type {Object} */ previousState = args.pop();
    var /** @type {weavejs.api.core.ILinkableObject} */ obj = this.getObject(args);
    if (obj)
      return weavejs.WeaveAPI.SessionManager.computeDiff(previousState, weavejs.WeaveAPI.SessionManager.getSessionState(obj));
    else
      weavejs.Weave.error("No ILinkableObject from which to get diff at " + this.push(args));
  }
  return null;
};


/**
 * Gets the changes that would have to occur to get to another state for the object at the current path or relative to the current path.
 * @asparam relativePath An optional Array (or multiple parameters) specifying descendant names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @asparam otherState The other state for comparison.
 * @asreturn A session state diff.
 * @export
 * @param {...} relativePath_otherState
 * @return {Object}
 */
weavejs.path.WeavePath.prototype.getReverseDiff = function(relativePath_otherState) {
  relativePath_otherState = Array.prototype.slice.call(arguments, 0);
  var /** @type {Array} */ args = weavejs.path.WeavePath._A(relativePath_otherState, 2);
  if (weavejs.path.WeavePath._assertParams('getReverseDiff', args)) {
    var /** @type {Object} */ otherState = args.pop();
    var /** @type {weavejs.api.core.ILinkableObject} */ obj = this.getObject(args);
    if (obj)
      return weavejs.WeaveAPI.SessionManager.computeDiff(weavejs.WeaveAPI.SessionManager.getSessionState(obj), otherState);
    else
      weavejs.Weave.error("No ILinkableObject from which to get reverse diff at " + this.push(args));
  }
  return null;
};


/**
 * Returns the value of an ActionScript expression or variable using the current path, vars, and libs.
 * The 'this' context within the script will be set to the object at the current path.
 * @asparam script_or_variableName The script to be evaluated by Weave, or simply a variable name.
 * @asreturn The result of evaluating the script or variable.
 * @export
 * @param {...} func_args
 * @return {Object}
 */
weavejs.path.WeavePath.prototype.getValue = function(func_args) {
  func_args = Array.prototype.slice.call(arguments, 0);
  if (weavejs.path.WeavePath._assertParams('getValue', func_args)) {
    var /** @type {Array} */ a = weavejs.path.WeavePath._A(func_args);
    return a.shift().apply(this, a);
  }
  return null;
};


/**
 * @export
 * @param {...} relativePath
 * @return {weavejs.api.core.ILinkableObject}
 */
weavejs.path.WeavePath.prototype.getObject = function(relativePath) {
  relativePath = Array.prototype.slice.call(arguments, 0);
  relativePath = weavejs.path.WeavePath._A(relativePath, 1);
  return weavejs.WeaveAPI.SessionManager.getObject(this.weave.root, this.getPath(relativePath));
};


/**
 * Provides a human-readable string containing the path.
 * @export
 * @return {string}
 */
weavejs.path.WeavePath.prototype.toString = function() {
  return "WeavePath(" + JSON.stringify(this._path) + ")";
};


/**
 * @protected
 * @param {string} methodName
 * @param {Array} args
 * @param {number=} minLength
 * @return {boolean}
 */
weavejs.path.WeavePath._assertParams = function(methodName, args, minLength) {
  minLength = typeof minLength !== 'undefined' ? minLength : 1;
  if (!minLength)
    minLength = 1;
  if (args.length < minLength) {
    var /** @type {string} */ msg = 'requires at least ' + (minLength == 1) ? 'one parameter' : (minLength + ' parameters');
    weavejs.path.WeavePath._failMessage(methodName, msg);
    return false;
  }
  return true;
};


/**
 * @protected
 * @param {string} methodName
 * @param {Array} path
 * @return {*}
 */
weavejs.path.WeavePath._failPath = function(methodName, path) {
  weavejs.path.WeavePath._failMessage(methodName, 'command failed', path);
};


/**
 * @protected
 * @param {string} methodName
 * @param {Array} path
 * @return {*}
 */
weavejs.path.WeavePath._failObject = function(methodName, path) {
  weavejs.path.WeavePath._failMessage(methodName, 'object does not exist', path);
};


/**
 * @protected
 * @param {string} methodName
 * @param {string} message
 * @param {Array=} path
 * @return {*}
 */
weavejs.path.WeavePath._failMessage = function(methodName, message, path) {
  path = typeof path !== 'undefined' ? path : null;
  var /** @type {string} */ str = 'WeavePath.' + methodName + '(): ' + message;
  if (path)
    str += ' (path: ' + JSON.stringify(path) + ')';
  throw new Error(str);
};


/**
 * Metadata
 *
 * @type {Object.<string, Array.<Object>>}
 */
weavejs.path.WeavePath.prototype.FLEXJS_CLASS_INFO = { names: [{ name: 'WeavePath', qName: 'weavejs.path.WeavePath'}] };
