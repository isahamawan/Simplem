

Gdfs.loadApi(key_config.api_account, key_config.api_key);
let gdrive_instance = new Gdfs();



async function gdrive_init_for_simplem() {

    //gapiロード終わって、定義成功するまでリトライ処理
    let init_complete = false;
    let err_count = 0;
    const maxTries = 50;
    while (init_complete === false) {
        try {
            // リクエスト処理

            await sleep(1000);
            await gdrive_instance.mkdir("Simplem");
            await gdrive_instance.chdir("Simplem");

            init_complete = true;

            console.log("gdrive_init_for_simplem : complete");

            //gd関連ボタンの表示
            document.getElementById("gd_disabled").setAttribute("style", "display:none;");
            document.getElementById("gd_enabled").setAttribute("style", "display:block;");

            alert("Google Driveと連携しました");

        } catch (err) {
            // エラーハンドリング

            err_count = err_count + 1;
            console.log("gdrive_init_for_simplem : retry");

            if (err_count === maxTries) {
                init_complete = true;
                console.log("gdrive_init_for_simplem : time out (50 tried)");
                alert("Google Driveとの連携に失敗しました（タイムアウト）");
            }

        }
    }


    window.simplem_folder_id = gdrive_instance.getCurrentFolderId();
}

//gdrive_init_for_simplem();//あとで、google driveへの連携有効かボタン押したときに実行するようにする





/*
gdrive_instance.mkdir("Simplem");
gdrive_instance.chdir("Simplem");
window.simplem_folder_id = gdrive_instance.getCurrentFolderId();
*/

/*

    gdrive_instance.writeFile("simplem/test.md", "text/plain", easyMDE.value());


    gdrive_instance.readFile("simplem/tesw.md").then(
        function (value) {

            // ここでプロミスオブジェクトの中身をああだこうだする。
            //console.log(value);
            easyMDE.value(value);
        });
*/

/*

/**
         * Create a new file's resource.
         * @param {string} folderId The folder id where the file is created.
         * @param {string} filename The file name.
         * @param {string} mimeType The mime type for the new file.
         * @returns {Promise<object>} The response of the API.


Gdfs.createFile = async (folderId, filename, mimeType) => {
    const response = await requestWithAuth("POST", "https://www.googleapis.com/drive/v3/files", {}, {
        "Content-Type": "application/json"
    }, JSON.stringify({
        name: filename,
        mimeType: mimeType,
        parents: [folderId]
    }));
    return JSON.parse(response);
};


Gdfs.updateFile = async (fileId, mimeType, data) => {
    const response = await requestWithAuth("PATCH", "https://www.googleapis.com/upload/drive/v3/files/" + fileId, {
        uploadType: "media"
    }, {
        "Content-Type": mimeType
    }, data);
    return JSON.parse(response);
 };


const file = await Gdfs.createFile(parentFolder.id, filename, mimeType);
const result = await Gdfs.updateFile(file.id, mimeType, data);


gapi.client.drive.files.list({q:"mimeType ='text/plain' and name contains 'ai'"}).then(
    function(re){
        console.log(re)
    });

gapi.client.drive.files.list({q:"mimeType ='text/plain' or mimeType ='application/vnd.google-apps.folder'"}).then(function(re){console.log(re)})
gapi.client.drive.files.list({q:"mimeType ='text/plain' and window.simplem_folder_id in parents"}).then(function(re){console.log(re)})

gapi.client.drive.files.list({q:"mimeType ='text/plain' and '1kKSL2hrL29k7DswP-Bf3Yx-1tnUEyQC4' in parents and trashed = false"}).then(function(re){console.log(re)})
*/





/* ファイル階層を表示した上での 名前を付けて保存 下書き


gapi.client.drive.files.list({q:"mimeType ='text/plain' and '1kKSL2hrL29k7DswP-Bf3Yx-1tnUEyQC4' in parents and trashed = false"}).then(function(re){console.log(re)})

//事前にファイル名input boxを用意しておく


//simplemフォルダ以下のフォルダとtextファイルを取得

//フォルダをクリックした場合、そのフォルダ以下のフォルダとtextファイルを取得

//textファイルをクリックした場合、そのtextファイルのidを取得し、保存ボタンを押したら、上書きモードで処理（input boxのテキストも更新）

//何もクリックしないで保存ボタンを押したら、現在のフォルダのidで新規作成モードで処理（input boxのテキストをファイル名とする）
////新規作成保存の前にinput box内のファイル名で、現在フォルダのファイルを検索し、該当があればそのidで上書き保存処理。なければ新規作成保存処理。

*/


