import axios from "axios";

const BASE_URL = 'http://localhost:5000/api/'

function createBaseConfig(){
    return { headers: { 'Content-Type' : 'application/json' } }
}

function createConfig(body){
    return {
        headers: {
            'Content-Type': 'application/json',
        },
        data: body
    }
}

function signIn(body){
    const config = createBaseConfig();
    const promise = axios.post(`${BASE_URL}users/signin`, body, config);
    return promise;
}

function signUp(body){
    const config = createBaseConfig();
    const promise = axios.post(`${BASE_URL}users/create`, body, config);
    return promise;
}

function createDiaryMessage(body){
    const config = createBaseConfig();
    const promise = axios.post(`${BASE_URL}diary/create`, body, config);
    return promise;
}

function getDiaryByUsername(username){
    const promise = axios.get(`${BASE_URL}diary/${username}`);
    return promise;
}

function updateDiaryMessage(body){
    const config = createBaseConfig();
    const promise = axios.put(`${BASE_URL}diary/update`, body, config);
    return promise;
}

function deleteDiaryByUsernameAndDate(body){
    const config = createConfig(body);
    const promise = axios.delete(`${BASE_URL}diary/delete`, config);
    return promise;
}

function createMood(body){
    const config = createBaseConfig();
    const promise = axios.post(`${BASE_URL}mood/create`, body, config);
    return promise;
}

function getMoodByUsername(username){
    const config = createBaseConfig();
    const promise = axios.get(`${BASE_URL}mood/${username}`, config);
    return promise;
}

const api = {
    signIn,
    signUp,
    createDiaryMessage,
    getDiaryByUsername,
    updateDiaryMessage,
    deleteDiaryByUsernameAndDate,
    createMood,
    getMoodByUsername,
}

export default api;