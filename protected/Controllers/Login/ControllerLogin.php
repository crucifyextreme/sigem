<?php

namespace Controllers\Login;

use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class ControllerLogin implements ControllerProviderInterface {

    public function connect(Application $app) {
        $index = new ControllerCollection(new Route());
        /**
         * Verifica os dados do login passado pelo usuário
         * Rota: @login/efetuarLogin
         */
        $index->post('/efetuarLogin', function( Request $request) use ($app){

            $request = $app['request'];

            $data = json_decode($request->getContent());
            try{
                $user = $app['models']->load('ModelLogin', 'findDataLogin', $data);
                if($user != null) {
                    $app['session']->set('nome', array('nome' => $user['nome']));
                    $sessao = $app['session']->get('nome');
                    return $app->json(['nome' => $sessao['nome']]);
                    //return $app->json(['retorno' => "login ok"]);
                }
                return $app->json(['retorno' => 'usuario nao cadastrado']);
            } catch(\Exception $e) {
                return $e->getMessage();//$app->json(['error' => 500]);
            }
        });
        /**
         * Verifica se o usuario esta logado no sistema
         * Rota: @login/verificaLogin
         */
        $index->get('/verificaLogin', function() use ($app) {
            $session =  $app['session']->get('nome');
            if( $session['nome'] != null) {
                return $app->json(['retorno' => 'logado']);
            }
                return $app->json(['retorno' => 'nao logado']);
        });
        /**
         * Rota de logout no sistema
         * Rota: @login/logout
         */
        $index->get('/logout', function() use($app) {
            try {
                $app['session']->clear();
                return $app->json(['retorno' => 'nao logado']);
            } catch(\Exception $e) {
                return $app->json(['retorno' => 'erro ao efetuar logout']);
            }
        });

        return $index;
    }
}