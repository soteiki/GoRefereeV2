import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Switch,
    ImageBackground,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Linking,
    FlatList,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import GameStore from '../../Method/GameStore';
import backgroud from '../../assets/img/BG.png';
import caipan from '../../assets/img/caipan1.png';
import titlebg from '../../assets/img/home/home_title.png'
import Toast from '../../components/Toast';
import GoStore from '../../Method/GoStore';
import { load, remove, save } from '../../utils/Storage';
import UserStore from '../../Method/UserStore';
import qipan from '../../assets/img/qipan.jpg';
import bq from '../../assets/img/bq.png';
import wq from '../../assets/img/wq.png';
import block1 from '../../assets/img/res_b1.png';
import block2 from '../../assets/img/res_b2.png';
import block3 from '../../assets/img/res_b3.png';
import groupList from '../../assets/img/groupList.png';
import returnBtn from '../../assets/img/return.png';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import GameStoreM from '../../Method/GameStoreM';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { openSettings } from 'react-native-permissions';
// import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
// import OpenSettingsModule from 'react-native-config';


function getYMDhms(currentDateTime: any) {
    let year = currentDateTime.getFullYear();
    let month = currentDateTime.getMonth() + 1; // 月份从 0 开始，因此需要加 1
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    let date = currentDateTime.getDate();
    if (date.toString().length === 1) {
        date = '0' + date;
    }
    let hours = currentDateTime.getHours();
    let minutes = currentDateTime.getMinutes();
    if (minutes.toString().length === 1) {
        minutes = '0' + minutes;
    }
    let seconds = currentDateTime.getSeconds();
    if (seconds.toString().length === 1) {
        seconds = '0' + seconds;
    }
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

function GoResStringB(count: string): string {
    let theCount = parseFloat(count);
    let res = theCount - 184.25
    let str = res.toString();
    let parts = str.split(".");
    let gores = parts[0] + "又"
    if (parts[1] == '25') {
        gores += '1/4子'
    } else if (parts[1] == '75') {
        gores += '3/4子'
    }
    return gores;
}

function GoResStringW(count: string): string {
    let theCount = parseFloat(count);
    let res = theCount - 176.75
    let str = res.toString();
    let parts = str.split(".");
    let gores = parts[0] + "又"
    if (parts[1] == '25') {
        gores += '1/4子'
    } else if (parts[1] == '75') {
        gores += '3/4子'
    }
    return gores;
}

type roundListItem = {
    rounds: number,
    bName: string,
    wName: string,
    bScore: string,
    wScore: string,
    againstId: string,
}

export default () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    // let testgo = [
    //     [-2, -2, -1, -2, -1, 1, 1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2, -2, -2], [-2, -2, -1, -1, -1, 1, 2, 2, 1, 1, -1, -1, -1, -2, -2, -2, -2, -2, -2], [-1, -1, -1, -1, 1, 1, 1, 2, 2, 1, 1, 1, -1, -1, -2, -2, -2, -2, -2], [1, -1, 1, 1, 3, 1, 2, 2, 1, 1, 1, 1, -1, -2, -2, -1, -2, -2, -2], [1, 1, 1, 1, 3, 1, 1, 2, 2, 1, 2, 2, 1, -1, -2, -2, -2, -2, -2], [1, 2, 2, 1, 3, 3, 1, 1, 1, 2, 1, 2, 1, -1, -2, -2, -2, -2, -2], [2, 2, 1, 3, 2, 3, 3, 3, 3, 1, 1, 2, 3, 1, -1, -1, -2, -2, -2], [2, 2, 1, 3, 3, 3, 1, 3, 3, 1, 2, 2, 1, 1, -1, -2, -2, -2, -2], [2, 2, 1, 1, 1, 3, 1, 1, 3, 3, 1, 2, 1, 2, 1, -1, -2, -2, -2], [2, 2, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 2, 1, 1, -1, -2, -2, -2], [2, 2, 2, 3, 1, 1, 2, 1, 3, 3, 1, 2, 2, 1, -1, -1, -2, -2, -2], [2, 1, 1, 1, 3, 1, 1, 3, 3, 3, 1, 2, 1, 1, 1, -1, -2, -2, -2], [2, 1, 2, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, -1, -1, -1, -2, -2, -2], [1, 2, 2, 1, 3, 3, 2, 3, 1, 2, 1, 2, 1, 1, 1, -1, -2, -2, -2], [1, 2, 1, 1, 2, 1, 3, 3, 1, 1, 1, 2, 2, 1, -1, -2, -2, -2, -2], [1, 1, -1, 1, 1, 1, 1, 3, 1, 2, 1, 1, 1, -1, -1, -1, -2, -2, -2], [1, -1, -1, -1, -1, -1, -1, 1, 1, 2, 2, 1, -1, -2, -1, -2, -2, -2, -2], [-1, -1, -3, -2, -2, -2, -1, -1, 1, 2, 2, 1, -1, -1, -2, -2, -2, -2, -2], [-2, -2, -2, -1, -1, -2, -1, -1, -1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2]
    // ]
    const [judgeToken, setJudgeToken] = useState('');
    const [judge, setJudge] = useState('空');
    const [gameId, setGameId] = useState('');
    const [gameName, setGameName] = useState('');
    // const [gameGroupList, setGameGroupList] = useState([]);
    const [judgepage, setJudgepage] = useState(0);
    const [selectGroupId, setSelectGroupId] = useState('');
    const [selectGroupName, setSelectGroupName] = useState('');
    const [seat_num, setSeat_num] = useState<string>('');
    const [seat_num1, setSeat_num1] = useState<string>('');
    const [round, setRound] = useState(1);
    const [blackPlayer, setBlackPlayer] = useState('');
    const [whitePlayer, setWhitePlayer] = useState('');
    const [against_plan_id, setAgainst_plan_id] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [cameraAct, setCameraAct] = useState(false);
    const [blackPlayerScore, setBlackPlayerScore] = useState('');
    const [whitePlayerScore, setWhitePlayerScore] = useState('');
    const [go_img, setGo_img] = useState('');
    const [go_matrix, setGo_matrix] = useState<number[][]>([]);
    const [go_b_count, setGo_b_count] = useState('0');
    const [go_w_count, setGo_w_count] = useState('0');
    const [go_b_num, setGo_b_num] = useState('0');
    const [go_w_num, setGo_w_num] = useState('0');
    const [go_sgf, setGo_sgf] = useState('');
    const [go_res, setGo_res] = useState('0');
    const [boardSize, setBoardSize] = useState(19);
    const [isGoXS, setIsGoXS] = useState(false);
    const [vipDate, setVipDate] = useState('');
    const [judgeId, setJudgeId] = useState('');
    const [isChangedGo, setIsChangedGo] = useState(false);
    const [flagCamera, setflagCamera] = useState(true);
    const [roundList, setRoundList] = useState<roundListItem[]>([]);
    const theNullSign: string = "iVBORw0KGgoAAAANSUhEUgAAAc4AAAD8CAYAAAD+I0SiAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAHZSURBVHic7cEBAQAAAIIg/69uSEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8G4chQABk3BkawAAAABJRU5ErkJggg=="
    // const { hasPermission, requestPermission} = useCameraPermission();
    // const [recordId, setRecordId] = useState('');
    // const [blackSign, setBlackSign] = useState('');
    // const [whiteSign, setWhiteSign] = useState('');

    const [isRemovalHL, setIsRemovalHL] = useState(false);
    const toggleSwitch = () => setIsRemovalHL(previousState => !previousState);

    useEffect(() => {
        checkJWT();
        // getUserInfo();
        // console.log(hasPermission)
        // checkCameraPermission();
        goToPermissionSetting();
    }, [])

    const checkJWT = async () => {
        const cacheUserInfo = await load('userInfo');
        // console.log(cacheUserInfo)
        if (cacheUserInfo && JSON.parse(cacheUserInfo)) {
            UserStore.checkJWT(JSON.parse(cacheUserInfo).data, async (success: boolean) => {
                if (success) {
                    // navigation.replace('Login');
                    // console.log('jwt有效01')
                    const cacheUserAllInfo = await load('userAllInfo');
                    if (cacheUserAllInfo && JSON.parse(cacheUserAllInfo)) {
                        setJudge(JSON.parse(cacheUserAllInfo).data[2]);
                        setVipDate(JSON.parse(cacheUserAllInfo).data[10]);
                        setJudgeId(JSON.parse(cacheUserAllInfo).data[0]);
                    } else {
                        const token: string = JSON.parse(cacheUserInfo).data;
                        UserStore.requestInfo(token, (success: boolean) => {
                            if (success) {
                                // console.log('用户信息获取成功');
                                setJudge(UserStore.userAllInfo[2]);
                                setVipDate(UserStore.userAllInfo[10]);
                                setJudgeId(UserStore.userAllInfo[0]);
                            } else {
                                console.log('用户信息获取失败');
                            }
                        })
                        // console.log('没有用户缓存信息');
                    }
                    if (judgeToken == '') {
                        setJudgeToken(JSON.parse(cacheUserInfo).data)
                        // console.log("获取用户token")
                    }
                } else {
                    Toast.show(UserStore.jwtInfo)
                    remove('userInfo');
                    remove('userAllInfo');
                    startLogin();
                }
            });
        }
    }

    // const checkCameraPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.CAMERA,
    //             {
    //                 title: '申请摄像头权限',
    //                 message:
    //                     '需要摄像头权限',
    //                 buttonNeutral: '等会再问我',
    //                 buttonNegative: '取消',
    //                 buttonPositive: '确认',
    //             },
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('现在你获得摄像头权限了');
    //         } else {
    //             console.log('用户并不屌你');
    //         }
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // }

    const goToPermissionSetting = async () => {
        const isFirstTime = await load('isFirstTime');
        if (isFirstTime === null) {
            Alert.alert(
                "提示",
                "App需要摄像头权限才能正常使用,请打开设置页面进行设置",
                [
                    {
                        text: "确认",
                        onPress: () => {
                            // 打开应用的系统设置页面
                            Linking.openSettings();
                        }
                    },
                ],
                { cancelable: false }
            );
            save('isFirstTime', 'NO');
        }
    }

    const startLogin = () => {
        navigation.replace('LoginRegister');
    }
    const startHome = () => {
        navigation.replace('MainTab');
    }

    const camera = useRef<Camera>(null)
    const device: any = useCameraDevice('back');
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (flagCamera) {
                // console.log('执行一次');
                setCameraAct(false);
                setflagCamera(false);
                try {
                    // console.log(codes[0].value);
                    const codeValue: String = (codes[0].value) as string
                    const tmp01: String[] = codeValue.split('&');
                    const groupId = tmp01[1].split('=')[1];
                    setSelectGroupId(groupId);
                    const seat01 = tmp01[2].split('=')[1];
                    setSeat_num(seat01);
                    const seat02 = tmp01[3].split('=')[1];
                    setSeat_num1(seat02);
                    GameStore.requestGameInfoList(groupId, seat01, seat02, (success: boolean) => {
                        if (success) {
                            // setBlackPlayer(GameStore.gameInfo.p1);
                            // setWhitePlayer(GameStore.gameInfo.p2);
                            // setBlackPlayerScore(GameStore.gameInfo.p1_score);
                            // setWhitePlayerScore(GameStore.gameInfo.p2_score);
                            // setCurrentDateTime(new Date());
                            // setAgainst_plan_id(GameStore.gameInfo.against_plan_id);
                            // console.log(GameStore.gameInfo.against_plan_id)
                            Toast.show('扫描成功');
                            let roundTmp = roundList;
                            let itemTmp: roundListItem = {
                                rounds: 1,
                                bName: GameStore.gameInfo.p1,
                                wName: GameStore.gameInfo.p2,
                                bScore: GameStore.gameInfo.p1_score,
                                wScore: GameStore.gameInfo.p2_score,
                                againstId: GameStore.gameInfo.against_plan_id,
                            };
                            roundTmp.push(itemTmp);
                            setRoundList(roundTmp);
                            setJudgepage(2);
                            setflagCamera(true);
                        } else {
                            Toast.show('比赛信息获取失败')
                        }
                    })
                } catch (error) {
                    Toast.show('二维码扫描出现错误：' + error)
                }
            }
            // Loading.show();
            // console.log(`Scanned ${codes.length} codes!`)
            // console.log(codes[0].value)

            // Loading.hide();
        }
    });

    const Footer = () => {
        return (
            <Text style={styles.footerTxt}>没有更多数据</Text>
        );
    }

    const roundRenderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <ImageBackground source={groupList} style={styles.gl}>
                <TouchableOpacity
                    style={styles.grouplist}
                    onPress={gotoGameInfo(item)}
                >
                    <Text style={{ fontSize: 16, width:'25%',textAlign:'center' }}>轮次: {item.rounds}</Text>
                    <Text style={{ fontSize: 16, width:'35%',textAlign:'center'}}>对阵ID: {item.againstId}</Text>
                    <Text style={{ fontSize: 16, width:'40%',textAlign:'center' }}>对阵选手: {item.bName} vs {item.wName}</Text>
                </TouchableOpacity>
            </ImageBackground>

        );
    }

    // const gotoQR = (item: any) => () => {
    //     // setSelectGroupId(item.group_id);
    //     // setSelectGroupName(item.group_name);
    //     console.log('点击')
    //     setJudgepage(1);
    //     // checkCameraPermission();
    //     // setCamera1(true);
    // }

    const gotoQR = () => {
        // setSelectGroupId(item.group_id);
        // setSelectGroupName(item.group_name);
        // console.log('点击');
        setCameraAct(true);
        setJudgepage(1);
        // checkCameraPermission();
        // setCamera1(true);
    }

    const gotoGameInfo = (item: roundListItem) => () => {
        setBlackPlayer(item.bName);
        setWhitePlayer(item.wName);
        setBlackPlayerScore(item.bScore);
        setWhitePlayerScore(item.wScore);
        setCurrentDateTime(new Date());
        setAgainst_plan_id(item.againstId);
        setJudgepage(3);
    }

    const goCounting = async (img: string) => {
        if (judgeToken == '') {
            Toast.show('用户信息获取错误！');
        } else {
            // console.log(judgeToken)
            let rule = '7.5';
            let BR = '';
            let WR = '';
            let PC = '';
            let board = '19';
            GoStore.requestCount(judgeToken, rule, blackPlayer, whitePlayer, BR, WR, getYMDhms(currentDateTime), PC, board, img, isRemovalHL, (success: boolean) => {
                if (success) {
                    console.log(GoStore.mgsInfo);
                    Toast.show('识别成功')
                    GameStoreM.recordGame(against_plan_id, selectGroupId, seat_num, seat_num1, blackPlayer, whitePlayer, judgeId, getYMDhms(currentDateTime), round.toString(), (success: boolean) => {
                        if (success) {
                            setGo_matrix(GoStore.GoMatrix);
                            setGo_b_count(GoStore.GoResInfo[0]);
                            setGo_w_count(GoStore.GoResInfo[1]);
                            setGo_b_num(GoStore.GoResInfo[2]);
                            setGo_w_num(GoStore.GoResInfo[3]);
                            setGo_sgf(GoStore.GoSGF);
                            setGo_res(GoStore.GoResInfo[5]);
                            setIsGoXS(true)
                            console.log("记录成功")
                            setJudgepage(5);
                        } else {
                            Toast.show('记录失败，请联系管理员')
                        }
                    })
                } else {
                    Toast.show('出现错误:' + GoStore.mgsInfo);
                    console.log(GoStore.mgsInfo);
                }
            })
        }


    }

    const canvasRef1 = useRef<SketchCanvas>(null);
    const canvasRef2 = useRef<SketchCanvas>(null);

    const handleClear1 = () => {
        if (canvasRef1.current != null) {
            canvasRef1.current.clear();
        }
    };
    const handleClear2 = () => {
        if (canvasRef2.current != null) {
            canvasRef2.current.clear();
        }
    };

    const reGoCounting = () => {
        let goString = '';
        // console.log(go_matrix);
        for (let i = 0; i < 19; i++) {
            for (let j = 0; j < 19; j++) {
                if (j != 0) {
                    goString += ' ';
                }
                if (go_matrix[i][j] == 1 || go_matrix[i][j] == -3) {
                    goString += '1';
                } else if (go_matrix[i][j] == -1 || go_matrix[i][j] == 3) {
                    goString += '2';
                } else {
                    goString += '0';
                }
            }
            if (i != 18) {
                goString += ','
            }
        }
        // console.log(goString)
        if (judgeToken == '') {
            Toast.show('用户信息获取错误！');
        } else {
            // console.log(judgeToken)
            let rule = '7.5';
            let BR = '';
            let WR = '';
            let PC = '';
            let board = '19';
            GoStore.requestReCount(judgeToken, rule, blackPlayer, whitePlayer, BR, WR, getYMDhms(currentDateTime), PC, board, goString, (success: boolean) => {
                if (success) {
                    // console.log(GoStore.mgsInfo);
                    setGo_matrix(GoStore.GoMatrix);
                    setGo_b_count(GoStore.GoResInfo[0]);
                    setGo_w_count(GoStore.GoResInfo[1]);
                    setGo_b_num(GoStore.GoResInfo[2]);
                    setGo_w_num(GoStore.GoResInfo[3]);
                    setGo_sgf(GoStore.GoSGF);
                    setGo_res(GoStore.GoResInfo[5]);
                    setIsGoXS(true);
                    setIsChangedGo(false);
                    console.log("重新数子成功")
                } else {
                    Toast.show('重新数子失败:' + GoStore.mgsInfo);
                    console.log(GoStore.mgsInfo);
                }
            })
        }
    };

    const uploadGame = () => {
        let bstring = '';
        let wstring = '';
        if (canvasRef1.current != null) {
            canvasRef1.current.getBase64('png', true, true, true, true, (error: any, base64String?: string) => {
                if (error) {
                    console.error(error);
                } else {
                    // setBlackSign(base64String as string);
                    if (base64String != undefined) {
                        // setBlackSign(base64String)
                        bstring = base64String;
                        // console.log(bstring.replace(/\n/g, '').trim());
                        // console.log(theNullSign);
                        if (bstring.replace(/\n/g, '').trim() === theNullSign) {
                            Toast.show('黑方签字不能为空')
                            console.log('黑方签字不能为空')
                            return;
                        }
                        // console.log(bstring)
                        // console.log(bstring)
                        if (canvasRef2.current != null) {
                            canvasRef2.current.getBase64('png', true, true, true, true, (error: any, base64String?: string) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    if (base64String != undefined) {
                                        // setWhiteSign(base64String)
                                        wstring = base64String;
                                        // console.log(wstring)
                                        if (wstring.replace(/\n/g, '').trim() === theNullSign) {
                                            Toast.show('白方签字不能为空')
                                            console.log('白方签字不能为空')
                                            return;
                                        }
                                        // console.log(wstring)
                                        let goString = '';
                                        // console.log(go_matrix);
                                        for (let i = 0; i < 19; i++) {
                                            for (let j = 0; j < 19; j++) {
                                                if (j != 0) {
                                                    goString += ' ';
                                                }
                                                goString += go_matrix[i][j].toString();
                                            }
                                            if (i != 18) {
                                                goString += ','
                                            }
                                        }
                                        // console.log(bstring)
                                        // console.log(wstring)

                                        GameStoreM.uploadGame(against_plan_id, selectGroupId, seat_num, seat_num1, blackPlayer, whitePlayer,
                                            go_sgf, go_b_num, go_w_num, go_res, bstring, wstring, judgeId,
                                            getYMDhms(currentDateTime), go_b_count, go_w_count, goString, go_img, (success: boolean) => {
                                                if (success) {
                                                    GameStore.uploadGameRes(go_res, against_plan_id, GameStoreM.originImgUrl, (success: boolean) => {
                                                        if (success) {
                                                            Toast.show('上传成功')
                                                            setJudgepage(0);
                                                            setGameId(''); setAgainst_plan_id('');
                                                            setSelectGroupId(''), setSelectGroupName('');
                                                            setSeat_num(''); setSeat_num1('');
                                                            setGo_img(''); setGo_b_count('0'); setGo_b_num('0'); setGo_matrix([]);
                                                            setGo_res(''); setGo_sgf(''); setGo_w_count('0'); setGo_w_num('0');
                                                            setRoundList([]);
                                                            // setRecordId('');
                                                        } else {
                                                            Toast.show('比赛数据上传云蛇服务器失败')
                                                            // console.log('组别数据获取失败')
                                                        }
                                                    })
                                                } else {
                                                    Toast.show('比赛数据上传失败')
                                                    // console.log('组别数据获取失败')
                                                }
                                            })
                                    } else {
                                        console.log("问题1")
                                    }
                                    // wstring=(base64String as string)
                                    // console.log(base64String);
                                }
                            });
                            // console.log(base64String);
                        } else {
                            console.log('签字2为空')
                        }
                    } else {
                        console.log("问题1")
                    }
                    // console.log(base64String);
                }
            });
            // console.log(base64String);
        } else {
            console.log('签字1为空')
        }

    }

    return (
        <ImageBackground source={backgroud} style={styles.root}>
            <View style={styles.txv}>
                <View style={styles.tx}>
                    <Image source={caipan} style={styles.tximg} />
                    <Text style={styles.txtxt}>
                        {judge}{" "}{" "}{vipDate == '' ? "加载中" : (new Date(vipDate)).toISOString().split('T')[0]} {vipDate == '' ? " " : (new Date(vipDate)).toISOString().split('T')[1].substring(0, 8)}{" 权限到期"}
                        {/* {judge}{" "}{" "}权限时间:{getYMDhms(new Date(vipDate))} */}
                    </Text>
                </View>
            </View>
            {
                judgepage === 0 &&
                (<View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={[styles.content_title_txt]}>比赛判决</Text>
                    </ImageBackground>
                    {/* <KeyboardAvoidingView style={{ height: 200, backgroundColor: 'white' }} behavior='padding' keyboardVerticalOffset={100}>
                        <ScrollView style={styles.scrollv}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps="always">
                            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    style={styles.input1}
                                    placeholder="请输入比赛ID"
                                    onChange={(e) => { setGameId(e.nativeEvent.text); setGameName(e.nativeEvent.text) }}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <TouchableOpacity
                        style={styles.btn1}
                        onPress={getGameListById}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>查</Text>
                        <Text style={{ color: 'white', marginLeft: 10, fontSize: 18 }}>询</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={[styles.btn1, { marginTop: 150, }]}
                        onPress={gotoQR}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>点击二维码扫描</Text>
                    </TouchableOpacity>
                </View>)
            }
            {
                judgepage === 1 &&
                (<View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>二维码扫描</Text>
                        <TouchableOpacity
                            onPress={() => { setJudgepage(0); setCameraAct(false); }}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    {/* <FlatList
                        style={styles.list1}
                        data={gameGroupList}
                        renderItem={groupRenderItem}
                        ListFooterComponent={<Footer />}
                    /> */}
                    <Camera
                        ref={camera}
                        style={styles.cameraqr}
                        device={device}
                        // photo={true}
                        codeScanner={codeScanner}
                        isActive={cameraAct}
                    />

                </View>)
            }
            {
                judgepage === 2 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>轮次选择 (组别ID:{selectGroupId}, 台号: {seat_num1 === '0' ? seat_num : `${seat_num}-${seat_num1}`}台 )</Text>
                        <TouchableOpacity
                            onPress={() => { setJudgepage(1); setCameraAct(true); setSeat_num(''); setSeat_num1(''); setSelectGroupId('');setRoundList([])}}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <FlatList
                        style={styles.list1}
                        data={roundList}
                        renderItem={roundRenderItem}
                        ListFooterComponent={<Footer />}
                    />
                </View>
            }
            {
                judgepage === 3 &&
                (<View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>基本信息 (组别ID:{selectGroupId}, 台号: {seat_num1 === '0' ? seat_num : `${seat_num}-${seat_num1}`}台 )</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setJudgepage(2);
                                setBlackPlayer('');setWhitePlayer('');setBlackPlayerScore('');setWhitePlayerScore('');setAgainst_plan_id('');
                            }}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <KeyboardAvoidingView style={{ height: 320 }} behavior='padding' keyboardVerticalOffset={100}>
                        <ScrollView style={styles.infov}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps="always">
                            <View style={styles.infov_row}>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>对阵ID</Text>
                                    <TextInput style={styles.infov_row_input} value={against_plan_id} editable={false}
                                        onChange={(e) => { setGameId(e.nativeEvent.text) }} />
                                </View>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>轮次</Text>
                                    <TextInput style={styles.infov_row_input} value={round.toString()} editable={false}
                                        onChange={(e) => { setSelectGroupId(e.nativeEvent.text) }} />
                                </View>

                            </View>
                            <View style={styles.infov_row}>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>黑方姓名</Text>
                                    <TextInput style={styles.infov_row_input} value={blackPlayer} editable={false}
                                        onChange={(e) => { setBlackPlayer(e.nativeEvent.text) }} />
                                </View>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>白方姓名</Text>
                                    <TextInput style={styles.infov_row_input} value={whitePlayer} editable={false}
                                        onChange={(e) => { setWhitePlayer(e.nativeEvent.text) }} />
                                </View>
                            </View>
                            <View style={styles.infov_row}>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>黑方分数</Text>
                                    <TextInput style={styles.infov_row_input} value={blackPlayerScore} editable={false}
                                        onChange={(e) => { setBlackPlayerScore(e.nativeEvent.text) }} />
                                </View>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>白方分数</Text>
                                    <TextInput style={styles.infov_row_input} value={whitePlayerScore} editable={false}
                                        onChange={(e) => { setWhitePlayerScore(e.nativeEvent.text) }} />
                                </View>

                            </View>
                            <View style={styles.infov_row}>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>裁判员</Text>
                                    <TextInput style={styles.infov_row_input} value={judge}
                                        onChange={(e) => { setJudge(e.nativeEvent.text) }}
                                        editable={false} />
                                </View>
                                <View style={styles.infov_row2}>
                                    <Text style={styles.infov_row_txt}>日期</Text>
                                    <TextInput style={styles.infov_row_input} value={
                                        getYMDhms(currentDateTime)
                                    }
                                        editable={false} />
                                </View>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                    <TouchableOpacity
                        style={styles.btn2}
                        onPress={() => {
                            Alert.alert(
                                "提示",
                                "是否已经确认消息无误",
                                [
                                    {
                                        text: "取消",
                                        onPress: () => { },
                                        style: "cancel"
                                    },
                                    {
                                        text: "拍照",
                                        onPress: () => {
                                            if (currentDateTime.getTime() > (new Date(vipDate)).getTime()) {
                                                Toast.show('权限已过期，请联系管理员')
                                                return;
                                            }
                                            // console.log('点击成功')
                                            // setCamera2(true);
                                            // setJudgepage(4);
                                            launchCamera(
                                                { mediaType: 'photo', includeBase64: true },
                                                (response) => {
                                                    if (response.didCancel) {
                                                        Toast.show('取消')
                                                    } else if (response.errorCode) {
                                                        Toast.show('发生了错误！' + response.errorMessage)
                                                    } else {
                                                        if (response.assets && response.assets.length > 0) {
                                                            // console.log(response.assets[0].base64)
                                                            setGo_img(response.assets[0].base64 as string)
                                                            // goCounting(response.assets[0].base64 as string);
                                                            setJudgepage(4);

                                                        } else {
                                                            Toast.show('未找到图片资源')
                                                        }
                                                    }
                                                });

                                        }
                                    },
                                    {
                                        text: "图库",
                                        onPress: () => {
                                            if (currentDateTime.getTime() > (new Date(vipDate)).getTime()) {
                                                Toast.show('权限已过期，请联系管理员')
                                                return;
                                            }
                                            launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
                                                if (response.didCancel) {
                                                    console.log('用户取消了选择图片');
                                                } else if (response.errorCode) {
                                                    console.log('ImagePicker Error: ', response.errorMessage);
                                                } else {
                                                    // console.log(response.assets)
                                                    if (response.assets && response.assets.length > 0) {
                                                        // console.log(response.assets[0].base64 as string)
                                                        setGo_img(response.assets[0].base64 as string);
                                                        // goCounting(response.assets[0].base64 as string);
                                                        setJudgepage(4);
                                                    } else {
                                                        Toast.show("图像选择出现问题！")
                                                    }
                                                    // 在这里处理选中的图片
                                                    // 例如，你可以将图片显示在页面上，或者上传到服务器
                                                }
                                            });
                                        }
                                    }
                                ],
                                { cancelable: true },
                            );
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>拍照判决</Text>
                    </TouchableOpacity>
                </View>)
            }
            {
                judgepage === 4 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>图像确认识别</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setGo_img(''); setJudgepage(3);
                            }}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.img_chkv}>
                        <Image
                            style={styles.img_chk}
                            source={{ uri: `data:image/png;base64,${go_img}` }}
                            resizeMode='contain'
                        />
                        <View style={styles.img_chk_btnv}>
                            <TouchableOpacity
                                style={[styles.btn2, { marginBottom: 0, height: 25 }]}
                                onPress={() => {
                                    goCounting(go_img);
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 16 }}>确认识别</Text>
                            </TouchableOpacity>
                            <Switch
                                trackColor={{ false: "#767577", true: "#a25f24" }}
                                thumbColor={isRemovalHL ? "#FFD700" : "#f4f3f4"}
                                onValueChange={toggleSwitch}
                                value={isRemovalHL}
                                style={{ marginLeft: 10, }}
                            />
                            <Text style={{ fontSize: 14, }}>
                                是否开启高光去除?
                            </Text>
                        </View>

                    </View>
                </View>
            }
            {
                judgepage === 5 &&
                (<View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>对决结果 (组别ID:{selectGroupId}, 台号: {seat_num1 === '0' ? seat_num : `${seat_num}-${seat_num1}`}台, 轮次:{round})</Text>
                        <TouchableOpacity
                            onPress={() => { setJudgepage(4); setGo_b_count('0'); setGo_b_num('0'); setGo_matrix([]); setGo_res(''); setGo_sgf(''); setGo_w_count('0'); setGo_w_num('0'); }}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <View style={styles.gov}>
                        <ImageBackground source={qipan} style={styles.goboard}>
                            <View style={styles.board}>
                                {Array(boardSize - 1).fill(0).map((_, i) => (
                                    <View key={i} style={styles.row}>
                                        {Array(boardSize - 1).fill(0).map((_, j) => (
                                            <TouchableOpacity
                                                key={j} style={styles.cell2} />
                                        ))}
                                    </View>
                                ))}
                            </View>
                            <View style={styles.board}>
                                {
                                    go_matrix.map((row: number[], i: number) => (
                                        <View key={i} style={styles.row}>
                                            {row.map((qz, j) => (
                                                <TouchableOpacity
                                                    key={j}
                                                    style={styles.cell}
                                                    onPress={() => {
                                                        Alert.alert(
                                                            '修改棋子',
                                                            `${i}行${j}列`,
                                                            [
                                                                {
                                                                    text: '空', onPress: () => {
                                                                        // Loading.show();
                                                                        let temp = [...go_matrix];
                                                                        temp[i][j] = 0;
                                                                        setGo_matrix(temp);
                                                                        setIsChangedGo(true);
                                                                        // Loading.hide();
                                                                    }
                                                                },
                                                                {
                                                                    text: '白棋', onPress: () => {
                                                                        // Loading.show();
                                                                        let temp = [...go_matrix];
                                                                        temp[i][j] = 1;
                                                                        setGo_matrix(temp);
                                                                        setIsChangedGo(true);
                                                                        // Loading.hide();
                                                                    }
                                                                },
                                                                {
                                                                    text: '黑棋', onPress: () => {
                                                                        // Loading.show();
                                                                        let temp = [...go_matrix];
                                                                        temp[i][j] = -1;
                                                                        setGo_matrix(temp);
                                                                        setIsChangedGo(true);
                                                                        // Loading.hide();
                                                                    }
                                                                },
                                                            ],
                                                            { cancelable: true },
                                                        );
                                                    }}
                                                >
                                                    {
                                                        qz === -1 ? <Image source={bq} style={styles.qizi} /> :
                                                            qz === 1 ? <Image source={wq} style={styles.qizi} /> :
                                                                qz === 3 ? <Image source={bq} style={styles.qizi} /> :
                                                                    qz === -3 ? <Image source={wq} style={styles.qizi} /> : null
                                                    }
                                                    {isGoXS && (qz === -2 ? <View style={styles.cell_vb}></View> :
                                                        qz === 2 ? <View style={styles.cell_vw}></View> :
                                                            qz === 3 ? <View style={styles.cell_vw}></View> :
                                                                qz === -3 ? <View style={styles.cell_vb}></View> : null)

                                                    }
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))
                                }
                            </View>
                        </ImageBackground>
                        <View style={styles.resv}>
                            <View style={styles.res_t}>
                                <ImageBackground source={block1} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        黑棋数子数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {go_b_count}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block2} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        白棋数子数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {go_w_count}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block1} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        黑棋个数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {go_b_num}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block2} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        白棋个数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {go_w_num}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block3} style={[styles.res_t_b, { marginRight: 0 }]}>
                                    <Text style={styles.b1_txt1}>
                                        胜负结果
                                    </Text>
                                    {
                                        // go_res === '1' && <Image source={bq} style={styles.qizires} />
                                        go_res === '1' && <View style={styles.res_t_b_v}>
                                            <Text style={isChangedGo ? { color: 'red' } : { color: 'black' }}>黑胜</Text>
                                            <Text style={isChangedGo ? { color: 'red' } : { color: 'black' }}>{GoResStringB(go_b_count)}</Text>
                                        </View>
                                    }
                                    {
                                        // go_res === '2' && <Image source={wq} style={styles.qizires} />
                                        go_res === '2' && <View style={styles.res_t_b_v}>
                                            <Text style={isChangedGo ? { color: 'red' } : { color: 'black' }}>白胜</Text>
                                            <Text style={isChangedGo ? { color: 'red' } : { color: 'black' }}>{GoResStringW(go_w_count)}</Text>
                                        </View>
                                    }
                                    {
                                        go_res === '0' && <Text style={[{ fontSize: 24, marginBottom: 5 }, isChangedGo ? { color: 'red' } : { color: 'black' }]}>和棋</Text>
                                    }
                                </ImageBackground>
                            </View>
                            <View style={styles.res_txtv}>
                                <Text style={styles.res_txt}>黑方姓名</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={blackPlayer}
                                />
                                <Text style={[styles.res_txt, { marginLeft: 10 }]}>白方姓名</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={whitePlayer}
                                />
                            </View>
                            <View style={styles.res_txtv}>
                                <Text style={styles.res_txt}>裁判员</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={judge}
                                />
                                <Text style={[styles.res_txt, { marginLeft: 10 }]}>日期</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={getYMDhms(currentDateTime)}
                                />
                            </View>
                            <View style={styles.signv1}>
                                <View style={styles.signv2}>
                                    <View style={styles.signtxtv}>
                                        <Text style={{ fontSize: 14 }}>黑方签字</Text>
                                        <TouchableOpacity
                                            style={{ position: 'absolute', right: 0 }}
                                            onPress={handleClear1}
                                        >
                                            <Text>清空</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.signv3}>
                                        <SketchCanvas
                                            ref={canvasRef1}
                                            strokeColor={'black'}
                                            strokeWidth={4}
                                            style={styles.signmy}
                                        />
                                    </View>

                                </View>
                                <View style={[styles.signv2, { marginLeft: 10 }]}>
                                    <View style={styles.signtxtv}>
                                        <Text style={{ fontSize: 14 }}>白方签字</Text>
                                        <TouchableOpacity
                                            style={{ position: 'absolute', right: 0 }}
                                            onPress={handleClear2}
                                        >
                                            <Text>清空</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.signv3}>
                                        <SketchCanvas
                                            ref={canvasRef2}
                                            strokeColor={'black'}
                                            strokeWidth={4}
                                            style={styles.signmy}
                                        />
                                    </View>

                                </View>
                            </View>
                            <View style={styles.btnv3}>
                                <TouchableOpacity
                                    style={[styles.btn1, { marginTop: 3, marginLeft: 0, width: 140 }]}
                                    onPress={reGoCounting}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>重新数子</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn1, { marginTop: 3, marginLeft: 30, width: 140 }]}
                                    onPress={() => { setIsGoXS(!isGoXS) }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>
                                        {isGoXS ? "关闭形势" : "开启形势"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn1, { marginTop: 3, marginLeft: 30, width: 140 }]}
                                    onPress={() => {
                                        Alert.alert(
                                            '确认提交',
                                            '请确认信息无误',
                                            [
                                                {
                                                    text: '取消', onPress: () => {
                                                        return;
                                                    }
                                                },
                                                {
                                                    text: '确认', onPress: () => {
                                                        if (isChangedGo) {
                                                            Toast.show('更改棋子后，请先重新数子');
                                                            return;
                                                        }
                                                        GameStoreM.isExistRes(against_plan_id, selectGroupId, seat_num, seat_num1, (success: boolean) => {
                                                            if (success) {
                                                                if (GameStoreM.isExistResData != '-1') {
                                                                    Alert.alert(
                                                                        '提示',
                                                                        '比赛结果已经存在，是否覆盖',
                                                                        [
                                                                            {
                                                                                text: '取消', onPress: () => {
                                                                                    return;
                                                                                }
                                                                            },
                                                                            {
                                                                                text: '确认', onPress: () => {
                                                                                    uploadGame();
                                                                                }
                                                                            },
                                                                        ],
                                                                        { cancelable: true },
                                                                    );
                                                                } else {
                                                                    uploadGame();
                                                                }

                                                            } else {
                                                                Toast.show('比赛结果上传出现错误，请联系管理员')
                                                                // uploadGame();
                                                            }
                                                        })
                                                        // uploadGame();
                                                    }
                                                },
                                            ],
                                            { cancelable: true },
                                        );
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>结果确认提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>)
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
    scrollv: {
        width: 855,
        // height: 200,
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
    btn1: {
        height: 35,
        width: 160,
        backgroundColor: "#a25f24",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        // marginLeft: 90,
        // marginTop: 100,
    },
    input1: {
        width: '60%',
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 1,
        marginTop: 100,
        borderRadius: 10,
        backgroundColor: '#eeeeee',
        // marginBottom: 100,
        paddingLeft: 10,
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
    footerTxt: {
        width: '100%',
        fontSize: 14,
        color: '#999',
        marginVertical: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    list1: {
        width: '100%',
        height: 100,
        // backgroundColor: 'yellow',
        // paddingBottom:10,
        paddingLeft: 150,
        paddingRight: 150,
    },
    gl: {
        width: '100%',
        height: 50,
        marginTop: 15,
        borderRadius: 10,
        justifyContent: 'center'
    },
    grouplist: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraqr: {
        width: 350,
        height: 350,
        backgroundColor: 'blue',
        transform: [
            { rotate: "-90deg" },
        ],
        marginTop: 20,
    },
    infov: {
        width: 855,
        height: 320,
        // backgroundColor: 'yellow',
        flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 30,
    },
    infov_row: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        marginBottom: 10,
    },
    infov_row2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infov_row_txt: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20,
        // backgroundColor: 'pink',
        width: 80,
        textAlign: 'right',
    },
    infov_row_input: {
        width: 260,
        height: 30,
        backgroundColor: '#eeeeee',
        borderRadius: 5,
        marginLeft: 5,
        paddingLeft: 10,
        fontSize: 16,
        paddingTop: 5,
        paddingBottom: 5,
        color: 'black',
    },
    btn2: {
        height: 35,
        width: 160,
        backgroundColor: "#a25f24",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        // marginLeft: 90,
        marginBottom: 30,
    },
    cameraphoto: {
        width: 380,
        height: 380,
        // backgroundColor: 'blue',
        // transform: [
        //     { rotate: "-90deg" },
        // ],
        // marginTop: 10,
    },
    gov: {
        width: "100%",
        height: 360,
        // backgroundColor: 'blue',
        marginTop: 10,
        flexDirection: 'row',
    },
    goboard: {
        width: 360,
        height: 360,
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 10,
    },
    board: {
        flexDirection: 'column',
        position: 'absolute'
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 18,
        height: 18,
    },
    cell_vb: {
        width: 6,
        height: 6,
        backgroundColor: 'black',
        position: 'absolute',
        top: 6,
        left: 6,
    },
    cell_vw: {
        width: 6,
        height: 6,
        backgroundColor: 'white',
        position: 'absolute',
        top: 6,
        left: 6,
    },
    cell2: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: 'black',
    },
    qizi: {
        height: '100%',
        width: '100%',
        // position: 'absolute',
    },
    resv: {
        width: 480,
        height: 360,
        // backgroundColor: 'blue',
        position: 'absolute',
        right: 0,
        flexDirection: 'column',
    },
    res_t: {
        width: 480,
        height: 90,
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
    },
    res_t_b: {
        flex: 1,
        height: 70,
        marginRight: 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    res_t_b_v: {
        // backgroundColor:'pink',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    b1_txt1: {
        fontSize: 16,
    },
    b1_txt2: {
        fontSize: 32,
        // fontWeight:'bold',
        marginTop: -5,
    },
    res_txtv: {
        width: 480,
        height: 30,
        // backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    res_txt: {
        // backgroundColor: 'pink',
        width: 75,
        // height:30,
        textAlign: 'right',
        fontSize: 16,
        paddingRight: 5,
    },
    res_input: {
        width: 160,
        height: '100%',
        backgroundColor: '#eeeeee',
        paddingLeft: 8,
        paddingTop: -3,
        paddingBottom: -3,
        fontSize: 16,
        borderRadius: 5,
    },
    qizires: {
        width: 28,
        height: 28,
        marginTop: 5,
        marginBottom: 5,
    },
    signv1: {
        // backgroundColor: 'pink',
        width: 480,
        height: 160,
        flexDirection: 'row',
    },
    signv2: {
        // backgroundColor: 'yellow',
        width: 235,
        height: 160,
        flexDirection: 'column',
    },
    signtxtv: {
        width: '100%',
        height: 30,
        // backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'center',
    },
    signmy: {
        // width: '100%',
        // height: 125,
        flex: 1,
        backgroundColor: 'white',
        // marginTop:20,
    },
    signv3: {
        width: '100%',
        height: 130,
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#a0a0a0"
    },
    btnv3: {
        // backgroundColor: 'red',
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    img_chkv: {
        // backgroundColor: 'pink',
        height: 380,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    img_chk: {
        height: 340,
        width: 500,
        // backgroundColor: 'black',
        marginTop: 5
    },
    img_chk_btnv: {
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'yellow',
        flexDirection: 'row'
    }

})