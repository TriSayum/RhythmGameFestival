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
    brand.append(
      make("span", "site-brand-cn", data.site.name),
      make("span", "site-brand-en", data.site.nameEn)
    );
    brand.lastElementChild.lang = "en";
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
    const heading = make("h3", "theme-heading", theme.displayName || theme.name);
    heading.id = "theme-heading";
    const en = make("span", "", "/" + theme.nameEn);
    en.lang = "en";
    heading.appendChild(en);
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



  /* 03赛事：两组数据化卡片、独立赛制折叠和独立报名入口。 */
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
    addTextBlock(content.details.heading, content.details.paragraphs, "tournament-common-details");

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
    regBlock.appendChild(make("h3", "tournament-block-heading", registration.heading));

    // 报名条件和注意事项统一在一段正文中说明，不再设置二级小标题。
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
      if (talk.title) {
        subject.appendChild(make("h4", "salon-talk-title", talk.title));
      }
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
      const list = make("ol", "submissions-milestones");
      config.milestones.forEach(function (item) {
        const milestone = make("li", "submissions-milestone");
        const heading = make("div", "submissions-milestone-heading");
        heading.appendChild(make("span", "submissions-milestone-cn", item.label));
        milestone.append(heading, make("div", "submissions-milestone-date", item.date));
        list.appendChild(milestone);
      });
      root.appendChild(list);
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
      if (game && item.summary) textBlock.appendChild(make("p", "experience-item-summary", item.summary));
      if (item.description) textBlock.appendChild(make("p", "experience-item-description", item.description));
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

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: "0px 0px -5% 0px",
      threshold: 0.04
    });

    elements.forEach(function (element) { element.classList.add("reveal-target"); });
    document.documentElement.classList.add("reveal-enabled");
    elements.forEach(function (element) { observer.observe(element); });
  }


  /* 首屏：文字构图与编码装饰均使用普通DOM和CSS，便于继续调整。
   * 主视觉保留中间区域，等待后续单独设计的视觉效果带。
   */

  /* 中央空间波带：沿横贯首屏的曲线绘制细线，不再以两块信息为连接终点。
   * 横向曲线由若干归一化控制点决定；手机使用较浅的波形，保持中间留白。
   * 仅在首屏可见时刷新SVG路径，并在减少动态效果时停留在静态画面。
   */

  /* 中央空间波带：
   * 保留原有平滑的起伏轨迹，右侧逐渐加入空间扰动。
   * 只在真正变更尺寸时缓存基础采样；每帧只更新SVG纵坐标。
   * 不影响独立的双编码条与主视觉信息块。
   */
  /* 波带使用WebGL顶点着色器独立形变；静态采样坐标只在尺寸改变时上传。
   * 每帧只更新动画时间并发起两个绘制调用，不再重建SVG path。
   * 若WebGL不可用则回退至原有SVG实现，避免导致整段主视觉消失。
   */
  function createHeroWave(art, conf) {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
    const canvas = document.createElement("canvas");
    canvas.className = "hero-wave-gpu";
    canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl", {
      alpha: true, premultipliedAlpha: false, antialias: false,
      depth: false, stencil: false, preserveDrawingBuffer: false,
      powerPreference: "high-performance"
    });
    if (!gl) {
      createHeroWaveSvgFallback(art, conf);
      return;
    }

    const vertexSource = `
      attribute vec4 a_point;
      uniform vec2 u_size;
      uniform float u_time;
      uniform float u_halfSpan;
      uniform float u_stroke;
      uniform float u_mobile;
      varying float v_x;
      varying float v_strand;
      void main() {
        float x = a_point.x;
        float base = a_point.y;
        float strand = a_point.z;
        float edge = a_point.w;
        float t = u_time;
        float mobile = u_mobile;
        // 和“修正双编码条”历史版一样：每条线的相位由原始序号决定。
        float index = (strand + 1.0) * 0.5 * mix(23.0, 13.0, mobile);
        float moving = sin(x * 5.4 + t * 0.52) * mix(10.0, 6.0, mobile);
        float folding = sin(x * 10.5 - t * 0.45 + index * 0.21)
          * strand * mix(24.0, 11.0, mobile);
        float ripple = sin(x * 19.0 + t * 0.9 + index * 0.14)
          * abs(strand) * mix(6.0, 3.5, mobile);
        // 唯一的右侧附加效果：将已有线间位移逐渐放大，不增加新波纹。
        float widening = smoothstep(0.38, 0.98, x);
        float fan = mix(1.0, mix(2.15, 1.65, mobile), widening);
        float yPx = base * u_size.y + moving
          + (strand * u_halfSpan + folding + ripple) * fan;
        yPx += edge * u_stroke * 0.5;
        gl_Position = vec4(x * 2.0 - 1.0, 1.0 - 2.0 * yPx / u_size.y, 0.0, 1.0);
        v_x = x;
        v_strand = abs(strand);
      }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform float u_opacity;
      varying float v_x;
      varying float v_strand;
      void main() {
        vec3 cyan = vec3(0.31, 0.96, 0.93);
        vec3 blue = vec3(0.52, 0.68, 0.99);
        vec3 violet = vec3(0.78, 0.44, 0.94);
        vec3 pink = vec3(0.98, 0.41, 0.76);
        vec3 color = mix(cyan, blue, smoothstep(0.08, 0.50, v_x));
        color = mix(color, violet, smoothstep(0.39, 0.75, v_x));
        color = mix(color, pink, smoothstep(0.71, 1.0, v_x));
        color = mix(color, vec3(1.0), 0.13);
        float alpha = u_opacity * (0.86 + 0.14 * (1.0 - v_strand));
        gl_FragColor = vec4(color, alpha);
      }
    `;

    let program = null, vertexBuffer = null, refs = null, vertexCount = 0;
    let width = 0, height = 0, resolutionScale = 1;
    let visible = true, frameId = 0, lastFrame = 0, phase = 0;
    let lost = false;

    function compile(type, sourceText) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, sourceText);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(log || "WebGL着色器编译失败");
      }
      return shader;
    }
    function initializeGL() {
      const vs = compile(gl.VERTEX_SHADER, vertexSource);
      const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(p);
        gl.deleteProgram(p);
        throw new Error(log || "WebGL程序链接失败");
      }
      program = p;
      vertexBuffer = gl.createBuffer();
      refs = {
        point: gl.getAttribLocation(p, "a_point"),
        size: gl.getUniformLocation(p, "u_size"),
        time: gl.getUniformLocation(p, "u_time"),
        halfSpan: gl.getUniformLocation(p, "u_halfSpan"),
        stroke: gl.getUniformLocation(p, "u_stroke"),
        mobile: gl.getUniformLocation(p, "u_mobile"),
        opacity: gl.getUniformLocation(p, "u_opacity")
      };
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.enableVertexAttribArray(refs.point);
      gl.vertexAttribPointer(refs.point, 4, gl.FLOAT, false, 16, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    }
    function baseCurve(u, mobile) {
      // 与原版中心轨迹相同的控制点，不重新设计整体走势。
      const anchors = mobile ?
        [[-.08,.49],[.11,.53],[.28,.55],[.42,.52],[.64,.44],[.82,.44],[1.07,.51]] :
        [[-.08,.47],[.08,.51],[.21,.56],[.34,.54],[.58,.41],[.72,.31],[.84,.32],[1.07,.46]];
      let i = 0;
      while (i < anchors.length - 2 && u > anchors[i+1][0]) i++;
      const a=anchors[i], b=anchors[i+1];
      const prev=anchors[Math.max(0,i-1)], next=anchors[Math.min(anchors.length-1,i+2)];
      const d=b[0]-a[0], t=Math.max(0,Math.min(1,(u-a[0])/d)), t2=t*t, t3=t2*t;
      const da=(b[1]-prev[1])/(b[0]-prev[0])*d;
      const db=(next[1]-a[1])/(next[0]-a[0])*d;
      return (2*t3-3*t2+1)*a[1] + (t3-2*t2+t)*da
        + (-2*t3+3*t2)*b[1] + (t3-t2)*db;
    }
    function rebuild() {
      const bounds = hero.getBoundingClientRect();
      const w=Math.max(1,Math.round(bounds.width)), h=Math.max(1,Math.round(bounds.height));
      const scale=Math.min(1.5, window.devicePixelRatio || 1);
      if (w===width && h===height && scale===resolutionScale) return false;
      width=w; height=h; resolutionScale=scale;
      const mobile=w<=760;
      // 限制像素填充成本；在高刷屏幕上优先保证动画流畅。
      canvas.width=Math.round(w*scale);
      canvas.height=Math.round(h*scale);
      gl.viewport(0,0,canvas.width,canvas.height);
      const strands=mobile?14:24, step=mobile?15:20;
      const segments=Math.max(2,Math.ceil(w/step)), half=(strands-1)/2;
      const stops=new Array(segments+1);
      for(let i=0;i<=segments;i++) {
        const u=i/segments;
        stops[i]=[u,baseCurve(u,mobile)];
      }
      const buffer = new Float32Array(strands*segments*6*4);
      let k=0;
      function vertex(sample,weight,edge) {
        buffer[k++]=sample[0];
        buffer[k++]=sample[1];
        buffer[k++]=weight;
        buffer[k++]=edge;
      }
      for (let j=0;j<strands;j++) {
        const v=(j-half)/half;
        for(let i=0;i<segments;i++) {
          const a=stops[i],b=stops[i+1];
          vertex(a,v,-1);vertex(a,v,1);vertex(b,v,-1);
          vertex(a,v,1);vertex(b,v,1);vertex(b,v,-1);
        }
      }
      vertexCount=buffer.length/4;
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
      gl.useProgram(program);
      gl.uniform2f(refs.size,w,h);
      gl.uniform1f(refs.mobile,mobile?1:0);
      gl.uniform1f(refs.halfSpan,half*(mobile?1.65:2.7));
      return true;
    }
    function render() {
      if (lost || !program || !vertexCount) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(refs.point, 4, gl.FLOAT, false, 16, 0);
      gl.uniform1f(refs.time, phase);
      // GPU绘制两次：低透明度外晕＋细线主层。每帧无DOM路径重建。
      gl.uniform1f(refs.stroke, 6.0);
      gl.uniform1f(refs.opacity, .16);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
      gl.uniform1f(refs.stroke, 1.45);
      gl.uniform1f(refs.opacity, .92);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }
    function stop() {
      if(frameId) window.cancelAnimationFrame(frameId);
      frameId=0;
      lastFrame=0;
    }
    function schedule() {
      if (!reduced && !lost && visible && !document.hidden && !frameId) {
        frameId=window.requestAnimationFrame(tick);
      }
    }
    function tick(now) {
      frameId=0;
      if (lost || reduced || !visible || document.hidden) {lastFrame=0;return;}
      // 不限帧：屏幕支持240Hz时允许跟随刷新；暂停后不补算时间。
      if (lastFrame) phase+=Math.min(.04,Math.max(0,(now-lastFrame)/1000));
      lastFrame=now;
      render();
      schedule();
    }
    function resized() {
      if (lost) return;
      if (rebuild()) render();
    }

    canvas.addEventListener("webglcontextlost",function (e) {
      e.preventDefault();
      lost=true;
      stop();
    });
    canvas.addEventListener("webglcontextrestored",function () {
      try {
        lost=false;
        initializeGL();
        width=0;height=0;
        rebuild();render();schedule();
      } catch (err) {
        console.warn("CRGF波带WebGL恢复失败",err);
        lost=true;
      }
    });

    try {
      initializeGL();
      art.appendChild(canvas);
      rebuild();
      render();
    } catch (err) {
      console.warn("CRGF波带WebGL初始化失败，回退SVG",err);
      if (canvas.parentNode) canvas.remove();
      createHeroWaveSvgFallback(art,conf);
      return;
    }
    if(typeof IntersectionObserver!=="undefined" && !reduced) {
      const observer=new IntersectionObserver(function(entries){
        visible=entries[0]?.isIntersecting??true;
        if (visible) schedule();
        else stop();
      },{threshold:0});
      observer.observe(hero);
    }
    document.addEventListener("visibilitychange",function(){
      if(document.hidden) stop();
      else schedule();
    });
    window.addEventListener("resize",resized,{passive:true});
    if(typeof ResizeObserver!=="undefined") {
      new ResizeObserver(resized).observe(hero);
    }
    schedule();
  }

  function createHeroWaveSvgFallback(art, conf) {
    const NS = "http://www.w3.org/2000/svg";
    const hero = document.getElementById("hero");
    if (!hero) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;

    /* WebGL不可用时也使用历史版波纹与右侧倍率发散。 */
    const profile = {
      desktop: {count:24, step:22, spread:2.7, moving:10, folding:24, ripple:6, fan:2.15},
      mobile: {count:14, step:16, spread:1.65, moving:6, folding:11, ripple:3.5, fan:1.65}
    };
    const targetFrameMs = 1000 / 60;
    const maxPhaseStep = .040;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "hero-wave-ribbon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("preserveAspectRatio", "none");

    function element(tag, attributes, parent) {
      const result = document.createElementNS(NS, tag);
      Object.entries(attributes || {}).forEach(function (pair) {
        result.setAttribute(pair[0], pair[1]);
      });
      if (parent) parent.appendChild(result);
      return result;
    }

    const defs = element("defs", {}, svg);
    const gradient = element("linearGradient", {
      id: "crgf-wave-ribbon-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%"
    }, defs);
    [
      ["0%", "#56f8ef"], ["23%", "#8be9ff"], ["47%", "#859cfc"],
      ["69%", "#c478ef"], ["86%", "#f57edc"], ["100%", "#ff65b9"]
    ].forEach(function (stop) {
      element("stop", {"offset": stop[0], "stop-color": stop[1]}, gradient);
    });
    const glow = element("path", {"class":"hero-wave-ribbon-glow"}, svg);
    const lines = element("g", {"class":"hero-wave-ribbon-lines"}, svg);
    const paths = [];
    const samples = [];

    let width = 0, height = 0, config = profile.desktop;
    let visible = true, frameId = 0, lastDrawAt = 0, phase = 0;

    function smoothstep(a, b, value) {
      const p = Math.max(0, Math.min(1, (value - a) / (b - a)));
      return p * p * (3 - 2 * p);
    }

    function centerY(u, points) {
      let i=0;
      while (i < points.length - 2 && u > points[i+1].x) i++;
      const a=points[i], b=points[i+1];
      const d=b.x-a.x, v=Math.max(0,Math.min(1,(u-a.x)/d));
      const prev=points[Math.max(0,i-1)], next=points[Math.min(points.length-1,i+2)];
      const slopeA=(b.y-prev.y)/(b.x-prev.x)*d;
      const slopeB=(next.y-a.y)/(next.x-a.x)*d;
      const v2=v*v, v3=v2*v;
      return (2*v3-3*v2+1)*a.y + (v3-2*v2+v)*slopeA
        + (-2*v3+3*v2)*b.y + (v3-v2)*slopeB;
    }

    function prepareSize() {
      const bounds = hero.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(bounds.width));
      const nextHeight = Math.max(1, Math.round(bounds.height));
      if (nextWidth === width && nextHeight === height) return false;
      width = nextWidth;
      height = nextHeight;
      const mobile = width <= 760;
      config = mobile ? profile.mobile : profile.desktop;
      svg.setAttribute("viewBox", "0 0 " + width + " " + height);
      const anchors = mobile ?
        [[-.08,.49],[.11,.53],[.28,.55],[.42,.52],[.64,.44],[.82,.44],[1.07,.51]] :
        [[-.08,.47],[.08,.51],[.21,.56],[.34,.54],[.58,.41],[.72,.31],[.84,.32],[1.07,.46]];
      const points=anchors.map(function (point) {
        return {x:point[0], y:point[1]*height};
      });

      // 预存每个采样点的横坐标字符串、基础曲线及右侧扰动权重。
      // 注意最后一点恰好到达右边界，不再在屏幕外做冗余计算。
      samples.length = 0;
      const sampleCount = Math.max(2, Math.ceil(width / config.step));
      for (let j=0;j<=sampleCount;j++) {
        const x=j*width/sampleCount;
        const u=j/sampleCount;
        samples.push({
          xText:x.toFixed(1),
          baseline:centerY(u,points),
          gain:smoothstep(.38,.98,u),
          commonPhase:u*5.4,
          foldPhase:u*10.5,
          ripplePhase:u*19.0
        });
      }

      while (paths.length < config.count) {
        const line = element("path", {"class":"hero-wave-ribbon-strand"}, lines);
        paths.push(line);
      }
      const mid=(config.count-1)/2;
      paths.forEach(function (line,index) {
        line.style.display = index < config.count ? "" : "none";
        if (index < config.count) {
          line.setAttribute("opacity",
            (.50+.45*(1-Math.abs(index-mid)/mid)).toFixed(3));
        }
      });
      return true;
    }

    // 恢复各条线不同相位的波纹；仅放大右侧的线间相对位移。
    function draw(time) {
      const moving=new Float32Array(samples.length);
      for(let j=0;j<samples.length;j++) {
        const s=samples[j];
        moving[j]=s.baseline+Math.sin(s.commonPhase+time*.52)*config.moving;
      }
      const mid=(config.count-1)/2;
      function curve(index) {
        const weight=(index-mid)/mid;
        const offset=(index-mid)*config.spread;
        const parts=new Array(samples.length);
        for(let j=0;j<samples.length;j++) {
          const s=samples[j];
          const folding=Math.sin(s.foldPhase-time*.45+index*.21)*weight*config.folding;
          const ripple=Math.sin(s.ripplePhase+time*.9+index*.14)*Math.abs(weight)*config.ripple;
          const fan=1+s.gain*(config.fan-1);
          const y=moving[j]+(offset+folding+ripple)*fan;
          parts[j]=(j===0?"M":"L")+s.xText+","+y.toFixed(1);
        }
        return parts.join(" ");
      }
      glow.setAttribute("d",curve(mid));
      for(let i=0;i<config.count;i++) paths[i].setAttribute("d",curve(i));
    }

    function stop() {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId=0;
      // 恢复时以当前相位继续，避免用真实时间补偿后台经历的时间。
      lastDrawAt=0;
    }
    function schedule() {
      if (!reduced && visible && !document.hidden && !frameId) {
        frameId=window.requestAnimationFrame(onFrame);
      }
    }
    function onFrame(now) {
      frameId=0;
      if (reduced || !visible || document.hidden) {
        lastDrawAt=0;
        return;
      }
      // 60fps上限：高刷新率屏幕不会无意义地重复生成曲线。
      if (!lastDrawAt || now-lastDrawAt >= targetFrameMs-.8) {
        const step = lastDrawAt ? Math.min(maxPhaseStep,Math.max(0,(now-lastDrawAt)/1000)) : 0;
        phase += step;
        lastDrawAt=now;
        draw(phase);
      }
      schedule();
    }

    art.appendChild(svg);
    prepareSize();
    draw(phase);
    if (typeof IntersectionObserver !== "undefined" && !reduced) {
      const observer=new IntersectionObserver(function (entries) {
        visible=entries[0]?.isIntersecting ?? true;
        if (!visible) stop();
        else schedule();
      }, {threshold:0});
      observer.observe(hero);
    }
    document.addEventListener("visibilitychange",function () {
      if (document.hidden) stop();
      else schedule();
    });
    // 尺寸检查不再发生在每次绘制中，仅在布局真正改变时执行。
    function onResize() {
      if (prepareSize()) draw(phase);
    }
    window.addEventListener("resize",onResize,{passive:true});
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(onResize);
      observer.observe(hero);
    }
    schedule();
  }

  /* 首屏与正文分界处的透明双编码条。
   * 尺寸仅在初始载入、字体就绪、屏幕宽度变化时测量。
   * 滚动帧只读取scrollY并更新两个transform，没有缓动及布局读取。
   */
  function setupHeroEncodingTicker() {
    const root = document.getElementById("hero-encoding-ticker");
    if (!root || !data.hero) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
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
    let positionPending = false;

    function setPosition() {
      const move = reducedMotion ? 0 : Math.max(0, window.scrollY || window.pageYOffset || 0) * .1;
      entries.forEach(function (entry, index) {
        const period = entry.textWidth;
        const phase = (period * .19 + move) % period;
        const x = index === 0 ? -phase : -period + phase;
        entry.lane.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      });
    }

    function schedulePosition() {
      if (positionPending) return;
      positionPending = true;
      window.requestAnimationFrame(function () {
        positionPending = false;
        setPosition();
      });
    }

    function measure() {
      const rootWidth = Math.max(1, root.getBoundingClientRect().width);
      measuredWidth = rootWidth;
      entries.forEach(function (entry) {
        const segment = entry.lane.firstElementChild;
        if (!segment) return;
        const width = segment.getBoundingClientRect().width;
        if (!(width > 0)) return;
        entry.textWidth = width;
        const required = Math.max(3, Math.ceil(rootWidth / width) + 2);
        while (entry.lane.children.length < required) {
          entry.lane.appendChild(make("span", "hero-encoding-segment", entry.segmentText));
        }
        while (entry.lane.children.length > required) {
          entry.lane.lastElementChild.remove();
        }
      });
      setPosition();
    }

    measure();
    window.addEventListener("scroll", schedulePosition, {passive: true});
    window.addEventListener("resize", function () {
      const width = document.documentElement.clientWidth;
      if (Math.abs(width - measuredWidth) < 2) return;
      measure();
    }, {passive: true});
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
  }


  function renderHero() {
    const art = document.getElementById("hero-art");
    const root = document.getElementById("hero-content");
    const conf = data.hero;
    if (!art || !root || !conf) return;
    createHeroWave(art, conf);

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
    secondary.appendChild(make("h2", "hero-topic", conf.topicDisplay));
    secondary.appendChild(make("p", "hero-venue", program.mainVenue));
    root.append(primary, secondary);

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


  /* 编码组件在渲染结束后自动避让两块主信息。
   * 优先保留设计时指定的大致位置；对实际DOM边界做检测，避免遮挡正文。
   * 布局仅在首屏/字体/窗口尺寸变化后更新，不响应其他章节的高度变化。
   */
  function setupHeroFragmentLayout() {
    const hero = document.getElementById("hero");
    const group = hero?.querySelector(".hero-fragments");
    const primary = hero?.querySelector(".hero-primary");
    const secondary = hero?.querySelector(".hero-secondary");
    if (!hero || !group || !primary || !secondary) return;

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
      const visibleCount = nodes.length;
      const protectedAreas = [primary, secondary].map(function (node) {
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
        if (index >= visibleCount) return;
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
      [hero, primary, secondary].forEach(node => observer.observe(node));
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
