


//一つまえのカーソルがアクティブだった場所をグローバル保存（シャープ表示テスト用）
let arr_cur_pos = [{ init: null }];
let arr_mark_state = [{ init: null }];
let arr_native_cm_mark_state = [null];

easyMDE.codemirror.on('cursorActivity', function () {

    //アルゴリズム
    //1 getstate.bold=trueならその行にactiveクラス（#や**を表示）追加。
    //2 カーソル移動ごとに一つ前のカーソルの行のmarkをクリア。（一つ前の行が今の行と同じならばクリア無し）

    //現在のカーソル位置の位置情報とマーク情報を取得
    let cur_pos = easyMDE.codemirror.getCursor();
    //console.log(cur_pos);//開発用 カーソル位置検出

    let mark_state = easyMDE.getState();
    //console.log(mark_state);//開発用 カーソル位置のマーク検出



    //現在のカーソル位置の行のactive-lineマークの有無を確認するため、ネイティブcmからマークを取得
    let native_cm_mark_state
    if (easyMDE.codemirror.getLineHandle(cur_pos.line).markedSpans) {
        native_cm_mark_state = easyMDE.codemirror.getLineHandle(cur_pos.line).markedSpans[0].marker.className;
    } else {
        native_cm_mark_state = null;
    }
    //console.log(native_cm_mark_state);


    //一つまえのカーソル位置の、位置情報とマーク情報を取得（現在のカーソル位置情報も保管。先入れ後出し）
    arr_cur_pos.unshift(cur_pos);
    let cur_pos_previous = arr_cur_pos.pop();

    arr_mark_state.unshift(mark_state);
    let mark_state_previous = arr_mark_state.pop();




    //カーソル位置がマークの時に、ライブプレビュー(active-lineクラス追加)。
    if ((mark_state.bold || mark_state.heading || mark_state.strikethrough || mark_state.code || mark_state["unordered-list"] || mark_state["ordered-list"] || mark_state.quote || mark_state.italic) && (native_cm_mark_state != "active-line")) {
        //easyMDE.codemirror.markText({ line: cur_pos.line, ch: 0 }, { line: cur_pos.line + 1, ch: 0 }, { className: "active-line", clearOnEnter: true });//フラグ無しでやるならこっち
        easyMDE.codemirror.markText({ line: cur_pos.line, ch: 0 }, { line: cur_pos.line, ch: null }, { className: "active-line", inclusiveRight: true, inclusiveLeft: false });//chの0 to null　で行指定
    }


    //マーク追加後の 現在のカーソル位置の行のactive-lineマークの有無の更新確認（ネイティブcmからマークを取得）
    if (easyMDE.codemirror.getLineHandle(cur_pos.line).markedSpans) {
        native_cm_mark_state = easyMDE.codemirror.getLineHandle(cur_pos.line).markedSpans[0].marker.className;
    } else {
        native_cm_mark_state = null;
    }


    arr_native_cm_mark_state.unshift(native_cm_mark_state);
    let native_cm_mark_state_previous = arr_native_cm_mark_state.pop();
    //console.log(native_cm_mark_state);


    //マークのクリア（直前のカーソル位置がマークの場合に実行）
    if (mark_state_previous.heading || mark_state_previous.bold || mark_state_previous.strikethrough || mark_state_previous.code || mark_state_previous["unordered-list"] || mark_state_previous["ordered-list"] || mark_state_previous.quote || mark_state_previous.italic) {

        //マークのクリア（現在のカーソル位置がマーク無しの場合に実行）
        if ((((!mark_state.heading) && (!mark_state.bold) && (!mark_state.strikethrough) && (!mark_state.code) && (!mark_state["unordered-list"]) && (!mark_state["ordered-list"]) && (!mark_state.quote) && (!mark_state.italic)) || (cur_pos.line != cur_pos_previous.line)) && (native_cm_mark_state_previous == "active-line")) {
            try {
                easyMDE.codemirror.findMarksAt({ line: cur_pos_previous.line, ch: cur_pos_previous.ch })[0].clear();
            } catch (er) {
                //想定外のエラー時に一旦マーク状態を全てリセットして編集を継続できるようにする
                console.log(er.message);
                let all_marks = easyMDE.codemirror.getAllMarks();
                for (let i = 0; i < all_marks.length; i++) {
                    all_marks[i].clear();
                }

            }
        }

        //ヘッダーのマークのクリア
        //if (((!mark_state.heading) || (cur_pos.line != cur_pos_previous.line)) && (flg_active_line == true)) {
        //    easyMDE.codemirror.findMarksAt({ line: cur_pos_previous.line, ch: cur_pos_previous.ch })[0].clear();
        //    flg_active_line = !flg_active_line;
        //}
    }



    //テキストマーク追加
    //easyMDE.codemirror.markText({ line: 0, ch: 0 }, { line: 1, ch: 0 }, { className: "hhhhasdf" });

    //テキストマーククリア
    //easyMDE.codemirror.findMarksAt({ line: easyMDE.codemirror.getCursor().line, ch: easyMDE.codemirror.getCursor().line })[0].clear();


});
