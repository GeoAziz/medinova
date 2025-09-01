import { performance } from 'perf_hooks';
import { getFirestore } from 'firebase-admin/firestore';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  timestamp: Date;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private db = getFirestore();
  private metrics: Map<string, number> = new Map();

  private constructor() {
    this.startSystemMetricsCollection();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }

  async endTimer(name: string, metadata?: Record<string, any>): Promise<void> {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      throw new Error(`No timer found for: ${name}`);
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date(),
      metadata,
    };

    await this.saveMetric(metric);
  }

  private async saveMetric(metric: PerformanceMetric): Promise<void> {
    try {
      await this.db.collection('performance_metrics').add(metric);
    } catch (error) {
      console.error('Failed to save performance metric:', error);
    }
  }

  private startSystemMetricsCollection(): void {
    setInterval(async () => {
      const metrics: SystemMetrics = {
        cpuUsage: process.cpuUsage().user / 1000000, // Convert to seconds
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // Convert to MB
        activeConnections: await this.getActiveConnections(),
        timestamp: new Date(),
      };

      await this.saveSystemMetrics(metrics);
    }, 60000); // Collect metrics every minute
  }

  private async getActiveConnections(): Promise<number> {
    // Implement based on your server implementation
    return 0;
  }

  private async saveSystemMetrics(metrics: SystemMetrics): Promise<void> {
    try {
      await this.db.collection('system_metrics').add(metrics);
    } catch (error) {
      console.error('Failed to save system metrics:', error);
    }
  }

  async getMetrics(
    startTime: Date,
    endTime: Date,
    metricName?: string
  ): Promise<PerformanceMetric[]> {
    let query = this.db.collection('performance_metrics')
      .where('timestamp', '>=', startTime)
      .where('timestamp', '<=', endTime);

    if (metricName) {
      query = query.where('name', '==', metricName);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as PerformanceMetric);
  }
}
