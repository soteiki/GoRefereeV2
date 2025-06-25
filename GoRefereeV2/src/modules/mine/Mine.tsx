import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { load, remove } from '../../utils/Storage';
import UserStore from '../../Method/UserStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import backgroud from '../../assets/img/BG.png';
import caipan from '../../assets/img/caipan1.png';
import titlebg from '../../assets/img/home/home_title.png';
import returnBtn from '../../assets/img/return.png';
import Toast from '../../components/Toast';

export default () => {

    const navigation = useNavigation<StackNavigationProp<any>>();
    const [uname, setUname] = useState<string>('加载中...');
    const [rname, setRname] = useState<string>('加载中...');
    const [page, setPage] = useState<number>(0);
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [theToken, setTheToken] = useState<string>('');
    const [vipDate, setVipDate] = useState('');
    const [judgeId, setJudgeId] = useState('');
    useEffect(() => {
        getToken();
        getUserInfo();
    }, []);

    const getToken = async () => {
        if (theToken !== '') {
            return;
        }
        const cacheUserInfo = await load('userInfo');
        if (cacheUserInfo && JSON.parse(cacheUserInfo)) {
            // console.log('有用户缓存信息');
            const token: string = JSON.parse(cacheUserInfo).data;
            setTheToken(token);
        }
    }

    const getUserInfo = async () => {
        const cacheUserAllInfo = await load('userAllInfo');
        if (cacheUserAllInfo && JSON.parse(cacheUserAllInfo)) {
            // console.log(`从缓存中取到的数据：${cacheUserAllInfo}`);
            setUname(JSON.parse(cacheUserAllInfo).data[1]);
            setRname(JSON.parse(cacheUserAllInfo).data[2]);
            setVipDate(JSON.parse(cacheUserAllInfo).data[10]);
            setJudgeId(JSON.parse(cacheUserAllInfo).data[0]);
        } else {
            const cacheUserInfo = await load('userInfo');
            if (cacheUserInfo && JSON.parse(cacheUserInfo)) {
                // console.log('有用户缓存信息');
                const token: string = JSON.parse(cacheUserInfo).data;
                UserStore.requestInfo(token, (success: boolean) => {
                    if (success) {
                        // console.log('用户信息获取成功');
                        setUname(UserStore.userAllInfo[1]);
                        setRname(UserStore.userAllInfo[2]);
                        setVipDate(UserStore.userAllInfo[10]);
                        setJudgeId(UserStore.userAllInfo[0]);
                    } else {
                        console.log('用户信息获取失败');
                    }
                })
                console.log('没有用户缓存信息');
            }
        }
    }

    const logout = () => {
        remove('userInfo');
        remove('userAllInfo');
        navigation.replace('LoginRegister');
    }

    const updatePassword = () => {
        setPage(1);
    }

    const updatePwd = () => {
        if (password === '') {
            Toast.show('请输入原始密码');
            return;
        }
        if (newPassword === '') {
            Toast.show('请输入新密码');
            return;
        }
        if (password === newPassword) {
            Toast.show('新密码不能与原始密码相同');
            return;
        }
        UserStore.updatePassword(theToken, password, newPassword, (success: boolean) => {
            if (success) {
                Toast.show('修改成功');
                setPage(0);
            } else {
                Toast.show('修改失败');
            }
        })
    }

    return (
        <ImageBackground source={backgroud} style={styles.root}>
            <View style={styles.txv}>
                <View style={styles.tx}>
                    <Image source={caipan} style={styles.tximg} />
                    <Text style={styles.txtxt}>
                        {rname}{" "}{" "}{vipDate == '' ? "加载中" : (new Date(vipDate)).toISOString().split('T')[0]} {vipDate == '' ? " " : (new Date(vipDate)).toISOString().split('T')[1].substring(0, 8)}{" 权限到期"}
                    </Text>
                </View>
            </View>
            {
                page === 0 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>个人中心</Text>
                    </ImageBackground>
                    <View style={styles.txtv}>
                        <View style={styles.txtv2}>
                            <Text style={styles.txtv2txt}>用户名: </Text>
                            <Text style={styles.txtv2txt2}>{uname}</Text>
                        </View>
                        <View style={styles.txtv2}>
                            <Text style={styles.txtv2txt}>裁判员姓名: </Text>
                            <Text style={styles.txtv2txt2}>{rname}</Text>
                        </View>
                    </View>
                    <View style={styles.btnv}>
                        <TouchableOpacity
                            style={styles.btn1}
                            onPress={updatePassword}
                        >
                            <Text style={{ color: 'white', fontSize: 18 }}>修改密码</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn1, { backgroundColor: '#999999', marginLeft: 100 }]}
                            onPress={logout}
                        >
                            <Text style={{ color: 'white', fontSize: 18 }}>退</Text>
                            <Text style={{ color: 'white', marginLeft: 10, fontSize: 18 }}>出</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {
                page === 1 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>修改密码</Text>
                        <TouchableOpacity
                            onPress={() => { setPage(0) }}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <KeyboardAvoidingView style={{height:300,backgroundColor:'white'}} behavior='padding' keyboardVerticalOffset={100}>
                        <ScrollView style={[styles.inputv1]}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps="always">
                            <View style={styles.inputv2}>
                                <Text style={styles.txtpwd}>原密码:</Text>
                                <TextInput
                                    placeholder='请输入原始密码'
                                    placeholderTextColor='#999999'
                                    style={styles.input1}
                                    onChange={(e) => { setPassword(e.nativeEvent.text) }}
                                    secureTextEntry={true}
                                />
                            </View>

                            {/* <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={100}> */}
                            {/* <View style={[styles.inputv2, keyboardStatus ? {} : { marginBottom: 150 }]}> */}
                            <View style={styles.inputv2}>
                                <Text style={styles.txtpwd}>新密码:</Text>
                                <TextInput
                                    placeholder='请输入原始密码'
                                    placeholderTextColor='#999999'
                                    style={styles.input1}
                                    onChange={(e) => { setNewPassword(e.nativeEvent.text) }}
                                    secureTextEntry={true}
                                />
                            </View>
                            {/* </KeyboardAvoidingView> */}
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={styles.btnv2}>
                        <TouchableOpacity
                            style={styles.btn1}
                            onPress={updatePwd}
                        >
                            <Text style={{ color: 'white', fontSize: 18 }}>修改密码</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            }

        </ImageBackground>
    )

}
const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    txv: {
        width: '92%',
        height: 50,
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tx: {
        width: 350,
        height: 40,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
    },
    tximg: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#D0D0D0',
    },
    txtxt: {
        fontSize: 16,
        marginLeft: 10,
    },
    content: {
        // width: 900,
        width: '92%',
        // height: 460,
        height: 440,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: .25,
        shadowRadius: 2.5,
        elevation: 3,
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        // marginTop: 15,
    },
    content_title: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content_title_txt: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    txtv: {
        width: 400,
        height: 200,
        // backgroundColor: 'pink',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtv2: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    txtv2txt: {
        fontSize: 20,
        width: 200,
        textAlign: 'right',
        // backgroundColor:'yellow'
    },
    txtv2txt2: {
        fontSize: 20,
        width: 200,
        textAlign: 'left'
    },
    btnv: {
        // backgroundColor: 'pink',
        width: 600,
        height: 100,
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn1: {
        height: 35,
        width: 160,
        backgroundColor: "#a25f24",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        // marginLeft: 90,
        marginTop: 20,
    },
    back: {
        position: 'absolute',
        right: -15,
        top: -45,
        flexDirection: 'row'
    },
    backtxt: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputv1: {
        width: 500,
        height: 100,
        flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: 'pink',
    },
    inputv2: {
        width: 500,
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    input1: {
        width: 300,
        height: 50,
        backgroundColor: '#eeeeee',
        fontSize: 18,
        paddingTop: -10,
        paddingBottom: -10,
    },
    txtpwd: {
        width: 200,
        // height: 50,
        fontSize: 18,
        textAlign: 'right',
        paddingRight: 30,
    },
    btnv2: {
        width: 500,
        height: 100,
        // backgroundColor: 'pink',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    }

});