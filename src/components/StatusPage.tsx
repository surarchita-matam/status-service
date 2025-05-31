'use client';

import { useEffect, useState } from 'react';
import { Status } from '@prisma/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  status: Status;
  incidents: Incident[];
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
}

const statusColors = {
  OPERATIONAL: 'bg-green-500',
  DEGRADED: 'bg-yellow-500',
  OUTAGE: 'bg-red-500',
  MAINTENANCE: 'bg-blue-500',
};

const statusLabels = {
  OPERATIONAL: 'Operational',
  DEGRADED: 'Degraded Performance',
  OUTAGE: 'Outage',
  MAINTENANCE: 'Maintenance',
};

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">System Status</h1>
      
      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${statusColors[service.status]} mr-2`}></div>
                <span className="text-sm font-medium">{statusLabels[service.status]}</span>
              </div>
            </div>
            
            {service.description && (
              <p className="text-gray-600 mb-4">{service.description}</p>
            )}

            {service.incidents && service.incidents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Latest Incident</h3>
                <div className="bg-gray-50 rounded p-4">
                  <h4 className="font-medium">{service.incidents[0].title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.incidents[0].description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(service.incidents[0].createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 