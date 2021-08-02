import React from "react";
import agendamentoVacinacaoService from "service/agendamentoVacinacaoService";

// reactstrap components
import { Spinner, Card, CardBody, Row, Col, Table, Button } from "reactstrap";

class AgendamentoVacinacao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gruposAgendamento: [],
      mensagemRetorno: "",
      aguardandoDados: false,
      aguardandoEnvio: false,
      tipoMensagem: "success",
      dadosCadastrados: false,
      isOpen: false,
      dropdownOpen: false,
    };
  }

  carregarAgendamentosVacinacao = () => {
    this.setState({ aguardandoDados: true });
    agendamentoVacinacaoService.getAgendamentosVacinacao().then((resposta) => {
      this.setState({ gruposAtendimento: resposta.data, aguardandoDados: false });
    });
  };

  cancelarAgendamentoVacinacao = (agendamentoId) => {
    console.info("Cancelando agendamento id: " + agendamentoId);
  };

  componentDidMount() {
    this.carregarAgendamentosVacinacao();
  }

  render() {
    return (
	
<div className="content">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
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
                          <th>Nome</th>
                          <th>Idade</th>
                          <th>Data</th>
                          <th>Hora</th>
                        </tr>
                      </thead>

                      <tbody>
                        {this.state.gruposAgendamento.map((grupo, index) => (
                          <tr key={grupo.grupo_id}>
                            <td>{index + 1}</td>
                            <td>{grupo.nome}</td>
                            <td>{grupo.idade}</td>
                            <td>{grupo.data}</td>
                            <td>{grupo.hora}</td>
                            <td>
                              <Row>
                                <Col>
                                  <Button color="danger" onClick={() => this.cancelarAgendamentoVacinacao(grupo.grupo_id)}>
                                    Cancelar
                                  </Button>
                                </Col>
                              </Row>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default AgendamentoVacinacao;