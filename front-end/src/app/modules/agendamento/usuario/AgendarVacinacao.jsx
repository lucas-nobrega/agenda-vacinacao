import React from "react";
import agendamentoVacinacaoService from "service/agendamentoVacinacaoService";
import localVacinacaoService from "service/localVacinacaoService";
import grupoAtendimentoService from "service/grupoAtendimentoService";

import { Button, ModalFooter, Input, Label, Form, FormGroup, Row, Spinner, Col, Alert, Table } from "reactstrap";

class Agendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sair: false,
      dadosAlterados: false,
      temAgendamentosNaoCancelados: false,
      agendamentos: [],
      aguardandoDados: false,
      setModal: false,
      setUnmountOnClose: true,
      unmountOnClose: true,
      mensagemRetorno: "",
      aguardandoEnvio: false,
      doenca: [],
      locaisVacinacao: [],
      gruposAtendimento: [],
      proximidade: 5,
      agendamento: agendamentoVacinacaoService.getAgendamentosVacinacao(),
    };
  }

  statusAgendamento = {
    1: "Agendado",
    2: "Cancelado",
    3: "Vacinado",
  };

  verificarAgendamentosNaoCancelados = () => {
    let temAgendamentosNaoCancelados = false;

    this.state.agendamentos.forEach(function (agendamento) {
      if (agendamento.status !== 2) temAgendamentosNaoCancelados = true;
      return;
    });

    this.setState({ temAgendamentosNaoCancelados: temAgendamentosNaoCancelados });
  };

  getStatusDescricao = (id) => {
    return this.statusAgendamento[id];
  };

  tratarCadastro = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.setState({ aguardandoEnvio: true });
    const dados_cadastrais = {
      data: data.get("data"),
      hora: data.get("hora"),
      local: data.get("local"),
      grupo_atendimento: data.get("grupo"),
      idade: data.get("idade"),
      status: "Agendado",
    };
    agendamentoVacinacaoService.cadastroAgendamentoVacinacao(dados_cadastrais).then((resposta) => {
      this.setState({ aguardandoEnvio: false });
      console.info("err" + resposta);
      if (resposta.resultado === "erro") {
        this.setState({
          mensagemRetorno: resposta.motivo,
          tipoMensagem: "danger",
        });
      } else {
        this.setState({
          mensagemRetorno: "",
          // tipoMensagem: "success",
          dadosCadastrados: true,
          aguardandoEnvio: true,
        });
        this.toggle();
      }
    });
  };

  carregarGruposAtendimento = () => {
    this.setState({ aguardandoDados: true });
    grupoAtendimentoService.getGruposAtendimento().then((resposta) => {
        console.log(resposta.data.results);
        this.setState({
            gruposAtendimento: resposta.data.results,
            aguardandoDados: false,
        });
    });
    console.log(this.state.gruposAtendimento);
  };

  carregarLocaisProximos = (latitude, longitude) => {
    this.setState({ aguardandoDados: true });
    localVacinacaoService.getLocaisVacinacaoProximos(latitude, longitude, this.state.proximidade).then((resposta) => {
      this.setState({
        locaisVacinacao: resposta.data.results,
        aguardandoDados: false,
      });
    });
  };

  recarregarLocais = (e) => {
    this.setState({ proximidade: e.target.value });
    navigator.geolocation.getCurrentPosition((position) => {
      this.carregarLocaisProximos(position.coords.latitude, position.coords.longitude);
    });
  };

  carregarAgendamentos = () => {
    this.setState({ aguardandoDados: true });
    agendamentoVacinacaoService.getAgendamentosVacinacao().then((resposta) => {
      this.setState({ agendamentos: resposta.data.results, aguardandoDados: false });
      this.verificarAgendamentosNaoCancelados();
    });
  };

  cancelarAgendamentoVacinacao() {
    this.setState({ aguardandoEnvio: true });
    agendamentoVacinacaoService.cancelarAgendamentoVacinacao(this.state.agendamento.agendamento_id).then((resposta) => {
      this.setState({ aguardandoEnvio: false });
      console.info("err" + resposta);
      if (resposta.resultado === "erro") {
        this.setState({
          mensagemRetorno: resposta.motivo,
          tipoMensagem: "danger",
        });
      } else {
        this.setState({
          mensagemRetorno: "",
          // tipoMensagem: "success",
          dadosCadastrados: true,
          aguardandoEnvio: true,
        });
        this.toggle();
      }
    });
  }

  componentDidMount() {
    this.setState({ doenca: this.props.doenca });
    this.carregarAgendamentos();
    this.carregarGruposAtendimento();
    navigator.geolocation.getCurrentPosition((position) => {
      //console.log("Latitude is :", position.coords.latitude);
      //console.log("Longitude is :", position.coords.longitude);
      this.carregarLocaisProximos(position.coords.latitude, position.coords.longitude);
    });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      setModal: !this.state.modalsetModal,
    });
  };

  render() {
    return (
      <div className="content">
         {!this.state.temAgendamentosNaoCancelados && (
        <Form onSubmit={(e) => this.tratarCadastro(e)}>
          <Row>
            <Col>
              <FormGroup>
                <Label>Data</Label>
                <Input name="data" placeholder="Digite a data" type="date" />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Hora</Label>
                <Input name="hora" placeholder="Informe a hora" type="time" />
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label>Grupo de atendimento</Label>
                <Input type="select" name="grupo" id="grupo" placeholder="Informe o grupo de atendimento">
                    {this.state.gruposAtendimento.map((grupo, index) => (
                        <option>{grupo.nome}</option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="8">
              <FormGroup>
                <Label>Local</Label>
                <Input type="select" name="locaisProximos" id="locaisProximos" placeholder="Informe o local">
                  {this.state.locaisVacinacao.map((local, index) => (
                    <option>{local.nom_estab}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Proximidade em Km</Label>
                <Input type="number" name="proximidade" id="proximidade" placeholder="Informe a quilômetragem" onChange={this.recarregarLocais} />
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
          <Row>
            <Button color="primary" type="submit">
                Adicionar
            </Button>
          </Row>
        </Form>
         )}
        <Row>
          <Col className="offset-md-1 offset-xl-3" xl="6" md="10" xs="12">
            {this.state.aguardandoDados && (
              <div>
                <Spinner color="primary" />
              </div>
            )}
            {!this.state.aguardandoDados && (
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Local</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.agendamentos.map((agendamento, index) => (
                    <tr key={agendamento.agendamento_id}>
                      <td>{index + 1}</td>
                      <td>{agendamento.data}</td>
                      <td>{agendamento.hora}</td>
                      <td>{agendamento.local_vacinacao}</td>
                      <td>{this.getStatusDescricao(agendamento.status)}</td>
                      <td>
                        <Row>
                          <Col>
                            {!(agendamento.status === 2) && (
                              <Button color="danger" onClick={() => this.cancelarAgendamentoVacinacao(agendamento.agendamento_id)}>
                                Cancelar
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Agendar;
