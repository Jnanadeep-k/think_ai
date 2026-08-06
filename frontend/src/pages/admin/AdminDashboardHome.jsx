import React from 'react';
import KPICard from '../../components/admin/KPICard';

const MOCK_KPIS = [
    { label: 'Revenue (MTD)', value: '$48,230', change: '12% vs last month', positive: true },
    { label: 'Active Learners', value: '3,142', change: '8% vs last month', positive: true },
    { label: 'Total Courses', value: '86', change: '3 added this month', positive: true },
    { label: 'Pending Approvals', value: '14', change: '5 new today', positive: false },
];

const MOCK_ACTIVITY = [
    { id: 1, text: 'Priya Sharma submitted a course for review', time: '10m ago' },
    { id: 2, text: '42 learners enrolled in "React Fundamentals"', time: '1h ago' },
    { id: 3, text: 'Batch "DevOps-Aug26" marked complete', time: '3h ago' },
];

export default function AdminDashboardHome() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-1">Platform overview and key metrics.</p>
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_KPIS.map((kpi) => (
                    <KPICard key={kpi.label} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <h2 className="text-sm font-medium text-white">Enrollment Trend</h2>
                        </div>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                        </svg>
                    </div>

                    <div className="h-56 relative flex flex-col pt-3 bg-[#111928] rounded-xl">
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-3 text-[10px] text-gray-600 pl-1.5 z-10">
                            <span>1000</span>
                            <span>750</span>
                            <span>500</span>
                            <span>250</span>
                            <span className="pt-2">0</span>
                        </div>

                        <div className="flex-grow flex items-center justify-center text-gray-600 text-sm pl-8 pr-1.5">
                            Chart body — install recharts to render gradient line chart
                        </div>

                        <div className="flex-grow flex items-center justify-center text-gray-600 text-sm border border-dashed border-gray-800 rounded-xl">
                            Chart placeholder — install recharts to render enrollment trend
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-medium text-white">Recent Activity</h2>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                        </svg>
                    </div>
                    <ul className="space-y-4">
                        {MOCK_ACTIVITY.map((item) => (
                            <li key={item.id} className="text-sm flex items-center gap-3">
                                <img src="/src/assets/avatar_alex.png" alt="User Avatar" className="w-8 h-8 rounded-full border border-gray-700" />
                                <div>
                                    <p className="text-white">{item.text}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{item.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

