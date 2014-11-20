appRecisao
    .factory('ModelRecisao.php', function($http) {
        return {
            buscaDadosContrato:function(item) {
                return $http.get('negociacao/buscaDadosContrato', {
                    params: item
                });
            },
            /**
             * BUSCA DADOS DO PROPRIETARIO PELO NUMERO DE CONTRATO
             */
            buscaDadosProprietario:function(item) {
                return $http.get('negociacao/buscaDadosProprietario', {
                    params: item
                });
            },
            /**
             * BUSCA DADOS DO INQUILINO PELO NUMERO DE CONTRATO
             */
            buscaDadosInquilino:function(contrato) {
                return $http.get('negociacao/buscaDadosInquilino', {
                    params: contrato
                });
            },
            /**
             * BUSCA DADOS DO FIADOR PELO NUMERO DE CONTRATO
             */
            buscaDadosInquilino:function(contrato) {
                return $http.get('negociacao/buscaDadosInquilino', {
                    params: contrato
                });
            },
            buscaDadosFiadores:function(contrato) {
                return $http.get('negociacao/buscaDadosFiadores', {
                    params: contrato
                });
            },
            /**
             * BUSCA DADOS DO IMÓVEL PELO NUMERO DE CONTRATO.
             */
            buscaDadosImovel:function(contrato) {
                return $http.get('negociacao/buscaDadosImovel',{
                    params:contrato
                });
            }
        }
    });