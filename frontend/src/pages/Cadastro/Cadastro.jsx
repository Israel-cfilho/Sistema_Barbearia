import "./Cadastro.css";

import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import fotoBarbearia from "../../assets/barbeariaVilaBranca.png";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const requisitosSenha = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha),
  };

  const senhaForte = Object.values(requisitosSenha).every(Boolean);

  function formatarTelefone(valor) {
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, "");

    // Limita a 11 números
    valor = valor.slice(0, 11);

    // (83
    if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }

    // (83) 99999-9999
    if (valor.length > 10) {
      valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
    }

    return valor;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!senhaForte) {
      toast.error("A senha não atende aos requisitos de segurança");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/registro-cliente",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nome,
            telefone,
            email,
            senha,
          }),
        },
      );

      if (!response.ok) {
        const erro = await response.text();

        if (response.status === 409) {
          toast.error("Este e-mail já está cadastrado");
          return;
        }

        throw new Error(erro);
      }

      const data = await response.json();

      console.log("Cliente cadastrado:");
      console.log(data);

      toast.success("Conta criada com sucesso! Faça login para continuar.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);

      toast.error("Não foi possível realizar o cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cadastro-page">
      {/* FOTO */}

      <section
        className="cadastro-photo"
        style={{
          backgroundImage: `url(${fotoBarbearia})`,
        }}
      >
        <div className="cadastro-photo-overlay" />

        <div className="cadastro-photo-content">
          <span className="cadastro-since">DESDE 2014</span>

          <h2>
            SUA EXPERIÊNCIA
            <br />
            COMEÇA AQUI
          </h2>

          <div className="cadastro-red-line" />

          <p>
            Crie sua conta, escolha seu serviço e agende seu horário de forma
            simples e rápida.
          </p>
        </div>
      </section>

      {/* FORMULÁRIO */}

      <section className="cadastro-panel">
        <div className="cadastro-content">
          <img
            src={logo}
            alt="Barbearia Vila Branca"
            className="cadastro-logo"
          />

          <div className="cadastro-title">
            <h1>
              Crie sua
              <strong> conta</strong>
            </h1>

            <p>Cadastre-se para realizar seus agendamentos</p>
          </div>

          <form className="cadastro-form" onSubmit={handleSubmit}>
            {/* NOME */}

            <div className="cadastro-form-group">
              <label htmlFor="nome">Nome completo</label>

              <div className="cadastro-input-container">
                <User size={20} />

                <input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="cadastro-form-group">
              <label htmlFor="email">E-mail</label>

              <div className="cadastro-input-container">
                <Mail size={20} />

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

            {/* TELEFONE */}

            <div className="cadastro-form-group">
              <label htmlFor="telefone">Telefone</label>

              <div className="cadastro-input-container">
                <Phone size={20} />

                <input
                  id="telefone"
                  type="tel"
                  placeholder="(83) 99999-9999"
                  value={telefone}
                  onChange={(event) =>
                    setTelefone(formatarTelefone(event.target.value))
                  }
                  maxLength={15}
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
            {/* SENHAS LADO A LADO */}
            <div className="cadastro-password-grid">
              {/* SENHA */}
              <div className="cadastro-form-group">
                <label htmlFor="senha">Senha</label>

                <div className="cadastro-input-container">
                  <Lock size={20} />

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
                    className="cadastro-show-password"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {/* REQUISITOS DA SENHA */}
                {senha && (
                  <div className="password-requirements">
                    <p className={requisitosSenha.tamanho ? "valid" : ""}>
                      <span>{requisitosSenha.tamanho ? "✓" : "•"}</span>
                      Mínimo de 8 caracteres
                    </p>

                    <p className={requisitosSenha.maiuscula ? "valid" : ""}>
                      <span>{requisitosSenha.maiuscula ? "✓" : "•"}</span>
                      Uma letra maiúscula
                    </p>

                    <p className={requisitosSenha.minuscula ? "valid" : ""}>
                      <span>{requisitosSenha.minuscula ? "✓" : "•"}</span>
                      Uma letra minúscula
                    </p>

                    <p className={requisitosSenha.numero ? "valid" : ""}>
                      <span>{requisitosSenha.numero ? "✓" : "•"}</span>
                      Um número
                    </p>

                    <p className={requisitosSenha.especial ? "valid" : ""}>
                      <span>{requisitosSenha.especial ? "✓" : "•"}</span>
                      Um caractere especial
                    </p>
                  </div>
                )}
              </div>

              {/* CONFIRMAR SENHA */}
              <div className="cadastro-form-group">
                <label htmlFor="confirmarSenha">Confirmar senha</label>

                <div className="cadastro-input-container">
                  <Lock size={20} />

                  <input
                    id="confirmarSenha"
                    type={mostrarConfirmacao ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmarSenha}
                    onChange={(event) => setConfirmarSenha(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="cadastro-show-password"
                    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {/* VERIFICA SE AS SENHAS SÃO IGUAIS */}
                {confirmarSenha && (
                  <p
                    className={
                      senha === confirmarSenha
                        ? "password-match valid"
                        : "password-match invalid"
                    }
                  >
                    {senha === confirmarSenha
                      ? "✓ As senhas coincidem"
                      : "✕ As senhas não coincidem"}
                  </p>
                )}
              </div>
            </div>

            <button
              className="cadastro-button"
              type="submit"
              disabled={loading || !senhaForte || senha !== confirmarSenha}
            >
              <span>{loading ? "Criando conta..." : "Criar conta"}</span>

              {!loading && <ArrowRight size={21} />}
            </button>
          </form>

          <p className="login-text">
            Já possui uma conta?
            <Link to="/login">Fazer login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;
