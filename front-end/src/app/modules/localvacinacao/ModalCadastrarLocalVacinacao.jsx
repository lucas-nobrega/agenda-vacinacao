import React from "react";
import localVacinacaoService from "service/localVacinacaoService";

import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup,
    CardBody,
    Row,
    Col,
    Alert,    
} from 'reactstrap';

class ModalCadastrarLocalVacinacao extends React.Component {
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
        }
    }
    tratarCadastro = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        this.setState({ aguardandoEnvio: true });
        const dados_cadastrais = {
            vlr_latitude: data.get("latitude"),
            vlr_longitude: data.get("longitude"),
            cod_munic: data.get("municipio"),
            cod_cnes: data.get("cnes"),
            nom_estab: data.get("estabelecimento"),
            dsc_endereco: data.get("endereco"),
            dsc_bairro: data.get("bairro"),
            dsc_cidade: data.get("cidade"),
        };
        localVacinacaoService.cadastroLocalVacinacao(dados_cadastrais).then((resposta) => {
            this.setState({ aguardandoEnvio: false });
            console.info("err" + resposta)
            if (resposta.resultado === "erro") {
                this.setState({
                    mensagemRetorno: resposta.motivo,
                    tipoMensagem: "danger",
                });
            } else {
               this.props.carregarLocaisVacinacao();
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

    componentDidMount() {
        //this.setState({doenca: this.props.doenca});
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            setModal: !this.state.modalsetModal

        });
    }

    render() {
        return (
            <div>
                <Form inline onSubmit={(e) => e.preventDefault()}>
                    <Button style={{ marginRight: '5px' }} color="primary" onClick={this.toggle}>Adicionar Local</Button>
                </Form>
                <Modal size="" isOpen={this.state.modal} toggle={this.toggle} unmountOnClose={this.unmountOnClose}>
                    <ModalHeader>Adicionar Local de Vacinação</ModalHeader>
                    <ModalBody>
                        <div className="content">
                            <CardBody>
                                {
                                    <Form onSubmit={(e) => this.tratarCadastro(e)}>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Latitude</Label>
                                                    <Input
                                                        name="latitude"
                                                        placeholder="Informe a latitude"
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Longitude</Label>
                                                    <Input
                                                        name="longitude"
                                                        placeholder="Informe a longitude"
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Municipio</Label>
                                                    <Input
                                                        name="municipio"
                                                        placeholder="Informe o codigo do municipio"
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">CNES</Label>
                                                    <Input
                                                        name="cnes"
                                                        placeholder="Informe o cnes"
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Nome</Label>
                                                    <Input
                                                        name="estabelecimento"
                                                        placeholder="Informe o nome do local"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Endereço</Label>
                                                    <Input
                                                        name="endereco"
                                                        placeholder="Informe o endereço do local"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Bairro</Label>
                                                    <Input
                                                        name="bairro"
                                                        placeholder="Informe o bairro do local"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Cidade</Label>
                                                    <Input
                                                        name="cidade"
                                                        placeholder="Informe a cidade do local"
                                                        type="text"
                                                    />
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
                                }
                            </CardBody>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default ModalCadastrarLocalVacinacao;