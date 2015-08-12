define([],
    function () {

        var keys = {
            //special
            backspace: 8,
            tab: 9,
            enter: 13,
            shift: 16,
            ctrl: 17,
            alt: 18,
            caps: 20,
            esc: 27,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            insert: 45,
            del: 46,
            home: 36,
            pageup: 33,
            pagedown: 34,

            //function
            f1: 112,
            f2: 113,
            f3: 114,
            f4: 115,
            f5: 116,
            f6: 117,
            f7: 118,
            f8: 119,
            f9: 120,
            f10: 121,
            f11: 122,
            f12: 123,

            //numbers
            0: 48,
            1: 49,
            2: 50,
            3: 51,
            4: 52,
            5: 53,
            6: 54,
            7: 55,
            8: 56,
            9: 57,

            //letters
            a: 65,
            b: 66,
            c: 67,
            d: 68,
            e: 69,
            f: 70,
            g: 71,
            h: 72,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            m: 77,
            n: 78,
            o: 79,
            p: 80,
            q: 81,
            r: 82,
            s: 83,
            t: 84,
            u: 85,
            v: 86,
            w: 87,
            x: 88,
            y: 89,
            z: 90
        };

        function shortcut(options) {

            options = options || {};

            var self = this;

            self.keys = options.keys || [];
            self.callbacks = options.callbacks || [];

        }

        var id = 0;
        var shortcuts = [];
        var pressed = [];

        function ceateContext() {
            return ++id;
        }

        function register(keys, callback, context) {
            keys = normalizeKeys(keys);
            callback = createCallback(callback, context);
            var s = findShortcut(keys);
            if (!s) {
                shortcuts.push(new shortcut({
                    keys: keys,
                    callbacks: [callback]
                }));
            } else {
                s.callbacks.push(callback);
            }
            return callback.id;
        };

        function unregister(id) {
            return shortcuts.some(function (shortcut, index) {
                return shortcut.callbacks.some(function (callback, i) {
                    var exists = callback.id === id;
                    if (exists) {
                        shortcut.callbacks.splice(i, 1);
                        if (shortcut.callbacks.length === 0) {
                            shortcuts.splice(index, 1)
                        }
                    }
                    return exists;
                });
            });
        }

        function deleteContext(context) {
            for (var index = 0; index < shortcuts.length; ++index) {
                for (var i = 0; i < shortcuts[index].callbacks.length; ++i) {
                    if (shortcuts[index].callbacks[i].context === context) {
                        shortcuts[index].callbacks.splice(i, 1);
                        --i;
                    }
                }
                if (shortcuts[index].callbacks.length === 0) {
                    shortcuts.splice(index, 1)
                    --index;
                }
            }
        }

        function createCallback(callback, context) {
            return {
                id: ++id,
                callback: callback,
                context: context
            }
        }

        function findShortcut(keys) {
            return shortcuts.find(function (current) {
                return current.keys.length === keys.length && current.keys.filter(function (key) {
                    return keys.indexOf(key) < 0;
                }).length === 0;
            });
        }

        function normalizeKeys(keys) {
            //remove duplicates
            return keys.filter(function (current, index) {
                return !keys.some(function (key, i) {
                    return index > i && current === key;
                });
            });
        }

        function handler(key, press) {
            var index = pressed.indexOf(key);
            if (press) {
                if (index >= 0) {
                    pressed.splice(index, 1);
                }
                pressed.push(key);

                var s = findShortcut(pressed);
                if (s) {
                    s.callbacks.forEach(function (current) {
                        current.callback();
                    });
                }
                return !!s;
            } else if (index >= 0) {
                pressed.splice(index, 1);
            }
        }

        var hotkeyManager = {
            keys: keys,
            createContext: ceateContext,
            deleteContext: deleteContext,
            register: register,
            unregister: unregister,
            handler: handler
        };

        return hotkeyManager;
    }
);