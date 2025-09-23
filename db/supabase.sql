-- Tabela de credenciais Z-API (multi-instância)
create table if not exists zapi_instances (
  id uuid primary key default gen_random_uuid(),
  alias text not null,                 -- apelido visível no UI
  instance_id text not null,           -- SUA_INSTANCIA (id da Z-API)
  instance_token text not null,        -- SEU_TOKEN (token da instância)
  client_security_token text not null, -- header: Client-Token (token da CONTA)
  phone text,                          -- opcional (telefone conectado)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Logs simples dos webhooks (apenas para inspecionar rapidamente)
create table if not exists zapi_webhook_events (
  id bigserial primary key,
  zapi_instance_id uuid references zapi_instances(id) on delete set null,
  kind text not null,            -- 'connected' | 'received' | 'delivery' | 'status' | 'chat-presence' | 'disconnected'
  payload jsonb not null,
  created_at timestamptz not null default now()
);

-- Índices para performance
create index if not exists idx_zapi_instances_active on zapi_instances(is_active);
create index if not exists idx_zapi_instances_created_at on zapi_instances(created_at desc);
create index if not exists idx_zapi_webhook_events_kind on zapi_webhook_events(kind);
create index if not exists idx_zapi_webhook_events_created_at on zapi_webhook_events(created_at desc);
create index if not exists idx_zapi_webhook_events_instance_id on zapi_webhook_events(zapi_instance_id);

-- RLS (Row Level Security) - habilitar quando necessário
-- Por ora manter aberto em dev
-- alter table zapi_instances enable row level security;
-- alter table zapi_webhook_events enable row level security;
