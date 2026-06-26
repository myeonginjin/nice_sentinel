import type { MonitoringAlert, MerchantTimeseries, MonitoringMerchant } from '@/types';
import { monitoringAlerts, timeseriesMock, monitoringMerchants as localMonitoringMerchants } from '@/mock';
import { api } from '@/api/client';

export async function getAlerts(): Promise<MonitoringAlert[]> {
  return api
    .get<MonitoringAlert[]>('/v1/monitoring/alerts')
    .catch(() => monitoringAlerts);
}

export async function getTimeseries(merchantId: string): Promise<MerchantTimeseries | undefined> {
  return api
    .get<MerchantTimeseries>(`/v1/monitoring/timeseries/${merchantId}`)
    .catch(() => timeseriesMock.find((t) => t.merchantId === merchantId));
}

export async function getMerchantAlerts(merchantId: string): Promise<MonitoringAlert[]> {
  return api
    .get<MonitoringAlert[]>(`/v1/monitoring/alerts/${merchantId}`)
    .catch(() => monitoringAlerts.filter((a) => a.merchantId === merchantId));
}

export async function getMonitoringMerchants(): Promise<MonitoringMerchant[]> {
  return api
    .get<MonitoringMerchant[]>('/v1/monitoring/merchants')
    .catch(() => localMonitoringMerchants);
}
