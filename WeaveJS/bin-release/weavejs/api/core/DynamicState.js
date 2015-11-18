/**
 * Generated by Apache Flex Cross-Compiler from weavejs\api\core\DynamicState.as
 * weavejs.api.core.DynamicState
 *
 * @fileoverview
 *
 * @suppress {checkTypes}
 */

goog.provide('weavejs.api.core.DynamicState');



/**
 * @constructor
 */
weavejs.api.core.DynamicState = function() {
};


/**
 * Creates an Object having three properties: objectName, className, sessionState
 * @asparam objectName The name assigned to the object when the session state is generated.
 * @asparam className The qualified class name of the original object providing the session state.
 * @asparam sessionState The session state for an object of the type specified by className.
 * @export
 * @param {string=} objectName
 * @param {string=} className
 * @param {Object=} sessionState
 * @return {Object}
 */
weavejs.api.core.DynamicState.create = function(objectName, className, sessionState) {
  objectName = typeof objectName !== 'undefined' ? objectName : null;
  className = typeof className !== 'undefined' ? className : null;
  sessionState = typeof sessionState !== 'undefined' ? sessionState : null;
  var /** @type {Object} */ obj = {};
  obj[weavejs.api.core.DynamicState.OBJECT_NAME] = objectName || null;
  obj[weavejs.api.core.DynamicState.CLASS_NAME] = className || null;
  obj[weavejs.api.core.DynamicState.SESSION_STATE] = sessionState;
  return obj;
};


/**
 * @export
 * @const
 * @type {string}
 */
weavejs.api.core.DynamicState.OBJECT_NAME = 'objectName';


/**
 * @export
 * @const
 * @type {string}
 */
weavejs.api.core.DynamicState.CLASS_NAME = 'className';


/**
 * @export
 * @const
 * @type {string}
 */
weavejs.api.core.DynamicState.SESSION_STATE = 'sessionState';


/**
 * @export
 * @const
 * @type {string}
 */
weavejs.api.core.DynamicState.BYPASS_DIFF = 'bypassDiff';


/**
 * This function can be used to detect dynamic state objects within nested, untyped session state objects.
 * This function will check if the given object has the three properties of a dynamic state object.
 * @asparam object An object to check.
 * @asparam handleBypassDiff Set this to true to allow the object to contain the optional bypassDiff property.
 * @asreturn true if the object has all three properties and no extras (except for "bypassDiff" when the handleBypassDiff parameter is set to true).
 * @export
 * @param {Object} object
 * @param {boolean=} handleBypassDiff
 * @return {boolean}
 */
weavejs.api.core.DynamicState.isDynamicState = function(object, handleBypassDiff) {
  handleBypassDiff = typeof handleBypassDiff !== 'undefined' ? handleBypassDiff : false;
  var /** @type {number} */ matchCount = 0;
  for (var /** @type {*} */ name in object) {
    if (name === weavejs.api.core.DynamicState.OBJECT_NAME || name === weavejs.api.core.DynamicState.CLASS_NAME || name === weavejs.api.core.DynamicState.SESSION_STATE)
      matchCount++;
    else if (handleBypassDiff && name === weavejs.api.core.DynamicState.BYPASS_DIFF)
      continue;
    else
      return false;
  }
  return (matchCount == 3);
};


/**
 * This function checks whether or not a session state is an Array containing at least one
 * object that looks like a DynamicState and has no other non-String items.
 * @asparam state A session state object.
 * @asparam handleBypassDiff Set this to true to allow dynamic state objects to contain the optional bypassDiff property.
 * @asreturn A value of true if the Array looks like a dynamic session state or diff.
 * @export
 * @param {*} state
 * @param {boolean=} handleBypassDiff
 * @return {boolean}
 */
weavejs.api.core.DynamicState.isDynamicStateArray = function(state, handleBypassDiff) {
  handleBypassDiff = typeof handleBypassDiff !== 'undefined' ? handleBypassDiff : false;
  var /** @type {Array} */ array = org.apache.flex.utils.Language.as(state, Array);
  if (!array)
    return false;
  var /** @type {boolean} */ result = false;
  for (var foreachiter0 in array) 
  {
  var item = array[foreachiter0];
  {
    if (typeof(item) === 'string')
      continue;
    if (weavejs.api.core.DynamicState.isDynamicState(item, handleBypassDiff))
      result = true;
    else
      return false;
  }}
  
  return result;
};


/**
 * Alters a session state object to bypass special diff logic for dynamic state arrays.
 * It does so by adding the "bypassDiff" property to any part for which isDynamicState(part) returns true.
 * @export
 * @param {Object} object
 */
weavejs.api.core.DynamicState.alterSessionStateToBypassDiff = function(object) {
  if (weavejs.api.core.DynamicState.isDynamicState(object)) {
    object[weavejs.api.core.DynamicState.BYPASS_DIFF] = true;
    object = object[weavejs.api.core.DynamicState.SESSION_STATE];
  }
  for (var /** @type {*} */ key in object)
    weavejs.api.core.DynamicState.alterSessionStateToBypassDiff(object[key]);
};


/**
 * Metadata
 *
 * @type {Object.<string, Array.<Object>>}
 */
weavejs.api.core.DynamicState.prototype.FLEXJS_CLASS_INFO = { names: [{ name: 'DynamicState', qName: 'weavejs.api.core.DynamicState'}] };
