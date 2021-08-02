import React from "react";
import grupoAtendimentoService from "service/grupoAtendimentoService";
import localVacinacaoService from "service/localVacinacaoService";

import {
    Button, ModalFooter, Input, Label, Form, FormGroup,
    Row,
    Col,
    Alert,    
} from 'reactstrap';

class Agendar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            sair: false,
            dadosAlterados: false,
            setModal: false,
            setUnmountOnClose: true,
            unmountOnClose: true,
            mensagemRetorno: '',
            aguardandoEnvio: false,
            doenca: [],
            locaisVacinacao: [],
        }
    }

    tratarCadastro = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        this.setState({ aguardandoEnvio: true });
        const dados_cadastrais = {
            data: data.get("data"),
            hora: data.get("hora"),
            local: data.get("local"),
            grupo_atendimento: data.get("grupo_atendimento"),
            idade: data.get("idade"),
            status: data.get("status"),
        };
        grupoAtendimentoService.cadastroGrupoAtendinento(dados_cadastrais).then((resposta) => {
            this.setState({ aguardandoEnvio: false });
            console.info("err" + resposta)
            if (resposta.resultado === "erro") {
                this.setState({
                    mensagemRetorno: resposta.motivo,
                    tipoMensagem: "danger",
                });
            } else {
               this.props.carregarGruposAtendimento();
                this.setState({
                    mensagemRetorno: "",
                   // tipoMensagem: "success",
                    dadosCadastrados: true,
                    aguardandoEnvio: true
                });
                this.toggle();
            }
            
        });
    };

    carregarLocaisProximos = (latitude, longitude) => {
        this.setState({ aguardandoDados: true });
        localVacinacaoService.getLocaisVacinacaoProximos(latitude, longitude).then((resposta) => {
            this.setState({
                locaisVacinacao: resposta.data.results,
                aguardandoDados: false,
            });
        });
    };

    componentDidMount() {
        this.setState({doenca: this.props.doenca});
        navigator.geolocation.getCurrentPosition(position => {
            //console.log("Latitude is :", position.coords.latitude);
            //console.log("Longitude is :", position.coords.longitude);
            this.carregarLocaisProximos(position.coords.latitude, position.coords.longitude);
        });
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            setModal: !this.state.modalsetModal

        });
    }

    render() {
        return (
            <div className="content">
                <Form onSubmit={(e) => this.tratarCadastro(e)}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Data</Label>
                                <Input
                                    name="data"
                                    placeholder="Digite a data"
                                    type="date"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Hora</Label>
                                <Input
                                    name="hora"
                                    placeholder="Informe a hora"
                                    type="time"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Local</Label>

                                <Input
                                    type="select"
                                    name="locaisProximos"
                                    id="locaisProximos"
                                    placeholder="Informe o local"
                                >
                                    {this.state.locaisVacinacao.map((local, index) => (
                                        <option>{local.nom_estab}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Grupo de atendimento</Label>
                                <Input
                                    name="grupo_atendimento"
                                    placeholder="Informe o grupo de atendimento"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Idade</Label>
                                <Input
                                    name="idade"
                                    placeholder="Informe a idade"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Status</Label>
                                <Input
                                    type="select"
                                    name="status"
                                    placeholder="Informe o status"
                                >
                                    <option>Agendado</option>
                                    <option>Cancelado</option>
                                    <option>Vacinado</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.state.mensagemRetorno !== "" && (
                                <Alert
                                    toggle={() => {
                                        this.setState({ mensagemRetorno: "" });
                                    }}
                                    color={
                                        this.state.tipoMensagem
                                    }
                                >
                                    {this.state.mensagemRetorno}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <ModalFooter>
                            <Button color="primary" type="submit" >Adicionar</Button>
                            <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Agendar;