/* 网站文案与活动信息：日常修改优先编辑此文件。
 * schedule.main：主会场节目，顺序就是显示顺序，children是子环节。
 * time表示主环节开始时间，start/end表示子环节的时间范围。
 * 含speaker的节目可填写title作为演讲题目；未定时留空即可。
 * schedule.ongoing：常驻展出；site.sections：章节标题；site.navigation：页首导航。
 */
/* 03赛事：tournament.introduction为介绍，details为通用详情。
 * tournament.groups分别存两组的时间地点、游戏图标路径及折叠赛制。
 * tournament.registration.conditions/notices填写通用报名说明。
 * registration.groups分别填写腾讯文档问卷完整URL并将enabled设为true。
 * 游戏图标文件应放在assets/games目录，路径见groups.games.logo。
 */
window.FESTIVAL_CONTENT = {
  "site": {
    "name": "西柚音游节",
    "nameEn": "Citrus Rhythm Game Festival",
    "navigation": [
      {
        "id": "intro",
        "label": "简介"
      },
      {
        "id": "schedule",
        "label": "日程"
      },
      {
        "id": "tournament",
        "label": "赛事"
      },
      {
        "id": "salon",
        "label": "茶欢"
      },
      {
        "id": "submissions",
        "label": "征集"
      },
      {
        "id": "experience",
        "label": "体验"
      }
    ],
    "sections": [
      {
        "id": "intro",
        "number": "01",
        "name": "简介",
        "nameEn": "INTRO"
      },
      {
        "id": "schedule",
        "number": "02",
        "name": "日程",
        "nameEn": "SCHEDULE"
      },
      {
        "id": "tournament",
        "number": "03",
        "name": "音游赛事",
        "nameEn": "TOURNAMENT"
      },
      {
        "id": "salon",
        "number": "04",
        "name": "主题分享茶欢会",
        "nameEn": "SALON"
      },
      {
        "id": "submissions",
        "number": "05",
        "name": "创作作品征集",
        "nameEn": "SUBMISSIONS"
      },
      {
        "id": "experience",
        "number": "06",
        "name": "现场体验",
        "nameEn": "EXPERIENCE"
      },
      {
        "id": "faq",
        "number": "07",
        "name": "常见问题",
        "nameEn": "Q&A"
      }
    ]
  },
  "intro": {
    "paragraphs": [
      "西柚音游节是由未来媒体协会·音乐部与TRY动漫社·音游部联合发起的音乐游戏活动日。",
      "本届活动将汇集音游赛事、主题分享茶欢会、创作作品征集与现场体验，邀请音乐游戏的玩家、爱好者与创作者相聚于此，共同探索音乐游戏的更多可能。"
    ],
    "theme": {
      "name": "空间",
      "nameEn": "SPACE",
      "paragraphs": [
        "在音乐游戏中，空间由规则界定，由音乐塑造，又由玩家的操作而化为切实的体验。音符的排列与延伸，音乐的远近与层次，操作的轨迹与反馈，都在不断改变我们感知音乐游戏的方式。",
        "空间并不止于游戏与音乐，它存在于创作者的构想之中，也存在于每一次分享、交流与相遇之间。当构想化为作品，当相遇引发共鸣，原本属于个人的空间，便有了向更多人敞开的可能。"
      ],
      "conclusion": "空间可以被看见、被听见、被碰见，也可以由我们共同创造。",
      "invitation": "本届西柚音游节以「空间」为主题，邀请大家从词语本身、游戏、音乐、文化、情绪等不同视角展开探索。不必拘泥于某一种解释，也不必局限于某一种表现形式。"
    }
  },
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
        "title": "音游赛事",
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
            "speaker": "cot",
            "title": "学术视角下的音乐游戏Ⅱ"
          },
          {
            "start": "15:45",
            "end": "16:15",
            "speaker": "雨令",
            "title": ""
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
    ]
  },
  "tournament": {
    "introduction": {
      "heading": "赛事介绍",
      "paragraphs": [
        "音游赛事是TRY动漫社·音游部长期开展的常规活动。本届音游秋季赛将作为西柚音游节的组成部分，继续由TRY动漫社·音游部主办，分设街机组与移动组两个组别。"
      ]
    },
    "details": {
      "heading": "赛事详情",
      "paragraphs": []
    },
    "groups": [
      {
        "id": "arcade",
        "heading": "街机组",
        "date": "11月21日（周六）",
        "period": "下午",
        "venue": "米莱音游研究所",
        "games": [
          {
            "id": "maimai_dx",
            "name": "舞萌DX",
            "logo": "./assets/games/maimai_dx_logo.webp"
          },
          {
            "id": "chunithm",
            "name": "中二节奏",
            "logo": "./assets/games/chunithm_logo.webp"
          }
        ],
        "rulesSummary": "查看街机组赛制",
        "rules": [],
        "pendingLabel": "赛制详情待公布"
      },
      {
        "id": "mobile",
        "heading": "移动组",
        "date": "11月22日（周日）",
        "period": "上午",
        "venue": "",
        "venuePending": "具体教室待定",
        "games": [
          {
            "id": "phigros",
            "name": "Phigros",
            "logo": "./assets/games/phigros_icon.webp"
          },
          {
            "id": "arcaea",
            "name": "Arcaea",
            "logo": "./assets/games/arcaea_icon.webp"
          }
        ],
        "rulesSummary": "查看移动组赛制",
        "rules": [],
        "pendingLabel": "赛制详情待公布"
      }
    ],
    "registration": {
      "heading": "赛事报名",
      "conditionsHeading": "报名条件",
      "conditions": [],
      "noticesHeading": "报名须知",
      "notices": [],
      "groups": [
        {
          "id": "arcade",
          "label": "街机组报名",
          "url": "",
          "enabled": false,
          "unavailableLabel": "街机组报名未开放"
        },
        {
          "id": "mobile",
          "label": "移动组报名",
          "url": "",
          "enabled": false,
          "unavailableLabel": "移动组报名未开放"
        }
      ]
    }
  }
};
