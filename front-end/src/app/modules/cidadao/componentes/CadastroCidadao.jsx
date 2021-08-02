import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//import usuarioService from "services/usuarioService";
import cidadaoService from "../../../../service/cidadaoService";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Alert,
    Label,
} from "reactstrap";

class CadastroCidadao extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mensagemRetorno: "",
            aguardandoEnvio: false,
            tipoMensagem: "success",
            data_nascimento: "",
            isDataConfirmada: true,
            isSenhaConfirmada: true,
            dadosCadastrados: false,
            documentId: '',
        };
        this.handlechange = this.handlechange.bind(this)
    }

    tratarCadastro = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        //console.log(data.get("cpf"));
        this.setState({aguardandoEnvio : true});
        const dados_cadastrais = {
            nome: data.get("nome"),
            email: data.get("email"),
            email_verified_at: "2021-07-27 12:52:11", // Colocar a data
            password: data.get("password"),
            data_nascimento: data.get("data_nascimento")
        };

        cidadaoService.cadastroCidadao(dados_cadastrais).then((resposta) => {
            this.setState({aguardandoEnvio : false});
            if (resposta.resultado === "erro") {
                this.setState({
                    mensagemRetorno: resposta.motivo,
                    tipoMensagem: "danger",
                });
            } else {
                this.setState({
                    mensagemRetorno: "Cidadão cadastrado com sucesso",
                    tipoMensagem: "success",
                    dadosCadastrados: true,
                });
            }
        });
    };

    confirmacaoSenha = (event) => {
        let senhaConfirmada = event.target.value;
        if (senhaConfirmada !== "" && senhaConfirmada !== this.state.senha) {
            this.setState({isSenhaConfirmada: false, mensagemRetorno: "As senhas estão diferentes", tipoMensagem: "danger"});
            event.currentTarget.style.border = "1px solid #fc2b2b";
        } else {
            event.currentTarget.style.border = "1px solid #DDDDDD";
            this.setState({isSenhaConfirmada: true, mensagemRetorno: "", tipoMensagem: "danger"});
        }
    };
    

    validacaoDataNascimento = (event) => {
        let data_nascimento = event.target.value;
        let hoje = new Date().toISOString();
        //hoje = this.formatDate(hoje);
        hoje = new Date(hoje);
        data_nascimento = new Date(data_nascimento);
        console.log(data_nascimento);
        console.log(hoje);
        if(this.data_nascimento === "" || data_nascimento.getTime() > hoje.getTime()){
            this.setState({isDataConfirmada: false, mensagemRetorno: "A data de nascimento está incorreta", tipoMensagem: "danger"});
            event.currentTarget.style.border = "1px solid #fc2b2b";
        } else {
            event.currentTarget.style.border = "1px solid #DDDDDD";
            this.setState({isDataConfirmada: true, mensagemRetorno: "", tipoMensagem: "danger"});
        }
    };

    requiredInput = (event) => {
        console.log(event.target.value);
        if(event.target.value === "" || event.target.value === 0){
            event.currentTarget.style.border = "1px solid #fc2b2b";
            this.setState({mensagemRetorno: "Campos obrigatórios não podem estar vazios", tipoMensagem: "danger"});
        }else{
            event.currentTarget.style.border = "1px solid #DDDDDD";
        }
    }

    styledAsteriscos = () => {
        return <><span style={{color: "#FF0000"}}>*</span></>
    }

    componentDidMount() {
    }
    render() {
        return (
            <div className="content">
                <Row>
                    <Col className="col-sm-12 col-md-10 offset-md-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center" tag="h4">
                                    Cadastro de Cidadão
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {
                                    <Form
                                        onSubmit={(e) => this.tratarCadastro(e)}
                                    >
                                        <Row xs="1" md="2" sm="2">
                                            {" "}
                                            {/* numero de linhas dependendo do width da tela xs= extra small */}
                                            <Col className="col-xl-8">
                                                <FormGroup>
                                                    <Label for="exampleSelect">
                                                        Nome Completo
                                                    </Label>{this.styledAsteriscos()}
                                                    <Input
                                                        name="nome"
                                                        placeholder="Digite seu nome"
                                                        type="text"
                                                        onBlur={(e) => this.requiredInput(e)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row xs="1" md="2" sm="2">
                                            <Col className="col-xl-6">
                                                <FormGroup>
                                                    <Label for="exampleSelect">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        name="email"
                                                        placeholder="Digite seu email"
                                                        type="email"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row xs="1" md="2" sm="2">
                                            <Col className="col-xl-6">
                                                <FormGroup>
                                                    <Label for="exampleSelect">
                                                        Senha
                                                    </Label>{this.styledAsteriscos()}
                                                    <Input
                                                        name="password"
                                                        placeholder="Digite sua senha"
                                                        type="password"
                                                        onBlur={(e) => {(this.setState({senha: e.target.value})); this.requiredInput(e)}}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="col-xl-6">
                                                <FormGroup>
                                                    <Label for="exampleSelect">
                                                        Confirmação de Senha
                                                    </Label>{this.styledAsteriscos()}
                                                    <Input
                                                        name="password"
                                                        placeholder="Confirme sua senha"
                                                        type="password"
                                                        id="senha"
                                                        onBlur={(e) =>{
                                                            this.confirmacaoSenha(
                                                                e
                                                            );
                                                            this.requiredInput(e);
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row xs="1" md="2" sm="2">
                                            <Col className="col-xl-6">
                                                <FormGroup>
                                                    <Label for="exampleSelect">
                                                        Data de nascimento
                                                    </Label>{this.styledAsteriscos()}
                                                    <Input
                                                        name="data_nascimento"
                                                        placeholder="Insira sua data de nascimento"
                                                        type="date"
                                                        onBlur={(e) => {(this.validacaoDataNascimento(e)); this.requiredInput(e)}}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            
                                        </Row>
                                        <hr />
                                        <Row></Row>
                                        <Row>
                                            {this.state.dadosCadastrados && (
                                                <div className="update ml-auto mr-auto">
                                                    <Button
                                                        block
                                                        className="btn-round"
                                                        color="primary"
                                                        type="submit"
                                                        onClick={() => this.props.history.push("/")}
                                                    >
                                                        Ir para pagina inicial
                                                    </Button>
                                                </div>
                                            )}
                                            {!this.state.dadosCadastrados && (
                                                <div className="update ml-auto mr-auto">
                                                    <Button
                                                        block
                                                        className="btn-round"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        Cadastrar
                                                    </Button>
                                                </div>
                                            )}
                                        </Row>
                                        <Row>
                                            <Col>
                                                {this.state.mensagemRetorno !==
                                                    "" && (
                                                    <Alert
                                                        toggle={() => {
                                                            this.setState({
                                                                mensagemRetorno:
                                                                    "",
                                                            });
                                                        }}
                                                        color={
                                                            this.state
                                                                .tipoMensagem
                                                        }
                                                    >
                                                        {
                                                            this.state
                                                                .mensagemRetorno
                                                        }
                                                    </Alert>
                                                )}
                                            </Col>
                                        </Row>
                                    </Form>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    cidades: state.localizacao.cidades,
    estados: state.localizacao.estados,
    aguardandoDados: state.localizacao.aguardandoDados,
    mensagemRetorno: state.localizacao.mensagemRetorno,
    tipoMensagem: state.localizacao.tipoMensagem,
});

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(
            {
                
            },
            dispatch
        ),
        dispatch,
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CadastroCidadao)
);
