'use strict';
const fs = require('fs'); //fs:filesystemの略で、ファイルを扱うモジュール
const readline = require('readline'); //readlineはファイルを１行ずつ読み込むモジュール
const rs = fs.ReadStream('./popu-pref.csv'); //「popu-pref.csv」からファイルの読み込みを行うStreamを生成
const rl = readline.createInterface({ 'input': rs, 'output': {} }); //それ(fs)をreadlineオブジェクトのinputとして設定し「rl」オブジェクトを作成
rl.on('line', (lineString) => {
    const columns = lineString.split(','); //「lineString」で取得した文字列をカンマで分割して配列に入れる
    const year = parseInt(columns[0]); //parseIntで文字列を整数に変換
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        console.log(year);
        console.log(prefecture);
        console.log(popu);
    }
});
rl.resume();
//「rl」オブジェクトで「line」というイベントが発生したらこの無名関数を呼んでください、という意味
//「line」は「/n」を見つけると発火し、その行を因数として取得する
//無名関数の処理の中で「console.log」を使っているので、「line」イベントが発生したタイミングでコンソールに引数「lineString」の内容が出力
//この「lineString」には、読み込んだ１行の文字列が入っている
//最後に「resume」メソッドを呼び出し、ストリームに情報を流し始める
