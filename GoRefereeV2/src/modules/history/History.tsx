import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    ImageBackground,
    TouchableOpacity,
    // KeyboardAvoidingView,
    // AppState,
    Alert,
    // ViewToken,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GameStoreM from '../../Method/GameStoreM';
import Toast from '../../components/Toast';
import { load, save } from '../../utils/Storage';
import backgroud from '../../assets/img/BG.png';
import caipan from '../../assets/img/caipan1.png';
import UserStore from '../../Method/UserStore';
import titlebg from '../../assets/img/home/home_title.png';
import qipan from '../../assets/img/qipan.jpg';
import bq from '../../assets/img/bq.png';
import wq from '../../assets/img/wq.png';
import block1 from '../../assets/img/res_b1.png';
import block2 from '../../assets/img/res_b2.png';
import block3 from '../../assets/img/res_b3.png';
import { useLocalStore } from 'mobx-react';
// 正常使用的
import base64 from 'react-native-base64';
import returnBtn from '../../assets/img/return.png';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from 'mobx';
import GoStore from '../../Method/GoStore';
import PaginationDot from 'react-native-animated-pagination-dot'



function getYMD(date: any) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    let day = date.getDate();
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
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

export default () => {


    const [vipDate, setVipDate] = useState('');
    const [judgeId, setJudgeId] = useState('');
    // const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        // console.log("加载比赛数据")
        getUserInfo();
        // getData('1', '', '', '', '');
        // setMystate(mystate == 1 ? 0 : 1)
        // const appStateListener = AppState.addEventListener('change', handleAppStateChange);

        // return () => {
        //     appStateListener.remove();
        // };
    }, []);



    const getUserInfo = async () => {
        const cacheUserInfo = await load('userInfo');
        if (cacheUserInfo && JSON.parse(cacheUserInfo)) {
            // console.log('获取用户信息');
            const cacheUserAllInfo = await load('userAllInfo');
            if (cacheUserAllInfo && JSON.parse(cacheUserAllInfo)) {
                // console.log(`从缓存中取到的数据：${cacheUserAllInfo}`);
                setJudge(JSON.parse(cacheUserAllInfo).data[2]);
                setVipDate(JSON.parse(cacheUserAllInfo).data[10]);
                setJudgeId(JSON.parse(cacheUserAllInfo).data[0]);
            } else {
                // console.log('有用户缓存信息');
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
        }


    }
    const [boardSize, setBoardSize] = useState(19);
    const [gameDataList, setGameDataList] = useState<any>([]);
    const [flRefresh, setFlRefresh] = useState(false);
    const [mystate, setMystate] = useState(0);
    const [judge, setJudge] = useState('');
    const [page, setPage] = useState(0);

    const getData = async (my: any, bwName: any, againstPlanId: any, sTime: any, eTime: any) => {
        const cacheUserInfo = await load('userInfo');
        let token = '';
        if (cacheUserInfo && JSON.parse(cacheUserInfo)) {
            token = JSON.parse(cacheUserInfo).data
            // console.log(token.data)
        } else {
            Toast.show('请先登录');
            return;
        }
        let the_judge = '';
        const cacheUserAllInfo = await load('userAllInfo');
        if (cacheUserAllInfo && JSON.parse(cacheUserAllInfo)) {
            // console.log(`从缓存中取到的数据：${cacheUserAllInfo}`);
            the_judge = JSON.parse(cacheUserAllInfo).data[0];
        } else {
            console.log('没有用户缓存信息');
            return;
        }
        GameStoreM.requestMyGameList(token, my, bwName, againstPlanId, sTime, eTime, the_judge, (success: boolean) => {
            if (success) {
                setGameDataList(GameStoreM.MyGameInfo)
                setFlRefresh(GameStoreM.refreshing)
                Toast.show(GameStoreM.mgsInfo)
                setMystate(mystate == 1 ? 0 : 1)
                // console.log(data)
            } else {
                setGameDataList(GameStoreM.MyGameInfo)
                setFlRefresh(GameStoreM.refreshing)
                Toast.show(GameStoreM.mgsInfo)
                setMystate(mystate == 1 ? 0 : 1)
                console.log('数据获取失败或者无数据')
            }
        })
        // store.requestMyGameList2(token, my, bwName, againstPlanId, sTime, eTime, the_judge);

    }
    // 用于控制组件显示/隐藏的state
    const [isDateShow, setIsDateShow] = useState(false);
    const [isDateShow2, setIsDateShow2] = useState(false);
    // 用于组件中date的显示
    const [dateTime, setDateTime] = useState(new Date());
    const [dateText, setDateText] = useState('');
    const [dateText2, setDateText2] = useState('');

    const [gameid, setGameid] = useState('');
    const [sxname, setSxname] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');

    const [gameName, setGameName] = useState('');
    const [against_plan_id, setAgainst_plan_id] = useState('');
    const [groupName, setGroupName] = useState('');
    const [bName, setBName] = useState('');
    const [wName, setWName] = useState('');
    const [gameTime, setGameTime] = useState('');
    const [gameResult, setGameResult] = useState('');
    const [bCount, setBCount] = useState('0');
    const [wCount, setWCount] = useState('0');
    const [bNum, setBNum] = useState('0');
    const [wNum, setWNum] = useState('0');
    const [bSign, setBSign] = useState('');
    const [wSign, setWSign] = useState('');
    const [goData, setGoData] = useState<string[][]>([]);
    const [seatNum, setSeatNum] = useState('');
    const [seatNum1, setSeatNum1] = useState('');
    const [isGoXS, setIsGoXS] = useState(true);
    const [isOriginImg, setIsOriginImg] = useState(false);
    const [originImg, setOriginImg] = useState('');
    const [isChangedHistory, setIsChangedHistory] = useState(false);
    const [judgeToken, setJudgeToken] = useState('');
    // const [goHistoryMatrix, setGoHistoryMatrix] = useState<number[][]>([]);
    // const [against_plan_id, setAgainst_plan_id] = useState('');
    // const fetchData = async () => {  
    //     const cacheGameid = await load('gameid');
    //     const cacheSxname = await load('sxname');
    //     const cacheStime = await load('stime');
    //     const cacheEtime = await load('etime');
    //     const data_stores = [cacheGameid,cacheSxname,cacheStime,cacheEtime]
    //     return data_stores
    // };  

    // const flatListRef = useRef<FlatList>(null)
    // const [viewableItemsMy, setViewableItemsMy] = useState<ViewToken[]>();

    const getData2 = () => {
        AsyncStorage.getItem('gameid').then((value1) => {
            AsyncStorage.getItem('sxname').then((value2) => {
                AsyncStorage.getItem('stime').then((value3) => {
                    AsyncStorage.getItem('etime').then((value4) => {
                        if (value1 != null) {
                            setGameid(value1);
                        } else {
                            setGameid('');
                            value1 = '';
                        }
                        if (value2 != null) {
                            setSxname(value2);
                        } else {
                            setSxname('');
                            value2 = '';
                        }
                        if (value3 != null) {
                            setDateText(value3)
                            setStime(value3 + " 00:00:00")
                        } else {
                            setDateText('');
                            value3 = '';
                        }
                        if (value4 != null) {
                            setDateText2(value4)
                            setEtime(value4 + " 23:59:59")
                        } else {
                            setDateText2('');
                            value4 = '';
                        }
                        // console.log(value1);console.log(value2);console.log(value3);console.log(value4);
                        if (value3 != '' && value4 === '') {
                            let new_stime = value3 + " 00:00:00";
                            // let new_etime = "2199-10-10 23:59:59";
                            // console.log(new_stime);console.log(new_etime);
                            getData('1', value2, value1, new_stime, "");
                        } else if (value3 === '' && value4 != '') {
                            // let new_stime = value4 + " 00:00:00";
                            let new_etime = value4 + " 23:59:59";
                            getData('1', value2, value1, "", new_etime);
                        } else if (value3 === '' && value4 === '') {
                            getData('1', value2, value1, '', '');
                        } else {
                            getData('1', value2, value1, value3 + " 00:00:00", value4 + " 23:59:59");
                        }

                    }).catch((error) => { console.log(error) });
                }).catch((error) => { console.log(error) });
            }).catch((error) => { console.log(error) });
        }).catch((error) => { console.log(error) });
    }

    const [pageIndex, setPageIndex] = useState(1);

    const refreshNewData = () => {
        console.log("下拉刷新")
        GameStoreM.resetPage();
        getData2();
    }

    const loadMoreData = () => {
        console.log("上拉加载")
        getData2();
    }

    useFocusEffect(
        React.useCallback(() => {
            // 这个函数会在页面获取焦点时被调用
            // 在这里你可以执行你需要的操作，例如刷新页面数据
            GameStoreM.resetPage();
            getData2();
            return () => {
                // 这个函数会在页面失去焦点时被调用
                // 在这里你可以执行你需要的操作，例如清理资源
                // console.log('失去焦点');
            };
        }, [])
    );

    const Footer = () => {
        return (
            <Text style={styles.footerTxt}>没有更多数据</Text>
        );
    }
    const dateChange = (event: any, selectedDate: any) => {
        setIsDateShow(false);
        if (event.type !== 'set') {
            setDateText('');
            setDateText2('');
            setStime('');
            setEtime('');
            return;
        }
        const currentDate = selectedDate || dateTime;
        const currentDateText = getYMD(currentDate);
        setDateText(currentDateText);
        setStime(currentDateText + " 00:00:00")
    }
    const dateChange2 = (event: any, selectedDate: any) => {
        setIsDateShow2(false);
        if (event.type !== 'set') {
            setDateText('');
            setDateText2('');
            setStime('');
            setEtime('');
            return;
        }
        const currentDate = selectedDate || dateTime;
        const currentDateText = getYMD(currentDate);
        setDateText2(currentDateText);
        setEtime(currentDateText + " 23:59:59")
    }

    const goToDetail = useCallback((item: any) => () => {
        setGameName(item[1]); setAgainst_plan_id(item[2]); setGroupName(item[3]); setBName(item[4]); setWName(item[5]);
        setGameTime((new Date(item[9])).toISOString().split('T')[0] + " " + (new Date(item[9])).toISOString().split('T')[1].substring(0, 8));
        setGameResult(item[13]); setBCount(item[16]); setWCount(item[17]);
        setBNum(item[11]); setWNum(item[12]); setSeatNum(item[6]); setSeatNum1(item[7]);
        setBSign(item[14]); setWSign(item[15]);
        setIsGoXS(true); setIsOriginImg(false); setOriginImg(item[20]);
        let go_str = item[19];
        let go_str2 = go_str.split(',');
        let go_data = [];
        for (let i = 0; i < go_str2.length; i++) {
            let go_str3 = go_str2[i].split(" ")
            let tmp = [];
            for (let j = 0; j < go_str3.length; j++) {
                tmp.push(go_str3[j]);
            }
            go_data.push(tmp);
        }
        setGoData(go_data);
        setPage(1);
        // console.log(goData)
    }, []);

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <TouchableOpacity
                style={[styles.listbtn,
                    // {height:250,backgroundColor:'pink'}
                ]}
                onPress={goToDetail(item)}
            >
                <Text style={styles.itemtxt}>{item[2]}</Text>
                <Text style={styles.itemtxt}>{item[3]}</Text>
                <Text style={[styles.itemtxt, { width: 80 }]}>{item[6]}</Text>
                <Text style={[styles.itemtxt, { width: 188 }]}>{item[4]} VS {item[5]}</Text>
                {
                    item[13] === '1' &&
                    <View style={styles.itemimgv}>
                        <Image source={bq} style={styles.qizires} />
                    </View>
                }
                {
                    item[13] === '2' &&
                    <View style={styles.itemimgv}>
                        <Image source={wq} style={styles.qizires} />
                    </View>
                }
                {
                    item[13] === '0' && <Text style={styles.itemtxt}>平</Text>
                }
                {
                    item[13] === '-1' && <Text style={styles.itemtxt}>无数据</Text>
                }
                <Text style={[styles.itemtxt, { marginRight: 0, width: 180 }]}>{(new Date(item[9])).toISOString().split('T')[0]}{"  "}{(new Date(item[9])).toISOString().split('T')[1].substring(0, 8)}</Text>
            </TouchableOpacity>
        );
    }

    const queryGaneRes = () => {
        // setStime(dateText + " 00:00:00")
        // setEtime(dateText2 + " 23:59:59")
        // console.log(gameid)
        // console.log(sxname)
        // console.log(stime)
        // console.log(etime)
        GameStoreM.resetPage();
        if (stime != '' && etime === '') {
            let new_stime = dateText + " 00:00:00";
            // let new_etime = dateText + " 23:59:59";
            getData('1', sxname, gameid, new_stime, "");
        } else if (stime === '' && etime != '') {
            // let new_stime = dateText2 + " 00:00:00";
            let new_etime = dateText2 + " 23:59:59";
            getData('1', sxname, gameid, "", new_etime);
        } else {
            getData('1', sxname, gameid, stime, etime);
        }
        save('gameid', gameid);
        save('sxname', sxname);
        save('stime', dateText);
        save('etime', dateText2);
    }

    const saveChangedGoData = () => {
        let goString = '';
        for (let i = 0; i < 19; i++) {
            for (let j = 0; j < 19; j++) {
                if (j != 0) {
                    goString += ' ';
                }
                if (goData[i][j] == '1' || goData[i][j] == '-3') {
                    goString += '1';
                } else if (goData[i][j] == '-1' || goData[i][j] == '3') {
                    goString += '2';
                } else {
                    goString += '0';
                }
            }
            if (i != 18) {
                goString += ','
            }
        }
        if (judgeToken == '') {
            Toast.show('用户信息获取错误！');
        } else {
            let rule = '7.5';
            let BR = '';
            let WR = '';
            let PC = '';
            let board = '19';
            GoStore.requestReCount(judgeToken, rule, bName, wName, BR, WR, gameTime, PC, board, goString, (success: boolean) => {
                if (success) {
                    console.log(GoStore.mgsInfo);
                    let goString = '';
                    let goTmp: string[][] = goData;
                    for (let i = 0; i < 19; i++) {
                        for (let j = 0; j < 19; j++) {
                            goTmp[i][j] = GoStore.GoMatrix[i][j].toString();
                            if (j != 0) {
                                goString += ' ';
                            }
                            goString += GoStore.GoMatrix[i][j].toString();
                        }
                        if (i != 18) {
                            goString += ','
                        }
                    }
                    // console.log(goTmp);
                    console.log("重新数子成功");
                    GameStoreM.uploadGame2(against_plan_id, groupName, seatNum, seatNum1, GoStore.GoSGF, GoStore.GoResInfo[2], GoStore.GoResInfo[3], GoStore.GoResInfo[5], GoStore.GoResInfo[0], GoStore.GoResInfo[1], goString, (success: boolean) => {
                        if (success) {
                            Toast.show('修改保存成功！');
                            setGoData(goTmp);
                            setBCount(GoStore.GoResInfo[0]);
                            setWCount(GoStore.GoResInfo[1]);
                            setBNum(GoStore.GoResInfo[2]);
                            setWNum(GoStore.GoResInfo[3]);
                            // setGo_sgf(GoStore.GoSGF);
                            setGameResult(GoStore.GoResInfo[5]);
                            setIsGoXS(true);
                            setIsChangedHistory(false);
                        } else {
                            Toast.show('修改保存失败！');
                        }
                    })
                } else {
                    Toast.show('重新数子失败:' + GoStore.mgsInfo);
                    console.log(GoStore.mgsInfo);
                }
            })
        }
    }

    // const [curPage, setCurpage] = useState(0);
    // const [maxPage, setMaxPage] = useState(10);
    // const handleTextChange = (event:any) => {
    //     const inputValue = event.nativeEvent.text;
    //     const filteredValue:string = inputValue.replace(/[^0-9]/g, '');
    //     setCurpage(parseInt(filteredValue));
    // };

    return (
        <ImageBackground source={backgroud} style={styles.root}>
            <View style={styles.txv}>
                <View style={styles.tx}>
                    <Image source={caipan} style={styles.tximg} />
                    <Text style={styles.txtxt}>
                        {judge}{" "}{" "}{vipDate == '' ? "加载中" : (new Date(vipDate)).toISOString().split('T')[0]} {vipDate == '' ? " " : (new Date(vipDate)).toISOString().split('T')[1].substring(0, 8)}{" 权限到期"}
                    </Text>
                </View>
            </View>
            {
                page === 0 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>我的判决记录</Text>
                    </ImageBackground>
                    <View style={styles.options}>
                        <View style={styles.optionsb}>
                            <Text style={{ fontSize: 16 }}>对阵ID: </Text>
                            <TextInput
                                style={styles.opt_txtinput}
                                value={gameid}
                                onChange={(e) => { setGameid(e.nativeEvent.text) }}
                            />
                        </View>
                        <View style={styles.optionsb}>
                            <Text style={{ fontSize: 16 }}>选手姓名: </Text>
                            <TextInput
                                style={styles.opt_txtinput}
                                value={sxname}
                                onChange={(e) => { setSxname(e.nativeEvent.text) }}
                            />
                        </View>
                        <View style={styles.optionsb}>
                            <Text style={{ fontSize: 16 }}>时段选择: </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsDateShow(true)
                                }}
                                style={styles.btndate}
                            >
                                <Text>
                                    {dateText}
                                </Text>
                            </TouchableOpacity>
                            {isDateShow && <DateTimePicker value={dateTime} onChange={dateChange} />}
                            <Text>—</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsDateShow2(true)
                                }}
                                style={styles.btndate}
                            >
                                <Text>
                                    {dateText2}
                                </Text>
                            </TouchableOpacity>
                            {isDateShow2 && <DateTimePicker value={dateTime} onChange={dateChange2} />}
                        </View>
                        <TouchableOpacity
                            style={styles.btn1}
                            onPress={queryGaneRes}
                        >
                            <Text style={{ color: 'white', fontSize: 15 }}>查询</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerv}>
                        <View style={styles.headervb}>
                            <Text style={{ fontSize: 14 }}>对阵ID</Text>
                        </View>
                        <View style={styles.headervb}>
                            <Text style={{ fontSize: 14 }}>组别ID</Text>
                        </View>
                        <View style={[styles.headervb, { width: 80 }]}>
                            <Text style={{ fontSize: 14 }}>台号</Text>
                        </View>
                        <View style={[styles.headervb, { width: 188 }]}>
                            <Text style={{ fontSize: 14 }}>姓名VS姓名</Text>
                        </View>
                        <View style={styles.headervb}>
                            <Text style={{ fontSize: 14 }}>结果</Text>
                        </View>
                        <View style={[styles.headervb, { marginRight: 0, width: 180 }]}>
                            <Text style={{ fontSize: 14 }}>时间</Text>
                        </View>
                    </View>
                    <FlatList
                        style={[styles.list,{height:'100%'}]}
                        // ref={flatListRef}
                        data={gameDataList}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => `id-${index}`}
                        refreshing={flRefresh}
                        onRefresh={refreshNewData}
                        onEndReachedThreshold={0.2}
                        onEndReached={loadMoreData}
                        // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        ListFooterComponent={<Footer />}
                    />
                    {/* <KeyboardAvoidingView style={styles.fenyebtnv}>
                        <TouchableOpacity
                            onPress={() => { setCurpage(curPage - 1) }}
                        >
                            <Text>上一页</Text>
                        </TouchableOpacity>
                        <View style={styles.fenyebtnv2}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    keyboardType='numeric'
                                    value={curPage.toString()}
                                    onChangeText={(text) => { 
                                        const filteredValue:string = text.replace(/[^0-9]/g, '');
                                        if (filteredValue==''){
                                            // Toast.show('请输入数字！');
                                            // return;
                                            // setCurpage(1);
                                        }else{
                                            const tmp:number = parseInt(filteredValue);
                                            if (tmp > maxPage || tmp < 1){
                                                setCurpage(1);
                                            }else{
                                                setCurpage(tmp);
                                            }
                                        }
                                    }}
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        borderWidth: 0 , 
                                        padding:0,marginRight:-3}}
                                />
                                <Text>
                                    / {maxPage}
                                </Text>
                            </View>
                            <PaginationDot
                                activeDotColor={'black'}
                                curPage={curPage-1}
                                maxPage={maxPage}
                                sizeRatio={1}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { setCurpage(curPage + 1) }}
                        >
                            <Text>下一页</Text>
                        </TouchableOpacity>

                    </KeyboardAvoidingView> */}

                    {/* <View style={styles.fenyev}>

                    </View> */}
                </View>
            }
            {
                page === 1 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>详细信息 (对阵ID:{against_plan_id}, 组别ID:{groupName}, 台号: {seatNum1 === '0' ? seatNum : `${seatNum}-${seatNum1}`}台)</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setPage(0); setGameName(''); setGroupName(''); setBName(''); setWName('');
                                setGameTime('');
                                setGameResult(''); setBCount(''); setWCount('');
                                setBNum(''); setWNum(''); setSeatNum('')
                                setBSign(''); setWSign('');GameStoreM.resetPage();
                                getData2();
                            }}
                            style={styles.back}
                        >
                            <Image source={returnBtn} style={{ height: 15, width: 15, marginRight: 6, marginTop: 2 }} />
                            <Text style={styles.backtxt}>返回</Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <View style={styles.gov}>
                        {
                            isOriginImg ?
                                <ImageBackground source={{ uri: originImg }} resizeMode='contain' style={[styles.goboard, { backgroundColor: 'black' }]}></ImageBackground>
                                :
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
                                            goData.map((row: string[], i: number) => (
                                                <View key={i} style={styles.row}>
                                                    {row.map((qz, j) => (
                                                        <TouchableOpacity
                                                            key={j}
                                                            style={styles.cell}
                                                        >
                                                            {
                                                                qz === '-1' ? <Image source={bq} style={styles.qizi} /> :
                                                                    qz === '1' ? <Image source={wq} style={styles.qizi} /> :
                                                                        qz === '3' ? <Image source={bq} style={styles.qizi} /> :
                                                                            qz === '-3' ? <Image source={wq} style={styles.qizi} /> : null
                                                            }
                                                            {isGoXS && (qz === '-2' ? <View style={styles.cell_vb}></View> :
                                                                qz === '2' ? <View style={styles.cell_vw}></View> :
                                                                    qz === '3' ? <View style={styles.cell_vw}></View> :
                                                                        qz === '-3' ? <View style={styles.cell_vb}></View> : null)

                                                            }
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            ))
                                        }
                                    </View>
                                </ImageBackground>
                        }

                        <View style={styles.resv}>
                            <View style={styles.res_t}>
                                <ImageBackground source={block1} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        黑棋数子数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {bCount}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block2} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        白棋数子数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {wCount}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block1} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        黑棋个数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {bNum}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block2} style={styles.res_t_b}>
                                    <Text style={styles.b1_txt1}>
                                        白棋个数
                                    </Text>
                                    <Text style={styles.b1_txt2}>
                                        {wNum}
                                    </Text>
                                </ImageBackground>
                                <ImageBackground source={block3} style={[styles.res_t_b, { marginRight: 0 }]}>
                                    <Text style={[styles.b1_txt1]}>
                                        胜负结果
                                    </Text>
                                    {
                                        // go_res === '1' && <Image source={bq} style={styles.qizires} />
                                        gameResult === '1' && <View style={styles.res_t_b_v}>
                                            <Text>黑胜</Text>
                                            <Text>{GoResStringB(bCount)}</Text>
                                        </View>
                                    }
                                    {
                                        // go_res === '2' && <Image source={wq} style={styles.qizires} />
                                        gameResult === '2' && <View style={styles.res_t_b_v}>
                                            <Text>白胜</Text>
                                            <Text>{GoResStringW(wCount)}</Text>
                                        </View>
                                    }
                                    {
                                        gameResult === '0' && <Text style={{ fontSize: 24, marginBottom: 5 }}>和棋</Text>
                                    }
                                </ImageBackground>
                            </View>
                            <View style={styles.res_txtv}>
                                <Text style={styles.res_txt}>黑方姓名</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={bName}
                                />
                                <Text style={[styles.res_txt, { marginLeft: 10 }]}>白方姓名</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={wName}
                                />
                            </View>
                            <View style={styles.res_txtv}>
                                <Text style={styles.res_txt}>裁判员</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={judge}
                                />
                                <Text style={[styles.res_txt, { marginLeft: 10 }]}>日期</Text>
                                <TextInput
                                    style={styles.res_input} editable={false} value={gameTime}
                                />
                            </View>
                            <View style={styles.signv1}>
                                <View style={styles.signv2}>
                                    <View style={styles.signtxtv}>
                                        <Text style={{ fontSize: 14 }}>黑方签字</Text>
                                    </View>
                                    <View style={styles.signv3}>
                                        <Image
                                            style={styles.signimg}
                                            source={{ uri: `data:image/png;base64,${bSign}` }}
                                        />
                                    </View>

                                </View>
                                <View style={[styles.signv2, { marginLeft: 10 }]}>
                                    <View style={styles.signtxtv}>
                                        <Text style={{ fontSize: 14 }}>白方签字</Text>
                                    </View>
                                    <View style={styles.signv3}>
                                        <Image
                                            style={styles.signimg}
                                            source={{ uri: `data:image/png;base64,${wSign}` }}
                                        />
                                    </View>

                                </View>
                            </View>
                            <View style={styles.btnv3}>
                                <TouchableOpacity
                                    style={[styles.btn2, { marginTop: 3, marginLeft: 30 }]}
                                    onPress={() => { setIsGoXS(!isGoXS) }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>
                                        {isGoXS ? "关闭形势" : "开启形势"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn2, { marginTop: 3, marginLeft: 30, marginRight: 30 }]}
                                    // onPress={() => { setIsOriginImg(!isOriginImg) }}
                                    onPress={() => { setPage(2); }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>
                                        {isOriginImg ? "返回电子棋盘" : "查看照片原图"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            }
            {
                page === 2 &&
                <View style={styles.content}>
                    <ImageBackground source={titlebg} style={styles.content_title}>
                        <Text style={styles.content_title_txt}>详细信息 (对阵ID:{against_plan_id}, 组别ID:{groupName}, 台号: {seatNum1 === '0' ? seatNum : `${seatNum}-${seatNum1}`}台)</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (isChangedHistory) {
                                    Alert.alert(
                                        '提示',
                                        '棋子修改，是否保存修改？修改后会覆盖原有数据，请确认无误。',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                                    console.log('取消修改');
                                                    setIsChangedHistory(false);
                                                    setPage(1);
                                                }
                                            },
                                            {
                                                text: '保存', onPress: () => {
                                                    saveChangedGoData();
                                                    setPage(1);
                                                }
                                            },
                                        ],
                                        { cancelable: true },
                                    )
                                } else {
                                    setPage(1);
                                    setIsChangedHistory(false);
                                }
                            }}
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
                                    goData.map((row: string[], i: number) => (
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
                                                                        let temp = [...goData];
                                                                        temp[i][j] = '0';
                                                                        setGoData(temp);
                                                                        setIsChangedHistory(true);
                                                                        // Loading.hide();
                                                                    }
                                                                },
                                                                {
                                                                    text: '白棋', onPress: () => {
                                                                        // Loading.show();
                                                                        let temp = [...goData];
                                                                        temp[i][j] = '1';
                                                                        setGoData(temp);
                                                                        setIsChangedHistory(true);
                                                                        // Loading.hide();
                                                                    }
                                                                },
                                                                {
                                                                    text: '黑棋', onPress: () => {
                                                                        // Loading.show();
                                                                        let temp = [...goData];
                                                                        temp[i][j] = '-1';
                                                                        setGoData(temp);
                                                                        setIsChangedHistory(true);
                                                                        // Loading.hide();
                                                                    }
                                                                },
                                                            ],
                                                            { cancelable: true },
                                                        );
                                                    }}
                                                >
                                                    {
                                                        qz === '-1' ? <Image source={bq} style={styles.qizi} /> :
                                                            qz === '1' ? <Image source={wq} style={styles.qizi} /> :
                                                                qz === '3' ? <Image source={bq} style={styles.qizi} /> :
                                                                    qz === '-3' ? <Image source={wq} style={styles.qizi} /> : null
                                                    }
                                                    {isGoXS && (qz === '-2' ? <View style={styles.cell_vb}></View> :
                                                        qz === '2' ? <View style={styles.cell_vw}></View> :
                                                            qz === '3' ? <View style={styles.cell_vw}></View> :
                                                                qz === '-3' ? <View style={styles.cell_vb}></View> : null)

                                                    }
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))
                                }
                            </View>
                        </ImageBackground>
                        <ImageBackground source={{ uri: originImg }} resizeMode='contain' style={[styles.goboard, { backgroundColor: 'black' }]}></ImageBackground>
                        <View style={styles.btnview}>
                            <TouchableOpacity
                                style={[styles.btn3, { marginBottom: 60 }]}
                                onPress={() => { setIsGoXS(!isGoXS) }}
                            >
                                <Text style={{ color: 'white', fontSize: 16 }}>
                                    {isGoXS ? "关闭形势" : "开启形势"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={isChangedHistory ? styles.btn3 : styles.btn3_2}
                                disabled={!isChangedHistory}
                                onPress={() => {
                                    Alert.alert(
                                        '提示',
                                        '是否确认修改？修改后会覆盖原有数据，请确认无误。',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                                    console.log('取消修改');
                                                }
                                            },
                                            {
                                                text: '确认', onPress: () => {
                                                    saveChangedGoData();
                                                }
                                            },
                                        ],
                                        { cancelable: true },
                                    )
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 16 }}>
                                    确认修改
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    list: {
        // backgroundColor: 'yellow',
        width: '100%',
        // height: 100,
    },
    options: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsb: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        // backgroundColor:'pink'
    },
    opt_txtinput: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: -10,
        width: 100,
        height: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: 14,
    },
    btndate: {
        width: 100,
        height: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: 14,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    btn1: {
        backgroundColor: "#a25f24",
        width: 60,
        height: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        right: 10,
    },
    headerv: {
        // width: 860,
        width: '100%',
        height: 40,
        // backgroundColor:'pink',
        flexDirection: 'row',
        marginBottom: 10
    },
    headervb: {
        backgroundColor: '#eeeeee',
        // flex:1,
        marginRight: 3,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5,
    },
    listbtn: {
        height: 30,
        width: '100%',
        // backgroundColor: '#f0f0f0',
        marginVertical: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemtxt: {
        fontSize: 16,
        width: 130,
        // fontWeight:'bold',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 3,
        backgroundColor: 'white',
        height: 30,
        textAlign: 'center',
    },
    itemimgv: {
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 3,
        backgroundColor: 'white',
        height: 30,
    },
    footerTxt: {
        width: '100%',
        fontSize: 14,
        color: '#999',
        marginVertical: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    qizires: {
        width: 25,
        height: 25,
        // marginTop: -5
        marginBottom: 15,
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
        borderColor: "#a0a0a0",
    },
    signimg: {
        width: '100%',
        height: '100%',
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
    res_t_b_v: {
        // backgroundColor:'pink',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnv3: {
        // backgroundColor: 'red',
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn2: {
        backgroundColor: "#a25f24",
        width: 160,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    fenyev: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'pink',
    },
    btnview: {
        // width: 60,
        flex: 1,
        height: 360,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'pink',
    },
    btn3: {
        backgroundColor: "#a25f24",
        width: 120,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btn3_2: {
        backgroundColor: "#D0D0D0",
        width: 120,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fenyebtnv: {
        // backgroundColor: 'pink',
        height: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fenyebtnv2: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
        width: 160,
        backgroundColor: 'pink',
    },
});