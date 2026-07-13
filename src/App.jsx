import { useEffect, useState } from "react";

const assetBase = import.meta.env.BASE_URL;
const media = (name) => `${assetBase}media/${name}`;
const downloadUrl = `${assetBase}downloads/ZangzhiStudio-Setup-1.0.10.exe`;

const workflow = [
  ["01", "在软件里打开抖音", "使用同一个内置浏览器完成登录、浏览收藏夹和打开视频。采集、下载等命令直接作用于当前页面，不需要在多个窗口之间复制链接。"],
  ["02", "归档当前视频", "识别当前正在查看的视频，只归档这一条内容。视频与音频按内容 ID 分目录保存，避免历史任务串档，也便于后续追溯来源。"],
  ["03", "采集评论与回复", "自动展开评论区并滚动加载，提取主评论与其回复关系。结果同时保存为结构化 JSON 和可编辑 Excel，不把导航、按钮等页面杂项混进评论。"],
  ["04", "语音转写与关键帧", "从本地音频生成完整转写、分段数据和关键帧。即使 AI 服务暂时不可用，原始视频、评论和转写仍会完整保留，不会因为后续失败而丢失。"],
  ["05", "生成可学习的笔记", "在内容库中确认材料后，再主动调用用户配置的模型。笔记综合视频原话、评论补充、事实核验、时效性和适用边界，不把转写机械地复制成摘要。"],
  ["06", "进入 Obsidian 知识库", "Markdown 使用可读标题、分层目录、主题地图与双向链接。你可以在软件内增删改查，也可以回到 Obsidian 继续连接已有知识。"],
];

const outputs = [
  ["视频与音频", "原始媒体按视频 ID 隔离保存，播放、转写和迁移互不干扰。"],
  ["评论 JSON 与 Excel", "主评论和回复保持父子关系；Excel 可直接检查、编辑和删除。"],
  ["完整转写", "保留完整语义和分段信息，为后续核验与写作提供可追溯材料。"],
  ["Markdown 笔记", "文件名可读，结构适配 Obsidian，并包含真正有依据的知识连接。"],
];

const faqs = [
  ["完整处理会自动调用 AI 吗？", "不会。完整处理完成视频归档、音频提取、评论与回复、Excel 和语音转写。学习笔记由你在已下载内容库中检查材料后主动生成，避免误调用和无效消耗。"],
  ["评论采集为什么不是简单读取页面文字？", "评论采集会定位评论容器、加载评论列表、展开回复并维护主评论与回复的关系。页面导航、点赞按钮、分享文案和无关界面文字不会作为评论正文输出。"],
  ["AI 笔记与普通视频摘要有什么不同？", "普通摘要只压缩内容；藏知 Studio 的笔记会解释概念、整理因果和方法、吸收评论中的补充与反例，并对真实性、时效性、适用条件和风险进行区分。"],
  ["我的登录、API Key 和文件存在哪里？", "登录状态保存在软件内置浏览器环境中，API Key 和设置保存在本机；视频、评论、转写与笔记写入你指定的工作目录，不会写进导出的笔记、Excel 或运行日志。"],
  ["可以处理任何视频吗？", "软件只处理你已登录、有权访问且页面能够正常播放的内容，不绕过验证码、版权保护、付费权限或平台访问限制。使用时仍需遵守平台规则、版权和隐私要求。"],
  ["安装需要什么环境？", "桌面端支持 64 位 Windows 10/11。安装包提供主程序；高质量本地转写需要可用的 Python 3.11、PyAV 与 faster-whisper 环境，模型生成则需要用户自己的兼容 API。"],
];

const productScenes = [
  {
    id: "browser",
    label: "同一窗口完成浏览与处理",
    title: "内置浏览器，不只是登录窗口。",
    body: "收藏页、视频页和处理命令处在同一个工作空间。打开目标视频后，可以直接采集高价值评论与回复、下载当前视频，或加入完整处理流程；底部进度与右侧产物路径会同步更新。",
    image: "product-browser.png",
    alt: "藏知 Studio 内置抖音浏览器、操作区和任务日志",
    points: ["登录状态与处理上下文保持一致", "操作只针对当前视频，避免批量误下载", "任务进度、日志和产物路径实时可见"],
    tone: "dark",
  },
  {
    id: "comments",
    label: "主评论和回复保持关系",
    title: "评论不是一团文字，而是讨论结构。",
    body: "采集器主动进入评论流程、滚动加载并展开回复。结果按“主评论 → 回复”组织，保留真正有价值的观点、质疑、案例和纠错；软件内可以检查内容，Excel 中也可以继续编辑。",
    image: "product-comments.png",
    alt: "评论洞察页面展示主评论和对应回复",
    points: ["自动采集，无需先手动打开评论区", "主评论与高价值回复成组保存", "JSON 与 Excel 同步更新，可人工校正"],
    tone: "light",
  },
  {
    id: "library",
    label: "一条内容，一套完整档案",
    title: "视频、音频、评论、转写，不再串档。",
    body: "已下载内容库以视频为单位组织资产。每条记录都能看到标题、采集时间和处理状态，并继续播放、转写或生成笔记。任务每完成一步，右侧立即出现对应文件的可点击路径。",
    image: "product-library.png",
    alt: "已下载内容库展示视频详情、处理状态和文件路径",
    points: ["媒体与任务按内容 ID 绑定", "处理成功的产物边做边出现", "后续步骤失败也不会抹掉已完成文件"],
    tone: "dark",
  },
  {
    id: "obsidian",
    label: "从材料到长期知识",
    title: "生成的不是目录，而是能继续学习的笔记。",
    body: "模型以完整转写为主体，以评论与回复作为补充证据和反例，再结合联网核验判断真实性与时效性。最终 Markdown 解释专业概念、给出适用条件与行动步骤，并建立主题地图和双向链接。",
    image: "product-obsidian.png",
    alt: "Obsidian 笔记管理与 Markdown 编辑页面",
    points: ["事实、观点、推测和待核验内容明确区分", "专业术语、因果关系与实操步骤充分展开", "可读文件名、分层目录、MOC 与双链结构"],
    tone: "paper",
  },
];

