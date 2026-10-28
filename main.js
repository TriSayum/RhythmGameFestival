/* 页面渲染逻辑；文字与节目数据请在content.js中修改。 */
(function () {
  "use strict";

  const data = window.FESTIVAL_CONTENT;
  if (!data) {
    console.error("content.js未加载，无法显示网站内容。");
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
    if (item.speaker) detail.appendChild(make("span", "timeline-speaker", item.speaker));
    if (item.title) {
      const label = item.speaker ? "《" + item.title + "》" : item.title;
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

  function renderSchedule() {
    const root = document.getElementById("schedule-content");
    const mainBlock = make("div", "schedule-block");
    mainBlock.appendChild(make("h3", "schedule-block-heading", data.schedule.mainTitle));
    const timeline = make("ol", "timeline");
    data.schedule.main.forEach(function (item) {
      timeline.appendChild(renderEvent(item));
    });
    mainBlock.appendChild(timeline);
    root.appendChild(mainBlock);

    const ongoingBlock = make("div", "schedule-block");
    ongoingBlock.appendChild(make("h3", "schedule-block-heading", data.schedule.ongoingTitle));
    const list = make("ul", "ongoing-list");
    data.schedule.ongoing.forEach(function (item) {
      list.appendChild(renderOngoing(item));
    });
    ongoingBlock.appendChild(list);
    root.appendChild(ongoingBlock);
  }



  /* 03赛事：无正文时保持空白，有效问卷链接启用后才提供外部跳转。 */
  function renderTournament() {
    const content = data.tournament;
    const root = document.getElementById("tournament-content");
    if (!content || !root) return;

    const intro = make("div", "tournament-block");
    intro.appendChild(make("h3", "tournament-block-heading", content.introduction.heading));
    const introBody = make("div", "tournament-block-body");
    addParagraphs(introBody, content.introduction.paragraphs);
    intro.appendChild(introBody);
    root.appendChild(intro);

    const registration = content.registration;
    const regBlock = make("div", "tournament-block");
    regBlock.appendChild(make("h3", "tournament-block-heading", registration.heading));
    const regBody = make("div", "tournament-block-body");
    if (registration.description) {
      regBody.appendChild(make("p", "", registration.description));
    }

    let destination = "";
    if (registration.enabled && typeof registration.url === "string") {
      try {
        const url = new URL(registration.url);
        if (url.protocol === "https:" || url.protocol === "http:") {
          destination = url.href;
        }
      } catch (_) {
        // 无效或未填写的URL不生成链接。
      }
    }

    if (destination) {
      const link = make("a", "tournament-registration-link", registration.label);
      link.href = destination;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      regBody.appendChild(link);
    } else {
      const closed = make("span", "tournament-registration-link is-disabled", registration.unavailableLabel);
      closed.setAttribute("aria-disabled", "true");
      regBody.appendChild(closed);
    }
    regBlock.appendChild(regBody);
    root.appendChild(regBlock);

    const details = make("div", "tournament-block");
    details.appendChild(make("h3", "tournament-block-heading", content.details.heading));
    const detailBody = make("div", "tournament-block-body");
    addParagraphs(detailBody, content.details.paragraphs);
    details.appendChild(detailBody);
    root.appendChild(details);
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
}());
