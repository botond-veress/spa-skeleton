define([],
    function () {

        function Route(options) {

            options = options || {};
            var self = this;

            self.route = options.route;
            self.moduleId = options.moduleId;
            self.title = options.title;
            self.nav = options.nav;
            self.hash = options.hash || null;
            self.hidden = !!options.hidden;
            self.disabled = !!options.disabled;
            self.css = options.css || null;
            self.routes = options.routes || [];

        }

        var routes = {
            login: new Route({ route: 'login', moduleId: 'viewmodels/account/login', title: 'Login', nav: true }),
            home: new Route({ route: 'home', moduleId: 'viewmodels/home', title: 'Home', nav: true }),
            another: {
                index: new Route({ route: 'another*page', moduleId: 'viewmodels/another/index', hash: '#another', title: 'Another', nav: true }),
                one: new Route({ route: ['another', 'another/one'], moduleId: 'viewmodels/another/one', title: 'Another One', nav: true }),
                two: new Route({ route: 'another/two', moduleId: 'viewmodels/another/two', title: 'Another Two', nav: true }),
                three: new Route({ route: 'another/three', moduleId: 'viewmodels/another/three', title: 'Another Three', nav: true })
            }
        };

        var anonymous = [
            routes.login
        ];

        var authorized = [
            routes.home,
            routes.another.index
        ];

        var another = [
            routes.another.one,
            routes.another.two,
            routes.another.three
        ];

        var all = anonymous.slice().concat(authorized);
        var routers = {};

        var routeManager = {
            routers: routers,
            distinct: routes,
            all: all,
            anonymous: anonymous,
            authorized: authorized,
            another: another
        };

        return routeManager;
    }
);