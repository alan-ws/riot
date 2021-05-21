const axios = require('axios');
const YOUR_REGION = "euw1";
const RANK_QUEUE = 420;
const CURRENT_SEASON = 13;
const SUMMONER_NAME = "vJMark";
const API_KEY = "RGAPI-76cab175-1829-48c1-a960-973e184cc40c";
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
    gameDuration: 0,
    first: {}
}
let CHALLENGES = {
    damages: {
        total: {
            complete: false,
            one: {
                achieved: false,
                currentState: 0,
                targetState: 1,
                coins: 20
            },
            five: {
                achieved: false,
                currentState: 0,
                targetState: 5,
                coins: 100
            },
            ten: {
                achieved: false,
                currentState: 0,
                targetState: 10,
                coins: 100
            },
            twenty: {
                achieved: false,
                currentState: 0,
                targetState: 20,
                coins: 300
            },
            fifty: {
                achieved: false,
                currentState: 0,
                targetState: 50,
                coins: 100
            },
            hundred: {
                achieved: false,
                currentState: 0,
                targetState: 100,
                coins: 100
            }
        },
        champion: {
            complete: false,
            one: {
                achieved: false,
                currentState: 0,
                targetState: 1,
                coins: 20
            },
            five: {
                achieved: false,
                currentState: 0,
                targetState: 5,
                coins: 100
            },
            ten: {
                achieved: false,
                currentState: 0,
                targetState: 10,
                coins: 100
            },
            twenty: {
                achieved: false,
                currentState: 0,
                targetState: 20,
                coins: 300
            },
            fifty: {
                achieved: false,
                currentState: 0,
                targetState: 50,
                coins: 100
            },
            hundred: {
                achieved: false,
                currentState: 0,
                targetState: 100,
                coins: 100
            }
        }
    },
    firsts: {
        bloodKill: {
            complete: false,
            one: {
                achieved: false,
                currentState: 0,
                targetState: 1,
                coins: 20
            },
            five: {
                achieved: false,
                currentState: 0,
                targetState: 5,
                coins: 100
            },
            ten: {
                achieved: false,
                currentState: 0,
                targetState: 10,
                coins: 100
            },
            twenty: {
                achieved: false,
                currentState: 0,
                targetState: 20,
                coins: 300
            },
            fifty: {
                achieved: false,
                currentState: 0,
                targetState: 50,
                coins: 100
            },
            hundred: {
                achieved: false,
                currentState: 0,
                targetState: 100,
                coins: 100
            }
        },
    }
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
let CHAMPION_STATS = []

const baseUrl = `https://${YOUR_REGION}.api.riotgames.com/`;

function competitveData(lane, championId, teamId, participants, oIds)
{
    let teamL = []
    let teamW = []
    let enemyL = []
    let enemyW = []
    let spells = []
    let won = false
    let lost = false

    for (let oId of oIds)
    {
        const oParticipant = participants[oId - 1];
        oParticipant.championId
        let {spell1Id, spell2Id} = oParticipant        
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
                spells.push([spell1Id, spell2Id])
                won = true
            }
            else
            {
                enemyW.push(oParticipant.championId)
                spells.push([spell1Id, spell2Id])
            }
        }
        else
        {
            if (teamId == oParticipant.teamId)
            {
                teamL.push(oParticipant.championId)
                lost = true
                spells.push([spell1Id, spell2Id])
            }
            else
            {
                enemyL.push(oParticipant.championId)
                spells.push([spell1Id, spell2Id])
            }
        }
    }

    CHAMPION_STATS.push({
        championId: championId,
        team: teamW.length === 0 ? teamL : teamW,
        enemy: enemyW.length === 0 ? enemyL : enemyW,
        won: won, 
        lost: lost,
        lane: lane,
        spells: spells
    })
}

