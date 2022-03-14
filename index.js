const {Telegraf, Markup, Scenes, session} = require("telegraf");
require('dotenv').config();
const text = require('./const');
const vacancyScene = require('./scenes/vacancy.js'),
      resumeScene = require('./scenes/resume.js'),
      servicesScene = require('./scenes/services.js'),
      propertyScene = require('./scenes/property.js'),
      studiosScene = require('./scenes/studios.js'),
      roomsScene = require('./scenes/rooms.js');

const bot = new Telegraf(process.env.BOT_TOKEN, {polling: true});

const stage = new Scenes.Stage(
    [
    vacancyScene, resumeScene,
    servicesScene,
    propertyScene,
    studiosScene,
    roomsScene,
    ]);
bot.use(session());
bot.use(stage.middleware());


bot.command( '/start', async ctx => {
    try {
        await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
            [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
            [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
            [Markup.button.callback('Поддержка', 'btn3')]
        ]).oneTime().resize());
    } catch (e) {
        console.log(e);
    }
});

//Подать объявление
bot.hears('\u{1F4E2}Подать объявление\u{1F4E2}', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Работа", 'work_btn'), Markup.button.callback("Недвижимость", 'property_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

// Работа
bot.hears('Работа', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Вакансии", 'vacancy_btn'), Markup.button.callback(`Резюме`, 'resume_btn'), Markup.button.callback(`Услуги`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

// Недвижемость
bot.hears('Недвижимость', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("На длительный срок", 'vacancy_btn'), Markup.button.callback(`Посуточно`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

bot.hears('На длительный срок', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Квартиры", 'vacancy_btn'), Markup.button.callback(`Комнаты`, 'resume_btn'), Markup.button.callback(`Студии`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

bot.hears('Посуточно', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Квартиры", 'vacancy_btn'), Markup.button.callback(`Комнаты`, 'resume_btn'), Markup.button.callback(`Студии`, 'resume_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

// Недвижемость
bot.hears('Студии', ctx => {
    ctx.scene.enter('studiosWizard');
});

bot.hears('Квартиры', ctx => {
    ctx.scene.enter('propertyWizard');
});

bot.hears('Комнаты', ctx => {
    ctx.scene.enter('roomsWizard');
});

bot.hears('Другое', ctx => {
    ctx.scene.enter('propertyWizard');
});

bot.hears('Вакансии', ctx => {
    ctx.scene.enter('vacancyWizard');
});

bot.hears('Резюме', ctx => {
    ctx.scene.enter('resumeWizard');
});

bot.hears('Услуги', ctx => {
    ctx.scene.enter('servicesWizard');
});


//******************************************КАНАЛ С ОБЪЯВЛЕНИЯМИ**************************************************
bot.hears('\u{1F4E2}Канал с объявлениями\u{1F4E2}', async ctx => {
    try {
            await ctx.reply('Вы можете перейти на канал\nс объявления по ссылке ниже', Markup.inlineKeyboard([
        [Markup.button.url('Перейти на канал', 'https://t.me/+5V71SFuwpfMzZTIy')]
    ]));
    } catch (e) {
        console.log(e);
    }
});

//******************************************ПОДДЕРЖКА**************************************************
bot.hears('Поддержка', async ctx => {
    try {
            await ctx.reply('Вы можете обратиться к администратору\nпо ссылке ниже', Markup.inlineKeyboard([
        [Markup.button.url('Написать администратору', 'https://t.me/muhammad_israfilov')]
    ]));
    } catch (e) {
        console.log(e);
    }
});

//******************************************НАЗАД**************************************************
bot.on('text', async ctx => {
    try {
        if (ctx.message.text === '\u{2B05}Назад') {
            await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
                [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
                [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
                [Markup.button.callback('Поддержка', 'btn3')]
            ]).oneTime().resize());
        }
    } catch (e) {
        console.log(e);
    }
});

bot.help((ctx) => ctx.reply(text.commands));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));