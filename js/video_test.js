jQuery(function(d) {
	function a(a) {
		this.length = a.length;
		this.each = function(b) {
			d.each(a, b)
		};
		this.size = function() {
			return a.length
		}
	}
	var b = [];
	document.createElement("video");
	d.fn.prop || (d.fn.prop = function(a, b) {
		return d(this).attr(a, b)
	});
	miguVideo = $p = function() {
		function c(a, c, e) {
			this.config = new miguVideoConfig;
			this.env = {
				muted: !1,
				playerDom: null,
				mediaContainer: null,
				agent: "standard",
				mouseIsOver: !1,
				loading: !1,
				className: "",
				onReady: e
			};
			this.media = [];
			this._plugins = [];
			this._pluginCache = {};
			this._queue = [];
			this.listeners = [];
			this.playerModel = {};
			this._isReady = !1;
			this._maxElapsed = 0;
			this._currentItem = null;
			this._id = this._playlistServer = "";
			this._reelUpdate = function(a) {
				var b = this,
					c = null;
				a = a || [{}];
				var e = a.playlist || a;
				this.env.loading = !0;
				this.media = [];
				try {
					for (var f in a.config)!a.config.hasOwnProperty(f) || -1 < typeof a.config[f].indexOf("objectfunction") || (this.config[f] = eval(a.config[f]));
					null != a.config && (this._promote("configModified"), delete a.config)
				} catch (g) {}
				d.each(e, function() {
					c = b._addItem(b._prepareMedia({
						file: this,
						config: this.config || {},
						errorCode: this.errorCode || 0
					}))
				});
				null === c && this._addItem(this._prepareMedia({
					file: "",
					config: {},
					errorCode: 97
				}));
				this.env.loading = !1;
				this._promote("scheduled", this.getItemCount());
				this._syncPlugins(function() {
					b.setActiveItem(0)
				})
			};
			this._addItem = function(a, b, c) {
				var d = 0;
				1 === this.media.length && "NA" == this.media[0].mediaModel && (this._detachplayerModel(), this.media = []);
				void 0 === b || 0 > b || b > this.media.length - 1 ? (this.media.push(a), d = this.media.length - 1) : (this.media.splice(b, !0 === c ? 1 : 0, a), d = b);
				!1 === this.env.loading && this._promote("scheduleModified", this.getItemCount());
				return d
			};
			this._removeItem = function(a) {
				var b = 0;
				if (1 === this.media.length) return "NA" != this.media[0].mediaModel && (this.media[0] = this._prepareMedia({
					file: ""
				})), 0;
				void 0 === a || 0 > a || a > this.media.length - 1 ? (this.media.pop(), b = this.media.length) : (this.media.splice(a, 1), b = a);
				!1 === this.env.loading && this._promote("scheduleModified", this.getItemCount());
				return b
			};
			this._canPlay = function(a, b, c) {
				var e = [],
					f = [],
					g = c || "http";
				b = "object" == typeof b ? b : [b];
				a = a ? a.replace(/x-/, "") : void 0;
				var k = this._testMediaSupport();
				d.each(b, function(a, w) {
					d.each(d.extend(k[g], k["*"] || []) || [], function(a, b) {
						if (null != w && a != w) return !0;
						e = d.merge(e, this);
						return !0
					})
				});
				if (0 === e.length) return !1;
				switch (typeof a) {
				case "undefined":
					return 0 < e.length;
				case "string":
					if ("*" == a) return e;
					f.push(a);
					break;
				case "array":
					f = a
				}
				for (var h in f) if ($p.mmap.hasOwnProperty(h)) {
					if ("string" !== typeof f[h]) break;
					if (-1 < d.inArray(f[h], e)) return !0
				}
				return !1
			};
			this._prepareMedia = function(a) {
				var b = this,
					c = [],
					e = [],
					f = [],
					g = {},
					k = {},
					h = [],
					l = {},
					m = [],
					q = 0,
					p;
				for (p in $p.mmap) $p.mmap.hasOwnProperty(p) && (platforms = "object" == typeof $p.mmap[p].platform ? $p.mmap[p].platform : [$p.mmap[p].platform], d.each(platforms, function(c, e) {
					var v = 0,
						f = "http",
						x;
					for (x in a.file) if (a.file.hasOwnProperty(x) && "config" !== x && (f = a.file[x].streamType || b.getConfig("streamType") || "http", b._canPlay($p.mmap[p].type, e, f) && v++, 0 !== v && ($p.mmap[p].level = d.inArray(e, b.config._platforms), $p.mmap[p].level = 0 > $p.mmap[p].level ? 100 : $p.mmap[p].level, m.push("." + $p.mmap[p].ext), g[$p.mmap[p].ext] || (g[$p.mmap[p].ext] = []), g[$p.mmap[p].ext].push($p.mmap[p]), null === $p.mmap[p].streamType || "*" == $p.mmap[p].streamType || -1 < d.inArray(f || [], $p.mmap[p].streamType || "")))) {
						k[$p.mmap[p].type] || (k[$p.mmap[p].type] = []);
						for (var v = -1, f = 0, z = k[$p.mmap[p].type].length; f < z; f++) if (k[$p.mmap[p].type][f].model == $p.mmap[p].model) {
							v = f;
							break
						} - 1 === v && k[$p.mmap[p].type].push($p.mmap[p])
					}
					return !0
				}));
				m = "^.*.(" + m.join("|") + ")$";
				"string" == typeof a.file && (a.file = [{
					src: a.file
				}], "string" == typeof a.type && (a.file = [{
					src: a.file,
					type: a.type
				}]));
				if (d.isEmptyObject(a) || !1 === a.file || null === a.file) a.file = [{
					src: null
				}];
				for (var n in a.file) if (a.file.hasOwnProperty(n) && "config" != n && ("string" == typeof a.file[n] && (a.file[n] = {
					src: a.file[n]
				}), null != a.file[n].src)) {
					if (null != a.file[n].type && "" !== a.file[n].type) try {
						var r = a.file[n].type.split(" ").join("").split(/[\;]codecs=.([a-zA-Z0-9\,]*)[\'|\"]/i);
						null != r[1] && (a.file[n].codec = r[1]);
						a.file[n].type = r[0].replace(/x-/, "");
						a.file[n].originalType = r[0]
					} catch (s) {} else a.file[n].type = this._getTypeFromFileExtension(a.file[n].src);
					k[a.file[n].type] && 0 < k[a.file[n].type].length && (k[a.file[n].type].sort(function(a, b) {
						return a.level - b.level
					}), h.push(k[a.file[n].type][0]))
				}
				0 === h.length ? h = k["none/none"] : (h.sort(function(a, b) {
					return a.level - b.level
				}), q = h[0].level, h = d.grep(h, function(a) {
					return a.level == q
				}));
				c = [];
				d.each(h || [], function() {
					c.push(this.type)
				});
				h = h && 0 < h.length ? h[0] : {
					type: "none/none",
					model: "NA",
					errorCode: 11
				};
				c = $p.utils.unique(c);
				for (n in a.file) if (a.file.hasOwnProperty(n) && null != a.file[n].type && !(0 > d.inArray(a.file[n].type.replace(/x-/, ""), c) && "none/none" != h.type)) {
					if (d.isEmptyObject(a.config) || null == a.config.streamType || -1 == a.config.streamType.indexOf("rtmp")) a.file[n].src = $p.utils.toAbsoluteURL(a.file[n].src);
					null == a.file[n].quality && (a.file[n].quality = "default");
					f.push(a.file[n].quality);
					e.push(a.file[n])
				}
				0 === e.length && e.push({
					src: null,
					quality: "default"
				});
				var t = [];
				d.each(this.getConfig("playbackQualities"), function() {
					t.push(this.key || "default")
				});
				return l = {
					ID: a.config.id || $p.utils.randomId(8),
					cat: a.config.cat || "clip",
					file: e,
					platform: h.platform,
					platforms: platforms,
					qualities: $p.utils.intersect($p.utils.unique(t), $p.utils.unique(f)),
					mediaModel: h.model || "NA",
					errorCode: h.errorCode || a.errorCode || 7,
					config: a.config || {}
				}
			};
			this._modelUpdateListener = function(a, b) {
				var c = this,
					e = this.playerModel;
				if (this.playerModel.init) switch (a) {
				case "state":
					this._promote("state", b);
					var f = d.map(this.getDC().attr("class").split(" "), function(a) {
						return -1 === a.indexOf(c.getConfig("ns") + "state") ? a : ""
					});
					f.push(this.getConfig("ns") + "state" + b.toLowerCase());
					this.getDC().attr("class", f.join(" "));
					switch (b) {
					case "AWAKENING":
						this._syncPlugins(function() {
							e.getState("AWAKENING") && e.displayItem(!0)
						});
						break;
					case "ERROR":
						this._addGUIListeners();
						break;
					case "PAUSED":
						!0 === this.getConfig("disablePause") && this.playerModel.applyCommand("play", 0);
						break;
					case "COMPLETED":
						if (this._currentItem + 1 >= this.media.length && !this.getConfig("loop") && (this._promote("done", {}), this.getConfig("leaveFullscreen"))) return
					}
					break;
				case "modelReady":
					this._maxElapsed = 0;
					this._promote("item", c._currentItem);
					break;
				case "displayReady":
					this._promote("displayReady", !0);
					this._syncPlugins(function() {
						c._promote("ready");
						c._addGUIListeners();
						e.getState("IDLE") || e.start()
					});
					break;
				case "availableQualitiesChange":
					this.media[this._currentItem].qualities = b;
					this._promote("availableQualitiesChange", b);
					break;
				case "qualityChange":
					this.setConfig({
						playbackQuality: b
					});
					this._promote("qualityChange", b);
					break;
				case "volume":
					this.setConfig({
						volume: b
					});
					this._promote("volume", b);
					0 >= b ? (this.env.muted = !0, this._promote("mute", b)) : !0 === this.env.muted && (this.env.muted = !1, this._promote("unmute", b));
					break;
				case "playlist":
					this.setFile(b.file, b.type);
					break;
				case "config":
					this.setConfig(b);
					break;
				case "time":
					this._promote(a, b);
					break;
				case "fullscreen":
					!0 === b ? (this.getDC().addClass("fullscreen"), this._enterFullViewport()) : (this.getDC().removeClass("fullscreen"), this._exitFullViewport());
					this._promote(a, b);
					break;
				case "error":
					this._promote(a, b);
					this.getConfig("skipTestcard") && 1 < this.getItemCount() ? this.setActiveItem("next") : (this.playerModel.applyCommand("error", b), this._addGUIListeners());
					break;
				case "streamTypeChange":
					"dvr" == b && this.getDC().addClass(this.getNS() + "dvr");
					this._promote(a, b);
					break;
				default:
					this._promote(a, b)
				}
			};
			this._syncPlugins = function(a) {
				var b = this;
				this.env.loading = !0;
				(function() {
					try {
						if (0 < b._plugins.length) for (var c = 0; c < b._plugins.length; c++) if (!b._plugins[c].isReady()) {
							setTimeout(arguments.callee, 50);
							return
						}
						b.env.loading = !1;
						b._promote("pluginsReady", {});
						try {
							a()
						} catch (d) {}
					} catch (e) {}
				})()
			};
			this._MD = function(a) {
				miguVideo("#" + a.currentTarget.id.replace(/_media$/, ""))._playerFocusListener(a)
			};
			this._addGUIListeners = function() {
				var a = this;
				this._removeGUIListeners();
				this.getDC().get(0).addEventListener ? this.getDC().get(0).addEventListener("mousedown", this._MD, !0) : this.getDC().mousedown(function(b) {
					a._playerFocusListener(b)
				});
				this.getDC().mousemove(function(b) {
					a._playerFocusListener(b)
				}).mouseenter(function(b) {
					a._playerFocusListener(b)
				}).mouseleave(function(b) {
					a._playerFocusListener(b)
				}).focus(function(b) {
					a._playerFocusListener(b)
				}).blur(function(b) {
					a._playerFocusListener(b)
				});
				d(window).bind("resize.miguVideo" + this.getId(), function() {
					a.setSize()
				}).bind("touchstart", function() {
					a._windowTouchListener(event)
				});
				!0 === this.config.enableKeyboard && (d(document).unbind("keydown.pp" + this._id), d(document).bind("keydown.pp" + this._id, function(b) {
					a._keyListener(b)
				}))
			};
			this._removeGUIListeners = function() {
				d("#" + this.getId()).unbind();
				this.getDC().unbind();
				this.getDC().get(0).removeEventListener ? this.getDC().get(0).removeEventListener("mousedown", this._MD, !0) : this.getDC().get(0).detachEvent("onmousedown", this._MD);
				d(window).unbind("resize.miguVideo" + this.getId())
			};
			this._registerPlugins = function() {
				var a = d.merge(d.merge([], this.config._plugins), this.config._addplugins),
					b = "",
					b = null;
				if (!(0 < this._plugins.length || 0 === a.length)) for (var c = 0; c < a.length; c++) {
					b = "miguVideo" + a[c].charAt(0).toUpperCase() + a[c].slice(1);
					try {
						typeof eval(b)
					} catch (e) {
						alert("miguVideo Error: Plugin '" + a[c] + "' malicious or not available.");
						continue
					}
					b = d.extend(!0, {}, new miguVideoPluginInterface, eval(b).prototype);
					b.name = a[c].toLowerCase();
					b.pp = this;
					b.playerDom = this.env.playerDom;
					b._init(this.config["plugin_" + a[c].toLowerCase()] || {});
					null == this.config["plugin_" + b.name] && (this.config["plugin_" + b.name] = {});
					this.config["plugin_" + b.name] = d.extend(!0, {}, b.config || {});
					for (var f in b) 1 < f.indexOf("Handler") && (null == this._pluginCache[f] && (this._pluginCache[f] = []), this._pluginCache[f].push(b));
					this._plugins.push(b)
				}
			};
			this.removePlugins = function(a) {
				if (0 != this._plugins.length) {
					a = a || d.merge(d.merge([], this.config._plugins), this.config._addplugins);
					for (var b = this._plugins.length, c = 0; c < a.length; c++) for (var e = 0; e < b; e++) if (void 0 != this._plugins[e] && this._plugins[e].name == a[c].toLowerCase()) {
						this._plugins[e].deconstruct();
						this._plugins.splice(e, 1);
						for (var f in this._pluginCache) for (var g = 0; g < this._pluginCache[f].length; g++) this._pluginCache[f][g].name == a[c].toLowerCase() && this._pluginCache[f].splice(g, 1)
					}
				}
			};
			this.getPlugins = function() {
				var a = [];
				d.each(this._plugins, function() {
					a.push({
						name: this.name,
						ver: this.version || "unknown"
					})
				});
				return a
			};
			this._promote = function(a, b) {
				var c = this;
				this._enqueue(function() {
					try {
						c.__promote(a, b)
					} catch (d) {}
				})
			};
			this.__promote = function(a, b) {
				var c = a;
				if ("object" == typeof c) {
					if (!c._plugin) return;
					c = "plugin_" + c._plugin + $p.utils.capitalise(c._event.toUpperCase())
				}
				"time" != c && "progress" != c && "mousemove" != c && $p.utils.log("Event: [" + c + "]", b, this.listeners);
				if (this._pluginCache[c + "Handler"] && 0 < this._pluginCache[c + "Handler"].length) for (var d = 0; d < this._pluginCache[c + "Handler"].length; d++) if (this.getConfig("debug")) try {
					this._pluginCache[c + "Handler"][d][c + "Handler"](b, this)
				} catch (e) {
					$p.utils.log(e)
				} else this._pluginCache[c + "Handler"][d][c + "Handler"](b, this);
				if (this._pluginCache.eventHandler && 0 < this._pluginCache.eventHandler.length) for (d = 0; d < this._pluginCache.eventHandler.length; d++) if (this.getConfig("debug")) try {
					this._pluginCache.eventHandler[d].eventHandler(c, b, this)
				} catch (f) {
					$p.utils.log(f)
				} else this._pluginCache.eventHandler[d].eventHandler(c, b, this);
				if (0 < this.listeners.length) for (d = 0; d < this.listeners.length; d++) if (this.listeners[d].event == c || "*" == this.listeners[d].event) if (this.getConfig("debug")) try {
					this.listeners[d].callback(b, this)
				} catch (g) {
					$p.utils.log(g)
				} else this.listeners[d].callback(b, this)
			};
			this._detachplayerModel = function() {
				this._removeGUIListeners();
				try {
					this.playerModel.destroy(), this._promote("detach", {})
				} catch (a) {}
			};
			this._windowTouchListener = function(a) {
				a.touches && 0 < a.touches.length && (-1 < (d(document.elementFromPoint(a.touches[0].clientX, a.touches[0].clientY)).attr("id") || "").indexOf(this.getDC().attr("id")) ? (0 == this.env.mouseIsOver && this._promote("mouseenter", {}), this.env.mouseIsOver = !0, this._promote("mousemove", {}), a.stopPropagation()) : this.env.mouseIsOver && (this._promote("mouseleave", {}), this.env.mouseIsOver = !1))
			};
			this._playerFocusListener = function(a) {
				var b = a.type.toLowerCase();
				switch (b) {
				case "mousedown":
					if (0 == this.env.mouseIsOver) break;
					if (-1 < "|TEXTAREA|INPUT".indexOf("|" + a.target.tagName.toUpperCase())) return;
					if (3 == a.which) {
						if (d(a.target).hasClass("context")) break;
						d(document).bind("contextmenu", function(a) {
							d(document).unbind("contextmenu");
							return !1
						})
					}
					break;
				case "mousemove":
					this.env.mouseX != a.clientX && this.env.mouseY != a.clientY && (this.env.mouseIsOver = !0);
					if (this.env.clientX == a.clientX && this.env.clientY == a.clientY) return;
					this.env.clientX = a.clientX;
					this.env.clientY = a.clientY;
					break;
				case "focus":
				case "mouseenter":
					this.env.mouseIsOver = !0;
					break;
				case "blur":
				case "mouseleave":
					this.env.mouseIsOver = !1
				}
				this._promote(b, a)
			};
			this._keyListener = function(a) {
				if (this.env.mouseIsOver && !(-1 < "|TEXTAREA|INPUT".indexOf("|" + a.target.tagName.toUpperCase()))) {
					var b = this,
						c = 0 < this.getConfig("keys").length ? this.getConfig("keys") : [{
							27: function(a) {
								a.getInFullscreen() ? a.setFullscreen(!1) : a.setStop()
							},
							32: function(a, b) {
								a.setPlayPause();
								b.preventDefault()
							},
							70: function(a) {
								a.setFullscreen()
							},
							39: function(a, b) {
								a.setPlayhead("+5");
								b.preventDefault()
							},
							37: function(a, b) {
								a.setPlayhead("-5");
								b.preventDefault()
							},
							38: function(a, b) {
								a.setVolume("+0.05");
								b.preventDefault()
							},
							40: function(a, b) {
								a.setVolume("-0.05");
								b.preventDefault()
							}
						}];
					this._promote("key", a);
					d.each(c || [], function() {
						try {
							this[a.keyCode](b, a)
						} catch (c) {}
						try {
							this["*"](b)
						} catch (d) {}
					})
				}
			};
			this._enterFullViewport = function(a) {
				var b = this.getIframeParent() || d(window),
					c = this.getIframe() || this.getDC(),
					e = d(b[0].document.body).css("overflow");
				a && (b = d(window), c = this.getDC());
				c.data("fsdata", {
					scrollTop: b.scrollTop() || 0,
					scrollLeft: b.scrollLeft() || 0,
					targetStyle: c.attr("style") || "",
					targetWidth: c.width(),
					targetHeight: c.height(),
					bodyOverflow: "visible" == e ? "auto" : e,
					bodyOverflowX: d(b[0].document.body).css("overflow-x"),
					bodyOverflowY: d(b[0].document.body).css("overflow-y"),
					iframeWidth: c.attr("width") || 0,
					iframeHeight: c.attr("height") || 0
				}).css({
					position: "absolute",
					display: "block",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 99999,
					margin: 0,
					padding: 0
				});
				b.scrollTop(0).scrollLeft(0);
				d(b[0].document.body).css({
					overflow: "hidden",
					overflowX: "hidden",
					overflowY: "hidden"
				})
			};
			this._exitFullViewport = function(a) {
				var b = this.getIframeParent() || d(window),
					c = this.getIframe() || this.getDC(),
					e = c.data("fsdata") || null;
				a && (b = d(window), c = this.getDC());
				null != e && (b.scrollTop(e.scrollTop).scrollLeft(e.scrollLeft), d(b[0].document.body).css("overflow", e.bodyOverflow), d(b[0].document.body).css("overflow-x", e.bodyOverflowX), d(b[0].document.body).css("overflow-y", e.bodyOverflowY), 0 < e.iframeWidth && !a ? c.attr("width", e.iframeWidth + "px").attr("height", e.iframeHeight + "px") : c.width(e.targetWidth).height(e.targetHeight), c.attr("style", null == e.targetStyle ? "" : e.targetStyle).data("fsdata", null))
			};
			this.pluginAPI = function() {
				var a = Array.prototype.slice.call(arguments) || null,
					b = a.shift(),
					c = a.shift();
				if (null != b && null != c) for (var d = 0; d < this._plugins.length; d++) if (this._plugins[d].name == b) {
					this._plugins[d][c](a[0]);
					break
				}
			};
			this.getIsLastItem = function() {
				return this._currentItem == this.media.length - 1 && !0 !== this.config._loop
			};
			this.getIsFirstItem = function() {
				return 0 == this._currentItem && !0 !== this.config._loop
			};
			this.getItemConfig = function(a, b) {
				return this.getConfig(a, b)
			};
			this.getConfig = function(a, b) {
				var c = b || this._currentItem,
					e = null != this.config["_" + a] ? this.config["_" + a] : this.config[a];
				if (null == a) return this.media[c].config;
				if (null == this.config["_" + a]) try {
					void 0 !== this.media[c].config[a] && (e = this.media[c].config[a])
				} catch (f) {}
				if (-1 < a.indexOf("plugin_")) try {
					this.media[c].config[a] && (e = d.extend(!0, {}, this.config[a], this.media[c].config[a]))
				} catch (g) {}
				if (null == e) return null;
				"object" == typeof e && null === e.length ? e = d.extend(!0, {}, e || {}) : "object" == typeof e && (e = d.extend(!0, [], e || []));
				if ("string" == typeof e) switch (e) {
				case "true":
					e = !0;
					break;
				case "false":
					e = !1;
					break;
				case "NaN":
				case "undefined":
				case "null":
					e = null
				}
				return e
			};
			this.getDC = function() {
				return this.env.playerDom
			};
			this.getState = function(a) {
				var b = "IDLE";
				try {
					b = this.playerModel.getState()
				} catch (c) {}
				return null != a ? b == a.toUpperCase() : b
			};
			this.getLoadProgress = function() {
				try {
					return this.playerModel.getLoadProgress()
				} catch (a) {
					return 0
				}
			};
			this.getKbPerSec = function() {
				try {
					return this.playerModel.getKbPerSec()
				} catch (a) {
					return 0
				}
			};
			this.getItemCount = function() {
				return 1 == this.media.length && "na" == this.media[0].mediaModel ? 0 : this.media.length
			};
			this.getItemId = function(a) {
				return this.media[a || this._currentItem].ID || null
			};
			this.getItemIdx = function() {
				return this._currentItem
			};
			this.getPlaylist = function() {
				return this.getItem("*")
			};
			this.getItem = function(a) {
				if (1 == this.media.length && "na" == this.media[0].mediaModel) return null;
				switch (a || "current") {
				case "next":
					return d.extend(!0, {}, this.media[this._currentItem + 1] || {});
				case "prev":
					return d.extend(!0, {}, this.media[this._currentItem - 1] || {});
				case "current":
					return d.extend(!0, {}, this.media[this._currentItem] || {});
				case "*":
					return d.extend(!0, [], this.media || []);
				default:
					return d.extend(!0, {}, this.media[a || this._currentItem] || {})
				}
			};
			this.getVolume = function() {
				return !0 === this.getConfig("fixedVolume") ? this.config.volume : this.getConfig("volume")
			};
			this.getLoadPlaybackProgress = function() {
				try {
					return this.playerModel.getLoadPlaybackProgress()
				} catch (a) {
					return 0
				}
			};
			this.getSource = function() {
				try {
					return this.playerModel.getSource()[0].src
				} catch (a) {
					return !1
				}
			};
			this.getDuration = function() {
				try {
					return this.playerModel.getDuration()
				} catch (a) {
					return 0
				}
			};
			this.getPosition = function() {
				try {
					return this.playerModel.getPosition() || 0
				} catch (a) {
					return 0
				}
			};
			this.getMaxPosition = function() {
				try {
					return this.playerModel.getMaxPosition() || 0
				} catch (a) {
					return 0
				}
			};
			this.getFrame = function() {
				try {
					return this.playerModel.getFrame()
				} catch (a) {
					return 0
				}
			};
			this.getTimeLeft = function() {
				try {
					return this.playerModel.getDuration() - this.playerModel.getPosition()
				} catch (a) {
					return this.media[this._currentItem].duration
				}
			};
			this.getInFullscreen = function() {
				return this.getNativeFullscreenSupport().isFullScreen()
			};
			this.getMediaContainer = function() {
				null == this.env.mediaContainer && (this.env.mediaContainer = d("#" + this.getMediaId()));
				0 == this.env.mediaContainer.length && (0 < this.env.playerDom.find("." + this.getNS() + "display").length ? this.env.mediaContainer = d(document.createElement("div")).attr({
					id: this.getId() + "_media"
				}).css({
					overflow: "hidden",
					height: "100%",
					width: "100%",
					top: 0,
					left: 0,
					padding: 0,
					margin: 0,
					display: "block"
				}).appendTo(this.env.playerDom.find("." + this.getNS() + "display")) : this.env.mediaContainer = d(document.createElement("div")).attr({
					id: this.getMediaId()
				}).css({
					width: "1px",
					height: "1px"
				}).appendTo(d(document.body)));
				return this.env.mediaContainer
			};
			this.getMediaId = function() {
				return this.getId() + "_media"
			};
			this.getMediaType = function() {
				try {
					return this._getTypeFromFileExtension(this.playerModel.getSrc()) || "na/na"
				} catch (a) {
					return "na/na"
				}
			};
			this.getUsesFlash = function() {
				return -1 < this.playerModel.modelId.indexOf("FLASH")
			};
			this.getModel = function() {
				try {
					return this.media[this._currentItem].mediaModel.toUpperCase()
				} catch (a) {
					return "NA"
				}
			};
			this.getIframeParent = this.getIframeWindow = function() {
				try {
					var a = !1;
					this.config._iframe && (a = parent.location.host || !1);
					return !1 === a ? !1 : d(parent.window)
				} catch (b) {
					return !1
				}
			};
			this.getIframe = function() {
				try {
					var a = [];
					this.config._iframe && (a = window.$(frameElement) || []);
					return 0 == a.length ? !1 : a
				} catch (b) {
					return !1
				}
			};
			this.getIframeAllowFullscreen = function() {
				var a = null;
				try {
					a = window.frameElement.attributes.allowFullscreen || window.frameElement.attributes.mozallowFullscreen || window.frameElement.attributes.webkitallowFullscreen || null
				} catch (b) {
					a = !0
				}
				return null != a ? !0 : !1
			};
			this.getPlaybackQuality = function() {
				var a = "default";
				try {
					a = this.playerModel.getPlaybackQuality()
				} catch (b) {}
				"default" == a && (a = this.getConfig("playbackQuality"));
				if ("default" == a || -1 == d.inArray(a, this.getPlaybackQualities())) a = this.getAppropriateQuality(); - 1 == d.inArray(a, this.getPlaybackQualities()) && (a = "default");
				return a
			};
			this.getPlaybackQualities = function() {
				try {
					return d.extend(!0, [], this.media[this._currentItem].qualities || [])
				} catch (a) {}
				return []
			};
			this.getIsMobileClient = function(a) {
				for (var b = navigator.userAgent.toLowerCase(), c = ["android", "windows ce", "blackberry", "palm", "mobile"], d = 0; d < c.length; d++) if (-1 < b.indexOf(c[d])) return a ? c[d].toUpperCase() == a.toUpperCase() : !0;
				return !1
			};
			this.getCanPlay = function(a, b, c) {
				return this._canPlay(a, b, c)
			};
			this.getCanPlayNatively = function(a) {
				return this._canPlay(a, "native")
			};
			this.getPlatform = function() {
				return this.media[this._currentItem].platform || "error"
			};
			this.getPlatforms = function() {
				var a = this._testMediaSupport(!0),
					b = this.getConfig("platforms"),
					c = [];
				try {
					for (var e in this.media[this._currentItem].file) if (this.media[this._currentItem].file.hasOwnProperty(e)) for (var f in a) this._canPlay(this.media[this._currentItem].file[e].type.replace(/x-/, ""), a[f].toLowerCase(), this.getConfig("streamType")) && -1 == d.inArray(a[f].toLowerCase(), c) && c.push(a[f].toLowerCase())
				} catch (g) {}
				c.sort(function(a, c) {
					return d.inArray(a, b) - d.inArray(c, b)
				});
				return c
			};
			this.getNativeFullscreenSupport = function() {
				var a = this,
					b = {
						supportsFullScreen: "viewport",
						isFullScreen: function() {
							try {
								return a.getDC().hasClass("fullscreen")
							} catch (b) {
								return !1
							}
						},
						requestFullScreen: function() {
							a.playerModel.applyCommand("fullscreen", !0)
						},
						cancelFullScreen: function() {
							a.playerModel.applyCommand("fullscreen", !1)
						},
						prefix: "",
						ref: this
					},
					c = ["webkit", "moz", "o", "ms", "khtml"];
				if ("undefined" != typeof document.cancelFullScreen) b.supportsFullScreen = !0;
				else for (var e = 0, f = c.length; e < f && (b.prefix = c[e], "undefined" != typeof document.createElement("video")[b.prefix + "EnterFullscreen"] && (b.supportsFullScreen = "mediaonly"), "undefined" != typeof document[b.prefix + "CancelFullScreen"] && (b.supportsFullScreen = "dom", "moz" == b.prefix && "undefined" == typeof document[b.prefix + "FullScreenEnabled"] && (b.supportsFullScreen = "viewport")), !1 === b.supportsFullScreen || "viewport" === b.supportsFullScreen); e++);
				if ("viewport" == b.supportsFullScreen || "dom" == b.supportsFullScreen && this.getConfig("forceFullViewport")) return b;
				if ("mediaonly" == b.supportsFullScreen) return b.requestFullScreen = function(b) {
					a.playerModel.getMediaElement().get(0)[this.prefix + "EnterFullscreen"]()
				}, b.dest = {}, b.cancelFullScreen = function() {}, b;
				b.isFullScreen = function(b) {
					var c = a.getIframe() ? parent.window.document : document;
					switch (this.prefix) {
					case "":
						return c.fullScreen;
					case "webkit":
						return c.webkitIsFullScreen;
					case "moz":
						return c[this.prefix + "FullScreen"] || a.getDC().hasClass("fullscreen") && !0 !== b;
					default:
						return c[this.prefix + "FullScreen"]
					}
				};
				b.requestFullScreen = function() {
					if (!this.isFullScreen()) {
						var b = a.getIframeParent() || d(window),
							c = a.getIframe() ? a.getIframe().get(0) : a.getDC().get(0),
							e = this,
							f = a.getIframe() ? parent.window.document : document,
							b = a.getIframeParent() || d(window);
						b.data("fsdata", {
							scrollTop: b.scrollTop(),
							scrollLeft: b.scrollLeft()
						});
						d(f).unbind(this.prefix + "fullscreenchange.miguVideo");
						if ("" === this.prefix) c.requestFullScreen();
						else c[this.prefix + "RequestFullScreen"]();
						e.ref.playerModel.applyCommand("fullscreen", !0);
						d(f).bind(this.prefix + "fullscreenchange.miguVideo", function(a) {
							if (e.isFullScreen(!0)) e.ref.playerModel.applyCommand("fullscreen", !0);
							else {
								e.ref.playerModel.applyCommand("fullscreen", !1);
								a = e.ref.getIframeParent() || d(window);
								var b = a.data("fsdata");
								null != b && (a.scrollTop(b.scrollTop), a.scrollLeft(b.scrollLeft))
							}
						})
					}
				};
				b.cancelFullScreen = function() {
					var b = a.getIframe() ? parent.window.document : document,
						c = a.getIframeParent() || d(window),
						e = c.data("fsdata");
					d(a.getIframe() ? parent.window.document : document).unbind(this.prefix + "fullscreenchange.miguVideo");
					if (b.exitFullScreen) b.exitFullScreen();
					else if ("" == this.prefix) b.cancelFullScreen();
					else b[this.prefix + "CancelFullScreen"]();
					null != e && (c.scrollTop(e.scrollTop), c.scrollLeft(e.scrollLeft));
					a.playerModel.applyCommand("fullscreen", !1)
				};
				return b
			};
			this.getId = function() {
				return this._id
			};
			this.getHasGUI = function() {
				try {
					return this.playerModel.getHasGUI()
				} catch (a) {
					return !1
				}
			};
			this.getCssPrefix = this.getNS = function() {
				return this.config._cssClassPrefix || this.config._ns || "pp"
			};
			this.getPlayerDimensions = function() {
				return {
					width: this.getDC().width(),
					height: this.getDC().height()
				}
			};
			this.getMediaDimensions = function() {
				return this.playerModel.getMediaDimensions() || {
					width: 0,
					height: 0
				}
			};
			this.getAppropriateQuality = function(a) {
				var b = a || this.getPlaybackQualities() || [];
				if (0 == b.length) return [];
				var c = this.env.playerDom.width(),
					e = this.env.playerDom.height(),
					f = $p.utils.roundNumber(c / e, 2),
					g = {};
				d.each(this.getConfig("playbackQualities") || [], function() {
					if (0 > d.inArray(this.key, b) || (this.minHeight || 0) > e && g.minHeight <= e || (g.minHeight || 0) > this.minHeight) return !0;
					if ("number" == typeof this.minWidth) {
						if (0 === this.minWidth && this.minHeight > e || this.minWidth > c) return !0;
						g = this
					} else if ("object" == typeof this.minWidth) {
						var a = this;
						d.each(this.minWidth, function() {
							if ((this.ratio || 100) > f || this.minWidth > c) return !0;
							g = a;
							return !0
						})
					}
					return !0
				});
				return -1 < d.inArray("auto", this.getPlaybackQualities()) ? "auto" : g.key || "default"
			};
			this.getFromUrl = function(a, b, c, e, f) {
				var g = null,
					h = !this.getIsMobileClient();
				b == this && "_reelUpdate" == c && this._promote("scheduleLoading", 1 + this.getItemCount());
				"_" != c.substr(0, 1) ? window[c] = function(a) {
					try {
						delete window[c]
					} catch (e) {}
					b[c](a)
				} : -1 < f.indexOf("jsonp") && (this["_jsonp" + c] = function(a) {
					b[c](a)
				});
				if (f) {
					if (void 0 == d.parseJSON && -1 < f.indexOf("json")) return this._raiseError("miguVideo requires at least jQuery 1.4.2 in order to handle JSON playlists."), this;
					f = -1 < f.indexOf("/") ? f.split("/")[1] : f
				}
				a = {
					url: a,
					complete: function(a, d) {
						if (void 0 == f) try {
							-1 < a.getResponseHeader("Content-Type").indexOf("xml") && (f = "xml"), -1 < a.getResponseHeader("Content-Type").indexOf("json") && (f = "json"), -1 < a.getResponseHeader("Content-Type").indexOf("html") && (f = "html")
						} catch (w) {}
						g = $p.utils.cleanResponse(a.responseText, f);
						try {
							g = e(g, a.responseText, b)
						} catch (h) {}
						if ("error" != d && "jsonp" != f) try {
							b[c](g)
						} catch (k) {}
					},
					error: function(a) {
						if (b[c] && "jsonp" != f) b[c](!1)
					},
					cache: !0,
					async: h,
					dataType: f,
					jsonpCallback: "_" != c.substr(0, 1) ? !1 : "miguVideo('" + this.getId() + "')._jsonp" + c,
					jsonp: "_" != c.substr(0, 1) ? !1 : "callback",
					xhrFields: {
						withCredentials: !0
					},
					beforeSend: function(a) {
						a.withCredentials = !0
					}
				};
				d.support.cors = !0;
				d.ajax(a);
				return this
			};
			this.setActiveItem = function(a) {
				var b = 0,
					c = this._currentItem,
					e = this,
					f = !1;
				if ("string" == typeof a) switch (a) {
				case "same":
					b = this._currentItem;
					break;
				case "previous":
					b = this._currentItem - 1;
					break;
				case "next":
					b = this._currentItem + 1
				} else b = "number" == typeof a ? parseInt(a) : 0;
				if (b != this._currentItem && 1 == this.getConfig("disallowSkip") && !this.getState("COMPLETED") && !this.getState("IDLE")) return this;
				this._detachplayerModel();
				this.env.loading = !1;
				0 !== b || null != c && c != b || !(!0 === this.config._autoplay || -1 < "DESTROYING|AWAKENING".indexOf(this.getState())) ? 1 < this.getItemCount() && b != c && null != c && !0 === this.config._continuous && b < this.getItemCount() && (f = !0) : f = !0;
				if (b >= this.getItemCount() || 0 > b) f = this.config._loop, b = 0;
				this._currentItem = b;
				a = this.getDC().hasClass("fullscreen");
				this.getDC().attr("class", this.env.className);
				a && this.getDC().addClass("fullscreen");
				a = this.media[this._currentItem].mediaModel.toUpperCase();
				$p.models[a] ? (null != this.getConfig("className", null) && this.getDC().addClass(this.getNS() + this.getConfig("className")), this.getDC().addClass(this.getNS() + (this.getConfig("streamType") || "http")), $p.utils.cssTransitions() || this.getDC().addClass("notransitions"), this.getIsMobileClient() && this.getDC().addClass("mobile")) : (a = "NA", this.media[this._currentItem].mediaModel = a, this.media[this._currentItem].errorCode = 8);
				this.playerModel = new playerModel;
				d.extend(this.playerModel, $p.models[a].prototype);
				this._promote("syncing", "display");
				this._enqueue(function() {
					try {
						e._applyCuePoints()
					} catch (a) {}
				});
				this.playerModel._init({
					media: d.extend(!0, {}, this.media[this._currentItem]),
					model: a,
					pp: this,
					environment: d.extend(!0, {}, this.env),
					autoplay: f,
					quality: this.getPlaybackQuality(),
					fullscreen: this.getInFullscreen()
				});
				return this
			};
			this.setPlay = function() {
				var a = this;
				this.getConfig("thereCanBeOnlyOne") && miguVideo("*").each(function() {
					this.getId() !== a.getId() && this.setStop()
				});
				this._enqueue("play", !1);
				return this
			};
			this.setPause = function() {
				this._enqueue("pause", !1);
				return this
			};
			this.setStop = function(a) {
				var b = this;
				if (this.getState("IDLE")) return this;
				a ? this._enqueue(function() {
					b._currentItem = 0;
					b.setActiveItem(0)
				}) : this._enqueue("stop", !1);
				return this
			};
			this.setPlayPause = function() {
				this.getState("PLAYING") ? this.setPause() : this.setPlay();
				return this
			};
			this.setVolume = function(a, b) {
				var c = this.getVolume();
				if (1 == this.getConfig("fixedVolume")) return this;
				switch (typeof a) {
				case "string":
					var e = a.substr(0, 1);
					a = parseFloat(a.substr(1));
					switch (e) {
					case "+":
						a = this.getVolume() + a;
						break;
					case "-":
						a = this.getVolume() - a;
						break;
					default:
						a = this.getVolume()
					}
				case "number":
					a = parseFloat(a);
					a = 1 < a ? 1 : a;
					a = 0 > a ? 0 : a;
					break;
				default:
					return this
				}
				if (a > c && b) {
					if (.03 < a - c) {
						for (; c <= a; c += .03) this._enqueue("volume", c, b);
						this._enqueue("volume", a, b);
						return this
					}
				} else if (a < c && b && .03 < c - a) {
					for (; c >= a; c -= .03) this._enqueue("volume", c, b);
					this._enqueue("volume", a, b);
					return this
				}
				this._enqueue("volume", a);
				return this
			};
			this.setPlayhead = this.setSeek = function(a) {
				if (1 == this.getConfig("disallowSkip")) return this;
				if ("string" == typeof a) {
					var b = a.substr(0, 1);
					a = parseFloat(a.substr(1));
					a = "+" == b ? this.getPosition() + a : "-" == b ? this.getPosition() - a : this.getPosition()
				}
				"number" == typeof a && this._enqueue("seek", Math.round(100 * a) / 100);
				return this
			};
			this.setFrame = function(a) {
				if (null == this.getConfig("fps") || 1 == this.getConfig("disallowSkip")) return this;
				if ("string" == typeof a) {
					var b = a.substr(0, 1);
					a = parseFloat(a.substr(1));
					a = "+" == b ? this.getFrame() + a : "-" == b ? this.getFrame() - a : this.getFrame()
				}
				"number" == typeof a && this._enqueue("frame", a);
				return this
			};
			this.setPlayerPoster = function(a) {
				var b = this;
				this._enqueue(function() {
					b.setConfig({
						poster: a
					}, 0)
				});
				this._enqueue(function() {
					b.playerModel.setPosterLive()
				});
				return this
			};
			this.setConfig = function() {
				var a = this,
					b = arguments;
				this._enqueue(function() {
					a._setConfig(b[0] || null, b[1] || null)
				});
				return this
			};
			this._setConfig = function() {
				if (!arguments.length) return result;
				var a = arguments[0],
					b = "*",
					c = !1;
				if ("object" != typeof a) return this;
				var b = "string" == arguments[1] || "number" == arguments[1] ? arguments[1] : this._currentItem,
					e;
				for (e in a) if (null == this.config["_" + e]) {
					try {
						c = eval(a[e])
					} catch (f) {
						c = a[e]
					}
					if ("*" == b) d.each(this.media, function() {
						null == this.config && (this.config = {});
						this.config[e] = c
					});
					else {
						if (void 0 == this.media[b]) break;
						null == this.media[b].config && (this.media[b].config = {});
						this.media[b].config[e] = c
					}
				}
				return this
			};
			this.setFullscreen = function(a) {
				var b = this.getNativeFullscreenSupport();
				a = null == a ? !b.isFullScreen() : a;
				!0 === a ? b.requestFullScreen() : b.cancelFullScreen();
				return this
			};
			this.setSize = function(a) {
				var b = this.getIframe() || this.getDC(),
					c = b.data("fsdata") || null,
					e = a && null != a.width ? a.width : null != this.getConfig("width") ? this.getConfig("width") : !1;
				a = a && null != a.height ? a.height : null == this.getConfig("height") && this.getConfig("ratio") ? Math.round((e || this.getDC().width()) / this.getConfig("ratio")) : null != this.getConfig("height") ? this.getConfig("height") : !1;
				this.getInFullscreen() && null != c ? (c.targetWidth = e, c.targetHeight = a, b.data("fsdata", c)) : (e && b.css({
					width: e + "px"
				}), a && b.css({
					height: a + "px"
				}));
				try {
					this.playerModel.applyCommand("resize")
				} catch (d) {}
			};
			this.setLoop = function(a) {
				this.config._loop = a || !this.config._loop
			};
			this.addListener = function(a, b) {
				var c = this;
				this._enqueue(function() {
					c._addListener(a, b)
				});
				return this
			};
			this._addListener = function(a, b) {
				var c = -1 < a.indexOf(".") ? a.split(".") : [a, "default"];
				this.listeners.push({
					event: c[0],
					ns: c[1],
					callback: b
				});
				return this
			};
			this.removeListener = function(a, b) {
				for (var c = this.listeners.length, e = -1 < a.indexOf(".") ? a.split(".") : [a, "*"], d = 0; d < c; d++) void 0 == this.listeners[d] || this.listeners[d].event != e[0] && "*" !== e[0] || this.listeners[d].ns != e[1] && "*" !== e[1] || this.listeners[d].callback != b && null != b || this.listeners.splice(d, 1);
				return this
			};
			this.setItem = function(a, b, c) {
				var e = 0;
				this._clearqueue();
				null == a ? (e = this._removeItem(b), e === this._currentItem && this.setActiveItem("previous")) : (e = this._addItem(this._prepareMedia({
					file: a,
					config: a.config || {}
				}), b, c), e === this._currentItem && this.setActiveItem(this._currentItem));
				return this
			};
			this.setFile = function(a, b) {
				var c = a || "",
					e = b || this._getTypeFromFileExtension(c),
					d = [];
				if (!0 === this.env.loading) return this;
				this._clearqueue();
				this.env.loading = !0;
				this._detachplayerModel();
				if ("object" == typeof c) return $p.utils.log("Applying incoming JS Object", c), this._reelUpdate(c), this;
				d[0] = {};
				d[0].file = {};
				d[0].file.src = c || "";
				d[0].file.type = e || this._getTypeFromFileExtension(splt[0]);
				if (-1 < d[0].file.type.indexOf("/xml") || -1 < d[0].file.type.indexOf("/json")) return $p.utils.log("Loading external data from " + d[0].file.src + " supposed to be " + d[0].file.type), this._playlistServer = d[0].file.src, this.getFromUrl(d[0].file.src, this, "_reelUpdate", this.getConfig("reelParser"), d[0].file.type), this;
				$p.utils.log("Applying incoming single file:" + d[0].file.src, d);
				this._reelUpdate(d);
				return this
			};
			this.setPlaybackQuality = function(a) {
				a = a || this.getAppropriateQuality(); - 1 < d.inArray(a, this.media[this._currentItem].qualities || []) && (this.playerModel.applyCommand("quality", a), this.setConfig({
					playbackQuality: a
				}));
				return this
			};
			this.openUrl = function(a) {
				a = a || {
					url: "",
					target: "",
					pause: !1
				};
				if ("" == a.url) return this;
				!0 === a.pause && this.setPause();
				window.open(a.url, a.target).focus();
				return this
			};
			this.selfDestruct = this.destroy = function() {
				var a = this;
				this._enqueue(function() {
					a._destroy()
				});
				return this
			};
			this._destroy = function() {
				var a = this;
				d(this).unbind();
				this.removePlugins();
				this.playerModel.destroy();
				this._removeGUIListeners();
				d.each(b, function(c) {
					try {
						this.getId() != a.getId() && this.getId() != a.getId() && this.getParent() != a.getId() || b.splice(c, 1)
					} catch (e) {}
				});
				this.env.playerDom.replaceWith(this.env.srcNode);
				this._promote("destroyed");
				this.removeListener("*");
				return this
			};
			this.reset = function() {
				var a = this;
				this._clearqueue();
				this._enqueue(function() {
					a._reset()
				});
				return this
			};
			this._reset = function() {
				var a = {};
				this.setFullscreen(!1);
				d(this).unbind();
				d(this.getIframe() ? parent.window.document : document).unbind(".miguVideo");
				d(window).unbind(".miguVideo" + this.getId());
				this.playerModel.destroy();
				this.playerModel = {};
				this.removePlugins();
				this._removeGUIListeners();
				this._currentItem = this.env.mediaContainer = null;
				for (var b in this.config) a["_" == b.substr(0, 1) ? b.substr(1) : b] = this.config[b];
				"function" === typeof this.env.onReady && this._enqueue(this.env.onReady(this));
				this._init(this.env.playerDom, a);
				return this
			};
			this._enqueue = function(a, b, c) {
				null != a && (this._queue.push({
					command: a,
					params: b,
					delay: c
				}), this._processQueue())
			};
			this._clearqueue = function(a, b) {
				!0 === this._isReady && (this._queue = [])
			};
			this._processQueue = function() {
				var a = this,
					b = !1;
				!0 !== this._processing && !0 !== this.env.loading && (this._processing = !0, function() {
					try {
						b = a.playerModel.getIsReady()
					} catch (c) {}
					if (!0 !== a.env.loading && b) {
						try {
							var e = a._queue.shift();
							null != e && ("string" == typeof e.command ? 0 < e.delay ? setTimeout(function() {
								a.playerModel.applyCommand(e.command, e.params)
							}, e.delay) : a.playerModel.applyCommand(e.command, e.params) : e.command(a))
						} catch (d) {
							$p.utils.log("ERROR:", d)
						}
						0 == a._queue.length ? (!1 === a._isReady && (a._isReady = !0), a._processing = !1) : arguments.callee()
					} else setTimeout(arguments.callee, 100)
				}())
			};
			this._getTypeFromFileExtension = function(a) {
				var b = "",
					c = [],
					e = {},
					c = [],
					f = null,
					g = !0,
					h;
				for (h in $p.mmap) if ($p.mmap.hasOwnProperty(h)) {
					f = $p.mmap[h].platform;
					"object" != typeof f && (f = [f]);
					for (var g = !0, k = 0; k < f.length; k++) null == f[k] || !1 !== this.getConfig("enable" + f[k].toUpperCase() + "Platform") && -1 !== d.inArray(f[k], this.getConfig("platforms")) || (g = !1);
					!1 !== g && (c.push("\\." + $p.mmap[h].ext), e[$p.mmap[h].ext] = $p.mmap[h])
				}
				c = "^.*.(" + c.join("|") + ")";
				try {
					b = (b = a.match(new RegExp(c))[1]) ? b.replace(".", "") : "NaN"
				} catch (l) {
					b = "NaN"
				}
				return e[b].type
			};
			this._testMediaSupport = function(a) {
				var b = {},
					c = [],
					e = "",
					f = this;
				if (a) {
					if (null != $p._platformTableCache) return $p._platformTableCache
				} else if (null != $p._compTableCache) return $p._compTableCache;
				for (var g = 0; g < $p.mmap.length; g++) $p.mmap.hasOwnProperty(g) && (platforms = "object" == typeof $p.mmap[g].platform ? $p.mmap[g].platform : [$p.mmap[g].platform], d.each(platforms, function(a, h) {
					if (null == h) return !0;
					e = $p.mmap[g].streamType || ["http"];
					d.each(e, function(a, e) {
						null == b[e] && (b[e] = {});
						null == b[e][h] && (b[e][h] = []);
						if (-1 < d.inArray($p.mmap[g].type, b[e][h])) return !0;
						var k = ($p.models[$p.mmap[g].model.toUpperCase()].prototype[h.toLowerCase() + "Version"] || "1").toString();
						try {
							$p.utils.versionCompare($p.platforms[h.toUpperCase()]($p.mmap[g].type), k) && 0 != f.getConfig("enable" + h.toUpperCase() + "Platform") && -1 < d.inArray(h.toLowerCase(), f.getConfig("platforms")) && (b[e][h].push($p.mmap[g].type), -1 == d.inArray(h.toUpperCase(), c) && c.push(h.toUpperCase()))
						} catch (w) {
							$p.utils.log("ERROR", "platform " + h + " not defined")
						}
						return !0
					});
					return !0
				}));
				$p._compTableCache = b;
				$p._platformTableCache = c;
				return a ? $p._platformTableCache : $p._compTableCache
			};
			this._readMediaTag = function(a) {
				var b = {},
					c = "",
					e = [],
					f = this;
				if (-1 == "VIDEOAUDIO".indexOf(a[0].tagName.toUpperCase())) return !1;
				this.getConfig("ignoreAttributes") || (b = {
					autoplay: void 0 === a.attr("autoplay") && void 0 === a.prop("autoplay") || !1 === a.prop("autoplay") ? !1 : !0,
					controls: void 0 === a.attr("controls") && void 0 === a.prop("controls") || !1 === a.prop("controls") ? !1 : !0,
					loop: void 0 === a.attr("autoplay") && void 0 === a.prop("loop") || !1 === a.prop("loop") ? !1 : !0,
					title: void 0 !== a.attr("title") && !1 !== a.attr("title") ? a.attr("title") : "",
					poster: void 0 !== a.attr("poster") && !1 !== a.attr("poster") ? a.attr("poster") : "",
					width: void 0 !== a.attr("width") && !1 !== a.attr("width") ? a.attr("width") : null,
					height: void 0 !== a.attr("height") && !1 !== a.attr("height") ? a.attr("height") : null
				});
				for (var c = d(d("<div></div>").html(d(a).clone())).html(), e = ["autoplay", "controls", "loop"], g = 0; g < e.length; g++) - 1 != c.indexOf(e[g]) && (b[e[g]] = !0);
				b.playlist = [];
				b.playlist[0] = [];
				b.playlist[0].config = {
					tracks: []
				};
				a.attr("src") && b.playlist[0].push({
					src: a.attr("src"),
					type: a.attr("type") || this._getTypeFromFileExtension(a.attr("src"))
				});
				if (!d("<video/>").get(0).canPlayType) {
					c = a;
					do
					if (c = c.next("source,track"), c.attr("src")) switch (c.get(0).tagName.toUpperCase()) {
					case "SOURCE":
						b.playlist[0].push({
							src: c.attr("src"),
							type: c.attr("type") || this._getTypeFromFileExtension(c.attr("src")),
							quality: c.attr("data-quality") || ""
						});
						break;
					case "TRACK":
						d(this).attr("src") && b.playlist[0].config.tracks.push({
							src: c.attr("src"),
							kind: c.attr("kind") || "subtitle",
							lang: c.attr("srclang") || null,
							label: c.attr("label") || null
						})
					}
					while (c.attr("src"))
				}
				0 == b.playlist[0].length && a.children("source,track").each(function() {
					if (d(this).attr("src")) switch (d(this).get(0).tagName.toUpperCase()) {
					case "SOURCE":
						b.playlist[0].push({
							src: d(this).attr("src"),
							type: d(this).attr("type") || f._getTypeFromFileExtension(d(this).attr("src")),
							quality: d(this).attr("data-quality") || ""
						});
						break;
					case "TRACK":
						b.playlist[0].config.tracks.push({
							src: d(this).attr("src"),
							kind: d(this).attr("kind") || "subtitle",
							lang: d(this).attr("srclang") || null,
							label: d(this).attr("label") || null
						})
					}
				});
				return b
			};
			this._raiseError = function(a) {
				this.env.playerDom.html(a).css({
					color: "#fdfdfd",
					backgroundColor: "#333",
					lineHeight: this.config.height + "px",
					textAlign: "center",
					display: "block"
				});
				this._promote("error")
			};
			this._init = function(b, e) {
				var f = b || a,
					g = e || c,
					h = this._readMediaTag(f);
				this.env.srcNode = f.wrap("<div></div>").parent().html();
				f.unwrap();
				this.env.className = f.attr("class") || "";
				this._id = f[0].id || $p.utils.randomId(8);
				if (!1 !== h) {
					this.env.playerDom = d("<div/>").attr({
						"class": f[0].className,
						style: f.attr("style")
					});
					f.replaceWith(this.env.playerDom);
					f.empty().removeAttr("type").removeAttr("src");
					try {
						f.get(0).pause(), f.get(0).load()
					} catch (k) {}
					d("<div/>").append(f).get(0).innerHTML = ""
				} else this.env.playerDom = f;
				var g = d.extend(!0, {}, h, g),
					l;
				for (l in g) null != this.config["_" + l] ? this.config["_" + l] = g[l] : -1 < l.indexOf("plugin_") ? this.config[l] = d.extend(this.config[l], g[l]) : this.config[l] = g[l];
				$p.utils.logging = this.config._debug;
				this.setSize();
				this.getIsMobileClient() && (this.config._autoplay = !1, this.config.fixedVolume = !0);
				this.env.playerDom.attr("id", this._id);
				if (this.config._theme) switch (typeof this.config._theme) {
				case "object":
					this._applyTheme(this.config._theme)
				} else this._start(!1);
				return this
			};
			this._start = function(a) {
				var b = this;
				a = this.getIframeParent();
				this._registerPlugins();
				!0 === this.config._iframe && (a ? a.ready(function() {
					b._enterFullViewport(!0)
				}) : b._enterFullViewport(!0));
				!1 === a && (this.config._isCrossDomain = !0);
				this.getIframeAllowFullscreen() || (this.config.enableFullscreen = !1);
				"function" === typeof e && this._enqueue(function() {
					e(b)
				});
				for (var c in this.config._playlist[0]) if (this.config._playlist[0][c].type && (-1 < this.config._playlist[0][c].type.indexOf("/json") || -1 < this.config._playlist[0][c].type.indexOf("/xml"))) return this.setFile(this.config._playlist[0][c].src, this.config._playlist[0][c].type), this;
				this.setFile(this.config._playlist);
				return this
			};
			this._applyTheme = function(a) {
				if (!1 === a) return this._raiseError("The miguVideo theme-set specified could not be loaded."), !1;
				"string" == typeof a.css && d("head").append('<style type="text/css">' + $p.utils.parseTemplate(a.css, {
					rp: a.baseURL
				}) + "</style>");
				"string" == typeof a.html && this.env.playerDom.html($p.utils.parseTemplate(a.html, {
					p: this.getNS()
				}));
				this.env.playerDom.addClass(a.id).addClass(a.variation);
				this.env.className = this.env.className && 0 !== this.env.className.length ? this.env.className + " " + a.id : a.id;
				a.variation && 0 !== a.variation.length && (this.env.className += " " + a.variation);
				if ("object" == typeof a.config) {
					for (var b in a.config) null != this.config["_" + b] ? this.config["_" + b] = a.config[b] : -1 < b.indexOf("plugin_") ? this.config[b] = d.extend(!0, {}, this.config[b], a.config[b]) : this.config[b] = a.config[b];
					if ("object" == typeof a.config.plugins) for (b = 0; b < a.config.plugins.length; b++) try {
						typeof eval("miguVideo" + a.config.plugins[b])
					} catch (c) {
						return this._raiseError("The applied theme requires the following miguVideo plugin(s): <b>" + a.config.plugins.join(", ") + "</b>"), !1
					}
				}
				a.onReady && this._enqueue(function(b) {
					eval(a.onReady)
				});
				return this._start()
			};
			return this._init()
		}
		var e = arguments[0],
			f = [];
		if (!arguments.length) return b[0] || null;
		if ("number" == typeof e) return b[e];
		if ("string" == typeof e) {
			if ("*" == e) return new a(b);
			for (var g = 0; g < b.length; g++) {
				try {
					if (b[g].getId() == e.id) {
						f.push(b[g]);
						continue
					}
				} catch (k) {}
				try {
					for (var h = 0; h < d(e).length; h++) b[g].env.playerDom.get(0) == d(e).get(h) && f.push(b[g])
				} catch (l) {}
				try {
					if (b[g].getParent() == e) {
						f.push(b[g]);
						continue
					}
				} catch (m) {}
				try {
					b[g].getId() == e && f.push(b[g])
				} catch (s) {}
			}
			if (0 < f.length) return 1 == f.length ? f[0] : new a(f)
		}
		if (0 === f.length) {
			var q = arguments[1] || {},
				r = arguments[2] || {},
				u = 0,
				t;
			if ("string" == typeof e) return d.each(d(e), function() {
				t = new c(d(this), q, r);
				b.push(t);
				u++
			}), 1 < u ? new a(b) : t;
			if (e) return b.push(new c(e, q, r)), new a(b)
		}
		return null
	};
	$p.mmap = [];
	$p.models = {};
	$p.newModel = function(a, b) {
		if ("object" != typeof a || !a.modelId) return f;
		var f = !1,
			g = $p.models[b] && void 0 != b ? $p.models[b].prototype : {};
		if ($p.models[a.modelId]) return f;
		$p.models[a.modelId] = function() {};
		$p.models[a.modelId].prototype = d.extend({}, g, a);
		a.setiLove && a.setiLove();
		$p.mmap = d.grep($p.mmap, function(b) {
			var e = b.model != (a.replace ? a.replace.toLowerCase() : "");
			b = b.replaces != a.modelId;
			return e && b
		});
		for (f = 0; f < a.iLove.length; f++) a.iLove[f].model = a.modelId.toLowerCase(), a.iLove[f].replaces = a.replace ? a.replace.toLowerCase() : "", $p.mmap.push(a.iLove[f]);
		return !0
	}
});
var miguVideoConfig = function(d) {
		this._version = d
	};
miguVideoConfig.prototype = {
	_playerName: "miguVideo",
	_playerHome: "http://www.migu.com",
	_plugins: ["display", "controlbar", "aD"],
	_addplugins: [],
	_reelParser: null,
	_ns: "pp",
	_platforms: ["browser", "android", "ios", "native"],
	_iframe: !1,
	_ignoreAttributes: !1,
	_loop: !1,
	_autoplay: !0,
	_continuous: !0,
	_thereCanBeOnlyOne: !0,
	_leaveFullscreen: !0,
	_playlist: [],
	_theme: !1,
	_themeRepo: !1,
	_messages: {
		0: "#0 一个未知的错误.",
		1: "#1 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		2: "#2 网络错误. ",
		3: "#3 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		4: "#4 因为服务器或网络原因，播放文件未找到.",
		5: "#5 抱歉，您的浏览器不支持播放的文件类型.",
		6: "#6 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		7: "#7 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		8: "#8 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		9: "#9 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		10: "#10 清晰度设置不正确.",
		11: "#11 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		12: "#12 Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		80: "#80 请求文件不存在.",
		97: " Oops...播放失败了...<br>请刷新试试，如果长时间无法观看，请升级到ie9以上或更换chrome或火狐浏览器试试",
		98: "无效的播放列表数据.",
		99: "Click display to proceed. ",
		100: "Keyboard Shortcuts",
		110: "您还没有购买,请到右侧订购观看"
	},
	_debug: !1,
	_width: null,
	_height: null,
	_ratio: !1,
	_keys: [],
	_isCrossDomain: !1,
	_forceFullViewport: !1,
	id: 0,
	title: null,
	cat: "clip",
	poster: null,
	controls: !0,
	start: !1,
	stop: !1,
	volume: .5,
	cover: "",
	disablePause: !1,
	disallowSkip: !1,
	fixedVolume: !1,
	imageScaling: "aspectratio",
	videoScaling: "aspectratio",
	playerFlashMP4: "",
	playerFlashMP3: "",
	streamType: "http",
	streamServer: "",
	startParameter: "start",
	useYTIframeAPI: !0,
	enableKeyboard: !0,
	enableFullscreen: !0,
	playbackQuality: "LC",
	playbackQualities: [{
		key: "LC",
		minHeight: 480,
		minWidth: [{
			ratio: 1.77,
			minWidth: 853
		}, {
			ratio: 1.33,
			minWidth: 640
		}]
	}, {
		key: "GQ",
		minHeight: 720,
		minWidth: [{
			ratio: 1.77,
			minWidth: 1280
		}, {
			ratio: 1.33,
			minWidth: 960
		}]
	}, {
		key: "CQ",
		minHeight: 1081,
		minWidth: [{
			ratio: 1.77,
			minWidth: 1920
		}, {
			ratio: 1.33,
			minWidth: 1440
		}]
	}],
	enableTestcard: !0,
	skipTestcard: !1,
	duration: 0,
	className: ""
};
jQuery(function(d) {
	$p.utils = {
		imageDummy: function() {
			return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII="
		},
		capitalise: function(a) {
			return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
		},
		blockSelection: function(a) {
			a && a.css({
				"-khtml-user-select": "none",
				"-webkit-user-select": "none",
				MozUserSelect: "none",
				"user-select": "none"
			}).attr("unselectable", "on").bind("selectstart", function() {
				return !1
			});
			return a
		},
		unique: function(a) {
			for (var b = [], c = a.length; c--;) {
				var e = a[c]; - 1 === d.inArray(e, b) && b.unshift(e)
			}
			return b
		},
		intersect: function(a, b) {
			var c = [];
			d.each(a, function(e) {
				try {
					-1 < d.inArray(b, a[e]) && c.push(a[e])
				} catch (f) {}
				try {
					-1 < d.inArray(a[e], b) && c.push(a[e])
				} catch (g) {}
			});
			return c
		},
		roundNumber: function(a, b) {
			return 0 >= a || isNaN(a) ? 0 : Math.round(a * Math.pow(10, b)) / Math.pow(10, b)
		},
		randomId: function(a) {
			for (var b = "", c = 0; c < a; c++) var e = Math.floor(25 * Math.random()),
				b = b + "abcdefghiklmnopqrstuvwxyz".substring(e, e + 1);
			return b
		},
		toAbsoluteURL: function(a) {
			var b = location,
				c, e;
			if (null == a || "" == a) return "";
			if (/^\w+:/.test(a)) return a;
			c = b.protocol + "//" + b.host;
			if (0 === a.indexOf("/")) return c + a;
			b = b.pathname.replace(/\/[^\/]*$/, "");
			if (e = a.match(/\.\.\//g)) for (a = a.substring(3 * e.length), e = e.length; e--;) b = b.substring(0, b.lastIndexOf("/"));
			return c + b + "/" + a
		},
		strip: function(a) {
			return a.replace(/^\s+|\s+$/g, "")
		},
		toSeconds: function(a) {
			var b = 0;
			if ("string" != typeof a) return a;
			if (a) for (a = a.split(":"), 3 < a.length && (a = a.slice(0, 3)), i = 0; i < a.length; i++) b = 60 * b + parseFloat(a[i].replace(",", "."));
			return parseFloat(b)
		},
		toTimeString: function(a, b) {
			var c = Math.floor(a / 3600),
				e = a % 3600,
				d = Math.floor(e / 60),
				e = Math.floor(e % 60);
			10 > c && (c = "0" + c);
			10 > d && (d = "0" + d);
			10 > e && (e = "0" + e);
			return !0 === b ? c + ":" + d : c + ":" + d + ":" + e
		},
		parseTemplate: function(a, b, c) {
			if (void 0 === b || 0 == b.length || "object" != typeof b) return a;
			for (var e in b) a = a.replace(new RegExp("%{" + e + "}", "gi"), !0 === c ? window.encodeURIComponent(b[e]) : b[e]);
			return a = a.replace(/%{(.*?)}/gi, "")
		},
		stretch: function(a, b, c, e, f, g) {
			if (null == b) return !1;
			!1 === b instanceof d && (b = d(b));
			b.data("od") || b.data("od", {
				width: b.width(),
				height: b.height()
			});
			f = void 0 !== f ? f : b.data("od").width;
			g = void 0 !== g ? g : b.data("od").height;
			var k = c / f,
				h = e / g,
				l = c,
				m = e;
			switch (a) {
			case "none":
				l = f;
				m = g;
				break;
			case "fill":
				k > h ? (l = f * k, m = g * k) : k < h && (l = f * h, m = g * h);
				break;
			default:
				k > h ? (l = f * h, m = g * h) : k < h && (l = f * k, m = g * k)
			}
			c = $p.utils.roundNumber(l / c * 100, 0);
			e = $p.utils.roundNumber(m / e * 100, 0);
			if (0 === c || 0 === e) return !1;
			b.css({
				margin: 0,
				padding: 0,
				width: c + "%",
				height: e + "%",
				left: (100 - c) / 2 + "%",
				top: (100 - e) / 2 + "%"
			});
			return b.data("od").width != b.width() || b.data("od").height != b.height() ? !0 : !1
		},
		parseUri: function(a) {
			var b = "source protocol authority userInfo user password host port relative path directory file query anchor".split(" ");
			a = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(a);
			for (var c = {}, e = 14; e--;) c[b[e]] = a[e] || "";
			c.queryKey = {};
			c[b[12]].replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(a, b, e) {
				b && (c.queryKey[b] = e)
			});
			return c
		},
		log: function() {
			!1 !== this.logging && (this.history = this.history || [], this.history.push(arguments), window.console && console.log(Array.prototype.slice.call(arguments)))
		},
		cleanResponse: function(a, b) {
			var c = !1;
			switch (b) {
			case "html":
			case "xml":
				window.DOMParser ? (c = new DOMParser, c = c.parseFromString(a, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(a));
				break;
			case "json":
				c = a;
				"string" == typeof c && (c = d.parseJSON(c));
				break;
			case "jsonp":
				break;
			default:
				c = a
			}
			return c
		},
		cssTransitions: function() {
			var a = document.createElement("z").style;
			a: {
				var b = ("animationName " + ["Webkit", "Moz", "O", "ms", "Khtml"].join("AnimationName ") + "AnimationName").split(" "),
					c;
				for (c in b) if (null != a[b[c]]) {
					a = !0;
					break a
				}
				a = !1
			}
			return a
		},
		versionCompare: function(a, b) {
			for (var c = a.split("."), e = b.split("."), d = 0, d = 0; d < c.length; ++d) c[d] = Number(c[d]);
			for (d = 0; d < e.length; ++d) e[d] = Number(e[d]);
			2 == c.length && (c[2] = 0);
			return c[0] > e[0] ? !0 : c[0] < e[0] ? !1 : c[1] > e[1] ? !0 : c[1] < e[1] ? !1 : c[2] > e[2] ? !0 : c[2] < e[2] ? !1 : !0
		},
		stringify: function(a) {
			if ("JSON" in window) return JSON.stringify(a);
			var b = typeof a;
			if ("object" != b || null === a) return "string" == b && (a = '"' + a + '"'), String(a);
			var c, e, d = [],
				g = a && a.constructor == Array;
			for (c in a) a.hasOwnProperty(c) && (e = a[c], b = typeof e, a.hasOwnProperty(c) && ("string" == b ? e = '"' + e + '"' : "object" == b && null !== e && (e = $p.utils.stringify(e)), d.push((g ? "" : '"' + c + '":') + String(e))));
			return (g ? "[" : "{") + String(d) + (g ? "]" : "}")
		},
		logging: !1
	}
});
jQuery(function(d) {
	$p.platforms = {
		ANDROID: function(a) {
			try {
				return navigator.userAgent.toLowerCase().match(/android\s+(([\d\.]+))?/)[1].toString()
			} catch (b) {}
			return "0"
		},
		IOS: function(a) {
			a = navigator.userAgent.toLowerCase();
			var b = a.indexOf("os ");
			return (-1 < a.indexOf("iphone") || -1 < a.indexOf("ipad")) && -1 < b ? a.substr(b + 3, 3).replace("_", ".").toString() : "0"
		},
		NATIVE: function(a) {
			try {
				var b = d(-1 < a.indexOf("video") ? "<video/>" : "<audio/>").get(0);
				if (null != b.canPlayType) {
					if ("*" === a) return "1";
					switch (b.canPlayType(a)) {
					case "no":
					case "":
						break;
					default:
						return "1"
					}
				}
			} catch (c) {}
			return "0"
		},
		BROWSER: function(a) {
			return "1"
		}
	}
});
var miguVideoPluginInterface = function() {};
jQuery(function(d) {
	miguVideoPluginInterface.prototype = {
		pluginReady: !1,
		reqVer: null,
		name: "",
		pp: {},
		config: {},
		playerDom: null,
		_appliedDOMObj: [],
		_pageDOMContainer: {},
		_childDOMContainer: {},
		_init: function(a) {
			this.config = d.extend(!0, this.config, a);
			this.initialize()
		},
		getConfig: function(a, b) {
			var c = null,
				e = b || null;
			null != this.pp.getConfig("plugin_" + this.name) && (c = this.pp.getConfig("plugin_" + this.name)[a]);
			null == c && (c = this.pp.getConfig(a));
			null == c && (c = this.config[a]);
			"object" == typeof c && null === c.length ? c = d.extend(!0, {}, c, this.config[a]) : "object" == typeof c && (c = d.extend(!0, [], this.config[a] || [], c || []));
			return null == c ? e : c
		},
		getDA: function(a) {
			return "data-" + this.pp.getNS() + "-" + this.name + "-" + a
		},
		getCN: function(a) {
			return this.pp.getNS() + a
		},
		sendEvent: function(a, b) {
			this.pp._promote({
				_plugin: this.name,
				_event: a
			}, b)
		},
		deconstruct: function() {
			this.pluginReady = !1;
			d.each(this._appliedDOMObj, function() {
				d(this).unbind()
			})
		},
		applyToPlayer: function(a, b, c) {
			if (!a) return null;
			var e = b || "container";
			b = "";
			var f = this;
			try {
				b = a.attr("class") || this.name
			} catch (g) {
				b = this.name
			}
			this._pageDOMContainer[e] = d("[" + this.getDA("host") + "='" + this.pp.getId() + "'][" + this.getDA("func") + "='" + e + "']");
			this._childDOMContainer[e] = this.playerDom.find("[" + this.getDA("func") + "='" + e + "'],." + this.getCN(b) + ":not([" + this.getDA("func") + "=''])");
			if (0 < this._pageDOMContainer[e].length) return this._pageDOMContainer[e].removeClass("active").addClass("inactive"), d.each(this._pageDOMContainer[e], function() {
				f._appliedDOMObj.push(d(this))
			}), this._pageDOMContainer[e];
			if (0 == this._childDOMContainer[e].length) return a.removeClass(b).addClass(this.pp.getNS() + b).removeClass("active").addClass("inactive").attr(this.getDA("func"), e).appendTo(this.playerDom), this._childDOMContainer[e] = a, this._appliedDOMObj.push(a), !0 === c && a.addClass("active").removeClass("inactive"), a;
			d.each(this._childDOMContainer[e], function() {
				d(this).attr(f.getDA("func"), e);
				f._appliedDOMObj.push(d(this))
			});
			!0 === c && this._childDOMContainer[e].addClass("active").removeClass("inactive");
			return d(this._childDOMContainer[e][0])
		},
		getElement: function(a) {
			return this.pp.env.playerDom.find("." + this.pp.getNS() + a)
		},
		setInactive: function() {
			d(this._pageDOMContainer.container).removeClass("active").addClass("inactive");
			d(this._childDOMContainer.container).removeClass("active").addClass("inactive");
			this.sendEvent("inactive", d.extend(!0, {}, this._pageDOMContainer.container, this._childDOMContainer.container))
		},
		setActive: function(a, b) {
			var c = "object" == typeof a ? a : this.getElement(a);
			if (null == a) return this._pageDOMContainer.container.removeClass("inactive").addClass("active"), this._childDOMContainer.container.removeClass("inactive").addClass("active"), this.sendEvent("active", d.extend(!0, {}, this._pageDOMContainer.container, this._childDOMContainer.container)), c;
			0 != b ? c.addClass("active").removeClass("inactive") : c.addClass("inactive").removeClass("active");
			c.css("display", "");
			return c
		},
		getActive: function(a) {
			return d(a).hasClass("active")
		},
		initialize: function() {},
		isReady: function() {
			return this.pluginReady
		},
		clickHandler: function(a) {
			try {
				this.pp[this.getConfig(a + "Click").callback](this.getConfig(a + "Click").value)
			} catch (b) {
				try {
					this.getConfig(a + "Click")(this.getConfig(a + "Click").value)
				} catch (c) {}
			}
			return !1
		},
		eventHandler: function() {}
	}
});
var playerModel = function() {};
jQuery(function(d) {
	playerModel.prototype = {
		modelId: "player",
		iLove: [],
		_currentState: null,
		_currentBufferState: null,
		_currentSeekState: null,
		_ap: !1,
		_volume: 0,
		_quality: "default",
		_displayReady: !1,
		_isPlaying: !1,
		_id: null,
		_KbPerSec: 0,
		_bandWidthTimer: null,
		_isPoster: !1,
		_isFullscreen: !1,
		hasGUI: !1,
		allowRandomSeek: !1,
		flashVerifyMethod: "api_get",
		mediaElement: null,
		pp: {},
		media: {
			duration: 0,
			position: 0,
			maxpos: 0,
			offset: 0,
			file: !1,
			poster: "",
			ended: !1,
			loadProgress: 0,
			errorCode: 0
		},
		_init: function(a) {
			this.pp = a.pp || null;
			this.media = d.extend(!0, {}, this.media, a.media);
			this._ap = a.autoplay;
			this._isFullscreen = a.fullscreen;
			this._id = $p.utils.randomId(8);
			this._quality = a.quality || this._quality;
			this._volume = this.pp.getVolume();
			this._playbackQuality = this.pp.getPlaybackQuality();
			this.init()
		},
		init: function(a) {
			this.ready()
		},
		ready: function() {
			this.sendUpdate("modelReady");
			this._ap ? (this.sendUpdate("autostart", !0), this._setState("awakening")) : this.displayItem(!1)
		},
		displayItem: function(a) {
			this._isPoster = this._displayReady = !1;
			this.pp.removeListener("fullscreen.poster");
			this.pp.removeListener("resize.poster");
			!0 !== a || this.getState("STOPPED") ? (this._setState("idle"), this.applyImage(this.getPoster(), this.pp.getMediaContainer().html("")), this._isPoster = !0, this.displayReady()) : (d("#" + this.pp.getMediaId() + "_image").remove(), d("#" + this.pp.getId() + "_testcard_media").remove(), this.applyMedia(this.pp.getMediaContainer()))
		},
		applyMedia: function() {},
		sendUpdate: function(a, b) {
			"ERROR" != this._currentState && ("error" == a && this._setState("error"), this.pp._modelUpdateListener(a, b))
		},
		displayReady: function() {
			this._displayReady = !0;
			this.pp._modelUpdateListener("displayReady")
		},
		start: function() {
			var a = this;
			null == this.mediaElement && "PLAYLIST" != this.modelId || this.getState("STARTING") || (this._setState("STARTING"), this.getState("STOPPED") || this.addListeners(), this.pp.getIsMobileClient("ANDROID") && !this.getState("PLAYING") && setTimeout(function() {
				a.setPlay()
			}, 500), this.setPlay())
		},
		addListeners: function() {},
		removeListeners: function() {
			try {
				this.mediaElement.unbind(".miguVideo" + this.pp.getId())
			} catch (a) {}
		},
		detachMedia: function() {},
		destroy: function(a) {
			this.removeListeners();
			this.getState("IDLE") || this._setState("destroying");
			this.detachMedia();
			try {
				d("#" + this.mediaElement.id).empty()
			} catch (b) {}
			if (!this.pp.getIsMobileClient()) {
				try {
					d("#" + this.mediaElement.id).remove()
				} catch (c) {}
				try {
					this.mediaElement.remove()
				} catch (e) {}
				this.pp.getMediaContainer().html("")
			}
			this.mediaElement = null;
			this.media.loadProgress = 0;
			this.media.playProgress = 0;
			this.media.frame = 0;
			this.media.position = 0;
			this.media.duration = 0
		},
		reInit: function() {
			!1 === this.flashVersion && this._isFF() && !this.getState("ERROR") && !0 !== this.pp.getConfig("bypassFlashFFFix") && (this.sendUpdate("FFreinit"), this.removeListeners(), this.displayItem(!this.getState("IDLE")))
		},
		applyCommand: function(a, b) {
			switch (a) {
			case "quality":
				this.setQuality(b);
				break;
			case "error":
				this._setState("error");
				this.setTestcard(b);
				break;
			case "play":
				if (this.getState("ERROR")) break;
				if (this.getState("IDLE")) {
					this._setState("awakening");
					break
				}
				this.setPlay();
				break;
			case "pause":
				if (this.getState("ERROR")) break;
				this.setPause();
				break;
			case "volume":
				if (this.getState("ERROR")) break;
				this.setVolume(b) || (this._volume = b, this.sendUpdate("volume", b));
				break;
			case "stop":
				this.setStop();
				break;
			case "frame":
				this.setFrame(b);
				break;
			case "seek":
				if (this.getState("ERROR")) break;
				if (this.getSeekState("SEEKING")) break;
				if (this.getState("IDLE")) break;
				if (-1 == this.media.loadProgress) break;
				this._setSeekState("seeking", b);
				this.setSeek(b);
				break;
			case "fullscreen":
				if (b == this._isFullscreen) break;
				this._isFullscreen = b;
				this.sendUpdate("fullscreen", this._isFullscreen);
				this.reInit();
				this.setFullscreen();
				break;
			case "resize":
				this.setResize(), this.sendUpdate("resize", b)
			}
		},
		setFrame: function(a) {
			a = a / this.pp.getConfig("fps") + 1E-5;
			this.setSeek(a)
		},
		setSeek: function(a) {},
		setPlay: function() {},
		setPause: function() {},
		setStop: function() {
			this.detachMedia();
			this._setState("stopped");
			this.displayItem(!1)
		},
		setVolume: function(a) {},
		setFullscreen: function(a) {
			this.setResize()
		},
		setResize: function() {
			var a = this.pp.getMediaContainer();
			this.sendUpdate("scaled", {
				realWidth: this.media.videoWidth || null,
				realHeight: this.media.videoHeight || null,
				displayWidth: a.width(),
				displayHeight: a.height()
			})
		},
		setPosterLive: function() {},
		setQuality: function(a) {
			if (this._quality != a) {
				this._quality = a;
				try {
					this.applySrc()
				} catch (b) {}
				this.qualityChangeListener()
			}
		},
		getQuality: function() {
			return this._quality
		},
		getVolume: function() {
			return null == this.mediaElement ? this._volume : !0 === this.mediaElement.prop("muted") ? 0 : this.mediaElement.prop("volume")
		},
		getLoadProgress: function() {
			return this.media.loadProgress || 0
		},
		getLoadPlaybackProgress: function() {
			return this.media.playProgress || 0
		},
		getPosition: function() {
			return this.media.position || 0
		},
		getFrame: function() {
			return this.media.frame || 0
		},
		getDuration: function() {
			return this.media.duration || 0
		},
		getMaxPosition: function() {
			return this.media.maxpos || 0
		},
		getPlaybackQuality: function() {
			return -1 < d.inArray(this._quality, this.media.qualities) ? this._quality : "default"
		},
		getInFullscreen: function() {
			return this.pp.getInFullscreen()
		},
		getKbPerSec: function() {
			return this._KbPerSec
		},
		getState: function(a) {
			var b = null == this._currentState ? "IDLE" : this._currentState;
			return null != a ? b == a.toUpperCase() : b
		},
		getBufferState: function(a) {
			var b = null == this._currentBufferState ? "NONE" : this._currentBufferState;
			return null != a ? b == a.toUpperCase() : b
		},
		getSeekState: function(a) {
			var b = null == this._currentSeekState ? "NONE" : this._currentSeekState;
			return null != a ? b == a.toUpperCase() : b
		},
		getSrc: function() {
			try {
				return this.mediaElement.get(0).currentSrc
			} catch (a) {}
			try {
				return this.media.file[0].src
			} catch (b) {}
			try {
				return this.getPoster()
			} catch (c) {}
			return null
		},
		getModelName: function() {
			return this.modelId || null
		},
		getHasGUI: function() {
			return this.hasGUI && !this._isPoster
		},
		getIsReady: function() {
			return this._displayReady
		},
		getPoster: function() {
			var a = null,
				b = this.pp.getConfig("poster"),
				c = "default",
				c = [];
			if ("object" != typeof b) return b;
			for (var e in b) b[e].quality && c.push(b[e].quality);
			var c = this.pp.getAppropriateQuality(c),
				d;
			for (d in b) if (b[d].quality == c || "" == a || "default" == c) a = b[d].src;
			return a
		},
		getMediaElement: function() {
			return this.mediaElement || d("<video/>")
		},
		getMediaDimensions: function() {
			return {
				width: this.media.videoWidth || 0,
				height: this.media.videoHeight || 0
			}
		},
		getSource: function() {
			var a = [],
				b = this.media.offset || this.media.position || !1,
				c = this,
				e = "pseudo" == this.pp.getConfig("streamType") ? this.pp.getConfig("startParameter") : !1;
			d.each(this.media.file || [], function() {
				if (c._quality != this.quality && null !== c._quality) return !0;
				if (!e || !b) return a.push(this), !0;
				var f = $p.utils.parseUri(this.src),
					g = f.protocol + "://" + f.host + f.path,
					k = [];
				d.each(f.queryKey, function(a, b) {
					a != e && k.push(a + "=" + b)
				});
				this.src = g += 0 < k.length ? "?" + k.join("&") + "&" + e + "=" + b : "?" + e + "=" + b;
				a.push(this);
				return !0
			});
			return 0 === a.length ? this.media.file : a
		},
		timeListener: function(a) {
			if (null != a) {
				var b = parseFloat((a.position || a.currentTime || this.media.position || 0).toFixed(2));
				a = parseFloat((a.duration || 0).toFixed(2));
				if (!isNaN(a + b)) {
					if (0 != a && a != this.media.duration && !this.isPseudoStream || this.isPseudoStream && 0 == this.media.duration) this.media.duration = a, this.sendUpdate("durationChange", a);
					b != this.media.position && (this.isPseudoStream && Math.round(100 * b) / 100 == Math.round(100 * this.media.offset) / 100 ? this.media.position = this.media.offset : this.media.position = this.media.offset + b, this.media.maxpos = Math.max(this.media.maxpos || 0, this.media.position || 0), this.media.playProgress = parseFloat(0 < this.media.position && 0 < this.media.duration ? 100 * this.media.position / this.media.duration : 0), this.media.frame = this.media.position * this.pp.getConfig("fps"), this.sendUpdate("time", this.media.position), this.loadProgressUpdate())
				}
			}
		},
		loadProgressUpdate: function() {
			var a = this.mediaElement.get(0),
				b = 0;
			0 === this.media.duration || "object" !== typeof a.buffered || 0 === a.buffered.length && 0 === a.seekable.length || 100 == this.media.loadProgress || (b = a.seekable && 0 < a.seekable.length ? Math.round(100 * a.seekable.end(0) / this.media.duration) : Math.round(100 * a.buffered.end(a.buffered.length - 1)) / this.media.duration, this.media.loadProgress > b || (this.media.loadProgress = !0 === this.allowRandomSeek ? 100 : -1, this.media.loadProgress = 100 > this.media.loadProgress || void 0 === this.media.loadProgress ? b : 100, this.sendUpdate("progress", this.media.loadProgress)))
		},
		progressListener: function(a, b) {
			if (this.mediaElement instanceof jQuery && "object" == typeof this.mediaElement.get(0).buffered && 0 < this.mediaElement.get(0).buffered.length) this.mediaElement.unbind("progress");
			else {
				null == this._bandWidthTimer && (this._bandWidthTimer = (new Date).getTime());
				var c = 0,
					e = 0;
				try {
					isNaN(b.loaded / b.total) ? b.originalEvent && !isNaN(b.originalEvent.loaded / b.originalEvent.total) && (c = b.originalEvent.loaded, e = b.originalEvent.total) : (c = b.loaded, e = b.total)
				} catch (d) {
					a && !isNaN(a.loaded / a.total) && (c = a.loaded, e = a.total)
				}
				e = 0 < c && 0 < e ? 100 * c / e : 0;
				Math.round(e) > Math.round(this.media.loadProgress) && (this._KbPerSec = c / 1024 / (((new Date).getTime() - this._bandWidthTimer) / 1E3));
				e = 100 !== this.media.loadProgress ? e : 100;
				e = !0 === this.allowRandomSeek ? 100 : 5 * Math.round(e / 5);
				this.media.loadProgress != e && (this.media.loadProgress = e, this.sendUpdate("progress", e));
				100 <= this.media.loadProgress && !1 === this.allowRandomSeek && this._setBufferState("full")
			}
		},
		qualityChangeListener: function() {
			this.sendUpdate("qualityChange", this._quality)
		},
		endedListener: function(a) {
			null !== this.mediaElement && (0 >= this.media.maxpos || "STARTING" != this.getState() && this._setState("completed"))
		},
		waitingListener: function(a) {
			this._setBufferState("empty")
		},
		canplayListener: function(a) {
			this._setBufferState("full")
		},
		canplaythroughListener: function(a) {
			this._setBufferState("full")
		},
		suspendListener: function(a) {
			this._setBufferState("full")
		},
		playingListener: function(a) {
			this._setState("playing")
		},
		startListener: function(a) {
			this.applyCommand("volume", this.pp.getConfig("volume"));
			this.isPseudoStream || this.setSeek(this.media.position || 0);
			this._setState("playing")
		},
		pauseListener: function(a) {
			window.timer_ka && clearTimeout(window.timer_ka);
			this._setState("paused")
		},
		seekedListener: function(a) {
			this._setSeekState("SEEKED", this.media.position)
		},
		stalledListener: function(a) {
			this.sendUpdate("stalled")
		},
		volumeListener: function(a) {
			this.sendUpdate("volume", this.getVolume())
		},
		flashReadyListener: function() {},
		errorListener: function(a, b) {},
		metaDataListener: function(a) {
			try {
				this.media.videoWidth = a.videoWidth, this.media.videoHeight = a.videoHeight
			} catch (b) {}
			this._scaleVideo()
		},
		setTestcard: function(a, b) {
			var c = this.pp.getMediaContainer().html("").css({
				width: "100%",
				height: "100%"
			}),
				e = d.extend(this.pp.getConfig("messages"), this.pp.getConfig("msg")),
				f = null == e[a] ? 0 : a,
				g = void 0 !== b && "" !== b ? b : e[f];
			this.removeListeners();
			this.detachMedia();
			1 < this.pp.getItemCount() && (g += " " + e[99]);
			3 > g.length && (g = "ERROR");
			100 == f && (g = b);
			g = $p.utils.parseTemplate(g, d.extend({}, this.media, {
				title: this.pp.getConfig("title")
			}));
			this.mediaElement = d("<div/>").addClass(this.pp.getNS() + "testcard").attr("id", this.pp.getId() + "_testcard_media").html("<p>" + g + "</p>").appendTo(c);
			null != this.pp.getConfig("msg")[f] && this.mediaElement.addClass(this.pp.getNS() + "customtestcard")
		},
		applySrc: function() {},
		applyImage: function(a, b) {
			var c = d("<img/>").hide(),
				e = this;
			$p.utils.blockSelection(c);
			if (null == a || !1 === a) return d("<span/>").attr({
				id: this.pp.getMediaId() + "_image"
			}).appendTo(b);
			c.html("").appendTo(b).attr({
				id: this.pp.getMediaId() + "_image",
				alt: this.pp.getConfig("title") || ""
			}).css({
				position: "absolute"
			});
			c.error(function(a) {
				d(this).remove()
			});
			c.load(function(a) {
				a = a.currentTarget;
				c.data("od") || c.data("od", {
					width: a.naturalWidth,
					height: a.naturalHeight
				});
				c.show();
				$p.utils.stretch(e.pp.getConfig("imageScaling"), c, b.width(), b.height())
			});
			c.attr("src", a);
			var f = function(a, b) {
					!1 === b.is(":visible") && e.pp.removeListener("fullscreen", arguments.callee);
					b.width();
					b.height();
					a.width();
					a.height();
					if ($p.utils.stretch(e.pp.getConfig("imageScaling"), a, b.width(), b.height())) try {
						e.sendUpdate("scaled", {
							realWidth: a._originalDimensions.width,
							realHeight: a._originalDimensions.height,
							displayWidth: e.mediaElement.width(),
							displayHeight: e.mediaElement.height()
						})
					} catch (c) {}
					a.attr("src") != e.getPoster() && a.attr("src", e.getPoster())
				};
			this.pp.addListener("fullscreen.poster", function() {
				f(c, b)
			});
			this.pp.addListener("resize.poster", function() {
				f(c, b)
			});
			return c
		},
		_setState: function(a) {
			var b = this;
			a = a.toUpperCase();
			this._currentState != a && "ERROR" != this._currentState && ("PAUSED" == this._currentState && "PLAYING" == a && (this.sendUpdate("resume", this.media), this._isPlaying = !0), "IDLE" != this._currentState && "STARTING" != this._currentState || "PLAYING" != a || (this.sendUpdate("start", this.media), this._isPlaying = !0), "PAUSED" == a && (this._isPlaying = !1), "ERROR" == a && (this.setPlay = this.setPause = function() {
				b.sendUpdate("start")
			}), this._currentState = a.toUpperCase(), this.sendUpdate("state", this._currentState))
		},
		_setBufferState: function(a) {
			this._currentBufferState != a.toUpperCase() && (this._currentBufferState = a.toUpperCase(), this.sendUpdate("buffer", this._currentBufferState))
		},
		_setSeekState: function(a, b) {
			this._currentSeekState != a.toUpperCase() && (this._currentSeekState = a.toUpperCase(), this.sendUpdate("seek", this._currentSeekState))
		},
		_scaleVideo: function(a) {
			a = this.pp.getMediaContainer();
			if (!this.pp.getIsMobileClient()) try {
				var b = a.width(),
					c = a.height(),
					e = this.media.videoWidth,
					d = this.media.videoHeight;
				$p.utils.stretch(this.pp.getConfig("videoScaling"), this.mediaElement, b, c, e, d) && this.sendUpdate("scaled", {
					realWidth: e,
					realHeight: d,
					displayWidth: b,
					displayHeight: c
				})
			} catch (g) {}
		},
		_isFF: function() {
			return -1 < navigator.userAgent.toLowerCase().indexOf("firefox")
		}
	}
});
jQuery(function(d) {
	$p.newModel({
		modelId: "NA",
		iLove: [{
			ext: "NaN",
			type: "none/none",
			platform: "browser"
		}],
		hasGUI: !0,
		applyMedia: function(a) {
			var b = this;
			a.html("");
			a = function(a, e) {
				e.getState("AWAKENING") || (b.pp.removeListener("mousedown", arguments.callee), b._setState("completed"))
			};
			this.displayReady();
			this.pp.getConfig("enableTestcard") && !this.pp.getIsMobileClient() ? (this.pp.addListener("mousedown", a), this._setState("error"), this.setTestcard(null != this.media.file[0].src && 7 === this.media.errorCode ? 5 : this.media.errorCode)) : (this.applyCommand("stop"), window.location.href = this.media.file[0].src)
		},
		detachMedia: function() {
			this.pp.removeListener("leftclick", this.mouseClick)
		}
	})
});
jQuery(function(d) {
	$p.newModel({
		modelId: "VIDEO",
		androidVersion: "2",
		iosVersion: "3",
		nativeVersion: "1",
		iLove: [{
			ext: "mp4",
			type: "video/mp4",
			platform: ["ios", "android", "native"],
			streamType: ["http", "pseudo", "httpVideo"],
			fixed: "maybe"
		}, {
			ext: "m4v",
			type: "video/mp4",
			platform: ["ios", "android", "native"],
			streamType: ["http", "pseudo", "httpVideo"],
			fixed: "maybe"
		}, {
			ext: "ogv",
			type: "video/ogg",
			platform: "native",
			streamType: ["http", "httpVideo"]
		}, {
			ext: "webm",
			type: "video/webm",
			platform: "native",
			streamType: ["http", "httpVideo"]
		}, {
			ext: "ogg",
			type: "video/ogg",
			platform: "native",
			streamType: ["http", "httpVideo"]
		}, {
			ext: "anx",
			type: "video/ogg",
			platform: "native",
			streamType: ["http", "httpVideo"]
		}],
		_eventMap: {
			pause: "pauseListener",
			play: "playingListener",
			volumechange: "volumeListener",
			progress: "progressListener",
			timeupdate: "timeListener",
			ended: "_ended",
			waiting: "waitingListener",
			canplaythrough: "canplayListener",
			canplay: "canplayListener",
			error: "errorListener",
			suspend: "suspendListener",
			seeked: "seekedListener",
			loadedmetadata: "metaDataListener",
			loadstart: null,
			stalled: "stalledListener"
		},
		isGingerbread: !1,
		isAndroid: !1,
		allowRandomSeek: !1,
		videoWidth: 0,
		videoHeight: 0,
		wasPersistent: !0,
		isPseudoStream: !1,
		init: function() {
			var a = navigator.userAgent;
			0 <= a.indexOf("Android") && (this.isAndroid = !0, 3 > parseFloat(a.slice(a.indexOf("Android") + 8)) && (this.isGingerbread = !0));
			this.ready()
		},
		applyMedia: function(a) {
			0 === d("#" + this.pp.getMediaId() + "_html").length && (this.wasPersistent = !1, a.html("").append(d("<video/>").attr({
				id: this.pp.getMediaId() + "_html",
				poster: $p.utils.imageDummy(),
				loop: !1,
				autoplay: !1,
				preload: "preload",
				"x-webkit-airplay": "allow"
			}).prop({
				controls: !1,
				volume: this.getVolume()
			}).css({
				width: "100%",
				height: "100%",
				position: "absolute",
				top: 0,
				left: 0
			})));
			this.mediaElement = d("#" + this.pp.getMediaId() + "_html");
			this.applySrc()
		},
		applySrc: function() {
			var a = this,
				b = this.getSource(),
				c = a.getState("AWAKENING");
			this.mediaElement.attr("src", b[0].src);
			this.isGingerbread || this.mediaElement.attr("type", b[0].originalType);
			this.mediaElement.bind("mousedown.miguVideoqs" + this.pp.getId(), this.disableDefaultVideoElementActions);
			this.mediaElement.bind("click.miguVideoqs" + this.pp.getId(), this.disableDefaultVideoElementActions);
			b = function() {
				var b = "" == a.mediaElement.attr("src");
				a.mediaElement.unbind("loadstart.miguVideoqs" + a.pp.getId());
				a.mediaElement.unbind("loadeddata.miguVideoqs" + a.pp.getId());
				a.mediaElement.unbind("canplay.miguVideoqs" + a.pp.getId());
				var f = a.pp.getId() + "_testcard_media";
				b ? (a.mediaElement.hide(), a.pp.getInFullscreen() && a.pp.setFullscreen(!1), 0 != d("#" + f).length ? d("#" + f).show() : a.pp.getMediaContainer().append('<div class="pptestcard" id="' + f + '" style="margin: 0px; padding: 0px; width: 100%; height: 100%; "><p>您还没有购买,请到右侧订购观看</p></div>')) : (d("#" + f).hide(), a.mediaElement.show(), a.addListeners("error"), a.addListeners("play"), a.addListeners("canplay"), a.mediaElement = d("#" + a.pp.getMediaId() + "_html"), c ? a.displayReady() : a.getSeekState("SEEKING") ? (a._isPlaying && a.setPlay(), a.seekedListener()) : (a.isPseudoStream || a.setSeek(a.media.position || 0), a._isPlaying && a.setPlay()))
			};
			this.mediaElement.bind("loadstart.miguVideoqs" + this.pp.getId(), b);
			this.mediaElement.bind("loadeddata.miguVideoqs" + this.pp.getId(), b);
			this.mediaElement.bind("canplay.miguVideoqs" + this.pp.getId(), b);
			this.mediaElement[0].load();
			this.isGingerbread && b()
		},
		detachMedia: function() {
			try {
				this.removeListener("error"), this.removeListener("play"), this.removeListener("canplay"), this.mediaElement.unbind("mousedown.miguVideoqs" + this.pp.getId()), this.mediaElement.unbind("click.miguVideoqs" + this.pp.getId()), this.mediaElement[0].pause(), this.mediaElement.attr("src", ""), this.mediaElement[0].load()
			} catch (a) {}
		},
		addListeners: function(a, b) {
			if (null != this.mediaElement) {
				var c = null != b ? ".miguVideo" + b + this.pp.getId() : ".miguVideo" + this.pp.getId(),
					e = this,
					f = null == a ? "*" : a;
				d.each(this._eventMap, function(a, b) {
					a != f && "*" != f || null == b || e.mediaElement.bind(a + c, function(a) {
						e[b](this, a)
					})
				})
			}
		},
		removeListener: function(a, b) {
			if (null != this.mediaElement) {
				var c = null != b ? ".miguVideo" + b + this.pp.getId() : ".miguVideo" + this.pp.getId(),
					e = this;
				d.each(this._eventMap, function(b, d) {
					b == a && e.mediaElement.unbind(b + c)
				})
			}
		},
		_ended: function() {
			var a = this.mediaElement[0].duration,
				b = Math.round(this.media.position) === Math.round(a),
				a = 2 > a - this.media.maxpos && 0 === this.media.position || !1;
			b || a || this.isPseudoStream ? this.endedListener(this) : this.pauseListener(this)
		},
		playingListener: function(a) {
			var b = this;
			this.isGingerbread ||
			function() {
				try {
					0 === b.getDuration() && ("" !== b.mediaElement.get(0).currentSrc && b.mediaElement.get(0).networkState == b.mediaElement.get(0).NETWORK_NO_SOURCE ? b.sendUpdate("error", 80) : setTimeout(arguments.callee, 500))
				} catch (a) {}
			}();
			this._setState("playing")
		},
		errorListener: function(a, b) {
			try {
				switch (b.target.error.code) {
				case b.target.error.MEDIA_ERR_ABORTED:
					this.sendUpdate("error", 1);
					break;
				case b.target.error.MEDIA_ERR_NETWORK:
					this.sendUpdate("error", 2);
					break;
				case b.target.error.MEDIA_ERR_DECODE:
					this.sendUpdate("error", 3);
					break;
				case b.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
					break;
				default:
					this.sendUpdate("error", 5)
				}
			} catch (c) {}
		},
		canplayListener: function(a) {
			var b = this;
			"pseudo" == this.pp.getConfig("streamType") && d.each(this.media.file, function() {
				return -1 < this.src.indexOf(b.mediaElement[0].currentSrc) && "video/mp4" == this.type ? (b.isPseudoStream = !0, b.allowRandomSeek = !0, b.media.loadProgress = 100, !1) : !0
			});
			this._setBufferState("full")
		},
		disableDefaultVideoElementActions: function(a) {
			a.preventDefault();
			a.stopPropagation()
		},
		setPlay: function() {
			if (d(this.mediaElement[0]).attr("src")) try {
				this.mediaElement[0].play()
			} catch (a) {}
		},
		setPause: function() {
			try {
				this.mediaElement[0].pause()
			} catch (a) {}
		},
		setVolume: function(a) {
			this._volume = a;
			try {
				this.mediaElement.prop("volume", a)
			} catch (b) {
				return !1
			}
			return a
		},
		setSeek: function(a) {
			var b = this;
			this.isPseudoStream ? (this.media.position = 0, this.media.offset = a, this.applySrc()) : function() {
				try {
					b.mediaElement[0].currentTime = a, b.timeListener({
						position: a
					})
				} catch (c) {
					null != b.mediaElement && setTimeout(arguments.callee, 100)
				}
			}()
		},
		setFullscreen: function(a) {
			"audio" != this.element && this._scaleVideo()
		},
		setResize: function() {
			"audio" != this.element && this._scaleVideo(!1)
		}
	});
	$p.newModel({
		modelId: "AUDIO",
		iLove: [{
			ext: "ogg",
			type: "audio/ogg",
			platform: "native",
			streamType: ["http", "httpAudio"]
		}, {
			ext: "oga",
			type: "audio/ogg",
			platform: "native",
			streamType: ["http", "httpAudio"]
		}, {
			ext: "mp3",
			type: "audio/mp3",
			platform: ["ios", "android", "native"],
			streamType: ["http", "httpAudio"]
		}, {
			ext: "mp3",
			type: "audio/mpeg",
			platform: ["ios", "android", "native"],
			streamType: ["http", "httpAudio"]
		}],
		imageElement: {},
		applyMedia: function(a) {
			$p.utils.blockSelection(a);
			this.imageElement = this.applyImage(this.getPoster("cover") || this.getPoster("poster"), a);
			this.imageElement.css({
				border: "0px"
			});
			0 === d("#" + this.pp.getMediaId() + "_html").length && (this.wasPersistent = !1, a.html("").append(d(this.isGingerbread ? "<video/>" : "<audio/>").attr({
				id: this.pp.getMediaId() + "_html",
				poster: $p.utils.imageDummy(),
				loop: !1,
				autoplay: !1,
				preload: "preload",
				"x-webkit-airplay": "allow"
			}).prop({
				controls: !1,
				volume: this.getVolume()
			}).css({
				width: "1px",
				height: "1px",
				position: "absolute",
				top: 0,
				left: 0
			})));
			this.mediaElement = d("#" + this.pp.getMediaId() + "_html");
			this.applySrc()
		},
		setPosterLive: function() {
			if (this.imageElement.parent) {
				var a = this.imageElement.parent(),
					b = this;
				this.imageElement.attr("src") == this.getPoster("cover") || this.getPoster("poster") || this.imageElement.fadeOut("fast", function() {
					d(this).remove();
					b.imageElement = b.applyImage(b.getPoster("cover") || b.getPoster("poster"), a)
				})
			}
		}
	}, "VIDEO")
});
jQuery(function(d) {
	$p.newModel({
		modelId: "PLAYLIST",
		iLove: [{
			ext: "json",
			type: "text/json",
			platform: "browser"
		}, {
			ext: "jsonp",
			type: "text/jsonp",
			platform: "browser"
		}, {
			ext: "xml",
			type: "text/xml",
			platform: "browser"
		}, {
			ext: "json",
			type: "application/json",
			platform: "browser"
		}, {
			ext: "jsonp",
			type: "application/jsonp",
			platform: "browser"
		}, {
			ext: "xml",
			type: "application/xml",
			platform: "browser"
		}],
		applyMedia: function(a) {
			this.displayReady()
		},
		setPlay: function() {
			this.sendUpdate("playlist", this.media)
		}
	})
});
jQuery(function(d) {
	$p.newModel({
		browserVersion: "1",
		modelId: "IMAGE",
		iLove: [{
			ext: "jpg",
			type: "image/jpeg",
			platform: "browser",
			streamType: ["http"]
		}, {
			ext: "gif",
			type: "image/gif",
			platform: "browser",
			streamType: ["http"]
		}, {
			ext: "png",
			type: "image/png",
			platform: "browser",
			streamType: ["http"]
		}],
		allowRandomSeek: !0,
		_position: 0,
		_duration: 0,
		applyMedia: function(a) {
			this.mediaElement = this.applyImage(this.media.file[0].src, a.html(""));
			this._duration = this.pp.getConfig("duration") || 1;
			this._position = -1;
			this.displayReady();
			this._position = -.5
		},
		setPlay: function() {
			var a = this;
			this._setBufferState("full");
			this.progressListener(100);
			this.playingListener();
			0 == this._duration ? a._setState("completed") : function() {
				a._position >= a._duration ? a._setState("completed") : a.getState("PLAYING") && (a.timeListener({
					duration: a._duration,
					position: a._position
				}), setTimeout(arguments.callee, 200), a._position += .2)
			}()
		},
		detachMedia: function() {
			this.mediaElement.remove()
		},
		setPause: function() {
			this.pauseListener()
		},
		setSeek: function(a) {
			a < this._duration && (this._position = a, this.seekedListener())
		}
	});
	$p.newModel({
		modelId: "HTML",
		iLove: [{
			ext: "html",
			type: "text/html",
			platform: "browser",
			streamType: ["http"]
		}],
		applyMedia: function(a) {
			var b = this;
			this.mediaElement = d(document.createElement("iframe")).attr({
				id: this.pp.getMediaId() + "_iframe",
				name: this.pp.getMediaId() + "_iframe",
				src: this.media.file[0].src,
				scrolling: "no",
				frameborder: "0",
				width: "100%",
				height: "100%"
			}).css({
				overflow: "hidden",
				border: "0px",
				width: "100%",
				height: "100%"
			}).appendTo(a.html(""));
			this.mediaElement.load(function(a) {
				b.success()
			});
			this.mediaElement.error(function(a) {
				b.remove()
			});
			this._duration = this.pp.getConfig("duration")
		},
		success: function() {
			this.displayReady()
		},
		remove: function() {
			this.mediaElement.remove()
		}
	}, "IMAGE")
});
var miguVideoDisplay = function() {};
jQuery(function(d) {
	miguVideoDisplay.prototype = {
		version: "1.1.00",
		logo: null,
		logoIsFading: !1,
		display: null,
		displayClicks: 0,
		buffIcn: null,
		buffIcnSprite: null,
		bufferDelayTimer: null,
		_controlsDims: null,
		config: {
			displayClick: {
				callback: "setPlayPause",
				value: null
			},
			displayPlayingClick: {
				callback: "setPlayPause",
				value: null
			},
			displayDblClick: {
				callback: null,
				value: null
			},
			staticControls: !1,
			bufferIconDelay: 1E3,
			spriteUrl: "",
			spriteWidth: 50,
			spriteHeight: 50,
			spriteTiles: 25,
			spriteOffset: 1,
			spriteCountUp: !1
		},
		initialize: function() {
			this.display = this.applyToPlayer(d("<div/>"));
			this.startButton = this.applyToPlayer(d("<div/>").addClass("start"), "startbtn");
			this.buffIcn = this.applyToPlayer(d("<div/>").addClass("buffering"), "buffericn");
			this.imaContainer = this.applyToPlayer(d("<div/>").addClass("ima"), "ima");
			this.setActive();
			"" !== this.config.spriteUrl && (this.buffIcnSprite = d("<div/>").appendTo(this.buffIcn).css({
				width: this.config.spriteWidth,
				height: this.config.spriteHeight,
				marginLeft: (this.buffIcn.width() - this.config.spriteWidth) / 2 + "px",
				marginTop: (this.buffIcn.height() - this.config.spriteHeight) / 2 + "px",
				backgroundColor: "transparent",
				backgroundImage: "url(" + this.config.spriteUrl + ")",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "0 0"
			}).addClass("inactive"));
			this.pp.getMediaContainer();
			this.pluginReady = !0
		},
		displayReadyHandler: function() {
			var a = this;
			this.hideStartButton();
			this.startButton.unbind().click(function() {
				a.pp.setPlay()
			})
		},
		syncingHandler: function() {
			this.showBufferIcon();
			this.pp.getState("IDLE") && this.hideStartButton()
		},
		readyHandler: function() {
			this.hideBufferIcon();
			this.pp.getState("IDLE") && this.showStartButton()
		},
		bufferHandler: function(a) {
			if (this.pp.getState("PLAYING") || this.pp.getState("AWAKENING"))"EMPTY" == a ? this.showBufferIcon() : this.hideBufferIcon()
		},
		stateHandler: function(a) {
			switch (a) {
			case "IDLE":
				clearTimeout(this._cursorTimer);
				this.display.css("cursor", "pointer");
				break;
			case "PLAYING":
				this.hideBufferIcon();
				this.hideStartButton();
				break;
			case "IDLE":
				this.showStartButton();
				break;
			case "STARTING":
			case "AWAKENING":
				this.showBufferIcon();
				this.hideStartButton();
				break;
			case "COMPLETED":
			case "STOPPED":
				this.hideBufferIcon();
				break;
			default:
				this.hideStartButton()
			}
		},
		errorHandler: function() {
			this.hideBufferIcon();
			this.hideStartButton()
		},
		startHandler: function() {
			this.mousemoveHandler()
		},
		scheduleLoadingHandler: function() {
			this.hideStartButton();
			this.showBufferIcon()
		},
		scheduledHandler: function() {
			this.getConfig("autoplay") || this.showStartButton();
			this.hideBufferIcon()
		},
		plugineventHandler: function(a) {
			"controlbar" == a.PLUGIN && "show" == a.EVENT && this.getConfig("staticControls") && (a = 100 * a.height / this.pp.getDC().height(), this.display.height(100 - a + "%").data("sc", !0))
		},
		qualityChangeHandler: function() {
			this.hideBufferIcon()
		},
		mousemoveHandler: function(a) {
			var b = this.display;
			this.pp.getState("IDLE") ? b.css("cursor", "pointer") : (b.css("cursor", "auto"), clearTimeout(this._cursorTimer), -1 == "AWAKENING|ERROR|PAUSED".indexOf(this.pp.getState()) && (this._cursorTimer = setTimeout(function() {
				b.css("cursor", "none")
			}, 3E3)))
		},
		mousedownHandler: function(a) {
			var b = this;
			if (-1 != (d(a.target).attr("id") || "").indexOf("_media") && (clearTimeout(this._cursorTimer), this.display.css("cursor", "auto"), 1 == a.which)) {
				switch (this.pp.getState()) {
				case "ERROR":
					this.pp.setConfig({
						disallowSkip: !1
					});
					return;
				case "IDLE":
					this.pp.setPlay();
					return
				}!0 !== this.pp.getHasGUI() && (this.displayClicks++, this.pp._promote("displayClick"), 0 < this.displayClicks && setTimeout(function() {
					1 == b.displayClicks ? "PLAYING" == b.pp.getState() ? b.clickHandler("displayPlaying") : b.clickHandler("display") : 2 == b.displayClicks && b.clickHandler("displayDbl");
					b.displayClicks = 0
				}, 250))
			}
		},
		showStartButton: function() {
			this.startButton.addClass("active").removeClass("inactive")
		},
		hideStartButton: function() {
			this.startButton.addClass("inactive").removeClass("active")
		},
		hideBufferIcon: function() {
			clearTimeout(this.bufferDelayTimer);
			this.buffIcn.addClass("inactive").removeClass("active")
		},
		showBufferIcon: function(a) {
			var b = this;
			clearTimeout(this.bufferDelayTimer);
			if (!this.pp.getHasGUI()) if ("YTAUDIO" !== this.pp.getModel() && "YTVIDEO" !== this.pp.getModel() || this.pp.getState("IDLE") || (a = !0), !0 !== a && 0 < this.getConfig("bufferIconDelay")) this.bufferDelayTimer = setTimeout(function() {
				b.showBufferIcon(!0)
			}, this.getConfig("bufferIconDelay"));
			else if (!this.buffIcn.hasClass("active") && (this.buffIcn.addClass("active").removeClass("inactive"), null !== b.buffIcnSprite)) {
				var c = !0 === b.config.spriteCountUp ? 0 : (b.config.spriteHeight + b.config.spriteOffset) * (b.config.spriteTiles - 1),
					e = c;
				b.buffIcnSprite.addClass("active").removeClass("inactive");
				(function() {
					if (b.buffIcn.is(":visible")) {
						b.buffIcnSprite.css("backgroundPosition", "0px -" + e + "px");
						e = !0 === b.config.spriteCountUp ? e + (b.config.spriteHeight + b.config.spriteOffset) : e - (b.config.spriteHeight + b.config.spriteOffset);
						if (e > (c + b.config.spriteHeight) * b.config.spriteTiles || e < b.config.spriteOffset) e = c;
						setTimeout(arguments.callee, 60)
					}
				})()
			}
		}
	}
});
var miguVideoControlbar = function() {};
jQuery(function(d) {
	miguVideoControlbar.prototype = {
		version: "1.1.01",
		_cTimer: null,
		_isDVR: !1,
		_noHide: !1,
		_vSliderAct: !1,
		cb: null,
		controlElements: {},
		controlElementsConfig: {
			sec_dur: null,
			min_dur: null,
			sec_abs_dur: null,
			min_abs_dur: null,
			hr_dur: null,
			sec_elp: null,
			min_elp: null,
			sec_abs_elp: null,
			min_abs_elp: null,
			hr_elp: null,
			sec_rem: null,
			min_rem: null,
			sec_abs_rem: null,
			min_abs_rem: null,
			hr_rem: null,
			sec_tip: null,
			min_tip: null,
			sec_abs_tip: null,
			min_abs_tip: null,
			hr_tip: null,
			cb: null,
			playhead: {
				on: null,
				call: null
			},
			loaded: null,
			golive: [{
				on: ["touchstart", "click"],
				call: "goliveClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			scrubber: null,
			scrubbertip: null,
			scrubberknob: null,
			scrubberdrag: [{
				on: ["mouseenter"],
				call: "scrubberShowTooltip"
			}, {
				on: ["mouseout"],
				call: "scrubberHideTooltip"
			}, {
				on: ["mousemove"],
				call: "scrubberdragTooltip"
			}, {
				on: ["mousedown"],
				call: "scrubberdragStartDragListener"
			}],
			play: [{
				on: ["touchstart", "click"],
				call: "playClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			pause: [{
				on: ["touchstart", "click"],
				call: "pauseClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			stop: [{
				on: ["touchstart", "click"],
				call: "stopClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			fsexit: [{
				on: ["touchstart", "click"],
				call: "exitFullscreenClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			fsenter: [{
				on: ["touchstart", "click"],
				call: "enterFullscreenClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			lcquality: [{
				on: ["touchstart", "click"],
				call: "setQualityClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			gqquality: [{
				on: ["touchstart", "click"],
				call: "setQualityClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			cqquality: [{
				on: ["touchstart", "click"],
				call: "setQualityClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			vslider: [{
				on: ["touchstart", "click"],
				call: "vsliderClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			vmarker: [{
				on: ["touchstart", "click"],
				call: "vsliderClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			vknob: {
				on: ["mousedown"],
				call: "vknobStartDragListener"
			},
			volumePanel: [{
				on: ["mousemove"],
				call: "volumeBtnHover"
			}, {
				on: ["mouseout"],
				call: "volumeBtnOut"
			}],
			volume: null,
			mute: [{
				on: ["touchstart", "click"],
				call: "muteClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			open: [{
				on: ["touchstart", "click"],
				call: "openCloseClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			close: [{
				on: ["touchstart", "click"],
				call: "openCloseClk"
			}, {
				on: ["touchend"],
				call: "touchEnd"
			}],
			draghandle: {
				on: ["mousedown"],
				call: "handleStartDragListener"
			},
			controls: null,
			title: null
		},
		config: {
			toggleMute: !1,
			showCuePoints: !1,
			fadeDelay: 2500,
			showOnStart: !1,
			showOnIdle: !1,
			controlsTemplate: '<div class="play_info" style="display:none;" id="ka_dun_tip"><p>当前网速较慢，建议您暂停缓冲一会儿再播放</p><span class="p_i_close">×</span></div><ul class="bottom"><li><div %{scrubber}><div %{loaded}></div><div %{playhead}><span ></span></div><div %{scrubberknob}></div><div %{scrubberdrag}></div></div></li></ul><ul class="left"><li><div %{play}></div><div %{pause}></div></li><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} | %{hr_dur}:%{min_dur}:%{sec_dur}</div></li></ul><ul class="right"><li><div %{fsexit}></div><div %{fsenter}></div></li><li class="quality"><ul class="qualityUl"><li %{lcquality}>标清</li><li %{gqquality}>高清</li><li %{cqquality}>超清</li></ul><span class="quality_active">标清</span></li><li class="vsliderLi"><div %{vslider}><div %{vmarker}></div><div %{vknob}></div></div></li><li><div %{mute}></div></li></ul><div %{scrubbertip}>%{hr_tip}:%{min_tip}:%{sec_tip}</div>'
		},
		initialize: function() {
			var a = this.playerDom.html(),
				b = !0,
				c = this.pp.getNS(),
				e;
			for (e in this.controlElementsConfig) if (a.match(new RegExp(c + e, "gi"))) {
				b = !1;
				break
			}
			b ? (this.cb = this.applyToPlayer(d("<div/>").addClass("controls")), this.applyTemplate(this.cb, this.getConfig("controlsTemplate"))) : this.cb = this.playerDom.find("." + c + "controls");
			for (e in this.controlElementsConfig) this.controlElements[e] = d(this.playerDom).find("." + c + e), $p.utils.blockSelection(d(this.controlElements[e]));
			this.addGuiListeners();
			this.hidecb(!0);
			this.pluginReady = !0
		},
		applyTemplate: function(a, b) {
			var c = this.pp.getNS();
			if (b) {
				var e = b.match(/\%{[a-zA-Z_]*\}/gi);
				null != e && d.each(e, function(a, e) {
					var d = e.replace(/\%{|}/gi, "");
					b = e.match(/\_/gi) ? b.replace(e, '<span class="' + c + d + '"></span>') : b.replace(e, 'class="' + c + d + '"')
				});
				a.html(b)
			}
		},
		updateDisplay: function() {
			var a = this.pp.getState();
			this.pp.getHasGUI() || (0 == this.getConfig("controls") ? this.hidecb(!0) : (this.getConfig("disablePause") ? (this._active("play", !1), this._active("pause", !1)) : ("PLAYING" === a && this.drawPauseButton(), "PAUSED" === a && this.drawPlayButton(), "IDLE" === a && this.drawPlayButton()), this._active("stop", "IDLE" !== a), !0 === this.pp.getInFullscreen() ? this.drawExitFullscreenButton() : this.drawEnterFullscreenButton(), this.getConfig("enableFullscreen") || (this._active("fsexit", !1), this._active("fsenter", !1)), this.displayQualityToggle(), this.displayTime(), this.displayVolume(this._getVolume())))
		},
		addGuiListeners: function() {
			var a = this;
			d.each(this.controlElementsConfig, function(b, c) {
				if (null == c) return !0;
				c instanceof Array || (c = [c]);
				for (var e = 0; e < c.length; e++) null != c[e].on && d.each(c[e].on, function(d, l) {
					var m = "on" + l in window.document,
						s = c[e].call;
					m || (m = document.createElement("div"), m.setAttribute("on" + l, "return;"), m = "function" == typeof m["on" + l]);
					m && a.controlElements[b].bind(l, function(c) {
						a.clickCatcher(c, s, a.controlElements[b])
					})
				});
				return !0
			});
			this.cb.mousemove(function(b) {
				a.controlsFocus(b)
			});
			this.cb.mouseout(function(b) {
				a.controlsBlur(b)
			});
			var b = d(".quality_active"),
				c = d(".qualityUl"),
				e;
			b.hover(function() {
				c.addClass("Ulactive")
			}, function() {
				e = setTimeout(function() {
					c.removeClass("Ulactive")
				}, 1500)
			});
			c.hover(function() {
				clearTimeout(e);
				c.addClass("Ulactive")
			}, function() {
				c.removeClass("Ulactive")
			});
			d(".p_i_close").click(function() {
				d("#ka_dun_tip").hide()
			})
		},
		clickCatcher: function(a, b, c) {
			a.stopPropagation();
			a.preventDefault();
			this[b](a, c);
			return !1
		},
		touchEnd: function() {
			var a = this;
			this._cTimer = setTimeout(function() {
				a.hidecb()
			}, this.getConfig("fadeDelay"));
			this._noHide = !1
		},
		drawTitle: function() {
			this.controlElements.title.html(this.getConfig("title", ""))
		},
		hidecb: function(a) {
			clearTimeout(this._cTimer);
			null != this.cb && (0 == this.getConfig("controls") ? this.cb.removeClass("active").addClass("inactive") : this.getConfig("showOnIdle") && this.pp.getState("IDLE") || (a && (this._noHide = !1), this._noHide || this.cb.hasClass("inactive") || (this.cb.removeClass("active").addClass("inactive"), this.sendEvent("hide", this.cb))))
		},
		showcb: function(a) {
			var b = this;
			clearTimeout(this._cTimer);
			this.pp.getHasGUI() || 0 == this.getConfig("controls") ? this.cb.removeClass("active").addClass("inactive") : null == this.cb || -1 < "IDLE|AWAKENING|ERROR".indexOf(this.pp.getState()) && 1 != a || (this.cb.hasClass("active") && !1 !== a || (this.cb.removeClass("inactive").addClass("active"), this.sendEvent("show", this.cb)), this._cTimer = setTimeout(function() {
				b.hidecb()
			}, this.getConfig("fadeDelay")))
		},
		displayTime: function(a, b, c) {
			if (!this.pp.getHasGUI()) {
				a = Math.round(10 * (a || this.pp.getLoadPlaybackProgress() || 0)) / 10;
				b = b || this.pp.getDuration() || 0;
				c = c || this.pp.getPosition() || 0;
				var e = d.extend({}, this._clockDigits(b, "dur"), this._clockDigits(c, "elp"), this._clockDigits(b - c, "rem"));
				if (this.controlElements.playhead.data("pct") != a) {
					this.controlElements.playhead.data("pct", a).css({
						width: a + "%"
					});
					this.controlElements.scrubberknob.css({
						left: a + "%"
					});
					for (var f in this.controlElements) {
						if ("cb" == f) break;
						e[f] && d.each(this.controlElements[f], function() {
							d(this).html(e[f])
						})
					}
				}
			}
		},
		displayProgress: function() {
			var a = Math.round(10 * this.pp.getLoadProgress()) / 10;
			this.controlElements.loaded.data("pct") != a && this.controlElements.loaded.data("pct", a).css("width", a + "%")
		},
		displayVolume: function(a) {
			var b = this;
			if (1 != this._vSliderAct && null != a) {
				var c = this.cb.hasClass("active"),
					b = this,
					e = this.getConfig("fixedVolume"),
					f = this.controlElements.mute.hasClass("toggle") || this.getConfig("toggleMute");
				this._active("mute", !e);
				this._active("vknob", !e);
				this._active("vmarker", !e);
				this._active("vslider", !e);
				if (!e) {
					this.controlElements.vslider.width() > this.controlElements.vslider.height() ? (this.controlElements.vmarker.css("width", 100 * a + "%"), this.controlElements.vknob.css("left", 100 * a + "%")) : (this.controlElements.vmarker.css("height", 100 * a + "%"), this.controlElements.vknob.css("top", 100 - 100 * a + "%"));
					for (var e = this.controlElements.volume.find("li"), g = e.length - Math.ceil(100 * a / e.length), k = 0; k <= e.length; k++) k >= g ? d(e[k]).addClass("active") : d(e[k]).removeClass("active");
					if (f) switch (parseFloat(a)) {
					case 0:
						this._active("mute", !1);
						break;
					default:
						this._active("mute", !0)
					}
					c && this.cb.fadeTo(1, .99).fadeTo(1, 1, function() {
						b.cb.removeAttr("style")
					})
				}
			}
		},
		displayCuePoints: function(a) {},
		drawPauseButton: function(a) {
			this._active("pause", !0);
			this._active("play", !1)
		},
		drawPlayButton: function(a) {
			this._active("pause", !1);
			this._active("play", !0)
		},
		drawEnterFullscreenButton: function(a) {
			this._active("fsexit", !1);
			this._active("fsenter", !0)
		},
		drawExitFullscreenButton: function(a) {
			this._active("fsexit", !0);
			this._active("fsenter", !1)
		},
		displayQualityToggle: function(a) {
			a = this.getConfig("playbackQualities");
			var b = this.pp.getPlaybackQualities();
			this.pp.getNS();
			for (var c = d.grep(a, function(a, c) {
				return -1 == d.inArray(a.key, b)
			}), e = c.length; e--; 0 < e) {
				var f = c[e].key.toLowerCase();
				this.controlElements[f + "quality"].addClass("noquali")
			}
			var g = this.pp.getPlaybackQuality();
			(e = d.grep(c, function(a, b) {
				return a.key == g
			})) && 0 < e.length && (g = b[0]);
			for (e = a.length; e--; 0 < e) f = a[e].key, c = g == f ? !0 : !1, this._active(f.toLowerCase() + "quality", c).addClass("qualLi").data("qual", f);
			d(".quality_active").text({
				LC: "标清",
				GQ: "高清",
				CQ: "超清"
			}[g])
		},
		itemHandler: function(a) {
			d(this.cb).find("." + this.pp.getNS() + "cuepoint").remove();
			this.pp.setVolume(this._getVolume());
			this.updateDisplay();
			this.hidecb(!0);
			this.drawTitle();
			this.displayQualityToggle();
			this.pluginReady = !0
		},
		startHandler: function() {
			this.pp.setVolume(this._getVolume());
			1 == this.getConfig("showOnStart") ? this.showcb(!0) : this.hidecb(!0)
		},
		readyHandler: function(a) {
			clearTimeout(this._cTimer);
			this.getConfig("showOnIdle") && (this.showcb(!0), this.cb.removeClass("inactive").addClass("active").show());
			this.pluginReady = !0
		},
		stateHandler: function(a) {
			this.updateDisplay(); - 1 < "STOPPED|AWAKENING|IDLE|DONE".indexOf(a) && (this.displayTime(0, 0, 0), this.displayProgress(0), this.pp.getIsMobileClient() && this.hidecb(!0)); - 1 < "STOPPED|DONE|IDLE".indexOf(a) ? this.hidecb(!0) : (-1 < "ERROR".indexOf(a) && (this._noHide = !1, this.hidecb(!0)), this.displayProgress())
		},
		scheduleModifiedHandler: function() {
			"IDLE" !== this.pp.getState() && (this.updateDisplay(), this.displayTime(), this.displayProgress())
		},
		volumeHandler: function(a) {
			try {
				0 < a && d("#" + this.pp.getMediaId()).attr("muted", !1), "false" == d("#" + this.pp.getMediaId()).attr("muted") && d("#" + this.pp.getMediaId()).data("volume", Math.max(0, a))
			} catch (b) {
				console.log(b)
			}
			this.displayVolume(this._getVolume())
		},
		progressHandler: function(a) {
			this.displayProgress()
		},
		timeHandler: function(a) {
			this.displayTime();
			this.displayProgress();
			d("#ka_dun_tip").hide();
			window.timer_ka && clearTimeout(window.timer_ka);
			window.timer_ka = setTimeout(function() {
				miguVideo().pluginAPI("controlbar", "showcb", !0);
				d("#ka_dun_tip").show()
			}, 5E3)
		},
		qualityChangeHandler: function(a) {
			this.displayQualityToggle(a)
		},
		streamTypeChangeHandler: function(a) {
			"dvr" == a && (this._isDVR = !0, this.setActive(this.controlElements.golive, !0))
		},
		isLiveHandler: function(a) {
			a ? this.controlElements.golive.addClass("on").removeClass("off") : this.controlElements.golive.addClass("off").removeClass("on")
		},
		fullscreenHandler: function(a) {
			this.pp.getNS();
			clearTimeout(this._cTimer);
			this._vSliderAct = this._noHide = !1;
			this.getConfig("controls") && this.getConfig("enableFullscreen") && (a ? (this.cb.addClass("fullscreen"), this.drawExitFullscreenButton()) : (this.cb.removeClass("fullscreen"), this.drawEnterFullscreenButton()), "IDLE" != this.pp.getState() || this.getConfig("showOnIdle") || this.hidecb(!0))
		},
		durationChangeHandler: function(a) {
			this.displayCuePoints(a)
		},
		errorHandler: function(a) {
			this.hidecb(!0)
		},
		leftclickHandler: function() {
			this.mouseleaveHandler()
		},
		focusHandler: function(a) {
			this.showcb()
		},
		mouseenterHandler: function(a) {
			this.showcb()
		},
		mousemoveHandler: function(a) {
			this.pp.getState("STARTING") || this.showcb()
		},
		mouseleaveHandler: function() {},
		mousedownHandler: function(a) {
			this.showcb()
		},
		controlsFocus: function(a) {
			this._noHide = !0
		},
		controlsBlur: function(a) {
			this._noHide = !1
		},
		setQualityClk: function(a) {
			d(a.currentTarget).hasClass("active") ? d(".qualityUl").toggleClass("Ulactive") : (d(".qualityUl").removeClass("Ulactive"), this.pp.setPlaybackQuality(d(a.currentTarget).data("qual")))
		},
		goliveClk: function(a) {
			this.pp.setSeek(-1)
		},
		playClk: function(a) {
			this.pp.setPlay()
		},
		pauseClk: function(a) {
			this.pp.setPause()
		},
		stopClk: function(a) {
			this.pp.setStop()
		},
		startClk: function(a) {
			this.pp.setPlay()
		},
		controlsClk: function(a) {},
		muteClk: function(a) {
			d("#" + this.pp.getMediaId()).attr("muted", !0);
			a = d(a.currentTarget);
			a.hasClass("nosound") ? (a.removeClass("nosound"), this.pp.setVolume(.5)) : (a.addClass("nosound"), this.pp.setVolume(0))
		},
		enterFullscreenClk: function(a) {
			this.pp.setFullscreen(!0)
		},
		exitFullscreenClk: function(a) {
			this.pp.setFullscreen(!1)
		},
		loopClk: function(a) {
			this.pp.setLoop(d(a.currentTarget).hasClass("inactive") || !1);
			this.updateDisplay()
		},
		vmarkerClk: function(a) {
			vsliderClk(a)
		},
		openCloseClk: function(a) {
			var b = this;
			d(d(a.currentTarget).attr("class").split(/\s+/)).each(function(a, e) {
				-1 != e.indexOf("toggle") && (b.playerDom.find("." + e.substring(6)).slideToggle("slow", function() {
					b.pp.setSize()
				}), b.controlElements.open.toggle(), b.controlElements.close.toggle())
			})
		},
		vsliderClk: function(a) {
			if (1 != this._vSliderAct) {
				var b = d(this.controlElements.vslider),
					c = b.width() > b.height() ? "hor" : "vert",
					e = "hor" == c ? b.width() : b.height(),
					f = a.originalEvent.touches ? a.originalEvent.touches[0].pageX : a.pageX;
				a = a.originalEvent.touches ? a.originalEvent.touches[0].pageY : a.pageY;
				b = "hor" == c ? f - b.offset().left : a - b.offset().top;
				f = 0;
				f = 0 > b || isNaN(b) || void 0 == b ? 0 : "hor" == c ? b / e : 1 - b / e;
				0 < f ? this.controlElements.mute.removeClass("nosound") : this.controlElements.mute.addClass("nosound");
				this.pp.setVolume(f)
			}
		},
		scrubberShowTooltip: function(a) {
			if (0 != this.pp.getDuration()) {
				clearTimeout(this._cTimer);
				clearTimeout(this._sTTimer);
				var b = this;
				this._sTTimer = setTimeout(function() {
					b.setActive(b.controlElements.scrubbertip, !0)
				}, 100)
			}
		},
		scrubberHideTooltip: function(a) {
			clearTimeout(this._sTTimer);
			this.setActive(this.controlElements.scrubbertip, !1)
		},
		scrubberdragTooltip: function(a) {
			if (0 != this.pp.getDuration()) {
				clearTimeout(this._sTTimer);
				var b = this;
				this._sTTimer = setTimeout(function() {
					var c = d(b.controlElements.scrubberdrag[0]);
					d(b.controlElements.loaded[0]);
					var e = d(b.controlElements.scrubbertip),
						f = a.originalEvent.touches ? a.originalEvent.touches[0].pageX : a.pageX,
						g = f - c.offset().left - e.outerWidth() / 2,
						f = b.pp.getDuration() / 100 * (100 * (f - c.offset().left) / c.width()),
						k = b._clockDigits(f, "tip");
					b._isDVR && (f = b.pp.getDuration() - f, f = new Date(1E3 * ((new Date).getTime() / 1E3 - f)), f = f.getSeconds() + 60 * f.getMinutes() + 3600 * f.getHours(), k = b._clockDigits(f, "tip"));
					for (var h in b.controlElements) {
						if ("cb" == h) break;
						k[h] && d.each(b.controlElements[h], function() {
							d(this).html(k[h])
						})
					}
					g = 0 > g ? 0 : g;
					g = g > c.width() - e.outerWidth() ? c.width() - e.outerWidth() : g;
					b.setActive(b.controlElements.scrubbertip, !0);
					e.css({
						left: g + "px"
					})
				}, 100)
			}
		},
		scrubberdragStartDragListener: function(a) {
			if (1 != this.getConfig("disallowSkip")) {
				this._sSliderAct = !0;
				var b = this,
					c = d(this.controlElements.scrubberdrag[0]),
					e = d(this.controlElements.loaded[0]),
					f = 0;
				Math.abs(parseInt(c.offset().left) - a.clientX);
				var g = function(a) {
						a = Math.abs(c.offset().left - a.clientX);
						a = a > c.width() ? c.width() : a;
						a = a > e.width() ? e.width() : a;
						a = Math.abs((0 > a ? 0 : a) / c.width()) * b.pp.getDuration();
						0 < a && a != f && (f = a, b.pp.setPlayhead(f))
					},
					k = function(a) {
						a.stopPropagation();
						a.preventDefault();
						b.playerDom.unbind("mouseup.slider");
						c.unbind("mousemove", h);
						c.unbind("mouseup", k);
						return b._sSliderAct = !1
					},
					h = function(a) {
						clearTimeout(b._cTimer);
						a.stopPropagation();
						a.preventDefault();
						g(a);
						return !1
					};
				this.playerDom.bind("mouseup.slider", k);
				c.mouseup(k);
				c.mousemove(h);
				g(a)
			}
		},
		vknobStartDragListener: function(a, b) {
			this._vSliderAct = !0;
			var c = this,
				e = !0 === this.pp.getInFullscreen() && 1 < this.controlElements.vslider.length ? 1 : 0,
				f = d(b[e]),
				g = d(this.controlElements.vslider[e]),
				k = Math.abs(parseFloat(f.position().left) - a.clientX),
				h = Math.abs(parseFloat(f.position().top) - a.clientY),
				l = 0,
				m = function(a) {
					c.playerDom.unbind("mouseup", m);
					g.unbind("mousemove", s);
					g.unbind("mouseup", m);
					f.unbind("mousemove", s);
					f.unbind("mouseup", m);
					return c._vSliderAct = !1
				},
				s = function(a) {
					clearTimeout(c._cTimer);
					var b = a.clientX - k,
						b = b > g.width() - f.width() / 2 ? g.width() - f.width() / 2 : b,
						b = 0 > b ? 0 : b;
					a = a.clientY - h;
					a = a > g.height() - f.height() / 2 ? g.height() - f.height() / 2 : a;
					a = 0 > a ? 0 : a;
					c.controlElements.vslider.width() > c.controlElements.vslider.height() ? (f.css("left", b + "px"), l = Math.abs(b / (g.width() - f.width() / 2)), d(c.controlElements.vmarker[e]).css("width", 100 * l + "%")) : (f.css("top", a + "px"), l = 1 - Math.abs(a / (g.height() - f.height() / 2)), d(c.controlElements.vmarker[e]).css("height", 100 * l + "%"));
					0 < l ? c.controlElements.mute.removeClass("nosound") : c.controlElements.mute.addClass("nosound");
					c.pp.setVolume(l)
				};
			this.playerDom.mouseup(m);
			g.mousemove(s);
			g.mouseup(m);
			f.mousemove(s);
			f.mouseup(m)
		},
		handleStartDragListener: function(a, b) {
			var c = this,
				e = Math.abs(parseInt(this.cb.position().left) - a.clientX),
				d = Math.abs(parseInt(this.cb.position().top) - a.clientY),
				g = function(a) {
					a.stopPropagation();
					a.preventDefault();
					c.playerDom.unbind("mouseup", g);
					c.playerDom.unbind("mouseout", g);
					c.playerDom.unbind("mousemove", k);
					return !1
				},
				k = function(a) {
					a.stopPropagation();
					a.preventDefault();
					clearTimeout(c._cTimer);
					var b = a.clientX - e,
						b = b > c.playerDom.width() - c.cb.width() ? c.playerDom.width() - c.cb.width() : b;
					c.cb.css("left", (0 > b ? 0 : b) + "px");
					a = a.clientY - d;
					a = a > c.playerDom.height() - c.cb.height() ? c.playerDom.height() - c.cb.height() : a;
					c.cb.css("top", (0 > a ? 0 : a) + "px");
					return !1
				};
			this.playerDom.mousemove(k);
			this.playerDom.mouseup(g)
		},
		_getVolume: function() {
			var a = parseFloat(d("#" + this.pp.getMediaId()).data("volume") || this.getConfig("volume") || .5);
			muted = "true" == d("#" + this.pp.getMediaId()).attr("muted") || !1;
			return this.getConfig("fixedVolume") || null == a ? this.getConfig("volume") : muted ? 0 : a
		},
		_active: function(a, b) {
			var c = this.controlElements[a];
			1 == b ? c.addClass("active").removeClass("inactive") : c.addClass("inactive").removeClass("active");
			return c
		},
		_clockDigits: function(a, b) {
			if (0 > a || isNaN(a) || void 0 == a) a = 0;
			var c = Math.floor(a / 3600),
				e = a % 3600,
				d = Math.floor(e / 60),
				g = 60 * c + d,
				e = Math.floor(e % 60),
				k = a,
				h = {};
			h["min_" + b] = 10 > d ? "0" + d : d;
			h["min_abs_" + b] = 10 > g ? "0" + g : g;
			h["sec_" + b] = 10 > e ? "0" + e : e;
			h["sec_abs_" + b] = 10 > k ? "0" + k : k;
			h["hr_" + b] = 10 > c ? "0" + c : c;
			return h
		}
	}
});
var miguVideoAD = function() {};
jQuery(function(d) {
	miguVideoAD.prototype = {
		initialize: function() {
			this.playerDom.html();
			this.pp.getNS();
			this.ad = this.applyToPlayer(d("<div/>").addClass("ad")).attr("id", "p_ad");
			var a = this.getConfig("ad") || "";
			a && (a = {
				src: a.src || "",
				img: a.img || ""
			}, this.ad.html('<a href="javascript:void(0);" class="p_ad_close">×</a><a class="ad_img" href="' + a.src + '" target="_blank"><img src="' + a.img + '" width="500" height="300"></a></div>'), this.closeHandler(), "" == a.src && this.ad.addClass("noAD"));
			this.pluginReady = !0
		},
		closeHandler: function() {
			var a = this.ad.find(".p_ad_close"),
				b = this;
			d(a).click(function(a) {
				a.preventDefault();
				b.ad.hide()
			})
		},
		changeAD: function(a) {
			var b, c;
			a && "object" == typeof a && (b = a.img || "", c = a.src || "");
			b && (this.ad.find("img").attr("src", b), this.ad.find(".ad_img").attr("href", c), this.ad.removeClass("noAD"))
		}
	}
});
var m_business = {
	data: null,
	init: function(d, a, b) {
		this.data = a;
		(b = this._getPlayData(a, b)) ? (miguVideo(d, b), this.initMonthlyPanel(a), this._initPlayerEvent(a), this.initHistoryList()) : alert("数据错误！")
	},
	_getPlayData: function(d, a) {
		if (d && "000000" == d.returnCode) {
			for (var b = ["lc", "gq", "cq"], c = {}, e = null, f = 0, g = 0, k = b.length; g < k; g++) {
				var h = b[g];
				d[h + "Exists"] && (c[f++] = {
					src: d[h + "Down"] || "",
					type: "video/mp4",
					quality: h.toUpperCase()
				}, d[h + "Avaliable"] && !e && (e = h.toUpperCase()))
			}
			return {
				title: d.title || "",
				ad: a.ad || {},
				width: a.w,
				height: a.h,
				playbackQuality: e || "LC",
				autoplay: !0,
				playlist: [c]
			}
		}
		return null
	},
	_initPlayerEvent: function(d) {
		var a = miguVideo(),
			b = this;
		$("#p_replay_btn").click(function() {
			a && ($("#replay_page").hide(), a.setPlay())
		});
		a.addListener("qualityChange", function(a, e) {
			b.initMonthlyPanel(d || b.data);
			(e.getSource() || "" == e.getSource()) && $("#p_ad").hide()
		});
		a.addListener("state", function(a, b) {
			"PAUSED" != a || $("#p_ad").hasClass("noAD") ? $("#p_ad").hide() : $("#p_ad").show()
		});
		a.addListener("done", function(b, e) {
			e.getInFullscreen() && a.setFullscreen(!1);
			$("#replay_page").show()
		});
		a.addListener("start", function(a, b) {
			if (d) {
				for (var f = common.cookie, g = f.getCookie("MV_LIST"), k = !0, h = g.split("&"), l, m = 0, s = h.length; m < s; m++) if (h[m]) {
					var q = h[m].split("|");
					if (q && 0 != q.length && q[0] == d.mvId) {
						k = !1;
						break
					}
				}
				g && 12 < h.length && (g = h.slice(0, 12).join("&"));
				k && (l = d.mvId + "|" + (d.mvName || "") + "|" + (d.singerName || "") + (g ? "&" + g : ""));
				f.setCookie("MV_LIST", l, null, "/", ".migu.cn")
			}
		});
		$("#month10_span .overlay_btn").click(function(a) {
			//----------------业务判断---业务是否关停---------
			var isContinue = true;
			$.ajax({
				url:"http://music.migu.cn/webfront/order/checkBusinessPayment.do",
				data:{type:"mv_ten"},
				dataType:"json",
				type:"POST",
				async:false,
				success:function(re){
					if(re.state == "1"){
						isContinue = false;
						showMessageDialog("很抱歉，该功能模块正在升级维护中...");
					}
				},
				error:function(data,status, errorThrown){
					showMessageDialog("网络异常，请稍后重试!");
					isContinue = false;
				}
			});
			if ( !isContinue) return false;
			var e = "true" == common.isLogin();
			a.stopPropagation();
			a.preventDefault();
			if (e) if (a = common.getUserInfo().mobile) {
				var e = $("#overlay_order").text(),
					d = "10" == $(this).attr("_price"),
					e = common.util.stringFormat(e, {
						mobile: a,
						title: d ? "10元" : "0元体验",
						content: d ? "免费观看全网MV视频" : "观看5支付费MV",
						price: d ? "10" : "0"
					});
				ymPrompt.win({
					message: e,
					width: 672,
					height: 392,
					titleBar: !1
				});
				b.initOrderEvent(a)
			} else ymPrompt.confirmInfo({
				message: "您需要先绑定手机号才能操作,是否继续绑定？",
				handler: function(a) {
					"ok" == a && window.open("https://passport.migu.cn/portal/home/msisdn/update_phone?sourceid=220003")
				}
			});
			else common.showLoginWin()
		});
		$("#month0_span .overlay_btn").click(function(a) {
			var e = "true" == common.isLogin();
			a.stopPropagation();
			a.preventDefault();
			if (e) if (a = common.getUserInfo().mobile) {
				var e = $("#overlay_order").text(),
					d = "10" == $(this).attr("_price"),
					e = common.util.stringFormat(e, {
						mobile: a,
						title: d ? "10元" : "0元体验",
						content: d ? "免费观看全网MV视频" : "观看5支付费MV",
						price: d ? "10" : "0"
					});
				ymPrompt.win({
					message: e,
					width: 672,
					height: 392,
					titleBar: !1
				});
				b.initOrderEvent(a)
			} else ymPrompt.confirmInfo({
				message: "您需要先绑定手机号才能操作,是否继续绑定？",
				handler: function(a) {
					"ok" == a && window.open("https://passport.migu.cn/portal/home/msisdn/update_phone?sourceid=220003")
				}
			});
			else common.showLoginWin()
		})
	},
	initMonthlyPanel: function(d) {
		var a = miguVideo().getPlaybackQuality().toLowerCase(),
			b = "<p><strong>此视频属于免费资源，欢迎观看！</strong></p>";
		$(".b_f_info,#month10_span,#month0_span").show();
		d[a + "Avaliable"] ? (d.monthly0 && (b = "<p><strong>您已开通0元体验包月，一个自然月内可免费观看本站内5首付费MV！</strong></p>", $("#month10_span,#month0_span").hide()), d.monthly10 && (b = "<p><strong>您已开通视频包月，一个自然月内可免费观看本站内所有视频！</strong></p>", $("#month10_span").hide())) : "true" == common.isLogin() ? (b = "<p><strong>此视频为付费或高清以上资源，需要开通包月观看。</strong></p>", d.monthly10 && $("#month10_span").hide(), d.monthly0 && $("#month0_span").hide()) : (d = common._getUrl.loginUrl + "" + window.top.location.href, -1 != d.indexOf("/#") && (d = d.replace("/#", "/pl_")), b = '<p><strong>此视频为付费或高清以上资源，需要开通包月观看。如您已开通包月，登录后即可观看。</strong></p><p><a href="javascript:void(0);" style="color:#369; font-weight:bold" id="a_login">去登录</a></p>');
		$(".b_f_tips").html(b)
	},
	initHistoryList: function() {
		var d = common.util.stringFormat,
			a = common.cookie.getCookie("MV_LIST"),
			b = "";
		if (a) for (var a = a.split("&"), c = 0, e = a.length, f = 0; c < e; c++) {
			var g = a[c].split("|");
			3 <= g.length && g[0] && (b += d('<li><a href="http://music.migu.cn/webfront/mv2/{0}/show.do?loc=P6Z1Y3L1N2&locno=1"><span class="ph_song_n">{1}</span> - <span class="ph_singer_n">{2}</span></a></li>', g[0], g[1] || "暂无歌名", g[2] || "暂无歌手"));
			if (12 < ++f) break
		}
		$(".play_his").html(b)
	},
	initOrderEvent: function(d) {
		var a = this;
		$("#mv_overlay").on("click", ".sprt_btn_close", function() {
			ymPrompt.close();
			a.destroyOrderEvent()
		});
		order_overlay.init(d)
	},
	destroyOrderEvent: function() {
		$("#mv_overlay").off("click")
	}
},
	order_overlay = {
		init: function(d) {
			var a = $("#mv_overlay"),
				b = this.util;
			a.on("click", ".img-code-change", function() {
				$(this).siblings("img").attr("src", b.imgCodeURL())
			});
			a.find(".img-code-change").click();
			a.on("blur", ".img-input,.code-input", function() {
				var b = $(this).hasClass("img-input") ? 0 : 1,
					e = $(this).val(),
					d = $(this).parent(".nui-ipt-3").siblings(".err");
				"" == $.trim(e) ? (b = 0 == b ? "请输入图形验证码答案" : "请输入短信验证码", a.find(".mobile_notice").hide(), d.find(".err_txt").text(b), d.show()) : d.hide()
			});
			a.on("click", ".agree_check", function() {
				$(this).prop("checked") ? $(this).siblings(".err").hide() : $(this).siblings(".err").show()
			});
			a.on("click", ".btn-get-code", function(c) {
				c.stopPropagation();
				var e = $(this).parents("ul");
				e.find(".btn-get-code").siblings(".err").hide();
				if (0 != $(a).find(".err:visible").length) return !1;
				var d = $(this);
				c = $.trim(e.find(".mobile-input").text());
				var g = e.find("input.img-input").val();
				if ("" == $.trim(c)) return e.find("input.mobile-input").parent().next(".err").show(), !1;
				c = {
					code: g
				};
				if (d.hasClass("btn_gray")) return !1;
				$.post("http://music.migu.cn/webfront/mv2/mcode.do", c, function(a) {
					var c = e.find(".img-code-change").siblings(".err");
					if ("000000" == a.returnCode) {
						if (d.hasClass("btn_gray")) return !1;
						d.toggleClass("btn_blue btn_gray");
						c.hide();
						d.siblings(".err").hide();
						d.siblings(".mobile_notice").show();
						b.countdownTimer("mv_overlay1", 60, function(a) {
							d.text(a + "秒后可重新获取")
						}, function() {
							d.text("获取短信验证码");
							d.toggleClass("btn_blue btn_gray")
						})
					} else if ("100001" == a.returnCode){
						
					c.show();
					c.find(".err_txt").text("图形验证码答案错误");
						
					}else if("[PE]不支持异网发送验证码"==a.a.returnDesc){
					c.show();
					c.find(".err_txt").text("抱歉，咪咕君暂不能异网发送验证码");
					 
					}else{
						c.show();
//                        c.find(".err_txt").text(a.returnDesc+","+a.returnCode);
                        c.find(".err_txt").text(a.returnCode);
					}
			
					//else "100001" == a.returnCode ? (c.show(), c.find(".err_txt").text("图形验证码答案错误")) : (c.show(), c.find(".err_txt").text(a.returnDesc))
//							else "100001" == a.returnCode ? (c.show(), c.find(".err_txt").text("图形验证码答案错误")) : (c.show(),
//									if("[PE]不支持异网发送验证码"==a.a.returnDesc){
//										c.find(".err_txt").text("抱歉，咪咕君暂不能异网发送验证码")
//									}else{
//										c.find(".err_txt").text(a.returnDesc+","+a.returnCode)
//									}
//							)
									
									
				}, "json")
			});
			a.on("click", ".btn-next", function(b) {
				b.stopPropagation();
				var e = $(this);
				$(this).parents("ul").find("input").trigger("blur");
				if (0 != a.find(".err:visible").length) return !1;
				if (!e.data("isClicking")) {
					e.data("isClicking", !0);
					var f = $(this).parents("ul"),
						g = f.find(".agree_check");
					if (!g.prop("checked")) return g.siblings(".err").show(), !1;
					var k = a.attr("_type"),
						g = f.find("input.code-input").val();
					b = f.find(".btn-get-code").siblings(".err");
					var h = f.parents(".itempage"),
						l = h.siblings(".itempage").hide();
					$.ajax({
						type: "post",
						url: "http://music.migu.cn/webfront/mv2/monthly.do",
						data: {
							mtype: k,
							mcode: g
						},
						dataType: "json",
						success: function(a) {
							if ("100001" == a.returnCode) f.find(".btn-get-code").siblings(".mobile_notice").hide(), b.show(), b.find(".err_txt").text("短信验证码错误");
							else {
								var g = $("#overlay_result").text(),
									q = "",
									r = "",
									u = "",
									t = "",
									y = "none";
								h.hide();
								//"000000" == a.returnCode ? (clearTimeout(window.timerDownmv_overlay1), f.find(".btn-get-code").text("获取短信验证码").removeClass("btn_gray").addClass("btn_blue"), q = "order_sprt_suc", r = "font_green", u = "恭喜您，视频" + ("m0" == k ? "0元体验" : "10元") + "包月开通成功！", t = "1个自然月内" + ("m0" == k ? "可以免费观看5支付费MV了！" : "本站所有视频可以无限量观看！")) : (q = "order_sprt_errow", r = "font_red", u = "抱歉，视频" + ("m0" == k ? "0元体验" : "10元") + "包月开通失败！", t = "失败原因：" + a.description, y = "block");
								
								"000000" == a.returnCode ? (clearTimeout(window.timerDownmv_overlay1), f.find(".btn-get-code").text("获取短信验证码").removeClass("btn_gray").addClass("btn_blue"), q = "order_sprt_suc", r = "font_green", u = "恭喜您， 咪咕音乐超清白金会员开通成功！ 欢迎加入咪咕大家族！", t = "1个自然月内" + ("m0" == k ? "可以免费观看5支付费MV了！" : "本站所有视频可以无限量观看！")) : (q = "order_sprt_errow", r = "font_red", u = "抱歉，视频" + ("m0" == k ? "0元体验" : "10元") + "包月开通失败！", t = "失败原因：" + a.description, y = "block");
								
								
								g = common.util.stringFormat(g, {
									mobile: d,
									icon: q,
									font_color: r,
									resultText: u,
									description: t,
									show: y
								});
								l.html(g).show()
							}
							e.data("isClicking", !1)
						},
						error: function(a) {
							ymPrompt.alert({
								message: "接口错误"
							});
							e.data("isClicking", !1)
						}
					})
				}
			})
		},
		util: {
			imgCodeURL: function() {
				return "/webfront/imgcode?d=" + (new Date).getMilliseconds()
			},
			countdownTimer: function(d, a, b, c) {
				-1 == a ? (clearTimeout(window["timerDown" + d]), $.isFunction(c) && c.call(window)) : ($.isFunction(b) && b.call(window, a), a--, window["timerDown" + d] = setTimeout(function() {
					order_overlay.util.countdownTimer(d, a, b, c)
				}, 1E3))
			}
		},
		reset: function() {
			var d = $("#mv_overlay"),
				a = order_overlay.util;
			$(d).find(":text").val("");
			$(d).find(".err").hide();
			$(d).find("img").attr("src", a.imgCodeURL());
			d = $(d).find(".itempage");
			d.hide();
			d.eq(0).show()
		}
	};