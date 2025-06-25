const apiConfig = {
    test: {
        url: '/',
        method: 'get',
    },
    login: {
        url: '/login',
        method: 'post',
    },
    register: {
        url: '/register',
        method: 'post',
    },
    getInfo: {
        url: '/getInfo',
        method: 'post',
    },
    getGoCount: {
        url: '/goImg_process/res_go',
        method: 'post',
    },
    getReGoCount: {
        url: '/update_go',
        method: 'post',
    },
    getMyHistory: {
        url: '/get_game',
        method: 'post',
    },
    uploadGame: {
        url: '/upload_game',
        method: 'post',
    },
    uploadGame2: {
        url: '/upload_game2',
        method: 'post',
    },
    updatePwd: {
        url: '/updatePwd',
        method: 'post',
    },
    checkJWT: {
        url: '/checkJwt',
        method: 'post',
    },
    recordGame: {
        url: '/record_game',
        method: 'post',
    },
    isExistRes:{
        url: '/get_is_exist_res',
        method: 'post',
    },
    


}

export default apiConfig;