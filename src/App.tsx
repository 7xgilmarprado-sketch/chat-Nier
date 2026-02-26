/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Save, RefreshCw, Download, Image as ImageIcon, Video } from 'lucide-react';

const DEFAULT_WEBHOOK = 'https://bango.app.n8n.cloud/webhook/chat';

export default function App() {
  // Estado para a URL do Webhook com persistência no localStorage
  const [webhookUrl, setWebhookUrl] = useState(() => {
    const saved = localStorage.getItem('cyberpunk_webhook_url');
    return saved || DEFAULT_WEBHOOK;
  });

  const [messages, setMessages] = useState<{ text?: string; image?: string; video?: string; isUser: boolean }[]>([
    { text: 'SOLTE A IMAGINAÇÃO, CRIE O QUE QUISER...', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempUrl, setTempUrl] = useState(webhookUrl);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll automático
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookUrl(tempUrl);
    localStorage.setItem('cyberpunk_webhook_url', tempUrl);
    setShowSettings(false);
    setMessages(prev => [...prev, { text: `CONFIGURAÇÃO ATUALIZADA: ENDPOINT DEFINIDO PARA ${tempUrl}`, isUser: false }]);
  };

  const resetSettings = () => {
    setTempUrl(DEFAULT_WEBHOOK);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setMessages(prev => [...prev, { text: trimmedInput, isUser: true }]);
    setInput('');
    setIsTyping(true);

    try {
      console.log(`Enviando para: ${webhookUrl}`);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json, image/*, video/*'
        },
        body: JSON.stringify({ message: trimmedInput, mode: mode })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Status: ${response.status} - ${errorText || 'Erro desconhecido'}`);
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('image/')) {
        // Se a resposta for uma imagem binária
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          text: 'IMAGEM RECEBIDA // DADOS_TATICOS', 
          image: imageUrl,
          isUser: false 
        }]);
      } else if (contentType && contentType.includes('video/')) {
        // Se a resposta for um vídeo binário
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          text: 'VÍDEO RECEBIDO // DADOS_TATICOS', 
          video: videoUrl,
          isUser: false 
        }]);
      } else {
        // Se a resposta for JSON
        const data = await response.json();
        setIsTyping(false);

        if (data && (data.reply || data.image || data.video)) {
          setMessages(prev => [...prev, { 
            text: data.reply, 
            image: data.image,
            video: data.video,
            isUser: false 
          }]);
        } else {
          console.warn('Resposta sem campos esperados:', data);
          setMessages(prev => [...prev, { text: 'SISTEMA: RESPOSTA RECEBIDA, MAS SEM CONTEÚDO VÁLIDO.', isUser: false }]);
        }
      }
    } catch (error: any) {
      console.error('Erro no Webhook:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: `ERRO DE CONEXÃO: ${error.message}. Certifique-se que o Webhook no n8n está ATIVO (ouvindo eventos de teste).`, 
        isUser: false 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#00ff88] font-mono overflow-hidden relative selection:bg-[#00ff88] selection:text-black">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.1)_0%,transparent_70%)]"></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Orbitron:wght@400;700&display=swap');
        
        :root {
          --neon: #00ff88;
          --neon-dim: #008844;
        }

        .font-display { font-family: 'Orbitron', sans-serif; }
        
        .neon-glow { text-shadow: 0 0 10px var(--neon), 0 0 20px rgba(0, 255, 136, 0.2); }
        
        .glitch-text {
          position: relative;
          animation: glitch 5s infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          1% { transform: translate(-2px, 2px); }
          2% { transform: translate(2px, -2px); }
          3% { transform: translate(0); }
          100% { transform: translate(0); }
        }

        .message-appear { 
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px) scale(0.98); filter: blur(10px); }
          to { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }

        .typing-dots::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }

        .scanline {
          width: 100%;
          height: 100px;
          z-index: 5;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 255, 136, 0.05) 50%, rgba(0, 0, 0, 0) 100%);
          opacity: 0.1;
          position: absolute;
          bottom: 100%;
          animation: scanline 10s linear infinite;
        }

        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: var(--neon); box-shadow: 0 0 10px var(--neon); }
      `}</style>

      <div className="scanline pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-[#00ff88]/30 backdrop-blur-md bg-black/40 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#008844] tracking-[0.3em] font-bold uppercase mb-1 opacity-70">Link de Dados Táticos</span>
          <h1 className="text-xl font-display font-bold tracking-[6px] uppercase neon-glow glitch-text">NIER // IMAGEM_IA</h1>
        </div>
        <button 
          onClick={() => { setShowSettings(true); setTempUrl(webhookUrl); }}
          className="group flex items-center gap-2 border border-[#00ff88]/50 px-4 py-2 text-[10px] font-bold uppercase hover:bg-[#00ff88] hover:text-black transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
        >
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> 
          <span className="hidden sm:inline">Configurações</span>
        </button>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="w-full max-w-md border-2 border-[#00ff88] bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(0,255,136,0.2)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff88] opacity-50"></div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#008844] tracking-widest uppercase mb-1">Configuração do Sistema</span>
                <h2 className="text-2xl font-display font-bold tracking-widest uppercase neon-glow">LINK_WEBHOOK</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-[#00ff88] hover:text-white hover:scale-110 transition-all cursor-pointer p-2">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={saveSettings} className="space-y-8">
                <div className="relative">
                    <label className="block text-[10px] uppercase mb-3 text-[#008844] tracking-widest font-bold">URL do Endpoint Alvo</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full bg-black/50 border-b-2 border-[#008844] p-4 text-sm text-[#00ff88] outline-none focus:border-[#00ff88] transition-all font-mono placeholder:text-[#008844]/30"
                            placeholder="https://api.endpoint.com/..."
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#00ff88] transition-all duration-500 group-focus-within:w-full"></div>
                    </div>
                </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-3 border-2 border-[#00ff88] py-4 text-xs font-bold uppercase hover:bg-[#00ff88] hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.1)] active:scale-95"
                >
                  <Save size={18} /> Confirmar Alterações
                </button>
                <button 
                  type="button"
                  onClick={resetSettings}
                  className="px-5 border-2 border-[#008844] py-4 text-xs font-bold uppercase hover:border-[#00ff88] hover:text-[#00ff88] transition-all cursor-pointer active:scale-95"
                  title="Restaurar Padrão"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-[#00ff88]/10">
                <p className="text-[9px] text-[#008844] uppercase tracking-widest leading-relaxed">
                    Aviso: Alterar o endpoint pode interromper o link tático. Os dados são armazenados na memória local volátil.
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col gap-6 z-10"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] sm:max-w-[70%] p-4 px-6 border-l-4 message-appear text-sm leading-relaxed break-words relative group
              ${msg.isUser 
                ? 'self-end bg-[#00ff88]/5 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.05)] rounded-sm' 
                : 'self-start bg-white/5 border-[#008844] text-white shadow-[0_0_20px_rgba(0,0,0,0.3)] rounded-sm'
              }`}
          >
            {/* Decorative corner elements */}
            <div className={`absolute top-0 ${msg.isUser ? 'right-0' : 'left-0'} w-2 h-2 border-t border-r border-[#00ff88]/30`}></div>
            
            <div className="flex flex-col">
                <span className={`text-[8px] uppercase tracking-widest mb-1 opacity-40 font-bold ${msg.isUser ? 'text-right' : 'text-left'}`}>
                    {msg.isUser ? 'Identidade_Usuario' : 'Sistema_Nier'} // {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.video && (
                  <div className="mt-3 overflow-hidden rounded-sm border border-[#00ff88]/20 group/vid relative">
                    <video 
                      src={msg.video} 
                      controls
                      className="max-w-full h-auto block"
                    />
                    <a 
                      href={msg.video} 
                      download={`nier-video-${Date.now()}.mp4`}
                      className="absolute top-2 right-2 bg-black/80 border border-[#00ff88] p-2 text-[#00ff88] hover:bg-[#00ff88] hover:text-black transition-all opacity-0 group-hover/vid:opacity-100 flex items-center gap-2 text-[10px] font-bold uppercase"
                      title="Baixar Vídeo"
                    >
                      <Download size={14} />
                      <span>Baixar</span>
                    </a>
                  </div>
                )}
                {msg.image && (
                  <div className="mt-3 overflow-hidden rounded-sm border border-[#00ff88]/20 group/img relative">
                    <img 
                      src={msg.image} 
                      alt="Dados Táticos" 
                      className="max-w-full h-auto block"
                      referrerPolicy="no-referrer"
                    />
                    <a 
                      href={msg.image} 
                      download={`nier-image-${Date.now()}.png`}
                      className="absolute bottom-2 right-2 bg-black/80 border border-[#00ff88] p-2 text-[#00ff88] hover:bg-[#00ff88] hover:text-black transition-all opacity-0 group-hover/img:opacity-100 flex items-center gap-2 text-[10px] font-bold uppercase"
                      title="Baixar Imagem"
                    >
                      <Download size={14} />
                      <span>Baixar</span>
                    </a>
                  </div>
                )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="self-start flex items-center gap-3 ml-2">
            <div className="w-1 h-4 bg-[#00ff88] animate-pulse"></div>
            <div className="text-[10px] text-[#00ff88] tracking-[0.2em] font-bold uppercase typing-dots">
              Processando Requisição
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 sm:p-10 border-t border-[#00ff88]/20 bg-black/60 backdrop-blur-md z-20">
        <div className="max-w-5xl mx-auto mb-6 flex justify-center">
            <div className="inline-flex bg-black/40 border border-[#00ff88]/20 p-1 rounded-sm">
                <button 
                    onClick={() => setMode('image')}
                    className={`flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase transition-all ${mode === 'image' ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]' : 'text-[#008844] hover:text-[#00ff88]'}`}
                >
                    <ImageIcon size={14} />
                    Imagem
                </button>
                <button 
                    onClick={() => setMode('video')}
                    className={`flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase transition-all ${mode === 'video' ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]' : 'text-[#008844] hover:text-[#00ff88]'}`}
                >
                    <Video size={14} />
                    Vídeo
                </button>
            </div>
        </div>
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-4">
            <div className="flex-1 relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="DIGITE O COMANDO DE CRIAÇÃO_"
                    className="w-full bg-transparent border-b-2 border-[#008844]/50 p-4 px-0 text-[#00ff88] outline-none focus:border-[#00ff88] transition-all font-mono placeholder:text-[#008844]/40"
                    autoComplete="off"
                    autoFocus
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#00ff88] transition-all duration-300 group-focus-within:w-full shadow-[0_0_10px_#00ff88]"></div>
            </div>
            <button 
                type="submit"
                className="group relative border-2 border-[#00ff88] text-[#00ff88] px-8 font-display font-bold uppercase cursor-pointer overflow-hidden transition-all hover:bg-[#00ff88] hover:text-black active:scale-95"
            >
                <span className="relative z-10 flex items-center gap-2">
                    Gerar <span className="text-[10px] opacity-50 group-hover:opacity-100">↵</span>
                </span>
            </button>
        </form>
        <div className="max-w-5xl mx-auto mt-4 flex justify-between items-center opacity-30 text-[8px] uppercase tracking-[0.3em] font-bold">
            <span>Segurança: Criptografado</span>
            <span>Status do Link: Estável</span>
            <span>NIER_OS_V2.4</span>
        </div>
      </div>
    </div>
  );
}
