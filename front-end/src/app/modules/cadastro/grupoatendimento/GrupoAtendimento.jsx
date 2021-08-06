import React from "react";
import grupoAtendimentoService from "service/grupoAtendimentoService";
import ModalCadastrarGrupoAtendimento from "./ModalCadastrarGrupoAtendimento";
import ModalEditarGrupoAtendimento from "./ModalEditarGrupoAtendimento";

// reactstrap components
import { Spinner, Card, CardBody, Row, Col, Table, Button } from "reactstrap";

class GrupoAtendimento extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gruposAtendimento: [],
      mensagemRetorno: "",
      aguardandoDados: false,
      aguardandoEnvio: false,
      tipoMensagem: "success",
      dadosCadastrados: false,
      isOpen: false,
      dropdownOpen: false,
    };
  }
  carregarGruposAtendimento = () => {
    this.setState({ aguardandoDados: true });
    grupoAtendimentoService.getGruposAtendimento().then((resposta) => {
      this.setState({ gruposAtendimento: resposta.data, aguardandoDados: false });
    });
  };
  
    deletarGrupoAtendimento = (id) => {
      this.setState({ aguardandoDados: true });
      grupoAtendimentoService.deletarGrupoAtendinento(id).then((resposta) => {
            if (resposta.resultado === "erro") {
                this.setState({
                    mensagemRetorno: resposta.motivo,
                    tipoMensagem: "danger",
                });
            } else {
                this.setState({
                    mensagemRetorno: "Grupo deletado com sucesso",
                    tipoMensagem: "success",
                    aguardandoDados: false,
                });
            }
            this.carregarGruposAtendimento();
        });
    };

  componentDidMount() {
    this.carregarGruposAtendimento();
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="offset-md-1 offset-xl-3" xl="6" md="10" xs="12">
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
                          <th>Grupo de Atendimento</th>
                          <th>Idade Mínima</th>
                          <th>Opções</th>
                        </tr>
                      </thead>

                      <tbody>
                        {this.state.gruposAtendimento.map((grupo, index) => (
                          <tr key={grupo.grupo_id}>
                            <td>{index + 1}</td>
                            <td>{grupo.nome}</td>
                            <td>{grupo.idade_minima}</td>
                            <td>
                              <Row>
                                <ModalEditarGrupoAtendimento
                                    carregarGruposAtendimento={this.carregarGruposAtendimento}
                                    grupoAtendimento={grupo} 
                                ></ModalEditarGrupoAtendimento>
                                <Col>
                                  <Button color="danger" onClick={() => this.deletarGrupoAtendimento(grupo.grupo_id)}>
                                    Deletar
                                  </Button>
                                </Col>
                              </Row>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                  <Row>
                    <Col className="col-4 offset-4">
                      <ModalCadastrarGrupoAtendimento carregarGruposAtendimento={this.carregarGruposAtendimento}></ModalCadastrarGrupoAtendimento>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default GrupoAtendimento;
