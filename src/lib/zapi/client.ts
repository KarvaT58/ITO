// import { ZApiActionContext } from './types';

export async function zapiFetch<T>(args: {
  instanceId: string;
  instanceToken: string;
  clientSecurityToken: string;
  path: string;
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE';
  body?: unknown;
  query?: Record<string, string>;
}): Promise<T> {
  const { instanceId, instanceToken, clientSecurityToken, path, method = 'GET', body, query } = args;
  
  // Debug logs
  console.log('🔍 Z-API Debug:', { instanceId, instanceToken: instanceToken?.substring(0, 10) + '...', clientSecurityToken: clientSecurityToken?.substring(0, 10) + '...', path });
  
  let url = `https://api.z-api.io/instances/${instanceId}/token/${instanceToken}${path}`;
  
  if (query) {
    const searchParams = new URLSearchParams(query);
    url += `?${searchParams.toString()}`;
  }
  const headers: Record<string, string> = {
    'Client-Token': clientSecurityToken
  };
  const init: RequestInit = { method, headers };

  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
    // Mapear { value } -> { valor } quando necessário (apenas para objetos, não arrays)
    const payload = typeof body === 'object' && body !== null && !Array.isArray(body)
      ? mapAppBodyToZapi(body as Record<string, unknown>)
      : body;
    init.body = payload ? JSON.stringify(payload) : undefined;
    
    // Debug log
    console.log('Z-API Request:', { url, method, headers, body: init.body });
  }

  try {
    const res = await fetch(url, init);
    
    if (res.status === 405) throw new Error('405: Método incorreto (verifique PUT/POST/GET).');
    if (res.status === 415) throw new Error('415: Content-Type ausente/incorreto, use application/json.');
    
    if (!res.ok) {
      let errorMessage = `Erro ${res.status}`;
      try {
        const errorText = await res.text();
        if (errorText && errorText.trim()) {
          errorMessage = errorText;
        }
      } catch (textError) {
        console.error('Erro ao ler resposta de erro:', textError);
      }
      throw new Error(`${res.status}: ${errorMessage}`);
    }
    
    const result = await res.json();
    console.log('Z-API Response:', result);
    return result as T;
  } catch (error) {
    console.error('Z-API Fetch Error:', error);
    throw error;
  }
}

// Converte nossa convenção interna para o esperado pela Z-API
function mapAppBodyToZapi(body: Record<string, unknown>) {
  console.log('🔍 mapAppBodyToZapi input:', body);
  const out: Record<string, unknown> = { ...body };
  
  // Para webhooks: mapear 'url' para 'value' (baseado no erro da API)
  if ('url' in out && !('value' in out)) {
    console.log('🔄 Mapping url to value:', out['url']);
    out['value'] = out['url'];
    delete out['url'];
  }
  
  console.log('📤 Mapped payload:', out);
  return out;
}
