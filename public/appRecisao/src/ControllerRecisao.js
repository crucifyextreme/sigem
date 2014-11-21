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
                    $('#contrato').focus(); // Foca no elemento quando a pagina inicia.
                },
                /** CAPTURA EVENTO DO TECLADO, SE O USUARIO APERTAR A TECLA F2 VAI ABRIR A MODAL */
                $scope.capturaF2 = function ($event) {
                    if($event.keyCode == 113) {
                        ModelRecisao.buscaTodosContratos()
                            .success(function(data) {
                                $scope.contratos = data;
                            });
                        /* ABRE A JANELA MODAL */
                        $('#modalContratosSistema').modal();

                    }
                };
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
                             if(dadosContrato != 'false') {

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
                                 /**
                                  * MOSTRO AQUI OS DADOS DOS CONTRATOS E IMOVEIS
                                  */
                                 $scope.dados_contrato_imovel = true; // Mostro os dados do imovel
                                 $scope.dados_proprietario_header = true; // Mostro header dados do proprietario
                                 $scope.dados_inquilino_header = true; // Mostro header dados do inquilino
                                 $scope.dados_fiadores_header = true; // Mostro header dos fiadores

                             } else {
                                 /**
                                  * LIMPO TODOS OS DADOS
                                  */
                                 $scope.dadosImovel = "";
                                 $scope.proprietarios = "";
                                 $scope.inquilos = "";
                                 $scope.fiadores = "";
                                 /**
                                  * ESCONDO AQUI OS DADOS DOS CONTRATOS E IMOVEIS
                                  */
                                 $scope.dados_contrato_imovel = false; // Escondo os dados do imovel
                                 $scope.dados_proprietario_header = false; // Escondo header dados do proprietario
                                 $scope.dados_inquilino_header = false; // Escondo header dados do inquilino
                                 $scope.dados_fiadores_header = false; // Escondo header dos fiadores

                                 /* FECHO A MODAL DE PROCESSANDO */
                                 $timeout(function () {
                                     $scope.modalProcesandoClosed();
                                 }, 500);
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