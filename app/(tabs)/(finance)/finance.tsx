import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import {
  insertTransaction,
  getTransactions,
  getMonthlySummary,
  insertBudget,
  updateBudget,
  deleteBudget,
  getBudgets,
  getCategories,
  subscribeToTransactionsUpdates,
  subscribeToBudgetsUpdates,
} from "@/src/database/finance/finance_query";

// Types
type Transaction = {
  id: number;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: number;
  date: string;
  is_need?: boolean;
};

type Budget = {
  id: number;
  category_id: number;
  amount: number;
  period: "monthly";
};

type Category = {
  id: number;
  name: string;
  icon: string;
  type: "income" | "expense";
  color: string;
};

export default function FinanceDashboard() {
  // State management
  const [currentBalance, setCurrentBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetModalMode, setBudgetModalMode] = useState<"add" | "edit">("add");
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense" as "income" | "expense",
    title: "",
    amount: "",
    category: null as number | null,
    date: new Date().toISOString().split("T")[0],
    is_need: false,
    accountId: 1,
  });
  const [newBudget, setNewBudget] = useState({
    category_id: 1,
    amount: "",
    period: "monthly" as "weekly" | "monthly" | "yearly",
    startDate: new Date().toISOString().split("T")[0],
    userId: 1,
  });
  const [filter, setFilter] = useState("all");
  const [budgetExceeded, setBudgetExceeded] = useState<number | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  const STATIC_CATEGORIES: Category[] = [
    {
      id: 1,
      name: "Food",
      icon: "fast-food",
      type: "expense",
      color: "#e74c3c",
    },
    {
      id: 2,
      name: "Transport",
      icon: "bus",
      type: "expense",
      color: "#f39c12",
    },
    {
      id: 3,
      name: "Entertainment",
      icon: "film",
      type: "expense",
      color: "#3498db",
    },
    {
      id: 4,
      name: "Education",
      icon: "book",
      type: "expense",
      color: "#2ecc71",
    },
    {
      id: 5,
      name: "Other",
      icon: "pricetag",
      type: "expense",
      color: "#9b59b6",
    },
    {
      id: 6,
      name: "Allowance",
      icon: "cash",
      type: "income",
      color: "#27ae60",
    },
    {
      id: 7,
      name: "Part-time Job",
      icon: "briefcase",
      type: "income",
      color: "#16a085",
    },
    { id: 8, name: "Other", icon: "wallet", type: "income", color: "#1abc9c" },
  ];

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Load initial data
  useEffect(() => {
    const userId = 1;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load categories - try database first, fallback to static data
        try {
          const incomeCategories = await getCategories("income");
          const expenseCategories = await getCategories("expense");
          if (incomeCategories && expenseCategories) {
            setCategories([...incomeCategories, ...expenseCategories]);
          } else {
            setCategories(STATIC_CATEGORIES);
          }
        } catch (error) {
          console.error(
            "Error loading categories from DB, using static data:",
            error
          );
          setCategories(STATIC_CATEGORIES);
        }

        // Load transactions with current month/year
        const startDate = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-01`;
        const endDate = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-31`;

        const transactionsData = await getTransactions(
          userId,
          startDate,
          endDate
        );
        if (transactionsData) {
          setTransactions(
            transactionsData.map((t: any) => ({
              ...t,
              category: t.categoryId ?? t.category,
            }))
          );
        }

        // Load budgets
        const budgetsData = await getBudgets(userId);
        if (budgetsData) {
          setBudgets(
            budgetsData.map((b: any) => ({
              ...b,
              category_id: b.categoryId ?? b.category_id,
            }))
          );
        }

        // Load monthly summary
        const summary = await getMonthlySummary(
          userId,
          currentMonth,
          currentYear
        );
        if (summary) {
          setMonthlyIncome(summary.income);
          setMonthlyExpenses(summary.expenses);
          setCurrentBalance(summary.balance);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        showSnackbar("Failed to load financial data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up subscriptions
    const unsubscribeTransactions = subscribeToTransactionsUpdates(() => {
      loadData();
    });

    const unsubscribeBudgets = subscribeToBudgetsUpdates(() => {
      loadData();
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeBudgets();
    };
  }, []);

  // Check for exceeded budgets whenever transactions change
  useEffect(() => {
    if (transactions.length === 0 || budgets.length === 0) return;

    budgets.forEach((budget) => {
      const categoryExpenses = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === budget.category_id &&
            new Date(t.date).getMonth() + 1 === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
        )
        .reduce((sum, t) => sum + t.amount, 0);

      if (categoryExpenses >= budget.amount && budget.amount > 0) {
        setBudgetExceeded(budget.category_id);
        const category = categories.find((c) => c.id === budget.category_id);
        showSnackbar(
          `You've exceeded your ${category?.name} budget for this month!`,
          "error"
        );
      }
    });
  }, [transactions, budgets, categories]);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "income") return t.type === "income";
    if (filter === "expense") return t.type === "expense";
    return true;
  });

  // Get category by id
  const getCategoryById = (id: number) => categories.find((c) => c.id === id);

  // Add new transaction
  const handleAddTransaction = async () => {
    if (
      !newTransaction.title ||
      !newTransaction.amount ||
      !newTransaction.category
    ) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount)) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }

    try {
      const transaction = {
        userId: 1,
        type: newTransaction.type,
        title: newTransaction.title,
        amount: amount,
        categoryId: newTransaction.category,
        date: newTransaction.date,
        isNeed: newTransaction.is_need,
        accountId: newTransaction.accountId,
      };

      const result = await insertTransaction(transaction);

      if (result) {
        showSnackbar("Transaction added successfully", "success");
        setShowAddModal(false);
        setNewTransaction({
          type: "expense",
          title: "",
          amount: "",
          category: null,
          date: new Date().toISOString().split("T")[0],
          is_need: false,
          accountId: 1,
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      showSnackbar("Failed to add transaction", "error");
    }
  };

  // Add new budget
  const handleAddBudget = async () => {
    if (!newBudget.amount || isNaN(parseFloat(newBudget.amount))) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }

    try {
      const budget = {
        userId: 1,
        categoryId: newBudget.category_id,
        amount: parseFloat(newBudget.amount),
        period: newBudget.period,
        startDate: newBudget.startDate,
      };

      const result = await insertBudget(budget);

      if (result) {
        showSnackbar("Budget added successfully", "success");
        setShowBudgetModal(false);
        setNewBudget({
          category_id: 1,
          amount: "",
          period: "monthly",
          startDate: new Date().toISOString().split("T")[0],
          userId: 1,
        });
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      showSnackbar("Failed to add budget", "error");
    }
  };

  // Update existing budget
  const handleUpdateBudget = async () => {
    if (
      !currentBudget ||
      !newBudget.amount ||
      isNaN(parseFloat(newBudget.amount))
    ) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }

    try {
      const updatedBudget = {
        id: currentBudget.id,
        userId: 1,
        categoryId: newBudget.category_id,
        amount: parseFloat(newBudget.amount),
        period: newBudget.period,
        startDate: newBudget.startDate,
      };

      const result = await updateBudget(currentBudget.id, updatedBudget);

      if (result) {
        showSnackbar("Budget updated successfully", "success");
        setShowBudgetModal(false);
        setCurrentBudget(null);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      showSnackbar("Failed to update budget", "error");
    }
  };

  // Delete budget
  const handleDeleteBudget = async (id: number) => {
    try {
      const result = await deleteBudget(id, 1);
      if (result) {
        showSnackbar("Budget deleted successfully", "success");
        setShowBudgetModal(false);
        setCurrentBudget(null);
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      showSnackbar("Failed to delete budget", "error");
    }
  };

  // Open budget modal in add mode
  const openAddBudgetModal = () => {
    setBudgetModalMode("add");
    setNewBudget({
      category_id: 1,
      amount: "",
      period: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      userId: 1,
    });
    setShowBudgetModal(true);
  };

  // Open budget modal in edit mode
  const openEditBudgetModal = (budget: Budget) => {
    setBudgetModalMode("edit");
    setCurrentBudget(budget);
    setNewBudget({
      category_id: budget.category_id,
      amount: budget.amount.toString(),
      period: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      userId: 1,
    });
    setShowBudgetModal(true);
  };

  // Render transaction item with category icon
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const category = getCategoryById(item.category);

    return (
      <View className="bg-white p-4 mb-3 rounded-lg shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View
              className={`w-10 h-10 rounded-full ${
                item.type === "income" ? "bg-green-100" : "bg-red-100"
              } items-center justify-center mr-3`}
            >
              <Ionicons
                name={
                  (category?.icon as React.ComponentProps<
                    typeof Ionicons
                  >["name"]) || "receipt-outline"
                }
                size={20}
                color={
                  category?.color ||
                  (item.type === "income" ? "#27ae60" : "#e74c3c")
                }
              />
            </View>
            <View className="flex-1">
              <Text className="font-medium" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-gray-500 text-sm">{category?.name}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className={`font-bold ${
                item.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.type === "income" ? "+" : "-"}₱{item.amount.toFixed(2)}
            </Text>
            <Text className="text-gray-400 text-xs">{item.date}</Text>
          </View>
        </View>
        {item.type === "expense" && (
          <View className="mt-2">
            <View
              className={`px-2 py-1 rounded-full self-start ${
                item.is_need ? "bg-blue-100" : "bg-purple-100"
              }`}
            >
              <Text
                className={`text-xs ${
                  item.is_need ? "text-blue-800" : "text-purple-800"
                }`}
              >
                {item.is_need ? "Need" : "Want"}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Get available categories for budget (only expense categories without existing budgets)
  const getAvailableBudgetCategories = () => {
    return categories
      .filter((c) => c.type === "expense")
      .filter((c) => !budgets.some((b) => b.category_id === c.id));
  };

  // Render category buttons for budget modal
  const renderBudgetCategoryButtons = () => {
    const availableCategories = getAvailableBudgetCategories();

    return (
      <View className="flex-row flex-wrap">
        {availableCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className={`p-2 rounded-full mr-2 mb-2 ${
              newBudget.category_id === category.id
                ? "bg-blue-100 border border-blue-300"
                : "bg-gray-100"
            }`}
            onPress={() =>
              setNewBudget({ ...newBudget, category_id: category.id })
            }
          >
            <View className="flex-row items-center">
              <Ionicons
                name={
                  category.icon as React.ComponentProps<typeof Ionicons>["name"]
                }
                size={16}
                color={category.color}
                className="mr-1"
              />
              <Text>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render category buttons for transaction modal
  const renderCategoryButtons = () => {
    const availableCategories =
      categories.length > 0
        ? categories.filter((c) => c.type === newTransaction.type)
        : STATIC_CATEGORIES.filter((c) => c.type === newTransaction.type);

    return (
      <View className="flex-row flex-wrap">
        {availableCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className={`p-2 rounded-full mr-2 mb-2 ${
              newTransaction.category === category.id
                ? "bg-blue-100 border border-blue-300"
                : "bg-gray-100"
            }`}
            onPress={() =>
              setNewTransaction({ ...newTransaction, category: category.id })
            }
          >
            <View className="flex-row items-center">
              <Ionicons
                name={
                  category.icon as React.ComponentProps<typeof Ionicons>["name"]
                }
                size={16}
                color={category.color}
                className="mr-1"
              />
              <Text>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 mb-16">
      {/* Header */}
      <View className="bg-secondary px-6 pt-12 pb-8 rounded-b-3xl">
        <View className="mb-2">
          <Text className="text-blue-100">Current Balance</Text>
          <Text className="text-white text-4xl font-bold mt-1">
            ₱{currentBalance.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="items-center">
            <Text className="text-blue-100 text-sm">Monthly Income</Text>
            <Text className="text-white text-lg font-bold">
              ₱{monthlyIncome.toFixed(2)}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-blue-100 text-sm">Monthly Expenses</Text>
            <Text className="text-white text-lg font-bold">
              ₱{monthlyExpenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View className="flex-row justify-around border-b border-gray-200 mx-4 mt-4">
        <TouchableOpacity
          className={`py-3 px-2 ${
            activeTab === "overview" ? "border-b-2 border-secondary" : ""
          }`}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            className={`font-medium ${
              activeTab === "overview" ? "text-secondary" : "text-gray-500"
            }`}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-3 px-2 ${
            activeTab === "transactions" ? "border-b-2 border-secondary" : ""
          }`}
          onPress={() => setActiveTab("transactions")}
        >
          <Text
            className={`font-medium ${
              activeTab === "transactions" ? "text-secondary" : "text-gray-500"
            }`}
          >
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-3 px-2 ${
            activeTab === "reports" ? "border-b-2 border-secondary" : ""
          }`}
          onPress={() => setActiveTab("reports")}
        >
          <Text
            className={`font-medium ${
              activeTab === "reports" ? "text-secondary" : "text-gray-500"
            }`}
          >
            Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && (
          <>
            {/* Recent Transactions */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold">Recent Transactions</Text>
                <TouchableOpacity onPress={() => setActiveTab("transactions")}>
                  <Text className="text-secondary">View All</Text>
                </TouchableOpacity>
              </View>
              {transactions.length > 0 ? (
                <FlatList
                  data={transactions.slice(0, 5)}
                  renderItem={renderTransactionItem}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-white p-6 rounded-lg items-center justify-center">
                  <Ionicons
                    name="receipt-outline"
                    size={48}
                    color="#ccc"
                    className="mb-3"
                  />
                  <Text className="text-gray-500">No transactions found</Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === "transactions" && (
          <View className="mb-16">
            <View className="flex-row justify-between mb-4">
              <TouchableOpacity
                className={`px-4 py-2 rounded-full ${
                  filter === "all"
                    ? "bg-secondary"
                    : "bg-white border border-gray-200"
                }`}
                onPress={() => setFilter("all")}
              >
                <Text
                  className={filter === "all" ? "text-white" : "text-gray-700"}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded-full ${
                  filter === "income"
                    ? "bg-green-500"
                    : "bg-white border border-gray-200"
                }`}
                onPress={() => setFilter("income")}
              >
                <Text
                  className={
                    filter === "income" ? "text-white" : "text-gray-700"
                  }
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded-full ${
                  filter === "expense"
                    ? "bg-red-500"
                    : "bg-white border border-gray-200"
                }`}
                onPress={() => setFilter("expense")}
              >
                <Text
                  className={
                    filter === "expense" ? "text-white" : "text-gray-700"
                  }
                >
                  Expenses
                </Text>
              </TouchableOpacity>
            </View>

            {filteredTransactions.length > 0 ? (
              <FlatList
                data={filteredTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-white p-6 rounded-lg items-center justify-center">
                <View className="mb-3">
                  <Ionicons name="receipt-outline" size={48} color="#ccc" />
                </View>
                <Text className="text-gray-500">No transactions found</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "reports" && (
          <View className="mb-16">
            {/* Reports Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">
                Financial Reports
              </Text>
              <Text className="text-gray-500">
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>

            {/* Summary Cards */}
            <View className="flex-row justify-between mb-6 space-x-3 gap-2">
              <View className="bg-white p-4 rounded-xl shadow-sm flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="bg-green-100 p-2 rounded-full mr-2">
                    <Ionicons name="trending-up" size={16} color="#10b981" />
                  </View>
                  <Text className="text-gray-500">Income</Text>
                </View>
                <Text className="text-xl font-bold text-green-600">
                  ₱{monthlyIncome.toFixed(2)}
                </Text>
              </View>

              <View className="bg-white p-4 rounded-xl shadow-sm flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="bg-red-100 p-2 rounded-full mr-2">
                    <Ionicons name="trending-down" size={16} color="#ef4444" />
                  </View>
                  <Text className="text-gray-500">Expenses</Text>
                </View>
                <Text className="text-xl font-bold text-red-600">
                  ₱{monthlyExpenses.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Income vs Expenses Chart */}
            <View className="bg-white p-5 rounded-xl shadow-sm mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-medium text-gray-700 mb-4">
                  Income vs Expenses
                </Text>
                <Text className="text-sm text-gray-500">This Month</Text>
              </View>

              <View className="flex-row items-end h-40 mb-2 border-b border-gray-100">
                <View className="flex-1 items-center">
                  <View
                    className="w-6 bg-green-500 rounded-t-sm"
                    style={{
                      height: `${Math.min(
                        100,
                        (monthlyIncome / (monthlyIncome + monthlyExpenses)) *
                          100
                      )}%`,
                    }}
                  />
                  <Text className="text-xs mt-1 text-gray-500">Income</Text>
                </View>
                <View className="flex-1 items-center">
                  <View
                    className="w-6 bg-red-500 rounded-t-sm"
                    style={{
                      height: `${Math.min(
                        100,
                        (monthlyExpenses / (monthlyIncome + monthlyExpenses)) *
                          100
                      )}%`,
                    }}
                  />
                  <Text className="text-xs mt-1 text-gray-500">Expenses</Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">
                  Net: ₱{(monthlyIncome - monthlyExpenses).toFixed(2)}
                </Text>
                <Text className="text-sm text-gray-500">
                  Savings:{" "}
                  {monthlyIncome > 0
                    ? `${(
                        ((monthlyIncome - monthlyExpenses) / monthlyIncome) *
                        100
                      ).toFixed(1)}%`
                    : "0%"}
                </Text>
              </View>
            </View>

            {/* Expense Categories Breakdown */}
            <View className="bg-white p-5 rounded-xl shadow-sm mb-6">
              <Text className="font-medium text-gray-700 mb-4">
                Expenses by Category
              </Text>

              {categories
                .filter((c) => c.type === "expense")
                .map((category) => {
                  const categoryExpenses = transactions
                    .filter(
                      (t) => t.type === "expense" && t.category === category.id
                    )
                    .reduce((sum, t) => sum + t.amount, 0);

                  if (categoryExpenses <= 0) return null;

                  const percentage = (categoryExpenses / monthlyExpenses) * 100;

                  return (
                    <View key={`category-${category.id}`} className="mb-3">
                      <View className="flex-row justify-between items-center mb-1">
                        <View className="flex-row items-center">
                          <View
                            className="w-8 h-8 rounded-full items-center justify-center mr-2"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <Ionicons
                              name={category.icon as any}
                              size={16}
                              color={category.color}
                            />
                          </View>
                          <Text>{category.name}</Text>
                        </View>
                        <Text className="font-medium">
                          ${categoryExpenses.toFixed(2)} (
                          {percentage.toFixed(0)}%)
                        </Text>
                      </View>
                      <View className="w-full bg-gray-100 rounded-full h-2">
                        <View
                          className="h-2 rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}

              {transactions.filter((t) => t.type === "expense").length ===
                0 && (
                <View className="items-center py-4">
                  <Ionicons
                    name="pie-chart-outline"
                    size={32}
                    color="#d1d5db"
                  />
                  <Text className="text-gray-500 mt-2">
                    No expense data available
                  </Text>
                </View>
              )}
            </View>

            {/* Recent Transactions */}
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Recent Transactions
            </Text>
            {transactions.slice(0, 3).map((transaction) => {
              const category = getCategoryById(transaction.category);
              const uniqueKey = `transaction-${transaction.id}-${transaction.title}-${transaction.amount}`;
              return (
                <View
                  key={uniqueKey}
                  className="bg-white p-4 rounded-xl shadow-sm mb-3"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Ionicons
                          name={(category?.icon as any) || "receipt-outline"}
                          size={20}
                          color={
                            category?.color ||
                            (transaction.type === "income"
                              ? "#10b981"
                              : "#ef4444")
                          }
                        />
                      </View>
                      <View>
                        <Text className="font-medium">{transaction.title}</Text>
                        <Text className="text-sm text-gray-500">
                          {category?.name || "Uncategorized"}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₱
                      {transaction.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              );
            })}

            {transactions.length === 0 && (
              <View className="bg-white p-6 rounded-xl items-center justify-center">
                <Ionicons name="receipt-outline" size={32} color="#d1d5db" />
                <Text className="text-gray-500 mt-2">No transactions yet</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Transaction Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-secondary w-16 h-16 rounded-full items-center justify-center shadow-xl"
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View className="flex-1 bg-secondary/50 bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Add Transaction</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around mb-6">
              <TouchableOpacity
                className={`px-6 py-3 rounded-full ${
                  newTransaction.type === "expense"
                    ? "bg-red-500"
                    : "bg-gray-200"
                }`}
                onPress={() =>
                  setNewTransaction({ ...newTransaction, type: "expense" })
                }
              >
                <Text
                  className={
                    newTransaction.type === "expense"
                      ? "text-white"
                      : "text-gray-700"
                  }
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-6 py-3 rounded-full ${
                  newTransaction.type === "income"
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
                onPress={() =>
                  setNewTransaction({ ...newTransaction, type: "income" })
                }
              >
                <Text
                  className={
                    newTransaction.type === "income"
                      ? "text-white"
                      : "text-gray-700"
                  }
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Title</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg"
                placeholder="e.g. Groceries, Allowance"
                value={newTransaction.title}
                onChangeText={(text) =>
                  setNewTransaction({ ...newTransaction, title: text })
                }
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Amount</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={newTransaction.amount}
                onChangeText={(text) =>
                  setNewTransaction({ ...newTransaction, amount: text })
                }
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Category</Text>
              <View className="flex-row flex-wrap">
                {renderCategoryButtons()}
              </View>
            </View>

            {newTransaction.type === "expense" && (
              <View className="mb-6">
                <Text className="text-gray-600 mb-2">
                  Is this a need or want?
                </Text>
                <View className="flex-row">
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-l-lg items-center ${
                      newTransaction.is_need ? "bg-secondary" : "bg-gray-200"
                    }`}
                    onPress={() =>
                      setNewTransaction({ ...newTransaction, is_need: true })
                    }
                  >
                    <Text
                      className={
                        newTransaction.is_need ? "text-white" : "text-gray-700"
                      }
                    >
                      Need
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-r-lg items-center ${
                      !newTransaction.is_need ? "bg-purple-500" : "bg-gray-200"
                    }`}
                    onPress={() =>
                      setNewTransaction({ ...newTransaction, is_need: false })
                    }
                  >
                    <Text
                      className={
                        !newTransaction.is_need ? "text-white" : "text-gray-700"
                      }
                    >
                      Want
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-secondary p-4 rounded-lg items-center"
              onPress={handleAddTransaction}
            >
              <Text className="text-white font-medium">Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === "success" ? "#2ecc71" : "#e74c3c",
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
