appLogin.
    controller('ControllerLogin',
        [
            '$scope','ModelLogin','$location','$cookieStore',
            function($scope, ModelLogin, $location,$cookieStore) {

                $scope.efetuaLogin = function(dataLogin) {
                    ModelLogin.logar(dataLogin)
                        .success(function(data) {
                            $cookieStore.put('nome',data.nome);
                            window.location.href = '/#/vistoria';
                        })
                        .error(function() {

                        });
                }
            }
        ]
    );
