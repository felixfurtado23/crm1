from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import os

app = Flask(__name__)
CORS(app)

# Email config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'limarasha4@gmail.com'
app.config['MAIL_PASSWORD'] = 'chpt wson wowm ccfr'
app.config['MAIL_DEFAULT_SENDER'] = 'limarasha4@gmail.com'  # ADD THIS LINE

mail = Mail(app)

@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        data = request.get_json()
        print("📝 Received:", data)
        
        # Validate
        if not all([data.get('name'), data.get('company'), data.get('email'), data.get('phone')]):
            print("❌ Missing required fields")
            return jsonify({'success': False, 'message': 'All fields required'})
        
        print("✅ Validation passed")
        
        # Send email to admin
        try:
            msg = Message(
                subject=f"New Early Access: {data['name']}",
                recipients=['felixfurtado809@gmail.com'],
                body=f"""
Name: {data['name']}
Company: {data['company']}
Email: {data['email']}
Phone: {data['phone']}
Message: {data.get('message', 'No message')}
                """
            )
            print("📧 Attempting to send email...")
            mail.send(msg)
            print("✅ Email sent successfully to admin")
            
        except Exception as email_error:
            print(f"❌ Email error: {str(email_error)}")
            return jsonify({'success': False, 'message': f'Email failed: {str(email_error)}'})
        
        return jsonify({'success': True, 'message': 'Thank you! We received your request.'})
        
    except Exception as e:
        print(f"💥 Server error: {str(e)}")
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'})

if __name__ == '__main__':
    print("🚀 Starting server...")
    app.run(debug=True, host='localhost', port=5000)