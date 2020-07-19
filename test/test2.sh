LOGJ=m node -r ./index.js test/test.js > test/test2-actual.txt 2>&1
cmp <(jq -c '. | del(.time)' test/test2-actual.txt) <(jq -c '. | del(.time)' test/test2-expected.txt)
