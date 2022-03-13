

Gdfs.loadApi(key_config.api_account, key_config.api_key);
let gdrive_instance = new Gdfs();

async function gdrive_init_for_simplem() {

    //gapiロード終わって、定義成功するまでリトライ処理
    let complete = false;
    let count = 0;
    const maxTries = 50;
    while (complete === false) {
        try {
            // リクエスト処理

            await sleep(1000);
            await gdrive_instance.mkdir("Simplem");
            await gdrive_instance.chdir("Simplem");

            complete = true;

            console.log("gdrive_init_for_simplem : complete");

        } catch (err) {
            // エラーハンドリング

            count = count + 1;
            console.log("gdrive_init_for_simplem : retry");

            if (count === maxTries) {
                complete = true;
                console.log("gdrive_init_for_simplem : time out (50 tried)");
            }

        }
    }


    window.simplem_folder_id = gdrive_instance.getCurrentFolderId();
}

gdrive_init_for_simplem();





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

*/
