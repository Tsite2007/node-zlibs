var fs = require('fs');     //引入fs模块
var archiver = require('archiver');
var AdmZip = require('adm-zip');

var filePath = 'C:/Users/qingk/Desktop/test/src/' //获取文件路径
// // var dirList = fs.readdirSync(filePath); //获取文件列表
var zipPath = 'C:/Users/qingk/Desktop/test/src.zip';


var level = 9;
//创建最终打包文件的输出流
var output = fs.createWriteStream(zipPath);
//生成archiver对象，打包类型为zip
var archive = archiver('zip', {
    zlib: {
        level: level
    }
});
// dirList.forEach(item=>{
//     archive.append(fs.createReadStream(filePath+item), {'name': item});
// })

//直接压缩文件夹
archive.directory(filePath, false);
archive.pipe(output); //将打包对象与输出流关联
//监听所有archive数据都写完
output.on('close', function() {
    console.log('压缩完成', archive.pointer() / 1024 / 1024 + 'M');
    // printData();
    readZip();
});
archive.on('error', function(err) {
    throw err;
});
//打包
archive.finalize();





//不解压的情况下读取相关文件
function printData(){
    var zip = new AdmZip(zipPath);
    var zipEntries = zip.getEntries();
    console.log(zipEntries);
    zipEntries.forEach((item) => {
        if(item.name=="a.txt")console.log(item.getData().toString());
        if (item.isDirectory == false) {
            console.log(item.getData().toString());
            // this.text = item.getData().toString();
        }
    });
}






// 使用Chilkat（选择操作系统及工具）(貌似还收费)
// Chilkat官方示例：https://www.example-code.com/nodejs/zip_passwordProtect1.asp
// Chilkat关于zip的API：https://www.chilkatsoft.com/refdoc/nodejsZipRef.html
var os = require('os');
console.log(os.platform());
if (os.platform() == 'win32') {
    var chilkat = require('chilkat_node10_win32');
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('chilkat_node10_arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('chilkat_node10_linux32');
    } else {
        var chilkat = require('chilkat_node10_linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('chilkat_node10_macosx');
}

function chilkatExample() {
    var zip = new chilkat.Zip();
    var success;
    //  Any string unlocks the component for the 1st 30-days.
    success = zip.UnlockComponent("Anything for 30-day trial");
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }
    success = zip.NewZip(zipPath);
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }

    zip.SetPassword("00000");
    zip.PasswordProtect = true;

    var saveExtraPath;
    saveExtraPath = true;
    success = zip.AppendOneFileOrDir(zipPath,saveExtraPath);
    console.log(success);
    var success = zip.WriteZipAndClose();
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }
}
