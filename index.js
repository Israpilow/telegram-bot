const {
    Telegraf,
    Markup,
    Scenes,
    session
} = require("telegraf");
require('dotenv').config();
const vacancyScene = require('./scenes/vacancy.js'),
    resumeScene = require('./scenes/resume.js'),
    servicesScene = require('./scenes/services.js'),
    propertyScene = require('./scenes/property.js'),
    studiosScene = require('./scenes/studios.js'),
    roomsScene = require('./scenes/rooms.js'),
    transportScene = require('./scenes/transport.js'),
    electronicsScene = require('./scenes/electronics.js');

// Bot
const bot = new Telegraf(process.env.BOT_TOKEN, {
    polling: true
});

// Scenes
const stage = new Scenes.Stage(
    [
        vacancyScene, resumeScene,
        servicesScene,
        propertyScene,
        studiosScene,
        roomsScene,
        transportScene,
        electronicsScene
    ]);
bot.use(session());
bot.use(stage.middleware());


// Транспорт
// Электроника

// Start
bot.command('/start', async ctx => {
    try {
        await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
            [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
            [Markup.button.callback('\u{1F4E2}Посмотреть все объявления\u{1F4E2}', 'btn2')],
            [Markup.button.callback('Написать админу', 'btn3')]
        ]).oneTime().resize());
    } catch (e) {
        console.log(e);
    }
});

//Подать объявление
bot.hears('\u{1F4E2}Подать объявление\u{1F4E2}', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Работа", 'work_btn'), Markup.button.callback("Недвижимость", 'property_btn')],
        [Markup.button.callback("Транспорт", 'transport_btn'), Markup.button.callback("Электроника", 'electronics_btn')],
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

// Транспорт
bot.hears('Транспорт', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Автомобили", 'avto_btn'), Markup.button.callback(`Мотоциклы и мототехника`, 'moto_btn'), Markup.button.callback(`Грузовики и спецтехника`, 'trucks_btn')],
        [Markup.button.callback("Водный транспорт", 'water_btn'), Markup.button.callback(`Запчасти и аксессуары`, 'accessories_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

// Электроника
bot.hears('Электроника', async ctx => {
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback("Телефоны", 'phone_btn'), Markup.button.callback(`Аудио и видео`, 'audio_video_btn'), Markup.button.callback(`Товары для компьютера`, 'goods_btn')],
        [Markup.button.callback("Игры, приставки и программы", 'water_btn'), Markup.button.callback(`Ноутбуки`, 'laptop_btn'), Markup.button.callback(`Настольные компьютеры`, 'computers_btn')],
        [Markup.button.callback("Фототехника", 'photo_btn'), Markup.button.callback(`Планшеты и электронные книги`, 'laptop_btn'), Markup.button.callback(`Оргетехника и расходники`, 'computers_btn')],
        [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
    ]).oneTime().resize());
});

// Работа
bot.hears('Вакансии', ctx => ctx.scene.enter('vacancyWizard'));
bot.hears('Резюме', ctx => ctx.scene.enter('resumeWizard'));
bot.hears('Услуги', ctx => ctx.scene.enter('servicesWizard'));

// Недвижемость
bot.hears('Студии', ctx => ctx.scene.enter('studiosWizard'));
bot.hears('Квартиры', ctx => ctx.scene.enter('propertyWizard'));
bot.hears('Комнаты', ctx => ctx.scene.enter('roomsWizard'));

//Транспорт
bot.hears('Автомобили', ctx => ctx.scene.enter('transportWizard'));
bot.hears('Мотоциклы и мототехника', ctx => ctx.scene.enter('transportWizard'));
bot.hears('Грузовики и спецтехника', ctx => ctx.scene.enter('transportWizard'));
bot.hears('Водный транспорт', ctx => ctx.scene.enter('transportWizard'));
bot.hears('Запчасти и аксессуары', ctx => ctx.scene.enter('transportWizard'));

//Транспорт
bot.hears('Телефоны', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Аудио и видео', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Товары для компьютера', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Игры, приставки и программы', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Ноутбуки', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Настольные компьютеры', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Фототехника', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Планшеты и электронные книги', ctx => ctx.scene.enter('electronicsWizard'));
bot.hears('Оргетехника и расходники', ctx => ctx.scene.enter('electronicsWizard'));


//******************************************КАНАЛ С ОБЪЯВЛЕНИЯМИ**************************************************
bot.hears('\u{1F4E2}Посмотреть все объявления\u{1F4E2}', async ctx => {
    try {
        await ctx.reply('Вы можете перейти на канал\nс объявления по ссылке ниже', Markup.inlineKeyboard([
            [Markup.button.url('Перейти на канал', 'https://t.me/+5V71SFuwpfMzZTIy')]
        ]));
    } catch (e) {
        console.log(e);
    }
});

//******************************************ПОДДЕРЖКА**************************************************
bot.hears('Написать админу', async ctx => {
    try {
        await ctx.reply('Вы можете обратиться к администратору\nпо ссылке ниже', Markup.inlineKeyboard([
            [Markup.button.url('Написать владельцу', 'https://t.me/muhammad_israfilov')],
            [Markup.button.url('Написать администратору', 'https://t.me/Seruleb')]
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
                [Markup.button.callback('\u{1F4E2}Посмотреть все объявления\u{1F4E2}', 'btn2')],
                [Markup.button.callback('Написать админу', 'btn3')]
            ]).oneTime().resize());
        }
    } catch (e) {
        console.log(e);
    }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));