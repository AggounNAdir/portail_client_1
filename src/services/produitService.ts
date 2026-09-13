// Service Produits Catalogue

import { ProduitCatalogue } from '../types';
import { apiClient } from './apiClient';

export class ProduitService {
  async getCatalogue(query?: string, limit = 50, offset = 0): Promise<ProduitCatalogue[]> {
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (query && query.trim()) {
      searchParams.set('q', query.trim());
    }

    return apiClient.request<ProduitCatalogue[]>(
      `/produits?${searchParams.toString()}`,
      { method: 'GET' },
      () => {
        let items = apiClient.getLocalProduits();
        if (query && query.trim()) {
          const q = query.trim().toLowerCase();
          items = items.filter(
            (p) =>
              p.code.toLowerCase().includes(q) ||
              p.designation.toLowerCase().includes(q)
          );
        }
        return items.slice(offset, offset + limit);
      }
    );
  }
}

export const produitService = new ProduitService();
