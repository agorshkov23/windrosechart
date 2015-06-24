var WindRose = (function () {
    function WindRose(options) {
        this.element = document.getElementById(options.id);
        if (!this.element)
            throw "Нет такого элемента";
        //window.onresize = function (e) {
        this.element.onresize = function (e) {
            this.resize();
        };
        if (options.data)
            this.data = options.data;
        this.padding = options.padding || 10;
        this.font = options.font || "normal 14px arial";
        this.canvas = document.createElement("canvas");
        this.element.appendChild(this.canvas);
        this.canvas.width = this.element.clientWidth;
        this.canvas.height = this.element.clientHeight;
        this.context = this.canvas.getContext("2d");
    }
    WindRose.prototype.draw = function () {
        var i, j, x, y;
        var center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        this.clear();
        //  получение максимального количества осей
        var axesCount = 0;
        for (i = 0; i < this.data.series.length; i++)
            axesCount = Math.max(axesCount, this.data.series[i].length);
        console.assert(axesCount !== 0, "осей не может быть 0");
        //  угол между осями
        var dAngle = 2 * Math.PI / axesCount;
        //  максимальное значение серии
        var maxSeriesItem = 0;
        for (i = 0; i < this.data.series.length; i++)
            for (j = 0; j < this.data.series[i].length; j++)
                maxSeriesItem = Math.max(maxSeriesItem, this.data.series[i][j]);
        //  радиус
        var radius = Math.min(this.canvas.height, this.canvas.width) / 2 - this.padding;
        //  коэффициент масштабирования
        var scale = radius / maxSeriesItem * 0.9;
        //  угол начинается сверху
        var angle = -Math.PI / 2;
        for (i = 0; i < axesCount; i++) {
            x = radius * Math.cos(angle) + center.x;
            y = radius * Math.sin(angle) + center.y;
            this.context.beginPath();
            this.context.moveTo(center.x, center.y);
            this.context.lineTo(x, y);
            this.context.stroke();
            //  заголовки шкалы
            var title = this.data.titles[i];
            this.context.save();
            //  в зависимости от величины угла смещаем текст вправо или влево
            //  если угол -п/2, то выравнивание по центру
            if (Math.abs(angle) === Math.PI / 2)
                this.context.textAlign = "center";
            else if (Math.abs(angle) < Math.PI / 2)
                this.context.textAlign = "left";
            else
                this.context.textAlign = "right";
            this.context.font = this.font;
            //  выравнивание по вертикали: по центру
            this.context.textBaseline = "middle";
            this.context.fillText(title, x, y);
            this.context.restore();
            angle += dAngle;
        }
        this.context.stroke();
        for (i = 0; i < this.data.series.length; i++) {
            //  первый угол -п/2 и он startX, startY
            angle = -Math.PI / 2 + dAngle;
            //  начальная точка
            var startX = this.data.series[i][0] * scale * Math.cos(-Math.PI / 2) + center.x;
            var startY = this.data.series[i][0] * scale * Math.sin(-Math.PI / 2) + center.y;
            this.context.beginPath();
            this.context.save();
            this.context.strokeStyle = this.data.colors[i];
            this.context.lineWidth = 5;
            this.context.moveTo(startX, startY);
            for (j = 1; j < this.data.series[i].length; j++) {
                x = this.data.series[i][j] * scale * Math.cos(angle) + center.x;
                y = this.data.series[i][j] * scale * Math.sin(angle) + center.y;
                this.context.lineTo(x, y);
                angle += dAngle;
            }
            this.context.lineTo(startX, startY);
            this.context.stroke();
            this.context.restore();
        }
        return this;
    };
    WindRose.prototype.resize = function () {
        this.canvas.width = this.element.clientWidth;
        this.canvas.height = this.element.clientHeight;
        this.draw();
        return this;
    };
    WindRose.prototype.clear = function () {
        WindRose.log("clear");
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    };
    WindRose.log = function (msg) {
        var log = document.getElementById("log");
        var span = document.createElement("span");
        span.innerHTML = msg;
        log.appendChild(span).appendChild(document.createElement("br"));
    };
    return WindRose;
})();
