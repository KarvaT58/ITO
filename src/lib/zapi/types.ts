export type ZApiInstance = {
  id: string;
  alias: string;
  instance_id: string;
  instance_token: string;
  client_security_token: string;
  phone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Configurações de webhook
  webhook_delivery?: string | null;
  webhook_disconnected?: string | null;
  webhook_received?: string | null;
  webhook_chat_presence?: string | null;
  webhook_message_status?: string | null;
  webhook_connected?: string | null;
  // Configurações gerais
  notify_sent_by_me?: boolean;
  call_reject_auto?: boolean;
  call_reject_message?: string | null;
  auto_read_message?: boolean;
  auto_read_status?: boolean;
  // Configurações de perfil
  profile_name?: string | null;
  profile_description?: string | null;
  profile_picture?: string | null;
};

export type ZApiToggleBody = { value: boolean };
export type ZApiTextBody = { value: string };

export type ZApiStatusResponse = {
  connected: boolean;
  error?: string | null;
  smartphoneConnected?: boolean;
};

export type ZApiDeviceResponse = {
  phone?: string;
  imgUrl?: string;
  name?: string;
  device?: { 
    sessionName?: string; 
    device_model?: string;
  };
  originalDevice?: 'iphone' | 'smbi' | 'android' | 'smba' | string;
  sessionId?: number;
  isBusiness?: boolean;
};

export type ZApiQrResponse = {
  qrCode?: string;
  base64?: string;
  // A API pode retornar diferentes estruturas
  value?: string;
  valor?: string;
};

export type ZApiPhoneCodeResponse = {
  phoneCode?: string;
  message?: string;
};

export type ZApiWebhookEvent = {
  id: number;
  zapi_instance_id?: string;
  kind: 'connected' | 'received' | 'delivery' | 'status' | 'chat-presence' | 'disconnected';
  payload: Record<string, unknown>;
  created_at: string;
};

export type ZApiActionContext = {
  instanceId: string;
  instanceToken: string;
  clientSecurityToken: string;
};
