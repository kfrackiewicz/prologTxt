/*global Prolog*/
Prolog.prototype.effects.normal = {
    def: function drawFrame(scene, progress) {
        'use strict';

        if (scene.background) {
            this.ctx.beginPath();
                this.ctx.fillStyle = scene.background.color;
                this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.closePath();
        }

        // NORMAL
        this.ctx.beginPath();

            this.ctx.textAlign = 'left';
            if (scene.background && !scene.text.color) {
                this.ctx.globalCompositeOperation = 'destination-out';
            } else {
                this.ctx.fillStyle = scene.text.color;
            }
            this.ctx.fillText(
                scene.text.value,
                scene.text.left,
                scene.text.top
            );

        this.ctx.closePath();

    }
};

