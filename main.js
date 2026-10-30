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
    const heading = make("h3", "theme-heading", theme.name);
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
    row.append(hours, make("h4", "ongoing-title", item.title));
    return row;
  }

  /* 02日程：日期、地点与大标题统一显示在紧凑的深色横贯条内。 */
  function addScheduleBlockHeader(block, heading, meta) {
    const banner = make("div", "schedule-block-banner");
    if (meta && (meta.date || meta.venue)) {
      const note = make("div", "schedule-block-meta");
      if (meta.date) note.appendChild(make("span", "schedule-block-date", meta.date));
      if (meta.venue) note.appendChild(make("span", "schedule-block-venue", meta.venue));
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
      venueEntry.appendChild(make("dd", "tournament-group-meta-value", group.venue || group.venuePending || ""));
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
        const link = make("a", "tournament-registration-link", group.label + " ↗");
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

    const heading = make("h3", "salon-list-heading", "分享安排");
    root.appendChild(heading);

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
      if (salon.info?.venue) {
        metadata.appendChild(make("span", "salon-talk-venue", salon.info.venue));
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
        const link = make("a", "submissions-submit-link", label);
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
  setupStickyHeaderOffset();
  renderHeadings();
  renderIntro();
  renderSchedule();
  renderTournament();
  renderSalon();
  renderSubmissions();
  renderExperience();
}());
