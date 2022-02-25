const TelegramApi = require('telegraf')
const {Telegraf, Markup, Scenes, session} = require("telegraf");
require('dotenv').config()
const text = require('./const')
const vacancyScene = require('./scenes/vacancy.js')

const resumeScene = require('./scenes/resume.js')

const servicesScene = require('./scenes/services.js')

const electronicsScene = require('./scenes/electronics.js')
const phonesScene = require('./scenes/electronics/phones.js')

const appliancesScene = require('./scenes/appliances.js')

const autoScene = require('./scenes/auto.js')

const specialScene = require('./scenes/special.js')

const propertyScene = require('./scenes/property.js')


const bot = new Telegraf(process.env.BOT_TOKEN, {polling: true})

const stage = new Scenes.Stage([electronicsScene, phonesScene, vacancyScene, resumeScene, servicesScene, appliancesScene, autoScene, specialScene, propertyScene])
bot.use(session())
bot.use(stage.middleware())


// bot.on("message", async (ctx) => {
//     const messageID = ctx.message.message_id;
//   await ctx.copyMessage(messageID, 'dfg');
// });

bot.command( '/start', async ctx => {
    try {
        await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
        [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
        [Markup.button.callback('Поддержка', 'btn3')]
    ]).oneTime().resize())
    } catch (e) {
        console.log(e)
    }
})

//******************************************ОБЪЯВЛЕНИЯ**************************************************

// bot.hears('\u{1F4F1}Электроника', async ctx => {
//     await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
//         [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
//         [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
//         [Markup.button.callback('Поддержка', 'btn3')]
//         ]).oneTime().resize())
// })

// bot.hears('\u{1F4E2}Подать объявление\u{1F4E2}', async ctx => {
//     await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
//         [Markup.button.callback("\u{1F4F1}Телефоны", 'phones_btn'), Markup.button.callback(`\u{1F4BB}Ноутбуки`, 'laptops_btn'),Markup.button.callback('\u{1F69B}Настольные компьютеры', 'computers_btn')],
//         [Markup.button.callback('Пристаки, Игры', 'games_btn'), Markup.button.callback("Фототехника", 'photos_btn'), Markup.button.callback("Прочее", 'other_btn')],
//         [Markup.button.callback("\u{2B05}Нaзад", 'vacancy_btn')]
//     ]).oneTime().resize())
// })

bot.hears('\u{1F4E2}Подать объявление\u{1F4E2}', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("\u{1F4F1}Электроника", 'electronics_btn'), Markup.button.callback(`\u{1F4BB}Бытовая техника`, 'appliances_btn'),Markup.button.callback('\u{1F69B}Спецтехника', 'special_btn')],
        [Markup.button.callback('\u{1F698}Авто', 'auto_btn'),Markup.button.callback('\u{1F468}\u{1F527}Ремонт под ключ', 'repair_btn'), Markup.button.callback("\u{1F3E1}Недвижимость", 'property_btn')],
        [Markup.button.callback("\u{2705}Вакансии", 'vacancy_btn'), Markup.button.callback('\u{2705}Резюме', 'resume_btn'), Markup.button.callback('\u{2705}Услуги', 'services_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'vacancy_btn')]
    ]).oneTime().resize())
})

bot.hears('\u{1F4F1}Электроника', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("\u{1F4F1}Телефоны", 'phones_btn'), Markup.button.callback(`\u{1F4BB}Ноутбуки`, 'laptops_btn'),Markup.button.callback('\u{1F69B}Настольные компьютеры', 'computers_btn')],
        [Markup.button.callback('Пристаки, Игры', 'games_btn'), Markup.button.callback("Фототехника", 'photos_btn'), Markup.button.callback("Прочее", 'other_btn')],
        [Markup.button.callback("\u{2B05}Нaзад", 'vacancy_btn')]
    ]).oneTime().resize())
})

// Электроника
// bot.hears('\u{1F4F1}Прочее', ctx => {
//     ctx.scene.enter('electronicsWizard')
// })
bot.hears('\u{1F4F1}Телефоны', ctx => {
    ctx.scene.enter('phonesWizard')
})

bot.hears('\u{1F4BB}Бытовая техника', ctx => {
    ctx.scene.enter('appliancesWizard')
})

