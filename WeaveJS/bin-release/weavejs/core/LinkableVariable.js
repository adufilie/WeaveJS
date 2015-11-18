/**
 * Generated by Apache Flex Cross-Compiler from weavejs\core\LinkableVariable.as
 * weavejs.core.LinkableVariable
 *
 * @fileoverview
 *
 * @suppress {checkTypes}
 */

goog.provide('weavejs.core.LinkableVariable');

goog.require('weavejs.Weave');
goog.require('weavejs.api.core.DynamicState');
goog.require('weavejs.compiler.StandardLib');
goog.require('weavejs.core.CallbackCollection');
goog.require('weavejs.api.core.ICallbackCollection');
goog.require('weavejs.api.core.IDisposableObject');
goog.require('weavejs.api.core.ILinkableVariable');



/**
 * If a defaultValue is specified, callbacks will be triggered in a later frame unless they have already been triggered before then.
 * This behavior is desirable because it allows the initial value to be handled by the same callbacks that handles new values.
 * @asparam sessionStateType The type of values accepted for this sessioned property.
 * @asparam verifier A function that returns true or false to verify that a value is accepted as a session state or not.  The function signature should be  function(value:*):Boolean.
 * @asparam defaultValue The default value for the session state.
 * @asparam defaultValueTriggersCallbacks Set this to false if you do not want the callbacks to be triggered one frame later after setting the default value.
 * @constructor
 * @extends {weavejs.core.CallbackCollection}
 * @implements {weavejs.api.core.ILinkableVariable}
 * @implements {weavejs.api.core.ICallbackCollection}
 * @implements {weavejs.api.core.IDisposableObject}
 * @param {Object=} sessionStateType
 * @param {Function=} verifier
 * @param {*=} defaultValue
 * @param {boolean=} defaultValueTriggersCallbacks
 */
weavejs.core.LinkableVariable = function(sessionStateType, verifier, defaultValue, defaultValueTriggersCallbacks) {
  sessionStateType = typeof sessionStateType !== 'undefined' ? sessionStateType : null;
  verifier = typeof verifier !== 'undefined' ? verifier : null;
  defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : undefined;
  defaultValueTriggersCallbacks = typeof defaultValueTriggersCallbacks !== 'undefined' ? defaultValueTriggersCallbacks : true;
  weavejs.core.LinkableVariable.base(this, 'constructor');
  if (sessionStateType != Object) {
    this._sessionStateType = sessionStateType;
    this._primitiveType = this._sessionStateType == String || this._sessionStateType == Number || this._sessionStateType == Boolean;
  }
  this._verifier = verifier;
  if (defaultValue !== undefined) {
    this.setSessionState(defaultValue);
    if (defaultValueTriggersCallbacks && this.triggerCounter > weavejs.core.CallbackCollection.DEFAULT_TRIGGER_COUNT)
      weavejs.Weave.callLater(this, org.apache.flex.utils.Language.closure(this._defaultValueTrigger, this, '_defaultValueTrigger'));
  }
};
goog.inherits(weavejs.core.LinkableVariable, weavejs.core.CallbackCollection);


/**
 * @protected
 * @type {Function}
 */
weavejs.core.LinkableVariable.prototype._verifier = null;


/**
 * @protected
 * @type {boolean}
 */
weavejs.core.LinkableVariable.prototype._sessionStateWasSet = false;


/**
 * @protected
 * @type {boolean}
 */
weavejs.core.LinkableVariable.prototype._primitiveType = false;


/**
 * @protected
 * @type {Object}
 */
weavejs.core.LinkableVariable.prototype._sessionStateType = null;


/**
 * @protected
 * @type {*}
 */
weavejs.core.LinkableVariable.prototype._sessionStateInternal = undefined;


/**
 * @protected
 * @type {*}
 */
weavejs.core.LinkableVariable.prototype._sessionStateExternal = undefined;


/**
 * @protected
 * @type {boolean}
 */
weavejs.core.LinkableVariable.prototype._locked = false;


/**
 * @asprivate
 * @private
 */
weavejs.core.LinkableVariable.prototype._defaultValueTrigger = function() {
  if (!this.wasDisposed && this.triggerCounter == weavejs.core.CallbackCollection.DEFAULT_TRIGGER_COUNT + 1)
    this.triggerCallbacks();
};


/**
 * This function will verify if a given value is a valid session state for this linkable variable.
 * @asparam value The value to verify.
 * @asreturn A value of true if the value is accepted by this linkable variable.
 * @param {Object} value
 * @return {boolean}
 */
weavejs.core.LinkableVariable.prototype.verifyValue = function(value) {
  return this._verifier == null || this._verifier(value);
};


/**
 * The type restriction passed in to the constructor.
 * @export
 * @return {Object}
 */
