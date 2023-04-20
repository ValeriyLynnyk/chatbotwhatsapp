const { Configuration, OpenAIApi } = require('openai');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv')

dotenv.config()

const configuration = new Configuration({
    apiKey:process.env.KEY,

})

const openai = new OpenAIApi(configuration);
const generateResponse = async(messages)=> await openai.createChatCompletion({
    model:'gpt-3.5-turbo',
    messages,
    temperature:0.9
});

const { Client, LocalAuth } = require('whatsapp-web.js');
const { log } = require('console');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
let answers = []

client.on('message',async xd=>{
    try{
        const chatMessage = {
            role: 'user',
            content: xd.body   
        }
        answers.push(chatMessage)
        const {data} = await generateResponse(answers)
        // let responseSend = data.choices[0].text
        let answer = data.choices[0].message.content;
        answers.push({
            role:'assistant',
            content: answer
        })
        client.sendMessage(xd.from, answer) //answer[xd.body] | responses[randomNum] 
        console.log(answers);
    }catch(e){
        client.sendMessage(xd.from, 'Lo siento 1 misn uwu mesange 😾')
    }
    
})

client.initialize();
