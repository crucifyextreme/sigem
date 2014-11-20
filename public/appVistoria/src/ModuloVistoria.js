var appVistoria = angular.module('appVistoria',['ngRoute', 'ngResource','ui.mask'])

appVistoria
    .config(
        [
            '$routeProvider',
                function($routeProvider) {
                    $routeProvider
                        .when('/vistoria/abertas', {
                            templateUrl:'../appVistoria/templates/listarVistoriasAbertas.html'
                        })
                        .when('/vistoria', {
                            templateUrl:'../appVistoria/templates/listarTodasVistorias.html'
                        })
                        .when('/vistoria/editar', {
                            templateUrl:'../appVistoria/templates/editarVistoria.html'
                        })
                        .when('/vistoria/agendamento', {
                            templateUrl:'../appVistoria/templates/agendamento.html'
                        })
                        .when('/vistoria/agendaVistoriador', {
                            templateUrl:'../appVistoria/templates/agendaVistoriador.html'
                        })
                        .when('/vistoria/bancadaVistoriador', {
                            templateUrl:'../appVistoria/templates/bancadaVistoriador.html'
                        });
                }
        ]
    );



appVistoria
    .run(function(ModelLogin) {

        ModelLogin.verificaLogin()
            .success(function(data) {
               if(data.retorno == "nao logado") {
                   window.location.href = '/login';
               }
            })
            .error(function() {

            });
    });


