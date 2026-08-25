/**
 * @file Shared unique-id generator for every dropdown element.
 *
 * A single module-level counter is deliberate: two independent counters
 * (one in dropdown-component, one in dropdown-trigger) both minted
 * `dropdown-trigger-N` ids and collided at runtime, which silently
 * pointed `aria-labelledby` at the wrong element.
 */

let counter = 0;

/**
 * Returns the root node that owns id lookups for an element, when there
 * is one (Document, ShadowRoot and DocumentFragment all expose
 * getElementById; a detached element chain does not).
 * @param {Element} element - element to resolve the id scope for
 * @returns {Document | ShadowRoot | DocumentFragment | null}
 */
function getIdScope(element) {
	const root = element.getRootNode();
	return typeof root?.getElementById === 'function' ? root : null;
}

/**
 * Generates the next id for a prefix that is unused within a scope.
 * @param {string} prefix - id prefix, e.g. 'dropdown-panel'
 * @param {Document | ShadowRoot | DocumentFragment | null} [scope] - root to check against
 * @returns {string} an unused id
 */
export function nextId(prefix, scope = null) {
	let id = `${prefix}-${++counter}`;
	while (scope && scope.getElementById(id)) {
		id = `${prefix}-${++counter}`;
	}
	return id;
}

/**
 * Ensures an element carries an id that is unique inside its root.
 *
 * The id is re-minted when it is missing OR already claimed by a
 * different element — that second case is what stops a
 * `cloneNode(true)` copy of a connected dropdown from inheriting the
 * original's ids and breaking aria-controls / aria-labelledby.
 * @param {Element} element - element to assign an id to
 * @param {string} prefix - id prefix, e.g. 'dropdown-trigger'
 * @returns {string} the element's id
 */
export function ensureId(element, prefix) {
	const scope = getIdScope(element);
	const currentId = element.getAttribute('id');
	const isUnique =
		currentId &&
		(!scope || scope.getElementById(currentId) === element);

	if (!isUnique) element.id = nextId(prefix, scope);

	return element.id;
}
