/*
 * Polyfill for ES2024 Set methods missing in WebView/Chrome below 122
 * (difference, intersection, union, symmetricDifference, isSubsetOf,
 * isSupersetOf, isDisjointFrom). Needed for Odoo 19 POS on old Android
 * devices such as the Sunmi T2 (Android 7.1.1, WebView 119).
 *
 * Plain script (NO Odoo module banner) so it runs as the bundle loads,
 * before the POS app starts. Methods are installed non-enumerable to
 * match native behaviour exactly, and are no-ops on modern browsers
 * where the native methods already exist.
 */
(function () {
    if (typeof Set === "undefined") {
        return;
    }
    var proto = Set.prototype;

    function asSet(other) {
        return other instanceof Set ? other : new Set(other);
    }

    function define(name, fn) {
        if (typeof proto[name] === "function") {
            return; // native method present, do nothing
        }
        Object.defineProperty(proto, name, {
            value: fn,
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }

    define("difference", function (other) {
        var o = asSet(other);
        var result = new Set();
        this.forEach(function (v) {
            if (!o.has(v)) result.add(v);
        });
        return result;
    });

    define("intersection", function (other) {
        var o = asSet(other);
        var result = new Set();
        this.forEach(function (v) {
            if (o.has(v)) result.add(v);
        });
        return result;
    });

    define("union", function (other) {
        var o = asSet(other);
        var result = new Set(this);
        o.forEach(function (v) {
            result.add(v);
        });
        return result;
    });

    define("symmetricDifference", function (other) {
        var o = asSet(other);
        var result = new Set(this);
        o.forEach(function (v) {
            if (result.has(v)) {
                result.delete(v);
            } else {
                result.add(v);
            }
        });
        return result;
    });

    define("isSubsetOf", function (other) {
        var o = asSet(other);
        var ok = true;
        this.forEach(function (v) {
            if (!o.has(v)) ok = false;
        });
        return ok;
    });

    define("isSupersetOf", function (other) {
        var o = asSet(other);
        var self = this;
        var ok = true;
        o.forEach(function (v) {
            if (!self.has(v)) ok = false;
        });
        return ok;
    });

    define("isDisjointFrom", function (other) {
        var o = asSet(other);
        var disjoint = true;
        this.forEach(function (v) {
            if (o.has(v)) disjoint = false;
        });
        return disjoint;
    });
})();
