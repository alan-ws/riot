const read = require('fs').readFile;
const YOUR_REGION = "EUW1";
const RANK_QUEUE = 420;
const CURRENT_SEASON = 13;
const SUMMONER_NAME = "vJMark";

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
                doubleKills,
                tripleKills,
                quadraKills,
                pentaKills,
                totalDamageDealt,
                magicDamageDealt,
                physicalDamageDealt,
                trueDamageDealt,
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
                visionScore,
                timeCCingOthers,
                totalDamageTaken,
                magicalDamageTaken,
                physicalDamageTaken,
                trueDamageTaken,
                goldEarned,
                goldSpent,
                turretKills,
                inhibitorKills,
                totalMinionsKilled,
                neutralMinionsKilled,
                neutralMinionsKilledTeamJungle,
                neutralMinionsKilledEnemyJungle,
                totalTimeCrowdControlDealt,
                champLevel,
                visionWardsBoughtInGame,
                sightWardsBoughtInGame,
                wardsPlaced,
                wardsKilled,
                firstBloodKill,
                firstBloodAssist,
                firstTowerKill,
                firstTowerAssist,
                firstInhibitorKill,
                firstInhibitorAssist,
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
    read('./data/leagueEntries.json', 'utf8', (err, data) => {
        if (err)
        {
            console.log(`Error reading file from disk: ${err}`);
        }
        else
        {
            const {name, entries} = JSON.parse(data);

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
                // async build profiles(summonerId);
            })
        }
    })
}

function getQueue(summonerId)
{
    read('./data/queues.json', 'utf8', (err, data) => {
        if (err)
        {
            console.log(`Error reading file from disk: ${err}`);
        }
        else
        {
            JSON.parse(data).forEach((value) => {
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
    })
}

read('./data/summoner.json', 'utf8', (err, data) => {
    if (err)
    {
        console.log(`Error reading file from disk: ${err}`);
    }
    else
    {
        const {id, accountId, name, profileIconId, summonerLevel} = JSON.parse(data)
        getQueue(id)
        getMatches(id)
    }
});