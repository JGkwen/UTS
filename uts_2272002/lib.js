export class ImageLib {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.curtainHeight = this.canvas.height * 0.5;
        this.isDragging = false;
        this.startY = 0;
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        
        this.controlCurtain();
        this.drawCurtain();
    }

    controlCurtain() {
        this.canvas.addEventListener("mousedown", (e) => {
            this.isDragging = true;
            this.startY = e.clientY;
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                const diff = e.clientY - this.startY;
                this.curtainHeight = Math.min(this.canvas.height, Math.max(0, this.curtainHeight + diff));
                this.startY = e.clientY;
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            this.isDragging = false;
        });
    }

    drawDot(imageData, x, y, color) {
        const index = (x + y * imageData.width) * 4;
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = color.a;
    }


    dot(imageDataTemp, x, y, color) {
        this.drawDot(imageDataTemp, x, y, color);
    }

    drawLine(imageDataTemp, x0, y0, x1, y1, color) {
        const dy = y1 - y0;
        const dx = x1 - x0;
        let gradient;

        if (Math.abs(dx) >= Math.abs(dy)) {
            gradient = dy / dx;
            if (x1 >= x0) {
                let y = y0;
                for (let x = x0; x <= x1; x++) {
                    this.dot(imageDataTemp, x, Math.round(y), color); 
                    y += gradient;
                }
            } else {
                let y = y0;
                for (let x = x0; x >= x1; x--) {
                    this.dot(imageDataTemp, x, Math.round(y), color); 
                    y -= gradient;
                }
            }
        } else {
            gradient = dx / dy;
            if (y1 >= y0) {
                let x = x0;
                for (let y = y0; y <= y1; y++) {
                    this.dot(imageDataTemp, Math.round(x), y, color); 
                    x += gradient;
                }
            } else {
                let x = x0;
                for (let y = y0; y >= y1; y--) {
                    this.dot(imageDataTemp, Math.round(x), y, color); 
                    x -= gradient;
                }
            }
        }
    }

    drawPolygon(points, color) {
        for (let y = points[0].y; y <= points[2].y; y++) {
            for (let x = points[0].x; x <= points[1].x; x++) {
                this.drawDot(this.imageData, x, y, color);
            }
        }
    }

    drawCurtain() {
        const brightness = (this.curtainHeight / this.canvas.height);
        const brightnessColor = { r: 0, g: 0, b: 0, a: Math.floor(brightness * 255) };
        
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                this.drawDot(this.imageData, x, y, brightnessColor);
            }
        }
    
        const curtainColor = { r: 51, g: 51, b: 51, a: 255 };
        const separatorColor = { r: 30, g: 30, b: 30, a: 255 };
        const layer = 10;
        const layerHeight = Math.floor(this.curtainHeight / layer);
    
        for (let i = 0; i < layer; i++) {
            let top = i * layerHeight;

            for (let y = top; y < top + layerHeight; y++) {
                for (let x = 0; x < this.canvas.width; x++) {
                    this.drawDot(this.imageData, x, y, curtainColor);
                }
            }
            
            let separatorY = top + layerHeight;
            if (separatorY < this.curtainHeight) { 
                for (let x = 0; x < this.canvas.width; x++) {
                    this.drawDot(this.imageData, x, separatorY, separatorColor);
                }
            }
        }
    
        this.ctx.putImageData(this.imageData, 0, 0);
    
        requestAnimationFrame(() => this.drawCurtain());
    }
    
}
