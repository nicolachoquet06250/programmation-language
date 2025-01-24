npm install;
tsc;
If (-not (Test-Path build)) {
    mkdir build;
}
npm run build;
node --experimental-sea-config sea-windows-config.json;
node --eval="require('fs').copyFileSync(process.execPath, 'build/my-language.exe')";
signtool remove /s build/my-language.exe;
npx postject build/my-language.exe NODE_SEA_BLOB build/sea-prep-windows.blob --overwrite --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2;
signtool sign /fd SHA256 /a build/my-language.exe;
Remove-Item build/sea-prep-windows.blob;