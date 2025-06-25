import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Keyboard,
    Platform,
    AppState,
} from 'react-native';

import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

import Judge from '../judge/Judge';
import History from '../history/History';
import Mine from '../mine/Mine';
import { load, save } from '../../utils/Storage';
import heiqi from '../../assets/img/home_heiqi.png';
import baiqi from '../../assets/img/home_baiqi.png';
import backgroud from '../../assets/img/BG.png'
import _updateConfig from "../../../update.json";
import { checkUpdate, downloadUpdate, isFirstTime, isRolledBack, markSuccess, switchVersion, switchVersionLater } from "react-native-update";
import Toast from '../../components/Toast';


const { appKey } = _updateConfig[Platform.OS];

export default () => {
    const [keyboardStatus, setKeyboardStatus] = useState(true);
    const [appState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        checkPatch();
        if (isFirstTime) {
            markSuccess();
            // 补丁成功，上报服务器信息
            // 补丁安装成功率：99.5% ~ 99.7%
        } else if (isRolledBack) {
            // 补丁回滚，上报服务器信息
        }
        // const appStateListener = AppState.addEventListener('change', handleAppStateChange);

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                // console.log('键盘弹起');
                setKeyboardStatus(false);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                // console.log('键盘收起');
                setKeyboardStatus(true);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            // appStateListener.remove();
        };
    }, []);

    // const handleAppStateChange = (nextAppState: any) => {
    //     console.log(appState)
    //     console.log(nextAppState)
    //     if (
    //         appState.match(/inactive|background/) &&
    //         nextAppState === 'active'
    //     ) {
    //         // App has come to the foreground!
    //         // Do something with the new app state...
    //         console.log('还在')
    //     } else if (
    //         appState === 'active' &&
    //         nextAppState.match(/inactive|background/)
    //     ) {
    //         // App has gone to the background!
    //         // Clear cache data...
    //         console.log('清除缓存')
    //     }

    //     setAppState(nextAppState);
    // };

    const checkPatch = async () => {
        const info: any = await checkUpdate(appKey);
        const { update, name, description, metaInfo } = info;
        const metaJson = JSON.parse(metaInfo);
        save('patchVersion', name);
        const { forceUpdate } = metaJson;
        if (forceUpdate) {
            // 弹窗提示用户
            Toast.show('正在更新热补丁，请稍后');
        } else {
            // 不弹窗默默操作
        }
        if (update) {
            const hash = await downloadUpdate(
                info,
                {
                    onDownloadProgress: ({ received, total }) => { },
                },
            );
            if (hash) {
                if (forceUpdate) {
                    switchVersion(hash);
                } else {
                    switchVersionLater(hash);
                }
            }
        }
    }


    const MyTabBar = ({ state, descriptors, navigation }: any) => {
        const { routes, index } = state;

        return (
            keyboardStatus &&
            <View style={styles.tabBarContainer}>
                {routes.map((route: any, i: number) => {
                    const { options } = descriptors[route.key];
                    const label = options.title;
                    const isFocused = index === i;
                    return (
                        <TouchableOpacity
                            key={label}
                            style={styles.tabItem}
                            onPress={() => {
                                navigation.navigate(route.name);
                                // if (route.name === 'History') {
                                //     // 如果用户点击的是"历史记录"按钮，就刷新页面的数据
                                //     navigation.navigate(route.name, { refresh: true });
                                //     console.log('刷新历史记录');
                                // } else {
                                //     navigation.navigate(route.name);
                                // }
                            }}
                        >
                            <Image
                                source={isFocused ? heiqi : baiqi}
                                style={styles.barimg}
                            />
                            <Text style={{
                                fontSize: isFocused ? 20 : 16,
                                color: isFocused ? '#b96220' : '#333333',
                                fontWeight: isFocused ? 'bold' : 'normal',
                                marginLeft: 5,
                            }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }


    return (
        <ImageBackground source={backgroud} style={styles.root}>
            <BottomTab.Navigator
                tabBar={props => <MyTabBar {...props} />}
                initialRouteName='Judge'
            >
                <BottomTab.Screen
                    name='Judge'
                    component={Judge}
                    options={{
                        title: '比赛判决',
                        headerShown: false,
                    }}
                />
                <BottomTab.Screen
                    name='History'
                    component={History}
                    options={{
                        title: '历史记录',
                        headerShown: false,
                    }}

                />
                <BottomTab.Screen
                    name='Mine'
                    component={Mine}
                    options={{
                        title: '个人中心',
                        headerShown: false,
                    }}
                />
            </BottomTab.Navigator>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
    },
    tabBarContainer: {
        width: '100%',
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        // opacity: 0.5
    },
    tabItem: {
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        flexDirection: 'row',
        // opacity: 0.5
    },
    barimg: {
        height: 30,
        width: 30,
    }


});