import {
  Clock,
  DollarSign,
  Pencil,
  Plus,
  Scissors,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import DonoSidebar from "../../Components/DonoSidebar/DonoSidebar";

import "./donoServicos.css";

function DonoServicos() {
  const [servicos, setServicos] = useState([]);

  const [busca, setBusca] = useState("");

  const [loading, setLoading] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");

  const [modalAberto, setModalAberto] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);

  const [servicoEditando, setServicoEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    preco: "",
    duracaoMinutos: "",
    categoria: "",
    ativo: true,
  });

  // ============================================================
  // CARREGAR SERVIÇOS
  // ============================================================

  async function carregarServicos() {
    try {
      setLoading(true);
      setErro("");

      const response = await fetch("http://localhost:8080/servicos", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar os serviços.");
      }

      const data = await response.json();

      setServicos(data || []);
    } catch (error) {
      console.error(error);

      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  // ============================================================
  // LIMPAR FORMULÁRIO
  // ============================================================

  function limparForm() {
    setForm({
      nome: "",
      preco: "",
      duracaoMinutos: "",
      categoria: "",
      ativo: true,
    });

    setServicoEditando(null);
  }

  // ============================================================
  // ABRIR CADASTRO
  // ============================================================

  function abrirCadastro() {
    limparForm();

    setModoEdicao(false);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  // ============================================================
  // ABRIR EDIÇÃO
  // ============================================================

  function abrirEdicao(servico) {
    setServicoEditando(servico);

    setForm({
      nome: servico.nome || "",
      preco: servico.preco ?? "",
      duracaoMinutos: servico.duracaoMinutos ?? "",
      categoria: servico.categoria || "",
      ativo: servico.ativo ?? true,
    });

    setModoEdicao(true);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  // ============================================================
  // FECHAR MODAL
  // ============================================================

  function fecharModal() {
    if (salvando) {
      return;
    }

    setModalAberto(false);
    limparForm();
  }

  // ============================================================
  // ATUALIZAR CAMPO
  // ============================================================

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ============================================================
  // SALVAR SERVIÇO
  // ============================================================

  async function salvarServico(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      if (!form.nome.trim()) {
        throw new Error("Informe o nome do serviço.");
      }

      if (form.preco === "" || Number(form.preco) < 0) {
        throw new Error("Informe um preço válido.");
      }

      if (form.duracaoMinutos === "" || Number(form.duracaoMinutos) <= 0) {
        throw new Error("Informe uma duração válida.");
      }

      if (!form.categoria.trim()) {
        throw new Error("Informe a categoria do serviço.");
      }

      const corpo = {
        nome: form.nome.trim(),

        preco: Number(form.preco),

        duracaoMinutos: Number(form.duracaoMinutos),

        categoria: form.categoria.trim().toUpperCase(),

        ativo: form.ativo,
      };

      const url = modoEdicao
        ? `http://localhost:8080/servicos/${servicoEditando.id}`
        : "http://localhost:8080/servicos";

      const response = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(corpo),
      });

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível salvar o serviço.");
      }

      await carregarServicos();

      setModalAberto(false);

      limparForm();

      setSucesso(
        modoEdicao
          ? "Serviço atualizado com sucesso."
          : "Serviço cadastrado com sucesso.",
      );

      setTimeout(() => {
        setSucesso("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setErro(limparMensagemErro(error.message));
    } finally {
      setSalvando(false);
    }
  }

  // ============================================================
  // ALTERAR STATUS
  // ============================================================

  async function alterarStatus(servico) {
    try {
      setErro("");
      setSucesso("");

      const response = await fetch(
        `http://localhost:8080/servicos/${servico.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            nome: servico.nome,

            preco: servico.preco,

            duracaoMinutos: servico.duracaoMinutos,

            categoria: servico.categoria,

            ativo: !servico.ativo,
          }),
        },
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível alterar o status.");
      }

      await carregarServicos();

      setSucesso(
        servico.ativo
          ? "Serviço desativado com sucesso."
          : "Serviço ativado com sucesso.",
      );

      setTimeout(() => {
        setSucesso("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setErro(limparMensagemErro(error.message));
    }
  }

  // ============================================================
  // TRATAR ERRO
  // ============================================================

  function limparMensagemErro(mensagem) {
    if (!mensagem) {
      return "Ocorreu um erro.";
    }

    try {
      const objeto = JSON.parse(mensagem);

      return objeto.message || objeto.erro || mensagem;
    } catch {
      return mensagem;
    }
  }

  // ============================================================
  // FORMATAR PREÇO
  // ============================================================

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // ============================================================
  // FILTRAR SERVIÇOS
  // ============================================================

  const servicosFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    if (!texto) {
      return servicos;
    }

    return servicos.filter((servico) => {
      const nome = servico.nome?.toLowerCase() || "";

      const categoria = servico.categoria?.toLowerCase() || "";

      return nome.includes(texto) || categoria.includes(texto);
    });
  }, [servicos, busca]);

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="dono-serv-page">
      <DonoSidebar />

      <main className="dono-serv-main">
        {/* HEADER */}

        <header className="dono-serv-header">
          <div>
            <span>CATÁLOGO VILA BRANCA</span>

            <h1>Serviços</h1>

            <p>Gerencie os serviços, preços e disponibilidade.</p>
          </div>

          <button className="dono-serv-novo" onClick={abrirCadastro}>
            <Plus size={17} />
            Novo serviço
          </button>
        </header>

        {/* ERRO */}

        {erro && !modalAberto && (
          <div className="dono-serv-alert erro">{erro}</div>
        )}

        {/* SUCESSO */}

        {sucesso && <div className="dono-serv-alert sucesso">{sucesso}</div>}

        {/* CONTROLES */}

        <section className="dono-serv-controles">
          <div className="dono-serv-busca">
            <Search size={17} />

            <input
              type="text"
              placeholder="Buscar serviço ou categoria..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <span className="dono-serv-total">
            {servicosFiltrados.length} serviços
          </span>
        </section>

        {/* LISTAGEM */}

        {loading ? (
          <div className="dono-serv-loading">Carregando serviços...</div>
        ) : servicosFiltrados.length === 0 ? (
          <div className="dono-serv-vazio">
            <Scissors size={38} />

            <h2>Nenhum serviço encontrado</h2>

            <p>Cadastre um novo serviço ou altere a pesquisa.</p>
          </div>
        ) : (
          <section className="dono-serv-grid">
            {servicosFiltrados.map((servico) => (
              <article
                className={`dono-serv-card ${
                  !servico.ativo ? "desativado" : ""
                }`}
                key={servico.id}
              >
                <div className="dono-serv-card-top">
                  <div className="dono-serv-icon">
                    <Scissors size={20} />
                  </div>

                  <div className="dono-serv-card-acoes">
                    <button
                      className="dono-serv-status"
                      onClick={() => alterarStatus(servico)}
                      title={
                        servico.ativo ? "Desativar serviço" : "Ativar serviço"
                      }
                    >
                      {servico.ativo ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>

                    <button
                      className="dono-serv-editar"
                      onClick={() => abrirEdicao(servico)}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>

                <div className="dono-serv-card-titulo">
                  <span>{servico.categoria || "SEM CATEGORIA"}</span>

                  <h2>{servico.nome}</h2>
                </div>

                <div className="dono-serv-infos">
                  <div>
                    <DollarSign size={15} />

                    <span>Preço</span>

                    <strong>{formatarPreco(servico.preco)}</strong>
                  </div>

                  <div>
                    <Clock size={15} />

                    <span>Duração</span>

                    <strong>{servico.duracaoMinutos} min</strong>
                  </div>

                  <div>
                    <Tag size={15} />

                    <span>Status</span>

                    <strong className={servico.ativo ? "ativo" : "inativo"}>
                      {servico.ativo ? "Ativo" : "Inativo"}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* MODAL */}

      {modalAberto && (
        <div
          className="dono-serv-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModal();
            }
          }}
        >
          <div className="dono-serv-modal">
            <div className="dono-serv-modal-header">
              <div>
                <span>{modoEdicao ? "EDITAR SERVIÇO" : "NOVO SERVIÇO"}</span>

                <h2>{modoEdicao ? "Editar serviço" : "Cadastrar serviço"}</h2>
              </div>

              <button onClick={fecharModal} disabled={salvando}>
                <X size={19} />
              </button>
            </div>

            <form className="dono-serv-form" onSubmit={salvarServico}>
              {/* NOME */}

              <div className="dono-serv-form-group">
                <label>Nome</label>

                <input
                  name="nome"
                  type="text"
                  placeholder="Ex: Corte e Barba"
                  value={form.nome}
                  onChange={atualizarCampo}
                  required
                />
              </div>

              {/* CATEGORIA */}

              <div className="dono-serv-form-group">
                <label>Categoria</label>

                <input
                  name="categoria"
                  type="text"
                  placeholder="Ex: CORTE"
                  value={form.categoria}
                  onChange={atualizarCampo}
                  required
                />
              </div>

              {/* PREÇO + DURAÇÃO */}

              <div className="dono-serv-form-linha">
                <div className="dono-serv-form-group">
                  <label>Preço</label>

                  <input
                    name="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="35.00"
                    value={form.preco}
                    onChange={atualizarCampo}
                    required
                  />
                </div>

                <div className="dono-serv-form-group">
                  <label>Duração (min)</label>

                  <input
                    name="duracaoMinutos"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={form.duracaoMinutos}
                    onChange={atualizarCampo}
                    required
                  />
                </div>
              </div>

              {/* STATUS */}

              <label className="dono-serv-toggle-form">
                <div>
                  <strong>Serviço ativo</strong>

                  <span>
                    Serviços inativos não devem aparecer para novos
                    agendamentos.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="ativo"
                  checked={form.ativo}
                  onChange={atualizarCampo}
                />
              </label>

              {/* ERRO DO MODAL */}

              {erro && modalAberto && (
                <div className="dono-serv-form-erro">{erro}</div>
              )}

              {/* AÇÕES */}

              <div className="dono-serv-form-acoes">
                <button
                  type="button"
                  className="dono-serv-btn-cancelar"
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="dono-serv-btn-salvar"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : modoEdicao
                      ? "Salvar alterações"
                      : "Cadastrar serviço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonoServicos;
