'use babel';
import fs from 'fs-plus';

export default class CopyingNotificationView {
	element: null;
	editorElement: null;
	editor: null;

	constructor(serializedState, placeText) {
		console.log("copyingNotificationView constructor go ");
		console.log(serializedState);
		console.log(placeText);
		this.element = document.createElement('div');
		this.element.setAttribute('style', 'text-align:center;'); // 要素を中央寄せ
		this.element.classList.add('copyingNotificationView');

		const message = document.createElement('div');
		message.innerHTML = "コピー中";
		message.setAttribute('style', 'margin-bottom: 5px;'); // 要素を中央寄せ
		message.classList.add('copyingNotificationViewMessage');


		const loading = document.createElement('div');
		loading.innerHTML = "<span class='loading loading-spinner-large inline-block'></span>";
		loading.classList.add('copyingNotificationViewLoading');

		this.element.appendChild(message);
		this.element.appendChild(loading);
	}

	showPanel() {
		console.log("inputPanel表示");
		console.log(this.panel);
		if (this.panel == null) {
			this.panel = atom.workspace.addModalPanel({
				item: this.element,
			});
		}
		console.log(this.panel);
		this.panel.show();
		window.addEventListener('keydown', this.escapeListener, true);
		return;
	}

	hidePanel() {
		var base;
		return typeof(base = this.panel).hide === "function" ? base.hide() : void 0;
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
		return this.editorElement.focus();
	}

}

exports.default = CopyingNotificationView;
