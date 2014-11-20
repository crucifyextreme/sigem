<?php

class ModelVistoria
{

    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }

    public  function buscaContrato($contrato)
    {
        $statement = $this->app["db"]->fetchAssoc('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO,
        c_v_cliente_completa.NOME, c_v_cliente_completa.DDD, c_v_cliente_completa.RESIDENCIAL,
        c_v_cliente_completa.CELULAR, c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.E_MAIL
        FROM c_v_inquilinos_contratos_todos
        INNER JOIN c_v_imoveis_completo ON
        c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
        INNER JOIN c_v_proprietarios_contratos_todos ON
        c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_proprietarios_contratos_todos.IMOVEL_ID
        INNER JOIN c_v_cliente_completa ON c_v_proprietarios_contratos_todos.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
        WHERE c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = ?',  array($contrato->CODIGO_CONTRATO));

        return $statement;
    }

    public function save($data)
    {
        return $this->app['db']->insert('vistorias', get_object_vars($data));
    }

    /**
     * Busca vistoria pelo ID
     */
    public function findVistory($idVistoria)
    {
        return $this->app["db"]->fetchAssoc('SELECT * FROM vistorias WHERE ID_VISTORIA = ?', array($idVistoria->ID_VISTORIA));
    }

    public function saveEditVistory($dataVistory)
    {

        $statement = $this->app['db']->executeUpdate('UPDATE vistorias SET PRIORIDADE = ?, VISTORIADOR = ?, HORARIO = ?, DATA_VISTORIA = ?, TIPO_VISTORIA = ?, SOLICITANTE = ?, TEL_RESIDENCIAL_SOLICITANTE = ?,
                                                      TEL_COMERCIAL_SOLICITANTE = ?, EMAIL_SOLICITANTE = ?, SOLICITACAO = ? WHERE ID_VISTORIA = ?',array($dataVistory->PRIORIDADE,$dataVistory->VISTORIADOR,
        $dataVistory->HORARIO, $dataVistory->DATA_VISTORIA, $dataVistory->TIPO_VISTORIA, $dataVistory->SOLICITANTE, $dataVistory->TEL_RESIDENCIAL_SOLICITANTE, $dataVistory->TEL_COMERCIAL_SOLICITANTE,
        $dataVistory->EMAIL_SOLICITANTE, $dataVistory->SOLICITACAO, $dataVistory->ID_VISTORIA));
        return $statement;
    }

    /* Busca todas as vistorias abertas */
    public function findAllOpen()
    {
        return $this->app["db"]->fetchAll('SELECT ID_VISTORIA, CODIGO_CONTRATO,CODIGO,CODIGO, PRIORIDADE, VISTORIADOR, DATA_VISTORIA, HORARIO, TIPO_VISTORIA,STATUS FROM vistorias WHERE status = "aberta"');
    }

    /* Busca todas as vistorias */
    public function findAll()
    {
        return $this->app["db"]->fetchAll('SELECT ID_VISTORIA, CODIGO_CONTRATO,CODIGO,CODIGO, PRIORIDADE, VISTORIADOR, DATA_VISTORIA, HORARIO, TIPO_VISTORIA,STATUS FROM vistorias');
    }

    /**
     * Metodo de acoes responsavel pelo CANCELAMENTO E/OU FINALIZAÇÃO.
     */
    public function acoes($data)
    {
        $stmt = $this->app['db']->prepare('UPDATE vistorias SET status = ?, RP_FECHAMENTO = ?, DATA_FECHAMENTO = ?, RP_CANCELAMENTO = ?, DATA_CANCELAMENTO = ? WHERE id_vistoria = ?');
        $stmt->bindValue(1, $data['action']);
        $stmt->bindValue(2, $data['RP_FECHAMENTO'] );
        $stmt->bindValue(3, $data['DATA_FECHAMENTO'] );
        $stmt->bindValue(4, $data['RP_CANCELAMENTO'] );
        $stmt->bindValue(5, $data['DATA_CANCELAMENTO'] );
        $stmt->bindValue(6, $data['id'] );
        $stmt->execute();
        return $stmt;
    }

    public function consultaLaudo($idVistoria)
    {
        /* Consulta para montagem do laudo de vistoria */
        return $this->app["db"]->fetchAssoc('SELECT vistorias.*, c_v_inquilinos_contratos_todos.NOME_CLIENTE FROM vistorias
        INNER JOIN c_v_inquilinos_contratos_todos ON
        c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = vistorias.CODIGO_CONTRATO
        WHERE vistorias.ID_VISTORIA = ?',  array($idVistoria->ID_VISTORIA));
    }

    /**
     * Selecionar a agenda do vistoriador
     */
    public function consultaAgenda($data)
    {
        return $this->app["db"]->fetchAll('SELECT vistorias.*, c_v_imoveis_completo.IMOVEL_ID, c_v_vistoria.TEXTO FROM vistorias
        LEFT JOIN c_v_imoveis_completo ON c_v_imoveis_completo.CODIGO = vistorias.CODIGO
        LEFT JOIN c_v_vistoria ON c_v_vistoria.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
        WHERE VISTORIADOR = ? AND STATUS = ? AND DATA_VISTORIA BETWEEN ? AND ?', array($data->vistoriador,'aberta', $data->dataInicial, $data->dataFinal));
    }

    public function finalizaVistoriaBancada($data)
    {

        foreach($data as $dados) {
            $statement = $this->app['db']->executeUpdate('UPDATE vistorias SET STATUS = ?, RP_FECHAMENTO = ?, DATA_FECHAMENTO = ? WHERE ID_VISTORIA = ? ', array($dados->action, $dados->RP_FECHAMENTO, $dados->DATA_FECHAMENTO, $dados->id));
        }
        return $statement;
    }



} 