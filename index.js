const read = require('fs').readFile;
const axios = require('axios');
const YOUR_REGION = "euw1";
const RANK_QUEUE = 420;
const CURRENT_SEASON = 13;
const SUMMONER_NAME = "vJMark";
const API_KEY = "";
const HEADER = {
    "Accept-Language": "en-GB,en;q=0.5",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": API_KEY
}

// ACROSS
// Account level
// Mastery across champs
// Win streaks
// game time - can be fast, 5 or 10 games, something like that
// game time - can be slow too
// Break a loosing streak
// win 5 games per role in succession (win 5 games in a row per role)
// ADC
// not dying
// gold to dmg ration
// cs total
// cs difference
// Play all marksmen
// Win 5 games in a row with the same AD
// Play all marksmen 5 times
// SUPPORT
// JUNGLE
// MID
// TOP

let PROFILE = {}
let STATS = {
    gameDuration: 0
}
let CHALLENGES = {
    gameDuration: 0
}
let POSITION = {
    role: {},
    lane: {}
}
let BANS = {}
let TEAM_STATS = {
    won: {},
    lost: {}
}
let CHAMPION_STATS = {
    won: [{
        me: 0,
        team: [],
        enemy: []
    }],
    lost: [{
        me: 0,
        team: [],
        enemy: []
    }]
}

const baseUrl = `https://${YOUR_REGION}.api.riotgames.com/`;

function competitveData(championId, teamId, participants, oIds)
{
    let teamL = []
    let teamW = []
    let enemyL = []
    let enemyW = []

    for (let oId of oIds)
    {
        const oParticipant = participants[oId - 1];
        oParticipant.championId
        oParticipant.spell1Id
        oParticipant.spell2Id
    
        let {role, lane} = oParticipant.timeline
        lane = lane === "NONE" ? "SUPPORT" : lane
    
        oParticipant.stats.item0
        oParticipant.stats.item1
        oParticipant.stats.item2
        oParticipant.stats.item3
        oParticipant.stats.item4
        oParticipant.stats.item5
        oParticipant.stats.item6
    
        if (oParticipant.stats.win)
        {
            if (teamId == oParticipant.teamId)
            {
                teamW.push(oParticipant.championId)
            }
            else
            {
                enemyW.push(oParticipant.championId)
            }
        }
        else
        {
            if (teamId == oParticipant.teamId)
            {
                teamL.push(oParticipant.championId)
            }
            else
            {
                enemyL.push(oParticipant.championId)
            }
        }
    }

    CHAMPION_STATS.won.push({
        me: championId,
        team: teamW,
        enemy: enemyW,
        won: true, 
        lost: false
    })
}

function print(any)
{
    console.log(any)
}

