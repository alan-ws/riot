const read = require('fs').readFile;


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
    }
});
