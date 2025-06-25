import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ImageBackground,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import UserStore from '../../Method/UserStore';

import backgroud from '../../assets/img/BG.png'
import weiqi from '../../assets/img/register/FG01_1.png'
import Toast from '../../components/Toast';

export default () => {
    const isJudge = '1';
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigation = useNavigation<StackNavigationProp<any>>();
    
    const Register = async () => {
        if (userName?.length < 5) {
            Toast.show('用户名长度不能小于5');
            return;
        }
        if (name?.length < 1) {
            Toast.show('名称不能为空');
            return;
        }
        if (password?.length < 6) {
            Toast.show('密码长度不能小于6');
            return;
        }
        if (password !== password2) {
            Toast.show('两次密码不一致');
            return;
        }
        UserStore.requestRegister(userName, name, password, isJudge,(success: boolean) => {
            if (success) {
                // navigation.replace('Login');
                // console.log('注册成功')
                Toast.show('注册成功')
                setIsLogin(true)
            } else {
                // console.log('注册失败')
                Toast.show('注册失败,' + UserStore.mgsInfo)
            }
        })
    }


    const onLoginPress = async () => {
        UserStore.requestLogin(userName,password,(success: boolean) => {
            if (success) {
                Toast.show('登陆成功')
                navigation.replace('MainTab');
            } else {
                Toast.show('登陆失败，' + UserStore.mgsInfo);
                // console.log('登录失败')
            }
        })

    }

    return (
        <View style={styles.root}>
            <ImageBackground source={backgroud} style={styles.bg}>
                <View style={styles.v1}>
                    <Image source={weiqi} style={styles.v1_img} />
                    <View style={styles.v2}>
                        <View style={styles.title}>
                            <Text style={styles.title1}>智能围棋裁判</Text>
                            <TouchableOpacity
                                onPress={() => { setIsLogin(false) }}
                            >
                                <Text style={[styles.title2, isLogin ? { color: '#dadada' } : { fontWeight: 'bold', color: '#3a3a3a' }]}>注册</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setIsLogin(true) }}
                            >
                                <Text style={[styles.title3, isLogin ? { fontWeight: 'bold', color: '#3a3a3a' } : { color: '#dadada' }]}>登录</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            isLogin ?
                                <View style={styles.inputv1}>
                                    <Text style={[styles.txt1, { marginTop: 25 }]}>
                                        用户名
                                    </Text>
                                    <TextInput
                                        placeholder='请输入用户名'
                                        style={styles.input1}
                                        onChange={(e) => { setUserName(e.nativeEvent.text) }}
                                    />
                                    <Text style={[styles.txt1, { marginTop: 25 }]}>
                                        密码
                                    </Text>
                                    <TextInput
                                        placeholder='请输入密码'
                                        style={styles.input1}
                                        secureTextEntry={true}
                                        onChange={(e) => { setPassword(e.nativeEvent.text) }}
                                    />
                                    <TouchableOpacity
                                        style={[styles.btn1, { marginTop: 72 }]}
                                        onPress={onLoginPress}
                                    >
                                        <Text style={{ color: 'white', fontSize: 18 }}>登</Text>
                                        <Text style={{ color: 'white', marginLeft: 10, fontSize: 18 }}>录</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.inputv1}>
                                    <Text style={styles.txt1}>
                                        用户名
                                    </Text>
                                    <TextInput
                                        placeholder='请输入用户名'
                                        style={styles.input1}
                                        onChange={(e) => { setUserName(e.nativeEvent.text) }}
                                    />
                                    <Text style={styles.txt1}>
                                        名称（真实姓名）
                                    </Text>
                                    <TextInput
                                        placeholder='请输入名称'
                                        style={styles.input1}
                                        onChange={(e) => { setName(e.nativeEvent.text) }}
                                    />
                                    <Text style={styles.txt1}>
                                        密码
                                    </Text>
                                    <TextInput
                                        placeholder='请输入密码'
                                        style={styles.input1}
                                        secureTextEntry={true}
                                        onChange={(e) => { setPassword(e.nativeEvent.text) }}
                                    />
                                    <Text style={styles.txt1}>
                                        确认密码
                                    </Text>
                                    <TextInput
                                        placeholder='请确认密码'
                                        style={styles.input1}
                                        secureTextEntry={true}
                                        onChange={(e) => { setPassword2(e.nativeEvent.text) }}
                                    />
                                    <TouchableOpacity
                                        style={styles.btn1}
                                        onPress={Register}
                                    >
                                        <Text style={{ color: 'white', fontSize: 18 }}>注</Text>
                                        <Text style={{ color: 'white', marginLeft: 10, fontSize: 18 }}>册</Text>
                                    </TouchableOpacity>
                                </View>

                        }


                    </View>
                </View>
            </ImageBackground>
        </View>
    )

}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    v1: {
        height: 350,
        width: 650,
        backgroundColor: 'white',
        marginTop: -30,
        shadowColor: "#000",
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: .25,
        shadowRadius: 2.5,
        elevation: 3,
        flexDirection: 'row',
    },
    v1_img: {
        width: 250,
        height: '100%',
    },
    v2: {
        width: 400,
        height: '100%',
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        width: 340,
        height: 60,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'blue'
    },
    title1: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#a25f24',
    },
    title2: {
        fontSize: 18,
        marginLeft: 105,
        marginTop: 8,
    },
    title3: {
        fontSize: 18,
        marginLeft: 10,
        marginTop: 8,
    },
    inputv1: {
        width: 340,
        height: 280,
        flexDirection: 'column',
        // backgroundColor: 'yellow',
    },
    txt1: {
        fontSize: 14,
        marginBottom: 3,
    },
    input1: {
        width: 340,
        height: 25,
        backgroundColor: '#eeeeee',
        fontSize: 12,
        paddingTop: -10,
        paddingBottom: -10,
        borderRadius: 3,
        marginBottom: 10,
    },
    btn1: {
        height: 35,
        width: 160,
        backgroundColor: "#a25f24",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 90,
        marginTop: 8,
    },
})