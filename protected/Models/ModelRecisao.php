<?php

class ModelRecisao
{
    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }
    public function buscaDadosContrato($contrato)
    {

    }
    /**
     * BUSCA DADOS DO PROPRIETARIO PELO NUMERO DE CONTRATO
     */
    public function buscaDadosProprietario($contrato)
    {
        return $this->app['db']->fetchAll('SELECT c_v_cliente_completa.NOME, c_v_cliente_completa.CIC_CGC, c_v_cliente_completa.RESIDENCIAL,
                                           c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.CELULAR
                                           FROM c_v_proprietarios_contratos_todos
                                           LEFT JOIN c_v_cliente_completa ON c_v_proprietarios_contratos_todos.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
                                           WHERE c_v_proprietarios_contratos_todos.CODIGO_CONTRATO = ?', array($contrato));
    }
    /**
     * BUSCA DADOS DO INQUILINO PELO NUMERO DE CONTRATO
     */
    public function buscaDadosInquilino($contrato)
    {
        return $this->app['db']->fetchAll('SELECT c_v_cliente_completa.NOME, c_v_cliente_completa.CIC_CGC, c_v_cliente_completa.RESIDENCIAL,
                                           c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.CELULAR
                                           FROM c_v_inquilinos_contratos_todos
                                           LEFT JOIN c_v_cliente_completa ON c_v_inquilinos_contratos_todos.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
                                           WHERE c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = ?', array($contrato));
    }
    /**
     * BUSCA DADOS DOS FIADORES PELO NUMERO DE CONTRATO
     */
    public function buscaDadosFiadores($contrato)
    {
        return $this->app['db']->fetchAll('SELECT c_v_cliente_completa.NOME, c_v_cliente_completa.CIC_CGC, c_v_cliente_completa.RESIDENCIAL,
                                           c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.CELULAR
                                           FROM v_cliente_inquilino_e_fiador
                                           LEFT JOIN c_v_cliente_completa ON v_cliente_inquilino_e_fiador.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
                                           WHERE v_cliente_inquilino_e_fiador.CODIGO_CONTRATO = ? AND v_cliente_inquilino_e_fiador.TIPO_CLIENTE_CONTRATO = ?', array($contrato, 'F'));
    }
    public function buscaDadosImovel($contrato)
    {
        return $this->app['db']->fetchAssoc('SELECT c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO, c_v_imoveis_completo.CEP
                                           FROM c_v_inquilinos_contratos_todos
                                           RIGHT JOIN c_v_imoveis_completo ON c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
                                           WHERE c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = ?', array($contrato));
    }
} 