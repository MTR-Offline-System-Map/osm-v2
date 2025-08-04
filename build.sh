#!/bin/bash

echo "Injecting environment variables..."

cp ./src/environments/environment.prod.template.ts ./src/environments/environment.prod.ts

sed -i "s|\$GH_USER|${GH_USER}|g" ./src/environments/environment.prod.ts
sed -i "s|\$GH_REPO|${GH_REPO}|g" ./src/environments/environment.prod.ts
sed -i "s|\$GH_BRANCH|${GH_BRANCH}|g" ./src/environments/environment.prod.ts

npm run ng build --configuration=production

cp ./_redirects ./dist/osm/browser/