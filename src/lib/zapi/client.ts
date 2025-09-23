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
  }

  const res = await fetch(url, init);
  if (res.status === 405) throw new Error('405: Método incorreto (verifique PUT/POST/GET).');
  if (res.status === 415) throw new Error('415: Content-Type ausente/incorreto, use application/json.');
  if (!res.ok) {
    try {
      const errorText = await res.text();
      const errorMessage = errorText || `Erro ${res.status}`;
      throw new Error(`${res.status}: ${errorMessage}`);
    } catch {
      throw new Error(`${res.status}: Erro na API Z-API`);
    }
  }
  return (await res.json()) as T;
}

// Converte nossa convenção interna para o esperado pela Z-API
function mapAppBodyToZapi(body: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...body };
  if ('value' in out && !('valor' in out)) {
    out['valor'] = out['value'];
    delete out['value'];
  }
  if ('enable' in out && !('valor' in out)) {
    out['valor'] = !!out['enable'];
    delete out['enable'];
  }
  return out;
}
