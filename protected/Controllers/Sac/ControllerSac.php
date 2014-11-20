<?php

namespace Controllers\Sac;

use ___PHPSTORM_HELPERS\object;
use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class ControllerSac implements ControllerProviderInterface
{

    public function connect(Application $app)
    {
        $index = new ControllerCollection(new Route());

        /**
         * BUSCA OS DADOS QUANDO O USUÁRIO DIGITA O CONTRATO NO INPUT E APERTA ENTER.
         */
        $index->put('/buscaContrato', function( Request $request ) use ($app) {
            try {
                $dataRetorno = $app['models']->load('ModelVistoria','buscaContrato', json_decode($request->getContent()));
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * SALVA O CHAMADO NO BD.
         */
        $index->post('/save', function( Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac','save', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * PEGA TODOS OS CHAMADOS ABERTOS NO BD.
         */
        $index->get('/findAllOpen', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'findAllOpen'));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CARREGA TODOS OS CHAMADOS NO BD.
         */
        $index->get('/carregaTodosChamados', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'carregaTodosChamados'));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA CHAMADO PELO ID
         */
        $index->put('/findChamadoId', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'findChamadoId', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * ATUALIZA OS DADOS DO CHAMADO
         */
        $index->post('/updateChamado', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'updateChamado', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * SALVA HISTORICO
         */
        $index->post('/saveHistorico', function(Request $request) use ($app) {
            /**
             * VOU COLOCAR A DATA E HORA DO CADASTRO VIA PHP, PARA QUE O SISTEMA PEGUE A HORA DO SERVIDOR
             */
            $data = json_decode($request->getContent());
            $session = $app['session']->get('nome');
            $dados = [
                'ID_CHAMADO' => $data->ID_CHAMADO,
                'DADOS_HISTORICO' => $data->DADOS_HISTORICO,
                'DATA_HISTORICO'    => date('Y-m-d'),
                'HORA_HISTORICO'    => date('H:i:s'),
                'RP_HISTORICO'      => $session['nome']
             ];

            try {
                return $app->json($app['models']->load('ModelSac', 'saveHistorico', $dados));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CONSULTA HISTORICOS DO CHAMADO
         */
        $index->put('/loadHistorico', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'loadHistoric', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * METODO RESPONSAVEL PELO CANCELAMENTO E/OU FINALIZAÇÃO.
         */
        $index->put('/acoes', function( Request $request) use ($app) {
            /*
             * Verificações
             * Se o  $request->get('action') == "finalizada"
             *  Tenho que passar
             *      - RP_FECHAMENTO
             *      - DATA_FECHAMENTO
             * Se o  $request->get('action') == "cancelada"
             *  Tenho que passar
             *      - RP_CANCELAMENTO
             *      - DATA_CANCELAMENTO
             */

            $session = $app['session']->get('nome'); // pega o nome da sessão
            switch($request->get('action')) {
                case "finalizada": $data =
                    [
                        'id' => $request->get('id'),
                        'action' => $request->get('action'),
                        'RP_FECHAMENTO' => $session['nome'],
                        'DATA_FECHAMENTO' => date('Y-m-d'),
                        'RP_CANCELAMENTO' => "",
                        'DATA_CANCELAMENTO' => "0000-00-00"
                    ];
                    break;
                case "cancelada": $data =
                    [
                        'id' => $request->get('id'),
                        'action' => $request->get('action'),
                        'RP_FECHAMENTO' => "",
                        'DATA_FECHAMENTO' => "0000-00-00",
                        'RP_CANCELAMENTO' => $session['nome'],
                        'DATA_CANCELAMENTO' => date('Y-m-d')
                    ];
                    break;
            }

            try{
                $app->json($app['models']->load('ModelSac', 'acoes',$data));
                return $app->json(['message' => 'ok']);
            } catch(Exception $e) {
                // $app->json(['error' => $e->getMessage()]); die;
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA TODOS OS PRESTADORES CADASTRADOS NO BD
         */
        $index->get('/buscaTodosPrestadores', function() use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaTodosPrestadores'));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO PRESTADOR PELO NOME
         */
        $index->put('/buscaPrestadorNome', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaPrestadorNome',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO PRESTADOR PELO CPF OU CNPJ
         */
        $index->put('/buscaPrestadorCpfCnpj', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaPrestadorCpfCnpj',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * ATUALIZA DADOS DO PRESTADOR
         */
        $index->put('/atualizaDadosPrestador', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'atualizaDadosPrestador',get_object_vars(json_decode($request->getContent()))));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CADASTRA NOVO PRESTADOR
         */
        $index->post('/cadastrarNovoPrestador', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'cadastrarNovoPrestador',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * VINCULA(ADICIONA) PRESTADOR AO CHAMADO
         */
        $index->post('/adicionarPrestadorChamado', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'adicionarPrestadorChamado',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA PRESTADORES VINCULADOS AO CHAMADO
         */
        $index->put('/buscaPrestadoresVinculadosChamado', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaPrestadoresVinculadosChamado',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * ATUALIZA DADOS FINANCEIRO DO PRESTADOR
         */
        $index->put('/atualizaDadosFinanceiro', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'atualizaDadosFinanceiro',get_object_vars(json_decode($request->getContent()))));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS FINANCEIRO DO PRESTADOR PELO ID_FINANCEIRO
         */
        $index->put('/buscaDadosFinanceiro', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaDadosFinanceiro',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * REMOVE PRESTADOR CHAMADO
         */
        $index->put('/removePrestadorChamado', function( Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelSac', 'removePrestadorChamado',get_object_vars(json_decode($request->getContent()))));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CARREGA DADOS PROVISIONADOS DOS PRESTADORES
         */
        $index->get('/carregaDadosProvisionados', function() use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'carregaDadosProvisionados'));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });


        return $index;
    }
}
