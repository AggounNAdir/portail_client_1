// Service Commandes

import { CommandeIn, CommandeOut } from '../types';
import { apiClient } from './apiClient';

export class CommandeService {
  async getCommandes(limit = 20, offset = 0): Promise<CommandeOut[]> {
    return apiClient.request<CommandeOut[]>(
      `/commandes?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
      () => {
        const list = apiClient.getLocalCommandes();
        return list.slice(offset, offset + limit);
      }
    );
  }

  async creerCommande(commande: CommandeIn): Promise<CommandeOut> {
    return apiClient.request<CommandeOut>(
      '/commandes',
      {
        method: 'POST',
        body: JSON.stringify({
          observations: commande.observations || null,
          lignes: commande.lignes.map((l) => ({
            produit_id: l.produitId,
            quantite: l.quantite,
          })),
        }),
      },
      () => {
        return apiClient.addLocalCommande(commande);
      }
    );
  }
}

export const commandeService = new CommandeService();
