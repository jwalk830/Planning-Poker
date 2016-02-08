"use strict";

(function () {
    angular.module('planningPoker').directive('userTile', userTileDirective);

    function userTileDirective() {
        return {
            restrict: 'E',
            templateUrl: './lib/directives/user/userTileDirective.html'
        }
    }

})();