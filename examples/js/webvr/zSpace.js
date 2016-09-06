/**
 A **ZSpace** component makes its {{#crossLink "Scene"}}{{/crossLink}} viewable with a zSpace viewer.

 <ul>
 <li>a ZSpace requires WebGL2 and WebVR support, which you'll have if you're running on a zSpace viewer.</li>
 <li>a ZSpace is attached to a {{#crossLink "Camera"}}{{/crossLink}}</li>
 <li>a ZSpace requires its {{#crossLink "Camera"}}Camera{{/crossLink}} to have a {{#crossLink "Transform"}}{{/crossLink}}
 (and not a subclass) for each of it's {{#crossLink "Camera/view:property"}}{{/crossLink}} and
 {{#crossLink "Camera/view:property"}}projection{{/crossLink}} transforms. This is because the ZSpace needs to directly update
 the matrices on those transforms as part of the stereo viewing effect. If those transforms are of a different type, then
 the ZSpace will temporarily replace them with {{#crossLink "Transform"}}Transforms{{/crossLink}}.</li>
 <li>a {{#crossLink "ZSpaceStylus"}}{{/crossLink}} can be used to track stylus input on a ZSpace.</li>
 </ul>

 ## Examples

 <ul>
 <li>[zSpace with random geometries](../../examples/#webvr_zspace_geometries)</li>
 <li>[zSpace with glTF gearbox model](../../examples/#webvr_zspace_gltf_gearbox)</li>
 </ul>

 ## Usage

 In the example below, we'll create an {{#crossLink "Entity"}}{{/crossLink}} in xeoEngine's default
 {{#crossLink "Scene"}}{{/crossLink}}. Then we'll also create a {{#crossLink "ZSpace"}}{{/crossLink}}, which
 enables us to view and interact with the {{#crossLink "Scene"}}{{/crossLink}} using a ZSpace viewer.

 ````javascript

 // Create an Entity

 new XEO.Entity({
     geometry: new XEO.TorusGeometry(),
     material: new XEO.PhongMaterial({
        diffuseMap: new XEO.Texture({
            src: "textures/diffuse/uvGrid2.jpg"
        })
     })
 });

 // Create a zSpace viewer

 var zSpace = new XEO.ZSpace();
 ````

 In this example we didn't specify a {{#crossLink "Camera"}}{{/crossLink}} for our {{#crossLink "Entity"}}{{/crossLink}} and
 ZSpace, which causes them attach to their {{#crossLink "Scene"}}Scene's{{/crossLink}} default
 {{#crossLink "Camera"}}{{/crossLink}}.

 Note however that the default {{#crossLink "Camera"}}{{/crossLink}} has a {{#crossLink "Lookat"}}{{/crossLink}} for its view transform
 and a {{#crossLink "Perspective"}}{{/crossLink}} for its projection. Therefore, whenever active, the ZSpace will
 replace those with {{#crossLink "Transform"}}{{/crossLink}} components, which it will update in order to create
 the stereo effect. If the ZSpace is later deactivated or destroyed, it will restore the
 {{#crossLink "Camera"}}Camera's{{/crossLink}} original {{#crossLink "Lookat"}}{{/crossLink}} and {{#crossLink "Perspective"}}{{/crossLink}}.

 ## Sizing the zSpace viewer coordinate system

 ````javascript
 var zSpace = new XEO.ZSpace({
    viewerScale: 30
 });
 ````

 We can also automatically fit the viewer coordinate system to whatever is in the {{#crossLink "Scene"}}{{/crossLink}}:

 ````javascript
 var zSpace = new XEO.ZSpace({
    autoViewerScale: true
 });
 ````


 ## Detecting support

 The **ZSpace** will fire a "supported" event once it has determined whether or not the browser
 supports a zSpace viewer:

 ````javascript
 zSpace.on("supported", function (supported) {

        if (!supported) {

            // Not a zSpace device

            this.error("This computer is not a ZSpace viewer!"); // Log error on the XEO.ZSpace component

            // At this point you could just destroy the XEO.ZSpace to make it detach from the Camera
        }
    });
 ````

 ## Handling stylus events

 Reading the current position and orientation of the stylus, along with the current stylus camera matrix:

 ````javascript
 var stylusPos = zSpace.stylusPos; // Position, as a three-element Float32Array
 var stylusOrientation = zSpace.stylusOrientation; // Orientation quaternion, as a four-element Float32Array
 var stylusCameraMatrix = zSpace.stylusCameraMatrix; // Sixteen-element Float32Array
 ````

 Note that these properties only have meaningful values once the **ZSpace** has fired at least one "stylusMoved" event.

 Subscribing to stylus movement:

 ````javascript
 zSpace.on("stylusMoved", function() {
     var stylusPos = this.stylusPos; // Position, as a three-element Float32Array
     var stylusOrientation = this.stylusOrientation; // Orientation quaternion, as a four-element Float32Array
     var stylusCameraMatrix = this.stylusCameraMatrix; // Sixteen-element Float32Array
     //...
 });
 ````

 Reading the current state of each stylus button:

 ````javascript
 var button0 = zSpace.stylusButton0; // Boolean
 var button1 = zSpace.stylusButton1;
 var button2 = zSpace.stylusButton2;
 ````

 Subscribing to change of state of each stylus button:

 ````javascript
 zSpace.on("stylusButton0", function(value) { // Boolean value
     this.log("stylusButton0 = " + value);
 });

 zSpace.on("stylusButton1", function(value) {
     this.log("stylusButton1 = " + value);
 });

 zSpace.on("stylusButton2", function(value) {
     this.log("stylusButton2 = " + value);
 });
 ````

 @class ZSpace
 @module XEO
 @submodule webvr
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this ZSpace in the default
 {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}},
 generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this ZSpace.
 @param [cfg.camera] {String|Camera} ID or instance of a {{#crossLink "Camera"}}Camera{{/crossLink}} for this ZSpace.
 Must be within the same {{#crossLink "Scene"}}Scene{{/crossLink}} as this ZSpace. Defaults to the
 parent {{#crossLink "Scene"}}Scene{{/crossLink}}'s default instance, {{#crossLink "Scene/camera:property"}}camera{{/crossLink}}.
 @param [cfg.nearClip=0.1] {Number} Position of the near clipping plane on the View-space Z-axis.
 @param [cfg.farClip=10000] {Number} Position of the far clipping plane on the View-space Z-axis.
 @param [cfg.viewerScale=1000] {Number} The viewer scale factor.
 @param [cfg.autoViewerScale=true] {Boolean} Set true to automatically size {{#crossLink "ZSpace/viewerScale:property"}}{{/crossLink}} to fit
 everything in the {{#crossLink "Scene"}}{{/crossLink}}.
 @param [cfg.displaySize=0.521,0.293] {Array of Number} The viewer display size.
 @param [cfg.displayResolution=1920,1080] {Array of Number} The viewer display resolution.
 @param [cfg.active=true] {Boolean} Whether or not this ZSpace is initially active.
 @extends Component
 */
