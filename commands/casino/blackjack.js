const Discord = require("discord.js");
const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const deck = [];
module.exports = {
  aliases: ["bj"],
  description: "Black Jack card game",
  emoji: "",
  name: "blackjack",
  hidden: true,
  ignore: true,
  beta: true,
  dev: true,
  category: "CASINO",
  run: async(bot,message,args,prefix,guildData) => {
    function createDeck(){
      for (let i = 0 ; i < values.length; i++) {
        for(let x = 0; x < suits.length; x++) {
          let weight = parseInt(values[i]);
          if (values[i] == "J" || values[i] == "Q" || values[i] == "K") {
            weight = 10;
          }
          if (values[i] == "A") {
            weight = 11;
          }
          let card = {
            value: values[i],
            suit: suits[x],
            weight: weight
          };
          deck.push(card);
        }
      }
    }
    function shuffle(){
      // for 1000 turns
      // switch the values of two random cards
      for (var i = 0; i < 1000; i++) {
          var location1 = Math.floor((Math.random() * deck.length));
          var location2 = Math.floor((Math.random() * deck.length));
          var tmp = deck[location1];

          deck[location1] = deck[location2];
          deck[location2] = tmp;
      }
    }
  }
}