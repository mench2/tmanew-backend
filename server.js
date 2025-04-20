const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://tmanew-tg-frontend.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Путь к файлу с данными
const dataFilePath = path.join(__dirname, 'userData.json');

// Создаем файл, если он не существует
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({}));
}

// Получение данных пользователя
app.get('/api/user/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Получен запрос на чтение данных пользователя:', userId);
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    if (data[userId]) {
      console.log('Отправка данных:', data[userId]);
      res.json(data[userId]);
    } else {
      console.log('Пользователь не найден');
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Сохранение данных пользователя
app.post('/api/user/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    console.log('Получен запрос на сохранение данных:', { userId, userData });
    
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    data[userId] = userData;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Данные успешно сохранены');
    
    res.json({ message: 'Данные успешно сохранены' });
  } catch (error) {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 