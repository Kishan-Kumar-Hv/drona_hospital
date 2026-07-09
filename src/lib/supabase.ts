// MongoDB Express API Adapter
// Emulates Supabase JS Client interface and translates queries to HTTP calls to Express/Mongoose server.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let authListeners: Array<(event: string, session: any) => void> = [];

class MockQueryBuilder {
  private queryParams: any = {};

  constructor(private table: string) {
    if (this.table === 'callback_requests') {
      this.table = 'callbacks';
    }
  }

  select(fields?: string) {
    // Avoid unused warning
    if (fields) {
      this.queryParams.fields = fields;
    }
    return this;
  }

  order(column: string, options?: { ascending: boolean }) {
    this.queryParams.sort = column;
    this.queryParams.order = options?.ascending ? 'asc' : 'desc';
    return this;
  }

  eq(column: string, value: any) {
    this.queryParams.eq_column = column;
    this.queryParams.eq_value = value;
    return this;
  }

  maybeSingle() {
    this.queryParams.single = true;
    return this;
  }

  // Handle Promise compatibility
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      let url = `${API_BASE}/api/${this.table}`;
      
      if (this.queryParams.eq_column === 'id' || this.queryParams.eq_column === 'booking_id') {
        url += `/${this.queryParams.eq_value}`;
      } else if (this.queryParams.eq_column) {
        url += `?${this.queryParams.eq_column}=${encodeURIComponent(this.queryParams.eq_value)}`;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      const token = localStorage.getItem('mongo_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      const res = { data, error: null };
      return onfulfilled ? onfulfilled(res) : res;
    } catch (error: any) {
      console.error(`MockQueryBuilder SELECT error on ${this.table}:`, error);
      const res = { data: null, error: { message: error.message } };
      return onrejected ? onrejected(res) : res;
    }
  }

  insert(rows: any[]) {
    const table = this.table;
    return {
      async then(onfulfilled?: (value: any) => any) {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          const token = localStorage.getItem('mongo_auth_token');
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(`${API_BASE}/api/${table}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(rows[0]),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error ${response.status}`);
          }

          const data = await response.json();
          const res = { data: [data], error: null };
          return onfulfilled ? onfulfilled(res) : res;
        } catch (error: any) {
          console.error(`MockQueryBuilder INSERT error on ${table}:`, error);
          const res = { data: null, error: { message: error.message } };
          return onfulfilled ? onfulfilled(res) : res;
        }
      }
    };
  }

  update(row: any) {
    const table = this.table;
    return {
      eq: (column: string, value: any) => {
        // Avoid unused warning
        if (!column) return this;
        return {
          async then(onfulfilled?: (value: any) => any) {
            try {
              const headers: Record<string, string> = {
                'Content-Type': 'application/json',
              };
              const token = localStorage.getItem('mongo_auth_token');
              if (token) {
                headers['Authorization'] = `Bearer ${token}`;
              }

              const response = await fetch(`${API_BASE}/api/${table}/${value}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(row),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error ${response.status}`);
              }

              const data = await response.json();
              const res = { data: [data], error: null };
              return onfulfilled ? onfulfilled(res) : res;
            } catch (error: any) {
              console.error(`MockQueryBuilder UPDATE error on ${table}:`, error);
              const res = { data: null, error: { message: error.message } };
              return onfulfilled ? onfulfilled(res) : res;
            }
          }
        };
      },
      in: (column: string, values: any[]) => {
        // Avoid unused warning
        if (!column) return this;
        return {
          async then(onfulfilled?: (value: any) => any) {
            try {
              const headers: Record<string, string> = {
                'Content-Type': 'application/json',
              };
              const token = localStorage.getItem('mongo_auth_token');
              if (token) {
                headers['Authorization'] = `Bearer ${token}`;
              }

              const response = await fetch(`${API_BASE}/api/${table}/bulk-update`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ ids: values, updates: row }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error ${response.status}`);
              }

              const data = await response.json();
              const res = { data, error: null };
              return onfulfilled ? onfulfilled(res) : res;
            } catch (error: any) {
              console.error(`MockQueryBuilder BULK UPDATE error on ${table}:`, error);
              const res = { data: null, error: { message: error.message } };
              return onfulfilled ? onfulfilled(res) : res;
            }
          }
        };
      }
    };
  }

  delete() {
    const table = this.table;
    return {
      eq: (column: string, value: any) => {
        // Avoid unused warning
        if (!column) return this;
        return {
          async then(onfulfilled?: (value: any) => any) {
            try {
              const headers: Record<string, string> = {
                'Content-Type': 'application/json',
              };
              const token = localStorage.getItem('mongo_auth_token');
              if (token) {
                headers['Authorization'] = `Bearer ${token}`;
              }

              const response = await fetch(`${API_BASE}/api/${table}/${value}`, {
                method: 'DELETE',
                headers,
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error ${response.status}`);
              }

              const data = await response.json();
              const res = { data, error: null };
              return onfulfilled ? onfulfilled(res) : res;
            } catch (error: any) {
              console.error(`MockQueryBuilder DELETE error on ${table}:`, error);
              const res = { data: null, error: { message: error.message } };
              return onfulfilled ? onfulfilled(res) : res;
            }
          }
        };
      }
    };
  }
}

export const supabase = {
  auth: {
    async getSession() {
      const token = localStorage.getItem('mongo_auth_token');
      if (!token) return { data: { session: null } };
      try {
        const response = await fetch(`${API_BASE}/api/auth/session`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error();
        const session = await response.json();
        return { data: { session } };
      } catch {
        localStorage.removeItem('mongo_auth_token');
        return { data: { session: null } };
      }
    },

    async signInWithPassword({ email, password }: any) {
      try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          const errData = await response.json();
          return { error: { message: errData.error || 'Login failed' } };
        }
        
        const { token, session } = await response.json();
        localStorage.setItem('mongo_auth_token', token);
        authListeners.forEach((listener) => listener('SIGNED_IN', session));
        return { error: null };
      } catch (error: any) {
        return { error: { message: error.message } };
      }
    },

    async signOut() {
      localStorage.removeItem('mongo_auth_token');
      authListeners.forEach((listener) => listener('SIGNED_OUT', null));
      return { error: null };
    },

    onAuthStateChange(callback: any) {
      authListeners.push(callback);
      this.getSession().then(({ data }) => {
        callback('INITIAL_SESSION', data.session);
      });
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners = authListeners.filter((l) => l !== callback);
            }
          }
        }
      };
    }
  },

  from(table: string) {
    return new MockQueryBuilder(table);
  },

  rpc(fnName: string, params: any) {
    return {
      async then(onfulfilled?: (value: any) => any) {
        try {
          const response = await fetch(`${API_BASE}/api/rpc/${fnName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error ${response.status}`);
          }

          const data = await response.json();
          const res = { data, error: null };
          return onfulfilled ? onfulfilled(res) : res;
        } catch (error: any) {
          console.error(`Mock rpc call error for ${fnName}:`, error);
          const res = { data: null, error: { message: error.message } };
          return onfulfilled ? onfulfilled(res) : res;
        }
      }
    };
  }
};

export const isSupabaseConfigured = true;
