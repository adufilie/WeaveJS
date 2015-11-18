/**
 * Generated by Apache Flex Cross-Compiler from weavejs\core\LinkableBoolean.as
 * weavejs.core.LinkableBoolean
 *
 * @fileoverview
 *
 * @suppress {checkTypes}
 */

goog.provide('weavejs.core.LinkableBoolean');

goog.require('weavejs.core.LinkableVariable');



/**
 * @constructor
 * @extends {weavejs.core.LinkableVariable}
 * @param {*=} defaultValue
 * @param {Function=} verifier
 * @param {boolean=} defaultValueTriggersCallbacks
 */
weavejs.core.LinkableBoolean = function(defaultValue, verifier, defaultValueTriggersCallbacks) {
  defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : undefined;
  verifier = typeof verifier !== 'undefined' ? verifier : null;
  defaultValueTriggersCallbacks = typeof defaultValueTriggersCallbacks !== 'undefined' ? defaultValueTriggersCallbacks : true;
  weavejs.core.LinkableBoolean.base(this, 'constructor', Boolean, verifier, defaultValue, defaultValueTriggersCallbacks);
};
goog.inherits(weavejs.core.LinkableBoolean, weavejs.core.LinkableVariable);


/**
 * @export
 * @override
 */
weavejs.core.LinkableBoolean.prototype.setSessionState = function(value) {
  if (org.apache.flex.utils.Language.is(value, String))
    value = (value === 'true');
  weavejs.core.LinkableBoolean.base(this, 'setSessionState', value ? true : false);
};


Object.defineProperties(weavejs.core.LinkableBoolean.prototype, /** @lends {weavejs.core.LinkableBoolean.prototype} */ {
/** @export */
value: {
get: /** @this {weavejs.core.LinkableBoolean} */ function() {
  return this._sessionStateExternal;
},
set: /** @this {weavejs.core.LinkableBoolean} */ function(value) {
  this.setSessionState(value);
}}}
);


/**
 * Metadata
 *
 * @type {Object.<string, Array.<Object>>}
 */
weavejs.core.LinkableBoolean.prototype.FLEXJS_CLASS_INFO = { names: [{ name: 'LinkableBoolean', qName: 'weavejs.core.LinkableBoolean'}] };
