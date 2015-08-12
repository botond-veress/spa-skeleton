define(['plugins/router', 'managers/routeManager', 'services/datacontext', 'models/account/tokenAccount'],
    function (router, routeManager, datacontext, tokenAccount) {

        var claim = ko.observable(null).extend({ serializable: true });
        claim.isAuthorized = ko.computed(function () {
            var claim = this();
            var isAuthorized = !!claim && !!claim.token();
            datacontext.setToken(isAuthorized ? claim.token() : null);
            return isAuthorized;
        }, claim);
        claim.isAuthorized.subscribe(buildShellRoutes);

        var navigationManager = {
            routeManager: routeManager,
            router: router,
            claim: claim,
            buildShellRoutes: buildShellRoutes,
            buildAnotherRoutes: buildAnotherRoutes,

            initialize: initialize,
            authenticate: authenticate,
            signout: signout
        };

        return navigationManager;

        //#region authentication

        function initialize() {
            var data = load();
            claim(new tokenAccount(data));
        }

        function authenticate(model, remember, url) {
            return datacontext.account.authenticate(model)
            .then(function (data) {
                data.remember = remember;
                claim(new tokenAccount(data));
                if (claim().remember()) {
                    save(claim.serialize());
                }
                router.navigate(routeExists(routeManager.authorized, url) ? url : routeManager.authorized[0].hash);
            });
        }

        function signout() {
            return datacontext.account.signout()
            .then(function () {
                if (!!claim()) {
                    claim().token(null);
                    router.navigate(routeManager.anonymous[0].hash);
                    if (!claim().remember()) {
                        claim(null);
                    }
                    save(claim.serialize());
                }
            });
        }

        //#endregion

        //#region storage

        function load() {
            return JSON.parse(localStorage.getItem('login')) || null;
        }

        function save(data) {
            if (data) {
                localStorage.setItem('login', JSON.stringify(data));
            } else {
                localStorage.removeItem('login');
            }
        }

        //#endregion

        //#region build routes

        function buildShellRoutes() {
            setRouteVisibility(routeManager.anonymous, !claim.isAuthorized());
            setRouteVisibility(routeManager.authorized, claim.isAuthorized());
            return buildRoutes(router, routeManager.all, claim.isAuthorized() ? routeManager.authorized[0].hash : routeManager.anonymous[0].hash);
        }

        function buildAnotherRoutes() {
            routeManager.routers.another = routeManager.routers.another || router.createChildRouter();
            return buildRoutes(routeManager.routers.another, routeManager.another, routeManager.another[0].hash);
        }

        function buildRoutes(router, mappings, initial) {
            router.reset();

            router.guardRoute = function (routeInfo, params) {
                console.log(routeInfo, params);
                return true;
                var guard = true;

                if (routeExists(routeManager.all, params.fragment, true)) {
                    //the route is defined
                    if (claim.isAuthorized()) {
                        //the claim is authorized
                        if (routeExists(routeManager.anonymous, params.fragment, true) || !routeExists(mappings, params.fragment)) {
                            //but the content is anonymous => redirect to the current default route
                            guard = initial || mappings[0].hash;
                        }
                    } else if (!routeExists(mappings, params.fragment)) {
                        //the claim is not authorized to access the route => redirect to login
                        guard = routeManager.distinct.login.hash + '?url=' + params.fragment;
                    }
                } else {
                    //the does not exist => redirect to the current default route
                    guard = initial || mappings[0].hash;
                }

                return guard;
            };

            console.log('mappings:', mappings.map(function (m) { return m.hash; }));

            router
                .map(resetRoutes(mappings))
                .mapUnknownRoutes(function (instruction) {
                    console.error('Unknown route: ', instruction);
                })
                .buildNavigationModel();

            router.visibleNavigationModel = router.visibleNavigationModel || ko.computed(function () {
                return router.navigationModel().filter(function (current) {
                    return !current.hidden;
                });
            });

            return router;
        }

        //#endregion

        //#region internal

        function routeExists(array, route, ignoreVisibility) {
            for (var index = 0; index < array.length; ++index) {
                if (array[index].routePattern && (ignoreVisibility || array[index].nav)) {
                    var pattern = new RegExp(array[index].routePattern);
                    if (pattern.test(route)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function setRouteVisibility(routes, visibility) {
            routes.forEach(function (current) {
                current.nav = visibility;
            });
        }

        function resetRoutes(routes) {
            return routes;
        }

        //#endregion
    });