/**
 * ステータス型：インターフェイス
 */
interface statuses {
    NOT_START: {id: number, value: string};
    DOING: {id: number, value: string};
    COMPLETED: {id: number, value: string};
}
/**
 * ステータス値一覧
 */
export const statuses = {
    NOT_START: {id: 0, value: "未実施"},
    DOING: {id: 1, value: "実行中"},
    COMPLETED: {id: 2, value: "完了"}
}

// // アイテム型：インターフェイス
// export interface  items {
//     id: number;
//     content: string,
//     limit: Date,
//     state: string,
//     onEdit: boolean,
// }