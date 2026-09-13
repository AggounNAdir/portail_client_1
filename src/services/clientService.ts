// Service Client & Finances

import { ClientProfile, Facture, Versement, BonVente } from '../types';
import { apiClient } from './apiClient';

export class ClientService {
  async getMyProfile(): Promise<ClientProfile> {
    return apiClient.request<ClientProfile>(
      '/clients/me',
      { method: 'GET' },
      () => apiClient.getLocalProfile()
    );
  }

  async getFactures(limit = 20, offset = 0): Promise<Facture[]> {
    return apiClient.request<Facture[]>(
      `/clients/me/factures?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
      () => apiClient.getLocalFactures().slice(offset, offset + limit)
    );
  }

  async getVersements(limit = 20, offset = 0): Promise<Versement[]> {
    return apiClient.request<Versement[]>(
      `/clients/me/versements?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
      () => apiClient.getLocalVersements().slice(offset, offset + limit)
    );
  }

  async getVentes(limit = 20, offset = 0): Promise<BonVente[]> {
    return apiClient.request<BonVente[]>(
      `/clients/me/ventes?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
      () => apiClient.getLocalVentes().slice(offset, offset + limit)
    );
  }
}

export const clientService = new ClientService();
