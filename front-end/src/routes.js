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
import LocalVacinacaoProximos from "app/modules/localvacinacao/LocalVacinacaoProximos";

const appRelativePath = "/agenda";

var routes = [
  {
    path: "/login",
    name: "",
    icon: "nc-icon nc-single-02",
    component: Login,
    layout: appRelativePath,
  },

  {
    path: "/cadastro/cidadao",
    name: "",
    icon: "nc-icon nc-single-02",
    component: CadastroCidadao,
    layout: appRelativePath,
  },
  {
    path: "/cadastro/grupoatendimento",
    name: "Gerir Grupos de Atendimento",
    icon: "nc-icon nc-sound-wave",  
    component: GrupoAtendimento,
    layout: appRelativePath,
    permissions: ['admin'],
  },
  {
    path: "/cidadaos",
    name: "Gerenciamento de Cidadaos",
    icon: "nc-icon nc-circle-10",
    component: GerenciamentoCidadao,
    layout: appRelativePath,
    permissions: ['admin',],
  },
  {
    path: "/cadastro/localvacinacao",
    name: "Locais Vacinação",
    icon: "nc-icon nc-paper",
    component: LocalVacinacao,
    layout: appRelativePath,
    permissions: ['admin'],
  },
  
  {
    path: "/agendamentos",
    name: "Agendamentos",
    icon: "nc-icon nc-briefcase-24",
    component: AgendamentoVacinacao,
    layout: appRelativePath,
    permissions: ['admin'],
  },
  {
    path: "/pagina_inicial",
    name: "Pagina Inicial",
    icon: "nc-icon nc-bank",
    component: PaginaInicial,
    layout: appRelativePath,
  },
  {
   path: "/locais-proximos",
   name: "Locais Próximos",
   icon: "nc-icon nc-bank",
   component: LocalVacinacaoProximos,
   layout: appRelativePath,
 },

  {
    path: "/agendar",
    name: "Agendamento",
    icon: "nc-icon nc-single-02",
    component: AgendarVacinacao,
    layout: appRelativePath,
    permissions: ['cidadao'],
  },
];
export default routes;
