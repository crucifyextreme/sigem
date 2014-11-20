appVistoria
    .factory('ModelVistoria', function($http) {

        return {
            /**
             * Busca contrato informado pelo usuário
             */
            getDataContrato: function(contrato) {
                return $http({
                    method:'put',
                    url:'vistoria/buscaContrato',
                    data:contrato
                });
            },
            /**
             * Grava a vistoria
             */
            save: function(data) {
                return $http({
                    method:'post',
                    url:'vistoria/save',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * Consulta vistoria pelo ID
             */
            consultaVistoria: function(id) {
                return $http({
                    method:'put',
                    url:'vistoria/consultaVistoria',
                    data:id
                });
            },
            /**
             * Grava vistoria editada
             */
            salvaEdicaoVistoria: function(data) {
                return $http({
                    method:'post',
                    url:'vistoria/salvaEdicaoVistoria',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * Busca todas as vistorias abertas
             */
            getAllOpen: function() {
               return $http.get('vistoria/findAllOpen');
            },
            /**
             * Busca todas as vistorias no sistema
             */
            getAll: function() {
                return $http.get('vistoria/findAll');
            },
            /**
             * FINALIZA OU CANCELA A VISTORIA - AÇÕES
             */
            acoesVistoria:function(data) {
                return $http({
                    method:'put',
                    url:'vistoria/acoes',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * AGENDA DO VISTORIADOR
             *  - Pega a agenda do vistoriador
             */
            buscaAgenda:function(data) {
                return $http({
                    method:'put',
                    url:'vistoria/agendaVistoriador',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                })
            },
            /**
             * Finaliza vistorias na bancada do vistoriador
             */
            finalizaBancada:function(data) {
                return $http({
                    method:'put',
                    url:'vistoria/finalizarBancada',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                })
            }
        }
    });

