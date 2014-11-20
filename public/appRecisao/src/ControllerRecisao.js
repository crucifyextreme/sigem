appRecisao.
    controller('ControllerRecisao',
        [
            '$scope','ModelRecisao.php','$timeout','$cookieStore','$routeParams','$filter',
            function($scope, ModelRecisao,$timeout,$cookieStore,$routeParams,$filter) {

                /**
                 * CRIO AQUI FUNCAO QUE ABRE A JANELA MODAL PARA QUE EU POSSA CHAMAR A QUALQUER HORA NO SISTEMA
                 */
                $scope.modalProcessandoOpen = function() {
                     vex.open({
                        className: 'vex-theme-top',
                        content:'<div style="font-size: 11px; font-weight: bold"> <img src="../img/712.GIF" /> Processando sua requisição ...</div>',
                        showCloseButton: false,
                        escapeButtonCloses: false,
                        overlayClosesOnClick: false
                    });
                },
                /**
                 * CRIO AQUI FUNCAO QUE FECHA A JANELA MODAL PARA QUE EU POSSA CHAMAR A QUALQUER HORA NO SISTEMA
                 */
                $scope.modalProcesandoClosed = function() {
                    vex.close();
                },
                $scope.iniciaDados = function() {
                    $scope.value_btn_pesquisar = "Pesquisar";
                },

                /**
                 * BUSCA DADOS DO CONTRATO PELO NUMERO DE CONTRATO, AÇÃO RESPONSAVEL POR BUSCAR TODOS OS DADOS
                 * DA TELA DE RECISÃO pagina ->>>> acompanhamentoRecisao.html
                 */
                $scope.buscaContrato = function(item) {

                    $scope.modalProcessandoOpen();

                    /**
                     * PEGO AQUI OS DADOS DO IMOVEL/CONTRATO
                     */
                    ModelRecisao.buscaDadosImovel(item)
                        .success(function(dadosContrato){
                            $scope.dadosImovel = dadosContrato;
                            /**
                             * PEGO AQUI OS DADOS DOS PROPRIETARIOS
                             */
                             if(dadosContrato != undefined) {
                                 ModelRecisao.buscaDadosProprietario(angular.fromJson(item))
                                     .success(function (dadosProprietarios) {
                                         $scope.proprietarios = dadosProprietarios;
                                         /**
                                          * PEGO AQUI OS DADOS DOS INQUILINOS
                                          */
                                         if (dadosProprietarios.length != undefined) {
                                             ModelRecisao.buscaDadosInquilino(angular.fromJson(item))
                                                 .success(function (dadosInquilino) {
                                                     $scope.inquilos = dadosInquilino;
                                                     /**
                                                      * PEGO AQUI OS DADOS DOS FIADORES
                                                      */
                                                     if (dadosInquilino.length != undefined) {
                                                         ModelRecisao.buscaDadosFiadores(angular.fromJson(item))
                                                             .success(function (dadosFiadores) {
                                                                 $scope.fiadores = dadosFiadores;
                                                             });
                                                     }
                                                 })
                                         }

                                     })
                             }
                        /* FECHO A MODAL DE PROCESSANDO */
                        $timeout(function () {
                            $scope.modalProcesandoClosed();
                        }, 1200);
                    })
                    .error(function() {
                        /* MOSTRO O ERRO */
                            $('#topError').delay('400').slideDown('slow');
                        /* FECHO A MODAL DE PROCESSANDO */
                            $scope.modalProcesandoClosed();
                        /* OCULTO O ERRO */
                        $timeout(function() {
                            $('#topError').delay('600').slideUp('slow');
                        }, 2000);
                    });
                }
            }
        ]
    )