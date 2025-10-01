'''
Business: User auth & management - OAuth (Google/VK), profile, referral system
Args: event with httpMethod, body, headers (X-User-Token); context with request_id
Returns: User profile, JWT token, referral stats, balance
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import secrets
import string

def generate_referral_code(length: int = 8) -> str:
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    path = params.get('action', 'profile')
    
    if path == 'oauth' and method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        provider = body_data.get('provider')
        auth_code = body_data.get('code')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'OAuth endpoint ready',
                'provider': provider,
                'token': 'demo_jwt_token_' + str(secrets.token_hex(16))
            }),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_token = headers.get('X-User-Token') or headers.get('x-user-token')
    
    if not user_token and method != 'POST':
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            user_id = params.get('userId', '1')
            
            cursor.execute('''
                SELECT id, username, email, avatar_url, balance, 
                       referral_code, referral_earnings, created_at, last_login
                FROM users WHERE id = %s
            ''', (user_id,))
            user = cursor.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                SELECT COUNT(*) as referral_count, COALESCE(SUM(reward_amount), 0) as total_earned
                FROM referral_rewards WHERE referrer_id = %s
            ''', (user_id,))
            referral_stats = cursor.fetchone()
            
            result = dict(user)
            result['referralStats'] = dict(referral_stats) if referral_stats else {'referral_count': 0, 'total_earned': 0}
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            username = body_data.get('username')
            email = body_data.get('email')
            auth_provider = body_data.get('authProvider', 'google')
            auth_provider_id = body_data.get('authProviderId')
            avatar_url = body_data.get('avatarUrl', '')
            referred_by_code = body_data.get('referralCode')
            
            if not username:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Username required'}),
                    'isBase64Encoded': False
                }
            
            referral_code = generate_referral_code()
            referred_by_id = None
            
            if referred_by_code:
                cursor.execute('SELECT id FROM users WHERE referral_code = %s', (referred_by_code,))
                referrer = cursor.fetchone()
                if referrer:
                    referred_by_id = referrer['id']
            
            cursor.execute('''
                INSERT INTO users (username, email, auth_provider, auth_provider_id, 
                                   avatar_url, referral_code, referred_by, balance)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, username, email, balance, referral_code
            ''', (username, email, auth_provider, auth_provider_id, avatar_url, 
                  referral_code, referred_by_id, 100.00))
            
            new_user = cursor.fetchone()
            
            if referred_by_id:
                cursor.execute('''
                    INSERT INTO referral_rewards (referrer_id, referred_id, reward_amount, reward_type)
                    VALUES (%s, %s, %s, %s)
                ''', (referred_by_id, new_user['id'], 50.00, 'signup_bonus'))
                
                cursor.execute('''
                    UPDATE users SET balance = balance + 50, referral_earnings = referral_earnings + 50
                    WHERE id = %s
                ''', (referred_by_id,))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_user), default=str),
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