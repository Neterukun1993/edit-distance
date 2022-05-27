function reversed(string) {
    return string.split("").reverse().join("");
}


function calcLevenshteinDistance(srcString, dstString) {
    const srcLen = srcString.length;
    const dstLen = dstString.length;
    const INF = 10 ** 10;

    let dp = new Array(srcLen + 1);

    for (let i = 0; i < srcLen + 1; i++) {
        dp[i] = new Array(dstLen + 1).fill(INF);
    }
    for (let i = 0; i < srcLen + 1; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j < dstLen + 1; j++) {
        dp[0][j] = j;
    }

    for (let i = 0; i < srcLen; i++) {
        for (let j = 0; j < dstLen; j++) {
            if (srcString[i] == dstString[j]) {
                // do nothing
                dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], dp[i][j]);
            } else {
                // substitute 
                dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], dp[i][j] + 1);
            }
            // delete
            dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], dp[i][j + 1] + 1);
            // insert
            dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], dp[i + 1][j] + 1);
        }
    }
    return dp;
}


function calcSeqAlinement(srcString, dstString, dp) {
    let alined_s = "";
    let alined_d = "";
    let i = srcString.length;
    let j = dstString.length;

    while (i != 0 || j != 0) {
        if (i == 0) {
            alined_s += "-";
            alined_d += dstString[j - 1];
            j -= 1;
        } else if (j == 0) {
            alined_s += srcString[i - 1];
            alined_d += "-";
            i -= 1;
        } else if (srcString[i - 1] == dstString[j - 1] && dp[i][j] == dp[i - 1][j - 1]) {
            alined_s += srcString[i - 1];
            alined_d += dstString[j - 1];
            i -= 1;
            j -= 1;
        } else if (srcString[i - 1] != dstString[j - 1] && dp[i][j] == dp[i - 1][j - 1] + 1) {
            alined_s += srcString[i - 1];
            alined_d += dstString[j - 1];
            i -= 1;
            j -= 1;
        } else if (dp[i][j] == dp[i - 1][j] + 1) {
            alined_s += srcString[i - 1];
            alined_d += "-";
            i -= 1;
        } else if (dp[i][j] == dp[i][j - 1] + 1) {
            alined_s += "-";
            alined_d += dstString[j - 1];
            j -= 1;
        }
    }
    return [reversed(alined_s), reversed(alined_d)];
}


function deleteStatementHTML(str, index) {
    return `<p>${str.slice(0, index)}<span class="delete">${str[index]}</span>${str.slice(index + 1)}<\p>`;
}


function insertStatementHTML(str, index) {
    return `<p>${str.slice(0, index)}<span class="insert">&nbsp;</span>${str.slice(index)}<\p>`;
}


function replaceStatementHTML(str, index) {
    return `<p>${str.slice(0, index)}<span class="substitute">${str[index]}</span>${str.slice(index + 1)}<\p>`;
}


function showResult(srcString, dstString) {
    let dp = calcLevenshteinDistance(srcString, dstString);
    let [a1, a2] = calcSeqAlinement(srcString, dstString, dp);

    let result = document.getElementById('result');
    result.innerHTML = "";
    result.innerHTML += `<p>${srcString} と ${dstString} の編集距離は ${dp[srcString.length][dstString.length]} です。<\p>`;

    let index = 0;
    let str = srcString;
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] == a2[i]) {
            index += 1;
            continue;
        } else if (a1[i] == "-") {
            result.innerHTML += insertStatementHTML(str, index);
            result.innerHTML += `↓ insert ${a2[i]}`;
            str = str.slice(0, index) + a2[i] + str.slice(index);
            index += 1;
        } else if (a2[i] == "-") {
            result.innerHTML += deleteStatementHTML(str, index);
            result.innerHTML += `↓ delete ${a1[i]}`;
            str = str.slice(0, index) + str.slice(index + 1);
        } else {
            result.innerHTML += replaceStatementHTML(str, index);
            result.innerHTML += `↓ replace ${a1[i]} with ${a2[i]}`;
            str = str.slice(0, index) + a2[i]+ str.slice(index + 1);
            index += 1;
        }
    }
    result.innerHTML += `<p>${str}<\p>`;
}