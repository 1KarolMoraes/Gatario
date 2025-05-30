from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Caminhos dos arquivos
USERS_FILE = 'users.txt'
DIARY_FILE = 'diary.txt'
MOOD_FILE = 'mood.txt'

def read_data(file_path):
    """Lê todos os registros de um arquivo, um JSON por linha"""
    if not os.path.exists(file_path):
        return []
    
    data = []
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line:  # Ignora linhas vazias
                try:
                    data.append(json.loads(line))
                except json.JSONDecodeError:
                    continue  # Ignora linhas com JSON inválido
    return data

def write_data(file_path, data):
    """Escreve um novo registro no arquivo, um JSON por linha"""
    with open(file_path, 'a') as file:
        file.write(json.dumps(data, ensure_ascii=False) + '\n')  # ensure_ascii=False para manter caracteres especiais

def update_data(file_path, username, new_data, key='username'):
    """Atualiza registros específicos mantendo um JSON por linha"""
    records = read_data(file_path)
    updated = False
    
    with open(file_path, 'w') as file:
        for record in records:
            if record.get(key) == username:
                record.update(new_data)
                updated = True
            file.write(json.dumps(record, ensure_ascii=False) + '\n')
    
    return updated

def overwrite_all_data(file_path, data_list):
    """Sobrescreve todo o arquivo com uma lista de registros"""
    with open(file_path, 'w') as file:
        for record in data_list:
            if isinstance(record, dict):
                file.write(json.dumps(record, ensure_ascii=False) + '\n')

# Rotas para usuários
@app.route('/api/users', methods=['GET'])
def get_users():
    users = read_data(USERS_FILE)
    return jsonify(users)

@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    users = read_data(USERS_FILE)
    user = next((u for u in users if u['username'] == username), None)
    return jsonify(user) if user else ('', 404)

