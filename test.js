const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
//const cheerio = require('cheerio');
// Токен вашего бота
const botToken = '5787512427:AAHNNjFr8PrznIXtUSSEQYSxiQrWzjbik9g';

// Создаем экземпляр бота
const bot = new TelegramBot(botToken, { polling: true });



getTasks()
  .then((tasks) => {
    console.log(tasks);
    bot.sendMessage(chatId, 'Жестко проанализировал задачку и спрашиваю её у тебя', options);
  });



// Расписание для отправки задач каждые 24 часа
const job = schedule.scheduleJob('0 0 */24 * * *', async () => {
  try {
    // Получаем задачи с сайта решуЕГЭ
    const response = await axios.get('https://example.com/tasks');
    const tasks = response.data.tasks;

    // Отправляем каждую задачу пользователю
    tasks.forEach((task) => {
      bot.sendMessage(chatId, task);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
});

// Обработчик команды /start
// Обработчик нажатия на кнопку
;
  });
  
  // Обработчик нажатия на кнопку
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    bot.sendMessage(chatId, '${data}');
    // Выполняем функцию getTasks()
    const tasks = await getTasks();
  
      // Отправляем задачи в чат
      /*
      tasks.forEach((task) => {
        bot.sendMessage(chatId, task);
      });
      */
    }
  )
