"use strict";

(function () {
    angular.module('planningPoker').controller('RoomController', ['$scope', '$routeParams', 'roomService', 'socket', RoomController]);

    function RoomController($scope, $routeParams, roomService, socket) {

        this.roomId = $routeParams.roomId;

        $scope.roomId = this.roomId;

        $scope.allVoted = false;

        // Fire and forget, we will catch it via sockets to stay consistent
        $scope.resetVotes = function() {
            roomService.resetVotes(this.roomId);
            $scope.allVoted = false;

        }

        // On initial load, get the user list for the room
        roomService.getRoomById(this.roomId).then(function (room) {
            $scope.users = room;
        });

        socket.on('ROOM:DidResetVotes', function(data) {
            if(this.roomId == data.id) {
                $scope.users = data.users;
                $scope.allVoted = false;
            }
        }.bind(this));
        // If a user comes in when a room is already created, update the user list
        socket.on('ROOM:DidAddUserToRoomById', function (options) {
            if (this.isRoom(options.id)) {
                $scope.users = options.users;
            }
        }.bind(this));

        socket.on('USER:DidVoteByRoomId', function (data) {

            if (data.id == this.roomId) {
                $scope.users = data.users;

                // Have all of the users voted?
                $scope.allVoted = (data.allVoted) ? true : false;

            }

        }.bind(this));

        socket.on('ROOM:UserDidLeave', function (options) {

            if (this.isRoom(options.id)) {

                $scope.users = options.users;
            }
        }.bind(this));

    }

    RoomController.prototype.isRoom = function (roomId) {
        return (roomId == this.roomId) ? true : false;
    }

})();