import React from "react";
import agendamentoVacinacaoService from "service/agendamentoVacinacaoService";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import queryString from "query-string";
// reactstrap components
import { Spinner, Card, CardBody, Row, Col, Table, Button } from "reactstrap";


const itensPaginacao = 5;
const itensPorPagina = 20;

class AgendamentoVacinacao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agendamentos: [],
      controlePaginacao: {
        paginaAtual:
          typeof queryString.parse(this.props.location.search)["page"] === "undefined" ? 1 : parseInt(queryString.parse(this.props.location.search)["page"]),
        pageLimit: itensPaginacao+1,
        start: 1,
        end: itensPaginacao,
        pagesCount: 0,
      },
      mensagemRetorno: "",
      aguardandoDados: false,
      aguardandoEnvio: false,
      tipoMensagem: "success",
      dadosCadastrados: false,
      isOpen: false,
      dropdownOpen: false
    };
  }

  atualizarControlePagina = (paginaAtual, totalItens) => {

    let controlePaginacao = this.state.controlePaginacao;
    controlePaginacao.paginaAtual = paginaAtual ;
    controlePaginacao.pagesCount = Math.ceil((totalItens / itensPorPagina) + 1);
    controlePaginacao.end = controlePaginacao.pageLimit; // ending page

    let itensPaginacaoMeio = Math.floor(itensPaginacao / 2);


    console.info("Página: " + controlePaginacao.paginaAtual + ", Total Itens: " + totalItens + " Pages count: " +controlePaginacao.pagesCount + " Pag limite: " + controlePaginacao.pageLimit);

    console.info ("itensPaginacao: " + itensPaginacao + "itensPorPagina: " + itensPorPagina);

    if (controlePaginacao.pagesCount <= controlePaginacao.pageLimit) {
      controlePaginacao.pageLimit = controlePaginacao.pagesCount;
    }

    // increment start page when current page is greater than 5
    if (controlePaginacao.paginaAtual - itensPaginacaoMeio >= 1) {
      controlePaginacao.start = controlePaginacao.paginaAtual - itensPaginacaoMeio ;
    }

    // if reaching end of pagination stop increment
    if (controlePaginacao.start + controlePaginacao.pageLimit > controlePaginacao.pagesCount) {
      controlePaginacao.start = controlePaginacao.pagesCount - controlePaginacao.pageLimit + 1;
    }

    // increment end page when current + 5 exceeds page limit
    if (controlePaginacao.paginaAtual + itensPaginacaoMeio >= controlePaginacao.pageLimit) {
      controlePaginacao.end = controlePaginacao.paginaAtual + itensPaginacaoMeio + 1;
      controlePaginacao.pageLimit = controlePaginacao.end;
      if (controlePaginacao.pagesCount <= controlePaginacao.pageLimit) {
        controlePaginacao.pageLimit = controlePaginacao.pagesCount;
      }
    }
    this.setState({
      controlePaginacao: controlePaginacao,
    });
  };






  statusAgendamento = {
    1: "Agendado",
    2: "Cancelado",
    3: "Vacinado"
  }

  carregarAgendamentosVacinacao = () => {
    this.setState({ aguardandoDados: true });
    agendamentoVacinacaoService.getAgendamentosVacinacao().then((resposta) => {     
        this.atualizarControlePagina(this.state.controlePaginacao.paginaAtual, resposta.data.count);
        this.setState({ agendamentos: resposta.data.results, aguardandoDados: false });
    });
  };

  cancelarAgendamentoVacinacao = (agendamentoId) => {
    console.info("Cancelando agendamento id: " + agendamentoId);
    /*
    agendamentoVacinacaoService.getAgendamentosVacinacao().then((resposta) => {
      this.carregarAgendamentosVacinacao();
    });
    */

  };

  getStatusDescricao = (id) => {
    return this.statusAgendamento[id];
  }

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
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.agendamentos.map((agendamento, index) => (
                        <tr key={agendamento.agendamento_id}>
                          <td>{index + 1}</td>
                          <td>{agendamento.cidadao.nome_completo}</td>
                          <td>{agendamento.idade}</td>
                          <td>{agendamento.data}</td>
                          <td>{agendamento.hora}</td>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
       
          <div className="flex-center">
            <Pagination className="flex-center">
              <PaginationItem>
                <PaginationLink first href="?page=1" />
              </PaginationItem>
              {[
                ...Array(this.state.controlePaginacao.pageLimit),
              ].map((page, i) => {
                if (
                  i >= this.state.controlePaginacao.start &&
                  i < this.state.controlePaginacao.end
                ) {
                  return (
                    <PaginationItem
                      active={
                        i ===
                        this.state.controlePaginacao.paginaAtual
                      }
                      key={i}
                    >
                      <PaginationLink
                        onClick={(event) =>
                          this.atualizarPagina(event, i)
                        }
                        href={"?page=" + i}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              })}
              <PaginationItem>
                <PaginationLink
                  last
                  href={
                    "?page=" +
                    parseInt(
                      this.state.controlePaginacao.pagesCount - 1
                    )
                  }
                />
              </PaginationItem>
            </Pagination>
          </div>
       
        </Row>
      </div>
    );
  }
}

export default AgendamentoVacinacao;