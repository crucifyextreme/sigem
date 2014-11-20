appVistoria.
    controller('ControllerVistoria',
        [
            '$scope','ModelVistoria','$timeout','$cookieStore','$routeParams','$filter',
            function($scope, ModelVistoria,$timeout,$cookieStore,$routeParams,$filter) {

                function dataAtualAmericano() {
                    /* Pega a data atual */
                    var today = new Date();
                    var date = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
                    return date;
                }

                /**
                 * Modal quando a pagina for requisitada
                 */
                $scope.loadPage = function() {
                    $("#modalProcessando").modal({
                        backdrop:'static',
                        keyboard: false
                    });

                    $timeout(function() {
                        $("#modalProcessando").modal("hide");
                    }, 800);
                },
                /**
                 * Consulta dados do contrato informado no input text,
                 * Quando perde o foco do elemento.
                 */
                $scope.consulta_dados_contrato = function(contrato) {

                    if(contrato != null) {
                        $scope.pesquisando = function() { return true};
                        ModelVistoria.getDataContrato(angular.fromJson({CODIGO_CONTRATO:contrato}))
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
                 * Grava a vistoria
                 */
                $scope.gravarVistoria = function(dataItem) {

                    $("#modalProcessando").modal({
                        backdrop:'static',
                        keyboard: false
                    });
                    /* Converte data */
                    var from = dataItem.DATA_VISTORIA.split("/");
                    var dataVistoria = from[2] + "-" + from[1] + "-" + from[0];
                    /* Criar objeto para enviar ao PHP */
                    var dadosVistoria = {
                                            CODIGO_CONTRATO:dataItem.CODIGO_CONTRATO,
                                            CODIGO:dataItem.CODIGO,
                                            ENDERECO:dataItem.ENDERECO,
                                            BAIRRO:dataItem.BAIRRO,
                                            PRIORIDADE:dataItem.PRIORIDADE,
                                            NOME:dataItem.NOME,
                                            DDD:dataItem.DDD,
                                            TEL_RESIDENCIAL_PROP:dataItem.RESIDENCIAL,
                                            TEL_CELULAR_PROP:dataItem.CELULAR,
                                            TEL_COMERCIAL_PROP:dataItem.COMERCIAL,
                                            EMAIL_PROP:dataItem.E_MAIL,
                                            VISTORIADOR:dataItem.VISTORIADOR,
                                            HORARIO: dataItem.HORARIO,
                                            DATA_VISTORIA: dataVistoria,
                                            TIPO_VISTORIA: dataItem.TIPO_VISTORIA,
                                            SOLICITANTE: dataItem.SOLICITANTE,
                                            TEL_RESIDENCIAL_SOLICITANTE: dataItem.TEL_RESIDENCIAL_SOLICITANTE,
                                            TEL_COMERCIAL_SOLICITANTE: dataItem.TEL_RESIDENCIAL_COMERCIAL,
                                            EMAIL_SOLICITANTE:dataItem.EMAIL_SOLICITANTE,
                                            SOLICITACAO: dataItem.SOLICITACAO,
                                            STATUS:'aberta',
                                            DATA_ABERTURA: dataAtualAmericano(),
                                            RESPONSAVEL_ABERTURA: $cookieStore.get('nome')
                                        }

                    ModelVistoria.save(angular.fromJson(dadosVistoria))
                        .success(function(data) {
                            if(data != 1) {
                                /* Ocorreu algum erro */
                                $timeout(function() {
                                    $("#modalProcessando").modal("hide");
                                }, 300);
                                $timeout(function() {
                                    alert('O sistema não conseguiu gravar os dados');
                                }), 600;
                            } else {
                                /** Tudo certo */
                                $scope.item = "";
                                $timeout(function() {
                                    $("#modalProcessando").modal("hide");
                                }, 900);
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
                 * Carregar vistoria selecionada pelo usuario, passando como parametro = ID
                 * Para edição dos dados
                 */
                $scope.loadEdit = function() {

                    $('#modalProcessando').modal({
                        backdrop:'static',
                        keyboard:false
                    });
                    var dataParam = {
                        ID_VISTORIA:$routeParams.id
                    }
                    ModelVistoria.consultaVistoria(dataParam)
                        .success(function(data) {
                            var data_vistoria = data.DATA_VISTORIA.split("-");
                            var dados = {
                                ID_VISTORIA:data.ID_VISTORIA,
                                CODIGO_CONTRATO: data.CODIGO_CONTRATO,
                                CODIGO: data.CODIGO,
                                ENDERECO: data.ENDERECO,
                                BAIRRO: data.BAIRRO,
                                PRIORIDADE: data.PRIORIDADE,
                                NOME: data.NOME,
                                DDD: data.DDD,
                                TEL_RESIDENCIAL_PROP: data.TEL_RESIDENCIAL_PROP,
                                TEL_CELULAR_PROP: data.TEL_CELULAR_PROP,
                                TEL_COMERCIAL_PROP: data.TEL_COMERCIAL_PROP,
                                EMAIL_PROP: data.EMAIL_PROP,
                                VISTORIADOR: data.VISTORIADOR,
                                HORARIO: data.HORARIO,
                                DATA_VISTORIA: data_vistoria[2]+"/"+data_vistoria[1]+"/"+data_vistoria[0],
                                TIPO_VISTORIA:data.TIPO_VISTORIA,
                                SOLICITANTE:data.SOLICITANTE,
                                TEL_RESIDENCIAL_SOLICITANTE:data.TEL_RESIDENCIAL_SOLICITANTE,
                                TEL_COMERCIAL_SOLICITANTE:data.TEL_COMERCIAL_SOLICITANTE,
                                EMAIL_SOLICITANTE:data.EMAIL_SOLICITANTE,
                                SOLICITACAO:data.SOLICITACAO,
                                STATUS: data.STATUS
                            }

                            /* Mostra o nome da pagina */
                            if(data.STATUS == "aberta") {
                                $scope.pagina = "EDIÇÃO VISTORIA";
                            } else {
                                $scope.btn_salvar_edicao = function() { return true};
                                $scope.btn_salvar_edicao_disabilitado = function() { return true};
                                $scope.pagina = "VISTORIA CONTRATO: " + data.CODIGO_CONTRATO +" -- STATUS: " + data.STATUS.toUpperCase();;
                                $scope.disabledInputs = function() { return true};
                            }

                            $scope.item = dados;
                            $timeout(function() {
                                $("#modalProcessando").modal("hide");
                            }, 500);
                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });

                },
                /**
                 * Grava edição da vistoria
                 */
                $scope.gravaEdicaoVistoria = function(dataItem) {
                    $('#modalProcessando').modal({
                        backdrop:'static',
                        keyboard:false
                    });

                    var data_vistoria = dataItem.DATA_VISTORIA.split("/");

                    /* Mantem mascara horario */
                    var horario = dataItem.HORARIO.split(":");
                    if(horario[1]) {
                        var horarioVistoria = dataItem.HORARIO;
                    } else {
                        var horas = dataItem.HORARIO.substring(0,2);
                        var minutos = dataItem.HORARIO.substring(2,4);
                        var horarioVistoria = horas+":"+minutos;
                    }
                    var dadosEdicao = {
                        ID_VISTORIA: dataItem.ID_VISTORIA,
                        PRIORIDADE: dataItem.PRIORIDADE,
                        VISTORIADOR: dataItem.VISTORIADOR,
                        HORARIO: horarioVistoria,
                        DATA_VISTORIA: data_vistoria[2]+"-"+data_vistoria[1]+"-"+data_vistoria[0],
                        TIPO_VISTORIA: dataItem.TIPO_VISTORIA,
                        SOLICITANTE: dataItem.SOLICITANTE,
                        TEL_RESIDENCIAL_SOLICITANTE: dataItem.TEL_RESIDENCIAL_SOLICITANTE,
                        TEL_COMERCIAL_SOLICITANTE: dataItem.TEL_COMERCIAL_SOLICITANTE,
                        EMAIL_SOLICITANTE: dataItem.EMAIL_SOLICITANTE,
                        SOLICITACAO: dataItem.SOLICITACAO
                    }
                    ModelVistoria.salvaEdicaoVistoria(dadosEdicao)
                        .success(function() {
                            $timeout(function() {
                                $("#modalProcessando").modal("hide");
                            }, 800);
                        })
                        .error(function() {
                            $timeout(function() {
                                $("#modalProcessando").modal("hide");
                            }, 300);
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * Carrega todos as vistorias abertas no sistema
                 */
                $scope.loadAllOpen = function() {

                    $("#modalProcessando").modal({
                        backdrop:'static',
                        keyboard: false
                    });

                   ModelVistoria.getAllOpen()
                       .success(function(data) {
                           /* Erro que veio da API */
                            if(data.error == 500) {
                                $timeout(function() {
                                    $("#modalProcessando").modal("hide");
                                }, 300);
                                alert("Ocorreu um erro no sistema");
                            }
                           /* Caso não tenha nenhuma vistoria em aberto no sistema ele faz as seguintes ações
                            * abaixo
                            */
                           if(data.length == undefined) {
                               $scope.tabelaVistoriasAbertas = function() { return true};
                               $scope.pesquisaVistoriasAbertas = function() { return true};
                               $scope.msnVistoriaEmAberto = function() {return true};
                           }
                           /* Se passar jogar na tela os dados */
                           $scope.vistorias = data;
                           $timeout(function() {
                               $("#modalProcessando").modal("hide");
                           }, 800);
                       })
                       .error(function(data) {
                           alert('Ocorreu erro de funcionamento do sistema !')
                       });
                },
                /**
                 * Carrega todos as vistorias cadastrados no sistema
                 */
                 $scope.loadAll = function() {

                     $("#modalProcessando").modal({
                         backdrop:'static',
                         keyboard: false
                     });

                     ModelVistoria.getAll()
                         .success(function(data) {
                             /* Erro que veio da API */
                             if(data.error == 500) {
                                 $timeout(function() {
                                     $("#modalProcessando").modal("hide");
                                 }, 300);
                                 alert("Ocorreu um erro no sistema");
                             }
                             /* Se passar jogar na tela os dados */
                             $scope.vistorias = data;
                             $timeout(function() {
                                 $("#modalProcessando").modal("hide");
                             }, 800);
                         })
                         .error(function(data) {
                             alert('Ocorreu erro de funcionamento do sistema !')
                         });

                 },
                    /* METODO RESPONSAVEL PELO CANCELAMENTO E/OU FINALIZAÇÃO */
                /**
                 * Funcionamento:
                 *  1 - O botão tanto de cancelamento ou de finalização envia o id e a acao, de cancelamento ou de finalização.
                 *  2 - Abre a modal de ações
                 */
                    $scope.openModalAcoes = function(id, acao) {

                        $scope.id_vistoria = id; // id vistoria pegado pelo button
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
                 * Começa aqui o cancelamento e a finalização
                 */
                    $scope.actionVistoria = function(id, action) {
                        /* Depois de Clicar  */
                        /* Desapareço com os botões e mostro a mensagem de processando */
                        $scope.btnActions = function() { return true};
                        $scope.processando = function() { return true};

                        ModelVistoria.acoesVistoria($.param({id:id, action:action}))
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
                                        /* Fecho a modal */
                                        $('#modalAcoes').modal('hide');
                                        /* Dou um refresh na pagina */
                                        $scope.loadAllOpen();

                                        /**
                                         * Caso o usuario opte por cancelar e/ou finalizar a vistoria na tela de editarVistoria
                                         */
                                        $scope.disabledInputs = function() { return true}; // Disabilita todos os inputs da pagina
                                        $scope.btn_salvar_edicao = function() { return true}; // Disabilita o botao de edição
                                        $scope.btn_salvar_edicao_disabilitado = function() { return true}; // Habilita o botão de edição desabilitado
                                        $scope.pagina = "STATUS: " + action.toUpperCase();; // Mostrar no lado direito o status
                                        $scope.actionsIcons = function() { return true}; // Esconde os icones de habilitar e desabilitar

                                    }, 500);
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
                 * AGENDA DO VISTORIADOR
                 */
                    $scope.buscaAgendaVistoriador = function(item) {
                        $scope.tabelaAgenda = function() { return false};
                        $scope.imprimirAgenda = function() { return false};
                        $("#modalProcessando").modal({
                            keyboard:false,
                            backdrop:'static'
                        });
                        var dataInicial = item.dataInicial.split('/');
                        var dataFinal = item.dataFinal.split('/');

                        var data = {
                                dataInicial: dataInicial[2]+"-"+dataInicial[1]+"-"+dataInicial[0],
                                dataFinal: dataFinal[2]+"-"+dataFinal[1]+"-"+dataFinal[0],
                                vistoriador: item.vistoriador
                            };
                         ModelVistoria.buscaAgenda(data)
                            .success(function(data) {
                                if(data.error) {
                                    alert('Ocorreu algum erro de processamento no sistema');
                                } else {

                                    if(data.length == undefined) {
                                        /**
                                         * Aqui o sistema não encontrou nenhuma resultado !
                                         */
                                        $scope.msn_nada_encontrado = function() { return true};
                                        $timeout(function() {
                                            $("#modalProcessando").modal("hide");
                                        }, 200);
                                    } else {
                                        /**
                                         * Aqui ele encontrou resultados
                                         */
                                        $scope.imprimirAgenda = function() { return true};
                                        $scope.msn_nada_encontrado = function() { return false};
                                        $scope.tabelaAgenda = function() { return true};
                                        $scope.vistorias = data;
                                        $timeout(function() {
                                            $("#modalProcessando").modal("hide");
                                        }, 800);
                                    }
                                }

                            })
                            .error(function() {
                                alert('Ocorreu algum erro de processamento no sistema.');
                            });
                    },
                /**
                 * Imprime a agenda dos vistoriadores
                 */
                    $scope.gerarAgenda = function(item) {
                        window.open('/vistoria/agendaVistoriador/print/?vistoriador='+item.vistoriador+'&dataInicial='+item.dataInicial+'&dataFinal='+item.dataFinal,'_blank');
                    },
                /**
                 * Lista as vistorias abertas na BANCADA DO VISTORIADOR
                 */
                    $scope.carregaVistoriasAbertas = function() {
                        $('#modalProcessando').modal({
                            keyboard:false,
                            backdrop:'static'
                        });
                        $scope.btnFinalizarMarcados = function() { return true}; // Disabilita o botão finalizar marcados.
                        ModelVistoria.getAllOpen()
                            .success(function(data) {
                                $scope.vistorias = data;
                                $timeout(function() {
                                    $('#modalProcessando').modal('hide');
                                }, 800);
                            })
                            .error(function() {
                                alert('Ocorreu algum erro de processamento no sistema');
                            });
                    },
                /**
                 * Responsavél por pagar os dados nos CheckBox na pagina agenda vistoriador.
                 */
                    $scope.vistoriasSelecionadas = function () {
                        var marcados = $filter('filter')($scope.vistorias, {checked: true});
                        $scope.dados = marcados
                        if(marcados.length > 0) {
                            $scope.btnFinalizarMarcados = function() { return false}; // Habilita o botão finalizar marcados.
                        } else {
                            $scope.btnFinalizarMarcados = function() { return true}; // Disabilita o botão finalizar marcados.
                        }
                    },
                /**
                 * Abre a modal de finalização de vistoria, na pagina bancada do vistoriador.
                 */
                    $scope.finalizar = function(dados) {
                        $scope.msn_error = function() { return false}; // Esconde a mensagem de erro na modal.
                        $('#modalFinalizar').modal({
                            keyboard:false,
                            backdrop:'static'
                        });
                        var dadosFinalizar = new Array();
                        for(var i=0; i<dados.length; i++) {
                            dadosFinalizar.push(
                                {
                                    id:dados[i]['ID_VISTORIA'],
                                    action:'finalizada',
                                    RP_FECHAMENTO: $cookieStore.get('nome'),
                                    DATA_FECHAMENTO: dataAtualAmericano()
                                }
                            );
                        }
                        $scope.dadosFinalizar = dadosFinalizar; // Passo aqui os dados para finalizar para o botão da janela modal.

                    },
                /**
                 * Finaliza a vistoria na bancada do vistoriador.
                 */
                    $scope.finalizarVistoria = function(dadosFinalizar) {
                        $scope.btnModalFinalizacao = function() { return false}; // mostra os botoes da janela modal.
                        $scope.btnModalFinalizacao = function() { return true}; // esconde os botoes da janela modal.
                        $scope.processando = function() { return true}; // mostra a mensagem de processando.
                        $scope.msn_error = function() { return false}; // esconde a mensagem de erro.
                        ModelVistoria.finalizaBancada(dadosFinalizar)
                            .success(function(data) {

                                if(data == 1) {
                                    /* Ocorreu tudo certo */
                                    $timeout(function() {
                                        $scope.processando = function() { return false};
                                    }, 300);
                                    $timeout(function() {
                                        $scope.carregaVistoriasAbertas();
                                        $scope.msn_ok = function() { return true};
                                    }, 500);
                                    $timeout(function() {
                                        $('#modalFinalizar').modal('hide');
                                        $scope.msn_ok = function() { return false};
                                        $scope.btnModalFinalizacao = function() { return false}; // mostra os botoes da janela modal.
                                    },2300);
                                } else if(data.error) {

                                    $scope.msn_error = function() { return true};
                                    $scope.processando = function() { return false};
                                }
                            })
                            .error(function() {
                                /* Caso ocorra algum erro de requisição Ajax */
                                alert('Ocorreu algum erro de processamento no sistema');
                                $scope.btnModalFinalizacao = function() { return false}; // mostra os botoes da janela modal.
                                $scope.processando = function() { return false}; // esconde a mensagem de processando.
                                $scope.msn_error = function() { return false}; // esconde a mensagem de erro.
                                $('#modalFinalizar').modal('hide');
                            });
                    }

            }
        ]
    );
