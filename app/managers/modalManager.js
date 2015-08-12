define([],
    function () {

        var id = 0;
        var modals = ko.observableArray().extend({ list: true });

        function Modal(options) {

            options = options || {};

            var self = this;

            self.id = options.id;
            self.name = ko.observable(options.name);
            self.deferred = new $.Deferred();
            self.data = options.data || {};
            self.data.id = self.id;

            self.close = function (resolve, data) {
                return resolve
                    ? self.deferred.resolve(data)
                    : self.deferred.reject();
            };

            return self;

        }

        function open(name, options) {
            options = options || {};
            options.id = ++id;
            options.name = name;

            var modal = new Modal(options);
            modals.push(modal);
            return modal.deferred;
        }

        function close(id, resolve, data) {
            var modal = modals().find(function (current) {
                return current.id === id;
            });
            if (modal) {
                modal.close(resolve, data);
                modals.remove(modal);
                modals.valueHasMutated();
            }
        }

        var modalManager = {
            open: open,
            close: close,
            modals: modals
        };

        return modalManager;
    }
);