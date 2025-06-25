import { request } from "../utils/request";
import { action, flow, observable } from 'mobx';
import Loading from "../components/Loading";

const pageSize = 10;
class GameStoreM {

    MyGameInfo: any;
    mgsInfo: any = "网络连接错误。";
    // recordId: any;
    isExistResData: any;
    originImgUrl: any;
    pageIndex: number = 1;
    refreshing: boolean = false;

    
    resetPage = () => {
        this.pageIndex = 1;
    }


    requestMyGameList = flow(function* (
        this: GameStoreM,
        token: string,
        my: string,
        bwName: string,
        againstPlanId: string,
        sTime: string,
        eTime: string,
        judgeId: string,
        callback: (success: boolean) => void) {
        if (this.refreshing) {
            return;
        }
        Loading.show();
        try {
            this.refreshing = true;
            const formData = new FormData();
            formData.append('token', token);
            formData.append('my', my);
            formData.append('bwName', bwName);
            formData.append('againstPlanId', againstPlanId);
            formData.append('sTime', sTime);
            formData.append('eTime', eTime);
            formData.append('judgeId', judgeId);
            formData.append('pageIndex', this.pageIndex.toString());
            formData.append('pageSize', pageSize.toString());
            const { data } = yield request('getMyHistory', formData);
            // console.log(data);
            // console.log(msg);
            if (data.state == 1) {
                if (this.pageIndex === 1) {
                    this.mgsInfo = data.msg;
                    this.MyGameInfo = data.data;
                } else {
                    this.MyGameInfo = [...this.MyGameInfo, ...data.data];
                    this.mgsInfo = data.msg;
                }
                this.pageIndex = this.pageIndex + 1;
                console.log(this.pageIndex)
                this.refreshing = false;
                callback?.(true);
            } else {
                if (this.pageIndex === 1) {
                    this.MyGameInfo = [];
                    this.mgsInfo = "无数据"
                }else{
                    this.mgsInfo = "没有更多数据了"
                }
                this.refreshing = false;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.refreshing = false;
            callback?.(false);
        } finally {
            this.refreshing = false;
            Loading.hide();
        }
    });

    uploadGame = flow(function* (
        this: GameStoreM,
        againstPlanId: string,
        groupId: string,
        seatNum1: string,
        seatNum2: string,
        blackName: string,
        whiteName: string,
        goData: string,
        blackNum: string,
        whiteNum: string,
        winRes: string,
        blackSign: string,
        whiteSign: string,
        judge: string,
        gTime: string,
        blackCount: string,
        whiteCount: string,
        goMatrix: string,
        originImg: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('againstPlanId', againstPlanId); formData.append('goData', goData);
            formData.append('groupId', groupId); formData.append('blackNum', blackNum);
            formData.append('seatNum1', seatNum1); formData.append('whiteNum', whiteNum);
            formData.append('blackName', blackName); formData.append('winRes', winRes);
            formData.append('whiteName', whiteName); formData.append('blackSign', blackSign);
            formData.append('whiteSign', whiteSign); formData.append('judge', judge);
            formData.append('gTime', gTime); formData.append('blackCount', blackCount);
            formData.append('whiteCount', whiteCount); formData.append('goMatrix', goMatrix);
            formData.append('originImg', originImg); formData.append('seatNum2', seatNum2);
            const { data } = yield request('uploadGame', formData);
            // console.log(msg);
            if (data.state == 1) {
                this.originImgUrl = data.data;
                this.mgsInfo = data.msg;
                callback?.(true);
            } else {
                this.mgsInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.mgsInfo = "网络连接错误。";
            callback?.(false);
        } finally {
            Loading.hide();
        }
    });

    uploadGame2 = flow(function* (
        this: GameStoreM,
        againstPlanId: string,
        groupId: string,
        seatNum1: string,
        seatNum2: string,
        goData: string,
        blackNum: string,
        whiteNum: string,
        winRes: string,
        blackCount: string,
        whiteCount: string,
        goMatrix: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('againstPlanId', againstPlanId); formData.append('goData', goData);
            formData.append('groupId', groupId); formData.append('blackNum', blackNum);
            formData.append('whiteNum', whiteNum); formData.append('winRes', winRes);
            formData.append('blackCount', blackCount); formData.append('whiteCount', whiteCount);
            formData.append('goMatrix', goMatrix);
            formData.append('seatNum1', seatNum1); formData.append('seatNum2', seatNum2);
            const { data } = yield request('uploadGame2', formData);
            // console.log(msg);
            if (data.state == 1) {
                this.mgsInfo = data.msg;
                callback?.(true);
            } else {
                this.mgsInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            callback?.(false);
        } finally {
            Loading.hide();
        }
    });


    recordGame = flow(function* (
        this: GameStoreM,
        againstPlanId: string,
        groupId: string,
        seatNum1: string,
        seatNum2: string,
        blackName: string,
        whiteName: string,
        judge: string,
        gTime: string,
        rounds: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('againstPlanId', againstPlanId);
            formData.append('groupId', groupId);
            formData.append('seatNum1', seatNum1);
            formData.append('seatNum2', seatNum2);
            formData.append('blackName', blackName);
            formData.append('whiteName', whiteName);
            formData.append('judge', judge);
            formData.append('gTime', gTime);
            formData.append('rounds', rounds);
            const { data } = yield request('recordGame', formData);
            // console.log(msg);
            if (data.state == 1) {
                this.mgsInfo = data.msg;
                callback?.(true);
            } else {
                this.mgsInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.mgsInfo = "网络连接错误。";
            callback?.(false);
        } finally {
            Loading.hide();
        }
    });

    // getRecordGameId = flow(function* (
    //     this: GameStoreM,
    //     gameName: string,
    //     groupId: string,
    //     callback: (success: boolean) => void) {
    //     Loading.show();
    //     try {
    //         const formData = new FormData();
    //         formData.append('gameName', gameName); 
    //         formData.append('groupId', groupId);
    //         const { data } = yield request('getRecordGameId', formData);
    //         // console.log(msg);
    //         if (data.state == 1) {
    //             this.recordId = data.data;
    //             this.mgsInfo = data.msg;
    //             callback?.(true);
    //         } else {
    //             this.mgsInfo = data.msg;
    //             callback?.(false);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         callback?.(false);
    //     } finally {
    //         Loading.hide();
    //     }
    // });

    // updateRecordGameById = flow(function* (
    //     this: GameStoreM,
    //     id: string,
    //     gameName: string,
    //     groupId: string,
    //     seatNum: string,
    //     blackName: string,
    //     whiteName: string,
    //     judge: string,
    //     gTime: string,
    //     callback: (success: boolean) => void) {
    //     Loading.show();
    //     try {
    //         const formData = new FormData();
    //         formData.append('id', id); 
    //         formData.append('gameName', gameName); 
    //         formData.append('groupId', groupId); 
    //         formData.append('seatNum', seatNum); 
    //         formData.append('blackName', blackName);
    //         formData.append('whiteName', whiteName);
    //         formData.append('judge', judge);
    //         formData.append('gTime', gTime); 
    //         const { data } = yield request('updateRecordGameById', formData);
    //         // console.log(msg);
    //         if (data.state == 1) {
    //             this.mgsInfo = data.msg;
    //             callback?.(true);
    //         } else {
    //             this.mgsInfo = data.msg;
    //             callback?.(false);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         callback?.(false);
    //     } finally {
    //         Loading.hide();
    //     }
    // });

    // updateRecordGameById = flow(function* (
    //     this: GameStoreM,
    //     id: string,
    //     seatNum: string,
    //     callback: (success: boolean) => void) {
    //     Loading.show();
    //     try {
    //         const formData = new FormData();
    //         formData.append('id', id); 
    //         formData.append('seatNum', seatNum);
    //         const { data } = yield request('updateRecordGameById', formData);
    //         // console.log(msg);
    //         if (data.state == 1) {
    //             this.mgsInfo = data.msg;
    //             callback?.(true);
    //         } else {
    //             this.mgsInfo = data.msg;
    //             callback?.(false);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         callback?.(false);
    //     } finally {
    //         Loading.hide();
    //     }
    // });

    isExistRes = flow(function* (
        this: GameStoreM,
        againstPlanId: string,
        groupId: string,
        seatNum1: string,
        seatNum2: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('againstPlanId', againstPlanId);
            formData.append('groupId', groupId);
            formData.append('seatNum1', seatNum1);
            formData.append('seatNum2', seatNum2);
            const { data } = yield request('isExistRes', formData);
            // console.log(msg);
            if (data.state == 1) {
                this.isExistResData = data.data;
                this.mgsInfo = data.msg;
                callback?.(true);
            } else {
                this.mgsInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            callback?.(false);
        } finally {
            Loading.hide();
        }
    });
}

// ESM单例导出
export default new GameStoreM();