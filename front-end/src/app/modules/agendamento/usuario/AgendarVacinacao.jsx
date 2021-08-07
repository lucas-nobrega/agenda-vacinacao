import React from "react";
import agendamentoVacinacaoService from "service/agendamentoVacinacaoService";
import localVacinacaoService from "service/localVacinacaoService";
import grupoAtendimentoService from "service/grupoAtendimentoService";
import usuarioService from "service/usuarioService";
import { Button, Input, Label, Form, FormGroup, Row, Spinner, Col, Alert, Table } from "reactstrap";

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
      tipoMensagem: "",
      aguardandoEnvio: false,
      doenca: [],
      locaisVacinacao: [],
      gruposAtendimento: [],
      proximidade: 5,
      agendamento: agendamentoVacinacaoService.getAgendamentosVacinacao(),
      cidadaoID: "",
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
      if (agendamento.status !== 2 && agendamento.status !== 3) temAgendamentosNaoCancelados = true;
      return;
    });

    this.setState({ temAgendamentosNaoCancelados: temAgendamentosNaoCancelados });
  };

  getStatusDescricao = (id) => {
    return this.statusAgendamento[id];
  };

  fecharMensagem = () => {
    this.setState({
      mensagemRetorno: "",
      tipoMensagem: "",
    });
  };

  tratarCadastro = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.setState({ aguardandoEnvio: true });
    console.log(this.state.cidadaoID);
    const dados_cadastrais = {
      status: 1,
      data: data.get("data"),
      hora: data.get("hora"),
      grupo_atendimento: data.get("grupo"),
      local_vacinacao: data.get("local"),
      cidadao: this.state.cidadaoID,
      idade: 22,
    };

    if (this.verificarDataAgendamentoMenor(dados_cadastrais.data)) {
      console.info("Data de agendamento menor que a data atual");
      this.setState({
        mensagemRetorno: "A data de agendamento tem que ser maior que a data atual",
        tipoMensagem: "danger",
      });
      return;
    }
    agendamentoVacinacaoService.cadastroAgendamentoVacinacao(dados_cadastrais).then((resposta) => {
      this.setState({ aguardandoEnvio: false });
      console.info( resposta);
      if (resposta.resultado === "erro") {
        this.setState({
          mensagemRetorno: resposta.motivo.erro,
          tipoMensagem: "danger",
        });
      } else {
        this.setState({
          mensagemRetorno: "Agendamento cadastrado com sucesso!",
          tipoMensagem: "success",
          dadosCadastrados: true,
          aguardandoEnvio: true,
        });
        this.carregarAgendamentos();
      }
    });
  };

  carregarGruposAtendimento = () => {
    this.setState({ aguardandoDados: true });
    grupoAtendimentoService.getGruposAtendimento().then((resposta) => {
      this.setState({
        gruposAtendimento: resposta.data,
        aguardandoDados: false,
      });
    });
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
      this.setState({
        agendamentos: resposta.data.results,
        aguardandoDados: false,
      });
      this.verificarAgendamentosNaoCancelados();
    });
  };

  cancelarAgendamentoVacinacao(agendamento_id) {
    this.setState({ aguardandoEnvio: true });
    agendamentoVacinacaoService.cancelarAgendamentoVacinacao(agendamento_id).then((resposta) => {
      this.setState({ aguardandoEnvio: false });
      console.info("err" + resposta);
      if (resposta.resultado === "erro") {
        // this.setState({
        //   mensagemRetorno: resposta.motivo,
        //   tipoMensagem: "danger",
        //  });
      } else {
        this.setState({
          mensagemRetorno: "",
          // tipoMensagem: "success",
          dadosCadastrados: true,
          aguardandoEnvio: true,
        });
        this.carregarAgendamentos();
      }
    });
  }

  carregarUsuario = () => {
    this.setState({ aguardandoDados: true });
    usuarioService.verLogin().then((resposta) => {
      //console.log(resposta.data.cidadao_id);
      this.setState({
        cidadaoID: resposta.data.cidadao_id,
        aguardandoDados: false,
      });
    });
  };

  verificarDataAgendamentoMenor = (data) => {
    return new Date(data) <= new Date();
  };

  componentDidMount() {
    this.setState({ doenca: this.props.doenca });
    this.carregarAgendamentos();
    this.carregarGruposAtendimento();
    this.carregarUsuario();
    navigator.geolocation.getCurrentPosition((position) => {
      //console.log("Latitude is :", position.coords.latitude);
      //console.log("Longitude is :", position.coords.longitude);
      this.carregarLocaisProximos(position.coords.latitude, position.coords.longitude);
    });
  }

  render() {
    return (
      <div className="content">
        {!this.state.temAgendamentosNaoCancelados && (
          <Form onSubmit={(e) => this.tratarCadastro(e)}>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <Label>Grupo de atendimento</Label>
                  <Input type="select" name="grupo" id="grupo" placeholder="Informe o grupo de atendimento">
                    {this.state.gruposAtendimento.map((grupo, index) => (
                      <option key={"grupo-" + grupo.grupo_id} value={grupo.grupo_id}>
                        {grupo.nome} - Acima de {grupo.idade_minima} anos
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Data</Label>
                  <Input name="data" id="date" placeholder="Digite a data" type="date" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Hora</Label>
                  <Input name="hora" id="hora" placeholder="Informe a hora" type="time" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Proximidade em Km</Label>
                  <Input
                    type="number"
                    name="proximidade"
                    id="proximidade"
                    defaultValue={this.state.proximidade}
                    placeholder="Informe a quilômetragem"
                    onChange={this.recarregarLocais}
                  />
                </FormGroup>
              </Col>
              <Col sm="8">
                <FormGroup>
                  <Label>Locais próximos ({this.state.proximidade}km)</Label>
                  <Input type="select" name="local" id="local" placeholder="Informe o local">
                    {this.state.locaisVacinacao.map((local, index) => (
                      <option key={local.cod_cnes} value={local.cod_cnes}>
                        {local.nom_estab}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
               <Col>
              <Button color="primary" type="submit">
                Adicionar
              </Button>
              </Col>
            </Row>
          </Form>
        )}
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
        <br />
        <br />
        <h4>Agendamentos já realizados:</h4>
        <hr />
        <Row>
          <Col>
            {this.state.aguardandoDados && (
              <div>
                <Spinner color="primary" />
              </div>
            )}
            {!this.state.aguardandoDados && (
              <Table responsive size="sm">
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
                      <td>{agendamento.local_vacinacao.nom_estab}</td>
                      <td>{this.getStatusDescricao(agendamento.status)}</td>
                      <td>
                        <Row>
                          <Col>
                            {!(agendamento.status === 2 || agendamento.status === 3) && (
                              <Button
                                key={"cancelar_" + agendamento.agendamento_id}
                                color="danger"
                                onClick={() => this.cancelarAgendamentoVacinacao(agendamento.agendamento_id)}
                              >
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
