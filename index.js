const TelegramApi = require('telegraf')
const {Telegraf, Markup, Scenes, session} = require("telegraf");
require('dotenv').config()
const text = require('./const')

const vacancyScene = require('./scenes/vacancy.js')

const resumeScene = require('./scenes/resume.js')

const servicesScene = require('./scenes/services.js')

const propertyScene = require('./scenes/property.js')

const studiosScene = require('./scenes/studios.js')

const roomsScene = require('./scenes/rooms.js')

const bot = new Telegraf(process.env.BOT_TOKEN, {polling: true})

const stage = new Scenes.Stage(
    [
    vacancyScene, resumeScene,
    servicesScene,
    propertyScene,
    studiosScene,
    roomsScene,
    ])
bot.use(session())
bot.use(stage.middleware())

// bot.start( async ctx => DATABASE.sync())

// bot.setMyCommands( [
//     {command: '/start', description: 'Начальное приветствие'}
// ])

const photos = {}

bot.command( '/start', async ctx => {
    try {
        // await sequelize.authenticate()
        // await sequelize.sync()

        // let cities = ['scenes/res/1.jpg', 'scenes/res/2.jpg', 'scenes/res/3.jpg', 'scenes/res/4.jpg'];

        // let result = cities.map(city => {
        //     return {
        //         type: 'photo',
        //         media: {
        //             source: city
        //         }
        //     }
        // })
        // console.log(result)
        // await bot.telegram.sendMediaGroup(ctx.chat.id, result)

        // photos[ctx.from.id] = []
        // ctx.reply('Please, send me from 2 to 10 photos.\n'+'Send /done to create album or /cancel to abort operation')


        await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
        [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
        [Markup.button.callback('Поддержка', 'btn3')]
    ]).oneTime().resize())
    } catch (e) {
        console.log(e)
    }
})

// bot.command('/cancel', (ctx) => photos[ctx.from.id] = [])

// bot.command('/done', (ctx) => {
//     ctx.reply('Спасибо')
//     if (photos[ctx.from.id].length < 2 || photos[ctx.from.id].length > 10) return
//     done(ctx)
//   })

// bot.on('photo', (ctx) => {
//     const lastPhoto = ctx.message.photo.length - 1
//     photos[ctx.from.id] = photos[ctx.from.id] || []
//     photos[ctx.from.id].push({type: 'photo', media: ctx.message.photo[lastPhoto].file_id})
//     if (photos[ctx.from.id].length >= 10) {
//         done(ctx)
//     }
// })

// function done(ctx) {
//     ctx.replyWithMediaGroup(photos[ctx.from.id])
//     ctx.telegram.sendMediaGroup(1954192936, photos[ctx.from.id])
//     console.log(photos[ctx.from.id])
//     photos[ctx.from.id] = []
//   }

// bot.setMyCommands( [
//     {command: '/start', description: 'Начальное приветствие'}
// ])

//******************************************ОБЪЯВЛЕНИЯ**************************************************



// Транспорт
bot.hears('Транспорт', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback('\u{1F69B}Спецтехника', 'special_btn'), Markup.button.callback('\u{1F698}Авто', 'auto_btn')],
        [Markup.button.callback("\u{2B05}Нaзад", 'back_btn')]
    ]).oneTime().resize())
})

bot.hears('\u{1F4E2}Подать объявление\u{1F4E2}', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Работа", 'work_btn'), Markup.button.callback("Недвижимость", 'property_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

// Работа
bot.hears('Работа', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Вакансии", 'vacancy_btn'), Markup.button.callback(`Резюме`, 'resume_btn'), Markup.button.callback(`Услуги`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

// Недвижемость

bot.hears('Недвижимость', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("На длительный срок", 'vacancy_btn'), Markup.button.callback(`Посуточно`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

bot.hears('На длительный срок', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Квартиры", 'vacancy_btn'), Markup.button.callback(`Комнаты`, 'resume_btn'), Markup.button.callback(`Студии`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

bot.hears('Посуточно', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Квартиры", 'vacancy_btn'), Markup.button.callback(`Комнаты`, 'resume_btn'), Markup.button.callback(`Студии`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize())
})

// Недвижемость
bot.hears('Студии', ctx => {
    ctx.scene.enter('studiosWizard')
})

bot.hears('Квартиры', ctx => {
    ctx.scene.enter('propertyWizard')
})

bot.hears('Комнаты', ctx => {
    ctx.scene.enter('roomsWizard')
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
    } catch (e) {
        console.log(e)
    }
})

bot.help((ctx) => ctx.reply(text.commands))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = bot;