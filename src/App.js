import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  Tooltip
} from 'recharts';

// --- INICIO: Helpers para la visualización de meses ---
const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const getMonthIndexFromWeek = (week) => {
    if (week <= 4) return 0;   // Enero (aprox. semanas 1-4)
    if (week <= 8) return 1;   // Febrero (aprox. semanas 5-8)
    if (week <= 13) return 2;  // Marzo (aprox. semanas 9-13)
    if (week <= 17) return 3;  // Abril (aprox. semanas 14-17)
    if (week <= 21) return 4;  // Mayo (aprox. semanas 18-21)
    if (week <= 26) return 5;  // Junio (aprox. semanas 22-26)
    if (week <= 30) return 6;  // Julio (aprox. semanas 27-30)
    if (week <= 34) return 7;  // Agosto (aprox. semanas 31-34)
    if (week <= 39) return 8;  // Septiembre (aprox. semanas 35-39)
    if (week <= 43) return 9;  // Octubre (aprox. semanas 40-43)
    if (week <= 47) return 10; // Noviembre (aprox. semanas 44-47)
    return 11;                 // Diciembre (aprox. semanas 48-52/53)
};

const monthReferenceWeeks = [1, 5, 9, 14, 18, 22, 27, 31, 35, 40, 44, 48];

const formatXAxisTickWithMonthNames = (weekTick) => {
    const monthIndex = getMonthIndexFromWeek(weekTick);
    if (monthIndex >= 0 && monthIndex < 12) {
        return monthNames[monthIndex];
    }
    return ''; // Fallback por si acaso
};
// --- FIN: Helpers para la visualización de meses ---

