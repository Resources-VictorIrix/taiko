let { openBrowser, radioButton, closeBrowser, evaluate, $, intervalSecs, timeoutSecs, goto, text } = require('../../lib/taiko');
let { createHtml, removeFile, openBrowserArgs } = require('./test-util');

describe('radio button', () => {
    beforeAll(async () => {
        await openBrowser(openBrowserArgs);
    }, 30000);

    afterAll(async () => {
        await closeBrowser();
    }, 30000);

    describe('with inline text', () => {
        let filePath;
        beforeAll(async () => {
            let innerHtml = '<form>' +
                '<input type="radio" id="red" name="color" value="red" checked>Red</input>' +
                '<input type="radio" name="color" value="yellow">Yellow</input>' +
                '<input type="radio" name="color" value="green">Green</input>' +
                '</form>'+
                '<div id="panel" style="display:none">show on check</div>' +
                '<script>' +
                'var elem = document.getElementById("red");'+
                'elem.addEventListener("click", myFunction);'+
                'function myFunction() {' +
                'document.getElementById("panel").style.display = "block";' +
                '}</script>';
            filePath = createHtml(innerHtml, 'radioButton');
        });

        afterAll(async () => {
            removeFile(filePath);
        });

        beforeEach(async () =>{
            await goto(filePath);
        });

        test('test exists()', async () => {
            await expect(radioButton('Yellow').exists()).resolves.toBeTruthy();
            await expect(radioButton('Brown').exists(intervalSecs(0), timeoutSecs(0))).resolves.toBeFalsy();
        });

        test('test select()', async () => {
            await radioButton('Green').select();
            let value = await evaluate($('input[name=color]:checked'), (element) => element.value);
            expect(value.result).toBe('green');
        });

        test('test select() triggers events', async() =>{
            await radioButton('Red').select();
            await expect(text('show on check').exists()).resolves.toBeTruthy();
        });

        test('test deselect()', async () => {
            await radioButton('Red').deselect();
            let value = await evaluate($('input[value=red]'), (element) => element.checked);
            await expect(value.result).toBeFalsy();
        });

        test('test isSelected()', async () => {
            await radioButton('Red').select();
            await expect(radioButton('Red').isSelected()).resolves.toBeTruthy();
        });
    });

    describe('wrapped in label', () => {
        let filePath;
        beforeAll(async () => {
            let innerHtml = '<form>' +
                '<label>' +
                '<input name="color" type="radio" value="red" checked />' +
                '<span>Red</span>' +
                '</label>' +
                '<label>' +
                '<input name="color" type="radio" value="yellow" />' +
                '<span>Yellow</span>' +
                '</label>' +
                '<label>' +
                '<input name="color" type="radio" value="green" />' +
                '<span>Green</span>' +
                '</label>' +
                '</form>';
            filePath = createHtml(innerHtml, 'radioButton');
        });

        afterAll(async () => {
            removeFile(filePath);
        });

        beforeEach(async () =>{
            await goto(filePath);
        });

        test('test exists()', async () => {
            await expect(radioButton('Green').exists()).resolves.toBeTruthy();
            await expect(radioButton('Brown').exists(intervalSecs(0), timeoutSecs(0))).resolves.toBeFalsy();
        });
    });

    describe('using label for', () => {
        let filePath;
        beforeAll(async () => {
            let innerHtml = '<form>' +
                '<p>' +
                '<input id="c1" name="color" type="radio" value="red" checked />' +
                '<label for="c1">Red</label>' +
                '</p>' +
                '<p>' +
                '<label for="c2">Yellow</label>' +
                '<input id="c2" name="color" type="radio" value="yellow" />' +
                '</p>' +
                '<p>' +
                '<label for="c3"><input id="c3" name="color" type="radio" value="green" />Green</label>' +
                '</p>' +
                '</form>';
            filePath = createHtml(innerHtml, 'radioButton');
        });

        afterAll(async () => {
            removeFile(filePath);
        });

        beforeEach(async () =>{
            await goto(filePath);
        });

        test('test exists()', async () => {
            await expect(radioButton('Red').exists()).resolves.toBeTruthy();
            await expect(radioButton('Yellow').exists()).resolves.toBeTruthy();
            await expect(radioButton('Green').exists()).resolves.toBeTruthy();
            await expect(radioButton('Brown').exists(intervalSecs(0), timeoutSecs(0))).resolves.toBeFalsy();
        });
    });
});
