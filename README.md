# 🧠 Smart Go Judge App (智能围棋裁判系统)

这是一个基于 **React Native** 开发的围棋裁判辅助 App Demo，专为裁判员用户设计，简化判局流程、提升比赛效率。系统对接 **云蛇比赛编排系统 API**，可自动获取对阵信息，实现拍照识别、数子判断、选手签字、历史回查等完整流程。

---

## 📱 核心功能

- ✅ 裁判员注册、登录、权限管理
- 🧾 扫描二维码自动获取对阵与轮次信息
- 📷 拍照或图库上传围棋图像
- 🧠 自动识别棋盘和棋子，KataGo 数子判断胜负
- ✍️ 选手电子签名确认结果
- 🗂 查看、修改历史判局记录
- ☁️ 图像与签名上传至 MinIO 对象存储

---

## 🛠 技术栈

### 前端
- [React Native](https://reactnative.dev/)
- [react-navigation](https://reactnavigation.org/)
- [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)
- Pushy 热更新机制
- AsyncStorage 用户状态缓存
- SVG 绘图组件（电子棋盘）、Base64 签名组件

### 后端（需部署）
- 图像预处理：灰度化 + 高光去除（ET-HDR 模型）
- 棋盘识别：YOLOv5 / YOLOv8
- 数子判定：KataGo GTP 接口 + 自定义规则
- 数据存储：MySQL
- 图像与签名存储：MinIO 对象存储服务
- 比赛信息对接：云蛇赛事编排系统 API

---

## 📄 页面功能模块说明

### 🔐 用户模块

- **注册页面**：用户输入校验、RC4+MD5 双重密码加密
- **登录页面**：Token 登录机制，支持 7 天缓存
- **个人中心页面**：查看用户名与权限时间，支持密码修改与登出

### 🧠 比赛判决模块

- **二维码扫描**：
  - 使用 `react-native-vision-camera` 实现摄像头调用
  - 集成 `ean-13` 解码算法，解析比赛对阵二维码
  - 自动获取 `groupId` 与 `seatNum`，拉取对阵列表

- **轮次选择与确认信息页面**：
  - 展示选手姓名、积分、对阵ID
  - 裁判确认信息后可拍照识别

- **拍照与识别页面**：
  - 拍照 / 图库选择图像
  - 可选开启高光去除（ET-HDR 模型）
  - 图像确认后发起识别任务

- **图像识别与判局**：
  - YOLO 模型识别棋盘与棋子
  - 构建棋盘矩阵，调用 KataGo 接口分析形势
  - 返回胜负结果 + 地盘图

- **对决结果页面**：
  - 可交互电子棋盘（误判修改）
  - 重新数子校验机制（修改后强制刷新结果）
  - 电子签名组件获取选手签字（Base64 格式）
  - 数据确认后上传（图像、签字、结果）

### 🗂 历史记录模块

- **记录列表页面**：分页加载、筛选条件（姓名、日期、对阵ID）
- **详情与修改页面**：
  - 原图对照修改电子棋盘
  - 修改后重新数子 → 权限验证 → 上传新结果

---

## 📊 数据库结构设计

### `User` 表

| 字段 | 类型 | 描述 |
|------|------|------|
| id | int | 主键，自增 |
| username | varchar(16) | 用户名（唯一） |
| realName | varchar(16) | 真实姓名 |
| password | varchar(255) | RC4+MD5 加密 |
| vipCountDate | timestamp | 权限到期时间 |
| updateTime | timestamp | 更新时间 |

### `Game` 表

| 字段 | 类型 | 描述 |
|------|------|------|
| id | int | 主键 |
| gameName | varchar(128) | 比赛名称 |
| againstPlanId | varchar(128) | 对阵 ID |
| groupId | varchar(128) | 组别 ID |
| blackName / whiteName | varchar(64) | 棋手姓名 |
| seatNum / seatNum1 | varchar(64) | 台号 |
| judge | int | 裁判员 ID |
| goData | text | SGF 数据（Base64） |
| goMatrix | varchar(64) | 棋盘二维数组 |
| blackNum / whiteNum | varchar(64) | 数子结果 |
| winRes | varchar(10) | 胜负 |
| blackSign / whiteSign | text | 签名（Base64） |
| originImg | text | 原图 URL（MinIO） |
| gTime | timestamp | 判局时间 |
| recordTimes | int | 修改次数 |

---

## 🔍 判局核心流程图

```mermaid
graph TD
  A[扫码比赛二维码] --> B[获取对阵信息 + 轮次]
  B --> C[拍照上传图像]
  C --> D[YOLO 棋子识别]
  D --> E[KataGo 数子 + 地盘判定]
  E --> F[电子棋盘交互修改]
  F --> G[胜负结果 + 签字确认]
  G --> H[上传记录 + 存储原图至 MinIO]
