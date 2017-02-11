# copy to folder path

ツリービューに追加したプロジェクトフォルダごとに設定したフォルダパスにコピーするパッケージ  
上書きコピーしかしないため、プロジェクトの中で削除したファイル等はコピー先に残ります。  
Windowsでしか動きません。  

![image](https://raw.githubusercontent.com/OHM79/copy-to-folder-path/image/Readme.gif)

+ UNCパスにもコピー可能 そのため共有サーバへもコピー可能
 + \\\\test\\folder
 + \\\\192.0.0.1\\folder
 + C:\\test\\folder


+ Configure Copy Path
 + 保存先を設定するウインドウを表示する。
 + .copy-to-folder-path.json でプロジェクトフォルダのルートに作成される。


+ Copy To Path (Ctrl+ALt+D)
 + .copy-to-folder-path.jsonで設定したフォルダへコピーを実施する。
 + .copy-to-folder-path.jsonがない場合は保存先を設定するウインドウを表示する。
 + プロジェクトフォルダの中のファイルを設定したフォルダのパスの中にコピーする。