(function () {

    "use strict";

    var math = XEO.math;

    XEO.ZSpace = XEO.Component.extend({

        type: "XEO.ZSpace",

        _init: function (cfg) {

            this._super(cfg);

            var self = this;

            this._supported = false; // True as soon as zSpace support is detected
            this._displaySize = math.vec2([0.521, 0.293]);
            this._displayResolution = math.vec2([1920, 1080]);
            this._viewerScale = 1.0;
            this._autoViewerScale = false;
            this._autoViewerScaleDirty = false;
            this._stylusButton0 = false;
            this._stylusButton1 = false;
            this._stylusButton2 = false;
            this._stylusPos = math.vec3([0, 0, 0]);
            this._stylusOrientation = math.identityQuaternion();

            // WebVR devices
            this._leftViewDevice = null;
            this._rightViewDevice = null;
            this._leftProjectionDevice = null;
            this._rightProjectionDevice = null;
            this._stylusDevice = null;
            this._stylusButtonsDevice = null;

            this._swapzSpace = false;
            this._zSpaceEnable = true;
            this._stylusGamepad = null;
            this._canvasOffset = math.vec2([0, 0]);
            this._canvasOffset = math.vec2([310, 0]);

            // Matrices
            this._leftViewMatrix = math.identityMat4();
            this._rightViewMatrix = math.identityMat4();
            this._leftProjectionMatrix = math.identityMat4();
            this._rightProjectionMatrix = math.identityMat4();
            this._stylusCameraMatrix = math.identityMat4();

            // Stereo drawing framebuffer
            this._frameBufferAllocated = false; // True when allocated
            this._frameBuffer = null;
            this._frameBufferTexture = null;
            this._frameBufferDepthTexture = null;

            if (this.scene.canvas.webgl2 === false) {

                // WebGL 2 support is required

                this.error("WebGL 2 is not supported by this browser");
                this.fire("supported", this._supported = false, false);

            } else {

                // Find ZSPace display(s)

                if (!navigator.getVRDisplays) {

                    this.error("WebVR is not supported by this browser");
                    this.fire("supported", this._supported = false, false);

                } else {

                    navigator.getVRDisplays().then(function (displays) {

                        if (displays.length === 0) {
                            self.error("No WebVR displays found");
                            self.fire("supported", self._supported = false, false);
                            return;
                        }

                        var i;
                        var display;
                        var displayName;

                        for (i = 0; i < displays.length; i++) {

                            display = displays[i];
                            displayName = display.displayName;

                            self.log("Found WebVR display: '" + displayName + "'");

                            switch (display.displayName) {
                                case "ZSpace Left View":
                                    self._leftViewDevice = display;
                                    break;

                                case "ZSpace Right View":
                                    self._rightViewDevice = display;
                                    break;

                                case "ZSpace Left Projection":
                                    self._leftProjectionDevice = display;
                                    break;

                                case "ZSpace Right Projection":
                                    self._rightProjectionDevice = display;
                                    break;

                                case "ZSpace Stylus":
                                    self._stylusDevice = display;
                                    break;

                                case "ZSpace Stylus Buttons":
                                    self._stylusButtonsDevice = display;
                                    break;
                            }
                        }

                        if (!self._leftViewDevice
                            || !self._rightViewDevice
                            || !self._leftProjectionDevice
                            || !self._rightProjectionDevice
                            || !self._stylusDevice
                            || !self._stylusButtonsDevice) {
                            self.log("ZSPace WebVR display(s) not found");
                            self.fire("supported", self._supported = false, false);
                            return;
                        }

                        self.fire("supported", self._supported = true, false); // Battlestation is fully operational.
                    });

                    var zSpaceConnectHandler = function (e) {
                        self.log("zSpace connected");
                        self._stylusGamepad = e.gamepad;
                    };

                    var zSpaceDisconnectHandler = function (e) {
                        self.log("zSpace disconnected");
                        self._stylusGamepad = null;
                    };

                    window.addEventListener("gamepadconnected", zSpaceConnectHandler);
                    window.addEventListener("gamepaddisconnected", zSpaceDisconnectHandler);
                }
            }


            // Set properties on this XEO.zSpace (see _props below)

            this.camera = cfg.camera;
            this.nearClip = cfg.nearClip;
            this.farClip = cfg.farClip;
            this.viewerScale = cfg.viewerScale;
            this.autoViewerScale = cfg.autoViewerScale;
            this.viewerOrigin = cfg.viewerOrigin;
            this.displaySize = cfg.displaySize;
            this.displayResolution = cfg.displayResolution;
            this.active = cfg.active;
        },

        _props: {

            /**
             * The {{#crossLink "Camera"}}{{/crossLink}} attached to this ZSpace component.
             *
             * The ZSpace component will attach a {{#crossLink "Projection"}}{{/crossLink}} to its
             * {{#crossLink "Camera"}}{{/crossLink}} if the {{#crossLink "Camera"}}Camera{{/crossLink}} does not have
             * one already, replacing whatever projection transform component was already attached.
             *
             * Must be within the same {{#crossLink "Scene"}}{{/crossLink}} as this ZSpace component. Defaults to the parent
             * {{#crossLink "Scene"}}Scene's{{/crossLink}} default {{#crossLink "Scene/camera:property"}}camera{{/crossLink}} when set to
             * a null or undefined value.
             *
             * No other component should modify the state of the {{#crossLink "Camera"}}{{/crossLink}} while
             * it's attached to this ZSpace component. There is no prevention or check for that, so if that
             * happens you'll get unexpected results.
             *
             * @property camera
             * @type Camera
             */
            camera: {

                set: function (value) {

                    /**
                     * Fired whenever this ZSpace component's {{#crossLink "ZSpace/camera:property"}}{{/crossLink}}
                     * property changes.
                     *
                     * @event camera
                     * @param value The property's new value
                     */
                    var camera = this._attach({
                        name: "camera",
                        type: "XEO.Camera",
                        component: value,
                        sceneDefault: true
                    });
                },

                get: function () {
                    return this._attached.camera;
                }
            },

            /**
             * Position of this ZSpace's near plane on the positive View-space Z-axis.
             *
             * Fires a {{#crossLink "ZSpace/nearClip:event"}}{{/crossLink}} event on change.
             *
             * @property nearClip
             * @default 0.1
             * @type Number
             */
            nearClip: {

                set: function (value) {

                    this._nearClip = (value !== undefined && value !== null) ? value : 0.1;

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace's   {{#crossLink "ZSpace/nearClip:property"}}{{/crossLink}} property changes.
                     * @event nearClip
                     * @param value The property's new value
                     */
                    this.fire("nearClip", this._nearClip);
                },

                get: function () {
                    return this._nearClip;
                }
            },

            /**
             * Position of this ZSpace's far plane on the positive View-space Z-axis.
             *
             * Fires a {{#crossLink "ZSpace/farClip:event"}}{{/crossLink}} event on change.
             *
             * @property farClip
             * @default 10000.0
             * @type Number
             */
            farClip: {

                set: function (value) {

                    this._farClip = (value !== undefined && value !== null) ? value : 10000;

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace's  {{#crossLink "ZSpace/farClip:property"}}{{/crossLink}} property changes.
                     *
                     * @event farClip
                     * @param value The property's new value
                     */
                    this.fire("farClip", this._farClip);
                },

                get: function () {
                    return this._farClip;
                }
            },

            /**
             * The viewer scale.
             *
             * Updates to this are ignored when {{#crossLink "ZSpace/autoViewerScale:property"}}{{/crossLink}} is true.
             *
             * Fires a {{#crossLink "ZSpace/viewerScale:event"}}{{/crossLink}} event on change.
             *
             * @property viewerScale
             * @default 1
             * @type Number
             */
            viewerScale: {

                set: function (value) {

                    value = value || 1;

                    if (this._viewerScale === value) {
                        return;
                    }

                    if (value < 0) {
                        this.warn("Negative viewerScale not allowed - will invert");
                        value = -value;
                    }

                    this._viewerScale = value;

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace's {{#crossLink "ZSpace/viewerScale:property"}}{{/crossLink}} property changes.
                     * @event viewerScale
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("viewerScale", this._viewerScale);
                },

                get: function () {
                    return this._viewerScale;
                }
            },

            /**
             * Set true to automatically size {{#crossLink "ZSpace/viewerScale:event"}}{{/crossLink}} to fit
             * everything in the {{#crossLink "Scene"}}{{/crossLink}}.
             *
             * Fires a {{#crossLink "ZSpace/autoViewerScale:event"}}{{/crossLink}} event on change.
             *
             * @property autoViewerScale
             * @default true
             * @type Boolean
             */
            autoViewerScale: {

                set: function (value) {

                    value = value !== false;

                    if (this._autoViewerScale === value) {
                        return;
                    }

                    if (value) {
                        var self = this;
                        this._onSceneBoundary = this.scene.worldBoundary.on("updated", function (boundary) {
                            self._autoViewerScaleDirty = true;
                        });
                    } else {
                        this.scene.worldBoundary.off(this._onSceneBoundary);
                    }

                    this._autoViewerScale = value;

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace's {{#crossLink "ZSpace/autoViewerScale:property"}}{{/crossLink}} property changes.
                     * @event autoViewerScale
                     * @type Boolean
                     * @param value The property's new value
                     */
                    this.fire("autoViewerScale", this._autoViewerScale);
                },

                get: function () {
                    return this._autoViewerScale;
                }
            },

            /**
             * The World-space origin.
             *
             * Fires a {{#crossLink "ZSpace/viewerOrigin:event"}}{{/crossLink}} event on change.
             *
             * @property viewerOrigin
             * @default [0,0,0]
             * @type Float32Array
             */
            viewerOrigin: {

                set: function (value) {

                    (this._viewerOrigin = this._viewerOrigin || new XEO.math.vec3()).set(value || [0, 0, 0]);

                    this._renderer.imageDirty = true;

                    /**
                     Fired whenever this Translate's {{#crossLink "Translate/viewerOrigin:property"}}{{/crossLink}} property changes.
                     @event viewerOrigin
                     @param value {Float32Array} The property's new value
                     */
                    this.fire("viewerOrigin", this._viewerOrigin);
                },

                get: function () {
                    return this._viewerOrigin;
                }
            },

            /**
             * The display resolution.
             *
             * Fires a {{#crossLink "ZSpace/displayResolution:event"}}{{/crossLink}} event on change.
             *
             * @property viewerScale
             * @default [1920, 1080]
             * @type Float32Array
             */
            displayResolution: {

                set: function (value) {

                    (this._displayResolution = this._displayResolution || new XEO.math.vec2()).set(value || [1920, 1080]);

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace's {{#crossLink "ZSpace/displayResolution:property"}}{{/crossLink}} property changes.
                     * @event displayResolution
                     * @type Float32Array
                     * @param value The property's new value
                     */
                    this.fire("displayResolution", this._displayResolution);
                },

                get: function () {
                    return this._displayResolution;
                }
            },

            /**
             * The display size.
             *
             * Fires a {{#crossLink "ZSpace/displaySize:event"}}{{/crossLink}} event on change.
             *
             * @property viewerScale
             * @default [0.521, 0.293]
             * @type Float32Array
             */
            displaySize: {

                set: function (value) {

                    (this._displaySize = this._displaySize || new XEO.math.vec2()).set(value || [0.521, 0.293]);

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace's {{#crossLink "ZSpace/displaySize:property"}}{{/crossLink}} property changes.
                     * @event displaySize
                     * @type Float32Array
                     * @param value The property's new value
                     */
                    this.fire("displaySize", this._displaySize);
                },

                get: function () {
                    return this._displaySize;
                }
            },

            /**
             * The current 3D position of the stylus.
             *
             * Fires a {{#crossLink "ZSpace/stylusMoved:event"}}{{/crossLink}} event on change.
             *
             * @property stylusPos
             * @type Float32Array
             * @final
             */
            stylusPos: {
                get: function () {
                    return this._stylusPos;
                }
            },

            /**
             * The current 3D orientation of the stylus.
             *
             * Fires a {{#crossLink "ZSpace/stylusMoved:event"}}{{/crossLink}} event on change.
             *
             * @property stylusOrientation
             * @type Float32Array
             * @final
             */
            stylusOrientation: {
                get: function () {
                    return this._stylusOrientation;
                }
            },

            /**
             * The current camera matrix for the stylus.
             *
             * Fires a {{#crossLink "ZSpace/stylusMoved:event"}}{{/crossLink}} event on change.
             *
             * @property stylusCameraMatrix
             * @type Float32Array
             * @final
             */
            stylusCameraMatrix: {
                get: function () {
                    return this._stylusCameraMatrix;
                }
            },

            /**
             * Whether or not the first button is down on the stylus.
             *
             * Fires a {{#crossLink "ZSpace/stylusButton0:event"}}{{/crossLink}} event on change.
             *
             * @property stylusButton0
             * @default false
             * @type Boolean
             * @final
             */
            stylusButton0: {
                get: function () {
                    return this._stylusButton0;
                }
            },

            /**
             * Whether or not the second button is down on the stylus.
             *
             * Fires a {{#crossLink "ZSpace/stylusButton1:event"}}{{/crossLink}} event on change.
             *
             * @property stylusButton1
             * @default false
             * @type Boolean
             * @final
             */
            stylusButton1: {
                get: function () {
                    return this._stylusButton1;
                }
            },

            /**
             * Whether or not the third button is down on the stylus.
             *
             * Fires a {{#crossLink "ZSpace/stylusButton2:event"}}{{/crossLink}} event on change.
             *
             * @property stylusButton2
             * @default false
             * @type Boolean
             * @final
             */
            stylusButton2: {
                get: function () {
                    return this._stylusButton2;
                }
            },

            /**
             * Flag which indicates whether this ZSpace component is active or not.
             *
             * Note that this ZSpace component can still be activated when the browser does not support ZSpace.
             *
             * Fires an {{#crossLink "ZSpace/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             * @default true
             */
            active: {

                set: function (value) {

                    value = value !== false;

                    if (this._active === value) {
                        return;
                    }

                    this._active = value;
                    this._active ? this._activate() : this._deactivate();

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this ZSpace component's {{#crossLink "ZSpace/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active);
                },

                get: function () {
                    return this._active;
                }
            }
        },

        _activate: function () { // Activates this ZSpace component

            var self = this;

            // Need to reallocate stereo framebuffer
            // whenever canvas resizes or context lost/restored

            this._onCanvasResized = this.scene.canvas.on("boundary", function () {
                self._destroyFrameBuffer(); // To recreate next time we bind it
            });

            this._onWebGLContextRestored = this.scene.canvas.on("webglContextRestored", function () {
                self._frameBufferAllocated = false; // Framebuffers were destroyed by context loss, reallocate next time we bind
            });

            // Intercept each render with a callback; we'll get two invocations
            // per frame, one for the left eye, a second for the right

            this._onSceneRendering = this.scene.on("rendering", this._rendering, this);

            // Attach renderer hooks to bind/unbind our stereo
            // framebuffer as the renderer's output buffer.

            this._renderer.bindOutputFramebuffer = function (pass) {
                if (!self._supported) { // Support not found yet
                    return;
                }
            //    self._bindFrameBuffer(pass); // pass will be 0 for left or 1 for right
            };

            this._renderer.unbindOutputFramebuffer = function (pass) {
                if (!self._supported) { // Support not found yet
                    return;
                }
                if (pass === 1) { // Unbind after right eye pass
              //      self._unbindFrameBuffer();
                }
            };
        },

        _bindFrameBuffer: function (pass) { // Activates stereo output framebuffer, lazy-allocating it if needed
            if (!this._frameBufferAllocated) { // Becomes false on "webglContextRestored" event and when canvas resized
                this._allocateFrameBuffer();
            }
            // this.log("Binding stereo framebuffer - pass = " + pass);
            var gl = this.scene.canvas.gl;
            if (pass === 0) {
                gl.setStereoFramebuffer(this._frameBuffer, this._frameBufferTexture);
            }
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTextureLayer(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this._frameBufferTexture, 0, pass);
            gl.framebufferTextureLayer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, this._frameBufferDepthTexture, 0, pass);
        },

        _allocateFrameBuffer: function () { // Allocates stereo output framebuffer

            var gl = this.scene.canvas.gl;
            var canvas = this.scene.canvas.canvas;
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;

            // this.log("Creating stereo framebuffer - size = " + width + ", " + height);

            this._frameBufferTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._frameBufferTexture);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGB8, width, height, 2, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

            if (this.frameBuffer == null) {
                this._frameBuffer = gl.createFramebuffer();
            }

            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTextureLayer(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this._frameBufferTexture, 0, 0);

            this._frameBufferDepthTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._frameBufferDepthTexture);
            gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.DEPTH24_STENCIL8, width, height, 2, 0, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
            gl.framebufferTextureLayer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, this._frameBufferDepthTexture, 0, 0);

            gl.setStereoFramebuffer(this._frameBuffer, this._frameBufferTexture);

            this._frameBufferAllocated = true;
        },

        _destroyFrameBuffer: function () { // Called on deactivation to destroy stereo framebuffer

            if (!this._frameBufferAllocated) {
                return;
            }

            //this.log("Destroying stereo framebuffer");

            var gl = this.scene.canvas.gl;

            gl.deleteTexture(this._frameBufferDepthTexture);
            gl.deleteFramebuffer(this._frameBuffer);

            this._frameBufferAllocated = false;
        },

        _unbindFrameBuffer: function () { // Deactivates stereo output framebuffer
            var gl = this.scene.canvas.gl;
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        },

        _rendering: function (e) { // Scene render callback, called for left and right eye within each render

            if (!this._supported) {

                // Support is found asynchronously and we are able to be active while looking for it.
                // Come back on next render, maybe we'll have support then.

                return;
            }

            var camera = this._attached.camera;

            if (!camera) {
                return; // Come back on next render, maybe we'll have a camera then
            }

            // Need to have XEO.Transforms for viewing and projection
            // on the Camera, so that we can set matrices on them.

            if (camera.project.type !== "XEO.Transform") {
                this.warn("Replacing camera's projection transform with a XEO.Transform (needed for ZSpace)");
                this._oldProject = camera.project; // Save so we can restore on deactivation
                camera.project = camera.create(XEO.Transform);
            }

            if (camera.view.type !== "XEO.Transform") {
                this.warn("Replacing camera's viewing transform with a XEO.Transform (needed for ZSpace)");
                this._oldView = camera.view; // Save so we can restore on deactivation
                camera.view = camera.create(XEO.Transform);
                camera.view.parent = camera.create(XEO.Translate, {
                    xyz: this._viewerOrigin
                })
            }

            // If we have not yet configured the scene to do two passes per frame,
            // then configure it now and come back on the next render.
            // Note that we also configure the scene to clear the framebuffer before each pass.

            if (this.scene.passes !== 2 || !this.scene.clearEachPass) {
                this.scene.passes = 2;
                this.scene.clearEachPass = true;
                return;
            }

            // Update camera viewing and projection matrices for left or right eye

            switch (e.pass) {

                case 0: // Left eye

                    this._buildMatrices(); // Build the matrices on first pass

                    camera.view.matrix = this._leftViewMatrix;
                    camera.project.matrix = this._leftProjectionMatrix;

                    //   console.log("leftViewMatrix = " + JSON.stringify(this._leftViewMatrix));

                    break;

                case 1: // Right eye

                    camera.view.matrix = this._rightViewMatrix;
                    camera.project.matrix = this._rightProjectionMatrix;

                    // console.log("rightViewMatrix = " + JSON.stringify(this._rightViewMatrix));

                    break;
            }
        },

        _buildMatrices: (function () { // Builds view and projection matrices for left and right views, polls the stylus

            // Cached vars

            var canvas;
            var canvasPosition;
            var canvasWidth;
            var canvasHeight;
            var displayCenterX;
            var displayCenterY;
            var displayScaleFactorX;
            var displayScaleFactorY;
            var viewportCenterX;
            var viewportCenterY;

            var viewportShift = math.vec3([0.0, 0.0, 0.0]); // View offset
            var offsetTranslateMat = math.identityMat4(); // View offset translation matrix

            var scale = math.vec3(); // View scale
            var viewScaleMat = math.identityMat4(); // View scale matrix

            var tempVec3a = math.vec3();
            var tempVec3b = math.vec3();

            var leftProjectionPose;
            var rightProjectionPose;

            var up;
            var down;
            var left;
            var right;

            return function () {

                canvas = this.scene.canvas.canvas;

                canvasPosition = getPosition(canvas);
                canvasWidth = canvas.clientWidth * displayScaleFactorX * this._viewerScale;
                canvasHeight = canvas.clientHeight * displayScaleFactorY * this._viewerScale;
                displayCenterX = this._displayResolution[0] * 0.5;
                displayCenterY = this._displayResolution[1] * 0.5;
                viewportCenterX = canvasPosition.x + (canvas.clientWidth * 0.5);
                viewportCenterY = this._displayResolution[1] - (canvasPosition.y + (canvas.clientHeight * 0.5));

                displayScaleFactorX = this._displaySize[0] / this._displayResolution[0];
                displayScaleFactorY = this._displaySize[1] / this._displayResolution[1];

                // View offset matrix

                viewportShift[0] = (viewportCenterX - displayCenterX) * displayScaleFactorX;
                viewportShift[1] = (viewportCenterY - displayCenterY) * displayScaleFactorY;
                math.translationMat4v(viewportShift, offsetTranslateMat);

                // Viewer scale matrix

                //if (this._autoViewerScaleDirty) {
                //    this._autoViewerScaleDirty = false;
                //    var boundary = this.scene.worldBoundary;
                //    // this.viewerOrigin = boundary.center;
                //    this.viewerScale = math.getAABBDiag(boundary.aabb); // Fire update events etc.
                //}

                scale[0] = this._viewerScale;
                scale[1] = this._viewerScale;
                scale[2] = this._viewerScale;
                math.scalingMat4v(scale, viewScaleMat);

                // Batches this component's outgoing update events for after all ZSpace device updates
                // processed, so that we have all device state available at the time we fire them

                var stylusMoved = false;
                var stylusButton0Updated = false;
                var stylusButton1Updated = false;
                var stylusButton2Updated = false;

                // Left eye viewing matrix

                var leftViewPose = this._leftViewDevice.getPose();
                if (leftViewPose && leftViewPose.orientation && leftViewPose.position) {
                    math.transformPoint3(offsetTranslateMat, leftViewPose.position, tempVec3a);
                    math.transformPoint3(viewScaleMat, tempVec3a, tempVec3b);
                    math.rotationTranslationMat4(leftViewPose.orientation, tempVec3b, this._leftViewMatrix);
                } else {
                    math.lookAtMat4v([-15, 0, -40], [-15, 0, 0], [0, 1, 0], this._leftViewMatrix);
                }

                // Right eye viewing matrix

                var rightViewPose = this._rightViewDevice.getPose();
                if (rightViewPose && rightViewPose.orientation && rightViewPose.position) {
                    math.transformPoint3(offsetTranslateMat, rightViewPose.position, tempVec3a);
                    math.transformPoint3(viewScaleMat, tempVec3a, tempVec3b);
                    math.rotationTranslationMat4(rightViewPose.orientation, tempVec3b, this._rightViewMatrix);
                } else {
                    math.lookAtMat4v([15, 0, -40], [15, 0, 0], [0, 1, 0], this._rightViewMatrix);
                }

                offsetTranslateMat[12] = -offsetTranslateMat[12];
                offsetTranslateMat[13] = -offsetTranslateMat[13];

                // Left eye projection matrix

                leftProjectionPose = this._leftProjectionDevice.getPose();
                if (leftProjectionPose && leftProjectionPose.orientation && leftProjectionPose.position) {
                    math.transformPoint3(offsetTranslateMat, leftProjectionPose.position, tempVec3a);
                    math.transformPoint3(viewScaleMat, tempVec3a, tempVec3b);
                    up = Math.atan((canvasHeight * 0.5 - tempVec3b[1]) / tempVec3b[2]);
                    down = Math.atan((canvasHeight * 0.5 + tempVec3b[1]) / tempVec3b[2]);
                    left = Math.atan((canvasWidth * 0.5 + tempVec3b[0]) / tempVec3b[2]);
                    right = Math.atan((canvasWidth * 0.5 - tempVec3b[0]) / tempVec3b[2]);
                    makeProjectionMatrix(up, down, left, right, this._nearClip, this._farClip, this._leftProjectionMatrix);

                } else {
                    math.frustumMat4(-0.1, 0.1, -0.1, 0.1, 0.1, 1000.0, this._leftProjectionMatrix);
                }

                // Right eye projection matrix

                rightProjectionPose = this._rightProjectionDevice.getPose();
                if (rightProjectionPose && rightProjectionPose.orientation && rightProjectionPose.position) {
                    math.transformPoint3(offsetTranslateMat, rightProjectionPose.position, tempVec3a);
                    math.transformPoint3(viewScaleMat, tempVec3a, tempVec3b);
                    up = Math.atan((canvasHeight * 0.5 - tempVec3b[1]) / tempVec3b[2]);
                    down = Math.atan((canvasHeight * 0.5 + tempVec3b[1]) / tempVec3b[2]);
                    left = Math.atan((canvasWidth * 0.5 + tempVec3b[0]) / tempVec3b[2]);
                    right = Math.atan((canvasWidth * 0.5 - tempVec3b[0]) / tempVec3b[2]);
                    makeProjectionMatrix(up, down, left, right, this._nearClip, this._farClip, this._rightProjectionMatrix);

                } else {
                    math.frustumMat4(-0.1, 0.1, -0.1, 0.1, 0.1, 1000.0, this._rightProjectionMatrix);
                }

                // Poll the stylus' pose

                var stylusPose = this._stylusDevice.getPose();
                if (stylusPose && stylusPose.orientation && stylusPose.position) {

                    var orientation = stylusPose.orientation;

                    math.transformPoint3(offsetTranslateMat, stylusPose.position, tempVec3a);
                    math.transformPoint3(viewScaleMat, tempVec3a, tempVec3b);

                    math.rotationTranslationMat4(orientation, tempVec3b, this._stylusCameraMatrix);

                    if (this._stylusPos[0] !== tempVec3b[0] && this._stylusPos[1] !== tempVec3b[1] && this._stylusPos[2] !== tempVec3b[2]) {
                        this._stylusPos[0] = tempVec3b[0];
                        this._stylusPos[1] = tempVec3b[1];
                        this._stylusPos[2] = tempVec3b[2];
                        stylusMoved = true;
                    }

                    if (this._stylusOrientation[0] !== orientation[0] && this._stylusOrientation[1] !== orientation[1] && this._stylusOrientation[2] !== orientation[2] && this._stylusOrientation[3] !== orientation[3]) {
                        this._stylusOrientation[0] = orientation[0];
                        this._stylusOrientation[1] = orientation[1];
                        this._stylusOrientation[2] = orientation[2];
                        this._stylusOrientation[3] = orientation[3];
                        stylusMoved = true;
                    }

                } else {
                    math.identityMat4(this._stylusCameraMatrix);
                }

                // Poll the stylus' buttons

                var stylusButtonsPose = this._stylusButtonsDevice.getPose();
                if (stylusButtonsPose && stylusButtonsPose.position) {

                    var buttons = stylusButtonsPose.position;
                    var button0 = !!buttons[0];
                    var button1 = !!buttons[1];
                    var button2 = !!buttons[2];

                    if (this._stylusButton0 !== button0) {
                        this._stylusButton0 = button0;
                        stylusButton0Updated = true;
                    }

                    if (this._stylusButton1 !== button1) {
                        this._stylusButton1 = button1;
                        stylusButton1Updated = true;
                    }

                    if (this._stylusButton2 !== button2) {
                        this._stylusButton2 = button2;
                        stylusButton2Updated = true;
                    }
                }

                // Fire batched update events

                if (stylusMoved) {
                    this.fire("stylusMoved", true);
                }

                if (stylusButton0Updated) {
                    this.fire("stylusButton0", this._stylusButton0);
                }

                if (stylusButton1Updated) {
                    this.fire("stylusButton1", this._stylusButton1);
                }

                if (stylusButton2Updated) {
                    this.fire("stylusButton2", this._stylusButton2);
                }
            };

        })(),

        _deactivate: function () { // Deactivates this XEO.ZSpace

            var scene = this.scene;

            scene.passes = 1; // Don't need to restore scene.clearEachPass

            if (this._oldView) { // Transforms were replaced on camera when activating - restore old transforms
                this._attached.camera.view = this._oldView;
                this._attached.camera.project = this._oldProject;
                this._oldView = null;
                this._oldProject = null;
            }

            scene.canvas.off(this._onCanvasResized);
            scene.canvas.off(this._onWebGLContextRestored);
            scene.off(this._onSceneRendering);

            this._renderer.bindOutputFramebuffer = null; // Remove hooks to bind/unbind our stereo framebuffer
            this._renderer.unbindOutputFramebuffer = null;

            this._destroyFrameBuffer();
        },

        _getJSON: function () { // Returns JSON configuration of this component
            var json = {
                active: this._active,
                displayResolution: this._displayResolution.slice(0),
                displaySize: this._displaySize.slice(0),
                nearClip: this._nearClip,
                farClip: this._farClip
            };
            if (this._autoViewerScale) {
                json.autoViewerScale = this._autoViewerScale;
            } else {
                json.viewerScale = this._viewerScale;
            }
            if (this._attached.camera) {
                json.camera = this._attached.camera.id;
            }
            return json;
        },

        _destroy: function () { // Destroys this component, deactivating it first
            this.active = false;
            this.autoViewerScale = false;
        }
    });

    function getPosition(canvas) { // Helper function to get an element's exact position
        var canvasOffset = [0, 0];
        return {
            x: window.screenX + canvas.offsetLeft - screen.availLeft + canvasOffset[0],
            y: window.screenY + canvas.offsetTop + 75 + canvasOffset[1]
        };
    }

    function makeProjectionMatrix(up, down, left, right, nearClip, farClip, out) {
        var o = Math.tan(up);
        var u = Math.tan(down);
        var l = Math.tan(left);
        var e = Math.tan(right);
        var M = 2 / (l + e), s = 2 / (o + u);
        out[0] = M;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = s;
        out[6] = 0;
        out[7] = 0;
        out[8] = -((l - e) * M * .5);
        out[9] = (o - u) * s * .5;
        out[10] = farClip / (nearClip - farClip);
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = farClip * nearClip / (nearClip - farClip);
        out[15] = 0;
        return out;
    }
})();