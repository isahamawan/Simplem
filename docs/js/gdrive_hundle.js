

Gdfs.loadApi(key_config.api_account, key_config.api_key);
let gdrive_instance = new Gdfs();

async function gdrive_init_for_simplem() {

    //gapiロード終わって、定義成功するまでリトライ処理
    let execed = false;
    let count = 0;
    const maxTries = 50;
    while (execed === false) {
        try {
            execed = true;
            // リクエスト処理

            await sleep(1000);
            await gdrive_instance.mkdir("Simplem");
            await gdrive_instance.chdir("Simplem");

            console.log("gdrive_init_for_simplem : complete");

        } catch (err) {
            count = count + 1;
            execed = false;

            console.log("gdrive_init_for_simplem : retry");
            // エラーハンドリング
            if (count === maxTries) {
                execed = true;
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