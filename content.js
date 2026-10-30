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

/* 05征集：
 * introduction：无标题征集介绍（段落数组）。
 * tracks[].blocks：四赛道独立内容；type=paragraph/heading/list，分别为正文/加粗小标题/选题列表。
 * list.items：label为加粗类别，text为描述；无需输入Markdown或HTML。
 * milestones：三个关键时间节点；notes：日期下方无标题通用说明。
 * submission.url：腾讯文档问卷HTTPS链接；enabled=true时启用投稿入口。
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
/* 07常见问题：
 * introduction：页面介绍段落；form：腾讯文档问卷入口。
 * items：增添{question:"问题", answer:"回答", visible:true}后即可显示Q/A。
 * visible=false或问题/回答未填完时均不显示，答案允许用\\n换行。
 */

/* 页尾信息：左侧theme/name/nameEn/date四行，右侧credits三行。
 * 左右底部对齐；不包含返回顶部或额外版权信息。
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
  "submissions": {
    "introduction": [
      "音乐部面向对音乐游戏及相关创作感兴趣的同学开展作品征集。",
      "本届征集设有游戏Demo、音乐、谱面和观察文章四个赛道，既欢迎大家独立创作，也鼓励团队合作和跨赛道合作，并让不同形式的作品相互结合。"
    ],
    "tracks": [
      {
        "id": "game",
        "label": "游戏Demo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "欢迎投稿音乐游戏、节奏游戏、亚音游及其他与音乐游戏相关的游戏作品。"
          },
          {
            "type": "paragraph",
            "text": "作品不必具备完整的游戏内容，可以是仅用于验证核心玩法的白盒原型，也可以是对已有成熟音游的复刻。可以选用已有音乐作品作为创作素材。"
          },
          {
            "type": "heading",
            "text": "提交材料"
          },
          {
            "type": "paragraph",
            "text": "游戏名称、游戏介绍、至少3张游戏宣传图或运行截图。无需提交游戏可运行文件。"
          },
          {
            "type": "heading",
            "text": "展示方式"
          },
          {
            "type": "paragraph",
            "text": "投稿者需自备能够正常运行作品的设备，并在活动当天的全部展出时段内，将设备放置于主办方指定的展位，供现场观众体验。"
          },
          {
            "type": "paragraph",
            "text": "投稿者可在展位进行作品介绍、试玩引导与讲解等。"
          }
        ]
      },
      {
        "id": "music",
        "label": "音乐",
        "blocks": [
          {
            "type": "paragraph",
            "text": "欢迎投稿各类音乐作品，不限曲风与时长。"
          },
          {
            "type": "paragraph",
            "text": "除原创音乐外，也接受对已有音乐作品的改编、混音及其他形式的二次创作。"
          },
          {
            "type": "heading",
            "text": "提交材料"
          },
          {
            "type": "paragraph",
            "text": "音乐名称、音乐音频文件。"
          },
          {
            "type": "heading",
            "text": "展示方式"
          },
          {
            "type": "paragraph",
            "text": "投稿者需自备能够正常播放作品的设备，并在活动当天的全部展出时段内，将设备放置于主办方指定的展位，供现场观众试听。"
          },
          {
            "type": "paragraph",
            "text": "投稿者可在展位进行作品介绍、试听引导与讲解等。"
          }
        ]
      },
      {
        "id": "chart",
        "label": "谱面",
        "blocks": [
          {
            "type": "paragraph",
            "text": "欢迎投稿能够在音乐游戏中实际游玩的自制谱面，不限游玩平台。"
          },
          {
            "type": "paragraph",
            "text": "可以选择已有音乐作品进行创作，也可以为音乐赛道的投稿作品编写谱面，或为游戏Demo赛道的作品制作配套谱面。"
          },
          {
            "type": "paragraph",
            "text": "考虑到现场观众的实际游玩体验，建议适当控制谱面难度，让不同水平的玩家都能够参与体验。"
          },
          {
            "type": "heading",
            "text": "提交材料"
          },
          {
            "type": "paragraph",
            "text": "谱面使用的音乐名称、游玩平台、15—30秒的谱面精华片段视频。无需提交谱面文件。"
          },
          {
            "type": "heading",
            "text": "展示方式"
          },
          {
            "type": "paragraph",
            "text": "投稿者需自备能够正常游玩谱面的设备，并在活动当天的全部展出时段内，将设备放置于主办方指定的展位，供现场观众体验。"
          },
          {
            "type": "paragraph",
            "text": "投稿者可在展位进行作品介绍、试玩引导与讲解等。"
          }
        ]
      },
      {
        "id": "article",
        "label": "观察文章",
        "blocks": [
          {
            "type": "paragraph",
            "text": "欢迎投稿围绕音乐游戏及其相关文化展开的观察文章，字数不少于1500字。"
          },
          {
            "type": "paragraph",
            "text": "文章无需遵循学术论文的格式，但应围绕明确的自定主题展开，做到结构清晰、层次分明。建议合理排版，并根据内容适当使用图片或图表，以便现场观众阅读。"
          },
          {
            "type": "paragraph",
            "text": "可参考的选题方向包括："
          },
          {
            "type": "list",
            "items": [
              {
                "label": "音游推荐",
                "text": "介绍并推荐一款音乐游戏，结合自身体验说明推荐理由。"
              },
              {
                "label": "音游评析",
                "text": "对一款音乐游戏展开评价与分析，讨论其设计特色、优点与不足。"
              },
              {
                "label": "音游拆解",
                "text": "从玩法机制、系统设计、视听表现等角度，分析音乐游戏的具体设计。"
              },
              {
                "label": "音游创意",
                "text": "提出一套详细且具有一定新意的音乐游戏设计构想，并介绍其主要玩法与设计思路。"
              },
              {
                "label": "音游社区观察",
                "text": "围绕音乐游戏社区中的现象、文化或话题展开观察与讨论。"
              },
              {
                "label": "其他方向",
                "text": "以上方向仅供参考，也欢迎大家从其他角度展开创作。"
              }
            ]
          },
          {
            "type": "heading",
            "text": "提交材料"
          },
          {
            "type": "paragraph",
            "text": "文章名称、文章文档文件。"
          },
          {
            "type": "heading",
            "text": "展示方式"
          },
          {
            "type": "paragraph",
            "text": "主办方将在活动前对投稿文章进行全彩打印，并在活动当天的全部展出时段内，将文章放置于指定展位，供现场观众阅读。"
          },
          {
            "type": "paragraph",
            "text": "投稿者可在展位进行作品介绍与交流。"
          }
        ]
      }
    ],
    "milestones": [
      {
        "id": "open",
        "label": "征集开放",
        "date": "2026.11.01"
      },
      {
        "id": "deadline",
        "label": "投稿截止",
        "date": "2026.11.20"
      },
      {
        "id": "showcase",
        "label": "现场展示",
        "date": "2026.11.22"
      }
    ],
    "notes": [
      "本届征集不限制创作工具，不要求作品达到完整成品的完成度。无论是此前已经制作的作品、尚未公开的作品，还是仍在开发中的作品，均可参与投稿，但仍应满足对应赛道的基本要求。",
      "作品不强制要求贴合本届「空间」主题，但鼓励将其作为创作灵感，从不同角度进行探索与表达。",
      "个人或团队均可投稿。同一作者可以参与多个赛道，但在每个赛道中最多提交一件作品。",
      "投稿者应参与所投稿作品的实际创作。涉及已有音乐、美术或其他第三方素材的，应确保相关素材的使用及公开展示符合有关规定。",
      "活动当天将集中展示征集作品，邀请到场观众进行试玩、试听、阅读与交流。展位由主办方统一规划，投稿者应根据实际安排准备相应的作品与设备。若投稿作品数量明显超出场地承载能力，主办方将从中选择一定数量的作品进行现场展示，敬请理解。",
      "投稿内容应符合相关法律法规及校园活动要求，请勿涉及政治、宗教等敏感内容，以及其他不适宜公开展示的内容。",
      "请于投稿截止日期前，通过下方「作品投稿」入口填写腾讯文档问卷，并按对应赛道的要求提交材料。"
    ],
    "submission": {
      "label": "作品投稿",
      "url": "https://docs.qq.com/form/page/DVW1Mb3Njc1VqaE11",
      "enabled": true
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
  },
  "faq": {
    "introduction": [
      "如果您对西柚音游节的活动内容有任何疑问，欢迎通过下方问卷向我们提问。我们将整理具有普遍性的问题及其解答，并陆续更新至本区域。"
    ],
    "form": {
      "label": "提交问题",
      "url": "https://docs.qq.com/form/page/DVU5OTk9iY1FJVXJs",
      "enabled": true
    },
    "items": [
      {
        "question": "",
        "answer": "",
        "visible": false
      }
    ]
  },
  "footer": {
    "theme": "空间/SPACE · CRGF 2026",
    "name": "2026 西柚音游节",
    "nameEn": "Citrus Rhythm Game Festival 2026",
    "date": "2026.11.22",
    "credits": [
      "主办：未来媒体协会·音乐部",
      "联合主办：TRY动漫社·音游部",
      "活动筹备：COT"
    ]
  }
};
