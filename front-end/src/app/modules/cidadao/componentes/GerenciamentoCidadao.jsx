import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import cidadaoService from "service/cidadaoService";
//import usuarioService from "service/usuarioService";
//import ModalCadastrarLocalVacinacao from "./ModalCadastrarLocalVacinacao";
import ModalEditarCidadao from "./ModalEditarCidadao";
import queryString from "query-string";

// reactstrap components
import { Spinner, Card, CardBody, Row, Col, Table, Button } from "reactstrap";

const itensPaginacao = 5;
const itensPorPagina = 20;

class GerenciamentoCidadao extends React.Component {
  constructor(props) {
    super(props);
    this.appRelativePath = "/agenda"
    this.state = {
      cidadaos: [],
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

  carregarCidadaos = () => {
    this.setState({ aguardandoDados: true });
    
    cidadaoService.getCidadaos(this.state.controlePaginacao.paginaAtual).then((resposta) => {
      this.atualizarControlePagina(this.state.controlePaginacao.paginaAtual, resposta.data.count);
      this.setState({
        cidadaos: resposta.data.results,
        aguardandoDados: false,
      });
    });
  };

  atualizarPagina = (event, pagina) => {
     //@TODO atualizar rota e recarregar a página
    console.info("Pagina selecionada" + pagina);
  };

  deletarCidadao = (id) => {
    this.setState({ aguardandoDados: true });
    cidadaoService.deletarCidadao(id).then((resposta) => {
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
      this.carregarCidadaos();
    });
  };

  componentDidMount() {
    this.carregarCidadaos();
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
                            <th></th>
                            <th>Nome Completo</th>
                            <th>Data de Nascimento</th>
                            <th>Opções</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.cidadaos.map((cidadao, index) => (
                            <tr key={cidadao.cidadao_id}>
                              <td>{index + 1}</td>
                              <td>{cidadao.nome_completo}</td>
                              <td>{cidadao.data_nascimento}</td>
                              <td>
                                <Row>
                                  <ModalEditarCidadao
                                    cidadaoId={cidadao.cidadao_id}
                                    carregarCidadaos={this.carregarCidadaos}
                                    cidadao={cidadao}
                                  ></ModalEditarCidadao>
                                  <Col >
                                    <Button
                                      color="danger"
                                      onClick={
                                        () => {console.log(cidadao);
                                          this.deletarCidadao( 
                                            cidadao.cidadao_id
                                          ) }
                                      }
                                    >
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

export default withRouter(GerenciamentoCidadao);
