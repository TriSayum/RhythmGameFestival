/* 02日程与04茶欢会共用的唯一节目数据。
 * schedule.main：按时间顺序列出主会场节目及子节目。
 * schedule.mainHeader / ongoingHeader：02两组黑色标题条中的日期、地点。
 * salon.info：04专用的日期、时段、地点简要说明。
 * salon.introduction：04的介绍段落，暂时留空。
 * salon.speakers：讲者名称、可选头像路径和多行介绍（bio数组）。
 * 正式分享标记 type: "talk" 并使用 speakerId 关联讲者。
 * 02显示所有节目；04只显示正式分享，不显示会前预热。
 */
window.FESTIVAL_PROGRAM = {
  "schedule": {
    "mainTitle": "主会场",
    "ongoingTitle": "同期开放",
    "main": [
      {
        "id": "opening",
        "time": "10:00",
        "title": "开幕"
      },
      {
        "id": "tournament",
        "time": "10:10",
        "title": "移动组赛事",
        "children": [
          {
            "start": "10:10",
            "end": "10:20",
            "title": "赛前预热"
          },
          {
            "start": "10:20",
            "end": "11:50",
            "title": "正式比赛"
          },
          {
            "start": "11:50",
            "end": "12:10",
            "title": "颁奖典礼"
          }
        ]
      },
      {
        "id": "salon",
        "time": "13:30",
        "title": "主题分享茶欢会",
        "children": [
          {
            "start": "13:30",
            "end": "13:40",
            "title": "会前预热"
          },
          {
            "start": "13:40",
            "end": "15:40",
            "title": "学术视角下的音乐游戏Ⅱ",
            "id": "talk-cot",
            "type": "talk",
            "speakerId": "cot"
          },
          {
            "start": "15:45",
            "end": "16:15",
            "title": "",
            "id": "talk-yuling",
            "type": "talk",
            "speakerId": "yuling"
          }
        ]
      },
      {
        "id": "focused-experience",
        "time": "16:20",
        "title": "作品集中体验"
      },
      {
        "id": "awards-and-closing",
        "time": "17:00",
        "title": "创作作品颁奖典礼、闭幕"
      },
      {
        "id": "free-experience",
        "time": "17:20",
        "title": "自由交流与参观"
      },
      {
        "id": "end",
        "time": "20:00",
        "title": "结束"
      }
    ],
    "ongoing": [
      {
        "id": "works-exhibition",
        "start": "10:00",
        "end": "20:00",
        "title": "创作作品展览"
      },
      {
        "id": "hands-on",
        "start": "10:00",
        "end": "20:00",
        "title": "现场体验"
      }
    ],
    "mainHeader": {
      "date": "11月22日",
      "venue": "具体教室待定"
    },
    "ongoingHeader": {
      "date": "11月22日",
      "venue": "具体教室待定"
    }
  },
  "salon": {
    "introduction": [],
    "info": {
      "date": "11月22日",
      "period": "下午",
      "venue": "具体教室待定"
    },
    "speakers": {
      "cot": {
        "name": "cot",
        "avatar": "",
        "bio": []
      },
      "yuling": {
        "name": "雨令",
        "avatar": "",
        "bio": []
      }
    }
  }
};
