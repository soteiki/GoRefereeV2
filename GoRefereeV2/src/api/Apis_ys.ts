const apiConfig = {
    getYSToken: {
        url: '/oauth/token',
        method: 'post',
    },
    getGroupList: {
        url: '/api/referee-app/events/',
        method: 'get',
    },
    getGmaeInfoList:{
        url :'/api/referee-app/match-table',
        method:'get',
    },
    uploadGameRes:{
        url:'/api/referee-app/result',
        method:'post',
    },
    
}

export default apiConfig;