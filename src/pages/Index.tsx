import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface LootCase {
  id: number;
  name: string;
  price: number;
  image: string;
  items: Item[];
}

interface Item {
  id: number;
  name: string;
  rarity: Rarity;
  value: number;
  image: string;
}

interface HistoryItem {
  id: number;
  caseName: string;
  item: Item;
  timestamp: Date;
}

const rarityConfig: Record<Rarity, { label: string; color: string; glow: string; bg: string }> = {
  common: { 
    label: 'Common', 
    color: 'text-gray-400',
    glow: 'shadow-gray-500/50',
    bg: 'bg-gradient-to-br from-gray-600 to-gray-500'
  },
  rare: { 
    label: 'Rare', 
    color: 'text-blue-400',
    glow: 'shadow-blue-500/50',
    bg: 'bg-gradient-to-br from-blue-600 to-blue-400'
  },
  epic: { 
    label: 'Epic', 
    color: 'text-purple-400',
    glow: 'shadow-purple-500/50',
    bg: 'bg-gradient-to-br from-purple-600 to-pink-500'
  },
  legendary: { 
    label: 'Legendary', 
    color: 'text-yellow-400',
    glow: 'shadow-yellow-500/50',
    bg: 'bg-gradient-to-br from-yellow-500 to-orange-500'
  }
};

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const cases: LootCase[] = [
    {
      id: 1,
      name: 'Starter Box',
      price: 50,
      image: '/img/d31465db-15de-4dae-97e3-0c730da8acfb.jpg',
      items: [
        { id: 1, name: 'Bronze Coin', rarity: 'common', value: 10, image: '🪙' },
        { id: 2, name: 'Silver Ring', rarity: 'rare', value: 75, image: '💍' },
        { id: 3, name: 'Sapphire Gem', rarity: 'epic', value: 150, image: '💎' },
      ]
    },
    {
      id: 2,
      name: 'Premium Chest',
      price: 150,
      image: '/img/558d9db0-43f6-434a-8de8-2b01ac306f5c.jpg',
      items: [
        { id: 4, name: 'Gold Bar', rarity: 'rare', value: 200, image: '🥇' },
        { id: 5, name: 'Ruby Crystal', rarity: 'epic', value: 350, image: '🔴' },
        { id: 6, name: 'Dragon Scale', rarity: 'legendary', value: 800, image: '🐉' },
      ]
    },
    {
      id: 3,
      name: 'Legendary Vault',
      price: 300,
      image: '/img/2ce248dc-38da-4e63-97ed-613935da477e.jpg',
      items: [
        { id: 7, name: 'Diamond Shard', rarity: 'epic', value: 450, image: '💠' },
        { id: 8, name: 'Phoenix Feather', rarity: 'legendary', value: 1200, image: '🔥' },
        { id: 9, name: 'Crown of Kings', rarity: 'legendary', value: 2000, image: '👑' },
      ]
    },
    {
      id: 4,
      name: 'Mystery Box',
      price: 100,
      image: '/img/d31465db-15de-4dae-97e3-0c730da8acfb.jpg',
      items: [
        { id: 10, name: 'Magic Scroll', rarity: 'common', value: 25, image: '📜' },
        { id: 11, name: 'Crystal Ball', rarity: 'epic', value: 280, image: '🔮' },
        { id: 12, name: 'Ancient Relic', rarity: 'legendary', value: 950, image: '⚱️' },
      ]
    },
    {
      id: 5,
      name: 'Elite Case',
      price: 200,
      image: '/img/558d9db0-43f6-434a-8de8-2b01ac306f5c.jpg',
      items: [
        { id: 13, name: 'Platinum Coin', rarity: 'rare', value: 180, image: '⚪' },
        { id: 14, name: 'Emerald Gem', rarity: 'epic', value: 400, image: '🟢' },
        { id: 15, name: 'Excalibur Sword', rarity: 'legendary', value: 1500, image: '⚔️' },
      ]
    },
    {
      id: 6,
      name: 'Royal Treasury',
      price: 500,
      image: '/img/2ce248dc-38da-4e63-97ed-613935da477e.jpg',
      items: [
        { id: 16, name: 'Royal Jewel', rarity: 'epic', value: 600, image: '💍' },
        { id: 17, name: 'Golden Crown', rarity: 'legendary', value: 1800, image: '👑' },
        { id: 18, name: 'Infinity Stone', rarity: 'legendary', value: 3500, image: '🌟' },
      ]
    }
  ];

  const openCase = (selectedCase: LootCase) => {
    if (balance < selectedCase.price) {
      alert('💰 Недостаточно средств! Пополни баланс.');
      return;
    }

    setBalance(balance - selectedCase.price);
    setIsOpening(true);

    const random = Math.random();
    let selectedItem: Item;

    if (random < 0.5) {
      const commonItems = selectedCase.items.filter(i => i.rarity === 'common' || i.rarity === 'rare');
      selectedItem = commonItems[Math.floor(Math.random() * commonItems.length)] || selectedCase.items[0];
    } else if (random < 0.85) {
      const epicItems = selectedCase.items.filter(i => i.rarity === 'epic');
      selectedItem = epicItems[Math.floor(Math.random() * epicItems.length)] || selectedCase.items[1];
    } else {
      const legendaryItems = selectedCase.items.filter(i => i.rarity === 'legendary');
      selectedItem = legendaryItems[Math.floor(Math.random() * legendaryItems.length)] || selectedCase.items[2];
    }

    setTimeout(() => {
      setIsOpening(false);
      setOpenedItem(selectedItem);
      setInventory([...inventory, selectedItem]);
      setHistory([
        { id: Date.now(), caseName: selectedCase.name, item: selectedItem, timestamp: new Date() },
        ...history
      ]);
    }, 2000);
  };

  const sellItem = (item: Item) => {
    setBalance(balance + item.value);
    setInventory(inventory.filter(i => i.id !== item.id));
    setOpenedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <header className="glass-effect sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-primary/50">
                  🎁
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  LOOTBOX PRO
                </h1>
                <p className="text-xs text-muted-foreground">Premium Cases & Rewards</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="glass-effect px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                <Icon name="Wallet" size={20} className="text-accent" />
                <span className="font-bold text-lg bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
                  ${balance.toFixed(2)}
                </span>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30 gap-2">
                <Icon name="Plus" size={18} />
                <span className="hidden md:inline">Пополнить</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Открой Легендарные Кейсы
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Испытай удачу и получи редчайшие предметы. Каждый кейс содержит уникальные награды!
          </p>
        </div>

        <Tabs defaultValue="cases" className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 glass-effect">
            <TabsTrigger value="cases" className="gap-2">
              <Icon name="Package" size={16} />
              Кейсы
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Icon name="Backpack" size={16} />
              Инвентарь ({inventory.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="History" size={16} />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 cursor-pointer bg-card/50 backdrop-blur-sm"
                  onClick={() => !isOpening && openCase(caseItem)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative p-6">
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <img 
                        src={caseItem.image} 
                        alt={caseItem.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </div>
                    
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {caseItem.name}
                      </h3>
                      <div className="flex justify-center gap-1 flex-wrap">
                        {[...new Set(caseItem.items.map(i => i.rarity))].map(rarity => (
                          <Badge 
                            key={rarity} 
                            className={`${rarityConfig[rarity].bg} text-white text-xs`}
                          >
                            {rarityConfig[rarity].label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Icon name="DollarSign" size={20} className="text-accent" />
                        <span className="text-2xl font-bold text-accent">{caseItem.price}</span>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/50 transition-all duration-300"
                        disabled={isOpening || balance < caseItem.price}
                      >
                        {balance < caseItem.price ? 'Недостаточно' : 'Открыть'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            {inventory.length === 0 ? (
              <div className="text-center py-16 glass-effect rounded-xl">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-2">Инвентарь пуст</h3>
                <p className="text-muted-foreground">Открой кейсы, чтобы получить предметы</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {inventory.map((item, index) => (
                  <Card 
                    key={`${item.id}-${index}`}
                    className={`p-4 text-center border-2 ${rarityConfig[item.rarity].bg.replace('bg-', 'border-')} bg-card/50 backdrop-blur-sm hover:scale-105 transition-transform`}
                  >
                    <div className="text-4xl mb-2">{item.image}</div>
                    <Badge className={`mb-2 ${rarityConfig[item.rarity].bg} text-white text-xs`}>
                      {rarityConfig[item.rarity].label}
                    </Badge>
                    <h4 className="font-bold mb-1 text-sm">{item.name}</h4>
                    <p className="text-accent font-bold mb-3">${item.value}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => sellItem(item)}
                    >
                      Продать
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {history.length === 0 ? (
              <div className="text-center py-16 glass-effect rounded-xl">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-2xl font-bold mb-2">История пуста</h3>
                <p className="text-muted-foreground">Открой первый кейс!</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-2xl mx-auto">
                {history.slice(0, 10).map((record) => (
                  <Card key={record.id} className="p-4 flex items-center justify-between glass-effect">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{record.item.image}</div>
                      <div>
                        <h4 className="font-bold">{record.item.name}</h4>
                        <p className="text-sm text-muted-foreground">{record.caseName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${rarityConfig[record.item.rarity].bg} text-white mb-1`}>
                        {rarityConfig[record.item.rarity].label}
                      </Badge>
                      <p className="text-accent font-bold">${record.item.value}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isOpening && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">🎁</div>
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                Открываем кейс...
              </h3>
              <div className="flex gap-2 justify-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        )}

        {openedItem && !isOpening && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <Card className={`max-w-md w-full p-8 border-4 relative overflow-hidden shadow-2xl ${rarityConfig[openedItem.rarity].glow} animate-scale-in`}>
              <div className={`absolute inset-0 ${rarityConfig[openedItem.rarity].bg} opacity-10 animate-pulse`} />
              
              <div className="relative text-center">
                <Badge className={`mb-4 ${rarityConfig[openedItem.rarity].bg} text-white px-4 py-2 text-lg animate-bounce`}>
                  {rarityConfig[openedItem.rarity].label}
                </Badge>
                
                <div className="text-8xl mb-4">{openedItem.image}</div>
                <h3 className="text-3xl font-bold mb-3">{openedItem.name}</h3>
                <p className="text-5xl font-bold text-accent mb-8 animate-pulse">${openedItem.value}</p>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-lg py-6"
                    onClick={() => setOpenedItem(null)}
                  >
                    Продолжить
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-lg py-6 border-2"
                    onClick={() => sellItem(openedItem)}
                  >
                    Продать
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎯', title: 'Честная игра', desc: 'Проверенные шансы' },
            { icon: '⚡', title: 'Мгновенно', desc: 'Быстрые выплаты' },
            { icon: '🔒', title: 'Безопасно', desc: 'Защита данных' },
            { icon: '🎁', title: 'Бонусы', desc: 'Ежедневные подарки' }
          ].map((feature, i) => (
            <div key={i} className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">{feature.icon}</div>
              <h4 className="font-bold mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-20 glass-effect border-t border-border/40 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center text-xl shadow-lg">
                🎁
              </div>
              <div>
                <span className="font-bold text-lg">LOOTBOX PRO</span>
                <p className="text-xs text-muted-foreground">© 2024 All rights reserved</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">О нас</a>
              <a href="#" className="hover:text-primary transition-colors">Правила</a>
              <a href="#" className="hover:text-primary transition-colors">FAQ</a>
              <a href="#" className="hover:text-primary transition-colors">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
