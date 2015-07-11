var Prolog = function (scenes) {
    'use strict';
    this.reqAnimationFrame = {};
    this.scenes = scenes;
    this.fps = 50;
    this.delay = 1000;
    this.easingFactor = 10;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.initialize();
};

Prolog.prototype.effects = {};

Prolog.prototype.requestAnimationFrame = function (callback) {
    'use strict';
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000 / this.fps);
        };
}

Prolog.prototype.setCanvasSize = function () {
    'use strict';
    if (!this.canvas) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
}

Prolog.prototype.createCanvas = function () {
    'use strict';
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    window.ctx = this.ctx;
    this.setCanvasSize();
}
Prolog.prototype.bindEvents = function () {
    'use strict';
    window.addEventListener('resize', this.setCanvasSize.bind(this));
}

Prolog.prototype.getTextLeft = function (textWidth) {
    'use strict';
    return (this.width - textWidth) / 2;
}

Prolog.prototype.getTextTop = function () {
    'use strict';
    return this.height / 2;
}

Prolog.prototype.kill = function () {
        'use strict';
    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
}


Prolog.prototype.getEasingTime = function (scene) {
    return scene.time / this.easingFactor;
}


Prolog.prototype.easingIn = function (scene) {
    var that = this,
        interval = 0,
        steps = this.getEasingTime(scene) / this.fps,
        i = 0;

    interval = setInterval(function () {
        i++;
        that.ctx.globalAlpha = scene.alpha * i / steps;
        if (steps === i) {
            clearInterval(interval);
        }
    }, 1000 / this.fps);

}

Prolog.prototype.easingOut = function (scene) {
    var that = this,
        interval = 0,
        steps = this.getEasingTime(scene) / this.fps,
        i = 0;

    interval = setInterval(function () {
        i++;
        that.ctx.globalAlpha = scene.alpha - (scene.alpha * i / steps);
        if (steps === i) {
            clearInterval(interval);
        }
    }, 1000 / this.fps);

}

Prolog.prototype.drawFrame = function (effect, scene, startTime) {
        'use strict';
    var progress = (Date.now() - startTime) / scene.time;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
        effect.def.call(this, scene, progress);
    this.ctx.restore();

    if (progress < 1) {
        this.reqAnimationFrame.call(window,
            this.drawFrame.bind(this, effect, scene, startTime)
        );
    } else {
        if (typeof scene.callback === 'function') {
            this.reqAnimationFrame.call(window, scene.callback);
        }
    }
}

Prolog.prototype.drawScene = function (index) {
    'use strict';
    var scene = {},
        effect = {},
        nextSceneDelay = 0,
        easingTime = 0;

    index = index || 0;
    scene = this.scenes[index];
    nextSceneDelay = scene.time + (isNaN(scene.delay) ? this.delay : scene.delay);

    scene.effect = scene.effect || 'normal';
    if (this.effects[scene.effect]) {
        effect = this.effects[scene.effect];
    } else {
        return console.error('effect not declared');
    }

    // SET OPACITY
    scene.alpha = scene.alpha || 1;
    if (scene.easing) {
        easingTime = scene.time -this.getEasingTime(scene);
        this.ctx.globalAlpha = 0;
        this.easingIn(scene);
    } else {
        this.ctx.globalAlpha = scene.alpha;
    }

    // SET TEXT
    this.ctx.font = scene.text.size + 'px ' + scene.text.font;

    // EXTENT scene object
    scene.text.width = this.ctx.measureText(scene.text.value).width;
    scene.text.left = 0;
    scene.text.top = this.getTextTop();
    scene.text.left = this.getTextLeft(scene.text.width);

    this.reqAnimationFrame.call(window,
        this.drawFrame.bind(this, effect, scene, Date.now())
    );

    // ON SCENE END
    if (scene.easing) {
        setTimeout(this.easingOut.bind(this, scene), easingTime);
    }
    if (this.scenes[++index]) {
        setTimeout(this.drawScene.bind(this, index), nextSceneDelay);
    } else {
        setTimeout(this.kill.bind(this), nextSceneDelay);
    }
}

Prolog.prototype.initialize = function () {
    'use strict';
    this.reqAnimationFrame = this.requestAnimationFrame();
    this.createCanvas();
    this.bindEvents();

    document.body.appendChild(this.canvas);
    this.drawScene();
}