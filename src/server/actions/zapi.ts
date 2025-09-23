'use server';

import { createClient } from '@/lib/supabase';
import { Zapi } from '@/lib/zapi/endpoints';
import { ZApiInstance } from '@/lib/zapi/types';

const WEBHOOK_BASE = 'https://ito-two.vercel.app';

function buildWebhookUrls() {
  const base = WEBHOOK_BASE;
  return {
    delivery: `${base}/api/zapi/webhooks/delivery`,
    received: `${base}/api/zapi/webhooks/received`,
    receivedDelivery: `${base}/api/zapi/webhooks/received`,
    disconnected: `${base}/api/zapi/webhooks/disconnected`,
    messageStatus: `${base}/api/zapi/webhooks/status`,
    chatPresence: `${base}/api/zapi/webhooks/chat-presence`,
    connected: `${base}/api/zapi/webhooks/connected`,
  };
}

export async function createZapiInstance(data: {
  alias: string;
  instance_id: string;
  instance_token: string;
  client_security_token: string;
  phone?: string;
}): Promise<ZApiInstance> {
  const sb = createClient();
  const { data: row, error } = await sb.from('zapi_instances').insert({
    alias: data.alias,
    instance_id: data.instance_id,
    instance_token: data.instance_token,
    client_security_token: data.client_security_token,
    phone: data.phone ?? null,
  }).select().single();
  
  if (error) throw error;
  return row;
}

export async function listZapiInstances(): Promise<ZApiInstance[]> {
  const sb = createClient();
  const { data, error } = await sb.from('zapi_instances').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteZapiInstance(id: string): Promise<void> {
  const sb = createClient();
  const { error } = await sb.from('zapi_instances').delete().eq('id', id);
  if (error) throw error;
}

export async function updateZapiInstance(id: string, data: Partial<ZApiInstance>): Promise<ZApiInstance> {
  const sb = createClient();
  const { data: row, error } = await sb.from('zapi_instances')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return row;
}


export async function zapiAction(args: { 
  id: string; 
  action: string; 
  payload?: unknown 
}): Promise<unknown> {
  const sb = createClient();
  const { data: z } = await sb.from('zapi_instances').select('*').eq('id', args.id).single();
  if (!z) throw new Error('Instância não encontrada');
  
  const ctx = { 
    instanceId: z.instance_id, 
    instanceToken: z.instance_token, 
    clientSecurityToken: z.client_security_token 
  };

  switch (args.action) {
    case 'status': 
      return Zapi.status(ctx);
    case 'device': 
      return Zapi.device(ctx);
    case 'restart': 
      return Zapi.restart(ctx);
    case 'disconnect': 
      return Zapi.disconnect(ctx);
    case 'qrBytes': 
      return Zapi.qrBytes(ctx);
    case 'qrImage': 
      return Zapi.qrImage(ctx);
    case 'phoneCode': 
      return Zapi.phoneCode(ctx, (args.payload as { phone?: string })?.phone ?? '');
    case 'rename': 
      return Zapi.renameInstance(ctx, (args.payload as { name?: string })?.name ?? '');
    case 'profilePicture': 
      return Zapi.updateProfilePicture(ctx, (args.payload as { url?: string })?.url ?? '');
    case 'profileName': 
      return Zapi.updateProfileName(ctx, (args.payload as { name?: string })?.name ?? '');
    case 'profileDescription': 
      return Zapi.updateProfileDescription(ctx, (args.payload as { description?: string })?.description ?? '');
    case 'autoReadMessage': 
      return Zapi.updateAutoReadMessage(ctx, !!(args.payload as { enable?: boolean })?.enable);
    case 'autoReadStatus': 
      return Zapi.updateAutoReadStatus(ctx, !!(args.payload as { enable?: boolean })?.enable);
    case 'callRejectAuto': 
      return Zapi.updateCallRejectAuto(ctx, !!(args.payload as { enable?: boolean })?.enable);
    case 'callRejectMessage': 
      return Zapi.updateCallRejectMessage(ctx, (args.payload as { message?: string })?.message ?? '');
    case 'webhooks:setAllVercel': {
      const urls = buildWebhookUrls();
      await Zapi.updateWebhookDelivery(ctx, urls.delivery);
      await Zapi.updateWebhookReceived(ctx, urls.received);
      await Zapi.updateWebhookReceivedDelivery(ctx, urls.receivedDelivery);
      await Zapi.updateWebhookDisconnected(ctx, urls.disconnected);
      await Zapi.updateWebhookMessageStatus(ctx, urls.messageStatus);
      await Zapi.updateWebhookChatPresence(ctx, urls.chatPresence);
      await Zapi.updateWebhookConnected(ctx, urls.connected);
      await Zapi.updateNotifySentByMe(ctx, true);
      return { ok: true };
    }
    default:
      throw new Error('Ação inválida');
  }
}

export async function getWebhookEvents(instanceId?: string, limit = 50) {
  const sb = createClient();
  let query = sb.from('zapi_webhook_events').select('*').order('created_at', { ascending: false }).limit(limit);
  
  if (instanceId) {
    query = query.eq('zapi_instance_id', instanceId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
