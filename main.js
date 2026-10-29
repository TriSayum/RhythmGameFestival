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
        subject.appendChild(make("h4", "salon-talk-title", "《" + talk.title + "》"));
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
}());
