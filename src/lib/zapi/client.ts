// import { ZApiActionContext } from './types';

export async function zapiFetch<T>(args: {
  instanceId: string;
  instanceToken: string;
  clientSecurityToken: string;
  path: string;
  method?: 'GET' | 'PUT' | 'POST';
  body?: unknown;
}): Promise<T> {
  const { instanceId, instanceToken, clientSecurityToken, path, method = 'GET', body } = args;
  const url = `https://api.z-api.io/instances/${instanceId}/token/${instanceToken}${path}`;
  const headers: Record<string, string> = {
    'Client-Token': clientSecurityToken
  };
  const init: RequestInit = { method, headers };

  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
    // Mapear { value } -> { valor } quando necessário
    const payload = typeof body === 'object' && body !== null
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
  const out: Record<string, unknown> = { ...body };
  
  // Mapear 'value' para 'valor' se necessário
  if ('value' in out && !('valor' in out)) {
    out['valor'] = out['value'];
    delete out['value'];
  }
  
  // Mapear 'enable' para 'valor' se necessário
  if ('enable' in out && !('valor' in out)) {
    out['valor'] = !!out['enable'];
    delete out['enable'];
  }
  
  // Mapear 'message' para 'value' se necessário (para callRejectMessage)
  if ('message' in out && !('value' in out) && !('valor' in out)) {
    out['value'] = out['message'];
    delete out['message'];
  }
  
  // Mapear 'url' para 'value' se necessário (para webhooks)
  if ('url' in out && !('value' in out) && !('valor' in out)) {
    out['value'] = out['url'];
    delete out['url'];
  }
  
  console.log('Mapped payload:', out);
  return out;
}
