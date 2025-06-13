import { UserData } from '../types';

// Simula um banco de dados local usando localStorage
export class DataManager {
  private static STORAGE_KEY = 'techpro_chatbot_data';

  static saveUserData(userData: UserData): void {
    const existingData = this.getAllUserData();
    existingData.push(userData);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
    
    // Simula notificação para administradores
    this.notifyAdmin(userData);
  }

  static getAllUserData(): UserData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  }

  static updateUserStatus(id: string, status: UserData['status']): void {
    const allData = this.getAllUserData();
    const updatedData = allData.map(item => 
      item.id === id ? { ...item, status } : item
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
  }

  static generateProtocol(type: 'ticket' | 'schedule' | 'human'): string {
    const prefix = type === 'ticket' ? 'TP' : type === 'schedule' ? 'AG' : 'AT';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `#${prefix}${year}${random}`;
  }

  static exportData(): string {
    const data = this.getAllUserData();
    const csvHeader = 'Protocolo,Tipo,Nome,Telefone,Problema/Endereço,Horário Preferido,Data/Hora,Status\n';
    const csvData = data.map(item => 
      `${item.protocol},${item.type},${item.name},${item.phone},"${item.problem || item.address || ''}",${item.preferredTime || ''},${item.timestamp.toLocaleString('pt-BR')},${item.status}`
    ).join('\n');
    
    return csvHeader + csvData;
  }

  private static notifyAdmin(userData: UserData): void {
    // Em produção, aqui você enviaria uma notificação real
    // Por exemplo: webhook, email, push notification, etc.
    console.log('🔔 Nova solicitação recebida:', userData);
    
    // Simula notificação visual
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TechPro - Nova Solicitação', {
        body: `${userData.name} - ${userData.type === 'ticket' ? 'Chamado Técnico' : userData.type === 'schedule' ? 'Agendamento' : 'Atendimento Humano'}`,
        icon: '/vite.svg'
      });
    }
  }

  static requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}