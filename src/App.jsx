import { useEffect, useState } from "react";

const assetBase = import.meta.env.BASE_URL;
const media = (name) => `${assetBase}media/${name}`;
const downloadUrl = `${assetBase}downloads/ZangzhiStudio-Setup-1.0.10.exe`;

const facts = [
  ["01", "当前内容归档", "锁定正在播放的视频，视频与音频按内容 ID 归档，不与历史素材混在一起。"],
  ["02", "评论与回复成组", "保留主评论和高价值回复之间的关系，同时输出便于检查的 Excel。"],
  ["03", "完整语音转写", "本地转写生成时间戳文本、分段 JSON 和关键帧，原始信息始终可追溯。"],
  ["04", "成为学习笔记", "结合转写与评论流式生成 Markdown，进入 Obsidian 后继续编辑和建立双链。"],
];

const faqs = [
  ["它会自动调用 AI 吗？", "不会。完整处理队列只完成归档、评论、Excel 和转写。学习笔记由你在内容库中确认材料后手动生成。"],
  ["我的登录和文件存在哪里？", "平台登录状态保存在软件内置浏览器环境中。视频、评论、转写和笔记保存在你指定的本地工作目录。"],
  ["可以处理任何视频吗？", "软件只处理你已登录、有权访问且页面能够正常播放的内容，不绕过平台权限、版权保护或访问限制。"],
  ["安装需要什么环境？", "支持 64 位 Windows 10/11。基础归档由安装包提供；本地转写仍需要 Python 3.11、PyAV 和 faster-whisper 环境。"],
];

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

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
          <button className={active === "workflow" ? "active" : ""} onClick={() => go("workflow")}>工作流</button>
          <button className={active === "privacy" ? "active" : ""} onClick={() => go("privacy")}>本地与隐私</button>
          <button className={active === "faq" ? "active" : ""} onClick={() => go("faq")}>常见问题</button>
        </div>
        <a className="nav-download" href={downloadUrl} download>下载</a>
      </nav>

      <section id="overview" className="hero">
        <img className="hero-media" src={media("studio-main.png")} alt="藏知 Studio 内置浏览器与任务工作台" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <img className="hero-icon" src={media("zangzhi-icon.png")} alt="藏知 Studio 图标" />
          <p className="eyebrow">知识，不该停在收藏夹。</p>
          <h1>藏知 Studio</h1>
          <p className="hero-lead">把你真正想学的视频，变成可回看、可核验、可连接的个人知识库。</p>
          <div className="hero-actions">
            <a className="primary" href={downloadUrl} download>下载 Windows 版 <span aria-hidden="true">↓</span></a>
            <button className="secondary" onClick={() => go("workflow")}>了解工作流 <span aria-hidden="true">›</span></button>
          </div>
          <p className="release">版本 1.0.10 · Windows 10/11 64 位</p>
        </div>
      </section>

      <section className="statement band-light" data-reveal>
        <p className="eyebrow dark">从短暂的信息流，到长期的知识资产。</p>
        <h2>收藏只是开始。<br />理解、验证、连接，才是留下来。</h2>
        <p>藏知 Studio 在同一个桌面工作区里完成媒体归档、评论关系、语音转写和学习笔记。每一步都有原始文件，每一个结论都能回到来源。</p>
      </section>

      <section id="workflow" className="workflow band-dark">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">一个视频。一条完整学习路径。</p>
          <h2>从打开，到沉淀。</h2>
        </div>
        <div className="fact-list">
          {facts.map(([number, title, text]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-scene band-light">
        <div className="scene-copy" data-reveal>
          <p className="eyebrow dark">看见过程，也看见结果。</p>
          <h2>所有产物，边做边出现。</h2>
          <p>视频、音频、评论、Excel 和转写会在任务执行时实时追加。路径可直接点击定位；即使后续步骤失败，已经完成的文件依然保留。</p>
        </div>
        <figure className="screen-stage" data-reveal>
          <img src={media("studio-comments.png")} alt="评论采集与任务进度界面" />
          <figcaption>评论、回复和执行日志保持在同一条可追溯链路上。</figcaption>
        </figure>
      </section>

      <section className="knowledge band-paper">
        <div className="knowledge-copy" data-reveal>
          <p className="eyebrow dark">不是摘要。是一篇真正能学的笔记。</p>
          <h2>原话、评论与判断，分层写清楚。</h2>
          <p>完整转写保留上下文，高价值评论提供补充和反例。AI 以流式方式生成 Markdown，提示你区分事实、观点、时效性和待核验问题。</p>
          <ul>
            <li>核心结论与专业概念解释</li>
            <li>可执行步骤与适用条件</li>
            <li>评论补充、反例与争议</li>
            <li>Obsidian 分层与双链建议</li>
          </ul>
        </div>
        <figure className="library-shot" data-reveal>
          <img src={media("studio-library.png")} alt="已下载内容库中的视频详情与学习笔记操作" />
        </figure>
      </section>

      <section id="privacy" className="privacy band-dark">
        <div data-reveal>
          <p className="eyebrow">本地优先。</p>
          <h2>你的收藏，留在你的电脑。</h2>
        </div>
        <div className="privacy-grid">
          <article data-reveal><strong>本地目录</strong><p>媒体、评论、转写和笔记按视频 ID 分目录保存，迁移和备份都清晰可控。</p></article>
          <article data-reveal><strong>用户自有 API</strong><p>模型服务由用户自己配置。完整队列不会在未确认的情况下自动产生 AI 调用。</p></article>
          <article data-reveal><strong>权限有边界</strong><p>只处理当前已登录且有权访问的内容，不绕过验证码、版权保护或平台限制。</p></article>
        </div>
      </section>

      <section id="faq" className="faq band-light">
        <div className="section-heading" data-reveal>
          <p className="eyebrow dark">进一步了解</p>
          <h2>常见问题。</h2>
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
        <a className="primary" href={downloadUrl} download>下载藏知 Studio <span aria-hidden="true">↓</span></a>
        <p>版本 1.0.10 · 安装包约 51 MB</p>
      </section>

      <footer>
        <div><strong>藏知 Studio</strong><span>收藏 → 可验证知识资产</span></div>
        <p>仅处理用户有权访问的内容。请遵守平台规则、版权与隐私要求。</p>
        <span>© 2026 藏知 Studio</span>
      </footer>
    </main>
  );
}
