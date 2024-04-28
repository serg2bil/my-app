import sqlite3 from 'sqlite3';

  const db = new sqlite3.Database(`pages\\api\\tasks.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error("Ошибка при подключении к базе данных:", err.message);
    }
  });

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, email TEXT, password TEXT)");
  });
  


  export default function handler(req, res) {


    function addUser(req, res) {
      const data = req.body;
  
      // Проверка существования пользователя
      db.get("SELECT id FROM users WHERE email = ?", [data.email], function(err, row) {
        if (err) {
          console.error("Error querying database:", err.message);
          res.status(500).json({ error: "Internal Server Error" });
        } else if (row) {
          // Пользователь с такой электронной почтой уже существует
          res.status(400).json({ error_m: "User with this email already exists" });
        } else {
          // Добавление нового пользователя
          db.run("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", [data.firstName, data.lastName, data.email, data.password], function(err) {
            if (err) {
              console.error("Error inserting data:", err.message);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              const userId = this.lastID; 
              res.status(200).json({ message: "Data inserted successfully", user_id: userId });
            }
          });
        }
      });
    }
  








 function getUser(req, res) {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
          console.error("Error querying data:", err.message);
          res.status(500).json({ error: "Internal Server Error" });
      } else {
          if (!row) {
            res.status(200).json({ login_massage: "User not found" });
            
          } else {
              // Пользователь найден, проверяем пароль
              if (row.password === password) {
                res.status(200).json({ user_id: row.id });
              } else {
                res.status(200).json({ login_massage: "Incorrect password or email" });
              }
          }
      }
  });
}

// Функция для получения пользователя по электронной почте
function getUserByEmail(email, callback) {
  const query = "SELECT * FROM users WHERE email = ?";
  db.get(query, [email], (err, row) => {
      if (err) {
          console.error("Ошибка при выполнении запроса:", err.message);
          callback(err, null);
      } else {
          callback(null, row); // Возвращаем пользователя (или null, если пользователь не найден)
      }
  });
}

















    switch (req.method) {
      

      case 'POST':
        
        if(req.query.q === 'login'){
          
          getUser(req, res);
        }else{
          addUser(req, res);
        }
        
       
        break;
    }
}