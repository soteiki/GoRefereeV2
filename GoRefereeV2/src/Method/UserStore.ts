import { request } from "../utils/request";
import { action, flow, observable } from 'mobx';
import { save } from '../utils/Storage';
import Loading from "../components/Loading";

class UserStore {

    // @observable userInfo: any;
    userInfo: any;
    mgsInfo: any  = "网络连接错误。";
    userAllInfo: any;
    jwtInfo: any;


    requestLogin = flow(function* (
        this: UserStore,
        username: string,
        pwd: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            // const params = {
            //     username: username,
            //     password: pwd,
            // };
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', pwd);
            const { data } = yield request('login', formData);
            if (data.state == 1) {
                save('userInfo', JSON.stringify(data));
                this.userInfo = data;
                this.mgsInfo = data.msg;
                callback?.(true);
            } else {
                this.userInfo = null;
                this.mgsInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.userInfo = null;
            callback?.(false);
        } finally {
            Loading.hide();
        }
    });


    requestRegister = flow(function* (
        this: UserStore,
        username: string,
        realname: string,
        pwd: string,
        isJudge: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            // const params = {
            //     username: username,
            //     password: pwd,
            // };
            const formData = new FormData();
            formData.append('username', username);
            formData.append('realname', realname);
            formData.append('password', pwd);
            formData.append('isJudge', isJudge);
            const { data } = yield request('register', formData);
            // console.log(data.state);
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

    requestInfo = flow(function* (
        this: UserStore,
        token: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            // const params = {
            //     username: username,
            //     password: pwd,
            // };
            const formData = new FormData();
            formData.append('token', token);
            const { data } = yield request('getInfo', formData);
            // console.log(data.state);
            // console.log(msg);
            if (data.state == 1) {
                save('userAllInfo', JSON.stringify(data));
                this.userAllInfo = data.data;
                this.mgsInfo = data.msg;
                callback?.(true);
            } else {
                this.mgsInfo = data.msg;
                callback?.(false);
            }
        } catch (error) {
            console.log(error);
            this.userAllInfo = null;
            callback?.(false);
        } finally {
            Loading.hide();
        }
    });

    updatePassword = flow(function* (
        this: UserStore,
        token: string,
        password: string,
        password2: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('password', password);
            formData.append('password2', password2);
            const { data } = yield request('updatePwd', formData);
            // console.log(data.state);
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

    checkJWT = flow(function* (
        this: UserStore,
        token: string,
        callback: (success: boolean) => void) {
        Loading.show();
        try {
            const formData = new FormData();
            formData.append('token', token);
            const { data } = yield request('checkJWT', formData);
            // console.log(data.state);
            // console.log(msg);
            if (data.state == 1) {
                this.jwtInfo = data.msg;
                callback?.(true);
            } else {
                this.jwtInfo = data.msg;
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
export default new UserStore();