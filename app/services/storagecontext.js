define([],
    function () {

        function get(name, initial) {
            var data = localStorage.getItem(name);
            return data == null ? initial : JSON.parse(data);
        }

        function set(name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        }

        function getUserData(id, name, initial) {
            return get(id + '-' + name, initial);
        }

        function setUserData(id, name, data) {
            return set(id + '-' + name, data);
        }

        var storagecontext = {
            get: get,
            set: set,
            getUserData: getUserData,
            setUserData: setUserData
        };

        return storagecontext;
    }
);