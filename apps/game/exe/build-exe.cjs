// ビルド済みの単一ファイル(dist/game/index.html)を内蔵した配布用 exe を生成する。
// 事前に `vite build`(viteSingleFile で1ファイル化)が必要。
// `yarn build:exe` を使えば build → このスクリプトの順で自動実行される。
// 友達にこの1ファイル(sonotchi-bowl.exe)を渡すだけで、
// ブラウザのアプリモードでゲームが起動する(追加ランタイム不要)。
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const GAME_DIR = path.resolve(__dirname, '..'); // apps/game
const REPO_ROOT = path.resolve(__dirname, '../../..'); // sonocchi
const htmlPath = path.join(REPO_ROOT, 'dist', 'game', 'index.html');
const csPath = path.join(__dirname, 'Launcher.cs');
const exePath = path.join(GAME_DIR, 'sonotchi-bowl.exe');

if (!fs.existsSync(htmlPath)) {
    console.error(`ビルド成果物が見つかりません: ${htmlPath}\n先に \`yarn build:game\` (または \`yarn build\`) を実行してください。`);
    process.exit(1);
}

const html = fs.readFileSync(htmlPath);
const b64 = html.toString('base64');

const CHUNK = 8000;
const parts = [];
for (let i = 0; i < b64.length; i += CHUNK) parts.push('"' + b64.slice(i, i + CHUNK) + '"');
const b64Literal = parts.join('+\n');

const cs = `using System;
using System.Diagnostics;
using System.IO;

class SonotchiBowl {
    static string B64 =
${b64Literal};

    [STAThread]
    static void Main() {
        string dir = Path.Combine(Path.GetTempPath(), "SonotchiBowl");
        Directory.CreateDirectory(dir);
        string file = Path.Combine(dir, "sonotchi-bowl.html");
        try { File.WriteAllBytes(file, Convert.FromBase64String(B64)); } catch { }

        string url = "file:///" + file.Replace("\\\\", "/");

        string[] browsers = { "msedge.exe", "chrome.exe" };
        foreach (string b in browsers) {
            try {
                var psi = new ProcessStartInfo(b, "--app=\\"" + url + "\\" --window-size=440,860");
                psi.UseShellExecute = true;
                Process.Start(psi);
                return;
            } catch { }
        }
        try {
            var psi = new ProcessStartInfo(url);
            psi.UseShellExecute = true;
            Process.Start(psi);
        } catch { }
    }
}
`;

fs.writeFileSync(csPath, cs, 'utf8');
console.log(`Launcher.cs generated (html ${html.length} bytes).`);

const cscCandidates = [
    'C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe',
    'C:/Windows/Microsoft.NET/Framework/v4.0.30319/csc.exe',
];
const csc = cscCandidates.find((p) => fs.existsSync(p));
if (!csc) {
    console.warn('csc.exe が見つかりませんでした。Launcher.cs は生成済みです。手動でコンパイルしてください。');
    process.exit(0);
}
execFileSync(csc, ['-nologo', '-target:winexe', '-optimize+', `-out:${exePath}`, csPath], { stdio: 'inherit' });
console.log(`Built: ${exePath}`);
