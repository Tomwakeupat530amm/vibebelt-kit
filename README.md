<p align="center"><strong>Tiếng Việt</strong> | <a href="docs/i18n/README.en.md">English</a></p>

<!-- vibecoder-top:start -->
# vibebelt-kit

**Giúp trợ lý AI viết code của bạn lập kế hoạch trước, tự kiểm tra việc mình làm, và ghi chép lại về dự án.**

[![Version](https://img.shields.io/badge/version-1.0.0-2EA043)](CHANGELOG.md) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE) ![Agents](https://img.shields.io/badge/agents-15-orange) ![Skills](https://img.shields.io/badge/skills-33-purple)

vibebelt-kit là một bộ công cụ bổ sung miễn phí cho Claude Code và Codex, hai trợ lý AI viết code chạy trong terminal. Nó cho trợ lý một cách làm việc cố định, gọi là RIPER-5: bảy bước (phase), và bước nào cũng có một lần kiểm tra phải đạt thì mới sang bước sau. Trợ lý viết ra một kế hoạch để bạn đọc, chờ bạn đồng ý rồi mới bắt tay vào làm, sau đó một trợ lý kiểm thử riêng chạy lại các bài kiểm tra. Bạn chỉ cần trò chuyện với nó bằng lời bình thường.

Cài đặt bằng một dòng lệnh, chạy trong thư mục dự án của bạn:

```bash
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
```
<!-- verified in Phase 8: the public install URL works only after the repository is published; Phase 8 tests it for real; remove this note after that test passes -->

Sau đó mở Claude Code hoặc Codex trong cùng thư mục và gõ `Run vb-setup`. Phần Bắt đầu nhanh bên dưới hướng dẫn bạn từng bước.

## Ví dụ thực tế

| Bạn nói | Bộ kit làm |
|---|---|
| "Thêm form liên hệ vào trang web của tôi." | Hỏi vài câu ngắn, ghi lại điều bạn muốn để bạn xem lại, lập kế hoạch, chờ bạn đồng ý, bắt tay vào làm, rồi một trợ lý kiểm thử riêng chạy lại các bài kiểm tra. |
| "Tôi bấm nút đăng nhập mà không có gì xảy ra. Sửa giúp tôi." | Thu thập bằng chứng để tìm ra nguyên nhân thật trước, rồi mới sửa và kiểm tra lại bản sửa. |
| "quick fix: chân trang đang ghi 2025, đổi thành 2026" | Tìm đúng dòng cần sửa, nói rõ thay đổi trong một câu, bạn đồng ý thì sửa, rồi chạy một bài kiểm tra nhanh. |
<!-- vibecoder-top:end -->

## Bắt đầu nhanh

<!-- quick-start:start -->
Năm phút, bảy bước. Các từ in đậm được giải thích trong [Bảng thuật ngữ](#bảng-thuật-ngữ).

### 1. Chuẩn bị những thứ cần có

- **Claude Code** hoặc **Codex**, đã cài đặt và đăng nhập.
- **Node.js** bản 22 trở lên. Để kiểm tra, mở **terminal** và gõ `node --version`.
- **Git**, công cụ mà trình cài đặt dùng để tải bộ kit về. Để kiểm tra, gõ `git --version`.
- Trên Windows: chạy mọi lệnh trong **Git Bash** hoặc **WSL**, đừng dùng PowerShell hay Command Prompt. Trình cài đặt là một script **bash**.

Hiện tại bộ kit mới được thử trên Linux, chạy qua WSL trên Windows. Trình cài đặt cũng hỗ trợ macOS và Git Bash, nhưng hai môi trường này chưa được thử.

### 2. Cài đặt

Mở terminal trong thư mục dự án của bạn và dán:

```bash
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
```

Lệnh này chép bộ kit vào dự án của bạn. Nếu dự án đã có thư mục `.claude/`, `.codex/` hoặc `.agents/`, hay file `CLAUDE.md` hoặc `AGENTS.md`, trình cài đặt sẽ lưu một bản sao của chúng vào `.vibecode-backup/` trước. Sau đó nó thêm các file của bộ kit. File nào trùng tên với một file của bộ kit, kể cả `CLAUDE.md` và `AGENTS.md`, sẽ được thay bằng bản của bộ kit. Kế hoạch và ghi chú riêng của bạn trong `process/` vẫn giữ nguyên; bộ kit chỉ cập nhật file của chính nó trong đó. File `.claude/settings.json` có sẵn cũng được giữ nguyên. Bạn có thể chạy lại lệnh này bất cứ lúc nào; lần nào nó cũng sao lưu trước.

### 3. Mở trợ lý AI trong cùng thư mục

Gõ `claude` để mở Claude Code, hoặc `codex` để mở Codex. Hãy mở từ thư mục dự án để trợ lý thấy các file mới.

### 4. Nói câu đầu tiên

Gõ: `Run vb-setup`

vb-setup là một **skill**: bộ hướng dẫn soạn sẵn mà trợ lý làm theo. Nó xem qua dự án, hỏi bạn về dự án, cho bạn xem những gì nó tìm thấy, và hỏi ý bạn trước khi thay đổi bất cứ thứ gì. Sau đó nó tạo nốt phần còn lại của thư mục `process/` và viết ghi chú về dự án vào đó.

### 5. Bạn sẽ thấy gì

Trợ lý viết những tin nhắn ngắn và chờ bạn trả lời. Cứ trả lời bằng lời bình thường. Khi xong, dự án của bạn có thư mục `process/context/` chứa các ghi chú mà trợ lý đọc trước mỗi việc.

### 6. Nhờ trợ lý làm việc đầu tiên

Mô tả điều bạn muốn, ví dụ: "Thêm nút bật chế độ tối vào trang cài đặt." Bộ kit sẽ làm lần lượt từng **phase**: tìm hiểu, ghi lại yêu cầu, viết **plan** (kế hoạch), và cứ thế tiếp tục. Sau mỗi phase nó dừng lại chờ bạn: gõ `go` để đi tiếp. Trước khi viết code, nó chờ hai câu lệnh: `ENTER VALIDATE MODE` (kiểm tra kế hoạch) và `ENTER EXECUTE MODE` (bắt tay vào làm). Phần Dùng hằng ngày bên dưới liệt kê đủ các câu lệnh.

### 7. Nếu bị kẹt

Cứ kể cho trợ lý điều bạn đang thấy, bằng lời của bạn, ví dụ "Tôi gặp lỗi này: ..." hoặc "Giờ tôi nên làm gì tiếp?". Các lỗi khi cài đặt có trong phần Xử lý sự cố bên dưới.
<!-- quick-start:end -->

## Dùng hằng ngày

Bộ kit làm việc qua bảy bước, gọi là phase. Nó chỉ sang phase tiếp theo khi bạn bảo, và mỗi phase có một lần kiểm tra (gate) phải đạt trước.

Gõ các câu trong cột "Bạn nói" đúng như mẫu (bằng tiếng Anh). Còn điều bạn muốn thì cứ mô tả bằng lời của bạn, tiếng Việt cũng được.

| Phase | Việc diễn ra | Bạn nói |
|---|---|---|
| 1. Research (tìm hiểu) | Đọc dự án và thu thập thông tin. Không sửa gì. | Mô tả điều bạn muốn, hoặc `ENTER RESEARCH MODE` |
| 2. Spec (ghi yêu cầu) | Ghi lại điều bạn yêu cầu bằng lời dễ hiểu để bạn xem lại. | `go` hoặc `ENTER SPEC MODE` |
| 3. Innovate (chọn cách làm) | So sánh hai, ba cách làm và chọn một. | `go` hoặc `ENTER INNOVATE MODE` |
| 4. Plan (kế hoạch) | Viết kế hoạch từng bước, kể cả các file sẽ sửa. | `go` hoặc `ENTER PLAN MODE` |
| 5. Validate (kiểm tra kế hoạch) | Tìm chỗ còn hở trong kế hoạch và liệt kê các bài kiểm tra phải đạt. | `ENTER VALIDATE MODE` |
| 6. Execute (thực hiện) | Làm đúng như kế hoạch. Sau đó một trợ lý kiểm thử riêng chạy lại các bài kiểm tra. | `ENTER EXECUTE MODE` |
| 7. Update-Process (cập nhật ghi chú) | Lưu những gì học được vào ghi chú dự án và cất kế hoạch đã xong. | `ENTER UPDATE PROCESS MODE` |

### Lối tắt cho việc nhỏ

| Lối tắt | Dùng khi | Bạn nói |
|---|---|---|
| Quick fix (sửa nhanh) | Một thay đổi nhỏ, ít rủi ro. Không cần file kế hoạch. Nếu hóa ra thay đổi có rủi ro (ví dụ đụng tới đăng nhập hay thanh toán), bộ kit chuyển sang quy trình đầy đủ. | `quick fix:` rồi ghi điều cần sửa, hoặc `ENTER QUICK FIX MODE` |
| Fast mode (chế độ nhanh) | Một thay đổi vừa phải: đi từ tìm hiểu tới kiểm tra kế hoạch trong một lượt, rồi dừng chờ bạn đồng ý trước khi làm. | `ENTER FAST MODE -` rồi ghi điều bạn muốn |
| Autopilot (tự lái) | Chạy cả quy trình mà không dừng. Nó hỏi hết các câu cần hỏi một lần, ngay từ đầu. | `autopilot` rồi ghi điều bạn muốn (hoặc `autopilot quick:`, `autopilot fast:`, `autopilot full:`) |

Autopilot vẫn dừng lại hỏi bạn trước những việc không thể hoàn tác hoặc có tác động ra bên ngoài (đăng lên mạng, gửi tin nhắn, tiêu tiền), trước một bài kiểm tra tốn tiền, và khi hai phase liền nhau đều bị kẹt. Gõ `stop autopilot` để tắt.

## Cập nhật bộ kit

Gõ `Run vb-update` trong Claude Code hoặc Codex. Nó tải bộ kit mới nhất, cho bạn xem những gì sẽ thay đổi, và không đổi gì cho tới khi bạn đồng ý. Nó không bao giờ tự ý đổi kế hoạch và ghi chú của bạn.

Bạn cũng có thể chạy lại lệnh cài đặt; nó sao lưu các file hiện tại của bộ kit trước.

## Chuyển từ vibecode-pro-max-kit

vibebelt-kit là bản fork (một bản sao được đổi tên và phát triển riêng) của vibecode-pro-max-kit. Nó giữ nguyên quy trình làm việc; các thay đổi (tên mới, các bản sửa lỗi, tài liệu dễ hiểu hơn) đã được xác minh bằng các bộ kiểm tra tự động của bộ kit. Tên agent và skill giờ bắt đầu bằng `vb` thay vì `vc`.

Cách chuyển:

1. Trong thư mục dự án, chạy lệnh cài đặt ở phần Bắt đầu nhanh. Đừng dùng skill cập nhật của bộ kit cũ: nó sẽ vẫn tải bộ kit cũ về.
2. Mở Claude Code hoặc Codex và gõ `Run vb-update`. Trình cài đặt sẽ nhắc bạn làm bước này vì nó nhận ra bản cài cũ của bạn.

Điều gì xảy ra với file của bạn:

- Bản cài cũ của bạn được chép sang `.vibecode-backup/` trước khi có bất cứ thay đổi nào.
- Một file của bộ kit cũ chỉ bị xóa khi trình cài đặt chứng minh được là bạn chưa từng sửa nó: nó so dấu vân tay của file (mã hash) với file gốc của bộ kit.
- File bạn đã sửa, và file nó không nhận ra, đều được giữ lại. Trình cài đặt ghi từng file đó là `kept`; khi không cần nữa thì bạn tự xóa.
- Hai file ghi chép nhỏ, `.vb-version` (phiên bản bộ kit của bạn) và `.vb-installed-files` (danh sách file của bộ kit), thay cho hai file cũ.
- Kế hoạch và ghi chú của bạn trong `process/` vẫn ở nguyên chỗ.

## Xử lý sự cố

| Vấn đề | Cách làm |
|---|---|
| Trình cài đặt báo `Node.js is required` hoặc `Node.js >= 22 required` | Cài Node.js bản 22 trở lên từ https://nodejs.org, mở một terminal mới, rồi chạy lại lệnh cài đặt. |
| Trình cài đặt báo `git is required` | Cài Git từ https://git-scm.com, rồi chạy lại lệnh cài đặt. |
| Trên Windows, lệnh bị lỗi trong PowerShell hoặc Command Prompt | Mở Git Bash (đi kèm Git for Windows) hoặc WSL, rồi chạy lệnh ở đó. |
| Trình cài đặt báo `ln -sf failed` và `Copied skills` | Đây chỉ là cảnh báo: Codex vẫn tìm thấy các skill. Muốn Codex tự nhận các bản cập nhật sau này, hãy bật Developer Mode của Windows rồi chạy lại lệnh cài đặt. |
| Trợ lý không biết `vb-setup` là gì | Mở Claude Code hoặc Codex từ thư mục dự án (nơi bạn đã chạy lệnh cài đặt). Nếu nó đang mở sẵn, hãy đóng lại rồi mở lại. |
| Hook không chạy trong dự án đã có sẵn `.claude/settings.json` | Trình cài đặt giữ nguyên file đó. Thêm các hook trong khối `hooks` ở [CHANGELOG.md](CHANGELOG.md) (mục 1.0.0) vào file của bạn, và giữ lại cài đặt riêng của bạn. `Run vb-update` cũng nhắc việc này. |
| Trình cài đặt liệt kê một số file là `kept` | Đó là file của bộ kit cũ mà có thể bạn đã sửa. Xem lại, rồi xóa những file không cần nữa. |
| Có gì đó bị hỏng sau khi cài | File cũ của bạn nằm trong `.vibecode-backup/`. Chép lại những gì bạn cần, hoặc nhờ trợ giúp (xem phần Nhận trợ giúp). |

## Bảng thuật ngữ

<!-- glossary:start -->
| Thuật ngữ | Nghĩa là gì | So sánh đời thường |
|---|---|---|
| **agent** (trợ lý AI) | Một trợ lý AI lo một việc, như tìm hiểu hay kiểm thử. Bộ kit có 15 agent. | Một chuyên gia trong một đội. |
| **bash** | Ngôn ngữ lệnh dùng để viết trình cài đặt. | Như ngôn ngữ dùng để viết một công thức nấu ăn. |
| **branch** (nhánh) | Một hướng làm việc riêng trong Git. Nó không đổi bản chính cho tới khi được gộp vào. | Một bản nháp của tài liệu. |
| **Claude Code** | Trợ lý AI viết code của Anthropic, chạy trong terminal. | Một lập trình viên mà bạn nhắn tin trò chuyện cùng. |
| **Codex** | Trợ lý AI viết code của OpenAI, cũng chạy trong terminal. | Cùng ý tưởng đó, của một công ty khác. |
| **commit** | Một bản lưu nhanh của dự án trong Git, kèm một ghi chú ngắn. | Một điểm lưu trong game. |
| **context** (ngữ cảnh) | Ghi chú của bộ kit về dự án của bạn, nằm trong `process/context/`. | Cuốn sổ tay trợ lý đọc trước mỗi việc. |
| **gate** (cổng kiểm tra) | Một lần kiểm tra phải đạt thì phase sau mới được bắt đầu. | Nghiệm thu móng trước khi xây tiếp. |
| **Git** | Công cụ ghi lại mọi thay đổi trong dự án của bạn. | Chế độ "theo dõi thay đổi" cho cả một thư mục. |
| **Git Bash** | Một terminal cho Windows, đi kèm Git for Windows, hiểu được bash. | Người phiên dịch giữa Windows và bash. |
| **hook** | Một script nhỏ tự chạy vào những lúc định sẵn, ví dụ để chặn trợ lý đọc file bí mật như `.env` khi bạn chưa cho phép. | Chuông báo cháy: tự kêu mà không cần ai bảo. |
| **Node.js** | Chương trình miễn phí để chạy JavaScript. Các script nhỏ của bộ kit cần bản 22 trở lên. | Động cơ chạy các công cụ nhỏ của bộ kit. |
| **phase** (bước) | Một trong bảy bước: Research, Spec, Innovate, Plan, Validate, Execute, Update-Process. | Một giai đoạn khi xây nhà. |
| **plan** (kế hoạch) | Bản viết sẵn những gì sẽ thay đổi và cách kiểm tra, có trước khi viết dòng code nào. | Bản vẽ thiết kế. |
| **RIPER-5** | Tên quy trình làm việc từng bước của bộ kit (bảy phase ở trên). | Một công thức có các bước cố định. |
| **skill** (kỹ năng) | Bộ hướng dẫn soạn sẵn mà agent làm theo cho một loại việc, như `vb-setup`. | Một tấm thẻ công thức nấu ăn. |
| **terminal** (cửa sổ dòng lệnh) | Cửa sổ để gõ lệnh thay vì bấm chuột. | Gõ chữ để ra lệnh cho máy tính. |
| **validate** (kiểm tra) | Phase tìm chỗ còn hở trong kế hoạch và liệt kê các bài kiểm tra phải đạt. | Một người thứ hai soát lại bản vẽ. |
| **WSL** | Windows Subsystem for Linux: Linux chạy bên trong Windows. | Một căn phòng Linux trong ngôi nhà Windows. |
<!-- glossary:end -->

## Bên trong có gì

| Thành phần | Số lượng | Là gì |
|---|---|---|
| Agent | 15 | Các trợ lý AI, mỗi trợ lý một việc (danh sách bên dưới). |
| Skill | 33 | Bộ hướng dẫn soạn sẵn cho các việc như lập kế hoạch, kiểm thử, cài đặt (danh sách bên dưới). |
| Hook | 10 | Các script an toàn nhỏ, ví dụ một hook chặn việc đọc file `.env` và các khóa bí mật khi bạn chưa cho phép. |
| Tài liệu quy trình | 22 | Các quy tắc chung mà mọi agent làm theo, nằm trong `process/development-protocols/`. |
| Bài kiểm tra | 38 | Các script kiểm tra cấu trúc của chính bộ kit (gọi là validator). |

Sau khi cài đặt và chạy `vb-setup`, dự án của bạn có:

```text
your-project/
├── .claude/        agent, skill và hook cho Claude Code
├── .codex/         cũng các agent đó, cho Codex
├── .agents/skills  một liên kết giúp Codex tìm thấy cùng bộ skill
├── CLAUDE.md       các quy tắc Claude Code đọc khi bắt đầu một phiên làm việc
├── AGENTS.md       cũng các quy tắc đó, cho Codex
└── process/        kế hoạch, báo cáo và ghi chú dự án của bạn
```

### 15 Agents (trợ lý AI)

Bảy agent dùng opus, mô hình mạnh hơn; tám agent dùng sonnet, mô hình nhẹ và rẻ hơn. Bạn không cần tự gọi agent: trợ lý tự chọn.

| Agent | Mô hình | Việc nó làm |
|---|---|---|
| `vb-research-agent` | opus | Đọc code của bạn và tra cứu trên mạng. Không sửa gì. |
| `vb-spec-agent` | sonnet | Ghi lại điều bạn yêu cầu để bạn xem lại. |
| `vb-innovate-agent` | sonnet | So sánh hai, ba cách làm. |
| `vb-plan-agent` | opus | Viết kế hoạch từng bước. |
| `vb-validate-agent` | opus | Kiểm tra kế hoạch và liệt kê các bài kiểm tra phải đạt. |
| `vb-execute-agent` | opus | Làm đúng như kế hoạch. |
| `vb-fast-mode-agent` | opus | Chạy chế độ nhanh (Fast mode). |
| `vb-quick-fix-agent` | opus | Làm một bản sửa nhanh nhỏ và kiểm tra nó. |
| `vb-update-process-agent` | sonnet | Lưu lại những gì học được và cất kế hoạch đã xong. |
| `vb-tester` | opus | Tự chạy lại các bài kiểm tra sau khi làm xong. |
| `vb-debugger` | sonnet | Tìm nguyên nhân thật của lỗi, có bằng chứng. |
| `vb-code-reviewer` | sonnet | Duyệt code trước khi coi là xong. |
| `vb-code-simplifier` | sonnet | Làm code dễ đọc hơn mà không đổi cách nó chạy. |
| `vb-ui-ux-designer` | sonnet | Dựng giao diện theo đúng thiết kế của bạn. |
| `vb-git-manager` | sonnet | Lưu thay đổi thành các commit rõ ràng, tách bạch. |

### 33 Skills (kỹ năng)

Skill là bộ hướng dẫn soạn sẵn mà các agent dùng. Trợ lý tự chọn skill phù hợp dựa vào từ ngữ trong yêu cầu của bạn; bạn cũng có thể gọi đích danh một skill, như `Run vb-setup`.

| Nhóm | Skill |
|---|---|
| Cài đặt và cập nhật | `vb-setup` · `vb-update` · `vb-publish` |
| Hiểu dự án | `vb-context-discovery` · `vb-plan-discovery` · `vb-generate-context` · `vb-review-situation` · `vb-scout` · `vb-docs-seeker` |
| Yêu cầu và kế hoạch | `vb-intent-clarify` · `vb-generate-spec` · `vb-generate-plan` · `vb-generate-phase-program` · `vb-agent-strategy-compare` · `vb-predict` |
| Kiểm tra kế hoạch và kiểm thử | `vb-validate-findings` · `vb-test-coverage-plan` · `vb-feasibility-test` · `vb-scenario` · `vb-risk-evidence-pack` · `vb-security` |
| Chạy và hoàn tất | `vb-autopilot` · `vb-autoresearch` · `vb-generate-closeout` |
| Giữ bộ kit chạy tốt | `vb-audit-vc` · `vb-audit-context` · `vb-audit-plans` |
| Giải quyết vấn đề | `vb-debug` · `vb-problem-solving` · `vb-sequential-thinking` |
| Web và thiết kế | `vb-frontend-design` · `vb-web-testing` · `vb-agent-browser` |

## Nhận trợ giúp

- Câu hỏi và ý tưởng: [GitHub Discussions](https://github.com/Tomwakeupat530amm/vibebelt-kit/discussions).
- Báo lỗi: [mở một issue](https://github.com/Tomwakeupat530amm/vibebelt-kit/issues/new?template=1.bug_report.yml) (phiếu báo lỗi trên GitHub) và dán nội dung mà trình cài đặt hoặc trợ lý đã in ra.
- Vấn đề bảo mật: đừng mở issue công khai; làm theo [SECURITY.md](SECURITY.md) (tiếng Anh) để báo riêng.

## Đóng góp và lịch sử thay đổi

- [CONTRIBUTING.md](CONTRIBUTING.md) (tiếng Anh): cách đề xuất thay đổi.
- [CHANGELOG.md](CHANGELOG.md) (tiếng Anh): những gì thay đổi trong từng phiên bản.

## Ghi công và giấy phép

vibebelt-kit là bản fork (nhánh phát triển riêng) của [vibecode-pro-max-kit](https://github.com/withkynam/vibecode-pro-max-kit) do các tác giả gốc tạo ra, được dùng theo giấy phép MIT. Thông báo bản quyền gốc vẫn được giữ nguyên trong [LICENSE](LICENSE). <!-- upstream-attribution -->

Giấy phép: MIT. [LICENSE](LICENSE) giữ nguyên dòng gốc `Copyright (c) 2026 vibecode` và thêm dòng `Copyright (c) 2026 Tomwakeupat530amm` cho bản fork này.