function ProductScene({ scene, onPreview }) {
  return (
    <section id={scene.id} className={`product-detail tone-${scene.tone}`}>
      <div className="detail-copy" data-reveal>
        <p className="section-label">{scene.label}</p>
        <h2>{scene.title}</h2>
        <p className="detail-body">{scene.body}</p>
        <ul>{scene.points.map((point) => <li key={point}>{point}</li>)}</ul>
      </div>
      <figure className="product-frame" data-reveal>
        <button type="button" onClick={() => onPreview(scene.image, scene.alt)} aria-label={`放大查看：${scene.alt}`} title="查看大图">
          <img src={media(scene.image)} alt={scene.alt} loading="lazy" />
          <span aria-hidden="true">⤢</span>
        </button>
      </figure>
    </section>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!preview) return undefined;
    const close = (event) => event.key === "Escape" && setPreview(null);
    document.addEventListener("keydown", close);
    document.body.classList.add("preview-open");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("preview-open");
    };
  }, [preview]);

  const go = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <nav className="topbar" aria-label="主导航">
        <button className="brand" onClick={() => go("overview")} aria-label="返回顶部">
          <img src={media("zangzhi-icon.png")} alt="" />
          <span>藏知 Studio</span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>菜单</button>
        <div className={menuOpen ? "nav-links open" : "nav-links"}>
          <button className={active === "overview" ? "active" : ""} onClick={() => go("overview")}>概览</button>
          <button className={active === "workflow" ? "active" : ""} onClick={() => go("workflow")}>完整流程</button>
          <button className={active === "browser" ? "active" : ""} onClick={() => go("browser")}>产品导览</button>
          <button className={active === "privacy" ? "active" : ""} onClick={() => go("privacy")}>本地与隐私</button>
          <button className={active === "faq" ? "active" : ""} onClick={() => go("faq")}>常见问题</button>
        </div>
        <a className="nav-download" href={downloadUrl} download>下载</a>
      </nav>

      <section id="overview" className="hero">
        <img className="hero-media" src={media("product-browser.png")} alt="藏知 Studio 完整桌面工作区" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <img className="hero-icon" src={media("zangzhi-icon.png")} alt="藏知 Studio 图标" />
          <h1>藏知 Studio</h1>
          <p className="hero-lead">把抖音收藏中的视频、评论和语音，整理成真实、可学、可连接的 Obsidian 知识。</p>
          <div className="hero-actions">
            <a className="primary" href={downloadUrl} download>下载 Windows 版 <span aria-hidden="true">↓</span></a>
            <button className="secondary" onClick={() => go("workflow")}>查看完整流程 <span aria-hidden="true">›</span></button>
          </div>
          <p className="release">版本 1.0.10 · Windows 10/11 64 位 · 本地优先</p>
        </div>
      </section>

      <section className="statement band-light" data-reveal>
        <p className="section-label">从收藏夹到知识库</p>
        <h2>不止下载视频。<br />把每条内容真正消化掉。</h2>
        <p>藏知 Studio 把内置浏览器、媒体归档、评论关系、本地转写、事实核验和 Obsidian 笔记放进同一条流程。你得到的不再是一堆散乱文件，也不是一段自动摘要，而是一套能回到原始证据、能够继续学习和连接的知识资产。</p>
      </section>

      <section id="workflow" className="workflow band-dark">
        <div className="section-heading" data-reveal>
          <p className="section-label gold">完整处理路径</p>
          <h2>六步完成一次真正的知识加工。</h2>
          <p>每一步都产生独立文件并保留处理状态。你可以只完成采集和转写，也可以在确认材料后继续生成 AI 学习笔记。</p>
        </div>
        <div className="fact-list">
          {workflow.map(([number, title, text]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {productScenes.map((scene) => (
        <ProductScene key={scene.id} scene={scene} onPreview={(image, alt) => setPreview({ image, alt })} />
      ))}

      <section className="dashboard-section band-light">
        <div className="dashboard-heading" data-reveal>
          <p className="section-label">中控台</p>
          <h2>下一步做什么，一眼就知道。</h2>
          <p>中控台汇总已下载内容、评论覆盖、转写进度和已生成笔记。它不是一页无意义的性能数字，而是告诉你哪些材料已经就绪、哪些仍待加工。</p>
        </div>
        <figure className="wide-frame" data-reveal>
          <button type="button" onClick={() => setPreview({ image: "product-dashboard.png", alt: "藏知 Studio 中控台" })} aria-label="放大查看中控台" title="查看大图">
            <img src={media("product-dashboard.png")} alt="藏知 Studio 中控台显示内容、评论、转写和笔记状态" loading="lazy" />
            <span aria-hidden="true">⤢</span>
          </button>
        </figure>
      </section>

      <section className="outputs band-dark">
        <div className="section-heading" data-reveal>
          <p className="section-label gold">可检查、可迁移、可继续编辑</p>
          <h2>所有结果都是真实文件。</h2>
        </div>
        <div className="output-list">
          {outputs.map(([title, text]) => <article key={title} data-reveal><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section id="privacy" className="settings-section band-paper">
        <div className="settings-copy" data-reveal>
          <p className="section-label">配置化，而不是写死</p>
          <h2>按你的工作方式运行。</h2>
          <p>工作目录、评论数量、转写精度、联网核验、笔记模板和模型服务都可以配置。API Key 只保存在本机，不会写入笔记、Excel 或日志；完整处理与 AI 生成分开执行，让成本和结果都保持可控。</p>
          <dl>
            <div><dt>笔记结构</dt><dd>自定义 Markdown 模板与生成提示词</dd></div>
            <div><dt>采集范围</dt><dd>设置主评论数量与回复处理策略</dd></div>
            <div><dt>处理质量</dt><dd>按电脑性能选择转写精度</dd></div>
            <div><dt>模型服务</dt><dd>使用用户自己的兼容 API 与模型</dd></div>
          </dl>
        </div>
        <figure className="settings-frame" data-reveal>
          <button type="button" onClick={() => setPreview({ image: "product-settings-redacted.png", alt: "藏知 Studio 配置页面，服务地址已打码" })} aria-label="放大查看配置页面" title="查看大图">
            <img src={media("product-settings-redacted.png")} alt="藏知 Studio 配置页面，服务地址已打码" loading="lazy" />
            <span aria-hidden="true">⤢</span>
          </button>
          <figcaption>服务地址已做隐私处理；软件中的实际配置由用户自行填写。</figcaption>
        </figure>
      </section>

      <section className="privacy band-dark">
        <div data-reveal>
          <p className="section-label gold">本地优先</p>
          <h2>你的收藏，留在你的电脑。</h2>
        </div>
        <div className="privacy-grid">
          <article data-reveal><strong>本地目录</strong><p>媒体、评论、转写和笔记按视频 ID 分目录保存，备份、迁移和删除都清晰可控。</p></article>
          <article data-reveal><strong>用户自有 API</strong><p>模型服务由用户配置。只有主动生成学习笔记时才会提交必要材料，完整队列不会自动产生 AI 调用。</p></article>
          <article data-reveal><strong>权限有边界</strong><p>只处理当前已登录且有权访问的内容，不绕过验证码、版权保护、付费权限或平台限制。</p></article>
        </div>
      </section>

      <section id="faq" className="faq band-light">
        <div className="section-heading" data-reveal>
          <p className="section-label">使用之前</p>
          <h2>你可能关心的问题。</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question} data-reveal>
              <summary>{question}<span aria-hidden="true">＋</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <img src={media("zangzhi-icon.png")} alt="" />
        <h2>让收藏，真正成为你的知识。</h2>
        <p>从一个真实视频开始，完整保留来源、讨论、转写和判断。</p>
        <a className="primary" href={downloadUrl} download>下载藏知 Studio <span aria-hidden="true">↓</span></a>
        <small>版本 1.0.10 · 安装包约 51 MB · Windows 10/11 64 位</small>
      </section>

      <footer>
        <div><strong>藏知 Studio</strong><span>收藏 → 可验证知识资产</span></div>
        <p>仅处理用户有权访问的内容。请遵守平台规则、版权与隐私要求。</p>
        <span>© 2026 藏知 Studio</span>
      </footer>

      {preview ? (
        <div className="preview" role="dialog" aria-modal="true" aria-label={preview.alt} onClick={() => setPreview(null)}>
          <button className="preview-close" type="button" onClick={() => setPreview(null)} aria-label="关闭大图" title="关闭">×</button>
          <img src={media(preview.image)} alt={preview.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
