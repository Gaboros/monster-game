const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt(`Maximum life for you and the monster.`, `100`);

const playerAudio = new Audio("assets/sounds/sword.mp3");
playerAudio.load();

const playerHardAudio = new Audio("assets/sounds/heavy.mp3");
playerHardAudio.load();

const healAudio = new Audio("assets/sounds/heal.mp3");
healAudio.load();

const music = new Audio("assets/sounds/sound.mp3");
music.volume = 0.5;
music.autoplay = true;

let isMusicLooping = false;

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntry = {};
  }

  /*
  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "PLAYER";
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "PLAYER";
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
  }
}
*/

  function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
  }

  function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      playerDamage,
      currentMonsterHealth,
      currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
      hasBonusLife = false;
      removeBonusLife();
      currentPlayerHealth = initialPlayerHealth;
      setPlayerHealth(initialPlayerHealth);
      alert(`You'd be dead but the bonus life saved you!`);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
      alert("You won!");
      writeToLog(
        LOG_EVENT_GAME_OVER,
        `Player Won!`,
        currentMonsterHealth,
        currentPlayerHealth
      );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
      alert("You lost!");
      writeToLog(
        LOG_EVENT_GAME_OVER,
        `Monster Won!`,
        currentMonsterHealth,
        currentPlayerHealth
      );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
      alert("You have a draw!");
      writeToLog(
        LOG_EVENT_GAME_OVER,
        `Draw!`,
        currentMonsterHealth,
        currentPlayerHealth
      );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
      reset();
    }
  }

  function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent =
      mode === MODE_ATTACK
        ? LOG_EVENT_PLAYER_ATTACK
        : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if (mode === MODE_ATTACK) {
    //  maxDamage = ATTACK_VALUE;
    //   logEvent = LOG_EVENT_MONSTER_ATTACK;
    // } else if (mode === MODE_STRONG_ATTACK) {
    //   maxDamage = STRONG_ATTACK_VALUE;
    //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= monsterDamage;
    endRound();
  }
  function attackHandler() {
    attackMonster(MODE_ATTACK);
  }

  function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
  }

  function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
      alert(`You can't heal to more than your max initial health!`);
      healValue = chosenMaxLife - currentPlayerHealth;
    } else {
      healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(
      LOG_EVENT_PLAYER_HEAL,
      healValue,
      currentMonsterHealth,
      currentPlayerHealth
    );
    endRound();
  }

  function printLogHandler() {
    console.log(battleLog);
  }

  attackBtn.addEventListener("click", attackHandler);
  strongAttackBtn.addEventListener("click", strongAttackHandler);
  healBtn.addEventListener("click", healPlayerHandler);
  logBtn.addEventListener("click", printLogHandler);

  function playerAudioPlay() {
    startMusic();
    playerAudio.play();
  }

  function monsterAudioPlay() {
    startMusic();
    playerHardAudio.play();
  }

  function healAudioPlay() {
    startMusic();
    healAudio.play();
  }

  function startMusic() {
    if (!isMusicLooping) {
      music.play();
      isMusicLooping = true;
    }
  }
}