function getTeamData(team)
{
    const {
        win,
        firstBlood,
        firstTower,
        firstInhibitor,
        firstBaron,
        firstDragon,
        firstRiftHerald,
        towerKills,
        inhibitorKills,
        baronKills,
        dragonKills,
        riftHeraldKills,
        bans
    } = team;

    if (win === "Win")
    {
        if (Object.keys(TEAM_STATS.won).length > 1)
        {
            TEAM_STATS.won["firstBlood"] += firstBlood ? 1 : 0
            TEAM_STATS.won["firstTower"] += firstTower ? 1 : 0
            TEAM_STATS.won["firstInhibitor"] += firstInhibitor ? 1 : 0
            TEAM_STATS.won["firstBaron"] += firstBaron ? 1 : 0
            TEAM_STATS.won["firstDragon"] += firstDragon ? 1 : 0
            TEAM_STATS.won["firstRiftHerald"] += firstRiftHerald ? 1 : 0
            TEAM_STATS.won["towerKills"] += towerKills
            TEAM_STATS.won["inhibitorKills"] += inhibitorKills
            TEAM_STATS.won["baronKills"] += baronKills
            TEAM_STATS.won["dragonKills"] += dragonKills
            TEAM_STATS.won["riftHeraldKills"] += riftHeraldKills
        }
        else
        {
            TEAM_STATS.won["firstBlood"] = 1
            TEAM_STATS.won["firstTower"] = 1
            TEAM_STATS.won["firstInhibitor"] = 1
            TEAM_STATS.won["firstBaron"] = 1
            TEAM_STATS.won["firstDragon"] = 1
            TEAM_STATS.won["firstRiftHerald"] = 1
            TEAM_STATS.won["towerKills"] = towerKills
            TEAM_STATS.won["inhibitorKills"] = inhibitorKills
            TEAM_STATS.won["baronKills"] = baronKills
            TEAM_STATS.won["dragonKills"] = dragonKills
            TEAM_STATS.won["riftHeraldKills"] = riftHeraldKills
        }
    }
    else
    {
        if (Object.keys(TEAM_STATS.lost).length > 1)
        {
            TEAM_STATS.lost.firstBlood += firstBlood ? 1 : 0
            TEAM_STATS.lost.firstTower += firstTower ? 1 : 0
            TEAM_STATS.lost.firstInhibitor += firstInhibitor ? 1 : 0
            TEAM_STATS.lost.firstBaron += firstBaron ? 1 : 0
            TEAM_STATS.lost.firstDragon += firstDragon ? 1 : 0
            TEAM_STATS.lost.firstRiftHerald += firstRiftHerald ? 1 : 0
            TEAM_STATS.lost.towerKills += towerKills
            TEAM_STATS.lost.inhibitorKills += inhibitorKills
            TEAM_STATS.lost.baronKills += baronKills
            TEAM_STATS.lost.dragonKills += dragonKills
            TEAM_STATS.lost.riftHeraldKills += riftHeraldKills
        }
        else
        {
            TEAM_STATS.lost.firstBlood = 1
            TEAM_STATS.lost.firstTower = 1
            TEAM_STATS.lost.firstInhibitor = 1
            TEAM_STATS.lost.firstBaron = 1
            TEAM_STATS.lost.firstDragon = 1
            TEAM_STATS.lost.firstRiftHerald = 1
            TEAM_STATS.lost.towerKills = towerKills
            TEAM_STATS.lost.inhibitorKills = inhibitorKills
            TEAM_STATS.lost.baronKills = baronKills
            TEAM_STATS.lost.dragonKills = dragonKills
            TEAM_STATS.lost.riftHeraldKills = riftHeraldKills
        }
    }

    for (let ban of bans)
    {
        if (BANS[ban.championId])
        {
            BANS[ban.championId] += 1;
        }
        else
        {
            BANS[ban.championId] = 1;
        }
    }
}

