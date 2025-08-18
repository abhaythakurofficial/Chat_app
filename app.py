from flask import Flask, render_template, request, redirect
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tamanna&abhay_chat_app'   # Needed for sessions
socketio = SocketIO(app)

# A basic event: listen for "message" events
@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    send(msg, broadcast=True)   # Send to all connected clients

@app.route('/')
def index():
    return render_template('index.html')   # Simple page with JS

@app.route('/home',methods=['GET','POST'])
def home():
    if request.method == 'POST':
        name = request.form.get('name')
        
    return render_template('home.html', name=name)   # Simple page with JS

if __name__ == '__main__':
    socketio.run(app, debug=True)
