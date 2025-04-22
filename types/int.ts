export type IntegrationStatus = 'connected' | 'disconnected' | 'pending';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: IntegrationStatus;
  lastConnected?: string;
  enabled: boolean;
}