async function getMatchDetails(matchId)
{
    const matches = `lol/match/v4/matches/${matchId}`
    const res = await axios.get(baseUrl + matches, {
        headers: HEADER
    });

    const {gameDuration, teams, participants, participantIdentities} = res.data;

    if (STATS.gameDuration)
    {
        STATS.gameDuration += gameDuration
    }
    else
    {
        STATS.gameDuration = gameDuration
    }

    for (let team of teams)
    {
        getTeamData(team)
    }

    let pId = 1;
    let oIds = []

    for (let x of participantIdentities)
    {
        if (x.player.summonerName == SUMMONER_NAME)
        {
            pId = x.participantId;
        }
        else
        {
            // async buildProfile(x.player.accountId / summonerName / summonerId)
            oIds.push(x.participantId);
        }
    }

    const participant = participants[pId - 1];

    const {
        teamId,
        championId, // find out played champions
        spell1Id, // group with role and champion played
        spell2Id, // group with role and champion played
        stats,
        timeline
    } = participant

    const {
        win,
        item0, // if we see a player not using an item effective against opponents - encourage them to purchase it
        item1, // or something like, purchase "tank killing item" when playing against tanks and win 5 games
        item2,
        item3,
        item4,
        item5,
        item6,
        kills, // improve KDA, K:A ratio for assassins
        deaths, // 0 death games, 
        assists, // set them up, and watch them get knocked down K:A ration for supports and tanks
        largestKillingSpree, 
        largestMultiKill,
        killingSprees,
        longestTimeSpentLiving,
        doubleKills, // get a penta, get 2 penta, get 5 penta, get 10 penta
        tripleKills, // get a penta, get 2 penta, get 5 penta, get 10 penta
        quadraKills, // get a penta, get 2 penta, get 5 penta, get 10 penta
        pentaKills, // get a penta, get 2 penta, get 5 penta, get 10 penta
        totalDamageDealt, // 
        magicDamageDealt, // magic radiants from you
        physicalDamageDealt, // you hit physically hard
        trueDamageDealt, // you are the true damage dealer
        largestCriticalStrike,
        totalDamageDealtToChampions,
        magicDamageDealtToChampions,
        physicalDamageDealtToChampions,
        trueDamageDealtToChampions,
        totalHeal,
        totalUnitsHealed,
        damageSelfMitigated,
        damageDealtToObjectives,
        damageDealtToTurrets,
        visionScore, // your team can see clearly - I can see clearly now
        timeCCingOthers, // no one can escape you
        totalDamageTaken,
        magicalDamageTaken,
        physicalDamageTaken,
        trueDamageTaken,
        goldEarned,
        goldSpent,
        turretKills, // you take objectives - tower destroyer
        inhibitorKills, // you take objectives - inhib destroyer
        totalMinionsKilled,
        neutralMinionsKilled,
        neutralMinionsKilledTeamJungle,
        neutralMinionsKilledEnemyJungle,
        totalTimeCrowdControlDealt, 
        champLevel, // if you are constantly ahead of your team mates or opponents in level by end of game or max level 18 in 10 games
        visionWardsBoughtInGame,
        sightWardsBoughtInGame, // you seek to bring light
        wardsPlaced, // you are lighting the path 
        wardsKilled, // you seek to make them blind
        firstBloodKill, // are you the first blood king?
        firstBloodAssist, // seeking to get people ahead?
        firstTowerKill, // you take objectives - tower destroyer
        firstTowerAssist, // you take objectives - tower destroyer
        firstInhibitorKill, // you take objectives - inhib destroyer
        firstInhibitorAssist, // you take objectives - inhib destroyer
    } = stats

    competitveData(championId, teamId, participants, oIds)

    // if (win)
    // {
    //     CHAMPION_STATS.won[CHAMPION_STATS.won.length - 1].me = championId
    // }
    // else
    // {
    //     CHAMPION_STATS.lost[CHAMPION_STATS.lost.length - 1].me = championId
    // }

    let {role, lane} = timeline

    lane = lane === "NONE" ? "SUPPORT" : lane

    if (POSITION.role[role])
    {
        POSITION.role[role] += 1;
        POSITION.lane[lane] += 1;
    }
    else
    {
        POSITION.role[role] = 1;
        POSITION.lane[lane] = 1;
    }
}

async function getMatches(accountId)
{
    const allMatches = `lol/match/v4/matchlists/by-account/${accountId}?endIndex=20`
    const res = await axios.get(baseUrl + allMatches, {
        headers: HEADER
    });

    let recentDate = 0;
    let gameCount = 0;

    for (let value of res.data.matches)
    {
        if (value.platformId == YOUR_REGION.toUpperCase()
            && value.queue == RANK_QUEUE
            && value.season == CURRENT_SEASON )
        {
            if (recentDate === 0)
            {
                recentDate = value.timestamp;
                PROFILE = {...PROFILE, recentDate};
            }
            gameCount++;
            STATS = {...STATS, gameCount}
            const {gameId} = value;
            await getMatchDetails(gameId);
        }
    }
}

