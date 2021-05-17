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

const baseUrl = `https://${YOUR_REGION}.api.riotgames.com/`;


function print(any)
{
    console.log(any)
}

function getTeamData(team)
{
    const {
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
}

function getMatchDetails(matchId)
{
    read('./data/matchId.json', 'utf8', (err, data) => {
        if (err)
        {
            console.log(`Error reading file from disk: ${err}`);
        }
        else
        {
            const {gameDuration, teams, participants, participantIdentities} = JSON.parse(data);
            const team1 = teams[0]
            const team2 = teams[1]
            getTeamData(team1)
            getTeamData(team2)
            let pId = 1;
            for (let x of participantIdentities)
            {
                if (x.player.summonerName == SUMMONER_NAME)
                {
                    pId = x.participantId;
                }
                else
                {
                    // async buildProfile(x.player.accountId / summonerName / summonerId)
                }
            }
            
            const participant = participants[pId - 1];
            const {
                championId, // find out played champions
                spell1Id, // group with role and champion played
                spell2Id, // group with role and champion played
                stats,
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
                timeline
            } = participant

            const {role, lane} = timeline
            // list commonly played roles
            // challenges are based on these
        }
    })
}

function getMatches(summonerId)
{
    read('./data/matches.json', 'utf8', (err, data) => {
        if (err)
        {
            console.log(`Error reading file from disk: ${err}`);
        }
        else
        {
            JSON.parse(data).matches.forEach((value) => {
                if (value.platformId == YOUR_REGION
                    && value.queue == RANK_QUEUE
                    && value.season == CURRENT_SEASON )
                {
                    const {gameId} = value;
                    // gameid used to store the match
                    getMatchDetails(gameId);
                }
            })
        }
    })
}

function getLeagueEntries(leagueId, tier)
{
    const allLeagueEntries = (leagueId) => `lol/league/v4/leagues/${leagueId}`
    const res = await axios.get(baseUrl + allLeagueEntries(summonerId), {
        headers: HEADER
    });

    const {name, entries} = res.data;
    // display your league name and players in the league

    entries.forEach((value) => {
        const {
            summonerId,
            summonerName,
            leaguePoints,
            rank,
            wins,
            losses,
            veteran,
            inactive,
            freshBlood,
            hotStreak
        } = value;
    })
}

function getQueue(summonerId)
{
    const allQueues = (summonerId) => `lol/league/v4/entries/by-summoner/${summonerId}`
    const res = await axios.get(baseUrl + allQueues(summonerId), {
        headers: HEADER
    });

    const { leagueId, tier, rank, leaguePoints, wins, losses, veteran, inactive, freshBlood, hotStreak } = res.data;
    res.data.forEach((value) => {
        if (value.queueType === "RANKED_SOLO_5x5")
        {
            const { leagueId, tier, rank, leaguePoints, wins, losses, veteran, inactive, freshBlood, hotStreak } = value;
            // icons for veteran, freshblood, hotsreak, inactive
            // W:L ratio and stats
            // tier rank lp
            getLeagueEntries(leagueId, tier);
        }
    })
}

async function getSummoner(summonerName)
{
    const summonerDetails = (summonerName) => `lol/summoner/v4/summoners/by-name/${summonerName}`
    ///const summonerDetails = (encryptedAccountId) => `lol/summoner/v4/summoners/by-account/{encryptedAccountId}`
    ///const summonerDetails = (encryptedSummonerId) => `lol/summoner/v4/summoners/{encryptedSummonerId}`

    const res = await axios.get(baseUrl + summonerDetails(summonerName), {
        headers: HEADER
    });
    
    const {id, accountId, name, profileIconId, summonerLevel} = res.data
    getQueue(id)
    getMatches(id)
}

getSummoner("vJMark");

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