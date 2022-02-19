
function addDarkmodeWidget() {
    const options = {
        bottom: '4px', // default: '32px'
        right: 'unset', // default: '32px'
        left: '5px', // default: 'unset'
        time: '0s', // default: '0.3s' cssでnoneに設定中
        mixColor: '#fff', // default: '#fff'
        backgroundColor: '#fff',  // default: '#fff'
        buttonColorDark: '#fff',  // default: '#100f2c'
        buttonColorLight: '#100f2c', // default: '#fff'
        saveInCookies: true, // default: true,
        label: '🌓', // default: ''
        autoMatchOsTheme: false // default: true
    }
    const darkmode = new Darkmode(options);
    darkmode.showWidget();
}
addDarkmodeWidget();
    //window.addEventListener('load', addDarkmodeWidget);
