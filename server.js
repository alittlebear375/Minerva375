var express = require('express');
var app = express();
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
const http = require('http');
app.get("/", (request, response) => {
 console.log(Date.now() + " Feeling alive!");
 response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
 http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client();
const packagee = require('./package.json');
const fs = require('fs'); // read and write files
const moment = require('moment'); // moment for current date and time
//JSON files
let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'))

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
//music
const music = new Music(client, {
  prefix: '.',
  youtubeKey: 'AIzaSyDi-BK9t1eev-c1m_sbtwEivsXr51K7OiA',
  disableLoop: true,
  botOwner: '419728831947997186',
  maxQueueSize: '20',
  helpCMD: 'help',
  enableQueueStat: true
});

//bot on
client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`.help || ${client.guild.size} servers`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`.help || ${client.guild.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`.help || ${client.guild.size} servers`);
});

//commands
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(packagee.prefix) !== 0) return;
  // Here we separate our "command" name, and our "arguments" for the command. 
  const args = message.content.slice(packagee.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
if(command === "help") {
    message.channel.send({embed:{
        color: 0x87CEFA,
        title: "Commands",
        author: {
            icon_url: message.author.avatarURL
        },
        fields: [{
            name: ".help",
            value: "This command"
        },
        {
            name: ".musichelp",
            value: "Shows a list of Music Commands"
        },
        {
            name: ".adminhelp",
            value: "Shows a list of Admin Commands"
        },
        {
            name: ".funhelp",
            value: "Shows a list of Fun Commands"
        },
        {
            name: ".bankhelp",
            value: "shows a list of Bank Commands"
        }]
    }})
}
if (command === "adminhelp") {
    message.channel.send({embed:{
        color: 0x87CEFA,
        title: "Admin Commands",
        author: {
            icon_url: message.author.avatarURL
        },
        fields: [{
            name: ".ban"
        }]
    }})
}
 
    //**FOR ADMINS ONLY** \n \n **.ban @name reason**\n Ban a member\n **.kick @name reason**\n Kick a member\n**.purge number**\nDeletes messages up to 100\n**.warn @name reason**\n Warn a member\n--------------------------\n**MUSIC COMMANDS**\n\n**.musichelp** \nmusic commands \n**.play link|name**\n add a song to the queue\n**.pause**\npauses the current queue\n**.resume**\nresumes the current queue\n**.queue**\nshows current queue\n**.volume number**\nadjust volume of bot\n**.search**\nsearch for a song\n**.np**\nshows current song\n**.clearqueue**\nclear the queue\n**.skip**\nskip the current song\n-----------------------\n**FUN COMMANDS**\n\n**.joke**\n Gives a random joke\n
if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
    
if(command === "kick") {
    if(!message.member.roles.some(r=>["Admin", "General"].includes(r.name)) )
      return message.reply("You don't have permissions to use this!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.channel.send(`@${member.user.tag} has been kicked by ${message.author.tag} for reason: ${reason}`);
    console.log(`${member.user.tag} has been kicked for '${reason}' by ${message.author.tag}`) 
}
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Admin", "General"].includes(r.name)) )
      return message.reply("You don't have permissions to use this!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.channel.send(`@${member.user.tag} has been banned by ${message.author.tag} for reason: ${reason}`);
    console.log(`${member.user.tag} has been banned for '${reason}' by ${message.author.tag}`)
}
    
if(command === "warn") {
    if(!message.member.roles.some(r=>["Admin", "General"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    let reason = args.slice(1).join(' ');
    if(!reason) 
        reason = "No reason provided";
    message.channel.send(`@${member.user.tag}, you have been warned by ${message.author.tag} for '${reason}'`);
    console.log(`${member.user.tag} has been warned for '${reason}' by ${message.author.tag}`)
}
    
if (command === "joke") {
    var msg1 = Array(39); 
    //jokes
	msg1[1] = "I'm reading a book about anit-gravity, it's impossible to put down!";
    msg1[2] = "What time did the man go to the dentist? Tooth hurt-y!";
	msg1[3] = "Did you know the first french fries weren't made in France, they were cooked in Greece ";
	msg1[4] = "Want to hear a joke about a piece of paper? Never mind, it tearable";
	msg1[5] = "What do you call a factory that sells passable products? A satisfactory!";
	msg1[6] = "I used to have a job at the calendar factory, but I got fired because I took a few days off.";
    msg1[7] = "How do you make holy water? You boil the hell out of it!";
    msg1[8] = "When you ask your dad if he's alright: 'No, i'm half left!'";
    msg1[9] = "I had a dream that I was a muffler last night. I woke up exhausted...";
    msg1[10] = "5/4 people admit they are bad with fractions.";
    msg1[11] = "Did you hear about the circus fire? It was in tents!";
    msg1[12] = "Never trust atoms. They make up everything!";
    msg1[13] = "How many tickles does it take to make an octopus laugh? Ten-tickles!";
    msg1[14] = "I only know 25 letters in the English language. I don't know why.";
    msg1[15] = "Why couldn't the bike stand up by itself? It was two-tired!";
    msg1[16] = "Can February March? No, but April May!";
    msg1[17] = "What did the buffalo say to his son when he dropped him off at school? Bison!";
    msg1[18] = "Have you ever heard of the band 1023MB? They haven't got a gig yet.";
    msg1[19] = "How many apples grow on a tree? All of them.";
    msg1[20] = "What did the grape do when he got stepped on? He let out a little wine";
    msg1[21] = "What is every whales favourite greeting? Whale hello there!";
    msg1[22] = "How does Moses make tea? He brews";
    msg1[23] = "What do you call a bagel that can fly? A plane bagel!";
    msg1[24] = "Want to hear a joke about construction? I'm still working on it.";
    msg1[25] = "A husband and wife have four sons. The oldest three are tall with red hair and light skin while the youngest son is short with black hair and dark eyes. The father was on his deathbed when he turned to his wife and said, 'Honey, before I die, be totally honest with me: Is our youngest son my child?' The wife replied, 'I swear on everything that's holy that he is your son.' With that, the husband passed away. The wife muttered, 'Thank God he didn't ask about the other three.'";
    msg1[26] = "The inmate on death row is scheduled to be put to death by firing squad. He doesn't request a last meal or anything special for his last day. As he stands before the firing squad he says, 'Actually, music is my life. One thing I would really like would be to sing my favorite song, one whole time through, with no interruptions.' The guard nods solemnly and tells him to go ahead. The inmate starts, 'One billion bottles of beer on the wall... .'";
    msg1[27] = "A guy in the locker room saw another guy with a piece of cork up his ass. 'Why do you have a cork up your ass?'  'Well, it's a long story. But one day I was walking on the beach and I tripped over a bottle and woke up to a genie who said he would grant me one wish. I said, 'No shit!''";
    msg1[28] = "Ladies, it is amazing how you do that, with a beverage coming out of your nipple, did you know that? Guys, we can't do it. Because if we could, we'd spend the whole time squirting each other.";
    msg1[29] = "The blonde walks into a drugstore and asks the pharmacist for some bottom deodorant. The pharmacist, a little bemused, explains to the woman that they don't sell anything called bottom deodorant, and never have. Unfazed, the blonde assures him that she has been buying the stuff from this store on a regular basis, and would like some more. 'I'm sorry,' says the pharmacist, 'we don't have any.'  'But I always get it here,' says the blonde.   'Do you have the container it comes in?'    'Yes!' says the blonde, 'I will go and get it.' She returns with the container and hands it to the pharmacist, who looks at it and says to her, 'This is just a normal stick of underarm deodorant.' The annoyed blonde snatches the container back and reads out loud from the container: 'To apply, push up bottom.'";
    msg1[30] = "One day, a farmer was tending to his livestock when he noticed that one of his cows was completely cross-eyed. He called up a veterinarian friend of his who told him to bring in his cow. The vet took one look at the cow, stuck a tube up the cow's butt, and blew into the tube until the cow's eyes straightened out. The vet charged the farmer a hundred bucks, and the farmer went home happy. About a week later, the cow's eyes were cross-eyed again, but this time the farmer figured he could probably take care of it himself. So he called his hired hand over, and together they put a tube up the cow's butt. The farmer put his lips to the tube and started to blow. Strangely, nothing happened, so he asked his hired hand to give it a try. The hired hand removed the tube, turned it around, put it in the cow's butt and started to blow. 'What are you doing?' asked the farmer, horrified. 'Well, I wasn't gonna use the side that YOU had put your lips on.'";
    msg1[31] = "When I die, I want to go peacefully like my grandfather did, in his sleep -- not screaming like the passengers in his car.";
    msg1[32] = "Two hunters were stalking through the forest when one said to the other that he has to take a dump. His friend replies, 'Well, go in the bushes.'    'What should I use to wipe my ass?' he asks. 'Use a dollar bill,' his friend says. A few minutes later, the hunter steps out of the bushes with shit all over his hands. 'What happened?' asked his friend. He replied, 'I didn't have a dollar bill, so I used four quarters.'";
    msg1[33] = "Q: What do you call a blind dinosaur? A: Do-you-think-he-saur-us";
    msg1[34] = "Q: What do you call a chicken who crosses the road, rolls in dirt and comes back? A: A dirty double-crosser.";
    msg1[35] = "Tired of constant blonde jokes, a blonde dyes her hair brown. She goes for a drive in the country and sees a shepherd herding his sheep across the road. 'Hey, shepherd, if I guess how many sheep are here, can I keep one? she asks. The shepherd agrees. She blurts out, '352!' The shepherd is stunned but keeps his word and allows her to pick a sheep. 'I'll take this one,' she says proudly. 'It's the cutest!' 'Hey lady,' says the shepherd. 'If I guess your real hair color, can I have my dog back?'";
    msg1[36] = "I like to buy a four-pack of toilet paper every time I shop, just so I can ask the clerk this judgment question: 'Would you say I got the right amount of toilet paper for the amount of groceries I bought?'";
    msg1[37] = "Q: How many men does it take to put down a toilet seat? A: Who knows -- it's never been done.";
    msg1[38] = "Q: What did the DNA say to the other DNA? A: Do these genes make my butt look fat?";
    msg1[39] = "There was once a man named Odd. People made fun of him because of his name so he decided to keep his gravestone blank when he died. Now when people pass by the burial site, they point and say, 'That's odd.'";
    msg1[40] = "Q: What's grosser than gross? A: Giving your grandmother oral sex. And then hitting your head on the coffin lid.";
    //random joke
    var x = getRandomInt(1, 41);
    if (x === 1) {message.channel.send(msg1[1]);}
    if (x === 2) {message.channel.send(msg1[2]);}
    if (x === 3) {message.channel.send(msg1[3]);}
    if (x === 4) {message.channel.send(msg1[4]);}
    if (x === 5) {message.channel.send(msg1[5]);}
    if (x === 6) {message.channel.send(msg1[6]);}
    if (x === 7) {message.channel.send(msg1[7]);}
    if (x === 8) {message.channel.send(msg1[8]);}
    if (x === 9) {message.channel.send(msg1[9]);}
    if (x === 10) {message.channel.send(msg1[10]);}
    if (x === 11) {message.channel.send(msg1[11]);}
    if (x === 12) {message.channel.send(msg1[12]);}
    if (x === 13) {message.channel.send(msg1[13]);}
    if (x === 14) {message.channel.send(msg1[14]);}
    if (x === 15) {message.channel.send(msg1[15]);}
    if (x === 16) {message.channel.send(msg1[16]);}
    if (x === 17) {message.channel.send(msg1[17]);}
    if (x === 18) {message.channel.send(msg1[18]);}
    if (x === 19) {message.channel.send(msg1[19]);}
    if (x === 20) {message.channel.send(msg1[20]);}
    if (x === 21) {message.channel.send(msg1[21]);}
    if (x === 22) {message.channel.send(msg1[22]);}
    if (x === 23) {message.channel.send(msg1[23]);}
    if (x === 24) {message.channel.send(msg1[24]);}
    if (x === 25) {message.channel.send(msg1[25]);}
    if (x === 26) {message.channel.send(msg1[26]);}
    if (x === 27) {message.channel.send(msg1[27]);}
    if (x === 28) {message.channel.send(msg1[28]);}
    if (x === 29) {message.channel.send(msg1[29]);}
    if (x === 30) {message.channel.send(msg1[30]);}
    if (x === 31) {message.channel.send(msg1[31]);}
    if (x === 32) {message.channel.send(msg1[32]);}
    if (x === 33) {message.channel.send(msg1[33]);}
    if (x === 34) {message.channel.send(msg1[34]);}
    if (x === 35) {message.channel.send(msg1[35]);}
    if (x === 36) {message.channel.send(msg1[36]);}
    if (x === 37) {message.channel.send(msg1[37]);}
    if (x === 38) {message.channel.send(msg1[38]);}
    if (x === 39) {message.channel.send(msg1[39]);}
    if (x === 40) {message.channel.send(msg1[40]);}
}

        if (!userData[message.author.id + message.guild.id]) userData[message.author.id + message.guild.id] = {} //create file for person if not one already
        if (!userData[message.author.id + message.guild.id].money) userData[message.author.id + message.guild.id].money = 0; // creates money object if not one already
        if (!userData[message.author.id + message.guild.id].lastDaily) userData[message.author.id + message.guild.id].lastDaily = "Not Collected" // create lastDaily if not one already
        if (!userData[message.author.id + message.guild.id].username) userData[message.author.id + message.guild.id].username = message.author.username; // members username
        if (!userData[message.author.id + message.guild.id].tag) userData[message.author.id + message.guild.id].tag = message.author.tag; // members tag
        if (!userData[message.author.id + message.guild.id].bank) userData[message.author.id + message.guild.id].bank = 100; // amount in bank
        if (!userData[message.author.id + message.guild.id].fines) userData[message.author.id + message.guild.id].fines = 0; // fines
        if (!userData[message.author.id + message.guild.id]) {
        fs.writeFile('userData.json', JSON.stringify(userData), (err) => { // write changes
            if (err) console.error(err);
        })
        message.channel.send({embed:{
            author: {
                name: message.author.tag,
                icon_url: message.author.avatarURL
            },
            description: "You have successfully made a bank account! **100$** will be added to your account",
            color: 0x39FF14
        }})
        }
    
    fs.writeFile('userData.json', JSON.stringify(userData), (err) => { // write changes
        if (err) console.error(err);
    })
    
    if (command === 'bal') {
            message.channel.send({embed: {
                color: 0x87CEFA,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: "Use **.payfines** to pay all your fines or **.payfine amount** to pay some of your fines",
                fields: [{
                    name: "Cash:",
                    value: `${userData[message.author.id + message.guild.id].money}$`,
                    inline: true
                },
                {
                    name: "Bank:",
                    value: `${userData[message.author.id + message.guild.id].bank}$`,
                    inline: true
                },
                {
                    name: "Fines:",
                    value: `${userData[message.author.id + message.guild.id].fines}$`,
                    inline: true
                }]
            }})
    }
    
    if (command === 'daily') {
        var d = getRandomInt(100, 201)
        if (userData[message.author.id + message.guild.id].lastDaily != moment().format('L')) { // checks date
            userData[message.author.id + message.guild.id].lastDaily = moment().format('L') // rewrites date
            userData[message.author.id + message.guild.id].money += d; // adds d to account of author
            message.channel.send({embed:{
                title: "Daily Reward",
                color: 0x39FF14,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: "You got " + d + "$ added to your account!"
            }})
        } else {
            message.channel.send({embed:{
                title: "Daily Reward",
                color: 0xFF0000,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: ":no_entry_sign: You can collect your next daily reward **" + moment().endOf('day').fromNow() + "**."
            }})
        }
        fs.writeFile('userData.json', JSON.stringify(userData), (err) => { // write changes
        if (err) console.error(err);
        })
    }
    
    fs.writeFile('userData.json', JSON.stringify(userData), (err) => { // write changes
        if (err) console.error(err);
    })
    
    if (command === "dep") {
        let deposit = args.slice(0).join(' ');
        const money = userData[message.author.id + message.guild.id].money;
        if (deposit === "") {
            message.channel.send({embed:{
                color: 0xFF0000,
                title: "Deposit",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: "Plase enter a valid amount or enter **.dep all**"
            }})
        } else {
        if (deposit === "all") {
            message.channel.send({embed:{
                color: 0x39FF14,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: `You have successfully deposited ${money}$ into your bank account!`
            }})
            userData[message.author.id + message.guild.id].bank += money;
            userData[message.author.id + message.guild.id].money = 0;
        } else {
            message.channel.send({embed:{
                color: 0x39FF14,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: `You have successfully deposited ${deposit}$ into your bank account!`
            }})
            userData[message.author.id + message.guild.id].bank += deposit;
            userData[message.author.id + message.guild.id].money -= deposit;
        }
        }
        fs.writeFile('userData.json', JSON.stringify(userData), (err) => { // write changes
        if (err) console.error(err);
        })
    }
        
    if (command === "with") {
        let withdraw = args.slice(0).join(' ');
        const bank = userData[message.author.id + message.guild.id].bank;
        if (withdraw === "") {
            message.channel.send({embed:{
                color: 0xFF0000,
                title: "Withdraw",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: "Please enter a valid amount or enter **.with all**"
            }})
        } else {
        if (withdraw === "all") {
            message.channel.send({embed:{
                color: 0x39FF14,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: `You have successfully withdrew ${bank}$ from your bank!`
            }})
            userData[message.author.id + message.guild.id].money += bank;
            userData[message.author.id + message.guild.id].bank -= 0;
        } else {
            if (withdraw > userData[message.author.id + message.guild.id].bank) {
                message.channel.send({embed:{
                    color: 0xFF0000,
                    title: "Withdraw",
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.avatarURL
                    },
                    description: "You do not have enough money to complete this action"
                }})
            } else {
            message.channel.send({embed:{
                color: 0x39FF14,
                title: "Withdraw",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                description: `You have successfully withdrew ${withdraw}$ from your bank!`
            }})
            userData[message.author.id + message.guild.id].money += withdraw;
            userData[message.author.id + message.guild.id].bank -= withdraw;
            }
        }
        }
    }
    
    if (command === "guildtop") {
        //variables
        var guildMoney = 0; //money in guild
        var guildUsers = 0;
        var guildRichest = ''; // richest user in guild
        var guildRichest$ = 0; 
        var guildRichest2 = '';
        var guildRichest2$ = 0;
        var guildRichest3 = '';
        var guildRichest3$ = 0;
        
        for (var i in userData) {
            if (i.endsWith(message.guild.id)) {
                guildMoney += userData[i].money; //add user money to guild total money
                guildUsers += 1; // add one user to guild user count
                if (userData[i].money > guildRichest$) {
                    guildRichest$ = userData[i].money;
                    guildRichest = userData[i].tag;
                }
                if (userData[i].money < guildRichest$, userData[i].money > guildRichest2$, userData[i].tag != guildRichest3, userData[i].tag != guildRichest) {
                    guildRichest2$ = userData[i].money;
                    guildRichest2 = userData[i].tag;
                }
                if (userData[i].money < guildRichest2$, userData[i].money > guildRichest3$, userData[i].tag != guildRichest2, userData[i].tag != guildRichest) {
                    guildRichest3$ = userData[i].money;
                    guildRichest3 = userData[i].tag;
                }
            }
        }
    message.channel.send({embed: {
            title: `${message.guild.name} Leaderboard`,
            color: 0x87CEFA,
            description: `**1.** - ${guildRichest} | ${guildRichest$}$\n**2.** - ${guildRichest2} | ${guildRichest2$}$\n**3.** - ${guildRichest3} | ${guildRichest3$}$`
        }})    
    }
    
    if (command === "top") {
        //variables
        var globalMoney = 0; //money in guild
        var globalUsers = 0;
        var globalRichest = ''; // richest user in guild
        var globalRichest$ = 0; 
        var globalRichest2 = '';
        var globalRichest2$ = 0;
        var globalRichest3 = '';
        var globalRichest3$ = 0;
        
        for (var i in userData) {
                globalMoney += userData[i].money; //add user money to guild total money
                globalUsers += 1; // add one user to guild user count
                if (userData[i].money > globalRichest$) {
                    globalRichest$ = userData[i].money;
                    globalRichest = userData[i].tag;
                }
                if (userData[i].money < globalRichest$, userData[i].tag > globalRichest2$, userData[i].tag != globalRichest3, userData[i].tag != globalRichest) {
                    globalRichest2$ = userData[i].money;
                    globalRichest2 = userData[i].tag;
                }
                if (userData[i].money < globalRichest2$, userData[i].money > globalRichest3$, userData[i].tag != globalRichest2, userData[i].tag != globalRichest) {
                    globalRichest3$ = userData[i].money;
                    globalRichest3 = userData[i].tag;
                }
        }
    message.channel.send({embed: {
            title: "Global Leaderboard",
            color: 0x87CEFA,
            description: `**1.** - ${globalRichest} | ${globalRichest$}$\n**2.** - ${globalRichest2} | ${globalRichest2$}$\n**3.** - ${globalRichest3} | ${globalRichest3$}$`
        }})    
    }
    if(command === "ping") {
    message.delete().catch(O_o=>{}); 
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
});

client.on('ready', () => {
    console.log('Economy Has Launched...')
})

client.login(packagee.token);