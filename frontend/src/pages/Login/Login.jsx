import "./login.css";

import logo from "../../assets/logo.png";
import fotoBarbearia from "../../assets/barbeariaVilaBranca.png";

import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setErro("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        // JWT fica no cookie HttpOnly
        credentials: "include",

        body: JSON.stringify({
          email,
          senha,
        }),
      });

      if (!response.ok) {
        throw new Error("E-mail ou senha inválidos");
      }

      const data = await response.json();



      // ============================================================
      // SALVA INFORMAÇÕES DA SESSÃO
      // ============================================================

      const roles = data.roles || [];

      localStorage.setItem("role", data.role || "");

      localStorage.setItem("roles", JSON.stringify(roles));

      localStorage.removeItem("roleAtiva");

      // Atualiza componentes que dependem do login
      window.dispatchEvent(new Event("authChange"));

      // ============================================================
      // IDENTIFICAR ROLES
      // ============================================================

      const ehDono = roles.includes("DONO");

      const ehBarbeiro = roles.includes("BARBEIRO");

      const ehCliente = roles.includes("CLIENTE");

      // ============================================================
      // DONO + BARBEIRO
      // ============================================================

      if (ehDono && ehBarbeiro) {
        localStorage.removeItem("redirecionarAposLogin");

        navigate("/escolher-acesso");

        return;
      }

      // ============================================================
      // DONO
      // ============================================================

      if (ehDono) {
        localStorage.setItem("roleAtiva", "DONO");

        localStorage.removeItem("redirecionarAposLogin");

        navigate("/admin");

        return;
      }

      // ============================================================
      // BARBEIRO
      // ============================================================

      if (ehBarbeiro) {
        localStorage.setItem("roleAtiva", "BARBEIRO");

        localStorage.removeItem("redirecionarAposLogin");

        navigate("/barbeiro");

        return;
      }

      // ============================================================
      // CLIENTE
      // ============================================================

      if (ehCliente) {
        localStorage.setItem("roleAtiva", "CLIENTE");

        const redirecionarAposLogin = localStorage.getItem(
          "redirecionarAposLogin",
        );

        // ----------------------------------------------------------
        // CLIENTE TINHA CLICADO EM AGENDAR
        // ----------------------------------------------------------

        if (redirecionarAposLogin) {
          localStorage.removeItem("redirecionarAposLogin");

          navigate(redirecionarAposLogin);

          return;
        }

        // ----------------------------------------------------------
        // LOGIN NORMAL DE CLIENTE
        // ----------------------------------------------------------

        navigate("/servicos");

        return;
      }

      // ============================================================
      // USUÁRIO SEM ROLE
      // ============================================================

      throw new Error("Usuário sem permissão de acesso");
    } catch (error) {
      console.error("Erro no login:", error);

      setErro(error.message || "Não foi possível realizar o login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      {/* =========================================================
          LADO ESQUERDO
      ========================================================= */}

      <section
        className="login-photo"
        style={{
          backgroundImage: `url(${fotoBarbearia})`,
        }}
      >
        <div className="login-photo-overlay" />

        <div className="login-photo-content">
          <span className="login-since">DESDE 2014</span>

          <h2>
            OFERECENDO A MELHOR
            <br />
            EXPERIÊNCIA
          </h2>

          <div className="login-red-line" />

          <p>
            Cuidar de você vai além do corte. Cada detalhe, feito com precisão e
            paixão.
          </p>
        </div>
      </section>

      {/* =========================================================
          LADO DIREITO
      ========================================================= */}

      <section className="login-panel">
        <div className="login-content">
          <img src={logo} alt="Barbearia Vila Branca" className="login-logo" />

          <div className="login-title">
            <h1>
              Bem-vindo
              <strong> de volta!</strong>
            </h1>

            <p>Faça login para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* ===================================================
                EMAIL
            =================================================== */}

            <div className="form-group">
              <label htmlFor="email">E-mail</label>

              <div className="input-container">
                <Mail size={21} />

                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* ===================================================
                SENHA
            =================================================== */}

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="senha">Senha</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => navigate("/esqueci-senha")}
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <div className="input-container">
                <Lock size={21} />

                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={21} /> : <Eye size={21} />}
                </button>
              </div>
            </div>

            {/* ===================================================
                ERRO
            =================================================== */}

            {erro && <p className="login-error">{erro}</p>}

            {/* ===================================================
                BOTÃO LOGIN
            =================================================== */}

            <button type="submit" className="login-button" disabled={loading}>
              <span>{loading ? "Entrando..." : "Entrar"}</span>

              {!loading && <ArrowRight size={22} />}
            </button>
          </form>

          {/* =====================================================
              CADASTRO
          ===================================================== */}

          <p className="register-text">
            Ainda não possui uma conta?
            <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
