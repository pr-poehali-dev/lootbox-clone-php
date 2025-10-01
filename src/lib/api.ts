const API_BASE = 'https://functions.poehali.dev';

export const API_ENDPOINTS = {
  users: `${API_BASE}/0716bee8-d167-4bf2-9ea0-44c350a7a9c6`,
  cases: `${API_BASE}/8e2923c9-1bd2-4e1a-9050-0e68e0862ba4`,
};

export const api = {
  async getCases() {
    const response = await fetch(API_ENDPOINTS.cases);
    return response.json();
  },
  
  async getCase(id: number) {
    const response = await fetch(`${API_ENDPOINTS.cases}?caseId=${id}`);
    return response.json();
  },
  
  async openCase(caseId: number, userId: number, token: string) {
    const response = await fetch(API_ENDPOINTS.cases, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Token': token,
      },
      body: JSON.stringify({ caseId, userId }),
    });
    return response.json();
  },
  
  async createUser(data: { username: string; email: string; authProvider: string; referralCode?: string }, token: string) {
    const response = await fetch(API_ENDPOINTS.users, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Token': token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  async getUser(userId: number, token: string) {
    const response = await fetch(`${API_ENDPOINTS.users}?userId=${userId}`, {
      headers: {
        'X-User-Token': token,
      },
    });
    return response.json();
  },
};
