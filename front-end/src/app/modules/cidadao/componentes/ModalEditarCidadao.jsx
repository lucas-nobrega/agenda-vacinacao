import React from "react";
import grupoAtendimentoService from "service/grupoAtendimentoService";
import usuarioService from "service/usuarioService";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
  CardBody,
  Row,
  Col,
  Alert,
} from "reactstrap";

class ModalEditarGrupoAtendimento extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sair: false,
      dadosAlterados: false,
      setModal: false,
      setUnmountOnClose: true,
      unmountOnClose: true,
      mensagemRetorno: "",
      aguardandoEnvio: false,
      cidadao: this.props.cidadao,
    };
  }

  editarCidadao = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.setState({ aguardandoEnvio: true });
    console.log(data.idade_minima);
    const dados = {
      nome_completo: data.get("nome_completo"),
      email: data.get("email"),
      password: data.get("password"),
      password2: data.get("password2"),
      data_nascimento: data.get("data_nascimento"),
    };
    console.log(dados.idade_minima);
    usuarioService
      .editarCidadao(dados, this.props.cidadao.user_id)
      .then((resposta) => {
        this.props.carregarCidadao();
        /* this.getNomeDoenca(this.props.doencaId); */
        this.toggle();
      });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      setModal: !this.state.modalsetModal,
    });
  };
  /* getNomeDoenca = (id) => {
        doencaService.getDoenca(id).then((resposta) => {
            this.setState({doenca: resposta.data});
        });
    } */
  styledAsteriscos = () => {
    return (
      <>
        <span style={{ color: "#FF0000" }}>*</span>
      </>
    );
  };

  componentDidMount() {
    //this.getNomeDoenca(this.props.doencaId);
  }

  render() {
    return (
      <div>
        <Form inline onSubmit={(e) => e.preventDefault()}>
          <Button
            style={{ marginRight: "5px" }}
            color="primary"
            onClick={this.toggle}
          >
            Editar
          </Button>
        </Form>
        <Modal
          size="lg"
          isOpen={this.state.modal}
          toggle={this.toggle}
          unmountOnClose={this.unmountOnClose}
        >
          <ModalHeader>Editar Cidadão</ModalHeader>
          <ModalBody>
            <div className="content">
              <CardBody>
                {
                  <Form onSubmit={(e) => this.editarGrupoAtendimento(e)}>
                    <Row xs="1" md="2" sm="2">
                      {" "}
                      {/* numero de linhas dependendo do width da tela xs= extra small */}
                      <Col className="col-xl-8">
                        <FormGroup>
                          <Label for="exampleSelect">Nome Completo</Label>
                          
                          <Input
                            name="nome_completo"
                            placeholder="Digite seu nome"
                            type="text"
                            defaultValue={this.state.cidadao.nome_completo}
                            //onBlur={(e) => this.requiredInput(e)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row xs="1" md="2" sm="2">
                      <Col className="col-xl-6">
                        <FormGroup>
                          <Label for="exampleSelect">Email</Label>
                          <Input
                            name="email"
                            placeholder="Digite seu email"
                            type="email"
                            defaultValue={this.state.cidadao.email}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row xs="1" md="2" sm="2">
                      <Col className="col-xl-6">
                        <FormGroup>
                          <Label for="exampleSelect">Data de nascimento</Label>
                          
                          <Input
                            name="data_nascimento"
                            placeholder="Insira sua data de nascimento"
                            type="date"
                            defaultValue={this.state.cidadao.data_nascimento}
                            onBlur={(e) => {
                              this.validacaoDataNascimento(e);
                              //this.requiredInput(e);
                            }}
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
                            color={this.state.tipoMensagem}
                          >
                            {this.state.mensagemRetorno}
                          </Alert>
                        )}
                      </Col>
                    </Row>
                    <ModalFooter>
                      <Button color="primary" type="submit">
                        Salvar
                      </Button>
                      <Button color="secondary" onClick={this.toggle}>
                        Cancelar
                      </Button>
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

export default ModalEditarGrupoAtendimento;
