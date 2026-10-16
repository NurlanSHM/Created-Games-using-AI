  import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, TrendingUp, DollarSign, AlertTriangle, ShieldAlert,
  Truck, Users, Briefcase, Zap, Lock, RefreshCw, Award, ChevronRight,
  Package, Clock, Skull, Info, CreditCard, Delete, AlertCircle, Sparkles,
  ClipboardList, Receipt, Activity, ZapOff
} from 'lucide-react';

const BASE_ITEMS = {
  apple: { buy: 2, sell: 6, demand: 'medium', life: 5, type: 'basic', icon: '🍎' },
  bread: { buy: 3, sell: 8, demand: 'high', life: 2, type: 'basic', icon: '🍞' },
  milk: { buy: 4, sell: 10, demand: 'medium', life: 2, type: 'basic', icon: '🥛' },
  candy: { buy: 1, sell: 4, demand: 'low', life: 14, type: 'basic', icon: '🍬' },
  coffee: { buy: 9, sell: 18, demand: 'high', life: 10, type: 'basic', icon: '☕' },
  juice: { buy: 5, sell: 13, demand: 'medium', life: 6, type: 'basic', icon: '🧃' },
  eggs: { buy: 3, sell: 7, demand: 'high', life: 4, type: 'basic', icon: '🥚' },
};

const PREMIUM_ITEMS = {
  wine: { buy: 28, sell: 65, demand: 'medium', life: 30, type: 'premium', icon: '🍷' },
  cheese: { buy: 14, sell: 38, demand: 'high', life: 4, type: 'premium', icon: '🧀' },
  chocolate: { buy: 10, sell: 24, demand: 'high', life: 8, type: 'premium', icon: '🍫' },
  steak: { buy: 20, sell: 45, demand: 'medium', life: 3, type: 'premium', icon: '🥩' },
};

const BLACK_MARKET_ITEMS = {
  cigarettes: { buy: 8, sell: 25, demand: 'high', life: 100, risk: 0.3, type: 'illegal', icon: '🚬' },
  bootleg_dvd: { buy: 3, sell: 15, demand: 'medium', life: 100, risk: 0.2, type: 'illegal', icon: '💿' },
  fake_watch: { buy: 15, sell: 50, demand: 'low', life: 100, risk: 0.4, type: 'illegal', icon: '⌚' },
  counterfeit_bag: { buy: 25, sell: 80, demand: 'low', life: 100, risk: 0.5, type: 'illegal', icon: '👜' },
};

