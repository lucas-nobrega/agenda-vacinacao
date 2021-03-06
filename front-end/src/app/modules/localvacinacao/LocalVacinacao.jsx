import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import localVacinacaoService from "service/localVacinacaoService";
import ModalCadastrarLocalVacinacao from "./ModalCadastrarLocalVacinacao";
import ModalEditarLocalVacinacao from "./ModalEditarLocalVacinacao";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

// reactstrap components
import { Spinner, Card, CardBody, Row, Col, Table, Button } from "reactstrap";

const itensPaginacao = 5;
const itensPorPagina = 20;

class LocalVacinacao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locaisVacinacao: [],
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
      dropdownOpen: false,
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

  carregarLocaisVacinacao = () => {
    this.setState({ aguardandoDados: true });
    
    localVacinacaoService.getLocaisVacinacao(this.state.controlePaginacao.paginaAtual).then((resposta) => {
      this.atualizarControlePagina(this.state.controlePaginacao.paginaAtual, resposta.data.count);
      this.setState({
        locaisVacinacao: resposta.data.results,
        aguardandoDados: false,
      });
    });
  };

  atualizarPagina = (event, pagina) => {
     //@TODO atualizar rota e recarregar a página
    console.info("Pagina selecionada" + pagina);
  };

  deletarLocalVacinacao = (id) => {
    this.setState({ aguardandoDados: true });
    localVacinacaoService.deletarLocalVacinacao(id).then((resposta) => {
      if (resposta.resultado === "erro") {
        this.setState({
          mensagemRetorno: resposta.motivo,
          tipoMensagem: "danger",
        });
      } else {
        this.setState({
          mensagemRetorno: "Local deletado com sucesso",
          tipoMensagem: "success",
          aguardandoDados: false,
        });
      }
      this.carregarLocaisVacinacao();
    });
  };

  componentDidMount() {
    this.carregarLocaisVacinacao();
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col class="col">
              <Card>
                <CardBody>
                  {this.state.aguardandoDados && (
                    <div>
                      <Spinner color="primary" />
                    </div>
                  )}
                  {!this.state.aguardandoDados && (
                    <div>
                      <Table responsive>
                        <thead className="text-primary">
                          <tr>
                            <th>CNES</th>
                            <th>Nome</th>
                            <th>Cidade</th>
                            <th>Opções</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.locaisVacinacao.map((local, index) => (
                            <tr key={local.cod_cnes}>
                              <td>{local.cod_cnes}</td>
                              <td>{local.nom_estab}</td>
                              <td>{local.dsc_cidade}</td>
                              <td>
                                <Row>
                                  <ModalEditarLocalVacinacao
                                    localId={local.cod_cnes}
                                    carregarLocaisVacinacao={this.carregarLocaisVacinacao}
                                    localVacinacao={local}
                                  ></ModalEditarLocalVacinacao>
                                  <Col>
                                    <Button color="danger" onClick={() => this.deletarLocalVacinacao(local.cod_cnes)}>
                                    Excluir
                                    </Button>
                                  </Col>
                                </Row>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                        <div className="flex-center">
                          <Pagination className="flex-center">
                            <PaginationItem>
                              <PaginationLink first href="?page=1" />
                            </PaginationItem>
                            {[...Array(this.state.controlePaginacao.pageLimit)].map((page, i) => {
                              if (i >= this.state.controlePaginacao.start && i < this.state.controlePaginacao.end) {
                                return (
                                  <PaginationItem active={i === this.state.controlePaginacao.paginaAtual} key={i}>
                                    <PaginationLink onClick={(event) => this.atualizarPagina(event, i)} href={"?page="+ i}>
                                      {i}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                            })}
                            <PaginationItem>
                              <PaginationLink last href={"?page=" + parseInt(this.state.controlePaginacao.pagesCount - 1)} />
                            </PaginationItem>
                          </Pagination>
                        </div>
                    </div>
                  )}
                  <Row>
                    <Col className="col-4 offset-4">
                      <ModalCadastrarLocalVacinacao carregarLocaisVacinacao={this.carregarLocaisVacinacao}></ModalCadastrarLocalVacinacao>
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

export default withRouter(LocalVacinacao);
