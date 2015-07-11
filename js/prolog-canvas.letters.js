/*global Prolog*/
Prolog.prototype.effects.letters = {
    def: function drawFrame(scene, progress) {
        'use strict';
        var factor = Math.ceil(scene.text.value.length * progress);

        if (scene.background) {
            this.ctx.beginPath();
                this.ctx.fillStyle = scene.background.color;
                this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.closePath();
        }

        // NORMAL
        this.ctx.beginPath();
            if (scene.background && !scene.text.color) {
                this.ctx.globalCompositeOperation = 'destination-out';
            } else {
                this.ctx.fillStyle = scene.text.color;
            }
        this.ctx.closePath();

        switch (scene.direction) {
            case 'center':
                this.ctx.beginPath();
                    this.ctx.textAlign = 'right';
                    if (Math.floor(factor/2) !== 0) {
                        this.ctx.fillText(
                            scene.text.value.substr(-Math.floor(factor/2)),
                            scene.text.left + scene.text.width,
                            scene.text.top
                        );
                    }
                this.ctx.closePath();
                this.ctx.beginPath();
                    this.ctx.textAlign = 'left';
                    this.ctx.fillText(
                        scene.text.value.substr(0, Math.floor(factor/2)),
                        scene.text.left,
                        scene.text.top
                    );
                this.ctx.closePath();
            break;
            case 'left':
                this.ctx.beginPath();
                    this.ctx.textAlign = 'right';
                    this.ctx.fillText(
                        scene.text.value.substr(-factor),
                        scene.text.left + scene.text.width,
                        scene.text.top
                    );
                this.ctx.closePath();
            break;
            case 'right':
            default:
                this.ctx.beginPath();
                    this.ctx.textAlign = 'left';
                    this.ctx.fillText(
                        scene.text.value.substr(0, factor),
                        scene.text.left,
                        scene.text.top
                    );
                this.ctx.closePath();
            break;
        }



    }
};

