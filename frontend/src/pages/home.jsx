import { useState, useEffect } from 'react'
import api from '../services/api'
import FormPersonagem from '../components/FormPersonagem'
import FormClasse from '../components/FormClasse'
import FormHabilidade from '../components/FormHabilidade'
import FormItem from '../components/FormItem'
import FormQuest from '../components/FormQuest'
import GerenciarMesa from './GerenciarMesa'

function Home({ usuario, mesa, onLogout }) {
  const [painelAberto, setPainelAberto] = useState(null)
  const [personagem, setPersonagem] = useState(null)
  const [classes, setClasses] = useState([])
  const [quests, setQuests] = useState([])
  const [habilidades, setHabilidades] = useState([])
  const [listaPersonagens, setListaPersonagens] = useState([])
  const [subPainel, setSubPainel] = useState(null)
  const [mostrarFormPersonagem, setMostrarFormPersonagem] = useState(false)
  const [mostrarFormClasse, setMostrarFormClasse] = useState(false)
  const [mostrarFormHabilidade, setMostrarFormHabilidade] = useState(false)
  const [mostrarFormItem, setMostrarFormItem] = useState(false)
  const [mostrarFormQuest, setMostrarFormQuest] = useState(false)
  const [mostrarGerenciarMesa, setMostrarGerenciarMesa] = useState(false)

  const carregarPersonagem = async (p) => {
    const questIds = p.quests.map(q => q.questId)
    const habilidadeIds = p.habilidades

    const [questsRes, habilidadesRes] = await Promise.all([
      Promise.all(questIds.map(id => api.get(`/quests/${id}`))),
      Promise.all(habilidadeIds.map(id => api.get(`/habilidades/${id}`)))
    ])

    setPersonagem(p)
    setQuests(questsRes.map(r => r.data))
    setHabilidades(habilidadesRes.map(r => r.data))
  }

  useEffect(() => {
    api.get('/personagens')
      .then(res => {
        setListaPersonagens(res.data)
        if (usuario.tipo === 'jogador' && mesa) {
          const jogador = mesa.jogadores.find(j => j.usuarioId === usuario.id)
          if (jogador && jogador.personagemId) {
            const personagemDesignado = res.data.find(p => p._id === jogador.personagemId)
            if (personagemDesignado) return carregarPersonagem(personagemDesignado)
          }
        } else if (res.data.length > 0) {
          return carregarPersonagem(res.data[0])
        }
      })
      .catch(err => console.log(err))
  }, [])  

  const togglePainel = (painel) => {
    setPainelAberto(painelAberto === painel ? null : painel)
  }
  return (
    <div className="flex h-screen bg-[#0b1c2c] text-white overflow-hidden font-sans">

      {/* Painel esquerdo - Personagens */}
      {painelAberto === 'personagens' && (
        <div className="flex flex-col w-72 bg-[#1a1a2e] border-r border-[#ffffff15] p-5 gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#ffffff15] pb-3">
            <div className="flex items-center gap-2">
              <img src="/images/icone-menu-personagens.png" alt="Personagem" className="w-7 h-7 object-contain" />
              <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Personagens e Classes</span>
            </div>
            <button onClick={() => setPainelAberto(null)} className="text-gray-400 hover:text-white transition text-lg">«</button>
          </div>
          <div className="flex flex-col gap-3">
            {usuario.tipo === 'mestre' && (
              <button
                onClick={() => setSubPainel(subPainel === 'lista' ? null : 'lista')}
                className="w-full py-2 px-4 rounded-lg border border-[#ffffff20] text-sm text-gray-300 hover:border-purple-500 hover:text-white hover:bg-[#ffffff08] transition tracking-wide text-left">
                Lista de personagens
              </button>
            )}
            {usuario.tipo === 'mestre' && (
              <>
                <button
                  onClick={() => setMostrarFormPersonagem(true)}
                  className="w-full py-2 px-4 rounded-lg border border-[#ffffff20] text-sm text-gray-300 hover:border-purple-500 hover:text-white hover:bg-[#ffffff08] transition tracking-wide text-left">
                  Adicionar novo personagem
                </button>
                <button
                  onClick={() => setMostrarFormClasse(true)}
                  className="w-full py-2 px-4 rounded-lg border border-[#ffffff20] text-sm text-gray-300 hover:border-purple-500 hover:text-white hover:bg-[#ffffff08] transition tracking-wide text-left">
                  Adicionar nova classe
                </button>
              </>
            )}
          </div>

          {/* Lista de personagens */}
          {subPainel === 'lista' && (
            <div className="flex flex-col gap-2 mt-2">
              {listaPersonagens.map((p) => (
                <button
                  key={p._id}
                  onClick={() => carregarPersonagem(p)}
                  className="w-full py-2 px-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10] text-sm text-gray-300 hover:border-purple-500 hover:text-white transition text-left">
                  {p.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Painel esquerdo - Habilidades */}
      {painelAberto === 'habilidades' && (
        <div className="flex flex-col w-72 bg-[#1a1a2e] border-r border-[#ffffff15] p-5 gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#ffffff15] pb-3">
            <div className="flex items-center gap-2">
              <img src="/images/icone-menu-habilidades.png" alt="Habilidades" className="w-7 h-7 object-contain" />
              <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Habilidades</span>
            </div>
            <button onClick={() => setPainelAberto(null)} className="text-gray-400 hover:text-white transition text-lg">«</button>
          </div>
          <div className="flex flex-col gap-3">
            {usuario.tipo === 'mestre' && (
              <button
                onClick={() => setMostrarFormHabilidade(true)}
                className="w-full py-2 px-4 rounded-lg border border-[#ffffff20] text-sm text-gray-300 hover:border-purple-500 hover:text-white hover:bg-[#ffffff08] transition tracking-wide text-left">
                Adicionar habilidade
              </button>
            )}
          </div>
        </div>
      )}

      {/* Painel esquerdo - Inventário */}
      {painelAberto === 'inventario' && (
        <div className="flex flex-col w-72 bg-[#1a1a2e] border-r border-[#ffffff15] p-5 gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#ffffff15] pb-3">
            <div className="flex items-center gap-2">
              <img src="/images/icone-menu-itens.png" alt="Inventário" className="w-7 h-7 object-contain" />
              <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Inventário</span>
            </div>
            <button onClick={() => setPainelAberto(null)} className="text-gray-400 hover:text-white transition text-lg">«</button>
          </div>
          <div className="flex flex-col gap-3">
            {usuario.tipo === 'mestre' && (
              <button
                onClick={() => setMostrarFormItem(true)}
                className="w-full py-2 px-4 rounded-lg border border-[#ffffff20] text-sm text-gray-300 hover:border-purple-500 hover:text-white hover:bg-[#ffffff08] transition tracking-wide text-left">
                Adicionar item
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menu lateral esquerdo */}
      <div className="flex flex-col items-center gap-6 py-6 px-2 bg-[#555559d6] border-r border-[#ffffff10] w-14">
        {[
          { id: 'personagens', icon: '/images/icone-menu-personagens.png' },
          { id: 'habilidades', icon: '/images/icone-menu-habilidades.png' },
          { id: 'inventario', icon: '/images/icone-menu-itens.png' },
        ].map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => togglePainel(id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
              ${painelAberto === id
                ? 'bg-purple-700 shadow-lg shadow-purple-900'
                : 'hover:bg-[#ffffff10]'}`}
          >
            <img src={icon} alt={id} className="w-7 h-7 object-contain" />
          </button>
        ))}
      </div>

      {/* Área central */}
      <div className="flex flex-col flex-1 items-center justify-center gap-8 relative">

        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">Personagem ativo</p>

        {/* Avatar */}
        <div className="relative">
          <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl shadow-blue-900 border-4 border-[#ffffff15] bg-blue-900 flex items-center justify-center">
            <img src="/images/Personagem.png" alt="Personagem" className="w-36 h-36 object-contain" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border border-[#ffffff20] px-4 py-1 rounded-full text-xs tracking-widest text-gray-300 whitespace-nowrap">
            {personagem ? `${personagem.nome} • Nível ${personagem.nivel}` : 'Carregando...'}
          </div>
        </div>

        {/* Barras de vida e mana */}
        <div className="flex gap-6 mt-4">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-xs text-gray-500 tracking-widest uppercase">Vida</span>
            <div className="w-48 h-7 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff10]">
              <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full flex items-center justify-center text-xs font-bold tracking-wider">
                {personagem ? `${personagem.vida}/${personagem.vida}` : '...'}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-xs text-gray-500 tracking-widest uppercase">Mana</span>
            <div className="w-48 h-7 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff10]">
              <div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold tracking-wider">
                {personagem ? `${personagem.mana}/${personagem.mana}` : '...'}
              </div>
            </div>
          </div>
        </div>

        {/* Habilidades e itens */}
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 tracking-widest uppercase">Habilidades</span>
              <div className="flex gap-2">
                {habilidades.map((habilidade, i) => (
                  <div key={i} title={habilidade.nome} className="w-12 h-12 bg-[#ffffff08] border border-[#ffffff15] rounded-xl flex items-center justify-center hover:border-purple-500 hover:bg-[#ffffff12] transition cursor-pointer shadow-lg">
                  <img src={`/images/icone-habilidade-${i + 1}.png`} alt={habilidade.nome} className="w-8 h-8 object-contain" />
                </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 tracking-widest uppercase">Consumíveis</span>
            <div className="flex gap-2">
              {[
                { icon: '/images/icone-item-1.png', qty: 3 },
                { icon: '/images/icone-item-2.png', qty: 2 }
              ].map((item, i) => (
                <div key={i} className="relative w-12 h-12 bg-[#ffffff08] border border-[#ffffff15] rounded-xl flex items-center justify-center hover:border-cyan-500 hover:bg-[#ffffff12] transition cursor-pointer shadow-lg">
                  <img src={item.icon} alt={`item-${i}`} className="w-8 h-8 object-contain" />
                  <span className="absolute -bottom-1 -right-1 bg-[#0d0d1a] border border-[#ffffff20] text-xs w-5 h-5 flex items-center justify-center rounded-full text-gray-300">
                    {item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Painel direito - Missões */}
      {painelAberto === 'missoes' && (
        <div className="flex flex-col w-72 bg-[#555559d6] border-l border-[#ffffff15] p-5 gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#ffffff15] pb-3">
            <button onClick={() => setPainelAberto(null)} className="text-gray-400 hover:text-white transition text-lg">»</button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Objetivos</span>
              <img src="/images/icone-quest.png" alt="quest" className="w-7 h-7 object-contain" />
            </div>
          </div>
          {usuario.tipo === 'mestre' && (
            <button
              onClick={() => setMostrarFormQuest(true)}
              className="w-full py-2 px-4 rounded-lg border border-[#ffffff20] text-sm text-gray-300 hover:border-yellow-500 hover:text-white hover:bg-[#ffffff08] transition tracking-wide text-left">
              Adicionar quest
            </button>
          )}
          <div className="flex flex-col gap-4">
            {quests.map((quest, i) => (
              <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">◆</span>
                  <span className="text-sm font-bold text-gray-200">{quest.nome}</span>
                </div>
                <span className="text-xs text-gray-400 pl-5">Recompensa: {quest.recompensa} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de missões direita */}
      <div className="flex flex-col items-center justify-between py-6 px-2 bg-[#555559d6] border-l border-[#ffffff10] w-14 h-full">
        {usuario.tipo === 'mestre' && (
          <button
            onClick={() => setMostrarGerenciarMesa(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-900 transition-all text-lg"
            title="Gerenciar mesa"
          >
            ⚙️
          </button>
        )}
        <button
          onClick={() => togglePainel('missoes')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
            ${painelAberto === 'missoes'
              ? 'bg-yellow-700 shadow-lg shadow-yellow-900'
              : 'hover:bg-[#ffffff10]'}`}
        >
          <img src="/images/icone-quest.png" alt="missoes" className="w-7 h-7 object-contain" />
        </button>
        <button
          onClick={onLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-900 transition-all text-lg"
          title="Sair"
        >
          ⏻
        </button>
      </div>

      {mostrarFormPersonagem && (
        <FormPersonagem
          onFechar={() => setMostrarFormPersonagem(false)}
          onSalvar={() => api.get('/personagens').then(res => setListaPersonagens(res.data))}
        />
      )}

      {mostrarFormClasse && (
        <FormClasse
          onFechar={() => setMostrarFormClasse(false)}
          onSalvar={() => api.get('/classes').then(res => setClasses(res.data))}
        />
      )}

      {mostrarFormHabilidade && (
        <FormHabilidade
          onFechar={() => setMostrarFormHabilidade(false)}
          onSalvar={() => api.get('/habilidades').then(res => res.data)}
        />
      )}

      {mostrarFormItem && (
        <FormItem
          onFechar={() => setMostrarFormItem(false)}
          onSalvar={() => api.get('/itens').then(res => res.data)}
        />
      )}

      {mostrarFormQuest && (
        <FormQuest
          onFechar={() => setMostrarFormQuest(false)}
          onSalvar={() => api.get('/quests').then(res => res.data)}
        />
      )}

      {mostrarGerenciarMesa && (
        <GerenciarMesa
          mesa={mesa}
          usuario={usuario}
          onFechar={() => setMostrarGerenciarMesa(false)}
        />
      )}

    </div>
  )
}

export default Home