bot.hears('\u{1F69B}Спецтехника', ctx => {
    ctx.scene.enter('specialWizard')
})

bot.hears('\u{1F698}Авто', ctx => {
    ctx.scene.enter('autoWizard')
})

bot.hears('\u{1F3E1}Недвижимость', ctx => {
    ctx.scene.enter('propertyWizard')
})

bot.hears('\u{2705}Вакансии', ctx => {
    ctx.scene.enter('vacancyWizard')
})

bot.hears('\u{2705}Резюме', ctx => {
    ctx.scene.enter('resumeWizard')
})

bot.hears('\u{2705}Услуги', ctx => {
    ctx.scene.enter('servicesWizard')
})




//******************************************КАНАЛ С ОБЪЯВЛЕНИЯМИ**************************************************
bot.hears('\u{1F4E2}Канал с объявлениями\u{1F4E2}', async ctx => {
    try {
            await ctx.reply('Вы можете перейти на канал\nс объявления по ссылке ниже', Markup.inlineKeyboard([
        [Markup.button.url('Перейти на канал', 'https://t.me/+5V71SFuwpfMzZTIy')]
    ]))
    } catch (e) {
        console.log(e)
    }
})

// bot.hears('\u{2B05}Назад', async ctx => {
//     await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
//         [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
//         [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
//         [Markup.button.callback('Поддержка', 'btn3')]
//         ]).oneTime().resize())
// })

bot.on('photo', async ctx => {
    const photo = ctx.message
    await ctx.copyMessage(1954192936, photo);
    console.log(photo)
})

bot.on('text', async ctx => {
    try {
        if (ctx.message.text === '\u{2B05}Назад') {
            await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
                [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
                [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
                [Markup.button.callback('Поддержка', 'btn3')]
            ]).oneTime().resize())
        }
        if (ctx.message.text === '\u{2B05}Нaзад') {
            await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
                [Markup.button.callback("\u{1F4F1}Электроника", 'electronics_btn'), Markup.button.callback(`\u{1F4BB}Бытовая техника`, 'appliances_btn'),Markup.button.callback('\u{1F69B}Спецтехника', 'special_btn')],
                [Markup.button.callback('\u{1F698}Авто', 'auto_btn'),Markup.button.callback('\u{1F468}\u{1F527}Ремонт под ключ', 'repair_btn'), Markup.button.callback("\u{1F3E1}Недвижимость", 'property_btn')],
                [Markup.button.callback("\u{2705}Вакансии", 'vacancy_btn'), Markup.button.callback('\u{2705}Резюме', 'resume_btn'), Markup.button.callback('\u{2705}Услуги', 'services_btn')],
                [Markup.button.callback("\u{2B05}Назад", 'vacancy_btn')]
            ]).oneTime().resize())
        }
    } catch (e) {
        console.log(e)
    }
})

bot.help((ctx) => ctx.reply(text.commands))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
// const chats = {}
//
// const gameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: 'Текст кнопки', callback_data: 'dsf'}],
//             [{text: 'Текст кнопки', callback_data: 'dsf'}],
//             [{text: 'Текст кнопки', callback_data: 'dsf'}],
//             [{text: 'Текст кнопки', callback_data: 'dsf'}],
//             [{text: 'Текст кнопки', callback_data: 'dsf'}]
//
//         ]
//     })
// }
//


//
// bot.on('message',  async msg => {
//     const text = msg.text;
//     const chatId = msg.chat.id;
//     if (text === '/start') {
//         await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
//         return bot.sendMessage(chatId, `Ассаламу алейкум, вас приветствует бот объявлений SERULEB. \n\nРеклама абсолютно бесплатная. Если у вас есть объявления, мы можем выложить его к себе на instagram. От вас требуется только текст с описанием и номер телефона`)
//     }
//     if (text === '/info') {
//         return bot.sendMessage(chatId, `Здравствуйте ${msg.from.first_name} ${msg.from.last_name}`)
//     }
//     if (text === '/game') {
//         await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты должен угадать`)
//         const randomNumber = Math.floor(Math.random() * 10)
//         chats[chatId] = randomNumber
//         return bot.sendMessage(chatId, 'Отгадай', gameOptions);
//     }
//     return bot.sendMessage(chatId, 'Я тебя не монимаю, попробуй еще раз!');
//
//
// })
// }
//
// start()

