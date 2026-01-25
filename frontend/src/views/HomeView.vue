<template>
  <div class="dashboard">
    <h2>Tablou de bord</h2>
  
    <div class="stats-grid">
      <StatCard label="Total users:" :value="stats.totalUsers" />
      <StatCard label="Total Task-uri" :value="stats.totalTasks" />
      <StatCard label="Finalizate" :value="stats.completedTasks" />
      <StatCard label="Rata de succes" :value="stats.efficiencyRate" />
    </div>

    <div class="activity-section">
      <h3>Recent activity</h3>
      <div class="activity-list">
        <div v-for="item in activities" :key="item.id" class="activity-item">
          <div class="activity-info">
            <StatusBadge :type="item.user === 'Manager' ? 'urgent' : 'pending'">
             {{ item.user }}
            </StatusBadge>
            <span class="action-text">{{ item.action }}</span>
          </div>
          <span class="time-stamp">{{ item.time }}</span>
        </div>
      </div>
    </div>

    <div class="status-badge" :class="{ online: isOnline }">
      Server Backend: {{ isOnline ? 'Conectat' : 'Deconectat' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService';
import StatCard from '@/components/StatCard.vue';
import StatusBadge from '@/components/StatusBadge.vue';

const stats = ref({ totalUsers:0, totalTasks: 0, completedTasks: 0, efficiencyRate: '0%' });
const isOnline = ref(false);
const activities = ref([]);

onMounted(async () => {
  try {
    const [statsRes, statusRes, activityRes] = await Promise.all([
      apiService.getStats(),
      apiService.getStatus(),
      apiService.getActivities() 
    ]);
    
    stats.value = statsRes.data;
    isOnline.value = statusRes.data.status === 'Online';
    activities.value = activityRes.data; 
  } catch (error) {
    console.error("Eroare la conectarea cu backend-ul:", error);
  }
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.status-badge {
  margin-top: 30px;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.8rem;
}

.status-badge.online {
  background: #dcfce7;
  color: #16a34a;
}

.activity-section {
  margin-top: 40px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.activity-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.user-name { font-weight: bold; color: #2563eb; margin-right: 8px; }
.action-text { color: #4b5563; }
.time-stamp { font-size: 0.8rem; color: #9ca3af; }
</style>