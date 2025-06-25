import { request } from "../utils/request";
import { action, flow, observable } from 'mobx';
import { save } from '../utils/Storage';
import Loading from "../components/Loading";

class GoStore {

    GoResInfo: any;
    GoMatrix: any;
    GoSGF: any;
    mgsInfo: any  = "网络连接错误。";

    requestCount = flow(function* (
        this: GoStore,
        token: string,
        rule: string,
        PB: string,
        PW: string,
        BR: string,
        WR: string,
        DT:string,
        PC:string,
        board:string,
        goImg:string,
        isrmHL:boolean,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('rule', rule);
            formData.append('PB', PB);
            formData.append('PW', PW);
            formData.append('BR', BR);
            formData.append('WR', WR);
            formData.append('DT', DT);
            formData.append('PC', PC);
            formData.append('board', board);
            formData.append('goImg', goImg);
            if (isrmHL){
                formData.append('isrmHL', 'True');
            }
            const { data } = yield request('getGoCount', formData);
            // console.log(data);
            // console.log(msg);
            if (data.state == 1) {
                this.mgsInfo = data.msg;
                this.GoResInfo = data.data;
                this.GoMatrix = data.Go;
                this.GoSGF = data.SGF;
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


    requestReCount = flow(function* (
        this: GoStore,
        token: string,
        rule: string,
        PB: string,
        PW: string,
        BR: string,
        WR: string,
        DT:string,
        PC:string,
        board:string,
        go_matrix:string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('rule', rule);
            formData.append('PB', PB);
            formData.append('PW', PW);
            formData.append('BR', BR);
            formData.append('WR', WR);
            formData.append('DT', DT);
            formData.append('PC', PC);
            formData.append('board', board);
            formData.append('go_matrix', go_matrix);
            const { data } = yield request('getReGoCount', formData);
            // console.log(data);
            // console.log(msg);
            if (data.state == 1) {
                this.mgsInfo = data.msg;
                this.GoResInfo = data.data;
                this.GoMatrix = data.Go;
                this.GoSGF = data.SGF;
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
export default new GoStore();