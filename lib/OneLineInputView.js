'use babel';
import fs from 'fs-plus';

export default class OneLineInputView {

	callback: null;
	element: null;
	editorElement: null;
	editor: null;

	constructor(serializedState, placeText) {
		console.log("OneLineInputView constructor go ");
		console.log(serializedState);
		console.log(placeText);
		var self;
		if (placeText == null) {
			placeText = '\\\\共有サーバー\\myFolder\\test';
		}
		console.log(this.escapeListener);
		this.escapeListener = this.bind(this.escapeListener, this);

		// Create root element
		this.element = document.createElement('div');
		this.element.classList.add('copy-to-folder-path');

		const message = document.createElement('div');
		message.innerHTML = 'コピー先のフォルダパスを指定してください。<br>そのフォルダにプロジェクトの中のファイルをコピーします。';
		message.classList.add('message');
		this.element.appendChild(message);

		this.editorElement = document.createElement('atom-text-editor');
		this.editor = atom.workspace.buildTextEditor({
			mini: true,
			lineNumberGutterVisible: false,
			placeholderText: placeText
		});
		this.editorElement.setModel(this.editor);
		self = this;
		this.editorElement.onkeydown = function(e) {
			var value;
			if (e.key === 'Enter') {
				console.log("Enter key go");
				value = self.editor.getText();
				self.clearText();
				self.hidePanel();
				return typeof self.callback === "function" ? self.callback(value) : void 0;
			}
		};
		this.element.appendChild(this.editorElement);

		console.log(this);
	}

	bind(fn, me) {
		return function() {
			return fn.apply(me, arguments);
		};
	}

	showPanel() {
		console.log("inputPanel表示");
		console.log(this.panel);
		if (this.panel == null) {
			this.panel = atom.workspace.addModalPanel({
				item: this.element
			});
		}
		this.clearText();
		if (fs.isFileSync(this.getJsonPath())) {
			// 設定ファイルが存在する
			var readjson = this.readConfigJson();
			writePath = readjson.CopyToPath; //転送先を読み込む
			this.editor.setText(writePath); // すでに設定されているパスを初期値をして入力
		} else {
			// 設定ファイルが存在しない
		}

		this.panel.show();
		window.addEventListener('keydown', this.escapeListener, true);
		return this.focus();
	}

	hidePanel() {
		var base;
		return typeof(base = this.panel).hide === "function" ? base.hide() : void 0;
	}

	escapeListener(e) {
		// escapeキーでパネルを閉じる
		console.log("escapeListener go");
		var keystroke;
		keystroke = atom.keymaps.keystrokeForKeyboardEvent(e);
		if (keystroke === 'escape') {
			this.hidePanel();
			return window.removeEventListener('keydown', this.escapeListener, true);
		}
	}

	createJson(inputPath) {
		console.log("createJson call");
		var configPath = this.getJsonPath(); // 設定ファイルのパスを取得
		console.log(configPath);
		var data = {
			CopyToPath: inputPath,
		};
		fs.writeFile(configPath, JSON.stringify(data, null, '    ')); // Jsonの作成処理
	}

	// 各プロジェクトにある設定ファイルのパスを読み込む
	getJsonPath() {
		let projectPath = this.getOpenCurrentProjectPath();
		let configPath = path.join(projectPath, atom.config.get('copy-to-folder-path.configFileName'));
		console.log(`Jsonのパス :${configPath}`);
		return configPath;
	}

	// 現在開いているプロジェクトのパスを取得する
	getOpenCurrentProjectPath() {
		var editor, file, filepath, projectPath, ref, ref2, relativePath;
		editor = atom.workspace.getActivePaneItem();
		file = editor !== null ? (ref = editor.buffer) !== null ? ref.file : void 0 : void 0;
		filepath = file !== null ? file.path : void 0;
		if (filepath) {
			ref2 = atom.project.relativizePath(filepath);
			projectPath = ref2[0];
			relativePath = ref2[1];
		} else {
			console.error("error filepath : " + filepath);
		}
		return projectPath;
	}

	// 各プロジェクトにある設定ファイルのJsonの中身を取得
	readConfigJson() {
		let configPath = this.getJsonPath();
		let readjson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		return readjson;
	}

	// Returns an object that can be retrieved when package is activated
	serialize() {}

	// Tear down any state and detach
	destroy() {
		this.element.remove();
	}

	getElement() {
		console.log("getElement go");
		return this.element;
	}

	focus() {
		console.log("focus go");
		this.editorElement.focus();
		return this.selectAll();
	}

	selectAll() {
		console.log("selectAll go");
		return this.editor.selectAll();
	}

	clearText() {
		console.log("clearText go");
		return this.editor.setText('');
	}

	setCallback(callback) {
		console.log("setCallback go");
		return this.callback = callback;
	}

}

exports.default = OneLineInputView;
