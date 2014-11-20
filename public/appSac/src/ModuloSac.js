var appSac = angular.module('appSac',['ngRoute', 'ngResource','ui.mask','ngCookies','currencyMask'])

appSac
    .config(
        [
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/sac/novoChamado', {
                        templateUrl:'../appSac/templates/novoChamado.html'
                    })
                    .when('/sac/chamadosAbertos', {
                        templateUrl:'../appSac/templates/chamadosAbertos.html'
                    })
                    .when('/sac/todosChamados', {
                        templateUrl:'../appSac/templates/todosChamados.html'
                    })
                    .when('/sac/chamado/abrir/:id', {
                        templateUrl:'../appSac/templates/dadosChamado.html'
                    })
                    .when('/sac/chamado/prestadores/:id', {
                        templateUrl:'../appSac/templates/acompanhamentoRecisao.html'
                    })
                    .when('/sac/novoPrestador', {
                        templateUrl:'../appSac/templates/cadastroNovoPrestador.html'
                    })
                    .when('/sac/prestadores/financeiro', {
                        templateUrl:'../appSac/templates/prestadoresFinanceiro.html'
                    });
            }
        ]
    );

appSac.directive('directivaData', function () {
    return {

        restrict: 'A',
        link: function (scope, element, attrs) {

            element.datepicker({
                dateFormat: 'dd/mm/yy',
                dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
                dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
                dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
                monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
            });
        }
    }
});

appSac
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