weavejs.core.LinkableVariable.prototype.getSessionStateType = function() {
  return this._sessionStateType;
};


/**
 * @inheritDoc
 * @export
 * @return {Object}
 */
weavejs.core.LinkableVariable.prototype.getSessionState = function() {
  return this._sessionStateExternal;
};


/**
 * @inheritDoc
 * @export
 * @param {Object} value
 */
weavejs.core.LinkableVariable.prototype.setSessionState = function(value) {
  if (this._locked)
    return;
  if (this._sessionStateType != null) {
    var /** @type {Object} */ sst = this._sessionStateType;
    value = org.apache.flex.utils.Language.as(value, sst);
  }
  if (this._verifier != null && !this._verifier(value))
    return;
  var /** @type {boolean} */ wasCopied = false;
  var /** @type {string} */ type = null;
  if (value != null) {
    type = typeof(value);
    if (type == 'object' && value.constructor != Object && value.constructor != Array) {
      value = weavejs.Weave.copyObject(value);
      wasCopied = true;
    }
  }
  if (this._sessionStateWasSet && this.sessionStateEquals(value))
    return;
  if (type == 'object') {
    if (!wasCopied)
      value = weavejs.Weave.copyObject(value);
    weavejs.api.core.DynamicState.alterSessionStateToBypassDiff(value);
    this._sessionStateExternal = value;
    this._sessionStateInternal = weavejs.Weave.copyObject(value);
  } else {
    this._sessionStateExternal = this._sessionStateInternal = value;
  }
  this._sessionStateWasSet = true;
  this.triggerCallbacks();
};


/**
 * This function is used in setSessionState() to determine if the value has changed or not.
 * Classes that extend this class may override this function.
 * @protected
 * @param {*} otherSessionState
 * @return {boolean}
 */
weavejs.core.LinkableVariable.prototype.sessionStateEquals = function(otherSessionState) {
  if (this._primitiveType)
    return this._sessionStateInternal == otherSessionState;
  return weavejs.compiler.StandardLib.compare(this._sessionStateInternal, otherSessionState, org.apache.flex.utils.Language.closure(this.objectCompare, this, 'objectCompare')) == 0;
};


/**
 * @private
 * @param {Object} a
 * @param {Object} b
 * @return {number}
 */
weavejs.core.LinkableVariable.prototype.objectCompare = function(a, b) {
  if (weavejs.api.core.DynamicState.isDynamicState(a, true) && weavejs.api.core.DynamicState.isDynamicState(b, true) && a[weavejs.api.core.DynamicState.CLASS_NAME] == b[weavejs.api.core.DynamicState.CLASS_NAME] && a[weavejs.api.core.DynamicState.OBJECT_NAME] == b[weavejs.api.core.DynamicState.OBJECT_NAME]) {
    return weavejs.compiler.StandardLib.compare(a[weavejs.api.core.DynamicState.SESSION_STATE], b[weavejs.api.core.DynamicState.SESSION_STATE], org.apache.flex.utils.Language.closure(this.objectCompare, this, 'objectCompare'));
  }
  return NaN;
};


/**
 * This function may be called to detect change to a non-primitive session state in case it has been modified externally.
 * @export
 */
weavejs.core.LinkableVariable.prototype.detectChanges = function() {
  if (!this.sessionStateEquals(this._sessionStateExternal))
    this.triggerCallbacks();
};


/**
 * Call this function when you do not want to allow any more changes to the value of this sessioned property.
 * @export
 */
weavejs.core.LinkableVariable.prototype.lock = function() {
  this._locked = true;
};


/**
 * @inheritDoc
 * @export
 * @override
 */
weavejs.core.LinkableVariable.prototype.dispose = function() {
  weavejs.core.LinkableVariable.base(this, 'dispose');
  this.setSessionState(null);
};


Object.defineProperties(weavejs.core.LinkableVariable.prototype, /** @lends {weavejs.core.LinkableVariable.prototype} */ {
/** @export */
locked: {
get: /** @this {weavejs.core.LinkableVariable} */ function() {
  return this._locked;
}},
/** @export */
state: {
get: /** @this {weavejs.core.LinkableVariable} */ function() {
  return this._sessionStateExternal;
},
set: /** @this {weavejs.core.LinkableVariable} */ function(value) {
  this.setSessionState(value);
}}}
);


/**
 * Metadata
 *
 * @type {Object.<string, Array.<Object>>}
 */
weavejs.core.LinkableVariable.prototype.FLEXJS_CLASS_INFO = { names: [{ name: 'LinkableVariable', qName: 'weavejs.core.LinkableVariable'}], interfaces: [weavejs.api.core.ILinkableVariable, weavejs.api.core.ICallbackCollection, weavejs.api.core.IDisposableObject] };
