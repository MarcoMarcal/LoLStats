const express = require('express');
const path = require('path');
const ejsLocals = require('ejs-locals');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o diretório para as views
app.set('views', path.join(__dirname, 'views'));
// Definir o motor de template como EJS
app.set('view engine', 'ejs');


const API_KEY = "RGAPI-c13d2aa6-1cae-422e-b63e-f98fad9d82ed"

app.use(bodyParser.urlencoded({ extended: true }));

async function getUserId(tagLine, gameName) {
    const init = {
        method: 'GET',
        headers: {
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": API_KEY
        },
    };

    try {
        const responseHttp = await fetch(
            `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${tagLine}/${gameName}`, init
        );

        if (responseHttp.ok) {
            const data = await responseHttp.json();
            return data; 
        } else if (responseHttp.status === 404) {
            throw new Error('Conta não existe');
        } else {
            const errorData = await responseHttp.json();
            throw new Error('deu ruim');
        }
    } catch (error) {
        console.error(`Erro ao chamar a API: ${error.message}`);
        throw error;
    }
}

//PUXA PARTIDAS

const start = 0;
const count = 1;

const getMatchIds = async (puuid) => {
    try {
        const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`, {
            method: 'GET',
            headers: {
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://developer.riotgames.com',
                'X-Riot-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const matchIds = await response.json(); 
        console.log(matchIds)
        return matchIds;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


//CONSULTA A PARTIDA

const getMatchById = async (IdMatch) => {
    try {
        const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${IdMatch}`, {
            method: 'GET',
            headers: {
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://developer.riotgames.com',
                'X-Riot-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

async function getFreeChampions() {
    const init = {
        method: 'GET',
        headers: {
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": API_KEY
        },
    };

    try {
        const responseHttp = await fetch(
            `https://americas.api.riotgames.com/lol/platform/v3/champion-rotations`, init
        );

        if (responseHttp.ok) {
            const data = await responseHttp.json();
            return data; 
        } else if (responseHttp.status === 404) {
            throw new Error('Conta não existe');
        } else {
            const errorData = await responseHttp.json();
            throw new Error('deu ruim');
        }
    } catch (error) {
        console.error(`Erro ao chamar a API: ${error.message}`);
        throw error;
    }
}



app.get('/', (req, res) => {
        res.render('index'); 
});

app.get('/rotacao', (req, res) => {
    res.render('layout')
});


app.get('/dev2', (req, res) => {
    res.send(gameNameTag)
})

app.post('/dev', async (req, res) => {
    const gameNameTag = req.body.gameNameTag;
    const buttonName = req.body.submitButton;
    gameNameTagseparado = gameNameTag.split('#')
    console.log
    console.log(gameNameTag)
    try {
        const userData = await getUserId(gameNameTagseparado[0], gameNameTagseparado[1]);
        console.log(userData);
        const data = { 
            title: 'Stats of legends', 
            puuid: userData.puuid,
            gameName: userData.gameName,
            tagLine: userData.tagLine,
            buttonName: buttonName
        };  

        const matchIds = await getMatchIds(userData.puuid); 
        const matchId = matchIds[0];
        const matchData = await getMatchById(matchId); 
        data.matchData = matchData;

        const matchs = {
            duracao: matchData.info.gameDuration / 60, 
        };
        console.log(matchs.duracao)
        const renderData = { data, matchs };

        res.render('dev2', renderData); 
    } catch (error) {
        console.error(error);
        res.status(500).send(`erro conta: ${error.message}`);
    }
})



app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})
