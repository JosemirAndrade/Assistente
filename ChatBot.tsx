import React, { useState } from 'react';

const flow = {
  start: {
    message: "Olá! Seja bem-vindo à TechPro Soluções em TI. Como posso ajudar?",
    options: [
      { label: "1️⃣ Suporte Técnico", next: "support" },
      { label: "2️⃣ Abrir Chamado", next: "ticket" },
      { label: "3️⃣ Conhecer Serviços", next: "services" },
      { label: "4️⃣ Falar com Atendente", next: "human" },
      { label: "5️⃣ Agendar Visita Técnica", next: "schedule" }
    ]
  },
  support: {
    message: "Qual o tipo de problema?",
    options: [
      { label: "1️⃣ Internet", next: "net_light" },
      { label: "2️⃣ Computador", next: "done" },
      { label: "3️⃣ Impressora", next: "done" },
      { label: "4️⃣ Outro", next: "ticket" }
    ]
  },
  net_light: {
    message: "A luz de Internet está acesa?",
    options: [
      { label: "✅ Sim", next: "restart_router" },
      { label: "❌ Não", next: "ticket" }
    ]
  },
  restart_router: {
    message: "Reinicie o roteador. Funcionou?",
    options: [
      { label: "✅ Sim", next: "done" },
      { label: "❌ Não", next: "ticket" }
    ]
  },
  ticket: {
    message: "Vamos registrar um chamado. Por favor, informe nome, telefone e o problema.",
    options: []
  },
  services: {
    message: "Oferecemos: Suporte, Redes, Segurança, Cloud e Consultoria.",
    options: []
  },
  human: {
    message: "Encaminhando para um atendente... Aguarde.",
    options: []
  },
  schedule: {
    message: "Informe nome, endereço, telefone e melhor horário.",
    options: []
  },
  done: {
    message: "Obrigado! Se precisar de mais ajuda, volte ao menu principal digitando 'menu'.",
    options: []
  }
};

const ChatBot = () => {
  const [current, setCurrent] = useState("start");
  const [messages, setMessages] = useState([flow["start"].message]);

  const handleOption = (next: string) => {
    if (flow[next]) {
      setMessages([...messages, flow[next].message]);
      setCurrent(next);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-lg font-bold text-blue-600">ChatBot TechPro</h1>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded">{msg}</div>
        ))}
        <div className="space-y-2">
          {flow[current]?.options?.map((opt, i) => (
            <button
              key={i}
              className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
              onClick={() => handleOption(opt.next)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
