const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.js");
const fs = require("fs");
const db = require("orio.db");
const chalk = require("chalk");
const express = require("express");










//BOT GLİTCHDE OLMAYACAK İSE BU KISMI SİL | SATIR 11-24

const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(`Uptime Başarılı`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 60000);

//BOT GLİTCHDE OLMAYACAK İSE BU KISMI SİL | SATIR 11-24











let cstoken;
if (ayarlar.TOKEN) {
  cstoken = ayarlar.TOKEN;
}
if (process.env.TOKEN) {
  cstoken = process.env.TOKEN;
}
if (cstoken) {
  client.login(ayarlar.TOKEN || process.env.TOKEN);
} else {
  console.log("Projeye Hiç Bir Bot Tokeni Yazılmamış!");
}


client.ayarlar = ayarlar

    client.on("message", async message => {
      let client = message.client;
      if (message.author.bot) return;

      let prefix = ayarlar.prefix;

      if (!message.content.startsWith(prefix)) return;
      let command = message.content.split(" ")[0].slice(prefix.length);
      let params = message.content.split(" ").slice(1);
      let cmd;
      if (client.commands.has(command)) {
        cmd = client.commands.get(command);
      } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
      }
      if (cmd) {
        cmd.run(client, message, params);
      }
    });


    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    fs.readdir("./komutlar/", (err, files) => {
      if (err) console.error(err);
      console.log(`Toplamda ${files.length} Komut Var!`);
      files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        console.log(`${props.help.name} İsimli Komut Aktif!`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      });
    });

    client.reload = command => {
      return new Promise((resolve, reject) => {
        try {
          delete require.cache[require.resolve(`./komutlar/${command}`)];
          let cmd = require(`./komutlar/${command}`);
          client.commands.delete(command);
          client.aliases.forEach((cmd, alias) => {
            if (cmd === command) client.aliases.delete(alias);
          });
          client.commands.set(command, cmd);
          cmd.conf.aliases.forEach(alias => {
            client.aliases.set(alias, cmd.help.name);
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    };

    client.load = command => {
      return new Promise((resolve, reject) => {
        try {
          let cmd = require(`./komutlar/${command}`);
          client.commands.set(command, cmd);
          cmd.conf.aliases.forEach(alias => {
            client.aliases.set(alias, cmd.help.name);
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    };

    client.unload = command => {
      return new Promise((resolve, reject) => {
        try {
          delete require.cache[require.resolve(`./komutlar/${command}`)];
          let cmd = require(`./komutlar/${command}`);
          client.commands.delete(command);
          client.aliases.forEach((cmd, alias) => {
            if (cmd === command) client.aliases.delete(alias);
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    };
    
  


client.on("ready", function() {
  if(db.get("csticket")){
  Object.entries(db.get("csticket")).map(e => {
    const sunucu = client.guilds.cache.get(e[1].sunucuID)
       if(!sunucu){
      db.delete("csticket."+e[1].sunucuID)
    } else {
    const kanal = sunucu.channels.cache.get(e[1].kanal)
       if(!kanal){
      db.delete("csticket."+e[1].sunucuID)
    } else {
    const data = kanal.messages.fetch(e[1].mesajID)
    if(!data){
      db.delete("csticket."+e[1].sunucuID)
    } else {
  
      data.then(mr => {
        if(mr){
          mr.reactions.removeAll()
        mr.react("📨");
        }
      })
    }
    }
    }
  });
}
});

client.on("messageReactionAdd", (messageReaction, user) => {
  if (!user.bot) {
    let member = messageReaction.message.guild.members.cache.get(user.id);
  const data = db.get("csticket."+messageReaction.message.guild.id)
  
  if(data){
      if (data.mesajID === messageReaction.message.id) {
        if (messageReaction.emoji.name === "📨") {
     messageReaction.users.remove(user.id)
            const prefixx = client.ayarlar.prefix
let csrol = messageReaction.message.guild.roles.cache.get(data.rolID)
    let onl;
          let listedChannels = []
    messageReaction.message.guild.members.cache.forEach(p => {
      if (p.roles.cache.has(csrol.id)) {
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "idle") onl = ":orange_circle:" 
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "dnd") onl = ":red_circle:"
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "online") onl = ":green_circle:"
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "offline") onl = ":white_circle:"

        listedChannels.push(`\`${p.user.tag}` + "\` " + onl );
      }
    });
    if (!messageReaction.message.guild.channels.cache.find(xx => xx.name === "DESTEK")) {
       messageReaction.message.guild.channels.create(`DESTEK`, { type: 'category'});
    }
    let a = messageReaction.message.guild.channels.cache.find(xxx => xxx.name === "DESTEK");
    if (messageReaction.message.guild.channels.cache.some(
        kk =>
          kk.name ===
          `destek-${messageReaction.message.guild.members.cache.get(member.id).user.username.toLowerCase() +
            messageReaction.message.guild.members.cache.get(member.id).user.discriminator}`
      ) == true
    )
      return messageReaction.message.channel.send(`**<@${user.id}>, Destek Sistemi Açma İşlemi Başarısız!\nSebep: \`Açılmış Zaten 1 Tane Destek Talebiniz Var.\`**`).then(mr => mr.delete({timeout:10000}))
    messageReaction.message.guild.channels.create(`destek-${member.user.tag}`)
      .then(async c => {
      if(a){
        c.setParent(a)
      }
      const gdl = client.guilds.cache.get(messageReaction.message.guild.id)
    if(gdl.roles.cache.get(data.rolID)){
      await c.createOverwrite(gdl.roles.cache.get(data.rolID), {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true
      });
    }
      await c.createOverwrite(gdl.roles.cache.find(r => r.name === '@everyone'), {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: false
      });
      await c.createOverwrite(member, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true
      });
    
    
        const embed = new Discord.MessageEmbed() //dcs ekibi
          .setColor("BLUE")
          .setAuthor(`${client.user.username} | Destek Sistemi`)
          .addField(
            `Merhaba ${user.username}!`,
            `Destek Yetkilileri Burada Seninle İlgilenecektir!\nDestek Talebini Kapatmak İçin \`${prefixx}kapat\` Yazabilirsin!`
          )
          .addField(`» Kullanıcı:`, `<@${user.id}>`)
          .addField(
            `**Destek Rolündeki Yetkililer;**`,          
`${listedChannels.join(`\n`) || "KİMSE YOK"}`
          )
          .setFooter(`${client.user.username} | Destek Sistemi`)
          .setTimestamp();
        c.send(embed);

        
      })
      .catch(console.error);
  }
          
        }
      }
 
  }
});


client.on("message", message => {
  const cprefix = client.ayarlar.prefix
  if (message.content.toLowerCase().startsWith(cprefix + `kapat`)) {
    if (!message.channel.name.startsWith(`destek-`))
      return message.channel.send(
        `Bu Komut Sadece Destek Talebi Kanallarında Kullanılabilir!`
      );

    var deneme = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor(`Destek Talebi Kapatma İşlemi`)
      .setDescription(
        `Destek Talebini Kapatmayı Onaylamak İçin 10 Saniye İçinde \`evet\` Yazınız!`
      )
      .setFooter(`${client.user.username} | Destek Sistemi`);
    message.channel.send(deneme).then(m => {
      message.channel
        .awaitMessages(response => response.content === "evet", {
          max: 1,
          time: 10000,
          errors: ["time"]
        })
        .then(collected => {
          message.channel.delete(); //dcs ekibi
        })
        .catch(() => {
          m.edit("Destek Talebi Kapatma İsteğin Zaman Aşımına Uğradı!").then(
            m2 => {
              m2.delete({timeout:100});
            },
            5000
          );
        });
    });
  }
});