async function getLeagueEntries(leagueId, tier)
{
    const allLeagueEntries = `lol/league/v4/leagues/${leagueId}`
    const res = await axios.get(baseUrl + allLeagueEntries, {
        headers: HEADER
    });

    const {name, entries} = res.data;
    PROFILE = {...PROFILE, leagueName: name}

    // entries.forEach((value) => {
    //     const {
    //         summonerId,
    //         summonerName,
    //         leaguePoints,
    //         rank,
    //         wins,
    //         losses,
    //         veteran,
    //         inactive,
    //         freshBlood,
    //         hotStreak
    //     } = value;
    // })
}

async function getQueue(summonerId)
{
    const allQueues = `lol/league/v4/entries/by-summoner/${summonerId}`
    const res = await axios.get(baseUrl + allQueues, {
        headers: HEADER
    });

    for (let value of res.data)
    {
        if (value.queueType === "RANKED_SOLO_5x5")
        {
            const { leagueId, tier, rank, leaguePoints, wins, losses, veteran, freshBlood, hotStreak } = value;
            const winRate = ((wins + losses) / wins) *100
            const loseRate = ((wins + losses) / losses) *100
            const winLoseRatio = winRate / loseRate
            PROFILE = {...PROFILE, leagueId, tier, rank, leaguePoints, wins, losses}
            STATS = {wins, losses, winRate, loseRate, winLoseRatio, veteran, freshBlood, hotStreak}
            await getLeagueEntries(leagueId, tier);
        }
    }
}

async function getSummonerByName(summonerName)
{
    const summonerDetails = (summonerName) => `lol/summoner/v4/summoners/by-name/${summonerName}`
    ///const summonerDetails = (encryptedAccountId) => `lol/summoner/v4/summoners/by-account/{encryptedAccountId}`
    ///const summonerDetails = (encryptedSummonerId) => `lol/summoner/v4/summoners/{encryptedSummonerId}`

    const res = await axios.get(baseUrl + summonerDetails(summonerName), {
        headers: HEADER
    });
    
    const {id, accountId, name, profileIconId, summonerLevel} = res.data
    PROFILE = {id, accountId, name, profileIconId, summonerLevel};
    await getQueue(id)
    await getMatches(accountId)
}

async function main()
{
    await getSummonerByName("vJMark");
    print(CHAMPION_STATS)
}

main()

// read('./data/leagueEntries.json', 'utf8', (err, data) => {
//     if (err)
//     {
//         console.log(`Error reading file from disk: ${err}`);
//     }
//     else
//     {
//         const {name, entries} = JSON.parse(data);
//         // display your league name and players in the league

//         entries.forEach((value) => {
//             const {
//                 summonerId,
//                 summonerName,
//                 leaguePoints,
//                 rank,
//                 wins,
//                 losses,
//                 veteran,
//                 inactive,
//                 freshBlood,
//                 hotStreak
//             } = value;
//             // async build profiles(summonerId);
//         })
//     }
// })

// read('./data/queues.json', 'utf8', (err, data) => {
//     if (err)
//     {
//         console.log(`Error reading file from disk: ${err}`);
//     }
//     else
//     {
//         JSON.parse(data).forEach((value) => {
//             if (value.queueType === "RANKED_SOLO_5x5")
//             {
//                 const { leagueId, tier, rank, leaguePoints, wins, losses, veteran, inactive, freshBlood, hotStreak } = value;
//                 // icons for veteran, freshblood, hotsreak, inactive
//                 // W:L ratio and stats
//                 // tier rank lp
//                 getLeagueEntries(leagueId, tier);
//             }
//         })
//     }
// })

// read('./data/summoner.json', 'utf8', (err, data) => {
//     if (err)
//     {
//         console.log(`Error reading file from disk: ${err}`);
//     }
//     else
//     {
//         const {id, accountId, name, profileIconId, summonerLevel} = JSON.parse(data)
//         getQueue(id)
//         getMatches(id)
//     }
// });