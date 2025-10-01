'''
Business: Get cases and products, open case with random product drop
Args: event with httpMethod, body, headers (X-User-Token); context with request_id
Returns: Cases list, products, opening result with won product
'''

import json
import os
import random
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def select_product_by_rarity(products: List[Dict]) -> Dict:
    total_chance = sum(p['drop_chance'] for p in products)
    rand = random.uniform(0, total_chance)
    
    current = 0
    for product in products:
        current += product['drop_chance']
        if rand <= current:
            return product
    
    return products[-1]

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            case_id = params.get('caseId')
            
            if case_id:
                cursor.execute('''
                    SELECT c.*, 
                           json_agg(
                               json_build_object(
                                   'id', p.id, 'name', p.name, 'description', p.description,
                                   'image_url', p.image_url, 'rarity', p.rarity,
                                   'market_value', p.market_value, 'drop_chance', p.drop_chance,
                                   'stock_quantity', p.stock_quantity
                               ) ORDER BY p.drop_chance DESC
                           ) as products
                    FROM cases c
                    LEFT JOIN products p ON p.case_id = c.id
                    WHERE c.id = %s AND c.is_active = true
                    GROUP BY c.id
                ''', (case_id,))
                case = cursor.fetchone()
                
                if not case:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Case not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(case), default=str),
                    'isBase64Encoded': False
                }
            else:
                cursor.execute('''
                    SELECT c.*,
                           COUNT(p.id) as product_count,
                           MIN(p.market_value) as min_value,
                           MAX(p.market_value) as max_value
                    FROM cases c
                    LEFT JOIN products p ON p.case_id = c.id
                    WHERE c.is_active = true
                    GROUP BY c.id
                    ORDER BY c.price ASC
                ''')
                cases = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(case) for case in cases], default=str),
                    'isBase64Encoded': False
                }
        
        if method == 'POST':
            headers = event.get('headers', {})
            user_token = headers.get('X-User-Token') or headers.get('x-user-token')
            
            if not user_token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            case_id = body_data.get('caseId')
            user_id = body_data.get('userId')
            
            if not case_id or not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing caseId or userId'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('SELECT id, price FROM cases WHERE id = %s AND is_active = true', (case_id,))
            case = cursor.fetchone()
            
            if not case:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Case not found'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('SELECT balance FROM users WHERE id = %s', (user_id,))
            user = cursor.fetchone()
            
            if not user or user['balance'] < case['price']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient balance'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                SELECT id, name, description, image_url, rarity, market_value, drop_chance, stock_quantity
                FROM products WHERE case_id = %s AND stock_quantity > 0
            ''', (case_id,))
            products = [dict(p) for p in cursor.fetchall()]
            
            if not products:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No products available'}),
                    'isBase64Encoded': False
                }
            
            won_product = select_product_by_rarity(products)
            
            cursor.execute('UPDATE users SET balance = balance - %s WHERE id = %s', (case['price'], user_id))
            
            cursor.execute('''
                INSERT INTO user_inventory (user_id, product_id, case_id)
                VALUES (%s, %s, %s)
                RETURNING id, won_at
            ''', (user_id, won_product['id'], case_id))
            inventory_item = cursor.fetchone()
            
            cursor.execute('''
                INSERT INTO opening_history (user_id, case_id, product_id)
                VALUES (%s, %s, %s)
            ''', (user_id, case_id, won_product['id']))
            
            cursor.execute('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = %s', (won_product['id'],))
            
            cursor.execute('''
                INSERT INTO transactions (user_id, amount, transaction_type, description)
                VALUES (%s, %s, %s, %s)
            ''', (user_id, -case['price'], 'case_opening', f'Opened case: {case_id}'))
            
            conn.commit()
            
            result = {
                'inventoryId': inventory_item['id'],
                'product': won_product,
                'wonAt': inventory_item['won_at']
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
