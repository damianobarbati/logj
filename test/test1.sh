node -r ./index.js test/test.js > test/test1-actual.txt 2>&1
cmp test/test1-actual.txt test/test1-expected.txt
