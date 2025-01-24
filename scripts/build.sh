npm install;
tsc;
if [ ! -d ./build ]; then
  mkdir ./build;
fi
npm run build && \
  node --experimental-sea-config sea-linux-config.json && \
  cp $(command -v node) build/my-language && \
  npx postject build/my-language NODE_SEA_BLOB build/sea-prep-linux.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 && \
  rm build/sea-prep-linux.blob