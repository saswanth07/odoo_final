export const categories = [
  { id: 'c1', name: 'Hot Coffee', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 12 },
  { id: 'c2', name: 'Cold Coffee', image: 'https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 8 },
  { id: 'c3', name: 'Espresso', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 6 },
  { id: 'c4', name: 'Tea', image: 'https://images.pexels.com/photos/162700/coffee-tea-leaf-wooden-162700.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 10 },
  { id: 'c5', name: 'Pastries', image: 'https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 15 },
  { id: 'c6', name: 'Sandwiches', image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 9 },
  { id: 'c7', name: 'Smoothies', image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=200', productCount: 7 },
  { id: 'c8', name: 'Desserts', image: 'https://images.pexels.com/photos/45202/white-brownie-chocolate-cake-william-veerbeek.jpg?auto=compress&cs=tinysrgb&w=200', productCount: 11 },
];

export const products = [
  { id: 'p1', name: 'Cappuccino', description: 'Rich espresso with steamed milk and foam', price: 360.00, category: 'c1', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 50, available: true },
  { id: 'p2', name: 'Latte', description: 'Smooth espresso with velvety steamed milk', price: 380.00, category: 'c1', image: 'https://images.pexels.com/photos/849643/pexels-photo-849643.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 45, available: true },
  { id: 'p3', name: 'Americano', description: 'Bold espresso with hot water', price: 280.00, category: 'c1', image: 'https://images.pexels.com/photos/434213/pexels-photo-434213.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 60, available: true },
  { id: 'p4', name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 400.00, category: 'c1', image: 'https://images.pexels.com/photos/1627933/pexels-photo-1627933.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 40, available: true },
  { id: 'p5', name: 'Iced Latte', description: 'Chilled latte with ice', price: 420.00, category: 'c2', image: 'https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 35, available: true },
  { id: 'p6', name: 'Cold Brew', description: 'Slow-steeped coffee for smooth taste', price: 360.00, category: 'c2', image: 'https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 30, available: true },
  { id: 'p7', name: 'Espresso Shot', description: 'Double shot of pure espresso', price: 200.00, category: 'c3', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 80, available: true },
  { id: 'p8', name: 'Macchiato', description: 'Espresso with a dollop of foam', price: 280.00, category: 'c3', image: 'https://images.pexels.com/photos/1727123/pexels-photo-1727123.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 40, available: true },
  { id: 'p9', name: 'Earl Grey', description: 'Classic black tea with bergamot', price: 240.00, category: 'c4', image: 'https://images.pexels.com/photos/162700/coffee-tea-leaf-wooden-162700.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 70, available: true },
  { id: 'p10', name: 'Green Tea', description: 'Japanese sencha green tea', price: 240.00, category: 'c4', image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 60, available: true },
  { id: 'p11', name: 'Croissant', description: 'Buttery flaky French pastry', price: 260.00, category: 'c5', image: 'https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 25, available: true },
  { id: 'p12', name: 'Muffin', description: 'Blueberry muffin with streusel topping', price: 280.00, category: 'c5', image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 20, available: true },
  { id: 'p13', name: 'BLT Sandwich', description: 'Bacon, lettuce, tomato on sourdough', price: 680.00, category: 'c6', image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 15, available: true },
  { id: 'p14', name: 'Turkey Club', description: 'Turkey, bacon, avocado, lettuce', price: 760.00, category: 'c6', image: 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 12, available: true },
  { id: 'p15', name: 'Berry Smoothie', description: 'Mixed berries with yogurt and honey', price: 520.00, category: 'c7', image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 18, available: true },
  { id: 'p16', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 480.00, category: 'c8', image: 'https://images.pexels.com/photos/45202/white-brownie-chocolate-cake-william-veerbeek.jpg?auto=compress&cs=tinysrgb&w=400', stock: 10, available: true },
  { id: 'p17', name: 'Cheesecake', description: 'New York style cheesecake', price: 440.00, category: 'c8', image: 'https://images.pexels.com/photos/1098592/pexels-photo-1098592.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 14, available: true },
  { id: 'p18', name: 'Hot Chocolate', description: 'Rich chocolate with whipped cream', price: 340.00, category: 'c1', image: 'https://images.pexels.com/photos/45202/white-brownie-chocolate-cake-william-veerbeek.jpg?auto=compress&cs=tinysrgb&w=400', stock: 55, available: true },
  { id: 'p19', name: 'Chai Latte', description: 'Spiced tea with steamed milk', price: 360.00, category: 'c4', image: 'https://images.pexels.com/photos/5946628/pexels-photo-5946628.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 40, available: true },
  { id: 'p20', name: 'Iced Tea', description: 'Classic iced tea with lemon', price: 280.00, category: 'c2', image: 'https://images.pexels.com/photos/5946628/pexels-photo-5946628.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 50, available: true },
];

export const customers = [
  { id: 'cust1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', orders: 45, totalSpend: 67400.00, loyaltyPoints: 4200, favorite: 'Cappuccino', avatar: 'SJ' },
  { id: 'cust2', name: 'Michael Chen', email: 'michael.c@email.com', phone: '+1 (555) 234-5678', orders: 32, totalSpend: 49020.00, loyaltyPoints: 3050, favorite: 'Iced Latte', avatar: 'MC' },
  { id: 'cust3', name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 (555) 345-6789', orders: 28, totalSpend: 39864.00, loyaltyPoints: 2480, favorite: 'Croissant', avatar: 'ED' },
  { id: 'cust4', name: 'James Wilson', email: 'james.w@email.com', phone: '+1 (555) 456-7890', orders: 56, totalSpend: 78976.00, loyaltyPoints: 5600, favorite: 'Espresso Shot', avatar: 'JW' },
  { id: 'cust5', name: 'Olivia Martinez', email: 'olivia.m@email.com', phone: '+1 (555) 567-8901', orders: 19, totalSpend: 27648.00, loyaltyPoints: 1720, favorite: 'Mocha', avatar: 'OM' },
  { id: 'cust6', name: 'Daniel Brown', email: 'daniel.b@email.com', phone: '+1 (555) 678-9012', orders: 38, totalSpend: 57636.00, loyaltyPoints: 3600, favorite: 'Latte', avatar: 'DB' },
  { id: 'cust7', name: 'Sophia Lee', email: 'sophia.l@email.com', phone: '+1 (555) 789-0123', orders: 22, totalSpend: 33024.00, loyaltyPoints: 2060, favorite: 'Berry Smoothie', avatar: 'SL' },
  { id: 'cust8', name: 'William Taylor', email: 'william.t@email.com', phone: '+1 (555) 890-1234', orders: 41, totalSpend: 61224.00, loyaltyPoints: 3820, favorite: 'BLT Sandwich', avatar: 'WT' },
  { id: 'cust9', name: 'Ava Anderson', email: 'ava.a@email.com', phone: '+1 (555) 901-2345', orders: 15, totalSpend: 22312.00, loyaltyPoints: 1390, favorite: 'Green Tea', avatar: 'AA' },
  { id: 'cust10', name: 'Noah Garcia', email: 'noah.g@email.com', phone: '+1 (555) 012-3456', orders: 33, totalSpend: 51612.00, loyaltyPoints: 3220, favorite: 'Cold Brew', avatar: 'NG' },
];

export const employees = [
  { id: 'e1', name: 'Alex Thompson', role: 'Manager', email: 'alex@cafepos.com', phone: '+1 (555) 111-2222', status: 'Active', revenue: 996000, orders: 345, avatar: 'AT' },
  { id: 'e2', name: 'Maria Rodriguez', role: 'Barista', email: 'maria@cafepos.com', phone: '+1 (555) 222-3333', status: 'Active', revenue: 700000, orders: 280, avatar: 'MR' },
  { id: 'e3', name: 'David Kim', role: 'Barista', email: 'david@cafepos.com', phone: '+1 (555) 333-4444', status: 'Active', revenue: 736000, orders: 310, avatar: 'DK' },
  { id: 'e4', name: 'Jessica White', role: 'Server', email: 'jessica@cafepos.com', phone: '+1 (555) 444-5555', status: 'Active', revenue: 520000, orders: 190, avatar: 'JW' },
  { id: 'e5', name: 'Ryan Clark', role: 'Server', email: 'ryan@cafepos.com', phone: '+1 (555) 555-6666', status: 'On Leave', revenue: 0, orders: 0, avatar: 'RC' },
  { id: 'e6', name: 'Lisa Park', role: 'Chef', email: 'lisa@cafepos.com', phone: '+1 (555) 666-7777', status: 'Active', revenue: 344000, orders: 0, avatar: 'LP' },
  { id: 'e7', name: 'Tom Harris', role: 'Cashier', email: 'tom@cafepos.com', phone: '+1 (555) 777-8888', status: 'Active', revenue: 840000, orders: 420, avatar: 'TH' },
  { id: 'e8', name: 'Nina Patel', role: 'Barista', email: 'nina@cafepos.com', phone: '+1 (555) 888-9999', status: 'Active', revenue: 624000, orders: 265, avatar: 'NP' },
];

export const orders = [
  { id: 'ORD-2024-001', customer: 'Sarah Johnson', table: 'T3', employee: 'Maria Rodriguez', amount: 1480.00, status: 'Completed', date: '2024-06-20 09:15:00', items: [{ name: 'Cappuccino', qty: 1, price: 360.00 }, { name: 'Croissant', qty: 2, price: 260.00 }, { name: 'Latte', qty: 1, price: 380.00 }], payment: { method: 'Card', amount: 1480.00 }, timeline: [{ status: 'Pending', time: '09:15:00' }, { status: 'Preparing', time: '09:17:00' }, { status: 'Ready', time: '09:22:00' }, { status: 'Served', time: '09:25:00' }, { status: 'Completed', time: '09:30:00' }] },
  { id: 'ORD-2024-002', customer: 'Michael Chen', table: 'T7', employee: 'David Kim', amount: 1000.00, status: 'Preparing', date: '2024-06-20 09:30:00', items: [{ name: 'Iced Latte', qty: 1, price: 420.00 }, { name: 'Muffin', qty: 1, price: 280.00 }, { name: 'Espresso Shot', qty: 1, price: 200.00 }], payment: { method: 'Cash', amount: 1000.00 }, timeline: [{ status: 'Pending', time: '09:30:00' }, { status: 'Preparing', time: '09:32:00' }] },
  { id: 'ORD-2024-003', customer: 'Emily Davis', table: 'T1', employee: 'Maria Rodriguez', amount: 1820.00, status: 'Pending', date: '2024-06-20 09:45:00', items: [{ name: 'Cappuccino', qty: 1, price: 360.00 }, { name: 'BLT Sandwich', qty: 1, price: 680.00 }, { name: 'Berry Smoothie', qty: 1, price: 520.00 }, { name: 'Muffin', qty: 1, price: 280.00 }], payment: { method: 'Card', amount: 1820.00 }, timeline: [{ status: 'Pending', time: '09:45:00' }] },
  { id: 'ORD-2024-004', customer: 'James Wilson', table: 'T5', employee: 'Tom Harris', amount: 2520.00, status: 'Ready', date: '2024-06-20 09:50:00', items: [{ name: 'Espresso Shot', qty: 2, price: 200.00 }, { name: 'Turkey Club', qty: 1, price: 760.00 }, { name: 'Mocha', qty: 1, price: 400.00 }, { name: 'Cheesecake', qty: 1, price: 440.00 }, { name: 'Cold Brew', qty: 1, price: 360.00 }], payment: { method: 'UPI', amount: 2520.00 }, timeline: [{ status: 'Pending', time: '09:50:00' }, { status: 'Preparing', time: '09:52:00' }, { status: 'Ready', time: '09:58:00' }] },
  { id: 'ORD-2024-005', customer: 'Olivia Martinez', table: 'T2', employee: 'David Kim', amount: 1200.00, status: 'Served', date: '2024-06-20 10:00:00', items: [{ name: 'Mocha', qty: 1, price: 400.00 }, { name: 'Croissant', qty: 1, price: 260.00 }, { name: 'Iced Latte', qty: 1, price: 420.00 }, { name: 'Muffin', qty: 1, price: 280.00 }], payment: { method: 'Wallet', amount: 1200.00 }, timeline: [{ status: 'Pending', time: '10:00:00' }, { status: 'Preparing', time: '10:02:00' }, { status: 'Ready', time: '10:08:00' }, { status: 'Served', time: '10:12:00' }] },
  { id: 'ORD-2024-006', customer: 'Daniel Brown', table: 'T8', employee: 'Tom Harris', amount: 2160.00, status: 'Completed', date: '2024-06-20 10:15:00', items: [{ name: 'Latte', qty: 2, price: 380.00 }, { name: 'BLT Sandwich', qty: 1, price: 680.00 }, { name: 'Muffin', qty: 1, price: 280.00 }, { name: 'Iced Tea', qty: 1, price: 280.00 }], payment: { method: 'Card', amount: 2160.00 }, timeline: [{ status: 'Pending', time: '10:15:00' }, { status: 'Preparing', time: '10:17:00' }, { status: 'Ready', time: '10:23:00' }, { status: 'Served', time: '10:27:00' }, { status: 'Completed', time: '10:30:00' }] },
  { id: 'ORD-2024-007', customer: 'Sophia Lee', table: 'T4', employee: 'Nina Patel', amount: 1540.00, status: 'Cancelled', date: '2024-06-20 10:30:00', items: [{ name: 'Berry Smoothie', qty: 1, price: 520.00 }, { name: 'Croissant', qty: 1, price: 260.00 }, { name: 'Iced Latte', qty: 1, price: 420.00 }, { name: 'Muffin', qty: 1, price: 280.00 }], payment: { method: 'Cash', amount: 1540.00 }, timeline: [{ status: 'Pending', time: '10:30:00' }, { status: 'Cancelled', time: '10:32:00' }] },
  { id: 'ORD-2024-008', customer: 'William Taylor', table: 'T6', employee: 'Tom Harris', amount: 2820.00, status: 'Preparing', date: '2024-06-20 10:45:00', items: [{ name: 'Turkey Club', qty: 1, price: 760.00 }, { name: 'BLT Sandwich', qty: 1, price: 680.00 }, { name: 'Iced Latte', qty: 1, price: 420.00 }, { name: 'Cold Brew', qty: 1, price: 360.00 }, { name: 'Tiramisu', qty: 1, price: 480.00 }, { name: 'Espresso Shot', qty: 1, price: 200.00 }], payment: { method: 'Card', amount: 2820.00 }, timeline: [{ status: 'Pending', time: '10:45:00' }, { status: 'Preparing', time: '10:47:00' }] },
  { id: 'ORD-2024-009', customer: 'Ava Anderson', table: 'T9', employee: 'David Kim', amount: 1080.00, status: 'Completed', date: '2024-06-20 11:00:00', items: [{ name: 'Green Tea', qty: 1, price: 240.00 }, { name: 'Croissant', qty: 1, price: 260.00 }, { name: 'Muffin', qty: 1, price: 280.00 }, { name: 'Iced Latte', qty: 1, price: 420.00 }], payment: { method: 'UPI', amount: 1080.00 }, timeline: [{ status: 'Pending', time: '11:00:00' }, { status: 'Preparing', time: '11:02:00' }, { status: 'Ready', time: '11:08:00' }, { status: 'Served', time: '11:12:00' }, { status: 'Completed', time: '11:15:00' }] },
  { id: 'ORD-2024-010', customer: 'Noah Garcia', table: 'T10', employee: 'Maria Rodriguez', amount: 1340.00, status: 'Pending', date: '2024-06-20 11:15:00', items: [{ name: 'Cold Brew', qty: 1, price: 360.00 }, { name: 'Croissant', qty: 1, price: 260.00 }, { name: 'Muffin', qty: 1, price: 280.00 }, { name: 'Espresso Shot', qty: 1, price: 200.00 }, { name: 'Chai Latte', qty: 1, price: 360.00 }], payment: { method: 'Wallet', amount: 1340.00 }, timeline: [{ status: 'Pending', time: '11:15:00' }] },
];

export const payments = [
  { id: 'PAY-001', orderId: 'ORD-2024-001', method: 'Card', amount: 1480.00, status: 'Success', date: '2024-06-20 09:30:00' },
  { id: 'PAY-002', orderId: 'ORD-2024-002', method: 'Cash', amount: 1000.00, status: 'Pending', date: '2024-06-20 09:30:00' },
  { id: 'PAY-003', orderId: 'ORD-2024-003', method: 'Card', amount: 1820.00, status: 'Pending', date: '2024-06-20 09:45:00' },
  { id: 'PAY-004', orderId: 'ORD-2024-004', method: 'UPI', amount: 2520.00, status: 'Success', date: '2024-06-20 09:58:00' },
  { id: 'PAY-005', orderId: 'ORD-2024-005', method: 'Wallet', amount: 1200.00, status: 'Success', date: '2024-06-20 10:12:00' },
  { id: 'PAY-006', orderId: 'ORD-2024-006', method: 'Card', amount: 2160.00, status: 'Success', date: '2024-06-20 10:30:00' },
  { id: 'PAY-007', orderId: 'ORD-2024-007', method: 'Cash', amount: 1540.00, status: 'Refunded', date: '2024-06-20 10:32:00' },
  { id: 'PAY-008', orderId: 'ORD-2024-008', method: 'Card', amount: 2820.00, status: 'Pending', date: '2024-06-20 10:45:00' },
  { id: 'PAY-009', orderId: 'ORD-2024-009', method: 'UPI', amount: 1080.00, status: 'Success', date: '2024-06-20 11:15:00' },
  { id: 'PAY-010', orderId: 'ORD-2024-010', method: 'Wallet', amount: 1340.00, status: 'Pending', date: '2024-06-20 11:15:00' },
];

export const paymentMethods = [
  { id: 'pm1', name: 'Cash', icon: 'Banknote', enabled: true, transactions: 1245, totalAmount: 658760.00 },
  { id: 'pm2', name: 'Credit Card', icon: 'CreditCard', enabled: true, transactions: 3456, totalAmount: 4187260.00 },
  { id: 'pm3', name: 'Debit Card', icon: 'CreditCard', enabled: true, transactions: 2180, totalAmount: 2312020.00 },
  { id: 'pm4', name: 'UPI', icon: 'Smartphone', enabled: true, transactions: 890, totalAmount: 996064.00 },
  { id: 'pm5', name: 'Wallet', icon: 'Wallet', enabled: true, transactions: 456, totalAmount: 542432.00 },
];

export const coupons = [
  { id: 'cp1', code: 'WELCOME20', discount: '20% Off', type: 'percentage', value: 20, startDate: '2024-06-01', endDate: '2024-06-30', status: 'Active', usage: 145, revenue: 273640.00 },
  { id: 'cp2', code: 'SUMMER10', discount: '₹800 Off', type: 'fixed', value: 800, startDate: '2024-06-15', endDate: '2024-07-15', status: 'Active', usage: 89, revenue: 168024.00 },
  { id: 'cp3', code: 'FLASH50', discount: '50% Off', type: 'percentage', value: 50, startDate: '2024-06-20', endDate: '2024-06-21', status: 'Expired', usage: 234, revenue: 364800.00 },
  { id: 'cp4', code: 'LOYALTY15', discount: '15% Off', type: 'percentage', value: 15, startDate: '2024-06-10', endDate: '2024-07-10', status: 'Active', usage: 112, revenue: 231260.00 },
  { id: 'cp5', code: 'BIRTHDAY25', discount: '₹2000 Off', type: 'fixed', value: 2000, startDate: '2024-06-01', endDate: '2024-12-31', status: 'Active', usage: 34, revenue: 100000.00 },
];

export const promotions = [
  { id: 'prom1', name: 'Summer Coffee Festival', description: 'Buy 2 get 1 free on all cold coffees', type: 'BOGO', startDate: '2024-06-01', endDate: '2024-08-31', status: 'Active', revenue: 12450, redemptions: 456 },
  { id: 'prom2', name: 'Happy Hour Special', description: '50% off on all pastries after 4 PM', type: 'Discount', startDate: '2024-06-15', endDate: '2024-09-15', status: 'Active', revenue: 6780, redemptions: 234 },
  { id: 'prom3', name: 'Morning Rush Deal', description: 'Free croissant with any coffee before 10 AM', type: 'Free Item', startDate: '2024-05-01', endDate: '2024-06-30', status: 'Expired', revenue: 8920, redemptions: 567 },
  { id: 'prom4', name: 'Weekend Brunch', description: '20% off on all sandwiches on weekends', type: 'Discount', startDate: '2024-07-01', endDate: '2024-09-30', status: 'Upcoming', revenue: 0, redemptions: 0 },
];

export const feedbacks = [
  { id: 'f1', customer: 'Sarah Johnson', rating: 5, review: 'Amazing coffee and friendly staff! The croissant was perfectly flaky.', date: '2024-06-20', sentiment: 'Positive' },
  { id: 'f2', customer: 'Michael Chen', rating: 4, review: 'Great latte, but the wait was a bit long during morning rush.', date: '2024-06-20', sentiment: 'Positive' },
  { id: 'f3', customer: 'Emily Davis', rating: 5, review: 'Best cappuccino in town! Love the cozy atmosphere.', date: '2024-06-19', sentiment: 'Positive' },
  { id: 'f4', customer: 'James Wilson', rating: 3, review: 'Food was good but service was slow. Need more staff.', date: '2024-06-19', sentiment: 'Neutral' },
  { id: 'f5', customer: 'Olivia Martinez', rating: 5, review: 'The berry smoothie is absolutely delicious! Will come back.', date: '2024-06-19', sentiment: 'Positive' },
  { id: 'f6', customer: 'Daniel Brown', rating: 2, review: 'Cold coffee was watered down. Disappointing.', date: '2024-06-18', sentiment: 'Negative' },
  { id: 'f7', customer: 'Sophia Lee', rating: 4, review: 'Nice ambiance. The BLT sandwich was fresh and tasty.', date: '2024-06-18', sentiment: 'Positive' },
  { id: 'f8', customer: 'William Taylor', rating: 5, review: 'Outstanding service! Tom is the best cashier.', date: '2024-06-18', sentiment: 'Positive' },
];

export const tables = [
  { id: 'T1', name: 'Table 1', status: 'Available', capacity: 2, section: 'Indoor', x: 50, y: 50 },
  { id: 'T2', name: 'Table 2', status: 'Occupied', capacity: 4, section: 'Indoor', x: 150, y: 50 },
  { id: 'T3', name: 'Table 3', status: 'Occupied', capacity: 2, section: 'Indoor', x: 250, y: 50 },
  { id: 'T4', name: 'Table 4', status: 'Reserved', capacity: 6, section: 'Indoor', x: 50, y: 150 },
  { id: 'T5', name: 'Table 5', status: 'Occupied', capacity: 4, section: 'Indoor', x: 150, y: 150 },
  { id: 'T6', name: 'Table 6', status: 'Available', capacity: 2, section: 'Indoor', x: 250, y: 150 },
  { id: 'T7', name: 'Table 7', status: 'Occupied', capacity: 4, section: 'Outdoor', x: 50, y: 250 },
  { id: 'T8', name: 'Table 8', status: 'Cleaning', capacity: 2, section: 'Outdoor', x: 150, y: 250 },
  { id: 'T9', name: 'Table 9', status: 'Available', capacity: 4, section: 'Outdoor', x: 250, y: 250 },
  { id: 'T10', name: 'Table 10', status: 'Occupied', capacity: 6, section: 'VIP', x: 50, y: 350 },
  { id: 'T11', name: 'Table 11', status: 'Reserved', capacity: 4, section: 'VIP', x: 150, y: 350 },
  { id: 'T12', name: 'Table 12', status: 'Available', capacity: 2, section: 'VIP', x: 250, y: 350 },
];

export const floors = [
  { id: 'f1', name: 'Ground Floor', sections: ['Indoor', 'Outdoor', 'VIP'], tables: 12, status: 'Active' },
  { id: 'f2', name: 'First Floor', sections: ['Indoor', 'Outdoor'], tables: 8, status: 'Active' },
  { id: 'f3', name: 'Rooftop', sections: ['Outdoor'], tables: 6, status: 'Active' },
];

export const kitchenOrders = [
  { id: 'ORD-2024-003', status: 'Pending', items: [{ name: 'Cappuccino', qty: 1 }, { name: 'BLT Sandwich', qty: 1 }, { name: 'Berry Smoothie', qty: 1 }, { name: 'Muffin', qty: 1 }], time: '09:45:00', priority: 'Normal' },
  { id: 'ORD-2024-002', status: 'Preparing', items: [{ name: 'Iced Latte', qty: 1 }, { name: 'Muffin', qty: 1 }, { name: 'Espresso Shot', qty: 1 }], time: '09:30:00', priority: 'High' },
  { id: 'ORD-2024-004', status: 'Ready', items: [{ name: 'Espresso Shot', qty: 2 }, { name: 'Turkey Club', qty: 1 }, { name: 'Mocha', qty: 1 }, { name: 'Cheesecake', qty: 1 }, { name: 'Cold Brew', qty: 1 }], time: '09:50:00', priority: 'Normal' },
  { id: 'ORD-2024-005', status: 'Served', items: [{ name: 'Mocha', qty: 1 }, { name: 'Croissant', qty: 1 }, { name: 'Iced Latte', qty: 1 }, { name: 'Muffin', qty: 1 }], time: '10:00:00', priority: 'Normal' },
  { id: 'ORD-2024-008', status: 'Preparing', items: [{ name: 'Turkey Club', qty: 1 }, { name: 'BLT Sandwich', qty: 1 }, { name: 'Iced Latte', qty: 1 }, { name: 'Cold Brew', qty: 1 }, { name: 'Tiramisu', qty: 1 }, { name: 'Espresso Shot', qty: 1 }], time: '10:45:00', priority: 'High' },
  { id: 'ORD-2024-010', status: 'Pending', items: [{ name: 'Cold Brew', qty: 1 }, { name: 'Croissant', qty: 1 }, { name: 'Muffin', qty: 1 }, { name: 'Espresso Shot', qty: 1 }, { name: 'Chai Latte', qty: 1 }], time: '11:15:00', priority: 'Normal' },
  { id: 'ORD-2024-011', status: 'Pending', items: [{ name: 'Latte', qty: 1 }, { name: 'Croissant', qty: 2 }, { name: 'Mocha', qty: 1 }], time: '11:25:00', priority: 'High' },
  { id: 'ORD-2024-012', status: 'Preparing', items: [{ name: 'Americano', qty: 1 }, { name: 'Turkey Club', qty: 1 }, { name: 'Berry Smoothie', qty: 1 }], time: '11:30:00', priority: 'Normal' },
];

export const revenueData = [
  { name: 'Mon', revenue: 192000, orders: 120, customers: 98 },
  { name: 'Tue', revenue: 256000, orders: 145, customers: 110 },
  { name: 'Wed', revenue: 224000, orders: 130, customers: 105 },
  { name: 'Thu', revenue: 288000, orders: 160, customers: 130 },
  { name: 'Fri', revenue: 336000, orders: 185, customers: 150 },
  { name: 'Sat', revenue: 408000, orders: 220, customers: 180 },
  { name: 'Sun', revenue: 384000, orders: 210, customers: 175 },
];

export const hourlyData = [
  { hour: '7AM', revenue: 36000, orders: 22 },
  { hour: '8AM', revenue: 71200, orders: 45 },
  { hour: '9AM', revenue: 96000, orders: 60 },
  { hour: '10AM', revenue: 76000, orders: 48 },
  { hour: '11AM', revenue: 62400, orders: 38 },
  { hour: '12PM', revenue: 120000, orders: 75 },
  { hour: '1PM', revenue: 144000, orders: 90 },
  { hour: '2PM', revenue: 96000, orders: 60 },
  { hour: '3PM', revenue: 68000, orders: 42 },
  { hour: '4PM', revenue: 76000, orders: 48 },
  { hour: '5PM', revenue: 88000, orders: 55 },
  { hour: '6PM', revenue: 112000, orders: 70 },
  { hour: '7PM', revenue: 96000, orders: 60 },
  { hour: '8PM', revenue: 72000, orders: 45 },
  { hour: '9PM', revenue: 52000, orders: 32 },
];

export const topProducts = [
  { name: 'Cappuccino', sales: 450, revenue: 162000, growth: 12.5 },
  { name: 'Iced Latte', sales: 380, revenue: 159600, growth: 8.3 },
  { name: 'Croissant', sales: 320, revenue: 83200, growth: -2.1 },
  { name: 'Latte', sales: 290, revenue: 110200, growth: 5.7 },
  { name: 'Mocha', sales: 260, revenue: 104000, growth: 15.2 },
];

export const topCategories = [
  { name: 'Hot Coffee', sales: 890, percentage: 35 },
  { name: 'Cold Coffee', sales: 520, percentage: 22 },
  { name: 'Pastries', sales: 450, percentage: 19 },
  { name: 'Sandwiches', sales: 280, percentage: 12 },
  { name: 'Tea', sales: 180, percentage: 7 },
  { name: 'Desserts', sales: 130, percentage: 5 },
];

export const paymentMethodDistribution = [
  { name: 'Credit Card', value: 3456, color: '#7C3AED' },
  { name: 'Debit Card', value: 2180, color: '#A855F7' },
  { name: 'Cash', value: 1245, color: '#10B981' },
  { name: 'UPI', value: 890, color: '#F59E0B' },
  { name: 'Wallet', value: 456, color: '#EF4444' },
];

export const ratingDistribution = [
  { rating: 5, count: 234, percentage: 58 },
  { rating: 4, count: 89, percentage: 22 },
  { rating: 3, count: 45, percentage: 11 },
  { rating: 2, count: 23, percentage: 6 },
  { rating: 1, count: 12, percentage: 3 },
];

export const notifications = [
  { id: 'n1', type: 'Order', title: 'New Order Received', message: 'Order #ORD-2024-010 from Noah Garcia', time: '2 min ago', read: false },
  { id: 'n2', type: 'Payment', title: 'Payment Successful', message: 'Card payment ₹2820.00 for Order #ORD-2024-008', time: '15 min ago', read: false },
  { id: 'n3', type: 'Order', title: 'Order Ready', message: 'Order #ORD-2024-004 is ready for pickup', time: '30 min ago', read: true },
  { id: 'n4', type: 'Employee', title: 'Employee Added', message: 'Nina Patel joined as Barista', time: '1 hr ago', read: true },
  { id: 'n5', type: 'Feedback', title: 'New Review', message: 'Sarah Johnson left a 5-star review', time: '2 hr ago', read: true },
  { id: 'n6', type: 'Order', title: 'Order Cancelled', message: 'Order #ORD-2024-007 was cancelled', time: '2 hr ago', read: true },
  { id: 'n7', type: 'Payment', title: 'Refund Processed', message: '₹1540.00 refunded for Order #ORD-2024-007', time: '2 hr ago', read: true },
  { id: 'n8', type: 'Promotion', title: 'Promotion Ended', message: 'FLASH50 coupon has expired', time: '3 hr ago', read: true },
];

export const dashboardStats = [
  { label: 'Total Revenue', value: 996060.00, trend: 12.5, icon: 'IndianRupee', color: 'primary' },
  { label: 'Total Orders', value: 345, trend: 8.3, icon: 'ShoppingBag', color: 'success' },
  { label: 'Avg Order Value', value: 2886.40, trend: 3.7, icon: 'TrendingUp', color: 'warning' },
  { label: 'Active Customers', value: 156, trend: 15.2, icon: 'Users', color: 'secondary' },
  { label: 'Total Employees', value: 8, trend: 0, icon: 'UserCheck', color: 'info' },
  { label: 'Today\'s Sales', value: 227640.00, trend: 22.1, icon: 'Calendar', color: 'accent' },
];
