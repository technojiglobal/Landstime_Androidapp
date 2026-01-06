// pages/superadmin/MyFinance.jsx
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
} from "lucide-react";

import FinanceHeader from "../../components/superadmin/finance/FinanceHeader";
import StatFinanceCard from "../../components/superadmin/finance/StatFinanceCard";
import RevenueChart from "../../components/superadmin/finance/RevenueChart";
import ExpenseDonut from "../../components/superadmin/finance/ExpenseDonut";
import RecentTransactions from "../../components/superadmin/finance/RecentTransactions";
import WeeklyIncomeExpense from "../../components/superadmin/finance/WeeklyIncomeExpense";
import ProfitLossSummary from "../../components/superadmin/finance/ProfitLossSummary";
const MyFinance = () => {
    return (
        <div className="space-y-8">
            <FinanceHeader />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatFinanceCard
                    title="Total Revenue"
                    value="₹24.5L"
                    change="+18.2% from last month"
                    icon={TrendingUp}
                    bg="linear-gradient(135deg, #D1FAE5, #ECFDF5)"
                    color="#10B981"
                />

                
                <StatFinanceCard
                    title="Today's Income"
                    value="₹2.4L"
                    change="+8% vs yesterday"
                    icon={BarChart3}
                    bg="linear-gradient(135deg, #DBEAFE, #EFF6FF)"
                    color="#3B82F6"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <RevenueChart />
                </div>
                <ExpenseDonut />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <WeeklyIncomeExpense />
                <RecentTransactions />
            </div>

            <ProfitLossSummary />
        </div>
    );
};

export default MyFinance;
