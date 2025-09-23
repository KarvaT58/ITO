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
