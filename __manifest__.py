# -*- coding: utf-8 -*-
{
    "name": "POS Set Methods Polyfill (legacy WebView fix)",
    "version": "19.0.3.0.0",
    "summary": "Fixes Odoo 19 POS crashes on older Android POS terminals "
               "(e.g. Sunmi T2) missing modern JS Set methods",
    "description": """
Odoo 19's Point of Sale frontend calls ES2024 Set methods - difference, intersection,
union, symmetricDifference, isSubsetOf, isSupersetOf and isDisjointFrom - that only
exist in Chrome/WebView 122 and newer. Many Android POS terminals, including the
Sunmi T2, ship an older WebView that can never be updated, so opening a POS session
throws a JavaScript error and the register never loads.

This module polyfills the seven missing methods directly, matching native behaviour
and only stepping in when the real method is absent, so it is a safe no-op on modern
devices. It ships as a single script appended to the POS assets bundle, loading
before POS starts without touching Odoo's own module loader or any other customization.

No models, views, menus or settings are added - install it and affected POS terminals
work again.
    """,
    "category": "Point of Sale",
    "license": "LGPL-3",
    "depends": ["point_of_sale"],
    "assets": {
        # APPEND (not prepend): adding the polyfill to the end of the bundle
        # keeps the bundle's own module-loader bootstrap (odoo.define) intact.
        # The polyfill still runs synchronously at parse time, well before the
        # async POS-startup code that actually calls Set.prototype.difference.
        "point_of_sale.assets_prod": [
            ("append", "pos_set_polyfill/static/src/js/set_polyfill.js"),
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}
