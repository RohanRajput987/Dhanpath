import sqlite3

conn = sqlite3.connect('dhanpath.db')
c = conn.cursor()

# Insert an admin/lender user
# The password needs to be hashed with bcrypt. 
# passlib.context with bcrypt creates a hash that starts with $2b$
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("password")

c.execute("INSERT INTO users (name, email, hashed_password, role) VALUES (?, ?, ?, ?)",
          ('Test Lender', 'lender@dhanpath.com', hashed_password, 'lender'))

conn.commit()
conn.close()
print("Database seeded with test lender user: lender@dhanpath.com / password")
