/* 页面渲染逻辑；文字与节目数据请在content.js中修改。 */
(function () {
  "use strict";

  const data = window.FESTIVAL_CONTENT;
  const program = window.FESTIVAL_PROGRAM;
  if (!data || !program) {
    console.error("content.js或program.js未加载，无法显示网站内容。");
    return;
  }

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = String(text);
    return el;
  }

  function time(value, className) {
    const el = make("time", className, value);
    el.setAttribute("datetime", value);
    return el;
  }

  function addParagraphs(root, texts) {
    (texts || []).forEach(function (value) {
      root.appendChild(make("p", "", value));
    });
  }

  function renderHeader() {
    const brand = document.getElementById("site-brand");
    // 页首品牌区复用原二维码完整矢量轮廓；透明渐变版可替换为
    // ./assets/hero/header-logo-white.svg 切换成透明纯白版本。
    const logo = make("img", "site-brand-logo");
    logo.src = "./assets/hero/favicon.svg";
    logo.alt = "";
    logo.draggable = false;
    logo.decoding = "async";
    logo.setAttribute("aria-hidden", "true");
    const brandText = make("span", "site-brand-text");
    brandText.append(
      make("span", "site-brand-cn", data.site.name),
      make("span", "site-brand-en", data.site.nameEn)
    );
    brandText.lastElementChild.lang = "en";
    brand.append(logo, brandText);
    brand.setAttribute("aria-label", data.site.name + "，返回页首");

    const nav = document.getElementById("site-nav");
    data.site.navigation.forEach(function (item) {
      const link = make("a", "", item.label);
      link.href = "#" + item.id;
      nav.appendChild(link);
    });
    document.title = data.site.name + " | " + data.site.nameEn;
  }

  /* 移动端菜单：内容在页首下方平滑展开，不改变页首高度。 */
  function setupMobileNavigation() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    const header = document.querySelector(".site-header");
    if (!toggle || !nav || !header) return;
    function setOpen(open) {
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "展开导航菜单");
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    const brand = document.getElementById("site-brand");
    if (brand) brand.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("pointerdown", function (event) {
      if (!header.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760 && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    }, { passive: true });
  }

  function renderHeadings() {
    data.site.sections.forEach(function (item) {
      const root = document.getElementById(item.id + "-heading");
      if (!root) return;
      root.append(
        make("span", "section-number", item.number),
        make("span", "section-name", item.name),
        make("span", "section-en", item.nameEn)
      );
      root.lastElementChild.lang = "en";
    });
  }

  function renderIntro() {
    const root = document.getElementById("intro-content");
    const overview = make("div", "intro-overview");
    addParagraphs(overview, data.intro.paragraphs);
    root.appendChild(overview);

    const theme = data.intro.theme;
    const body = make("div", "theme-content");
    body.setAttribute("aria-labelledby", "theme-heading");

    // 外轮廓直接作为图片渲染，避免外部SVG遮罩在部分浏览器失效。
    // 字标按与正文相同的可用内容宽度居中，不需要JS滚动或像素补偿。
    const displayName = theme.displayName || theme.name;
    const heading = make("h3", "theme-heading");
    heading.id = "theme-heading";
    heading.setAttribute("aria-label", displayName + " / " + theme.nameEn);
    const outline = make("img", "theme-heading-outline");
    outline.src = "./assets/hero/space-theme-outline.svg";
    outline.alt = "";
    outline.draggable = false;
    outline.setAttribute("aria-hidden", "true");
    const foreground = make("span", "theme-heading-cn", displayName);
    foreground.setAttribute("aria-hidden", "true");
    heading.append(outline, foreground);
    body.appendChild(heading);
    addParagraphs(body, theme.paragraphs);
    body.appendChild(make("p", "theme-conclusion", theme.conclusion));
    body.appendChild(make("p", "theme-invitation", theme.invitation));
    root.appendChild(body);
  }

  function renderChild(item) {
    const row = make("li", "timeline-child");
    const range = make("span", "timeline-child-time");
    range.appendChild(time(item.start));
    if (item.end) {
      range.appendChild(document.createTextNode("—"));
      range.appendChild(time(item.end));
    }
    const detail = make("div", "timeline-child-detail");
    const speaker = item.speakerId ? program.salon.speakers[item.speakerId] : null;
    if (speaker?.name) detail.appendChild(make("span", "timeline-speaker", speaker.name));
    if (item.title) {
      const label = speaker ? "《" + item.title + "》" : item.title;
      detail.appendChild(make("span", "timeline-child-title", label));
    }
    row.append(range, detail);
    return row;
  }

  function renderEvent(item) {
    const row = make("li", "timeline-item");
    row.id = "schedule-" + item.id;
    row.appendChild(time(item.time, "timeline-time"));
    const node = make("span", "timeline-marker");
    node.setAttribute("aria-hidden", "true");
    row.appendChild(node);

    const detail = make("div", "timeline-detail");
    detail.appendChild(make("h4", "timeline-title", item.title));
    if (Array.isArray(item.children) && item.children.length) {
      const list = make("ol", "timeline-children");
      item.children.forEach(function (child) {
        list.appendChild(renderChild(child));
      });
      detail.appendChild(list);
    }
    row.appendChild(detail);
    return row;
  }

  function renderOngoing(item) {
    const row = make("li", "ongoing-item");
    const hours = make("div", "ongoing-time");
    hours.append(time(item.start), document.createTextNode("—"), time(item.end));
    const heading = make("h4", "ongoing-title", item.title);
    // 由program.js提供跳转目标；整个卡片都是原生链接，支持键盘操作。
    if (item.target && document.getElementById(item.target)) {
      const link = make("a", "ongoing-link");
      link.href = "#" + item.target;
      link.append(hours, heading);
      row.appendChild(link);
    } else {
      // 尚未填写有效目标时保持普通展示，不生成失效链接。
      const body = make("div", "ongoing-static");
      body.append(hours, heading);
      row.appendChild(body);
    }
    return row;
  }

  /* 02日程：日期、地点与大标题统一显示在紧凑的深色横贯条内。 */
  function addScheduleBlockHeader(block, heading, meta) {
    const banner = make("div", "schedule-block-banner");
    if (meta && (meta.date || program.mainVenue)) {
      const note = make("div", "schedule-block-meta");
      if (meta.date) note.appendChild(make("span", "schedule-block-date", meta.date));
      if (program.mainVenue) note.appendChild(make("span", "schedule-block-venue", program.mainVenue));
      banner.appendChild(note);
    }
    banner.appendChild(make("h3", "schedule-block-heading", heading));
    block.appendChild(banner);
  }

  function renderSchedule() {
    const root = document.getElementById("schedule-content");
    const schedule = program.schedule;
    const mainBlock = make("div", "schedule-block");
    addScheduleBlockHeader(mainBlock, schedule.mainTitle, schedule.mainHeader);
    const timeline = make("ol", "timeline");
    schedule.main.forEach(function (item) {
      timeline.appendChild(renderEvent(item));
    });
    mainBlock.appendChild(timeline);
    root.appendChild(mainBlock);

    const ongoingBlock = make("div", "schedule-block");
    addScheduleBlockHeader(ongoingBlock, schedule.ongoingTitle, schedule.ongoingHeader);
    const ongoingList = make("ul", "ongoing-list");
    schedule.ongoing.forEach(function (item) {
      ongoingList.appendChild(renderOngoing(item));
    });
    ongoingBlock.appendChild(ongoingList);
    root.appendChild(ongoingBlock);
  }



  /* 03与05共用同一组时间节点结构；可通过额外class调整列数。 */
  function renderMilestones(entries, extraClass) {
    const list = make("ol", "submissions-milestones" + (extraClass ? " " + extraClass : ""));
    (entries || []).forEach(function (item) {
      const milestone = make("li", "submissions-milestone");
      const heading = make("div", "submissions-milestone-heading");
      heading.appendChild(make("span", "submissions-milestone-cn", item.label));
      milestone.append(heading, make("div", "submissions-milestone-date", item.date));
      list.appendChild(milestone);
    });
    return list;
  }

  /* 03赛事：两组数据化卡片、保留待公布详情折叠和独立报名入口。 */
  function renderTournament() {
    const content = data.tournament;
    const root = document.getElementById("tournament-content");
    if (!root || !content) return;

    function addTextBlock(heading, paragraphs, extraClass) {
      const block = make("div", "tournament-block" + (extraClass ? " " + extraClass : ""));
      if (heading) block.appendChild(make("h3", "tournament-block-heading", heading));
      const body = make("div", "tournament-block-body");
      addParagraphs(body, paragraphs);
      block.appendChild(body);
      root.appendChild(block);
    }

    addTextBlock(null, content.introduction.paragraphs, "tournament-introduction");
    // 赛制待公布时只显示正文，不生成空的“赛事详情”小标题。
    if (content.details?.paragraphs?.length) {
      addTextBlock(null, content.details.paragraphs, "tournament-common-details");
    }

    const cards = make("div", "tournament-groups");
    content.groups.forEach(function (group) {
      const card = make("article", "tournament-group-card tournament-group-card--" + group.id);
      card.id = "tournament-" + group.id;

      card.appendChild(make("h3", "tournament-group-heading", group.heading));
      // 时间和地点保持完全一致的信息层级，便于两组卡片横向比较。
      const meta = make("dl", "tournament-group-meta");
      const dateEntry = make("div", "tournament-group-meta-item");
      dateEntry.appendChild(make("dt", "tournament-group-meta-label", "时间"));
      const dateValue = make("dd", "tournament-group-meta-value", group.date);
      if (group.period) dateValue.appendChild(document.createTextNode(" " + group.period));
      dateEntry.appendChild(dateValue);

      const venueEntry = make("div", "tournament-group-meta-item");
      venueEntry.appendChild(make("dt", "tournament-group-meta-label", "地点"));
      venueEntry.appendChild(make("dd", "tournament-group-meta-value", group.venueRef === "main" ? program.mainVenue : (group.venue || group.venuePending || "")));
      meta.append(dateEntry, venueEntry);
      card.appendChild(meta);

      // “项目”与“时间”“地点”左对齐，形成一致的信息标签。
      card.appendChild(make("h4", "tournament-games-heading", "项目"));
      const gameList = make("ul", "tournament-game-list");
      (group.games || []).forEach(function (game) {
        const item = make("li", "tournament-game");
        const artwork = make("div", "tournament-game-artwork");
        if (game.logo) {
          const img = make("img", "tournament-game-image");
          img.src = game.logo;
          img.alt = game.name + "标识";
          img.loading = "lazy";
          img.decoding = "async";
          img.addEventListener("error", function () {
            img.hidden = true; // 资源未提交时保留游戏文字，避免展示浏览器破图标识
          });
          artwork.appendChild(img);
        }
        // 四个比赛项目统一采用游戏标识在上、名称在下的视觉结构。
        item.appendChild(artwork);
        item.appendChild(make("span", "tournament-game-name", game.name));
        gameList.appendChild(item);
      });
      card.appendChild(gameList);

      const rules = make("details", "tournament-group-rules");
      const summary = make("summary", "tournament-rules-summary", group.rulesSummary);
      rules.appendChild(summary);
      const contentBody = make("div", "tournament-rules-body");
      if (group.rules && group.rules.length) {
        addParagraphs(contentBody, group.rules);
      } else {
        contentBody.appendChild(make("p", "tournament-pending", group.pendingLabel));
      }
      rules.appendChild(contentBody);
      card.appendChild(rules);
      cards.appendChild(card);
    });
    root.appendChild(cards);

    const registration = content.registration;
    const regBlock = make("div", "tournament-block tournament-registration");
    // 复用05时间节点组件，不生成“赛事报名”小标题。
    if (registration.milestones?.length) {
      regBlock.appendChild(renderMilestones(registration.milestones, "tournament-milestones"));
    }

    // 报名条件和注意事项统一在时间节点后的正文中说明。
    if (registration.description) {
      regBlock.appendChild(make("p", "tournament-registration-description", registration.description));
    }

    const actions = make("div", "tournament-registration-actions");
    registration.groups.forEach(function (group) {
      let destination = "";
      if (group.enabled && typeof group.url === "string") {
        try {
          const url = new URL(group.url);
          if (url.protocol === "https:" || url.protocol === "http:") {
            destination = url.href;
          }
        } catch (_) {
          // 空链接或非法网址保持关闭状态。
        }
      }
      if (destination) {
        const link = make("a", "tournament-registration-link");
        link.appendChild(make("span", "button-label", group.label + " ↗"));
        link.href = destination;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        actions.appendChild(link);
      } else {
        const disabled = make("span", "tournament-registration-link is-disabled", group.unavailableLabel);
        disabled.setAttribute("aria-disabled", "true");
        actions.appendChild(disabled);
      }
    });
    regBlock.appendChild(actions);
    root.appendChild(regBlock);
  }

  /* 04茶欢会：采用左主题/右讲者的信息层级，仅呈现正式分享。 */
  function renderSalon() {
    const root = document.getElementById("salon-content");
    if (!root || !program.salon) return;

    const salon = program.salon;
    if (salon.introduction?.length) {
      const intro = make("div", "salon-introduction");
      addParagraphs(intro, salon.introduction);
      root.appendChild(intro);
    }

    const list = make("div", "salon-talk-list");
    const salonEvent = program.schedule.main.find(function (event) {
      return event.id === "salon";
    });
    const talks = (salonEvent?.children || []).filter(function (item) {
      return item.type === "talk";
    });

    talks.forEach(function (talk) {
      const speaker = salon.speakers[talk.speakerId];
      const row = make("article", "salon-talk");
      if (talk.id) row.id = "salon-" + talk.id;

      const subject = make("div", "salon-talk-subject");
      // 左右两栏顶部齐平：左侧标题，右侧讲者。
      // 日期、场次时间和地点放在标题下方，不再重复一个章节总信息栏。
      // 02仍只展示“雨令”；04的空题目单独显示待公布，不加书名号。
      subject.appendChild(make("h4", talk.title ? "salon-talk-title" : "salon-talk-title salon-talk-title--pending",
        talk.title || "分享主题待公布"));
      const metadata = make("div", "salon-talk-meta");
      if (salon.info?.date) {
        metadata.appendChild(make("span", "salon-talk-date", salon.info.date));
      }
      const range = make("span", "salon-talk-time");
      range.appendChild(time(talk.start));
      if (talk.end) {
        range.appendChild(document.createTextNode("—"));
        range.appendChild(time(talk.end));
      }
      metadata.appendChild(range);
      if (program.mainVenue) {
        metadata.appendChild(make("span", "salon-talk-venue", program.mainVenue));
      }
      subject.appendChild(metadata);
      row.appendChild(subject);

      const person = make("div", "salon-talk-speaker");
      if (speaker?.avatar) {
        const avatar = make("img", "salon-speaker-avatar");
        avatar.src = speaker.avatar;
        avatar.alt = speaker.name + "的头像";
        avatar.loading = "lazy";
        avatar.addEventListener("error", function () { avatar.hidden = true; });
        person.appendChild(avatar);
      }
      const personInfo = make("div", "salon-speaker-details");
      if (speaker?.name) personInfo.appendChild(make("h4", "salon-speaker-name", speaker.name));
      if (speaker?.bio?.length) {
        const bio = make("div", "salon-speaker-bio");
        speaker.bio.filter(Boolean).forEach(function (line) {
          bio.appendChild(make("p", "", line));
        });
        personInfo.appendChild(bio);
      }
      person.appendChild(personInfo);
      row.appendChild(person);
      list.appendChild(row);
    });
    root.appendChild(list);
  }



  /* 05创作作品征集：四选一标签与正文共用边框，三项关键日期另成一栏。 */
  function renderSubmissions() {
    const root = document.getElementById("submissions-content");
    const config = data.submissions;
    if (!root || !config) return;

    if (config.introduction?.length) {
      const intro = make("div", "submissions-introduction");
      addParagraphs(intro, config.introduction);
      root.appendChild(intro);
    }

    if (config.tracks?.length) {
      const shell = make("div", "submissions-track-shell");
      const tablist = make("div", "submissions-tabs");
      tablist.setAttribute("role", "tablist");
      tablist.setAttribute("aria-label", "征集赛道");
      const panel = make("div", "submissions-track-panel");
      panel.id = "submissions-track-panel";
      panel.tabIndex = 0;
      panel.setAttribute("role", "tabpanel");
      const tabs = config.tracks.map(function (track) {
        const tab = make("button", "submissions-tab", track.label);
        tab.type = "button";
        tab.id = "submissions-tab-" + track.id;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", panel.id);
        tablist.appendChild(tab);
        return tab;
      });
      function select(index, shouldFocus) {
        tabs.forEach(function (tab, i) {
          tab.setAttribute("aria-selected", i === index ? "true" : "false");
          tab.tabIndex = i === index ? 0 : -1;
        });
        panel.setAttribute("aria-labelledby", tabs[index].id);
        panel.replaceChildren();
        const track = config.tracks[index];
        if (track.blocks?.length) {
          // 规则文字完全由数据驱动，支持正文、小标题和列表；不解析HTML。
          track.blocks.forEach(function (block) {
            if (block.type === "paragraph") {
              panel.appendChild(make("p", "submissions-track-paragraph", block.text));
            } else if (block.type === "heading") {
              panel.appendChild(make("h3", "submissions-track-heading", block.text));
            } else if (block.type === "list") {
              const list = make("ul", "submissions-track-list");
              (block.items || []).forEach(function (entry) {
                const item = make("li", "submissions-track-list-item");
                if (entry.label) item.appendChild(make("strong", "", entry.label + "："));
                if (entry.text) item.appendChild(document.createTextNode(entry.text));
                list.appendChild(item);
              });
              panel.appendChild(list);
            }
          });
        } else {
          addParagraphs(panel, track.paragraphs);
        }
        if (shouldFocus) tabs[index].focus();
      }
      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () { select(index, false); });
        tab.addEventListener("keydown", function (event) {
          let next;
          switch (event.key) {
            case "ArrowRight": next = (index + 1) % tabs.length; break;
            case "ArrowLeft": next = (index - 1 + tabs.length) % tabs.length; break;
            case "ArrowDown": next = (index + (window.matchMedia?.("(max-width: 680px)").matches ? 2 : 1)) % tabs.length; break;
            case "ArrowUp": next = (index + tabs.length - (window.matchMedia?.("(max-width: 680px)").matches ? 2 : 1)) % tabs.length; break;
            case "Home": next = 0; break;
            case "End": next = tabs.length - 1; break;
            default: return;
          }
          event.preventDefault();
          select(next, true);
        });
      });
      shell.append(tablist, panel);
      root.appendChild(shell);
      select(0, false);
    }

    if (config.milestones?.length) {
      root.appendChild(renderMilestones(config.milestones));
    }

    if (config.notes?.length) {
      const notes = make("div", "submissions-notes");
      addParagraphs(notes, config.notes);
      root.appendChild(notes);
    }

    if (config.submission) {
      const action = make("div", "submissions-action");
      const setting = config.submission;
      let target = "";
      if (setting.enabled && typeof setting.url === "string") {
        try {
          const parsed = new URL(setting.url);
          if (parsed.protocol === "https:") target = parsed.href;
        } catch (_) { /* 未填写链接或链接无效时关闭投稿 */ }
      }
      const label = setting.label + " ↗";
      if (target) {
        const link = make("a", "submissions-submit-link");
        link.appendChild(make("span", "button-label", label));
        link.href = target;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        action.appendChild(link);
      } else {
        const unavailable = make("span", "submissions-submit-link is-disabled", label);
        unavailable.setAttribute("aria-disabled", "true");
        unavailable.title = "投稿入口尚未开放";
        action.appendChild(unavailable);
      }
      root.appendChild(action);
    }
  }

  /* 06现场体验：四款游戏与设备共用一份顺序列表，不为设备设置特别分隔。 */
  function renderExperience() {
    const root = document.getElementById("experience-content");
    const experience = data.experience;
    if (!root || !experience) return;

    if (Array.isArray(experience.introduction) && experience.introduction.length) {
      const intro = make("div", "experience-introduction");
      addParagraphs(intro, experience.introduction);
      root.appendChild(intro);
    }

    const list = make("div", "experience-list");
    (experience.items || []).forEach(function (item) {
      if (item.visible !== true) return;

      // 当内容仍全部留空时，不渲染没有实际信息的空白条目。
      if (!item.name && !item.summary && !item.description && !item.image) return;

      const game = item.type === "game";
      const row = make("article", game ? "experience-item experience-item--game" : "experience-item experience-item--equipment");
      if (item.id) row.id = "experience-" + item.id;

      const textBlock = make("div", "experience-item-text");
      if (item.name) textBlock.appendChild(make("h3", "experience-item-name", item.name));
      // 设备的第一段保留较醒目的介绍，第二段采用与集章说明一致的普通正文。
      if (item.summary) {
        textBlock.appendChild(make("p", game ? "experience-item-summary" : "experience-item-description", item.summary));
      }
      if (item.description) {
        textBlock.appendChild(make("p", game ? "experience-item-description" :
          "experience-item-description experience-item-description--body", item.description));
      }
      row.appendChild(textBlock);

      if (game && item.image) {
        const artwork = make("div", "experience-item-artwork");
        const image = make("img", "experience-item-image");
        image.src = item.image;
        image.alt = (item.name || "音乐游戏") + "展示图片";
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", function () {
          artwork.hidden = true;
          row.classList.add("experience-item--no-image");
        });
        artwork.appendChild(image);
        row.appendChild(artwork);
      } else {
        row.classList.add("experience-item--no-image");
      }
      list.appendChild(row);
    });

    if (list.childElementCount) root.appendChild(list);
    // 集章说明接在设备介绍后，仅作为段落，不增加小标题。
    if (experience.postscript) {
      root.appendChild(make("p", "experience-postscript", experience.postscript));
    }
  }


  /* 07常见问题：介绍、问卷链接，以及可隐藏的Q/A问答。 */
  function renderFaq() {
    const root = document.getElementById("faq-content");
    const faq = data.faq;
    if (!root || !faq) return;

    if (faq.introduction?.length) {
      const intro = make("div", "faq-introduction");
      addParagraphs(intro, faq.introduction);
      root.appendChild(intro);
    }

    if (faq.form) {
      const action = make("div", "faq-action");
      let href = "";
      if (faq.form.enabled && typeof faq.form.url === "string") {
        try {
          const link = new URL(faq.form.url);
          if (link.protocol === "https:") href = link.href;
        } catch (_) { /* 链接无效时禁用按钮 */ }
      }
      const label = (faq.form.label || "提交问题") + " ↗";
      if (href) {
        const link = make("a", "faq-form-link");
        link.appendChild(make("span", "button-label", label));
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        action.appendChild(link);
      } else {
        const disabled = make("span", "faq-form-link is-disabled", label);
        disabled.setAttribute("aria-disabled", "true");
        action.appendChild(disabled);
      }
      root.appendChild(action);
    }

    const list = make("div", "faq-list");
    (faq.items || []).forEach(function (entry) {
      if (entry.visible !== true || typeof entry.question !== "string" || !entry.question.trim()
          || typeof entry.answer !== "string" || !entry.answer.trim()) return;

      const row = make("article", "faq-item");
      const question = make("h3", "faq-question");
      question.appendChild(make("span", "faq-prefix", "Q："));
      question.appendChild(document.createTextNode(entry.question));

      const answer = make("p", "faq-answer");
      answer.appendChild(make("span", "faq-prefix", "A："));
      answer.appendChild(document.createTextNode(entry.answer));
      row.append(question, answer);
      list.appendChild(row);
    });
    if (list.childElementCount) root.appendChild(list);
  }


  /* 页尾：活动名称与署名两栏，内容来自content.js，底部对齐。 */
  function renderFooter() {
    const root = document.getElementById("site-footer");
    const footer = data.footer;
    if (!root || !footer) return;

    const left = make("div", "footer-left");
    left.appendChild(make("p", "footer-theme", footer.theme));
    left.appendChild(make("p", "footer-name", footer.name));
    const english = make("p", "footer-name-en", footer.nameEn);
    english.lang = "en";
    left.appendChild(english);
    left.appendChild(make("p", "footer-date", footer.date));

    const right = make("div", "footer-right");
    (footer.credits || []).forEach(function (credit) {
      right.appendChild(make("p", "footer-credit", credit));
    });

    root.append(left, right);
  }


  /* 整页背景：固定密度、确定性分布；手机端随宽度自然减少方块数量。
   * 网格属于文档，不属于视口；章节高度或窗口尺寸变化时重新铺设。
   */
  function setupBackground() {
    const grid = document.querySelector(".bg-grid");
    if (!grid) return;

    const cellSize = window.innerWidth <= 760 ? 195 : 250; // 手机按面积增密，不固定数量。
    const cells = new Set(); // 已经生成的方块不会因为内容展开/收起而重新创建。
    let pending = false;

    function hash(column, row, salt) {
      let value = Math.imul(column + 17 * salt, 374761393) ^
                  Math.imul(row + 31 * salt, 668265263);
      value = Math.imul(value ^ (value >>> 13), 1274126177);
      return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
    }

    // 使用绝对时间对齐呼吸相位。刷新后同一方块在相近时刻的亮度仍然相近。
    // infinite alternate为往返周期，故相位模数为两倍的动画时长。
    function phaseDelay(durationMs, offsetMs) {
      const elapsed = (Date.now() + offsetMs) % (durationMs * 2);
      return "-" + (elapsed / 1000).toFixed(3) + "s";
    }

    const glow = document.querySelector(".bg-gradient");
    if (glow) {
      glow.style.animationDelay = phaseDelay(11000, 0);
    }
    const orbs = document.querySelectorAll(".bg-orb");
    const orbDurations = [62000, 72000, 83000];
    const orbPhaseOffsets = [0, 16300, 35100];
    orbs.forEach(function (orb, index) {
      const duration = orbDurations[index] || 44000;
      orb.style.animationDelay = phaseDelay(duration, orbPhaseOffsets[index] || 0);
    });

    function extendSquares() {
      pending = false;
      const width = document.documentElement.clientWidth;
      const height = Math.max(document.body.scrollHeight, window.innerHeight);
      const columns = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);
      const fragment = document.createDocumentFragment();

      // 仅添加还不存在的方块。页面高度改变时不会重启之前的动画。
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const key = row + ":" + column;
          if (cells.has(key) || hash(column, row, 1) > .68) continue;

          const x = (column + .16 + hash(column, row, 2) * .68) * cellSize;
          const y = (row + .16 + hash(column, row, 3) * .68) * cellSize;
          if (x >= width - 8 || y >= height - 8) continue;

          const variant = hash(column, row, 7);
          const square = document.createElement("span");
          square.className = variant < .2 ? "bg-square bg-square--teal" :
                             variant < .5 ? "bg-square bg-square--purple" : "bg-square";
          square.style.setProperty("--x", x.toFixed(1) + "px");
          square.style.setProperty("--y", y.toFixed(1) + "px");
          square.style.setProperty("--size", (9 + Math.floor(hash(column, row, 4) * 17)) + "px");

          const durationMs = Math.round((5.2 + hash(column, row, 5) * 3.5) * 1000 / 10) * 10;
          square.style.setProperty("--duration", (durationMs / 1000).toFixed(2) + "s");
          const seedOffsetMs = Math.floor(hash(column, row, 6) * durationMs * 2);
          square.style.setProperty("--delay", phaseDelay(durationMs, seedOffsetMs));

          fragment.appendChild(square);
          cells.add(key);
        }
      }
      if (fragment.childNodes.length) grid.appendChild(fragment);
    }

    function scheduleExtend() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(extendSquares);
    }

    extendSquares();
    window.addEventListener("resize", scheduleExtend, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(scheduleExtend);
      ["app", "site-footer"].forEach(function (id) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
      const header = document.querySelector(".site-header");
      if (header) observer.observe(header);
    }
  }

  /* 内容入场动效：每个区域只展示一次，后续滚动不会再次淡出。
   * 以视口底部约5%作为进入位置；页尾不参与，避免滚动锚定回弹。
   */
  function setupScrollReveal() {
    if (typeof IntersectionObserver === "undefined" ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const selectors = [
      ".page-section-heading",
      ".intro-overview", ".theme-content",
      ".schedule-block-banner", ".timeline-item", ".ongoing-item",
      ".tournament-introduction", ".tournament-common-details",
      ".tournament-group-card", ".tournament-registration",
      ".salon-introduction", ".salon-talk",
      ".submissions-introduction", ".submissions-track-shell",
      ".submissions-milestones", ".submissions-notes", ".submissions-action",
      ".experience-introduction", ".experience-item",
      ".faq-introduction", ".faq-action", ".faq-item"
    ];
    const elements = Array.from(document.querySelectorAll(selectors.join(", ")));
    if (!elements.length) return;

    // 只绘制到最后一个已渐入的主节点；用offsetTop避免被入场位移动画干扰。
    function syncTimelineLines() {
      document.querySelectorAll(".timeline").forEach(function (timeline) {
        const revealed = timeline.querySelectorAll(".timeline-item.is-revealed");
        const last = revealed[revealed.length - 1];
        let length = 0;
        if (last) {
          const marker = last.querySelector(".timeline-marker");
          if (marker) {
            length = Math.max(0, Math.min(timeline.offsetHeight - 10,
              last.offsetTop + marker.offsetTop + marker.offsetHeight / 2 - 10));
          }
        }
        timeline.style.setProperty("--timeline-visible-line", length.toFixed(1) + "px");
      });
    }
    const observer = new IntersectionObserver(function (entries) {
      let lineChanged = false;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
        if (entry.target.classList.contains("timeline-item")) lineChanged = true;
      });
      if (lineChanged) syncTimelineLines();
    }, {
      root: null,
      rootMargin: "0px 0px -5% 0px",
      threshold: 0.04
    });

    elements.forEach(function (element) { element.classList.add("reveal-target"); });
    document.documentElement.classList.add("reveal-enabled");
    elements.forEach(function (element) { observer.observe(element); });
    window.addEventListener("resize", syncTimelineLines, {passive: true});
  }


  /* 首屏文字构图与编码装饰使用普通DOM和CSS。 */

  /* 首屏与正文分界处的双编码条。
   * 手机端优先采用浏览器原生滚动时间轴，以合成器驱动位移，避免JS滚动回调缺帧。
   * 不支持该特性的浏览器及桌面端仍使用逐帧合并的scrollY位移；两端均保持10%滚动倍率。
   */
  function setupHeroEncodingTicker() {
    const root = document.getElementById("hero-encoding-ticker");
    if (!root || !data.hero) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
    const mobileQuery = window.matchMedia?.("(max-width: 760px)");
    const supportsNativeScroll = !reducedMotion && typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: scroll(root block)") &&
      CSS.supports("animation-range: 0% 100%");
    const text = data.hero.streamText || "SPACE / CITRUS RHYTHM GAME FESTIVAL 2026 / ";
    const entries = [];

    ["left", "right"].forEach(function (direction) {
      const row = make("div", "hero-encoding-row hero-encoding-row--" + direction);
      const lane = make("div", "hero-encoding-lane");
      for (let i = 0; i < 2; i++) {
        lane.appendChild(make("span", "hero-encoding-segment", text));
      }
      row.appendChild(lane);
      root.appendChild(row);
      entries.push({lane, textWidth: 1, segmentText: text});
    });

    let measuredWidth = 0;
    let measuredHeight = 0;
    let positionPending = false;
    let measurePending = false;
    let nativeScrollActive = false;

    function setPosition() {
      if (nativeScrollActive) return;
      const move = reducedMotion ? 0 : Math.max(0, window.scrollY || window.pageYOffset || 0) * .1;
      entries.forEach(function (entry, index) {
        const period = entry.textWidth;
        const phase = (period * .19 + move) % period;
        const x = index === 0 ? -phase : -period + phase;
        entry.lane.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      });
    }

    function schedulePosition() {
      if (nativeScrollActive || positionPending) return;
      positionPending = true;
      window.requestAnimationFrame(function () {
        positionPending = false;
        setPosition();
      });
    }

    function measure() {
      const rootWidth = Math.max(1, root.getBoundingClientRect().width);
      const page = document.documentElement;
      const maxScroll = Math.max(0, page.scrollHeight - page.clientHeight);
      const travel = maxScroll * .1;
      const useNative = supportsNativeScroll && !!mobileQuery?.matches;
      measuredWidth = rootWidth;
      measuredHeight = page.scrollHeight;
      nativeScrollActive = useNative;

      entries.forEach(function (entry, index) {
        const segment = entry.lane.firstElementChild;
        if (!segment) return;
        const period = segment.getBoundingClientRect().width;
        if (!(period > 0)) return;
        entry.textWidth = period;

        // 原生时间轴不使用取模，而是一次铺足全文档10%位移所需的重复文本，
        // 这样跨越文本周期时无跳变，也无须在滚动过程中修改DOM。
        const required = useNative
          ? Math.max(3, Math.ceil((rootWidth + travel + period * 2) / period) + 1)
          : Math.max(3, Math.ceil(rootWidth / period) + 2);
        while (entry.lane.children.length < required) {
          entry.lane.appendChild(make("span", "hero-encoding-segment", entry.segmentText));
        }
        while (entry.lane.children.length > required) {
          entry.lane.lastElementChild.remove();
        }

        if (useNative) {
          const phase = period * .19;
          const leadingPeriods = Math.ceil(travel / period) + 1;
          const start = index === 0 ? -phase : -leadingPeriods * period + phase;
          const end = start + (index === 0 ? -travel : travel);
          entry.lane.style.setProperty("--encoding-start", start.toFixed(2) + "px");
          entry.lane.style.setProperty("--encoding-end", end.toFixed(2) + "px");
        }
      });

      root.classList.toggle("is-native-scroll", useNative);
      if (!useNative) setPosition();
    }

    function scheduleMeasure() {
      if (measurePending) return;
      measurePending = true;
      window.requestAnimationFrame(function () {
        measurePending = false;
        measure();
      });
    }

    measure();
    // 完整正文在本函数之后渲染，因此下一帧必须按实际页面高度再测量。
    scheduleMeasure();
    window.addEventListener("scroll", schedulePosition, {passive: true});
    window.addEventListener("resize", function () {
      const width = document.documentElement.clientWidth;
      if (Math.abs(width - measuredWidth) >= 2) scheduleMeasure();
    }, {passive: true});
    window.addEventListener("load", scheduleMeasure, {once: true});
    if (document.fonts?.ready) document.fonts.ready.then(scheduleMeasure);
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(function () {
        const height = document.documentElement.scrollHeight;
        if (nativeScrollActive && Math.abs(height - measuredHeight) >= 2) scheduleMeasure();
      });
      const app = document.getElementById("app");
      const footer = document.getElementById("site-footer");
      if (app) observer.observe(app);
      if (footer) observer.observe(footer);
    }
  }


  function renderHero() {
    const art = document.getElementById("hero-art");
    const root = document.getElementById("hero-content");
    const conf = data.hero;
    if (!art || !root || !conf) return;

    // 两块大灰字叠层共享同一组原序词语，按错位的行阶组成视觉骨架。
    // 真实主信息独立置于上层，叠层文字仅用于视觉陪衬。
    function makeOverlay(extraClass) {
      const overlay = make("div", "hero-word-overlay " + extraClass);
      overlay.setAttribute("aria-hidden", "true");
      (conf.overlayWords || ["Space","Citrus","Rhythm","Game","Festival","2026"])
        .forEach(function (word, index) {
          overlay.appendChild(make("span", "hero-overlay-word hero-overlay-word--" + (index + 1), word));
        });
      return overlay;
    }

    // 小编码作为独立的一层，经后续避障算法放到不遮挡主信息的位置。
    const fragments = make("div", "hero-fragments");
    (conf.codes || []).forEach(function (entry) {
      const fragment = make("div", "hero-fragment");
      fragment.appendChild(make("span", "hero-fragment-label", entry.label));
      fragment.appendChild(make("span", "hero-fragment-text", entry.text));
      fragments.appendChild(fragment);
    });
    art.appendChild(fragments);

    const primary = make("div", "hero-primary");
    primary.appendChild(makeOverlay("hero-primary-overlay"));
    const h1 = make("h1", "hero-title");
    h1.appendChild(make("span", "hero-title-year", conf.year));
    h1.appendChild(make("span", "hero-title-name", conf.festivalName));
    primary.appendChild(h1);
    primary.appendChild(make("p", "hero-date", data.footer.date));

    const secondary = make("div", "hero-secondary");
    secondary.appendChild(makeOverlay("hero-secondary-overlay"));
    const topic = make("h2", "hero-topic");
    const topicInk = make("span", "hero-topic-ink", conf.topicDisplay);
    topic.appendChild(topicInk);
    const venue = make("p", "hero-venue");
    const venueInk = make("span", "hero-venue-ink", program.mainVenue);
    venue.appendChild(venueInk);
    secondary.append(topic, venue);

    // 右上主办单位：数据来自content.js，桌面端一行、手机端分别换行。
    const organizers = make("div", "hero-organizers");
    const names = make("div", "hero-organizers-names");
    (conf.organizers || []).forEach(function (name, index) {
      if (index) names.appendChild(make("span", "hero-organizers-separator", "×"));
      names.appendChild(make("span", "hero-organizer-name", name));
    });
    organizers.appendChild(names);
    organizers.appendChild(make("div", "hero-organizers-label", conf.organizerLabel || "联合主办"));

    // 与CGS同样使用章节锚点；最终占位槽保持静止，只有链接本身上移渐显。
    const scheduleSlot = make("div", "hero-schedule-slot");
    const scheduleLink = make("a", "hero-schedule-link");
    scheduleLink.href = "#schedule";
    scheduleLink.appendChild(make("span", "hero-schedule-label", conf.scheduleLinkLabel || "查看日程"));
    scheduleSlot.appendChild(scheduleLink);
    root.append(primary, organizers, secondary, scheduleSlot);

    /* 鼠标靠近时逐渐照亮编码，代替推开位置的排斥互动。
     * 文字完全不移动，因此不会与主信息块产生新的碰撞。
     */
    const finePointer = window.matchMedia?.("(pointer: fine)")?.matches;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!finePointer || reduced) return;
    const nodes = Array.from(fragments.children);
    let pointer = null;
    let frame = 0;
    function update() {
      frame = 0;
      nodes.forEach(function (node) {
        let intensity = 0;
        if (pointer && node.getClientRects().length) {
          const box = node.getBoundingClientRect();
          const dx = box.left + box.width / 2 - pointer.x;
          const dy = box.top + box.height / 2 - pointer.y;
          const distance = Math.hypot(dx, dy);
          intensity = Math.pow(Math.max(0, 1 - distance / 220), 1.3);
        }
        node.style.opacity = (0.60 + intensity * 0.4).toFixed(3);
        node.style.textShadow = intensity > 0.02 ?
          "0 0 " + (5 + intensity * 12).toFixed(1) + "px rgba(48,227,255," +
          (intensity * .60).toFixed(2) + ")" : "none";
      });
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    root.parentElement.addEventListener("pointermove", function (event) {
      pointer = { x:event.clientX, y:event.clientY };
      schedule();
    }, { passive: true });
    root.parentElement.addEventListener("pointerleave", function () {
      pointer = null;
      schedule();
    });
  }


  /* “空间”与地点按实际字形右边界对齐，而非靠文字盒子或固定px补偿。
   * Canvas文字度量只在初始化、字体就绪、布局尺寸变化后运行。
   * 不监听滚动，不影响主视觉随文档移动的位置。
   */
  function setupHeroTopicInkAlignment() {
    const hero = document.getElementById("hero");
    const topic = hero?.querySelector(".hero-topic-ink");
    const venue = hero?.querySelector(".hero-venue-ink");
    if (!topic || !venue) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let pending = false;

    function visibleRight(node) {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const value = node.textContent || "";
      ctx.font = style.fontStyle + " " + style.fontWeight + " " +
        style.fontSize + " " + style.fontFamily;
      const metrics = ctx.measureText(value);
      if (!Number.isFinite(metrics.actualBoundingBoxRight)) return rect.right;
      const tracking = parseFloat(style.letterSpacing) || 0;
      return rect.left + metrics.actualBoundingBoxRight +
        Math.max(0, Array.from(value).length - 1) * tracking;
    }

    function align() {
      pending = false;
      topic.style.setProperty("--hero-topic-ink-offset", "0px");
      const distance = visibleRight(venue) - visibleRight(topic);
      if (Number.isFinite(distance)) {
        topic.style.setProperty("--hero-topic-ink-offset", distance.toFixed(2) + "px");
      }
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(align);
    }
    schedule();
    window.addEventListener("resize", schedule, {passive: true});
    if (document.fonts?.ready) document.fonts.ready.then(schedule);
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(schedule);
      observer.observe(hero);
      observer.observe(topic);
      observer.observe(venue);
    }
  }


  /* 首屏点阵：随#hero-art自然滚动，鼠标只改变内部方块位置。
   * 手机及减少动态效果时只绘制静态点阵；无需滚动监听与WebGL。
   */
  function setupHeroDotField() {
    const hero = document.getElementById("hero");
    const canvas = document.getElementById("hero-dot-field");
    if (!hero || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 均为CSS像素；可以统一从这里调试点阵外观与排斥手感。
    const settings = {
      spacing: 32, dotSize: 2, color: "rgba(190, 232, 249, 0.40)",
      radius: 240, idlePush: 8, movingPush: 20,
      maxSpeed: 1.5, directionFactor: 0.15,
      spring: 0.05, damping: 0.78, maxDpr: 2
    };
    const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const mobile = window.matchMedia?.("(max-width: 760px)");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const interactive = () => !!fine?.matches && !mobile?.matches && !reduced?.matches;
    let width = 0, height = 0, dpr = 0, cols = 0, rows = 0, baseX = 0, baseY = 0;
    let dots = [], pointer = null, visible = true, frame = 0, lastFrame = 0;
    const active = new Set();

    function paint() {
      if (!visible || document.hidden || !width || !height) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = settings.color;
      const half = settings.dotSize / 2;
      for (const dot of dots) {
        ctx.fillRect(dot.x - half, dot.y - half, settings.dotSize, settings.dotSize);
      }
    }
    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
    }
    function reset() {
      stop();
      pointer = null;
      active.clear();
      for (const dot of dots) {
        dot.x = dot.homeX; dot.y = dot.homeY;
        dot.vx = 0; dot.vy = 0;
      }
      paint();
    }
    function rebuild() {
      const bounds = hero.getBoundingClientRect();
      const w = Math.max(1, Math.round(bounds.width));
      const h = Math.max(1, Math.round(bounds.height));
      const ratio = Math.min(settings.maxDpr, window.devicePixelRatio || 1);
      if (width === w && height === h && dpr === ratio) return;
      stop();
      width = w; height = h; dpr = ratio;
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      cols = Math.max(1, Math.floor(w / settings.spacing));
      rows = Math.max(1, Math.floor(h / settings.spacing));
      baseX = (w - (cols - 1) * settings.spacing) / 2;
      baseY = (h - (rows - 1) * settings.spacing) / 2;
      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = baseX + col * settings.spacing;
          const y = baseY + row * settings.spacing;
          dots.push({homeX: x, homeY: y, x, y, vx: 0, vy: 0});
        }
      }
      pointer = null;
      active.clear();
      paint();
    }
    // 仅把力场覆盖到的行列加入更新集合；离开力场的点回位后会移出。
    function addNearby() {
      if (!pointer) return;
      const r = settings.radius, step = settings.spacing;
      const l = Math.max(0, Math.ceil((pointer.x - r - baseX) / step));
      const rr = Math.min(cols - 1, Math.floor((pointer.x + r - baseX) / step));
      const t = Math.max(0, Math.ceil((pointer.y - r - baseY) / step));
      const b = Math.min(rows - 1, Math.floor((pointer.y + r - baseY) / step));
      for (let row = t; row <= b; row++) for (let col = l; col <= rr; col++) {
        const idx = row * cols + col, dot = dots[idx];
        const dx = dot.homeX - pointer.x, dy = dot.homeY - pointer.y;
        if (dx * dx + dy * dy < r * r) active.add(idx);
      }
    }
    function schedule() {
      if (!frame && visible && !document.hidden && interactive()) {
        frame = requestAnimationFrame(tick);
      }
    }
    function tick(now) {
      frame = 0;
      if (!visible || document.hidden || !interactive()) { reset(); return; }
      const dt = lastFrame ? Math.min(2, Math.max(0.5, (now - lastFrame) / (1000 / 60))) : 1;
      lastFrame = now;
      if (pointer) {
        pointer.speed *= Math.pow(0.8, dt);
        if (pointer.speed < 0.005) pointer.speed = 0;
        addNearby();
      }
      const speed = pointer ? Math.min(1, pointer.speed / settings.maxSpeed) : 0;
      const strength = settings.idlePush + (settings.movingPush - settings.idlePush) * speed;
      const spring = settings.spring * dt, damping = Math.pow(settings.damping, dt);
      let moving = false;
      for (const idx of active) {
        const dot = dots[idx];
        let tx = dot.homeX, ty = dot.homeY;
        if (pointer) {
          const dx = dot.homeX - pointer.x, dy = dot.homeY - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < settings.radius) {
            const u = 1 - distance / settings.radius;
            const weight = u * u * (3 - 2 * u);
            const awayX = distance > 0.001 ? dx / distance : -(pointer.dirX || 1);
            const awayY = distance > 0.001 ? dy / distance : -pointer.dirY;
            tx += awayX * weight * strength +
              pointer.dirX * weight * strength * speed * settings.directionFactor;
            ty += awayY * weight * strength +
              pointer.dirY * weight * strength * speed * settings.directionFactor;
          }
        }
        dot.vx = (dot.vx + (tx - dot.x) * spring) * damping;
        dot.vy = (dot.vy + (ty - dot.y) * spring) * damping;
        dot.x += dot.vx * dt;
        dot.y += dot.vy * dt;
        const settled = Math.abs(tx - dot.x) < 0.04 &&
          Math.abs(ty - dot.y) < 0.04 &&
          Math.abs(dot.vx) < 0.04 && Math.abs(dot.vy) < 0.04;
        if (!settled) moving = true;
        if (settled && tx === dot.homeX && ty === dot.homeY) {
          dot.x = dot.homeX; dot.y = dot.homeY;
          dot.vx = 0; dot.vy = 0;
          active.delete(idx);
        }
      }
      paint();
      if (moving || (pointer && pointer.speed > 0)) schedule();
      else lastFrame = 0; // 静止时完全停止逐帧渲染
    }
    hero.addEventListener("pointermove", function (event) {
      if (!interactive() || !visible || event.pointerType === "touch") return;
      // 此处只读取交互局部坐标，不使用滚动距离修改Canvas的位置。
      const bounds = hero.getBoundingClientRect();
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      const now = performance.now();
      let speed = 0, dirX = 0, dirY = 0;
      if (pointer) {
        const dx = x - pointer.x, dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        speed = Math.min(settings.maxSpeed * 1.5, distance / Math.max(8, now - pointer.time));
        dirX = distance > 0.01 ? dx / distance : pointer.dirX;
        dirY = distance > 0.01 ? dy / distance : pointer.dirY;
      }
      pointer = {x, y, time: now, speed, dirX, dirY};
      addNearby();
      schedule();
    }, {passive: true});
    hero.addEventListener("pointerleave", function () {
      if (pointer) { pointer = null; schedule(); }
    });
    hero.addEventListener("pointercancel", function () {
      if (pointer) { pointer = null; schedule(); }
    });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(rebuild).observe(hero);
    }
    window.addEventListener("resize", rebuild, {passive: true});
    if (typeof IntersectionObserver !== "undefined") {
      new IntersectionObserver(function (entries) {
        const inView = entries[0]?.isIntersecting ?? true;
        if (visible === inView) return;
        visible = inView;
        if (inView) paint();
        else reset();
      }, {threshold: 0}).observe(hero);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) reset();
      else paint();
    });
    [fine, mobile, reduced].forEach(query => query?.addEventListener?.("change", reset));
    rebuild();
  }


  /* 小编码避开四组主信息及两组灰字叠层的实际字形盒子。
   * 优先保留设计时指定的大致位置；对实际DOM边界做检测，避免遮挡正文。
   * 布局仅在首屏/字体/窗口尺寸变化后更新，不响应其他章节的高度变化。
   */
  function setupHeroFragmentLayout() {
    const hero = document.getElementById("hero");
    const group = hero?.querySelector(".hero-fragments");
    const primary = hero?.querySelector(".hero-primary");
    const secondary = hero?.querySelector(".hero-secondary");
    const organizers = hero?.querySelector(".hero-organizers");
    const scheduleSlot = hero?.querySelector(".hero-schedule-slot");
    if (!hero || !group || !primary || !secondary || !organizers || !scheduleSlot) return;

    const nodes = Array.from(group.children);
    let pending = false;

    function overlaps(a, b, gap) {
      return a.left < b.right + gap && a.right > b.left - gap &&
             a.top < b.bottom + gap && a.bottom > b.top - gap;
    }
    function layout() {
      pending = false;
      const heroBox = hero.getBoundingClientRect();
      const width = heroBox.width;
      const height = heroBox.height;
      if (width <= 0 || height <= 0) return;

      // 全部编码均尝试参与布局；仅在确实没有安全位置时隐藏。
      const visibleCount = width <= 760 ? Math.min(5, nodes.length) : nodes.length;
      // 灰色文字允许溢出大信息块容器，必须逐字检测真实位置。
      // 只保护文字本身而非整片叠层容器，保留更多可用的编码区域。
      const overlayWords = hero.querySelectorAll(
        ".hero-primary-overlay .hero-overlay-word, .hero-secondary-overlay .hero-overlay-word"
      );
      const protectedAreas = [primary, secondary, organizers, scheduleSlot, ...overlayWords].map(function (node) {
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left - heroBox.left, top: rect.top - heroBox.top,
          right: rect.right - heroBox.left, bottom: rect.bottom - heroBox.top
        };
      });
      const used = [];
      const edge = width <= 760 ? 9 : 20;
      const clearance = width <= 760 ? 14 : 26;

      // 恢复初始CSS锚点以获取每个编码的偏好位置。
      group.classList.remove("is-arranged");
      nodes.forEach(function (node) {
        node.classList.remove("hero-fragment--unplaced");
        node.style.removeProperty("left");
        node.style.removeProperty("top");
        // 新互动仅改变亮度，编码位置完全由避障结果控制。
      });

      nodes.forEach(function (node, index) {
        if (index >= visibleCount) {
          node.classList.add("hero-fragment--unplaced");
          return;
        }
        const style = window.getComputedStyle(node);
        if (style.display === "none") return;

        const rect = node.getBoundingClientRect();
        const itemWidth = rect.width;
        const itemHeight = rect.height;
        const preferredX = rect.left - heroBox.left;
        const preferredY = rect.top - heroBox.top;
        if (!itemWidth || !itemHeight || itemWidth > width - 2 * edge ||
            itemHeight > height - 2 * edge) {
          node.classList.add("hero-fragment--unplaced");
          return;
        }

        let best = null;
        let bestScore = Infinity;
        function tryCandidate(x, y) {
          x = Math.round(x);
          y = Math.round(y);
          if (x < edge || y < edge || x + itemWidth > width - edge ||
              y + itemHeight > height - edge) return;
          const box = {left:x, top:y, right:x+itemWidth, bottom:y+itemHeight};
          if (protectedAreas.some(area => overlaps(box, area, clearance))) return;
          if (used.some(area => overlaps(box, area, width <= 760 ? 7 : 11))) return;
          // 主视觉中心留出未来视觉效果带的空间，排布优先靠近侧边。
          const centerX = x + itemWidth / 2;
          const centerY = y + itemHeight / 2;
          const central = centerX > width * .24 && centerX < width * .76 &&
                          centerY > height * .39 && centerY < height * .62;
          const dx = x - preferredX, dy = y - preferredY;
          const score = dx * dx + dy * dy + (central ? (width <= 760 ? 5500 : 18000) : 0);
          if (score < bestScore) { bestScore = score; best = box; }
        }
        tryCandidate(preferredX, preferredY);

        // 环状采样先寻找周边空隙，只有空间不足时才考虑页面其他区域。
        for (let radius = 28; radius <= Math.max(width,height) && bestScore > 600; radius += 28) {
          for (let step = 0; step < 20; step++) {
            const angle = step * Math.PI / 10;
            tryCandidate(preferredX + Math.cos(angle) * radius,
                         preferredY + Math.sin(angle) * radius);
          }
          if (bestScore < radius * radius * 1.1) break;
        }
        if (!best) {
          for (let y = edge; y < height - itemHeight - edge; y += 24)
            for (let x = edge; x < width - itemWidth - edge; x += 24)
              tryCandidate(x,y);
        }
        if (!best) {
          node.classList.add("hero-fragment--unplaced");
          return;
        }
        node.style.left = best.left + "px";
        node.style.top = best.top + "px";
        used.push(best);
      });

      group.classList.add("is-arranged");
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(layout);
    }
    schedule();
    window.addEventListener("resize", schedule, {passive:true});
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(schedule);
      [hero, primary, secondary, organizers, scheduleSlot,
        ...hero.querySelectorAll(".hero-primary-overlay, .hero-secondary-overlay")].forEach(
          node => observer.observe(node)
        );
    }
    if (document.fonts?.ready) document.fonts.ready.then(schedule);
  }



  /* 初次加载时确定首屏高度，之后浏览器工具栏的伸缩不会改动主视觉。
   * 只有横竖屏切换或实际窗口宽度变化才重新计算。
   */
  function setupInitialHeroHeight() {
    const header = document.querySelector(".site-header");
    const hero = document.getElementById("hero");
    if (!header || !hero) return;
    let viewportWidth = document.documentElement.clientWidth;
    function measure() {
      const headerHeight = Math.ceil(header.getBoundingClientRect().height);
      const height = Math.max(1, Math.ceil(window.innerHeight - headerHeight) + 1);
      document.documentElement.style.setProperty("--hero-initial-height", height + "px");
    }
    measure();
    window.addEventListener("resize", function () {
      const width = document.documentElement.clientWidth;
      if (Math.abs(width - viewportWidth) < 2) return;
      viewportWidth = width;
      measure();
    }, { passive: true });
  }

  /* 页首在窄屏上可能换行，实时测量高度，防止锚点标题被遮挡。 */
  function setupStickyHeaderOffset() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const updateOffset = function () {
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-height", height + "px");
    };

    updateOffset();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateOffset);
      observer.observe(header);
    } else {
      window.addEventListener("resize", updateOffset);
    }
  }

  renderHeader();
  setupMobileNavigation();
  setupStickyHeaderOffset();
  setupInitialHeroHeight();
  renderHero();
  setupHeroTopicInkAlignment();
  setupHeroDotField();
  setupHeroFragmentLayout();
  setupHeroEncodingTicker();
  renderHeadings();
  renderIntro();
  renderSchedule();
  renderTournament();
  renderSalon();
  renderSubmissions();
  renderExperience();
  renderFaq();
  renderFooter();
  setupBackground();
  setupScrollReveal();
}());
