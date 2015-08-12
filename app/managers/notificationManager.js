define([],
    function () {

        function Notification(options) {
            options = options || {};

            var self = this;

            self.type = ko.observable(options.type);
            self.message = ko.observable(options.message || 'Message not defined');
            self.closable = ko.observable(true);

            self.failure = ko.computed(function () {
                return self.type() == 'failure';
            });

            self.success = ko.computed(function () {
                return self.type() == 'success';
            });

            self.warning = ko.computed(function () {
                return self.type() == 'warning';
            });

            self.info = ko.computed(function () {
                return self.type() == 'info';
            });

            self.over = function () {
                self.closable(false);
            };

            self.out = function () {
                self.closable(true);
            };

            return self;
        }

        function FailureNotification(options) {
            options = options || {};
            options.type = 'failure';
            Notification.call(this, options);
        }

        function SuccessNotification(options) {
            options = options || {};
            options.type = 'success';
            Notification.call(this, options);
        }

        function WarningNotification(options) {
            options = options || {};
            options.type = 'warning';
            Notification.call(this, options);
        }

        function InfoNotification(options) {
            options = options || {};
            options.type = 'info';
            Notification.call(this, options);
        }

        var notifications = ko.observableArray([]);

        function failure(message, duration) {
            addNotification(new FailureNotification({ message: message }), duration);
        };

        function success(message, duration) {
            addNotification(new SuccessNotification({ message: message }), duration);
        };

        function warning(message, duration) {
            addNotification(new WarningNotification({ message: message }), duration);
        };

        function info(message, duration) {
            addNotification(new InfoNotification({ message: message }), duration);
        };

        function addNotification(message, duration) {
            message.close = function () {
                removeNotification(message);
            };
            message.__timeout = timeout();
            message.__subscribe = message.closable.subscribe(function (value) {
                if (!value) {
                    clearTimeout(message.__timeout);
                } else {
                    message.__timeout = timeout();
                }
            });
            notifications.push(message);

            function timeout() {
                return setTimeout(function () {
                    removeNotification(message);
                }, duration || 5000);
            }
        }

        function removeNotification(message) {
            notifications.remove(message);
            if (message.__timeout) {
                clearTimeout(message.__timeout);
                message.__timeout = null;
            }
            if (message.__subscribe) {
                message.__subscribe.dispose();
                message.__subscribe = null;
            }
        }

        var notificationManager = {
            notifications: notifications,
            failure: failure,
            success: success,
            warning: warning,
            info: info
        };

        return notificationManager;
    }
);