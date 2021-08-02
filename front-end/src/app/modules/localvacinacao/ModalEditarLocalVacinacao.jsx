import React from "react";
import localVacinacaoService from "service/localVacinacaoService";

import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup,
    CardBody,
    Row,
    Col,
    Alert,    
} from 'reactstrap';

class ModalEditarLocalVacinacao extends React.Component {

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
            localVacinacao: this.props.localVacinacao,
        }
    }

    editarLocalVacinacao = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        this.setState({ aguardandoEnvio: true});
        console.log(data.idade_minima)
        const dados = {
            nome: data.get("nome"),
            idade_minima: data.get("idade_minima"),
        };
        console.log(dados.idade_minima)
        localVacinacaoService.editarLocalVacinacao(dados, this.props.localVacinacao.grupo_id).then((resposta) => {
            this.props.carregarGruposAtendimento();
            /* this.getNomeDoenca(this.props.doencaId); */
            this.toggle();
        });
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            setModal: !this.state.modalsetModal
        });
    }
    /* getNomeDoenca = (id) => {
        doencaService.getDoenca(id).then((resposta) => {
            this.setState({doenca: resposta.data});
        });
    } */

    componentDidMount() {
        //this.getNomeDoenca(this.props.doencaId);
    }

    render() {
        return (
            <div>
                <Form inline onSubmit={(e) => e.preventDefault()}>
                    <Button style={{ marginRight: '5px' }} color="primary" onClick={this.toggle}>Editar</Button>
                </Form>
                <Modal size="sm" isOpen={this.state.modal} toggle={this.toggle} unmountOnClose={this.unmountOnClose}>
                    <ModalHeader>Editar Grupo de Atendimento</ModalHeader>
                    <ModalBody>
                        <div className="content">
                            <CardBody>
                                {
                                    <Form onSubmit={(e) => this.editarlocalVacinacao(e)}>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="exampleSelect">Nome do Grupo de Atendimento</Label>
                                                    <Input
                                                        name="nome"
                                                        placeholder="Digite o nome do grupo"
                                                        type="text"
                                                        defaultValue={this.state.localVacinacao.nome}
                                                    />
                                                    <Label for="exampleSelect">Idade Mínima do Grupo de Atendimento</Label>
                                                    <Input
                                                        name="idade_minima"
                                                        placeholder="Digite a idade mínima do grupo"
                                                        type="text"
                                                        defaultValue={this.state.localVacinacao.idade_minima}
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
                                            <ModalFooter>
                                                <Button color="primary" type="submit" >Salvar</Button>
                                                <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                                            </ModalFooter>
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

export default ModalEditarLocalVacinacao;