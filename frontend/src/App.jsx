import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import { ToastContainer } from "react-toastify";
import Servico from "./pages/Servicos/Servicos";
import Agendamento from "./pages/Agendamentos/Agendamentos";
import NotFound from "./pages/NotFound/NotFound";
import ConfirmarAgendamento from "./pages/ConfirmarAgendamento/ConfirmarAgendamento";
import MeusAgendamentos from "./pages/MeusAgendamentos/MeusAgendamentos";
import PerfilCliente from "./pages/PerfilCliente/PerfilCliente";
import Barbeiro from "./pages/Barbeiro/BarbeiroDashboard";
import BarbeiroAgenda from "./pages/Barbeiro/BarbeiroAgenda";
import BarbeiroAtendimentos from "./pages/Barbeiro/BarbeiroAtendimentos";
import BarbeiroDesempenho from "./pages/Barbeiro/BarbeiroDesempenho";
import BarbeiroPerfil from "./pages/Barbeiro/BarbeiroPerfil";
import EscolherAcesso from "./pages/EscolherAcesso/EscolherAcesso";
import DonoDashboard from "./pages/Dono/DonoDashboard";
import DonoAgendamentos from "./pages/Dono/DonoAgendamentos";
import DonoBarbeiros from "./pages/Dono/DonoBarbeiros";
import DonoServicos from "./pages/Dono/DonoServicos";
import DonoRelatorios from "./pages/Dono/DonoRelatorios";
import EsqueciSenha from "./pages/EsqueciSenha/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha/RedefinirSenha";



function App() {
  return(
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={ <Servico/> }/>
      <Route path="/login" element={ <Login/> }/>
      <Route path="/cadastro" element = { <Cadastro/> }/>

      {/* CLIENTES */}
      <Route path="/servicos" element= { <Servico/> }/>
      <Route path="/agendamentos" element = { <Agendamento/> }/>
      <Route path="/confirmar-agendamento" element={ <ConfirmarAgendamento/> }/>
      <Route path="/meus-agendamentos" element = { <MeusAgendamentos/> }/>
      <Route path="/perfil-cliente" element = {<PerfilCliente/>}/>

      {/* BARBEIRO */}
      <Route path="/barbeiro" element={ <Barbeiro/> } /> 
      <Route path="/barbeiro/agenda" element={ <BarbeiroAgenda/> }/>
      <Route path="/barbeiro/atendimentos" element={ <BarbeiroAtendimentos/> }/>
      <Route path="/barbeiro/desempenho" element={ <BarbeiroDesempenho/> }/>
      <Route path="/barbeiro/perfil" element={ <BarbeiroPerfil/>}/>

      {/* DONO */}
      <Route path="/admin" element={ <DonoDashboard/> } />
      <Route path="/escolher-acesso" element={ <EscolherAcesso/> }/>
      <Route path="/admin/agendamentos" element={ <DonoAgendamentos/> }/>
      <Route path="/admin/barbeiros" element={ <DonoBarbeiros/> }/>
      <Route path="/admin/servicos" element={ <DonoServicos/> }/>
      <Route path="/admin/relatorios" element={ <DonoRelatorios/> }/>

      {/* ESQUECI/REDEFINIR SENHA */}
      <Route path="/esqueci-senha" element={ <EsqueciSenha/> }/>
      <Route path="/redefinir-senha" element={ <RedefinirSenha/> }/>

      

      <Route path="*" element={<NotFound />} />

    </Routes>
    </BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
    

  );
}

export default App;