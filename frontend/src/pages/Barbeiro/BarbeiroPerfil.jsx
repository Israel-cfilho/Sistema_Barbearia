import { useEffect, useState } from "react";
import {
  CircleUserRound,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  WalletCards,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import BarbeiroSidebar from "../../components/BarbeiroSidebar/BarbeiroSidebar";

import "./barbeiroPerfil.css";

function BarbeiroPerfil() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  const [dadosOriginais, setDadosOriginais] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    comissaoPercentual: 0,
  });

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/barbeiros/me", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar o perfil");
      }

      const dados = await response.json();

      const perfil = {
        nome: dados.nome || "",
        telefone: dados.telefone || "",
        email: dados.usuario?.email || "",
        senhaAtual: "",
        novaSenha: "",
        comissaoPercentual: Number(dados.comissaoPercentual || 0),
      };

      setForm(perfil);

      setDadosOriginais(perfil);
    } catch (error) {
      console.error(error);

      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }

  function alterarCampo(event) {
    const { name, value } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    if (!form.nome.trim()) {
      toast.error("Informe seu nome");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Informe seu e-mail");
      return;
    }

    if (form.novaSenha && form.novaSenha.length < 8) {
      toast.error("A nova senha deve possuir pelo menos 8 caracteres");
      return;
    }

    if (form.novaSenha && !form.senhaAtual) {
      toast.error("Informe sua senha atual");
      return;
    }

    try {
      setSalvando(true);

      const response = await fetch("http://localhost:8080/barbeiros/me", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          email: form.email,
          senhaAtual: form.senhaAtual,
          novaSenha: form.novaSenha,
        }),
      });

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível atualizar o perfil");
      }

      const dados = await response.json();

      const emailAnterior = dadosOriginais?.email;

      const emailNovo = dados.usuario?.email;

      setForm((anterior) => ({
        ...anterior,
        nome: dados.nome || "",
        telefone: dados.telefone || "",
        email: dados.usuario?.email || "",
        senhaAtual: "",
        novaSenha: "",
      }));

      setDadosOriginais((anterior) => ({
        ...anterior,
        nome: dados.nome || "",
        telefone: dados.telefone || "",
        email: dados.usuario?.email || "",
      }));

      toast.success("Perfil atualizado com sucesso");

      if (emailAnterior && emailNovo && emailAnterior !== emailNovo) {
        try {
          await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (erroLogout) {
          console.error("Erro ao encerrar sessão:", erroLogout);
        }

        localStorage.removeItem("role");

        localStorage.removeItem("roles");

        localStorage.removeItem("roleAtiva");

        toast.info("Entre novamente com seu novo e-mail");

        navigate("/");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="barbeiro-perfil-page">
        <BarbeiroSidebar />

        <main className="barbeiro-perfil-main">
          <div className="barbeiro-perfil-loading">Carregando perfil...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="barbeiro-perfil-page">
      <BarbeiroSidebar />

      <main className="barbeiro-perfil-main">
        <header className="barbeiro-perfil-header">
          <span className="barbeiro-perfil-label">MEU PERFIL</span>

          <h1>Informações pessoais</h1>

          <p>Atualize seus dados de acesso e informações pessoais.</p>
        </header>

        <form className="barbeiro-perfil-card" onSubmit={salvarPerfil}>
          <div className="barbeiro-perfil-card-header">
            <div className="barbeiro-perfil-avatar">
              <CircleUserRound size={28} />
            </div>

            <div>
              <h2>{form.nome}</h2>

              <span>Barbeiro</span>
            </div>
          </div>

          <div className="barbeiro-perfil-form">
            <div className="barbeiro-perfil-field campo-completo">
              <label>Nome</label>

              <div className="perfil-input-container">
                <CircleUserRound size={17} />

                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={alterarCampo}
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="barbeiro-perfil-field">
              <label>Telefone</label>

              <div className="perfil-input-container">
                <Phone size={17} />

                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={alterarCampo}
                  placeholder="Seu telefone"
                />
              </div>
            </div>

            <div className="barbeiro-perfil-field">
              <label>E-mail</label>

              <div className="perfil-input-container">
                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={alterarCampo}
                  placeholder="Seu e-mail"
                />
              </div>
            </div>

            <div className="barbeiro-perfil-field campo-completo">
              <label>Comissão</label>

              <div className="perfil-input-container campo-bloqueado">
                <WalletCards size={17} />

                <input
                  type="text"
                  value={`${form.comissaoPercentual}%`}
                  disabled
                />
              </div>

              <small>
                O percentual de comissão é definido pelo administrador.
              </small>
            </div>
          </div>

          <div className="barbeiro-perfil-separador">
            <span>ALTERAR SENHA</span>
          </div>

          <div className="barbeiro-perfil-form">
            <div className="barbeiro-perfil-field">
              <label>Senha atual</label>

              <div className="perfil-input-container">
                <LockKeyhole size={17} />

                <input
                  type={mostrarSenhaAtual ? "text" : "password"}
                  name="senhaAtual"
                  value={form.senhaAtual}
                  onChange={alterarCampo}
                  placeholder="Sua senha atual"
                />

                <button
                  type="button"
                  className="perfil-eye-button"
                  onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                >
                  {mostrarSenhaAtual ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="barbeiro-perfil-field">
              <label>Nova senha</label>

              <div className="perfil-input-container">
                <LockKeyhole size={17} />

                <input
                  type={mostrarNovaSenha ? "text" : "password"}
                  name="novaSenha"
                  value={form.novaSenha}
                  onChange={alterarCampo}
                  placeholder="Nova senha"
                />

                <button
                  type="button"
                  className="perfil-eye-button"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                >
                  {mostrarNovaSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          </div>

          <div className="barbeiro-perfil-actions">
            <button
              type="submit"
              className="salvar-perfil-barbeiro"
              disabled={salvando}
            >
              <Save size={16} />

              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default BarbeiroPerfil;
