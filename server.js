const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

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
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    if (data[userId]) {
      res.json(data[userId]);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Сохранение данных пользователя
app.post('/api/user/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    data[userId] = userData;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    res.json({ message: 'Данные успешно сохранены' });
  } catch (error) {
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