import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./esqueciSenha.css";

function EsqueciSenha() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        setMensagem("");
        setErro("");

        if (!email.trim()) {
            setErro("Digite seu e-mail.");
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch(
                "http://localhost:8080/auth/esqueci-senha",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "Não foi possível solicitar a recuperação."
                );
            }

            setMensagem(
                "Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha."
            );

            setEmail("");
        } catch (error) {
            setErro(
                error.message ||
                "Ocorreu um erro ao solicitar a recuperação."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="esqueci-senha-page">
            <div className="esqueci-senha-card">

                <button
                    type="button"
                    className="voltar-login"
                    onClick={() => navigate("/login")}
                >
                    ← Voltar para o login
                </button>

                <div className="esqueci-senha-header">
                    <div className="esqueci-senha-icon">
                        🔐
                    </div>

                    <h1>Esqueceu sua senha?</h1>

                    <p>
                        Informe seu e-mail e enviaremos um link
                        para você criar uma nova senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="campo-senha-recovery">
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={carregando}
                        />
                    </div>

                    {erro && (
                        <div className="mensagem-erro-recovery">
                            {erro}
                        </div>
                    )}

                    {mensagem && (
                        <div className="mensagem-sucesso-recovery">
                            {mensagem}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-recuperar-senha"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Enviando..."
                            : "Enviar link de recuperação"}
                    </button>

                </form>

                <div className="esqueci-senha-footer">
                    <span>Lembrou sua senha?</span>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Entrar
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EsqueciSenha;