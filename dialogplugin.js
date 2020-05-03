(function () {
	class Dialog {
		constructor(options) {
			// 把传递进来的配置信息挂载到实例上（以后可以基于实例在各个方法各个地方拿到这个信息）
			for (let key in options) {
				if (!options.hasOwnProperty(key)) break;
				// 关于TEMPLETE的（统一为DOM对象）
				if (key === "template") {
					let val = options[key];
					if (typeof val === "string") {
						let P = document.createElement('p');
						P.innerHTML = val;
						options[key] = P;
					}
				}
				this[key] = options[key];
			}

			// 开始执行
			this.init();
		}
		// 初始化：通过执行INIT控制逻辑的进行
		init() {
			if (this.status === "message") {
				this.createMessage();
				this.open();
				return;
			}

		}
		// 创建元素
		createMessage() {
			this.messageBox = document.createElement('div');
			this.messageBox.className = `dpn-message dpn-${this.type}`;
			this.messageBox.innerHTML = `
				${this.message}
				<i class="dpn-close">X</i>
			`;
			document.body.appendChild(this.messageBox);

			// 基于事件委托监听关闭按钮的点击
			this.messageBox.onclick = ev => {
				let target = ev.target;
				if (target.className === "dpn-close") {
					// 点击的是关闭按钮
					this.close();
				}
			};

			// 钩子函数
			this.oninit();
		}
		createDialog() {

		}
		// 控制显示
		open() {
			if (this.status === "message") {
				this.messageBox.offsetHeight;
				let messageBoxs = document.querySelectorAll('.dpn-message'),
					len = messageBoxs.length;
				this.messageBox.style.top = `${len===1?20:20+(len-1)*100}px`;

				// 如果DURATION不为零，控制自动消失
				this.autoTimer = setTimeout(() => {
					this.close();
				}, this.duration);

				// 钩子函数
				this.onopen();
				return;
			}
		}
		// 控制隐藏
		close() {
			if (this.status === "message") {
				clearTimeout(this.autoTimer);
				this.messageBox.style.top = '-200px';
				let anonymous = () => {
					document.body.removeChild(this.messageBox);
					this.messageBox.removeEventListener('transitionend', anonymous);

					// 钩子函数
					this.onclose();
				};
				this.messageBox.addEventListener('transitionend', anonymous);
				return;
			}

		}
	}

	let _anonymous = Function.prototype;
	window.messageplugin = function messageplugin(options = {}) {
		// init params
		if (typeof options === "string") {
			options = {
				message: options
			};
		}
		options = Object.assign({
			status: 'message',
			message: '',
			type: 'info',
			duration: 3000,
			oninit: _anonymous,
			onopen: _anonymous,
			onclose: _anonymous
		}, options);
		return new Dialog(options);
	};

	window.dialogplugin = function dialogplugin(options = {}) {
		// init params
		options = Object.assign({
			status: 'dialog',
			template: null,
			title: '系统提示',
			buttons: [],
			oninit: _anonymous,
			onopen: _anonymous,
			onclose: _anonymous
		}, options);
		return new Dialog(options);
	};
})();