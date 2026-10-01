import {
  Mail,
  Pencil,
  Percent,
  Phone,
  Plus,
  Scissors,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import DonoSidebar from "../../Components/DonoSidebar/DonoSidebar";

import "./donoBarbeiros.css";

function DonoBarbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [busca, setBusca] = useState("");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [barbeiroEditando, setBarbeiroEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    senha: "",
    comissaoPercentual: "",
  });

  // ============================================================
  // CARREGAR BARBEIROS
  // ============================================================

  async function carregarBarbeiros() {
    try {
      setLoading(true);
      setErro("");

      const response = await fetch("http://localhost:8080/barbeiros", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar os barbeiros.");
      }

      const data = await response.json();

      setBarbeiros(data || []);
    } catch (error) {
      console.error(error);

      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarBarbeiros();
  }, []);

  // ============================================================
  // LIMPAR FORMULÁRIO
  // ============================================================

  function limparForm() {
    setForm({
      nome: "",
      telefone: "",
      email: "",
      senha: "",
      comissaoPercentual: "",
    });

    setBarbeiroEditando(null);
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

  function abrirEdicao(barbeiro) {
    setBarbeiroEditando(barbeiro);

    setForm({
      nome: barbeiro.nome || "",
      telefone: barbeiro.telefone || "",
      email: barbeiro.usuario?.email || "",
      senha: "",
      comissaoPercentual: barbeiro.comissaoPercentual ?? "",
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
    const { name, value } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // ============================================================
  // SALVAR BARBEIRO
  // ============================================================

  async function salvarBarbeiro(event) {
    event.preventDefault();

    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      if (!form.nome.trim()) {
        throw new Error("Informe o nome do barbeiro.");
      }

      if (!form.telefone.trim()) {
        throw new Error("Informe o telefone.");
      }

      if (
        form.comissaoPercentual === "" ||
        Number(form.comissaoPercentual) < 0 ||
        Number(form.comissaoPercentual) > 100
      ) {
        throw new Error("Informe uma comissão entre 0% e 100%.");
      }

      if (modoEdicao) {
        await atualizarBarbeiro();
      } else {
        await cadastrarBarbeiro();
      }

      await carregarBarbeiros();

      setModalAberto(false);
      limparForm();

      setSucesso(
        modoEdicao
          ? "Barbeiro atualizado com sucesso."
          : "Barbeiro cadastrado com sucesso.",
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
  // CADASTRAR BARBEIRO
  // ============================================================

  async function cadastrarBarbeiro() {
    if (!form.email.trim()) {
      throw new Error("Informe o e-mail do barbeiro.");
    }

    if (!form.senha) {
      throw new Error("Informe uma senha para o barbeiro.");
    }

    const response = await fetch(
      "http://localhost:8080/auth/registro-barbeiro",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          nome: form.nome.trim(),
          telefone: form.telefone.trim(),
          email: form.email.trim(),
          senha: form.senha,
          comissaoPercentual: Number(form.comissaoPercentual),
        }),
      },
    );

    if (!response.ok) {
      const mensagem = await response.text();

      throw new Error(mensagem || "Não foi possível cadastrar o barbeiro.");
    }
  }

  // ============================================================
  // ATUALIZAR BARBEIRO
  // ============================================================

  async function atualizarBarbeiro() {
    const response = await fetch(
      `http://localhost:8080/barbeiros/${barbeiroEditando.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          nome: form.nome.trim(),
          telefone: form.telefone.trim(),
          comissaoPercentual: Number(form.comissaoPercentual),
        }),
      },
    );

    if (!response.ok) {
      const mensagem = await response.text();

      throw new Error(mensagem || "Não foi possível atualizar o barbeiro.");
    }
  }

  // ============================================================
  // TRATAR MENSAGEM DE ERRO
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
  // FILTRO
  // ============================================================

  const barbeirosFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    if (!texto) {
      return barbeiros;
    }

    return barbeiros.filter((barbeiro) => {
      const nome = barbeiro.nome?.toLowerCase() || "";

      const telefone = barbeiro.telefone?.toLowerCase() || "";

      const email = barbeiro.usuario?.email?.toLowerCase() || "";

      return (
        nome.includes(texto) ||
        telefone.includes(texto) ||
        email.includes(texto)
      );
    });
  }, [barbeiros, busca]);

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="dono-bar-page">
      <DonoSidebar />

      <main className="dono-bar-main">
        {/* HEADER */}

        <header className="dono-bar-header">
          <div>
            <span>EQUIPE VILA BRANCA</span>

            <h1>Barbeiros</h1>

            <p>Gerencie os profissionais, seus dados e comissões.</p>
          </div>

          <button className="dono-bar-novo" onClick={abrirCadastro}>
            <Plus size={17} />
            Novo barbeiro
          </button>
        </header>

        {/* ERRO */}

        {erro && !modalAberto && (
          <div className="dono-bar-alert erro">{erro}</div>
        )}

        {/* SUCESSO */}

        {sucesso && <div className="dono-bar-alert sucesso">{sucesso}</div>}

        {/* CONTROLES */}

        <section className="dono-bar-controles">
          <div className="dono-bar-busca">
            <Search size={17} />

            <input
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <div className="dono-bar-contador">
            <UserRound size={16} />

            <span>
              {barbeirosFiltrados.length}{" "}
              {barbeirosFiltrados.length === 1 ? "barbeiro" : "barbeiros"}
            </span>
          </div>
        </section>

        {/* LISTAGEM */}

        {loading ? (
          <div className="dono-bar-loading">Carregando barbeiros...</div>
        ) : barbeirosFiltrados.length === 0 ? (
          <div className="dono-bar-vazio">
            <Scissors size={38} />

            <h2>Nenhum barbeiro encontrado</h2>

            <p>Cadastre um profissional ou altere sua pesquisa.</p>
          </div>
        ) : (
          <section className="dono-bar-grid">
            {barbeirosFiltrados.map((barbeiro) => (
              <article className="dono-bar-card" key={barbeiro.id}>
                <div className="dono-bar-card-top">
                  <div className="dono-bar-avatar">
                    <Scissors size={20} />
                  </div>

                  <button
                    className="dono-bar-editar"
                    onClick={() => abrirEdicao(barbeiro)}
                    title="Editar barbeiro"
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="dono-bar-card-nome">
                  <span>BARBEIRO</span>

                  <h2>{barbeiro.nome}</h2>
                </div>

                <div className="dono-bar-card-infos">
                  <div>
                    <Phone size={15} />

                    <span>{barbeiro.telefone || "Não informado"}</span>
                  </div>

                  <div>
                    <Mail size={15} />

                    <span>
                      {barbeiro.usuario?.email || "E-mail não informado"}
                    </span>
                  </div>

                  <div>
                    <Percent size={15} />

                    <span>Comissão</span>

                    <strong>
                      {Number(barbeiro.comissaoPercentual || 0).toLocaleString(
                        "pt-BR",
                        {
                          maximumFractionDigits: 2,
                        },
                      )}
                      %
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
          className="dono-bar-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModal();
            }
          }}
        >
          <div className="dono-bar-modal">
            <div className="dono-bar-modal-header">
              <div>
                <span>
                  {modoEdicao ? "EDITAR PROFISSIONAL" : "NOVO PROFISSIONAL"}
                </span>

                <h2>{modoEdicao ? "Editar barbeiro" : "Cadastrar barbeiro"}</h2>
              </div>

              <button onClick={fecharModal} disabled={salvando}>
                <X size={19} />
              </button>
            </div>

            <form className="dono-bar-form" onSubmit={salvarBarbeiro}>
              {/* NOME */}

              <div className="dono-bar-form-group">
                <label>Nome</label>

                <input
                  name="nome"
                  type="text"
                  placeholder="Nome completo"
                  value={form.nome}
                  onChange={atualizarCampo}
                  required
                />
              </div>

              {/* TELEFONE + COMISSÃO */}

              <div className="dono-bar-form-linha">
                <div className="dono-bar-form-group">
                  <label>Telefone</label>

                  <input
                    name="telefone"
                    type="text"
                    placeholder="(83) 99999-9999"
                    value={form.telefone}
                    onChange={atualizarCampo}
                    required
                  />
                </div>

                <div className="dono-bar-form-group">
                  <label>Comissão (%)</label>

                  <input
                    name="comissaoPercentual"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="40"
                    value={form.comissaoPercentual}
                    onChange={atualizarCampo}
                    required
                  />
                </div>
              </div>

              {/* E-MAIL */}

              <div className="dono-bar-form-group">
                <label>E-mail</label>

                <input
                  name="email"
                  type="email"
                  placeholder="barbeiro@email.com"
                  value={form.email}
                  onChange={atualizarCampo}
                  disabled={modoEdicao}
                  required={!modoEdicao}
                />

                {modoEdicao && (
                  <small>O e-mail não será alterado nesta tela.</small>
                )}
              </div>

              {/* SENHA */}

              {!modoEdicao && (
                <div className="dono-bar-form-group">
                  <label>Senha inicial</label>

                  <input
                    name="senha"
                    type="password"
                    placeholder="Digite a senha inicial"
                    value={form.senha}
                    onChange={atualizarCampo}
                    required
                  />

                  <small>
                    O barbeiro usará essa senha para acessar o sistema.
                  </small>
                </div>
              )}

              {/* ERRO DO MODAL */}

              {erro && modalAberto && (
                <div className="dono-bar-form-erro">{erro}</div>
              )}

              {/* AÇÕES */}

              <div className="dono-bar-form-acoes">
                <button
                  type="button"
                  className="dono-bar-btn-cancelar"
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="dono-bar-btn-salvar"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : modoEdicao
                      ? "Salvar alterações"
                      : "Cadastrar barbeiro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonoBarbeiros;