@app.route('/api/users/create', methods=['POST'])
def create_user():
    new_user = request.json
    required_fields = ['username', 'email', 'password']
    
    if not all(field in new_user for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verifica se usuário já existe
    users = read_data(USERS_FILE)
    if any(u['email'] == new_user['email'] or u['username'] == new_user['username'] for u in users):
        return jsonify({'error': 'E-mail ou username já existem'}), 409
    
    write_data(USERS_FILE, new_user)
    return jsonify({'status': 'success', 'user': new_user}), 201

@app.route('/api/users/signin', methods=['POST'])
def post_user():
    user = request.json
    required_fields = ['email', 'password']

    if not all(field in user for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    users = read_data(USERS_FILE)
    user_found = next((u for u in users if u['email'] == user['email'] and u['password'] == user['password']), None)
    if user_found:
        return jsonify({'status': 'success', 'user': user_found}), 200
    
    return jsonify({'error': 'Email or password incorrects'}), 404

@app.route('/api/users/<username>', methods=['PUT'])
def update_user(username):
    users = read_data(USERS_FILE)
    user_data = request.json
    
    if not any(u['username'] == username for u in users):
        return jsonify({'error': 'User not found'}), 404
    
    if update_data(USERS_FILE, username, user_data):
        return jsonify({'status': 'success'})
    return jsonify({'error': 'Update failed'}), 500

# Rotas para o diário
@app.route('/api/diary', methods=['GET'])
def get_all_entries():
    entries = read_data(DIARY_FILE)
    return jsonify(entries)

@app.route('/api/diary/<username>', methods=['GET'])
def get_user_entries(username):
    entries = read_data(DIARY_FILE)
    user_entries = [e for e in entries if e['username'] == username]
    return jsonify(user_entries)

@app.route('/api/diary/create', methods=['POST'])
def add_entry():
    new_entry = request.json
    required_fields = ['username', 'date', 'hour', 'message']
    
    if not all(field in new_entry for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verifica se o usuário existe
    users = read_data(USERS_FILE)
    if not any(u['username'] == new_entry['username'] for u in users):
        return jsonify({'error': 'User not found'}), 404
    
    write_data(DIARY_FILE, new_entry)
    return jsonify({'status': 'success', 'entry': new_entry}), 201

@app.route('/api/diary/update', methods=['PUT'])
def update_entry():
    infos = request.json
    required_fields = ['username', 'date', 'hour', 'new_message']
    
    # Verifica campos obrigatórios
    if not all(field in infos for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Lê todos os registros
        all_entries = read_data(DIARY_FILE)
        updated = False
        
        # Prepara os dados atualizados
        username = infos['username']
        date = infos['date']
        hour = infos['hour']
        new_message = infos['new_message']
        
        # Atualiza as entradas que correspondem
        for entry in all_entries:
            if (entry.get('username') == username and 
                entry.get('date') == date and 
                entry.get('hour') == hour):
                entry['message'] = new_message
                updated = True
        
        now = datetime.now()
        formatted_date = now.strftime("%d/%m/%Y")
        formatted_hour = now.strftime("%H:%M:%S")

        # Se encontrou e atualizou, sobrescreve o arquivo
        if updated:
            overwrite_all_data(DIARY_FILE, all_entries)
            return jsonify({
                "message": "Entry updated successfully",
                "updated_entry": {
                    "username": username,
                    "date": formatted_date,
                    "hour": formatted_hour,
                    "message": new_message
                }
            }), 200
        else:
            return jsonify({"message": "No matching entry found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/diary/delete', methods=['DELETE'])
def delete_entries_by_hour_and_date():
    infos = request.json
    required_fields = ['username', 'date', 'hour']

    if not all(field in infos for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Lê todos os registros
        all_entries = read_data(DIARY_FILE)
        
        # Filtra as entradas que NÃO correspondem ao critério
        username = infos['username']
        date = infos['date']
        hour = infos['hour']
        updated_entries = [
            e for e in all_entries
            if not (e.get('username') == username and e.get('date') == date and e.get('hour') == hour)
        ]
        
        # Verifica se houve alteração
        if len(all_entries) == len(updated_entries):
            return jsonify({"message": "No entries found for deletion"}), 404
        
        # Sobrescreve o arquivo completo com os registros atualizados
        overwrite_all_data(DIARY_FILE, updated_entries)
        
        return jsonify({
            "message": f"Deleted entries for {username} on {date} - {hour}",
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Rotas para o humor

@app.route('/api/mood/<username>', methods=['GET'])
def get_mood_entries(username):
    entries = read_data(MOOD_FILE)
    mood_entries = [e for e in entries if e['username'] == username]
    return jsonify(mood_entries)

@app.route('/api/mood/create', methods=['POST'])
def add_mood():
    new_entry = request.json
    required_fields = ['username', 'date', 'image_url']
    
    if not all(field in new_entry for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verifica se o usuário existe
    users = read_data(USERS_FILE)
    if not any(u['username'] == new_entry['username'] for u in users):
        return jsonify({'error': 'User not found'}), 404
    
    moods = read_data(MOOD_FILE)
    if any(m['username'] == new_entry['username'] and m['date'] == new_entry['date'] for m in moods):
        all_entries = read_data(MOOD_FILE)
        updated = False
        
        # Prepara os dados atualizados
        username = new_entry['username']
        date = new_entry['date']
        new_image_url = new_entry['image_url']
        
        # Atualiza as entradas que correspondem
        for entry in all_entries:
            if (entry.get('username') == username and 
                entry.get('date') == date):
                entry['image_url'] = new_image_url
                updated = True
        
        now = datetime.now()
        formatted_date = now.strftime("%d/%m/%Y")

        # Se encontrou e atualizou, sobrescreve o arquivo
        if updated:
            overwrite_all_data(MOOD_FILE, all_entries)
            return jsonify({
                "message": "Entry updated successfully",
                "updated_entry": {
                    "username": username,
                    "date": formatted_date,
                    "image_url": new_image_url,
                }
            }), 200
    
    write_data(MOOD_FILE, new_entry)
    return jsonify({'status': 'success', 'entry': new_entry}), 201

if __name__ == '__main__':
    # Cria arquivos se não existirem
    if not os.path.exists(USERS_FILE):
        open(USERS_FILE, 'w').close()
    if not os.path.exists(DIARY_FILE):
        open(DIARY_FILE, 'w').close()
    
    app.run(host='0.0.0.0', port=5000, debug=True)