# install eslint
npm install eslint

# install base config
export PKG=eslint-config-airbnb;
npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install "$PKG@latest"

# create .eslintrc
echo "{ \"extends\": \"airbnb\" }" > .eslintrc

./node_modules/.bin/eslint --quiet . > errors.txt

