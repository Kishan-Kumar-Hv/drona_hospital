// MongoDB Express API Adapter for Live Token Booking System

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost:3000');

class MockQueryBuilder {
  private queryParams: any = {};
  private table: string;

  constructor(table: string) {
    this.table = table;
    if (this.table === 'callback_requests') {
      this.table = 'callbacks';
    }
  }

  select(fields?: string) {
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
        if (!column) return this;
        return {
          async then(onfulfilled?: (value: any) => any) {
            try {
              const headers: Record<string, string> = {
                'Content-Type': 'application/json',
              };

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
      }
    };
  }
}

export const supabase = {
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
