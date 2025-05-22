import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

const App = () => {
  const [dashboard, setDashboard] = useState({ percent: [], scores: [], nps: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Realiza POST al webhook de producción
    fetch('https://n8nalmendral.com/webhook/5188f2fb-dc67-4536-9d47-48badceae911', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Si necesitas enviar payload, añádelo aquí
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(json => {
        console.log('Dashboard data recibida:', json); // Debug console.log
        setDashboard({
          percent: json.percent || [],
          scores: json.scores || [],
          nps: json.nps || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener datos:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando datos…</div>;
  if (error)   return <div>Error: {error}</div>;

  const { percent, scores, nps } = dashboard;

  const formatXAxisTick = tickItem => {
    const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const positions = [6,15.5,24.5,33,42,50];
    const idx = positions.findIndex(p => Math.abs(p - tickItem) < 1);
    return idx >= 0 ? monthNames[idx] : '';
  };

  const createEvolutiveChart = (title, data, field) => {
    if (!data.length) return null;

    const values = data.map(d => d[field]);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const maxPt = data.find(d => d[field] === maxVal);
    const minPt = data.find(d => d[field] === minVal);

    return (
      <div key={title} className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex-1">
        <div className="flex items-center mb-1">
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="flex-1 relative" style={{ height: 'calc(100% - 28px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top:15, right:6, left:6, bottom:15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal vertical={false} />
              <XAxis
                dataKey="week"
                type="number"
                scale="linear"
                domain={[1,52]}
                ticks={[6,15.5,24.5,33,42,50]}
                tickFormatter={formatXAxisTick}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize:9, fill:'#64748b' }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize:9, fill:'#64748b' }}
                tickFormatter={v => `${v}%`}
              />
              <Line
                type="monotone"
                dataKey={field}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill:'#3b82f6', r:1 }}
                activeDot={{ r:3, stroke:'#3b82f6', strokeWidth:2 }}
              />
              <ReferenceDot x={maxPt.week} y={maxVal} r={4} fill="#10b981" stroke="#fff" strokeWidth={1} />
              <ReferenceDot x={minPt.week} y={minVal} r={4} fill="#ef4444" stroke="#fff" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute text-xs font-semibold text-green-600"
                 style={{ left: `${(maxPt.week/52)*100}%`, top:'5px', transform:'translateX(-50%)' }}>
              {maxVal}%
            </div>
            <div className="absolute text-xs font-semibold text-red-600"
                 style={{ left: `${(minPt.week/52)*100}%`, bottom:'5px', transform:'translateX(-50%)' }}>
              {minVal}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-1 flex flex-col">
      <div className="w-full h-full flex flex-col gap-1">
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart('Satisfacción atención al Alumno', percent, 'Student_Satisfaction')}
          {createEvolutiveChart('Devoluciones', percent, 'Devoluciones')}
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart('Puntuación Trustpilot', scores, 'Trustpilot')}
          {createEvolutiveChart('Puntuación Google', scores, 'Google')}
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart('NPS Business School', nps, 'Business_School')}
          {createEvolutiveChart('NPS IA School', nps, 'IA_School')}
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart('SNPS Tech School', nps, 'Tech_School')}
          {createEvolutiveChart('NPS Pharma', nps, 'Pharma')}
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart('NPS FP', nps, 'FP')}
          {createEvolutiveChart('NPS Oposiciones', nps, 'Oposiciones')}
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart('NPS Tecnio', nps, 'Tecnio')}
          {createEvolutiveChart('NPS B2B', nps, 'B2B')}
        </div>
      </div>
    </div>
  );
};

export default App;
