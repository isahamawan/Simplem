

Gdfs.loadApi(key_config.api_account, key_config.api_key);
let gdrive_instance = new Gdfs();

async function gdrive_init_for_simplem() {
    await sleep(1000);
    await gdrive_instance.mkdir("Simplem");
    await gdrive_instance.chdir("Simplem");
    window.simplem_folder_id = gdrive_instance.getCurrentFolderId();
}

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