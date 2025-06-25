import { request_ys } from "../utils/request_ys";
import { action, flow, observable } from 'mobx';
// import { save } from '../utils/Storage';
// import Loading from "../components/widget/Loading";

class GameStore {

    gameInfo: any;
    groupInfo: any;
    msgInfo: any = "网络连接错误。";



    requestGroupInfo = flow(function* (
        this: GameStore,
        game_id: string,
        callback: (success: boolean) => void) {
        // Loading.show();
        try {
            const params = {
                id: game_id,
                apipost_id: 802194,
            };
            const { data } = yield request_ys('getGroupList', params);
            // console.log(data);
            if (data.error == 0) {
                // console.log(data);
                this.groupInfo = data.data;
                callback?.(true);
            } else {
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.gameInfo = null;
            callback?.(false);
        } finally {
            // Loading.hide();
        }
    });

    requestGameInfoList = flow(function* (
        this: GameStore,
        group_id: string,
        seat_num: string,
        seat_num1: string,
        callback: (success: boolean) => void) {
        // Loading.show();
        try {
            const params = {
                group_id: group_id,
                seat_num: seat_num,
                seat_num1: seat_num1,
            };
            const { data } = yield request_ys('getGmaeInfoList', params);
            // console.log(data);
            if (data.error == 0) {
                // console.log(data);
                this.gameInfo = data.data;
                this.msgInfo = data.msg;
                callback?.(true);
            } else {
                this.msgInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.msgInfo = '网络连接错误。'
            this.gameInfo = null;
            callback?.(false);
        } finally {
            // Loading.hide();
        }
    });

    uploadGameRes = flow(function* (
        this: GameStore,
        result: string,
        against_plan_id: string,
        match_result_img: string,
        callback: (success: boolean) => void) {
        // Loading.show();
        try {
            const formData = new FormData();
            formData.append('result', result);
            formData.append('against_plan_id', against_plan_id);
            formData.append('match_result_img', match_result_img);
            const { data } = yield request_ys('uploadGameRes', formData);
            console.log(data);
            if (data.error == 0) {
                console.log(data.msg);
                this.msgInfo = data.msg;
                callback?.(true);
            } else {
                this.msgInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.gameInfo = null;
            callback?.(false);
        } finally {
            // Loading.hide();
        }
    });
}

// ESM单例导出
export default new GameStore();