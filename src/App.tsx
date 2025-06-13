import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Phone, Clock, User, Settings, CheckCircle, Send, Shield } from 'lucide-react';
import { FlowNode, Message, UserData } from './types';
import { DataManager } from './utils/dataManager';
import { AdminPanel } from './components/AdminPanel';

const flow: Record<string, FlowNode> = {
  start: {
    message: "Olá! 👋 Seja bem-vindo à TechPro Soluções em TI.\n\nComo posso ajudar você hoje?",
    options: [
      { label: "🔧 Suporte Técnico", next: "support" },
      { label: "📋 Abrir Chamado", next: "ticket" },
      { label: "💼 Conhecer Serviços", next: "services" },
      { label: "👥 Falar com Atendente", next: "human" },
      { label: "📅 Agendar Visita Técnica", next: "schedule" }
    ]
  },
  support: {
    message: "Perfeito! Vamos resolver seu problema técnico. 🔍\n\nQual tipo de problema você está enfrentando?",
    options: [
      { label: "🌐 Problemas com Internet", next: "net_light" },
      { label: "💻 Problemas no Computador", next: "computer_help" },
      { label: "🖨️ Problemas com Impressora", next: "printer_help" },
      { label: "❓ Outro problema", next: "ticket" }
    ]
  },
  net_light: {
    message: "Vamos verificar sua conexão! 🔌\n\nA luz indicadora de Internet no seu roteador/modem está acesa?",
    options: [
      { label: "✅ Sim, está acesa", next: "restart_router" },
      { label: "❌ Não, está apagada", next: "ticket" }
    ]
  },
  restart_router: {
    message: "Ótimo! Vamos tentar uma solução rápida. ⚡\n\nPor favor, desconecte o roteador da tomada por 30 segundos e conecte novamente.\n\nA internet voltou a funcionar após reiniciar?",
    options: [
      { label: "✅ Sim, funcionou!", next: "done" },
      { label: "❌ Não, ainda não funciona", next: "ticket" }
    ]
  },
  computer_help: {
    message: "Entendi! Problemas no computador podem ser frustrantes. 💻\n\nVou abrir um chamado técnico para você. Nossa equipe especializada entrará em contato em breve.",
    options: [
      { label: "📋 Prosseguir com chamado", next: "ticket" },
      { label: "🏠 Voltar ao menu", next: "start" }
    ]
  },
  printer_help: {
    message: "Problemas com impressora são comuns! 🖨️\n\nNossa equipe técnica pode resolver rapidamente. Vou abrir um chamado para você.",
    options: [
      { label: "📋 Abrir chamado", next: "ticket" },
      { label: "🏠 Voltar ao menu", next: "start" }
    ]
  },
  ticket: {
    message: "Perfeito! Vou registrar um chamado técnico para você. 📝\n\nPor favor, me informe seu nome completo:",
    requiresInput: true,
    inputPlaceholder: "Digite seu nome completo..."
  },
  ticket_phone: {
    message: "Obrigado! Agora preciso do seu número de telefone:",
    requiresInput: true,
    inputPlaceholder: "Digite seu telefone (ex: 11 99999-9999)..."
  },
  ticket_problem: {
    message: "Perfeito! Agora descreva detalhadamente o problema que você está enfrentando:",
    requiresInput: true,
    inputPlaceholder: "Descreva o problema em detalhes..."
  },
  ticket_complete: {
    message: "Chamado registrado com sucesso! ✅\n\n[PROTOCOL_PLACEHOLDER]\n\nNossa equipe técnica entrará em contato em até 2 horas!\n\nObrigado por escolher a TechPro! 🚀",
    options: [
      { label: "🏠 Voltar ao menu principal", next: "start" }
    ]
  },
  services: {
    message: "Conheça nossos serviços especializados! 💼\n\n🔧 Suporte Técnico 24/7\n🌐 Configuração de Redes\n🔒 Segurança da Informação\n☁️ Soluções em Cloud Computing\n📊 Consultoria em TI\n\nPrecisa de mais informações sobre algum serviço?",
    options: [
      { label: "📞 Falar com consultor", next: "human" },
      { label: "📅 Agendar apresentação", next: "schedule" },
      { label: "🏠 Voltar ao menu", next: "start" }
    ]
  },
  human: {
    message: "Conectando você com nosso time! 👨‍💻\n\nPor favor, me informe seu nome para que eu possa transferir adequadamente:",
    requiresInput: true,
    inputPlaceholder: "Digite seu nome completo..."
  },
  human_phone: {
    message: "Obrigado! Agora preciso do seu telefone para que nosso atendente possa entrar em contato:",
    requiresInput: true,
    inputPlaceholder: "Digite seu telefone..."
  },
  human_complete: {
    message: "Perfeito! ✅\n\n[PROTOCOL_PLACEHOLDER]\n\nEstou transferindo sua conversa para um de nossos atendentes especializados. Você será contatado em instantes!\n\nObrigado por escolher a TechPro! 🚀",
    options: [
      { label: "🏠 Voltar ao menu principal", next: "start" }
    ]
  },
  schedule: {
    message: "Excelente escolha! 📅\n\nPara agendar sua visita técnica, preciso do seu nome completo:",
    requiresInput: true,
    inputPlaceholder: "Digite seu nome completo..."
  },
  schedule_address: {
    message: "Obrigado! Agora preciso do endereço completo onde será realizada a visita:",
    requiresInput: true,
    inputPlaceholder: "Digite o endereço completo..."
  },
  schedule_phone: {
    message: "Perfeito! Agora me informe seu telefone para contato:",
    requiresInput: true,
    inputPlaceholder: "Digite seu telefone..."
  },
  schedule_time: {
    message: "Qual o melhor período para a visita?",
    options: [
      { label: "🌅 Manhã (8h às 12h)", next: "schedule_complete" },
      { label: "🌞 Tarde (13h às 17h)", next: "schedule_complete" },
      { label: "🌆 Noite (18h às 20h)", next: "schedule_complete" }
    ]
  },
  schedule_complete: {
    message: "Agendamento realizado com sucesso! ✅\n\n[PROTOCOL_PLACEHOLDER]\n\nNossa equipe confirmará o horário exato em breve e entrará em contato!\n\nObrigado por escolher a TechPro! 🚀",
    options: [
      { label: "🏠 Voltar ao menu principal", next: "start" }
    ]
  },
  done: {
    message: "Fantástico! Problema resolvido! 🎉\n\nFico feliz em ter ajudado. Se precisar de mais alguma coisa, estarei sempre aqui!\n\nDigite 'menu' para voltar ao início ou escolha uma das opções abaixo:",
    options: [
      { label: "🏠 Menu principal", next: "start" },
      { label: "📞 Falar com atendente", next: "human" }
    ]
  }
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState("start");
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [userInfo, setUserInfo] = useState<{name?: string, phone?: string, problem?: string, address?: string, preferredTime?: string}>({});
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial message
    const initialMessage: Message = {
      text: flow.start.message,
      isBot: true,
      timestamp: new Date(),
      options: flow.start.options
    };
    setMessages([initialMessage]);
    
    // Request notification permission
    DataManager.requestNotificationPermission();
  }, []);

  const handleOptionClick = (option: { label: string; next: string }) => {
    // Add user's choice as message
    const userMessage: Message = {
      text: option.label,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Handle special cases for time selection
    if (currentNode === "schedule_time") {
      const timeMap: Record<string, string> = {
        "🌅 Manhã (8h às 12h)": "Manhã (8h às 12h)",
        "🌞 Tarde (13h às 17h)": "Tarde (13h às 17h)",
        "🌆 Noite (18h às 20h)": "Noite (18h às 20h)"
      };
      setUserInfo(prev => ({ ...prev, preferredTime: timeMap[option.label] }));
    }
    
    processNextNode(option.next);
  };

  const handleTextInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user's input as message
    const userMessage: Message = {
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Handle different input contexts
    let nextNode = "";
    if (currentNode === "ticket") {
      setUserInfo(prev => ({ ...prev, name: inputText }));
      nextNode = "ticket_phone";
    } else if (currentNode === "ticket_phone") {
      setUserInfo(prev => ({ ...prev, phone: inputText }));
      nextNode = "ticket_problem";
    } else if (currentNode === "ticket_problem") {
      setUserInfo(prev => ({ ...prev, problem: inputText }));
      nextNode = "ticket_complete";
    } else if (currentNode === "schedule") {
      setUserInfo(prev => ({ ...prev, name: inputText }));
      nextNode = "schedule_address";
    } else if (currentNode === "schedule_address") {
      setUserInfo(prev => ({ ...prev, address: inputText }));
      nextNode = "schedule_phone";
    } else if (currentNode === "schedule_phone") {
      setUserInfo(prev => ({ ...prev, phone: inputText }));
      nextNode = "schedule_time";
    } else if (currentNode === "human") {
      setUserInfo(prev => ({ ...prev, name: inputText }));
      nextNode = "human_phone";
    } else if (currentNode === "human_phone") {
      setUserInfo(prev => ({ ...prev, phone: inputText }));
      nextNode = "human_complete";
    }

    setInputText("");
    processNextNode(nextNode);
  };

  const processNextNode = (nextNodeKey: string) => {
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const nextNode = flow[nextNodeKey];
      if (nextNode) {
        let messageText = nextNode.message;
        
        // Handle completion nodes that need to save data and generate protocol
        if (nextNodeKey === "ticket_complete" || nextNodeKey === "schedule_complete" || nextNodeKey === "human_complete") {
          const type = nextNodeKey.includes('ticket') ? 'ticket' : 
                      nextNodeKey.includes('schedule') ? 'schedule' : 'human';
          
          const protocol = DataManager.generateProtocol(type);
          
          const userData: UserData = {
            id: Date.now().toString(),
            name: userInfo.name!,
            phone: userInfo.phone!,
            problem: userInfo.problem,
            address: userInfo.address,
            preferredTime: userInfo.preferredTime,
            timestamp: new Date(),
            type,
            status: 'pending',
            protocol
          };
          
          DataManager.saveUserData(userData);
          messageText = messageText.replace('[PROTOCOL_PLACEHOLDER]', `Seu protocolo é: ${protocol}`);
          
          // Reset user info for next interaction
          setUserInfo({});
        }
        
        const botMessage: Message = {
          text: messageText,
          isBot: true,
          timestamp: new Date(),
          options: nextNode.options
        };
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentNode(nextNodeKey);
      }
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const currentFlow = flow[currentNode];
  const showInput = currentFlow?.requiresInput && !isTyping;
  const showOptions = currentFlow?.options && !isTyping && !currentFlow?.requiresInput;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md mx-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">TechPro Suporte</h1>
            <p className="text-green-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
              Online agora
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAdminPanel(true)}
              className="text-green-200 hover:text-white transition-colors p-1"
              title="Painel Administrativo"
            >
              <Shield className="w-5 h-5" />
            </button>
            <Phone className="w-5 h-5 text-green-200" />
            <Settings className="w-5 h-5 text-green-200" />
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23000\" opacity=\"0.02\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%23000\" opacity=\"0.02\"/><circle cx=\"50\" cy=\"50\" r=\"0.5\" fill=\"%23000\" opacity=\"0.01\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')" }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
                  message.isBot
                    ? 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-bl-sm'
                    : 'bg-green-600 text-white shadow-md rounded-br-sm'
                }`}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                <div className={`flex items-center justify-end mt-2 space-x-1 ${
                  message.isBot ? 'text-gray-400' : 'text-green-100'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                  {!message.isBot && <CheckCircle className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-md border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        {showInput && (
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleTextInput} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={currentFlow.inputPlaceholder || "Digite sua mensagem..."}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Options */}
        {showOptions && (
          <div className="p-4 space-y-2 bg-white border-t">
            <p className="text-xs text-gray-500 text-center mb-3">Escolha uma opção:</p>
            {currentFlow.options!.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-blue-700 font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-100 p-3 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold text-green-600">TechPro</span> • Suporte 24/7
          </p>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;