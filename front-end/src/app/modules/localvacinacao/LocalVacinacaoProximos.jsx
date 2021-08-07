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
      proximidade: 5,
      aguardandoDados: false,
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

    if (controlePaginacao.paginaAtual - itensPaginacaoMeio >= 1) {
      controlePaginacao.start = controlePaginacao.paginaAtual - itensPaginacaoMeio ;
    }

    if (controlePaginacao.start + controlePaginacao.pageLimit > controlePaginacao.pagesCount) {
      controlePaginacao.start = controlePaginacao.pagesCount - controlePaginacao.pageLimit + 1;
    }

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

  carregarLocaisVacinacao = (latitude, longitude) => {
    this.setState({ aguardandoDados: true });
    
    localVacinacaoService.getLocaisVacinacaoProximos(latitude, longitude, this.state.proximidade).then((resposta) => {
      this.atualizarControlePagina(this.state.controlePaginacao.paginaAtual, resposta.data.count);
      this.setState({
        locaisVacinacao: resposta.data.results,
        aguardandoDados: false,
      });
    });
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.carregarLocaisVacinacao(position.coords.latitude, position.coords.longitude);
    });
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
                    <div>
                      <Table responsive>
                        <thead className="text-primary">
                          <tr>
                            <th>CNES</th>
                            <th>Nome</th>
                            <th>Cidade</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.locaisVacinacao.map((local, index) => (
                            <tr key={local.cod_cnes}>
                              <td>{local.cod_cnes}</td>
                              <td>{local.nom_estab}</td>
                              <td>{local.dsc_cidade}</td>
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
