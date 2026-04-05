// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  // State Management
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Salary Deposit", amount: 75000, date: "2025-04-01", category: "Income", type: "income" },
    { id: 2, name: "Rent Payment", amount: 20000, date: "2025-04-02", category: "Housing", type: "expense" },
    { id: 3, name: "Groceries", amount: 5430, date: "2025-04-03", category: "Food", type: "expense" },
    { id: 4, name: "Freelance Work", amount: 15000, date: "2025-04-04", category: "Income", type: "income" },
    { id: 5, name: "Netflix", amount: 799, date: "2025-04-05", category: "Entertainment", type: "expense" },
    { id: 6, name: "Electricity Bill", amount: 2450, date: "2025-04-06", category: "Utilities", type: "expense" },
    { id: 7, name: "Gym Membership", amount: 2999, date: "2025-04-07", category: "Health", type: "expense" },
    { id: 8, name: "Dividend", amount: 3200, date: "2025-04-08", category: "Investment", type: "income" },
    { id: 9, name: "Shopping", amount: 4500, date: "2025-03-25", category: "Shopping", type: "expense" },
    { id: 10, name: "Bonus", amount: 10000, date: "2025-03-20", category: "Income", type: "income" },
    { id: 11, name: "Restaurant", amount: 3200, date: "2025-03-15", category: "Food", type: "expense" },
    { id: 12, name: "Gym Equipment", amount: 1500, date: "2025-02-10", category: "Health", type: "expense" },
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [role, setRole] = useState("admin");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [expenseView, setExpenseView] = useState("category");
  
  // Calculate totals
  const totalBalance = transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0
  );
  
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Monthly revenue data for chart
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000, color: '#3b82f6' },
    { month: 'Feb', revenue: 14500, color: '#3b82f6' },
    { month: 'Mar', revenue: 17500, color: '#3b82f6' },
    { month: 'Apr', revenue: 16500, color: '#3b82f6' },
    { month: 'May', revenue: 17000, color: '#3b82f6' },
    { month: 'Jun', revenue: 16000, color: '#3b82f6' },
    { month: 'Jul', revenue: 18000, color: '#8b5cf6' },
    { month: 'Aug', revenue: 17500, color: '#8b5cf6' },
    { month: 'Sep', revenue: 19000, color: '#8b5cf6' },
    { month: 'Oct', revenue: 18500, color: '#8b5cf6' },
    { month: 'Nov', revenue: 20000, color: '#8b5cf6' },
    { month: 'Dec', revenue: 19500, color: '#8b5cf6' }
  ];

  const totalYearlyRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);

  // Calculate expense breakdowns
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
  const expensesByMonth = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    }, {});
  
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sortedExpensesByMonth = Object.entries(expensesByMonth).sort((a, b) => 
    monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0])
  );

  // Filter and sort transactions
  useEffect(() => {
    let filtered = [...transactions];
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (fromDate) filtered = filtered.filter(t => t.date >= fromDate);
    if (toDate) filtered = filtered.filter(t => t.date <= toDate);
    
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      return 0;
    });
    
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, sortBy, sortOrder, fromDate, toDate]);

  // Calculate insights
  const highestCategory = Object.entries(expensesByCategory).sort((a,b) => b[1] - a[1])[0];
  const savingsRate = monthlyIncome ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1) : 0;

  const clearDateFilters = () => {
    setFromDate("");
    setToDate("");
  };

  const getCurrentExpenseData = () => {
    if (expenseView === "category") {
      return Object.entries(expensesByCategory).map(([name, amount]) => ({ name, amount }));
    } else {
      return sortedExpensesByMonth.map(([name, amount]) => ({ name, amount }));
    }
  };

  const currentExpenseData = getCurrentExpenseData();
  const maxExpense = Math.max(...currentExpenseData.map(d => d.amount), 0);
  const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div style={styles.container}>
      <div style={styles.bgAnimation}></div>
      
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Hello, Anuj </h1>
          <p style={styles.subtitle}>This is your finance report</p>
        </div>
        <div style={styles.roleSwitcher}>
          <span style={styles.roleLabel}>Current Role:</span>
          <button 
            onClick={() => setRole('viewer')}
            style={role === 'viewer' ? styles.roleBtnActive : styles.roleBtn}
          >
             Viewer
          </button>
          <button 
            onClick={() => setRole('admin')}
            style={role === 'admin' ? styles.roleBtnActive : styles.roleBtn}
          >
             Admin
          </button>
          <span style={role === 'admin' ? styles.adminBadge : styles.viewerBadge}>
            {role === 'admin' ? ' Can edit' : ' View only'}
          </span>
        </div>
      </div>

      {/* 4 Cards Row */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div style={styles.cardLabel}>My balance</div>
          <div style={styles.cardAmount}>₹{totalBalance.toLocaleString()}</div>
          <div style={styles.cardChangePositive}>↑ +6.7% from last month</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div style={styles.cardLabel}>Monthly Income</div>
          <div style={styles.cardAmount}>₹{monthlyIncome.toLocaleString()}</div>
          <div style={styles.cardChangePositive}>↑ +9.8% from last month</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div style={styles.cardLabel}>Monthly Expenses</div>
          <div style={styles.cardAmount}>₹{monthlyExpenses.toLocaleString()}</div>
          <div style={styles.cardChangeNegative}>↓ -8.6% from last month</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}></div>
          <div style={styles.cardLabel}>Total Savings</div>
          <div style={styles.cardAmount}>₹{(monthlyIncome - monthlyExpenses).toLocaleString()}</div>
          <div style={styles.cardChangePositive}>↑ +12.4% overall</div>
        </div>
      </div>

      {/* 2 Charts Row */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Total Revenue 2024</h3>
            <button style={styles.chartBtn}> Yearly Report</button>
          </div>
          <div style={styles.simpleChart}>
            <div style={styles.chartSummary}>
              <span style={styles.chartTotal}>₹{(totalYearlyRevenue / 1000).toFixed(0)}k</span>
              <span style={styles.chartGrowth}>↑ +18.5% from last year</span>
            </div>
            <div style={styles.barChartContainer}>
              {monthlyRevenue.map((data, index) => {
                const barHeight = (data.revenue / 20000) * 180;
                return (
                  <div key={index} style={styles.barWrapper}>
                    <div 
                      style={{
                        ...styles.bar,
                        height: `${barHeight}px`,
                        background: `linear-gradient(180deg, ${data.color} 0%, ${data.color}dd 100%)`,
                        transform: hoveredBar === index ? 'translateY(-8px)' : 'translateY(0)'
                      }}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar === index && (
                        <div style={styles.barTooltip}>
                          ₹{(data.revenue / 1000).toFixed(1)}k
                        </div>
                      )}
                    </div>
                    <div style={styles.barLabel}>{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Expense Breakdown</h3>
            <div>
              <button 
                style={expenseView === 'category' ? styles.activeViewBtn : styles.chartBtn}
                onClick={() => setExpenseView('category')}
              >
                 By Category
              </button>
              <button 
                style={expenseView === 'month' ? styles.activeViewBtn : styles.chartBtn}
                onClick={() => setExpenseView('month')}
              >
                 By Month
              </button>
            </div>
          </div>
          <div style={styles.pieChartContainer}>
            {currentExpenseData.length === 0 ? (
              <div style={styles.emptyState}>No expense data available</div>
            ) : (
              currentExpenseData.map((item, index) => {
                const percentage = maxExpense ? (item.amount / maxExpense * 100).toFixed(1) : 0;
                return (
                  <div key={item.name} style={styles.categoryItem}>
                    <div style={styles.categoryHeader}>
                      <span style={{...styles.categoryDot, background: colors[index % colors.length]}}></span>
                      <span style={styles.categoryName}>{item.name}</span>
                      <span style={styles.categoryAmount}>₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div style={styles.progressBarContainer}>
                      <div style={{
                        ...styles.progressBar,
                        width: `${percentage}%`,
                        background: colors[index % colors.length]
                      }}></div>
                    </div>
                    <div style={styles.categoryPercentage}>{percentage}% of max</div>
                  </div>
                );
              })
            )}
            <div style={styles.viewHint}>
              {expenseView === 'category' ? ' Showing expenses by spending category' : ' Showing expenses by month'}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>Financial Insights</h3>
        <div style={styles.insightsGrid}>
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}></div>
            <div>
              <p style={styles.insightLabel}>Highest Spending</p>
              <p style={styles.insightValue}>{highestCategory?.[0] || 'N/A'}</p>
              <p style={styles.insightSub}>₹{highestCategory?.[1]?.toLocaleString() || 0} total</p>
            </div>
          </div>
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}></div>
            <div>
              <p style={styles.insightLabel}>Savings Rate</p>
              <p style={styles.insightValue}>{savingsRate}%</p>
              <p style={styles.insightSub}>of total income</p>
            </div>
          </div>
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}></div>
            <div>
              <p style={styles.insightLabel}>Top Income Source</p>
              <p style={styles.insightValue}>Salary</p>
              <p style={styles.insightSub}>Primary earnings</p>
            </div>
          </div>
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}></div>
            <div>
              <p style={styles.insightLabel}>Monthly Goal</p>
              <p style={styles.insightValue}>{Math.min(100, Math.floor((monthlyIncome - monthlyExpenses) / 10000 * 100))}%</p>
              <p style={styles.insightSub}>Achievement rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div style={styles.transactionsSection}>
        <div style={styles.transactionsHeader}>
          <h3 style={styles.sectionTitle}> Recent Transactions</h3>
          
          <div style={styles.controls}>
            <input 
              type="text" 
              placeholder=" Search transactions..." 
              style={styles.searchInput} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            
            <div style={styles.dateRangeContainer}>
              <label style={styles.dateLabel}>From:</label>
              <input type="date" style={styles.dateInput} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <label style={styles.dateLabel}>To:</label>
              <input type="date" style={styles.dateInput} value={toDate} onChange={(e) => setToDate(e.target.value)} />
              {(fromDate || toDate) && (
                <button onClick={clearDateFilters} style={styles.clearBtn}>Clear</button>
              )}
            </div>
          </div>
          
          <div style={{...styles.controls, marginTop: '12px'}}>
            <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
            <select style={styles.select} value={`${sortBy}-${sortOrder}`} onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy); 
              setSortOrder(newSortOrder);
            }}>
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
            {role === 'admin' && <button style={styles.addBtn}>+ Add Transaction</button>}
          </div>
        </div>
        
        <div>
          {filteredTransactions.length === 0 ? (
            <div style={styles.emptyState}>
              <p>📭 No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map(t => (
              <div key={t.id} style={styles.transactionItem}>
                <div>
                  <div style={styles.transactionName}>{t.name}</div>
                  <div style={styles.transactionMeta}>{t.date} • {t.category}</div>
                </div>
                <div style={t.type === 'income' ? styles.amountPositive : styles.amountNegative}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// All styles - NO border/borderColor conflicts
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '32px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative'
  },
  bgAnimation: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 0
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
    position: 'relative',
    zIndex: 1
  },
  title: { fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: 'white' },
  subtitle: { color: 'rgba(255,255,255,0.8)', margin: '0' },
  roleSwitcher: { 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center', 
    background: 'rgba(255,255,255,0.2)', 
    backdropFilter: 'blur(10px)', 
    padding: '8px 20px', 
    borderRadius: '50px', 
    border: '1px solid rgba(255,255,255,0.3)'
  },
  roleLabel: { fontSize: '14px', fontWeight: '600', color: 'white' },
  roleBtn: { 
    padding: '6px 16px', 
    border: '1px solid rgba(255,255,255,0.3)', 
    background: 'rgba(255,255,255,0.1)', 
    borderRadius: '30px', 
    cursor: 'pointer', 
    fontSize: '13px', 
    color: 'white'
  },
  roleBtnActive: { 
    padding: '6px 16px', 
    border: '1px solid white', 
    background: 'white', 
    borderRadius: '30px', 
    cursor: 'pointer', 
    fontSize: '13px', 
    color: '#667eea'
  },
  adminBadge: { color: '#10b981', fontSize: '12px', fontWeight: '500' },
  viewerBadge: { color: '#f59e0b', fontSize: '12px', fontWeight: '500' },
  
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px',
    position: 'relative',
    zIndex: 1
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  cardIcon: { fontSize: '32px', marginBottom: '12px' },
  cardLabel: { color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '12px' },
  cardAmount: { fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' },
  cardChangePositive: { 
    color: '#10b981', 
    fontSize: '13px', 
    fontWeight: '600', 
    background: '#d1fae5', 
    padding: '4px 10px', 
    borderRadius: '20px', 
    display: 'inline-block' 
  },
  cardChangeNegative: { 
    color: '#ef4444', 
    fontSize: '13px', 
    fontWeight: '600', 
    background: '#fee2e2', 
    padding: '4px 10px', 
    borderRadius: '20px', 
    display: 'inline-block' 
  },
  
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '32px',
    position: 'relative',
    zIndex: 1
  },
  chartCard: { 
    background: 'rgba(255,255,255,0.95)', 
    backdropFilter: 'blur(10px)', 
    borderRadius: '20px', 
    padding: '24px' 
  },
  chartHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px', 
    paddingBottom: '12px', 
    borderBottom: '2px solid #f1f5f9' 
  },
  chartTitle: { fontSize: '18px', fontWeight: '700', margin: '0', color: '#0f172a' },
  chartBtn: { 
    padding: '6px 14px', 
    fontSize: '13px', 
    background: '#f8fafc', 
    border: '1px solid #e2e8f0', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    marginLeft: '8px', 
    transition: 'all 0.2s' 
  },
  activeViewBtn: { 
    padding: '6px 14px', 
    fontSize: '13px', 
    background: '#667eea', 
    color: 'white', 
    border: '1px solid #667eea', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    marginLeft: '8px' 
  },
  simpleChart: { padding: '20px', background: '#f8fafc', borderRadius: '12px' },
  chartSummary: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '20px', 
    paddingBottom: '10px', 
    borderBottom: '1px solid #e2e8f0' 
  },
  chartTotal: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a' },
  chartGrowth: { fontSize: '14px', color: '#10b981' },
  barChartContainer: { display: 'flex', gap: '8px', alignItems: 'flex-end', height: '250px' },
  barWrapper: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  bar: { 
    width: '100%', 
    borderRadius: '8px 8px 4px 4px', 
    cursor: 'pointer', 
    position: 'relative', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
  },
  barTooltip: { 
    position: 'absolute', 
    top: '-30px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    background: '#1e293b', 
    color: 'white', 
    padding: '4px 8px', 
    borderRadius: '6px', 
    fontSize: '11px', 
    whiteSpace: 'nowrap' 
  },
  barLabel: { fontSize: '11px', fontWeight: '600', color: '#64748b' },
  pieChartContainer: { padding: '10px', maxHeight: '350px', overflowY: 'auto' },
  categoryItem: { marginBottom: '20px' },
  categoryHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  categoryDot: { width: '12px', height: '12px', borderRadius: '50%' },
  categoryName: { flex: 1, fontSize: '14px', fontWeight: '500', color: '#475569' },
  categoryAmount: { fontSize: '14px', fontWeight: '600', color: '#0f172a' },
  progressBarContainer: { 
    width: '100%', 
    height: '8px', 
    background: '#e2e8f0', 
    borderRadius: '4px', 
    overflow: 'hidden', 
    marginBottom: '4px' 
  },
  progressBar: { 
    height: '100%', 
    borderRadius: '4px', 
    transition: 'width 0.3s ease' 
  },
  categoryPercentage: { fontSize: '11px', color: '#94a3b8', textAlign: 'right' },
  viewHint: { 
    marginTop: '16px', 
    padding: '12px', 
    background: '#f1f5f9', 
    borderRadius: '8px', 
    textAlign: 'center', 
    fontSize: '12px', 
    color: '#64748b' 
  },
  
  insightsSection: { 
    background: 'rgba(255,255,255,0.95)', 
    backdropFilter: 'blur(10px)', 
    borderRadius: '20px', 
    padding: '24px', 
    marginBottom: '32px', 
    position: 'relative', 
    zIndex: 1 
  },
  sectionTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#0f172a' },
  insightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  insightCard: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px', 
    padding: '16px', 
    background: '#f8fafc', 
    borderRadius: '16px', 
    transition: 'transform 0.2s', 
    cursor: 'pointer' 
  },
  insightIcon: { fontSize: '32px' },
  insightLabel: { fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' },
  insightValue: { fontSize: '20px', fontWeight: '700', margin: '0', color: '#0f172a' },
  insightSub: { fontSize: '10px', color: '#94a3b8', marginTop: '4px' },
  
  transactionsSection: { 
    background: 'rgba(255,255,255,0.95)', 
    backdropFilter: 'blur(10px)', 
    borderRadius: '20px', 
    padding: '24px', 
    position: 'relative', 
    zIndex: 1 
  },
  transactionsHeader: { marginBottom: '20px' },
  controls: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  searchInput: { 
    flex: '1', 
    padding: '10px 16px', 
    border: '2px solid #e2e8f0', 
    borderRadius: '12px', 
    fontSize: '14px', 
    minWidth: '200px', 
    background: 'white' 
  },
  select: { 
    padding: '10px 16px', 
    border: '2px solid #e2e8f0', 
    borderRadius: '12px', 
    fontSize: '14px', 
    background: 'white' 
  },
  addBtn: { 
    padding: '10px 20px', 
    background: '#3b82f6', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: '600', 
    cursor: 'pointer' 
  },
  dateRangeContainer: { 
    display: 'flex', 
    gap: '8px', 
    alignItems: 'center', 
    padding: '4px 12px', 
    background: '#f8fafc', 
    borderRadius: '12px', 
    border: '2px solid #e2e8f0' 
  },
  dateLabel: { fontSize: '12px', fontWeight: '600', color: '#64748b' },
  dateInput: { 
    padding: '6px 10px', 
    border: '1px solid #e2e8f0', 
    borderRadius: '8px', 
    fontSize: '12px' 
  },
  clearBtn: { 
    padding: '4px 12px', 
    background: '#ef4444', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '12px' 
  },
  transactionItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '16px 0', 
    borderBottom: '2px solid #f1f5f9', 
    transition: 'all 0.2s', 
    cursor: 'pointer' 
  },
  transactionName: { fontWeight: '600', color: '#0f172a', marginBottom: '4px' },
  transactionMeta: { fontSize: '12px', color: '#94a3b8' },
  amountPositive: { 
    fontWeight: '700', 
    color: '#10b981', 
    background: '#d1fae5', 
    padding: '4px 12px', 
    borderRadius: '20px' 
  },
  amountNegative: { 
    fontWeight: '700', 
    color: '#ef4444', 
    background: '#fee2e2', 
    padding: '4px 12px', 
    borderRadius: '20px' 
  },
  emptyState: { textAlign: 'center', padding: '40px', color: '#94a3b8' }
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  div[style*="background: rgba(255,255,255,0.95)"] {
    animation: fadeIn 0.5s ease-out;
  }
  
  button:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  
  @media (max-width: 1024px) {
    div[style*="grid-template-columns: repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    div[style*="grid-template-columns: repeat(2, 1fr)"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="grid-template-columns: repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  @media (max-width: 768px) {
    div[style*="display: flex"] {
      flex-direction: column;
    }
  }
  @media (max-width: 640px) {
    div[style*="grid-template-columns: repeat(4, 1fr)"],
    div[style*="grid-template-columns: repeat(2, 1fr)"] {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;
