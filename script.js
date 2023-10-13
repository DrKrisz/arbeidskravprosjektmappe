// her har jeg laget en "database" for de karatene som er mulig å spille med
var characterData = {
  "nameless-knight": { name: "Knight", hp: 200 },
  "julia-the-archer": { name: "Archer", hp: 200, arrows: 10 },
  "the-cat": { name: "The Cat", hp: 200 },
};

// laget noe variabel for bossen, og angrep
var bigBossHP = 300;
var initialBigBossHP = bigBossHP;
var bigBossHPDiv = document.getElementById("big-boss-hp-div");
var attackEnabled = true;
var arrows = 10;

// hvis bossen liver under 20%, da blir mindre damage
function calculateEffectiveDamage(damage) {
  if (bigBossHP <= 0) {
    return 0;
  } else if (bigBossHP < 0.2 * initialBigBossHP) {
    return Math.floor(damage * 0.9);
  } else {
    return damage;
  }
}

// du for melding om du vant eller ikke
function checkWinLoss() {
  if (bigBossHP <= 0) {
    var winMessage = document.getElementById("output-div");
    winMessage.innerHTML = "You won!";
    winMessage.className = "message";
    winMessage.style.backgroundColor = "green";
    document.getElementById("output-div");
    attackEnabled = false;
  } else {
    var remainingHeroes = Object.keys(characterData).filter((characterId) => characterData[characterId].hp > 0);
    if (remainingHeroes.length === 0) {
      var loseMessage = document.createElement("div");
      loseMessage.innerHTML = "You lost!";
      loseMessage.className = "message";
      loseMessage.style.backgroundColor = "red";
      document.getElementById("output-div").appendChild(loseMessage);
      attackEnabled = false;
    }
  }
}

// skjekker først om du kan angrepe, hvis ja da en random mellom 1-25, also for du innerHTML log
function attackCharacter(characterId, bgColor) {
  return function () {
    if (!attackEnabled) {
      return;
    }

    var damage = Math.floor(Math.random() * 25) + 1;
    var effectiveDamage = calculateEffectiveDamage(damage);
    bigBossHP -= effectiveDamage;
    bigBossHPDiv.style.width = bigBossHP + "px";
    var message = document.getElementById("output-div");
    message.innerHTML = characterData[characterId].name + " attacked the Big Boss for " + effectiveDamage + " damage!";
    console.log(characterId);
    message.className = "message";
    message.style.backgroundColor = bgColor;
    message.style.padding = "24px";
    document.getElementById("output-div");

    checkWinLoss();

    if (bigBossHP > 0 && Math.random() < 0.25) {
      var appearingMonster = document.getElementById("appearing-monster");
      appearingMonster.src = "images/" + (Math.random() < 1 ? "slime.png" : "bat.png");
      appearingMonster.alt = "Appearing Monster";
      var monsterMessage = document.getElementById("output-div");
      monsterMessage.innerHTML = "A Slime or Bat has appeared!";
      monsterMessage.className = "message";
      monsterMessage.style.backgroundColor = "red";
      document.getElementById("output-div");
      attackEnabled = false;
      setTimeout(function () {
        attackEnabled = true;
        appearingMonster.src = "";
        appearingMonster.alt = "";
        var heroIds = Object.keys(characterData);
        var randomHeroId = heroIds[Math.floor(Math.random() * heroIds.length)];
        var heroDamage = Math.floor(Math.random() * 200) + 1;
        characterData[randomHeroId].hp -= heroDamage;
        console.log(randomHeroId);
        document.getElementById(randomHeroId + "-hp-div").style.width = characterData[randomHeroId].hp + "px";
        var returnAttackMessage = document.createElement("div");
        returnAttackMessage.innerHTML = "Big Boss attacked " + characterData[randomHeroId].name + " for " + heroDamage + " damage!";
        returnAttackMessage.className = "message";
        returnAttackMessage.style.backgroundColor = "red";
        document.getElementById("output-div");
        checkWinLoss();
      }, 1000);
    }
  };
}

// her for karakterene heal fra William
function healCharacter(characterId) {
  return function () {
    var healAmount = Math.floor(Math.random() * 25) + 1;
    characterData[characterId].hp += healAmount;
    if (characterData[characterId].hp > 200) {
      characterData[characterId].hp = 200;
    }
    document.getElementById(characterId + "-hp-div").style.width = characterData[characterId].hp + "px";
    var message = document.getElementById("output-div");
    console.log(characterData[characterId].hp);
    message.innerHTML = "William the Healer healed " + characterData[characterId].name + " for " + healAmount + " HP!";
    message.className = "message";
    message.style.backgroundColor = "blue";
    document.getElementById("output-div");
    attackEnabled = false;
    setTimeout(function () {
      attackEnabled = true;
    }, 1000);
  };
}

// her lager lumberjack arrowd for julia
function provideArrowsForJulia() {
  if (characterData["julia-the-archer"].arrows >= 10) {
    arrows = arrows + 5;
    var message = document.getElementById("output-div");
    message.innerHTML = "Jack the Lumberjack provided 5 arrows for Julia!" + "Archer has " + arrows;
    message.className = "message";
    message.style.backgroundColor = "brown";
    document.getElementById("output-div");
    console.log("lumberjack " + arrows);
  } else {
    console.log("else lumber");
  }
}

// en variabel for healer
var healer = document.getElementById("william-the-healer");
healer.addEventListener("click", healCharacter("nameless-knight"));
healer.addEventListener("click", healCharacter("julia-the-archer"));
healer.addEventListener("click", healCharacter("the-cat"));

// en variabel for lumberjack
var lumberjack = document.getElementById("jack-the-lumberjack");
lumberjack.addEventListener("click", provideArrowsForJulia);

// laget en karakter id for lettere innerHTML logger
var characterIds = Object.keys(characterData);
for (var i = 0; i < characterIds.length; i++) {
  var character = document.getElementById(characterIds[i]);
  var bgColor = characterIds[i] === "julia-the-archer" ? "green" : "blue";
  character.addEventListener("click", attackCharacter(characterIds[i], bgColor));
}
