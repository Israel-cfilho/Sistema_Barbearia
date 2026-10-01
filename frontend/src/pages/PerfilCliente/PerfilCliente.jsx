import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  Scissors,
  Trash2,
  User,
} from "lucide-react";

import ClienteHeader from "../../Components/ClienteHeader/ClienteHeader";

import "./perfilCliente.css";

function PerfilCliente() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADOS - SENHAS
  // ============================================================

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // ============================================================
  // ESTADOS - DADOS DO CLIENTE
  // ============================================================

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailOriginal, setEmailOriginal] = useState("");
  const [telefone, setTelefone] = useState("");

  // ============================================================
  // ESTADOS - ALTERAÇÃO DE SENHA
  // ============================================================

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // ============================================================
  // ESTADOS - CARREGAMENTO
  // ============================================================

  const [loading, setLoading] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [excluindoConta, setExcluindoConta] = useState(false);

  // ============================================================
  // FORMATAR TELEFONE
  // ============================================================

  function formatarTelefone(valor) {
    let numeros = valor.replace(/\D/g, "");

    // Limita a 11 números
    numeros = numeros.slice(0, 11);

    // DDD
    if (numeros.length <= 2) {
      return numeros;
    }

    // Telefone fixo
    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(
        2,
        6
      )}-${numeros.slice(6)}`;
    }

    // Celular
    return `(${numeros.slice(0, 2)}) ${numeros.slice(
      2,
      7
    )}-${numeros.slice(7, 11)}`;
  }

  // ============================================================
  // BUSCAR DADOS DO CLIENTE LOGADO
  // ============================================================

  useEffect(() => {
    async function buscarPerfil() {
      try {
        const response = await fetch(
          "http://localhost:8080/clientes/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("role");
            localStorage.removeItem("roles");
            localStorage.removeItem("roleAtiva");

            navigate("/");
            return;
          }

          const mensagem = await response.text();

          throw new Error(
            mensagem || "Erro ao carregar perfil."
          );
        }

        const dados = await response.json();

        setNome(dados.nome || "");
        setEmail(dados.email || "");
        setEmailOriginal(dados.email || "");
        setTelefone(formatarTelefone(dados.telefone || ""));
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);

        alert(
          error.message ||
            "Não foi possível carregar seus dados."
        );
      } finally {
        setCarregandoPerfil(false);
      }
    }

    buscarPerfil();
  }, [navigate]);

  // ============================================================
  // SALVAR ALTERAÇÕES
  // ============================================================

  async function salvarAlteracoes(event) {
    event.preventDefault();

    // ==========================================================
    // VALIDAÇÃO DOS DADOS
    // ==========================================================

    if (!nome.trim()) {
      alert("Informe seu nome.");
      return;
    }

    if (!email.trim()) {
      alert("Informe seu e-mail.");
      return;
    }

    if (!telefone.trim()) {
      alert("Informe seu telefone.");
      return;
    }

    const telefoneSomenteNumeros = telefone.replace(/\D/g, "");

    if (
      telefoneSomenteNumeros.length < 10 ||
      telefoneSomenteNumeros.length > 11
    ) {
      alert("Informe um telefone válido com DDD.");
      return;
    }

    // ==========================================================
    // VALIDAÇÃO DE SENHA
    // ==========================================================

    const estaAlterandoSenha =
      senhaAtual || novaSenha || confirmarSenha;

    if (estaAlterandoSenha) {
      if (!senhaAtual) {
        alert("Informe sua senha atual.");
        return;
      }

      if (!novaSenha) {
        alert("Informe a nova senha.");
        return;
      }

      if (novaSenha.length < 8) {
        alert(
          "A nova senha deve ter pelo menos 8 caracteres."
        );
        return;
      }

      if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/clientes/me",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone: telefoneSomenteNumeros,
            senhaAtual: senhaAtual || null,
            novaSenha: novaSenha || null,
          }),
        }
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(
          mensagem ||
            "Não foi possível atualizar seu perfil."
        );
      }

      const dados = await response.json();

      // ========================================================
      // ATUALIZA OS DADOS NA TELA
      // ========================================================

      setNome(dados.nome || "");
      setEmail(dados.email || "");
      setTelefone(formatarTelefone(dados.telefone || ""));

      // ========================================================
      // LIMPA CAMPOS DE SENHA
      // ========================================================

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      // ========================================================
      // SE O EMAIL FOI ALTERADO
      // ========================================================

      const emailFoiAlterado =
        emailOriginal.toLowerCase() !==
        dados.email.toLowerCase();

      if (emailFoiAlterado) {
        alert(
          "Seu e-mail foi alterado com sucesso. Entre novamente usando o novo e-mail."
        );

        localStorage.removeItem("role");
        localStorage.removeItem("roles");
        localStorage.removeItem("roleAtiva");
        localStorage.removeItem("servicoSelecionado");
        localStorage.removeItem("dadosAgendamento");

        // Remove o cookie JWT pelo backend
        try {
          await fetch(
            "http://localhost:8080/auth/logout",
            {
              method: "POST",
              credentials: "include",
            }
          );
        } catch (logoutError) {
          console.error(
            "Erro ao fazer logout:",
            logoutError
          );
        }

        navigate("/login");
        return;
      }

      setEmailOriginal(dados.email || "");

      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao atualizar perfil:",
        error
      );

      alert(
        error.message ||
          "Erro ao atualizar perfil."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // EXCLUIR CONTA
  // ============================================================

  async function excluirConta() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) {
      return;
    }

    setExcluindoConta(true);

    try {
      const response = await fetch(
        "http://localhost:8080/clientes/me",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(
          mensagem ||
            "Não foi possível excluir sua conta."
        );
      }

      // ========================================================
      // REMOVE O COOKIE JWT PELO BACKEND
      // ========================================================

      try {
        await fetch(
          "http://localhost:8080/auth/logout",
          {
            method: "POST",
            credentials: "include",
          }
        );
      } catch (logoutError) {
        console.error(
          "Erro ao fazer logout:",
          logoutError
        );
      }

      // ========================================================
      // LIMPA O LOGIN
      // ========================================================

      localStorage.removeItem("role");
      localStorage.removeItem("roles");
      localStorage.removeItem("roleAtiva");
      localStorage.removeItem("servicoSelecionado");
      localStorage.removeItem("dadosAgendamento");
      localStorage.removeItem("redirecionarAposLogin");

      window.dispatchEvent(new Event("authChange"));

      alert("Sua conta foi excluída com sucesso.");

      navigate("/");
    } catch (error) {
      console.error(
        "Erro ao excluir conta:",
        error
      );

      alert(
        error.message ||
          "Erro ao excluir sua conta."
      );
    } finally {
      setExcluindoConta(false);
    }
  }

  // ============================================================
  // CARREGANDO PERFIL
  // ============================================================

  if (carregandoPerfil) {
    return (
      <main className="perfil-page">
        <ClienteHeader />

        <div className="perfil-loading">
          <div className="perfil-loading-spinner" />

          <span>
            Carregando seu perfil...
          </span>
        </div>
      </main>
    );
  }

  // ============================================================
  // JSX
  // ============================================================

  return (
    <main className="perfil-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <ClienteHeader />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="perfil-hero">
        <span className="perfil-label">
          MEU PERFIL
        </span>

        <h1>
          Suas informações,
          <br />
          sempre
          <strong> atualizadas.</strong>
        </h1>

        <p>
          Edite seus dados pessoais e mantenha sua conta sempre segura.
        </p>
      </section>

      {/* ======================================================
          CONTEÚDO PRINCIPAL
      ====================================================== */}

      <section className="perfil-container">

        {/* ====================================================
            FORMULÁRIO
        ==================================================== */}

        <form
          className="perfil-card"
          onSubmit={salvarAlteracoes}
        >

          {/* ==================================================
              DADOS PESSOAIS
          ================================================== */}

          <div className="perfil-section-header">
            <div className="perfil-section-icon">
              <User size={22} />
            </div>

            <div>
              <h2>Dados pessoais</h2>

              <p>
                Atualize suas informações abaixo.
              </p>
            </div>
          </div>

          {/* ==================================================
              NOME
          ================================================== */}

          <div className="perfil-form-group">
            <label htmlFor="nome">
              Nome completo
            </label>

            <div className="perfil-input-wrapper">
              <User size={18} />

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Digite seu nome"
                autoComplete="name"
              />
            </div>
          </div>

          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="perfil-form-group">
            <label htmlFor="email">
              E-mail
            </label>

            <div className="perfil-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Digite seu e-mail"
                autoComplete="email"
              />
            </div>
          </div>

          {/* ==================================================
              TELEFONE
          ================================================== */}

          <div className="perfil-form-group">
            <label htmlFor="telefone">
              Telefone
            </label>

            <div className="perfil-input-wrapper">
              <Phone size={18} />

              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(event) =>
                  setTelefone(
                    formatarTelefone(
                      event.target.value
                    )
                  )
                }
                placeholder="(83) 99999-9999"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={15}
              />
            </div>
          </div>

          {/* ==================================================
              DIVISÓRIA
          ================================================== */}

          <div className="perfil-divider" />

          {/* ==================================================
              ALTERAR SENHA
          ================================================== */}

          <div className="perfil-section-header">
            <div className="perfil-section-icon">
              <LockKeyhole size={22} />
            </div>

            <div>
              <h2>Alterar senha</h2>

              <p>
                Preencha apenas se desejar trocar sua senha.
              </p>
            </div>
          </div>

          {/* ==================================================
              SENHA ATUAL
          ================================================== */}

          <div className="perfil-form-group">
            <label htmlFor="senhaAtual">
              Senha atual
            </label>

            <div className="perfil-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="senhaAtual"
                type={
                  mostrarSenhaAtual
                    ? "text"
                    : "password"
                }
                value={senhaAtual}
                onChange={(event) =>
                  setSenhaAtual(event.target.value)
                }
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="perfil-eye-button"
                onClick={() =>
                  setMostrarSenhaAtual(
                    !mostrarSenhaAtual
                  )
                }
              >
                {mostrarSenhaAtual ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* ==================================================
              NOVA SENHA
          ================================================== */}

          <div className="perfil-form-group">
            <label htmlFor="novaSenha">
              Nova senha
            </label>

            <div className="perfil-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="novaSenha"
                type={
                  mostrarNovaSenha
                    ? "text"
                    : "password"
                }
                value={novaSenha}
                onChange={(event) =>
                  setNovaSenha(event.target.value)
                }
                placeholder="Digite sua nova senha"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="perfil-eye-button"
                onClick={() =>
                  setMostrarNovaSenha(
                    !mostrarNovaSenha
                  )
                }
              >
                {mostrarNovaSenha ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <span className="perfil-password-hint">
              Use pelo menos 8 caracteres.
            </span>
          </div>

          {/* ==================================================
              CONFIRMAR NOVA SENHA
          ================================================== */}

          <div className="perfil-form-group">
            <label htmlFor="confirmarSenha">
              Confirmar nova senha
            </label>

            <div className="perfil-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="confirmarSenha"
                type={
                  mostrarConfirmarSenha
                    ? "text"
                    : "password"
                }
                value={confirmarSenha}
                onChange={(event) =>
                  setConfirmarSenha(
                    event.target.value
                  )
                }
                placeholder="Confirme sua nova senha"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="perfil-eye-button"
                onClick={() =>
                  setMostrarConfirmarSenha(
                    !mostrarConfirmarSenha
                  )
                }
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* ==================================================
              SALVAR
          ================================================== */}

          <div className="perfil-save-area">
            <button
              type="submit"
              className="perfil-save-button"
              disabled={
                loading || excluindoConta
              }
            >
              <Save size={18} />

              {loading
                ? "Salvando..."
                : "Salvar alterações"}
            </button>
          </div>
        </form>

        {/* ====================================================
            EXCLUIR CONTA
        ==================================================== */}

        <div className="perfil-delete-card">
          <div className="perfil-delete-info">

            <div className="perfil-delete-icon">
              <Trash2 size={23} />
            </div>

            <div>
              <h2>Excluir conta</h2>

              <p>
                Ao excluir sua conta, seus dados de acesso serão removidos
                permanentemente. Esta ação não poderá ser desfeita.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="perfil-delete-button"
            onClick={excluirConta}
            disabled={
              excluindoConta || loading
            }
          >
            <Trash2 size={17} />

            {excluindoConta
              ? "Excluindo..."
              : "Excluir conta"}
          </button>
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="perfil-footer">
        <Scissors size={18} />

        <span>
          BARBEARIA VILA BRANCA
        </span>
      </footer>
    </main>
  );
}

export default PerfilCliente;