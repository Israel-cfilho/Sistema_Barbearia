import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./notFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">

      <div className="not-found-glow" />

      <section className="not-found-content">

        <span className="not-found-code">
          404
        </span>

        <p className="not-found-label">
          PÁGINA NÃO ENCONTRADA
        </p>

        <h1>
          Parece que você
          <br />
          <strong>errou o caminho.</strong>
        </h1>

        <p className="not-found-description">
          A página que você tentou acessar não existe
          ou pode ter sido removida.
        </p>

        <div className="not-found-actions">

          <button
            className="not-found-primary"
            onClick={() => navigate("/servicos")}
          >
            <Home size={18} />
            Voltar ao início
          </button>

          <button
            className="not-found-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

        </div>

      </section>

      <div className="not-found-number">
        404
      </div>

    </main>
  );
}

export default NotFound;