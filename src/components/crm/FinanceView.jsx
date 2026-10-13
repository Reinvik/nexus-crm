import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  Search, 
  Server, 
  Bot, 
  Sparkles, 
  Truck, 
  HelpCircle, 
  Receipt, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  Building2 
} from 'lucide-react';
import ExpenseModal, { EXPENSE_CATEGORIES } from './ExpenseModal';

export default function FinanceView({
  expenses = [],
  customers = [],
  onSaveExpense,
  onDeleteExpense
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cálculos Financieros y Rentabilidad (NK-127 y NK-128)
  const financeStats = useMemo(() => {
    // 1. Ingresos Mensuales Recurrentes (MRR de Clientes Activos)
    const activeCustomers = customers.filter(c => c.status === 'active');
    const baseRevenue = activeCustomers.reduce((acc, c) => acc + (Number(c.base_fee) || 0), 0);
    const addonsRevenue = activeCustomers.reduce((acc, c) => {
      const addonsSum = (c.additional_services || []).reduce((s, a) => s + (Number(a.price) || 0), 0);
      return acc + addonsSum;
    }, 0);
    const totalRevenue = baseRevenue + addonsRevenue;

    // 2. Gastos Totales
    const totalExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);

    // 3. Margen Neto y Rentabilidad
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // 4. Desglose por Categoría de Gasto
    const categoryTotals = {
      servidores: 0,
      ia_apis: 0,
      marketing: 0,
      traslados: 0,
      otros: 0
    };

    expenses.forEach(exp => {
      const cat = exp.category || 'otros';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += Number(exp.amount) || 0;
      } else {
        categoryTotals.otros += Number(exp.amount) || 0;
      }
    });

    return {
      activeCustomersCount: activeCustomers.length,
      baseRevenue,
      addonsRevenue,
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      categoryTotals
    };
  }, [customers, expenses]);

  // Filtrado de gastos para la tabla
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesSearch = 
        exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'all' || exp.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [expenses, searchTerm, categoryFilter]);

  const getCategoryDetails = (catId) => {
    return EXPENSE_CATEGORIES.find(c => c.id === catId) || {
      id: catId,
      label: 'Operaciones',
      icon: HelpCircle,
      color: 'text-slate-500 bg-slate-50 border-slate-200'
    };
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Tarjetas de KPIs de Rentabilidad (NK-127) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1: Ingresos Totales (MRR) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Ingresos (MRR)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">
            ${financeStats.totalRevenue.toLocaleString('es-CL')}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center justify-between">
            <span>Base: ${financeStats.baseRevenue.toLocaleString('es-CL')}</span>
            <span className="text-cyan-600 font-bold">Addons: +${financeStats.addonsRevenue.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* KPI 2: Gastos Totales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Gastos Operativos</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600">
            ${financeStats.totalExpenses.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold mt-1">
            {expenses.length} conceptos registrados
          </span>
        </div>

        {/* KPI 3: Beneficio Neto */}
        <div className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between ${
          financeStats.netProfit >= 0 
            ? 'bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200' 
            : 'bg-gradient-to-br from-rose-50/50 to-white border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Beneficio Neto</span>
            <DollarSign size={18} className={financeStats.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
          </div>
          <div className={`text-xl sm:text-2xl font-black ${financeStats.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            ${financeStats.netProfit.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1">
            Margen libre mensual
          </span>
        </div>

        {/* KPI 4: Rentabilidad / Margen (%) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Margen de Rentabilidad</span>
            <Percent size={18} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {financeStats.profitMargin}%
          </div>
          <span className="text-[10px] text-slate-300 font-medium mt-1">
            Eficiencia operativa mensual
          </span>
        </div>

      </div>

      {/* 2. Desglose Visual por Categorías de Gastos (NK-127) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
          <PieChart size={18} className="text-cyan-500" />
          Desglose de Costos por Categoría Operativa
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Servidores */}
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Server size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Servidores & Cloud</span>
                <span className="text-[10px] text-slate-400">Vercel, Supabase</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-800 block">
                ${financeStats.categoryTotals.servidores.toLocaleString('es-CL')}
              </span>
              <span className="text-[10px] text-blue-600 font-bold">
                {financeStats.totalExpenses > 0 ? Math.round((financeStats.categoryTotals.servidores / financeStats.totalExpenses) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Modelos de IA */}
          <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">APIs & Tokens IA</span>
                <span className="text-[10px] text-slate-400">OpenAI, Gemini</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-800 block">
                ${financeStats.categoryTotals.ia_apis.toLocaleString('es-CL')}
              </span>
              <span className="text-[10px] text-purple-600 font-bold">
                {financeStats.totalExpenses > 0 ? Math.round((financeStats.categoryTotals.ia_apis / financeStats.totalExpenses) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Marketing y Publicidad */}
          <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Publicidad & Ads</span>
                <span className="text-[10px] text-slate-400">Meta, Google Ads</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-800 block">
                ${financeStats.categoryTotals.marketing.toLocaleString('es-CL')}
              </span>
              <span className="text-[10px] text-pink-600 font-bold">
                {financeStats.totalExpenses > 0 ? Math.round((financeStats.categoryTotals.marketing / financeStats.totalExpenses) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Traslados y Terreno */}
          <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Truck size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Traslados & Terreno</span>
                <span className="text-[10px] text-slate-400">Combustible, TAG</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-800 block">
                ${financeStats.categoryTotals.traslados.toLocaleString('es-CL')}
              </span>
              <span className="text-[10px] text-amber-600 font-bold">
                {financeStats.totalExpenses > 0 ? Math.round((financeStats.categoryTotals.traslados / financeStats.totalExpenses) * 100) : 0}%
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Barra de Controles y Tabla de Gastos */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Búsqueda */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por concepto o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
          />
        </div>

        {/* Filtros de Categoría & Botón Nuevo Gasto */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none"
          >
            <option value="all">Todas las categorías</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedExpense(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-auto sm:ml-0"
          >
            <Plus size={16} />
            <span>Registrar Gasto</span>
          </button>
        </div>

      </div>

      {/* 4. Tabla de Registros de Gastos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Receipt size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">No se encontraron gastos con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Concepto / Proveedor</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Medio de Pago</th>
                  <th className="py-3 px-4">Monto ($ CLP)</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredExpenses.map(exp => {
                  const cat = getCategoryDetails(exp.category);
                  const Icon = cat.icon;

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Concepto y Proveedor */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-800 text-[13px]">
                          {exp.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {exp.vendor || 'Proveedor general'}
                          {exp.notes && ` · ${exp.notes}`}
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cat.color}`}>
                          <Icon size={12} />
                          {cat.label}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">
                        {exp.date}
                      </td>

                      {/* Medio de Pago */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-600 font-medium">
                          {exp.payment_method || 'Tarjeta'}
                        </span>
                      </td>

                      {/* Monto */}
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-black text-slate-900">
                          ${Number(exp.amount).toLocaleString('es-CL')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          CLP
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedExpense(exp);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar Gasto"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar gasto ${exp.title}?`)) {
                                onDeleteExpense(exp.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar Gasto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Gasto */}
      {isModalOpen && (
        <ExpenseModal
          expense={selectedExpense}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExpense(null);
          }}
          onSave={(data) => {
            onSaveExpense(data);
            setIsModalOpen(false);
            setSelectedExpense(null);
          }}
          onDelete={(id) => {
            onDeleteExpense(id);
            setIsModalOpen(false);
            setSelectedExpense(null);
          }}
        />
      )}

    </div>
  );
}
