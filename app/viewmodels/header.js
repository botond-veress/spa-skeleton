define(['managers/navigationManager'],
	function (navigationManager) {

	    function activate() {
	        return true;
	    }

	    var vm = {
	        activate: activate,
	        navigationManager: navigationManager
	    };

	    return vm;
	}
);