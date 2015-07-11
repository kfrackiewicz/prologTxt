Prolog.prototype.effects.mirror = {
    def: function drawFrame(scene, progress) {
        'use strict';
        var rectWidth = scene.text.width * (1 - progress),
            clipLeft = scene.text.left - scene.text.width + ((scene.text.width - rectWidth) * 2);

        if (scene.background) {
            this.ctx.beginPath();
                this.ctx.fillStyle = scene.background.color;
                this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.closePath();
        }

        // CLIP NORMAL
        this.ctx.beginPath();
            if (scene.text.left > clipLeft) {
                this.ctx.rect(clipLeft, 0, scene.text.width - (scene.text.width * progress), this.height);
            } else {
                this.ctx.rect(scene.text.left, 0, scene.text.width * progress, this.height);
            }
            this.ctx.clip();
        this.ctx.closePath();

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

        // CLIP MIRROR
        this.ctx.beginPath();
            this.ctx.rect(
                scene.text.left - scene.text.width + ((scene.text.width - rectWidth) * 2),
                0,
                scene.text.width - (scene.text.width * progress),
                this.height
            );
            this.ctx.clip();
        this.ctx.closePath();

        // MIRROR
        this.ctx.beginPath();
            this.ctx.translate(this.width, 0);
            this.ctx.scale(-1, 1);
        this.ctx.closePath();

        this.ctx.beginPath();
            this.ctx.textAlign = 'left';
            if (scene.background && !scene.text.color) {
                this.ctx.globalCompositeOperation = 'destination-out';
            } else {
                this.ctx.fillStyle = scene.text.color;
            }
            this.ctx.fillText(
                scene.text.value,
                scene.text.left + scene.text.width - ((scene.text.width - rectWidth) * 2),
                scene.text.top
            );

            this.ctx.translate(this.width, 0);
            this.ctx.scale(-1, 1);
        this.ctx.closePath();
    }
};

