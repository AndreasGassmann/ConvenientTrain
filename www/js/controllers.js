angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope, $state, $ionicModal, $ionicHistory, $ionicLoading, $ionicPopup, $stateParams, $cordovaDatePicker, Route, SearchRoute, Passengers, Tickets) {

        $scope.searchRoute = SearchRoute.data;
        $scope.routes = Route.data;
        $scope.tickets = Tickets.data;
        $scope.passengers = Passengers.data;

        var now = new Date()

        $scope.myDate = "0" + now.getDay() + ".0" + (now.getMonth()+1) + "." + now.getFullYear();
        if (now.getUTCHours().toString().length == 1) {
            $scope.myTime = "0" + now.getUTCHours();
        } else {
            $scope.myTime = now.getUTCHours();
        }

        if (now.getUTCMinutes().toString().length == 1) {
            $scope.myTime = $scope.myTime + ":" + "0" + now.getUTCMinutes();
        } else {
            $scope.myTime = $scope.myTime + ":" + now.getUTCMinutes();
        }


        $scope.ticketForMe = false;

        $scope.deleteMyTicket = function() {
            $scope.ticketForMe = false;
        }

        if($stateParams.routeId && $scope.routes.response.connections) {
            $scope.currentRoute = $scope.routes.response.connections[$stateParams.routeId];
        }
/*
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };

        document.addEventListener("deviceready", function () {
            console.log("test");
            $cordovaDatePicker.show(options).then(function(date){
                alert(date);
            });

        }, false);
        */
        $scope.getRouteType = function(id) {
            if (id === 1) {
                return "Schnellste Route";
            } else if (id === 2) {
                return "Rundreise";
            } else if (id === 3) {
                return "Wärmste Route";
            }
        }

        $scope.settings = {
            useTestData: true,
            isLoggedIn: false
        };

        $scope.options = {
            enableTrain : true,
            enableBus : true,
            enableShip : true
        };

        $scope.activeButton = function(number) {
            $scope.searchRoute.data.activeButton = number;
        };

        $scope.oppositeDirection = function(from, to) {
            $scope.searchRoute.data.from = to;
            $scope.searchRoute.data.to = from;
        };

        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Fehler',
                template: 'Bitte geben Sie einen Start- und Endbahnhof ein.',
                buttons: [{
                    text: 'OK',
                    type: 'button-positive'
                }]
            });
            alertPopup.then(function(res) {});
        };

        $scope.ticketSuccess = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Vielen Dank!',
                template: 'Ihr Ticket wurde erfolgreich gekauft.',
                buttons: [{
                    text: 'OK',
                    type: 'button-positive'
                }]
            });
            alertPopup.then(function(res) {});
        };

        $scope.getRoute = function() {
            if ($scope.searchRoute.data.from.length > 0 && ($scope.searchRoute.data.to.length > 0 || $scope.searchRoute.data.activeButton == 2)) {

                $ionicLoading.show({
                    template: 'Loading...'
                });

                Route.search($scope.searchRoute.data.useTestData, $scope.searchRoute.data.from, $scope.searchRoute.data.to, function (err) {
                    $ionicLoading.hide();
                    if (!err) {
                        $state.go('tab.dash-results');
                    }
                });
            } else {
                $scope.showAlert();
            }
        }

        $scope.buyTicket = function(from, to) {
            Tickets.addTicket(from, to);
            Passengers.clear();
            $scope.closeBuyTicket();
            $scope.ticketSuccess();
            $state.go('tab.chats');
            $ionicHistory.clearHistory();
        }

        $scope.addMyTicket = function() {
            $scope.closeAddSelf();
            $scope.ticketForMe = true;
        }

        $scope.addPassenger = function(name) {
            if (name) {
                Passengers.addPassenger(name);
                $scope.closeAddFriend();
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Fehler!',
                    template: 'Bitte geben sie einen Namen ein!',
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });
            }
        }

        $scope.deletePassenger = function(passenger) {
            //$scioe.passengers
        }

        // Modal BuyTicket
        $ionicModal.fromTemplateUrl('templates/buyTicket.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.buyTicketModal = modal;
        });
        $scope.showBuyTicket = function() {
            $scope.buyTicketModal.show();
        };
        $scope.closeBuyTicket = function() {
            $scope.buyTicketModal.hide();
        };

        // Modal Login
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.loginModal = modal;
        });
        $scope.showLogin = function() {
            if ($scope.settings.isLoggedIn) {
                $scope.settings.isLoggedIn = false;
            } else {
                $scope.loginModal.show();
            }
        };
        $scope.closeLogin = function() {
            $scope.loginModal.hide();
        };

        $scope.doLogin = function() {
            $scope.closeLogin();
            $scope.settings.isLoggedIn = true;
            var alertPopup = $ionicPopup.alert({
                title: 'Eingeloggt',
                template: 'Sie sind nun eingeloggt!',
                buttons: [{
                    text: 'OK',
                    type: 'button-positive'
                }]
            });
        }

        // Modal Login
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.registerModal = modal;
        });
        $scope.showRegister = function() {
            $scope.registerModal.show();
        };
        $scope.closeRegister = function() {
            $scope.registerModal.hide();
        };

        $scope.doRegister = function() {
            $scope.closeRegister();
            $scope.doLogin();
        }

        // Modal AddFriend
        $ionicModal.fromTemplateUrl('templates/addFriend.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addFriendModal = modal;
        });
        $scope.showAddFriend = function() {
            $scope.addFriendModal.show();
        };
        $scope.closeAddFriend = function() {
            $scope.addFriendModal.hide();
        };

        // Modal AddSelf
        $ionicModal.fromTemplateUrl('templates/addSelf.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addSelfModal = modal;
        });
        $scope.showAddSelf = function() {
            $scope.addSelfModal.show();
        };
        $scope.closeAddSelf = function() {
            $scope.addSelfModal.hide();
        };

        if ($stateParams.ticketId) {
            $scope.currentTicket = $scope.tickets.data[$stateParams.ticketId];
        }
    })

    .controller('ChatsCtrl', function($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        }
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .factory('Route', function($http) {
        var routes = {};
        routes.response = {};
        return {
            data: routes,
            search: function(testdata, from, to, callback) {
                if (testdata) {
                    routes.response = {"connections":[{"from":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-10T23:52:00+0200","departureTimestamp":1431294720,"delay":3,"platform":"3","prognosis":{"platform":"3","arrival":null,"departure":"2015-05-10T23:55:00+0200","capacity1st":null,"capacity2nd":null},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"to":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T00:47:00+0200","arrivalTimestamp":1431298020,"departure":null,"departureTimestamp":null,"delay":null,"platform":"15","prognosis":{"platform":"15","arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}},"duration":"00d00:55:00","transfers":0,"service":{"regular":"daily","irregular":"not 31. May until 4. Jun 2015, 16. until 20. Aug 2015, 23. until 26. Nov 2015"},"products":["IR"],"capacity1st":1,"capacity2nd":1,"sections":[{"journey":{"name":"IR 1992","category":"IR","categoryCode":2,"number":"1992","operator":"SBB","to":"Basel SBB","passList":[{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":"2015-05-10T23:51:00+0200","arrivalTimestamp":1431294660,"departure":"2015-05-10T23:52:00+0200","departureTimestamp":1431294720,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":"2015-05-11T00:00:00+0200","arrivalTimestamp":1431295200,"departure":"2015-05-11T00:02:00+0200","departureTimestamp":1431295320,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}},{"station":{"id":"008500305","name":"Frick","score":null,"coordinate":{"type":"WGS84","x":47.507343,"y":8.013074},"distance":null},"arrival":"2015-05-11T00:17:00+0200","arrivalTimestamp":1431296220,"departure":"2015-05-11T00:18:00+0200","departureTimestamp":1431296280,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500305","name":"Frick","score":null,"coordinate":{"type":"WGS84","x":47.507343,"y":8.013074},"distance":null}},{"station":{"id":"008500320","name":"Stein-S\u00e4ckingen","score":null,"coordinate":{"type":"WGS84","x":47.541601,"y":7.948819},"distance":null},"arrival":"2015-05-11T00:24:00+0200","arrivalTimestamp":1431296640,"departure":"2015-05-11T00:25:00+0200","departureTimestamp":1431296700,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500320","name":"Stein-S\u00e4ckingen","score":null,"coordinate":{"type":"WGS84","x":47.541601,"y":7.948819},"distance":null}},{"station":{"id":"008500301","name":"Rheinfelden","score":null,"coordinate":{"type":"WGS84","x":47.55121,"y":7.792155},"distance":null},"arrival":"2015-05-11T00:33:00+0200","arrivalTimestamp":1431297180,"departure":"2015-05-11T00:34:00+0200","departureTimestamp":1431297240,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500301","name":"Rheinfelden","score":null,"coordinate":{"type":"WGS84","x":47.55121,"y":7.792155},"distance":null}},{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T00:47:00+0200","arrivalTimestamp":1431298020,"departure":null,"departureTimestamp":null,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}],"capacity1st":1,"capacity2nd":1},"walk":null,"departure":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-10T23:52:00+0200","departureTimestamp":1431294720,"delay":3,"platform":"3","prognosis":{"platform":"3","arrival":null,"departure":"2015-05-10T23:55:00+0200","capacity1st":null,"capacity2nd":null},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"arrival":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T00:47:00+0200","arrivalTimestamp":1431298020,"departure":null,"departureTimestamp":null,"delay":null,"platform":"15","prognosis":{"platform":"15","arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}}]},{"from":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:04:00+0200","departureTimestamp":1431313440,"delay":null,"platform":"2","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"to":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:10:00+0200","arrivalTimestamp":1431317400,"departure":null,"departureTimestamp":null,"delay":null,"platform":"9","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}},"duration":"00d01:06:00","transfers":1,"service":{"regular":"Mo - Fr","irregular":"not 14., 25. May"},"products":["S"],"capacity1st":1,"capacity2nd":2,"sections":[{"journey":{"name":"S 23 8416","category":"S","categoryCode":5,"number":"8416","operator":"SBB","to":"Langenthal","passList":[{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:04:00+0200","departureTimestamp":1431313440,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},{"station":{"id":"008503503","name":"Turgi","score":null,"coordinate":{"type":"WGS84","x":47.491755,"y":8.253436},"distance":null},"arrival":"2015-05-11T05:08:00+0200","arrivalTimestamp":1431313680,"departure":"2015-05-11T05:09:00+0200","departureTimestamp":1431313740,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503503","name":"Turgi","score":null,"coordinate":{"type":"WGS84","x":47.491755,"y":8.253436},"distance":null}},{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":"2015-05-11T05:13:00+0200","arrivalTimestamp":1431313980,"departure":"2015-05-11T05:15:00+0200","departureTimestamp":1431314100,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}}],"capacity1st":1,"capacity2nd":1},"walk":null,"departure":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:04:00+0200","departureTimestamp":1431313440,"delay":null,"platform":"2","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"arrival":{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":"2015-05-11T05:13:00+0200","arrivalTimestamp":1431313980,"departure":null,"departureTimestamp":null,"delay":null,"platform":"5","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}}},{"journey":{"name":"S 1 17118","category":"S","categoryCode":5,"number":"17118","operator":"SBB","to":"Basel SBB","passList":[{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:20:00+0200","departureTimestamp":1431314400,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}},{"station":{"id":"008500305","name":"Frick","score":null,"coordinate":{"type":"WGS84","x":47.507343,"y":8.013074},"distance":null},"arrival":"2015-05-11T05:34:00+0200","arrivalTimestamp":1431315240,"departure":"2015-05-11T05:34:00+0200","departureTimestamp":1431315240,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500305","name":"Frick","score":null,"coordinate":{"type":"WGS84","x":47.507343,"y":8.013074},"distance":null}},{"station":{"id":"008500304","name":"Eiken","score":null,"coordinate":{"type":"WGS84","x":47.533034,"y":7.989774},"distance":null},"arrival":"2015-05-11T05:37:00+0200","arrivalTimestamp":1431315420,"departure":"2015-05-11T05:37:00+0200","departureTimestamp":1431315420,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500304","name":"Eiken","score":null,"coordinate":{"type":"WGS84","x":47.533034,"y":7.989774},"distance":null}},{"station":{"id":"008500320","name":"Stein-S\u00e4ckingen","score":null,"coordinate":{"type":"WGS84","x":47.541601,"y":7.948819},"distance":null},"arrival":"2015-05-11T05:41:00+0200","arrivalTimestamp":1431315660,"departure":"2015-05-11T05:41:00+0200","departureTimestamp":1431315660,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500320","name":"Stein-S\u00e4ckingen","score":null,"coordinate":{"type":"WGS84","x":47.541601,"y":7.948819},"distance":null}},{"station":{"id":"008500303","name":"Mumpf","score":null,"coordinate":{"type":"WGS84","x":47.547614,"y":7.909608},"distance":null},"arrival":"2015-05-11T05:43:00+0200","arrivalTimestamp":1431315780,"departure":"2015-05-11T05:44:00+0200","departureTimestamp":1431315840,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500303","name":"Mumpf","score":null,"coordinate":{"type":"WGS84","x":47.547614,"y":7.909608},"distance":null}},{"station":{"id":"008500302","name":"M\u00f6hlin","score":null,"coordinate":{"type":"WGS84","x":47.561853,"y":7.833856},"distance":null},"arrival":"2015-05-11T05:49:00+0200","arrivalTimestamp":1431316140,"departure":"2015-05-11T05:49:00+0200","departureTimestamp":1431316140,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500302","name":"M\u00f6hlin","score":null,"coordinate":{"type":"WGS84","x":47.561853,"y":7.833856},"distance":null}},{"station":{"id":"008500301","name":"Rheinfelden","score":null,"coordinate":{"type":"WGS84","x":47.55121,"y":7.792155},"distance":null},"arrival":"2015-05-11T05:52:00+0200","arrivalTimestamp":1431316320,"departure":"2015-05-11T05:52:00+0200","departureTimestamp":1431316320,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008500301","name":"Rheinfelden","score":null,"coordinate":{"type":"WGS84","x":47.55121,"y":7.792155},"distance":null}},{"station":{"id":"008500313","name":"Rheinfelden Augarten","score":null,"coordinate":{"type":"WGS84","x":47.54587,"y":7.768019},"distance":null},"arrival":"2015-05-11T05:54:00+0200","arrivalTimestamp":1431316440,"departure":"2015-05-11T05:54:00+0200","departureTimestamp":1431316440,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008500313","name":"Rheinfelden Augarten","score":null,"coordinate":{"type":"WGS84","x":47.54587,"y":7.768019},"distance":null}},{"station":{"id":"008500300","name":"Kaiseraugst","score":null,"coordinate":{"type":"WGS84","x":47.53849,"y":7.724116},"distance":null},"arrival":"2015-05-11T05:56:00+0200","arrivalTimestamp":1431316560,"departure":"2015-05-11T05:56:00+0200","departureTimestamp":1431316560,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008500300","name":"Kaiseraugst","score":null,"coordinate":{"type":"WGS84","x":47.53849,"y":7.724116},"distance":null}},{"station":{"id":"008517131","name":"Pratteln Salina Raurica","score":null,"coordinate":{"type":"WGS84","x":47.530571,"y":7.709868},"distance":null},"arrival":"2015-05-11T05:58:00+0200","arrivalTimestamp":1431316680,"departure":"2015-05-11T05:58:00+0200","departureTimestamp":1431316680,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008517131","name":"Pratteln Salina Raurica","score":null,"coordinate":{"type":"WGS84","x":47.530571,"y":7.709868},"distance":null}},{"station":{"id":"008500021","name":"Pratteln","score":null,"coordinate":{"type":"WGS84","x":47.52266,"y":7.690802},"distance":null},"arrival":"2015-05-11T06:01:00+0200","arrivalTimestamp":1431316860,"departure":"2015-05-11T06:01:00+0200","departureTimestamp":1431316860,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008500021","name":"Pratteln","score":null,"coordinate":{"type":"WGS84","x":47.52266,"y":7.690802},"distance":null}},{"station":{"id":"008500020","name":"Muttenz","score":null,"coordinate":{"type":"WGS84","x":47.533582,"y":7.647878},"distance":null},"arrival":"2015-05-11T06:04:00+0200","arrivalTimestamp":1431317040,"departure":"2015-05-11T06:04:00+0200","departureTimestamp":1431317040,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008500020","name":"Muttenz","score":null,"coordinate":{"type":"WGS84","x":47.533582,"y":7.647878},"distance":null}},{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:10:00+0200","arrivalTimestamp":1431317400,"departure":null,"departureTimestamp":null,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}],"capacity1st":1,"capacity2nd":2},"walk":null,"departure":{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:20:00+0200","departureTimestamp":1431314400,"delay":null,"platform":"2","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}},"arrival":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:10:00+0200","arrivalTimestamp":1431317400,"departure":null,"departureTimestamp":null,"delay":null,"platform":"9","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}}]},{"from":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:15:00+0200","departureTimestamp":1431314100,"delay":null,"platform":"3","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"to":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:44:00+0200","arrivalTimestamp":1431319440,"departure":null,"departureTimestamp":null,"delay":null,"platform":"6","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}},"duration":"00d01:29:00","transfers":3,"service":{"regular":"Mo - Fr","irregular":"not 14., 25. May"},"products":["S","IC","IR"],"capacity1st":1,"capacity2nd":2,"sections":[{"journey":{"name":"S 19008","category":"S","categoryCode":5,"number":"19008","operator":"SBB","to":"Brugg AG","passList":[{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":"2015-05-11T05:15:00+0200","arrivalTimestamp":1431314100,"departure":"2015-05-11T05:15:00+0200","departureTimestamp":1431314100,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},{"station":{"id":"008503503","name":"Turgi","score":null,"coordinate":{"type":"WGS84","x":47.491755,"y":8.253436},"distance":null},"arrival":"2015-05-11T05:19:00+0200","arrivalTimestamp":1431314340,"departure":"2015-05-11T05:19:00+0200","departureTimestamp":1431314340,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503503","name":"Turgi","score":null,"coordinate":{"type":"WGS84","x":47.491755,"y":8.253436},"distance":null}},{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":"2015-05-11T05:24:00+0200","arrivalTimestamp":1431314640,"departure":null,"departureTimestamp":null,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}}],"capacity1st":1,"capacity2nd":1},"walk":null,"departure":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:15:00+0200","departureTimestamp":1431314100,"delay":null,"platform":"3","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"arrival":{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":"2015-05-11T05:24:00+0200","arrivalTimestamp":1431314640,"departure":null,"departureTimestamp":null,"delay":null,"platform":"4","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}}},{"journey":{"name":"S 29 8918","category":"S","categoryCode":5,"number":"8918","operator":"SBB","to":"Langenthal","passList":[{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:27:00+0200","departureTimestamp":1431314820,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}},{"station":{"id":"008502116","name":"Schinznach Bad","score":null,"coordinate":{"type":"WGS84","x":47.451771,"y":8.166924},"distance":null},"arrival":"2015-05-11T05:31:00+0200","arrivalTimestamp":1431315060,"departure":"2015-05-11T05:31:00+0200","departureTimestamp":1431315060,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008502116","name":"Schinznach Bad","score":null,"coordinate":{"type":"WGS84","x":47.451771,"y":8.166924},"distance":null}},{"station":{"id":"008502128","name":"Holderbank AG","score":null,"coordinate":{"type":"WGS84","x":47.428633,"y":8.166601},"distance":null},"arrival":"2015-05-11T05:33:00+0200","arrivalTimestamp":1431315180,"departure":"2015-05-11T05:33:00+0200","departureTimestamp":1431315180,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008502128","name":"Holderbank AG","score":null,"coordinate":{"type":"WGS84","x":47.428633,"y":8.166601},"distance":null}},{"station":{"id":"008502115","name":"Wildegg","score":null,"coordinate":{"type":"WGS84","x":47.415275,"y":8.162996},"distance":null},"arrival":"2015-05-11T05:36:00+0200","arrivalTimestamp":1431315360,"departure":"2015-05-11T05:37:00+0200","departureTimestamp":1431315420,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008502115","name":"Wildegg","score":null,"coordinate":{"type":"WGS84","x":47.415275,"y":8.162996},"distance":null}},{"station":{"id":"008502114","name":"Rupperswil","score":null,"coordinate":{"type":"WGS84","x":47.403284,"y":8.12694},"distance":null},"arrival":"2015-05-11T05:39:00+0200","arrivalTimestamp":1431315540,"departure":"2015-05-11T05:39:00+0200","departureTimestamp":1431315540,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008502114","name":"Rupperswil","score":null,"coordinate":{"type":"WGS84","x":47.403284,"y":8.12694},"distance":null}},{"station":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null},"arrival":"2015-05-11T05:45:00+0200","arrivalTimestamp":1431315900,"departure":"2015-05-11T06:02:00+0200","departureTimestamp":1431316920,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null}}],"capacity1st":1,"capacity2nd":1},"walk":null,"departure":{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:27:00+0200","departureTimestamp":1431314820,"delay":null,"platform":"5","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}},"arrival":{"station":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null},"arrival":"2015-05-11T05:45:00+0200","arrivalTimestamp":1431315900,"departure":null,"departureTimestamp":null,"delay":null,"platform":"6","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null}}},{"journey":{"name":"IC 704","category":"IC","categoryCode":1,"number":"704","operator":"SBB","to":"Gen\u00e8ve-A\u00e9roport","passList":[{"station":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null},"arrival":"2015-05-11T05:47:00+0200","arrivalTimestamp":1431316020,"departure":"2015-05-11T05:49:00+0200","departureTimestamp":1431316140,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null}},{"station":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null},"arrival":"2015-05-11T05:58:00+0200","arrivalTimestamp":1431316680,"departure":"2015-05-11T06:03:00+0200","departureTimestamp":1431316980,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null}}],"capacity1st":1,"capacity2nd":1},"walk":null,"departure":{"station":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:49:00+0200","departureTimestamp":1431316140,"delay":null,"platform":"4","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008502113","name":"Aarau","score":null,"coordinate":{"type":"WGS84","x":47.391355,"y":8.051251},"distance":null}},"arrival":{"station":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null},"arrival":"2015-05-11T05:58:00+0200","arrivalTimestamp":1431316680,"departure":null,"departureTimestamp":null,"delay":null,"platform":"8","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null}}},{"journey":{"name":"IR 2456","category":"IR","categoryCode":2,"number":"2456","operator":"SBB","to":"Basel SBB","passList":[{"station":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T06:12:00+0200","departureTimestamp":1431317520,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null}},{"station":{"id":"008500027","name":"Gelterkinden","score":null,"coordinate":{"type":"WGS84","x":47.465884,"y":7.847654},"distance":null},"arrival":"2015-05-11T06:21:00+0200","arrivalTimestamp":1431318060,"departure":"2015-05-11T06:22:00+0200","departureTimestamp":1431318120,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500027","name":"Gelterkinden","score":null,"coordinate":{"type":"WGS84","x":47.465884,"y":7.847654},"distance":null}},{"station":{"id":"008500026","name":"Sissach","score":null,"coordinate":{"type":"WGS84","x":47.462747,"y":7.812021},"distance":null},"arrival":"2015-05-11T06:26:00+0200","arrivalTimestamp":1431318360,"departure":"2015-05-11T06:27:00+0200","departureTimestamp":1431318420,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500026","name":"Sissach","score":null,"coordinate":{"type":"WGS84","x":47.462747,"y":7.812021},"distance":null}},{"station":{"id":"008500023","name":"Liestal","score":null,"coordinate":{"type":"WGS84","x":47.484456,"y":7.731352},"distance":null},"arrival":"2015-05-11T06:32:00+0200","arrivalTimestamp":1431318720,"departure":"2015-05-11T06:33:00+0200","departureTimestamp":1431318780,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":2},"location":{"id":"008500023","name":"Liestal","score":null,"coordinate":{"type":"WGS84","x":47.484456,"y":7.731352},"distance":null}},{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:44:00+0200","arrivalTimestamp":1431319440,"departure":null,"departureTimestamp":null,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}],"capacity1st":1,"capacity2nd":2},"walk":null,"departure":{"station":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T06:12:00+0200","departureTimestamp":1431317520,"delay":null,"platform":"10","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500218","name":"Olten","score":null,"coordinate":{"type":"WGS84","x":47.351928,"y":7.907684},"distance":null}},"arrival":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:44:00+0200","arrivalTimestamp":1431319440,"departure":null,"departureTimestamp":null,"delay":null,"platform":"6","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}}]},{"from":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:52:00+0200","departureTimestamp":1431316320,"delay":null,"platform":"3","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"to":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:51:00+0200","arrivalTimestamp":1431319860,"departure":null,"departureTimestamp":null,"delay":null,"platform":"9","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}},"duration":"00d00:59:00","transfers":0,"service":{"regular":"daily","irregular":null},"products":["IR"],"capacity1st":2,"capacity2nd":2,"sections":[{"journey":{"name":"IR 1956","category":"IR","categoryCode":2,"number":"1956","operator":"SBB","to":"Basel SBB","passList":[{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":"2015-05-11T05:51:00+0200","arrivalTimestamp":1431316260,"departure":"2015-05-11T05:52:00+0200","departureTimestamp":1431316320,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},{"station":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null},"arrival":"2015-05-11T05:59:00+0200","arrivalTimestamp":1431316740,"departure":"2015-05-11T06:01:00+0200","departureTimestamp":1431316860,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500309","name":"Brugg AG","score":null,"coordinate":{"type":"WGS84","x":47.480851,"y":8.208823},"distance":null}},{"station":{"id":"008500305","name":"Frick","score":null,"coordinate":{"type":"WGS84","x":47.507343,"y":8.013074},"distance":null},"arrival":"2015-05-11T06:16:00+0200","arrivalTimestamp":1431317760,"departure":"2015-05-11T06:17:00+0200","departureTimestamp":1431317820,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500305","name":"Frick","score":null,"coordinate":{"type":"WGS84","x":47.507343,"y":8.013074},"distance":null}},{"station":{"id":"008500320","name":"Stein-S\u00e4ckingen","score":null,"coordinate":{"type":"WGS84","x":47.541601,"y":7.948819},"distance":null},"arrival":"2015-05-11T06:22:00+0200","arrivalTimestamp":1431318120,"departure":"2015-05-11T06:23:00+0200","departureTimestamp":1431318180,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500320","name":"Stein-S\u00e4ckingen","score":null,"coordinate":{"type":"WGS84","x":47.541601,"y":7.948819},"distance":null}},{"station":{"id":"008500302","name":"M\u00f6hlin","score":null,"coordinate":{"type":"WGS84","x":47.561853,"y":7.833856},"distance":null},"arrival":"2015-05-11T06:30:00+0200","arrivalTimestamp":1431318600,"departure":"2015-05-11T06:31:00+0200","departureTimestamp":1431318660,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008500302","name":"M\u00f6hlin","score":null,"coordinate":{"type":"WGS84","x":47.561853,"y":7.833856},"distance":null}},{"station":{"id":"008500301","name":"Rheinfelden","score":null,"coordinate":{"type":"WGS84","x":47.55121,"y":7.792155},"distance":null},"arrival":"2015-05-11T06:34:00+0200","arrivalTimestamp":1431318840,"departure":"2015-05-11T06:35:00+0200","departureTimestamp":1431318900,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":2,"capacity2nd":2},"location":{"id":"008500301","name":"Rheinfelden","score":null,"coordinate":{"type":"WGS84","x":47.55121,"y":7.792155},"distance":null}},{"station":{"id":"008500021","name":"Pratteln","score":null,"coordinate":{"type":"WGS84","x":47.52266,"y":7.690802},"distance":null},"arrival":"2015-05-11T06:42:00+0200","arrivalTimestamp":1431319320,"departure":"2015-05-11T06:43:00+0200","departureTimestamp":1431319380,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":2,"capacity2nd":2},"location":{"id":"008500021","name":"Pratteln","score":null,"coordinate":{"type":"WGS84","x":47.52266,"y":7.690802},"distance":null}},{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:51:00+0200","arrivalTimestamp":1431319860,"departure":null,"departureTimestamp":null,"delay":null,"platform":"","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}],"capacity1st":2,"capacity2nd":2},"walk":null,"departure":{"station":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"arrival":null,"arrivalTimestamp":null,"departure":"2015-05-11T05:52:00+0200","departureTimestamp":1431316320,"delay":null,"platform":"3","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":1,"capacity2nd":1},"location":{"id":"008503504","name":"Baden","score":null,"coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}},"arrival":{"station":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"arrival":"2015-05-11T06:51:00+0200","arrivalTimestamp":1431319860,"departure":null,"departureTimestamp":null,"delay":null,"platform":"9","prognosis":{"platform":null,"arrival":null,"departure":null,"capacity1st":null,"capacity2nd":null},"location":{"id":"008500010","name":"Basel SBB","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}}}]}],"from":{"id":"008503504","name":"Baden","score":"101","coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null},"to":{"id":"000000022","name":"Basel","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null},"stations":{"from":[{"id":"008503504","name":"Baden","score":"101","coordinate":{"type":"WGS84","x":47.47642,"y":8.307695},"distance":null}],"to":[{"id":"000000022","name":"Basel","score":null,"coordinate":{"type":"WGS84","x":47.547408,"y":7.589547},"distance":null}]}};
                    callback();
                    return;
                } else {
                    var url = 'http://transport.opendata.ch/v1/connections?from='+from+'&to='+to;
                    $http.get('http://transport.opendata.ch/v1/connections?from='+from+'&to='+to).
                        success(function(data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log(data);
                            console.log(status);
                            routes.response = data;
                            callback();
                        }).
                        error(function(data, status, headers, config) {
                            callback(true);
                        });
                }
            }
        };
    })

    .factory('SearchRoute', function() {
        var route = {};
        myDate = Date.now();
        myISODate = new Date(myDate).toISOString();
        route.data = {
            from: "",
            to: "",
            via: "",
            date: "",
            time: "",
            direction: 0,
            useTestData: true,
            activeButton: 1
        };
        return {
            data: route
        };
    })

    .factory('Tickets', function() {
        var tickets = {};

        tickets.data = [];
        return {
            data: tickets,
            addTicket: function(from, to) {
                tickets.data.push({
                    from: from,
                    to: to,
                    date: Date.now()
                });
            }
        };
    })

    .factory('Passengers', function() {
        var passengers = {};

        passengers.data = [];
        return {
            data: passengers,
            addPassenger: function(name) {
                passengers.data.push({
                    name: name
                });
            },
            clear: function() {
                passengers.data = [];
            }
        };
    });
