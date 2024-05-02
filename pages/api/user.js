import { createPool } from '@vercel/postgres';

// Создайте пул клиентов для подключения к базе данных PostgreSQL
const pool = createPool({
    connectionString: process.env.POSTGRES_URL // Укажите свою строку подключения
});

// Оберните в try-catch для обработки возможных ошибок
export default async function handler(req, res) {
    // Проверяем метод запроса
    switch (req.method) {
        case 'POST':
            if (req.query.q === 'login') {
                // Обработка запроса для входа пользователя
                await loginUser(req, res);
            } else {
                // Обработка запроса для добавления нового пользователя
                await addUser(req, res);
            }
            break;
    }
}

async function addUser(req, res) {
    const data = req.body;

    try {
        // Проверяем существует ли пользователь с такой же почтой
        const existingUser = await getUserByEmail(data.email);

        if (existingUser) {
            res.status(400).json({ login_massage: "User with this email already exists" });
        } else {
            // Добавляем нового пользователя
            const newUser = await createUser(data);
            res.status(200).json({ message: "User created successfully", user_id: newUser.id });
        }
    } catch (error) {
        console.error("Error adding user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Получаем пользователя по электронной почте
        const user = await getUserByEmail(email);

        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            // Проверяем пароль
            if (user.password === password) {
                res.status(200).json({ user_id: user.id });
            } else {
                res.status(401).json({ error: "Incorrect password or email" });
            }
        }
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getUserByEmail(email) {
    try {
        // Выполняем запрос к базе данных для получения пользователя по электронной почте
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0]; // Возвращаем первого пользователя, если он найден
    } catch (error) {
        console.error("Error querying database:", error.message);
        throw error;
    }
}

async function createUser(userData) {
    try {
        // Выполняем запрос к базе данных для добавления нового пользователя
        const result = await pool.query(`
            INSERT INTO users (first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `, [userData.firstName, userData.lastName, userData.email, userData.password]);
        return result.rows[0]; // Возвращаем только что созданного пользователя
    } catch (error) {
        console.error("Error inserting data:", error.message);
        throw error;
    }
}
