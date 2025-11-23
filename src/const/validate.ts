/**
 * validationチェックの処理をまとめたクラス
 */
export class validate{
    /**
     * 簡易入力値チェック
     * @param inputText: 入力値：タスク(string)
     * @param inputDate: 入力値：日付　(string)
     * @return 型チェックの結果
    */
    public static checkInputValidation(inputText: string, inputDate: string): boolean{
        let flg: boolean = true;
        // 入力値チェック
        flg = this.checkEmpty(inputText, inputDate);
        return flg;
    }

    /**
     * 入力値チェック
     * @param {...string[]} 入力値(string)
     * @returns チェックの結果：入力値あり true / 入力値なし false
     */
    public static checkEmpty(...a:string[]): boolean{
        let flg: boolean = true;
        a.forEach(e => {
            if (e == null || e == "" || e == undefined){
                flg = false;
            }
        });
        return flg;
    }
}