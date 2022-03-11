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

const sparesScene = require('./scenes/spares.js')

const animalsScene = require('./scenes/animals.js')

const hobbyScene = require('./scenes/hobby.js')



const bot = new Telegraf(process.env.BOT_TOKEN, {polling: true})

const stage = new Scenes.Stage(
    [
    electronicsScene,
    vacancyScene, resumeScene,
    servicesScene,
    appliancesScene,
    autoScene,
    specialScene,
    propertyScene,
    sparesScene,
    animalsScene,
    hobbyScene
    ])
bot.use(session())
bot.use(stage.middleware())


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

// bot.setMyCommands( [
//     {command: '/start', description: 'Начальное приветствие'}
// ])

//******************************************ОБЪЯВЛЕНИЯ**************************************************

bot.hears('\u{1F4E2}Подать объявление\u{1F4E2}', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Электроника", 'electronics_btn'), Markup.button.callback(`Хобби и отдых`, 'appliances_btn'),Markup.button.callback('Транспорт', 'special_btn')],
        [Markup.button.callback('Для дома и дачи', 'home_btn'), Markup.button.callback("Недвижимость", 'property_btn'), Markup.button.callback("Запчасти и аксессуары", 'property_btn')],
        [Markup.button.callback("Работа", 'work_btn'), Markup.button.callback('Услуги', 'services_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

// Транспорт
// bot.hears('Транспорт', async ctx => {
//     await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
//         [Markup.button.callback('\u{1F69B}Спецтехника', 'special_btn'), Markup.button.callback('\u{1F698}Авто', 'auto_btn')],
//         [Markup.button.callback("\u{2B05}Нaзад", 'back_btn')]
//     ]).oneTime().resize())
// })

// Работа
bot.hears('Работа', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Вакансии", 'vacancy_btn'), Markup.button.callback(`Резюме`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

// Недвижемость
// bot.hears('Недвижимость', async ctx => {
//     await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
//         [Markup.button.callback("Квартиры", 'vacancy_btn'), Markup.button.callback(`Комнаты`, 'resume_btn'), Markup.button.callback(`Другое`, 'resume_btn')],
//         [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
//     ]).oneTime().resize())
// })


// Электроника
bot.hears('Электроника', ctx => {
    ctx.scene.enter('electronicsWizard')
})
bot.hears('Транспорт', ctx => {
    ctx.scene.enter('specialWizard')
})

bot.hears('Хобби и отдых', ctx => {
    ctx.scene.enter('hobbyWizard')
})

bot.hears('Животные', ctx => {
    ctx.scene.enter('animalsWizard')
})

bot.hears('Для дома и дачи', ctx => {
    ctx.scene.enter('appliancesWizard')
})

bot.hears('Запчасти и аксессуары', ctx => {
    ctx.scene.enter('sparesWizard')
})

// bot.hears('\u{1F69B}Спецтехника', ctx => {
//     ctx.scene.enter('specialWizard')
// })

// bot.hears('Авто', ctx => {
//     ctx.scene.enter('autoWizard')
// })

// Недвижемость
bot.hears('Недвижимость', ctx => {
    ctx.scene.enter('propertyWizard')
})

bot.hears('Квартиры', ctx => {
    ctx.scene.enter('propertyWizard')
})

bot.hears('Комнаты', ctx => {
    ctx.scene.enter('propertyWizard')
})

bot.hears('Другое', ctx => {
    ctx.scene.enter('propertyWizard')
})

bot.hears('Вакансии', ctx => {
    ctx.scene.enter('vacancyWizard')
})

bot.hears('Резюме', ctx => {
    ctx.scene.enter('resumeWizard')
})

bot.hears('Услуги', ctx => {
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

bot.hears('Поддержка', async ctx => {
    try {
            await ctx.reply('Вы можете обратиться к администратору\nпо ссылке ниже', Markup.inlineKeyboard([
        [Markup.button.url('Написать администратору', 'https://t.me/muhammad_israfilov')]
    ]))
    } catch (e) {
        console.log(e)
    }
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
            [Markup.button.callback("\u{1F4F1}Электроника", 'electronics_btn'), Markup.button.callback(`\u{1F4BB}Бытовая техника`, 'appliances_btn'),Markup.button.callback('Транспорт', 'special_btn')],
            [Markup.button.callback('\u{1F468}\u{1F527}Ремонт под ключ', 'repair_btn'), Markup.button.callback("\u{1F3E1}Недвижимость", 'property_btn')],
            [Markup.button.callback("Работа", 'work_btn'), Markup.button.callback('\u{2705}Услуги', 'services_btn')],
            [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
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

