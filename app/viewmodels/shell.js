define(['managers/navigationManager', 'managers/notificationManager', 'managers/modalManager', 'managers/hotkeyManager', 'text!views/templates/controls.html'],
    function (navigationManager, notificationManager, modalManager, hotkeyManager) {

        function activate() {
            navigationManager.initialize();            
            return navigationManager.buildShellRoutes().activate(); //set { pushState : true } + htaccess for no-hashes
        }

        var vm = {
            activate: activate,
            navigationManager: navigationManager,
            notificationManager: notificationManager,
            modalManager: modalManager,
            hotkeyManager: hotkeyManager
        };

        return vm;
    }
);