//import medicoService from "services/medicoService";
//import cidadaoService from "services/cidadaoService";
//import acompanhamentoService from "services/acompanhamentoService";

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
            quantidadeMedicos: 0,
            quantidadeCidadaos: 0,
            quantidadeAcompanhamentos: 0,
            mensagemRetorno: "",
            aguardandoEnvio: true,
            tipoMensagem: "success",
        };
    }

    /* async carregarDashboard(){
        medicoService.getMedicosCount().then((resposta) => {
            this.setState({
                quantidadeMedicos: resposta.quantidade,
            });
        });
        acompanhamentoService.getAcompanhamentosCount().then((resposta) => {
            this.setState({
                quantidadeAcompanhamentos: resposta.quantidade,
            });
        });
        cidadaoService.getCidadaosCount().then((resposta) => {
            this.setState({
                quantidadeCidadaos: resposta.quantidade,
                aguardandoEnvio: false,
            });
        });
    }; */

    componentDidMount() {
        //this.carregarDashboard();
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
                                                <i className="nc-icon nc-single-02 text-warning" />
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category">
                                                    Cidadãos
                                                </p>
                                                <CardTitle tag="p">
                                                    {!this.state
                                                        .aguardandoEnvio &&
                                                        this.state
                                                            .quantidadeCidadaos}
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
                                                <i className="nc-icon nc-calendar-60 text-success" />
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category">
                                                    Acompanhamentos feitos
                                                </p>
                                                <CardTitle tag="p">
                                                    {!this.state
                                                        .aguardandoEnvio &&
                                                        this.state
                                                            .quantidadeAcompanhamentos}
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
                                                <i className="nc-icon nc-badge text-danger" />
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category">
                                                    Medicos
                                                </p>
                                                <CardTitle tag="p">
                                                    {!this.state
                                                        .aguardandoEnvio &&
                                                        this.state
                                                            .quantidadeMedicos}
                                                </CardTitle>
                                                <p />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                      <Col className="col-xl-9 col-lg-10 col-12 offset-xl-2 offset-lg-1 offset-lg-2 justify-content-center">
                          <Mapa></Mapa>
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
