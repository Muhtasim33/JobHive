import smtplib
from email.mime.text import MIMEText
import os

def send_verification_email(to_email, code):
    subject = "Verify your JobHive account"
    body = f"""Hi there,

Your verification code is: {code}

Enter it in the app to complete your registration.

– JobHive Team"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = os.environ["EMAIL_FROM"]
    msg["To"] = to_email

    try:
        with smtplib.SMTP(os.environ["EMAIL_HOST"], int(os.environ["EMAIL_PORT"])) as server:
            server.starttls()
            server.login(os.environ["EMAIL_USER"], os.environ["EMAIL_PASS"])
            server.send_message(msg)
        print("✅ Email sent to", to_email)
    except Exception as e:
        print("❌ Failed to send email:", e)



def send_reset_email(to_email, code):
    subject = "Reset Your JobHive Password"
    body = f"Your password reset code is: {code}\n\nIf you didn’t request this, just ignore this email."

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = os.environ.get("EMAIL_FROM")
    msg["To"] = to_email

    with smtplib.SMTP(os.environ.get("EMAIL_HOST"), int(os.environ.get("EMAIL_PORT"))) as server:
        server.starttls()
        server.login(os.environ.get("EMAIL_USER"), os.environ.get("EMAIL_PASS"))
        server.sendmail(msg["From"], [msg["To"]], msg.as_string())
