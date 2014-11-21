<?php

namespace Controllers\Recisao;

use ___PHPSTORM_HELPERS\object;
use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class ControllerRecisao implements ControllerProviderInterface
{

    public function connect(Application $app)
    {
        $index = new ControllerCollection(new Route());

        /**
         * BUSCA TODOS OS CONTRATOS NO SISTEMA, PARA QUE SEJAM LISTADOS NA JANELA MODAL
         */
        $index->get('/buscaTodosContratos', function() use ($app) {
            try{
                return $app->json($app['models']->load('ModelRecisao', 'buscaTodosContratos'));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO IMÓVEL PELO NUMERO DO CONTRATO.
         */
        $index->get('/buscaDadosImovel', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelRecisao', 'buscaDadosImovel', $request->get('CODIGO_CONTRATO')));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA OS DADOS DO CONTRATO, PELO NUMERO DE CONTRATO
         */
        $index->get('/buscaDadosContrato', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelRecisao', 'buscaDadosContrato', $request->get('CODIGO_CONTRATO')));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO PROPRIETARIO PELO NUMERO DE CONTRATO
         */
        $index->get('/buscaDadosProprietario', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelRecisao', 'buscaDadosProprietario', $request->get('CODIGO_CONTRATO')));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO INQUILINO PELO NUMERO DE CONTRATO
         */
        $index->get('/buscaDadosInquilino', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelRecisao', 'buscaDadosInquilino', $request->get('CODIGO_CONTRATO')));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DOS FIADORES PELO NUMERO DO CONTRATO.
         */
        $index->get('/buscaDadosFiadores', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelRecisao', 'buscaDadosFiadores', $request->get('CODIGO_CONTRATO')));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });

        return $index;
    }
}
