const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Вставьте здесь ваш токен бота
const token = '5787512427:AAHNNjFr8PrznIXtUSSEQYSxiQrWzjbik9g';
const N = 3; //Число задач
const M = 30; //Число анекдотов
// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });
let flag = 0;
let cmp_ans = '';
let randomNumber = 0;
bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'}
    //{command: '/info', description: 'Информация о боте'},
    //{command: '/more', description: 'Список проектов'},
])

const buttons = [
  [{ text: 'Анекдот', callback_data: 'button1' }],
  [{ text: 'Рандомная задача', callback_data: 'button2' }],
  [{ text: 'Каталог задач (всего '+N+' задач)', callback_data: 'button3' }]
];

const buttons1 = [
  [{ text: 'Дай ответ, я слабачок', callback_data: 'button4' }]
];

async function getAnek(mes, chId) {
  const filePath = `/mnt/c/prak/data/anek${mes}.txt`;

  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    await bot.sendMessage(chId, data);
    flag = 0;
  } catch (error) {
    console.log(error);
    await bot.sendMessage(chId, 'Ошибка при чтении файла.');
  }
}



async function getTask(mes, chId) {
  try {
    const filePath = `/mnt/c/prak/data/${mes}.txt`;
    const ansPath = `/mnt/c/prak/data/${mes}_ans.txt`;

    const data = await fs.promises.readFile(filePath, 'utf-8');
    await bot.sendMessage(chId, data);

    await bot.sendMessage(chId, 'Твой ответ: ', {
      reply_markup: {
        inline_keyboard: buttons1,
        one_time_keyboard: true,
      },
    });

    cmp_ans = await fs.promises.readFile(ansPath, 'utf-8');
    flag = 2;
  } catch (err) {
    console.log(err);
    bot.sendMessage(chId, 'Ошибка при чтении файла.');
  }
}

  
// Функция-обработчик нажатия на кнопку
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const buttonId = query.data;

  try {
    switch (buttonId) {
      case 'button1':
        flag = 3;
        randomNumber = Math.floor(Math.random() * M) + 1;
        await bot.sendMessage(chatId, 'Лови анекдот ' + randomNumber);
        await getAnek(randomNumber, chatId);
        await bot.sendMessage(chatId, 'Выберите действие:', {
          reply_markup: {
            inline_keyboard: buttons,
            one_time_keyboard: true,
          },
        });
        break;
      case 'button2':
        flag = 2;
        randomNumber = Math.floor(Math.random() * N) + 1;
        await bot.sendMessage(chatId, 'Рандомная задача ' + randomNumber);
        await getTask(randomNumber, chatId);
        break;
      case 'button3':
        flag = 1;
        await bot.sendMessage(chatId, 'Введите номер задачи');
        break;
      case 'button4':
        bot.sendMessage(chatId, cmp_ans);
        await bot.sendMessage(chatId, 'Выберите действие:', {
          reply_markup: {
            inline_keyboard: buttons,
            one_time_keyboard: true,
          },
        });
        flag = 0;
        break;
    }
  } catch (error) {
    console.error(error);
    // Обработка ошибок
  }
});




  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
  
    // Отправляем сообщение с кнопками
    bot.sendMessage(chatId, 'Выберите действие:', {
      reply_markup: {
        inline_keyboard: buttons,
        one_time_keyboard: true, // Отображать клавиатуру только один раз
      },
    });
  });
  
  // Обработчик нажатия кнопок
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    // Проверяем, является ли введенное значение числом
    if (flag==2){
      if (messageText == 'Дай ответ, я слабачок'){
        bot.sendMessage(chatId, cmp_ans, {
          reply_markup: {
            inline_keyboard: buttons,
            one_time_keyboard: true, // Отображать клавиатуру только один раз
          },
        });
        flag = 0;
      }else
      if(cmp_ans==messageText){
        bot.sendMessage(chatId, 'Верно!', {
          reply_markup: {
            inline_keyboard: buttons,
            one_time_keyboard: true, // Отображать клавиатуру только один раз
          },
      });
        flag = 0;
    } else {
      bot.sendMessage(chatId, 'Неверно! Давай ещё разок', {
        reply_markup: {
          inline_keyboard: buttons1,
          one_time_keyboard: true, // Отображать клавиатуру только один раз
        },
      });
    } }
    else{
    if ((!isNaN(messageText))&&(flag==1)) {
        getTask(messageText, chatId);
    }else  {
    switch (messageText) {
        case 'Aнекдот':
          // Выполняем действия для кнопки 1
          flag = 3;
          randomNumber = Math.floor(Math.random() * M) + 1; // Генерируем случайное число от 1 до N
          bot.sendMessage(chatId, 'Лови анекдот '+randomNumber);
          getTask(randomNumber, chatId);
          break;
        case 'Рандомная задача':
          // Выполняем действия для кнопки 2
          randomNumber = Math.floor(Math.random() * N) + 1; // Генерируем случайное число от 1 до N
          bot.sendMessage(chatId, 'Рандомная задача '+randomNumber);
          getTask(randomNumber, chatId);
          flag = 2;
          break;
        case 'Каталог задач (всего '+N+' задач)':
          // Выполняем действия для кнопки 3
          flag = 1;
          // Получаем число от пользователя
          bot.sendMessage(chatId, 'Введите номер задачи');
          break;
        case '/start':
          break;
        case '/info':
          break;
        case '/':
          break;
        default:
            // Ответ на другие сообщения
            bot.sendMessage(chatId, 'Неизвестная команда');
            break;
    }
}
 } });

  
  
  
  
  
  
  