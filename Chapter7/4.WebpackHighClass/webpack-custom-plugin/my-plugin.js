// 플러그인은 클래스로 정의
class MyPlugin {
    // 설정 파일에서 입력한 옵션이 생성자의 매개변수로 설정 - showSize 옵션 처리
    constructor(options) {
        this.options = options;
    }
    // apply 메서드에서는 웹팩의 각 처리 단계에서 호출될 콜백 함수 등록
    apply(compiler) {
        // 웹팩 실행이 완료 되었을 때 호출되는 콜백 함수 등록
        compiler.hooks.done.tap('MyPlugin', () => {
            console.log('bundling completed');
        });
        // 웹팩이 결과 파일을 생성하기 직전에 호출되는 콜백 함수 등록
        compiler.hooks.emit.tap('MyPlugin', compilation => {
            let result = '';
            // compilation.assets 에는 웹팩이 생성할 파일의 목록이 들어있음
            for (const filename in compilation.assets) {
                if (this.options.showSize) {
                    const size = compilation.assets[filename].size();
                    result += `${filename}(${size})\n`;
                } else {
                    result += `${filename}\n`;
                }
            }
            // fileList.txt 파일이 생성되도록 설정
            compilation.assets['fileList.txt'] = {
                source: function() {
                    return result;
                },
                size: function() {
                    return result.length;
                }
            }
        })
    }
}

module.exports = MyPlugin;