const App = () => {
  const [dashboard, setDashboard] = useState({ percent: [], scores: [], nps: [], devoluciones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = () => {
    setLoading(true);
    setError(null);
    fetch('https://n8nalmendral.com/webhook/b0bb5a2a-2e78-48fe-bb31-180b15b55c43', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(json => {
        console.log('Dashboard data recibida:', json);
        
        const processedData = {
          percent: json.filter(item => item.key === 'percent'),
          scores: json.filter(item => item.key === 'scores'),
          nps: json.filter(item => item.key === 'nps'),
          devoluciones: json.filter(item => item.key === 'devoluciones')
        };
        
        setDashboard(processedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener datos:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Cargar datos iniciales
    fetchDashboardData();

    // Configurar actualización remota
    const checkForRefresh = async () => {
      try {
        // --- INICIO DEL CAMBIO ---
        // Webhook específico para verificar si hay que refrescar
        const response = await fetch('https://n8nalmendral.com/webhook/066945d7-71af-4db8-a2ef-a5fbcc33a78d', {
          method: 'POST', // <-- Cambio de GET a POST
          headers: { 'Content-Type': 'application/json' }, // <-- Header añadido
          body: JSON.stringify({}) // <-- Body añadido (vacío)
        });
        // --- FIN DEL CAMBIO ---
        
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          // La respuesta es un array con un objeto que contiene response.body.update
          if (data && data.update === 'yes') {
            console.log('Señal de actualización recibida, recargando página completa...');
            window.location.reload();
          }
        }
      } catch (error) {
        // Silenciar errores de conexión
      }
    };

    // Verificar cada 15 minutos (15 * 60 * 1000 = 900000 ms)
    const interval = setInterval(checkForRefresh, 900000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-800 mb-6 animate-slide-down">
          Métricas Empresa
        </h1>
        <div className="flex items-center justify-center gap-2 animate-slide-up">
          <span className="text-lg text-slate-600">Powered by</span>
          <img 
            src="https://i.vimeocdn.com/player/827126?sig=61658c9aa3e50f445b2339457f1c73a3fb8e29290471ca31061241b89955e45b&v=1" 
            alt="Logo Corporativo"
            className="h-12 w-auto animate-pulse"
          />
        </div>
      </div>
    </div>
  );
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  const { percent, scores, nps, devoluciones } = dashboard;

  const CustomTooltip = ({ active, payload, label, isScore = false }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-1 shadow-lg rounded border border-slate-200">
          <p className="text-xs text-slate-600">Sem {label}</p>
          <p className="text-xs font-bold">
            {isScore ? payload[0].value.toFixed(2) : `${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getTrendIndicator = (currentValue, previousValue, isInverse = false) => {
    if (currentValue === previousValue) {
      return <span className="text-yellow-500 ml-1 text-2xl">━</span>;
    } else if (currentValue > previousValue) {
      return isInverse ? 
        <span className="text-red-500 ml-1 text-2xl">▲</span> : 
        <span className="text-green-500 ml-1 text-2xl">▲</span>;
    } else {
      return isInverse ? 
        <span className="text-green-500 ml-1 text-2xl">▼</span> : 
        <span className="text-red-500 ml-1 text-2xl">▼</span>;
    }
  };

  const createEvolutiveChart = (title, data, field, isScore = false, customYDomain = null) => {
    if (!data || data.length === 0) {
        console.warn(`No data for chart: ${title}`);
        return (
            <div key={title} className="bg-white rounded-lg shadow-sm border border-slate-200 p-0.5 flex-1 flex flex-col items-center justify-center">
                 <h2 className="text-base font-bold text-slate-800 px-2">{title}</h2>
                 <p className="text-sm text-slate-500">No hay datos disponibles.</p>
            </div>
        );
    }

    const values = data.map(d => d[field]).filter(v => typeof v === 'number');
    if (values.length === 0) {
        console.warn(`No valid values for field '${field}' in chart: ${title}`);
         return (
            <div key={title} className="bg-white rounded-lg shadow-sm border border-slate-200 p-0.5 flex-1 flex flex-col items-center justify-center">
                 <h2 className="text-base font-bold text-slate-800 px-2">{title}</h2>
                 <p className="text-sm text-slate-500">No hay datos válidos para graficar.</p>
            </div>
        );
    }

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const maxPt = data.find(d => d[field] === maxVal && typeof d.week === 'number');
    const minPt = data.find(d => d[field] === minVal && typeof d.week === 'number');
    
    const weeks = data.map(d => d.week).filter(w => typeof w === 'number');
    if (weeks.length === 0) {
        console.warn(`No valid week data for chart: ${title}`);
        return (
            <div key={title} className="bg-white rounded-lg shadow-sm border border-slate-200 p-0.5 flex-1 flex flex-col items-center justify-center">
                 <h2 className="text-base font-bold text-slate-800 px-2">{title}</h2>
                 <p className="text-sm text-slate-500">No hay datos de semanas válidos.</p>
            </div>
        );
    }
    const minWeek = Math.min(...weeks);
    const maxWeek = Math.max(...weeks);

    // Obtener valores actuales y anteriores para el indicador de tendencia
    const sortedData = [...data].sort((a, b) => a.week - b.week);
    const validSortedData = sortedData.filter(d => typeof d[field] === 'number');
    const currentValue = validSortedData.length > 0 ? validSortedData[validSortedData.length - 1][field] : null;
    const previousValue = validSortedData.length > 1 ? validSortedData[validSortedData.length - 2][field] : null;
    
    // Determinar si este gráfico necesita lógica inversa (como devoluciones)
    const isInverseTrend = title.includes('Devoluciones');

    const activeMonthReferenceTicks = monthReferenceWeeks.filter(
      (weekVal) => weekVal >= minWeek && weekVal <= maxWeek
    );

    const yDomain = customYDomain || (isScore ? [0, 5] : [0, 100]);
    const formatYTick = isScore ? (v) => v : (v) => `${v}%`;
    
    const calculateYTicks = (domain) => {
      const [min, max] = domain;
      const range = max - min;
      const tickCount = 5;
      const step = range / (tickCount - 1);
      const ticks = [];
      for (let i = 0; i < tickCount; i++) {
        ticks.push(Math.round(min + step * i));
      }
      return ticks;
    };

    return (
      <div key={title} className="bg-white rounded-lg shadow-sm border border-slate-200 p-0.5 flex-1 flex flex-col">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <div className="flex items-center font-semibold text-slate-700">
            <span>Actual: </span>
            <span className="ml-2 text-lg">
              {currentValue !== null ? 
                (isScore ? currentValue.toFixed(1) : `${currentValue.toFixed(1)}%`) : 
                'N/A'
              }
            </span>
            {currentValue !== null && previousValue !== null && 
              getTrendIndicator(currentValue, previousValue, isInverseTrend)
            }
          </div>
        </div>
        <div className="relative flex-1" style={{ minHeight: '80px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top:10, right:15, left:5, bottom:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="week"
                type="number"
                scale="linear"
                domain={[minWeek, maxWeek]}
                ticks={activeMonthReferenceTicks}
                tickFormatter={formatXAxisTickWithMonthNames}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: '#64748b' }}
                interval={0}
              />
              <YAxis
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: '#64748b' }}
                tickFormatter={formatYTick}
                ticks={calculateYTicks(yDomain)}
                width={isScore ? 25 : 35}
              />
              <Tooltip content={<CustomTooltip isScore={isScore} />} />
              <Line
                type="monotone"
                dataKey={field}
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls={true}
              />
              {maxPt && typeof maxPt.week === 'number' && <ReferenceDot x={maxPt.week} y={maxVal} r={3} fill={isInverseTrend ? "#ef4444" : "#10b981"} />}
              {minPt && typeof minPt.week === 'number' && <ReferenceDot x={minPt.week} y={minVal} r={3} fill={isInverseTrend ? "#10b981" : "#ef4444"} />}
            </LineChart>
          </ResponsiveContainer>
          {maxPt && typeof maxPt.week === 'number' && (
            <div className={`absolute font-bold ${isInverseTrend ? 'text-red-600' : 'text-green-600'}`}
                 style={{ 
                   left: maxWeek > minWeek ? `${((maxPt.week-minWeek)/(maxWeek-minWeek))*85 + 7}%` : '50%',
                   top: '12px',
                   transform: 'translateX(-50%)', 
                   fontSize: '20px',
                   backgroundColor: 'rgba(255,255,255,0.9)',
                   padding: '0 3px',
                   borderRadius: '2px',
                   pointerEvents: 'none'
                 }}>
              {isScore ? maxVal.toFixed(1) : `${maxVal.toFixed(1)}%`}
            </div>
          )}
          {minPt && typeof minPt.week === 'number' && (
            <div className={`absolute font-bold ${isInverseTrend ? 'text-green-600' : 'text-red-600'}`}
                 style={{ 
                   left: maxWeek > minWeek ? `${((minPt.week-minWeek)/(maxWeek-minWeek))*85 + 7}%` : '50%',
                   bottom: '12px',
                   transform: 'translateX(-50%)', 
                   fontSize: '20px',
                   backgroundColor: 'rgba(255,255,255,0.9)',
                   padding: '0 3px',
                   borderRadius: '2px',
                   pointerEvents: 'none'
                 }}>
              {isScore ? minVal.toFixed(1) : `${minVal.toFixed(1)}%`}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-1 flex flex-col">
      <div className="w-full h-full flex flex-col gap-0.5">
        <div className="grid grid-cols-2 gap-0.5 flex-1">
          {createEvolutiveChart('% Devoluciones sobre Facturación', percent, 'return_percentage_over_invoicing', false, [0, 10])}
          {createEvolutiveChart('Satisfacción Atención al Alumno', percent, 'mean_customer_satisfaction')}
        </div>
        <div className="grid grid-cols-2 gap-0.5 flex-1">
          {createEvolutiveChart('Puntuación Trustpilot', scores, 'Trustpilot', true)}
          {createEvolutiveChart('Puntuación Google', scores, 'Google', true)}
        </div>
        <div className="grid grid-cols-2 gap-0.5 flex-1">
          {createEvolutiveChart('NPS Business School', nps, 'Business_School', false, [-50, 100])}
          {createEvolutiveChart('NPS IA School', nps, 'IA_School', false, [-50, 100])}
        </div>
        <div className="grid grid-cols-2 gap-0.5 flex-1">
          {createEvolutiveChart('NPS Tech School', nps, 'Tech_School', false, [-50, 100])}
          {createEvolutiveChart('NPS Pharma', nps, 'Pharma', false, [-50, 100])}
        </div>
        <div className="grid grid-cols-2 gap-0.5 flex-1">
          {createEvolutiveChart('NPS FP', nps, 'FP', false, [-50, 100])}
          {createEvolutiveChart('NPS Oposiciones', nps, 'Oposiciones', false, [-50, 100])}
        </div>
        <div className="grid grid-cols-2 gap-0.5 flex-1">
          {createEvolutiveChart('NPS Tecnio', nps, 'Tecnio', false, [-50, 100])}
          {createEvolutiveChart('NPS B2B', nps, 'B2B', false, [-50, 100])}
        </div>
      </div>
    </div>
  );
};

export default App;