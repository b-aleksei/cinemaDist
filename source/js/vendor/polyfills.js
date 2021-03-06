/* eslint-disable */
export const ieFix = () => {
  // Polyfills
  //---------------------------------

  // forEach
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  // includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function (searchElement, fromIndex) {

        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        var len = o.length >>> 0;

        if (len === 0) {
          return false;
        }

        var n = fromIndex | 0;

        var k = Math.max(n >= 0 ? n : len - Math.abs(n)
          , 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        while (k < len) {
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }

        return false;
      }
    });
  }

  // matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        let matches = (this.document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        // eslint-disable-next-line no-empty
        while (--i >= 0 && matches.item(i) !== this) {
        }
        return i > -1;
      };
  }

  // closest
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      let el = this;

      do {
        if (el.matches(s)) {
          return el;
        }
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

// _mutation
// http://dom.spec.whatwg.org/#mutation-method-macro
  function _mutation(nodes) { // eslint-disable-line no-unused-vars
    if (!nodes.length) {
      throw new Error('DOM Exception 8');
    } else if (nodes.length === 1) {
      return typeof nodes[0] === 'string' ? document.createTextNode(nodes[0]) : nodes[0];
    } else {
      var
        fragment = document.createDocumentFragment(),
        length = nodes.length,
        index = -1,
        node;

      while (++index < length) {
        node = nodes[index];

        fragment.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
      }

      return fragment;
    }
  }

  // Element.prototype.before
  Document.prototype.before = Element.prototype.before = function before() {
    if (this.parentNode) {
      this.parentNode.insertBefore(_mutation(arguments), this);
    }
  };

// Element.prototype.after
  Document.prototype.after = Element.prototype.after = function after() {
    if (this.parentNode) {
      this.parentNode.insertBefore(_mutation(arguments), this.nextSibling);
    }
  };

  // Element.prototype.prepend
  Document.prototype.prepend = Element.prototype.prepend = function prepend() {
    this.insertBefore(_mutation(arguments), this.firstChild);
  };

// Element.prototype.append
  Document.prototype.append = Element.prototype.append = function append() {
    this.appendChild(_mutation(arguments));
  };

// Element.prototype.remove
  Document.prototype.remove = Element.prototype.remove = function remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };

  // Object.assign
  Object.assign = function assign(target, source) { // eslint-disable-line no-unused-vars
    for (var index = 1, key, src; index < arguments.length; ++index) {
      src = arguments[index];

      for (key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
          target[key] = src[key];
        }
      }
    }

    return target;
  };
}
