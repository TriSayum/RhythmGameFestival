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

/* 06现场体验：
 * introduction：章节开场介绍（可留空）。
 * items：按排列顺序显示四件音游作品与最后的碟机，均用相同细线分隔。
 * 每项 visible:true 才展示；false 时完全跳过，不保留空白或分隔线。
 * game：name名称、summary一句简介、description一段介绍、image图片路径。
 * 图片默认16:9横向展示，不裁切；未填写image时不显示空图片区。
 * equipment：name与description纯文字，不添加图片或额外分隔。
 * 初始均设为false，避免对外展示尚未确定的内容。
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
  },
  "experience": {
    "introduction": [
      "除了上述内容，音乐部还将在现场准备数款音乐游戏作品及相关设备，欢迎大家在活动期间自由体验。"
    ],
    "items": [
      {
        "id": "in-falsus",
        "type": "game",
        "visible": true,
        "name": "In Falsus",
        "summary": "由lowiro于今年九月初发售的音乐游戏×卡牌制成×故事剧情作品",
        "description": "在被真实裹挟的世界里，「连接」。《In Falsus》将细致的卡牌系统与层层递进的剧情紧密结合，是一款魅力独特的节奏游戏。通过五位主角的不同视角体验相互交织的故事，享受深刻反映剧情的各式乐曲，纵身沉浸于近未来的鲜艳世界之中。",
        "image": "./assets/experience/in_falsus_poster.webp"
      },
      {
        "id": "game-02",
        "type": "game",
        "visible": false,
        "name": "",
        "summary": "",
        "description": "",
        "image": ""
      },
      {
        "id": "game-03",
        "type": "game",
        "visible": false,
        "name": "",
        "summary": "",
        "description": "",
        "image": ""
      },
      {
        "id": "theia-zero",
        "type": "game",
        "visible": true,
        "name": "忒伊亚零",
        "summary": "由COT全栈开发的2026动院毕设展音游作品",
        "description": "《忒伊亚零》是一款融合了弹幕躲避的3D音乐游戏。\n*只写这么点不是因为犯懒了是因为真就只有这么多可以介绍的了QAQ",
        "image": "./assets/experience/theia_zero_poster.webp"
      },
      {
        "id": "turntable",
        "type": "equipment",
        "visible": false,
        "name": "碟机",
        "description": ""
      }
    ]
  }
};
