import React, { useEffect } from 'react';
import {
    Text,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { load } from '../../utils/Storage';
import UserStore from '../../Method/UserStore';
import backgroud from '../../assets/img/BG.png'
import Toast from '../../components/Toast';

export default () => {

    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        setTimeout(()=>{
            getUserInfo();
        }, 2000);
    }, []);

    const getUserInfo = async () => {
        const cacheUserInfo = await load('userInfo');
        if(cacheUserInfo && JSON.parse(cacheUserInfo)){
            // const token = JSON.parse(cacheUserInfo)
            // console.log(token.data)
            UserStore.checkJWT(JSON.parse(cacheUserInfo).data,(success: boolean) => {
                if (success) {
                    // navigation.replace('Login');
                    console.log('jwt有效')
                    startHome();
                } else {
                    // console.log('注册失败')
                    Toast.show(UserStore.jwtInfo)
                    startLogin();
                }
            })
        }else{
            startLogin();
        }
    }

    const startLogin = () => {
        navigation.replace('LoginRegister');
    }

    const startHome = () => {
        navigation.replace('MainTab');
    }

    return (
        <ImageBackground source={backgroud} style={styles.root}>
            <Text style={styles.content_txt}>欢迎使用智能围棋裁判</Text>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content_txt: {
        fontSize: 44,
        color: '#000000',
        fontWeight: 'bold',
        fontFamily: 'KaiTi',
    }

});