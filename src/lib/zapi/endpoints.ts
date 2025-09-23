import { zapiFetch } from './client';
import { ZApiActionContext, ZApiStatusResponse, ZApiDeviceResponse, ZApiQrResponse, ZApiPhoneCodeResponse } from './types';

export const Zapi = {
  // Status & Device
  status: (ctx: ZApiActionContext) => 
    zapiFetch<ZApiStatusResponse>({ ...ctx, path: '/status', method: 'GET' }),
  
  device: (ctx: ZApiActionContext) => 
    zapiFetch<ZApiDeviceResponse>({ ...ctx, path: '/device', method: 'GET' }),

  // QR Code
  qrBytes: (ctx: ZApiActionContext) => 
    zapiFetch<ZApiQrResponse>({ ...ctx, path: '/qr-code', method: 'GET' }),
  
  qrImage: (ctx: ZApiActionContext) => 
    zapiFetch<ZApiQrResponse>({ ...ctx, path: '/qr-code/image', method: 'GET' }),
  
  phoneCode: (ctx: ZApiActionContext, phone: string) =>
    zapiFetch<ZApiPhoneCodeResponse>({ ...ctx, path: `/phone-code/${phone}`, method: 'GET' }),

  // Lifecycle
  restart: (ctx: ZApiActionContext) => 
    zapiFetch({ ...ctx, path: '/restart', method: 'GET' }),
  
  disconnect: (ctx: ZApiActionContext) => 
    zapiFetch({ ...ctx, path: '/disconnect', method: 'GET' }),

  // Profile
  updateProfilePicture: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/profile-picture', method: 'PUT', body: { value: url }}),
  
  updateProfileName: (ctx: ZApiActionContext, name: string) =>
    zapiFetch({ ...ctx, path: '/profile-name', method: 'PUT', body: { value: name }}),
  
  updateProfileDescription: (ctx: ZApiActionContext, desc: string) =>
    zapiFetch({ ...ctx, path: '/profile-description', method: 'PUT', body: { value: desc }}),

  // Instance name
  renameInstance: (ctx: ZApiActionContext, newName: string) =>
    zapiFetch({ ...ctx, path: '/update-name', method: 'PUT', body: { value: newName }}),

  // Toggles
  updateAutoReadMessage: (ctx: ZApiActionContext, enable: boolean) =>
    zapiFetch({ ...ctx, path: '/update-auto-read-message', method: 'PUT', body: { enable } }),
  
  updateAutoReadStatus: (ctx: ZApiActionContext, enable: boolean) =>
    zapiFetch({ ...ctx, path: '/update-auto-read-status', method: 'PUT', body: { enable } }),
  
  updateCallRejectAuto: (ctx: ZApiActionContext, enable: boolean) =>
    zapiFetch({ ...ctx, path: '/update-call-reject-auto', method: 'PUT', body: { enable } }),
  
  updateCallRejectMessage: (ctx: ZApiActionContext, message: string) =>
    zapiFetch({ ...ctx, path: '/update-call-reject-message', method: 'PUT', body: { value: message }}),

  updateNotifySentByMe: (ctx: ZApiActionContext, enable: boolean) =>
    zapiFetch({ ...ctx, path: '/update-notify-sent-by-me', method: 'PUT', body: { notifySentByMe: enable }}),

  // Me (dados da instância)
  me: (ctx: ZApiActionContext) => 
    zapiFetch({ ...ctx, path: '/me', method: 'GET' }),

  // Webhooks (individuais)
  updateWebhookDelivery: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-delivery', method: 'PUT', body: { value: url }}),
  
  updateWebhookReceived: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-received', method: 'PUT', body: { value: url }}),
  
  updateWebhookReceivedDelivery: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-received-delivery', method: 'PUT', body: { value: url }}),
  
  updateWebhookDisconnected: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-disconnected', method: 'PUT', body: { value: url }}),
  
  updateWebhookMessageStatus: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-message-status', method: 'PUT', body: { value: url }}),
  
  updateWebhookChatPresence: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-chat-presence', method: 'PUT', body: { value: url }}),
  
  updateWebhookConnected: (ctx: ZApiActionContext, url: string) =>
    zapiFetch({ ...ctx, path: '/update-webhook-connected', method: 'PUT', body: { value: url }}),

  // Webhooks – todos de uma vez
  updateAllWebhooks: (ctx: ZApiActionContext, url: string, notifySentByMe?: boolean) =>
    zapiFetch({
      ...ctx,
      path: '/update-all-webhooks',
      method: 'PUT',
      body: notifySentByMe == null ? { value: url } : { value: url, notifySentByMe }
    }),
};
