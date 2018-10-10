'use strict';
const fs = require('fs'); //fs:filesystemの略で、ファイルを扱うモジュール
const readline = require('readline'); //readlineはファイルを１行ずつ読み込むモジュール
const rs = fs.ReadStream('./popu-pref.csv'); //「popu-pref.csv」からファイルの読み込みを行うStreamを生成
const rl = readline.createInterface({ 'input': rs, 'output': {} }); //それ(fs)をreadlineオブジェクトのinputとして設定し「rl」オブジェクトを作成
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト で集計される連想配列
rl.on('line', (lineString) => {
    const columns = lineString.split(','); //「lineString」で取得した文字列をカンマで分割して配列に入れる
    const year = parseInt(columns[0]); //parseIntで文字列を整数に変換
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }  //valueの値がFalsyなら(その県のデータを取るのが初めてなら)valueに初期値となるオブジェクトを代入する
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});
//「rl」オブジェクトで「line」というイベントが発生したらこの無名関数を呼んでください、という意味
//「line」は「/n」を見つけると発火し、その行を因数として取得する
//無名関数の処理の中で「console.log」を使っているので、「line」イベントが発生したタイミングでコンソールに引数「lineString」の内容が出力
//この「lineString」には、読み込んだ１行の文字列が入っている
rl.resume();
//最後に「resume」メソッドを呼び出し、ストリームに情報を流し始める
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    // for-of構文は、MapやArrayの中身をofの前に与えられた変数に代入してforループと同じことができる
    // 配列に含まれる要素を使いたいだけで添字は不要な場合に便利
    // Mapにfor-ofを使うと、キーと値で要素が２つある配列が前に与えられた変数に代入される
    // この場合、pair[0]でキーである都道府県名、pair[1]で値である集計オブジェクトが得られる
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // Array.from(map)の部分で連想配列を普通の配列に変換する処理を行っている
    // Arrayの「sort」関数を呼んで無名関数を渡し、
    //pair2がpair1より大きいときに正の整数を返す
    const rankingStrings = rankingArray.map((pair, i) => {
        return (i + 1)+ '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    }); // Arrayのmap関数に渡す無名関数に第２引数を書くと、各要素のも取得できる
    console.log(rankingStrings);
}); // map関数で、Array要素のそれぞれを、与えられた関数を適用した内容に変換する
// closeイベントはすべての行を読み込み終わった際に呼び出される
// その際の処理として、各県各年男女の集計されたMapのオブジェクトを出力しています



