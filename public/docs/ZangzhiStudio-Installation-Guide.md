# 藏知 Studio 安装与环境配置

## 先说结论

安装包只包含藏知 Studio 程序、内置浏览器支持、评论采集逻辑、媒体归档逻辑、转写脚本和笔记生成逻辑，不包含任何人的：

- API Base URL
- API Key
- 抖音登录状态、Cookie 或浏览器用户数据
- 个人工作目录和个人视频、评论、笔记

每位用户第一次使用时都要在自己的电脑上完成环境准备，并在软件设置中填写自己的模型服务信息。你的安装包不会把你的中转站、Key 或 `E:\shoucang` 带给别人。

## A. 普通用户：推荐的一键配置

### 1. 安装主程序

1. 从官网下载安装包。
2. 安装到默认目录，建议勾选“创建桌面图标”。
3. 启动“藏知 Studio”。安装包是 `win-x64` 自包含程序，不需要用户另外安装 .NET 8。

### 2. 运行一键配置

1. 打开左侧“设置”。
2. 点击“**一键配置本机环境**”。
3. 点击“开始一键配置”。
4. 等待窗口依次检查：
   - Microsoft Edge WebView2 Runtime
   - Python 3.11
   - pip
   - `av` 视频解码模块
   - `faster-whisper` 语音转写模块
   - `requests` 网络请求模块
   - 默认工作目录
5. 窗口显示“完成”后关闭，重新打开设置即可使用转写。

如果电脑没有 Python 3.11，一键工具会从 `python.org` 下载官方安装程序，按当前用户范围安装，不修改系统级 PATH。转写模型首次运行还可能下载 Whisper 模型文件，这是正常现象，耗时取决于网络速度。

### 3. 配置自己的 AI 服务

一键工具不会自动填 API 地址或 Key。进入设置，填写：

- **API Base URL**：你的 OpenAI Compatible 服务根地址。不要填写末尾 `/`，也不要重复填写 `/v1`。
- **API Key**：你自己的 Key。输入框是密码框，只保存在本机配置目录。
- **模型名称**：服务商实际提供的模型 ID，例如服务商文档中列出的模型名。

保存后，可以在“已下载内容库”中先确认视频、评论、转写，再点击“AI 生成学习笔记”。完整处理队列不会因为转写完成而自动调用 AI。

### 4. 登录和第一次任务

1. 点击“收藏导入”或顶部“收藏页”。
2. 在内置浏览器中由用户本人完成抖音登录和验证码操作。
3. 打开目标视频详情页。
4. 先用“手动下载当前视频”或“采集高价值评论与回复”做一次小测试。
5. 确认文件生成后，再使用“加入完整处理队列”。

## B. 手动配置：适合受控电脑或无法自动下载的网络

### 1. 安装运行时

- Windows 10/11 64 位。
- 安装 Microsoft Edge WebView2 Runtime（Evergreen Standalone Installer）。Windows 11 通常已预装；Windows 10 如果内置浏览器区域空白或启动失败，需要补装。
- 从 `https://www.python.org/downloads/release/python-3119/` 安装 Python 3.11 x64。
- 安装时勾选 pip；不要求勾选“Add Python to PATH”，因为软件会优先查找当前用户 Python 目录。

### 2. 安装转写依赖

在 PowerShell 中执行：

```powershell
python --version
python -m pip --version
python -m pip install --user --upgrade av faster-whisper requests
python -c "import av, faster_whisper, requests; print('imports ok')"
```

如果 `python` 指向了 Microsoft Store 占位程序，可以使用 Python Launcher：

```powershell
py -3.11 --version
py -3.11 -m pip install --user --upgrade av faster-whisper requests
py -3.11 -c "import av, faster_whisper, requests; print('imports ok')"
```

### 3. 选择工作目录

默认工作目录是当前用户“文档\藏知 Studio”。可以在设置中改成其他目录，例如：

```text
E:\shoucang
```

建议每位用户使用自己的目录，不要把你的整个工作目录复制给别人。目录中可能含有视频、评论、转写、笔记和本地运行日志。

### 4. 配置模型服务

在设置中填写用户自己的兼容 API。不要把 Key 写进：

- 安装包
- GitHub 仓库
- 官网前端代码
- 截图或演示视频
- Markdown 笔记、Excel、日志

如果要让朋友使用同一款软件，应分发安装包，让朋友填写自己的服务配置；不要把你的 Key 做成“公共默认配置”。

## C. “使用我的工具”到底包含什么

朋友下载你的安装包后可以直接启动主程序，不需要安装 .NET 8。第一次使用只需完成：

1. 点击一键配置，准备本机 Python 转写环境。
2. 在内置浏览器中登录自己的抖音账号。
3. 填写自己的 API Base URL、API Key 和模型名（如果需要生成 AI 笔记）。

你的工具负责软件能力和环境准备；它不应该替朋友提供你的账号、Key、收藏内容或模型额度。这是商业分发时必须保持的边界。

## D. 常见问题

### 一键配置提示 WebView2 未找到

安装 Microsoft Edge WebView2 Runtime，完全退出藏知 Studio 后重新打开。内置浏览器依赖 WebView2，和普通 Edge 浏览器不是同一个可执行文件。

### 一键配置提示 pip 或模块安装失败

检查网络和代理后重新运行；也可以按“手动配置”执行命令。若公司网络禁止编译或下载模型，使用有权限的网络完成安装，再回到原电脑运行导入测试。

### 转写成功但 AI 笔记失败

这通常不是转写环境问题。检查 API Base URL 是否是服务商文档要求的根地址、模型名称是否真实存在、Key 是否有额度和权限。视频、音频、评论和转写文件会保留，不会因 AI 失败而丢失。

### API Key 是否能在安装包里被恢复

不能。安装包只包含空配置和通用程序代码。运行时 Key 由用户输入，保存在本机用户配置目录，不进入安装目录、官网、导出笔记或 Excel。

## E. 升级与卸载

- 升级安装包不会删除工作目录中的视频、评论、转写和笔记。
- 卸载主程序不会自动删除你的工作目录；如需删除，请先在软件内确认，再手动清理目录。
- API 配置位于当前 Windows 用户的本地应用数据目录。更换电脑时不要复制配置文件中的 Key；建议在新电脑重新输入。
