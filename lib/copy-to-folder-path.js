(function() {
	var exec, open_terminal, getOpenCurrentProjectPath, path, platform, fs, CompositeDisposable, CopyToFolderPathView;
	exec = require('child_process').exec; // 非同期で動作
	// exec = require('child_process').execSync; // 同期動作
	// path = require('path'); //
	path = require('path');
	platform = require('os').platform;
	fs = require("fs-plus");
	// CopyToFolderPathView = require("./copy-to-folder-path-view");


	CompositeDisposable = null;
	// copyToFolderPathView = null;
	// modalPanel = null;
	// subscriptions = null;

	open_terminal = function(dirpath) {
		console.log(dirpath);
		var args, cmdline, runDirectly, setWorkingDirectory, surpressDirArg;
		app = atom.config.get('copy-to-folder-path.app');
		// var packagePath = atom.packages.resolvePackagePath("copy-to-folder-path");
		// args = atom.config.get('copy-to-folder-path.args');
		args = "転送先の予定";
		args = "C:\\Users\\RYU\\Desktop\\testtest";
		setWorkingDirectory = atom.config.get('copy-to-folder-path.setWorkingDirectory');
		surpressDirArg = atom.config.get('copy-to-folder-path.surpressDirectoryArgument');
		runDirectly = atom.config.get('copy-to-folder-path.MacWinRunDirectly');
		cmdline = "\"" + app + "\" " + args;
		if (!surpressDirArg) {
			cmdline += " \"" + dirpath + "\"";
		}
		if (platform() === "darwin" && !runDirectly) {
			cmdline = "open -a " + cmdline;
		}
		if (platform() === "win32" && !runDirectly) {
			cmdline = "start \"\" " + cmdline;
		}
		console.log("copy-to-folder-path executing: ", cmdline);
		if (setWorkingDirectory) {
			if (dirpath !== null) {
				return exec(cmdline, {
					cwd: dirpath
				}, function(error, stdout, stderr) {
					console.log('-------cmd end-------');
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (error !== null) {
						console.log('exec error: ' + error);
					}
				});
			}
		} else {
			if (dirpath !== null) {
				return exec(cmdline);
			}
		}
	};

	getOpenCurrentProjectPath = function() {
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
	};

	module.exports = {
		copyToFolderPathView: null,
		// CompositeDisposable: null,
		modalPanel: null,
		subscriptions: null,

		activate: function(state) {
			console.log(state);
			// this.copyToFolderPathView = new CopyToFolderPathView(state.copyToFolderPathViewState);
			// this.modalPanel = atom.workspace.addModalPanel({
			// 	item: this.copyToFolderPathView.getElement(),
			// 	visible: false
			// });

			if (CompositeDisposable === null) {
				CompositeDisposable = require('atom').CompositeDisposable;
			}
			subscriptions = new CompositeDisposable;

			// Register command that toggles this view
			subscriptions.add(atom.commands.add('atom-workspace', {
				'copy-to-folder-path:CopyToPath': () => this.sendFileCurrentProjectPath(),
				'copy-to-folder-path:ConfigureCopyPath': () => this.CreateConfigFile(),
				'copy-to-folder-path:toggle': () => this.toggle(),
			}));


		},

		sendFileCurrentProjectPath: function() {
			// 現在開いているファイルのルートプロジェクトを開く
			var projectPath = getOpenCurrentProjectPath();
			if (projectPath !== null) {
				// projectPathはツリーに追加されていないファイルの場合はNullになる
				return open_terminal(projectPath);
			}
			return;

		},

		sendAllProjectPath: function() {
			// ツリーに追加されているすべてのプロジェクトを開く
			var i, len, pathname, ref, results;
			ref = atom.project.getPaths();
			ref2 = atom.project.getDirectories();
			console.log(ref);
			console.log(ref2);
			results = [];
			for (i = 0, len = ref.length; i < len; i++) {
				pathname = ref[i];
				results.push(open_terminal(pathname));
			}
			return results;
		},

		sendFilePath: function() {
			// 現在開いているファイルのパスを開く(ファイルのパスは含めない)
			var editor, file, filepath, ref;
			editor = atom.workspace.getActivePaneItem();
			file = editor !== null ? (ref = editor.buffer) !== null ? ref.file : void 0 : void 0;
			filepath = file !== null ? file.path : void 0;
			if (filepath) {
				console.log(path.dirname());
				return open_terminal(path.dirname(filepath));
			}
		},

		CreateConfigFile: function() {
			console.log("ConfigureCopyPath go");
			var projectPath = getOpenCurrentProjectPath();
			if (projectPath !== null) {
				// projectPathはツリーに追加されていないファイルの場合はNullになる
				console.log(projectPath);
				console.log(atom.config.get('copy-to-folder-path.configFileName'));
				var configPath = path.join(projectPath, atom.config.get('copy-to-folder-path.configFileName'));
				console.log(configPath);
				if (!fs.existsSync(configPath)) { //configPath のファイルが存在しな時False
					return;
				}
				// return new RemoteSync(projectPath, configPath);
			}
			return;
		},

		toggle: function() {
			// console.log('CopyToFolderPath was toggled!');
			// return (
			// 	this.modalPanel.isVisible() ?
			// 	this.modalPanel.hide() :
			// 	this.modalPanel.show()
			// );

			var ref, ref1;
			if (this.subscriptions == null) {
				this.enabled();
				return (ref = atom.notifications) != null ? ref.addSuccess('opyToFolderPath: on') : void 0;
			} else {
				this.disabled();
				return (ref1 = atom.notifications) != null ? ref1.addSuccess('opyToFolderPath: off') : void 0;
			}
		},

	};

	if (platform() === 'darwin') {
		module.exports.config = {
			app: {
				type: 'string',
				"default": 'Terminal.app'
			},
			args: {
				type: 'string',
				"default": ''
			},
			surpressDirectoryArgument: {
				type: 'boolean',
				"default": true
			},
			setWorkingDirectory: {
				type: 'boolean',
				"default": true
			},
			MacWinRunDirectly: {
				type: 'boolean',
				"default": false
			},
			configFileName: {
				type: 'string',
				"default": '.copy-to-folder-path.json'
			}
		};
	} else if (platform() === 'win32') {
		var packagePath = atom.packages.resolvePackagePath("copy-to-folder-path");
		module.exports.config = {
			app: {
				type: 'string',
				"default": packagePath + '\\lib\\copy.cmd'
			},
			args: {
				type: 'string',
				"default": ''
			},
			surpressDirectoryArgument: {
				type: 'boolean',
				"default": true
			},
			setWorkingDirectory: {
				type: 'boolean',
				"default": true
			},
			MacWinRunDirectly: {
				type: 'boolean',
				"default": false
			},
			configFileName: {
				type: 'string',
				"default": '.copy-to-folder-path.json'
			}
		};
	} else {
		module.exports.config = {
			app: {
				type: 'string',
				"default": '/usr/bin/x-terminal-emulator'
			},
			args: {
				type: 'string',
				"default": ''
			},
			surpressDirectoryArgument: {
				type: 'boolean',
				"default": true
			},
			setWorkingDirectory: {
				type: 'boolean',
				"default": true
			},
			MacWinRunDirectly: {
				type: 'boolean',
				"default": false
			},
			configFileName: {
				type: 'string',
				"default": '.copy-to-folder-path.json'
			}
		};
	}

}).call(this);
