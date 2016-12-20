# copy to folder path package

ツリービューに追加したプロジェクトフォルダごとに設定したフォルダパスにコピーするパッケージ

+ UNCパスにもコピー可能 そのため共有サーバへもコピー可能

 + \\\\test\\folder → OK
 + \\\\192.0.0.1\\folder → OK
 + C:\\test\\folder



+ Configure Copy Path
 + 保存先を設定するウインドウを表示する。
 + .copy-to-folder-path.json でプロジェクトフォルダのルートに作成される。


+ Copy To Path
 + .copy-to-folder-path.jsonで設定したフォルダへコピーを実施する。
 + .copy-to-folder-path.jsonがない場合は保存先を設定するウインドウを表示する。
 + プロジェクトフォルダの中のファイルを設定したフォルダのパスの中にコピーする。
