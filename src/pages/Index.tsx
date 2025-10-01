import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface LootCase {
  id: number;
  name: string;
  price: number;
  image: string;
  gradient: string;
}

interface Item {
  id: number;
  name: string;
  rarity: Rarity;
  value: number;
}

const rarityConfig = {
  common: { label: 'Common', color: 'bg-rarity-common', gradient: 'from-gray-500 to-gray-400' },
  rare: { label: 'Rare', color: 'bg-rarity-rare', gradient: 'from-yellow-500 to-yellow-400' },
  epic: { label: 'Epic', color: 'bg-rarity-epic', gradient: 'from-purple-500 to-purple-400' },
  legendary: { label: 'Legendary', color: 'bg-rarity-legendary', gradient: 'from-orange-500 to-yellow-400' }
};

const Index = () => {
  const [balance, setBalance] = useState(500);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);

  const cases: LootCase[] = [
    {
      id: 1,
      name: 'Starter Case',
      price: 30,
      image: '🎁',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      id: 2,
      name: 'Gold Case',
      price: 100,
      image: '💎',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      name: 'Legendary Case',
      price: 250,
      image: '👑',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      name: 'Mystery Box',
      price: 50,
      image: '🎲',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      id: 5,
      name: 'Premium Case',
      price: 150,
      image: '⭐',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 6,
      name: 'Epic Case',
      price: 200,
      image: '🔥',
      gradient: 'from-red-500 to-purple-600'
    }
  ];

  const possibleItems: Item[] = [
    { id: 1, name: 'Bronze Coin', rarity: 'common', value: 5 },
    { id: 2, name: 'Silver Coin', rarity: 'common', value: 10 },
    { id: 3, name: 'Gold Coin', rarity: 'rare', value: 50 },
    { id: 4, name: 'Diamond Ring', rarity: 'epic', value: 150 },
    { id: 5, name: 'Crown Jewel', rarity: 'legendary', value: 500 },
    { id: 6, name: 'Magic Crystal', rarity: 'epic', value: 120 },
    { id: 7, name: 'Ancient Artifact', rarity: 'legendary', value: 450 }
  ];

  const openCase = (caseItem: LootCase) => {
    if (balance < caseItem.price) {
      alert('Недостаточно средств!');
      return;
    }

    setBalance(balance - caseItem.price);

    const random = Math.random();
    let selectedItem: Item;

    if (random < 0.5) {
      selectedItem = possibleItems.filter(i => i.rarity === 'common')[Math.floor(Math.random() * 2)];
    } else if (random < 0.8) {
      selectedItem = possibleItems.filter(i => i.rarity === 'rare')[0];
    } else if (random < 0.95) {
      selectedItem = possibleItems.filter(i => i.rarity === 'epic')[Math.floor(Math.random() * 2)];
    } else {
      selectedItem = possibleItems.filter(i => i.rarity === 'legendary')[Math.floor(Math.random() * 2)];
    }

    setTimeout(() => {
      setOpenedItem(selectedItem);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-2xl">
                🎁
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LOOTBOX CASES
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <Icon name="Wallet" size={20} className="text-accent" />
                <span className="font-semibold text-lg">${balance.toFixed(2)}</span>
              </div>
              <Button variant="outline" className="gap-2">
                <Icon name="Plus" size={18} />
                Пополнить
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Открой свой кейс</h2>
          <p className="text-muted-foreground text-lg">Выбери кейс и испытай удачу!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 cursor-pointer bg-card"
              onClick={() => openCase(caseItem)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${caseItem.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative p-6">
                <div className="text-center mb-4">
                  <div className="text-8xl mb-4 animate-float">{caseItem.image}</div>
                  <h3 className="text-2xl font-bold mb-2">{caseItem.name}</h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Icon name="DollarSign" size={20} className="text-accent" />
                    <span className="text-2xl font-bold text-accent">{caseItem.price}</span>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                    Открыть
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {openedItem && (
          <Card className="max-w-md mx-auto p-8 border-2 animate-glow relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig[openedItem.rarity].gradient} opacity-20`} />
            
            <div className="relative text-center">
              <Badge className={`mb-4 ${rarityConfig[openedItem.rarity].color} text-white px-4 py-1 text-sm`}>
                {rarityConfig[openedItem.rarity].label}
              </Badge>
              
              <h3 className="text-3xl font-bold mb-2">{openedItem.name}</h3>
              <p className="text-4xl font-bold text-accent mb-6">${openedItem.value}</p>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  onClick={() => setOpenedItem(null)}
                >
                  Продолжить
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setBalance(balance + openedItem.value);
                    setOpenedItem(null);
                  }}
                >
                  Продать
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2">🎯</div>
            <h4 className="font-semibold mb-1">Честная игра</h4>
            <p className="text-sm text-muted-foreground">Проверенные шансы</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2">⚡</div>
            <h4 className="font-semibold mb-1">Мгновенно</h4>
            <p className="text-sm text-muted-foreground">Быстрые выплаты</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2">🔒</div>
            <h4 className="font-semibold mb-1">Безопасно</h4>
            <p className="text-sm text-muted-foreground">Защита данных</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2">🎁</div>
            <h4 className="font-semibold mb-1">Бонусы</h4>
            <p className="text-sm text-muted-foreground">Ежедневные подарки</p>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-xl">
                🎁
              </div>
              <span className="font-semibold">LOOTBOX CASES</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">О нас</a>
              <a href="#" className="hover:text-foreground transition-colors">Правила</a>
              <a href="#" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="#" className="hover:text-foreground transition-colors">Контакты</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
