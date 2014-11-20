appSac.
    controller('ControllerSac',
        [
            '$scope','ModelSac','$timeout','$cookieStore','$routeParams','$filter',
            function($scope, ModelSac,$timeout,$cookieStore,$routeParams,$filter) {
                /**
                 * Função pega a data atual e transforma em formato americano.
                 */
                function dataAtualAmericano() {
                    /* Pega a data atual */
                    var today = new Date();
                    var date = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
                    return date;
                }


                /**
                 * Função converter de formato americano para brasileiro
                 */
                function dataConverteBrasil(data) {
                    var dataBrasil = data.split('-');
                    return dataBrasil[2]+'/'+dataBrasil[1]+'/'+dataBrasil[0];
                }

                /**
                 * Função converter de formato brasileiro para americano
                 */
                function dataConverteAmericano(data) {
                    var dataAmericano = data.split('/');
                    return dataAmericano[2]+'-'+dataAmericano[1]+'-'+dataAmericano[0];
                }

                /**
                 * FUNÇÃO PARA CONVERTER MOEDA
                 */
                function converteMoedaFloat(valor){

                    if(valor === ""){
                        valor =  0;
                    }else{
                        valor = valor.replace(".","");
                        valor = valor.replace(",",".");
                        valor = parseFloat(valor);
                    }
                    return valor;

                }
                /**
                 * CONVERTE FLOAT PARA MOEDA
                 */
                function converteFloatMoeda(valor){
                    var inteiro = null, decimal = null, c = null, j = null;
                    var aux = new Array();
                    valor = ""+valor;
                    c = valor.indexOf(".",0);
                    //encontrou o ponto na string
                    if(c > 0){
                        //separa as partes em inteiro e decimal
                        inteiro = valor.substring(0,c);
                        decimal = valor.substring(c+1,valor.length);
                    }else{
                        inteiro = valor;
                    }

                    //pega a parte inteiro de 3 em 3 partes
                    for (j = inteiro.length, c = 0; j > 0; j-=3, c++){
                        aux[c]=inteiro.substring(j-3,j);
                    }

                    //percorre a string acrescentando os pontos
                    inteiro = "";
                    for(c = aux.length-1; c >= 0; c--){
                        inteiro += aux[c]+'.';
                    }
                    //retirando o ultimo ponto e finalizando a parte inteiro

                    inteiro = inteiro.substring(0,inteiro.length-1);

                    decimal = parseInt(decimal);
                    if(isNaN(decimal)){
                        decimal = "00";
                    }else{
                        decimal = ""+decimal;
                        if(decimal.length === 1){
                            decimal = decimal+"0";
                        }
                    }


                    valor = inteiro+","+decimal;


                    return valor;

                }

                /**
                 * Função chamada quando iniciar uma pagina.
                 */
                $scope.initData = function() {
                    $('#modalProcessando').modal({
                        keyboard:false,
                        backdrop:'static'
                    });

                    $timeout(function() {
                        $('#modalProcessando').modal('hide');
                    }, 800);
                },
                /**
                 * CONSULTA DADOS DO CONTRATO INFORMADO NO INPUT,
                 * QUANDO O ELEMENTO  PERDE O FOCO.
                 */
                $scope.consulta_dados_contrato = function(contrato) {
                    if(contrato != null) {
                        $scope.pesquisando = function() { return true};
                        ModelSac.getDataContrato(angular.fromJson({CODIGO_CONTRATO:contrato}))
                            .success(function(data) {
                                if(data != 'false') {

                                    $scope.item = data;
                                    $timeout(function() {
                                        $scope.pesquisando = function() { return false};
                                    }, 300);
                                } else {
                                    $('#modalErroContrato').modal();
                                    $timeout(function() {
                                        $scope.pesquisando = function() { return false};
                                    }, 300);
                                    $scope.item = "";
                                }

                            })
                            .error(function(data) {
                                alert('Ocorreu algum erro de processamento no sistema.');
                            });
                    }
                },

                /**
                 * GRAVA O CHAMADO NO BD.
                 */
                    $scope.gravarChamado = function(dataItem) {

                        $("#modalProcessando").modal({
                            backdrop:'static',
                            keyboard: false
                        });

                        dataItem.DATA_ABERTURA = dataAtualAmericano();
                        dataItem.RP_ABERTURA = $cookieStore.get('nome');
                        dataItem.STATUS = 'aberta';
                        ModelSac.save(angular.fromJson(dataItem))
                            .success(function(data) {
                                if(data != 1) {
                                     /* Ocorreu algum erro */
                                    $('#topError').delay('800').slideDown('slow');
                                    $timeout(function() {
                                        $("#modalProcessando").modal('hide');
                                    },500);
                                    $timeout(function() {
                                        $('#topError').delay('800').slideUp('slow');
                                    }, 3500);
                                } else {
                                     /* Tudo certo */
                                    $scope.item = "";
                                    $timeout(function() {
                                        $("#modalProcessando").modal("hide");
                                    }, 900);
                                    /* Mostra a top bar com a notificação de sucesso */
                                    $('#topSuccess').delay('800').slideDown('slow');
                                    $timeout(function() {
                                        $('#topSuccess').delay('300').slideUp('slow');
                                    }, 2500);
                                }

                            })
                            .error(function(data) {
                                $timeout(function() {
                                    $("#modalProcessando").modal("hide");
                                }, 300);
                                alert('Ocorreu algum erro de processamento no sistema.');
                            })

                    },
                /**
                 * CARREGA OS CHAMADOS ABERTOS NO SISTEMA
                 */
                    $scope.carregaChamadosAbertos = function() {
                        $("#modalProcessando").modal({
                            backdrop:'static',
                            keyboard: false
                        });

                        ModelSac.getAllOpen()
                            .success(function(data) {
                                if(data.error) {
                                    $('#topError').delay('800').slideDown('slow');
                                    $timeout(function() {
                                        $("#modalProcessando").modal('hide');
                                    },500);
                                    $timeout(function() {
                                        $('#topError').delay('800').slideUp('slow');
                                    }, 3500);
                                } else {
                                    $scope.chamados = data;

                                    $timeout(function() {
                                        $("#modalProcessando").modal("hide");
                                    }, 800);
                                }

                            })
                            .error(function() {
                                $("#modalProcessando").modal("hide");
                                alert('Ocorreu erro de funcionamento do sistema !');
                            });
                    },
                /**
                 * CARREGA TODOS OS CHAMADOS
                 */
                 $scope.carregaTodosChamados = function() {

                     $("#modalProcessando").modal({
                         backdrop:'static',
                         keyboard: false
                     });
                     ModelSac.carregaTodosChamados()
                         .success(function(data) {
                             if(data.error) {
                                 $('#topError').delay('800').slideDown('slow');
                                 $timeout(function() {
                                     $("#modalProcessando").modal('hide');
                                 },500);
                                 $timeout(function() {
                                     $('#topError').delay('800').slideUp('slow');
                                 }, 3500);
                             } else {
                                 $scope.chamados = data;

                                 $timeout(function() {
                                     $("#modalProcessando").modal("hide");
                                 }, 800);
                             }

                         })
                         .error(function() {
                             $("#modalProcessando").modal("hide");
                             alert('Ocorreu erro de funcionamento do sistema !');
                         });
                 },
                /**
                 * FUNÇÃO QUE CARREGA OS DADOS DO CHAMADO, PEGANDO PELO ID DA URL E JOGA NOS INPUTS
                 */
                $scope.carregaDadosChamadoSelecionado = function() {

                    $("#modalProcessando").modal({
                        backdrop:'static',
                        keyboard: false
                    });

                    ModelSac.getDataChamadoId(angular.fromJson({ID_SAC:$routeParams.id}))
                        .success(function(data) {

                            /**
                             * VERIFICA SE TEM VISTORIA VINCULADA COM O CHAMADO.
                             */
                            if(data.ID_VISTORIA == null) {
                                /* SE NAO TIVER VISTORIA VINCULADA AO CHAMADO, ELE ESCONDE A DIV DE VISTORIA.*/
                                $scope.dadosVistoria = function() { return false};
                                    /* ESCONDE O TITULO DA VISTORIA */
                                $scope.tituloVistoria = function() { return true};
                            }
                            /**
                             * VERIFICA SE TEM PRESTADOR VINCULADO AO CHAMADO
                             */
                            if(data.ID_FINANCEIRO == null) {
                                $scope.bt_prestadores_chamado = true; // Se nao tiver prestador vinculado no chamado ele esconde o botão/link.
                            }
                            /**
                             * SE O STATUS FOR DIFERENTE DE ABERTA, VAI DISABILITAR OS INPUTS E OS BOTÕES.
                             */
                            if(data.STATUS != 'aberta') {
                                $scope.disabledInputs = function() { return true };
                                /* ESCONDE O BOTÃO ATIVO DE SALVAR EDIÇÃO DA PAGINA dadosChamado.html */
                                $scope.btn_salvar_edicao = true;
                                /* MOSTRA O BOTÃO DE SALVAR EDIÇÃO DESABILITADO DA PAGINA DE dadosChamado.html */
                                $scope.btn_salvar_edicao_disabilitado = true;
                                /* ESCONDE O BOTÃO/LINK DE ADICIONAR NOVO HISTORICO */
                                $scope.bt_novo_historico = true;
                            }

                            $scope.item = data;
                            $timeout(function() {
                                $("#modalProcessando").modal("hide");
                            }, 800);
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * ATUALIZA OS DADOS DO CHAMADO
                  */
                $scope.updateChamado = function(item) {

                    $("#modalProcessando").modal({
                        backdrop:'static',
                        keyboard: false
                    });

                    ModelSac.updateChamado(angular.fromJson(item))
                        .success(function(data) {
                            if(data.error) {
                                /**
                                 * OCORREU ALGUM ERRO EM GRAVAR OS DADOS
                                 */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $("#modalProcessando").modal('hide');
                                },500);
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                            } else {
                                /**
                                 * TUDO CERTO O SISTEMA CONSEGUIU GRAVAR
                                 */
                                /* Mostra a top bar com a notificação de sucesso */
                                $('#topSuccess').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topSuccess').delay('800').slideUp('slow');
                                }, 3500);

                                $timeout(function() {
                                    $("#modalProcessando").modal("hide");
                                }, 800);
                            }
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * MODAL HISTORICO
                 */
                $scope.modalHistorico = function(id) {
                    $('#modalHistorico').modal();
                    $scope.id_chamado = id;
                    $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                    $scope.msn_processando = false ; // Esconde a mensagem de processando
                },
                /**
                 * GRAVA O HISTORICO
                 */
                $scope.gravarHistorico = function(historico, id_chamado) {
                    $scope.btnGravaHistorico = true; // Esconde o botão de salvar status
                    $scope.msn_processando = true ; // Mostra a mensagem de processando
                    ModelSac.saveHistorico(({ID_CHAMADO:id_chamado,DADOS_HISTORICO:historico}))
                        .success(function(data) {
                            if(data.error) {
                                /**
                                 * OCORREU ALGUM ERRO EM GRAVAR O HISTORICO
                                 */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                                $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                                $scope.msn_processando = false ; // Esconde a mensagem de processando
                            } else if(data == 1) {

                                $scope.solicitacao = "";
                                $timeout(function() {
                                    $('#modalHistorico').modal('hide');
                                }, 800);
                                $timeout(function() {
                                    $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                                    $scope.msn_processando = false ; // Esconde a mensagem de processando
                                }, 700);
                                $('#topSuccess').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topSuccess').delay('800').slideUp('slow');
                                }, 3500);
                                $scope.loadHistorico();
                            } else {
                                /**
                                 * OCORREU ALGUM ERRO DESCONHECIDO EM GRAVAR O HISTORICO
                                 */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                                $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                                $scope.msn_processando = false ; // Esconde a mensagem de processando
                            }
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * CARREGA OS HISTORICOS DO SISTEMA
                 */
                $scope.loadHistorico = function() {
                    ModelSac.loadHistorico(angular.fromJson({ID_CHAMADO:$routeParams.id}))
                        .success(function(data) {
                            $scope.historicos = data;
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * AÇÕES DO SISTEMA, CANCELA OU FINALALIZA O CHAMADO
                 */
                $scope.openModalAcoes = function(id, acao) {
                    $scope.id = id; // id vistoria pegado pelo button
                    $scope.action = acao; // acao pegado pelo button
                    if(acao == "finalizada") {
                        $scope.acao = "Finalizar"; // jogo no texto da janela de acao.
                    }
                    if(acao == "cancelada") {
                        $scope.acao = "Cancelar"; // jogo no texto da janela de acao.
                    }
                    $('#modalAcoes').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                },
                /**
                 * COMEÇA AQUI O CANCELAMENTO OU A FINALIZAÇÃO
                 */
                $scope.actionVistoria = function(id, action) {
                    /* Depois de Clicar  */
                    /* Desapareço com os botões e mostro a mensagem de processando */
                    $scope.btnActions = function() { return true};
                    $scope.processando = function() { return true};

                    ModelSac.acoesChamado($.param({id:id, action:action}))
                        .success(function(data) {

                            if(data.message == "ok") {
                                /**
                                 * Caso o sistema de o update corretamente
                                 * */
                                $timeout(function() {
                                    /* Escondo a mensagem de processando */
                                    $scope.processando = function() { return false};
                                    /* Carrego os botões da modal novamente */
                                    $scope.btnActions = function() { return false};
                                    /* Oculto o botão/link para adicionar novo historico */
                                    $scope.bt_novo_historico = true;
                                    /* Fecho a modal */
                                    $('#modalAcoes').modal('hide');
                                    $('#topSuccess').delay('400').slideDown('slow');
                                    $timeout(function() {
                                        $('#topSuccess').delay('600').slideUp('slow');
                                    }, 3000);

                                    /**
                                     * Caso o usuario opte por cancelar e/ou finalizar a vistoria na tela de editarVistoria
                                     */
                                    $scope.disabledInputs = function() { return true}; // Disabilita todos os inputs da pagina
                                    $scope.btn_salvar_edicao = true; // Disabilita o botao de edição
                                    $scope.btn_salvar_edicao_disabilitado = true; // Habilita o botão de edição desabilitado

                                }, 500);
                            } else {
                                /* AQUI O SISTEMA PEGOU ALGUM ERRO COM O PHP */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                                /* Escondo a mensagem de processando */
                                $scope.processando = function() { return false};
                                /* Carrego os botões da modal novamente */
                                $scope.btnActions = function() { return false};
                            }
                        })
                        .error(function() {
                            /**
                             * Caso o sistema de algum erro no update
                             * */
                            $timeout(function() {
                                /* Escondo a mensagem de processando */
                                $scope.processando = function() { return false};
                                /* Carrego os botões da modal novamente */
                                $scope.btnActions = function() { return false};
                                /* Mostro somente um alert normal na tela */
                                alert('Ocorreu algum erro de processamento no sistema.');
                            }, 500);
                        });
                },
                /**
                 * BUSCA PRESTADORES VINCULADOS AO CHAMADO
                 */
                $scope.carregaDadosPrestadores = function() {
                    $scope.value_btn_pesquisar = 'Pesquisar';
                    ModelSac.buscaPrestadoresVinculadosChamado(angular.fromJson({ID_CHAMADO:$routeParams.id}))
                        .success(function(data) {

                            /* CABEÇALHO DA PAGINA prestadoresChamado.php, COM OS DADOS DO CHAMADO */
                            $scope.CODIGO_CONTRATO = data[0].CODIGO_CONTRATO;
                            $scope.SOLICITANTE = data[0].SOLICITANTE;
                            $scope.CODIGO_IMOVEL = data[0].CODIGO;
                            $scope.INQUILINO = data[0].NOME_CLIENTE;
                            $scope.SOLICITACAO = data[0].SOLICITACAO;
                            /**
                             * PASSO OS DADOS PARA O NG-REPEAT, MAS ANTES VERIFICO SE EXISTE ALGUM NOME DE PRESTADOR NO ARRAY
                             * PARA NÃO PASSAR ARRAY VAZIO PARA O NG-REPEAT
                             */
                            if(data[0].PRESTADOR != null) {
                                $scope.prestadores = data;
                            }
                            /**
                             * VERIFICO AQUI SE O STATUS ESTA DIFERENTE DE ABERTA, PARA QUE EU DESABILITO AS FUNCIONALIDADES
                             */
                            if(data[0].STATUS != 'aberta') {
                                /* ESCONDO O ICONE DA LUPA, REPONSAVEL PELA ABERTURA DA JANELA MODAL QUE LISTA OS PRESTADORES */
                                $scope.bt_abre_modal_listar_prestadores = true;
                                /* DESABILITO O BOTÃO DE PESQUISAR O PRESTADOR */
                                $scope.bt_pesquisa_prestador = true;
                                /* DESABILITO O BOTÃO NOVO */
                                $scope.bt_novo = true;
                                /* DESABILITO O BOTÃO SALVAR DADOS */
                                $scope.bt_salvar_dados = true;
                            }
                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });

                },
                /**
                 * ABRE MODAL LISTANDO OS PRESTADORES CADASTRADOS NO SISTEMA
                 */
                $scope.abreModalListaPrestadores = function() {
                    $('#modalListaPrestadores').modal();
                    $scope.buscaTodosPrestadores();
                },
                /**
                 * BUSCA TODOS OS PRESTADORES CADASTRADOS NO SISTEMA
                 */
                $scope.buscaTodosPrestadores = function() {
                    ModelSac.buscaTodosPrestadores()
                        .success(function(data) {
                            $scope.prestadoresSistema = data;
                        })
                        .error(function() {
                            /* OCORREU ALGUM ERRO NA LISTAGEM DOS PRESTADORES */
                            $('#topError').delay('800').slideDown('slow');
                            $timeout(function() {
                                $('#topError').delay('800').slideUp('slow');
                            }, 1500);
                        });
                },
                /**
                 * FUNÇÕES E CADASTRO PRESTADORES DO SISTEMA
                 */
                $scope.abrirModalCadastroPrestador = function() {
                    $('#modalPrestadores').modal();
                },
                /**
                 * BUSCA DADOS DO PRESTADOR PELO NOME
                 */
                $scope.buscaPrestadorNome = function(prestador) {
                    $scope.item = "";
                    $scope.value_btn_pesquisar = 'Pesquisando ...';
                    ModelSac.buscaPrestadorNome(angular.toJson({PRESTADOR:prestador}))
                        .success(function(data){

                            if(data != 'false') {

                                $scope.item = data;
                                $scope.PRESTADOR = data.PRESTADOR;
                                $scope.bt_adicionar_prestador_chamado_desabilitado = true;
                                $scope.bt_gravar_prestador = true;
                                $scope.d_inputs_cadastro_prestador = true; // Desabilita os inputs do cadastro de prestador.
                                $scope.bt_atualiza_dados_prestador = true; // Mostra o botão de atualizar dados prestador.

                                $scope.d_cpf_prestador = true; // Desabilita o CPF do prestador
                                $scope.d_cnpj_prestador = true; // Desabilita o CNPJ do prestador

                                /**
                                 * SE O USUÁRIO ESTIVER BUSCANDO PELA JANELA MODAL, ENTÃO O SISTEMA FECHA ELA AQUI
                                 */
                                $('#modalListaPrestadores').modal('hide');

                            } else {
                                $('#prestador').focus();
                                $scope.item = "";
                                $scope.d_inputs_cadastro_prestador = false; // Habilita os inputs do cadastro de prestador.
                                $scope.bt_atualiza_dados_prestador = false; // Esconde o botão de atualizar dados prestador.

                                $scope.d_cpf_prestador = false; // Habilita o CPF do prestador
                                $scope.d_cnpj_prestador = false; // Habilita o CNPJ do prestador
                            }
                            $timeout(function() {
                                $scope.value_btn_pesquisar = 'Pesquisar';

                            }, 500);
                        })
                        .error(function(data) {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * ATUALIZA DADOS DO PRESTADOR
                 */
                 $scope.atualizaDadosPrestador = function(item) {
                     ModelSac.atualizaDadosPrestador(item)
                         .success(function(data) {
                             /* OCORREU TUDO CERTO A ATUALIZAÇÃO DO PRESTADOR */
                             if(data == 1) {
                                 $('#topSuccess').delay('400').slideDown('slow');
                                 $timeout(function() {
                                     $('#topSuccess').delay('600').slideUp('slow');
                                 }, 1000);

                                 /* ATUALIZA OS DADOS DO PRESTADOR ALTERADO */
                                 $scope.buscaTodosPrestadores();
                             }
                         })
                         .error(function() {
                             /* OCORREU ALGUM ERRO DE ATUALIZAÇÃO DO PRESTADOR */
                             $('#topError').delay('800').slideDown('slow');
                             $timeout(function() {
                                 $('#topError').delay('800').slideUp('slow');
                             }, 1500);
                         });
                 },
                /**
                 * BOTAO NOVO, QUE LIBERA O CADASTRO DO PRESTADOR
                 */
                $scope.liberarCadastroPrestador = function() {
                    $scope.bt_adicionar_prestador_chamado_desabilitado = false; // Esconde o botão de Adicionar ao Chamado
                    $scope.bt_gravar_prestador = false; // Mostra o botão Salvar Dados
                    $scope.item = ""; // Limpa os inputs para um novo cadastro
                    $scope.d_inputs_cadastro_prestador = false; // Habilita os inputs
                    $scope.bt_atualiza_dados_prestador = false; // Esconde o o botão de atualizar dados
                },
                /**
                 * CADASTRA NOVO PRESTADOR
                 */
                 $scope.cadastrarNovoPrestador = function(item) {
                     ModelSac.buscaPrestadorCpfCnpj(item)
                         .success(function(data) {
                             if(data.CPF == undefined || data.CNPJ == undefined) {
                                 /* GRAVO NO O PRESTADOR NO BANCO DE DADOS. */
                                 ModelSac.cadastrarNovoPrestador(item)
                                     .success(function(data) {
                                         /* OCORREU TUDO CERTO A GRAVAÇÃO DO PRESTADOR */
                                         if(data == 1) {
                                             $('#topSuccess').delay('400').slideDown('slow');
                                             $timeout(function() {
                                                 $('#topSuccess').delay('600').slideUp('slow');
                                             }, 1000);
                                             $scope.item = ""; // Limpo os campos inputs.
                                         } else {
                                             /* OCORREU ALGUM ERRO DE GRAVAÇÃO DO PRESTADOR */
                                             $('#topError').delay('800').slideDown('slow');
                                             $timeout(function() {
                                                 $('#topError').delay('800').slideUp('slow');
                                             }, 1500);
                                         }
                                     })
                                     .error(function() {
                                         /* OCORREU ALGUM ERRO DE GRAVAÇÃO DO PRESTADOR */
                                         $('#topError').delay('400').slideDown('slow');
                                         $timeout(function() {
                                             $('#topError').delay('600').slideUp('slow');
                                         }, 2000);
                                     });
                             } else {
                                 $('#modalPrestadorJaCadastrado').modal();
                             }
                         })
                         .error(function() {

                         });
                 },
                /**
                 * ADICIONA O PRESTADOR AO CHAMADO
                 */
                $scope.adicionarPrestadorChamado = function(idPrestador) {
                /* idPrestador vindo do botão do Adicionar ao Chamado */
                    ModelSac.adicionarPrestadorChamado(angular.fromJson({ID_CHAMADO:$routeParams.id, ID_PRESTADOR:idPrestador, RP_ABERTURA:$cookieStore.get('nome')}))
                        .success(function(data){
                            if(data == 1) {
                                $scope.item = "";
                                $scope.carregaDadosPrestadores();
                                $('#topSuccess').delay('400').slideDown('slow');
                                $timeout(function() {
                                    $('#topSuccess').delay('600').slideUp('slow');
                                }, 1200);

                            }
                            /* AQUI O SISTEMA PEGOU ALGUM ERRO VINDO DO PHP */
                            if(data != 1) {
                                $('#topError').delay('400').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('600').slideUp('slow');
                                }, 2000);
                            }

                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * CRIEI ESTE $SCOPE ESPEFICICO PARA VERIFICAR DADOS FINANCEIROS DO PRESTADOR, POIS COMO VOU UTILIZA - LO
                 * EM OUTROS LOCAIS, CIREI DESTA FORMA.
                 */
                $scope.verificaDadosFinanceiroPrestador = function(dataJson) {

                    ModelSac.buscaDadosFinanceiro(dataJson)
                        .success(function(data) {

                            /* DATA ORÇAMENTO */
                            if(data.DATA_ORCAMENTO != undefined) {
                                data.DATA_ORCAMENTO = dataConverteBrasil(data.DATA_ORCAMENTO);
                                $scope.d_tipoServicoExecutar = true; // desabilita o input TIPO_SERVICO_EXECUTAR
                                $scope.d_dataOrcamento = true; // desabilita o input DATA_ORCAMENTO
                            } else {
                                $scope.d_dataOrcamento = false; // habilita o input DATA_ORCAMENTO
                                $scope.d_tipoServicoExecutar = false; // habilita o input TIPO_SERVICO_EXECUTAR
                            }

                            /* DATA EXECUÇÃO */
                            if(data.DATA_EXECUCAO != undefined) {
                                data.DATA_EXECUCAO = dataConverteBrasil(data.DATA_EXECUCAO);
                                $scope.d_dataExecucao = true; // desabilita o input DATA_EXECUÇÃO
                            } else {
                                $scope.d_dataExecucao = false; // habilita o input DATA_EXECUÇÃO
                            }

                            /**
                             * O CAMPO DE INPUT COM A MASCARA NÃO ACEITA VALORES DE RETORNO COMO MOEDA POR CAUSA DA MASCADA PARA QUE EU RETORNE O VALOR COMO MOEDA
                             * TENHO QUE FAZER ESTAS VERIFICAÇÕES.
                             */
                                /* MÃO OBRA */
                            if(data.V_MAO_OBRA != null && data.V_MAO_OBRA != "") {
                                $scope.m_obra_hide = true;
                                $scope.m_obra_show = true;
                            } else{
                                $scope.m_obra_hide = false;
                                $scope.m_obra_show = false;
                            }
                                /* MATERIAL */
                            if(data.V_MATERIAL != null && data.V_MATERIAL != "") {
                                $scope.material_hide = true;
                                $scope.material_show = true;
                            } else{
                                $scope.material_hide = false;
                                $scope.material_show = false;
                            }
                                /* QTD PARCELAS */
                            if(data.QTD_PARCELAS != null && data.QTD_PARCELAS != "") {
                                $scope.desabilita_parcelas = true;
                            } else {
                                $scope.desabilita_parcelas = false;
                            }
                                /* DATA BLOQUEIO, CONVERTE ELA PARA O FORMATO BRASILEIRO */
                            if(data.DATA_BLOQUEIO != null && data.DATA_BLOQUEIO != "") {
                                data.DATA_BLOQUEIO = dataConverteBrasil(data.DATA_BLOQUEIO);
                                $scope.desabilita_data = true;

                            } else {
                                $scope.desabilita_data = false;
                            }
                            /* DATA EXECUÇÃO */
                            if(data.DATA_PARCELA_1 != undefined) {
                                $scope.desabilita_data_parcela_1 = true; // desabilita o input DATA_PARCELA_1
                            } else {
                                $scope.desabilita_data_parcela_1 = false; // habilita o input DATA_PARCELA_1
                            }
                            /* DATA PACELA 1 */
                            if(data.DATA_PARCELA_1 != undefined) {
                                data.DATA_PARCELA_1 = dataConverteBrasil(data.DATA_PARCELA_1);
                                $scope.desabilita_data_parcela_1 = true; // desabilita o input DATA_PARCELA_1
                            } else {
                                $scope.desabilita_data_parcela_1 = false; // habilita o input DATA_PARCELA_1
                            }
                                /* PARCELA 1 */
                            if(data.V_PARCELA_1 != null && data.V_PARCELA_1 != "") {
                                $scope.parcela_1_hide = true;
                                $scope.parcela_1_show = true;
                            } else {
                                $scope.parcela_1_hide = false;
                                $scope.parcela_1_show = false;
                            }
                            /* PARCELA 2 */
                            if(data.V_PARCELA_2 != null && data.V_PARCELA_2 != "") {
                                $scope.parcela_2_hide = true;
                                $scope.parcela_2_show = true;
                            } else {
                                $scope.parcela_2_hide = false;
                                $scope.parcela_2_show = false;
                            }
                            /* PARCELA 3 */
                            if(data.V_PARCELA_3 != null && data.V_PARCELA_3 != "") {
                                $scope.parcela_3_hide = true;
                                $scope.parcela_3_show = true;
                            } else {
                                $scope.parcela_3_hide = false;
                                $scope.parcela_3_show = false;
                            }
                            /* PARCELA 4 */
                            if(data.V_PARCELA_4 != null && data.V_PARCELA_4 != "") {
                                $scope.parcela_4_hide = true;
                                $scope.parcela_4_show = true;
                            } else {
                                $scope.parcela_4_hide = false;
                                $scope.parcela_4_show = false;
                            }
                            /* PARCELA 5 */
                            if(data.V_PARCELA_5 != null && data.V_PARCELA_5 != "") {
                                $scope.parcela_5_hide = true;
                                $scope.parcela_5_show = true;
                            } else {
                                $scope.parcela_5_hide = false;
                                $scope.parcela_5_show = false;
                            }
                            /* PARCELA 6 */
                            if(data.V_PARCELA_6 != null && data.V_PARCELA_6 != "") {
                                $scope.parcela_6_hide = true;
                                $scope.parcela_6_show = true;
                            } else {
                                $scope.parcela_6_hide = false;
                                $scope.parcela_6_show = false;
                            }
                            /* PARCELA 7 */
                            if(data.V_PARCELA_7 != null && data.V_PARCELA_7 != "") {
                                $scope.parcela_7_hide = true;
                                $scope.parcela_7_show = true;
                            } else {
                                $scope.parcela_7_hide = false;
                                $scope.parcela_7_show = false;
                            }
                            /* PARCELA 8 */
                            if(data.V_PARCELA_8 != null && data.V_PARCELA_8 != "") {
                                $scope.parcela_8_hide = true;
                                $scope.parcela_8_show = true;
                            } else {
                                $scope.parcela_8_hide = false;
                                $scope.parcela_8_show = false;
                            }
                            /* PARCELA 9 */
                            if(data.V_PARCELA_9 != null && data.V_PARCELA_9 != "") {
                                $scope.parcela_9_hide = true;
                                $scope.parcela_9_show = true;
                            } else {
                                $scope.parcela_9_hide = false;
                                $scope.parcela_9_show = false;
                            }
                            /* PARCELA 10 */
                            if(data.V_PARCELA_10 != null && data.V_PARCELA_10 != "") {
                                $scope.parcela_10_hide = true;
                                $scope.parcela_10_show = true;
                            } else {
                                $scope.parcela_10_hide = false;
                                $scope.parcela_10_show = false;
                            }


                            $scope.fin = data;
                            $scope.nome_prestador = data.PRESTADOR;

                        });
                },
                /**
                 * ABRE MODAL FINANCEIRA DO PRESTADOR
                 */
                $scope.abrirModalFinanceira = function(idPrestador, idPrestadorFinanceiro) {

                    $scope.fin = ""; // Limpa todos os campos da modal financeira.
                    /**
                     * VERIFICAR SE JÁ EXISTE ALGO CADASTRADO NO CADASTRO FINANCEIRO DO PRESTADOR
                     */
                    $scope.verificaDadosFinanceiroPrestador(angular.fromJson({ID_FINANCEIRO:idPrestadorFinanceiro}));

                    $scope.dadosChamado = angular.fromJson({ID_PRESTADOR:idPrestador, ID_CHAMADO:$routeParams.id, ID_FINANCEIRO:idPrestadorFinanceiro});
                    $('#modalFinanceiraPrestador').modal();
                },
                /**
                 * O USUÁRIO ALTEROU A QUANTIDADE DE PARCELAS, COM ISSO VERIFICO ALGUNS DADOS
                 */
                $scope.verificaDadosParcela = function(dadosFinanceiros) {

                    var maoObra = converteMoedaFloat(dadosFinanceiros.V_MAO_OBRA);
                    var material = converteMoedaFloat(dadosFinanceiros.V_MATERIAL);
                    var t_maoObra_Material = parseFloat(maoObra) + parseFloat(material);

                    if(dadosFinanceiros.QTD_PARCELAS == 1) {
                        dadosFinanceiros.V_PARCELA_1 = converteFloatMoeda(t_maoObra_Material);
                    }

                },
                /**
                 * ATUALIZA OU SALVA OS DADOS FINANCEIRO DO PRESTADOR
                 */
                $scope.atualizaDadosFinanceiro = function(dadosFinanceiro,dadosChamado) {
                    $scope.fin = ""; // Limpa os input para sumir o erro da data.

                        delete dadosFinanceiro.PRESTADOR; // Deletto do objeto o atributo prestador para não dar na inserção
                    /* CONVERTE DATA ORÇAMENTO */
                    if(dadosFinanceiro.DATA_ORCAMENTO != undefined) {
                        dadosFinanceiro.DATA_ORCAMENTO = dataConverteAmericano(dadosFinanceiro.DATA_ORCAMENTO);
                    } else {
                        dadosFinanceiro.DATA_ORCAMENTO = null;
                    }
                    /* CONVERTE DATA EXECUÇÃO */
                    if(dadosFinanceiro.DATA_EXECUCAO != undefined) {
                        dadosFinanceiro.DATA_EXECUCAO = dataConverteAmericano(dadosFinanceiro.DATA_EXECUCAO);
                    } else {
                        dadosFinanceiro.DATA_EXECUCAO = null;
                    }
                    /* CONVERTE DATA BLOQUEIO */
                    if(dadosFinanceiro.DATA_BLOQUEIO != undefined) {
                        dadosFinanceiro.DATA_BLOQUEIO = dataConverteAmericano(dadosFinanceiro.DATA_BLOQUEIO);
                    } else {
                        dadosFinanceiro.DATA_BLOQUEIO = null;
                    }
                    /* CONVERTE DATA PARCELA 1 */
                    if(dadosFinanceiro.DATA_PARCELA_1 != undefined) {
                        dadosFinanceiro.DATA_PARCELA_1 = dataConverteAmericano(dadosFinanceiro.DATA_PARCELA_1);
                    } else {
                        dadosFinanceiro.DATA_PARCELA_1 = null;
                    }
                    /**
                     * ATUALIZA O STATUS DE PROVISIONAMENTO
                     */
                        /** VERIFICA PARCELA 1 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 1 && dadosFinanceiro.V_PARCELA_1 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                        /** VERIFICA PARCELA 2 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 2 && dadosFinanceiro.V_PARCELA_2 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                        /** VERIFICA PARCELA 3 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 3 && dadosFinanceiro.V_PARCELA_3 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                        /** VERIFICA PARCELA 4 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 4 && dadosFinanceiro.V_PARCELA_4 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                        /** VERIFICA PARCELA 5 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 5 && dadosFinanceiro.V_PARCELA_5 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                        /** VERIFICA PARCELA 6 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 6 && dadosFinanceiro.V_PARCELA_6 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                    /** VERIFICA PARCELA 7 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 7 && dadosFinanceiro.V_PARCELA_7 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                    /** VERIFICA PARCELA 8 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 8 && dadosFinanceiro.V_PARCELA_8 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                    /** VERIFICA PARCELA 9 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 9 && dadosFinanceiro.V_PARCELA_9 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }
                    /** VERIFICA PARCELA 10 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 10 && dadosFinanceiro.V_PARCELA_10 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                    }

                    ModelSac.atualizaDadosFinanceiro(angular.fromJson(angular.extend(dadosChamado,dadosFinanceiro)))
                        .success(function(data) {
                            /**
                             * ATUALIZA DADOS DA JANELA MODAL
                             */
                            $scope.verificaDadosFinanceiroPrestador(angular.fromJson({ID_FINANCEIRO:dadosChamado.ID_FINANCEIRO}));
                            $scope.carregaDadosPrestadores();
                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * PROCESSO DE REMOÇÃO DO PRESTADOR DO CHAMADO COMEÇA AQUI.
                 */
                $scope.abreModalExclusaoPrestador = function(idFinanceiro) {
                    $scope.idFinanceiro = idFinanceiro; // Passo o idFinanceiro para o botão da janela modal de exclusão.
                    /* ABRO A JANELA MODAL */
                    $('#modalExclusaoPrestador').modal({
                        backdrop:'static',
                        keyboard: false
                    });
                },
                /**
                 * FACO AQUI O PROCESSO DE EXCLUSÃO DOS DO PRESTADOR DO CHAMADO.
                 */
                $scope.removePrestadorChamado = function(idFinanceiro) {
                    $scope.processando = true; // Mostra a Mensagem de Processando.
                    $scope.btnModal = true; // Esconde os Botões Enquanto a Modal Processando.
                    ModelSac.removePrestadorChamado(angular.fromJson({ID_FINANCEIRO:idFinanceiro}))
                        .success(function(data) {
                            if(data == 1) {
                                /** Removeu Com Sucesso **/
                                $scope.prestadores = "";
                                $scope.carregaDadosPrestadores();
                                $timeout(function() {
                                    $scope.processando = false; // Esconde a Mensagem de Processando.
                                    $scope.btnModal = false; // Mostra os Botões Enquanto a Modal Processando.
                                }, 600);
                                /** Fecha a Janela Modal **/
                                $timeout(function() {
                                    $('#modalExclusaoPrestador').modal('hide');
                                }, 700);
                            } else {
                                $scope.processando = false; // Esconde a Mensagem de Processando.
                                $scope.btnModal = false; // Mostra os Botões Enquanto a Modal Processando.
                                alert('Ocorreu algum erro de processamento no sistema.');
                            }
                        })
                        .error(function() {
                            $scope.processando = false; // Esconde a Mensagem de Processando.
                            $scope.btnModal = false; // Mostra os Botões Enquanto a Modal Processando.
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * CARREGA OS PRESTADORES COM PROVISIONAMENTO JA LIBERADO, PARA O FINANCEIRO
                 */
                $scope.financeiroPrestadores = function() {
                    ModelSac.carregaDadosProvisionados()
                        .success(function(data) {
                            $scope.financeiros = data;
                        })
                        .error(function() {

                        });
                },
                /**
                 * ABRE A MODAL FINANCEIRA PARA PAGAMENTO
                 */
                $scope.abreModalFinanceiraPagamento = function() {
                    $('#abreModalFinanceiraPagamento').modal({
                        keyboard:true
                    });
                }

            }
        ]
    )