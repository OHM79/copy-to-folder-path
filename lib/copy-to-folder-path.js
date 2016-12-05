(function() {
	var exec, open_terminal, path, platform;
	exec = require('child_process').exec; // 非同期で動作
	// exec = require('child_process').execSync; // 同期動作
	path = require('path');
	platform = require('os').platform;

	open_terminal = function(dirpath) {
		console.log(dirpath);
		var app, args, argsHide, cmdline, runDirectly, setWorkingDirectory, surpressDirArg;
		app = atom.config.get('copy-to-folder-path.app');
		args = atom.config.get('copy-to-folder-path.args');
		argsHide = atom.config.get('copy-to-folder-path.argsHide');
		setWorkingDirectory = atom.config.get('copy-to-folder-path.setWorkingDirectory');
		surpressDirArg = atom.config.get('copy-to-folder-path.surpressDirectoryArgument');
		runDirectly = atom.config.get('copy-to-folder-path.MacWinRunDirectly');
		console.log("app: " + app);
		console.log("args: " + args);
		console.log("argsHide: " + argsHide);
		cmdline = "\"" + app + "\" " + args;
		console.log("cmdline 1: " + cmdline);
		if (!surpressDirArg) {
			cmdline += " \"" + dirpath + "\"";
		}
		if (platform() === "darwin" && !runDirectly) {
			cmdline = "open -a " + cmdline;
		}
		if (platform() === "win32" && !runDirectly) {
			console.log("win32 check");
			console.log("cmdline : " + cmdline);
			cmdline = "start \"\" " + cmdline;
		}
		console.log("copy-to-folder-path executing: ", cmdline);
		if (setWorkingDirectory) {
			console.log("setWorkingDirectory: " + setWorkingDirectory);
			if (dirpath !== null) {
				return exec(cmdline, {
					cwd: dirpath
				});
			}
		} else {
			if (dirpath !== null) {
				return exec(cmdline);
			}
		}
	};

	module.exports = {
		activate: function() {
			return atom.commands.add("atom-workspace", "copy-to-folder-path:CopyToPath", (function(_this) {
				return function() {
					if (platform() === 'win32') {
						console.log("call open");
						_this.sendFileCurrentProjectPath();
					} else {}
					return;
				};
			})(this));
		},

		sendFileCurrentProjectPath: function() {
			// 現在開いているファイルのルートプロジェクトを開く
			var editor, file, filepath, projectPath, ref, ref2, relativePath;
			editor = atom.workspace.getActivePaneItem();
			file = editor !== null ? (ref = editor.buffer) !== null ? ref.file : void 0 : void 0;
			filepath = file !== null ? file.path : void 0;
			if (filepath) {
				ref2 = atom.project.relativizePath(filepath);
				projectPath = ref2[0];
				relativePath = ref2[1];
			}
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
			}
		};
	} else if (platform() === 'win32') {
		module.exports.config = {
			app: {
				type: 'string',
				"default": 'C:\\Windows\\System32\\cmd.exe'
			},
			args: {
				type: 'string',
				"default": ' dir '
			},
			argsHide: {
				type: 'string',
				"default": '/c'
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
			}
		};
	}

}).call(this);
