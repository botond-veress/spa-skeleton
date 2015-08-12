define(['helpers/configuration'],
    function (configuration) {

        var account = {
            authenticate: function (model) {
                return dummy({});
            },
            signout: function (model) {
                return dummy({});
            }
        };

        function dummy(data, reject, timeout) {
            var defer = new $.Deferred();

            setTimeout(function () {
                if (!reject) {
                    defer.resolve(data);
                } else {
                    defer.reject(data);
                }
            }, timeout || 200);

            return defer;
        }

        var datacontext = {
            account: account,
            setToken: setToken
        };

        return datacontext;

        var token = null;

        function setToken(t) {
            token = t;
        }

        function get(url, model) {
            return call(url, 'GET', model);
        }

        function post(url, model) {
            return call(url, 'POST', model);
        }

        function call(url, type, model) {
            if (token) {
                model = model || {};
                model.token = token;
            }

            return $.ajax({
                type: type,
                url: configuration.api.url + url,
                data: model,
                dataType: 'json',
                crossDomain: true
            });
        }
    }
);