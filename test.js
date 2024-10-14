const champions = {
    "Aatrox": {
        "id": "Aatrox",
        "key": "266",
        "name": "Aatrox",
    },
    "Ahri": {
        "id": "Ahri",
        "key": "103",
        "name": "Ahri",
    },
    "Akali": {
        "id": "Akali",
        "key": "84",
        "name": "Akali",
    },
    "Akshan": {
        "id": "Akshan",
        "key": "166",
        "name": "Akshan",
    }
};

function getChampionNameByKey(key) {
    for (const champion in champions) {
        if (champions[champion].key === key) {
            return champions[champion].name;
        }
    }
    return "Campeão não encontrado";
}

const key = "84";
const championName = getChampionNameByKey(key);
console.log(championName); 