const UPGRADES_LIST = {
  bigger_store: { name: 'Expansion', cost: 250, desc: '+Capacity/Customers', icon: <Users className="w-5 h-5" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  premium_items: { name: 'Luxury License', cost: 400, desc: 'Unlock premium goods', icon: <Award className="w-5 h-5" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  advertising: { name: 'Marketing', cost: 300, desc: '+Customer flow', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  refrigeration: { name: 'Cold Storage', cost: 500, desc: 'Stop spoilage', icon: <Lock className="w-5 h-5" />, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  security: { name: 'Security', cost: 450, desc: 'Prevent theft/raids', icon: <ShieldAlert className="w-5 h-5" />, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  express_delivery: { name: 'Prime Delivery', cost: 350, desc: '+25% sell prices', icon: <Truck className="w-5 h-5" />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  loyalty_program: { name: 'Loyalty App', cost: 200, desc: '2x rep gain', icon: <Users className="w-5 h-5" />, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  efficient_lighting: { name: 'LED Lights', cost: 150, desc: '-40% rent', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  vip_banking: { name: 'VIP Banking', cost: 600, desc: 'Lower Interest & +Credit', icon: <CreditCard className="w-5 h-5" />, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' }
};

const ACHIEVEMENTS_LIST = {
  first_sale: { name: 'First Sale', desc: 'Make your first sale' },
  big_spender: { name: 'Big Spender', desc: 'Spend $500 in one purchase' },
  millionaire: { name: 'Thousandaire', desc: 'Reach $1000' },
  popular: { name: 'Popular Shop', desc: 'Reach 75% reputation' },
  legendary: { name: 'Legendary Store', desc: 'Reach 100% reputation' },
  speed_demon: { name: 'Speed Demon', desc: 'Win in under 30 days' },
  risk_taker: { name: 'Risk Taker', desc: 'Take out a loan of $300+' },
  black_market_king: { name: 'Underground King', desc: 'Make 10 black market deals' },
  survive_raid: { name: 'Slippery', desc: 'Survive a police raid' },
  hoarder: { name: 'Hoarder', desc: 'Own 50+ items at once' },
};

const formatMoney = (amount) => `$${amount.toLocaleString()}`;

const getReputationTier = (rep) => {
  if (rep >= 100) return { name: "LEGENDARY", color: "text-amber-400" };
  if (rep >= 90) return { name: "LOCAL FAVORITE", color: "text-purple-400" };
  if (rep >= 75) return { name: "POPULAR", color: "text-blue-400" };
  if (rep >= 50) return { name: "AVERAGE", color: "text-gray-400" };
  return { name: "UNKNOWN", color: "text-red-400" };
};

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [activeTab, setActiveTab] = useState('market');
  const [logs, setLogs] = useState([]);
  const [animatingSales, setAnimatingSales] = useState(false);
  const [salesProgress, setSalesProgress] = useState([]);
  const [bankInput, setBankInput] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [lastEarnings, setLastEarnings] = useState(null);
  const [lastSpending, setLastSpending] = useState(null);
  const earningsTimeoutRef = useRef(null);
  const spendingTimeoutRef = useRef(null);

  const activityEndRef = useRef(null);
  const salesEndRef = useRef(null);

  const startGame = (difficulty) => {
    let config = {};
    if (difficulty === 'easy') {
      config = { money: 200, reputation: 65, baseRent: 8, buyMod: 0.75, sellMod: 1.05, upgradeMod: 0.8, winGoal: 800, volatility: 0.08, interestRate: 0.10 };
    } else if (difficulty === 'hard') {
      config = { money: 60, reputation: 25, baseRent: 35, buyMod: 1.35, sellMod: 1.0, upgradeMod: 1.4, winGoal: 2500, volatility: 0.45, interestRate: 0.25 };
    } else {
      config = { money: 120, reputation: 50, baseRent: 18, buyMod: 1.0, sellMod: 1.0, upgradeMod: 1.0, winGoal: 1500, volatility: 0.18, interestRate: 0.15 };
    }

    const marketPrices = {};
    const allItems = { ...BASE_ITEMS, ...PREMIUM_ITEMS };
    Object.keys(allItems).forEach(key => {
      marketPrices[key] = Math.floor(allItems[key].buy * config.buyMod);
    });

    const initialState = {
      difficulty,
      ...config,
      day: 1,
      sessionsToday: 0,
      totalEarnings: 0,
      totalItemsSold: 0,
      loanBalance: 0,
      blackMarketUnlocked: false,
      blackMarketHeat: 0,
      blackMarketDeals: 0,
      timesRaided: 0,
      inventory: [],
      upgrades: Object.keys(UPGRADES_LIST).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      achievements: Object.keys(ACHIEVEMENTS_LIST).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      marketPrices,
      gameOver: false,
      gameWon: false
    };

    setGameState(initialState);
    setCurrentEvent(null);
    setLastEarnings(null);
    setLastSpending(null);
    setLogs([]);
    addLog("Welcome to Store Tycoon! Buy low, sell high.", "system");
  };

  const addLog = (msg, category = 'ops', type = 'info') => {
    setLogs(prev => [...prev.slice(-49), { id: Date.now() + Math.random(), msg, category, type }]);
  };

  useEffect(() => {
    if (activityEndRef.current) {
      activityEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (salesEndRef.current) {
        salesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [salesProgress]);

  useEffect(() => {
    if (gameState && gameState.sessionsToday >= 2 && !gameState.gameOver && !gameState.gameWon && !animatingSales) {
        addLog("Day ended. Processing overnight stats...", "system", "warn");
        const timer = setTimeout(() => {
            nextDay();
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [gameState?.sessionsToday, animatingSales]);

  const buyItem = (key, type, quantity) => {
    if (!gameState) return;

    let itemData;
    if (type === 'basic') itemData = BASE_ITEMS[key];
    else if (type === 'premium') itemData = PREMIUM_ITEMS[key];
    else itemData = BLACK_MARKET_ITEMS[key];

    const price = type === 'illegal' ? itemData.buy : gameState.marketPrices[key];
    const totalCost = price * quantity;

    if (gameState.money < totalCost) {
      addLog(`Not enough money! Need ${formatMoney(totalCost)}`, 'finance', 'error');
      return;
    }

    if (spendingTimeoutRef.current) clearTimeout(spendingTimeoutRef.current);
    setLastSpending(totalCost);
    spendingTimeoutRef.current = setTimeout(() => {
        setLastSpending(null);
    }, 5000);

    const newItems = Array(quantity).fill(null).map(() => ({
      name: key,
      expires: gameState.day + itemData.life,
      buyPrice: price,
      illegal: type === 'illegal',
      risk: itemData.risk || 0
    }));

    setGameState(prev => {
      let heat = prev.blackMarketHeat;
      let deals = prev.blackMarketDeals;

      if (type === 'illegal') {
        heat += Math.floor(itemData.risk * quantity * 2);
        deals += 1;
      }

      const newAchievements = { ...prev.achievements };
      if (totalCost >= 500 && !newAchievements.big_spender) {
        newAchievements.big_spender = true;
        addLog("🏆 ACHIEVEMENT: Big Spender!", 'system', 'gold');
      }
      if (deals >= 10 && !newAchievements.black_market_king) {
        newAchievements.black_market_king = true;
        addLog("🏆 ACHIEVEMENT: Underground King!", 'system', 'gold');
      }

      const newPrices = { ...prev.marketPrices };
      if (type !== 'illegal' && quantity >= 3) {
         const impact = Math.max(1, Math.floor(price * prev.volatility * 0.3 * (quantity / 5)));
         newPrices[key] = Math.min(newPrices[key] + impact, Math.floor(itemData.buy * prev.buyMod * 1.8));
      }

      return {
        ...prev,
        money: prev.money - totalCost,
        inventory: [...prev.inventory, ...newItems],
        blackMarketHeat: heat,
        blackMarketDeals: deals,
        marketPrices: newPrices,
        achievements: newAchievements
      };
    });

    addLog(`Bought ${quantity}x ${key} for ${formatMoney(totalCost)}`, 'finance', 'success');
  };

  const buyUpgrade = (key) => {
    const upgrade = UPGRADES_LIST[key];
    const cost = Math.floor(upgrade.cost * gameState.upgradeMod);

    if (gameState.money < cost) {
      addLog("Not enough cash for this upgrade!", 'finance', 'error');
      return;
    }

    setGameState(prev => ({
      ...prev,
      money: prev.money - cost,
      upgrades: { ...prev.upgrades, [key]: true }
    }));
    addLog(`Purchased Upgrade: ${upgrade.name}`, 'finance', 'success');
  };

  const handleBankAction = (action) => {
    const amount = parseInt(bankInput);
    if (!amount || amount <= 0) {
        addLog("Please enter a valid amount on the keypad.", "system", "error");
        return;
    }

    let maxLoan = gameState.difficulty === 'hard' ? 150 : 500;
    if (gameState.upgrades.vip_banking) maxLoan += 500;

    if (action === 'borrow') {
        const available = maxLoan - gameState.loanBalance;
        if (amount > available) {
            addLog(`Cannot borrow that much! Limit: ${formatMoney(available)}`, 'finance', 'error');
            return;
        }

        setGameState(prev => {
            const newAchievements = { ...prev.achievements };
            if (amount >= 300 && !newAchievements.risk_taker) {
                newAchievements.risk_taker = true;
                addLog("🏆 ACHIEVEMENT: Risk Taker!", 'system', 'gold');
            }
            return {
                ...prev,
                money: prev.money + amount,
                loanBalance: prev.loanBalance + amount,
                achievements: newAchievements
            };
        });
        addLog(`Borrowed ${formatMoney(amount)}`, 'finance', 'warn');
        setBankInput('');
    }

    if (action === 'repay') {
        if (amount > gameState.money) {
            addLog("Not enough cash!", 'finance', 'error');
            return;
        }
        if (amount > gameState.loanBalance) {
            const realAmount = gameState.loanBalance;
            setGameState(prev => ({
                ...prev,
                money: prev.money - realAmount,
                loanBalance: 0
            }));
            addLog(`Loan paid off fully! (-${formatMoney(realAmount)})`, 'finance', 'success');
        } else {
            setGameState(prev => ({
                ...prev,
                money: prev.money - amount,
                loanBalance: prev.loanBalance - amount
            }));
            addLog(`Repaid ${formatMoney(amount)} of loan`, 'finance', 'success');
        }
        setBankInput('');
    }
  };

  const handleKeypad = (val) => {
      if (val === 'C') {
          setBankInput('');
      } else if (val === 'back') {
          setBankInput(prev => prev.slice(0, -1));
      } else {
          if (bankInput.length < 6) {
              setBankInput(prev => prev + val);
          }
      }
  }

  const startSalesSession = async () => {
    if (gameState.inventory.length === 0) {
      addLog("Inventory empty! Cannot open store.", 'ops', 'error');
      return;
    }
    if (gameState.sessionsToday >= 2) {
      addLog("Already opened store twice today. Time to sleep.", 'system', 'error');
      return;
    }

    setAnimatingSales(true);
    setSalesProgress([]);
    
    if (earningsTimeoutRef.current) clearTimeout(earningsTimeoutRef.current);
    setLastEarnings(null);

    let baseCust = Math.floor(Math.random() * 6) + 4;
    if (gameState.difficulty === 'easy') baseCust += 3;
    if (gameState.difficulty === 'hard') baseCust -= 1;
    if (gameState.upgrades.bigger_store) baseCust += 4;
    if (gameState.upgrades.advertising) baseCust += Math.floor(Math.random() * 5) + 2;

    const tierMult = gameState.reputation >= 90 ? 1.2 : (gameState.reputation >= 75 ? 1.1 : 1.0);
    const totalCustomers = Math.floor(baseCust * tierMult);

    const customerTypes = [
      { name: 'Bargain Hunter', sensitivity: 0.3, type: 'cheap', icon: '📉' },
      { name: 'Rich Shopper', sensitivity: -0.2, type: 'premium', icon: '💎' },
      { name: 'Regular', sensitivity: 0, type: 'any', icon: '😐' },
      { name: 'Fan', sensitivity: -0.1, type: 'any', icon: '🤩' },
      { name: 'Skeptic', sensitivity: 0.2, type: 'any', icon: '🤨' },
    ];

    let currentInventory = [...gameState.inventory];
    let earned = 0;
    let salesCount = 0;
    let newReputation = gameState.reputation;
    const sessionLogs = [];

    for (let i = 0; i < totalCustomers; i++) {
      await new Promise(r => setTimeout(r, 400));

      if (currentInventory.length === 0) {
        setSalesProgress(prev => [...prev, { text: "🚫 SOLD OUT!", color: "text-red-500" }]);
        break;
      }

      const customer = customerTypes[Math.floor(Math.random() * customerTypes.length)];
      const itemIdx = Math.floor(Math.random() * currentInventory.length);
      const item = currentInventory[itemIdx];

      const allMaster = { ...BASE_ITEMS, ...PREMIUM_ITEMS, ...BLACK_MARKET_ITEMS };
      const itemData = allMaster[item.name];

      let chance = 0.5;
      if (itemData.demand === 'high') chance = 0.8;
      if (itemData.demand === 'low') chance = 0.3;

      chance += (gameState.reputation - 50) / 300;
      chance += customer.sensitivity;

      if (customer.type === 'premium' && itemData.type === 'premium') chance += 0.2;
      if (customer.type === 'cheap' && itemData.type === 'basic') chance += 0.15;

      const bought = Math.random() < chance;

      if (bought) {
        let price = Math.floor(itemData.sell * gameState.sellMod);
        if (gameState.upgrades.express_delivery) price = Math.floor(price * 1.25);

        earned += price;
        salesCount++;
        currentInventory.splice(itemIdx, 1);

        sessionLogs.push({ text: `${customer.icon} ${customer.name} bought ${item.name} for $${price}`, color: "text-green-400" });
      } else {
        sessionLogs.push({ text: `${customer.icon} ${customer.name} passed on ${item.name}`, color: "text-gray-500" });
      }

      setSalesProgress([...sessionLogs]);
    }

    setAnimatingSales(false);
    
    setLastEarnings(earned);
    earningsTimeoutRef.current = setTimeout(() => {
        setLastEarnings(null);
    }, 10000);

    if (salesCount > 0) {
      let repGain = 1;
      if (gameState.upgrades.loyalty_program) repGain += 1;
      if (salesCount > 5) repGain += 1;
      newReputation = Math.min(100, newReputation + repGain);
    } else {
      newReputation = Math.max(0, newReputation - 5);
    }

    setGameState(prev => {
        const newAchievements = { ...prev.achievements };

        if (prev.money + earned >= 1000 && !newAchievements.millionaire) {
            newAchievements.millionaire = true;
            addLog("🏆 ACHIEVEMENT: Thousandaire!", 'system', 'gold');
        }
        if (newReputation >= 75 && !newAchievements.popular) newAchievements.popular = true;
        if (newReputation >= 100 && !newAchievements.legendary) newAchievements.legendary = true;
        if (prev.totalItemsSold + salesCount >= 1 && !newAchievements.first_sale) newAchievements.first_sale = true;

        return {
            ...prev,
            money: prev.money + earned,
            inventory: currentInventory,
            reputation: newReputation,
            totalEarnings: prev.totalEarnings + earned,
            totalItemsSold: prev.totalItemsSold + salesCount,
            sessionsToday: prev.sessionsToday + 1,
            achievements: newAchievements
        };
    });

    addLog(`Session ended. Sold ${salesCount} items for ${formatMoney(earned)}.`, 'ops', 'success');
  };

  const nextDay = () => {
    if (!gameState) return;
    if (gameState.gameOver || gameState.gameWon) return;

    let {
        day, money, loanBalance, inventory, upgrades,
        baseRent, marketPrices, blackMarketHeat, timesRaided, achievements,
        difficulty, winGoal, interestRate
    } = gameState;

    // Rent processing
    let rent = baseRent;
    if (upgrades.efficient_lighting) rent = Math.floor(rent * 0.6);
    money -= rent;
    addLog(`Rent paid: -${formatMoney(rent)}`, 'finance', 'error');

    // Loan interest
    if (loanBalance > 0) {
        const rate = upgrades.vip_banking ? interestRate * 0.5 : interestRate;
        const interest = Math.floor(loanBalance * rate);
        loanBalance += interest;
        addLog(`Bank interest: +${formatMoney(interest)} to debt`, 'finance', 'warn');
    }

    // Spoilage
    if (!upgrades.refrigeration) {
        const oldLen = inventory.length;
        inventory = inventory.filter(i => i.expires > day + 1);
        const spoiled = oldLen - inventory.length;
        if (spoiled > 0) {
            addLog(`${spoiled} items lost to spoilage`, 'ops', 'warn');
        }
    }

    const allItems = { ...BASE_ITEMS, ...PREMIUM_ITEMS };
    const newPrices = { ...marketPrices };
    Object.keys(newPrices).forEach(key => {
        const base = Math.floor(allItems[key].buy * gameState.buyMod);
        if (newPrices[key] > base) newPrices[key] -= Math.floor(Math.random() * 2) + 1;
        else if (newPrices[key] < base) newPrices[key] += 1;
    });

    if (blackMarketHeat > 0) {
        blackMarketHeat = Math.max(0, blackMarketHeat - 1);
    }

    if (blackMarketHeat >= 4 && Math.random() < 0.4) {
        const illegalItems = inventory.filter(i => i.illegal);
        if (illegalItems.length > 0) {
            const fine = illegalItems.length * 50;
            money -= fine;
            inventory = inventory.filter(i => !i.illegal);
            gameState.reputation = Math.max(0, gameState.reputation - 15);
            timesRaided++;
            addLog(`🚨 POLICE RAID: -${formatMoney(fine)} fine!`, 'finance', 'error');
            setCurrentEvent({ type: 'raid', icon: '🚨', message: 'Police Raid!', color: 'bg-red-900/30 border-red-500' });
        } else {
            addLog(`🚨 Police raid survived!`, 'ops', 'success');
            if (!achievements.survive_raid) {
                achievements.survive_raid = true;
                addLog("🏆 ACHIEVEMENT: Slippery!", 'system', 'gold');
            }
            setCurrentEvent({ type: 'raid_safe', icon: '🔒', message: 'Raid Avoided!', color: 'bg-green-900/30 border-green-500' });
        }
        blackMarketHeat = 0;
    } else {
        const roll = Math.random();
        if (roll < 0.15) {
            const events = ['bonus', 'festival', 'crash', 'delivery_delay'];
            const ev = events[Math.floor(Math.random() * events.length)];

            if (ev === 'bonus') {
                const amt = Math.floor(Math.random() * 30) + 20;
                money += amt;
                addLog(`Found ${formatMoney(amt)} in a lucky spot!`, 'finance', 'success');
                setCurrentEvent({ type: 'bonus', icon: '🎁', message: `+${formatMoney(amt)} Lucky Find!`, color: 'bg-emerald-900/30 border-emerald-500' });
            } else if (ev === 'festival') {
                addLog(`Local festival is boosting customer traffic!`, 'ops', 'info');
                setCurrentEvent({ type: 'festival', icon: '🎪', message: 'Festival Today!', color: 'bg-purple-900/30 border-purple-500' });
            } else if (ev === 'crash') {
                Object.keys(newPrices).forEach(k => {
                    newPrices[k] = Math.floor(newPrices[k] * 0.7);
                });
                addLog(`📉 Market crash! Wholesale prices plummeted.`, 'ops', 'warn');
                setCurrentEvent({ type: 'crash', icon: '📉', message: 'Market Crash!', color: 'bg-blue-900/30 border-blue-500' });
            } else if (ev === 'delivery_delay') {
                addLog(`🚛 Supply chain delays: Expect lower stock availability.`, 'ops', 'warn');
                setCurrentEvent({ type: 'delay', icon: '🚛', message: 'Delivery Delays', color: 'bg-yellow-900/30 border-yellow-500' });
            }
        } else {
            setCurrentEvent(null);
        }
    }

    let gameOver = false;
    let gameWon = false;

    if (money < -25) {
        gameOver = true;
        addLog("💥 BANKRUPTCY! Game Over.", "system", "error");
    }

    const allUpgrades = Object.values(upgrades).every(Boolean);
    if (money >= winGoal && allUpgrades && !gameOver) {
        gameWon = true;
        if (day < 30 && !achievements.speed_demon) {
            achievements.speed_demon = true;
        }
    }

    if (inventory.length >= 50 && !achievements.hoarder) {
        achievements.hoarder = true;
        addLog("🏆 ACHIEVEMENT: Hoarder!", 'system', 'gold');
    }

    setGameState(prev => ({
        ...prev,
        day: day + 1,
        sessionsToday: 0,
        money,
        loanBalance,
        inventory,
        marketPrices: newPrices,
        blackMarketHeat,
        timesRaided,
        achievements,
        gameOver,
        gameWon
    }));
  };

  const renderInventory = () => {
    const counts = {};
    const spoilTimes = {};
    const isIllegal = {};

    gameState.inventory.forEach(i => {
      counts[i.name] = (counts[i.name] || 0) + 1;
      const daysLeft = i.expires - gameState.day;
      if (!spoilTimes[i.name] || daysLeft < spoilTimes[i.name]) {
        spoilTimes[i.name] = daysLeft;
      }
      if (i.illegal) isIllegal[i.name] = true;
    });

    const allDefinitions = { ...BASE_ITEMS, ...PREMIUM_ITEMS, ...BLACK_MARKET_ITEMS };

    return (
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 h-full flex flex-col">
        <h2 className="text-lg font-bold mb-3 flex items-center justify-between shrink-0 uppercase tracking-tighter">
            <span>Inventory ({gameState.inventory.length})</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">In Stock</span>
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {Object.keys(counts).length === 0 ? (
                <div className="text-slate-500 italic text-center py-10 text-sm">No items in inventory</div>
            ) : (
                Object.keys(counts).map(key => {
                    const days = spoilTimes[key];
                    let statusColor = "text-emerald-400";
                    if (days <= 2) statusColor = "text-red-400";
                    else if (days <= 5) statusColor = "text-yellow-400";

                    return (
                        <div key={key} className="flex items-center justify-between bg-slate-700/30 p-2 rounded border border-slate-700/50 hover:bg-slate-700 transition-colors">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{allDefinitions[key]?.icon || '📦'}</span>
                                <div>
                                    <div className={`text-xs font-bold ${isIllegal[key] ? 'text-red-300' : 'text-slate-200'}`}>
                                        {key.replace('_', ' ').toUpperCase()}
                                    </div>
                                    <div className={`text-[10px] ${statusColor} flex items-center gap-1 font-semibold`}>
                                        <Clock className="w-2.5 h-2.5"/> {days}d left
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm font-black text-slate-400">x{counts[key]}</div>
                        </div>
                    );
                })
            )}
        </div>
      </div>
    );
  };

  const renderMarket = (items, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Object.keys(items).map(key => {
        const item = items[key];
        const currentPrice = type === 'illegal' ? item.buy : gameState.marketPrices[key];
        const basePrice = Math.floor(item.buy * gameState.buyMod);

        let trend = 'neutral';
        if (currentPrice > basePrice * 1.1) trend = 'up';
        if (currentPrice < basePrice * 0.9) trend = 'down';

        return (
          <div key={key} className="bg-slate-700/50 p-4 rounded-xl flex justify-between items-center group hover:bg-slate-700 transition-all border border-slate-700/50 hover:border-slate-500">
            <div className="flex items-center gap-4">
                <div className="text-4xl transform group-hover:scale-110 transition-transform">{item.icon}</div>
                <div>
                    <h4 className="font-bold text-slate-200 capitalize text-sm">{key.replace('_', ' ')}</h4>
                    <div className="text-xs font-bold text-slate-400">
                        Sells for: <span className="text-emerald-400 font-black ml-1">${Math.floor(item.sell * gameState.sellMod)}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end gap-1 font-mono text-lg font-black text-emerald-400">
                    {formatMoney(currentPrice)}
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500"/>}
                    {trend === 'down' && <TrendingUp className="w-4 h-4 text-emerald-500 rotate-180"/>}
                </div>
                {type === 'illegal' && <div className="text-[10px] text-red-400 font-bold uppercase">Risk: {item.risk * 100}%</div>}
                <div className="flex gap-2 mt-2">
                    <button 
                        onClick={() => buyItem(key, type, 1)} 
                        className="px-4 py-1.5 bg-slate-800 rounded-lg hover:bg-emerald-600 text-xs font-black shadow-lg transition-colors border border-slate-700 hover:border-emerald-400 active:scale-90"
                    >
                        BUY 1
                    </button>
                    <button 
                        onClick={() => buyItem(key, type, 5)} 
                        className="px-4 py-1.5 bg-slate-800 rounded-lg hover:bg-emerald-600 text-xs font-black shadow-lg transition-colors border border-slate-700 hover:border-emerald-400 active:scale-90"
                    >
                        BUY 5
                    </button>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!gameState) {
    const difficulties = [
        {
            id: 'easy',
            label: '🟢 Easy Mode',
            details: [
              'Starting Cash: $200',
              'Starting Rep: 65%',
              'Daily Rent: $8',
              'Loan Interest: 10%',
              'Max Loan: $500',
              'Market Volatility: Low',
              'Win Goal: $800 + All Upgrades',
              'Customer Behavior: Friendly'
            ]
        },
        {
            id: 'normal',
            label: '🟡 Normal Mode',
            details: [
              'Starting Cash: $120',
              'Starting Rep: 50%',
              'Daily Rent: $18',
              'Loan Interest: 15%',
              'Max Loan: $500',
              'Market Volatility: Normal',
              'Win Goal: $1500 + All Upgrades',
              'Customer Behavior: Standard'
            ]
        },
        {
            id: 'hard',
            label: '🔴 Hard Mode',
            details: [
              'Starting Cash: $60',
              'Starting Rep: 25%',
              'Daily Rent: $35',
              'Loan Interest: 25%',
              'Max Loan: $150 (BRUTAL!)',
              'Market Volatility: Extreme',
              'Win Goal: $2500 + All Upgrades',
              'Customer Behavior: Picky',
              'Extra: Wealth Taxes!'
            ]
        }
    ];

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-2xl w-full bg-slate-900/80 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 backdrop-blur-xl relative z-10">
          <div className="mb-10 flex justify-center">
             <div className="p-6 bg-emerald-500/10 rounded-[2rem] shadow-inner relative group">
                <ShoppingBag className="w-24 h-24 text-emerald-500 relative z-10" />
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          </div>
          
          <div className="text-center mb-10">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-300 to-cyan-500 mb-4 tracking-tighter">STORE TYCOON</h1>
              <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-slate-800 flex-1" />
                  <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Ultimate Edition</p>
                  <div className="h-px bg-slate-800 flex-1" />
              </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {difficulties.map(d => (
                <div key={d.id} className="relative group">
                    <button
                        onClick={() => startGame(d.id)}
                        className="w-full py-6 bg-slate-800/50 hover:bg-emerald-600 rounded-2xl font-black text-white transition-all transform hover:scale-[1.02] active:scale-95 border border-slate-700/50 hover:border-emerald-400 shadow-xl flex items-center justify-center gap-3 group/btn"
                    >
                        <span className="text-xl group-hover/btn:scale-110 transition-transform">{d.label.split(' ')[0]}</span>
                        <span className="text-lg tracking-tighter uppercase">{d.label.split(' ')[1]} {d.label.split(' ')[2]}</span>
                    </button>
                    <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 w-72 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] hidden group-hover:block z-50 animate-in fade-in slide-in-from-left-4">
                        <h4 className="font-black text-emerald-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <Info className="w-4 h-4"/> Game Rules
                        </h4>
                        <ul className="text-[11px] text-slate-400 space-y-2.5 font-bold">
                            {d.details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-emerald-500 shrink-0 mt-1">▶</span>
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Select difficulty to begin your empire</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameOver || gameState.gameWon) {
      return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
              
              <div className="text-center bg-slate-900/90 p-12 rounded-[3rem] shadow-2xl border border-slate-800 max-w-lg w-full relative z-10 backdrop-blur-xl">
                  {gameState.gameWon ? (
                      <div className="relative inline-block mb-8">
                          <Award className="w-32 h-32 text-yellow-400 animate-bounce" />
                          <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
                      </div>
                  ) : (
                      <div className="relative inline-block mb-8">
                          <Skull className="w-32 h-32 text-red-600 animate-pulse" />
                          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full" />
                      </div>
                  )}
                  
                  <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">
                      {gameState.gameWon ? "Victory Achieved" : "Enterprise Failed"}
                  </h2>
                  <p className="text-slate-500 font-bold mb-10 uppercase tracking-widest text-xs">
                      {gameState.gameWon ? "You are the ultimate retail mogul" : "Your assets have been liquidated"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-left bg-slate-950/50 p-8 rounded-3xl mb-10 border border-slate-800">
                      <div className="text-xs font-black text-slate-500 uppercase">Days Survived: <span className="font-mono text-emerald-400 text-lg block">{gameState.day}</span></div>
                      <div className="text-xs font-black text-slate-500 uppercase">Final Assets: <span className="font-mono text-emerald-400 text-lg block">{formatMoney(gameState.money)}</span></div>
                      <div className="text-xs font-black text-slate-500 uppercase">Total Volume: <span className="font-mono text-emerald-400 text-lg block">{formatMoney(gameState.totalEarnings)}</span></div>
                      <div className="text-xs font-black text-slate-500 uppercase">Brand Rep: <span className="font-mono text-emerald-400 text-lg block">{gameState.reputation}%</span></div>
                  </div>

                  <button 
                    onClick={() => setGameState(null)} 
                    className="px-12 py-5 bg-indigo-600 rounded-2xl font-black hover:bg-indigo-500 w-full shadow-2xl transition-all active:scale-95 uppercase tracking-widest"
                  >
                      Return to Command Center
                  </button>
              </div>
          </div>
      )
  }

  const repData = getReputationTier(gameState.reputation);
  const maxLoan = gameState.difficulty === 'hard' ? 150 : 500;
  const actualMaxLoan = maxLoan + (gameState.upgrades.vip_banking ? 500 : 0);
  const allUpgradesOwned = Object.values(gameState.upgrades).every(Boolean);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 md:p-6 overflow-hidden flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 mb-4 gap-4 shrink-0">
        <div className="flex items-center gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Store Tycoon</h1>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-xs uppercase font-black">{gameState.difficulty}</span>
                    <span className="font-bold">Day {gameState.day}</span>
                    <span className={`${repData.color} font-black`}>• {repData.name} ({gameState.reputation}%)</span>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-8 w-full md:w-auto items-center">
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700 flex-1 md:flex-none relative h-14 flex flex-col justify-center">
                <div className="text-xs text-slate-500 uppercase font-black">Cash</div>
                <div className="flex items-center gap-2">
                    <div className="text-2xl font-mono font-black text-emerald-400">{formatMoney(gameState.money)}</div>
                    {lastEarnings !== null && (
                        <div key={`earn-${Date.now()}`} className="text-sm font-black text-green-400 animate-in fade-in slide-in-from-bottom duration-300 absolute -right-2 -top-2 bg-slate-800 border border-green-500/50 rounded px-1.5 z-20 shadow-lg">
                            +{formatMoney(lastEarnings)}
                        </div>
                    )}
                    {lastSpending !== null && (
                        <div key={`spend-${Date.now()}`} className="text-sm font-black text-red-500 animate-in fade-in slide-in-from-top duration-300 absolute -right-2 -top-2 bg-slate-800 border border-red-500/50 rounded px-1.5 z-20 shadow-lg">
                            -{formatMoney(lastSpending)}
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700 flex-1 md:flex-none h-14 flex flex-col justify-center">
                <div className="text-xs text-slate-500 uppercase font-black">Goal</div>
                <div className="text-2xl font-mono font-black text-slate-300">
                    {formatMoney(gameState.winGoal)}
                    <span className={`text-[10px] ml-1 block leading-none font-black ${allUpgradesOwned ? 'text-green-400' : 'text-slate-500'}`}>
                        {allUpgradesOwned ? 'FULLY UPGRADED' : 'UPGRADES REQ.'}
                    </span>
                </div>
            </div>
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700 flex-1 md:flex-none group relative cursor-help h-14 flex flex-col justify-center">
                 <div className="text-xs text-slate-500 uppercase font-black flex items-center gap-1">
                    Debt <Info className="w-3 h-3"/>
                 </div>
                 <div className="text-2xl font-mono font-black text-red-400">{formatMoney(gameState.loanBalance)}</div>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded shadow-xl text-[10px] text-slate-300 hidden group-hover:block z-50">
                    Warning: Bankruptcy if cash drops below -$25. Interest added daily.
                 </div>
            </div>
            
            <button
                onClick={() => setActiveTab('achievements')}
                className={`p-3 rounded-xl border transition-all ${activeTab === 'achievements' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-lg shadow-yellow-900/20' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:text-yellow-400 hover:border-yellow-400'}`}
                title="Achievements"
            >
                <Award className="w-6 h-6" />
            </button>

            <button
                onClick={nextDay}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 h-12 rounded-xl font-black transition-all shadow-lg shadow-indigo-900/20 ml-auto uppercase tracking-widest text-sm"
            >
                End Day <ChevronRight className="w-5 h-5"/>
            </button>
        </div>
      </header>

      {currentEvent && (
          <div className={`${currentEvent.color} border p-4 rounded-xl mb-4 flex items-center gap-4 animate-in slide-in-from-top duration-500 shadow-xl shrink-0`}>
              <div className="text-4xl">{currentEvent.icon}</div>
              <div className="flex-1">
                  <div className="font-black flex items-center gap-2 text-lg uppercase tracking-tight">
                      <Sparkles className="w-5 h-5"/> {currentEvent.message}
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide opacity-70">
                      {currentEvent.type === 'crash' && 'All wholesale prices are 30% lower today!'}
                      {currentEvent.type === 'festival' && 'Expect more customers than usual!'}
                      {currentEvent.type === 'raid' && 'Illegal items were confiscated.'}
                      {currentEvent.type === 'raid_safe' && 'Your security held up!'}
                      {currentEvent.type === 'bonus' && 'Lucky day!'}
                      {currentEvent.type === 'delay' && 'Supply chains disrupted temporarily.'}
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        <div className="flex flex-col lg:w-3/4 gap-6 overflow-hidden h-full">
            <div className="bg-slate-800 rounded-xl p-1 shadow-lg border border-slate-700 flex flex-wrap gap-1 shrink-0">
                {[
                    { id: 'market', label: 'Wholesale', icon: <Package className="w-4 h-4"/> },
                    { id: 'store', label: 'My Store', icon: <ShoppingBag className="w-4 h-4"/> },
                    { id: 'upgrades', label: 'Upgrades', icon: <TrendingUp className="w-4 h-4"/> },
                    { id: 'bank', label: 'Bank', icon: <DollarSign className="w-4 h-4"/> },
                    { id: 'blackmarket', label: 'Black Market', icon: <Skull className="w-4 h-4"/> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600' 
                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                        }`}
                    >
                        {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 flex-1 overflow-y-auto relative custom-scrollbar">
                {activeTab === 'market' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-indigo-300 uppercase tracking-tighter">
                                <Package className="w-6 h-6"/> Global Market Access
                            </h2>
                            {renderMarket(BASE_ITEMS, 'basic')}
                        </div>
                        {gameState.upgrades.premium_items && (
                            <div>
                                <h2 className="text-xl font-black mb-6 mt-12 flex items-center gap-2 text-purple-300 uppercase tracking-tighter">
                                    <Award className="w-6 h-6"/> Luxury Goods Tier
                                </h2>
                                {renderMarket(PREMIUM_ITEMS, 'premium')}
                            </div>
                        )}
                        {!gameState.upgrades.premium_items && (
                            <div className="mt-12 p-10 border-2 border-dashed border-slate-700 rounded-[2rem] text-center">
                                <Lock className="w-12 h-12 text-slate-700 mx-auto mb-4"/>
                                <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-[11px]">Premium Trade Locked</p>
                                <p className="text-slate-700 text-[10px] mt-2 font-bold italic">Acquire 'Luxury License' to unlock</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'store' && (
                    <div className="flex flex-col h-full min-h-[500px]">
                        <div className="text-center mb-8 shrink-0">
                            <h2 className="text-3xl font-black mb-2 text-emerald-400 uppercase tracking-tighter">STOREFRONT OPS</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sessions Available: <span className="text-white bg-slate-700 px-3 py-1 rounded-full ml-2">{2 - gameState.sessionsToday} / 2</span></p>
                        </div>

                        <div className="flex-1 bg-slate-900/80 rounded-[2.5rem] p-6 border border-slate-700/50 relative overflow-hidden shadow-inner flex flex-col min-h-0">
                            {animatingSales ? (
                                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                                    {salesProgress.map((log, idx) => (
                                        <div key={idx} className={`animate-in fade-in slide-in-from-bottom-4 duration-300 font-mono text-[11px] ${log.color} bg-slate-800/80 p-3 rounded-2xl shadow-lg border border-slate-700/30 flex items-center gap-3`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                                            <span className="font-bold">{log.text}</span>
                                        </div>
                                    ))}
                                    <div ref={salesEndRef} />
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-700">
                                    <div className="relative mb-8">
                                        <Users className="w-24 h-24 opacity-10"/>
                                        <div className="absolute inset-0 bg-slate-400/5 blur-3xl rounded-full" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-[0.4em] opacity-30 italic">Closed for Business</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center shrink-0 pb-4">
                            <button
                                onClick={startSalesSession}
                                disabled={animatingSales || gameState.sessionsToday >= 2 || gameState.inventory.length === 0}
                                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xl font-black py-5 px-24 rounded-[2rem] shadow-[0_15px_35px_rgba(5,150,105,0.3)] transition-all flex items-center gap-4 justify-center transform active:scale-95 uppercase tracking-widest"
                            >
                                {animatingSales ? <RefreshCw className="w-6 h-6 animate-spin"/> : <Briefcase className="w-6 h-6"/>}
                                {animatingSales ? 'PROCESSING OPS...' : 'OPEN STOREFRONT'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'upgrades' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Object.entries(UPGRADES_LIST).map(([key, data]) => {
                            const owned = gameState.upgrades[key];
                            const cost = Math.floor(data.cost * gameState.upgradeMod);
                            const affordable = gameState.money >= cost;

                            return (
                                <div key={key} className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all shadow-xl relative overflow-hidden ${owned ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-slate-800 border-slate-700 hover:border-slate-500 group'}`}>
                                    {owned && (
                                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-[1.5rem] uppercase tracking-widest">ACTIVE</div>
                                    )}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className={`p-4 rounded-2xl border-2 shadow-lg group-hover:scale-110 transition-transform ${data.color}`}>
                                            {data.icon}
                                        </div>
                                    </div>
                                    <div className="mb-6 flex-1">
                                        <h4 className="font-black text-slate-200 text-sm uppercase tracking-tight">{data.name}</h4>
                                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-bold">{data.desc}</p>
                                    </div>

                                    {owned ? (
                                        <div className="mt-auto w-full py-3 bg-indigo-500/10 text-indigo-300 rounded-2xl text-center font-black text-[11px] border border-indigo-500/20 uppercase tracking-widest">
                                            Operational
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => buyUpgrade(key)}
                                            className={`mt-auto w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                                                affordable 
                                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_10px_20px_rgba(5,150,105,0.2)] active:scale-95' 
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
                                            }`}
                                        >
                                            <DollarSign className="w-3.5 h-3.5"/> {cost}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'bank' && (
                    <div className="flex flex-col lg:flex-row gap-10 items-start h-full">
                        <div className="bg-slate-900 p-8 rounded-[3rem] border-[8px] border-slate-750 w-full max-w-[320px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] shrink-0 order-2 lg:order-1 relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 px-6 py-2 rounded-full border-4 border-slate-900 font-black text-[10px] uppercase tracking-[0.3em] text-cyan-500 shadow-xl">SECURE ATM</div>
                            
                            <div className="bg-cyan-950/40 border-4 border-cyan-800/30 rounded-3xl p-5 mb-6 shadow-inner relative overflow-hidden">
                                <div className="text-right">
                                    <div className="text-cyan-400 font-mono text-3xl font-black tracking-[0.2em] min-h-[36px]">
                                        {bankInput || '0'}
                                    </div>
                                    <div className="text-cyan-900 text-[10px] font-black uppercase mt-2 tracking-widest">Transaction Amount</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {['1','2','3','4','5','6','7','8','9','C','0','back'].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => handleKeypad(n)}
                                        className={`py-5 rounded-2xl text-xl font-black transition-all active:scale-90 shadow-md ${
                                            n === 'C' ? 'bg-red-900/40 text-red-500 hover:bg-red-900/60' :
                                            n === 'back' ? 'bg-slate-800 text-slate-500 hover:bg-slate-700' :
                                            'bg-slate-800 text-cyan-200 hover:bg-slate-750 border border-slate-750'
                                        }`}
                                    >
                                        {n === 'back' ? <Delete className="w-6 h-6 mx-auto"/> : n}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleBankAction('borrow')} className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest active:scale-95">BORROW</button>
                                <button onClick={() => handleBankAction('repay')} className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest active:scale-95">REPAY</button>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-6 order-1 lg:order-2">
                            <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm">
                                <h3 className="text-sm font-black mb-6 flex items-center gap-3 text-cyan-500 uppercase tracking-widest">
                                    <CreditCard className="w-5 h-5"/> Financial Dashboard
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 group">
                                        <div className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Active Debt</div>
                                        <div className="text-3xl font-mono font-black text-red-500 group-hover:scale-105 transition-transform">{formatMoney(gameState.loanBalance)}</div>
                                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-red-950/30 rounded-full text-[9px] text-red-400 font-black italic border border-red-900/20">
                                            APR: {((gameState.upgrades.vip_banking ? gameState.interestRate * 0.5 : gameState.interestRate) * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 group">
                                        <div className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Credit Capacity</div>
                                        <div className="text-3xl font-mono font-black text-emerald-500 group-hover:scale-105 transition-transform">{formatMoney(actualMaxLoan)}</div>
                                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-emerald-950/30 rounded-full text-[9px] text-emerald-400 font-black italic border border-emerald-900/20">
                                            {formatMoney(actualMaxLoan - gameState.loanBalance)} avail.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-red-950/5 border-2 border-red-900/10 rounded-[2rem] p-8">
                                <h3 className="text-xs font-black mb-4 flex items-center gap-2 text-red-600 uppercase tracking-widest italic">
                                    <AlertTriangle className="w-4 h-4"/> Fiscal Warnings
                                </h3>
                                <div className="text-[11px] text-slate-500 space-y-4 font-bold leading-relaxed uppercase">
                                    <div className="flex gap-4 p-4 bg-slate-900/40 rounded-2xl border border-red-900/10">
                                        <ShieldAlert className="w-8 h-8 text-red-900 shrink-0"/>
                                        <p>Contraband possession triggers tactical police intervention. Expect heavy fines and inventory loss.</p>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-slate-900/40 rounded-2xl border border-red-900/10">
                                        <AlertCircle className="w-8 h-8 text-red-900 shrink-0"/>
                                        <p>Net Liquidity failure at <span className="text-red-500 font-black">-$25</span> results in permanent asset seizure.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'blackmarket' && (
                    <div className="h-full flex flex-col">
                        {gameState.day < 10 || gameState.reputation < 35 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-950/50 rounded-[3rem] border-4 border-red-900/10">
                                <div className="relative mb-10">
                                    <Lock className="w-24 h-24 text-red-950 animate-pulse"/>
                                    <div className="absolute inset-0 bg-red-900/10 blur-3xl rounded-full" />
                                </div>
                                <h3 className="text-4xl font-black text-red-900 mb-4 tracking-tighter uppercase italic">RESTRICTED OPS</h3>
                                <p className="text-slate-700 text-xs max-w-sm uppercase font-black tracking-[0.3em] opacity-50 mb-10">
                                    Authorized Merchants Only
                                </p>
                                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                    <div className={`p-6 rounded-3xl border-2 transition-all ${gameState.reputation >= 35 ? 'bg-green-950/10 border-green-900/30' : 'bg-red-950/10 border-red-900/10'}`}>
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-2">REPUTATION</div>
                                        <div className={`text-xl font-mono font-black ${gameState.reputation >= 35 ? 'text-green-500' : 'text-red-900'}`}>{gameState.reputation}% / 35%</div>
                                    </div>
                                    <div className={`p-6 rounded-3xl border-2 transition-all ${gameState.day >= 10 ? 'bg-green-950/10 border-green-900/30' : 'bg-red-950/10 border-red-900/10'}`}>
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-2">OPERATIONAL DAY</div>
                                        <div className={`text-xl font-mono font-black ${gameState.day >= 10 ? 'text-green-500' : 'text-red-900'}`}>{gameState.day} / 10</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-950/80 p-8 rounded-[3rem] border border-red-900/40 relative overflow-hidden flex-1 shadow-2xl backdrop-blur-xl">
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                    <Skull className="w-64 h-64 text-red-600"/>
                                </div>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-red-600 flex items-center gap-3 uppercase tracking-tighter italic">
                                            <Skull className="w-8 h-8"/> UNDERGROUND TRADE
                                        </h2>
                                        <p className="text-red-900/50 text-xs font-mono font-black tracking-widest mt-1">SECURE ENCRYPTED CHANNEL // ACCESS GRANTED</p>
                                    </div>
                                </div>

                                <div className="mb-10 flex items-center gap-8 bg-red-950/20 p-6 rounded-3xl border border-red-900/30 backdrop-blur-sm">
                                    <div className="text-red-500 font-black text-[11px] uppercase tracking-[0.2em] shrink-0">HEAT LEVEL:</div>
                                    <div className="flex gap-2 flex-1">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className={`h-2 flex-1 rounded-full shadow-inner transition-all duration-700 ${i <= gameState.blackMarketHeat ? 'bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-slate-900'}`} />
                                        ))}
                                    </div>
                                    <div className="text-[11px] text-red-600 font-black uppercase tracking-widest shrink-0">
                                        RAID RISK: {gameState.blackMarketHeat * 20}%
                                    </div>
                                </div>

                                {renderMarket(BLACK_MARKET_ITEMS, 'illegal')}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Object.entries(ACHIEVEMENTS_LIST).map(([key, data]) => {
                            const unlocked = gameState.achievements[key];
                            return (
                                <div key={key} className={`p-6 rounded-[2rem] border-2 transition-all group ${unlocked ? 'bg-indigo-900/20 border-indigo-500/30 shadow-2xl' : 'bg-slate-800/50 border-slate-700 opacity-20 grayscale'}`}>
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl transition-transform group-hover:rotate-12 ${unlocked ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 shadow-xl' : 'bg-slate-700 text-slate-500'}`}>
                                            <Award className="w-8 h-8"/>
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-sm uppercase tracking-widest ${unlocked ? 'text-yellow-400' : 'text-slate-500'}`}>{data.name}</h4>
                                            <p className="text-[11px] text-slate-600 font-black mt-1 leading-tight">{data.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        {/* SIDEBAR - Fixed height for stability */}
        <div className="lg:w-1/4 flex flex-col gap-6 overflow-hidden h-[calc(100vh-140px)]">
            <div className="flex-[3] flex flex-col overflow-hidden min-h-0">
                {renderInventory()}
            </div>
            
            <div className="flex-[4] flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden min-h-0">
                <div className="p-4 border-b border-slate-700 bg-slate-800/80 shrink-0 flex items-center justify-between">
                    <h3 className="text-[10px] font-black flex items-center gap-2 text-slate-500 uppercase tracking-[0.2em]">
                        <ClipboardList className="w-3.5 h-3.5"/> Operational Log
                    </h3>
                </div>
                
                {/* CATEGORIZED LOGS */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/40 custom-scrollbar static">
                    {[
                        { id: 'finance', label: 'Finances', icon: <Receipt className="w-3 h-3"/>, color: 'text-emerald-400' },
                        { id: 'ops', label: 'Operations', icon: <Activity className="w-3 h-3"/>, color: 'text-blue-400' },
                        { id: 'system', label: 'System', icon: <ZapOff className="w-3 h-3"/>, color: 'text-slate-400' }
                    ].map(cat => {
                        const catLogs = logs.filter(l => l.category === cat.id).slice(-10).reverse();
                        if (catLogs.length === 0 && cat.id !== 'system') return null;
                        
                        return (
                            <div key={cat.id} className="space-y-2">
                                <div className="flex items-center gap-2 px-1">
                                    <span className={`${cat.color}`}>{cat.icon}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${cat.color}`}>{cat.label}</span>
                                    <div className="h-px bg-slate-700 flex-1 ml-1 opacity-50" />
                                </div>
                                <div className="space-y-1.5">
                                    {catLogs.length === 0 ? (
                                        <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest py-2 px-3 italic">No recent activity</div>
                                    ) : (
                                        catLogs.map(log => (
                                            <div key={log.id} className={`text-[9px] p-2.5 rounded-lg border-l-2 leading-tight font-bold animate-in fade-in slide-in-from-right-4 duration-300 ${
                                                log.type === 'error' ? 'bg-red-950/20 border-red-600 text-red-200' :
                                                log.type === 'success' ? 'bg-emerald-950/20 border-emerald-600 text-emerald-100' :
                                                log.type === 'warn' ? 'bg-yellow-950/20 border-yellow-600 text-yellow-100' :
                                                log.type === 'gold' ? 'bg-indigo-900/30 border-yellow-400 text-white font-black italic' :
                                                'bg-slate-800/40 border-slate-600 text-slate-400'
                                            }`}>
                                                <div className="flex justify-between items-center gap-2">
                                                    <span>{log.msg}</span>
                                                    <span className="opacity-20 text-[7px] font-mono shrink-0">{new Date(log.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={activityEndRef} />
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
