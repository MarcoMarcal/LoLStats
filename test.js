const fs = require('fs');
require('dotenv').config()

const champions = JSON.parse(fs.readFileSync('champions.json', 'utf8')).data;

function getChampionDetailsByKey(key) {
    for (const champion in champions) {
        if (champions[champion].key === key) {
            return {
                id: champions[champion].id,
                name: champions[champion].name,
                title: champions[champion].title,
                blurb: champions[champion].blurb,
                version: champions[champion].version,
                tags: champions[champion].tags,
                partype: champions[champion].partype,
                stats: {
                    hp: champions[champion].stats.hp,
                    hpperlevel: champions[champion].stats.hpperlevel,
                    mp: champions[champion].stats.mp,
                    mpperlevel: champions[champion].stats.mpperlevel,
                    movespeed: champions[champion].stats.movespeed,
                    armor: champions[champion].stats.armor,
                    armorperlevel: champions[champion].stats.armorperlevel,
                    spellblock: champions[champion].stats.spellblock,
                    spellblockperlevel: champions[champion].stats.spellblockperlevel,
                    attackrange: champions[champion].stats.attackrange,
                    hpregen: champions[champion].stats.hpregen,
                    hpregenperlevel: champions[champion].stats.hpregenperlevel,
                    mpregen: champions[champion].stats.mpregen,
                    mpregenperlevel: champions[champion].stats.mpregenperlevel,
                    crit: champions[champion].stats.crit,
                    critperlevel: champions[champion].stats.critperlevel,
                    attackdamage: champions[champion].stats.attackdamage,
                    attackdamageperlevel: champions[champion].stats.attackdamageperlevel,
                    attackspeed: champions[champion].stats.attackspeed,
                    attackspeedperlevel: champions[champion].stats.attackspeedperlevel
                }
            };
        }
    }
    return null;
}

async function getChampionRotations() {
    try {
        const response = await fetch('https://br1.api.riotgames.com/lol/platform/v3/champion-rotations/', {
            headers: {
                'X-Riot-Token': process.env.APIKEY
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('deu ruim:', errorData);
            console.log(process.env.APIKEY)
            return;
        }

        const data = await response.json();
        console.log('Key dos campeões gratuitos:', data.freeChampionIds);

        for (const championId of data.freeChampionIds) {
            const championDetails = getChampionDetailsByKey(championId.toString());

            if (championDetails) {
                console.log(`
                    Key: ${championId}, 
                    Nome: ${championDetails.name}, 
                    Vida: ${championDetails.stats.hp}, 
                    Dano de Ataque: ${championDetails.stats.attackdamage}
                `);
            } else {
                console.log(`Campeão com Key: ${championId} não encontrado.`);
            }
        }
    } catch (error) {
        console.error('Deu ruim:', error);
    }
}

getChampionRotations();
