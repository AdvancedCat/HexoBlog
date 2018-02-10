var Preview = {
    initBigImg: function(){
        var imgDoms = $('.post-page').find('img')
        imgDoms.on('click', function (e) {
            var $img = $(this),
                imgSrc = $img.prop('src')

            //onsole.log('点击了图片', imgSrc)
            generateBigImg(imgSrc)
        })

        $('body').on('click', '.preview-mask', function(e){
            var $this = $(this)
            $this.remove()
        })
    },
    
}

function generateBigImg(src) {

    var mask = `
            <div class="preview-mask">
                <img src="PREVIEW_SRC" alt="预览图片">
            </div>
        `
    mask = mask.replace('PREVIEW_SRC', src)

    $('body').append($(mask))
}

module.exports = Preview