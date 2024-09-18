const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d') as CanvasRenderingContext2D

const imageURL =
    'https://avatars.dzeninfra.ru/get-zen_doc/1917783/pub_5e7dbff846dea17ef5bb93ed_5e80bb2299b4502b6f2e118e/scale_1200'

const resizeSize = 90

const getGrayScaleFromImageData = (data: Uint8ClampedArray) => {
    const result: number[] = []

    for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]

        const grayScale = Math.floor((r + g + b) / 3)

        result.push(grayScale, grayScale, grayScale, a)
    }

    return result
}

const getASCIIFromGrayScale = (data: number[]) => {
    let result = ''

    const debug: any[] = []

    for (let i = 0; i < data.length; i += 4) {
        const n = 1 - data[i] / 255

        debug.push(n)

        if (n >= 0 && n < 0.1) {
            result += ' '
        }

        if (n >= 0.1 && n < 0.2) {
            result += '.'
        }

        if (n >= 0.2 && n < 0.3) {
            result += ':'
        }

        if (n >= 0.3 && n < 0.4) {
            result += '-'
        }

        if (n >= 0.4 && n < 0.5) {
            result += '='
        }

        if (n >= 0.5 && n < 0.6) {
            result += '+'
        }

        if (n >= 0.6 && n < 0.7) {
            result += '*'
        }

        if (n >= 0.7 && n < 0.8) {
            result += '#'
        }

        if (n >= 0.8 && n < 0.9) {
            result += '&'
        }

        if (n >= 0.9 && n <= 1) {
            result += '@'
        }

        if (i >= resizeSize * 4 && i % (resizeSize * 4) === 0) {
            result += ' '
        }
    }

    return result
}

fetch(imageURL).then((data) => {
    data.blob().then((blob) => {
        createImageBitmap(blob, {
            resizeHeight: resizeSize,
            resizeWidth: resizeSize,
            resizeQuality: 'pixelated',
        }).then((bitmap) => {
            context.drawImage(bitmap, 0, 0)

            const imageData = context.getImageData(0, 0, resizeSize, resizeSize)

            const grayScale = getGrayScaleFromImageData(imageData.data)

            context.putImageData(
                new ImageData(
                    new Uint8ClampedArray(grayScale),
                    resizeSize,
                    resizeSize
                ),
                0,
                0
            )

            const ascii = getASCIIFromGrayScale(grayScale)

            const style = 'font-size: 6px; line-height: 3px;'

            console.log(`%c${ascii}`, style)
        })
    })
})