function print(any)
{
    console.log(JSON.stringify(any, null, 4))
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

function check(data)
{
    if (!data.achieved)
    {
        data.currentState += 1
        if (data.currentState === data.targetState)
        {
            data.achieved = true;
        }
    }
}
function reset(data)
{
    for (let part of Object.values(data))
    {
        if (!part.achieved) part.currentState = 0;
    }
}

function allFirstChallenges(
    firstBloodKill, firstBloodAssist, firstTowerKill, firstTowerAssist, firstInhibitorKill, firstInhibitorAssist
)
{
    if (firstBloodKill && !CHALLENGES.firsts.bloodKill.complete)
    {
        for (let fbk of Object.values(CHALLENGES.firsts.bloodKill))
        {
            check(fbk)
        }
    }
    // else if (firstBloodAssist && !CHALLENGES.firsts.bloodAssist.complete)
    // {
    //     for (let fbk of Object.values(CHALLENGES.firsts.bloodAssist))
    //     {
    //         check(fbk)
    //     }
    // }
    // else if (firstTowerKill && !CHALLENGES.firsts.towerKill.complete)
    // {
    //     for (let fbk of Object.values(CHALLENGES.firsts.towerKill))
    //     {
    //         check(fbk)
    //     }
    // }
    // else if (firstTowerAssist && !CHALLENGES.firsts.towerAssist.complete)
    // {
    //     for (let fbk of Object.values(CHALLENGES.firsts.towerAssist))
    //     {
    //         check(fbk)
    //     }
    // }
    // else if (firstInhibitorKill && !CHALLENGES.firsts.inhibitorKill.complete)
    // {
    //     for (let fbk of Object.values(CHALLENGES.firsts.inhibitorKill))
    //     {
    //         check(fbk)
    //     }
    // }
    // else if (firstInhibitorAssist && !CHALLENGES.firsts.inhibitorAssist.complete)
    // {
    //     for (let fbk of Object.values(CHALLENGES.firsts.inhibitorAssist))
    //     {
    //         check(fbk)
    //     }
    // }
}

function doYouDealMostDmg(totalDamageDealt, totalDmg, totalDamageDealtToChampions, totalDmgToChamp )
{
    let dealtMostDmg = false;
    let dealtMostDmgToChamps = false;
    let currentHighestTotalDmg = totalDamageDealt;
    let currentHighestChampionDmg = totalDamageDealtToChampions;

    for (let index in totalDmg)
    {
        if (currentHighestTotalDmg < totalDmg[index])
        {
            currentHighestTotalDmg = totalDmg[index]
        }

        if (currentHighestChampionDmg < totalDmgToChamp[index])
        {
            currentHighestChampionDmg = totalDmgToChamp[index]
        }
    }

    if (currentHighestTotalDmg <= totalDamageDealt)
    {
        dealtMostDmg = true;   
    }

    if (currentHighestChampionDmg <= totalDamageDealtToChampions)
    {
        dealtMostDmgToChamps = true;
    }

    if (dealtMostDmg && !CHALLENGES.damages.total.complete)
    {
        for (let dt of Object.values(CHALLENGES.damages.total))
        {
            check(dt)
        }
    }

    if (dealtMostDmgToChamps && !CHALLENGES.damages.champion.complete)
    {
        for (let dc of Object.values(CHALLENGES.damages.champion))
        {
            check(dc)
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
    let totalDmg = []
    let totalDmgToChamp = []

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
            totalDmg.push(participants[x.participantId - 1].stats.totalDamageDealt)
            totalDmgToChamp.push(participants[x.participantId - 1].stats.totalDamageDealtToChampions)
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
        deaths, // 0 death games, - I am immortal amoungst mortals
        assists, // set them up, and watch them get knocked down K:A ration for supports and tanks
        largestKillingSpree, 
        largestMultiKill,
        killingSprees,
        longestTimeSpentLiving, // never gonna die - separate to 0 deaths for games
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
        totalDamageTaken, // 2 options - you can take a lot of abused - but with deaths, you tank a lot but don't die
        magicalDamageTaken,
        physicalDamageTaken,
        trueDamageTaken,
        goldEarned, // Richy-Rich
        goldSpent, // Baller!!
        turretKills, // you take objectives - tower destroyer
        inhibitorKills, // you take objectives - inhib destroyer
        totalMinionsKilled,
        neutralMinionsKilled,
        neutralMinionsKilledTeamJungle,
        neutralMinionsKilledEnemyJungle, // you pillage what others shant have
        totalTimeCrowdControlDealt, 
        champLevel, // if you are constantly ahead of your team mates or opponents in level by end of game or max level 18 in 10 games
        visionWardsBoughtInGame,// you seek to bring light
        sightWardsBoughtInGame, 
        wardsPlaced, // you are lighting the path 
        wardsKilled, // you seek to make them blind
        firstBloodKill, // are you the first blood king?
        firstBloodAssist, // seeking to get people ahead?
        firstTowerKill, // you take objectives - tower destroyer
        firstTowerAssist, // you take objectives - tower destroyer
        firstInhibitorKill, // you take objectives - inhib destroyer
        firstInhibitorAssist, // you take objectives - inhib destroyer
    } = stats

    allFirstChallenges(firstBloodKill, firstBloodAssist, firstTowerKill, firstTowerAssist, firstInhibitorKill, firstInhibitorAssist)
    //visionChallenges()
    // killingSprees(
    //     largestKillingSpree, 
    //     largestMultiKill,
    //     killingSprees,
    //     doubleKills,
    //     tripleKills,
    //     quadraKills,
    //     pentaKills )
    doYouDealMostDmg(totalDamageDealt, totalDmg, totalDamageDealtToChampions, totalDmgToChamp )


    let {role, lane} = timeline

    lane = lane === "NONE" ? "SUPPORT" : lane
    competitveData(lane, championId, teamId, participants, oIds)

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

    if (win)
    {
        // show what results matter when you win
    }
    else
    {

    }

    if (STATS.first)
    {
        STATS["first"] = {
            bloodKill: firstBloodKill ? STATS["first"].bloodKill + 1 : STATS["first"].bloodKill,
            bloodAssist: firstBloodAssist ? STATS["first"].bloodAssist + 1 : STATS["first"].bloodAssist,
            towerKills: firstTowerKill ? STATS["first"].towerKills + 1 : STATS["first"].towerKills,
            towerAssists: firstTowerAssist ? STATS["first"].towerAssists + 1 : STATS["first"].towerAssists,
            inhibitorKill: firstInhibitorKill ? STATS["first"].inhibitorKill + 1 : STATS["first"].inhibitorKill,
            inhibitorAssist: firstInhibitorAssist ? STATS["first"].inhibitorAssist + 1 : STATS["first"].inhibitorAssist
        }
    }
    else
    {
        STATS["first"] = {
            bloodKill: firstBloodKill ? 1 : 0,
            bloodAssist: firstBloodAssist ? 1 : 0,
            towerKills: firstTowerKill ? 1 : 0,
            towerAssists: firstTowerAssist ? 1 : 0,
            inhibitorKill: firstInhibitorKill ? 1 : 0,
            inhibitorAssist: firstInhibitorAssist ? 1 : 0,
        }
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
    print(CHALLENGES)
}

main()
