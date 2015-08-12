define(['managers/navigationManager'],
    function (navigationManager) {

        var router = navigationManager.buildAnotherRoutes();

        function activate() {
            return true;
        }

        var vm = {
            activate: activate,
            router: router
        };

        return vm;
    }
);