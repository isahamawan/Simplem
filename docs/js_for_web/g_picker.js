// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
//var developerKey = key_config.api_key;

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = key_config.api_account;

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = "328742933346";

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive.file'];

var pickerApiLoaded = false;
var oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
    gapi.load('auth', { 'callback': onAuthApiLoad });
    gapi.load('picker', { 'callback': onPickerApiLoad });
}

function onAuthApiLoad() {
    window.gapi.auth.authorize(
        {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        },
        handleAuthResult);
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

function handleAuthResult(authResult) {

    //console.log(authResult);

    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        var docs_view = new google.picker.DocsView(google.picker.ViewId.DOCS);

        docs_view.setMimeTypes("text/plain,application/vnd.google-apps.folder")
            .setParent(window.simplem_folder_id)//simplem folder id
            //.setIncludeFolders(true)
            .setLabel('Google Drive > Simplem')
            .setMode(google.picker.DocsViewMode.LIST);//list形式で表示


        /*
        var docsshare = new google.picker.DocsView()
            .setOwnedByMe(false)
            .setIncludeFolders(true)
            .setSelectFolderEnabled(true);

        var recentView = new google.picker.DocsView();
        recentView.xd = '最近使用したファイル';
        */

        var picker = new google.picker.PickerBuilder()
            //.enableFeature(google.picker.Feature.NAV_HIDDEN)
            //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            //.setOrigin (google.script.host.origin)
            .setTitle("ファイルを開く")//
            .setLocale("ja")//日本語設定
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(docs_view)
            //.addView(docsshare)//共有ファイルビュー
            //.addView(recentView)//最近使用したファイルビュー
            //.addView(new google.picker.DocsUploadView())//
            //.setDeveloperKey(developerKey)//
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

// A simple callback implementation.
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {

        //pickしたファイルのid等（_nowは上書き保存にも使用）
        window.fileId_now = data.docs[0].id;
        window.picked_parentId = data.docs[0].parentId;
        window.file_name_now = data.docs[0].name;

        //ファイルのgetとエディタへの読み込み
        gapi.client.drive.files.get({
            fileId: window.fileId_now,
            alt: "media"//bodyを含める
        }).then(
            async function (res) {
                //console.log(res);


                //file_nameテキストボックスの更新
                document.getElementById("file_name").value = data.docs[0].name;

                //file_name_gdriveテキストボックスの更新
                document.getElementById("file_name_gdrive").value = data.docs[0].name;

                //titleの変更
                document.getElementsByTagName("title")[0].innerText = data.docs[0].name + " - Simplem";

                //diffのオリジナル用として保存
                window.diff_origin_text_data = res.body;

                easyMDE.value(res.body);
            }
        );
    }
}
