import Login from "app/modules/usuario/componentes/Login"
//import CadastroMedico from "app/modules/medico/componentes/CadastroMedico"
import CadastroCidadao from "app/modules/cidadao/componentes/CadastroCidadao"
import GerenciamentoCidadao from "app/modules/cidadao/componentes/GerenciamentoCidadao"
//import CadastroDoencas from "app/modules/doencas/componentes/CadastroDoencas"
import PaginaInicial from "app/modules/dashboard/componentes/PaginaInicial";
import GrupoAtendimento from "app/modules/cadastro/grupoatendimento/GrupoAtendimento";
import LocalVacinacao from "app/modules/localvacinacao/LocalVacinacao";
import AgendamentoVacinacao from "app/modules/agendamento/gerir/AgendamentoVacinacao";

//import Cidadaos from "app/modules/cidadao/componentes/Cidadaos";
//import RotasCidadao from "app/modules/cidadao/componentes/RotasCidadao";
//import RotasAcompanhamento from "app/modules/acompanhamento/componentes/RotasAcompanhamento";
//import CadastroDoenca from "app/modules/cidadao/componentes/CadastroDoenca"
import AgendarVacinacao from "app/modules/agendamento/usuario/AgendarVacinacao";

var routes = [
  {
    path: "/login",
    name: "",
    icon: "nc-icon nc-single-02",
    component: Login,
    layout: "/admin",
  },

  {
    path: "/cadastro/medico",
    name: "",
    icon: "nc-icon nc-single-02",
    //component: CadastroMedico,
    layout: "/admin",
  },
  {
    path: "/cadastro/cidadao",
    name: "",
    icon: "nc-icon nc-single-02",
    component: CadastroCidadao,
    layout: "/admin",
  },
  {
    path: "/cadastro/grupoatendimento",
    name: "Gerir Grupos de Atendimento",
    icon: "nc-icon nc-sound-wave",  
    component: GrupoAtendimento,
    layout: "/admin",
    //permissions: ['medico', 'medicoadm'],
  },
  {
    path: "/cidadaos",
    name: "Gerenciamento de Cidadaos",
    icon: "nc-icon nc-circle-10",
    component: GerenciamentoCidadao,
    layout: "/admin",
    //permissions: ['medico', 'medicoadm'],
  },
  {
    path: "/cadastro/localvacinacao",
    name: "Locais Vacinação",
    icon: "nc-icon nc-paper",
    component: LocalVacinacao,
    layout: "/admin",
    //permissions: ['cidadao'],
  },
  
  {
    path: "/agendamentos",
    name: "Agendamentos",
    icon: "nc-icon nc-briefcase-24",
    component: AgendamentoVacinacao,
    layout: "/admin",
    //permissions: ['medico', 'medicoadm'],
  },
  {
    path: "/cadastro/cidadaodoenca",
    name: "Cadastrar Doença do Cidadao",
    icon: "nc-icon nc-single-02",
    //component: CadastroDoenca,
    layout: "/admin",
    //permissions: ['medico', 'medicoadm'],
  },

  // Rotas do Template ## RERVISAR
  {
    path: "/pagina_inicial",
    name: "Pagina Inicial",
    icon: "nc-icon nc-bank",
    component: PaginaInicial,
    layout: "/admin",
  },

  {
    path: "/agendar",
    name: "Agendamento",
    icon: "nc-icon nc-single-02",
    component: AgendarVacinacao,
    layout: "/user",
  },
];
export default routes;
