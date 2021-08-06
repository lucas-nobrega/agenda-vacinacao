import agendamentoVacinacaoService from "service/agendamentoVacinacaoService";

import Mapa from "./Mapa";
import VerticalBar from "./../../estatisticas/componentes/VerticalBar";

import React from "react";
// reactstrap components
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

class PaginaInicial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quantidadeVacinados: 0,
            quantidadeAgendados: 0,
            quantidadeCancelados: 0,
            mensagemRetorno: "",
            aguardandoEnvio: true,
            tipoMensagem: "success",
        };
    }

   

     async carregarDashboard(){
         var countVacinado=0, countAgendado=0, countCancelado=0;
        agendamentoVacinacaoService.getAgendamentosVacinacao().then((resposta) => {
            console.log(resposta)
            for (let i = 0; i < resposta.data.results.length; i++) {                
                switch (resposta.data.results[i].status) {
                    case 1:
                        countAgendado++;
                      break;
                    case 2:
                        countCancelado++;
                      break;
                    case 3:
                        countVacinado++;
                      break;    
                  }
              }
            this.setState({
                aguardandoEnvio: false,
                quantidadeVacinados: countVacinado,
                quantidadeAgendados: countAgendado,
                quantidadeCancelados: countCancelado
            });
        });       
    }; 

    componentDidMount() {
        this.carregarDashboard();
    }

  
    render() {
        return (
            <>
                <div className="content">
                    <Row xs="1" md="2" sm="2">
                        <Col className="col-xl-4">
                            <Card className="card-stats">
                                <CardBody>
                                    <Row>
                                        <Col md="4" xs="5">
                                            <div className="icon-big text-center icon-warning">
                                                <i className="nc-icon nc-calendar-60 text-success" />
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category">
                                                    Quantidade de vacinados
                                                </p>
                                                <CardTitle tag="p">
                                                    {!this.state
                                                        .aguardandoEnvio &&
                                                        this.state
                                                            .quantidadeVacinados}
                                                </CardTitle>
                                                <p />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-xl-4">
                            <Card className="card-stats">
                                <CardBody>
                                    <Row>
                                        <Col md="4" xs="5">
                                            <div className="icon-big text-center icon-warning">
                                                <i className="nc-icon nc-calendar-60 text-primary" />
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category">
                                                    Agendamentos feitos
                                                </p>
                                                <CardTitle tag="p">
                                                    {!this.state
                                                        .aguardandoEnvio &&
                                                        this.state
                                                            .quantidadeAgendados}
                                                </CardTitle>
                                                <p />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-xl-4">
                            <Card className="card-stats">
                                <CardBody>
                                    <Row>
                                        <Col md="4" xs="5">
                                            <div className="icon-big text-center icon-danger">
                                                <i className="nc-icon nc-simple-remove text-danger" />
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category">
                                                    Agendamentos cancelados
                                                </p>
                                                <CardTitle tag="p">
                                                    {!this.state
                                                        .aguardandoEnvio &&
                                                        this.state
                                                            .quantidadeCancelados}
                                                </CardTitle>
                                                <p />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    
                    <hr/>
                    {/*
                    <Row>
                        <p className="mx-auto">Doenças com maior quantidade de cidadãos</p>
                    </Row>
                    <Row>
                        <Col className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1 col-md-10 offset-md-1">
                                    <VerticalBar></VerticalBar>
                        </Col>
                    </Row>
                    */}
                </div>
            </>
        );
    }
}

export default PaginaInicial;
