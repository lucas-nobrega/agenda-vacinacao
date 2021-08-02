import React from "react";
import { withRouter, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    loginAction,
    fecharMensagemAction,
    setMensagemAction,
} from "../usuario.slice";

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
    InputGroup,
    InputGroupText,
} from "reactstrap";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            verSenha: false,
            tipoSenha: "password",
            tipoIcon: "fas fa-eye",
        };
    }

    tratarLogin = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);

        const credenciais = {
            email: data.get("email"),
            password: data.get("password"),
        };
        this.props.login(credenciais).then((resposta) => {
           console.info(resposta)
            if (typeof resposta.payload.data.access != 'undefined') {
               const jwt = {
                  "access" : resposta.payload.data.access,
                  "refresh" : resposta.payload.data.refresh,
                  "id" : resposta.payload.data.id
               }
               localStorage.setItem("jwt", JSON.stringify(jwt));
                this.props.history.push("/");
            }
        });
    };
    verSenha = () => {
        if(!this.state.verSenha){
            this.setState({verSenha: true, tipoSenha: "text", tipoIcon: "far fa-eye"});
        }else {
            this.setState({verSenha: false,tipoSenha: "password", tipoIcon: "fas fa-eye"});
        }
    }

    render() {
        return (
            <div className="content">
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center" tag="h4">
                                    Login
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={(e) => this.tratarLogin(e)}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Input
                                                    name="email"
                                                    placeholder="Email"
                                                    type="email"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <InputGroup>
                                                    <Input
                                                        name="password"
                                                        placeholder="Senha"
                                                        type={this.state.tipoSenha}
                                                    />
                                                    <InputGroupText onClick={() => this.verSenha()}>
                                                        <i className={this.state.tipoIcon}></i>
                                                    </InputGroupText>
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="update ml-auto mr-auto">
                                            <Row>
                                                <Col>
                                                    <Button
                                                        block
                                                        className="btn-round"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        Entrar
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Link to={this.appRelativePath +"/cadastro/cidadao"} className="btn btn-round btn-md bg-success">
                                                        Cadastrar
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {this.props.mensagemRetorno !==
                                                "" && (
                                                <Alert
                                                    toggle={() => {
                                                        this.props.fecharMensagem();
                                                    }}
                                                    color={
                                                        this.props.tipoMensagem
                                                    }
                                                >
                                                    {this.props.mensagemRetorno}
                                                </Alert>
                                            )}
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    dadosUsuario: state.usuario.dados,
    aguardandoDados: state.usuario.aguardandoDados,
    mensagemRetorno: state.usuario.mensagemRetorno,
    tipoMensagem: state.usuario.tipoMensagem,
});

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(
            {
                login: loginAction,
                fecharMensagem: fecharMensagemAction,
                setMensagem: setMensagemAction,
            },
            dispatch
        ),
        dispatch,
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
