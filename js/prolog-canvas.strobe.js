/*global Prolog, Math*/
Prolog.prototype.effects.strobe = {
    def: function drawFrame(scene, progress) {
        'use strict';
        var factor = 0;

        if (scene.background) {
            this.ctx.beginPath();
                this.ctx.fillStyle = scene.background.color;
                this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.closePath();
        }

        // NORMAL
        if (Math.floor(progress) === 1) {
            factor = 1;
        } else {
            factor =  10 - (Math.floor(10 * progress) / 10).toString().substr(-1);
        }

        if (Math.floor(progress * 1000) % factor === 0) {
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
    }
};

