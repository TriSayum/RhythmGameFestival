/* 网站文案与活动信息：日常修改优先编辑此文件。
 * 02日程和04茶欢会共用的节目与讲者数据已迁移到program.js。
 * 本文件保留活动名称、01简介、03赛事和其他章节内容。
 */
/* 03赛事：
 * tournament.introduction.paragraphs：赛事介绍（不显示小标题）。
 * tournament.details.paragraphs：两组通用赛事详情。
 * tournament.groups：组别、时间、地点、Logo路径及可折叠的赛制。
 * tournament.registration.description：报名说明（一个正文段落）。
 * tournament.registration.groups：分别填写腾讯文档问卷URL并设置enabled为true。
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
  "tournament": {
    "introduction": {
      "paragraphs": [
        "音游赛事是TRY动漫社·音游部长期开展的常规活动。本届音游秋季赛将作为西柚音游节的组成部分，继续由音游部主办，并分设街机组与移动组两个组别。"
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
        "date": "11月21日",
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
        "rulesSummary": "查看详细信息",
        "rules": [],
        "pendingLabel": ""
      },
      {
        "id": "mobile",
        "heading": "移动组",
        "date": "11月22日",
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
        "rulesSummary": "查看详细信息",
        "rules": [],
        "pendingLabel": ""
      }
    ],
    "registration": {
      "heading": "赛事报名",
      "description": "",
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
