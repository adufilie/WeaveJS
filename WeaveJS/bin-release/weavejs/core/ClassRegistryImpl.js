/**
 * Generated by Apache Flex Cross-Compiler from weavejs\core\ClassRegistryImpl.as
 * weavejs.core.ClassRegistryImpl
 *
 * @fileoverview
 *
 * @suppress {checkTypes}
 */

goog.provide('weavejs.core.ClassRegistryImpl');

goog.require('weavejs.Weave');
goog.require('weavejs.utils.Utils');
goog.require('weavejs.api.core.IClassRegistry');



/**
 * @constructor
 * @implements {weavejs.api.core.IClassRegistry}
 */
weavejs.core.ClassRegistryImpl = function() {
  this.singletonInstances = new weavejs.utils.Utils.Map();
  this.singletonImplementations = new weavejs.utils.Utils.Map();
  this.implementations = new weavejs.utils.Utils.Map();
  this.displayNames = new weavejs.utils.Utils.Map();
};


/**
 * @export
 * @type {Object}
 */
weavejs.core.ClassRegistryImpl.prototype.singletonInstances;


/**
 * @export
 * @type {Object}
 */
weavejs.core.ClassRegistryImpl.prototype.singletonImplementations;


/**
 * @export
 * @type {Object}
 */
weavejs.core.ClassRegistryImpl.prototype.implementations;


/**
 * @export
 * @type {Object}
 */
weavejs.core.ClassRegistryImpl.prototype.displayNames;


/**
 * This registers an implementation for a singleton interface.
 * @asparam theInterface The interface to register.
 * @asparam theImplementation The implementation to register.
 * @asreturn A value of true if the implementation was successfully registered.
 * @export
 * @param {Object} theInterface
 * @param {Object} theImplementation
 * @return {boolean}
 */
weavejs.core.ClassRegistryImpl.prototype.registerSingletonImplementation = function(theInterface, theImplementation) {
  if (!this.singletonImplementations.get(theInterface)) {
    weavejs.core.ClassRegistryImpl.verifyImplementation(theInterface, theImplementation);
    this.singletonImplementations.set(theInterface, theImplementation);
  }
  return this.singletonImplementations.get(theInterface) == theImplementation;
};


/**
 * Gets the registered implementation of an interface.
 * @asreturn The registered implementation Class for the given interface Class.
 * @export
 * @param {Object} theInterface
 * @return {Object}
 */
weavejs.core.ClassRegistryImpl.prototype.getSingletonImplementation = function(theInterface) {
  return this.singletonImplementations.get(theInterface);
};


/**
 * This function returns the singleton instance for a registered interface.
 *
 * This method should not be called at static initialization time,
 * because the implementation may not have been registered yet.
 * 
 * @asparam singletonInterface An interface to a singleton class.
 * @asreturn The singleton instance that implements the specified interface.
 * @export
 * @param {Object} theInterface
 * @return {*}
 */
weavejs.core.ClassRegistryImpl.prototype.getSingletonInstance = function(theInterface) {
  if (!this.singletonInstances.get(theInterface)) {
    var /** @type {Object} */ classDef = this.getSingletonImplementation(theInterface);
    if (classDef)
      this.singletonInstances.set(theInterface, new classDef());
  }
  return this.singletonInstances.get(theInterface);
};


/**
 * This will register an implementation of an interface.
 * @asparam theInterface The interface class.
 * @asparam theImplementation An implementation of the interface.
 * @asparam displayName An optional display name for the implementation.
 * @export
 * @param {Object} theInterface
 * @param {Object} theImplementation
 * @param {string=} displayName
 */
weavejs.core.ClassRegistryImpl.prototype.registerImplementation = function(theInterface, theImplementation, displayName) {
  displayName = typeof displayName !== 'undefined' ? displayName : null;
  weavejs.core.ClassRegistryImpl.verifyImplementation(theInterface, theImplementation);
  var /** @type {Array} */ array = this.implementations.get(theInterface);
  if (!array)
    this.implementations.set(theInterface, array = []);
  if (displayName || !this.displayNames.get(theImplementation))
    this.displayNames.set(theImplementation, displayName || weavejs.Weave.className(theImplementation).split(':').pop());
  if (array.indexOf(theImplementation) < 0) {
    array.push(theImplementation);
    array.sort(org.apache.flex.utils.Language.closure(this._sortImplementations, this, '_sortImplementations'));
  }
};


/**
 * This will get an Array of class definitions that were previously registered as implementations of the specified interface.
 * @asparam theInterface The interface class.
 * @asreturn An Array of class definitions that were previously registered as implementations of the specified interface.
 * @export
 * @param {Object} theInterface
 * @return {Array}
 */
weavejs.core.ClassRegistryImpl.prototype.getImplementations = function(theInterface) {
  var /** @type {Array} */ array = this.implementations.get(theInterface);
  return array ? array.concat() : [];
};


/**
 * This will get the displayName that was specified when an implementation was registered with registerImplementation().
 * @asparam theImplementation An implementation that was registered with registerImplementation().
 * @asreturn The display name for the implementation.
 * @export
 * @param {Object} theImplementation
 * @return {string}
 */
weavejs.core.ClassRegistryImpl.prototype.getDisplayName = function(theImplementation) {
  var /** @type {string} */ str = this.displayNames.get(theImplementation);
  return str;
};


/**
 * @asprivate
 * sort by displayName
 * @private
 * @param {Object} impl1
 * @param {Object} impl2
 * @return {number}
 */
weavejs.core.ClassRegistryImpl.prototype._sortImplementations = function(impl1, impl2) {
  var /** @type {string} */ name1 = this.displayNames.get(impl1);
  var /** @type {string} */ name2 = this.displayNames.get(impl2);
  if (name1 < name2)
    return -1;
  if (name1 > name2)
    return 1;
  return 0;
};


/**
 * Verifies that a Class implements an interface.
 * @export
 * @param {Object} theInterface
 * @param {Object} theImplementation
 */
weavejs.core.ClassRegistryImpl.verifyImplementation = function(theInterface, theImplementation) {
  if (org.apache.flex.utils.Language.is(!theImplementation.prototype, theInterface))
    throw new Error(weavejs.Weave.className(theImplementation) + ' does not implement ' + weavejs.Weave.className(theInterface));
};


/**
 * Metadata
 *
 * @type {Object.<string, Array.<Object>>}
 */
weavejs.core.ClassRegistryImpl.prototype.FLEXJS_CLASS_INFO = { names: [{ name: 'ClassRegistryImpl', qName: 'weavejs.core.ClassRegistryImpl'}], interfaces: [weavejs.api.core.IClassRegistry] };
