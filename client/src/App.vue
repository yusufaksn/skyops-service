<template>
  <div style="padding: 24px; font-family: sans-serif; background-color: #f9fafb; min-height: 100vh;">
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Drone Filo Yönetimi</h1>


    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
      <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #6b7280; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="color: #6b7280; font-size: 14px;">Toplam Drone</div>
        <div style="font-size: 28px; font-weight: bold;">{{ healthReport?.totalDrones ?? 0 }}</div>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="color: #6b7280; font-size: 14px;">Uygun (Available)</div>
        <div style="font-size: 28px; font-weight: bold; color: #10b981;">{{ healthReport?.statusBreakdown?.AVAILABLE ?? 0 }}</div>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="color: #6b7280; font-size: 14px;">Görevde (In Mission)</div>
        <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">{{ healthReport?.statusBreakdown?.IN_MISSION ?? 0 }}</div>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="color: #6b7280; font-size: 14px;">Bakımda (Maintenance)</div>
        <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">{{ healthReport?.statusBreakdown?.MAINTENANCE ?? 0 }}</div>
      </div>
    </div>

  
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #dc2626;">⚠️ Günü Geçen / Yaklaşan Bakım Uyarıları</h2>
      <div v-if="!healthReport?.overdueMaintenance || healthReport.overdueMaintenance.length === 0" style="color: #6b7280;">Acil bakım gerektiren drone yok.</div>
      <table v-else style="width: 100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #f3f4f6;">
            <th style="padding: 8px;">Seri No</th>
            <th style="padding: 8px;">Model</th>
            <th style="padding: 8px;">Uçuş Saati</th>
            <th style="padding: 8px;">Bakım Tarihi</th>
            <th style="padding: 8px;">Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in healthReport.overdueMaintenance" :key="d.id" :style="{ backgroundColor: isOverdue(d.nextMaintenanceDue) ? '#fef2f2' : 'white', borderBottom: '1px solid #f3f4f6' }">
            <td style="padding: 8px; font-weight: bold;">{{ d.serialNumber }}</td>
            <td style="padding: 8px;">{{ d.model }}</td>
            <td style="padding: 8px;">{{ d.totalFlightHours }} saat</td>
            <td style="padding: 8px;">{{ formatDate(d.nextMaintenanceDue) }}</td>
            <td style="padding: 8px;">
              <span v-if="isOverdue(d.nextMaintenanceDue)" style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">GÜNÜ GEÇTİ</span>
              <span v-else style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">BAKIM YAKLAŞTI</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 3. MISSION VIEW -->
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">🚀 Görevler (Missions)</h2>
      <div v-if="missions.length === 0" style="color: #6b7280;">Kayıtlı görev bulunamadı.</div>
      <table v-else style="width: 100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #f3f4f6;">
            <th style="padding: 8px;">Görev Adı</th>
            <th style="padding: 8px;">Atanan Drone</th>
            <th style="padding: 8px;">Pilot</th>
            <th style="padding: 8px;">Lokasyon</th>
            <th style="padding: 8px;">Tarih</th>
            <th style="padding: 8px;">Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in missions" :key="m.id" style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: 600;">{{ m.missionName }}</td>
            <td style="padding: 8px;">{{ m.droneModel ? `${m.droneModel} (${m.droneSerial})` : '-' }}</td>
            <td style="padding: 8px;">{{ m.pilotName }}</td>
            <td style="padding: 8px;">{{ m.siteLocation }}</td>
            <td style="padding: 8px;">{{ formatDate(m.plannedStart) }}</td>
            <td style="padding: 8px;">
              <span style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                {{ m.missionStatus }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const healthReport = ref<any>(null);
const missions = ref<any[]>([]);

onMounted(async () => {
  try {
    const resHealth = await fetch('http://localhost:3000/api/reports/fleet-health');
    healthReport.value = await resHealth.json();


    const resMissions = await fetch('http://localhost:3000/api/missions');
    missions.value = await resMissions.json();
  } catch (err) {
    console.error("Veri çekilemedi:", err);
  }
});

const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>