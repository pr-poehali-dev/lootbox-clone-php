-- Insert initial cases
INSERT INTO cases (name, description, price, image_url) VALUES 
('Starter Box', 'Стартовый набор с популярными товарами: наушники, повербанки, аксессуары', 50, '/img/d31465db-15de-4dae-97e3-0c730da8acfb.jpg'),
('Premium Chest', 'Премиум кейс с брендовыми товарами: смартфоны, умные часы, планшеты', 150, '/img/558d9db0-43f6-434a-8de8-2b01ac306f5c.jpg'),
('Legendary Vault', 'Легендарный сейф с эксклюзивом: ноутбуки, игровые консоли, VR-гарнитуры', 300, '/img/2ce248dc-38da-4e63-97ed-613935da477e.jpg'),
('Mystery Box', 'Загадочный бокс с сюрпризами: гаджеты, аксессуары, мерч', 100, '/img/d31465db-15de-4dae-97e3-0c730da8acfb.jpg'),
('Elite Case', 'Элитный кейс с топовыми товарами: дроны, камеры, профессиональная техника', 200, '/img/558d9db0-43f6-434a-8de8-2b01ac306f5c.jpg'),
('Royal Treasury', 'Королевская сокровищница: премиум электроника, эксклюзивные девайсы', 500, '/img/2ce248dc-38da-4e63-97ed-613935da477e.jpg');

-- Insert products for Starter Box (id=1)
INSERT INTO products (case_id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity) VALUES
(1, 'Беспроводные наушники TWS', 'Качественные беспроводные наушники', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'common', 15, 40.00, 100),
(1, 'Powerbank 10000mAh', 'Портативное зарядное устройство', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'common', 20, 35.00, 80),
(1, 'Умная лампа RGB', 'Лампа с управлением цветом', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400', 'rare', 60, 20.00, 50),
(1, 'Фитнес-браслет', 'Трекер активности и сна', 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=400', 'epic', 120, 4.50, 20),
(1, 'Apple AirPods 2', 'Оригинальные наушники Apple', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', 'legendary', 300, 0.50, 5);

-- Insert products for Premium Chest (id=2)
INSERT INTO products (case_id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity) VALUES
(2, 'Умные часы Xiaomi', 'Фитнес-часы с множеством функций', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 'rare', 100, 30.00, 40),
(2, 'Планшет 10 дюймов', 'Планшет для работы и развлечений', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400', 'rare', 180, 25.00, 30),
(2, 'Смартфон Xiaomi', 'Современный смартфон среднего класса', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'epic', 400, 15.00, 15),
(2, 'Apple Watch SE', 'Умные часы от Apple', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400', 'epic', 600, 8.00, 10),
(2, 'iPhone 13', 'Флагманский смартфон Apple', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400', 'legendary', 1500, 2.00, 3);

-- Insert products for Legendary Vault (id=3)
INSERT INTO products (case_id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity) VALUES
(3, 'Игровая консоль PlayStation 5', 'Новейшая консоль от Sony', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'epic', 1000, 20.00, 8),
(3, 'Ноутбук ASUS Gaming', 'Игровой ноутбук с RTX', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 'epic', 1800, 15.00, 5),
(3, 'VR-гарнитура Meta Quest 3', 'VR-шлем нового поколения', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400', 'legendary', 2200, 8.00, 4),
(3, 'MacBook Air M2', 'Ноутбук Apple на чипе M2', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'legendary', 2800, 5.00, 2),
(3, 'iPhone 15 Pro Max', 'Топовый iPhone последней модели', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 'legendary', 3500, 2.00, 1);

-- Insert products for Mystery Box (id=4)
INSERT INTO products (case_id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity) VALUES
(4, 'Стикерпак гаджетов', 'Набор наклеек для техники', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'common', 8, 45.00, 150),
(4, 'Bluetooth-колонка', 'Портативная колонка JBL-style', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'rare', 50, 30.00, 60),
(4, 'Механическая клавиатура RGB', 'Игровая клавиатура с подсветкой', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 'epic', 180, 12.00, 25),
(4, 'Экшн-камера 4K', 'Камера для активного отдыха', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', 'epic', 250, 10.00, 15),
(4, 'DJI Mini Drone', 'Компактный дрон с камерой', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400', 'legendary', 950, 3.00, 5);

-- Insert products for Elite Case (id=5)
INSERT INTO products (case_id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity) VALUES
(5, 'Профессиональная веб-камера', 'Камера для стриминга 1080p', 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400', 'rare', 120, 28.00, 40),
(5, 'Студийный микрофон', 'Конденсаторный микрофон для записи', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400', 'rare', 200, 22.00, 30),
(5, 'Графический планшет Wacom', 'Планшет для цифрового рисования', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400', 'epic', 450, 18.00, 20),
(5, 'Gimbal для смартфона DJI', 'Стабилизатор для видеосъемки', 'https://images.unsplash.com/photo-1591290619762-c588853a8e4b?w=400', 'epic', 380, 15.00, 15),
(5, 'Sony Alpha A7 III', 'Профессиональная беззеркалка', 'https://images.unsplash.com/photo-1606986628994-d6cea0dd8f88?w=400', 'legendary', 4500, 2.00, 3);

-- Insert products for Royal Treasury (id=6)
INSERT INTO products (case_id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity) VALUES
(6, 'iPad Pro 12.9', 'Профессиональный планшет Apple', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'epic', 2200, 25.00, 10),
(6, 'Samsung Galaxy Z Fold', 'Складной флагманский смартфон', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 'epic', 2800, 20.00, 8),
(6, 'MacBook Pro 16 M3', 'Топовый ноутбук Apple', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'legendary', 5500, 10.00, 4),
(6, 'PlayStation 5 Pro Bundle', 'PS5 + игры + аксессуары', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'legendary', 3200, 8.00, 3),
(6, 'Apple Vision Pro', 'Революционная AR/VR гарнитура', 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400', 'legendary', 7500, 2.00, 1);
