import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./redefinirSenha.css";

function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function validarSenha(senha) {
    if (senha.length < 8) {
      return "A senha deve possuir pelo menos 8 caracteres.";
    }

    if (!/[A-Z]/.test(senha)) {
      return "A senha deve possuir pelo menos uma letra maiúscula.";
    }

    if (!/[a-z]/.test(senha)) {
      return "A senha deve possuir pelo menos uma letra minúscula.";
    }

    if (!/\d/.test(senha)) {
      return "A senha deve possuir pelo menos um número.";
    }

    if (!/[^a-zA-Z0-9]/.test(senha)) {
      return "A senha deve possuir pelo menos um caractere especial.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!token) {
      setErro("O link de recuperação é inválido ou está incompleto.");
      return;
    }

    const erroSenha = validarSenha(novaSenha);

    if (erroSenha) {
      setErro(erroSenha);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/redefinir-senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            novaSenha: novaSenha,
          }),
        },
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Não foi possível redefinir sua senha.");
      }

      setMensagem("Sua senha foi redefinida com sucesso!");

      setNovaSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErro(error.message || "Ocorreu um erro ao redefinir sua senha.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="redefinir-senha-page">
      <div className="redefinir-senha-card">
        <div className="redefinir-senha-header">
          <div className="redefinir-senha-icon">🔑</div>

          <h1>Redefinir senha</h1>

          <p>Crie uma nova senha para acessar sua conta.</p>
        </div>

        {!token ? (
          <div className="link-invalido">
            <div className="mensagem-erro-redefinir">
              O link de recuperação é inválido ou está incompleto.
            </div>

            <button
              type="button"
              className="btn-voltar-login"
              onClick={() => navigate("/esqueci-senha")}
            >
              Solicitar novo link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="campo-redefinir">
              <label htmlFor="novaSenha">Nova senha</label>

              <div className="input-senha-container">
                <input
                  id="novaSenha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  disabled={carregando}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="mostrar-senha"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="campo-redefinir">
              <label htmlFor="confirmarSenha">Confirmar nova senha</label>

              <div className="input-senha-container">
                <input
                  id="confirmarSenha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  placeholder="Digite novamente sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  disabled={carregando}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="mostrar-senha"
                  onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                >
                  {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="regras-senha">
              <p>Sua senha precisa ter:</p>

              <span className={novaSenha.length >= 8 ? "regra-ok" : ""}>
                • Pelo menos 8 caracteres
              </span>

              <span className={/[A-Z]/.test(novaSenha) ? "regra-ok" : ""}>
                • Uma letra maiúscula
              </span>

              <span className={/[a-z]/.test(novaSenha) ? "regra-ok" : ""}>
                • Uma letra minúscula
              </span>

              <span className={/\d/.test(novaSenha) ? "regra-ok" : ""}>
                • Um número
              </span>

              <span
                className={/[^a-zA-Z0-9]/.test(novaSenha) ? "regra-ok" : ""}
              >
                • Um caractere especial
              </span>
            </div>

            {erro && <div className="mensagem-erro-redefinir">{erro}</div>}

            {mensagem && (
              <div className="mensagem-sucesso-redefinir">{mensagem}</div>
            )}

            <button
              type="submit"
              className="btn-redefinir"
              disabled={carregando}
            >
              {carregando ? "Redefinindo..." : "Redefinir senha"}
            </button>
          </form>
        )}

        <div className="redefinir-footer">
          <button type="button" onClick={() => navigate("/login")}>
            ← Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RedefinirSenha;
